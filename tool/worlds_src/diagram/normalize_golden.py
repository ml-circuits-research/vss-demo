"""normalize_golden.py: surface sentences of the generator (before normalization) with the Python normalizer's output, one JSON per line,
for web/tests/normalize_test.mjs. Includes hand-written hard cases (quotes, contractions, number words, % and multi-word expressions)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.dirname(os.path.dirname(HERE)))
import numpy as np
import generate as G
from normalize import normalize
HARD = ['Please add a "Check Stock" box in the top left corner.', "don't move it 20 pixels to the left of the DB", "make it 50% bigger",
        "add twenty five boxes", "connect each step to the next one", "zoom in please", "Put 'Order Received' halfway to the right edge!",
        "space the boxes forty pixels apart", "add two hundred boxes", "let's link the API to the data base", "move the cache a third of the way to the top border"]
rows = []
g = G.Gen(np.random.default_rng(5), G.LABELS_TRAIN, G.NUMS_TRAIN)
for ev, ts in G.TEMPLATES.items():
    for tid, f in ts:
        for _ in range(8):
            words, roles = f(g); rows.append(" ".join(words))
for s in HARD + rows:
    toks, info = normalize(s); print(json.dumps({"surface": s, "tokens": toks, "info": info}))
