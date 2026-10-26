# REPORT — world `diagram_ro`, legend sha256:1a43ffc61bd5… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
6200 annotated sentences from 4 files; provenance: {'generator': 6200}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/5000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 194 sentences
- heldout_formulations: 206 sentences
- heldout_sentences: 514 sentences
- mixed: 400 sentences
- new_identities: 400 sentences
- train: 4486 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['250', '35', '45', '90', 'analytics', 'broker', 'crawler', 'dashboard', 'gamma_ray', 'indexer', 'ingest', 'irina', 'loyalty', 'notifications', 'payroll', 'recommendations', 'registry', 'returns', 'routing', 'theta', 'tracking', 'vault', 'victor', 'zeta']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
45874 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2, 3, 4], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit eccbf84. Memory curve: runs/5000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 0.726 [rule: fit; pooled midpoint 0.761 (comparison)] (present 1.012, n 553 / absent 0.510, n 41)
- attr_presence:object: threshold 0.498 [rule: fit; pooled midpoint 0.511 (comparison)] (present 0.806, n 227 / absent 0.216, n 326)
- det_presence:object: threshold 0.498 [rule: fit; pooled midpoint 0.588 (comparison)] (present 1.051, n 237 / absent 0.124, n 316)
- presence:color: threshold 0.230 [rule: fit; pooled midpoint 0.292 (comparison)] (present 0.532, n 17 / absent 0.053, n 577)
- presence:size: threshold 0.311 [rule: fit; pooled midpoint 0.359 (comparison)] (present 0.649, n 45 / absent 0.069, n 549)
- presence:style: threshold 0.066 [rule: fit; pooled midpoint 0.053 (comparison)] (present 0.090, n 21 / absent 0.016, n 573)
- presence:text: threshold 0.291 [rule: fit; pooled midpoint 0.297 (comparison)] (present 0.539, n 70 / absent 0.054, n 524)
- presence:relation: threshold 0.152 [rule: fit; pooled midpoint 0.241 (comparison)] (present 0.462, n 72 / absent 0.020, n 522)
- presence:landmark: threshold 0.239 [rule: fit; pooled midpoint 0.336 (comparison)] (present 0.580, n 72 / absent 0.093, n 522)
- presence:region: threshold 0.235 [rule: fit; pooled midpoint 0.373 (comparison)] (present 0.664, n 51 / absent 0.082, n 543)
- presence:anchor: threshold 0.098 [rule: fit; pooled midpoint 0.339 (comparison)] (present 0.675, n 42 / absent 0.002, n 552)
- presence:fraction: threshold 0.292 [rule: fit; pooled midpoint 0.292 (comparison)] (present 0.535, n 26 / absent 0.050, n 568)
- presence:amount: threshold 0.317 [rule: fit; pooled midpoint 0.383 (comparison)] (present 0.769, n 28 / absent -0.003, n 566)
- presence:unit: threshold 0.379 [rule: fit; pooled midpoint 0.446 (comparison)] (present 0.837, n 28 / absent 0.055, n 566)
- presence:direction: threshold 0.261 [rule: fit; pooled midpoint 0.333 (comparison)] (present 0.641, n 27 / absent 0.024, n 567)
- presence:axis: threshold 0.229 [rule: fit; pooled midpoint 0.372 (comparison)] (present 0.708, n 18 / absent 0.037, n 576)
- presence:layout: threshold 0.332 [rule: fit; pooled midpoint 0.400 (comparison)] (present 0.792, n 21 / absent 0.009, n 573)
- presence:pairing: threshold 0.254 [rule: fit; pooled midpoint 0.248 (comparison)] (present 0.493, n 15 / absent 0.004, n 579)
- presence:source: threshold 0.224 [rule: fit; pooled midpoint 0.370 (comparison)] (present 0.714, n 92 / absent 0.026, n 502)
- presence:target: threshold 0.281 [rule: fit; pooled midpoint 0.421 (comparison)] (present 0.778, n 77 / absent 0.065, n 517)
- presence:quantity: threshold 0.095 [rule: fit; pooled midpoint 0.094 (comparison)] (present 0.191, n 15 / absent -0.002, n 579)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.005, color 0.083, size 0.143, style 0.200, text 0.013, relation 0.167, landmark 0.006, region 0.111, anchor 0.250, fraction 0.333, amount 0.043, unit 0.500, direction 0.167, axis 0.500, layout 0.143, pairing 0.500, source 0.006, target 0.006, quantity 0.043, predicate 0.019

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 206 of 206)
| axis | accuracy |
|---|---|
| FULL | 0.524±0.030 |
| FULL [depth given] | 0.524±0.030 |
| FULL [depth and negation given] | 0.524±0.030 |
| FULL [presence not decided] | 0.428±0.006 |
| FULL [pooled midpoint (comparison)] | 0.494±0.022 |
| structure (depth, negation) | 0.830±0.022 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.830±0.022 |
| event type (synonym table) | 0.830±0.022 |
| role object | 0.658±0.028 |
| head object | 0.717±0.039 |
| lexical order head object | 0.039±0.000 |
| lexical bag head object | 0.126±0.000 |
| occupancy: known filler | 0.792±0.027 |
| role color | 0.970±0.024 |
| head color | 0.970±0.024 |
| lexical order head color | 0.995±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 0.994±0.001 |
| role size | 0.972±0.004 |
| head size | 0.972±0.004 |
| lexical order head size | 0.917±0.000 |
| lexical bag head size | 0.917±0.000 |
| role style | 0.943±0.014 |
| head style | 0.943±0.014 |
| lexical order head style | 0.942±0.000 |
| lexical bag head style | 0.942±0.000 |
| role text | 0.972±0.011 |
| head text | 0.972±0.011 |
| lexical order head text | 0.898±0.000 |
| lexical bag head text | 0.908±0.000 |
| role relation | 0.985±0.003 |
| head relation | 0.985±0.003 |
| lexical order head relation | 0.869±0.000 |
| lexical bag head relation | 0.869±0.000 |
| role landmark | 0.960±0.002 |
| head landmark | 0.983±0.004 |
| lexical order head landmark | 0.869±0.000 |
| lexical bag head landmark | 0.864±0.000 |
| role region | 0.999±0.002 |
| head region | 0.999±0.002 |
| lexical order head region | 0.937±0.000 |
| lexical bag head region | 0.937±0.000 |
| role anchor | 0.997±0.006 |
| head anchor | 0.997±0.006 |
| lexical order head anchor | 0.932±0.000 |
| lexical bag head anchor | 0.942±0.000 |
| role fraction | 0.997±0.006 |
| head fraction | 0.997±0.006 |
| lexical order head fraction | 0.932±0.000 |
| lexical bag head fraction | 0.932±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.961±0.000 |
| lexical bag head amount | 0.961±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.961±0.000 |
| lexical bag head unit | 0.961±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.990±0.000 |
| lexical bag head direction | 0.990±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.981±0.000 |
| lexical bag head axis | 0.981±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 0.985±0.000 |
| lexical bag head pairing | 0.985±0.000 |
| role source | 0.869±0.009 |
| head source | 0.884±0.008 |
| lexical order head source | 0.835±0.000 |
| lexical bag head source | 0.835±0.000 |
| role target | 0.937±0.008 |
| head target | 0.970±0.008 |
| lexical order head target | 0.850±0.000 |
| lexical bag head target | 0.850±0.000 |
| role quantity | 0.959±0.007 |
| head quantity | 0.959±0.007 |
| lexical order head quantity | 0.893±0.000 |
| lexical bag head quantity | 0.893±0.000 |
| heads FULL (model) | 0.602±0.039 |
| heads FULL (lexical order baseline) | 0.019±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.044±0.000 |
| role object [presence not decided] | 0.765±0.007 |
| role color [presence not decided] | 0.769±0.002 |
| role size [presence not decided] | 0.854±0.000 |
| role style [presence not decided] | 0.893±0.000 |
| role text [presence not decided] | 0.990±0.005 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.929±0.010 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 1.000±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 0.991±0.004 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.868±0.011 |
| role target [presence not decided] | 0.938±0.006 |
| role quantity [presence not decided] | 1.000±0.000 |
| heads FULL (model) [presence not decided] | 0.482±0.006 |
| role object [pooled midpoint (comparison)] | 0.639±0.009 |
| role color [pooled midpoint (comparison)] | 0.998±0.002 |
| role size [pooled midpoint (comparison)] | 0.979±0.004 |
| role style [pooled midpoint (comparison)] | 0.935±0.014 |
| role text [pooled midpoint (comparison)] | 0.954±0.007 |
| role relation [pooled midpoint (comparison)] | 0.978±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.951±0.000 |
| role region [pooled midpoint (comparison)] | 0.983±0.002 |
| role anchor [pooled midpoint (comparison)] | 0.995±0.003 |
| role fraction [pooled midpoint (comparison)] | 0.996±0.002 |
| role amount [pooled midpoint (comparison)] | 0.999±0.002 |
| role unit [pooled midpoint (comparison)] | 0.998±0.002 |
| role direction [pooled midpoint (comparison)] | 1.000±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.871±0.007 |
| role target [pooled midpoint (comparison)] | 0.936±0.009 |
| role quantity [pooled midpoint (comparison)] | 0.957±0.004 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.580±0.016 |
| presence object: present read present | 0.939±0.012 |
| presence object: share of 'present' readings that abstain | 0.120±0.020 |
| presence object: share of true 'present' readings that abstain | 0.120±0.020 |
| presence color: absent read absent | 0.963±0.029 |
| presence size: absent read absent | 0.966±0.006 |
| presence style: absent read absent | 0.953±0.011 |
| presence text: present read present | 0.827±0.089 |
| presence text: share of 'present' readings that abstain | 0.164±0.043 |
| presence text: share of true 'present' readings that abstain | 0.153±0.045 |
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
| presence source: absent read absent | 0.997±0.004 |
| presence target: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| presence object: present read present [pooled midpoint (comparison)] | 0.946±0.009 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.974±0.006 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.947±0.018 |
| presence text: present read present [pooled midpoint (comparison)] | 0.749±0.028 |
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
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent | 0.999±0.003 |
| presence source: present read present | 0.479±0.094 |
| presence target: present read present | 0.970±0.036 |
| presence target: share of 'present' readings that abstain | 0.141±0.022 |
| presence target: share of true 'present' readings that abstain | 0.141±0.022 |
| determiner identity (outside FULL when the legend excludes it) | 0.791±0.027 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.993±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.483±0.108 |
| presence target: present read present [pooled midpoint (comparison)] | 0.977±0.030 |
| presence object: absent read absent | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.752±0.048 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.845±0.080 |
| presence source: share of true 'present' readings that abstain | 0.841±0.082 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.120±0.044 |
| presence size: share of true 'present' readings that abstain | 0.012±0.024 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.043±0.057 |
| presence fraction: share of true 'present' readings that abstain | 0.043±0.057 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.985±0.031 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present | 0.968±0.016 |
| presence relation: share of 'present' readings that abstain | 0.050±0.015 |
| presence relation: share of true 'present' readings that abstain | 0.050±0.015 |
| presence landmark: present read present | 0.951±0.017 |
| presence landmark: share of 'present' readings that abstain | 0.086±0.030 |
| presence landmark: share of true 'present' readings that abstain | 0.086±0.030 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.025±0.050 |
| presence amount: share of true 'present' readings that abstain | 0.025±0.050 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.025±0.050 |
| presence unit: share of true 'present' readings that abstain | 0.025±0.050 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.926±0.031 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.909±0.015 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.975±0.050 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.950±0.061 |
| presence style: present read present | 0.928±0.059 |
| presence style: share of true 'present' readings that abstain | 0.494±0.149 |
| presence style: present read present [pooled midpoint (comparison)] | 0.950±0.061 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.046±0.038 |
| presence region: share of true 'present' readings that abstain | 0.046±0.038 |
| presence region: present read present [pooled midpoint (comparison)] | 0.783±0.041 |
| presence quantity: present read present | 0.919±0.079 |
| presence quantity: share of 'present' readings that abstain | 0.287±0.194 |
| presence quantity: share of true 'present' readings that abstain | 0.287±0.194 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.943±0.053 |
| presence size: share of FALSE 'present' readings that abstain | 0.476±0.187 |
| presence color: share of 'present' readings that abstain | 0.762±0.162 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of true 'present' readings that abstain | 0.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.498±0.014; status {'no-sense': 34, 'abstain': 143, 'ok': 29}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.835 | 0.361 / 0.247 | 1.00 | 0.165 | 0.000 / 0.000 |
| role object | 0.652 | 0.187 / 0.000 | 0.71 | 0.111 | 0.056 / 0.237 |
| roles (pooled) | 0.689 | 0.156 / 0.000 | 0.71 | 0.099 | 0.077 / 0.213 |
| role size | 0.941 | 0.219 / 0.108 | 1.00 | 0.059 | 0.000 / 0.000 |
| role text | 0.714 | 0.120 / 0.000 | 0.57 | 0.000 | 0.143 / 0.286 |
| role source | 0.206 | 0.015 / 0.000 | 0.09 | 0.059 | 0.176 / 0.735 |
| role target | 0.516 | 0.105 / 0.010 | 0.77 | 0.323 | 0.065 / 0.161 |
| role pairing | 1.000 | 0.296 / 0.244 | 1.00 | 0.000 | 0.000 / 0.000 |
| role anchor | 1.000 | 0.274 / 0.246 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.132 / 0.059 | 0.93 | 0.000 | 0.071 / 0.000 |
| role relation | 0.889 | 0.155 / 0.029 | 0.85 | 0.000 | 0.037 / 0.111 |
| role landmark | 0.704 | 0.150 / 0.012 | 0.85 | 0.185 | 0.037 / 0.111 |
| role amount | 1.000 | 0.199 / 0.124 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.233 / 0.174 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.583 | 0.035 / 0.000 | 0.50 | 0.083 | 0.167 / 0.333 |
| role region | 1.000 | 0.183 / 0.072 | 0.92 | 0.000 | 0.077 / 0.000 |
| role quantity | 0.636 | 0.055 / 0.011 | 0.50 | 0.182 | 0.318 / 0.182 |
| role color | 1.000 | 0.208 / 0.208 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.354 / 0.316 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.274 / 0.259 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_formulations — experiment candidates (n = 206 of 206)
| axis | accuracy |
|---|---|
| FULL | 0.283±0.029 |
| FULL [depth given] | 0.283±0.029 |
| FULL [depth and negation given] | 0.283±0.029 |
| FULL [presence not decided] | 0.000±0.000 |
| FULL [pooled midpoint (comparison)] | 0.353±0.033 |
| structure (depth, negation) | 0.825±0.019 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.825±0.019 |
| event type (synonym table) | 0.825±0.019 |
| role object | 0.648±0.029 |
| head object | 0.715±0.039 |
| lexical order head object | 0.039±0.000 |
| lexical bag head object | 0.126±0.000 |
| occupancy: known filler | 0.838±0.021 |
| role color | 0.957±0.039 |
| head color | 0.957±0.039 |
| lexical order head color | 0.995±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 0.970±0.003 |
| role size | 0.966±0.012 |
| head size | 0.966±0.012 |
| lexical order head size | 0.917±0.000 |
| lexical bag head size | 0.917±0.000 |
| role style | 0.814±0.030 |
| head style | 0.814±0.030 |
| lexical order head style | 0.942±0.000 |
| lexical bag head style | 0.942±0.000 |
| role text | 0.907±0.021 |
| head text | 0.907±0.021 |
| lexical order head text | 0.898±0.000 |
| lexical bag head text | 0.908±0.000 |
| role relation | 0.946±0.011 |
| head relation | 0.946±0.011 |
| lexical order head relation | 0.869±0.000 |
| lexical bag head relation | 0.869±0.000 |
| role landmark | 0.930±0.012 |
| head landmark | 0.953±0.013 |
| lexical order head landmark | 0.869±0.000 |
| lexical bag head landmark | 0.864±0.000 |
| role region | 0.963±0.023 |
| head region | 0.963±0.023 |
| lexical order head region | 0.937±0.000 |
| lexical bag head region | 0.937±0.000 |
| role anchor | 0.975±0.009 |
| head anchor | 0.975±0.009 |
| lexical order head anchor | 0.932±0.000 |
| lexical bag head anchor | 0.942±0.000 |
| role fraction | 0.992±0.008 |
| head fraction | 0.992±0.008 |
| lexical order head fraction | 0.932±0.000 |
| lexical bag head fraction | 0.932±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.961±0.000 |
| lexical bag head amount | 0.961±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.961±0.000 |
| lexical bag head unit | 0.961±0.000 |
| role direction | 0.979±0.022 |
| head direction | 0.979±0.022 |
| lexical order head direction | 0.990±0.000 |
| lexical bag head direction | 0.990±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.981±0.000 |
| lexical bag head axis | 0.981±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.992±0.004 |
| head pairing | 0.992±0.004 |
| lexical order head pairing | 0.985±0.000 |
| lexical bag head pairing | 0.985±0.000 |
| role source | 0.817±0.019 |
| head source | 0.822±0.020 |
| lexical order head source | 0.835±0.000 |
| lexical bag head source | 0.835±0.000 |
| role target | 0.918±0.021 |
| head target | 0.956±0.024 |
| lexical order head target | 0.850±0.000 |
| lexical bag head target | 0.850±0.000 |
| role quantity | 0.935±0.015 |
| head quantity | 0.935±0.015 |
| lexical order head quantity | 0.893±0.000 |
| lexical bag head quantity | 0.893±0.000 |
| heads FULL (model) | 0.321±0.031 |
| heads FULL (lexical order baseline) | 0.019±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.044±0.000 |
| role object [presence not decided] | 0.747±0.010 |
| role color [presence not decided] | 0.048±0.004 |
| role size [presence not decided] | 0.119±0.002 |
| role style [presence not decided] | 0.083±0.006 |
| role text [presence not decided] | 0.145±0.004 |
| role relation [presence not decided] | 0.173±0.004 |
| role landmark [presence not decided] | 0.137±0.007 |
| role region [presence not decided] | 0.106±0.004 |
| role anchor [presence not decided] | 0.111±0.004 |
| role fraction [presence not decided] | 0.111±0.004 |
| role amount [presence not decided] | 0.082±0.004 |
| role unit [presence not decided] | 0.082±0.004 |
| role direction [presence not decided] | 0.052±0.004 |
| role axis [presence not decided] | 0.062±0.004 |
| role layout [presence not decided] | 0.043±0.004 |
| role pairing [presence not decided] | 0.057±0.004 |
| role source [presence not decided] | 0.039±0.005 |
| role target [presence not decided] | 0.124±0.006 |
| role quantity [presence not decided] | 0.150±0.004 |
| heads FULL (model) [presence not decided] | 0.010±0.000 |
| role object [pooled midpoint (comparison)] | 0.626±0.013 |
| role color [pooled midpoint (comparison)] | 0.999±0.002 |
| role size [pooled midpoint (comparison)] | 0.977±0.005 |
| role style [pooled midpoint (comparison)] | 0.802±0.069 |
| role text [pooled midpoint (comparison)] | 0.918±0.008 |
| role relation [pooled midpoint (comparison)] | 0.970±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.948±0.006 |
| role region [pooled midpoint (comparison)] | 0.983±0.002 |
| role anchor [pooled midpoint (comparison)] | 0.994±0.005 |
| role fraction [pooled midpoint (comparison)] | 0.995±0.003 |
| role amount [pooled midpoint (comparison)] | 0.999±0.002 |
| role unit [pooled midpoint (comparison)] | 0.998±0.002 |
| role direction [pooled midpoint (comparison)] | 0.999±0.002 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 0.991±0.004 |
| role source [pooled midpoint (comparison)] | 0.837±0.002 |
| role target [pooled midpoint (comparison)] | 0.933±0.002 |
| role quantity [pooled midpoint (comparison)] | 0.934±0.014 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.407±0.034 |
| presence object: present read present | 0.963±0.013 |
| presence object: share of 'present' readings that abstain | 0.154±0.017 |
| presence object: share of true 'present' readings that abstain | 0.154±0.017 |
| presence color: absent read absent | 0.948±0.047 |
| presence size: absent read absent | 0.961±0.016 |
| presence style: absent read absent | 0.800±0.040 |
| presence text: present read present | 0.827±0.089 |
| presence text: share of 'present' readings that abstain | 0.535±0.071 |
| presence text: share of true 'present' readings that abstain | 0.153±0.045 |
| presence relation: absent read absent | 0.944±0.018 |
| presence landmark: absent read absent | 0.960±0.014 |
| presence region: absent read absent | 0.953±0.032 |
| presence anchor: absent read absent | 0.972±0.011 |
| presence fraction: absent read absent | 0.995±0.010 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 0.973±0.028 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.971±0.027 |
| presence target: absent read absent | 0.978±0.031 |
| presence quantity: absent read absent | 0.967±0.017 |
| presence object: present read present [pooled midpoint (comparison)] | 0.971±0.003 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.974±0.007 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.779±0.099 |
| presence text: present read present [pooled midpoint (comparison)] | 0.749±0.028 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.988±0.004 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.997±0.004 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.968±0.015 |
| presence text: absent read absent | 0.910±0.039 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.224±0.096 |
| presence target: share of true 'present' readings that abstain | 0.148±0.023 |
| determiner identity (outside FULL when the legend excludes it) | 0.854±0.012 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.942±0.011 |
| presence source: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.962±0.032 |
| presence style: share of FALSE 'present' readings that abstain | 0.995±0.010 |
| presence pairing: present read present | nan±nan |
| presence pairing: share of 'present' readings that abstain | nan±nan |
| presence pairing: share of true 'present' readings that abstain | nan±nan |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | nan±nan |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.231±0.064 |
| presence size: share of true 'present' readings that abstain | 0.050±0.025 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.243±0.068 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.102±0.099 |
| presence fraction: share of true 'present' readings that abstain | 0.057±0.083 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.983±0.033 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.477±0.142 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: present read present | 0.968±0.016 |
| presence relation: share of 'present' readings that abstain | 0.285±0.069 |
| presence relation: share of true 'present' readings that abstain | 0.050±0.015 |
| presence landmark: present read present | 1.000±0.000 |
| presence landmark: share of 'present' readings that abstain | 0.350±0.063 |
| presence landmark: share of true 'present' readings that abstain | 0.202±0.038 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.025±0.050 |
| presence amount: share of true 'present' readings that abstain | 0.025±0.050 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.025±0.050 |
| presence unit: share of true 'present' readings that abstain | 0.025±0.050 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.958±0.046 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.992±0.017 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.975±0.050 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.950±0.061 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence style: present read present | 0.925±0.061 |
| presence style: share of true 'present' readings that abstain | 0.800±0.171 |
| presence style: present read present [pooled midpoint (comparison)] | 0.950±0.061 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.380±0.145 |
| presence region: share of true 'present' readings that abstain | 0.078±0.049 |
| presence region: present read present [pooled midpoint (comparison)] | 0.783±0.041 |
| presence quantity: present read present | 0.919±0.079 |
| presence quantity: share of true 'present' readings that abstain | 0.287±0.194 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.943±0.053 |
| presence size: share of FALSE 'present' readings that abstain | 0.745±0.149 |
| presence color: share of 'present' readings that abstain | 0.796±0.128 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of true 'present' readings that abstain | 0.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.494±0.311 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.502±0.013; status {'no-sense': 37, 'abstain': 149, 'ok': 20}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.820 | 0.361 / 0.247 | 1.00 | 0.180 | 0.000 / 0.000 |
| role object | 0.636 | 0.161 / 0.000 | 0.70 | 0.116 | 0.051 / 0.247 |
| roles (pooled) | 0.654 | 0.132 / 0.000 | 0.69 | 0.096 | 0.061 / 0.250 |
| role size | 0.941 | 0.180 / 0.060 | 0.88 | 0.000 | 0.059 / 0.059 |
| role text | 0.714 | 0.093 / 0.000 | 0.57 | 0.000 | 0.143 / 0.286 |
| role source | 0.000 | 0.009 / 0.001 | 0.00 | 0.000 | 0.000 / 1.000 |
| role target | 0.548 | 0.080 / 0.013 | 0.81 | 0.258 | 0.000 / 0.194 |
| role pairing | 0.333 | 0.173 / 0.108 | 1.00 | 0.667 | 0.000 / 0.000 |
| role anchor | 0.929 | 0.252 / 0.215 | 1.00 | 0.071 | 0.000 / 0.000 |
| role fraction | 0.929 | 0.126 / 0.059 | 0.93 | 0.000 | 0.000 / 0.071 |
| role relation | 0.889 | 0.119 / 0.029 | 0.85 | 0.000 | 0.037 / 0.111 |
| role landmark | 0.667 | 0.111 / 0.006 | 0.78 | 0.185 | 0.074 / 0.148 |
| role amount | 1.000 | 0.163 / 0.113 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.236 / 0.172 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.417 | 0.027 / 0.000 | 0.25 | 0.083 | 0.250 / 0.500 |
| role region | 1.000 | 0.149 / 0.055 | 0.92 | 0.000 | 0.077 / 0.000 |
| role quantity | 0.636 | 0.055 / 0.011 | 0.50 | 0.182 | 0.318 / 0.182 |
| role color | 1.000 | 0.110 / 0.110 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.312 / 0.272 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.229 / 0.197 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_sentences — catalog candidates (n = 514 of 514)
| axis | accuracy |
|---|---|
| FULL | 0.586±0.025 |
| FULL [depth given] | 0.586±0.025 |
| FULL [depth and negation given] | 0.586±0.025 |
| FULL [pooled midpoint (comparison)] | 0.542±0.006 |
| presence object: present read present | 0.899±0.025 |
| presence object: share of 'present' readings that abstain | 0.082±0.015 |
| presence object: share of true 'present' readings that abstain | 0.085±0.016 |
| presence color: absent read absent | 0.974±0.017 |
| presence size: present read present | 0.961±0.001 |
| presence size: share of 'present' readings that abstain | 0.158±0.045 |
| presence size: share of true 'present' readings that abstain | 0.066±0.033 |
| presence style: absent read absent | 0.965±0.007 |
| presence text: absent read absent | 1.000±0.000 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.995±0.006 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.984±0.008 |
| presence amount: share of 'present' readings that abstain | 0.044±0.020 |
| presence amount: share of true 'present' readings that abstain | 0.044±0.020 |
| presence unit: present read present | 0.976±0.023 |
| presence unit: share of 'present' readings that abstain | 0.029±0.021 |
| presence unit: share of true 'present' readings that abstain | 0.029±0.021 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.998±0.003 |
| presence target: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.825±0.015 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.825±0.015 |
| event type (synonym table) | 0.825±0.015 |
| role object | 0.696±0.025 |
| head object | 0.726±0.028 |
| lexical order head object | 0.084±0.000 |
| lexical bag head object | 0.136±0.000 |
| occupancy: known filler | 0.794±0.017 |
| role color | 0.979±0.012 |
| head color | 0.979±0.012 |
| lexical order head color | 0.947±0.000 |
| lexical bag head color | 0.947±0.000 |
| occupancy: not given | 0.995±0.001 |
| role size | 0.981±0.001 |
| head size | 0.981±0.001 |
| lexical order head size | 0.946±0.000 |
| lexical bag head size | 0.963±0.000 |
| role style | 0.971±0.005 |
| head style | 0.971±0.005 |
| lexical order head style | 0.990±0.000 |
| lexical bag head style | 0.990±0.000 |
| role text | 0.964±0.006 |
| head text | 0.964±0.006 |
| lexical order head text | 0.860±0.000 |
| lexical bag head text | 0.887±0.000 |
| role relation | 0.981±0.001 |
| head relation | 0.981±0.001 |
| lexical order head relation | 0.872±0.000 |
| lexical bag head relation | 0.883±0.000 |
| role landmark | 0.945±0.005 |
| head landmark | 0.974±0.004 |
| lexical order head landmark | 0.872±0.000 |
| lexical bag head landmark | 0.854±0.000 |
| role region | 0.985±0.002 |
| head region | 0.985±0.002 |
| lexical order head region | 0.926±0.000 |
| lexical bag head region | 0.932±0.000 |
| role anchor | 0.995±0.002 |
| head anchor | 0.995±0.002 |
| lexical order head anchor | 0.957±0.000 |
| lexical bag head anchor | 0.969±0.000 |
| role fraction | 0.999±0.002 |
| head fraction | 0.999±0.002 |
| lexical order head fraction | 0.981±0.000 |
| lexical bag head fraction | 0.986±0.000 |
| role amount | 0.998±0.001 |
| head amount | 0.998±0.001 |
| lexical order head amount | 0.901±0.000 |
| lexical bag head amount | 0.928±0.000 |
| role unit | 0.997±0.002 |
| head unit | 0.997±0.002 |
| lexical order head unit | 0.901±0.000 |
| lexical bag head unit | 0.928±0.000 |
| role direction | 0.992±0.003 |
| head direction | 0.992±0.003 |
| lexical order head direction | 0.942±0.000 |
| lexical bag head direction | 0.942±0.000 |
| role axis | 0.999±0.001 |
| head axis | 0.999±0.001 |
| lexical order head axis | 0.979±0.000 |
| lexical bag head axis | 0.979±0.000 |
| role layout | 0.993±0.002 |
| head layout | 0.993±0.002 |
| lexical order head layout | 0.942±0.000 |
| lexical bag head layout | 0.944±0.000 |
| role pairing | 0.997±0.001 |
| head pairing | 0.997±0.001 |
| lexical order head pairing | 0.973±0.000 |
| lexical bag head pairing | 0.977±0.000 |
| role source | 0.923±0.004 |
| head source | 0.939±0.004 |
| lexical order head source | 0.875±0.000 |
| lexical bag head source | 0.881±0.000 |
| role target | 0.972±0.003 |
| head target | 0.981±0.004 |
| lexical order head target | 0.903±0.000 |
| lexical bag head target | 0.911±0.000 |
| role quantity | 0.989±0.002 |
| head quantity | 0.989±0.002 |
| lexical order head quantity | 0.969±0.000 |
| lexical bag head quantity | 0.981±0.000 |
| heads FULL (model) | 0.643±0.030 |
| heads FULL (lexical order baseline) | 0.012±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.053±0.000 |
| role object [pooled midpoint (comparison)] | 0.670±0.009 |
| role color [pooled midpoint (comparison)] | 0.992±0.000 |
| role size [pooled midpoint (comparison)] | 0.984±0.003 |
| role style [pooled midpoint (comparison)] | 0.971±0.007 |
| role text [pooled midpoint (comparison)] | 0.954±0.002 |
| role relation [pooled midpoint (comparison)] | 0.963±0.003 |
| role landmark [pooled midpoint (comparison)] | 0.939±0.005 |
| role region [pooled midpoint (comparison)] | 0.970±0.003 |
| role anchor [pooled midpoint (comparison)] | 0.995±0.002 |
| role fraction [pooled midpoint (comparison)] | 0.999±0.001 |
| role amount [pooled midpoint (comparison)] | 0.993±0.003 |
| role unit [pooled midpoint (comparison)] | 0.992±0.003 |
| role direction [pooled midpoint (comparison)] | 0.988±0.002 |
| role axis [pooled midpoint (comparison)] | 0.999±0.001 |
| role layout [pooled midpoint (comparison)] | 0.987±0.003 |
| role pairing [pooled midpoint (comparison)] | 0.992±0.001 |
| role source [pooled midpoint (comparison)] | 0.917±0.005 |
| role target [pooled midpoint (comparison)] | 0.959±0.002 |
| role quantity [pooled midpoint (comparison)] | 0.989±0.002 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.594±0.006 |
| presence object: present read present [pooled midpoint (comparison)] | 0.893±0.010 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.997±0.002 |
| presence size: present read present [pooled midpoint (comparison)] | 0.951±0.016 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.962±0.009 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.996±0.002 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.945±0.034 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.933±0.034 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent | 0.984±0.002 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.641±0.046 |
| presence source: share of 'present' readings that abstain | 0.631±0.102 |
| presence source: share of true 'present' readings that abstain | 0.625±0.102 |
| presence target: present read present | 0.927±0.027 |
| presence target: share of 'present' readings that abstain | 0.059±0.020 |
| presence target: share of true 'present' readings that abstain | 0.059±0.020 |
| determiner identity (outside FULL when the legend excludes it) | 0.768±0.023 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.990±0.001 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.647±0.057 |
| presence target: present read present [pooled midpoint (comparison)] | 0.850±0.060 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 0.987±0.016 |
| presence region: share of 'present' readings that abstain | 0.099±0.023 |
| presence region: share of true 'present' readings that abstain | 0.099±0.023 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: present read present | 0.985±0.019 |
| presence layout: share of 'present' readings that abstain | 0.046±0.045 |
| presence layout: share of true 'present' readings that abstain | 0.046±0.045 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.920±0.037 |
| presence object: absent read absent | 0.695±0.044 |
| presence direction: present read present | 0.978±0.030 |
| presence direction: share of 'present' readings that abstain | 0.030±0.028 |
| presence direction: share of true 'present' readings that abstain | 0.030±0.028 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.698±0.008 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.984±0.020 |
| presence text: present read present | 0.930±0.034 |
| presence text: share of 'present' readings that abstain | 0.071±0.023 |
| presence text: share of true 'present' readings that abstain | 0.071±0.023 |
| presence relation: present read present | 0.979±0.007 |
| presence relation: share of 'present' readings that abstain | 0.050±0.018 |
| presence relation: share of true 'present' readings that abstain | 0.050±0.018 |
| presence landmark: present read present | 0.955±0.018 |
| presence landmark: share of 'present' readings that abstain | 0.101±0.043 |
| presence landmark: share of true 'present' readings that abstain | 0.073±0.016 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.907±0.014 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.930±0.023 |
| presence size: share of FALSE 'present' readings that abstain | 0.525±0.131 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.063±0.058 |
| presence pairing: share of true 'present' readings that abstain | 0.063±0.058 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.890±0.014 |
| presence region: present read present [pooled midpoint (comparison)] | 0.792±0.064 |
| presence style: share of 'present' readings that abstain | 0.810±0.075 |
| presence style: share of FALSE 'present' readings that abstain | 0.896±0.036 |
| presence color: present read present | 0.970±0.015 |
| presence color: share of 'present' readings that abstain | 0.292±0.114 |
| presence color: share of true 'present' readings that abstain | 0.068±0.027 |
| presence color: present read present [pooled midpoint (comparison)] | 0.889±0.033 |
| presence object: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 0.941±0.080 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.560±0.294 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: present read present | 0.927±0.068 |
| presence quantity: share of 'present' readings that abstain | 0.018±0.036 |
| presence quantity: share of true 'present' readings that abstain | 0.018±0.036 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.964±0.073 |

residual mean 0.489±0.010; status {'ok': 73, 'abstain': 347, 'no-sense': 94}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.817 | 0.370 / 0.264 | 1.00 | 0.183 | 0.000 / 0.000 |
| role object | 0.688 | 0.178 / 0.000 | 0.69 | 0.047 | 0.040 / 0.265 |
| roles (pooled) | 0.735 | 0.166 / 0.000 | 0.74 | 0.055 | 0.046 / 0.209 |
| role size | 0.857 | 0.175 / 0.000 | 0.82 | 0.000 | 0.036 / 0.143 |
| role amount | 0.961 | 0.177 / 0.096 | 0.92 | 0.000 | 0.039 / 0.039 |
| role unit | 0.961 | 0.226 / 0.069 | 0.94 | 0.000 | 0.020 / 0.039 |
| role source | 0.328 | 0.020 / 0.000 | 0.17 | 0.062 | 0.219 / 0.609 |
| role target | 0.740 | 0.124 / 0.000 | 0.84 | 0.120 | 0.020 / 0.140 |
| role axis | 0.909 | 0.292 / 0.256 | 1.00 | 0.091 | 0.000 / 0.000 |
| role region | 0.763 | 0.168 / 0.000 | 0.74 | 0.053 | 0.079 / 0.184 |
| role anchor | 0.909 | 0.252 / 0.104 | 0.91 | 0.000 | 0.000 / 0.091 |
| role layout | 0.867 | 0.226 / 0.054 | 0.93 | 0.067 | 0.000 / 0.067 |
| role direction | 0.800 | 0.174 / 0.000 | 0.83 | 0.033 | 0.000 / 0.167 |
| role text | 0.722 | 0.152 / 0.000 | 0.72 | 0.056 | 0.056 / 0.222 |
| role relation | 0.848 | 0.146 / 0.002 | 0.85 | 0.030 | 0.030 / 0.121 |
| role landmark | 0.606 | 0.137 / 0.000 | 0.79 | 0.212 | 0.030 / 0.182 |
| role pairing | 0.857 | 0.232 / 0.034 | 0.79 | 0.000 | 0.071 / 0.143 |
| role quantity | 0.688 | 0.103 / 0.047 | 0.88 | 0.250 | 0.062 / 0.062 |
| role color | 0.963 | 0.175 / 0.056 | 0.93 | 0.000 | 0.037 / 0.037 |
| role fraction | 1.000 | 0.214 / 0.169 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 1.000 | 0.073 / 0.061 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_sentences — experiment candidates (n = 514 of 514)
| axis | accuracy |
|---|---|
| FULL | 0.335±0.028 |
| FULL [depth given] | 0.335±0.028 |
| FULL [depth and negation given] | 0.335±0.028 |
| FULL [pooled midpoint (comparison)] | 0.399±0.037 |
| presence object: present read present | 0.916±0.022 |
| presence object: share of 'present' readings that abstain | 0.103±0.013 |
| presence object: share of true 'present' readings that abstain | 0.104±0.015 |
| presence color: absent read absent | 0.959±0.040 |
| presence size: present read present | 0.960±0.001 |
| presence size: share of 'present' readings that abstain | 0.231±0.050 |
| presence size: share of true 'present' readings that abstain | 0.066±0.032 |
| presence style: absent read absent | 0.825±0.044 |
| presence text: absent read absent | 0.910±0.057 |
| presence relation: absent read absent | 0.903±0.015 |
| presence landmark: absent read absent | 0.938±0.028 |
| presence region: absent read absent | 0.963±0.014 |
| presence anchor: absent read absent | 0.975±0.011 |
| presence fraction: absent read absent | 0.989±0.010 |
| presence amount: present read present | 0.988±0.010 |
| presence amount: share of 'present' readings that abstain | 0.048±0.020 |
| presence amount: share of true 'present' readings that abstain | 0.048±0.020 |
| presence unit: present read present | 0.980±0.021 |
| presence unit: share of 'present' readings that abstain | 0.037±0.016 |
| presence unit: share of true 'present' readings that abstain | 0.037±0.016 |
| presence direction: absent read absent | 0.974±0.024 |
| presence axis: absent read absent | 0.995±0.005 |
| presence layout: absent read absent | 0.997±0.004 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.988±0.013 |
| presence target: absent read absent | 0.996±0.004 |
| presence quantity: absent read absent | 0.976±0.012 |
| structure (depth, negation) | 0.803±0.019 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.803±0.019 |
| event type (synonym table) | 0.803±0.019 |
| role object | 0.689±0.026 |
| head object | 0.724±0.026 |
| lexical order head object | 0.084±0.000 |
| lexical bag head object | 0.136±0.000 |
| occupancy: known filler | 0.799±0.022 |
| role color | 0.967±0.030 |
| head color | 0.967±0.030 |
| lexical order head color | 0.947±0.000 |
| lexical bag head color | 0.947±0.000 |
| occupancy: not given | 0.971±0.003 |
| role size | 0.977±0.006 |
| head size | 0.977±0.006 |
| lexical order head size | 0.946±0.000 |
| lexical bag head size | 0.963±0.000 |
| role style | 0.858±0.034 |
| head style | 0.858±0.034 |
| lexical order head style | 0.990±0.000 |
| lexical bag head style | 0.990±0.000 |
| role text | 0.902±0.033 |
| head text | 0.902±0.033 |
| lexical order head text | 0.860±0.000 |
| lexical bag head text | 0.887±0.000 |
| role relation | 0.913±0.011 |
| head relation | 0.913±0.011 |
| lexical order head relation | 0.872±0.000 |
| lexical bag head relation | 0.883±0.000 |
| role landmark | 0.904±0.020 |
| head landmark | 0.932±0.020 |
| lexical order head landmark | 0.872±0.000 |
| lexical bag head landmark | 0.854±0.000 |
| role region | 0.958±0.011 |
| head region | 0.958±0.011 |
| lexical order head region | 0.926±0.000 |
| lexical bag head region | 0.932±0.000 |
| role anchor | 0.976±0.007 |
| head anchor | 0.976±0.007 |
| lexical order head anchor | 0.957±0.000 |
| lexical bag head anchor | 0.969±0.000 |
| role fraction | 0.991±0.008 |
| head fraction | 0.991±0.008 |
| lexical order head fraction | 0.981±0.000 |
| lexical bag head fraction | 0.986±0.000 |
| role amount | 0.998±0.001 |
| head amount | 0.998±0.001 |
| lexical order head amount | 0.901±0.000 |
| lexical bag head amount | 0.928±0.000 |
| role unit | 0.997±0.002 |
| head unit | 0.997±0.002 |
| lexical order head unit | 0.901±0.000 |
| lexical bag head unit | 0.928±0.000 |
| role direction | 0.972±0.016 |
| head direction | 0.972±0.016 |
| lexical order head direction | 0.942±0.000 |
| lexical bag head direction | 0.942±0.000 |
| role axis | 0.995±0.004 |
| head axis | 0.995±0.004 |
| lexical order head axis | 0.979±0.000 |
| lexical bag head axis | 0.979±0.000 |
| role layout | 0.991±0.003 |
| head layout | 0.991±0.003 |
| lexical order head layout | 0.942±0.000 |
| lexical bag head layout | 0.944±0.000 |
| role pairing | 0.985±0.004 |
| head pairing | 0.985±0.004 |
| lexical order head pairing | 0.973±0.000 |
| lexical bag head pairing | 0.977±0.000 |
| role source | 0.882±0.012 |
| head source | 0.888±0.016 |
| lexical order head source | 0.875±0.000 |
| lexical bag head source | 0.881±0.000 |
| role target | 0.967±0.003 |
| head target | 0.975±0.003 |
| lexical order head target | 0.903±0.000 |
| lexical bag head target | 0.911±0.000 |
| role quantity | 0.970±0.009 |
| head quantity | 0.970±0.009 |
| lexical order head quantity | 0.969±0.000 |
| lexical bag head quantity | 0.981±0.000 |
| heads FULL (model) | 0.363±0.033 |
| heads FULL (lexical order baseline) | 0.012±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.053±0.000 |
| role object [pooled midpoint (comparison)] | 0.667±0.010 |
| role color [pooled midpoint (comparison)] | 0.992±0.001 |
| role size [pooled midpoint (comparison)] | 0.983±0.003 |
| role style [pooled midpoint (comparison)] | 0.839±0.059 |
| role text [pooled midpoint (comparison)] | 0.923±0.012 |
| role relation [pooled midpoint (comparison)] | 0.953±0.006 |
| role landmark [pooled midpoint (comparison)] | 0.932±0.006 |
| role region [pooled midpoint (comparison)] | 0.970±0.003 |
| role anchor [pooled midpoint (comparison)] | 0.995±0.002 |
| role fraction [pooled midpoint (comparison)] | 0.997±0.001 |
| role amount [pooled midpoint (comparison)] | 0.993±0.003 |
| role unit [pooled midpoint (comparison)] | 0.992±0.003 |
| role direction [pooled midpoint (comparison)] | 0.988±0.002 |
| role axis [pooled midpoint (comparison)] | 0.999±0.001 |
| role layout [pooled midpoint (comparison)] | 0.987±0.003 |
| role pairing [pooled midpoint (comparison)] | 0.983±0.004 |
| role source [pooled midpoint (comparison)] | 0.887±0.005 |
| role target [pooled midpoint (comparison)] | 0.958±0.003 |
| role quantity [pooled midpoint (comparison)] | 0.966±0.010 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.429±0.037 |
| presence object: present read present [pooled midpoint (comparison)] | 0.911±0.010 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.997±0.002 |
| presence size: present read present [pooled midpoint (comparison)] | 0.951±0.016 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.791±0.077 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.949±0.020 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.986±0.008 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.989±0.007 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.997±0.002 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.948±0.032 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.936±0.034 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.969±0.014 |
| presence size: absent read absent | 0.979±0.009 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.974±0.016 |
| presence source: share of 'present' readings that abstain | 0.996±0.008 |
| presence source: share of true 'present' readings that abstain | 0.996±0.008 |
| presence target: present read present | 0.961±0.020 |
| presence target: share of 'present' readings that abstain | 0.126±0.035 |
| presence target: share of true 'present' readings that abstain | 0.096±0.021 |
| determiner identity (outside FULL when the legend excludes it) | 0.782±0.026 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.990±0.001 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.938±0.027 |
| presence target: present read present [pooled midpoint (comparison)] | 0.912±0.033 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.093±0.114 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 0.987±0.016 |
| presence region: share of 'present' readings that abstain | 0.387±0.074 |
| presence region: share of true 'present' readings that abstain | 0.112±0.019 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.330±0.077 |
| presence anchor: share of true 'present' readings that abstain | 0.010±0.020 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: share of FALSE 'present' readings that abstain | nan±nan |
| presence layout: present read present | 0.985±0.019 |
| presence layout: share of 'present' readings that abstain | 0.085±0.053 |
| presence layout: share of true 'present' readings that abstain | 0.054±0.039 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.920±0.037 |
| presence object: absent read absent | 0.625±0.018 |
| presence direction: present read present | 0.977±0.030 |
| presence direction: share of 'present' readings that abstain | 0.252±0.192 |
| presence direction: share of true 'present' readings that abstain | 0.030±0.036 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.620±0.044 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.992±0.016 |
| presence size: share of FALSE 'present' readings that abstain | 0.736±0.126 |
| presence style: share of 'present' readings that abstain | 0.985±0.016 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence relation: share of 'present' readings that abstain | 0.420±0.040 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence region: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: present read present | 0.940±0.029 |
| presence text: share of 'present' readings that abstain | 0.402±0.107 |
| presence text: share of true 'present' readings that abstain | 0.094±0.029 |
| presence relation: present read present | 0.979±0.007 |
| presence relation: share of true 'present' readings that abstain | 0.065±0.022 |
| presence landmark: present read present | 0.968±0.007 |
| presence landmark: share of 'present' readings that abstain | 0.389±0.093 |
| presence landmark: share of true 'present' readings that abstain | 0.163±0.027 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.918±0.008 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.953±0.019 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.897±0.008 |
| presence region: present read present [pooled midpoint (comparison)] | 0.792±0.064 |
| presence text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.471±0.081 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present | 0.970±0.015 |
| presence color: share of 'present' readings that abstain | 0.360±0.184 |
| presence color: share of true 'present' readings that abstain | 0.084±0.013 |
| presence color: present read present [pooled midpoint (comparison)] | 0.889±0.033 |
| presence fraction: share of 'present' readings that abstain | 0.253±0.201 |
| presence fraction: share of FALSE 'present' readings that abstain | nan±nan |
| presence object: share of FALSE 'present' readings that abstain | 0.069±0.060 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.040±0.080 |
| presence pairing: share of true 'present' readings that abstain | 0.040±0.080 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.800±0.219 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: present read present | 0.927±0.068 |
| presence quantity: share of true 'present' readings that abstain | 0.018±0.036 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.964±0.073 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.504±0.014; status {'ok': 56, 'abstain': 350, 'no-sense': 108}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.790 | 0.370 / 0.264 | 1.00 | 0.210 | 0.000 / 0.000 |
| role object | 0.686 | 0.156 / 0.000 | 0.69 | 0.045 | 0.045 / 0.270 |
| roles (pooled) | 0.705 | 0.139 / 0.000 | 0.72 | 0.059 | 0.042 / 0.236 |
| role size | 0.857 | 0.147 / 0.000 | 0.82 | 0.000 | 0.036 / 0.143 |
| role amount | 0.961 | 0.145 / 0.070 | 0.92 | 0.000 | 0.039 / 0.039 |
| role unit | 0.961 | 0.220 / 0.069 | 0.94 | 0.000 | 0.020 / 0.039 |
| role source | 0.047 | 0.008 / 0.000 | 0.00 | 0.000 | 0.047 / 0.953 |
| role target | 0.680 | 0.104 / 0.011 | 0.82 | 0.180 | 0.040 / 0.140 |
| role axis | 0.909 | 0.227 / 0.188 | 1.00 | 0.091 | 0.000 / 0.000 |
| role region | 0.763 | 0.137 / 0.000 | 0.71 | 0.053 | 0.105 / 0.184 |
| role anchor | 0.909 | 0.217 / 0.064 | 0.91 | 0.000 | 0.000 / 0.091 |
| role layout | 0.867 | 0.176 / 0.054 | 0.93 | 0.067 | 0.000 / 0.067 |
| role direction | 0.800 | 0.141 / 0.000 | 0.83 | 0.033 | 0.000 / 0.167 |
| role text | 0.708 | 0.118 / 0.000 | 0.71 | 0.056 | 0.056 / 0.236 |
| role relation | 0.848 | 0.117 / 0.002 | 0.85 | 0.030 | 0.030 / 0.121 |
| role landmark | 0.561 | 0.104 / 0.000 | 0.73 | 0.197 | 0.030 / 0.242 |
| role pairing | 0.286 | 0.181 / 0.034 | 0.79 | 0.500 | 0.000 / 0.214 |
| role quantity | 0.688 | 0.103 / 0.047 | 0.88 | 0.250 | 0.062 / 0.062 |
| role color | 0.963 | 0.129 / 0.047 | 0.89 | 0.000 | 0.074 / 0.037 |
| role fraction | 1.000 | 0.181 / 0.134 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 1.000 | 0.047 / 0.027 | 0.60 | 0.000 | 0.400 / 0.000 |

### mixed — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.571±0.021 |
| FULL [depth given] | 0.571±0.021 |
| FULL [depth and negation given] | 0.571±0.021 |
| FULL [pooled midpoint (comparison)] | 0.511±0.014 |
| presence object: present read present | 0.912±0.024 |
| presence object: share of 'present' readings that abstain | 0.070±0.006 |
| presence object: share of true 'present' readings that abstain | 0.070±0.007 |
| presence color: absent read absent | 0.976±0.016 |
| presence size: absent read absent | 0.993±0.003 |
| presence style: absent read absent | 0.955±0.008 |
| presence text: absent read absent | 0.999±0.002 |
| presence relation: present read present | 0.986±0.012 |
| presence relation: share of 'present' readings that abstain | 0.027±0.025 |
| presence relation: share of true 'present' readings that abstain | 0.027±0.025 |
| presence landmark: present read present | 0.986±0.011 |
| presence landmark: share of 'present' readings that abstain | 0.096±0.071 |
| presence landmark: share of true 'present' readings that abstain | 0.082±0.053 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.999±0.003 |
| presence target: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.799±0.021 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.799±0.021 |
| event type (synonym table) | 0.799±0.021 |
| role object | 0.689±0.030 |
| head object | 0.720±0.030 |
| lexical order head object | 0.077±0.000 |
| lexical bag head object | 0.245±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.741±0.019 |
| occupancy: known filler | 0.781±0.025 |
| role color | 0.974±0.011 |
| head color | 0.974±0.011 |
| lexical order head color | 0.957±0.000 |
| lexical bag head color | 0.960±0.000 |
| occupancy: not given | 0.996±0.001 |
| role size | 0.987±0.003 |
| head size | 0.987±0.003 |
| lexical order head size | 0.965±0.000 |
| lexical bag head size | 0.980±0.000 |
| role style | 0.960±0.006 |
| head style | 0.960±0.006 |
| lexical order head style | 0.975±0.000 |
| lexical bag head style | 0.975±0.000 |
| role text | 0.977±0.006 |
| head text | 0.977±0.006 |
| lexical order head text | 0.877±0.000 |
| lexical bag head text | 0.892±0.000 |
| role relation | 0.975±0.006 |
| head relation | 0.975±0.006 |
| lexical order head relation | 0.868±0.000 |
| lexical bag head relation | 0.877±0.000 |
| role landmark | 0.948±0.004 |
| head landmark | 0.973±0.004 |
| lexical order head landmark | 0.868±0.000 |
| lexical bag head landmark | 0.858±0.000 |
| role region | 0.987±0.004 |
| head region | 0.987±0.004 |
| lexical order head region | 0.912±0.000 |
| lexical bag head region | 0.918±0.000 |
| role anchor | 0.977±0.004 |
| head anchor | 0.977±0.004 |
| lexical order head anchor | 0.905±0.000 |
| lexical bag head anchor | 0.927±0.000 |
| role fraction | 0.993±0.004 |
| head fraction | 0.993±0.004 |
| lexical order head fraction | 0.957±0.000 |
| lexical bag head fraction | 0.963±0.000 |
| role amount | 0.997±0.002 |
| head amount | 0.997±0.002 |
| lexical order head amount | 0.922±0.000 |
| lexical bag head amount | 0.935±0.000 |
| role unit | 0.997±0.001 |
| head unit | 0.997±0.001 |
| lexical order head unit | 0.922±0.000 |
| lexical bag head unit | 0.932±0.000 |
| role direction | 0.991±0.002 |
| head direction | 0.991±0.002 |
| lexical order head direction | 0.948±0.000 |
| lexical bag head direction | 0.950±0.000 |
| role axis | 0.995±0.002 |
| head axis | 0.995±0.002 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.965±0.000 |
| role layout | 0.990±0.000 |
| head layout | 0.990±0.000 |
| lexical order head layout | 0.932±0.000 |
| lexical bag head layout | 0.935±0.000 |
| role pairing | 0.988±0.002 |
| head pairing | 0.988±0.002 |
| lexical order head pairing | 0.960±0.000 |
| lexical bag head pairing | 0.965±0.000 |
| role source | 0.924±0.004 |
| head source | 0.938±0.003 |
| lexical order head source | 0.895±0.000 |
| lexical bag head source | 0.900±0.000 |
| role target | 0.980±0.001 |
| head target | 0.992±0.002 |
| lexical order head target | 0.935±0.000 |
| lexical bag head target | 0.938±0.000 |
| role quantity | 0.999±0.001 |
| head quantity | 0.999±0.001 |
| lexical order head quantity | 0.985±0.000 |
| lexical bag head quantity | 0.988±0.000 |
| heads FULL (model) | 0.619±0.019 |
| heads FULL (lexical order baseline) | 0.013±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.105±0.000 |
| role object [pooled midpoint (comparison)] | 0.659±0.013 |
| role color [pooled midpoint (comparison)] | 0.985±0.002 |
| role size [pooled midpoint (comparison)] | 0.985±0.002 |
| role style [pooled midpoint (comparison)] | 0.960±0.010 |
| role text [pooled midpoint (comparison)] | 0.969±0.005 |
| role relation [pooled midpoint (comparison)] | 0.961±0.003 |
| role landmark [pooled midpoint (comparison)] | 0.938±0.004 |
| role region [pooled midpoint (comparison)] | 0.966±0.005 |
| role anchor [pooled midpoint (comparison)] | 0.967±0.003 |
| role fraction [pooled midpoint (comparison)] | 0.989±0.002 |
| role amount [pooled midpoint (comparison)] | 0.996±0.001 |
| role unit [pooled midpoint (comparison)] | 0.995±0.001 |
| role direction [pooled midpoint (comparison)] | 0.988±0.003 |
| role axis [pooled midpoint (comparison)] | 0.994±0.001 |
| role layout [pooled midpoint (comparison)] | 0.989±0.001 |
| role pairing [pooled midpoint (comparison)] | 0.986±0.001 |
| role source [pooled midpoint (comparison)] | 0.919±0.003 |
| role target [pooled midpoint (comparison)] | 0.974±0.001 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.560±0.015 |
| presence object: present read present [pooled midpoint (comparison)] | 0.907±0.009 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.994±0.003 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.997±0.002 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.954±0.014 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.935±0.039 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.950±0.016 |
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
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.997±0.004 |
| presence anchor: present read present | 0.941±0.023 |
| presence anchor: share of 'present' readings that abstain | 0.056±0.018 |
| presence anchor: share of true 'present' readings that abstain | 0.056±0.018 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.873±0.014 |
| presence layout: present read present | 0.958±0.000 |
| presence layout: share of 'present' readings that abstain | 0.009±0.017 |
| presence layout: share of true 'present' readings that abstain | 0.009±0.017 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.942±0.020 |
| presence amount: present read present | 0.987±0.016 |
| presence amount: share of 'present' readings that abstain | 0.019±0.026 |
| presence amount: share of true 'present' readings that abstain | 0.019±0.026 |
| presence unit: present read present | 0.987±0.016 |
| presence unit: share of 'present' readings that abstain | 0.020±0.027 |
| presence unit: share of true 'present' readings that abstain | 0.020±0.027 |
| presence amount: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.986±0.017 |
| presence size: share of 'present' readings that abstain | 0.231±0.089 |
| presence size: share of FALSE 'present' readings that abstain | 0.500±0.316 |
| presence source: present read present | 0.609±0.049 |
| presence target: present read present | 0.960±0.036 |
| presence target: share of 'present' readings that abstain | 0.196±0.025 |
| presence target: share of true 'present' readings that abstain | 0.196±0.025 |
| presence source: present read present [pooled midpoint (comparison)] | 0.578±0.022 |
| presence target: present read present [pooled midpoint (comparison)] | 0.870±0.045 |
| presence color: present read present | 0.851±0.032 |
| presence color: share of 'present' readings that abstain | 0.348±0.138 |
| presence color: share of true 'present' readings that abstain | 0.072±0.045 |
| presence color: present read present [pooled midpoint (comparison)] | 0.808±0.054 |
| presence text: present read present | 0.939±0.054 |
| presence text: share of 'present' readings that abstain | 0.065±0.022 |
| presence text: share of true 'present' readings that abstain | 0.061±0.022 |
| presence text: present read present [pooled midpoint (comparison)] | 0.934±0.030 |
| presence region: present read present | 0.913±0.046 |
| presence region: share of 'present' readings that abstain | 0.100±0.057 |
| presence region: share of true 'present' readings that abstain | 0.100±0.057 |
| presence region: present read present [pooled midpoint (comparison)] | 0.720±0.069 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.086±0.085 |
| presence fraction: share of true 'present' readings that abstain | 0.086±0.085 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.777±0.085 |
| presence style: share of FALSE 'present' readings that abstain | 0.986±0.029 |
| presence quantity: present read present | 0.933±0.082 |
| presence quantity: share of 'present' readings that abstain | 0.187±0.220 |
| presence quantity: share of true 'present' readings that abstain | 0.187±0.220 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.967±0.067 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.024±0.047 |
| presence direction: share of true 'present' readings that abstain | 0.024±0.047 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.940±0.054 |
| presence object: absent read absent | 0.822±0.066 |
| presence pairing: present read present | 0.983±0.033 |
| presence pairing: share of 'present' readings that abstain | 0.053±0.072 |
| presence pairing: share of true 'present' readings that abstain | 0.053±0.072 |
| presence source: share of 'present' readings that abstain | 0.521±0.148 |
| presence source: share of true 'present' readings that abstain | 0.515±0.144 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.866±0.038 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.393±0.232 |
| presence style: present read present [pooled midpoint (comparison)] | 0.975±0.050 |
| presence object: share of FALSE 'present' readings that abstain | 0.090±0.111 |
| presence size: present read present | 0.964±0.045 |
| presence size: present read present [pooled midpoint (comparison)] | 0.800±0.068 |
| presence color: share of FALSE 'present' readings that abstain | 0.988±0.025 |
| presence size: share of true 'present' readings that abstain | 0.165±0.101 |

residual mean 0.511±0.014; status {'abstain': 253, 'no-sense': 87, 'ok': 60}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.782 | 0.364 / 0.274 | 1.00 | 0.217 | 0.000 / 0.000 |
| role object | 0.642 | 0.185 / 0.000 | 0.71 | 0.095 | 0.027 / 0.263 |
| roles (pooled) | 0.702 | 0.170 / 0.000 | 0.74 | 0.089 | 0.048 / 0.209 |
| role relation | 0.774 | 0.135 / 0.000 | 0.77 | 0.019 | 0.019 / 0.208 |
| role landmark | 0.585 | 0.150 / 0.000 | 0.79 | 0.245 | 0.038 / 0.170 |
| role region | 0.886 | 0.185 / 0.023 | 0.89 | 0.029 | 0.029 / 0.086 |
| role anchor | 0.763 | 0.193 / 0.026 | 0.87 | 0.158 | 0.053 / 0.079 |
| role layout | 0.852 | 0.240 / 0.167 | 0.96 | 0.111 | 0.000 / 0.037 |
| role amount | 0.935 | 0.183 / 0.120 | 0.94 | 0.000 | 0.000 / 0.065 |
| role unit | 0.968 | 0.245 / 0.146 | 0.97 | 0.000 | 0.000 / 0.032 |
| role source | 0.286 | 0.022 / 0.000 | 0.21 | 0.095 | 0.167 / 0.619 |
| role target | 0.692 | 0.126 / 0.033 | 0.81 | 0.231 | 0.115 / 0.077 |
| role color | 0.765 | 0.157 / 0.000 | 0.71 | 0.000 | 0.059 / 0.235 |
| role text | 0.776 | 0.163 / 0.000 | 0.73 | 0.041 | 0.082 / 0.184 |
| role fraction | 0.824 | 0.159 / 0.003 | 0.76 | 0.118 | 0.176 / 0.059 |
| role axis | 0.867 | 0.277 / 0.184 | 0.93 | 0.067 | 0.000 / 0.067 |
| role quantity | 1.000 | 0.094 / 0.061 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.810 | 0.178 / 0.017 | 0.81 | 0.095 | 0.095 / 0.095 |
| role pairing | 0.688 | 0.185 / 0.015 | 0.75 | 0.062 | 0.000 / 0.250 |
| role style | 0.800 | 0.046 / 0.000 | 0.40 | 0.000 | 0.400 / 0.200 |
| role size | 0.714 | 0.134 / 0.000 | 0.57 | 0.000 | 0.143 / 0.286 |

### mixed — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.342±0.039 |
| FULL [depth given] | 0.342±0.039 |
| FULL [depth and negation given] | 0.342±0.039 |
| FULL [pooled midpoint (comparison)] | 0.366±0.040 |
| presence object: present read present | 0.917±0.024 |
| presence object: share of 'present' readings that abstain | 0.082±0.011 |
| presence object: share of true 'present' readings that abstain | 0.076±0.015 |
| presence color: absent read absent | 0.958±0.043 |
| presence size: absent read absent | 0.989±0.007 |
| presence style: absent read absent | 0.805±0.042 |
| presence text: absent read absent | 0.907±0.054 |
| presence relation: present read present | 0.986±0.012 |
| presence relation: share of 'present' readings that abstain | 0.378±0.059 |
| presence relation: share of true 'present' readings that abstain | 0.059±0.025 |
| presence landmark: present read present | 0.986±0.011 |
| presence landmark: share of 'present' readings that abstain | 0.317±0.064 |
| presence landmark: share of true 'present' readings that abstain | 0.114±0.048 |
| presence region: absent read absent | 0.963±0.018 |
| presence region: share of 'present' readings that abstain | 0.321±0.073 |
| presence region: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: absent read absent | 0.977±0.010 |
| presence fraction: absent read absent | 0.981±0.013 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 0.999±0.001 |
| presence direction: absent read absent | 0.971±0.025 |
| presence axis: absent read absent | 0.996±0.004 |
| presence layout: absent read absent | 0.999±0.003 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.976±0.012 |
| presence target: absent read absent | 0.986±0.008 |
| presence quantity: absent read absent | 0.972±0.012 |
| structure (depth, negation) | 0.780±0.021 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.780±0.021 |
| event type (synonym table) | 0.780±0.021 |
| role object | 0.678±0.031 |
| head object | 0.714±0.028 |
| lexical order head object | 0.077±0.000 |
| lexical bag head object | 0.245±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.734±0.014 |
| occupancy: known filler | 0.781±0.026 |
| role color | 0.959±0.032 |
| head color | 0.959±0.032 |
| lexical order head color | 0.957±0.000 |
| lexical bag head color | 0.960±0.000 |
| occupancy: not given | 0.971±0.002 |
| role size | 0.984±0.004 |
| head size | 0.984±0.004 |
| lexical order head size | 0.965±0.000 |
| lexical bag head size | 0.980±0.000 |
| role style | 0.845±0.033 |
| head style | 0.845±0.033 |
| lexical order head style | 0.975±0.000 |
| lexical bag head style | 0.975±0.000 |
| role text | 0.915±0.031 |
| head text | 0.915±0.031 |
| lexical order head text | 0.877±0.000 |
| lexical bag head text | 0.892±0.000 |
| role relation | 0.919±0.009 |
| head relation | 0.919±0.009 |
| lexical order head relation | 0.868±0.000 |
| lexical bag head relation | 0.877±0.000 |
| role landmark | 0.916±0.012 |
| head landmark | 0.941±0.012 |
| lexical order head landmark | 0.868±0.000 |
| lexical bag head landmark | 0.858±0.000 |
| role region | 0.960±0.011 |
| head region | 0.960±0.011 |
| lexical order head region | 0.912±0.000 |
| lexical bag head region | 0.918±0.000 |
| role anchor | 0.958±0.008 |
| head anchor | 0.958±0.008 |
| lexical order head anchor | 0.905±0.000 |
| lexical bag head anchor | 0.927±0.000 |
| role fraction | 0.978±0.008 |
| head fraction | 0.978±0.008 |
| lexical order head fraction | 0.957±0.000 |
| lexical bag head fraction | 0.963±0.000 |
| role amount | 0.996±0.002 |
| head amount | 0.996±0.002 |
| lexical order head amount | 0.922±0.000 |
| lexical bag head amount | 0.935±0.000 |
| role unit | 0.996±0.002 |
| head unit | 0.996±0.002 |
| lexical order head unit | 0.922±0.000 |
| lexical bag head unit | 0.932±0.000 |
| role direction | 0.971±0.019 |
| head direction | 0.971±0.019 |
| lexical order head direction | 0.948±0.000 |
| lexical bag head direction | 0.950±0.000 |
| role axis | 0.991±0.003 |
| head axis | 0.991±0.003 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.965±0.000 |
| role layout | 0.989±0.002 |
| head layout | 0.989±0.002 |
| lexical order head layout | 0.932±0.000 |
| lexical bag head layout | 0.935±0.000 |
| role pairing | 0.978±0.004 |
| head pairing | 0.978±0.004 |
| lexical order head pairing | 0.960±0.000 |
| lexical bag head pairing | 0.965±0.000 |
| role source | 0.888±0.009 |
| head source | 0.895±0.012 |
| lexical order head source | 0.895±0.000 |
| lexical bag head source | 0.900±0.000 |
| role target | 0.965±0.005 |
| head target | 0.973±0.005 |
| lexical order head target | 0.935±0.000 |
| lexical bag head target | 0.938±0.000 |
| role quantity | 0.978±0.009 |
| head quantity | 0.978±0.009 |
| lexical order head quantity | 0.985±0.000 |
| lexical bag head quantity | 0.988±0.000 |
| heads FULL (model) | 0.368±0.038 |
| heads FULL (lexical order baseline) | 0.013±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.105±0.000 |
| role object [pooled midpoint (comparison)] | 0.653±0.012 |
| role color [pooled midpoint (comparison)] | 0.985±0.002 |
| role size [pooled midpoint (comparison)] | 0.984±0.003 |
| role style [pooled midpoint (comparison)] | 0.825±0.059 |
| role text [pooled midpoint (comparison)] | 0.940±0.007 |
| role relation [pooled midpoint (comparison)] | 0.955±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.934±0.005 |
| role region [pooled midpoint (comparison)] | 0.964±0.004 |
| role anchor [pooled midpoint (comparison)] | 0.964±0.003 |
| role fraction [pooled midpoint (comparison)] | 0.983±0.005 |
| role amount [pooled midpoint (comparison)] | 0.996±0.001 |
| role unit [pooled midpoint (comparison)] | 0.995±0.001 |
| role direction [pooled midpoint (comparison)] | 0.988±0.003 |
| role axis [pooled midpoint (comparison)] | 0.994±0.001 |
| role layout [pooled midpoint (comparison)] | 0.989±0.001 |
| role pairing [pooled midpoint (comparison)] | 0.977±0.003 |
| role source [pooled midpoint (comparison)] | 0.903±0.007 |
| role target [pooled midpoint (comparison)] | 0.972±0.001 |
| role quantity [pooled midpoint (comparison)] | 0.978±0.006 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.399±0.049 |
| presence object: present read present [pooled midpoint (comparison)] | 0.911±0.008 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.994±0.003 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.996±0.003 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.768±0.082 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.954±0.015 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.940±0.036 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.960±0.012 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.996±0.004 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.994±0.005 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.970±0.010 |
| presence relation: absent read absent | 0.916±0.021 |
| presence landmark: absent read absent | 0.951±0.016 |
| presence anchor: present read present | 0.940±0.024 |
| presence anchor: share of 'present' readings that abstain | 0.313±0.057 |
| presence anchor: share of true 'present' readings that abstain | 0.154±0.078 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.991±0.004 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.994±0.004 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.871±0.014 |
| presence layout: present read present | 0.958±0.000 |
| presence layout: share of 'present' readings that abstain | 0.025±0.032 |
| presence layout: share of true 'present' readings that abstain | 0.009±0.017 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.942±0.020 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence amount: present read present | 0.987±0.016 |
| presence amount: share of 'present' readings that abstain | 0.020±0.026 |
| presence amount: share of true 'present' readings that abstain | 0.020±0.026 |
| presence unit: present read present | 0.994±0.013 |
| presence unit: share of 'present' readings that abstain | 0.027±0.025 |
| presence unit: share of true 'present' readings that abstain | 0.020±0.027 |
| presence amount: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.986±0.017 |
| presence size: share of 'present' readings that abstain | 0.277±0.100 |
| presence size: share of FALSE 'present' readings that abstain | 0.605±0.347 |
| presence style: share of 'present' readings that abstain | 0.947±0.037 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence source: present read present | 0.994±0.013 |
| presence source: share of 'present' readings that abstain | 0.994±0.012 |
| presence source: share of true 'present' readings that abstain | 0.993±0.013 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.409±0.055 |
| presence target: share of true 'present' readings that abstain | 0.303±0.035 |
| presence source: present read present [pooled midpoint (comparison)] | 0.900±0.012 |
| presence target: present read present [pooled midpoint (comparison)] | 0.944±0.017 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present | 0.851±0.032 |
| presence color: share of 'present' readings that abstain | 0.418±0.205 |
| presence color: share of true 'present' readings that abstain | 0.072±0.045 |
| presence color: present read present [pooled midpoint (comparison)] | 0.808±0.054 |
| presence text: share of 'present' readings that abstain | 0.395±0.106 |
| presence text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: present read present | 0.939±0.054 |
| presence text: share of true 'present' readings that abstain | 0.061±0.022 |
| presence text: present read present [pooled midpoint (comparison)] | 0.934±0.030 |
| presence region: present read present | 0.913±0.046 |
| presence region: share of true 'present' readings that abstain | 0.094±0.051 |
| presence region: present read present [pooled midpoint (comparison)] | 0.720±0.069 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.296±0.080 |
| presence fraction: share of true 'present' readings that abstain | 0.075±0.069 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.077±0.074 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence quantity: present read present | 0.933±0.082 |
| presence quantity: share of 'present' readings that abstain | 0.676±0.077 |
| presence quantity: share of true 'present' readings that abstain | 0.187±0.220 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.967±0.067 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.290±0.183 |
| presence direction: share of true 'present' readings that abstain | 0.024±0.047 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.940±0.054 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence object: absent read absent | 0.717±0.104 |
| presence pairing: present read present | 0.975±0.050 |
| presence pairing: share of 'present' readings that abstain | 0.057±0.114 |
| presence pairing: share of true 'present' readings that abstain | 0.057±0.114 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.781±0.057 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.593±0.238 |
| presence style: present read present [pooled midpoint (comparison)] | 0.975±0.050 |
| presence object: share of FALSE 'present' readings that abstain | 0.360±0.248 |
| presence size: present read present | 0.964±0.045 |
| presence size: present read present [pooled midpoint (comparison)] | 0.800±0.068 |
| presence fraction: share of FALSE 'present' readings that abstain | nan±nan |
| presence axis: share of FALSE 'present' readings that abstain | nan±nan |
| presence size: share of true 'present' readings that abstain | 0.151±0.093 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.525±0.016; status {'abstain': 251, 'no-sense': 96, 'ok': 53}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.760 | 0.364 / 0.274 | 1.00 | 0.240 | 0.000 / 0.000 |
| role object | 0.637 | 0.160 / 0.000 | 0.70 | 0.092 | 0.030 / 0.271 |
| roles (pooled) | 0.676 | 0.143 / 0.000 | 0.72 | 0.089 | 0.045 / 0.236 |
| role relation | 0.774 | 0.109 / 0.000 | 0.75 | 0.019 | 0.038 / 0.208 |
| role landmark | 0.566 | 0.124 / 0.000 | 0.79 | 0.245 | 0.019 / 0.189 |
| role region | 0.857 | 0.154 / 0.023 | 0.89 | 0.057 | 0.029 / 0.086 |
| role anchor | 0.737 | 0.162 / 0.005 | 0.84 | 0.158 | 0.053 / 0.105 |
| role layout | 0.852 | 0.166 / 0.107 | 0.96 | 0.111 | 0.000 / 0.037 |
| role amount | 0.935 | 0.153 / 0.081 | 0.94 | 0.000 | 0.000 / 0.065 |
| role unit | 0.968 | 0.239 / 0.099 | 0.97 | 0.000 | 0.000 / 0.032 |
| role source | 0.048 | 0.008 / 0.001 | 0.00 | 0.000 | 0.048 / 0.952 |
| role target | 0.615 | 0.100 / 0.004 | 0.69 | 0.192 | 0.115 / 0.192 |
| role color | 0.765 | 0.120 / 0.000 | 0.71 | 0.000 | 0.059 / 0.235 |
| role text | 0.776 | 0.132 / 0.000 | 0.73 | 0.041 | 0.082 / 0.184 |
| role fraction | 0.765 | 0.139 / 0.003 | 0.76 | 0.118 | 0.118 / 0.118 |
| role axis | 0.867 | 0.226 / 0.129 | 0.93 | 0.067 | 0.000 / 0.067 |
| role quantity | 1.000 | 0.094 / 0.061 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.810 | 0.149 / 0.017 | 0.81 | 0.095 | 0.095 / 0.095 |
| role pairing | 0.375 | 0.149 / 0.015 | 0.75 | 0.375 | 0.000 / 0.250 |
| role style | 0.800 | 0.032 / 0.000 | 0.20 | 0.000 | 0.600 / 0.200 |
| role size | 0.714 | 0.114 / 0.000 | 0.57 | 0.000 | 0.143 / 0.286 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.639±0.019 |
| FULL [depth given] | 0.639±0.019 |
| FULL [depth and negation given] | 0.639±0.019 |
| FULL [pooled midpoint (comparison)] | 0.582±0.008 |
| presence object: present read present | 0.905±0.028 |
| presence object: share of 'present' readings that abstain | 0.065±0.016 |
| presence object: share of true 'present' readings that abstain | 0.065±0.015 |
| presence color: absent read absent | 0.982±0.009 |
| presence size: absent read absent | 0.982±0.003 |
| presence style: absent read absent | 0.971±0.006 |
| presence text: absent read absent | 0.964±0.010 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.996±0.003 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.999±0.002 |
| presence target: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 0.999±0.001 |
| structure (depth, negation) | 0.841±0.015 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.841±0.015 |
| event type (synonym table) | 0.841±0.015 |
| role object | 0.704±0.033 |
| head object | 0.718±0.031 |
| lexical order head object | 0.025±0.000 |
| lexical bag head object | 0.310±0.000 |
| occupancy: unknown filler | 0.787±0.017 |
| role color | 0.979±0.007 |
| head color | 0.979±0.007 |
| lexical order head color | 0.980±0.000 |
| lexical bag head color | 0.980±0.000 |
| occupancy: not given | 0.994±0.001 |
| role size | 0.979±0.002 |
| head size | 0.979±0.002 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.965±0.000 |
| role style | 0.975±0.006 |
| head style | 0.975±0.006 |
| lexical order head style | 0.998±0.000 |
| lexical bag head style | 0.998±0.000 |
| role text | 0.875±0.014 |
| head text | 0.875±0.014 |
| lexical order head text | 0.542±0.000 |
| lexical bag head text | 0.685±0.000 |
| role relation | 0.975±0.006 |
| head relation | 0.975±0.006 |
| lexical order head relation | 0.815±0.000 |
| lexical bag head relation | 0.820±0.000 |
| role landmark | 0.940±0.002 |
| head landmark | 0.960±0.003 |
| lexical order head landmark | 0.815±0.000 |
| lexical bag head landmark | 0.802±0.000 |
| role region | 0.991±0.001 |
| head region | 0.991±0.001 |
| lexical order head region | 0.943±0.000 |
| lexical bag head region | 0.948±0.000 |
| role anchor | 0.987±0.003 |
| head anchor | 0.987±0.003 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 0.965±0.000 |
| role fraction | 0.999±0.002 |
| head fraction | 0.999±0.002 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 0.988±0.000 |
| role amount | 0.998±0.001 |
| head amount | 0.998±0.001 |
| lexical order head amount | 0.777±0.000 |
| lexical bag head amount | 0.845±0.000 |
| role unit | 0.998±0.001 |
| head unit | 0.998±0.001 |
| lexical order head unit | 0.777±0.000 |
| lexical bag head unit | 0.835±0.000 |
| role direction | 0.998±0.002 |
| head direction | 0.998±0.002 |
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
| role source | 0.949±0.005 |
| head source | 0.951±0.006 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.932±0.000 |
| role target | 0.981±0.005 |
| head target | 0.988±0.005 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.932±0.000 |
| role quantity | 1.000±0.001 |
| head quantity | 1.000±0.001 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.651±0.022 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.113±0.000 |
| role object [pooled midpoint (comparison)] | 0.674±0.011 |
| role color [pooled midpoint (comparison)] | 0.990±0.003 |
| role size [pooled midpoint (comparison)] | 0.981±0.005 |
| role style [pooled midpoint (comparison)] | 0.975±0.009 |
| role text [pooled midpoint (comparison)] | 0.848±0.010 |
| role relation [pooled midpoint (comparison)] | 0.952±0.003 |
| role landmark [pooled midpoint (comparison)] | 0.922±0.004 |
| role region [pooled midpoint (comparison)] | 0.975±0.002 |
| role anchor [pooled midpoint (comparison)] | 0.982±0.002 |
| role fraction [pooled midpoint (comparison)] | 0.998±0.002 |
| role amount [pooled midpoint (comparison)] | 0.993±0.003 |
| role unit [pooled midpoint (comparison)] | 0.996±0.003 |
| role direction [pooled midpoint (comparison)] | 0.993±0.004 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.947±0.005 |
| role target [pooled midpoint (comparison)] | 0.971±0.005 |
| role quantity [pooled midpoint (comparison)] | 0.999±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.597±0.009 |
| presence object: present read present [pooled midpoint (comparison)] | 0.907±0.004 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.988±0.006 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.969±0.011 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.951±0.004 |
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
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence anchor: present read present | 0.987±0.027 |
| presence anchor: share of 'present' readings that abstain | 0.070±0.042 |
| presence anchor: share of true 'present' readings that abstain | 0.070±0.042 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.075±0.150 |
| presence fraction: share of true 'present' readings that abstain | 0.075±0.150 |
| occupancy: known filler | 0.830±0.023 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present | 0.996±0.006 |
| presence amount: share of 'present' readings that abstain | 0.020±0.020 |
| presence amount: share of true 'present' readings that abstain | 0.020±0.020 |
| presence unit: present read present | 0.996±0.006 |
| presence unit: share of 'present' readings that abstain | 0.007±0.009 |
| presence unit: share of true 'present' readings that abstain | 0.007±0.009 |
| presence direction: present read present | 0.991±0.017 |
| presence direction: share of 'present' readings that abstain | 0.045±0.029 |
| presence direction: share of true 'present' readings that abstain | 0.045±0.029 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.984±0.012 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.998±0.004 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.961±0.048 |
| presence region: present read present | 0.980±0.024 |
| presence region: share of 'present' readings that abstain | 0.124±0.042 |
| presence region: share of true 'present' readings that abstain | 0.124±0.042 |
| presence region: present read present [pooled midpoint (comparison)] | 0.771±0.041 |
| determiner identity (outside FULL when the legend excludes it) | 0.874±0.007 |
| presence text: present read present | 0.953±0.022 |
| presence text: share of 'present' readings that abstain | 0.095±0.039 |
| presence text: share of true 'present' readings that abstain | 0.070±0.044 |
| presence text: present read present [pooled midpoint (comparison)] | 0.937±0.014 |
| presence relation: present read present | 0.981±0.012 |
| presence relation: share of 'present' readings that abstain | 0.062±0.024 |
| presence relation: share of true 'present' readings that abstain | 0.062±0.024 |
| presence landmark: present read present | 0.902±0.012 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.895±0.016 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.807±0.031 |
| presence object: absent read absent | 0.320±0.117 |
| presence object: share of FALSE 'present' readings that abstain | 0.022±0.044 |
| presence source: present read present | 0.445±0.054 |
| presence target: present read present | 0.889±0.040 |
| presence target: share of 'present' readings that abstain | 0.312±0.028 |
| presence target: share of true 'present' readings that abstain | 0.312±0.028 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.292±0.147 |
| presence source: present read present [pooled midpoint (comparison)] | 0.421±0.040 |
| presence target: present read present [pooled midpoint (comparison)] | 0.767±0.045 |
| presence landmark: share of 'present' readings that abstain | 0.089±0.027 |
| presence landmark: share of true 'present' readings that abstain | 0.074±0.023 |
| presence style: share of 'present' readings that abstain | 0.941±0.054 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.100±0.041 |
| presence size: share of true 'present' readings that abstain | 0.008±0.017 |
| presence size: present read present [pooled midpoint (comparison)] | 0.992±0.017 |
| presence color: share of 'present' readings that abstain | 0.537±0.145 |
| presence color: share of FALSE 'present' readings that abstain | 0.960±0.080 |
| presence source: share of 'present' readings that abstain | 0.750±0.125 |
| presence source: share of true 'present' readings that abstain | 0.745±0.122 |
| presence color: present read present | 0.718±0.048 |
| presence color: share of true 'present' readings that abstain | 0.147±0.075 |
| presence color: present read present [pooled midpoint (comparison)] | 0.657±0.114 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.400±0.490 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: share of FALSE 'present' readings that abstain | 0.483±0.200 |
| presence text: share of FALSE 'present' readings that abstain | 0.597±0.094 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.484±0.009; status {'abstain': 281, 'no-sense': 70, 'ok': 49}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.825 | 0.350 / 0.241 | 1.00 | 0.175 | 0.000 / 0.000 |
| role object | 0.700 | 0.172 / 0.000 | 0.74 | 0.079 | 0.041 / 0.221 |
| roles (pooled) | 0.772 | 0.163 / 0.000 | 0.78 | 0.061 | 0.052 / 0.167 |
| role anchor | 0.789 | 0.216 / 0.001 | 0.79 | 0.105 | 0.105 / 0.105 |
| role fraction | 1.000 | 0.130 / 0.076 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 0.989 | 0.179 / 0.102 | 0.98 | 0.000 | 0.011 / 0.011 |
| role unit | 0.989 | 0.261 / 0.161 | 0.99 | 0.000 | 0.000 / 0.011 |
| role direction | 0.913 | 0.177 / 0.136 | 0.91 | 0.043 | 0.043 / 0.043 |
| role region | 0.826 | 0.137 / 0.000 | 0.74 | 0.000 | 0.087 / 0.174 |
| role text | 0.749 | 0.156 / 0.000 | 0.74 | 0.066 | 0.071 / 0.186 |
| role relation | 0.865 | 0.149 / 0.015 | 0.86 | 0.054 | 0.054 / 0.081 |
| role landmark | 0.689 | 0.117 / 0.000 | 0.77 | 0.135 | 0.054 / 0.176 |
| role source | 0.310 | 0.019 / 0.000 | 0.21 | 0.000 | 0.103 / 0.690 |
| role target | 0.690 | 0.075 / 0.006 | 0.62 | 0.172 | 0.241 / 0.138 |
| role size | 0.889 | 0.151 / 0.040 | 0.89 | 0.000 | 0.000 / 0.111 |
| role color | 0.625 | 0.104 / 0.000 | 0.50 | 0.000 | 0.125 / 0.375 |
| role style | 1.000 | 0.048 / 0.048 | 0.00 | 0.000 | 1.000 / 0.000 |

### new_identities — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.319±0.040 |
| FULL [depth given] | 0.319±0.040 |
| FULL [depth and negation given] | 0.319±0.040 |
| FULL [pooled midpoint (comparison)] | 0.418±0.039 |
| presence object: present read present | 0.913±0.029 |
| presence object: share of 'present' readings that abstain | 0.083±0.018 |
| presence object: share of true 'present' readings that abstain | 0.080±0.017 |
| presence color: absent read absent | 0.959±0.045 |
| presence size: absent read absent | 0.981±0.004 |
| presence style: absent read absent | 0.838±0.025 |
| presence text: absent read absent | 0.803±0.037 |
| presence relation: absent read absent | 0.871±0.034 |
| presence landmark: absent read absent | 0.941±0.024 |
| presence region: absent read absent | 0.949±0.021 |
| presence anchor: absent read absent | 0.977±0.025 |
| presence fraction: absent read absent | 0.988±0.007 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 0.919±0.060 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 0.998±0.005 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.986±0.008 |
| presence target: absent read absent | 0.989±0.010 |
| presence quantity: absent read absent | 0.977±0.012 |
| structure (depth, negation) | 0.829±0.013 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.829±0.013 |
| event type (synonym table) | 0.829±0.013 |
| role object | 0.687±0.033 |
| head object | 0.710±0.031 |
| lexical order head object | 0.025±0.000 |
| lexical bag head object | 0.310±0.000 |
| occupancy: unknown filler | 0.795±0.017 |
| role color | 0.961±0.036 |
| head color | 0.961±0.036 |
| lexical order head color | 0.980±0.000 |
| lexical bag head color | 0.980±0.000 |
| occupancy: not given | 0.964±0.004 |
| role size | 0.978±0.003 |
| head size | 0.978±0.003 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.965±0.000 |
| role style | 0.866±0.021 |
| head style | 0.866±0.021 |
| lexical order head style | 0.998±0.000 |
| lexical bag head style | 0.998±0.000 |
| role text | 0.795±0.010 |
| head text | 0.795±0.010 |
| lexical order head text | 0.542±0.000 |
| lexical bag head text | 0.685±0.000 |
| role relation | 0.889±0.023 |
| head relation | 0.889±0.023 |
| lexical order head relation | 0.815±0.000 |
| lexical bag head relation | 0.820±0.000 |
| role landmark | 0.904±0.015 |
| head landmark | 0.924±0.016 |
| lexical order head landmark | 0.815±0.000 |
| lexical bag head landmark | 0.802±0.000 |
| role region | 0.951±0.016 |
| head region | 0.951±0.016 |
| lexical order head region | 0.943±0.000 |
| lexical bag head region | 0.948±0.000 |
| role anchor | 0.968±0.017 |
| head anchor | 0.968±0.017 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 0.965±0.000 |
| role fraction | 0.989±0.006 |
| head fraction | 0.989±0.006 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 0.988±0.000 |
| role amount | 0.998±0.000 |
| head amount | 0.998±0.000 |
| lexical order head amount | 0.777±0.000 |
| lexical bag head amount | 0.845±0.000 |
| role unit | 0.998±0.001 |
| head unit | 0.998±0.001 |
| lexical order head unit | 0.777±0.000 |
| lexical bag head unit | 0.835±0.000 |
| role direction | 0.934±0.046 |
| head direction | 0.934±0.046 |
| lexical order head direction | 0.943±0.000 |
| lexical bag head direction | 0.943±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 1.000±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 0.998±0.004 |
| head layout | 0.998±0.004 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 1.000±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.924±0.007 |
| head source | 0.925±0.008 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.932±0.000 |
| role target | 0.965±0.010 |
| head target | 0.972±0.010 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.932±0.000 |
| role quantity | 0.981±0.010 |
| head quantity | 0.981±0.010 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.327±0.042 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.113±0.000 |
| role object [pooled midpoint (comparison)] | 0.659±0.013 |
| role color [pooled midpoint (comparison)] | 0.990±0.003 |
| role size [pooled midpoint (comparison)] | 0.981±0.005 |
| role style [pooled midpoint (comparison)] | 0.842±0.063 |
| role text [pooled midpoint (comparison)] | 0.796±0.011 |
| role relation [pooled midpoint (comparison)] | 0.945±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.920±0.004 |
| role region [pooled midpoint (comparison)] | 0.973±0.001 |
| role anchor [pooled midpoint (comparison)] | 0.982±0.002 |
| role fraction [pooled midpoint (comparison)] | 0.993±0.002 |
| role amount [pooled midpoint (comparison)] | 0.993±0.003 |
| role unit [pooled midpoint (comparison)] | 0.996±0.003 |
| role direction [pooled midpoint (comparison)] | 0.990±0.004 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.933±0.001 |
| role target [pooled midpoint (comparison)] | 0.965±0.005 |
| role quantity [pooled midpoint (comparison)] | 0.984±0.004 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.431±0.044 |
| presence object: present read present [pooled midpoint (comparison)] | 0.913±0.003 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.988±0.006 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.797±0.080 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.844±0.006 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.990±0.008 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.996±0.004 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.993±0.004 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.980±0.005 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.316±0.210 |
| presence anchor: share of true 'present' readings that abstain | 0.070±0.042 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.382±0.130 |
| presence fraction: share of true 'present' readings that abstain | 0.100±0.146 |
| occupancy: known filler | 0.848±0.020 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: share of 'present' readings that abstain | 0.392±0.056 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence landmark: share of 'present' readings that abstain | 0.340±0.057 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: share of FALSE 'present' readings that abstain | nan±nan |
| presence amount: present read present | 0.998±0.004 |
| presence amount: share of 'present' readings that abstain | 0.030±0.021 |
| presence amount: share of true 'present' readings that abstain | 0.030±0.021 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.007±0.009 |
| presence unit: share of true 'present' readings that abstain | 0.007±0.009 |
| presence direction: present read present | 0.991±0.017 |
| presence direction: share of 'present' readings that abstain | 0.482±0.196 |
| presence direction: share of true 'present' readings that abstain | 0.046±0.050 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.989±0.007 |
| presence unit: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.961±0.048 |
| presence text: share of 'present' readings that abstain | 0.257±0.020 |
| presence text: share of FALSE 'present' readings that abstain | 0.941±0.016 |
| presence region: present read present | 0.980±0.024 |
| presence region: share of 'present' readings that abstain | 0.502±0.104 |
| presence region: share of true 'present' readings that abstain | 0.124±0.042 |
| presence region: present read present [pooled midpoint (comparison)] | 0.791±0.044 |
| determiner identity (outside FULL when the legend excludes it) | 0.862±0.010 |
| presence text: present read present | 0.955±0.020 |
| presence text: share of true 'present' readings that abstain | 0.075±0.040 |
| presence text: present read present [pooled midpoint (comparison)] | 0.937±0.014 |
| presence relation: present read present | 0.981±0.012 |
| presence relation: share of true 'present' readings that abstain | 0.074±0.026 |
| presence landmark: present read present | 0.957±0.011 |
| presence landmark: share of true 'present' readings that abstain | 0.179±0.037 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.913±0.015 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.886±0.028 |
| presence target: share of 'present' readings that abstain | 0.642±0.097 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence object: absent read absent | 0.270±0.098 |
| presence object: share of FALSE 'present' readings that abstain | 0.186±0.117 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.942±0.044 |
| presence target: share of true 'present' readings that abstain | 0.600±0.096 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.282±0.145 |
| presence source: present read present [pooled midpoint (comparison)] | 0.834±0.025 |
| presence target: present read present [pooled midpoint (comparison)] | 0.826±0.046 |
| presence style: share of 'present' readings that abstain | 0.987±0.012 |
| presence style: share of FALSE 'present' readings that abstain | 0.994±0.008 |
| presence fraction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 1.000±0.000 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.173±0.039 |
| presence size: share of true 'present' readings that abstain | 0.008±0.017 |
| presence size: present read present [pooled midpoint (comparison)] | 0.992±0.017 |
| presence region: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.628±0.204 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present | 0.761±0.089 |
| presence color: share of true 'present' readings that abstain | 0.180±0.107 |
| presence color: present read present [pooled midpoint (comparison)] | 0.657±0.114 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.600±0.490 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: share of FALSE 'present' readings that abstain | 0.848±0.084 |

residual mean 0.495±0.009; status {'abstain': 289, 'no-sense': 73, 'ok': 38}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.818 | 0.350 / 0.241 | 1.00 | 0.182 | 0.000 / 0.000 |
| role object | 0.682 | 0.150 / 0.000 | 0.72 | 0.074 | 0.038 / 0.244 |
| roles (pooled) | 0.756 | 0.141 / 0.000 | 0.76 | 0.058 | 0.054 / 0.186 |
| role anchor | 0.789 | 0.189 / 0.001 | 0.79 | 0.105 | 0.105 / 0.105 |
| role fraction | 1.000 | 0.100 / 0.060 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 0.989 | 0.166 / 0.086 | 0.98 | 0.000 | 0.011 / 0.011 |
| role unit | 0.989 | 0.253 / 0.120 | 0.99 | 0.000 | 0.000 / 0.011 |
| role direction | 0.913 | 0.131 / 0.087 | 0.91 | 0.043 | 0.043 / 0.043 |
| role region | 0.826 | 0.111 / 0.000 | 0.74 | 0.000 | 0.087 / 0.174 |
| role text | 0.738 | 0.130 / 0.000 | 0.74 | 0.066 | 0.066 / 0.197 |
| role relation | 0.865 | 0.118 / 0.015 | 0.86 | 0.054 | 0.054 / 0.081 |
| role landmark | 0.703 | 0.088 / 0.000 | 0.73 | 0.135 | 0.108 / 0.162 |
| role source | 0.103 | 0.006 / 0.001 | 0.00 | 0.000 | 0.103 / 0.897 |
| role target | 0.586 | 0.053 / 0.002 | 0.45 | 0.138 | 0.276 / 0.276 |
| role size | 0.889 | 0.128 / 0.040 | 0.89 | 0.000 | 0.000 / 0.111 |
| role color | 0.625 | 0.071 / 0.000 | 0.50 | 0.000 | 0.125 / 0.375 |
| role style | 1.000 | 0.048 / 0.048 | 0.00 | 0.000 | 1.000 / 0.000 |

### train (sample) — catalog candidates (n = 300 of 4486)
| axis | accuracy |
|---|---|
| FULL | 0.589±0.037 |
| FULL [depth given] | 0.589±0.037 |
| FULL [depth and negation given] | 0.589±0.037 |
| presence object: present read present | 0.909±0.028 |
| presence object: share of 'present' readings that abstain | 0.090±0.011 |
| presence object: share of true 'present' readings that abstain | 0.093±0.010 |
| presence color: absent read absent | 0.976±0.020 |
| presence size: absent read absent | 0.985±0.006 |
| presence size: share of 'present' readings that abstain | 0.152±0.087 |
| presence size: share of FALSE 'present' readings that abstain | 0.650±0.374 |
| presence style: absent read absent | 0.962±0.015 |
| presence style: share of 'present' readings that abstain | 0.694±0.092 |
| presence style: share of FALSE 'present' readings that abstain | 0.951±0.063 |
| presence text: present read present | 0.924±0.047 |
| presence relation: present read present | 0.975±0.020 |
| presence relation: share of 'present' readings that abstain | 0.086±0.062 |
| presence relation: share of true 'present' readings that abstain | 0.086±0.062 |
| presence landmark: present read present | 0.958±0.046 |
| presence landmark: share of 'present' readings that abstain | 0.134±0.063 |
| presence landmark: share of true 'present' readings that abstain | 0.119±0.065 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.998±0.004 |
| presence target: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.821±0.022 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.821±0.022 |
| event type (synonym table) | 0.821±0.022 |
| role object | 0.693±0.033 |
| head object | 0.724±0.038 |
| lexical order head object | 0.100±0.000 |
| lexical bag head object | 0.200±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.735±0.031 |
| occupancy: known filler | 0.783±0.026 |
| role color | 0.979±0.013 |
| head color | 0.979±0.013 |
| lexical order head color | 0.967±0.000 |
| lexical bag head color | 0.963±0.000 |
| occupancy: not given | 0.994±0.001 |
| role size | 0.982±0.004 |
| head size | 0.982±0.004 |
| lexical order head size | 0.950±0.000 |
| lexical bag head size | 0.977±0.000 |
| role style | 0.961±0.013 |
| head style | 0.961±0.013 |
| lexical order head style | 0.977±0.000 |
| lexical bag head style | 0.977±0.000 |
| role text | 0.968±0.006 |
| head text | 0.968±0.006 |
| lexical order head text | 0.870±0.000 |
| lexical bag head text | 0.997±0.000 |
| role relation | 0.988±0.002 |
| head relation | 0.988±0.002 |
| lexical order head relation | 0.910±0.000 |
| lexical bag head relation | 0.960±0.000 |
| role landmark | 0.965±0.003 |
| head landmark | 0.985±0.003 |
| lexical order head landmark | 0.910±0.000 |
| lexical bag head landmark | 0.917±0.000 |
| role region | 0.991±0.001 |
| head region | 0.991±0.001 |
| lexical order head region | 0.923±0.000 |
| lexical bag head region | 0.980±0.000 |
| role anchor | 0.991±0.002 |
| head anchor | 0.991±0.002 |
| lexical order head anchor | 0.930±0.000 |
| lexical bag head anchor | 1.000±0.000 |
| role fraction | 0.996±0.001 |
| head fraction | 0.996±0.001 |
| lexical order head fraction | 0.963±0.000 |
| lexical bag head fraction | 1.000±0.000 |
| role amount | 0.997±0.002 |
| head amount | 0.997±0.002 |
| lexical order head amount | 0.947±0.000 |
| lexical bag head amount | 1.000±0.000 |
| role unit | 0.997±0.000 |
| head unit | 0.997±0.000 |
| lexical order head unit | 0.947±0.000 |
| lexical bag head unit | 0.997±0.000 |
| role direction | 0.993±0.004 |
| head direction | 0.993±0.004 |
| lexical order head direction | 0.933±0.000 |
| lexical bag head direction | 0.947±0.000 |
| role axis | 0.991±0.006 |
| head axis | 0.991±0.006 |
| lexical order head axis | 0.947±0.000 |
| lexical bag head axis | 0.947±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.967±0.000 |
| lexical bag head layout | 0.967±0.000 |
| role pairing | 0.995±0.003 |
| head pairing | 0.995±0.003 |
| lexical order head pairing | 0.963±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.912±0.006 |
| head source | 0.935±0.006 |
| lexical order head source | 0.873±0.000 |
| lexical bag head source | 0.893±0.000 |
| role target | 0.963±0.002 |
| head target | 0.983±0.004 |
| lexical order head target | 0.910±0.000 |
| lexical bag head target | 0.917±0.000 |
| role quantity | 0.983±0.002 |
| head quantity | 0.983±0.002 |
| lexical order head quantity | 0.970±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.643±0.044 |
| heads FULL (lexical order baseline) | 0.010±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.087±0.000 |
| presence size: present read present | 0.985±0.031 |
| presence size: share of true 'present' readings that abstain | 0.047±0.039 |
| presence text: absent read absent | 0.990±0.005 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.998±0.002 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence object: absent read absent | 0.584±0.024 |
| presence object: share of FALSE 'present' readings that abstain | 0.020±0.040 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.040±0.080 |
| presence pairing: share of true 'present' readings that abstain | 0.040±0.080 |
| presence source: present read present | 0.590±0.035 |
| presence amount: present read present | 0.987±0.027 |
| presence amount: share of 'present' readings that abstain | 0.027±0.033 |
| presence amount: share of true 'present' readings that abstain | 0.027±0.033 |
| presence unit: present read present | 0.988±0.025 |
| presence unit: share of 'present' readings that abstain | 0.040±0.033 |
| presence unit: share of true 'present' readings that abstain | 0.040±0.033 |
| presence source: share of 'present' readings that abstain | 0.460±0.084 |
| presence source: share of true 'present' readings that abstain | 0.450±0.079 |
| presence target: present read present | 0.931±0.023 |
| presence target: share of 'present' readings that abstain | 0.026±0.034 |
| presence target: share of true 'present' readings that abstain | 0.026±0.034 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence text: share of 'present' readings that abstain | 0.078±0.025 |
| presence text: share of true 'present' readings that abstain | 0.046±0.029 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence color: present read present | 0.920±0.075 |
| presence color: share of 'present' readings that abstain | 0.415±0.131 |
| presence color: share of true 'present' readings that abstain | 0.152±0.050 |
| presence region: present read present | 0.962±0.019 |
| presence region: share of 'present' readings that abstain | 0.050±0.032 |
| presence region: share of true 'present' readings that abstain | 0.050±0.032 |
| presence direction: present read present | 0.989±0.022 |
| presence direction: share of 'present' readings that abstain | 0.069±0.043 |
| presence direction: share of true 'present' readings that abstain | 0.069±0.043 |
| presence color: share of FALSE 'present' readings that abstain | 0.983±0.033 |
| presence quantity: present read present | 0.950±0.100 |
| presence quantity: share of 'present' readings that abstain | 0.240±0.159 |
| presence quantity: share of true 'present' readings that abstain | 0.240±0.159 |
| presence style: present read present | 0.967±0.067 |
| presence style: share of true 'present' readings that abstain | 0.290±0.092 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |
| presence text: share of FALSE 'present' readings that abstain | 0.450±0.245 |

residual mean 0.498±0.015; status {'abstain': 189, 'ok': 57, 'no-sense': 54}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.820 | 0.378 / 0.276 | 1.00 | 0.180 | 0.000 / 0.000 |
| role object | 0.685 | 0.184 / 0.000 | 0.67 | 0.041 | 0.052 / 0.274 |
| roles (pooled) | 0.721 | 0.174 / 0.000 | 0.74 | 0.080 | 0.059 / 0.199 |
| role text | 0.744 | 0.152 / 0.000 | 0.72 | 0.051 | 0.077 / 0.205 |
| role relation | 0.852 | 0.162 / 0.049 | 0.89 | 0.037 | 0.000 / 0.111 |
| role landmark | 0.630 | 0.177 / 0.011 | 0.85 | 0.259 | 0.037 / 0.111 |
| role size | 0.867 | 0.148 / 0.013 | 0.80 | 0.000 | 0.067 / 0.133 |
| role anchor | 0.857 | 0.283 / 0.187 | 1.00 | 0.143 | 0.000 / 0.000 |
| role fraction | 0.909 | 0.196 / 0.124 | 1.00 | 0.091 | 0.000 / 0.000 |
| role pairing | 0.909 | 0.233 / 0.030 | 0.73 | 0.000 | 0.182 / 0.091 |
| role source | 0.342 | 0.027 / 0.000 | 0.34 | 0.184 | 0.184 / 0.474 |
| role amount | 0.875 | 0.196 / 0.139 | 0.94 | 0.062 | 0.000 / 0.062 |
| role unit | 0.938 | 0.222 / 0.120 | 0.94 | 0.062 | 0.062 / 0.000 |
| role target | 0.630 | 0.143 / 0.066 | 0.89 | 0.296 | 0.037 / 0.074 |
| role axis | 0.875 | 0.307 / 0.240 | 1.00 | 0.125 | 0.000 / 0.000 |
| role layout | 1.000 | 0.258 / 0.224 | 1.00 | 0.000 | 0.000 / 0.000 |
| role color | 0.800 | 0.150 / 0.000 | 0.70 | 0.000 | 0.100 / 0.200 |
| role region | 0.870 | 0.169 / 0.005 | 0.83 | 0.000 | 0.043 / 0.130 |
| role direction | 0.850 | 0.170 / 0.000 | 0.80 | 0.000 | 0.050 / 0.150 |
| role quantity | 0.444 | 0.086 / 0.032 | 0.78 | 0.444 | 0.111 / 0.111 |
| role style | 0.714 | 0.047 / 0.008 | 0.57 | 0.143 | 0.286 / 0.143 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 COMPONENT=0.98 PAIR=0.92 not=0.89 UNIT=0.87 REL=0.80 DIR=0.79 ANCHOR=0.71 AXIS=0.59 VERB=0.57 REGION=0.54 back=0.52 flow=0.51 front=0.49 FILLER=0.47 LABEL=0.44 LAYOUT=0.40 dimensiunea=0.40 apart=0.35 never=0.15 CONN=0.12 din=0.12 do=0.12 the=0.12 together=0.12 unknown=0.12 are=0.11 is=0.09 care=0.08 PRON=0.05 pe=0.03 SIZE=0.03 evenly=0.03 INTRO=0.02 lui=0.02 COLOR=0.02 STYLE=0.02 color=0.01 DEM=0.01 FRACTION=0.01 spre=0.01 cu=0.01 QUANT=0.00 la=0.00 NUM=0.00 de=0.00 a=0.00

## What is weak, what to add
- heldout_formulations: FULL 0.524
- heldout_formulations: structure (depth, negation) 0.835
- heldout_formulations: predicate (surface lemma) 0.835
- heldout_formulations: event type (synonym table) 0.835
- heldout_formulations: role object 0.665
- heldout_formulations: head object 0.733
- heldout_formulations: occupancy: known filler 0.794
- heldout_formulations: role source 0.869
- heldout_formulations: head source 0.883
- heldout_formulations: heads FULL (model) 0.607
- heldout_formulations: heads FULL (lexical order baseline) 0.019
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.044
- heldout_formulations: FULL [depth given] 0.524
- heldout_formulations: FULL [depth and negation given] 0.524
- heldout_formulations: FULL [presence not decided] 0.422
- heldout_formulations: role object [presence not decided] 0.772
- heldout_formulations: role color [presence not decided] 0.772
- heldout_formulations: role size [presence not decided] 0.854
- heldout_formulations: role style [presence not decided] 0.893
- heldout_formulations: role source [presence not decided] 0.854
- heldout_formulations: heads FULL (model) [presence not decided] 0.476
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.490
- heldout_formulations: role object [pooled midpoint (comparison)] 0.646
- heldout_formulations: role source [pooled midpoint (comparison)] 0.869
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.578
- heldout_formulations: presence object: share of 'present' readings that abstain 0.140
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.140
- heldout_formulations: presence text: present read present 0.750
- heldout_formulations: presence text: share of 'present' readings that abstain 0.200
- heldout_formulations: presence text: share of true 'present' readings that abstain 0.200
- heldout_formulations: presence text: present read present [pooled midpoint (comparison)] 0.789
- heldout_formulations: presence source: present read present 0.433
- heldout_formulations: presence target: share of 'present' readings that abstain 0.160
- heldout_formulations: presence target: share of true 'present' readings that abstain 0.160
- heldout_formulations: determiner identity (outside FULL when the legend excludes it) 0.837
- heldout_formulations: presence source: present read present [pooled midpoint (comparison)] 0.433
- heldout_formulations: presence style: share of 'present' readings that abstain 0.706
- heldout_formulations: presence pairing: share of 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence source: share of 'present' readings that abstain 0.769
- heldout_formulations: presence source: share of true 'present' readings that abstain 0.769
- heldout_formulations: presence size: share of 'present' readings that abstain 0.143
- heldout_formulations: presence size: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of 'present' readings that abstain 0.071
- heldout_formulations: presence fraction: share of true 'present' readings that abstain 0.071
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.042
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.042
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.042
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.042
- heldout_formulations: presence amount: share of 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence style: present read present 0.875
- heldout_formulations: presence style: share of true 'present' readings that abstain 0.286
- heldout_formulations: presence region: share of 'present' readings that abstain 0.077
- heldout_formulations: presence region: share of true 'present' readings that abstain 0.077
- heldout_formulations: presence region: present read present [pooled midpoint (comparison)] 0.833
- heldout_formulations: presence quantity: share of 'present' readings that abstain 0.500
- heldout_formulations: presence quantity: share of true 'present' readings that abstain 0.500
- heldout_formulations: presence size: share of FALSE 'present' readings that abstain 0.600
- heldout_formulations: presence color: share of 'present' readings that abstain 0.800
- heldout_formulations: presence color: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence axis: share of 'present' readings that abstain 0.000
- heldout_formulations: presence axis: share of true 'present' readings that abstain 0.000
- heldout_sentences: FULL 0.588
- heldout_sentences: presence object: share of 'present' readings that abstain 0.078
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.080
- heldout_sentences: presence size: share of 'present' readings that abstain 0.138
- heldout_sentences: presence size: share of true 'present' readings that abstain 0.042
- heldout_sentences: presence amount: share of 'present' readings that abstain 0.041
- heldout_sentences: presence amount: share of true 'present' readings that abstain 0.041
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.020
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.020
- heldout_sentences: structure (depth, negation) 0.817
- heldout_sentences: predicate (surface lemma) 0.817
- heldout_sentences: event type (synonym table) 0.817
- heldout_sentences: role object 0.695
- heldout_sentences: head object 0.724
- heldout_sentences: occupancy: known filler 0.787
- heldout_sentences: heads FULL (model) 0.648
- heldout_sentences: heads FULL (lexical order baseline) 0.012
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.053
- heldout_sentences: FULL [depth given] 0.588
- heldout_sentences: FULL [depth and negation given] 0.588
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.551
- heldout_sentences: role object [pooled midpoint (comparison)] 0.675
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.599
- heldout_sentences: presence source: present read present 0.552
- heldout_sentences: presence source: share of 'present' readings that abstain 0.688
- heldout_sentences: presence source: share of true 'present' readings that abstain 0.688
- heldout_sentences: presence target: share of 'present' readings that abstain 0.024
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.024
- heldout_sentences: determiner identity (outside FULL when the legend excludes it) 0.777
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.577
- heldout_sentences: presence target: present read present [pooled midpoint (comparison)] 0.786
- heldout_sentences: presence axis: share of 'present' readings that abstain 0.000
- heldout_sentences: presence axis: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence region: share of 'present' readings that abstain 0.103
- heldout_sentences: presence region: share of true 'present' readings that abstain 0.103
- heldout_sentences: presence anchor: share of 'present' readings that abstain 0.000
- heldout_sentences: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence layout: share of 'present' readings that abstain 0.000
- heldout_sentences: presence layout: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence object: absent read absent 0.722
- heldout_sentences: presence direction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence direction: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence object: absent read absent [pooled midpoint (comparison)] 0.710
- heldout_sentences: presence text: share of 'present' readings that abstain 0.077
- heldout_sentences: presence text: share of true 'present' readings that abstain 0.077
- heldout_sentences: presence relation: share of 'present' readings that abstain 0.036
- heldout_sentences: presence relation: share of true 'present' readings that abstain 0.036
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.103
- heldout_sentences: presence landmark: share of true 'present' readings that abstain 0.071
- heldout_sentences: presence size: share of FALSE 'present' readings that abstain 0.600
- heldout_sentences: presence pairing: share of 'present' readings that abstain 0.083
- heldout_sentences: presence pairing: share of true 'present' readings that abstain 0.083
- heldout_sentences: presence text: present read present [pooled midpoint (comparison)] 0.893
- heldout_sentences: presence region: present read present [pooled midpoint (comparison)] 0.893
- heldout_sentences: presence style: share of 'present' readings that abstain 0.684
- heldout_sentences: presence color: share of 'present' readings that abstain 0.161
- heldout_sentences: presence color: share of true 'present' readings that abstain 0.038
- heldout_sentences: presence color: present read present [pooled midpoint (comparison)] 0.852
- heldout_sentences: presence object: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence color: share of FALSE 'present' readings that abstain 0.800
- heldout_sentences: presence style: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence quantity: share of 'present' readings that abstain 0.091
- heldout_sentences: presence quantity: share of true 'present' readings that abstain 0.091
- mixed: FULL 0.555
- mixed: presence object: share of 'present' readings that abstain 0.067
- mixed: presence object: share of true 'present' readings that abstain 0.065
- mixed: presence relation: share of 'present' readings that abstain 0.024
- mixed: presence relation: share of true 'present' readings that abstain 0.024
- mixed: presence landmark: share of 'present' readings that abstain 0.049
- mixed: presence landmark: share of true 'present' readings that abstain 0.049
- mixed: structure (depth, negation) 0.782
- mixed: predicate (surface lemma) 0.782
- mixed: event type (synonym table) 0.782
- mixed: role object 0.660
- mixed: head object 0.693
- mixed: determiner identity (outside FULL when the legend excludes it) 0.722
- mixed: occupancy: known filler 0.761
- mixed: heads FULL (model) 0.608
- mixed: heads FULL (lexical order baseline) 0.013
- mixed: heads FULL (lexical bag baseline, trained on the same training rows) 0.105
- mixed: FULL [depth given] 0.555
- mixed: FULL [depth and negation given] 0.555
- mixed: FULL [pooled midpoint (comparison)] 0.502
- mixed: role object [pooled midpoint (comparison)] 0.635
- mixed: heads FULL (model) [pooled midpoint (comparison)] 0.555
- mixed: presence anchor: share of 'present' readings that abstain 0.069
- mixed: presence anchor: share of true 'present' readings that abstain 0.069
- mixed: presence anchor: present read present [pooled midpoint (comparison)] 0.880
- mixed: presence layout: share of 'present' readings that abstain 0.000
- mixed: presence layout: share of true 'present' readings that abstain 0.000
- mixed: presence amount: share of 'present' readings that abstain 0.000
- mixed: presence amount: share of true 'present' readings that abstain 0.000
- mixed: presence unit: share of 'present' readings that abstain 0.000
- mixed: presence unit: share of true 'present' readings that abstain 0.000
- mixed: presence size: share of 'present' readings that abstain 0.250
- mixed: presence size: share of FALSE 'present' readings that abstain 0.500
- mixed: presence source: present read present 0.556
- mixed: presence target: share of 'present' readings that abstain 0.200
- mixed: presence target: share of true 'present' readings that abstain 0.200
- mixed: presence source: present read present [pooled midpoint (comparison)] 0.576
- mixed: presence target: present read present [pooled midpoint (comparison)] 0.870
- mixed: presence color: present read present 0.812
- mixed: presence color: share of 'present' readings that abstain 0.294
- mixed: presence color: share of true 'present' readings that abstain 0.077
- mixed: presence color: present read present [pooled midpoint (comparison)] 0.750
- mixed: presence text: share of 'present' readings that abstain 0.105
- mixed: presence text: share of true 'present' readings that abstain 0.105
- mixed: presence region: share of 'present' readings that abstain 0.032
- mixed: presence region: share of true 'present' readings that abstain 0.032
- mixed: presence region: present read present [pooled midpoint (comparison)] 0.833
- mixed: presence fraction: share of 'present' readings that abstain 0.214
- mixed: presence fraction: share of true 'present' readings that abstain 0.214
- mixed: presence axis: share of 'present' readings that abstain 0.000
- mixed: presence axis: share of true 'present' readings that abstain 0.000
- mixed: presence style: share of 'present' readings that abstain 0.826
- mixed: presence quantity: share of 'present' readings that abstain 0.000
- mixed: presence quantity: share of true 'present' readings that abstain 0.000
- mixed: presence direction: share of 'present' readings that abstain 0.118
- mixed: presence direction: share of true 'present' readings that abstain 0.118
- mixed: presence direction: present read present [pooled midpoint (comparison)] 0.875
- mixed: presence object: absent read absent 0.810
- mixed: presence pairing: share of 'present' readings that abstain 0.000
- mixed: presence pairing: share of true 'present' readings that abstain 0.000
- mixed: presence source: share of 'present' readings that abstain 0.600
- mixed: presence source: share of true 'present' readings that abstain 0.600
- mixed: presence object: absent read absent [pooled midpoint (comparison)] 0.895
- mixed: presence style: share of true 'present' readings that abstain 0.500
- mixed: presence object: share of FALSE 'present' readings that abstain 0.250
- mixed: presence size: present read present [pooled midpoint (comparison)] 0.727
- mixed: presence size: share of true 'present' readings that abstain 0.200
- new_identities: FULL 0.642
- new_identities: presence object: share of 'present' readings that abstain 0.071
- new_identities: presence object: share of true 'present' readings that abstain 0.073
- new_identities: structure (depth, negation) 0.825
- new_identities: predicate (surface lemma) 0.825
- new_identities: event type (synonym table) 0.825
- new_identities: role object 0.693
- new_identities: head object 0.703
- new_identities: occupancy: unknown filler 0.772
- new_identities: role text 0.875
- new_identities: head text 0.875
- new_identities: heads FULL (model) 0.645
- new_identities: heads FULL (lexical order baseline) 0.000
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.113
- new_identities: FULL [depth given] 0.642
- new_identities: FULL [depth and negation given] 0.642
- new_identities: FULL [pooled midpoint (comparison)] 0.583
- new_identities: role object [pooled midpoint (comparison)] 0.667
- new_identities: role text [pooled midpoint (comparison)] 0.850
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.588
- new_identities: presence anchor: share of 'present' readings that abstain 0.133
- new_identities: presence anchor: share of true 'present' readings that abstain 0.133
- new_identities: presence fraction: share of 'present' readings that abstain 0.000
- new_identities: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities: occupancy: known filler 0.826
- new_identities: presence amount: share of 'present' readings that abstain 0.011
- new_identities: presence amount: share of true 'present' readings that abstain 0.011
- new_identities: presence unit: share of 'present' readings that abstain 0.000
- new_identities: presence unit: share of true 'present' readings that abstain 0.000
- new_identities: presence direction: share of 'present' readings that abstain 0.048
- new_identities: presence direction: share of true 'present' readings that abstain 0.048
- new_identities: presence region: share of 'present' readings that abstain 0.105
- new_identities: presence region: share of true 'present' readings that abstain 0.105
- new_identities: presence region: present read present [pooled midpoint (comparison)] 0.824
- new_identities: determiner identity (outside FULL when the legend excludes it) 0.866
- new_identities: presence text: share of 'present' readings that abstain 0.106
- new_identities: presence text: share of true 'present' readings that abstain 0.095
- new_identities: presence relation: share of 'present' readings that abstain 0.062
- new_identities: presence relation: share of true 'present' readings that abstain 0.062
- new_identities: presence landmark: present read present 0.892
- new_identities: presence landmark: present read present [pooled midpoint (comparison)] 0.770
- new_identities: presence object: absent read absent 0.400
- new_identities: presence object: share of FALSE 'present' readings that abstain 0.000
- new_identities: presence source: present read present 0.500
- new_identities: presence target: share of 'present' readings that abstain 0.346
- new_identities: presence target: share of true 'present' readings that abstain 0.346
- new_identities: presence object: absent read absent [pooled midpoint (comparison)] 0.375
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.423
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.808
- new_identities: presence landmark: share of 'present' readings that abstain 0.102
- new_identities: presence landmark: share of true 'present' readings that abstain 0.086
- new_identities: presence size: share of 'present' readings that abstain 0.100
- new_identities: presence size: share of true 'present' readings that abstain 0.000
- new_identities: presence color: share of 'present' readings that abstain 0.500
- new_identities: presence color: share of FALSE 'present' readings that abstain 0.800
- new_identities: presence source: share of 'present' readings that abstain 0.571
- new_identities: presence source: share of true 'present' readings that abstain 0.571
- new_identities: presence color: present read present 0.714
- new_identities: presence color: share of true 'present' readings that abstain 0.200
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.571
- new_identities: presence size: share of FALSE 'present' readings that abstain 0.500
- new_identities: presence text: share of FALSE 'present' readings that abstain 0.500
- train (sample): FULL 0.573
- train (sample): presence object: present read present 0.900
- train (sample): presence object: share of 'present' readings that abstain 0.091
- train (sample): presence object: share of true 'present' readings that abstain 0.096
- train (sample): presence size: share of 'present' readings that abstain 0.176
- train (sample): presence size: share of FALSE 'present' readings that abstain 0.500
- train (sample): presence style: share of 'present' readings that abstain 0.750
- train (sample): presence text: present read present 0.853
- train (sample): presence relation: share of 'present' readings that abstain 0.000
- train (sample): presence relation: share of true 'present' readings that abstain 0.000
- train (sample): presence landmark: share of 'present' readings that abstain 0.083
- train (sample): presence landmark: share of true 'present' readings that abstain 0.043
- train (sample): structure (depth, negation) 0.820
- train (sample): predicate (surface lemma) 0.820
- train (sample): event type (synonym table) 0.820
- train (sample): role object 0.680
- train (sample): head object 0.710
- train (sample): determiner identity (outside FULL when the legend excludes it) 0.737
- train (sample): occupancy: known filler 0.772
- train (sample): heads FULL (model) 0.627
- train (sample): heads FULL (lexical order baseline) 0.010
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.087
- train (sample): FULL [depth given] 0.573
- train (sample): FULL [depth and negation given] 0.573
- train (sample): presence size: share of true 'present' readings that abstain 0.077
- train (sample): presence anchor: share of 'present' readings that abstain 0.000
- train (sample): presence anchor: share of true 'present' readings that abstain 0.000
- train (sample): presence fraction: share of 'present' readings that abstain 0.000
- train (sample): presence fraction: share of true 'present' readings that abstain 0.000
- train (sample): presence object: absent read absent 0.593
- train (sample): presence object: share of FALSE 'present' readings that abstain 0.000
- train (sample): presence pairing: share of 'present' readings that abstain 0.200
- train (sample): presence pairing: share of true 'present' readings that abstain 0.200
- train (sample): presence source: present read present 0.543
- train (sample): presence amount: share of 'present' readings that abstain 0.000
- train (sample): presence amount: share of true 'present' readings that abstain 0.000
- train (sample): presence unit: share of 'present' readings that abstain 0.067
- train (sample): presence unit: share of true 'present' readings that abstain 0.067
- train (sample): presence source: share of 'present' readings that abstain 0.368
- train (sample): presence source: share of true 'present' readings that abstain 0.368
- train (sample): presence target: share of 'present' readings that abstain 0.083
- train (sample): presence target: share of true 'present' readings that abstain 0.083
- train (sample): presence axis: share of 'present' readings that abstain 0.000
- train (sample): presence axis: share of true 'present' readings that abstain 0.000
- train (sample): presence text: share of 'present' readings that abstain 0.100
- train (sample): presence text: share of true 'present' readings that abstain 0.103
- train (sample): presence layout: share of 'present' readings that abstain 0.000
- train (sample): presence layout: share of true 'present' readings that abstain 0.000
- train (sample): presence color: present read present 0.800
- train (sample): presence color: share of 'present' readings that abstain 0.300
- train (sample): presence color: share of true 'present' readings that abstain 0.125
- train (sample): presence region: share of 'present' readings that abstain 0.050
- train (sample): presence region: share of true 'present' readings that abstain 0.050
- train (sample): presence direction: share of 'present' readings that abstain 0.059
- train (sample): presence direction: share of true 'present' readings that abstain 0.059
- train (sample): presence quantity: share of 'present' readings that abstain 0.250
- train (sample): presence quantity: share of true 'present' readings that abstain 0.250
- train (sample): presence style: share of true 'present' readings that abstain 0.400
- train (sample): presence text: share of FALSE 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_formulations: `as_vrea sa faci COMPONENT STYLE .` FULL 0.000 (n 3)
- heldout_formulations: `hai sa inseram NUM COMPONENT` FULL 0.000 (n 2)
- heldout_formulations: `okay deci redenumeste COMPONENT in LABEL` FULL 0.000 (n 2)
- heldout_formulations: `vreau sa redenumiti COMPONENT in LABEL` FULL 0.000 (n 2)
- heldout_sentences: `ai putea sa atasezi QUANT COMPONENT PAIR .` FULL 0.000 (n 2)
- heldout_sentences: `am nevoie sa cresteti COMPONENT` FULL 0.000 (n 2)
- heldout_sentences: `vreau sa anulezi` FULL 0.000 (n 2)
- mixed: `as_vrea sa redo` FULL 0.000 (n 2)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role size | role style | role text | role relation | role landmark | role region | role anchor | role fraction | role amount | role unit | role direction | role axis | role layout | role pairing | role source | role target | role quantity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.602±0.039 | 0.524±0.030 | 0.658±0.028 | 0.970±0.024 | 0.972±0.004 | 0.943±0.014 | 0.972±0.011 | 0.985±0.003 | 0.960±0.002 | 0.999±0.002 | 0.997±0.006 | 0.997±0.006 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.869±0.009 | 0.937±0.008 | 0.959±0.007 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.580±0.016 | 0.494±0.022 | 0.639±0.009 | 0.998±0.002 | 0.979±0.004 | 0.935±0.014 | 0.954±0.007 | 0.978±0.004 | 0.951±0.000 | 0.983±0.002 | 0.995±0.003 | 0.996±0.002 | 0.999±0.002 | 0.998±0.002 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.871±0.007 | 0.936±0.009 | 0.957±0.004 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.482±0.006 | 0.428±0.006 | 0.765±0.007 | 0.769±0.002 | 0.854±0.000 | 0.893±0.000 | 0.990±0.005 | 1.000±0.000 | 0.929±0.010 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.991±0.004 | 1.000±0.000 | 0.868±0.011 | 0.938±0.006 | 1.000±0.000 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 0.939±0.012 | 1.000±0.000 | 0.970±0.006 | 0.120±0.020 (— / 0.120±0.020) |
| heldout_formulations | object | comparison: pooled midpoint | 0.946±0.009 | 1.000±0.000 | 0.973±0.004 |  |
| heldout_formulations | color | product: fitted | 1.000±0.000 | 0.963±0.029 | 0.981±0.015 | 0.762±0.162 (1.000±0.000 / 0.000±0.000) |
| heldout_formulations | color | comparison: pooled midpoint | 1.000±0.000 | 0.998±0.003 | 0.999±0.001 |  |
| heldout_formulations | size | product: fitted | 1.000±0.000 | 0.966±0.006 | 0.983±0.003 | 0.120±0.044 (0.476±0.187 / 0.012±0.024) |
| heldout_formulations | size | comparison: pooled midpoint | 1.000±0.000 | 0.974±0.006 | 0.987±0.003 |  |
| heldout_formulations | style | product: fitted | 0.928±0.059 | 0.953±0.011 | 0.941±0.035 | 0.752±0.048 (1.000±0.000 / 0.494±0.149) |
| heldout_formulations | style | comparison: pooled midpoint | 0.950±0.061 | 0.947±0.018 | 0.948±0.037 |  |
| heldout_formulations | text | product: fitted | 0.827±0.089 | 0.999±0.003 | 0.913±0.044 | 0.164±0.043 (1.000 / 0.153±0.045) |
| heldout_formulations | text | comparison: pooled midpoint | 0.749±0.028 | 0.993±0.000 | 0.871±0.014 |  |
| heldout_formulations | relation | product: fitted | 0.968±0.016 | 1.000±0.000 | 0.984±0.008 | 0.050±0.015 (— / 0.050±0.015) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.926±0.031 | 1.000±0.000 | 0.963±0.016 |  |
| heldout_formulations | landmark | product: fitted | 0.951±0.017 | 1.000±0.000 | 0.976±0.009 | 0.086±0.030 (— / 0.086±0.030) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.909±0.015 | 1.000±0.000 | 0.955±0.007 |  |
| heldout_formulations | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.046±0.038 (— / 0.046±0.038) |
| heldout_formulations | region | comparison: pooled midpoint | 0.783±0.041 | 1.000±0.000 | 0.892±0.020 |  |
| heldout_formulations | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | anchor | comparison: pooled midpoint | 0.985±0.031 | 1.000±0.000 | 0.992±0.015 |  |
| heldout_formulations | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.043±0.057 (— / 0.043±0.057) |
| heldout_formulations | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.025±0.050 (— / 0.025±0.050) |
| heldout_formulations | amount | comparison: pooled midpoint | 0.975±0.050 | 1.000±0.000 | 0.988±0.025 |  |
| heldout_formulations | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.025±0.050 (— / 0.025±0.050) |
| heldout_formulations | unit | comparison: pooled midpoint | 0.950±0.061 | 1.000±0.000 | 0.975±0.031 |  |
| heldout_formulations | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | direction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | layout | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | source | product: fitted | 0.479±0.094 | 0.997±0.004 | 0.738±0.048 | 0.845±0.080 (1.000±0.000 / 0.841±0.082) |
| heldout_formulations | source | comparison: pooled midpoint | 0.483±0.108 | 1.000±0.000 | 0.741±0.054 |  |
| heldout_formulations | target | product: fitted | 0.970±0.036 | 1.000±0.000 | 0.985±0.018 | 0.141±0.022 (— / 0.141±0.022) |
| heldout_formulations | target | comparison: pooled midpoint | 0.977±0.030 | 1.000±0.000 | 0.989±0.015 |  |
| heldout_formulations | quantity | product: fitted | 0.919±0.079 | 1.000±0.000 | 0.959±0.040 | 0.287±0.194 (— / 0.287±0.194) |
| heldout_formulations | quantity | comparison: pooled midpoint | 0.943±0.053 | 1.000±0.000 | 0.971±0.027 |  |
| heldout_sentences | object | product: fitted | 0.899±0.025 | 0.695±0.044 | 0.797±0.023 | 0.082±0.015 (0.000±0.000 / 0.085±0.016) |
| heldout_sentences | object | comparison: pooled midpoint | 0.893±0.010 | 0.698±0.008 | 0.796±0.006 |  |
| heldout_sentences | color | product: fitted | 0.970±0.015 | 0.974±0.017 | 0.972±0.005 | 0.292±0.114 (0.941±0.080 / 0.068±0.027) |
| heldout_sentences | color | comparison: pooled midpoint | 0.889±0.033 | 0.997±0.002 | 0.943±0.015 |  |
| heldout_sentences | size | product: fitted | 0.961±0.001 | 0.984±0.002 | 0.973±0.001 | 0.158±0.045 (0.525±0.131 / 0.066±0.033) |
| heldout_sentences | size | comparison: pooled midpoint | 0.951±0.016 | 0.990±0.001 | 0.971±0.007 |  |
| heldout_sentences | style | product: fitted | 1.000±0.000 | 0.965±0.007 | 0.982±0.003 | 0.810±0.075 (0.896±0.036 / 0.560±0.294) |
| heldout_sentences | style | comparison: pooled midpoint | 1.000±0.000 | 0.962±0.009 | 0.981±0.004 |  |
| heldout_sentences | text | product: fitted | 0.930±0.034 | 1.000±0.000 | 0.965±0.017 | 0.071±0.023 (— / 0.071±0.023) |
| heldout_sentences | text | comparison: pooled midpoint | 0.890±0.014 | 0.996±0.002 | 0.943±0.007 |  |
| heldout_sentences | relation | product: fitted | 0.979±0.007 | 1.000±0.000 | 0.990±0.003 | 0.050±0.018 (— / 0.050±0.018) |
| heldout_sentences | relation | comparison: pooled midpoint | 0.907±0.014 | 1.000±0.000 | 0.954±0.007 |  |
| heldout_sentences | landmark | product: fitted | 0.955±0.018 | 0.995±0.006 | 0.975±0.009 | 0.101±0.043 (1.000±0.000 / 0.073±0.016) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.930±0.023 | 0.998±0.003 | 0.964±0.013 |  |
| heldout_sentences | region | product: fitted | 0.987±0.016 | 1.000±0.000 | 0.993±0.008 | 0.099±0.023 (— / 0.099±0.023) |
| heldout_sentences | region | comparison: pooled midpoint | 0.792±0.064 | 1.000±0.000 | 0.896±0.032 |  |
| heldout_sentences | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | amount | product: fitted | 0.984±0.008 | 1.000±0.000 | 0.992±0.004 | 0.044±0.020 (— / 0.044±0.020) |
| heldout_sentences | amount | comparison: pooled midpoint | 0.945±0.034 | 1.000±0.000 | 0.972±0.017 |  |
| heldout_sentences | unit | product: fitted | 0.976±0.023 | 1.000±0.000 | 0.988±0.011 | 0.029±0.021 (— / 0.029±0.021) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.933±0.034 | 1.000±0.000 | 0.966±0.017 |  |
| heldout_sentences | direction | product: fitted | 0.978±0.030 | 1.000±0.000 | 0.989±0.015 | 0.030±0.028 (— / 0.030±0.028) |
| heldout_sentences | direction | comparison: pooled midpoint | 0.984±0.020 | 1.000±0.000 | 0.992±0.010 |  |
| heldout_sentences | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | layout | product: fitted | 0.985±0.019 | 1.000±0.000 | 0.992±0.009 | 0.046±0.045 (— / 0.046±0.045) |
| heldout_sentences | layout | comparison: pooled midpoint | 0.920±0.037 | 1.000±0.000 | 0.960±0.019 |  |
| heldout_sentences | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.063±0.058 (— / 0.063±0.058) |
| heldout_sentences | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | source | product: fitted | 0.641±0.046 | 0.998±0.003 | 0.820±0.023 | 0.631±0.102 (1.000 / 0.625±0.102) |
| heldout_sentences | source | comparison: pooled midpoint | 0.647±0.057 | 1.000±0.000 | 0.823±0.029 |  |
| heldout_sentences | target | product: fitted | 0.927±0.027 | 1.000±0.000 | 0.963±0.013 | 0.059±0.020 (— / 0.059±0.020) |
| heldout_sentences | target | comparison: pooled midpoint | 0.850±0.060 | 1.000±0.000 | 0.925±0.030 |  |
| heldout_sentences | quantity | product: fitted | 0.927±0.068 | 1.000±0.000 | 0.964±0.034 | 0.018±0.036 (— / 0.018±0.036) |
| heldout_sentences | quantity | comparison: pooled midpoint | 0.964±0.073 | 1.000±0.000 | 0.982±0.036 |  |
| mixed | object | product: fitted | 0.912±0.024 | 0.822±0.066 | 0.867±0.024 | 0.070±0.006 (0.090±0.111 / 0.070±0.007) |
| mixed | object | comparison: pooled midpoint | 0.907±0.009 | 0.866±0.038 | 0.887±0.015 |  |
| mixed | color | product: fitted | 0.851±0.032 | 0.976±0.016 | 0.914±0.011 | 0.348±0.138 (0.988±0.025 / 0.072±0.045) |
| mixed | color | comparison: pooled midpoint | 0.808±0.054 | 0.994±0.003 | 0.901±0.027 |  |
| mixed | size | product: fitted | 0.964±0.045 | 0.993±0.003 | 0.978±0.022 | 0.231±0.089 (0.500±0.316 / 0.165±0.101) |
| mixed | size | comparison: pooled midpoint | 0.800±0.068 | 0.997±0.002 | 0.898±0.034 |  |
| mixed | style | product: fitted | 1.000±0.000 | 0.955±0.008 | 0.978±0.004 | 0.777±0.085 (0.986±0.029 / 0.393±0.232) |
| mixed | style | comparison: pooled midpoint | 0.975±0.050 | 0.954±0.014 | 0.964±0.020 |  |
| mixed | text | product: fitted | 0.939±0.054 | 0.999±0.002 | 0.969±0.027 | 0.065±0.022 (1.000 / 0.061±0.022) |
| mixed | text | comparison: pooled midpoint | 0.934±0.030 | 0.998±0.003 | 0.966±0.017 |  |
| mixed | relation | product: fitted | 0.986±0.012 | 1.000±0.000 | 0.993±0.006 | 0.027±0.025 (— / 0.027±0.025) |
| mixed | relation | comparison: pooled midpoint | 0.935±0.039 | 1.000±0.000 | 0.968±0.020 |  |
| mixed | landmark | product: fitted | 0.986±0.011 | 0.997±0.004 | 0.992±0.005 | 0.096±0.071 (1.000±0.000 / 0.082±0.053) |
| mixed | landmark | comparison: pooled midpoint | 0.950±0.016 | 0.999±0.002 | 0.974±0.009 |  |
| mixed | region | product: fitted | 0.913±0.046 | 1.000±0.000 | 0.957±0.023 | 0.100±0.057 (— / 0.100±0.057) |
| mixed | region | comparison: pooled midpoint | 0.720±0.069 | 1.000±0.000 | 0.860±0.034 |  |
| mixed | anchor | product: fitted | 0.941±0.023 | 1.000±0.000 | 0.971±0.012 | 0.056±0.018 (— / 0.056±0.018) |
| mixed | anchor | comparison: pooled midpoint | 0.873±0.014 | 1.000±0.000 | 0.936±0.007 |  |
| mixed | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.086±0.085 (— / 0.086±0.085) |
| mixed | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| mixed | amount | product: fitted | 0.987±0.016 | 1.000±0.000 | 0.993±0.008 | 0.019±0.026 (— / 0.019±0.026) |
| mixed | amount | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| mixed | unit | product: fitted | 0.987±0.016 | 1.000±0.000 | 0.994±0.008 | 0.020±0.027 (— / 0.020±0.027) |
| mixed | unit | comparison: pooled midpoint | 0.986±0.017 | 1.000±0.000 | 0.993±0.008 |  |
| mixed | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.024±0.047 (— / 0.024±0.047) |
| mixed | direction | comparison: pooled midpoint | 0.940±0.054 | 1.000±0.000 | 0.970±0.027 |  |
| mixed | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| mixed | layout | product: fitted | 0.958±0.000 | 1.000±0.000 | 0.979±0.000 | 0.009±0.017 (— / 0.009±0.017) |
| mixed | layout | comparison: pooled midpoint | 0.942±0.020 | 1.000±0.000 | 0.971±0.010 |  |
| mixed | pairing | product: fitted | 0.983±0.033 | 1.000±0.000 | 0.992±0.017 | 0.053±0.072 (— / 0.053±0.072) |
| mixed | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| mixed | source | product: fitted | 0.609±0.049 | 0.999±0.003 | 0.804±0.023 | 0.521±0.148 (1.000 / 0.515±0.144) |
| mixed | source | comparison: pooled midpoint | 0.578±0.022 | 1.000±0.000 | 0.789±0.011 |  |
| mixed | target | product: fitted | 0.960±0.036 | 1.000±0.000 | 0.980±0.018 | 0.196±0.025 (— / 0.196±0.025) |
| mixed | target | comparison: pooled midpoint | 0.870±0.045 | 1.000±0.000 | 0.935±0.022 |  |
| mixed | quantity | product: fitted | 0.933±0.082 | 1.000±0.000 | 0.967±0.041 | 0.187±0.220 (— / 0.187±0.220) |
| mixed | quantity | comparison: pooled midpoint | 0.967±0.067 | 1.000±0.000 | 0.983±0.033 |  |
| new_identities | object | product: fitted | 0.905±0.028 | 0.320±0.117 | 0.612±0.053 | 0.065±0.016 (0.022±0.044 / 0.065±0.015) |
| new_identities | object | comparison: pooled midpoint | 0.907±0.004 | 0.292±0.147 | 0.600±0.073 |  |
| new_identities | color | product: fitted | 0.718±0.048 | 0.982±0.009 | 0.850±0.026 | 0.537±0.145 (0.960±0.080 / 0.147±0.075) |
| new_identities | color | comparison: pooled midpoint | 0.657±0.114 | 0.998±0.003 | 0.828±0.057 |  |
| new_identities | size | product: fitted | 1.000±0.000 | 0.982±0.003 | 0.991±0.001 | 0.100±0.041 (0.483±0.200 / 0.008±0.017) |
| new_identities | size | comparison: pooled midpoint | 0.992±0.017 | 0.988±0.006 | 0.990±0.005 |  |
| new_identities | style | product: fitted | 1.000±0.000 | 0.971±0.006 | 0.985±0.003 | 0.941±0.054 (1.000±0.000 / 0.400±0.490) |
| new_identities | style | comparison: pooled midpoint | 1.000±0.000 | 0.969±0.011 | 0.985±0.006 |  |
| new_identities | text | product: fitted | 0.953±0.022 | 0.964±0.010 | 0.959±0.011 | 0.095±0.039 (0.597±0.094 / 0.070±0.044) |
| new_identities | text | comparison: pooled midpoint | 0.937±0.014 | 0.951±0.004 | 0.944±0.007 |  |
| new_identities | relation | product: fitted | 0.981±0.012 | 1.000±0.000 | 0.991±0.006 | 0.062±0.024 (— / 0.062±0.024) |
| new_identities | relation | comparison: pooled midpoint | 0.895±0.016 | 1.000±0.000 | 0.948±0.008 |  |
| new_identities | landmark | product: fitted | 0.902±0.012 | 0.996±0.003 | 0.949±0.006 | 0.089±0.027 (1.000±0.000 / 0.074±0.023) |
| new_identities | landmark | comparison: pooled midpoint | 0.807±0.031 | 1.000±0.000 | 0.904±0.016 |  |
| new_identities | region | product: fitted | 0.980±0.024 | 1.000±0.000 | 0.990±0.012 | 0.124±0.042 (— / 0.124±0.042) |
| new_identities | region | comparison: pooled midpoint | 0.771±0.041 | 1.000±0.000 | 0.886±0.020 |  |
| new_identities | anchor | product: fitted | 0.987±0.027 | 1.000±0.000 | 0.993±0.013 | 0.070±0.042 (— / 0.070±0.042) |
| new_identities | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.075±0.150 (— / 0.075±0.150) |
| new_identities | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | amount | product: fitted | 0.996±0.006 | 1.000±0.000 | 0.998±0.003 | 0.020±0.020 (— / 0.020±0.020) |
| new_identities | amount | comparison: pooled midpoint | 0.984±0.012 | 1.000±0.000 | 0.992±0.006 |  |
| new_identities | unit | product: fitted | 0.996±0.006 | 1.000±0.000 | 0.998±0.003 | 0.007±0.009 (— / 0.007±0.009) |
| new_identities | unit | comparison: pooled midpoint | 0.998±0.004 | 1.000±0.000 | 0.999±0.002 |  |
| new_identities | direction | product: fitted | 0.991±0.017 | 1.000±0.000 | 0.996±0.009 | 0.045±0.029 (— / 0.045±0.029) |
| new_identities | direction | comparison: pooled midpoint | 0.961±0.048 | 1.000±0.000 | 0.980±0.024 |  |
| new_identities | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | source | product: fitted | 0.445±0.054 | 0.999±0.002 | 0.722±0.027 | 0.750±0.125 (1.000±0.000 / 0.745±0.122) |
| new_identities | source | comparison: pooled midpoint | 0.421±0.040 | 1.000±0.000 | 0.710±0.020 |  |
| new_identities | target | product: fitted | 0.889±0.040 | 1.000±0.000 | 0.945±0.020 | 0.312±0.028 (— / 0.312±0.028) |
| new_identities | target | comparison: pooled midpoint | 0.767±0.045 | 1.000±0.000 | 0.883±0.023 |  |
| new_identities | quantity | product: fitted | — | 0.999±0.001 | — | 1.000 (1.000 / —) |
| new_identities | quantity | comparison: pooled midpoint | — | 0.999±0.002 | — |  |
| train (sample) | object | product: fitted | 0.909±0.028 | 0.584±0.024 | 0.747±0.006 | 0.090±0.011 (0.020±0.040 / 0.093±0.010) |
| train (sample) | color | product: fitted | 0.920±0.075 | 0.976±0.020 | 0.948±0.029 | 0.415±0.131 (0.983±0.033 / 0.152±0.050) |
| train (sample) | size | product: fitted | 0.985±0.031 | 0.985±0.006 | 0.985±0.015 | 0.152±0.087 (0.650±0.374 / 0.047±0.039) |
| train (sample) | style | product: fitted | 0.967±0.067 | 0.962±0.015 | 0.964±0.037 | 0.694±0.092 (0.951±0.063 / 0.290±0.092) |
| train (sample) | text | product: fitted | 0.924±0.047 | 0.990±0.005 | 0.957±0.023 | 0.078±0.025 (0.450±0.245 / 0.046±0.029) |
| train (sample) | relation | product: fitted | 0.975±0.020 | 1.000±0.000 | 0.988±0.010 | 0.086±0.062 (— / 0.086±0.062) |
| train (sample) | landmark | product: fitted | 0.958±0.046 | 0.998±0.002 | 0.978±0.022 | 0.134±0.063 (1.000±0.000 / 0.119±0.065) |
| train (sample) | region | product: fitted | 0.962±0.019 | 1.000±0.000 | 0.981±0.010 | 0.050±0.032 (— / 0.050±0.032) |
| train (sample) | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | amount | product: fitted | 0.987±0.027 | 1.000±0.000 | 0.993±0.013 | 0.027±0.033 (— / 0.027±0.033) |
| train (sample) | unit | product: fitted | 0.988±0.025 | 1.000±0.000 | 0.994±0.012 | 0.040±0.033 (— / 0.040±0.033) |
| train (sample) | direction | product: fitted | 0.989±0.022 | 1.000±0.000 | 0.994±0.011 | 0.069±0.043 (— / 0.069±0.043) |
| train (sample) | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.040±0.080 (— / 0.040±0.080) |
| train (sample) | source | product: fitted | 0.590±0.035 | 0.998±0.004 | 0.794±0.018 | 0.460±0.084 (1.000 / 0.450±0.079) |
| train (sample) | target | product: fitted | 0.931±0.023 | 1.000±0.000 | 0.966±0.011 | 0.026±0.034 (— / 0.026±0.034) |
| train (sample) | quantity | product: fitted | 0.950±0.100 | 1.000±0.000 | 0.975±0.050 | 0.240±0.159 (— / 0.240±0.159) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
