# Coverage of the textedit world, Level 1 (generate.py seed 0, 20000 training sentences)

Legend sha256:4c42eb08b9dd51b958b09338798336accc00cfc7d2efb6aae0d88b4749e5c5cd. Templates 41, prefixes 11, combinations 451, held out 47.

Sentences per event and role (training file):

| event | n | unit | ordinal | match | format | value | position | new_text | widget |
|---|---|---|---|---|---|---|---|---|---|
| select | 1950 | 1197 | 512 | 905 |  |  | 394 |  | 119 |
| format | 4387 | 3642 | 2675 | 1050 | 2187 | 1743 |  |  | 116 |
| unformat | 1192 | 936 | 593 | 360 | 626 |  |  |  |  |
| insert | 1953 | 376 | 376 | 801 |  |  | 1953 | 1953 |  |
| delete | 2048 | 1727 | 534 | 953 |  |  | 485 |  | 81 |
| replace | 2120 | 884 | 737 | 1383 |  |  |  | 2120 |  |
| move_cursor | 1442 | 727 | 727 | 335 |  |  | 1051 |  |  |
| capitalise | 1079 | 843 | 550 | 321 |  |  |  |  |  |
| make_list | 1000 | 1000 | 685 |  | 290 |  |  |  |  |
| make_heading | 1115 | 1115 | 882 |  | 546 |  |  |  |  |
| align | 659 | 659 | 516 |  |  | 352 |  |  |  |
| undo | 223 |  |  |  |  |  |  |  |  |
| redo | 282 |  |  |  |  |  |  |  |  |
| read_back | 550 | 550 | 223 |  |  |  |  |  |  |

Closed values seen in training (role: value count):

- unit: character 603, characters 192, everything 1379, it 812, line 1498, lines 673, list_item 760, list_items 237, paragraph 1324, paragraphs 667, selection 566, sentence 1417, sentences 560, that 949, word 1817, words 202
- ordinal: fifth 775, first 713, first_2 146, first_3 182, first_4 154, first_5 165, fourth 713, last 763, last_2 163, last_3 143, last_4 148, last_5 171, next 680, next_2 147, next_3 148, next_4 176, next_5 168, previous 707, previous_2 148, previous_3 144, previous_4 170, previous_5 158, second 717, third 702, this 709
- format: bold 388, bullet_list 401, heading 288, heading_one 302, heading_three 311, heading_two 288, highlighted 200, italic 251, list 261, numbered_list 373, plain 170, strikethrough 206, underlined 210
- value: bigger 91, black 65, blue 192, center 95, gray 62, green 162, huge 83, justified 84, large 92, left 93, normal 84, orange 186, pink 187, purple 59, red 60, right 80, small 87, smaller 84, white 70, yellow 179
- position: after 810, at_end 1218, at_start 1044, before 811

Closed values never seen in training: none.

Pieces of text in training: 97 distinct match values, 105 distinct new_text values; widgets 12.

Evaluation files: eval_new_identities.sop 400 sentences; eval_heldout_formulations.sop 400 sentences.
Dictated prose (negatives for the command threshold): prose_synth.py (ours, local) and prose_download.py (public domain, DGX only); not in examples/.
