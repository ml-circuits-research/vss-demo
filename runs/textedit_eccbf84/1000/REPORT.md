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
D=1024, seeds [0, 1, 2, 3, 4], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit eccbf84. Memory curve: runs/1000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:unit: threshold 0.478 [rule: fit; pooled midpoint 0.758 (comparison)] (present 1.056, n 421 / absent 0.461, n 198)
- presence:ordinal: threshold 0.547 [rule: fit; pooled midpoint 0.551 (comparison)] (present 0.847, n 299 / absent 0.254, n 320)
- presence:match: threshold 0.305 [rule: fit; pooled midpoint 0.398 (comparison)] (present 0.550, n 186 / absent 0.246, n 433)
- presence:format: threshold 0.276 [rule: fit; pooled midpoint 0.300 (comparison)] (present 0.493, n 99 / absent 0.108, n 520)
- presence:value: threshold 0.116 [rule: fit; pooled midpoint 0.156 (comparison)] (present 0.229, n 63 / absent 0.083, n 556)
- presence:position: threshold 0.215 [rule: fit; pooled midpoint 0.285 (comparison)] (present 0.434, n 171 / absent 0.136, n 448)
- presence:new_text: threshold 0.194 [rule: fit; pooled midpoint 0.247 (comparison)] (present 0.349, n 147 / absent 0.145, n 472)
- presence:widget: threshold 0.191 [rule: fit; pooled midpoint 0.205 (comparison)] (present 0.371, n 10 / absent 0.038, n 609)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): unit 0.062, ordinal 0.040, match 0.007, format 0.077, value 0.050, position 0.250, new_text 0.007, widget 0.007, predicate 0.023

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 181 of 181)
| axis | accuracy |
|---|---|
| FULL | 0.714±0.013 |
| FULL [depth given] | 0.714±0.013 |
| FULL [depth and negation given] | 0.714±0.013 |
| FULL [presence not decided] | 0.761±0.005 |
| FULL [pooled midpoint (comparison)] | 0.622±0.017 |
| presence unit: present read present | 0.970±0.011 |
| presence unit: share of 'present' readings that abstain | 0.027±0.007 |
| presence unit: share of true 'present' readings that abstain | 0.027±0.007 |
| presence ordinal: present read present | 0.819±0.040 |
| presence ordinal: share of 'present' readings that abstain | 0.070±0.042 |
| presence ordinal: share of true 'present' readings that abstain | 0.070±0.042 |
| presence match: absent read absent | 0.978±0.004 |
| presence format: absent read absent | 1.000±0.000 |
| presence value: absent read absent | 1.000±0.000 |
| presence position: absent read absent | 1.000±0.000 |
| presence new_text: absent read absent | 0.948±0.018 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.902±0.014 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.902±0.014 |
| event type (synonym table) | 0.902±0.014 |
| role unit | 0.938±0.007 |
| head unit | 0.938±0.007 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.994±0.000 |
| occupancy: known filler | 0.834±0.008 |
| role ordinal | 0.910±0.018 |
| head ordinal | 0.910±0.018 |
| lexical order head ordinal | 0.525±0.000 |
| lexical bag head ordinal | 0.541±0.000 |
| role match | 0.905±0.020 |
| head match | 0.905±0.020 |
| lexical order head match | 0.657±0.000 |
| lexical bag head match | 0.630±0.000 |
| occupancy: not given | 0.991±0.002 |
| role format | 0.985±0.004 |
| head format | 0.985±0.004 |
| lexical order head format | 0.873±0.000 |
| lexical bag head format | 0.884±0.000 |
| role value | 0.989±0.009 |
| head value | 0.989±0.009 |
| lexical order head value | 0.939±0.000 |
| lexical bag head value | 0.939±0.000 |
| role position | 0.936±0.010 |
| head position | 0.936±0.010 |
| lexical order head position | 0.591±0.000 |
| lexical bag head position | 0.646±0.000 |
| role new_text | 0.905±0.011 |
| head new_text | 0.905±0.011 |
| lexical order head new_text | 0.762±0.000 |
| lexical bag head new_text | 0.818±0.000 |
| role widget | 0.999±0.002 |
| head widget | 0.999±0.002 |
| lexical order head widget | 0.972±0.000 |
| lexical bag head widget | 0.972±0.000 |
| heads FULL (model) | 0.714±0.013 |
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
| role unit [pooled midpoint (comparison)] | 0.808±0.006 |
| role ordinal [pooled midpoint (comparison)] | 0.938±0.015 |
| role match [pooled midpoint (comparison)] | 0.869±0.017 |
| role format [pooled midpoint (comparison)] | 0.979±0.004 |
| role value [pooled midpoint (comparison)] | 0.988±0.008 |
| role position [pooled midpoint (comparison)] | 0.894±0.011 |
| role new_text [pooled midpoint (comparison)] | 0.890±0.021 |
| role widget [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.622±0.017 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.817±0.006 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.901±0.032 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.980±0.000 |
| presence format: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence position: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 0.957±0.015 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence ordinal: absent read absent | 1.000±0.000 |
| presence match: present read present | 0.845±0.058 |
| presence match: share of 'present' readings that abstain | 0.232±0.041 |
| presence match: share of true 'present' readings that abstain | 0.239±0.044 |
| presence position: present read present | 0.963±0.032 |
| presence position: share of 'present' readings that abstain | 0.064±0.021 |
| presence position: share of true 'present' readings that abstain | 0.064±0.021 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence match: present read present [pooled midpoint (comparison)] | 0.788±0.058 |
| presence position: present read present [pooled midpoint (comparison)] | 0.975±0.014 |
| presence new_text: present read present | 0.872±0.029 |
| presence new_text: share of 'present' readings that abstain | 0.433±0.072 |
| presence new_text: share of true 'present' readings that abstain | 0.444±0.086 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.861±0.076 |
| presence value: present read present | 0.913±0.129 |
| presence value: share of 'present' readings that abstain | 0.873±0.127 |
| presence value: share of true 'present' readings that abstain | 0.873±0.127 |
| presence value: present read present [pooled midpoint (comparison)] | 0.910±0.092 |
| presence format: present read present | 0.918±0.034 |
| presence format: present read present [pooled midpoint (comparison)] | 0.873±0.034 |
| presence widget: present read present | 0.960±0.080 |
| presence widget: share of 'present' readings that abstain | 0.390±0.269 |
| presence widget: share of true 'present' readings that abstain | 0.390±0.269 |
| presence widget: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: share of FALSE 'present' readings that abstain | 0.373±0.181 |
| presence format: share of 'present' readings that abstain | 0.117±0.063 |
| presence format: share of true 'present' readings that abstain | 0.117±0.063 |
| presence match: share of FALSE 'present' readings that abstain | 0.067±0.133 |
| occupancy: unknown filler | 0.800±0.400 |

residual mean 0.501±0.004; status {'abstain': 130, 'ok': 34, 'no-sense': 17}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.906 | 0.307 / 0.227 | 1.00 | 0.094 | 0.000 / 0.000 |
| role unit | 0.904 | 0.220 / 0.052 | 0.90 | 0.009 | 0.017 / 0.087 |
| roles (pooled) | 0.838 | 0.138 / 0.000 | 0.72 | 0.005 | 0.122 / 0.158 |
| role ordinal | 0.872 | 0.169 / 0.000 | 0.79 | 0.000 | 0.081 / 0.128 |
| role match | 0.710 | 0.082 / 0.000 | 0.55 | 0.000 | 0.161 / 0.290 |
| role position | 0.824 | 0.119 / 0.000 | 0.81 | 0.014 | 0.027 / 0.162 |
| role new_text | 0.767 | 0.041 / 0.000 | 0.35 | 0.000 | 0.419 / 0.233 |
| role value | 0.909 | 0.006 / -0.006 | 0.00 | 0.000 | 0.909 / 0.091 |
| role format | 0.826 | 0.091 / 0.000 | 0.78 | 0.000 | 0.043 / 0.174 |
| role widget | 1.000 | 0.066 / 0.037 | 0.80 | 0.000 | 0.200 / 0.000 |

### heldout_formulations — experiment candidates (n = 181 of 181)
| axis | accuracy |
|---|---|
| FULL | 0.367±0.031 |
| FULL [depth given] | 0.367±0.031 |
| FULL [depth and negation given] | 0.367±0.031 |
| FULL [presence not decided] | 0.000±0.000 |
| FULL [pooled midpoint (comparison)] | 0.368±0.020 |
| presence unit: present read present | 0.972±0.013 |
| presence unit: share of 'present' readings that abstain | 0.183±0.019 |
| presence unit: share of true 'present' readings that abstain | 0.031±0.004 |
| presence ordinal: present read present | 0.819±0.040 |
| presence ordinal: share of 'present' readings that abstain | 0.157±0.059 |
| presence ordinal: share of true 'present' readings that abstain | 0.076±0.032 |
| presence match: absent read absent | 0.829±0.021 |
| presence format: absent read absent | 0.884±0.030 |
| presence value: absent read absent | 0.791±0.100 |
| presence position: absent read absent | 0.854±0.026 |
| presence new_text: absent read absent | 0.775±0.066 |
| presence widget: absent read absent | 0.997±0.005 |
| structure (depth, negation) | 0.897±0.011 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.897±0.011 |
| event type (synonym table) | 0.897±0.011 |
| role unit | 0.829±0.018 |
| head unit | 0.829±0.018 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.994±0.000 |
| occupancy: known filler | 0.852±0.007 |
| role ordinal | 0.867±0.009 |
| head ordinal | 0.867±0.009 |
| lexical order head ordinal | 0.525±0.000 |
| lexical bag head ordinal | 0.541±0.000 |
| role match | 0.757±0.023 |
| head match | 0.757±0.023 |
| lexical order head match | 0.657±0.000 |
| lexical bag head match | 0.630±0.000 |
| occupancy: not given | 0.868±0.015 |
| role format | 0.885±0.022 |
| head format | 0.885±0.022 |
| lexical order head format | 0.873±0.000 |
| lexical bag head format | 0.884±0.000 |
| role value | 0.771±0.090 |
| head value | 0.771±0.090 |
| lexical order head value | 0.939±0.000 |
| lexical bag head value | 0.939±0.000 |
| role position | 0.857±0.016 |
| head position | 0.857±0.016 |
| lexical order head position | 0.591±0.000 |
| lexical bag head position | 0.646±0.000 |
| role new_text | 0.735±0.046 |
| head new_text | 0.735±0.046 |
| lexical order head new_text | 0.762±0.000 |
| lexical bag head new_text | 0.818±0.000 |
| role widget | 0.987±0.007 |
| head widget | 0.987±0.007 |
| lexical order head widget | 0.972±0.000 |
| lexical bag head widget | 0.972±0.000 |
| heads FULL (model) | 0.367±0.031 |
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
| role unit [pooled midpoint (comparison)] | 0.728±0.010 |
| role ordinal [pooled midpoint (comparison)] | 0.870±0.013 |
| role match [pooled midpoint (comparison)] | 0.743±0.006 |
| role format [pooled midpoint (comparison)] | 0.909±0.015 |
| role value [pooled midpoint (comparison)] | 0.839±0.025 |
| role position [pooled midpoint (comparison)] | 0.814±0.016 |
| role new_text [pooled midpoint (comparison)] | 0.758±0.031 |
| role widget [pooled midpoint (comparison)] | 0.989±0.005 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.368±0.020 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.836±0.012 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.922±0.036 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.871±0.003 |
| presence format: absent read absent [pooled midpoint (comparison)] | 0.910±0.022 |
| presence value: absent read absent [pooled midpoint (comparison)] | 0.856±0.031 |
| presence position: absent read absent [pooled midpoint (comparison)] | 0.864±0.009 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 0.823±0.035 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent | 0.658±0.051 |
| presence unit: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence ordinal: absent read absent | 0.909±0.040 |
| presence match: present read present | 0.964±0.033 |
| presence match: share of 'present' readings that abstain | 0.605±0.013 |
| presence match: share of true 'present' readings that abstain | 0.509±0.008 |
| presence value: share of 'present' readings that abstain | 1.000±0.000 |
| presence value: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence position: present read present | 0.963±0.032 |
| presence position: share of 'present' readings that abstain | 0.248±0.013 |
| presence position: share of true 'present' readings that abstain | 0.077±0.016 |
| presence new_text: share of 'present' readings that abstain | 0.861±0.028 |
| presence new_text: share of FALSE 'present' readings that abstain | 0.994±0.012 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.733±0.018 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 0.830±0.024 |
| presence match: present read present [pooled midpoint (comparison)] | 0.886±0.026 |
| presence position: present read present [pooled midpoint (comparison)] | 0.978±0.014 |
| presence new_text: present read present | 0.932±0.037 |
| presence new_text: share of true 'present' readings that abstain | 0.751±0.065 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.918±0.079 |
| presence value: present read present | 0.911±0.130 |
| presence value: share of true 'present' readings that abstain | 1.000±0.000 |
| presence value: present read present [pooled midpoint (comparison)] | 0.906±0.092 |
| presence format: present read present | 0.918±0.034 |
| presence format: present read present [pooled midpoint (comparison)] | 0.872±0.033 |
| presence position: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence widget: present read present | 1.000±0.000 |
| presence widget: share of 'present' readings that abstain | 0.931±0.086 |
| presence widget: share of true 'present' readings that abstain | 0.920±0.098 |
| presence widget: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence ordinal: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence match: share of FALSE 'present' readings that abstain | 0.891±0.029 |
| presence format: share of 'present' readings that abstain | 0.680±0.107 |
| presence format: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence format: share of true 'present' readings that abstain | 0.437±0.130 |
| occupancy: unknown filler | 1.000±0.000 |

residual mean 0.521±0.003; status {'abstain': 144, 'ok': 19, 'no-sense': 18}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.901 | 0.307 / 0.227 | 1.00 | 0.099 | 0.000 / 0.000 |
| role unit | 0.896 | 0.171 / 0.035 | 0.89 | 0.017 | 0.026 / 0.087 |
| roles (pooled) | 0.766 | 0.106 / 0.000 | 0.66 | 0.005 | 0.107 / 0.229 |
| role ordinal | 0.860 | 0.139 / 0.000 | 0.79 | 0.000 | 0.070 / 0.140 |
| role match | 0.581 | 0.053 / 0.000 | 0.40 | 0.000 | 0.177 / 0.419 |
| role position | 0.824 | 0.094 / 0.000 | 0.78 | 0.000 | 0.041 / 0.176 |
| role new_text | 0.581 | 0.027 / 0.000 | 0.26 | 0.000 | 0.326 / 0.419 |
| role value | 0.000 | 0.008 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role format | 0.783 | 0.049 / 0.000 | 0.57 | 0.000 | 0.217 / 0.217 |
| role widget | 0.800 | 0.024 / 0.007 | 0.20 | 0.000 | 0.600 / 0.200 |

### heldout_sentences — catalog candidates (n = 109 of 109)
| axis | accuracy |
|---|---|
| FULL | 0.800±0.031 |
| FULL [depth given] | 0.800±0.031 |
| FULL [depth and negation given] | 0.800±0.031 |
| FULL [pooled midpoint (comparison)] | 0.705±0.021 |
| presence unit: present read present | 0.976±0.007 |
| presence unit: share of 'present' readings that abstain | 0.024±0.016 |
| presence unit: share of true 'present' readings that abstain | 0.024±0.016 |
| presence ordinal: present read present | 0.965±0.015 |
| presence ordinal: share of 'present' readings that abstain | 0.057±0.038 |
| presence ordinal: share of true 'present' readings that abstain | 0.057±0.038 |
| presence match: absent read absent | 0.997±0.005 |
| presence format: absent read absent | 1.000±0.000 |
| presence value: absent read absent | 1.000±0.000 |
| presence position: absent read absent | 1.000±0.000 |
| presence new_text: absent read absent | 0.995±0.006 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.901±0.007 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.901±0.007 |
| event type (synonym table) | 0.901±0.007 |
| role unit | 0.936±0.006 |
| head unit | 0.936±0.006 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.963±0.000 |
| occupancy: known filler | 0.864±0.014 |
| role ordinal | 0.974±0.007 |
| head ordinal | 0.974±0.007 |
| lexical order head ordinal | 0.523±0.000 |
| lexical bag head ordinal | 0.661±0.000 |
| role match | 0.938±0.018 |
| head match | 0.938±0.018 |
| lexical order head match | 0.725±0.000 |
| lexical bag head match | 0.761±0.000 |
| occupancy: not given | 0.999±0.001 |
| role format | 0.943±0.007 |
| head format | 0.943±0.007 |
| lexical order head format | 0.789±0.000 |
| lexical bag head format | 0.826±0.000 |
| role value | 0.974±0.011 |
| head value | 0.974±0.011 |
| lexical order head value | 0.881±0.000 |
| lexical bag head value | 0.936±0.000 |
| role position | 0.969±0.016 |
| head position | 0.969±0.016 |
| lexical order head position | 0.789±0.000 |
| lexical bag head position | 0.908±0.000 |
| role new_text | 0.974±0.007 |
| head new_text | 0.974±0.007 |
| lexical order head new_text | 0.780±0.000 |
| lexical bag head new_text | 0.890±0.000 |
| role widget | 0.987±0.004 |
| head widget | 0.987±0.004 |
| lexical order head widget | 0.972±0.000 |
| lexical bag head widget | 0.972±0.000 |
| heads FULL (model) | 0.800±0.031 |
| heads FULL (lexical order baseline) | 0.083±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.294±0.000 |
| role unit [pooled midpoint (comparison)] | 0.862±0.010 |
| role ordinal [pooled midpoint (comparison)] | 0.980±0.007 |
| role match [pooled midpoint (comparison)] | 0.912±0.011 |
| role format [pooled midpoint (comparison)] | 0.934±0.007 |
| role value [pooled midpoint (comparison)] | 0.958±0.017 |
| role position [pooled midpoint (comparison)] | 0.947±0.013 |
| role new_text [pooled midpoint (comparison)] | 0.967±0.009 |
| role widget [pooled midpoint (comparison)] | 0.987±0.004 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.705±0.021 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.904±0.017 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.980±0.012 |
| presence match: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence format: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence position: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 0.994±0.007 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence format: present read present | 0.876±0.038 |
| presence format: share of 'present' readings that abstain | 0.211±0.096 |
| presence format: share of true 'present' readings that abstain | 0.211±0.096 |
| presence format: present read present [pooled midpoint (comparison)] | 0.858±0.027 |
| presence position: present read present | 0.950±0.063 |
| presence position: share of 'present' readings that abstain | 0.144±0.043 |
| presence position: share of true 'present' readings that abstain | 0.144±0.043 |
| presence position: present read present [pooled midpoint (comparison)] | 0.914±0.056 |
| presence unit: absent read absent | 1.000±0.000 |
| presence ordinal: absent read absent | 1.000±0.000 |
| presence match: present read present | 0.892±0.063 |
| presence match: share of 'present' readings that abstain | 0.101±0.041 |
| presence match: share of true 'present' readings that abstain | 0.094±0.034 |
| presence new_text: present read present | 0.991±0.018 |
| presence new_text: share of 'present' readings that abstain | 0.246±0.064 |
| presence new_text: share of true 'present' readings that abstain | 0.232±0.062 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence match: present read present [pooled midpoint (comparison)] | 0.836±0.036 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.981±0.023 |
| presence value: present read present | 0.911±0.081 |
| presence value: share of 'present' readings that abstain | 0.487±0.113 |
| presence value: share of true 'present' readings that abstain | 0.487±0.113 |
| presence value: present read present [pooled midpoint (comparison)] | 0.815±0.125 |
| presence widget: present read present | 0.800±0.245 |
| presence widget: share of 'present' readings that abstain | 0.700±0.245 |
| presence widget: share of true 'present' readings that abstain | 0.700±0.245 |
| occupancy: unknown filler | 1.000±0.000 |
| presence widget: present read present [pooled midpoint (comparison)] | 0.800±0.245 |
| presence new_text: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.472±0.007; status {'abstain': 73, 'ok': 25, 'no-sense': 11}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.899 | 0.293 / 0.211 | 1.00 | 0.101 | 0.000 / 0.000 |
| role unit | 0.918 | 0.232 / 0.093 | 0.92 | 0.014 | 0.014 / 0.068 |
| roles (pooled) | 0.842 | 0.151 / 0.000 | 0.78 | 0.008 | 0.071 / 0.149 |
| role ordinal | 0.962 | 0.188 / 0.126 | 0.94 | 0.000 | 0.019 / 0.038 |
| role format | 0.696 | 0.058 / 0.000 | 0.57 | 0.000 | 0.130 / 0.304 |
| role position | 0.739 | 0.097 / 0.000 | 0.65 | 0.000 | 0.087 / 0.261 |
| role match | 0.700 | 0.109 / 0.000 | 0.67 | 0.000 | 0.033 / 0.300 |
| role new_text | 0.917 | 0.085 / 0.043 | 0.79 | 0.042 | 0.167 / 0.042 |
| role value | 0.692 | 0.045 / 0.000 | 0.38 | 0.000 | 0.308 / 0.308 |
| role widget | 0.333 | 0.026 / 0.007 | 0.00 | 0.000 | 0.333 / 0.667 |

### heldout_sentences — experiment candidates (n = 109 of 109)
| axis | accuracy |
|---|---|
| FULL | 0.365±0.051 |
| FULL [depth given] | 0.365±0.051 |
| FULL [depth and negation given] | 0.365±0.051 |
| FULL [pooled midpoint (comparison)] | 0.428±0.016 |
| presence unit: present read present | 0.976±0.007 |
| presence unit: share of 'present' readings that abstain | 0.130±0.013 |
| presence unit: share of true 'present' readings that abstain | 0.027±0.018 |
| presence ordinal: present read present | 0.965±0.015 |
| presence ordinal: share of 'present' readings that abstain | 0.161±0.047 |
| presence ordinal: share of true 'present' readings that abstain | 0.069±0.042 |
| presence match: absent read absent | 0.736±0.010 |
| presence format: absent read absent | 0.863±0.057 |
| presence value: absent read absent | 0.717±0.126 |
| presence value: share of 'present' readings that abstain | 0.952±0.032 |
| presence value: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence position: absent read absent | 0.787±0.043 |
| presence new_text: absent read absent | 0.726±0.073 |
| presence widget: absent read absent | 0.992±0.017 |
| structure (depth, negation) | 0.888±0.011 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.888±0.011 |
| event type (synonym table) | 0.888±0.011 |
| role unit | 0.864±0.004 |
| head unit | 0.864±0.004 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.963±0.000 |
| occupancy: known filler | 0.858±0.014 |
| role ordinal | 0.925±0.019 |
| head ordinal | 0.925±0.019 |
| lexical order head ordinal | 0.523±0.000 |
| lexical bag head ordinal | 0.661±0.000 |
| role match | 0.750±0.021 |
| head match | 0.750±0.021 |
| lexical order head match | 0.725±0.000 |
| lexical bag head match | 0.761±0.000 |
| occupancy: not given | 0.834±0.017 |
| role format | 0.811±0.044 |
| head format | 0.811±0.044 |
| lexical order head format | 0.789±0.000 |
| lexical bag head format | 0.826±0.000 |
| role value | 0.719±0.108 |
| head value | 0.719±0.108 |
| lexical order head value | 0.881±0.000 |
| lexical bag head value | 0.936±0.000 |
| role position | 0.820±0.024 |
| head position | 0.820±0.024 |
| lexical order head position | 0.789±0.000 |
| lexical bag head position | 0.908±0.000 |
| role new_text | 0.780±0.059 |
| head new_text | 0.780±0.059 |
| lexical order head new_text | 0.780±0.000 |
| lexical bag head new_text | 0.890±0.000 |
| role widget | 0.967±0.016 |
| head widget | 0.967±0.016 |
| lexical order head widget | 0.972±0.000 |
| lexical bag head widget | 0.972±0.000 |
| heads FULL (model) | 0.365±0.051 |
| heads FULL (lexical order baseline) | 0.083±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.294±0.000 |
| role unit [pooled midpoint (comparison)] | 0.806±0.011 |
| role ordinal [pooled midpoint (comparison)] | 0.919±0.022 |
| role match [pooled midpoint (comparison)] | 0.754±0.019 |
| role format [pooled midpoint (comparison)] | 0.859±0.016 |
| role value [pooled midpoint (comparison)] | 0.782±0.038 |
| role position [pooled midpoint (comparison)] | 0.824±0.023 |
| role new_text [pooled midpoint (comparison)] | 0.822±0.018 |
| role widget [pooled midpoint (comparison)] | 0.972±0.006 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.428±0.016 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.906±0.013 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.980±0.012 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.770±0.008 |
| presence format: absent read absent [pooled midpoint (comparison)] | 0.933±0.012 |
| presence value: absent read absent [pooled midpoint (comparison)] | 0.799±0.042 |
| presence position: absent read absent [pooled midpoint (comparison)] | 0.815±0.021 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 0.778±0.015 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 0.998±0.004 |
| presence format: present read present | 0.911±0.044 |
| presence format: share of 'present' readings that abstain | 0.783±0.062 |
| presence format: share of true 'present' readings that abstain | 0.653±0.068 |
| presence format: present read present [pooled midpoint (comparison)] | 0.919±0.043 |
| presence position: present read present | 0.950±0.063 |
| presence position: share of 'present' readings that abstain | 0.553±0.027 |
| presence position: share of true 'present' readings that abstain | 0.186±0.058 |
| presence position: present read present [pooled midpoint (comparison)] | 0.914±0.056 |
| presence unit: absent read absent | 0.732±0.028 |
| presence unit: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence ordinal: absent read absent | 0.882±0.031 |
| presence match: present read present | 0.892±0.071 |
| presence match: share of 'present' readings that abstain | 0.529±0.025 |
| presence match: share of true 'present' readings that abstain | 0.120±0.071 |
| presence position: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence new_text: present read present | 0.991±0.018 |
| presence new_text: share of 'present' readings that abstain | 0.740±0.084 |
| presence new_text: share of true 'present' readings that abstain | 0.511±0.104 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.774±0.009 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 0.839±0.046 |
| presence match: present read present [pooled midpoint (comparison)] | 0.840±0.042 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.981±0.023 |
| presence ordinal: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence match: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence new_text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence value: present read present | 0.911±0.081 |
| presence value: share of true 'present' readings that abstain | 0.812±0.127 |
| presence value: present read present [pooled midpoint (comparison)] | 0.807±0.131 |
| presence widget: present read present | 1.000±0.000 |
| presence widget: share of 'present' readings that abstain | 1.000±0.000 |
| presence widget: share of true 'present' readings that abstain | 1.000±0.000 |
| occupancy: unknown filler | 1.000±0.000 |
| presence widget: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence format: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.488±0.008; status {'abstain': 82, 'ok': 14, 'no-sense': 13}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.881 | 0.293 / 0.211 | 1.00 | 0.119 | 0.000 / 0.000 |
| role unit | 0.918 | 0.179 / 0.076 | 0.92 | 0.014 | 0.014 / 0.068 |
| roles (pooled) | 0.805 | 0.113 / 0.000 | 0.70 | 0.008 | 0.116 / 0.187 |
| role ordinal | 0.962 | 0.154 / 0.091 | 0.94 | 0.000 | 0.019 / 0.038 |
| role format | 0.609 | 0.027 / 0.000 | 0.26 | 0.000 | 0.348 / 0.391 |
| role position | 0.739 | 0.073 / 0.000 | 0.61 | 0.000 | 0.130 / 0.261 |
| role match | 0.633 | 0.078 / 0.000 | 0.63 | 0.000 | 0.000 / 0.367 |
| role new_text | 0.875 | 0.049 / 0.007 | 0.42 | 0.042 | 0.500 / 0.083 |
| role value | 0.462 | 0.025 / 0.000 | 0.23 | 0.000 | 0.231 / 0.538 |
| role widget | 0.000 | 0.008 / 0.004 | 0.00 | 0.000 | 0.000 / 1.000 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.680±0.010 |
| FULL [depth given] | 0.680±0.010 |
| FULL [depth and negation given] | 0.680±0.010 |
| FULL [pooled midpoint (comparison)] | 0.578±0.016 |
| presence unit: present read present | 0.938±0.040 |
| presence unit: share of 'present' readings that abstain | 0.052±0.019 |
| presence unit: share of true 'present' readings that abstain | 0.052±0.019 |
| presence ordinal: absent read absent | 1.000±0.000 |
| presence match: present read present | 0.930±0.024 |
| presence match: share of 'present' readings that abstain | 0.123±0.008 |
| presence match: share of true 'present' readings that abstain | 0.125±0.009 |
| presence format: absent read absent | 1.000±0.000 |
| presence value: present read present | 0.945±0.055 |
| presence position: absent read absent | 1.000±0.000 |
| presence new_text: absent read absent | 0.982±0.008 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.854±0.016 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.854±0.016 |
| event type (synonym table) | 0.854±0.016 |
| role unit | 0.963±0.010 |
| head unit | 0.963±0.010 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.998±0.000 |
| occupancy: known filler | 0.813±0.012 |
| role ordinal | 0.968±0.007 |
| head ordinal | 0.968±0.007 |
| lexical order head ordinal | 0.815±0.000 |
| lexical bag head ordinal | 0.920±0.000 |
| occupancy: not given | 0.995±0.001 |
| role match | 0.783±0.025 |
| head match | 0.783±0.025 |
| lexical order head match | 0.230±0.000 |
| lexical bag head match | 0.410±0.000 |
| occupancy: unknown filler | 0.795±0.026 |
| role format | 0.969±0.004 |
| head format | 0.969±0.004 |
| lexical order head format | 0.938±0.000 |
| lexical bag head format | 0.955±0.000 |
| role value | 0.974±0.008 |
| head value | 0.974±0.008 |
| lexical order head value | 0.918±0.000 |
| lexical bag head value | 0.953±0.000 |
| role position | 0.933±0.012 |
| head position | 0.933±0.012 |
| lexical order head position | 0.662±0.000 |
| lexical bag head position | 0.845±0.000 |
| role new_text | 0.913±0.009 |
| head new_text | 0.913±0.009 |
| lexical order head new_text | 0.532±0.000 |
| lexical bag head new_text | 0.785±0.000 |
| role widget | 0.990±0.004 |
| head widget | 0.990±0.004 |
| lexical order head widget | 0.940±0.000 |
| lexical bag head widget | 0.940±0.000 |
| heads FULL (model) | 0.680±0.010 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.268±0.000 |
| role unit [pooled midpoint (comparison)] | 0.915±0.005 |
| role ordinal [pooled midpoint (comparison)] | 0.972±0.007 |
| role match [pooled midpoint (comparison)] | 0.695±0.012 |
| role format [pooled midpoint (comparison)] | 0.962±0.001 |
| role value [pooled midpoint (comparison)] | 0.970±0.006 |
| role position [pooled midpoint (comparison)] | 0.899±0.011 |
| role new_text [pooled midpoint (comparison)] | 0.886±0.019 |
| role widget [pooled midpoint (comparison)] | 0.989±0.005 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.578±0.016 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.849±0.015 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence match: present read present [pooled midpoint (comparison)] | 0.846±0.013 |
| presence format: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: present read present [pooled midpoint (comparison)] | 0.952±0.044 |
| presence position: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 0.985±0.005 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence value: absent read absent | 1.000±0.000 |
| presence new_text: present read present | 0.917±0.009 |
| presence new_text: share of 'present' readings that abstain | 0.306±0.016 |
| presence new_text: share of true 'present' readings that abstain | 0.298±0.016 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence value: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.890±0.028 |
| presence ordinal: present read present | 0.831±0.032 |
| presence ordinal: share of 'present' readings that abstain | 0.045±0.037 |
| presence ordinal: share of true 'present' readings that abstain | 0.045±0.037 |
| presence match: absent read absent | 0.899±0.007 |
| presence format: present read present | 0.621±0.091 |
| presence widget: present read present | 0.862±0.069 |
| presence widget: share of 'present' readings that abstain | 0.606±0.134 |
| presence widget: share of true 'present' readings that abstain | 0.606±0.134 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.872±0.018 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.894±0.010 |
| presence format: present read present [pooled midpoint (comparison)] | 0.554±0.049 |
| presence widget: present read present [pooled midpoint (comparison)] | 0.859±0.077 |
| presence position: present read present | 0.937±0.055 |
| presence position: share of 'present' readings that abstain | 0.095±0.028 |
| presence position: share of true 'present' readings that abstain | 0.095±0.028 |
| presence position: present read present [pooled midpoint (comparison)] | 0.937±0.011 |
| presence match: share of FALSE 'present' readings that abstain | 0.084±0.076 |
| presence new_text: share of FALSE 'present' readings that abstain | 0.627±0.336 |
| presence value: share of 'present' readings that abstain | 0.254±0.053 |
| presence value: share of true 'present' readings that abstain | 0.254±0.053 |
| presence format: share of 'present' readings that abstain | 0.445±0.095 |
| presence format: share of true 'present' readings that abstain | 0.445±0.095 |

residual mean 0.515±0.007; status {'abstain': 250, 'ok': 84, 'no-sense': 66}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.835 | 0.304 / 0.215 | 1.00 | 0.165 | 0.000 / 0.000 |
| role unit | 0.924 | 0.193 / 0.032 | 0.88 | 0.007 | 0.055 / 0.069 |
| roles (pooled) | 0.781 | 0.106 / 0.000 | 0.66 | 0.005 | 0.124 / 0.214 |
| role match | 0.711 | 0.098 / 0.000 | 0.64 | 0.010 | 0.078 / 0.279 |
| role value | 0.606 | 0.048 / 0.000 | 0.45 | 0.000 | 0.152 / 0.394 |
| role new_text | 0.813 | 0.065 / 0.000 | 0.60 | 0.000 | 0.209 / 0.187 |
| role ordinal | 0.878 | 0.154 / 0.000 | 0.78 | 0.000 | 0.095 / 0.122 |
| role format | 0.440 | 0.024 / 0.000 | 0.24 | 0.000 | 0.200 / 0.560 |
| role widget | 0.792 | 0.030 / 0.000 | 0.17 | 0.000 | 0.625 / 0.208 |
| role position | 0.793 | 0.103 / 0.000 | 0.71 | 0.007 | 0.089 / 0.200 |

### new_identities — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.296±0.028 |
| FULL [depth given] | 0.296±0.028 |
| FULL [depth and negation given] | 0.296±0.028 |
| FULL [pooled midpoint (comparison)] | 0.305±0.019 |
| presence unit: present read present | 0.941±0.041 |
| presence unit: share of 'present' readings that abstain | 0.367±0.026 |
| presence unit: share of true 'present' readings that abstain | 0.057±0.018 |
| presence ordinal: absent read absent | 0.875±0.036 |
| presence ordinal: share of 'present' readings that abstain | 0.373±0.069 |
| presence ordinal: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence match: present read present | 0.939±0.020 |
| presence match: share of 'present' readings that abstain | 0.306±0.007 |
| presence match: share of true 'present' readings that abstain | 0.232±0.016 |
| presence format: absent read absent | 0.919±0.037 |
| presence value: present read present | 0.945±0.055 |
| presence position: absent read absent | 0.739±0.087 |
| presence new_text: absent read absent | 0.677±0.109 |
| presence new_text: share of 'present' readings that abstain | 0.664±0.032 |
| presence new_text: share of FALSE 'present' readings that abstain | 0.996±0.007 |
| presence widget: absent read absent | 0.994±0.010 |
| structure (depth, negation) | 0.841±0.019 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.841±0.019 |
| event type (synonym table) | 0.841±0.019 |
| role unit | 0.799±0.010 |
| head unit | 0.799±0.010 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.998±0.000 |
| occupancy: known filler | 0.802±0.008 |
| role ordinal | 0.885±0.020 |
| head ordinal | 0.885±0.020 |
| lexical order head ordinal | 0.815±0.000 |
| lexical bag head ordinal | 0.920±0.000 |
| occupancy: not given | 0.844±0.022 |
| role match | 0.690±0.027 |
| head match | 0.690±0.027 |
| lexical order head match | 0.230±0.000 |
| lexical bag head match | 0.410±0.000 |
| occupancy: unknown filler | 0.805±0.028 |
| role format | 0.895±0.028 |
| head format | 0.895±0.028 |
| lexical order head format | 0.938±0.000 |
| lexical bag head format | 0.955±0.000 |
| role value | 0.764±0.094 |
| head value | 0.764±0.094 |
| lexical order head value | 0.918±0.000 |
| lexical bag head value | 0.953±0.000 |
| role position | 0.782±0.041 |
| head position | 0.782±0.041 |
| lexical order head position | 0.662±0.000 |
| lexical bag head position | 0.845±0.000 |
| role new_text | 0.756±0.054 |
| head new_text | 0.756±0.054 |
| lexical order head new_text | 0.532±0.000 |
| lexical bag head new_text | 0.785±0.000 |
| role widget | 0.965±0.012 |
| head widget | 0.965±0.012 |
| lexical order head widget | 0.940±0.000 |
| lexical bag head widget | 0.940±0.000 |
| heads FULL (model) | 0.296±0.028 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.268±0.000 |
| role unit [pooled midpoint (comparison)] | 0.786±0.003 |
| role ordinal [pooled midpoint (comparison)] | 0.848±0.020 |
| role match [pooled midpoint (comparison)] | 0.632±0.018 |
| role format [pooled midpoint (comparison)] | 0.928±0.012 |
| role value [pooled midpoint (comparison)] | 0.815±0.055 |
| role position [pooled midpoint (comparison)] | 0.790±0.026 |
| role new_text [pooled midpoint (comparison)] | 0.773±0.037 |
| role widget [pooled midpoint (comparison)] | 0.968±0.008 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.305±0.019 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.855±0.011 |
| presence ordinal: absent read absent [pooled midpoint (comparison)] | 0.796±0.019 |
| presence match: present read present [pooled midpoint (comparison)] | 0.855±0.011 |
| presence format: absent read absent [pooled midpoint (comparison)] | 0.964±0.015 |
| presence value: present read present [pooled midpoint (comparison)] | 0.951±0.044 |
| presence position: absent read absent [pooled midpoint (comparison)] | 0.810±0.038 |
| presence new_text: absent read absent [pooled midpoint (comparison)] | 0.760±0.050 |
| presence widget: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence unit: absent read absent | 0.671±0.021 |
| presence value: absent read absent | 0.739±0.125 |
| presence new_text: present read present | 0.964±0.008 |
| presence new_text: share of true 'present' readings that abstain | 0.559±0.038 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.721±0.005 |
| presence value: absent read absent [pooled midpoint (comparison)] | 0.796±0.076 |
| presence new_text: present read present [pooled midpoint (comparison)] | 0.938±0.027 |
| presence ordinal: present read present | 0.836±0.036 |
| presence ordinal: share of true 'present' readings that abstain | 0.045±0.037 |
| presence match: absent read absent | 0.606±0.021 |
| presence format: present read present | 0.618±0.088 |
| presence widget: present read present | 0.899±0.060 |
| presence widget: share of 'present' readings that abstain | 0.968±0.063 |
| presence widget: share of true 'present' readings that abstain | 0.968±0.063 |
| presence ordinal: present read present [pooled midpoint (comparison)] | 0.884±0.027 |
| presence match: absent read absent [pooled midpoint (comparison)] | 0.725±0.022 |
| presence format: present read present [pooled midpoint (comparison)] | 0.583±0.043 |
| presence widget: present read present [pooled midpoint (comparison)] | 0.888±0.077 |
| presence unit: share of FALSE 'present' readings that abstain | 0.983±0.033 |
| presence position: share of 'present' readings that abstain | 0.453±0.073 |
| presence position: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence value: share of 'present' readings that abstain | 0.910±0.029 |
| presence value: share of FALSE 'present' readings that abstain | 0.995±0.009 |
| presence match: share of FALSE 'present' readings that abstain | 0.803±0.048 |
| presence position: present read present | 0.943±0.053 |
| presence position: share of true 'present' readings that abstain | 0.171±0.033 |
| presence position: present read present [pooled midpoint (comparison)] | 0.945±0.016 |
| presence format: share of 'present' readings that abstain | 0.933±0.030 |
| presence format: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence value: share of true 'present' readings that abstain | 0.635±0.056 |
| presence format: share of true 'present' readings that abstain | 0.780±0.131 |

residual mean 0.531±0.009; status {'abstain': 288, 'ok': 40, 'no-sense': 72}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.820 | 0.304 / 0.215 | 1.00 | 0.180 | 0.000 / 0.000 |
| role unit | 0.924 | 0.142 / 0.032 | 0.88 | 0.007 | 0.055 / 0.069 |
| roles (pooled) | 0.726 | 0.078 / 0.000 | 0.58 | 0.009 | 0.157 / 0.265 |
| role match | 0.659 | 0.073 / 0.000 | 0.57 | 0.016 | 0.101 / 0.325 |
| role value | 0.606 | 0.025 / 0.000 | 0.27 | 0.000 | 0.333 / 0.394 |
| role new_text | 0.711 | 0.043 / 0.000 | 0.39 | 0.000 | 0.326 / 0.289 |
| role ordinal | 0.878 | 0.122 / 0.000 | 0.78 | 0.000 | 0.095 / 0.122 |
| role format | 0.320 | 0.007 / 0.000 | 0.04 | 0.000 | 0.280 / 0.680 |
| role widget | 0.333 | 0.011 / 0.000 | 0.00 | 0.000 | 0.333 / 0.667 |
| role position | 0.778 | 0.080 / 0.000 | 0.70 | 0.015 | 0.096 / 0.207 |

### train (sample) — catalog candidates (n = 300 of 891)
| axis | accuracy |
|---|---|
| FULL | 0.792±0.011 |
| FULL [depth given] | 0.792±0.011 |
| FULL [depth and negation given] | 0.792±0.011 |
| presence unit: absent read absent | 1.000±0.000 |
| presence ordinal: absent read absent | 1.000±0.000 |
| presence match: present read present | 0.943±0.019 |
| presence match: share of 'present' readings that abstain | 0.130±0.041 |
| presence match: share of true 'present' readings that abstain | 0.133±0.040 |
| presence format: present read present | 0.911±0.057 |
| presence value: absent read absent | 1.000±0.000 |
| presence position: absent read absent | 1.000±0.000 |
| presence new_text: absent read absent | 1.000±0.000 |
| presence widget: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.892±0.008 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.892±0.008 |
| event type (synonym table) | 0.892±0.008 |
| role unit | 0.946±0.008 |
| head unit | 0.946±0.008 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.997±0.000 |
| occupancy: not given | 0.998±0.000 |
| role ordinal | 0.943±0.006 |
| head ordinal | 0.943±0.006 |
| lexical order head ordinal | 0.573±0.000 |
| lexical bag head ordinal | 0.993±0.000 |
| role match | 0.920±0.006 |
| head match | 0.920±0.006 |
| lexical order head match | 0.660±0.000 |
| lexical bag head match | 0.943±0.000 |
| occupancy: known filler | 0.865±0.007 |
| role format | 0.970±0.011 |
| head format | 0.970±0.011 |
| lexical order head format | 0.827±0.000 |
| lexical bag head format | 0.997±0.000 |
| role value | 0.983±0.009 |
| head value | 0.983±0.009 |
| lexical order head value | 0.897±0.000 |
| lexical bag head value | 1.000±0.000 |
| role position | 0.971±0.008 |
| head position | 0.971±0.008 |
| lexical order head position | 0.787±0.000 |
| lexical bag head position | 1.000±0.000 |
| role new_text | 0.961±0.006 |
| head new_text | 0.961±0.006 |
| lexical order head new_text | 0.760±0.000 |
| lexical bag head new_text | 0.973±0.000 |
| role widget | 1.000±0.000 |
| head widget | 1.000±0.000 |
| lexical order head widget | 0.990±0.000 |
| lexical bag head widget | 1.000±0.000 |
| heads FULL (model) | 0.799±0.011 |
| heads FULL (lexical order baseline) | 0.127±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.937±0.000 |
| presence unit: present read present | 0.983±0.011 |
| presence unit: share of 'present' readings that abstain | 0.039±0.012 |
| presence unit: share of true 'present' readings that abstain | 0.039±0.012 |
| presence ordinal: present read present | 0.905±0.018 |
| presence ordinal: share of 'present' readings that abstain | 0.087±0.027 |
| presence ordinal: share of true 'present' readings that abstain | 0.087±0.027 |
| presence match: absent read absent | 0.981±0.004 |
| presence format: absent read absent | 1.000±0.000 |
| presence position: present read present | 0.972±0.032 |
| presence position: share of 'present' readings that abstain | 0.113±0.041 |
| presence position: share of true 'present' readings that abstain | 0.113±0.041 |
| presence new_text: present read present | 0.921±0.030 |
| presence new_text: share of 'present' readings that abstain | 0.188±0.016 |
| presence new_text: share of true 'present' readings that abstain | 0.188±0.016 |
| presence format: share of 'present' readings that abstain | 0.163±0.052 |
| presence format: share of true 'present' readings that abstain | 0.163±0.052 |
| presence value: present read present | 0.946±0.042 |
| presence value: share of 'present' readings that abstain | 0.300±0.092 |
| presence value: share of true 'present' readings that abstain | 0.300±0.092 |
| presence match: share of FALSE 'present' readings that abstain | 0.040±0.080 |
| presence widget: present read present | 1.000±0.000 |
| presence widget: share of 'present' readings that abstain | 0.000±0.000 |
| presence widget: share of true 'present' readings that abstain | 0.000±0.000 |

residual mean 0.474±0.004; status {'abstain': 190, 'ok': 74, 'no-sense': 36}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.880 | 0.311 / 0.213 | 1.00 | 0.120 | 0.000 / 0.000 |
| role match | 0.765 | 0.122 / 0.000 | 0.70 | 0.020 | 0.088 / 0.216 |
| roles (pooled) | 0.850 | 0.152 / 0.000 | 0.79 | 0.017 | 0.081 / 0.132 |
| role format | 0.788 | 0.071 / 0.000 | 0.63 | 0.000 | 0.154 / 0.212 |
| role unit | 0.900 | 0.231 / 0.087 | 0.92 | 0.037 | 0.021 / 0.063 |
| role ordinal | 0.883 | 0.172 / 0.000 | 0.85 | 0.000 | 0.031 / 0.117 |
| role position | 0.844 | 0.119 / 0.000 | 0.77 | 0.016 | 0.094 / 0.141 |
| role new_text | 0.833 | 0.077 / 0.000 | 0.68 | 0.014 | 0.167 / 0.153 |
| role value | 0.839 | 0.060 / 0.000 | 0.55 | 0.000 | 0.290 / 0.161 |
| role widget | 1.000 | 0.087 / 0.079 | 1.00 | 0.000 | 0.000 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 for=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 ORD=0.54 UNIT=0.50 MATCH=0.47 POS=0.30 VERB=0.29 FILLER=0.24 PRON=0.24 WHEAD=0.18 again=0.12 DEM=0.12 all=0.12 text=0.12 unknown=0.12 a=0.11 PUNCT=0.11 cursor=0.11 COLOR=0.10 ALIGN=0.10 the=0.09 back=0.08 FORMAT=0.08 SIZE=0.06

## What is weak, what to add
- heldout_formulations: FULL 0.718
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.019
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.019
- heldout_formulations: presence ordinal: present read present 0.882
- heldout_formulations: presence ordinal: share of 'present' readings that abstain 0.093
- heldout_formulations: presence ordinal: share of true 'present' readings that abstain 0.093
- heldout_formulations: occupancy: known filler 0.837
- heldout_formulations: role match 0.890
- heldout_formulations: head match 0.890
- heldout_formulations: heads FULL (model) 0.718
- heldout_formulations: heads FULL (lexical order baseline) 0.088
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.110
- heldout_formulations: FULL [depth given] 0.718
- heldout_formulations: FULL [depth and negation given] 0.718
- heldout_formulations: FULL [presence not decided] 0.762
- heldout_formulations: role match [presence not decided] 0.768
- heldout_formulations: role new_text [presence not decided] 0.762
- heldout_formulations: heads FULL (model) [presence not decided] 0.762
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.597
- heldout_formulations: role unit [pooled midpoint (comparison)] 0.796
- heldout_formulations: role match [pooled midpoint (comparison)] 0.851
- heldout_formulations: role position [pooled midpoint (comparison)] 0.878
- heldout_formulations: role new_text [pooled midpoint (comparison)] 0.856
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.597
- heldout_formulations: presence unit: present read present [pooled midpoint (comparison)] 0.812
- heldout_formulations: presence match: present read present 0.786
- heldout_formulations: presence match: share of 'present' readings that abstain 0.217
- heldout_formulations: presence match: share of true 'present' readings that abstain 0.227
- heldout_formulations: presence position: share of 'present' readings that abstain 0.033
- heldout_formulations: presence position: share of true 'present' readings that abstain 0.033
- heldout_formulations: presence match: present read present [pooled midpoint (comparison)] 0.740
- heldout_formulations: presence new_text: present read present 0.868
- heldout_formulations: presence new_text: share of 'present' readings that abstain 0.463
- heldout_formulations: presence new_text: share of true 'present' readings that abstain 0.545
- heldout_formulations: presence new_text: present read present [pooled midpoint (comparison)] 0.774
- heldout_formulations: presence format: present read present 0.864
- heldout_formulations: presence format: present read present [pooled midpoint (comparison)] 0.864
- heldout_formulations: presence widget: share of 'present' readings that abstain 0.200
- heldout_formulations: presence widget: share of true 'present' readings that abstain 0.200
- heldout_formulations: presence new_text: share of FALSE 'present' readings that abstain 0.125
- heldout_formulations: presence format: share of 'present' readings that abstain 0.053
- heldout_formulations: presence format: share of true 'present' readings that abstain 0.053
- heldout_formulations: presence match: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: FULL 0.743
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.015
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.015
- heldout_sentences: presence ordinal: share of 'present' readings that abstain 0.020
- heldout_sentences: presence ordinal: share of true 'present' readings that abstain 0.020
- heldout_sentences: structure (depth, negation) 0.899
- heldout_sentences: predicate (surface lemma) 0.899
- heldout_sentences: event type (synonym table) 0.899
- heldout_sentences: occupancy: known filler 0.842
- heldout_sentences: heads FULL (model) 0.743
- heldout_sentences: heads FULL (lexical order baseline) 0.083
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.294
- heldout_sentences: FULL [depth given] 0.743
- heldout_sentences: FULL [depth and negation given] 0.743
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.679
- heldout_sentences: role unit [pooled midpoint (comparison)] 0.853
- heldout_sentences: role match [pooled midpoint (comparison)] 0.899
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.679
- heldout_sentences: presence format: present read present 0.800
- heldout_sentences: presence format: share of 'present' readings that abstain 0.188
- heldout_sentences: presence format: share of true 'present' readings that abstain 0.188
- heldout_sentences: presence format: present read present [pooled midpoint (comparison)] 0.833
- heldout_sentences: presence position: present read present 0.850
- heldout_sentences: presence position: share of 'present' readings that abstain 0.118
- heldout_sentences: presence position: share of true 'present' readings that abstain 0.118
- heldout_sentences: presence position: present read present [pooled midpoint (comparison)] 0.833
- heldout_sentences: presence match: present read present 0.808
- heldout_sentences: presence match: share of 'present' readings that abstain 0.048
- heldout_sentences: presence match: share of true 'present' readings that abstain 0.048
- heldout_sentences: presence new_text: share of 'present' readings that abstain 0.217
- heldout_sentences: presence new_text: share of true 'present' readings that abstain 0.182
- heldout_sentences: presence match: present read present [pooled midpoint (comparison)] 0.826
- heldout_sentences: presence value: present read present 0.818
- heldout_sentences: presence value: share of 'present' readings that abstain 0.444
- heldout_sentences: presence value: share of true 'present' readings that abstain 0.444
- heldout_sentences: presence value: present read present [pooled midpoint (comparison)] 0.667
- heldout_sentences: presence widget: present read present 0.500
- heldout_sentences: presence widget: present read present [pooled midpoint (comparison)] 0.500
- new_identities: FULL 0.665
- new_identities: presence unit: share of 'present' readings that abstain 0.060
- new_identities: presence unit: share of true 'present' readings that abstain 0.060
- new_identities: presence match: share of 'present' readings that abstain 0.120
- new_identities: presence match: share of true 'present' readings that abstain 0.117
- new_identities: structure (depth, negation) 0.835
- new_identities: predicate (surface lemma) 0.835
- new_identities: event type (synonym table) 0.835
- new_identities: occupancy: known filler 0.821
- new_identities: role match 0.752
- new_identities: head match 0.752
- new_identities: occupancy: unknown filler 0.763
- new_identities: heads FULL (model) 0.665
- new_identities: heads FULL (lexical order baseline) 0.000
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.268
- new_identities: FULL [depth given] 0.665
- new_identities: FULL [depth and negation given] 0.665
- new_identities: FULL [pooled midpoint (comparison)] 0.547
- new_identities: role match [pooled midpoint (comparison)] 0.675
- new_identities: role position [pooled midpoint (comparison)] 0.887
- new_identities: role new_text [pooled midpoint (comparison)] 0.875
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.547
- new_identities: presence unit: present read present [pooled midpoint (comparison)] 0.841
- new_identities: presence match: present read present [pooled midpoint (comparison)] 0.842
- new_identities: presence value: present read present [pooled midpoint (comparison)] 0.895
- new_identities: presence new_text: share of 'present' readings that abstain 0.292
- new_identities: presence new_text: share of true 'present' readings that abstain 0.276
- new_identities: presence new_text: present read present [pooled midpoint (comparison)] 0.883
- new_identities: presence ordinal: present read present 0.878
- new_identities: presence ordinal: share of 'present' readings that abstain 0.108
- new_identities: presence ordinal: share of true 'present' readings that abstain 0.108
- new_identities: presence match: absent read absent 0.888
- new_identities: presence format: present read present 0.579
- new_identities: presence widget: present read present 0.826
- new_identities: presence widget: share of 'present' readings that abstain 0.789
- new_identities: presence widget: share of true 'present' readings that abstain 0.789
- new_identities: presence ordinal: present read present [pooled midpoint (comparison)] 0.877
- new_identities: presence match: absent read absent [pooled midpoint (comparison)] 0.882
- new_identities: presence format: present read present [pooled midpoint (comparison)] 0.500
- new_identities: presence widget: present read present [pooled midpoint (comparison)] 0.826
- new_identities: presence position: share of 'present' readings that abstain 0.112
- new_identities: presence position: share of true 'present' readings that abstain 0.112
- new_identities: presence match: share of FALSE 'present' readings that abstain 0.200
- new_identities: presence new_text: share of FALSE 'present' readings that abstain 0.800
- new_identities: presence value: share of 'present' readings that abstain 0.250
- new_identities: presence value: share of true 'present' readings that abstain 0.250
- new_identities: presence format: share of 'present' readings that abstain 0.455
- new_identities: presence format: share of true 'present' readings that abstain 0.455
- train (sample): FULL 0.787
- train (sample): presence match: share of 'present' readings that abstain 0.110
- train (sample): presence match: share of true 'present' readings that abstain 0.114
- train (sample): presence format: present read present 0.891
- train (sample): structure (depth, negation) 0.880
- train (sample): predicate (surface lemma) 0.880
- train (sample): event type (synonym table) 0.880
- train (sample): occupancy: known filler 0.852
- train (sample): heads FULL (model) 0.793
- train (sample): heads FULL (lexical order baseline) 0.127
- train (sample): FULL [depth given] 0.787
- train (sample): FULL [depth and negation given] 0.787
- train (sample): presence unit: share of 'present' readings that abstain 0.023
- train (sample): presence unit: share of true 'present' readings that abstain 0.023
- train (sample): presence ordinal: share of 'present' readings that abstain 0.035
- train (sample): presence ordinal: share of true 'present' readings that abstain 0.035
- train (sample): presence position: share of 'present' readings that abstain 0.111
- train (sample): presence position: share of true 'present' readings that abstain 0.111
- train (sample): presence new_text: share of 'present' readings that abstain 0.200
- train (sample): presence new_text: share of true 'present' readings that abstain 0.200
- train (sample): presence format: share of 'present' readings that abstain 0.195
- train (sample): presence format: share of true 'present' readings that abstain 0.195
- train (sample): presence value: share of 'present' readings that abstain 0.346
- train (sample): presence value: share of true 'present' readings that abstain 0.346
- train (sample): presence match: share of FALSE 'present' readings that abstain 0.000
- train (sample): presence widget: share of 'present' readings that abstain 0.000
- train (sample): presence widget: share of true 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_formulations: `now type MATCH POS` FULL 0.000 (n 3)
- heldout_formulations: `now insert MATCH POS` FULL 0.000 (n 3)
- heldout_formulations: `i need you to select POS to MATCH` FULL 0.000 (n 3)
- new_identities: `insert MATCH POS .` FULL 0.000 (n 3)
- new_identities: `lets insert MATCH POS of the ORD UNIT` FULL 0.000 (n 3)
- new_identities: `now select from MATCH POS` FULL 0.000 (n 3)
- new_identities: `now delete UNIT POS MATCH` FULL 0.000 (n 3)
- new_identities: `okay so add MATCH POS of the ORD UNIT` FULL 0.000 (n 3)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role unit | role ordinal | role match | role format | role value | role position | role new_text | role widget |
|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.714±0.013 | 0.714±0.013 | 0.938±0.007 | 0.910±0.018 | 0.905±0.020 | 0.985±0.004 | 0.989±0.009 | 0.936±0.010 | 0.905±0.011 | 0.999±0.002 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.622±0.017 | 0.622±0.017 | 0.808±0.006 | 0.938±0.015 | 0.869±0.017 | 0.979±0.004 | 0.988±0.008 | 0.894±0.011 | 0.890±0.021 | 1.000±0.000 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.761±0.005 | 0.761±0.005 | 1.000±0.000 | 1.000±0.000 | 0.766±0.006 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.764±0.004 | 0.993±0.002 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | unit | product: fitted | 0.970±0.011 | 1.000±0.000 | 0.985±0.005 | 0.027±0.007 (— / 0.027±0.007) |
| heldout_formulations | unit | comparison: pooled midpoint | 0.817±0.006 | 1.000±0.000 | 0.908±0.003 |  |
| heldout_formulations | ordinal | product: fitted | 0.819±0.040 | 1.000±0.000 | 0.910±0.020 | 0.070±0.042 (— / 0.070±0.042) |
| heldout_formulations | ordinal | comparison: pooled midpoint | 0.901±0.032 | 1.000±0.000 | 0.951±0.016 |  |
| heldout_formulations | match | product: fitted | 0.845±0.058 | 0.978±0.004 | 0.911±0.028 | 0.232±0.041 (0.067±0.133 / 0.239±0.044) |
| heldout_formulations | match | comparison: pooled midpoint | 0.788±0.058 | 0.980±0.000 | 0.884±0.029 |  |
| heldout_formulations | format | product: fitted | 0.918±0.034 | 1.000±0.000 | 0.959±0.017 | 0.117±0.063 (— / 0.117±0.063) |
| heldout_formulations | format | comparison: pooled midpoint | 0.873±0.034 | 1.000±0.000 | 0.936±0.017 |  |
| heldout_formulations | value | product: fitted | 0.913±0.129 | 1.000±0.000 | 0.957±0.065 | 0.873±0.127 (— / 0.873±0.127) |
| heldout_formulations | value | comparison: pooled midpoint | 0.910±0.092 | 1.000±0.000 | 0.955±0.046 |  |
| heldout_formulations | position | product: fitted | 0.963±0.032 | 1.000±0.000 | 0.982±0.016 | 0.064±0.021 (— / 0.064±0.021) |
| heldout_formulations | position | comparison: pooled midpoint | 0.975±0.014 | 1.000±0.000 | 0.988±0.007 |  |
| heldout_formulations | new_text | product: fitted | 0.872±0.029 | 0.948±0.018 | 0.910±0.019 | 0.433±0.072 (0.373±0.181 / 0.444±0.086) |
| heldout_formulations | new_text | comparison: pooled midpoint | 0.861±0.076 | 0.957±0.015 | 0.909±0.036 |  |
| heldout_formulations | widget | product: fitted | 0.960±0.080 | 1.000±0.000 | 0.980±0.040 | 0.390±0.269 (— / 0.390±0.269) |
| heldout_formulations | widget | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | unit | product: fitted | 0.976±0.007 | 1.000±0.000 | 0.988±0.004 | 0.024±0.016 (— / 0.024±0.016) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.904±0.017 | 1.000±0.000 | 0.952±0.009 |  |
| heldout_sentences | ordinal | product: fitted | 0.965±0.015 | 1.000±0.000 | 0.982±0.007 | 0.057±0.038 (— / 0.057±0.038) |
| heldout_sentences | ordinal | comparison: pooled midpoint | 0.980±0.012 | 1.000±0.000 | 0.990±0.006 |  |
| heldout_sentences | match | product: fitted | 0.892±0.063 | 0.997±0.005 | 0.945±0.030 | 0.101±0.041 (1.000 / 0.094±0.034) |
| heldout_sentences | match | comparison: pooled midpoint | 0.836±0.036 | 1.000±0.000 | 0.918±0.018 |  |
| heldout_sentences | format | product: fitted | 0.876±0.038 | 1.000±0.000 | 0.938±0.019 | 0.211±0.096 (— / 0.211±0.096) |
| heldout_sentences | format | comparison: pooled midpoint | 0.858±0.027 | 1.000±0.000 | 0.929±0.014 |  |
| heldout_sentences | value | product: fitted | 0.911±0.081 | 1.000±0.000 | 0.955±0.041 | 0.487±0.113 (— / 0.487±0.113) |
| heldout_sentences | value | comparison: pooled midpoint | 0.815±0.125 | 1.000±0.000 | 0.908±0.063 |  |
| heldout_sentences | position | product: fitted | 0.950±0.063 | 1.000±0.000 | 0.975±0.032 | 0.144±0.043 (— / 0.144±0.043) |
| heldout_sentences | position | comparison: pooled midpoint | 0.914±0.056 | 1.000±0.000 | 0.957±0.028 |  |
| heldout_sentences | new_text | product: fitted | 0.991±0.018 | 0.995±0.006 | 0.993±0.011 | 0.246±0.064 (1.000±0.000 / 0.232±0.062) |
| heldout_sentences | new_text | comparison: pooled midpoint | 0.981±0.023 | 0.994±0.007 | 0.988±0.013 |  |
| heldout_sentences | widget | product: fitted | 0.800±0.245 | 1.000±0.000 | 0.900±0.122 | 0.700±0.245 (— / 0.700±0.245) |
| heldout_sentences | widget | comparison: pooled midpoint | 0.800±0.245 | 1.000±0.000 | 0.900±0.122 |  |
| new_identities | unit | product: fitted | 0.938±0.040 | 1.000±0.000 | 0.969±0.020 | 0.052±0.019 (— / 0.052±0.019) |
| new_identities | unit | comparison: pooled midpoint | 0.849±0.015 | 1.000±0.000 | 0.924±0.007 |  |
| new_identities | ordinal | product: fitted | 0.831±0.032 | 1.000±0.000 | 0.915±0.016 | 0.045±0.037 (— / 0.045±0.037) |
| new_identities | ordinal | comparison: pooled midpoint | 0.872±0.018 | 1.000±0.000 | 0.936±0.009 |  |
| new_identities | match | product: fitted | 0.930±0.024 | 0.899±0.007 | 0.914±0.013 | 0.123±0.008 (0.084±0.076 / 0.125±0.009) |
| new_identities | match | comparison: pooled midpoint | 0.846±0.013 | 0.894±0.010 | 0.870±0.010 |  |
| new_identities | format | product: fitted | 0.621±0.091 | 1.000±0.000 | 0.811±0.045 | 0.445±0.095 (— / 0.445±0.095) |
| new_identities | format | comparison: pooled midpoint | 0.554±0.049 | 1.000±0.000 | 0.777±0.025 |  |
| new_identities | value | product: fitted | 0.945±0.055 | 1.000±0.000 | 0.972±0.028 | 0.254±0.053 (— / 0.254±0.053) |
| new_identities | value | comparison: pooled midpoint | 0.952±0.044 | 1.000±0.000 | 0.976±0.022 |  |
| new_identities | position | product: fitted | 0.937±0.055 | 1.000±0.000 | 0.969±0.028 | 0.095±0.028 (— / 0.095±0.028) |
| new_identities | position | comparison: pooled midpoint | 0.937±0.011 | 1.000±0.000 | 0.968±0.006 |  |
| new_identities | new_text | product: fitted | 0.917±0.009 | 0.982±0.008 | 0.949±0.007 | 0.306±0.016 (0.627±0.336 / 0.298±0.016) |
| new_identities | new_text | comparison: pooled midpoint | 0.890±0.028 | 0.985±0.005 | 0.937±0.016 |  |
| new_identities | widget | product: fitted | 0.862±0.069 | 1.000±0.000 | 0.931±0.034 | 0.606±0.134 (— / 0.606±0.134) |
| new_identities | widget | comparison: pooled midpoint | 0.859±0.077 | 1.000±0.000 | 0.929±0.038 |  |
| train (sample) | unit | product: fitted | 0.983±0.011 | 1.000±0.000 | 0.992±0.006 | 0.039±0.012 (— / 0.039±0.012) |
| train (sample) | ordinal | product: fitted | 0.905±0.018 | 1.000±0.000 | 0.953±0.009 | 0.087±0.027 (— / 0.087±0.027) |
| train (sample) | match | product: fitted | 0.943±0.019 | 0.981±0.004 | 0.962±0.010 | 0.130±0.041 (0.040±0.080 / 0.133±0.040) |
| train (sample) | format | product: fitted | 0.911±0.057 | 1.000±0.000 | 0.955±0.028 | 0.163±0.052 (— / 0.163±0.052) |
| train (sample) | value | product: fitted | 0.946±0.042 | 1.000±0.000 | 0.973±0.021 | 0.300±0.092 (— / 0.300±0.092) |
| train (sample) | position | product: fitted | 0.972±0.032 | 1.000±0.000 | 0.986±0.016 | 0.113±0.041 (— / 0.113±0.041) |
| train (sample) | new_text | product: fitted | 0.921±0.030 | 1.000±0.000 | 0.961±0.015 | 0.188±0.016 (— / 0.188±0.016) |
| train (sample) | widget | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
