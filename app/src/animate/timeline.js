// timeline.js: the diagram in time (spec 19.1-19.2). Frames of the animation world (one sentence's reading each) become UNITS; every unit
// gets a start and an end from linear constraints solved by Kiwi (Cassowary, app/vendor/kiwi, BSD-3), the solver geometry.js uses for
// positions: e = s + D and s >= 0 are required, the user's temporal relations are strong, the implicit "after the previous unit" of a
// narration is a DEFAULT strength between strong and medium, keeping the rest of the timeline where it was after a correction is medium.
// A correction re-reads one unit, changes its constraints, and the solver moves only what depends on it. Every unit carries the
// constraints that placed it as text (the timeline panel). DOM-free and deterministic. The semantics are written out in README.md
// ("Semantics"), the same contract as training/worlds/animation/semantics.py, which computes the gold timelines of the scripted suite.
import * as kiwi from "../../vendor/kiwi/kiwi.js";
import { describe, resolve as resolveEditor, labelKey } from "../editor/resolver.js";
import { singular, createScene } from "../editor/scene.js";
import { place } from "../editor/geometry.js";

export const DEFAULT_MS = { appear: 500, disappear: 500, fade_in: 1000, fade_out: 1000, blink: 600, pulse: 800, rotate: 1000, highlight: 800,
  travel: 1000, move: 1000, change: 800, wait: 1000, grow: 600, shrink: 600, walk: 1500, jump: 600, wave: 800, turn: 500, nod: 500, shake: 600, bounce: 800 };
export const CLOSED_MS = { quickly: 300, slowly: 2000, instantly: 0 };
export const SPEED = { slow: 1.5, normal: 1, fast: 0.5, slower: 1.5, faster: 1 / 1.5, twice_as_fast: 0.5, half_as_fast: 2 };
export const RELATIVE_SPEED = new Set(["slower", "faster", "twice_as_fast", "half_as_fast"]);
export const SMOOTH_DEFAULT = new Set(["move", "walk", "grow", "shrink"]);
export const TIMED = new Set(Object.keys(DEFAULT_MS));
export const FILM = new Set(["play", "pause", "rewind", "loop"]);
export const TRAVELLER_WORDS = new Set(["dot", "envelope", "packet", "token", "request", "answer", "message", "ball"]);
export const CHARACTER_WORDS = new Set(["robot", "figure", "person", "car"]);
// the strength of the implicit start: below the user's words (strong), above keeping the old place (medium)
export const DEFAULT_STRENGTH = kiwi.Strength.create(0.5, 0, 0);
const STRENGTH_NAME = (s) => (s === kiwi.Strength.required ? "required" : s === kiwi.Strength.strong ? "strong" : s === DEFAULT_STRENGTH ? "default" : s === kiwi.Strength.medium ? "medium" : "weak");

const word = (f) => (f && (f[0] === "word" || f[0] === "negword") ? f[1] : null);
const num = (f, info) => { const w = word(f); if (w == null) return null; const v = info?.numbers?.[w]; return Number(v ?? w); };
const toMs = (x, unit) => Math.round(unit === "ms" ? x : x * 1000);
const fmt = (ms) => `${+(ms / 1000).toFixed(3)} s`;

// a plain JSON scene (training/data/animation/eval/*.jsonl, export.js) as an editor scene (src/editor/scene.js)
export function sceneFromData(d) {
  const s = createScene({ width: d.width, height: d.height });
  for (const c of d.components) s.components.set(c.id, { parent: null, color: null, style: null, size: null, ...c, box: { ...c.box } });
  for (const k of d.connectors) s.connectors.set(k.id, { style: "solid", label: null, ...k });
  s.counter = s.components.size + s.connectors.size; return s;
}
export function sceneToData(s) {
  return { width: s.width, height: s.height, components: [...s.components.values()].map((c) => ({ ...c, box: { ...c.box } })), connectors: [...s.connectors.values()].map((k) => ({ ...k })) };
}

export function createTimeline(scene) {
  return { scene, units: [], travellers: new Map(), locks: [], film: { loop: false, repeat: 1, commands: [] }, times: new Map(), end: 0, conflicts: [], log: [], solved: false };
}

// ------------------------------------------------------------------ entities: components, connectors, travellers
function travellerOf(tl, ent, create) {
  const d = describe(ent); const head = singular(d.head);
  if (create && (d.det === "a" || d.det === "an")) { const id = `t${tl.travellers.size + 1}`; tl.travellers.set(id, { id, word: head, color: d.attr?.value || null }); return { ids: [id], rule: `a new ${head} (a traveller)` }; }
  const known = [...tl.travellers.values()].reverse().find((t) => t.word === head);
  if (known) return { ids: [known.id], rule: `the ${head}: the latest traveller of that word` };
  if (create) { const id = `t${tl.travellers.size + 1}`; tl.travellers.set(id, { id, word: head, color: d.attr?.value || null }); return { ids: [id], rule: `the ${head}: none yet, so a new traveller` }; }
  return { ids: [], rule: `there is no ${head} in the animation`, error: true };
}
// components through the editor's resolver (spec 10.1); words the editor's KIND_OF does not know yet (characters) and connectors by kind
export function resolveEntity(tl, ent, { traveller = false, create = false } = {}) {
  if (!ent) return { ids: [], rule: "nothing named", error: true };
  const d = describe(ent); const head = singular(d.head);
  if (traveller || TRAVELLER_WORDS.has(head) || [...tl.travellers.values()].some((t) => t.word === head)) return travellerOf(tl, ent, create);
  const r = resolveEditor(tl.scene, d);
  if (r.status === "ok") return { ids: r.ids, rule: r.rule };
  if (r.status === "ambiguous") {                                    // "the api" beside a service: the exact word wins over a synonym (stated)
    const exact = r.ids.filter((id) => tl.scene.components.get(id).word === head);
    if (exact.length === 1 && !(d.det === "all" || d.det === "every" || d.head !== head)) return { ids: exact, rule: `the ${head} (the exact word, over its synonyms)` };
  }
  if (r.status === "ambiguous") return { ids: r.ids, rule: `which ${d.head}? (${r.ids.join(", ")})`, error: true, ambiguous: true };
  const byWord = [...tl.scene.components.values()].filter((c) => c.word === head || labelKey(c.label) === labelKey(d.head));
  if (byWord.length === 1) return { ids: [byWord[0].id], rule: `the component that is a ${head}` };
  const conns = [...tl.scene.connectors.values()].filter((k) => k.word === head || (singular(d.head) === k.kind && !k.word));
  if (conns.length === 1 || (conns.length && (d.det === "all" || d.head !== head))) return { ids: conns.map((k) => k.id), rule: `the ${d.head} (connector${conns.length > 1 ? "s" : ""})` };
  return { ids: byWord.map((c) => c.id), rule: byWord.length ? `which ${head}?` : `there is no ${d.head}`, error: true };
}
const involves = (u, ids) => [...u.subject, ...(u.nodes || [])].some((x) => ids.includes(x));
// "after the box" = the latest EARLIER unit acting on the box, else the first later one
function refUnit(tl, ids, index) {
  for (let i = index - 1; i >= 0; i--) if (involves(tl.units[i], ids)) return tl.units[i].id;
  for (let i = index + 1; i < tl.units.length; i++) if (involves(tl.units[i], ids)) return tl.units[i].id;
  return null;
}

// ------------------------------------------------------------------ frames -> units, locks, film commands
// returns {kind: "unit" | "lock" | "film" | "question" | "correction" | "error", ...} with the reasons as text
export function add(tl, frame, info = {}) {
  const ev = frame.event; const r = frame.roles || {};
  if (frame.mood === "question") return { kind: "question", frame };
  if (frame.neg) return addLock(tl, frame);
  if (FILM.has(ev)) {
    const c = { command: ev, start: word(r.start) === "beginning" ? 0 : r.start ? toMs(num(r.start, info), word(r.unit)) : null };
    if (ev === "loop") { if (r.repeat) tl.film.repeat = Number(word(r.repeat)); else tl.film.loop = true; }
    if (r.landmark) { const res = resolveEntity(tl, r.landmark); c.landmark = res.ids[0] || null; }
    tl.film.commands.push(c); return { kind: "film", command: c, text: `${ev}${c.start != null ? " from " + fmt(c.start) : ""}${ev === "loop" ? (r.repeat ? ` ${word(r.repeat)} times` : " forever") : ""}` };
  }
  if (ev === "retime") return correct(tl, frame, info);
  if (!TIMED.has(ev)) return { kind: "error", text: `"${ev}" is not an action in time (the legend's motions: ${[...TIMED].join(", ")})` };
  const u = { id: `u${tl.units.length + 1}`, event: ev, index: tl.units.length, frame, info, notes: [] };
  if (ev === "travel") {
    const t = resolveEntity(tl, r.traveller, { traveller: true, create: true }); u.subject = t.ids; u.notes.push(t.rule);
    if (r.path) { const p = resolveEntity(tl, r.path); const k = tl.scene.connectors.get(p.ids[0]); if (!k) return fail(tl, u, p.rule); u.nodes = [k.source, k.target]; u.notes.push(`along ${p.rule}`); }
    else {
      const parts = [r.source, r.via, r.target].filter(Boolean).map((e) => resolveEntity(tl, e));
      const bad = parts.find((p) => p.error); if (bad) return fail(tl, u, bad.rule); u.nodes = parts.map((p) => p.ids[0]);
    }
    if (u.nodes.length < 2) return fail(tl, u, "a travel needs a source and a target, or a connector to travel along");
  } else if (ev === "wait") u.subject = [];
  else { const o = resolveEntity(tl, r.object); if (o.error) return fail(tl, u, o.rule); u.subject = o.ids; u.notes.push(o.rule); }
  if (r.target && (ev === "walk" || ev === "turn")) { const t = resolveEntity(tl, r.target); if (t.error) return fail(tl, u, t.rule); u.target = t.ids[0]; }
  const err = setTiming(tl, u, r, info, true); if (err) return fail(tl, u, err);
  if (ev === "move") { const m = planMove(tl, u, r, info); if (m) return fail(tl, u, m); }
  if (ev === "walk" && u.target) planWalk(tl, u);
  tl.units.push(u); tl.solved = false;
  return { kind: "unit", unit: u, text: `${u.id}: ${ev} ${u.subject.join(", ")}` };
}
function fail(tl, u, text) { return { kind: "error", text, unit: null }; }

function addLock(tl, frame) {
  const ev = frame.event; const r = frame.roles || {}; let lock = null;
  const one = (e, opts) => { const x = resolveEntity(tl, e, opts); return x.error ? null : x.ids[0]; };
  if (ev === "overlap") lock = { rule: "no-overlap", subject: one(r.landmark), text: "never let anything overlap" };
  else if (ev === "leave") lock = { rule: "on-connectors", subject: one(r.traveller, { traveller: true }), text: "never let it leave the connectors" };
  else if (ev === "disappear" || ev === "fade_out") lock = { rule: "visible", subject: one(r.object), text: "must stay visible" };
  else if (ev === "move") lock = { rule: "no-move", subject: one(r.object), text: "must not move" };
  else lock = { rule: `no-${ev}`, subject: one(r.object), text: `never ${ev}`, unchecked: true };
  if (!lock.subject) return { kind: "error", text: `the prohibition names nothing I can find` };
  lock.event = ev; tl.locks.push(lock); return { kind: "lock", lock, text: `lock: ${lock.subject} ${lock.text}${lock.unchecked ? " (no per-frame check for this action yet; checked at the command)" : ""}` };
}

// timing roles of a frame on a unit; fresh = a new unit (defaults), else a correction (only what the frame says changes)
function setTiming(tl, u, r, info, fresh) {
  const unit = word(r.unit);
  if (r.duration || fresh) {
    const d = r.duration;
    if (d && CLOSED_MS[word(d)] != null) Object.assign(u, { base: CLOSED_MS[word(d)], perHop: false, explicitD: true, dText: word(d) });
    else if (d) Object.assign(u, { base: toMs(num(d, info), unit), perHop: word(r.per) === "per_hop", explicitD: true, dText: `${word(d)} ${unit || "s"}${word(r.per) === "per_hop" ? " per hop" : ""}` });
    else Object.assign(u, { base: DEFAULT_MS[u.event], perHop: u.event === "travel", explicitD: false, dText: `the default of ${u.event}` });
  }
  if (fresh) Object.assign(u, { factor: 1, factorText: [], repeat: 1, forever: false, easing: SMOOTH_DEFAULT.has(u.event) ? "smoothly" : "linearly" });
  if (r.speed) { const s = word(r.speed); u.factor = RELATIVE_SPEED.has(s) ? u.factor * SPEED[s] : SPEED[s]; u.factorText = RELATIVE_SPEED.has(s) ? [...u.factorText, s] : [s]; }
  if (r.easing) u.easing = word(r.easing);
  if (r.repeat) { const rv = word(r.repeat); u.forever = rv === "forever"; u.repeat = rv === "once" || rv === "forever" ? 1 : Number(rv); }
  if (r.start || r.tempo || fresh) {
    const off = r.offset ? toMs(num(r.offset, info), unit) : 0; const tempo = word(r.tempo);
    if (r.start && word(r.start) !== "beginning") u.rule = { kind: "at", t: toMs(num(r.start, info), unit) };
    else if (tempo === "then") u.rule = { kind: "after", ref: "previous", o: 0, said: "then" };
    else if (["after", "before", "with", "while", "when"].includes(tempo)) {
      const res = resolveEntity(tl, r.ref); if (res.error) return res.rule;
      u.rule = { kind: tempo, refIds: res.ids, o: off, said: `${tempo} ${describe(r.ref).head}` };
      if (tempo === "when") { u.rule.trigger = word(r.trigger) || "finishes"; if (r.landmark) { const lm = resolveEntity(tl, r.landmark); if (lm.error) return lm.rule; u.rule.at = lm.ids[0]; } }
    } else u.rule = { kind: "default" };
  }
  return null;
}

// a move's target, from the position after the earlier moves (script order), through the editor's geometry (spec 8.2)
function planMove(tl, u, r, info) {
  const id = u.subject[0]; const c = tl.scene.components.get(id); if (!c) return "only components move";
  const from = { ...positionAfterMoves(tl, id, u.index) };
  const slots = { direction: word(r.direction), amount: r.distance ? num(r.distance, info) : 40, unit: "px", region: word(r.region), relation: word(r.relation) };
  let lm = null; if (r.landmark) { const L = resolveEntity(tl, r.landmark); if (L.error) return L.rule; lm = positionAfterMoves(tl, L.ids[0], u.index); }
  if (!slots.region && !slots.relation && !slots.direction) slots.direction = "right";
  const pos = place(tl.scene, { ...from }, slots, lm, { moving: id });
  u.from = from; u.to = { ...from, x: pos.x, y: pos.y }; u.notes.push(`target: ${pos.constraints.filter((t) => !/canvas|>= 0|<=/.test(t)).join("; ")}${pos.note ? "; " + pos.note : ""}`);
  return null;
}
// a walk ends beside its target, on the side the walker comes from, feet on the target's bottom line (a convention of the world)
function planWalk(tl, u) {
  const id = u.subject[0]; const from = positionAfterMoves(tl, id, u.index); const T = positionAfterMoves(tl, u.target, u.index); const W = tl.scene.width, H = tl.scene.height;
  const left = from.x + from.w / 2 <= T.x + T.w / 2;
  const x = left ? T.x - from.w - 12 : T.x + T.w + 12, y = T.y + T.h - from.h;
  u.from = { ...from }; u.to = { ...from, x: Math.min(Math.max(x, 0), W - from.w), y: Math.min(Math.max(y, 0), H - from.h) }; u.facing = left ? 1 : -1;
  u.notes.push(`walks to the ${left ? "left" : "right"} side of ${u.target}`);
}
export function positionAfterMoves(tl, id, beforeIndex = Infinity) {
  let b = { ...tl.scene.components.get(id).box };
  for (const v of tl.units) if (v.index < beforeIndex && (v.event === "move" || v.event === "walk") && v.subject[0] === id && v.to) b = { ...v.to };
  return b;
}

// ------------------------------------------------------------------ corrections (spec 19.2): re-read one unit, re-solve, report what moved
export function findUnitFor(tl, frame) {
  const r = frame.roles || {}; const ent = r.traveller || r.object; if (!ent) return null;
  const res = resolveEntity(tl, ent, { traveller: !!r.traveller }); if (res.error) return null;
  for (let i = tl.units.length - 1; i >= 0; i--) { const u = tl.units[i]; if ((frame.event === "retime" || u.event === frame.event) && u.subject.some((x) => res.ids.includes(x))) return u; }
  return null;
}
export function correct(tl, frame, info = {}) {
  if (!tl.solved) solve(tl);
  const u = findUnitFor(tl, frame); if (!u) return { kind: "error", text: "there is no unit of that action to correct" };
  const before = new Map([...tl.times].map(([k, v]) => [k, { ...v }]));
  const r = frame.roles || {}; let rr = r;
  if (frame.event === "retime") { const lemma = frame.lemma || frame.verb; rr = { speed: r.speed || ["word", lemma === "slow_down" ? "slower" : "faster"] }; }
  const saved = JSON.stringify({ ...u, frame: null, info: null });
  const err = setTiming(tl, u, rr, info, false);
  if (err) { Object.assign(u, JSON.parse(saved), { frame: u.frame, info: u.info }); return { kind: "error", text: err }; }
  if (u.event === "move" && (r.direction || r.region || r.relation || r.distance)) planMove(tl, u, r, info);
  u.corrections = [...(u.corrections || []), frame];
  solve(tl, { stay: before });
  const changed = tl.units.filter((v) => { const a = before.get(v.id), b = tl.times.get(v.id); return !a || a.start !== b.start || a.end !== b.end; }).map((v) => v.id);
  const deps = dependents(tl, u.id);
  const stray = changed.filter((x) => x !== u.id && !deps.includes(x));
  return { kind: "correction", unit: u, changed, dependents: deps, stray,
    text: `re-read ${u.id}; ${changed.length ? "moved " + changed.join(", ") : "nothing moved"}${stray.length ? `; NOT dependents but moved: ${stray.join(", ")}` : ""}` };
}
// what depends on a unit: start rules that name it, the default chain, the push of a 'before'
export function dependents(tl, uid) {
  const edges = new Map(tl.units.map((u) => [u.id, new Set()]));
  for (const u of tl.units) {
    const k = u.rule.kind;
    if (k === "default") { if (u.index > 0) edges.get(tl.units[u.index - 1].id).add(u.id); continue; }
    if (k === "at") continue;
    const R = ruleRef(tl, u); if (!R) continue; edges.get(R).add(u.id); if (k === "before") edges.get(u.id).add(R);
  }
  const seen = new Set(); const todo = [uid];
  while (todo.length) for (const v of edges.get(todo.pop()) || []) if (!seen.has(v) && v !== uid) { seen.add(v); todo.push(v); }
  return tl.units.map((u) => u.id).filter((x) => seen.has(x));
}

// ------------------------------------------------------------------ solving
function ruleRef(tl, u) {
  if (u.rule.ref === "previous") return u.index > 0 ? tl.units[u.index - 1].id : null;
  if (u.rule.refIds) return refUnit(tl, u.rule.refIds, u.index);
  return null;
}
export function hops(u) { return u.event === "travel" ? u.nodes.length - 1 : 1; }
export function durationOf(tl, u, seen = new Set()) {
  if (u.rule?.kind === "while" && !u.explicitD) {
    const R = ruleRef(tl, u); if (R && !seen.has(u.id)) { seen.add(u.id); return durationOf(tl, tl.units.find((v) => v.id === R), seen); }
  }
  const base = u.perHop ? u.base * hops(u) : u.base;
  return Math.round(base * u.factor) * u.repeat;
}
function durationText(tl, u, D) {
  if (u.rule?.kind === "while" && !u.explicitD) return `duration = the duration of ${ruleRef(tl, u)} = ${fmt(D)} (while)`;
  const parts = [`${u.dText}${u.perHop ? ` x ${hops(u)} hop${hops(u) > 1 ? "s" : ""}` : ""}`];
  if (u.factor !== 1) parts.push(`x ${+u.factor.toFixed(4)} (${u.factorText.join(", then ")})`);
  if (u.repeat > 1) parts.push(`x ${u.repeat} times`);
  return `duration = ${parts.join(" ")} = ${fmt(D)}${u.forever ? " per cycle, repeated to the end of the film" : ""}`;
}

// solve(tl, {stay}) -> tl.times: Map id -> {start, end, reasons: [text]}; tl.end; tl.conflicts
export function solve(tl, { stay = null } = {}) {
  const S = new kiwi.Solver(); const s = new Map(), e = new Map(), D = new Map(); const reasons = new Map(); const checks = [];
  const C = (expr, op, strength, uid, text, check) => { S.addConstraint(new kiwi.Constraint(expr, op, undefined, strength)); reasons.get(uid).push(`${text} [${STRENGTH_NAME(strength)}]`); if (check) checks.push({ uid, text, check, strength }); };
  const X = (...terms) => new kiwi.Expression(...terms);
  for (const u of tl.units) { s.set(u.id, new kiwi.Variable(`${u.id}.s`)); e.set(u.id, new kiwi.Variable(`${u.id}.e`)); D.set(u.id, durationOf(tl, u)); reasons.set(u.id, []); }
  const conflicts = [];
  for (const u of tl.units) {
    const su = s.get(u.id), eu = e.get(u.id), d = D.get(u.id);
    C(X(eu, [-1, su], -d), kiwi.Operator.Eq, kiwi.Strength.required, u.id, durationText(tl, u, d));
    C(X(su), kiwi.Operator.Ge, kiwi.Strength.required, u.id, "start >= 0");
    const k = u.rule.kind; const R = ruleRef(tl, u); const o = u.rule.o || 0;
    if (k !== "at" && k !== "default" && !R) { conflicts.push(`${u.id}: "${u.rule.said}" names nothing that happens in the animation`); continue; }
    const Ru = R && tl.units.find((v) => v.id === R);
    if (Ru && Ru.forever && (k === "after" || (k === "when" && u.rule.trigger !== "arrives"))) conflicts.push(`${u.id}: ${R} repeats forever, it has no end to follow`);
    const sR = R && s.get(R), eR = R && e.get(R);
    const ST = kiwi.Strength.strong;
    if (k === "at") C(X(su, -u.rule.t), kiwi.Operator.Eq, ST, u.id, `start = ${fmt(u.rule.t)} (at)`, () => tv(su) === u.rule.t);
    else if (k === "default") {
      if (u.index === 0) C(X(su), kiwi.Operator.Eq, DEFAULT_STRENGTH, u.id, "start = 0 (the first unit; nothing said)");
      else { const p = tl.units[u.index - 1].id; C(X(su, [-1, e.get(p)]), kiwi.Operator.Eq, DEFAULT_STRENGTH, u.id, `start = end of ${p} (the previous unit; nothing said)`); }
    } else if (k === "after") C(X(su, [-1, eR], -o), kiwi.Operator.Eq, ST, u.id, `start = end of ${R}${o ? ` + ${fmt(o)}` : ""} (${u.rule.said})`, () => tv(su) === tv(eR) + o);
    else if (k === "with" || k === "while") C(X(su, [-1, sR], -o), kiwi.Operator.Eq, ST, u.id, `start = start of ${R}${o ? ` + ${fmt(o)}` : ""} (${u.rule.said})`, () => tv(su) === tv(sR) + o);
    else if (k === "before") C(X(eu, [-1, sR], o), kiwi.Operator.Eq, ST, u.id, `end = start of ${R}${o ? ` - ${fmt(o)}` : ""} (${u.rule.said})`, () => tv(eu) === tv(sR) - o);
    else if (k === "when") {
      let off = null, how = `end of ${R}`;
      if (u.rule.trigger === "arrives" && u.rule.at && Ru.event === "travel" && Ru.nodes.slice(1).includes(u.rule.at)) {
        const kk = Ru.nodes.indexOf(u.rule.at, 1); off = Math.round(D.get(R) * kk / hops(Ru)); how = `start of ${R} + ${fmt(off)} (arrival at hop ${kk} of ${hops(Ru)})`;
      }
      if (off == null) C(X(su, [-1, eR]), kiwi.Operator.Eq, ST, u.id, `start = ${how} (when it ${u.rule.trigger})`, () => tv(su) === tv(eR));
      else C(X(su, [-1, sR], -off), kiwi.Operator.Eq, ST, u.id, `start = ${how} (when it arrives)`, () => tv(su) === tv(sR) + off);
    }
  }
  if (stay) for (const u of tl.units) { const p = stay.get(u.id); if (p) S.addConstraint(new kiwi.Constraint(X(s.get(u.id), -p.start), kiwi.Operator.Eq, undefined, kiwi.Strength.medium)); }
  S.updateVariables();
  function tv(v) { return Math.round(v.value()); }
  const times = new Map();
  for (const u of tl.units) { const st = tv(s.get(u.id)); times.set(u.id, { start: st, end: st + D.get(u.id), reasons: reasons.get(u.id) }); }
  for (const c of checks) if (!c.check()) conflicts.push(`${c.uid}: could not keep "${c.text}"`);
  for (const u of tl.units) if (u.rule.kind === "default") {                 // the default gave way: say why
    const want = u.index === 0 ? 0 : times.get(tl.units[u.index - 1].id).end; const got = times.get(u.id).start;
    if (got !== want) times.get(u.id).reasons.push(`start moved to ${fmt(got)}: a unit that must end before this one starts needs the room`);
  }
  const endPlain = Math.max(0, ...tl.units.filter((u) => !u.forever).map((u) => times.get(u.id).end));
  for (const u of tl.units) if (u.forever) { const t = times.get(u.id); t.end = Math.max(endPlain, t.start + D.get(u.id)); t.reasons.push(`repeats forever: end = the end of the film, ${fmt(t.end)}`); }
  tl.times = times; tl.durations = D; tl.end = Math.max(0, ...[...times.values()].map((t) => t.end)); tl.conflicts = conflicts; tl.solved = true;
  if (stay) for (const u of tl.units) { const p = stay.get(u.id); if (p && (p.start !== times.get(u.id).start)) times.get(u.id).reasons.push(`moved from ${fmt(p.start)} (it depends on what changed)`); }
  return tl;
}

// the timeline as rows for the panel (spec 19.2: one bar per unit, with the constraints that placed it)
export function rows(tl) {
  if (!tl.solved) solve(tl);
  return tl.units.map((u) => ({ id: u.id, event: u.event, subject: u.subject, start: tl.times.get(u.id).start, end: tl.times.get(u.id).end, reasons: [...u.notes, ...tl.times.get(u.id).reasons] }));
}
export function order(tl) { return rows(tl).sort((a, b) => a.start - b.start || Number(a.id.slice(1)) - Number(b.id.slice(1))).map((r) => r.id); }
export function overlapsOf(tl) {
  const rs = rows(tl); const out = [];
  for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) if (rs[i].start < rs[j].end && rs[j].start < rs[i].end) out.push([rs[i].id, rs[j].id]);
  return out;
}
export { ruleRef };
