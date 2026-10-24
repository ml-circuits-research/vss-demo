"""calibrate.py: the COMMAND THRESHOLD of dictation mode (spec 14.3), set on calibration rows that include dictated prose, and the two rows
of Table 13 it serves: "dictated prose, command threshold" (content executed as a command <= 1% of utterances, on the prose set with
editing words) and "editing commands in dictation" (commands inserted as text <= 5%).

The decision is the one app/src/text/dictation.js makes on every utterance in dictation mode: the utterance is normalized by the textedit
normalizer, read by the textedit reader, and EXECUTED as a command only if the reading has status ok and m >= threshold, where m = the
minimum over every margin of the reading (structure, event, each role's identity and presence margins; on the SOP output: every
`_margin.*` and `_presence_margin.*` line of the sentence's wires). Otherwise it is inserted as text; when status is ok or abstain and
threshold - chip_band <= m < threshold it is inserted as text WITH the chip that offers to apply it as a command.

Rows (stated before any run):
- commands: the trained run's splits.json (the newest under <world>/runs unless --splits): calibration = 'calibration_heldout_formulations'
  (the half of the held-out formulations the trainer already uses for its presence thresholds), report = 'heldout_formulations' (the other
  half) and 'new_identities'. Without a splits.json the eval files are cut in two by a hash of the sentence.
- prose (NEGATIVES): every <world>/raw/prose_*_calibration.tsv (prose_synth.py; on the DGX also prose_download.py) for calibration and every
  prose_*_test.tsv for the report. Each sentence is normalized with normalize.py exactly as the editor normalizes a dictated utterance.
Rule: threshold = the smallest value t >= the model's tau such that the share of CALIBRATION prose rows that would be executed (status ok
and m >= t) is <= --target (default 0.005, half the criterion, a stated safety margin); chip_band = --chip_band (default 0.05 = tau).
Output: <model>/command_threshold.json (copied to app/model/textedit/ with the export) and a table on stdout; exit 0.
Run: python3 calibrate.py --world <world dir> [--model <dir>] [--target 0.005] [--chip_band 0.05] [--splits <splits.json>]"""
import argparse, glob, hashlib, json, os, subprocess, sys, tempfile
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
sys.path.insert(0, HERE)
from normalize import normalize

SOP = os.path.join(REPO, "tool", "bin", "sop")


def read_sentences(model, sentences):
    """formalize --json; returns per sentence {status, m, residual, event}"""
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
        f.write("\n".join(sentences) + "\n"); path = f.name
    try:
        out = subprocess.run([SOP, "formalize", "--model", model, "--json", path], capture_output=True, text=True, check=True).stdout
    finally: os.unlink(path)
    res = []
    for line in out.splitlines():
        o = json.loads(line)
        if "directives" in o: continue
        if "_text" in o: res.append({"status": o.get("_status"), "m": None, "residual": float(o.get("_residual", "nan")), "event": o.get("type")})
        cur = res[-1]
        for k, v in o.items():
            if (k.startswith("_margin.") or k.startswith("_presence_margin.")) and v not in ("none", ""):
                x = float(v); cur["m"] = x if cur["m"] is None else min(cur["m"], x)
    for r in res:
        if r["m"] is None: r["m"] = 0.0
    if len(res) != len(sentences): raise SystemExit(f"formalize returned {len(res)} readings for {len(sentences)} sentences")
    return res


def decide(r, t, band):
    if r["status"] == "ok" and r["m"] >= t: return "command"
    if r["status"] in ("ok", "abstain") and t - band <= r["m"] < t: return "text+chip"
    return "text"


def command_rows(world, splits_path):
    if splits_path is None:
        cands = sorted(glob.glob(os.path.join(world, "runs", "*", "splits.json")))
        splits_path = cands[-1] if cands else None
    if splits_path:
        tx = json.load(open(splits_path))["texts"]
        return {"calibration": tx.get("calibration_heldout_formulations", []), "heldout_formulations": tx.get("heldout_formulations", []),
                "new_identities": tx.get("new_identities", [])}, splits_path
    out = {"calibration": [], "heldout_formulations": [], "new_identities": []}
    for fn, name in (("eval_heldout_formulations.sop", "heldout_formulations"), ("eval_new_identities.sop", "new_identities")):
        for line in open(os.path.join(world, "examples", fn)):
            if line.startswith("_text="):
                s = line[6:].rstrip("\n"); cal = name == "heldout_formulations" and int(hashlib.sha256(s.encode()).hexdigest()[:8], 16) % 2 == 0
                out["calibration" if cal else name].append(s)
    return out, "hash split of the eval files (no splits.json)"


def prose_rows(world, half):
    rows = []
    for p in sorted(glob.glob(os.path.join(world, "raw", f"prose_*_{half}.tsv"))):
        src = os.path.basename(p).split("_")[1]
        for line in open(p, encoding="utf-8"):
            if line.startswith("#") or not line.strip(): continue
            parts = line.rstrip("\n").split("\t"); s = parts[0]; c = parts[1] if len(parts) > 1 else "?"
            toks, _ = normalize(s)
            if toks: rows.append((" ".join(toks), f"{src}:{c}"))
    return rows


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--world", required=True); ap.add_argument("--model"); ap.add_argument("--splits")
    ap.add_argument("--target", type=float, default=0.005); ap.add_argument("--chip_band", type=float, default=0.05); ap.add_argument("--out")
    a = ap.parse_args(); model = a.model or os.path.join(a.world, "model")
    cfg = json.load(open(os.path.join(model, "config.json"))); tau = float(cfg.get("tau", cfg.get("thresholds", {}).get("tau", 0.05)) or 0.05)
    cmds, src = command_rows(a.world, a.splits)
    pcal, ptest = prose_rows(a.world, "calibration"), prose_rows(a.world, "test")
    if not pcal: raise SystemExit(f"no prose calibration rows under {a.world}/raw (run prose_synth.py --out {a.world}/raw)")
    R = {k: read_sentences(model, v) for k, v in cmds.items() if v}
    RP = {"calibration": read_sentences(model, [s for s, _ in pcal]), "test": read_sentences(model, [s for s, _ in ptest]) if ptest else []}
    ok_m = sorted({r["m"] for r in RP["calibration"] if r["status"] == "ok"})
    executed = lambda rows, t: sum(1 for r in rows if decide(r, t, a.chip_band) == "command") / max(1, len(rows))
    t = tau
    for c in [tau] + [x + 1e-6 for x in ok_m if x >= tau]:
        t = c
        if executed(RP["calibration"], c) <= a.target: break
    else: t = (ok_m[-1] + 1e-6) if ok_m else tau
    def summary(rows, cats=None):
        d = {"n": len(rows)}
        for k in ("command", "text+chip", "text"): d[k] = sum(1 for r in rows if decide(r, t, a.chip_band) == k) / max(1, len(rows))
        if cats:
            per = {}
            for r, c in zip(rows, cats): per.setdefault(c, []).append(r)
            d["by_category"] = {c: {"n": len(v), "executed_as_command": sum(1 for r in v if decide(r, t, a.chip_band) == "command") / len(v)} for c, v in sorted(per.items())}
        return d
    rep = {"threshold": round(t, 6), "chip_band": a.chip_band, "tau": tau, "target_prose_executed_on_calibration": a.target,
           "rule": "smallest t >= tau with (calibration prose executed as command) <= target; executed = status ok and min margin >= t; chip = status ok|abstain and t - chip_band <= min margin < t",
           "margin": "minimum over every margin of the reading (_margin.* and _presence_margin.* of the sentence's wires)",
           "command_rows": src, "prose_files": sorted(os.path.basename(p) for p in glob.glob(os.path.join(a.world, "raw", "prose_*.tsv"))),
           "legend": cfg.get("legend_sha256") or cfg.get("legend"), "model": os.path.abspath(model),
           "calibration": {"prose": summary(RP["calibration"], [c for _, c in pcal]), **({"commands": summary(R["calibration"])} if "calibration" in R else {})},
           "report": {"prose (Table 13: content executed as a command, criterion <= 0.01)": summary(RP["test"], [c for _, c in ptest]),
                      **{f"commands {k} (Table 13: commands inserted as text = text + text+chip, criterion <= 0.05)": summary(v) for k, v in R.items() if k != "calibration"}}}
    out = a.out or os.path.join(model, "command_threshold.json"); json.dump(rep, open(out, "w"), indent=1)
    print(f"command threshold {t:.4f} (tau {tau}, chip band {a.chip_band}); written to {out}")
    for sec in ("calibration", "report"):
        for name, d in rep[sec].items():
            print(f"  [{sec}] {name}: n {d['n']}, executed {d['command']:.3f}, text+chip {d['text+chip']:.3f}, text {d['text']:.3f}")
            for c, e in d.get("by_category", {}).items(): print(f"      {c}: n {e['n']}, executed as command {e['executed_as_command']:.3f}")
    print("checklist: [x] threshold set on calibration rows only (25) [x] prose negatives in calibration [x] report rows disjoint from calibration "
          "[x] rule stated before the run [ ] >= 3 seeds (one model per call; the DGX script calls it per seed)")


if __name__ == "__main__":
    main()
