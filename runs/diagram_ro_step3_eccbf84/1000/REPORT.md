# REPORT — world `diagram_ro`, legend sha256:1a43ffc61bd5… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
2200 annotated sentences from 4 files; provenance: {'generator': 2200}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/1000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 194 sentences
- heldout_formulations: 206 sentences
- heldout_sentences: 94 sentences
- mixed: 400 sentences
- new_identities: 400 sentences
- train: 906 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['250', '35', '45', '90', 'analytics', 'broker', 'crawler', 'dashboard', 'gamma_ray', 'indexer', 'ingest', 'irina', 'loyalty', 'notifications', 'payroll', 'recommendations', 'registry', 'returns', 'routing', 'theta', 'tracking', 'vault', 'victor', 'zeta']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
16744 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2, 3, 4], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit eccbf84. Memory curve: runs/1000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 1.267 [rule: fit; pooled midpoint 1.421 (comparison)] (present 1.679, n 558 / absent 1.162, n 36)
- attr_presence:object: threshold 0.378 [rule: fit; pooled midpoint 0.447 (comparison)] (present 0.625, n 235 / absent 0.270, n 323)
- det_presence:object: threshold 0.544 [rule: fit; pooled midpoint 0.613 (comparison)] (present 0.929, n 235 / absent 0.296, n 323)
- presence:color: threshold 0.235 [rule: fit; pooled midpoint 0.275 (comparison)] (present 0.442, n 22 / absent 0.109, n 572)
- presence:size: threshold 0.247 [rule: fit; pooled midpoint 0.276 (comparison)] (present 0.425, n 44 / absent 0.127, n 550)
- presence:style: threshold -0.004 [rule: fit; pooled midpoint 0.025 (comparison)] (present 0.024, n 17 / absent 0.026, n 577)
- presence:text: threshold 0.304 [rule: fit; pooled midpoint 0.366 (comparison)] (present 0.545, n 77 / absent 0.188, n 517)
- presence:relation: threshold 0.220 [rule: fit; pooled midpoint 0.254 (comparison)] (present 0.435, n 79 / absent 0.072, n 515)
- presence:landmark: threshold 0.333 [rule: fit; pooled midpoint 0.372 (comparison)] (present 0.569, n 79 / absent 0.174, n 515)
- presence:region: threshold 0.250 [rule: fit; pooled midpoint 0.362 (comparison)] (present 0.563, n 45 / absent 0.160, n 549)
- presence:anchor: threshold 0.184 [rule: fit; pooled midpoint 0.216 (comparison)] (present 0.405, n 35 / absent 0.028, n 559)
- presence:fraction: threshold 0.205 [rule: fit; pooled midpoint 0.225 (comparison)] (present 0.355, n 22 / absent 0.095, n 572)
- presence:amount: threshold 0.325 [rule: fit; pooled midpoint 0.380 (comparison)] (present 0.689, n 38 / absent 0.071, n 556)
- presence:unit: threshold 0.361 [rule: fit; pooled midpoint 0.473 (comparison)] (present 0.810, n 38 / absent 0.135, n 556)
- presence:direction: threshold 0.181 [rule: fit; pooled midpoint 0.212 (comparison)] (present 0.365, n 30 / absent 0.059, n 564)
- presence:axis: threshold 0.297 [rule: fit; pooled midpoint 0.256 (comparison)] (present 0.443, n 14 / absent 0.069, n 580)
- presence:layout: threshold 0.312 [rule: fit; pooled midpoint 0.306 (comparison)] (present 0.569, n 18 / absent 0.042, n 576)
- presence:pairing: threshold 0.143 [rule: fit; pooled midpoint 0.165 (comparison)] (present 0.288, n 11 / absent 0.041, n 583)
- presence:source: threshold 0.223 [rule: fit; pooled midpoint 0.339 (comparison)] (present 0.607, n 74 / absent 0.071, n 520)
- presence:target: threshold 0.311 [rule: fit; pooled midpoint 0.407 (comparison)] (present 0.696, n 63 / absent 0.118, n 531)
- presence:quantity: threshold 0.074 [rule: fit; pooled midpoint 0.106 (comparison)] (present 0.172, n 20 / absent 0.040, n 574)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.005, color 0.083, size 0.143, style 0.200, text 0.013, relation 0.167, landmark 0.006, region 0.111, anchor 0.250, fraction 0.333, amount 0.043, unit 0.500, direction 0.167, axis 0.500, layout 0.143, pairing 0.500, source 0.006, target 0.006, quantity 0.043, predicate 0.019

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 206 of 206)
| axis | accuracy |
|---|---|
| FULL | 0.429±0.038 |
| FULL [depth given] | 0.429±0.038 |
| FULL [depth and negation given] | 0.430±0.039 |
| FULL [presence not decided] | 0.365±0.006 |
| FULL [pooled midpoint (comparison)] | 0.352±0.019 |
| presence object: present read present | 0.942±0.018 |
| presence color: absent read absent | 0.952±0.035 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.295±0.151 |
| presence size: share of true 'present' readings that abstain | 0.179±0.063 |
| presence style: absent read absent | 0.944±0.034 |
| presence text: absent read absent | 0.980±0.004 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.956±0.017 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 0.998±0.003 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.990±0.007 |
| presence target: absent read absent | 0.990±0.013 |
| presence target: share of 'present' readings that abstain | 0.783±0.121 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.798±0.015 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.804±0.018 |
| event type (synonym table) | 0.808±0.019 |
| role object | 0.572±0.019 |
| head object | 0.640±0.017 |
| lexical order head object | 0.039±0.000 |
| lexical bag head object | 0.126±0.000 |
| occupancy: known filler | 0.721±0.016 |
| role color | 0.961±0.029 |
| head color | 0.961±0.029 |
| lexical order head color | 0.995±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 0.989±0.004 |
| role size | 0.964±0.012 |
| head size | 0.964±0.012 |
| lexical order head size | 0.917±0.000 |
| lexical bag head size | 0.917±0.000 |
| role style | 0.927±0.022 |
| head style | 0.927±0.022 |
| lexical order head style | 0.942±0.000 |
| lexical bag head style | 0.942±0.000 |
| role text | 0.948±0.008 |
| head text | 0.948±0.008 |
| lexical order head text | 0.898±0.000 |
| lexical bag head text | 0.898±0.000 |
| role relation | 0.969±0.009 |
| head relation | 0.969±0.009 |
| lexical order head relation | 0.869±0.000 |
| lexical bag head relation | 0.869±0.000 |
| role landmark | 0.906±0.011 |
| head landmark | 0.926±0.011 |
| lexical order head landmark | 0.869±0.000 |
| lexical bag head landmark | 0.869±0.000 |
| role region | 0.997±0.004 |
| head region | 0.997±0.004 |
| lexical order head region | 0.937±0.000 |
| lexical bag head region | 0.937±0.000 |
| role anchor | 0.986±0.004 |
| head anchor | 0.986±0.004 |
| lexical order head anchor | 0.932±0.000 |
| lexical bag head anchor | 0.932±0.000 |
| role fraction | 0.983±0.007 |
| head fraction | 0.983±0.007 |
| lexical order head fraction | 0.932±0.000 |
| lexical bag head fraction | 0.932±0.000 |
| role amount | 0.999±0.002 |
| head amount | 0.999±0.002 |
| lexical order head amount | 0.961±0.000 |
| lexical bag head amount | 0.961±0.000 |
| role unit | 0.998±0.004 |
| head unit | 0.998±0.004 |
| lexical order head unit | 0.961±0.000 |
| lexical bag head unit | 0.961±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.990±0.000 |
| lexical bag head direction | 0.990±0.000 |
| role axis | 0.999±0.002 |
| head axis | 0.999±0.002 |
| lexical order head axis | 0.981±0.000 |
| lexical bag head axis | 0.981±0.000 |
| role layout | 0.998±0.002 |
| head layout | 0.998±0.002 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 0.985±0.000 |
| lexical bag head pairing | 0.985±0.000 |
| role source | 0.843±0.007 |
| head source | 0.843±0.007 |
| lexical order head source | 0.835±0.000 |
| lexical bag head source | 0.835±0.000 |
| role target | 0.894±0.017 |
| head target | 0.920±0.021 |
| lexical order head target | 0.850±0.000 |
| lexical bag head target | 0.850±0.000 |
| role quantity | 0.951±0.005 |
| head quantity | 0.951±0.005 |
| lexical order head quantity | 0.893±0.000 |
| lexical bag head quantity | 0.893±0.000 |
| heads FULL (model) | 0.488±0.043 |
| heads FULL (lexical order baseline) | 0.019±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.044±0.000 |
| role object [presence not decided] | 0.707±0.013 |
| role color [presence not decided] | 0.767±0.000 |
| role size [presence not decided] | 0.849±0.004 |
| role style [presence not decided] | 0.893±0.000 |
| role text [presence not decided] | 0.944±0.006 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.852±0.013 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 0.996±0.004 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 0.986±0.002 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.830±0.013 |
| role target [presence not decided] | 0.882±0.016 |
| role quantity [presence not decided] | 0.996±0.004 |
| heads FULL (model) [presence not decided] | 0.420±0.005 |
| role object [pooled midpoint (comparison)] | 0.475±0.015 |
| role color [pooled midpoint (comparison)] | 0.974±0.020 |
| role size [pooled midpoint (comparison)] | 0.961±0.007 |
| role style [pooled midpoint (comparison)] | 0.925±0.019 |
| role text [pooled midpoint (comparison)] | 0.940±0.005 |
| role relation [pooled midpoint (comparison)] | 0.963±0.005 |
| role landmark [pooled midpoint (comparison)] | 0.917±0.006 |
| role region [pooled midpoint (comparison)] | 0.987±0.006 |
| role anchor [pooled midpoint (comparison)] | 0.972±0.006 |
| role fraction [pooled midpoint (comparison)] | 0.970±0.005 |
| role amount [pooled midpoint (comparison)] | 0.995±0.003 |
| role unit [pooled midpoint (comparison)] | 0.996±0.004 |
| role direction [pooled midpoint (comparison)] | 1.000±0.000 |
| role axis [pooled midpoint (comparison)] | 0.999±0.002 |
| role layout [pooled midpoint (comparison)] | 0.998±0.002 |
| role pairing [pooled midpoint (comparison)] | 0.997±0.002 |
| role source [pooled midpoint (comparison)] | 0.846±0.006 |
| role target [pooled midpoint (comparison)] | 0.904±0.015 |
| role quantity [pooled midpoint (comparison)] | 0.944±0.008 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.416±0.028 |
| presence object: present read present [pooled midpoint (comparison)] | 0.908±0.018 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.964±0.026 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.929±0.018 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.978±0.001 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.974±0.007 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.997±0.003 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.992±0.007 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.997±0.004 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.068±0.009 |
| presence object: share of true 'present' readings that abstain | 0.069±0.009 |
| presence size: absent read absent | 0.959±0.019 |
| presence text: present read present | 0.771±0.054 |
| presence text: share of 'present' readings that abstain | 0.341±0.107 |
| presence text: share of true 'present' readings that abstain | 0.327±0.122 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.956±0.016 |
| presence text: present read present [pooled midpoint (comparison)] | 0.861±0.031 |
| presence color: share of 'present' readings that abstain | 0.917±0.105 |
| presence color: share of FALSE 'present' readings that abstain | 0.976±0.047 |
| presence source: present read present | 0.259±0.110 |
| presence source: share of 'present' readings that abstain | 0.895±0.089 |
| presence source: share of true 'present' readings that abstain | 0.911±0.083 |
| presence target: present read present | 0.709±0.073 |
| determiner identity (outside FULL when the legend excludes it) | 0.819±0.027 |
| presence source: present read present [pooled midpoint (comparison)] | 0.307±0.098 |
| presence target: present read present [pooled midpoint (comparison)] | 0.773±0.074 |
| presence object: absent read absent | 0.500±0.000 |
| presence object: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.955±0.067 |
| presence style: share of FALSE 'present' readings that abstain | 0.976±0.047 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.067±0.133 |
| presence pairing: share of true 'present' readings that abstain | 0.067±0.133 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.627±0.110 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 0.942±0.079 |
| presence fraction: share of 'present' readings that abstain | 0.449±0.156 |
| presence fraction: share of true 'present' readings that abstain | 0.449±0.156 |
| presence target: share of true 'present' readings that abstain | 0.798±0.125 |
| presence relation: present read present | 0.887±0.045 |
| presence relation: share of 'present' readings that abstain | 0.144±0.054 |
| presence relation: share of true 'present' readings that abstain | 0.144±0.054 |
| presence landmark: present read present | 0.785±0.054 |
| presence landmark: share of 'present' readings that abstain | 0.375±0.060 |
| presence landmark: share of true 'present' readings that abstain | 0.173±0.056 |
| presence amount: present read present | 0.975±0.050 |
| presence amount: share of 'present' readings that abstain | 0.050±0.100 |
| presence amount: share of true 'present' readings that abstain | 0.050±0.100 |
| presence unit: present read present | 0.950±0.100 |
| presence unit: share of 'present' readings that abstain | 0.025±0.050 |
| presence unit: share of true 'present' readings that abstain | 0.025±0.050 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.883±0.058 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.764±0.057 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.925±0.100 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.946±0.066 |
| presence style: present read present | 0.712±0.298 |
| presence style: share of true 'present' readings that abstain | 0.908±0.130 |
| presence style: present read present [pooled midpoint (comparison)] | 0.863±0.222 |
| presence size: share of FALSE 'present' readings that abstain | 0.580±0.286 |
| presence region: present read present | 0.983±0.033 |
| presence region: share of 'present' readings that abstain | 0.309±0.127 |
| presence region: share of true 'present' readings that abstain | 0.309±0.127 |
| presence region: present read present [pooled midpoint (comparison)] | 0.867±0.100 |
| presence quantity: present read present | 0.824±0.089 |
| presence quantity: share of 'present' readings that abstain | 0.313±0.119 |
| presence quantity: share of true 'present' readings that abstain | 0.313±0.119 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.753±0.118 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.960±0.080 |
| presence layout: share of 'present' readings that abstain | nan±nan |
| presence layout: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: present read present | 1.000±0.000 |
| presence color: share of true 'present' readings that abstain | 0.600±0.490 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: share of FALSE 'present' readings that abstain | 0.978±0.044 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 0.433±0.327 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.050±0.100 |
| presence axis: share of true 'present' readings that abstain | 0.050±0.100 |

residual mean 0.598±0.007; status {'abstain': 167, 'no-sense': 37, 'ok': 2}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.806 | 0.202 / 0.106 | 0.96 | 0.165 | 0.015 / 0.029 |
| role object | 0.561 | 0.169 / 0.000 | 0.73 | 0.212 | 0.040 / 0.227 |
| roles (pooled) | 0.581 | 0.104 / 0.000 | 0.59 | 0.123 | 0.110 / 0.296 |
| role size | 0.941 | 0.069 / 0.018 | 0.76 | 0.000 | 0.176 / 0.059 |
| role text | 0.762 | 0.057 / 0.000 | 0.43 | 0.000 | 0.333 / 0.238 |
| role source | 0.088 | 0.012 / 0.000 | 0.09 | 0.088 | 0.088 / 0.824 |
| role target | 0.323 | 0.021 / 0.000 | 0.13 | 0.065 | 0.258 / 0.613 |
| role pairing | 1.000 | 0.106 / 0.094 | 1.00 | 0.000 | 0.000 / 0.000 |
| role anchor | 0.857 | 0.121 / 0.087 | 0.93 | 0.071 | 0.000 / 0.071 |
| role fraction | 0.857 | 0.067 / 0.034 | 0.71 | 0.143 | 0.286 / 0.000 |
| role relation | 0.704 | 0.068 / 0.000 | 0.59 | 0.037 | 0.148 / 0.259 |
| role landmark | 0.444 | 0.053 / 0.000 | 0.56 | 0.148 | 0.037 / 0.407 |
| role amount | 1.000 | 0.091 / 0.055 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.141 / 0.085 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.500 | 0.019 / 0.000 | 0.17 | 0.000 | 0.333 / 0.500 |
| role region | 1.000 | 0.067 / 0.041 | 0.54 | 0.000 | 0.462 / 0.000 |
| role quantity | 0.455 | 0.045 / 0.000 | 0.41 | 0.045 | 0.091 / 0.500 |
| role color | 1.000 | 0.070 / 0.070 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.132 / 0.123 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 0.750 | 0.098 / 0.036 | 0.75 | 0.000 | 0.000 / 0.250 |

### heldout_formulations — experiment candidates (n = 206 of 206)
| axis | accuracy |
|---|---|
| FULL | 0.081±0.041 |
| FULL [depth given] | 0.081±0.041 |
| FULL [depth and negation given] | 0.081±0.041 |
| FULL [presence not decided] | 0.000±0.000 |
| FULL [pooled midpoint (comparison)] | 0.077±0.020 |
| structure (depth, negation) | 0.741±0.010 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.743±0.012 |
| event type (synonym table) | 0.746±0.011 |
| role object | 0.517±0.016 |
| head object | 0.611±0.017 |
| lexical order head object | 0.039±0.000 |
| lexical bag head object | 0.126±0.000 |
| occupancy: known filler | 0.739±0.017 |
| role color | 0.927±0.041 |
| head color | 0.927±0.041 |
| lexical order head color | 0.995±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 0.909±0.014 |
| role size | 0.920±0.022 |
| head size | 0.920±0.022 |
| lexical order head size | 0.917±0.000 |
| lexical bag head size | 0.917±0.000 |
| role style | 0.712±0.136 |
| head style | 0.712±0.136 |
| lexical order head style | 0.942±0.000 |
| lexical bag head style | 0.942±0.000 |
| role text | 0.815±0.026 |
| head text | 0.815±0.026 |
| lexical order head text | 0.898±0.000 |
| lexical bag head text | 0.898±0.000 |
| role relation | 0.850±0.042 |
| head relation | 0.850±0.042 |
| lexical order head relation | 0.869±0.000 |
| lexical bag head relation | 0.869±0.000 |
| role landmark | 0.806±0.023 |
| head landmark | 0.823±0.024 |
| lexical order head landmark | 0.869±0.000 |
| lexical bag head landmark | 0.869±0.000 |
| role region | 0.857±0.030 |
| head region | 0.857±0.030 |
| lexical order head region | 0.937±0.000 |
| lexical bag head region | 0.937±0.000 |
| role anchor | 0.950±0.015 |
| head anchor | 0.950±0.015 |
| lexical order head anchor | 0.932±0.000 |
| lexical bag head anchor | 0.932±0.000 |
| role fraction | 0.945±0.034 |
| head fraction | 0.945±0.034 |
| lexical order head fraction | 0.932±0.000 |
| lexical bag head fraction | 0.932±0.000 |
| role amount | 0.950±0.020 |
| head amount | 0.950±0.020 |
| lexical order head amount | 0.961±0.000 |
| lexical bag head amount | 0.961±0.000 |
| role unit | 0.945±0.019 |
| head unit | 0.945±0.019 |
| lexical order head unit | 0.961±0.000 |
| lexical bag head unit | 0.961±0.000 |
| role direction | 0.855±0.034 |
| head direction | 0.855±0.034 |
| lexical order head direction | 0.990±0.000 |
| lexical bag head direction | 0.990±0.000 |
| role axis | 0.975±0.017 |
| head axis | 0.975±0.017 |
| lexical order head axis | 0.981±0.000 |
| lexical bag head axis | 0.981±0.000 |
| role layout | 0.975±0.009 |
| head layout | 0.975±0.009 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.970±0.019 |
| head pairing | 0.970±0.019 |
| lexical order head pairing | 0.985±0.000 |
| lexical bag head pairing | 0.985±0.000 |
| role source | 0.804±0.012 |
| head source | 0.804±0.012 |
| lexical order head source | 0.835±0.000 |
| lexical bag head source | 0.835±0.000 |
| role target | 0.838±0.013 |
| head target | 0.845±0.015 |
| lexical order head target | 0.850±0.000 |
| lexical bag head target | 0.850±0.000 |
| role quantity | 0.773±0.056 |
| head quantity | 0.773±0.056 |
| lexical order head quantity | 0.893±0.000 |
| lexical bag head quantity | 0.893±0.000 |
| heads FULL (model) | 0.107±0.053 |
| heads FULL (lexical order baseline) | 0.019±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.044±0.000 |
| role object [presence not decided] | 0.642±0.004 |
| role color [presence not decided] | 0.087±0.009 |
| role size [presence not decided] | 0.150±0.006 |
| role style [presence not decided] | 0.112±0.015 |
| role text [presence not decided] | 0.174±0.014 |
| role relation [presence not decided] | 0.214±0.011 |
| role landmark [presence not decided] | 0.152±0.010 |
| role region [presence not decided] | 0.146±0.014 |
| role anchor [presence not decided] | 0.158±0.010 |
| role fraction [presence not decided] | 0.156±0.010 |
| role amount [presence not decided] | 0.124±0.010 |
| role unit [presence not decided] | 0.131±0.009 |
| role direction [presence not decided] | 0.102±0.009 |
| role axis [presence not decided] | 0.112±0.009 |
| role layout [presence not decided] | 0.092±0.009 |
| role pairing [presence not decided] | 0.107±0.009 |
| role source [presence not decided] | 0.067±0.010 |
| role target [presence not decided] | 0.084±0.008 |
| role quantity [presence not decided] | 0.198±0.008 |
| heads FULL (model) [presence not decided] | 0.010±0.000 |
| role object [pooled midpoint (comparison)] | 0.441±0.008 |
| role color [pooled midpoint (comparison)] | 0.956±0.028 |
| role size [pooled midpoint (comparison)] | 0.923±0.012 |
| role style [pooled midpoint (comparison)] | 0.705±0.076 |
| role text [pooled midpoint (comparison)] | 0.827±0.024 |
| role relation [pooled midpoint (comparison)] | 0.904±0.011 |
| role landmark [pooled midpoint (comparison)] | 0.849±0.011 |
| role region [pooled midpoint (comparison)] | 0.943±0.009 |
| role anchor [pooled midpoint (comparison)] | 0.954±0.018 |
| role fraction [pooled midpoint (comparison)] | 0.930±0.022 |
| role amount [pooled midpoint (comparison)] | 0.973±0.016 |
| role unit [pooled midpoint (comparison)] | 0.972±0.012 |
| role direction [pooled midpoint (comparison)] | 0.904±0.039 |
| role axis [pooled midpoint (comparison)] | 0.980±0.010 |
| role layout [pooled midpoint (comparison)] | 0.987±0.013 |
| role pairing [pooled midpoint (comparison)] | 0.979±0.010 |
| role source [pooled midpoint (comparison)] | 0.826±0.006 |
| role target [pooled midpoint (comparison)] | 0.858±0.009 |
| role quantity [pooled midpoint (comparison)] | 0.828±0.040 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.095±0.023 |
| presence object: present read present | 0.968±0.008 |
| presence object: share of 'present' readings that abstain | 0.078±0.006 |
| presence object: share of true 'present' readings that abstain | 0.079±0.006 |
| presence color: absent read absent | 0.909±0.055 |
| presence size: absent read absent | 0.904±0.028 |
| presence style: absent read absent | 0.657±0.203 |
| presence style: share of 'present' readings that abstain | 0.996±0.007 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: present read present | 0.797±0.070 |
| presence text: share of 'present' readings that abstain | 0.837±0.038 |
| presence text: share of true 'present' readings that abstain | 0.510±0.119 |
| presence relation: absent read absent | 0.821±0.071 |
| presence landmark: absent read absent | 0.811±0.038 |
| presence region: absent read absent | 0.813±0.045 |
| presence anchor: absent read absent | 0.952±0.021 |
| presence fraction: absent read absent | 0.951±0.055 |
| presence amount: absent read absent | 0.939±0.024 |
| presence unit: absent read absent | 0.925±0.023 |
| presence direction: absent read absent | 0.805±0.046 |
| presence axis: absent read absent | 0.967±0.024 |
| presence layout: absent read absent | 0.967±0.012 |
| presence pairing: absent read absent | 0.959±0.025 |
| presence source: absent read absent | 0.948±0.023 |
| presence target: absent read absent | 0.952±0.023 |
| presence quantity: absent read absent | 0.741±0.074 |
| presence object: present read present [pooled midpoint (comparison)] | 0.939±0.006 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.942±0.042 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.897±0.022 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.597±0.127 |
| presence text: present read present [pooled midpoint (comparison)] | 0.871±0.042 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.900±0.023 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.864±0.017 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.939±0.017 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.982±0.022 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.945±0.039 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.972±0.022 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.961±0.015 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.851±0.063 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 0.970±0.014 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.981±0.019 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.974±0.017 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.982±0.008 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.984±0.012 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.806±0.056 |
| presence color: share of 'present' readings that abstain | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: absent read absent | 0.798±0.030 |
| presence source: present read present | 0.954±0.030 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 1.000±0.000 |
| presence target: share of true 'present' readings that abstain | 1.000±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.730±0.026 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.806±0.035 |
| presence source: present read present [pooled midpoint (comparison)] | 0.949±0.033 |
| presence target: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 0.500±0.000 |
| presence object: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.755±0.088 |
| presence size: share of FALSE 'present' readings that abstain | 0.941±0.062 |
| presence fraction: share of 'present' readings that abstain | 0.686±0.118 |
| presence fraction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.591±0.080 |
| presence pairing: share of true 'present' readings that abstain | 0.200±0.163 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.610±0.080 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.477±0.142 |
| presence axis: share of FALSE 'present' readings that abstain | 0.900±0.133 |
| presence quantity: share of 'present' readings that abstain | 0.849±0.040 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.444±0.129 |
| presence anchor: share of true 'present' readings that abstain | 0.113±0.088 |
| presence fraction: present read present | 0.942±0.079 |
| presence fraction: share of true 'present' readings that abstain | 0.524±0.147 |
| presence pairing: share of FALSE 'present' readings that abstain | 0.850±0.157 |
| presence region: share of 'present' readings that abstain | 0.912±0.023 |
| presence region: share of FALSE 'present' readings that abstain | 0.993±0.013 |
| presence layout: share of 'present' readings that abstain | 0.931±0.086 |
| presence layout: share of FALSE 'present' readings that abstain | 0.931±0.086 |
| presence relation: present read present | 0.910±0.038 |
| presence relation: share of 'present' readings that abstain | 0.759±0.040 |
| presence relation: share of true 'present' readings that abstain | 0.489±0.097 |
| presence landmark: present read present | 0.965±0.032 |
| presence landmark: share of 'present' readings that abstain | 0.915±0.032 |
| presence landmark: share of true 'present' readings that abstain | 0.814±0.079 |
| presence amount: present read present | 0.975±0.050 |
| presence amount: share of 'present' readings that abstain | 0.804±0.097 |
| presence amount: share of true 'present' readings that abstain | 0.607±0.188 |
| presence unit: present read present | 0.950±0.100 |
| presence unit: share of 'present' readings that abstain | 0.423±0.135 |
| presence unit: share of true 'present' readings that abstain | 0.025±0.050 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.905±0.041 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.924±0.024 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.925±0.100 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.946±0.066 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 0.993±0.013 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence style: present read present | 0.695±0.291 |
| presence style: share of true 'present' readings that abstain | 0.971±0.057 |
| presence style: present read present [pooled midpoint (comparison)] | 0.857±0.221 |
| presence region: present read present | 0.983±0.033 |
| presence region: share of true 'present' readings that abstain | 0.736±0.067 |
| presence region: present read present [pooled midpoint (comparison)] | 0.862±0.106 |
| presence quantity: present read present | 0.817±0.096 |
| presence quantity: share of true 'present' readings that abstain | 0.390±0.125 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.753±0.118 |
| presence direction: share of 'present' readings that abstain | 0.934±0.016 |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.956±0.089 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of true 'present' readings that abstain | 0.593±0.128 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: share of FALSE 'present' readings that abstain | 0.712±0.156 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence amount: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.050±0.100 |

residual mean 0.635±0.005; status {'no-sense': 52, 'abstain': 153, 'ok': 1}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.738 | 0.202 / 0.106 | 0.96 | 0.218 | 0.000 / 0.044 |
| role object | 0.525 | 0.140 / 0.000 | 0.73 | 0.232 | 0.030 / 0.242 |
| roles (pooled) | 0.511 | 0.081 / 0.000 | 0.48 | 0.116 | 0.145 / 0.373 |
| role size | 0.765 | 0.039 / 0.005 | 0.41 | 0.000 | 0.353 / 0.235 |
| role text | 0.524 | 0.029 / 0.000 | 0.29 | 0.000 | 0.238 / 0.476 |
| role source | 0.029 | 0.010 / 0.001 | 0.00 | 0.000 | 0.029 / 0.971 |
| role target | 0.129 | 0.014 / 0.003 | 0.00 | 0.000 | 0.129 / 0.871 |
| role pairing | 1.000 | 0.072 / 0.047 | 0.67 | 0.000 | 0.333 / 0.000 |
| role anchor | 0.786 | 0.105 / 0.080 | 0.93 | 0.143 | 0.000 / 0.071 |
| role fraction | 0.786 | 0.056 / 0.031 | 0.64 | 0.214 | 0.357 / 0.000 |
| role relation | 0.667 | 0.040 / 0.000 | 0.37 | 0.037 | 0.333 / 0.296 |
| role landmark | 0.407 | 0.021 / 0.000 | 0.07 | 0.000 | 0.333 / 0.593 |
| role amount | 0.875 | 0.044 / 0.024 | 0.38 | 0.000 | 0.500 / 0.125 |
| role unit | 1.000 | 0.144 / 0.085 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.417 | 0.007 / 0.000 | 0.00 | 0.000 | 0.417 / 0.583 |
| role region | 0.923 | 0.033 / 0.013 | 0.31 | 0.000 | 0.615 / 0.077 |
| role quantity | 0.409 | 0.035 / 0.000 | 0.32 | 0.045 | 0.136 / 0.545 |
| role color | 0.000 | 0.002 / 0.002 | 0.00 | 0.000 | 0.000 / 1.000 |
| role direction | 1.000 | 0.111 / 0.100 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 0.750 | 0.070 / 0.022 | 0.75 | 0.000 | 0.000 / 0.250 |

### heldout_sentences — catalog candidates (n = 94 of 94)
| axis | accuracy |
|---|---|
| FULL | 0.506±0.027 |
| FULL [depth given] | 0.506±0.027 |
| FULL [depth and negation given] | 0.506±0.027 |
| FULL [pooled midpoint (comparison)] | 0.434±0.021 |
| presence object: present read present | 0.885±0.019 |
| presence object: share of 'present' readings that abstain | 0.041±0.019 |
| presence object: share of true 'present' readings that abstain | 0.037±0.016 |
| presence color: absent read absent | 0.963±0.022 |
| presence size: present read present | 0.933±0.082 |
| presence size: share of 'present' readings that abstain | 0.233±0.162 |
| presence size: share of true 'present' readings that abstain | 0.113±0.157 |
| presence style: absent read absent | 0.985±0.009 |
| presence text: absent read absent | 0.985±0.001 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.962±0.019 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.925±0.061 |
| presence amount: share of 'present' readings that abstain | 0.129±0.137 |
| presence amount: share of true 'present' readings that abstain | 0.129±0.137 |
| presence unit: present read present | 0.975±0.050 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 1.000±0.000 |
| presence target: absent read absent | 0.994±0.007 |
| presence quantity: absent read absent | 0.995±0.006 |
| structure (depth, negation) | 0.840±0.022 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.832±0.026 |
| event type (synonym table) | 0.845±0.025 |
| role object | 0.617±0.010 |
| head object | 0.681±0.013 |
| lexical order head object | 0.085±0.000 |
| lexical bag head object | 0.053±0.000 |
| occupancy: known filler | 0.740±0.015 |
| role color | 0.960±0.021 |
| head color | 0.960±0.021 |
| lexical order head color | 0.947±0.000 |
| lexical bag head color | 0.947±0.000 |
| occupancy: not given | 0.991±0.002 |
| role size | 0.974±0.009 |
| head size | 0.974±0.009 |
| lexical order head size | 0.936±0.000 |
| lexical bag head size | 0.957±0.000 |
| role style | 0.987±0.008 |
| head style | 0.987±0.008 |
| lexical order head style | 1.000±0.000 |
| lexical bag head style | 1.000±0.000 |
| role text | 0.968±0.012 |
| head text | 0.968±0.012 |
| lexical order head text | 0.830±0.000 |
| lexical bag head text | 0.851±0.000 |
| role relation | 0.966±0.008 |
| head relation | 0.966±0.008 |
| lexical order head relation | 0.862±0.000 |
| lexical bag head relation | 0.862±0.000 |
| role landmark | 0.894±0.016 |
| head landmark | 0.932±0.016 |
| lexical order head landmark | 0.862±0.000 |
| lexical bag head landmark | 0.862±0.000 |
| role region | 0.953±0.009 |
| head region | 0.953±0.009 |
| lexical order head region | 0.872±0.000 |
| lexical bag head region | 0.872±0.000 |
| role anchor | 0.989±0.000 |
| head anchor | 0.989±0.000 |
| lexical order head anchor | 0.968±0.000 |
| lexical bag head anchor | 0.968±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 1.000±0.000 |
| lexical bag head fraction | 1.000±0.000 |
| role amount | 0.994±0.005 |
| head amount | 0.994±0.005 |
| lexical order head amount | 0.915±0.000 |
| lexical bag head amount | 0.926±0.000 |
| role unit | 0.998±0.004 |
| head unit | 0.998±0.004 |
| lexical order head unit | 0.915±0.000 |
| lexical bag head unit | 0.926±0.000 |
| role direction | 0.998±0.004 |
| head direction | 0.998±0.004 |
| lexical order head direction | 0.926±0.000 |
| lexical bag head direction | 0.926±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.989±0.000 |
| lexical bag head axis | 0.989±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.957±0.000 |
| lexical bag head layout | 0.957±0.000 |
| role pairing | 0.983±0.005 |
| head pairing | 0.983±0.005 |
| lexical order head pairing | 0.957±0.000 |
| lexical bag head pairing | 0.957±0.000 |
| role source | 0.866±0.014 |
| head source | 0.872±0.018 |
| lexical order head source | 0.840±0.000 |
| lexical bag head source | 0.840±0.000 |
| role target | 0.949±0.008 |
| head target | 0.949±0.008 |
| lexical order head target | 0.883±0.000 |
| lexical bag head target | 0.883±0.000 |
| role quantity | 0.977±0.004 |
| head quantity | 0.977±0.004 |
| lexical order head quantity | 0.979±0.000 |
| lexical bag head quantity | 0.989±0.000 |
| heads FULL (model) | 0.551±0.026 |
| heads FULL (lexical order baseline) | 0.011±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.021±0.000 |
| role object [pooled midpoint (comparison)] | 0.557±0.017 |
| role color [pooled midpoint (comparison)] | 0.970±0.012 |
| role size [pooled midpoint (comparison)] | 0.972±0.011 |
| role style [pooled midpoint (comparison)] | 0.987±0.008 |
| role text [pooled midpoint (comparison)] | 0.955±0.016 |
| role relation [pooled midpoint (comparison)] | 0.955±0.010 |
| role landmark [pooled midpoint (comparison)] | 0.898±0.009 |
| role region [pooled midpoint (comparison)] | 0.938±0.010 |
| role anchor [pooled midpoint (comparison)] | 0.983±0.005 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.991±0.008 |
| role unit [pooled midpoint (comparison)] | 0.996±0.005 |
| role direction [pooled midpoint (comparison)] | 0.998±0.004 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 0.998±0.004 |
| role pairing [pooled midpoint (comparison)] | 0.970±0.004 |
| role source [pooled midpoint (comparison)] | 0.866±0.014 |
| role target [pooled midpoint (comparison)] | 0.949±0.014 |
| role quantity [pooled midpoint (comparison)] | 0.981±0.004 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.483±0.028 |
| presence object: present read present [pooled midpoint (comparison)] | 0.835±0.028 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.983±0.021 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.984±0.010 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.983±0.001 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.975±0.008 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.900±0.094 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.950±0.061 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent | 0.978±0.011 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.375±0.124 |
| presence target: present read present | 0.696±0.111 |
| presence target: share of 'present' readings that abstain | 0.787±0.161 |
| presence target: share of true 'present' readings that abstain | 0.778±0.161 |
| determiner identity (outside FULL when the legend excludes it) | 0.780±0.029 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.976±0.016 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.471±0.049 |
| presence target: present read present [pooled midpoint (comparison)] | 0.740±0.118 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.802±0.058 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence region: present read present | 0.811±0.072 |
| presence region: present read present [pooled midpoint (comparison)] | 0.758±0.103 |
| presence source: share of 'present' readings that abstain | 0.860±0.127 |
| presence source: share of true 'present' readings that abstain | 0.860±0.127 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.300±0.245 |
| presence anchor: share of true 'present' readings that abstain | 0.300±0.245 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.700±0.245 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.050±0.100 |
| presence layout: share of true 'present' readings that abstain | 0.050±0.100 |
| presence layout: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 0.410±0.087 |
| presence direction: present read present | 0.971±0.057 |
| presence direction: share of 'present' readings that abstain | 0.181±0.076 |
| presence direction: share of true 'present' readings that abstain | 0.181±0.076 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.440±0.049 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.971±0.057 |
| presence unit: share of 'present' readings that abstain | 0.025±0.050 |
| presence unit: share of true 'present' readings that abstain | 0.025±0.050 |
| presence text: present read present | 0.971±0.057 |
| presence text: share of 'present' readings that abstain | 0.136±0.053 |
| presence text: share of true 'present' readings that abstain | 0.133±0.066 |
| presence relation: present read present | 0.910±0.053 |
| presence relation: share of 'present' readings that abstain | 0.042±0.052 |
| presence relation: share of true 'present' readings that abstain | 0.042±0.052 |
| presence landmark: present read present | 0.853±0.040 |
| presence landmark: share of 'present' readings that abstain | 0.334±0.072 |
| presence landmark: share of true 'present' readings that abstain | 0.149±0.103 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.902±0.090 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.839±0.041 |
| presence size: share of FALSE 'present' readings that abstain | 0.633±0.371 |
| presence object: share of FALSE 'present' readings that abstain | 0.100±0.122 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.300±0.267 |
| presence pairing: share of true 'present' readings that abstain | 0.300±0.267 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.982±0.036 |
| presence region: share of 'present' readings that abstain | 0.262±0.077 |
| presence region: share of true 'present' readings that abstain | 0.262±0.077 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: share of 'present' readings that abstain | nan±nan |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 0.200±0.400 |
| presence color: present read present | 0.860±0.116 |
| presence color: share of true 'present' readings that abstain | 0.637±0.202 |
| presence color: present read present [pooled midpoint (comparison)] | 0.820±0.093 |

residual mean 0.576±0.011; status {'abstain': 79, 'ok': 2, 'no-sense': 13}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.862 | 0.195 / 0.106 | 0.97 | 0.138 | 0.032 / 0.000 |
| role object | 0.616 | 0.177 / 0.000 | 0.71 | 0.116 | 0.023 / 0.267 |
| roles (pooled) | 0.664 | 0.113 / 0.000 | 0.64 | 0.070 | 0.098 / 0.266 |
| role size | 0.833 | 0.072 / 0.030 | 0.83 | 0.000 | 0.000 / 0.167 |
| role amount | 1.000 | 0.065 / 0.041 | 0.62 | 0.000 | 0.375 / 0.000 |
| role unit | 0.875 | 0.143 / 0.082 | 0.88 | 0.000 | 0.000 / 0.125 |
| role source | 0.267 | 0.012 / 0.000 | 0.07 | 0.000 | 0.200 / 0.733 |
| role target | 0.727 | 0.033 / 0.000 | 0.18 | 0.000 | 0.545 / 0.273 |
| role axis | 1.000 | 0.123 / 0.123 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 0.583 | 0.035 / 0.000 | 0.42 | 0.000 | 0.167 / 0.417 |
| role anchor | 0.667 | 0.054 / 0.010 | 0.67 | 0.000 | 0.000 / 0.333 |
| role layout | 1.000 | 0.129 / 0.059 | 0.75 | 0.000 | 0.250 / 0.000 |
| role direction | 1.000 | 0.101 / 0.050 | 0.86 | 0.000 | 0.143 / 0.000 |
| role text | 0.875 | 0.107 / 0.009 | 0.75 | 0.000 | 0.125 / 0.125 |
| role relation | 0.769 | 0.082 / 0.000 | 0.77 | 0.000 | 0.000 / 0.231 |
| role landmark | 0.462 | 0.066 / 0.000 | 0.69 | 0.231 | 0.000 / 0.308 |
| role pairing | 0.500 | 0.059 / 0.000 | 0.50 | 0.000 | 0.000 / 0.500 |
| role quantity | 0.000 | 0.148 / 0.140 | 1.00 | 1.000 | 0.000 / 0.000 |
| role color | 0.800 | 0.052 / 0.016 | 0.60 | 0.000 | 0.200 / 0.200 |

### heldout_sentences — experiment candidates (n = 94 of 94)
| axis | accuracy |
|---|---|
| FULL | 0.072±0.025 |
| FULL [depth given] | 0.072±0.025 |
| FULL [depth and negation given] | 0.072±0.025 |
| FULL [pooled midpoint (comparison)] | 0.100±0.031 |
| presence object: present read present | 0.923±0.007 |
| presence object: share of 'present' readings that abstain | 0.065±0.029 |
| presence object: share of true 'present' readings that abstain | 0.048±0.028 |
| presence color: absent read absent | 0.929±0.038 |
| presence size: present read present | 0.933±0.082 |
| presence size: share of 'present' readings that abstain | 0.626±0.094 |
| presence size: share of true 'present' readings that abstain | 0.420±0.133 |
| presence style: absent read absent | 0.639±0.196 |
| presence text: absent read absent | 0.755±0.031 |
| presence relation: absent read absent | 0.758±0.069 |
| presence landmark: absent read absent | 0.754±0.065 |
| presence region: absent read absent | 0.838±0.026 |
| presence anchor: absent read absent | 0.941±0.028 |
| presence fraction: absent read absent | 0.946±0.060 |
| presence amount: present read present | 0.950±0.061 |
| presence amount: share of 'present' readings that abstain | 0.864±0.041 |
| presence amount: share of true 'present' readings that abstain | 0.818±0.056 |
| presence unit: present read present | 0.975±0.050 |
| presence direction: absent read absent | 0.846±0.058 |
| presence axis: absent read absent | 0.954±0.039 |
| presence layout: absent read absent | 0.957±0.013 |
| presence pairing: absent read absent | 0.956±0.033 |
| presence source: absent read absent | 0.930±0.037 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: absent read absent | 0.913±0.050 |
| presence target: share of 'present' readings that abstain | 1.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence quantity: absent read absent | 0.723±0.094 |
| structure (depth, negation) | 0.777±0.022 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.770±0.031 |
| event type (synonym table) | 0.783±0.027 |
| role object | 0.562±0.012 |
| head object | 0.645±0.016 |
| lexical order head object | 0.085±0.000 |
| lexical bag head object | 0.053±0.000 |
| occupancy: known filler | 0.736±0.028 |
| role color | 0.915±0.029 |
| head color | 0.915±0.029 |
| lexical order head color | 0.947±0.000 |
| lexical bag head color | 0.947±0.000 |
| occupancy: not given | 0.898±0.021 |
| role size | 0.943±0.031 |
| head size | 0.943±0.031 |
| lexical order head size | 0.936±0.000 |
| lexical bag head size | 0.957±0.000 |
| role style | 0.715±0.161 |
| head style | 0.715±0.161 |
| lexical order head style | 1.000±0.000 |
| lexical bag head style | 1.000±0.000 |
| role text | 0.804±0.032 |
| head text | 0.804±0.032 |
| lexical order head text | 0.830±0.000 |
| lexical bag head text | 0.851±0.000 |
| role relation | 0.806±0.033 |
| head relation | 0.806±0.033 |
| lexical order head relation | 0.862±0.000 |
| lexical bag head relation | 0.862±0.000 |
| role landmark | 0.755±0.039 |
| head landmark | 0.794±0.040 |
| lexical order head landmark | 0.862±0.000 |
| lexical bag head landmark | 0.862±0.000 |
| role region | 0.823±0.031 |
| head region | 0.823±0.031 |
| lexical order head region | 0.872±0.000 |
| lexical bag head region | 0.872±0.000 |
| role anchor | 0.945±0.021 |
| head anchor | 0.945±0.021 |
| lexical order head anchor | 0.968±0.000 |
| lexical bag head anchor | 0.968±0.000 |
| role fraction | 0.957±0.049 |
| head fraction | 0.957±0.049 |
| lexical order head fraction | 1.000±0.000 |
| lexical bag head fraction | 1.000±0.000 |
| role amount | 0.955±0.012 |
| head amount | 0.955±0.012 |
| lexical order head amount | 0.915±0.000 |
| lexical bag head amount | 0.926±0.000 |
| role unit | 0.966±0.010 |
| head unit | 0.966±0.010 |
| lexical order head unit | 0.915±0.000 |
| lexical bag head unit | 0.926±0.000 |
| role direction | 0.883±0.046 |
| head direction | 0.883±0.046 |
| lexical order head direction | 0.926±0.000 |
| lexical bag head direction | 0.926±0.000 |
| role axis | 0.964±0.031 |
| head axis | 0.964±0.031 |
| lexical order head axis | 0.989±0.000 |
| lexical bag head axis | 0.989±0.000 |
| role layout | 0.968±0.010 |
| head layout | 0.968±0.010 |
| lexical order head layout | 0.957±0.000 |
| lexical bag head layout | 0.957±0.000 |
| role pairing | 0.940±0.026 |
| head pairing | 0.940±0.026 |
| lexical order head pairing | 0.957±0.000 |
| lexical bag head pairing | 0.957±0.000 |
| role source | 0.798±0.022 |
| head source | 0.798±0.022 |
| lexical order head source | 0.840±0.000 |
| lexical bag head source | 0.840±0.000 |
| role target | 0.855±0.035 |
| head target | 0.855±0.035 |
| lexical order head target | 0.883±0.000 |
| lexical bag head target | 0.883±0.000 |
| role quantity | 0.762±0.076 |
| head quantity | 0.762±0.076 |
| lexical order head quantity | 0.979±0.000 |
| lexical bag head quantity | 0.989±0.000 |
| heads FULL (model) | 0.087±0.033 |
| heads FULL (lexical order baseline) | 0.011±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.021±0.000 |
| role object [pooled midpoint (comparison)] | 0.519±0.012 |
| role color [pooled midpoint (comparison)] | 0.949±0.008 |
| role size [pooled midpoint (comparison)] | 0.945±0.020 |
| role style [pooled midpoint (comparison)] | 0.715±0.089 |
| role text [pooled midpoint (comparison)] | 0.815±0.016 |
| role relation [pooled midpoint (comparison)] | 0.870±0.014 |
| role landmark [pooled midpoint (comparison)] | 0.800±0.024 |
| role region [pooled midpoint (comparison)] | 0.879±0.017 |
| role anchor [pooled midpoint (comparison)] | 0.964±0.009 |
| role fraction [pooled midpoint (comparison)] | 0.947±0.027 |
| role amount [pooled midpoint (comparison)] | 0.972±0.009 |
| role unit [pooled midpoint (comparison)] | 0.981±0.004 |
| role direction [pooled midpoint (comparison)] | 0.919±0.031 |
| role axis [pooled midpoint (comparison)] | 0.974±0.011 |
| role layout [pooled midpoint (comparison)] | 0.981±0.017 |
| role pairing [pooled midpoint (comparison)] | 0.938±0.018 |
| role source [pooled midpoint (comparison)] | 0.828±0.010 |
| role target [pooled midpoint (comparison)] | 0.898±0.016 |
| role quantity [pooled midpoint (comparison)] | 0.853±0.058 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.106±0.032 |
| presence object: present read present [pooled midpoint (comparison)] | 0.884±0.034 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.978±0.016 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.603±0.115 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.770±0.016 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.860±0.013 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.815±0.034 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.926±0.027 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.972±0.006 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.926±0.037 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.900±0.094 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.950±0.061 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.885±0.040 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 0.964±0.014 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.975±0.021 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.955±0.031 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.969±0.025 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.986±0.013 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.825±0.076 |
| presence size: absent read absent | 0.933±0.041 |
| presence fraction: share of 'present' readings that abstain | 1.000±0.000 |
| presence fraction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence amount: absent read absent | 0.960±0.019 |
| presence unit: absent read absent | 0.955±0.012 |
| presence source: present read present | 0.817±0.072 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.820±0.068 |
| presence target: share of true 'present' readings that abstain | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.993±0.014 |
| presence quantity: share of FALSE 'present' readings that abstain | 0.993±0.014 |
| determiner identity (outside FULL when the legend excludes it) | 0.733±0.049 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.932±0.030 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.990±0.008 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.976±0.014 |
| presence source: present read present [pooled midpoint (comparison)] | 0.830±0.055 |
| presence target: present read present [pooled midpoint (comparison)] | 0.801±0.059 |
| presence style: share of 'present' readings that abstain | 0.976±0.039 |
| presence style: share of FALSE 'present' readings that abstain | 0.976±0.039 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.713±0.205 |
| presence axis: share of true 'present' readings that abstain | 0.200±0.400 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence region: present read present | 0.814±0.057 |
| presence region: present read present [pooled midpoint (comparison)] | 0.771±0.090 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.758±0.094 |
| presence anchor: share of true 'present' readings that abstain | 0.300±0.245 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.700±0.245 |
| presence unit: share of 'present' readings that abstain | 0.290±0.122 |
| presence unit: share of FALSE 'present' readings that abstain | 0.833±0.211 |
| presence axis: share of FALSE 'present' readings that abstain | 0.933±0.133 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.473±0.120 |
| presence layout: share of true 'present' readings that abstain | 0.100±0.122 |
| presence layout: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 0.180±0.016 |
| presence object: share of FALSE 'present' readings that abstain | 0.300±0.084 |
| presence direction: present read present | 0.971±0.057 |
| presence direction: share of 'present' readings that abstain | 0.763±0.039 |
| presence direction: share of true 'present' readings that abstain | 0.410±0.161 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.220±0.024 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.971±0.057 |
| presence size: share of FALSE 'present' readings that abstain | 0.938±0.081 |
| presence text: share of 'present' readings that abstain | 0.631±0.062 |
| presence text: share of FALSE 'present' readings that abstain | 0.985±0.031 |
| presence relation: share of 'present' readings that abstain | 0.663±0.085 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence landmark: share of 'present' readings that abstain | 0.802±0.071 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.964±0.030 |
| presence region: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence amount: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence layout: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.660±0.169 |
| presence pairing: share of FALSE 'present' readings that abstain | 0.800±0.400 |
| presence unit: share of true 'present' readings that abstain | 0.082±0.113 |
| presence anchor: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: present read present | 0.983±0.033 |
| presence text: share of true 'present' readings that abstain | 0.233±0.070 |
| presence relation: present read present | 0.910±0.053 |
| presence relation: share of true 'present' readings that abstain | 0.173±0.154 |
| presence landmark: present read present | 0.947±0.044 |
| presence landmark: share of true 'present' readings that abstain | 0.523±0.113 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.902±0.090 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.942±0.048 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.200±0.245 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.980±0.040 |
| presence region: share of true 'present' readings that abstain | 0.918±0.067 |
| presence color: present read present | 0.817±0.153 |
| presence color: share of true 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 0.717±0.163 |

residual mean 0.611±0.009; status {'abstain': 76, 'no-sense': 18}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.809 | 0.195 / 0.106 | 0.97 | 0.191 | 0.032 / 0.000 |
| role object | 0.593 | 0.151 / 0.000 | 0.71 | 0.140 | 0.023 / 0.267 |
| roles (pooled) | 0.570 | 0.087 / 0.000 | 0.49 | 0.079 | 0.159 / 0.350 |
| role size | 0.833 | 0.037 / 0.006 | 0.33 | 0.000 | 0.500 / 0.167 |
| role amount | 0.750 | 0.027 / 0.006 | 0.12 | 0.000 | 0.625 / 0.250 |
| role unit | 0.875 | 0.117 / 0.020 | 0.62 | 0.000 | 0.250 / 0.125 |
| role source | 0.000 | 0.008 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role target | 0.364 | 0.009 / 0.001 | 0.00 | 0.000 | 0.364 / 0.636 |
| role axis | 1.000 | 0.027 / 0.027 | 0.00 | 0.000 | 1.000 / 0.000 |
| role region | 0.417 | 0.015 / 0.000 | 0.00 | 0.000 | 0.417 / 0.583 |
| role anchor | 0.667 | 0.047 / 0.010 | 0.67 | 0.000 | 0.000 / 0.333 |
| role layout | 1.000 | 0.103 / 0.047 | 0.75 | 0.000 | 0.250 / 0.000 |
| role direction | 1.000 | 0.069 / 0.029 | 0.43 | 0.000 | 0.571 / 0.000 |
| role text | 0.688 | 0.064 / 0.001 | 0.62 | 0.062 | 0.125 / 0.250 |
| role relation | 0.769 | 0.062 / 0.000 | 0.69 | 0.000 | 0.077 / 0.231 |
| role landmark | 0.385 | 0.034 / 0.000 | 0.38 | 0.154 | 0.154 / 0.462 |
| role pairing | 0.500 | 0.044 / 0.000 | 0.50 | 0.000 | 0.000 / 0.500 |
| role quantity | 0.000 | 0.100 / 0.074 | 1.00 | 1.000 | 0.000 / 0.000 |
| role color | 0.400 | 0.013 / 0.000 | 0.00 | 0.000 | 0.400 / 0.600 |

### mixed — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.404±0.006 |
| FULL [depth given] | 0.404±0.006 |
| FULL [depth and negation given] | 0.405±0.005 |
| FULL [pooled midpoint (comparison)] | 0.326±0.016 |
| presence object: present read present | 0.902±0.015 |
| presence object: share of 'present' readings that abstain | 0.047±0.011 |
| presence object: share of true 'present' readings that abstain | 0.044±0.009 |
| presence color: absent read absent | 0.967±0.018 |
| presence size: absent read absent | 0.984±0.008 |
| presence style: absent read absent | 0.953±0.021 |
| presence text: absent read absent | 0.987±0.004 |
| presence relation: present read present | 0.909±0.022 |
| presence relation: share of 'present' readings that abstain | 0.186±0.023 |
| presence relation: share of true 'present' readings that abstain | 0.186±0.023 |
| presence landmark: present read present | 0.797±0.042 |
| presence landmark: share of 'present' readings that abstain | 0.327±0.078 |
| presence landmark: share of true 'present' readings that abstain | 0.178±0.097 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.989±0.011 |
| presence target: absent read absent | 0.996±0.002 |
| presence quantity: absent read absent | 0.996±0.003 |
| structure (depth, negation) | 0.750±0.012 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.755±0.012 |
| event type (synonym table) | 0.763±0.010 |
| role object | 0.570±0.012 |
| head object | 0.645±0.012 |
| lexical order head object | 0.077±0.000 |
| lexical bag head object | 0.237±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.674±0.014 |
| occupancy: known filler | 0.692±0.008 |
| role color | 0.962±0.011 |
| head color | 0.962±0.011 |
| lexical order head color | 0.957±0.000 |
| lexical bag head color | 0.957±0.000 |
| occupancy: not given | 0.991±0.002 |
| role size | 0.979±0.005 |
| head size | 0.979±0.005 |
| lexical order head size | 0.965±0.000 |
| lexical bag head size | 0.965±0.000 |
| role style | 0.953±0.013 |
| head style | 0.953±0.013 |
| lexical order head style | 0.975±0.000 |
| lexical bag head style | 0.975±0.000 |
| role text | 0.957±0.005 |
| head text | 0.957±0.005 |
| lexical order head text | 0.877±0.000 |
| lexical bag head text | 0.880±0.000 |
| role relation | 0.964±0.006 |
| head relation | 0.964±0.006 |
| lexical order head relation | 0.868±0.000 |
| lexical bag head relation | 0.873±0.000 |
| role landmark | 0.908±0.011 |
| head landmark | 0.930±0.011 |
| lexical order head landmark | 0.868±0.000 |
| lexical bag head landmark | 0.868±0.000 |
| role region | 0.977±0.003 |
| head region | 0.977±0.003 |
| lexical order head region | 0.912±0.000 |
| lexical bag head region | 0.912±0.000 |
| role anchor | 0.971±0.003 |
| head anchor | 0.971±0.003 |
| lexical order head anchor | 0.905±0.000 |
| lexical bag head anchor | 0.910±0.000 |
| role fraction | 0.986±0.005 |
| head fraction | 0.986±0.005 |
| lexical order head fraction | 0.957±0.000 |
| lexical bag head fraction | 0.957±0.000 |
| role amount | 0.994±0.003 |
| head amount | 0.994±0.003 |
| lexical order head amount | 0.922±0.000 |
| lexical bag head amount | 0.922±0.000 |
| role unit | 0.997±0.003 |
| head unit | 0.997±0.003 |
| lexical order head unit | 0.922±0.000 |
| lexical bag head unit | 0.922±0.000 |
| role direction | 0.986±0.003 |
| head direction | 0.986±0.003 |
| lexical order head direction | 0.948±0.000 |
| lexical bag head direction | 0.948±0.000 |
| role axis | 0.986±0.003 |
| head axis | 0.986±0.003 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.963±0.000 |
| role layout | 0.980±0.005 |
| head layout | 0.980±0.005 |
| lexical order head layout | 0.932±0.000 |
| lexical bag head layout | 0.932±0.000 |
| role pairing | 0.991±0.003 |
| head pairing | 0.991±0.003 |
| lexical order head pairing | 0.960±0.000 |
| lexical bag head pairing | 0.960±0.000 |
| role source | 0.895±0.009 |
| head source | 0.902±0.009 |
| lexical order head source | 0.895±0.000 |
| lexical bag head source | 0.895±0.000 |
| role target | 0.958±0.004 |
| head target | 0.964±0.005 |
| lexical order head target | 0.935±0.000 |
| lexical bag head target | 0.935±0.000 |
| role quantity | 0.995±0.005 |
| head quantity | 0.995±0.005 |
| lexical order head quantity | 0.985±0.000 |
| lexical bag head quantity | 0.988±0.000 |
| heads FULL (model) | 0.483±0.014 |
| heads FULL (lexical order baseline) | 0.013±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.090±0.000 |
| role object [pooled midpoint (comparison)] | 0.479±0.016 |
| role color [pooled midpoint (comparison)] | 0.972±0.003 |
| role size [pooled midpoint (comparison)] | 0.978±0.004 |
| role style [pooled midpoint (comparison)] | 0.949±0.005 |
| role text [pooled midpoint (comparison)] | 0.948±0.004 |
| role relation [pooled midpoint (comparison)] | 0.948±0.006 |
| role landmark [pooled midpoint (comparison)] | 0.911±0.005 |
| role region [pooled midpoint (comparison)] | 0.964±0.008 |
| role anchor [pooled midpoint (comparison)] | 0.962±0.003 |
| role fraction [pooled midpoint (comparison)] | 0.986±0.003 |
| role amount [pooled midpoint (comparison)] | 0.988±0.006 |
| role unit [pooled midpoint (comparison)] | 0.990±0.003 |
| role direction [pooled midpoint (comparison)] | 0.981±0.002 |
| role axis [pooled midpoint (comparison)] | 0.980±0.004 |
| role layout [pooled midpoint (comparison)] | 0.974±0.003 |
| role pairing [pooled midpoint (comparison)] | 0.983±0.008 |
| role source [pooled midpoint (comparison)] | 0.904±0.006 |
| role target [pooled midpoint (comparison)] | 0.957±0.004 |
| role quantity [pooled midpoint (comparison)] | 0.995±0.005 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.405±0.023 |
| presence object: present read present [pooled midpoint (comparison)] | 0.863±0.012 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.985±0.006 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.984±0.004 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.940±0.006 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.988±0.007 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.871±0.041 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.792±0.037 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.993±0.004 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.997±0.003 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.995±0.005 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.968±0.011 |
| presence anchor: present read present | 0.916±0.028 |
| presence anchor: share of 'present' readings that abstain | 0.090±0.068 |
| presence anchor: share of true 'present' readings that abstain | 0.090±0.068 |
| presence color: share of 'present' readings that abstain | 0.663±0.161 |
| presence color: share of FALSE 'present' readings that abstain | 0.983±0.033 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.984±0.003 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.883±0.023 |
| presence style: share of 'present' readings that abstain | 0.936±0.073 |
| presence style: share of FALSE 'present' readings that abstain | 0.986±0.029 |
| presence layout: present read present | 0.871±0.065 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.837±0.041 |
| presence amount: present read present | 0.928±0.048 |
| presence amount: share of 'present' readings that abstain | 0.119±0.060 |
| presence amount: share of true 'present' readings that abstain | 0.119±0.060 |
| presence unit: present read present | 0.980±0.027 |
| presence unit: share of 'present' readings that abstain | 0.033±0.030 |
| presence unit: share of true 'present' readings that abstain | 0.033±0.030 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.884±0.071 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.919±0.034 |
| presence size: share of 'present' readings that abstain | 0.247±0.131 |
| presence size: share of FALSE 'present' readings that abstain | nan±nan |
| presence landmark: share of FALSE 'present' readings that abstain | 0.910±0.093 |
| presence source: present read present | 0.290±0.061 |
| presence target: present read present | 0.723±0.080 |
| presence target: share of 'present' readings that abstain | 0.571±0.111 |
| presence target: share of true 'present' readings that abstain | 0.548±0.110 |
| presence source: present read present [pooled midpoint (comparison)] | 0.370±0.068 |
| presence target: present read present [pooled midpoint (comparison)] | 0.721±0.075 |
| presence color: present read present | 0.878±0.051 |
| presence color: share of true 'present' readings that abstain | 0.463±0.190 |
| presence color: present read present [pooled midpoint (comparison)] | 0.916±0.072 |
| presence text: present read present | 0.822±0.030 |
| presence text: share of 'present' readings that abstain | 0.225±0.080 |
| presence text: share of true 'present' readings that abstain | 0.196±0.059 |
| presence text: present read present [pooled midpoint (comparison)] | 0.834±0.022 |
| presence layout: share of 'present' readings that abstain | 0.134±0.032 |
| presence layout: share of true 'present' readings that abstain | 0.134±0.032 |
| presence region: present read present | 0.845±0.069 |
| presence region: share of 'present' readings that abstain | 0.267±0.090 |
| presence region: share of true 'present' readings that abstain | 0.267±0.090 |
| presence region: present read present [pooled midpoint (comparison)] | 0.735±0.110 |
| presence fraction: present read present | 0.930±0.106 |
| presence fraction: share of 'present' readings that abstain | 0.229±0.160 |
| presence fraction: share of true 'present' readings that abstain | 0.229±0.160 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 0.978±0.044 |
| presence axis: share of 'present' readings that abstain | 0.112±0.064 |
| presence axis: share of true 'present' readings that abstain | 0.112±0.064 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: present read present | 0.867±0.194 |
| presence quantity: share of 'present' readings that abstain | 0.250±0.193 |
| presence quantity: share of true 'present' readings that abstain | 0.173±0.183 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.867±0.194 |
| presence direction: present read present | 0.893±0.048 |
| presence direction: share of 'present' readings that abstain | 0.203±0.061 |
| presence direction: share of true 'present' readings that abstain | 0.203±0.061 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.884±0.062 |
| presence object: absent read absent | 0.391±0.057 |
| presence pairing: present read present | 0.954±0.038 |
| presence pairing: share of 'present' readings that abstain | 0.200±0.132 |
| presence pairing: share of true 'present' readings that abstain | 0.200±0.132 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.577±0.097 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.883±0.194 |
| presence style: present read present | 0.736±0.259 |
| presence style: present read present [pooled midpoint (comparison)] | 0.848±0.091 |
| presence object: share of FALSE 'present' readings that abstain | 0.103±0.057 |
| presence source: share of 'present' readings that abstain | 0.706±0.139 |
| presence source: share of true 'present' readings that abstain | 0.680±0.127 |
| presence style: share of true 'present' readings that abstain | 0.793±0.194 |
| presence text: share of FALSE 'present' readings that abstain | 0.487±0.328 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence size: present read present | 0.847±0.098 |
| presence size: share of true 'present' readings that abstain | 0.057±0.047 |
| presence size: present read present [pooled midpoint (comparison)] | 0.870±0.084 |
| presence quantity: share of FALSE 'present' readings that abstain | nan±nan |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.620±0.004; status {'abstain': 294, 'no-sense': 88, 'ok': 18}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.775 | 0.203 / 0.119 | 0.96 | 0.205 | 0.022 / 0.020 |
| role object | 0.558 | 0.172 / 0.000 | 0.72 | 0.182 | 0.019 / 0.260 |
| roles (pooled) | 0.614 | 0.115 / 0.000 | 0.66 | 0.111 | 0.062 / 0.275 |
| role relation | 0.717 | 0.067 / 0.000 | 0.58 | 0.000 | 0.132 / 0.283 |
| role landmark | 0.396 | 0.055 / 0.000 | 0.58 | 0.208 | 0.019 / 0.396 |
| role region | 0.800 | 0.059 / 0.000 | 0.74 | 0.029 | 0.086 / 0.171 |
| role anchor | 0.711 | 0.089 / 0.000 | 0.66 | 0.079 | 0.132 / 0.211 |
| role layout | 0.593 | 0.090 / 0.000 | 0.63 | 0.111 | 0.074 / 0.296 |
| role amount | 0.871 | 0.076 / 0.000 | 0.81 | 0.000 | 0.065 / 0.129 |
| role unit | 1.000 | 0.166 / 0.094 | 0.97 | 0.000 | 0.032 / 0.000 |
| role source | 0.024 | 0.007 / 0.000 | 0.05 | 0.048 | 0.024 / 0.929 |
| role target | 0.462 | 0.041 / 0.000 | 0.35 | 0.038 | 0.154 / 0.500 |
| role color | 0.765 | 0.067 / 0.002 | 0.71 | 0.059 | 0.118 / 0.176 |
| role text | 0.755 | 0.089 / 0.000 | 0.71 | 0.061 | 0.102 / 0.184 |
| role fraction | 0.824 | 0.070 / 0.014 | 0.71 | 0.059 | 0.176 / 0.118 |
| role axis | 0.733 | 0.107 / 0.031 | 0.87 | 0.133 | 0.000 / 0.133 |
| role quantity | 1.000 | 0.098 / 0.057 | 0.83 | 0.000 | 0.167 / 0.000 |
| role direction | 0.714 | 0.066 / 0.000 | 0.57 | 0.000 | 0.143 / 0.286 |
| role pairing | 0.812 | 0.100 / 0.023 | 0.81 | 0.125 | 0.125 / 0.062 |
| role style | 0.600 | 0.025 / 0.000 | 0.20 | 0.000 | 0.400 / 0.400 |
| role size | 0.857 | 0.073 / 0.012 | 0.79 | 0.000 | 0.071 / 0.143 |

### mixed — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.072±0.031 |
| FULL [depth given] | 0.072±0.031 |
| FULL [depth and negation given] | 0.072±0.031 |
| FULL [pooled midpoint (comparison)] | 0.073±0.007 |
| presence object: present read present | 0.919±0.013 |
| presence object: share of 'present' readings that abstain | 0.074±0.008 |
| presence object: share of true 'present' readings that abstain | 0.067±0.007 |
| presence color: absent read absent | 0.940±0.029 |
| presence size: absent read absent | 0.922±0.025 |
| presence style: absent read absent | 0.651±0.181 |
| presence text: absent read absent | 0.772±0.027 |
| presence text: share of 'present' readings that abstain | 0.751±0.036 |
| presence text: share of FALSE 'present' readings that abstain | 0.997±0.006 |
| presence relation: present read present | 0.916±0.015 |
| presence relation: share of 'present' readings that abstain | 0.708±0.065 |
| presence relation: share of true 'present' readings that abstain | 0.366±0.095 |
| presence landmark: present read present | 0.887±0.044 |
| presence landmark: share of 'present' readings that abstain | 0.838±0.034 |
| presence landmark: share of true 'present' readings that abstain | 0.632±0.066 |
| presence region: absent read absent | 0.829±0.027 |
| presence region: share of 'present' readings that abstain | 0.899±0.022 |
| presence region: share of FALSE 'present' readings that abstain | 0.974±0.051 |
| presence anchor: absent read absent | 0.954±0.018 |
| presence fraction: absent read absent | 0.957±0.038 |
| presence amount: absent read absent | 0.975±0.006 |
| presence unit: absent read absent | 0.953±0.014 |
| presence direction: absent read absent | 0.873±0.048 |
| presence axis: absent read absent | 0.966±0.024 |
| presence layout: absent read absent | 0.978±0.018 |
| presence pairing: absent read absent | 0.945±0.024 |
| presence source: absent read absent | 0.918±0.029 |
| presence target: absent read absent | 0.945±0.023 |
| presence quantity: absent read absent | 0.734±0.073 |
| presence quantity: share of 'present' readings that abstain | 0.948±0.010 |
| presence quantity: share of FALSE 'present' readings that abstain | 0.997±0.006 |
| structure (depth, negation) | 0.715±0.012 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.718±0.013 |
| event type (synonym table) | 0.724±0.011 |
| role object | 0.525±0.011 |
| head object | 0.622±0.012 |
| lexical order head object | 0.077±0.000 |
| lexical bag head object | 0.237±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.595±0.015 |
| occupancy: known filler | 0.697±0.008 |
| role color | 0.934±0.019 |
| head color | 0.934±0.019 |
| lexical order head color | 0.957±0.000 |
| lexical bag head color | 0.957±0.000 |
| occupancy: not given | 0.916±0.015 |
| role size | 0.934±0.015 |
| head size | 0.934±0.015 |
| lexical order head size | 0.965±0.000 |
| lexical bag head size | 0.965±0.000 |
| role style | 0.734±0.129 |
| head style | 0.734±0.129 |
| lexical order head style | 0.975±0.000 |
| lexical bag head style | 0.975±0.000 |
| role text | 0.816±0.014 |
| head text | 0.816±0.014 |
| lexical order head text | 0.877±0.000 |
| lexical bag head text | 0.880±0.000 |
| role relation | 0.844±0.023 |
| head relation | 0.844±0.023 |
| lexical order head relation | 0.868±0.000 |
| lexical bag head relation | 0.873±0.000 |
| role landmark | 0.804±0.023 |
| head landmark | 0.824±0.024 |
| lexical order head landmark | 0.868±0.000 |
| lexical bag head landmark | 0.868±0.000 |
| role region | 0.858±0.015 |
| head region | 0.858±0.015 |
| lexical order head region | 0.912±0.000 |
| lexical bag head region | 0.912±0.000 |
| role anchor | 0.935±0.009 |
| head anchor | 0.935±0.009 |
| lexical order head anchor | 0.905±0.000 |
| lexical bag head anchor | 0.910±0.000 |
| role fraction | 0.951±0.025 |
| head fraction | 0.951±0.025 |
| lexical order head fraction | 0.957±0.000 |
| lexical bag head fraction | 0.957±0.000 |
| role amount | 0.973±0.007 |
| head amount | 0.973±0.007 |
| lexical order head amount | 0.922±0.000 |
| lexical bag head amount | 0.922±0.000 |
| role unit | 0.967±0.009 |
| head unit | 0.967±0.009 |
| lexical order head unit | 0.922±0.000 |
| lexical bag head unit | 0.922±0.000 |
| role direction | 0.898±0.031 |
| head direction | 0.898±0.031 |
| lexical order head direction | 0.948±0.000 |
| lexical bag head direction | 0.948±0.000 |
| role axis | 0.962±0.018 |
| head axis | 0.962±0.018 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.963±0.000 |
| role layout | 0.961±0.011 |
| head layout | 0.961±0.011 |
| lexical order head layout | 0.932±0.000 |
| lexical bag head layout | 0.932±0.000 |
| role pairing | 0.948±0.016 |
| head pairing | 0.948±0.016 |
| lexical order head pairing | 0.960±0.000 |
| lexical bag head pairing | 0.960±0.000 |
| role source | 0.845±0.019 |
| head source | 0.847±0.019 |
| lexical order head source | 0.895±0.000 |
| lexical bag head source | 0.895±0.000 |
| role target | 0.915±0.015 |
| head target | 0.919±0.013 |
| lexical order head target | 0.935±0.000 |
| lexical bag head target | 0.935±0.000 |
| role quantity | 0.809±0.051 |
| head quantity | 0.809±0.051 |
| lexical order head quantity | 0.985±0.000 |
| lexical bag head quantity | 0.988±0.000 |
| heads FULL (model) | 0.097±0.038 |
| heads FULL (lexical order baseline) | 0.013±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.090±0.000 |
| role object [pooled midpoint (comparison)] | 0.449±0.021 |
| role color [pooled midpoint (comparison)] | 0.955±0.010 |
| role size [pooled midpoint (comparison)] | 0.944±0.008 |
| role style [pooled midpoint (comparison)] | 0.738±0.056 |
| role text [pooled midpoint (comparison)] | 0.838±0.011 |
| role relation [pooled midpoint (comparison)] | 0.879±0.008 |
| role landmark [pooled midpoint (comparison)] | 0.844±0.011 |
| role region [pooled midpoint (comparison)] | 0.919±0.008 |
| role anchor [pooled midpoint (comparison)] | 0.945±0.004 |
| role fraction [pooled midpoint (comparison)] | 0.949±0.016 |
| role amount [pooled midpoint (comparison)] | 0.974±0.008 |
| role unit [pooled midpoint (comparison)] | 0.980±0.007 |
| role direction [pooled midpoint (comparison)] | 0.924±0.017 |
| role axis [pooled midpoint (comparison)] | 0.964±0.004 |
| role layout [pooled midpoint (comparison)] | 0.964±0.005 |
| role pairing [pooled midpoint (comparison)] | 0.956±0.008 |
| role source [pooled midpoint (comparison)] | 0.881±0.008 |
| role target [pooled midpoint (comparison)] | 0.928±0.006 |
| role quantity [pooled midpoint (comparison)] | 0.891±0.031 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.103±0.008 |
| presence object: present read present [pooled midpoint (comparison)] | 0.879±0.015 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.970±0.015 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.929±0.012 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.605±0.087 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.797±0.019 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.878±0.050 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.870±0.017 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.930±0.012 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.981±0.010 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.946±0.028 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.987±0.007 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.981±0.011 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.903±0.027 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 0.974±0.007 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.989±0.004 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.966±0.016 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.968±0.014 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.964±0.010 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.826±0.049 |
| presence size: share of 'present' readings that abstain | 0.795±0.083 |
| presence size: share of FALSE 'present' readings that abstain | 0.974±0.036 |
| presence relation: absent read absent | 0.814±0.042 |
| presence landmark: absent read absent | 0.811±0.039 |
| presence anchor: present read present | 0.923±0.027 |
| presence anchor: share of 'present' readings that abstain | 0.480±0.053 |
| presence anchor: share of true 'present' readings that abstain | 0.227±0.100 |
| presence fraction: share of 'present' readings that abstain | 0.707±0.101 |
| presence fraction: share of FALSE 'present' readings that abstain | 0.933±0.082 |
| presence source: share of 'present' readings that abstain | 0.996±0.008 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.956±0.030 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.962±0.025 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.877±0.016 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.868±0.019 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.895±0.022 |
| presence style: share of 'present' readings that abstain | 0.993±0.007 |
| presence style: share of FALSE 'present' readings that abstain | 0.996±0.005 |
| presence layout: present read present | 0.868±0.068 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.835±0.044 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: share of FALSE 'present' readings that abstain | 0.997±0.006 |
| presence amount: present read present | 0.954±0.039 |
| presence amount: share of 'present' readings that abstain | 0.688±0.024 |
| presence amount: share of true 'present' readings that abstain | 0.621±0.015 |
| presence unit: present read present | 0.987±0.027 |
| presence unit: share of 'present' readings that abstain | 0.285±0.059 |
| presence unit: share of true 'present' readings that abstain | 0.066±0.042 |
| presence direction: share of 'present' readings that abstain | 0.793±0.071 |
| presence direction: share of FALSE 'present' readings that abstain | 0.996±0.007 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.908±0.062 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.945±0.034 |
| presence unit: share of FALSE 'present' readings that abstain | 0.843±0.092 |
| presence source: present read present | 0.804±0.027 |
| presence source: share of true 'present' readings that abstain | 0.992±0.015 |
| presence target: present read present | 0.942±0.070 |
| presence target: share of true 'present' readings that abstain | 0.919±0.064 |
| presence source: present read present [pooled midpoint (comparison)] | 0.748±0.065 |
| presence target: present read present [pooled midpoint (comparison)] | 0.909±0.048 |
| presence anchor: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.690±0.050 |
| presence pairing: share of FALSE 'present' readings that abstain | 0.915±0.054 |
| presence color: present read present | 0.873±0.051 |
| presence color: share of true 'present' readings that abstain | 0.915±0.053 |
| presence color: present read present [pooled midpoint (comparison)] | 0.930±0.085 |
| presence text: present read present | 0.856±0.024 |
| presence text: share of true 'present' readings that abstain | 0.366±0.087 |
| presence text: present read present [pooled midpoint (comparison)] | 0.842±0.022 |
| presence layout: share of 'present' readings that abstain | 0.397±0.106 |
| presence layout: share of true 'present' readings that abstain | 0.232±0.037 |
| presence region: present read present | 0.850±0.070 |
| presence region: share of true 'present' readings that abstain | 0.768±0.043 |
| presence region: present read present [pooled midpoint (comparison)] | 0.738±0.113 |
| presence fraction: present read present | 0.925±0.106 |
| presence fraction: share of true 'present' readings that abstain | 0.454±0.157 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 0.978±0.044 |
| presence axis: share of 'present' readings that abstain | 0.543±0.183 |
| presence axis: share of true 'present' readings that abstain | 0.172±0.170 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: present read present | 0.867±0.194 |
| presence quantity: share of true 'present' readings that abstain | 0.240±0.168 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.867±0.194 |
| presence direction: present read present | 0.893±0.048 |
| presence direction: share of true 'present' readings that abstain | 0.381±0.106 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.897±0.063 |
| presence object: absent read absent | 0.250±0.019 |
| presence pairing: present read present | 0.947±0.044 |
| presence pairing: share of true 'present' readings that abstain | 0.352±0.234 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.433±0.070 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.875±0.194 |
| presence style: present read present | 0.736±0.259 |
| presence style: present read present [pooled midpoint (comparison)] | 0.820±0.128 |
| presence object: share of FALSE 'present' readings that abstain | 0.209±0.047 |
| presence style: share of true 'present' readings that abstain | 0.927±0.090 |
| presence size: present read present | 0.843±0.099 |
| presence size: share of true 'present' readings that abstain | 0.452±0.143 |
| presence size: present read present [pooled midpoint (comparison)] | 0.862±0.091 |
| presence axis: share of FALSE 'present' readings that abstain | 0.960±0.080 |
| presence amount: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence layout: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.644±0.006; status {'abstain': 290, 'no-sense': 106, 'ok': 4}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.733 | 0.203 / 0.119 | 0.96 | 0.240 | 0.015 / 0.028 |
| role object | 0.518 | 0.144 / 0.000 | 0.70 | 0.192 | 0.014 / 0.290 |
| roles (pooled) | 0.564 | 0.090 / 0.000 | 0.54 | 0.106 | 0.132 / 0.330 |
| role relation | 0.679 | 0.047 / 0.000 | 0.55 | 0.000 | 0.132 / 0.321 |
| role landmark | 0.358 | 0.026 / 0.000 | 0.23 | 0.075 | 0.208 / 0.566 |
| role region | 0.771 | 0.029 / 0.000 | 0.23 | 0.000 | 0.543 / 0.229 |
| role anchor | 0.632 | 0.073 / 0.000 | 0.66 | 0.132 | 0.105 / 0.237 |
| role layout | 0.519 | 0.056 / 0.000 | 0.48 | 0.037 | 0.074 / 0.444 |
| role amount | 0.839 | 0.041 / 0.001 | 0.35 | 0.000 | 0.484 / 0.161 |
| role unit | 1.000 | 0.157 / 0.060 | 0.90 | 0.000 | 0.097 / 0.000 |
| role source | 0.000 | 0.007 / 0.000 | 0.02 | 0.024 | 0.000 / 0.976 |
| role target | 0.385 | 0.015 / 0.001 | 0.04 | 0.000 | 0.346 / 0.615 |
| role color | 0.647 | 0.022 / 0.001 | 0.06 | 0.000 | 0.588 / 0.353 |
| role text | 0.694 | 0.053 / 0.000 | 0.49 | 0.061 | 0.265 / 0.245 |
| role fraction | 0.647 | 0.050 / 0.008 | 0.47 | 0.059 | 0.235 / 0.294 |
| role axis | 0.733 | 0.097 / 0.031 | 0.87 | 0.133 | 0.000 / 0.133 |
| role quantity | 1.000 | 0.067 / 0.037 | 0.67 | 0.000 | 0.333 / 0.000 |
| role direction | 0.714 | 0.056 / 0.000 | 0.57 | 0.000 | 0.143 / 0.286 |
| role pairing | 0.688 | 0.082 / 0.023 | 0.81 | 0.250 | 0.125 / 0.062 |
| role style | 0.300 | 0.019 / 0.000 | 0.10 | 0.000 | 0.200 / 0.700 |
| role size | 0.786 | 0.043 / 0.001 | 0.50 | 0.000 | 0.286 / 0.214 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.471±0.029 |
| FULL [depth given] | 0.471±0.029 |
| FULL [depth and negation given] | 0.472±0.029 |
| FULL [pooled midpoint (comparison)] | 0.372±0.019 |
| structure (depth, negation) | 0.798±0.015 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.802±0.014 |
| event type (synonym table) | 0.803±0.014 |
| role object | 0.614±0.033 |
| head object | 0.683±0.024 |
| lexical order head object | 0.025±0.000 |
| lexical bag head object | 0.305±0.000 |
| occupancy: unknown filler | 0.691±0.010 |
| role color | 0.966±0.019 |
| head color | 0.966±0.019 |
| lexical order head color | 0.980±0.000 |
| lexical bag head color | 0.980±0.000 |
| occupancy: not given | 0.990±0.003 |
| role size | 0.960±0.011 |
| head size | 0.960±0.011 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.943±0.000 |
| role style | 0.969±0.016 |
| head style | 0.969±0.016 |
| lexical order head style | 0.998±0.000 |
| lexical bag head style | 0.998±0.000 |
| role text | 0.834±0.016 |
| head text | 0.834±0.016 |
| lexical order head text | 0.542±0.000 |
| lexical bag head text | 0.593±0.000 |
| role relation | 0.970±0.006 |
| head relation | 0.970±0.006 |
| lexical order head relation | 0.815±0.000 |
| lexical bag head relation | 0.818±0.000 |
| role landmark | 0.893±0.007 |
| head landmark | 0.913±0.008 |
| lexical order head landmark | 0.815±0.000 |
| lexical bag head landmark | 0.815±0.000 |
| role region | 0.988±0.003 |
| head region | 0.988±0.003 |
| lexical order head region | 0.943±0.000 |
| lexical bag head region | 0.945±0.000 |
| role anchor | 0.982±0.002 |
| head anchor | 0.982±0.002 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 0.955±0.000 |
| role fraction | 0.994±0.001 |
| head fraction | 0.994±0.001 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 0.980±0.000 |
| role amount | 0.982±0.007 |
| head amount | 0.982±0.007 |
| lexical order head amount | 0.777±0.000 |
| lexical bag head amount | 0.792±0.000 |
| role unit | 0.991±0.005 |
| head unit | 0.991±0.005 |
| lexical order head unit | 0.777±0.000 |
| lexical bag head unit | 0.792±0.000 |
| role direction | 0.995±0.002 |
| head direction | 0.995±0.002 |
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
| role source | 0.940±0.006 |
| head source | 0.940±0.006 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.930±0.000 |
| role target | 0.947±0.008 |
| head target | 0.948±0.009 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.930±0.000 |
| role quantity | 0.994±0.002 |
| head quantity | 0.994±0.002 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.524±0.025 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.105±0.000 |
| role object [pooled midpoint (comparison)] | 0.500±0.020 |
| role color [pooled midpoint (comparison)] | 0.977±0.013 |
| role size [pooled midpoint (comparison)] | 0.951±0.010 |
| role style [pooled midpoint (comparison)] | 0.967±0.010 |
| role text [pooled midpoint (comparison)] | 0.790±0.023 |
| role relation [pooled midpoint (comparison)] | 0.952±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.890±0.007 |
| role region [pooled midpoint (comparison)] | 0.976±0.006 |
| role anchor [pooled midpoint (comparison)] | 0.981±0.001 |
| role fraction [pooled midpoint (comparison)] | 0.995±0.001 |
| role amount [pooled midpoint (comparison)] | 0.972±0.008 |
| role unit [pooled midpoint (comparison)] | 0.979±0.009 |
| role direction [pooled midpoint (comparison)] | 0.995±0.002 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.942±0.003 |
| role target [pooled midpoint (comparison)] | 0.950±0.007 |
| role quantity [pooled midpoint (comparison)] | 0.993±0.002 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.441±0.024 |
| presence object: present read present | 0.902±0.012 |
| presence object: share of 'present' readings that abstain | 0.047±0.008 |
| presence object: share of true 'present' readings that abstain | 0.047±0.007 |
| presence color: absent read absent | 0.968±0.022 |
| presence size: absent read absent | 0.974±0.013 |
| presence style: absent read absent | 0.961±0.020 |
| presence text: absent read absent | 0.927±0.023 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.973±0.011 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: present read present | 0.983±0.033 |
| presence anchor: share of 'present' readings that abstain | 0.102±0.103 |
| presence anchor: share of true 'present' readings that abstain | 0.102±0.103 |
| presence fraction: present read present | 0.967±0.067 |
| presence fraction: share of 'present' readings that abstain | 0.307±0.190 |
| presence fraction: share of true 'present' readings that abstain | 0.307±0.190 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.995±0.007 |
| presence target: absent read absent | 0.989±0.005 |
| presence quantity: absent read absent | 0.992±0.002 |
| occupancy: known filler | 0.787±0.014 |
| presence object: present read present [pooled midpoint (comparison)] | 0.864±0.009 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.981±0.018 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.970±0.012 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.955±0.014 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.928±0.011 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.982±0.005 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.983±0.033 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.996±0.004 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.996±0.002 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.990±0.003 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.936±0.028 |
| presence amount: share of 'present' readings that abstain | 0.204±0.061 |
| presence amount: share of true 'present' readings that abstain | 0.204±0.061 |
| presence unit: present read present | 0.977±0.016 |
| presence unit: share of 'present' readings that abstain | 0.035±0.023 |
| presence unit: share of true 'present' readings that abstain | 0.035±0.023 |
| presence direction: present read present | 0.955±0.041 |
| presence direction: share of 'present' readings that abstain | 0.106±0.099 |
| presence direction: share of true 'present' readings that abstain | 0.106±0.099 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.915±0.025 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.950±0.030 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.945±0.034 |
| presence region: present read present | 0.928±0.051 |
| presence region: share of 'present' readings that abstain | 0.240±0.081 |
| presence region: share of true 'present' readings that abstain | 0.240±0.081 |
| presence region: present read present [pooled midpoint (comparison)] | 0.778±0.091 |
| determiner identity (outside FULL when the legend excludes it) | 0.850±0.053 |
| presence text: present read present | 0.919±0.016 |
| presence text: share of 'present' readings that abstain | 0.246±0.023 |
| presence text: share of true 'present' readings that abstain | 0.230±0.037 |
| presence relation: present read present | 0.942±0.026 |
| presence relation: share of 'present' readings that abstain | 0.088±0.019 |
| presence relation: share of true 'present' readings that abstain | 0.088±0.019 |
| presence landmark: present read present | 0.702±0.070 |
| presence text: present read present [pooled midpoint (comparison)] | 0.914±0.031 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.905±0.028 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.687±0.062 |
| presence color: share of 'present' readings that abstain | 0.692±0.205 |
| presence color: share of FALSE 'present' readings that abstain | 0.882±0.194 |
| presence object: absent read absent | 0.145±0.040 |
| presence object: share of FALSE 'present' readings that abstain | 0.057±0.114 |
| presence source: present read present | 0.438±0.101 |
| presence target: present read present | 0.603±0.093 |
| presence target: share of 'present' readings that abstain | 0.871±0.035 |
| presence target: share of true 'present' readings that abstain | 0.840±0.054 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.169±0.148 |
| presence source: present read present [pooled midpoint (comparison)] | 0.479±0.071 |
| presence target: present read present [pooled midpoint (comparison)] | 0.619±0.133 |
| presence landmark: share of 'present' readings that abstain | 0.357±0.034 |
| presence landmark: share of true 'present' readings that abstain | 0.274±0.065 |
| presence style: share of 'present' readings that abstain | 0.966±0.043 |
| presence style: share of FALSE 'present' readings that abstain | 0.964±0.046 |
| presence size: present read present | 0.852±0.059 |
| presence size: share of 'present' readings that abstain | 0.324±0.120 |
| presence size: share of true 'present' readings that abstain | 0.181±0.089 |
| presence text: share of FALSE 'present' readings that abstain | 0.428±0.205 |
| presence size: present read present [pooled midpoint (comparison)] | 0.835±0.040 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: present read present | 0.604±0.139 |
| presence color: share of true 'present' readings that abstain | 0.336±0.191 |
| presence color: present read present [pooled midpoint (comparison)] | 0.633±0.124 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 1.000±0.000 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: share of FALSE 'present' readings that abstain | 0.695±0.212 |
| presence source: share of 'present' readings that abstain | 0.904±0.094 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence quantity: share of 'present' readings that abstain | 0.667±0.211 |
| presence quantity: share of FALSE 'present' readings that abstain | 0.667±0.211 |
| presence source: share of true 'present' readings that abstain | 0.918±0.081 |
| presence landmark: share of FALSE 'present' readings that abstain | 0.878±0.194 |

residual mean 0.595±0.009; status {'no-sense': 74, 'abstain': 320, 'ok': 6}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.815 | 0.200 / 0.123 | 0.98 | 0.172 | 0.010 / 0.013 |
| role object | 0.654 | 0.146 / 0.000 | 0.76 | 0.138 | 0.028 / 0.208 |
| roles (pooled) | 0.704 | 0.103 / 0.000 | 0.68 | 0.077 | 0.098 / 0.220 |
| role anchor | 0.579 | 0.105 / 0.000 | 0.74 | 0.158 | 0.000 / 0.263 |
| role fraction | 0.750 | 0.057 / 0.023 | 0.50 | 0.125 | 0.375 / 0.125 |
| role amount | 0.876 | 0.060 / 0.000 | 0.71 | 0.000 | 0.169 / 0.124 |
| role unit | 0.966 | 0.168 / 0.087 | 0.91 | 0.011 | 0.067 / 0.022 |
| role direction | 0.870 | 0.081 / 0.010 | 0.87 | 0.000 | 0.000 / 0.130 |
| role region | 0.870 | 0.050 / 0.000 | 0.57 | 0.000 | 0.304 / 0.130 |
| role text | 0.760 | 0.086 / 0.000 | 0.69 | 0.077 | 0.142 / 0.164 |
| role relation | 0.824 | 0.084 / 0.000 | 0.76 | 0.014 | 0.081 / 0.162 |
| role landmark | 0.419 | 0.037 / 0.000 | 0.34 | 0.081 | 0.162 / 0.500 |
| role source | 0.276 | 0.019 / 0.000 | 0.10 | 0.000 | 0.172 / 0.724 |
| role target | 0.379 | 0.016 / 0.000 | 0.07 | 0.034 | 0.345 / 0.586 |
| role size | 0.704 | 0.062 / 0.000 | 0.67 | 0.037 | 0.074 / 0.259 |
| role color | 0.500 | 0.040 / 0.000 | 0.50 | 0.000 | 0.000 / 0.500 |
| role style | 1.000 | 0.048 / 0.048 | 0.00 | 0.000 | 1.000 / 0.000 |

### new_identities — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.045±0.014 |
| FULL [depth given] | 0.045±0.014 |
| FULL [depth and negation given] | 0.045±0.014 |
| FULL [pooled midpoint (comparison)] | 0.062±0.012 |
| structure (depth, negation) | 0.766±0.013 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.770±0.012 |
| event type (synonym table) | 0.770±0.012 |
| role object | 0.483±0.032 |
| head object | 0.648±0.026 |
| lexical order head object | 0.025±0.000 |
| lexical bag head object | 0.305±0.000 |
| occupancy: unknown filler | 0.720±0.014 |
| role color | 0.935±0.035 |
| head color | 0.935±0.035 |
| lexical order head color | 0.980±0.000 |
| lexical bag head color | 0.980±0.000 |
| occupancy: not given | 0.902±0.021 |
| role size | 0.910±0.037 |
| head size | 0.910±0.037 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.943±0.000 |
| role style | 0.733±0.173 |
| head style | 0.733±0.173 |
| lexical order head style | 0.998±0.000 |
| lexical bag head style | 0.998±0.000 |
| role text | 0.738±0.025 |
| head text | 0.738±0.025 |
| lexical order head text | 0.542±0.000 |
| lexical bag head text | 0.593±0.000 |
| role relation | 0.815±0.027 |
| head relation | 0.815±0.027 |
| lexical order head relation | 0.815±0.000 |
| lexical bag head relation | 0.818±0.000 |
| role landmark | 0.736±0.032 |
| head landmark | 0.754±0.031 |
| lexical order head landmark | 0.815±0.000 |
| lexical bag head landmark | 0.815±0.000 |
| role region | 0.852±0.039 |
| head region | 0.852±0.039 |
| lexical order head region | 0.943±0.000 |
| lexical bag head region | 0.945±0.000 |
| role anchor | 0.930±0.026 |
| head anchor | 0.930±0.026 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 0.955±0.000 |
| role fraction | 0.963±0.031 |
| head fraction | 0.963±0.031 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 0.980±0.000 |
| role amount | 0.969±0.007 |
| head amount | 0.969±0.007 |
| lexical order head amount | 0.777±0.000 |
| lexical bag head amount | 0.792±0.000 |
| role unit | 0.971±0.013 |
| head unit | 0.971±0.013 |
| lexical order head unit | 0.777±0.000 |
| lexical bag head unit | 0.792±0.000 |
| role direction | 0.841±0.012 |
| head direction | 0.841±0.012 |
| lexical order head direction | 0.943±0.000 |
| lexical bag head direction | 0.943±0.000 |
| role axis | 0.981±0.021 |
| head axis | 0.981±0.021 |
| lexical order head axis | 1.000±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 0.965±0.019 |
| head layout | 0.965±0.019 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.950±0.028 |
| head pairing | 0.950±0.028 |
| lexical order head pairing | 1.000±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.861±0.026 |
| head source | 0.861±0.026 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.930±0.000 |
| role target | 0.860±0.033 |
| head target | 0.860±0.033 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.930±0.000 |
| role quantity | 0.831±0.069 |
| head quantity | 0.831±0.069 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.070±0.028 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.105±0.000 |
| role object [pooled midpoint (comparison)] | 0.411±0.029 |
| role color [pooled midpoint (comparison)] | 0.963±0.021 |
| role size [pooled midpoint (comparison)] | 0.908±0.033 |
| role style [pooled midpoint (comparison)] | 0.714±0.096 |
| role text [pooled midpoint (comparison)] | 0.706±0.025 |
| role relation [pooled midpoint (comparison)] | 0.859±0.015 |
| role landmark [pooled midpoint (comparison)] | 0.788±0.010 |
| role region [pooled midpoint (comparison)] | 0.940±0.016 |
| role anchor [pooled midpoint (comparison)] | 0.957±0.016 |
| role fraction [pooled midpoint (comparison)] | 0.962±0.020 |
| role amount [pooled midpoint (comparison)] | 0.965±0.009 |
| role unit [pooled midpoint (comparison)] | 0.972±0.011 |
| role direction [pooled midpoint (comparison)] | 0.877±0.028 |
| role axis [pooled midpoint (comparison)] | 0.987±0.008 |
| role layout [pooled midpoint (comparison)] | 0.988±0.008 |
| role pairing [pooled midpoint (comparison)] | 0.970±0.013 |
| role source [pooled midpoint (comparison)] | 0.903±0.005 |
| role target [pooled midpoint (comparison)] | 0.901±0.007 |
| role quantity [pooled midpoint (comparison)] | 0.907±0.033 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.090±0.014 |
| presence object: present read present | 0.920±0.015 |
| presence object: share of 'present' readings that abstain | 0.119±0.028 |
| presence object: share of true 'present' readings that abstain | 0.119±0.029 |
| presence color: absent read absent | 0.930±0.044 |
| presence size: absent read absent | 0.906±0.051 |
| presence style: absent read absent | 0.654±0.222 |
| presence style: share of 'present' readings that abstain | 0.996±0.009 |
| presence style: share of FALSE 'present' readings that abstain | 0.996±0.009 |
| presence text: absent read absent | 0.797±0.032 |
| presence relation: absent read absent | 0.749±0.048 |
| presence landmark: absent read absent | 0.757±0.049 |
| presence region: absent read absent | 0.821±0.053 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.630±0.164 |
| presence anchor: share of true 'present' readings that abstain | 0.109±0.112 |
| presence fraction: present read present | 0.967±0.067 |
| presence fraction: share of 'present' readings that abstain | 0.791±0.107 |
| presence fraction: share of true 'present' readings that abstain | 0.520±0.075 |
| presence amount: absent read absent | 0.979±0.011 |
| presence unit: absent read absent | 0.968±0.020 |
| presence direction: absent read absent | 0.788±0.023 |
| presence axis: absent read absent | 0.975±0.028 |
| presence layout: absent read absent | 0.955±0.024 |
| presence pairing: absent read absent | 0.935±0.036 |
| presence source: absent read absent | 0.904±0.037 |
| presence target: absent read absent | 0.899±0.048 |
| presence quantity: absent read absent | 0.782±0.088 |
| determiner identity (outside FULL when the legend excludes it) | 0.642±0.027 |
| occupancy: known filler | 0.796±0.016 |
| presence object: present read present [pooled midpoint (comparison)] | 0.885±0.009 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.964±0.030 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.903±0.050 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.583±0.145 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.822±0.015 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.832±0.031 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.838±0.014 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.949±0.019 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.992±0.004 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.987±0.009 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.818±0.043 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 0.980±0.012 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.982±0.011 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.956±0.019 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.957±0.006 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.953±0.014 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.866±0.049 |
| presence size: share of 'present' readings that abstain | 0.745±0.113 |
| presence size: share of FALSE 'present' readings that abstain | 0.967±0.030 |
| presence relation: share of 'present' readings that abstain | 0.637±0.065 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence landmark: share of 'present' readings that abstain | 0.914±0.025 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.900±0.036 |
| presence region: share of FALSE 'present' readings that abstain | 0.978±0.043 |
| presence anchor: absent read absent | 0.932±0.034 |
| presence anchor: share of FALSE 'present' readings that abstain | 0.960±0.080 |
| presence fraction: absent read absent | 0.961±0.040 |
| presence amount: present read present | 0.961±0.022 |
| presence amount: share of 'present' readings that abstain | 0.457±0.061 |
| presence amount: share of true 'present' readings that abstain | 0.431±0.061 |
| presence unit: present read present | 0.979±0.013 |
| presence unit: share of 'present' readings that abstain | 0.124±0.053 |
| presence unit: share of true 'present' readings that abstain | 0.064±0.034 |
| presence direction: present read present | 0.963±0.034 |
| presence direction: share of 'present' readings that abstain | 0.874±0.031 |
| presence direction: share of true 'present' readings that abstain | 0.520±0.114 |
| presence pairing: share of 'present' readings that abstain | 0.907±0.107 |
| presence pairing: share of FALSE 'present' readings that abstain | 0.907±0.107 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 1.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.984±0.018 |
| presence quantity: share of FALSE 'present' readings that abstain | 0.984±0.018 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.966±0.024 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.953±0.029 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.933±0.018 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.957±0.025 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.954±0.029 |
| presence color: share of 'present' readings that abstain | 0.988±0.024 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: share of 'present' readings that abstain | 0.496±0.047 |
| presence text: share of FALSE 'present' readings that abstain | 0.927±0.051 |
| presence region: present read present | 0.927±0.054 |
| presence region: share of true 'present' readings that abstain | 0.689±0.014 |
| presence direction: share of FALSE 'present' readings that abstain | 0.997±0.006 |
| presence region: present read present [pooled midpoint (comparison)] | 0.796±0.079 |
| presence text: present read present | 0.926±0.014 |
| presence text: share of true 'present' readings that abstain | 0.375±0.061 |
| presence relation: present read present | 0.954±0.028 |
| presence relation: share of true 'present' readings that abstain | 0.285±0.091 |
| presence landmark: present read present | 0.910±0.040 |
| presence landmark: share of true 'present' readings that abstain | 0.829±0.047 |
| presence text: present read present [pooled midpoint (comparison)] | 0.917±0.035 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.911±0.027 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.881±0.053 |
| presence object: absent read absent | 0.025±0.050 |
| presence object: share of FALSE 'present' readings that abstain | 0.111±0.056 |
| presence source: present read present | 0.950±0.049 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.935±0.054 |
| presence target: share of true 'present' readings that abstain | 1.000±0.000 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.107±0.132 |
| presence source: present read present [pooled midpoint (comparison)] | 0.873±0.058 |
| presence target: present read present [pooled midpoint (comparison)] | 0.855±0.050 |
| presence fraction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 1.000±0.000 |
| presence axis: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: present read present | 0.849±0.058 |
| presence size: share of true 'present' readings that abstain | 0.495±0.122 |
| presence amount: share of FALSE 'present' readings that abstain | 0.933±0.133 |
| presence unit: share of FALSE 'present' readings that abstain | 0.929±0.143 |
| presence layout: share of 'present' readings that abstain | 0.972±0.036 |
| presence layout: share of FALSE 'present' readings that abstain | 0.972±0.036 |
| presence size: present read present [pooled midpoint (comparison)] | 0.830±0.038 |
| presence color: present read present | 0.586±0.146 |
| presence color: share of true 'present' readings that abstain | 0.967±0.067 |
| presence color: present read present [pooled midpoint (comparison)] | 0.614±0.133 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 1.000±0.000 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.620±0.008; status {'no-sense': 86, 'abstain': 313, 'ok': 1}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.785 | 0.200 / 0.123 | 0.98 | 0.198 | 0.005 / 0.018 |
| role object | 0.531 | 0.123 / 0.000 | 0.74 | 0.223 | 0.018 / 0.246 |
| roles (pooled) | 0.616 | 0.083 / 0.000 | 0.58 | 0.105 | 0.137 / 0.279 |
| role anchor | 0.579 | 0.089 / 0.000 | 0.74 | 0.158 | 0.000 / 0.263 |
| role fraction | 0.625 | 0.046 / 0.014 | 0.62 | 0.250 | 0.250 / 0.125 |
| role amount | 0.910 | 0.053 / 0.007 | 0.57 | 0.000 | 0.337 / 0.090 |
| role unit | 0.955 | 0.158 / 0.029 | 0.85 | 0.011 | 0.112 / 0.034 |
| role direction | 0.870 | 0.049 / 0.002 | 0.52 | 0.000 | 0.348 / 0.130 |
| role region | 0.739 | 0.028 / 0.000 | 0.26 | 0.000 | 0.478 / 0.261 |
| role text | 0.683 | 0.056 / 0.000 | 0.56 | 0.071 | 0.191 / 0.246 |
| role relation | 0.811 | 0.061 / 0.000 | 0.72 | 0.027 | 0.122 / 0.162 |
| role landmark | 0.284 | 0.016 / 0.000 | 0.08 | 0.027 | 0.230 / 0.689 |
| role source | 0.034 | 0.008 / 0.001 | 0.00 | 0.000 | 0.034 / 0.966 |
| role target | 0.069 | 0.007 / 0.001 | 0.00 | 0.000 | 0.069 / 0.931 |
| role size | 0.667 | 0.040 / 0.000 | 0.37 | 0.074 | 0.370 / 0.259 |
| role color | 0.375 | 0.011 / 0.000 | 0.00 | 0.000 | 0.375 / 0.625 |
| role style | 1.000 | 0.019 / 0.019 | 0.00 | 0.000 | 1.000 / 0.000 |

### train (sample) — catalog candidates (n = 300 of 906)
| axis | accuracy |
|---|---|
| FULL | 0.485±0.022 |
| FULL [depth given] | 0.485±0.022 |
| FULL [depth and negation given] | 0.485±0.022 |
| presence object: present read present | 0.886±0.007 |
| presence object: share of 'present' readings that abstain | 0.046±0.014 |
| presence object: share of true 'present' readings that abstain | 0.045±0.014 |
| presence color: absent read absent | 0.980±0.009 |
| presence size: absent read absent | 0.987±0.005 |
| presence style: absent read absent | 0.950±0.023 |
| presence style: share of 'present' readings that abstain | 0.968±0.041 |
| presence style: share of FALSE 'present' readings that abstain | 0.988±0.025 |
| presence text: absent read absent | 0.987±0.006 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.976±0.012 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.997±0.002 |
| presence target: absent read absent | 0.997±0.004 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.775±0.016 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.775±0.016 |
| event type (synonym table) | 0.776±0.016 |
| role object | 0.601±0.016 |
| head object | 0.659±0.015 |
| lexical order head object | 0.090±0.000 |
| lexical bag head object | 0.183±0.000 |
| occupancy: known filler | 0.731±0.007 |
| role color | 0.975±0.008 |
| head color | 0.975±0.008 |
| lexical order head color | 0.953±0.000 |
| lexical bag head color | 0.953±0.000 |
| occupancy: not given | 0.993±0.001 |
| role size | 0.976±0.005 |
| head size | 0.976±0.005 |
| lexical order head size | 0.950±0.000 |
| lexical bag head size | 0.960±0.000 |
| role style | 0.959±0.014 |
| head style | 0.959±0.014 |
| lexical order head style | 0.987±0.000 |
| lexical bag head style | 0.987±0.000 |
| role text | 0.952±0.009 |
| head text | 0.952±0.009 |
| lexical order head text | 0.827±0.000 |
| lexical bag head text | 1.000±0.000 |
| role relation | 0.987±0.001 |
| head relation | 0.987±0.001 |
| lexical order head relation | 0.907±0.000 |
| lexical bag head relation | 0.953±0.000 |
| role landmark | 0.946±0.009 |
| head landmark | 0.963±0.007 |
| lexical order head landmark | 0.907±0.000 |
| lexical bag head landmark | 0.920±0.000 |
| role region | 0.986±0.002 |
| head region | 0.986±0.002 |
| lexical order head region | 0.920±0.000 |
| lexical bag head region | 0.993±0.000 |
| role anchor | 0.981±0.002 |
| head anchor | 0.981±0.002 |
| lexical order head anchor | 0.940±0.000 |
| lexical bag head anchor | 1.000±0.000 |
| role fraction | 0.998±0.002 |
| head fraction | 0.998±0.002 |
| lexical order head fraction | 0.973±0.000 |
| lexical bag head fraction | 1.000±0.000 |
| role amount | 0.996±0.005 |
| head amount | 0.996±0.005 |
| lexical order head amount | 0.930±0.000 |
| lexical bag head amount | 1.000±0.000 |
| role unit | 0.997±0.003 |
| head unit | 0.997±0.003 |
| lexical order head unit | 0.930±0.000 |
| lexical bag head unit | 1.000±0.000 |
| role direction | 0.980±0.004 |
| head direction | 0.980±0.004 |
| lexical order head direction | 0.900±0.000 |
| lexical bag head direction | 0.923±0.000 |
| role axis | 0.990±0.002 |
| head axis | 0.990±0.002 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.963±0.000 |
| role layout | 0.989±0.002 |
| head layout | 0.989±0.002 |
| lexical order head layout | 0.960±0.000 |
| lexical bag head layout | 0.963±0.000 |
| role pairing | 0.996±0.001 |
| head pairing | 0.996±0.001 |
| lexical order head pairing | 0.977±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.911±0.003 |
| head source | 0.920±0.005 |
| lexical order head source | 0.890±0.000 |
| lexical bag head source | 0.903±0.000 |
| role target | 0.964±0.005 |
| head target | 0.973±0.006 |
| lexical order head target | 0.913±0.000 |
| lexical bag head target | 0.927±0.000 |
| role quantity | 0.999±0.001 |
| head quantity | 0.999±0.001 |
| lexical order head quantity | 0.977±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.549±0.019 |
| heads FULL (lexical order baseline) | 0.017±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.100±0.000 |
| presence source: present read present | 0.368±0.070 |
| presence target: present read present | 0.857±0.091 |
| presence target: share of 'present' readings that abstain | 0.526±0.086 |
| presence target: share of true 'present' readings that abstain | 0.511±0.096 |
| determiner identity (outside FULL when the legend excludes it) | 0.732±0.048 |
| presence text: present read present | 0.922±0.036 |
| presence text: share of 'present' readings that abstain | 0.152±0.046 |
| presence text: share of true 'present' readings that abstain | 0.136±0.054 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.025±0.050 |
| presence axis: share of true 'present' readings that abstain | 0.025±0.050 |
| presence quantity: present read present | 0.971±0.057 |
| presence quantity: share of 'present' readings that abstain | 0.057±0.070 |
| presence quantity: share of true 'present' readings that abstain | 0.057±0.070 |
| presence size: present read present | 0.947±0.043 |
| presence size: share of 'present' readings that abstain | 0.286±0.092 |
| presence size: share of true 'present' readings that abstain | 0.227±0.049 |
| presence color: present read present | 0.862±0.031 |
| presence direction: present read present | 0.960±0.024 |
| presence direction: share of 'present' readings that abstain | 0.092±0.032 |
| presence direction: share of true 'present' readings that abstain | 0.092±0.032 |
| presence relation: present read present | 1.000±0.000 |
| presence relation: share of 'present' readings that abstain | 0.091±0.030 |
| presence relation: share of true 'present' readings that abstain | 0.091±0.030 |
| presence landmark: present read present | 0.909±0.041 |
| presence landmark: share of 'present' readings that abstain | 0.325±0.052 |
| presence landmark: share of true 'present' readings that abstain | 0.176±0.065 |
| presence amount: present read present | 0.960±0.058 |
| presence amount: share of 'present' readings that abstain | 0.088±0.049 |
| presence amount: share of true 'present' readings that abstain | 0.088±0.049 |
| presence unit: present read present | 0.971±0.038 |
| presence unit: share of 'present' readings that abstain | 0.040±0.020 |
| presence unit: share of true 'present' readings that abstain | 0.040±0.020 |
| presence region: present read present | 0.980±0.024 |
| presence region: share of 'present' readings that abstain | 0.200±0.107 |
| presence region: share of true 'present' readings that abstain | 0.200±0.107 |
| presence source: share of 'present' readings that abstain | 0.574±0.086 |
| presence source: share of true 'present' readings that abstain | 0.588±0.081 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.082±0.049 |
| presence anchor: share of true 'present' readings that abstain | 0.082±0.049 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.436±0.167 |
| presence fraction: share of true 'present' readings that abstain | 0.436±0.167 |
| presence object: absent read absent | 0.650±0.026 |
| presence object: share of FALSE 'present' readings that abstain | 0.082±0.067 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.147±0.147 |
| presence pairing: share of true 'present' readings that abstain | 0.147±0.147 |
| presence layout: present read present | 0.978±0.044 |
| presence layout: share of 'present' readings that abstain | 0.050±0.100 |
| presence layout: share of true 'present' readings that abstain | 0.050±0.100 |
| presence color: share of 'present' readings that abstain | 0.523±0.126 |
| presence color: share of true 'present' readings that abstain | 0.376±0.108 |
| presence color: share of FALSE 'present' readings that abstain | 0.971±0.057 |
| presence size: share of FALSE 'present' readings that abstain | 0.550±0.400 |
| presence style: present read present | 0.850±0.300 |
| presence style: share of true 'present' readings that abstain | 0.900±0.122 |
| presence text: share of FALSE 'present' readings that abstain | 0.367±0.194 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.614±0.007; status {'abstain': 218, 'no-sense': 70, 'ok': 12}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.763 | 0.229 / 0.144 | 0.99 | 0.227 | 0.003 / 0.010 |
| role object | 0.568 | 0.160 / 0.000 | 0.70 | 0.165 | 0.037 / 0.267 |
| roles (pooled) | 0.655 | 0.118 / 0.000 | 0.67 | 0.111 | 0.093 / 0.234 |
| role pairing | 0.857 | 0.101 / 0.052 | 1.00 | 0.143 | 0.000 / 0.000 |
| role source | 0.273 | 0.019 / 0.000 | 0.12 | 0.000 | 0.152 / 0.727 |
| role target | 0.538 | 0.041 / 0.000 | 0.31 | 0.077 | 0.308 / 0.385 |
| role anchor | 0.667 | 0.114 / 0.000 | 0.78 | 0.167 | 0.056 / 0.167 |
| role text | 0.808 | 0.117 / 0.024 | 0.87 | 0.115 | 0.058 / 0.077 |
| role axis | 0.727 | 0.094 / 0.000 | 0.64 | 0.000 | 0.091 / 0.273 |
| role quantity | 1.000 | 0.111 / 0.065 | 0.86 | 0.000 | 0.143 / 0.000 |
| role direction | 0.800 | 0.089 / 0.001 | 0.77 | 0.067 | 0.100 / 0.133 |
| role size | 0.733 | 0.063 / 0.000 | 0.60 | 0.000 | 0.133 / 0.267 |
| role color | 0.714 | 0.055 / 0.000 | 0.43 | 0.000 | 0.286 / 0.286 |
| role region | 0.833 | 0.078 / 0.044 | 0.88 | 0.083 | 0.042 / 0.083 |
| role relation | 0.857 | 0.099 / 0.017 | 0.79 | 0.036 | 0.107 / 0.107 |
| role landmark | 0.500 | 0.061 / 0.000 | 0.50 | 0.179 | 0.179 / 0.321 |
| role amount | 0.952 | 0.095 / 0.049 | 0.81 | 0.000 | 0.143 / 0.048 |
| role unit | 0.905 | 0.155 / 0.048 | 0.86 | 0.000 | 0.048 / 0.095 |
| role fraction | 0.875 | 0.081 / 0.042 | 0.62 | 0.125 | 0.375 / 0.000 |
| role layout | 0.667 | 0.136 / 0.011 | 0.67 | 0.167 | 0.167 / 0.167 |
| role style | 1.000 | 0.044 / 0.017 | 0.25 | 0.000 | 0.750 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 COMPONENT=0.51 VERB=0.41 FILLER=0.26 UNIT=0.19 REL=0.16 apart=0.15 PAIR=0.15 flow=0.15 REGION=0.14 back=0.13 LAYOUT=0.13 ANCHOR=0.12 CONN=0.12 din=0.12 do=0.12 the=0.12 together=0.12 unknown=0.12 front=0.11 LABEL=0.11 INTRO=0.10 never=0.10 evenly=0.10 PRON=0.10 are=0.10 spre=0.10 STYLE=0.09 pe=0.09 AXIS=0.09 DIR=0.09 not=0.09 is=0.09 COLOR=0.08 SIZE=0.08 DEM=0.08 lui=0.07 care=0.07 cu=0.07 FRACTION=0.07 dimensiunea=0.06 color=0.06 a=0.06 la=0.06 QUANT=0.05 NUM=0.05 de=0.05

## What is weak, what to add
- heldout_formulations: FULL 0.379
- heldout_formulations: presence color: absent read absent 0.899
- heldout_formulations: presence size: share of 'present' readings that abstain 0.444
- heldout_formulations: presence size: share of true 'present' readings that abstain 0.235
- heldout_formulations: presence style: absent read absent 0.894
- heldout_formulations: presence target: share of 'present' readings that abstain 0.792
- heldout_formulations: presence target: share of FALSE 'present' readings that abstain 0.500
- heldout_formulations: structure (depth, negation) 0.806
- heldout_formulations: predicate (surface lemma) 0.806
- heldout_formulations: event type (synonym table) 0.816
- heldout_formulations: role object 0.563
- heldout_formulations: head object 0.636
- heldout_formulations: occupancy: known filler 0.724
- heldout_formulations: role style 0.888
- heldout_formulations: head style 0.888
- heldout_formulations: role source 0.840
- heldout_formulations: head source 0.840
- heldout_formulations: role target 0.879
- heldout_formulations: head target 0.898
- heldout_formulations: heads FULL (model) 0.422
- heldout_formulations: heads FULL (lexical order baseline) 0.019
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.044
- heldout_formulations: FULL [depth given] 0.379
- heldout_formulations: FULL [depth and negation given] 0.379
- heldout_formulations: FULL [presence not decided] 0.369
- heldout_formulations: role object [presence not decided] 0.689
- heldout_formulations: role color [presence not decided] 0.767
- heldout_formulations: role size [presence not decided] 0.850
- heldout_formulations: role style [presence not decided] 0.893
- heldout_formulations: role landmark [presence not decided] 0.854
- heldout_formulations: role source [presence not decided] 0.816
- heldout_formulations: role target [presence not decided] 0.869
- heldout_formulations: heads FULL (model) [presence not decided] 0.422
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.320
- heldout_formulations: role object [pooled midpoint (comparison)] 0.471
- heldout_formulations: role style [pooled midpoint (comparison)] 0.893
- heldout_formulations: role source [pooled midpoint (comparison)] 0.840
- heldout_formulations: role target [pooled midpoint (comparison)] 0.893
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.369
- heldout_formulations: presence object: share of 'present' readings that abstain 0.084
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.086
- heldout_formulations: presence text: present read present 0.850
- heldout_formulations: presence text: share of 'present' readings that abstain 0.450
- heldout_formulations: presence text: share of true 'present' readings that abstain 0.471
- heldout_formulations: presence text: present read present [pooled midpoint (comparison)] 0.867
- heldout_formulations: presence color: share of 'present' readings that abstain 0.833
- heldout_formulations: presence color: share of FALSE 'present' readings that abstain 0.882
- heldout_formulations: presence source: present read present 0.375
- heldout_formulations: presence source: share of 'present' readings that abstain 0.786
- heldout_formulations: presence source: share of true 'present' readings that abstain 0.833
- heldout_formulations: presence target: present read present 0.690
- heldout_formulations: determiner identity (outside FULL when the legend excludes it) 0.830
- heldout_formulations: presence source: present read present [pooled midpoint (comparison)] 0.433
- heldout_formulations: presence target: present read present [pooled midpoint (comparison)] 0.714
- heldout_formulations: presence object: absent read absent 0.500
- heldout_formulations: presence object: share of FALSE 'present' readings that abstain 0.000
- heldout_formulations: presence style: share of 'present' readings that abstain 0.826
- heldout_formulations: presence style: share of FALSE 'present' readings that abstain 0.882
- heldout_formulations: presence pairing: share of 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence object: absent read absent [pooled midpoint (comparison)] 0.600
- heldout_formulations: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of 'present' readings that abstain 0.333
- heldout_formulations: presence fraction: share of true 'present' readings that abstain 0.333
- heldout_formulations: presence target: share of true 'present' readings that abstain 0.850
- heldout_formulations: presence relation: present read present 0.826
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.211
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.211
- heldout_formulations: presence landmark: present read present 0.696
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.263
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.125
- heldout_formulations: presence amount: share of 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence relation: present read present [pooled midpoint (comparison)] 0.783
- heldout_formulations: presence landmark: present read present [pooled midpoint (comparison)] 0.696
- heldout_formulations: presence amount: present read present [pooled midpoint (comparison)] 0.875
- heldout_formulations: presence unit: present read present [pooled midpoint (comparison)] 0.875
- heldout_formulations: presence style: present read present 0.750
- heldout_formulations: presence style: share of true 'present' readings that abstain 0.667
- heldout_formulations: presence style: present read present [pooled midpoint (comparison)] 0.429
- heldout_formulations: presence size: share of FALSE 'present' readings that abstain 0.800
- heldout_formulations: presence region: share of 'present' readings that abstain 0.462
- heldout_formulations: presence region: share of true 'present' readings that abstain 0.462
- heldout_formulations: presence quantity: present read present 0.667
- heldout_formulations: presence quantity: share of 'present' readings that abstain 0.200
- heldout_formulations: presence quantity: share of true 'present' readings that abstain 0.200
- heldout_formulations: presence quantity: present read present [pooled midpoint (comparison)] 0.643
- heldout_formulations: presence layout: share of 'present' readings that abstain 0.000
- heldout_formulations: presence layout: share of FALSE 'present' readings that abstain 0.000
- heldout_formulations: presence color: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence text: share of FALSE 'present' readings that abstain 0.333
- heldout_formulations: presence source: share of FALSE 'present' readings that abstain 0.500
- heldout_formulations: presence axis: share of 'present' readings that abstain 0.000
- heldout_formulations: presence axis: share of true 'present' readings that abstain 0.000
- heldout_sentences: FULL 0.468
- heldout_sentences: presence object: present read present 0.853
- heldout_sentences: presence object: share of 'present' readings that abstain 0.074
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.062
- heldout_sentences: presence size: share of 'present' readings that abstain 0.000
- heldout_sentences: presence size: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence amount: share of 'present' readings that abstain 0.375
- heldout_sentences: presence amount: share of true 'present' readings that abstain 0.375
- heldout_sentences: presence unit: present read present 0.875
- heldout_sentences: structure (depth, negation) 0.851
- heldout_sentences: predicate (surface lemma) 0.862
- heldout_sentences: event type (synonym table) 0.862
- heldout_sentences: role object 0.606
- heldout_sentences: head object 0.681
- heldout_sentences: occupancy: known filler 0.748
- heldout_sentences: role source 0.883
- heldout_sentences: head source 0.894
- heldout_sentences: heads FULL (model) 0.521
- heldout_sentences: heads FULL (lexical order baseline) 0.011
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.021
- heldout_sentences: FULL [depth given] 0.468
- heldout_sentences: FULL [depth and negation given] 0.468
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.415
- heldout_sentences: role object [pooled midpoint (comparison)] 0.532
- heldout_sentences: role source [pooled midpoint (comparison)] 0.872
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.489
- heldout_sentences: presence object: present read present [pooled midpoint (comparison)] 0.817
- heldout_sentences: presence amount: present read present [pooled midpoint (comparison)] 0.875
- heldout_sentences: presence unit: present read present [pooled midpoint (comparison)] 0.875
- heldout_sentences: presence source: present read present 0.462
- heldout_sentences: presence target: present read present 0.818
- heldout_sentences: presence target: share of 'present' readings that abstain 0.800
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.778
- heldout_sentences: determiner identity (outside FULL when the legend excludes it) 0.750
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.455
- heldout_sentences: presence target: present read present [pooled midpoint (comparison)] 0.778
- heldout_sentences: presence axis: share of 'present' readings that abstain 0.000
- heldout_sentences: presence axis: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence color: share of 'present' readings that abstain 0.700
- heldout_sentences: presence region: present read present 0.700
- heldout_sentences: presence region: present read present [pooled midpoint (comparison)] 0.667
- heldout_sentences: presence source: share of 'present' readings that abstain 0.833
- heldout_sentences: presence source: share of true 'present' readings that abstain 0.833
- heldout_sentences: presence anchor: share of 'present' readings that abstain 0.000
- heldout_sentences: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence layout: share of 'present' readings that abstain 0.250
- heldout_sentences: presence layout: share of true 'present' readings that abstain 0.250
- heldout_sentences: presence object: absent read absent 0.333
- heldout_sentences: presence direction: share of 'present' readings that abstain 0.143
- heldout_sentences: presence direction: share of true 'present' readings that abstain 0.143
- heldout_sentences: presence object: absent read absent [pooled midpoint (comparison)] 0.400
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.000
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence text: share of 'present' readings that abstain 0.133
- heldout_sentences: presence text: share of true 'present' readings that abstain 0.143
- heldout_sentences: presence relation: present read present 0.833
- heldout_sentences: presence relation: share of 'present' readings that abstain 0.000
- heldout_sentences: presence relation: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence landmark: present read present 0.833
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.250
- heldout_sentences: presence landmark: share of true 'present' readings that abstain 0.100
- heldout_sentences: presence landmark: present read present [pooled midpoint (comparison)] 0.818
- heldout_sentences: presence size: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: presence object: share of FALSE 'present' readings that abstain 0.250
- heldout_sentences: presence pairing: share of 'present' readings that abstain 0.000
- heldout_sentences: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence region: share of 'present' readings that abstain 0.286
- heldout_sentences: presence region: share of true 'present' readings that abstain 0.286
- heldout_sentences: presence text: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: presence color: present read present 0.800
- heldout_sentences: presence color: share of true 'present' readings that abstain 0.250
- heldout_sentences: presence color: present read present [pooled midpoint (comparison)] 0.800
- mixed: FULL 0.398
- mixed: presence object: present read present 0.879
- mixed: presence object: share of 'present' readings that abstain 0.052
- mixed: presence object: share of true 'present' readings that abstain 0.047
- mixed: presence relation: share of 'present' readings that abstain 0.184
- mixed: presence relation: share of true 'present' readings that abstain 0.184
- mixed: presence landmark: present read present 0.762
- mixed: presence landmark: share of 'present' readings that abstain 0.205
- mixed: presence landmark: share of true 'present' readings that abstain 0.031
- mixed: structure (depth, negation) 0.770
- mixed: predicate (surface lemma) 0.775
- mixed: event type (synonym table) 0.777
- mixed: role object 0.557
- mixed: head object 0.645
- mixed: determiner identity (outside FULL when the legend excludes it) 0.691
- mixed: occupancy: known filler 0.698
- mixed: role source 0.880
- mixed: head source 0.885
- mixed: heads FULL (model) 0.472
- mixed: heads FULL (lexical order baseline) 0.013
- mixed: heads FULL (lexical bag baseline, trained on the same training rows) 0.090
- mixed: FULL [depth given] 0.398
- mixed: FULL [depth and negation given] 0.403
- mixed: FULL [pooled midpoint (comparison)] 0.335
- mixed: role object [pooled midpoint (comparison)] 0.470
- mixed: role source [pooled midpoint (comparison)] 0.895
- mixed: heads FULL (model) [pooled midpoint (comparison)] 0.417
- mixed: presence object: present read present [pooled midpoint (comparison)] 0.842
- mixed: presence relation: present read present [pooled midpoint (comparison)] 0.889
- mixed: presence landmark: present read present [pooled midpoint (comparison)] 0.833
- mixed: presence anchor: share of 'present' readings that abstain 0.185
- mixed: presence anchor: share of true 'present' readings that abstain 0.185
- mixed: presence color: share of 'present' readings that abstain 0.656
- mixed: presence anchor: present read present [pooled midpoint (comparison)] 0.893
- mixed: presence layout: present read present 0.762
- mixed: presence layout: present read present [pooled midpoint (comparison)] 0.789
- mixed: presence amount: present read present 0.871
- mixed: presence amount: share of 'present' readings that abstain 0.074
- mixed: presence amount: share of true 'present' readings that abstain 0.074
- mixed: presence unit: share of 'present' readings that abstain 0.032
- mixed: presence unit: share of true 'present' readings that abstain 0.032
- mixed: presence amount: present read present [pooled midpoint (comparison)] 0.867
- mixed: presence size: share of 'present' readings that abstain 0.389
- mixed: presence source: present read present 0.229
- mixed: presence target: present read present 0.857
- mixed: presence target: share of 'present' readings that abstain 0.600
- mixed: presence target: share of true 'present' readings that abstain 0.556
- mixed: presence source: present read present [pooled midpoint (comparison)] 0.290
- mixed: presence target: present read present [pooled midpoint (comparison)] 0.842
- mixed: presence color: share of true 'present' readings that abstain 0.214
- mixed: presence text: present read present 0.841
- mixed: presence text: share of 'present' readings that abstain 0.128
- mixed: presence text: share of true 'present' readings that abstain 0.135
- mixed: presence text: present read present [pooled midpoint (comparison)] 0.821
- mixed: presence layout: share of 'present' readings that abstain 0.125
- mixed: presence layout: share of true 'present' readings that abstain 0.125
- mixed: presence region: share of 'present' readings that abstain 0.107
- mixed: presence region: share of true 'present' readings that abstain 0.107
- mixed: presence fraction: share of 'present' readings that abstain 0.214
- mixed: presence fraction: share of true 'present' readings that abstain 0.214
- mixed: presence axis: share of 'present' readings that abstain 0.000
- mixed: presence axis: share of true 'present' readings that abstain 0.000
- mixed: presence quantity: share of 'present' readings that abstain 0.143
- mixed: presence quantity: share of true 'present' readings that abstain 0.167
- mixed: presence direction: present read present 0.882
- mixed: presence direction: share of 'present' readings that abstain 0.200
- mixed: presence direction: share of true 'present' readings that abstain 0.200
- mixed: presence direction: present read present [pooled midpoint (comparison)] 0.812
- mixed: presence object: absent read absent 0.391
- mixed: presence pairing: share of 'present' readings that abstain 0.154
- mixed: presence pairing: share of true 'present' readings that abstain 0.154
- mixed: presence object: absent read absent [pooled midpoint (comparison)] 0.619
- mixed: presence style: present read present 0.857
- mixed: presence style: present read present [pooled midpoint (comparison)] 0.857
- mixed: presence object: share of FALSE 'present' readings that abstain 0.143
- mixed: presence source: share of true 'present' readings that abstain 0.875
- mixed: presence style: share of true 'present' readings that abstain 0.667
- mixed: presence text: share of FALSE 'present' readings that abstain 0.000
- mixed: presence size: share of true 'present' readings that abstain 0.083
- mixed: presence quantity: share of FALSE 'present' readings that abstain 0.000
- new_identities: FULL 0.455
- new_identities: structure (depth, negation) 0.810
- new_identities: predicate (surface lemma) 0.815
- new_identities: event type (synonym table) 0.815
- new_identities: role object 0.645
- new_identities: head object 0.705
- new_identities: occupancy: unknown filler 0.701
- new_identities: role text 0.840
- new_identities: head text 0.840
- new_identities: role landmark 0.887
- new_identities: heads FULL (model) 0.502
- new_identities: heads FULL (lexical order baseline) 0.000
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.105
- new_identities: FULL [depth given] 0.455
- new_identities: FULL [depth and negation given] 0.455
- new_identities: FULL [pooled midpoint (comparison)] 0.338
- new_identities: role object [pooled midpoint (comparison)] 0.500
- new_identities: role text [pooled midpoint (comparison)] 0.780
- new_identities: role landmark [pooled midpoint (comparison)] 0.885
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.403
- new_identities: presence object: share of 'present' readings that abstain 0.057
- new_identities: presence object: share of true 'present' readings that abstain 0.052
- new_identities: presence text: absent read absent 0.888
- new_identities: presence anchor: share of 'present' readings that abstain 0.000
- new_identities: presence anchor: share of true 'present' readings that abstain 0.000
- new_identities: presence fraction: share of 'present' readings that abstain 0.500
- new_identities: presence fraction: share of true 'present' readings that abstain 0.500
- new_identities: occupancy: known filler 0.794
- new_identities: presence object: present read present [pooled midpoint (comparison)] 0.880
- new_identities: presence amount: present read present 0.897
- new_identities: presence amount: share of 'present' readings that abstain 0.192
- new_identities: presence amount: share of true 'present' readings that abstain 0.192
- new_identities: presence unit: share of 'present' readings that abstain 0.070
- new_identities: presence unit: share of true 'present' readings that abstain 0.070
- new_identities: presence direction: share of 'present' readings that abstain 0.000
- new_identities: presence direction: share of true 'present' readings that abstain 0.000
- new_identities: presence amount: present read present [pooled midpoint (comparison)] 0.882
- new_identities: presence region: share of 'present' readings that abstain 0.350
- new_identities: presence region: share of true 'present' readings that abstain 0.350
- new_identities: presence region: present read present [pooled midpoint (comparison)] 0.667
- new_identities: determiner identity (outside FULL when the legend excludes it) 0.893
- new_identities: presence text: share of 'present' readings that abstain 0.226
- new_identities: presence text: share of true 'present' readings that abstain 0.187
- new_identities: presence relation: share of 'present' readings that abstain 0.098
- new_identities: presence relation: share of true 'present' readings that abstain 0.098
- new_identities: presence landmark: present read present 0.576
- new_identities: presence landmark: present read present [pooled midpoint (comparison)] 0.638
- new_identities: presence color: share of 'present' readings that abstain 0.833
- new_identities: presence object: absent read absent 0.222
- new_identities: presence object: share of FALSE 'present' readings that abstain 0.286
- new_identities: presence source: present read present 0.538
- new_identities: presence target: present read present 0.654
- new_identities: presence target: share of true 'present' readings that abstain 0.882
- new_identities: presence object: absent read absent [pooled midpoint (comparison)] 0.222
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.538
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.615
- new_identities: presence landmark: share of 'present' readings that abstain 0.375
- new_identities: presence landmark: share of true 'present' readings that abstain 0.368
- new_identities: presence style: share of FALSE 'present' readings that abstain 0.895
- new_identities: presence size: share of 'present' readings that abstain 0.400
- new_identities: presence size: share of true 'present' readings that abstain 0.150
- new_identities: presence text: share of FALSE 'present' readings that abstain 0.500
- new_identities: presence size: present read present [pooled midpoint (comparison)] 0.895
- new_identities: presence color: present read present 0.500
- new_identities: presence color: share of true 'present' readings that abstain 0.000
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.667
- new_identities: presence source: share of 'present' readings that abstain 0.800
- new_identities: presence quantity: share of 'present' readings that abstain 0.333
- new_identities: presence quantity: share of FALSE 'present' readings that abstain 0.333
- new_identities: presence source: share of true 'present' readings that abstain 0.786
- new_identities: presence landmark: share of FALSE 'present' readings that abstain 0.500
- train (sample): FULL 0.457
- train (sample): presence object: present read present 0.886
- train (sample): presence object: share of 'present' readings that abstain 0.062
- train (sample): presence object: share of true 'present' readings that abstain 0.065
- train (sample): structure (depth, negation) 0.767
- train (sample): predicate (surface lemma) 0.763
- train (sample): event type (synonym table) 0.767
- train (sample): role object 0.583
- train (sample): head object 0.650
- train (sample): occupancy: known filler 0.731
- train (sample): heads FULL (model) 0.533
- train (sample): heads FULL (lexical order baseline) 0.017
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.100
- train (sample): FULL [depth given] 0.457
- train (sample): FULL [depth and negation given] 0.457
- train (sample): presence source: present read present 0.448
- train (sample): presence target: present read present 0.870
- train (sample): presence target: share of 'present' readings that abstain 0.650
- train (sample): presence target: share of true 'present' readings that abstain 0.650
- train (sample): determiner identity (outside FULL when the legend excludes it) 0.727
- train (sample): presence text: share of 'present' readings that abstain 0.109
- train (sample): presence text: share of true 'present' readings that abstain 0.071
- train (sample): presence axis: share of 'present' readings that abstain 0.125
- train (sample): presence axis: share of true 'present' readings that abstain 0.125
- train (sample): presence quantity: share of 'present' readings that abstain 0.143
- train (sample): presence quantity: share of true 'present' readings that abstain 0.143
- train (sample): presence size: share of 'present' readings that abstain 0.250
- train (sample): presence size: share of true 'present' readings that abstain 0.182
- train (sample): presence color: present read present 0.846
- train (sample): presence direction: share of 'present' readings that abstain 0.125
- train (sample): presence direction: share of true 'present' readings that abstain 0.125
- train (sample): presence relation: share of 'present' readings that abstain 0.125
- train (sample): presence relation: share of true 'present' readings that abstain 0.125
- train (sample): presence landmark: present read present 0.833
- train (sample): presence landmark: share of 'present' readings that abstain 0.364
- train (sample): presence landmark: share of true 'present' readings that abstain 0.300
- train (sample): presence amount: share of 'present' readings that abstain 0.150
- train (sample): presence amount: share of true 'present' readings that abstain 0.150
- train (sample): presence unit: share of 'present' readings that abstain 0.053
- train (sample): presence unit: share of true 'present' readings that abstain 0.053
- train (sample): presence region: share of 'present' readings that abstain 0.050
- train (sample): presence region: share of true 'present' readings that abstain 0.050
- train (sample): presence source: share of 'present' readings that abstain 0.643
- train (sample): presence source: share of true 'present' readings that abstain 0.692
- train (sample): presence anchor: share of 'present' readings that abstain 0.083
- train (sample): presence anchor: share of true 'present' readings that abstain 0.083
- train (sample): presence fraction: share of 'present' readings that abstain 0.429
- train (sample): presence fraction: share of true 'present' readings that abstain 0.429
- train (sample): presence object: absent read absent 0.650
- train (sample): presence object: share of FALSE 'present' readings that abstain 0.000
- train (sample): presence pairing: share of 'present' readings that abstain 0.000
- train (sample): presence pairing: share of true 'present' readings that abstain 0.000
- train (sample): presence layout: share of 'present' readings that abstain 0.250
- train (sample): presence layout: share of true 'present' readings that abstain 0.250
- train (sample): presence color: share of 'present' readings that abstain 0.611
- train (sample): presence color: share of true 'present' readings that abstain 0.455
- train (sample): presence color: share of FALSE 'present' readings that abstain 0.857
- train (sample): presence style: share of true 'present' readings that abstain 0.750
- train (sample): presence text: share of FALSE 'present' readings that abstain 0.500
- train (sample): presence source: share of FALSE 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_formulations: `as_vrea sa faci COMPONENT STYLE .` FULL 0.000 (n 3)
- heldout_formulations: `deci stergeti QUANT COMPONENT COLOR .` FULL 0.000 (n 2)
- heldout_formulations: `hai sa inseram NUM COMPONENT` FULL 0.000 (n 2)
- heldout_formulations: `muta COMPONENT STYLE FRACTION spre ANCHOR te rog` FULL 0.000 (n 2)
- heldout_formulations: `okay deci redenumeste COMPONENT in LABEL` FULL 0.000 (n 2)
- mixed: `as_vrea sa redo` FULL 0.000 (n 2)
- heldout_sentences: `hai sa facem COMPONENT cu NUM UNIT SIZE .` FULL 0.000 (n 1)
- heldout_sentences: `hai sa unim COMPONENT cu COMPONENT cu a COMPONENT` FULL 0.000 (n 1)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role size | role style | role text | role relation | role landmark | role region | role anchor | role fraction | role amount | role unit | role direction | role axis | role layout | role pairing | role source | role target | role quantity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.488±0.043 | 0.429±0.038 | 0.572±0.019 | 0.961±0.029 | 0.964±0.012 | 0.927±0.022 | 0.948±0.008 | 0.969±0.009 | 0.906±0.011 | 0.997±0.004 | 0.986±0.004 | 0.983±0.007 | 0.999±0.002 | 0.998±0.004 | 1.000±0.000 | 0.999±0.002 | 0.998±0.002 | 1.000±0.000 | 0.843±0.007 | 0.894±0.017 | 0.951±0.005 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.416±0.028 | 0.352±0.019 | 0.475±0.015 | 0.974±0.020 | 0.961±0.007 | 0.925±0.019 | 0.940±0.005 | 0.963±0.005 | 0.917±0.006 | 0.987±0.006 | 0.972±0.006 | 0.970±0.005 | 0.995±0.003 | 0.996±0.004 | 1.000±0.000 | 0.999±0.002 | 0.998±0.002 | 0.997±0.002 | 0.846±0.006 | 0.904±0.015 | 0.944±0.008 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.420±0.005 | 0.365±0.006 | 0.707±0.013 | 0.767±0.000 | 0.849±0.004 | 0.893±0.000 | 0.944±0.006 | 1.000±0.000 | 0.852±0.013 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.996±0.004 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.986±0.002 | 1.000±0.000 | 0.830±0.013 | 0.882±0.016 | 0.996±0.004 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 0.942±0.018 | 0.500±0.000 | 0.721±0.009 | 0.068±0.009 (0.000±0.000 / 0.069±0.009) |
| heldout_formulations | object | comparison: pooled midpoint | 0.908±0.018 | 0.627±0.110 | 0.768±0.050 |  |
| heldout_formulations | color | product: fitted | 1.000±0.000 | 0.952±0.035 | 0.976±0.018 | 0.917±0.105 (0.976±0.047 / 0.600±0.490) |
| heldout_formulations | color | comparison: pooled midpoint | 1.000±0.000 | 0.964±0.026 | 0.982±0.013 |  |
| heldout_formulations | size | product: fitted | 1.000±0.000 | 0.959±0.019 | 0.980±0.009 | 0.295±0.151 (0.580±0.286 / 0.179±0.063) |
| heldout_formulations | size | comparison: pooled midpoint | 1.000±0.000 | 0.956±0.016 | 0.978±0.008 |  |
| heldout_formulations | style | product: fitted | 0.712±0.298 | 0.944±0.034 | 0.828±0.139 | 0.955±0.067 (0.976±0.047 / 0.908±0.130) |
| heldout_formulations | style | comparison: pooled midpoint | 0.863±0.222 | 0.929±0.018 | 0.896±0.116 |  |
| heldout_formulations | text | product: fitted | 0.771±0.054 | 0.980±0.004 | 0.876±0.026 | 0.341±0.107 (0.433±0.327 / 0.327±0.122) |
| heldout_formulations | text | comparison: pooled midpoint | 0.861±0.031 | 0.978±0.001 | 0.919±0.015 |  |
| heldout_formulations | relation | product: fitted | 0.887±0.045 | 1.000±0.000 | 0.943±0.023 | 0.144±0.054 (— / 0.144±0.054) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.883±0.058 | 1.000±0.000 | 0.941±0.029 |  |
| heldout_formulations | landmark | product: fitted | 0.785±0.054 | 0.956±0.017 | 0.870±0.027 | 0.375±0.060 (0.978±0.044 / 0.173±0.056) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.764±0.057 | 0.974±0.007 | 0.869±0.026 |  |
| heldout_formulations | region | product: fitted | 0.983±0.033 | 1.000±0.000 | 0.992±0.017 | 0.309±0.127 (— / 0.309±0.127) |
| heldout_formulations | region | comparison: pooled midpoint | 0.867±0.100 | 1.000±0.000 | 0.933±0.050 |  |
| heldout_formulations | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | fraction | product: fitted | 0.942±0.079 | 1.000±0.000 | 0.971±0.040 | 0.449±0.156 (— / 0.449±0.156) |
| heldout_formulations | fraction | comparison: pooled midpoint | 0.960±0.080 | 1.000±0.000 | 0.980±0.040 |  |
| heldout_formulations | amount | product: fitted | 0.975±0.050 | 1.000±0.000 | 0.988±0.025 | 0.050±0.100 (— / 0.050±0.100) |
| heldout_formulations | amount | comparison: pooled midpoint | 0.925±0.100 | 1.000±0.000 | 0.963±0.050 |  |
| heldout_formulations | unit | product: fitted | 0.950±0.100 | 1.000±0.000 | 0.975±0.050 | 0.025±0.050 (— / 0.025±0.050) |
| heldout_formulations | unit | comparison: pooled midpoint | 0.946±0.066 | 1.000±0.000 | 0.973±0.033 |  |
| heldout_formulations | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | direction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.050±0.100 (— / 0.050±0.100) |
| heldout_formulations | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | layout | product: fitted | — | 0.998±0.003 | — | 0.000±0.000 (0.000±0.000 / —) |
| heldout_formulations | layout | comparison: pooled midpoint | — | 0.997±0.003 | — |  |
| heldout_formulations | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.067±0.133 (— / 0.067±0.133) |
| heldout_formulations | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | source | product: fitted | 0.259±0.110 | 0.990±0.007 | 0.624±0.055 | 0.895±0.089 (0.625±0.415 / 0.911±0.083) |
| heldout_formulations | source | comparison: pooled midpoint | 0.307±0.098 | 0.992±0.007 | 0.649±0.047 |  |
| heldout_formulations | target | product: fitted | 0.709±0.073 | 0.990±0.013 | 0.849±0.034 | 0.783±0.121 (0.583±0.083 / 0.798±0.125) |
| heldout_formulations | target | comparison: pooled midpoint | 0.773±0.074 | 0.997±0.004 | 0.885±0.038 |  |
| heldout_formulations | quantity | product: fitted | 0.824±0.089 | 1.000±0.000 | 0.912±0.044 | 0.313±0.119 (— / 0.313±0.119) |
| heldout_formulations | quantity | comparison: pooled midpoint | 0.753±0.118 | 1.000±0.000 | 0.876±0.059 |  |
| heldout_sentences | object | product: fitted | 0.885±0.019 | 0.410±0.087 | 0.647±0.044 | 0.041±0.019 (0.100±0.122 / 0.037±0.016) |
| heldout_sentences | object | comparison: pooled midpoint | 0.835±0.028 | 0.440±0.049 | 0.637±0.038 |  |
| heldout_sentences | color | product: fitted | 0.860±0.116 | 0.963±0.022 | 0.911±0.062 | 0.802±0.058 (1.000±0.000 / 0.637±0.202) |
| heldout_sentences | color | comparison: pooled midpoint | 0.820±0.093 | 0.983±0.021 | 0.901±0.046 |  |
| heldout_sentences | size | product: fitted | 0.933±0.082 | 0.978±0.011 | 0.956±0.043 | 0.233±0.162 (0.633±0.371 / 0.113±0.157) |
| heldout_sentences | size | comparison: pooled midpoint | 1.000±0.000 | 0.976±0.016 | 0.988±0.008 |  |
| heldout_sentences | style | product: fitted | — | 0.985±0.009 | — | 0.750±0.433 (0.750±0.433 / —) |
| heldout_sentences | style | comparison: pooled midpoint | — | 0.984±0.010 | — |  |
| heldout_sentences | text | product: fitted | 0.971±0.057 | 0.985±0.001 | 0.978±0.028 | 0.136±0.053 (0.200±0.400 / 0.133±0.066) |
| heldout_sentences | text | comparison: pooled midpoint | 0.982±0.036 | 0.983±0.001 | 0.982±0.018 |  |
| heldout_sentences | relation | product: fitted | 0.910±0.053 | 1.000±0.000 | 0.955±0.027 | 0.042±0.052 (— / 0.042±0.052) |
| heldout_sentences | relation | comparison: pooled midpoint | 0.902±0.090 | 1.000±0.000 | 0.951±0.045 |  |
| heldout_sentences | landmark | product: fitted | 0.853±0.040 | 0.962±0.019 | 0.908±0.020 | 0.334±0.072 (1.000±0.000 / 0.149±0.103) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.839±0.041 | 0.975±0.008 | 0.907±0.022 |  |
| heldout_sentences | region | product: fitted | 0.811±0.072 | 1.000±0.000 | 0.905±0.036 | 0.262±0.077 (— / 0.262±0.077) |
| heldout_sentences | region | comparison: pooled midpoint | 0.758±0.103 | 1.000±0.000 | 0.879±0.052 |  |
| heldout_sentences | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.300±0.245 (— / 0.300±0.245) |
| heldout_sentences | anchor | comparison: pooled midpoint | 0.700±0.245 | 1.000±0.000 | 0.850±0.122 |  |
| heldout_sentences | fraction | product: fitted | — | 1.000±0.000 | — |  |
| heldout_sentences | fraction | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_sentences | amount | product: fitted | 0.925±0.061 | 1.000±0.000 | 0.963±0.031 | 0.129±0.137 (— / 0.129±0.137) |
| heldout_sentences | amount | comparison: pooled midpoint | 0.900±0.094 | 1.000±0.000 | 0.950±0.047 |  |
| heldout_sentences | unit | product: fitted | 0.975±0.050 | 1.000±0.000 | 0.988±0.025 | 0.025±0.050 (— / 0.025±0.050) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.950±0.061 | 1.000±0.000 | 0.975±0.031 |  |
| heldout_sentences | direction | product: fitted | 0.971±0.057 | 1.000±0.000 | 0.986±0.029 | 0.181±0.076 (— / 0.181±0.076) |
| heldout_sentences | direction | comparison: pooled midpoint | 0.971±0.057 | 1.000±0.000 | 0.986±0.029 |  |
| heldout_sentences | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.050±0.100 (— / 0.050±0.100) |
| heldout_sentences | layout | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.300±0.267 (— / 0.300±0.267) |
| heldout_sentences | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | source | product: fitted | 0.375±0.124 | 1.000±0.000 | 0.687±0.062 | 0.860±0.127 (— / 0.860±0.127) |
| heldout_sentences | source | comparison: pooled midpoint | 0.471±0.049 | 1.000±0.000 | 0.735±0.024 |  |
| heldout_sentences | target | product: fitted | 0.696±0.111 | 0.994±0.007 | 0.845±0.052 | 0.787±0.161 (1.000±0.000 / 0.778±0.161) |
| heldout_sentences | target | comparison: pooled midpoint | 0.740±0.118 | 1.000±0.000 | 0.870±0.059 |  |
| heldout_sentences | quantity | product: fitted | 1.000 | 0.995±0.006 | 1.000 | 0.500±0.500 (0.500±0.500 / 0.000) |
| heldout_sentences | quantity | comparison: pooled midpoint | 1.000 | 1.000±0.000 | 1.000 |  |
| mixed | object | product: fitted | 0.902±0.015 | 0.391±0.057 | 0.647±0.033 | 0.047±0.011 (0.103±0.057 / 0.044±0.009) |
| mixed | object | comparison: pooled midpoint | 0.863±0.012 | 0.577±0.097 | 0.720±0.048 |  |
| mixed | color | product: fitted | 0.878±0.051 | 0.967±0.018 | 0.922±0.018 | 0.663±0.161 (0.983±0.033 / 0.463±0.190) |
| mixed | color | comparison: pooled midpoint | 0.916±0.072 | 0.985±0.006 | 0.950±0.035 |  |
| mixed | size | product: fitted | 0.847±0.098 | 0.984±0.008 | 0.916±0.047 | 0.247±0.131 (0.733±0.156 / 0.057±0.047) |
| mixed | size | comparison: pooled midpoint | 0.870±0.084 | 0.984±0.004 | 0.927±0.042 |  |
| mixed | style | product: fitted | 0.736±0.259 | 0.953±0.021 | 0.844±0.121 | 0.936±0.073 (0.986±0.029 / 0.793±0.194) |
| mixed | style | comparison: pooled midpoint | 0.848±0.091 | 0.940±0.006 | 0.894±0.045 |  |
| mixed | text | product: fitted | 0.822±0.030 | 0.987±0.004 | 0.904±0.015 | 0.225±0.080 (0.487±0.328 / 0.196±0.059) |
| mixed | text | comparison: pooled midpoint | 0.834±0.022 | 0.988±0.007 | 0.911±0.008 |  |
| mixed | relation | product: fitted | 0.909±0.022 | 1.000±0.000 | 0.955±0.011 | 0.186±0.023 (— / 0.186±0.023) |
| mixed | relation | comparison: pooled midpoint | 0.871±0.041 | 1.000±0.000 | 0.935±0.021 |  |
| mixed | landmark | product: fitted | 0.797±0.042 | 0.968±0.011 | 0.882±0.025 | 0.327±0.078 (0.910±0.093 / 0.178±0.097) |
| mixed | landmark | comparison: pooled midpoint | 0.792±0.037 | 0.984±0.003 | 0.888±0.019 |  |
| mixed | region | product: fitted | 0.845±0.069 | 1.000±0.000 | 0.923±0.034 | 0.267±0.090 (— / 0.267±0.090) |
| mixed | region | comparison: pooled midpoint | 0.735±0.110 | 1.000±0.000 | 0.867±0.055 |  |
| mixed | anchor | product: fitted | 0.916±0.028 | 1.000±0.000 | 0.958±0.014 | 0.090±0.068 (— / 0.090±0.068) |
| mixed | anchor | comparison: pooled midpoint | 0.883±0.023 | 1.000±0.000 | 0.942±0.012 |  |
| mixed | fraction | product: fitted | 0.930±0.106 | 1.000±0.000 | 0.965±0.053 | 0.229±0.160 (— / 0.229±0.160) |
| mixed | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| mixed | amount | product: fitted | 0.928±0.048 | 1.000±0.000 | 0.964±0.024 | 0.119±0.060 (— / 0.119±0.060) |
| mixed | amount | comparison: pooled midpoint | 0.884±0.071 | 1.000±0.000 | 0.942±0.035 |  |
| mixed | unit | product: fitted | 0.980±0.027 | 1.000±0.000 | 0.990±0.013 | 0.033±0.030 (— / 0.033±0.030) |
| mixed | unit | comparison: pooled midpoint | 0.919±0.034 | 1.000±0.000 | 0.960±0.017 |  |
| mixed | direction | product: fitted | 0.893±0.048 | 1.000±0.000 | 0.946±0.024 | 0.203±0.061 (— / 0.203±0.061) |
| mixed | direction | comparison: pooled midpoint | 0.884±0.062 | 1.000±0.000 | 0.942±0.031 |  |
| mixed | axis | product: fitted | 0.978±0.044 | 1.000±0.000 | 0.989±0.022 | 0.112±0.064 (— / 0.112±0.064) |
| mixed | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| mixed | layout | product: fitted | 0.871±0.065 | 1.000±0.000 | 0.936±0.032 | 0.134±0.032 (— / 0.134±0.032) |
| mixed | layout | comparison: pooled midpoint | 0.837±0.041 | 1.000±0.000 | 0.919±0.021 |  |
| mixed | pairing | product: fitted | 0.954±0.038 | 1.000±0.000 | 0.977±0.019 | 0.200±0.132 (— / 0.200±0.132) |
| mixed | pairing | comparison: pooled midpoint | 0.883±0.194 | 1.000±0.000 | 0.942±0.097 |  |
| mixed | source | product: fitted | 0.290±0.061 | 0.989±0.011 | 0.639±0.033 | 0.706±0.139 (0.778±0.208 / 0.680±0.127) |
| mixed | source | comparison: pooled midpoint | 0.370±0.068 | 0.993±0.004 | 0.681±0.034 |  |
| mixed | target | product: fitted | 0.723±0.080 | 0.996±0.002 | 0.860±0.039 | 0.571±0.111 (1.000±0.000 / 0.548±0.110) |
| mixed | target | comparison: pooled midpoint | 0.721±0.075 | 0.997±0.003 | 0.859±0.037 |  |
| mixed | quantity | product: fitted | 0.867±0.194 | 0.996±0.003 | 0.931±0.098 | 0.250±0.193 (0.417±0.433 / 0.173±0.183) |
| mixed | quantity | comparison: pooled midpoint | 0.867±0.194 | 0.995±0.005 | 0.931±0.099 |  |
| new_identities | object | product: fitted | 0.902±0.012 | 0.145±0.040 | 0.523±0.024 | 0.047±0.008 (0.057±0.114 / 0.047±0.007) |
| new_identities | object | comparison: pooled midpoint | 0.864±0.009 | 0.169±0.148 | 0.517±0.077 |  |
| new_identities | color | product: fitted | 0.604±0.139 | 0.968±0.022 | 0.786±0.077 | 0.692±0.205 (0.882±0.194 / 0.336±0.191) |
| new_identities | color | comparison: pooled midpoint | 0.633±0.124 | 0.981±0.018 | 0.807±0.062 |  |
| new_identities | size | product: fitted | 0.852±0.059 | 0.974±0.013 | 0.913±0.027 | 0.324±0.120 (0.695±0.212 / 0.181±0.089) |
| new_identities | size | comparison: pooled midpoint | 0.835±0.040 | 0.970±0.012 | 0.902±0.017 |  |
| new_identities | style | product: fitted | 1.000±0.000 | 0.961±0.020 | 0.981±0.010 | 0.966±0.043 (0.964±0.046 / 1.000±0.000) |
| new_identities | style | comparison: pooled midpoint | 1.000±0.000 | 0.955±0.014 | 0.978±0.007 |  |
| new_identities | text | product: fitted | 0.919±0.016 | 0.927±0.023 | 0.923±0.011 | 0.246±0.023 (0.428±0.205 / 0.230±0.037) |
| new_identities | text | comparison: pooled midpoint | 0.914±0.031 | 0.928±0.011 | 0.921±0.021 |  |
| new_identities | relation | product: fitted | 0.942±0.026 | 1.000±0.000 | 0.971±0.013 | 0.088±0.019 (— / 0.088±0.019) |
| new_identities | relation | comparison: pooled midpoint | 0.905±0.028 | 1.000±0.000 | 0.953±0.014 |  |
| new_identities | landmark | product: fitted | 0.702±0.070 | 0.973±0.011 | 0.838±0.031 | 0.357±0.034 (0.878±0.194 / 0.274±0.065) |
| new_identities | landmark | comparison: pooled midpoint | 0.687±0.062 | 0.982±0.005 | 0.834±0.030 |  |
| new_identities | region | product: fitted | 0.928±0.051 | 1.000±0.000 | 0.964±0.026 | 0.240±0.081 (— / 0.240±0.081) |
| new_identities | region | comparison: pooled midpoint | 0.778±0.091 | 1.000±0.000 | 0.889±0.046 |  |
| new_identities | anchor | product: fitted | 0.983±0.033 | 1.000±0.000 | 0.992±0.017 | 0.102±0.103 (— / 0.102±0.103) |
| new_identities | anchor | comparison: pooled midpoint | 0.983±0.033 | 1.000±0.000 | 0.992±0.017 |  |
| new_identities | fraction | product: fitted | 0.967±0.067 | 1.000±0.000 | 0.983±0.033 | 0.307±0.190 (— / 0.307±0.190) |
| new_identities | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | amount | product: fitted | 0.936±0.028 | 1.000±0.000 | 0.968±0.014 | 0.204±0.061 (— / 0.204±0.061) |
| new_identities | amount | comparison: pooled midpoint | 0.915±0.025 | 1.000±0.000 | 0.957±0.012 |  |
| new_identities | unit | product: fitted | 0.977±0.016 | 1.000±0.000 | 0.989±0.008 | 0.035±0.023 (— / 0.035±0.023) |
| new_identities | unit | comparison: pooled midpoint | 0.950±0.030 | 1.000±0.000 | 0.975±0.015 |  |
| new_identities | direction | product: fitted | 0.955±0.041 | 1.000±0.000 | 0.977±0.020 | 0.106±0.099 (— / 0.106±0.099) |
| new_identities | direction | comparison: pooled midpoint | 0.945±0.034 | 1.000±0.000 | 0.973±0.017 |  |
| new_identities | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | source | product: fitted | 0.438±0.101 | 0.995±0.007 | 0.716±0.053 | 0.904±0.094 (0.889±0.157 / 0.918±0.081) |
| new_identities | source | comparison: pooled midpoint | 0.479±0.071 | 0.996±0.004 | 0.737±0.035 |  |
| new_identities | target | product: fitted | 0.603±0.093 | 0.989±0.005 | 0.796±0.048 | 0.871±0.035 (1.000±0.000 / 0.840±0.054) |
| new_identities | target | comparison: pooled midpoint | 0.619±0.133 | 0.996±0.002 | 0.808±0.067 |  |
| new_identities | quantity | product: fitted | — | 0.992±0.002 | — | 0.667±0.211 (0.667±0.211 / —) |
| new_identities | quantity | comparison: pooled midpoint | — | 0.990±0.003 | — |  |
| train (sample) | object | product: fitted | 0.886±0.007 | 0.650±0.026 | 0.768±0.012 | 0.046±0.014 (0.082±0.067 / 0.045±0.014) |
| train (sample) | color | product: fitted | 0.862±0.031 | 0.980±0.009 | 0.921±0.016 | 0.523±0.126 (0.971±0.057 / 0.376±0.108) |
| train (sample) | size | product: fitted | 0.947±0.043 | 0.987±0.005 | 0.967±0.024 | 0.286±0.092 (0.550±0.400 / 0.227±0.049) |
| train (sample) | style | product: fitted | 0.850±0.300 | 0.950±0.023 | 0.900±0.140 | 0.968±0.041 (0.988±0.025 / 0.900±0.122) |
| train (sample) | text | product: fitted | 0.922±0.036 | 0.987±0.006 | 0.955±0.016 | 0.152±0.046 (0.367±0.194 / 0.136±0.054) |
| train (sample) | relation | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.091±0.030 (— / 0.091±0.030) |
| train (sample) | landmark | product: fitted | 0.909±0.041 | 0.976±0.012 | 0.943±0.019 | 0.325±0.052 (1.000±0.000 / 0.176±0.065) |
| train (sample) | region | product: fitted | 0.980±0.024 | 1.000±0.000 | 0.990±0.012 | 0.200±0.107 (— / 0.200±0.107) |
| train (sample) | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.082±0.049 (— / 0.082±0.049) |
| train (sample) | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.436±0.167 (— / 0.436±0.167) |
| train (sample) | amount | product: fitted | 0.960±0.058 | 1.000±0.000 | 0.980±0.029 | 0.088±0.049 (— / 0.088±0.049) |
| train (sample) | unit | product: fitted | 0.971±0.038 | 1.000±0.000 | 0.985±0.019 | 0.040±0.020 (— / 0.040±0.020) |
| train (sample) | direction | product: fitted | 0.960±0.024 | 1.000±0.000 | 0.980±0.012 | 0.092±0.032 (— / 0.092±0.032) |
| train (sample) | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.025±0.050 (— / 0.025±0.050) |
| train (sample) | layout | product: fitted | 0.978±0.044 | 1.000±0.000 | 0.989±0.022 | 0.050±0.100 (— / 0.050±0.100) |
| train (sample) | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.147±0.147 (— / 0.147±0.147) |
| train (sample) | source | product: fitted | 0.368±0.070 | 0.997±0.002 | 0.682±0.034 | 0.574±0.086 (0.333±0.471 / 0.588±0.081) |
| train (sample) | target | product: fitted | 0.857±0.091 | 0.997±0.004 | 0.927±0.044 | 0.526±0.086 (1.000±0.000 / 0.511±0.096) |
| train (sample) | quantity | product: fitted | 0.971±0.057 | 1.000±0.000 | 0.986±0.029 | 0.057±0.070 (— / 0.057±0.070) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
