// player.js: the film (spec 19.3). stateAt(tl, t) composes every unit of the timeline at time t into a state of the scene: each unit is an
// interpolation between two states for the properties it touches (opacity, position, scale, rotation, colour, a traveller's place along
// its route, a character's pose), with the easing of the legend. The rules are those of README.md "Semantics" (the same as the reference
// training/worlds/animation/semantics.py), so the invariants and the questions read exactly the frames the viewer sees.
// createPlayer(tl, {now, schedule, cancel, onFrame}): play, pause, seek (scrub), loop, "from the start", "stop at the gateway"; the clock is
// injected (view.js gives requestAnimationFrame and performance.now), so the core runs and is tested in node.
import { solve, hops } from "./timeline.js";
import { pose, characterKind } from "./characters.js";

const OP_IN = new Set(["appear", "fade_in"]), OP_OUT = new Set(["disappear", "fade_out"]);

export function ease(name, p) {
  if (name === "smoothly") return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
  if (name === "bouncing") {
    const n1 = 7.5625, d1 = 2.75;
    if (p < 1 / d1) return n1 * p * p;
    if (p < 2 / d1) { p -= 1.5 / d1; return n1 * p * p + 0.75; }
    if (p < 2.5 / d1) { p -= 2.25 / d1; return n1 * p * p + 0.9375; }
    p -= 2.625 / d1; return n1 * p * p + 0.984375;
  }
  if (name === "suddenly") return p > 0 ? 1 : 0;
  return p;
}
const centreOf = (b) => [b.x + b.w / 2, b.y + b.h / 2];

// the state of the scene at time t (ms)
export function stateAt(tl, t) {
  if (!tl.solved) solve(tl);
  const sc = tl.scene; const boxes = new Map([...sc.components.values()].map((c) => [c.id, { ...c.box }]));
  const firstOp = new Map();
  for (const u of tl.units) if (OP_IN.has(u.event) || OP_OUT.has(u.event)) for (const x of u.subject) if (!firstOp.has(x)) firstOp.set(x, u.event);
  const op = new Map(); for (const id of [...sc.components.keys(), ...sc.connectors.keys()]) op.set(id, OP_IN.has(firstOp.get(id)) ? 0 : 1);
  const dxy = new Map([...sc.components.keys()].map((id) => [id, [0, 0, 1]]));
  const extra = new Map([...sc.components.keys(), ...sc.connectors.keys()].map((id) => [id, { rotation: 0, color: null, highlight: false, pose: null, facing: 1 }]));
  const trav = new Map(); const active = [];
  const sorted = [...tl.units].sort((a, b) => tl.times.get(a.id).start - tl.times.get(b.id).start || a.index - b.index);
  for (const u of sorted) {
    const { start: s, end: e } = tl.times.get(u.id); if (t < s) continue;
    const p = e === s ? 1 : Math.min(Math.max((t - s) / (e - s), 0), 1);
    const q = u.easing === "suddenly" ? (t > s || e === s ? 1 : 0) : ease(u.easing, p);
    const D = tl.durations.get(u.id); const cyc = u.forever ? D : D / Math.max(u.repeat, 1);
    const f = cyc > 0 ? ((t - s) % cyc) / cyc : 0; const on = s <= t && t < e;
    if (on) active.push(u.id);
    for (const x of u.subject) {
      const X = extra.get(x);
      if (OP_IN.has(u.event)) op.set(x, q);
      else if (OP_OUT.has(u.event)) op.set(x, 1 - q);
      else if ((u.event === "move" || u.event === "walk") && u.to) { const b = boxes.get(x); b.x = u.from.x + (u.to.x - u.from.x) * q; b.y = u.from.y + (u.to.y - u.from.y) * q; if (u.event === "walk") { X.facing = u.facing; if (on) X.pose = pose("walk", f, { facing: u.facing }); } }
      else if (u.event === "jump" && on) { dxy.get(x)[1] += -40 * Math.sin(Math.PI * f); X.pose = pose("jump", f, { facing: X.facing }); }
      else if (u.event === "bounce" && on) { dxy.get(x)[1] += -20 * Math.abs(Math.sin(2 * Math.PI * f)); X.pose = pose("bounce", f, { facing: X.facing }); }
      else if (u.event === "shake" && on) dxy.get(x)[0] += 6 * Math.sin(6 * Math.PI * f);
      else if (u.event === "pulse" && on) dxy.get(x)[2] *= 1 + 0.15 * Math.sin(Math.PI * f);
      else if (u.event === "grow" || u.event === "shrink") dxy.get(x)[2] *= 1 + ((u.event === "grow" ? 1.25 : 0.8) - 1) * q;
      else if (u.event === "rotate") { const ang = Number(u.frame?.roles?.angle?.[1] ?? 360); X.rotation = (X.rotation + ang * q) % 360; }
      else if (u.event === "change") { X.color = q >= 0.5 ? u.frame?.roles?.color?.[1] || X.color : X.color; X.colorMix = q; }
      else if (u.event === "highlight" && on) X.highlight = true;
      else if ((u.event === "wave" || u.event === "nod") && on) X.pose = pose(u.event, f, { facing: X.facing });
      else if (u.event === "turn" && u.target) { const a = centreOf(boxes.get(x)), b = centreOf(boxes.get(u.target)); if (q >= 0.5) X.facing = b[0] >= a[0] ? 1 : -1; }
      else if (u.event === "travel" && t <= e) {
        const h = hops(u); const Dt = e - s;
        const j = Dt > 0 ? Math.min(Math.floor(((t - s) * h) / Dt), h - 1) : h - 1;
        const hp = Dt > 0 ? ((t - s) - (j * Dt) / h) / (Dt / h) : 1; const hq = ease(u.easing, Math.min(Math.max(hp, 0), 1));
        const a = centreOf(boxes.get(u.nodes[j])), b = centreOf(boxes.get(u.nodes[j + 1]));
        const T = tl.travellers.get(x); trav.set(x, { id: x, x: a[0] + (b[0] - a[0]) * hq, y: a[1] + (b[1] - a[1]) * hq, word: T.word, color: T.color, hop: j, from: u.nodes[j], to: u.nodes[j + 1], unit: u.id });
      }
    }
    if (u.event === "blink" && on) for (const x of u.subject) op.set(x, op.get(x) * (f < 0.5 ? 1 : 0.3));
  }
  const components = new Map();
  for (const c of sc.components.values()) {
    const b = boxes.get(c.id); const [dx, dy, k] = dxy.get(c.id); const w = b.w * k, h = b.h * k; const X = extra.get(c.id);
    components.set(c.id, { id: c.id, word: c.word, kind: c.kind, label: c.label, base: { ...c.box }, box: { x: b.x + dx - (w - b.w) / 2, y: b.y + dy - (h - b.h) / 2, w, h },
      opacity: op.get(c.id), rotation: X.rotation, color: X.color || c.color, highlight: X.highlight, character: characterKind(c.word), pose: X.pose || (characterKind(c.word) ? pose(null, 0, { facing: X.facing }) : null) });
  }
  const connectors = new Map([...sc.connectors.values()].map((k) => [k.id, { id: k.id, source: k.source, target: k.target, kind: k.kind, opacity: op.get(k.id), highlight: extra.get(k.id).highlight }]));
  return { t, components, connectors, travellers: trav, active };
}

// the times of the frames: frame k at round(k x 1000 / fps), k = 0 .. ceil(end x fps / 1000)
export function frameTimes(tl, fps = 25) {
  if (!tl.solved) solve(tl);
  const n = Math.ceil((tl.end * fps) / 1000); const out = [];
  for (let k = 0; k <= n; k++) out.push([k, Math.round((k * 1000) / fps)]);
  return out;
}
// the first moment a traveller arrives at a component (for "stop at the gateway", "when the request reaches it")
export function arrivalTime(tl, nodeId, travellerId = null) {
  if (!tl.solved) solve(tl);
  let best = null;
  for (const u of tl.units) {
    if (u.event !== "travel" || (travellerId && !u.subject.includes(travellerId))) continue;
    const k = u.nodes.indexOf(nodeId, 1); if (k < 1) continue;
    const { start, end } = tl.times.get(u.id); const t = start + Math.round(((end - start) * k) / hops(u));
    if (best == null || t < best) best = t;
  }
  return best;
}

export function createPlayer(tl, { now = () => Date.now(), schedule = (f) => setTimeout(f, 16), cancel = (h) => clearTimeout(h), onFrame = () => {}, rate = 1 } = {}) {
  if (!tl.solved) solve(tl);
  const P = { t: 0, playing: false, loop: !!tl.film.loop, stopAt: null, rate, handle: null, t0: 0, from: 0, plays: 0 };
  const emit = () => onFrame(stateAt(tl, P.t), P);
  const tick = () => {
    if (!P.playing) return;
    let t = P.from + (now() - P.t0) * P.rate;
    if (P.stopAt != null && t >= P.stopAt && P.from <= P.stopAt) { P.t = P.stopAt; P.stopAt = null; P.playing = false; emit(); return; }
    if (t >= tl.end) {
      P.plays++;
      const more = P.loop || (tl.film.repeat > 1 && P.plays < tl.film.repeat);
      if (more && tl.end > 0) { t = t % tl.end; P.from = t; P.t0 = now(); }
      else { P.t = tl.end; P.playing = false; emit(); return; }
    }
    P.t = t; emit(); P.handle = schedule(tick);
  };
  const api = {
    get time() { return P.t; }, get playing() { return P.playing; }, get loop() { return P.loop; }, get duration() { return tl.end; },
    play(from = null) { if (from != null) P.t = from; if (P.t >= tl.end) P.t = 0; P.from = P.t; P.t0 = now(); P.playing = true; P.plays = 0; emit(); P.handle = schedule(tick); return api; },
    pause() { P.playing = false; if (P.handle != null) cancel(P.handle); P.handle = null; emit(); return api; },
    seek(t) { P.t = Math.min(Math.max(t, 0), tl.end); if (P.playing) { P.from = P.t; P.t0 = now(); } emit(); return api; },
    setLoop(b) { P.loop = !!b; return api; },
    stopAt(t) { P.stopAt = t; return api; },
    state() { return stateAt(tl, P.t); },
    // voice and button commands of the film (timeline.js add() returns them as {kind: "film", command})
    command(c) {
      if (c.command === "play") return api.play(c.start ?? null);
      if (c.command === "rewind") { api.seek(0); return api.play(0); }
      if (c.command === "loop") { if (!tl.film.repeat || tl.film.repeat <= 1) P.loop = true; return api; }
      if (c.command === "pause") {
        if (c.landmark) { const at = arrivalTime(tl, c.landmark); if (at == null) return { error: "nothing arrives there" }; return api.stopAt(at); }
        if (c.start != null) return api.stopAt(c.start);
        return api.pause();
      }
      return api;
    },
  };
  return api;
}
