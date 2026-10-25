"""eval_variants.py: the three variants of the languages design compared on eval_parallel.jsonl (training/TODO_DGX.md 2.6; criteria in
vision/ADDENDUM_languages_2026-10-25.md section 5, written before the runs).

Readers (Python, tool/sop/infer.Reader, as `sop formalize`):
  A    the diagram_ro model, on the normalized text of each realisation (row[real]["text"])
  B    the diagram_multi model, the same
  C    the dictionary (translate_en.json) + the English diagram model: the raw surface (row[real]["surface"]) through the translator (a port
       of app/src/translate.js: fold, longest key first, alternatives as variants capped at 8, labels after an intro kept), each variant
       through the English normalizer, read by the English reader; the clearest variant kept (the app's rule, speech.js chooseClearest:
       status ok < abstain < other, then the larger minimum margin, then the smaller residual)
  EN   the English model on the English realisation (the reference reading of the parallel check)
Realisations: ro, mix, romglish (and en, read by B and EN). FULL = the frame read equals the gold frame of the row (sop world.canon, with the
predicate lemma; determiner 'an' counted as 'a', the English article before a vowel, stated). Reported per variant and realisation: FULL,
FULL with status ok, the status counts. Parallel check: the share of rows whose frame read by EN on the English realisation equals the frame
read by A on the Romanian one (and by B on both). Dispatch by fit: every route (A, B, C) reads the realisation, the clearest reading by the
app's rule wins; reported: the share routed to a route whose reading is FULL-right, and FULL after the choice.

Usage: python3 eval_variants.py --parallel <world>/examples/eval_parallel.jsonl --en_model <diagram model> [--ro_model <diagram_ro model>]
                                [--multi_model <diagram_multi model>] [--dict translate_en.json] [--max_rows N] --out <json>
Every model is optional except EN; a variant whose model is not given is skipped. Prints the checklist of the protocol at the end."""
import argparse, collections, json, os, sys, unicodedata
HERE = os.path.dirname(os.path.abspath(__file__)); TOOL = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(HERE))), "tool")
sys.path.insert(0, TOOL); sys.path.insert(0, HERE)
from sop import world as sopworld
from sop.infer import Reader, idgen
import importlib.util

def _load(name, path):
    spec = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m

EN_NORM = _load("normalize_en", os.path.join(os.path.dirname(HERE), "diagram", "normalize.py")).normalize
INTRO = {"called", "named", "labelled", "labeled", "titled", "numit", "numita", "numiti", "numite", "denumit", "denumita", "etichetat", "etichetata"}


def fold(s):
    """app/src/translate.js fold: NFD, combining marks dropped, s/t with cedilla or comma -> s/t, lower case"""
    s = "".join(c for c in unicodedata.normalize("NFD", str(s)) if not "̀" <= c <= "ͯ")
    for a, b in (("ş", "s"), ("ș", "s"), ("Ş", "s"), ("Ș", "s"), ("ţ", "t"), ("ț", "t"), ("Ţ", "t"), ("Ț", "t")): s = s.replace(a, b)
    return s.lower()


class Translator:
    """the port of app/src/translate.js createTranslator (same rules, same order of variants)"""
    def __init__(self, d, max_variants=8):
        self.E, self.max_len, self.mv = {}, 1, max_variants
        for k, v in d.get("entries", {}).items():
            key = fold(k).split()
            if not key: continue
            self.E[" ".join(key)] = [str(x).split() for x in (v if isinstance(v, list) else [v])]; self.max_len = max(self.max_len, len(key))
    def translate(self, text):
        import re
        split = lambda x: re.sub(r"([.,;:!?])(?=\s|$)", r" \1 ", x).split()
        raw, toks = split(str(text)), split(fold(text)); slots, i, protect = [], 0, False
        while i < len(toks):
            if protect: slots.append([[raw[i] if i < len(raw) else toks[i]]]); protect = False; i += 1; continue
            hit = None
            for n in range(min(self.max_len, len(toks) - i), 0, -1):
                k = " ".join(toks[i:i + n])
                if k in self.E: hit = (k, n, self.E[k]); break
            if hit:
                slots.append(hit[2])
                if any(v and v[-1] in INTRO for v in hit[2]): protect = True
                i += hit[1]
            else:
                slots.append([[toks[i]]])
                if toks[i] in INTRO: protect = True
                i += 1
        variants = [[]]
        for opts in slots:
            nxt = []
            for v in variants:
                for o in opts:
                    if len(nxt) >= self.mv: break
                    nxt.append(v + o)
            variants = nxt
        return variants


def canon(f):
    f = json.loads(json.dumps(f))
    for fl in f.get("roles", {}).values():
        if fl and fl[0] == "entity" and len(fl) > 3 and fl[3] == "an": fl[3] = "a"
    return sopworld.canon(f)


def read(reader, text):
    wires, f, info = reader.formalize(text, None, idgen())
    mins = [v for v in f.get("margins", {}).values() if isinstance(v, (int, float))]
    return {"frame": canon(f) if f.get("shape") == "ok" else None, "status": info["status"], "min_margin": min(mins) if mins else float("-inf"),
            "residual": info["residual"], "text": text}


def clearest(readings):
    rank = lambda r: (0 if r["status"] == "ok" else 1 if r["status"] == "abstain" else 2, -r["min_margin"], r["residual"])
    return sorted(readings, key=rank)[0]


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--parallel", required=True); ap.add_argument("--en_model", required=True)
    ap.add_argument("--ro_model"); ap.add_argument("--multi_model"); ap.add_argument("--dict", default=os.path.join(HERE, "translate_en.json"))
    ap.add_argument("--max_rows", type=int, default=0); ap.add_argument("--out", required=True)
    a = ap.parse_args()
    rows = [json.loads(l) for l in open(a.parallel, encoding="utf-8") if l.strip()]
    if a.max_rows: rows = rows[:a.max_rows]
    EN = Reader(a.en_model); A = Reader(a.ro_model) if a.ro_model else None; B = Reader(a.multi_model) if a.multi_model else None
    tr = Translator(json.load(open(a.dict, encoding="utf-8")))
    for r_, nm in ((A, "A"), (B, "B")):
        if r_ is not None and r_.legend.sha != EN.legend.sha: sys.exit(f"variant {nm}: legend {r_.legend.sha} differs from the English model's {EN.legend.sha}")
    def C(surface):
        return clearest([read(EN, " ".join(EN_NORM(" ".join(v))[0])) for v in tr.translate(surface)])
    res = collections.defaultdict(lambda: {"n": 0, "full": 0, "full_ok": 0, "status": collections.Counter()})
    par = collections.Counter(); disp = collections.defaultdict(lambda: {"n": 0, "routed_right": 0, "full": 0, "oracle": 0, "by_route": collections.Counter()})
    for row in rows:
        gold = canon(row["frame"])
        reads = {}
        reads[("EN", "en")] = read(EN, row["en"]["text"])
        for real in ("ro", "mix", "romglish", "en"):
            if A is not None and real != "en": reads[("A", real)] = read(A, row[real]["text"])
            if B is not None: reads[("B", real)] = read(B, row[real]["text"])
            if real != "en": reads[("C", real)] = C(row[real]["surface"])
        for (v, real), rd in reads.items():
            s = res[f"{v}/{real}"]; s["n"] += 1; s["status"][rd["status"]] += 1
            if rd["frame"] == gold: s["full"] += 1; s["full_ok"] += rd["status"] == "ok"
        par["n"] += 1
        if A is not None: par["A(ro) = EN(en)"] += reads[("A", "ro")]["frame"] is not None and reads[("A", "ro")]["frame"] == reads[("EN", "en")]["frame"]
        if B is not None: par["B(ro) = B(en)"] += reads[("B", "ro")]["frame"] is not None and reads[("B", "ro")]["frame"] == reads[("B", "en")]["frame"]
        for real in ("ro", "mix", "romglish"):
            cands = [(v, reads[(v, real)]) for v in ("A", "B", "C") if (v, real) in reads]
            best_v, best = min(cands, key=lambda x: (0 if x[1]["status"] == "ok" else 1 if x[1]["status"] == "abstain" else 2, -x[1]["min_margin"], x[1]["residual"]))
            d = disp[real]; d["n"] += 1; d["by_route"][best_v] += 1
            right = best["frame"] == gold; d["full"] += right; d["routed_right"] += right
            d["oracle"] += any(x[1]["frame"] == gold for x in cands)
    out = {"rows": len(rows), "models": {"EN": a.en_model, "A": a.ro_model, "B": a.multi_model, "dict": a.dict},
           "full": {k: {"n": v["n"], "FULL": v["full"] / max(1, v["n"]), "FULL and status ok": v["full_ok"] / max(1, v["n"]), "status": dict(v["status"])} for k, v in sorted(res.items())},
           "parallel_check": {k: v / max(1, par["n"]) for k, v in par.items() if k != "n"},
           "dispatch": {k: {"n": v["n"], "routed to a route that reads it right": v["routed_right"] / max(1, v["n"]), "FULL after the choice": v["full"] / max(1, v["n"]),
                            "some route reads it right (oracle)": v["oracle"] / max(1, v["n"]), "chosen route": dict(v["by_route"])} for k, v in disp.items()},
           "rules": "FULL: the frame read = the row's gold frame (sop world.canon, predicate lemma included; det an = a). Dispatch: the clearest reading among the routes "
                    "(status ok < abstain < other, then the larger minimum margin, then the smaller residual: app/src/speech.js chooseClearest). With the dispatch, "
                    "'routed right' and 'FULL after the choice' are the same number (a route that reads it right is the one chosen)."}
    json.dump(out, open(a.out, "w"), indent=1)
    for k, v in out["full"].items(): print(f"{k:14s} FULL {v['FULL']:.3f}  (status ok {v['FULL and status ok']:.3f}; n {v['n']}; {v['status']})")
    for k, v in out["parallel_check"].items(): print(f"parallel check {k}: {v:.3f}")
    for k, v in out["dispatch"].items(): print(f"dispatch {k}: FULL after the choice {v['FULL after the choice']:.3f}; chosen {v['chosen route']}")
    print("checklist: [x] criteria written before the run (ADDENDUM section 5, TODO_DGX 2.6) [x] same legend for every reader (sha checked) "
          "[x] gold from the generator, never from a reader [x] per-seed numbers: run once per seed's models, report mean and spread [ ] >= 3 seeds (the caller)")


if __name__ == "__main__":
    main()
