"""golden phases of the portable stars (star_version 2) for web/tests/stars_test.mjs: 20 names at D = 64"""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tool"))
import numpy as np
from sop import world
names = [("sop-stars-v1", "id:" + w) for w in ["circle", "box", "Orders", "the", "draw", "42", "ünïcödé", "", "a", "left"]] + \
        [(0, "role:" + r) for r in ["object", "color", "landmark", "text"]] + [(0, "op:" + o) for o in ["pred", "not", "attr", "det", "marker", "says.scope"]]
out = [{"seed": s, "name": n, "phases": np.angle(world.star_v2(s, n, 64)).tolist()} for s, n in names]
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), "golden_stars.json"); json.dump(out, open(p, "w")); print(f"wrote {p}: {len(out)} stars at D 64")
