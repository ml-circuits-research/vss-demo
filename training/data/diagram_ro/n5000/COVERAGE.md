# Coverage of the diagram_ro world, Level 1 (generate.py --languages ro --mix 0.0 seed 0, 5000 training sentences)

Legend sha256:e3e44ee9f7e82ca74ab101ed8b3dc66b9645799139b319c5bd25b30fb78324cf (the English diagram world's, byte-identical). Templates 40 (every English template has a Romanian realiser), prefixes 11, combinations 440, held out 46. Lexicon 1250 entries (821 with a lemma). Dictionary translate_en.json 11002 keys (312 with alternatives).

Training sentences by language: ro 5000.

Sentences per event and role (training file):

| event | n | object | color | size | style | text | relation | landmark | region | anchor | fraction | amount | unit | direction | axis | layout | pairing | source | target | quantity | PROHIBITION |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| create | 921 | 921 |  |  |  | 353 | 282 | 282 | 187 |  |  | 45 | 45 |  |  |  |  |  |  | 134 |  |
| place | 242 | 242 |  |  |  |  | 161 | 161 | 81 |  |  | 32 | 32 |  |  |  |  |  |  |  |  |
| delete | 284 | 284 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 17 |
| move | 628 | 628 |  |  |  |  | 90 | 90 | 68 | 294 | 133 | 115 | 115 | 176 |  |  |  |  |  |  | 31 |
| change | 435 | 435 | 190 | 189 | 56 |  |  |  |  |  |  | 95 | 95 |  |  |  |  |  |  |  | 30 |
| resize | 270 | 270 |  | 132 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 21 |
| connect | 571 | 257 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 130 | 571 | 441 |  | 34 |
| name | 284 | 284 |  |  |  | 284 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 17 |
| copy | 130 | 130 |  |  |  |  | 49 | 49 | 19 |  |  | 13 | 13 |  |  |  |  |  |  |  | 7 |
| group | 239 | 239 |  |  |  | 122 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 9 |
| ungroup | 83 | 83 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| arrange | 268 | 268 |  |  |  |  |  |  |  |  |  |  |  |  |  | 268 |  |  |  |  |  |
| align | 155 | 155 |  |  |  |  |  |  |  |  |  |  |  | 86 | 69 |  |  |  |  |  |  |
| distribute | 168 | 168 |  |  |  |  |  |  |  |  |  | 80 | 80 |  | 88 |  |  |  |  |  |  |
| front | 74 | 74 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| back | 72 | 72 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| zoom | 73 |  |  |  |  |  |  |  |  |  |  |  |  | 73 |  |  |  |  |  |  |  |
| undo | 41 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| redo | 24 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| clear | 38 | 38 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Evaluation files: eval_new_identities.sop 400; eval_heldout_formulations.sop 400; eval_mixed.sop 400; eval_parallel.jsonl 400 frames.
Parallel set, gold frames of the English and the Romanian realisation identical (det an = a): 400/400.
