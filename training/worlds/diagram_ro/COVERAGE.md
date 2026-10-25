# Coverage of the diagram_ro world, Level 1 (generate.py --languages ro --mix 0.0 seed 0, 50000 training sentences)

Legend sha256:e3e44ee9f7e82ca74ab101ed8b3dc66b9645799139b319c5bd25b30fb78324cf (the English diagram world's, byte-identical). Templates 40 (every English template has a Romanian realiser), prefixes 11, combinations 440, held out 46. Lexicon 1250 entries (821 with a lemma). Dictionary translate_en.json 11002 keys (312 with alternatives).

Training sentences by language: ro 50000.

Sentences per event and role (training file):

| event | n | object | color | size | style | text | relation | landmark | region | anchor | fraction | amount | unit | direction | axis | layout | pairing | source | target | quantity | PROHIBITION |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| create | 8631 | 8631 |  |  |  | 3057 | 2620 | 2620 | 1730 |  |  | 434 | 434 |  |  |  |  |  |  | 1236 |  |
| place | 2715 | 2715 |  |  |  |  | 1636 | 1636 | 1079 |  |  | 391 | 391 |  |  |  |  |  |  |  |  |
| delete | 2674 | 2674 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 127 |
| move | 6407 | 6407 |  |  |  |  | 1029 | 1029 | 636 | 3062 | 1384 | 1051 | 1051 | 1680 |  |  |  |  |  |  | 309 |
| change | 4574 | 4574 | 1882 | 1960 | 732 |  |  |  |  |  |  | 955 | 955 |  |  |  |  |  |  |  | 254 |
| resize | 2665 | 2665 |  | 1217 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 176 |
| connect | 5760 | 2473 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 1585 | 5760 | 4175 |  | 331 |
| name | 3085 | 3085 |  |  |  | 3085 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 164 |
| copy | 1363 | 1363 |  |  |  |  | 472 | 472 | 302 |  |  | 113 | 113 |  |  |  |  |  |  |  | 70 |
| group | 2345 | 2345 |  |  |  | 1227 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 105 |
| ungroup | 820 | 820 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| arrange | 2527 | 2527 |  |  |  |  |  |  |  |  |  |  |  |  |  | 2527 |  |  |  |  |  |
| align | 1486 | 1486 |  |  |  |  |  |  |  |  |  |  |  | 765 | 721 |  |  |  |  |  |  |
| distribute | 1684 | 1684 |  |  |  |  |  |  |  |  |  | 800 | 800 |  | 884 |  |  |  |  |  |  |
| front | 680 | 680 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| back | 864 | 864 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| zoom | 614 |  |  |  |  |  |  |  |  |  |  |  |  | 614 |  |  |  |  |  |  |  |
| undo | 413 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| redo | 332 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| clear | 361 | 361 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Evaluation files: eval_new_identities.sop 400; eval_heldout_formulations.sop 400; eval_mixed.sop 400; eval_parallel.jsonl 400 frames.
Parallel set, gold frames of the English and the Romanian realisation identical (det an = a): 400/400.
