"""apply.py: accepted proposals (propose.py) -> a NEW world folder (a copy; the original is untouched): the legend gains the roles / events,
kinds.tsv the words, examples/ the proposals' sentences (proposals.sop) and, for 'formulations', the generator's templates are NOT edited
here (a generator change is code: it is written as a patch file for the coding agent, patches/<n>.md, and applied by a person or the agent).
Symbolic rules are written to rules/<name>.py with their tests. UNTESTED on real proposals.
Usage: python3 training/gaps/apply.py --world <world> --proposals proposals.jsonl --out <new world>"""
import argparse, json, os, shutil

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--world", required=True); ap.add_argument("--proposals", required=True); ap.add_argument("--out", required=True)
    a = ap.parse_args()
    if os.path.exists(a.out): shutil.rmtree(a.out)
    shutil.copytree(a.world, a.out, ignore=shutil.ignore_patterns("model", "runs", "versions"))
    for d in ("model", "runs", "versions", "patches", "rules"): os.makedirs(os.path.join(a.out, d), exist_ok=True)
    L = json.load(open(os.path.join(a.out, "legend.json"))); kinds = open(os.path.join(a.out, "kinds.tsv"), "a", encoding="utf-8")
    ex = open(os.path.join(a.out, "examples", "proposals.sop"), "w", encoding="utf-8"); ex.write(f"!world {os.path.basename(a.out)}\n")
    n = {"role": 0, "event": 0, "words": 0, "formulations": 0, "symbolic_rule": 0}
    for i, line in enumerate(open(a.proposals, encoding="utf-8")):
        p = json.loads(line); k = p["kind"]; n[k] = n.get(k, 0) + 1
        if k == "role": L["roles"].append({"id": p["id"], "question": p.get("question", "?"), "_proposed": True})
        if k == "event": L["events"].append({"id": p["id"], "verbs": p.get("verbs", []), "_proposed": True})
        for w, kd in (p.get("words") or {}).items(): kinds.write(f"{w}\t{kd}\n")
        for s in p.get("examples") or []: ex.write(s.rstrip("\n") + "\n\n")
        if k == "formulations": open(os.path.join(a.out, "patches", f"{i:03d}_formulations_{p.get('event','')}.md"), "w").write("# generator templates proposed\n\n" + "\n".join(f"- {t}" for t in p.get("templates", [])) + "\n")
        if k == "symbolic_rule": open(os.path.join(a.out, "rules", f"{p['name']}.py"), "w").write(p["code"] + "\n\n# tests\n" + "\n".join(p.get("tests", [])) + "\n")
    L.setdefault("history", []).append({"applied": a.proposals, "counts": n}); json.dump(L, open(os.path.join(a.out, "legend.json"), "w"), indent=1)
    print(f"applied to {a.out}: {n} (the legend hash changed; formulations are patches for the coding agent, not applied)")

if __name__ == "__main__": main()
