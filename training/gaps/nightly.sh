#!/usr/bin/env bash
# nightly.sh: the improvement loop (vision/ADDENDUM_qformalisation_2026-10-25.md, section 5), one night, one world. UNTESTED end to end:
# written before any journal exists; every step is a script that can be run and checked alone. Nothing here changes a model directly:
# the loop changes the legend, the generator's data and the symbolic rules, all versioned, and a person accepts the result in the morning.
#   training/gaps/nightly.sh <world> <journals dir> [--apply]
# Steps: 1 aggregate the journals into a gaps report; 2 propose (API) and validate mechanically; 3 (with --apply) apply the accepted
# proposals to a COPY of the world, regenerate, train on the DGX with the same seeds as the shipped model, evaluate on the frozen splits
# plus the gap examples; 4 the acceptance rule: no pre-existing row may fall by more than its seed std, and the gap rows must improve;
# 5 write runs/nightly_<date>/REPORT.md for the person; the promotion to app/model is a separate, manual command (training/export_app.py).
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"; cd "$REPO"
W="$1"; J="$2"; APPLY="${3:-}"; D="$(date +%Y-%m-%d)"; OUT="runs/nightly_${W}_$D"; mkdir -p "$OUT"
python3 training/gaps/aggregate.py "$J" --out "$OUT/report.json" --md "$OUT/report.md" | tee "$OUT/log.txt"
WORLD="$(mktemp -d)/$W"; python3 training/data/unpack.py "$W/n50000" "$(dirname "$WORLD")" | tee -a "$OUT/log.txt"
python3 training/gaps/propose.py --report "$OUT/report.json" --world "$WORLD" --out "$OUT/proposals" | tee -a "$OUT/log.txt"
[ "$APPLY" = "--apply" ] || { echo "no --apply: stopping after the proposals (review $OUT/proposals/)"; exit 0; }
python3 training/gaps/apply.py --world "$WORLD" --proposals "$OUT/proposals/proposals.jsonl" --out "$OUT/world" | tee -a "$OUT/log.txt"
tool/bin/sop check --legend "$OUT/world/legend.json" "$OUT"/world/examples/*.sop | tail -1 | tee -a "$OUT/log.txt"
tool/bin/sop train "$OUT/world" --D 1024 --seeds 5 --device cuda --n_eval 600 --no_ckpt --star_version 2 --calibrate_on_heldout_formulations --threshold_rule fit --run_dir "$OUT/train" 2>&1 | grep "\[eval\]\|\[done\]" | tee -a "$OUT/log.txt"
python3 training/gaps/accept.py --before "runs/$(cat runs/SHIPPED_$W 2>/dev/null || echo none)" --after "$OUT/train" --report "$OUT/report.json" --out "$OUT/REPORT.md" | tee -a "$OUT/log.txt"
echo "done: read $OUT/REPORT.md; to ship: python3 training/export_app.py --world $W --model $OUT/world/model --status demo --note 'nightly $D'"
