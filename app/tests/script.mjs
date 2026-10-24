// script.mjs: long scripts (spec 18; Table 13 row "Long scripts: 1, 5, 10 pages") on training/data/diagram/eval/scripts_{1,5,10}p.jsonl
// (training/worlds/diagram/scripts.py), and the large-model author's numbers (18.3).
// Usage: node app/tests/script.mjs [--data <eval dir>] [--model <exported model dir>] [--full] [--authored <scripts.jsonl>]
// Without --model the reader is a FAKE returning the gold frame of every unit text it knows (no-sense for any other text) and a NOISY
// variant; checked: sections and units, links and far references, order, planted out-of-world units marked and never executed, the
// diagram after every section (checkpoints) and at the end against the gold diagram, undo to a checkpoint, and the re-reading of one
// edited unit. The editor re-routes every connector after each change (src/editor/router.js), which dominates the time on long
// scripts; by default every 1-page script and the first 5-page script are executed, the others are read and linked only; --full
// executes all of them. With --model the real reader reads every unit and the numbers are the Table 13 measurements.
// --authored <file> (with --model): scripts written by large models (training/worlds/diagram/llm_author/run_author.py); prints the
// comparison table of 18.3 (instruction following per model, units lost and why).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createNormalizer } from "../src/normalize.js";
import { readerAdapter } from "../src/segment/segment.js";
import { circuitKeys, flattenFrame } from "../src/segment/circuit.js";
import { readScript, buildScript, runScript, undoToCheckpoint, editUnit, documentModel, authorReport, sceneToText, qualifiers, splitDocument } from "../src/script/script.js";
import { createScene } from "../src/editor/scene.js";

const HERE = path.dirname(fileURLToPath(import.meta.url)); const ROOT = path.resolve(HERE, "..", "..");
const arg = (k, d = null) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const DATA = arg("--data", path.join(ROOT, "training/data/diagram/eval")); const MODEL = arg("--model"); const FULL = process.argv.includes("--full"); const AUTHORED = arg("--authored");
const KINDS = JSON.parse(fs.readFileSync(path.join(DATA, "kinds.json"), "utf8")).kinds;
const normPath = MODEL && fs.existsSync(path.join(MODEL, "normalize.json")) ? path.join(MODEL, "normalize.json") : path.join(ROOT, "training/worlds/diagram/normalize.json");
const normalize = createNormalizer(JSON.parse(fs.readFileSync(normPath, "utf8")));
let pass = 0, fail = 0; const failures = [];
const check = (name, cond, detail = "") => { if (cond) pass++; else { fail++; failures.push(`${name}${detail ? ": " + detail : ""}`); } };
const f3 = (x) => (Number.isFinite(x) ? x.toFixed(3) : "n/a");
const load = (p) => fs.readFileSync(path.join(DATA, `scripts_${p}p.jsonl`), "utf8").split("\n").filter(Boolean).map(JSON.parse);

function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let x = seed || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
function fakeReader(gold, noise = null) {
  const calls = { n: 0 };
  return { calls, kind: (t) => KINDS[t] ?? null, read: (text) => {
    calls.n++; const r = rng(hash(text) ^ (noise ? noise.seed : 0)); const fr = gold.get(text); const toks = text.split(" ");
    if (!fr) {
      if (noise && r() < noise.confident) return { status: "ok", frame: { event: "create", roles: { object: ["entity", "box", null, "a"] }, neg: false, speakers: [] }, margins: { event: 0.02 }, residual: 0.3, unplaced: [] };
      return { status: "no-sense", frame: { event: null, roles: {} }, margins: {}, residual: 1, unplaced: toks.filter((t) => !(t in KINDS) && !/^\d+$/.test(t)), tokens: toks };
    }
    const frame = JSON.parse(JSON.stringify(fr));
    if (noise && r() < noise.abstain) return { status: "abstain", frame, margins: { event: 0.01 }, residual: 0.2, unplaced: [] };
    const m = { event: 0.15 + 0.35 * r() }; for (const k of Object.keys(frame.roles)) m[k] = noise && r() < noise.low ? 0.02 : 0.15 + 0.35 * r();
    return { status: "ok", frame, margins: m, residual: 0.05 * r(), unplaced: [], tokens: toks };
  } };
}
async function realReader() {
  const { load: loadModel } = await import("../src/vss.js");
  const vss = await loadModel(null, { readFile: async (n) => (n.endsWith(".json") ? fs.readFileSync(path.join(MODEL, n), "utf8") : fs.readFileSync(path.join(MODEL, n)).buffer.slice(0)) });
  return readerAdapter(vss);
}

// the gold diagram against the editor's: gold entity <-> circuit entity by their introduction (unit, role), members by creation order
function idMap(doc, circuit, state) {
  const jsEnt = new Map(circuit.entities.map((e) => [`${e.intro.unit}.${e.intro.role}`, e.id])); const map = new Map();
  for (const [eid, g] of Object.entries(doc.entities)) { const je = jsEnt.get(`${g.intro[0]}.${g.intro[1]}`); (je ? state.ids.get(je) || [] : []).forEach((id, k) => map.set(id, `${eid}.${k}`)); }
  return map;
}
const norm = (c) => JSON.stringify([c.word, c.label ?? null, c.color ?? null, c.size ?? null, c.style ?? null]);
function compareDiagram(comps, conns, gold, map) {
  let ok = 0; for (const c of comps) { const g = gold.components[map.get(c.id)]; if (g && norm(g) === norm(c)) ok++; }
  const left = new Map(); for (const [a, b] of gold.connectors) left.set(`${a}>${b}`, (left.get(`${a}>${b}`) || 0) + 1);   // connectors as a multiset
  let okk = 0; for (const e of conns) { const k = `${map.get(e.source)}>${map.get(e.target)}`; if (left.get(k)) { left.set(k, left.get(k) - 1); okk++; } }
  const nG = Object.keys(gold.components).length, nK = gold.connectors.length;
  return { cP: comps.length ? ok / comps.length : 1, cR: nG ? ok / nG : 1, kP: conns.length ? okk / conns.length : 1, kR: nK ? okk / nK : 1 };
}
// the editor's units against the gold units by text, in order (a segmentation that differs shifts every index after it): js index -> gold index
function align(js, gold) {
  const map = new Map(); let g = 0;
  for (let j = 0; j < js.length; j++) {
    for (let k = g; k < Math.min(gold.length, g + 6); k++) if (gold[k] === js[j]) { map.set(j, k); g = k + 1; break; }
  }
  return map;
}
const remapLink = (key, A) => { const m = /^(\d+)\.(\w+)=>(\d+)\.(\w+)$/.exec(key); if (!m || !A.has(+m[1]) || !A.has(+m[3])) return null; return `${A.get(+m[1])}.${m[2]}=>${A.get(+m[3])}.${m[4]}`; };
const fromSnap = (snap) => { const o = JSON.parse(snap); return { comps: o.c, conns: o.k }; };
const sameFrame = (a, b) => { const x = flattenFrame(a), y = flattenFrame(b); return !!x.slots && !!y.slots && JSON.stringify(Object.entries(x.slots).sort()) === JSON.stringify(Object.entries(y.slots).sort()); };

function evalDoc(doc, reader, { execute, edits = false }) {
  const t0 = performance.now();
  const read = readScript(doc.text, { reader, normalize, kind: reader.kind });
  const circuit = buildScript(read); const out = { pages: doc.pages, units: doc.units.length };
  const a = read.units.map((u) => u.text), b = doc.units.map((u) => u.text);
  out.unitTexts = a.length === b.length && a.every((x, i) => x === b[i]);
  let same = 0; const gb = new Set(b); for (const x of a) if (gb.has(x)) same++; out.cut = same / Math.max(a.length, b.length);
  out.sections = read.sections.length === doc.sections.length;
  const A = align(a, b); out.aligned = A;
  const k = circuitKeys(circuit); const G = new Set(doc.links), P = new Set(k.links.map((x) => remapLink(x, A)).filter(Boolean)); const tp = [...P].filter((x) => G.has(x)).length;
  out.links = { tp, p: k.links.length, g: G.size }; out.far = { ok: doc.far_references.filter((f) => P.has(f.link)).length, n: doc.far_references.length };
  const jsOrder = circuit.order.filter((j) => A.has(j)).map((j) => A.get(j)); const kept = new Set(jsOrder);
  out.order = JSON.stringify(jsOrder) === JSON.stringify(doc.order.filter((g) => kept.has(g)));         // the order of the units both have
  out.readMs = performance.now() - t0;
  if (!execute) return out;
  const sc = createScene({ width: 4000, height: 3000 }); const t1 = performance.now();
  const run = runScript(sc, circuit, { blocking: "skip", conflicts: "in-order" }); out.planMs = performance.now() - t1;
  let inw = 0, exOK = 0, pl = 0, plMarked = 0, plNever = 0;
  const inv = new Map([...A].map(([j, g]) => [g, j]));
  for (const u of doc.units) {
    const j = inv.get(u.i); const r = j != null ? run.results.get(j) : null; const ru = j != null ? read.units[j] : null;
    if (u.planted) {                                                  // a planted unit read inside a longer unit counts by that unit
      pl++; const host = j != null ? [j] : read.units.filter((x) => x.text.includes(u.text.replace(/ \.$/, ""))).map((x) => x.i);
      const marks = host.map((h) => (run.results.get(h) || {}).mark);
      if (j != null && r && r.mark === "out-of-world") plMarked++; if (!marks.includes("executed")) plNever++; continue;
    }
    inw++; if (r && r.mark === "executed" && ru && sameFrame(ru.reading.frame, u.frame)) exOK++;
  }
  out.exec = { ok: exOK, n: inw }; out.planted = { marked: plMarked, never: plNever, n: pl };
  const map = idMap(doc, circuit, run.state);
  out.final = compareDiagram([...sc.components.values()], [...sc.connectors.values()], doc.final, map);
  out.checkpoints = doc.checkpoints.map((g, s) => { const c = run.checkpoints[s]; if (!c) return null; const x = fromSnap(c.snapshot); return compareDiagram(x.comps, x.conns, g, map); });
  // undo back to a middle checkpoint: the diagram is the gold diagram of that section
  if (doc.checkpoints.length >= 2) {
    const k2 = Math.floor((doc.checkpoints.length - 1) / 2); undoToCheckpoint(sc, run, k2);
    out.undo = compareDiagram([...sc.components.values()], [...sc.connectors.values()], doc.checkpoints[k2], map);
  }
  if (edits) {   // edit one unit of the last section that sets a colour: one re-reading, the dependents reported, the change in the diagram
    const sc2 = createScene({ width: 4000, height: 3000 }); const rd2 = fakeReader(new Map([...doc.units.filter((u) => !u.planted).map((u) => [u.text, u.frame])]));
    const read2 = readScript(doc.text, { reader: rd2, normalize, kind: rd2.kind }); const c2 = buildScript(read2);
    let session = { read: read2, circuit: c2, scene: sc2, reader: rd2, run: runScript(sc2, c2, { blocking: "skip", conflicts: "in-order" }), runOptions: { blocking: "skip", conflicts: "in-order" } };
    const last = Math.max(...doc.units.map((u) => u.section));
    const target = doc.units.find((u) => !u.planted && u.section === last && u.event === "change" && u.frame.roles.color && !u.frame.neg && /\b(red|blue|green|yellow|gray)\b/.test(u.text));
    if (target) {
      const old = target.frame.roles.color[1]; const nw = old === "teal" ? "pink" : "teal";
      const text = target.text.replace(new RegExp(`\\b${old}\\b`), nw); const frame = JSON.parse(JSON.stringify(target.frame)); frame.roles.color = ["word", nw];
      const before = rd2.calls.n; const g2 = new Map([...doc.units.filter((u) => !u.planted).map((u) => [u.text, u.frame]), [text, frame]]);
      session.reader = { ...rd2, read: (t) => { rd2.calls.n++; return fakeReader(g2).read(t); } };
      const r = editUnit(session, target.i, text); session = r.session;
      const ids = r.session.run.state.ids; const m = r.session.circuit.units[target.i].mentions.find((x) => x.role === "object"); const cid = m && m.entity ? (ids.get(m.entity) || [])[0] : null;
      out.edit = { reads: rd2.calls.n - before, color: cid && sc2.components.get(cid) ? sc2.components.get(cid).color : null, want: nw, dependents: r.dependents.length, replanned: r.replanned.length, conflictFree: !doc.conflicts.some((c) => c.a === target.i || c.b === target.i) };
    }
  }
  out.model = documentModel(read, circuit, run);
  return out;
}

function summarize(label, rs) {
  const sum = (f) => rs.reduce((m, r) => m + (f(r) || 0), 0);
  const ex = rs.filter((r) => r.exec);
  const L = { tp: sum((r) => r.links.tp), p: sum((r) => r.links.p), g: sum((r) => r.links.g) };
  const s = { label, docs: rs.length, units: sum((r) => r.units), cut: sum((r) => r.cut * r.units) / sum((r) => r.units), texts: rs.filter((r) => r.unitTexts).length,
    linksP: L.p ? L.tp / L.p : 1, linksR: L.g ? L.tp / L.g : 1, far: sum((r) => r.far.ok) / Math.max(1, sum((r) => r.far.n)), farN: sum((r) => r.far.n), order: rs.filter((r) => r.order).length,
    executedDocs: ex.length };
  if (ex.length) {
    const e = (f) => ex.reduce((m, r) => m + f(r), 0);
    Object.assign(s, { exec: e((r) => r.exec.ok) / e((r) => r.exec.n), planted: [e((r) => r.planted.marked), e((r) => r.planted.never), e((r) => r.planted.n)],
      cP: e((r) => r.final.cP) / ex.length, cR: e((r) => r.final.cR) / ex.length, kP: e((r) => r.final.kP) / ex.length, kR: e((r) => r.final.kR) / ex.length,
      checkpoints: ex.every((r) => r.checkpoints.every((c) => c && c.cP === 1 && c.cR === 1 && c.kP === 1 && c.kR === 1)),
      undo: ex.every((r) => !r.undo || (r.undo.cP === 1 && r.undo.cR === 1 && r.undo.kP === 1 && r.undo.kR === 1)),
      msPerPage: e((r) => r.readMs + r.planMs) / e((r) => r.pages), readMsPerPage: e((r) => r.readMs) / e((r) => r.pages) });
  }
  return s;
}
const line = (s) => `${s.label}: ${s.docs} docs, ${s.units} units; cuts ${f3(s.cut)} (${s.texts}/${s.docs} exact); links P ${f3(s.linksP)} R ${f3(s.linksR)}; cross-section references ${f3(s.far)} of ${s.farN}; order ${s.order}/${s.docs}` +
  (s.executedDocs ? `; executed (${s.executedDocs} docs): in-world units correct ${f3(s.exec)}, planted marked ${s.planted[0]}/${s.planted[2]} never executed ${s.planted[1]}/${s.planted[2]}; final diagram components P ${f3(s.cP)} R ${f3(s.cR)}, connectors P ${f3(s.kP)} R ${f3(s.kR)}; reading ${s.readMsPerPage.toFixed(0)} ms/page, reading and planning ${s.msPerPage.toFixed(0)} ms/page` : "");

// ------------------------------------------------------------------ small units of the module
{
  const d = splitDocument("# Title\n\n## One\n\nAdd a box.\nAdd a circle.\n\nSecond paragraph.\n\n## Two\n\nThird.");
  check("splitDocument", d.title === "Title" && d.sections.length === 2 && d.sections[0].paragraphs.length === 2 && d.sections[0].paragraphs[0] === "Add a box. Add a circle.", JSON.stringify(d));
  const q = qualifiers("connect the database from the first section to the second api .".split(" "));
  check("qualifiers", q.tokens.join(" ") === "connect the database to the api ." && q.quals.length === 2 && q.quals[0].section === 1 && q.quals[0].pos === 2 && q.quals[1].ordinal === 2 && q.quals[1].pos === 5, JSON.stringify(q));
  const q2 = qualifiers("move the gateway from section 3 left".split(" "));
  check("qualifiers: from section <n>", q2.tokens.join(" ") === "move the gateway left" && q2.quals[0].section === 3, JSON.stringify(q2));
}

const lines = [];
if (AUTHORED) {
  if (!MODEL) { console.log("script: --authored needs --model (the trained reader is the judge)"); process.exit(2); }
  const rd = await realReader(); const recs = fs.readFileSync(AUTHORED, "utf8").split("\n").filter(Boolean).map(JSON.parse); const by = new Map();
  for (const r of recs) {
    const read = readScript(r.text, { reader: rd, normalize, kind: rd.kind }); const c = buildScript(read); const sc = createScene({ width: 4000, height: 3000 });
    const run = runScript(sc, c, { blocking: "skip", conflicts: "in-order" }); const rep = authorReport(read, c, run);
    const m = by.get(r.model) || { scripts: 0, units: 0, read: 0, executed: 0, reasons: {}, back: [] }; by.set(r.model, m);
    m.scripts++; m.units += rep.units; m.read += rep.read; m.executed += rep.executed; for (const [k, v] of Object.entries(rep.byReason)) m.reasons[k] = (m.reasons[k] || 0) + v;
    m.back.push({ description: r.description_id, diagram_as_text: sceneToText(sc) });
  }
  console.log("| model | scripts | units | instruction following (units read) | executed of read | units lost, by reason |\n|---|---|---|---|---|---|");
  for (const [k, m] of by) console.log(`| ${k} | ${m.scripts} | ${m.units} | ${f3(m.read / m.units)} | ${f3(m.executed / Math.max(1, m.read))} | ${Object.entries(m.reasons).map(([a, b]) => `${a}: ${b}`).join("; ")} |`);
  const out = AUTHORED.replace(/\.jsonl$/, "") + ".diagrams_as_text.json"; fs.writeFileSync(out, JSON.stringify(Object.fromEntries(by), null, 1));
  console.log(`script: the diagrams read back into text, for the fidelity check: ${out}`); process.exit(0);
}

const reader0 = MODEL ? await realReader() : null;
for (const variant of MODEL ? ["real"] : ["clean", "noisy"]) {
  for (const pages of [1, 5, 10]) {
    const docs = load(pages); const rs = [];
    docs.forEach((doc, k) => {
      const gold = new Map(doc.units.filter((u) => !u.planted).map((u) => [u.text, u.frame]));
      const rd = MODEL ? reader0 : fakeReader(gold, variant === "noisy" ? { seed: 11, abstain: 0.02, low: 0.01, confident: 0.05 } : null);
      const execute = FULL || pages === 1 || (pages === 5 && k === 0);
      rs.push(evalDoc(doc, rd, { execute: execute && !(variant === "noisy" && pages > 1 && !FULL), edits: variant === "clean" && pages === 1 && k < 3 }));
    });
    const s = summarize(`${variant} reader, ${pages} page(s)`, rs); lines.push(line(s));
    if (variant === "clean") {
      check(`${pages}p: sections`, rs.every((r) => r.sections));
      check(`${pages}p: cuts`, s.cut === 1 && s.texts === s.docs, `${f3(s.cut)} ${s.texts}/${s.docs}`);
      check(`${pages}p: links P and R`, s.linksP === 1 && s.linksR === 1, `${f3(s.linksP)} ${f3(s.linksR)}`);
      check(`${pages}p: cross-section references resolved`, s.far === 1 && s.farN > 0, `${f3(s.far)} of ${s.farN}`);
      check(`${pages}p: order`, s.order === s.docs, `${s.order}/${s.docs}`);
      if (s.executedDocs) {
        check(`${pages}p: in-world units executed correctly`, s.exec === 1, f3(s.exec));
        check(`${pages}p: planted out-of-world units marked, never executed (100%)`, s.planted[0] === s.planted[2] && s.planted[1] === s.planted[2] && s.planted[2] > 0, JSON.stringify(s.planted));
        check(`${pages}p: final diagram`, s.cP === 1 && s.cR === 1 && s.kP === 1 && s.kR === 1, `${f3(s.cP)} ${f3(s.cR)} ${f3(s.kP)} ${f3(s.kR)}`);
        check(`${pages}p: diagram at every checkpoint`, s.checkpoints);
        check(`${pages}p: undo to a checkpoint`, s.undo);
      }
      const ed = rs.filter((r) => r.edit);
      if (ed.length) {
        check(`${pages}p: an edited unit is read once`, ed.every((r) => r.edit.reads === 1), JSON.stringify(ed.map((r) => r.edit)));
        check(`${pages}p: the edit reaches the diagram`, ed.every((r) => !r.edit.conflictFree || r.edit.color === r.edit.want), JSON.stringify(ed.map((r) => r.edit)));
      }
      const m = rs.find((r) => r.model);
      if (m) check(`${pages}p: document view model`, m.model.counts.units === m.units - 0 && m.model.sections.length > 0 && m.model.counts["out-of-world"] === m.planted.n, JSON.stringify(m.model.counts));
    } else if (variant === "noisy") {
      if (s.executedDocs) check(`${pages}p noisy: planted units never executed`, s.planted[1] === s.planted[2], JSON.stringify(s.planted));
    }
  }
}
for (const l of lines) console.log(l);
if (fail) console.log(failures.slice(0, 12).join("\n"));
console.log(`script: ${fail ? "FAIL" : "PASS"} ${pass}/${pass + fail} checks${MODEL ? " (real reader)" : " (fake readers; the Table 13 numbers need the trained reader: --model)"}${FULL ? "" : "; 10-page scripts read and linked, executed with --full"}`);
process.exit(fail ? 1 : 0);
