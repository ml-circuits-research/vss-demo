# Coverage of the animation world (generate.py seed 0, 1000 training sentences)

Legend sha256:04ecad9f34cb6c881091ba33688fd6f62f5e24f7ceb617d6332fc2f798378e36. Templates 55; formulations (template x start x duration x modifier x prefix) 78690, held out 8733. Moods in training: command 892, question 108.

Sentences per event and role (training file; the temporal roles of spec Table 12 first):

| event | n | start | tempo | ref | offset | trigger | duration | unit | per | speed | easing | repeat | object | color | relation | landmark | region | direction | distance | angle | traveller | source | via | target | path | NOT | questions |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| appear | 73 | 12 | 49 | 43 | 9 | 11 | 48 | 45 |  |  |  |  | 67 |  |  | 1 |  |  |  |  |  |  |  |  |  |  | object 6, start 8 |
| disappear | 52 | 9 | 33 | 30 | 3 | 13 | 35 | 37 |  |  |  |  | 45 |  |  | 4 |  |  |  |  |  |  |  |  |  |  | object 7, start 5 |
| fade_in | 41 | 6 | 31 | 28 | 2 | 8 | 26 | 25 |  | 15 | 11 |  | 38 |  |  |  |  |  |  |  |  |  |  |  |  |  | object 3, start 3 |
| fade_out | 43 | 7 | 36 | 34 | 11 | 10 | 31 | 35 |  | 10 | 14 |  | 43 |  |  | 1 |  |  |  |  |  |  |  |  |  |  |  |
| blink | 22 | 5 | 14 | 13 | 1 | 3 | 13 | 11 |  | 4 |  | 9 | 21 |  |  |  |  |  |  |  |  |  |  |  |  |  | object 1, start 3 |
| pulse | 39 | 6 | 22 | 17 | 4 | 6 | 24 | 25 |  | 12 |  | 7 | 39 |  |  |  |  |  |  |  |  |  |  |  |  |  | start 6 |
| rotate | 19 | 2 | 17 | 14 | 4 | 5 | 13 | 13 |  | 4 | 3 | 7 | 19 |  |  |  |  |  |  | 9 |  |  |  |  |  |  |  |
| highlight | 61 | 15 | 37 | 34 | 4 | 14 | 39 | 45 |  |  |  | 24 | 52 |  |  | 5 |  |  |  |  |  |  |  |  |  |  | object 9, start 6 |
| travel | 97 | 6 | 64 | 57 | 7 | 21 | 57 | 54 | 8 | 44 | 26 |  |  |  |  | 2 |  |  |  |  | 96 | 53 | 20 | 53 | 19 |  | object 1 |
| move | 65 | 9 | 50 | 48 | 15 | 10 | 53 | 52 |  | 8 | 31 |  | 63 |  | 14 | 14 | 11 | 38 | 38 |  |  |  |  |  |  |  | object 2 |
| change | 21 | 5 | 13 | 13 | 4 | 5 | 19 | 16 |  |  | 9 |  | 21 | 21 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| wait | 24 | 8 | 15 | 15 | 1 | 9 | 24 | 24 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| grow | 19 | 5 | 12 | 11 | 5 | 2 | 17 | 14 |  |  | 5 | 7 | 19 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| shrink | 12 | 4 | 5 | 5 |  | 4 | 6 | 7 |  |  | 3 | 2 | 12 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| walk | 41 | 16 | 25 | 22 | 5 | 10 | 30 | 33 |  | 11 | 13 |  | 41 |  |  |  |  |  |  |  |  |  |  | 41 |  |  |  |
| jump | 24 | 7 | 16 | 16 | 4 | 7 | 16 | 20 |  | 5 |  | 9 | 22 |  |  | 1 |  |  |  |  |  |  |  |  |  |  | object 2 |
| wave | 30 | 3 | 26 | 22 | 4 | 11 | 24 | 20 |  | 7 |  | 10 | 30 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| turn | 25 | 7 | 15 | 15 | 3 | 5 | 20 | 19 |  |  |  |  | 25 |  |  | 1 |  |  |  |  |  |  |  | 25 |  |  |  |
| nod | 19 | 10 | 9 | 7 | 2 | 2 | 16 | 15 |  |  |  | 7 | 19 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| shake | 24 | 4 | 19 | 18 | 3 | 7 | 19 | 15 |  |  |  | 12 | 24 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| bounce | 19 | 2 | 17 | 14 | 3 | 4 | 15 | 10 |  | 3 |  | 9 | 19 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| play | 24 | 10 |  |  |  |  |  | 4 |  |  |  |  | 14 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| pause | 29 | 6 |  |  |  |  |  | 6 |  |  |  |  | 12 |  |  | 11 |  |  |  |  |  |  |  |  |  |  |  |
| rewind | 24 |  |  |  |  |  |  |  |  |  |  |  | 17 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| loop | 25 |  |  |  |  |  |  |  |  |  |  | 15 | 25 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| retime | 28 |  |  |  |  |  |  |  |  | 13 |  |  | 28 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| overlap | 27 |  |  |  |  |  |  |  |  |  |  |  | 27 |  |  | 27 |  |  |  |  |  |  |  |  |  | 27 |  |
| leave | 27 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 27 |  |  |  | 27 | 27 |  |
| last | 21 |  |  |  |  |  |  |  |  |  |  |  | 21 |  |  |  |  |  |  |  |  |  |  |  |  |  | duration 21 |
| locate | 25 | 16 | 9 | 9 |  | 9 |  | 16 |  |  |  |  |  |  |  |  |  |  |  |  | 25 |  |  |  |  |  | landmark 25 |

Closed values of the temporal roles (training file):

- tempo: after 154, before 99, then 49, when 122, while 56, with 54
- trigger: appears 26, arrives 49, blinking 20, disappears 18, finishes 29, moving 12, traveling 22
- duration: instantly 48, quickly 38, slowly 35
- unit: ms 105, s 456
- per: per_hop 8
- speed: fast 13, faster 16, half_as_fast 34, normal 12, slow 16, slower 21, twice_as_fast 24
- easing: bouncing 21, linearly 32, smoothly 34, suddenly 28
- repeat: NUM 74, forever 25, once 19

Evaluation files: eval_new_identities.sop 400 sentences; eval_heldout_formulations.sop 400 sentences.

Every temporal role and every closed value of Table 12 occurs in training; every part (template, start phrase, duration phrase, modifier, prefix) of a held-out formulation occurs in training (asserted by generate.py).
