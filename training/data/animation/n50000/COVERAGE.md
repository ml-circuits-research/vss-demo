# Coverage of the animation world (generate.py seed 0, 50000 training sentences)

Legend sha256:32241c4a7a2fab6ca1823653119f554f63c1a1b99104c496f379d795af4304b3. Templates 55; formulations (template x start x duration x modifier x prefix) 78690, held out 8733. Moods in training: command 44938, question 5062.

Sentences per event and role (training file; the temporal roles of spec Table 12 first):

| event | n | start | tempo | ref | offset | trigger | duration | unit | per | speed | easing | repeat | object | color | relation | landmark | region | direction | distance | angle | traveller | source | via | target | path | NOT | questions |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| appear | 3238 | 782 | 2058 | 1855 | 377 | 733 | 2167 | 2187 |  |  |  |  | 2891 |  |  | 169 |  |  |  |  |  |  |  |  |  |  | object 347, start 193 |
| disappear | 2589 | 655 | 1586 | 1448 | 288 | 535 | 1616 | 1718 |  |  |  |  | 2237 |  |  | 163 |  |  |  |  |  |  |  |  |  | 4 | object 352, start 200 |
| fade_in | 2415 | 450 | 1602 | 1454 | 291 | 428 | 1639 | 1596 |  | 582 | 789 |  | 2309 |  |  | 25 |  |  |  |  |  |  |  |  |  |  | object 106, start 220 |
| fade_out | 2013 | 433 | 1407 | 1265 | 279 | 438 | 1621 | 1588 |  | 556 | 743 |  | 2013 |  |  | 17 |  |  |  |  |  |  |  |  |  | 8 |  |
| blink | 1665 | 273 | 1078 | 993 | 196 | 311 | 1051 | 1004 |  | 366 |  | 465 | 1558 |  |  | 15 |  |  |  |  |  |  |  |  |  |  | object 107, start 230 |
| pulse | 1835 | 321 | 1176 | 1045 | 233 | 293 | 1196 | 1173 |  | 428 |  | 540 | 1760 |  |  | 15 |  |  |  |  |  |  |  |  |  |  | object 75, start 238 |
| rotate | 976 | 214 | 694 | 610 | 130 | 193 | 780 | 749 |  | 208 | 232 | 268 | 976 |  |  | 9 |  |  |  | 487 |  |  |  |  |  | 3 |  |
| highlight | 2713 | 650 | 1683 | 1545 | 296 | 559 | 1603 | 1742 |  |  |  | 978 | 2265 |  |  | 145 |  |  |  |  |  |  |  |  |  |  | object 448, start 231 |
| travel | 5220 | 712 | 3128 | 2833 | 613 | 925 | 3361 | 3241 | 602 | 2228 | 1484 |  |  |  |  | 56 |  |  |  |  | 5132 | 3026 | 1031 | 3026 | 1053 |  | object 88 |
| move | 3256 | 678 | 2346 | 2134 | 491 | 658 | 2476 | 2478 |  | 913 | 1111 |  | 3145 |  | 967 | 989 | 641 | 1537 | 1537 |  |  |  |  |  |  | 12 | object 111 |
| change | 1003 | 205 | 742 | 667 | 154 | 237 | 797 | 746 |  |  | 513 |  | 1003 | 1003 |  | 15 |  |  |  |  |  |  |  |  |  | 1 |  |
| wait | 1043 | 247 | 707 | 645 | 131 | 232 | 1043 | 1043 |  |  |  |  |  |  |  | 10 |  |  |  |  |  |  |  |  |  |  |  |
| grow | 1068 | 227 | 770 | 690 | 154 | 243 | 833 | 780 |  |  | 393 | 314 | 1068 |  |  | 7 |  |  |  |  |  |  |  |  |  | 6 |  |
| shrink | 1042 | 221 | 754 | 681 | 147 | 231 | 823 | 770 |  |  | 384 | 326 | 1042 |  |  | 11 |  |  |  |  |  |  |  |  |  | 2 |  |
| walk | 2111 | 452 | 1509 | 1357 | 300 | 471 | 1619 | 1651 |  | 645 | 714 |  | 2111 |  |  | 19 |  |  |  |  |  |  |  | 2111 |  |  |  |
| jump | 1083 | 243 | 764 | 694 | 131 | 202 | 779 | 763 |  | 266 |  | 358 | 1005 |  |  | 11 |  |  |  |  |  |  |  |  |  |  | object 78 |
| wave | 1535 | 336 | 1096 | 991 | 205 | 324 | 1194 | 1180 |  | 475 |  | 531 | 1535 |  |  | 15 |  |  |  |  |  |  |  |  |  |  |  |
| turn | 1067 | 244 | 739 | 656 | 153 | 230 | 865 | 796 |  |  |  |  | 1067 |  |  | 15 |  |  |  |  |  |  |  | 1067 |  |  |  |
| nod | 1032 | 224 | 743 | 669 | 156 | 235 | 820 | 741 |  |  |  | 522 | 1032 |  |  | 8 |  |  |  |  |  |  |  |  |  |  |  |
| shake | 1019 | 207 | 748 | 673 | 140 | 229 | 783 | 735 |  |  |  | 505 | 1019 |  |  | 11 |  |  |  |  |  |  |  |  |  |  |  |
| bounce | 1028 | 227 | 734 | 654 | 147 | 225 | 815 | 786 |  | 286 |  | 366 | 1028 |  |  | 8 |  |  |  |  |  |  |  |  |  |  |  |
| play | 1356 | 867 |  |  |  |  |  | 418 |  |  |  |  | 489 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| pause | 1358 | 423 |  |  |  |  |  | 423 |  |  |  |  | 479 |  |  | 456 |  |  |  |  |  |  |  |  |  |  |  |
| rewind | 1079 |  |  |  |  |  |  |  |  |  |  |  | 640 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| loop | 1220 |  |  |  |  |  |  |  |  |  |  | 630 | 1220 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| retime | 1538 |  |  |  |  |  |  |  |  | 608 |  |  | 1538 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| overlap | 1228 |  |  |  |  |  |  |  |  |  |  |  | 1228 |  |  | 1228 |  |  |  |  |  |  |  |  |  | 1228 |  |
| leave | 1232 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 1232 |  |  |  | 1232 | 1232 |  |
| last | 1031 |  |  |  |  |  |  |  |  |  |  |  | 1031 |  |  |  |  |  |  |  |  |  |  |  |  |  | duration 1031 |
| locate | 1007 | 615 | 392 | 392 |  | 392 |  | 615 |  |  |  |  |  |  |  |  |  |  |  |  | 1007 |  |  |  |  |  | landmark 1007 |

Closed values of the temporal roles (training file):

- tempo: after 7716, before 5182, then 2505, when 5829, while 2643, with 2581
- trigger: appears 1420, arrives 2271, blinking 843, disappears 641, finishes 1497, moving 830, traveling 822
- duration: instantly 1863, quickly 1833, slowly 1843
- unit: ms 5933, s 22990
- per: per_hop 602
- speed: fast 840, faster 1095, half_as_fast 1417, normal 862, slow 820, slower 1115, twice_as_fast 1412
- easing: bouncing 1569, linearly 1606, smoothly 1585, suddenly 1603
- repeat: NUM 3719, forever 1052, once 1032

Evaluation files: eval_new_identities.sop 400 sentences; eval_heldout_formulations.sop 400 sentences.

Every temporal role and every closed value of Table 12 occurs in training; every part (template, start phrase, duration phrase, modifier, prefix) of a held-out formulation occurs in training (asserted by generate.py).
