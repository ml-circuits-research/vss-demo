# REPORT — world `textedit`, legend sha256:4c42eb08b9dd… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
5800 annotated sentences from 3 files; provenance: {'generator': 5800}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/5000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 219 sentences
- heldout_formulations: 181 sentences
- heldout_sentences: 478 sentences
- new_identities: 400 sentences
- train: 4522 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['2027', '250', '35', '45', '90', 'appendix', 'audit_trail', 'background', 'berlin', 'compliance', 'customer_success', 'decisions', 'dividend', 'elena', 'forecast', 'go_live', 'headcount', 'logistics', 'merger', 'onboarding', 'pipeline', 'procurement', 'q1', 'q2', 'retention', 'retro', 'tokyo', 'victor', 'warranty']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
37324 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2, 3, 4], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit eccbf84. Memory curve: runs/5000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:unit: threshold 0.379 [rule: fit; pooled midpoint 0.532 (comparison)] (present 0.918, n 423 / absent 0.146, n 196)
- presence:ordinal: threshold 0.425 [rule: fit; pooled midpoint 0.468 (comparison)] (present 0.862, n 292 / absent 0.075, n 327)
- presence:match: threshold 0.287 [rule: fit; pooled midpoint 0.379 (comparison)] (present 0.679, n 188 / absent 0.080, n 431)
- presence:format: threshold 0.155 [rule: fit; pooled midpoint 0.391 (comparison)] (present 0.734, n 109 / absent 0.049, n 510)
- presence:value: threshold 0.164 [rule: fit; pooled midpoint 0.206 (comparison)] (present 0.370, n 68 / absent 0.041, n 551)
- presence:position: threshold 0.198 [rule: fit; pooled midpoint 0.371 (comparison)] (present 0.700, n 149 / absent 0.041, n 470)
- presence:new_text: threshold 0.224 [rule: fit; pooled midpoint 0.330 (comparison)] (present 0.610, n 135 / absent 0.049, n 484)
- presence:widget: threshold 0.446 [rule: fit; pooled midpoint 0.482 (comparison)] (present 0.933, n 13 / absent 0.032, n 606)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): unit 0.062, ordinal 0.040, match 0.007, format 0.077, value 0.050, position 0.250, new_text 0.007, widget 0.007, predicate 0.023

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 181 of 181)
| axis | accuracy |
|---|---|
| FULL | 0.938±0.017 |
| FULL [depth given] | 0.938±0.017 |
| FULL [depth and negation given] | 0.938±0.017 |
| FULL [presence not decided] | 0.776±0.008 |
| FULL [pooled midpoint (comparison)] | 0.804±0.010 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.014±0.004 |
| presence unit: share of true 'present' readings that abstain | 0.014±0.004 |
| presence ordinal: present read present | 0.998±0.005 |
| presence ordinal: share of 'present' readings that abstain | 0.007±0.009 |
| presence ordinal: share of true 'present' readings that abstain | 0.007±0.009 |
| presence match: absent read absent | 0.998±0.003 |
| presence format: absent read absent | 1.000±0.000 |
| presence value: absent read absent | 1.000±0.000 |
| presence position: absent read absent | 1.000±0.000 |
| presence new_text: absent read absent | 1.000±0.000 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.960±0.014 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.960±0.014 |
| event type (synonym table) | 0.960±0.014 |
| role unit | 0.990±0.005 |
| head unit | 0.990±0.005 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.961±0.000 |
| occupancy: known filler | 0.965±0.009 |
| role ordinal | 0.999±0.002 |
| head ordinal | 0.999±0.002 |
| lexical order head ordinal | 0.525±0.000 |
| lexical bag head ordinal | 0.564±0.000 |
| role match | 0.969±0.004 |
| head match | 0.969±0.004 |
| lexical order head match | 0.657±0.000 |
| lexical bag head match | 0.652±0.000 |
| occupancy: not given | 1.000±0.000 |
| role format | 0.986±0.003 |
| head format | 0.986±0.003 |
| lexical order head format | 0.873±0.000 |
| lexical bag head format | 0.895±0.000 |
| role value | 0.993±0.002 |
| head value | 0.993±0.002 |
| lexical order head value | 0.939±0.000 |
| lexical bag head value | 0.939±0.000 |
| role position | 0.992±0.010 |
| head position | 0.992±0.010 |
| lexical order head position | 0.591±0.000 |
| lexical bag head position | 0.680±0.000 |
| role new_text | 0.989±0.014 |
| head new_text | 0.989±0.014 |
| lexical order head new_text | 0.762±0.000 |
| lexical bag head new_text | 0.818±0.000 |
| role widget | 1.000±0.000 |
| head widget | 1.000±0.000 |
| lexical order head widget | 0.972±0.000 |
| lexical bag head widget | 0.972±0.000 |
| heads FULL (model) | 0.938±0.017 |
| heads FULL (lexical order baseline) | 0.088±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.116±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role ordinal [presence not decided] | 1.000±0.000 |
| role match [presence not decided] | 0.776±0.008 |
| role format [presence not decided] | 1.000±0.000 |
| role value [presence not decided] | 1.000±0.000 |
| role position [presence not decided] | 1.000±0.000 |
| role new_text [presence not decided] | 0.776±0.008 |
| role widget [presence not decided] | 1.000±0.000 |
| heads FULL (model) [presence not decided] | 0.776±0.008 |
| role unit [pooled midpoint (comparison)] | 0.922±0.010 |
| role ordinal [pooled midpoint (comparison)] | 0.997±0.003 |
| role match [pooled midpoint (comparison)] | 0.945±0.006 |
| role format [pooled midpoint (comparison)] | 0.978±0.000 |
| role value [pooled midpoint (comparison)] | 0.983±0.005 |
| role position [pooled midpoint (comparison)] | 0.916±0.008 |
| role new_text [pooled midpoint (comparison)] | 0.946±0.004 |
| role widget [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.804±0.010 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.982±0.016 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.998±0.005 |
| presence match: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence format: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence position: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence ordinal: absent read absent | 1.000±0.000 |
| presence match: present read present | 0.986±0.020 |
| presence match: share of 'present' readings that abstain | 0.039±0.024 |
| presence match: share of true 'present' readings that abstain | 0.039±0.024 |
| presence position: present read present | 1.000±0.000 |
| presence position: share of 'present' readings that abstain | 0.044±0.022 |
| presence position: share of true 'present' readings that abstain | 0.044±0.022 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence match: present read present [pooled midpoint (comparison)] | 0.978±0.022 |
| presence position: present read present [pooled midpoint (comparison)] | 0.990±0.013 |
| presence new_text: present read present | 0.972±0.045 |
| presence new_text: share of 'present' readings that abstain | 0.100±0.045 |
| presence new_text: share of true 'present' readings that abstain | 0.100±0.045 |
| presence new_text: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: present read present | 0.980±0.040 |
| presence value: share of 'present' readings that abstain | 0.164±0.053 |
| presence value: share of true 'present' readings that abstain | 0.164±0.053 |
| presence value: present read present [pooled midpoint (comparison)] | 0.849±0.058 |
| presence format: present read present | 0.927±0.022 |
| presence format: present read present [pooled midpoint (comparison)] | 0.864±0.000 |
| presence widget: present read present | 1.000±0.000 |
| presence widget: share of 'present' readings that abstain | 0.000±0.000 |
| presence widget: share of true 'present' readings that abstain | 0.000±0.000 |
| presence widget: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence format: share of 'present' readings that abstain | 0.029±0.024 |
| presence format: share of true 'present' readings that abstain | 0.029±0.024 |

residual mean 0.236±0.010; status {'ok': 118, 'abstain': 51, 'no-sense': 12}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.934 | 0.409 / 0.307 | 1.00 | 0.066 | 0.000 / 0.000 |
| role unit | 0.974 | 0.325 / 0.162 | 0.97 | 0.009 | 0.009 / 0.017 |
| roles (pooled) | 0.950 | 0.263 / 0.072 | 0.93 | 0.002 | 0.024 / 0.048 |
| role ordinal | 1.000 | 0.285 / 0.217 | 1.00 | 0.000 | 0.000 / 0.000 |
| role match | 0.919 | 0.206 / 0.038 | 0.87 | 0.000 | 0.048 / 0.081 |
| role position | 0.932 | 0.284 / 0.043 | 0.89 | 0.000 | 0.041 / 0.068 |
| role new_text | 0.884 | 0.138 / 0.002 | 0.86 | 0.000 | 0.023 / 0.116 |
| role value | 0.909 | 0.137 / 0.038 | 0.82 | 0.000 | 0.091 / 0.091 |
| role format | 0.913 | 0.250 / 0.027 | 0.87 | 0.000 | 0.043 / 0.087 |
| role widget | 1.000 | 0.240 / 0.224 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_formulations — experiment candidates (n = 181 of 181)
| axis | accuracy |
|---|---|
| FULL | 0.789±0.026 |
| FULL [depth given] | 0.789±0.026 |
| FULL [depth and negation given] | 0.789±0.026 |
| FULL [presence not decided] | 0.000±0.000 |
| FULL [pooled midpoint (comparison)] | 0.777±0.019 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.014±0.004 |
| presence unit: share of true 'present' readings that abstain | 0.014±0.004 |
| presence ordinal: present read present | 0.998±0.005 |
| presence ordinal: share of 'present' readings that abstain | 0.023±0.010 |
| presence ordinal: share of true 'present' readings that abstain | 0.007±0.009 |
| presence match: absent read absent | 0.966±0.018 |
| presence format: absent read absent | 0.950±0.015 |
| presence value: absent read absent | 0.949±0.017 |
| presence position: absent read absent | 0.984±0.017 |
| presence new_text: absent read absent | 0.952±0.023 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.960±0.014 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.960±0.014 |
| event type (synonym table) | 0.960±0.014 |
| role unit | 0.990±0.005 |
| head unit | 0.990±0.005 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.961±0.000 |
| occupancy: known filler | 0.966±0.009 |
| role ordinal | 0.991±0.003 |
| head ordinal | 0.991±0.003 |
| lexical order head ordinal | 0.525±0.000 |
| lexical bag head ordinal | 0.564±0.000 |
| role match | 0.947±0.011 |
| head match | 0.947±0.011 |
| lexical order head match | 0.657±0.000 |
| lexical bag head match | 0.652±0.000 |
| occupancy: not given | 0.971±0.007 |
| role format | 0.944±0.013 |
| head format | 0.944±0.013 |
| lexical order head format | 0.873±0.000 |
| lexical bag head format | 0.895±0.000 |
| role value | 0.947±0.015 |
| head value | 0.947±0.015 |
| lexical order head value | 0.939±0.000 |
| lexical bag head value | 0.939±0.000 |
| role position | 0.983±0.012 |
| head position | 0.983±0.012 |
| lexical order head position | 0.591±0.000 |
| lexical bag head position | 0.680±0.000 |
| role new_text | 0.943±0.022 |
| head new_text | 0.943±0.022 |
| lexical order head new_text | 0.762±0.000 |
| lexical bag head new_text | 0.818±0.000 |
| role widget | 1.000±0.000 |
| head widget | 1.000±0.000 |
| lexical order head widget | 0.972±0.000 |
| lexical bag head widget | 0.972±0.000 |
| heads FULL (model) | 0.789±0.026 |
| heads FULL (lexical order baseline) | 0.088±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.116±0.000 |
| role unit [presence not decided] | 0.635±0.000 |
| role ordinal [presence not decided] | 0.475±0.000 |
| role match [presence not decided] | 0.278±0.007 |
| role format [presence not decided] | 0.127±0.000 |
| role value [presence not decided] | 0.061±0.000 |
| role position [presence not decided] | 0.409±0.000 |
| role new_text [presence not decided] | 0.083±0.000 |
| role widget [presence not decided] | 0.028±0.000 |
| heads FULL (model) [presence not decided] | 0.000±0.000 |
| role unit [pooled midpoint (comparison)] | 0.922±0.010 |
| role ordinal [pooled midpoint (comparison)] | 0.990±0.004 |
| role match [pooled midpoint (comparison)] | 0.938±0.002 |
| role format [pooled midpoint (comparison)] | 0.978±0.000 |
| role value [pooled midpoint (comparison)] | 0.975±0.010 |
| role position [pooled midpoint (comparison)] | 0.916±0.008 |
| role new_text [pooled midpoint (comparison)] | 0.936±0.008 |
| role widget [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.777±0.019 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.982±0.016 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.998±0.005 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.988±0.010 |
| presence format: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: absent read absent [pooled midpoint (comparison)] | 0.989±0.010 |
| presence position: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence ordinal: absent read absent | 0.984±0.005 |
| presence match: present read present | 0.986±0.020 |
| presence match: share of 'present' readings that abstain | 0.119±0.017 |
| presence match: share of true 'present' readings that abstain | 0.064±0.031 |
| presence position: present read present | 1.000±0.000 |
| presence position: share of 'present' readings that abstain | 0.064±0.039 |
| presence position: share of true 'present' readings that abstain | 0.044±0.022 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 0.983±0.011 |
| presence match: present read present [pooled midpoint (comparison)] | 0.978±0.022 |
| presence position: present read present [pooled midpoint (comparison)] | 0.990±0.013 |
| presence new_text: present read present | 0.976±0.036 |
| presence new_text: share of 'present' readings that abstain | 0.515±0.033 |
| presence new_text: share of true 'present' readings that abstain | 0.441±0.034 |
| presence new_text: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: present read present | 0.980±0.040 |
| presence value: share of 'present' readings that abstain | 0.538±0.081 |
| presence value: share of true 'present' readings that abstain | 0.164±0.053 |
| presence value: present read present [pooled midpoint (comparison)] | 0.849±0.058 |
| presence format: present read present | 0.927±0.022 |
| presence format: present read present [pooled midpoint (comparison)] | 0.864±0.000 |
| presence value: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence widget: present read present | 1.000±0.000 |
| presence widget: share of 'present' readings that abstain | 0.000±0.000 |
| presence widget: share of true 'present' readings that abstain | 0.000±0.000 |
| presence widget: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence format: share of 'present' readings that abstain | 0.304±0.043 |
| presence format: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence match: share of FALSE 'present' readings that abstain | 0.950±0.100 |
| presence format: share of true 'present' readings that abstain | 0.049±0.030 |
| presence new_text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence ordinal: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence position: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.238±0.010; status {'ok': 96, 'abstain': 73, 'no-sense': 12}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.934 | 0.409 / 0.307 | 1.00 | 0.066 | 0.000 / 0.000 |
| role unit | 0.974 | 0.294 / 0.158 | 0.97 | 0.009 | 0.009 / 0.017 |
| roles (pooled) | 0.947 | 0.231 / 0.040 | 0.89 | 0.002 | 0.064 / 0.050 |
| role ordinal | 1.000 | 0.260 / 0.193 | 1.00 | 0.000 | 0.000 / 0.000 |
| role match | 0.919 | 0.163 / 0.013 | 0.84 | 0.000 | 0.081 / 0.081 |
| role position | 0.932 | 0.258 / 0.043 | 0.89 | 0.000 | 0.041 / 0.068 |
| role new_text | 0.860 | 0.107 / 0.000 | 0.49 | 0.000 | 0.372 / 0.140 |
| role value | 0.909 | 0.108 / 0.038 | 0.82 | 0.000 | 0.091 / 0.091 |
| role format | 0.913 | 0.204 / 0.018 | 0.87 | 0.000 | 0.043 / 0.087 |
| role widget | 1.000 | 0.174 / 0.162 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_sentences — catalog candidates (n = 478 of 478)
| axis | accuracy |
|---|---|
| FULL | 0.911±0.013 |
| FULL [depth given] | 0.911±0.013 |
| FULL [depth and negation given] | 0.911±0.013 |
| FULL [pooled midpoint (comparison)] | 0.807±0.007 |
| presence unit: present read present | 0.990±0.001 |
| presence unit: share of 'present' readings that abstain | 0.011±0.009 |
| presence unit: share of true 'present' readings that abstain | 0.011±0.009 |
| presence ordinal: present read present | 0.984±0.011 |
| presence ordinal: share of 'present' readings that abstain | 0.010±0.005 |
| presence ordinal: share of true 'present' readings that abstain | 0.010±0.005 |
| presence match: absent read absent | 0.999±0.002 |
| presence format: absent read absent | 1.000±0.000 |
| presence value: absent read absent | 1.000±0.000 |
| presence position: absent read absent | 1.000±0.000 |
| presence new_text: absent read absent | 1.000±0.000 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.951±0.010 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.951±0.010 |
| event type (synonym table) | 0.951±0.010 |
| role unit | 0.979±0.004 |
| head unit | 0.979±0.004 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.954±0.000 |
| occupancy: known filler | 0.943±0.010 |
| role ordinal | 0.987±0.007 |
| head ordinal | 0.987±0.007 |
| lexical order head ordinal | 0.544±0.000 |
| lexical bag head ordinal | 0.856±0.000 |
| role match | 0.962±0.006 |
| head match | 0.962±0.006 |
| lexical order head match | 0.724±0.000 |
| lexical bag head match | 0.824±0.000 |
| occupancy: not given | 1.000±0.000 |
| role format | 0.984±0.006 |
| head format | 0.984±0.006 |
| lexical order head format | 0.812±0.000 |
| lexical bag head format | 0.916±0.000 |
| role value | 0.986±0.006 |
| head value | 0.986±0.006 |
| lexical order head value | 0.889±0.000 |
| lexical bag head value | 0.981±0.000 |
| role position | 0.989±0.005 |
| head position | 0.989±0.005 |
| lexical order head position | 0.814±0.000 |
| lexical bag head position | 0.977±0.000 |
| role new_text | 0.991±0.003 |
| head new_text | 0.991±0.003 |
| lexical order head new_text | 0.808±0.000 |
| lexical bag head new_text | 0.941±0.000 |
| role widget | 1.000±0.000 |
| head widget | 1.000±0.000 |
| lexical order head widget | 0.983±0.000 |
| lexical bag head widget | 0.990±0.000 |
| heads FULL (model) | 0.913±0.013 |
| heads FULL (lexical order baseline) | 0.138±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.596±0.000 |
| role unit [pooled midpoint (comparison)] | 0.930±0.006 |
| role ordinal [pooled midpoint (comparison)] | 0.982±0.002 |
| role match [pooled midpoint (comparison)] | 0.951±0.004 |
| role format [pooled midpoint (comparison)] | 0.957±0.001 |
| role value [pooled midpoint (comparison)] | 0.972±0.003 |
| role position [pooled midpoint (comparison)] | 0.961±0.004 |
| role new_text [pooled midpoint (comparison)] | 0.977±0.002 |
| role widget [pooled midpoint (comparison)] | 0.999±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.809±0.007 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.981±0.006 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.991±0.002 |
| presence match: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence format: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence position: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence format: present read present | 0.943±0.024 |
| presence format: share of 'present' readings that abstain | 0.043±0.019 |
| presence format: share of true 'present' readings that abstain | 0.043±0.019 |
| presence format: present read present [pooled midpoint (comparison)] | 0.835±0.008 |
| presence position: present read present | 0.998±0.005 |
| presence position: share of 'present' readings that abstain | 0.062±0.018 |
| presence position: share of true 'present' readings that abstain | 0.062±0.018 |
| presence position: present read present [pooled midpoint (comparison)] | 0.978±0.023 |
| presence unit: absent read absent | 1.000±0.000 |
| presence ordinal: absent read absent | 1.000±0.000 |
| presence match: present read present | 0.968±0.015 |
| presence match: share of 'present' readings that abstain | 0.047±0.015 |
| presence match: share of true 'present' readings that abstain | 0.045±0.014 |
| presence new_text: present read present | 0.989±0.014 |
| presence new_text: share of 'present' readings that abstain | 0.037±0.005 |
| presence new_text: share of true 'present' readings that abstain | 0.037±0.005 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence match: present read present [pooled midpoint (comparison)] | 0.965±0.013 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.990±0.005 |
| presence value: present read present | 0.958±0.038 |
| presence value: share of 'present' readings that abstain | 0.091±0.022 |
| presence value: share of true 'present' readings that abstain | 0.091±0.022 |
| presence value: present read present [pooled midpoint (comparison)] | 0.868±0.024 |
| presence widget: present read present | 1.000±0.000 |
| presence widget: share of 'present' readings that abstain | 0.000±0.000 |
| presence widget: share of true 'present' readings that abstain | 0.000±0.000 |
| presence widget: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.262±0.008; status {'abstain': 172, 'ok': 276, 'no-sense': 30}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.937 | 0.410 / 0.306 | 1.00 | 0.063 | 0.000 / 0.000 |
| role unit | 0.968 | 0.338 / 0.158 | 0.96 | 0.015 | 0.021 / 0.018 |
| roles (pooled) | 0.932 | 0.280 / 0.061 | 0.91 | 0.006 | 0.032 / 0.062 |
| role ordinal | 0.963 | 0.292 / 0.208 | 0.96 | 0.000 | 0.005 / 0.037 |
| role format | 0.967 | 0.245 / 0.047 | 0.89 | 0.000 | 0.078 / 0.033 |
| role position | 0.899 | 0.271 / 0.016 | 0.83 | 0.000 | 0.067 / 0.101 |
| role match | 0.841 | 0.227 / 0.000 | 0.81 | 0.008 | 0.038 / 0.152 |
| role new_text | 0.935 | 0.231 / 0.057 | 0.90 | 0.000 | 0.033 / 0.065 |
| role value | 0.792 | 0.156 / 0.000 | 0.72 | 0.000 | 0.075 / 0.208 |
| role widget | 1.000 | 0.207 / 0.163 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_sentences — experiment candidates (n = 478 of 478)
| axis | accuracy |
|---|---|
| FULL | 0.747±0.009 |
| FULL [depth given] | 0.747±0.009 |
| FULL [depth and negation given] | 0.747±0.009 |
| FULL [pooled midpoint (comparison)] | 0.772±0.013 |
| presence unit: present read present | 0.990±0.001 |
| presence unit: share of 'present' readings that abstain | 0.013±0.011 |
| presence unit: share of true 'present' readings that abstain | 0.011±0.009 |
| presence ordinal: present read present | 0.984±0.011 |
| presence ordinal: share of 'present' readings that abstain | 0.058±0.023 |
| presence ordinal: share of true 'present' readings that abstain | 0.010±0.005 |
| presence match: absent read absent | 0.965±0.028 |
| presence format: absent read absent | 0.956±0.022 |
| presence format: share of 'present' readings that abstain | 0.196±0.074 |
| presence format: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence value: absent read absent | 0.939±0.027 |
| presence position: absent read absent | 0.984±0.013 |
| presence new_text: absent read absent | 0.951±0.010 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.951±0.010 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.951±0.010 |
| event type (synonym table) | 0.951±0.010 |
| role unit | 0.977±0.005 |
| head unit | 0.977±0.005 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.954±0.000 |
| occupancy: known filler | 0.943±0.010 |
| role ordinal | 0.964±0.008 |
| head ordinal | 0.964±0.008 |
| lexical order head ordinal | 0.544±0.000 |
| lexical bag head ordinal | 0.856±0.000 |
| role match | 0.938±0.015 |
| head match | 0.938±0.015 |
| lexical order head match | 0.724±0.000 |
| lexical bag head match | 0.824±0.000 |
| occupancy: not given | 0.968±0.005 |
| role format | 0.950±0.011 |
| head format | 0.950±0.011 |
| lexical order head format | 0.812±0.000 |
| lexical bag head format | 0.916±0.000 |
| role value | 0.933±0.019 |
| head value | 0.933±0.019 |
| lexical order head value | 0.889±0.000 |
| lexical bag head value | 0.981±0.000 |
| role position | 0.977±0.008 |
| head position | 0.977±0.008 |
| lexical order head position | 0.814±0.000 |
| lexical bag head position | 0.977±0.000 |
| role new_text | 0.952±0.008 |
| head new_text | 0.952±0.008 |
| lexical order head new_text | 0.808±0.000 |
| lexical bag head new_text | 0.941±0.000 |
| role widget | 1.000±0.000 |
| head widget | 1.000±0.000 |
| lexical order head widget | 0.983±0.000 |
| lexical bag head widget | 0.990±0.000 |
| heads FULL (model) | 0.749±0.009 |
| heads FULL (lexical order baseline) | 0.138±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.596±0.000 |
| role unit [pooled midpoint (comparison)] | 0.930±0.006 |
| role ordinal [pooled midpoint (comparison)] | 0.964±0.010 |
| role match [pooled midpoint (comparison)] | 0.948±0.004 |
| role format [pooled midpoint (comparison)] | 0.957±0.001 |
| role value [pooled midpoint (comparison)] | 0.962±0.004 |
| role position [pooled midpoint (comparison)] | 0.961±0.004 |
| role new_text [pooled midpoint (comparison)] | 0.973±0.002 |
| role widget [pooled midpoint (comparison)] | 0.999±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.774±0.013 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.981±0.006 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.991±0.002 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.995±0.004 |
| presence format: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: absent read absent [pooled midpoint (comparison)] | 0.987±0.004 |
| presence position: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence format: present read present | 0.943±0.024 |
| presence format: share of true 'present' readings that abstain | 0.046±0.024 |
| presence format: present read present [pooled midpoint (comparison)] | 0.835±0.008 |
| presence position: present read present | 0.998±0.005 |
| presence position: share of 'present' readings that abstain | 0.121±0.030 |
| presence position: share of true 'present' readings that abstain | 0.062±0.018 |
| presence position: present read present [pooled midpoint (comparison)] | 0.978±0.023 |
| presence unit: absent read absent | 0.993±0.010 |
| presence ordinal: absent read absent | 0.954±0.019 |
| presence match: present read present | 0.968±0.015 |
| presence match: share of 'present' readings that abstain | 0.135±0.065 |
| presence match: share of true 'present' readings that abstain | 0.054±0.020 |
| presence new_text: present read present | 0.991±0.011 |
| presence new_text: share of 'present' readings that abstain | 0.284±0.037 |
| presence new_text: share of true 'present' readings that abstain | 0.141±0.023 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 0.959±0.021 |
| presence match: present read present [pooled midpoint (comparison)] | 0.965±0.013 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.990±0.005 |
| presence match: share of FALSE 'present' readings that abstain | 0.993±0.013 |
| presence new_text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence value: present read present | 0.958±0.038 |
| presence value: share of 'present' readings that abstain | 0.397±0.072 |
| presence value: share of true 'present' readings that abstain | 0.096±0.029 |
| presence value: present read present [pooled midpoint (comparison)] | 0.868±0.024 |
| presence value: share of FALSE 'present' readings that abstain | 0.994±0.011 |
| presence widget: present read present | 1.000±0.000 |
| presence widget: share of 'present' readings that abstain | 0.000±0.000 |
| presence widget: share of true 'present' readings that abstain | 0.000±0.000 |
| presence widget: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: share of FALSE 'present' readings that abstain | nan±nan |
| presence ordinal: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence position: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.262±0.008; status {'abstain': 195, 'ok': 253, 'no-sense': 30}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.937 | 0.410 / 0.306 | 1.00 | 0.063 | 0.000 / 0.000 |
| role unit | 0.968 | 0.304 / 0.158 | 0.96 | 0.015 | 0.021 / 0.018 |
| roles (pooled) | 0.930 | 0.247 / 0.048 | 0.90 | 0.006 | 0.039 / 0.064 |
| role ordinal | 0.963 | 0.263 / 0.194 | 0.96 | 0.000 | 0.005 / 0.037 |
| role format | 0.967 | 0.201 / 0.045 | 0.88 | 0.000 | 0.089 / 0.033 |
| role position | 0.899 | 0.241 / 0.016 | 0.83 | 0.000 | 0.067 / 0.101 |
| role match | 0.841 | 0.199 / 0.000 | 0.81 | 0.008 | 0.038 / 0.152 |
| role new_text | 0.913 | 0.200 / 0.022 | 0.82 | 0.000 | 0.098 / 0.087 |
| role value | 0.792 | 0.132 / 0.000 | 0.72 | 0.000 | 0.075 / 0.208 |
| role widget | 1.000 | 0.153 / 0.122 | 1.00 | 0.000 | 0.000 / 0.000 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.841±0.015 |
| FULL [depth given] | 0.841±0.015 |
| FULL [depth and negation given] | 0.841±0.015 |
| FULL [pooled midpoint (comparison)] | 0.729±0.011 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence ordinal: absent read absent | 1.000±0.000 |
| presence match: present read present | 0.968±0.008 |
| presence match: share of 'present' readings that abstain | 0.067±0.014 |
| presence match: share of true 'present' readings that abstain | 0.067±0.014 |
| presence format: absent read absent | 1.000±0.000 |
| presence value: present read present | 0.968±0.031 |
| presence position: absent read absent | 1.000±0.000 |
| presence new_text: absent read absent | 1.000±0.000 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.879±0.014 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.879±0.014 |
| event type (synonym table) | 0.879±0.014 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 1.000±0.000 |
| occupancy: known filler | 0.935±0.013 |
| role ordinal | 1.000±0.000 |
| head ordinal | 1.000±0.000 |
| lexical order head ordinal | 0.815±0.000 |
| lexical bag head ordinal | 0.960±0.000 |
| occupancy: not given | 1.000±0.000 |
| role match | 0.860±0.017 |
| head match | 0.860±0.017 |
| lexical order head match | 0.230±0.000 |
| lexical bag head match | 0.570±0.000 |
| occupancy: unknown filler | 0.865±0.016 |
| role format | 0.985±0.005 |
| head format | 0.985±0.005 |
| lexical order head format | 0.938±0.000 |
| lexical bag head format | 0.968±0.000 |
| role value | 0.978±0.003 |
| head value | 0.978±0.003 |
| lexical order head value | 0.918±0.000 |
| lexical bag head value | 0.990±0.000 |
| role position | 0.971±0.009 |
| head position | 0.971±0.009 |
| lexical order head position | 0.662±0.000 |
| lexical bag head position | 0.975±0.000 |
| role new_text | 0.967±0.007 |
| head new_text | 0.967±0.007 |
| lexical order head new_text | 0.532±0.000 |
| lexical bag head new_text | 0.882±0.000 |
| role widget | 1.000±0.000 |
| head widget | 1.000±0.000 |
| lexical order head widget | 0.940±0.000 |
| lexical bag head widget | 0.945±0.000 |
| heads FULL (model) | 0.841±0.015 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.432±0.000 |
| role unit [pooled midpoint (comparison)] | 0.985±0.007 |
| role ordinal [pooled midpoint (comparison)] | 1.000±0.001 |
| role match [pooled midpoint (comparison)] | 0.792±0.006 |
| role format [pooled midpoint (comparison)] | 0.957±0.001 |
| role value [pooled midpoint (comparison)] | 0.973±0.001 |
| role position [pooled midpoint (comparison)] | 0.915±0.010 |
| role new_text [pooled midpoint (comparison)] | 0.932±0.004 |
| role widget [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.729±0.011 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.996±0.006 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence match: present read present [pooled midpoint (comparison)] | 0.934±0.006 |
| presence format: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: present read present [pooled midpoint (comparison)] | 0.925±0.017 |
| presence position: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence value: absent read absent | 1.000±0.000 |
| presence new_text: present read present | 0.986±0.008 |
| presence new_text: share of 'present' readings that abstain | 0.038±0.013 |
| presence new_text: share of true 'present' readings that abstain | 0.038±0.013 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.991±0.008 |
| presence ordinal: present read present | 1.000±0.000 |
| presence ordinal: share of 'present' readings that abstain | 0.003±0.005 |
| presence ordinal: share of true 'present' readings that abstain | 0.003±0.005 |
| presence match: absent read absent | 0.998±0.004 |
| presence format: present read present | 0.861±0.061 |
| presence format: share of 'present' readings that abstain | 0.187±0.094 |
| presence format: share of true 'present' readings that abstain | 0.187±0.094 |
| presence widget: present read present | 1.000±0.000 |
| presence widget: share of 'present' readings that abstain | 0.000±0.000 |
| presence widget: share of true 'present' readings that abstain | 0.000±0.000 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.997±0.005 |
| presence match: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence format: present read present [pooled midpoint (comparison)] | 0.379±0.016 |
| presence widget: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence position: present read present | 0.995±0.006 |
| presence position: share of 'present' readings that abstain | 0.039±0.018 |
| presence position: share of true 'present' readings that abstain | 0.039±0.018 |
| presence position: present read present [pooled midpoint (comparison)] | 0.971±0.020 |
| presence value: share of 'present' readings that abstain | 0.041±0.051 |
| presence value: share of true 'present' readings that abstain | 0.041±0.051 |

residual mean 0.329±0.011; status {'abstain': 124, 'ok': 221, 'no-sense': 55}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.863 | 0.424 / 0.323 | 1.00 | 0.138 | 0.000 / 0.000 |
| role unit | 1.000 | 0.339 / 0.238 | 1.00 | 0.000 | 0.000 / 0.000 |
| roles (pooled) | 0.880 | 0.235 / 0.000 | 0.84 | 0.003 | 0.040 / 0.117 |
| role match | 0.802 | 0.201 / 0.000 | 0.75 | 0.003 | 0.055 / 0.195 |
| role value | 0.667 | 0.165 / 0.000 | 0.67 | 0.000 | 0.000 / 0.333 |
| role new_text | 0.898 | 0.205 / 0.022 | 0.84 | 0.000 | 0.053 / 0.102 |
| role ordinal | 1.000 | 0.297 / 0.228 | 1.00 | 0.000 | 0.000 / 0.000 |
| role format | 0.840 | 0.131 / 0.002 | 0.64 | 0.000 | 0.200 / 0.160 |
| role widget | 1.000 | 0.200 / 0.176 | 1.00 | 0.000 | 0.000 / 0.000 |
| role position | 0.874 | 0.254 / 0.010 | 0.85 | 0.015 | 0.037 / 0.111 |

### new_identities — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.659±0.039 |
| FULL [depth given] | 0.659±0.039 |
| FULL [depth and negation given] | 0.659±0.039 |
| FULL [pooled midpoint (comparison)] | 0.693±0.020 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.024±0.007 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence ordinal: absent read absent | 0.994±0.006 |
| presence match: present read present | 0.968±0.008 |
| presence match: share of 'present' readings that abstain | 0.136±0.013 |
| presence match: share of true 'present' readings that abstain | 0.070±0.014 |
| presence format: absent read absent | 0.992±0.008 |
| presence value: present read present | 0.968±0.031 |
| presence position: absent read absent | 0.942±0.056 |
| presence new_text: absent read absent | 0.939±0.027 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.879±0.014 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.879±0.014 |
| event type (synonym table) | 0.879±0.014 |
| role unit | 0.991±0.003 |
| head unit | 0.991±0.003 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 1.000±0.000 |
| occupancy: known filler | 0.935±0.013 |
| role ordinal | 0.996±0.004 |
| head ordinal | 0.996±0.004 |
| lexical order head ordinal | 0.815±0.000 |
| lexical bag head ordinal | 0.960±0.000 |
| occupancy: not given | 0.965±0.009 |
| role match | 0.810±0.014 |
| head match | 0.810±0.014 |
| lexical order head match | 0.230±0.000 |
| lexical bag head match | 0.570±0.000 |
| occupancy: unknown filler | 0.865±0.017 |
| role format | 0.978±0.006 |
| head format | 0.978±0.006 |
| lexical order head format | 0.938±0.000 |
| lexical bag head format | 0.968±0.000 |
| role value | 0.907±0.029 |
| head value | 0.907±0.029 |
| lexical order head value | 0.918±0.000 |
| lexical bag head value | 0.990±0.000 |
| role position | 0.938±0.031 |
| head position | 0.938±0.031 |
| lexical order head position | 0.662±0.000 |
| lexical bag head position | 0.975±0.000 |
| role new_text | 0.934±0.011 |
| head new_text | 0.934±0.011 |
| lexical order head new_text | 0.532±0.000 |
| lexical bag head new_text | 0.882±0.000 |
| role widget | 1.000±0.000 |
| head widget | 1.000±0.000 |
| lexical order head widget | 0.940±0.000 |
| lexical bag head widget | 0.945±0.000 |
| heads FULL (model) | 0.659±0.039 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.432±0.000 |
| role unit [pooled midpoint (comparison)] | 0.985±0.007 |
| role ordinal [pooled midpoint (comparison)] | 0.998±0.000 |
| role match [pooled midpoint (comparison)] | 0.783±0.009 |
| role format [pooled midpoint (comparison)] | 0.957±0.001 |
| role value [pooled midpoint (comparison)] | 0.948±0.010 |
| role position [pooled midpoint (comparison)] | 0.915±0.010 |
| role new_text [pooled midpoint (comparison)] | 0.928±0.004 |
| role widget [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.693±0.020 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.996±0.006 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 0.997±0.002 |
| presence match: present read present [pooled midpoint (comparison)] | 0.934±0.006 |
| presence format: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: present read present [pooled midpoint (comparison)] | 0.925±0.017 |
| presence position: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent | 0.983±0.005 |
| presence value: absent read absent | 0.914±0.037 |
| presence new_text: present read present | 0.988±0.007 |
| presence new_text: share of 'present' readings that abstain | 0.185±0.043 |
| presence new_text: share of true 'present' readings that abstain | 0.135±0.044 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: absent read absent [pooled midpoint (comparison)] | 0.966±0.015 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.991±0.008 |
| presence ordinal: present read present | 1.000±0.000 |
| presence ordinal: share of 'present' readings that abstain | 0.026±0.019 |
| presence ordinal: share of true 'present' readings that abstain | 0.003±0.005 |
| presence match: absent read absent | 0.779±0.051 |
| presence format: present read present | 0.861±0.061 |
| presence format: share of 'present' readings that abstain | 0.267±0.147 |
| presence format: share of true 'present' readings that abstain | 0.187±0.094 |
| presence widget: present read present | 1.000±0.000 |
| presence widget: share of 'present' readings that abstain | 0.000±0.000 |
| presence widget: share of true 'present' readings that abstain | 0.000±0.000 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.997±0.005 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.963±0.023 |
| presence format: present read present [pooled midpoint (comparison)] | 0.379±0.016 |
| presence widget: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence position: share of 'present' readings that abstain | 0.125±0.068 |
| presence position: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence position: present read present | 0.995±0.006 |
| presence position: share of true 'present' readings that abstain | 0.039±0.018 |
| presence position: present read present [pooled midpoint (comparison)] | 0.971±0.020 |
| presence unit: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence value: share of 'present' readings that abstain | 0.537±0.098 |
| presence value: share of true 'present' readings that abstain | 0.041±0.051 |
| presence match: share of FALSE 'present' readings that abstain | 0.969±0.062 |
| presence new_text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence format: share of FALSE 'present' readings that abstain | nan±nan |
| presence value: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence ordinal: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.330±0.010; status {'abstain': 152, 'ok': 193, 'no-sense': 55}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.863 | 0.424 / 0.323 | 1.00 | 0.138 | 0.000 / 0.000 |
| role unit | 1.000 | 0.299 / 0.218 | 1.00 | 0.000 | 0.000 / 0.000 |
| roles (pooled) | 0.878 | 0.209 / 0.000 | 0.82 | 0.003 | 0.058 / 0.119 |
| role match | 0.802 | 0.182 / 0.000 | 0.75 | 0.003 | 0.058 / 0.195 |
| role value | 0.667 | 0.140 / 0.000 | 0.67 | 0.000 | 0.000 / 0.333 |
| role new_text | 0.888 | 0.180 / 0.001 | 0.75 | 0.000 | 0.139 / 0.112 |
| role ordinal | 1.000 | 0.262 / 0.185 | 1.00 | 0.000 | 0.000 / 0.000 |
| role format | 0.840 | 0.109 / 0.002 | 0.64 | 0.000 | 0.200 / 0.160 |
| role widget | 1.000 | 0.157 / 0.134 | 1.00 | 0.000 | 0.000 / 0.000 |
| role position | 0.874 | 0.231 / 0.010 | 0.85 | 0.015 | 0.037 / 0.111 |

### train (sample) — catalog candidates (n = 300 of 4522)
| axis | accuracy |
|---|---|
| FULL | 0.910±0.012 |
| FULL [depth given] | 0.910±0.012 |
| FULL [depth and negation given] | 0.910±0.012 |
| presence unit: present read present | 0.999±0.002 |
| presence unit: share of 'present' readings that abstain | 0.006±0.004 |
| presence unit: share of true 'present' readings that abstain | 0.006±0.004 |
| presence ordinal: present read present | 0.991±0.008 |
| presence ordinal: share of 'present' readings that abstain | 0.017±0.006 |
| presence ordinal: share of true 'present' readings that abstain | 0.017±0.006 |
| presence match: absent read absent | 1.000±0.000 |
| presence format: present read present | 0.945±0.032 |
| presence format: share of 'present' readings that abstain | 0.062±0.016 |
| presence format: share of true 'present' readings that abstain | 0.062±0.016 |
| presence value: absent read absent | 1.000±0.000 |
| presence position: absent read absent | 1.000±0.000 |
| presence new_text: absent read absent | 1.000±0.000 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.942±0.014 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.942±0.014 |
| event type (synonym table) | 0.942±0.014 |
| role unit | 0.987±0.005 |
| head unit | 0.987±0.005 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.973±0.000 |
| occupancy: known filler | 0.938±0.010 |
| role ordinal | 0.990±0.008 |
| head ordinal | 0.990±0.008 |
| lexical order head ordinal | 0.523±0.000 |
| lexical bag head ordinal | 0.973±0.000 |
| role match | 0.951±0.013 |
| head match | 0.951±0.013 |
| lexical order head match | 0.687±0.000 |
| lexical bag head match | 0.897±0.000 |
| occupancy: not given | 1.000±0.000 |
| role format | 0.984±0.006 |
| head format | 0.984±0.006 |
| lexical order head format | 0.823±0.000 |
| lexical bag head format | 0.983±0.000 |
| role value | 0.992±0.008 |
| head value | 0.992±0.008 |
| lexical order head value | 0.903±0.000 |
| lexical bag head value | 1.000±0.000 |
| role position | 0.981±0.008 |
| head position | 0.981±0.008 |
| lexical order head position | 0.800±0.000 |
| lexical bag head position | 1.000±0.000 |
| role new_text | 0.981±0.007 |
| head new_text | 0.981±0.007 |
| lexical order head new_text | 0.780±0.000 |
| lexical bag head new_text | 0.940±0.000 |
| role widget | 1.000±0.000 |
| head widget | 1.000±0.000 |
| lexical order head widget | 0.970±0.000 |
| lexical bag head widget | 1.000±0.000 |
| heads FULL (model) | 0.917±0.012 |
| heads FULL (lexical order baseline) | 0.130±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.837±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence ordinal: absent read absent | 1.000±0.000 |
| presence format: absent read absent | 1.000±0.000 |
| presence position: present read present | 0.986±0.013 |
| presence position: share of 'present' readings that abstain | 0.070±0.015 |
| presence position: share of true 'present' readings that abstain | 0.070±0.015 |
| presence match: present read present | 0.959±0.022 |
| presence match: share of 'present' readings that abstain | 0.076±0.044 |
| presence match: share of true 'present' readings that abstain | 0.076±0.044 |
| presence new_text: present read present | 0.977±0.013 |
| presence new_text: share of 'present' readings that abstain | 0.042±0.031 |
| presence new_text: share of true 'present' readings that abstain | 0.042±0.031 |
| presence value: present read present | 0.962±0.060 |
| presence value: share of 'present' readings that abstain | 0.158±0.033 |
| presence value: share of true 'present' readings that abstain | 0.158±0.033 |
| presence widget: present read present | 1.000±0.000 |
| presence widget: share of 'present' readings that abstain | 0.000±0.000 |
| presence widget: share of true 'present' readings that abstain | 0.000±0.000 |

residual mean 0.268±0.009; status {'ok': 180, 'no-sense': 23, 'abstain': 97}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.923 | 0.416 / 0.295 | 1.00 | 0.077 | 0.000 / 0.000 |
| role unit | 0.980 | 0.354 / 0.241 | 0.98 | 0.015 | 0.010 / 0.005 |
| roles (pooled) | 0.922 | 0.281 / 0.041 | 0.90 | 0.006 | 0.032 / 0.072 |
| role ordinal | 0.979 | 0.294 / 0.192 | 0.96 | 0.000 | 0.021 / 0.021 |
| role format | 0.962 | 0.260 / 0.051 | 0.89 | 0.000 | 0.075 / 0.038 |
| role position | 0.850 | 0.268 / 0.000 | 0.80 | 0.000 | 0.050 / 0.150 |
| role match | 0.809 | 0.209 / 0.000 | 0.78 | 0.011 | 0.043 / 0.181 |
| role new_text | 0.879 | 0.221 / 0.000 | 0.85 | 0.000 | 0.030 / 0.121 |
| role value | 0.759 | 0.164 / 0.000 | 0.66 | 0.000 | 0.103 / 0.241 |
| role widget | 1.000 | 0.235 / 0.214 | 1.00 | 0.000 | 0.000 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 for=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 UNIT=0.95 POS=0.95 PRON=0.90 MATCH=0.72 ORD=0.68 WHEAD=0.63 ALIGN=0.63 COLOR=0.54 VERB=0.51 FILLER=0.48 again=0.41 FORMAT=0.30 SIZE=0.14 back=0.13 DEM=0.12 all=0.12 text=0.12 unknown=0.12 a=0.03 cursor=0.02 PUNCT=0.01 the=0.00

## What is weak, what to add
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.009
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.009
- heldout_formulations: presence ordinal: share of 'present' readings that abstain 0.000
- heldout_formulations: presence ordinal: share of true 'present' readings that abstain 0.000
- heldout_formulations: heads FULL (lexical order baseline) 0.088
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.116
- heldout_formulations: FULL [presence not decided] 0.779
- heldout_formulations: role match [presence not decided] 0.779
- heldout_formulations: role new_text [presence not decided] 0.779
- heldout_formulations: heads FULL (model) [presence not decided] 0.779
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.807
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.807
- heldout_formulations: presence match: share of 'present' readings that abstain 0.053
- heldout_formulations: presence match: share of true 'present' readings that abstain 0.053
- heldout_formulations: presence position: share of 'present' readings that abstain 0.043
- heldout_formulations: presence position: share of true 'present' readings that abstain 0.043
- heldout_formulations: presence new_text: share of 'present' readings that abstain 0.026
- heldout_formulations: presence new_text: share of true 'present' readings that abstain 0.026
- heldout_formulations: presence value: share of 'present' readings that abstain 0.100
- heldout_formulations: presence value: share of true 'present' readings that abstain 0.100
- heldout_formulations: presence format: present read present [pooled midpoint (comparison)] 0.864
- heldout_formulations: presence widget: share of 'present' readings that abstain 0.000
- heldout_formulations: presence widget: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence format: share of 'present' readings that abstain 0.048
- heldout_formulations: presence format: share of true 'present' readings that abstain 0.048
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.021
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.021
- heldout_sentences: presence ordinal: share of 'present' readings that abstain 0.005
- heldout_sentences: presence ordinal: share of true 'present' readings that abstain 0.005
- heldout_sentences: heads FULL (lexical order baseline) 0.138
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.596
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.797
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.799
- heldout_sentences: presence format: share of 'present' readings that abstain 0.080
- heldout_sentences: presence format: share of true 'present' readings that abstain 0.080
- heldout_sentences: presence format: present read present [pooled midpoint (comparison)] 0.841
- heldout_sentences: presence position: share of 'present' readings that abstain 0.075
- heldout_sentences: presence position: share of true 'present' readings that abstain 0.075
- heldout_sentences: presence match: share of 'present' readings that abstain 0.045
- heldout_sentences: presence match: share of true 'present' readings that abstain 0.045
- heldout_sentences: presence new_text: share of 'present' readings that abstain 0.035
- heldout_sentences: presence new_text: share of true 'present' readings that abstain 0.035
- heldout_sentences: presence value: share of 'present' readings that abstain 0.095
- heldout_sentences: presence value: share of true 'present' readings that abstain 0.095
- heldout_sentences: presence value: present read present [pooled midpoint (comparison)] 0.867
- heldout_sentences: presence widget: share of 'present' readings that abstain 0.000
- heldout_sentences: presence widget: share of true 'present' readings that abstain 0.000
- new_identities: FULL 0.825
- new_identities: presence unit: share of 'present' readings that abstain 0.000
- new_identities: presence unit: share of true 'present' readings that abstain 0.000
- new_identities: presence match: share of 'present' readings that abstain 0.069
- new_identities: presence match: share of true 'present' readings that abstain 0.069
- new_identities: structure (depth, negation) 0.863
- new_identities: predicate (surface lemma) 0.863
- new_identities: event type (synonym table) 0.863
- new_identities: role match 0.848
- new_identities: head match 0.848
- new_identities: occupancy: unknown filler 0.846
- new_identities: heads FULL (model) 0.825
- new_identities: heads FULL (lexical order baseline) 0.000
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.432
- new_identities: FULL [depth given] 0.825
- new_identities: FULL [depth and negation given] 0.825
- new_identities: FULL [pooled midpoint (comparison)] 0.710
- new_identities: role match [pooled midpoint (comparison)] 0.782
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.710
- new_identities: presence new_text: share of 'present' readings that abstain 0.060
- new_identities: presence new_text: share of true 'present' readings that abstain 0.060
- new_identities: presence ordinal: share of 'present' readings that abstain 0.000
- new_identities: presence ordinal: share of true 'present' readings that abstain 0.000
- new_identities: presence format: share of 'present' readings that abstain 0.238
- new_identities: presence format: share of true 'present' readings that abstain 0.238
- new_identities: presence widget: share of 'present' readings that abstain 0.000
- new_identities: presence widget: share of true 'present' readings that abstain 0.000
- new_identities: presence format: present read present [pooled midpoint (comparison)] 0.350
- new_identities: presence position: share of 'present' readings that abstain 0.042
- new_identities: presence position: share of true 'present' readings that abstain 0.042
- new_identities: presence value: share of 'present' readings that abstain 0.000
- new_identities: presence value: share of true 'present' readings that abstain 0.000
- train (sample): FULL 0.893
- train (sample): presence unit: share of 'present' readings that abstain 0.010
- train (sample): presence unit: share of true 'present' readings that abstain 0.010
- train (sample): presence ordinal: share of 'present' readings that abstain 0.021
- train (sample): presence ordinal: share of true 'present' readings that abstain 0.021
- train (sample): presence format: share of 'present' readings that abstain 0.078
- train (sample): presence format: share of true 'present' readings that abstain 0.078
- train (sample): heads FULL (lexical order baseline) 0.130
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.837
- train (sample): FULL [depth given] 0.893
- train (sample): FULL [depth and negation given] 0.893
- train (sample): presence position: share of 'present' readings that abstain 0.059
- train (sample): presence position: share of true 'present' readings that abstain 0.059
- train (sample): presence match: share of 'present' readings that abstain 0.053
- train (sample): presence match: share of true 'present' readings that abstain 0.053
- train (sample): presence new_text: share of 'present' readings that abstain 0.034
- train (sample): presence new_text: share of true 'present' readings that abstain 0.034
- train (sample): presence value: present read present 0.846
- train (sample): presence value: share of 'present' readings that abstain 0.136
- train (sample): presence value: share of true 'present' readings that abstain 0.136
- train (sample): presence widget: share of 'present' readings that abstain 0.000
- train (sample): presence widget: share of true 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- new_identities: `would you make MATCH SIZE` FULL 0.000 (n 3)
- heldout_formulations: `now choose PRON` FULL 0.000 (n 2)
- heldout_sentences: `now go POS MATCH` FULL 0.000 (n 2)
- new_identities: `please add MATCH POS MATCH` FULL 0.000 (n 2)
- new_identities: `okay so unformat MATCH` FULL 0.000 (n 2)
- new_identities: `now erase MATCH` FULL 0.000 (n 2)
- new_identities: `please unformat FORMAT MATCH` FULL 0.000 (n 2)
- heldout_formulations: `could you set the ORD UNIT FORMAT` FULL 0.000 (n 1)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role unit | role ordinal | role match | role format | role value | role position | role new_text | role widget |
|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.938±0.017 | 0.938±0.017 | 0.990±0.005 | 0.999±0.002 | 0.969±0.004 | 0.986±0.003 | 0.993±0.002 | 0.992±0.010 | 0.989±0.014 | 1.000±0.000 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.804±0.010 | 0.804±0.010 | 0.922±0.010 | 0.997±0.003 | 0.945±0.006 | 0.978±0.000 | 0.983±0.005 | 0.916±0.008 | 0.946±0.004 | 1.000±0.000 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.776±0.008 | 0.776±0.008 | 1.000±0.000 | 1.000±0.000 | 0.776±0.008 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.776±0.008 | 1.000±0.000 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.014±0.004 (— / 0.014±0.004) |
| heldout_formulations | unit | comparison: pooled midpoint | 0.982±0.016 | 1.000±0.000 | 0.991±0.008 |  |
| heldout_formulations | ordinal | product: fitted | 0.998±0.005 | 1.000±0.000 | 0.999±0.002 | 0.007±0.009 (— / 0.007±0.009) |
| heldout_formulations | ordinal | comparison: pooled midpoint | 0.998±0.005 | 1.000±0.000 | 0.999±0.002 |  |
| heldout_formulations | match | product: fitted | 0.986±0.020 | 0.998±0.003 | 0.992±0.010 | 0.039±0.024 (0.000 / 0.039±0.024) |
| heldout_formulations | match | comparison: pooled midpoint | 0.978±0.022 | 1.000±0.000 | 0.989±0.011 |  |
| heldout_formulations | format | product: fitted | 0.927±0.022 | 1.000±0.000 | 0.964±0.011 | 0.029±0.024 (— / 0.029±0.024) |
| heldout_formulations | format | comparison: pooled midpoint | 0.864±0.000 | 1.000±0.000 | 0.932±0.000 |  |
| heldout_formulations | value | product: fitted | 0.980±0.040 | 1.000±0.000 | 0.990±0.020 | 0.164±0.053 (— / 0.164±0.053) |
| heldout_formulations | value | comparison: pooled midpoint | 0.849±0.058 | 1.000±0.000 | 0.924±0.029 |  |
| heldout_formulations | position | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.044±0.022 (— / 0.044±0.022) |
| heldout_formulations | position | comparison: pooled midpoint | 0.990±0.013 | 1.000±0.000 | 0.995±0.007 |  |
| heldout_formulations | new_text | product: fitted | 0.972±0.045 | 1.000±0.000 | 0.986±0.023 | 0.100±0.045 (— / 0.100±0.045) |
| heldout_formulations | new_text | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | widget | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | widget | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | unit | product: fitted | 0.990±0.001 | 1.000±0.000 | 0.995±0.001 | 0.011±0.009 (— / 0.011±0.009) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.981±0.006 | 1.000±0.000 | 0.990±0.003 |  |
| heldout_sentences | ordinal | product: fitted | 0.984±0.011 | 1.000±0.000 | 0.992±0.006 | 0.010±0.005 (— / 0.010±0.005) |
| heldout_sentences | ordinal | comparison: pooled midpoint | 0.991±0.002 | 1.000±0.000 | 0.996±0.001 |  |
| heldout_sentences | match | product: fitted | 0.968±0.015 | 0.999±0.002 | 0.983±0.007 | 0.047±0.015 (0.500 / 0.045±0.014) |
| heldout_sentences | match | comparison: pooled midpoint | 0.965±0.013 | 1.000±0.000 | 0.982±0.006 |  |
| heldout_sentences | format | product: fitted | 0.943±0.024 | 1.000±0.000 | 0.971±0.012 | 0.043±0.019 (— / 0.043±0.019) |
| heldout_sentences | format | comparison: pooled midpoint | 0.835±0.008 | 1.000±0.000 | 0.917±0.004 |  |
| heldout_sentences | value | product: fitted | 0.958±0.038 | 1.000±0.000 | 0.979±0.019 | 0.091±0.022 (— / 0.091±0.022) |
| heldout_sentences | value | comparison: pooled midpoint | 0.868±0.024 | 1.000±0.000 | 0.934±0.012 |  |
| heldout_sentences | position | product: fitted | 0.998±0.005 | 1.000±0.000 | 0.999±0.002 | 0.062±0.018 (— / 0.062±0.018) |
| heldout_sentences | position | comparison: pooled midpoint | 0.978±0.023 | 1.000±0.000 | 0.989±0.011 |  |
| heldout_sentences | new_text | product: fitted | 0.989±0.014 | 1.000±0.000 | 0.994±0.007 | 0.037±0.005 (— / 0.037±0.005) |
| heldout_sentences | new_text | comparison: pooled midpoint | 0.990±0.005 | 1.000±0.000 | 0.995±0.002 |  |
| heldout_sentences | widget | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | widget | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | unit | comparison: pooled midpoint | 0.996±0.006 | 1.000±0.000 | 0.998±0.003 |  |
| new_identities | ordinal | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.003±0.005 (— / 0.003±0.005) |
| new_identities | ordinal | comparison: pooled midpoint | 0.997±0.005 | 1.000±0.000 | 0.999±0.003 |  |
| new_identities | match | product: fitted | 0.968±0.008 | 0.998±0.004 | 0.983±0.004 | 0.067±0.014 (0.000 / 0.067±0.014) |
| new_identities | match | comparison: pooled midpoint | 0.934±0.006 | 1.000±0.000 | 0.967±0.003 |  |
| new_identities | format | product: fitted | 0.861±0.061 | 1.000±0.000 | 0.930±0.030 | 0.187±0.094 (— / 0.187±0.094) |
| new_identities | format | comparison: pooled midpoint | 0.379±0.016 | 1.000±0.000 | 0.689±0.008 |  |
| new_identities | value | product: fitted | 0.968±0.031 | 1.000±0.000 | 0.984±0.015 | 0.041±0.051 (— / 0.041±0.051) |
| new_identities | value | comparison: pooled midpoint | 0.925±0.017 | 1.000±0.000 | 0.962±0.008 |  |
| new_identities | position | product: fitted | 0.995±0.006 | 1.000±0.000 | 0.998±0.003 | 0.039±0.018 (— / 0.039±0.018) |
| new_identities | position | comparison: pooled midpoint | 0.971±0.020 | 1.000±0.000 | 0.985±0.010 |  |
| new_identities | new_text | product: fitted | 0.986±0.008 | 1.000±0.000 | 0.993±0.004 | 0.038±0.013 (— / 0.038±0.013) |
| new_identities | new_text | comparison: pooled midpoint | 0.991±0.008 | 1.000±0.000 | 0.996±0.004 |  |
| new_identities | widget | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | widget | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| train (sample) | unit | product: fitted | 0.999±0.002 | 1.000±0.000 | 0.999±0.001 | 0.006±0.004 (— / 0.006±0.004) |
| train (sample) | ordinal | product: fitted | 0.991±0.008 | 1.000±0.000 | 0.996±0.004 | 0.017±0.006 (— / 0.017±0.006) |
| train (sample) | match | product: fitted | 0.959±0.022 | 1.000±0.000 | 0.980±0.011 | 0.076±0.044 (— / 0.076±0.044) |
| train (sample) | format | product: fitted | 0.945±0.032 | 1.000±0.000 | 0.973±0.016 | 0.062±0.016 (— / 0.062±0.016) |
| train (sample) | value | product: fitted | 0.962±0.060 | 1.000±0.000 | 0.981±0.030 | 0.158±0.033 (— / 0.158±0.033) |
| train (sample) | position | product: fitted | 0.986±0.013 | 1.000±0.000 | 0.993±0.006 | 0.070±0.015 (— / 0.070±0.015) |
| train (sample) | new_text | product: fitted | 0.977±0.013 | 1.000±0.000 | 0.989±0.006 | 0.042±0.031 (— / 0.042±0.031) |
| train (sample) | widget | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
