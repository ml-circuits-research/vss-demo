# Coverage of the animation world (generate.py seed 0, 20000 training sentences)

Legend sha256:04ecad9f34cb6c881091ba33688fd6f62f5e24f7ceb617d6332fc2f798378e36. Templates 55; formulations (template x start x duration x modifier x prefix) 78690, held out 8733. Moods in training: command 17984, question 2016.

Sentences per event and role (training file; the temporal roles of spec Table 12 first):

| event | n | start | tempo | ref | offset | trigger | duration | unit | per | speed | easing | repeat | object | color | relation | landmark | region | direction | distance | angle | traveller | source | via | target | path | NOT | questions |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| appear | 1284 | 302 | 833 | 740 | 137 | 301 | 886 | 858 |  |  |  |  | 1156 |  |  | 62 |  |  |  |  |  |  |  |  |  |  | object 128, start 76 |
| disappear | 971 | 251 | 601 | 549 | 111 | 191 | 616 | 662 |  |  |  |  | 842 |  |  | 56 |  |  |  |  |  |  |  |  |  | 1 | object 129, start 72 |
| fade_in | 976 | 196 | 636 | 576 | 102 | 152 | 635 | 625 |  | 230 | 314 |  | 924 |  |  | 5 |  |  |  |  |  |  |  |  |  |  | object 52, start 94 |
| fade_out | 779 | 166 | 550 | 494 | 113 | 172 | 625 | 614 |  | 219 | 288 |  | 779 |  |  | 5 |  |  |  |  |  |  |  |  |  | 6 |  |
| blink | 665 | 108 | 430 | 394 | 72 | 143 | 417 | 383 |  | 134 |  | 193 | 625 |  |  | 6 |  |  |  |  |  |  |  |  |  |  | object 40, start 90 |
| pulse | 707 | 124 | 436 | 382 | 91 | 113 | 453 | 448 |  | 166 |  | 219 | 685 |  |  | 4 |  |  |  |  |  |  |  |  |  |  | object 22, start 106 |
| rotate | 399 | 80 | 296 | 256 | 54 | 78 | 325 | 303 |  | 80 | 100 | 109 | 399 |  |  | 3 |  |  |  | 191 |  |  |  |  |  | 1 |  |
| highlight | 1125 | 266 | 689 | 633 | 118 | 225 | 670 | 723 |  |  |  | 402 | 941 |  |  | 62 |  |  |  |  |  |  |  |  |  |  | object 184, start 101 |
| travel | 2128 | 284 | 1297 | 1161 | 269 | 379 | 1382 | 1340 | 262 | 885 | 620 |  |  |  |  | 20 |  |  |  |  | 2096 | 1268 | 433 | 1268 | 426 |  | object 32 |
| move | 1304 | 274 | 927 | 842 | 195 | 260 | 992 | 995 |  | 351 | 453 |  | 1258 |  | 383 | 391 | 255 | 620 | 620 |  |  |  |  |  |  | 6 | object 46 |
| change | 427 | 89 | 312 | 285 | 65 | 92 | 342 | 325 |  |  | 209 |  | 427 | 427 |  | 7 |  |  |  |  |  |  |  |  |  |  |  |
| wait | 424 | 100 | 295 | 279 | 53 | 110 | 424 | 424 |  |  |  |  |  |  |  | 4 |  |  |  |  |  |  |  |  |  |  |  |
| grow | 413 | 98 | 293 | 263 | 55 | 94 | 324 | 311 |  |  | 148 | 136 | 413 |  |  | 4 |  |  |  |  |  |  |  |  |  | 1 |  |
| shrink | 420 | 91 | 304 | 278 | 51 | 95 | 321 | 307 |  |  | 159 | 121 | 420 |  |  | 4 |  |  |  |  |  |  |  |  |  | 1 |  |
| walk | 857 | 198 | 605 | 555 | 138 | 175 | 627 | 660 |  | 254 | 297 |  | 857 |  |  | 6 |  |  |  |  |  |  |  | 857 |  |  |  |
| jump | 426 | 101 | 296 | 266 | 54 | 84 | 307 | 303 |  | 112 |  | 145 | 398 |  |  | 6 |  |  |  |  |  |  |  |  |  |  | object 28 |
| wave | 566 | 127 | 401 | 365 | 64 | 133 | 448 | 432 |  | 148 |  | 223 | 566 |  |  | 3 |  |  |  |  |  |  |  |  |  |  |  |
| turn | 443 | 103 | 302 | 270 | 61 | 87 | 363 | 335 |  |  |  |  | 443 |  |  | 7 |  |  |  |  |  |  |  | 443 |  |  |  |
| nod | 414 | 99 | 292 | 266 | 49 | 95 | 329 | 295 |  |  |  | 203 | 414 |  |  | 2 |  |  |  |  |  |  |  |  |  |  |  |
| shake | 423 | 84 | 313 | 280 | 59 | 102 | 325 | 297 |  |  |  | 203 | 423 |  |  | 4 |  |  |  |  |  |  |  |  |  |  |  |
| bounce | 412 | 85 | 294 | 256 | 60 | 80 | 321 | 305 |  | 113 |  | 154 | 412 |  |  | 3 |  |  |  |  |  |  |  |  |  |  |  |
| play | 578 | 357 |  |  |  |  |  | 162 |  |  |  |  | 221 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| pause | 573 | 163 |  |  |  |  |  | 163 |  |  |  |  | 209 |  |  | 201 |  |  |  |  |  |  |  |  |  |  |  |
| rewind | 431 |  |  |  |  |  |  |  |  |  |  |  | 248 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| loop | 464 |  |  |  |  |  |  |  |  |  |  | 234 | 464 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| retime | 600 |  |  |  |  |  |  |  |  | 234 |  |  | 600 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| overlap | 491 |  |  |  |  |  |  |  |  |  |  |  | 491 |  |  | 491 |  |  |  |  |  |  |  |  |  | 491 |  |
| leave | 484 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 484 |  |  |  | 484 | 484 |  |
| last | 395 |  |  |  |  |  |  |  |  |  |  |  | 395 |  |  |  |  |  |  |  |  |  |  |  |  |  | duration 395 |
| locate | 421 | 255 | 166 | 166 |  | 166 |  | 255 |  |  |  |  |  |  |  |  |  |  |  |  | 421 |  |  |  |  |  | landmark 421 |

Closed values of the temporal roles (training file):

- tempo: after 3055, before 2072, then 1012, when 2354, while 1033, with 1042
- trigger: appears 579, arrives 909, blinking 316, disappears 268, finishes 598, moving 311, traveling 346
- duration: instantly 724, quickly 726, slowly 765
- unit: ms 2310, s 9215
- per: per_hop 262
- speed: fast 335, faster 416, half_as_fast 585, normal 323, slow 318, slower 408, twice_as_fast 541
- easing: bouncing 655, linearly 640, smoothly 668, suddenly 625
- repeat: NUM 1483, forever 430, once 429

Evaluation files: eval_new_identities.sop 400 sentences; eval_heldout_formulations.sop 400 sentences.

Every temporal role and every closed value of Table 12 occurs in training; every part (template, start phrase, duration phrase, modifier, prefix) of a held-out formulation occurs in training (asserted by generate.py).
