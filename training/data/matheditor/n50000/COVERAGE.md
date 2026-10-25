# Coverage of the matheditor world (generate.py seed 0, n = 50000)

Legend sha256:d3614ed01b01467dc66ea830d626de1bcdea401b9307374af0c7fa072de991a8. Training: 35000 formulas and 15000 commands. Verbaliser candidates rejected (the drawn tree was not a reading of its own sentence, or a command was not read back): 0.

## Formulas in training

| tree depth | sentences |
|---|---|
| 0 | 44 |
| 1 | 12650 |
| 2 | 22306 |

| readings per sentence | sentences |
|---|---|
| 1 | 30800 |
| 2 | 4131 |
| 4 | 69 |

| family | sentences |
|---|---|
| textbook | 9105 |
| informal | 7741 |
| delimited | 8764 |
| spelled | 9390 |

| operator | nodes | roles (count) |
|---|---|---|
| plus | 8878 | left 8878, right 8878 |
| minus | 6068 | left 6068, right 6068 |
| times | 5807 | left 5807, right 5807 |
| fraction | 9670 | numerator 9670, denominator 9670 |
| power | 8641 | base 8641, exponent 8641 |
| subscript | 2487 | base 2487, index 2487 |
| root | 3311 | index 1096, argument 3311 |
| apply | 4666 | argument 4666 |
| paren | 1181 | operand 1181 |
| abs | 1448 | operand 1448 |
| neg | 1849 | operand 1849 |
| sum | 1639 | index 1639, lower 1639, upper 1639, body 1639 |
| product | 812 | index 812, lower 812, upper 812, body 812 |
| integral | 1311 | lower 720, upper 720, body 1311, index 1311 |
| equals | 2607 | left 2607, right 2607 |
| less | 768 | left 768, right 768 |
| greater | 650 | left 650, right 650 |
| approx | 334 | left 334, right 334 |
| implies | 140 | left 140, right 140 |

| template | sentences | held out with families |
|---|---|---|
| abs.absolute_value | 1427 |  |
| apply.bare | 764 |  |
| apply.of | 2562 |  |
| apply.the_of | 1279 |  |
| approx.approximately | 195 |  |
| approx.is_approximately | 139 | spelled |
| close.comma | 847 |  |
| close.end_abs | 343 |  |
| close.end_exponent | 2735 |  |
| close.end_fraction | 3636 |  |
| close.end_root | 759 |  |
| close.end_sub | 1236 |  |
| close.end_sum | 918 |  |
| close.paren_arg | 2467 |  |
| close.quantity | 2978 |  |
| equals.equals | 1167 | textbook |
| equals.is_equal_to | 1427 |  |
| fraction.all_over | 1326 | delimited |
| fraction.divided_by | 1909 | informal |
| fraction.over | 2803 |  |
| fraction.the_fraction | 1884 |  |
| fraction.with_numerator | 1681 |  |
| greater.greater_than | 380 |  |
| greater.is_greater_than | 259 | delimited, informal |
| implies.implies | 140 |  |
| integral.from_to | 716 | delimited |
| integral.indefinite | 589 |  |
| integral.wrt | 281 |  |
| less.is_less_than | 524 |  |
| less.less_than | 233 | textbook |
| minus.minus | 5710 |  |
| neg.minus | 649 | delimited |
| neg.negative | 1215 |  |
| paren.left_right | 263 |  |
| paren.open_close | 652 |  |
| paren.paren | 265 | informal |
| plus.plus | 8058 |  |
| power.all_squared | 248 |  |
| power.cubed | 340 | spelled |
| power.raised_to | 2147 |  |
| power.squared | 598 |  |
| power.to_the | 3204 |  |
| power.to_the_power_of | 2036 | textbook |
| product.from_to | 806 |  |
| root.cube | 575 |  |
| root.nth | 516 |  |
| root.root_of | 990 |  |
| root.square_root_of | 1200 | delimited |
| subscript.sub | 1404 |  |
| subscript.subscript | 1067 |  |
| sum.from_to | 1625 |  |
| times.jux | 1214 | delimited, informal |
| times.multiplied_by | 2054 |  |
| times.times | 2493 | informal, spelled |

Hops (parent operator, role, child kind) seen in training: 478.

## Commands in training

| event | n | target | owner | value | word | wrapper | joiner | position | direction |
|---|---|---|---|---|---|---|---|---|---|
| replace | 4216 | 4216 | 131 | 3231 | 985 |  |  |  |  |
| delete | 2033 | 2033 | 65 |  |  |  |  |  |  |
| wrap | 2507 | 2507 | 108 | 380 |  | 2507 |  |  |  |
| insert | 1926 | 660 | 28 | 1926 |  |  | 1480 | 1346 |  |
| move | 1840 | 954 | 40 |  |  |  |  |  | 886 |
| select | 749 | 749 | 28 |  |  |  |  |  |  |
| factor | 639 | 487 | 14 | 639 |  |  |  |  |  |
| swap | 527 | 527 |  |  |  |  |  |  |  |
| undo | 335 |  |  |  |  |  |  |  |  |
| redo | 228 |  |  |  |  |  |  |  |  |

## Evaluation files

| file | formulas | commands | ambiguous |
|---|---|---|---|
| eval_heldout_formulations.sop | 400 | 200 | 44 |
| eval_unseen_depth.sop (depth 3, every hop seen) | 400 | 0 | 48 |
| eval_new_identities.sop | 400 | 0 | 0 |
| eval_ambiguous.sop | 400 | 0 | 400 |
| raw/edit_suite.jsonl (command on a formula, expected formula after) | 410 | | |

Held-out formulation pairs: 17; held-out command combinations: 23 (split_hints.json lists both).
