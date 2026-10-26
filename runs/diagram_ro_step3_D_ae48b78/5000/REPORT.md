# REPORT — world `diagram_ro`, legend sha256:d361fbea318b… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
6200 annotated sentences from 4 files; provenance: {'generator': 6200}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/5000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 195 sentences
- heldout_formulations: 205 sentences
- heldout_sentences: 505 sentences
- mixed: 400 sentences
- new_identities: 400 sentences
- train: 4495 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['250', '35', '45', '90', 'analytics', 'broker', 'crawler', 'dashboard', 'gamma_ray', 'indexer', 'ingest', 'irina', 'loyalty', 'notifications', 'payroll', 'recommendations', 'registry', 'returns', 'routing', 'theta', 'tracking', 'vault', 'victor', 'zeta']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
45743 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit ae48b78. Memory curve: runs/5000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 0.048 [rule: fit; pooled midpoint 0.506 (comparison)] (present 1.013, n 501 / absent 0.000, n 94)
- attr_presence:object: threshold 0.545 [rule: fit; pooled midpoint 0.521 (comparison)] (present 0.843, n 183 / absent 0.198, n 318)
- det_presence:object: threshold 0.546 [rule: fit; pooled midpoint 0.612 (comparison)] (present 1.106, n 172 / absent 0.119, n 329)
- presence:color: threshold 0.046 [rule: fit; pooled midpoint 0.227 (comparison)] (present 0.454, n 20 / absent 0.001, n 575)
- presence:size: threshold 0.079 [rule: fit; pooled midpoint 0.331 (comparison)] (present 0.653, n 50 / absent 0.008, n 545)
- presence:style: threshold 0.004 [rule: fit; pooled midpoint 0.078 (comparison)] (present 0.154, n 19 / absent 0.002, n 576)
- presence:text: threshold 0.095 [rule: fit; pooled midpoint 0.268 (comparison)] (present 0.514, n 73 / absent 0.023, n 522)
- presence:relation: threshold 0.056 [rule: fit; pooled midpoint 0.219 (comparison)] (present 0.416, n 68 / absent 0.022, n 527)
- presence:landmark: threshold 0.165 [rule: fit; pooled midpoint 0.282 (comparison)] (present 0.521, n 68 / absent 0.043, n 527)
- presence:region: threshold 0.251 [rule: fit; pooled midpoint 0.346 (comparison)] (present 0.658, n 47 / absent 0.035, n 548)
- presence:anchor: threshold 0.104 [rule: fit; pooled midpoint 0.268 (comparison)] (present 0.534, n 35 / absent 0.001, n 560)
- presence:fraction: threshold 0.237 [rule: fit; pooled midpoint 0.237 (comparison)] (present 0.469, n 19 / absent 0.005, n 576)
- presence:amount: threshold 0.184 [rule: fit; pooled midpoint 0.357 (comparison)] (present 0.720, n 32 / absent -0.006, n 563)
- presence:unit: threshold 0.323 [rule: fit; pooled midpoint 0.410 (comparison)] (present 0.789, n 32 / absent 0.031, n 563)
- presence:direction: threshold 0.118 [rule: fit; pooled midpoint 0.297 (comparison)] (present 0.591, n 27 / absent 0.002, n 568)
- presence:axis: threshold 0.207 [rule: fit; pooled midpoint 0.342 (comparison)] (present 0.684, n 11 / absent 0.001, n 584)
- presence:layout: threshold 0.070 [rule: fit; pooled midpoint 0.439 (comparison)] (present 0.879, n 18 / absent 0.000, n 577)
- presence:pairing: threshold 0.120 [rule: fit; pooled midpoint 0.221 (comparison)] (present 0.446, n 16 / absent -0.003, n 579)
- presence:source: threshold 0.083 [rule: fit; pooled midpoint 0.350 (comparison)] (present 0.701, n 77 / absent 0.000, n 518)
- presence:target: threshold 0.182 [rule: fit; pooled midpoint 0.401 (comparison)] (present 0.801, n 61 / absent 0.002, n 534)
- presence:edge: threshold 0.334 [rule: fit; pooled midpoint 0.358 (comparison)] (present 0.714, n 46 / absent 0.002, n 549)
- presence:quantity: threshold 0.076 [rule: fit; pooled midpoint 0.090 (comparison)] (present 0.178, n 26 / absent 0.002, n 569)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.005, color 0.083, size 0.143, style 0.200, text 0.013, relation 0.167, landmark 0.006, region 0.111, anchor 0.250, fraction 0.333, amount 0.043, unit 0.500, direction 0.167, axis 0.500, layout 0.143, pairing 0.500, source 0.006, target 0.006, edge 0.125, quantity 0.043, predicate 0.019

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 205 of 205)
| axis | accuracy |
|---|---|
| FULL | 0.818±0.008 |
| FULL [depth given] | 0.818±0.008 |
| FULL [depth and negation given] | 0.818±0.008 |
| FULL [presence not decided] | 0.844±0.008 |
| FULL [pooled midpoint (comparison)] | 0.720±0.005 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.022±0.003 |
| presence object: share of true 'present' readings that abstain | 0.022±0.003 |
| presence color: absent read absent | 0.993±0.002 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 1.000±0.000 |
| presence text: present read present | 0.987±0.018 |
| presence text: share of 'present' readings that abstain | 0.039±0.033 |
| presence text: share of true 'present' readings that abstain | 0.039±0.033 |
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
| role object | 0.940±0.002 |
| head object | 1.000±0.000 |
| lexical order head object | 0.180±0.000 |
| lexical bag head object | 0.117±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.946±0.000 |
| occupancy: known filler | 0.962±0.001 |
| role color | 0.993±0.002 |
| head color | 0.993±0.002 |
| lexical order head color | 0.995±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 1.000±0.000 |
| head size | 1.000±0.000 |
| lexical order head size | 0.927±0.000 |
| lexical bag head size | 0.927±0.000 |
| role style | 0.995±0.004 |
| head style | 0.995±0.004 |
| lexical order head style | 0.941±0.000 |
| lexical bag head style | 0.941±0.000 |
| role text | 0.998±0.002 |
| head text | 0.998±0.002 |
| lexical order head text | 0.873±0.000 |
| lexical bag head text | 0.878±0.000 |
| role relation | 0.987±0.008 |
| head relation | 0.987±0.008 |
| lexical order head relation | 0.859±0.000 |
| lexical bag head relation | 0.859±0.000 |
| role landmark | 0.956±0.004 |
| head landmark | 0.976±0.004 |
| lexical order head landmark | 0.859±0.000 |
| lexical bag head landmark | 0.849±0.000 |
| role region | 0.995±0.000 |
| head region | 0.995±0.000 |
| lexical order head region | 0.893±0.000 |
| lexical bag head region | 0.893±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.927±0.000 |
| lexical bag head anchor | 0.932±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.927±0.000 |
| lexical bag head fraction | 0.927±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.971±0.000 |
| lexical bag head amount | 0.971±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.971±0.000 |
| lexical bag head unit | 0.971±0.000 |
| role direction | 0.998±0.002 |
| head direction | 0.998±0.002 |
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
| role source | 0.945±0.008 |
| head source | 0.982±0.006 |
| lexical order head source | 0.829±0.000 |
| lexical bag head source | 0.829±0.000 |
| role target | 0.979±0.002 |
| head target | 0.998±0.002 |
| lexical order head target | 0.854±0.000 |
| lexical bag head target | 0.854±0.000 |
| role edge | 0.987±0.002 |
| head edge | 0.992±0.002 |
| lexical order head edge | 0.854±0.000 |
| lexical bag head edge | 0.854±0.000 |
| role quantity | 0.992±0.002 |
| head quantity | 0.992±0.002 |
| lexical order head quantity | 0.927±0.000 |
| lexical bag head quantity | 0.927±0.000 |
| heads FULL (model) | 0.922±0.007 |
| heads FULL (lexical order baseline) | 0.010±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.034±0.000 |
| role object [presence not decided] | 0.938±0.005 |
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
| role source [presence not decided] | 0.943±0.010 |
| role target [presence not decided] | 0.977±0.005 |
| role edge [presence not decided] | 0.993±0.002 |
| role quantity [presence not decided] | 1.000±0.000 |
| heads FULL (model) [presence not decided] | 0.963±0.008 |
| role object [pooled midpoint (comparison)] | 0.902±0.008 |
| role color [pooled midpoint (comparison)] | 1.000±0.000 |
| role size [pooled midpoint (comparison)] | 1.000±0.000 |
| role style [pooled midpoint (comparison)] | 0.980±0.007 |
| role text [pooled midpoint (comparison)] | 0.985±0.004 |
| role relation [pooled midpoint (comparison)] | 0.945±0.005 |
| role landmark [pooled midpoint (comparison)] | 0.941±0.004 |
| role region [pooled midpoint (comparison)] | 0.987±0.005 |
| role anchor [pooled midpoint (comparison)] | 1.000±0.000 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 1.000±0.000 |
| role unit [pooled midpoint (comparison)] | 1.000±0.000 |
| role direction [pooled midpoint (comparison)] | 0.995±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.941±0.007 |
| role target [pooled midpoint (comparison)] | 0.977±0.005 |
| role edge [pooled midpoint (comparison)] | 0.985±0.000 |
| role quantity [pooled midpoint (comparison)] | 0.985±0.004 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.800±0.008 |
| presence object: present read present [pooled midpoint (comparison)] | 0.948±0.003 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.885±0.031 |
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
| presence style: present read present | 0.917±0.068 |
| presence style: share of 'present' readings that abstain | 0.518±0.061 |
| presence style: share of true 'present' readings that abstain | 0.518±0.061 |
| presence style: present read present [pooled midpoint (comparison)] | 0.667±0.118 |
| presence region: present read present | 0.955±0.000 |
| presence region: share of 'present' readings that abstain | 0.016±0.022 |
| presence region: share of true 'present' readings that abstain | 0.016±0.022 |
| presence region: present read present [pooled midpoint (comparison)] | 0.879±0.043 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.000±0.000 |
| presence amount: share of true 'present' readings that abstain | 0.000±0.000 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present | 0.908±0.059 |
| presence relation: share of 'present' readings that abstain | 0.048±0.044 |
| presence relation: share of true 'present' readings that abstain | 0.048±0.044 |
| presence landmark: present read present | 0.828±0.028 |
| presence landmark: share of 'present' readings that abstain | 0.057±0.054 |
| presence landmark: share of true 'present' readings that abstain | 0.057±0.054 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.609±0.033 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.724±0.028 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.895±0.036 |
| presence source: share of 'present' readings that abstain | 0.763±0.137 |
| presence source: share of true 'present' readings that abstain | 0.763±0.137 |
| presence target: present read present | 0.989±0.016 |
| presence target: share of 'present' readings that abstain | 0.056±0.015 |
| presence target: share of true 'present' readings that abstain | 0.056±0.015 |
| presence edge: present read present | 0.944±0.016 |
| presence edge: share of 'present' readings that abstain | 0.011±0.016 |
| presence edge: share of true 'present' readings that abstain | 0.011±0.016 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.857±0.023 |
| presence target: present read present [pooled midpoint (comparison)] | 0.978±0.031 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.933±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: present read present | 0.889±0.031 |
| presence quantity: share of 'present' readings that abstain | 0.174±0.028 |
| presence quantity: share of true 'present' readings that abstain | 0.174±0.028 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.800±0.054 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.556±0.079 |
| presence color: share of true 'present' readings that abstain | 0.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: present read present | 0.833±0.236 |
| presence direction: share of 'present' readings that abstain | 0.167±0.236 |
| presence direction: share of true 'present' readings that abstain | 0.167±0.236 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.500±0.000 |

residual mean 0.059±0.008; status {'ok': 161, 'abstain': 44}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.412 / 0.300 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.929 | 0.315 / 0.192 | 0.98 | 0.060 | 0.006 / 0.012 |
| roles (pooled) | 0.901 | 0.215 / 0.040 | 0.88 | 0.043 | 0.062 / 0.056 |
| role text | 1.000 | 0.214 / 0.125 | 1.00 | 0.000 | 0.000 / 0.000 |
| role size | 1.000 | 0.226 / 0.168 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 1.000 | 0.077 / 0.027 | 0.50 | 0.000 | 0.500 / 0.000 |
| role region | 0.955 | 0.185 / 0.125 | 0.91 | 0.000 | 0.045 / 0.045 |
| role amount | 1.000 | 0.234 / 0.193 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.239 / 0.215 | 1.00 | 0.000 | 0.000 / 0.000 |
| role relation | 0.931 | 0.154 / 0.047 | 0.90 | 0.000 | 0.034 / 0.069 |
| role landmark | 0.724 | 0.143 / 0.000 | 0.86 | 0.138 | 0.000 / 0.138 |
| role source | 0.629 | 0.026 / 0.000 | 0.17 | 0.029 | 0.486 / 0.343 |
| role target | 0.833 | 0.132 / 0.082 | 0.93 | 0.133 | 0.033 / 0.033 |
| role edge | 0.900 | 0.188 / 0.149 | 0.93 | 0.033 | 0.000 / 0.067 |
| role anchor | 1.000 | 0.273 / 0.240 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.174 / 0.116 | 1.00 | 0.000 | 0.000 / 0.000 |
| role quantity | 0.867 | 0.096 / 0.017 | 0.73 | 0.000 | 0.133 / 0.133 |
| role color | 1.000 | 0.196 / 0.196 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.265 / 0.251 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 1.000 | 0.262 / 0.149 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.221 / 0.110 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_sentences — catalog candidates (n = 505 of 505)
| axis | accuracy |
|---|---|
| FULL | 0.826±0.005 |
| FULL [depth given] | 0.826±0.005 |
| FULL [depth and negation given] | 0.826±0.005 |
| FULL [pooled midpoint (comparison)] | 0.716±0.011 |
| presence object: present read present | 0.995±0.002 |
| presence object: share of 'present' readings that abstain | 0.007±0.003 |
| presence object: share of true 'present' readings that abstain | 0.007±0.003 |
| presence color: absent read absent | 0.998±0.000 |
| presence size: present read present | 0.919±0.071 |
| presence size: share of 'present' readings that abstain | 0.052±0.027 |
| presence size: share of true 'present' readings that abstain | 0.054±0.028 |
| presence style: absent read absent | 0.997±0.002 |
| presence text: absent read absent | 1.000±0.000 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.983±0.012 |
| presence amount: share of 'present' readings that abstain | 0.017±0.012 |
| presence amount: share of true 'present' readings that abstain | 0.017±0.012 |
| presence unit: present read present | 0.983±0.012 |
| presence unit: share of 'present' readings that abstain | 0.017±0.012 |
| presence unit: share of true 'present' readings that abstain | 0.017±0.012 |
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
| role object | 0.949±0.008 |
| head object | 0.996±0.002 |
| lexical order head object | 0.160±0.000 |
| lexical bag head object | 0.188±0.000 |
| occupancy: known filler | 0.957±0.006 |
| role color | 0.996±0.002 |
| head color | 0.996±0.002 |
| lexical order head color | 0.947±0.000 |
| lexical bag head color | 0.947±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.993±0.005 |
| head size | 0.993±0.005 |
| lexical order head size | 0.935±0.000 |
| lexical bag head size | 0.956±0.000 |
| role style | 0.995±0.002 |
| head style | 0.995±0.002 |
| lexical order head style | 0.990±0.000 |
| lexical bag head style | 0.990±0.000 |
| role text | 0.986±0.006 |
| head text | 0.986±0.006 |
| lexical order head text | 0.875±0.000 |
| lexical bag head text | 0.903±0.000 |
| role relation | 0.991±0.007 |
| head relation | 0.991±0.007 |
| lexical order head relation | 0.879±0.000 |
| lexical bag head relation | 0.885±0.000 |
| role landmark | 0.963±0.003 |
| head landmark | 0.981±0.005 |
| lexical order head landmark | 0.879±0.000 |
| lexical bag head landmark | 0.861±0.000 |
| role region | 0.991±0.004 |
| head region | 0.991±0.004 |
| lexical order head region | 0.923±0.000 |
| lexical bag head region | 0.935±0.000 |
| role anchor | 0.995±0.002 |
| head anchor | 0.995±0.002 |
| lexical order head anchor | 0.966±0.000 |
| lexical bag head anchor | 0.972±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.988±0.000 |
| lexical bag head fraction | 0.990±0.000 |
| role amount | 0.999±0.001 |
| head amount | 0.999±0.001 |
| lexical order head amount | 0.923±0.000 |
| lexical bag head amount | 0.947±0.000 |
| role unit | 0.999±0.001 |
| head unit | 0.999±0.001 |
| lexical order head unit | 0.923±0.000 |
| lexical bag head unit | 0.943±0.000 |
| role direction | 0.996±0.002 |
| head direction | 0.996±0.002 |
| lexical order head direction | 0.937±0.000 |
| lexical bag head direction | 0.943±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.962±0.000 |
| lexical bag head axis | 0.962±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.945±0.000 |
| lexical bag head layout | 0.945±0.000 |
| role pairing | 0.999±0.002 |
| head pairing | 0.999±0.002 |
| lexical order head pairing | 0.968±0.000 |
| lexical bag head pairing | 0.972±0.000 |
| role source | 0.953±0.007 |
| head source | 0.986±0.009 |
| lexical order head source | 0.869±0.000 |
| lexical bag head source | 0.881±0.000 |
| role target | 0.987±0.001 |
| head target | 0.997±0.001 |
| lexical order head target | 0.901±0.000 |
| lexical bag head target | 0.915±0.000 |
| role edge | 0.999±0.001 |
| head edge | 0.999±0.001 |
| lexical order head edge | 0.941±0.000 |
| lexical bag head edge | 0.941±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.970±0.000 |
| lexical bag head quantity | 0.982±0.000 |
| heads FULL (model) | 0.908±0.008 |
| heads FULL (lexical order baseline) | 0.018±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.071±0.000 |
| role object [pooled midpoint (comparison)] | 0.891±0.008 |
| role color [pooled midpoint (comparison)] | 0.985±0.001 |
| role size [pooled midpoint (comparison)] | 0.985±0.001 |
| role style [pooled midpoint (comparison)] | 0.996±0.000 |
| role text [pooled midpoint (comparison)] | 0.975±0.001 |
| role relation [pooled midpoint (comparison)] | 0.965±0.006 |
| role landmark [pooled midpoint (comparison)] | 0.950±0.005 |
| role region [pooled midpoint (comparison)] | 0.980±0.003 |
| role anchor [pooled midpoint (comparison)] | 0.991±0.001 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.996±0.002 |
| role unit [pooled midpoint (comparison)] | 0.997±0.001 |
| role direction [pooled midpoint (comparison)] | 0.993±0.001 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 0.995±0.004 |
| role pairing [pooled midpoint (comparison)] | 0.999±0.002 |
| role source [pooled midpoint (comparison)] | 0.938±0.005 |
| role target [pooled midpoint (comparison)] | 0.980±0.002 |
| role edge [pooled midpoint (comparison)] | 0.999±0.001 |
| role quantity [pooled midpoint (comparison)] | 0.999±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.771±0.011 |
| presence object: present read present [pooled midpoint (comparison)] | 0.937±0.005 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.798±0.029 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence text: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.949±0.021 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.957±0.012 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence size: absent read absent | 0.998±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.894±0.069 |
| presence source: share of 'present' readings that abstain | 0.575±0.140 |
| presence source: share of true 'present' readings that abstain | 0.575±0.140 |
| presence target: present read present | 0.980±0.000 |
| presence target: share of 'present' readings that abstain | 0.034±0.025 |
| presence target: share of true 'present' readings that abstain | 0.027±0.019 |
| presence edge: present read present | 0.989±0.016 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.931±0.003 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.733±0.051 |
| presence target: present read present [pooled midpoint (comparison)] | 0.871±0.025 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.989±0.016 |
| presence relation: present read present | 0.929±0.060 |
| presence relation: share of 'present' readings that abstain | 0.103±0.049 |
| presence relation: share of true 'present' readings that abstain | 0.103±0.049 |
| presence landmark: present read present | 0.842±0.041 |
| presence landmark: share of 'present' readings that abstain | 0.092±0.026 |
| presence landmark: share of true 'present' readings that abstain | 0.092±0.026 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.751±0.045 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.734±0.055 |
| presence text: present read present | 0.889±0.047 |
| presence text: share of 'present' readings that abstain | 0.054±0.003 |
| presence text: share of true 'present' readings that abstain | 0.054±0.003 |
| presence text: present read present [pooled midpoint (comparison)] | 0.812±0.008 |
| presence anchor: present read present | 0.863±0.073 |
| presence anchor: share of 'present' readings that abstain | 0.086±0.061 |
| presence anchor: share of true 'present' readings that abstain | 0.086±0.061 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.745±0.028 |
| presence direction: present read present | 0.938±0.026 |
| presence direction: share of 'present' readings that abstain | 0.044±0.014 |
| presence direction: share of true 'present' readings that abstain | 0.044±0.014 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.914±0.015 |
| presence pairing: present read present | 0.958±0.059 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.958±0.059 |
| presence region: present read present | 0.880±0.048 |
| presence region: share of 'present' readings that abstain | 0.036±0.051 |
| presence region: share of true 'present' readings that abstain | 0.036±0.051 |
| presence region: present read present [pooled midpoint (comparison)] | 0.763±0.037 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.067±0.000 |
| presence quantity: share of true 'present' readings that abstain | 0.067±0.000 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.978±0.031 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.012±0.017 |
| presence layout: share of true 'present' readings that abstain | 0.012±0.017 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.917±0.067 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: present read present | 0.963±0.030 |
| presence color: share of 'present' readings that abstain | 0.074±0.029 |
| presence color: share of true 'present' readings that abstain | 0.038±0.030 |
| presence color: present read present [pooled midpoint (comparison)] | 0.716±0.017 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.676±0.128 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.111±0.157 |
| presence fraction: share of true 'present' readings that abstain | 0.111±0.157 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.600±0.163 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.080±0.007; status {'ok': 429, 'abstain': 76}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.434 / 0.325 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.927 | 0.323 / 0.196 | 0.99 | 0.066 | 0.005 / 0.007 |
| roles (pooled) | 0.907 | 0.236 / 0.055 | 0.91 | 0.043 | 0.045 / 0.050 |
| role size | 0.970 | 0.192 / 0.077 | 0.94 | 0.000 | 0.030 / 0.030 |
| role amount | 0.974 | 0.204 / 0.150 | 0.97 | 0.000 | 0.000 / 0.026 |
| role unit | 0.974 | 0.243 / 0.162 | 0.97 | 0.000 | 0.000 / 0.026 |
| role source | 0.576 | 0.026 / 0.000 | 0.18 | 0.076 | 0.470 / 0.348 |
| role target | 0.880 | 0.152 / 0.093 | 0.94 | 0.100 | 0.040 / 0.020 |
| role edge | 1.000 | 0.216 / 0.182 | 1.00 | 0.000 | 0.000 / 0.000 |
| role relation | 1.000 | 0.179 / 0.104 | 0.97 | 0.000 | 0.033 / 0.000 |
| role landmark | 0.721 | 0.138 / 0.000 | 0.84 | 0.131 | 0.016 / 0.148 |
| role text | 0.937 | 0.199 / 0.041 | 0.89 | 0.000 | 0.048 / 0.063 |
| role anchor | 0.941 | 0.215 / 0.024 | 0.82 | 0.000 | 0.118 / 0.059 |
| role direction | 0.969 | 0.228 / 0.069 | 0.91 | 0.000 | 0.062 / 0.031 |
| role pairing | 1.000 | 0.249 / 0.155 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 0.846 | 0.187 / 0.000 | 0.85 | 0.000 | 0.000 / 0.154 |
| role quantity | 1.000 | 0.137 / 0.094 | 0.93 | 0.000 | 0.067 / 0.000 |
| role layout | 1.000 | 0.266 / 0.217 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.310 / 0.266 | 1.00 | 0.000 | 0.000 / 0.000 |
| role color | 0.963 | 0.174 / 0.082 | 0.96 | 0.000 | 0.000 / 0.037 |
| role fraction | 1.000 | 0.181 / 0.104 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.800 | 0.074 / 0.041 | 0.60 | 0.000 | 0.200 / 0.200 |

### mixed — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.824±0.012 |
| FULL [depth given] | 0.824±0.012 |
| FULL [depth and negation given] | 0.824±0.012 |
| FULL [pooled midpoint (comparison)] | 0.681±0.016 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.012±0.004 |
| presence object: share of true 'present' readings that abstain | 0.012±0.004 |
| presence color: absent read absent | 0.996±0.003 |
| presence size: absent read absent | 0.999±0.001 |
| presence style: absent read absent | 0.999±0.001 |
| presence text: absent read absent | 1.000±0.000 |
| presence relation: present read present | 0.861±0.072 |
| presence relation: share of 'present' readings that abstain | 0.054±0.061 |
| presence relation: share of true 'present' readings that abstain | 0.054±0.061 |
| presence landmark: present read present | 0.825±0.020 |
| presence landmark: share of 'present' readings that abstain | 0.105±0.037 |
| presence landmark: share of true 'present' readings that abstain | 0.097±0.032 |
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
| structure (depth, negation) | 0.999±0.001 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.999±0.001 |
| event type (synonym table) | 0.999±0.001 |
| role object | 0.965±0.002 |
| head object | 0.999±0.001 |
| lexical order head object | 0.130±0.000 |
| lexical bag head object | 0.260±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.919±0.006 |
| occupancy: known filler | 0.951±0.006 |
| role color | 0.995±0.002 |
| head color | 0.995±0.002 |
| lexical order head color | 0.955±0.000 |
| lexical bag head color | 0.958±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.997±0.001 |
| head size | 0.997±0.001 |
| lexical order head size | 0.965±0.000 |
| lexical bag head size | 0.975±0.000 |
| role style | 0.998±0.002 |
| head style | 0.998±0.002 |
| lexical order head style | 0.980±0.000 |
| lexical bag head style | 0.983±0.000 |
| role text | 0.992±0.007 |
| head text | 0.992±0.007 |
| lexical order head text | 0.880±0.000 |
| lexical bag head text | 0.892±0.000 |
| role relation | 0.983±0.008 |
| head relation | 0.983±0.008 |
| lexical order head relation | 0.885±0.000 |
| lexical bag head relation | 0.895±0.000 |
| role landmark | 0.963±0.004 |
| head landmark | 0.978±0.004 |
| lexical order head landmark | 0.885±0.000 |
| lexical bag head landmark | 0.890±0.000 |
| role region | 0.988±0.002 |
| head region | 0.988±0.002 |
| lexical order head region | 0.905±0.000 |
| lexical bag head region | 0.912±0.000 |
| role anchor | 0.986±0.004 |
| head anchor | 0.986±0.004 |
| lexical order head anchor | 0.902±0.000 |
| lexical bag head anchor | 0.927±0.000 |
| role fraction | 0.997±0.002 |
| head fraction | 0.997±0.002 |
| lexical order head fraction | 0.948±0.000 |
| lexical bag head fraction | 0.955±0.000 |
| role amount | 0.998±0.001 |
| head amount | 0.998±0.001 |
| lexical order head amount | 0.932±0.000 |
| lexical bag head amount | 0.948±0.000 |
| role unit | 0.998±0.001 |
| head unit | 0.998±0.001 |
| lexical order head unit | 0.932±0.000 |
| lexical bag head unit | 0.945±0.000 |
| role direction | 0.995±0.004 |
| head direction | 0.995±0.004 |
| lexical order head direction | 0.938±0.000 |
| lexical bag head direction | 0.940±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.958±0.000 |
| lexical bag head axis | 0.963±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.945±0.000 |
| lexical bag head layout | 0.945±0.000 |
| role pairing | 0.998±0.002 |
| head pairing | 0.998±0.002 |
| lexical order head pairing | 0.960±0.000 |
| lexical bag head pairing | 0.970±0.000 |
| role source | 0.948±0.003 |
| head source | 0.992±0.003 |
| lexical order head source | 0.890±0.000 |
| lexical bag head source | 0.892±0.000 |
| role target | 0.988±0.001 |
| head target | 0.998±0.001 |
| lexical order head target | 0.930±0.000 |
| lexical bag head target | 0.938±0.000 |
| role edge | 0.991±0.001 |
| head edge | 0.997±0.002 |
| lexical order head edge | 0.948±0.000 |
| lexical bag head edge | 0.953±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.980±0.000 |
| lexical bag head quantity | 0.985±0.000 |
| heads FULL (model) | 0.906±0.010 |
| heads FULL (lexical order baseline) | 0.018±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.102±0.000 |
| role object [pooled midpoint (comparison)] | 0.897±0.009 |
| role color [pooled midpoint (comparison)] | 0.986±0.001 |
| role size [pooled midpoint (comparison)] | 0.997±0.001 |
| role style [pooled midpoint (comparison)] | 0.996±0.001 |
| role text [pooled midpoint (comparison)] | 0.976±0.004 |
| role relation [pooled midpoint (comparison)] | 0.954±0.007 |
| role landmark [pooled midpoint (comparison)] | 0.948±0.004 |
| role region [pooled midpoint (comparison)] | 0.973±0.001 |
| role anchor [pooled midpoint (comparison)] | 0.971±0.003 |
| role fraction [pooled midpoint (comparison)] | 0.997±0.001 |
| role amount [pooled midpoint (comparison)] | 0.998±0.000 |
| role unit [pooled midpoint (comparison)] | 0.998±0.000 |
| role direction [pooled midpoint (comparison)] | 0.989±0.001 |
| role axis [pooled midpoint (comparison)] | 0.998±0.000 |
| role layout [pooled midpoint (comparison)] | 0.996±0.002 |
| role pairing [pooled midpoint (comparison)] | 0.992±0.004 |
| role source [pooled midpoint (comparison)] | 0.942±0.004 |
| role target [pooled midpoint (comparison)] | 0.984±0.002 |
| role edge [pooled midpoint (comparison)] | 0.989±0.001 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.745±0.017 |
| presence object: present read present [pooled midpoint (comparison)] | 0.944±0.009 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.615±0.058 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.667±0.065 |
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
| presence landmark: absent read absent | 0.999±0.001 |
| presence region: present read present | 0.868±0.021 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 0.739±0.013 |
| presence anchor: present read present | 0.855±0.044 |
| presence anchor: share of 'present' readings that abstain | 0.048±0.048 |
| presence anchor: share of true 'present' readings that abstain | 0.048±0.048 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.701±0.032 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.924±0.043 |
| presence amount: present read present | 0.975±0.017 |
| presence amount: share of 'present' readings that abstain | 0.012±0.017 |
| presence amount: share of true 'present' readings that abstain | 0.012±0.017 |
| presence unit: present read present | 0.975±0.017 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.963±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.963±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.932±0.019 |
| presence source: share of 'present' readings that abstain | 0.612±0.122 |
| presence source: share of true 'present' readings that abstain | 0.612±0.122 |
| presence target: present read present | 0.976±0.017 |
| presence target: share of 'present' readings that abstain | 0.049±0.018 |
| presence target: share of true 'present' readings that abstain | 0.049±0.018 |
| presence edge: present read present | 0.937±0.045 |
| presence edge: share of 'present' readings that abstain | 0.051±0.002 |
| presence edge: share of true 'present' readings that abstain | 0.051±0.002 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.793±0.046 |
| presence target: present read present [pooled midpoint (comparison)] | 0.917±0.034 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.905±0.000 |
| presence size: present read present | 0.929±0.000 |
| presence size: share of 'present' readings that abstain | 0.024±0.034 |
| presence size: share of true 'present' readings that abstain | 0.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.974±0.036 |
| presence region: share of 'present' readings that abstain | 0.071±0.030 |
| presence region: share of true 'present' readings that abstain | 0.071±0.030 |
| presence text: present read present | 0.931±0.055 |
| presence text: present read present [pooled midpoint (comparison)] | 0.811±0.029 |
| presence text: share of 'present' readings that abstain | 0.076±0.016 |
| presence text: share of true 'present' readings that abstain | 0.076±0.016 |
| presence fraction: present read present | 0.937±0.045 |
| presence fraction: share of 'present' readings that abstain | 0.069±0.066 |
| presence fraction: share of true 'present' readings that abstain | 0.069±0.066 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.937±0.022 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.941±0.000 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.000±0.000 |
| presence quantity: share of true 'present' readings that abstain | 0.000±0.000 |
| presence quantity: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 0.920±0.065 |
| presence direction: share of 'present' readings that abstain | 0.070±0.035 |
| presence direction: share of true 'present' readings that abstain | 0.070±0.035 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.827±0.019 |
| presence pairing: present read present | 0.938±0.051 |
| presence pairing: share of 'present' readings that abstain | 0.157±0.084 |
| presence pairing: share of true 'present' readings that abstain | 0.157±0.084 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.923±0.063 |
| presence style: present read present | 0.917±0.059 |
| presence style: share of 'present' readings that abstain | 0.185±0.180 |
| presence style: share of true 'present' readings that abstain | 0.143±0.202 |
| presence style: present read present [pooled midpoint (comparison)] | 0.792±0.059 |
| presence color: present read present | 0.981±0.026 |
| presence color: share of 'present' readings that abstain | 0.218±0.072 |
| presence color: share of true 'present' readings that abstain | 0.150±0.023 |
| presence color: present read present [pooled midpoint (comparison)] | 0.685±0.026 |
| presence size: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.081±0.003; status {'ok': 337, 'abstain': 63}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.423 / 0.335 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.963 | 0.322 / 0.176 | 0.99 | 0.034 | 0.006 / 0.003 |
| roles (pooled) | 0.909 | 0.234 / 0.048 | 0.90 | 0.033 | 0.046 / 0.058 |
| role relation | 0.957 | 0.154 / 0.069 | 0.93 | 0.000 | 0.022 / 0.043 |
| role landmark | 0.696 | 0.145 / 0.000 | 0.78 | 0.130 | 0.043 / 0.174 |
| role region | 0.842 | 0.185 / 0.000 | 0.76 | 0.000 | 0.079 / 0.158 |
| role anchor | 0.897 | 0.180 / 0.018 | 0.79 | 0.000 | 0.103 / 0.103 |
| role layout | 1.000 | 0.258 / 0.159 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 0.963 | 0.210 / 0.161 | 0.96 | 0.000 | 0.000 / 0.037 |
| role unit | 0.963 | 0.251 / 0.180 | 0.96 | 0.000 | 0.000 / 0.037 |
| role source | 0.500 | 0.032 / 0.001 | 0.23 | 0.114 | 0.386 / 0.386 |
| role target | 0.821 | 0.146 / 0.058 | 0.89 | 0.107 | 0.036 / 0.071 |
| role edge | 0.810 | 0.187 / 0.048 | 0.86 | 0.095 | 0.048 / 0.095 |
| role size | 0.929 | 0.204 / 0.117 | 0.93 | 0.000 | 0.000 / 0.071 |
| role text | 0.958 | 0.197 / 0.073 | 0.90 | 0.000 | 0.062 / 0.042 |
| role fraction | 0.905 | 0.162 / 0.097 | 0.90 | 0.000 | 0.000 / 0.095 |
| role axis | 1.000 | 0.257 / 0.172 | 1.00 | 0.000 | 0.000 / 0.000 |
| role quantity | 1.000 | 0.136 / 0.080 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.201 / 0.067 | 0.88 | 0.000 | 0.120 / 0.000 |
| role pairing | 1.000 | 0.235 / 0.128 | 0.94 | 0.000 | 0.062 / 0.000 |
| role style | 1.000 | 0.094 / 0.054 | 1.00 | 0.000 | 0.000 / 0.000 |
| role color | 0.944 | 0.164 / 0.039 | 0.83 | 0.000 | 0.111 / 0.056 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.851±0.017 |
| FULL [depth given] | 0.851±0.017 |
| FULL [depth and negation given] | 0.851±0.017 |
| FULL [pooled midpoint (comparison)] | 0.742±0.011 |
| presence object: present read present | 0.996±0.003 |
| presence object: share of 'present' readings that abstain | 0.018±0.003 |
| presence object: share of true 'present' readings that abstain | 0.018±0.003 |
| presence color: absent read absent | 0.996±0.001 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 0.998±0.001 |
| presence text: absent read absent | 1.000±0.000 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.999±0.002 |
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
| structure (depth, negation) | 0.999±0.001 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.999±0.001 |
| event type (synonym table) | 0.999±0.001 |
| role object | 0.967±0.011 |
| head object | 0.990±0.004 |
| lexical order head object | 0.092±0.000 |
| lexical bag head object | 0.290±0.000 |
| occupancy: unknown filler | 0.946±0.020 |
| role color | 0.995±0.002 |
| head color | 0.995±0.002 |
| lexical order head color | 0.983±0.000 |
| lexical bag head color | 0.983±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.993±0.004 |
| head size | 0.993±0.004 |
| lexical order head size | 0.948±0.000 |
| lexical bag head size | 0.975±0.000 |
| role style | 0.998±0.000 |
| head style | 0.998±0.000 |
| lexical order head style | 0.990±0.000 |
| lexical bag head style | 0.990±0.000 |
| role text | 0.959±0.019 |
| head text | 0.959±0.019 |
| lexical order head text | 0.550±0.000 |
| lexical bag head text | 0.682±0.000 |
| role relation | 0.988±0.004 |
| head relation | 0.988±0.004 |
| lexical order head relation | 0.750±0.000 |
| lexical bag head relation | 0.757±0.000 |
| role landmark | 0.955±0.004 |
| head landmark | 0.982±0.006 |
| lexical order head landmark | 0.750±0.000 |
| lexical bag head landmark | 0.748±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.953±0.000 |
| lexical bag head region | 0.955±0.000 |
| role anchor | 0.992±0.001 |
| head anchor | 0.992±0.001 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 0.965±0.000 |
| role fraction | 0.997±0.001 |
| head fraction | 0.997±0.001 |
| lexical order head fraction | 0.978±0.000 |
| lexical bag head fraction | 0.980±0.000 |
| role amount | 0.998±0.001 |
| head amount | 0.998±0.001 |
| lexical order head amount | 0.802±0.000 |
| lexical bag head amount | 0.850±0.000 |
| role unit | 0.998±0.001 |
| head unit | 0.998±0.001 |
| lexical order head unit | 0.802±0.000 |
| lexical bag head unit | 0.845±0.000 |
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
| role source | 0.985±0.002 |
| head source | 0.998±0.002 |
| lexical order head source | 0.908±0.000 |
| lexical bag head source | 0.912±0.000 |
| role target | 0.994±0.001 |
| head target | 0.997±0.001 |
| lexical order head target | 0.908±0.000 |
| lexical bag head target | 0.920±0.000 |
| role edge | 0.992±0.001 |
| head edge | 0.999±0.001 |
| lexical order head edge | 0.943±0.000 |
| lexical bag head edge | 0.943±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.902±0.023 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.083±0.000 |
| role object [pooled midpoint (comparison)] | 0.919±0.005 |
| role color [pooled midpoint (comparison)] | 0.996±0.001 |
| role size [pooled midpoint (comparison)] | 0.986±0.003 |
| role style [pooled midpoint (comparison)] | 0.998±0.000 |
| role text [pooled midpoint (comparison)] | 0.917±0.007 |
| role relation [pooled midpoint (comparison)] | 0.967±0.012 |
| role landmark [pooled midpoint (comparison)] | 0.943±0.004 |
| role region [pooled midpoint (comparison)] | 0.985±0.002 |
| role anchor [pooled midpoint (comparison)] | 0.986±0.002 |
| role fraction [pooled midpoint (comparison)] | 0.998±0.000 |
| role amount [pooled midpoint (comparison)] | 0.997±0.001 |
| role unit [pooled midpoint (comparison)] | 0.997±0.001 |
| role direction [pooled midpoint (comparison)] | 1.000±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.973±0.004 |
| role target [pooled midpoint (comparison)] | 0.977±0.001 |
| role edge [pooled midpoint (comparison)] | 0.992±0.001 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.777±0.019 |
| presence object: present read present [pooled midpoint (comparison)] | 0.954±0.004 |
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
| presence anchor: present read present | 0.825±0.025 |
| presence anchor: share of 'present' readings that abstain | 0.043±0.030 |
| presence anchor: share of true 'present' readings that abstain | 0.043±0.030 |
| presence fraction: present read present | 0.852±0.052 |
| presence fraction: share of 'present' readings that abstain | 0.095±0.135 |
| presence fraction: share of true 'present' readings that abstain | 0.095±0.135 |
| occupancy: known filler | 0.973±0.006 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.741±0.052 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.889±0.000 |
| presence amount: present read present | 0.992±0.006 |
| presence amount: share of 'present' readings that abstain | 0.008±0.006 |
| presence amount: share of true 'present' readings that abstain | 0.008±0.006 |
| presence unit: present read present | 0.992±0.006 |
| presence unit: share of 'present' readings that abstain | 0.004±0.006 |
| presence unit: share of true 'present' readings that abstain | 0.004±0.006 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.015±0.021 |
| presence direction: share of true 'present' readings that abstain | 0.015±0.021 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.983±0.006 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.983±0.006 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.123±0.089 |
| presence region: share of true 'present' readings that abstain | 0.123±0.089 |
| presence region: present read present [pooled midpoint (comparison)] | 0.684±0.043 |
| presence text: present read present | 0.909±0.043 |
| presence text: share of 'present' readings that abstain | 0.057±0.038 |
| presence text: share of true 'present' readings that abstain | 0.057±0.038 |
| determiner identity (outside FULL when the legend excludes it) | 0.996±0.006 |
| presence text: present read present [pooled midpoint (comparison)] | 0.829±0.011 |
| presence relation: present read present | 0.953±0.017 |
| presence relation: share of 'present' readings that abstain | 0.032±0.023 |
| presence relation: share of true 'present' readings that abstain | 0.032±0.023 |
| presence landmark: present read present | 0.933±0.021 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.891±0.047 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.884±0.038 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.973±0.022 |
| presence source: share of 'present' readings that abstain | 0.655±0.103 |
| presence source: share of true 'present' readings that abstain | 0.655±0.103 |
| presence target: present read present | 0.964±0.013 |
| presence target: share of 'present' readings that abstain | 0.075±0.014 |
| presence target: share of true 'present' readings that abstain | 0.075±0.014 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.784±0.038 |
| presence target: present read present [pooled midpoint (comparison)] | 0.757±0.022 |
| presence landmark: share of 'present' readings that abstain | 0.043±0.009 |
| presence landmark: share of true 'present' readings that abstain | 0.039±0.010 |
| presence edge: present read present | 0.986±0.020 |
| presence edge: share of 'present' readings that abstain | 0.014±0.020 |
| presence edge: share of true 'present' readings that abstain | 0.014±0.020 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.986±0.020 |
| presence style: present read present | 0.917±0.118 |
| presence style: share of 'present' readings that abstain | 0.267±0.189 |
| presence style: share of true 'present' readings that abstain | 0.167±0.118 |
| presence style: present read present [pooled midpoint (comparison)] | 0.750±0.000 |
| presence size: present read present | 0.873±0.098 |
| presence size: share of 'present' readings that abstain | 0.035±0.025 |
| presence size: share of true 'present' readings that abstain | 0.035±0.025 |
| presence size: present read present [pooled midpoint (comparison)] | 0.767±0.062 |
| presence color: present read present | 0.952±0.067 |
| presence color: share of 'present' readings that abstain | 0.236±0.086 |
| presence color: share of true 'present' readings that abstain | 0.048±0.067 |
| presence color: present read present [pooled midpoint (comparison)] | 0.762±0.067 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.072±0.009; status {'ok': 328, 'abstain': 71, 'no-sense': 1}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.998 | 0.396 / 0.288 | 1.00 | 0.003 | 0.000 / 0.000 |
| role object | 0.948 | 0.292 / 0.142 | 0.98 | 0.039 | 0.011 / 0.014 |
| roles (pooled) | 0.942 | 0.219 / 0.080 | 0.93 | 0.028 | 0.044 / 0.030 |
| role anchor | 0.842 | 0.192 / 0.000 | 0.79 | 0.000 | 0.053 / 0.158 |
| role fraction | 0.889 | 0.112 / 0.077 | 0.89 | 0.000 | 0.000 / 0.111 |
| role amount | 1.000 | 0.192 / 0.124 | 0.99 | 0.000 | 0.013 / 0.000 |
| role unit | 0.987 | 0.269 / 0.199 | 0.99 | 0.000 | 0.000 / 0.013 |
| role direction | 1.000 | 0.196 / 0.139 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.151 / 0.047 | 0.79 | 0.000 | 0.211 / 0.000 |
| role text | 0.950 | 0.210 / 0.081 | 0.92 | 0.000 | 0.028 / 0.050 |
| role relation | 0.970 | 0.188 / 0.134 | 0.97 | 0.000 | 0.000 / 0.030 |
| role landmark | 0.840 | 0.147 / 0.093 | 0.93 | 0.120 | 0.030 / 0.040 |
| role source | 0.865 | 0.034 / 0.006 | 0.24 | 0.027 | 0.649 / 0.108 |
| role target | 0.946 | 0.115 / 0.050 | 0.89 | 0.027 | 0.081 / 0.027 |
| role edge | 0.826 | 0.207 / 0.179 | 0.96 | 0.130 | 0.000 / 0.043 |
| role style | 1.000 | 0.086 / 0.050 | 0.75 | 0.000 | 0.250 / 0.000 |
| role size | 0.952 | 0.157 / 0.056 | 0.90 | 0.000 | 0.048 / 0.048 |
| role color | 1.000 | 0.163 / 0.062 | 0.86 | 0.000 | 0.143 / 0.000 |

### train (sample) — catalog candidates (n = 300 of 4495)
| axis | accuracy |
|---|---|
| FULL | 0.883±0.003 |
| FULL [depth given] | 0.883±0.003 |
| FULL [depth and negation given] | 0.883±0.003 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.008±0.006 |
| presence object: share of true 'present' readings that abstain | 0.008±0.006 |
| presence color: absent read absent | 0.995±0.002 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 1.000±0.000 |
| presence text: present read present | 0.896±0.045 |
| presence text: share of 'present' readings that abstain | 0.055±0.023 |
| presence text: share of true 'present' readings that abstain | 0.055±0.023 |
| presence relation: present read present | 0.922±0.057 |
| presence relation: share of 'present' readings that abstain | 0.036±0.002 |
| presence relation: share of true 'present' readings that abstain | 0.036±0.002 |
| presence landmark: present read present | 0.856±0.031 |
| presence landmark: share of 'present' readings that abstain | 0.052±0.020 |
| presence landmark: share of true 'present' readings that abstain | 0.052±0.020 |
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
| role object | 0.969±0.004 |
| head object | 1.000±0.000 |
| lexical order head object | 0.113±0.000 |
| lexical bag head object | 0.197±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.981±0.000 |
| occupancy: known filler | 0.970±0.005 |
| role color | 0.994±0.003 |
| head color | 0.994±0.003 |
| lexical order head color | 0.977±0.000 |
| lexical bag head color | 0.977±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.993±0.003 |
| head size | 0.993±0.003 |
| lexical order head size | 0.937±0.000 |
| lexical bag head size | 0.973±0.000 |
| role style | 0.997±0.000 |
| head style | 0.997±0.000 |
| lexical order head style | 0.970±0.000 |
| lexical bag head style | 0.970±0.000 |
| role text | 0.983±0.007 |
| head text | 0.983±0.007 |
| lexical order head text | 0.840±0.000 |
| lexical bag head text | 1.000±0.000 |
| role relation | 0.992±0.006 |
| head relation | 0.992±0.006 |
| lexical order head relation | 0.900±0.000 |
| lexical bag head relation | 0.943±0.000 |
| role landmark | 0.973±0.003 |
| head landmark | 0.986±0.003 |
| lexical order head landmark | 0.900±0.000 |
| lexical bag head landmark | 0.907±0.000 |
| role region | 0.994±0.003 |
| head region | 0.994±0.003 |
| lexical order head region | 0.923±0.000 |
| lexical bag head region | 0.983±0.000 |
| role anchor | 0.994±0.002 |
| head anchor | 0.994±0.002 |
| lexical order head anchor | 0.933±0.000 |
| lexical bag head anchor | 1.000±0.000 |
| role fraction | 0.998±0.002 |
| head fraction | 0.998±0.002 |
| lexical order head fraction | 0.963±0.000 |
| lexical bag head fraction | 1.000±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.920±0.000 |
| lexical bag head amount | 1.000±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.920±0.000 |
| lexical bag head unit | 0.997±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.907±0.000 |
| lexical bag head direction | 0.927±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.967±0.000 |
| lexical bag head axis | 0.967±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.940±0.000 |
| lexical bag head layout | 0.953±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 0.993±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.976±0.004 |
| head source | 0.996±0.004 |
| lexical order head source | 0.913±0.000 |
| lexical bag head source | 0.923±0.000 |
| role target | 1.000±0.000 |
| head target | 1.000±0.000 |
| lexical order head target | 0.920±0.000 |
| lexical bag head target | 0.953±0.000 |
| role edge | 0.997±0.000 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.940±0.000 |
| lexical bag head edge | 0.940±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.990±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.933±0.007 |
| heads FULL (lexical order baseline) | 0.007±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.073±0.000 |
| presence text: absent read absent | 1.000±0.000 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence anchor: present read present | 0.917±0.024 |
| presence anchor: share of 'present' readings that abstain | 0.036±0.026 |
| presence anchor: share of true 'present' readings that abstain | 0.036±0.026 |
| presence fraction: present read present | 0.939±0.043 |
| presence fraction: share of 'present' readings that abstain | 0.094±0.074 |
| presence fraction: share of true 'present' readings that abstain | 0.094±0.074 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.949±0.048 |
| presence source: share of 'present' readings that abstain | 0.410±0.088 |
| presence source: share of true 'present' readings that abstain | 0.410±0.088 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.028±0.020 |
| presence target: share of true 'present' readings that abstain | 0.028±0.020 |
| presence region: present read present | 0.928±0.041 |
| presence region: share of 'present' readings that abstain | 0.015±0.021 |
| presence region: share of true 'present' readings that abstain | 0.015±0.021 |
| presence color: present read present | 0.952±0.067 |
| presence color: share of 'present' readings that abstain | 0.292±0.059 |
| presence color: share of true 'present' readings that abstain | 0.143±0.117 |
| presence size: present read present | 0.895±0.043 |
| presence size: share of 'present' readings that abstain | 0.019±0.026 |
| presence size: share of true 'present' readings that abstain | 0.019±0.026 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.370±0.139 |
| presence style: share of true 'present' readings that abstain | 0.370±0.139 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.014±0.020 |
| presence amount: share of true 'present' readings that abstain | 0.014±0.020 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.014±0.020 |
| presence unit: share of true 'present' readings that abstain | 0.014±0.020 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.024±0.017 |
| presence direction: share of true 'present' readings that abstain | 0.024±0.017 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.222±0.157 |
| presence quantity: share of true 'present' readings that abstain | 0.222±0.157 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.057±0.002; status {'abstain': 40, 'ok': 260}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.429 / 0.332 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.959 | 0.329 / 0.193 | 1.00 | 0.041 | 0.000 / 0.000 |
| roles (pooled) | 0.941 | 0.252 / 0.077 | 0.94 | 0.028 | 0.031 / 0.031 |
| role text | 0.938 | 0.201 / 0.057 | 0.92 | 0.000 | 0.021 / 0.062 |
| role relation | 1.000 | 0.186 / 0.074 | 0.97 | 0.000 | 0.033 / 0.000 |
| role landmark | 0.767 | 0.165 / 0.011 | 0.87 | 0.133 | 0.033 / 0.100 |
| role anchor | 0.950 | 0.243 / 0.092 | 0.90 | 0.000 | 0.050 / 0.050 |
| role fraction | 0.909 | 0.177 / 0.018 | 0.82 | 0.000 | 0.091 / 0.091 |
| role layout | 1.000 | 0.268 / 0.226 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.654 | 0.041 / 0.002 | 0.42 | 0.077 | 0.308 / 0.269 |
| role target | 1.000 | 0.171 / 0.097 | 0.96 | 0.000 | 0.042 / 0.000 |
| role region | 0.870 | 0.202 / 0.026 | 0.87 | 0.000 | 0.000 / 0.130 |
| role color | 1.000 | 0.150 / 0.034 | 0.71 | 0.000 | 0.286 / 0.000 |
| role size | 0.947 | 0.209 / 0.089 | 0.89 | 0.000 | 0.053 / 0.053 |
| role style | 0.889 | 0.100 / 0.024 | 0.78 | 0.000 | 0.111 / 0.111 |
| role amount | 1.000 | 0.215 / 0.148 | 0.96 | 0.000 | 0.042 / 0.000 |
| role unit | 1.000 | 0.249 / 0.173 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.261 / 0.173 | 1.00 | 0.000 | 0.000 / 0.000 |
| role edge | 0.944 | 0.233 / 0.199 | 1.00 | 0.056 | 0.000 / 0.000 |
| role axis | 1.000 | 0.302 / 0.257 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 1.000 | 0.252 / 0.206 | 1.00 | 0.000 | 0.000 / 0.000 |
| role quantity | 1.000 | 0.094 / 0.047 | 0.67 | 0.000 | 0.333 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 COMPONENT=0.98 PAIR=0.95 not=0.93 UNIT=0.91 EDGE=0.89 DIR=0.81 ANCHOR=0.73 dimensiunea=0.67 REL=0.66 back=0.60 REGION=0.52 front=0.50 FILLER=0.49 AXIS=0.48 VERB=0.47 LABEL=0.41 flow=0.36 LAYOUT=0.31 apart=0.23 PRON=0.13 are=0.12 is=0.12 CONN=0.12 din=0.12 do=0.12 the=0.12 together=0.12 unknown=0.12 care=0.10 evenly=0.04 never=0.03 lui=0.03 SIZE=0.03 pe=0.02 INTRO=0.02 color=0.02 STYLE=0.02 COLOR=0.02 FRACTION=0.02 DEM=0.01 spre=0.01 de=0.01 la=0.01 cu=0.00 QUANT=0.00 a=0.00 NUM=0.00

## What is weak, what to add
- heldout_formulations: FULL 0.815
- heldout_formulations: presence object: share of 'present' readings that abstain 0.018
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.018
- heldout_formulations: presence text: share of 'present' readings that abstain 0.000
- heldout_formulations: presence text: share of true 'present' readings that abstain 0.000
- heldout_formulations: heads FULL (lexical order baseline) 0.010
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.034
- heldout_formulations: FULL [depth given] 0.815
- heldout_formulations: FULL [depth and negation given] 0.815
- heldout_formulations: FULL [presence not decided] 0.834
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.717
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.800
- heldout_formulations: presence text: present read present [pooled midpoint (comparison)] 0.885
- heldout_formulations: presence size: share of 'present' readings that abstain 0.000
- heldout_formulations: presence size: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence style: share of 'present' readings that abstain 0.500
- heldout_formulations: presence style: share of true 'present' readings that abstain 0.500
- heldout_formulations: presence style: present read present [pooled midpoint (comparison)] 0.750
- heldout_formulations: presence region: share of 'present' readings that abstain 0.048
- heldout_formulations: presence region: share of true 'present' readings that abstain 0.048
- heldout_formulations: presence amount: share of 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.037
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.037
- heldout_formulations: presence landmark: present read present 0.862
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.000
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence relation: present read present [pooled midpoint (comparison)] 0.586
- heldout_formulations: presence landmark: present read present [pooled midpoint (comparison)] 0.759
- heldout_formulations: presence source: present read present 0.857
- heldout_formulations: presence source: share of 'present' readings that abstain 0.800
- heldout_formulations: presence source: share of true 'present' readings that abstain 0.800
- heldout_formulations: presence target: share of 'present' readings that abstain 0.034
- heldout_formulations: presence target: share of true 'present' readings that abstain 0.034
- heldout_formulations: presence edge: share of 'present' readings that abstain 0.000
- heldout_formulations: presence edge: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence source: present read present [pooled midpoint (comparison)] 0.829
- heldout_formulations: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence quantity: present read present 0.867
- heldout_formulations: presence quantity: share of 'present' readings that abstain 0.154
- heldout_formulations: presence quantity: share of true 'present' readings that abstain 0.154
- heldout_formulations: presence quantity: present read present [pooled midpoint (comparison)] 0.867
- heldout_formulations: presence color: share of 'present' readings that abstain 0.667
- heldout_formulations: presence color: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence axis: share of 'present' readings that abstain 0.000
- heldout_formulations: presence axis: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence direction: present read present [pooled midpoint (comparison)] 0.500
- heldout_sentences: FULL 0.824
- heldout_sentences: presence object: share of 'present' readings that abstain 0.005
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.005
- heldout_sentences: presence size: share of 'present' readings that abstain 0.030
- heldout_sentences: presence size: share of true 'present' readings that abstain 0.031
- heldout_sentences: presence amount: share of 'present' readings that abstain 0.000
- heldout_sentences: presence amount: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.000
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.000
- heldout_sentences: heads FULL (lexical order baseline) 0.018
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.071
- heldout_sentences: FULL [depth given] 0.824
- heldout_sentences: FULL [depth and negation given] 0.824
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.707
- heldout_sentences: role object [pooled midpoint (comparison)] 0.881
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.764
- heldout_sentences: presence size: present read present [pooled midpoint (comparison)] 0.818
- heldout_sentences: presence source: present read present 0.803
- heldout_sentences: presence source: share of 'present' readings that abstain 0.774
- heldout_sentences: presence source: share of true 'present' readings that abstain 0.774
- heldout_sentences: presence target: share of 'present' readings that abstain 0.060
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.041
- heldout_sentences: presence edge: share of 'present' readings that abstain 0.000
- heldout_sentences: presence edge: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.677
- heldout_sentences: presence target: present read present [pooled midpoint (comparison)] 0.898
- heldout_sentences: presence relation: share of 'present' readings that abstain 0.033
- heldout_sentences: presence relation: share of true 'present' readings that abstain 0.033
- heldout_sentences: presence landmark: present read present 0.885
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.056
- heldout_sentences: presence landmark: share of true 'present' readings that abstain 0.056
- heldout_sentences: presence relation: present read present [pooled midpoint (comparison)] 0.741
- heldout_sentences: presence landmark: present read present [pooled midpoint (comparison)] 0.810
- heldout_sentences: presence text: share of 'present' readings that abstain 0.051
- heldout_sentences: presence text: share of true 'present' readings that abstain 0.051
- heldout_sentences: presence text: present read present [pooled midpoint (comparison)] 0.823
- heldout_sentences: presence anchor: share of 'present' readings that abstain 0.125
- heldout_sentences: presence anchor: share of true 'present' readings that abstain 0.125
- heldout_sentences: presence anchor: present read present [pooled midpoint (comparison)] 0.706
- heldout_sentences: presence direction: share of 'present' readings that abstain 0.065
- heldout_sentences: presence direction: share of true 'present' readings that abstain 0.065
- heldout_sentences: presence pairing: share of 'present' readings that abstain 0.000
- heldout_sentences: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence region: present read present 0.846
- heldout_sentences: presence region: share of 'present' readings that abstain 0.000
- heldout_sentences: presence region: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence region: present read present [pooled midpoint (comparison)] 0.816
- heldout_sentences: presence quantity: share of 'present' readings that abstain 0.067
- heldout_sentences: presence quantity: share of true 'present' readings that abstain 0.067
- heldout_sentences: presence layout: share of 'present' readings that abstain 0.000
- heldout_sentences: presence layout: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence layout: present read present [pooled midpoint (comparison)] 0.821
- heldout_sentences: presence axis: share of 'present' readings that abstain 0.000
- heldout_sentences: presence axis: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence color: share of 'present' readings that abstain 0.037
- heldout_sentences: presence color: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence color: present read present [pooled midpoint (comparison)] 0.741
- heldout_sentences: presence style: share of 'present' readings that abstain 0.571
- heldout_sentences: presence fraction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence size: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: presence style: share of true 'present' readings that abstain 0.400
- mixed: FULL 0.840
- mixed: presence object: share of 'present' readings that abstain 0.009
- mixed: presence object: share of true 'present' readings that abstain 0.009
- mixed: presence relation: share of 'present' readings that abstain 0.023
- mixed: presence relation: share of true 'present' readings that abstain 0.023
- mixed: presence landmark: present read present 0.826
- mixed: presence landmark: share of 'present' readings that abstain 0.053
- mixed: presence landmark: share of true 'present' readings that abstain 0.053
- mixed: heads FULL (lexical order baseline) 0.018
- mixed: heads FULL (lexical bag baseline, trained on the same training rows) 0.102
- mixed: FULL [depth given] 0.840
- mixed: FULL [depth and negation given] 0.840
- mixed: FULL [pooled midpoint (comparison)] 0.703
- mixed: heads FULL (model) [pooled midpoint (comparison)] 0.765
- mixed: presence relation: present read present [pooled midpoint (comparison)] 0.644
- mixed: presence landmark: present read present [pooled midpoint (comparison)] 0.733
- mixed: presence region: present read present 0.842
- mixed: presence region: present read present [pooled midpoint (comparison)] 0.757
- mixed: presence anchor: present read present 0.897
- mixed: presence anchor: share of 'present' readings that abstain 0.114
- mixed: presence anchor: share of true 'present' readings that abstain 0.114
- mixed: presence anchor: present read present [pooled midpoint (comparison)] 0.744
- mixed: presence layout: share of 'present' readings that abstain 0.000
- mixed: presence layout: share of true 'present' readings that abstain 0.000
- mixed: presence layout: present read present [pooled midpoint (comparison)] 0.864
- mixed: presence amount: share of 'present' readings that abstain 0.000
- mixed: presence amount: share of true 'present' readings that abstain 0.000
- mixed: presence unit: share of 'present' readings that abstain 0.000
- mixed: presence unit: share of true 'present' readings that abstain 0.000
- mixed: presence source: share of 'present' readings that abstain 0.750
- mixed: presence source: share of true 'present' readings that abstain 0.750
- mixed: presence target: share of 'present' readings that abstain 0.074
- mixed: presence target: share of true 'present' readings that abstain 0.074
- mixed: presence edge: share of 'present' readings that abstain 0.053
- mixed: presence edge: share of true 'present' readings that abstain 0.053
- mixed: presence source: present read present [pooled midpoint (comparison)] 0.744
- mixed: presence target: present read present [pooled midpoint (comparison)] 0.893
- mixed: presence size: share of 'present' readings that abstain 0.071
- mixed: presence size: share of true 'present' readings that abstain 0.000
- mixed: presence region: share of 'present' readings that abstain 0.094
- mixed: presence region: share of true 'present' readings that abstain 0.094
- mixed: presence text: present read present [pooled midpoint (comparison)] 0.833
- mixed: presence text: share of 'present' readings that abstain 0.065
- mixed: presence text: share of true 'present' readings that abstain 0.065
- mixed: presence fraction: share of 'present' readings that abstain 0.000
- mixed: presence fraction: share of true 'present' readings that abstain 0.000
- mixed: presence axis: share of 'present' readings that abstain 0.000
- mixed: presence axis: share of true 'present' readings that abstain 0.000
- mixed: presence quantity: share of 'present' readings that abstain 0.000
- mixed: presence quantity: share of true 'present' readings that abstain 0.000
- mixed: presence direction: share of 'present' readings that abstain 0.120
- mixed: presence direction: share of true 'present' readings that abstain 0.120
- mixed: presence direction: present read present [pooled midpoint (comparison)] 0.840
- mixed: presence pairing: share of 'present' readings that abstain 0.062
- mixed: presence pairing: share of true 'present' readings that abstain 0.062
- mixed: presence style: share of 'present' readings that abstain 0.000
- mixed: presence style: share of true 'present' readings that abstain 0.000
- mixed: presence style: present read present [pooled midpoint (comparison)] 0.875
- mixed: presence color: share of 'present' readings that abstain 0.118
- mixed: presence color: share of true 'present' readings that abstain 0.118
- mixed: presence color: present read present [pooled midpoint (comparison)] 0.722
- new_identities: FULL 0.865
- new_identities: presence object: share of 'present' readings that abstain 0.014
- new_identities: presence object: share of true 'present' readings that abstain 0.014
- new_identities: heads FULL (lexical order baseline) 0.000
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.083
- new_identities: FULL [depth given] 0.865
- new_identities: FULL [depth and negation given] 0.865
- new_identities: FULL [pooled midpoint (comparison)] 0.757
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.802
- new_identities: presence anchor: present read present 0.842
- new_identities: presence anchor: share of 'present' readings that abstain 0.062
- new_identities: presence anchor: share of true 'present' readings that abstain 0.062
- new_identities: presence fraction: present read present 0.889
- new_identities: presence fraction: share of 'present' readings that abstain 0.000
- new_identities: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities: presence anchor: present read present [pooled midpoint (comparison)] 0.778
- new_identities: presence fraction: present read present [pooled midpoint (comparison)] 0.889
- new_identities: presence amount: share of 'present' readings that abstain 0.013
- new_identities: presence amount: share of true 'present' readings that abstain 0.013
- new_identities: presence unit: share of 'present' readings that abstain 0.000
- new_identities: presence unit: share of true 'present' readings that abstain 0.000
- new_identities: presence direction: share of 'present' readings that abstain 0.000
- new_identities: presence direction: share of true 'present' readings that abstain 0.000
- new_identities: presence region: share of 'present' readings that abstain 0.211
- new_identities: presence region: share of true 'present' readings that abstain 0.211
- new_identities: presence region: present read present [pooled midpoint (comparison)] 0.737
- new_identities: presence text: share of 'present' readings that abstain 0.029
- new_identities: presence text: share of true 'present' readings that abstain 0.029
- new_identities: presence text: present read present [pooled midpoint (comparison)] 0.837
- new_identities: presence relation: share of 'present' readings that abstain 0.000
- new_identities: presence relation: share of true 'present' readings that abstain 0.000
- new_identities: presence source: share of 'present' readings that abstain 0.757
- new_identities: presence source: share of true 'present' readings that abstain 0.757
- new_identities: presence target: share of 'present' readings that abstain 0.083
- new_identities: presence target: share of true 'present' readings that abstain 0.083
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.811
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.784
- new_identities: presence landmark: share of 'present' readings that abstain 0.031
- new_identities: presence landmark: share of true 'present' readings that abstain 0.031
- new_identities: presence edge: share of 'present' readings that abstain 0.000
- new_identities: presence edge: share of true 'present' readings that abstain 0.000
- new_identities: presence style: share of 'present' readings that abstain 0.400
- new_identities: presence style: share of true 'present' readings that abstain 0.250
- new_identities: presence style: present read present [pooled midpoint (comparison)] 0.750
- new_identities: presence size: share of 'present' readings that abstain 0.050
- new_identities: presence size: share of true 'present' readings that abstain 0.050
- new_identities: presence size: present read present [pooled midpoint (comparison)] 0.750
- new_identities: presence color: share of 'present' readings that abstain 0.333
- new_identities: presence color: share of true 'present' readings that abstain 0.143
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.714
- train (sample): FULL 0.883
- train (sample): presence object: share of 'present' readings that abstain 0.000
- train (sample): presence object: share of true 'present' readings that abstain 0.000
- train (sample): presence text: share of 'present' readings that abstain 0.022
- train (sample): presence text: share of true 'present' readings that abstain 0.022
- train (sample): presence relation: share of 'present' readings that abstain 0.033
- train (sample): presence relation: share of true 'present' readings that abstain 0.033
- train (sample): presence landmark: share of 'present' readings that abstain 0.037
- train (sample): presence landmark: share of true 'present' readings that abstain 0.037
- train (sample): heads FULL (lexical order baseline) 0.007
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.073
- train (sample): FULL [depth given] 0.883
- train (sample): FULL [depth and negation given] 0.883
- train (sample): presence anchor: share of 'present' readings that abstain 0.053
- train (sample): presence anchor: share of true 'present' readings that abstain 0.053
- train (sample): presence fraction: share of 'present' readings that abstain 0.100
- train (sample): presence fraction: share of true 'present' readings that abstain 0.100
- train (sample): presence layout: share of 'present' readings that abstain 0.000
- train (sample): presence layout: share of true 'present' readings that abstain 0.000
- train (sample): presence source: present read present 0.885
- train (sample): presence source: share of 'present' readings that abstain 0.522
- train (sample): presence source: share of true 'present' readings that abstain 0.522
- train (sample): presence target: share of 'present' readings that abstain 0.042
- train (sample): presence target: share of true 'present' readings that abstain 0.042
- train (sample): presence region: present read present 0.870
- train (sample): presence region: share of 'present' readings that abstain 0.000
- train (sample): presence region: share of true 'present' readings that abstain 0.000
- train (sample): presence color: share of 'present' readings that abstain 0.375
- train (sample): presence color: share of true 'present' readings that abstain 0.286
- train (sample): presence size: share of 'present' readings that abstain 0.056
- train (sample): presence size: share of true 'present' readings that abstain 0.056
- train (sample): presence style: share of 'present' readings that abstain 0.222
- train (sample): presence style: share of true 'present' readings that abstain 0.222
- train (sample): presence amount: share of 'present' readings that abstain 0.042
- train (sample): presence amount: share of true 'present' readings that abstain 0.042
- train (sample): presence unit: share of 'present' readings that abstain 0.000
- train (sample): presence unit: share of true 'present' readings that abstain 0.000
- train (sample): presence direction: share of 'present' readings that abstain 0.000
- train (sample): presence direction: share of true 'present' readings that abstain 0.000
- train (sample): presence edge: share of 'present' readings that abstain 0.000
- train (sample): presence edge: share of true 'present' readings that abstain 0.000
- train (sample): presence axis: share of 'present' readings that abstain 0.000
- train (sample): presence axis: share of true 'present' readings that abstain 0.000
- train (sample): presence pairing: share of 'present' readings that abstain 0.000
- train (sample): presence pairing: share of true 'present' readings that abstain 0.000
- train (sample): presence quantity: share of 'present' readings that abstain 0.333
- train (sample): presence quantity: share of true 'present' readings that abstain 0.333

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_formulations: `okay deci fa COMPONENT STYLE .` FULL 0.000 (n 2)
- heldout_sentences: `ai putea sa atasezi QUANT COMPONENT PAIR .` FULL 0.000 (n 2)
- heldout_sentences: `am nevoie sa conectati QUANT COMPONENT PAIR .` FULL 0.000 (n 2)
- heldout_sentences: `faceti COMPONENT SIZE va rog` FULL 0.000 (n 2)
- new_identities: `ai putea sa PRON numesti LABEL` FULL 0.000 (n 2)
- heldout_formulations: `hai sa asezam COMPONENT la NUM de UNIT REL COMPONENT COLOR` FULL 0.000 (n 1)
- heldout_formulations: `as_vrea sa conectati COMPONENT STYLE si LABEL cu a EDGE .` FULL 0.000 (n 1)
- heldout_formulations: `va rog sa nu stergeti COMPONENT care nu este COLOR .` FULL 0.000 (n 1)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role size | role style | role text | role relation | role landmark | role region | role anchor | role fraction | role amount | role unit | role direction | role axis | role layout | role pairing | role source | role target | role edge | role quantity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.922±0.007 | 0.818±0.008 | 0.940±0.002 | 0.993±0.002 | 1.000±0.000 | 0.995±0.004 | 0.998±0.002 | 0.987±0.008 | 0.956±0.004 | 0.995±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.998±0.002 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.945±0.008 | 0.979±0.002 | 0.987±0.002 | 0.992±0.002 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.800±0.008 | 0.720±0.005 | 0.902±0.008 | 1.000±0.000 | 1.000±0.000 | 0.980±0.007 | 0.985±0.004 | 0.945±0.005 | 0.941±0.004 | 0.987±0.005 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.995±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.941±0.007 | 0.977±0.005 | 0.985±0.000 | 0.985±0.004 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.963±0.008 | 0.844±0.008 | 0.938±0.005 | 0.985±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.969±0.002 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.943±0.010 | 0.977±0.005 | 0.993±0.002 | 1.000±0.000 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.022±0.003 (— / 0.022±0.003) |
| heldout_formulations | object | comparison: pooled midpoint | 0.948±0.003 | 1.000±0.000 | 0.974±0.001 |  |
| heldout_formulations | color | product: fitted | 1.000±0.000 | 0.993±0.002 | 0.997±0.001 | 0.556±0.079 (1.000±0.000 / 0.000±0.000) |
| heldout_formulations | color | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | size | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | size | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | style | product: fitted | 0.917±0.068 | 1.000±0.000 | 0.958±0.034 | 0.518±0.061 (— / 0.518±0.061) |
| heldout_formulations | style | comparison: pooled midpoint | 0.667±0.118 | 1.000±0.000 | 0.833±0.059 |  |
| heldout_formulations | text | product: fitted | 0.987±0.018 | 1.000±0.000 | 0.994±0.009 | 0.039±0.033 (— / 0.039±0.033) |
| heldout_formulations | text | comparison: pooled midpoint | 0.885±0.031 | 1.000±0.000 | 0.942±0.016 |  |
| heldout_formulations | relation | product: fitted | 0.908±0.059 | 1.000±0.000 | 0.954±0.029 | 0.048±0.044 (— / 0.048±0.044) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.609±0.033 | 1.000±0.000 | 0.805±0.016 |  |
| heldout_formulations | landmark | product: fitted | 0.828±0.028 | 1.000±0.000 | 0.914±0.014 | 0.057±0.054 (— / 0.057±0.054) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.724±0.028 | 1.000±0.000 | 0.862±0.014 |  |
| heldout_formulations | region | product: fitted | 0.955±0.000 | 1.000±0.000 | 0.977±0.000 | 0.016±0.022 (— / 0.016±0.022) |
| heldout_formulations | region | comparison: pooled midpoint | 0.879±0.043 | 1.000±0.000 | 0.939±0.021 |  |
| heldout_formulations | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | amount | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | unit | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | direction | product: fitted | 0.833±0.236 | 1.000±0.000 | 0.917±0.118 | 0.167±0.236 (— / 0.167±0.236) |
| heldout_formulations | direction | comparison: pooled midpoint | 0.500±0.000 | 1.000±0.000 | 0.750±0.000 |  |
| heldout_formulations | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | layout | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | source | product: fitted | 0.895±0.036 | 1.000±0.000 | 0.948±0.018 | 0.763±0.137 (— / 0.763±0.137) |
| heldout_formulations | source | comparison: pooled midpoint | 0.857±0.023 | 1.000±0.000 | 0.929±0.012 |  |
| heldout_formulations | target | product: fitted | 0.989±0.016 | 1.000±0.000 | 0.994±0.008 | 0.056±0.015 (— / 0.056±0.015) |
| heldout_formulations | target | comparison: pooled midpoint | 0.978±0.031 | 1.000±0.000 | 0.989±0.016 |  |
| heldout_formulations | edge | product: fitted | 0.944±0.016 | 1.000±0.000 | 0.972±0.008 | 0.011±0.016 (— / 0.011±0.016) |
| heldout_formulations | edge | comparison: pooled midpoint | 0.933±0.000 | 1.000±0.000 | 0.967±0.000 |  |
| heldout_formulations | quantity | product: fitted | 0.889±0.031 | 1.000±0.000 | 0.944±0.016 | 0.174±0.028 (— / 0.174±0.028) |
| heldout_formulations | quantity | comparison: pooled midpoint | 0.800±0.054 | 1.000±0.000 | 0.900±0.027 |  |
| heldout_sentences | object | product: fitted | 0.995±0.002 | 1.000±0.000 | 0.998±0.001 | 0.007±0.003 (— / 0.007±0.003) |
| heldout_sentences | object | comparison: pooled midpoint | 0.937±0.005 | 1.000±0.000 | 0.969±0.003 |  |
| heldout_sentences | color | product: fitted | 0.963±0.030 | 0.998±0.000 | 0.980±0.015 | 0.074±0.029 (1.000±0.000 / 0.038±0.030) |
| heldout_sentences | color | comparison: pooled midpoint | 0.716±0.017 | 1.000±0.000 | 0.858±0.009 |  |
| heldout_sentences | size | product: fitted | 0.919±0.071 | 0.998±0.000 | 0.959±0.036 | 0.052±0.027 (0.000±0.000 / 0.054±0.028) |
| heldout_sentences | size | comparison: pooled midpoint | 0.798±0.029 | 0.999±0.001 | 0.898±0.014 |  |
| heldout_sentences | style | product: fitted | 1.000±0.000 | 0.997±0.002 | 0.999±0.001 | 0.676±0.128 (1.000±0.000 / 0.600±0.163) |
| heldout_sentences | style | comparison: pooled midpoint | 1.000±0.000 | 0.999±0.001 | 1.000±0.000 |  |
| heldout_sentences | text | product: fitted | 0.889±0.047 | 1.000±0.000 | 0.944±0.023 | 0.054±0.003 (— / 0.054±0.003) |
| heldout_sentences | text | comparison: pooled midpoint | 0.812±0.008 | 1.000±0.000 | 0.906±0.004 |  |
| heldout_sentences | relation | product: fitted | 0.929±0.060 | 1.000±0.000 | 0.964±0.030 | 0.103±0.049 (— / 0.103±0.049) |
| heldout_sentences | relation | comparison: pooled midpoint | 0.751±0.045 | 1.000±0.000 | 0.876±0.022 |  |
| heldout_sentences | landmark | product: fitted | 0.842±0.041 | 1.000±0.000 | 0.921±0.020 | 0.092±0.026 (— / 0.092±0.026) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.734±0.055 | 1.000±0.000 | 0.867±0.027 |  |
| heldout_sentences | region | product: fitted | 0.880±0.048 | 1.000±0.000 | 0.940±0.024 | 0.036±0.051 (— / 0.036±0.051) |
| heldout_sentences | region | comparison: pooled midpoint | 0.763±0.037 | 1.000±0.000 | 0.882±0.019 |  |
| heldout_sentences | anchor | product: fitted | 0.863±0.073 | 1.000±0.000 | 0.931±0.037 | 0.086±0.061 (— / 0.086±0.061) |
| heldout_sentences | anchor | comparison: pooled midpoint | 0.745±0.028 | 1.000±0.000 | 0.873±0.014 |  |
| heldout_sentences | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.111±0.157 (— / 0.111±0.157) |
| heldout_sentences | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | amount | product: fitted | 0.983±0.012 | 1.000±0.000 | 0.991±0.006 | 0.017±0.012 (— / 0.017±0.012) |
| heldout_sentences | amount | comparison: pooled midpoint | 0.949±0.021 | 1.000±0.000 | 0.974±0.010 |  |
| heldout_sentences | unit | product: fitted | 0.983±0.012 | 1.000±0.000 | 0.991±0.006 | 0.017±0.012 (— / 0.017±0.012) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.957±0.012 | 1.000±0.000 | 0.979±0.006 |  |
| heldout_sentences | direction | product: fitted | 0.938±0.026 | 1.000±0.000 | 0.969±0.013 | 0.044±0.014 (— / 0.044±0.014) |
| heldout_sentences | direction | comparison: pooled midpoint | 0.914±0.015 | 1.000±0.000 | 0.957±0.008 |  |
| heldout_sentences | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.012±0.017 (— / 0.012±0.017) |
| heldout_sentences | layout | comparison: pooled midpoint | 0.917±0.067 | 1.000±0.000 | 0.958±0.034 |  |
| heldout_sentences | pairing | product: fitted | 0.958±0.059 | 1.000±0.000 | 0.979±0.029 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | pairing | comparison: pooled midpoint | 0.958±0.059 | 1.000±0.000 | 0.979±0.029 |  |
| heldout_sentences | source | product: fitted | 0.894±0.069 | 1.000±0.000 | 0.947±0.034 | 0.575±0.140 (— / 0.575±0.140) |
| heldout_sentences | source | comparison: pooled midpoint | 0.733±0.051 | 1.000±0.000 | 0.867±0.025 |  |
| heldout_sentences | target | product: fitted | 0.980±0.000 | 0.999±0.001 | 0.990±0.001 | 0.034±0.025 (1.000 / 0.027±0.019) |
| heldout_sentences | target | comparison: pooled midpoint | 0.871±0.025 | 1.000±0.000 | 0.935±0.013 |  |
| heldout_sentences | edge | product: fitted | 0.989±0.016 | 1.000±0.000 | 0.994±0.008 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | edge | comparison: pooled midpoint | 0.989±0.016 | 1.000±0.000 | 0.994±0.008 |  |
| heldout_sentences | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.067±0.000 (— / 0.067±0.000) |
| heldout_sentences | quantity | comparison: pooled midpoint | 0.978±0.031 | 1.000±0.000 | 0.989±0.016 |  |
| mixed | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.012±0.004 (— / 0.012±0.004) |
| mixed | object | comparison: pooled midpoint | 0.944±0.009 | 1.000±0.000 | 0.972±0.004 |  |
| mixed | color | product: fitted | 0.981±0.026 | 0.996±0.003 | 0.989±0.012 | 0.218±0.072 (1.000±0.000 / 0.150±0.023) |
| mixed | color | comparison: pooled midpoint | 0.685±0.026 | 1.000±0.000 | 0.843±0.013 |  |
| mixed | size | product: fitted | 0.929±0.000 | 0.999±0.001 | 0.964±0.001 | 0.024±0.034 (1.000 / 0.000±0.000) |
| mixed | size | comparison: pooled midpoint | 0.974±0.036 | 1.000±0.000 | 0.987±0.018 |  |
| mixed | style | product: fitted | 0.917±0.059 | 0.999±0.001 | 0.958±0.030 | 0.185±0.180 (1.000 / 0.143±0.202) |
| mixed | style | comparison: pooled midpoint | 0.792±0.059 | 1.000±0.000 | 0.896±0.029 |  |
| mixed | text | product: fitted | 0.931±0.055 | 1.000±0.000 | 0.965±0.027 | 0.076±0.016 (— / 0.076±0.016) |
| mixed | text | comparison: pooled midpoint | 0.811±0.029 | 0.999±0.001 | 0.905±0.015 |  |
| mixed | relation | product: fitted | 0.861±0.072 | 1.000±0.000 | 0.931±0.036 | 0.054±0.061 (— / 0.054±0.061) |
| mixed | relation | comparison: pooled midpoint | 0.615±0.058 | 1.000±0.000 | 0.807±0.029 |  |
| mixed | landmark | product: fitted | 0.825±0.020 | 0.999±0.001 | 0.912±0.010 | 0.105±0.037 (1.000 / 0.097±0.032) |
| mixed | landmark | comparison: pooled midpoint | 0.667±0.065 | 1.000±0.000 | 0.833±0.033 |  |
| mixed | region | product: fitted | 0.868±0.021 | 1.000±0.000 | 0.934±0.011 | 0.071±0.030 (— / 0.071±0.030) |
| mixed | region | comparison: pooled midpoint | 0.739±0.013 | 1.000±0.000 | 0.869±0.006 |  |
| mixed | anchor | product: fitted | 0.855±0.044 | 1.000±0.000 | 0.927±0.022 | 0.048±0.048 (— / 0.048±0.048) |
| mixed | anchor | comparison: pooled midpoint | 0.701±0.032 | 1.000±0.000 | 0.850±0.016 |  |
| mixed | fraction | product: fitted | 0.937±0.045 | 1.000±0.000 | 0.968±0.022 | 0.069±0.066 (— / 0.069±0.066) |
| mixed | fraction | comparison: pooled midpoint | 0.937±0.022 | 1.000±0.000 | 0.968±0.011 |  |
| mixed | amount | product: fitted | 0.975±0.017 | 1.000±0.000 | 0.988±0.009 | 0.012±0.017 (— / 0.012±0.017) |
| mixed | amount | comparison: pooled midpoint | 0.963±0.000 | 1.000±0.000 | 0.981±0.000 |  |
| mixed | unit | product: fitted | 0.975±0.017 | 1.000±0.000 | 0.988±0.009 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | unit | comparison: pooled midpoint | 0.963±0.000 | 1.000±0.000 | 0.981±0.000 |  |
| mixed | direction | product: fitted | 0.920±0.065 | 1.000±0.000 | 0.960±0.033 | 0.070±0.035 (— / 0.070±0.035) |
| mixed | direction | comparison: pooled midpoint | 0.827±0.019 | 1.000±0.000 | 0.913±0.009 |  |
| mixed | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | axis | comparison: pooled midpoint | 0.941±0.000 | 1.000±0.000 | 0.971±0.000 |  |
| mixed | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | layout | comparison: pooled midpoint | 0.924±0.043 | 1.000±0.000 | 0.962±0.021 |  |
| mixed | pairing | product: fitted | 0.938±0.051 | 1.000±0.000 | 0.969±0.026 | 0.157±0.084 (— / 0.157±0.084) |
| mixed | pairing | comparison: pooled midpoint | 0.923±0.063 | 1.000±0.000 | 0.962±0.031 |  |
| mixed | source | product: fitted | 0.932±0.019 | 1.000±0.000 | 0.966±0.009 | 0.612±0.122 (— / 0.612±0.122) |
| mixed | source | comparison: pooled midpoint | 0.793±0.046 | 1.000±0.000 | 0.896±0.023 |  |
| mixed | target | product: fitted | 0.976±0.017 | 1.000±0.000 | 0.988±0.008 | 0.049±0.018 (— / 0.049±0.018) |
| mixed | target | comparison: pooled midpoint | 0.917±0.034 | 1.000±0.000 | 0.958±0.017 |  |
| mixed | edge | product: fitted | 0.937±0.045 | 1.000±0.000 | 0.968±0.022 | 0.051±0.002 (— / 0.051±0.002) |
| mixed | edge | comparison: pooled midpoint | 0.905±0.000 | 1.000±0.000 | 0.952±0.000 |  |
| mixed | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | quantity | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | object | product: fitted | 0.996±0.003 | 1.000±0.000 | 0.998±0.002 | 0.018±0.003 (— / 0.018±0.003) |
| new_identities | object | comparison: pooled midpoint | 0.954±0.004 | 1.000±0.000 | 0.977±0.002 |  |
| new_identities | color | product: fitted | 0.952±0.067 | 0.996±0.001 | 0.974±0.034 | 0.236±0.086 (1.000±0.000 / 0.048±0.067) |
| new_identities | color | comparison: pooled midpoint | 0.762±0.067 | 1.000±0.000 | 0.881±0.034 |  |
| new_identities | size | product: fitted | 0.873±0.098 | 1.000±0.000 | 0.937±0.049 | 0.035±0.025 (— / 0.035±0.025) |
| new_identities | size | comparison: pooled midpoint | 0.767±0.062 | 1.000±0.000 | 0.883±0.031 |  |
| new_identities | style | product: fitted | 0.917±0.118 | 0.998±0.001 | 0.957±0.058 | 0.267±0.189 (1.000±0.000 / 0.167±0.118) |
| new_identities | style | comparison: pooled midpoint | 0.750±0.000 | 1.000±0.000 | 0.875±0.000 |  |
| new_identities | text | product: fitted | 0.909±0.043 | 1.000±0.000 | 0.955±0.021 | 0.057±0.038 (— / 0.057±0.038) |
| new_identities | text | comparison: pooled midpoint | 0.829±0.011 | 1.000±0.000 | 0.914±0.006 |  |
| new_identities | relation | product: fitted | 0.953±0.017 | 1.000±0.000 | 0.977±0.008 | 0.032±0.023 (— / 0.032±0.023) |
| new_identities | relation | comparison: pooled midpoint | 0.891±0.047 | 1.000±0.000 | 0.945±0.023 |  |
| new_identities | landmark | product: fitted | 0.933±0.021 | 0.999±0.002 | 0.966±0.011 | 0.043±0.009 (1.000 / 0.039±0.010) |
| new_identities | landmark | comparison: pooled midpoint | 0.884±0.038 | 1.000±0.000 | 0.942±0.019 |  |
| new_identities | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.123±0.089 (— / 0.123±0.089) |
| new_identities | region | comparison: pooled midpoint | 0.684±0.043 | 1.000±0.000 | 0.842±0.021 |  |
| new_identities | anchor | product: fitted | 0.825±0.025 | 1.000±0.000 | 0.912±0.012 | 0.043±0.030 (— / 0.043±0.030) |
| new_identities | anchor | comparison: pooled midpoint | 0.741±0.052 | 1.000±0.000 | 0.870±0.026 |  |
| new_identities | fraction | product: fitted | 0.852±0.052 | 1.000±0.000 | 0.926±0.026 | 0.095±0.135 (— / 0.095±0.135) |
| new_identities | fraction | comparison: pooled midpoint | 0.889±0.000 | 1.000±0.000 | 0.944±0.000 |  |
| new_identities | amount | product: fitted | 0.992±0.006 | 1.000±0.000 | 0.996±0.003 | 0.008±0.006 (— / 0.008±0.006) |
| new_identities | amount | comparison: pooled midpoint | 0.983±0.006 | 1.000±0.000 | 0.992±0.003 |  |
| new_identities | unit | product: fitted | 0.992±0.006 | 1.000±0.000 | 0.996±0.003 | 0.004±0.006 (— / 0.004±0.006) |
| new_identities | unit | comparison: pooled midpoint | 0.983±0.006 | 1.000±0.000 | 0.992±0.003 |  |
| new_identities | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.015±0.021 (— / 0.015±0.021) |
| new_identities | direction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | source | product: fitted | 0.973±0.022 | 1.000±0.000 | 0.986±0.011 | 0.655±0.103 (— / 0.655±0.103) |
| new_identities | source | comparison: pooled midpoint | 0.784±0.038 | 1.000±0.000 | 0.892±0.019 |  |
| new_identities | target | product: fitted | 0.964±0.013 | 1.000±0.000 | 0.982±0.006 | 0.075±0.014 (— / 0.075±0.014) |
| new_identities | target | comparison: pooled midpoint | 0.757±0.022 | 1.000±0.000 | 0.878±0.011 |  |
| new_identities | edge | product: fitted | 0.986±0.020 | 1.000±0.000 | 0.993±0.010 | 0.014±0.020 (— / 0.014±0.020) |
| new_identities | edge | comparison: pooled midpoint | 0.986±0.020 | 1.000±0.000 | 0.993±0.010 |  |
| new_identities | quantity | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | quantity | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| train (sample) | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.008±0.006 (— / 0.008±0.006) |
| train (sample) | color | product: fitted | 0.952±0.067 | 0.995±0.002 | 0.974±0.034 | 0.292±0.059 (1.000±0.000 / 0.143±0.117) |
| train (sample) | size | product: fitted | 0.895±0.043 | 1.000±0.000 | 0.947±0.021 | 0.019±0.026 (— / 0.019±0.026) |
| train (sample) | style | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.370±0.139 (— / 0.370±0.139) |
| train (sample) | text | product: fitted | 0.896±0.045 | 1.000±0.000 | 0.948±0.023 | 0.055±0.023 (— / 0.055±0.023) |
| train (sample) | relation | product: fitted | 0.922±0.057 | 1.000±0.000 | 0.961±0.028 | 0.036±0.002 (— / 0.036±0.002) |
| train (sample) | landmark | product: fitted | 0.856±0.031 | 1.000±0.000 | 0.928±0.016 | 0.052±0.020 (— / 0.052±0.020) |
| train (sample) | region | product: fitted | 0.928±0.041 | 1.000±0.000 | 0.964±0.020 | 0.015±0.021 (— / 0.015±0.021) |
| train (sample) | anchor | product: fitted | 0.917±0.024 | 1.000±0.000 | 0.958±0.012 | 0.036±0.026 (— / 0.036±0.026) |
| train (sample) | fraction | product: fitted | 0.939±0.043 | 1.000±0.000 | 0.970±0.021 | 0.094±0.074 (— / 0.094±0.074) |
| train (sample) | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.014±0.020 (— / 0.014±0.020) |
| train (sample) | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.014±0.020 (— / 0.014±0.020) |
| train (sample) | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.024±0.017 (— / 0.024±0.017) |
| train (sample) | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | source | product: fitted | 0.949±0.048 | 1.000±0.000 | 0.974±0.024 | 0.410±0.088 (— / 0.410±0.088) |
| train (sample) | target | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.028±0.020 (— / 0.028±0.020) |
| train (sample) | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.222±0.157 (— / 0.222±0.157) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
