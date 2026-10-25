# Coverage of the diagram_ro world, Level 1 (generate.py --languages ro --mix 0.0 seed 0, 1000 training sentences)

Legend sha256:e3e44ee9f7e82ca74ab101ed8b3dc66b9645799139b319c5bd25b30fb78324cf (the English diagram world's, byte-identical). Templates 40 (every English template has a Romanian realiser), prefixes 11, combinations 440, held out 46. Lexicon 1250 entries (821 with a lemma). Dictionary translate_en.json 11002 keys (312 with alternatives).

Training sentences by language: ro 1000.

Sentences per event and role (training file):

| event | n | object | color | size | style | text | relation | landmark | region | anchor | fraction | amount | unit | direction | axis | layout | pairing | source | target | quantity | PROHIBITION |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| create | 194 | 194 |  |  |  | 82 | 54 | 54 | 37 |  |  | 8 | 8 |  |  |  |  |  |  | 29 |  |
| place | 52 | 52 |  |  |  |  | 36 | 36 | 16 |  |  | 9 | 9 |  |  |  |  |  |  |  |  |
| delete | 61 | 61 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 3 |
| move | 115 | 115 |  |  |  |  | 17 | 17 | 10 | 54 | 20 | 24 | 24 | 34 |  |  |  |  |  |  | 4 |
| change | 93 | 93 | 43 | 40 | 10 |  |  |  |  |  |  | 20 | 20 |  |  |  |  |  |  |  | 2 |
| resize | 63 | 63 |  | 27 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 8 |
| connect | 112 | 61 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 25 | 112 | 87 |  | 4 |
| name | 48 | 48 |  |  |  | 48 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 2 |
| copy | 30 | 30 |  |  |  |  | 8 | 8 | 8 |  |  | 2 | 2 |  |  |  |  |  |  |  | 1 |
| group | 48 | 48 |  |  |  | 22 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 3 |
| ungroup | 11 | 11 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| arrange | 48 | 48 |  |  |  |  |  |  |  |  |  |  |  |  |  | 48 |  |  |  |  |  |
| align | 32 | 32 |  |  |  |  |  |  |  |  |  |  |  | 17 | 15 |  |  |  |  |  |  |
| distribute | 28 | 28 |  |  |  |  |  |  |  |  |  | 13 | 13 |  | 15 |  |  |  |  |  |  |
| front | 18 | 18 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| back | 12 | 12 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| zoom | 12 |  |  |  |  |  |  |  |  |  |  |  |  | 12 |  |  |  |  |  |  |  |
| undo | 11 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| redo | 3 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| clear | 9 | 9 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Evaluation files: eval_new_identities.sop 400; eval_heldout_formulations.sop 400; eval_mixed.sop 400; eval_parallel.jsonl 400 frames.
Parallel set, gold frames of the English and the Romanian realisation identical (det an = a): 400/400.
