#!/usr/bin/env bash
# run_all.sh: every node test of the application (no browser, no Python model needed). Exit 1 if any fails.
# The reader's parity test against Python is in training/parity/run_all.sh.
cd "$(dirname "$0")/.." || exit 1
fail=0
for t in tests/*.mjs; do
  case "$t" in tests/parity.mjs|tests/bench.mjs|tests/correct_test.mjs|tests/normalize_test.mjs) continue;; esac   # these need arguments
  out=$(node "$t" 2>&1); rc=$?
  printf '%-28s %s\n' "$(basename "$t")" "$( [ $rc = 0 ] && echo PASS || echo FAIL ) $(echo "$out" | tail -1 | cut -c1-110)"
  [ $rc = 0 ] || fail=1
done
[ $fail = 0 ] && echo "app tests: PASS" || { echo "app tests: FAIL"; exit 1; }
