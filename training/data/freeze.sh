#!/usr/bin/env bash
# freeze.sh: regenerate the frozen datasets of training/data/ from our generators (seed 0) and rewrite MANIFEST.json.
# Run only after a deliberate change of a generator, and say why in the commit message. Usage: bash training/data/freeze.sh [world ...]
# diagram_ro and diagram_multi are both written by training/worlds/diagram_ro/generate.py (diagram_multi with --languages ro,en,mix).
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"; cd "$REPO"
declare -A SIZES=( [diagram]="1000 5000 20000 50000" [diagram_ro]="1000 5000 20000 50000" [diagram_multi]="1000 5000 20000 50000"
                   [textedit]="1000 5000 20000 50000" [matheditor]="5000 20000 50000" [animation]="1000 5000 20000 50000" )
declare -A GEN=( [diagram_ro]="training/worlds/diagram_ro/generate.py" [diagram_multi]="training/worlds/diagram_ro/generate.py" )
declare -A ARGS=( [diagram_multi]="--languages ro,en,mix" )
declare -A COV=( [diagram_ro]="training/worlds/diagram_ro/COVERAGE.md" [diagram_multi]="training/worlds/diagram_ro/COVERAGE_multi.md" )
WORLDS="${*:-diagram diagram_ro diagram_multi textedit matheditor animation}"
for w in $WORLDS; do
  gen="${GEN[$w]:-training/worlds/$w/generate.py}"; args="${ARGS[$w]:-}"; cov="${COV[$w]:-training/worlds/$w/COVERAGE.md}"
  [ -f "$cov" ] && cp "$cov" "/tmp/.cov_$w"
  for n in ${SIZES[$w]}; do
    d="training/data/$w/n$n"; rm -rf "$d"; mkdir -p "$d"
    python3 "$gen" --out "$d/$w" --n "$n" --n_eval 400 --seed 0 $args | tail -1
    rm -rf "$d/$w"/{model,runs,versions,requests,audit,status.json}
    find "$d/$w" -type f \( -name "*.sop" -o -name "*.txt" -o -name "*.jsonl" \) -exec gzip -9n {} \;
    [ -f "$cov" ] && cp "$cov" "$d/COVERAGE.md"
  done
  [ -f "/tmp/.cov_$w" ] && cp "/tmp/.cov_$w" "$cov"
done
python3 training/data/unpack.py --write-manifest
