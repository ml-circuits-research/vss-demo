"""evaluate.py: the Table 13 rows "Formulas" scored on WHOLE trees, which the tool's FULL does not do (frame_of reads the top-level event
and shows a nested expression wire only as ["wire", <operator>]).

  python3 evaluate.py trees <gold.sop> <reading.sop> [--tau 0.05]
      gold.sop = an examples/eval_*.sop file; reading.sop = `sop formalize` of its _text lines, in the same order (one top-level wire per
      sentence). Per sentence: the set of trees on the root role (one tree, or the alternatives of root=$a | $b) and, for commands, the
      frame with its value tree. Reports: tree exactly right; for ambiguous gold, "reported as ambiguous" (two or more readings) and
      "exactly the gold readings"; for unambiguous gold, false "both"; confident-wrong and coverage at tau (confident = no wire with
      _status abstain / no-sense / unknown-event and every _margin >= tau).
  python3 evaluate.py edits <world>/raw/edit_suite.jsonl <reading.sop>
      reading.sop = `sop formalize` of raw/edit_suite.txt. Each read frame is executed on the suite's formula by the app's executor
      (app/src/formula/commands.js) and the formula after is compared with the expected one. Criterion (Table 13): 100%.
      With reading.sop = raw/edit_suite.sop (the gold wires) the chain itself is checked: 100% by construction.
Exit 0 when every sentence could be scored; the numbers are printed, not judged here (the criteria are in Table 13).
"""
import argparse, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from generate import TOOL, canon, run_batch, LEAVES
sys.path.insert(0, TOOL)
from sop import soplang

WRAPPER = {"parentheses": "parentheses", "brackets": "parentheses", "parenthesis": "parentheses", "fraction": "fraction", "root": "root", "absolute": "abs", "abs": "abs"}
POSITION = {"beginning": "start", "start": "start", "end": "end", "after": "after", "before": "before"}
OP_WORDS = {"plus", "minus", "times", "over", "equals"}
LEAF_CONST = {"pi", "e", "infinity"}


def leaf(v):
    if v.isdigit(): return {"op": "num", "v": v}
    return {"op": "const" if v in LEAF_CONST else "var", "v": v}


def tree_of(atom, by, seen=()):
    if atom.kind == "word": return leaf(atom.text)
    if atom.kind == "unknown": return {"op": "hole"}
    w = by.get(atom.text)
    if w is None or atom.text in seen: return {"op": "bad-ref"}
    n = {"op": w.type}
    for l in w.lines:
        if l.key.startswith("_"): continue
        if l.key == "function": n["function"] = l.text; continue
        n[l.key] = tree_of(l.atoms[0], by, seen + (atom.text,)) if l.atoms else {"op": "empty"}
    return n


def reading_of(top, by):
    """('formula', sorted canonical trees) or ('command', canonical frame) of one top-level wire"""
    if top.type == "expr":
        l = top.get("root")
        if l is None: return ("formula", [])
        return ("formula", sorted({canon(tree_of(a, by)) for a in l.atoms}))
    f = {"event": top.type, "target": None, "owner": None, "value": None, "word": None, "wrapper": None, "joiner": None, "position": None, "direction": None}
    t = top.get("target")
    if t is not None and t.atoms and t.atoms[0].kind == "ref" and t.atoms[0].text in by:
        e = by[t.atoms[0].text]; f["target"] = {"head": e.value("head"), "attr": e.value("attr"), "det": e.value("det")}
    for k in ("owner", "joiner", "direction"): f[k] = top.value(k)
    if top.value("wrapper") is not None: f["wrapper"] = WRAPPER.get(top.value("wrapper"), top.value("wrapper"))
    if top.value("position") is not None: f["position"] = POSITION.get(top.value("position"), top.value("position"))
    v = top.get("value")
    if v is not None and v.atoms:
        if v.atoms[0].kind == "word" and v.atoms[0].text in OP_WORDS: f["word"] = v.atoms[0].text
        else: f["value"] = tree_of(v.atoms[0], by)
    return ("command", f)


def confident(top, by, tau):
    stack, seen = [top.id], set()
    while stack:
        x = stack.pop()
        if x in seen or x not in by: continue
        seen.add(x); w = by[x]
        if w.value("_status") in ("abstain", "no-sense", "unknown-event"): return False
        for l in w.lines:
            if l.key == "_margin" or l.key.startswith("_margin."):
                try:
                    if float(l.text) < tau: return False
                except ValueError: pass
        stack += w.refs()
    return True


def tops(path):
    doc = soplang.load(path); by = doc.by_id(); return doc.top_level(), by


def cmd_trees(a):
    g_tops, g_by = tops(a.gold); r_tops, r_by = tops(a.reading)
    if len(g_tops) != len(r_tops): sys.exit(f"{len(g_tops)} gold sentences, {len(r_tops)} read: the reading must be the formalization of the gold _text lines, in order")
    n = exact = conf = conf_wrong = amb_n = amb_reported = amb_exact = una_n = false_both = 0
    for g, r in zip(g_tops, r_tops):
        if (g.value("_text") or "").strip() != (r.value("_text") or "").strip(): sys.exit(f"sentence mismatch: {g.value('_text')!r} vs {r.value('_text')!r}")
        kg, vg = reading_of(g, g_by); kr, vr = reading_of(r, r_by)
        ok = kg == kr and (canon(vg) == canon(vr) if kg == "command" else vg == vr)
        n += 1; exact += ok
        c = confident(r, r_by, a.tau); conf += c; conf_wrong += c and not ok
        if kg == "formula":
            if len(vg) > 1:
                amb_n += 1; amb_reported += kr == "formula" and len(vr) > 1; amb_exact += ok
            else:
                una_n += 1; false_both += kr == "formula" and len(vr) > 1
    pct = lambda x, y: f"{x / y:.3f}" if y else "n/a"
    print(f"sentences {n}; tree exactly right {pct(exact, n)}; coverage at tau={a.tau} {pct(conf, n)}; confident-wrong {pct(conf_wrong, n)} (of all), "
          f"{pct(conf_wrong, conf)} (of confident)")
    print(f"ambiguous gold {amb_n}: reported as ambiguous {pct(amb_reported, amb_n)}, exactly the gold readings {pct(amb_exact, amb_n)}; "
          f"unambiguous formulas {una_n}: false 'both' {pct(false_both, una_n)}")


def cmd_edits(a):
    suite = [json.loads(l) for l in open(a.suite) if l.strip()]
    r_tops, r_by = tops(a.reading)
    if len(r_tops) != len(suite): sys.exit(f"{len(suite)} suite commands, {len(r_tops)} read")
    reqs, frames = [], []
    for i, (s, r) in enumerate(zip(suite, r_tops)):
        k, f = reading_of(r, r_by)
        frames.append(f if k == "command" else None)
        if k == "command": reqs.append({"id": str(i), "kind": "edit", "context": s["context"], "frame": f})
    res = run_batch(reqs) if reqs else {}
    ok, bad = 0, []
    for i, s in enumerate(suite):
        r = res.get(str(i))
        good = r is not None and r["status"] == "ok" and canon(r["after"]) == canon(s["expected"])
        ok += good
        if not good and len(bad) < 5: bad.append(f"{s['command']!r} on {s['context_latex']}: got {r['latex_after'] if r else 'not a command'}, want {s['expected_latex']}")
    print(f"edit suite: {ok}/{len(suite)} correct ({ok / max(1, len(suite)):.3f})" + ("".join("\n  " + b for b in bad)))


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest="cmd", required=True)
    t = sp.add_parser("trees"); t.add_argument("gold"); t.add_argument("reading"); t.add_argument("--tau", type=float, default=0.05)
    e = sp.add_parser("edits"); e.add_argument("suite"); e.add_argument("reading")
    a = ap.parse_args(); (cmd_trees if a.cmd == "trees" else cmd_edits)(a)
