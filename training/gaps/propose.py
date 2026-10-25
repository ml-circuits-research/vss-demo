"""propose.py: the proposal step of the improvement loop (vision/ADDENDUM_qformalisation_2026-10-25.md, section 5): a gaps report and the
world's legend -> structured proposals, each validated before it is kept. UNTESTED against a real model: the API call is behind
--dry_run until a key is set, and no proposal is applied here (apply.py does that under the acceptance rule).

A proposal is one of:
  {"kind": "role", "id": "<new role>", "question": "...", "kinds": ["<kind of the filler words>"], "words": {"<word>": "<kind>"},
   "examples": ["<SOP wires>"]}                                   a new question of the legend, with ten annotated example sentences
  {"kind": "words", "role": "<existing role>", "words": {"<word>": "<kind>", ...}}      new words for an existing kind
  {"kind": "formulations", "event": "<event>", "templates": ["..."]}                    new surface templates for the generator
  {"kind": "event", "id": "<new event>", "verbs": [...], "roles": [...], "examples": [...]}
  {"kind": "symbolic_rule", "name": "...", "code": "<python: wires -> constraints>", "tests": [...]}   a translation rule to the symbolic layer
Validation here (mechanical, no judgment): the JSON shape; no proposed id collides with the legend; every example passes `sop check`
against the legend WITH the proposal applied in a temporary copy; a symbolic rule's tests run in a sandboxed subprocess. What fails is
written to rejected.jsonl with its reason. Accepted proposals go to proposals.jsonl for the retraining step.
Usage: python3 training/gaps/propose.py --report report.json --world <world folder> --out <dir> [--model <id>] [--dry_run]"""
import argparse, json, os, subprocess, sys, tempfile, shutil
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(os.path.dirname(HERE)); SOP = os.path.join(REPO, "tool", "bin", "sop")

PROMPT = """You extend the legend of a small world read by a VSS reader. The legend lists events (with verbs), roles (each a question), operators,
and a lexicon of words with kinds. Below is a report of where readings fell short: words with no kind (with their context), roles the reader
was unsure about, sentences it did not understand, sentences a person marked as "this should have worked", and reformulations.
Propose the smallest set of changes that would close the most frequent gaps. Answer ONLY with a JSON list of proposals in the formats
given. Each new role or event must come with ten example sentences written in SOP Lang exactly as the examples of the world (see the
sample). Do not propose anything for gaps with fewer than {min_count} readings. Legend:\n{legend}\n\nSample SOP:\n{sample}\n\nReport:\n{report}"""

def validate(prop, world, legend):
    kinds = {}
    for l in open(os.path.join(world, "kinds.tsv"), encoding="utf-8"):
        if l.strip() and not l.startswith("#"): p = l.rstrip("\n").split("\t"); kinds[p[0]] = p[1]
    ids = {r["id"] for r in legend["roles"]} | {e["id"] for e in legend["events"]}
    k = prop.get("kind")
    if k in ("role", "event") and prop.get("id") in ids: return f"id {prop.get('id')!r} already in the legend"
    if k in ("role", "event") and len(prop.get("examples") or []) < 10: return "fewer than 10 examples"
    if k == "words" and not prop.get("words"): return "no words"
    if k in ("role", "event", "words") and any(w in kinds and kinds[w] != kd for w, kd in (prop.get("words") or {}).items()): return "a word would change its kind"
    if k in ("role", "event"):
        tmp = tempfile.mkdtemp(); shutil.copytree(world, os.path.join(tmp, "w"), ignore=shutil.ignore_patterns("model", "runs", "versions"))
        try:
            L = json.load(open(os.path.join(tmp, "w", "legend.json")))
            if k == "role": L["roles"].append({"id": prop["id"], "question": prop.get("question", "?")})
            else: L["events"].append({"id": prop["id"], "verbs": prop.get("verbs", [])})
            json.dump(L, open(os.path.join(tmp, "w", "legend.json"), "w"), indent=1)
            with open(os.path.join(tmp, "w", "kinds.tsv"), "a", encoding="utf-8") as f:
                for w, kd in (prop.get("words") or {}).items(): f.write(f"{w}\t{kd}\n")
            ex = os.path.join(tmp, "w", "examples", "proposal.sop")
            open(ex, "w", encoding="utf-8").write(f"!world {legend.get('name', os.path.basename(world))}\n" + "\n".join(prop["examples"]) + "\n")
            r = subprocess.run([SOP, "check", "--legend", os.path.join(tmp, "w", "legend.json"), ex], capture_output=True, text=True)
            if r.returncode != 0: return "sop check: " + (r.stdout.strip().splitlines() or ["failed"])[-1][:300]
        finally: shutil.rmtree(tmp, ignore_errors=True)
    if k == "symbolic_rule":
        code = prop.get("code", ""); tests = prop.get("tests") or []
        if not tests: return "a symbolic rule needs tests"
        prog = code + "\n" + "\n".join(tests)
        r = subprocess.run([sys.executable, "-I", "-c", prog], capture_output=True, text=True, timeout=30)
        if r.returncode != 0: return "rule tests failed: " + r.stderr.strip()[-300:]
    return None

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--report", required=True); ap.add_argument("--world", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--model", default="claude-opus-5-5"); ap.add_argument("--min_count", type=int, default=5); ap.add_argument("--dry_run", action="store_true")
    ap.add_argument("--proposals", help="a JSON list of proposals to validate instead of calling the API (tests)")
    a = ap.parse_args(); os.makedirs(a.out, exist_ok=True)
    legend = json.load(open(os.path.join(a.world, "legend.json"))); report = json.load(open(a.report))
    sample = "".join(open(os.path.join(a.world, "examples", "train.sop"), encoding="utf-8").readlines()[:40]) if os.path.exists(os.path.join(a.world, "examples", "train.sop")) else ""
    prompt = PROMPT.format(min_count=a.min_count, legend=json.dumps(legend, indent=0)[:6000], sample=sample, report=json.dumps(report, indent=0)[:20000])
    open(os.path.join(a.out, "prompt.txt"), "w", encoding="utf-8").write(prompt)
    if a.proposals: props = json.load(open(a.proposals))
    elif a.dry_run or not os.environ.get("ANTHROPIC_API_KEY"): print("dry run: prompt written, no API call (set ANTHROPIC_API_KEY to propose)"); return
    else:
        import anthropic
        msg = anthropic.Anthropic().messages.create(model=a.model, max_tokens=8000, messages=[{"role": "user", "content": prompt}])
        text = "".join(b.text for b in msg.content if getattr(b, "type", "") == "text"); open(os.path.join(a.out, "raw.txt"), "w").write(text)
        try: props = json.loads(text[text.index("["):text.rindex("]") + 1])
        except Exception as ex: print(f"no JSON list in the answer: {ex}"); return
    acc, rej = open(os.path.join(a.out, "proposals.jsonl"), "w"), open(os.path.join(a.out, "rejected.jsonl"), "w")
    na = nr = 0
    for p in props:
        why = validate(p, a.world, legend) if isinstance(p, dict) else "not an object"
        if why: rej.write(json.dumps({"proposal": p, "reason": why}) + "\n"); nr += 1
        else: acc.write(json.dumps(p) + "\n"); na += 1
    print(f"proposals: {na} accepted by the mechanical checks, {nr} rejected (reasons in rejected.jsonl); nothing applied")

if __name__ == "__main__": main()
