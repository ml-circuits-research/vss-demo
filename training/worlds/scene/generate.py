"""generate.py: the scene world of the positions-as-addresses experiment (spec 17.3): shapes at positions, with every relation known.

A scene is a canvas (1200 x 800 px) with n elements (kinds of the diagram: rectangle, rounded_rectangle, ellipse, diamond, cylinder,
triangle) at random non-overlapping positions, zero to two containers enclosing some of them, and connectors whose tip ends near a
target element's outline. The generator knows every relation, and writes the queries with their gold answers:
  left_of(a, b)   centre of a has a smaller x than centre of b       (pairs whose centres differ by less than ALIGN px are "aligned", not asked)
  above(a, b)     centre of a has a smaller y than centre of b       (same rule)
  inside(a, c)    centre of a lies inside the box of container c     (asked for every element and every container: true and false cases)
  nearest(j)      the element whose centre is nearest the tip of connector j (asked when the nearest is clear by NEAR_GAP px)
Splits: dev (the length scale and the abstention threshold are chosen on it) and heldout (reported). Sweeps:
  capacity      the same queries with n elements in {4, 8, 16, 32, 64, 128} (connectors n / 2, two containers)
  separability  two elements a, b at a horizontal distance d (left_of and the decoding of both), among n_background others
Scenes are written as SOP Lang wires (`--out` folder: one file per split), parsed back by tool/sop/soplang as a check:
  @s scene / elements=$e1 & ... ; @e1 element kind=... x= y= w= h= [container=yes] ; @k1 connector tail_x= ... ;
  @q1 left_of a=$e1 b=$e2 answer=yes   (and above / inside / nearest)
Run: python3 generate.py --out ../../../logs/scene_world [--n_dev 50] [--n_heldout 200] [--seed 0]
"""
import argparse, os, sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tool"))

W, H = 1200, 800
KINDS = ["rectangle", "rounded_rectangle", "ellipse", "diamond", "cylinder", "triangle"]
ALIGN = 10          # px: centres closer than this on an axis are aligned; left_of / above are not asked for them
NEAR_GAP = 8        # px: nearest(j) is asked when the nearest centre beats the second by at least this much


def _free(box, boxes, gap):
    x, y, w, h = box
    return all(x + w + gap <= b[0] or b[0] + b[2] + gap <= x or y + h + gap <= b[1] or b[1] + b[3] + gap <= y for b in boxes)


def make_scene(r, n, sid, n_containers=None, size=(40, 140), n_conn=None, tries=4000):
    """n elements at non-overlapping positions; containers drawn around a few neighbours; connectors to targets"""
    els, boxes = [], []
    lo, hi = size
    for k in range(n):
        for _ in range(tries):
            w = float(r.uniform(lo, hi)); h = float(r.uniform(lo * 0.6, hi * 0.7))
            x = float(r.uniform(10, W - w - 10)); y = float(r.uniform(10, H - h - 10))
            if _free((x, y, w, h), boxes, 12): break
        else:
            break                                             # the canvas is full: fewer elements (reported by the caller)
        boxes.append((x, y, w, h)); els.append({"id": f"e{k + 1}", "kind": KINDS[int(r.integers(len(KINDS)))], "box": [x, y, w, h]})
    conts = []
    nc = int(r.choice([0, 1, 2])) if n_containers is None else n_containers
    for c in range(nc):
        if not els: break
        seed_el = els[int(r.integers(len(els)))]; sx, sy, sw, sh = seed_el["box"]
        cx0, cy0 = sx - r.uniform(15, 40), sy - r.uniform(15, 40)
        cx1, cy1 = sx + sw + r.uniform(60, 260), sy + sh + r.uniform(60, 200)
        cx0, cy0, cx1, cy1 = max(0, cx0), max(0, cy0), min(W, cx1), min(H, cy1)
        conts.append({"id": f"g{c + 1}", "kind": "container", "container": True, "box": [cx0, cy0, cx1 - cx0, cy1 - cy0]})
    conns = []
    m = (n // 2 if n_conn is None else n_conn)
    for j in range(m):
        if len(els) < 2: break
        t = els[int(r.integers(len(els)))]; x, y, w, h = t["box"]; cx, cy = x + w / 2, y + h / 2
        a = r.uniform(0, 2 * np.pi); rr = 0.5 * min(w, h) + r.uniform(-4, 12)
        tip = [float(np.clip(cx + rr * np.cos(a), 0, W)), float(np.clip(cy + rr * np.sin(a), 0, H))]
        L = r.uniform(80, 300); tail = [float(np.clip(tip[0] + L * np.cos(a), 0, W)), float(np.clip(tip[1] + L * np.sin(a), 0, H))]
        conns.append({"id": f"k{j + 1}", "tail": tail, "tip": tip, "intended": t["id"]})
    return {"id": sid, "elements": els + conts, "connectors": conns, "n_requested": n}


def centre(e):
    x, y, w, h = e["box"]; return x + w / 2, y + h / 2


def queries(scene, r, max_pairs=60):
    """the relation queries of a scene with their gold answers (balanced yes / no by asking both orders)"""
    els = [e for e in scene["elements"] if not e.get("container")]; conts = [e for e in scene["elements"] if e.get("container")]
    out = []
    pairs = [(a, b) for i, a in enumerate(els) for b in els[i + 1:]]
    if len(pairs) > max_pairs: pairs = [pairs[i] for i in r.choice(len(pairs), max_pairs, replace=False)]
    for a, b in pairs:
        (ax, ay), (bx, by) = centre(a), centre(b)
        if r.random() < 0.5: a, b, ax, ay, bx, by = b, a, bx, by, ax, ay
        if abs(ax - bx) >= ALIGN: out.append({"rel": "left_of", "a": a["id"], "b": b["id"], "answer": ax < bx, "gap": abs(ax - bx)})
        if abs(ay - by) >= ALIGN: out.append({"rel": "above", "a": a["id"], "b": b["id"], "answer": ay < by, "gap": abs(ay - by)})
    for c in conts:
        x, y, w, h = c["box"]
        for a in els:
            ax, ay = centre(a)
            d = min(abs(ax - x), abs(ax - x - w), abs(ay - y), abs(ay - y - h))
            if d < ALIGN: continue                            # a centre on the container's border is not asked
            out.append({"rel": "inside", "a": a["id"], "c": c["id"], "answer": bool(x < ax < x + w and y < ay < y + h), "gap": d})
    for k in scene["connectors"]:
        ds = sorted((float(np.hypot(centre(e)[0] - k["tip"][0], centre(e)[1] - k["tip"][1])), e["id"]) for e in els)
        if len(ds) >= 2 and ds[1][0] - ds[0][0] >= NEAR_GAP:
            out.append({"rel": "nearest", "j": k["id"], "answer": ds[0][1], "n_candidates": len(ds), "gap": ds[1][0] - ds[0][0]})
    return out


def separability_scene(r, d, n_background, sid):
    """two elements a, b with centres d px apart horizontally (same y), among n_background others placed away from them"""
    s = make_scene(r, n_background, sid, n_containers=0, n_conn=0)
    y = float(r.uniform(100, H - 100)); x = float(r.uniform(100, W - 100 - d))
    keep = [e for e in s["elements"] if abs(centre(e)[1] - y) > 80 or not (x - 100 < centre(e)[0] < x + d + 100)]
    a = {"id": "ea", "kind": "rectangle", "box": [x - 30, y - 20, 60, 40]}; b = {"id": "eb", "kind": "rectangle", "box": [x + d - 30, y - 20, 60, 40]}
    s["elements"] = keep + [a, b]
    if r.random() < 0.5: q = {"rel": "left_of", "a": "ea", "b": "eb", "answer": True, "gap": d}
    else: q = {"rel": "left_of", "a": "eb", "b": "ea", "answer": False, "gap": d}
    return s, q


# ------------------------------------------------------------------ SOP Lang
def to_sop(scenes_with_queries, split):
    from sop import soplang
    ws = []
    for s, qs in scenes_with_queries:
        p = s["id"]; top = soplang.Wire(f"{p}", "scene"); top.set("_world", "scene"); top.set("_split", split)
        top.set("elements", ("&", [("ref", f"{p}-{e['id']}") for e in s["elements"]])); ws.append(top)
        for e in s["elements"]:
            w = soplang.Wire(f"{p}-{e['id']}", "element"); w.set("kind", e["kind"])
            for k, v in zip("xywh", e["box"]): w.set(k, f"{v:.1f}")
            if e.get("container"): w.set("container", "yes")
            ws.append(w)
        for k in s["connectors"]:
            w = soplang.Wire(f"{p}-{k['id']}", "connector")
            w.set("tail_x", f"{k['tail'][0]:.1f}"); w.set("tail_y", f"{k['tail'][1]:.1f}"); w.set("tip_x", f"{k['tip'][0]:.1f}"); w.set("tip_y", f"{k['tip'][1]:.1f}")
            ws.append(w)
        for i, q in enumerate(qs):
            w = soplang.Wire(f"{p}-q{i + 1}", q["rel"])
            if q["rel"] in ("left_of", "above"): w.set("a", ("ref", f"{p}-{q['a']}")); w.set("b", ("ref", f"{p}-{q['b']}")); w.set("answer", "yes" if q["answer"] else "no")
            elif q["rel"] == "inside": w.set("a", ("ref", f"{p}-{q['a']}")); w.set("container", ("ref", f"{p}-{q['c']}")); w.set("answer", "yes" if q["answer"] else "no")
            else: w.set("connector", ("ref", f"{p}-{q['j']}")); w.set("answer", ("ref", f"{p}-{q['answer']}"))
            ws.append(w)
    doc = soplang.Doc(directives=[("world", "scene", None), ("generated", f"training/worlds/scene/generate.py split {split}", None)], wires=ws)
    text = soplang.write(doc); soplang.parse(text)            # round trip: the output is valid SOP Lang
    return text


def split_scenes(seed, split, n, n_range=(3, 15)):
    """the dev / heldout scenes: the demo's scene sizes (3 to 15 elements, spec 17.5); different seeds per split"""
    r = np.random.default_rng([seed, {"dev": 1, "heldout": 2}[split]])
    out = []
    for i in range(n):
        s = make_scene(r, int(r.integers(n_range[0], n_range[1] + 1)), f"{split}-{i:04d}")
        out.append((s, queries(s, r)))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True); ap.add_argument("--n_dev", type=int, default=50); ap.add_argument("--n_heldout", type=int, default=200)
    ap.add_argument("--seed", type=int, default=0)
    a = ap.parse_args(); os.makedirs(a.out, exist_ok=True)
    for split, n in [("dev", a.n_dev), ("heldout", a.n_heldout)]:
        sq = split_scenes(a.seed, split, n)
        open(os.path.join(a.out, f"{split}.sop"), "w").write(to_sop(sq, split))
        nq = {}
        for _, qs in sq:
            for q in qs: nq[q["rel"]] = nq.get(q["rel"], 0) + 1
        print(f"generate: {split}: {n} scenes, queries {nq} -> {os.path.join(a.out, split + '.sop')}")


if __name__ == "__main__":
    main()
