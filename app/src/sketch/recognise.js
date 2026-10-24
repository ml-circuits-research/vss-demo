// recognise.js: the classical stroke recogniser of the sketch pad (spec 17.1). Deterministic, DOM-free, no learned parameters beyond
// the prototype table below (set on the TUNE split of the synthetic set, never on the test split).
//
// 1. Strokes are grouped into symbols by drawing order and space: a stroke continues the previous group when it starts or ends at the
//    group's free end (multi-stroke rectangles, diamonds, triangles), when it is a short stroke at the far end of an open group (an
//    arrow head drawn separately), or when it closes a cylinder (a U whose two ends sit on a closed ellipse, in either order). A
//    scribble (back-and-forth stroke) is always its own group, joined only by more scribble over the same place.
// 2. Each group is described by geometric features: closed or open (free stroke ends, angular coverage around the box centre), hull
//    fill of the box, ink coverage of the four box sides, ink distance from the box corners, interior ink, turning, reversals.
// 3. Closed groups are scored against prototypes of the six closed kinds (a Gaussian cost on the features) and against point-cloud
//    templates with the $P matcher (Vatavu, Anthony and Wobbrock 2012, re-implemented here from the paper; non-uniform scaling to the
//    unit square, a stated deviation: aspect ratio is not a cue between our kinds, and lines never reach this matcher).
//    Open groups are connectors (line or arrow: an arrow head is two barbs on both sides of the shaft at one of the two extreme points),
//    scribbles, or unknown blobs (too much turning, or a closed group far from every prototype).
// The result for each group: ranked candidates {kind, score} (scores sum to 1), the margin (top minus second), the box, the stroke ids,
// the features and a reason in words. Nothing is decided about the scene here: scene_pass.js does that.
import { dist, bbox, boxUnion, diag, centre, pathLength, resampleSpacing, resample, smooth, turning, signedTurning, convexHull, polygonArea, distToPolyline, dedupe } from "./strokes.js";
import { TEMPLATES, CLOSED_KINDS } from "./templates.js";

export { CLOSED_KINDS };
export const OPEN_KINDS = ["line", "arrow"];
export const ALL_KINDS = [...CLOSED_KINDS, ...OPEN_KINDS, "scribble", "unknown"];

export const OPTIONS = {
  gapMs: 1500,          // a stroke can continue the previous group only if it starts within this time after the group's last stroke
  coverClosed: 0.75,    // angular coverage (share of 36 directions around the box centre with ink) for a closed group
  maxTurnConnector: 1.6 * Math.PI, // total turning of a connector's shaft (straight 0, one elbow pi / 2, a curve below pi)
  headMin: 0.3,         // arrow head score at an extreme point (balance of the two barbs times their presence)
  unknownCost: 26,      // a closed group whose best prototype cost exceeds this is an unknown blob (set on the tune split)
  maxTurnClosed: 1.6,   // total turning (in turns) of a closed shape's ink; one convex outline turns once (set on the tune split)
  maxTurnCylinder: 2.1, // an ellipse and a U
  pWeight: 6,           // weight of the $P distance in the closed-kind cost
  nCloud: 32,           // $P cloud size
};

// prototype features of the closed kinds: [mean, sd] per feature (set on the tune split by training/worlds/scene/tune_recogniser.mjs)
export const PROTOTYPES = {
  rectangle: { fill: [0.94, 0.035], cov: [0.94, 0.08], corner: [0.055, 0.02], interior: [0.0, 0.03], covMin: [0.84, 0.2] },
  rounded_rectangle: { fill: [0.91, 0.035], cov: [0.855, 0.06], corner: [0.139, 0.02], interior: [0.0, 0.03], covMin: [0.79, 0.07] },
  ellipse: { fill: [0.772, 0.03], cov: [0.55, 0.07], corner: [0.248, 0.05], interior: [0.0, 0.03], covMin: [0.48, 0.11] },
  diamond: { fill: [0.535, 0.03], cov: [0.19, 0.05], corner: [0.385, 0.05], interior: [0.0, 0.03], covMax: [0.23, 0.06] },
  triangle: { fill: [0.527, 0.03], cov: [0.36, 0.045], corner: [0.3, 0.045], interior: [0.0, 0.03], covMax: [0.97, 0.1] },
  cylinder: { fill: [0.887, 0.035], cov: [0.815, 0.1], corner: [0.145, 0.035], interior: [0.163, 0.04], covMin: [0.72, 0.15] },
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };

// ------------------------------------------------------------------ strokes
export function strokeInfo(s) {
  const pts = dedupe(s.points, 0.5); const box = bbox(pts); const len = pathLength(pts);
  const a = pts[0], b = pts[pts.length - 1];
  const tr = turning(smooth(resampleSpacing(pts, Math.max(2, len / 80)), 1), Math.max(2, Math.min(4, len / 40)), 125);
  const closedSelf = len > 0 && dist(a, b) < Math.max(10, 0.12 * len);
  // a scribble turns back and forth: at least two sharp reversals, much more ink than its size (a one-stroke arrow has two reversals but
  // little extra ink), dense ink for its box (a sharp diamond or triangle has at most a few reversals and a low density), and it does not
  // end where it started (a closed polygon does). Thresholds set on the tune split.
  const density = len / Math.sqrt(Math.max(1, box.w * box.h)), closure = len > 0 ? dist(a, b) / len : 1;
  const signed = signedTurning(pts, Math.max(3, len / 60), closure < 0.025);   // a closed outline with sharp corners (a star) turns about 2 pi one way
  const scribble = tr.reversals >= 2 && len / Math.max(1, diag(box)) >= 1.8 && (density >= 4 || tr.reversals >= 4) && !(closure < 0.03 && tr.reversals <= 3)
    && !(closure < 0.025 && Math.abs(signed) > 1.5 * Math.PI);
  return { id: s.id, pts, box, len, a, b, t0: pts[0]?.t ?? 0, t1: pts[pts.length - 1]?.t ?? 0, closedSelf: closedSelf && !scribble, scribble, reversals: tr.reversals,
    turnAbs: tr.abs, turnSigned: tr.signed,
    fine: resampleSpacing(pts, 1.5) };
}

function nearInk(p, infos, tol, exclude = null) {
  for (const s of infos) {
    if (s === exclude) continue;
    for (const q of s.fine) if (Math.abs(q.x - p.x) <= tol && Math.abs(q.y - p.y) <= tol && dist(p, q) <= tol) return true;
  }
  return false;
}

/** stroke ends of a group that touch no other ink of the group (a closed loop has none) */
export function freeEnds(infos, tol) {
  const out = [];
  for (const s of infos) {
    for (const [E, which] of [[s.a, 0], [s.b, 1]]) {
      // own ink far along the stroke counts (a single closed stroke), the ink right next to the end does not
      let touched = nearInk(E, infos, tol, s);
      if (!touched && s.len > 4 * tol) {
        const P = s.fine; let acc = 0;
        const idx = which === 0 ? [...P.keys()] : [...P.keys()].reverse();
        for (let k = 1; k < idx.length; k++) {
          acc += dist(P[idx[k - 1]], P[idx[k]]);
          if (acc > 3 * tol && dist(P[idx[k]], E) <= tol) { touched = true; break; }
        }
      }
      if (!touched) out.push({ p: E, stroke: s.id });
    }
  }
  return out;
}

const groupBox = (infos) => infos.reduce((b, s) => (b ? boxUnion(b, s.box) : { ...s.box }), null);
const tolOf = (box) => clamp(0.1 * diag(box), 8, 22);

function isClosedGroup(infos) {
  const box = groupBox(infos); const tol = tolOf(box); const fe = freeEnds(infos, tol);
  const cov = angularCoverage(infos.flatMap((s) => s.fine), box);
  // gaps at corners: every free end has another free end close by (a polygon drawn in pieces that do not quite meet)
  const gap = Math.max(1.5 * tol, 0.2 * diag(box));
  const nearlyClosed = fe.length > 0 && fe.every((f, i) => fe.some((q, j) => j !== i && dist(f.p, q.p) < gap));
  return { closed: (fe.length === 0 || nearlyClosed) && cov >= OPTIONS.coverClosed, free: fe, cov, tol, box };
}

export function angularCoverage(pts, box) {
  const c = centre(box); const bins = new Array(36).fill(0);
  const sx = Math.max(1, box.w / 2), sy = Math.max(1, box.h / 2);
  for (const p of pts) { const a = Math.atan2((p.y - c.y) / sy, (p.x - c.x) / sx); bins[Math.min(35, Math.floor((a + Math.PI) / (2 * Math.PI) * 36))] = 1; }
  return bins.reduce((m, v) => m + v, 0) / 36;
}

/** drawing order + space -> groups of stroke infos (see the header) */
export function groupStrokes(strokes, opts = OPTIONS) {
  const infos = strokes.map(strokeInfo).filter((s) => s.pts.length > 0);
  const groups = [];
  for (const s of infos) {
    const g = groups[groups.length - 1];
    const recent = g && s.t0 - g.t1 <= opts.gapMs;
    let join = false;
    if (g && recent) {
      if (s.scribble || g.scribble) {
        join = s.scribble && g.scribble && overlapsBox(s.box, g.box, 10);
      } else {
        const st = isClosedGroup(g.strokes);
        if (st.closed) join = !s.closedSelf && attachesCylinder(g.strokes, st, s);
        else {
          const tol = clamp(0.2 * Math.max(diag(g.box), diag(s.box)), 14, 26);
          const cont = st.free.some((f) => dist(f.p, s.a) <= tol || dist(f.p, s.b) <= tol);
          const head = isHeadStroke(g, s);
          const closesU = s.closedSelf && st.free.length === 2 && st.free.every((f) => nearInk(f.p, [s], tol));
          join = (!s.closedSelf && cont) || head || closesU;
        }
      }
    }
    if (join) { g.strokes.push(s); g.box = boxUnion(g.box, s.box); g.t1 = s.t1; }
    else groups.push({ strokes: [s], box: { ...s.box }, t0: s.t0, t1: s.t1, scribble: s.scribble });
  }
  return splitPass(groups);
}

const overlapsBox = (a, b, m = 0) => a.x < b.x + b.w + m && b.x < a.x + a.w + m && a.y < b.y + b.h + m && b.y < a.y + a.h + m;

function attachesCylinder(groupStrokes, st, s) {
  // a U whose two ends sit on the closed ellipse and which extends below it, within its width
  const tol = st.tol, b = st.box;
  return [s.a, s.b].every((p) => nearInk(p, groupStrokes, tol)) && s.box.y + s.box.h > b.y + b.h + 0.4 * b.h
    && s.box.x > b.x - 0.25 * b.w && s.box.x + s.box.w < b.x + b.w * 1.25;
}

function isHeadStroke(g, s) {
  // a short stroke at one of the two extreme points of an open, line-like group
  const pts = g.strokes.flatMap((x) => x.fine); if (pts.length < 2) return false;
  const [E0, E1] = extremePair(pts); const span = dist(E0, E1); if (span < 20) return false;
  const r = clamp(0.3 * span, 12, 34);
  if (s.len > 0.6 * span || diag(s.box) > 2.2 * r) return false;
  return s.fine.every((p) => dist(p, E0) <= 1.25 * r) || s.fine.every((p) => dist(p, E1) <= 1.25 * r);
}

function splitPass(groups) {
  // an open group of several strokes whose last strokes form a closed shape on their own is split (an arrow followed at once by a box
  // drawn from its tip); stated rule, checked on the suffixes only
  const out = [];
  for (const g of groups) {
    if (g.strokes.length >= 3 && !g.scribble && !isClosedGroup(g.strokes).closed) {
      let done = false;
      for (let k = 1; k < g.strokes.length - 1 && !done; k++) {
        const tail = g.strokes.slice(k);
        if (tail.length >= 2 && isClosedGroup(tail).closed) {
          const head = g.strokes.slice(0, k);
          out.push(mk(head), mk(tail)); done = true;
        }
      }
      if (done) continue;
    }
    // an open group of several long strokes is not one symbol: two connectors that meet at a component, or a line and an arrow drawn
    // end to end. Each long stroke starts its own group; short strokes (heads) stay with the long stroke drawn before them.
    if (g.strokes.length >= 2 && !g.scribble && !isClosedGroup(g.strokes).closed) {
      const maxLen = Math.max(...g.strokes.map((s) => s.len));
      const long = (s, prev) => s.len >= 40 && s.len >= 0.4 * maxLen && !(prev && isHeadStroke({ strokes: [prev] }, s));
      let prevLong = null; const isLong = g.strokes.map((s) => { const l = long(s, prevLong); if (l) prevLong = s; return l; });
      if (isLong.filter(Boolean).length >= 2) {
        let cur = [];
        g.strokes.forEach((s, i) => { if (isLong[i] && cur.length) { out.push(mk(cur)); cur = []; } cur.push(s); });
        if (cur.length) out.push(mk(cur));
        continue;
      }
    }
    out.push(g);
  }
  return out;
}
const mk = (strokes) => ({ strokes, box: groupBox(strokes), t0: strokes[0].t0, t1: strokes[strokes.length - 1].t1, scribble: strokes.every((s) => s.scribble) });

// ------------------------------------------------------------------ geometry of a group
export function extremePair(pts) {
  const P = pts.length > 160 ? resampleIdx(pts, 160) : pts;
  let best = -1, A = P[0], B = P[P.length - 1];
  for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) { const d = (P[i].x - P[j].x) ** 2 + (P[i].y - P[j].y) ** 2; if (d > best) { best = d; A = P[i]; B = P[j]; } }
  return [A, B];
}
const resampleIdx = (pts, n) => Array.from({ length: n }, (_, i) => pts[Math.round(i * (pts.length - 1) / (n - 1))]);

/** arrow head score at extreme point E: share of the near ink that forms barbs on BOTH sides of the shaft direction */
export function headScore(E, pts, span) {
  const r = clamp(0.22 * span, 9, 28);
  const hist = new Array(72).fill(0); let nfar = 0;
  for (const p of pts) { const d = dist(p, E); if (d >= r && d <= 2.2 * r) { hist[Math.floor((Math.atan2(p.y - E.y, p.x - E.x) + Math.PI) / (2 * Math.PI) * 72) % 72]++; nfar++; } }
  if (!nfar) return { score: 0, left: 0, right: 0, near: 0 };
  let bi = 0, bv = -1;
  for (let i = 0; i < 72; i++) { const v = hist[(i + 71) % 72] + 2 * hist[i] + hist[(i + 1) % 72]; if (v > bv) { bv = v; bi = i; } }
  const th = (bi + 0.5) / 72 * 2 * Math.PI - Math.PI;
  let left = 0, right = 0, near = 0;
  for (const p of pts) {
    const d = dist(p, E); if (d < 5 || d > r) continue; near++;
    const dlr = wrap(Math.atan2(p.y - E.y, p.x - E.x) - th), dl = dlr * 180 / Math.PI;
    if (Math.abs(dl) < 15 || Math.abs(dl) > 85 || Math.abs(d * Math.sin(dlr)) < 2.5) continue;   // off the shaft line by angle AND by 2.5 px
    if (dl > 0) left++; else right++;
  }
  // barbs on both sides; four points on the weaker side (1.5 px apart) reach the full score
  const lo = Math.min(left, right);
  const score = Math.min(1, lo / 4);
  return { score, left, right, near };
}

function sideCoverage(pts, box, band) {
  const cells = 20, sides = { top: new Array(cells).fill(0), bottom: new Array(cells).fill(0), left: new Array(cells).fill(0), right: new Array(cells).fill(0) };
  const { x, y, w, h } = box;
  for (const p of pts) {
    const u = Math.min(cells - 1, Math.max(0, Math.floor((p.x - x) / Math.max(1, w) * cells))), v = Math.min(cells - 1, Math.max(0, Math.floor((p.y - y) / Math.max(1, h) * cells)));
    if (p.y - y <= band) sides.top[u] = 1; if (y + h - p.y <= band) sides.bottom[u] = 1;
    if (p.x - x <= band) sides.left[v] = 1; if (x + w - p.x <= band) sides.right[v] = 1;
  }
  const c = {}; for (const k in sides) c[k] = sides[k].reduce((m, q) => m + q, 0) / cells;
  return c;
}

/** the features of a closed group (axis-aligned box) */
export function closedFeatures(pts, box) {
  const m = Math.max(1, Math.min(box.w, box.h)); const band = 0.07 * m + 2;
  const hull = convexHull(pts); const fill = polygonArea(hull) / Math.max(1, box.w * box.h);
  const sc = sideCoverage(pts, box, band); const covs = [sc.top, sc.bottom, sc.left, sc.right];
  const cs = [[box.x, box.y], [box.x + box.w, box.y], [box.x, box.y + box.h], [box.x + box.w, box.y + box.h]];
  const corner = cs.map(([cx, cy]) => { let d = Infinity; for (const p of pts) d = Math.min(d, Math.hypot(p.x - cx, p.y - cy)); return d / m; });
  const thr = Math.max(band, 0.12 * m); let inner = 0;
  for (const p of pts) if (distToPolyline(p, hull, true) > thr) inner++;
  return { fill, cov: covs.reduce((a, b) => a + b, 0) / 4, covMin: Math.min(...covs), covMax: Math.max(...covs), sides: sc,
    corner: corner.reduce((a, b) => a + b, 0) / 4, corners: corner, interior: inner / Math.max(1, pts.length) };
}

// ------------------------------------------------------------------ $P point-cloud matcher (unit-square normalization)
function cloudOf(strokesPts, n) {
  const all = strokesPts.flat(); const b = bbox(all); const L = strokesPts.reduce((m, s) => m + pathLength(s), 0);
  const out = [];
  for (const s of strokesPts) {
    const k = Math.max(1, Math.round(n * pathLength(s) / Math.max(1e-9, L)));
    out.push(...resample(s, k));
  }
  const P = resampleIdx(out, n);
  return P.map((p) => ({ x: (p.x - b.x) / Math.max(1e-9, b.w), y: (p.y - b.y) / Math.max(1e-9, b.h) }));
}
function cloudDistance(P, T, start) {
  const n = P.length, matched = new Array(n).fill(false); let sum = 0, i = start;
  do {
    let min = Infinity, idx = -1;
    for (let j = 0; j < n; j++) if (!matched[j]) { const d = (P[i].x - T[j].x) ** 2 + (P[i].y - T[j].y) ** 2; if (d < min) { min = d; idx = j; } }
    matched[idx] = true; const wgt = 1 - ((i - start + n) % n) / n; sum += wgt * Math.sqrt(min); i = (i + 1) % n;
  } while (i !== start);
  return sum;
}
export function greedyCloudMatch(P, T) {
  const n = P.length, step = Math.floor(Math.pow(n, 0.5)); let min = Infinity;
  for (let i = 0; i < n; i += step) min = Math.min(min, cloudDistance(P, T, i), cloudDistance(T, P, i));
  return min / n;
}
let TEMPLATE_CLOUDS = null;
function templateClouds(n) {
  if (!TEMPLATE_CLOUDS || TEMPLATE_CLOUDS.n !== n) TEMPLATE_CLOUDS = { n, list: TEMPLATES.map((t) => ({ kind: t.kind, cloud: cloudOf(t.strokes, n) })) };
  return TEMPLATE_CLOUDS.list;
}
export function pDistances(strokesPts, n = OPTIONS.nCloud) {
  const P = cloudOf(strokesPts, n); const best = {};
  for (const t of templateClouds(n)) { const d = greedyCloudMatch(P, t.cloud); if (best[t.kind] === undefined || d < best[t.kind]) best[t.kind] = d; }
  return best;
}

// ------------------------------------------------------------------ classification
const softmaxScores = (costs) => {
  const ks = Object.keys(costs); const m = Math.min(...ks.map((k) => costs[k]));
  const e = ks.map((k) => Math.exp(-(costs[k] - m) / 2)); const z = e.reduce((a, b) => a + b, 0);
  return ks.map((k, i) => ({ kind: k, score: e[i] / z, cost: costs[k] })).sort((a, b) => b.score - a.score || a.kind.localeCompare(b.kind));
};

function protoCost(f, proto) {
  let c = 0; for (const k in proto) { const [mu, sd] = proto[k]; c += ((f[k] - mu) / sd) ** 2; } return c;
}

export function classifyGroup(g, opts = OPTIONS) {
  const strokes = g.strokes; const pts = strokes.flatMap((s) => s.fine); const box = groupBox(strokes);
  const ids = strokes.map((s) => s.id); const base = { strokes: ids, box, t0: g.t0, t1: g.t1 };
  const inkLen = strokes.reduce((m, s) => m + s.len, 0);
  if (inkLen < 6 || diag(box) < 6) return { ...base, kind: "unknown", candidates: [{ kind: "unknown", score: 1 }], margin: 1, reason: "a dot: too little ink to read" };
  if (g.scribble) {
    return { ...base, kind: "scribble", candidates: [{ kind: "scribble", score: 1 }], margin: 1, features: { reversals: strokes.reduce((m, s) => m + s.reversals, 0) },
      reason: `scribble: back-and-forth strokes (${strokes.reduce((m, s) => m + s.reversals, 0)} reversals)` };
  }
  const st = isClosedGroup(strokes);
  if (st.closed) {
    const f = closedFeatures(pts, box); const pd = pDistances(strokes.map((s) => s.pts));
    // bumpiness: total turning of the ink in turns (a convex outline turns once; clouds, stars and loops turn much more)
    const stp = Math.max(3, diag(box) / 30);
    f.turn = strokes.reduce((m, s) => m + (s.len > 3 * stp ? turning(smooth(resampleSpacing(s.pts, stp), 1), stp).abs : 0), 0) / (2 * Math.PI);
    const costs = {}; for (const k of CLOSED_KINDS) costs[k] = protoCost(f, PROTOTYPES[k]) + opts.pWeight * (pd[k] - Math.min(...Object.values(pd))) / 0.05;
    const raw = {}; for (const k of CLOSED_KINDS) raw[k] = protoCost(f, PROTOTYPES[k]);
    const cand = softmaxScores(costs); const best = cand[0];
    const margin = best.score - (cand[1]?.score ?? 0);
    const features = { ...f, closed: true, coverage: st.cov, p: pd };
    const turnMax = best.kind === "cylinder" ? opts.maxTurnCylinder : opts.maxTurnClosed;
    if (f.turn > turnMax) {
      return { ...base, kind: "unknown", candidates: cand, margin, features, reason: `closed ink that turns too much for a ${best.kind} (${f.turn.toFixed(2)} turns > ${turnMax}): a blob, not a shape` };
    }
    if (Math.min(...Object.values(raw)) > opts.unknownCost) {
      return { ...base, kind: "unknown", candidates: cand, margin, features, reason: `closed ink far from every kind (best ${best.kind}, cost ${Math.min(...Object.values(raw)).toFixed(1)} > ${opts.unknownCost})` };
    }
    return { ...base, kind: best.kind, candidates: cand, margin, features,
      reason: `closed; fill ${f.fill.toFixed(2)}, side ink ${f.cov.toFixed(2)}, corner gap ${f.corner.toFixed(2)}, inner ink ${f.interior.toFixed(2)}; $P ${pd[best.kind].toFixed(3)}` };
  }
  // open: connector, or unknown
  const [E0, E1] = extremePair(pts); const span = dist(E0, E1);
  const main = strokes.reduce((a, b) => (b.len > a.len ? b : a));
  // evidence of a head at an extreme point: barbs on both sides (geometry), or separate short strokes drawn there (a head drawn as its
  // own stroke or strokes), or the main stroke hooking back and forth there (a head drawn without lifting the pen)
  const rr = clamp(0.3 * span, 12, 34);
  const headAt = (E) => {
    const g = headScore(E, pts, span);
    const extra = strokes.filter((s) => s !== main && s.fine.every((p) => dist(p, E) <= 1.3 * rr)).length;
    const end = dist(main.a, E) < dist(main.b, E) ? main.pts : [...main.pts].reverse();
    let k = 0; while (k < end.length && dist(end[k], E) <= rr) k++;
    const part = end.slice(0, Math.max(2, k)); const ext = Math.max(...part.map((p) => dist(p, E)));
    const hook = k >= 4 && pathLength(part) > 2.2 * Math.max(4, ext);
    return { score: Math.max(g.score, extra ? 0.9 : 0, hook ? 0.9 : 0), geometry: g.score, extra, hook };
  };
  const h0 = headAt(E0), h1 = headAt(E1);
  const r = clamp(0.22 * span, 9, 28);
  const shaft = main.pts.filter((p) => (h0.score < opts.headMin || dist(p, E0) > r) && (h1.score < opts.headMin || dist(p, E1) > r));
  const sp = shaft.length >= 2 ? smooth(resampleSpacing(shaft, clamp(pathLength(shaft) / 25, 5, 20)), 2) : shaft;
  const turn = sp.length >= 5 ? turning(sp, clamp(pathLength(shaft) / 25, 5, 20)).abs : 0;
  const features = { closed: false, coverage: st.cov, free: st.free.length, span, head0: h0.score, head1: h1.score, turn, straightness: span / Math.max(1, main.len) };
  if (turn > opts.maxTurnConnector || span < 12) {
    return { ...base, kind: "unknown", candidates: [{ kind: "unknown", score: 1 }], margin: 1, features, reason: `open ink that is not a connector (turning ${(turn / Math.PI).toFixed(2)} pi)` };
  }
  const hs = Math.max(h0.score, h1.score); const pArrow = 1 / (1 + Math.exp(-(hs - opts.headMin) / 0.06));
  const cand = [{ kind: "arrow", score: pArrow }, { kind: "line", score: 1 - pArrow }].sort((a, b) => b.score - a.score);
  const tipIs1 = h1.score >= h0.score; const both = h0.score >= opts.headMin && h1.score >= opts.headMin;
  const tail = tipIs1 ? E0 : E1, tip = tipIs1 ? E1 : E0;
  const kind = cand[0].kind;
  return { ...base, kind, candidates: cand, margin: Math.abs(cand[0].score - cand[1].score), features,
    // a line has no direction: its first end is the one where the pen went down (drawing order)
    ends: kind === "arrow" ? { tail: { x: tail.x, y: tail.y }, tip: { x: tip.x, y: tip.y }, heads: both ? 2 : 1 }
      : (dist(E0, main.a) <= dist(E1, main.a) ? { tail: { x: E0.x, y: E0.y }, tip: { x: E1.x, y: E1.y }, heads: 0 } : { tail: { x: E1.x, y: E1.y }, tip: { x: E0.x, y: E0.y }, heads: 0 }),
    path: main.pts.filter((_, i) => i % 3 === 0 || i === main.pts.length - 1).map((p) => ({ x: p.x, y: p.y })),
    reason: kind === "arrow" ? `open; a head of barbs at one end (score ${hs.toFixed(2)})` : `open; no head (best head score ${hs.toFixed(2)}), turning ${(turn / Math.PI).toFixed(2)} pi` };
}

/** strokes -> {groups: [...]} (see the header); deterministic */
export function recognise(strokes, opts = OPTIONS) {
  const groups = groupStrokes(strokes, opts);
  return { groups: groups.map((g, i) => ({ id: `s${i + 1}`, ...classifyGroup(g, opts) })) };
}
