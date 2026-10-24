// router.js: orthogonal connector routing (spec 8.3). A shortest path on a visibility grid around the components' boxes with a
// penalty per bend: the grid lines are the edges of the boxes inflated by a margin, the ports and the middles of the channels between
// them; a grid node or segment strictly inside an inflated box is blocked. The source and the target are obstacles too, so a route
// leaves through a port stub and never crosses its own ends. Containers that hold an end are open; other containers are obstacles.
// Two passes: the first lets every connector choose its sides (port at the side middle), the second spreads the ports of the connectors
// that share a side and routes again with those ports fixed. Pure and deterministic: same scene, same routes.
//
// routeAll(scene, {ids, quick}) sets e.points (and e.ends = {s: [side, t], t: [side, t]}) on the connectors; ids limits the work to
// those connectors (the others stay as they are and count as used channels); quick skips the second pass (live preview while dragging).
// segmentHitsBox(a, b, box) and routeCrossings(scene) are the checks used by the tests.

export const MARGIN = 14;           // distance kept between a route and any box it does not end at
export const BEND = 36;             // cost of one bend, in px of length
const SHARE = 0.5;                  // extra cost per px of a channel segment already used by another connector
const DIR = [[1, 0], [0, 1], [-1, 0], [0, -1]];    // 0 east, 1 south, 2 west, 3 north
const SIDE_DIR = { e: 0, s: 1, w: 2, n: 3 };
const SIDES = ["e", "s", "w", "n"];
const EPS = 1e-6;

export function portPoint(box, side, t = 0.5) {
  if (side === "e") return { x: box.x + box.w, y: box.y + box.h * t };
  if (side === "w") return { x: box.x, y: box.y + box.h * t };
  if (side === "n") return { x: box.x + box.w * t, y: box.y };
  return { x: box.x + box.w * t, y: box.y + box.h };
}
function stubPoint(box, side, t, m) {
  const p = portPoint(box, side, t); const [dx, dy] = DIR[SIDE_DIR[side]];
  return { x: p.x + dx * m, y: p.y + dy * m };
}
// sides along which several ports can be spread and still lie on the drawn outline
function spreadable(c, side) {
  const k = c.kind, w = c.word;
  if (k === "decision" || k === "actor" || k === "text") return false;
  if (k === "shape" && w !== "square" && w !== "rectangle") return false;
  if (k === "terminator") return side === "n" || side === "s";
  if (k === "data") return w === "queue" ? (side === "n" || side === "s") : (side === "e" || side === "w");
  if (k === "system" && w === "cloud") return false;
  return true;
}

function ancestors(scene, id) {
  const out = new Set(); let c = scene.components.get(id); let guard = 0;
  while (c && c.parent && guard++ < 64) { out.add(c.parent); c = scene.components.get(c.parent); }
  return out;
}

// ------------------------------------------------------------------ the grid
function uniqSorted(a) { a.sort((p, q) => p - q); const o = []; for (const v of a) if (!o.length || v - o[o.length - 1] > 0.01) o.push(v); return o; }
function withMiddles(a) { const o = []; for (let i = 0; i < a.length; i++) { o.push(a[i]); if (i + 1 < a.length && a[i + 1] - a[i] > 8) o.push((a[i] + a[i + 1]) / 2); } return o; }
function lowerIdx(a, v) { let lo = 0, hi = a.length; while (lo < hi) { const m = (lo + hi) >> 1; if (a[m] < v) lo = m + 1; else hi = m; } return lo; }
function idxOf(a, v) { const i = lowerIdx(a, v - 0.01); return i < a.length && Math.abs(a[i] - v) <= 0.01 ? i : -1; }

// rects: inflated non-container boxes {L,T,R,B}; extra coordinates for the ports
function buildGrid(rects, conts, xsExtra, ysExtra) {
  let xs = [], ys = [];
  for (const r of rects.concat(conts)) { xs.push(r.L, r.R); ys.push(r.T, r.B); }
  xs.push(...xsExtra); ys.push(...ysExtra);
  const all = rects.concat(conts);
  const minX = Math.min(...all.map((r) => r.L)) - 3 * MARGIN, maxX = Math.max(...all.map((r) => r.R)) + 3 * MARGIN;
  const minY = Math.min(...all.map((r) => r.T)) - 3 * MARGIN, maxY = Math.max(...all.map((r) => r.B)) + 3 * MARGIN;
  xs.push(minX, maxX); ys.push(minY, maxY);
  xs = withMiddles(uniqSorted(xs)); ys = withMiddles(uniqSorted(ys));
  const nx = xs.length, ny = ys.length;
  const node = new Uint8Array(nx * ny), hEdge = new Uint8Array(nx * ny), vEdge = new Uint8Array(nx * ny);
  for (const r of rects) {
    const i0 = lowerIdx(xs, r.L), i1 = lowerIdx(xs, r.R), j0 = lowerIdx(ys, r.T), j1 = lowerIdx(ys, r.B);   // xs[i0] ~ L, xs[i1] ~ R
    for (let j = j0; j <= j1 && j < ny; j++) for (let i = i0; i <= i1 && i < nx; i++) {
      const x = xs[i], y = ys[j]; const inX = x > r.L + EPS && x < r.R - EPS, inY = y > r.T + EPS && y < r.B - EPS;
      if (inX && inY) node[j * nx + i] = 1;
      if (inY && i + 1 < nx && xs[i] >= r.L - EPS && xs[i + 1] <= r.R + EPS) hEdge[j * nx + i] = 1;         // segment (i,j)-(i+1,j)
      if (inX && j + 1 < ny && ys[j] >= r.T - EPS && ys[j + 1] <= r.B + EPS) vEdge[j * nx + i] = 1;         // segment (i,j)-(i,j+1)
    }
  }
  return { xs, ys, nx, ny, node, hEdge, vEdge };
}

// ------------------------------------------------------------------ binary heap on (f, state)
class Heap {
  constructor() { this.f = []; this.s = []; }
  get size() { return this.f.length; }
  push(f, s) { const F = this.f, S = this.s; let i = F.length; F.push(f); S.push(s); while (i > 0) { const p = (i - 1) >> 1; if (F[p] < f || (F[p] === f && S[p] <= s)) break; F[i] = F[p]; S[i] = S[p]; i = p; } F[i] = f; S[i] = s; }
  pop() {
    const F = this.f, S = this.s; const tf = F[0], ts = S[0]; const lf = F.pop(), ls = S.pop(); const n = F.length;
    if (n) { let i = 0; for (;;) { let c = 2 * i + 1; if (c >= n) break; if (c + 1 < n && (F[c + 1] < F[c] || (F[c + 1] === F[c] && S[c + 1] < S[c]))) c++; if (F[c] > lf || (F[c] === lf && S[c] >= ls)) break; F[i] = F[c]; S[i] = S[c]; i = c; } F[i] = lf; S[i] = ls; }
    return [tf, ts];
  }
}

// one connector on a built grid. starts / goals: [{side, t, port, stub}] with stub on the grid. conts: active container rects.
function search(G, starts, goals, conts, used) {
  const { xs, ys, nx, ny, node, hEdge, vEdge } = G; const N = nx * ny;
  const blockedNode = (k) => { if (node[k]) return true; if (!conts.length) return false; const x = xs[k % nx], y = ys[(k / nx) | 0]; for (const r of conts) if (x > r.L + EPS && x < r.R - EPS && y > r.T + EPS && y < r.B - EPS) return true; return false; };
  const blockedSeg = (x1, y1, x2, y2) => { if (!conts.length) return false; const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; for (const r of conts) if (mx > r.L + EPS && mx < r.R - EPS && my > r.T + EPS && my < r.B - EPS) return true; return false; };
  const gs = new Float64Array(N * 4).fill(Infinity); const par = new Int32Array(N * 4).fill(-1);
  const goalAt = new Map();
  for (let g = 0; g < goals.length; g++) {
    const G0 = goals[g]; const i = idxOf(xs, G0.stub.x), j = idxOf(ys, G0.stub.y); if (i < 0 || j < 0) continue;
    const k = j * nx + i; if (blockedNode(k)) continue; if (!goalAt.has(k)) goalAt.set(k, []); goalAt.get(k).push(g);
  }
  if (!goalAt.size) return null;
  const goalPts = goals.map((g) => g.stub);
  const hfun = (k) => { const x = xs[k % nx], y = ys[(k / nx) | 0]; let best = Infinity; for (const p of goalPts) best = Math.min(best, Math.abs(p.x - x) + Math.abs(p.y - y)); return best; };
  const heap = new Heap();
  for (let s = 0; s < starts.length; s++) {
    const S0 = starts[s]; const i = idxOf(xs, S0.stub.x), j = idxOf(ys, S0.stub.y); if (i < 0 || j < 0) continue;
    const k = j * nx + i; if (blockedNode(k)) continue; const d = SIDE_DIR[S0.side]; const st = k * 4 + d;
    const g0 = MARGIN + (S0.cost || 0); if (g0 < gs[st]) { gs[st] = g0; par[st] = -2 - s; heap.push(g0 + hfun(k), st); }
  }
  let best = null; const done = new Uint8Array(N * 4);
  while (heap.size) {
    const [f, st] = heap.pop();
    if (st < 0) { best = -st - 1; break; }                                     // a final state: (state, goal) encoded below
    if (done[st]) continue; done[st] = 1;
    const k = st >> 2, d = st & 3, g = gs[st];
    if (goalAt.has(k)) for (const gi of goalAt.get(k)) {
      const inward = (SIDE_DIR[goals[gi].side] + 2) % 4; if (d === (inward + 2) % 4) continue;
      const fc = g + MARGIN + (d === inward ? 0 : BEND) + (goals[gi].cost || 0);
      heap.push(fc, -1 - (st * 8 + gi));                                          // goals.length <= 8
    }
    const i = k % nx, j = (k / nx) | 0;
    for (let d2 = 0; d2 < 4; d2++) {
      if (d2 === (d + 2) % 4) continue;
      const i2 = i + DIR[d2][0], j2 = j + DIR[d2][1]; if (i2 < 0 || j2 < 0 || i2 >= nx || j2 >= ny) continue;
      if (d2 === 0 && hEdge[j * nx + i]) continue; if (d2 === 2 && hEdge[j * nx + i2]) continue;
      if (d2 === 1 && vEdge[j * nx + i]) continue; if (d2 === 3 && vEdge[j2 * nx + i]) continue;
      const k2 = j2 * nx + i2; if (blockedNode(k2)) continue;
      const x1 = xs[i], y1 = ys[j], x2 = xs[i2], y2 = ys[j2]; if (blockedSeg(x1, y1, x2, y2)) continue;
      const len = Math.abs(x2 - x1) + Math.abs(y2 - y1); const key = d2 & 1 ? `v${Math.min(k, k2)}` : `h${Math.min(k, k2)}`;
      const g2 = g + len + (d2 === d ? 0 : BEND) + (used.get(key) || 0) * SHARE * len; const st2 = k2 * 4 + d2;
      if (g2 < gs[st2] - EPS) { gs[st2] = g2; par[st2] = st; heap.push(g2 + hfun(k2), st2); }
    }
  }
  if (best == null) return null;
  const st = Math.floor(best / 8), gi = best % 8; const nodes = []; let cur = st; let si = 0;
  while (cur >= 0) { nodes.push(cur >> 2); const p = par[cur]; if (p <= -2) { si = -2 - p; break; } cur = p; }
  nodes.reverse();
  const keys = []; for (let q = 0; q + 1 < nodes.length; q++) { const a = nodes[q], b = nodes[q + 1]; keys.push((Math.abs(a - b) === 1 ? "h" : "v") + Math.min(a, b)); }
  const pts = [starts[si].port, ...nodes.map((k) => ({ x: xs[k % nx], y: ys[(k / nx) | 0] })), goals[gi].port];
  return { points: simplify(pts), start: starts[si], goal: goals[gi], keys };
}

export function simplify(pts) {
  const out = [];
  for (const p of pts) {
    const q = { x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 };
    if (out.length && Math.abs(out[out.length - 1].x - q.x) < 0.05 && Math.abs(out[out.length - 1].y - q.y) < 0.05) continue;
    out.push(q);
    while (out.length >= 3) {
      const a = out[out.length - 3], b = out[out.length - 2], c = out[out.length - 1];
      if ((Math.abs(a.x - b.x) < 0.05 && Math.abs(b.x - c.x) < 0.05) || (Math.abs(a.y - b.y) < 0.05 && Math.abs(b.y - c.y) < 0.05)) out.splice(out.length - 2, 1); else break;
    }
  }
  return out;
}

// a straight fallback between the two boxes (no free path, or the boxes overlap)
export function fallbackRoute(a, b) {
  const ac = { x: a.x + a.w / 2, y: a.y + a.h / 2 }, bc = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
  const dx = bc.x - ac.x, dy = bc.y - ac.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const s = dx >= 0 ? "e" : "w", t = dx >= 0 ? "w" : "e"; const p = portPoint(a, s), q = portPoint(b, t); const mx = (p.x + q.x) / 2;
    return { points: simplify([p, { x: mx, y: p.y }, { x: mx, y: q.y }, q]), ends: { s: [s, 0.5], t: [t, 0.5] } };
  }
  const s = dy >= 0 ? "s" : "n", t = dy >= 0 ? "n" : "s"; const p = portPoint(a, s), q = portPoint(b, t); const my = (p.y + q.y) / 2;
  return { points: simplify([p, { x: p.x, y: my }, { x: q.x, y: my }, q]), ends: { s: [s, 0.5], t: [t, 0.5] } };
}
function selfLoop(b) {
  const p = portPoint(b, "e", 0.3), q = portPoint(b, "n", 0.75); const m = MARGIN + 6;
  return { points: [p, { x: p.x + m, y: p.y }, { x: p.x + m, y: q.y - m }, { x: q.x, y: q.y - m }, q], ends: { s: ["e", 0.3], t: ["n", 0.75] } };
}

const inflate = (b, m) => ({ L: b.x - m, T: b.y - m, R: b.x + b.w + m, B: b.y + b.h + m });
const numId = (id) => { const m = /(\d+)$/.exec(id); return m ? Number(m[1]) : 0; };

export function routeAll(scene, { ids = null, quick = false } = {}) {
  const comps = [...scene.components.values()];
  const all = [...scene.connectors.values()].filter((e) => scene.components.has(e.source) && scene.components.has(e.target))
    .sort((a, b) => numId(a.id) - numId(b.id) || (a.id < b.id ? -1 : 1));
  const todo = ids ? all.filter((e) => ids.includes(e.id)) : all;
  if (!todo.length) return { routed: 0, failed: [] };
  const rects = comps.filter((c) => c.kind !== "container").map((c) => inflate(c.box, MARGIN));
  const contRects = comps.filter((c) => c.kind === "container").map((c) => ({ id: c.id, ...inflate(c.box, MARGIN) }));
  const used = new Map(); const failed = [];
  const markUsed = (keys) => { for (const k of keys) used.set(k, (used.get(k) || 0) + 1); };
  const anc = new Map(); const ancOf = (id) => { if (!anc.has(id)) anc.set(id, ancestors(scene, id)); return anc.get(id); };
  const activeConts = (e) => { const A = ancOf(e.source), B = ancOf(e.target); return contRects.filter((r) => r.id !== e.source && r.id !== e.target && !A.has(r.id) && !B.has(r.id)); };
  const endsOf = (c, fixed) => (fixed ? [fixed] : SIDES.map((s) => [s, 0.5])).map(([side, t]) => ({ side, t, port: portPoint(c.box, side, t), stub: stubPoint(c.box, side, t, MARGIN) }));
  // first pass: free sides, ports at the side middles
  const extraX = [], extraY = [];
  for (const c of comps) { extraX.push(c.box.x + c.box.w / 2); extraY.push(c.box.y + c.box.h / 2); }
  let G = buildGrid(rects, contRects, extraX, extraY);
  const first = new Map();
  for (const e of todo) {
    const a = scene.components.get(e.source), b = scene.components.get(e.target);
    if (e.source === e.target) { first.set(e.id, selfLoop(a.box)); continue; }
    const r = search(G, endsOf(a), endsOf(b), activeConts(e), used);
    if (r) { first.set(e.id, { points: r.points, ends: { s: [r.start.side, 0.5], t: [r.goal.side, 0.5] }, keys: r.keys }); if (quick) markUsed(r.keys); }
    else first.set(e.id, { ...fallbackRoute(a.box, b.box), failed: true });
  }
  if (quick) { for (const e of todo) { const r = first.get(e.id); e.points = r.points; e.ends = r.ends; if (r.failed) failed.push(e.id); } return { routed: todo.length, failed }; }
  // second pass: spread the ports of the connectors that share a side; ordered by where the other end lies
  const bySide = new Map();
  const endOf = (e) => (first.has(e.id) ? first.get(e.id).ends : e.ends || { s: ["e", 0.5], t: ["w", 0.5] });
  for (const e of all) {
    if (e.source === e.target) continue; const en = endOf(e);
    for (const [end, cid, other] of [["s", e.source, e.target], ["t", e.target, e.source]]) {
      const key = `${cid}|${en[end][0]}`; if (!bySide.has(key)) bySide.set(key, []); bySide.get(key).push({ e, end, other });
    }
  }
  const assigned = new Map();                                                     // e.id -> {s: [side, t], t: [side, t]}
  const crowded = new Map();                                                      // e.id -> {s?: true, t?: true}: the end shares a point
  for (const [key, list] of bySide) {
    const [cid, side] = key.split("|"); const c = scene.components.get(cid);
    if (list.length > 1 && !spreadable(c, side)) for (const it of list.slice(1)) { if (!crowded.has(it.e.id)) crowded.set(it.e.id, {}); crowded.get(it.e.id)[it.end] = true; }
    const horiz = side === "n" || side === "s"; const len = horiz ? c.box.w : c.box.h;
    const coord = (o) => { const ob = scene.components.get(o).box; return horiz ? ob.x + ob.w / 2 : ob.y + ob.h / 2; };
    list.sort((p, q) => coord(p.other) - coord(q.other) || numId(p.e.id) - numId(q.e.id));
    const k = list.length; const can = spreadable(c, side) && k > 1; const step = can ? Math.min(18, (len * 0.8) / k) : 0;
    list.forEach((it, i) => { const t = can ? 0.5 + ((i - (k - 1) / 2) * step) / len : 0.5; if (!assigned.has(it.e.id)) assigned.set(it.e.id, {}); assigned.get(it.e.id)[it.end] = [side, t]; });
  }
  const ex2 = [], ey2 = [];
  for (const e of all) { const as = assigned.get(e.id); if (!as) continue; for (const [end, cid] of [["s", e.source], ["t", e.target]]) { if (!as[end]) continue; const p = portPoint(scene.components.get(cid).box, as[end][0], as[end][1]); ex2.push(p.x); ey2.push(p.y); } }
  G = buildGrid(rects, contRects, extraX.concat(ex2), extraY.concat(ey2));
  const occ = new Map(); for (const [key, list] of bySide) occ.set(key, list.length);   // connectors per (component, side)
  for (const e of todo) {
    const a = scene.components.get(e.source), b = scene.components.get(e.target); const f = first.get(e.id);
    if (e.source === e.target || f.failed) { e.points = f.points; e.ends = f.ends; if (f.failed) failed.push(e.id); continue; }
    const as = assigned.get(e.id) || f.ends; const cr = crowded.get(e.id) || {};
    // an end that would share a point of an outline where ports cannot spread (a diamond's vertex) may take a free side instead
    const freeEnds = (c, end, fixed) => SIDES.map((side) => { const n = occ.get(`${c.id}|${side}`) || 0; return { side, t: 0.5, port: portPoint(c.box, side, 0.5), stub: stubPoint(c.box, side, 0.5, MARGIN), cost: Math.max(0, n - (side === fixed[0] ? 1 : 0)) * 8 * BEND + (side === fixed[0] ? 0 : BEND / 2) }; });
    const S0 = cr.s ? freeEnds(a, "s", as.s) : endsOf(a, as.s), T0 = cr.t ? freeEnds(b, "t", as.t) : endsOf(b, as.t);
    const r = search(G, S0, T0, activeConts(e), used);
    if (r) { if (cr.s) { occ.set(`${a.id}|${as.s[0]}`, (occ.get(`${a.id}|${as.s[0]}`) || 1) - 1); occ.set(`${a.id}|${r.start.side}`, (occ.get(`${a.id}|${r.start.side}`) || 0) + 1); }
      if (cr.t) { occ.set(`${b.id}|${as.t[0]}`, (occ.get(`${b.id}|${as.t[0]}`) || 1) - 1); occ.set(`${b.id}|${r.goal.side}`, (occ.get(`${b.id}|${r.goal.side}`) || 0) + 1); } }
    if (r) { e.points = r.points; e.ends = { s: [r.start.side, r.start.t], t: [r.goal.side, r.goal.t] }; markUsed(r.keys); }
    else { e.points = f.points; e.ends = f.ends; markUsed(f.keys || []); }
  }
  return { routed: todo.length, failed };
}

// ------------------------------------------------------------------ checks (tests, explanation panel)
// does the segment a-b pass through the interior of box (shrunk by tol)?
export function segmentHitsBox(a, b, box, tol = 1) {
  const L = box.x + tol, R = box.x + box.w - tol, T = box.y + tol, B = box.y + box.h - tol; if (L >= R || T >= B) return false;
  if (Math.abs(a.y - b.y) < 0.01) { const y = a.y; if (y <= T || y >= B) return false; return Math.max(a.x, b.x) > L && Math.min(a.x, b.x) < R; }
  if (Math.abs(a.x - b.x) < 0.01) { const x = a.x; if (x <= L || x >= R) return false; return Math.max(a.y, b.y) > T && Math.min(a.y, b.y) < B; }
  // general segment (fallbacks, straight lines): Liang-Barsky clip
  let t0 = 0, t1 = 1; const dx = b.x - a.x, dy = b.y - a.y;
  for (const [p, q] of [[-dx, a.x - L], [dx, R - a.x], [-dy, a.y - T], [dy, B - a.y]]) { if (p === 0) { if (q < 0) return false; } else { const r = q / p; if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; } } }
  return t0 < t1;
}
// list of {connector, component} where a route crosses a component that is not one of its ends nor a container holding an end
export function routeCrossings(scene) {
  const out = [];
  for (const e of scene.connectors.values()) {
    const pts = e.points; if (!pts || pts.length < 2) continue; const A = ancestors(scene, e.source), B = ancestors(scene, e.target);
    for (const c of scene.components.values()) {
      if (c.id === e.source || c.id === e.target || A.has(c.id) || B.has(c.id)) continue;
      for (let i = 0; i + 1 < pts.length; i++) if (segmentHitsBox(pts[i], pts[i + 1], c.box)) { out.push({ connector: e.id, component: c.id }); break; }
    }
  }
  return out;
}
export function isOrthogonal(pts) { for (let i = 0; i + 1 < pts.length; i++) if (Math.abs(pts[i].x - pts[i + 1].x) > 0.05 && Math.abs(pts[i].y - pts[i + 1].y) > 0.05) return false; return true; }
