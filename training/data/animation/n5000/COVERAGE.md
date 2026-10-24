# Coverage of the animation world (generate.py seed 0, 5000 training sentences)

Legend sha256:32241c4a7a2fab6ca1823653119f554f63c1a1b99104c496f379d795af4304b3. Templates 55; formulations (template x start x duration x modifier x prefix) 78690, held out 8733. Moods in training: command 4503, question 497.

Sentences per event and role (training file; the temporal roles of spec Table 12 first):

| event | n | start | tempo | ref | offset | trigger | duration | unit | per | speed | easing | repeat | object | color | relation | landmark | region | direction | distance | angle | traveller | source | via | target | path | NOT | questions |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| appear | 341 | 77 | 217 | 196 | 37 | 80 | 241 | 228 |  |  |  |  | 310 |  |  | 13 |  |  |  |  |  |  |  |  |  |  | object 31, start 23 |
| disappear | 245 | 64 | 142 | 134 | 28 | 43 | 157 | 166 |  |  |  |  | 210 |  |  | 13 |  |  |  |  |  |  |  |  |  |  | object 35, start 22 |
| fade_in | 228 | 48 | 150 | 137 | 18 | 34 | 148 | 142 |  | 65 | 67 |  | 213 |  |  | 2 |  |  |  |  |  |  |  |  |  |  | object 15, start 21 |
| fade_out | 208 | 36 | 157 | 143 | 40 | 44 | 158 | 163 |  | 65 | 71 |  | 208 |  |  | 1 |  |  |  |  |  |  |  |  |  | 3 |  |
| blink | 140 | 25 | 90 | 82 | 15 | 31 | 87 | 82 |  | 31 |  | 37 | 131 |  |  | 2 |  |  |  |  |  |  |  |  |  |  | object 9, start 17 |
| pulse | 176 | 31 | 109 | 93 | 22 | 26 | 109 | 106 |  | 45 |  | 47 | 169 |  |  | 1 |  |  |  |  |  |  |  |  |  |  | object 7, start 27 |
| rotate | 97 | 15 | 74 | 58 | 10 | 21 | 73 | 71 |  | 19 | 30 | 23 | 97 |  |  | 1 |  |  |  | 46 |  |  |  |  |  | 1 |  |
| highlight | 281 | 72 | 160 | 145 | 25 | 57 | 170 | 182 |  |  |  | 98 | 237 |  |  | 19 |  |  |  |  |  |  |  |  |  |  | object 44, start 27 |
| travel | 553 | 58 | 353 | 315 | 75 | 94 | 352 | 341 | 64 | 238 | 165 |  |  |  |  | 6 |  |  |  |  | 546 | 326 | 120 | 326 | 112 |  | object 7 |
| move | 334 | 64 | 243 | 224 | 47 | 66 | 258 | 255 |  | 85 | 126 |  | 317 |  | 88 | 88 | 59 | 170 | 170 |  |  |  |  |  |  | 1 | object 17 |
| change | 96 | 20 | 66 | 61 | 12 | 24 | 78 | 72 |  |  | 47 |  | 96 | 96 |  | 1 |  |  |  |  |  |  |  |  |  |  |  |
| wait | 117 | 32 | 76 | 73 | 11 | 33 | 117 | 117 |  |  |  |  |  |  |  | 1 |  |  |  |  |  |  |  |  |  |  |  |
| grow | 105 | 25 | 74 | 67 | 18 | 21 | 82 | 81 |  |  | 40 | 31 | 105 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| shrink | 93 | 19 | 69 | 65 | 10 | 28 | 67 | 70 |  |  | 40 | 22 | 93 |  |  | 1 |  |  |  |  |  |  |  |  |  |  |  |
| walk | 209 | 60 | 137 | 124 | 32 | 41 | 154 | 169 |  | 69 | 69 |  | 209 |  |  | 2 |  |  |  |  |  |  |  | 209 |  |  |  |
| jump | 102 | 24 | 73 | 70 | 17 | 22 | 76 | 79 |  | 20 |  | 38 | 95 |  |  | 1 |  |  |  |  |  |  |  |  |  |  | object 7 |
| wave | 142 | 24 | 108 | 99 | 16 | 35 | 112 | 101 |  | 34 |  | 61 | 142 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| turn | 116 | 27 | 77 | 71 | 16 | 26 | 96 | 90 |  |  |  |  | 116 |  |  | 1 |  |  |  |  |  |  |  | 116 |  |  |  |
| nod | 112 | 29 | 80 | 71 | 16 | 24 | 86 | 79 |  |  |  | 51 | 112 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| shake | 101 | 22 | 75 | 67 | 15 | 26 | 77 | 73 |  |  |  | 52 | 101 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| bounce | 98 | 18 | 73 | 64 | 17 | 14 | 76 | 73 |  | 20 |  | 40 | 98 |  |  | 1 |  |  |  |  |  |  |  |  |  |  |  |
| play | 154 | 99 |  |  |  |  |  | 46 |  |  |  |  | 55 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| pause | 154 | 40 |  |  |  |  |  | 40 |  |  |  |  | 52 |  |  | 62 |  |  |  |  |  |  |  |  |  |  |  |
| rewind | 102 |  |  |  |  |  |  |  |  |  |  |  | 65 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| loop | 118 |  |  |  |  |  |  |  |  |  |  | 64 | 118 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| retime | 135 |  |  |  |  |  |  |  |  | 50 |  |  | 135 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| overlap | 116 |  |  |  |  |  |  |  |  |  |  |  | 116 |  |  | 116 |  |  |  |  |  |  |  |  |  | 116 |  |
| leave | 139 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 139 |  |  |  | 139 | 139 |  |
| last | 83 |  |  |  |  |  |  |  |  |  |  |  | 83 |  |  |  |  |  |  |  |  |  |  |  |  |  | duration 83 |
| locate | 105 | 64 | 41 | 41 |  | 41 |  | 64 |  |  |  |  |  |  |  |  |  |  |  |  | 105 |  |  |  |  |  | landmark 105 |

Closed values of the temporal roles (training file):

- tempo: after 758, before 529, then 244, when 595, while 250, with 268
- trigger: appears 147, arrives 229, blinking 86, disappears 70, finishes 149, moving 66, traveling 84
- duration: instantly 184, quickly 181, slowly 188
- unit: ms 583, s 2307
- per: per_hop 64
- speed: fast 75, faster 110, half_as_fast 156, normal 90, slow 74, slower 94, twice_as_fast 142
- easing: bouncing 160, linearly 172, smoothly 171, suddenly 152
- repeat: NUM 348, forever 105, once 111

Evaluation files: eval_new_identities.sop 400 sentences; eval_heldout_formulations.sop 400 sentences.

Every temporal role and every closed value of Table 12 occurs in training; every part (template, start phrase, duration phrase, modifier, prefix) of a held-out formulation occurs in training (asserted by generate.py).
