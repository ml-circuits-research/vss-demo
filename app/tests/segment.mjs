// segment.mjs: the segmenter and the SOP circuit (spec 15; Table 13 rows "Segmentation of paragraphs and long sentences" and "Circuit
// links") on the generated evaluation set training/data/diagram/eval/paragraphs.jsonl (training/worlds/diagram/paragraphs.py).
// Usage: node app/tests/segment.mjs [--data <eval dir>] [--model <exported model dir>]
// Without --model the reader is a FAKE that returns the generator's gold frame for every unit text it knows (and no-sense for any other
// text), plus a NOISY variant (abstentions, wrong values, low margins, a confident reading of an unknown text); this tests the code: cuts,
// repairs, links, order, cycles, conflicts, execution as one undo entry. With --model the real reader reads every unit: the numbers are
// then the Table 13 measurements (reported against their criteria; the exit code stays 0 unless --strict).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createNormalizer } from "../src/normalize.js";
import { segment, readerAdapter, candidateCuts } from "../src/segment/segment.js";
import { buildCircuit, unitsFromSegments, circuitKeys, executeCircuit, flattenFrame, diffFrames, components } from "../src/segment/circuit.js";
import { createScene } from "../src/editor/scene.js";

const HERE = path.dirname(fileURLToPath(import.meta.url)); const ROOT = path.resolve(HERE, "..", "..");
const arg = (k, d = null) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const DATA = arg("--data", path.join(ROOT, "training/data/diagram/eval")); const MODEL = arg("--model"); const STRICT = process.argv.includes("--strict");
const recs = fs.readFileSync(path.join(DATA, "paragraphs.jsonl"), "utf8").split("\n").filter(Boolean).map(JSON.parse);
const KINDS = JSON.parse(fs.readFileSync(path.join(DATA, "kinds.json"), "utf8")).kinds;
const normPath = MODEL && fs.existsSync(path.join(MODEL, "normalize.json")) ? path.join(MODEL, "normalize.json") : path.join(ROOT, "training/worlds/diagram/normalize.json");
const normalize = createNormalizer(JSON.parse(fs.readFileSync(normPath, "utf8")));

let pass = 0, fail = 0; const failures = [];
const check = (name, cond, detail = "") => { if (cond) pass++; else { fail++; failures.push(`${name}${detail ? ": " + detail : ""}`); } };
const f3 = (x) => (Number.isFinite(x) ? x.toFixed(3) : "n/a");

// ------------------------------------------------------------------ the fake readers
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let x = seed || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
export function fakeReader(gold, { noise = null } = {}) {
  const calls = { n: 0 };
  const read = (text) => {
    calls.n++; const r = rng(hash(text) ^ (noise ? noise.seed : 0)); const fr = gold.get(text);
    const margins = (frame) => { const m = { event: 0.15 + 0.35 * r() }; for (const k of Object.keys(frame.roles || {})) m[k] = 0.15 + 0.35 * r(); return m; };
    if (!fr) {
      if (noise && r() < noise.confident) {             // a reading of a text that is not a unit: low margin (uncertain), never a clear frame
        const frame = { event: "create", roles: { object: ["entity", "box", null, "a"] }, neg: false, speakers: [] };
        return { status: "ok", frame, margins: { event: 0.02, object: 0.02 }, residual: 0.3, unplaced: [], tokens: text.split(" ") };
      }
      return { status: "no-sense", frame: { event: null, roles: {}, neg: false, speakers: [] }, margins: {}, residual: 1, unplaced: text.split(" ").filter((t) => !(t in KINDS)), tokens: text.split(" ") };
    }
    let frame = JSON.parse(JSON.stringify(fr));
    if (noise && r() < noise.abstain) return { status: "abstain", frame, margins: { event: 0.01 }, residual: 0.2, unplaced: [], tokens: text.split(" ") };
    if (noise && r() < noise.swap) {
      const COL = ["red", "blue", "green", "yellow", "gray"]; for (const [k, v] of Object.entries(frame.roles)) if (k === "color" && v[0] === "word") frame.roles[k] = ["word", COL[(COL.indexOf(v[1]) + 1) % COL.length]];
    }
    return { status: "ok", frame, margins: margins(frame), residual: 0.05 * r(), unplaced: [], tokens: text.split(" ") };
  };
  return { read, kind: (t) => KINDS[t] ?? null, calls };
}

async function realReader() {
  const { load } = await import("../src/vss.js");
  const vss = await load(null, { readFile: async (n) => (n.endsWith(".json") ? fs.readFileSync(path.join(MODEL, n), "utf8") : fs.readFileSync(path.join(MODEL, n)).buffer.slice(0)) });
  return readerAdapter(vss);
}

// ------------------------------------------------------------------ evaluation of a reader on the whole set
const sameFrame = (a, b) => { const x = flattenFrame(a), y = flattenFrame(b); return !!x.slots && !!y.slots && JSON.stringify(Object.entries(x.slots).sort()) === JSON.stringify(Object.entries(y.slots).sort()); };
const pr = (pred, gold) => { const G = new Set(gold), P = new Set(pred); const tp = [...P].filter((x) => G.has(x)).length; return { tp, p: P.size, g: G.size }; };
function evaluate(reader, label) {
  const acc = { cutTP: 0, cutFP: 0, cutFN: 0, exact: 0, n: 0, links: { tp: 0, p: 0, g: 0 }, disc: { tp: 0, p: 0, g: 0 }, conf: { tp: 0, p: 0, g: 0 }, orderOK: 0, orderN: 0,
    cyc: 0, cycN: 0, repaired: 0, units: 0, unitFull: 0, byLen: new Map(), executed: 0, execUnits: 0, oneUndo: 0, oneUndoN: 0, normOK: 0, reads: 0 };
  for (const r of recs) {
    const n = normalize(r.surface); if (JSON.stringify(n.tokens) === JSON.stringify(r.tokens)) acc.normOK++;
    const s = segment(n.tokens, { reader });
    acc.reads += s.reads; acc.n++;
    if (s.explain.some((e) => e.startsWith("cut at") || e.startsWith("merged at"))) acc.repaired++;
    const gc = new Set(r.units.map((u) => `${u.start}`)), pc = new Set(s.segments.map((u) => `${u.start}`));
    for (const c of pc) if (gc.has(c)) acc.cutTP++; else acc.cutFP++;
    for (const c of gc) if (!pc.has(c)) acc.cutFN++;
    const exact = s.segments.length === r.units.length && s.segments.every((x, k) => x.text === r.units[k].text); if (exact) acc.exact++;
    // FULL per unit, by length of the input (spec 15.4)
    const bucket = r.n_words < 15 ? "10-14" : r.n_words < 20 ? "15-19" : r.n_words < 30 ? "20-29" : "30+";
    const bl = acc.byLen.get(`${r.kind} ${bucket}`) || { u: 0, full: 0 }; acc.byLen.set(`${r.kind} ${bucket}`, bl);
    for (const g of r.units) {
      acc.units++; bl.u++; const m = s.segments.find((x) => x.text === g.text);
      if (m && m.reading && !m.poor && sameFrame(m.reading.frame, g.frame)) { acc.unitFull++; bl.full++; }
    }
    const c = buildCircuit(unitsFromSegments(s, { info: n.info }));
    const k = circuitKeys(c);
    for (const [key, got, want] of [["links", k.links, r.links], ["disc", k.discourse, r.discourse], ["conf", c.conflicts.map((x) => x.key), r.conflicts.map((x) => `${x.a}-${x.b}-${x.role}`)]]) {
      const q = pr(got, want); acc[key].tp += q.tp; acc[key].p += q.p; acc[key].g += q.g;
    }
    if (exact) { acc.orderN++; if (JSON.stringify(c.order) === JSON.stringify(r.order)) acc.orderOK++; }
    acc.cycN += r.cycle.length ? 1 : 0; if (r.cycle.length && c.cycle && JSON.stringify([...c.cycle.nodes].sort()) === JSON.stringify([...r.cycle].sort())) acc.cyc++;
    if (!r.cycle.length && !c.cycle) {
      const sc = createScene(); const e = executeCircuit(sc, c, { conflicts: "in-order", unread: "skip", blocking: "skip" });
      acc.executed += e.results.filter((x) => x.mark === "executed").length; acc.execUnits += r.units.length;
      if (e.results.some((x) => x.mark === "executed")) { acc.oneUndoN++; if (sc.undo.length === 1) acc.oneUndo++; }
    }
  }
  const P = (q) => (q.p ? q.tp / q.p : 1), R = (q) => (q.g ? q.tp / q.g : 1);
  const out = { label, cut: acc.cutTP / (acc.cutTP + acc.cutFP + acc.cutFN), exact: acc.exact / acc.n, linksP: P(acc.links), linksR: R(acc.links), discP: P(acc.disc), discR: R(acc.disc),
    confP: P(acc.conf), confR: R(acc.conf), order: acc.orderN ? acc.orderOK / acc.orderN : 0, orderN: acc.orderN, cycles: [acc.cyc, acc.cycN], unitFull: acc.unitFull / acc.units,
    byLen: [...acc.byLen].sort().map(([k, v]) => `${k}: ${f3(v.full / v.u)} (${v.u})`), executed: acc.execUnits ? acc.executed / acc.execUnits : 0, oneUndo: [acc.oneUndo, acc.oneUndoN],
    repaired: acc.repaired, norm: acc.normOK / acc.n, reads: acc.reads, n: acc.n };
  return out;
}
const show = (m) => `${m.label}: cuts ${f3(m.cut)} (exact segmentation ${f3(m.exact)}, repaired by reading ${m.repaired}/${m.n}); FULL per unit ${f3(m.unitFull)}; shared links P ${f3(m.linksP)} R ${f3(m.linksR)}; ` +
  `discourse P ${f3(m.discP)} R ${f3(m.discR)}; order ${f3(m.order)} of ${m.orderN}; cycles ${m.cycles[0]}/${m.cycles[1]}; conflicts P ${f3(m.confP)} R ${f3(m.confR)}; executed ${f3(m.executed)}; one undo entry ${m.oneUndo[0]}/${m.oneUndo[1]}`;

// ------------------------------------------------------------------ hand-written cases (the parts the generator does not write)
const E = (head, attr = null, det = "the") => ["entity", head, attr ? ["word", attr] : null, det];
const W = (w) => ["word", w];
const F = (event, roles = {}, extra = {}) => ({ event, roles, neg: false, speakers: [], ...extra });
const tok = (s) => normalize(s).tokens;
function handCases() {
  const H = (pairs) => { const g = new Map(); for (const [t, f] of pairs) g.set(t, f); return fakeReader(g); };
  { // the specification's example (15.2): it -> e1 by rule:recent; then(after, scope); a prohibition as not -> delete
    const rd = H([["add a database called orders .", F("create", { object: E("database", null, "a"), text: W("orders") })],
      ["connect it to the api .", F("connect", { source: E("it", null, null), target: E("api") })], ["make it red", F("change", { object: E("it", null, null), color: W("red") })],
      ["never delete it .", F("delete", { object: E("it", null, null) }, { neg: true })]]);
    const n = normalize("Add a database called Orders. Connect it to the API. Then make it red, and never delete it.");
    const s = segment(n.tokens, { reader: rd });
    check("spec example: four units", s.segments.map((x) => x.text).join("|") === "add a database called orders .|connect it to the api .|make it red|never delete it .", s.segments.map((x) => x.text).join("|"));
    const c = buildCircuit(unitsFromSegments(s, { info: n.info }));
    check("spec example: _link.source=rule:recent", c.sop.includes("_link.source=rule:recent") && c.sop.includes("_link.object=rule:recent"), c.sop);
    check("spec example: then wire", /@d1 then\n_sentence=2\nafter=\$w\d+\nscope=\$w\d+/.test(c.sop), c.sop);
    check("spec example: not around delete", /@w\d+ not\n_text=never delete it \.\n_sentence=3\nscope=\$w\d+/.test(c.sop), c.sop);
    check("spec example: entity with its label", /@e1 entity\nhead=database\ndet=a\ntext=orders/.test(c.sop), c.sop);
    check("spec example: the api resolves to nothing and is marked", c.entities.length === 1 && c.sop.includes("_link.target=unresolved:none") && c.order.join() === "0,1,2,3", c.sop);
    check("spec example: one group of linked units", components(c).length === 1);
    const sc = createScene(); const e = executeCircuit(sc, c);
    check("spec example: the api does not exist -> the plan stops at unit 1 and keeps unit 0", e.stoppedAt === 1 && e.results[0].mark === "executed" && sc.components.size === 1, JSON.stringify(e.results));
    check("spec example: one undo entry", sc.undo.length === 1);
  }
  { // a conjunction inside an entity is not a cut; a weak comma repaired by the reading
    const rd = H([["connect the box and the cache with a line", F("connect", { source: E("box"), target: E("cache"), object: E("line", null, "a") })],
      ["add a box", F("create", { object: E("box", null, "a") })], ["in the top_left , add a circle .", F("create", { object: E("circle", null, "a"), region: W("top_left") })]]);
    const s1 = segment(tok("connect the box and the cache with a line"), { reader: rd });
    check("and inside an entity: no cut", s1.segments.length === 1 && !s1.segments[0].poor, JSON.stringify(s1.segments.map((x) => x.text)));
    const s2 = segment(tok("add a box, in the top left, add a circle."), { reader: rd });
    check("weak comma: the reading moves the cut", s2.segments.map((x) => x.text).join("|") === "add a box|in the top_left , add a circle .", s2.segments.map((x) => x.text).join("|") + " " + s2.explain.join("; "));
  }
  { // because (a weak cut taken by the reading), so, unless, says that
    const rd = H([["add a cache", F("create", { object: E("cache", null, "a") })], ["connect it to the api .", F("connect", { source: E("it", null, null), target: E("api") })],
      ["add a box", F("create", { object: E("box", null, "a") })], ["add a box .", F("create", { object: E("box", null, "a") })], ["add an api", F("create", { object: E("api", null, "an") })]]);
    const s = segment(tok("add a cache because the api is slow."), { reader: rd });
    check("because: split by the reading", s.segments.length === 2 && s.segments[0].text === "add a cache" && s.segments[1].poor && s.segments[1].connective.op === "because", JSON.stringify(s.segments.map((x) => [x.text, x.poor])));
    const c = buildCircuit(unitsFromSegments(s)); check("because: discourse link to the unread reason", c.discourse.some((d) => d.op === "because" && d.a === 1 && d.b === 0) && /@d1 because/.test(c.sop), c.sop);
    const s2 = segment(tok("add a cache so connect it to the api."), { reader: rd }); const c2 = buildCircuit(unitsFromSegments(s2));
    check("so: cause -> scope", c2.discourse.length === 1 && c2.discourse[0].op === "so" && c2.edges.some(([a, b, k]) => a === 0 && b === 1 && k === "so"), JSON.stringify(c2.discourse));
    const s3 = segment(tok("unless you add an api, add a box."), { reader: rd }); const c3 = buildCircuit(unitsFromSegments(s3));
    check("unless: if with a not around the condition", s3.segments[0].connective.op === "unless" && /@d1 if\n_sentence=0\ncondition=\$n1\nconsequence=\$w2/.test(c3.sop) && /@n1 not\nscope=\$w1/.test(c3.sop), c3.sop);
    const s4 = segment(tok("paul says that add a box."), { reader: rd }); const c4 = buildCircuit(unitsFromSegments(s4));
    check("says that: speaker and scope", s4.segments[0].role === "speaker" && /@d1 says\n_sentence=1\nspeaker=paul\nscope=\$w1/.test(c4.sop), c4.sop);
  }
  { // the reader's gates as the second signal: a cut only where a gate is open
    const g = new Map([["add a box", F("create", { object: E("box", null, "a") })], ["add a circle", F("create", { object: E("circle", null, "a") })]]);
    const rd = fakeReader(g); const t = tok("add a box and add a circle");
    const open = candidateCuts(t, { kind: rd.kind, gates: t.map((w) => (w === "and" ? 0.9 : 0)) }).cuts;
    const closed = candidateCuts(t, { kind: rd.kind, gates: t.map(() => 0) }).cuts;
    check("gates: open gate -> strong cut; closed gate -> weak", open.length === 1 && open[0].strong && closed.length === 1 && !closed[0].strong, JSON.stringify([open, closed]));
    const s = segment(t, { reader: { ...rd, gates: (ts) => ts.map(() => 0) } });
    check("gates closed: the reading still separates two commands", s.segments.length === 2, JSON.stringify(s.segments.map((x) => x.text)));
  }
  { // two segmentations that read equally clearly: shown as two readings
    const rd = H([["p q", F("zoom", { direction: W("zoom_in") })], ["r s , t u", F("zoom", { direction: W("zoom_out") })], ["p q , r s", F("zoom", { direction: W("zoom_in") })], ["t u", F("zoom", { direction: W("zoom_out") })]]);
    const fixed = { read: (t) => { const x = rd.read(t); if (x.status === "ok") x.margins = { event: 0.3 }; x.residual = x.status === "ok" ? 0 : 1; return x; }, kind: () => null };
    const s = segment(["p", "q", ",", "r", "s", ",", "t", "u"], { reader: fixed });
    check("ambiguous segmentation -> two readings", s.ambiguous && s.alternatives.length === 1, JSON.stringify(s.explain));
  }
  { // conflicts: certain (contradiction) and uncertain (a margin under tau -> unverifiable); a question wire answered from the diagram
    const rd = H([["add a database .", F("create", { object: E("database", null, "a") })], ["make it red .", F("change", { object: E("it", null, null), color: W("red") })],
      ["make the database blue .", F("change", { object: E("database"), color: W("blue") })], ["what color is the database ?", F("query", { object: E("database"), color: "?" }, { mood: "question" })]]);
    const s = segment(tok("Add a database. Make it red. Make the database blue."), { reader: rd }); const c = buildCircuit(unitsFromSegments(s));
    check("conflict found", c.conflicts.length === 1 && c.conflicts[0].certain && c.conflicts[0].role === "color", JSON.stringify(c.conflicts));
    const sc = createScene(); const e = executeCircuit(sc, c);
    check("conflict: nothing runs before the user chooses", e.waiting && e.waiting.conflicts && sc.components.size === 0);
    const e2 = executeCircuit(sc, c, { choices: { [c.conflicts[0].key]: 2 } });
    check("conflict: the user keeps the second", [...sc.components.values()][0].color === "blue" && e2.results.find((x) => x.unit === 1).mark === "dropped", JSON.stringify(e2.results));
    s.segments[1].reading = { ...s.segments[1].reading, margins: { event: 0.3, object: 0.3, color: 0.01 } }; const cu = buildCircuit(unitsFromSegments(s));
    check("conflict uncertain: margin under tau -> unverifiable", cu.conflicts.length === 1 && !cu.conflicts[0].certain && cu.conflicts[0].verdict === "unverifiable", JSON.stringify(cu.conflicts));
    const q = segment(tok("Add a database. Make it red. What color is the database?"), { reader: rd }); const cq = buildCircuit(unitsFromSegments(q));
    check("question wire: _mood=question, linked to the entity", /_mood=question/.test(cq.sop) && cq.links.some((l) => l.kind === "shared" && l.from.unit === 2 && l.entity === "e1"), cq.sop);
    const sq = createScene(); const eq = executeCircuit(sq, cq);
    check("question answered from the diagram in circuit order", eq.results[2].mark === "answered" && /color red/.test(eq.results[2].reason), JSON.stringify(eq.results[2]));
  }
  { // a cycle: reported, nothing runs; a user link replaces the rule's
    const rd = H([["add a cache .", F("create", { object: E("cache", null, "a") })], ["connect the cache to the database .", F("connect", { source: E("cache"), target: E("database") })],
      ["add a database .", F("create", { object: E("database", null, "a") })], ["add a cache", F("create", { object: E("cache", null, "a") })]]);
    const s = segment(tok("Add a cache. Before that, connect the cache to the database."), { reader: rd }); const c = buildCircuit(unitsFromSegments(s));
    check("cycle reported", c.cycle && c.cycle.nodes.length === 2 && /cycle/.test(c.cycle.text), JSON.stringify(c.cycle));
    check("cycle: nothing runs", executeCircuit(createScene(), c).waiting.cycle);
    const s2 = segment(tok("Connect the cache to the database. Before that, add a cache. Add a database."), { reader: rd }); const c2 = buildCircuit(unitsFromSegments(s2));
    check("forward reference and before that: order", c2.order.join() === "1,2,0" && c2.links.some((l) => l.source === "rule:forward"), JSON.stringify([c2.order, c2.links.filter((l) => l.kind === "shared")]));
    const c3 = buildCircuit(unitsFromSegments(segment(tok("Add a cache. Add a database. Connect it to the database."), { reader: H([["add a cache .", F("create", { object: E("cache", null, "a") })], ["add a database .", F("create", { object: E("database", null, "a") })], ["connect it to the database .", F("connect", { source: E("it", null, null), target: E("database") })]]) })), { userLinks: [{ unit: 2, role: "source", entity: "e1" }] });
    check("user link", c3.links.some((l) => l.kind === "shared" && l.from.unit === 2 && l.from.role === "source" && l.entity === "e1" && l.source === "user"), JSON.stringify(c3.links.filter((l) => l.kind === "shared")));
  }
  { // a paragraph about components already on the diagram: rule:scene
    const sc = createScene(); const rd = H([["add a database called orders", F("create", { object: E("database", null, "a"), text: W("orders") })], ["make orders red .", F("change", { object: E("orders", null, null), color: W("red") })]]);
    const c0 = buildCircuit(unitsFromSegments(segment(tok("add a database called orders"), { reader: rd }), { info: { labels: { orders: "orders" } } })); executeCircuit(sc, c0);
    const c = buildCircuit(unitsFromSegments(segment(tok("Make orders red."), { reader: rd })), { scene: sc });
    check("scene reference", c.entities[0].scene && /_component=c1/.test(c.sop), c.sop); executeCircuit(sc, c);
    check("scene reference executed", [...sc.components.values()][0].color === "red");
  }
  { // diff port: verdicts as sop diff gives them
    const a = F("change", { object: E("box"), color: W("red") }), b = F("change", { object: E("box"), color: W("blue") }), c = F("change", { object: E("box") });
    check("diff: contradiction", diffFrames(a, {}, b, {}).verdict === "contradiction");
    check("diff: unverifiable under tau", diffFrames(a, { color: 0.01 }, b, {}).verdict === "unverifiable");
    check("diff: compatible-incomplete", diffFrames(a, {}, c, {}).verdict === "compatible-incomplete");
    check("diff: agreement", diffFrames(a, {}, a, {}).verdict === "agreement");
  }
}

// ------------------------------------------------------------------ run
const gold = new Map(); for (const r of recs) for (const u of r.units) gold.set(u.text, u.frame);
const lines = [];
if (MODEL) {
  const rd = await realReader(); const m = evaluate(rd, "real reader");
  lines.push(show(m), "FULL per unit by kind and length: " + m.byLen.join("; "));
  const crit = [["cuts >= 0.97", m.cut >= 0.97], ["FULL per unit within 0.03 of single commands (compare with the single-command FULL of the same model)", null], ["execution order correct on 100% of the scripted paragraphs", m.order === 1]];
  for (const [k, v] of crit) lines.push(`criterion ${k}: ${v === null ? "reported" : v ? "MET" : "MISSED"}`);
  if (STRICT && crit.some(([, v]) => v === false)) fail++;
} else {
  const clean = evaluate(fakeReader(gold), "fake reader (gold frames)");
  check("normalizer reproduces the generator's tokens", clean.norm === 1, f3(clean.norm));
  check("cut accuracy with the gold reader", clean.cut >= 0.999 && clean.exact >= 0.999, `${f3(clean.cut)} ${f3(clean.exact)}`);
  check("shared links P and R", clean.linksP === 1 && clean.linksR === 1, `${f3(clean.linksP)} ${f3(clean.linksR)}`);
  check("discourse links P and R", clean.discP === 1 && clean.discR === 1, `${f3(clean.discP)} ${f3(clean.discR)}`);
  check("execution order on 100% of the scripted paragraphs", clean.order === 1 && clean.orderN === recs.length, `${f3(clean.order)} of ${clean.orderN}`);
  check("cycles detected", clean.cycles[0] === clean.cycles[1] && clean.cycles[1] > 0, JSON.stringify(clean.cycles));
  check("conflicts P and R", clean.confP === 1 && clean.confR === 1, `${f3(clean.confP)} ${f3(clean.confR)}`);
  check("every unit executed (no cycle, conflicts in order)", clean.executed === 1, f3(clean.executed));
  check("a paragraph is one undo entry", clean.oneUndo[0] === clean.oneUndo[1], JSON.stringify(clean.oneUndo));
  check("some paragraphs need the reading to place a cut", clean.repaired > 0, String(clean.repaired));
  const noisy = evaluate(fakeReader(gold, { noise: { seed: 7, abstain: 0.03, swap: 0.05, confident: 0.05 } }), "noisy fake reader");
  check("noisy reader: metrics computed", [noisy.cut, noisy.linksP, noisy.linksR, noisy.order].every(Number.isFinite));
  check("noisy reader: cuts stay >= 0.9", noisy.cut >= 0.9, f3(noisy.cut));
  handCases();
  lines.push(show(clean), show(noisy), "FULL per unit (noisy) by kind and length: " + noisy.byLen.join("; "));
}
for (const l of lines) console.log(l);
if (fail) { console.log(failures.slice(0, 12).join("\n")); }
console.log(`segment: ${fail ? "FAIL" : "PASS"} ${pass}/${pass + fail} checks on ${recs.length} paragraphs and long sentences${MODEL ? " (real reader)" : " (fake readers; the Table 13 numbers need the trained reader: --model)"}`);
process.exit(fail ? 1 : 0);
