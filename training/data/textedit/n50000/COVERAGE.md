# Coverage of the textedit world, Level 1 (generate.py seed 0, 50000 training sentences)

Legend sha256:4c42eb08b9dd51b958b09338798336accc00cfc7d2efb6aae0d88b4749e5c5cd. Templates 41, prefixes 11, combinations 451, held out 47.

Sentences per event and role (training file):

| event | n | unit | ordinal | match | format | value | position | new_text | widget |
|---|---|---|---|---|---|---|---|---|---|
| select | 4851 | 2993 | 1273 | 2253 |  |  | 944 |  | 296 |
| format | 11062 | 9193 | 6740 | 2667 | 5591 | 4276 |  |  | 305 |
| unformat | 2930 | 2283 | 1473 | 868 | 1483 |  |  |  |  |
| insert | 4983 | 960 | 960 | 2137 |  |  | 4983 | 4983 |  |
| delete | 5230 | 4336 | 1344 | 2528 |  |  | 1243 |  | 190 |
| replace | 5280 | 2127 | 1792 | 3488 |  |  |  | 5280 |  |
| move_cursor | 3589 | 1788 | 1788 | 808 |  |  | 2607 |  |  |
| capitalise | 2614 | 2066 | 1336 | 764 |  |  |  |  |  |
| make_list | 2468 | 2468 | 1682 |  | 705 |  |  |  |  |
| make_heading | 2724 | 2724 | 2180 |  | 1357 |  |  |  |  |
| align | 1613 | 1613 | 1286 |  |  | 848 |  |  |  |
| undo | 577 |  |  |  |  |  |  |  |  |
| redo | 648 |  |  |  |  |  |  |  |  |
| read_back | 1431 | 1431 | 569 |  |  |  |  |  |  |

Closed values seen in training (role: value count):

- unit: character 1479, characters 498, everything 3411, it 2063, line 3627, lines 1697, list_item 1870, list_items 589, paragraph 3116, paragraphs 1698, selection 1357, sentence 3714, sentences 1373, that 2372, word 4596, words 522
- ordinal: fifth 1810, first 1778, first_2 408, first_3 411, first_4 389, first_5 415, fourth 1805, last 1818, last_2 390, last_3 367, last_4 379, last_5 424, next 1750, next_2 394, next_3 376, next_4 425, next_5 381, previous 1774, previous_2 402, previous_3 400, previous_4 399, previous_5 417, second 1771, third 1776, this 1764
- format: bold 909, bullet_list 1001, heading 742, heading_one 758, heading_three 784, heading_two 738, highlighted 513, italic 676, list 651, numbered_list 941, plain 431, strikethrough 495, underlined 497
- value: bigger 223, black 135, blue 439, center 225, gray 140, green 409, huge 207, justified 201, large 224, left 217, normal 206, orange 450, pink 468, purple 152, red 147, right 205, small 228, smaller 216, white 164, yellow 468
- position: after 2082, at_end 3094, at_start 2495, before 2106

Closed values never seen in training: none.

Pieces of text in training: 97 distinct match values, 105 distinct new_text values; widgets 12.

Evaluation files: eval_new_identities.sop 400 sentences; eval_heldout_formulations.sop 400 sentences.
Dictated prose (negatives for the command threshold): prose_synth.py (ours, local) and prose_download.py (public domain, DGX only); not in examples/.
