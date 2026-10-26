# REPORT — world `diagram_multi`, legend sha256:d361fbea318b… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
7000 annotated sentences from 6 files; provenance: {'generator': 7000}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/5000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 195 sentences
- calibration_heldout_formulations_en: 230 sentences
- heldout_formulations: 205 sentences
- heldout_formulations_en: 170 sentences
- heldout_sentences: 483 sentences
- mixed: 400 sentences
- new_identities: 400 sentences
- new_identities_en: 400 sentences
- train: 4517 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['250', '35', '45', '90', 'analytics', 'broker', 'crawler', 'dashboard', 'gamma_ray', 'indexer', 'ingest', 'irina', 'loyalty', 'notifications', 'payroll', 'recommendations', 'registry', 'returns', 'routing', 'theta', 'tracking', 'vault', 'victor', 'zeta']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
54116 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit ae48b78. Memory curve: runs/5000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 0.010 [rule: fit; pooled midpoint 0.524 (comparison)] (present 1.048, n 684 / absent 0.000, n 141)
- attr_presence:object: threshold 0.365 [rule: fit; pooled midpoint 0.525 (comparison)] (present 0.842, n 274 / absent 0.208, n 410)
- det_presence:object: threshold 0.713 [rule: fit; pooled midpoint 0.670 (comparison)] (present 1.202, n 225 / absent 0.137, n 459)
- presence:color: threshold 0.106 [rule: fit; pooled midpoint 0.344 (comparison)] (present 0.686, n 23 / absent 0.002, n 802)
- presence:size: threshold 0.120 [rule: fit; pooled midpoint 0.258 (comparison)] (present 0.508, n 68 / absent 0.009, n 757)
- presence:style: threshold 0.035 [rule: fit; pooled midpoint 0.077 (comparison)] (present 0.152, n 28 / absent 0.002, n 797)
- presence:text: threshold 0.074 [rule: fit; pooled midpoint 0.244 (comparison)] (present 0.468, n 95 / absent 0.019, n 730)
- presence:relation: threshold 0.116 [rule: fit; pooled midpoint 0.260 (comparison)] (present 0.502, n 99 / absent 0.018, n 726)
- presence:landmark: threshold 0.255 [rule: fit; pooled midpoint 0.344 (comparison)] (present 0.647, n 99 / absent 0.041, n 726)
- presence:region: threshold 0.202 [rule: fit; pooled midpoint 0.397 (comparison)] (present 0.767, n 58 / absent 0.028, n 767)
- presence:anchor: threshold 0.107 [rule: fit; pooled midpoint 0.363 (comparison)] (present 0.723, n 52 / absent 0.002, n 773)
- presence:fraction: threshold 0.132 [rule: fit; pooled midpoint 0.260 (comparison)] (present 0.516, n 40 / absent 0.004, n 785)
- presence:amount: threshold 0.199 [rule: fit; pooled midpoint 0.300 (comparison)] (present 0.603, n 55 / absent -0.003, n 770)
- presence:unit: threshold 0.267 [rule: fit; pooled midpoint 0.355 (comparison)] (present 0.677, n 55 / absent 0.033, n 770)
- presence:direction: threshold 0.124 [rule: fit; pooled midpoint 0.248 (comparison)] (present 0.492, n 33 / absent 0.004, n 792)
- presence:axis: threshold 0.162 [rule: fit; pooled midpoint 0.311 (comparison)] (present 0.622, n 13 / absent 0.001, n 812)
- presence:layout: threshold 0.106 [rule: fit; pooled midpoint 0.440 (comparison)] (present 0.879, n 24 / absent 0.000, n 801)
- presence:pairing: threshold 0.185 [rule: fit; pooled midpoint 0.275 (comparison)] (present 0.553, n 24 / absent -0.002, n 801)
- presence:source: threshold 0.073 [rule: fit; pooled midpoint 0.342 (comparison)] (present 0.684, n 117 / absent 0.000, n 708)
- presence:target: threshold 0.206 [rule: fit; pooled midpoint 0.381 (comparison)] (present 0.760, n 93 / absent 0.002, n 732)
- presence:edge: threshold 0.094 [rule: fit; pooled midpoint 0.307 (comparison)] (present 0.615, n 76 / absent -0.001, n 749)
- presence:quantity: threshold 0.066 [rule: fit; pooled midpoint 0.089 (comparison)] (present 0.174, n 44 / absent 0.004, n 781)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.005, color 0.083, size 0.143, style 0.200, text 0.013, relation 0.167, landmark 0.006, region 0.111, anchor 0.250, fraction 0.333, amount 0.043, unit 0.500, direction 0.167, axis 0.500, layout 0.143, pairing 0.500, source 0.006, target 0.006, edge 0.125, quantity 0.043, predicate 0.019

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 205 of 205)
| axis | accuracy |
|---|---|
| FULL | 0.800±0.008 |
| FULL [depth given] | 0.800±0.008 |
| FULL [depth and negation given] | 0.800±0.008 |
| FULL [presence not decided] | 0.833±0.006 |
| FULL [pooled midpoint (comparison)] | 0.673±0.017 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.020±0.006 |
| presence object: share of true 'present' readings that abstain | 0.020±0.006 |
| presence color: absent read absent | 0.993±0.002 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 1.000±0.000 |
| presence text: present read present | 0.949±0.048 |
| presence text: share of 'present' readings that abstain | 0.084±0.063 |
| presence text: share of true 'present' readings that abstain | 0.084±0.063 |
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
| role object | 0.930±0.002 |
| head object | 1.000±0.000 |
| lexical order head object | 0.180±0.000 |
| lexical bag head object | 0.122±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.949±0.010 |
| occupancy: known filler | 0.955±0.007 |
| role color | 0.993±0.002 |
| head color | 0.993±0.002 |
| lexical order head color | 0.995±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 1.000±0.000 |
| head size | 1.000±0.000 |
| lexical order head size | 0.927±0.000 |
| lexical bag head size | 0.927±0.000 |
| role style | 0.997±0.002 |
| head style | 0.997±0.002 |
| lexical order head style | 0.941±0.000 |
| lexical bag head style | 0.941±0.000 |
| role text | 0.993±0.006 |
| head text | 0.993±0.006 |
| lexical order head text | 0.873±0.000 |
| lexical bag head text | 0.883±0.000 |
| role relation | 0.980±0.011 |
| head relation | 0.980±0.011 |
| lexical order head relation | 0.859±0.000 |
| lexical bag head relation | 0.859±0.000 |
| role landmark | 0.946±0.008 |
| head landmark | 0.967±0.010 |
| lexical order head landmark | 0.859±0.000 |
| lexical bag head landmark | 0.844±0.000 |
| role region | 0.995±0.000 |
| head region | 0.995±0.000 |
| lexical order head region | 0.893±0.000 |
| lexical bag head region | 0.893±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.927±0.000 |
| lexical bag head anchor | 0.932±0.000 |
| role fraction | 0.998±0.002 |
| head fraction | 0.998±0.002 |
| lexical order head fraction | 0.927±0.000 |
| lexical bag head fraction | 0.932±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.971±0.000 |
| lexical bag head amount | 0.971±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.971±0.000 |
| lexical bag head unit | 0.971±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.990±0.000 |
| lexical bag head direction | 0.990±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.985±0.000 |
| lexical bag head axis | 0.985±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 0.976±0.000 |
| lexical bag head pairing | 0.976±0.000 |
| role source | 0.935±0.006 |
| head source | 0.971±0.007 |
| lexical order head source | 0.829±0.000 |
| lexical bag head source | 0.829±0.000 |
| role target | 0.979±0.002 |
| head target | 0.998±0.002 |
| lexical order head target | 0.854±0.000 |
| lexical bag head target | 0.854±0.000 |
| role edge | 0.990±0.000 |
| head edge | 0.998±0.002 |
| lexical order head edge | 0.854±0.000 |
| lexical bag head edge | 0.854±0.000 |
| role quantity | 0.998±0.002 |
| head quantity | 0.998±0.002 |
| lexical order head quantity | 0.927±0.000 |
| lexical bag head quantity | 0.927±0.000 |
| heads FULL (model) | 0.907±0.014 |
| heads FULL (lexical order baseline) | 0.010±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.034±0.000 |
| role object [presence not decided] | 0.930±0.002 |
| role color [presence not decided] | 0.985±0.000 |
| role size [presence not decided] | 1.000±0.000 |
| role style [presence not decided] | 1.000±0.000 |
| role text [presence not decided] | 1.000±0.000 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.969±0.002 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 1.000±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 1.000±0.000 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.933±0.008 |
| role target [presence not decided] | 0.977±0.002 |
| role edge [presence not decided] | 0.992±0.002 |
| role quantity [presence not decided] | 1.000±0.000 |
| heads FULL (model) [presence not decided] | 0.953±0.008 |
| role object [pooled midpoint (comparison)] | 0.875±0.012 |
| role color [pooled midpoint (comparison)] | 1.000±0.000 |
| role size [pooled midpoint (comparison)] | 1.000±0.000 |
| role style [pooled midpoint (comparison)] | 0.980±0.007 |
| role text [pooled midpoint (comparison)] | 0.976±0.011 |
| role relation [pooled midpoint (comparison)] | 0.946±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.933±0.002 |
| role region [pooled midpoint (comparison)] | 0.971±0.004 |
| role anchor [pooled midpoint (comparison)] | 0.998±0.002 |
| role fraction [pooled midpoint (comparison)] | 0.998±0.002 |
| role amount [pooled midpoint (comparison)] | 1.000±0.000 |
| role unit [pooled midpoint (comparison)] | 1.000±0.000 |
| role direction [pooled midpoint (comparison)] | 0.995±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 0.995±0.004 |
| role source [pooled midpoint (comparison)] | 0.930±0.006 |
| role target [pooled midpoint (comparison)] | 0.976±0.000 |
| role edge [pooled midpoint (comparison)] | 0.985±0.000 |
| role quantity [pooled midpoint (comparison)] | 0.997±0.002 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.756±0.017 |
| presence object: present read present [pooled midpoint (comparison)] | 0.915±0.012 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.808±0.083 |
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
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.000±0.000 |
| presence size: share of true 'present' readings that abstain | 0.000±0.000 |
| presence text: absent read absent | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: present read present | 0.944±0.039 |
| presence style: share of 'present' readings that abstain | 0.384±0.052 |
| presence style: share of true 'present' readings that abstain | 0.384±0.052 |
| presence style: present read present [pooled midpoint (comparison)] | 0.667±0.118 |
| presence region: present read present | 0.955±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 0.727±0.037 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.000±0.000 |
| presence amount: share of true 'present' readings that abstain | 0.000±0.000 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present | 0.862±0.074 |
| presence relation: share of 'present' readings that abstain | 0.075±0.059 |
| presence relation: share of true 'present' readings that abstain | 0.075±0.059 |
| presence landmark: present read present | 0.770±0.071 |
| presence landmark: share of 'present' readings that abstain | 0.074±0.017 |
| presence landmark: share of true 'present' readings that abstain | 0.074±0.017 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.621±0.028 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.667±0.016 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.829±0.040 |
| presence source: share of 'present' readings that abstain | 0.644±0.057 |
| presence source: share of true 'present' readings that abstain | 0.644±0.057 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.078±0.031 |
| presence target: share of true 'present' readings that abstain | 0.078±0.031 |
| presence edge: present read present | 0.989±0.016 |
| presence edge: share of 'present' readings that abstain | 0.034±0.001 |
| presence edge: share of true 'present' readings that abstain | 0.034±0.001 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.781±0.027 |
| presence target: present read present [pooled midpoint (comparison)] | 0.956±0.016 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.933±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 0.978±0.031 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.978±0.031 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.978±0.031 |
| presence quantity: present read present | 0.978±0.031 |
| presence quantity: share of 'present' readings that abstain | 0.067±0.054 |
| presence quantity: share of true 'present' readings that abstain | 0.067±0.054 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.956±0.031 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.556±0.079 |
| presence color: share of true 'present' readings that abstain | 0.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.133±0.094 |
| presence pairing: share of true 'present' readings that abstain | 0.133±0.094 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.800±0.163 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.167±0.236 |
| presence direction: share of true 'present' readings that abstain | 0.167±0.236 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.500±0.000 |

residual mean 0.072±0.007; status {'abstain': 44, 'ok': 161}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.412 / 0.297 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.917 | 0.304 / 0.153 | 0.99 | 0.077 | 0.006 / 0.006 |
| roles (pooled) | 0.884 | 0.205 / 0.037 | 0.88 | 0.050 | 0.058 / 0.067 |
| role text | 1.000 | 0.197 / 0.102 | 0.96 | 0.000 | 0.038 / 0.000 |
| role size | 1.000 | 0.193 / 0.152 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 1.000 | 0.113 / 0.026 | 0.67 | 0.000 | 0.333 / 0.000 |
| role region | 0.955 | 0.176 / 0.105 | 0.95 | 0.000 | 0.000 / 0.045 |
| role amount | 1.000 | 0.206 / 0.165 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.257 / 0.222 | 1.00 | 0.000 | 0.000 / 0.000 |
| role relation | 0.828 | 0.138 / 0.000 | 0.76 | 0.000 | 0.069 / 0.172 |
| role landmark | 0.552 | 0.103 / 0.000 | 0.66 | 0.138 | 0.034 / 0.310 |
| role source | 0.571 | 0.030 / 0.000 | 0.26 | 0.086 | 0.400 / 0.343 |
| role target | 0.867 | 0.109 / 0.054 | 0.90 | 0.067 | 0.033 / 0.067 |
| role edge | 0.933 | 0.187 / 0.150 | 0.97 | 0.033 | 0.000 / 0.033 |
| role anchor | 1.000 | 0.255 / 0.216 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.191 / 0.130 | 1.00 | 0.000 | 0.000 / 0.000 |
| role quantity | 1.000 | 0.115 / 0.048 | 0.87 | 0.000 | 0.133 / 0.000 |
| role color | 1.000 | 0.165 / 0.165 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.276 / 0.258 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 1.000 | 0.221 / 0.045 | 0.80 | 0.000 | 0.200 / 0.000 |
| role direction | 1.000 | 0.209 / 0.129 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_formulations_en — catalog candidates (n = 170 of 170)
| axis | accuracy |
|---|---|
| FULL | 0.849±0.006 |
| FULL [depth given] | 0.849±0.006 |
| FULL [depth and negation given] | 0.849±0.006 |
| FULL [presence not decided] | 0.853±0.010 |
| FULL [pooled midpoint (comparison)] | 0.663±0.015 |
| presence object: present read present | 0.998±0.004 |
| presence object: share of 'present' readings that abstain | 0.025±0.004 |
| presence object: share of true 'present' readings that abstain | 0.025±0.004 |
| presence color: absent read absent | 0.994±0.005 |
| presence size: absent read absent | 0.994±0.000 |
| presence style: absent read absent | 0.994±0.005 |
| presence text: absent read absent | 1.000±0.000 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
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
| role object | 0.973±0.007 |
| head object | 0.996±0.003 |
| lexical order head object | 0.212±0.000 |
| lexical bag head object | 0.741±0.000 |
| occupancy: known filler | 0.991±0.004 |
| role color | 0.994±0.005 |
| head color | 0.994±0.005 |
| lexical order head color | 0.988±0.000 |
| lexical bag head color | 0.982±0.000 |
| occupancy: not given | 0.999±0.000 |
| role size | 0.994±0.000 |
| head size | 0.994±0.000 |
| lexical order head size | 0.929±0.000 |
| lexical bag head size | 0.965±0.000 |
| role style | 0.988±0.000 |
| head style | 0.988±0.000 |
| lexical order head style | 0.965±0.000 |
| lexical bag head style | 0.965±0.000 |
| role text | 0.998±0.003 |
| head text | 0.998±0.003 |
| lexical order head text | 0.882±0.000 |
| lexical bag head text | 0.888±0.000 |
| role relation | 0.996±0.003 |
| head relation | 0.996±0.003 |
| lexical order head relation | 0.888±0.000 |
| lexical bag head relation | 0.888±0.000 |
| role landmark | 0.988±0.005 |
| head landmark | 0.994±0.005 |
| lexical order head landmark | 0.888±0.000 |
| lexical bag head landmark | 0.888±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.935±0.000 |
| lexical bag head region | 0.935±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 0.994±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.953±0.000 |
| lexical bag head fraction | 0.953±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.953±0.000 |
| lexical bag head amount | 0.953±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.953±0.000 |
| lexical bag head unit | 0.953±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.994±0.000 |
| lexical bag head direction | 0.994±0.000 |
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
| lexical order head pairing | 0.982±0.000 |
| lexical bag head pairing | 0.982±0.000 |
| role source | 0.943±0.003 |
| head source | 0.976±0.005 |
| lexical order head source | 0.794±0.000 |
| lexical bag head source | 0.794±0.000 |
| role target | 0.947±0.005 |
| head target | 0.976±0.005 |
| lexical order head target | 0.812±0.000 |
| lexical bag head target | 0.812±0.000 |
| role edge | 0.976±0.005 |
| head edge | 0.998±0.003 |
| lexical order head edge | 0.812±0.000 |
| lexical bag head edge | 0.812±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.876±0.000 |
| lexical bag head quantity | 0.876±0.000 |
| heads FULL (model) | 0.939±0.007 |
| heads FULL (lexical order baseline) | 0.006±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.253±0.000 |
| role object [presence not decided] | 0.975±0.007 |
| role color [presence not decided] | 0.988±0.000 |
| role size [presence not decided] | 0.994±0.000 |
| role style [presence not decided] | 0.988±0.000 |
| role text [presence not decided] | 1.000±0.000 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.992±0.003 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 1.000±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 1.000±0.000 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.943±0.003 |
| role target [presence not decided] | 0.947±0.005 |
| role edge [presence not decided] | 0.978±0.003 |
| role quantity [presence not decided] | 1.000±0.000 |
| heads FULL (model) [presence not decided] | 0.945±0.003 |
| role object [pooled midpoint (comparison)] | 0.829±0.005 |
| role color [pooled midpoint (comparison)] | 1.000±0.000 |
| role size [pooled midpoint (comparison)] | 0.990±0.007 |
| role style [pooled midpoint (comparison)] | 0.971±0.000 |
| role text [pooled midpoint (comparison)] | 0.980±0.003 |
| role relation [pooled midpoint (comparison)] | 0.978±0.006 |
| role landmark [pooled midpoint (comparison)] | 0.965±0.005 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 1.000±0.000 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.996±0.003 |
| role unit [pooled midpoint (comparison)] | 1.000±0.000 |
| role direction [pooled midpoint (comparison)] | 0.994±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 0.996±0.003 |
| role source [pooled midpoint (comparison)] | 0.943±0.003 |
| role target [pooled midpoint (comparison)] | 0.945±0.003 |
| role edge [pooled midpoint (comparison)] | 0.965±0.005 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.729±0.022 |
| presence object: present read present [pooled midpoint (comparison)] | 0.820±0.013 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.996±0.003 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
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
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.128±0.036 |
| presence size: share of true 'present' readings that abstain | 0.056±0.039 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.861±0.104 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.042±0.059 |
| presence amount: share of true 'present' readings that abstain | 0.042±0.059 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.917±0.059 |
| presence unit: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present | 0.965±0.025 |
| presence relation: share of 'present' readings that abstain | 0.055±0.045 |
| presence relation: share of true 'present' readings that abstain | 0.055±0.045 |
| presence landmark: present read present | 0.965±0.025 |
| presence landmark: share of 'present' readings that abstain | 0.366±0.110 |
| presence landmark: share of true 'present' readings that abstain | 0.366±0.110 |
| determiner identity (outside FULL when the legend excludes it) | 0.956±0.006 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.823±0.064 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.769±0.045 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.278±0.208 |
| presence color: share of true 'present' readings that abstain | 0.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: present read present | 0.833±0.136 |
| presence style: present read present [pooled midpoint (comparison)] | 0.167±0.000 |
| presence text: present read present | 0.983±0.024 |
| presence text: share of 'present' readings that abstain | 0.034±0.024 |
| presence text: share of true 'present' readings that abstain | 0.034±0.024 |
| presence text: present read present [pooled midpoint (comparison)] | 0.882±0.022 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.743±0.070 |
| presence source: share of true 'present' readings that abstain | 0.743±0.070 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.542±0.053 |
| presence target: share of true 'present' readings that abstain | 0.542±0.053 |
| presence edge: present read present | 0.990±0.015 |
| presence edge: share of 'present' readings that abstain | 0.074±0.041 |
| presence edge: share of true 'present' readings that abstain | 0.074±0.041 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.943±0.000 |
| presence target: present read present [pooled midpoint (comparison)] | 0.990±0.015 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.927±0.015 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.000±0.000 |
| presence quantity: share of true 'present' readings that abstain | 0.000±0.000 |
| presence quantity: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.861±0.104 |
| presence style: share of true 'present' readings that abstain | 0.822±0.137 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.222±0.157 |
| presence pairing: share of true 'present' readings that abstain | 0.222±0.157 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.778±0.157 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.333±0.471 |
| presence direction: share of true 'present' readings that abstain | 0.333±0.471 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.000±0.000 |
| presence size: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.033±0.004; status {'ok': 119, 'abstain': 51}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.406 / 0.314 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.963 | 0.280 / 0.103 | 0.96 | 0.022 | 0.022 / 0.015 |
| roles (pooled) | 0.910 | 0.179 / 0.017 | 0.81 | 0.037 | 0.135 / 0.053 |
| role anchor | 1.000 | 0.224 / 0.209 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.161 / 0.140 | 1.00 | 0.000 | 0.000 / 0.000 |
| role size | 1.000 | 0.157 / 0.121 | 0.92 | 0.000 | 0.083 / 0.000 |
| role amount | 1.000 | 0.195 / 0.112 | 0.88 | 0.000 | 0.125 / 0.000 |
| role unit | 1.000 | 0.172 / 0.135 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.249 / 0.208 | 1.00 | 0.000 | 0.000 / 0.000 |
| role relation | 0.947 | 0.163 / 0.041 | 0.84 | 0.000 | 0.105 / 0.053 |
| role landmark | 0.895 | 0.068 / 0.007 | 0.53 | 0.053 | 0.421 / 0.053 |
| role color | 1.000 | 0.183 / 0.182 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.667 | 0.019 / 0.000 | 0.00 | 0.000 | 0.667 / 0.333 |
| role text | 1.000 | 0.215 / 0.139 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.714 | 0.023 / 0.001 | 0.17 | 0.114 | 0.657 / 0.171 |
| role target | 0.688 | 0.051 / 0.007 | 0.53 | 0.062 | 0.219 / 0.250 |
| role edge | 0.875 | 0.139 / 0.067 | 0.94 | 0.125 | 0.062 / 0.000 |
| role quantity | 1.000 | 0.137 / 0.074 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 1.000 | 0.178 / 0.087 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.106 / 0.106 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_sentences — catalog candidates (n = 483 of 483)
| axis | accuracy |
|---|---|
| FULL | 0.838±0.014 |
| FULL [depth given] | 0.838±0.014 |
| FULL [depth and negation given] | 0.838±0.014 |
| FULL [pooled midpoint (comparison)] | 0.689±0.012 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.016±0.003 |
| presence object: share of true 'present' readings that abstain | 0.016±0.003 |
| presence color: absent read absent | 1.000±0.000 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 0.999±0.001 |
| presence text: absent read absent | 0.998±0.002 |
| presence relation: present read present | 0.941±0.021 |
| presence relation: share of 'present' readings that abstain | 0.099±0.027 |
| presence relation: share of true 'present' readings that abstain | 0.099±0.027 |
| presence landmark: present read present | 0.799±0.070 |
| presence landmark: share of 'present' readings that abstain | 0.133±0.049 |
| presence landmark: share of true 'present' readings that abstain | 0.133±0.049 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.963±0.013 |
| presence amount: share of 'present' readings that abstain | 0.010±0.013 |
| presence amount: share of true 'present' readings that abstain | 0.010±0.013 |
| presence unit: present read present | 0.991±0.013 |
| presence unit: share of 'present' readings that abstain | 0.047±0.013 |
| presence unit: share of true 'present' readings that abstain | 0.047±0.013 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 1.000±0.000 |
| presence target: absent read absent | 0.999±0.001 |
| presence edge: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 1.000±0.000 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 1.000±0.000 |
| event type (synonym table) | 1.000±0.000 |
| role object | 0.950±0.003 |
| head object | 0.997±0.001 |
| lexical order head object | 0.139±0.000 |
| lexical bag head object | 0.482±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.913±0.000 |
| occupancy: known filler | 0.966±0.006 |
| role color | 0.993±0.003 |
| head color | 0.993±0.003 |
| lexical order head color | 0.948±0.000 |
| lexical bag head color | 0.954±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.994±0.002 |
| head size | 0.994±0.002 |
| lexical order head size | 0.928±0.000 |
| lexical bag head size | 0.952±0.000 |
| role style | 0.999±0.001 |
| head style | 0.999±0.001 |
| lexical order head style | 0.994±0.000 |
| lexical bag head style | 0.996±0.000 |
| role text | 0.995±0.001 |
| head text | 0.995±0.001 |
| lexical order head text | 0.867±0.000 |
| lexical bag head text | 0.896±0.000 |
| role relation | 0.992±0.003 |
| head relation | 0.992±0.003 |
| lexical order head relation | 0.859±0.000 |
| lexical bag head relation | 0.886±0.000 |
| role landmark | 0.950±0.009 |
| head landmark | 0.970±0.010 |
| lexical order head landmark | 0.859±0.000 |
| lexical bag head landmark | 0.867±0.000 |
| role region | 0.994±0.003 |
| head region | 0.994±0.003 |
| lexical order head region | 0.909±0.000 |
| lexical bag head region | 0.913±0.000 |
| role anchor | 0.999±0.002 |
| head anchor | 0.999±0.002 |
| lexical order head anchor | 0.948±0.000 |
| lexical bag head anchor | 0.961±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.988±0.000 |
| lexical bag head fraction | 0.990±0.000 |
| role amount | 0.997±0.001 |
| head amount | 0.997±0.001 |
| lexical order head amount | 0.925±0.000 |
| lexical bag head amount | 0.934±0.000 |
| role unit | 0.999±0.001 |
| head unit | 0.999±0.001 |
| lexical order head unit | 0.925±0.000 |
| lexical bag head unit | 0.932±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.944±0.000 |
| lexical bag head direction | 0.954±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.969±0.000 |
| lexical bag head axis | 0.975±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.948±0.000 |
| lexical bag head layout | 0.950±0.000 |
| role pairing | 0.997±0.002 |
| head pairing | 0.997±0.002 |
| lexical order head pairing | 0.959±0.000 |
| lexical bag head pairing | 0.961±0.000 |
| role source | 0.950±0.003 |
| head source | 0.992±0.004 |
| lexical order head source | 0.890±0.000 |
| lexical bag head source | 0.907±0.000 |
| role target | 0.989±0.003 |
| head target | 0.995±0.003 |
| lexical order head target | 0.932±0.000 |
| lexical bag head target | 0.934±0.000 |
| role edge | 0.997±0.001 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.954±0.000 |
| lexical bag head edge | 0.963±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.969±0.000 |
| lexical bag head quantity | 0.975±0.000 |
| heads FULL (model) | 0.932±0.011 |
| heads FULL (lexical order baseline) | 0.012±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.203±0.000 |
| role object [pooled midpoint (comparison)] | 0.881±0.005 |
| role color [pooled midpoint (comparison)] | 0.974±0.002 |
| role size [pooled midpoint (comparison)] | 0.987±0.001 |
| role style [pooled midpoint (comparison)] | 1.000±0.000 |
| role text [pooled midpoint (comparison)] | 0.985±0.002 |
| role relation [pooled midpoint (comparison)] | 0.963±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.934±0.002 |
| role region [pooled midpoint (comparison)] | 0.974±0.001 |
| role anchor [pooled midpoint (comparison)] | 0.994±0.000 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.996±0.002 |
| role unit [pooled midpoint (comparison)] | 0.994±0.000 |
| role direction [pooled midpoint (comparison)] | 0.996±0.002 |
| role axis [pooled midpoint (comparison)] | 0.999±0.001 |
| role layout [pooled midpoint (comparison)] | 0.996±0.002 |
| role pairing [pooled midpoint (comparison)] | 0.991±0.004 |
| role source [pooled midpoint (comparison)] | 0.939±0.001 |
| role target [pooled midpoint (comparison)] | 0.979±0.005 |
| role edge [pooled midpoint (comparison)] | 0.997±0.001 |
| role quantity [pooled midpoint (comparison)] | 0.999±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.758±0.012 |
| presence object: present read present [pooled midpoint (comparison)] | 0.936±0.008 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.767±0.030 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.711±0.021 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.944±0.023 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.917±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence edge: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: present read present | 0.924±0.027 |
| presence size: share of 'present' readings that abstain | 0.092±0.023 |
| presence size: share of true 'present' readings that abstain | 0.092±0.023 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.819±0.013 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: present read present | 0.867±0.050 |
| presence color: share of 'present' readings that abstain | 0.150±0.072 |
| presence color: share of true 'present' readings that abstain | 0.150±0.072 |
| presence color: present read present [pooled midpoint (comparison)] | 0.514±0.039 |
| presence text: present read present | 0.979±0.015 |
| presence text: share of 'present' readings that abstain | 0.037±0.020 |
| presence text: share of true 'present' readings that abstain | 0.037±0.020 |
| presence text: present read present [pooled midpoint (comparison)] | 0.885±0.015 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.956±0.024 |
| presence source: share of 'present' readings that abstain | 0.555±0.078 |
| presence source: share of true 'present' readings that abstain | 0.555±0.078 |
| presence target: present read present | 0.970±0.000 |
| presence target: share of 'present' readings that abstain | 0.185±0.023 |
| presence target: share of true 'present' readings that abstain | 0.177±0.015 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.704±0.039 |
| presence target: present read present [pooled midpoint (comparison)] | 0.818±0.043 |
| presence edge: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 0.932±0.037 |
| presence region: share of 'present' readings that abstain | 0.081±0.009 |
| presence region: share of true 'present' readings that abstain | 0.081±0.009 |
| presence region: present read present [pooled midpoint (comparison)] | 0.720±0.011 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.926±0.030 |
| presence pairing: present read present | 0.933±0.047 |
| presence pairing: share of 'present' readings that abstain | 0.085±0.084 |
| presence pairing: share of true 'present' readings that abstain | 0.085±0.084 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.783±0.085 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.956±0.031 |
| presence anchor: present read present | 0.973±0.038 |
| presence anchor: share of 'present' readings that abstain | 0.028±0.020 |
| presence anchor: share of true 'present' readings that abstain | 0.028±0.020 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.917±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.027±0.019 |
| presence layout: share of true 'present' readings that abstain | 0.027±0.019 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.920±0.033 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.000±0.000 |
| presence quantity: share of true 'present' readings that abstain | 0.000±0.000 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.978±0.031 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.250±0.204 |
| presence style: share of true 'present' readings that abstain | 0.111±0.157 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence text: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.066±0.004; status {'ok': 394, 'abstain': 89}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.418 / 0.312 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.938 | 0.301 / 0.153 | 0.98 | 0.058 | 0.014 / 0.005 |
| roles (pooled) | 0.900 | 0.218 / 0.044 | 0.89 | 0.044 | 0.056 / 0.056 |
| role relation | 0.956 | 0.156 / 0.018 | 0.84 | 0.000 | 0.118 / 0.044 |
| role landmark | 0.603 | 0.087 / 0.000 | 0.65 | 0.118 | 0.074 / 0.279 |
| role amount | 0.944 | 0.177 / 0.108 | 0.94 | 0.000 | 0.000 / 0.056 |
| role unit | 1.000 | 0.205 / 0.091 | 0.97 | 0.000 | 0.028 / 0.000 |
| role size | 0.886 | 0.151 / 0.011 | 0.83 | 0.000 | 0.057 / 0.114 |
| role color | 0.800 | 0.120 / 0.000 | 0.76 | 0.000 | 0.040 / 0.200 |
| role text | 1.000 | 0.218 / 0.158 | 0.97 | 0.000 | 0.031 / 0.000 |
| role source | 0.509 | 0.037 / 0.000 | 0.32 | 0.208 | 0.396 / 0.283 |
| role target | 0.818 | 0.096 / 0.019 | 0.79 | 0.030 | 0.061 / 0.152 |
| role edge | 0.909 | 0.190 / 0.119 | 1.00 | 0.091 | 0.000 / 0.000 |
| role region | 0.977 | 0.192 / 0.057 | 0.89 | 0.000 | 0.091 / 0.023 |
| role direction | 1.000 | 0.242 / 0.146 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 1.000 | 0.200 / 0.048 | 0.80 | 0.000 | 0.200 / 0.000 |
| role axis | 1.000 | 0.290 / 0.197 | 1.00 | 0.000 | 0.000 / 0.000 |
| role anchor | 0.920 | 0.220 / 0.061 | 0.88 | 0.000 | 0.040 / 0.080 |
| role fraction | 1.000 | 0.226 / 0.185 | 1.00 | 0.000 | 0.000 / 0.000 |
| role layout | 1.000 | 0.253 / 0.200 | 0.96 | 0.000 | 0.040 / 0.000 |
| role quantity | 1.000 | 0.135 / 0.079 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 1.000 | 0.104 / 0.057 | 1.00 | 0.000 | 0.000 / 0.000 |

### mixed — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.827±0.009 |
| FULL [depth given] | 0.827±0.009 |
| FULL [depth and negation given] | 0.827±0.009 |
| FULL [pooled midpoint (comparison)] | 0.628±0.007 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.015±0.006 |
| presence object: share of true 'present' readings that abstain | 0.015±0.006 |
| presence color: absent read absent | 0.998±0.002 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 0.999±0.001 |
| presence text: absent read absent | 0.999±0.001 |
| presence relation: present read present | 0.819±0.045 |
| presence relation: share of 'present' readings that abstain | 0.069±0.041 |
| presence relation: share of true 'present' readings that abstain | 0.069±0.041 |
| presence landmark: present read present | 0.710±0.067 |
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
| role object | 0.949±0.001 |
| head object | 1.000±0.000 |
| lexical order head object | 0.130±0.000 |
| lexical bag head object | 0.335±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.895±0.005 |
| occupancy: known filler | 0.955±0.003 |
| role color | 0.995±0.002 |
| head color | 0.995±0.002 |
| lexical order head color | 0.955±0.000 |
| lexical bag head color | 0.960±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.999±0.001 |
| head size | 0.999±0.001 |
| lexical order head size | 0.965±0.000 |
| lexical bag head size | 0.978±0.000 |
| role style | 0.998±0.001 |
| head style | 0.998±0.001 |
| lexical order head style | 0.980±0.000 |
| lexical bag head style | 0.983±0.000 |
| role text | 0.991±0.001 |
| head text | 0.991±0.001 |
| lexical order head text | 0.880±0.000 |
| lexical bag head text | 0.895±0.000 |
| role relation | 0.979±0.005 |
| head relation | 0.979±0.005 |
| lexical order head relation | 0.885±0.000 |
| lexical bag head relation | 0.897±0.000 |
| role landmark | 0.953±0.007 |
| head landmark | 0.967±0.008 |
| lexical order head landmark | 0.885±0.000 |
| lexical bag head landmark | 0.890±0.000 |
| role region | 0.988±0.001 |
| head region | 0.988±0.001 |
| lexical order head region | 0.905±0.000 |
| lexical bag head region | 0.912±0.000 |
| role anchor | 0.996±0.004 |
| head anchor | 0.996±0.004 |
| lexical order head anchor | 0.902±0.000 |
| lexical bag head anchor | 0.920±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.948±0.000 |
| lexical bag head fraction | 0.948±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.932±0.000 |
| lexical bag head amount | 0.948±0.000 |
| role unit | 0.999±0.001 |
| head unit | 0.999±0.001 |
| lexical order head unit | 0.932±0.000 |
| lexical bag head unit | 0.945±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.938±0.000 |
| lexical bag head direction | 0.940±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.958±0.000 |
| lexical bag head axis | 0.958±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.945±0.000 |
| lexical bag head layout | 0.945±0.000 |
| role pairing | 0.996±0.003 |
| head pairing | 0.996±0.003 |
| lexical order head pairing | 0.960±0.000 |
| lexical bag head pairing | 0.963±0.000 |
| role source | 0.947±0.003 |
| head source | 0.990±0.004 |
| lexical order head source | 0.890±0.000 |
| lexical bag head source | 0.895±0.000 |
| role target | 0.988±0.001 |
| head target | 0.998±0.001 |
| lexical order head target | 0.930±0.000 |
| lexical bag head target | 0.940±0.000 |
| role edge | 0.993±0.002 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.948±0.000 |
| lexical bag head edge | 0.950±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.980±0.000 |
| lexical bag head quantity | 0.990±0.000 |
| heads FULL (model) | 0.917±0.009 |
| heads FULL (lexical order baseline) | 0.018±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.102±0.000 |
| role object [pooled midpoint (comparison)] | 0.844±0.014 |
| role color [pooled midpoint (comparison)] | 0.987±0.001 |
| role size [pooled midpoint (comparison)] | 0.996±0.001 |
| role style [pooled midpoint (comparison)] | 0.997±0.001 |
| role text [pooled midpoint (comparison)] | 0.978±0.005 |
| role relation [pooled midpoint (comparison)] | 0.950±0.002 |
| role landmark [pooled midpoint (comparison)] | 0.944±0.005 |
| role region [pooled midpoint (comparison)] | 0.962±0.002 |
| role anchor [pooled midpoint (comparison)] | 0.973±0.002 |
| role fraction [pooled midpoint (comparison)] | 0.999±0.001 |
| role amount [pooled midpoint (comparison)] | 0.998±0.001 |
| role unit [pooled midpoint (comparison)] | 0.998±0.001 |
| role direction [pooled midpoint (comparison)] | 0.991±0.002 |
| role axis [pooled midpoint (comparison)] | 0.997±0.001 |
| role layout [pooled midpoint (comparison)] | 0.993±0.003 |
| role pairing [pooled midpoint (comparison)] | 0.988±0.004 |
| role source [pooled midpoint (comparison)] | 0.934±0.007 |
| role target [pooled midpoint (comparison)] | 0.978±0.001 |
| role edge [pooled midpoint (comparison)] | 0.988±0.001 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.699±0.009 |
| presence object: present read present [pooled midpoint (comparison)] | 0.900±0.017 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.582±0.013 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.612±0.032 |
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
| presence region: present read present | 0.877±0.012 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 0.622±0.022 |
| presence anchor: present read present | 0.957±0.044 |
| presence anchor: share of 'present' readings that abstain | 0.071±0.010 |
| presence anchor: share of true 'present' readings that abstain | 0.071±0.010 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.718±0.021 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.879±0.057 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.037±0.000 |
| presence amount: share of true 'present' readings that abstain | 0.037±0.000 |
| presence unit: present read present | 0.988±0.017 |
| presence unit: share of 'present' readings that abstain | 0.012±0.017 |
| presence unit: share of true 'present' readings that abstain | 0.012±0.017 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.975±0.017 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.975±0.017 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.917±0.028 |
| presence source: share of 'present' readings that abstain | 0.530±0.088 |
| presence source: share of true 'present' readings that abstain | 0.530±0.088 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.143±0.029 |
| presence target: share of true 'present' readings that abstain | 0.143±0.029 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.095±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.095±0.000 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.785±0.060 |
| presence target: present read present [pooled midpoint (comparison)] | 0.857±0.029 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.905±0.000 |
| presence text: share of 'present' readings that abstain | 0.082±0.039 |
| presence text: share of FALSE 'present' readings that abstain | nan±nan |
| presence size: present read present | 0.976±0.034 |
| presence size: share of 'present' readings that abstain | 0.024±0.034 |
| presence size: share of true 'present' readings that abstain | 0.024±0.034 |
| presence size: present read present [pooled midpoint (comparison)] | 0.949±0.036 |
| presence region: share of 'present' readings that abstain | 0.110±0.029 |
| presence region: share of true 'present' readings that abstain | 0.110±0.029 |
| presence text: present read present | 0.931±0.020 |
| presence text: present read present [pooled midpoint (comparison)] | 0.819±0.054 |
| presence text: share of true 'present' readings that abstain | 0.075±0.043 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.984±0.022 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.922±0.028 |
| presence landmark: share of 'present' readings that abstain | 0.071±0.007 |
| presence landmark: share of true 'present' readings that abstain | 0.071±0.007 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.000±0.000 |
| presence quantity: share of true 'present' readings that abstain | 0.000±0.000 |
| presence quantity: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.080±0.033 |
| presence direction: share of true 'present' readings that abstain | 0.080±0.033 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.853±0.038 |
| presence pairing: present read present | 0.896±0.078 |
| presence pairing: share of 'present' readings that abstain | 0.086±0.077 |
| presence pairing: share of true 'present' readings that abstain | 0.086±0.077 |
| presence style: present read present | 0.958±0.059 |
| presence style: share of 'present' readings that abstain | 0.333±0.147 |
| presence style: share of true 'present' readings that abstain | 0.310±0.132 |
| presence style: present read present [pooled midpoint (comparison)] | 0.833±0.059 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.917±0.118 |
| presence color: present read present | 0.926±0.026 |
| presence color: share of 'present' readings that abstain | 0.074±0.053 |
| presence color: share of true 'present' readings that abstain | 0.039±0.055 |
| presence color: present read present [pooled midpoint (comparison)] | 0.704±0.026 |

residual mean 0.084±0.003; status {'ok': 338, 'abstain': 62}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.422 / 0.331 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.940 | 0.311 / 0.159 | 0.99 | 0.060 | 0.009 / 0.000 |
| roles (pooled) | 0.889 | 0.222 / 0.041 | 0.89 | 0.046 | 0.049 / 0.065 |
| role relation | 0.870 | 0.120 / 0.000 | 0.76 | 0.000 | 0.109 / 0.130 |
| role landmark | 0.522 | 0.099 / 0.000 | 0.61 | 0.109 | 0.022 / 0.370 |
| role region | 0.895 | 0.167 / 0.011 | 0.82 | 0.000 | 0.079 / 0.105 |
| role anchor | 0.897 | 0.189 / 0.032 | 0.85 | 0.000 | 0.051 / 0.103 |
| role layout | 1.000 | 0.242 / 0.153 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 1.000 | 0.198 / 0.148 | 0.96 | 0.000 | 0.037 / 0.000 |
| role unit | 0.963 | 0.251 / 0.190 | 0.96 | 0.000 | 0.000 / 0.037 |
| role source | 0.477 | 0.036 / 0.000 | 0.32 | 0.182 | 0.341 / 0.341 |
| role target | 0.821 | 0.118 / 0.043 | 0.82 | 0.107 | 0.107 / 0.071 |
| role edge | 0.810 | 0.185 / 0.063 | 0.90 | 0.143 | 0.048 / 0.048 |
| role size | 1.000 | 0.193 / 0.104 | 0.93 | 0.000 | 0.071 / 0.000 |
| role text | 0.958 | 0.193 / 0.094 | 0.92 | 0.000 | 0.042 / 0.042 |
| role fraction | 1.000 | 0.196 / 0.144 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.247 / 0.146 | 1.00 | 0.000 | 0.000 / 0.000 |
| role quantity | 1.000 | 0.140 / 0.093 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.195 / 0.070 | 0.88 | 0.000 | 0.120 / 0.000 |
| role pairing | 0.875 | 0.203 / 0.025 | 0.81 | 0.000 | 0.062 / 0.125 |
| role style | 1.000 | 0.104 / 0.044 | 0.88 | 0.000 | 0.125 / 0.000 |
| role color | 0.889 | 0.158 / 0.045 | 0.89 | 0.000 | 0.000 / 0.111 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.852±0.013 |
| FULL [depth given] | 0.852±0.013 |
| FULL [depth and negation given] | 0.852±0.013 |
| FULL [pooled midpoint (comparison)] | 0.694±0.008 |
| presence object: present read present | 0.996±0.001 |
| presence object: share of 'present' readings that abstain | 0.024±0.003 |
| presence object: share of true 'present' readings that abstain | 0.024±0.003 |
| presence color: absent read absent | 0.998±0.001 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 0.999±0.001 |
| presence text: absent read absent | 0.998±0.002 |
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
| role object | 0.963±0.005 |
| head object | 0.989±0.001 |
| lexical order head object | 0.092±0.000 |
| lexical bag head object | 0.282±0.000 |
| occupancy: unknown filler | 0.943±0.013 |
| role color | 0.997±0.001 |
| head color | 0.997±0.001 |
| lexical order head color | 0.983±0.000 |
| lexical bag head color | 0.983±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.996±0.003 |
| head size | 0.996±0.003 |
| lexical order head size | 0.948±0.000 |
| lexical bag head size | 0.973±0.000 |
| role style | 0.999±0.001 |
| head style | 0.999±0.001 |
| lexical order head style | 0.990±0.000 |
| lexical bag head style | 0.990±0.000 |
| role text | 0.960±0.015 |
| head text | 0.960±0.015 |
| lexical order head text | 0.550±0.000 |
| lexical bag head text | 0.623±0.000 |
| role relation | 0.984±0.004 |
| head relation | 0.984±0.004 |
| lexical order head relation | 0.750±0.000 |
| lexical bag head relation | 0.752±0.000 |
| role landmark | 0.950±0.005 |
| head landmark | 0.976±0.007 |
| lexical order head landmark | 0.750±0.000 |
| lexical bag head landmark | 0.750±0.000 |
| role region | 0.999±0.001 |
| head region | 0.999±0.001 |
| lexical order head region | 0.953±0.000 |
| lexical bag head region | 0.953±0.000 |
| role anchor | 0.993±0.002 |
| head anchor | 0.993±0.002 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 0.963±0.000 |
| role fraction | 0.998±0.001 |
| head fraction | 0.998±0.001 |
| lexical order head fraction | 0.978±0.000 |
| lexical bag head fraction | 0.980±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.802±0.000 |
| lexical bag head amount | 0.838±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.802±0.000 |
| lexical bag head unit | 0.830±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.945±0.000 |
| lexical bag head direction | 0.945±0.000 |
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
| role source | 0.983±0.002 |
| head source | 0.995±0.004 |
| lexical order head source | 0.908±0.000 |
| lexical bag head source | 0.910±0.000 |
| role target | 0.993±0.002 |
| head target | 0.996±0.002 |
| lexical order head target | 0.908±0.000 |
| lexical bag head target | 0.920±0.000 |
| role edge | 0.993±0.000 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.943±0.000 |
| lexical bag head edge | 0.943±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.901±0.019 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.077±0.000 |
| role object [pooled midpoint (comparison)] | 0.899±0.002 |
| role color [pooled midpoint (comparison)] | 0.993±0.000 |
| role size [pooled midpoint (comparison)] | 0.990±0.000 |
| role style [pooled midpoint (comparison)] | 0.998±0.001 |
| role text [pooled midpoint (comparison)] | 0.911±0.008 |
| role relation [pooled midpoint (comparison)] | 0.950±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.930±0.004 |
| role region [pooled midpoint (comparison)] | 0.973±0.002 |
| role anchor [pooled midpoint (comparison)] | 0.982±0.002 |
| role fraction [pooled midpoint (comparison)] | 0.998±0.000 |
| role amount [pooled midpoint (comparison)] | 0.998±0.001 |
| role unit [pooled midpoint (comparison)] | 0.998±0.001 |
| role direction [pooled midpoint (comparison)] | 1.000±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.963±0.004 |
| role target [pooled midpoint (comparison)] | 0.973±0.004 |
| role edge [pooled midpoint (comparison)] | 0.993±0.000 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.731±0.005 |
| presence object: present read present [pooled midpoint (comparison)] | 0.943±0.003 |
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
| presence anchor: present read present | 0.842±0.043 |
| presence anchor: share of 'present' readings that abstain | 0.104±0.030 |
| presence anchor: share of true 'present' readings that abstain | 0.104±0.030 |
| presence fraction: present read present | 0.926±0.052 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| occupancy: known filler | 0.973±0.004 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.648±0.052 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.889±0.000 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.021±0.006 |
| presence amount: share of true 'present' readings that abstain | 0.021±0.006 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.004±0.006 |
| presence unit: share of true 'present' readings that abstain | 0.004±0.006 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.992±0.006 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.992±0.006 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 0.982±0.025 |
| presence region: share of 'present' readings that abstain | 0.072±0.051 |
| presence region: share of true 'present' readings that abstain | 0.072±0.051 |
| presence region: present read present [pooled midpoint (comparison)] | 0.439±0.050 |
| presence text: present read present | 0.913±0.035 |
| presence text: share of 'present' readings that abstain | 0.053±0.022 |
| presence text: share of true 'present' readings that abstain | 0.053±0.022 |
| determiner identity (outside FULL when the legend excludes it) | 0.988±0.005 |
| presence text: present read present [pooled midpoint (comparison)] | 0.814±0.018 |
| presence relation: present read present | 0.937±0.017 |
| presence relation: share of 'present' readings that abstain | 0.032±0.017 |
| presence relation: share of true 'present' readings that abstain | 0.032±0.017 |
| presence landmark: present read present | 0.903±0.029 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.822±0.018 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.808±0.010 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.946±0.038 |
| presence source: share of 'present' readings that abstain | 0.668±0.104 |
| presence source: share of true 'present' readings that abstain | 0.668±0.104 |
| presence target: present read present | 0.955±0.025 |
| presence target: share of 'present' readings that abstain | 0.065±0.034 |
| presence target: share of true 'present' readings that abstain | 0.065±0.034 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.685±0.046 |
| presence target: present read present [pooled midpoint (comparison)] | 0.730±0.022 |
| presence landmark: share of 'present' readings that abstain | 0.086±0.043 |
| presence landmark: share of true 'present' readings that abstain | 0.086±0.043 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| presence edge: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.150±0.108 |
| presence style: share of true 'present' readings that abstain | 0.083±0.118 |
| presence style: present read present [pooled midpoint (comparison)] | 0.833±0.118 |
| presence size: present read present | 0.921±0.059 |
| presence size: share of 'present' readings that abstain | 0.069±0.026 |
| presence size: share of true 'present' readings that abstain | 0.069±0.026 |
| presence size: present read present [pooled midpoint (comparison)] | 0.850±0.000 |
| presence color: present read present | 0.905±0.067 |
| presence color: share of 'present' readings that abstain | 0.192±0.068 |
| presence color: share of true 'present' readings that abstain | 0.111±0.079 |
| presence color: present read present [pooled midpoint (comparison)] | 0.571±0.000 |
| presence text: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.074±0.008; status {'ok': 318, 'abstain': 82}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.393 / 0.285 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.953 | 0.281 / 0.128 | 0.98 | 0.039 | 0.017 / 0.008 |
| roles (pooled) | 0.939 | 0.207 / 0.063 | 0.91 | 0.025 | 0.051 / 0.036 |
| role anchor | 0.789 | 0.183 / 0.000 | 0.68 | 0.000 | 0.105 / 0.211 |
| role fraction | 1.000 | 0.137 / 0.107 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 1.000 | 0.176 / 0.121 | 0.97 | 0.000 | 0.025 / 0.000 |
| role unit | 1.000 | 0.262 / 0.182 | 0.99 | 0.000 | 0.013 / 0.000 |
| role direction | 1.000 | 0.172 / 0.120 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.149 / 0.092 | 1.00 | 0.000 | 0.000 / 0.000 |
| role text | 0.961 | 0.205 / 0.071 | 0.94 | 0.000 | 0.022 / 0.039 |
| role relation | 0.960 | 0.168 / 0.094 | 0.91 | 0.000 | 0.050 / 0.040 |
| role landmark | 0.790 | 0.119 / 0.002 | 0.82 | 0.090 | 0.060 / 0.120 |
| role source | 0.838 | 0.040 / 0.011 | 0.22 | 0.000 | 0.622 / 0.162 |
| role target | 0.946 | 0.101 / 0.046 | 0.86 | 0.027 | 0.108 / 0.027 |
| role edge | 0.870 | 0.211 / 0.177 | 1.00 | 0.130 | 0.000 / 0.000 |
| role style | 1.000 | 0.129 / 0.087 | 1.00 | 0.000 | 0.000 / 0.000 |
| role size | 0.905 | 0.148 / 0.012 | 0.81 | 0.000 | 0.095 / 0.095 |
| role color | 0.857 | 0.122 / 0.012 | 0.71 | 0.000 | 0.143 / 0.143 |

### new_identities_en — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.829±0.017 |
| FULL [depth given] | 0.829±0.017 |
| FULL [depth and negation given] | 0.829±0.017 |
| FULL [pooled midpoint (comparison)] | 0.595±0.009 |
| presence object: present read present | 0.997±0.002 |
| presence object: share of 'present' readings that abstain | 0.060±0.013 |
| presence object: share of true 'present' readings that abstain | 0.060±0.013 |
| presence color: absent read absent | 0.997±0.002 |
| presence size: present read present | 0.941±0.000 |
| presence size: share of 'present' readings that abstain | 0.000±0.000 |
| presence size: share of true 'present' readings that abstain | 0.000±0.000 |
| presence style: absent read absent | 1.000±0.000 |
| presence text: absent read absent | 0.991±0.007 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.975±0.010 |
| presence amount: share of 'present' readings that abstain | 0.039±0.019 |
| presence amount: share of true 'present' readings that abstain | 0.039±0.019 |
| presence unit: present read present | 0.983±0.006 |
| presence unit: share of 'present' readings that abstain | 0.047±0.032 |
| presence unit: share of true 'present' readings that abstain | 0.047±0.032 |
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
| role object | 0.958±0.001 |
| head object | 0.992±0.003 |
| lexical order head object | 0.090±0.000 |
| lexical bag head object | 0.877±0.000 |
| occupancy: known filler | 0.967±0.004 |
| role color | 0.995±0.000 |
| head color | 0.995±0.000 |
| lexical order head color | 0.988±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.998±0.000 |
| head size | 0.998±0.000 |
| lexical order head size | 0.958±0.000 |
| lexical bag head size | 0.973±0.000 |
| role style | 1.000±0.000 |
| head style | 1.000±0.000 |
| lexical order head style | 0.993±0.000 |
| lexical bag head style | 0.993±0.000 |
| role text | 0.962±0.024 |
| head text | 0.962±0.024 |
| lexical order head text | 0.560±0.000 |
| lexical bag head text | 0.698±0.000 |
| role relation | 0.966±0.003 |
| head relation | 0.966±0.003 |
| lexical order head relation | 0.770±0.000 |
| lexical bag head relation | 0.818±0.000 |
| role landmark | 0.917±0.015 |
| head landmark | 0.947±0.015 |
| lexical order head landmark | 0.770±0.000 |
| lexical bag head landmark | 0.777±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.955±0.000 |
| lexical bag head region | 0.955±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.960±0.000 |
| lexical bag head anchor | 0.970±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 0.983±0.000 |
| role amount | 0.995±0.002 |
| head amount | 0.995±0.002 |
| lexical order head amount | 0.802±0.000 |
| lexical bag head amount | 0.838±0.000 |
| occupancy: unknown filler | 0.917±0.019 |
| role unit | 0.997±0.001 |
| head unit | 0.997±0.001 |
| lexical order head unit | 0.802±0.000 |
| lexical bag head unit | 0.838±0.000 |
| role direction | 0.996±0.001 |
| head direction | 0.996±0.001 |
| lexical order head direction | 0.932±0.000 |
| lexical bag head direction | 0.945±0.000 |
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
| role source | 0.983±0.004 |
| head source | 0.996±0.004 |
| lexical order head source | 0.910±0.000 |
| lexical bag head source | 0.945±0.000 |
| role target | 0.988±0.003 |
| head target | 0.993±0.004 |
| lexical order head target | 0.910±0.000 |
| lexical bag head target | 0.917±0.000 |
| role edge | 0.994±0.001 |
| head edge | 0.998±0.001 |
| lexical order head edge | 0.945±0.000 |
| lexical bag head edge | 0.973±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.882±0.016 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.228±0.000 |
| role object [pooled midpoint (comparison)] | 0.838±0.009 |
| role color [pooled midpoint (comparison)] | 0.988±0.000 |
| role size [pooled midpoint (comparison)] | 0.998±0.000 |
| role style [pooled midpoint (comparison)] | 0.999±0.001 |
| role text [pooled midpoint (comparison)] | 0.901±0.001 |
| role relation [pooled midpoint (comparison)] | 0.908±0.001 |
| role landmark [pooled midpoint (comparison)] | 0.879±0.002 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 0.998±0.001 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.978±0.004 |
| role unit [pooled midpoint (comparison)] | 0.983±0.008 |
| role direction [pooled midpoint (comparison)] | 0.967±0.002 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.961±0.007 |
| role target [pooled midpoint (comparison)] | 0.967±0.004 |
| role edge [pooled midpoint (comparison)] | 0.992±0.001 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.636±0.010 |
| presence object: present read present [pooled midpoint (comparison)] | 0.877±0.008 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.941±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.991±0.004 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.894±0.026 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.919±0.042 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present | 0.924±0.057 |
| presence text: share of 'present' readings that abstain | 0.074±0.022 |
| presence text: share of true 'present' readings that abstain | 0.066±0.015 |
| presence text: present read present [pooled midpoint (comparison)] | 0.786±0.003 |
| presence relation: present read present | 0.851±0.014 |
| presence relation: share of 'present' readings that abstain | 0.115±0.016 |
| presence relation: share of true 'present' readings that abstain | 0.115±0.016 |
| presence landmark: present read present | 0.786±0.069 |
| presence landmark: share of 'present' readings that abstain | 0.371±0.093 |
| presence landmark: share of true 'present' readings that abstain | 0.371±0.093 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.636±0.005 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.663±0.005 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.021±0.029 |
| presence anchor: share of true 'present' readings that abstain | 0.021±0.029 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.958±0.029 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.991±0.013 |
| presence source: share of 'present' readings that abstain | 0.710±0.115 |
| presence source: share of true 'present' readings that abstain | 0.710±0.115 |
| presence target: present read present | 0.954±0.013 |
| presence target: share of 'present' readings that abstain | 0.399±0.053 |
| presence target: share of true 'present' readings that abstain | 0.399±0.053 |
| presence edge: present read present | 0.970±0.021 |
| presence edge: share of 'present' readings that abstain | 0.031±0.022 |
| presence edge: share of true 'present' readings that abstain | 0.031±0.022 |
| determiner identity (outside FULL when the legend excludes it) | 0.983±0.006 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.685±0.069 |
| presence target: present read present [pooled midpoint (comparison)] | 0.694±0.060 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.909±0.000 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 0.938±0.017 |
| presence direction: share of 'present' readings that abstain | 0.093±0.050 |
| presence direction: share of true 'present' readings that abstain | 0.093±0.050 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.506±0.035 |
| presence color: present read present | 0.800±0.163 |
| presence color: present read present [pooled midpoint (comparison)] | 0.000±0.000 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.111±0.157 |
| presence style: share of true 'present' readings that abstain | 0.111±0.157 |
| presence style: present read present [pooled midpoint (comparison)] | 0.889±0.157 |
| presence color: share of 'present' readings that abstain | 0.841±0.137 |
| presence color: share of true 'present' readings that abstain | 0.822±0.137 |
| presence text: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.075±0.008; status {'abstain': 110, 'ok': 290}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.406 / 0.324 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.953 | 0.260 / 0.085 | 0.95 | 0.027 | 0.027 / 0.019 |
| roles (pooled) | 0.917 | 0.187 / 0.026 | 0.84 | 0.015 | 0.089 / 0.068 |
| role size | 0.941 | 0.160 / 0.105 | 0.94 | 0.000 | 0.000 / 0.059 |
| role amount | 0.975 | 0.184 / 0.082 | 0.92 | 0.000 | 0.051 / 0.025 |
| role unit | 0.987 | 0.202 / 0.107 | 0.97 | 0.000 | 0.013 / 0.013 |
| role text | 1.000 | 0.197 / 0.097 | 0.95 | 0.000 | 0.045 / 0.000 |
| role relation | 0.848 | 0.133 / 0.000 | 0.76 | 0.000 | 0.087 / 0.152 |
| role landmark | 0.609 | 0.057 / 0.000 | 0.40 | 0.033 | 0.239 / 0.359 |
| role anchor | 1.000 | 0.256 / 0.202 | 0.94 | 0.000 | 0.062 / 0.000 |
| role fraction | 1.000 | 0.141 / 0.121 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.833 | 0.024 / 0.001 | 0.14 | 0.000 | 0.694 / 0.167 |
| role target | 0.861 | 0.060 / 0.008 | 0.58 | 0.028 | 0.306 / 0.111 |
| role edge | 0.864 | 0.157 / 0.105 | 0.95 | 0.091 | 0.000 / 0.045 |
| role region | 1.000 | 0.258 / 0.216 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.926 | 0.125 / 0.026 | 0.85 | 0.000 | 0.074 / 0.074 |
| role color | 0.600 | 0.026 / 0.000 | 0.20 | 0.000 | 0.400 / 0.400 |
| role style | 1.000 | 0.093 / 0.036 | 0.67 | 0.000 | 0.333 / 0.000 |

### train (sample) — catalog candidates (n = 300 of 4517)
| axis | accuracy |
|---|---|
| FULL | 0.842±0.009 |
| FULL [depth given] | 0.842±0.009 |
| FULL [depth and negation given] | 0.842±0.009 |
| presence object: present read present | 0.997±0.002 |
| presence object: share of 'present' readings that abstain | 0.018±0.002 |
| presence object: share of true 'present' readings that abstain | 0.018±0.002 |
| presence color: absent read absent | 1.000±0.000 |
| presence size: absent read absent | 0.996±0.003 |
| presence style: absent read absent | 0.998±0.002 |
| presence text: absent read absent | 0.997±0.002 |
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
| role object | 0.954±0.004 |
| head object | 0.998±0.002 |
| lexical order head object | 0.140±0.000 |
| lexical bag head object | 0.550±0.000 |
| occupancy: known filler | 0.971±0.004 |
| role color | 0.996±0.002 |
| head color | 0.996±0.002 |
| lexical order head color | 0.970±0.000 |
| lexical bag head color | 0.987±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.994±0.004 |
| head size | 0.994±0.004 |
| lexical order head size | 0.947±0.000 |
| lexical bag head size | 0.980±0.000 |
| role style | 0.997±0.003 |
| head style | 0.997±0.003 |
| lexical order head style | 0.983±0.000 |
| lexical bag head style | 0.990±0.000 |
| role text | 0.984±0.006 |
| head text | 0.984±0.006 |
| lexical order head text | 0.823±0.000 |
| lexical bag head text | 0.993±0.000 |
| role relation | 0.991±0.002 |
| head relation | 0.991±0.002 |
| lexical order head relation | 0.897±0.000 |
| lexical bag head relation | 0.967±0.000 |
| role landmark | 0.967±0.003 |
| head landmark | 0.987±0.003 |
| lexical order head landmark | 0.897±0.000 |
| lexical bag head landmark | 0.940±0.000 |
| role region | 0.997±0.000 |
| head region | 0.997±0.000 |
| lexical order head region | 0.933±0.000 |
| lexical bag head region | 0.993±0.000 |
| role anchor | 0.999±0.002 |
| head anchor | 0.999±0.002 |
| lexical order head anchor | 0.927±0.000 |
| lexical bag head anchor | 1.000±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.973±0.000 |
| lexical bag head fraction | 1.000±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.957±0.000 |
| lexical bag head amount | 1.000±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.957±0.000 |
| lexical bag head unit | 1.000±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.963±0.000 |
| lexical bag head direction | 0.990±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.960±0.000 |
| lexical bag head axis | 0.983±0.000 |
| role layout | 0.999±0.002 |
| head layout | 0.999±0.002 |
| lexical order head layout | 0.947±0.000 |
| lexical bag head layout | 0.973±0.000 |
| role pairing | 0.999±0.002 |
| head pairing | 0.999±0.002 |
| lexical order head pairing | 0.977±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.954±0.003 |
| head source | 0.991±0.003 |
| lexical order head source | 0.880±0.000 |
| lexical bag head source | 0.913±0.000 |
| role target | 0.976±0.002 |
| head target | 0.999±0.002 |
| lexical order head target | 0.903±0.000 |
| lexical bag head target | 0.933±0.000 |
| role edge | 0.986±0.002 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.933±0.000 |
| lexical bag head edge | 0.950±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.973±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.942±0.009 |
| heads FULL (lexical order baseline) | 0.013±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.407±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence pairing: present read present | 0.952±0.067 |
| presence pairing: share of 'present' readings that abstain | 0.159±0.137 |
| presence pairing: share of true 'present' readings that abstain | 0.159±0.137 |
| presence source: present read present | 0.935±0.013 |
| presence source: share of 'present' readings that abstain | 0.436±0.125 |
| presence source: share of true 'present' readings that abstain | 0.436±0.125 |
| determiner identity (outside FULL when the legend excludes it) | 0.927±0.000 |
| presence text: present read present | 0.925±0.041 |
| presence text: share of 'present' readings that abstain | 0.075±0.028 |
| presence text: share of true 'present' readings that abstain | 0.069±0.028 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.026±0.036 |
| presence amount: share of true 'present' readings that abstain | 0.026±0.036 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.121±0.043 |
| presence direction: share of true 'present' readings that abstain | 0.121±0.043 |
| presence layout: present read present | 0.979±0.029 |
| presence layout: share of 'present' readings that abstain | 0.062±0.051 |
| presence layout: share of true 'present' readings that abstain | 0.062±0.051 |
| presence color: present read present | 0.852±0.052 |
| presence color: share of 'present' readings that abstain | 0.256±0.095 |
| presence color: share of true 'present' readings that abstain | 0.256±0.095 |
| presence anchor: present read present | 0.985±0.021 |
| presence anchor: share of 'present' readings that abstain | 0.061±0.086 |
| presence anchor: share of true 'present' readings that abstain | 0.061±0.086 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence relation: present read present | 0.914±0.015 |
| presence relation: share of 'present' readings that abstain | 0.059±0.034 |
| presence relation: share of true 'present' readings that abstain | 0.059±0.034 |
| presence landmark: present read present | 0.871±0.026 |
| presence size: present read present | 0.958±0.029 |
| presence size: share of 'present' readings that abstain | 0.123±0.003 |
| presence size: share of true 'present' readings that abstain | 0.086±0.027 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.149±0.043 |
| presence target: share of true 'present' readings that abstain | 0.149±0.043 |
| presence landmark: share of 'present' readings that abstain | 0.124±0.047 |
| presence landmark: share of true 'present' readings that abstain | 0.124±0.047 |
| presence region: present read present | 0.950±0.000 |
| presence region: share of 'present' readings that abstain | 0.018±0.025 |
| presence region: share of true 'present' readings that abstain | 0.018±0.025 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.056±0.039 |
| presence axis: share of true 'present' readings that abstain | 0.056±0.039 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.083±0.059 |
| presence quantity: share of true 'present' readings that abstain | 0.083±0.059 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.017±0.024 |
| presence edge: share of true 'present' readings that abstain | 0.017±0.024 |
| presence text: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: present read present | 0.933±0.094 |
| presence style: share of 'present' readings that abstain | 0.300±0.141 |
| presence style: share of true 'present' readings that abstain | 0.200±0.163 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence size: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.068±0.002; status {'ok': 246, 'abstain': 54}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.430 / 0.322 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.946 | 0.315 / 0.173 | 0.98 | 0.047 | 0.016 / 0.008 |
| roles (pooled) | 0.905 | 0.231 / 0.051 | 0.90 | 0.057 | 0.061 / 0.039 |
| role pairing | 1.000 | 0.177 / 0.066 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.583 | 0.045 / 0.005 | 0.47 | 0.222 | 0.333 / 0.194 |
| role text | 0.981 | 0.202 / 0.095 | 0.94 | 0.000 | 0.038 / 0.019 |
| role amount | 1.000 | 0.196 / 0.132 | 0.92 | 0.000 | 0.077 / 0.000 |
| role unit | 1.000 | 0.248 / 0.171 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.217 / 0.112 | 0.91 | 0.000 | 0.091 / 0.000 |
| role layout | 1.000 | 0.271 / 0.162 | 0.94 | 0.000 | 0.062 / 0.000 |
| role color | 0.778 | 0.091 / 0.000 | 0.67 | 0.000 | 0.111 / 0.222 |
| role anchor | 1.000 | 0.229 / 0.011 | 0.82 | 0.000 | 0.182 / 0.000 |
| role fraction | 1.000 | 0.211 / 0.174 | 1.00 | 0.000 | 0.000 / 0.000 |
| role relation | 0.935 | 0.164 / 0.067 | 0.90 | 0.000 | 0.032 / 0.065 |
| role landmark | 0.677 | 0.097 / 0.000 | 0.71 | 0.129 | 0.097 / 0.194 |
| role size | 0.938 | 0.162 / 0.031 | 0.88 | 0.000 | 0.062 / 0.062 |
| role target | 0.724 | 0.115 / 0.032 | 0.79 | 0.207 | 0.138 / 0.069 |
| role region | 0.950 | 0.226 / 0.131 | 0.95 | 0.000 | 0.000 / 0.050 |
| role axis | 1.000 | 0.279 / 0.111 | 1.00 | 0.000 | 0.000 / 0.000 |
| role quantity | 1.000 | 0.156 / 0.061 | 0.88 | 0.000 | 0.125 / 0.000 |
| role edge | 0.750 | 0.202 / 0.094 | 1.00 | 0.250 | 0.000 / 0.000 |
| role style | 1.000 | 0.110 / 0.025 | 0.60 | 0.000 | 0.400 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 COMPONENT=0.98 PAIR=0.92 UNIT=0.92 not=0.90 EDGE=0.87 ANCHOR=0.78 DIR=0.77 AXIS=0.72 back=0.59 front=0.53 REGION=0.52 FILLER=0.50 VERB=0.48 LABEL=0.45 flow=0.37 LAYOUT=0.31 REL=0.30 dimensiunea=0.29 never=0.23 PRON=0.17 is=0.16 do=0.13 CONN=0.12 din=0.12 together=0.12 unknown=0.12 are=0.11 FRACTION=0.11 care=0.10 apart=0.08 pe=0.05 INTRO=0.03 lui=0.03 color=0.02 evenly=0.02 spre=0.01 la=0.01 de=0.01 cu=0.01 DEM=0.01 SIZE=0.01 STYLE=0.01 COLOR=0.00 the=0.00 QUANT=0.00 NUM=0.00 a=0.00

## What is weak, what to add
- heldout_formulations: FULL 0.800
- heldout_formulations: presence object: share of 'present' readings that abstain 0.012
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.012
- heldout_formulations: presence text: share of 'present' readings that abstain 0.038
- heldout_formulations: presence text: share of true 'present' readings that abstain 0.038
- heldout_formulations: heads FULL (lexical order baseline) 0.010
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.034
- heldout_formulations: FULL [depth given] 0.800
- heldout_formulations: FULL [depth and negation given] 0.800
- heldout_formulations: FULL [presence not decided] 0.824
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.663
- heldout_formulations: role object [pooled midpoint (comparison)] 0.859
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.746
- heldout_formulations: presence object: present read present [pooled midpoint (comparison)] 0.899
- heldout_formulations: presence text: present read present [pooled midpoint (comparison)] 0.769
- heldout_formulations: presence size: share of 'present' readings that abstain 0.000
- heldout_formulations: presence size: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence style: share of 'present' readings that abstain 0.333
- heldout_formulations: presence style: share of true 'present' readings that abstain 0.333
- heldout_formulations: presence style: present read present [pooled midpoint (comparison)] 0.750
- heldout_formulations: presence region: share of 'present' readings that abstain 0.000
- heldout_formulations: presence region: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence region: present read present [pooled midpoint (comparison)] 0.773
- heldout_formulations: presence amount: share of 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence relation: present read present 0.828
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.083
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.083
- heldout_formulations: presence landmark: present read present 0.690
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.050
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.050
- heldout_formulations: presence relation: present read present [pooled midpoint (comparison)] 0.586
- heldout_formulations: presence landmark: present read present [pooled midpoint (comparison)] 0.655
- heldout_formulations: presence source: present read present 0.771
- heldout_formulations: presence source: share of 'present' readings that abstain 0.667
- heldout_formulations: presence source: share of true 'present' readings that abstain 0.667
- heldout_formulations: presence target: share of 'present' readings that abstain 0.100
- heldout_formulations: presence target: share of true 'present' readings that abstain 0.100
- heldout_formulations: presence edge: share of 'present' readings that abstain 0.033
- heldout_formulations: presence edge: share of true 'present' readings that abstain 0.033
- heldout_formulations: presence source: present read present [pooled midpoint (comparison)] 0.743
- heldout_formulations: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence quantity: share of 'present' readings that abstain 0.133
- heldout_formulations: presence quantity: share of true 'present' readings that abstain 0.133
- heldout_formulations: presence color: share of 'present' readings that abstain 0.500
- heldout_formulations: presence color: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence axis: share of 'present' readings that abstain 0.000
- heldout_formulations: presence axis: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of 'present' readings that abstain 0.200
- heldout_formulations: presence pairing: share of true 'present' readings that abstain 0.200
- heldout_formulations: presence pairing: present read present [pooled midpoint (comparison)] 0.600
- heldout_formulations: presence direction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence direction: present read present [pooled midpoint (comparison)] 0.500
- heldout_formulations_en: FULL 0.853
- heldout_formulations_en: presence object: share of 'present' readings that abstain 0.030
- heldout_formulations_en: presence object: share of true 'present' readings that abstain 0.030
- heldout_formulations_en: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence fraction: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: heads FULL (lexical order baseline) 0.006
- heldout_formulations_en: heads FULL (lexical bag baseline, trained on the same training rows) 0.253
- heldout_formulations_en: FULL [depth given] 0.853
- heldout_formulations_en: FULL [depth and negation given] 0.853
- heldout_formulations_en: FULL [presence not decided] 0.853
- heldout_formulations_en: FULL [pooled midpoint (comparison)] 0.659
- heldout_formulations_en: role object [pooled midpoint (comparison)] 0.829
- heldout_formulations_en: heads FULL (model) [pooled midpoint (comparison)] 0.724
- heldout_formulations_en: presence object: present read present [pooled midpoint (comparison)] 0.820
- heldout_formulations_en: presence size: share of 'present' readings that abstain 0.154
- heldout_formulations_en: presence size: share of true 'present' readings that abstain 0.083
- heldout_formulations_en: presence size: present read present [pooled midpoint (comparison)] 0.833
- heldout_formulations_en: presence amount: share of 'present' readings that abstain 0.125
- heldout_formulations_en: presence amount: share of true 'present' readings that abstain 0.125
- heldout_formulations_en: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence amount: present read present [pooled midpoint (comparison)] 0.875
- heldout_formulations_en: presence region: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence region: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence relation: share of 'present' readings that abstain 0.111
- heldout_formulations_en: presence relation: share of true 'present' readings that abstain 0.111
- heldout_formulations_en: presence landmark: share of 'present' readings that abstain 0.444
- heldout_formulations_en: presence landmark: share of true 'present' readings that abstain 0.444
- heldout_formulations_en: presence relation: present read present [pooled midpoint (comparison)] 0.737
- heldout_formulations_en: presence landmark: present read present [pooled midpoint (comparison)] 0.737
- heldout_formulations_en: presence color: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence color: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence style: present read present 0.667
- heldout_formulations_en: presence style: present read present [pooled midpoint (comparison)] 0.167
- heldout_formulations_en: presence text: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence text: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence text: present read present [pooled midpoint (comparison)] 0.895
- heldout_formulations_en: presence source: share of 'present' readings that abstain 0.829
- heldout_formulations_en: presence source: share of true 'present' readings that abstain 0.829
- heldout_formulations_en: presence target: share of 'present' readings that abstain 0.469
- heldout_formulations_en: presence target: share of true 'present' readings that abstain 0.469
- heldout_formulations_en: presence edge: share of 'present' readings that abstain 0.062
- heldout_formulations_en: presence edge: share of true 'present' readings that abstain 0.062
- heldout_formulations_en: presence quantity: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence quantity: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence pairing: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence pairing: present read present [pooled midpoint (comparison)] 0.667
- heldout_formulations_en: presence direction: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence direction: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence direction: present read present [pooled midpoint (comparison)] 0.000
- heldout_sentences: FULL 0.828
- heldout_sentences: presence object: share of 'present' readings that abstain 0.019
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.019
- heldout_sentences: presence relation: share of 'present' readings that abstain 0.123
- heldout_sentences: presence relation: share of true 'present' readings that abstain 0.123
- heldout_sentences: presence landmark: present read present 0.765
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.154
- heldout_sentences: presence landmark: share of true 'present' readings that abstain 0.154
- heldout_sentences: presence amount: share of 'present' readings that abstain 0.000
- heldout_sentences: presence amount: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.028
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.028
- heldout_sentences: heads FULL (lexical order baseline) 0.012
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.203
- heldout_sentences: FULL [depth given] 0.828
- heldout_sentences: FULL [depth and negation given] 0.828
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.673
- heldout_sentences: role object [pooled midpoint (comparison)] 0.878
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.741
- heldout_sentences: presence relation: present read present [pooled midpoint (comparison)] 0.727
- heldout_sentences: presence landmark: present read present [pooled midpoint (comparison)] 0.682
- heldout_sentences: presence size: present read present 0.886
- heldout_sentences: presence size: share of 'present' readings that abstain 0.065
- heldout_sentences: presence size: share of true 'present' readings that abstain 0.065
- heldout_sentences: presence size: present read present [pooled midpoint (comparison)] 0.800
- heldout_sentences: presence color: present read present 0.800
- heldout_sentences: presence color: share of 'present' readings that abstain 0.050
- heldout_sentences: presence color: share of true 'present' readings that abstain 0.050
- heldout_sentences: presence color: present read present [pooled midpoint (comparison)] 0.458
- heldout_sentences: presence text: share of 'present' readings that abstain 0.030
- heldout_sentences: presence text: share of true 'present' readings that abstain 0.031
- heldout_sentences: presence text: present read present [pooled midpoint (comparison)] 0.875
- heldout_sentences: presence source: share of 'present' readings that abstain 0.653
- heldout_sentences: presence source: share of true 'present' readings that abstain 0.653
- heldout_sentences: presence target: share of 'present' readings that abstain 0.212
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.188
- heldout_sentences: presence edge: share of 'present' readings that abstain 0.000
- heldout_sentences: presence edge: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.698
- heldout_sentences: presence target: present read present [pooled midpoint (comparison)] 0.758
- heldout_sentences: presence region: share of 'present' readings that abstain 0.093
- heldout_sentences: presence region: share of true 'present' readings that abstain 0.093
- heldout_sentences: presence region: present read present [pooled midpoint (comparison)] 0.727
- heldout_sentences: presence direction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence direction: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence pairing: share of 'present' readings that abstain 0.200
- heldout_sentences: presence pairing: share of true 'present' readings that abstain 0.200
- heldout_sentences: presence pairing: present read present [pooled midpoint (comparison)] 0.750
- heldout_sentences: presence axis: share of 'present' readings that abstain 0.000
- heldout_sentences: presence axis: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence anchor: share of 'present' readings that abstain 0.043
- heldout_sentences: presence anchor: share of true 'present' readings that abstain 0.043
- heldout_sentences: presence fraction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence layout: share of 'present' readings that abstain 0.040
- heldout_sentences: presence layout: share of true 'present' readings that abstain 0.040
- heldout_sentences: presence quantity: share of 'present' readings that abstain 0.000
- heldout_sentences: presence quantity: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence style: share of 'present' readings that abstain 0.250
- heldout_sentences: presence style: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence text: share of FALSE 'present' readings that abstain 0.000
- mixed: FULL 0.820
- mixed: presence object: share of 'present' readings that abstain 0.009
- mixed: presence object: share of true 'present' readings that abstain 0.009
- mixed: presence relation: present read present 0.870
- mixed: presence relation: share of 'present' readings that abstain 0.125
- mixed: presence relation: share of true 'present' readings that abstain 0.125
- mixed: presence landmark: present read present 0.652
- mixed: heads FULL (lexical order baseline) 0.018
- mixed: heads FULL (lexical bag baseline, trained on the same training rows) 0.102
- mixed: FULL [depth given] 0.820
- mixed: FULL [depth and negation given] 0.820
- mixed: FULL [pooled midpoint (comparison)] 0.623
- mixed: role object [pooled midpoint (comparison)] 0.840
- mixed: heads FULL (model) [pooled midpoint (comparison)] 0.693
- mixed: presence object: present read present [pooled midpoint (comparison)] 0.891
- mixed: presence relation: present read present [pooled midpoint (comparison)] 0.568
- mixed: presence landmark: present read present [pooled midpoint (comparison)] 0.568
- mixed: presence region: present read present 0.895
- mixed: presence region: present read present [pooled midpoint (comparison)] 0.649
- mixed: presence anchor: present read present 0.897
- mixed: presence anchor: share of 'present' readings that abstain 0.057
- mixed: presence anchor: share of true 'present' readings that abstain 0.057
- mixed: presence anchor: present read present [pooled midpoint (comparison)] 0.692
- mixed: presence layout: share of 'present' readings that abstain 0.000
- mixed: presence layout: share of true 'present' readings that abstain 0.000
- mixed: presence layout: present read present [pooled midpoint (comparison)] 0.818
- mixed: presence amount: share of 'present' readings that abstain 0.037
- mixed: presence amount: share of true 'present' readings that abstain 0.037
- mixed: presence unit: share of 'present' readings that abstain 0.000
- mixed: presence unit: share of true 'present' readings that abstain 0.000
- mixed: presence source: present read present 0.886
- mixed: presence source: share of 'present' readings that abstain 0.641
- mixed: presence source: share of true 'present' readings that abstain 0.641
- mixed: presence target: share of 'present' readings that abstain 0.179
- mixed: presence target: share of true 'present' readings that abstain 0.179
- mixed: presence edge: share of 'present' readings that abstain 0.095
- mixed: presence edge: share of true 'present' readings that abstain 0.095
- mixed: presence source: present read present [pooled midpoint (comparison)] 0.700
- mixed: presence target: present read present [pooled midpoint (comparison)] 0.857
- mixed: presence text: share of 'present' readings that abstain 0.064
- mixed: presence size: share of 'present' readings that abstain 0.071
- mixed: presence size: share of true 'present' readings that abstain 0.071
- mixed: presence region: share of 'present' readings that abstain 0.088
- mixed: presence region: share of true 'present' readings that abstain 0.088
- mixed: presence text: present read present [pooled midpoint (comparison)] 0.771
- mixed: presence text: share of true 'present' readings that abstain 0.043
- mixed: presence fraction: share of 'present' readings that abstain 0.000
- mixed: presence fraction: share of true 'present' readings that abstain 0.000
- mixed: presence axis: share of 'present' readings that abstain 0.000
- mixed: presence axis: share of true 'present' readings that abstain 0.000
- mixed: presence axis: present read present [pooled midpoint (comparison)] 0.882
- mixed: presence landmark: share of 'present' readings that abstain 0.067
- mixed: presence landmark: share of true 'present' readings that abstain 0.067
- mixed: presence quantity: share of 'present' readings that abstain 0.000
- mixed: presence quantity: share of true 'present' readings that abstain 0.000
- mixed: presence direction: share of 'present' readings that abstain 0.120
- mixed: presence direction: share of true 'present' readings that abstain 0.120
- mixed: presence direction: present read present [pooled midpoint (comparison)] 0.880
- mixed: presence pairing: present read present 0.875
- mixed: presence pairing: share of 'present' readings that abstain 0.071
- mixed: presence pairing: share of true 'present' readings that abstain 0.071
- mixed: presence style: share of 'present' readings that abstain 0.125
- mixed: presence style: share of true 'present' readings that abstain 0.125
- mixed: presence style: present read present [pooled midpoint (comparison)] 0.875
- mixed: presence color: present read present 0.889
- mixed: presence color: share of 'present' readings that abstain 0.000
- mixed: presence color: share of true 'present' readings that abstain 0.000
- mixed: presence color: present read present [pooled midpoint (comparison)] 0.667
- new_identities: FULL 0.870
- new_identities: presence object: share of 'present' readings that abstain 0.019
- new_identities: presence object: share of true 'present' readings that abstain 0.019
- new_identities: heads FULL (lexical order baseline) 0.000
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.077
- new_identities: FULL [depth given] 0.870
- new_identities: FULL [depth and negation given] 0.870
- new_identities: FULL [pooled midpoint (comparison)] 0.690
- new_identities: role object [pooled midpoint (comparison)] 0.897
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.725
- new_identities: presence anchor: present read present 0.789
- new_identities: presence anchor: share of 'present' readings that abstain 0.133
- new_identities: presence anchor: share of true 'present' readings that abstain 0.133
- new_identities: presence fraction: share of 'present' readings that abstain 0.000
- new_identities: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities: presence anchor: present read present [pooled midpoint (comparison)] 0.611
- new_identities: presence fraction: present read present [pooled midpoint (comparison)] 0.889
- new_identities: presence amount: share of 'present' readings that abstain 0.025
- new_identities: presence amount: share of true 'present' readings that abstain 0.025
- new_identities: presence unit: share of 'present' readings that abstain 0.013
- new_identities: presence unit: share of true 'present' readings that abstain 0.013
- new_identities: presence direction: share of 'present' readings that abstain 0.000
- new_identities: presence direction: share of true 'present' readings that abstain 0.000
- new_identities: presence region: share of 'present' readings that abstain 0.000
- new_identities: presence region: share of true 'present' readings that abstain 0.000
- new_identities: presence region: present read present [pooled midpoint (comparison)] 0.474
- new_identities: presence text: share of 'present' readings that abstain 0.023
- new_identities: presence text: share of true 'present' readings that abstain 0.023
- new_identities: presence text: present read present [pooled midpoint (comparison)] 0.792
- new_identities: presence relation: share of 'present' readings that abstain 0.052
- new_identities: presence relation: share of true 'present' readings that abstain 0.052
- new_identities: presence relation: present read present [pooled midpoint (comparison)] 0.835
- new_identities: presence landmark: present read present [pooled midpoint (comparison)] 0.814
- new_identities: presence source: share of 'present' readings that abstain 0.778
- new_identities: presence source: share of true 'present' readings that abstain 0.778
- new_identities: presence target: share of 'present' readings that abstain 0.111
- new_identities: presence target: share of true 'present' readings that abstain 0.111
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.703
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.757
- new_identities: presence landmark: share of 'present' readings that abstain 0.089
- new_identities: presence landmark: share of true 'present' readings that abstain 0.089
- new_identities: presence edge: share of 'present' readings that abstain 0.000
- new_identities: presence edge: share of true 'present' readings that abstain 0.000
- new_identities: presence style: share of 'present' readings that abstain 0.000
- new_identities: presence style: share of true 'present' readings that abstain 0.000
- new_identities: presence size: share of 'present' readings that abstain 0.105
- new_identities: presence size: share of true 'present' readings that abstain 0.105
- new_identities: presence size: present read present [pooled midpoint (comparison)] 0.850
- new_identities: presence color: present read present 0.857
- new_identities: presence color: share of 'present' readings that abstain 0.167
- new_identities: presence color: share of true 'present' readings that abstain 0.167
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.571
- new_identities: presence text: share of FALSE 'present' readings that abstain 0.000
- new_identities_en: FULL 0.853
- new_identities_en: presence object: share of 'present' readings that abstain 0.041
- new_identities_en: presence object: share of true 'present' readings that abstain 0.041
- new_identities_en: presence size: share of 'present' readings that abstain 0.000
- new_identities_en: presence size: share of true 'present' readings that abstain 0.000
- new_identities_en: presence amount: share of 'present' readings that abstain 0.052
- new_identities_en: presence amount: share of true 'present' readings that abstain 0.052
- new_identities_en: presence unit: share of 'present' readings that abstain 0.013
- new_identities_en: presence unit: share of true 'present' readings that abstain 0.013
- new_identities_en: heads FULL (lexical order baseline) 0.000
- new_identities_en: heads FULL (lexical bag baseline, trained on the same training rows) 0.228
- new_identities_en: FULL [depth given] 0.853
- new_identities_en: FULL [depth and negation given] 0.853
- new_identities_en: FULL [pooled midpoint (comparison)] 0.583
- new_identities_en: role object [pooled midpoint (comparison)] 0.825
- new_identities_en: role landmark [pooled midpoint (comparison)] 0.877
- new_identities_en: heads FULL (model) [pooled midpoint (comparison)] 0.623
- new_identities_en: presence object: present read present [pooled midpoint (comparison)] 0.866
- new_identities_en: presence amount: present read present [pooled midpoint (comparison)] 0.899
- new_identities_en: presence text: share of 'present' readings that abstain 0.045
- new_identities_en: presence text: share of true 'present' readings that abstain 0.045
- new_identities_en: presence text: present read present [pooled midpoint (comparison)] 0.784
- new_identities_en: presence relation: present read present 0.848
- new_identities_en: presence relation: share of 'present' readings that abstain 0.103
- new_identities_en: presence relation: share of true 'present' readings that abstain 0.103
- new_identities_en: presence landmark: present read present 0.761
- new_identities_en: presence landmark: share of 'present' readings that abstain 0.471
- new_identities_en: presence landmark: share of true 'present' readings that abstain 0.471
- new_identities_en: presence relation: present read present [pooled midpoint (comparison)] 0.632
- new_identities_en: presence landmark: present read present [pooled midpoint (comparison)] 0.667
- new_identities_en: presence anchor: share of 'present' readings that abstain 0.062
- new_identities_en: presence anchor: share of true 'present' readings that abstain 0.062
- new_identities_en: presence fraction: share of 'present' readings that abstain 0.000
- new_identities_en: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities_en: presence source: share of 'present' readings that abstain 0.861
- new_identities_en: presence source: share of true 'present' readings that abstain 0.861
- new_identities_en: presence target: share of 'present' readings that abstain 0.382
- new_identities_en: presence target: share of true 'present' readings that abstain 0.382
- new_identities_en: presence edge: share of 'present' readings that abstain 0.000
- new_identities_en: presence edge: share of true 'present' readings that abstain 0.000
- new_identities_en: presence source: present read present [pooled midpoint (comparison)] 0.611
- new_identities_en: presence target: present read present [pooled midpoint (comparison)] 0.778
- new_identities_en: presence region: share of 'present' readings that abstain 0.000
- new_identities_en: presence region: share of true 'present' readings that abstain 0.000
- new_identities_en: presence direction: share of 'present' readings that abstain 0.080
- new_identities_en: presence direction: share of true 'present' readings that abstain 0.080
- new_identities_en: presence direction: present read present [pooled midpoint (comparison)] 0.481
- new_identities_en: presence color: present read present 0.600
- new_identities_en: presence color: present read present [pooled midpoint (comparison)] 0.000
- new_identities_en: presence style: share of 'present' readings that abstain 0.333
- new_identities_en: presence style: share of true 'present' readings that abstain 0.333
- new_identities_en: presence style: present read present [pooled midpoint (comparison)] 0.667
- new_identities_en: presence color: share of 'present' readings that abstain 0.667
- new_identities_en: presence color: share of true 'present' readings that abstain 0.667
- new_identities_en: presence text: share of FALSE 'present' readings that abstain 0.000
- train (sample): FULL 0.847
- train (sample): presence object: share of 'present' readings that abstain 0.019
- train (sample): presence object: share of true 'present' readings that abstain 0.019
- train (sample): heads FULL (lexical order baseline) 0.013
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.407
- train (sample): FULL [depth given] 0.847
- train (sample): FULL [depth and negation given] 0.847
- train (sample): presence pairing: share of 'present' readings that abstain 0.000
- train (sample): presence pairing: share of true 'present' readings that abstain 0.000
- train (sample): presence source: share of 'present' readings that abstain 0.485
- train (sample): presence source: share of true 'present' readings that abstain 0.485
- train (sample): presence text: share of 'present' readings that abstain 0.038
- train (sample): presence text: share of true 'present' readings that abstain 0.038
- train (sample): presence amount: share of 'present' readings that abstain 0.077
- train (sample): presence amount: share of true 'present' readings that abstain 0.077
- train (sample): presence unit: share of 'present' readings that abstain 0.000
- train (sample): presence unit: share of true 'present' readings that abstain 0.000
- train (sample): presence direction: share of 'present' readings that abstain 0.091
- train (sample): presence direction: share of true 'present' readings that abstain 0.091
- train (sample): presence layout: share of 'present' readings that abstain 0.062
- train (sample): presence layout: share of true 'present' readings that abstain 0.062
- train (sample): presence color: present read present 0.778
- train (sample): presence color: share of 'present' readings that abstain 0.143
- train (sample): presence color: share of true 'present' readings that abstain 0.143
- train (sample): presence anchor: share of 'present' readings that abstain 0.182
- train (sample): presence anchor: share of true 'present' readings that abstain 0.182
- train (sample): presence fraction: share of 'present' readings that abstain 0.000
- train (sample): presence fraction: share of true 'present' readings that abstain 0.000
- train (sample): presence relation: share of 'present' readings that abstain 0.034
- train (sample): presence relation: share of true 'present' readings that abstain 0.034
- train (sample): presence landmark: present read present 0.871
- train (sample): presence size: share of 'present' readings that abstain 0.125
- train (sample): presence size: share of true 'present' readings that abstain 0.067
- train (sample): presence target: share of 'present' readings that abstain 0.207
- train (sample): presence target: share of true 'present' readings that abstain 0.207
- train (sample): presence landmark: share of 'present' readings that abstain 0.185
- train (sample): presence landmark: share of true 'present' readings that abstain 0.185
- train (sample): presence region: share of 'present' readings that abstain 0.000
- train (sample): presence region: share of true 'present' readings that abstain 0.000
- train (sample): presence axis: share of 'present' readings that abstain 0.000
- train (sample): presence axis: share of true 'present' readings that abstain 0.000
- train (sample): presence quantity: share of 'present' readings that abstain 0.125
- train (sample): presence quantity: share of true 'present' readings that abstain 0.125
- train (sample): presence edge: share of 'present' readings that abstain 0.000
- train (sample): presence edge: share of true 'present' readings that abstain 0.000
- train (sample): presence text: share of FALSE 'present' readings that abstain 0.000
- train (sample): presence style: share of 'present' readings that abstain 0.500
- train (sample): presence style: share of true 'present' readings that abstain 0.400

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_sentences: `would you make the COMPONENT SIZE` FULL 0.000 (n 3)
- heldout_formulations: `okay deci fa COMPONENT STYLE .` FULL 0.000 (n 2)
- heldout_sentences: `ai putea sa atasezi QUANT COMPONENT PAIR .` FULL 0.000 (n 2)
- new_identities: `ai putea sa PRON numesti LABEL` FULL 0.000 (n 2)
- heldout_formulations: `hai sa asezam COMPONENT la NUM de UNIT REL COMPONENT COLOR` FULL 0.000 (n 1)
- heldout_formulations: `as_vrea sa conectati COMPONENT STYLE si LABEL cu a EDGE .` FULL 0.000 (n 1)
- heldout_formulations: `va rog sa nu stergeti COMPONENT care nu este COLOR .` FULL 0.000 (n 1)
- heldout_formulations: `am nevoie sa inserezi a COMPONENT etichetat LABEL REL COMPONENT` FULL 0.000 (n 1)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role size | role style | role text | role relation | role landmark | role region | role anchor | role fraction | role amount | role unit | role direction | role axis | role layout | role pairing | role source | role target | role edge | role quantity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.907±0.014 | 0.800±0.008 | 0.930±0.002 | 0.993±0.002 | 1.000±0.000 | 0.997±0.002 | 0.993±0.006 | 0.980±0.011 | 0.946±0.008 | 0.995±0.000 | 1.000±0.000 | 0.998±0.002 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.935±0.006 | 0.979±0.002 | 0.990±0.000 | 0.998±0.002 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.756±0.017 | 0.673±0.017 | 0.875±0.012 | 1.000±0.000 | 1.000±0.000 | 0.980±0.007 | 0.976±0.011 | 0.946±0.004 | 0.933±0.002 | 0.971±0.004 | 0.998±0.002 | 0.998±0.002 | 1.000±0.000 | 1.000±0.000 | 0.995±0.000 | 1.000±0.000 | 1.000±0.000 | 0.995±0.004 | 0.930±0.006 | 0.976±0.000 | 0.985±0.000 | 0.997±0.002 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.953±0.008 | 0.833±0.006 | 0.930±0.002 | 0.985±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.969±0.002 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.933±0.008 | 0.977±0.002 | 0.992±0.002 | 1.000±0.000 |
| heldout_formulations_en | product readout: presence decided | 0.939±0.007 | 0.849±0.006 | 0.973±0.007 | 0.994±0.005 | 0.994±0.000 | 0.988±0.000 | 0.998±0.003 | 0.996±0.003 | 0.988±0.005 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.943±0.003 | 0.947±0.005 | 0.976±0.005 | 1.000±0.000 |
| heldout_formulations_en | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.729±0.022 | 0.663±0.015 | 0.829±0.005 | 1.000±0.000 | 0.990±0.007 | 0.971±0.000 | 0.980±0.003 | 0.978±0.006 | 0.965±0.005 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.996±0.003 | 1.000±0.000 | 0.994±0.000 | 1.000±0.000 | 1.000±0.000 | 0.996±0.003 | 0.943±0.003 | 0.945±0.003 | 0.965±0.005 | 1.000±0.000 |
| heldout_formulations_en | v16 protocol: every role read, not available to the product | 0.945±0.003 | 0.853±0.010 | 0.975±0.007 | 0.988±0.000 | 0.994±0.000 | 0.988±0.000 | 1.000±0.000 | 1.000±0.000 | 0.992±0.003 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.943±0.003 | 0.947±0.005 | 0.978±0.003 | 1.000±0.000 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.020±0.006 (— / 0.020±0.006) |
| heldout_formulations | object | comparison: pooled midpoint | 0.915±0.012 | 1.000±0.000 | 0.957±0.006 |  |
| heldout_formulations | color | product: fitted | 1.000±0.000 | 0.993±0.002 | 0.997±0.001 | 0.556±0.079 (1.000±0.000 / 0.000±0.000) |
| heldout_formulations | color | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | size | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | size | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | style | product: fitted | 0.944±0.039 | 1.000±0.000 | 0.972±0.020 | 0.384±0.052 (— / 0.384±0.052) |
| heldout_formulations | style | comparison: pooled midpoint | 0.667±0.118 | 1.000±0.000 | 0.833±0.059 |  |
| heldout_formulations | text | product: fitted | 0.949±0.048 | 1.000±0.000 | 0.974±0.024 | 0.084±0.063 (— / 0.084±0.063) |
| heldout_formulations | text | comparison: pooled midpoint | 0.808±0.083 | 1.000±0.000 | 0.904±0.042 |  |
| heldout_formulations | relation | product: fitted | 0.862±0.074 | 1.000±0.000 | 0.931±0.037 | 0.075±0.059 (— / 0.075±0.059) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.621±0.028 | 1.000±0.000 | 0.810±0.014 |  |
| heldout_formulations | landmark | product: fitted | 0.770±0.071 | 1.000±0.000 | 0.885±0.035 | 0.074±0.017 (— / 0.074±0.017) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.667±0.016 | 1.000±0.000 | 0.833±0.008 |  |
| heldout_formulations | region | product: fitted | 0.955±0.000 | 1.000±0.000 | 0.977±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | region | comparison: pooled midpoint | 0.727±0.037 | 1.000±0.000 | 0.864±0.019 |  |
| heldout_formulations | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | anchor | comparison: pooled midpoint | 0.978±0.031 | 1.000±0.000 | 0.989±0.016 |  |
| heldout_formulations | fraction | product: fitted | 0.978±0.031 | 1.000±0.000 | 0.989±0.016 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | fraction | comparison: pooled midpoint | 0.978±0.031 | 1.000±0.000 | 0.989±0.016 |  |
| heldout_formulations | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | amount | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | unit | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.167±0.236 (— / 0.167±0.236) |
| heldout_formulations | direction | comparison: pooled midpoint | 0.500±0.000 | 1.000±0.000 | 0.750±0.000 |  |
| heldout_formulations | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | layout | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.133±0.094 (— / 0.133±0.094) |
| heldout_formulations | pairing | comparison: pooled midpoint | 0.800±0.163 | 1.000±0.000 | 0.900±0.082 |  |
| heldout_formulations | source | product: fitted | 0.829±0.040 | 1.000±0.000 | 0.914±0.020 | 0.644±0.057 (— / 0.644±0.057) |
| heldout_formulations | source | comparison: pooled midpoint | 0.781±0.027 | 1.000±0.000 | 0.890±0.013 |  |
| heldout_formulations | target | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.078±0.031 (— / 0.078±0.031) |
| heldout_formulations | target | comparison: pooled midpoint | 0.956±0.016 | 1.000±0.000 | 0.978±0.008 |  |
| heldout_formulations | edge | product: fitted | 0.989±0.016 | 1.000±0.000 | 0.994±0.008 | 0.034±0.001 (— / 0.034±0.001) |
| heldout_formulations | edge | comparison: pooled midpoint | 0.933±0.000 | 1.000±0.000 | 0.967±0.000 |  |
| heldout_formulations | quantity | product: fitted | 0.978±0.031 | 1.000±0.000 | 0.989±0.016 | 0.067±0.054 (— / 0.067±0.054) |
| heldout_formulations | quantity | comparison: pooled midpoint | 0.956±0.031 | 1.000±0.000 | 0.978±0.016 |  |
| heldout_formulations_en | object | product: fitted | 0.998±0.004 | 1.000±0.000 | 0.999±0.002 | 0.025±0.004 (— / 0.025±0.004) |
| heldout_formulations_en | object | comparison: pooled midpoint | 0.820±0.013 | 1.000±0.000 | 0.910±0.006 |  |
| heldout_formulations_en | color | product: fitted | 1.000±0.000 | 0.994±0.005 | 0.997±0.002 | 0.278±0.208 (1.000±0.000 / 0.000±0.000) |
| heldout_formulations_en | color | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | size | product: fitted | 1.000±0.000 | 0.994±0.000 | 0.997±0.000 | 0.128±0.036 (1.000±0.000 / 0.056±0.039) |
| heldout_formulations_en | size | comparison: pooled midpoint | 0.861±0.104 | 1.000±0.000 | 0.931±0.052 |  |
| heldout_formulations_en | style | product: fitted | 0.833±0.136 | 0.994±0.005 | 0.914±0.066 | 0.861±0.104 (1.000±0.000 / 0.822±0.137) |
| heldout_formulations_en | style | comparison: pooled midpoint | 0.167±0.000 | 1.000±0.000 | 0.583±0.000 |  |
| heldout_formulations_en | text | product: fitted | 0.983±0.024 | 1.000±0.000 | 0.992±0.012 | 0.034±0.024 (— / 0.034±0.024) |
| heldout_formulations_en | text | comparison: pooled midpoint | 0.882±0.022 | 0.996±0.003 | 0.939±0.012 |  |
| heldout_formulations_en | relation | product: fitted | 0.965±0.025 | 1.000±0.000 | 0.982±0.012 | 0.055±0.045 (— / 0.055±0.045) |
| heldout_formulations_en | relation | comparison: pooled midpoint | 0.823±0.064 | 1.000±0.000 | 0.911±0.032 |  |
| heldout_formulations_en | landmark | product: fitted | 0.965±0.025 | 1.000±0.000 | 0.982±0.012 | 0.366±0.110 (— / 0.366±0.110) |
| heldout_formulations_en | landmark | comparison: pooled midpoint | 0.769±0.045 | 1.000±0.000 | 0.885±0.023 |  |
| heldout_formulations_en | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.042±0.059 (— / 0.042±0.059) |
| heldout_formulations_en | amount | comparison: pooled midpoint | 0.917±0.059 | 1.000±0.000 | 0.958±0.029 |  |
| heldout_formulations_en | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | unit | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.333±0.471 (— / 0.333±0.471) |
| heldout_formulations_en | direction | comparison: pooled midpoint | 0.000±0.000 | 1.000±0.000 | 0.500±0.000 |  |
| heldout_formulations_en | axis | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations_en | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations_en | layout | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations_en | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations_en | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.222±0.157 (— / 0.222±0.157) |
| heldout_formulations_en | pairing | comparison: pooled midpoint | 0.778±0.157 | 1.000±0.000 | 0.889±0.079 |  |
| heldout_formulations_en | source | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.743±0.070 (— / 0.743±0.070) |
| heldout_formulations_en | source | comparison: pooled midpoint | 0.943±0.000 | 1.000±0.000 | 0.971±0.000 |  |
| heldout_formulations_en | target | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.542±0.053 (— / 0.542±0.053) |
| heldout_formulations_en | target | comparison: pooled midpoint | 0.990±0.015 | 1.000±0.000 | 0.995±0.007 |  |
| heldout_formulations_en | edge | product: fitted | 0.990±0.015 | 1.000±0.000 | 0.995±0.007 | 0.074±0.041 (— / 0.074±0.041) |
| heldout_formulations_en | edge | comparison: pooled midpoint | 0.927±0.015 | 1.000±0.000 | 0.964±0.007 |  |
| heldout_formulations_en | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | quantity | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.016±0.003 (— / 0.016±0.003) |
| heldout_sentences | object | comparison: pooled midpoint | 0.936±0.008 | 1.000±0.000 | 0.968±0.004 |  |
| heldout_sentences | color | product: fitted | 0.867±0.050 | 1.000±0.000 | 0.933±0.025 | 0.150±0.072 (— / 0.150±0.072) |
| heldout_sentences | color | comparison: pooled midpoint | 0.514±0.039 | 1.000±0.000 | 0.757±0.020 |  |
| heldout_sentences | size | product: fitted | 0.924±0.027 | 1.000±0.000 | 0.962±0.013 | 0.092±0.023 (— / 0.092±0.023) |
| heldout_sentences | size | comparison: pooled midpoint | 0.819±0.013 | 1.000±0.000 | 0.910±0.007 |  |
| heldout_sentences | style | product: fitted | 1.000±0.000 | 0.999±0.001 | 0.999±0.000 | 0.250±0.204 (1.000±0.000 / 0.111±0.157) |
| heldout_sentences | style | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | text | product: fitted | 0.979±0.015 | 0.998±0.002 | 0.988±0.007 | 0.037±0.020 (0.000±0.000 / 0.037±0.020) |
| heldout_sentences | text | comparison: pooled midpoint | 0.885±0.015 | 1.000±0.000 | 0.943±0.007 |  |
| heldout_sentences | relation | product: fitted | 0.941±0.021 | 1.000±0.000 | 0.971±0.010 | 0.099±0.027 (— / 0.099±0.027) |
| heldout_sentences | relation | comparison: pooled midpoint | 0.767±0.030 | 1.000±0.000 | 0.883±0.015 |  |
| heldout_sentences | landmark | product: fitted | 0.799±0.070 | 1.000±0.000 | 0.900±0.035 | 0.133±0.049 (— / 0.133±0.049) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.711±0.021 | 1.000±0.000 | 0.855±0.010 |  |
| heldout_sentences | region | product: fitted | 0.932±0.037 | 1.000±0.000 | 0.966±0.019 | 0.081±0.009 (— / 0.081±0.009) |
| heldout_sentences | region | comparison: pooled midpoint | 0.720±0.011 | 1.000±0.000 | 0.860±0.005 |  |
| heldout_sentences | anchor | product: fitted | 0.973±0.038 | 1.000±0.000 | 0.987±0.019 | 0.028±0.020 (— / 0.028±0.020) |
| heldout_sentences | anchor | comparison: pooled midpoint | 0.917±0.000 | 1.000±0.000 | 0.958±0.000 |  |
| heldout_sentences | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | amount | product: fitted | 0.963±0.013 | 1.000±0.000 | 0.981±0.007 | 0.010±0.013 (— / 0.010±0.013) |
| heldout_sentences | amount | comparison: pooled midpoint | 0.944±0.023 | 1.000±0.000 | 0.972±0.011 |  |
| heldout_sentences | unit | product: fitted | 0.991±0.013 | 1.000±0.000 | 0.995±0.007 | 0.047±0.013 (— / 0.047±0.013) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.917±0.000 | 1.000±0.000 | 0.958±0.000 |  |
| heldout_sentences | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | direction | comparison: pooled midpoint | 0.926±0.030 | 1.000±0.000 | 0.963±0.015 |  |
| heldout_sentences | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | axis | comparison: pooled midpoint | 0.956±0.031 | 1.000±0.000 | 0.978±0.016 |  |
| heldout_sentences | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.027±0.019 (— / 0.027±0.019) |
| heldout_sentences | layout | comparison: pooled midpoint | 0.920±0.033 | 1.000±0.000 | 0.960±0.016 |  |
| heldout_sentences | pairing | product: fitted | 0.933±0.047 | 1.000±0.000 | 0.967±0.024 | 0.085±0.084 (— / 0.085±0.084) |
| heldout_sentences | pairing | comparison: pooled midpoint | 0.783±0.085 | 1.000±0.000 | 0.892±0.042 |  |
| heldout_sentences | source | product: fitted | 0.956±0.024 | 1.000±0.000 | 0.978±0.012 | 0.555±0.078 (— / 0.555±0.078) |
| heldout_sentences | source | comparison: pooled midpoint | 0.704±0.039 | 1.000±0.000 | 0.852±0.019 |  |
| heldout_sentences | target | product: fitted | 0.970±0.000 | 0.999±0.001 | 0.984±0.001 | 0.185±0.023 (1.000 / 0.177±0.015) |
| heldout_sentences | target | comparison: pooled midpoint | 0.818±0.043 | 0.999±0.001 | 0.909±0.022 |  |
| heldout_sentences | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | edge | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | quantity | comparison: pooled midpoint | 0.978±0.031 | 1.000±0.000 | 0.989±0.016 |  |
| mixed | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.015±0.006 (— / 0.015±0.006) |
| mixed | object | comparison: pooled midpoint | 0.900±0.017 | 1.000±0.000 | 0.950±0.008 |  |
| mixed | color | product: fitted | 0.926±0.026 | 0.998±0.002 | 0.962±0.013 | 0.074±0.053 (1.000 / 0.039±0.055) |
| mixed | color | comparison: pooled midpoint | 0.704±0.026 | 1.000±0.000 | 0.852±0.013 |  |
| mixed | size | product: fitted | 0.976±0.034 | 1.000±0.000 | 0.988±0.017 | 0.024±0.034 (— / 0.024±0.034) |
| mixed | size | comparison: pooled midpoint | 0.949±0.036 | 1.000±0.000 | 0.974±0.018 |  |
| mixed | style | product: fitted | 0.958±0.059 | 0.999±0.001 | 0.979±0.029 | 0.333±0.147 (1.000 / 0.310±0.132) |
| mixed | style | comparison: pooled midpoint | 0.833±0.059 | 1.000±0.000 | 0.917±0.029 |  |
| mixed | text | product: fitted | 0.931±0.020 | 0.999±0.001 | 0.965±0.009 | 0.082±0.039 (1.000 / 0.075±0.043) |
| mixed | text | comparison: pooled midpoint | 0.819±0.054 | 1.000±0.000 | 0.909±0.027 |  |
| mixed | relation | product: fitted | 0.819±0.045 | 1.000±0.000 | 0.909±0.022 | 0.069±0.041 (— / 0.069±0.041) |
| mixed | relation | comparison: pooled midpoint | 0.582±0.013 | 1.000±0.000 | 0.791±0.007 |  |
| mixed | landmark | product: fitted | 0.710±0.067 | 1.000±0.000 | 0.855±0.034 | 0.071±0.007 (— / 0.071±0.007) |
| mixed | landmark | comparison: pooled midpoint | 0.612±0.032 | 1.000±0.000 | 0.806±0.016 |  |
| mixed | region | product: fitted | 0.877±0.012 | 1.000±0.000 | 0.939±0.006 | 0.110±0.029 (— / 0.110±0.029) |
| mixed | region | comparison: pooled midpoint | 0.622±0.022 | 1.000±0.000 | 0.811±0.011 |  |
| mixed | anchor | product: fitted | 0.957±0.044 | 1.000±0.000 | 0.979±0.022 | 0.071±0.010 (— / 0.071±0.010) |
| mixed | anchor | comparison: pooled midpoint | 0.718±0.021 | 1.000±0.000 | 0.859±0.010 |  |
| mixed | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | fraction | comparison: pooled midpoint | 0.984±0.022 | 1.000±0.000 | 0.992±0.011 |  |
| mixed | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.037±0.000 (— / 0.037±0.000) |
| mixed | amount | comparison: pooled midpoint | 0.975±0.017 | 1.000±0.000 | 0.988±0.009 |  |
| mixed | unit | product: fitted | 0.988±0.017 | 1.000±0.000 | 0.994±0.009 | 0.012±0.017 (— / 0.012±0.017) |
| mixed | unit | comparison: pooled midpoint | 0.975±0.017 | 1.000±0.000 | 0.988±0.009 |  |
| mixed | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.080±0.033 (— / 0.080±0.033) |
| mixed | direction | comparison: pooled midpoint | 0.853±0.038 | 1.000±0.000 | 0.927±0.019 |  |
| mixed | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | axis | comparison: pooled midpoint | 0.922±0.028 | 1.000±0.000 | 0.961±0.014 |  |
| mixed | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | layout | comparison: pooled midpoint | 0.879±0.057 | 1.000±0.000 | 0.939±0.028 |  |
| mixed | pairing | product: fitted | 0.896±0.078 | 1.000±0.000 | 0.948±0.039 | 0.086±0.077 (— / 0.086±0.077) |
| mixed | pairing | comparison: pooled midpoint | 0.917±0.118 | 1.000±0.000 | 0.958±0.059 |  |
| mixed | source | product: fitted | 0.917±0.028 | 1.000±0.000 | 0.958±0.014 | 0.530±0.088 (— / 0.530±0.088) |
| mixed | source | comparison: pooled midpoint | 0.785±0.060 | 1.000±0.000 | 0.892±0.030 |  |
| mixed | target | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.143±0.029 (— / 0.143±0.029) |
| mixed | target | comparison: pooled midpoint | 0.857±0.029 | 1.000±0.000 | 0.929±0.015 |  |
| mixed | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.095±0.000 (— / 0.095±0.000) |
| mixed | edge | comparison: pooled midpoint | 0.905±0.000 | 1.000±0.000 | 0.952±0.000 |  |
| mixed | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | quantity | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | object | product: fitted | 0.996±0.001 | 1.000±0.000 | 0.998±0.001 | 0.024±0.003 (— / 0.024±0.003) |
| new_identities | object | comparison: pooled midpoint | 0.943±0.003 | 1.000±0.000 | 0.971±0.002 |  |
| new_identities | color | product: fitted | 0.905±0.067 | 0.998±0.001 | 0.952±0.033 | 0.192±0.068 (1.000±0.000 / 0.111±0.079) |
| new_identities | color | comparison: pooled midpoint | 0.571±0.000 | 1.000±0.000 | 0.786±0.000 |  |
| new_identities | size | product: fitted | 0.921±0.059 | 1.000±0.000 | 0.960±0.030 | 0.069±0.026 (— / 0.069±0.026) |
| new_identities | size | comparison: pooled midpoint | 0.850±0.000 | 1.000±0.000 | 0.925±0.000 |  |
| new_identities | style | product: fitted | 1.000±0.000 | 0.999±0.001 | 1.000±0.001 | 0.150±0.108 (1.000 / 0.083±0.118) |
| new_identities | style | comparison: pooled midpoint | 0.833±0.118 | 1.000±0.000 | 0.917±0.059 |  |
| new_identities | text | product: fitted | 0.913±0.035 | 0.998±0.002 | 0.956±0.017 | 0.053±0.022 (0.000 / 0.053±0.022) |
| new_identities | text | comparison: pooled midpoint | 0.814±0.018 | 1.000±0.000 | 0.907±0.009 |  |
| new_identities | relation | product: fitted | 0.937±0.017 | 1.000±0.000 | 0.968±0.008 | 0.032±0.017 (— / 0.032±0.017) |
| new_identities | relation | comparison: pooled midpoint | 0.822±0.018 | 1.000±0.000 | 0.911±0.009 |  |
| new_identities | landmark | product: fitted | 0.903±0.029 | 1.000±0.000 | 0.952±0.014 | 0.086±0.043 (— / 0.086±0.043) |
| new_identities | landmark | comparison: pooled midpoint | 0.808±0.010 | 1.000±0.000 | 0.904±0.005 |  |
| new_identities | region | product: fitted | 0.982±0.025 | 1.000±0.000 | 0.991±0.012 | 0.072±0.051 (— / 0.072±0.051) |
| new_identities | region | comparison: pooled midpoint | 0.439±0.050 | 1.000±0.000 | 0.719±0.025 |  |
| new_identities | anchor | product: fitted | 0.842±0.043 | 1.000±0.000 | 0.921±0.021 | 0.104±0.030 (— / 0.104±0.030) |
| new_identities | anchor | comparison: pooled midpoint | 0.648±0.052 | 1.000±0.000 | 0.824±0.026 |  |
| new_identities | fraction | product: fitted | 0.926±0.052 | 1.000±0.000 | 0.963±0.026 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | fraction | comparison: pooled midpoint | 0.889±0.000 | 1.000±0.000 | 0.944±0.000 |  |
| new_identities | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.021±0.006 (— / 0.021±0.006) |
| new_identities | amount | comparison: pooled midpoint | 0.992±0.006 | 1.000±0.000 | 0.996±0.003 |  |
| new_identities | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.004±0.006 (— / 0.004±0.006) |
| new_identities | unit | comparison: pooled midpoint | 0.992±0.006 | 1.000±0.000 | 0.996±0.003 |  |
| new_identities | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | direction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | source | product: fitted | 0.946±0.038 | 1.000±0.000 | 0.973±0.019 | 0.668±0.104 (— / 0.668±0.104) |
| new_identities | source | comparison: pooled midpoint | 0.685±0.046 | 1.000±0.000 | 0.842±0.023 |  |
| new_identities | target | product: fitted | 0.955±0.025 | 1.000±0.000 | 0.977±0.013 | 0.065±0.034 (— / 0.065±0.034) |
| new_identities | target | comparison: pooled midpoint | 0.730±0.022 | 1.000±0.000 | 0.865±0.011 |  |
| new_identities | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | edge | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | quantity | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | quantity | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | object | product: fitted | 0.997±0.002 | 1.000±0.000 | 0.999±0.001 | 0.060±0.013 (— / 0.060±0.013) |
| new_identities_en | object | comparison: pooled midpoint | 0.877±0.008 | 1.000±0.000 | 0.939±0.004 |  |
| new_identities_en | color | product: fitted | 0.800±0.163 | 0.997±0.002 | 0.899±0.081 | 0.841±0.137 (1.000±0.000 / 0.822±0.137) |
| new_identities_en | color | comparison: pooled midpoint | 0.000±0.000 | 1.000±0.000 | 0.500±0.000 |  |
| new_identities_en | size | product: fitted | 0.941±0.000 | 1.000±0.000 | 0.971±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities_en | size | comparison: pooled midpoint | 0.941±0.000 | 1.000±0.000 | 0.971±0.000 |  |
| new_identities_en | style | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.111±0.157 (— / 0.111±0.157) |
| new_identities_en | style | comparison: pooled midpoint | 0.889±0.157 | 1.000±0.000 | 0.944±0.079 |  |
| new_identities_en | text | product: fitted | 0.924±0.057 | 0.991±0.007 | 0.958±0.027 | 0.074±0.022 (0.500±0.500 / 0.066±0.015) |
| new_identities_en | text | comparison: pooled midpoint | 0.786±0.003 | 0.991±0.004 | 0.888±0.001 |  |
| new_identities_en | relation | product: fitted | 0.851±0.014 | 1.000±0.000 | 0.926±0.007 | 0.115±0.016 (— / 0.115±0.016) |
| new_identities_en | relation | comparison: pooled midpoint | 0.636±0.005 | 1.000±0.000 | 0.818±0.003 |  |
| new_identities_en | landmark | product: fitted | 0.786±0.069 | 1.000±0.000 | 0.893±0.034 | 0.371±0.093 (— / 0.371±0.093) |
| new_identities_en | landmark | comparison: pooled midpoint | 0.663±0.005 | 1.000±0.000 | 0.831±0.003 |  |
| new_identities_en | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities_en | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities_en | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.021±0.029 (— / 0.021±0.029) |
| new_identities_en | anchor | comparison: pooled midpoint | 0.958±0.029 | 1.000±0.000 | 0.979±0.015 |  |
| new_identities_en | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities_en | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities_en | amount | product: fitted | 0.975±0.010 | 1.000±0.000 | 0.987±0.005 | 0.039±0.019 (— / 0.039±0.019) |
| new_identities_en | amount | comparison: pooled midpoint | 0.894±0.026 | 1.000±0.000 | 0.947±0.013 |  |
| new_identities_en | unit | product: fitted | 0.983±0.006 | 1.000±0.000 | 0.992±0.003 | 0.047±0.032 (— / 0.047±0.032) |
| new_identities_en | unit | comparison: pooled midpoint | 0.919±0.042 | 1.000±0.000 | 0.960±0.021 |  |
| new_identities_en | direction | product: fitted | 0.938±0.017 | 1.000±0.000 | 0.969±0.009 | 0.093±0.050 (— / 0.093±0.050) |
| new_identities_en | direction | comparison: pooled midpoint | 0.506±0.035 | 1.000±0.000 | 0.753±0.017 |  |
| new_identities_en | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities_en | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities_en | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities_en | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | source | product: fitted | 0.991±0.013 | 1.000±0.000 | 0.995±0.007 | 0.710±0.115 (— / 0.710±0.115) |
| new_identities_en | source | comparison: pooled midpoint | 0.685±0.069 | 1.000±0.000 | 0.843±0.035 |  |
| new_identities_en | target | product: fitted | 0.954±0.013 | 1.000±0.000 | 0.977±0.007 | 0.399±0.053 (— / 0.399±0.053) |
| new_identities_en | target | comparison: pooled midpoint | 0.694±0.060 | 1.000±0.000 | 0.847±0.030 |  |
| new_identities_en | edge | product: fitted | 0.970±0.021 | 1.000±0.000 | 0.985±0.011 | 0.031±0.022 (— / 0.031±0.022) |
| new_identities_en | edge | comparison: pooled midpoint | 0.909±0.000 | 1.000±0.000 | 0.955±0.000 |  |
| new_identities_en | quantity | product: fitted | — | 1.000±0.000 | — |  |
| new_identities_en | quantity | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| train (sample) | object | product: fitted | 0.997±0.002 | 1.000±0.000 | 0.999±0.001 | 0.018±0.002 (— / 0.018±0.002) |
| train (sample) | color | product: fitted | 0.852±0.052 | 1.000±0.000 | 0.926±0.026 | 0.256±0.095 (— / 0.256±0.095) |
| train (sample) | size | product: fitted | 0.958±0.029 | 0.996±0.003 | 0.977±0.016 | 0.123±0.003 (0.750±0.250 / 0.086±0.027) |
| train (sample) | style | product: fitted | 0.933±0.094 | 0.998±0.002 | 0.966±0.048 | 0.300±0.141 (1.000±0.000 / 0.200±0.163) |
| train (sample) | text | product: fitted | 0.925±0.041 | 0.997±0.002 | 0.961±0.020 | 0.075±0.028 (0.500±0.500 / 0.069±0.028) |
| train (sample) | relation | product: fitted | 0.914±0.015 | 1.000±0.000 | 0.957±0.008 | 0.059±0.034 (— / 0.059±0.034) |
| train (sample) | landmark | product: fitted | 0.871±0.026 | 1.000±0.000 | 0.935±0.013 | 0.124±0.047 (— / 0.124±0.047) |
| train (sample) | region | product: fitted | 0.950±0.000 | 1.000±0.000 | 0.975±0.000 | 0.018±0.025 (— / 0.018±0.025) |
| train (sample) | anchor | product: fitted | 0.985±0.021 | 1.000±0.000 | 0.992±0.011 | 0.061±0.086 (— / 0.061±0.086) |
| train (sample) | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.026±0.036 (— / 0.026±0.036) |
| train (sample) | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.121±0.043 (— / 0.121±0.043) |
| train (sample) | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.056±0.039 (— / 0.056±0.039) |
| train (sample) | layout | product: fitted | 0.979±0.029 | 1.000±0.000 | 0.990±0.015 | 0.062±0.051 (— / 0.062±0.051) |
| train (sample) | pairing | product: fitted | 0.952±0.067 | 1.000±0.000 | 0.976±0.034 | 0.159±0.137 (— / 0.159±0.137) |
| train (sample) | source | product: fitted | 0.935±0.013 | 1.000±0.000 | 0.968±0.007 | 0.436±0.125 (— / 0.436±0.125) |
| train (sample) | target | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.149±0.043 (— / 0.149±0.043) |
| train (sample) | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.017±0.024 (— / 0.017±0.024) |
| train (sample) | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.083±0.059 (— / 0.083±0.059) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
