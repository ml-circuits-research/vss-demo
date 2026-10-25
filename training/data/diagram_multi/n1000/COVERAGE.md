# Coverage of the diagram_multi world, Level 1 (generate.py --languages ro,en,mix --mix 0.0 seed 0, 1000 training sentences)

Legend sha256:e3e44ee9f7e82ca74ab101ed8b3dc66b9645799139b319c5bd25b30fb78324cf (the English diagram world's, byte-identical). Templates 40 (every English template has a Romanian realiser), prefixes 11, combinations 440, held out 46. Lexicon 1250 entries (821 with a lemma). Dictionary translate_en.json 11002 keys (312 with alternatives).

Training sentences by language: en 400, mix 200, ro 400.

Sentences per event and role (training file):

| event | n | object | color | size | style | text | relation | landmark | region | anchor | fraction | amount | unit | direction | axis | layout | pairing | source | target | quantity | PROHIBITION |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| create | 173 | 173 |  |  |  | 67 | 52 | 52 | 37 |  |  | 7 | 7 |  |  |  |  |  |  | 21 |  |
| place | 50 | 50 |  |  |  |  | 27 | 27 | 23 |  |  | 5 | 5 |  |  |  |  |  |  |  |  |
| delete | 45 | 45 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 4 |
| move | 128 | 128 |  |  |  |  | 21 | 21 | 15 | 57 | 22 | 22 | 22 | 35 |  |  |  |  |  |  | 1 |
| change | 94 | 94 | 43 | 38 | 13 |  |  |  |  |  |  | 18 | 18 |  |  |  |  |  |  |  | 3 |
| resize | 71 | 71 |  | 34 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 6 |
| connect | 116 | 64 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 26 | 116 | 90 |  | 4 |
| name | 66 | 66 |  |  |  | 66 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 4 |
| copy | 43 | 43 |  |  |  |  | 14 | 14 | 11 |  |  | 5 | 5 |  |  |  |  |  |  |  | 4 |
| group | 47 | 47 |  |  |  | 21 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 2 |
| ungroup | 7 | 7 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| arrange | 46 | 46 |  |  |  |  |  |  |  |  |  |  |  |  |  | 46 |  |  |  |  |  |
| align | 24 | 24 |  |  |  |  |  |  |  |  |  |  |  | 14 | 10 |  |  |  |  |  |  |
| distribute | 28 | 28 |  |  |  |  |  |  |  |  |  | 11 | 11 |  | 17 |  |  |  |  |  |  |
| front | 18 | 18 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| back | 10 | 10 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| zoom | 14 |  |  |  |  |  |  |  |  |  |  |  |  | 14 |  |  |  |  |  |  |  |
| undo | 14 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| redo | 2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| clear | 4 | 4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Evaluation files: eval_new_identities.sop 400; eval_heldout_formulations.sop 400; eval_mixed.sop 400; eval_new_identities_en.sop 400; eval_heldout_formulations_en.sop 400; eval_parallel.jsonl 400 frames.
Parallel set, gold frames of the English and the Romanian realisation identical (det an = a): 400/400.
