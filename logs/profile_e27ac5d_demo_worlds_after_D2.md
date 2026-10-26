# sop profile on the demo worlds after responses D2 (activate._head_positions fixed in vss-vs-bert/sop 9855cd9, synced 08c179d); commit e27ac5d, 2026-10-26, DGX, CPU
Same data as logs/profile_92d12f9_demo_worlds.md (frozen n50000, sha256 verified, seed 0 splits). Before -> after (same-kind rows; order-dependent rows):

| world | same-kind before | same-kind after | order-dependent before | after | vorder before | after |
|---|---|---|---|---|---|---|
| diagram | 7545 (16.8%) | 7545 (16.8%) | 7118 (15.9%) | 3963 (8.8%) | fires | fires |
| diagram_multi | 3454 (7.7%) | 7789 (17.4%) | 3072 (6.9%) | 6075 (13.5%) | fires | fires |
| diagram_ro | 628 (1.4%) | 7587 (16.9%) | 245 (0.5%) | 7014 (15.6%) | off | **fires** |
| textedit | 4754 (10.5%) | 4754 (10.5%) | 1566 (3.5%) | 1335 (3.0%) | fires | fires |
| matheditor | 146 (0.3%) | 146 (0.3%) | 146 (0.3%) | 146 (0.3%) | off (pos fires) | off (pos fires) |
| animation | 25066 (55.8%) | 25066 (55.8%) | 21875 (48.7%) | 16622 (37.0%) | fires | fires |

Observation (diagnostic, no action): diagram_ro's order-dependent share (15.6%) is about twice the English world's (8.8%) on the same frames;
the one legend shared by the three worlds declares English cue words only (cues_declared above), so Romanian cues (la, de, cu, in) do not count as cues.

    # WORLD: diagram
    # World profile (the nature of the world, from its training rows)
    
    - training rows: 44899; kinds source: lexicon; tokens without a kind: 0.0%
    - rows with same-kind competition (two roles, one kind): 7545 (16.8%); of them order-dependent (no cue): 3963 (8.8%)
    - rigid absolute order (min over core roles): 26%
    - rows with levels: 0 (0.0%); level openers declared: False; cues declared: [',', '.', 'and', 'as', 'at', 'by', 'from', 'in', 'into', 'of', 'on', 'to', 'with']
    
    ## Need signals (candidate routes)
    
    - `vorder`: FIRES: 7545 training rows (16.8%) fill two roles with the same kind; in 3963 of them neither word is cued, so only the order relative to the verb separates them
    - `pos`: off: the most frequent absolute position of a core role's head covers only 26% of the rows: the order is not rigid
    
    ## Contract rules (always on with decoder `contract`)
    
    - candidates=sentence, undecided_adjacent=True, residual=explained
    # WORLD: diagram_multi
    # World profile (the nature of the world, from its training rows)
    
    - training rows: 44841; kinds source: lexicon; tokens without a kind: 0.0%
    - rows with same-kind competition (two roles, one kind): 7789 (17.4%); of them order-dependent (no cue): 6075 (13.5%)
    - rigid absolute order (min over core roles): 27%
    - rows with levels: 0 (0.0%); level openers declared: False; cues declared: [',', '.', 'and', 'as', 'at', 'by', 'from', 'in', 'into', 'of', 'on', 'to', 'with']
    
    ## Need signals (candidate routes)
    
    - `vorder`: FIRES: 7789 training rows (17.4%) fill two roles with the same kind; in 6075 of them neither word is cued, so only the order relative to the verb separates them
    - `pos`: off: the most frequent absolute position of a core role's head covers only 27% of the rows: the order is not rigid
    
    ## Contract rules (always on with decoder `contract`)
    
    - candidates=sentence, undecided_adjacent=True, residual=explained
    # WORLD: diagram_ro
    # World profile (the nature of the world, from its training rows)
    
    - training rows: 44917; kinds source: lexicon; tokens without a kind: 0.0%
    - rows with same-kind competition (two roles, one kind): 7587 (16.9%); of them order-dependent (no cue): 7014 (15.6%)
    - rigid absolute order (min over core roles): 30%
    - rows with levels: 0 (0.0%); level openers declared: False; cues declared: [',', '.', 'and', 'as', 'at', 'by', 'from', 'in', 'into', 'of', 'on', 'to', 'with']
    
    ## Need signals (candidate routes)
    
    - `vorder`: FIRES: 7587 training rows (16.9%) fill two roles with the same kind; in 7014 of them neither word is cued, so only the order relative to the verb separates them
    - `pos`: off: the most frequent absolute position of a core role's head covers only 30% of the rows: the order is not rigid
    
    ## Contract rules (always on with decoder `contract`)
    
    - candidates=sentence, undecided_adjacent=True, residual=explained
    # WORLD: textedit
    # World profile (the nature of the world, from its training rows)
    
    - training rows: 45145; kinds source: lexicon; tokens without a kind: 0.0%
    - rows with same-kind competition (two roles, one kind): 4754 (10.5%); of them order-dependent (no cue): 1335 (3.0%)
    - rigid absolute order (min over core roles): 24%
    - rows with levels: 0 (0.0%); level openers declared: False; cues declared: [',', '.', 'and', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'of', 'on', 'to', 'with']
    
    ## Need signals (candidate routes)
    
    - `vorder`: FIRES: 4754 training rows (10.5%) fill two roles with the same kind; in 1335 of them neither word is cued, so only the order relative to the verb separates them
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
    - rows with same-kind competition (two roles, one kind): 25066 (55.8%); of them order-dependent (no cue): 16622 (37.0%)
    - rigid absolute order (min over core roles): 24%
    - rows with levels: 0 (0.0%); level openers declared: False; cues declared: [',', '.', 'and', 'as', 'at', 'by', 'from', 'in', 'into', 'of', 'on', 'to']
    
    ## Need signals (candidate routes)
    
    - `vorder`: FIRES: 25066 training rows (55.8%) fill two roles with the same kind; in 16622 of them neither word is cued, so only the order relative to the verb separates them
    - `pos`: off: the most frequent absolute position of a core role's head covers only 24% of the rows: the order is not rigid
    
    ## Contract rules (always on with decoder `contract`)
    
    - candidates=sentence, undecided_adjacent=True, residual=explained
