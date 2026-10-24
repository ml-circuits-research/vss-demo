// invariants.js: the interlock on every frame (spec 19.4). A prohibition in an animation is a lock (spec 10.4) checked on the state of
// EVERY frame, not only at the command; a timeline that would break one is reported before playing, with the rule, the frame and the
// time. Rules (README.md "Semantics"):
//   no-overlap     "never let anything overlap the database": no other visible component's drawn box overlaps it
//   on-connectors  "never let the dot leave the arrows": a visible traveller lies within 2 px of a connector's centre line
//   visible        "never hide the title": from its first visible frame on, opacity > 0.1 and the box inside the canvas
//   no-move        "never move the gateway": the drawn box stays within 0.5 px of frame 0 (shaking and bouncing are moving)
//   inside-canvas  built in: every visible component's drawn box inside the canvas
//   attached       built in: a visible connector has both ends visible
// check(tl, {fps}) -> {ok, violations: [{rule, subject, frame, t, text}], first, frames}: the FIRST violating frame of each rule instance.
import { stateAt, frameTimes } from "./player.js";
import { solve } from "./timeline.js";

const OPAQUE = 0.1;
const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const inside = (b, sc) => b.x >= 0 && b.y >= 0 && b.x + b.w <= sc.width && b.y + b.h <= sc.height;
function segDist(p, a, b) {
  const vx = b[0] - a[0], vy = b[1] - a[1], L = vx * vx + vy * vy;
  const u = L === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / L));
  return Math.hypot(p[0] - (a[0] + u * vx), p[1] - (a[1] + u * vy));
}
const centre = (b) => [b.x + b.w / 2, b.y + b.h / 2];
const name = (tl, id) => { const c = tl.scene.components.get(id) || tl.scene.connectors.get(id); const t = tl.travellers.get(id); return c ? (c.label ? `"${c.label}"` : `the ${c.word || c.kind}`) : t ? `the ${t.word}` : id; };
const TEXT = {
  "no-overlap": (tl, s) => `something overlaps ${name(tl, s)} (rule: never let anything overlap it)`,
  "on-connectors": (tl, s) => `${name(tl, s)} leaves the connectors (rule: never let it leave them)`,
  visible: (tl, s) => `${name(tl, s)} is no longer visible (rule: it must stay visible)`,
  "no-move": (tl, s) => `${name(tl, s)} moves (rule: never move it)`,
  "inside-canvas": (tl, s) => `${name(tl, s)} leaves the canvas`,
  attached: (tl, s) => `the connector ${s} is visible while one of its ends is not`,
};

export function check(tl, { fps = 25 } = {}) {
  if (!tl.solved) solve(tl);
  const sc = tl.scene; const found = new Map(); const firstVisible = new Map(); let f0 = null; const frames = frameTimes(tl, fps);
  for (const [k, t] of frames) {
    const st = stateAt(tl, t); const B = new Map([...st.components].map(([id, c]) => [id, c.box])); const O = (id) => (st.components.get(id) || st.connectors.get(id)).opacity;
    if (!f0) f0 = new Map([...B].map(([id, b]) => [id, { ...b }]));
    const hit = (rule, subject) => { const key = `${rule}|${subject}`; if (!found.has(key)) found.set(key, { rule, subject, frame: k, t, text: `frame ${k} (${+(t / 1000).toFixed(3)} s): ${TEXT[rule](tl, subject)}` }); };
    for (const L of tl.locks) {
      if (L.unchecked) continue; const s = L.subject;
      if (L.rule === "no-overlap") {
        for (const [id, b] of B) if (id !== s && O(id) > OPAQUE && O(s) > OPAQUE && sc.components.get(id).kind !== "container" && overlap(b, B.get(s))) hit("no-overlap", s);
      } else if (L.rule === "on-connectors" && st.travellers.has(s)) {
        const tr = st.travellers.get(s); const p = [tr.x, tr.y];
        let d = 1e9; for (const kk of sc.connectors.values()) d = Math.min(d, segDist(p, centre(B.get(kk.source)), centre(B.get(kk.target))));
        if (d > 2) hit("on-connectors", s);
      } else if (L.rule === "visible") {
        const vis = O(s) > OPAQUE && inside(B.get(s), sc);
        if (vis) { if (!firstVisible.has(s)) firstVisible.set(s, k); } else if (firstVisible.has(s)) hit("visible", s);
      } else if (L.rule === "no-move") {
        const b = B.get(s), a = f0.get(s);
        if (Math.abs(b.x - a.x) > 0.5 || Math.abs(b.y - a.y) > 0.5 || Math.abs(b.w - a.w) > 0.5) hit("no-move", s);
      }
    }
    for (const [id, b] of B) if (O(id) > OPAQUE && !inside(b, sc)) hit("inside-canvas", id);
    for (const kk of sc.connectors.values()) if (O(kk.id) > OPAQUE && (O(kk.source) <= OPAQUE || O(kk.target) <= OPAQUE)) hit("attached", kk.id);
  }
  const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  const violations = [...found.values()].sort((a, b) => a.frame - b.frame || cmp(a.rule, b.rule) || cmp(a.subject, b.subject));
  const unchecked = tl.locks.filter((L) => L.unchecked).map((L) => `${L.text} ${name(tl, L.subject)}: checked at the command, not per frame`);
  return { ok: !violations.length, violations, first: violations[0] || null, frames: frames.length, fps, unchecked,
    text: violations.length ? `the film breaks ${violations.length} rule${violations.length > 1 ? "s" : ""}; first: ${violations[0].text}` : `every rule holds on all ${frames.length} frames` };
}
