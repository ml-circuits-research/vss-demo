# REPORT — world `diagram_ro`, legend sha256:d361fbea318b… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
6200 annotated sentences from 4 files; provenance: {'generator': 6200}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/5000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 200 sentences
- heldout_formulations: 200 sentences
- heldout_sentences: 512 sentences
- mixed: 400 sentences
- new_identities: 400 sentences
- train: 4488 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['250', '35', '45', '90', 'analytics', 'broker', 'crawler', 'dashboard', 'gamma_ray', 'indexer', 'ingest', 'irina', 'loyalty', 'notifications', 'payroll', 'recommendations', 'registry', 'returns', 'routing', 'theta', 'tracking', 'vault', 'victor', 'zeta']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
45874 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit 2bae649. Memory curve: runs/5000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 0.001 [rule: fit; pooled midpoint 0.494 (comparison)] (present 0.989, n 493 / absent 0.000, n 107)
- attr_presence:object: threshold 0.539 [rule: fit; pooled midpoint 0.517 (comparison)] (present 0.827, n 183 / absent 0.207, n 310)
- det_presence:object: threshold 0.601 [rule: fit; pooled midpoint 0.617 (comparison)] (present 1.112, n 169 / absent 0.121, n 324)
- presence:color: threshold 0.043 [rule: fit; pooled midpoint 0.242 (comparison)] (present 0.482, n 12 / absent 0.001, n 588)
- presence:size: threshold 0.169 [rule: fit; pooled midpoint 0.323 (comparison)] (present 0.640, n 43 / absent 0.006, n 557)
- presence:style: threshold 0.014 [rule: fit; pooled midpoint 0.084 (comparison)] (present 0.167, n 21 / absent 0.001, n 579)
- presence:text: threshold 0.083 [rule: fit; pooled midpoint 0.260 (comparison)] (present 0.497, n 75 / absent 0.024, n 525)
- presence:relation: threshold 0.201 [rule: fit; pooled midpoint 0.236 (comparison)] (present 0.450, n 74 / absent 0.022, n 526)
- presence:landmark: threshold 0.231 [rule: fit; pooled midpoint 0.302 (comparison)] (present 0.565, n 74 / absent 0.039, n 526)
- presence:region: threshold 0.177 [rule: fit; pooled midpoint 0.345 (comparison)] (present 0.653, n 60 / absent 0.037, n 540)
- presence:anchor: threshold 0.192 [rule: fit; pooled midpoint 0.340 (comparison)] (present 0.676, n 41 / absent 0.004, n 559)
- presence:fraction: threshold 0.303 [rule: fit; pooled midpoint 0.283 (comparison)] (present 0.560, n 26 / absent 0.005, n 574)
- presence:amount: threshold 0.251 [rule: fit; pooled midpoint 0.399 (comparison)] (present 0.807, n 25 / absent -0.008, n 575)
- presence:unit: threshold 0.308 [rule: fit; pooled midpoint 0.453 (comparison)] (present 0.876, n 25 / absent 0.030, n 575)
- presence:direction: threshold 0.113 [rule: fit; pooled midpoint 0.353 (comparison)] (present 0.701, n 27 / absent 0.004, n 573)
- presence:axis: threshold 0.165 [rule: fit; pooled midpoint 0.311 (comparison)] (present 0.621, n 16 / absent 0.001, n 584)
- presence:layout: threshold 0.170 [rule: fit; pooled midpoint 0.411 (comparison)] (present 0.822, n 26 / absent 0.000, n 574)
- presence:pairing: threshold 0.205 [rule: fit; pooled midpoint 0.277 (comparison)] (present 0.557, n 10 / absent -0.004, n 590)
- presence:source: threshold 0.080 [rule: fit; pooled midpoint 0.337 (comparison)] (present 0.673, n 92 / absent 0.000, n 508)
- presence:target: threshold 0.165 [rule: fit; pooled midpoint 0.373 (comparison)] (present 0.744, n 82 / absent 0.001, n 518)
- presence:edge: threshold 0.203 [rule: fit; pooled midpoint 0.363 (comparison)] (present 0.724, n 59 / absent 0.002, n 541)
- presence:quantity: threshold 0.046 [rule: fit; pooled midpoint 0.094 (comparison)] (present 0.186, n 18 / absent 0.002, n 582)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.005, color 0.083, size 0.143, style 0.200, text 0.013, relation 0.167, landmark 0.006, region 0.111, anchor 0.250, fraction 0.333, amount 0.043, unit 0.500, direction 0.167, axis 0.500, layout 0.143, pairing 0.500, source 0.006, target 0.006, edge 0.125, quantity 0.043, predicate 0.019

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 200 of 200)
| axis | accuracy |
|---|---|
| FULL | 0.822±0.005 |
| FULL [depth given] | 0.822±0.005 |
| FULL [depth and negation given] | 0.822±0.005 |
| FULL [presence not decided] | 0.835±0.011 |
| FULL [pooled midpoint (comparison)] | 0.728±0.015 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.014±0.003 |
| presence object: share of true 'present' readings that abstain | 0.014±0.003 |
| presence color: absent read absent | 0.992±0.002 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.020±0.028 |
| presence size: share of true 'present' readings that abstain | 0.020±0.028 |
| presence style: absent read absent | 1.000±0.000 |
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
| role object | 0.947±0.006 |
| head object | 1.000±0.000 |
| lexical order head object | 0.170±0.000 |
| lexical bag head object | 0.130±0.000 |
| occupancy: known filler | 0.960±0.003 |
| role color | 0.992±0.002 |
| head color | 0.992±0.002 |
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
| role text | 0.993±0.006 |
| head text | 0.993±0.006 |
| lexical order head text | 0.895±0.000 |
| lexical bag head text | 0.905±0.000 |
| role relation | 0.987±0.009 |
| head relation | 0.987±0.009 |
| lexical order head relation | 0.865±0.000 |
| lexical bag head relation | 0.865±0.000 |
| role landmark | 0.962±0.002 |
| head landmark | 0.987±0.002 |
| lexical order head landmark | 0.865±0.000 |
| lexical bag head landmark | 0.860±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.935±0.000 |
| lexical bag head region | 0.935±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.930±0.000 |
| lexical bag head anchor | 0.940±0.000 |
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
| role source | 0.933±0.006 |
| head source | 0.955±0.007 |
| lexical order head source | 0.855±0.000 |
| lexical bag head source | 0.855±0.000 |
| role target | 0.968±0.002 |
| head target | 0.998±0.002 |
| lexical order head target | 0.870±0.000 |
| lexical bag head target | 0.870±0.000 |
| role edge | 0.972±0.002 |
| head edge | 0.997±0.002 |
| lexical order head edge | 0.870±0.000 |
| lexical bag head edge | 0.870±0.000 |
| role quantity | 0.997±0.002 |
| head quantity | 0.997±0.002 |
| lexical order head quantity | 0.890±0.000 |
| lexical bag head quantity | 0.890±0.000 |
| heads FULL (model) | 0.912±0.005 |
| heads FULL (lexical order baseline) | 0.020±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.045±0.000 |
| role object [presence not decided] | 0.947±0.006 |
| role color [presence not decided] | 0.985±0.000 |
| role size [presence not decided] | 1.000±0.000 |
| role style [presence not decided] | 1.000±0.000 |
| role text [presence not decided] | 1.000±0.000 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.965±0.000 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 1.000±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 1.000±0.000 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.933±0.006 |
| role target [presence not decided] | 0.967±0.005 |
| role edge [presence not decided] | 0.975±0.000 |
| role quantity [presence not decided] | 1.000±0.000 |
| heads FULL (model) [presence not decided] | 0.928±0.008 |
| role object [pooled midpoint (comparison)] | 0.915±0.004 |
| role color [pooled midpoint (comparison)] | 0.998±0.002 |
| role size [pooled midpoint (comparison)] | 1.000±0.000 |
| role style [pooled midpoint (comparison)] | 0.983±0.006 |
| role text [pooled midpoint (comparison)] | 0.970±0.000 |
| role relation [pooled midpoint (comparison)] | 0.978±0.006 |
| role landmark [pooled midpoint (comparison)] | 0.952±0.002 |
| role region [pooled midpoint (comparison)] | 0.987±0.005 |
| role anchor [pooled midpoint (comparison)] | 0.998±0.002 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 1.000±0.000 |
| role unit [pooled midpoint (comparison)] | 0.998±0.002 |
| role direction [pooled midpoint (comparison)] | 1.000±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.930±0.007 |
| role target [pooled midpoint (comparison)] | 0.965±0.000 |
| role edge [pooled midpoint (comparison)] | 0.967±0.002 |
| role quantity [pooled midpoint (comparison)] | 0.983±0.006 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.808±0.015 |
| presence object: present read present [pooled midpoint (comparison)] | 0.962±0.003 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.998±0.002 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
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
| presence size: absent read absent | 1.000±0.000 |
| presence text: present read present | 0.937±0.059 |
| presence text: share of 'present' readings that abstain | 0.054±0.045 |
| presence text: share of true 'present' readings that abstain | 0.054±0.045 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.714±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence source: present read present | 0.701±0.043 |
| presence source: share of 'present' readings that abstain | 0.603±0.204 |
| presence source: share of true 'present' readings that abstain | 0.603±0.204 |
| determiner identity (outside FULL when the legend excludes it) | 0.951±0.010 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.667±0.043 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.024±0.034 |
| presence fraction: share of true 'present' readings that abstain | 0.024±0.034 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.976±0.034 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.077±0.000 |
| presence target: share of true 'present' readings that abstain | 0.077±0.000 |
| presence edge: present read present | 0.974±0.018 |
| presence edge: share of 'present' readings that abstain | 0.026±0.019 |
| presence edge: share of true 'present' readings that abstain | 0.026±0.019 |
| presence target: present read present [pooled midpoint (comparison)] | 0.962±0.000 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.936±0.018 |
| presence relation: present read present | 0.901±0.070 |
| presence relation: share of 'present' readings that abstain | 0.066±0.048 |
| presence relation: share of true 'present' readings that abstain | 0.066±0.048 |
| presence landmark: present read present | 0.901±0.017 |
| presence landmark: share of 'present' readings that abstain | 0.082±0.034 |
| presence landmark: share of true 'present' readings that abstain | 0.082±0.034 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.000±0.000 |
| presence amount: share of true 'present' readings that abstain | 0.000±0.000 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.042±0.059 |
| presence unit: share of true 'present' readings that abstain | 0.042±0.059 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.840±0.046 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.827±0.017 |
| presence amount: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.958±0.059 |
| presence style: present read present | 0.909±0.074 |
| presence style: share of 'present' readings that abstain | 0.372±0.073 |
| presence style: share of true 'present' readings that abstain | 0.372±0.073 |
| presence style: present read present [pooled midpoint (comparison)] | 0.697±0.113 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.051±0.036 |
| presence region: share of true 'present' readings that abstain | 0.051±0.036 |
| presence region: present read present [pooled midpoint (comparison)] | 0.795±0.073 |
| presence quantity: present read present | 0.970±0.021 |
| presence quantity: share of 'present' readings that abstain | 0.093±0.036 |
| presence quantity: share of true 'present' readings that abstain | 0.093±0.036 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.848±0.057 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.611±0.079 |
| presence color: share of true 'present' readings that abstain | 0.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.074±0.005; status {'ok': 163, 'abstain': 37}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.426 / 0.310 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.934 | 0.328 / 0.204 | 0.99 | 0.060 | 0.006 / 0.006 |
| roles (pooled) | 0.886 | 0.224 / 0.047 | 0.89 | 0.062 | 0.059 / 0.052 |
| role size | 1.000 | 0.220 / 0.088 | 1.00 | 0.000 | 0.000 / 0.000 |
| role text | 1.000 | 0.216 / 0.108 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 1.000 | 0.289 / 0.234 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.483 | 0.024 / 0.000 | 0.14 | 0.034 | 0.379 / 0.483 |
| role anchor | 1.000 | 0.260 / 0.235 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.139 / 0.085 | 0.93 | 0.000 | 0.071 / 0.000 |
| role target | 0.769 | 0.153 / 0.065 | 0.92 | 0.231 | 0.077 / 0.000 |
| role edge | 0.808 | 0.205 / 0.138 | 0.96 | 0.192 | 0.038 / 0.000 |
| role relation | 0.852 | 0.142 / 0.000 | 0.78 | 0.000 | 0.074 / 0.148 |
| role landmark | 0.704 | 0.140 / 0.019 | 0.78 | 0.185 | 0.111 / 0.111 |
| role amount | 1.000 | 0.219 / 0.168 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.248 / 0.196 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 1.000 | 0.076 / 0.017 | 0.73 | 0.000 | 0.273 / 0.000 |
| role region | 1.000 | 0.204 / 0.109 | 1.00 | 0.000 | 0.000 / 0.000 |
| role quantity | 0.955 | 0.102 / 0.043 | 0.86 | 0.000 | 0.091 / 0.045 |
| role color | 1.000 | 0.198 / 0.198 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.355 / 0.318 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.297 / 0.267 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_sentences — catalog candidates (n = 512 of 512)
| axis | accuracy |
|---|---|
| FULL | 0.833±0.014 |
| FULL [depth given] | 0.833±0.014 |
| FULL [depth and negation given] | 0.833±0.014 |
| FULL [pooled midpoint (comparison)] | 0.720±0.018 |
| presence object: present read present | 0.994±0.003 |
| presence object: share of 'present' readings that abstain | 0.008±0.002 |
| presence object: share of true 'present' readings that abstain | 0.008±0.002 |
| presence color: absent read absent | 0.999±0.001 |
| presence size: present read present | 0.917±0.034 |
| presence size: share of 'present' readings that abstain | 0.036±0.051 |
| presence size: share of true 'present' readings that abstain | 0.037±0.052 |
| presence style: absent read absent | 0.997±0.002 |
| presence text: absent read absent | 1.000±0.000 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.987±0.009 |
| presence amount: share of 'present' readings that abstain | 0.013±0.009 |
| presence amount: share of true 'present' readings that abstain | 0.013±0.009 |
| presence unit: present read present | 0.993±0.009 |
| presence unit: share of 'present' readings that abstain | 0.020±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.020±0.000 |
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
| role object | 0.958±0.002 |
| head object | 0.993±0.003 |
| lexical order head object | 0.141±0.000 |
| lexical bag head object | 0.166±0.000 |
| occupancy: known filler | 0.959±0.012 |
| role color | 0.999±0.001 |
| head color | 0.999±0.001 |
| lexical order head color | 0.947±0.000 |
| lexical bag head color | 0.947±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.993±0.002 |
| head size | 0.993±0.002 |
| lexical order head size | 0.945±0.000 |
| lexical bag head size | 0.963±0.000 |
| role style | 0.997±0.002 |
| head style | 0.997±0.002 |
| lexical order head style | 0.996±0.000 |
| lexical bag head style | 0.996±0.000 |
| role text | 0.990±0.002 |
| head text | 0.990±0.002 |
| lexical order head text | 0.859±0.000 |
| lexical bag head text | 0.887±0.000 |
| role relation | 0.980±0.010 |
| head relation | 0.980±0.010 |
| lexical order head relation | 0.871±0.000 |
| lexical bag head relation | 0.883±0.000 |
| role landmark | 0.954±0.004 |
| head landmark | 0.988±0.006 |
| lexical order head landmark | 0.871±0.000 |
| lexical bag head landmark | 0.854±0.000 |
| role region | 0.988±0.002 |
| head region | 0.988±0.002 |
| lexical order head region | 0.926±0.000 |
| lexical bag head region | 0.932±0.000 |
| role anchor | 0.998±0.002 |
| head anchor | 0.998±0.002 |
| lexical order head anchor | 0.957±0.000 |
| lexical bag head anchor | 0.969±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 0.986±0.000 |
| role amount | 0.999±0.001 |
| head amount | 0.999±0.001 |
| lexical order head amount | 0.900±0.000 |
| lexical bag head amount | 0.928±0.000 |
| role unit | 0.999±0.001 |
| head unit | 0.999±0.001 |
| lexical order head unit | 0.900±0.000 |
| lexical bag head unit | 0.928±0.000 |
| role direction | 0.999±0.001 |
| head direction | 0.999±0.001 |
| lexical order head direction | 0.941±0.000 |
| lexical bag head direction | 0.941±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.979±0.000 |
| lexical bag head axis | 0.979±0.000 |
| role layout | 0.999±0.001 |
| head layout | 0.999±0.001 |
| lexical order head layout | 0.941±0.000 |
| lexical bag head layout | 0.943±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 0.973±0.000 |
| lexical bag head pairing | 0.977±0.000 |
| role source | 0.955±0.009 |
| head source | 0.984±0.011 |
| lexical order head source | 0.873±0.000 |
| lexical bag head source | 0.877±0.000 |
| role target | 0.988±0.001 |
| head target | 0.999±0.001 |
| lexical order head target | 0.900±0.000 |
| lexical bag head target | 0.906±0.000 |
| role edge | 0.997±0.001 |
| head edge | 0.999±0.001 |
| lexical order head edge | 0.943±0.000 |
| lexical bag head edge | 0.943±0.000 |
| role quantity | 0.999±0.001 |
| head quantity | 0.999±0.001 |
| lexical order head quantity | 0.969±0.000 |
| lexical bag head quantity | 0.980±0.000 |
| heads FULL (model) | 0.915±0.022 |
| heads FULL (lexical order baseline) | 0.012±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.053±0.000 |
| role object [pooled midpoint (comparison)] | 0.902±0.005 |
| role color [pooled midpoint (comparison)] | 0.995±0.001 |
| role size [pooled midpoint (comparison)] | 0.992±0.002 |
| role style [pooled midpoint (comparison)] | 0.999±0.001 |
| role text [pooled midpoint (comparison)] | 0.973±0.002 |
| role relation [pooled midpoint (comparison)] | 0.967±0.009 |
| role landmark [pooled midpoint (comparison)] | 0.942±0.003 |
| role region [pooled midpoint (comparison)] | 0.975±0.002 |
| role anchor [pooled midpoint (comparison)] | 0.996±0.000 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.992±0.003 |
| role unit [pooled midpoint (comparison)] | 0.994±0.003 |
| role direction [pooled midpoint (comparison)] | 0.990±0.001 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 0.993±0.002 |
| role pairing [pooled midpoint (comparison)] | 0.997±0.001 |
| role source [pooled midpoint (comparison)] | 0.942±0.010 |
| role target [pooled midpoint (comparison)] | 0.976±0.001 |
| role edge [pooled midpoint (comparison)] | 0.994±0.000 |
| role quantity [pooled midpoint (comparison)] | 0.997±0.002 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.783±0.022 |
| presence object: present read present [pooled midpoint (comparison)] | 0.944±0.002 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.869±0.034 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.998±0.001 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.922±0.028 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.941±0.028 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence object: absent read absent | 1.000±0.000 |
| presence size: absent read absent | 0.998±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.877±0.088 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.065±0.018 |
| presence target: share of true 'present' readings that abstain | 0.065±0.018 |
| presence edge: present read present | 0.977±0.016 |
| presence edge: share of 'present' readings that abstain | 0.023±0.017 |
| presence edge: share of true 'present' readings that abstain | 0.023±0.017 |
| determiner identity (outside FULL when the legend excludes it) | 0.951±0.009 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.733±0.096 |
| presence target: present read present [pooled midpoint (comparison)] | 0.850±0.018 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.931±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 0.833±0.033 |
| presence region: share of 'present' readings that abstain | 0.052±0.013 |
| presence region: share of true 'present' readings that abstain | 0.052±0.013 |
| presence region: present read present [pooled midpoint (comparison)] | 0.667±0.025 |
| presence anchor: present read present | 0.955±0.037 |
| presence anchor: share of 'present' readings that abstain | 0.016±0.022 |
| presence anchor: share of true 'present' readings that abstain | 0.016±0.022 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.909±0.000 |
| presence layout: present read present | 0.978±0.016 |
| presence layout: share of 'present' readings that abstain | 0.011±0.016 |
| presence layout: share of true 'present' readings that abstain | 0.011±0.016 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.878±0.031 |
| presence direction: present read present | 0.989±0.016 |
| presence direction: share of 'present' readings that abstain | 0.068±0.029 |
| presence direction: share of true 'present' readings that abstain | 0.068±0.029 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.851±0.016 |
| presence text: present read present | 0.926±0.017 |
| presence text: share of 'present' readings that abstain | 0.065±0.026 |
| presence text: share of true 'present' readings that abstain | 0.065±0.026 |
| presence text: present read present [pooled midpoint (comparison)] | 0.826±0.018 |
| presence relation: present read present | 0.858±0.087 |
| presence landmark: present read present | 0.914±0.050 |
| presence landmark: share of 'present' readings that abstain | 0.101±0.025 |
| presence landmark: share of true 'present' readings that abstain | 0.101±0.025 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.805±0.079 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.810±0.034 |
| presence size: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.048±0.067 |
| presence pairing: share of true 'present' readings that abstain | 0.048±0.067 |
| presence source: share of 'present' readings that abstain | 0.494±0.097 |
| presence source: share of true 'present' readings that abstain | 0.494±0.097 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.905±0.034 |
| presence relation: share of 'present' readings that abstain | 0.129±0.041 |
| presence relation: share of true 'present' readings that abstain | 0.129±0.041 |
| presence quantity: present read present | 0.979±0.029 |
| presence quantity: share of 'present' readings that abstain | 0.043±0.030 |
| presence quantity: share of true 'present' readings that abstain | 0.043±0.030 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.938±0.051 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.060±0.045 |
| presence color: share of true 'present' readings that abstain | 0.037±0.030 |
| presence color: present read present [pooled midpoint (comparison)] | 0.914±0.017 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.583±0.118 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.333±0.236 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.084±0.015; status {'ok': 428, 'abstain': 84}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.430 / 0.331 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.952 | 0.323 / 0.205 | 0.99 | 0.043 | 0.007 / 0.005 |
| roles (pooled) | 0.896 | 0.233 / 0.039 | 0.89 | 0.038 | 0.044 / 0.066 |
| role size | 0.893 | 0.194 / 0.079 | 0.89 | 0.000 | 0.000 / 0.107 |
| role amount | 1.000 | 0.192 / 0.110 | 0.98 | 0.000 | 0.020 / 0.000 |
| role unit | 1.000 | 0.247 / 0.153 | 0.98 | 0.000 | 0.020 / 0.000 |
| role source | 0.569 | 0.033 / 0.000 | 0.32 | 0.077 | 0.323 / 0.354 |
| role target | 0.882 | 0.165 / 0.083 | 0.92 | 0.098 | 0.059 / 0.020 |
| role edge | 0.931 | 0.225 / 0.189 | 0.97 | 0.034 | 0.000 / 0.034 |
| role axis | 1.000 | 0.294 / 0.261 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 0.842 | 0.174 / 0.000 | 0.79 | 0.000 | 0.053 / 0.158 |
| role anchor | 0.909 | 0.238 / 0.119 | 0.91 | 0.000 | 0.000 / 0.091 |
| role layout | 0.967 | 0.265 / 0.193 | 0.97 | 0.000 | 0.000 / 0.033 |
| role direction | 0.967 | 0.202 / 0.047 | 0.87 | 0.000 | 0.100 / 0.033 |
| role text | 0.944 | 0.214 / 0.073 | 0.92 | 0.000 | 0.028 / 0.056 |
| role relation | 0.758 | 0.110 / 0.000 | 0.62 | 0.000 | 0.136 / 0.242 |
| role landmark | 0.606 | 0.124 / 0.000 | 0.74 | 0.182 | 0.045 / 0.212 |
| role pairing | 1.000 | 0.248 / 0.091 | 1.00 | 0.000 | 0.000 / 0.000 |
| role quantity | 1.000 | 0.149 / 0.092 | 0.94 | 0.000 | 0.062 / 0.000 |
| role color | 1.000 | 0.203 / 0.129 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.211 / 0.163 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 1.000 | 0.097 / 0.067 | 1.00 | 0.000 | 0.000 / 0.000 |

### mixed — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.828±0.018 |
| FULL [depth given] | 0.828±0.018 |
| FULL [depth and negation given] | 0.828±0.018 |
| FULL [pooled midpoint (comparison)] | 0.698±0.007 |
| presence object: present read present | 0.999±0.001 |
| presence object: share of 'present' readings that abstain | 0.005±0.003 |
| presence object: share of true 'present' readings that abstain | 0.005±0.003 |
| presence color: absent read absent | 0.993±0.006 |
| presence size: absent read absent | 0.999±0.001 |
| presence style: absent read absent | 1.000±0.000 |
| presence text: absent read absent | 1.000±0.000 |
| presence relation: present read present | 0.854±0.054 |
| presence relation: share of 'present' readings that abstain | 0.099±0.033 |
| presence relation: share of true 'present' readings that abstain | 0.099±0.033 |
| presence landmark: present read present | 0.911±0.047 |
| presence landmark: share of 'present' readings that abstain | 0.036±0.027 |
| presence landmark: share of true 'present' readings that abstain | 0.036±0.027 |
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
| structure (depth, negation) | 0.996±0.003 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.996±0.003 |
| event type (synonym table) | 0.996±0.003 |
| role object | 0.953±0.001 |
| head object | 0.995±0.004 |
| lexical order head object | 0.120±0.000 |
| lexical bag head object | 0.250±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.919±0.008 |
| occupancy: known filler | 0.959±0.009 |
| role color | 0.993±0.005 |
| head color | 0.993±0.005 |
| lexical order head color | 0.958±0.000 |
| lexical bag head color | 0.960±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.995±0.002 |
| head size | 0.995±0.002 |
| lexical order head size | 0.965±0.000 |
| lexical bag head size | 0.980±0.000 |
| role style | 0.999±0.001 |
| head style | 0.999±0.001 |
| lexical order head style | 0.975±0.000 |
| lexical bag head style | 0.978±0.000 |
| role text | 0.998±0.002 |
| head text | 0.998±0.002 |
| lexical order head text | 0.877±0.000 |
| lexical bag head text | 0.892±0.000 |
| role relation | 0.979±0.006 |
| head relation | 0.979±0.006 |
| lexical order head relation | 0.868±0.000 |
| lexical bag head relation | 0.877±0.000 |
| role landmark | 0.959±0.005 |
| head landmark | 0.987±0.005 |
| lexical order head landmark | 0.868±0.000 |
| lexical bag head landmark | 0.858±0.000 |
| role region | 0.989±0.005 |
| head region | 0.989±0.005 |
| lexical order head region | 0.912±0.000 |
| lexical bag head region | 0.917±0.000 |
| role anchor | 0.993±0.005 |
| head anchor | 0.993±0.005 |
| lexical order head anchor | 0.905±0.000 |
| lexical bag head anchor | 0.927±0.000 |
| role fraction | 0.998±0.004 |
| head fraction | 0.998±0.004 |
| lexical order head fraction | 0.958±0.000 |
| lexical bag head fraction | 0.963±0.000 |
| role amount | 0.998±0.000 |
| head amount | 0.998±0.000 |
| lexical order head amount | 0.922±0.000 |
| lexical bag head amount | 0.935±0.000 |
| role unit | 0.999±0.001 |
| head unit | 0.999±0.001 |
| lexical order head unit | 0.922±0.000 |
| lexical bag head unit | 0.932±0.000 |
| role direction | 0.998±0.000 |
| head direction | 0.998±0.000 |
| lexical order head direction | 0.948±0.000 |
| lexical bag head direction | 0.950±0.000 |
| role axis | 0.999±0.001 |
| head axis | 0.999±0.001 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.965±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.932±0.000 |
| lexical bag head layout | 0.935±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 0.960±0.000 |
| lexical bag head pairing | 0.965±0.000 |
| role source | 0.952±0.006 |
| head source | 0.988±0.006 |
| lexical order head source | 0.895±0.000 |
| lexical bag head source | 0.897±0.000 |
| role target | 0.986±0.001 |
| head target | 0.998±0.002 |
| lexical order head target | 0.935±0.000 |
| lexical bag head target | 0.940±0.000 |
| role edge | 0.993±0.002 |
| head edge | 0.998±0.001 |
| lexical order head edge | 0.958±0.000 |
| lexical bag head edge | 0.958±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.985±0.000 |
| lexical bag head quantity | 0.988±0.000 |
| heads FULL (model) | 0.922±0.016 |
| heads FULL (lexical order baseline) | 0.013±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.105±0.000 |
| role object [pooled midpoint (comparison)] | 0.893±0.002 |
| role color [pooled midpoint (comparison)] | 0.990±0.002 |
| role size [pooled midpoint (comparison)] | 0.992±0.003 |
| role style [pooled midpoint (comparison)] | 0.995±0.004 |
| role text [pooled midpoint (comparison)] | 0.988±0.001 |
| role relation [pooled midpoint (comparison)] | 0.969±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.942±0.001 |
| role region [pooled midpoint (comparison)] | 0.973±0.005 |
| role anchor [pooled midpoint (comparison)] | 0.971±0.002 |
| role fraction [pooled midpoint (comparison)] | 0.998±0.001 |
| role amount [pooled midpoint (comparison)] | 0.995±0.000 |
| role unit [pooled midpoint (comparison)] | 0.997±0.001 |
| role direction [pooled midpoint (comparison)] | 0.992±0.002 |
| role axis [pooled midpoint (comparison)] | 0.998±0.000 |
| role layout [pooled midpoint (comparison)] | 0.998±0.000 |
| role pairing [pooled midpoint (comparison)] | 0.992±0.003 |
| role source [pooled midpoint (comparison)] | 0.947±0.008 |
| role target [pooled midpoint (comparison)] | 0.983±0.002 |
| role edge [pooled midpoint (comparison)] | 0.987±0.001 |
| role quantity [pooled midpoint (comparison)] | 0.998±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.767±0.005 |
| presence object: present read present [pooled midpoint (comparison)] | 0.953±0.004 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.813±0.034 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.807±0.019 |
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
| presence region: present read present | 0.876±0.054 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 0.716±0.060 |
| presence anchor: present read present | 0.921±0.057 |
| presence anchor: share of 'present' readings that abstain | 0.058±0.050 |
| presence anchor: share of true 'present' readings that abstain | 0.058±0.050 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.693±0.025 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.963±0.000 |
| presence amount: present read present | 0.968±0.000 |
| presence amount: share of 'present' readings that abstain | 0.022±0.016 |
| presence amount: share of true 'present' readings that abstain | 0.022±0.016 |
| presence unit: present read present | 0.989±0.015 |
| presence unit: share of 'present' readings that abstain | 0.011±0.015 |
| presence unit: share of true 'present' readings that abstain | 0.011±0.015 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.935±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.957±0.015 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.889±0.049 |
| presence source: share of 'present' readings that abstain | 0.533±0.105 |
| presence source: share of true 'present' readings that abstain | 0.533±0.105 |
| presence target: present read present | 0.962±0.031 |
| presence target: share of 'present' readings that abstain | 0.052±0.037 |
| presence target: share of true 'present' readings that abstain | 0.052±0.037 |
| presence edge: present read present | 0.961±0.028 |
| presence edge: share of 'present' readings that abstain | 0.081±0.026 |
| presence edge: share of true 'present' readings that abstain | 0.081±0.026 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.748±0.075 |
| presence target: present read present [pooled midpoint (comparison)] | 0.923±0.054 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.804±0.028 |
| presence color: present read present | 0.980±0.028 |
| presence color: share of 'present' readings that abstain | 0.226±0.120 |
| presence color: share of true 'present' readings that abstain | 0.120±0.048 |
| presence color: present read present [pooled midpoint (comparison)] | 0.765±0.048 |
| presence text: present read present | 0.986±0.019 |
| presence text: share of 'present' readings that abstain | 0.042±0.018 |
| presence text: share of true 'present' readings that abstain | 0.042±0.018 |
| presence text: present read present [pooled midpoint (comparison)] | 0.905±0.010 |
| presence region: share of 'present' readings that abstain | 0.085±0.052 |
| presence region: share of true 'present' readings that abstain | 0.085±0.052 |
| presence fraction: present read present | 0.941±0.083 |
| presence fraction: share of 'present' readings that abstain | 0.083±0.025 |
| presence fraction: share of true 'present' readings that abstain | 0.083±0.025 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.961±0.028 |
| presence axis: present read present | 0.978±0.031 |
| presence axis: share of 'present' readings that abstain | 0.044±0.031 |
| presence axis: share of true 'present' readings that abstain | 0.044±0.031 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.933±0.000 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.111±0.079 |
| presence quantity: share of true 'present' readings that abstain | 0.111±0.079 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.889±0.079 |
| presence direction: present read present | 0.984±0.022 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.883±0.047 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.062±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.062±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.844±0.083 |
| presence style: present read present | 0.967±0.047 |
| presence style: share of 'present' readings that abstain | 0.381±0.209 |
| presence style: share of true 'present' readings that abstain | 0.381±0.209 |
| presence style: present read present [pooled midpoint (comparison)] | 0.800±0.141 |
| presence size: present read present | 0.881±0.034 |
| presence size: share of 'present' readings that abstain | 0.051±0.036 |
| presence size: share of true 'present' readings that abstain | 0.026±0.036 |
| presence size: present read present [pooled midpoint (comparison)] | 0.821±0.096 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.086±0.009; status {'abstain': 69, 'ok': 331}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.424 / 0.337 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.946 | 0.323 / 0.192 | 1.00 | 0.051 | 0.000 / 0.003 |
| roles (pooled) | 0.890 | 0.233 / 0.044 | 0.89 | 0.047 | 0.045 / 0.063 |
| role relation | 0.792 | 0.106 / 0.000 | 0.68 | 0.000 | 0.113 / 0.208 |
| role landmark | 0.642 | 0.137 / 0.000 | 0.79 | 0.208 | 0.057 / 0.151 |
| role region | 0.914 | 0.191 / 0.024 | 0.86 | 0.000 | 0.057 / 0.086 |
| role anchor | 0.868 | 0.173 / 0.000 | 0.76 | 0.000 | 0.105 / 0.132 |
| role layout | 1.000 | 0.257 / 0.173 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 0.968 | 0.198 / 0.130 | 0.97 | 0.000 | 0.000 / 0.032 |
| role unit | 1.000 | 0.260 / 0.171 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.476 | 0.032 / 0.000 | 0.29 | 0.143 | 0.333 / 0.381 |
| role target | 0.769 | 0.157 / 0.045 | 0.88 | 0.154 | 0.038 / 0.077 |
| role edge | 0.824 | 0.179 / 0.064 | 0.88 | 0.118 | 0.059 / 0.059 |
| role color | 0.941 | 0.178 / 0.035 | 0.82 | 0.000 | 0.118 / 0.059 |
| role text | 1.000 | 0.228 / 0.168 | 0.96 | 0.000 | 0.041 / 0.000 |
| role fraction | 0.824 | 0.151 / 0.000 | 0.76 | 0.000 | 0.059 / 0.176 |
| role axis | 1.000 | 0.284 / 0.180 | 0.93 | 0.000 | 0.067 / 0.000 |
| role quantity | 1.000 | 0.148 / 0.097 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.952 | 0.214 / 0.145 | 0.95 | 0.000 | 0.000 / 0.048 |
| role pairing | 1.000 | 0.203 / 0.070 | 0.94 | 0.000 | 0.062 / 0.000 |
| role style | 1.000 | 0.079 / 0.050 | 0.90 | 0.000 | 0.100 / 0.000 |
| role size | 0.857 | 0.180 / 0.021 | 0.86 | 0.000 | 0.000 / 0.143 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.868±0.002 |
| FULL [depth given] | 0.868±0.002 |
| FULL [depth and negation given] | 0.868±0.002 |
| FULL [pooled midpoint (comparison)] | 0.750±0.005 |
| presence object: present read present | 0.991±0.001 |
| presence object: share of 'present' readings that abstain | 0.010±0.003 |
| presence object: share of true 'present' readings that abstain | 0.010±0.003 |
| presence color: absent read absent | 0.999±0.001 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 0.997±0.002 |
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
| role object | 0.971±0.002 |
| head object | 0.992±0.001 |
| lexical order head object | 0.072±0.000 |
| lexical bag head object | 0.338±0.000 |
| occupancy: unknown filler | 0.961±0.008 |
| role color | 0.999±0.001 |
| head color | 0.999±0.001 |
| lexical order head color | 0.980±0.000 |
| lexical bag head color | 0.980±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.996±0.001 |
| head size | 0.996±0.001 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.965±0.000 |
| role style | 0.997±0.002 |
| head style | 0.997±0.002 |
| lexical order head style | 0.998±0.000 |
| lexical bag head style | 0.998±0.000 |
| role text | 0.973±0.012 |
| head text | 0.973±0.012 |
| lexical order head text | 0.542±0.000 |
| lexical bag head text | 0.685±0.000 |
| role relation | 0.983±0.012 |
| head relation | 0.983±0.012 |
| lexical order head relation | 0.815±0.000 |
| lexical bag head relation | 0.820±0.000 |
| role landmark | 0.955±0.004 |
| head landmark | 0.983±0.006 |
| lexical order head landmark | 0.815±0.000 |
| lexical bag head landmark | 0.802±0.000 |
| role region | 0.993±0.001 |
| head region | 0.993±0.001 |
| lexical order head region | 0.943±0.000 |
| lexical bag head region | 0.948±0.000 |
| role anchor | 0.994±0.004 |
| head anchor | 0.994±0.004 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 0.965±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 0.988±0.000 |
| role amount | 0.998±0.000 |
| head amount | 0.998±0.000 |
| lexical order head amount | 0.777±0.000 |
| lexical bag head amount | 0.845±0.000 |
| role unit | 0.999±0.001 |
| head unit | 0.999±0.001 |
| lexical order head unit | 0.777±0.000 |
| lexical bag head unit | 0.835±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
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
| role source | 0.991±0.001 |
| head source | 0.998±0.001 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.935±0.000 |
| role target | 0.992±0.001 |
| head target | 0.999±0.001 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.932±0.000 |
| role edge | 0.995±0.000 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.953±0.000 |
| lexical bag head edge | 0.953±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.913±0.006 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.113±0.000 |
| role object [pooled midpoint (comparison)] | 0.927±0.002 |
| role color [pooled midpoint (comparison)] | 0.993±0.002 |
| role size [pooled midpoint (comparison)] | 0.991±0.001 |
| role style [pooled midpoint (comparison)] | 0.998±0.001 |
| role text [pooled midpoint (comparison)] | 0.929±0.004 |
| role relation [pooled midpoint (comparison)] | 0.967±0.002 |
| role landmark [pooled midpoint (comparison)] | 0.934±0.001 |
| role region [pooled midpoint (comparison)] | 0.978±0.001 |
| role anchor [pooled midpoint (comparison)] | 0.988±0.002 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.997±0.001 |
| role unit [pooled midpoint (comparison)] | 0.996±0.001 |
| role direction [pooled midpoint (comparison)] | 0.994±0.001 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.980±0.004 |
| role target [pooled midpoint (comparison)] | 0.982±0.002 |
| role edge [pooled midpoint (comparison)] | 0.995±0.000 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.782±0.004 |
| presence object: present read present [pooled midpoint (comparison)] | 0.957±0.003 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.998±0.001 |
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
| presence anchor: present read present | 0.877±0.089 |
| presence anchor: share of 'present' readings that abstain | 0.059±0.051 |
| presence anchor: share of true 'present' readings that abstain | 0.059±0.051 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.042±0.059 |
| presence fraction: share of true 'present' readings that abstain | 0.042±0.059 |
| occupancy: known filler | 0.968±0.014 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.796±0.052 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present | 0.989±0.000 |
| presence amount: share of 'present' readings that abstain | 0.004±0.005 |
| presence amount: share of true 'present' readings that abstain | 0.004±0.005 |
| presence unit: present read present | 0.996±0.005 |
| presence unit: share of 'present' readings that abstain | 0.007±0.005 |
| presence unit: share of true 'present' readings that abstain | 0.007±0.005 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.043±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.043±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.985±0.005 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.981±0.005 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.899±0.020 |
| presence region: present read present | 0.884±0.020 |
| presence region: share of 'present' readings that abstain | 0.098±0.082 |
| presence region: share of true 'present' readings that abstain | 0.098±0.082 |
| presence region: present read present [pooled midpoint (comparison)] | 0.623±0.020 |
| presence text: present read present | 0.940±0.027 |
| presence text: share of 'present' readings that abstain | 0.045±0.009 |
| presence text: share of true 'present' readings that abstain | 0.045±0.009 |
| determiner identity (outside FULL when the legend excludes it) | 0.996±0.003 |
| presence text: present read present [pooled midpoint (comparison)] | 0.856±0.008 |
| presence relation: present read present | 0.905±0.067 |
| presence relation: share of 'present' readings that abstain | 0.083±0.026 |
| presence relation: share of true 'present' readings that abstain | 0.083±0.026 |
| presence landmark: present read present | 0.910±0.034 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.847±0.011 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.787±0.007 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.977±0.016 |
| presence source: share of 'present' readings that abstain | 0.610±0.157 |
| presence source: share of true 'present' readings that abstain | 0.610±0.157 |
| presence target: present read present | 0.989±0.016 |
| presence target: share of 'present' readings that abstain | 0.058±0.017 |
| presence target: share of true 'present' readings that abstain | 0.058±0.017 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.793±0.049 |
| presence target: present read present [pooled midpoint (comparison)] | 0.839±0.059 |
| presence landmark: share of 'present' readings that abstain | 0.056±0.038 |
| presence landmark: share of true 'present' readings that abstain | 0.056±0.038 |
| presence size: present read present | 0.938±0.017 |
| presence size: share of 'present' readings that abstain | 0.052±0.017 |
| presence size: share of true 'present' readings that abstain | 0.052±0.017 |
| presence size: present read present [pooled midpoint (comparison)] | 0.897±0.018 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.116±0.091 |
| presence color: share of true 'present' readings that abstain | 0.083±0.059 |
| presence color: present read present [pooled midpoint (comparison)] | 0.625±0.102 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.444±0.314 |
| presence style: share of true 'present' readings that abstain | 0.000±0.000 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| presence edge: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.074±0.002; status {'ok': 323, 'abstain': 77}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.408 / 0.303 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.970 | 0.298 / 0.157 | 0.98 | 0.019 | 0.008 / 0.011 |
| roles (pooled) | 0.937 | 0.221 / 0.060 | 0.91 | 0.021 | 0.049 / 0.042 |
| role anchor | 0.789 | 0.182 / 0.000 | 0.79 | 0.000 | 0.000 / 0.211 |
| role fraction | 1.000 | 0.137 / 0.059 | 0.88 | 0.000 | 0.125 / 0.000 |
| role amount | 0.989 | 0.186 / 0.126 | 0.99 | 0.000 | 0.000 / 0.011 |
| role unit | 1.000 | 0.273 / 0.208 | 0.99 | 0.000 | 0.011 / 0.000 |
| role direction | 1.000 | 0.184 / 0.143 | 0.96 | 0.000 | 0.043 / 0.000 |
| role region | 0.870 | 0.161 / 0.020 | 0.87 | 0.000 | 0.000 / 0.130 |
| role text | 0.962 | 0.219 / 0.063 | 0.91 | 0.000 | 0.055 / 0.038 |
| role relation | 0.865 | 0.128 / 0.000 | 0.78 | 0.000 | 0.081 / 0.135 |
| role landmark | 0.730 | 0.110 / 0.000 | 0.77 | 0.135 | 0.095 / 0.135 |
| role source | 0.897 | 0.038 / 0.006 | 0.24 | 0.000 | 0.655 / 0.103 |
| role target | 0.862 | 0.109 / 0.050 | 0.90 | 0.103 | 0.069 / 0.034 |
| role size | 0.926 | 0.166 / 0.088 | 0.89 | 0.000 | 0.037 / 0.074 |
| role color | 1.000 | 0.145 / 0.054 | 0.88 | 0.000 | 0.125 / 0.000 |
| role style | 1.000 | 0.094 / 0.094 | 1.00 | 0.000 | 0.000 / 0.000 |
| role edge | 0.895 | 0.209 / 0.165 | 1.00 | 0.105 | 0.000 / 0.000 |

### train (sample) — catalog candidates (n = 300 of 4488)
| axis | accuracy |
|---|---|
| FULL | 0.869±0.013 |
| FULL [depth given] | 0.869±0.013 |
| FULL [depth and negation given] | 0.869±0.013 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.004±0.000 |
| presence object: share of true 'present' readings that abstain | 0.004±0.000 |
| presence color: absent read absent | 0.999±0.002 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 1.000±0.000 |
| presence text: present read present | 0.961±0.014 |
| presence text: share of 'present' readings that abstain | 0.040±0.014 |
| presence text: share of true 'present' readings that abstain | 0.041±0.014 |
| presence relation: present read present | 0.869±0.038 |
| presence relation: share of 'present' readings that abstain | 0.095±0.065 |
| presence relation: share of true 'present' readings that abstain | 0.095±0.065 |
| presence landmark: present read present | 0.939±0.043 |
| presence landmark: share of 'present' readings that abstain | 0.045±0.043 |
| presence landmark: share of true 'present' readings that abstain | 0.045±0.043 |
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
| role object | 0.952±0.004 |
| head object | 1.000±0.000 |
| lexical order head object | 0.143±0.000 |
| lexical bag head object | 0.253±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.955±0.007 |
| occupancy: known filler | 0.977±0.008 |
| role color | 0.999±0.002 |
| head color | 0.999±0.002 |
| lexical order head color | 0.967±0.000 |
| lexical bag head color | 0.963±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.993±0.003 |
| head size | 0.993±0.003 |
| lexical order head size | 0.930±0.000 |
| lexical bag head size | 0.953±0.000 |
| role style | 1.000±0.000 |
| head style | 1.000±0.000 |
| lexical order head style | 0.983±0.000 |
| lexical bag head style | 0.983±0.000 |
| role text | 0.994±0.002 |
| head text | 0.994±0.002 |
| lexical order head text | 0.887±0.000 |
| lexical bag head text | 0.993±0.000 |
| role relation | 0.986±0.004 |
| head relation | 0.986±0.004 |
| lexical order head relation | 0.890±0.000 |
| lexical bag head relation | 0.950±0.000 |
| role landmark | 0.970±0.005 |
| head landmark | 0.993±0.005 |
| lexical order head landmark | 0.890±0.000 |
| lexical bag head landmark | 0.903±0.000 |
| role region | 0.997±0.003 |
| head region | 0.997±0.003 |
| lexical order head region | 0.927±0.000 |
| lexical bag head region | 0.987±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.947±0.000 |
| lexical bag head anchor | 1.000±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.960±0.000 |
| lexical bag head fraction | 1.000±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.950±0.000 |
| lexical bag head amount | 1.000±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.950±0.000 |
| lexical bag head unit | 0.993±0.000 |
| role direction | 0.999±0.002 |
| head direction | 0.999±0.002 |
| lexical order head direction | 0.910±0.000 |
| lexical bag head direction | 0.933±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.963±0.000 |
| role layout | 0.998±0.002 |
| head layout | 0.998±0.002 |
| lexical order head layout | 0.960±0.000 |
| lexical bag head layout | 0.970±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 0.977±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.967±0.005 |
| head source | 0.993±0.005 |
| lexical order head source | 0.897±0.000 |
| lexical bag head source | 0.920±0.000 |
| role target | 0.986±0.002 |
| head target | 0.999±0.002 |
| lexical order head target | 0.920±0.000 |
| lexical bag head target | 0.930±0.000 |
| role edge | 0.993±0.000 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.953±0.000 |
| lexical bag head edge | 0.953±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.970±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.957±0.014 |
| heads FULL (lexical order baseline) | 0.017±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.107±0.000 |
| presence size: present read present | 0.905±0.039 |
| presence size: share of 'present' readings that abstain | 0.017±0.024 |
| presence size: share of true 'present' readings that abstain | 0.017±0.024 |
| presence text: absent read absent | 0.999±0.002 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present | 0.955±0.037 |
| presence region: share of 'present' readings that abstain | 0.049±0.041 |
| presence region: share of true 'present' readings that abstain | 0.049±0.041 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.037±0.052 |
| presence quantity: share of true 'present' readings that abstain | 0.037±0.052 |
| presence object: absent read absent | 1.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.048±0.067 |
| presence pairing: share of true 'present' readings that abstain | 0.048±0.067 |
| presence source: present read present | 0.935±0.046 |
| presence source: share of 'present' readings that abstain | 0.336±0.057 |
| presence source: share of true 'present' readings that abstain | 0.336±0.057 |
| presence layout: present read present | 0.944±0.039 |
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present | 0.988±0.017 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.127±0.039 |
| presence color: share of true 'present' readings that abstain | 0.100±0.000 |
| presence target: present read present | 0.986±0.020 |
| presence target: share of 'present' readings that abstain | 0.000±0.000 |
| presence target: share of true 'present' readings that abstain | 0.000±0.000 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.400±0.163 |
| presence style: share of true 'present' readings that abstain | 0.400±0.163 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.000±0.000 |
| presence amount: share of true 'present' readings that abstain | 0.000±0.000 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.052±0.009; status {'ok': 268, 'abstain': 32}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.445 / 0.345 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.938 | 0.341 / 0.227 | 1.00 | 0.062 | 0.004 / 0.000 |
| roles (pooled) | 0.910 | 0.253 / 0.067 | 0.94 | 0.056 | 0.028 / 0.035 |
| role text | 0.971 | 0.247 / 0.146 | 0.94 | 0.000 | 0.029 / 0.029 |
| role relation | 0.879 | 0.123 / 0.008 | 0.85 | 0.000 | 0.030 / 0.121 |
| role landmark | 0.667 | 0.149 / 0.007 | 0.79 | 0.212 | 0.091 / 0.121 |
| role size | 0.857 | 0.174 / 0.000 | 0.86 | 0.000 | 0.000 / 0.143 |
| role anchor | 1.000 | 0.266 / 0.164 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.198 / 0.080 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 0.955 | 0.203 / 0.136 | 0.91 | 0.000 | 0.045 / 0.045 |
| role quantity | 1.000 | 0.159 / 0.059 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 1.000 | 0.154 / 0.057 | 0.86 | 0.000 | 0.143 / 0.000 |
| role source | 0.645 | 0.053 / 0.009 | 0.58 | 0.161 | 0.226 / 0.194 |
| role layout | 0.917 | 0.273 / 0.246 | 0.92 | 0.000 | 0.000 / 0.083 |
| role direction | 1.000 | 0.240 / 0.143 | 1.00 | 0.000 | 0.000 / 0.000 |
| role color | 1.000 | 0.153 / 0.075 | 0.90 | 0.000 | 0.100 / 0.000 |
| role target | 0.792 | 0.170 / 0.104 | 0.96 | 0.167 | 0.000 / 0.042 |
| role style | 1.000 | 0.106 / 0.052 | 0.80 | 0.000 | 0.200 / 0.000 |
| role amount | 1.000 | 0.207 / 0.175 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.274 / 0.201 | 1.00 | 0.000 | 0.000 / 0.000 |
| role edge | 0.857 | 0.239 / 0.208 | 1.00 | 0.143 | 0.000 / 0.000 |
| role axis | 1.000 | 0.320 / 0.258 | 1.00 | 0.000 | 0.000 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 COMPONENT=0.98 PAIR=0.93 not=0.91 UNIT=0.90 EDGE=0.90 DIR=0.82 ANCHOR=0.66 AXIS=0.62 front=0.54 REGION=0.53 dimensiunea=0.52 back=0.51 FILLER=0.50 VERB=0.48 REL=0.47 LABEL=0.43 flow=0.39 LAYOUT=0.39 apart=0.26 PRON=0.15 CONN=0.12 din=0.12 do=0.12 the=0.12 together=0.12 unknown=0.12 are=0.12 is=0.09 never=0.09 care=0.09 lui=0.04 pe=0.03 INTRO=0.03 COLOR=0.03 evenly=0.03 SIZE=0.03 STYLE=0.02 color=0.02 FRACTION=0.01 spre=0.01 DEM=0.01 cu=0.01 de=0.01 la=0.01 NUM=0.00 QUANT=0.00 a=0.00

## What is weak, what to add
- heldout_formulations: FULL 0.825
- heldout_formulations: presence object: share of 'present' readings that abstain 0.012
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.012
- heldout_formulations: presence size: share of 'present' readings that abstain 0.000
- heldout_formulations: presence size: share of true 'present' readings that abstain 0.000
- heldout_formulations: heads FULL (lexical order baseline) 0.020
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.045
- heldout_formulations: FULL [depth given] 0.825
- heldout_formulations: FULL [depth and negation given] 0.825
- heldout_formulations: FULL [presence not decided] 0.830
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.715
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.800
- heldout_formulations: presence text: share of 'present' readings that abstain 0.000
- heldout_formulations: presence text: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence text: present read present [pooled midpoint (comparison)] 0.714
- heldout_formulations: presence pairing: share of 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence source: present read present 0.655
- heldout_formulations: presence source: share of 'present' readings that abstain 0.789
- heldout_formulations: presence source: share of true 'present' readings that abstain 0.789
- heldout_formulations: presence source: present read present [pooled midpoint (comparison)] 0.621
- heldout_formulations: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of 'present' readings that abstain 0.071
- heldout_formulations: presence fraction: share of true 'present' readings that abstain 0.071
- heldout_formulations: presence target: share of 'present' readings that abstain 0.077
- heldout_formulations: presence target: share of true 'present' readings that abstain 0.077
- heldout_formulations: presence edge: share of 'present' readings that abstain 0.038
- heldout_formulations: presence edge: share of true 'present' readings that abstain 0.038
- heldout_formulations: presence relation: present read present 0.852
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.087
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.087
- heldout_formulations: presence landmark: present read present 0.889
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.125
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.125
- heldout_formulations: presence amount: share of 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence relation: present read present [pooled midpoint (comparison)] 0.778
- heldout_formulations: presence landmark: present read present [pooled midpoint (comparison)] 0.815
- heldout_formulations: presence style: share of 'present' readings that abstain 0.273
- heldout_formulations: presence style: share of true 'present' readings that abstain 0.273
- heldout_formulations: presence style: present read present [pooled midpoint (comparison)] 0.727
- heldout_formulations: presence region: share of 'present' readings that abstain 0.000
- heldout_formulations: presence region: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence region: present read present [pooled midpoint (comparison)] 0.846
- heldout_formulations: presence quantity: share of 'present' readings that abstain 0.095
- heldout_formulations: presence quantity: share of true 'present' readings that abstain 0.095
- heldout_formulations: presence quantity: present read present [pooled midpoint (comparison)] 0.864
- heldout_formulations: presence color: share of 'present' readings that abstain 0.500
- heldout_formulations: presence color: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence axis: share of 'present' readings that abstain 0.000
- heldout_formulations: presence axis: share of true 'present' readings that abstain 0.000
- heldout_sentences: FULL 0.822
- heldout_sentences: presence object: share of 'present' readings that abstain 0.009
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.009
- heldout_sentences: presence size: present read present 0.893
- heldout_sentences: presence size: share of 'present' readings that abstain 0.000
- heldout_sentences: presence size: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence amount: share of 'present' readings that abstain 0.020
- heldout_sentences: presence amount: share of true 'present' readings that abstain 0.020
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.020
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.020
- heldout_sentences: heads FULL (model) 0.893
- heldout_sentences: heads FULL (lexical order baseline) 0.012
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.053
- heldout_sentences: FULL [depth given] 0.822
- heldout_sentences: FULL [depth and negation given] 0.822
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.695
- heldout_sentences: role object [pooled midpoint (comparison)] 0.896
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.752
- heldout_sentences: presence size: present read present [pooled midpoint (comparison)] 0.821
- heldout_sentences: presence amount: present read present [pooled midpoint (comparison)] 0.882
- heldout_sentences: presence source: present read present 0.769
- heldout_sentences: presence target: share of 'present' readings that abstain 0.078
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.078
- heldout_sentences: presence edge: share of 'present' readings that abstain 0.000
- heldout_sentences: presence edge: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.631
- heldout_sentences: presence target: present read present [pooled midpoint (comparison)] 0.863
- heldout_sentences: presence axis: share of 'present' readings that abstain 0.000
- heldout_sentences: presence axis: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence region: present read present 0.842
- heldout_sentences: presence region: share of 'present' readings that abstain 0.062
- heldout_sentences: presence region: share of true 'present' readings that abstain 0.062
- heldout_sentences: presence region: present read present [pooled midpoint (comparison)] 0.684
- heldout_sentences: presence anchor: share of 'present' readings that abstain 0.000
- heldout_sentences: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence layout: share of 'present' readings that abstain 0.000
- heldout_sentences: presence layout: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence layout: present read present [pooled midpoint (comparison)] 0.833
- heldout_sentences: presence direction: share of 'present' readings that abstain 0.103
- heldout_sentences: presence direction: share of true 'present' readings that abstain 0.103
- heldout_sentences: presence direction: present read present [pooled midpoint (comparison)] 0.862
- heldout_sentences: presence text: share of 'present' readings that abstain 0.029
- heldout_sentences: presence text: share of true 'present' readings that abstain 0.029
- heldout_sentences: presence text: present read present [pooled midpoint (comparison)] 0.845
- heldout_sentences: presence relation: present read present 0.758
- heldout_sentences: presence landmark: present read present 0.848
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.125
- heldout_sentences: presence landmark: share of true 'present' readings that abstain 0.125
- heldout_sentences: presence relation: present read present [pooled midpoint (comparison)] 0.694
- heldout_sentences: presence landmark: present read present [pooled midpoint (comparison)] 0.774
- heldout_sentences: presence size: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: presence pairing: share of 'present' readings that abstain 0.000
- heldout_sentences: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence source: share of 'present' readings that abstain 0.580
- heldout_sentences: presence source: share of true 'present' readings that abstain 0.580
- heldout_sentences: presence relation: share of 'present' readings that abstain 0.180
- heldout_sentences: presence relation: share of true 'present' readings that abstain 0.180
- heldout_sentences: presence quantity: share of 'present' readings that abstain 0.062
- heldout_sentences: presence quantity: share of true 'present' readings that abstain 0.062
- heldout_sentences: presence color: share of 'present' readings that abstain 0.000
- heldout_sentences: presence color: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence style: share of 'present' readings that abstain 0.500
- heldout_sentences: presence style: share of true 'present' readings that abstain 0.000
- mixed: FULL 0.823
- mixed: presence object: share of 'present' readings that abstain 0.003
- mixed: presence object: share of true 'present' readings that abstain 0.003
- mixed: presence relation: present read present 0.792
- mixed: presence relation: share of 'present' readings that abstain 0.143
- mixed: presence relation: share of true 'present' readings that abstain 0.143
- mixed: presence landmark: present read present 0.849
- mixed: presence landmark: share of 'present' readings that abstain 0.067
- mixed: presence landmark: share of true 'present' readings that abstain 0.067
- mixed: heads FULL (lexical order baseline) 0.013
- mixed: heads FULL (lexical bag baseline, trained on the same training rows) 0.105
- mixed: FULL [depth given] 0.823
- mixed: FULL [depth and negation given] 0.823
- mixed: FULL [pooled midpoint (comparison)] 0.708
- mixed: role object [pooled midpoint (comparison)] 0.895
- mixed: heads FULL (model) [pooled midpoint (comparison)] 0.770
- mixed: presence relation: present read present [pooled midpoint (comparison)] 0.780
- mixed: presence landmark: present read present [pooled midpoint (comparison)] 0.820
- mixed: presence region: present read present [pooled midpoint (comparison)] 0.794
- mixed: presence anchor: present read present 0.868
- mixed: presence anchor: share of 'present' readings that abstain 0.121
- mixed: presence anchor: share of true 'present' readings that abstain 0.121
- mixed: presence anchor: present read present [pooled midpoint (comparison)] 0.658
- mixed: presence layout: share of 'present' readings that abstain 0.000
- mixed: presence layout: share of true 'present' readings that abstain 0.000
- mixed: presence amount: share of 'present' readings that abstain 0.000
- mixed: presence amount: share of true 'present' readings that abstain 0.000
- mixed: presence unit: share of 'present' readings that abstain 0.000
- mixed: presence unit: share of true 'present' readings that abstain 0.000
- mixed: presence source: present read present 0.833
- mixed: presence source: share of 'present' readings that abstain 0.657
- mixed: presence source: share of true 'present' readings that abstain 0.657
- mixed: presence target: share of 'present' readings that abstain 0.080
- mixed: presence target: share of true 'present' readings that abstain 0.080
- mixed: presence edge: share of 'present' readings that abstain 0.062
- mixed: presence edge: share of true 'present' readings that abstain 0.062
- mixed: presence source: present read present [pooled midpoint (comparison)] 0.683
- mixed: presence edge: present read present [pooled midpoint (comparison)] 0.765
- mixed: presence color: share of 'present' readings that abstain 0.176
- mixed: presence color: share of true 'present' readings that abstain 0.125
- mixed: presence color: present read present [pooled midpoint (comparison)] 0.765
- mixed: presence text: share of 'present' readings that abstain 0.041
- mixed: presence text: share of true 'present' readings that abstain 0.041
- mixed: presence region: share of 'present' readings that abstain 0.062
- mixed: presence region: share of true 'present' readings that abstain 0.062
- mixed: presence fraction: present read present 0.824
- mixed: presence fraction: share of 'present' readings that abstain 0.071
- mixed: presence fraction: share of true 'present' readings that abstain 0.071
- mixed: presence axis: share of 'present' readings that abstain 0.067
- mixed: presence axis: share of true 'present' readings that abstain 0.067
- mixed: presence quantity: share of 'present' readings that abstain 0.000
- mixed: presence quantity: share of true 'present' readings that abstain 0.000
- mixed: presence direction: share of 'present' readings that abstain 0.000
- mixed: presence direction: share of true 'present' readings that abstain 0.000
- mixed: presence direction: present read present [pooled midpoint (comparison)] 0.850
- mixed: presence pairing: share of 'present' readings that abstain 0.062
- mixed: presence pairing: share of true 'present' readings that abstain 0.062
- mixed: presence style: share of 'present' readings that abstain 0.100
- mixed: presence style: share of true 'present' readings that abstain 0.100
- mixed: presence size: present read present 0.857
- mixed: presence size: share of 'present' readings that abstain 0.000
- mixed: presence size: share of true 'present' readings that abstain 0.000
- new_identities: FULL 0.865
- new_identities: presence object: share of 'present' readings that abstain 0.008
- new_identities: presence object: share of true 'present' readings that abstain 0.008
- new_identities: heads FULL (lexical order baseline) 0.000
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.113
- new_identities: FULL [depth given] 0.865
- new_identities: FULL [depth and negation given] 0.865
- new_identities: FULL [pooled midpoint (comparison)] 0.745
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.780
- new_identities: presence anchor: present read present 0.789
- new_identities: presence anchor: share of 'present' readings that abstain 0.000
- new_identities: presence anchor: share of true 'present' readings that abstain 0.000
- new_identities: presence fraction: share of 'present' readings that abstain 0.125
- new_identities: presence fraction: share of true 'present' readings that abstain 0.125
- new_identities: presence anchor: present read present [pooled midpoint (comparison)] 0.722
- new_identities: presence amount: share of 'present' readings that abstain 0.000
- new_identities: presence amount: share of true 'present' readings that abstain 0.000
- new_identities: presence unit: share of 'present' readings that abstain 0.011
- new_identities: presence unit: share of true 'present' readings that abstain 0.011
- new_identities: presence direction: share of 'present' readings that abstain 0.043
- new_identities: presence direction: share of true 'present' readings that abstain 0.043
- new_identities: presence region: present read present 0.870
- new_identities: presence region: share of 'present' readings that abstain 0.000
- new_identities: presence region: share of true 'present' readings that abstain 0.000
- new_identities: presence region: present read present [pooled midpoint (comparison)] 0.609
- new_identities: presence text: share of 'present' readings that abstain 0.057
- new_identities: presence text: share of true 'present' readings that abstain 0.057
- new_identities: presence text: present read present [pooled midpoint (comparison)] 0.867
- new_identities: presence relation: present read present 0.865
- new_identities: presence relation: share of 'present' readings that abstain 0.094
- new_identities: presence relation: share of true 'present' readings that abstain 0.094
- new_identities: presence landmark: present read present 0.865
- new_identities: presence relation: present read present [pooled midpoint (comparison)] 0.833
- new_identities: presence landmark: present read present [pooled midpoint (comparison)] 0.778
- new_identities: presence source: share of 'present' readings that abstain 0.759
- new_identities: presence source: share of true 'present' readings that abstain 0.759
- new_identities: presence target: share of 'present' readings that abstain 0.071
- new_identities: presence target: share of true 'present' readings that abstain 0.071
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.828
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.862
- new_identities: presence landmark: share of 'present' readings that abstain 0.109
- new_identities: presence landmark: share of true 'present' readings that abstain 0.109
- new_identities: presence size: share of 'present' readings that abstain 0.040
- new_identities: presence size: share of true 'present' readings that abstain 0.040
- new_identities: presence size: present read present [pooled midpoint (comparison)] 0.885
- new_identities: presence color: share of 'present' readings that abstain 0.222
- new_identities: presence color: share of true 'present' readings that abstain 0.125
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.500
- new_identities: presence style: share of 'present' readings that abstain 0.667
- new_identities: presence style: share of true 'present' readings that abstain 0.000
- new_identities: presence edge: share of 'present' readings that abstain 0.000
- new_identities: presence edge: share of true 'present' readings that abstain 0.000
- train (sample): FULL 0.860
- train (sample): presence object: share of 'present' readings that abstain 0.004
- train (sample): presence object: share of true 'present' readings that abstain 0.004
- train (sample): presence text: share of 'present' readings that abstain 0.029
- train (sample): presence text: share of true 'present' readings that abstain 0.030
- train (sample): presence relation: present read present 0.879
- train (sample): presence relation: share of 'present' readings that abstain 0.034
- train (sample): presence relation: share of true 'present' readings that abstain 0.034
- train (sample): presence landmark: present read present 0.879
- train (sample): presence landmark: share of 'present' readings that abstain 0.103
- train (sample): presence landmark: share of true 'present' readings that abstain 0.103
- train (sample): heads FULL (lexical order baseline) 0.017
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.107
- train (sample): FULL [depth given] 0.860
- train (sample): FULL [depth and negation given] 0.860
- train (sample): presence size: present read present 0.857
- train (sample): presence size: share of 'present' readings that abstain 0.000
- train (sample): presence size: share of true 'present' readings that abstain 0.000
- train (sample): presence anchor: share of 'present' readings that abstain 0.000
- train (sample): presence anchor: share of true 'present' readings that abstain 0.000
- train (sample): presence fraction: share of 'present' readings that abstain 0.000
- train (sample): presence fraction: share of true 'present' readings that abstain 0.000
- train (sample): presence region: share of 'present' readings that abstain 0.048
- train (sample): presence region: share of true 'present' readings that abstain 0.048
- train (sample): presence quantity: share of 'present' readings that abstain 0.000
- train (sample): presence quantity: share of true 'present' readings that abstain 0.000
- train (sample): presence pairing: share of 'present' readings that abstain 0.143
- train (sample): presence pairing: share of true 'present' readings that abstain 0.143
- train (sample): presence source: share of 'present' readings that abstain 0.357
- train (sample): presence source: share of true 'present' readings that abstain 0.357
- train (sample): presence layout: share of 'present' readings that abstain 0.000
- train (sample): presence layout: share of true 'present' readings that abstain 0.000
- train (sample): presence direction: share of 'present' readings that abstain 0.000
- train (sample): presence direction: share of true 'present' readings that abstain 0.000
- train (sample): presence color: share of 'present' readings that abstain 0.100
- train (sample): presence color: share of true 'present' readings that abstain 0.100
- train (sample): presence target: share of 'present' readings that abstain 0.000
- train (sample): presence target: share of true 'present' readings that abstain 0.000
- train (sample): presence style: share of 'present' readings that abstain 0.200
- train (sample): presence style: share of true 'present' readings that abstain 0.200
- train (sample): presence amount: share of 'present' readings that abstain 0.000
- train (sample): presence amount: share of true 'present' readings that abstain 0.000
- train (sample): presence unit: share of 'present' readings that abstain 0.000
- train (sample): presence unit: share of true 'present' readings that abstain 0.000
- train (sample): presence edge: share of 'present' readings that abstain 0.000
- train (sample): presence edge: share of true 'present' readings that abstain 0.000
- train (sample): presence axis: share of 'present' readings that abstain 0.000
- train (sample): presence axis: share of true 'present' readings that abstain 0.000
- train (sample): presence text: share of FALSE 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_sentences: `ai putea sa atasezi QUANT COMPONENT PAIR .` FULL 0.000 (n 2)
- heldout_formulations: `vreau sa uniti QUANT COMPONENT STYLE PAIR .` FULL 0.000 (n 1)
- heldout_formulations: `nu redimensionati COMPONENT COLOR la dimensiunea SIZE va rog .` FULL 0.000 (n 1)
- heldout_formulations: `okay deci radiaza QUANT COMPONENT care nu sunt COLOR .` FULL 0.000 (n 1)
- heldout_formulations: `as_vrea sa conectezi COMPONENT STYLE si COMPONENT STYLE cu a EDGE .` FULL 0.000 (n 1)
- heldout_formulations: `vreau sa legati QUANT COMPONENT PAIR .` FULL 0.000 (n 1)
- heldout_sentences: `hai sa unim COMPONENT cu COMPONENT cu a EDGE` FULL 0.000 (n 1)
- heldout_sentences: `te rog conecteaza COMPONENT si COMPONENT cu a EDGE .` FULL 0.000 (n 1)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role size | role style | role text | role relation | role landmark | role region | role anchor | role fraction | role amount | role unit | role direction | role axis | role layout | role pairing | role source | role target | role edge | role quantity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.912±0.005 | 0.822±0.005 | 0.947±0.006 | 0.992±0.002 | 1.000±0.000 | 0.995±0.004 | 0.993±0.006 | 0.987±0.009 | 0.962±0.002 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.933±0.006 | 0.968±0.002 | 0.972±0.002 | 0.997±0.002 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.808±0.015 | 0.728±0.015 | 0.915±0.004 | 0.998±0.002 | 1.000±0.000 | 0.983±0.006 | 0.970±0.000 | 0.978±0.006 | 0.952±0.002 | 0.987±0.005 | 0.998±0.002 | 1.000±0.000 | 1.000±0.000 | 0.998±0.002 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.930±0.007 | 0.965±0.000 | 0.967±0.002 | 0.983±0.006 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.928±0.008 | 0.835±0.011 | 0.947±0.006 | 0.985±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.965±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.933±0.006 | 0.967±0.005 | 0.975±0.000 | 1.000±0.000 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.014±0.003 (— / 0.014±0.003) |
| heldout_formulations | object | comparison: pooled midpoint | 0.962±0.003 | 1.000±0.000 | 0.981±0.001 |  |
| heldout_formulations | color | product: fitted | 1.000±0.000 | 0.992±0.002 | 0.996±0.001 | 0.611±0.079 (1.000±0.000 / 0.000±0.000) |
| heldout_formulations | color | comparison: pooled midpoint | 1.000±0.000 | 0.998±0.002 | 0.999±0.001 |  |
| heldout_formulations | size | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.020±0.028 (— / 0.020±0.028) |
| heldout_formulations | size | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | style | product: fitted | 0.909±0.074 | 1.000±0.000 | 0.955±0.037 | 0.372±0.073 (— / 0.372±0.073) |
| heldout_formulations | style | comparison: pooled midpoint | 0.697±0.113 | 1.000±0.000 | 0.848±0.057 |  |
| heldout_formulations | text | product: fitted | 0.937±0.059 | 1.000±0.000 | 0.968±0.030 | 0.054±0.045 (— / 0.054±0.045) |
| heldout_formulations | text | comparison: pooled midpoint | 0.714±0.000 | 1.000±0.000 | 0.857±0.000 |  |
| heldout_formulations | relation | product: fitted | 0.901±0.070 | 1.000±0.000 | 0.951±0.035 | 0.066±0.048 (— / 0.066±0.048) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.840±0.046 | 1.000±0.000 | 0.920±0.023 |  |
| heldout_formulations | landmark | product: fitted | 0.901±0.017 | 1.000±0.000 | 0.951±0.009 | 0.082±0.034 (— / 0.082±0.034) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.827±0.017 | 1.000±0.000 | 0.914±0.009 |  |
| heldout_formulations | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.051±0.036 (— / 0.051±0.036) |
| heldout_formulations | region | comparison: pooled midpoint | 0.795±0.073 | 1.000±0.000 | 0.897±0.036 |  |
| heldout_formulations | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | anchor | comparison: pooled midpoint | 0.976±0.034 | 1.000±0.000 | 0.988±0.017 |  |
| heldout_formulations | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.024±0.034 (— / 0.024±0.034) |
| heldout_formulations | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | amount | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.042±0.059 (— / 0.042±0.059) |
| heldout_formulations | unit | comparison: pooled midpoint | 0.958±0.059 | 1.000±0.000 | 0.979±0.029 |  |
| heldout_formulations | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | direction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | layout | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | source | product: fitted | 0.701±0.043 | 1.000±0.000 | 0.851±0.022 | 0.603±0.204 (— / 0.603±0.204) |
| heldout_formulations | source | comparison: pooled midpoint | 0.667±0.043 | 1.000±0.000 | 0.833±0.022 |  |
| heldout_formulations | target | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.077±0.000 (— / 0.077±0.000) |
| heldout_formulations | target | comparison: pooled midpoint | 0.962±0.000 | 1.000±0.000 | 0.981±0.000 |  |
| heldout_formulations | edge | product: fitted | 0.974±0.018 | 1.000±0.000 | 0.987±0.009 | 0.026±0.019 (— / 0.026±0.019) |
| heldout_formulations | edge | comparison: pooled midpoint | 0.936±0.018 | 1.000±0.000 | 0.968±0.009 |  |
| heldout_formulations | quantity | product: fitted | 0.970±0.021 | 1.000±0.000 | 0.985±0.011 | 0.093±0.036 (— / 0.093±0.036) |
| heldout_formulations | quantity | comparison: pooled midpoint | 0.848±0.057 | 1.000±0.000 | 0.924±0.028 |  |
| heldout_sentences | object | product: fitted | 0.994±0.003 | 1.000±0.000 | 0.997±0.001 | 0.008±0.002 (— / 0.008±0.002) |
| heldout_sentences | object | comparison: pooled midpoint | 0.944±0.002 | 1.000±0.000 | 0.972±0.001 |  |
| heldout_sentences | color | product: fitted | 1.000±0.000 | 0.999±0.001 | 0.999±0.000 | 0.060±0.045 (1.000±0.000 / 0.037±0.030) |
| heldout_sentences | color | comparison: pooled midpoint | 0.914±0.017 | 1.000±0.000 | 0.957±0.009 |  |
| heldout_sentences | size | product: fitted | 0.917±0.034 | 0.998±0.000 | 0.957±0.017 | 0.036±0.051 (0.000±0.000 / 0.037±0.052) |
| heldout_sentences | size | comparison: pooled midpoint | 0.869±0.034 | 0.999±0.001 | 0.934±0.017 |  |
| heldout_sentences | style | product: fitted | 1.000±0.000 | 0.997±0.002 | 0.999±0.001 | 0.583±0.118 (1.000±0.000 / 0.333±0.236) |
| heldout_sentences | style | comparison: pooled midpoint | 1.000±0.000 | 0.999±0.001 | 1.000±0.000 |  |
| heldout_sentences | text | product: fitted | 0.926±0.017 | 1.000±0.000 | 0.963±0.009 | 0.065±0.026 (— / 0.065±0.026) |
| heldout_sentences | text | comparison: pooled midpoint | 0.826±0.018 | 0.998±0.001 | 0.912±0.008 |  |
| heldout_sentences | relation | product: fitted | 0.858±0.087 | 1.000±0.000 | 0.929±0.043 | 0.129±0.041 (— / 0.129±0.041) |
| heldout_sentences | relation | comparison: pooled midpoint | 0.805±0.079 | 1.000±0.000 | 0.903±0.039 |  |
| heldout_sentences | landmark | product: fitted | 0.914±0.050 | 1.000±0.000 | 0.957±0.025 | 0.101±0.025 (— / 0.101±0.025) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.810±0.034 | 1.000±0.000 | 0.905±0.017 |  |
| heldout_sentences | region | product: fitted | 0.833±0.033 | 1.000±0.000 | 0.917±0.016 | 0.052±0.013 (— / 0.052±0.013) |
| heldout_sentences | region | comparison: pooled midpoint | 0.667±0.025 | 1.000±0.000 | 0.833±0.012 |  |
| heldout_sentences | anchor | product: fitted | 0.955±0.037 | 1.000±0.000 | 0.977±0.019 | 0.016±0.022 (— / 0.016±0.022) |
| heldout_sentences | anchor | comparison: pooled midpoint | 0.909±0.000 | 1.000±0.000 | 0.955±0.000 |  |
| heldout_sentences | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | amount | product: fitted | 0.987±0.009 | 1.000±0.000 | 0.993±0.005 | 0.013±0.009 (— / 0.013±0.009) |
| heldout_sentences | amount | comparison: pooled midpoint | 0.922±0.028 | 1.000±0.000 | 0.961±0.014 |  |
| heldout_sentences | unit | product: fitted | 0.993±0.009 | 1.000±0.000 | 0.997±0.005 | 0.020±0.000 (— / 0.020±0.000) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.941±0.028 | 1.000±0.000 | 0.971±0.014 |  |
| heldout_sentences | direction | product: fitted | 0.989±0.016 | 1.000±0.000 | 0.994±0.008 | 0.068±0.029 (— / 0.068±0.029) |
| heldout_sentences | direction | comparison: pooled midpoint | 0.851±0.016 | 1.000±0.000 | 0.925±0.008 |  |
| heldout_sentences | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | layout | product: fitted | 0.978±0.016 | 1.000±0.000 | 0.989±0.008 | 0.011±0.016 (— / 0.011±0.016) |
| heldout_sentences | layout | comparison: pooled midpoint | 0.878±0.031 | 1.000±0.000 | 0.939±0.016 |  |
| heldout_sentences | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.048±0.067 (— / 0.048±0.067) |
| heldout_sentences | pairing | comparison: pooled midpoint | 0.905±0.034 | 1.000±0.000 | 0.952±0.017 |  |
| heldout_sentences | source | product: fitted | 0.877±0.088 | 1.000±0.000 | 0.938±0.044 | 0.494±0.097 (— / 0.494±0.097) |
| heldout_sentences | source | comparison: pooled midpoint | 0.733±0.096 | 1.000±0.000 | 0.867±0.048 |  |
| heldout_sentences | target | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.065±0.018 (— / 0.065±0.018) |
| heldout_sentences | target | comparison: pooled midpoint | 0.850±0.018 | 1.000±0.000 | 0.925±0.009 |  |
| heldout_sentences | edge | product: fitted | 0.977±0.016 | 1.000±0.000 | 0.989±0.008 | 0.023±0.017 (— / 0.023±0.017) |
| heldout_sentences | edge | comparison: pooled midpoint | 0.931±0.000 | 1.000±0.000 | 0.966±0.000 |  |
| heldout_sentences | quantity | product: fitted | 0.979±0.029 | 1.000±0.000 | 0.990±0.015 | 0.043±0.030 (— / 0.043±0.030) |
| heldout_sentences | quantity | comparison: pooled midpoint | 0.938±0.051 | 0.999±0.001 | 0.968±0.026 |  |
| mixed | object | product: fitted | 0.999±0.001 | 1.000±0.000 | 1.000±0.001 | 0.005±0.003 (— / 0.005±0.003) |
| mixed | object | comparison: pooled midpoint | 0.953±0.004 | 1.000±0.000 | 0.976±0.002 |  |
| mixed | color | product: fitted | 0.980±0.028 | 0.993±0.006 | 0.987±0.013 | 0.226±0.120 (1.000±0.000 / 0.120±0.048) |
| mixed | color | comparison: pooled midpoint | 0.765±0.048 | 1.000±0.000 | 0.882±0.024 |  |
| mixed | size | product: fitted | 0.881±0.034 | 0.999±0.001 | 0.940±0.017 | 0.051±0.036 (1.000 / 0.026±0.036) |
| mixed | size | comparison: pooled midpoint | 0.821±0.096 | 1.000±0.000 | 0.910±0.048 |  |
| mixed | style | product: fitted | 0.967±0.047 | 1.000±0.000 | 0.983±0.024 | 0.381±0.209 (— / 0.381±0.209) |
| mixed | style | comparison: pooled midpoint | 0.800±0.141 | 1.000±0.000 | 0.900±0.071 |  |
| mixed | text | product: fitted | 0.986±0.019 | 1.000±0.000 | 0.993±0.010 | 0.042±0.018 (— / 0.042±0.018) |
| mixed | text | comparison: pooled midpoint | 0.905±0.010 | 1.000±0.000 | 0.952±0.005 |  |
| mixed | relation | product: fitted | 0.854±0.054 | 1.000±0.000 | 0.927±0.027 | 0.099±0.033 (— / 0.099±0.033) |
| mixed | relation | comparison: pooled midpoint | 0.813±0.034 | 1.000±0.000 | 0.907±0.017 |  |
| mixed | landmark | product: fitted | 0.911±0.047 | 1.000±0.000 | 0.956±0.023 | 0.036±0.027 (— / 0.036±0.027) |
| mixed | landmark | comparison: pooled midpoint | 0.807±0.019 | 1.000±0.000 | 0.903±0.009 |  |
| mixed | region | product: fitted | 0.876±0.054 | 1.000±0.000 | 0.938±0.027 | 0.085±0.052 (— / 0.085±0.052) |
| mixed | region | comparison: pooled midpoint | 0.716±0.060 | 1.000±0.000 | 0.858±0.030 |  |
| mixed | anchor | product: fitted | 0.921±0.057 | 1.000±0.000 | 0.961±0.028 | 0.058±0.050 (— / 0.058±0.050) |
| mixed | anchor | comparison: pooled midpoint | 0.693±0.025 | 1.000±0.000 | 0.846±0.012 |  |
| mixed | fraction | product: fitted | 0.941±0.083 | 1.000±0.000 | 0.971±0.042 | 0.083±0.025 (— / 0.083±0.025) |
| mixed | fraction | comparison: pooled midpoint | 0.961±0.028 | 1.000±0.000 | 0.980±0.014 |  |
| mixed | amount | product: fitted | 0.968±0.000 | 1.000±0.000 | 0.984±0.000 | 0.022±0.016 (— / 0.022±0.016) |
| mixed | amount | comparison: pooled midpoint | 0.935±0.000 | 1.000±0.000 | 0.968±0.000 |  |
| mixed | unit | product: fitted | 0.989±0.015 | 1.000±0.000 | 0.995±0.008 | 0.011±0.015 (— / 0.011±0.015) |
| mixed | unit | comparison: pooled midpoint | 0.957±0.015 | 1.000±0.000 | 0.978±0.008 |  |
| mixed | direction | product: fitted | 0.984±0.022 | 1.000±0.000 | 0.992±0.011 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | direction | comparison: pooled midpoint | 0.883±0.047 | 1.000±0.000 | 0.942±0.024 |  |
| mixed | axis | product: fitted | 0.978±0.031 | 1.000±0.000 | 0.989±0.016 | 0.044±0.031 (— / 0.044±0.031) |
| mixed | axis | comparison: pooled midpoint | 0.933±0.000 | 1.000±0.000 | 0.967±0.000 |  |
| mixed | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | layout | comparison: pooled midpoint | 0.963±0.000 | 1.000±0.000 | 0.981±0.000 |  |
| mixed | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.062±0.000 (— / 0.062±0.000) |
| mixed | pairing | comparison: pooled midpoint | 0.844±0.083 | 1.000±0.000 | 0.922±0.042 |  |
| mixed | source | product: fitted | 0.889±0.049 | 1.000±0.000 | 0.944±0.024 | 0.533±0.105 (— / 0.533±0.105) |
| mixed | source | comparison: pooled midpoint | 0.748±0.075 | 1.000±0.000 | 0.874±0.038 |  |
| mixed | target | product: fitted | 0.962±0.031 | 1.000±0.000 | 0.981±0.016 | 0.052±0.037 (— / 0.052±0.037) |
| mixed | target | comparison: pooled midpoint | 0.923±0.054 | 1.000±0.000 | 0.962±0.027 |  |
| mixed | edge | product: fitted | 0.961±0.028 | 1.000±0.000 | 0.980±0.014 | 0.081±0.026 (— / 0.081±0.026) |
| mixed | edge | comparison: pooled midpoint | 0.804±0.028 | 1.000±0.000 | 0.902±0.014 |  |
| mixed | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.111±0.079 (— / 0.111±0.079) |
| mixed | quantity | comparison: pooled midpoint | 0.889±0.079 | 1.000±0.000 | 0.944±0.039 |  |
| new_identities | object | product: fitted | 0.991±0.001 | 1.000±0.000 | 0.996±0.001 | 0.010±0.003 (— / 0.010±0.003) |
| new_identities | object | comparison: pooled midpoint | 0.957±0.003 | 1.000±0.000 | 0.979±0.002 |  |
| new_identities | color | product: fitted | 1.000±0.000 | 0.999±0.001 | 1.000±0.001 | 0.116±0.091 (1.000 / 0.083±0.059) |
| new_identities | color | comparison: pooled midpoint | 0.625±0.102 | 1.000±0.000 | 0.812±0.051 |  |
| new_identities | size | product: fitted | 0.938±0.017 | 1.000±0.000 | 0.969±0.009 | 0.052±0.017 (— / 0.052±0.017) |
| new_identities | size | comparison: pooled midpoint | 0.897±0.018 | 1.000±0.000 | 0.949±0.009 |  |
| new_identities | style | product: fitted | 1.000±0.000 | 0.997±0.002 | 0.998±0.001 | 0.444±0.314 (1.000±0.000 / 0.000±0.000) |
| new_identities | style | comparison: pooled midpoint | 1.000±0.000 | 0.998±0.001 | 0.999±0.001 |  |
| new_identities | text | product: fitted | 0.940±0.027 | 1.000±0.000 | 0.970±0.014 | 0.045±0.009 (— / 0.045±0.009) |
| new_identities | text | comparison: pooled midpoint | 0.856±0.008 | 1.000±0.000 | 0.928±0.004 |  |
| new_identities | relation | product: fitted | 0.905±0.067 | 1.000±0.000 | 0.953±0.034 | 0.083±0.026 (— / 0.083±0.026) |
| new_identities | relation | comparison: pooled midpoint | 0.847±0.011 | 1.000±0.000 | 0.924±0.006 |  |
| new_identities | landmark | product: fitted | 0.910±0.034 | 1.000±0.000 | 0.955±0.017 | 0.056±0.038 (— / 0.056±0.038) |
| new_identities | landmark | comparison: pooled midpoint | 0.787±0.007 | 1.000±0.000 | 0.894±0.003 |  |
| new_identities | region | product: fitted | 0.884±0.020 | 1.000±0.000 | 0.942±0.010 | 0.098±0.082 (— / 0.098±0.082) |
| new_identities | region | comparison: pooled midpoint | 0.623±0.020 | 1.000±0.000 | 0.812±0.010 |  |
| new_identities | anchor | product: fitted | 0.877±0.089 | 1.000±0.000 | 0.939±0.045 | 0.059±0.051 (— / 0.059±0.051) |
| new_identities | anchor | comparison: pooled midpoint | 0.796±0.052 | 1.000±0.000 | 0.898±0.026 |  |
| new_identities | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.042±0.059 (— / 0.042±0.059) |
| new_identities | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | amount | product: fitted | 0.989±0.000 | 1.000±0.000 | 0.994±0.000 | 0.004±0.005 (— / 0.004±0.005) |
| new_identities | amount | comparison: pooled midpoint | 0.985±0.005 | 1.000±0.000 | 0.993±0.003 |  |
| new_identities | unit | product: fitted | 0.996±0.005 | 1.000±0.000 | 0.998±0.003 | 0.007±0.005 (— / 0.007±0.005) |
| new_identities | unit | comparison: pooled midpoint | 0.981±0.005 | 1.000±0.000 | 0.991±0.003 |  |
| new_identities | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.043±0.000 (— / 0.043±0.000) |
| new_identities | direction | comparison: pooled midpoint | 0.899±0.020 | 1.000±0.000 | 0.949±0.010 |  |
| new_identities | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | source | product: fitted | 0.977±0.016 | 1.000±0.000 | 0.989±0.008 | 0.610±0.157 (— / 0.610±0.157) |
| new_identities | source | comparison: pooled midpoint | 0.793±0.049 | 1.000±0.000 | 0.897±0.024 |  |
| new_identities | target | product: fitted | 0.989±0.016 | 1.000±0.000 | 0.994±0.008 | 0.058±0.017 (— / 0.058±0.017) |
| new_identities | target | comparison: pooled midpoint | 0.839±0.059 | 1.000±0.000 | 0.920±0.029 |  |
| new_identities | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | edge | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | quantity | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | quantity | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| train (sample) | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.004±0.000 (— / 0.004±0.000) |
| train (sample) | color | product: fitted | 1.000±0.000 | 0.999±0.002 | 0.999±0.001 | 0.127±0.039 (1.000 / 0.100±0.000) |
| train (sample) | size | product: fitted | 0.905±0.039 | 1.000±0.000 | 0.952±0.019 | 0.017±0.024 (— / 0.017±0.024) |
| train (sample) | style | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.400±0.163 (— / 0.400±0.163) |
| train (sample) | text | product: fitted | 0.961±0.014 | 0.999±0.002 | 0.980±0.007 | 0.040±0.014 (0.000 / 0.041±0.014) |
| train (sample) | relation | product: fitted | 0.869±0.038 | 1.000±0.000 | 0.934±0.019 | 0.095±0.065 (— / 0.095±0.065) |
| train (sample) | landmark | product: fitted | 0.939±0.043 | 1.000±0.000 | 0.970±0.021 | 0.045±0.043 (— / 0.045±0.043) |
| train (sample) | region | product: fitted | 0.955±0.037 | 1.000±0.000 | 0.977±0.019 | 0.049±0.041 (— / 0.049±0.041) |
| train (sample) | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | direction | product: fitted | 0.988±0.017 | 1.000±0.000 | 0.994±0.009 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | layout | product: fitted | 0.944±0.039 | 1.000±0.000 | 0.972±0.020 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.048±0.067 (— / 0.048±0.067) |
| train (sample) | source | product: fitted | 0.935±0.046 | 1.000±0.000 | 0.968±0.023 | 0.336±0.057 (— / 0.336±0.057) |
| train (sample) | target | product: fitted | 0.986±0.020 | 1.000±0.000 | 0.993±0.010 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.037±0.052 (— / 0.037±0.052) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
