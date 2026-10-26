"""synth_strokes.py: synthetic hand-drawn strokes for every sketch symbol, as random diagrams with their gold structure (spec 17.5).

A scene is a random diagram of 3 to 15 elements on a jittered grid (rectangle, rounded rectangle, ellipse, diamond, cylinder, triangle),
connectors between neighbouring elements (line or arrow, straight or with an elbow), zero to two containers (rectangles drawn around a
block of grid cells), label marks (a small zigzag inside a shape), planted unknown blobs (star, cloud, spiral, wave), sometimes a
standalone zigzag (a text placeholder) and sometimes a scribble over an extra shape (scribble-to-delete). Each element is drawn as
strokes with hand-drawn noise: drawing order and direction, single or multi-stroke variants, overshoot at closure, gaps at corners,
low-frequency wobble, point jitter, varying speed and a 60 to 125 Hz pointer sampling, with timestamps.

The gold of a scene names, for every element, its kind, its box and the indices of its strokes; for every connector its kind, source,
target and strokes; for every mark its role (label / delete / text) and what it applies to; and the planted unknowns. That is the
structured form of the gold circuit (one create wire per element, one connect wire per connector, one group wire per container);
`--sop` also writes it as SOP Lang wires.

Two splits with different seeds: `tune` (for adjusting the recogniser's thresholds) and `test` (reported only, never tuned on).
A third split, `probe` (20 scenes, seed + 2000, never mixed into the two): scenes built to separate the scene readers, in two families:
(A) a large box with a connector end 3 to 8 px outside its outline and a small shape 14 to 22 px further out whose centre is nearer to the
end than the box's centre; (B) a large container with a small shape just inside its outline and one just outside it. Gold as above.
Run: python3 synth_strokes.py --out ../../../app/tests/data/sketch_synth.json [--n_tune 24] [--n_test 40] [--seed 17]
"""
import argparse, json, math, os, sys

import numpy as np

W, H = 1200, 800
SHAPES = ["rectangle", "rounded_rectangle", "ellipse", "diamond", "cylinder", "triangle"]
UNKNOWNS = ["star", "cloud", "spiral", "wave"]


# ------------------------------------------------------------------ ideal outlines (dense polylines, y down)
def arc(cx, cy, rx, ry, a0, a1, n=None):
    n = n or max(8, int(abs(a1 - a0) * max(rx, ry) / 2))
    t = np.linspace(a0, a1, n)
    return np.stack([cx + rx * np.cos(t), cy + ry * np.sin(t)], 1)


def seg(p, q, step=2.0):
    p, q = np.asarray(p, float), np.asarray(q, float)
    n = max(2, int(np.linalg.norm(q - p) / step) + 1)
    t = np.linspace(0, 1, n)[:, None]
    return p + (q - p) * t


def chain(points, step=2.0):
    out = [seg(points[i], points[i + 1], step) for i in range(len(points) - 1)]
    return np.concatenate([o if i == 0 else o[1:] for i, o in enumerate(out)])


def outline(kind, box, rho=0.25, cap=0.16):
    """the ideal closed outline of a shape in its box (for connector endpoints and for drawing)"""
    x, y, w, h = box
    if kind in ("rectangle",):
        return chain([(x, y), (x + w, y), (x + w, y + h), (x, y + h), (x, y)])
    if kind == "rounded_rectangle":
        r = rho * min(w, h); pts = []
        for cx, cy, a0 in [(x + w - r, y + r, -np.pi / 2), (x + w - r, y + h - r, 0), (x + r, y + h - r, np.pi / 2), (x + r, y + r, np.pi)]:
            pts.append(arc(cx, cy, r, r, a0, a0 + np.pi / 2))
        pts.append(pts[0][:1]); return np.concatenate(pts)
    if kind == "ellipse":
        return arc(x + w / 2, y + h / 2, w / 2, h / 2, 0, 2 * np.pi, 200)
    if kind == "diamond":
        return chain([(x + w / 2, y), (x + w, y + h / 2), (x + w / 2, y + h), (x, y + h / 2), (x + w / 2, y)])
    if kind == "triangle":
        return chain([(x + w / 2, y), (x + w, y + h), (x, y + h), (x + w / 2, y)])
    if kind == "triangle_down":
        return chain([(x, y), (x + w, y), (x + w / 2, y + h), (x, y)])
    if kind == "cylinder":
        ch = cap * h
        return np.concatenate([arc(x + w / 2, y + ch, w / 2, ch, np.pi, 2 * np.pi), seg((x + w, y + ch), (x + w, y + h - ch)),
                               arc(x + w / 2, y + h - ch, w / 2, ch, 0, np.pi), seg((x, y + h - ch), (x, y + ch))])
    raise ValueError(kind)


def boundary_point(kind, box, toward, **kw):
    """the point of the outline hit by the ray from the box centre toward `toward`"""
    x, y, w, h = box; c = np.array([x + w / 2, y + h / 2]); d = np.asarray(toward, float) - c
    d = d / (np.linalg.norm(d) + 1e-9); o = outline("triangle" if kind == "triangle" else kind, box, **kw)
    rel = o - c; along = rel @ d; perp = np.abs(rel @ np.array([-d[1], d[0]]))
    cand = np.where(along > 0)[0]
    i = cand[np.argmin(perp[cand] - 1e-3 * along[cand])]
    return o[i]


# ------------------------------------------------------------------ the hand: ideal strokes -> sampled noisy strokes
class Hand:
    def __init__(self, rng):
        self.rng = rng
        self.speed = rng.uniform(0.6, 1.6)          # px per ms, per scene (one drawer)
        self.hz = rng.choice([60, 90, 120])
        self.jit = rng.uniform(0.4, 1.1)
        self.wob = rng.uniform(0.004, 0.016)

    def draw(self, ideal, t0):
        """ideal: dense polyline (N, 2). Returns (points (M, 3) int [x, y, t], t_end)"""
        r = self.rng; P = np.asarray(ideal, float)
        d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]; L = d[-1]
        if L < 1: P = np.vstack([P[:1], P[:1] + 1]); d = np.array([0, 1.0]); L = 1.0
        # wobble: low-frequency normal offset
        tang = np.gradient(P, axis=0); tang /= (np.linalg.norm(tang, axis=1, keepdims=True) + 1e-9); nrm = np.stack([-tang[:, 1], tang[:, 0]], 1)
        size = max(30.0, np.ptp(P[:, 0]) + np.ptp(P[:, 1]))
        amp = self.wob * size + 0.4; f1, f2 = r.uniform(0.6, 2.2), r.uniform(2.5, 4.5); p1, p2 = r.uniform(0, 2 * np.pi, 2)
        off = amp * (np.sin(2 * np.pi * f1 * d / L + p1) + 0.4 * np.sin(2 * np.pi * f2 * d / L + p2))
        P = P + nrm * off[:, None]
        # speed: slower at corners and at both ends
        turn = np.zeros(len(P))
        if len(P) > 2:
            a = np.arctan2(np.diff(P[:, 1]), np.diff(P[:, 0])); da = np.abs((np.diff(a) + np.pi) % (2 * np.pi) - np.pi); turn[1:-1] = da
        k = np.convolve(turn, np.ones(9) / 9, mode="full")[4:4 + len(turn)]
        v = self.speed * r.uniform(0.8, 1.2) / (1 + 25 * k)
        ramp = np.minimum(1, 0.35 + np.minimum(d, L - d) / 30.0); v = np.maximum(0.05, v * ramp)
        tt = np.r_[0, np.cumsum(np.diff(d) / ((v[1:] + v[:-1]) / 2))]
        dt = 1000.0 / self.hz; ts = np.arange(0, tt[-1], dt); ts = ts + r.uniform(-1, 1, len(ts))
        ts = np.clip(np.sort(np.r_[ts, tt[-1]]), 0, tt[-1]); ts[0] = 0
        x = np.interp(ts, tt, P[:, 0]); y = np.interp(ts, tt, P[:, 1])
        if len(ts) < 3: ts = np.array([0, tt[-1] / 2, tt[-1]]); x = np.interp(ts, tt, P[:, 0]); y = np.interp(ts, tt, P[:, 1])
        x = x + r.normal(0, self.jit, len(x)); y = y + r.normal(0, self.jit, len(y))
        pts = np.stack([np.round(x), np.round(y), np.round(t0 + ts)], 1).astype(int)
        keep = [0] + [i for i in range(1, len(pts)) if pts[i, 2] > pts[i - 1, 2]]   # strictly increasing time
        pts = pts[keep]
        return pts, int(pts[-1, 2])


def rot(P, ang, c):
    ca, sa = math.cos(ang), math.sin(ang); Q = np.asarray(P, float) - c
    return np.stack([Q[:, 0] * ca - Q[:, 1] * sa, Q[:, 0] * sa + Q[:, 1] * ca], 1) + c


def roll_closed(O, r, overshoot):
    """a closed outline started at a random point, in a random direction, with an overshoot (px) past the start"""
    O = O[:-1] if np.allclose(O[0], O[-1]) else O
    O = np.roll(O, -int(r.integers(len(O))), axis=0)
    if r.random() < 0.5: O = O[::-1]
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(O, axis=0), axis=1))]
    extra = O[: max(1, int(np.searchsorted(d, overshoot)))]
    return np.concatenate([O, O[:1], extra])


def corner_gap(p, r, g):
    return np.asarray(p, float) + r.uniform(-g, g, 2)


def shape_strokes(kind, box, r):
    """ideal strokes (list of dense polylines) of a closed shape, with a drawing variant"""
    x, y, w, h = box; c = np.array([x + w / 2, y + h / 2]); ang = math.radians(r.uniform(-2.5, 2.5)); ov = r.uniform(0, 14)
    if kind == "rectangle":
        v = r.choice(["one", "one", "two", "four"])
        if v == "one": S = [roll_closed(outline("rectangle", box), r, ov)]
        else:
            cs = [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]
            if v == "two": S = [chain([corner_gap(cs[0], r, 5), cs[1], corner_gap(cs[2], r, 5)]), chain([corner_gap(cs[0], r, 5), cs[3], corner_gap(cs[2], r, 5)])]
            else: S = [seg(corner_gap(cs[i], r, 6), corner_gap(cs[(i + 1) % 4], r, 6)) for i in range(4)]
    elif kind == "rounded_rectangle":
        S = [roll_closed(outline("rounded_rectangle", box, rho=r.uniform(0.2, 0.34)), r, ov)]
    elif kind == "ellipse":
        a0 = r.uniform(0, 2 * np.pi); sgn = 1 if r.random() < 0.5 else -1; sweep = 2 * np.pi + r.uniform(0.05, 0.45)
        t = np.linspace(0, 1, 220); drift = 1 + r.uniform(-0.06, 0.06) * t
        ang_t = a0 + sgn * sweep * t
        S = [np.stack([c[0] + w / 2 * drift * np.cos(ang_t), c[1] + h / 2 * drift * np.sin(ang_t)], 1)]
    elif kind == "diamond":
        v = r.choice(["one", "one", "two", "four"]); vs = [(x + w / 2, y), (x + w, y + h / 2), (x + w / 2, y + h), (x, y + h / 2)]
        if v == "one": S = [roll_closed(outline("diamond", box), r, ov)]
        elif v == "two": S = [chain([corner_gap(vs[0], r, 5), vs[1], corner_gap(vs[2], r, 5)]), chain([corner_gap(vs[0], r, 5), vs[3], corner_gap(vs[2], r, 5)])]
        else: S = [seg(corner_gap(vs[i], r, 6), corner_gap(vs[(i + 1) % 4], r, 6)) for i in range(4)]
    elif kind in ("triangle", "triangle_down"):
        v = r.choice(["one", "one", "three"])
        vs = [(x + w / 2, y), (x + w, y + h), (x, y + h)] if kind == "triangle" else [(x, y), (x + w, y), (x + w / 2, y + h)]
        if v == "one": S = [roll_closed(outline(kind, box), r, ov)]
        else: S = [seg(corner_gap(vs[i], r, 6), corner_gap(vs[(i + 1) % 3], r, 6)) for i in range(3)]
    elif kind == "cylinder":
        ch = r.uniform(0.12, 0.2) * h
        top = roll_closed(arc(c[0], y + ch, w / 2, ch, 0, 2 * np.pi, 160), r, r.uniform(0, 10))
        U = np.concatenate([seg((x + r.uniform(-3, 3), y + ch), (x, y + h - ch)), arc(c[0], y + h - ch, w / 2, ch, np.pi, 0, 120),
                            seg((x + w, y + h - ch), (x + w + r.uniform(-3, 3), y + ch))])
        if r.random() < 0.5: U = U[::-1]
        S = [top, U] if r.random() < 0.7 else [U, top]
    else:
        raise ValueError(kind)
    return [rot(s, ang, c) for s in S]


def connector_strokes(path, arrow, r):
    """a connector along `path` (polyline points); arrow: a head at the last point"""
    P = chain(path)
    if not arrow: return [P]
    tip = P[-1]; back = P[-1] - P[max(0, len(P) - 6)]; back = back / (np.linalg.norm(back) + 1e-9)
    L = np.linalg.norm(np.diff(P, axis=0), axis=1).sum()
    b = min(r.uniform(10, 22), 0.35 * L); a = math.radians(r.uniform(22, 40))
    def barb(sgn):
        ca, sa = math.cos(math.pi + sgn * a), math.sin(math.pi + sgn * a)
        d = np.array([back[0] * ca - back[1] * sa, back[0] * sa + back[1] * ca]); return tip + d * b * r.uniform(0.85, 1.15)
    h1, h2 = barb(1), barb(-1)
    v = r.choice(["v", "v", "two", "one"])
    if v == "v": return [P, chain([h1, tip + r.uniform(-2, 2, 2), h2], 1.0)]
    if v == "two": return [P, seg(tip, h1, 1.0), seg(tip + r.uniform(-2, 2, 2), h2, 1.0)]
    return [np.concatenate([P, seg(tip, h1, 1.0)[1:], seg(h1, tip, 1.0)[1:], seg(tip, h2, 1.0)[1:]])]


def zigzag(box, r, n=None, slant=0.0):
    """a back-and-forth scribble filling `box` (label placeholder, text placeholder or a delete scribble)"""
    x, y, w, h = box; n = n or int(r.integers(4, 8)); pts = []
    for i in range(n + 1):
        yy = y + h * i / n + r.uniform(-1.5, 1.5)
        xx = x + (w if i % 2 else 0) + r.uniform(-0.06, 0.06) * w + slant * (i / n) * w
        pts.append((xx, yy))
    if r.random() < 0.5: pts = pts[::-1]
    return [chain(pts, 1.5)]


def unknown_strokes(kind, box, r):
    x, y, w, h = box; c = np.array([x + w / 2, y + h / 2]); R = min(w, h) / 2
    if kind == "star":
        pts = [c + (R if i % 2 == 0 else 0.42 * R) * np.array([math.sin(i * math.pi / 5), -math.cos(i * math.pi / 5)]) for i in range(11)]
        return [chain(pts)]
    if kind == "cloud":
        t = np.linspace(0, 2 * np.pi, 300); k = int(r.integers(6, 9)); rr = 1 + 0.18 * np.abs(np.sin(k * t / 2))
        return [np.stack([c[0] + w / 2 * 0.85 * rr * np.cos(t), c[1] + h / 2 * 0.85 * rr * np.sin(t)], 1)]
    if kind == "spiral":
        t = np.linspace(0, 2.6 * 2 * np.pi, 400); rr = R * (0.1 + 0.9 * t / t[-1])
        return [np.stack([c[0] + rr * np.cos(t), c[1] + rr * np.sin(t)], 1)]
    if kind == "wave":
        t = np.linspace(0, 1, 300); A = 0.3 * h; per = r.uniform(2.5, 4)
        return [np.stack([x + w * t, c[1] + A * np.sin(2 * np.pi * per * t)], 1)]
    raise ValueError(kind)


# ------------------------------------------------------------------ scenes
def make_scene(r, sid):
    cols, rows = int(r.integers(3, 6)), int(r.integers(2, 5)); cw, chh = W / cols, H / rows
    cells = [(i, j) for j in range(rows) for i in range(cols)]
    n_el = int(min(len(cells), r.integers(3, 16)))
    pick = [cells[k] for k in sorted(r.choice(len(cells), n_el, replace=False))]
    free = [c for c in cells if c not in pick]
    els = []
    for k, (i, j) in enumerate(pick):
        kind = SHAPES[int(r.integers(len(SHAPES)))]
        mw, mh = min(170, cw - 70), min(110, chh - 70)
        w = r.uniform(0.55, 1.0) * mw; h = r.uniform(0.5, 1.0) * mh
        if kind in ("ellipse", "diamond") and r.random() < 0.4: w = h = min(w, h) * r.uniform(1.0, 1.3)
        if kind == "cylinder": w, h = min(w, h * 1.1), max(h, 0.8 * w)
        if kind == "triangle": h = max(h, 0.6 * w)
        cx = (i + 0.5) * cw + r.uniform(-12, 12); cy = (j + 0.5) * chh + r.uniform(-12, 12)
        sub = "triangle_down" if kind == "triangle" and r.random() < 0.25 else kind
        els.append({"id": f"e{k + 1}", "kind": kind, "draw": sub, "box": [cx - w / 2, cy - h / 2, w, h], "cell": (i, j), "parent": None, "label_mark": False})
    # containers: blocks of cells whose elements are all inside, disjoint, at most two
    conts = []
    for _ in range(int(r.choice([0, 1, 1, 2]))):
        for _try in range(20):
            i0, j0 = int(r.integers(cols)), int(r.integers(rows)); bw, bh = int(r.integers(1, 3)), int(r.integers(1, 3))
            if i0 + bw > cols or j0 + bh > rows: continue
            block = {(i, j) for i in range(i0, i0 + bw) for j in range(j0, j0 + bh)}
            inside = [e for e in els if e["cell"] in block]
            if len(inside) < 1 or len(inside) == len(els) or any(block & c["block"] for c in conts): continue
            m = r.uniform(16, 30)
            x0 = min(e["box"][0] for e in inside) - m; y0 = min(e["box"][1] for e in inside) - m - r.uniform(14, 26)
            x1 = max(e["box"][0] + e["box"][2] for e in inside) + m; y1 = max(e["box"][1] + e["box"][3] for e in inside) + m
            cid = f"g{len(conts) + 1}"
            conts.append({"id": cid, "kind": "rectangle" if r.random() < 0.75 else "rounded_rectangle", "box": [x0, y0, x1 - x0, y1 - y0], "block": block})
            for e in inside: e["parent"] = cid
            break
    byid = {e["id"]: e for e in els}
    # connectors between grid neighbours (a spanning set plus a few extra)
    pairs = []
    order = list(range(len(els))); r.shuffle(order)
    for a in order:
        ea = els[a]; nb = [b for b in range(len(els)) if b != a and max(abs(els[b]["cell"][0] - ea["cell"][0]), abs(els[b]["cell"][1] - ea["cell"][1])) == 1]
        if nb and r.random() < 0.75:
            b = int(r.choice(nb))
            if (a, b) not in pairs and (b, a) not in pairs: pairs.append((a, b))
    conns = []
    for k, (a, b) in enumerate(pairs):
        ea, eb = els[a], els[b]; ca = np.array(ea["box"][:2]) + np.array(ea["box"][2:]) / 2; cb = np.array(eb["box"][:2]) + np.array(eb["box"][2:]) / 2
        arrow = r.random() < 0.7
        dx, dy = cb - ca; elbow = abs(dx) > 40 and abs(dy) > 40 and r.random() < 0.6
        def gapped(p, q, near):   # move p along (p - q) by a gap (negative = overshoot into the shape)
            u = (p - q) / (np.linalg.norm(p - q) + 1e-9); return p + u * r.uniform(-6, 10) * (1 if near else 1)
        if elbow:
            p0 = boundary_point(ea["draw"], ea["box"], (cb[0], ca[1])); p1 = boundary_point(eb["draw"], eb["box"], (cb[0], ca[1]))
            corner = np.array([cb[0] + r.uniform(-3, 3), ca[1] + r.uniform(-3, 3)])
            path = [gapped(p0, corner, True), corner, gapped(p1, corner, True)]
        else:
            p0 = boundary_point(ea["draw"], ea["box"], cb); p1 = boundary_point(eb["draw"], eb["box"], ca)
            path = [gapped(p0, p1, True), gapped(p1, p0, True)]
        dense = chain(path, 3.0); far = np.minimum(np.linalg.norm(dense - path[0], axis=1), np.linalg.norm(dense - path[-1], axis=1)) > 14
        crosses = any(((dense[far, 0] > e["box"][0] - 6) & (dense[far, 0] < e["box"][0] + e["box"][2] + 6) & (dense[far, 1] > e["box"][1] - 6)
                       & (dense[far, 1] < e["box"][1] + e["box"][3] + 6)).any() for e in els if e is not ea and e is not eb)
        if crosses: continue                      # a connector drawn through another element is not a diagram anyone draws
        conns.append({"id": f"k{len(conns) + 1}", "kind": "arrow" if arrow else "line", "source": ea["id"], "target": eb["id"], "path": path})
    # marks, unknowns, deletions, texts
    for e in els:
        e["label_mark"] = bool(r.random() < 0.3)
    for c in conts: c["label_mark"] = bool(r.random() < 0.5)
    unknowns, texts, deletes = [], [], []
    r.shuffle(free)
    if free and r.random() < 0.5:
        i, j = free.pop(); kk = UNKNOWNS[int(r.integers(len(UNKNOWNS)))]; s = min(cw, chh) * 0.45
        unknowns.append({"id": "u1", "kind": kk, "box": [(i + 0.5) * cw - s / 2 * (1.6 if kk == "wave" else 1), (j + 0.5) * chh - s / 2, s * (1.6 if kk == "wave" else 1), s]})
    if free and r.random() < 0.15:
        i, j = free.pop(); tw, th = r.uniform(60, 110), r.uniform(14, 26)
        texts.append({"id": "t1", "box": [(i + 0.5) * cw - tw / 2, (j + 0.5) * chh - th / 2, tw, th]})
    if free and r.random() < 0.3:
        i, j = free.pop(); kind = SHAPES[int(r.integers(len(SHAPES)))]; w, h = r.uniform(80, 140), r.uniform(50, 90)
        if kind == "cylinder": w, h = min(w, h * 1.1), max(h, 0.8 * w)
        cx, cy = (i + 0.5) * cw, (j + 0.5) * chh
        deletes.append({"id": "d1", "kind": kind, "draw": kind, "box": [cx - w / 2, cy - h / 2, w, h]})
    # drawing: each item -> ideal strokes; order: shapes (random order), containers, then connectors mostly after their ends
    hand = Hand(r); items = []
    for e in els: items.append(("el", e))
    for c in conts: items.append(("cont", c))
    r.shuffle(items)
    late = []
    for k in conns: (late if r.random() < 0.8 else items).append(("conn", k))
    r.shuffle(late); items += late
    for e in els + conts:
        if e["label_mark"]: items.append(("label", e))
    for u in unknowns: items.insert(int(r.integers(len(items) + 1)), ("unknown", u))
    for t in texts: items.append(("text", t))
    for d in deletes: items.insert(int(r.integers(len(items) + 1)), ("el", d)); items.append(("delete", d))
    strokes, t, gold_strokes = [], 0, {}
    for typ, it in items:
        if typ in ("el", "cont"): S = shape_strokes(it.get("draw", it["kind"]), it["box"], r)
        elif typ == "conn": S = connector_strokes(it["path"], it["kind"] == "arrow", r)
        elif typ == "label":
            x, y, w, h = it["box"]
            if typ == "label" and it in conts:
                ky = [e for e in els if e["parent"] == it["id"]]; top = min(e["box"][1] for e in ky)
                lw, lh = min(80, 0.4 * w), max(8, min(14, top - y - 20)); bx = [x + 12, y + 8, lw, lh]
            else:
                lw, lh = r.uniform(0.3, 0.55) * w, min(r.uniform(0.15, 0.3) * h, 18); bx = [x + w / 2 - lw / 2, y + h / 2 - lh / 2, lw, lh]
            S = zigzag(bx, r, int(r.integers(3, 6)))
        elif typ == "text": S = zigzag(it["box"], r, int(r.integers(3, 6)))
        elif typ == "unknown": S = unknown_strokes(it["kind"], it["box"], r)
        elif typ == "delete":
            x, y, w, h = it["box"]; m = r.uniform(-0.05, 0.12); bx = [x - m * w, y - m * h, w * (1 + 2 * m), h * (1 + 2 * m)]
            S = zigzag(bx, r, int(r.integers(6, 10)), slant=r.uniform(-0.1, 0.1))
        idx = []
        t += int(r.uniform(250, 1400)) if strokes else 0
        for s in S:
            pts, t = hand.draw(s, t); idx.append(len(strokes)); strokes.append(pts); t += int(r.uniform(80, 350))
        gold_strokes.setdefault((typ, it["id"]), []).extend(idx)
    rnd = lambda b: [int(round(v)) for v in b]
    gold = {"elements": [], "connectors": [], "marks": [], "unknowns": []}
    for e in els:
        gold["elements"].append({"id": e["id"], "kind": e["kind"], "box": rnd(e["box"]), "strokes": gold_strokes[("el", e["id"])], "parent": e["parent"], "container": False})
    for c in conts:
        gold["elements"].append({"id": c["id"], "kind": c["kind"], "box": rnd(c["box"]), "strokes": gold_strokes[("cont", c["id"])], "parent": None, "container": True})
    for d in deletes:
        gold["elements"].append({"id": d["id"], "kind": d["kind"], "box": rnd(d["box"]), "strokes": gold_strokes[("el", d["id"])], "parent": None, "container": False, "deleted": True})
        gold["marks"].append({"role": "delete", "of": d["id"], "strokes": gold_strokes[("delete", d["id"])]})
    for k in conns:
        gold["connectors"].append({"id": k["id"], "kind": k["kind"], "source": k["source"], "target": k["target"], "strokes": gold_strokes[("conn", k["id"])]})
    for e in els + conts:
        if e["label_mark"]: gold["marks"].append({"role": "label", "of": e["id"], "strokes": gold_strokes[("label", e["id"])]})
    for tt in texts: gold["marks"].append({"role": "text", "of": None, "box": rnd(tt["box"]), "strokes": gold_strokes[("text", tt["id"])]})
    for u in unknowns: gold["unknowns"].append({"id": u["id"], "kind": u["kind"], "strokes": gold_strokes[("unknown", u["id"])]})
    enc = [{"p": delta(s)} for s in strokes]
    return {"id": sid, "width": W, "height": H, "strokes": enc, "gold": gold}


# ------------------------------------------------------------------ the probe split (responses D19, Q13): scenes built to separate the readers
PROBE_SMALL = ["ellipse", "diamond", "rectangle", "rounded_rectangle", "cylinder"]
PROBE_LARGE = ["rectangle", "rounded_rectangle"]


def _probe_draw(r, parts, conns):
    """parts: [(id, kind, box)] drawn in random order; conns: [(id, kind, path)] drawn after the shapes -> (encoded strokes, {id: stroke indices})"""
    hand = Hand(r); items = [("el", p) for p in parts]; r.shuffle(items)
    late = [("conn", c) for c in conns]; r.shuffle(late); items += late
    strokes, t, idx_of = [], 0, {}
    for typ, it in items:
        S = shape_strokes(it[1], it[2], r) if typ == "el" else connector_strokes(it[2], it[1] == "arrow", r)
        idx = []; t += int(r.uniform(250, 1400)) if strokes else 0
        for s in S:
            pts, t = hand.draw(s, t); idx.append(len(strokes)); strokes.append(pts); t += int(r.uniform(80, 350))
        idx_of[it[0]] = idx
    return [{"p": delta(s)} for s in strokes], idx_of


def _fits(boxes, margin=12):
    return all(b[0] >= margin and b[1] >= margin and b[0] + b[2] <= W - margin and b[1] + b[3] <= H - margin for b in boxes)


def probe_outline_scene(r, sid, side, big_is_target):
    """family A: a large box; a connector end lands 3 to 8 px outside its outline, a small shape is 14 to 22 px further along the same
    normal and a little to one side (so its CENTRE is nearer to the end than the large box's centre, its outline is farther); the other end
    is on a small source shape 230 to 340 px away (the span keeps the attach tolerance, 12% of it, above the small shape's distance). Gold: the end belongs to the large box."""
    nrm = [np.array(v, float) for v in ((1, 0), (0, 1), (-1, 0), (0, -1))][side]; tan = np.array([-nrm[1], nrm[0]])
    for _ in range(200):
        kind = PROBE_LARGE[int(r.integers(len(PROBE_LARGE)))]; bw, bh = r.uniform(260, 380), r.uniform(180, 260)
        cen = np.array([600.0, 400.0]) - nrm * r.uniform(120, 200) + tan * r.uniform(-50, 50); box = [cen[0] - bw / 2, cen[1] - bh / 2, bw, bh]
        he, ht = (bw / 2, bh / 2) if side % 2 == 0 else (bh / 2, bw / 2)
        tip = cen + nrm * (he + r.uniform(3, 8)) + tan * r.uniform(-0.55, 0.55) * ht
        dk = PROBE_SMALL[int(r.integers(len(PROBE_SMALL)))]; dw, dh = r.uniform(50, 80), r.uniform(36, 56)
        dhn, dht = (dw / 2, dh / 2) if side % 2 == 0 else (dh / 2, dw / 2)
        sgn = 1 if r.random() < 0.5 else -1
        dc = tip + nrm * (r.uniform(14, 22) + dhn) + tan * sgn * (dht + r.uniform(8, 12))
        sk = PROBE_SMALL[int(r.integers(len(PROBE_SMALL)))]; sw, sh = r.uniform(50, 80), r.uniform(36, 56)
        shn = sw / 2 if side % 2 == 0 else sh / 2
        sc = tip + nrm * (r.uniform(280, 340) if side % 2 == 0 else r.uniform(230, 300) + shn)
        dbox = [dc[0] - dw / 2, dc[1] - dh / 2, dw, dh]; sbox = [sc[0] - sw / 2, sc[1] - sh / 2, sw, sh]
        if _fits([box, dbox, sbox]): break
    else: raise RuntimeError("probe A does not fit")
    ps = boundary_point(sk, sbox, tip) + nrm * r.uniform(-4, 6)          # the source end, on the small shape's outline (+- a few px)
    path = [ps, tip] if big_is_target else [tip, ps]
    parts = [("e1", kind, box), ("e2", dk, dbox), ("e3", sk, sbox)]
    strokes, idx = _probe_draw(r, parts, [("k1", "arrow", path)])
    rnd = lambda b: [int(round(v)) for v in b]
    els = [{"id": i, "kind": k, "box": rnd(b), "strokes": idx[i], "parent": None, "container": False} for i, k, b in parts]
    gold = {"elements": els, "connectors": [{"id": "k1", "kind": "arrow", "source": "e3" if big_is_target else "e1", "target": "e1" if big_is_target else "e3", "strokes": idx["k1"]}], "marks": [], "unknowns": []}
    return {"id": sid, "family": "outline-end", "width": W, "height": H, "strokes": strokes, "gold": gold}


def probe_container_scene(r, sid):
    """family B: a large container with a small shape 10 to 16 px inside its left outline, a large inner shape, and a small shape 10 to 16 px
    OUTSIDE its right outline (not a member); arrows from the outside shape to the inner one and from the near-outline one to the inner one."""
    for _ in range(200):
        ck = PROBE_LARGE[int(r.integers(len(PROBE_LARGE)))]; cw, chh = r.uniform(420, 520), r.uniform(280, 360)
        cx0, cy0 = r.uniform(40, 330), r.uniform(60, 220); cbox = [cx0, cy0, cw, chh]
        ak = PROBE_SMALL[int(r.integers(len(PROBE_SMALL)))]; aw, ah = r.uniform(50, 76), r.uniform(36, 52)
        abox = [cx0 + r.uniform(10, 16), cy0 + chh * r.uniform(0.35, 0.55), aw, ah]
        bk = PROBE_SMALL[int(r.integers(len(PROBE_SMALL)))]; bw, bh = r.uniform(100, 140), r.uniform(60, 90)
        bbox = [cx0 + cw * 0.55, cy0 + chh * r.uniform(0.25, 0.45), bw, bh]
        ok_ = PROBE_SMALL[int(r.integers(len(PROBE_SMALL)))]; ow, oh = r.uniform(50, 76), r.uniform(36, 52)
        obox = [cx0 + cw + r.uniform(10, 16), cy0 + chh * r.uniform(0.3, 0.6), ow, oh]
        if _fits([cbox, abox, bbox, obox]) and abox[0] + aw < bbox[0] - 40 and bbox[0] + bw < cx0 + cw - 20: break
    else: raise RuntimeError("probe B does not fit")
    def end(kind, box, toward, out): return boundary_point(kind, box, toward) + out * r.uniform(-4, 6)
    cen = lambda b: np.array(b[:2]) + np.array(b[2:]) / 2
    bc, oc, ac = cen(bbox), cen(obox), cen(abox)
    u1 = (oc - bc) / np.linalg.norm(oc - bc); u2 = (ac - bc) / np.linalg.norm(ac - bc)
    p1 = [end(ok_, obox, bc, -u1), end(bk, bbox, oc, u1)]; p2 = [end(ak, abox, bc, -u2), end(bk, bbox, ac, u2)]
    parts = [("g1", ck, cbox), ("e1", ak, abox), ("e2", bk, bbox), ("e3", ok_, obox)]
    strokes, idx = _probe_draw(r, parts, [("k1", "arrow", p1), ("k2", "arrow", p2)])
    rnd = lambda b: [int(round(v)) for v in b]
    els = [{"id": "e1", "kind": ak, "box": rnd(abox), "strokes": idx["e1"], "parent": "g1", "container": False},
           {"id": "e2", "kind": bk, "box": rnd(bbox), "strokes": idx["e2"], "parent": "g1", "container": False},
           {"id": "e3", "kind": ok_, "box": rnd(obox), "strokes": idx["e3"], "parent": None, "container": False},
           {"id": "g1", "kind": ck, "box": rnd(cbox), "strokes": idx["g1"], "parent": None, "container": True}]
    cons = [{"id": "k1", "kind": "arrow", "source": "e3", "target": "e2", "strokes": idx["k1"]}, {"id": "k2", "kind": "arrow", "source": "e1", "target": "e2", "strokes": idx["k2"]}]
    return {"id": sid, "family": "container-near-outline", "width": W, "height": H, "strokes": strokes, "gold": {"elements": els, "connectors": cons, "marks": [], "unknowns": []}}


def probe_split(seed, n=20):
    """n probe scenes, deterministic for the seed: even index = family A (sides cycle; the arrow ends on the large box for i < 8 and 16+,
    starts there for 8 to 15), odd = family B"""
    r = np.random.default_rng(seed); out = []
    for i in range(n):
        sid = f"probe-{i:03d}"
        out.append(probe_outline_scene(r, sid, (i // 2) % 4, (i // 8) % 2 == 0) if i % 2 == 0 else probe_container_scene(r, sid))
    return out


def delta(pts):
    """[x0, y0, t0, dx1, dy1, dt1, ...]: the first point absolute, the next ones as differences (small integers, a smaller file)"""
    d = np.vstack([pts[:1], np.diff(pts, axis=0)]); return [int(v) for v in d.reshape(-1)]


def gold_circuit(scene):
    """the gold circuit as SOP Lang wires (create per element, connect per connector, group per container)"""
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "tool"))
    from sop import soplang
    WORD = {"rectangle": "box", "rounded_rectangle": "start", "ellipse": "ellipse", "diamond": "decision", "cylinder": "database", "triangle": "triangle"}
    g = scene["gold"]; ws = []; n = [0]
    def nid(): n[0] += 1; return f"w{n[0]}"
    ent = {}
    for e in g["elements"]:
        if e.get("deleted"): continue
        cw = soplang.Wire(nid(), "create"); en = soplang.Wire(nid(), "entity")
        en.set("head", "container" if e["container"] else WORD[e["kind"]]); en.set("det", "a")
        cw.set("_sentence", str(len(ws) // 2)); cw.set("object", ("ref", en.id)); cw.set("_box", " ".join(str(v) for v in e["box"]))
        ws += [cw, en]; ent[e["id"]] = en.id
    for k in g["connectors"]:
        w = soplang.Wire(nid(), "connect"); w.set("source", ("ref", ent[k["source"]])); w.set("target", ("ref", ent[k["target"]]))
        ob = soplang.Wire(nid(), "entity"); ob.set("head", k["kind"]); ob.set("det", "a"); w.set("object", ("ref", ob.id)); ws += [w, ob]
    for c in [e for e in g["elements"] if e["container"]]:
        mem = [ent[e["id"]] for e in g["elements"] if e["parent"] == c["id"]]
        w = soplang.Wire(nid(), "group"); w.set("object", ("&", [("ref", m) for m in mem])); w.set("_container", ("ref", ent[c["id"]])); ws.append(w)
    doc = soplang.Doc(directives=[("world", "scene", None), ("generated", f"training/worlds/scene/synth_strokes.py {scene['id']}", None)], wires=ws)
    text = soplang.write(doc); soplang.parse(text)
    return text


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "app", "tests", "data", "sketch_synth.json"))
    ap.add_argument("--n_tune", type=int, default=24); ap.add_argument("--n_test", type=int, default=40); ap.add_argument("--seed", type=int, default=17)
    ap.add_argument("--n_probe", type=int, default=20, help="scenes of the `probe` split (seed + 2000); 0 omits it")
    ap.add_argument("--sop", default=None, help="also write the gold circuit of every test scene as SOP Lang, one file per scene, into this folder")
    a = ap.parse_args()
    out = {"generator": "training/worlds/scene/synth_strokes.py", "seed": a.seed, "format": "strokes[i].p = [x0, y0, t0_ms, dx1, dy1, dt1, ...] (first point absolute, then differences); box = [x, y, w, h]",
           "splits": {}}
    for name, n, s in [("tune", a.n_tune, a.seed), ("test", a.n_test, a.seed + 1000)]:
        r = np.random.default_rng(s); out["splits"][name] = [make_scene(r, f"{name}-{i:03d}") for i in range(n)]
    if a.n_probe: out["splits"]["probe"] = probe_split(a.seed + 2000, a.n_probe)       # its own rng: tune and test are byte-identical with or without it
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    txt = json.dumps(out, separators=(",", ":"))
    open(a.out, "w").write(txt)
    cnt = lambda sp, f: sum(len(sc["gold"][f]) for sc in out["splits"][sp])
    print(f"synth_strokes: {a.out} {len(txt) / 1e6:.2f} MB; tune {a.n_tune} scenes, test {a.n_test} scenes; test: "
          f"{cnt('test', 'elements')} elements, {cnt('test', 'connectors')} connectors, {cnt('test', 'marks')} marks, {cnt('test', 'unknowns')} unknowns")
    if a.sop:
        os.makedirs(a.sop, exist_ok=True)
        for sc in out["splits"]["test"]: open(os.path.join(a.sop, sc["id"] + ".sop"), "w").write(gold_circuit(sc))
        print(f"synth_strokes: gold circuits -> {a.sop}")


if __name__ == "__main__":
    main()
