#!/usr/bin/env bash
# run_all.sh — every parity test of app/ against Python: portable stars, then for each smoke model an 8-bit and a 32-bit export with the parity test against
# the Python reader on the dequantized phases; on the star_version 2 model also the sentence-candidates mode.
# Models (CPU smoke models, D 256): tool/worlds/reference/model and tool/worlds/commands/model (bash tool/test_sop.sh, then
#   tool/bin/sop train tool/worlds/commands --D 256 --epochs 3 --n_eval 100), and tool/worlds/reference/model_v2
#   (tool/bin/sop train tool/worlds/reference --D 256 --epochs 3 --n_eval 100 --star_version 2 --out tool/worlds/reference/model_v2).
# Usage: bash training/parity/run_all.sh [out dir]
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"; cd "$ROOT"
OUT="${1:-training/parity/out}"; mkdir -p "$OUT"
python3 training/parity/make_stars_golden.py >/dev/null && node app/tests/stars_test.mjs
python3 training/parity/make_fpe_golden.py --out "$OUT/golden-fpe.json" >/dev/null && node app/tests/fpe_parity.mjs "$OUT/golden-fpe.json"   # the scene readout (positions as addresses) against fpe.py
run() {   # name model_dir world_dir bits [--sentence-candidates]
  local name=$1 model=$2 world=$3 bits=$4 sc=${5:-}
  tool/bin/sop export-web --model "$model" --out "$OUT/$name-$bits" --bits "$bits" | sed -n 1p
  python3 training/parity/make_golden.py --model "$model" --world "$world" --out "$OUT/golden-$name-$bits${sc:+-sc}.json" --dequantize-from "$OUT/$name-$bits" $sc >/dev/null
  node app/tests/parity.mjs "$OUT/$name-$bits" "$OUT/golden-$name-$bits${sc:+-sc}.json" $sc
}
for m in reference commands; do
  [ -f "tool/worlds/$m/model/config.json" ] || { echo "skip $m: no model (see the header)"; continue; }
  for b in 8 32; do run "$m" "tool/worlds/$m/model" "tool/worlds/$m" "$b"; done
done
if [ -f tool/worlds/reference/model_v2/config.json ]; then
  for b in 8 32; do run reference_v2 tool/worlds/reference/model_v2 tool/worlds/reference "$b"; done
  run reference_v2 tool/worlds/reference/model_v2 tool/worlds/reference 8 --sentence-candidates
  # words OUTSIDE the catalog given a kind by a value pattern (a test copy of the model): read only in sentence-candidates mode
  python3 training/parity/make_newword_model.py tool/worlds/reference/model_v2 "$OUT/newword_model" P O
  tool/bin/sop export-web --model "$OUT/newword_model" --out "$OUT/newword-8" | sed -n 1p
  for sc in "" "--sentence-candidates"; do
    python3 training/parity/make_golden.py --model "$OUT/newword_model" --sentences "$OUT/newword_model/newword_sentences.txt" --out "$OUT/golden-newword${sc:+-sc}.json" --dequantize-from "$OUT/newword-8" $sc >/dev/null
    node app/tests/parity.mjs "$OUT/newword-8" "$OUT/golden-newword${sc:+-sc}.json" $sc
  done
  python3 -c "import json,sys; g=json.load(open('$OUT/golden-newword-sc.json'))['items']; ok=sum(x['frame']['roles'].get('agent',[0,0])[1].startswith('q') for x in g[:2]); print(f'new words read as agents in sentence-candidates mode: {ok}/2'); sys.exit(0 if ok==2 else 1)"
  # without sentence candidates a word outside the catalog is a candidate of no role: such a role is not given (responses D5), never a catalog word
  python3 -c "import json,re,sys; g=json.load(open('$OUT/golden-newword.json'))['items']; bad=[x['text'] for x in g if any(f and re.fullmatch('[qr][0-9]+', str(f[1])) or f is None or f[1] is None for f in x['frame']['roles'].values())]; print(f'new words given no role in catalog mode: {len(g)-len(bad)}/{len(g)}'); sys.exit(0 if not bad else 1)"
  # per-event role sets (Q12 / D19): a role the event does not take is not read; a required role not given is a presence query
  python3 training/parity/make_eventroles_model.py tool/worlds/reference/model_v2 "$OUT/eventroles_model"
  tool/bin/sop export-web --model "$OUT/eventroles_model" --out "$OUT/eventroles-8" | sed -n 1p
  for sc in "" "--sentence-candidates"; do
    python3 training/parity/make_golden.py --model "$OUT/eventroles_model" --sentences "$OUT/eventroles_model/eventroles_sentences.txt" --out "$OUT/golden-eventroles${sc:+-sc}.json" --dequantize-from "$OUT/eventroles-8" $sc >/dev/null
    node app/tests/parity.mjs "$OUT/eventroles-8" "$OUT/golden-eventroles${sc:+-sc}.json" $sc
  done
  python3 training/parity/make_eventroles_model.py --check "$OUT/golden-eventroles.json"
fi
node app/tests/bench.mjs "$OUT/reference-8" "$OUT/golden-reference-8.json" || true
echo "run_all.sh: PASS"
