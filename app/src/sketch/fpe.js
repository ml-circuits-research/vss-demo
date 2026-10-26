// fpe.js: positions as addresses (fractional power encoding, spec 17.3), the JS port of the scene readout of
// training/worlds/scene/fpe.py and experiment_fpe.py (the reference: parity-tested by app/tests/fpe_parity.mjs against a golden file
// written from the Python by training/parity/make_fpe_golden.py). DOM-free, deterministic, no fetch.
//
// The address of a point is A(x, y) = exp(i (theta_x x + theta_y y)) with unit-modulus phases theta (D per axis); nearby points have
// similar addresses (a shift-invariant kernel with length scale L px), a displacement is a multiplication. A scene is ONE superposition
//   S = sum_k E_k (x) A(c_k) + E_k (x) R_kind (x) K_kind                   element centres and kinds
//     + sum_c E_c (x) (R_tl (x) A(tl_c) + R_br (x) A(br_c))                container corners
//     + sum_j E_j (x) (R_tail (x) A(tail_j) + R_tip (x) A(tip_j))          connector ends
// and every relation is READ from it by displacing and comparing, never learned:
//   decode(a)   q_a = S (x) conj(E_a), the position is the argmax of Re<q_a, A(x, y)> on a grid, refined coarse to fine
//   left_of / above   the second address against the first one displaced by the half-plane bundle (the margin is |score|)
//   inside(a, c)      the four container corners' sides (the margin is the weakest of the four)
//   nearest(j)        the decoded tip against the decoded centres by address similarity (the margin is best minus second)
//
// Deviation from fpe.py, written down (the Python draws its random phases and identities from the NumPy generator, which a browser
// cannot reproduce; the portable star_version 2 of src/vss/stars.js is what the app uses): identities and role vectors are the portable
// stars star_v2("scene-fpe-<seed>", name), and the position phases are drawn from portable uniforms u1, u2 in (0, 1) of the stars
// named "scene-fpe-<seed>:fpe:theta:<kernel>:<axis>:a|b": gaussian theta = sqrt(-2 ln u1) cos(2 pi u2) / L (Box-Muller), sinc
// theta = (2 u1 - 1) pi / L. The distributions are the ones of fpe.py; training/parity/make_fpe_golden.py injects exactly these phases
// and stars into fpe.py's own classes, so the parity test compares the ALGORITHM (encoding, decoding, relations) to the reference.
import { starV2Phases, fromPhases } from "../vss/stars.js";

export const W0 = 1200, H0 = 800;                      // the canvas of the experiment (generate.py)
/** the setting of the app: the choice of the dev split for seed 0 of the run logs/scene_fpe_53ae844 (gaussian 48 at both sizes) */
export const FPE_SETTINGS = { 1024: { kernel: "gaussian", L: 48 }, 4096: { kernel: "gaussian", L: 48 } };
/** the measured capacity (all four relations >= 0.97, mean over five seeds, logs/scene_fpe_53ae844): elements per scene */
export const FPE_CAPACITY = { 1024: 16, 4096: 64 };

const TWO_PI = 2 * Math.PI;
const cvec = (D) => ({ re: new Float64Array(D), im: new Float64Array(D) });
const cmul = (a, b) => { const D = a.re.length, o = cvec(D); for (let i = 0; i < D; i++) { o.re[i] = a.re[i] * b.re[i] - a.im[i] * b.im[i]; o.im[i] = a.re[i] * b.im[i] + a.im[i] * b.re[i]; } return o; };
const conj = (a) => ({ re: a.re, im: a.im.map((v) => -v) });
const addTo = (S, a) => { for (let i = 0; i < S.re.length; i++) { S.re[i] += a.re[i]; S.im[i] += a.im[i]; } return S; };
/** numpy.arange(start, stop, step) for floats */
function arange(start, stop, step) { const n = Math.max(0, Math.ceil((stop - start) / step)), d = (start + step) - start, o = new Float64Array(n); for (let i = 0; i < n; i++) o[i] = start + i * d; return o; }

/** the portable uniform stream in (0, 1): the star phase p in [-pi, pi) as u = (p + pi) / 2 pi = (r + 0.5) / 2^32 */
const uniforms = (seed, name, D) => { const p = starV2Phases(seed, name, D), u = new Float64Array(D); for (let i = 0; i < D; i++) u[i] = (p[i] + Math.PI) / TWO_PI; return u; };

export class FPE {
  /** D: dimension; seed: integer; L: length scale in px; kernel: "gaussian" | "sinc" */
  constructor(D, seed, L, kernel = "gaussian") {
    this.D = D; this.seed = seed; this.L = +L; this.kernel = kernel;
    if (kernel !== "gaussian" && kernel !== "sinc") throw new Error(`unknown kernel ${kernel}`);
    this.theta = [0, 1].map((ax) => {
      const base = `scene-fpe-${seed}`, nm = (s) => `fpe:theta:${kernel}:${ax}:${s}`, u1 = uniforms(base, nm("a"), D), th = new Float64Array(D);
      if (kernel === "gaussian") { const u2 = uniforms(base, nm("b"), D); for (let i = 0; i < D; i++) th[i] = Math.sqrt(-2 * Math.log(u1[i])) * Math.cos(TWO_PI * u2[i]) / this.L; }
      else for (let i = 0; i < D; i++) th[i] = (2 * u1[i] - 1) * Math.PI / this.L;
      return th;
    });
    this.axisCache = new Map();
  }
  /** P_axis^v for an array of values -> array of {re, im} (cached for the decode grids) */
  axisVec(axis, v) { const th = this.theta[axis], D = this.D, o = cvec(D); for (let i = 0; i < D; i++) { const a = v * th[i]; o.re[i] = Math.cos(a); o.im[i] = Math.sin(a); } return o; }
  /** A(x, y) */
  addr(x, y) { const t0 = this.theta[0], t1 = this.theta[1], D = this.D, o = cvec(D); for (let i = 0; i < D; i++) { const a = x * t0[i] + y * t1[i]; o.re[i] = Math.cos(a); o.im[i] = Math.sin(a); } return o; }
  /** Re <a, b> / D, <a, b> = sum conj(b) a */
  sim(a, b) { let s = 0; for (let i = 0; i < this.D; i++) s += a.re[i] * b.re[i] + a.im[i] * b.im[i]; return s / this.D; }
  /** the rows of conj(P_axis^v) for a grid of values (Float64Array of re and im, nv x D), cached when `key` is given */
  _grid(axis, vs, key) {
    if (key && this.axisCache.has(key)) return this.axisCache.get(key);
    const D = this.D, n = vs.length, re = new Float64Array(n * D), im = new Float64Array(n * D), th = this.theta[axis];
    for (let k = 0; k < n; k++) for (let i = 0; i < D; i++) { const a = vs[k] * th[i]; re[k * D + i] = Math.cos(a); im[k * D + i] = Math.sin(a); }
    const g = { re, im, n }; if (key) this.axisCache.set(key, g); return g;
  }
  /** Re <q, A(x, y)> / D over the grid xs x ys -> Float64Array(nx * ny), row-major in x */
  response(q, xs, ys, key) {
    const D = this.D, nx = xs.length, ny = ys.length, GX = this._grid(0, xs, key && `${key}:x`), GY = this._grid(1, ys, key && `${key}:y`), R = new Float64Array(nx * ny);
    const tr = new Float64Array(D), ti = new Float64Array(D);
    for (let ix = 0; ix < nx; ix++) {
      const ox = ix * D;
      for (let i = 0; i < D; i++) { const pr = GX.re[ox + i], pi = -GX.im[ox + i]; tr[i] = pr * q.re[i] - pi * q.im[i]; ti[i] = pr * q.im[i] + pi * q.re[i]; }   // conj(PX) * q
      for (let iy = 0; iy < ny; iy++) {
        const oy = iy * D; let s = 0;
        for (let i = 0; i < D; i++) s += tr[i] * GY.re[oy + i] + ti[i] * GY.im[oy + i];           // Re (t * conj(conj(PY))) = Re (t * PY)
        R[ix * ny + iy] = s / D;
      }
    }
    return R;
  }
  /** the position whose address best matches q: coarse grid of step ~L/3 on [0, width] x [0, height], refined locally -> {x, y, peak} */
  decode(q, width, height, rounds = 3) {
    let st = Math.max(2.0, this.L / 3.0);
    let xs = arange(0, width + st / 2, st), ys = arange(0, height + st / 2, st);
    const argmax = (R) => { let b = 0; for (let i = 1; i < R.length; i++) if (R[i] > R[b]) b = i; return b; };
    let R = this.response(q, xs, ys, `c:${width}:${height}`), i = argmax(R), ix = Math.floor(i / ys.length), iy = i % ys.length, bx = xs[ix], by = ys[iy];
    for (let r = 0; r < rounds; r++) {
      st = st / 4.0;
      xs = Float64Array.from({ length: 9 }, (_, k) => bx + (k - 4) * st); ys = Float64Array.from({ length: 9 }, (_, k) => by + (k - 4) * st);
      R = this.response(q, xs, ys); i = argmax(R); ix = Math.floor(i / 9); iy = i % 9; bx = xs[ix]; by = ys[iy];
    }
    return { x: bx, y: by, peak: R[i] };
  }
  /** the bundle of every displacement on one side of an anchor along `axis` (sign +-1), normalised to unit mean power */
  halfplane(axis, sign, extent, otherExtent, step) {
    const st = step || Math.max(1.0, this.L / 4.0), D = this.D;
    const u = arange(st, extent + st / 2, st).map((x) => x * sign), v = arange(-otherExtent, otherExtent + st / 2, st);
    const sum = (ax, vs) => { const o = cvec(D), th = this.theta[ax]; for (const x of vs) for (let i = 0; i < D; i++) { const a = x * th[i]; o.re[i] += Math.cos(a); o.im[i] += Math.sin(a); } return o; };
    const H = cmul(sum(axis, u), sum(1 - axis, v)); let p = 0; for (let i = 0; i < D; i++) p += H.re[i] * H.re[i] + H.im[i] * H.im[i];
    const nrm = Math.sqrt(p / D); for (let i = 0; i < D; i++) { H.re[i] /= nrm; H.im[i] /= nrm; }
    return H;
  }
  /** which side of the anchor the content of q lies on: Re <q, anchor (x) H+> - Re <q, anchor (x) H-> (positive: the + side) */
  side(q, anchor, Hpos, Hneg) { return this.sim(q, cmul(anchor, Hpos)) - this.sim(q, cmul(anchor, Hneg)); }
}

/** identities and role vectors: portable stars of the world "scene-fpe-<seed>" */
export class Algebra {
  constructor(D, seed) { this.D = D; this.seed = seed; this.cache = new Map(); }
  v(name) { let x = this.cache.get(name); if (!x) { x = fromPhases(starV2Phases(`scene-fpe-${this.seed}`, name, this.D)); this.cache.set(name, x); } return x; }
  el(k) { return this.v(`el:${k}`); }
  role(r) { return this.v(`role:${r}`); }
  kind(k) { return this.v(`sym:${k}`); }
}

/** the superposition of a scene {elements: [{id, kind, box: [x, y, w, h], container?}], connectors: [{id, tail: [x, y], tip: [x, y]}]} */
export function encodeScene(scene, fpe, alg) {
  const S = cvec(fpe.D);
  for (const e of scene.elements) {
    const [x, y, w, h] = e.box, E = alg.el(e.id);
    addTo(S, cmul(E, fpe.addr(x + w / 2, y + h / 2))); addTo(S, cmul(cmul(E, alg.role("kind")), alg.kind(e.kind)));
    if (e.container) addTo(S, cmul(E, addTo(cmul(alg.role("tl"), fpe.addr(x, y)), cmul(alg.role("br"), fpe.addr(x + w, y + h)))));
  }
  for (const c of scene.connectors || []) {
    const E = alg.el(c.id);
    addTo(S, cmul(E, addTo(cmul(alg.role("tail"), fpe.addr(c.tail[0], c.tail[1])), cmul(alg.role("tip"), fpe.addr(c.tip[0], c.tip[1])))));
  }
  return S;
}
export const nTerms = (scene) => 2 * scene.elements.length + 2 * scene.elements.filter((e) => e.container).length + 2 * (scene.connectors || []).length;

/** the readout of one (fpe, algebra) pair on a canvas of W x H px; the half-plane templates are built once */
export class Reader {
  constructor(fpe, alg, W = W0, H = H0) {
    this.f = fpe; this.a = alg; this.W = W; this.H = H;
    this.Hx = [fpe.halfplane(0, +1, W, H), fpe.halfplane(0, -1, W, H)]; this.Hy = [fpe.halfplane(1, +1, H, W), fpe.halfplane(1, -1, H, W)];
    this.hc = { x: this.Hx.map(conj), y: this.Hy.map(conj) };
  }
  scene(s) { this.S = encodeScene(s, this.f, this.a); this.cache = new Map(); this.s = s; return this; }
  q(id, role) { let v = this.a.el(id); if (role) v = cmul(v, this.a.role(role)); return cmul(this.S, conj(v)); }
  /** the decoded position of an element (role null: its centre) or of one of its roles (tl, br, tail, tip), cached per scene */
  pos(id, role = null) {
    const k = `${id}|${role || ""}`; let p = this.cache.get(k);
    if (!p) { const d = this.f.decode(this.q(id, role), this.W, this.H); p = [d.x, d.y]; this.cache.set(k, p); }
    return p;
  }
  addrOf(id, role = null) { const p = this.pos(id, role); return this.f.addr(p[0], p[1]); }
  /** the side score of b relative to a along x (left_of: positive when a is left of b) or y (above) */
  relScore(rel, a, b) { const H = rel === "left_of" ? this.Hx : this.Hy; return this.f.side(this.addrOf(b), this.addrOf(a), H[0], H[1]); }
  /** is element a inside container c (its corners): {value, margin, score} */
  inside(a, c) {
    const f = this.f, A = this.addrOf(a), qtl = this.addrOf(c, "tl"), qbr = this.addrOf(c, "br");
    const s = [f.side(qtl, A, this.hc.x[0], this.hc.x[1]), f.side(qtl, A, this.hc.y[0], this.hc.y[1]), f.side(qbr, A, this.Hx[0], this.Hx[1]), f.side(qbr, A, this.Hy[0], this.Hy[1])];
    const m = Math.min(...s); return { value: m > 0, margin: Math.abs(m), score: m };
  }
  /** the candidate (ids) whose decoded centre is most similar to the decoded end (role "tip" or "tail") of connector j: {id, margin, sim, ranked} */
  nearest(j, ids, role = "tip") {
    const T = this.addrOf(j, role), r = ids.map((e) => ({ sim: this.f.sim(T, this.addrOf(e)), id: e })).sort((p, q) => q.sim - p.sim || (p.id < q.id ? 1 : -1));
    return { id: r[0].id, margin: r[0].sim - (r[1] ? r[1].sim : 0), sim: r[0].sim, ranked: r };
  }
  /** the experiment's query: {rel: left_of | above | inside | nearest, ...} -> {pred, margin, score} */
  answer(q) {
    if (q.rel === "left_of" || q.rel === "above") { const sc = this.relScore(q.rel, q.a, q.b); return { pred: sc > 0, margin: Math.abs(sc), score: sc }; }
    if (q.rel === "inside") { const r = this.inside(q.a, q.c); return { pred: r.value, margin: r.margin, score: r.score }; }
    if (q.rel === "nearest") { const ids = this.s.elements.filter((e) => !e.container).map((e) => e.id), r = this.nearest(q.j, ids); return { pred: r.id, margin: r.margin, score: r.sim }; }
    throw new Error(`unknown relation ${q.rel}`);
  }
}
