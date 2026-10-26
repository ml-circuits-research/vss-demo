# REPORT — world `diagram`, legend sha256:d361fbea318b… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
5800 annotated sentences from 3 files; provenance: {'generator': 5800}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/5000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 230 sentences
- heldout_formulations: 170 sentences
- heldout_sentences: 498 sentences
- new_identities: 400 sentences
- train: 4502 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['250', '35', '45', '90', 'analytics', 'broker', 'crawler', 'dashboard', 'gamma_ray', 'indexer', 'ingest', 'irina', 'loyalty', 'notifications', 'payroll', 'recommendations', 'registry', 'returns', 'routing', 'theta', 'tracking', 'vault', 'victor', 'zeta']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
46265 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit 448c916. Memory curve: runs/5000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 0.013 [rule: fit; pooled midpoint 0.511 (comparison)] (present 1.022, n 532 / absent 0.000, n 98)
- attr_presence:object: threshold 0.534 [rule: fit; pooled midpoint 0.674 (comparison)] (present 1.153, n 214 / absent 0.195, n 318)
- det_presence:object: threshold 0.796 [rule: fit; pooled midpoint 0.809 (comparison)] (present 1.474, n 177 / absent 0.143, n 355)
- presence:color: threshold 0.080 [rule: fit; pooled midpoint 0.324 (comparison)] (present 0.646, n 18 / absent 0.002, n 612)
- presence:size: threshold 0.149 [rule: fit; pooled midpoint 0.231 (comparison)] (present 0.454, n 42 / absent 0.009, n 588)
- presence:style: threshold 0.043 [rule: fit; pooled midpoint 0.132 (comparison)] (present 0.262, n 14 / absent 0.002, n 616)
- presence:text: threshold 0.183 [rule: fit; pooled midpoint 0.269 (comparison)] (present 0.520, n 72 / absent 0.017, n 558)
- presence:relation: threshold 0.117 [rule: fit; pooled midpoint 0.265 (comparison)] (present 0.518, n 61 / absent 0.013, n 569)
- presence:landmark: threshold 0.133 [rule: fit; pooled midpoint 0.324 (comparison)] (present 0.619, n 61 / absent 0.028, n 569)
- presence:region: threshold 0.372 [rule: fit; pooled midpoint 0.536 (comparison)] (present 1.053, n 47 / absent 0.020, n 583)
- presence:anchor: threshold 0.429 [rule: fit; pooled midpoint 0.467 (comparison)] (present 0.931, n 43 / absent 0.003, n 587)
- presence:fraction: threshold 0.314 [rule: fit; pooled midpoint 0.336 (comparison)] (present 0.666, n 29 / absent 0.006, n 601)
- presence:amount: threshold 0.177 [rule: fit; pooled midpoint 0.281 (comparison)] (present 0.559, n 41 / absent 0.002, n 589)
- presence:unit: threshold 0.272 [rule: fit; pooled midpoint 0.320 (comparison)] (present 0.607, n 41 / absent 0.034, n 589)
- presence:direction: threshold 0.156 [rule: fit; pooled midpoint 0.282 (comparison)] (present 0.560, n 33 / absent 0.003, n 597)
- presence:axis: threshold 0.211 [rule: fit; pooled midpoint 0.331 (comparison)] (present 0.662, n 26 / absent 0.000, n 604)
- presence:layout: threshold 0.243 [rule: fit; pooled midpoint 0.414 (comparison)] (present 0.829, n 19 / absent 0.000, n 611)
- presence:pairing: threshold 0.165 [rule: fit; pooled midpoint 0.238 (comparison)] (present 0.476, n 17 / absent -0.001, n 613)
- presence:source: threshold 0.096 [rule: fit; pooled midpoint 0.336 (comparison)] (present 0.672, n 75 / absent 0.000, n 555)
- presence:target: threshold 0.237 [rule: fit; pooled midpoint 0.392 (comparison)] (present 0.782, n 58 / absent 0.002, n 572)
- presence:edge: threshold 0.161 [rule: fit; pooled midpoint 0.322 (comparison)] (present 0.644, n 50 / absent 0.000, n 580)
- presence:quantity: threshold 0.066 [rule: fit; pooled midpoint 0.084 (comparison)] (present 0.167, n 25 / absent 0.001, n 605)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.005, color 0.083, size 0.143, style 0.200, text 0.013, relation 0.167, landmark 0.006, region 0.111, anchor 0.250, fraction 0.333, amount 0.043, unit 0.500, direction 0.167, axis 0.500, layout 0.143, pairing 0.500, source 0.006, target 0.006, edge 0.125, quantity 0.043, predicate 0.019

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 170 of 170)
| axis | accuracy |
|---|---|
| FULL | 0.896±0.007 |
| FULL [depth given] | 0.896±0.007 |
| FULL [depth and negation given] | 0.896±0.007 |
| FULL [presence not decided] | 0.888±0.005 |
| FULL [pooled midpoint (comparison)] | 0.733±0.015 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.017±0.004 |
| presence object: share of true 'present' readings that abstain | 0.017±0.004 |
| presence color: absent read absent | 1.000±0.000 |
| presence size: absent read absent | 0.998±0.003 |
| presence style: absent read absent | 1.000±0.000 |
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
| role object | 0.996±0.003 |
| head object | 1.000±0.000 |
| lexical order head object | 0.771±0.000 |
| lexical bag head object | 0.747±0.000 |
| occupancy: known filler | 0.989±0.002 |
| role color | 1.000±0.000 |
| head color | 1.000±0.000 |
| lexical order head color | 0.988±0.000 |
| lexical bag head color | 0.982±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.998±0.003 |
| head size | 0.998±0.003 |
| lexical order head size | 0.929±0.000 |
| lexical bag head size | 0.971±0.000 |
| role style | 0.994±0.005 |
| head style | 0.994±0.005 |
| lexical order head style | 0.965±0.000 |
| lexical bag head style | 0.965±0.000 |
| role text | 1.000±0.000 |
| head text | 1.000±0.000 |
| lexical order head text | 0.882±0.000 |
| lexical bag head text | 0.906±0.000 |
| role relation | 0.994±0.005 |
| head relation | 0.994±0.005 |
| lexical order head relation | 0.888±0.000 |
| lexical bag head relation | 0.888±0.000 |
| role landmark | 0.990±0.003 |
| head landmark | 0.996±0.003 |
| lexical order head landmark | 0.888±0.000 |
| lexical bag head landmark | 0.888±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.935±0.000 |
| lexical bag head region | 0.935±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 1.000±0.000 |
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
| role direction | 0.998±0.003 |
| head direction | 0.998±0.003 |
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
| role source | 0.957±0.003 |
| head source | 0.992±0.003 |
| lexical order head source | 0.794±0.000 |
| lexical bag head source | 0.794±0.000 |
| role target | 0.963±0.003 |
| head target | 0.992±0.003 |
| lexical order head target | 0.812±0.000 |
| lexical bag head target | 0.812±0.000 |
| role edge | 0.982±0.005 |
| head edge | 0.994±0.005 |
| lexical order head edge | 0.812±0.000 |
| lexical bag head edge | 0.812±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.876±0.000 |
| lexical bag head quantity | 0.876±0.000 |
| heads FULL (model) | 0.969±0.007 |
| heads FULL (lexical order baseline) | 0.235±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.276±0.000 |
| role object [presence not decided] | 0.996±0.003 |
| role color [presence not decided] | 0.988±0.000 |
| role size [presence not decided] | 0.994±0.000 |
| role style [presence not decided] | 0.988±0.000 |
| role text [presence not decided] | 1.000±0.000 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.994±0.000 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 1.000±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 1.000±0.000 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.957±0.003 |
| role target [presence not decided] | 0.963±0.003 |
| role edge [presence not decided] | 0.988±0.000 |
| role quantity [presence not decided] | 1.000±0.000 |
| heads FULL (model) [presence not decided] | 0.963±0.003 |
| role object [pooled midpoint (comparison)] | 0.892±0.003 |
| role color [pooled midpoint (comparison)] | 1.000±0.000 |
| role size [pooled midpoint (comparison)] | 0.990±0.006 |
| role style [pooled midpoint (comparison)] | 0.975±0.006 |
| role text [pooled midpoint (comparison)] | 0.986±0.003 |
| role relation [pooled midpoint (comparison)] | 0.963±0.006 |
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
| role source [pooled midpoint (comparison)] | 0.957±0.003 |
| role target [pooled midpoint (comparison)] | 0.963±0.003 |
| role edge [pooled midpoint (comparison)] | 0.976±0.005 |
| role quantity [pooled midpoint (comparison)] | 0.998±0.003 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.794±0.017 |
| presence object: present read present [pooled midpoint (comparison)] | 0.875±0.003 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.993±0.000 |
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
| presence size: share of 'present' readings that abstain | 0.079±0.063 |
| presence size: share of true 'present' readings that abstain | 0.056±0.039 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.861±0.079 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.083±0.118 |
| presence amount: share of true 'present' readings that abstain | 0.083±0.118 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.958±0.059 |
| presence unit: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present | 0.947±0.043 |
| presence relation: share of 'present' readings that abstain | 0.128±0.049 |
| presence relation: share of true 'present' readings that abstain | 0.128±0.049 |
| presence landmark: present read present | 0.965±0.025 |
| presence landmark: share of 'present' readings that abstain | 0.255±0.032 |
| presence landmark: share of true 'present' readings that abstain | 0.255±0.032 |
| determiner identity (outside FULL when the legend excludes it) | 0.952±0.010 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.692±0.062 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.692±0.043 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.000±0.000 |
| presence color: share of true 'present' readings that abstain | 0.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: present read present | 0.833±0.136 |
| presence style: share of 'present' readings that abstain | 0.411±0.068 |
| presence style: share of true 'present' readings that abstain | 0.411±0.068 |
| presence style: present read present [pooled midpoint (comparison)] | 0.278±0.157 |
| presence text: present read present | 1.000±0.000 |
| presence text: share of 'present' readings that abstain | 0.000±0.000 |
| presence text: share of true 'present' readings that abstain | 0.000±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.933±0.024 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.781±0.049 |
| presence source: share of true 'present' readings that abstain | 0.781±0.049 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.396±0.059 |
| presence target: share of true 'present' readings that abstain | 0.396±0.059 |
| presence edge: present read present | 0.969±0.026 |
| presence edge: share of 'present' readings that abstain | 0.022±0.015 |
| presence edge: share of true 'present' readings that abstain | 0.022±0.015 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.962±0.013 |
| presence target: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.927±0.015 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.143±0.039 |
| presence quantity: share of true 'present' readings that abstain | 0.143±0.039 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.984±0.022 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.889±0.157 |
| presence direction: present read present | 0.667±0.471 |
| presence direction: share of 'present' readings that abstain | nan±nan |
| presence direction: share of true 'present' readings that abstain | nan±nan |
| presence direction: present read present [pooled midpoint (comparison)] | 0.000±0.000 |

residual mean 0.032±0.002; status {'ok': 116, 'abstain': 54}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.449 / 0.344 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.993 | 0.261 / 0.086 | 0.98 | 0.007 | 0.022 / 0.000 |
| roles (pooled) | 0.945 | 0.178 / 0.029 | 0.84 | 0.024 | 0.124 / 0.032 |
| role anchor | 1.000 | 0.264 / 0.237 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.180 / 0.159 | 1.00 | 0.000 | 0.000 / 0.000 |
| role size | 1.000 | 0.190 / 0.127 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 1.000 | 0.190 / 0.105 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.162 / 0.094 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.269 / 0.206 | 1.00 | 0.000 | 0.000 / 0.000 |
| role relation | 0.947 | 0.158 / 0.021 | 0.79 | 0.000 | 0.158 / 0.053 |
| role landmark | 0.895 | 0.090 / 0.030 | 0.68 | 0.053 | 0.263 / 0.053 |
| role color | 1.000 | 0.286 / 0.286 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 1.000 | 0.072 / 0.022 | 0.67 | 0.000 | 0.333 / 0.000 |
| role text | 1.000 | 0.205 / 0.091 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.771 | 0.024 / -0.010 | 0.17 | 0.086 | 0.686 / 0.143 |
| role target | 0.812 | 0.063 / 0.024 | 0.69 | 0.062 | 0.188 / 0.125 |
| role edge | 0.906 | 0.167 / 0.125 | 0.97 | 0.062 | 0.000 / 0.031 |
| role quantity | 1.000 | 0.119 / 0.042 | 0.86 | 0.000 | 0.143 / 0.000 |
| role pairing | 1.000 | 0.141 / 0.075 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.021 / 0.021 | 0.00 | 0.000 | 1.000 / 0.000 |

### heldout_sentences — catalog candidates (n = 498 of 498)
| axis | accuracy |
|---|---|
| FULL | 0.875±0.008 |
| FULL [depth given] | 0.875±0.008 |
| FULL [depth and negation given] | 0.875±0.008 |
| FULL [pooled midpoint (comparison)] | 0.718±0.003 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.035±0.011 |
| presence object: share of true 'present' readings that abstain | 0.035±0.011 |
| presence color: absent read absent | 1.000±0.000 |
| presence size: absent read absent | 0.999±0.001 |
| presence style: absent read absent | 1.000±0.000 |
| presence text: absent read absent | 0.998±0.001 |
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
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 1.000±0.000 |
| presence target: absent read absent | 1.000±0.000 |
| presence edge: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 1.000±0.000 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 1.000±0.000 |
| event type (synonym table) | 1.000±0.000 |
| role object | 0.986±0.002 |
| head object | 0.999±0.001 |
| lexical order head object | 0.861±0.000 |
| lexical bag head object | 0.906±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.898±0.003 |
| occupancy: known filler | 0.980±0.003 |
| role color | 0.995±0.003 |
| head color | 0.995±0.003 |
| lexical order head color | 0.960±0.000 |
| lexical bag head color | 0.980±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.996±0.002 |
| head size | 0.996±0.002 |
| lexical order head size | 0.946±0.000 |
| lexical bag head size | 0.984±0.000 |
| role style | 1.000±0.000 |
| head style | 1.000±0.000 |
| lexical order head style | 0.978±0.000 |
| lexical bag head style | 0.978±0.000 |
| role text | 0.991±0.005 |
| head text | 0.991±0.005 |
| lexical order head text | 0.841±0.000 |
| lexical bag head text | 0.928±0.000 |
| role relation | 0.993±0.002 |
| head relation | 0.993±0.002 |
| lexical order head relation | 0.880±0.000 |
| lexical bag head relation | 0.936±0.000 |
| role landmark | 0.969±0.003 |
| head landmark | 0.993±0.003 |
| lexical order head landmark | 0.880±0.000 |
| lexical bag head landmark | 0.892±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.932±0.000 |
| lexical bag head region | 0.952±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.942±0.000 |
| lexical bag head anchor | 0.992±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.984±0.000 |
| lexical bag head fraction | 0.990±0.000 |
| role amount | 0.996±0.003 |
| head amount | 0.996±0.003 |
| lexical order head amount | 0.932±0.000 |
| lexical bag head amount | 0.952±0.000 |
| role unit | 0.995±0.001 |
| head unit | 0.995±0.001 |
| lexical order head unit | 0.932±0.000 |
| lexical bag head unit | 0.952±0.000 |
| role direction | 0.999±0.001 |
| head direction | 0.999±0.001 |
| lexical order head direction | 0.944±0.000 |
| lexical bag head direction | 0.972±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.974±0.000 |
| lexical bag head axis | 0.986±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.946±0.000 |
| lexical bag head layout | 0.964±0.000 |
| role pairing | 0.998±0.002 |
| head pairing | 0.998±0.002 |
| lexical order head pairing | 0.956±0.000 |
| lexical bag head pairing | 0.972±0.000 |
| role source | 0.942±0.000 |
| head source | 0.997±0.001 |
| lexical order head source | 0.878±0.000 |
| lexical bag head source | 0.934±0.000 |
| role target | 0.987±0.001 |
| head target | 0.997±0.001 |
| lexical order head target | 0.922±0.000 |
| lexical bag head target | 0.952±0.000 |
| role edge | 0.996±0.000 |
| head edge | 0.999±0.001 |
| lexical order head edge | 0.956±0.000 |
| lexical bag head edge | 0.986±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.966±0.000 |
| lexical bag head quantity | 0.988±0.000 |
| heads FULL (model) | 0.962±0.010 |
| heads FULL (lexical order baseline) | 0.207±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.536±0.000 |
| role object [pooled midpoint (comparison)] | 0.923±0.004 |
| role color [pooled midpoint (comparison)] | 0.971±0.003 |
| role size [pooled midpoint (comparison)] | 0.988±0.003 |
| role style [pooled midpoint (comparison)] | 0.999±0.001 |
| role text [pooled midpoint (comparison)] | 0.967±0.002 |
| role relation [pooled midpoint (comparison)] | 0.969±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.943±0.002 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 1.000±0.000 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.991±0.003 |
| role unit [pooled midpoint (comparison)] | 0.993±0.001 |
| role direction [pooled midpoint (comparison)] | 0.989±0.002 |
| role axis [pooled midpoint (comparison)] | 0.995±0.001 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 0.989±0.003 |
| role source [pooled midpoint (comparison)] | 0.932±0.001 |
| role target [pooled midpoint (comparison)] | 0.977±0.001 |
| role edge [pooled midpoint (comparison)] | 0.995±0.001 |
| role quantity [pooled midpoint (comparison)] | 0.999±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.786±0.006 |
| presence object: present read present [pooled midpoint (comparison)] | 0.935±0.003 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.994±0.001 |
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
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.760±0.087 |
| presence source: share of true 'present' readings that abstain | 0.760±0.087 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.222±0.024 |
| presence target: share of true 'present' readings that abstain | 0.222±0.024 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.727±0.041 |
| presence target: present read present [pooled midpoint (comparison)] | 0.880±0.012 |
| presence direction: present read present | 0.988±0.017 |
| presence direction: share of 'present' readings that abstain | 0.072±0.029 |
| presence direction: share of true 'present' readings that abstain | 0.072±0.029 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.810±0.034 |
| presence size: present read present | 0.938±0.035 |
| presence size: share of 'present' readings that abstain | 0.102±0.046 |
| presence size: share of true 'present' readings that abstain | 0.091±0.047 |
| presence amount: present read present | 0.941±0.042 |
| presence amount: share of 'present' readings that abstain | 0.074±0.019 |
| presence amount: share of true 'present' readings that abstain | 0.074±0.019 |
| presence unit: present read present | 0.922±0.014 |
| presence size: present read present [pooled midpoint (comparison)] | 0.778±0.060 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.873±0.037 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.892±0.014 |
| presence text: present read present | 0.949±0.037 |
| presence text: share of 'present' readings that abstain | 0.044±0.008 |
| presence text: share of true 'present' readings that abstain | 0.040±0.013 |
| presence text: present read present [pooled midpoint (comparison)] | 0.819±0.006 |
| presence pairing: present read present | 0.955±0.037 |
| presence pairing: share of 'present' readings that abstain | 0.111±0.023 |
| presence pairing: share of true 'present' readings that abstain | 0.111±0.023 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.758±0.077 |
| presence color: present read present | 0.883±0.062 |
| presence color: share of 'present' readings that abstain | 0.171±0.012 |
| presence color: share of true 'present' readings that abstain | 0.171±0.012 |
| presence color: present read present [pooled midpoint (comparison)] | 0.283±0.085 |
| presence unit: share of 'present' readings that abstain | 0.022±0.015 |
| presence unit: share of true 'present' readings that abstain | 0.022±0.015 |
| presence relation: present read present | 0.939±0.016 |
| presence relation: share of 'present' readings that abstain | 0.059±0.033 |
| presence relation: share of true 'present' readings that abstain | 0.059±0.033 |
| presence landmark: present read present | 0.956±0.016 |
| presence landmark: share of 'present' readings that abstain | 0.209±0.011 |
| presence landmark: share of true 'present' readings that abstain | 0.209±0.011 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.760±0.037 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.760±0.026 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.011±0.016 |
| presence anchor: share of true 'present' readings that abstain | 0.011±0.016 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.795±0.036 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.061±0.086 |
| presence style: share of true 'present' readings that abstain | 0.061±0.086 |
| presence style: present read present [pooled midpoint (comparison)] | 0.970±0.043 |
| presence edge: present read present | 0.970±0.021 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.939±0.021 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.078±0.028 |
| presence quantity: share of true 'present' readings that abstain | 0.078±0.028 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.980±0.028 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.074±0.003; status {'ok': 378, 'abstain': 120}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.449 / 0.352 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.981 | 0.252 / 0.091 | 0.95 | 0.019 | 0.047 / 0.000 |
| roles (pooled) | 0.921 | 0.201 / 0.035 | 0.86 | 0.026 | 0.087 / 0.053 |
| role layout | 1.000 | 0.287 / 0.224 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.293 / 0.226 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.525 | 0.027 / -0.001 | 0.13 | 0.115 | 0.508 / 0.361 |
| role target | 0.821 | 0.065 / 0.016 | 0.74 | 0.103 | 0.179 / 0.077 |
| role direction | 1.000 | 0.232 / 0.088 | 0.93 | 0.000 | 0.071 / 0.000 |
| role size | 0.963 | 0.154 / 0.040 | 0.81 | 0.000 | 0.148 / 0.037 |
| role amount | 0.971 | 0.193 / 0.057 | 0.91 | 0.000 | 0.059 / 0.029 |
| role unit | 0.912 | 0.186 / 0.025 | 0.88 | 0.000 | 0.029 / 0.088 |
| role text | 0.899 | 0.192 / 0.001 | 0.85 | 0.000 | 0.051 / 0.101 |
| role pairing | 0.909 | 0.167 / 0.016 | 0.82 | 0.000 | 0.091 / 0.091 |
| role color | 0.800 | 0.139 / 0.000 | 0.65 | 0.000 | 0.150 / 0.200 |
| role relation | 0.950 | 0.170 / 0.043 | 0.85 | 0.000 | 0.100 / 0.050 |
| role landmark | 0.750 | 0.087 / 0.025 | 0.75 | 0.117 | 0.117 / 0.133 |
| role anchor | 1.000 | 0.274 / 0.136 | 0.97 | 0.000 | 0.034 / 0.000 |
| role axis | 1.000 | 0.259 / 0.074 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 1.000 | 0.182 / 0.123 | 1.00 | 0.000 | 0.000 / 0.000 |
| role edge | 0.909 | 0.187 / 0.148 | 0.95 | 0.045 | 0.000 / 0.045 |
| role quantity | 1.000 | 0.135 / 0.070 | 0.94 | 0.000 | 0.059 / 0.000 |
| role fraction | 1.000 | 0.227 / 0.198 | 1.00 | 0.000 | 0.000 / 0.000 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.863±0.012 |
| FULL [depth given] | 0.863±0.012 |
| FULL [depth and negation given] | 0.863±0.012 |
| FULL [pooled midpoint (comparison)] | 0.628±0.016 |
| presence object: present read present | 0.997±0.000 |
| presence object: share of 'present' readings that abstain | 0.039±0.018 |
| presence object: share of true 'present' readings that abstain | 0.039±0.018 |
| presence color: absent read absent | 0.997±0.002 |
| presence size: present read present | 0.980±0.028 |
| presence size: share of 'present' readings that abstain | 0.039±0.028 |
| presence size: share of true 'present' readings that abstain | 0.039±0.028 |
| presence style: absent read absent | 1.000±0.000 |
| presence text: absent read absent | 0.993±0.008 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.970±0.042 |
| presence amount: share of 'present' readings that abstain | 0.037±0.043 |
| presence amount: share of true 'present' readings that abstain | 0.037±0.043 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.017±0.016 |
| presence unit: share of true 'present' readings that abstain | 0.017±0.016 |
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
| role object | 0.974±0.002 |
| head object | 0.995±0.000 |
| lexical order head object | 0.900±0.000 |
| lexical bag head object | 0.885±0.000 |
| occupancy: known filler | 0.968±0.005 |
| role color | 0.998±0.002 |
| head color | 0.998±0.002 |
| lexical order head color | 0.988±0.000 |
| lexical bag head color | 0.988±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.999±0.001 |
| head size | 0.999±0.001 |
| lexical order head size | 0.958±0.000 |
| lexical bag head size | 0.983±0.000 |
| role style | 1.000±0.000 |
| head style | 1.000±0.000 |
| lexical order head style | 0.993±0.000 |
| lexical bag head style | 0.993±0.000 |
| role text | 0.982±0.012 |
| head text | 0.982±0.012 |
| lexical order head text | 0.560±0.000 |
| lexical bag head text | 0.785±0.000 |
| role relation | 0.964±0.011 |
| head relation | 0.964±0.011 |
| lexical order head relation | 0.770±0.000 |
| lexical bag head relation | 0.840±0.000 |
| role landmark | 0.938±0.010 |
| head landmark | 0.968±0.010 |
| lexical order head landmark | 0.770±0.000 |
| lexical bag head landmark | 0.783±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.955±0.000 |
| lexical bag head region | 0.963±0.000 |
| role anchor | 0.998±0.001 |
| head anchor | 0.998±0.001 |
| lexical order head anchor | 0.960±0.000 |
| lexical bag head anchor | 0.988±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 0.988±0.000 |
| role amount | 0.994±0.008 |
| head amount | 0.994±0.008 |
| lexical order head amount | 0.802±0.000 |
| lexical bag head amount | 0.885±0.000 |
| occupancy: unknown filler | 0.953±0.005 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.802±0.000 |
| lexical bag head unit | 0.885±0.000 |
| role direction | 0.993±0.004 |
| head direction | 0.993±0.004 |
| lexical order head direction | 0.932±0.000 |
| lexical bag head direction | 0.953±0.000 |
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
| role source | 0.986±0.001 |
| head source | 0.998±0.001 |
| lexical order head source | 0.910±0.000 |
| lexical bag head source | 0.955±0.000 |
| role target | 0.992±0.003 |
| head target | 0.997±0.003 |
| lexical order head target | 0.910±0.000 |
| lexical bag head target | 0.917±0.000 |
| role edge | 0.994±0.001 |
| head edge | 0.998±0.001 |
| lexical order head edge | 0.945±0.000 |
| lexical bag head edge | 0.980±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.912±0.012 |
| heads FULL (lexical order baseline) | 0.060±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.365±0.000 |
| role object [pooled midpoint (comparison)] | 0.889±0.009 |
| role color [pooled midpoint (comparison)] | 0.988±0.001 |
| role size [pooled midpoint (comparison)] | 0.997±0.001 |
| role style [pooled midpoint (comparison)] | 0.998±0.000 |
| role text [pooled midpoint (comparison)] | 0.917±0.008 |
| role relation [pooled midpoint (comparison)] | 0.884±0.003 |
| role landmark [pooled midpoint (comparison)] | 0.859±0.008 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 0.997±0.001 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.991±0.008 |
| role unit [pooled midpoint (comparison)] | 0.996±0.003 |
| role direction [pooled midpoint (comparison)] | 0.978±0.003 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.965±0.004 |
| role target [pooled midpoint (comparison)] | 0.968±0.004 |
| role edge [pooled midpoint (comparison)] | 0.994±0.001 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.673±0.016 |
| presence object: present read present [pooled midpoint (comparison)] | 0.920±0.007 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.922±0.028 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.985±0.002 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.962±0.045 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.987±0.018 |
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
| presence text: present read present | 0.968±0.034 |
| presence text: share of 'present' readings that abstain | 0.052±0.009 |
| presence text: share of true 'present' readings that abstain | 0.043±0.009 |
| presence text: present read present [pooled midpoint (comparison)] | 0.830±0.017 |
| presence relation: present read present | 0.844±0.049 |
| presence relation: share of 'present' readings that abstain | 0.115±0.011 |
| presence relation: share of true 'present' readings that abstain | 0.115±0.011 |
| presence landmark: present read present | 0.866±0.046 |
| presence landmark: share of 'present' readings that abstain | 0.240±0.075 |
| presence landmark: share of true 'present' readings that abstain | 0.240±0.075 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.535±0.020 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.567±0.040 |
| presence anchor: present read present | 0.958±0.029 |
| presence anchor: share of 'present' readings that abstain | 0.043±0.030 |
| presence anchor: share of true 'present' readings that abstain | 0.043±0.030 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.917±0.029 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.787±0.069 |
| presence source: share of true 'present' readings that abstain | 0.787±0.069 |
| presence target: present read present | 0.981±0.026 |
| presence target: share of 'present' readings that abstain | 0.294±0.043 |
| presence target: share of true 'present' readings that abstain | 0.294±0.043 |
| presence edge: present read present | 0.970±0.021 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.994±0.000 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.750±0.023 |
| presence target: present read present [pooled midpoint (comparison)] | 0.731±0.047 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.955±0.000 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 0.901±0.063 |
| presence direction: share of 'present' readings that abstain | 0.059±0.057 |
| presence direction: share of true 'present' readings that abstain | 0.059±0.057 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.679±0.046 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.443±0.042 |
| presence color: share of true 'present' readings that abstain | 0.333±0.094 |
| presence color: present read present [pooled midpoint (comparison)] | 0.067±0.094 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.111±0.157 |
| presence style: share of true 'present' readings that abstain | 0.111±0.157 |
| presence style: present read present [pooled midpoint (comparison)] | 0.667±0.000 |

residual mean 0.061±0.006; status {'ok': 289, 'abstain': 111}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.439 / 0.358 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.970 | 0.231 / 0.072 | 0.93 | 0.022 | 0.058 / 0.008 |
| roles (pooled) | 0.926 | 0.183 / 0.024 | 0.85 | 0.016 | 0.093 / 0.058 |
| role size | 0.941 | 0.165 / 0.097 | 0.94 | 0.000 | 0.000 / 0.059 |
| role amount | 1.000 | 0.214 / 0.106 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.216 / 0.098 | 1.00 | 0.000 | 0.000 / 0.000 |
| role text | 0.920 | 0.192 / 0.029 | 0.87 | 0.000 | 0.051 / 0.080 |
| role relation | 0.815 | 0.124 / 0.000 | 0.73 | 0.000 | 0.087 / 0.185 |
| role landmark | 0.783 | 0.082 / 0.007 | 0.60 | 0.043 | 0.228 / 0.174 |
| role anchor | 0.938 | 0.231 / 0.060 | 0.88 | 0.000 | 0.062 / 0.062 |
| role fraction | 1.000 | 0.178 / 0.159 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.833 | 0.022 / -0.005 | 0.14 | 0.056 | 0.750 / 0.111 |
| role target | 0.861 | 0.062 / 0.026 | 0.61 | 0.028 | 0.278 / 0.111 |
| role edge | 0.864 | 0.178 / 0.149 | 0.95 | 0.091 | 0.000 / 0.045 |
| role region | 1.000 | 0.270 / 0.206 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.963 | 0.172 / 0.072 | 0.96 | 0.000 | 0.000 / 0.037 |
| role color | 1.000 | 0.079 / -0.013 | 0.60 | 0.000 | 0.400 / 0.000 |
| role style | 1.000 | 0.134 / 0.077 | 1.00 | 0.000 | 0.000 / 0.000 |

### train (sample) — catalog candidates (n = 300 of 4502)
| axis | accuracy |
|---|---|
| FULL | 0.917±0.000 |
| FULL [depth given] | 0.917±0.000 |
| FULL [depth and negation given] | 0.917±0.000 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.018±0.014 |
| presence object: share of true 'present' readings that abstain | 0.018±0.014 |
| presence color: present read present | 0.967±0.047 |
| presence color: share of 'present' readings that abstain | 0.226±0.116 |
| presence color: share of true 'present' readings that abstain | 0.137±0.045 |
| presence size: absent read absent | 1.000±0.000 |
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
| role object | 0.984±0.002 |
| head object | 1.000±0.000 |
| lexical order head object | 0.890±0.000 |
| lexical bag head object | 0.963±0.000 |
| occupancy: known filler | 0.994±0.001 |
| role color | 0.994±0.003 |
| head color | 0.994±0.003 |
| lexical order head color | 0.967±0.000 |
| lexical bag head color | 1.000±0.000 |
| role size | 0.996±0.002 |
| head size | 0.996±0.002 |
| lexical order head size | 0.923±0.000 |
| lexical bag head size | 0.993±0.000 |
| occupancy: not given | 1.000±0.000 |
| role style | 0.999±0.002 |
| head style | 0.999±0.002 |
| lexical order head style | 0.973±0.000 |
| lexical bag head style | 0.987±0.000 |
| role text | 0.997±0.005 |
| head text | 0.997±0.005 |
| lexical order head text | 0.833±0.000 |
| lexical bag head text | 0.990±0.000 |
| role relation | 0.999±0.002 |
| head relation | 0.999±0.002 |
| lexical order head relation | 0.913±0.000 |
| lexical bag head relation | 0.993±0.000 |
| role landmark | 0.977±0.000 |
| head landmark | 1.000±0.000 |
| lexical order head landmark | 0.913±0.000 |
| lexical bag head landmark | 0.957±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.900±0.000 |
| lexical bag head region | 1.000±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.943±0.000 |
| lexical bag head anchor | 0.997±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 1.000±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.950±0.000 |
| lexical bag head amount | 0.980±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.950±0.000 |
| lexical bag head unit | 0.980±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.950±0.000 |
| lexical bag head direction | 0.983±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.977±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.937±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.999±0.002 |
| head pairing | 0.999±0.002 |
| lexical order head pairing | 0.977±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.963±0.000 |
| head source | 0.999±0.002 |
| lexical order head source | 0.907±0.000 |
| lexical bag head source | 0.973±0.000 |
| role target | 0.993±0.000 |
| head target | 0.999±0.002 |
| lexical order head target | 0.930±0.000 |
| lexical bag head target | 0.960±0.000 |
| role edge | 0.993±0.000 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.967±0.000 |
| lexical bag head edge | 1.000±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.990±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.983±0.003 |
| heads FULL (lexical order baseline) | 0.240±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.833±0.000 |
| presence color: absent read absent | 0.995±0.004 |
| presence style: present read present | 0.958±0.059 |
| presence style: share of 'present' readings that abstain | 0.250±0.177 |
| presence style: share of true 'present' readings that abstain | 0.250±0.177 |
| presence object: absent read absent | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence size: present read present | 0.942±0.020 |
| presence size: share of 'present' readings that abstain | 0.139±0.003 |
| presence size: share of true 'present' readings that abstain | 0.139±0.003 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.655±0.102 |
| presence source: share of true 'present' readings that abstain | 0.655±0.102 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.190±0.078 |
| presence target: share of true 'present' readings that abstain | 0.190±0.078 |
| presence text: present read present | 0.980±0.028 |
| presence text: share of 'present' readings that abstain | 0.021±0.017 |
| presence text: share of true 'present' readings that abstain | 0.021±0.017 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.089±0.083 |
| presence amount: share of true 'present' readings that abstain | 0.089±0.083 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.957±0.005 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| presence relation: present read present | 0.987±0.018 |
| presence relation: share of 'present' readings that abstain | 0.013±0.019 |
| presence relation: share of true 'present' readings that abstain | 0.013±0.019 |
| presence landmark: present read present | 1.000±0.000 |
| presence landmark: share of 'present' readings that abstain | 0.218±0.048 |
| presence landmark: share of true 'present' readings that abstain | 0.218±0.048 |
| presence pairing: present read present | 0.952±0.067 |
| presence pairing: share of 'present' readings that abstain | 0.048±0.067 |
| presence pairing: share of true 'present' readings that abstain | 0.048±0.067 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.000±0.000 |
| presence quantity: share of true 'present' readings that abstain | 0.000±0.000 |

residual mean 0.059±0.002; status {'ok': 241, 'abstain': 59}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.456 / 0.363 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.985 | 0.268 / 0.125 | 0.96 | 0.008 | 0.030 / 0.008 |
| roles (pooled) | 0.950 | 0.225 / 0.055 | 0.90 | 0.015 | 0.062 / 0.035 |
| role color | 1.000 | 0.149 / 0.057 | 0.90 | 0.000 | 0.100 / 0.000 |
| role style | 1.000 | 0.141 / 0.035 | 0.62 | 0.000 | 0.375 / 0.000 |
| role direction | 1.000 | 0.263 / 0.221 | 1.00 | 0.000 | 0.000 / 0.000 |
| role size | 0.957 | 0.161 / 0.036 | 0.83 | 0.000 | 0.130 / 0.043 |
| role region | 1.000 | 0.294 / 0.239 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.607 | 0.034 / 0.006 | 0.21 | 0.071 | 0.464 / 0.321 |
| role target | 0.905 | 0.078 / 0.032 | 0.81 | 0.000 | 0.095 / 0.095 |
| role text | 0.940 | 0.217 / 0.097 | 0.90 | 0.000 | 0.040 / 0.060 |
| role amount | 1.000 | 0.212 / 0.114 | 0.93 | 0.000 | 0.067 / 0.000 |
| role unit | 1.000 | 0.217 / 0.061 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.256 / 0.078 | 1.00 | 0.000 | 0.000 / 0.000 |
| role anchor | 1.000 | 0.264 / 0.162 | 1.00 | 0.000 | 0.000 / 0.000 |
| role layout | 1.000 | 0.312 / 0.272 | 1.00 | 0.000 | 0.000 / 0.000 |
| role edge | 0.800 | 0.201 / 0.161 | 1.00 | 0.200 | 0.000 / 0.000 |
| role relation | 1.000 | 0.207 / 0.151 | 1.00 | 0.000 | 0.000 / 0.000 |
| role landmark | 0.731 | 0.108 / 0.030 | 0.73 | 0.115 | 0.115 / 0.154 |
| role pairing | 1.000 | 0.205 / 0.088 | 0.86 | 0.000 | 0.143 / 0.000 |
| role fraction | 1.000 | 0.217 / 0.195 | 1.00 | 0.000 | 0.000 / 0.000 |
| role quantity | 1.000 | 0.100 / 0.093 | 1.00 | 0.000 | 0.000 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 COMPONENT=0.97 ANCHOR=0.96 do=0.95 PAIR=0.90 AXIS=0.88 never=0.87 DIR=0.81 UNIT=0.78 EDGE=0.77 REGION=0.68 front=0.60 LABEL=0.60 apart=0.53 back=0.51 flow=0.50 not=0.39 FILLER=0.39 LAYOUT=0.35 PRON=0.35 color=0.32 FRACTION=0.17 the=0.16 are=0.13 together=0.12 unknown=0.12 INTRO=0.05 evenly=0.04 is=0.03 REL=0.01 DEM=0.01 NUM=0.01 VERB=0.01 QUANT=0.00 a=0.00 SIZE=0.00 STYLE=0.00 COLOR=0.00

## What is weak, what to add
- heldout_formulations: presence object: share of 'present' readings that abstain 0.022
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.022
- heldout_formulations: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_formulations: heads FULL (lexical order baseline) 0.235
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.276
- heldout_formulations: FULL [presence not decided] 0.888
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.729
- heldout_formulations: role object [pooled midpoint (comparison)] 0.888
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.788
- heldout_formulations: presence object: present read present [pooled midpoint (comparison)] 0.873
- heldout_formulations: presence size: share of 'present' readings that abstain 0.000
- heldout_formulations: presence size: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence amount: present read present [pooled midpoint (comparison)] 0.875
- heldout_formulations: presence region: share of 'present' readings that abstain 0.000
- heldout_formulations: presence region: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.167
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.167
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.278
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.278
- heldout_formulations: presence relation: present read present [pooled midpoint (comparison)] 0.632
- heldout_formulations: presence landmark: present read present [pooled midpoint (comparison)] 0.632
- heldout_formulations: presence color: share of 'present' readings that abstain 0.000
- heldout_formulations: presence color: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence style: share of 'present' readings that abstain 0.333
- heldout_formulations: presence style: share of true 'present' readings that abstain 0.333
- heldout_formulations: presence style: present read present [pooled midpoint (comparison)] 0.167
- heldout_formulations: presence text: share of 'present' readings that abstain 0.000
- heldout_formulations: presence text: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence source: share of 'present' readings that abstain 0.829
- heldout_formulations: presence source: share of true 'present' readings that abstain 0.829
- heldout_formulations: presence target: share of 'present' readings that abstain 0.312
- heldout_formulations: presence target: share of true 'present' readings that abstain 0.312
- heldout_formulations: presence edge: share of 'present' readings that abstain 0.000
- heldout_formulations: presence edge: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence quantity: share of 'present' readings that abstain 0.143
- heldout_formulations: presence quantity: share of true 'present' readings that abstain 0.143
- heldout_formulations: presence pairing: share of 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: present read present [pooled midpoint (comparison)] 0.667
- heldout_formulations: presence direction: present read present [pooled midpoint (comparison)] 0.000
- heldout_sentences: FULL 0.863
- heldout_sentences: presence object: share of 'present' readings that abstain 0.047
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.047
- heldout_sentences: presence layout: share of 'present' readings that abstain 0.000
- heldout_sentences: presence layout: share of true 'present' readings that abstain 0.000
- heldout_sentences: determiner identity (outside FULL when the legend excludes it) 0.896
- heldout_sentences: heads FULL (lexical order baseline) 0.207
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.536
- heldout_sentences: FULL [depth given] 0.863
- heldout_sentences: FULL [depth and negation given] 0.863
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.715
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.777
- heldout_sentences: presence region: share of 'present' readings that abstain 0.000
- heldout_sentences: presence region: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence source: share of 'present' readings that abstain 0.869
- heldout_sentences: presence source: share of true 'present' readings that abstain 0.869
- heldout_sentences: presence target: share of 'present' readings that abstain 0.256
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.256
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.672
- heldout_sentences: presence target: present read present [pooled midpoint (comparison)] 0.872
- heldout_sentences: presence direction: share of 'present' readings that abstain 0.071
- heldout_sentences: presence direction: share of true 'present' readings that abstain 0.071
- heldout_sentences: presence direction: present read present [pooled midpoint (comparison)] 0.786
- heldout_sentences: presence size: share of 'present' readings that abstain 0.154
- heldout_sentences: presence size: share of true 'present' readings that abstain 0.154
- heldout_sentences: presence amount: share of 'present' readings that abstain 0.061
- heldout_sentences: presence amount: share of true 'present' readings that abstain 0.061
- heldout_sentences: presence size: present read present [pooled midpoint (comparison)] 0.852
- heldout_sentences: presence amount: present read present [pooled midpoint (comparison)] 0.824
- heldout_sentences: presence unit: present read present [pooled midpoint (comparison)] 0.882
- heldout_sentences: presence text: present read present 0.899
- heldout_sentences: presence text: share of 'present' readings that abstain 0.056
- heldout_sentences: presence text: share of true 'present' readings that abstain 0.056
- heldout_sentences: presence text: present read present [pooled midpoint (comparison)] 0.810
- heldout_sentences: presence pairing: share of 'present' readings that abstain 0.100
- heldout_sentences: presence pairing: share of true 'present' readings that abstain 0.100
- heldout_sentences: presence pairing: present read present [pooled midpoint (comparison)] 0.682
- heldout_sentences: presence color: present read present 0.800
- heldout_sentences: presence color: share of 'present' readings that abstain 0.188
- heldout_sentences: presence color: share of true 'present' readings that abstain 0.188
- heldout_sentences: presence color: present read present [pooled midpoint (comparison)] 0.400
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.032
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.032
- heldout_sentences: presence relation: share of 'present' readings that abstain 0.105
- heldout_sentences: presence relation: share of true 'present' readings that abstain 0.105
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.224
- heldout_sentences: presence landmark: share of true 'present' readings that abstain 0.224
- heldout_sentences: presence relation: present read present [pooled midpoint (comparison)] 0.724
- heldout_sentences: presence landmark: present read present [pooled midpoint (comparison)] 0.759
- heldout_sentences: presence anchor: share of 'present' readings that abstain 0.034
- heldout_sentences: presence anchor: share of true 'present' readings that abstain 0.034
- heldout_sentences: presence axis: share of 'present' readings that abstain 0.000
- heldout_sentences: presence axis: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence axis: present read present [pooled midpoint (comparison)] 0.769
- heldout_sentences: presence style: share of 'present' readings that abstain 0.000
- heldout_sentences: presence style: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence edge: share of 'present' readings that abstain 0.000
- heldout_sentences: presence edge: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence quantity: share of 'present' readings that abstain 0.059
- heldout_sentences: presence quantity: share of true 'present' readings that abstain 0.059
- heldout_sentences: presence fraction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities: FULL 0.848
- new_identities: presence object: share of 'present' readings that abstain 0.063
- new_identities: presence object: share of true 'present' readings that abstain 0.063
- new_identities: presence size: share of 'present' readings that abstain 0.000
- new_identities: presence size: share of true 'present' readings that abstain 0.000
- new_identities: presence amount: share of 'present' readings that abstain 0.000
- new_identities: presence amount: share of true 'present' readings that abstain 0.000
- new_identities: presence unit: share of 'present' readings that abstain 0.000
- new_identities: presence unit: share of true 'present' readings that abstain 0.000
- new_identities: heads FULL (model) 0.895
- new_identities: heads FULL (lexical order baseline) 0.060
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.365
- new_identities: FULL [depth given] 0.848
- new_identities: FULL [depth and negation given] 0.848
- new_identities: FULL [pooled midpoint (comparison)] 0.623
- new_identities: role object [pooled midpoint (comparison)] 0.877
- new_identities: role relation [pooled midpoint (comparison)] 0.885
- new_identities: role landmark [pooled midpoint (comparison)] 0.868
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.667
- new_identities: presence text: share of 'present' readings that abstain 0.056
- new_identities: presence text: share of true 'present' readings that abstain 0.056
- new_identities: presence text: present read present [pooled midpoint (comparison)] 0.824
- new_identities: presence relation: present read present 0.815
- new_identities: presence relation: share of 'present' readings that abstain 0.107
- new_identities: presence relation: share of true 'present' readings that abstain 0.107
- new_identities: presence landmark: share of 'present' readings that abstain 0.345
- new_identities: presence landmark: share of true 'present' readings that abstain 0.345
- new_identities: presence relation: present read present [pooled midpoint (comparison)] 0.535
- new_identities: presence landmark: present read present [pooled midpoint (comparison)] 0.605
- new_identities: presence anchor: share of 'present' readings that abstain 0.067
- new_identities: presence anchor: share of true 'present' readings that abstain 0.067
- new_identities: presence fraction: share of 'present' readings that abstain 0.000
- new_identities: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities: presence anchor: present read present [pooled midpoint (comparison)] 0.875
- new_identities: presence source: share of 'present' readings that abstain 0.861
- new_identities: presence source: share of true 'present' readings that abstain 0.861
- new_identities: presence target: share of 'present' readings that abstain 0.353
- new_identities: presence target: share of true 'present' readings that abstain 0.353
- new_identities: presence edge: share of 'present' readings that abstain 0.000
- new_identities: presence edge: share of true 'present' readings that abstain 0.000
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.722
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.778
- new_identities: presence region: share of 'present' readings that abstain 0.000
- new_identities: presence region: share of true 'present' readings that abstain 0.000
- new_identities: presence direction: share of 'present' readings that abstain 0.000
- new_identities: presence direction: share of true 'present' readings that abstain 0.000
- new_identities: presence direction: present read present [pooled midpoint (comparison)] 0.667
- new_identities: presence color: share of 'present' readings that abstain 0.400
- new_identities: presence color: share of true 'present' readings that abstain 0.400
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.200
- new_identities: presence style: share of 'present' readings that abstain 0.000
- new_identities: presence style: share of true 'present' readings that abstain 0.000
- new_identities: presence style: present read present [pooled midpoint (comparison)] 0.667
- train (sample): presence object: share of 'present' readings that abstain 0.038
- train (sample): presence object: share of true 'present' readings that abstain 0.038
- train (sample): presence color: share of 'present' readings that abstain 0.182
- train (sample): presence color: share of true 'present' readings that abstain 0.100
- train (sample): heads FULL (lexical order baseline) 0.240
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.833
- train (sample): presence style: share of 'present' readings that abstain 0.375
- train (sample): presence style: share of true 'present' readings that abstain 0.375
- train (sample): presence direction: share of 'present' readings that abstain 0.000
- train (sample): presence direction: share of true 'present' readings that abstain 0.000
- train (sample): presence size: share of 'present' readings that abstain 0.136
- train (sample): presence size: share of true 'present' readings that abstain 0.136
- train (sample): presence region: share of 'present' readings that abstain 0.000
- train (sample): presence region: share of true 'present' readings that abstain 0.000
- train (sample): presence source: share of 'present' readings that abstain 0.786
- train (sample): presence source: share of true 'present' readings that abstain 0.786
- train (sample): presence target: share of 'present' readings that abstain 0.190
- train (sample): presence target: share of true 'present' readings that abstain 0.190
- train (sample): presence text: share of 'present' readings that abstain 0.043
- train (sample): presence text: share of true 'present' readings that abstain 0.043
- train (sample): presence amount: share of 'present' readings that abstain 0.067
- train (sample): presence amount: share of true 'present' readings that abstain 0.067
- train (sample): presence unit: share of 'present' readings that abstain 0.000
- train (sample): presence unit: share of true 'present' readings that abstain 0.000
- train (sample): presence axis: share of 'present' readings that abstain 0.000
- train (sample): presence axis: share of true 'present' readings that abstain 0.000
- train (sample): presence anchor: share of 'present' readings that abstain 0.000
- train (sample): presence anchor: share of true 'present' readings that abstain 0.000
- train (sample): presence layout: share of 'present' readings that abstain 0.000
- train (sample): presence layout: share of true 'present' readings that abstain 0.000
- train (sample): presence edge: share of 'present' readings that abstain 0.000
- train (sample): presence edge: share of true 'present' readings that abstain 0.000
- train (sample): presence relation: share of 'present' readings that abstain 0.000
- train (sample): presence relation: share of true 'present' readings that abstain 0.000
- train (sample): presence landmark: share of 'present' readings that abstain 0.269
- train (sample): presence landmark: share of true 'present' readings that abstain 0.269
- train (sample): presence pairing: share of 'present' readings that abstain 0.143
- train (sample): presence pairing: share of true 'present' readings that abstain 0.143
- train (sample): presence fraction: share of 'present' readings that abstain 0.000
- train (sample): presence fraction: share of true 'present' readings that abstain 0.000
- train (sample): presence quantity: share of 'present' readings that abstain 0.000
- train (sample): presence quantity: share of true 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_sentences: `would you join QUANT COMPONENT PAIR` FULL 0.000 (n 2)
- heldout_formulations: `attach the SIZE LAYOUT to the COMPONENT with a SIZE EDGE please` FULL 0.000 (n 1)
- heldout_formulations: `i want you to connect the COLOR COMPONENT to the COMPONENT with a COLOR EDGE` FULL 0.000 (n 1)
- heldout_formulations: `i need you to connect LABEL and the SIZE COMPONENT with a SIZE EDGE .` FULL 0.000 (n 1)
- heldout_formulations: `lets put a STYLE COMPONENT REL the STYLE COMPONENT .` FULL 0.000 (n 1)
- heldout_formulations: `i want you to join the COMPONENT to the STYLE COMPONENT with a STYLE EDGE .` FULL 0.000 (n 1)
- heldout_sentences: `join the SIZE COMPONENT to LABEL please` FULL 0.000 (n 1)
- heldout_sentences: `okay so do not make the STYLE COMPONENT NUM UNIT SIZE` FULL 0.000 (n 1)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role size | role style | role text | role relation | role landmark | role region | role anchor | role fraction | role amount | role unit | role direction | role axis | role layout | role pairing | role source | role target | role edge | role quantity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.969±0.007 | 0.896±0.007 | 0.996±0.003 | 1.000±0.000 | 0.998±0.003 | 0.994±0.005 | 1.000±0.000 | 0.994±0.005 | 0.990±0.003 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.998±0.003 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.957±0.003 | 0.963±0.003 | 0.982±0.005 | 1.000±0.000 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.794±0.017 | 0.733±0.015 | 0.892±0.003 | 1.000±0.000 | 0.990±0.006 | 0.975±0.006 | 0.986±0.003 | 0.963±0.006 | 0.957±0.003 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.998±0.003 | 1.000±0.000 | 0.994±0.000 | 1.000±0.000 | 1.000±0.000 | 0.998±0.003 | 0.957±0.003 | 0.963±0.003 | 0.976±0.005 | 0.998±0.003 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.963±0.003 | 0.888±0.005 | 0.996±0.003 | 0.988±0.000 | 0.994±0.000 | 0.988±0.000 | 1.000±0.000 | 1.000±0.000 | 0.994±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.957±0.003 | 0.963±0.003 | 0.988±0.000 | 1.000±0.000 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.017±0.004 (— / 0.017±0.004) |
| heldout_formulations | object | comparison: pooled midpoint | 0.875±0.003 | 1.000±0.000 | 0.938±0.002 |  |
| heldout_formulations | color | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | color | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | size | product: fitted | 1.000±0.000 | 0.998±0.003 | 0.999±0.001 | 0.079±0.063 (1.000 / 0.056±0.039) |
| heldout_formulations | size | comparison: pooled midpoint | 0.861±0.079 | 1.000±0.000 | 0.931±0.039 |  |
| heldout_formulations | style | product: fitted | 0.833±0.136 | 1.000±0.000 | 0.917±0.068 | 0.411±0.068 (— / 0.411±0.068) |
| heldout_formulations | style | comparison: pooled midpoint | 0.278±0.157 | 1.000±0.000 | 0.639±0.079 |  |
| heldout_formulations | text | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | text | comparison: pooled midpoint | 0.933±0.024 | 0.993±0.000 | 0.963±0.012 |  |
| heldout_formulations | relation | product: fitted | 0.947±0.043 | 1.000±0.000 | 0.974±0.021 | 0.128±0.049 (— / 0.128±0.049) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.692±0.062 | 1.000±0.000 | 0.846±0.031 |  |
| heldout_formulations | landmark | product: fitted | 0.965±0.025 | 1.000±0.000 | 0.982±0.012 | 0.255±0.032 (— / 0.255±0.032) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.692±0.043 | 1.000±0.000 | 0.846±0.021 |  |
| heldout_formulations | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.083±0.118 (— / 0.083±0.118) |
| heldout_formulations | amount | comparison: pooled midpoint | 0.958±0.059 | 1.000±0.000 | 0.979±0.029 |  |
| heldout_formulations | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | unit | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | direction | product: fitted | 0.667±0.471 | 1.000±0.000 | 0.833±0.236 | 1.000±0.000 (— / 1.000±0.000) |
| heldout_formulations | direction | comparison: pooled midpoint | 0.000±0.000 | 1.000±0.000 | 0.500±0.000 |  |
| heldout_formulations | axis | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | layout | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | pairing | comparison: pooled midpoint | 0.889±0.157 | 1.000±0.000 | 0.944±0.079 |  |
| heldout_formulations | source | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.781±0.049 (— / 0.781±0.049) |
| heldout_formulations | source | comparison: pooled midpoint | 0.962±0.013 | 1.000±0.000 | 0.981±0.007 |  |
| heldout_formulations | target | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.396±0.059 (— / 0.396±0.059) |
| heldout_formulations | target | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | edge | product: fitted | 0.969±0.026 | 1.000±0.000 | 0.984±0.013 | 0.022±0.015 (— / 0.022±0.015) |
| heldout_formulations | edge | comparison: pooled midpoint | 0.927±0.015 | 1.000±0.000 | 0.964±0.007 |  |
| heldout_formulations | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.143±0.039 (— / 0.143±0.039) |
| heldout_formulations | quantity | comparison: pooled midpoint | 0.984±0.022 | 1.000±0.000 | 0.992±0.011 |  |
| heldout_sentences | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.035±0.011 (— / 0.035±0.011) |
| heldout_sentences | object | comparison: pooled midpoint | 0.935±0.003 | 1.000±0.000 | 0.968±0.002 |  |
| heldout_sentences | color | product: fitted | 0.883±0.062 | 1.000±0.000 | 0.942±0.031 | 0.171±0.012 (— / 0.171±0.012) |
| heldout_sentences | color | comparison: pooled midpoint | 0.283±0.085 | 1.000±0.000 | 0.642±0.042 |  |
| heldout_sentences | size | product: fitted | 0.938±0.035 | 0.999±0.001 | 0.969±0.017 | 0.102±0.046 (1.000 / 0.091±0.047) |
| heldout_sentences | size | comparison: pooled midpoint | 0.778±0.060 | 1.000±0.000 | 0.889±0.030 |  |
| heldout_sentences | style | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.061±0.086 (— / 0.061±0.086) |
| heldout_sentences | style | comparison: pooled midpoint | 0.970±0.043 | 1.000±0.000 | 0.985±0.021 |  |
| heldout_sentences | text | product: fitted | 0.949±0.037 | 0.998±0.001 | 0.974±0.018 | 0.044±0.008 (0.500±0.500 / 0.040±0.013) |
| heldout_sentences | text | comparison: pooled midpoint | 0.819±0.006 | 0.994±0.001 | 0.906±0.004 |  |
| heldout_sentences | relation | product: fitted | 0.939±0.016 | 1.000±0.000 | 0.969±0.008 | 0.059±0.033 (— / 0.059±0.033) |
| heldout_sentences | relation | comparison: pooled midpoint | 0.760±0.037 | 1.000±0.000 | 0.880±0.018 |  |
| heldout_sentences | landmark | product: fitted | 0.956±0.016 | 1.000±0.000 | 0.978±0.008 | 0.209±0.011 (— / 0.209±0.011) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.760±0.026 | 1.000±0.000 | 0.880±0.013 |  |
| heldout_sentences | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.011±0.016 (— / 0.011±0.016) |
| heldout_sentences | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | amount | product: fitted | 0.941±0.042 | 1.000±0.000 | 0.971±0.021 | 0.074±0.019 (— / 0.074±0.019) |
| heldout_sentences | amount | comparison: pooled midpoint | 0.873±0.037 | 1.000±0.000 | 0.936±0.018 |  |
| heldout_sentences | unit | product: fitted | 0.922±0.014 | 1.000±0.000 | 0.961±0.007 | 0.022±0.015 (— / 0.022±0.015) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.892±0.014 | 1.000±0.000 | 0.946±0.007 |  |
| heldout_sentences | direction | product: fitted | 0.988±0.017 | 1.000±0.000 | 0.994±0.008 | 0.072±0.029 (— / 0.072±0.029) |
| heldout_sentences | direction | comparison: pooled midpoint | 0.810±0.034 | 1.000±0.000 | 0.905±0.017 |  |
| heldout_sentences | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | axis | comparison: pooled midpoint | 0.795±0.036 | 1.000±0.000 | 0.897±0.018 |  |
| heldout_sentences | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | layout | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | pairing | product: fitted | 0.955±0.037 | 1.000±0.000 | 0.977±0.019 | 0.111±0.023 (— / 0.111±0.023) |
| heldout_sentences | pairing | comparison: pooled midpoint | 0.758±0.077 | 1.000±0.000 | 0.879±0.039 |  |
| heldout_sentences | source | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.760±0.087 (— / 0.760±0.087) |
| heldout_sentences | source | comparison: pooled midpoint | 0.727±0.041 | 1.000±0.000 | 0.863±0.020 |  |
| heldout_sentences | target | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.222±0.024 (— / 0.222±0.024) |
| heldout_sentences | target | comparison: pooled midpoint | 0.880±0.012 | 1.000±0.000 | 0.940±0.006 |  |
| heldout_sentences | edge | product: fitted | 0.970±0.021 | 1.000±0.000 | 0.985±0.011 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | edge | comparison: pooled midpoint | 0.939±0.021 | 1.000±0.000 | 0.970±0.011 |  |
| heldout_sentences | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.078±0.028 (— / 0.078±0.028) |
| heldout_sentences | quantity | comparison: pooled midpoint | 0.980±0.028 | 1.000±0.000 | 0.990±0.014 |  |
| new_identities | object | product: fitted | 0.997±0.000 | 1.000±0.000 | 0.999±0.000 | 0.039±0.018 (— / 0.039±0.018) |
| new_identities | object | comparison: pooled midpoint | 0.920±0.007 | 1.000±0.000 | 0.960±0.003 |  |
| new_identities | color | product: fitted | 1.000±0.000 | 0.997±0.002 | 0.999±0.001 | 0.443±0.042 (1.000±0.000 / 0.333±0.094) |
| new_identities | color | comparison: pooled midpoint | 0.067±0.094 | 1.000±0.000 | 0.533±0.047 |  |
| new_identities | size | product: fitted | 0.980±0.028 | 1.000±0.000 | 0.990±0.014 | 0.039±0.028 (— / 0.039±0.028) |
| new_identities | size | comparison: pooled midpoint | 0.922±0.028 | 1.000±0.000 | 0.961±0.014 |  |
| new_identities | style | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.111±0.157 (— / 0.111±0.157) |
| new_identities | style | comparison: pooled midpoint | 0.667±0.000 | 1.000±0.000 | 0.833±0.000 |  |
| new_identities | text | product: fitted | 0.968±0.034 | 0.993±0.008 | 0.980±0.015 | 0.052±0.009 (1.000±0.000 / 0.043±0.009) |
| new_identities | text | comparison: pooled midpoint | 0.830±0.017 | 0.985±0.002 | 0.907±0.009 |  |
| new_identities | relation | product: fitted | 0.844±0.049 | 1.000±0.000 | 0.922±0.024 | 0.115±0.011 (— / 0.115±0.011) |
| new_identities | relation | comparison: pooled midpoint | 0.535±0.020 | 1.000±0.000 | 0.768±0.010 |  |
| new_identities | landmark | product: fitted | 0.866±0.046 | 1.000±0.000 | 0.933±0.023 | 0.240±0.075 (— / 0.240±0.075) |
| new_identities | landmark | comparison: pooled midpoint | 0.567±0.040 | 1.000±0.000 | 0.783±0.020 |  |
| new_identities | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | anchor | product: fitted | 0.958±0.029 | 1.000±0.000 | 0.979±0.015 | 0.043±0.030 (— / 0.043±0.030) |
| new_identities | anchor | comparison: pooled midpoint | 0.917±0.029 | 1.000±0.000 | 0.958±0.015 |  |
| new_identities | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | amount | product: fitted | 0.970±0.042 | 1.000±0.000 | 0.985±0.021 | 0.037±0.043 (— / 0.037±0.043) |
| new_identities | amount | comparison: pooled midpoint | 0.962±0.045 | 1.000±0.000 | 0.981±0.022 |  |
| new_identities | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.017±0.016 (— / 0.017±0.016) |
| new_identities | unit | comparison: pooled midpoint | 0.987±0.018 | 1.000±0.000 | 0.994±0.009 |  |
| new_identities | direction | product: fitted | 0.901±0.063 | 1.000±0.000 | 0.951±0.031 | 0.059±0.057 (— / 0.059±0.057) |
| new_identities | direction | comparison: pooled midpoint | 0.679±0.046 | 1.000±0.000 | 0.840±0.023 |  |
| new_identities | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | source | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.787±0.069 (— / 0.787±0.069) |
| new_identities | source | comparison: pooled midpoint | 0.750±0.023 | 1.000±0.000 | 0.875±0.011 |  |
| new_identities | target | product: fitted | 0.981±0.026 | 1.000±0.000 | 0.991±0.013 | 0.294±0.043 (— / 0.294±0.043) |
| new_identities | target | comparison: pooled midpoint | 0.731±0.047 | 1.000±0.000 | 0.866±0.024 |  |
| new_identities | edge | product: fitted | 0.970±0.021 | 1.000±0.000 | 0.985±0.011 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | edge | comparison: pooled midpoint | 0.955±0.000 | 1.000±0.000 | 0.977±0.000 |  |
| new_identities | quantity | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | quantity | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| train (sample) | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.018±0.014 (— / 0.018±0.014) |
| train (sample) | color | product: fitted | 0.967±0.047 | 0.995±0.004 | 0.981±0.022 | 0.226±0.116 (1.000±0.000 / 0.137±0.045) |
| train (sample) | size | product: fitted | 0.942±0.020 | 1.000±0.000 | 0.971±0.010 | 0.139±0.003 (— / 0.139±0.003) |
| train (sample) | style | product: fitted | 0.958±0.059 | 1.000±0.000 | 0.979±0.029 | 0.250±0.177 (— / 0.250±0.177) |
| train (sample) | text | product: fitted | 0.980±0.028 | 1.000±0.000 | 0.990±0.014 | 0.021±0.017 (— / 0.021±0.017) |
| train (sample) | relation | product: fitted | 0.987±0.018 | 1.000±0.000 | 0.994±0.009 | 0.013±0.019 (— / 0.013±0.019) |
| train (sample) | landmark | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.218±0.048 (— / 0.218±0.048) |
| train (sample) | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.089±0.083 (— / 0.089±0.083) |
| train (sample) | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | pairing | product: fitted | 0.952±0.067 | 1.000±0.000 | 0.976±0.034 | 0.048±0.067 (— / 0.048±0.067) |
| train (sample) | source | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.655±0.102 (— / 0.655±0.102) |
| train (sample) | target | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.190±0.078 (— / 0.190±0.078) |
| train (sample) | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
