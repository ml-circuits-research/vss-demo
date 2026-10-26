# Coverage of the diagram_ro world, Level 1 (generate.py --languages ro --mix 0.0 seed 0, 5000 training sentences)

Legend sha256:d361fbea318b20d14d401d9e64aeb918628843cd366fcb1cbfe644915e48c6a9 (the English diagram world's, byte-identical). Templates 40 (every English template has a Romanian realiser), prefixes 11, combinations 440, held out 46. Lexicon 1262 entries (831 with a lemma). Dictionary translate_en.json 11186 keys (313 with alternatives).

Training sentences by language: ro 5000.

Sentences per event and role (training file):

| event | n | object | color | size | style | text | relation | landmark | region | anchor | fraction | amount | unit | direction | axis | layout | pairing | source | target | edge | quantity | PROHIBITION |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| create | 882 | 882 |  |  |  | 312 | 266 | 266 | 194 |  |  | 41 | 41 |  |  |  |  |  |  |  | 130 |  |
| place | 236 | 236 |  |  |  |  | 151 | 151 | 85 |  |  | 37 | 37 |  |  |  |  |  |  |  |  |  |
| delete | 274 | 274 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 12 |
| move | 645 | 645 |  |  |  |  | 98 | 98 | 59 | 310 | 134 | 115 | 115 | 178 |  |  |  |  |  |  |  | 35 |
| change | 433 | 433 | 177 | 197 | 59 |  |  |  |  |  |  | 100 | 100 |  |  |  |  |  |  |  |  | 24 |
| resize | 282 | 282 |  | 135 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 15 |
| connect | 586 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 153 | 586 | 433 | 249 |  | 39 |
| name | 303 | 303 |  |  |  | 303 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 14 |
| copy | 143 | 143 |  |  |  |  | 44 | 44 | 29 |  |  | 10 | 10 |  |  |  |  |  |  |  |  | 12 |
| group | 242 | 242 |  |  |  | 117 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 10 |
| ungroup | 77 | 77 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| arrange | 266 | 266 |  |  |  |  |  |  |  |  |  |  |  |  |  | 266 |  |  |  |  |  |  |
| align | 138 | 138 |  |  |  |  |  |  |  |  |  |  |  | 78 | 60 |  |  |  |  |  |  |  |
| distribute | 164 | 164 |  |  |  |  |  |  |  |  |  | 72 | 72 |  | 92 |  |  |  |  |  |  |  |
| front | 68 | 68 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| back | 82 | 82 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| zoom | 71 |  |  |  |  |  |  |  |  |  |  |  |  | 71 |  |  |  |  |  |  |  |  |
| undo | 39 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| redo | 25 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| clear | 44 | 44 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Evaluation files: eval_new_identities.sop 400; eval_heldout_formulations.sop 400; eval_mixed.sop 400; eval_parallel.jsonl 400 frames.
Parallel set, gold frames of the English and the Romanian realisation identical (det an = a): 400/400.
