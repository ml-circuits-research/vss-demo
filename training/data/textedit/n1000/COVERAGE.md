# Coverage of the textedit world, Level 1 (generate.py seed 0, 1000 training sentences)

Legend sha256:4c42eb08b9dd51b958b09338798336accc00cfc7d2efb6aae0d88b4749e5c5cd. Templates 41, prefixes 11, combinations 451, held out 47.

Sentences per event and role (training file):

| event | n | unit | ordinal | match | format | value | position | new_text | widget |
|---|---|---|---|---|---|---|---|---|---|
| select | 90 | 57 | 24 | 39 |  |  | 15 |  | 5 |
| format | 212 | 165 | 123 | 59 | 102 | 90 |  |  | 8 |
| unformat | 50 | 41 | 21 | 13 | 26 |  |  |  |  |
| insert | 105 | 16 | 16 | 48 |  |  | 105 | 105 |  |
| delete | 116 | 98 | 32 | 48 |  |  | 26 |  | 2 |
| replace | 112 | 50 | 44 | 68 |  |  |  | 112 |  |
| move_cursor | 83 | 38 | 38 | 22 |  |  | 65 |  |  |
| capitalise | 61 | 48 | 27 | 21 |  |  |  |  |  |
| make_list | 47 | 47 | 37 |  | 15 |  |  |  |  |
| make_heading | 50 | 50 | 46 |  | 23 |  |  |  |  |
| align | 24 | 24 | 19 |  |  | 14 |  |  |  |
| undo | 10 |  |  |  |  |  |  |  |  |
| redo | 10 |  |  |  |  |  |  |  |  |
| read_back | 30 | 30 | 13 |  |  |  |  |  |  |

Closed values seen in training (role: value count):

- unit: character 31, characters 7, everything 65, it 39, line 76, lines 31, list_item 35, list_items 10, paragraph 61, paragraphs 34, selection 26, sentence 63, sentences 28, that 54, word 98, words 6
- ordinal: fifth 40, first 33, first_2 6, first_3 13, first_4 11, first_5 7, fourth 40, last 37, last_2 9, last_3 2, last_4 7, last_5 7, next 26, next_2 3, next_3 5, next_4 9, next_5 9, previous 36, previous_2 8, previous_3 8, previous_4 4, previous_5 8, second 34, third 35, this 43
- format: bold 21, bullet_list 15, heading 16, heading_one 20, heading_three 13, heading_two 11, highlighted 11, italic 6, list 7, numbered_list 20, plain 8, strikethrough 12, underlined 6
- value: bigger 4, black 2, blue 10, center 5, gray 2, green 5, huge 9, justified 2, large 6, left 3, normal 4, orange 9, pink 12, purple 1, red 3, right 4, small 2, smaller 6, white 4, yellow 11
- position: after 45, at_end 62, at_start 53, before 51

Closed values never seen in training: none.

Pieces of text in training: 94 distinct match values, 97 distinct new_text values; widgets 8.

Evaluation files: eval_new_identities.sop 400 sentences; eval_heldout_formulations.sop 400 sentences.
Dictated prose (negatives for the command threshold): prose_synth.py (ours, local) and prose_download.py (public domain, DGX only); not in examples/.
