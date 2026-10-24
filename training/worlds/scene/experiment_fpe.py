"""experiment_fpe.py: positions as addresses (spec 17.3), the prepared experiment. One change to the algebra: the address of an element is
the fractional power encoding of its position (fpe.py) instead of an address learned from words. Nothing is trained: the only free
parameters (the kernel and its length scale L, and the abstention threshold tau) are chosen on the dev split and frozen before the
heldout split is read (rule 25).

CRITERIA (written before the first run; spec 17.3 and Table 13, row "Scene reading with positions as addresses"):
  C1  relation readout on HELDOUT scenes of the demo's size (3 to 15 elements, 0 to 2 containers, n/2 connectors), at D = 1024:
      left_of >= 0.97, above >= 0.97, inside >= 0.97, nearest endpoint >= 0.97, each judged on the MEAN over five seeds with the
      per-seed list printed (rule 27). Reported beside each: chance, the majority answer, margins, coverage and confident-wrong at tau.
  C2  the same rows at D = 4096: reported (the criterion is judged at 1024, the size the browser can carry).
  R1  separability, reported: the smallest centre distance d (px) at which left_of between two elements reaches 0.97, at D = 1024
      and 4096; and the smallest distance at which two elements with the SAME identity resolve into two peaks.
  R2  capacity, reported: relation accuracy against the number of elements n in {4, 8, 16, 32, 64, 128}; capacity = the largest n at
      which all four relations reach 0.97 (mean over seeds).
  Swap-in rule (spec 17.3): the browser's scene reader stays the rule-based pass (app/src/sketch/scene_pass.js) unless C1 is met.

Readout (read by displacing and comparing, not learned):
  decode(a)     q_a = S (x) conj(E_a) ~ A(c_a) + crosstalk; the position is the argmax of Re<q_a, A(x, y)> on a grid, refined
  left_of(a,b)  sign of Re<q_b, A(c^_a) (x) H_x+> - Re<q_b, A(c^_a) (x) H_x->   (H_x+-: the bundle of every displacement to the right / left)
  above(a,b)    the same along y
  inside(a,c)   the four corners' sides: tl left of and above c^_a, br right of and below c^_a (q_tl = S (x) conj(E_c (x) R_tl), ...)
  nearest(j)    the tip t^ decoded; the element whose decoded centre has the most similar address, Re<A(t^), A(c^_k)>, wins
  margin        |side score| for the binary relations, best minus second similarity for nearest
  --readout decoded (default): every address in a relation is first decoded from the superposed state (the step where crosstalk and
                capacity bite), then the clean addresses are displaced and compared. --readout direct: the second address stays the
                noisy unbound vector q_b (q_tl, q_br) and is compared with the displaced half-plane bundle; purely algebraic, but the
                bundle spreads the signal over every displacement of the half plane (a recorded alternative, run separately).

Modes:
  --smoke       CPU, tiny sizes (D 256, one seed, a few scenes): checks that the pipeline runs; its numbers are NOT results.
  DGX command (see training/TODO_DGX.md), from the repository root, on a clean tree:
    python3 training/worlds/scene/experiment_fpe.py --D 1024 4096 --seeds 0 1 2 3 4 --n_dev 100 --n_heldout 400 \\
        --capacity 4 8 16 32 64 128 --n_cap 60 --sep_trials 200 --out logs/scene_fpe_<commit> 2>&1 | tee logs/scene_fpe_<commit>.log
Resumable: each (D, seed) writes <out>/D<D>_seed<seed>.json and is skipped when that file exists.
"""
import argparse, json, os, resource, sys, time

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import generate as G  # noqa: E402
from fpe import FPE, Algebra, encode_scene, n_terms  # noqa: E402

RELS = ["left_of", "above", "inside", "nearest"]
CRIT = 0.97


def rss_mb():
    return resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024.0


class Reader:
    """the readout of one (fpe, algebra) pair; half-plane templates built once"""

    def __init__(self, fpe, alg, readout="decoded"):
        self.f, self.a, self.readout = fpe, alg, readout
        self.Hx = (fpe.halfplane(0, +1, G.W, G.H), fpe.halfplane(0, -1, G.W, G.H))
        self.Hy = (fpe.halfplane(1, +1, G.H, G.W), fpe.halfplane(1, -1, G.H, G.W))

    def scene(self, s):
        self.S = encode_scene(s, self.f, self.a); self.cache = {}; self.s = s
        return self

    def q(self, eid, role=None):
        xp = self.f.xp; v = self.a.el(eid) * (self.a.role(role) if role else 1)
        return self.S * xp.conj(v)

    def pos(self, eid, role=None):
        k = (eid, role)
        if k not in self.cache: self.cache[k] = self.f.decode(self.q(eid, role), G.W, G.H)[:2]
        return self.cache[k]

    def answer(self, q):
        f, xp = self.f, self.f.xp
        if q["rel"] in ("left_of", "above"):
            ax = self.pos(q["a"]); A = f.addr(*ax); H = self.Hx if q["rel"] == "left_of" else self.Hy
            qb = self.q(q["b"]) if self.readout == "direct" else f.addr(*self.pos(q["b"]))
            sc = f.side(qb, A, H[0], H[1])
            return sc > 0, abs(sc), sc
        if q["rel"] == "inside":
            A = f.addr(*self.pos(q["a"]))
            if self.readout == "direct": qtl, qbr = self.q(q["c"], "tl"), self.q(q["c"], "br")
            else: qtl, qbr = f.addr(*self.pos(q["c"], "tl")), f.addr(*self.pos(q["c"], "br"))
            s = [f.side(qtl, A, xp.conj(self.Hx[0]), xp.conj(self.Hx[1])), f.side(qtl, A, xp.conj(self.Hy[0]), xp.conj(self.Hy[1])),
                 f.side(qbr, A, self.Hx[0], self.Hx[1]), f.side(qbr, A, self.Hy[0], self.Hy[1])]
            m = min(s); return m > 0, abs(m), m
        if q["rel"] == "nearest":
            T = f.addr(*self.pos(q["j"], "tip"))
            els = [e["id"] for e in self.s["elements"] if not e.get("container")]
            sims = sorted(((float(f.sim(T, f.addr(*self.pos(e)))), e) for e in els), reverse=True)
            return sims[0][1], sims[0][0] - (sims[1][0] if len(sims) > 1 else 0.0), sims[0][0]
        raise ValueError(q["rel"])


def run_set(reader, scenes_qs):
    """-> {rel: [(correct, margin, gold)]}"""
    out = {r: [] for r in RELS}
    for s, qs in scenes_qs:
        reader.scene(s)
        for q in qs:
            pred, margin, _ = reader.answer(q)
            out[q["rel"]].append((bool(pred == q["answer"]), float(margin), q["answer"]))
    return out


def acc(rows): return float(np.mean([c for c, _, _ in rows])) if rows else float("nan")


def tau_on(rows, cw=0.01):
    """the smallest margin threshold whose confident-wrong rate (wrong among covered) is <= cw on these rows (dev only)"""
    if not rows: return 0.0
    ms = sorted(set(m for _, m, _ in rows))
    for t in [0.0] + ms:
        cov = [(c, m) for c, m, _ in rows if m >= t]
        if not cov: return t
        if 1 - np.mean([c for c, _ in cov]) <= cw: return float(t)
    return float(ms[-1])


def at_tau(rows, t):
    cov = [c for c, m, _ in rows if m >= t]
    return (len(cov) / max(1, len(rows)), (1 - float(np.mean(cov))) if cov else 0.0)


def chance_and_majority(rows, rel, scenes_qs=None):
    if rel == "nearest":
        ns = [q["n_candidates"] for _, qs in scenes_qs for q in qs if q["rel"] == "nearest"]
        return (float(np.mean([1 / n for n in ns])) if ns else float("nan")), float("nan")
    golds = [g for _, _, g in rows]
    return 0.5, (max(np.mean(golds), 1 - np.mean(golds)) if golds else float("nan"))


def separability(fpe, alg, ds, trials, n_bg, seed, readout="decoded"):
    """left_of between two elements d px apart; and same-identity two-peak resolution"""
    r = np.random.default_rng([seed, 7]); reader = Reader(fpe, alg, readout); xp = fpe.xp
    res = {"left_of": {}, "same_identity": {}}
    for d in ds:
        ok = 0
        for t in range(trials):
            s, q = G.separability_scene(r, d, n_bg, f"sep-{d}-{t}")
            reader.scene(s); pred, _, _ = reader.answer(q); ok += int(pred == q["answer"])
        res["left_of"][d] = ok / trials
        ok = 0
        for t in range(trials):
            s = G.make_scene(r, n_bg, f"sid-{d}-{t}", n_containers=0, n_conn=0)
            S = encode_scene(s, fpe, alg); E = alg.el("twin")
            y = float(r.uniform(100, G.H - 100)); x0 = float(r.uniform(100, G.W - 100 - d))
            S = S + E * (fpe.addr(x0, y) + fpe.addr(x0 + d, y))
            xs = np.arange(x0 - 2 * fpe.L - 10, x0 + d + 2 * fpe.L + 10, 1.0)
            R = fpe.response(S * xp.conj(E), xs, np.array([y]))[:, 0]
            R = R.get() if hasattr(R, "get") else np.asarray(R)
            peaks = [i for i in range(1, len(R) - 1) if R[i] >= R[i - 1] and R[i] >= R[i + 1] and R[i] > 0.5]
            tol = 0.25 * d + 3
            if peaks:
                i0 = min(peaks, key=lambda i: abs(xs[i] - x0)); i1 = min(peaks, key=lambda i: abs(xs[i] - x0 - d))
                ok += int(i0 != i1 and abs(xs[i0] - x0) <= tol and abs(xs[i1] - x0 - d) <= tol)
        res["same_identity"][d] = ok / trials
    smallest = lambda m: next((d for d in sorted(m) if m[d] >= CRIT and all(m[e] >= CRIT for e in m if e >= d)), None)
    res["smallest_left_of"] = smallest(res["left_of"]); res["smallest_same_identity"] = smallest(res["same_identity"])
    return res


def one_run(D, seed, a, xp):
    t0 = time.time()
    alg = Algebra(D, seed, xp)
    dev = G.split_scenes(seed, "dev", a.n_dev); held = G.split_scenes(seed, "heldout", a.n_heldout)
    # 1. choose kernel and L on dev
    choice = []
    for kern in a.kernels:
        for L in a.Ls:
            f = FPE(D, seed, L, kern, xp); rows = run_set(Reader(f, alg, a.readout), dev)
            m = float(np.mean([acc(rows[r]) for r in RELS if rows[r]])); choice.append((m, -L, kern, L, rows))
            print(f"  D {D} seed {seed} dev kernel {kern} L {L}: mean {m:.3f} " + " ".join(f"{r} {acc(rows[r]):.3f}" for r in RELS), flush=True)
    m, _, kern, L, dev_rows = max(choice, key=lambda c: (c[0], c[1]))
    taus = {r: tau_on(dev_rows[r]) for r in RELS}
    f = FPE(D, seed, L, kern, xp); reader = Reader(f, alg, a.readout)
    # 2. heldout, frozen
    rows = run_set(reader, held)
    out = {"D": D, "seed": seed, "readout": a.readout, "kernel": kern, "L": L, "tau": taus, "dev_mean": m, "heldout": {}, "terms_mean": float(np.mean([n_terms(s) for s, _ in held]))}
    for r in RELS:
        ch, maj = chance_and_majority(rows[r], r, held); cov, cw = at_tau(rows[r], taus[r]); ms = [mm for _, mm, _ in rows[r]]
        out["heldout"][r] = {"n": len(rows[r]), "acc": acc(rows[r]), "chance": ch, "majority": maj, "coverage_at_tau": cov, "confident_wrong_at_tau": cw,
                             "margin_q": [float(np.quantile(ms, q)) for q in (0.1, 0.5, 0.9)] if ms else []}
    # 3. capacity
    out["capacity"] = {}
    rc = np.random.default_rng([seed, 5])
    for n in a.capacity:
        sz = (40, 140) if n <= 16 else (max(10, 40 * (16 / n) ** 0.5), max(24, 140 * (16 / n) ** 0.5))
        sq = []
        for i in range(a.n_cap):
            s = G.make_scene(rc, n, f"cap{n}-{i}", n_containers=2, size=sz); sq.append((s, G.queries(s, rc)))
        rr = run_set(reader, sq)
        out["capacity"][n] = {"placed": float(np.mean([sum(1 for e in s["elements"] if not e.get("container")) for s, _ in sq])),
                              "terms": float(np.mean([n_terms(s) for s, _ in sq])), **{r: acc(rr[r]) for r in RELS}}
    # 4. separability
    out["separability"] = separability(f, alg, a.sep_d, a.sep_trials, a.sep_bg, seed, a.readout)
    out["seconds"] = time.time() - t0; out["rss_mb"] = rss_mb()
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--smoke", action="store_true")
    ap.add_argument("--D", type=int, nargs="+", default=[1024, 4096]); ap.add_argument("--seeds", type=int, nargs="+", default=[0, 1, 2, 3, 4])
    ap.add_argument("--n_dev", type=int, default=100); ap.add_argument("--n_heldout", type=int, default=400)
    ap.add_argument("--kernels", nargs="+", default=["gaussian", "sinc"]); ap.add_argument("--Ls", type=float, nargs="+", default=[16, 24, 32, 48, 64, 96])
    ap.add_argument("--capacity", type=int, nargs="+", default=[4, 8, 16, 32, 64, 128]); ap.add_argument("--n_cap", type=int, default=60)
    ap.add_argument("--sep_d", type=float, nargs="+", default=[2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]); ap.add_argument("--sep_trials", type=int, default=200)
    ap.add_argument("--sep_bg", type=int, default=8); ap.add_argument("--readout", default="decoded", choices=["decoded", "direct"])
    ap.add_argument("--out", default=os.path.join(HERE, "..", "..", "..", "logs", "scene_fpe")); ap.add_argument("--xp", default="numpy", choices=["numpy", "cupy"])
    a = ap.parse_args()
    if a.smoke:
        a.D, a.seeds, a.n_dev, a.n_heldout, a.kernels, a.Ls = [256], [0], 6, 8, ["gaussian"], [24, 48]
        a.capacity, a.n_cap, a.sep_d, a.sep_trials = [4, 16], 3, [16, 64], 10
        a.out = os.path.join(a.out, "smoke")
    xp = np
    if a.xp == "cupy":
        import cupy as xp  # noqa: F811  (optional, DGX only)
    os.makedirs(a.out, exist_ok=True)
    small = a.smoke or a.n_heldout < 100 or len(a.seeds) < 3
    label = "SMOKE (CPU, tiny sizes: not a result)" if a.smoke else ("SMALL (fewer than 100 heldout scenes or 3 seeds: not a result, no verdict)" if small else "RUN")
    print(f"experiment_fpe [{label}] readout {a.readout} D {a.D} seeds {a.seeds} dev {a.n_dev} heldout {a.n_heldout} kernels {a.kernels} L {a.Ls} out {a.out}")
    print("criteria (written before the run): C1 heldout left_of, above, inside, nearest each >= 0.97 at D = 1024 (mean over seeds); "
          "C2 the same at 4096 reported; R1 separability reported; R2 capacity reported")
    runs = []
    for D in a.D:
        for seed in a.seeds:
            path = os.path.join(a.out, f"D{D}_seed{seed}{'' if a.readout == 'decoded' else '_' + a.readout}.json")
            if os.path.exists(path): runs.append(json.load(open(path))); print(f"  D {D} seed {seed}: resumed from {path}"); continue
            r = one_run(D, seed, a, xp); json.dump(r, open(path, "w"), indent=1); runs.append(r)
            print(f"  D {D} seed {seed}: kernel {r['kernel']} L {r['L']} (chosen on dev), {r['seconds']:.0f} s, max RSS {r['rss_mb']:.0f} MB", flush=True)
    # ---- summary
    summ = {}
    print(f"\nheldout relation readout [{label}] (mean +- sd over seeds; per-seed list; chance; majority; coverage and confident-wrong at tau set on dev)")
    for D in a.D:
        rs = [r for r in runs if r["D"] == D]; summ[D] = {}
        for rel in RELS:
            v = [r["heldout"][rel]["acc"] for r in rs if r["heldout"][rel]["n"]]
            if not v: print(f"  D {D:5d} {rel:8s} no queries"); continue
            h0 = rs[0]["heldout"][rel]; mean = float(np.mean(v))
            verdict = "" if small else (" MET" if mean >= CRIT else " MISSED") if D == 1024 else " reported"
            summ[D][rel] = mean
            print(f"  D {D:5d} {rel:8s} {mean:.3f} +- {float(np.std(v)):.3f} {[round(x, 3) for x in v]} n {h0['n']} chance {h0['chance']:.3f} majority {h0['majority']:.3f} "
                  f"coverage {np.mean([r['heldout'][rel]['coverage_at_tau'] for r in rs]):.3f} confident-wrong {np.mean([r['heldout'][rel]['confident_wrong_at_tau'] for r in rs]):.3f}"
                  f" margin q10/50/90 {[round(x, 3) for x in h0['margin_q']]}{verdict}")
        print(f"  D {D:5d} chosen (kernel, L) per seed: {[(r['kernel'], r['L']) for r in rs]}; mean terms per heldout scene {np.mean([r['terms_mean'] for r in rs]):.1f}")
        print(f"  D {D:5d} capacity (mean over seeds): " + "; ".join(
            f"n {n}: placed {np.mean([r['capacity'][str(n)]['placed'] if str(n) in r['capacity'] else r['capacity'][n]['placed'] for r in rs]):.0f} "
            + " ".join(f"{rel} {np.nanmean([(r['capacity'].get(str(n)) or r['capacity'].get(n))[rel] for r in rs]):.2f}" for rel in RELS) for n in a.capacity))
        cap_ok = [n for n in a.capacity if all(np.nanmean([(r['capacity'].get(str(n)) or r['capacity'].get(n))[rel] for r in rs]) >= CRIT for rel in RELS)]
        print(f"  D {D:5d} capacity (largest n with all relations >= {CRIT}): {max(cap_ok) if cap_ok else 'none in the sweep'}")
        sl = [r["separability"]["smallest_left_of"] for r in rs]; ss = [r["separability"]["smallest_same_identity"] for r in rs]
        print(f"  D {D:5d} separability: smallest d for left_of >= {CRIT}: per seed {sl}; two peaks of one identity: per seed {ss}")
    json.dump({"runs": runs, "summary": summ, "smoke": a.smoke}, open(os.path.join(a.out, "summary.json"), "w"), indent=1)
    print(f"\nmax RSS {rss_mb():.0f} MB; results in {a.out}")
    print("\nchecklist: [x] criteria written before the run (docstring, README, printed) [x] world addresses: positions, given; identities and roles "
          "from tool/sop/world.py star [x] chance and majority printed [x] margins and confident-wrong at tau [x] tau and (kernel, L) set on dev, "
          "reported on heldout (25) [x] same evaluation function for every variant (8) [x] per-seed list beside the mean (27) "
          f"[{'x' if len(a.seeds) >= 3 else ' '}] >= 3 seeds [x] memory logged (21) [x] resumable per (D, seed) [x] trivial control: chance "
          "(a reader that ignores positions answers at chance)")


if __name__ == "__main__":
    main()
