#!/usr/bin/env bash
# The textedit world on the DGX (vision/VSS_Diagram_Editor_Specification.md, section 14; Table 13 rows "editing commands in dictation",
# "dictated prose, command threshold"; the "text target resolution" row is the node suite app/tests/text_targets.mjs, no GPU).
# PREPARED, NOT RUN. Start it when the GPU is free:   training/worlds/textedit/gpu_textedit.sh [--wait] [--sizes "1000 5000 20000 50000"] [--ship N]
# Steps: (1) the data-size curve: generate at each size, sop check, sop train 5 seeds D 1024 star_version 2 (FULL on seen / held-out
# formulations / new identities, confident-wrong and coverage at tau); (2) the prose negatives: prose_synth.py (ours) and prose_download.py
# (public domain; the first run pins the sha256 with --pin and the lock file is committed afterwards); (3) at the shipped size, five
# single-seed models (seeds 0-4) each calibrated by calibrate.py (command threshold on calibration rows with prose; report rows: prose
# executed as a command, commands inserted as text); (4) sop export-web of seed 0's model to app/model/textedit/ with normalize.json and
# command_threshold.json.
# Criteria written before the run (spec Table 13): seen formulations FULL >= 0.98; held-out formulations: confident-wrong < 2% at
# coverage > 80%, FULL reported (as for the diagram world); commands inserted as text <= 5%; content executed as a command <= 1% of the
# prose utterances (prose set with editing words). The shipped size = the smallest after which the held-out formulation FULL stops
# improving within seed variance (spec 4.5); --ship overrides (default: the largest size).
# Lock and guards as training/gpu_diagram_step3.sh (logs/.run.lock: one run at a time; a clean code tree; 40 GB free).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; REPO="$(cd "$HERE/../../.." && pwd)"; SOP="$REPO/tool/bin/sop"
PY="${SOP_PYTHON:-}"; for c in "$REPO/.venv/bin/python3"; do [ -z "$PY" ] && [ -x "$c" ] && PY="$c"; done; PY="${PY:-python3}"
SIZES="1000 5000 20000 50000"; WAIT=0; SHIP=""; EXPORT=1   # --no_export: stop before step (4) (the export waits for a parity question)
while [ $# -gt 0 ]; do case "$1" in --wait) WAIT=1;; --sizes) SIZES="$2"; shift;; --ship) SHIP="$2"; shift;; --no_export) EXPORT=0;; esac; shift; done
[ -n "$SHIP" ] || SHIP="$(echo $SIZES | awk '{print $NF}')"
cd "$REPO"
if [ -n "$(git status --porcelain 2>/dev/null | grep -v "logs/" | grep -v "^?? runs/" | grep -v "\.md$" || true)" ]; then
  echo "uncommitted code changes: commit first, so that the run folder corresponds to a commit"; exit 1; fi
COMMIT=$(git rev-parse --short HEAD); OUT="$REPO/runs/textedit_$COMMIT"
LOCK="$REPO/logs/.run.lock.textedit"; mkdir -p "$(dirname "$LOCK")"   # per world, as training/gpu_diagram_step3.sh
held() { [ -f "$LOCK" ] && kill -0 "$(cat "$LOCK" 2>/dev/null)" 2>/dev/null; }
if held; then
  if [ $WAIT = 1 ]; then while held; do sleep 30; done
  else echo "the GPU lock is held (pid $(cat "$LOCK"), $LOCK): one run at a time; rerun with --wait or later"; exit 1; fi
fi
avail_gb=$(awk '/MemAvailable/ {printf "%d", $2/1024/1024}' /proc/meminfo)
[ "$avail_gb" -ge 40 ] || { echo "only ${avail_gb} GB available; refusing to start (need 40, as run.sh)"; exit 1; }
echo $$ > "$LOCK"; trap 'rm -f "$LOCK"' EXIT
export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True VSA_MEM_FRACTION=${VSA_MEM_FRACTION:-0.5} VSA_MIN_AVAILABLE_GB=${VSA_MIN_AVAILABLE_GB:-16} VSA_MAX_HOURS=${VSA_MAX_HOURS:-6}
mkdir -p "$OUT"; WORK="$(mktemp -d "${TMPDIR:-/tmp}/textedit_XXXX")"; LOG="$OUT/textedit.log"; CACHE="${PROSE_CACHE:-$HOME/.cache/vss-prose}"
echo "# textedit, commit $COMMIT, $(date -Iseconds); worlds in $WORK; runs in $OUT; sizes $SIZES; shipped size $SHIP" | tee "$LOG"
COMMON="--D 1024 --device cuda --n_eval 600 --log_every 500 --no_ckpt --star_version 2 --calibrate_on_heldout_formulations --threshold_rule fit --activate auto"   # routes selected from the world's nature (TODO 2.12); decoder contract is the default
FILTER='\[eval\]\|\[done\]\|end:\|numpy reader\|\[splits\]\|\[schema\]\|\[activate\]'
# (1) the data-size curve, 5 seeds per size
for n in $SIZES; do
  W="$WORK/$n/textedit"
  if [ -d "$HERE/../../data/textedit/n$n" ]; then "$PY" "$HERE/../../data/unpack.py" "textedit/n$n" "$WORK/$n" | tee -a "$LOG"   # frozen data, sha256 checked
  else "$PY" "$HERE/generate.py" --out "$W" --n "$n" --n_eval 400 --seed 0 | tee -a "$LOG"; fi
  "$SOP" check --legend "$W/legend.json" "$W"/examples/*.sop | tail -1 | tee -a "$LOG"
  echo "## size $n: sop train $W $COMMON --seeds 5" | tee -a "$LOG"
  "$SOP" train "$W" $COMMON --seeds 5 --run_dir "$OUT/$n" 2>&1 | grep "$FILTER" | tee -a "$LOG"
  cp "$W/legend.json" "$W/kinds.tsv" "$OUT/$n/"
done
cp "$HERE/COVERAGE.md" "$OUT/COVERAGE.md"
# (2) prose negatives into the shipped world's raw/ (never committed: the world folder is under $WORK)
W="$WORK/$SHIP/textedit"
"$PY" "$HERE/prose_synth.py" --out "$W/raw" --n 4000 --seed 0 | tee -a "$LOG"
if [ -f "$HERE/prose_sources.lock.json" ]; then "$PY" "$HERE/prose_download.py" --cache "$CACHE" --out "$W/raw" --n 4000 --seed 0 | tee -a "$LOG"
else "$PY" "$HERE/prose_download.py" --cache "$CACHE" --out "$W/raw" --n 4000 --seed 0 --pin | tee -a "$LOG"
     echo "PINNED: commit training/worlds/textedit/prose_sources.lock.json (hashes only)" | tee -a "$LOG"; fi
# (3) five single-seed models at the shipped size, each calibrated (Table 13: prose executed as a command; commands inserted as text)
for s in 0 1 2 3 4; do
  echo "## shipped size $SHIP, seed $s: sop train $W $COMMON --seed $s --seeds 1 --out $W/model_seed$s" | tee -a "$LOG"
  "$SOP" train "$W" $COMMON --seed "$s" --seeds 1 --out "$W/model_seed$s" --run_dir "$OUT/ship_seed$s" 2>&1 | grep "$FILTER" | tee -a "$LOG"
  "$PY" "$HERE/calibrate.py" --world "$W" --model "$W/model_seed$s" --splits "$OUT/ship_seed$s/splits.json" --out "$OUT/ship_seed$s/command_threshold.json" | tee -a "$LOG"
done
"$PY" - "$OUT" <<'EOF' | tee "$OUT/dictation_table.md" | tee -a "$LOG"
import json, sys, glob, statistics as st
out = sys.argv[1]; rs = [json.load(open(p)) for p in sorted(glob.glob(f"{out}/ship_seed*/command_threshold.json"))]
def ms(xs): return f"{st.mean(xs):.4f} +- {st.pstdev(xs):.4f}" if len(xs) > 1 else f"{xs[0]:.4f}"
print(f"# textedit dictation rows (Table 13), {len(rs)} seeds\n\n| row | measure | value |\n|---|---|---|")
print(f"| command threshold | fitted on calibration rows | {ms([r['threshold'] for r in rs])} |")
for k in rs[0]["report"]:
    if k.startswith("prose"): print(f"| dictated prose, command threshold | content executed as a command (criterion <= 0.01) | {ms([r['report'][k]['command'] for r in rs])} |")
    else: print(f"| editing commands in dictation ({k.split()[1]}) | commands inserted as text (criterion <= 0.05) | {ms([r['report'][k]['text'] + r['report'][k]['text+chip'] for r in rs])} |")
for c in sorted(rs[0]["report"][next(k for k in rs[0]['report'] if k.startswith('prose'))].get("by_category", {})):
    k = next(k for k in rs[0]['report'] if k.startswith('prose'))
    print(f"| prose by category: {c} | executed as a command | {ms([r['report'][k]['by_category'][c]['executed_as_command'] for r in rs if c in r['report'][k]['by_category']])} |")
EOF
# (4) export for the browser (seed 0's model) with the normalizer table and the command threshold
cp -r "$W/model_seed0" "$OUT/model_$SHIP"
if [ $EXPORT = 0 ]; then echo "done (no export): commit runs/textedit_$COMMIT (and the prose lock file if it was pinned); the prose files stay in $WORK (never commit)" | tee -a "$LOG"; exit 0; fi
mkdir -p "$REPO/app/model/textedit"
"$SOP" export-web --model "$W/model_seed0" --out "$REPO/app/model/textedit" | tee -a "$LOG"
cp "$HERE/normalize.json" "$REPO/app/model/textedit/normalize.json"; cp "$OUT/ship_seed0/command_threshold.json" "$REPO/app/model/textedit/command_threshold.json"
echo "done: commit runs/textedit_$COMMIT and app/model/textedit (and the prose lock file if it was pinned); the prose files stay in $WORK (never commit)" | tee -a "$LOG"
