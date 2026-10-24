# Coverage of the animation world (generate.py seed 0, 30000 training sentences)

Legend sha256:32241c4a7a2fab6ca1823653119f554f63c1a1b99104c496f379d795af4304b3. Templates 55; formulations (template x start x duration x modifier x prefix) 78690, held out 8733. Moods in training: command 26978, question 3022.

Sentences per event and role (training file; the temporal roles of spec Table 12 first):

| event | n | start | tempo | ref | offset | trigger | duration | unit | per | speed | easing | repeat | object | color | relation | landmark | region | direction | distance | angle | traveller | source | via | target | path | NOT | questions |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| appear | 1874 | 456 | 1186 | 1063 | 212 | 412 | 1274 | 1273 |  |  |  |  | 1676 |  |  | 89 |  |  |  |  |  |  |  |  |  |  | object 198, start 114 |
| disappear | 1523 | 394 | 931 | 852 | 178 | 302 | 975 | 1033 |  |  |  |  | 1313 |  |  | 94 |  |  |  |  |  |  |  |  |  | 2 | object 210, start 109 |
| fade_in | 1477 | 291 | 973 | 880 | 173 | 251 | 990 | 969 |  | 363 | 479 |  | 1406 |  |  | 8 |  |  |  |  |  |  |  |  |  |  | object 71, start 129 |
| fade_out | 1209 | 268 | 841 | 765 | 168 | 268 | 967 | 958 |  | 329 | 449 |  | 1209 |  |  | 10 |  |  |  |  |  |  |  |  |  | 7 |  |
| blink | 985 | 169 | 626 | 570 | 113 | 190 | 609 | 590 |  | 215 |  | 280 | 930 |  |  | 8 |  |  |  |  |  |  |  |  |  |  | object 55, start 136 |
| pulse | 1086 | 204 | 663 | 588 | 130 | 166 | 704 | 693 |  | 255 |  | 334 | 1049 |  |  | 8 |  |  |  |  |  |  |  |  |  |  | object 37, start 153 |
| rotate | 585 | 123 | 430 | 375 | 77 | 108 | 470 | 445 |  | 123 | 140 | 163 | 585 |  |  | 4 |  |  |  | 275 |  |  |  |  |  | 1 |  |
| highlight | 1655 | 405 | 1007 | 928 | 180 | 342 | 970 | 1060 |  |  |  | 599 | 1373 |  |  | 92 |  |  |  |  |  |  |  |  |  |  | object 282, start 149 |
| travel | 3165 | 450 | 1898 | 1713 | 378 | 567 | 2036 | 1971 | 364 | 1322 | 923 |  |  |  |  | 27 |  |  |  |  | 3117 | 1857 | 630 | 1857 | 636 |  | object 48 |
| move | 1975 | 412 | 1421 | 1298 | 292 | 404 | 1497 | 1505 |  | 560 | 670 |  | 1910 |  | 600 | 615 | 379 | 931 | 931 |  |  |  |  |  |  | 7 | object 65 |
| change | 628 | 128 | 464 | 425 | 90 | 146 | 501 | 463 |  |  | 309 |  | 628 | 628 |  | 10 |  |  |  |  |  |  |  |  |  | 1 |  |
| wait | 638 | 154 | 430 | 401 | 81 | 154 | 638 | 638 |  |  |  |  |  |  |  | 7 |  |  |  |  |  |  |  |  |  |  |  |
| grow | 616 | 131 | 448 | 401 | 92 | 141 | 484 | 456 |  |  | 224 | 186 | 616 |  |  | 5 |  |  |  |  |  |  |  |  |  | 3 |  |
| shrink | 604 | 126 | 438 | 399 | 84 | 127 | 470 | 449 |  |  | 228 | 187 | 604 |  |  | 4 |  |  |  |  |  |  |  |  |  | 1 |  |
| walk | 1275 | 286 | 897 | 813 | 190 | 272 | 959 | 994 |  | 386 | 438 |  | 1275 |  |  | 8 |  |  |  |  |  |  |  | 1275 |  |  |  |
| jump | 648 | 142 | 461 | 411 | 80 | 124 | 473 | 461 |  | 163 |  | 227 | 608 |  |  | 8 |  |  |  |  |  |  |  |  |  |  | object 40 |
| wave | 874 | 197 | 619 | 559 | 107 | 187 | 685 | 663 |  | 245 |  | 322 | 874 |  |  | 6 |  |  |  |  |  |  |  |  |  |  |  |
| turn | 665 | 154 | 454 | 406 | 95 | 139 | 536 | 498 |  |  |  |  | 665 |  |  | 11 |  |  |  |  |  |  |  | 665 |  |  |  |
| nod | 635 | 146 | 449 | 407 | 88 | 142 | 495 | 451 |  |  |  | 318 | 635 |  |  | 5 |  |  |  |  |  |  |  |  |  |  |  |
| shake | 615 | 124 | 449 | 406 | 88 | 139 | 463 | 435 |  |  |  | 301 | 615 |  |  | 6 |  |  |  |  |  |  |  |  |  |  |  |
| bounce | 632 | 139 | 450 | 393 | 91 | 128 | 488 | 471 |  | 171 |  | 234 | 632 |  |  | 5 |  |  |  |  |  |  |  |  |  |  |  |
| play | 826 | 520 |  |  |  |  |  | 247 |  |  |  |  | 306 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| pause | 826 | 258 |  |  |  |  |  | 258 |  |  |  |  | 288 |  |  | 280 |  |  |  |  |  |  |  |  |  |  |  |
| rewind | 641 |  |  |  |  |  |  |  |  |  |  |  | 377 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| loop | 711 |  |  |  |  |  |  |  |  |  |  | 371 | 711 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| retime | 940 |  |  |  |  |  |  |  |  | 374 |  |  | 940 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| overlap | 741 |  |  |  |  |  |  |  |  |  |  |  | 741 |  |  | 741 |  |  |  |  |  |  |  |  |  | 741 |  |
| leave | 725 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 725 |  |  |  | 725 | 725 |  |
| last | 605 |  |  |  |  |  |  |  |  |  |  |  | 605 |  |  |  |  |  |  |  |  |  |  |  |  |  | duration 605 |
| locate | 621 | 380 | 241 | 241 |  | 241 |  | 380 |  |  |  |  |  |  |  |  |  |  |  |  | 621 |  |  |  |  |  | landmark 621 |

Closed values of the temporal roles (training file):

- tempo: after 4588, before 3108, then 1482, when 3501, while 1537, with 1560
- trigger: appears 882, arrives 1330, blinking 476, disappears 393, finishes 896, moving 479, traveling 494
- duration: instantly 1112, quickly 1104, slowly 1115
- unit: ms 3481, s 13880
- per: per_hop 364
- speed: fast 505, faster 635, half_as_fast 872, normal 520, slow 489, slower 631, twice_as_fast 854
- easing: bouncing 939, linearly 983, smoothly 976, suddenly 962
- repeat: NUM 2247, forever 638, once 637

Evaluation files: eval_new_identities.sop 400 sentences; eval_heldout_formulations.sop 400 sentences.

Every temporal role and every closed value of Table 12 occurs in training; every part (template, start phrase, duration phrase, modifier, prefix) of a held-out formulation occurs in training (asserted by generate.py).
