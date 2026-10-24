// questions.js: questions about the film (spec 19.6), answered from the timeline and from the state of the scene at the moment asked,
// with the frame to show. The reader gives the frame (event, roles, mood question); the asked role comes from the frame's `asked`
// (the generator's `_asked`) or, from the reader, from the question word: when -> start, how long -> duration, where -> landmark,
// what -> object. Rules, stated (the same as the gold answers of training/worlds/animation/animation_scripts.py):
//   when does X <action>                 the start of the FIRST unit of that action on X
//   how long does the animation last     the end of the film; how long does the X take: last end - first start of X's units
//   where is the T at N s / when R arrives   the traveller's place at that moment: at a component (centre within 1 px), between two, or not on screen
//   what is <highlighted> at N s / when T arrives at C   the subjects of the units of that action active at that moment (s <= t < e)
//   what <moves | blinks | ...> after | before | while | with X   relative to the FIRST unit acting on X; "moves" = any motion
import { solve, resolveEntity } from "./timeline.js";
import { stateAt, arrivalTime } from "./player.js";

const word = (f) => (f && (f[0] === "word" || f[0] === "negword") ? f[1] : null);
const fmt = (ms) => `${+(ms / 1000).toFixed(3)} s`;
export const MOTION_CLASS = new Set(["move", "travel", "walk", "jump", "bounce", "shake"]);
const VERB_TEXT = { appear: "appears", disappear: "disappears", fade_in: "fades in", fade_out: "fades out", blink: "blinks", highlight: "is highlighted", pulse: "pulses",
  move: "moves", travel: "travels", walk: "walks", jump: "jumps", bounce: "bounces", shake: "shakes", wave: "waves", nod: "nods", rotate: "rotates", grow: "grows", shrink: "shrinks" };

export function askedOf(frame, tokens = []) {
  if (frame.asked) return frame.asked;
  const t0 = tokens[0];
  if (t0 === "when") return "start"; if (t0 === "how_long") return "duration"; if (t0 === "where" || frame.event === "locate") return "landmark"; if (t0 === "what") return "object";
  return null;
}
const nameOf = (tl, id) => { const c = tl.scene.components.get(id); const t = tl.travellers.get(id); return c ? (c.label || `the ${c.word}`) : t ? `the ${t.word}` : id; };
const list = (xs) => (xs.length ? xs.join(", ") : "nothing");
const involves = (u, ids) => [...u.subject, ...(u.nodes || [])].some((x) => ids.includes(x));

function momentOf(tl, frame, info) {
  const r = frame.roles || {};
  if (r.start) { const v = Number(info?.numbers?.[word(r.start)] ?? word(r.start)); return { t: Math.round(word(r.unit) === "ms" ? v : v * 1000), how: `at ${word(r.start)} ${word(r.unit) || "s"}` }; }
  if (word(r.tempo) === "when" && r.ref) {
    const T = resolveEntity(tl, r.ref, { traveller: true }); if (T.error) return { error: T.rule };
    if (r.landmark) { const L = resolveEntity(tl, r.landmark); if (L.error) return { error: L.rule }; const t = arrivalTime(tl, L.ids[0], T.ids[0]); return t == null ? { error: `${nameOf(tl, T.ids[0])} never arrives at ${nameOf(tl, L.ids[0])}` } : { t, how: `when ${nameOf(tl, T.ids[0])} arrives at ${nameOf(tl, L.ids[0])} (${fmt(t)})` }; }
    const us = tl.units.filter((u) => u.subject.includes(T.ids[0])); if (!us.length) return { error: `nothing happens to ${nameOf(tl, T.ids[0])}` };
    const t = tl.times.get(us[0].id).end; return { t, how: `when ${nameOf(tl, T.ids[0])} arrives (${fmt(t)})` };
  }
  return { error: "at what moment?" };
}

// answer(tl, frame, info, tokens) -> {ok, asked, text, t (the frame to show), value, units}
export function answer(tl, frame, info = {}, tokens = []) {
  if (!tl.solved) solve(tl);
  const asked = askedOf(frame, tokens); const r = frame.roles || {}; const ev = frame.event;
  const out = (o) => ({ ok: !o.error, asked, ...o, text: o.error ? `I can't answer: ${o.error}` : o.text });
  if (asked === "start") {
    const X = resolveEntity(tl, r.object); if (X.error) return out({ error: X.rule });
    const u = tl.units.find((v) => v.event === ev && v.subject.some((s) => X.ids.includes(s)));
    if (!u) return out({ error: `${nameOf(tl, X.ids[0])} never ${VERB_TEXT[ev] || ev} in this animation` });
    const { start } = tl.times.get(u.id);
    return out({ text: `${nameOf(tl, X.ids[0])} ${VERB_TEXT[ev] || ev} at ${fmt(start)} (${u.id}: ${tl.times.get(u.id).reasons.find((x) => /^start|^end/.test(x)) || "the first unit"})`, t: start, value: start, units: [u.id] });
  }
  if (asked === "duration") {
    const h = r.object ? r.object[1] : "animation";
    if (["animation", "everything", "it"].includes(h)) return out({ text: `the animation lasts ${fmt(tl.end)}`, t: tl.end, value: tl.end, units: tl.units.map((u) => u.id) });
    const X = resolveEntity(tl, r.object); if (X.error) return out({ error: X.rule });
    const us = tl.units.filter((u) => u.subject.some((s) => X.ids.includes(s))); if (!us.length) return out({ error: `nothing happens to ${nameOf(tl, X.ids[0])}` });
    const a = Math.min(...us.map((u) => tl.times.get(u.id).start)), b = Math.max(...us.map((u) => tl.times.get(u.id).end));
    return out({ text: `${nameOf(tl, X.ids[0])} takes ${fmt(b - a)} (from ${fmt(a)} to ${fmt(b)})`, t: a, value: b - a, units: us.map((u) => u.id) });
  }
  if (asked === "landmark") {
    const T = resolveEntity(tl, r.traveller || r.object, { traveller: !!r.traveller }); if (T.error) return out({ error: T.rule });
    const m = momentOf(tl, frame, info); if (m.error) return out({ error: m.error });
    const st = stateAt(tl, m.t); const tr = st.travellers.get(T.ids[0]);
    if (!tr) return out({ text: `${nameOf(tl, T.ids[0])} is not on screen ${m.how}`, t: m.t, value: { hidden: true } });
    let at = null; for (const c of st.components.values()) { const cx = c.box.x + c.box.w / 2, cy = c.box.y + c.box.h / 2; if (Math.hypot(cx - tr.x, cy - tr.y) <= 1) at = c.id; }
    if (at) return out({ text: `${nameOf(tl, T.ids[0])} is at ${nameOf(tl, at)} ${m.how}`, t: m.t, value: { at }, units: [tr.unit] });
    return out({ text: `${nameOf(tl, T.ids[0])} is between ${nameOf(tl, tr.from)} and ${nameOf(tl, tr.to)} ${m.how}`, t: m.t, value: { between: [tr.from, tr.to] }, units: [tr.unit] });
  }
  if (asked === "object") {
    const cls = ev === "move" ? MOTION_CLASS : new Set([ev]); const tempo = word(r.tempo);
    if (r.start || (tempo === "when" && r.ref)) {
      const m = momentOf(tl, frame, info); if (m.error) return out({ error: m.error });
      const us = tl.units.filter((u) => cls.has(u.event) && tl.times.get(u.id).start <= m.t && m.t < tl.times.get(u.id).end);
      const objs = [...new Set(us.flatMap((u) => u.subject))].sort();
      return out({ text: `${m.how}, ${VERB_TEXT[ev] && ev !== "move" ? `${VERB_TEXT[ev].replace(/^is /, "")}: ` : ""}${list(objs.map((o) => nameOf(tl, o)))}`, t: m.t, value: objs, units: us.map((u) => u.id) });
    }
    if (["after", "before", "while", "with"].includes(tempo) && r.ref) {
      const X = resolveEntity(tl, r.ref); if (X.error) return out({ error: X.rule });
      const R = tl.units.find((u) => involves(u, X.ids)); if (!R) return out({ error: `nothing happens to ${nameOf(tl, X.ids[0])}` });
      const { start: s0, end: e0 } = tl.times.get(R.id);
      const ok = (u) => { const { start: s, end: e } = tl.times.get(u.id); return tempo === "after" ? s >= e0 : tempo === "before" ? e <= s0 : tempo === "with" ? s === s0 : s < e0 && e > s0; };
      const us = tl.units.filter((u) => u.id !== R.id && cls.has(u.event) && ok(u)); const objs = [...new Set(us.flatMap((u) => u.subject))].sort();
      return out({ text: `${tempo} ${nameOf(tl, X.ids[0])} (${R.id}, ${fmt(s0)} to ${fmt(e0)}): ${list(objs.map((o) => nameOf(tl, o)))}`, t: tempo === "after" ? e0 : s0, value: objs, units: us.map((u) => u.id) });
    }
  }
  return out({ error: "this question is not one I can answer from the timeline" });
}
