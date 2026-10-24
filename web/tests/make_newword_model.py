"""make_newword_model.py — a TEST copy of a star_version 2 model whose legend gains value patterns that give a kind to words outside the
catalog (q<digits> -> the kind of persons, r<digits> -> the kind of objects), so that the sentence-candidates mode has something to read:
"q77 gives r5 to p2 ." must read agent q77, object r5 in Python (Reader(sentence_candidates=True)) and in vss.js alike.
The copy's config.json gets the new legend hash (the Reader refuses a mismatch). Never a model to report.
Usage: python3 web/tests/make_newword_model.py <model dir (star_version 2)> <out dir> <person kind> <object kind>"""
import json, os, shutil, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tool"))
from sop.legend import sha256_file

src, out, pk, ok = sys.argv[1:5]
if os.path.exists(out): shutil.rmtree(out)
shutil.copytree(src, out)
lp = os.path.join(out, "legend.json"); lg = json.load(open(lp))
lg["values"] = list(lg.get("values", [])) + [{"kind": pk, "pattern": "q[0-9]+"}, {"kind": ok, "pattern": "r[0-9]+"}]
json.dump(lg, open(lp, "w"), indent=1)
cp = os.path.join(out, "config.json"); cfg = json.load(open(cp)); cfg["legend_sha256"] = sha256_file(lp); json.dump(cfg, open(cp, "w"), indent=1)
with open(os.path.join(out, "newword_sentences.txt"), "w") as f:
    f.write("q77 gives r5 to p2 .\np3 says that q12 lends r40 to p1 .\nq9 receives r7 from p4 .\np2 gives o3 to q55 .\nr8 is sold to q3 by p0 .\n")
print(f"make_newword_model: {out} (values q<digits> -> {pk}, r<digits> -> {ok})")
