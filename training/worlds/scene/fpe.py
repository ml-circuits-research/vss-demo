"""fpe.py: fractional power encoding of continuous positions as phases (spec 17.3, "positions as addresses: the one change to the algebra").

In the text worlds every address is learned from the kinds of words. Here the address of an element is its position: a base vector
P (unit-modulus complex, phases theta) raised to a real power, P^x = exp(i theta x), so that a point (x, y) has the address
    A(x, y) = P_x^x (x) P_y^y = exp(i (theta_x x + theta_y y))          ((x) = elementwise product, the FHRR binding)
Nearby points have similar addresses, distant points nearly orthogonal ones, and a displacement is a multiplication:
    A(x, y) (x) conj(A(dx, dy)) = A(x - dx, y - dy)                      (the scene shifted by (dx, dy): S (x) conj(A(dx, dy)))
The similarity of two addresses depends only on the displacement (a shift-invariant kernel):
    Re <A(p), A(q)> / D  ->  k(p - q)  as D grows
    kernel 'gaussian': theta ~ N(0, 1 / L^2) per component  ->  k(d) = exp(-|d|^2 / (2 L^2))   (monotone in the distance)
    kernel 'sinc':     theta ~ U(-pi / L, pi / L)            ->  k(d) = sinc(dx / L) sinc(dy / L) (side lobes)
L (the length scale, in pixels) is the one free parameter; the experiment chooses it on the dev split.

This module is numpy only (cupy works as a drop-in `xp` for large sweeps) and does NOT modify tool/ or experiment/: the stars of the
rest of the scene (element identities, role vectors) come from tool/sop/world.py `star`, imported read-only.
"""
import hashlib, math, os, sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tool"))
from sop.world import star  # noqa: E402  (read-only use of the existing algebra: identities and roles)


def _rng(seed, name):
    h = hashlib.sha256(f"{seed}:fpe:{name}".encode()).digest()
    return np.random.default_rng(int.from_bytes(h[:8], "little"))


class FPE:
    """positions as addresses. D: dimension; L: length scale in px; kernel: 'gaussian' | 'sinc'; xp: numpy or cupy"""

    def __init__(self, D, seed, L, kernel="gaussian", xp=np):
        self.D, self.seed, self.L, self.kernel, self.xp = D, seed, float(L), kernel, xp
        r = _rng(seed, f"base:{kernel}")
        if kernel == "gaussian": th = r.normal(0.0, 1.0 / self.L, (2, D))
        elif kernel == "sinc": th = r.uniform(-math.pi / self.L, math.pi / self.L, (2, D))
        else: raise ValueError(kernel)
        self.theta = xp.asarray(th)

    # ---------------------------------------------------------------- addresses
    def axis(self, axis, v):
        """P_axis^v for a scalar or an array of values -> (..., D)"""
        v = self.xp.asarray(v, dtype=float)
        return self.xp.exp(1j * v[..., None] * self.theta[axis])

    def addr(self, x, y):
        """A(x, y) for scalars or arrays of equal shape -> (..., D)"""
        x = self.xp.asarray(x, dtype=float); y = self.xp.asarray(y, dtype=float)
        return self.xp.exp(1j * (x[..., None] * self.theta[0] + y[..., None] * self.theta[1]))

    def shift(self, S, dx, dy):
        """the state displaced by (dx, dy) in address space: S (x) conj(A(dx, dy))"""
        return S * self.xp.conj(self.addr(dx, dy))

    def k(self, dx, dy):
        """the analytic kernel (the large-D limit of Re <A(p), A(p + d)> / D)"""
        if self.kernel == "gaussian": return np.exp(-(np.asarray(dx) ** 2 + np.asarray(dy) ** 2) / (2 * self.L ** 2))
        s = lambda u: np.sinc(np.asarray(u) / self.L)
        return s(dx) * s(dy)

    # ---------------------------------------------------------------- similarity and decoding
    def sim(self, a, b):
        """Re <a, b> / D (a, b: (..., D)); <a, b> = sum conj(b) a"""
        return self.xp.real((a * self.xp.conj(b)).sum(-1)) / self.D

    def response(self, q, xs, ys):
        """Re <q, A(x, y)> / D over the grid xs x ys -> (len(xs), len(ys)); separable: one matrix product"""
        PX = self.axis(0, xs); PY = self.axis(1, ys)
        return self.xp.real((self.xp.conj(PX) * q[None, :]) @ self.xp.conj(PY).T) / self.D

    def decode(self, q, width, height, coarse=None, rounds=3):
        """the position whose address best matches q: argmax of the response on a grid of step ~L/3, refined locally (coarse to fine)
        -> (x, y, peak response)"""
        xp = self.xp; st = coarse or max(2.0, self.L / 3.0)
        xs = np.arange(0, width + st / 2, st); ys = np.arange(0, height + st / 2, st)
        R = self.response(q, xs, ys); i = int(xp.argmax(R)); ix, iy = divmod(i, len(ys)); bx, by = xs[ix], ys[iy]
        for _ in range(rounds):
            st = st / 4.0
            xs = bx + np.arange(-4, 5) * st; ys = by + np.arange(-4, 5) * st
            R = self.response(q, xs, ys); i = int(xp.argmax(R)); ix, iy = divmod(i, len(ys)); bx, by = xs[ix], ys[iy]
        return float(bx), float(by), float(R[ix, iy])

    # ---------------------------------------------------------------- half-plane templates (relations read by displacing and comparing)
    def halfplane(self, axis, sign, extent, other_extent, step=None):
        """H = sum over u in (0, extent] (sign) along `axis`, all v in [-other_extent, other_extent] along the other axis, of A(u, v):
        the bundle of every displacement that lies on one side. Separable: (sum_u P_axis^(sign u)) (x) (sum_v P_other^v)."""
        st = step or max(1.0, self.L / 4.0)
        u = np.arange(st, extent + st / 2, st) * sign; v = np.arange(-other_extent, other_extent + st / 2, st)
        Hu = self.axis(axis, u).sum(0); Hv = self.axis(1 - axis, v).sum(0)
        H = Hu * Hv
        return H / self.xp.sqrt((self.xp.abs(H) ** 2).mean())

    def side(self, q, anchor_addr, Hpos, Hneg):
        """which side of the anchor the content of q lies on: Re <q, anchor (x) H+> - Re <q, anchor (x) H-> (positive: the + side)"""
        return float(self.sim(q, anchor_addr * Hpos) - self.sim(q, anchor_addr * Hneg))


class Algebra:
    """identities and role vectors of the scene world (from tool/sop/world.py `star`, the world's seed), and the encoder of a scene"""

    def __init__(self, D, seed, xp=np):
        self.D, self.seed, self.xp, self.cache = D, seed, xp, {}

    def v(self, name):
        if name not in self.cache: self.cache[name] = self.xp.asarray(star(f"scene-fpe-{self.seed}", name, self.D))
        return self.cache[name]

    def el(self, k): return self.v(f"el:{k}")
    def role(self, r): return self.v(f"role:{r}")
    def kind(self, k): return self.v(f"sym:{k}")


def encode_scene(scene, fpe, alg, corners="containers"):
    """corners: "containers" (the experiment's scene) or "all" (every element also carries its two corner addresses; used by the
    outline-aware readout, nearest_outline below; two more terms per element)
    S = sum_k E_k (x) A(c_k)                                   element centres
         + sum_k E_k (x) R_kind (x) K_kind                       element kinds
         + sum_c E_c (x) (R_tl (x) A(tl_c) + R_br (x) A(br_c))   container corners
         + sum_j E_j (x) (R_tail (x) A(tail_j) + R_tip (x) A(tip_j))  connector ends"""
    xp = fpe.xp; S = xp.zeros(fpe.D, dtype=complex)
    for e in scene["elements"]:
        x, y, w, h = e["box"]; E = alg.el(e["id"])
        S = S + E * fpe.addr(x + w / 2, y + h / 2) + E * alg.role("kind") * alg.kind(e["kind"])
        if e.get("container") or corners == "all":
            S = S + E * (alg.role("tl") * fpe.addr(x, y) + alg.role("br") * fpe.addr(x + w, y + h))
    for c in scene["connectors"]:
        E = alg.el(c["id"])
        S = S + E * (alg.role("tail") * fpe.addr(*c["tail"]) + alg.role("tip") * fpe.addr(*c["tip"]))
    return S


def n_terms(scene, corners="containers"):
    nc = len(scene["elements"]) if corners == "all" else sum(1 for e in scene["elements"] if e.get("container"))
    return 2 * len(scene["elements"]) + 2 * nc + 2 * len(scene["connectors"])


# ---------------------------------------------------------------- the outline-aware nearest (a PROPOSAL, responses D19 / Q13; not the default anywhere)
def box_outline_distance(p, tl, br):
    """distance in px from the point p to the OUTLINE of the box with corners tl, br: outside, the distance to the box; inside, to the nearest edge"""
    dx = max(tl[0] - p[0], 0.0, p[0] - br[0]); dy = max(tl[1] - p[1], 0.0, p[1] - br[1])
    if dx > 0 or dy > 0: return math.hypot(dx, dy)
    return min(p[0] - tl[0], br[0] - p[0], p[1] - tl[1], br[1] - p[1])


def nearest_outline(tip, boxes):
    """tip: the decoded end (x, y); boxes: {id: (tl, br)} the decoded corner addresses of each candidate element (the scene must be encoded with
    corners="all"). The element whose box outline is nearest wins (the centre-based readout compares the decoded centres instead).
    -> (id, margin, distance, ranked): margin = second distance minus best distance in px (a tie is broken by id), ranked = [(distance, id)]"""
    r = sorted((box_outline_distance(tip, tl, br), k) for k, (tl, br) in boxes.items())
    return r[0][1], (r[1][0] - r[0][0] if len(r) > 1 else 0.0), r[0][0], r
