# Coverage of the matheditor world (generate.py seed 0, n = 5000)

Legend sha256:d3614ed01b01467dc66ea830d626de1bcdea401b9307374af0c7fa072de991a8. Training: 3500 formulas and 1500 commands. Verbaliser candidates rejected (the drawn tree was not a reading of its own sentence, or a command was not read back): 0.

## Formulas in training

| tree depth | sentences |
|---|---|
| 0 | 44 |
| 1 | 1504 |
| 2 | 1952 |

| readings per sentence | sentences |
|---|---|
| 1 | 3144 |
| 2 | 351 |
| 4 | 5 |

| family | sentences |
|---|---|
| textbook | 897 |
| informal | 745 |
| delimited | 902 |
| spelled | 956 |

| operator | nodes | roles (count) |
|---|---|---|
| plus | 849 | left 849, right 849 |
| minus | 566 | left 566, right 566 |
| times | 549 | left 549, right 549 |
| fraction | 821 | numerator 821, denominator 821 |
| power | 775 | base 775, exponent 775 |
| subscript | 242 | base 242, index 242 |
| root | 346 | index 104, argument 346 |
| apply | 451 | argument 451 |
| paren | 116 | operand 116 |
| abs | 146 | operand 146 |
| neg | 185 | operand 185 |
| sum | 146 | index 146, lower 146, upper 146, body 146 |
| product | 83 | index 83, lower 83, upper 83, body 83 |
| integral | 109 | lower 47, upper 47, body 109, index 109 |
| equals | 241 | left 241, right 241 |
| less | 77 | left 77, right 77 |
| greater | 66 | left 66, right 66 |
| approx | 27 | left 27, right 27 |
| implies | 14 | left 14, right 14 |

| template | sentences | held out with families |
|---|---|---|
| abs.absolute_value | 145 |  |
| apply.bare | 77 |  |
| apply.of | 259 |  |
| apply.the_of | 107 |  |
| approx.approximately | 20 |  |
| approx.is_approximately | 7 | spelled |
| close.comma | 78 |  |
| close.end_abs | 34 |  |
| close.end_exponent | 255 |  |
| close.end_fraction | 303 |  |
| close.end_root | 68 |  |
| close.end_sub | 132 |  |
| close.end_sum | 93 |  |
| close.paren_arg | 230 |  |
| close.quantity | 250 |  |
| equals.equals | 95 | textbook |
| equals.is_equal_to | 146 |  |
| fraction.all_over | 99 | delimited |
| fraction.divided_by | 167 | informal |
| fraction.over | 230 |  |
| fraction.the_fraction | 151 |  |
| fraction.with_numerator | 171 |  |
| greater.greater_than | 44 |  |
| greater.is_greater_than | 22 | delimited, informal |
| implies.implies | 14 |  |
| integral.from_to | 46 | delimited |
| integral.indefinite | 62 |  |
| integral.wrt | 26 |  |
| less.is_less_than | 50 |  |
| less.less_than | 26 | textbook |
| minus.minus | 541 |  |
| neg.minus | 65 | delimited |
| neg.negative | 123 |  |
| paren.left_right | 25 |  |
| paren.open_close | 68 |  |
| paren.paren | 23 | informal |
| plus.plus | 782 |  |
| power.all_squared | 14 |  |
| power.cubed | 34 | spelled |
| power.raised_to | 200 |  |
| power.squared | 65 |  |
| power.to_the | 289 |  |
| power.to_the_power_of | 171 | textbook |
| product.from_to | 83 |  |
| root.cube | 51 |  |
| root.nth | 51 |  |
| root.root_of | 110 |  |
| root.square_root_of | 129 | delimited |
| subscript.sub | 129 |  |
| subscript.subscript | 113 |  |
| sum.from_to | 143 |  |
| times.jux | 126 | delimited, informal |
| times.multiplied_by | 195 |  |
| times.times | 231 | informal, spelled |

Hops (parent operator, role, child kind) seen in training: 428.

## Commands in training

| event | n | target | owner | value | word | wrapper | joiner | position | direction |
|---|---|---|---|---|---|---|---|---|---|
| replace | 419 | 419 | 16 | 330 | 89 |  |  |  |  |
| delete | 206 | 206 | 6 |  |  |  |  |  |  |
| wrap | 228 | 228 | 7 | 44 |  | 228 |  |  |  |
| insert | 209 | 69 | 5 | 209 |  |  | 154 | 144 |  |
| move | 206 | 107 | 7 |  |  |  |  |  | 99 |
| select | 75 | 75 | 3 |  |  |  |  |  |  |
| factor | 53 | 38 | 1 | 53 |  |  |  |  |  |
| swap | 44 | 44 |  |  |  |  |  |  |  |
| undo | 32 |  |  |  |  |  |  |  |  |
| redo | 28 |  |  |  |  |  |  |  |  |

## Evaluation files

| file | formulas | commands | ambiguous |
|---|---|---|---|
| eval_heldout_formulations.sop | 400 | 200 | 40 |
| eval_unseen_depth.sop (depth 3, every hop seen) | 400 | 0 | 48 |
| eval_new_identities.sop | 400 | 0 | 0 |
| eval_ambiguous.sop | 400 | 0 | 400 |
| raw/edit_suite.jsonl (command on a formula, expected formula after) | 410 | | |

Held-out formulation pairs: 17; held-out command combinations: 23 (split_hints.json lists both).
