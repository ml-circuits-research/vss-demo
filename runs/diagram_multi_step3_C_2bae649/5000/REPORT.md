# REPORT — world `diagram_multi`, legend sha256:d361fbea318b… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
7000 annotated sentences from 6 files; provenance: {'generator': 7000}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/5000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 200 sentences
- calibration_heldout_formulations_en: 223 sentences
- heldout_formulations: 200 sentences
- heldout_formulations_en: 177 sentences
- heldout_sentences: 476 sentences
- mixed: 400 sentences
- new_identities: 400 sentences
- new_identities_en: 400 sentences
- train: 4524 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['250', '35', '45', '90', 'analytics', 'broker', 'crawler', 'dashboard', 'gamma_ray', 'indexer', 'ingest', 'irina', 'loyalty', 'notifications', 'payroll', 'recommendations', 'registry', 'returns', 'routing', 'theta', 'tracking', 'vault', 'victor', 'zeta']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
54289 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit 2bae649. Memory curve: runs/5000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 0.015 [rule: fit; pooled midpoint 0.515 (comparison)] (present 1.030, n 695 / absent 0.000, n 128)
- attr_presence:object: threshold 0.470 [rule: fit; pooled midpoint 0.546 (comparison)] (present 0.876, n 268 / absent 0.216, n 427)
- det_presence:object: threshold 0.706 [rule: fit; pooled midpoint 0.663 (comparison)] (present 1.191, n 226 / absent 0.134, n 469)
- presence:color: threshold 0.063 [rule: fit; pooled midpoint 0.324 (comparison)] (present 0.647, n 22 / absent 0.002, n 801)
- presence:size: threshold 0.160 [rule: fit; pooled midpoint 0.279 (comparison)] (present 0.547, n 69 / absent 0.011, n 754)
- presence:style: threshold 0.002 [rule: fit; pooled midpoint 0.091 (comparison)] (present 0.181, n 32 / absent 0.002, n 791)
- presence:text: threshold 0.084 [rule: fit; pooled midpoint 0.264 (comparison)] (present 0.510, n 100 / absent 0.018, n 723)
- presence:relation: threshold 0.081 [rule: fit; pooled midpoint 0.267 (comparison)] (present 0.516, n 106 / absent 0.018, n 717)
- presence:landmark: threshold 0.248 [rule: fit; pooled midpoint 0.347 (comparison)] (present 0.658, n 106 / absent 0.036, n 717)
- presence:region: threshold 0.259 [rule: fit; pooled midpoint 0.453 (comparison)] (present 0.873, n 61 / absent 0.032, n 762)
- presence:anchor: threshold 0.092 [rule: fit; pooled midpoint 0.350 (comparison)] (present 0.699, n 44 / absent 0.001, n 779)
- presence:fraction: threshold 0.066 [rule: fit; pooled midpoint 0.282 (comparison)] (present 0.562, n 36 / absent 0.002, n 787)
- presence:amount: threshold 0.162 [rule: fit; pooled midpoint 0.308 (comparison)] (present 0.618, n 45 / absent -0.002, n 778)
- presence:unit: threshold 0.360 [rule: fit; pooled midpoint 0.366 (comparison)] (present 0.696, n 45 / absent 0.036, n 778)
- presence:direction: threshold 0.195 [rule: fit; pooled midpoint 0.308 (comparison)] (present 0.613, n 32 / absent 0.004, n 791)
- presence:axis: threshold 0.177 [rule: fit; pooled midpoint 0.286 (comparison)] (present 0.571, n 20 / absent 0.001, n 803)
- presence:layout: threshold 0.241 [rule: fit; pooled midpoint 0.481 (comparison)] (present 0.963, n 19 / absent 0.000, n 804)
- presence:pairing: threshold 0.229 [rule: fit; pooled midpoint 0.214 (comparison)] (present 0.431, n 18 / absent -0.004, n 805)
- presence:source: threshold 0.093 [rule: fit; pooled midpoint 0.336 (comparison)] (present 0.672, n 112 / absent 0.000, n 711)
- presence:target: threshold 0.229 [rule: fit; pooled midpoint 0.396 (comparison)] (present 0.791, n 94 / absent 0.001, n 729)
- presence:edge: threshold 0.114 [rule: fit; pooled midpoint 0.327 (comparison)] (present 0.653, n 84 / absent 0.000, n 739)
- presence:quantity: threshold 0.064 [rule: fit; pooled midpoint 0.091 (comparison)] (present 0.178, n 40 / absent 0.005, n 783)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.005, color 0.083, size 0.143, style 0.200, text 0.013, relation 0.167, landmark 0.006, region 0.111, anchor 0.250, fraction 0.333, amount 0.043, unit 0.500, direction 0.167, axis 0.500, layout 0.143, pairing 0.500, source 0.006, target 0.006, edge 0.125, quantity 0.043, predicate 0.019

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 200 of 200)
| axis | accuracy |
|---|---|
| FULL | 0.810±0.019 |
| FULL [depth given] | 0.810±0.019 |
| FULL [depth and negation given] | 0.810±0.019 |
| FULL [presence not decided] | 0.818±0.016 |
| FULL [pooled midpoint (comparison)] | 0.647±0.021 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.022±0.006 |
| presence object: share of true 'present' readings that abstain | 0.022±0.006 |
| presence color: absent read absent | 0.997±0.002 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.098±0.028 |
| presence size: share of true 'present' readings that abstain | 0.098±0.028 |
| presence style: absent read absent | 1.000±0.000 |
| presence text: absent read absent | 0.998±0.003 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 1.000±0.000 |
| presence target: absent read absent | 1.000±0.000 |
| presence edge: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 1.000±0.000 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 1.000±0.000 |
| event type (synonym table) | 1.000±0.000 |
| role object | 0.935±0.004 |
| head object | 1.000±0.000 |
| lexical order head object | 0.170±0.000 |
| lexical bag head object | 0.130±0.000 |
| occupancy: known filler | 0.957±0.013 |
| role color | 0.997±0.002 |
| head color | 0.997±0.002 |
| lexical order head color | 0.995±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 1.000±0.000 |
| head size | 1.000±0.000 |
| lexical order head size | 0.915±0.000 |
| lexical bag head size | 0.915±0.000 |
| role style | 0.995±0.004 |
| head style | 0.995±0.004 |
| lexical order head style | 0.945±0.000 |
| lexical bag head style | 0.945±0.000 |
| role text | 0.993±0.002 |
| head text | 0.993±0.002 |
| lexical order head text | 0.895±0.000 |
| lexical bag head text | 0.895±0.000 |
| role relation | 0.988±0.006 |
| head relation | 0.988±0.006 |
| lexical order head relation | 0.865±0.000 |
| lexical bag head relation | 0.865±0.000 |
| role landmark | 0.952±0.002 |
| head landmark | 0.977±0.002 |
| lexical order head landmark | 0.865±0.000 |
| lexical bag head landmark | 0.865±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.935±0.000 |
| lexical bag head region | 0.935±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.930±0.000 |
| lexical bag head anchor | 0.930±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.930±0.000 |
| lexical bag head fraction | 0.930±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.960±0.000 |
| lexical bag head amount | 0.960±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.960±0.000 |
| lexical bag head unit | 0.960±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.990±0.000 |
| lexical bag head direction | 0.990±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.980±0.000 |
| lexical bag head axis | 0.980±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 0.985±0.000 |
| lexical bag head pairing | 0.985±0.000 |
| role source | 0.928±0.008 |
| head source | 0.953±0.014 |
| lexical order head source | 0.855±0.000 |
| lexical bag head source | 0.855±0.000 |
| role target | 0.965±0.007 |
| head target | 0.995±0.007 |
| lexical order head target | 0.870±0.000 |
| lexical bag head target | 0.870±0.000 |
| role edge | 0.970±0.004 |
| head edge | 0.997±0.002 |
| lexical order head edge | 0.870±0.000 |
| lexical bag head edge | 0.870±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.890±0.000 |
| lexical bag head quantity | 0.890±0.000 |
| heads FULL (model) | 0.912±0.023 |
| heads FULL (lexical order baseline) | 0.020±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.045±0.000 |
| role object [presence not decided] | 0.935±0.004 |
| role color [presence not decided] | 0.985±0.000 |
| role size [presence not decided] | 1.000±0.000 |
| role style [presence not decided] | 1.000±0.000 |
| role text [presence not decided] | 0.998±0.002 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.962±0.002 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 1.000±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 1.000±0.000 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.928±0.008 |
| role target [presence not decided] | 0.963±0.009 |
| role edge [presence not decided] | 0.973±0.002 |
| role quantity [presence not decided] | 1.000±0.000 |
| heads FULL (model) [presence not decided] | 0.922±0.021 |
| role object [pooled midpoint (comparison)] | 0.872±0.015 |
| role color [pooled midpoint (comparison)] | 0.998±0.002 |
| role size [pooled midpoint (comparison)] | 0.998±0.002 |
| role style [pooled midpoint (comparison)] | 0.982±0.002 |
| role text [pooled midpoint (comparison)] | 0.955±0.007 |
| role relation [pooled midpoint (comparison)] | 0.972±0.006 |
| role landmark [pooled midpoint (comparison)] | 0.942±0.002 |
| role region [pooled midpoint (comparison)] | 0.977±0.002 |
| role anchor [pooled midpoint (comparison)] | 0.995±0.004 |
| role fraction [pooled midpoint (comparison)] | 0.995±0.004 |
| role amount [pooled midpoint (comparison)] | 1.000±0.000 |
| role unit [pooled midpoint (comparison)] | 1.000±0.000 |
| role direction [pooled midpoint (comparison)] | 1.000±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.925±0.007 |
| role target [pooled midpoint (comparison)] | 0.958±0.002 |
| role edge [pooled midpoint (comparison)] | 0.960±0.000 |
| role quantity [pooled midpoint (comparison)] | 0.983±0.005 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.732±0.021 |
| presence object: present read present [pooled midpoint (comparison)] | 0.922±0.015 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.998±0.002 |
| presence size: present read present [pooled midpoint (comparison)] | 0.980±0.028 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent | 1.000±0.000 |
| presence text: present read present | 0.952±0.039 |
| presence text: share of 'present' readings that abstain | 0.115±0.025 |
| presence text: share of true 'present' readings that abstain | 0.101±0.042 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.587±0.059 |
| presence object: absent read absent | 1.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence source: present read present | 0.690±0.084 |
| presence source: share of 'present' readings that abstain | 0.690±0.191 |
| presence source: share of true 'present' readings that abstain | 0.690±0.191 |
| determiner identity (outside FULL when the legend excludes it) | 0.930±0.006 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.655±0.084 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.024±0.034 |
| presence fraction: share of true 'present' readings that abstain | 0.024±0.034 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.929±0.058 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.929±0.058 |
| presence target: present read present | 0.987±0.018 |
| presence target: share of 'present' readings that abstain | 0.104±0.017 |
| presence target: share of true 'present' readings that abstain | 0.104±0.017 |
| presence edge: present read present | 0.974±0.018 |
| presence edge: share of 'present' readings that abstain | 0.092±0.017 |
| presence edge: share of true 'present' readings that abstain | 0.092±0.017 |
| presence target: present read present [pooled midpoint (comparison)] | 0.885±0.000 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.885±0.000 |
| presence relation: present read present | 0.914±0.046 |
| presence relation: share of 'present' readings that abstain | 0.039±0.033 |
| presence relation: share of true 'present' readings that abstain | 0.039±0.033 |
| presence landmark: present read present | 0.827±0.017 |
| presence landmark: share of 'present' readings that abstain | 0.060±0.022 |
| presence landmark: share of true 'present' readings that abstain | 0.060±0.022 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.000±0.000 |
| presence amount: share of true 'present' readings that abstain | 0.000±0.000 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.790±0.046 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.753±0.017 |
| presence amount: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: present read present | 0.909±0.074 |
| presence style: share of 'present' readings that abstain | 0.272±0.065 |
| presence style: share of true 'present' readings that abstain | 0.272±0.065 |
| presence style: present read present [pooled midpoint (comparison)] | 0.667±0.043 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.026±0.036 |
| presence region: share of true 'present' readings that abstain | 0.026±0.036 |
| presence region: present read present [pooled midpoint (comparison)] | 0.641±0.036 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.167±0.093 |
| presence quantity: share of true 'present' readings that abstain | 0.167±0.093 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.848±0.043 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.333±0.236 |
| presence color: share of true 'present' readings that abstain | 0.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.079±0.017; status {'abstain': 37, 'ok': 163}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.422 / 0.307 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.922 | 0.311 / 0.184 | 0.98 | 0.072 | 0.012 / 0.006 |
| roles (pooled) | 0.884 | 0.212 / 0.033 | 0.88 | 0.068 | 0.073 / 0.048 |
| role size | 1.000 | 0.191 / 0.073 | 0.88 | 0.000 | 0.118 / 0.000 |
| role text | 1.000 | 0.168 / 0.061 | 0.95 | 0.000 | 0.048 / 0.000 |
| role pairing | 1.000 | 0.305 / 0.251 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.483 | 0.025 / 0.000 | 0.24 | 0.069 | 0.310 / 0.448 |
| role anchor | 1.000 | 0.247 / 0.211 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.177 / 0.123 | 1.00 | 0.000 | 0.000 / 0.000 |
| role target | 0.769 | 0.130 / 0.047 | 0.88 | 0.231 | 0.115 / 0.000 |
| role edge | 0.808 | 0.192 / 0.099 | 0.88 | 0.192 | 0.115 / 0.000 |
| role relation | 0.926 | 0.159 / 0.037 | 0.85 | 0.000 | 0.074 / 0.074 |
| role landmark | 0.630 | 0.124 / 0.000 | 0.78 | 0.185 | 0.037 / 0.185 |
| role amount | 1.000 | 0.201 / 0.138 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.234 / 0.133 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 1.000 | 0.118 / 0.033 | 0.82 | 0.000 | 0.182 / 0.000 |
| role region | 1.000 | 0.167 / 0.108 | 0.92 | 0.000 | 0.077 / 0.000 |
| role quantity | 1.000 | 0.093 / 0.017 | 0.73 | 0.000 | 0.273 / 0.000 |
| role color | 1.000 | 0.186 / 0.186 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.348 / 0.312 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.311 / 0.282 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_formulations_en — catalog candidates (n = 177 of 177)
| axis | accuracy |
|---|---|
| FULL | 0.863±0.010 |
| FULL [depth given] | 0.863±0.010 |
| FULL [depth and negation given] | 0.863±0.010 |
| FULL [presence not decided] | 0.874±0.013 |
| FULL [pooled midpoint (comparison)] | 0.672±0.017 |
| presence object: present read present | 0.998±0.003 |
| presence object: share of 'present' readings that abstain | 0.047±0.003 |
| presence object: share of true 'present' readings that abstain | 0.047±0.003 |
| presence color: absent read absent | 0.998±0.003 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 0.996±0.003 |
| presence text: absent read absent | 1.000±0.000 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 1.000±0.000 |
| presence target: absent read absent | 1.000±0.000 |
| presence edge: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 1.000±0.000 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 1.000±0.000 |
| event type (synonym table) | 1.000±0.000 |
| role object | 0.970±0.005 |
| head object | 0.989±0.000 |
| lexical order head object | 0.192±0.000 |
| lexical bag head object | 0.780±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.948±0.011 |
| occupancy: known filler | 0.987±0.004 |
| role color | 0.998±0.003 |
| head color | 0.998±0.003 |
| lexical order head color | 1.000±0.000 |
| lexical bag head color | 0.994±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 1.000±0.000 |
| head size | 1.000±0.000 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.960±0.000 |
| role style | 0.994±0.000 |
| head style | 0.994±0.000 |
| lexical order head style | 0.972±0.000 |
| lexical bag head style | 0.972±0.000 |
| role text | 1.000±0.000 |
| head text | 1.000±0.000 |
| lexical order head text | 0.864±0.000 |
| lexical bag head text | 0.881±0.000 |
| role relation | 0.998±0.003 |
| head relation | 0.998±0.003 |
| lexical order head relation | 0.881±0.000 |
| lexical bag head relation | 0.881±0.000 |
| role landmark | 0.976±0.003 |
| head landmark | 0.987±0.003 |
| lexical order head landmark | 0.881±0.000 |
| lexical bag head landmark | 0.859±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.927±0.000 |
| lexical bag head region | 0.927±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.949±0.000 |
| lexical bag head anchor | 0.972±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.949±0.000 |
| lexical bag head fraction | 0.949±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.972±0.000 |
| lexical bag head amount | 0.972±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.972±0.000 |
| lexical bag head unit | 0.972±0.000 |
| role direction | 0.998±0.003 |
| head direction | 0.998±0.003 |
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
| role source | 0.953±0.012 |
| head source | 0.974±0.019 |
| lexical order head source | 0.831±0.000 |
| lexical bag head source | 0.831±0.000 |
| role target | 0.936±0.010 |
| head target | 0.974±0.019 |
| lexical order head target | 0.836±0.000 |
| lexical bag head target | 0.836±0.000 |
| role edge | 0.966±0.005 |
| head edge | 0.985±0.003 |
| lexical order head edge | 0.836±0.000 |
| lexical bag head edge | 0.836±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.910±0.000 |
| lexical bag head quantity | 0.910±0.000 |
| heads FULL (model) | 0.940±0.014 |
| heads FULL (lexical order baseline) | 0.017±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.311±0.000 |
| role object [presence not decided] | 0.972±0.008 |
| role color [presence not decided] | 0.994±0.000 |
| role size [presence not decided] | 1.000±0.000 |
| role style [presence not decided] | 0.994±0.000 |
| role text [presence not decided] | 1.000±0.000 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.979±0.003 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 1.000±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 1.000±0.000 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.953±0.012 |
| role target [presence not decided] | 0.934±0.012 |
| role edge [presence not decided] | 0.977±0.005 |
| role quantity [presence not decided] | 1.000±0.000 |
| heads FULL (model) [presence not decided] | 0.951±0.023 |
| role object [pooled midpoint (comparison)] | 0.827±0.007 |
| role color [pooled midpoint (comparison)] | 1.000±0.000 |
| role size [pooled midpoint (comparison)] | 0.989±0.005 |
| role style [pooled midpoint (comparison)] | 0.985±0.003 |
| role text [pooled midpoint (comparison)] | 0.979±0.003 |
| role relation [pooled midpoint (comparison)] | 0.979±0.007 |
| role landmark [pooled midpoint (comparison)] | 0.957±0.003 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 1.000±0.000 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.998±0.003 |
| role unit [pooled midpoint (comparison)] | 1.000±0.000 |
| role direction [pooled midpoint (comparison)] | 0.994±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 0.998±0.003 |
| role source [pooled midpoint (comparison)] | 0.949±0.014 |
| role target [pooled midpoint (comparison)] | 0.928±0.012 |
| role edge [pooled midpoint (comparison)] | 0.964±0.007 |
| role quantity [pooled midpoint (comparison)] | 0.996±0.003 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.748±0.023 |
| presence object: present read present [pooled midpoint (comparison)] | 0.831±0.011 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
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
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence direction: present read present | 0.889±0.157 |
| presence direction: share of 'present' readings that abstain | 0.111±0.157 |
| presence direction: share of true 'present' readings that abstain | 0.111±0.157 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.667±0.000 |
| presence relation: present read present | 0.984±0.022 |
| presence relation: share of 'present' readings that abstain | 0.049±0.041 |
| presence relation: share of true 'present' readings that abstain | 0.049±0.041 |
| presence landmark: present read present | 0.968±0.022 |
| presence landmark: share of 'present' readings that abstain | 0.394±0.082 |
| presence landmark: share of true 'present' readings that abstain | 0.394±0.082 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.838±0.047 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.823±0.019 |
| presence text: present read present | 1.000±0.000 |
| presence text: share of 'present' readings that abstain | 0.000±0.000 |
| presence text: share of true 'present' readings that abstain | 0.000±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.859±0.018 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.056±0.039 |
| presence size: share of true 'present' readings that abstain | 0.056±0.039 |
| presence size: present read present [pooled midpoint (comparison)] | 0.833±0.068 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.042±0.029 |
| presence quantity: share of true 'present' readings that abstain | 0.042±0.029 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.958±0.029 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.722±0.157 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.000±0.000 |
| presence amount: share of true 'present' readings that abstain | 0.000±0.000 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.933±0.094 |
| presence unit: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.867±0.072 |
| presence source: share of true 'present' readings that abstain | 0.867±0.072 |
| presence target: present read present | 0.989±0.016 |
| presence target: share of 'present' readings that abstain | 0.592±0.094 |
| presence target: share of true 'present' readings that abstain | 0.592±0.094 |
| presence edge: present read present | 0.908±0.016 |
| presence edge: share of 'present' readings that abstain | 0.012±0.017 |
| presence edge: share of true 'present' readings that abstain | 0.012±0.017 |
| presence source: present read present [pooled midpoint (comparison)] | 0.933±0.000 |
| presence target: present read present [pooled midpoint (comparison)] | 0.943±0.016 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.897±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.333±0.471 |
| presence pairing: share of true 'present' readings that abstain | 0.333±0.471 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.667±0.471 |
| presence style: present read present | 0.933±0.094 |
| presence style: share of true 'present' readings that abstain | 0.700±0.141 |
| presence style: present read present [pooled midpoint (comparison)] | 0.467±0.094 |

residual mean 0.037±0.003; status {'ok': 125, 'abstain': 52}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.410 / 0.298 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.972 | 0.267 / 0.075 | 0.94 | 0.007 | 0.035 / 0.021 |
| roles (pooled) | 0.920 | 0.180 / 0.021 | 0.80 | 0.021 | 0.141 / 0.059 |
| role direction | 1.000 | 0.233 / 0.086 | 0.67 | 0.000 | 0.333 / 0.000 |
| role relation | 0.952 | 0.174 / 0.038 | 0.86 | 0.000 | 0.095 / 0.048 |
| role landmark | 0.810 | 0.055 / 0.003 | 0.48 | 0.048 | 0.381 / 0.143 |
| role text | 1.000 | 0.206 / 0.132 | 1.00 | 0.000 | 0.000 / 0.000 |
| role size | 1.000 | 0.171 / 0.106 | 1.00 | 0.000 | 0.000 / 0.000 |
| role quantity | 1.000 | 0.115 / 0.057 | 0.94 | 0.000 | 0.062 / 0.000 |
| role anchor | 1.000 | 0.224 / 0.195 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.169 / 0.134 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.257 / 0.209 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 1.000 | 0.218 / 0.135 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.132 / 0.081 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.800 | 0.015 / -0.006 | 0.03 | 0.000 | 0.767 / 0.200 |
| role target | 0.690 | 0.049 / 0.017 | 0.52 | 0.103 | 0.276 / 0.207 |
| role edge | 0.793 | 0.150 / 0.066 | 0.90 | 0.103 | 0.000 / 0.103 |
| role pairing | 1.000 | 0.024 / 0.024 | 0.00 | 0.000 | 1.000 / 0.000 |
| role style | 1.000 | 0.056 / 0.004 | 0.20 | 0.000 | 0.800 / 0.000 |

### heldout_sentences — catalog candidates (n = 476 of 476)
| axis | accuracy |
|---|---|
| FULL | 0.815±0.011 |
| FULL [depth given] | 0.815±0.011 |
| FULL [depth and negation given] | 0.815±0.011 |
| FULL [pooled midpoint (comparison)] | 0.674±0.015 |
| presence object: present read present | 0.995±0.002 |
| presence object: share of 'present' readings that abstain | 0.017±0.003 |
| presence object: share of true 'present' readings that abstain | 0.017±0.003 |
| presence color: absent read absent | 0.996±0.002 |
| presence size: absent read absent | 0.998±0.000 |
| presence style: absent read absent | 0.999±0.001 |
| presence text: absent read absent | 0.999±0.001 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: present read present | 0.852±0.026 |
| presence region: share of 'present' readings that abstain | 0.054±0.015 |
| presence region: share of true 'present' readings that abstain | 0.054±0.015 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 1.000±0.000 |
| presence target: absent read absent | 1.000±0.000 |
| presence edge: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.999±0.001 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.999±0.001 |
| event type (synonym table) | 0.999±0.001 |
| role object | 0.938±0.004 |
| head object | 0.990±0.001 |
| lexical order head object | 0.147±0.000 |
| lexical bag head object | 0.485±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.923±0.005 |
| occupancy: known filler | 0.963±0.006 |
| role color | 0.996±0.003 |
| head color | 0.996±0.003 |
| lexical order head color | 0.964±0.000 |
| lexical bag head color | 0.966±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.989±0.000 |
| head size | 0.989±0.000 |
| lexical order head size | 0.931±0.000 |
| lexical bag head size | 0.962±0.000 |
| role style | 0.999±0.001 |
| head style | 0.999±0.001 |
| lexical order head style | 0.992±0.000 |
| lexical bag head style | 0.994±0.000 |
| role text | 0.998±0.000 |
| head text | 0.998±0.000 |
| lexical order head text | 0.853±0.000 |
| lexical bag head text | 0.891±0.000 |
| role relation | 0.993±0.004 |
| head relation | 0.993±0.004 |
| lexical order head relation | 0.866±0.000 |
| lexical bag head relation | 0.893±0.000 |
| role landmark | 0.948±0.005 |
| head landmark | 0.979±0.005 |
| lexical order head landmark | 0.866±0.000 |
| lexical bag head landmark | 0.859±0.000 |
| role region | 0.989±0.002 |
| head region | 0.989±0.002 |
| lexical order head region | 0.924±0.000 |
| lexical bag head region | 0.929±0.000 |
| role anchor | 0.996±0.002 |
| head anchor | 0.996±0.002 |
| lexical order head anchor | 0.947±0.000 |
| lexical bag head anchor | 0.962±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.983±0.000 |
| lexical bag head fraction | 0.987±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.912±0.000 |
| lexical bag head amount | 0.926±0.000 |
| role unit | 0.997±0.001 |
| head unit | 0.997±0.001 |
| lexical order head unit | 0.912±0.000 |
| lexical bag head unit | 0.926±0.000 |
| role direction | 0.994±0.003 |
| head direction | 0.994±0.003 |
| lexical order head direction | 0.935±0.000 |
| lexical bag head direction | 0.941±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.981±0.000 |
| lexical bag head axis | 0.987±0.000 |
| role layout | 0.999±0.001 |
| head layout | 0.999±0.001 |
| lexical order head layout | 0.947±0.000 |
| lexical bag head layout | 0.950±0.000 |
| role pairing | 0.996±0.003 |
| head pairing | 0.996±0.003 |
| lexical order head pairing | 0.964±0.000 |
| lexical bag head pairing | 0.966±0.000 |
| role source | 0.942±0.004 |
| head source | 0.980±0.007 |
| lexical order head source | 0.872±0.000 |
| lexical bag head source | 0.897±0.000 |
| role target | 0.981±0.003 |
| head target | 0.992±0.003 |
| lexical order head target | 0.908±0.000 |
| lexical bag head target | 0.914±0.000 |
| role edge | 0.994±0.000 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.935±0.000 |
| lexical bag head edge | 0.945±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.987±0.000 |
| lexical bag head quantity | 0.994±0.000 |
| heads FULL (model) | 0.910±0.018 |
| heads FULL (lexical order baseline) | 0.006±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.208±0.000 |
| role object [pooled midpoint (comparison)] | 0.875±0.009 |
| role color [pooled midpoint (comparison)] | 0.987±0.000 |
| role size [pooled midpoint (comparison)] | 0.979±0.002 |
| role style [pooled midpoint (comparison)] | 0.996±0.002 |
| role text [pooled midpoint (comparison)] | 0.987±0.001 |
| role relation [pooled midpoint (comparison)] | 0.961±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.935±0.002 |
| role region [pooled midpoint (comparison)] | 0.979±0.002 |
| role anchor [pooled midpoint (comparison)] | 0.989±0.002 |
| role fraction [pooled midpoint (comparison)] | 0.999±0.001 |
| role amount [pooled midpoint (comparison)] | 0.996±0.002 |
| role unit [pooled midpoint (comparison)] | 0.996±0.000 |
| role direction [pooled midpoint (comparison)] | 0.987±0.001 |
| role axis [pooled midpoint (comparison)] | 0.999±0.001 |
| role layout [pooled midpoint (comparison)] | 0.992±0.002 |
| role pairing [pooled midpoint (comparison)] | 0.993±0.003 |
| role source [pooled midpoint (comparison)] | 0.930±0.006 |
| role target [pooled midpoint (comparison)] | 0.967±0.001 |
| role edge [pooled midpoint (comparison)] | 0.994±0.000 |
| role quantity [pooled midpoint (comparison)] | 0.999±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.745±0.017 |
| presence object: present read present [pooled midpoint (comparison)] | 0.928±0.007 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.998±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence text: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 0.722±0.023 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.907±0.060 |
| presence target: present read present | 0.985±0.011 |
| presence target: share of 'present' readings that abstain | 0.208±0.021 |
| presence target: share of true 'present' readings that abstain | 0.208±0.021 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.672±0.071 |
| presence target: present read present [pooled midpoint (comparison)] | 0.788±0.011 |
| presence source: share of 'present' readings that abstain | 0.591±0.113 |
| presence source: share of true 'present' readings that abstain | 0.591±0.113 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.011±0.015 |
| presence edge: share of true 'present' readings that abstain | 0.011±0.015 |
| presence edge: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.200±0.024 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: present read present | 0.899±0.014 |
| presence size: share of 'present' readings that abstain | 0.044±0.016 |
| presence size: share of true 'present' readings that abstain | 0.045±0.017 |
| presence size: present read present [pooled midpoint (comparison)] | 0.727±0.025 |
| presence layout: present read present | 0.987±0.019 |
| presence layout: share of 'present' readings that abstain | 0.054±0.018 |
| presence layout: share of true 'present' readings that abstain | 0.054±0.018 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.853±0.038 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.926±0.052 |
| presence pairing: present read present | 0.882±0.083 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.804±0.073 |
| presence text: present read present | 0.990±0.007 |
| presence text: share of 'present' readings that abstain | 0.019±0.006 |
| presence text: share of true 'present' readings that abstain | 0.019±0.007 |
| presence text: present read present [pooled midpoint (comparison)] | 0.910±0.007 |
| presence direction: present read present | 0.914±0.040 |
| presence direction: share of 'present' readings that abstain | 0.059±0.017 |
| presence direction: share of true 'present' readings that abstain | 0.059±0.017 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.796±0.015 |
| presence pairing: share of 'present' readings that abstain | 0.114±0.038 |
| presence pairing: share of true 'present' readings that abstain | 0.114±0.038 |
| presence relation: present read present | 0.958±0.033 |
| presence relation: share of 'present' readings that abstain | 0.049±0.026 |
| presence relation: share of true 'present' readings that abstain | 0.049±0.026 |
| presence landmark: present read present | 0.879±0.036 |
| presence landmark: share of 'present' readings that abstain | 0.180±0.043 |
| presence landmark: share of true 'present' readings that abstain | 0.180±0.043 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.743±0.023 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.787±0.021 |
| presence anchor: present read present | 0.933±0.038 |
| presence anchor: share of 'present' readings that abstain | 0.028±0.020 |
| presence anchor: share of true 'present' readings that abstain | 0.028±0.020 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.800±0.033 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.483±0.165 |
| presence style: share of true 'present' readings that abstain | 0.417±0.118 |
| presence style: present read present [pooled midpoint (comparison)] | 0.583±0.118 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.024±0.019 |
| presence amount: share of true 'present' readings that abstain | 0.024±0.019 |
| presence unit: present read present | 0.968±0.011 |
| presence unit: share of 'present' readings that abstain | 0.058±0.032 |
| presence unit: share of true 'present' readings that abstain | 0.058±0.032 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.952±0.019 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.952±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.958±0.059 |
| presence color: present read present | 0.980±0.028 |
| presence color: share of true 'present' readings that abstain | 0.119±0.047 |
| presence color: present read present [pooled midpoint (comparison)] | 0.647±0.000 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.111±0.079 |
| presence quantity: share of true 'present' readings that abstain | 0.111±0.079 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.944±0.079 |
| presence size: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.077±0.008; status {'ok': 374, 'abstain': 102}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.418 / 0.310 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.926 | 0.294 / 0.157 | 0.98 | 0.064 | 0.015 / 0.010 |
| roles (pooled) | 0.878 | 0.213 / 0.029 | 0.88 | 0.049 | 0.052 / 0.072 |
| role region | 0.833 | 0.182 / 0.000 | 0.78 | 0.000 | 0.056 / 0.167 |
| role source | 0.508 | 0.027 / 0.000 | 0.26 | 0.098 | 0.344 / 0.393 |
| role target | 0.773 | 0.101 / 0.017 | 0.77 | 0.091 | 0.091 / 0.136 |
| role edge | 0.903 | 0.209 / 0.154 | 1.00 | 0.097 | 0.000 / 0.000 |
| role size | 0.879 | 0.143 / 0.047 | 0.88 | 0.030 | 0.030 / 0.091 |
| role layout | 0.960 | 0.236 / 0.100 | 0.92 | 0.000 | 0.040 / 0.040 |
| role axis | 1.000 | 0.279 / 0.178 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 0.765 | 0.173 / 0.000 | 0.65 | 0.000 | 0.118 / 0.235 |
| role text | 1.000 | 0.225 / 0.157 | 0.97 | 0.000 | 0.029 / 0.000 |
| role direction | 0.903 | 0.203 / 0.020 | 0.87 | 0.000 | 0.032 / 0.097 |
| role relation | 0.953 | 0.173 / 0.076 | 0.94 | 0.000 | 0.016 / 0.047 |
| role landmark | 0.562 | 0.097 / 0.000 | 0.67 | 0.172 | 0.062 / 0.266 |
| role anchor | 0.960 | 0.211 / 0.102 | 0.92 | 0.000 | 0.040 / 0.040 |
| role style | 1.000 | 0.071 / 0.016 | 0.50 | 0.000 | 0.500 / 0.000 |
| role amount | 1.000 | 0.190 / 0.137 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 0.952 | 0.195 / 0.025 | 0.86 | 0.000 | 0.095 / 0.048 |
| role fraction | 1.000 | 0.222 / 0.174 | 1.00 | 0.000 | 0.000 / 0.000 |
| role color | 0.941 | 0.141 / 0.046 | 0.88 | 0.000 | 0.059 / 0.059 |
| role quantity | 1.000 | 0.109 / 0.044 | 0.83 | 0.000 | 0.167 / 0.000 |

### mixed — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.810±0.008 |
| FULL [depth given] | 0.810±0.008 |
| FULL [depth and negation given] | 0.810±0.008 |
| FULL [pooled midpoint (comparison)] | 0.628±0.014 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.009±0.001 |
| presence object: share of true 'present' readings that abstain | 0.009±0.001 |
| presence color: absent read absent | 0.998±0.002 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 1.000±0.000 |
| presence text: absent read absent | 1.000±0.000 |
| presence relation: present read present | 0.892±0.033 |
| presence relation: share of 'present' readings that abstain | 0.050±0.013 |
| presence relation: share of true 'present' readings that abstain | 0.050±0.013 |
| presence landmark: present read present | 0.791±0.016 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 1.000±0.000 |
| presence target: absent read absent | 1.000±0.000 |
| presence edge: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.998±0.002 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.998±0.002 |
| event type (synonym table) | 0.998±0.002 |
| role object | 0.943±0.004 |
| head object | 0.998±0.002 |
| lexical order head object | 0.120±0.000 |
| lexical bag head object | 0.312±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.904±0.005 |
| occupancy: known filler | 0.949±0.003 |
| role color | 0.995±0.004 |
| head color | 0.995±0.004 |
| lexical order head color | 0.958±0.000 |
| lexical bag head color | 0.960±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.995±0.000 |
| head size | 0.995±0.000 |
| lexical order head size | 0.965±0.000 |
| lexical bag head size | 0.980±0.000 |
| role style | 0.999±0.001 |
| head style | 0.999±0.001 |
| lexical order head style | 0.975±0.000 |
| lexical bag head style | 0.978±0.000 |
| role text | 0.999±0.001 |
| head text | 0.999±0.001 |
| lexical order head text | 0.877±0.000 |
| lexical bag head text | 0.890±0.000 |
| role relation | 0.985±0.005 |
| head relation | 0.985±0.005 |
| lexical order head relation | 0.868±0.000 |
| lexical bag head relation | 0.875±0.000 |
| role landmark | 0.947±0.001 |
| head landmark | 0.972±0.002 |
| lexical order head landmark | 0.868±0.000 |
| lexical bag head landmark | 0.858±0.000 |
| role region | 0.984±0.001 |
| head region | 0.984±0.001 |
| lexical order head region | 0.912±0.000 |
| lexical bag head region | 0.917±0.000 |
| role anchor | 0.989±0.003 |
| head anchor | 0.989±0.003 |
| lexical order head anchor | 0.905±0.000 |
| lexical bag head anchor | 0.917±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.958±0.000 |
| lexical bag head fraction | 0.958±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.922±0.000 |
| lexical bag head amount | 0.932±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.922±0.000 |
| lexical bag head unit | 0.930±0.000 |
| role direction | 0.996±0.001 |
| head direction | 0.996±0.001 |
| lexical order head direction | 0.948±0.000 |
| lexical bag head direction | 0.950±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.963±0.000 |
| role layout | 0.998±0.000 |
| head layout | 0.998±0.000 |
| lexical order head layout | 0.932±0.000 |
| lexical bag head layout | 0.935±0.000 |
| role pairing | 0.998±0.002 |
| head pairing | 0.998±0.002 |
| lexical order head pairing | 0.960±0.000 |
| lexical bag head pairing | 0.965±0.000 |
| role source | 0.948±0.004 |
| head source | 0.983±0.004 |
| lexical order head source | 0.895±0.000 |
| lexical bag head source | 0.895±0.000 |
| role target | 0.985±0.002 |
| head target | 0.997±0.002 |
| lexical order head target | 0.935±0.000 |
| lexical bag head target | 0.940±0.000 |
| role edge | 0.992±0.001 |
| head edge | 0.998±0.001 |
| lexical order head edge | 0.958±0.000 |
| lexical bag head edge | 0.958±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.985±0.000 |
| lexical bag head quantity | 0.993±0.000 |
| heads FULL (model) | 0.905±0.011 |
| heads FULL (lexical order baseline) | 0.013±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.100±0.000 |
| role object [pooled midpoint (comparison)] | 0.843±0.010 |
| role color [pooled midpoint (comparison)] | 0.988±0.000 |
| role size [pooled midpoint (comparison)] | 0.995±0.000 |
| role style [pooled midpoint (comparison)] | 0.993±0.001 |
| role text [pooled midpoint (comparison)] | 0.987±0.003 |
| role relation [pooled midpoint (comparison)] | 0.946±0.003 |
| role landmark [pooled midpoint (comparison)] | 0.929±0.005 |
| role region [pooled midpoint (comparison)] | 0.961±0.003 |
| role anchor [pooled midpoint (comparison)] | 0.975±0.004 |
| role fraction [pooled midpoint (comparison)] | 0.999±0.001 |
| role amount [pooled midpoint (comparison)] | 0.999±0.001 |
| role unit [pooled midpoint (comparison)] | 0.999±0.001 |
| role direction [pooled midpoint (comparison)] | 0.992±0.001 |
| role axis [pooled midpoint (comparison)] | 0.998±0.000 |
| role layout [pooled midpoint (comparison)] | 0.993±0.003 |
| role pairing [pooled midpoint (comparison)] | 0.996±0.002 |
| role source [pooled midpoint (comparison)] | 0.940±0.006 |
| role target [pooled midpoint (comparison)] | 0.977±0.004 |
| role edge [pooled midpoint (comparison)] | 0.987±0.002 |
| role quantity [pooled midpoint (comparison)] | 0.998±0.002 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.701±0.020 |
| presence object: present read present [pooled midpoint (comparison)] | 0.913±0.013 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.631±0.021 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.671±0.036 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: present read present | 0.819±0.013 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 0.569±0.037 |
| presence anchor: present read present | 0.886±0.033 |
| presence anchor: share of 'present' readings that abstain | 0.030±0.026 |
| presence anchor: share of true 'present' readings that abstain | 0.030±0.026 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.737±0.037 |
| presence layout: present read present | 0.963±0.000 |
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.901±0.046 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.000±0.000 |
| presence amount: share of true 'present' readings that abstain | 0.000±0.000 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.022±0.015 |
| presence unit: share of true 'present' readings that abstain | 0.022±0.015 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.989±0.015 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.989±0.015 |
| presence landmark: share of 'present' readings that abstain | 0.072±0.018 |
| presence landmark: share of true 'present' readings that abstain | 0.072±0.018 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.849±0.030 |
| presence source: share of 'present' readings that abstain | 0.554±0.066 |
| presence source: share of true 'present' readings that abstain | 0.554±0.066 |
| presence target: present read present | 0.974±0.018 |
| presence target: share of 'present' readings that abstain | 0.105±0.050 |
| presence target: share of true 'present' readings that abstain | 0.105±0.050 |
| presence edge: present read present | 0.961±0.028 |
| presence edge: share of 'present' readings that abstain | 0.123±0.003 |
| presence edge: share of true 'present' readings that abstain | 0.123±0.003 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.715±0.080 |
| presence target: present read present [pooled midpoint (comparison)] | 0.795±0.065 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.824±0.048 |
| presence color: present read present | 0.922±0.028 |
| presence color: share of 'present' readings that abstain | 0.164±0.033 |
| presence color: share of true 'present' readings that abstain | 0.125±0.088 |
| presence color: present read present [pooled midpoint (comparison)] | 0.706±0.000 |
| presence text: present read present | 0.993±0.010 |
| presence text: share of 'present' readings that abstain | 0.048±0.009 |
| presence text: share of true 'present' readings that abstain | 0.048±0.009 |
| presence text: present read present [pooled midpoint (comparison)] | 0.891±0.025 |
| presence region: share of 'present' readings that abstain | 0.104±0.074 |
| presence region: share of true 'present' readings that abstain | 0.104±0.074 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.980±0.028 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.022±0.031 |
| presence axis: share of true 'present' readings that abstain | 0.022±0.031 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.933±0.000 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.111±0.157 |
| presence quantity: share of true 'present' readings that abstain | 0.111±0.157 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.889±0.157 |
| presence direction: present read present | 0.936±0.022 |
| presence direction: share of 'present' readings that abstain | 0.034±0.024 |
| presence direction: share of true 'present' readings that abstain | 0.034±0.024 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.883±0.024 |
| presence pairing: present read present | 0.958±0.059 |
| presence pairing: share of 'present' readings that abstain | 0.089±0.064 |
| presence pairing: share of true 'present' readings that abstain | 0.089±0.064 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.956±0.063 |
| presence style: present read present | 0.967±0.047 |
| presence style: share of 'present' readings that abstain | 0.311±0.083 |
| presence style: share of true 'present' readings that abstain | 0.311±0.083 |
| presence style: present read present [pooled midpoint (comparison)] | 0.733±0.047 |
| presence size: present read present | 0.857±0.000 |
| presence size: share of 'present' readings that abstain | 0.000±0.000 |
| presence size: share of true 'present' readings that abstain | 0.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.923±0.000 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.095±0.002; status {'ok': 344, 'abstain': 56}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.421 / 0.334 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.938 | 0.305 / 0.163 | 0.99 | 0.057 | 0.006 / 0.006 |
| roles (pooled) | 0.883 | 0.223 / 0.047 | 0.89 | 0.051 | 0.039 / 0.067 |
| role relation | 0.906 | 0.154 / 0.006 | 0.87 | 0.000 | 0.038 / 0.094 |
| role landmark | 0.585 | 0.111 / 0.000 | 0.72 | 0.189 | 0.057 / 0.226 |
| role region | 0.800 | 0.149 / 0.000 | 0.74 | 0.000 | 0.057 / 0.200 |
| role anchor | 0.895 | 0.200 / 0.052 | 0.89 | 0.000 | 0.000 / 0.105 |
| role layout | 0.963 | 0.240 / 0.135 | 0.96 | 0.000 | 0.000 / 0.037 |
| role amount | 1.000 | 0.196 / 0.120 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.255 / 0.142 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.452 | 0.029 / 0.000 | 0.29 | 0.167 | 0.333 / 0.381 |
| role target | 0.731 | 0.130 / 0.018 | 0.81 | 0.154 | 0.077 / 0.115 |
| role edge | 0.824 | 0.170 / 0.068 | 0.88 | 0.176 | 0.118 / 0.000 |
| role color | 0.882 | 0.152 / 0.047 | 0.88 | 0.000 | 0.000 / 0.118 |
| role text | 1.000 | 0.222 / 0.147 | 0.94 | 0.000 | 0.061 / 0.000 |
| role fraction | 1.000 | 0.200 / 0.136 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.270 / 0.185 | 1.00 | 0.000 | 0.000 / 0.000 |
| role quantity | 1.000 | 0.137 / 0.067 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.905 | 0.205 / 0.060 | 0.90 | 0.000 | 0.000 / 0.095 |
| role pairing | 0.875 | 0.179 / 0.000 | 0.75 | 0.000 | 0.125 / 0.125 |
| role style | 1.000 | 0.088 / 0.044 | 0.80 | 0.000 | 0.200 / 0.000 |
| role size | 0.857 | 0.167 / 0.020 | 0.86 | 0.000 | 0.000 / 0.143 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.853±0.016 |
| FULL [depth given] | 0.853±0.016 |
| FULL [depth and negation given] | 0.853±0.016 |
| FULL [pooled midpoint (comparison)] | 0.668±0.010 |
| presence object: present read present | 0.995±0.002 |
| presence object: share of 'present' readings that abstain | 0.027±0.004 |
| presence object: share of true 'present' readings that abstain | 0.027±0.004 |
| presence color: absent read absent | 1.000±0.000 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 0.997±0.002 |
| presence text: absent read absent | 0.997±0.004 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 1.000±0.000 |
| presence target: absent read absent | 1.000±0.000 |
| presence edge: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 1.000±0.000 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 1.000±0.000 |
| event type (synonym table) | 1.000±0.000 |
| role object | 0.964±0.005 |
| head object | 0.990±0.002 |
| lexical order head object | 0.072±0.000 |
| lexical bag head object | 0.328±0.000 |
| occupancy: unknown filler | 0.953±0.010 |
| role color | 0.999±0.001 |
| head color | 0.999±0.001 |
| lexical order head color | 0.980±0.000 |
| lexical bag head color | 0.980±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.995±0.002 |
| head size | 0.995±0.002 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.953±0.000 |
| role style | 0.997±0.002 |
| head style | 0.997±0.002 |
| lexical order head style | 0.998±0.000 |
| lexical bag head style | 0.998±0.000 |
| role text | 0.973±0.009 |
| head text | 0.973±0.009 |
| lexical order head text | 0.542±0.000 |
| lexical bag head text | 0.635±0.000 |
| role relation | 0.992±0.007 |
| head relation | 0.992±0.007 |
| lexical order head relation | 0.815±0.000 |
| lexical bag head relation | 0.818±0.000 |
| role landmark | 0.939±0.008 |
| head landmark | 0.963±0.007 |
| lexical order head landmark | 0.815±0.000 |
| lexical bag head landmark | 0.807±0.000 |
| role region | 0.990±0.000 |
| head region | 0.990±0.000 |
| lexical order head region | 0.943±0.000 |
| lexical bag head region | 0.945±0.000 |
| role anchor | 0.991±0.001 |
| head anchor | 0.991±0.001 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 0.958±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 0.980±0.000 |
| role amount | 0.998±0.001 |
| head amount | 0.998±0.001 |
| lexical order head amount | 0.777±0.000 |
| lexical bag head amount | 0.823±0.000 |
| role unit | 0.998±0.001 |
| head unit | 0.998±0.001 |
| lexical order head unit | 0.777±0.000 |
| lexical bag head unit | 0.812±0.000 |
| role direction | 0.998±0.001 |
| head direction | 0.998±0.001 |
| lexical order head direction | 0.943±0.000 |
| lexical bag head direction | 0.943±0.000 |
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
| role source | 0.987±0.004 |
| head source | 0.995±0.004 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.935±0.000 |
| role target | 0.992±0.001 |
| head target | 0.999±0.001 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.927±0.000 |
| role edge | 0.995±0.000 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.953±0.000 |
| lexical bag head edge | 0.953±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.895±0.011 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.105±0.000 |
| role object [pooled midpoint (comparison)] | 0.891±0.001 |
| role color [pooled midpoint (comparison)] | 0.990±0.000 |
| role size [pooled midpoint (comparison)] | 0.993±0.000 |
| role style [pooled midpoint (comparison)] | 0.998±0.001 |
| role text [pooled midpoint (comparison)] | 0.896±0.005 |
| role relation [pooled midpoint (comparison)] | 0.943±0.007 |
| role landmark [pooled midpoint (comparison)] | 0.907±0.007 |
| role region [pooled midpoint (comparison)] | 0.970±0.000 |
| role anchor [pooled midpoint (comparison)] | 0.982±0.003 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.998±0.000 |
| role unit [pooled midpoint (comparison)] | 0.998±0.001 |
| role direction [pooled midpoint (comparison)] | 0.995±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.971±0.003 |
| role target [pooled midpoint (comparison)] | 0.974±0.001 |
| role edge [pooled midpoint (comparison)] | 0.995±0.000 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.698±0.008 |
| presence object: present read present [pooled midpoint (comparison)] | 0.942±0.002 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.998±0.001 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.992±0.002 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present | 0.807±0.025 |
| presence anchor: share of 'present' readings that abstain | 0.064±0.051 |
| presence anchor: share of true 'present' readings that abstain | 0.064±0.051 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| occupancy: known filler | 0.961±0.004 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.648±0.069 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present | 0.993±0.005 |
| presence amount: share of 'present' readings that abstain | 0.004±0.005 |
| presence amount: share of true 'present' readings that abstain | 0.004±0.005 |
| presence unit: present read present | 0.993±0.005 |
| presence unit: share of 'present' readings that abstain | 0.004±0.005 |
| presence unit: share of true 'present' readings that abstain | 0.004±0.005 |
| presence direction: present read present | 0.971±0.020 |
| presence direction: share of 'present' readings that abstain | 0.059±0.020 |
| presence direction: share of true 'present' readings that abstain | 0.059±0.020 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.989±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.993±0.005 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.913±0.000 |
| presence region: present read present | 0.826±0.000 |
| presence region: share of 'present' readings that abstain | 0.035±0.025 |
| presence region: share of true 'present' readings that abstain | 0.035±0.025 |
| presence region: present read present [pooled midpoint (comparison)] | 0.478±0.000 |
| presence text: present read present | 0.944±0.017 |
| presence text: share of 'present' readings that abstain | 0.046±0.009 |
| presence text: share of true 'present' readings that abstain | 0.046±0.009 |
| determiner identity (outside FULL when the legend excludes it) | 0.993±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.800±0.015 |
| presence relation: present read present | 0.955±0.039 |
| presence relation: share of 'present' readings that abstain | 0.080±0.021 |
| presence relation: share of true 'present' readings that abstain | 0.080±0.021 |
| presence landmark: present read present | 0.802±0.035 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.723±0.032 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.606±0.033 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.931±0.049 |
| presence source: share of 'present' readings that abstain | 0.706±0.070 |
| presence source: share of true 'present' readings that abstain | 0.706±0.070 |
| presence target: present read present | 0.989±0.016 |
| presence target: share of 'present' readings that abstain | 0.093±0.032 |
| presence target: share of true 'present' readings that abstain | 0.093±0.032 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.667±0.043 |
| presence target: present read present [pooled midpoint (comparison)] | 0.713±0.043 |
| presence landmark: share of 'present' readings that abstain | 0.152±0.027 |
| presence landmark: share of true 'present' readings that abstain | 0.152±0.027 |
| presence size: present read present | 0.926±0.030 |
| presence size: share of 'present' readings that abstain | 0.026±0.036 |
| presence size: share of true 'present' readings that abstain | 0.026±0.036 |
| presence size: present read present [pooled midpoint (comparison)] | 0.923±0.000 |
| presence text: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: present read present | 0.958±0.059 |
| presence color: share of 'present' readings that abstain | 0.089±0.064 |
| presence color: share of true 'present' readings that abstain | 0.089±0.064 |
| presence color: present read present [pooled midpoint (comparison)] | 0.500±0.000 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.444±0.314 |
| presence style: share of true 'present' readings that abstain | 0.000±0.000 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| presence edge: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.077±0.002; status {'ok': 334, 'abstain': 66}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.402 / 0.300 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.954 | 0.279 / 0.129 | 0.97 | 0.035 | 0.022 / 0.011 |
| roles (pooled) | 0.924 | 0.209 / 0.053 | 0.90 | 0.025 | 0.047 / 0.051 |
| role anchor | 0.842 | 0.187 / 0.000 | 0.74 | 0.000 | 0.105 / 0.158 |
| role fraction | 1.000 | 0.136 / 0.124 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 0.989 | 0.176 / 0.131 | 0.99 | 0.000 | 0.000 / 0.011 |
| role unit | 0.989 | 0.262 / 0.173 | 0.99 | 0.000 | 0.000 / 0.011 |
| role direction | 0.957 | 0.171 / 0.115 | 0.91 | 0.000 | 0.043 / 0.043 |
| role region | 0.826 | 0.124 / 0.000 | 0.78 | 0.000 | 0.043 / 0.174 |
| role text | 0.934 | 0.205 / 0.052 | 0.90 | 0.000 | 0.033 / 0.066 |
| role relation | 0.959 | 0.156 / 0.055 | 0.91 | 0.000 | 0.054 / 0.041 |
| role landmark | 0.635 | 0.087 / 0.000 | 0.66 | 0.108 | 0.081 / 0.257 |
| role source | 0.862 | 0.034 / 0.003 | 0.24 | 0.034 | 0.655 / 0.103 |
| role target | 0.862 | 0.093 / 0.047 | 0.90 | 0.103 | 0.069 / 0.034 |
| role size | 0.926 | 0.167 / 0.076 | 0.93 | 0.000 | 0.000 / 0.074 |
| role color | 1.000 | 0.125 / 0.055 | 0.88 | 0.000 | 0.125 / 0.000 |
| role style | 1.000 | 0.145 / 0.145 | 1.00 | 0.000 | 0.000 / 0.000 |
| role edge | 0.895 | 0.197 / 0.153 | 1.00 | 0.105 | 0.000 / 0.000 |

### new_identities_en — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.832±0.006 |
| FULL [depth given] | 0.832±0.006 |
| FULL [depth and negation given] | 0.832±0.006 |
| FULL [pooled midpoint (comparison)] | 0.606±0.023 |
| presence object: present read present | 0.997±0.002 |
| presence object: share of 'present' readings that abstain | 0.052±0.001 |
| presence object: share of true 'present' readings that abstain | 0.052±0.001 |
| presence color: absent read absent | 0.997±0.001 |
| presence size: present read present | 0.963±0.000 |
| presence size: share of 'present' readings that abstain | 0.000±0.000 |
| presence size: share of true 'present' readings that abstain | 0.000±0.000 |
| presence style: absent read absent | 0.998±0.001 |
| presence text: absent read absent | 0.995±0.004 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.983±0.017 |
| presence amount: share of 'present' readings that abstain | 0.093±0.089 |
| presence amount: share of true 'present' readings that abstain | 0.093±0.089 |
| presence unit: present read present | 0.927±0.040 |
| presence unit: share of 'present' readings that abstain | 0.127±0.046 |
| presence unit: share of true 'present' readings that abstain | 0.127±0.046 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 1.000±0.000 |
| presence target: absent read absent | 1.000±0.000 |
| presence edge: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 0.998±0.002 |
| structure (depth, negation) | 1.000±0.000 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 1.000±0.000 |
| event type (synonym table) | 1.000±0.000 |
| role object | 0.955±0.002 |
| head object | 0.990±0.002 |
| lexical order head object | 0.072±0.000 |
| lexical bag head object | 0.855±0.000 |
| occupancy: known filler | 0.968±0.006 |
| role color | 0.995±0.000 |
| head color | 0.995±0.000 |
| lexical order head color | 0.985±0.000 |
| lexical bag head color | 0.988±0.000 |
| occupancy: not given | 0.999±0.000 |
| role size | 0.998±0.000 |
| head size | 0.998±0.000 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.978±0.000 |
| role style | 0.998±0.001 |
| head style | 0.998±0.001 |
| lexical order head style | 0.988±0.000 |
| lexical bag head style | 0.988±0.000 |
| role text | 0.986±0.006 |
| head text | 0.986±0.006 |
| lexical order head text | 0.535±0.000 |
| lexical bag head text | 0.640±0.000 |
| role relation | 0.992±0.007 |
| head relation | 0.992±0.007 |
| lexical order head relation | 0.790±0.000 |
| lexical bag head relation | 0.838±0.000 |
| role landmark | 0.925±0.007 |
| head landmark | 0.970±0.007 |
| lexical order head landmark | 0.790±0.000 |
| lexical bag head landmark | 0.812±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.955±0.000 |
| lexical bag head region | 0.955±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.967±0.000 |
| lexical bag head anchor | 0.988±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.988±0.000 |
| lexical bag head fraction | 0.993±0.000 |
| role amount | 0.996±0.004 |
| head amount | 0.996±0.004 |
| lexical order head amount | 0.750±0.000 |
| lexical bag head amount | 0.820±0.000 |
| occupancy: unknown filler | 0.963±0.007 |
| role unit | 0.982±0.010 |
| head unit | 0.982±0.010 |
| lexical order head unit | 0.750±0.000 |
| lexical bag head unit | 0.820±0.000 |
| role direction | 0.982±0.005 |
| head direction | 0.982±0.005 |
| lexical order head direction | 0.927±0.000 |
| lexical bag head direction | 0.940±0.000 |
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
| role source | 0.977±0.003 |
| head source | 0.984±0.003 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.945±0.000 |
| role target | 0.980±0.002 |
| head target | 0.983±0.003 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.943±0.000 |
| role edge | 0.998±0.000 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.960±0.000 |
| lexical bag head edge | 0.985±0.000 |
| role quantity | 0.998±0.002 |
| head quantity | 0.998±0.002 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.893±0.008 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.245±0.000 |
| role object [pooled midpoint (comparison)] | 0.848±0.004 |
| role color [pooled midpoint (comparison)] | 0.991±0.001 |
| role size [pooled midpoint (comparison)] | 0.998±0.000 |
| role style [pooled midpoint (comparison)] | 0.993±0.001 |
| role text [pooled midpoint (comparison)] | 0.898±0.008 |
| role relation [pooled midpoint (comparison)] | 0.948±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.897±0.005 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 0.999±0.001 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.957±0.018 |
| role unit [pooled midpoint (comparison)] | 0.971±0.005 |
| role direction [pooled midpoint (comparison)] | 0.962±0.002 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.963±0.000 |
| role target [pooled midpoint (comparison)] | 0.962±0.002 |
| role edge [pooled midpoint (comparison)] | 0.998±0.000 |
| role quantity [pooled midpoint (comparison)] | 0.999±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.652±0.022 |
| presence object: present read present [pooled midpoint (comparison)] | 0.885±0.007 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.963±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.995±0.004 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.835±0.075 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.892±0.026 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence size: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present | 0.975±0.015 |
| presence text: share of 'present' readings that abstain | 0.077±0.017 |
| presence text: share of true 'present' readings that abstain | 0.074±0.018 |
| presence text: present read present [pooled midpoint (comparison)] | 0.788±0.013 |
| presence relation: present read present | 0.960±0.031 |
| presence relation: share of 'present' readings that abstain | 0.070±0.030 |
| presence relation: share of true 'present' readings that abstain | 0.070±0.030 |
| presence landmark: present read present | 0.881±0.034 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.776±0.024 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.772±0.028 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.974±0.036 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.839±0.091 |
| presence source: share of true 'present' readings that abstain | 0.839±0.091 |
| presence target: present read present | 0.989±0.016 |
| presence target: share of 'present' readings that abstain | 0.686±0.077 |
| presence target: share of true 'present' readings that abstain | 0.686±0.077 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.989±0.003 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.598±0.043 |
| presence target: present read present [pooled midpoint (comparison)] | 0.621±0.028 |
| presence edge: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: share of 'present' readings that abstain | 0.406±0.047 |
| presence landmark: share of true 'present' readings that abstain | 0.406±0.047 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 0.747±0.071 |
| presence direction: share of 'present' readings that abstain | 0.145±0.074 |
| presence direction: share of true 'present' readings that abstain | 0.145±0.074 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.489±0.036 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.467±0.047 |
| presence style: share of true 'present' readings that abstain | 0.400±0.000 |
| presence style: present read present [pooled midpoint (comparison)] | 0.467±0.094 |
| presence color: present read present | 0.889±0.079 |
| presence color: share of 'present' readings that abstain | 0.389±0.079 |
| presence color: share of true 'present' readings that abstain | 0.244±0.063 |
| presence color: present read present [pooled midpoint (comparison)] | 0.389±0.079 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.067±0.004; status {'ok': 272, 'abstain': 128}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.400 / 0.306 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.951 | 0.239 / 0.067 | 0.94 | 0.038 | 0.046 / 0.011 |
| roles (pooled) | 0.916 | 0.180 / 0.024 | 0.84 | 0.020 | 0.094 / 0.064 |
| role size | 0.963 | 0.171 / 0.104 | 0.96 | 0.000 | 0.000 / 0.037 |
| role amount | 1.000 | 0.186 / 0.080 | 0.97 | 0.000 | 0.030 / 0.000 |
| role unit | 0.870 | 0.138 / 0.000 | 0.73 | 0.000 | 0.140 / 0.130 |
| role text | 0.995 | 0.199 / 0.074 | 0.95 | 0.000 | 0.048 / 0.005 |
| role relation | 0.976 | 0.173 / 0.088 | 0.94 | 0.000 | 0.036 / 0.024 |
| role landmark | 0.619 | 0.048 / 0.000 | 0.45 | 0.083 | 0.250 / 0.298 |
| role anchor | 1.000 | 0.267 / 0.223 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.146 / 0.135 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.690 | 0.013 / -0.004 | 0.03 | 0.000 | 0.655 / 0.310 |
| role target | 0.724 | 0.046 / 0.004 | 0.34 | 0.000 | 0.379 / 0.276 |
| role edge | 0.938 | 0.166 / 0.107 | 1.00 | 0.062 | 0.000 / 0.000 |
| role region | 1.000 | 0.256 / 0.206 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.759 | 0.112 / 0.000 | 0.62 | 0.000 | 0.138 / 0.241 |
| role style | 1.000 | 0.079 / 0.009 | 0.60 | 0.000 | 0.400 / 0.000 |
| role color | 0.833 | 0.076 / 0.004 | 0.67 | 0.000 | 0.167 / 0.167 |

### train (sample) — catalog candidates (n = 300 of 4524)
| axis | accuracy |
|---|---|
| FULL | 0.861±0.006 |
| FULL [depth given] | 0.861±0.006 |
| FULL [depth and negation given] | 0.861±0.006 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.010±0.005 |
| presence object: share of true 'present' readings that abstain | 0.010±0.005 |
| presence color: absent read absent | 0.997±0.000 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 0.997±0.000 |
| presence text: absent read absent | 1.000±0.000 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: present read present | 0.897±0.096 |
| presence anchor: share of 'present' readings that abstain | 0.051±0.073 |
| presence anchor: share of true 'present' readings that abstain | 0.051±0.073 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 1.000±0.000 |
| presence target: absent read absent | 1.000±0.000 |
| presence edge: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 1.000±0.000 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 1.000±0.000 |
| event type (synonym table) | 1.000±0.000 |
| role object | 0.963±0.000 |
| head object | 1.000±0.000 |
| lexical order head object | 0.140±0.000 |
| lexical bag head object | 0.563±0.000 |
| occupancy: known filler | 0.967±0.001 |
| role color | 0.994±0.002 |
| head color | 0.994±0.002 |
| lexical order head color | 0.973±0.000 |
| lexical bag head color | 0.977±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.991±0.002 |
| head size | 0.991±0.002 |
| lexical order head size | 0.940±0.000 |
| lexical bag head size | 0.980±0.000 |
| role style | 0.997±0.000 |
| head style | 0.997±0.000 |
| lexical order head style | 0.987±0.000 |
| lexical bag head style | 0.983±0.000 |
| role text | 0.996±0.002 |
| head text | 0.996±0.002 |
| lexical order head text | 0.850±0.000 |
| lexical bag head text | 1.000±0.000 |
| role relation | 0.990±0.003 |
| head relation | 0.990±0.003 |
| lexical order head relation | 0.883±0.000 |
| lexical bag head relation | 0.970±0.000 |
| role landmark | 0.950±0.003 |
| head landmark | 0.980±0.003 |
| lexical order head landmark | 0.883±0.000 |
| lexical bag head landmark | 0.910±0.000 |
| role region | 0.997±0.003 |
| head region | 0.997±0.003 |
| lexical order head region | 0.933±0.000 |
| lexical bag head region | 0.997±0.000 |
| role anchor | 0.996±0.004 |
| head anchor | 0.996±0.004 |
| lexical order head anchor | 0.957±0.000 |
| lexical bag head anchor | 1.000±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.990±0.000 |
| lexical bag head fraction | 0.997±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.913±0.000 |
| lexical bag head amount | 1.000±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.913±0.000 |
| lexical bag head unit | 0.997±0.000 |
| role direction | 0.991±0.008 |
| head direction | 0.991±0.008 |
| lexical order head direction | 0.903±0.000 |
| lexical bag head direction | 0.953±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.960±0.000 |
| lexical bag head axis | 0.990±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.950±0.000 |
| lexical bag head layout | 0.977±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 0.977±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.969±0.004 |
| head source | 0.992±0.004 |
| lexical order head source | 0.897±0.000 |
| lexical bag head source | 0.943±0.000 |
| role target | 0.990±0.000 |
| head target | 1.000±0.000 |
| lexical order head target | 0.920±0.000 |
| lexical bag head target | 0.937±0.000 |
| role edge | 0.993±0.000 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.940±0.000 |
| lexical bag head edge | 0.967±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.973±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.933±0.003 |
| heads FULL (lexical order baseline) | 0.013±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.400±0.000 |
| presence color: present read present | 0.917±0.059 |
| presence color: share of 'present' readings that abstain | 0.241±0.013 |
| presence color: share of true 'present' readings that abstain | 0.137±0.008 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence text: present read present | 0.970±0.010 |
| presence text: share of 'present' readings that abstain | 0.038±0.028 |
| presence text: share of true 'present' readings that abstain | 0.038±0.028 |
| determiner identity (outside FULL when the legend excludes it) | 0.957±0.000 |
| presence region: present read present | 0.950±0.041 |
| presence region: share of 'present' readings that abstain | 0.034±0.024 |
| presence region: share of true 'present' readings that abstain | 0.034±0.024 |
| presence relation: present read present | 0.914±0.023 |
| presence relation: share of 'present' readings that abstain | 0.093±0.025 |
| presence relation: share of true 'present' readings that abstain | 0.093±0.025 |
| presence landmark: present read present | 0.829±0.023 |
| presence landmark: share of 'present' readings that abstain | 0.150±0.020 |
| presence landmark: share of true 'present' readings that abstain | 0.150±0.020 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.000±0.000 |
| presence amount: share of true 'present' readings that abstain | 0.000±0.000 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.013±0.018 |
| presence unit: share of true 'present' readings that abstain | 0.013±0.018 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence size: present read present | 0.852±0.026 |
| presence size: share of 'present' readings that abstain | 0.086±0.027 |
| presence size: share of true 'present' readings that abstain | 0.086±0.027 |
| presence style: share of 'present' readings that abstain | 0.200±0.000 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.925±0.040 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.069±0.020 |
| presence target: share of true 'present' readings that abstain | 0.069±0.020 |
| presence source: share of 'present' readings that abstain | 0.446±0.091 |
| presence source: share of true 'present' readings that abstain | 0.446±0.091 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.028±0.039 |
| presence axis: share of true 'present' readings that abstain | 0.028±0.039 |
| presence direction: present read present | 0.908±0.081 |
| presence direction: share of 'present' readings that abstain | 0.089±0.044 |
| presence direction: share of true 'present' readings that abstain | 0.089±0.044 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.042±0.059 |
| presence quantity: share of true 'present' readings that abstain | 0.042±0.059 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.143±0.117 |
| presence pairing: share of true 'present' readings that abstain | 0.143±0.117 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.063±0.003; status {'ok': 261, 'abstain': 39}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.428 / 0.328 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.957 | 0.300 / 0.148 | 1.00 | 0.039 | 0.000 / 0.004 |
| roles (pooled) | 0.917 | 0.230 / 0.058 | 0.91 | 0.038 | 0.039 / 0.046 |
| role anchor | 0.923 | 0.226 / 0.084 | 0.92 | 0.000 | 0.000 / 0.077 |
| role color | 1.000 | 0.156 / 0.066 | 0.88 | 0.000 | 0.125 / 0.000 |
| role text | 0.956 | 0.224 / 0.125 | 0.96 | 0.000 | 0.000 / 0.044 |
| role region | 0.900 | 0.218 / 0.052 | 0.90 | 0.000 | 0.000 / 0.100 |
| role relation | 0.886 | 0.174 / 0.016 | 0.83 | 0.000 | 0.057 / 0.114 |
| role landmark | 0.543 | 0.104 / 0.000 | 0.66 | 0.171 | 0.057 / 0.286 |
| role amount | 1.000 | 0.211 / 0.126 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.229 / 0.088 | 0.96 | 0.000 | 0.038 / 0.000 |
| role layout | 1.000 | 0.262 / 0.237 | 1.00 | 0.000 | 0.000 / 0.000 |
| role size | 0.889 | 0.163 / 0.010 | 0.78 | 0.000 | 0.111 / 0.111 |
| role source | 0.710 | 0.047 / 0.000 | 0.52 | 0.097 | 0.290 / 0.194 |
| role target | 0.875 | 0.151 / 0.083 | 0.96 | 0.125 | 0.042 / 0.000 |
| role edge | 0.889 | 0.232 / 0.177 | 1.00 | 0.111 | 0.000 / 0.000 |
| role axis | 1.000 | 0.288 / 0.141 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.966 | 0.203 / 0.025 | 0.83 | 0.000 | 0.138 / 0.034 |
| role quantity | 1.000 | 0.135 / 0.081 | 0.88 | 0.000 | 0.125 / 0.000 |
| role pairing | 1.000 | 0.187 / 0.036 | 0.71 | 0.000 | 0.286 / 0.000 |
| role style | 1.000 | 0.221 / 0.148 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.173 / 0.146 | 1.00 | 0.000 | 0.000 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 COMPONENT=0.98 PAIR=0.93 DIR=0.86 not=0.85 EDGE=0.84 UNIT=0.84 AXIS=0.76 ANCHOR=0.76 REGION=0.58 back=0.54 front=0.50 LABEL=0.47 FILLER=0.47 never=0.46 VERB=0.42 flow=0.40 dimensiunea=0.36 LAYOUT=0.31 apart=0.23 PRON=0.22 is=0.16 CONN=0.12 din=0.12 together=0.12 unknown=0.12 are=0.11 care=0.08 do=0.07 FRACTION=0.05 color=0.05 pe=0.05 lui=0.03 INTRO=0.02 evenly=0.02 REL=0.02 spre=0.02 cu=0.01 de=0.01 DEM=0.01 la=0.01 SIZE=0.01 STYLE=0.01 the=0.00 COLOR=0.00 a=0.00 NUM=0.00 QUANT=0.00

## What is weak, what to add
- heldout_formulations: FULL 0.815
- heldout_formulations: presence object: share of 'present' readings that abstain 0.018
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.018
- heldout_formulations: presence size: share of 'present' readings that abstain 0.118
- heldout_formulations: presence size: share of true 'present' readings that abstain 0.118
- heldout_formulations: heads FULL (lexical order baseline) 0.020
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.045
- heldout_formulations: FULL [depth given] 0.815
- heldout_formulations: FULL [depth and negation given] 0.815
- heldout_formulations: FULL [presence not decided] 0.815
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.640
- heldout_formulations: role object [pooled midpoint (comparison)] 0.885
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.725
- heldout_formulations: presence text: share of 'present' readings that abstain 0.091
- heldout_formulations: presence text: share of true 'present' readings that abstain 0.048
- heldout_formulations: presence text: present read present [pooled midpoint (comparison)] 0.571
- heldout_formulations: presence pairing: share of 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence source: present read present 0.690
- heldout_formulations: presence source: share of 'present' readings that abstain 0.650
- heldout_formulations: presence source: share of true 'present' readings that abstain 0.650
- heldout_formulations: presence source: present read present [pooled midpoint (comparison)] 0.655
- heldout_formulations: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: present read present [pooled midpoint (comparison)] 0.857
- heldout_formulations: presence target: share of 'present' readings that abstain 0.115
- heldout_formulations: presence target: share of true 'present' readings that abstain 0.115
- heldout_formulations: presence edge: share of 'present' readings that abstain 0.115
- heldout_formulations: presence edge: share of true 'present' readings that abstain 0.115
- heldout_formulations: presence target: present read present [pooled midpoint (comparison)] 0.885
- heldout_formulations: presence edge: present read present [pooled midpoint (comparison)] 0.885
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.080
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.080
- heldout_formulations: presence landmark: present read present 0.815
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.045
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.045
- heldout_formulations: presence amount: share of 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence relation: present read present [pooled midpoint (comparison)] 0.741
- heldout_formulations: presence landmark: present read present [pooled midpoint (comparison)] 0.741
- heldout_formulations: presence style: share of 'present' readings that abstain 0.182
- heldout_formulations: presence style: share of true 'present' readings that abstain 0.182
- heldout_formulations: presence style: present read present [pooled midpoint (comparison)] 0.727
- heldout_formulations: presence region: share of 'present' readings that abstain 0.077
- heldout_formulations: presence region: share of true 'present' readings that abstain 0.077
- heldout_formulations: presence region: present read present [pooled midpoint (comparison)] 0.615
- heldout_formulations: presence quantity: share of 'present' readings that abstain 0.273
- heldout_formulations: presence quantity: share of true 'present' readings that abstain 0.273
- heldout_formulations: presence quantity: present read present [pooled midpoint (comparison)] 0.818
- heldout_formulations: presence color: share of 'present' readings that abstain 0.500
- heldout_formulations: presence color: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence axis: share of 'present' readings that abstain 0.000
- heldout_formulations: presence axis: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: FULL 0.876
- heldout_formulations_en: presence object: share of 'present' readings that abstain 0.049
- heldout_formulations_en: presence object: share of true 'present' readings that abstain 0.049
- heldout_formulations_en: heads FULL (lexical order baseline) 0.017
- heldout_formulations_en: heads FULL (lexical bag baseline, trained on the same training rows) 0.311
- heldout_formulations_en: FULL [depth given] 0.876
- heldout_formulations_en: FULL [depth and negation given] 0.876
- heldout_formulations_en: FULL [presence not decided] 0.893
- heldout_formulations_en: FULL [pooled midpoint (comparison)] 0.695
- heldout_formulations_en: role object [pooled midpoint (comparison)] 0.836
- heldout_formulations_en: heads FULL (model) [pooled midpoint (comparison)] 0.774
- heldout_formulations_en: presence object: present read present [pooled midpoint (comparison)] 0.844
- heldout_formulations_en: presence direction: share of 'present' readings that abstain 0.333
- heldout_formulations_en: presence direction: share of true 'present' readings that abstain 0.333
- heldout_formulations_en: presence direction: present read present [pooled midpoint (comparison)] 0.667
- heldout_formulations_en: presence relation: share of 'present' readings that abstain 0.100
- heldout_formulations_en: presence relation: share of true 'present' readings that abstain 0.100
- heldout_formulations_en: presence landmark: share of 'present' readings that abstain 0.500
- heldout_formulations_en: presence landmark: share of true 'present' readings that abstain 0.500
- heldout_formulations_en: presence relation: present read present [pooled midpoint (comparison)] 0.800
- heldout_formulations_en: presence landmark: present read present [pooled midpoint (comparison)] 0.850
- heldout_formulations_en: presence text: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence text: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence text: present read present [pooled midpoint (comparison)] 0.870
- heldout_formulations_en: presence size: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence size: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence size: present read present [pooled midpoint (comparison)] 0.833
- heldout_formulations_en: presence quantity: share of 'present' readings that abstain 0.062
- heldout_formulations_en: presence quantity: share of true 'present' readings that abstain 0.062
- heldout_formulations_en: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence fraction: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence region: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence region: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence style: share of 'present' readings that abstain 0.833
- heldout_formulations_en: presence amount: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence amount: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence target: share of 'present' readings that abstain 0.464
- heldout_formulations_en: presence target: share of true 'present' readings that abstain 0.464
- heldout_formulations_en: presence edge: present read present 0.897
- heldout_formulations_en: presence edge: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence edge: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence edge: present read present [pooled midpoint (comparison)] 0.897
- heldout_formulations_en: presence style: share of true 'present' readings that abstain 0.800
- heldout_formulations_en: presence style: present read present [pooled midpoint (comparison)] 0.400
- heldout_sentences: FULL 0.800
- heldout_sentences: presence object: share of 'present' readings that abstain 0.022
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.022
- heldout_sentences: presence region: present read present 0.833
- heldout_sentences: presence region: share of 'present' readings that abstain 0.067
- heldout_sentences: presence region: share of true 'present' readings that abstain 0.067
- heldout_sentences: heads FULL (model) 0.884
- heldout_sentences: heads FULL (lexical order baseline) 0.006
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.208
- heldout_sentences: FULL [depth given] 0.800
- heldout_sentences: FULL [depth and negation given] 0.800
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.658
- heldout_sentences: role object [pooled midpoint (comparison)] 0.863
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.723
- heldout_sentences: presence region: present read present [pooled midpoint (comparison)] 0.722
- heldout_sentences: presence source: present read present 0.836
- heldout_sentences: presence target: share of 'present' readings that abstain 0.209
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.209
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.607
- heldout_sentences: presence target: present read present [pooled midpoint (comparison)] 0.795
- heldout_sentences: presence source: share of 'present' readings that abstain 0.686
- heldout_sentences: presence source: share of true 'present' readings that abstain 0.686
- heldout_sentences: presence edge: share of 'present' readings that abstain 0.000
- heldout_sentences: presence edge: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence color: share of 'present' readings that abstain 0.211
- heldout_sentences: presence size: share of 'present' readings that abstain 0.032
- heldout_sentences: presence size: share of true 'present' readings that abstain 0.033
- heldout_sentences: presence size: present read present [pooled midpoint (comparison)] 0.727
- heldout_sentences: presence layout: share of 'present' readings that abstain 0.042
- heldout_sentences: presence layout: share of true 'present' readings that abstain 0.042
- heldout_sentences: presence layout: present read present [pooled midpoint (comparison)] 0.800
- heldout_sentences: presence axis: share of 'present' readings that abstain 0.000
- heldout_sentences: presence axis: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence axis: present read present [pooled midpoint (comparison)] 0.889
- heldout_sentences: presence pairing: present read present 0.765
- heldout_sentences: presence pairing: present read present [pooled midpoint (comparison)] 0.882
- heldout_sentences: presence text: share of 'present' readings that abstain 0.028
- heldout_sentences: presence text: share of true 'present' readings that abstain 0.029
- heldout_sentences: presence direction: share of 'present' readings that abstain 0.036
- heldout_sentences: presence direction: share of true 'present' readings that abstain 0.036
- heldout_sentences: presence direction: present read present [pooled midpoint (comparison)] 0.806
- heldout_sentences: presence pairing: share of 'present' readings that abstain 0.154
- heldout_sentences: presence pairing: share of true 'present' readings that abstain 0.154
- heldout_sentences: presence relation: share of 'present' readings that abstain 0.016
- heldout_sentences: presence relation: share of true 'present' readings that abstain 0.016
- heldout_sentences: presence landmark: present read present 0.828
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.189
- heldout_sentences: presence landmark: share of true 'present' readings that abstain 0.189
- heldout_sentences: presence relation: present read present [pooled midpoint (comparison)] 0.733
- heldout_sentences: presence landmark: present read present [pooled midpoint (comparison)] 0.800
- heldout_sentences: presence anchor: share of 'present' readings that abstain 0.042
- heldout_sentences: presence anchor: share of true 'present' readings that abstain 0.042
- heldout_sentences: presence anchor: present read present [pooled midpoint (comparison)] 0.760
- heldout_sentences: presence style: share of 'present' readings that abstain 0.600
- heldout_sentences: presence style: share of true 'present' readings that abstain 0.500
- heldout_sentences: presence style: present read present [pooled midpoint (comparison)] 0.500
- heldout_sentences: presence amount: share of 'present' readings that abstain 0.000
- heldout_sentences: presence amount: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.100
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.100
- heldout_sentences: presence fraction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence color: share of true 'present' readings that abstain 0.062
- heldout_sentences: presence color: present read present [pooled midpoint (comparison)] 0.647
- heldout_sentences: presence quantity: share of 'present' readings that abstain 0.167
- heldout_sentences: presence quantity: share of true 'present' readings that abstain 0.167
- heldout_sentences: presence size: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: presence text: share of FALSE 'present' readings that abstain 0.000
- mixed: FULL 0.800
- mixed: presence object: share of 'present' readings that abstain 0.011
- mixed: presence object: share of true 'present' readings that abstain 0.011
- mixed: presence relation: share of 'present' readings that abstain 0.042
- mixed: presence relation: share of true 'present' readings that abstain 0.042
- mixed: presence landmark: present read present 0.774
- mixed: heads FULL (model) 0.890
- mixed: heads FULL (lexical order baseline) 0.013
- mixed: heads FULL (lexical bag baseline, trained on the same training rows) 0.100
- mixed: FULL [depth given] 0.800
- mixed: FULL [depth and negation given] 0.800
- mixed: FULL [pooled midpoint (comparison)] 0.610
- mixed: role object [pooled midpoint (comparison)] 0.835
- mixed: heads FULL (model) [pooled midpoint (comparison)] 0.675
- mixed: presence relation: present read present [pooled midpoint (comparison)] 0.612
- mixed: presence landmark: present read present [pooled midpoint (comparison)] 0.633
- mixed: presence region: present read present 0.800
- mixed: presence region: present read present [pooled midpoint (comparison)] 0.529
- mixed: presence anchor: present read present 0.895
- mixed: presence anchor: share of 'present' readings that abstain 0.000
- mixed: presence anchor: share of true 'present' readings that abstain 0.000
- mixed: presence anchor: present read present [pooled midpoint (comparison)] 0.763
- mixed: presence layout: share of 'present' readings that abstain 0.000
- mixed: presence layout: share of true 'present' readings that abstain 0.000
- mixed: presence layout: present read present [pooled midpoint (comparison)] 0.852
- mixed: presence amount: share of 'present' readings that abstain 0.000
- mixed: presence amount: share of true 'present' readings that abstain 0.000
- mixed: presence unit: share of 'present' readings that abstain 0.000
- mixed: presence unit: share of true 'present' readings that abstain 0.000
- mixed: presence landmark: share of 'present' readings that abstain 0.073
- mixed: presence landmark: share of true 'present' readings that abstain 0.073
- mixed: presence source: present read present 0.810
- mixed: presence source: share of 'present' readings that abstain 0.647
- mixed: presence source: share of true 'present' readings that abstain 0.647
- mixed: presence target: share of 'present' readings that abstain 0.160
- mixed: presence target: share of true 'present' readings that abstain 0.160
- mixed: presence edge: share of 'present' readings that abstain 0.118
- mixed: presence edge: share of true 'present' readings that abstain 0.118
- mixed: presence source: present read present [pooled midpoint (comparison)] 0.610
- mixed: presence target: present read present [pooled midpoint (comparison)] 0.769
- mixed: presence edge: present read present [pooled midpoint (comparison)] 0.824
- mixed: presence color: present read present 0.882
- mixed: presence color: share of 'present' readings that abstain 0.118
- mixed: presence color: share of true 'present' readings that abstain 0.000
- mixed: presence color: present read present [pooled midpoint (comparison)] 0.706
- mixed: presence text: share of 'present' readings that abstain 0.061
- mixed: presence text: share of true 'present' readings that abstain 0.061
- mixed: presence text: present read present [pooled midpoint (comparison)] 0.857
- mixed: presence region: share of 'present' readings that abstain 0.071
- mixed: presence region: share of true 'present' readings that abstain 0.071
- mixed: presence fraction: share of 'present' readings that abstain 0.000
- mixed: presence fraction: share of true 'present' readings that abstain 0.000
- mixed: presence axis: share of 'present' readings that abstain 0.000
- mixed: presence axis: share of true 'present' readings that abstain 0.000
- mixed: presence quantity: share of 'present' readings that abstain 0.000
- mixed: presence quantity: share of true 'present' readings that abstain 0.000
- mixed: presence direction: share of 'present' readings that abstain 0.000
- mixed: presence direction: share of true 'present' readings that abstain 0.000
- mixed: presence pairing: present read present 0.875
- mixed: presence pairing: share of 'present' readings that abstain 0.143
- mixed: presence pairing: share of true 'present' readings that abstain 0.143
- mixed: presence style: share of 'present' readings that abstain 0.200
- mixed: presence style: share of true 'present' readings that abstain 0.200
- mixed: presence style: present read present [pooled midpoint (comparison)] 0.800
- mixed: presence size: present read present 0.857
- mixed: presence size: share of 'present' readings that abstain 0.000
- mixed: presence size: share of true 'present' readings that abstain 0.000
- new_identities: FULL 0.840
- new_identities: presence object: share of 'present' readings that abstain 0.024
- new_identities: presence object: share of true 'present' readings that abstain 0.024
- new_identities: heads FULL (model) 0.885
- new_identities: heads FULL (lexical order baseline) 0.000
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.105
- new_identities: FULL [depth given] 0.840
- new_identities: FULL [depth and negation given] 0.840
- new_identities: FULL [pooled midpoint (comparison)] 0.662
- new_identities: role object [pooled midpoint (comparison)] 0.890
- new_identities: role landmark [pooled midpoint (comparison)] 0.897
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.690
- new_identities: presence anchor: present read present 0.842
- new_identities: presence anchor: share of 'present' readings that abstain 0.125
- new_identities: presence anchor: share of true 'present' readings that abstain 0.125
- new_identities: presence fraction: share of 'present' readings that abstain 0.000
- new_identities: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities: presence anchor: present read present [pooled midpoint (comparison)] 0.667
- new_identities: presence amount: share of 'present' readings that abstain 0.000
- new_identities: presence amount: share of true 'present' readings that abstain 0.000
- new_identities: presence unit: share of 'present' readings that abstain 0.000
- new_identities: presence unit: share of true 'present' readings that abstain 0.000
- new_identities: presence direction: share of 'present' readings that abstain 0.045
- new_identities: presence direction: share of true 'present' readings that abstain 0.045
- new_identities: presence region: present read present 0.826
- new_identities: presence region: share of 'present' readings that abstain 0.053
- new_identities: presence region: share of true 'present' readings that abstain 0.053
- new_identities: presence region: present read present [pooled midpoint (comparison)] 0.478
- new_identities: presence text: share of 'present' readings that abstain 0.035
- new_identities: presence text: share of true 'present' readings that abstain 0.035
- new_identities: presence text: present read present [pooled midpoint (comparison)] 0.820
- new_identities: presence relation: share of 'present' readings that abstain 0.056
- new_identities: presence relation: share of true 'present' readings that abstain 0.056
- new_identities: presence landmark: present read present 0.770
- new_identities: presence relation: present read present [pooled midpoint (comparison)] 0.718
- new_identities: presence landmark: present read present [pooled midpoint (comparison)] 0.563
- new_identities: presence source: share of 'present' readings that abstain 0.750
- new_identities: presence source: share of true 'present' readings that abstain 0.750
- new_identities: presence target: share of 'present' readings that abstain 0.071
- new_identities: presence target: share of true 'present' readings that abstain 0.071
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.655
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.724
- new_identities: presence landmark: share of 'present' readings that abstain 0.140
- new_identities: presence landmark: share of true 'present' readings that abstain 0.140
- new_identities: presence size: share of 'present' readings that abstain 0.000
- new_identities: presence size: share of true 'present' readings that abstain 0.000
- new_identities: presence text: share of FALSE 'present' readings that abstain 0.000
- new_identities: presence color: share of 'present' readings that abstain 0.125
- new_identities: presence color: share of true 'present' readings that abstain 0.125
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.500
- new_identities: presence style: share of 'present' readings that abstain 0.667
- new_identities: presence style: share of true 'present' readings that abstain 0.000
- new_identities: presence edge: share of 'present' readings that abstain 0.000
- new_identities: presence edge: share of true 'present' readings that abstain 0.000
- new_identities_en: FULL 0.828
- new_identities_en: presence object: share of 'present' readings that abstain 0.051
- new_identities_en: presence object: share of true 'present' readings that abstain 0.051
- new_identities_en: presence size: share of 'present' readings that abstain 0.000
- new_identities_en: presence size: share of true 'present' readings that abstain 0.000
- new_identities_en: presence amount: share of 'present' readings that abstain 0.030
- new_identities_en: presence amount: share of true 'present' readings that abstain 0.030
- new_identities_en: presence unit: present read present 0.870
- new_identities_en: presence unit: share of 'present' readings that abstain 0.161
- new_identities_en: presence unit: share of true 'present' readings that abstain 0.161
- new_identities_en: heads FULL (model) 0.882
- new_identities_en: heads FULL (lexical order baseline) 0.000
- new_identities_en: heads FULL (lexical bag baseline, trained on the same training rows) 0.245
- new_identities_en: FULL [depth given] 0.828
- new_identities_en: FULL [depth and negation given] 0.828
- new_identities_en: FULL [pooled midpoint (comparison)] 0.605
- new_identities_en: role object [pooled midpoint (comparison)] 0.853
- new_identities_en: role text [pooled midpoint (comparison)] 0.892
- new_identities_en: heads FULL (model) [pooled midpoint (comparison)] 0.652
- new_identities_en: presence object: present read present [pooled midpoint (comparison)] 0.894
- new_identities_en: presence amount: present read present [pooled midpoint (comparison)] 0.850
- new_identities_en: presence unit: present read present [pooled midpoint (comparison)] 0.870
- new_identities_en: presence text: share of 'present' readings that abstain 0.053
- new_identities_en: presence text: share of true 'present' readings that abstain 0.049
- new_identities_en: presence text: present read present [pooled midpoint (comparison)] 0.778
- new_identities_en: presence relation: share of 'present' readings that abstain 0.037
- new_identities_en: presence relation: share of true 'present' readings that abstain 0.037
- new_identities_en: presence landmark: present read present 0.857
- new_identities_en: presence relation: present read present [pooled midpoint (comparison)] 0.780
- new_identities_en: presence landmark: present read present [pooled midpoint (comparison)] 0.793
- new_identities_en: presence anchor: share of 'present' readings that abstain 0.000
- new_identities_en: presence anchor: share of true 'present' readings that abstain 0.000
- new_identities_en: presence fraction: share of 'present' readings that abstain 0.000
- new_identities_en: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities_en: presence target: share of 'present' readings that abstain 0.643
- new_identities_en: presence target: share of true 'present' readings that abstain 0.643
- new_identities_en: presence edge: share of 'present' readings that abstain 0.000
- new_identities_en: presence edge: share of true 'present' readings that abstain 0.000
- new_identities_en: presence source: present read present [pooled midpoint (comparison)] 0.586
- new_identities_en: presence target: present read present [pooled midpoint (comparison)] 0.655
- new_identities_en: presence landmark: share of 'present' readings that abstain 0.472
- new_identities_en: presence landmark: share of true 'present' readings that abstain 0.472
- new_identities_en: presence region: share of 'present' readings that abstain 0.000
- new_identities_en: presence region: share of true 'present' readings that abstain 0.000
- new_identities_en: presence direction: present read present 0.759
- new_identities_en: presence direction: share of 'present' readings that abstain 0.182
- new_identities_en: presence direction: share of true 'present' readings that abstain 0.182
- new_identities_en: presence direction: present read present [pooled midpoint (comparison)] 0.448
- new_identities_en: presence style: share of 'present' readings that abstain 0.500
- new_identities_en: presence style: share of true 'present' readings that abstain 0.400
- new_identities_en: presence style: present read present [pooled midpoint (comparison)] 0.400
- new_identities_en: presence color: present read present 0.833
- new_identities_en: presence color: share of 'present' readings that abstain 0.333
- new_identities_en: presence color: share of true 'present' readings that abstain 0.200
- new_identities_en: presence color: present read present [pooled midpoint (comparison)] 0.333
- new_identities_en: presence text: share of FALSE 'present' readings that abstain 0.500
- train (sample): FULL 0.857
- train (sample): presence object: share of 'present' readings that abstain 0.004
- train (sample): presence object: share of true 'present' readings that abstain 0.004
- train (sample): presence anchor: share of 'present' readings that abstain 0.000
- train (sample): presence anchor: share of true 'present' readings that abstain 0.000
- train (sample): heads FULL (lexical order baseline) 0.013
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.400
- train (sample): FULL [depth given] 0.857
- train (sample): FULL [depth and negation given] 0.857
- train (sample): presence color: share of 'present' readings that abstain 0.222
- train (sample): presence color: share of true 'present' readings that abstain 0.125
- train (sample): presence text: share of 'present' readings that abstain 0.000
- train (sample): presence text: share of true 'present' readings that abstain 0.000
- train (sample): presence region: share of 'present' readings that abstain 0.000
- train (sample): presence region: share of true 'present' readings that abstain 0.000
- train (sample): presence relation: present read present 0.886
- train (sample): presence relation: share of 'present' readings that abstain 0.065
- train (sample): presence relation: share of true 'present' readings that abstain 0.065
- train (sample): presence landmark: present read present 0.800
- train (sample): presence landmark: share of 'present' readings that abstain 0.179
- train (sample): presence landmark: share of true 'present' readings that abstain 0.179
- train (sample): presence amount: share of 'present' readings that abstain 0.000
- train (sample): presence amount: share of true 'present' readings that abstain 0.000
- train (sample): presence unit: share of 'present' readings that abstain 0.038
- train (sample): presence unit: share of true 'present' readings that abstain 0.038
- train (sample): presence layout: share of 'present' readings that abstain 0.000
- train (sample): presence layout: share of true 'present' readings that abstain 0.000
- train (sample): presence size: present read present 0.889
- train (sample): presence size: share of 'present' readings that abstain 0.125
- train (sample): presence size: share of true 'present' readings that abstain 0.125
- train (sample): presence style: share of 'present' readings that abstain 0.200
- train (sample): presence target: share of 'present' readings that abstain 0.042
- train (sample): presence target: share of true 'present' readings that abstain 0.042
- train (sample): presence source: share of 'present' readings that abstain 0.448
- train (sample): presence source: share of true 'present' readings that abstain 0.448
- train (sample): presence edge: share of 'present' readings that abstain 0.000
- train (sample): presence edge: share of true 'present' readings that abstain 0.000
- train (sample): presence axis: share of 'present' readings that abstain 0.000
- train (sample): presence axis: share of true 'present' readings that abstain 0.000
- train (sample): presence direction: share of 'present' readings that abstain 0.143
- train (sample): presence direction: share of true 'present' readings that abstain 0.143
- train (sample): presence quantity: share of 'present' readings that abstain 0.125
- train (sample): presence quantity: share of true 'present' readings that abstain 0.125
- train (sample): presence pairing: share of 'present' readings that abstain 0.286
- train (sample): presence pairing: share of true 'present' readings that abstain 0.286
- train (sample): presence style: share of true 'present' readings that abstain 0.000
- train (sample): presence fraction: share of 'present' readings that abstain 0.000
- train (sample): presence fraction: share of true 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_sentences: `ai putea sa atasezi QUANT COMPONENT PAIR .` FULL 0.000 (n 2)
- new_identities_en: `make LABEL NUM UNIT SIZE .` FULL 0.000 (n 2)
- heldout_formulations: `vreau sa uniti QUANT COMPONENT STYLE PAIR .` FULL 0.000 (n 1)
- heldout_formulations: `nu redimensionati COMPONENT COLOR la dimensiunea SIZE va rog .` FULL 0.000 (n 1)
- heldout_formulations: `okay deci radiaza QUANT COMPONENT care nu sunt COLOR .` FULL 0.000 (n 1)
- heldout_formulations: `as_vrea sa conectezi COMPONENT STYLE si COMPONENT STYLE cu a EDGE .` FULL 0.000 (n 1)
- heldout_formulations: `vreau sa legati QUANT COMPONENT PAIR .` FULL 0.000 (n 1)
- heldout_formulations_en: `now make the STYLE COMPONENT NUM UNIT SIZE .` FULL 0.000 (n 1)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role size | role style | role text | role relation | role landmark | role region | role anchor | role fraction | role amount | role unit | role direction | role axis | role layout | role pairing | role source | role target | role edge | role quantity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.912±0.023 | 0.810±0.019 | 0.935±0.004 | 0.997±0.002 | 1.000±0.000 | 0.995±0.004 | 0.993±0.002 | 0.988±0.006 | 0.952±0.002 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.928±0.008 | 0.965±0.007 | 0.970±0.004 | 1.000±0.000 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.732±0.021 | 0.647±0.021 | 0.872±0.015 | 0.998±0.002 | 0.998±0.002 | 0.982±0.002 | 0.955±0.007 | 0.972±0.006 | 0.942±0.002 | 0.977±0.002 | 0.995±0.004 | 0.995±0.004 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.925±0.007 | 0.958±0.002 | 0.960±0.000 | 0.983±0.005 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.922±0.021 | 0.818±0.016 | 0.935±0.004 | 0.985±0.000 | 1.000±0.000 | 1.000±0.000 | 0.998±0.002 | 1.000±0.000 | 0.962±0.002 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.928±0.008 | 0.963±0.009 | 0.973±0.002 | 1.000±0.000 |
| heldout_formulations_en | product readout: presence decided | 0.940±0.014 | 0.863±0.010 | 0.970±0.005 | 0.998±0.003 | 1.000±0.000 | 0.994±0.000 | 1.000±0.000 | 0.998±0.003 | 0.976±0.003 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.998±0.003 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.953±0.012 | 0.936±0.010 | 0.966±0.005 | 1.000±0.000 |
| heldout_formulations_en | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.748±0.023 | 0.672±0.017 | 0.827±0.007 | 1.000±0.000 | 0.989±0.005 | 0.985±0.003 | 0.979±0.003 | 0.979±0.007 | 0.957±0.003 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.998±0.003 | 1.000±0.000 | 0.994±0.000 | 1.000±0.000 | 1.000±0.000 | 0.998±0.003 | 0.949±0.014 | 0.928±0.012 | 0.964±0.007 | 0.996±0.003 |
| heldout_formulations_en | v16 protocol: every role read, not available to the product | 0.951±0.023 | 0.874±0.013 | 0.972±0.008 | 0.994±0.000 | 1.000±0.000 | 0.994±0.000 | 1.000±0.000 | 1.000±0.000 | 0.979±0.003 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.953±0.012 | 0.934±0.012 | 0.977±0.005 | 1.000±0.000 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.022±0.006 (— / 0.022±0.006) |
| heldout_formulations | object | comparison: pooled midpoint | 0.922±0.015 | 1.000±0.000 | 0.961±0.007 |  |
| heldout_formulations | color | product: fitted | 1.000±0.000 | 0.997±0.002 | 0.998±0.001 | 0.333±0.236 (1.000±0.000 / 0.000±0.000) |
| heldout_formulations | color | comparison: pooled midpoint | 1.000±0.000 | 0.998±0.002 | 0.999±0.001 |  |
| heldout_formulations | size | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.098±0.028 (— / 0.098±0.028) |
| heldout_formulations | size | comparison: pooled midpoint | 0.980±0.028 | 1.000±0.000 | 0.990±0.014 |  |
| heldout_formulations | style | product: fitted | 0.909±0.074 | 1.000±0.000 | 0.955±0.037 | 0.272±0.065 (— / 0.272±0.065) |
| heldout_formulations | style | comparison: pooled midpoint | 0.667±0.043 | 1.000±0.000 | 0.833±0.021 |  |
| heldout_formulations | text | product: fitted | 0.952±0.039 | 0.998±0.003 | 0.975±0.018 | 0.115±0.025 (1.000 / 0.101±0.042) |
| heldout_formulations | text | comparison: pooled midpoint | 0.587±0.059 | 0.998±0.003 | 0.793±0.030 |  |
| heldout_formulations | relation | product: fitted | 0.914±0.046 | 1.000±0.000 | 0.957±0.023 | 0.039±0.033 (— / 0.039±0.033) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.790±0.046 | 1.000±0.000 | 0.895±0.023 |  |
| heldout_formulations | landmark | product: fitted | 0.827±0.017 | 1.000±0.000 | 0.914±0.009 | 0.060±0.022 (— / 0.060±0.022) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.753±0.017 | 1.000±0.000 | 0.877±0.009 |  |
| heldout_formulations | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.026±0.036 (— / 0.026±0.036) |
| heldout_formulations | region | comparison: pooled midpoint | 0.641±0.036 | 1.000±0.000 | 0.821±0.018 |  |
| heldout_formulations | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | anchor | comparison: pooled midpoint | 0.929±0.058 | 1.000±0.000 | 0.964±0.029 |  |
| heldout_formulations | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.024±0.034 (— / 0.024±0.034) |
| heldout_formulations | fraction | comparison: pooled midpoint | 0.929±0.058 | 1.000±0.000 | 0.964±0.029 |  |
| heldout_formulations | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | amount | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | unit | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | direction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | layout | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | source | product: fitted | 0.690±0.084 | 1.000±0.000 | 0.845±0.042 | 0.690±0.191 (— / 0.690±0.191) |
| heldout_formulations | source | comparison: pooled midpoint | 0.655±0.084 | 1.000±0.000 | 0.828±0.042 |  |
| heldout_formulations | target | product: fitted | 0.987±0.018 | 1.000±0.000 | 0.994±0.009 | 0.104±0.017 (— / 0.104±0.017) |
| heldout_formulations | target | comparison: pooled midpoint | 0.885±0.000 | 1.000±0.000 | 0.942±0.000 |  |
| heldout_formulations | edge | product: fitted | 0.974±0.018 | 1.000±0.000 | 0.987±0.009 | 0.092±0.017 (— / 0.092±0.017) |
| heldout_formulations | edge | comparison: pooled midpoint | 0.885±0.000 | 1.000±0.000 | 0.942±0.000 |  |
| heldout_formulations | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.167±0.093 (— / 0.167±0.093) |
| heldout_formulations | quantity | comparison: pooled midpoint | 0.848±0.043 | 1.000±0.000 | 0.924±0.021 |  |
| heldout_formulations_en | object | product: fitted | 0.998±0.003 | 1.000±0.000 | 0.999±0.002 | 0.047±0.003 (— / 0.047±0.003) |
| heldout_formulations_en | object | comparison: pooled midpoint | 0.831±0.011 | 1.000±0.000 | 0.916±0.005 |  |
| heldout_formulations_en | color | product: fitted | — | 0.998±0.003 | — | 1.000 (1.000 / —) |
| heldout_formulations_en | color | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations_en | size | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.056±0.039 (— / 0.056±0.039) |
| heldout_formulations_en | size | comparison: pooled midpoint | 0.833±0.068 | 1.000±0.000 | 0.917±0.034 |  |
| heldout_formulations_en | style | product: fitted | 0.933±0.094 | 0.996±0.003 | 0.965±0.046 | 0.722±0.157 (1.000±0.000 / 0.700±0.141) |
| heldout_formulations_en | style | comparison: pooled midpoint | 0.467±0.094 | 1.000±0.000 | 0.733±0.047 |  |
| heldout_formulations_en | text | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | text | comparison: pooled midpoint | 0.859±0.018 | 1.000±0.000 | 0.930±0.009 |  |
| heldout_formulations_en | relation | product: fitted | 0.984±0.022 | 1.000±0.000 | 0.992±0.011 | 0.049±0.041 (— / 0.049±0.041) |
| heldout_formulations_en | relation | comparison: pooled midpoint | 0.838±0.047 | 1.000±0.000 | 0.919±0.024 |  |
| heldout_formulations_en | landmark | product: fitted | 0.968±0.022 | 1.000±0.000 | 0.984±0.011 | 0.394±0.082 (— / 0.394±0.082) |
| heldout_formulations_en | landmark | comparison: pooled midpoint | 0.823±0.019 | 1.000±0.000 | 0.912±0.010 |  |
| heldout_formulations_en | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | amount | comparison: pooled midpoint | 0.933±0.094 | 1.000±0.000 | 0.967±0.047 |  |
| heldout_formulations_en | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | unit | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | direction | product: fitted | 0.889±0.157 | 1.000±0.000 | 0.944±0.079 | 0.111±0.157 (— / 0.111±0.157) |
| heldout_formulations_en | direction | comparison: pooled midpoint | 0.667±0.000 | 1.000±0.000 | 0.833±0.000 |  |
| heldout_formulations_en | axis | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations_en | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations_en | layout | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations_en | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations_en | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.333±0.471 (— / 0.333±0.471) |
| heldout_formulations_en | pairing | comparison: pooled midpoint | 0.667±0.471 | 1.000±0.000 | 0.833±0.236 |  |
| heldout_formulations_en | source | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.867±0.072 (— / 0.867±0.072) |
| heldout_formulations_en | source | comparison: pooled midpoint | 0.933±0.000 | 1.000±0.000 | 0.967±0.000 |  |
| heldout_formulations_en | target | product: fitted | 0.989±0.016 | 1.000±0.000 | 0.994±0.008 | 0.592±0.094 (— / 0.592±0.094) |
| heldout_formulations_en | target | comparison: pooled midpoint | 0.943±0.016 | 1.000±0.000 | 0.971±0.008 |  |
| heldout_formulations_en | edge | product: fitted | 0.908±0.016 | 1.000±0.000 | 0.954±0.008 | 0.012±0.017 (— / 0.012±0.017) |
| heldout_formulations_en | edge | comparison: pooled midpoint | 0.897±0.000 | 1.000±0.000 | 0.948±0.000 |  |
| heldout_formulations_en | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.042±0.029 (— / 0.042±0.029) |
| heldout_formulations_en | quantity | comparison: pooled midpoint | 0.958±0.029 | 1.000±0.000 | 0.979±0.015 |  |
| heldout_sentences | object | product: fitted | 0.995±0.002 | 1.000±0.000 | 0.998±0.001 | 0.017±0.003 (— / 0.017±0.003) |
| heldout_sentences | object | comparison: pooled midpoint | 0.928±0.007 | 1.000±0.000 | 0.964±0.004 |  |
| heldout_sentences | color | product: fitted | 0.980±0.028 | 0.996±0.002 | 0.988±0.015 | 0.200±0.024 (1.000±0.000 / 0.119±0.047) |
| heldout_sentences | color | comparison: pooled midpoint | 0.647±0.000 | 1.000±0.000 | 0.824±0.000 |  |
| heldout_sentences | size | product: fitted | 0.899±0.014 | 0.998±0.000 | 0.948±0.007 | 0.044±0.016 (0.000±0.000 / 0.045±0.017) |
| heldout_sentences | size | comparison: pooled midpoint | 0.727±0.025 | 0.998±0.000 | 0.862±0.012 |  |
| heldout_sentences | style | product: fitted | 1.000±0.000 | 0.999±0.001 | 0.999±0.000 | 0.483±0.165 (1.000±0.000 / 0.417±0.118) |
| heldout_sentences | style | comparison: pooled midpoint | 0.583±0.118 | 0.999±0.001 | 0.791±0.059 |  |
| heldout_sentences | text | product: fitted | 0.990±0.007 | 0.999±0.001 | 0.995±0.003 | 0.019±0.006 (0.000 / 0.019±0.007) |
| heldout_sentences | text | comparison: pooled midpoint | 0.910±0.007 | 1.000±0.000 | 0.955±0.003 |  |
| heldout_sentences | relation | product: fitted | 0.958±0.033 | 1.000±0.000 | 0.979±0.016 | 0.049±0.026 (— / 0.049±0.026) |
| heldout_sentences | relation | comparison: pooled midpoint | 0.743±0.023 | 1.000±0.000 | 0.871±0.011 |  |
| heldout_sentences | landmark | product: fitted | 0.879±0.036 | 1.000±0.000 | 0.940±0.018 | 0.180±0.043 (— / 0.180±0.043) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.787±0.021 | 1.000±0.000 | 0.894±0.010 |  |
| heldout_sentences | region | product: fitted | 0.852±0.026 | 1.000±0.000 | 0.926±0.013 | 0.054±0.015 (— / 0.054±0.015) |
| heldout_sentences | region | comparison: pooled midpoint | 0.722±0.023 | 1.000±0.000 | 0.861±0.011 |  |
| heldout_sentences | anchor | product: fitted | 0.933±0.038 | 1.000±0.000 | 0.967±0.019 | 0.028±0.020 (— / 0.028±0.020) |
| heldout_sentences | anchor | comparison: pooled midpoint | 0.800±0.033 | 1.000±0.000 | 0.900±0.016 |  |
| heldout_sentences | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | fraction | comparison: pooled midpoint | 0.958±0.059 | 1.000±0.000 | 0.979±0.029 |  |
| heldout_sentences | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.024±0.019 (— / 0.024±0.019) |
| heldout_sentences | amount | comparison: pooled midpoint | 0.952±0.019 | 1.000±0.000 | 0.976±0.010 |  |
| heldout_sentences | unit | product: fitted | 0.968±0.011 | 1.000±0.000 | 0.984±0.006 | 0.058±0.032 (— / 0.058±0.032) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.952±0.000 | 1.000±0.000 | 0.976±0.000 |  |
| heldout_sentences | direction | product: fitted | 0.914±0.040 | 1.000±0.000 | 0.957±0.020 | 0.059±0.017 (— / 0.059±0.017) |
| heldout_sentences | direction | comparison: pooled midpoint | 0.796±0.015 | 1.000±0.000 | 0.898±0.008 |  |
| heldout_sentences | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | axis | comparison: pooled midpoint | 0.926±0.052 | 1.000±0.000 | 0.963±0.026 |  |
| heldout_sentences | layout | product: fitted | 0.987±0.019 | 1.000±0.000 | 0.993±0.009 | 0.054±0.018 (— / 0.054±0.018) |
| heldout_sentences | layout | comparison: pooled midpoint | 0.853±0.038 | 1.000±0.000 | 0.927±0.019 |  |
| heldout_sentences | pairing | product: fitted | 0.882±0.083 | 1.000±0.000 | 0.941±0.042 | 0.114±0.038 (— / 0.114±0.038) |
| heldout_sentences | pairing | comparison: pooled midpoint | 0.804±0.073 | 1.000±0.000 | 0.902±0.037 |  |
| heldout_sentences | source | product: fitted | 0.907±0.060 | 1.000±0.000 | 0.954±0.030 | 0.591±0.113 (— / 0.591±0.113) |
| heldout_sentences | source | comparison: pooled midpoint | 0.672±0.071 | 1.000±0.000 | 0.836±0.035 |  |
| heldout_sentences | target | product: fitted | 0.985±0.011 | 1.000±0.000 | 0.992±0.005 | 0.208±0.021 (— / 0.208±0.021) |
| heldout_sentences | target | comparison: pooled midpoint | 0.788±0.011 | 1.000±0.000 | 0.894±0.005 |  |
| heldout_sentences | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.011±0.015 (— / 0.011±0.015) |
| heldout_sentences | edge | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.111±0.079 (— / 0.111±0.079) |
| heldout_sentences | quantity | comparison: pooled midpoint | 0.944±0.079 | 1.000±0.000 | 0.972±0.039 |  |
| mixed | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.009±0.001 (— / 0.009±0.001) |
| mixed | object | comparison: pooled midpoint | 0.913±0.013 | 1.000±0.000 | 0.957±0.007 |  |
| mixed | color | product: fitted | 0.922±0.028 | 0.998±0.002 | 0.960±0.015 | 0.164±0.033 (1.000 / 0.125±0.088) |
| mixed | color | comparison: pooled midpoint | 0.706±0.000 | 1.000±0.000 | 0.853±0.000 |  |
| mixed | size | product: fitted | 0.857±0.000 | 1.000±0.000 | 0.929±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | size | comparison: pooled midpoint | 0.923±0.000 | 1.000±0.000 | 0.962±0.000 |  |
| mixed | style | product: fitted | 0.967±0.047 | 1.000±0.000 | 0.983±0.024 | 0.311±0.083 (— / 0.311±0.083) |
| mixed | style | comparison: pooled midpoint | 0.733±0.047 | 1.000±0.000 | 0.867±0.024 |  |
| mixed | text | product: fitted | 0.993±0.010 | 1.000±0.000 | 0.997±0.005 | 0.048±0.009 (— / 0.048±0.009) |
| mixed | text | comparison: pooled midpoint | 0.891±0.025 | 1.000±0.000 | 0.946±0.013 |  |
| mixed | relation | product: fitted | 0.892±0.033 | 1.000±0.000 | 0.946±0.017 | 0.050±0.013 (— / 0.050±0.013) |
| mixed | relation | comparison: pooled midpoint | 0.631±0.021 | 1.000±0.000 | 0.815±0.010 |  |
| mixed | landmark | product: fitted | 0.791±0.016 | 1.000±0.000 | 0.896±0.008 | 0.072±0.018 (— / 0.072±0.018) |
| mixed | landmark | comparison: pooled midpoint | 0.671±0.036 | 1.000±0.000 | 0.835±0.018 |  |
| mixed | region | product: fitted | 0.819±0.013 | 1.000±0.000 | 0.910±0.007 | 0.104±0.074 (— / 0.104±0.074) |
| mixed | region | comparison: pooled midpoint | 0.569±0.037 | 1.000±0.000 | 0.784±0.018 |  |
| mixed | anchor | product: fitted | 0.886±0.033 | 1.000±0.000 | 0.943±0.016 | 0.030±0.026 (— / 0.030±0.026) |
| mixed | anchor | comparison: pooled midpoint | 0.737±0.037 | 1.000±0.000 | 0.868±0.019 |  |
| mixed | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | fraction | comparison: pooled midpoint | 0.980±0.028 | 1.000±0.000 | 0.990±0.014 |  |
| mixed | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | amount | comparison: pooled midpoint | 0.989±0.015 | 1.000±0.000 | 0.995±0.008 |  |
| mixed | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.022±0.015 (— / 0.022±0.015) |
| mixed | unit | comparison: pooled midpoint | 0.989±0.015 | 1.000±0.000 | 0.995±0.008 |  |
| mixed | direction | product: fitted | 0.936±0.022 | 1.000±0.000 | 0.968±0.011 | 0.034±0.024 (— / 0.034±0.024) |
| mixed | direction | comparison: pooled midpoint | 0.883±0.024 | 1.000±0.000 | 0.942±0.012 |  |
| mixed | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.022±0.031 (— / 0.022±0.031) |
| mixed | axis | comparison: pooled midpoint | 0.933±0.000 | 1.000±0.000 | 0.967±0.000 |  |
| mixed | layout | product: fitted | 0.963±0.000 | 1.000±0.000 | 0.981±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | layout | comparison: pooled midpoint | 0.901±0.046 | 1.000±0.000 | 0.951±0.023 |  |
| mixed | pairing | product: fitted | 0.958±0.059 | 1.000±0.000 | 0.979±0.029 | 0.089±0.064 (— / 0.089±0.064) |
| mixed | pairing | comparison: pooled midpoint | 0.956±0.063 | 1.000±0.000 | 0.978±0.031 |  |
| mixed | source | product: fitted | 0.849±0.030 | 1.000±0.000 | 0.925±0.015 | 0.554±0.066 (— / 0.554±0.066) |
| mixed | source | comparison: pooled midpoint | 0.715±0.080 | 1.000±0.000 | 0.858±0.040 |  |
| mixed | target | product: fitted | 0.974±0.018 | 1.000±0.000 | 0.987±0.009 | 0.105±0.050 (— / 0.105±0.050) |
| mixed | target | comparison: pooled midpoint | 0.795±0.065 | 1.000±0.000 | 0.897±0.033 |  |
| mixed | edge | product: fitted | 0.961±0.028 | 1.000±0.000 | 0.980±0.014 | 0.123±0.003 (— / 0.123±0.003) |
| mixed | edge | comparison: pooled midpoint | 0.824±0.048 | 1.000±0.000 | 0.912±0.024 |  |
| mixed | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.111±0.157 (— / 0.111±0.157) |
| mixed | quantity | comparison: pooled midpoint | 0.889±0.157 | 1.000±0.000 | 0.944±0.079 |  |
| new_identities | object | product: fitted | 0.995±0.002 | 1.000±0.000 | 0.997±0.001 | 0.027±0.004 (— / 0.027±0.004) |
| new_identities | object | comparison: pooled midpoint | 0.942±0.002 | 1.000±0.000 | 0.971±0.001 |  |
| new_identities | color | product: fitted | 0.958±0.059 | 1.000±0.000 | 0.979±0.029 | 0.089±0.064 (— / 0.089±0.064) |
| new_identities | color | comparison: pooled midpoint | 0.500±0.000 | 1.000±0.000 | 0.750±0.000 |  |
| new_identities | size | product: fitted | 0.926±0.030 | 1.000±0.000 | 0.963±0.015 | 0.026±0.036 (— / 0.026±0.036) |
| new_identities | size | comparison: pooled midpoint | 0.923±0.000 | 1.000±0.000 | 0.962±0.000 |  |
| new_identities | style | product: fitted | 1.000±0.000 | 0.997±0.002 | 0.998±0.001 | 0.444±0.314 (1.000±0.000 / 0.000±0.000) |
| new_identities | style | comparison: pooled midpoint | 1.000±0.000 | 0.998±0.001 | 0.999±0.001 |  |
| new_identities | text | product: fitted | 0.944±0.017 | 0.997±0.004 | 0.970±0.009 | 0.046±0.009 (0.000 / 0.046±0.009) |
| new_identities | text | comparison: pooled midpoint | 0.800±0.015 | 0.992±0.002 | 0.896±0.007 |  |
| new_identities | relation | product: fitted | 0.955±0.039 | 1.000±0.000 | 0.977±0.019 | 0.080±0.021 (— / 0.080±0.021) |
| new_identities | relation | comparison: pooled midpoint | 0.723±0.032 | 1.000±0.000 | 0.861±0.016 |  |
| new_identities | landmark | product: fitted | 0.802±0.035 | 1.000±0.000 | 0.901±0.018 | 0.152±0.027 (— / 0.152±0.027) |
| new_identities | landmark | comparison: pooled midpoint | 0.606±0.033 | 1.000±0.000 | 0.803±0.016 |  |
| new_identities | region | product: fitted | 0.826±0.000 | 1.000±0.000 | 0.913±0.000 | 0.035±0.025 (— / 0.035±0.025) |
| new_identities | region | comparison: pooled midpoint | 0.478±0.000 | 1.000±0.000 | 0.739±0.000 |  |
| new_identities | anchor | product: fitted | 0.807±0.025 | 1.000±0.000 | 0.904±0.012 | 0.064±0.051 (— / 0.064±0.051) |
| new_identities | anchor | comparison: pooled midpoint | 0.648±0.069 | 1.000±0.000 | 0.824±0.035 |  |
| new_identities | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | amount | product: fitted | 0.993±0.005 | 1.000±0.000 | 0.996±0.003 | 0.004±0.005 (— / 0.004±0.005) |
| new_identities | amount | comparison: pooled midpoint | 0.989±0.000 | 1.000±0.000 | 0.994±0.000 |  |
| new_identities | unit | product: fitted | 0.993±0.005 | 1.000±0.000 | 0.996±0.003 | 0.004±0.005 (— / 0.004±0.005) |
| new_identities | unit | comparison: pooled midpoint | 0.993±0.005 | 1.000±0.000 | 0.996±0.003 |  |
| new_identities | direction | product: fitted | 0.971±0.020 | 1.000±0.000 | 0.986±0.010 | 0.059±0.020 (— / 0.059±0.020) |
| new_identities | direction | comparison: pooled midpoint | 0.913±0.000 | 1.000±0.000 | 0.957±0.000 |  |
| new_identities | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | source | product: fitted | 0.931±0.049 | 1.000±0.000 | 0.966±0.024 | 0.706±0.070 (— / 0.706±0.070) |
| new_identities | source | comparison: pooled midpoint | 0.667±0.043 | 1.000±0.000 | 0.833±0.022 |  |
| new_identities | target | product: fitted | 0.989±0.016 | 1.000±0.000 | 0.994±0.008 | 0.093±0.032 (— / 0.093±0.032) |
| new_identities | target | comparison: pooled midpoint | 0.713±0.043 | 1.000±0.000 | 0.856±0.022 |  |
| new_identities | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | edge | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | quantity | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | quantity | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | object | product: fitted | 0.997±0.002 | 1.000±0.000 | 0.999±0.001 | 0.052±0.001 (— / 0.052±0.001) |
| new_identities_en | object | comparison: pooled midpoint | 0.885±0.007 | 1.000±0.000 | 0.942±0.003 |  |
| new_identities_en | color | product: fitted | 0.889±0.079 | 0.997±0.001 | 0.943±0.039 | 0.389±0.079 (1.000±0.000 / 0.244±0.063) |
| new_identities_en | color | comparison: pooled midpoint | 0.389±0.079 | 1.000±0.000 | 0.694±0.039 |  |
| new_identities_en | size | product: fitted | 0.963±0.000 | 1.000±0.000 | 0.981±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities_en | size | comparison: pooled midpoint | 0.963±0.000 | 1.000±0.000 | 0.981±0.000 |  |
| new_identities_en | style | product: fitted | 1.000±0.000 | 0.998±0.001 | 0.999±0.001 | 0.467±0.047 (1.000±0.000 / 0.400±0.000) |
| new_identities_en | style | comparison: pooled midpoint | 0.467±0.094 | 1.000±0.000 | 0.733±0.047 |  |
| new_identities_en | text | product: fitted | 0.975±0.015 | 0.995±0.004 | 0.985±0.007 | 0.077±0.017 (0.750±0.250 / 0.074±0.018) |
| new_identities_en | text | comparison: pooled midpoint | 0.788±0.013 | 0.995±0.004 | 0.892±0.008 |  |
| new_identities_en | relation | product: fitted | 0.960±0.031 | 1.000±0.000 | 0.980±0.016 | 0.070±0.030 (— / 0.070±0.030) |
| new_identities_en | relation | comparison: pooled midpoint | 0.776±0.024 | 1.000±0.000 | 0.888±0.012 |  |
| new_identities_en | landmark | product: fitted | 0.881±0.034 | 1.000±0.000 | 0.940±0.017 | 0.406±0.047 (— / 0.406±0.047) |
| new_identities_en | landmark | comparison: pooled midpoint | 0.772±0.028 | 1.000±0.000 | 0.886±0.014 |  |
| new_identities_en | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities_en | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities_en | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities_en | anchor | comparison: pooled midpoint | 0.974±0.036 | 1.000±0.000 | 0.987±0.018 |  |
| new_identities_en | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities_en | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities_en | amount | product: fitted | 0.983±0.017 | 1.000±0.000 | 0.992±0.008 | 0.093±0.089 (— / 0.093±0.089) |
| new_identities_en | amount | comparison: pooled midpoint | 0.835±0.075 | 1.000±0.000 | 0.918±0.037 |  |
| new_identities_en | unit | product: fitted | 0.927±0.040 | 1.000±0.000 | 0.963±0.020 | 0.127±0.046 (— / 0.127±0.046) |
| new_identities_en | unit | comparison: pooled midpoint | 0.892±0.026 | 1.000±0.000 | 0.946±0.013 |  |
| new_identities_en | direction | product: fitted | 0.747±0.071 | 1.000±0.000 | 0.874±0.035 | 0.145±0.074 (— / 0.145±0.074) |
| new_identities_en | direction | comparison: pooled midpoint | 0.489±0.036 | 1.000±0.000 | 0.744±0.018 |  |
| new_identities_en | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities_en | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities_en | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities_en | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | source | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.839±0.091 (— / 0.839±0.091) |
| new_identities_en | source | comparison: pooled midpoint | 0.598±0.043 | 1.000±0.000 | 0.799±0.022 |  |
| new_identities_en | target | product: fitted | 0.989±0.016 | 1.000±0.000 | 0.994±0.008 | 0.686±0.077 (— / 0.686±0.077) |
| new_identities_en | target | comparison: pooled midpoint | 0.621±0.028 | 1.000±0.000 | 0.810±0.014 |  |
| new_identities_en | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities_en | edge | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities_en | quantity | product: fitted | — | 0.998±0.002 | — | 1.000 (1.000 / —) |
| new_identities_en | quantity | comparison: pooled midpoint | — | 0.999±0.001 | — |  |
| train (sample) | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.010±0.005 (— / 0.010±0.005) |
| train (sample) | color | product: fitted | 0.917±0.059 | 0.997±0.000 | 0.957±0.029 | 0.241±0.013 (1.000±0.000 / 0.137±0.008) |
| train (sample) | size | product: fitted | 0.852±0.026 | 1.000±0.000 | 0.926±0.013 | 0.086±0.027 (— / 0.086±0.027) |
| train (sample) | style | product: fitted | 1.000±0.000 | 0.997±0.000 | 0.998±0.000 | 0.200±0.000 (1.000±0.000 / 0.000±0.000) |
| train (sample) | text | product: fitted | 0.970±0.010 | 1.000±0.000 | 0.985±0.005 | 0.038±0.028 (— / 0.038±0.028) |
| train (sample) | relation | product: fitted | 0.914±0.023 | 1.000±0.000 | 0.957±0.012 | 0.093±0.025 (— / 0.093±0.025) |
| train (sample) | landmark | product: fitted | 0.829±0.023 | 1.000±0.000 | 0.914±0.012 | 0.150±0.020 (— / 0.150±0.020) |
| train (sample) | region | product: fitted | 0.950±0.041 | 1.000±0.000 | 0.975±0.020 | 0.034±0.024 (— / 0.034±0.024) |
| train (sample) | anchor | product: fitted | 0.897±0.096 | 1.000±0.000 | 0.949±0.048 | 0.051±0.073 (— / 0.051±0.073) |
| train (sample) | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.013±0.018 (— / 0.013±0.018) |
| train (sample) | direction | product: fitted | 0.908±0.081 | 1.000±0.000 | 0.954±0.041 | 0.089±0.044 (— / 0.089±0.044) |
| train (sample) | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.028±0.039 (— / 0.028±0.039) |
| train (sample) | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.143±0.117 (— / 0.143±0.117) |
| train (sample) | source | product: fitted | 0.925±0.040 | 1.000±0.000 | 0.962±0.020 | 0.446±0.091 (— / 0.446±0.091) |
| train (sample) | target | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.069±0.020 (— / 0.069±0.020) |
| train (sample) | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.042±0.059 (— / 0.042±0.059) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
