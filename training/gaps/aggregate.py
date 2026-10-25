"""aggregate.py: journals sent by the editor (app/src/gaps.js, format vss-gaps-1) -> a gaps report, the input of the proposal step of the
improvement loop (vision/ADDENDUM_qformalisation_2026-10-25.md, section 5). UNTESTED on real journals: written before any journal exists.

A gap is a recurring reason a reading fell short, grouped so that a proposer (a large model, or a person) sees ten real examples per gap:
  unplaced   a word with no kind, grouped by the word and its left/right neighbours (a word that appears in several contexts with no kind
             is a missing word of the lexicon or a missing role; the context says which)
  unsure     a role under tau, grouped by the event and the role
  status     readings with status no-sense / unknown-event, grouped by their first content word (an unknown verb = a missing event)
  marked     readings the person marked "this should have worked", with their notes, grouped by status
  reformulated  pairs (reading, the next reading within a minute): what the person changed is the paraphrase the generator lacks
Every group carries its count, the share of all readings, and up to --examples masked inputs. Labels are already masked by the client.
Usage: python3 training/gaps/aggregate.py <journal.json or directory of journals> --out report.json [--md report.md] [--examples 10]"""
import argparse, collections, json, os, sys

def load(path):
    files = [path] if os.path.isfile(path) else [os.path.join(path, f) for f in sorted(os.listdir(path)) if f.endswith(".json")]
    out = []
    for f in files:
        try:
            j = json.load(open(f, encoding="utf-8"))
            if j.get("format") != "vss-gaps-1": print(f"skip {f}: not a vss-gaps-1 journal", file=sys.stderr); continue
            for e in j.get("entries", []): e["_journal"] = os.path.basename(f); out.append(e)
        except Exception as ex: print(f"skip {f}: {ex}", file=sys.stderr)
    return out

def aggregate(entries, n_examples=10):
    N = max(1, len(entries)); groups = {"unplaced": collections.defaultdict(list), "unsure": collections.defaultdict(list), "status": collections.defaultdict(list),
                                         "marked": collections.defaultdict(list), "reformulated": []}
    for i, e in enumerate(entries):
        toks = (e.get("input") or "").split()
        for w in e.get("unplaced") or []:
            if w in toks:
                k = toks.index(w); ctx = f"{toks[k-1] if k else '^'} _ {toks[k+1] if k+1 < len(toks) else '$'}"
                groups["unplaced"][(w, ctx)].append(e)
        for r in e.get("lowRoles") or []: groups["unsure"][(e.get("event") or "?", r)].append(e)
        if e.get("status") in ("no-sense", "unknown-event"): groups["status"][(e["status"], toks[0] if toks else "?")].append(e)
        if e.get("outcome") == "marked": groups["marked"][e.get("status") or "?"].append(e)
        if e.get("outcome") == "reformulated" and i + 1 < len(entries) and entries[i+1].get("_journal") == e.get("_journal"):
            groups["reformulated"].append((e, entries[i+1]))
    def rows(d, keyname):
        out = []
        for k, es in sorted(d.items(), key=lambda kv: -len(kv[1])):
            out.append({keyname: list(k) if isinstance(k, tuple) else k, "count": len(es), "share": round(len(es) / N, 4),
                        "examples": [x.get("input") for x in es[:n_examples]], "notes": [x.get("note") for x in es if x.get("note")][:n_examples]})
        return out
    report = {"format": "vss-gaps-report-1", "readings": len(entries), "by_status": dict(collections.Counter(e.get("status") for e in entries)),
              "unplaced": rows(groups["unplaced"], "word_context"), "unsure": rows(groups["unsure"], "event_role"), "status": rows(groups["status"], "status_first_word"),
              "marked": rows(groups["marked"], "status"),
              "reformulated": [{"before": a.get("input"), "after": b.get("input"), "before_status": a.get("status"), "after_status": b.get("status")} for a, b in groups["reformulated"][:5 * n_examples]]}
    return report

def to_md(r):
    L = [f"# Gaps report ({r['readings']} readings; by status {r['by_status']})", ""]
    for sec, key in (("unplaced", "word_context"), ("unsure", "event_role"), ("status", "status_first_word"), ("marked", "status")):
        L += [f"## {sec}", "", "| group | count | share | examples |", "|---|---|---|---|"]
        for g in r[sec][:30]: L.append(f"| {' / '.join(map(str, g[key])) if isinstance(g[key], list) else g[key]} | {g['count']} | {g['share']} | {'; '.join(g['examples'][:3])} |")
        L.append("")
    L += ["## reformulated (before -> after)", ""] + [f"- {x['before']} ({x['before_status']}) -> {x['after']} ({x['after_status']})" for x in r["reformulated"][:30]]
    return "\n".join(L) + "\n"

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("path"); ap.add_argument("--out", required=True); ap.add_argument("--md"); ap.add_argument("--examples", type=int, default=10)
    a = ap.parse_args(); es = load(a.path); r = aggregate(es, a.examples)
    json.dump(r, open(a.out, "w"), indent=1); print(f"{len(es)} readings -> {a.out}: {len(r['unplaced'])} unplaced groups, {len(r['unsure'])} unsure, {len(r['status'])} status, {len(r['marked'])} marked, {len(r['reformulated'])} reformulations")
    if a.md: open(a.md, "w").write(to_md(r))
