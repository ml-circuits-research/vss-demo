# World profile (the nature of the world, from its training rows)

- training rows: 4495; kinds source: lexicon; tokens without a kind: 0.0%
- rows with same-kind competition (two roles, one kind): 613 (13.6%); of them order-dependent (no cue): 488 (10.9%)
- rigid absolute order (min over core roles): 16%
- rows with levels: 0 (0.0%); level openers declared: False; cues declared: [',', '.', 'and', 'as', 'at', 'by', 'from', 'in', 'into', 'of', 'on', 'to', 'with']

## Need signals (candidate routes)

- `vorder`: FIRES: 613 training rows (13.6%) fill two roles with the same kind; in 488 of them neither word is cued, so only the order relative to the verb separates them
- `pos`: off: the most frequent absolute position of a core role's head covers only 16% of the rows: the order is not rigid

## Contract rules (always on with decoder `contract`)

- candidates=sentence, undecided_adjacent=True, residual=explained, presence_query=True

## Diagnostics

- competition: 18 selection rows with same-kind competition are still misread with the accepted bundle: no route separates them; a question is missing from the legend or this world should be split
