# Coverage of the diagram_multi world, Level 1 (generate.py --languages ro,en,mix --mix 0.0 seed 0, 20000 training sentences)

Legend sha256:e3e44ee9f7e82ca74ab101ed8b3dc66b9645799139b319c5bd25b30fb78324cf (the English diagram world's, byte-identical). Templates 40 (every English template has a Romanian realiser), prefixes 11, combinations 440, held out 46. Lexicon 1250 entries (821 with a lemma). Dictionary translate_en.json 11002 keys (312 with alternatives).

Training sentences by language: en 8000, mix 4000, ro 8000.

Sentences per event and role (training file):

| event | n | object | color | size | style | text | relation | landmark | region | anchor | fraction | amount | unit | direction | axis | layout | pairing | source | target | quantity | PROHIBITION |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| create | 3611 | 3611 |  |  |  | 1352 | 1132 | 1132 | 704 |  |  | 188 | 188 |  |  |  |  |  |  | 510 |  |
| place | 1064 | 1064 |  |  |  |  | 669 | 669 | 395 |  |  | 161 | 161 |  |  |  |  |  |  |  |  |
| delete | 1088 | 1088 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 58 |
| move | 2588 | 2588 |  |  |  |  | 421 | 421 | 270 | 1198 | 550 | 447 | 447 | 699 |  |  |  |  |  |  | 135 |
| change | 1775 | 1775 | 759 | 759 | 257 |  |  |  |  |  |  | 356 | 356 |  |  |  |  |  |  |  | 94 |
| resize | 1030 | 1030 |  | 436 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 75 |
| connect | 2325 | 1026 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 604 | 2325 | 1721 |  | 138 |
| name | 1162 | 1162 |  |  |  | 1162 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 71 |
| copy | 532 | 532 |  |  |  |  | 173 | 173 | 114 |  |  | 36 | 36 |  |  |  |  |  |  |  | 27 |
| group | 985 | 985 |  |  |  | 508 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 46 |
| ungroup | 321 | 321 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| arrange | 1011 | 1011 |  |  |  |  |  |  |  |  |  |  |  |  |  | 1011 |  |  |  |  |  |
| align | 629 | 629 |  |  |  |  |  |  |  |  |  |  |  | 325 | 304 |  |  |  |  |  |  |
| distribute | 652 | 652 |  |  |  |  |  |  |  |  |  | 315 | 315 |  | 337 |  |  |  |  |  |  |
| front | 271 | 271 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| back | 316 | 316 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| zoom | 230 |  |  |  |  |  |  |  |  |  |  |  |  | 230 |  |  |  |  |  |  |  |
| undo | 155 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| redo | 97 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| clear | 158 | 158 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Evaluation files: eval_new_identities.sop 400; eval_heldout_formulations.sop 400; eval_mixed.sop 400; eval_new_identities_en.sop 400; eval_heldout_formulations_en.sop 400; eval_parallel.jsonl 400 frames.
Parallel set, gold frames of the English and the Romanian realisation identical (det an = a): 400/400.
