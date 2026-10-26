"""make_eventroles_model.py — a TEST copy of a star_version 2 reference model whose legend declares per-event role sets (vss-demo Q12 /
responses D19): `display` takes agent and object only (recipient is not read for it) and requires object; `transfer` requires agent
and object. The sentences exercise both rules: a display sentence with a person after "to" (recipient not read), and transfer / display
sentences without a required role (the frame incomplete, a presence query). The copy's config.json gets the new legend hash. Never a
model to report.
Usage: python3 training/parity/make_eventroles_model.py <model dir (star_version 2)> <out dir>"""
import json, os, shutil, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tool"))
from sop.legend import sha256_file

if sys.argv[1] == "--check":                      # the golden of the event-roles model shows both rules
    g = json.load(open(sys.argv[2]))["items"]; d = next(x for x in g if x["text"].startswith("p3 shows o1 to p2"))
    not_read = "recipient" not in d["frame"]["roles"]; asked = any("_presence_query." in x["sop"] for x in g)
    print(f"event roles: recipient not read for display: {not_read}; a required role asked: {asked}"); sys.exit(0 if not_read and asked else 1)
src, out = sys.argv[1:3]
if os.path.exists(out): shutil.rmtree(out)
shutil.copytree(src, out)
lp = os.path.join(out, "legend.json"); lg = json.load(open(lp))
for e in lg["events"]:
    if e["id"] == "display": e["roles"] = ["agent", "object"]; e["required"] = ["object"]
    if e["id"] == "transfer": e["required"] = ["agent", "object"]
json.dump(lg, open(lp, "w"), indent=1)
cp = os.path.join(out, "config.json"); cfg = json.load(open(cp)); cfg["legend_sha256"] = sha256_file(lp); json.dump(cfg, open(cp, "w"), indent=1)
with open(os.path.join(out, "eventroles_sentences.txt"), "w") as f:
    f.write("p3 shows o1 to p2 .\np3 shows o4 .\np1 gives o2 to p5 .\np1 gives to p5 .\ngives o2 to p5 .\np0 sees o3 .\np2 shows to p4 .\n")
print(f"make_eventroles_model: {out} (display: roles agent, object; required object. transfer: required agent, object)")
