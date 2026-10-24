# Coverage of the textedit world, Level 1 (generate.py seed 0, 5000 training sentences)

Legend sha256:cf7ec2555d8754cd8ca1e208735205304a4351ceae620ed98df28513de858d95. Templates 41, prefixes 11, combinations 451, held out 47.

Sentences per event and role (training file):

| event | n | unit | ordinal | match | format | value | position | new_text | widget |
|---|---|---|---|---|---|---|---|---|---|
| select | 488 | 309 | 123 | 219 |  |  | 97 |  | 36 |
| format | 1059 | 874 | 668 | 252 | 563 | 394 |  |  | 27 |
| unformat | 305 | 249 | 149 | 84 | 159 |  |  |  |  |
| insert | 481 | 95 | 95 | 192 |  |  | 481 | 481 |  |
| delete | 522 | 444 | 129 | 237 |  |  | 121 |  | 17 |
| replace | 552 | 219 | 181 | 371 |  |  |  | 552 |  |
| move_cursor | 348 | 179 | 179 | 81 |  |  | 260 |  |  |
| capitalise | 278 | 212 | 126 | 91 |  |  |  |  |  |
| make_list | 256 | 256 | 177 |  | 73 |  |  |  |  |
| make_heading | 272 | 272 | 225 |  | 138 |  |  |  |  |
| align | 160 | 160 | 121 |  |  | 93 |  |  |  |
| undo | 61 |  |  |  |  |  |  |  |  |
| redo | 77 |  |  |  |  |  |  |  |  |
| read_back | 141 | 141 | 58 |  |  |  |  |  |  |

Closed values seen in training (role: value count):

- unit: character 159, characters 45, everything 349, it 201, line 389, lines 162, list_item 170, list_items 56, paragraph 312, paragraphs 165, selection 145, sentence 357, sentences 140, that 248, word 471, words 41
- ordinal: fifth 197, first 186, first_2 32, first_3 43, first_4 38, first_5 46, fourth 195, last 195, last_2 42, last_3 33, last_4 29, last_5 43, next 154, next_2 36, next_3 33, next_4 48, next_5 44, previous 181, previous_2 43, previous_3 29, previous_4 37, previous_5 33, second 176, third 161, this 177
- format: bold 97, bullet_list 108, heading 85, heading_one 85, heading_three 71, heading_two 70, highlighted 52, italic 57, list 64, numbered_list 95, plain 47, strikethrough 55, underlined 47
- value: bigger 18, black 14, blue 42, center 22, gray 10, green 35, huge 28, justified 27, large 23, left 20, normal 16, orange 34, pink 45, purple 10, red 12, right 24, small 24, smaller 22, white 18, yellow 43
- position: after 197, at_end 310, at_start 255, before 197

Closed values never seen in training: none.

Pieces of text in training: 97 distinct match values, 105 distinct new_text values; widgets 12.

Evaluation files: eval_new_identities.sop 400 sentences; eval_heldout_formulations.sop 400 sentences.
Dictated prose (negatives for the command threshold): prose_synth.py (ours, local) and prose_download.py (public domain, DGX only); not in examples/.
