# Coverage of the diagram_multi world, Level 1 (generate.py --languages ro,en,mix --mix 0.0 seed 0, 5000 training sentences)

Legend sha256:0fcc87608bb4fb2f864069550b637274d2b411a4f5b3f26e8a1d560b455f292f (the English diagram world's, byte-identical). Templates 40 (every English template has a Romanian realiser), prefixes 11, combinations 440, held out 46. Lexicon 1262 entries (831 with a lemma). Dictionary translate_en.json 11186 keys (313 with alternatives).

Training sentences by language: en 2000, mix 1000, ro 2000.

Sentences per event and role (training file):

| event | n | object | color | size | style | text | relation | landmark | region | anchor | fraction | amount | unit | direction | axis | layout | pairing | source | target | edge | quantity | PROHIBITION |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| create | 928 | 928 |  |  |  | 339 | 272 | 272 | 191 |  |  | 44 | 44 |  |  |  |  |  |  |  | 129 |  |
| place | 272 | 272 |  |  |  |  | 178 | 178 | 94 |  |  | 43 | 43 |  |  |  |  |  |  |  |  |  |
| delete | 253 | 253 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 13 |
| move | 602 | 602 |  |  |  |  | 87 | 87 | 62 | 291 | 125 | 108 | 108 | 162 |  |  |  |  |  |  |  | 31 |
| change | 480 | 480 | 181 | 229 | 70 |  |  |  |  |  |  | 120 | 120 |  |  |  |  |  |  |  |  | 33 |
| resize | 274 | 274 |  | 127 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 18 |
| connect | 587 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 151 | 587 | 436 | 276 |  | 32 |
| name | 267 | 267 |  |  |  | 267 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 10 |
| copy | 155 | 155 |  |  |  |  | 60 | 60 | 27 |  |  | 18 | 18 |  |  |  |  |  |  |  |  | 7 |
| group | 232 | 232 |  |  |  | 124 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 6 |
| ungroup | 86 | 86 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| arrange | 244 | 244 |  |  |  |  |  |  |  |  |  |  |  |  |  | 244 |  |  |  |  |  |  |
| align | 160 | 160 |  |  |  |  |  |  |  |  |  |  |  | 83 | 77 |  |  |  |  |  |  |  |
| distribute | 158 | 158 |  |  |  |  |  |  |  |  |  | 69 | 69 |  | 89 |  |  |  |  |  |  |  |
| front | 73 | 73 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| back | 87 | 87 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| zoom | 56 |  |  |  |  |  |  |  |  |  |  |  |  | 56 |  |  |  |  |  |  |  |  |
| undo | 36 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| redo | 25 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| clear | 25 | 25 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Evaluation files: eval_new_identities.sop 400; eval_heldout_formulations.sop 400; eval_mixed.sop 400; eval_new_identities_en.sop 400; eval_heldout_formulations_en.sop 400; eval_parallel.jsonl 400 frames.
Parallel set, gold frames of the English and the Romanian realisation identical (det an = a): 400/400.
