# Coverage of the matheditor world (generate.py seed 0, n = 20000)

Legend sha256:fa1a3fd9ce167c3b78669b58548d7fa5c5e22047c744fbe460d43f4162b1a7c9. Training: 14000 formulas and 6000 commands. Verbaliser candidates rejected (the drawn tree was not a reading of its own sentence, or a command was not read back): 0.

## Formulas in training

| tree depth | sentences |
|---|---|
| 0 | 44 |
| 1 | 5635 |
| 2 | 8321 |

| readings per sentence | sentences |
|---|---|
| 1 | 12403 |
| 2 | 1569 |
| 4 | 28 |

| family | sentences |
|---|---|
| textbook | 3651 |
| informal | 3107 |
| delimited | 3470 |
| spelled | 3772 |

| operator | nodes | roles (count) |
|---|---|---|
| plus | 3526 | left 3526, right 3526 |
| minus | 2284 | left 2284, right 2284 |
| times | 2222 | left 2222, right 2222 |
| fraction | 3669 | numerator 3669, denominator 3669 |
| power | 3303 | base 3303, exponent 3303 |
| subscript | 943 | base 943, index 943 |
| root | 1379 | index 459, argument 1379 |
| apply | 1816 | argument 1816 |
| paren | 465 | operand 465 |
| abs | 581 | operand 581 |
| neg | 742 | operand 742 |
| sum | 614 | index 614, lower 614, upper 614, body 614 |
| product | 330 | index 330, lower 330, upper 330, body 330 |
| integral | 496 | lower 250, upper 250, body 496, index 496 |
| equals | 994 | left 994, right 994 |
| less | 309 | left 309, right 309 |
| greater | 253 | left 253, right 253 |
| approx | 121 | left 121, right 121 |
| implies | 59 | left 59, right 59 |

| template | sentences | held out with families |
|---|---|---|
| abs.absolute_value | 572 |  |
| apply.bare | 298 |  |
| apply.of | 997 |  |
| apply.the_of | 494 |  |
| approx.approximately | 64 |  |
| approx.is_approximately | 57 | spelled |
| close.comma | 329 |  |
| close.end_abs | 137 |  |
| close.end_exponent | 1031 |  |
| close.end_fraction | 1377 |  |
| close.end_root | 329 |  |
| close.end_sub | 459 |  |
| close.end_sum | 363 |  |
| close.paren_arg | 924 |  |
| close.quantity | 1089 |  |
| equals.equals | 440 | textbook |
| equals.is_equal_to | 550 |  |
| fraction.all_over | 495 | delimited |
| fraction.divided_by | 733 | informal |
| fraction.over | 1064 |  |
| fraction.the_fraction | 726 |  |
| fraction.with_numerator | 632 |  |
| greater.greater_than | 152 |  |
| greater.is_greater_than | 94 | delimited, informal |
| implies.implies | 59 |  |
| integral.from_to | 248 | delimited |
| integral.indefinite | 246 |  |
| integral.wrt | 107 |  |
| less.is_less_than | 201 |  |
| less.less_than | 103 | textbook |
| minus.minus | 2170 |  |
| neg.minus | 255 | delimited |
| neg.negative | 493 |  |
| paren.left_right | 99 |  |
| paren.open_close | 271 |  |
| paren.paren | 95 | informal |
| plus.plus | 3227 |  |
| power.all_squared | 84 |  |
| power.cubed | 128 | spelled |
| power.raised_to | 862 |  |
| power.squared | 214 |  |
| power.to_the | 1210 |  |
| power.to_the_power_of | 785 | textbook |
| product.from_to | 329 |  |
| root.cube | 232 |  |
| root.nth | 224 |  |
| root.root_of | 441 |  |
| root.square_root_of | 470 | delimited |
| subscript.sub | 526 |  |
| subscript.subscript | 413 |  |
| sum.from_to | 608 |  |
| times.jux | 464 | delimited, informal |
| times.multiplied_by | 812 |  |
| times.times | 944 | informal, spelled |

Hops (parent operator, role, child kind) seen in training: 471.

## Commands in training

| event | n | target | owner | value | word | wrapper | joiner | position | direction |
|---|---|---|---|---|---|---|---|---|---|
| replace | 1698 | 1698 | 57 | 1302 | 396 |  |  |  |  |
| delete | 823 | 823 | 19 |  |  |  |  |  |  |
| wrap | 964 | 964 | 36 | 156 |  | 964 |  |  |  |
| insert | 810 | 284 | 14 | 810 |  |  | 609 | 571 |  |
| move | 739 | 360 | 18 |  |  |  |  |  | 379 |
| select | 316 | 316 | 16 |  |  |  |  |  |  |
| factor | 238 | 175 | 4 | 238 |  |  |  |  |  |
| swap | 194 | 194 |  |  |  |  |  |  |  |
| undo | 123 |  |  |  |  |  |  |  |  |
| redo | 95 |  |  |  |  |  |  |  |  |

## Evaluation files

| file | formulas | commands | ambiguous |
|---|---|---|---|
| eval_heldout_formulations.sop | 400 | 200 | 42 |
| eval_unseen_depth.sop (depth 3, every hop seen) | 400 | 0 | 48 |
| eval_new_identities.sop | 400 | 0 | 0 |
| eval_ambiguous.sop | 400 | 0 | 400 |
| raw/edit_suite.jsonl (command on a formula, expected formula after) | 410 | | |

Held-out formulation pairs: 17; held-out command combinations: 23 (split_hints.json lists both).
