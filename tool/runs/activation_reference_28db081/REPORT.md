# REPORT — world `reference`, legend sha256:e221118d4315… (version 2)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
2440 annotated sentences from 6 files; provenance: {'generator': 2440}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/ref_run/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations_role_cues_seen: 16 sentences
- calibration_heldout_formulations_seen_transitions: 19 sentences
- calibration_heldout_formulations_unseen_transitions: 60 sentences
- heldout_depth3: 80 sentences
- heldout_formulations_role_cues_seen: 24 sentences
- heldout_formulations_seen_transitions: 21 sentences
- heldout_formulations_unseen_transitions: 60 sentences
- heldout_sentences: 195 sentences
- new_identities: 160 sentences
- train: 1805 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['o12', 'o13', 'o14', 'o15', 'o16', 'o17', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
23944 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0], batch 8, lr 0.02, epochs 1, device cpu, codes path+chainL+bigram, gates learned (closed start). Code commit bb6db1b-dirty. Memory curve: runs/ref_run/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:agent: no threshold (one class missing in the calibration rows: read by the training rate (always / never); n present 495, absent 0)
- presence:object: no threshold (one class missing in the calibration rows: read by the training rate (always / never); n present 495, absent 0)
- presence:recipient: threshold 1.189 [rule: fit; pooled midpoint 1.447 (comparison)] (present 1.882, n 415 / absent 1.012, n 80)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): agent 0.056, object 0.056, recipient 0.056, predicate 0.083

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_depth3 — catalog candidates (n = 80 of 80)
| axis | accuracy |
|---|---|
| FULL | 0.188 |
| FULL [pooled midpoint (comparison)] | 0.125 |
| presence recipient: present read present | 0.887 |
| presence recipient: share of 'present' readings that abstain | 0.986 |
| presence recipient: share of true 'present' readings that abstain | 0.986 |
| structure (depth, negation) | 1.000 |
| depth estimate: open-gate count | 1.000 |
| depth estimate: primary (kinds) | 1.000 |
| depth estimate: fit (check) | 0.013 |
| depth estimate: opener-kind count | 1.000 |
| predicate (surface lemma) | 0.425 |
| event type (synonym table) | 0.438 |
| role agent | 0.662 |
| head agent | 0.662 |
| lexical order head agent | 0.000 |
| lexical bag head agent | 0.237 |
| occupancy: known filler | 0.958 |
| role object | 1.000 |
| head object | 1.000 |
| lexical order head object | 1.000 |
| lexical bag head object | 1.000 |
| role recipient | 0.562 |
| head recipient | 0.562 |
| lexical order head recipient | 0.000 |
| lexical bag head recipient | 0.163 |
| speakers | 0.929 |
| heads FULL (model) | 0.487 |
| heads FULL (lexical order baseline) | 0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.050 |
| role agent [pooled midpoint (comparison)] | 0.675 |
| role object [pooled midpoint (comparison)] | 1.000 |
| role recipient [pooled midpoint (comparison)] | 0.425 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.350 |
| presence recipient: present read present [pooled midpoint (comparison)] | 0.675 |

residual mean 0.044; status {'abstain': 80}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.425 | 0.013 / 0.001 | 0.01 | 0.000 | 0.412 / 0.575 |
| role agent | 0.662 | 0.020 / 0.003 | 0.05 | 0.000 | 0.613 / 0.338 |
| roles (pooled) | 0.742 | 0.022 / 0.000 | 0.07 | 0.000 | 0.675 / 0.258 |
| role object | 1.000 | 0.031 / -0.001 | 0.14 | 0.000 | 0.863 / 0.000 |
| role recipient | 0.562 | 0.016 / 0.000 | 0.01 | 0.000 | 0.550 / 0.438 |
| speakers | 0.929 | 0.115 / 0.016 | 0.64 | 0.000 | 0.292 / 0.071 |

### heldout_formulations_role_cues_seen — catalog candidates (n = 24 of 24)
| axis | accuracy |
|---|---|
| FULL | 1.000 |
| FULL [pooled midpoint (comparison)] | 0.667 |
| presence recipient: present read present | 1.000 |
| presence recipient: share of 'present' readings that abstain | 0.000 |
| presence recipient: share of true 'present' readings that abstain | 0.000 |
| structure (depth, negation) | 1.000 |
| depth estimate: open-gate count | 1.000 |
| depth estimate: primary (kinds) | 1.000 |
| depth estimate: fit (check) | 1.000 |
| depth estimate: opener-kind count | 1.000 |
| predicate (surface lemma) | 1.000 |
| event type (synonym table) | 1.000 |
| role agent | 1.000 |
| head agent | 1.000 |
| lexical order head agent | 0.000 |
| lexical bag head agent | 0.667 |
| occupancy: known filler | 1.000 |
| role object | 1.000 |
| head object | 1.000 |
| lexical order head object | 1.000 |
| lexical bag head object | 1.000 |
| role recipient | 1.000 |
| head recipient | 1.000 |
| lexical order head recipient | 1.000 |
| lexical bag head recipient | 0.500 |
| heads FULL (model) | 1.000 |
| heads FULL (lexical order baseline) | 0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.458 |
| role agent [pooled midpoint (comparison)] | 1.000 |
| role object [pooled midpoint (comparison)] | 1.000 |
| role recipient [pooled midpoint (comparison)] | 0.667 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.667 |
| presence recipient: present read present [pooled midpoint (comparison)] | 0.667 |

residual mean 0.000; status {'ok': 24}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.195 / 0.143 | 1.00 | 0.000 | 0.000 / 0.000 |
| role agent | 1.000 | 0.216 / 0.186 | 1.00 | 0.000 | 0.000 / 0.000 |
| roles (pooled) | 1.000 | 0.209 / 0.175 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 1.000 | 0.223 / 0.205 | 1.00 | 0.000 | 0.000 / 0.000 |
| role recipient | 1.000 | 0.190 / 0.141 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_formulations_seen_transitions — catalog candidates (n = 21 of 21)
| axis | accuracy |
|---|---|
| FULL | 0.857 |
| FULL [pooled midpoint (comparison)] | 0.762 |
| presence recipient: present read present | 1.000 |
| presence recipient: share of 'present' readings that abstain | 0.381 |
| presence recipient: share of true 'present' readings that abstain | 0.381 |
| structure (depth, negation) | 1.000 |
| depth estimate: open-gate count | 1.000 |
| depth estimate: primary (kinds) | 1.000 |
| depth estimate: fit (check) | 1.000 |
| depth estimate: opener-kind count | 1.000 |
| predicate (surface lemma) | 0.905 |
| event type (synonym table) | 0.905 |
| role agent | 0.952 |
| head agent | 0.952 |
| lexical order head agent | 0.000 |
| lexical bag head agent | 0.571 |
| occupancy: known filler | 1.000 |
| role object | 1.000 |
| head object | 1.000 |
| lexical order head object | 1.000 |
| lexical bag head object | 1.000 |
| role recipient | 0.952 |
| head recipient | 0.952 |
| lexical order head recipient | 1.000 |
| lexical bag head recipient | 0.667 |
| heads FULL (model) | 0.952 |
| heads FULL (lexical order baseline) | 0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.429 |
| role agent [pooled midpoint (comparison)] | 0.952 |
| role object [pooled midpoint (comparison)] | 1.000 |
| role recipient [pooled midpoint (comparison)] | 0.857 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.857 |
| presence recipient: present read present [pooled midpoint (comparison)] | 0.905 |

residual mean 0.000; status {'ok': 11, 'abstain': 10}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.905 | 0.119 / 0.009 | 0.52 | 0.000 | 0.381 / 0.095 |
| role agent | 0.952 | 0.134 / 0.026 | 0.71 | 0.000 | 0.238 / 0.048 |
| roles (pooled) | 0.968 | 0.142 / 0.032 | 0.78 | 0.000 | 0.190 / 0.032 |
| role object | 1.000 | 0.165 / 0.071 | 1.00 | 0.000 | 0.000 / 0.000 |
| role recipient | 0.952 | 0.126 / 0.026 | 0.62 | 0.000 | 0.333 / 0.048 |

### heldout_formulations_unseen_transitions — catalog candidates (n = 60 of 60)
| axis | accuracy |
|---|---|
| FULL | 0.683 |
| FULL [pooled midpoint (comparison)] | 0.567 |
| presence recipient: present read present | 0.683 |
| structure (depth, negation) | 1.000 |
| depth estimate: open-gate count | 1.000 |
| depth estimate: primary (kinds) | 1.000 |
| depth estimate: fit (check) | 1.000 |
| depth estimate: opener-kind count | 1.000 |
| predicate (surface lemma) | 1.000 |
| event type (synonym table) | 1.000 |
| role agent | 1.000 |
| head agent | 1.000 |
| lexical order head agent | 0.000 |
| lexical bag head agent | 0.517 |
| occupancy: known filler | 0.894 |
| role object | 1.000 |
| head object | 1.000 |
| lexical order head object | 1.000 |
| lexical bag head object | 1.000 |
| role recipient | 0.683 |
| head recipient | 0.683 |
| lexical order head recipient | 0.667 |
| lexical bag head recipient | 0.217 |
| heads FULL (model) | 0.683 |
| heads FULL (lexical order baseline) | 0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.133 |
| role agent [pooled midpoint (comparison)] | 1.000 |
| role object [pooled midpoint (comparison)] | 1.000 |
| role recipient [pooled midpoint (comparison)] | 0.567 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.567 |
| presence recipient: present read present [pooled midpoint (comparison)] | 0.567 |
| presence recipient: share of 'present' readings that abstain | 0.049 |
| presence recipient: share of true 'present' readings that abstain | 0.049 |

residual mean 0.123; status {'ok': 48, 'abstain': 12}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.149 / 0.081 | 1.00 | 0.000 | 0.000 / 0.000 |
| role agent | 1.000 | 0.129 / 0.060 | 0.95 | 0.000 | 0.050 / 0.000 |
| roles (pooled) | 0.894 | 0.113 / 0.000 | 0.84 | 0.000 | 0.050 / 0.106 |
| role object | 1.000 | 0.114 / 0.059 | 0.93 | 0.000 | 0.067 / 0.000 |
| role recipient | 0.683 | 0.096 / 0.000 | 0.65 | 0.000 | 0.033 / 0.317 |

### heldout_sentences — catalog candidates (n = 195 of 195)
| axis | accuracy |
|---|---|
| FULL | 0.933 |
| FULL [pooled midpoint (comparison)] | 0.851 |
| presence recipient: present read present | 0.970 |
| structure (depth, negation) | 1.000 |
| depth estimate: open-gate count | 1.000 |
| depth estimate: primary (kinds) | 1.000 |
| depth estimate: fit (check) | 0.979 |
| depth estimate: opener-kind count | 1.000 |
| predicate (surface lemma) | 0.985 |
| event type (synonym table) | 0.985 |
| role agent | 0.974 |
| head agent | 0.974 |
| lexical order head agent | 0.313 |
| lexical bag head agent | 0.359 |
| occupancy: known filler | 0.989 |
| role object | 1.000 |
| head object | 1.000 |
| lexical order head object | 1.000 |
| lexical bag head object | 1.000 |
| role recipient | 0.949 |
| head recipient | 0.949 |
| lexical order head recipient | 0.318 |
| lexical bag head recipient | 0.390 |
| heads FULL (model) | 0.949 |
| heads FULL (lexical order baseline) | 0.087 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.200 |
| role agent [pooled midpoint (comparison)] | 0.974 |
| role object [pooled midpoint (comparison)] | 1.000 |
| role recipient [pooled midpoint (comparison)] | 0.867 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.867 |
| presence recipient: present read present [pooled midpoint (comparison)] | 0.875 |
| presence recipient: share of 'present' readings that abstain | 0.262 |
| presence recipient: share of true 'present' readings that abstain | 0.258 |
| speakers | 1.000 |
| presence recipient: absent read absent | 0.963 |
| occupancy: not given | 0.963 |
| presence recipient: absent read absent [pooled midpoint (comparison)] | 0.963 |
| presence recipient: share of FALSE 'present' readings that abstain | 1.000 |

residual mean 0.013; status {'ok': 99, 'abstain': 96}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.985 | 0.114 / 0.026 | 0.79 | 0.000 | 0.195 / 0.015 |
| role agent | 0.974 | 0.118 / 0.033 | 0.78 | 0.005 | 0.200 / 0.021 |
| roles (pooled) | 0.975 | 0.125 / 0.038 | 0.84 | 0.002 | 0.138 / 0.023 |
| role object | 1.000 | 0.167 / 0.092 | 1.00 | 0.000 | 0.000 / 0.000 |
| role recipient | 0.946 | 0.086 / 0.018 | 0.72 | 0.000 | 0.226 / 0.054 |
| speakers | 1.000 | 0.245 / 0.130 | 1.00 | 0.000 | 0.000 / 0.000 |

### new_identities — catalog candidates (n = 160 of 160)
| axis | accuracy |
|---|---|
| FULL | 0.925 |
| FULL [pooled midpoint (comparison)] | 0.719 |
| presence recipient: present read present | 0.925 |
| presence recipient: share of 'present' readings that abstain | 0.074 |
| presence recipient: share of true 'present' readings that abstain | 0.074 |
| structure (depth, negation) | 1.000 |
| depth estimate: open-gate count | 1.000 |
| depth estimate: primary (kinds) | 1.000 |
| depth estimate: fit (check) | 1.000 |
| depth estimate: opener-kind count | 1.000 |
| predicate (surface lemma) | 1.000 |
| event type (synonym table) | 1.000 |
| role agent | 1.000 |
| head agent | 1.000 |
| lexical order head agent | 0.000 |
| lexical bag head agent | 0.512 |
| occupancy: unknown filler | 0.975 |
| role object | 1.000 |
| head object | 1.000 |
| lexical order head object | 1.000 |
| lexical bag head object | 1.000 |
| role recipient | 0.925 |
| head recipient | 0.925 |
| lexical order head recipient | 0.625 |
| lexical bag head recipient | 0.487 |
| heads FULL (model) | 0.925 |
| heads FULL (lexical order baseline) | 0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.000 |
| role agent [pooled midpoint (comparison)] | 1.000 |
| role object [pooled midpoint (comparison)] | 1.000 |
| role recipient [pooled midpoint (comparison)] | 0.719 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.719 |
| presence recipient: present read present [pooled midpoint (comparison)] | 0.719 |

residual mean 0.022; status {'abstain': 15, 'ok': 145}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.202 / 0.132 | 1.00 | 0.000 | 0.000 / 0.000 |
| role agent | 1.000 | 0.183 / 0.123 | 1.00 | 0.000 | 0.000 / 0.000 |
| roles (pooled) | 0.975 | 0.176 / 0.105 | 0.95 | 0.000 | 0.023 / 0.025 |
| role object | 1.000 | 0.209 / 0.144 | 1.00 | 0.000 | 0.000 / 0.000 |
| role recipient | 0.925 | 0.135 / 0.017 | 0.86 | 0.000 | 0.069 / 0.075 |

### train (sample) — catalog candidates (n = 300 of 1805)
| axis | accuracy |
|---|---|
| FULL | 0.920 |
| presence recipient: present read present | 0.954 |
| presence recipient: share of 'present' readings that abstain | 0.234 |
| presence recipient: share of true 'present' readings that abstain | 0.227 |
| structure (depth, negation) | 1.000 |
| depth estimate: open-gate count | 1.000 |
| depth estimate: primary (kinds) | 1.000 |
| depth estimate: fit (check) | 1.000 |
| depth estimate: opener-kind count | 1.000 |
| predicate (surface lemma) | 0.973 |
| event type (synonym table) | 0.973 |
| role agent | 0.983 |
| head agent | 0.983 |
| lexical order head agent | 0.333 |
| lexical bag head agent | 0.453 |
| occupancy: known filler | 0.985 |
| role object | 1.000 |
| head object | 1.000 |
| lexical order head object | 1.000 |
| lexical bag head object | 1.000 |
| role recipient | 0.947 |
| head recipient | 0.947 |
| lexical order head recipient | 0.360 |
| lexical bag head recipient | 0.463 |
| speakers | 1.000 |
| heads FULL (model) | 0.947 |
| heads FULL (lexical order baseline) | 0.107 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.277 |
| presence recipient: absent read absent | 0.967 |
| occupancy: not given | 0.967 |
| presence recipient: share of FALSE 'present' readings that abstain | 1.000 |

residual mean 0.017; status {'ok': 183, 'abstain': 117}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.973 | 0.126 / 0.034 | 0.84 | 0.000 | 0.133 / 0.027 |
| role agent | 0.983 | 0.129 / 0.038 | 0.84 | 0.003 | 0.143 / 0.013 |
| roles (pooled) | 0.977 | 0.138 / 0.041 | 0.87 | 0.001 | 0.110 / 0.021 |
| role object | 1.000 | 0.182 / 0.101 | 1.00 | 0.000 | 0.000 / 0.000 |
| role recipient | 0.942 | 0.094 / 0.022 | 0.74 | 0.000 | 0.204 / 0.058 |
| speakers | 1.000 | 0.250 / 0.121 | 1.00 | 0.000 | 0.000 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
by=1.00 from=1.00 to=1.00 that=0.95 .=0.70 O=0.17 unknown=0.12 COP=0.06 given=0.05 who=0.05 lent=0.05 shown=0.05 sold=0.05 receives=0.04 sent=0.04 offered=0.04 accepts=0.04 buys=0.04 sees=0.04 borrows=0.03 gets=0.03 sends=0.03 what=0.02 offers=0.02 lends=0.02 shows=0.02 gives=0.02 it=0.01 sells=0.01 ,=0.01 claims=0.01 says=0.01 P=0.01

## What is weak, what to add
- heldout_depth3: FULL 0.188
- heldout_depth3: presence recipient: present read present 0.887
- heldout_depth3: depth estimate: fit (check) 0.013
- heldout_depth3: predicate (surface lemma) 0.425
- heldout_depth3: event type (synonym table) 0.438
- heldout_depth3: role agent 0.662
- heldout_depth3: head agent 0.662
- heldout_depth3: role recipient 0.562
- heldout_depth3: head recipient 0.562
- heldout_depth3: heads FULL (model) 0.487
- heldout_depth3: heads FULL (lexical order baseline) 0.000
- heldout_depth3: heads FULL (lexical bag baseline, trained on the same training rows) 0.050
- heldout_depth3: FULL [pooled midpoint (comparison)] 0.125
- heldout_depth3: role agent [pooled midpoint (comparison)] 0.675
- heldout_depth3: role recipient [pooled midpoint (comparison)] 0.425
- heldout_depth3: heads FULL (model) [pooled midpoint (comparison)] 0.350
- heldout_depth3: presence recipient: present read present [pooled midpoint (comparison)] 0.675
- heldout_formulations_role_cues_seen: presence recipient: share of 'present' readings that abstain 0.000
- heldout_formulations_role_cues_seen: presence recipient: share of true 'present' readings that abstain 0.000
- heldout_formulations_role_cues_seen: heads FULL (lexical order baseline) 0.000
- heldout_formulations_role_cues_seen: heads FULL (lexical bag baseline, trained on the same training rows) 0.458
- heldout_formulations_role_cues_seen: FULL [pooled midpoint (comparison)] 0.667
- heldout_formulations_role_cues_seen: role recipient [pooled midpoint (comparison)] 0.667
- heldout_formulations_role_cues_seen: heads FULL (model) [pooled midpoint (comparison)] 0.667
- heldout_formulations_role_cues_seen: presence recipient: present read present [pooled midpoint (comparison)] 0.667
- heldout_formulations_seen_transitions: FULL 0.857
- heldout_formulations_seen_transitions: presence recipient: share of 'present' readings that abstain 0.381
- heldout_formulations_seen_transitions: presence recipient: share of true 'present' readings that abstain 0.381
- heldout_formulations_seen_transitions: heads FULL (lexical order baseline) 0.000
- heldout_formulations_seen_transitions: heads FULL (lexical bag baseline, trained on the same training rows) 0.429
- heldout_formulations_seen_transitions: FULL [pooled midpoint (comparison)] 0.762
- heldout_formulations_seen_transitions: role recipient [pooled midpoint (comparison)] 0.857
- heldout_formulations_seen_transitions: heads FULL (model) [pooled midpoint (comparison)] 0.857
- heldout_formulations_unseen_transitions: FULL 0.683
- heldout_formulations_unseen_transitions: presence recipient: present read present 0.683
- heldout_formulations_unseen_transitions: occupancy: known filler 0.894
- heldout_formulations_unseen_transitions: role recipient 0.683
- heldout_formulations_unseen_transitions: head recipient 0.683
- heldout_formulations_unseen_transitions: heads FULL (model) 0.683
- heldout_formulations_unseen_transitions: heads FULL (lexical order baseline) 0.000
- heldout_formulations_unseen_transitions: heads FULL (lexical bag baseline, trained on the same training rows) 0.133
- heldout_formulations_unseen_transitions: FULL [pooled midpoint (comparison)] 0.567
- heldout_formulations_unseen_transitions: role recipient [pooled midpoint (comparison)] 0.567
- heldout_formulations_unseen_transitions: heads FULL (model) [pooled midpoint (comparison)] 0.567
- heldout_formulations_unseen_transitions: presence recipient: present read present [pooled midpoint (comparison)] 0.567
- heldout_formulations_unseen_transitions: presence recipient: share of 'present' readings that abstain 0.049
- heldout_formulations_unseen_transitions: presence recipient: share of true 'present' readings that abstain 0.049
- heldout_sentences: heads FULL (lexical order baseline) 0.087
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.200
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.851
- heldout_sentences: role recipient [pooled midpoint (comparison)] 0.867
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.867
- heldout_sentences: presence recipient: present read present [pooled midpoint (comparison)] 0.875
- heldout_sentences: presence recipient: share of 'present' readings that abstain 0.262
- heldout_sentences: presence recipient: share of true 'present' readings that abstain 0.258
- new_identities: presence recipient: share of 'present' readings that abstain 0.074
- new_identities: presence recipient: share of true 'present' readings that abstain 0.074
- new_identities: heads FULL (lexical order baseline) 0.000
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.000
- new_identities: FULL [pooled midpoint (comparison)] 0.719
- new_identities: role recipient [pooled midpoint (comparison)] 0.719
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.719
- new_identities: presence recipient: present read present [pooled midpoint (comparison)] 0.719
- train (sample): presence recipient: share of 'present' readings that abstain 0.234
- train (sample): presence recipient: share of true 'present' readings that abstain 0.227
- train (sample): heads FULL (lexical order baseline) 0.107
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.277

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_formulations_unseen_transitions: `P sends P O .` FULL 0.000 (n 4)
- heldout_formulations_unseen_transitions: `P is lent O by P .` FULL 0.000 (n 4)
- new_identities: `O is lent by P to P .` FULL 0.000 (n 3)
- heldout_depth3: `P says that P says that P says that P sells O to P .` FULL 0.000 (n 2)
- heldout_depth3: `P says that P claims that P claims that P shows O to P .` FULL 0.000 (n 2)
- heldout_depth3: `P says that P says that P claims that O is sent to P by P .` FULL 0.000 (n 2)
- heldout_depth3: `P says that P claims that P says that it is P who lends O to P .` FULL 0.000 (n 2)
- heldout_depth3: `P claims that P claims that P says that what P lends to P is O .` FULL 0.000 (n 2)

- fewer than 3 seeds (rule 6): the numbers above carry no seed variance; run with --seeds 3 or more for a result.

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role agent | role object | role recipient |
|---|---|---|---|---|---|---|
| heldout_formulations_role_cues_seen | product readout: presence decided | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 |
| heldout_formulations_role_cues_seen | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.667 | 0.667 | 1.000 | 1.000 | 0.667 |
| heldout_formulations_role_cues_seen | v16 protocol: every role read, not available to the product | nan | nan | nan | nan | nan |
| heldout_formulations_seen_transitions | product readout: presence decided | 0.952 | 0.857 | 0.952 | 1.000 | 0.952 |
| heldout_formulations_seen_transitions | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.857 | 0.762 | 0.952 | 1.000 | 0.857 |
| heldout_formulations_seen_transitions | v16 protocol: every role read, not available to the product | nan | nan | nan | nan | nan |
| heldout_formulations_unseen_transitions | product readout: presence decided | 0.683 | 0.683 | 1.000 | 1.000 | 0.683 |
| heldout_formulations_unseen_transitions | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.567 | 0.567 | 1.000 | 1.000 | 0.567 |
| heldout_formulations_unseen_transitions | v16 protocol: every role read, not available to the product | nan | nan | nan | nan | nan |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_depth3 | recipient | product: fitted | 0.887 | — | — | 0.986 (— / 0.986) |
| heldout_depth3 | recipient | comparison: pooled midpoint | 0.675 | — | — |  |
| heldout_formulations_role_cues_seen | recipient | product: fitted | 1.000 | — | — | 0.000 (— / 0.000) |
| heldout_formulations_role_cues_seen | recipient | comparison: pooled midpoint | 0.667 | — | — |  |
| heldout_formulations_seen_transitions | recipient | product: fitted | 1.000 | — | — | 0.381 (— / 0.381) |
| heldout_formulations_seen_transitions | recipient | comparison: pooled midpoint | 0.905 | — | — |  |
| heldout_formulations_unseen_transitions | recipient | product: fitted | 0.683 | — | — | 0.049 (— / 0.049) |
| heldout_formulations_unseen_transitions | recipient | comparison: pooled midpoint | 0.567 | — | — |  |
| heldout_sentences | recipient | product: fitted | 0.970 | 0.963 | 0.967 | 0.262 (1.000 / 0.258) |
| heldout_sentences | recipient | comparison: pooled midpoint | 0.875 | 0.963 | 0.919 |  |
| new_identities | recipient | product: fitted | 0.925 | — | — | 0.074 (— / 0.074) |
| new_identities | recipient | comparison: pooled midpoint | 0.719 | — | — |  |
| train (sample) | recipient | product: fitted | 0.954 | 0.967 | 0.960 | 0.234 (1.000 / 0.227) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [ ] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
