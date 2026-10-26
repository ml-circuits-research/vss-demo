"""golden file for app/tests/fpe_parity.mjs: the scene readout of training/worlds/scene/fpe.py + experiment_fpe.py on fixed synthetic scenes.

fpe.py (the reference, unchanged) draws its position phases and its identities from the NumPy generator, which a browser cannot reproduce.
The app uses the portable star_version 2 stars (tool/sop/world.py star_v2, parity-tested by make_stars_golden.py) and phases drawn from
portable uniforms (see the header of app/src/sketch/fpe.js). This script injects EXACTLY those phases and stars into fpe.py's own classes
(FPE.theta replaced, Algebra.v overridden in a subclass here), then runs experiment_fpe.Reader unchanged. The golden therefore holds what
the reference algorithm decides on the portable randomness: states, decoded positions, and every relation's decision with its margin.
Also reported (not a test): the accuracy of this portable variant on the dev split of generate.py, to show it behaves like the logged run.

Usage: python3 training/parity/make_fpe_golden.py [--out training/parity/out/golden-fpe.json] [--accuracy]
"""
import argparse, hashlib, json, math, os, sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..", "..")
sys.path.insert(0, os.path.join(ROOT, "tool")); sys.path.insert(0, os.path.join(ROOT, "training", "worlds", "scene"))
from sop.world import star_v2, _xoshiro128ss_phases  # noqa: E402
import generate as G  # noqa: E402
import experiment_fpe as X  # noqa: E402
from fpe import FPE, Algebra, encode_scene  # noqa: E402


def uniforms(seed_name, name, D):
    h = hashlib.sha256(f"{seed_name}:{name}".encode("utf-8")).digest()
    return (_xoshiro128ss_phases(h[:16], D) + np.pi) / (2 * np.pi)


class PortableAlgebra(Algebra):
    def v(self, name):
        if name not in self.cache: self.cache[name] = star_v2(f"scene-fpe-{self.seed}", name, self.D)
        return self.cache[name]


def portable_fpe(D, seed, L, kernel):
    f = FPE(D, seed, L, kernel)
    th = []
    for ax in (0, 1):
        base = f"scene-fpe-{seed}"; nm = lambda s: f"fpe:theta:{kernel}:{ax}:{s}"
        u1 = uniforms(base, nm("a"), D)
        if kernel == "gaussian": th.append(np.sqrt(-2 * np.log(u1)) * np.cos(2 * np.pi * uniforms(base, nm("b"), D)) / f.L)
        else: th.append((2 * u1 - 1) * math.pi / f.L)
    f.theta = np.array(th)
    return f


def case(name, D, seed, L, kernel, scenes, W=1200, H=800):
    G.W, G.H = W, H                                   # the reader reads the canvas size from generate.py's module constants
    alg = PortableAlgebra(D, seed); f = portable_fpe(D, seed, L, kernel); reader = X.Reader(f, alg)
    out = {"name": name, "D": D, "seed": seed, "L": L, "kernel": kernel, "W": W, "H": H, "scenes": []}
    for s, qs in scenes:
        reader.scene(s)
        res = []
        for q in qs:
            pred, margin, score = reader.answer(q)
            res.append({"q": q, "pred": (bool(pred) if isinstance(pred, (bool, np.bool_)) else pred), "margin": float(margin), "score": float(score)})
        S = reader.S
        out["scenes"].append({"scene": s, "state_re": np.round(S.real, 9).tolist(), "state_im": np.round(S.imag, 9).tolist(),
                              "pos": {f"{k[0]}|{k[1] or ''}": [float(v[0]), float(v[1])] for k, v in reader.cache.items()}, "results": res})
    G.W, G.H = 1200, 800
    return out


def accuracy(D, seed, L, kernel, n=60):
    alg = PortableAlgebra(D, seed); f = portable_fpe(D, seed, L, kernel); reader = X.Reader(f, alg)
    rows = X.run_set(reader, G.split_scenes(seed, "dev", n))
    return {r: round(X.acc(rows[r]), 3) for r in X.RELS}


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default=os.path.join(HERE, "out", "golden-fpe.json")); ap.add_argument("--accuracy", action="store_true")
    ap.add_argument("--L", type=float, nargs="+", default=[48])
    a = ap.parse_args()
    if a.accuracy:
        for D in (1024, 4096):
            for k, Ls in (("gaussian", [24, 32, 48, 96]), ("sinc", [48, 96])):
                for L in Ls: print(f"portable phases, D {D} seed 0 {k} L {L}: dev accuracy (60 scenes) {accuracy(D, 0, L, k, 60 if D == 1024 else 25)}", flush=True)
        return
    dev = G.split_scenes(0, "dev", 8)                                                          # 3 to 15 elements, 0 to 2 containers
    r = np.random.default_rng([0, 99]); scenes = [(s, G.queries(s, r, max_pairs=25)) for s, _ in dev]
    big = G.make_scene(r, 16, "n16", n_containers=2); r2 = np.random.default_rng([0, 98])
    cases = [case("gaussian48-D1024", 1024, 0, 48, "gaussian", scenes), case("sinc96-D1024", 1024, 0, 96, "sinc", scenes[:3] + [(big, G.queries(big, r2, 25))]),
             case("gaussian48-D4096", 4096, 0, 48, "gaussian", scenes[:2])]
    # a larger canvas (the app widens the canvas to the content): the same scenes shifted into a 1500 x 900 canvas
    shifted = []
    for s, _ in scenes[:2]:
        t = json.loads(json.dumps(s))
        for e in t["elements"]: e["box"][0] += 250.0; e["box"][1] += 90.0
        for c in t["connectors"]: c["tail"] = [c["tail"][0] + 250.0, c["tail"][1] + 90.0]; c["tip"] = [c["tip"][0] + 250.0, c["tip"][1] + 90.0]
        shifted.append((t, G.queries(t, np.random.default_rng([0, 97]), 25)))
    cases.append(case("gaussian48-D1024-canvas1500x900", 1024, 0, 48, "gaussian", shifted, 1500, 900))
    os.makedirs(os.path.dirname(a.out), exist_ok=True); json.dump({"cases": cases}, open(a.out, "w"))
    nq = sum(len(sc["results"]) for c in cases for sc in c["scenes"])
    print(f"wrote {a.out}: {len(cases)} cases, {sum(len(c['scenes']) for c in cases)} scenes, {nq} relation decisions, {os.path.getsize(a.out) / 1e6:.2f} MB")


if __name__ == "__main__":
    main()
