# World profile (the nature of the world, from its training rows)

- training rows: 1805; kinds source: lexicon; tokens without a kind: 0.0%
- rows with same-kind competition (two roles, one kind): 1414 (78.3%); of them order-dependent (no cue): 0 (0.0%)
- rigid absolute order (min over core roles): 16%
- rows with levels: 1187 (65.8%); level openers declared: True; cues declared: ['by', 'from', 'to']

## Need signals (candidate routes)

- `vorder`: FIRES: 1414 training rows (78.3%) fill two roles with the same kind; in 0 of them neither word is cued, so only the order relative to the verb separates them
- `pos`: off: the most frequent absolute position of a core role's head covers only 16% of the rows: the order is not rigid

## Contract rules (always on with decoder `contract`)

- candidates=sentence, undecided_adjacent=True, residual=explained

## Diagnostics

- competition: 10 selection rows with same-kind competition are still misread with the accepted bundle: no route separates them; a question is missing from the legend or this world should be split
