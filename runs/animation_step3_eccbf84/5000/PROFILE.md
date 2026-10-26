# World profile (the nature of the world, from its training rows)

- training rows: 4495; kinds source: lexicon; tokens without a kind: 0.0%
- rows with same-kind competition (two roles, one kind): 2520 (56.1%); of them order-dependent (no cue): 1648 (36.7%)
- rigid absolute order (min over core roles): 11%
- rows with levels: 0 (0.0%); level openers declared: False; cues declared: [',', '.', 'and', 'as', 'at', 'by', 'from', 'in', 'into', 'of', 'on', 'to']

## Need signals (candidate routes)

- `vorder`: FIRES: 2520 training rows (56.1%) fill two roles with the same kind; in 1648 of them neither word is cued, so only the order relative to the verb separates them
- `pos`: off: the most frequent absolute position of a core role's head covers only 11% of the rows: the order is not rigid

## Contract rules (always on with decoder `contract`)

- candidates=sentence, undecided_adjacent=True, residual=explained

## Diagnostics

- competition: 141 selection rows with same-kind competition are still misread with the accepted bundle: no route separates them; a question is missing from the legend or this world should be split
