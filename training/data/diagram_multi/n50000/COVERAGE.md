# Coverage of the diagram_multi world, Level 1 (generate.py --languages ro,en,mix --mix 0.0 seed 0, 50000 training sentences)

Legend sha256:1a43ffc61bd5364df1ebc56decefdfb773f173b0b40b0cfbd829170a2b884b4f (the English diagram world's, byte-identical). Templates 40 (every English template has a Romanian realiser), prefixes 11, combinations 440, held out 46. Lexicon 1250 entries (821 with a lemma). Dictionary translate_en.json 11041 keys (313 with alternatives).

Training sentences by language: en 20000, mix 10000, ro 20000.

Sentences per event and role (training file):

| event | n | object | color | size | style | text | relation | landmark | region | anchor | fraction | amount | unit | direction | axis | layout | pairing | source | target | quantity | PROHIBITION |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| create | 8944 | 8944 |  |  |  | 3277 | 2745 | 2745 | 1813 |  |  | 440 | 440 |  |  |  |  |  |  | 1235 |  |
| place | 2822 | 2822 |  |  |  |  | 1677 | 1677 | 1145 |  |  | 406 | 406 |  |  |  |  |  |  |  |  |
| delete | 2596 | 2596 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 127 |
| move | 6478 | 6478 |  |  |  |  | 1085 | 1085 | 643 | 3083 | 1421 | 1077 | 1077 | 1667 |  |  |  |  |  |  | 330 |
| change | 4584 | 4584 | 1910 | 1973 | 701 |  |  |  |  |  |  | 913 | 913 |  |  |  |  |  |  |  | 231 |
| resize | 2602 | 2602 |  | 1149 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 190 |
| connect | 5711 | 2492 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 1488 | 5711 | 4223 |  | 310 |
| name | 2985 | 2985 |  |  |  | 2985 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 171 |
| copy | 1410 | 1410 |  |  |  |  | 481 | 481 | 326 |  |  | 123 | 123 |  |  |  |  |  |  |  | 79 |
| group | 2374 | 2374 |  |  |  | 1250 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 107 |
| ungroup | 797 | 797 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| arrange | 2562 | 2562 |  |  |  |  |  |  |  |  |  |  |  |  |  | 2562 |  |  |  |  |  |
| align | 1477 | 1477 |  |  |  |  |  |  |  |  |  |  |  | 745 | 732 |  |  |  |  |  |  |
| distribute | 1576 | 1576 |  |  |  |  |  |  |  |  |  | 732 | 732 |  | 844 |  |  |  |  |  |  |
| front | 728 | 728 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| back | 817 | 817 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| zoom | 562 |  |  |  |  |  |  |  |  |  |  |  |  | 562 |  |  |  |  |  |  |  |
| undo | 354 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| redo | 291 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| clear | 330 | 330 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Evaluation files: eval_new_identities.sop 400; eval_heldout_formulations.sop 400; eval_mixed.sop 400; eval_new_identities_en.sop 400; eval_heldout_formulations_en.sop 400; eval_parallel.jsonl 400 frames.
Parallel set, gold frames of the English and the Romanian realisation identical (det an = a): 400/400.
