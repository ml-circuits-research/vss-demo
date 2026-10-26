# Correctors (spec sections 12 and 13.2)

`app/src/normalize.js` is the exact port of `training/worlds/diagram/normalize.py` (one table: `training/worlds/diagram/normalize.json`);
`app/src/correct.js` is the typed and speech corrector. Order in the editor: normalizer, corrector, reader. The corrector runs by itself,
always, before the reader (D29 / D30): no "did you mean" interface, no buttons, no variants shown. A token that is not a lexicon word but is
within cost 1 (OSA) of lexicon words is replaced by the nearest when it is not an English word, and ALSO offered as variants (the other
words within cost 1) when it is an English word ("crate" beside "create"); homophones are variants too. `correct()` returns
`alternatives` (token sequences) and `alternativeCorrections` (the corrections each variant applies); `routes.js` reads every variant and
keeps the clearest, whose corrections go with the reading. The chat reply says it in one sentence ("Done: create a blue box (I read 'creat'
as 'create')."); the corrected words (underlined as in Table 8) and the variants that were read are in the History entry of that message
(row line "Corrected", detail "Reading with margins" and "Variants read"), nothing else in the chat.

## Tests (CPU, no download)

`node app/tests/typos.mjs` (in run_all.sh): one cost-1 typo per legend verb (deletion, transposition, substitution), the prefix families and
"crate", all checked on the corrected variant set, not on the reader.

```
python3 training/worlds/diagram/normalize_golden.py > /tmp/ngold.jsonl && node app/tests/normalize_test.mjs /tmp/ngold.jsonl
python3 training/worlds/diagram/generate.py --out /tmp/w/diagram --n 3000 --n_eval 200
grep "^_text=" /tmp/w/diagram/examples/eval_heldout_formulations.sop | cut -c7- | python3 training/worlds/diagram/noise.py --kind typing --k 1 --seed 1 > /tmp/typ.jsonl
grep "^_text=" /tmp/w/diagram/examples/eval_heldout_formulations.sop | cut -c7- | python3 training/worlds/diagram/noise.py --kind speech --k 1 --seed 1 > /tmp/sp.jsonl
node app/tests/correct_test.mjs /tmp/w/diagram /tmp/typ.jsonl typed
node app/tests/correct_test.mjs /tmp/w/diagram /tmp/sp.jsonl speech
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
