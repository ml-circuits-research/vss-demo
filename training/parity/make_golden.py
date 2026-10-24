"""make_golden.py — the Python side of the parity test of app/src/vss.js (VSS Diagram Editor spec 7.1). numpy only.

For every sentence: tokens, kinds, the state vector S (re / im), the decoded frame (speakers, neg, event, roles, shape, lemma, depth, scope),
every margin and presence ratio, the residual, the status and the SOP text of the wires (no directives), formalized one sentence at a time
with wire ids starting at w1 and _sentence 0, exactly as app/tests/parity.mjs calls vss.js.

--dequantize-from <export dir>: the reader runs on the DEQUANTIZED route book and stars of that export (what the browser reads), so that an
8-bit or 4-bit export is compared number for number; without it, the trained float64 model is used (only a 32-bit export can match it).
--sentence-candidates: the optional behaviour of infer.Reader (candidates include the sentence's own tokens of the role's kinds).
Sentences: --sentences <file> (one per line) or --world <world dir>: 50 _text lines spread over every examples/*.sop file, plus 5 sentences
with words outside the catalog (a made-up word, a number, a label-like token, an unknown verb, a fully unknown sentence).
Usage: python3 training/parity/make_golden.py --model <model dir> --world <world dir> --out golden.json [--dequantize-from <export>] [--sentence-candidates]
"""
import argparse, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "tool"))
import numpy as np
from sop import soplang, export_web
from sop.infer import Reader, idgen
from sop.world import value_token


def pick_sentences(world_dir, n=50):
    ex = os.path.join(world_dir, "examples"); files = sorted(f for f in os.listdir(ex) if f.endswith(".sop")); per = {}
    for fn in files:
        doc = soplang.load(os.path.join(ex, fn)); per[fn] = [w.value("_text") for w in doc.top_level() if w.value("_text")]
    out, k = [], max(1, n // len(files))
    for fn in files: out += per[fn][:k]
    i = 0
    while len(out) < n and any(per.values()):
        fn = files[i % len(files)]; j = k + i // len(files)
        if j < len(per[fn]): out.append(per[fn][j])
        i += 1
        if i > 100 * n: break
    base = out[:5]; oov = []
    for s, rep in zip(base, ["zorglub", "1234", "Orders", "frobnicates", None]):
        t = s.split()
        if rep is None: oov.append("blorp quux zibble ."); continue
        t[len(t) // 2] = rep; oov.append(" ".join(t))
    return out[:n] + oov


def patch_dequantized(rd, export_dir):
    h, arr = export_web.read_bin(os.path.join(export_dir, "routebook.bin"))
    for name, v in arr.items(): setattr(rd.rb, name, v)
    sh, sa = export_web.read_bin(os.path.join(export_dir, "stars.bin")); M = np.exp(1j * sa["stars"]); ex = {k: M[i] for i, k in enumerate(sh["keys"])}
    st = rd.st; orig_get, orig_id = st.get, st.id
    st.get = lambda name, seed=None: ex[name] if name in ex else orig_get(name, seed)
    st.id = lambda w: ex["id:" + value_token(w)] if ("id:" + value_token(w)) in ex else orig_id(w)
    st.marker = lambda: ex["marker"]
    rd._cands = {}


def jsonable(x):
    if isinstance(x, dict): return {str(k): jsonable(v) for k, v in x.items()}
    if isinstance(x, (list, tuple)): return [jsonable(v) for v in x]
    if isinstance(x, (np.floating, float)): return float(x)
    if isinstance(x, (np.integer,)): return int(x)
    if isinstance(x, (np.bool_,)): return bool(x)
    return x


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--model", required=True); ap.add_argument("--world"); ap.add_argument("--sentences")
    ap.add_argument("--out", required=True); ap.add_argument("--dequantize-from", dest="deq"); ap.add_argument("--sentence-candidates", dest="sc", action="store_true")
    a = ap.parse_args()
    rd = Reader(a.model, sentence_candidates=a.sc)
    if a.deq: patch_dequantized(rd, a.deq)
    sents = [l.rstrip("\n") for l in open(a.sentences)] if a.sentences else pick_sentences(a.world)
    out = []
    for text in sents:
        wires, f, info = rd.formalize(text, 0, idgen(start=1))
        frame = {"speakers": f.get("speakers", []), "neg": bool(f.get("neg", False)), "event": f.get("event"), "roles": f.get("roles", {}), "shape": f.get("shape"),
                 "lemma": f.get("lemma"), "depth": f.get("depth", 0), "scope": f.get("scope")}
        S = info["S"]
        out.append(jsonable({"text": text, "tokens": info["tokens"], "kinds": [rd.kind(t) for t in info["tokens"]], "S_re": np.real(S).tolist(), "S_im": np.imag(S).tolist(),
                             "frame": frame, "margins": f.get("margins", {}), "presence": f.get("presence", {}), "residual": info["residual"], "status": info["status"],
                             "sop": soplang.write(soplang.Doc(wires=wires))}))
    json.dump({"model": a.model, "dequantized_from": a.deq, "sentence_candidates": a.sc, "items": out}, open(a.out, "w"))
    print(f"make_golden: {len(out)} sentences -> {a.out} (dequantized from {a.deq or '-'}; sentence candidates {a.sc})")


if __name__ == "__main__":
    main()
