# Correctors (spec sections 12 and 13.2)

`web/normalize.js` is the exact port of `tool/worlds_src/diagram/normalize.py` (one table: `tool/worlds_src/diagram/normalize.json`);
`web/correct.js` is the typed and speech corrector. Order in the editor: normalizer, corrector, reader. The corrector never decides a
homophone or a valid English word that is close to a word of the world: it returns them as alternatives, and the reader keeps the
alternative whose frame is clearest (spec 12.3; to be wired in the editor once vss.js is in place).

## Tests (CPU, no download)

```
python3 tool/worlds_src/diagram/normalize_golden.py > /tmp/ngold.jsonl && node web/tests/normalize_test.mjs /tmp/ngold.jsonl
python3 tool/worlds_src/diagram/generate.py --out /tmp/w/diagram --n 3000 --n_eval 200
grep "^_text=" /tmp/w/diagram/examples/eval_heldout_formulations.sop | cut -c7- | python3 tool/worlds_src/diagram/noise.py --kind typing --k 1 --seed 1 > /tmp/typ.jsonl
grep "^_text=" /tmp/w/diagram/examples/eval_heldout_formulations.sop | cut -c7- | python3 tool/worlds_src/diagram/noise.py --kind speech --k 1 --seed 1 > /tmp/sp.jsonl
node web/tests/correct_test.mjs /tmp/w/diagram /tmp/typ.jsonl typed
node web/tests/correct_test.mjs /tmp/w/diagram /tmp/sp.jsonl speech
```

## Smoke numbers at preparation (CPU, 200 held-out-formulation sentences, one error each; NOT results, the criteria are judged on the DGX run)

- normalizer parity Python / JavaScript: 331 of 331 sentences identical (surface generator sentences plus 11 hand-written hard cases).
- typed: restored exactly (the corrected sequence or one of its alternatives) 0.975; per kind: insertion 57/58, substitution 49/49,
  transposition 33/36, deletion 36/37, missing space 20/20; false corrections on clean input 0 of the tokens; under 1 ms per sentence in node.
- speech: restored 0.600 overall; homophones 69/80 (as alternatives for the reader), number forms 12/12, wrong boundaries 1/6, label
  sound-alikes 2/10, dropped short words 0/56 (a corrector cannot restore a dropped word: the reader reads without it, and the recorded
  set measures what that costs); false corrections on clean input 0.
- the weak points to work on before the recorded speech set: word boundaries between two known words, and label sound-alikes that are
  valid English words (offered as alternatives only when the phonetic key matches exactly; the diagram's labels must be in the index,
  `setLabels`).
