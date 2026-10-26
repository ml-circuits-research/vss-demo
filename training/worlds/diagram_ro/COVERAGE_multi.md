# Coverage of the diagram_multi world, Level 1 (generate.py --languages ro,en,mix --mix 0.0 seed 0, 5000 training sentences)

Legend sha256:d361fbea318b20d14d401d9e64aeb918628843cd366fcb1cbfe644915e48c6a9 (the English diagram world's, byte-identical). Templates 40 (every English template has a Romanian realiser), prefixes 11, combinations 440, held out 46. Lexicon 1262 entries (831 with a lemma). Dictionary translate_en.json 11186 keys (313 with alternatives).

Training sentences by language: en 2000, mix 1000, ro 2000.

Sentences per event and role (training file):

| event | n | object | color | size | style | text | relation | landmark | region | anchor | fraction | amount | unit | direction | axis | layout | pairing | source | target | edge | quantity | PROHIBITION |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| create | 940 | 940 |  |  |  | 324 | 286 | 286 | 193 |  |  | 46 | 46 |  |  |  |  |  |  |  | 134 |  |
| place | 273 | 273 |  |  |  |  | 178 | 178 | 95 |  |  | 49 | 49 |  |  |  |  |  |  |  |  |  |
| delete | 258 | 258 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 11 |
| move | 640 | 640 |  |  |  |  | 94 | 94 | 56 | 323 | 133 | 110 | 110 | 167 |  |  |  |  |  |  |  | 42 |
| change | 475 | 475 | 193 | 210 | 72 |  |  |  |  |  |  | 107 | 107 |  |  |  |  |  |  |  |  | 28 |
| resize | 256 | 256 |  | 121 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 11 |
| connect | 570 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 149 | 570 | 421 | 253 |  | 39 |
| name | 301 | 301 |  |  |  | 301 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 6 |
| copy | 165 | 165 |  |  |  |  | 58 | 58 | 30 |  |  | 18 | 18 |  |  |  |  |  |  |  |  | 6 |
| group | 247 | 247 |  |  |  | 127 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 9 |
| ungroup | 78 | 78 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| arrange | 238 | 238 |  |  |  |  |  |  |  |  |  |  |  |  |  | 238 |  |  |  |  |  |  |
| align | 132 | 132 |  |  |  |  |  |  |  |  |  |  |  | 74 | 58 |  |  |  |  |  |  |  |
| distribute | 141 | 141 |  |  |  |  |  |  |  |  |  | 57 | 57 |  | 84 |  |  |  |  |  |  |  |
| front | 54 | 54 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| back | 88 | 88 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| zoom | 54 |  |  |  |  |  |  |  |  |  |  |  |  | 54 |  |  |  |  |  |  |  |  |
| undo | 34 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| redo | 32 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| clear | 24 | 24 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Evaluation files: eval_new_identities.sop 400; eval_heldout_formulations.sop 400; eval_mixed.sop 400; eval_new_identities_en.sop 400; eval_heldout_formulations_en.sop 400; eval_parallel.jsonl 400 frames.
Parallel set, gold frames of the English and the Romanian realisation identical (det an = a): 400/400.
