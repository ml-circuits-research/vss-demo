# Coverage of the animation world (generate.py seed 0, 400 training sentences)

Legend sha256:32241c4a7a2fab6ca1823653119f554f63c1a1b99104c496f379d795af4304b3. Templates 55; formulations (template x start x duration x modifier x prefix) 78690, held out 8733. Moods in training: command 365, question 35.

Sentences per event and role (training file; the temporal roles of spec Table 12 first):

| event | n | start | tempo | ref | offset | trigger | duration | unit | per | speed | easing | repeat | object | color | relation | landmark | region | direction | distance | angle | traveller | source | via | target | path | NOT | questions |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| appear | 28 | 2 | 23 | 21 | 5 | 5 | 19 | 15 |  |  |  |  | 27 |  |  |  |  |  |  |  |  |  |  |  |  |  | object 1, start 1 |
| disappear | 27 | 4 | 17 | 15 | 1 | 5 | 17 | 18 |  |  |  |  | 24 |  |  | 2 |  |  |  |  |  |  |  |  |  |  | object 3, start 3 |
| fade_in | 18 | 2 | 14 | 12 | 1 | 3 | 12 | 11 |  | 6 | 3 |  | 16 |  |  |  |  |  |  |  |  |  |  |  |  |  | object 2, start 1 |
| fade_out | 14 | 2 | 12 | 12 | 4 | 5 | 11 | 12 |  | 2 | 5 |  | 14 |  |  | 1 |  |  |  |  |  |  |  |  |  |  |  |
| blink | 10 | 2 | 6 | 5 |  | 1 | 7 | 4 |  | 2 |  | 5 | 10 |  |  |  |  |  |  |  |  |  |  |  |  |  | start 2 |
| pulse | 12 | 1 | 7 | 4 |  | 3 | 9 | 9 |  | 7 |  | 2 | 12 |  |  |  |  |  |  |  |  |  |  |  |  |  | start 1 |
| rotate | 9 | 1 | 8 | 7 | 2 | 2 | 6 | 6 |  | 3 | 2 | 3 | 9 |  |  |  |  |  |  | 4 |  |  |  |  |  |  |  |
| highlight | 22 | 7 | 13 | 13 | 2 | 3 | 14 | 17 |  |  |  | 10 | 20 |  |  | 1 |  |  |  |  |  |  |  |  |  |  | object 2, start 2 |
| travel | 44 | 2 | 29 | 24 | 3 | 7 | 23 | 22 | 4 | 20 | 12 |  |  |  |  | 1 |  |  |  |  | 44 | 26 | 8 | 26 | 8 |  |  |
| move | 24 | 2 | 20 | 20 | 8 | 4 | 21 | 21 |  | 1 | 13 |  | 23 |  | 7 | 7 | 3 | 13 | 13 |  |  |  |  |  |  |  | object 1 |
| change | 11 | 4 | 6 | 6 | 1 | 3 | 10 | 9 |  |  | 4 |  | 11 | 11 |  |  |  |  |  |  |  |  |  |  |  |  |  |
| wait | 10 | 1 | 9 | 9 | 1 | 5 | 10 | 10 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| grow | 7 |  | 6 | 5 | 3 | 1 | 7 | 4 |  |  | 2 | 2 | 7 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| shrink | 5 | 2 | 3 | 3 |  | 2 | 2 | 4 |  |  | 1 |  | 5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| walk | 12 | 6 | 6 | 6 |  | 5 | 10 | 9 |  | 1 | 4 |  | 12 |  |  |  |  |  |  |  |  |  |  | 12 |  |  |  |
| jump | 9 | 3 | 6 | 6 | 1 | 3 | 5 | 7 |  | 3 |  | 5 | 9 |  |  | 1 |  |  |  |  |  |  |  |  |  |  |  |
| wave | 12 |  | 12 | 10 | 2 | 4 | 9 | 5 |  | 3 |  | 6 | 12 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| turn | 10 | 3 | 5 | 5 | 1 | 1 | 8 | 8 |  |  |  |  | 10 |  |  |  |  |  |  |  |  |  |  | 10 |  |  |  |
| nod | 10 | 8 | 2 | 1 | 1 |  | 8 | 10 |  |  |  | 4 | 10 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| shake | 10 |  | 10 | 10 | 1 | 5 | 9 | 4 |  |  |  | 6 | 10 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| bounce | 7 | 1 | 6 | 5 |  | 2 | 5 | 2 |  | 1 |  | 3 | 7 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| play | 15 | 4 |  |  |  |  |  | 2 |  |  |  |  | 11 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| pause | 19 | 3 |  |  |  |  |  | 3 |  |  |  |  | 9 |  |  | 7 |  |  |  |  |  |  |  |  |  |  |  |
| rewind | 9 |  |  |  |  |  |  |  |  |  |  |  | 7 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| loop | 5 |  |  |  |  |  |  |  |  |  |  | 3 | 5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| retime | 5 |  |  |  |  |  |  |  |  | 3 |  |  | 5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| overlap | 8 |  |  |  |  |  |  |  |  |  |  |  | 8 |  |  | 8 |  |  |  |  |  |  |  |  |  | 8 |  |
| leave | 12 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 12 |  |  |  | 12 | 12 |  |
| last | 8 |  |  |  |  |  |  |  |  |  |  |  | 8 |  |  |  |  |  |  |  |  |  |  |  |  |  | duration 8 |
| locate | 8 | 5 | 3 | 3 |  | 3 |  | 5 |  |  |  |  |  |  |  |  |  |  |  |  | 8 |  |  |  |  |  | landmark 8 |

Closed values of the temporal roles (training file):

- tempo: after 72, before 39, then 21, when 51, while 21, with 19
- trigger: appears 10, arrives 20, blinking 7, disappears 9, finishes 12, moving 4, traveling 10
- duration: instantly 23, quickly 18, slowly 19
- unit: ms 42, s 175
- per: per_hop 4
- speed: fast 4, faster 10, half_as_fast 10, normal 4, slow 5, slower 8, twice_as_fast 11
- easing: bouncing 7, linearly 11, smoothly 13, suddenly 15
- repeat: NUM 33, forever 7, once 9

Evaluation files: eval_new_identities.sop 60 sentences; eval_heldout_formulations.sop 60 sentences.

Every temporal role and every closed value of Table 12 occurs in training; every part (template, start phrase, duration phrase, modifier, prefix) of a held-out formulation occurs in training (asserted by generate.py).
