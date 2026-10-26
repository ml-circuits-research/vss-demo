"""make_pwp_model.py — a TEST copy of a star_version 2 model with the decoder key presence_without_placed on (vss-demo Q17 / responses D28:
the roles left absent are read a second time on the state without the deposits of the words already placed). Never a model to report.
Usage: python3 training/parity/make_pwp_model.py <model dir> <out dir>    |    --check <golden.json>  (prints how many frames took a role in
the second pass; the parity itself is checked by app/tests/parity.mjs)"""
import json, os, shutil, sys
if sys.argv[1] == "--check":
    g = json.load(open(sys.argv[2]))["items"]
    n = sum(1 for x in g if x.get("second_pass"))
    print(f"presence without placed: {n} of {len(g)} readings took a role in the second pass"); sys.exit(0)
src, out = sys.argv[1:3]
if os.path.exists(out): shutil.rmtree(out)
shutil.copytree(src, out)
cp = os.path.join(out, "config.json"); cfg = json.load(open(cp)); cfg["presence_without_placed"] = True; json.dump(cfg, open(cp, "w"), indent=1)
print(f"make_pwp_model: {out} (presence_without_placed on)")
