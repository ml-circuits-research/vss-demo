# Coverage of the diagram_ro world, Level 1 (generate.py --languages ro --mix 0.0 seed 0, 20000 training sentences)

Legend sha256:e3e44ee9f7e82ca74ab101ed8b3dc66b9645799139b319c5bd25b30fb78324cf (the English diagram world's, byte-identical). Templates 40 (every English template has a Romanian realiser), prefixes 11, combinations 440, held out 46. Lexicon 1250 entries (821 with a lemma). Dictionary translate_en.json 11002 keys (312 with alternatives).

Training sentences by language: ro 20000.

Sentences per event and role (training file):

| event | n | object | color | size | style | text | relation | landmark | region | anchor | fraction | amount | unit | direction | axis | layout | pairing | source | target | quantity | PROHIBITION |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| create | 3508 | 3508 |  |  |  | 1282 | 1040 | 1040 | 731 |  |  | 167 | 167 |  |  |  |  |  |  | 508 |  |
| place | 1076 | 1076 |  |  |  |  | 654 | 654 | 422 |  |  | 149 | 149 |  |  |  |  |  |  |  |  |
| delete | 1099 | 1099 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 61 |
| move | 2498 | 2498 |  |  |  |  | 421 | 421 | 248 | 1168 | 541 | 445 | 445 | 661 |  |  |  |  |  |  | 136 |
| change | 1800 | 1800 | 762 | 782 | 256 |  |  |  |  |  |  | 377 | 377 |  |  |  |  |  |  |  | 104 |
| resize | 1059 | 1059 |  | 472 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 80 |
| connect | 2274 | 975 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 625 | 2274 | 1649 |  | 127 |
| name | 1232 | 1232 |  |  |  | 1232 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 63 |
| copy | 558 | 558 |  |  |  |  | 196 | 196 | 117 |  |  | 46 | 46 |  |  |  |  |  |  |  | 37 |
| group | 968 | 968 |  |  |  | 505 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 42 |
| ungroup | 324 | 324 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| arrange | 1033 | 1033 |  |  |  |  |  |  |  |  |  |  |  |  |  | 1033 |  |  |  |  |  |
| align | 583 | 583 |  |  |  |  |  |  |  |  |  |  |  | 300 | 283 |  |  |  |  |  |  |
| distribute | 672 | 672 |  |  |  |  |  |  |  |  |  | 315 | 315 |  | 357 |  |  |  |  |  |  |
| front | 293 | 293 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| back | 330 | 330 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| zoom | 262 |  |  |  |  |  |  |  |  |  |  |  |  | 262 |  |  |  |  |  |  |  |
| undo | 161 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| redo | 121 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| clear | 149 | 149 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Evaluation files: eval_new_identities.sop 400; eval_heldout_formulations.sop 400; eval_mixed.sop 400; eval_parallel.jsonl 400 frames.
Parallel set, gold frames of the English and the Romanian realisation identical (det an = a): 400/400.
