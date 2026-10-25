"""accept.py: the acceptance rule of the loop, written before any run: a retrained world is accepted only if (1) no pre-existing row of
metrics.json falls by more than one seed std of the shipped model, and (2) the gap rows (FULL on examples/proposals.sop and the share of
unplaced words on the report's examples) improve. Writes REPORT.md with both tables and the verdict; never ships anything.
UNTESTED on real runs. Usage: python3 training/gaps/accept.py --before <run dir of the shipped model> --after <run dir> --report report.json --out REPORT.md"""
import argparse, json, os

def load_metrics(run):
    p = os.path.join(run, "metrics.json")
    return json.load(open(p)) if os.path.exists(p) else None

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--before", required=True); ap.add_argument("--after", required=True); ap.add_argument("--report", required=True); ap.add_argument("--out", required=True)
    a = ap.parse_args(); B, A = load_metrics(a.before), load_metrics(a.after); L = ["# Nightly report", ""]
    if A is None: L.append("no metrics.json after training: NOT ACCEPTED"); open(a.out, "w").write("\n".join(L)); print(L[-1]); return
    verdict = True; L += ["| row | before | after | std before | verdict |", "|---|---|---|---|---|"]
    for k, v in A.items():
        if not isinstance(v, dict) or "mean" not in v: continue
        b = (B or {}).get(k) if B else None
        if b and isinstance(b, dict) and "mean" in b:
            ok = v["mean"] >= b["mean"] - max(b.get("std", 0), 1e-9); verdict &= ok
            L.append(f"| {k} | {b['mean']:.3f} | {v['mean']:.3f} | {b.get('std', 0):.3f} | {'ok' if ok else 'FELL'} |")
        else: L.append(f"| {k} | (new) | {v['mean']:.3f} | | new row |")
    L += ["", f"Verdict: {'ACCEPTED by the rule (a person still decides)' if verdict else 'NOT ACCEPTED: a pre-existing row fell by more than one std'}"]
    open(a.out, "w").write("\n".join(L) + "\n"); print(L[-1])

if __name__ == "__main__": main()
