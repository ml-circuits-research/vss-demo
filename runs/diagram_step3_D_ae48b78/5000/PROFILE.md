# World profile (the nature of the world, from its training rows)

- training rows: 4502; kinds source: lexicon; tokens without a kind: 0.0%
- rows with same-kind competition (two roles, one kind): 584 (13.0%); of them order-dependent (no cue): 328 (7.3%)
- rigid absolute order (min over core roles): 14%
- rows with levels: 0 (0.0%); level openers declared: False; cues declared: [',', '.', 'and', 'as', 'at', 'by', 'from', 'in', 'into', 'of', 'on', 'to', 'with']

## Need signals (candidate routes)

- `vorder`: FIRES: 584 training rows (13.0%) fill two roles with the same kind; in 328 of them neither word is cued, so only the order relative to the verb separates them
- `pos`: off: the most frequent absolute position of a core role's head covers only 14% of the rows: the order is not rigid

## Contract rules (always on with decoder `contract`)

- candidates=sentence, undecided_adjacent=True, residual=explained, presence_query=True

## Diagnostics

- competition: 15 selection rows with same-kind competition are still misread with the accepted bundle: no route separates them; a question is missing from the legend or this world should be split
