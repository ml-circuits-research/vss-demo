// circuit.js: the SOP circuit (spec 15.2-15.3). The units of a paragraph (or of a whole script) and the reader's frames become one SOP
// file of several wires with four kinds of links, each from a stated source:
//   reference   inside a unit: the $ references the reader writes (negation, a negated attribute, compound entities); source: reader
//   shared      across units: a description that names the same component becomes one entity wire referred to by every unit that touches
//               it; source: rule:recent (it / them = the primary entity of the previous unit), rule:label, rule:description (the only
//               entity of that kind), rule:section / rule:ordinal (a qualifier kept aside by the script pre-pass), rule:forward (created
//               later in the text, "before that"), rule:scene (a component already on the diagram), user (a link the user set)
//   discourse   a connective becomes an operator wire: then (after, scope), but (after, scope), so (cause, scope), because (scope, cause),
//               if (condition, consequence), unless (if with a not around the condition), says (speaker, scope); source: rule:connective
//   order       the order of the text: _sentence=<unit index> on every top-level wire (a wire that is the scope or the consequence of an
//               operator leaves it to the operator)
// Off the circuit the editor reads: the execution order (a topological sort, ties broken by text order, over: introduction -> use,
// earlier use -> delete, after -> scope, condition -> consequence, cause -> scope), a cycle (only a wrong link makes one; reported, nothing
// runs), and conflicts: two units that set the same role of the same entity to different values, found by the verdict of `sop diff`
// (tool/sop/diff.py, ported below) applied to the pair. Nothing else is inserted: no causal link the text does not state.
// DOM-free, deterministic; every link and every decision has its reason.
import { Wire, write } from "../vss/soplang.js";
import { KIND_OF, singular, sameWord, isPlural, COLORS, SIZES, STYLES } from "../editor/scene.js";
import { describe, resolve, labelKey } from "../editor/resolver.js";
import { plan as planFrame, execute as executePlan } from "../editor/planner.js";
import { minMargin } from "./segment.js";

export const OPERATORS = { then: ["after", "scope"], but: ["after", "scope"], so: ["cause", "scope"], because: ["scope", "cause"],
  if: ["condition", "consequence"], and: ["items"], not: ["scope"], says: ["speaker", "scope"], section: ["title"] };
// the roles a unit SETS on an existing entity (the conflict check): per event
export const SETTING = { change: ["color", "size", "style"], resize: ["size"], name: ["text"], move: ["region"], place: ["region"], arrange: ["layout"] };
const EDGE = new Set(["line", "arrow", "connector"]);
const PRON = new Set(["it", "them"]);
const SET_DETS = new Set(["all", "every", "each", "these", "those", "any"]);
const INF = Infinity;

// ------------------------------------------------------------------ sop diff, the part the circuit needs (tool/sop/diff.py)
/** flatten a frame into slots (event, negation, speaker.<k>, <role>, <role>.attr, <role>.det), as diff.flatten does for a wire */
export function flattenFrame(frame, margins = {}) {
  const slots = {}, ms = {};
  if (!frame || !frame.event) return { slots: null, margins: ms };
  slots.event = frame.event; slots.negation = frame.neg ? "yes" : "no";
  (frame.speakers || []).forEach((s, k) => { slots[`speaker.${k}`] = s; });
  const rep = (fl) => {
    if (fl == null) return null;
    if (fl === "?" || fl[0] === "asked") return "?";
    if (fl[0] === "word") return fl[1];
    if (fl[0] === "negword") return `not(${fl[1]})`;
    if (fl[0] === "set" || fl[0] === "alt") return fl.slice(1).map((x) => String(rep(x))).sort().join(fl[0] === "set" ? " & " : " | ");
    return fl.map(String).join("/");
  };
  for (const [r, fl] of Object.entries(frame.roles || {})) {
    if (fl && fl[0] === "entity") {
      slots[r] = fl[1];
      if (fl[2] != null) slots[`${r}.attr`] = rep(fl[2]);
      if (fl[3] != null) slots[`${r}.det`] = fl[3];
    } else slots[r] = rep(fl);
  }
  for (const [k, v] of Object.entries(margins || {})) if (typeof v === "number") ms[k] = v;
  return { slots, margins: ms };
}
/** diff.verdict: contradiction | unverifiable | compatible-incomplete | agreement, with the first slot the verdict rests on */
export function verdict(sa, ma, sb, mb, tau = 0.05) {
  const missing = Object.keys(sa).filter((k) => !(k in sb)), extra = Object.keys(sb).filter((k) => !(k in sa));
  const different = Object.keys(sa).filter((k) => k in sb && sa[k] !== sb[k]);
  const order = different.sort((x, y) => (x !== "event") - (y !== "event") || (x !== "negation") - (y !== "negation") || (x < y ? -1 : x > y ? 1 : 0));
  for (const k of order) {
    const la = ma[k] ?? INF, lb = mb[k] ?? INF;
    if (Math.min(la, lb) >= tau) return { verdict: "contradiction", role: k, values: [sa[k], sb[k]], margins: [la, lb] };
  }
  if (order.length) { const k = order[0]; return { verdict: "unverifiable", role: k, values: [sa[k], sb[k]], margins: [ma[k] ?? INF, mb[k] ?? INF] }; }
  if (missing.length || extra.length) { const k = [...missing, ...extra].sort()[0]; return { verdict: "compatible-incomplete", role: k, values: [sa[k] ?? null, sb[k] ?? null], margins: [ma[k] ?? INF, mb[k] ?? INF] }; }
  return { verdict: "agreement", role: null, values: null, margins: null };
}
/** two frames compared slot by slot (sop diff on one pair of wires) */
export function diffFrames(fa, ma, fb, mb, tau = 0.05) {
  const a = flattenFrame(fa, ma), b = flattenFrame(fb, mb);
  if (!a.slots || !b.slots) return { verdict: "unverifiable", role: "event", values: [fa && fa.event, fb && fb.event], margins: null };
  return verdict(a.slots, a.margins, b.slots, b.margins, tau);
}

// ------------------------------------------------------------------ units
/** segments of one segment() call -> circuit units, with global indices from `offset`; speakers are kept (they hold a says link) */
export function unitsFromSegments(seg, { offset = 0, section = null, info = {}, qualifiers = [] } = {}) {
  return seg.segments.map((s) => {
    const c = s.connective ? { ...s.connective, attach: s.connective.attach == null ? null : s.connective.attach + offset } : null;
    const quals = qualifiers.filter((q) => q.pos >= s.start && q.pos < s.end + 1).map((q) => ({ ...q }));
    return { i: s.i + offset, text: s.text, reading: s.reading, poor: s.poor, connective: c, sentence: s.sentence, role: s.role, section, info, qualifiers: quals };
  });
}

function creates(ev, role, fl) {
  if (role !== "object" || !fl || fl[0] !== "entity") return false;
  if (ev === "create") return true;
  if (ev === "place") { const det = fl[3]; return det === "a" || det === "an" || (!det && isPlural(fl[1]) && !SET_DETS.has(det)); }
  return false;
}
const ROLE_ORDER = ["source", "object", "target", "landmark"];
const roleRank = (r) => { const k = ROLE_ORDER.indexOf(r); return k < 0 ? ROLE_ORDER.length : k; };
const wordOf = (fl) => (fl && (fl[0] === "word" || fl[0] === "negword") ? fl[1] : null);
const isKind = (h) => !!KIND_OF[singular(h)];

/**
 * units -> circuit. opts: {scene (an editor scene to resolve against when the text has no antecedent), tau, conflictScope(unit) ->
 * key (default: one scope), sections: [{title, first}], world, userLinks: [{unit, role, entity}] }
 */
export function buildCircuit(units, opts = {}) {
  const tau = opts.tau ?? 0.05; const scope = opts.conflictScope || (() => 0);
  const ents = []; const byId = new Map(); let prev = null; const explain = [];
  const U = units.map((u) => ({ ...u, qualifiers: (u.qualifiers || []).map((q) => ({ ...q, used: false })), mentions: [], primary: null, creates: [], mark: null }));
  const newEntity = (fields) => { const e = { id: `e${ents.length + 1}`, alive: true, label: null, color: null, style: null, scene: null, pending: false, ...fields }; ents.push(e); byId.set(e.id, e); return e; };
  const pendingFor = new Map();                                       // "unit.role" -> entity created by a later unit, linked before it ran
  const readOk = (u) => u.role === "command" && !u.poor && u.reading && u.reading.frame && u.reading.frame.event;

  const forwardCreator = (from, h, label) => {
    for (let j = from + 1; j < U.length; j++) {
      const v = U[j]; if (!readOk(v)) continue; const fr = v.reading.frame; const ob = fr.roles && fr.roles.object;
      if (!creates(fr.event, "object", ob)) continue;
      const t = wordOf(fr.roles.text);
      if (label ? t && labelKey(v.info?.labels?.[t] ?? t) === labelKey(label) : sameWord(singular(ob[1]), singular(h))) return j;
    }
    return -1;
  };
  const resolveMention = (u, role, fl) => {
    const h = fl[1];
    if (PRON.has(h)) {
      if (prev) return { entity: prev, rule: "rule:recent", status: "ok", why: `"${h}" = the primary component of the previous unit` };
      return { entity: null, rule: "rule:recent", status: "none", why: `"${h}" has no previous unit to refer to` };
    }
    if (h === "everything" || h === "canvas" || h === "screen") return { entity: null, rule: "everything", status: "all", why: `"${h}" = every component` };
    const alive = ents.filter((e) => e.alive && !e.pending);
    let cands, rule;
    if (!isKind(h)) { cands = alive.filter((e) => e.label && labelKey(e.label) === labelKey(h)); rule = "rule:label"; }
    else {
      cands = alive.filter((e) => sameWord(e.word, singular(h))); rule = "rule:description";
      const q = (u.qualifiers || []).find((x) => !x.used && sameWord(singular(x.head), singular(h)));
      if (q) {
        q.used = true;
        if (q.section != null) { cands = cands.filter((e) => e.section === q.section - 1); rule = "rule:section"; }
        if (q.ordinal != null) { cands = cands.length >= q.ordinal ? [cands[q.ordinal - 1]] : []; rule = "rule:ordinal"; }
      }
      if (cands.length > 1 && fl[2] && fl[2][0] === "word") {
        const a = fl[2][1]; const f2 = cands.filter((e) => e.color === a || e.style === a || e.size === a); if (f2.length) cands = f2;
      }
    }
    if (cands.length === 1) return { entity: cands[0], rule, status: "ok", why: `${rule.slice(5)}: the only ${isKind(h) ? singular(h) : `component labelled "${h}"`}${rule === "rule:section" ? " of that section" : rule === "rule:ordinal" ? " at that place in the order of creation" : ""}` };
    if (cands.length > 1) return { entity: null, rule, status: "ambiguous", candidates: cands.map((e) => e.id), why: `several components fit "${h}"` };
    if (opts.scene) {
      const r = resolve(opts.scene, describe(fl));
      if (r.status === "ok") { const e = newEntity({ word: isKind(h) ? singular(h) : null, head: h, plural: r.ids.length > 1, section: u.section, intro: { unit: u.i, role }, scene: r.ids, det: fl[3] || null });
        if (!isKind(h)) e.label = h; return { entity: e, rule: "rule:scene", status: "ok", why: `on the diagram: ${r.rule}`, introHere: true }; }
    }
    const j = forwardCreator(U.indexOf(u), h, isKind(h) ? null : h);
    if (j >= 0) {
      const key = `${U[j].i}.object`; let e = pendingFor.get(key);
      if (!e) { const ob = U[j].reading.frame.roles.object; e = newEntity({ word: singular(ob[1]), head: ob[1], plural: isPlural(ob[1]), section: U[j].section, intro: { unit: U[j].i, role: "object" }, pending: true, det: ob[3] || null }); pendingFor.set(key, e); }
      return { entity: e, rule: "rule:forward", status: "ok", why: `created later in the text (unit ${U[j].i})` };
    }
    return { entity: null, rule, status: "none", why: `nothing on the diagram or in the text is "${h}"` };
  };

  for (const u of U) {
    if (u.role === "speaker") continue;
    if (!readOk(u)) continue;
    const fr = u.reading.frame; const ev = fr.event; const roles = fr.roles || {};
    // roles in the order the language writes them (source, object, target, landmark), so that a qualifier kept aside by the script
    // pre-pass goes to the mention it followed when two mentions share a kind word
    for (const [role, fl] of Object.entries(roles).sort((a, b) => roleRank(a[0]) - roleRank(b[0]))) {
      if (!fl || fl[0] !== "entity") continue;
      if (ev === "connect" && role === "object" && EDGE.has(singular(fl[1]))) { u.mentions.push({ role, filler: fl, local: true }); continue; }
      if (creates(ev, role, fl)) {
        const key = `${u.i}.${role}`; let e = pendingFor.get(key);
        if (e) e.pending = false; else e = newEntity({ word: singular(fl[1]), head: fl[1], plural: isPlural(fl[1]) || !!wordOf(roles.quantity), section: u.section, intro: { unit: u.i, role }, det: fl[3] || null });
        const t = wordOf(roles.text); if (t) e.label = u.info?.labels?.[t] ?? t;
        const a = fl[2] && fl[2][0] === "word" ? fl[2][1] : null; if (COLORS.includes(a)) e.color = a; else if (STYLES.includes(a)) e.style = a; else if (SIZES.includes(a)) e.size = a;
        u.mentions.push({ role, filler: fl, entity: e.id, create: true, rule: "reader", status: "ok" }); u.creates.push(e.id); continue;
      }
      const r = resolveMention(u, role, fl);
      u.mentions.push({ role, filler: fl, entity: r.entity ? r.entity.id : null, rule: r.rule, status: r.status, why: r.why, candidates: r.candidates || null, introHere: !!r.introHere });
    }
    for (const L of opts.userLinks || []) if (L.unit === u.i) {                       // a link the user set replaces the rule's
      const m = u.mentions.find((x) => x.role === L.role); if (m && byId.has(L.entity)) { m.entity = L.entity; m.rule = "user"; m.status = "ok"; m.why = "set by the user"; }
    }
    // effects on the entity table (what the text says the diagram becomes, for later references)
    const ent = (role) => { const m = u.mentions.find((x) => x.role === role && x.entity); return m ? byId.get(m.entity) : null; };
    const obj = ent("object"), src = ent("source");
    if (!fr.neg) {
      if (ev === "name" && obj && wordOf(roles.text)) { const t = wordOf(roles.text); obj.label = u.info?.labels?.[t] ?? t; }
      if (ev === "change" && obj) { for (const k of ["color", "style"]) if (wordOf(roles[k])) obj[k] = wordOf(roles[k]); }
      if (ev === "delete" && obj && !obj.scene) obj.alive = false;
      if (ev === "copy" && obj) {
        const c = newEntity({ word: obj.word, head: obj.head, plural: obj.plural, section: u.section, intro: { unit: u.i, role: "copy" }, label: obj.label, color: obj.color, style: obj.style, copyOf: obj.id });
        u.creates.push(c.id); u.copy = c.id;
      }
      if (ev === "group" && obj) {
        const t = wordOf(roles.text); const c = newEntity({ word: "container", head: "container", plural: false, section: u.section, intro: { unit: u.i, role: "group" }, label: t ? (u.info?.labels?.[t] ?? t) : null, members: obj.id });
        u.creates.push(c.id); u.group = c.id;
      }
    }
    // the primary entity, for "it" in the next unit
    const created = u.mentions.find((m) => m.create);
    u.primary = u.copy || u.group || (created && created.entity) || (obj && obj.id) || (src && src.id) || null;
    if (u.primary) prev = byId.get(u.primary);
  }

  // ---------------- links
  const links = []; const edges = [];
  const unitByI = new Map(U.map((u) => [u.i, u]));
  for (const u of U) for (const m of u.mentions) {
    if (m.local || !m.entity) { if (!m.local && m.filler) links.push({ kind: "reference", from: { unit: u.i, role: m.role }, to: { unit: u.i }, source: "reader" }); continue; }
    links.push({ kind: "reference", from: { unit: u.i, role: m.role }, to: { unit: u.i, entity: m.entity }, source: "reader" });
    const e = byId.get(m.entity);
    if (m.create || (e.intro.unit === u.i && e.intro.role === m.role)) continue;
    links.push({ kind: "shared", from: { unit: u.i, role: m.role }, to: { unit: e.intro.unit, role: e.intro.role }, entity: e.id, source: m.rule, why: m.why });
    if (!e.scene && e.intro.unit !== u.i && unitByI.has(e.intro.unit)) edges.push([e.intro.unit, u.i, "shared"]);
  }
  for (const d of U) {                                                // earlier uses of an entity run before its delete
    if (!readOk(d) || d.reading.frame.event !== "delete" || d.reading.frame.neg) continue;
    const m = d.mentions.find((x) => x.role === "object" && x.entity); if (!m) continue;
    for (const u of U) if (u.i < d.i && u.mentions.some((x) => x.entity === m.entity)) edges.push([u.i, d.i, "delete"]);
  }
  const discourse = [];
  for (const u of U) {
    const c = u.connective; if (!c || c.attach == null || !unitByI.has(c.attach)) continue;
    const other = unitByI.get(c.attach);
    let op = c.op, a, b;
    if (op === "then" || op === "but") { a = c.attach; b = u.i; }
    else if (op === "before") { op = "then"; a = u.i; b = c.attach; }
    else if (op === "so") { a = c.attach; b = u.i; }
    else if (op === "because") { a = u.i; b = c.attach; }                     // cause = this unit, scope = the unit it explains
    else if (op === "if" || op === "unless") { a = u.i; b = c.attach; }       // condition = this unit, consequence = the other
    else if (op === "says") { a = null; b = u.i; }
    else continue;
    if (op === "says") { discourse.push({ op, speaker: c.speaker, scope: b, words: c.words }); continue; }
    if (!other || other.role !== "command") continue;
    discourse.push({ op, a, b, words: c.words, negated: c.op === "unless" });
    links.push({ kind: "discourse", op, from: { unit: a }, to: { unit: b }, source: "rule:connective", why: `the connective "${(c.words || []).join(" ")}"` });
    if (op !== "because") edges.push([a, b, op]);
  }
  for (let k = 0; k + 1 < U.length; k++) links.push({ kind: "order", from: { unit: U[k].i }, to: { unit: U[k + 1].i }, source: "text" });

  // ---------------- order (Kahn, ties by text order) and cycles
  const idx = new Map(U.map((u, k) => [u.i, k])); const n = U.length;
  const out = Array.from({ length: n }, () => []); const indeg = new Array(n).fill(0); const seenE = new Set();
  for (const [a, b] of edges) { const ka = idx.get(a), kb = idx.get(b); const key = `${ka}>${kb}`; if (ka === kb || seenE.has(key)) continue; seenE.add(key); out[ka].push(kb); indeg[kb]++; }
  const ready = []; for (let k = 0; k < n; k++) if (!indeg[k]) ready.push(k);
  const order = [];
  while (ready.length) { ready.sort((x, y) => x - y); const k = ready.shift(); order.push(k); for (const j of out[k]) if (--indeg[j] === 0) ready.push(j); }
  const left = []; for (let k = 0; k < n; k++) if (!order.includes(k)) left.push(k);
  let cycle = null;
  if (left.length) {
    const L = new Set(left); let path = null;                             // one cycle among the nodes left, for the report
    for (const s of left) {
      const stack = [[s, [s]]]; const vis = new Set();
      while (stack.length && !path) { const [k, p] = stack.pop(); for (const j of out[k]) { if (!L.has(j)) continue; if (j === s) { path = p; break; } if (!vis.has(j)) { vis.add(j); stack.push([j, [...p, j]]); } } }
      if (path) break;
    }
    const pu = (path || left).map((k) => U[k].i);
    cycle = { nodes: left.map((k) => U[k].i), path: pu, text: `the links make a cycle: ${pu.map((i) => `unit ${i}`).join(" -> ")} -> unit ${pu[0]}; a link is wrong` };
    explain.push(cycle.text);
  }
  const orderUnits = [...order, ...left].map((k) => U[k].i);

  // ---------------- conflicts (sop diff inside the circuit)
  const conflicts = [];
  const settingSlots = (u) => {
    const fr = u.reading.frame; const ev = fr.event; if (fr.neg) return null;
    const m = u.mentions.find((x) => x.role === "object"); if (!m || !m.entity || m.create) return null;
    const s = {}, ms = {};
    for (const r of SETTING[ev] || []) { const w = wordOf((fr.roles || {})[r]); if (w != null) { s[r] = w; const mg = u.reading.margins && u.reading.margins[r]; if (typeof mg === "number") ms[r] = mg; } }
    return Object.keys(s).length ? { entity: m.entity, slots: s, margins: ms } : null;
  };
  const S = U.map((u) => (readOk(u) ? settingSlots(u) : null));
  for (let x = 0; x < U.length; x++) for (let y = x + 1; y < U.length; y++) {
    const a = S[x], b = S[y]; if (!a || !b || a.entity !== b.entity || scope(U[x]) !== scope(U[y])) continue;
    for (const r of Object.keys(a.slots).filter((k) => k in b.slots).sort()) {
      const v = verdict({ [r]: a.slots[r] }, a.margins, { [r]: b.slots[r] }, b.margins, tau);
      if (v.verdict === "contradiction" || v.verdict === "unverifiable")
        conflicts.push({ a: U[x].i, b: U[y].i, entity: a.entity, role: r, values: [a.slots[r], b.slots[r]], verdict: v.verdict, certain: v.verdict === "contradiction",
          key: `${U[x].i}-${U[y].i}-${r}`, text: `unit ${U[x].i} sets ${r} of ${a.entity} to ${a.slots[r]}, unit ${U[y].i} to ${b.slots[r]}${v.verdict === "unverifiable" ? " (one of the two readings is uncertain)" : ""}` });
    }
  }

  const circuit = { units: U, entities: ents, links, edges, discourse, order: orderUnits, cycle, conflicts, sections: opts.sections || [], explain, tau };
  circuit.wires = toWires(circuit, opts); circuit.sop = write([["world", opts.world || "diagram"], ["circuit", String(U.length)]], circuit.wires);
  return circuit;
}

// ------------------------------------------------------------------ the SOP file
function toWires(c, opts) {
  const wires = []; let nw = 0, nn = 0, nd = 0;
  const top = new Map(), evw = new Map(); const scoped = new Set();
  for (const d of c.discourse) scoped.add(d.op === "says" ? d.scope : d.b);   // a scope or a consequence: the operator carries _sentence
  const entWire = new Map(); const written = new Set();
  for (const e of c.entities) entWire.set(e.id, e.id);
  // ids first, so that operator wires can refer forward
  for (const u of c.units) {
    if (u.role === "speaker") continue;
    const fr = u.reading && u.reading.frame;
    const okr = !u.poor && fr && fr.event;
    const id = `w${++nw}`; top.set(u.i, id); evw.set(u.i, okr && fr.neg ? `w${++nw}` : id);   // a prohibition: not -> event
  }
  const opBefore = new Map();                                          // unit -> operator wires written just before it
  for (const d of c.discourse) {
    const at = d.op === "if" ? Math.min(d.a, d.b) : d.b; if (!opBefore.has(at)) opBefore.set(at, []); opBefore.get(at).push(d);
  }
  const secAt = new Map((c.sections || []).map((s, k) => [s.first, { ...s, id: `s${k + 1}` }]));
  const secOf = (u) => { let cur = null; for (const s of c.sections || []) if (s.first <= u.i) cur = s; return cur; };
  const valueOf = (u, fl, extra) => {
    if (fl == null) return "~";
    if (fl === "?" || fl[0] === "asked") return "?";
    if (fl[0] === "word") return fl[1];
    if (fl[0] === "negword") { const n = new Wire(`n${++nn}`, "not"); n.set("scope", fl[1]); extra.push(n); return ["ref", n.id]; }
    if (fl[0] === "set" || fl[0] === "alt") return [fl[0] === "set" ? "&" : "|", fl.slice(1).map((x) => valueOf(u, x, extra))];
    return String(fl[1]);
  };
  const entityWire = (e, fl, u, extra) => {
    const w = new Wire(e.id, "entity"); w.set("head", e.head || fl[1]);
    if (fl && fl[2]) w.set("attr", valueOf(u, fl[2], extra));
    if (fl && fl[3]) w.set("det", fl[3]);
    if (e.label && e.intro.unit === u.i) w.set("text", e.label);
    if (e.scene) w.set("_component", e.scene.join(","));
    if (e.copyOf) w.set("_copy_of", ["ref", e.copyOf]);
    return w;
  };
  for (const u of c.units) {
    if (u.role === "speaker") continue;
    const s = secAt.get(u.i); if (s) { const sw = new Wire(s.id, "section"); sw.set("title", s.title || `section ${s.id}`); wires.push(sw); }
    for (const d of opBefore.get(u.i) || []) {
      const w = new Wire(`d${++nd}`, d.op === "unless" ? "if" : d.op); const [k1, k2] = OPERATORS[d.op === "unless" ? "if" : d.op] || ["scope"];
      const extra = [];
      if (d.op === "says") { w.set("_sentence", String(d.scope)); w.set("speaker", d.speaker || "~"); w.set("scope", ["ref", top.get(d.scope)]); w.set("_link.scope", "rule:connective"); wires.push(w); continue; }
      const A = top.get(d.a), B = top.get(d.b);
      w.set("_sentence", String(d.op === "if" ? Math.min(d.a, d.b) : d.b));
      if (d.op === "if" && d.negated) { const n = new Wire(`n${++nn}`, "not"); n.set("scope", ["ref", A]); extra.push(n); w.set(k1, ["ref", n.id]); } else w.set(k1, ["ref", A]);
      w.set(k2, ["ref", B]); w.set(`_link.${k2}`, "rule:connective"); wires.push(w, ...extra);
    }
    const sec = secOf(u); const fr = u.reading && u.reading.frame; const okr = !u.poor && fr && fr.event;
    const head = new Wire(top.get(u.i), okr ? (fr.neg ? "not" : fr.event) : "unknown");
    head.set("_text", u.text);
    if (!scoped.has(u.i)) head.set("_sentence", String(u.i));
    if (sec) head.set("_section", (secAt.get(sec.first) || {}).id || "s?");
    if (!okr) {
      head.set("_status", (u.reading && u.reading.status) || "unread"); if (u.poor) head.set("_reason", u.poor); wires.push(head); continue;
    }
    let ew = head;
    if (fr.neg) { ew = new Wire(evw.get(u.i), fr.event); head.set("scope", ["ref", ew.id]); }
    if (fr.mood === "question" || (u.reading && u.reading.mood === "question")) head.set("_mood", "question");
    const extra = [];
    for (const [role, fl] of Object.entries(fr.roles || {})) {
      if (fl && fl[0] === "entity") {
        const m = u.mentions.find((x) => x.role === role);
        if (m && m.entity) {
          const e = c.entities.find((x) => x.id === m.entity);
          ew.set(role, ["ref", e.id]);
          if (!m.create && !(e.intro.unit === u.i && e.intro.role === role) && m.rule) head.set(`_link.${role}`, m.rule);
          if (!written.has(e.id)) { written.add(e.id); extra.push(entityWire(e, fl, u, extra)); }
        } else {
          const lw = new Wire(`n${++nn}`, "entity"); lw.set("head", fl[1]); if (fl[2]) lw.set("attr", valueOf(u, fl[2], extra)); if (fl[3]) lw.set("det", fl[3]);
          if (m && !m.local && m.status !== "all") head.set(`_link.${role}`, `unresolved:${m.status}`);
          ew.set(role, ["ref", lw.id]); extra.push(lw);
        }
      } else ew.set(role, valueOf(u, fl, extra));
    }
    if (u.copy && !written.has(u.copy)) { written.add(u.copy); const e = c.entities.find((x) => x.id === u.copy); extra.push(entityWire(e, null, u, extra)); }
    if (u.group && !written.has(u.group)) { written.add(u.group); const e = c.entities.find((x) => x.id === u.group); extra.push(entityWire(e, null, u, extra)); }
    wires.push(head); if (ew !== head) wires.push(ew); wires.push(...extra);
  }
  return wires;
}

/** the comparison keys of a circuit (the evaluation's view): shared links "u.role=>iu.irole", discourse "op:a->b" */
export function circuitKeys(c) {
  return { links: c.links.filter((l) => l.kind === "shared").map((l) => `${l.from.unit}.${l.from.role}=>${l.to.unit}.${l.to.role}`).sort(),
    discourse: c.discourse.filter((d) => d.op !== "says").map((d) => `${d.op}:${d.a}->${d.b}`).sort() };
}

/** independent groups of units: units that share no entity and no discourse link can be planned in any order (spec 15.3) */
export function components(c) {
  const parent = new Map(c.units.map((u) => [u.i, u.i])); const find = (x) => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x))), parent.get(x)));
  const join = (a, b) => parent.set(find(a), find(b));
  for (const l of c.links) if ((l.kind === "shared" || l.kind === "discourse") && parent.has(l.from.unit) && parent.has(l.to.unit)) join(l.from.unit, l.to.unit);
  const groups = new Map(); for (const u of c.units) { const r = find(u.i); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(u.i); }
  return [...groups.values()];
}

// ------------------------------------------------------------------ execution: the whole paragraph as one plan, one undo entry
/** why a unit cannot run as read: the mark and its reason, or null */
export function unitMark(u, tau = 0.05) {
  if (u.role === "speaker") return { mark: "speaker", reason: "the speaker of a report" };
  if (u.poor || !u.reading || !u.reading.frame || !u.reading.frame.event) {
    const st = (u.reading && u.reading.status) || "unread"; const unpl = (u.reading && u.reading.unplaced) || [];
    if (st === "abstain" || (u.poor && /core role/.test(u.poor))) return { mark: "uncertain", reason: `the reader abstains (${u.poor || st})` };
    return { mark: "out-of-world", reason: unpl.length ? `words outside the world: ${unpl.join(", ")}` : st === "unknown-event" ? "an action outside the world" : `not in the world's language (${u.poor || st})` };
  }
  const mm = minMargin(u.reading); if (mm < tau) return { mark: "uncertain", reason: `margin ${mm.toFixed(3)} under tau ${tau}` };
  const bad = u.mentions.find((m) => !m.local && !m.create && m.status !== "ok" && m.status !== "all");
  if (bad) return { mark: "unresolved", reason: bad.status === "ambiguous" ? `which one? ${bad.why}` : `a reference that resolves to nothing: ${bad.why}` };
  return null;
}

const sameSet = (a, b) => a.length === b.length && [...a].sort().join() === [...b].sort().join();

/** plan one unit with the circuit's bindings: a description the scene would resolve differently is bound to the linked components */
export function planBound(scene, u, state, opts = {}) {
  const fr = u.reading.frame; const roles = { ...(fr.roles || {}) }; const notes = [];
  const restoreLabels = []; const sel0 = scene.selection; let usedSel = false; let alias = 0;
  for (const m of u.mentions) {
    if (m.local || m.create || !m.entity || m.status !== "ok") continue;
    const e = state.entities.get(m.entity) || {}; const ids = (e.scene || state.ids.get(m.entity) || []).filter((id) => scene.components.has(id));
    if (!ids.length) return { error: `the ${m.filler[1]} is not on the diagram (the unit that creates it did not run)` };
    const now = resolve(scene, describe(m.filler));
    if (now.status === "ok" && sameSet(now.ids, ids)) continue;
    if (ids.length === 1) {
      const c = scene.components.get(ids[0]); const tag = `__circuit_${++alias}`; restoreLabels.push([c, c.label]); c.label = tag;
      roles[m.role] = ["entity", tag, null, null]; notes.push(`${m.role} bound to ${ids[0]} by the circuit (${m.rule})`);
    } else if (!usedSel) {
      usedSel = true; scene.selection = [...ids]; roles[m.role] = ["entity", "them", null, null]; notes.push(`${m.role} bound to ${ids.join(", ")} by the circuit (${m.rule})`);
    } else notes.push(`${m.role}: a second set binding is not possible in one unit; the description is resolved on the diagram`);
  }
  let p;
  try { p = (opts.plan || planFrame)(scene, { ...fr, roles }, u.info || {}); }
  finally { for (const [c, l] of restoreLabels) c.label = l; scene.selection = sel0; }
  // a lock keeps a description that lasts: a pronoun or a circuit binding becomes the component's label, else its kind word (the
  // planner checks locks by description, so a lock on "the box" covers every box: stated in the explanation)
  for (const st of p.steps) if (st.op === "lock" && st.desc && /^__circuit_|^them$|^it$/.test(st.desc.head)) {
    const m = u.mentions.find((x) => x.role === "object" || x.role === "source"); const ids = m ? (state.ids.get(m.entity) || []) : [];
    const c = ids.length ? scene.components.get(ids[0]) : null;
    st.desc = c && c.label ? { head: c.label, attr: null, det: null } : c ? { head: ids.length > 1 ? `${c.word}s` : c.word, attr: null, det: "the" } : st.desc;
    st.explain = `lock: never ${st.action} ${c && c.label ? `"${c.label}"` : `the ${st.desc.head}`}`;
  }
  return { plan: p, notes };
}

/** answer a question unit from the diagram (spec 15.3) */
export function answer(scene, ids, role) {
  const cs = ids.map((id) => scene.components.get(id)).filter(Boolean);
  if (!cs.length) return "there is no such component";
  return cs.map((c) => `${c.label ? `"${c.label}"` : `the ${c.word}`}: ${role} ${c[role] ?? "not set"}`).join("; ");
}

/**
 * execute the circuit on the scene in its order. opts: {state (kept across calls: {ids, entities, done}), only: Set of unit indices,
 * unread: "stop" | "skip", blocking: "stop" | "skip", conflicts: "ask" | "in-order", choices: {conflict key: unit to keep}, oneUndo: true}
 * Returns {results: [{unit, mark, reason, steps, notes}], stoppedAt, waiting, state}.
 */
export function executeCircuit(scene, c, opts = {}) {
  const state = opts.state || { ids: new Map(), entities: new Map(), done: new Set(), failed: new Set() };
  for (const e of c.entities) state.entities.set(e.id, e);
  const results = []; const tau = c.tau ?? 0.05;
  if (c.cycle) return { results, stoppedAt: null, waiting: { cycle: c.cycle }, state };
  const choices = opts.choices || {}; const dropped = new Set();
  const open = c.conflicts.filter((k) => !(k.key in choices) && (!opts.only || opts.only.has(k.a) || opts.only.has(k.b)));
  for (const k of c.conflicts) if (k.key in choices) dropped.add(choices[k.key] === k.a ? k.b : k.a);
  if (open.length && (opts.conflicts || "ask") === "ask") return { results, stoppedAt: null, waiting: { conflicts: open }, state };
  const unitByI = new Map(c.units.map((u) => [u.i, u]));
  const conditionOf = new Map(c.discourse.filter((d) => d.op === "if").map((d) => [d.b, d]));
  const u0 = scene.undo.length; let stoppedAt = null;
  for (const i of c.order) {
    if (opts.only && !opts.only.has(i)) continue;
    if (state.done.has(i)) continue;
    const u = unitByI.get(i); if (u.role === "speaker") continue;
    const res = { unit: i, mark: null, reason: null, steps: [], notes: [] }; results.push(res);
    if (dropped.has(i)) { res.mark = "dropped"; res.reason = "the user kept the other unit of a conflict"; state.done.add(i); continue; }
    const mk = unitMark(u, tau);
    if (mk) {
      res.mark = mk.mark; res.reason = mk.reason; state.failed.add(i);
      const stop = mk.mark === "out-of-world" ? (opts.unread || "stop") === "stop" : (opts.blocking || "stop") === "stop";
      if (stop) { stoppedAt = i; break; } continue;
    }
    const cond = conditionOf.get(i);
    if (cond && !state.done.has(cond.a)) { res.mark = "skipped"; res.reason = `its condition (unit ${cond.a}) did not run`; state.failed.add(i); continue; }
    if (u.reading.frame.mood === "question" || u.reading.mood === "question") {
      const m = u.mentions.find((x) => x.entity); const ids = m ? (state.ids.get(m.entity) || []) : [];
      const asked = Object.entries(u.reading.frame.roles || {}).find(([, v]) => v === "?" || (v && v[0] === "asked"));
      res.mark = "answered"; res.reason = answer(scene, ids, asked ? asked[0] : "label"); state.done.add(i); continue;
    }
    const b = planBound(scene, u, state, opts);
    if (b.error) { res.mark = "skipped"; res.reason = b.error; state.failed.add(i); if ((opts.blocking || "stop") === "stop") { stoppedAt = i; break; } continue; }
    const p = b.plan; res.notes.push(...b.notes); res.steps = p.steps.map((s) => s.explain);
    if (p.questions.length || p.blocked.length) {
      res.mark = "blocked"; res.reason = [...p.questions.map((q) => q.text), ...p.blocked.map((x) => x.text)].join("; "); state.failed.add(i);
      if ((opts.blocking || "stop") === "stop") { stoppedAt = i; break; } continue;
    }
    const r = (opts.execute || executePlan)(scene, p); res.notes.push(...(r.notes || []));
    if (u.creates.length || u.mentions.some((m) => m.create)) {
      const ent = u.copy || u.group || (u.mentions.find((m) => m.create) || {}).entity;
      if (ent) state.ids.set(ent, [...scene.lastTouched]);
    }
    res.ids = [...scene.lastTouched]; res.mark = "executed"; state.done.add(i);
  }
  if (opts.oneUndo !== false && scene.undo.length > u0 + 1) scene.undo.splice(u0 + 1);   // the paragraph is one undo entry
  return { results, stoppedAt, waiting: stoppedAt != null ? { unit: stoppedAt } : null, state };
}
