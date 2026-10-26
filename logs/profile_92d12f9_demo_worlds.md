# sop profile on the demo worlds (commit 92d12f9, 2026-10-26, DGX, CPU; frozen data n50000 unpacked with training/data/unpack.py, sha256 verified; seed 0 splits)


# WORLD: diagram
# World profile (the nature of the world, from its training rows)

- training rows: 44899; kinds source: lexicon; tokens without a kind: 0.0%
- rows with same-kind competition (two roles, one kind): 7545 (16.8%); of them order-dependent (no cue): 7118 (15.9%)
- rigid absolute order (min over core roles): 26%
- rows with levels: 0 (0.0%); level openers declared: False; cues declared: [',', '.', 'and', 'as', 'at', 'by', 'from', 'in', 'into', 'of', 'on', 'to', 'with']

## Need signals (candidate routes)

- `vorder`: FIRES: 7545 training rows (16.8%) fill two roles with the same kind; in 7118 of them neither word is cued, so only the order relative to the verb separates them
- `pos`: off: the most frequent absolute position of a core role's head covers only 26% of the rows: the order is not rigid

## Contract rules (always on with decoder `contract`)

- candidates=sentence, undecided_adjacent=True, residual=explained

# WORLD: diagram_multi
# World profile (the nature of the world, from its training rows)

- training rows: 44841; kinds source: lexicon; tokens without a kind: 0.0%
- rows with same-kind competition (two roles, one kind): 3454 (7.7%); of them order-dependent (no cue): 3072 (6.9%)
- rigid absolute order (min over core roles): 27%
- rows with levels: 0 (0.0%); level openers declared: False; cues declared: [',', '.', 'and', 'as', 'at', 'by', 'from', 'in', 'into', 'of', 'on', 'to', 'with']

## Need signals (candidate routes)

- `vorder`: FIRES: 3454 training rows (7.7%) fill two roles with the same kind; in 3072 of them neither word is cued, so only the order relative to the verb separates them
- `pos`: off: the most frequent absolute position of a core role's head covers only 27% of the rows: the order is not rigid

## Contract rules (always on with decoder `contract`)

- candidates=sentence, undecided_adjacent=True, residual=explained

# WORLD: diagram_ro
# World profile (the nature of the world, from its training rows)

- training rows: 44917; kinds source: lexicon; tokens without a kind: 0.0%
- rows with same-kind competition (two roles, one kind): 628 (1.4%); of them order-dependent (no cue): 245 (0.5%)
- rigid absolute order (min over core roles): 31%
- rows with levels: 0 (0.0%); level openers declared: False; cues declared: [',', '.', 'and', 'as', 'at', 'by', 'from', 'in', 'into', 'of', 'on', 'to', 'with']

## Need signals (candidate routes)

- `vorder`: off: 628 training rows (1.4%) fill two roles with the same kind; in 245 of them neither word is cued, so only the order relative to the verb separates them
- `pos`: off: the most frequent absolute position of a core role's head covers only 31% of the rows: the order is not rigid

## Contract rules (always on with decoder `contract`)

- candidates=sentence, undecided_adjacent=True, residual=explained

# WORLD: textedit
# World profile (the nature of the world, from its training rows)

- training rows: 45145; kinds source: lexicon; tokens without a kind: 0.0%
- rows with same-kind competition (two roles, one kind): 4754 (10.5%); of them order-dependent (no cue): 1566 (3.5%)
- rigid absolute order (min over core roles): 24%
- rows with levels: 0 (0.0%); level openers declared: False; cues declared: [',', '.', 'and', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'of', 'on', 'to', 'with']

## Need signals (candidate routes)

- `vorder`: FIRES: 4754 training rows (10.5%) fill two roles with the same kind; in 1566 of them neither word is cued, so only the order relative to the verb separates them
- `pos`: off: the most frequent absolute position of a core role's head covers only 24% of the rows: the order is not rigid

## Contract rules (always on with decoder `contract`)

- candidates=sentence, undecided_adjacent=True, residual=explained

# WORLD: matheditor
# World profile (the nature of the world, from its training rows)

- training rows: 44967; kinds source: lexicon; tokens without a kind: 0.0%
- rows with same-kind competition (two roles, one kind): 146 (0.3%); of them order-dependent (no cue): 146 (0.3%)
- rigid absolute order (min over core roles): 100%
- rows with levels: 0 (0.0%); level openers declared: False; cues declared: []

## Need signals (candidate routes)

- `vorder`: off: 146 training rows (0.3%) fill two roles with the same kind; in 146 of them neither word is cued, so only the order relative to the verb separates them
- `pos`: FIRES: every core role's head sits at one absolute position in at least 100% of the rows (rigid order)

## Contract rules (always on with decoder `contract`)

- candidates=sentence, undecided_adjacent=True, residual=explained

# WORLD: animation
# World profile (the nature of the world, from its training rows)

- training rows: 44948; kinds source: lexicon; tokens without a kind: 0.0%
- rows with same-kind competition (two roles, one kind): 25066 (55.8%); of them order-dependent (no cue): 21875 (48.7%)
- rigid absolute order (min over core roles): 24%
- rows with levels: 0 (0.0%); level openers declared: False; cues declared: [',', '.', 'and', 'as', 'at', 'by', 'from', 'in', 'into', 'of', 'on', 'to']

## Need signals (candidate routes)

- `vorder`: FIRES: 25066 training rows (55.8%) fill two roles with the same kind; in 21875 of them neither word is cued, so only the order relative to the verb separates them
- `pos`: off: the most frequent absolute position of a core role's head covers only 24% of the rows: the order is not rigid

## Contract rules (always on with decoder `contract`)

- candidates=sentence, undecided_adjacent=True, residual=explained

# Same-kind role pairs (training rows; key = kind, roles, both uncued by the immediate-previous-token test) — scratch analysis
## diagram
```
3791 ('COMPONENT', ('landmark', 'object'), True) | lets inside the box , draw a component
1496 ('COMPONENT', ('object', 'source', 'target'), True) | now connect the purple user and the cache with a line .
1069 ('COMPONENT', ('source', 'target'), True) | please link the comment to the database .
352 ('LABEL', ('object', 'text'), False) | never rename accounts to peter .
298 ('COMPONENT', ('object', 'target'), True) | could you attach login to the green shape with a yellow line .
291 ('COMPONENT', ('object', 'source'), True) | would you join the file to reports_db with a green arrow
110 ('LABEL', ('landmark', 'text'), True) | lets draw a service named review inside checkout
75 ('LABEL', ('source', 'target'), False) | i want you to connect inventory and signup with a line .
57 ('LABEL', ('landmark', 'object'), True) | okay so put catalog above worker .
5 ('LAYOUT', ('landmark', 'object'), True) | please place the circle above the solid circle
1 ('LAYOUT', ('source', 'target'), True) | can you connect the gray circle to the circle with a small line .
```
## diagram_ro
```
358 ('LABEL', ('object', 'text'), False) | va rog sa redenumiti ledger in mark .
131 ('LABEL', ('landmark', 'text'), True) | acum adaugati o componenta cu_numele signup right_of review
48 ('LABEL', ('landmark', 'object'), True) | okay deci deplaseaza login left_of done .
46 ('LABEL', ('source', 'target'), True) | ai putea sa legi delta de gamma
25 ('LABEL', ('source', 'target'), False) | ai putea sa conectezi shipping si kafka cu o linie
20 ('COMPONENT', ('landmark', 'object'), True) | as_vrea sa schitati un server alb la 120 de px sub server
```
# Head-token matching (first 20000 rows)
## diagram
```
heads not found among tokens: 0/42314 = 0.0%
kind of the token before a found head: [('the', 12629), ('COMPONENT', 5127), ('COLOR', 4202), ('VERB', 3055), ('a', 2904), ('STYLE', 2038)]
```
## diagram_ro
```
heads not found among tokens: 26595/42518 = 62.5%
   ('object', 'line', 'nu atasa decizia la raportul cu o linie mov te rog')
   ('source', 'decision', 'nu atasa decizia la raportul cu o linie mov te rog')
   ('target', 'report', 'nu atasa decizia la raportul cu o linie mov te rog')
   ('object', 'gateways', 'radiati portile care nu sunt albastre va rog')
kind of the token before a found head: [('VERB', 2536), ('COMPONENT', 1741), ('INTRO', 1692), ('in', 1266), ('de', 956), ('la', 864)]
```
