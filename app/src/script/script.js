// script.js: long scripts (spec 18). A document of any length is split into sections (headings) and paragraphs, every paragraph is
// segmented and read unit by unit (src/segment/segment.js), the whole document becomes one SOP circuit with a section wire per heading
// (src/segment/circuit.js), and the diagram is built section by section with a checkpoint (one undo entry) after each. DOM-free,
// deterministic; the document view (view.js) shows every sentence with what it did.
//
// The four things a document needs beyond a paragraph (18.1), as implemented here:
//   structure      "# title", "## heading" lines; a section wire per heading; units carry _section;
//   references     over distance: a label, the only component of a kind, or a qualifier the Level 1 reader has no role for, kept aside by
//                  the pre-pass qualifiers() before reading: "<kind> from the <ordinal> section", "<kind> from section <n>", "the <ordinal>
//                  <kind>" (order of creation); the circuit resolves them (rule:section, rule:ordinal) and asks when several fit;
//   accumulation   every unit with a margin under tau, an unresolved reference or a failed precondition is marked; out-of-world units are
//                  marked and never executed; with blocking: "stop" (the default, interactive) the plan stops at the first blocking unit
//                  and waits; with "skip" (evaluation) it goes on and the marks are counted;
//   a document     one plan with checkpoints at the section boundaries; undoToCheckpoint(); editUnit() re-reads one unit only and
//                  re-plans from the checkpoint before it, reporting which units depend on the change.
import { segment } from "../segment/segment.js";
import { buildCircuit, unitsFromSegments, executeCircuit, unitMark } from "../segment/circuit.js";
import { snapshot } from "../editor/scene.js";
import { undo as undoScene } from "../editor/planner.js";

export const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth",
  "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth"];

/** text -> {title, sections: [{title, paragraphs: [text]}]}; headings are lines starting with '#'; paragraphs are separated by blank lines */
export function splitDocument(text) {
  const lines = String(text).replace(/\r/g, "").split("\n"); let title = null; const sections = []; let cur = null; let buf = [];
  const flush = () => { if (buf.length) { if (!cur) { cur = { title: null, paragraphs: [] }; sections.push(cur); } cur.paragraphs.push(buf.join(" ").trim()); buf = []; } };
  for (const raw of lines) {
    const l = raw.trim(); const h = /^(#{1,6})\s+(.*)$/.exec(l);
    if (h) { flush(); if (h[1].length === 1 && title === null && !sections.length) { title = h[2].trim(); continue; } cur = { title: h[2].trim(), paragraphs: [] }; sections.push(cur); continue; }
    if (!l) { flush(); continue; }
    buf.push(l);
  }
  flush();
  return { title, sections: sections.filter((s) => s.paragraphs.length || s.title) };
}

/** the reference pre-pass: qualifier words removed, constraints kept with the position of their head in the remaining tokens */
export function qualifiers(tokens) {
  const out = [], quals = []; let pendingOrd = null;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "from" && tokens[i + 1] === "the" && ORDINALS.includes(tokens[i + 2]) && tokens[i + 3] === "section" && out.length) {
      quals.push({ pos: out.length - 1, head: out[out.length - 1], section: ORDINALS.indexOf(tokens[i + 2]) + 1, words: tokens.slice(i, i + 4).join(" ") }); i += 3; continue;
    }
    if (t === "from" && tokens[i + 1] === "section" && /^\d+$/.test(tokens[i + 2] || "") && out.length) {
      quals.push({ pos: out.length - 1, head: out[out.length - 1], section: Number(tokens[i + 2]), words: tokens.slice(i, i + 3).join(" ") }); i += 2; continue;
    }
    if (ORDINALS.includes(t) && out.length && out[out.length - 1] === "the" && i + 1 < tokens.length) { pendingOrd = { ordinal: ORDINALS.indexOf(t) + 1, words: `the ${t}` }; continue; }
    if (pendingOrd) { quals.push({ pos: out.length, head: t, ...pendingOrd }); pendingOrd = null; }
    out.push(t);
  }
  return { tokens: out, quals };
}

/**
 * read a document: opts {reader, normalize(text) -> {tokens, info}, kind?, segmentOptions?}. Every paragraph is segmented separately;
 * readings are cached by unit text (a change to one unit re-reads that unit only).
 */
export function readScript(text, opts) {
  const doc = splitDocument(text); const cache = opts.cache || new Map(); const units = []; const sections = []; const t0 = now();
  doc.sections.forEach((sec, si) => {
    const S = { title: sec.title || `section ${si + 1}`, first: units.length, paragraphs: [] };
    sec.paragraphs.forEach((ptext, pi) => {
      const n = opts.normalize(ptext); const q = qualifiers(n.tokens);
      const seg = segment(q.tokens, { ...(opts.segmentOptions || {}), reader: opts.reader, kind: opts.kind, cache });
      const us = unitsFromSegments(seg, { offset: units.length, section: si, info: n.info, qualifiers: q.quals });
      us.forEach((u) => { u.paragraph = pi; });
      S.paragraphs.push({ text: ptext, first: units.length, count: us.length, ambiguous: seg.ambiguous, explain: seg.explain });
      units.push(...us);
    });
    S.count = units.length - S.first; sections.push(S);
  });
  return { title: doc.title, sections, units, cache, ms: now() - t0 };
}

const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

/** the document's circuit: one SOP file, a section wire per heading, conflicts looked for inside a section */
export function buildScript(read, opts = {}) {
  return buildCircuit(read.units, { ...opts, sections: read.sections.map((s) => ({ title: s.title, first: s.first })), conflictScope: (u) => u.section });
}

/**
 * build the diagram section by section. opts: {blocking: "stop" | "skip", conflicts: "ask" | "in-order", choices, from: section index}
 * Returns {checkpoints: [{section, depth, snapshot}], results: Map unit -> result, stoppedAt, waiting, state, ms}.
 */
export function runScript(scene, circuit, opts = {}) {
  const run = opts.run || { checkpoints: [], results: new Map(), state: null, start: { depth: scene.undo.length, snapshot: snapshot(scene) } };
  const t0 = now(); run.stoppedAt = null; run.waiting = null;
  const secs = circuit.sections.length ? circuit.sections : [{ title: null, first: 0 }];
  for (let k = opts.from || 0; k < secs.length; k++) {
    const first = secs[k].first, last = k + 1 < secs.length ? secs[k + 1].first : circuit.units.length;
    const only = new Set(); for (let i = first; i < last; i++) only.add(i);
    const r = executeCircuit(scene, circuit, { state: run.state, only, unread: "skip", blocking: opts.blocking || "stop", conflicts: opts.conflicts || "ask", choices: opts.choices });
    run.state = r.state;
    for (const x of r.results) run.results.set(x.unit, x);
    run.checkpoints[k] = { section: k, title: secs[k].title, depth: scene.undo.length, snapshot: snapshot(scene) };
    if (r.waiting) { run.stoppedAt = k; run.waiting = r.waiting; break; }
  }
  run.ms = now() - t0; return run;
}

/** undo back to the checkpoint after section k (k = -1: before the script); redo is kept by the editor's undo */
export function undoToCheckpoint(scene, run, k) {
  const depth = k < 0 ? run.start.depth : run.checkpoints[k].depth; let n = 0;
  while (scene.undo.length > depth) { undoScene(scene); n++; }
  return n;
}

/** units reachable from unit i over the circuit's order edges (what depends on it) */
export function dependents(circuit, i) {
  const out = new Map(); for (const [a, b] of circuit.edges) { if (!out.has(a)) out.set(a, []); out.get(a).push(b); }
  const seen = new Set([i]); const st = [i];
  while (st.length) { const k = st.pop(); for (const j of out.get(k) || []) if (!seen.has(j)) { seen.add(j); st.push(j); } }
  seen.delete(i); return [...seen].sort((a, b) => a - b);
}

/**
 * a change to one unit of the script: re-read only that unit, rebuild the circuit, return to the checkpoint before its section and re-plan
 * from there. session: {read, circuit, run, scene, reader, runOptions}. Returns {session, reread, dependents, replanned}.
 */
export function editUnit(session, i, newText) {
  const { read, reader } = session; const u = read.units[i]; const before = dependents(session.circuit, i);
  const reading = reader.read(newText); read.cache.set(newText, reading); let reread = 1;
  read.units[i] = { ...u, text: newText, reading, poor: null };
  const { poorReason } = session.segmentHelpers || {}; if (poorReason) read.units[i].poor = poorReason(reading);
  else if (!reading || ["no-sense", "abstain", "unknown-event"].includes(reading.status)) read.units[i].poor = `status ${reading && reading.status}`;
  const circuit = buildScript(read, session.circuitOptions || {});
  const k = u.section; undoToCheckpoint(session.scene, session.run, k - 1);
  // the state of the sections before k is kept; the rest is planned again
  const st = session.run.state;
  const keepUnit = (j) => read.units[j].section < k;
  for (const j of [...st.done]) if (!keepUnit(j)) st.done.delete(j);
  for (const j of [...st.failed]) if (!keepUnit(j)) st.failed.delete(j);
  const oldIntro = new Map(session.circuit.entities.map((e) => [e.id, e.intro.unit]));
  for (const id of [...st.ids.keys()]) if (!oldIntro.has(id) || !keepUnit(oldIntro.get(id))) st.ids.delete(id);
  st.entities = new Map(); for (const [j] of session.run.results) if (!keepUnit(j)) session.run.results.delete(j);
  session.run.checkpoints.length = Math.max(0, k);
  const run = runScript(session.scene, circuit, { ...(session.runOptions || {}), run: session.run, from: k });
  const after = dependents(circuit, i);
  return { session: { ...session, circuit, run }, reread, dependents: [...new Set([...before, ...after])].sort((a, b) => a - b), replanned: circuit.units.filter((x) => x.section >= k).map((x) => x.i) };
}

/** the document view's model: every sentence linked to what it did */
export function documentModel(read, circuit, run) {
  const counts = { units: 0, executed: 0, "out-of-world": 0, uncertain: 0, unresolved: 0, blocked: 0, skipped: 0, "not run": 0, answered: 0, dropped: 0 };
  const sections = read.sections.map((s, k) => ({ title: s.title, checkpoint: run && run.checkpoints[k] ? k : null, paragraphs: s.paragraphs.map((p) => ({
    text: p.text, ambiguous: p.ambiguous, sentences: circuit.units.slice(p.first, p.first + p.count).filter((u) => u.role === "command").map((u) => {
      const r = run && run.results.get(u.i); const mk = r ? r.mark : (unitMark(u, circuit.tau) || {}).mark || "not run";
      counts.units++; counts[mk] = (counts[mk] || 0) + 1;
      const links = circuit.links.filter((l) => l.kind !== "order" && l.kind !== "reference" && (l.from.unit === u.i || l.to.unit === u.i));
      return { unit: u.i, text: u.text, mark: mk, reason: r ? r.reason : (unitMark(u, circuit.tau) || {}).reason || null, did: r ? r.steps : [], notes: r ? r.notes : [], ids: r && r.ids ? r.ids : [],
        links: links.map((l) => ({ kind: l.kind, source: l.source, why: l.why || null, other: l.from.unit === u.i ? l.to.unit : l.from.unit })) };
    }) })) }));
  return { title: read.title, sections, counts, waiting: run ? run.waiting : null };
}

/** the large-model author's numbers (spec 18.3): instruction following (units read clearly) and the units lost with their reason */
export function authorReport(read, circuit, run) {
  const m = documentModel(read, circuit, run); const lost = []; let read_ = 0, total = 0, executed = 0;
  for (const s of m.sections) for (const p of s.paragraphs) for (const x of p.sentences) {
    total++; if (!["out-of-world", "uncertain"].includes(x.mark)) read_++; else lost.push({ text: x.text, mark: x.mark, reason: x.reason });
    if (x.mark === "executed") executed++;
  }
  const byReason = {}; for (const l of lost) { const k = l.mark === "out-of-world" ? (l.reason.startsWith("words outside") ? "a word outside the world" : l.reason.startsWith("an action") ? "an unknown action" : "not in the world's language") : "uncertain reading"; byReason[k] = (byReason[k] || 0) + 1; }
  for (const s of m.sections) for (const p of s.paragraphs) for (const x of p.sentences) if (x.mark === "unresolved") byReason["a reference that resolves to nothing"] = (byReason["a reference that resolves to nothing"] || 0) + 1;
  return { units: total, read: read_, instructionFollowing: total ? read_ / total : 0, executed, executedShare: read_ ? executed / read_ : 0, lost, byReason };
}

/** the diagram read back into the world's language (the second reading of the fidelity check, spec 18.3) */
export function sceneToText(scene) {
  const name = (c) => (c.label ? c.label : `the ${c.word}`); const out = [];
  for (const c of [...scene.components.values()].sort((a, b) => a.order - b.order)) {
    const attrs = [c.color, c.size, c.style].filter(Boolean).join(" ");
    out.push(`add a${/^[aeiou]/.test(attrs || c.word) ? "n" : ""} ${attrs ? attrs + " " : ""}${c.word}${c.label ? ` called ${c.label}` : ""} .`);
  }
  for (const e of scene.connectors.values()) { const a = scene.components.get(e.source), b = scene.components.get(e.target); if (a && b) out.push(`connect ${name(a)} to ${name(b)} .`); }
  return out;
}
