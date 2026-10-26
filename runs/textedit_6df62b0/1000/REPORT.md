# REPORT — world `textedit`, legend sha256:4c42eb08b9dd… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
1800 annotated sentences from 3 files; provenance: {'generator': 1800}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/1000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 219 sentences
- heldout_formulations: 181 sentences
- heldout_sentences: 109 sentences
- new_identities: 400 sentences
- train: 891 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['2027', '250', '35', '45', '90', 'appendix', 'audit_trail', 'background', 'berlin', 'compliance', 'customer_success', 'decisions', 'dividend', 'elena', 'forecast', 'go_live', 'headcount', 'logistics', 'merger', 'onboarding', 'pipeline', 'procurement', 'q1', 'q2', 'retention', 'retro', 'tokyo', 'victor', 'warranty']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
11758 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2, 3, 4], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit 6df62b0. Memory curve: runs/1000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:unit: threshold 0.868 [rule: fit; pooled midpoint 0.989 (comparison)] (present 1.184, n 421 / absent 0.793, n 198)
- presence:ordinal: threshold 0.591 [rule: fit; pooled midpoint 0.649 (comparison)] (present 0.916, n 299 / absent 0.381, n 320)
- presence:match: threshold 0.397 [rule: fit; pooled midpoint 0.593 (comparison)] (present 0.893, n 186 / absent 0.292, n 433)
- presence:format: threshold 0.296 [rule: fit; pooled midpoint 0.342 (comparison)] (present 0.553, n 99 / absent 0.130, n 520)
- presence:value: threshold 0.172 [rule: fit; pooled midpoint 0.197 (comparison)] (present 0.290, n 63 / absent 0.103, n 556)
- presence:position: threshold 0.324 [rule: fit; pooled midpoint 0.414 (comparison)] (present 0.656, n 171 / absent 0.172, n 448)
- presence:new_text: threshold 0.273 [rule: fit; pooled midpoint 0.361 (comparison)] (present 0.534, n 147 / absent 0.187, n 472)
- presence:widget: threshold 0.233 [rule: fit; pooled midpoint 0.244 (comparison)] (present 0.445, n 10 / absent 0.043, n 609)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): unit 0.062, ordinal 0.040, match 0.007, format 0.077, value 0.050, position 0.250, new_text 0.007, widget 0.007, predicate 0.023

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 181 of 181)
| axis | accuracy |
|---|---|
| FULL | 0.704±0.039 |
| FULL [depth given] | 0.704±0.039 |
| FULL [depth and negation given] | 0.704±0.039 |
| FULL [presence not decided] | 0.761±0.005 |
| FULL [pooled midpoint (comparison)] | 0.568±0.028 |
| presence unit: present read present | 0.857±0.040 |
| presence unit: share of 'present' readings that abstain | 0.052±0.030 |
| presence unit: share of true 'present' readings that abstain | 0.052±0.030 |
| presence ordinal: present read present | 0.967±0.037 |
| presence ordinal: share of 'present' readings that abstain | 0.074±0.055 |
| presence ordinal: share of true 'present' readings that abstain | 0.074±0.055 |
| presence match: absent read absent | 0.963±0.025 |
| presence format: absent read absent | 1.000±0.000 |
| presence value: absent read absent | 1.000±0.000 |
| presence position: absent read absent | 1.000±0.000 |
| presence new_text: absent read absent | 0.917±0.031 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.922±0.022 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.922±0.022 |
| event type (synonym table) | 0.922±0.022 |
| role unit | 0.860±0.026 |
| head unit | 0.860±0.026 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.994±0.000 |
| occupancy: known filler | 0.828±0.031 |
| role ordinal | 0.976±0.019 |
| head ordinal | 0.976±0.019 |
| lexical order head ordinal | 0.525±0.000 |
| lexical bag head ordinal | 0.541±0.000 |
| role match | 0.891±0.040 |
| head match | 0.891±0.040 |
| lexical order head match | 0.657±0.000 |
| lexical bag head match | 0.630±0.000 |
| occupancy: not given | 0.986±0.005 |
| role format | 0.979±0.004 |
| head format | 0.979±0.004 |
| lexical order head format | 0.873±0.000 |
| lexical bag head format | 0.884±0.000 |
| role value | 0.987±0.007 |
| head value | 0.987±0.007 |
| lexical order head value | 0.939±0.000 |
| lexical bag head value | 0.939±0.000 |
| role position | 0.939±0.009 |
| head position | 0.939±0.009 |
| lexical order head position | 0.591±0.000 |
| lexical bag head position | 0.646±0.000 |
| role new_text | 0.892±0.030 |
| head new_text | 0.892±0.030 |
| lexical order head new_text | 0.762±0.000 |
| lexical bag head new_text | 0.818±0.000 |
| role widget | 0.999±0.002 |
| head widget | 0.999±0.002 |
| lexical order head widget | 0.972±0.000 |
| lexical bag head widget | 0.972±0.000 |
| heads FULL (model) | 0.704±0.039 |
| heads FULL (lexical order baseline) | 0.088±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.110±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role ordinal [presence not decided] | 1.000±0.000 |
| role match [presence not decided] | 0.766±0.006 |
| role format [presence not decided] | 1.000±0.000 |
| role value [presence not decided] | 1.000±0.000 |
| role position [presence not decided] | 1.000±0.000 |
| role new_text [presence not decided] | 0.764±0.004 |
| role widget [presence not decided] | 0.993±0.002 |
| heads FULL (model) [presence not decided] | 0.761±0.005 |
| role unit [pooled midpoint (comparison)] | 0.747±0.025 |
| role ordinal [pooled midpoint (comparison)] | 0.954±0.021 |
| role match [pooled midpoint (comparison)] | 0.873±0.021 |
| role format [pooled midpoint (comparison)] | 0.980±0.004 |
| role value [pooled midpoint (comparison)] | 0.978±0.008 |
| role position [pooled midpoint (comparison)] | 0.914±0.012 |
| role new_text [pooled midpoint (comparison)] | 0.873±0.031 |
| role widget [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.568±0.028 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.715±0.047 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.946±0.028 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.980±0.001 |
| presence format: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence position: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 0.917±0.028 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence ordinal: absent read absent | 1.000±0.000 |
| presence match: present read present | 0.805±0.066 |
| presence match: share of 'present' readings that abstain | 0.162±0.062 |
| presence match: share of true 'present' readings that abstain | 0.148±0.067 |
| presence position: present read present | 0.922±0.028 |
| presence position: share of 'present' readings that abstain | 0.066±0.022 |
| presence position: share of true 'present' readings that abstain | 0.066±0.022 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence match: present read present [pooled midpoint (comparison)] | 0.779±0.068 |
| presence position: present read present [pooled midpoint (comparison)] | 0.933±0.009 |
| presence new_text: present read present | 0.815±0.093 |
| presence new_text: share of 'present' readings that abstain | 0.343±0.060 |
| presence new_text: share of true 'present' readings that abstain | 0.399±0.053 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.768±0.090 |
| presence value: present read present | 0.890±0.080 |
| presence value: share of 'present' readings that abstain | 0.869±0.130 |
| presence value: share of true 'present' readings that abstain | 0.869±0.130 |
| presence value: present read present [pooled midpoint (comparison)] | 0.738±0.099 |
| presence format: present read present | 0.866±0.046 |
| presence format: present read present [pooled midpoint (comparison)] | 0.875±0.049 |
| presence widget: present read present | 0.960±0.080 |
| presence widget: share of 'present' readings that abstain | 0.310±0.284 |
| presence widget: share of true 'present' readings that abstain | 0.310±0.284 |
| presence widget: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: share of FALSE 'present' readings that abstain | 0.182±0.143 |
| presence format: share of 'present' readings that abstain | 0.092±0.075 |
| presence format: share of true 'present' readings that abstain | 0.092±0.075 |
| presence match: share of FALSE 'present' readings that abstain | 0.233±0.200 |
| occupancy: unknown filler | 0.800±0.400 |

residual mean 0.708±0.016; status {'ok': 52, 'abstain': 114, 'no-sense': 15}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.917 | 0.307 / 0.227 | 1.00 | 0.083 | 0.000 / 0.000 |
| role unit | 0.722 | 0.140 / 0.000 | 0.64 | 0.000 | 0.078 / 0.278 |
| roles (pooled) | 0.809 | 0.124 / 0.000 | 0.70 | 0.002 | 0.107 / 0.189 |
| role ordinal | 0.965 | 0.183 / 0.072 | 0.94 | 0.000 | 0.023 / 0.035 |
| role match | 0.726 | 0.100 / 0.000 | 0.65 | 0.000 | 0.081 / 0.274 |
| role position | 0.838 | 0.125 / 0.000 | 0.81 | 0.014 | 0.041 / 0.149 |
| role new_text | 0.767 | 0.046 / 0.000 | 0.40 | 0.000 | 0.372 / 0.233 |
| role value | 0.818 | 0.005 / -0.006 | 0.00 | 0.000 | 0.818 / 0.182 |
| role format | 0.826 | 0.093 / 0.000 | 0.78 | 0.000 | 0.043 / 0.174 |
| role widget | 1.000 | 0.074 / 0.059 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_formulations — experiment candidates (n = 181 of 181)
| axis | accuracy |
|---|---|
| FULL | 0.361±0.033 |
| FULL [depth given] | 0.361±0.033 |
| FULL [depth and negation given] | 0.361±0.033 |
| FULL [presence not decided] | 0.000±0.000 |
| FULL [pooled midpoint (comparison)] | 0.325±0.021 |
| presence unit: present read present | 0.859±0.041 |
| presence unit: share of 'present' readings that abstain | 0.263±0.043 |
| presence unit: share of true 'present' readings that abstain | 0.057±0.035 |
| presence ordinal: present read present | 0.969±0.039 |
| presence ordinal: share of 'present' readings that abstain | 0.276±0.034 |
| presence ordinal: share of true 'present' readings that abstain | 0.088±0.044 |
| presence match: absent read absent | 0.839±0.029 |
| presence format: absent read absent | 0.887±0.051 |
| presence value: absent read absent | 0.812±0.075 |
| presence position: absent read absent | 0.880±0.057 |
| presence new_text: absent read absent | 0.785±0.055 |
| presence widget: absent read absent | 0.999±0.003 |
| structure (depth, negation) | 0.904±0.025 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.904±0.025 |
| event type (synonym table) | 0.904±0.025 |
| role unit | 0.718±0.027 |
| head unit | 0.718±0.027 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.994±0.000 |
| occupancy: known filler | 0.844±0.032 |
| role ordinal | 0.851±0.014 |
| head ordinal | 0.851±0.014 |
| lexical order head ordinal | 0.525±0.000 |
| lexical bag head ordinal | 0.541±0.000 |
| role match | 0.772±0.025 |
| head match | 0.772±0.025 |
| lexical order head match | 0.657±0.000 |
| lexical bag head match | 0.630±0.000 |
| occupancy: not given | 0.857±0.025 |
| role format | 0.883±0.040 |
| head format | 0.883±0.040 |
| lexical order head format | 0.873±0.000 |
| lexical bag head format | 0.884±0.000 |
| role value | 0.788±0.069 |
| head value | 0.788±0.069 |
| lexical order head value | 0.939±0.000 |
| lexical bag head value | 0.939±0.000 |
| role position | 0.862±0.030 |
| head position | 0.862±0.030 |
| lexical order head position | 0.591±0.000 |
| lexical bag head position | 0.646±0.000 |
| role new_text | 0.750±0.047 |
| head new_text | 0.750±0.047 |
| lexical order head new_text | 0.762±0.000 |
| lexical bag head new_text | 0.818±0.000 |
| role widget | 0.988±0.004 |
| head widget | 0.988±0.004 |
| lexical order head widget | 0.972±0.000 |
| lexical bag head widget | 0.972±0.000 |
| heads FULL (model) | 0.361±0.033 |
| heads FULL (lexical order baseline) | 0.088±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.110±0.000 |
| role unit [presence not decided] | 0.627±0.003 |
| role ordinal [presence not decided] | 0.472±0.010 |
| role match [presence not decided] | 0.250±0.007 |
| role format [presence not decided] | 0.126±0.005 |
| role value [presence not decided] | 0.012±0.008 |
| role position [presence not decided] | 0.418±0.003 |
| role new_text [presence not decided] | 0.090±0.004 |
| role widget [presence not decided] | 0.025±0.006 |
| heads FULL (model) [presence not decided] | 0.000±0.000 |
| role unit [pooled midpoint (comparison)] | 0.650±0.026 |
| role ordinal [pooled midpoint (comparison)] | 0.833±0.017 |
| role match [pooled midpoint (comparison)] | 0.767±0.010 |
| role format [pooled midpoint (comparison)] | 0.898±0.016 |
| role value [pooled midpoint (comparison)] | 0.835±0.046 |
| role position [pooled midpoint (comparison)] | 0.863±0.025 |
| role new_text [pooled midpoint (comparison)] | 0.767±0.041 |
| role widget [pooled midpoint (comparison)] | 0.988±0.004 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.325±0.021 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.719±0.050 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.948±0.025 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.877±0.003 |
| presence format: absent read absent [pooled midpoint (comparison)] | 0.898±0.027 |
| presence value: absent read absent [pooled midpoint (comparison)] | 0.857±0.053 |
| presence position: absent read absent [pooled midpoint (comparison)] | 0.907±0.040 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 0.822±0.056 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 0.999±0.003 |
| presence unit: absent read absent | 0.585±0.070 |
| presence unit: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence ordinal: absent read absent | 0.733±0.017 |
| presence ordinal: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence match: present read present | 0.989±0.014 |
| presence match: share of 'present' readings that abstain | 0.572±0.012 |
| presence match: share of true 'present' readings that abstain | 0.484±0.014 |
| presence value: share of 'present' readings that abstain | 1.000±0.000 |
| presence value: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence position: present read present | 0.914±0.027 |
| presence position: share of 'present' readings that abstain | 0.195±0.058 |
| presence position: share of true 'present' readings that abstain | 0.046±0.016 |
| presence new_text: share of 'present' readings that abstain | 0.822±0.045 |
| presence new_text: share of FALSE 'present' readings that abstain | 0.964±0.049 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.696±0.017 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 0.706±0.025 |
| presence match: present read present [pooled midpoint (comparison)] | 0.958±0.028 |
| presence position: present read present [pooled midpoint (comparison)] | 0.948±0.018 |
| presence new_text: present read present | 0.870±0.074 |
| presence new_text: share of true 'present' readings that abstain | 0.708±0.077 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.814±0.090 |
| presence value: present read present | 0.883±0.079 |
| presence value: share of true 'present' readings that abstain | 1.000±0.000 |
| presence value: present read present [pooled midpoint (comparison)] | 0.714±0.098 |
| presence format: present read present | 0.881±0.036 |
| presence format: present read present [pooled midpoint (comparison)] | 0.881±0.036 |
| presence position: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence format: share of 'present' readings that abstain | 0.677±0.055 |
| presence format: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence widget: present read present | 1.000±0.000 |
| presence widget: share of 'present' readings that abstain | 0.877±0.104 |
| presence widget: share of true 'present' readings that abstain | 0.870±0.108 |
| presence widget: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence match: share of FALSE 'present' readings that abstain | 0.868±0.049 |
| presence format: share of true 'present' readings that abstain | 0.418±0.137 |
| presence widget: share of FALSE 'present' readings that abstain | nan±nan |
| occupancy: unknown filler | 1.000±0.000 |

residual mean 0.652±0.026; status {'ok': 26, 'abstain': 136, 'no-sense': 19}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.895 | 0.307 / 0.227 | 1.00 | 0.105 | 0.000 / 0.000 |
| role unit | 0.713 | 0.108 / 0.000 | 0.63 | 0.009 | 0.087 / 0.278 |
| roles (pooled) | 0.733 | 0.092 / 0.000 | 0.63 | 0.002 | 0.103 / 0.265 |
| role ordinal | 0.953 | 0.148 / 0.071 | 0.93 | 0.000 | 0.023 / 0.047 |
| role match | 0.613 | 0.061 / 0.001 | 0.45 | 0.000 | 0.161 / 0.387 |
| role position | 0.811 | 0.096 / 0.000 | 0.78 | 0.000 | 0.027 / 0.189 |
| role new_text | 0.535 | 0.028 / 0.000 | 0.28 | 0.000 | 0.256 / 0.465 |
| role value | 0.000 | 0.007 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role format | 0.783 | 0.050 / 0.000 | 0.57 | 0.000 | 0.217 / 0.217 |
| role widget | 0.800 | 0.024 / 0.007 | 0.20 | 0.000 | 0.600 / 0.200 |

### heldout_sentences — catalog candidates (n = 109 of 109)
| axis | accuracy |
|---|---|
| FULL | 0.793±0.031 |
| FULL [depth given] | 0.793±0.031 |
| FULL [depth and negation given] | 0.793±0.031 |
| FULL [pooled midpoint (comparison)] | 0.648±0.055 |
| presence unit: present read present | 0.905±0.045 |
| presence unit: share of 'present' readings that abstain | 0.078±0.037 |
| presence unit: share of true 'present' readings that abstain | 0.078±0.037 |
| presence ordinal: present read present | 0.972±0.020 |
| presence ordinal: share of 'present' readings that abstain | 0.029±0.021 |
| presence ordinal: share of true 'present' readings that abstain | 0.029±0.021 |
| presence match: absent read absent | 0.992±0.007 |
| presence format: absent read absent | 1.000±0.000 |
| presence value: absent read absent | 1.000±0.000 |
| presence position: absent read absent | 1.000±0.000 |
| presence new_text: absent read absent | 0.995±0.006 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.914±0.014 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.914±0.014 |
| event type (synonym table) | 0.914±0.014 |
| role unit | 0.872±0.030 |
| head unit | 0.872±0.030 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.963±0.000 |
| occupancy: known filler | 0.865±0.018 |
| role ordinal | 0.974±0.011 |
| head ordinal | 0.974±0.011 |
| lexical order head ordinal | 0.523±0.000 |
| lexical bag head ordinal | 0.661±0.000 |
| role match | 0.969±0.016 |
| head match | 0.969±0.016 |
| lexical order head match | 0.725±0.000 |
| lexical bag head match | 0.761±0.000 |
| occupancy: not given | 0.998±0.001 |
| role format | 0.956±0.011 |
| head format | 0.956±0.011 |
| lexical order head format | 0.789±0.000 |
| lexical bag head format | 0.826±0.000 |
| role value | 0.963±0.013 |
| head value | 0.963±0.013 |
| lexical order head value | 0.881±0.000 |
| lexical bag head value | 0.936±0.000 |
| role position | 0.983±0.007 |
| head position | 0.983±0.007 |
| lexical order head position | 0.789±0.000 |
| lexical bag head position | 0.908±0.000 |
| role new_text | 0.983±0.007 |
| head new_text | 0.983±0.007 |
| lexical order head new_text | 0.780±0.000 |
| lexical bag head new_text | 0.890±0.000 |
| role widget | 0.993±0.007 |
| head widget | 0.993±0.007 |
| lexical order head widget | 0.972±0.000 |
| lexical bag head widget | 0.972±0.000 |
| heads FULL (model) | 0.793±0.031 |
| heads FULL (lexical order baseline) | 0.083±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.294±0.000 |
| role unit [pooled midpoint (comparison)] | 0.763±0.030 |
| role ordinal [pooled midpoint (comparison)] | 0.956±0.011 |
| role match [pooled midpoint (comparison)] | 0.930±0.015 |
| role format [pooled midpoint (comparison)] | 0.956±0.007 |
| role value [pooled midpoint (comparison)] | 0.961±0.013 |
| role position [pooled midpoint (comparison)] | 0.967±0.018 |
| role new_text [pooled midpoint (comparison)] | 0.965±0.013 |
| role widget [pooled midpoint (comparison)] | 0.993±0.007 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.648±0.055 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.761±0.052 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.975±0.015 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.994±0.007 |
| presence format: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence position: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 0.997±0.005 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence format: present read present | 0.901±0.055 |
| presence format: share of 'present' readings that abstain | 0.239±0.103 |
| presence format: share of true 'present' readings that abstain | 0.239±0.103 |
| presence format: present read present [pooled midpoint (comparison)] | 0.910±0.037 |
| presence position: present read present | 0.964±0.034 |
| presence position: share of 'present' readings that abstain | 0.038±0.019 |
| presence position: share of true 'present' readings that abstain | 0.038±0.019 |
| presence position: present read present [pooled midpoint (comparison)] | 0.950±0.058 |
| presence unit: absent read absent | 1.000±0.000 |
| presence ordinal: absent read absent | 1.000±0.000 |
| presence match: present read present | 0.958±0.015 |
| presence match: share of 'present' readings that abstain | 0.065±0.042 |
| presence match: share of true 'present' readings that abstain | 0.066±0.043 |
| presence new_text: present read present | 0.966±0.017 |
| presence new_text: share of 'present' readings that abstain | 0.233±0.074 |
| presence new_text: share of true 'present' readings that abstain | 0.221±0.062 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence match: present read present [pooled midpoint (comparison)] | 0.857±0.031 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.911±0.050 |
| presence value: present read present | 0.845±0.102 |
| presence value: share of 'present' readings that abstain | 0.389±0.141 |
| presence value: share of true 'present' readings that abstain | 0.389±0.141 |
| presence value: present read present [pooled midpoint (comparison)] | 0.827±0.113 |
| presence widget: present read present | 0.833±0.211 |
| presence widget: share of 'present' readings that abstain | 0.700±0.267 |
| presence widget: share of true 'present' readings that abstain | 0.700±0.267 |
| occupancy: unknown filler | 1.000±0.000 |
| presence widget: present read present [pooled midpoint (comparison)] | 0.833±0.211 |
| presence new_text: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.670±0.019; status {'abstain': 73, 'ok': 27, 'no-sense': 9}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.917 | 0.293 / 0.211 | 1.00 | 0.083 | 0.000 / 0.000 |
| role unit | 0.726 | 0.146 / 0.000 | 0.67 | 0.014 | 0.068 / 0.260 |
| roles (pooled) | 0.834 | 0.130 / 0.000 | 0.76 | 0.008 | 0.087 / 0.158 |
| role ordinal | 0.962 | 0.179 / 0.089 | 0.94 | 0.000 | 0.019 / 0.038 |
| role format | 0.783 | 0.069 / 0.000 | 0.70 | 0.000 | 0.087 / 0.217 |
| role position | 0.870 | 0.121 / 0.005 | 0.83 | 0.000 | 0.043 / 0.130 |
| role match | 0.867 | 0.140 / 0.017 | 0.87 | 0.033 | 0.033 / 0.100 |
| role new_text | 1.000 | 0.084 / 0.038 | 0.75 | 0.000 | 0.250 / 0.000 |
| role value | 0.692 | 0.048 / 0.000 | 0.38 | 0.000 | 0.308 / 0.308 |
| role widget | 0.333 | 0.031 / 0.008 | 0.00 | 0.000 | 0.333 / 0.667 |

### heldout_sentences — experiment candidates (n = 109 of 109)
| axis | accuracy |
|---|---|
| FULL | 0.406±0.045 |
| FULL [depth given] | 0.406±0.045 |
| FULL [depth and negation given] | 0.406±0.045 |
| FULL [pooled midpoint (comparison)] | 0.350±0.061 |
| presence unit: present read present | 0.905±0.045 |
| presence unit: share of 'present' readings that abstain | 0.201±0.027 |
| presence unit: share of true 'present' readings that abstain | 0.081±0.032 |
| presence ordinal: present read present | 0.972±0.020 |
| presence ordinal: share of 'present' readings that abstain | 0.237±0.023 |
| presence ordinal: share of true 'present' readings that abstain | 0.041±0.029 |
| presence match: absent read absent | 0.717±0.016 |
| presence format: absent read absent | 0.907±0.028 |
| presence value: absent read absent | 0.772±0.054 |
| presence value: share of 'present' readings that abstain | 0.933±0.027 |
| presence value: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence position: absent read absent | 0.836±0.048 |
| presence new_text: absent read absent | 0.770±0.043 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.901±0.016 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.901±0.016 |
| event type (synonym table) | 0.901±0.016 |
| role unit | 0.791±0.031 |
| head unit | 0.791±0.031 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.963±0.000 |
| occupancy: known filler | 0.854±0.017 |
| role ordinal | 0.859±0.014 |
| head ordinal | 0.859±0.014 |
| lexical order head ordinal | 0.523±0.000 |
| lexical bag head ordinal | 0.661±0.000 |
| role match | 0.771±0.028 |
| head match | 0.771±0.028 |
| lexical order head match | 0.725±0.000 |
| lexical bag head match | 0.761±0.000 |
| occupancy: not given | 0.843±0.015 |
| role format | 0.846±0.030 |
| head format | 0.846±0.030 |
| lexical order head format | 0.789±0.000 |
| lexical bag head format | 0.826±0.000 |
| role value | 0.754±0.052 |
| head value | 0.754±0.052 |
| lexical order head value | 0.881±0.000 |
| lexical bag head value | 0.936±0.000 |
| role position | 0.864±0.037 |
| head position | 0.864±0.037 |
| lexical order head position | 0.789±0.000 |
| lexical bag head position | 0.908±0.000 |
| role new_text | 0.822±0.030 |
| head new_text | 0.822±0.030 |
| lexical order head new_text | 0.780±0.000 |
| lexical bag head new_text | 0.890±0.000 |
| role widget | 0.978±0.004 |
| head widget | 0.978±0.004 |
| lexical order head widget | 0.972±0.000 |
| lexical bag head widget | 0.972±0.000 |
| heads FULL (model) | 0.406±0.045 |
| heads FULL (lexical order baseline) | 0.083±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.294±0.000 |
| role unit [pooled midpoint (comparison)] | 0.694±0.028 |
| role ordinal [pooled midpoint (comparison)] | 0.851±0.023 |
| role match [pooled midpoint (comparison)] | 0.783±0.024 |
| role format [pooled midpoint (comparison)] | 0.862±0.022 |
| role value [pooled midpoint (comparison)] | 0.800±0.040 |
| role position [pooled midpoint (comparison)] | 0.890±0.035 |
| role new_text [pooled midpoint (comparison)] | 0.848±0.019 |
| role widget [pooled midpoint (comparison)] | 0.976±0.004 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.350±0.061 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.761±0.052 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.975±0.015 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.793±0.020 |
| presence format: absent read absent [pooled midpoint (comparison)] | 0.927±0.020 |
| presence value: absent read absent [pooled midpoint (comparison)] | 0.818±0.044 |
| presence position: absent read absent [pooled midpoint (comparison)] | 0.897±0.038 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 0.829±0.026 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence format: present read present | 0.897±0.075 |
| presence format: share of 'present' readings that abstain | 0.774±0.057 |
| presence format: share of true 'present' readings that abstain | 0.678±0.068 |
| presence format: present read present [pooled midpoint (comparison)] | 0.912±0.042 |
| presence position: present read present | 0.946±0.033 |
| presence position: share of 'present' readings that abstain | 0.427±0.094 |
| presence position: share of true 'present' readings that abstain | 0.097±0.054 |
| presence position: present read present [pooled midpoint (comparison)] | 0.919±0.053 |
| presence unit: absent read absent | 0.733±0.037 |
| presence unit: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence ordinal: absent read absent | 0.734±0.030 |
| presence ordinal: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence match: present read present | 0.956±0.027 |
| presence match: share of 'present' readings that abstain | 0.505±0.024 |
| presence match: share of true 'present' readings that abstain | 0.130±0.049 |
| presence position: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence new_text: present read present | 0.983±0.021 |
| presence new_text: share of 'present' readings that abstain | 0.700±0.087 |
| presence new_text: share of true 'present' readings that abstain | 0.487±0.116 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.745±0.012 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 0.738±0.036 |
| presence match: present read present [pooled midpoint (comparison)] | 0.857±0.062 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.918±0.053 |
| presence match: share of FALSE 'present' readings that abstain | 0.981±0.023 |
| presence new_text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence value: present read present | 0.845±0.102 |
| presence value: share of true 'present' readings that abstain | 0.763±0.119 |
| presence value: present read present [pooled midpoint (comparison)] | 0.822±0.118 |
| presence widget: present read present | 1.000±0.000 |
| presence widget: share of 'present' readings that abstain | 1.000±0.000 |
| presence widget: share of true 'present' readings that abstain | 1.000±0.000 |
| occupancy: unknown filler | 1.000±0.000 |
| presence widget: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence format: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.636±0.020; status {'abstain': 84, 'ok': 15, 'no-sense': 10}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.908 | 0.293 / 0.211 | 1.00 | 0.092 | 0.000 / 0.000 |
| role unit | 0.726 | 0.113 / 0.000 | 0.67 | 0.014 | 0.068 / 0.260 |
| roles (pooled) | 0.801 | 0.095 / 0.000 | 0.65 | 0.008 | 0.158 / 0.191 |
| role ordinal | 0.962 | 0.145 / 0.070 | 0.94 | 0.000 | 0.019 / 0.038 |
| role format | 0.696 | 0.032 / 0.000 | 0.30 | 0.000 | 0.391 / 0.304 |
| role position | 0.870 | 0.086 / 0.001 | 0.74 | 0.000 | 0.130 / 0.130 |
| role match | 0.800 | 0.094 / 0.001 | 0.73 | 0.033 | 0.100 / 0.167 |
| role new_text | 0.958 | 0.049 / 0.007 | 0.42 | 0.000 | 0.542 / 0.042 |
| role value | 0.538 | 0.025 / 0.000 | 0.23 | 0.000 | 0.308 / 0.462 |
| role widget | 0.000 | 0.008 / 0.004 | 0.00 | 0.000 | 0.000 / 1.000 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.729±0.010 |
| FULL [depth given] | 0.729±0.010 |
| FULL [depth and negation given] | 0.729±0.010 |
| FULL [pooled midpoint (comparison)] | 0.625±0.020 |
| presence unit: present read present | 0.855±0.011 |
| presence unit: share of 'present' readings that abstain | 0.017±0.012 |
| presence unit: share of true 'present' readings that abstain | 0.017±0.012 |
| presence ordinal: absent read absent | 1.000±0.000 |
| presence match: present read present | 0.946±0.005 |
| presence match: share of 'present' readings that abstain | 0.095±0.017 |
| presence match: share of true 'present' readings that abstain | 0.096±0.016 |
| presence format: absent read absent | 1.000±0.000 |
| presence value: present read present | 0.955±0.044 |
| presence position: absent read absent | 1.000±0.000 |
| presence new_text: absent read absent | 0.979±0.009 |
| presence widget: absent read absent | 0.998±0.002 |
| structure (depth, negation) | 0.900±0.004 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.900±0.004 |
| event type (synonym table) | 0.900±0.004 |
| role unit | 0.928±0.004 |
| head unit | 0.928±0.004 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.998±0.000 |
| occupancy: known filler | 0.829±0.011 |
| role ordinal | 0.986±0.007 |
| head ordinal | 0.986±0.007 |
| lexical order head ordinal | 0.815±0.000 |
| lexical bag head ordinal | 0.920±0.000 |
| occupancy: not given | 0.993±0.001 |
| role match | 0.830±0.010 |
| head match | 0.830±0.010 |
| lexical order head match | 0.230±0.000 |
| lexical bag head match | 0.410±0.000 |
| occupancy: unknown filler | 0.840±0.009 |
| role format | 0.974±0.003 |
| head format | 0.974±0.003 |
| lexical order head format | 0.938±0.000 |
| lexical bag head format | 0.955±0.000 |
| role value | 0.983±0.004 |
| head value | 0.983±0.004 |
| lexical order head value | 0.918±0.000 |
| lexical bag head value | 0.953±0.000 |
| role position | 0.949±0.007 |
| head position | 0.949±0.007 |
| lexical order head position | 0.662±0.000 |
| lexical bag head position | 0.845±0.000 |
| role new_text | 0.917±0.014 |
| head new_text | 0.917±0.014 |
| lexical order head new_text | 0.532±0.000 |
| lexical bag head new_text | 0.785±0.000 |
| role widget | 0.991±0.006 |
| head widget | 0.991±0.006 |
| lexical order head widget | 0.940±0.000 |
| lexical bag head widget | 0.940±0.000 |
| heads FULL (model) | 0.729±0.010 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.268±0.000 |
| role unit [pooled midpoint (comparison)] | 0.900±0.011 |
| role ordinal [pooled midpoint (comparison)] | 0.972±0.005 |
| role match [pooled midpoint (comparison)] | 0.734±0.011 |
| role format [pooled midpoint (comparison)] | 0.969±0.001 |
| role value [pooled midpoint (comparison)] | 0.977±0.005 |
| role position [pooled midpoint (comparison)] | 0.927±0.010 |
| role new_text [pooled midpoint (comparison)] | 0.904±0.014 |
| role widget [pooled midpoint (comparison)] | 0.991±0.007 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.625±0.020 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.823±0.034 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence match: present read present [pooled midpoint (comparison)] | 0.859±0.010 |
| presence format: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: present read present [pooled midpoint (comparison)] | 0.974±0.035 |
| presence position: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 0.979±0.010 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence unit: absent read absent | 1.000±0.000 |
| presence value: absent read absent | 1.000±0.000 |
| presence new_text: present read present | 0.891±0.022 |
| presence new_text: share of 'present' readings that abstain | 0.261±0.035 |
| presence new_text: share of true 'present' readings that abstain | 0.263±0.034 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.887±0.013 |
| presence ordinal: present read present | 0.937±0.027 |
| presence ordinal: share of 'present' readings that abstain | 0.056±0.015 |
| presence ordinal: share of true 'present' readings that abstain | 0.056±0.015 |
| presence match: absent read absent | 0.881±0.018 |
| presence format: present read present | 0.670±0.057 |
| presence widget: present read present | 0.891±0.068 |
| presence widget: share of 'present' readings that abstain | 0.615±0.145 |
| presence widget: share of true 'present' readings that abstain | 0.604±0.146 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.887±0.016 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.911±0.007 |
| presence format: present read present [pooled midpoint (comparison)] | 0.675±0.033 |
| presence widget: present read present [pooled midpoint (comparison)] | 0.907±0.089 |
| presence position: present read present | 0.949±0.020 |
| presence position: share of 'present' readings that abstain | 0.040±0.010 |
| presence position: share of true 'present' readings that abstain | 0.040±0.010 |
| presence position: present read present [pooled midpoint (comparison)] | 0.957±0.014 |
| presence match: share of FALSE 'present' readings that abstain | 0.094±0.090 |
| presence new_text: share of FALSE 'present' readings that abstain | 0.187±0.165 |
| presence format: share of 'present' readings that abstain | 0.395±0.117 |
| presence format: share of true 'present' readings that abstain | 0.395±0.117 |
| presence value: share of 'present' readings that abstain | 0.197±0.045 |
| presence value: share of true 'present' readings that abstain | 0.197±0.045 |

residual mean 0.819±0.003; status {'abstain': 229, 'ok': 128, 'no-sense': 43}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.892 | 0.304 / 0.215 | 1.00 | 0.107 | 0.000 / 0.000 |
| role unit | 0.793 | 0.157 / 0.000 | 0.77 | 0.007 | 0.028 / 0.200 |
| roles (pooled) | 0.816 | 0.115 / 0.000 | 0.73 | 0.014 | 0.098 / 0.170 |
| role match | 0.795 | 0.123 / 0.000 | 0.77 | 0.032 | 0.062 / 0.172 |
| role value | 0.697 | 0.059 / 0.000 | 0.61 | 0.000 | 0.091 / 0.303 |
| role new_text | 0.845 | 0.069 / 0.000 | 0.66 | 0.000 | 0.187 / 0.155 |
| role ordinal | 0.932 | 0.169 / 0.023 | 0.86 | 0.000 | 0.068 / 0.068 |
| role format | 0.640 | 0.039 / 0.000 | 0.44 | 0.000 | 0.200 / 0.360 |
| role widget | 0.833 | 0.032 / 0.001 | 0.17 | 0.000 | 0.667 / 0.167 |
| role position | 0.844 | 0.129 / 0.000 | 0.83 | 0.015 | 0.030 / 0.141 |

### new_identities — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.290±0.031 |
| FULL [depth given] | 0.290±0.031 |
| FULL [depth and negation given] | 0.290±0.031 |
| FULL [pooled midpoint (comparison)] | 0.305±0.040 |
| presence unit: present read present | 0.856±0.012 |
| presence unit: share of 'present' readings that abstain | 0.406±0.028 |
| presence unit: share of true 'present' readings that abstain | 0.022±0.010 |
| presence ordinal: absent read absent | 0.635±0.025 |
| presence ordinal: share of 'present' readings that abstain | 0.622±0.019 |
| presence ordinal: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence match: present read present | 0.959±0.004 |
| presence match: share of 'present' readings that abstain | 0.280±0.017 |
| presence match: share of true 'present' readings that abstain | 0.218±0.010 |
| presence format: absent read absent | 0.904±0.052 |
| presence value: present read present | 0.953±0.047 |
| presence position: absent read absent | 0.777±0.036 |
| presence new_text: absent read absent | 0.701±0.090 |
| presence widget: absent read absent | 0.997±0.003 |
| structure (depth, negation) | 0.876±0.009 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.876±0.009 |
| event type (synonym table) | 0.876±0.009 |
| role unit | 0.735±0.019 |
| head unit | 0.735±0.019 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.998±0.000 |
| occupancy: known filler | 0.809±0.012 |
| role ordinal | 0.733±0.017 |
| head ordinal | 0.733±0.017 |
| lexical order head ordinal | 0.815±0.000 |
| lexical bag head ordinal | 0.920±0.000 |
| occupancy: not given | 0.806±0.025 |
| role match | 0.734±0.014 |
| head match | 0.734±0.014 |
| lexical order head match | 0.230±0.000 |
| lexical bag head match | 0.410±0.000 |
| occupancy: unknown filler | 0.841±0.015 |
| role format | 0.883±0.044 |
| head format | 0.883±0.044 |
| lexical order head format | 0.938±0.000 |
| lexical bag head format | 0.955±0.000 |
| role value | 0.739±0.087 |
| head value | 0.739±0.087 |
| lexical order head value | 0.918±0.000 |
| lexical bag head value | 0.953±0.000 |
| role position | 0.808±0.023 |
| head position | 0.808±0.023 |
| lexical order head position | 0.662±0.000 |
| lexical bag head position | 0.845±0.000 |
| role new_text | 0.762±0.055 |
| head new_text | 0.762±0.055 |
| lexical order head new_text | 0.532±0.000 |
| lexical bag head new_text | 0.785±0.000 |
| role widget | 0.968±0.009 |
| head widget | 0.968±0.009 |
| lexical order head widget | 0.940±0.000 |
| lexical bag head widget | 0.940±0.000 |
| heads FULL (model) | 0.290±0.031 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.268±0.000 |
| role unit [pooled midpoint (comparison)] | 0.746±0.008 |
| role ordinal [pooled midpoint (comparison)] | 0.752±0.011 |
| role match [pooled midpoint (comparison)] | 0.668±0.020 |
| role format [pooled midpoint (comparison)] | 0.900±0.022 |
| role value [pooled midpoint (comparison)] | 0.803±0.060 |
| role position [pooled midpoint (comparison)] | 0.808±0.023 |
| role new_text [pooled midpoint (comparison)] | 0.776±0.043 |
| role widget [pooled midpoint (comparison)] | 0.967±0.006 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.305±0.040 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.829±0.029 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 0.655±0.015 |
| presence match: present read present [pooled midpoint (comparison)] | 0.868±0.009 |
| presence format: absent read absent [pooled midpoint (comparison)] | 0.923±0.023 |
| presence value: present read present [pooled midpoint (comparison)] | 0.973±0.036 |
| presence position: absent read absent [pooled midpoint (comparison)] | 0.817±0.036 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 0.751±0.060 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 0.995±0.003 |
| presence unit: absent read absent | 0.640±0.032 |
| presence value: absent read absent | 0.712±0.108 |
| presence new_text: present read present | 0.934±0.029 |
| presence new_text: share of 'present' readings that abstain | 0.652±0.052 |
| presence new_text: share of true 'present' readings that abstain | 0.553±0.057 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.690±0.009 |
| presence value: absent read absent [pooled midpoint (comparison)] | 0.778±0.081 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.926±0.018 |
| presence new_text: share of FALSE 'present' readings that abstain | 0.983±0.015 |
| presence ordinal: present read present | 0.939±0.027 |
| presence ordinal: share of true 'present' readings that abstain | 0.062±0.019 |
| presence match: absent read absent | 0.635±0.038 |
| presence format: present read present | 0.655±0.071 |
| presence widget: present read present | 0.920±0.066 |
| presence widget: share of 'present' readings that abstain | 0.973±0.055 |
| presence widget: share of true 'present' readings that abstain | 0.973±0.055 |
| presence unit: share of FALSE 'present' readings that abstain | 0.983±0.035 |
| presence position: share of 'present' readings that abstain | 0.404±0.051 |
| presence position: share of FALSE 'present' readings that abstain | 0.992±0.011 |
| presence value: share of 'present' readings that abstain | 0.907±0.032 |
| presence value: share of FALSE 'present' readings that abstain | 0.996±0.007 |
| presence match: share of FALSE 'present' readings that abstain | 0.753±0.092 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.897±0.014 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.784±0.025 |
| presence position: present read present | 0.944±0.023 |
| presence position: share of true 'present' readings that abstain | 0.131±0.054 |
| presence position: present read present [pooled midpoint (comparison)] | 0.948±0.018 |
| presence format: share of 'present' readings that abstain | 0.916±0.051 |
| presence format: share of FALSE 'present' readings that abstain | 0.995±0.011 |
| presence value: share of true 'present' readings that abstain | 0.604±0.047 |
| presence format: share of true 'present' readings that abstain | 0.772±0.099 |
| presence format: present read present [pooled midpoint (comparison)] | 0.662±0.084 |
| presence widget: present read present [pooled midpoint (comparison)] | 0.934±0.084 |

residual mean 0.731±0.009; status {'abstain': 288, 'ok': 57, 'no-sense': 55}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.863 | 0.304 / 0.215 | 1.00 | 0.138 | 0.000 / 0.000 |
| role unit | 0.793 | 0.119 / 0.000 | 0.77 | 0.007 | 0.028 / 0.200 |
| roles (pooled) | 0.747 | 0.082 / 0.000 | 0.61 | 0.017 | 0.151 / 0.236 |
| role match | 0.727 | 0.087 / 0.000 | 0.65 | 0.039 | 0.117 / 0.234 |
| role value | 0.636 | 0.028 / 0.000 | 0.30 | 0.000 | 0.333 / 0.364 |
| role new_text | 0.722 | 0.044 / 0.000 | 0.40 | 0.000 | 0.321 / 0.278 |
| role ordinal | 0.932 | 0.131 / 0.023 | 0.86 | 0.000 | 0.068 / 0.068 |
| role format | 0.440 | 0.011 / 0.000 | 0.08 | 0.000 | 0.360 / 0.560 |
| role widget | 0.375 | 0.011 / 0.001 | 0.00 | 0.000 | 0.375 / 0.625 |
| role position | 0.822 | 0.094 / 0.000 | 0.79 | 0.022 | 0.052 / 0.156 |

### train (sample) — catalog candidates (n = 300 of 891)
| axis | accuracy |
|---|---|
| FULL | 0.754±0.029 |
| FULL [depth given] | 0.754±0.029 |
| FULL [depth and negation given] | 0.754±0.029 |
| presence unit: absent read absent | 1.000±0.000 |
| presence ordinal: absent read absent | 1.000±0.000 |
| presence match: present read present | 0.961±0.014 |
| presence match: share of 'present' readings that abstain | 0.098±0.028 |
| presence match: share of true 'present' readings that abstain | 0.103±0.031 |
| presence format: present read present | 0.885±0.033 |
| presence format: share of 'present' readings that abstain | 0.182±0.033 |
| presence format: share of true 'present' readings that abstain | 0.182±0.033 |
| presence value: absent read absent | 1.000±0.000 |
| presence position: absent read absent | 1.000±0.000 |
| presence new_text: absent read absent | 0.996±0.002 |
| presence widget: absent read absent | 0.999±0.002 |
| structure (depth, negation) | 0.895±0.012 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.895±0.012 |
| event type (synonym table) | 0.895±0.012 |
| role unit | 0.870±0.029 |
| head unit | 0.870±0.029 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.997±0.000 |
| occupancy: not given | 0.997±0.001 |
| role ordinal | 0.958±0.011 |
| head ordinal | 0.958±0.011 |
| lexical order head ordinal | 0.573±0.000 |
| lexical bag head ordinal | 0.993±0.000 |
| role match | 0.937±0.005 |
| head match | 0.937±0.005 |
| lexical order head match | 0.660±0.000 |
| lexical bag head match | 0.943±0.000 |
| occupancy: known filler | 0.852±0.018 |
| role format | 0.965±0.006 |
| head format | 0.965±0.006 |
| lexical order head format | 0.827±0.000 |
| lexical bag head format | 0.997±0.000 |
| role value | 0.981±0.007 |
| head value | 0.981±0.007 |
| lexical order head value | 0.897±0.000 |
| lexical bag head value | 1.000±0.000 |
| role position | 0.982±0.003 |
| head position | 0.982±0.003 |
| lexical order head position | 0.787±0.000 |
| lexical bag head position | 1.000±0.000 |
| role new_text | 0.965±0.008 |
| head new_text | 0.965±0.008 |
| lexical order head new_text | 0.760±0.000 |
| lexical bag head new_text | 0.973±0.000 |
| role widget | 0.999±0.001 |
| head widget | 0.999±0.001 |
| lexical order head widget | 0.990±0.000 |
| lexical bag head widget | 1.000±0.000 |
| heads FULL (model) | 0.761±0.029 |
| heads FULL (lexical order baseline) | 0.127±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.937±0.000 |
| presence unit: present read present | 0.888±0.041 |
| presence unit: share of 'present' readings that abstain | 0.077±0.025 |
| presence unit: share of true 'present' readings that abstain | 0.077±0.025 |
| presence ordinal: present read present | 0.954±0.018 |
| presence ordinal: share of 'present' readings that abstain | 0.052±0.022 |
| presence ordinal: share of true 'present' readings that abstain | 0.052±0.022 |
| presence match: absent read absent | 0.974±0.007 |
| presence format: absent read absent | 1.000±0.000 |
| presence position: present read present | 0.961±0.008 |
| presence position: share of 'present' readings that abstain | 0.048±0.036 |
| presence position: share of true 'present' readings that abstain | 0.048±0.036 |
| presence new_text: present read present | 0.895±0.029 |
| presence new_text: share of 'present' readings that abstain | 0.152±0.039 |
| presence new_text: share of true 'present' readings that abstain | 0.151±0.043 |
| presence value: present read present | 0.906±0.039 |
| presence value: share of 'present' readings that abstain | 0.146±0.049 |
| presence value: share of true 'present' readings that abstain | 0.146±0.049 |
| presence match: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence widget: share of 'present' readings that abstain | 0.050±0.100 |
| presence widget: share of FALSE 'present' readings that abstain | nan±nan |
| presence widget: present read present | 1.000±0.000 |
| presence widget: share of true 'present' readings that abstain | 0.000±0.000 |
| presence new_text: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.689±0.018; status {'abstain': 168, 'ok': 97, 'no-sense': 35}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.883 | 0.311 / 0.213 | 1.00 | 0.117 | 0.000 / 0.000 |
| role match | 0.843 | 0.149 / 0.000 | 0.81 | 0.020 | 0.049 / 0.137 |
| roles (pooled) | 0.822 | 0.134 / 0.000 | 0.76 | 0.008 | 0.073 / 0.170 |
| role format | 0.808 | 0.079 / 0.000 | 0.69 | 0.038 | 0.154 / 0.154 |
| role unit | 0.705 | 0.143 / 0.000 | 0.66 | 0.005 | 0.047 / 0.289 |
| role ordinal | 0.906 | 0.170 / 0.013 | 0.84 | 0.000 | 0.062 / 0.094 |
| role position | 0.922 | 0.143 / 0.025 | 0.83 | 0.000 | 0.094 / 0.078 |
| role new_text | 0.889 | 0.086 / 0.000 | 0.79 | 0.000 | 0.097 / 0.111 |
| role value | 0.774 | 0.066 / 0.000 | 0.65 | 0.000 | 0.129 / 0.226 |
| role widget | 1.000 | 0.087 / 0.079 | 1.00 | 0.000 | 0.000 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 for=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 ORD=0.54 UNIT=0.50 MATCH=0.47 POS=0.30 VERB=0.29 FILLER=0.24 PRON=0.24 WHEAD=0.18 again=0.12 DEM=0.12 all=0.12 text=0.12 unknown=0.12 a=0.11 PUNCT=0.11 cursor=0.11 COLOR=0.10 ALIGN=0.10 the=0.09 back=0.08 FORMAT=0.08 SIZE=0.06

## What is weak, what to add
- heldout_formulations: FULL 0.669
- heldout_formulations: presence unit: present read present 0.783
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.108
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.108
- heldout_formulations: presence ordinal: share of 'present' readings that abstain 0.024
- heldout_formulations: presence ordinal: share of true 'present' readings that abstain 0.024
- heldout_formulations: role unit 0.823
- heldout_formulations: head unit 0.823
- heldout_formulations: occupancy: known filler 0.809
- heldout_formulations: role match 0.895
- heldout_formulations: head match 0.895
- heldout_formulations: role new_text 0.878
- heldout_formulations: head new_text 0.878
- heldout_formulations: heads FULL (model) 0.669
- heldout_formulations: heads FULL (lexical order baseline) 0.088
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.110
- heldout_formulations: FULL [depth given] 0.669
- heldout_formulations: FULL [depth and negation given] 0.669
- heldout_formulations: FULL [presence not decided] 0.762
- heldout_formulations: role match [presence not decided] 0.768
- heldout_formulations: role new_text [presence not decided] 0.762
- heldout_formulations: heads FULL (model) [presence not decided] 0.762
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.541
- heldout_formulations: role unit [pooled midpoint (comparison)] 0.729
- heldout_formulations: role match [pooled midpoint (comparison)] 0.862
- heldout_formulations: role new_text [pooled midpoint (comparison)] 0.851
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.541
- heldout_formulations: presence unit: present read present [pooled midpoint (comparison)] 0.680
- heldout_formulations: presence match: present read present 0.789
- heldout_formulations: presence match: share of 'present' readings that abstain 0.106
- heldout_formulations: presence match: share of true 'present' readings that abstain 0.111
- heldout_formulations: presence position: share of 'present' readings that abstain 0.048
- heldout_formulations: presence position: share of true 'present' readings that abstain 0.048
- heldout_formulations: presence match: present read present [pooled midpoint (comparison)] 0.736
- heldout_formulations: presence new_text: present read present 0.825
- heldout_formulations: presence new_text: share of 'present' readings that abstain 0.378
- heldout_formulations: presence new_text: share of true 'present' readings that abstain 0.485
- heldout_formulations: presence new_text: present read present [pooled midpoint (comparison)] 0.703
- heldout_formulations: presence value: present read present [pooled midpoint (comparison)] 0.667
- heldout_formulations: presence format: present read present 0.864
- heldout_formulations: presence format: present read present [pooled midpoint (comparison)] 0.864
- heldout_formulations: presence widget: share of 'present' readings that abstain 0.000
- heldout_formulations: presence widget: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence new_text: share of FALSE 'present' readings that abstain 0.083
- heldout_formulations: presence format: share of 'present' readings that abstain 0.053
- heldout_formulations: presence format: share of true 'present' readings that abstain 0.053
- heldout_formulations: presence match: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: FULL 0.734
- heldout_sentences: presence unit: present read present 0.815
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.094
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.094
- heldout_sentences: presence ordinal: share of 'present' readings that abstain 0.020
- heldout_sentences: presence ordinal: share of true 'present' readings that abstain 0.020
- heldout_sentences: role unit 0.817
- heldout_sentences: head unit 0.817
- heldout_sentences: occupancy: known filler 0.833
- heldout_sentences: heads FULL (model) 0.734
- heldout_sentences: heads FULL (lexical order baseline) 0.083
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.294
- heldout_sentences: FULL [depth given] 0.734
- heldout_sentences: FULL [depth and negation given] 0.734
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.560
- heldout_sentences: role unit [pooled midpoint (comparison)] 0.734
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.560
- heldout_sentences: presence unit: present read present [pooled midpoint (comparison)] 0.698
- heldout_sentences: presence format: share of 'present' readings that abstain 0.111
- heldout_sentences: presence format: share of true 'present' readings that abstain 0.111
- heldout_sentences: presence position: share of 'present' readings that abstain 0.050
- heldout_sentences: presence position: share of true 'present' readings that abstain 0.050
- heldout_sentences: presence position: present read present [pooled midpoint (comparison)] 0.842
- heldout_sentences: presence match: share of 'present' readings that abstain 0.038
- heldout_sentences: presence match: share of true 'present' readings that abstain 0.038
- heldout_sentences: presence new_text: share of 'present' readings that abstain 0.280
- heldout_sentences: presence new_text: share of true 'present' readings that abstain 0.250
- heldout_sentences: presence match: present read present [pooled midpoint (comparison)] 0.808
- heldout_sentences: presence new_text: present read present [pooled midpoint (comparison)] 0.818
- heldout_sentences: presence value: present read present 0.818
- heldout_sentences: presence value: share of 'present' readings that abstain 0.444
- heldout_sentences: presence value: share of true 'present' readings that abstain 0.444
- heldout_sentences: presence value: present read present [pooled midpoint (comparison)] 0.727
- heldout_sentences: presence widget: present read present 0.500
- heldout_sentences: presence widget: present read present [pooled midpoint (comparison)] 0.500
- new_identities: FULL 0.715
- new_identities: presence unit: present read present 0.846
- new_identities: presence unit: share of 'present' readings that abstain 0.035
- new_identities: presence unit: share of true 'present' readings that abstain 0.035
- new_identities: presence match: share of 'present' readings that abstain 0.088
- new_identities: presence match: share of true 'present' readings that abstain 0.084
- new_identities: presence value: present read present 0.885
- new_identities: structure (depth, negation) 0.892
- new_identities: predicate (surface lemma) 0.892
- new_identities: event type (synonym table) 0.892
- new_identities: occupancy: known filler 0.821
- new_identities: role match 0.818
- new_identities: head match 0.818
- new_identities: occupancy: unknown filler 0.832
- new_identities: heads FULL (model) 0.715
- new_identities: heads FULL (lexical order baseline) 0.000
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.268
- new_identities: FULL [depth given] 0.715
- new_identities: FULL [depth and negation given] 0.715
- new_identities: FULL [pooled midpoint (comparison)] 0.598
- new_identities: role unit [pooled midpoint (comparison)] 0.890
- new_identities: role match [pooled midpoint (comparison)] 0.723
- new_identities: role new_text [pooled midpoint (comparison)] 0.890
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.598
- new_identities: presence unit: present read present [pooled midpoint (comparison)] 0.783
- new_identities: presence match: present read present [pooled midpoint (comparison)] 0.856
- new_identities: presence new_text: share of 'present' readings that abstain 0.238
- new_identities: presence new_text: share of true 'present' readings that abstain 0.245
- new_identities: presence new_text: present read present [pooled midpoint (comparison)] 0.889
- new_identities: presence ordinal: share of 'present' readings that abstain 0.072
- new_identities: presence ordinal: share of true 'present' readings that abstain 0.072
- new_identities: presence match: absent read absent 0.890
- new_identities: presence format: present read present 0.762
- new_identities: presence widget: present read present 0.870
- new_identities: presence widget: share of 'present' readings that abstain 0.800
- new_identities: presence widget: share of true 'present' readings that abstain 0.800
- new_identities: presence ordinal: present read present [pooled midpoint (comparison)] 0.875
- new_identities: presence format: present read present [pooled midpoint (comparison)] 0.722
- new_identities: presence widget: present read present [pooled midpoint (comparison)] 0.870
- new_identities: presence position: share of 'present' readings that abstain 0.035
- new_identities: presence position: share of true 'present' readings that abstain 0.035
- new_identities: presence match: share of FALSE 'present' readings that abstain 0.200
- new_identities: presence new_text: share of FALSE 'present' readings that abstain 0.000
- new_identities: presence format: share of 'present' readings that abstain 0.312
- new_identities: presence format: share of true 'present' readings that abstain 0.312
- new_identities: presence value: share of 'present' readings that abstain 0.130
- new_identities: presence value: share of true 'present' readings that abstain 0.130
- train (sample): FULL 0.707
- train (sample): presence match: share of 'present' readings that abstain 0.056
- train (sample): presence match: share of true 'present' readings that abstain 0.057
- train (sample): presence format: share of 'present' readings that abstain 0.190
- train (sample): presence format: share of true 'present' readings that abstain 0.190
- train (sample): structure (depth, negation) 0.883
- train (sample): predicate (surface lemma) 0.883
- train (sample): event type (synonym table) 0.883
- train (sample): role unit 0.813
- train (sample): head unit 0.813
- train (sample): occupancy: known filler 0.826
- train (sample): heads FULL (model) 0.713
- train (sample): heads FULL (lexical order baseline) 0.127
- train (sample): FULL [depth given] 0.707
- train (sample): FULL [depth and negation given] 0.707
- train (sample): presence unit: present read present 0.807
- train (sample): presence unit: share of 'present' readings that abstain 0.067
- train (sample): presence unit: share of true 'present' readings that abstain 0.067
- train (sample): presence ordinal: share of 'present' readings that abstain 0.069
- train (sample): presence ordinal: share of true 'present' readings that abstain 0.069
- train (sample): presence position: share of 'present' readings that abstain 0.102
- train (sample): presence position: share of true 'present' readings that abstain 0.102
- train (sample): presence new_text: share of 'present' readings that abstain 0.121
- train (sample): presence new_text: share of true 'present' readings that abstain 0.123
- train (sample): presence value: present read present 0.889
- train (sample): presence value: share of 'present' readings that abstain 0.167
- train (sample): presence value: share of true 'present' readings that abstain 0.167
- train (sample): presence match: share of FALSE 'present' readings that abstain 0.000
- train (sample): presence widget: share of 'present' readings that abstain 0.250
- train (sample): presence widget: share of true 'present' readings that abstain 0.000
- train (sample): presence new_text: share of FALSE 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_formulations: `lets read the ORD UNIT` FULL 0.000 (n 4)
- heldout_formulations: `can you select POS to MATCH .` FULL 0.000 (n 4)
- heldout_formulations: `now insert MATCH POS` FULL 0.000 (n 3)
- heldout_formulations: `i need you to select POS to MATCH` FULL 0.000 (n 3)
- new_identities: `lets insert MATCH POS of the ORD UNIT` FULL 0.000 (n 3)
- new_identities: `now delete UNIT POS MATCH` FULL 0.000 (n 3)
- new_identities: `okay so add MATCH POS of the ORD UNIT` FULL 0.000 (n 3)
- new_identities: `please delete UNIT POS MATCH` FULL 0.000 (n 3)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role unit | role ordinal | role match | role format | role value | role position | role new_text | role widget |
|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.704±0.039 | 0.704±0.039 | 0.860±0.026 | 0.976±0.019 | 0.891±0.040 | 0.979±0.004 | 0.987±0.007 | 0.939±0.009 | 0.892±0.030 | 0.999±0.002 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.568±0.028 | 0.568±0.028 | 0.747±0.025 | 0.954±0.021 | 0.873±0.021 | 0.980±0.004 | 0.978±0.008 | 0.914±0.012 | 0.873±0.031 | 1.000±0.000 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.761±0.005 | 0.761±0.005 | 1.000±0.000 | 1.000±0.000 | 0.766±0.006 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.764±0.004 | 0.993±0.002 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | unit | product: fitted | 0.857±0.040 | 1.000±0.000 | 0.928±0.020 | 0.052±0.030 (— / 0.052±0.030) |
| heldout_formulations | unit | comparison: pooled midpoint | 0.715±0.047 | 1.000±0.000 | 0.858±0.023 |  |
| heldout_formulations | ordinal | product: fitted | 0.967±0.037 | 1.000±0.000 | 0.983±0.019 | 0.074±0.055 (— / 0.074±0.055) |
| heldout_formulations | ordinal | comparison: pooled midpoint | 0.946±0.028 | 1.000±0.000 | 0.973±0.014 |  |
| heldout_formulations | match | product: fitted | 0.805±0.066 | 0.963±0.025 | 0.884±0.041 | 0.162±0.062 (0.233±0.200 / 0.148±0.067) |
| heldout_formulations | match | comparison: pooled midpoint | 0.779±0.068 | 0.980±0.001 | 0.880±0.034 |  |
| heldout_formulations | format | product: fitted | 0.866±0.046 | 1.000±0.000 | 0.933±0.023 | 0.092±0.075 (— / 0.092±0.075) |
| heldout_formulations | format | comparison: pooled midpoint | 0.875±0.049 | 1.000±0.000 | 0.937±0.025 |  |
| heldout_formulations | value | product: fitted | 0.890±0.080 | 1.000±0.000 | 0.945±0.040 | 0.869±0.130 (— / 0.869±0.130) |
| heldout_formulations | value | comparison: pooled midpoint | 0.738±0.099 | 1.000±0.000 | 0.869±0.050 |  |
| heldout_formulations | position | product: fitted | 0.922±0.028 | 1.000±0.000 | 0.961±0.014 | 0.066±0.022 (— / 0.066±0.022) |
| heldout_formulations | position | comparison: pooled midpoint | 0.933±0.009 | 1.000±0.000 | 0.967±0.005 |  |
| heldout_formulations | new_text | product: fitted | 0.815±0.093 | 0.917±0.031 | 0.866±0.048 | 0.343±0.060 (0.182±0.143 / 0.399±0.053) |
| heldout_formulations | new_text | comparison: pooled midpoint | 0.768±0.090 | 0.917±0.028 | 0.843±0.044 |  |
| heldout_formulations | widget | product: fitted | 0.960±0.080 | 1.000±0.000 | 0.980±0.040 | 0.310±0.284 (— / 0.310±0.284) |
| heldout_formulations | widget | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | unit | product: fitted | 0.905±0.045 | 1.000±0.000 | 0.952±0.023 | 0.078±0.037 (— / 0.078±0.037) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.761±0.052 | 1.000±0.000 | 0.881±0.026 |  |
| heldout_sentences | ordinal | product: fitted | 0.972±0.020 | 1.000±0.000 | 0.986±0.010 | 0.029±0.021 (— / 0.029±0.021) |
| heldout_sentences | ordinal | comparison: pooled midpoint | 0.975±0.015 | 1.000±0.000 | 0.988±0.008 |  |
| heldout_sentences | match | product: fitted | 0.958±0.015 | 0.992±0.007 | 0.975±0.006 | 0.065±0.042 (0.000±0.000 / 0.066±0.043) |
| heldout_sentences | match | comparison: pooled midpoint | 0.857±0.031 | 0.994±0.007 | 0.925±0.017 |  |
| heldout_sentences | format | product: fitted | 0.901±0.055 | 1.000±0.000 | 0.950±0.027 | 0.239±0.103 (— / 0.239±0.103) |
| heldout_sentences | format | comparison: pooled midpoint | 0.910±0.037 | 1.000±0.000 | 0.955±0.019 |  |
| heldout_sentences | value | product: fitted | 0.845±0.102 | 1.000±0.000 | 0.923±0.051 | 0.389±0.141 (— / 0.389±0.141) |
| heldout_sentences | value | comparison: pooled midpoint | 0.827±0.113 | 1.000±0.000 | 0.914±0.056 |  |
| heldout_sentences | position | product: fitted | 0.964±0.034 | 1.000±0.000 | 0.982±0.017 | 0.038±0.019 (— / 0.038±0.019) |
| heldout_sentences | position | comparison: pooled midpoint | 0.950±0.058 | 1.000±0.000 | 0.975±0.029 |  |
| heldout_sentences | new_text | product: fitted | 0.966±0.017 | 0.995±0.006 | 0.980±0.007 | 0.233±0.074 (1.000±0.000 / 0.221±0.062) |
| heldout_sentences | new_text | comparison: pooled midpoint | 0.911±0.050 | 0.997±0.005 | 0.954±0.025 |  |
| heldout_sentences | widget | product: fitted | 0.833±0.211 | 1.000±0.000 | 0.917±0.105 | 0.700±0.267 (— / 0.700±0.267) |
| heldout_sentences | widget | comparison: pooled midpoint | 0.833±0.211 | 1.000±0.000 | 0.917±0.105 |  |
| new_identities | unit | product: fitted | 0.855±0.011 | 1.000±0.000 | 0.927±0.005 | 0.017±0.012 (— / 0.017±0.012) |
| new_identities | unit | comparison: pooled midpoint | 0.823±0.034 | 1.000±0.000 | 0.911±0.017 |  |
| new_identities | ordinal | product: fitted | 0.937±0.027 | 1.000±0.000 | 0.968±0.014 | 0.056±0.015 (— / 0.056±0.015) |
| new_identities | ordinal | comparison: pooled midpoint | 0.887±0.016 | 1.000±0.000 | 0.944±0.008 |  |
| new_identities | match | product: fitted | 0.946±0.005 | 0.881±0.018 | 0.914±0.009 | 0.095±0.017 (0.094±0.090 / 0.096±0.016) |
| new_identities | match | comparison: pooled midpoint | 0.859±0.010 | 0.911±0.007 | 0.885±0.008 |  |
| new_identities | format | product: fitted | 0.670±0.057 | 1.000±0.000 | 0.835±0.029 | 0.395±0.117 (— / 0.395±0.117) |
| new_identities | format | comparison: pooled midpoint | 0.675±0.033 | 1.000±0.000 | 0.838±0.017 |  |
| new_identities | value | product: fitted | 0.955±0.044 | 1.000±0.000 | 0.978±0.022 | 0.197±0.045 (— / 0.197±0.045) |
| new_identities | value | comparison: pooled midpoint | 0.974±0.035 | 1.000±0.000 | 0.987±0.017 |  |
| new_identities | position | product: fitted | 0.949±0.020 | 1.000±0.000 | 0.974±0.010 | 0.040±0.010 (— / 0.040±0.010) |
| new_identities | position | comparison: pooled midpoint | 0.957±0.014 | 1.000±0.000 | 0.978±0.007 |  |
| new_identities | new_text | product: fitted | 0.891±0.022 | 0.979±0.009 | 0.935±0.009 | 0.261±0.035 (0.187±0.165 / 0.263±0.034) |
| new_identities | new_text | comparison: pooled midpoint | 0.887±0.013 | 0.979±0.010 | 0.933±0.007 |  |
| new_identities | widget | product: fitted | 0.891±0.068 | 0.998±0.002 | 0.944±0.035 | 0.615±0.145 (1.000±0.000 / 0.604±0.146) |
| new_identities | widget | comparison: pooled midpoint | 0.907±0.089 | 0.998±0.003 | 0.952±0.045 |  |
| train (sample) | unit | product: fitted | 0.888±0.041 | 1.000±0.000 | 0.944±0.021 | 0.077±0.025 (— / 0.077±0.025) |
| train (sample) | ordinal | product: fitted | 0.954±0.018 | 1.000±0.000 | 0.977±0.009 | 0.052±0.022 (— / 0.052±0.022) |
| train (sample) | match | product: fitted | 0.961±0.014 | 0.974±0.007 | 0.968±0.007 | 0.098±0.028 (0.000±0.000 / 0.103±0.031) |
| train (sample) | format | product: fitted | 0.885±0.033 | 1.000±0.000 | 0.942±0.016 | 0.182±0.033 (— / 0.182±0.033) |
| train (sample) | value | product: fitted | 0.906±0.039 | 1.000±0.000 | 0.953±0.019 | 0.146±0.049 (— / 0.146±0.049) |
| train (sample) | position | product: fitted | 0.961±0.008 | 1.000±0.000 | 0.980±0.004 | 0.048±0.036 (— / 0.048±0.036) |
| train (sample) | new_text | product: fitted | 0.895±0.029 | 0.996±0.002 | 0.945±0.015 | 0.152±0.039 (0.250±0.433 / 0.151±0.043) |
| train (sample) | widget | product: fitted | 1.000±0.000 | 0.999±0.002 | 1.000±0.001 | 0.050±0.100 (1.000 / 0.000±0.000) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
