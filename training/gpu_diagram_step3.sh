#!/usr/bin/env bash
# Step 3 of the VSS Diagram Editor (vision/VSS_Diagram_Editor_Specification.md, section 23): the diagram world at Level 1 trained on
# templates, five seeds, D = 1024, the portable stars (star_version 2), at four training sizes (the data-size curve of spec 4.5).
# PREPARED, NOT RUN — start it on the DGX when the GPU is free:   training/gpu_diagram_step3.sh [--wait] [--sizes "1000 5000 20000 50000"]
# Criteria written before the run (spec Table 13): seen formulations FULL >= 0.98; held-out formulations: confident-wrong < 2% at
# coverage > 80%, FULL reported; new labels (label role) >= 0.99; value slots (amount, unit, fraction, anchor) >= 0.98; negated attributes
# and prohibitions (scope) >= 0.97. The shipped size = the smallest after which the held-out formulation number stops improving within
# seed variance (spec 4.5).
# Lock and guards as the paper repository's tool/tests/gpu_round6.sh, with the lock in THIS repository (logs/.run.lock): one run at a time,
# a clean code tree, 40 GB free. Output (commit afterwards): runs/diagram_step3_<commit>/<size>/{train.log, metrics.json, splits.json,
# command.txt, REPORT.md, config.json, legend.json}, step3.log; the 50k model folder is copied to runs/.../model_50000 for step 5 (export).
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; TOOL="$REPO/tool"; SOP="$TOOL/bin/sop"
PY="${SOP_PYTHON:-}"; for c in "$REPO/.venv/bin/python3"; do [ -z "$PY" ] && [ -x "$c" ] && PY="$c"; done; PY="${PY:-python3}"
SIZES="1000 5000 20000 50000"; WAIT=0
while [ $# -gt 0 ]; do case "$1" in --wait) WAIT=1;; --sizes) SIZES="$2"; shift;; esac; shift; done
cd "$REPO"
if [ -n "$(git status --porcelain 2>/dev/null | grep -v "logs/" | grep -v "^?? runs/" | grep -v "\.md$" || true)" ]; then
  echo "uncommitted code changes: commit first, so that the run folder corresponds to a commit"; exit 1; fi
COMMIT=$(git rev-parse --short HEAD); OUT="$REPO/runs/diagram_step3_$COMMIT"
LOCK="$REPO/logs/.run.lock"; mkdir -p "$(dirname "$LOCK")"
held() { [ -f "$LOCK" ] && kill -0 "$(cat "$LOCK" 2>/dev/null)" 2>/dev/null; }
if held; then
  if [ $WAIT = 1 ]; then while held; do sleep 30; done
  else echo "the GPU lock is held (pid $(cat "$LOCK"), $LOCK): one run at a time; rerun with --wait or later"; exit 1; fi
fi
avail_gb=$(awk '/MemAvailable/ {printf "%d", $2/1024/1024}' /proc/meminfo)
[ "$avail_gb" -ge 40 ] || { echo "only ${avail_gb} GB available; refusing to start (need 40, as run.sh)"; exit 1; }
echo $$ > "$LOCK"; trap 'rm -f "$LOCK"' EXIT
export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True VSA_MEM_FRACTION=${VSA_MEM_FRACTION:-0.5} VSA_MIN_AVAILABLE_GB=${VSA_MIN_AVAILABLE_GB:-16} VSA_MAX_HOURS=${VSA_MAX_HOURS:-6}
mkdir -p "$OUT"; WORK="$(mktemp -d "${TMPDIR:-/tmp}/diagram_step3_XXXX")"; LOG="$OUT/step3.log"
echo "# diagram step 3, commit $COMMIT, $(date -Iseconds); worlds in $WORK; runs in $OUT; sizes $SIZES" | tee "$LOG"
COMMON="--D 1024 --seeds 5 --device cuda --n_eval 600 --log_every 500 --no_ckpt --star_version 2 --calibrate_on_heldout_formulations --threshold_rule fit --activate auto"   # routes selected from the world's nature (tool/sop/activate.py); decoder contract is the default
for n in $SIZES; do
  mkdir -p "$WORK/$n"
  if [ -d "$REPO/training/data/diagram/n$n" ]; then "$PY" "$REPO/training/data/unpack.py" "diagram/n$n" "$WORK/$n" | tee -a "$LOG"   # the frozen data (sha256 checked)
  else "$PY" "$REPO/training/worlds/diagram/generate.py" --out "$WORK/$n/diagram" --n "$n" --n_eval 400 --seed 0 | tee -a "$LOG"; fi
  "$SOP" check --legend "$WORK/$n/diagram/legend.json" "$WORK/$n/diagram"/examples/*.sop | tail -1 | tee -a "$LOG"
  echo "## size $n: sop train $WORK/$n/diagram $COMMON" | tee -a "$LOG"
  "$SOP" train "$WORK/$n/diagram" $COMMON --run_dir "$OUT/$n" 2>&1 | grep "\[eval\]\|\[done\]\|end:\|numpy reader\|\[splits\]\|\[schema\]\|\[activate\]" | tee -a "$LOG"
  cp "$WORK/$n/diagram/legend.json" "$WORK/$n/diagram/kinds.tsv" "$OUT/$n/"
  [ "$n" = "$(echo $SIZES | awk '{print $NF}')" ] && cp -r "$WORK/$n/diagram/model" "$OUT/model_$n"
done
for n in $SIZES; do [ -f "$REPO/training/data/diagram/n$n/COVERAGE.md" ] && cp "$REPO/training/data/diagram/n$n/COVERAGE.md" "$OUT/COVERAGE_n$n.md"; done
echo "done: commit $OUT (git add runs/diagram_step3_$COMMIT); then step 5 (export and parity) on runs/diagram_step3_$COMMIT/model_<largest>" | tee -a "$LOG"
