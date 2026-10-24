"""normalize_golden.py: surface commands with the Python normalizer's output, for the JavaScript parity check in app/tests/dictation.mjs
(app/src/text/textnorm.js must give the same tokens and info). Our own generated sentences: the generator's surface commands (several
templates x prefixes, held-out formulations and new identities included) plus hand-written edge cases.
Run: python3 normalize_golden.py [--n 400] > normalize_golden.jsonl"""
import argparse, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import numpy as np
import generate as G
from normalize import normalize

EDGE = ["Bold the last sentence.", "make it bold", "Could you BOLD the word Revenue?", "centre that line please", "align it centre",
        "replace twenty five with thirty", "Make \"next quarter\" red.", "select from Q3 to the end", "select from the start to 'old plan'",
        "turn the last three lines into a numbered list", "make the first 2 words heading 2", "remove the bold from that paragraph", "unbold it",
        "put a full stop at the end", "add an exclamation point after hello", "scratch that", "read it back", "put the cursor at the end of the line",
        "don't delete it", "let's italicize the previous four characters", "strike through the word very", "cross out that sentence",
        "delete the word .", "the word", "two hundred", "one more line", "highlight the word revenue in yellow", "make the text bigger"]

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--n", type=int, default=400); a = ap.parse_args()
    rng = np.random.default_rng(7); g = G.Gen(rng, G.TEXT_TRAIN + G.TEXT_NEW, G.WIDGET_TRAIN + G.WIDGET_NEW, G.NUMS_TRAIN + G.NUMS_NEW)
    combos = [(ev, tid, f, p) for ev, ts in G.TEMPLATES.items() for tid, f in ts for p in G.PREFIXES]
    surfaces = list(EDGE)
    for i in range(a.n):
        ev, tid, f, p = combos[i % len(combos)]; surfaces.append(G.realise(g, ev, tid, f, p)[3])
    for s in surfaces:
        toks, info = normalize(s); print(json.dumps({"surface": s, "tokens": toks, "info": info}))
