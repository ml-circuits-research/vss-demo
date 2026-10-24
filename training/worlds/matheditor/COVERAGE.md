# Coverage of the matheditor world (generate.py seed 0, n = 1000)

Legend sha256:fa1a3fd9ce167c3b78669b58548d7fa5c5e22047c744fbe460d43f4162b1a7c9. Training: 700 formulas and 300 commands. Verbaliser candidates rejected (the drawn tree was not a reading of its own sentence, or a command was not read back): 11 (source not among the readings: 9; no-parse: expected end_frac at word 9: 1; no-parse: expected end_frac at word 12: 1).

## Formulas in training

| tree depth | sentences |
|---|---|
| 0 | 25 |
| 1 | 304 |
| 2 | 371 |

| readings per sentence | sentences |
|---|---|
| 1 | 685 |
| 2 | 14 |
| 4 | 1 |

| family | sentences |
|---|---|
| textbook | 152 |
| informal | 155 |
| delimited | 192 |
| spelled | 201 |

| operator | nodes | roles (count) |
|---|---|---|
| plus | 164 | left 164, right 164 |
| minus | 115 | left 115, right 115 |
| times | 96 | left 96, right 96 |
| fraction | 137 | numerator 137, denominator 137 |
| power | 155 | base 155, exponent 155 |
| subscript | 54 | base 54, index 54 |
| root | 73 | index 19, argument 73 |
| apply | 89 | argument 89 |
| paren | 22 | operand 22 |
| abs | 32 | operand 32 |
| neg | 39 | operand 39 |
| sum | 31 | index 31, lower 31, upper 31, body 31 |
| product | 18 | index 18, lower 18, upper 18, body 18 |
| integral | 17 | lower 7, upper 7, body 17, index 17 |
| equals | 39 | left 39, right 39 |
| less | 11 | left 11, right 11 |
| greater | 11 | left 11, right 11 |
| approx | 3 | left 3, right 3 |
| implies | 0 | left 0, right 0 |

| template | sentences | held out with families |
|---|---|---|
| abs.absolute_value | 31 |  |
| apply.bare | 17 |  |
| apply.of | 49 |  |
| apply.the_of | 22 |  |
| approx.approximately | 3 |  |
| approx.is_approximately | 0 | spelled |
| close.comma | 5 |  |
| close.end_abs | 6 |  |
| close.end_exponent | 61 |  |
| close.end_fraction | 63 |  |
| close.end_root | 10 |  |
| close.end_sub | 26 |  |
| close.end_sum | 28 |  |
| close.paren_arg | 56 |  |
| close.quantity | 41 |  |
| equals.equals | 17 | textbook |
| equals.is_equal_to | 22 |  |
| fraction.all_over | 18 | delimited |
| fraction.divided_by | 25 | informal |
| fraction.over | 22 |  |
| fraction.the_fraction | 42 |  |
| fraction.with_numerator | 31 |  |
| greater.greater_than | 9 |  |
| greater.is_greater_than | 2 | delimited, informal |
| implies.implies | 0 |  |
| integral.from_to | 7 | delimited |
| integral.indefinite | 10 |  |
| integral.wrt | 2 |  |
| less.is_less_than | 6 |  |
| less.less_than | 5 | textbook |
| minus.minus | 111 |  |
| neg.minus | 13 | delimited |
| neg.negative | 26 |  |
| paren.left_right | 7 |  |
| paren.open_close | 11 |  |
| paren.paren | 4 | informal |
| plus.plus | 150 |  |
| power.all_squared | 6 |  |
| power.cubed | 7 | spelled |
| power.raised_to | 41 |  |
| power.squared | 12 |  |
| power.to_the | 63 |  |
| power.to_the_power_of | 28 | textbook |
| product.from_to | 18 |  |
| root.cube | 8 |  |
| root.nth | 10 |  |
| root.root_of | 21 |  |
| root.square_root_of | 33 | delimited |
| subscript.sub | 29 |  |
| subscript.subscript | 25 |  |
| sum.from_to | 31 |  |
| times.jux | 18 | delimited, informal |
| times.multiplied_by | 39 |  |
| times.times | 41 | informal, spelled |

Hops (parent operator, role, child kind) seen in training: 279.

## Commands in training

| event | n | target | owner | value | word | wrapper | joiner | position | direction |
|---|---|---|---|---|---|---|---|---|---|
| replace | 88 | 88 | 4 | 68 | 20 |  |  |  |  |
| delete | 51 | 51 | 1 |  |  |  |  |  |  |
| wrap | 45 | 45 | 2 | 8 |  | 45 |  |  |  |
| insert | 40 | 16 | 1 | 40 |  |  | 29 | 30 |  |
| move | 37 | 18 | 1 |  |  |  |  |  | 19 |
| select | 10 | 10 | 1 |  |  |  |  |  |  |
| factor | 13 | 10 |  | 13 |  |  |  |  |  |
| swap | 7 | 7 |  |  |  |  |  |  |  |
| undo | 5 |  |  |  |  |  |  |  |  |
| redo | 4 |  |  |  |  |  |  |  |  |

## Evaluation files

| file | formulas | commands | ambiguous |
|---|---|---|---|
| eval_heldout_formulations.sop | 100 | 50 | 0 |
| eval_unseen_depth.sop (depth 3, every hop seen) | 100 | 0 | 7 |
| eval_new_identities.sop | 100 | 0 | 0 |
| eval_ambiguous.sop | 52 | 0 | 52 |
| raw/edit_suite.jsonl (command on a formula, expected formula after) | 105 | | |

Held-out formulation pairs: 17; held-out command combinations: 23 (split_hints.json lists both).
