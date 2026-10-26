// sketch_fpe.mjs: the end-to-end sketch row (responses D18, Q11): the SAME synthetic strokes (app/tests/data/sketch_synth.json) read by
//   recogniser -> scene_pass (rules)   and   recogniser -> scene_fpe (FPE relations, D 1024, declines above 16 components),
// the existing metrics of sketch.mjs for each (the metric code is the same as sketch.mjs's, its rules numbers must equal that file's
// output), and the LIST of every place where the two passes disagree: scene, element or connector end, what each said, the gold.
// The symbol step is the recogniser in both columns (classical), so symbols and planted unknowns are the same by construction; the two
// passes differ in containment (parents) and connector attachment only. A missed criterion is printed as MISS and does not fail the suite.
// Usage: node app/tests/sketch_fpe.mjs [--tune] [--D 4096] [--limit N]   (the test split by default; --tune adds the tuning split, labelled)
import { readFileSync } from "node:fs";
import { fromDeltas } from "../src/sketch/strokes.js";
import { recognise } from "../src/sketch/recognise.js";
import { scenePass } from "../src/sketch/scene_pass.js";
import { sceneFpe } from "../src/sketch/scene_fpe.js";
import { buildSketchRows } from "../src/ui/sketchrows.js";

const arg = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d; };
const D = +arg("--D", 1024), LIMIT = +arg("--limit", 1e9);
const CRIT = { symbols: 0.95, connectors: 0.97, containment: 0.95, unknowns: 1.0 };
const key = (a) => [...a].sort((x, y) => x - y).join(",");
const jacc = (a, b) => { const A = new Set(a), B = new Set(b); let i = 0; for (const x of A) if (B.has(x)) i++; return i / (A.size + B.size - i || 1); };
const WORD = { rectangle: "box", rounded_rectangle: "start", ellipse: "ellipse", diamond: "decision", cylinder: "database", triangle: "triangle" };
function toGoldStrokes(d, G) { return d._gold || (d._gold = (G.elements.find((e) => e.deleted && G.marks.some((mk) => mk.role === "delete" && mk.of === e.id && key(mk.strokes) === key(d.strokes))) || {}).id); }

/** the metrics of sketch.mjs for ONE scene and ONE pass result, added to m; returns the per-element and per-connector decisions for the comparison */
function score(sc, rec, res, m, misses) {
  const groupByKey = new Map(rec.groups.map((g) => [key(g.strokes), g])); const G = sc.gold;
  const goldSymbols = [...G.elements.map((e) => ({ kind: e.kind, strokes: e.strokes, id: e.id })), ...G.connectors.map((k) => ({ kind: k.kind, strokes: k.strokes, id: k.id })), ...G.marks.map((k) => ({ kind: "scribble", strokes: k.strokes, id: "mark" }))];
  for (const s of goldSymbols) {
    const g = groupByKey.get(key(s.strokes)); const ok = !!g && g.kind === s.kind;
    m.sym[1]++; if (ok) m.sym[0]++; const bk = (m.byKind[s.kind] = m.byKind[s.kind] || [0, 0]); bk[1]++; if (ok) bk[0]++;
    if (g && g.kind === "unknown") m.falseUnknown++;
  }
  for (const u of G.unknowns) { m.unk[1]++; const g = groupByKey.get(key(u.strokes)); if (g && g.kind === "unknown") m.unk[0]++; else misses.push(`${sc.id} unknown ${u.kind} -> ${g ? g.kind : "split"}`); }
  const toGold = new Map();
  for (const c of res.components) { let best = null, bj = 0; for (const e of G.elements) { const j = jacc(c.strokes, e.strokes); if (j > bj) { bj = j; best = e; } } if (best && bj >= 0.5) toGold.set(c.tmp, best.id); }
  const conn = new Map();
  for (const k of G.connectors) {
    m.conn[1]++;
    const c = res.connectors.find((x) => key(x.strokes) === key(k.strokes));
    const s = c && toGold.get(c.source), t = c && toGold.get(c.target);
    const ok = !!c && (k.kind === "arrow" ? s === k.source && t === k.target && c.kind === "arrow" : c.kind === "line" && ((s === k.source && t === k.target) || (s === k.target && t === k.source)));
    if (ok) m.conn[0]++; else misses.push(`${sc.id} connector ${k.id} ${k.kind} ${k.source}->${k.target} got ${c ? `${c.kind} ${s}->${t}` : "none"}`);
    conn.set(k.id, { got: c ? `${c.kind} ${s}->${t}` : "none", ok, c });
  }
  const goldParent = new Map(G.elements.filter((e) => !e.deleted).map((e) => [e.id, e.parent])); const predParent = new Map();
  for (const c of res.components) { const gid = toGold.get(c.tmp); if (gid) predParent.set(gid, c.parent ? toGold.get(c.parent) || "?" : null); }
  const par = new Map();
  for (const [gid, gp] of goldParent) {
    m.cont[1]++; const pp = predParent.has(gid) ? predParent.get(gid) : "missing"; if (pp === gp) m.cont[0]++; else misses.push(`${sc.id} parent of ${gid}: gold ${gp} got ${pp}`);
    if (gp && pp === gp) m.member.tp++; else { if (gp) m.member.fn++; if (pp && pp !== "missing") m.member.fp++; }
    par.set(gid, { got: pp, ok: pp === gp });
  }
  for (const mk of G.marks) {
    if (mk.role === "delete") { m.del[1]++; if (res.deletions.components.some((d) => toGoldStrokes(d, G) === mk.of)) m.del[0]++; }
    if (mk.role === "label") { m.label[1]++; const c = res.components.find((x) => toGold.get(x.tmp) === mk.of); if (c && c.labelMark) m.label[0]++; }
  }
  const gold = new Set(), pred = new Set();
  for (const e of G.elements) if (!e.deleted) gold.add(`create ${e.id} ${e.container ? "container" : WORD[e.kind]}`);
  for (const k of G.connectors) gold.add(k.kind === "arrow" ? `connect ${k.source}>${k.target} arrow` : `connect ${[k.source, k.target].sort().join("-")} line`);
  for (const e of G.elements) if (e.parent && !e.deleted) gold.add(`member ${e.id} ${e.parent}`);
  for (const mk of G.marks) if (mk.role === "delete") gold.add(`delete ${mk.of}`);
  for (const mk of G.marks) if (mk.role === "text") gold.add(`text ${key(mk.strokes)}`);
  for (const u of G.unknowns) gold.add(`sketch ${key(u.strokes)}`);
  const gid = (t) => toGold.get(t) || `?${t}`;
  for (const c of res.components) {
    if (c.kind === "text") pred.add(`text ${key(c.strokes)}`); else if (c.kind === "sketch") pred.add(`sketch ${key(c.strokes)}`); else pred.add(`create ${gid(c.tmp)} ${c.word}`);
    if (c.parent) pred.add(`member ${gid(c.tmp)} ${gid(c.parent)}`);
  }
  for (const k of res.connectors) pred.add(k.kind === "arrow" ? `connect ${gid(k.source)}>${gid(k.target)} arrow` : `connect ${[gid(k.source), gid(k.target)].sort().join("-")} line`);
  for (const d of res.deletions.components) pred.add(`delete ${toGoldStrokes(d, G) || "?"}`);
  for (const f of pred) { if (gold.has(f)) m.facts.tp++; else m.facts.fp++; }
  for (const f of gold) if (!pred.has(f)) m.facts.fn++;
  return { conn, par, toGold };
}

const newM = () => ({ sym: [0, 0], byKind: {}, conn: [0, 0], cont: [0, 0], member: { tp: 0, fp: 0, fn: 0 }, unk: [0, 0], falseUnknown: 0, facts: { tp: 0, fp: 0, fn: 0 }, del: [0, 0], label: [0, 0], ms: 0 });
const pct = (a) => (a[1] ? a[0] / a[1] : NaN);
const f3 = (x) => (Number.isFinite(x) ? x.toFixed(3) : "n/a");
const verdict = (v, c) => (v >= c ? "PASS" : "MISS");
function report(name, m, scenes, split) {
  const sym = pct(m.sym), con = pct(m.conn), cnt = pct(m.cont), unk = pct(m.unk);
  const P = m.facts.tp / Math.max(1, m.facts.tp + m.facts.fp), R = m.facts.tp / Math.max(1, m.facts.tp + m.facts.fn);
  const mp = m.member.tp / Math.max(1, m.member.tp + m.member.fp), mr = m.member.tp / Math.max(1, m.member.tp + m.member.fn); const v = split === "test";
  console.log(`  [${name}] ${(m.ms / scenes.length).toFixed(1)} ms per scene (scene pass only)`);
  console.log(`    symbols      ${f3(sym)} (${m.sym[0]}/${m.sym[1]})  criterion >= ${CRIT.symbols}${v ? " " + verdict(sym, CRIT.symbols) : ""}`);
  console.log(`    connectors   ${f3(con)} (${m.conn[0]}/${m.conn[1]})  criterion >= ${CRIT.connectors}${v ? " " + verdict(con, CRIT.connectors) : ""}`);
  console.log(`    containment  ${f3(cnt)} (${m.cont[0]}/${m.cont[1]}; member pairs precision ${f3(mp)} recall ${f3(mr)})  criterion >= ${CRIT.containment}${v ? " " + verdict(cnt, CRIT.containment) : ""}`);
  console.log(`    unknowns     ${f3(unk)} (${m.unk[0]}/${m.unk[1]} planted unknowns reported; ${m.falseUnknown} known symbols reported as unknown)  criterion 100%${v ? " " + verdict(unk, CRIT.unknowns) : ""}`);
  console.log(`    marks        delete ${m.del[0]}/${m.del[1]}, label ${m.label[0]}/${m.label[1]}`);
  console.log(`    circuit      precision ${f3(P)} recall ${f3(R)} (facts: create, connect, member, delete, text, sketch)  reported`);
}

let errors = 0;
try {
  const data = JSON.parse(readFileSync(new URL("./data/sketch_synth.json", import.meta.url)));
  for (const split of process.argv.includes("--tune") ? ["tune", "test"] : ["test"]) {
    const scenes = data.splits[split].slice(0, LIMIT), mR = newM(), mF = newM(), missR = [], missF = [], diffs = [], declined = [];
    const tally = { both: 0, fpeOnly: 0, rulesOnly: 0, neither: 0 }; let items = 0; const ends = { fpe: 0, differs: 0, fallback: 0, minMargin: Infinity };
    for (const sc of scenes) {
      const rec = recognise(sc.strokes.map((s, i) => fromDeltas(s.p, i)));
      let t0 = performance.now(); const resR = scenePass(rec); mR.ms += performance.now() - t0;
      t0 = performance.now(); const resF = sceneFpe(rec, { D }); mF.ms += performance.now() - t0;
      if (!/^VSS/.test(resF.active)) declined.push(`${sc.id}: ${resF.active}`);
      for (const k of resF.connectors) for (const e of k.fpe ? [k.fpe.source, k.fpe.target] : []) { if (e.fallback) ends.fallback++; else { ends.fpe++; if (!e.agrees) ends.differs++; ends.minMargin = Math.min(ends.minMargin, e.margin); } }
      const R = score(sc, rec, resR, mR, missR), F = score(sc, rec, resF, mF, missF);
      const G = sc.gold, goldEl = new Map(G.elements.map((e) => [e.id, e]));
      for (const [gid, r] of R.par) {
        const f = F.par.get(gid), e = goldEl.get(gid); items++; tally[r.ok && f.ok ? "both" : f.ok ? "fpeOnly" : r.ok ? "rulesOnly" : "neither"]++;
        if (r.got !== f.got) diffs.push(`${sc.id} parent of ${gid} (${e.kind}${e.container ? ", container" : ""}): rules ${r.got}, FPE ${f.got}, gold ${e.parent}`);
      }
      for (const k of G.connectors) {
        const r = R.conn.get(k.id), f = F.conn.get(k.id); items++; tally[r.ok && f.ok ? "both" : f.ok ? "fpeOnly" : r.ok ? "rulesOnly" : "neither"]++;
        if (r.got !== f.got) {
          const x = f.c && f.c.fpe ? f.c.fpe : null, end = (z) => (!z ? "-" : z.fallback ? "outline rule" : `margin ${z.margin.toFixed(3)}`);
          diffs.push(`${sc.id} connector ${k.id} (${k.kind}): rules ${r.got}, FPE ${f.got}, gold ${k.source}->${k.target}${x ? ` [FPE ends: tail ${end(x.source)}, tip ${end(x.target)}]` : ""}`);
        }
      }
    }
    const label = split === "test" ? "MEASURED (synthetic, test split; the criteria apply here)" : "tuning split (the recogniser's thresholds were set on it; not a result)";
    console.log(`sketch end-to-end [${split}] ${label}: ${scenes.length} scenes; recogniser -> scene_pass (rules) against recogniser -> scene_fpe (FPE, D ${D}, declines above ${D === 1024 ? 16 : 64} components)`);
    report("rules", mR, scenes, split); report(`FPE D ${D}`, mF, scenes, split);
    console.log(`  connector ends read by the scene reader: ${ends.fpe} (${ends.differs} where the nearest address is not the nearest outline), ${ends.fallback} fell back to the outline rule (out of tolerance or on a container); smallest margin ${ends.minMargin.toFixed(3)}`);
    console.log(`  FPE declined (rules read): ${declined.length} scene(s)${declined.length ? ": " + declined.join("; ") : ""}`);
    console.log(`  per decision (parents and connectors, ${items}): both right ${tally.both}, FPE only right ${tally.fpeOnly}, rules only right ${tally.rulesOnly}, both wrong ${tally.neither}`);
    console.log(`  disagreements between the two passes (${diffs.length}):`);
    for (const d of diffs) console.log(`    ${d}`);
    if (!diffs.length) console.log("    none");
    const onlyF = missF.filter((x) => !missR.includes(x)), onlyR = missR.filter((x) => !missF.includes(x)), both = missF.filter((x) => missR.includes(x));
    console.log(`  misses against the gold: rules ${missR.length}, FPE ${missF.length} (those both get wrong come from the recogniser's boxes or groups)`);
    console.log(`    common to both (${both.length}):`); for (const x of both) console.log(`      ${x}`);
    console.log(`    rules only (${onlyR.length}):`); for (const x of onlyR) console.log(`      ${x}`);
    console.log(`    FPE only (${onlyF.length}):`); for (const x of onlyF) console.log(`      ${x}`);
  }
} catch (e) { errors++; console.log(`sketch_fpe: ERROR: ${e.stack}`); }
// ------------------------------------------------------------------ part 2: scenarios (hand-built recogniser output; a failed scenario is an error)
let pass = 0, fail = 0; const failures = [];
const check = (name, cond, detail = "") => { if (cond) pass++; else { fail++; failures.push(`${name}: ${detail}`); } };
const shape = (id, kind, x, y, w, h, strokes) => ({ id, kind, strokes, box: { x, y, w, h }, margin: 0.9, candidates: [{ kind, score: 0.9, cost: 1 }, { kind: "ellipse", score: 0.05, cost: 4 }], features: {}, reason: "test" });
const arrowG = (id, tail, tip, strokes) => ({ id, kind: "arrow", strokes, box: { x: Math.min(tail.x, tip.x), y: Math.min(tail.y, tip.y), w: Math.abs(tail.x - tip.x), h: Math.abs(tail.y - tip.y) }, margin: 0.9, candidates: [{ kind: "arrow", score: 0.9, cost: 1 }], ends: { tail, tip, heads: 1 }, path: [tail, tip], features: {}, reason: "test" });
try {
  { // 1. two boxes and an arrow, read by the FPE pass: the same connector as the rules, and the pass says which reader was active
    const rec = { groups: [shape("s1", "rectangle", 100, 100, 140, 70, [0]), shape("s2", "rectangle", 400, 100, 140, 70, [1]), arrowG("s3", { x: 244, y: 135 }, { x: 396, y: 135 }, [2])] };
    const r = sceneFpe(rec), q = scenePass(rec);
    check("1 active", r.active === "VSS scene reader (FPE, D 1024)", r.active);
    check("1 same connector", r.connectors.length === 1 && r.connectors[0].source === q.connectors[0].source && r.connectors[0].target === q.connectors[0].target && !!r.connectors[0].fpe, JSON.stringify(r.connectors[0]?.fpe));
    check("1 deterministic", JSON.stringify(sceneFpe(rec)) === JSON.stringify(r), "two runs differ");
    const mr = buildSketchRows({ rec, res: r });
    check("1 tab names the VSS pass and keeps the classical column marked", /^Active scene pass: VSS scene reader/.test(mr.header) && /NOT VSS/.test(mr.header) && mr.right.find((x) => x.type === "connector").ends[0].fpe.margin > 0, mr.header);
    check("1 D 4096", sceneFpe(rec, { D: 4096 }).active === "VSS scene reader (FPE, D 4096)", sceneFpe(rec, { D: 4096 }).active);
  }
  { // 2. a container around two shapes: parents read from the corners
    const rec = { groups: [shape("s1", "rectangle", 100, 100, 120, 60, [0]), shape("s2", "ellipse", 340, 100, 120, 70, [1]), shape("s3", "rectangle", 60, 50, 440, 160, [2])] };
    const r = sceneFpe(rec), g = r.components.find((c) => c.kind === "container");
    check("2 container", g && g.tmp === "s3" && r.components.filter((c) => c.parent === "s3").length === 2 && g.style === "dashed", JSON.stringify(r.components.map((c) => [c.word, c.parent])));
  }
  { // 3. above 16 components the reader declines: the rules read, and the result says so (4 x 5 grid of 20 boxes)
    const gs = []; for (let i = 0; i < 17; i++) gs.push(shape(`s${i + 1}`, "rectangle", 20 + (i % 6) * 190, 20 + Math.floor(i / 6) * 120, 120, 60, [i]));
    const r = sceneFpe({ groups: gs }), q = scenePass({ groups: gs });
    check("3 declines", r.active === "rule-based pass (FPE declined: 17 elements > 16 measured)", r.active);
    check("3 same as rules", JSON.stringify({ ...r, active: 0, explain: 0 }) === JSON.stringify({ ...q, active: 0, explain: 0 }), "the declined result differs from the rules'");
    check("3 tab says declined", /rule-based pass \(FPE declined: 17 elements > 16 measured\)/.test(buildSketchRows({ rec: { groups: gs }, res: r }).header), buildSketchRows({ rec: { groups: gs }, res: r }).header);
    const ok16 = sceneFpe({ groups: gs.slice(0, 16) }); check("3 16 is read", ok16.active === "VSS scene reader (FPE, D 1024)", ok16.active);
    check("3 D 4096 reads 17", sceneFpe({ groups: gs }, { D: 4096 }).active === "VSS scene reader (FPE, D 4096)", "");
  }
  { // 4. the scene pass without a reader is unchanged: its active line names the rules
    const r = scenePass({ groups: [shape("s1", "rectangle", 100, 100, 140, 70, [0])] });
    check("4 rules active", /^rule-based geometry pass/.test(r.active), r.active);
  }
  { // 5. a constructed probe (NOT the split): the arrow's tip is on a big box's outline, 5 px from it, while a small ellipse 40 px away has its
    // centre much closer to the tip than the big box's centre has. The rules attach the tip to the box (outline); the scene reader reads
    // the nearest centre: the ellipse. Printed as an example of where the two readers can disagree; the gold is the box (outline contact).
    const rec = { groups: [shape("s1", "rectangle", 100, 100, 400, 300, [0]), shape("s2", "ellipse", 545, 230, 60, 40, [1]), shape("s3", "ellipse", 850, 230, 60, 40, [2]), arrowG("s4", { x: 850, y: 250 }, { x: 505, y: 250 }, [3])] };
    const q = scenePass(rec).connectors[0], r = sceneFpe(rec).connectors[0];
    console.log(`probe (constructed, not the split): arrow tip 5 px from a 400 x 300 box outline, 40 px from a small ellipse (centres: box 205 px, ellipse 70 px from the tip): rules -> ${q.target}, FPE -> ${r.target} (${r.fpe.target.fallback ? "outline rule" : "margin " + r.fpe.target.margin.toFixed(3)}); the outline contact is the box (s1)`);
    check("5 probe runs", !!q && !!r, "");
  }
} catch (e) { errors++; console.log(`sketch_fpe: ERROR in the scenarios: ${e.stack}`); }
console.log(`sketch_fpe scenarios: ${pass} pass, ${fail} fail`);
for (const f of failures) console.log(`  FAIL ${f}`);
if (errors || fail) { console.log("sketch_fpe: ERROR"); process.exit(1); }
console.log("sketch_fpe: suite ran (numbers above; MISS marks a criterion not met on the test split)");
