// sketch.mjs: the sketch rows of spec Table 13 on the synthetic strokes, and the scene-pass scenarios.
// Part 1 (recogniser + scene pass on app/tests/data/sketch_synth.json, written by training/worlds/scene/synth_strokes.py):
//   symbols (kind of every drawn symbol, grouping included), connectors (source and target; arrows ordered, lines unordered),
//   containment (parent of every component), planted unknowns reported, whole-circuit precision and recall.
//   Reported on the TEST split against the criteria 0.95 / 0.97 / 0.95 (written in the specification before this suite existed); the
//   thresholds of the recogniser were set on the TUNE split only (training/worlds/scene/tune_recogniser.mjs), which is printed
//   separately and labelled as such. A missed criterion is printed as MISS with its number; it does not fail the suite.
// Part 2: scripted scene-pass scenarios (strokes drawn here from ideal geometry) with the expected result; a failed scenario is an error.
// Exit code: 0 when the suite ran, 1 on an error (an exception or a failed scenario).
// Usage: node app/tests/sketch.mjs [--verbose] [--tune-only]   (--tune-only: while adjusting thresholds, never look at the test split)
import { readFileSync } from "node:fs";
import { fromDeltas } from "../src/sketch/strokes.js";
import { recognise, CLOSED_KINDS } from "../src/sketch/recognise.js";
import { scenePass, toCircuit, applyToScene } from "../src/sketch/scene_pass.js";
import { createScene } from "../src/editor/scene.js";
import { createPad } from "../src/sketch/pad.js";

const verbose = process.argv.includes("--verbose");
const CRIT = { symbols: 0.95, connectors: 0.97, containment: 0.95, unknowns: 1.0 };
const key = (a) => [...a].sort((x, y) => x - y).join(",");
const jacc = (a, b) => { const A = new Set(a), B = new Set(b); let i = 0; for (const x of A) if (B.has(x)) i++; return i / (A.size + B.size - i || 1); };
const WORD = { rectangle: "box", rounded_rectangle: "start", ellipse: "ellipse", diamond: "decision", cylinder: "database", triangle: "triangle" };

function evaluate(scenes) {
  const m = { sym: [0, 0], byKind: {}, conn: [0, 0], cont: [0, 0], member: { tp: 0, fp: 0, fn: 0 }, unk: [0, 0], falseUnknown: 0, facts: { tp: 0, fp: 0, fn: 0 }, del: [0, 0], label: [0, 0], ms: 0 };
  const misses = [];
  for (const sc of scenes) {
    const strokes = sc.strokes.map((s, i) => fromDeltas(s.p, i));
    const t0 = performance.now(); const rec = recognise(strokes); const res = scenePass(rec); m.ms += performance.now() - t0;
    const groupByKey = new Map(rec.groups.map((g) => [key(g.strokes), g]));
    const G = sc.gold;
    // symbols: every gold symbol must be one group with the right kind
    const goldSymbols = [...G.elements.map((e) => ({ kind: e.kind, strokes: e.strokes, id: e.id })), ...G.connectors.map((k) => ({ kind: k.kind, strokes: k.strokes, id: k.id })),
      ...G.marks.map((k) => ({ kind: "scribble", strokes: k.strokes, id: "mark" }))];
    for (const s of goldSymbols) {
      const g = groupByKey.get(key(s.strokes)); const ok = !!g && g.kind === s.kind;
      m.sym[1]++; if (ok) m.sym[0]++; const bk = (m.byKind[s.kind] = m.byKind[s.kind] || [0, 0]); bk[1]++; if (ok) bk[0]++;
      if (!ok) misses.push(`${sc.id} symbol ${s.id} ${s.kind} -> ${g ? g.kind : "grouped as " + rec.groups.filter((x) => x.strokes.some((i) => s.strokes.includes(i))).map((x) => `[${x.strokes}]`).join(" ")}`);
      if (g && g.kind === "unknown") m.falseUnknown++;
    }
    for (const u of G.unknowns) { m.unk[1]++; const g = groupByKey.get(key(u.strokes)); if (g && g.kind === "unknown") m.unk[0]++; else misses.push(`${sc.id} unknown ${u.kind} -> ${g ? g.kind : "split"}`); }
    // map result components to gold elements by strokes
    const toGold = new Map();
    for (const c of res.components) {
      let best = null, bj = 0; for (const e of G.elements) { const j = jacc(c.strokes, e.strokes); if (j > bj) { bj = j; best = e; } }
      if (best && bj >= 0.5) toGold.set(c.tmp, best.id);
    }
    // connectors
    for (const k of G.connectors) {
      m.conn[1]++;
      const c = res.connectors.find((x) => key(x.strokes) === key(k.strokes));
      const s = c && toGold.get(c.source), t = c && toGold.get(c.target);
      const ok = !!c && (k.kind === "arrow" ? s === k.source && t === k.target && c.kind === "arrow" : c.kind === "line" && ((s === k.source && t === k.target) || (s === k.target && t === k.source)));
      if (ok) m.conn[0]++; else misses.push(`${sc.id} connector ${k.id} ${k.kind} ${k.source}->${k.target} got ${c ? `${c.kind} ${s}->${t}` : "none"}`);
    }
    // containment: parent of every gold component that is not deleted (containers included, they have no parent here)
    const goldParent = new Map(G.elements.filter((e) => !e.deleted).map((e) => [e.id, e.parent]));
    const predParent = new Map();
    for (const c of res.components) { const gid = toGold.get(c.tmp); if (gid) predParent.set(gid, c.parent ? toGold.get(c.parent) || "?" : null); }
    for (const [gid, gp] of goldParent) {
      m.cont[1]++; const pp = predParent.has(gid) ? predParent.get(gid) : "missing"; if (pp === gp) m.cont[0]++; else misses.push(`${sc.id} parent of ${gid}: gold ${gp} got ${pp}`);
      if (gp && pp === gp) m.member.tp++; else { if (gp) m.member.fn++; if (pp && pp !== "missing") m.member.fp++; }
    }
    // marks: deletions and labels
    for (const mk of G.marks) {
      if (mk.role === "delete") { m.del[1]++; if (res.deletions.components.some((d) => toGoldStrokes(d, G) === mk.of)) m.del[0]++; else misses.push(`${sc.id} delete of ${mk.of} missed`); }
      if (mk.role === "label") { m.label[1]++; const c = res.components.find((x) => toGold.get(x.tmp) === mk.of); if (c && c.labelMark) m.label[0]++; else misses.push(`${sc.id} label mark of ${mk.of} missed`); }
    }
    // whole circuit: facts
    const gold = new Set(), pred = new Set();
    for (const e of G.elements) if (!e.deleted) gold.add(`create ${e.id} ${e.container ? "container" : WORD[e.kind]}`);
    for (const k of G.connectors) gold.add(k.kind === "arrow" ? `connect ${k.source}>${k.target} arrow` : `connect ${[k.source, k.target].sort().join("-")} line`);
    for (const e of G.elements) if (e.parent && !e.deleted) gold.add(`member ${e.id} ${e.parent}`);
    for (const mk of G.marks) if (mk.role === "delete") gold.add(`delete ${mk.of}`);
    for (const mk of G.marks) if (mk.role === "text") gold.add(`text ${key(mk.strokes)}`);
    for (const u of G.unknowns) gold.add(`sketch ${key(u.strokes)}`);
    const gid = (t) => toGold.get(t) || `?${t}`;
    for (const c of res.components) {
      if (c.kind === "text") pred.add(`text ${key(c.strokes)}`); else if (c.kind === "sketch") pred.add(`sketch ${key(c.strokes)}`);
      else pred.add(`create ${gid(c.tmp)} ${c.word}`);
      if (c.parent) pred.add(`member ${gid(c.tmp)} ${gid(c.parent)}`);
    }
    for (const k of res.connectors) pred.add(k.kind === "arrow" ? `connect ${gid(k.source)}>${gid(k.target)} arrow` : `connect ${[gid(k.source), gid(k.target)].sort().join("-")} line`);
    for (const d of res.deletions.components) pred.add(`delete ${toGoldStrokes(d, G) || "?"}`);
    for (const f of pred) { if (gold.has(f)) m.facts.tp++; else m.facts.fp++; }
    for (const f of gold) if (!pred.has(f)) m.facts.fn++;
  }
  return { m, misses };
}
function toGoldStrokes(d, G) {
  // a deleted component is identified by the strokes of the deleted shape group: the group id is its tmp; find the gold element whose
  // strokes the recogniser grouped under that tmp (the scene pass keeps them on the deletion through the scribble's target)
  return d._gold || (d._gold = (G.elements.find((e) => e.deleted && G.marks.some((mk) => mk.role === "delete" && mk.of === e.id && key(mk.strokes) === key(d.strokes))) || {}).id);
}

const pct = (a) => (a[1] ? a[0] / a[1] : NaN);
const f3 = (x) => (Number.isFinite(x) ? x.toFixed(3) : "n/a");
const verdict = (v, c) => (v >= c ? "PASS" : "MISS");
let errors = 0;
try {
  const data = JSON.parse(readFileSync(new URL("./data/sketch_synth.json", import.meta.url)));
  for (const split of process.argv.includes("--tune-only") ? ["tune"] : ["tune", "test"]) {
    const scenes = data.splits[split]; const { m, misses } = evaluate(scenes);
    const sym = pct(m.sym), con = pct(m.conn), cnt = pct(m.cont), unk = pct(m.unk);
    const P = m.facts.tp / Math.max(1, m.facts.tp + m.facts.fp), R = m.facts.tp / Math.max(1, m.facts.tp + m.facts.fn);
    const mp = m.member.tp / Math.max(1, m.member.tp + m.member.fp), mr = m.member.tp / Math.max(1, m.member.tp + m.member.fn);
    const label = split === "test" ? "MEASURED (synthetic, test split; the criteria apply here)" : "tuning split (thresholds were set on it; not a result)";
    console.log(`sketch [${split}] ${label}: ${scenes.length} scenes, ${(m.ms / scenes.length).toFixed(1)} ms per scene`);
    console.log(`  symbols      ${f3(sym)} (${m.sym[0]}/${m.sym[1]})  criterion >= ${CRIT.symbols}${split === "test" ? " " + verdict(sym, CRIT.symbols) : ""}`);
    console.log(`               by kind: ${Object.keys(m.byKind).sort().map((k) => `${k} ${f3(pct(m.byKind[k]))} (${m.byKind[k][1]})`).join(", ")}`);
    console.log(`  connectors   ${f3(con)} (${m.conn[0]}/${m.conn[1]})  criterion >= ${CRIT.connectors}${split === "test" ? " " + verdict(con, CRIT.connectors) : ""}`);
    console.log(`  containment  ${f3(cnt)} (${m.cont[0]}/${m.cont[1]}; member pairs precision ${f3(mp)} recall ${f3(mr)})  criterion >= ${CRIT.containment}${split === "test" ? " " + verdict(cnt, CRIT.containment) : ""}`);
    console.log(`  unknowns     ${f3(unk)} (${m.unk[0]}/${m.unk[1]} planted unknowns reported; ${m.falseUnknown} known symbols reported as unknown)  criterion 100%${split === "test" ? " " + verdict(unk, CRIT.unknowns) : ""}`);
    console.log(`  marks        delete ${m.del[0]}/${m.del[1]}, label ${m.label[0]}/${m.label[1]}`);
    console.log(`  circuit      precision ${f3(P)} recall ${f3(R)} (facts: create, connect, member, delete, text, sketch)  reported`);
    if (verbose || split === "test") for (const x of misses.slice(0, verbose ? 200 : 12)) console.log(`    miss: ${x}`);
    if (!verbose && misses.length > 12 && split === "test") console.log(`    ... ${misses.length - 12} more (--verbose)`);
  }
} catch (e) { errors++; console.log(`sketch: ERROR in the synthetic evaluation: ${e.stack}`); }

// ------------------------------------------------------------------ part 2: scenarios
let pass = 0, fail = 0; const failures = [];
const check = (name, cond, detail = "") => { if (cond) pass++; else { fail++; failures.push(`${name}: ${detail}`); } };
let T = 0, SID = 0;
function stroke(poly, step = 3) {
  const pts = []; T += 400;
  for (let k = 0; k + 1 < poly.length; k++) {
    const [a, b] = [poly[k], poly[k + 1]]; const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let i = 0; i < n; i++) { pts.push({ x: a[0] + (b[0] - a[0]) * i / n, y: a[1] + (b[1] - a[1]) * i / n, t: T }); T += 4; }
  }
  const l = poly[poly.length - 1]; pts.push({ x: l[0], y: l[1], t: T });
  return { id: SID++, points: pts };
}
const rect = (x, y, w, h) => stroke([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y + 4]]);
const ellipse = (cx, cy, rx, ry) => stroke(Array.from({ length: 65 }, (_, i) => [cx + rx * Math.cos(i * Math.PI / 32), cy + ry * Math.sin(i * Math.PI / 32)]));
const diamond = (x, y, w, h) => stroke([[x + w / 2, y], [x + w, y + h / 2], [x + w / 2, y + h], [x, y + h / 2], [x + w / 2 + 3, y + 2]]);
const arrow = (a, b) => {
  const s = stroke([a, b]); const L = Math.hypot(b[0] - a[0], b[1] - a[1]); const ux = (a[0] - b[0]) / L, uy = (a[1] - b[1]) / L; const r = (ang) => [b[0] + 16 * (ux * Math.cos(ang) - uy * Math.sin(ang)), b[1] + 16 * (ux * Math.sin(ang) + uy * Math.cos(ang))];
  return [s, stroke([r(0.5), b, r(-0.5)], 1.5)];
};
const zig = (x, y, w, h, n = 4) => stroke(Array.from({ length: n + 1 }, (_, i) => [x + (i % 2 ? w : 0), y + h * i / n]), 2);
const run = (strokes, opts) => { const rec = recognise(strokes); return { rec, res: scenePass(rec, opts) }; };
const comp = (res, word) => res.components.filter((c) => c.word === word);

try {
  { // 1. two boxes and an arrow: two components, one arrow from the left box to the right box; circuit and scene application
    SID = 0; const S = [rect(100, 100, 140, 70), rect(400, 100, 140, 70), ...arrow([244, 135], [396, 135])];
    const { rec, res } = run(S);
    check("1 kinds", rec.groups.map((g) => g.kind).join() === "rectangle,rectangle,arrow", rec.groups.map((g) => g.kind).join());
    const [a, b] = comp(res, "box").sort((p, q) => p.box.x - q.box.x);
    check("1 connector", res.connectors.length === 1 && res.connectors[0].source === a.tmp && res.connectors[0].target === b.tmp && res.connectors[0].kind === "arrow", JSON.stringify(res.connectors));
    check("1 aligned row", a.box.y + a.box.h / 2 === b.box.y + b.box.h / 2 && a.box.x % 10 === 0, JSON.stringify([a.box, b.box]));
    const circ = toCircuit(res);
    check("1 circuit", /@w\d+ create/.test(circ) && /head=box/.test(circ) && /@w\d+ connect/.test(circ) && /head=arrow/.test(circ), circ);
    const sc = createScene(); const { map } = applyToScene(sc, res);
    const e = [...sc.connectors.values()][0];
    check("1 apply", sc.components.size === 2 && e && e.source === map.get(a.tmp) && e.target === map.get(b.tmp) && sc.undo.length === 1, JSON.stringify([...sc.components.keys()]));
  }
  { // 2. a scribble over a box deletes it, and its connector is not created
    SID = 0; const S = [rect(100, 100, 140, 70), rect(400, 100, 140, 70), ...arrow([244, 135], [396, 135]), zig(95, 95, 150, 80, 8)];
    const { res } = run(S);
    check("2 delete", comp(res, "box").length === 1 && res.deletions.components.length === 1 && res.connectors.length === 0, JSON.stringify({ c: res.components.map((c) => c.word), d: res.deletions, k: res.connectors.length, q: res.questions }));
  }
  { // 3. a small zigzag inside a box is a label area: empty label, a mark and a question
    SID = 0; const S = [rect(100, 100, 160, 80), zig(150, 132, 60, 14, 3)];
    const { res } = run(S);
    const b = comp(res, "box")[0];
    check("3 label mark", res.components.length === 1 && b && b.labelMark && b.label === null && res.questions.some((q) => q.kind === "label"), JSON.stringify(res.components));
  }
  { // 4. a container around two shapes: parent links; the container is dashed
    SID = 0; const S = [rect(100, 100, 120, 60), ellipse(400, 130, 60, 35), rect(60, 50, 440, 160)];
    const { res } = run(S);
    const g = res.components.find((c) => c.kind === "container");
    check("4 container", g && res.components.filter((c) => c.parent === g.tmp).length === 2 && g.style === "dashed", JSON.stringify(res.components.map((c) => [c.word, c.parent])));
    const sc = createScene(); applyToScene(sc, res);
    const gid = [...sc.components.values()].find((c) => c.kind === "container").id;
    check("4 apply parents", [...sc.components.values()].filter((c) => c.parent === gid).length === 2, "");
  }
  { // 5. an arrow that ends near nothing: a question, no connector
    SID = 0; const S = [rect(100, 100, 120, 60), ...arrow([224, 130], [600, 400])];
    const { res } = run(S);
    check("5 dangling", res.connectors.length === 0 && res.questions.some((q) => q.kind === "dangling"), JSON.stringify(res.questions));
  }
  { // 6. drawing next to a clean diagram: a new box connected to an existing component, in place
    const sc = createScene(); sc.components.set("c1", { id: "c1", word: "database", kind: "data", label: "Orders", box: { x: 500, y: 300, w: 130, h: 60 }, parent: null, order: 1 }); sc.counter = 1;
    SID = 0; const S = [rect(150, 300, 130, 60), ...arrow([284, 330], [496, 330])];
    const { res } = run(S, { scene: sc });
    check("6 to existing", res.connectors.length === 1 && res.connectors[0].target === "c1", JSON.stringify(res.connectors));
    applyToScene(sc, res);
    check("6 apply", sc.components.size === 2 && [...sc.connectors.values()][0].target === "c1", JSON.stringify([...sc.connectors.values()]));
  }
  { // 7. deterministic: the same strokes give the same result
    SID = 0; const S = [rect(100, 100, 140, 70), diamond(400, 80, 120, 110), ...arrow([244, 135], [396, 135])];
    const a = JSON.stringify(run(S).res), b = JSON.stringify(run(S).res);
    check("7 deterministic", a === b, "two runs differ");
    check("7 decision", run(S).res.components.some((c) => c.word === "decision"), "");
  }
  { // 8. ambiguity held open: a shape whose two best kinds are close keeps both readings and asks
    const rec = { groups: [{ id: "s1", kind: "rectangle", strokes: [0], box: { x: 100, y: 100, w: 120, h: 60 }, margin: 0.06, candidates: [{ kind: "rectangle", score: 0.53 }, { kind: "rounded_rectangle", score: 0.47 }] }] };
    const res = scenePass(rec);
    check("8 ambiguity", res.components[0].alternatives?.length === 2 && res.questions.some((q) => q.kind === "which-shape"), JSON.stringify(res.questions));
  }
  { // 9. an unknown blob (a five-point star) is kept as a sketch with a question, never dropped or guessed
    SID = 0; const pts = Array.from({ length: 11 }, (_, i) => { const r = i % 2 ? 22 : 55; return [300 + r * Math.sin(i * Math.PI / 5), 300 - r * Math.cos(i * Math.PI / 5)]; });
    const { res } = run([stroke(pts, 2)]);
    check("9 unknown", res.components.length === 1 && res.components[0].kind === "sketch" && res.questions.some((q) => q.kind === "unknown"), JSON.stringify(res.components.map((c) => c.kind)));
  }
  { // 10. rows: three boxes drawn at slightly different heights are aligned; a flow hint from the arrows
    SID = 0; const S = [rect(100, 100, 120, 60), rect(320, 108, 120, 60), rect(540, 95, 120, 60), ...arrow([224, 133], [316, 136]), ...arrow([444, 136], [536, 127])];
    const { res } = run(S);
    const ys = comp(res, "box").map((c) => c.box.y + c.box.h / 2);
    check("10 aligned", ys.length === 3 && ys.every((y) => y === ys[0]), JSON.stringify(ys));
    check("10 hint", res.layoutHint === "flow_lr", String(res.layoutHint));
  }
  { // 11. a scribble on its own is a text placeholder
    SID = 0; const { res } = run([rect(100, 100, 120, 60), zig(400, 300, 90, 20, 4)]);
    check("11 text", res.components.some((c) => c.kind === "text" && c.labelMark), JSON.stringify(res.components.map((c) => c.kind)));
  }
  { // 12. a box drawn as four separate strokes is one rectangle; a cylinder drawn as ellipse then U is one cylinder
    SID = 0; const S = [stroke([[100, 100], [240, 102]]), stroke([[242, 98], [240, 170]]), stroke([[243, 172], [100, 170]]), stroke([[98, 172], [101, 97]]),
      ellipse(450, 120, 60, 14), stroke([[390, 120], [390, 200], ...Array.from({ length: 17 }, (_, i) => [450 - 60 * Math.cos(i * Math.PI / 16), 200 + 14 * Math.sin(i * Math.PI / 16)]), [510, 120]])];
    const { rec } = run(S);
    check("12 multi-stroke", rec.groups.map((g) => g.kind).join() === "rectangle,cylinder", rec.groups.map((g) => `${g.kind}[${g.strokes}]`).join(" "));
  }
  { // 13. pad: mouse strokes with timestamps; right button ignored; export round-trips through the synthetic format
    const pad = createPad();
    pad.down({ pointerId: 1, pointerType: "mouse", x: 10, y: 10, t: 0, button: 0 }); pad.move({ pointerId: 1, pointerType: "mouse", x: 10.4, y: 10, t: 5 });
    pad.move({ pointerId: 1, pointerType: "mouse", x: 30, y: 12, t: 16 }); pad.up({ pointerId: 1, pointerType: "mouse", x: 50, y: 14, t: 33 });
    check("13 right button", pad.down({ pointerId: 2, pointerType: "mouse", x: 0, y: 0, t: 40, button: 2 }) === false, "");
    const s = pad.strokes();
    check("13 mouse stroke", s.length === 1 && s[0].points.length === 3 && s[0].points[2].t === 33, JSON.stringify(s));
    const back = fromDeltas(pad.export()[0].p, 0).points.map((q) => [q.x, q.y, q.t]);
    check("13 export", JSON.stringify(back) === JSON.stringify([[10, 10, 0], [30, 12, 16], [50, 14, 33]]), JSON.stringify(back));
  }
  { // 14. pad: palm rejection while a pen draws; two fingers navigate instead of drawing
    const pad = createPad();
    pad.down({ pointerId: 5, pointerType: "touch", x: 300, y: 300, t: 0 });                 // the palm lands first
    pad.down({ pointerId: 1, pointerType: "pen", x: 10, y: 10, t: 5 });                     // the pen discards the palm's stroke
    pad.down({ pointerId: 6, pointerType: "touch", x: 320, y: 300, t: 8 });                 // ignored while the pen is down
    pad.move({ pointerId: 1, pointerType: "pen", x: 40, y: 10, t: 20 }); pad.up({ pointerId: 1, pointerType: "pen", x: 60, y: 10, t: 30 });
    pad.up({ pointerId: 5, pointerType: "touch", t: 31 }); pad.up({ pointerId: 6, pointerType: "touch", t: 32 });
    check("14 palm", pad.strokes().length === 1 && pad.strokes()[0].pointerType === "pen", JSON.stringify(pad.strokes().map((x) => x.pointerType)));
    const p2 = createPad(); let nav = 0; p2.on((t) => { if (t === "navigate") nav++; });
    p2.down({ pointerId: 1, pointerType: "touch", x: 0, y: 0, t: 0 }); p2.move({ pointerId: 1, pointerType: "touch", x: 5, y: 0, t: 10 });
    p2.down({ pointerId: 2, pointerType: "touch", x: 100, y: 0, t: 12 }); p2.up({ pointerId: 1, pointerType: "touch", t: 40 }); p2.up({ pointerId: 2, pointerType: "touch", t: 41 });
    check("14 two fingers", p2.strokes().length === 0 && nav === 1, JSON.stringify(p2.strokes()));
    p2.down({ pointerId: 3, pointerType: "touch", x: 0, y: 0, t: 2000 }); p2.up({ pointerId: 3, pointerType: "touch", x: 0, y: 0, t: 2010 });
    check("14 dot after navigation", p2.strokes().length === 1 && p2.strokes()[0].points.length === 2, JSON.stringify(p2.strokes()));
  }
} catch (e) { errors++; console.log(`sketch: ERROR in the scenarios: ${e.stack}`); }
console.log(`sketch scenarios: ${pass} pass, ${fail} fail`);
for (const f of failures) console.log(`  FAIL ${f}`);
if (errors || fail) { console.log("sketch: ERROR"); process.exit(1); }
console.log("sketch: suite ran (numbers above; MISS marks a criterion not met on the test split)");
