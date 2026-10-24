// strokes.js: stroke geometry for the sketch pad (spec 17.1). Pure functions, no DOM. A point is {x, y, t} (t in ms); a stroke is
// {id, points, pointerType?}. Resampling ($1 / $P style, by path length), smoothing, corners (ShortStraw, Wolin, Eoff and Hammond 2008,
// re-implemented from the paper), convex hull, distances and the small statistics the recogniser uses.

export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export function pathLength(pts) {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += dist(pts[i - 1], pts[i]);
  return L;
}

export function bbox(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of pts) { if (p.x < x0) x0 = p.x; if (p.y < y0) y0 = p.y; if (p.x > x1) x1 = p.x; if (p.y > y1) y1 = p.y; }
  if (!pts.length) return { x: 0, y: 0, w: 0, h: 0 };
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

export const boxUnion = (a, b) => {
  const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
  return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y };
};
export const boxArea = (b) => Math.max(0, b.w) * Math.max(0, b.h);
export function boxIntersection(a, b) {
  const x = Math.max(a.x, b.x), y = Math.max(a.y, b.y), x1 = Math.min(a.x + a.w, b.x + b.w), y1 = Math.min(a.y + a.h, b.y + b.h);
  return x1 > x && y1 > y ? { x, y, w: x1 - x, h: y1 - y } : null;
}
/** share of box a that lies inside box b */
export const insideShare = (a, b) => { const i = boxIntersection(a, b); return i ? boxArea(i) / Math.max(1e-9, boxArea(a)) : 0; };
export const diag = (b) => Math.hypot(b.w, b.h);
export const centre = (b) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

/** n points equally spaced along the path ($1 resample); t is interpolated */
export function resample(pts, n) {
  if (pts.length === 0) return [];
  if (pts.length === 1 || n < 2) return Array.from({ length: Math.max(1, n) }, () => ({ ...pts[0] }));
  const L = pathLength(pts);
  if (L === 0) return Array.from({ length: n }, () => ({ ...pts[0] }));
  return resampleSpacing(pts, L / (n - 1), n);
}

/** points every `step` px along the path (the last point always kept); `cap` limits the count */
export function resampleSpacing(pts, step, cap = Infinity) {
  if (pts.length < 2 || step <= 0) return pts.map((p) => ({ ...p }));
  const out = [{ ...pts[0] }]; let acc = 0; let prev = pts[0];
  for (let i = 1; i < pts.length; i++) {
    let q = pts[i]; let d = dist(prev, q);
    while (acc + d >= step && out.length < cap) {
      const f = (step - acc) / d, np = { x: prev.x + f * (q.x - prev.x), y: prev.y + f * (q.y - prev.y), t: (prev.t ?? 0) + f * ((q.t ?? 0) - (prev.t ?? 0)) };
      out.push(np); prev = np; d = dist(prev, q); acc = 0;
    }
    acc += d; prev = q;
  }
  const last = pts[pts.length - 1];
  if (out.length < cap && dist(out[out.length - 1], last) > 1e-6) out.push({ ...last });
  else if (out.length === cap) out[cap - 1] = { ...last };
  return out;
}

/** [1, 2, 1] / 4 smoothing, `passes` times; the endpoints stay */
export function smooth(pts, passes = 1) {
  let p = pts;
  for (let k = 0; k < passes; k++) {
    if (p.length < 3) return p.map((q) => ({ ...q }));
    const o = [{ ...p[0] }];
    for (let i = 1; i < p.length - 1; i++) o.push({ x: (p[i - 1].x + 2 * p[i].x + p[i + 1].x) / 4, y: (p[i - 1].y + 2 * p[i].y + p[i + 1].y) / 4, t: p[i].t });
    o.push({ ...p[p.length - 1] }); p = o;
  }
  return p;
}

/** drop points closer than `minDist` to the previous kept point (pointer noise at rest) */
export function dedupe(pts, minDist = 1) {
  if (!pts.length) return [];
  const o = [pts[0]];
  for (let i = 1; i < pts.length; i++) if (dist(o[o.length - 1], pts[i]) >= minDist) o.push(pts[i]);
  if (o.length === 1 && pts.length > 1) o.push(pts[pts.length - 1]);
  return o;
}

const median = (a) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/** ShortStraw corners: returns {points (resampled), corners (indices, first and last included)} */
export function corners(pts, { window = 3, ratio = 0.95, lineRatio = 0.95 } = {}) {
  const b = bbox(pts); const S = Math.max(1, diag(b) / 40);
  const P = resampleSpacing(pts, S);
  const n = P.length; const W = window;
  if (n <= 2 * W + 1) return { points: P, corners: [0, n - 1] };
  const straw = new Array(n).fill(Infinity);
  for (let i = W; i < n - W; i++) straw[i] = dist(P[i - W], P[i + W]);
  const t = median(straw.slice(W, n - W)) * ratio;
  const C = [0];
  for (let i = W; i < n - W; i++) {
    if (straw[i] < t) {
      let lo = Infinity, at = i;
      while (i < n - W && straw[i] < t) { if (straw[i] < lo) { lo = straw[i]; at = i; } i++; }
      C.push(at);
    }
  }
  C.push(n - 1);
  const isLine = (a, c) => { const d = dist(P[a], P[c]); const L = pathLength(P.slice(a, c + 1)); return L === 0 ? true : d / L > lineRatio; };
  // post-process (paper, section 3.2): add a corner where a segment is not a line; remove corners that sit on a line
  for (let changed = true, guard = 0; changed && guard < 50; guard++) {
    changed = false;
    for (let k = 1; k < C.length; k++) {
      const a = C[k - 1], c = C[k];
      if (c - a > 2 * W + 1 && !isLine(a, c)) {
        let lo = Infinity, at = -1;
        for (let i = a + W; i <= c - W; i++) if (straw[i] < lo) { lo = straw[i]; at = i; }
        if (at > a && at < c) { C.splice(k, 0, at); changed = true; break; }
      }
    }
  }
  for (let k = 1; k < C.length - 1;) { if (isLine(C[k - 1], C[k + 1])) C.splice(k, 1); else k++; }
  return { points: P, corners: C };
}

/** turning along a path resampled at `step`: total |turn|, signed turn, and reversals (single turns sharper than `revDeg`) */
export function turning(pts, step = 4, revDeg = 120) {
  const P = resampleSpacing(pts, step);
  let abs = 0, signed = 0, reversals = 0; const k = 2;
  for (let i = k; i < P.length - k; i++) {
    const a1 = Math.atan2(P[i].y - P[i - k].y, P[i].x - P[i - k].x), a2 = Math.atan2(P[i + k].y - P[i].y, P[i + k].x - P[i].x);
    let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    abs += Math.abs(d) / k; signed += d / k;
  }
  // reversals: count windows where the direction turns by more than revDeg within a short span
  const span = Math.max(2, Math.round(10 / step)); let i = span;
  while (i < P.length - span) {
    const a1 = Math.atan2(P[i].y - P[i - span].y, P[i].x - P[i - span].x), a2 = Math.atan2(P[i + span].y - P[i].y, P[i + span].x - P[i].x);
    let d = Math.abs(a2 - a1); if (d > Math.PI) d = 2 * Math.PI - d;
    if (d * 180 / Math.PI > revDeg) { reversals++; i += 2 * span; } else i++;
  }
  return { abs, signed, reversals };
}

/** signed turning of a path, summed step by step over a resampling at `step` (a closed convex outline gives about 2 pi in absolute
 * value; a zigzag alternates and gives about 0 or one hairpin) */
export function signedTurning(pts, step, closed = false) {
  const P = resampleSpacing(pts, step); let s = 0;
  if (closed && P.length > 3 && dist(P[0], P[P.length - 1]) < step) P[P.length - 1] = P[0];
  const Q = closed && P.length > 3 ? [...P, P[1]] : P;     // a closed path also turns at its start
  for (let i = 1; i + 1 < Q.length; i++) {
    if (dist(Q[i], Q[i + 1]) === 0 || dist(Q[i - 1], Q[i]) === 0) continue;
    let d = Math.atan2(Q[i + 1].y - Q[i].y, Q[i + 1].x - Q[i].x) - Math.atan2(Q[i].y - Q[i - 1].y, Q[i].x - Q[i - 1].x);
    while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; s += d;
  }
  return s;
}

/** convex hull (Andrew's monotone chain), counter-clockwise in y-down screen coordinates is clockwise; closed polygon not repeated */
export function convexHull(pts) {
  const P = pts.map((p) => ({ x: p.x, y: p.y })).sort((a, b) => a.x - b.x || a.y - b.y);
  if (P.length < 3) return P;
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lo = [], up = [];
  for (const p of P) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  up.pop(); lo.pop();
  return lo.concat(up);
}

export function polygonArea(poly) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; a += p.x * q.y - q.x * p.y; }
  return Math.abs(a) / 2;
}

export function distToSegment(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy;
  let t = L2 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / L2 : 0; t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

export function distToPolyline(p, poly, closed = false) {
  let d = Infinity; const n = poly.length;
  if (n === 1) return dist(p, poly[0]);
  for (let i = 0; i + 1 < n; i++) d = Math.min(d, distToSegment(p, poly[i], poly[i + 1]));
  if (closed && n > 2) d = Math.min(d, distToSegment(p, poly[n - 1], poly[0]));
  return d;
}

export function pointInPolygon(p, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

/** distance from a point to a box (0 inside) */
export function distToBox(p, b) {
  const dx = Math.max(b.x - p.x, 0, p.x - (b.x + b.w)), dy = Math.max(b.y - p.y, 0, p.y - (b.y + b.h));
  return Math.hypot(dx, dy);
}

/** stroke from the flat encoding of the synthetic set: [x0, y0, t0, dx, dy, dt, ...] (deltas after the first point) */
export function fromDeltas(flat, id) {
  const pts = []; let x = 0, y = 0, t = 0;
  for (let i = 0; i + 2 < flat.length; i += 3) { x += flat[i]; y += flat[i + 1]; t += flat[i + 2]; pts.push({ x, y, t }); }
  return { id, points: pts };
}
