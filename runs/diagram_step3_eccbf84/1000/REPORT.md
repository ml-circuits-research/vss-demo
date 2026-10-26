# REPORT — world `diagram`, legend sha256:1a43ffc61bd5… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
1800 annotated sentences from 3 files; provenance: {'generator': 1800}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/1000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 222 sentences
- heldout_formulations: 178 sentences
- heldout_sentences: 82 sentences
- new_identities: 400 sentences
- train: 918 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['250', '35', '45', '90', 'analytics', 'broker', 'crawler', 'dashboard', 'gamma_ray', 'indexer', 'ingest', 'irina', 'loyalty', 'notifications', 'payroll', 'recommendations', 'registry', 'returns', 'routing', 'theta', 'tracking', 'vault', 'victor', 'zeta']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
14834 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2, 3, 4], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit eccbf84. Memory curve: runs/1000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 0.790 [rule: fit; pooled midpoint 1.728 (comparison)] (present 2.109, n 576 / absent 1.346, n 46)
- attr_presence:object: threshold 0.363 [rule: fit; pooled midpoint 0.453 (comparison)] (present 0.645, n 242 / absent 0.260, n 334)
- det_presence:object: threshold 0.526 [rule: fit; pooled midpoint 0.618 (comparison)] (present 0.981, n 234 / absent 0.255, n 342)
- presence:color: threshold 0.254 [rule: fit; pooled midpoint 0.379 (comparison)] (present 0.616, n 26 / absent 0.142, n 596)
- presence:size: threshold 0.354 [rule: fit; pooled midpoint 0.316 (comparison)] (present 0.461, n 46 / absent 0.170, n 576)
- presence:style: threshold 0.102 [rule: fit; pooled midpoint 0.016 (comparison)] (present 0.005, n 12 / absent 0.027, n 610)
- presence:text: threshold 0.356 [rule: fit; pooled midpoint 0.370 (comparison)] (present 0.497, n 86 / absent 0.242, n 536)
- presence:relation: threshold 0.266 [rule: fit; pooled midpoint 0.380 (comparison)] (present 0.712, n 74 / absent 0.047, n 548)
- presence:landmark: threshold 0.492 [rule: fit; pooled midpoint 0.607 (comparison)] (present 0.996, n 74 / absent 0.218, n 548)
- presence:region: threshold 0.559 [rule: fit; pooled midpoint 0.606 (comparison)] (present 1.048, n 57 / absent 0.164, n 565)
- presence:anchor: threshold 0.308 [rule: fit; pooled midpoint 0.352 (comparison)] (present 0.646, n 29 / absent 0.059, n 593)
- presence:fraction: threshold 0.408 [rule: fit; pooled midpoint 0.369 (comparison)] (present 0.605, n 22 / absent 0.133, n 600)
- presence:amount: threshold 0.163 [rule: fit; pooled midpoint 0.216 (comparison)] (present 0.380, n 35 / absent 0.053, n 587)
- presence:unit: threshold 0.298 [rule: fit; pooled midpoint 0.318 (comparison)] (present 0.476, n 35 / absent 0.161, n 587)
- presence:direction: threshold 0.226 [rule: fit; pooled midpoint 0.253 (comparison)] (present 0.417, n 23 / absent 0.090, n 599)
- presence:axis: threshold 0.194 [rule: fit; pooled midpoint 0.220 (comparison)] (present 0.359, n 19 / absent 0.082, n 603)
- presence:layout: threshold 0.335 [rule: fit; pooled midpoint 0.398 (comparison)] (present 0.770, n 6 / absent 0.027, n 616)
- presence:pairing: threshold 0.130 [rule: fit; pooled midpoint 0.178 (comparison)] (present 0.335, n 15 / absent 0.022, n 607)
- presence:source: threshold 0.362 [rule: fit; pooled midpoint 0.418 (comparison)] (present 0.689, n 77 / absent 0.147, n 545)
- presence:target: threshold 0.506 [rule: fit; pooled midpoint 0.510 (comparison)] (present 0.819, n 62 / absent 0.200, n 560)
- presence:quantity: threshold 0.037 [rule: fit; pooled midpoint 0.046 (comparison)] (present 0.113, n 23 / absent -0.021, n 599)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.005, color 0.083, size 0.143, style 0.200, text 0.013, relation 0.167, landmark 0.006, region 0.111, anchor 0.250, fraction 0.333, amount 0.043, unit 0.500, direction 0.167, axis 0.500, layout 0.143, pairing 0.500, source 0.006, target 0.006, quantity 0.043, predicate 0.019

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 178 of 178)
| axis | accuracy |
|---|---|
| FULL | 0.498±0.029 |
| FULL [depth given] | 0.498±0.029 |
| FULL [depth and negation given] | 0.500±0.031 |
| FULL [presence not decided] | 0.392±0.013 |
| FULL [pooled midpoint (comparison)] | 0.294±0.019 |
| structure (depth, negation) | 0.889±0.019 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.902±0.011 |
| event type (synonym table) | 0.912±0.017 |
| role object | 0.679±0.021 |
| head object | 0.720±0.020 |
| lexical order head object | 0.809±0.000 |
| lexical bag head object | 0.899±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.808±0.040 |
| occupancy: known filler | 0.856±0.011 |
| role color | 0.965±0.022 |
| head color | 0.965±0.022 |
| lexical order head color | 1.000±0.000 |
| lexical bag head color | 1.000±0.000 |
| occupancy: not given | 0.991±0.002 |
| role size | 0.963±0.014 |
| head size | 0.963±0.014 |
| lexical order head size | 0.933±0.000 |
| lexical bag head size | 0.938±0.000 |
| role style | 0.955±0.020 |
| head style | 0.955±0.020 |
| lexical order head style | 0.966±0.000 |
| lexical bag head style | 0.966±0.000 |
| role text | 0.948±0.015 |
| head text | 0.948±0.015 |
| lexical order head text | 0.865±0.000 |
| lexical bag head text | 0.876±0.000 |
| role relation | 0.983±0.004 |
| head relation | 0.983±0.004 |
| lexical order head relation | 0.882±0.000 |
| lexical bag head relation | 0.882±0.000 |
| role landmark | 0.940±0.011 |
| head landmark | 0.952±0.011 |
| lexical order head landmark | 0.882±0.000 |
| lexical bag head landmark | 0.871±0.000 |
| role region | 0.998±0.003 |
| head region | 0.998±0.003 |
| lexical order head region | 0.927±0.000 |
| lexical bag head region | 0.927±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.949±0.000 |
| lexical bag head anchor | 0.955±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.949±0.000 |
| lexical bag head fraction | 0.949±0.000 |
| role amount | 0.985±0.012 |
| head amount | 0.985±0.012 |
| lexical order head amount | 0.972±0.000 |
| lexical bag head amount | 0.972±0.000 |
| role unit | 0.993±0.006 |
| head unit | 0.993±0.006 |
| lexical order head unit | 0.972±0.000 |
| lexical bag head unit | 0.972±0.000 |
| role direction | 0.989±0.004 |
| head direction | 0.989±0.004 |
| lexical order head direction | 0.983±0.000 |
| lexical bag head direction | 0.983±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 1.000±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 0.994±0.000 |
| lexical bag head pairing | 0.994±0.000 |
| role source | 0.849±0.006 |
| head source | 0.851±0.008 |
| lexical order head source | 0.831±0.000 |
| lexical bag head source | 0.831±0.000 |
| role target | 0.912±0.019 |
| head target | 0.920±0.022 |
| lexical order head target | 0.837±0.000 |
| lexical bag head target | 0.837±0.000 |
| role quantity | 0.963±0.013 |
| head quantity | 0.963±0.013 |
| lexical order head quantity | 0.910±0.000 |
| lexical bag head quantity | 0.910±0.000 |
| heads FULL (model) | 0.553±0.035 |
| heads FULL (lexical order baseline) | 0.292±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.287±0.000 |
| role object [presence not decided] | 0.779±0.013 |
| role color [presence not decided] | 0.736±0.000 |
| role size [presence not decided] | 0.882±0.000 |
| role style [presence not decided] | 0.899±0.000 |
| role text [presence not decided] | 0.926±0.011 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.836±0.018 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 0.974±0.013 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 0.990±0.002 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.828±0.009 |
| role target [presence not decided] | 0.854±0.022 |
| role quantity [presence not decided] | 0.974±0.013 |
| heads FULL (model) [presence not decided] | 0.417±0.013 |
| role object [pooled midpoint (comparison)] | 0.398±0.031 |
| role color [pooled midpoint (comparison)] | 0.990±0.010 |
| role size [pooled midpoint (comparison)] | 0.964±0.014 |
| role style [pooled midpoint (comparison)] | 0.942±0.017 |
| role text [pooled midpoint (comparison)] | 0.925±0.008 |
| role relation [pooled midpoint (comparison)] | 0.975±0.006 |
| role landmark [pooled midpoint (comparison)] | 0.942±0.008 |
| role region [pooled midpoint (comparison)] | 0.992±0.006 |
| role anchor [pooled midpoint (comparison)] | 1.000±0.000 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.983±0.013 |
| role unit [pooled midpoint (comparison)] | 0.991±0.006 |
| role direction [pooled midpoint (comparison)] | 0.993±0.002 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 0.999±0.002 |
| role source [pooled midpoint (comparison)] | 0.862±0.010 |
| role target [pooled midpoint (comparison)] | 0.920±0.017 |
| role quantity [pooled midpoint (comparison)] | 0.956±0.014 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.360±0.021 |
| presence object: absent read absent | 0.770±0.024 |
| presence color: absent read absent | 0.962±0.023 |
| presence size: absent read absent | 0.976±0.011 |
| presence style: absent read absent | 0.955±0.023 |
| presence text: absent read absent | 0.966±0.013 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.997±0.006 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 0.993±0.009 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: present read present | 0.700±0.400 |
| presence direction: share of 'present' readings that abstain | nan±nan |
| presence direction: share of true 'present' readings that abstain | nan±nan |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.987±0.007 |
| presence target: absent read absent | 0.997±0.004 |
| presence quantity: absent read absent | 0.995±0.008 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.880±0.098 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.987±0.012 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.970±0.017 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.939±0.021 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.962±0.008 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.997±0.004 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.991±0.012 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.991±0.008 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.993±0.007 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.995±0.010 |
| presence object: present read present | 0.958±0.009 |
| presence object: share of 'present' readings that abstain | 0.036±0.016 |
| presence object: share of true 'present' readings that abstain | 0.037±0.017 |
| presence relation: present read present | 0.901±0.028 |
| presence relation: share of 'present' readings that abstain | 0.154±0.050 |
| presence relation: share of true 'present' readings that abstain | 0.154±0.050 |
| presence landmark: present read present | 0.712±0.112 |
| presence landmark: share of 'present' readings that abstain | 0.557±0.060 |
| presence landmark: share of true 'present' readings that abstain | 0.548±0.048 |
| presence direction: absent read absent | 1.000±0.000 |
| presence object: present read present [pooled midpoint (comparison)] | 0.737±0.031 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.915±0.085 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.792±0.084 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present | 0.917±0.060 |
| presence text: share of 'present' readings that abstain | 0.270±0.026 |
| presence text: share of true 'present' readings that abstain | 0.214±0.065 |
| presence source: present read present | 0.913±0.045 |
| presence source: share of 'present' readings that abstain | 0.899±0.063 |
| presence source: share of true 'present' readings that abstain | 0.900±0.072 |
| presence target: present read present | 0.945±0.017 |
| presence target: share of 'present' readings that abstain | 0.721±0.096 |
| presence target: share of true 'present' readings that abstain | 0.717±0.098 |
| presence source: present read present [pooled midpoint (comparison)] | 0.932±0.036 |
| presence target: present read present [pooled midpoint (comparison)] | 0.979±0.017 |
| presence color: share of 'present' readings that abstain | 0.969±0.062 |
| presence color: share of FALSE 'present' readings that abstain | 0.969±0.062 |
| presence size: present read present | 0.750±0.139 |
| presence size: present read present [pooled midpoint (comparison)] | 0.811±0.065 |
| presence quantity: present read present | 0.709±0.141 |
| presence quantity: share of 'present' readings that abstain | 0.486±0.198 |
| presence quantity: share of true 'present' readings that abstain | 0.445±0.219 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.684±0.152 |
| presence text: present read present [pooled midpoint (comparison)] | 0.960±0.053 |
| presence size: share of 'present' readings that abstain | 0.395±0.140 |
| presence size: share of FALSE 'present' readings that abstain | 0.800±0.179 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.133±0.163 |
| presence fraction: share of true 'present' readings that abstain | 0.133±0.163 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 0.969±0.038 |
| presence region: share of 'present' readings that abstain | 0.047±0.062 |
| presence region: share of true 'present' readings that abstain | 0.047±0.062 |
| presence region: present read present [pooled midpoint (comparison)] | 0.892±0.078 |
| presence size: share of true 'present' readings that abstain | 0.296±0.195 |
| presence amount: present read present | 0.720±0.204 |
| presence unit: present read present | 0.760±0.196 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.690±0.215 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.730±0.172 |
| presence object: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | nan±nan |
| presence amount: share of 'present' readings that abstain | 0.435±0.216 |
| presence amount: share of true 'present' readings that abstain | 0.397±0.244 |
| presence unit: share of 'present' readings that abstain | 0.280±0.142 |
| presence unit: share of true 'present' readings that abstain | 0.280±0.142 |
| presence style: share of 'present' readings that abstain | 1.000±0.000 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence style: present read present | 0.867±0.194 |
| presence style: share of true 'present' readings that abstain | 1.000±0.000 |
| presence style: present read present [pooled midpoint (comparison)] | 0.960±0.080 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence amount: share of FALSE 'present' readings that abstain | nan±nan |
| presence text: share of FALSE 'present' readings that abstain | 0.515±0.151 |

residual mean 0.463±0.009; status {'no-sense': 13, 'abstain': 148, 'ok': 17}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.904 | 0.205 / 0.089 | 0.94 | 0.073 | 0.034 / 0.022 |
| role object | 0.671 | 0.171 / 0.003 | 0.84 | 0.197 | 0.023 / 0.133 |
| roles (pooled) | 0.637 | 0.108 / 0.000 | 0.62 | 0.117 | 0.135 / 0.247 |
| role direction | 0.667 | 0.066 / 0.016 | 0.67 | 0.000 | 0.000 / 0.333 |
| role relation | 0.857 | 0.085 / 0.000 | 0.71 | 0.000 | 0.143 / 0.143 |
| role landmark | 0.667 | 0.031 / 0.000 | 0.38 | 0.095 | 0.381 / 0.238 |
| role text | 0.875 | 0.078 / 0.017 | 0.62 | 0.000 | 0.250 / 0.125 |
| role source | 0.167 | 0.015 / -0.010 | 0.07 | 0.067 | 0.167 / 0.767 |
| role target | 0.345 | 0.033 / 0.000 | 0.24 | 0.172 | 0.276 / 0.483 |
| role size | 0.500 | 0.025 / 0.000 | 0.17 | 0.000 | 0.333 / 0.500 |
| role quantity | 0.438 | 0.023 / 0.000 | 0.19 | 0.062 | 0.312 / 0.500 |
| role anchor | 1.000 | 0.134 / 0.091 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.091 / 0.062 | 0.89 | 0.000 | 0.111 / 0.000 |
| role region | 0.923 | 0.144 / 0.073 | 0.92 | 0.000 | 0.000 / 0.077 |
| role amount | 0.800 | 0.042 / 0.013 | 0.20 | 0.000 | 0.600 / 0.200 |
| role unit | 0.600 | 0.049 / 0.000 | 0.40 | 0.000 | 0.200 / 0.400 |
| role pairing | 1.000 | 0.146 / 0.146 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.500 | 0.012 / 0.000 | 0.00 | 0.000 | 0.500 / 0.500 |

### heldout_formulations — experiment candidates (n = 178 of 178)
| axis | accuracy |
|---|---|
| FULL | 0.118±0.022 |
| FULL [depth given] | 0.118±0.022 |
| FULL [depth and negation given] | 0.118±0.022 |
| FULL [presence not decided] | 0.000±0.000 |
| FULL [pooled midpoint (comparison)] | 0.046±0.021 |
| structure (depth, negation) | 0.880±0.023 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.896±0.017 |
| event type (synonym table) | 0.906±0.021 |
| role object | 0.607±0.023 |
| head object | 0.710±0.019 |
| lexical order head object | 0.809±0.000 |
| lexical bag head object | 0.899±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.749±0.032 |
| occupancy: known filler | 0.870±0.018 |
| role color | 0.882±0.097 |
| head color | 0.882±0.097 |
| lexical order head color | 1.000±0.000 |
| lexical bag head color | 1.000±0.000 |
| occupancy: not given | 0.896±0.013 |
| role size | 0.882±0.044 |
| head size | 0.882±0.044 |
| lexical order head size | 0.933±0.000 |
| lexical bag head size | 0.938±0.000 |
| role style | 0.674±0.154 |
| head style | 0.674±0.154 |
| lexical order head style | 0.966±0.000 |
| lexical bag head style | 0.966±0.000 |
| role text | 0.719±0.038 |
| head text | 0.719±0.038 |
| lexical order head text | 0.865±0.000 |
| lexical bag head text | 0.876±0.000 |
| role relation | 0.926±0.030 |
| head relation | 0.926±0.030 |
| lexical order head relation | 0.882±0.000 |
| lexical bag head relation | 0.882±0.000 |
| role landmark | 0.872±0.016 |
| head landmark | 0.878±0.016 |
| lexical order head landmark | 0.882±0.000 |
| lexical bag head landmark | 0.871±0.000 |
| role region | 0.980±0.008 |
| head region | 0.980±0.008 |
| lexical order head region | 0.927±0.000 |
| lexical bag head region | 0.927±0.000 |
| role anchor | 0.961±0.012 |
| head anchor | 0.961±0.012 |
| lexical order head anchor | 0.949±0.000 |
| lexical bag head anchor | 0.955±0.000 |
| role fraction | 0.976±0.016 |
| head fraction | 0.976±0.016 |
| lexical order head fraction | 0.949±0.000 |
| lexical bag head fraction | 0.949±0.000 |
| role amount | 0.919±0.034 |
| head amount | 0.919±0.034 |
| lexical order head amount | 0.972±0.000 |
| lexical bag head amount | 0.972±0.000 |
| role unit | 0.915±0.041 |
| head unit | 0.915±0.041 |
| lexical order head unit | 0.972±0.000 |
| lexical bag head unit | 0.972±0.000 |
| role direction | 0.878±0.061 |
| head direction | 0.878±0.061 |
| lexical order head direction | 0.983±0.000 |
| lexical bag head direction | 0.983±0.000 |
| role axis | 0.883±0.085 |
| head axis | 0.883±0.085 |
| lexical order head axis | 1.000±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 0.994±0.005 |
| head layout | 0.994±0.005 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.938±0.021 |
| head pairing | 0.938±0.021 |
| lexical order head pairing | 0.994±0.000 |
| lexical bag head pairing | 0.994±0.000 |
| role source | 0.717±0.045 |
| head source | 0.717±0.045 |
| lexical order head source | 0.831±0.000 |
| lexical bag head source | 0.831±0.000 |
| role target | 0.846±0.020 |
| head target | 0.848±0.018 |
| lexical order head target | 0.837±0.000 |
| lexical bag head target | 0.837±0.000 |
| role quantity | 0.739±0.104 |
| head quantity | 0.739±0.104 |
| lexical order head quantity | 0.910±0.000 |
| lexical bag head quantity | 0.910±0.000 |
| heads FULL (model) | 0.133±0.021 |
| heads FULL (lexical order baseline) | 0.292±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.287±0.000 |
| role object [presence not decided] | 0.681±0.018 |
| role color [presence not decided] | 0.009±0.003 |
| role size [presence not decided] | 0.073±0.005 |
| role style [presence not decided] | 0.027±0.008 |
| role text [presence not decided] | 0.125±0.008 |
| role relation [presence not decided] | 0.103±0.008 |
| role landmark [presence not decided] | 0.022±0.005 |
| role region [presence not decided] | 0.082±0.003 |
| role anchor [presence not decided] | 0.060±0.003 |
| role fraction [presence not decided] | 0.057±0.007 |
| role amount [presence not decided] | 0.033±0.004 |
| role unit [presence not decided] | 0.037±0.003 |
| role direction [presence not decided] | 0.026±0.003 |
| role axis [presence not decided] | 0.009±0.003 |
| role layout [presence not decided] | 0.009±0.003 |
| role pairing [presence not decided] | 0.015±0.003 |
| role source [presence not decided] | 0.009±0.003 |
| role target [presence not decided] | 0.056±0.010 |
| role quantity [presence not decided] | 0.074±0.009 |
| heads FULL (model) [presence not decided] | 0.000±0.000 |
| role object [pooled midpoint (comparison)] | 0.376±0.032 |
| role color [pooled midpoint (comparison)] | 0.976±0.020 |
| role size [pooled midpoint (comparison)] | 0.880±0.053 |
| role style [pooled midpoint (comparison)] | 0.631±0.084 |
| role text [pooled midpoint (comparison)] | 0.737±0.044 |
| role relation [pooled midpoint (comparison)] | 0.949±0.011 |
| role landmark [pooled midpoint (comparison)] | 0.885±0.010 |
| role region [pooled midpoint (comparison)] | 0.979±0.008 |
| role anchor [pooled midpoint (comparison)] | 0.971±0.012 |
| role fraction [pooled midpoint (comparison)] | 0.970±0.020 |
| role amount [pooled midpoint (comparison)] | 0.921±0.036 |
| role unit [pooled midpoint (comparison)] | 0.919±0.042 |
| role direction [pooled midpoint (comparison)] | 0.838±0.030 |
| role axis [pooled midpoint (comparison)] | 0.945±0.026 |
| role layout [pooled midpoint (comparison)] | 0.996±0.004 |
| role pairing [pooled midpoint (comparison)] | 0.978±0.015 |
| role source [pooled midpoint (comparison)] | 0.779±0.013 |
| role target [pooled midpoint (comparison)] | 0.852±0.021 |
| role quantity [pooled midpoint (comparison)] | 0.826±0.038 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.051±0.020 |
| presence object: absent read absent | 0.770±0.024 |
| presence color: absent read absent | 0.871±0.106 |
| presence size: absent read absent | 0.884±0.047 |
| presence style: absent read absent | 0.647±0.189 |
| presence text: absent read absent | 0.694±0.050 |
| presence relation: absent read absent | 0.944±0.039 |
| presence landmark: absent read absent | 0.956±0.014 |
| presence region: absent read absent | 0.979±0.008 |
| presence anchor: absent read absent | 0.954±0.015 |
| presence fraction: absent read absent | 0.975±0.019 |
| presence amount: absent read absent | 0.921±0.034 |
| presence unit: absent read absent | 0.911±0.045 |
| presence direction: present read present | 0.700±0.400 |
| presence direction: share of 'present' readings that abstain | 0.988±0.025 |
| presence direction: share of true 'present' readings that abstain | nan±nan |
| presence axis: absent read absent | 0.871±0.093 |
| presence layout: absent read absent | 0.994±0.006 |
| presence pairing: absent read absent | 0.931±0.025 |
| presence source: absent read absent | 0.847±0.059 |
| presence target: absent read absent | 0.947±0.013 |
| presence quantity: absent read absent | 0.729±0.122 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.840±0.080 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.967±0.028 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.845±0.079 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.512±0.115 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.699±0.059 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.980±0.018 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.968±0.012 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.979±0.012 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.957±0.018 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.958±0.030 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.907±0.047 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.897±0.055 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 0.924±0.037 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.994±0.006 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.971±0.020 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.900±0.020 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.945±0.023 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.800±0.058 |
| presence object: present read present | 0.968±0.005 |
| presence object: share of 'present' readings that abstain | 0.065±0.021 |
| presence object: share of true 'present' readings that abstain | 0.065±0.021 |
| presence relation: present read present | 0.899±0.028 |
| presence relation: share of 'present' readings that abstain | 0.621±0.107 |
| presence relation: share of true 'present' readings that abstain | 0.475±0.096 |
| presence landmark: present read present | 0.878±0.050 |
| presence landmark: share of 'present' readings that abstain | 0.992±0.017 |
| presence landmark: share of true 'present' readings that abstain | 0.989±0.022 |
| presence direction: absent read absent | 0.877±0.068 |
| presence object: present read present [pooled midpoint (comparison)] | 0.780±0.037 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.784±0.039 |
| presence text: present read present | 0.917±0.060 |
| presence text: share of 'present' readings that abstain | 0.872±0.030 |
| presence text: share of true 'present' readings that abstain | 0.600±0.056 |
| presence pairing: share of 'present' readings that abstain | 0.848±0.076 |
| presence pairing: share of FALSE 'present' readings that abstain | 0.934±0.082 |
| presence source: present read present | 0.986±0.029 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.986±0.018 |
| presence target: share of 'present' readings that abstain | 0.983±0.014 |
| presence target: share of true 'present' readings that abstain | 0.979±0.017 |
| presence color: share of 'present' readings that abstain | 0.994±0.011 |
| presence color: share of FALSE 'present' readings that abstain | 0.994±0.011 |
| presence axis: share of 'present' readings that abstain | 0.921±0.053 |
| presence axis: share of FALSE 'present' readings that abstain | 0.921±0.053 |
| presence quantity: share of 'present' readings that abstain | 0.936±0.018 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.802±0.054 |
| presence unit: share of FALSE 'present' readings that abstain | 0.952±0.063 |
| presence size: present read present | 0.750±0.139 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.808±0.065 |
| presence style: share of 'present' readings that abstain | 0.996±0.008 |
| presence style: share of FALSE 'present' readings that abstain | 0.998±0.004 |
| presence quantity: present read present | 0.754±0.118 |
| presence quantity: share of true 'present' readings that abstain | 0.715±0.043 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.719±0.134 |
| presence text: present read present [pooled midpoint (comparison)] | 0.960±0.053 |
| presence size: share of 'present' readings that abstain | 0.872±0.063 |
| presence size: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.500±0.093 |
| presence anchor: share of true 'present' readings that abstain | 0.156±0.054 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.558±0.196 |
| presence fraction: share of true 'present' readings that abstain | 0.400±0.206 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 0.969±0.038 |
| presence region: share of 'present' readings that abstain | 0.302±0.065 |
| presence region: share of true 'present' readings that abstain | 0.144±0.034 |
| presence region: present read present [pooled midpoint (comparison)] | 0.892±0.078 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: share of true 'present' readings that abstain | 0.678±0.091 |
| presence amount: present read present | 0.720±0.204 |
| presence unit: present read present | 0.760±0.196 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.710±0.191 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.760±0.159 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.931±0.084 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.921±0.056 |
| presence object: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | nan±nan |
| presence source: present read present [pooled midpoint (comparison)] | 0.984±0.032 |
| presence target: present read present [pooled midpoint (comparison)] | 0.992±0.017 |
| presence amount: share of 'present' readings that abstain | 0.950±0.044 |
| presence amount: share of true 'present' readings that abstain | 0.843±0.135 |
| presence unit: share of true 'present' readings that abstain | 0.360±0.033 |
| presence amount: share of FALSE 'present' readings that abstain | 0.990±0.019 |
| presence style: present read present | 0.867±0.194 |
| presence anchor: share of FALSE 'present' readings that abstain | 0.978±0.044 |
| presence fraction: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: share of true 'present' readings that abstain | 0.960±0.080 |
| presence style: present read present [pooled midpoint (comparison)] | 0.960±0.080 |
| presence region: share of FALSE 'present' readings that abstain | 0.950±0.100 |
| presence layout: share of 'present' readings that abstain | nan±nan |
| presence layout: share of FALSE 'present' readings that abstain | nan±nan |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.496±0.010; status {'no-sense': 15, 'abstain': 151, 'ok': 12}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.893 | 0.205 / 0.089 | 0.94 | 0.084 | 0.034 / 0.022 |
| role object | 0.613 | 0.134 / 0.016 | 0.84 | 0.243 | 0.017 / 0.145 |
| roles (pooled) | 0.517 | 0.080 / 0.000 | 0.52 | 0.114 | 0.111 / 0.369 |
| role direction | 0.667 | 0.061 / 0.013 | 0.67 | 0.000 | 0.000 / 0.333 |
| role relation | 0.762 | 0.056 / 0.000 | 0.43 | 0.000 | 0.333 / 0.238 |
| role landmark | 0.095 | 0.013 / 0.000 | 0.00 | 0.000 | 0.095 / 0.905 |
| role text | 0.625 | 0.039 / 0.003 | 0.29 | 0.000 | 0.333 / 0.375 |
| role source | 0.000 | 0.005 / 0.001 | 0.00 | 0.000 | 0.000 / 1.000 |
| role target | 0.172 | 0.013 / 0.001 | 0.00 | 0.000 | 0.172 / 0.828 |
| role size | 0.500 | 0.017 / 0.000 | 0.08 | 0.000 | 0.417 / 0.500 |
| role quantity | 0.375 | 0.016 / 0.000 | 0.19 | 0.062 | 0.250 / 0.562 |
| role anchor | 1.000 | 0.100 / 0.051 | 0.89 | 0.000 | 0.111 / 0.000 |
| role fraction | 1.000 | 0.072 / 0.042 | 0.78 | 0.000 | 0.222 / 0.000 |
| role region | 0.923 | 0.103 / 0.047 | 0.77 | 0.000 | 0.154 / 0.077 |
| role amount | 0.600 | 0.030 / 0.007 | 0.20 | 0.000 | 0.400 / 0.400 |
| role unit | 0.600 | 0.041 / 0.000 | 0.40 | 0.000 | 0.200 / 0.400 |
| role pairing | 1.000 | 0.157 / 0.157 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.000 | 0.003 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |

### heldout_sentences — catalog candidates (n = 82 of 82)
| axis | accuracy |
|---|---|
| FULL | 0.629±0.032 |
| FULL [depth given] | 0.629±0.032 |
| FULL [depth and negation given] | 0.629±0.032 |
| FULL [pooled midpoint (comparison)] | 0.354±0.023 |
| presence object: present read present | 0.971±0.010 |
| presence object: share of 'present' readings that abstain | 0.036±0.014 |
| presence object: share of true 'present' readings that abstain | 0.033±0.014 |
| presence color: absent read absent | 0.973±0.015 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 0.965±0.014 |
| presence text: absent read absent | 0.997±0.006 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.033±0.067 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.997±0.006 |
| presence target: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 0.997±0.005 |
| structure (depth, negation) | 0.934±0.012 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.929±0.014 |
| event type (synonym table) | 0.934±0.012 |
| role object | 0.768±0.013 |
| head object | 0.841±0.015 |
| lexical order head object | 0.841±0.000 |
| lexical bag head object | 0.878±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.681±0.044 |
| occupancy: known filler | 0.838±0.022 |
| role color | 0.951±0.013 |
| head color | 0.951±0.013 |
| lexical order head color | 0.976±0.000 |
| lexical bag head color | 0.976±0.000 |
| occupancy: not given | 0.992±0.001 |
| role size | 0.993±0.010 |
| head size | 0.993±0.010 |
| lexical order head size | 0.939±0.000 |
| lexical bag head size | 0.963±0.000 |
| role style | 0.954±0.012 |
| head style | 0.954±0.012 |
| lexical order head style | 0.976±0.000 |
| lexical bag head style | 0.976±0.000 |
| role text | 0.954±0.009 |
| head text | 0.954±0.009 |
| lexical order head text | 0.793±0.000 |
| lexical bag head text | 0.866±0.000 |
| role relation | 0.995±0.006 |
| head relation | 0.995±0.006 |
| lexical order head relation | 0.939±0.000 |
| lexical bag head relation | 0.951±0.000 |
| role landmark | 0.985±0.005 |
| head landmark | 0.985±0.005 |
| lexical order head landmark | 0.939±0.000 |
| lexical bag head landmark | 0.951±0.000 |
| role region | 0.998±0.005 |
| head region | 0.998±0.005 |
| lexical order head region | 0.890±0.000 |
| lexical bag head region | 0.890±0.000 |
| role anchor | 0.990±0.005 |
| head anchor | 0.990±0.005 |
| lexical order head anchor | 0.927±0.000 |
| lexical bag head anchor | 0.927±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 1.000±0.000 |
| lexical bag head fraction | 1.000±0.000 |
| role amount | 0.995±0.006 |
| head amount | 0.995±0.006 |
| lexical order head amount | 0.976±0.000 |
| lexical bag head amount | 0.976±0.000 |
| role unit | 0.993±0.006 |
| head unit | 0.993±0.006 |
| lexical order head unit | 0.976±0.000 |
| lexical bag head unit | 0.976±0.000 |
| role direction | 0.998±0.005 |
| head direction | 0.998±0.005 |
| lexical order head direction | 0.951±0.000 |
| lexical bag head direction | 0.963±0.000 |
| role axis | 0.998±0.005 |
| head axis | 0.998±0.005 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.988±0.000 |
| role layout | 0.998±0.005 |
| head layout | 0.998±0.005 |
| lexical order head layout | 0.939±0.000 |
| lexical bag head layout | 0.939±0.000 |
| role pairing | 0.976±0.000 |
| head pairing | 0.976±0.000 |
| lexical order head pairing | 0.927±0.000 |
| lexical bag head pairing | 0.927±0.000 |
| role source | 0.868±0.009 |
| head source | 0.893±0.016 |
| lexical order head source | 0.866±0.000 |
| lexical bag head source | 0.866±0.000 |
| role target | 0.978±0.009 |
| head target | 0.978±0.009 |
| lexical order head target | 0.939±0.000 |
| lexical bag head target | 0.951±0.000 |
| role quantity | 0.993±0.006 |
| head quantity | 0.993±0.006 |
| lexical order head quantity | 0.963±0.000 |
| lexical bag head quantity | 0.963±0.000 |
| heads FULL (model) | 0.698±0.026 |
| heads FULL (lexical order baseline) | 0.146±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.256±0.000 |
| role object [pooled midpoint (comparison)] | 0.459±0.029 |
| role color [pooled midpoint (comparison)] | 0.963±0.008 |
| role size [pooled midpoint (comparison)] | 0.995±0.006 |
| role style [pooled midpoint (comparison)] | 0.954±0.014 |
| role text [pooled midpoint (comparison)] | 0.910±0.006 |
| role relation [pooled midpoint (comparison)] | 0.985±0.005 |
| role landmark [pooled midpoint (comparison)] | 0.985±0.005 |
| role region [pooled midpoint (comparison)] | 0.990±0.005 |
| role anchor [pooled midpoint (comparison)] | 0.990±0.005 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.993±0.006 |
| role unit [pooled midpoint (comparison)] | 0.990±0.005 |
| role direction [pooled midpoint (comparison)] | 1.000±0.000 |
| role axis [pooled midpoint (comparison)] | 0.995±0.006 |
| role layout [pooled midpoint (comparison)] | 0.990±0.005 |
| role pairing [pooled midpoint (comparison)] | 0.954±0.012 |
| role source [pooled midpoint (comparison)] | 0.873±0.010 |
| role target [pooled midpoint (comparison)] | 0.976±0.008 |
| role quantity [pooled midpoint (comparison)] | 0.980±0.006 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.424±0.018 |
| presence object: present read present [pooled midpoint (comparison)] | 0.683±0.027 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.983±0.010 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.945±0.012 |
| presence text: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.996±0.007 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.996±0.007 |
| presence region: present read present | 0.978±0.044 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence layout: absent read absent | 0.997±0.006 |
| presence region: present read present [pooled midpoint (comparison)] | 0.911±0.044 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.996±0.007 |
| presence object: absent read absent | 0.350±0.094 |
| presence direction: present read present | 0.950±0.100 |
| presence direction: share of 'present' readings that abstain | 0.150±0.122 |
| presence direction: share of true 'present' readings that abstain | 0.150±0.122 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.444±0.128 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present | 0.930±0.002 |
| presence text: share of 'present' readings that abstain | 0.278±0.113 |
| presence text: share of true 'present' readings that abstain | 0.268±0.107 |
| presence source: share of 'present' readings that abstain | 0.960±0.080 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence text: present read present [pooled midpoint (comparison)] | 0.907±0.058 |
| presence color: present read present | 0.000±0.000 |
| presence size: present read present | 0.880±0.160 |
| presence size: share of 'present' readings that abstain | 0.267±0.198 |
| presence size: share of true 'present' readings that abstain | 0.267±0.198 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.300±0.267 |
| presence quantity: share of true 'present' readings that abstain | 0.267±0.249 |
| presence quantity: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present | 0.920±0.098 |
| presence relation: share of 'present' readings that abstain | 0.120±0.098 |
| presence relation: share of true 'present' readings that abstain | 0.120±0.098 |
| presence landmark: present read present | 0.880±0.160 |
| presence landmark: share of 'present' readings that abstain | 0.593±0.137 |
| presence landmark: share of true 'present' readings that abstain | 0.593±0.137 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.950±0.100 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.950±0.100 |
| presence source: present read present | 0.444±0.099 |
| presence source: share of true 'present' readings that abstain | 0.960±0.080 |
| presence target: present read present | 0.760±0.080 |
| presence target: share of 'present' readings that abstain | 0.467±0.172 |
| presence target: share of true 'present' readings that abstain | 0.467±0.172 |
| presence source: present read present [pooled midpoint (comparison)] | 0.563±0.127 |
| presence target: present read present [pooled midpoint (comparison)] | 0.900±0.122 |
| presence anchor: present read present | 0.867±0.067 |
| presence anchor: share of 'present' readings that abstain | 0.033±0.067 |
| presence anchor: share of true 'present' readings that abstain | 0.033±0.067 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 0.933±0.133 |
| presence axis: share of 'present' readings that abstain | 0.067±0.133 |
| presence axis: share of true 'present' readings that abstain | 0.067±0.133 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: share of FALSE 'present' readings that abstain | 0.067±0.082 |
| presence color: share of 'present' readings that abstain | 0.950±0.100 |
| presence color: share of FALSE 'present' readings that abstain | 0.950±0.100 |
| presence style: present read present | 0.400±0.374 |
| presence style: present read present [pooled midpoint (comparison)] | 0.800±0.400 |
| presence amount: present read present | 0.800±0.245 |
| presence amount: share of 'present' readings that abstain | 0.300±0.400 |
| presence amount: share of true 'present' readings that abstain | 0.300±0.400 |
| presence unit: present read present | 0.700±0.245 |
| presence style: share of 'present' readings that abstain | 1.000±0.000 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.400±0.374 |
| presence unit: share of true 'present' readings that abstain | 0.400±0.374 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.900±0.200 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.800±0.245 |
| presence layout: share of FALSE 'present' readings that abstain | nan±nan |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.420±0.008; status {'ok': 7, 'abstain': 70, 'no-sense': 5}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.915 | 0.220 / 0.110 | 0.99 | 0.073 | 0.000 / 0.012 |
| role object | 0.819 | 0.214 / 0.057 | 0.90 | 0.097 | 0.014 / 0.083 |
| roles (pooled) | 0.744 | 0.143 / 0.000 | 0.76 | 0.061 | 0.043 / 0.195 |
| role layout | 1.000 | 0.167 / 0.113 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.188 / 0.151 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.104 / 0.090 | 1.00 | 0.000 | 0.000 / 0.000 |
| role text | 0.824 | 0.086 / 0.013 | 0.76 | 0.059 | 0.118 / 0.118 |
| role pairing | 0.667 | 0.154 / 0.132 | 1.00 | 0.333 | 0.000 / 0.000 |
| role source | 0.000 | 0.002 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role color | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role size | 0.800 | 0.054 / 0.020 | 0.80 | 0.000 | 0.000 / 0.200 |
| role quantity | 0.667 | 0.079 / 0.020 | 0.67 | 0.000 | 0.000 / 0.333 |
| role relation | 0.800 | 0.100 / 0.040 | 0.80 | 0.000 | 0.000 / 0.200 |
| role landmark | 0.600 | 0.030 / 0.000 | 0.20 | 0.000 | 0.400 / 0.400 |
| role target | 0.600 | 0.044 / 0.003 | 0.40 | 0.000 | 0.200 / 0.400 |
| role anchor | 0.833 | 0.119 / 0.062 | 0.83 | 0.000 | 0.000 / 0.167 |
| role axis | 1.000 | 0.116 / 0.089 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role amount | 1.000 | 0.044 / 0.021 | 0.50 | 0.000 | 0.500 / 0.000 |
| role unit | 0.500 | 0.055 / 0.011 | 0.50 | 0.000 | 0.000 / 0.500 |

### heldout_sentences — experiment candidates (n = 82 of 82)
| axis | accuracy |
|---|---|
| FULL | 0.190±0.035 |
| FULL [depth given] | 0.190±0.035 |
| FULL [depth and negation given] | 0.190±0.035 |
| FULL [pooled midpoint (comparison)] | 0.071±0.033 |
| presence object: present read present | 0.976±0.015 |
| presence object: share of 'present' readings that abstain | 0.058±0.018 |
| presence object: share of true 'present' readings that abstain | 0.045±0.016 |
| presence color: absent read absent | 0.899±0.075 |
| presence size: absent read absent | 0.889±0.040 |
| presence style: absent read absent | 0.699±0.162 |
| presence text: absent read absent | 0.799±0.024 |
| presence relation: absent read absent | 0.955±0.041 |
| presence landmark: absent read absent | 0.974±0.031 |
| presence region: absent read absent | 0.982±0.006 |
| presence anchor: absent read absent | 0.968±0.011 |
| presence fraction: absent read absent | 0.982±0.018 |
| presence amount: absent read absent | 0.948±0.048 |
| presence unit: absent read absent | 0.945±0.042 |
| presence direction: absent read absent | 0.913±0.051 |
| presence axis: absent read absent | 0.902±0.077 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.328±0.136 |
| presence layout: share of true 'present' readings that abstain | 0.240±0.080 |
| presence pairing: absent read absent | 0.933±0.032 |
| presence source: absent read absent | 0.840±0.029 |
| presence target: absent read absent | 0.903±0.024 |
| presence quantity: absent read absent | 0.717±0.087 |
| structure (depth, negation) | 0.917±0.014 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.915±0.015 |
| event type (synonym table) | 0.917±0.014 |
| role object | 0.741±0.025 |
| head object | 0.817±0.011 |
| lexical order head object | 0.841±0.000 |
| lexical bag head object | 0.878±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.622±0.046 |
| occupancy: known filler | 0.844±0.024 |
| role color | 0.885±0.068 |
| head color | 0.885±0.068 |
| lexical order head color | 0.976±0.000 |
| lexical bag head color | 0.976±0.000 |
| occupancy: not given | 0.907±0.015 |
| role size | 0.895±0.026 |
| head size | 0.895±0.026 |
| lexical order head size | 0.939±0.000 |
| lexical bag head size | 0.963±0.000 |
| role style | 0.712±0.141 |
| head style | 0.712±0.141 |
| lexical order head style | 0.976±0.000 |
| lexical bag head style | 0.976±0.000 |
| role text | 0.785±0.025 |
| head text | 0.785±0.025 |
| lexical order head text | 0.793±0.000 |
| lexical bag head text | 0.866±0.000 |
| role relation | 0.951±0.034 |
| head relation | 0.951±0.034 |
| lexical order head relation | 0.939±0.000 |
| lexical bag head relation | 0.951±0.000 |
| role landmark | 0.941±0.021 |
| head landmark | 0.941±0.021 |
| lexical order head landmark | 0.939±0.000 |
| lexical bag head landmark | 0.951±0.000 |
| role region | 0.983±0.010 |
| head region | 0.983±0.010 |
| lexical order head region | 0.890±0.000 |
| lexical bag head region | 0.890±0.000 |
| role anchor | 0.963±0.011 |
| head anchor | 0.963±0.011 |
| lexical order head anchor | 0.927±0.000 |
| lexical bag head anchor | 0.927±0.000 |
| role fraction | 0.983±0.017 |
| head fraction | 0.983±0.017 |
| lexical order head fraction | 1.000±0.000 |
| lexical bag head fraction | 1.000±0.000 |
| role amount | 0.949±0.045 |
| head amount | 0.949±0.045 |
| lexical order head amount | 0.976±0.000 |
| lexical bag head amount | 0.976±0.000 |
| role unit | 0.944±0.040 |
| head unit | 0.944±0.040 |
| lexical order head unit | 0.976±0.000 |
| lexical bag head unit | 0.976±0.000 |
| role direction | 0.922±0.043 |
| head direction | 0.922±0.043 |
| lexical order head direction | 0.951±0.000 |
| lexical bag head direction | 0.963±0.000 |
| role axis | 0.912±0.065 |
| head axis | 0.912±0.065 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.988±0.000 |
| role layout | 0.988±0.008 |
| head layout | 0.988±0.008 |
| lexical order head layout | 0.939±0.000 |
| lexical bag head layout | 0.939±0.000 |
| role pairing | 0.905±0.034 |
| head pairing | 0.905±0.034 |
| lexical order head pairing | 0.927±0.000 |
| lexical bag head pairing | 0.927±0.000 |
| role source | 0.737±0.025 |
| head source | 0.737±0.025 |
| lexical order head source | 0.866±0.000 |
| lexical bag head source | 0.866±0.000 |
| role target | 0.878±0.019 |
| head target | 0.878±0.019 |
| lexical order head target | 0.939±0.000 |
| lexical bag head target | 0.951±0.000 |
| role quantity | 0.744±0.074 |
| head quantity | 0.744±0.074 |
| lexical order head quantity | 0.963±0.000 |
| lexical bag head quantity | 0.963±0.000 |
| heads FULL (model) | 0.207±0.038 |
| heads FULL (lexical order baseline) | 0.146±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.256±0.000 |
| role object [pooled midpoint (comparison)] | 0.449±0.031 |
| role color [pooled midpoint (comparison)] | 0.956±0.017 |
| role size [pooled midpoint (comparison)] | 0.885±0.043 |
| role style [pooled midpoint (comparison)] | 0.685±0.057 |
| role text [pooled midpoint (comparison)] | 0.763±0.015 |
| role relation [pooled midpoint (comparison)] | 0.980±0.006 |
| role landmark [pooled midpoint (comparison)] | 0.954±0.009 |
| role region [pooled midpoint (comparison)] | 0.976±0.008 |
| role anchor [pooled midpoint (comparison)] | 0.968±0.015 |
| role fraction [pooled midpoint (comparison)] | 0.966±0.018 |
| role amount [pooled midpoint (comparison)] | 0.946±0.036 |
| role unit [pooled midpoint (comparison)] | 0.937±0.038 |
| role direction [pooled midpoint (comparison)] | 0.900±0.016 |
| role axis [pooled midpoint (comparison)] | 0.954±0.034 |
| role layout [pooled midpoint (comparison)] | 0.985±0.012 |
| role pairing [pooled midpoint (comparison)] | 0.920±0.010 |
| role source [pooled midpoint (comparison)] | 0.780±0.024 |
| role target [pooled midpoint (comparison)] | 0.888±0.005 |
| role quantity [pooled midpoint (comparison)] | 0.841±0.033 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.085±0.039 |
| presence object: present read present [pooled midpoint (comparison)] | 0.691±0.038 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.972±0.024 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.833±0.060 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.565±0.093 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.782±0.035 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.985±0.022 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.975±0.007 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.965±0.023 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.951±0.025 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.933±0.044 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.921±0.058 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.845±0.028 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 0.938±0.054 |
| presence layout: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.972±0.014 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.862±0.034 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.891±0.015 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.791±0.047 |
| presence color: share of 'present' readings that abstain | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.886±0.068 |
| presence size: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: share of 'present' readings that abstain | 0.828±0.038 |
| presence text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence landmark: share of 'present' readings that abstain | 0.933±0.133 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |
| presence region: present read present | 0.978±0.044 |
| presence region: share of 'present' readings that abstain | 0.120±0.040 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.880±0.194 |
| presence amount: share of FALSE 'present' readings that abstain | nan±nan |
| presence unit: share of 'present' readings that abstain | 0.824±0.092 |
| presence unit: share of FALSE 'present' readings that abstain | 0.980±0.040 |
| presence direction: share of 'present' readings that abstain | 0.590±0.158 |
| presence direction: share of FALSE 'present' readings that abstain | 0.915±0.129 |
| presence axis: share of 'present' readings that abstain | 0.505±0.329 |
| presence axis: share of FALSE 'present' readings that abstain | nan±nan |
| presence layout: absent read absent | 0.989±0.011 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 0.911±0.044 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.992±0.010 |
| presence object: absent read absent | 0.144±0.013 |
| presence direction: present read present | 0.950±0.100 |
| presence direction: share of true 'present' readings that abstain | 0.150±0.122 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.300±0.100 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.560±0.148 |
| presence pairing: share of FALSE 'present' readings that abstain | 0.950±0.100 |
| presence text: present read present | 0.930±0.002 |
| presence text: share of true 'present' readings that abstain | 0.671±0.078 |
| presence text: present read present [pooled midpoint (comparison)] | 0.907±0.058 |
| presence color: present read present | 0.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.908±0.049 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: present read present | 0.880±0.160 |
| presence size: share of true 'present' readings that abstain | 0.660±0.215 |
| presence style: share of 'present' readings that abstain | 1.000±0.000 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of true 'present' readings that abstain | 0.267±0.249 |
| presence quantity: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present | 0.950±0.100 |
| presence relation: share of 'present' readings that abstain | 0.581±0.207 |
| presence relation: share of true 'present' readings that abstain | 0.373±0.248 |
| presence landmark: present read present | 0.900±0.122 |
| presence landmark: share of true 'present' readings that abstain | 0.933±0.133 |
| presence region: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present | 0.798±0.066 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.800±0.000 |
| presence target: share of 'present' readings that abstain | 0.980±0.040 |
| presence target: share of true 'present' readings that abstain | 0.950±0.100 |
| presence source: present read present [pooled midpoint (comparison)] | 0.920±0.098 |
| presence target: present read present [pooled midpoint (comparison)] | 0.950±0.100 |
| presence anchor: present read present | 0.867±0.067 |
| presence anchor: share of 'present' readings that abstain | 0.315±0.082 |
| presence anchor: share of true 'present' readings that abstain | 0.033±0.067 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 0.933±0.133 |
| presence axis: share of true 'present' readings that abstain | 0.067±0.133 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: share of FALSE 'present' readings that abstain | 0.197±0.046 |
| presence anchor: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence style: present read present | 0.400±0.374 |
| presence style: present read present [pooled midpoint (comparison)] | 0.800±0.400 |
| presence relation: share of FALSE 'present' readings that abstain | nan±nan |
| presence amount: present read present | 0.800±0.245 |
| presence amount: share of true 'present' readings that abstain | 0.700±0.400 |
| presence unit: present read present | 0.700±0.245 |
| presence unit: share of true 'present' readings that abstain | 0.400±0.374 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.900±0.200 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.800±0.245 |
| presence layout: share of FALSE 'present' readings that abstain | nan±nan |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.438±0.008; status {'ok': 4, 'abstain': 71, 'no-sense': 7}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.902 | 0.220 / 0.110 | 0.99 | 0.085 | 0.000 / 0.012 |
| role object | 0.819 | 0.168 / 0.056 | 0.90 | 0.097 | 0.014 / 0.083 |
| roles (pooled) | 0.720 | 0.109 / 0.000 | 0.68 | 0.067 | 0.104 / 0.213 |
| role layout | 1.000 | 0.112 / 0.050 | 0.80 | 0.000 | 0.200 / 0.000 |
| role region | 1.000 | 0.153 / 0.119 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.089 / 0.080 | 1.00 | 0.000 | 0.000 / 0.000 |
| role text | 0.706 | 0.042 / 0.000 | 0.35 | 0.059 | 0.412 / 0.235 |
| role pairing | 0.500 | 0.130 / 0.085 | 1.00 | 0.500 | 0.000 / 0.000 |
| role source | 0.000 | 0.006 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role color | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role size | 0.800 | 0.033 / 0.011 | 0.40 | 0.000 | 0.400 / 0.200 |
| role quantity | 0.667 | 0.069 / 0.020 | 0.67 | 0.000 | 0.000 / 0.333 |
| role relation | 0.800 | 0.078 / 0.024 | 0.80 | 0.000 | 0.000 / 0.200 |
| role landmark | 0.600 | 0.010 / 0.000 | 0.00 | 0.000 | 0.600 / 0.400 |
| role target | 0.400 | 0.020 / 0.003 | 0.20 | 0.000 | 0.200 / 0.600 |
| role anchor | 0.833 | 0.104 / 0.054 | 0.83 | 0.000 | 0.000 / 0.167 |
| role axis | 1.000 | 0.100 / 0.084 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role amount | 1.000 | 0.028 / 0.017 | 0.00 | 0.000 | 1.000 / 0.000 |
| role unit | 0.500 | 0.046 / 0.009 | 0.50 | 0.000 | 0.000 / 0.500 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.467±0.042 |
| FULL [depth given] | 0.467±0.042 |
| FULL [depth and negation given] | 0.468±0.042 |
| FULL [pooled midpoint (comparison)] | 0.194±0.016 |
| presence object: present read present | 0.934±0.023 |
| presence object: share of 'present' readings that abstain | 0.102±0.016 |
| presence object: share of true 'present' readings that abstain | 0.105±0.016 |
| presence color: absent read absent | 0.982±0.011 |
| presence size: present read present | 0.875±0.063 |
| presence size: share of 'present' readings that abstain | 0.249±0.082 |
| presence size: share of true 'present' readings that abstain | 0.210±0.076 |
| presence style: absent read absent | 0.965±0.019 |
| presence text: absent read absent | 0.942±0.010 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.997±0.003 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.822±0.103 |
| presence amount: share of 'present' readings that abstain | 0.219±0.045 |
| presence amount: share of true 'present' readings that abstain | 0.219±0.045 |
| presence unit: present read present | 0.881±0.037 |
| presence unit: share of 'present' readings that abstain | 0.154±0.051 |
| presence unit: share of true 'present' readings that abstain | 0.154±0.051 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.995±0.003 |
| presence target: absent read absent | 0.998±0.002 |
| presence quantity: absent read absent | 0.975±0.029 |
| structure (depth, negation) | 0.895±0.021 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.912±0.020 |
| event type (synonym table) | 0.913±0.018 |
| role object | 0.704±0.031 |
| head object | 0.757±0.031 |
| lexical order head object | 0.920±0.000 |
| lexical bag head object | 0.868±0.000 |
| occupancy: known filler | 0.843±0.024 |
| role color | 0.977±0.009 |
| head color | 0.977±0.009 |
| lexical order head color | 0.985±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 0.991±0.001 |
| role size | 0.985±0.006 |
| head size | 0.985±0.006 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.965±0.000 |
| role style | 0.962±0.015 |
| head style | 0.962±0.015 |
| lexical order head style | 0.988±0.000 |
| lexical bag head style | 0.988±0.000 |
| role text | 0.855±0.020 |
| head text | 0.855±0.020 |
| lexical order head text | 0.535±0.000 |
| lexical bag head text | 0.610±0.000 |
| role relation | 0.946±0.017 |
| head relation | 0.946±0.017 |
| lexical order head relation | 0.790±0.000 |
| lexical bag head relation | 0.812±0.000 |
| role landmark | 0.868±0.004 |
| head landmark | 0.902±0.005 |
| lexical order head landmark | 0.790±0.000 |
| lexical bag head landmark | 0.800±0.000 |
| role region | 0.997±0.002 |
| head region | 0.997±0.002 |
| lexical order head region | 0.955±0.000 |
| lexical bag head region | 0.957±0.000 |
| role anchor | 1.000±0.001 |
| head anchor | 1.000±0.001 |
| lexical order head anchor | 0.968±0.000 |
| lexical bag head anchor | 0.983±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.988±0.000 |
| lexical bag head fraction | 0.998±0.000 |
| role amount | 0.951±0.026 |
| head amount | 0.951±0.026 |
| lexical order head amount | 0.750±0.000 |
| lexical bag head amount | 0.802±0.000 |
| occupancy: unknown filler | 0.701±0.032 |
| role unit | 0.966±0.009 |
| head unit | 0.966±0.009 |
| lexical order head unit | 0.750±0.000 |
| lexical bag head unit | 0.802±0.000 |
| role direction | 0.967±0.005 |
| head direction | 0.967±0.005 |
| lexical order head direction | 0.927±0.000 |
| lexical bag head direction | 0.938±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 1.000±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 1.000±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.949±0.006 |
| head source | 0.949±0.006 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.935±0.000 |
| role target | 0.932±0.004 |
| head target | 0.932±0.004 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.935±0.000 |
| role quantity | 0.977±0.027 |
| head quantity | 0.977±0.027 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.524±0.036 |
| heads FULL (lexical order baseline) | 0.060±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.205±0.000 |
| role object [pooled midpoint (comparison)] | 0.289±0.031 |
| role color [pooled midpoint (comparison)] | 0.989±0.002 |
| role size [pooled midpoint (comparison)] | 0.983±0.007 |
| role style [pooled midpoint (comparison)] | 0.968±0.006 |
| role text [pooled midpoint (comparison)] | 0.722±0.015 |
| role relation [pooled midpoint (comparison)] | 0.914±0.017 |
| role landmark [pooled midpoint (comparison)] | 0.861±0.008 |
| role region [pooled midpoint (comparison)] | 0.989±0.003 |
| role anchor [pooled midpoint (comparison)] | 0.998±0.002 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.944±0.017 |
| role unit [pooled midpoint (comparison)] | 0.958±0.012 |
| role direction [pooled midpoint (comparison)] | 0.972±0.002 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.944±0.008 |
| role target [pooled midpoint (comparison)] | 0.934±0.005 |
| role quantity [pooled midpoint (comparison)] | 0.987±0.016 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.245±0.025 |
| presence object: present read present [pooled midpoint (comparison)] | 0.535±0.035 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.995±0.004 |
| presence size: present read present [pooled midpoint (comparison)] | 0.938±0.053 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.963±0.009 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.951±0.011 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.859±0.068 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.924±0.045 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.991±0.006 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.994±0.005 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.980±0.025 |
| presence size: absent read absent | 0.995±0.004 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.994±0.005 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present | 0.807±0.039 |
| presence text: share of 'present' readings that abstain | 0.250±0.043 |
| presence text: share of true 'present' readings that abstain | 0.226±0.040 |
| presence text: present read present [pooled midpoint (comparison)] | 0.858±0.038 |
| presence text: share of FALSE 'present' readings that abstain | 0.528±0.163 |
| presence relation: present read present | 0.809±0.079 |
| presence landmark: present read present | 0.714±0.048 |
| presence anchor: present read present | 0.985±0.031 |
| presence anchor: share of 'present' readings that abstain | 0.047±0.039 |
| presence anchor: share of true 'present' readings that abstain | 0.047±0.039 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.120±0.098 |
| presence fraction: share of true 'present' readings that abstain | 0.120±0.098 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.938±0.058 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present | 0.650±0.064 |
| presence source: share of 'present' readings that abstain | 0.908±0.059 |
| presence source: share of true 'present' readings that abstain | 0.898±0.069 |
| presence target: present read present | 0.559±0.084 |
| presence target: share of 'present' readings that abstain | 0.885±0.097 |
| presence target: share of true 'present' readings that abstain | 0.905±0.097 |
| determiner identity (outside FULL when the legend excludes it) | 0.852±0.042 |
| presence source: present read present [pooled midpoint (comparison)] | 0.687±0.043 |
| presence target: present read present [pooled midpoint (comparison)] | 0.637±0.080 |
| presence relation: share of 'present' readings that abstain | 0.100±0.033 |
| presence relation: share of true 'present' readings that abstain | 0.100±0.033 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.805±0.086 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.742±0.064 |
| presence landmark: share of 'present' readings that abstain | 0.649±0.055 |
| presence landmark: share of true 'present' readings that abstain | 0.648±0.055 |
| presence style: share of 'present' readings that abstain | 0.989±0.022 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence region: present read present | 0.977±0.028 |
| presence region: share of 'present' readings that abstain | 0.036±0.029 |
| presence region: share of true 'present' readings that abstain | 0.036±0.029 |
| presence region: present read present [pooled midpoint (comparison)] | 0.987±0.027 |
| presence direction: present read present | 0.610±0.077 |
| presence direction: share of 'present' readings that abstain | 0.306±0.099 |
| presence direction: share of true 'present' readings that abstain | 0.306±0.099 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.723±0.019 |
| presence size: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: share of 'present' readings that abstain | 0.757±0.083 |
| presence color: share of FALSE 'present' readings that abstain | 0.980±0.040 |
| presence object: absent read absent | 0.046±0.038 |
| presence object: share of FALSE 'present' readings that abstain | 0.017±0.033 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.236±0.116 |
| presence quantity: share of 'present' readings that abstain | 0.893±0.137 |
| presence quantity: share of FALSE 'present' readings that abstain | 0.893±0.137 |
| presence style: present read present [pooled midpoint (comparison)] | 0.883±0.145 |
| presence style: present read present | 0.627±0.287 |
| presence style: share of true 'present' readings that abstain | 0.933±0.133 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present | 0.760±0.159 |
| presence color: share of true 'present' readings that abstain | 0.453±0.105 |
| presence color: present read present [pooled midpoint (comparison)] | 0.700±0.100 |

residual mean 0.464±0.015; status {'abstain': 347, 'ok': 25, 'no-sense': 28}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.927 | 0.216 / 0.124 | 0.97 | 0.070 | 0.022 / 0.003 |
| role object | 0.765 | 0.142 / 0.000 | 0.81 | 0.121 | 0.080 / 0.114 |
| roles (pooled) | 0.738 | 0.095 / 0.000 | 0.66 | 0.054 | 0.136 / 0.209 |
| role size | 0.778 | 0.052 / 0.000 | 0.56 | 0.000 | 0.222 / 0.222 |
| role amount | 0.940 | 0.072 / 0.025 | 0.69 | 0.000 | 0.250 / 0.060 |
| role unit | 0.890 | 0.109 / 0.000 | 0.78 | 0.000 | 0.110 / 0.110 |
| role text | 0.790 | 0.075 / 0.000 | 0.65 | 0.027 | 0.172 / 0.183 |
| role relation | 0.810 | 0.081 / 0.000 | 0.73 | 0.000 | 0.083 / 0.190 |
| role landmark | 0.369 | 0.023 / 0.000 | 0.18 | 0.060 | 0.250 / 0.571 |
| role anchor | 1.000 | 0.169 / 0.119 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.082 / 0.050 | 0.80 | 0.000 | 0.200 / 0.000 |
| role source | 0.345 | 0.005 / -0.003 | 0.00 | 0.000 | 0.345 / 0.655 |
| role target | 0.000 | 0.012 / 0.000 | 0.07 | 0.069 | 0.000 / 0.931 |
| role region | 0.944 | 0.169 / 0.089 | 0.89 | 0.000 | 0.056 / 0.056 |
| role direction | 0.621 | 0.051 / 0.000 | 0.52 | 0.000 | 0.103 / 0.379 |
| role style | 0.200 | 0.004 / 0.000 | 0.00 | 0.000 | 0.200 / 0.800 |
| role color | 0.500 | 0.020 / -0.006 | 0.33 | 0.000 | 0.167 / 0.500 |

### new_identities — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.148±0.049 |
| FULL [depth given] | 0.148±0.049 |
| FULL [depth and negation given] | 0.148±0.049 |
| FULL [pooled midpoint (comparison)] | 0.045±0.008 |
| presence object: present read present | 0.943±0.019 |
| presence object: share of 'present' readings that abstain | 0.122±0.013 |
| presence object: share of true 'present' readings that abstain | 0.127±0.014 |
| presence color: absent read absent | 0.943±0.060 |
| presence size: present read present | 0.875±0.063 |
| presence size: share of 'present' readings that abstain | 0.770±0.037 |
| presence size: share of true 'present' readings that abstain | 0.554±0.088 |
| presence style: absent read absent | 0.695±0.153 |
| presence style: share of 'present' readings that abstain | 0.997±0.003 |
| presence style: share of FALSE 'present' readings that abstain | 0.997±0.003 |
| presence text: absent read absent | 0.817±0.015 |
| presence relation: absent read absent | 0.963±0.033 |
| presence landmark: absent read absent | 0.974±0.013 |
| presence region: absent read absent | 0.988±0.003 |
| presence anchor: absent read absent | 0.991±0.006 |
| presence fraction: absent read absent | 0.980±0.010 |
| presence amount: present read present | 0.851±0.077 |
| presence amount: share of 'present' readings that abstain | 0.417±0.063 |
| presence amount: share of true 'present' readings that abstain | 0.349±0.040 |
| presence unit: present read present | 0.887±0.034 |
| presence unit: share of 'present' readings that abstain | 0.248±0.052 |
| presence unit: share of true 'present' readings that abstain | 0.172±0.069 |
| presence direction: absent read absent | 0.942±0.031 |
| presence axis: absent read absent | 0.936±0.041 |
| presence layout: absent read absent | 0.995±0.002 |
| presence pairing: absent read absent | 0.957±0.026 |
| presence source: absent read absent | 0.946±0.023 |
| presence target: absent read absent | 0.979±0.009 |
| presence quantity: absent read absent | 0.706±0.063 |
| structure (depth, negation) | 0.884±0.022 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.901±0.022 |
| event type (synonym table) | 0.902±0.021 |
| role object | 0.609±0.038 |
| head object | 0.730±0.032 |
| lexical order head object | 0.920±0.000 |
| lexical bag head object | 0.868±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.726±0.045 |
| occupancy: known filler | 0.847±0.025 |
| role color | 0.939±0.052 |
| head color | 0.939±0.052 |
| lexical order head color | 0.985±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 0.932±0.014 |
| role size | 0.928±0.030 |
| head size | 0.928±0.030 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.965±0.000 |
| role style | 0.718±0.132 |
| head style | 0.718±0.132 |
| lexical order head style | 0.988±0.000 |
| lexical bag head style | 0.988±0.000 |
| role text | 0.766±0.018 |
| head text | 0.766±0.018 |
| lexical order head text | 0.535±0.000 |
| lexical bag head text | 0.610±0.000 |
| role relation | 0.917±0.016 |
| head relation | 0.917±0.016 |
| lexical order head relation | 0.790±0.000 |
| lexical bag head relation | 0.812±0.000 |
| role landmark | 0.812±0.014 |
| head landmark | 0.827±0.017 |
| lexical order head landmark | 0.790±0.000 |
| lexical bag head landmark | 0.800±0.000 |
| role region | 0.987±0.003 |
| head region | 0.987±0.003 |
| lexical order head region | 0.955±0.000 |
| lexical bag head region | 0.957±0.000 |
| role anchor | 0.992±0.005 |
| head anchor | 0.992±0.005 |
| lexical order head anchor | 0.968±0.000 |
| lexical bag head anchor | 0.983±0.000 |
| role fraction | 0.982±0.009 |
| head fraction | 0.982±0.009 |
| lexical order head fraction | 0.988±0.000 |
| lexical bag head fraction | 0.998±0.000 |
| role amount | 0.924±0.017 |
| head amount | 0.924±0.017 |
| lexical order head amount | 0.750±0.000 |
| lexical bag head amount | 0.802±0.000 |
| occupancy: unknown filler | 0.705±0.036 |
| role unit | 0.941±0.017 |
| head unit | 0.941±0.017 |
| lexical order head unit | 0.750±0.000 |
| lexical bag head unit | 0.802±0.000 |
| role direction | 0.916±0.022 |
| head direction | 0.916±0.022 |
| lexical order head direction | 0.927±0.000 |
| lexical bag head direction | 0.938±0.000 |
| role axis | 0.943±0.037 |
| head axis | 0.943±0.037 |
| lexical order head axis | 1.000±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 0.996±0.002 |
| head layout | 0.996±0.002 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.961±0.024 |
| head pairing | 0.961±0.024 |
| lexical order head pairing | 1.000±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.883±0.018 |
| head source | 0.883±0.018 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.935±0.000 |
| role target | 0.911±0.007 |
| head target | 0.911±0.007 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.935±0.000 |
| role quantity | 0.734±0.062 |
| head quantity | 0.734±0.062 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.173±0.054 |
| heads FULL (lexical order baseline) | 0.060±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.205±0.000 |
| role object [pooled midpoint (comparison)] | 0.258±0.031 |
| role color [pooled midpoint (comparison)] | 0.982±0.006 |
| role size [pooled midpoint (comparison)] | 0.919±0.035 |
| role style [pooled midpoint (comparison)] | 0.714±0.095 |
| role text [pooled midpoint (comparison)] | 0.642±0.011 |
| role relation [pooled midpoint (comparison)] | 0.902±0.016 |
| role landmark [pooled midpoint (comparison)] | 0.819±0.010 |
| role region [pooled midpoint (comparison)] | 0.982±0.002 |
| role anchor [pooled midpoint (comparison)] | 0.994±0.004 |
| role fraction [pooled midpoint (comparison)] | 0.980±0.008 |
| role amount [pooled midpoint (comparison)] | 0.920±0.018 |
| role unit [pooled midpoint (comparison)] | 0.934±0.018 |
| role direction [pooled midpoint (comparison)] | 0.910±0.014 |
| role axis [pooled midpoint (comparison)] | 0.971±0.012 |
| role layout [pooled midpoint (comparison)] | 0.996±0.001 |
| role pairing [pooled midpoint (comparison)] | 0.982±0.007 |
| role source [pooled midpoint (comparison)] | 0.905±0.009 |
| role target [pooled midpoint (comparison)] | 0.914±0.008 |
| role quantity [pooled midpoint (comparison)] | 0.867±0.031 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.053±0.011 |
| presence object: present read present [pooled midpoint (comparison)] | 0.562±0.038 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.989±0.010 |
| presence size: present read present [pooled midpoint (comparison)] | 0.942±0.048 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.573±0.137 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.827±0.022 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.991±0.007 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.986±0.008 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.988±0.004 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.994±0.005 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.968±0.012 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.893±0.040 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.937±0.029 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.896±0.024 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 0.954±0.017 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.994±0.002 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.972±0.010 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.960±0.015 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.974±0.015 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.794±0.044 |
| presence size: absent read absent | 0.932±0.033 |
| presence amount: absent read absent | 0.960±0.025 |
| presence unit: absent read absent | 0.965±0.021 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.894±0.047 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.953±0.013 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.953±0.028 |
| presence size: share of FALSE 'present' readings that abstain | 0.993±0.015 |
| presence text: present read present | 0.809±0.039 |
| presence text: share of 'present' readings that abstain | 0.547±0.034 |
| presence text: share of true 'present' readings that abstain | 0.444±0.031 |
| presence amount: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.925±0.092 |
| presence pairing: share of FALSE 'present' readings that abstain | 0.925±0.092 |
| presence text: present read present [pooled midpoint (comparison)] | 0.860±0.045 |
| presence color: share of 'present' readings that abstain | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.794±0.097 |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.978±0.028 |
| presence quantity: share of FALSE 'present' readings that abstain | 0.978±0.028 |
| presence text: share of FALSE 'present' readings that abstain | 0.962±0.051 |
| presence anchor: present read present | 0.985±0.031 |
| presence anchor: share of 'present' readings that abstain | 0.227±0.102 |
| presence anchor: share of true 'present' readings that abstain | 0.047±0.039 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.715±0.133 |
| presence fraction: share of true 'present' readings that abstain | 0.480±0.160 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 1.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.938±0.058 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.992±0.016 |
| presence axis: share of FALSE 'present' readings that abstain | 0.992±0.016 |
| presence source: present read present | 0.712±0.070 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.647±0.069 |
| presence target: share of true 'present' readings that abstain | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.701±0.065 |
| presence target: present read present [pooled midpoint (comparison)] | 0.692±0.061 |
| presence relation: present read present | 0.822±0.081 |
| presence relation: share of 'present' readings that abstain | 0.404±0.086 |
| presence relation: share of true 'present' readings that abstain | 0.321±0.049 |
| presence landmark: present read present | 0.762±0.059 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.804±0.086 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.764±0.064 |
| presence landmark: share of 'present' readings that abstain | 0.973±0.024 |
| presence landmark: share of true 'present' readings that abstain | 0.969±0.027 |
| presence region: present read present | 0.977±0.028 |
| presence region: share of 'present' readings that abstain | 0.225±0.039 |
| presence region: share of true 'present' readings that abstain | 0.036±0.029 |
| presence region: present read present [pooled midpoint (comparison)] | 0.987±0.027 |
| presence direction: present read present | 0.614±0.074 |
| presence direction: share of true 'present' readings that abstain | 0.562±0.172 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.727±0.019 |
| presence relation: share of FALSE 'present' readings that abstain | 0.993±0.014 |
| presence unit: share of FALSE 'present' readings that abstain | 0.962±0.047 |
| presence region: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence fraction: share of FALSE 'present' readings that abstain | 0.908±0.130 |
| presence object: absent read absent | 0.046±0.038 |
| presence object: share of FALSE 'present' readings that abstain | 0.017±0.033 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.206±0.085 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: present read present [pooled midpoint (comparison)] | 0.733±0.226 |
| presence style: present read present | 0.550±0.348 |
| presence layout: share of 'present' readings that abstain | 1.000±0.000 |
| presence layout: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present | 0.760±0.159 |
| presence color: share of true 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 0.700±0.100 |

residual mean 0.491±0.014; status {'abstain': 359, 'no-sense': 32, 'ok': 9}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.917 | 0.216 / 0.124 | 0.97 | 0.080 | 0.022 / 0.003 |
| role object | 0.695 | 0.116 / 0.000 | 0.80 | 0.168 | 0.067 / 0.137 |
| roles (pooled) | 0.670 | 0.075 / 0.000 | 0.57 | 0.065 | 0.164 / 0.265 |
| role size | 0.741 | 0.039 / 0.000 | 0.33 | 0.000 | 0.407 / 0.259 |
| role amount | 0.920 | 0.056 / 0.006 | 0.54 | 0.000 | 0.380 / 0.080 |
| role unit | 0.890 | 0.107 / 0.000 | 0.78 | 0.000 | 0.110 / 0.110 |
| role text | 0.715 | 0.049 / 0.000 | 0.47 | 0.032 | 0.274 / 0.253 |
| role relation | 0.810 | 0.054 / 0.000 | 0.55 | 0.000 | 0.262 / 0.190 |
| role landmark | 0.155 | 0.009 / 0.000 | 0.02 | 0.012 | 0.143 / 0.833 |
| role anchor | 1.000 | 0.139 / 0.095 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.062 / 0.035 | 0.60 | 0.000 | 0.400 / 0.000 |
| role source | 0.000 | 0.005 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role target | 0.000 | 0.005 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role region | 0.944 | 0.120 / 0.044 | 0.89 | 0.000 | 0.056 / 0.056 |
| role direction | 0.621 | 0.036 / 0.000 | 0.41 | 0.000 | 0.207 / 0.379 |
| role style | 0.000 | 0.001 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role color | 0.167 | 0.006 / 0.000 | 0.00 | 0.000 | 0.167 / 0.833 |

### train (sample) — catalog candidates (n = 300 of 918)
| axis | accuracy |
|---|---|
| FULL | 0.669±0.027 |
| FULL [depth given] | 0.669±0.027 |
| FULL [depth and negation given] | 0.669±0.026 |
| presence object: present read present | 0.971±0.006 |
| presence color: absent read absent | 0.976±0.019 |
| presence size: present read present | 0.854±0.075 |
| presence style: absent read absent | 0.958±0.020 |
| presence text: absent read absent | 0.995±0.002 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.998±0.003 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.904±0.079 |
| presence amount: share of 'present' readings that abstain | 0.105±0.027 |
| presence amount: share of true 'present' readings that abstain | 0.105±0.027 |
| presence unit: present read present | 0.932±0.025 |
| presence unit: share of 'present' readings that abstain | 0.135±0.072 |
| presence unit: share of true 'present' readings that abstain | 0.135±0.072 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.997±0.002 |
| presence target: absent read absent | 0.998±0.003 |
| presence quantity: absent read absent | 0.994±0.005 |
| structure (depth, negation) | 0.931±0.019 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.941±0.018 |
| event type (synonym table) | 0.943±0.017 |
| role object | 0.807±0.019 |
| head object | 0.843±0.024 |
| lexical order head object | 0.880±0.000 |
| lexical bag head object | 0.940±0.000 |
| occupancy: known filler | 0.887±0.011 |
| role color | 0.973±0.016 |
| head color | 0.973±0.016 |
| lexical order head color | 0.960±0.000 |
| lexical bag head color | 1.000±0.000 |
| occupancy: not given | 0.992±0.001 |
| role size | 0.980±0.007 |
| head size | 0.980±0.007 |
| lexical order head size | 0.937±0.000 |
| lexical bag head size | 1.000±0.000 |
| role style | 0.961±0.018 |
| head style | 0.961±0.018 |
| lexical order head style | 0.993±0.000 |
| lexical bag head style | 0.997±0.000 |
| role text | 0.964±0.010 |
| head text | 0.964±0.010 |
| lexical order head text | 0.840±0.000 |
| lexical bag head text | 1.000±0.000 |
| role relation | 0.993±0.002 |
| head relation | 0.993±0.002 |
| lexical order head relation | 0.863±0.000 |
| lexical bag head relation | 1.000±0.000 |
| role landmark | 0.943±0.004 |
| head landmark | 0.975±0.005 |
| lexical order head landmark | 0.863±0.000 |
| lexical bag head landmark | 0.960±0.000 |
| role region | 0.998±0.003 |
| head region | 0.998±0.003 |
| lexical order head region | 0.893±0.000 |
| lexical bag head region | 1.000±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.937±0.000 |
| lexical bag head anchor | 1.000±0.000 |
| role fraction | 0.999±0.001 |
| head fraction | 0.999±0.001 |
| lexical order head fraction | 0.963±0.000 |
| lexical bag head fraction | 1.000±0.000 |
| role amount | 0.993±0.005 |
| head amount | 0.993±0.005 |
| lexical order head amount | 0.930±0.000 |
| lexical bag head amount | 1.000±0.000 |
| role unit | 0.995±0.003 |
| head unit | 0.995±0.003 |
| lexical order head unit | 0.930±0.000 |
| lexical bag head unit | 1.000±0.000 |
| role direction | 0.994±0.003 |
| head direction | 0.994±0.003 |
| lexical order head direction | 0.957±0.000 |
| lexical bag head direction | 1.000±0.000 |
| role axis | 0.999±0.003 |
| head axis | 0.999±0.003 |
| lexical order head axis | 0.973±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 0.998±0.003 |
| head layout | 0.998±0.003 |
| lexical order head layout | 0.970±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.991±0.005 |
| head pairing | 0.991±0.005 |
| lexical order head pairing | 0.967±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.911±0.006 |
| head source | 0.927±0.006 |
| lexical order head source | 0.890±0.000 |
| lexical bag head source | 0.983±0.000 |
| role target | 0.967±0.006 |
| head target | 0.972±0.007 |
| lexical order head target | 0.923±0.000 |
| lexical bag head target | 0.977±0.000 |
| role quantity | 0.985±0.002 |
| head quantity | 0.985±0.002 |
| lexical order head quantity | 0.977±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.736±0.031 |
| heads FULL (lexical order baseline) | 0.203±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.883±0.000 |
| presence object: share of 'present' readings that abstain | 0.043±0.011 |
| presence object: share of true 'present' readings that abstain | 0.045±0.012 |
| presence size: absent read absent | 0.992±0.004 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.827±0.044 |
| presence object: absent read absent | 0.367±0.053 |
| presence direction: present read present | 0.862±0.075 |
| presence direction: share of 'present' readings that abstain | 0.123±0.036 |
| presence direction: share of true 'present' readings that abstain | 0.123±0.036 |
| presence relation: present read present | 0.975±0.016 |
| presence relation: share of 'present' readings that abstain | 0.025±0.023 |
| presence relation: share of true 'present' readings that abstain | 0.025±0.023 |
| presence landmark: present read present | 0.950±0.022 |
| presence landmark: share of 'present' readings that abstain | 0.372±0.056 |
| presence landmark: share of true 'present' readings that abstain | 0.362±0.056 |
| presence object: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence source: present read present | 0.636±0.057 |
| presence target: present read present | 0.783±0.061 |
| presence target: share of 'present' readings that abstain | 0.488±0.098 |
| presence target: share of true 'present' readings that abstain | 0.480±0.106 |
| presence text: present read present | 0.910±0.035 |
| presence text: share of 'present' readings that abstain | 0.200±0.075 |
| presence text: share of true 'present' readings that abstain | 0.190±0.072 |
| presence source: share of 'present' readings that abstain | 0.723±0.119 |
| presence source: share of true 'present' readings that abstain | 0.711±0.126 |
| presence color: present read present | 0.867±0.067 |
| presence region: present read present | 0.981±0.025 |
| presence region: share of 'present' readings that abstain | 0.046±0.057 |
| presence region: share of true 'present' readings that abstain | 0.046±0.057 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.209±0.133 |
| presence quantity: share of true 'present' readings that abstain | 0.033±0.067 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence style: present read present | 0.900±0.200 |
| presence color: share of 'present' readings that abstain | 0.461±0.164 |
| presence color: share of FALSE 'present' readings that abstain | 0.987±0.027 |
| presence size: share of 'present' readings that abstain | 0.303±0.103 |
| presence size: share of true 'present' readings that abstain | 0.203±0.096 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.063±0.039 |
| presence anchor: share of true 'present' readings that abstain | 0.063±0.039 |
| presence style: share of 'present' readings that abstain | 0.936±0.062 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence quantity: share of FALSE 'present' readings that abstain | nan±nan |
| presence fraction: present read present | 0.982±0.036 |
| presence fraction: share of 'present' readings that abstain | 0.151±0.101 |
| presence fraction: share of true 'present' readings that abstain | 0.151±0.101 |
| presence color: share of true 'present' readings that abstain | 0.209±0.068 |
| presence text: share of FALSE 'present' readings that abstain | 0.500±0.447 |
| presence size: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence pairing: present read present | 0.943±0.114 |
| presence pairing: share of 'present' readings that abstain | 0.076±0.063 |
| presence pairing: share of true 'present' readings that abstain | 0.076±0.063 |
| presence layout: present read present | 0.933±0.089 |
| presence layout: share of 'present' readings that abstain | 0.089±0.083 |
| presence layout: share of true 'present' readings that abstain | 0.089±0.083 |
| presence style: share of true 'present' readings that abstain | 0.600±0.374 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.396±0.010; status {'abstain': 257, 'ok': 30, 'no-sense': 13}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.950 | 0.225 / 0.126 | 0.97 | 0.043 | 0.027 / 0.007 |
| role object | 0.858 | 0.203 / 0.049 | 0.90 | 0.069 | 0.029 / 0.073 |
| roles (pooled) | 0.806 | 0.141 / 0.002 | 0.80 | 0.056 | 0.065 / 0.138 |
| role size | 0.684 | 0.048 / 0.000 | 0.47 | 0.000 | 0.211 / 0.316 |
| role amount | 0.952 | 0.094 / 0.034 | 0.86 | 0.000 | 0.095 / 0.048 |
| role unit | 0.905 | 0.127 / 0.009 | 0.86 | 0.000 | 0.048 / 0.095 |
| role direction | 0.923 | 0.107 / 0.032 | 0.85 | 0.000 | 0.077 / 0.077 |
| role relation | 0.927 | 0.129 / 0.106 | 0.93 | 0.000 | 0.000 / 0.073 |
| role landmark | 0.585 | 0.056 / 0.002 | 0.56 | 0.146 | 0.171 / 0.268 |
| role source | 0.152 | 0.017 / 0.000 | 0.12 | 0.061 | 0.091 / 0.788 |
| role target | 0.478 | 0.042 / 0.000 | 0.48 | 0.087 | 0.087 / 0.435 |
| role text | 0.896 | 0.089 / 0.011 | 0.75 | 0.021 | 0.167 / 0.083 |
| role color | 0.917 | 0.075 / 0.005 | 0.67 | 0.000 | 0.250 / 0.083 |
| role region | 1.000 | 0.168 / 0.086 | 1.00 | 0.000 | 0.000 / 0.000 |
| role quantity | 0.429 | 0.134 / 0.111 | 1.00 | 0.571 | 0.000 / 0.000 |
| role axis | 1.000 | 0.149 / 0.109 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.500 | 0.036 / 0.007 | 0.50 | 0.000 | 0.000 / 0.500 |
| role anchor | 1.000 | 0.148 / 0.104 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 0.909 | 0.080 / 0.020 | 0.64 | 0.000 | 0.273 / 0.091 |
| role pairing | 0.800 | 0.130 / 0.092 | 1.00 | 0.200 | 0.000 / 0.000 |
| role layout | 0.778 | 0.153 / 0.000 | 0.78 | 0.000 | 0.000 / 0.222 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 COMPONENT=0.61 ANCHOR=0.26 the=0.25 REGION=0.23 LABEL=0.22 front=0.21 UNIT=0.21 PAIR=0.21 FILLER=0.19 color=0.19 INTRO=0.17 back=0.17 AXIS=0.16 apart=0.15 do=0.14 flow=0.14 LAYOUT=0.12 together=0.12 unknown=0.12 DIR=0.11 PRON=0.11 NUM=0.10 not=0.10 are=0.09 never=0.09 a=0.09 is=0.08 VERB=0.08 QUANT=0.08 evenly=0.08 REL=0.08 SIZE=0.07 DEM=0.06 FRACTION=0.06 COLOR=0.04 STYLE=0.04

## What is weak, what to add
- heldout_formulations: FULL 0.461
- heldout_formulations: role object 0.674
- heldout_formulations: head object 0.713
- heldout_formulations: determiner identity (outside FULL when the legend excludes it) 0.819
- heldout_formulations: occupancy: known filler 0.851
- heldout_formulations: role source 0.848
- heldout_formulations: head source 0.848
- heldout_formulations: role target 0.893
- heldout_formulations: head target 0.893
- heldout_formulations: heads FULL (model) 0.517
- heldout_formulations: heads FULL (lexical order baseline) 0.292
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.287
- heldout_formulations: FULL [depth given] 0.461
- heldout_formulations: FULL [depth and negation given] 0.461
- heldout_formulations: FULL [presence not decided] 0.393
- heldout_formulations: role object [presence not decided] 0.764
- heldout_formulations: role color [presence not decided] 0.736
- heldout_formulations: role size [presence not decided] 0.882
- heldout_formulations: role style [presence not decided] 0.899
- heldout_formulations: role landmark [presence not decided] 0.848
- heldout_formulations: role source [presence not decided] 0.820
- heldout_formulations: role target [presence not decided] 0.848
- heldout_formulations: heads FULL (model) [presence not decided] 0.421
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.315
- heldout_formulations: role object [pooled midpoint (comparison)] 0.444
- heldout_formulations: role source [pooled midpoint (comparison)] 0.854
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.365
- heldout_formulations: presence object: absent read absent 0.800
- heldout_formulations: presence direction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence object: absent read absent [pooled midpoint (comparison)] 0.800
- heldout_formulations: presence object: share of 'present' readings that abstain 0.052
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.052
- heldout_formulations: presence relation: present read present 0.857
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.167
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.167
- heldout_formulations: presence landmark: present read present 0.857
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.556
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.556
- heldout_formulations: presence object: present read present [pooled midpoint (comparison)] 0.784
- heldout_formulations: presence relation: present read present [pooled midpoint (comparison)] 0.789
- heldout_formulations: presence landmark: present read present [pooled midpoint (comparison)] 0.895
- heldout_formulations: presence text: share of 'present' readings that abstain 0.304
- heldout_formulations: presence text: share of true 'present' readings that abstain 0.286
- heldout_formulations: presence target: share of 'present' readings that abstain 0.741
- heldout_formulations: presence target: share of true 'present' readings that abstain 0.741
- heldout_formulations: presence size: present read present 0.500
- heldout_formulations: presence size: present read present [pooled midpoint (comparison)] 0.727
- heldout_formulations: presence quantity: present read present 0.500
- heldout_formulations: presence quantity: share of 'present' readings that abstain 0.714
- heldout_formulations: presence quantity: share of true 'present' readings that abstain 0.714
- heldout_formulations: presence quantity: present read present [pooled midpoint (comparison)] 0.417
- heldout_formulations: presence size: share of 'present' readings that abstain 0.636
- heldout_formulations: presence size: share of FALSE 'present' readings that abstain 0.600
- heldout_formulations: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of 'present' readings that abstain 0.111
- heldout_formulations: presence fraction: share of true 'present' readings that abstain 0.111
- heldout_formulations: presence region: share of 'present' readings that abstain 0.000
- heldout_formulations: presence region: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence size: share of true 'present' readings that abstain 0.667
- heldout_formulations: presence amount: present read present 0.800
- heldout_formulations: presence unit: present read present 0.600
- heldout_formulations: presence amount: present read present [pooled midpoint (comparison)] 0.500
- heldout_formulations: presence unit: present read present [pooled midpoint (comparison)] 0.500
- heldout_formulations: presence object: share of FALSE 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of 'present' readings that abstain 0.800
- heldout_formulations: presence amount: share of true 'present' readings that abstain 0.750
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.333
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.333
- heldout_formulations: presence style: present read present 0.500
- heldout_formulations: presence text: share of FALSE 'present' readings that abstain 0.500
- heldout_sentences: FULL 0.634
- heldout_sentences: presence object: share of 'present' readings that abstain 0.041
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.030
- heldout_sentences: presence layout: share of 'present' readings that abstain 0.167
- heldout_sentences: presence layout: share of true 'present' readings that abstain 0.000
- heldout_sentences: role object 0.768
- heldout_sentences: head object 0.829
- heldout_sentences: determiner identity (outside FULL when the legend excludes it) 0.633
- heldout_sentences: occupancy: known filler 0.817
- heldout_sentences: role source 0.854
- heldout_sentences: head source 0.866
- heldout_sentences: heads FULL (model) 0.683
- heldout_sentences: heads FULL (lexical order baseline) 0.146
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.256
- heldout_sentences: FULL [depth given] 0.634
- heldout_sentences: FULL [depth and negation given] 0.634
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.366
- heldout_sentences: role object [pooled midpoint (comparison)] 0.476
- heldout_sentences: role source [pooled midpoint (comparison)] 0.854
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.451
- heldout_sentences: presence object: present read present [pooled midpoint (comparison)] 0.714
- heldout_sentences: presence region: share of 'present' readings that abstain 0.000
- heldout_sentences: presence region: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence object: absent read absent 0.250
- heldout_sentences: presence direction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence direction: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence object: absent read absent [pooled midpoint (comparison)] 0.400
- heldout_sentences: presence text: share of 'present' readings that abstain 0.143
- heldout_sentences: presence text: share of true 'present' readings that abstain 0.143
- heldout_sentences: presence color: present read present 0.000
- heldout_sentences: presence size: present read present 0.800
- heldout_sentences: presence size: share of 'present' readings that abstain 0.000
- heldout_sentences: presence size: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence quantity: share of 'present' readings that abstain 0.000
- heldout_sentences: presence quantity: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence relation: present read present 0.800
- heldout_sentences: presence relation: share of 'present' readings that abstain 0.000
- heldout_sentences: presence relation: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence landmark: present read present 0.600
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.667
- heldout_sentences: presence landmark: share of true 'present' readings that abstain 0.667
- heldout_sentences: presence relation: present read present [pooled midpoint (comparison)] 0.750
- heldout_sentences: presence landmark: present read present [pooled midpoint (comparison)] 0.750
- heldout_sentences: presence source: present read present 0.333
- heldout_sentences: presence target: present read present 0.800
- heldout_sentences: presence target: share of 'present' readings that abstain 0.500
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.500
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.500
- heldout_sentences: presence anchor: present read present 0.833
- heldout_sentences: presence anchor: share of 'present' readings that abstain 0.000
- heldout_sentences: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence axis: share of 'present' readings that abstain 0.000
- heldout_sentences: presence axis: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence object: share of FALSE 'present' readings that abstain 0.167
- heldout_sentences: presence color: share of 'present' readings that abstain 0.750
- heldout_sentences: presence color: share of FALSE 'present' readings that abstain 0.750
- heldout_sentences: presence style: present read present 0.000
- heldout_sentences: presence amount: share of 'present' readings that abstain 0.500
- heldout_sentences: presence amount: share of true 'present' readings that abstain 0.500
- heldout_sentences: presence unit: present read present 0.500
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.000
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence pairing: share of 'present' readings that abstain 0.000
- heldout_sentences: presence pairing: share of true 'present' readings that abstain 0.000
- new_identities: FULL 0.530
- new_identities: presence object: share of 'present' readings that abstain 0.110
- new_identities: presence object: share of true 'present' readings that abstain 0.110
- new_identities: presence size: present read present 0.808
- new_identities: presence size: share of 'present' readings that abstain 0.333
- new_identities: presence size: share of true 'present' readings that abstain 0.286
- new_identities: presence amount: share of 'present' readings that abstain 0.266
- new_identities: presence amount: share of true 'present' readings that abstain 0.266
- new_identities: presence unit: present read present 0.890
- new_identities: presence unit: share of 'present' readings that abstain 0.124
- new_identities: presence unit: share of true 'present' readings that abstain 0.124
- new_identities: role object 0.743
- new_identities: head object 0.785
- new_identities: occupancy: known filler 0.863
- new_identities: role text 0.868
- new_identities: head text 0.868
- new_identities: role landmark 0.863
- new_identities: head landmark 0.895
- new_identities: occupancy: unknown filler 0.750
- new_identities: heads FULL (model) 0.578
- new_identities: heads FULL (lexical order baseline) 0.060
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.205
- new_identities: FULL [depth given] 0.530
- new_identities: FULL [depth and negation given] 0.530
- new_identities: FULL [pooled midpoint (comparison)] 0.223
- new_identities: role object [pooled midpoint (comparison)] 0.347
- new_identities: role text [pooled midpoint (comparison)] 0.738
- new_identities: role landmark [pooled midpoint (comparison)] 0.858
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.273
- new_identities: presence object: present read present [pooled midpoint (comparison)] 0.594
- new_identities: presence size: present read present [pooled midpoint (comparison)] 0.870
- new_identities: presence amount: present read present [pooled midpoint (comparison)] 0.890
- new_identities: presence text: present read present 0.831
- new_identities: presence text: share of 'present' readings that abstain 0.261
- new_identities: presence text: share of true 'present' readings that abstain 0.218
- new_identities: presence text: present read present [pooled midpoint (comparison)] 0.867
- new_identities: presence text: share of FALSE 'present' readings that abstain 0.714
- new_identities: presence relation: present read present 0.861
- new_identities: presence landmark: present read present 0.684
- new_identities: presence anchor: share of 'present' readings that abstain 0.000
- new_identities: presence anchor: share of true 'present' readings that abstain 0.000
- new_identities: presence fraction: share of 'present' readings that abstain 0.200
- new_identities: presence fraction: share of true 'present' readings that abstain 0.200
- new_identities: presence source: present read present 0.571
- new_identities: presence target: present read present 0.393
- new_identities: presence target: share of 'present' readings that abstain 0.818
- new_identities: presence target: share of true 'present' readings that abstain 0.818
- new_identities: determiner identity (outside FULL when the legend excludes it) 0.885
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.609
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.478
- new_identities: presence relation: share of 'present' readings that abstain 0.103
- new_identities: presence relation: share of true 'present' readings that abstain 0.103
- new_identities: presence relation: present read present [pooled midpoint (comparison)] 0.785
- new_identities: presence landmark: present read present [pooled midpoint (comparison)] 0.692
- new_identities: presence landmark: share of 'present' readings that abstain 0.732
- new_identities: presence landmark: share of true 'present' readings that abstain 0.722
- new_identities: presence region: share of 'present' readings that abstain 0.059
- new_identities: presence region: share of true 'present' readings that abstain 0.059
- new_identities: presence direction: present read present 0.692
- new_identities: presence direction: share of 'present' readings that abstain 0.167
- new_identities: presence direction: share of true 'present' readings that abstain 0.167
- new_identities: presence direction: present read present [pooled midpoint (comparison)] 0.708
- new_identities: presence size: share of FALSE 'present' readings that abstain 0.667
- new_identities: presence color: share of 'present' readings that abstain 0.769
- new_identities: presence object: absent read absent 0.077
- new_identities: presence object: share of FALSE 'present' readings that abstain 0.083
- new_identities: presence object: absent read absent [pooled midpoint (comparison)] 0.111
- new_identities: presence style: present read present [pooled midpoint (comparison)] 0.750
- new_identities: presence style: present read present 0.250
- new_identities: presence color: present read present 0.750
- new_identities: presence color: share of true 'present' readings that abstain 0.333
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.750
- train (sample): FULL 0.690
- train (sample): presence size: present read present 0.722
- train (sample): presence amount: share of 'present' readings that abstain 0.100
- train (sample): presence amount: share of true 'present' readings that abstain 0.100
- train (sample): presence unit: share of 'present' readings that abstain 0.053
- train (sample): presence unit: share of true 'present' readings that abstain 0.053
- train (sample): role object 0.820
- train (sample): head object 0.850
- train (sample): occupancy: known filler 0.896
- train (sample): heads FULL (model) 0.750
- train (sample): heads FULL (lexical order baseline) 0.203
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.883
- train (sample): FULL [depth given] 0.690
- train (sample): FULL [depth and negation given] 0.690
- train (sample): presence object: share of 'present' readings that abstain 0.048
- train (sample): presence object: share of true 'present' readings that abstain 0.050
- train (sample): determiner identity (outside FULL when the legend excludes it) 0.879
- train (sample): presence object: absent read absent 0.348
- train (sample): presence direction: share of 'present' readings that abstain 0.083
- train (sample): presence direction: share of true 'present' readings that abstain 0.083
- train (sample): presence relation: share of 'present' readings that abstain 0.000
- train (sample): presence relation: share of true 'present' readings that abstain 0.000
- train (sample): presence landmark: share of 'present' readings that abstain 0.425
- train (sample): presence landmark: share of true 'present' readings that abstain 0.395
- train (sample): presence object: share of FALSE 'present' readings that abstain 0.000
- train (sample): presence source: present read present 0.645
- train (sample): presence target: present read present 0.739
- train (sample): presence target: share of 'present' readings that abstain 0.389
- train (sample): presence target: share of true 'present' readings that abstain 0.353
- train (sample): presence text: share of 'present' readings that abstain 0.200
- train (sample): presence text: share of true 'present' readings that abstain 0.186
- train (sample): presence source: share of 'present' readings that abstain 0.800
- train (sample): presence source: share of true 'present' readings that abstain 0.800
- train (sample): presence region: share of 'present' readings that abstain 0.000
- train (sample): presence region: share of true 'present' readings that abstain 0.000
- train (sample): presence quantity: share of 'present' readings that abstain 0.250
- train (sample): presence quantity: share of true 'present' readings that abstain 0.000
- train (sample): presence axis: share of 'present' readings that abstain 0.000
- train (sample): presence axis: share of true 'present' readings that abstain 0.000
- train (sample): presence style: present read present 0.500
- train (sample): presence color: share of 'present' readings that abstain 0.579
- train (sample): presence size: share of 'present' readings that abstain 0.471
- train (sample): presence size: share of true 'present' readings that abstain 0.308
- train (sample): presence anchor: share of 'present' readings that abstain 0.000
- train (sample): presence anchor: share of true 'present' readings that abstain 0.000
- train (sample): presence style: share of 'present' readings that abstain 0.833
- train (sample): presence fraction: share of 'present' readings that abstain 0.300
- train (sample): presence fraction: share of true 'present' readings that abstain 0.300
- train (sample): presence color: share of true 'present' readings that abstain 0.273
- train (sample): presence text: share of FALSE 'present' readings that abstain 0.500
- train (sample): presence pairing: share of 'present' readings that abstain 0.000
- train (sample): presence pairing: share of true 'present' readings that abstain 0.000
- train (sample): presence layout: present read present 0.778
- train (sample): presence layout: share of 'present' readings that abstain 0.000
- train (sample): presence layout: share of true 'present' readings that abstain 0.000
- train (sample): presence style: share of true 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_formulations: `would you connect the COMPONENT and the COMPONENT with a STYLE COMPONENT` FULL 0.000 (n 2)
- heldout_formulations: `please connect the COMPONENT to the COMPONENT with a COMPONENT .` FULL 0.000 (n 2)
- new_identities: `make LABEL STYLE please` FULL 0.000 (n 2)
- new_identities: `could you move the COMPONENT NUM UNIT DIR` FULL 0.000 (n 2)
- new_identities: `okay so join the COMPONENT to LABEL with a COLOR COMPONENT .` FULL 0.000 (n 2)
- new_identities: `i need you to group the COMPONENT into a container called LABEL .` FULL 0.000 (n 2)
- new_identities: `can you join LABEL to the COMPONENT` FULL 0.000 (n 2)
- heldout_formulations: `okay so erase QUANT COMPONENT that are not COLOR .` FULL 0.000 (n 1)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role size | role style | role text | role relation | role landmark | role region | role anchor | role fraction | role amount | role unit | role direction | role axis | role layout | role pairing | role source | role target | role quantity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.553±0.035 | 0.498±0.029 | 0.679±0.021 | 0.965±0.022 | 0.963±0.014 | 0.955±0.020 | 0.948±0.015 | 0.983±0.004 | 0.940±0.011 | 0.998±0.003 | 1.000±0.000 | 1.000±0.000 | 0.985±0.012 | 0.993±0.006 | 0.989±0.004 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.849±0.006 | 0.912±0.019 | 0.963±0.013 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.360±0.021 | 0.294±0.019 | 0.398±0.031 | 0.990±0.010 | 0.964±0.014 | 0.942±0.017 | 0.925±0.008 | 0.975±0.006 | 0.942±0.008 | 0.992±0.006 | 1.000±0.000 | 1.000±0.000 | 0.983±0.013 | 0.991±0.006 | 0.993±0.002 | 1.000±0.000 | 1.000±0.000 | 0.999±0.002 | 0.862±0.010 | 0.920±0.017 | 0.956±0.014 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.417±0.013 | 0.392±0.013 | 0.779±0.013 | 0.736±0.000 | 0.882±0.000 | 0.899±0.000 | 0.926±0.011 | 1.000±0.000 | 0.836±0.018 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.974±0.013 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.990±0.002 | 1.000±0.000 | 0.828±0.009 | 0.854±0.022 | 0.974±0.013 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 0.958±0.009 | 0.770±0.024 | 0.864±0.015 | 0.036±0.016 (0.000±0.000 / 0.037±0.017) |
| heldout_formulations | object | comparison: pooled midpoint | 0.737±0.031 | 0.880±0.098 | 0.808±0.053 |  |
| heldout_formulations | color | product: fitted | — | 0.962±0.023 | — | 0.969±0.062 (0.969±0.062 / —) |
| heldout_formulations | color | comparison: pooled midpoint | — | 0.987±0.012 | — |  |
| heldout_formulations | size | product: fitted | 0.750±0.139 | 0.976±0.011 | 0.863±0.070 | 0.395±0.140 (0.800±0.179 / 0.296±0.195) |
| heldout_formulations | size | comparison: pooled midpoint | 0.811±0.065 | 0.970±0.017 | 0.890±0.036 |  |
| heldout_formulations | style | product: fitted | 0.867±0.194 | 0.955±0.023 | 0.911±0.095 | 1.000±0.000 (1.000±0.000 / 1.000±0.000) |
| heldout_formulations | style | comparison: pooled midpoint | 0.960±0.080 | 0.939±0.021 | 0.949±0.030 |  |
| heldout_formulations | text | product: fitted | 0.917±0.060 | 0.966±0.013 | 0.942±0.033 | 0.270±0.026 (0.515±0.151 / 0.214±0.065) |
| heldout_formulations | text | comparison: pooled midpoint | 0.960±0.053 | 0.962±0.008 | 0.961±0.025 |  |
| heldout_formulations | relation | product: fitted | 0.901±0.028 | 1.000±0.000 | 0.951±0.014 | 0.154±0.050 (— / 0.154±0.050) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.915±0.085 | 1.000±0.000 | 0.958±0.043 |  |
| heldout_formulations | landmark | product: fitted | 0.712±0.112 | 0.997±0.006 | 0.855±0.055 | 0.557±0.060 (1.000 / 0.548±0.048) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.792±0.084 | 0.997±0.004 | 0.894±0.042 |  |
| heldout_formulations | region | product: fitted | 0.969±0.038 | 1.000±0.000 | 0.985±0.019 | 0.047±0.062 (— / 0.047±0.062) |
| heldout_formulations | region | comparison: pooled midpoint | 0.892±0.078 | 1.000±0.000 | 0.946±0.039 |  |
| heldout_formulations | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.133±0.163 (— / 0.133±0.163) |
| heldout_formulations | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | amount | product: fitted | 0.720±0.204 | 0.993±0.009 | 0.856±0.104 | 0.435±0.216 (0.667±0.471 / 0.397±0.244) |
| heldout_formulations | amount | comparison: pooled midpoint | 0.690±0.215 | 0.991±0.012 | 0.841±0.109 |  |
| heldout_formulations | unit | product: fitted | 0.760±0.196 | 1.000±0.000 | 0.880±0.098 | 0.280±0.142 (— / 0.280±0.142) |
| heldout_formulations | unit | comparison: pooled midpoint | 0.730±0.172 | 1.000±0.000 | 0.865±0.086 |  |
| heldout_formulations | direction | product: fitted | 0.700±0.400 | 1.000±0.000 | 0.850±0.200 | 0.500±0.500 (— / 0.500±0.500) |
| heldout_formulations | direction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | axis | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | layout | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | source | product: fitted | 0.913±0.045 | 0.987±0.007 | 0.950±0.020 | 0.899±0.063 (0.875±0.217 / 0.900±0.072) |
| heldout_formulations | source | comparison: pooled midpoint | 0.932±0.036 | 0.991±0.008 | 0.962±0.017 |  |
| heldout_formulations | target | product: fitted | 0.945±0.017 | 0.997±0.004 | 0.971±0.008 | 0.721±0.096 (1.000±0.000 / 0.717±0.098) |
| heldout_formulations | target | comparison: pooled midpoint | 0.979±0.017 | 0.993±0.007 | 0.986±0.008 |  |
| heldout_formulations | quantity | product: fitted | 0.709±0.141 | 0.995±0.008 | 0.852±0.069 | 0.486±0.198 (1.000±0.000 / 0.445±0.219) |
| heldout_formulations | quantity | comparison: pooled midpoint | 0.684±0.152 | 0.995±0.010 | 0.840±0.074 |  |
| heldout_sentences | object | product: fitted | 0.971±0.010 | 0.350±0.094 | 0.660±0.043 | 0.036±0.014 (0.067±0.082 / 0.033±0.014) |
| heldout_sentences | object | comparison: pooled midpoint | 0.683±0.027 | 0.444±0.128 | 0.564±0.053 |  |
| heldout_sentences | color | product: fitted | 0.000±0.000 | 0.973±0.015 | 0.487±0.007 | 0.950±0.100 (0.950±0.100 / —) |
| heldout_sentences | color | comparison: pooled midpoint | — | 0.983±0.010 | — |  |
| heldout_sentences | size | product: fitted | 0.880±0.160 | 1.000±0.000 | 0.940±0.080 | 0.267±0.198 (— / 0.267±0.198) |
| heldout_sentences | size | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | style | product: fitted | 0.400±0.374 | 0.965±0.014 | 0.683±0.184 | 1.000±0.000 (1.000±0.000 / 1.000±0.000) |
| heldout_sentences | style | comparison: pooled midpoint | 0.800±0.400 | 0.945±0.012 | 0.873±0.199 |  |
| heldout_sentences | text | product: fitted | 0.930±0.002 | 0.997±0.006 | 0.964±0.004 | 0.278±0.113 (1.000 / 0.268±0.107) |
| heldout_sentences | text | comparison: pooled midpoint | 0.907±0.058 | 1.000±0.000 | 0.954±0.029 |  |
| heldout_sentences | relation | product: fitted | 0.920±0.098 | 1.000±0.000 | 0.960±0.049 | 0.120±0.098 (— / 0.120±0.098) |
| heldout_sentences | relation | comparison: pooled midpoint | 0.950±0.100 | 1.000±0.000 | 0.975±0.050 |  |
| heldout_sentences | landmark | product: fitted | 0.880±0.160 | 1.000±0.000 | 0.940±0.080 | 0.593±0.137 (— / 0.593±0.137) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.950±0.100 | 1.000±0.000 | 0.975±0.050 |  |
| heldout_sentences | region | product: fitted | 0.978±0.044 | 1.000±0.000 | 0.989±0.022 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | region | comparison: pooled midpoint | 0.911±0.044 | 1.000±0.000 | 0.956±0.022 |  |
| heldout_sentences | anchor | product: fitted | 0.867±0.067 | 1.000±0.000 | 0.933±0.033 | 0.033±0.067 (— / 0.033±0.067) |
| heldout_sentences | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | fraction | product: fitted | — | 1.000±0.000 | — |  |
| heldout_sentences | fraction | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_sentences | amount | product: fitted | 0.800±0.245 | 1.000±0.000 | 0.900±0.122 | 0.300±0.400 (— / 0.300±0.400) |
| heldout_sentences | amount | comparison: pooled midpoint | 0.900±0.200 | 1.000±0.000 | 0.950±0.100 |  |
| heldout_sentences | unit | product: fitted | 0.700±0.245 | 1.000±0.000 | 0.850±0.122 | 0.400±0.374 (— / 0.400±0.374) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.800±0.245 | 1.000±0.000 | 0.900±0.122 |  |
| heldout_sentences | direction | product: fitted | 0.950±0.100 | 1.000±0.000 | 0.975±0.050 | 0.150±0.122 (— / 0.150±0.122) |
| heldout_sentences | direction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | axis | product: fitted | 0.933±0.133 | 1.000±0.000 | 0.967±0.067 | 0.067±0.133 (— / 0.067±0.133) |
| heldout_sentences | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | layout | product: fitted | 1.000±0.000 | 0.997±0.006 | 0.999±0.003 | 0.033±0.067 (1.000 / 0.000±0.000) |
| heldout_sentences | layout | comparison: pooled midpoint | 1.000±0.000 | 0.996±0.007 | 0.998±0.004 |  |
| heldout_sentences | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | source | product: fitted | 0.444±0.099 | 0.997±0.006 | 0.721±0.051 | 0.960±0.080 (1.000 / 0.960±0.080) |
| heldout_sentences | source | comparison: pooled midpoint | 0.563±0.127 | 0.996±0.007 | 0.780±0.064 |  |
| heldout_sentences | target | product: fitted | 0.760±0.080 | 1.000±0.000 | 0.880±0.040 | 0.467±0.172 (— / 0.467±0.172) |
| heldout_sentences | target | comparison: pooled midpoint | 0.900±0.122 | 1.000±0.000 | 0.950±0.061 |  |
| heldout_sentences | quantity | product: fitted | 1.000±0.000 | 0.997±0.005 | 0.999±0.003 | 0.300±0.267 (1.000 / 0.267±0.249) |
| heldout_sentences | quantity | comparison: pooled midpoint | 1.000±0.000 | 0.996±0.007 | 0.998±0.004 |  |
| new_identities | object | product: fitted | 0.934±0.023 | 0.046±0.038 | 0.490±0.019 | 0.102±0.016 (0.017±0.033 / 0.105±0.016) |
| new_identities | object | comparison: pooled midpoint | 0.535±0.035 | 0.236±0.116 | 0.385±0.046 |  |
| new_identities | color | product: fitted | 0.760±0.159 | 0.982±0.011 | 0.871±0.075 | 0.757±0.083 (0.980±0.040 / 0.453±0.105) |
| new_identities | color | comparison: pooled midpoint | 0.700±0.100 | 0.995±0.004 | 0.847±0.049 |  |
| new_identities | size | product: fitted | 0.875±0.063 | 0.995±0.004 | 0.935±0.032 | 0.249±0.082 (0.778±0.157 / 0.210±0.076) |
| new_identities | size | comparison: pooled midpoint | 0.938±0.053 | 0.994±0.005 | 0.966±0.027 |  |
| new_identities | style | product: fitted | 0.627±0.287 | 0.965±0.019 | 0.796±0.134 | 0.989±0.022 (1.000±0.000 / 0.933±0.133) |
| new_identities | style | comparison: pooled midpoint | 0.883±0.145 | 0.963±0.009 | 0.923±0.075 |  |
| new_identities | text | product: fitted | 0.807±0.039 | 0.942±0.010 | 0.874±0.022 | 0.250±0.043 (0.528±0.163 / 0.226±0.040) |
| new_identities | text | comparison: pooled midpoint | 0.858±0.038 | 0.951±0.011 | 0.905±0.016 |  |
| new_identities | relation | product: fitted | 0.809±0.079 | 1.000±0.000 | 0.905±0.039 | 0.100±0.033 (— / 0.100±0.033) |
| new_identities | relation | comparison: pooled midpoint | 0.805±0.086 | 1.000±0.000 | 0.903±0.043 |  |
| new_identities | landmark | product: fitted | 0.714±0.048 | 0.997±0.003 | 0.855±0.024 | 0.649±0.055 (0.667±0.471 / 0.648±0.055) |
| new_identities | landmark | comparison: pooled midpoint | 0.742±0.064 | 0.999±0.002 | 0.871±0.032 |  |
| new_identities | region | product: fitted | 0.977±0.028 | 1.000±0.000 | 0.989±0.014 | 0.036±0.029 (— / 0.036±0.029) |
| new_identities | region | comparison: pooled midpoint | 0.987±0.027 | 1.000±0.000 | 0.993±0.013 |  |
| new_identities | anchor | product: fitted | 0.985±0.031 | 1.000±0.000 | 0.992±0.015 | 0.047±0.039 (— / 0.047±0.039) |
| new_identities | anchor | comparison: pooled midpoint | 0.938±0.058 | 1.000±0.000 | 0.969±0.029 |  |
| new_identities | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.120±0.098 (— / 0.120±0.098) |
| new_identities | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | amount | product: fitted | 0.822±0.103 | 1.000±0.000 | 0.911±0.052 | 0.219±0.045 (— / 0.219±0.045) |
| new_identities | amount | comparison: pooled midpoint | 0.859±0.068 | 1.000±0.000 | 0.930±0.034 |  |
| new_identities | unit | product: fitted | 0.881±0.037 | 1.000±0.000 | 0.941±0.018 | 0.154±0.051 (— / 0.154±0.051) |
| new_identities | unit | comparison: pooled midpoint | 0.924±0.045 | 1.000±0.000 | 0.962±0.022 |  |
| new_identities | direction | product: fitted | 0.610±0.077 | 1.000±0.000 | 0.805±0.039 | 0.306±0.099 (— / 0.306±0.099) |
| new_identities | direction | comparison: pooled midpoint | 0.723±0.019 | 1.000±0.000 | 0.862±0.010 |  |
| new_identities | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | source | product: fitted | 0.650±0.064 | 0.995±0.003 | 0.822±0.031 | 0.908±0.059 (1.000±0.000 / 0.898±0.069) |
| new_identities | source | comparison: pooled midpoint | 0.687±0.043 | 0.991±0.006 | 0.839±0.024 |  |
| new_identities | target | product: fitted | 0.559±0.084 | 0.998±0.002 | 0.778±0.041 | 0.885±0.097 (0.500±0.500 / 0.905±0.097) |
| new_identities | target | comparison: pooled midpoint | 0.637±0.080 | 0.994±0.005 | 0.815±0.039 |  |
| new_identities | quantity | product: fitted | — | 0.975±0.029 | — | 0.893±0.137 (0.893±0.137 / —) |
| new_identities | quantity | comparison: pooled midpoint | — | 0.980±0.025 | — |  |
| train (sample) | object | product: fitted | 0.971±0.006 | 0.367±0.053 | 0.669±0.024 | 0.043±0.011 (0.000±0.000 / 0.045±0.012) |
| train (sample) | color | product: fitted | 0.867±0.067 | 0.976±0.019 | 0.921±0.030 | 0.461±0.164 (0.987±0.027 / 0.209±0.068) |
| train (sample) | size | product: fitted | 0.854±0.075 | 0.992±0.004 | 0.923±0.039 | 0.303±0.103 (1.000±0.000 / 0.203±0.096) |
| train (sample) | style | product: fitted | 0.900±0.200 | 0.958±0.020 | 0.929±0.094 | 0.936±0.062 (1.000±0.000 / 0.600±0.374) |
| train (sample) | text | product: fitted | 0.910±0.035 | 0.995±0.002 | 0.952±0.017 | 0.200±0.075 (0.500±0.447 / 0.190±0.072) |
| train (sample) | relation | product: fitted | 0.975±0.016 | 1.000±0.000 | 0.988±0.008 | 0.025±0.023 (— / 0.025±0.023) |
| train (sample) | landmark | product: fitted | 0.950±0.022 | 0.998±0.003 | 0.974±0.012 | 0.372±0.056 (1.000±0.000 / 0.362±0.056) |
| train (sample) | region | product: fitted | 0.981±0.025 | 1.000±0.000 | 0.991±0.013 | 0.046±0.057 (— / 0.046±0.057) |
| train (sample) | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.063±0.039 (— / 0.063±0.039) |
| train (sample) | fraction | product: fitted | 0.982±0.036 | 1.000±0.000 | 0.991±0.018 | 0.151±0.101 (— / 0.151±0.101) |
| train (sample) | amount | product: fitted | 0.904±0.079 | 1.000±0.000 | 0.952±0.040 | 0.105±0.027 (— / 0.105±0.027) |
| train (sample) | unit | product: fitted | 0.932±0.025 | 1.000±0.000 | 0.966±0.012 | 0.135±0.072 (— / 0.135±0.072) |
| train (sample) | direction | product: fitted | 0.862±0.075 | 1.000±0.000 | 0.931±0.038 | 0.123±0.036 (— / 0.123±0.036) |
| train (sample) | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | layout | product: fitted | 0.933±0.089 | 1.000±0.000 | 0.967±0.044 | 0.089±0.083 (— / 0.089±0.083) |
| train (sample) | pairing | product: fitted | 0.943±0.114 | 1.000±0.000 | 0.971±0.057 | 0.076±0.063 (— / 0.076±0.063) |
| train (sample) | source | product: fitted | 0.636±0.057 | 0.997±0.002 | 0.816±0.029 | 0.723±0.119 (1.000±0.000 / 0.711±0.126) |
| train (sample) | target | product: fitted | 0.783±0.061 | 0.998±0.003 | 0.890±0.030 | 0.488±0.098 (0.750±0.250 / 0.480±0.106) |
| train (sample) | quantity | product: fitted | 1.000±0.000 | 0.994±0.005 | 0.997±0.002 | 0.209±0.133 (0.812±0.207 / 0.033±0.067) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
