# REPORT — world `diagram_multi`, legend sha256:1a43ffc61bd5… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
7000 annotated sentences from 6 files; provenance: {'generator': 7000}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/5000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 194 sentences
- calibration_heldout_formulations_en: 222 sentences
- heldout_formulations: 206 sentences
- heldout_formulations_en: 178 sentences
- heldout_sentences: 476 sentences
- mixed: 400 sentences
- new_identities: 400 sentences
- new_identities_en: 400 sentences
- train: 4524 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['250', '35', '45', '90', 'analytics', 'broker', 'crawler', 'dashboard', 'gamma_ray', 'indexer', 'ingest', 'irina', 'loyalty', 'notifications', 'payroll', 'recommendations', 'registry', 'returns', 'routing', 'theta', 'tracking', 'vault', 'victor', 'zeta']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
54289 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2, 3, 4], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit eccbf84. Memory curve: runs/5000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 0.542 [rule: fit; pooled midpoint 0.762 (comparison)] (present 1.049, n 761 / absent 0.476, n 55)
- attr_presence:object: threshold 0.424 [rule: fit; pooled midpoint 0.543 (comparison)] (present 0.854, n 317 / absent 0.233, n 444)
- det_presence:object: threshold 0.431 [rule: fit; pooled midpoint 0.636 (comparison)] (present 1.131, n 302 / absent 0.141, n 459)
- presence:color: threshold 0.212 [rule: fit; pooled midpoint 0.320 (comparison)] (present 0.576, n 17 / absent 0.063, n 799)
- presence:size: threshold 0.228 [rule: fit; pooled midpoint 0.298 (comparison)] (present 0.514, n 74 / absent 0.082, n 742)
- presence:style: threshold 0.097 [rule: fit; pooled midpoint 0.088 (comparison)] (present 0.143, n 28 / absent 0.032, n 788)
- presence:text: threshold 0.155 [rule: fit; pooled midpoint 0.281 (comparison)] (present 0.495, n 104 / absent 0.068, n 712)
- presence:relation: threshold 0.116 [rule: fit; pooled midpoint 0.266 (comparison)] (present 0.512, n 103 / absent 0.020, n 713)
- presence:landmark: threshold 0.287 [rule: fit; pooled midpoint 0.363 (comparison)] (present 0.629, n 103 / absent 0.096, n 713)
- presence:region: threshold 0.262 [rule: fit; pooled midpoint 0.493 (comparison)] (present 0.908, n 59 / absent 0.077, n 757)
- presence:anchor: threshold 0.373 [rule: fit; pooled midpoint 0.389 (comparison)] (present 0.762, n 42 / absent 0.016, n 774)
- presence:fraction: threshold 0.247 [rule: fit; pooled midpoint 0.299 (comparison)] (present 0.550, n 32 / absent 0.047, n 784)
- presence:amount: threshold 0.287 [rule: fit; pooled midpoint 0.297 (comparison)] (present 0.591, n 46 / absent 0.004, n 770)
- presence:unit: threshold 0.314 [rule: fit; pooled midpoint 0.363 (comparison)] (present 0.665, n 46 / absent 0.060, n 770)
- presence:direction: threshold 0.155 [rule: fit; pooled midpoint 0.274 (comparison)] (present 0.520, n 39 / absent 0.027, n 777)
- presence:axis: threshold 0.276 [rule: fit; pooled midpoint 0.331 (comparison)] (present 0.633, n 17 / absent 0.029, n 799)
- presence:layout: threshold 0.469 [rule: fit; pooled midpoint 0.495 (comparison)] (present 0.987, n 12 / absent 0.003, n 804)
- presence:pairing: threshold 0.196 [rule: fit; pooled midpoint 0.235 (comparison)] (present 0.467, n 23 / absent 0.004, n 793)
- presence:source: threshold 0.262 [rule: fit; pooled midpoint 0.350 (comparison)] (present 0.663, n 111 / absent 0.037, n 705)
- presence:target: threshold 0.321 [rule: fit; pooled midpoint 0.416 (comparison)] (present 0.757, n 88 / absent 0.076, n 728)
- presence:quantity: threshold 0.077 [rule: fit; pooled midpoint 0.082 (comparison)] (present 0.164, n 31 / absent -0.000, n 785)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.005, color 0.083, size 0.143, style 0.200, text 0.013, relation 0.167, landmark 0.006, region 0.111, anchor 0.250, fraction 0.333, amount 0.043, unit 0.500, direction 0.167, axis 0.500, layout 0.143, pairing 0.500, source 0.006, target 0.006, quantity 0.043, predicate 0.019

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 206 of 206)
| axis | accuracy |
|---|---|
| FULL | 0.510±0.041 |
| FULL [depth given] | 0.510±0.041 |
| FULL [depth and negation given] | 0.510±0.041 |
| FULL [presence not decided] | 0.419±0.008 |
| FULL [pooled midpoint (comparison)] | 0.413±0.015 |
| presence object: present read present | 0.928±0.032 |
| presence object: share of 'present' readings that abstain | 0.130±0.031 |
| presence object: share of true 'present' readings that abstain | 0.130±0.031 |
| presence color: absent read absent | 0.961±0.037 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.087±0.048 |
| presence size: share of true 'present' readings that abstain | 0.071±0.044 |
| presence style: absent read absent | 0.956±0.012 |
| presence text: absent read absent | 0.989±0.003 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.995±0.005 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 0.999±0.003 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.999±0.003 |
| presence target: absent read absent | 0.997±0.006 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.830±0.053 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.830±0.053 |
| event type (synonym table) | 0.830±0.053 |
| role object | 0.649±0.065 |
| head object | 0.707±0.074 |
| lexical order head object | 0.039±0.000 |
| lexical bag head object | 0.126±0.000 |
| occupancy: known filler | 0.773±0.052 |
| role color | 0.966±0.034 |
| head color | 0.966±0.034 |
| lexical order head color | 0.995±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 0.993±0.002 |
| role size | 0.970±0.002 |
| head size | 0.970±0.002 |
| lexical order head size | 0.917±0.000 |
| lexical bag head size | 0.917±0.000 |
| role style | 0.951±0.013 |
| head style | 0.951±0.013 |
| lexical order head style | 0.942±0.000 |
| lexical bag head style | 0.942±0.000 |
| role text | 0.963±0.007 |
| head text | 0.963±0.007 |
| lexical order head text | 0.898±0.000 |
| lexical bag head text | 0.898±0.000 |
| role relation | 0.982±0.006 |
| head relation | 0.982±0.006 |
| lexical order head relation | 0.869±0.000 |
| lexical bag head relation | 0.869±0.000 |
| role landmark | 0.945±0.005 |
| head landmark | 0.968±0.005 |
| lexical order head landmark | 0.869±0.000 |
| lexical bag head landmark | 0.869±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.937±0.000 |
| lexical bag head region | 0.937±0.000 |
| role anchor | 0.982±0.012 |
| head anchor | 0.982±0.012 |
| lexical order head anchor | 0.932±0.000 |
| lexical bag head anchor | 0.932±0.000 |
| role fraction | 0.982±0.012 |
| head fraction | 0.982±0.012 |
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
| role layout | 0.999±0.002 |
| head layout | 0.999±0.002 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 0.985±0.000 |
| lexical bag head pairing | 0.985±0.000 |
| role source | 0.866±0.009 |
| head source | 0.883±0.011 |
| lexical order head source | 0.835±0.000 |
| lexical bag head source | 0.835±0.000 |
| role target | 0.929±0.005 |
| head target | 0.962±0.004 |
| lexical order head target | 0.850±0.000 |
| lexical bag head target | 0.850±0.000 |
| role quantity | 0.968±0.014 |
| head quantity | 0.968±0.014 |
| lexical order head quantity | 0.893±0.000 |
| lexical bag head quantity | 0.893±0.000 |
| heads FULL (model) | 0.587±0.046 |
| heads FULL (lexical order baseline) | 0.019±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.044±0.000 |
| role object [presence not decided] | 0.757±0.009 |
| role color [presence not decided] | 0.770±0.002 |
| role size [presence not decided] | 0.854±0.000 |
| role style [presence not decided] | 0.893±0.000 |
| role text [presence not decided] | 0.988±0.005 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.920±0.011 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 1.000±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 0.988±0.002 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.863±0.008 |
| role target [presence not decided] | 0.931±0.005 |
| role quantity [presence not decided] | 1.000±0.000 |
| heads FULL (model) [presence not decided] | 0.473±0.007 |
| role object [pooled midpoint (comparison)] | 0.556±0.011 |
| role color [pooled midpoint (comparison)] | 0.997±0.004 |
| role size [pooled midpoint (comparison)] | 0.964±0.004 |
| role style [pooled midpoint (comparison)] | 0.946±0.006 |
| role text [pooled midpoint (comparison)] | 0.947±0.007 |
| role relation [pooled midpoint (comparison)] | 0.964±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.940±0.002 |
| role region [pooled midpoint (comparison)] | 0.978±0.005 |
| role anchor [pooled midpoint (comparison)] | 0.967±0.004 |
| role fraction [pooled midpoint (comparison)] | 0.968±0.002 |
| role amount [pooled midpoint (comparison)] | 1.000±0.000 |
| role unit [pooled midpoint (comparison)] | 0.999±0.002 |
| role direction [pooled midpoint (comparison)] | 1.000±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.866±0.010 |
| role target [pooled midpoint (comparison)] | 0.928±0.006 |
| role quantity [pooled midpoint (comparison)] | 0.957±0.006 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.483±0.016 |
| presence size: absent read absent | 0.960±0.004 |
| presence text: present read present | 0.854±0.053 |
| presence text: share of 'present' readings that abstain | 0.179±0.053 |
| presence text: share of true 'present' readings that abstain | 0.144±0.067 |
| presence object: present read present [pooled midpoint (comparison)] | 0.901±0.010 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.996±0.005 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.957±0.002 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.950±0.007 |
| presence text: present read present [pooled midpoint (comparison)] | 0.779±0.058 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
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
| presence source: present read present | 0.523±0.141 |
| presence target: present read present | 0.930±0.029 |
| presence target: share of 'present' readings that abstain | 0.122±0.064 |
| presence target: share of true 'present' readings that abstain | 0.107±0.072 |
| determiner identity (outside FULL when the legend excludes it) | 0.777±0.023 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.990±0.004 |
| presence source: present read present [pooled midpoint (comparison)] | 0.518±0.141 |
| presence target: present read present [pooled midpoint (comparison)] | 0.951±0.031 |
| presence object: absent read absent | 1.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.883±0.106 |
| presence source: share of true 'present' readings that abstain | 0.882±0.105 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present | 0.983±0.033 |
| presence anchor: share of 'present' readings that abstain | 0.043±0.054 |
| presence anchor: share of true 'present' readings that abstain | 0.043±0.054 |
| presence fraction: present read present | 0.983±0.033 |
| presence fraction: share of 'present' readings that abstain | 0.036±0.045 |
| presence fraction: share of true 'present' readings that abstain | 0.036±0.045 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.946±0.066 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.975±0.050 |
| presence color: share of 'present' readings that abstain | 0.514±0.276 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: share of 'present' readings that abstain | 0.419±0.093 |
| presence style: share of FALSE 'present' readings that abstain | 0.795±0.062 |
| presence relation: present read present | 0.928±0.029 |
| presence relation: share of 'present' readings that abstain | 0.034±0.017 |
| presence relation: share of true 'present' readings that abstain | 0.034±0.017 |
| presence landmark: present read present | 0.850±0.042 |
| presence landmark: share of 'present' readings that abstain | 0.109±0.035 |
| presence landmark: share of true 'present' readings that abstain | 0.075±0.037 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.025±0.050 |
| presence amount: share of true 'present' readings that abstain | 0.025±0.050 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.025±0.050 |
| presence unit: share of true 'present' readings that abstain | 0.025±0.050 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.853±0.041 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.818±0.031 |
| presence amount: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.975±0.050 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.128±0.080 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.046±0.038 |
| presence region: share of true 'present' readings that abstain | 0.046±0.038 |
| presence region: present read present [pooled midpoint (comparison)] | 0.700±0.085 |
| presence quantity: present read present | 0.950±0.062 |
| presence quantity: share of 'present' readings that abstain | 0.201±0.143 |
| presence quantity: share of true 'present' readings that abstain | 0.201±0.143 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.943±0.083 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: share of FALSE 'present' readings that abstain | 0.133±0.125 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of true 'present' readings that abstain | 0.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 0.400±0.374 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.494±0.037; status {'abstain': 150, 'no-sense': 24, 'ok': 32}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.883 | 0.365 / 0.242 | 1.00 | 0.117 | 0.000 / 0.000 |
| role object | 0.687 | 0.196 / 0.000 | 0.75 | 0.146 | 0.086 / 0.167 |
| roles (pooled) | 0.704 | 0.153 / 0.000 | 0.71 | 0.101 | 0.092 / 0.195 |
| role size | 1.000 | 0.196 / 0.092 | 0.88 | 0.000 | 0.118 / 0.000 |
| role text | 0.810 | 0.136 / 0.000 | 0.62 | 0.000 | 0.190 / 0.190 |
| role source | 0.118 | 0.015 / 0.000 | 0.12 | 0.059 | 0.059 / 0.824 |
| role target | 0.516 | 0.083 / 0.000 | 0.71 | 0.258 | 0.065 / 0.226 |
| role pairing | 1.000 | 0.304 / 0.248 | 1.00 | 0.000 | 0.000 / 0.000 |
| role anchor | 0.786 | 0.125 / 0.004 | 0.79 | 0.071 | 0.071 / 0.143 |
| role fraction | 0.786 | 0.123 / 0.010 | 0.79 | 0.071 | 0.071 / 0.143 |
| role relation | 0.889 | 0.150 / 0.010 | 0.85 | 0.000 | 0.037 / 0.111 |
| role landmark | 0.593 | 0.114 / 0.000 | 0.74 | 0.185 | 0.037 / 0.222 |
| role amount | 1.000 | 0.204 / 0.155 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.245 / 0.170 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.833 | 0.062 / 0.001 | 0.67 | 0.000 | 0.167 / 0.167 |
| role region | 1.000 | 0.183 / 0.130 | 0.92 | 0.000 | 0.077 / 0.000 |
| role quantity | 0.909 | 0.066 / 0.005 | 0.55 | 0.000 | 0.364 / 0.091 |
| role color | 1.000 | 0.203 / 0.203 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.341 / 0.292 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.270 / 0.179 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_formulations — experiment candidates (n = 206 of 206)
| axis | accuracy |
|---|---|
| FULL | 0.279±0.018 |
| FULL [depth given] | 0.279±0.018 |
| FULL [depth and negation given] | 0.279±0.018 |
| FULL [presence not decided] | 0.000±0.000 |
| FULL [pooled midpoint (comparison)] | 0.307±0.010 |
| structure (depth, negation) | 0.818±0.057 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.818±0.057 |
| event type (synonym table) | 0.818±0.057 |
| role object | 0.632±0.061 |
| head object | 0.698±0.069 |
| lexical order head object | 0.039±0.000 |
| lexical bag head object | 0.126±0.000 |
| occupancy: known filler | 0.817±0.058 |
| role color | 0.953±0.056 |
| head color | 0.953±0.056 |
| lexical order head color | 0.995±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 0.967±0.003 |
| role size | 0.951±0.008 |
| head size | 0.951±0.008 |
| lexical order head size | 0.917±0.000 |
| lexical bag head size | 0.917±0.000 |
| role style | 0.859±0.047 |
| head style | 0.859±0.047 |
| lexical order head style | 0.942±0.000 |
| lexical bag head style | 0.942±0.000 |
| role text | 0.865±0.027 |
| head text | 0.865±0.027 |
| lexical order head text | 0.898±0.000 |
| lexical bag head text | 0.898±0.000 |
| role relation | 0.934±0.017 |
| head relation | 0.934±0.017 |
| lexical order head relation | 0.869±0.000 |
| lexical bag head relation | 0.869±0.000 |
| role landmark | 0.913±0.030 |
| head landmark | 0.936±0.032 |
| lexical order head landmark | 0.869±0.000 |
| lexical bag head landmark | 0.869±0.000 |
| role region | 0.954±0.022 |
| head region | 0.954±0.022 |
| lexical order head region | 0.937±0.000 |
| lexical bag head region | 0.937±0.000 |
| role anchor | 0.980±0.012 |
| head anchor | 0.980±0.012 |
| lexical order head anchor | 0.932±0.000 |
| lexical bag head anchor | 0.932±0.000 |
| role fraction | 0.979±0.013 |
| head fraction | 0.979±0.013 |
| lexical order head fraction | 0.932±0.000 |
| lexical bag head fraction | 0.932±0.000 |
| role amount | 0.999±0.002 |
| head amount | 0.999±0.002 |
| lexical order head amount | 0.961±0.000 |
| lexical bag head amount | 0.961±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.961±0.000 |
| lexical bag head unit | 0.961±0.000 |
| role direction | 0.979±0.011 |
| head direction | 0.979±0.011 |
| lexical order head direction | 0.990±0.000 |
| lexical bag head direction | 0.990±0.000 |
| role axis | 0.999±0.002 |
| head axis | 0.999±0.002 |
| lexical order head axis | 0.981±0.000 |
| lexical bag head axis | 0.981±0.000 |
| role layout | 0.998±0.004 |
| head layout | 0.998±0.004 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.986±0.007 |
| head pairing | 0.986±0.007 |
| lexical order head pairing | 0.985±0.000 |
| lexical bag head pairing | 0.985±0.000 |
| role source | 0.833±0.005 |
| head source | 0.837±0.007 |
| lexical order head source | 0.835±0.000 |
| lexical bag head source | 0.835±0.000 |
| role target | 0.929±0.009 |
| head target | 0.963±0.010 |
| lexical order head target | 0.850±0.000 |
| lexical bag head target | 0.850±0.000 |
| role quantity | 0.911±0.043 |
| head quantity | 0.911±0.043 |
| lexical order head quantity | 0.893±0.000 |
| lexical bag head quantity | 0.893±0.000 |
| heads FULL (model) | 0.317±0.025 |
| heads FULL (lexical order baseline) | 0.019±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.044±0.000 |
| role object [presence not decided] | 0.733±0.004 |
| role color [presence not decided] | 0.055±0.004 |
| role size [presence not decided] | 0.119±0.010 |
| role style [presence not decided] | 0.098±0.005 |
| role text [presence not decided] | 0.152±0.004 |
| role relation [presence not decided] | 0.182±0.004 |
| role landmark [presence not decided] | 0.138±0.005 |
| role region [presence not decided] | 0.114±0.004 |
| role anchor [presence not decided] | 0.117±0.000 |
| role fraction [presence not decided] | 0.117±0.000 |
| role amount [presence not decided] | 0.089±0.004 |
| role unit [presence not decided] | 0.089±0.004 |
| role direction [presence not decided] | 0.060±0.004 |
| role axis [presence not decided] | 0.070±0.004 |
| role layout [presence not decided] | 0.050±0.004 |
| role pairing [presence not decided] | 0.065±0.004 |
| role source [presence not decided] | 0.048±0.006 |
| role target [presence not decided] | 0.129±0.005 |
| role quantity [presence not decided] | 0.157±0.004 |
| heads FULL (model) [presence not decided] | 0.010±0.000 |
| role object [pooled midpoint (comparison)] | 0.545±0.015 |
| role color [pooled midpoint (comparison)] | 0.998±0.002 |
| role size [pooled midpoint (comparison)] | 0.960±0.006 |
| role style [pooled midpoint (comparison)] | 0.879±0.019 |
| role text [pooled midpoint (comparison)] | 0.908±0.008 |
| role relation [pooled midpoint (comparison)] | 0.959±0.009 |
| role landmark [pooled midpoint (comparison)] | 0.935±0.004 |
| role region [pooled midpoint (comparison)] | 0.978±0.005 |
| role anchor [pooled midpoint (comparison)] | 0.967±0.004 |
| role fraction [pooled midpoint (comparison)] | 0.968±0.002 |
| role amount [pooled midpoint (comparison)] | 0.999±0.002 |
| role unit [pooled midpoint (comparison)] | 0.999±0.002 |
| role direction [pooled midpoint (comparison)] | 0.998±0.002 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 0.989±0.004 |
| role source [pooled midpoint (comparison)] | 0.838±0.004 |
| role target [pooled midpoint (comparison)] | 0.934±0.005 |
| role quantity [pooled midpoint (comparison)] | 0.916±0.022 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.352±0.013 |
| presence object: present read present | 0.958±0.026 |
| presence object: share of 'present' readings that abstain | 0.166±0.022 |
| presence object: share of true 'present' readings that abstain | 0.164±0.025 |
| presence color: absent read absent | 0.947±0.062 |
| presence size: absent read absent | 0.943±0.011 |
| presence style: absent read absent | 0.837±0.061 |
| presence text: present read present | 0.854±0.053 |
| presence text: share of 'present' readings that abstain | 0.644±0.056 |
| presence text: share of true 'present' readings that abstain | 0.144±0.067 |
| presence relation: absent read absent | 0.933±0.027 |
| presence landmark: absent read absent | 0.952±0.048 |
| presence region: absent read absent | 0.939±0.031 |
| presence anchor: absent read absent | 0.999±0.003 |
| presence fraction: absent read absent | 0.997±0.005 |
| presence amount: absent read absent | 0.999±0.003 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 0.973±0.015 |
| presence axis: absent read absent | 0.999±0.003 |
| presence layout: absent read absent | 0.997±0.005 |
| presence pairing: absent read absent | 0.996±0.005 |
| presence source: absent read absent | 0.991±0.005 |
| presence target: absent read absent | 0.991±0.011 |
| presence quantity: absent read absent | 0.925±0.054 |
| presence object: present read present [pooled midpoint (comparison)] | 0.930±0.003 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.997±0.003 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.957±0.002 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.854±0.026 |
| presence text: present read present [pooled midpoint (comparison)] | 0.779±0.058 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.992±0.013 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.997±0.004 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.999±0.003 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.997±0.003 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.936±0.027 |
| presence text: absent read absent | 0.855±0.042 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.979±0.017 |
| presence target: share of 'present' readings that abstain | 0.359±0.046 |
| presence target: share of true 'present' readings that abstain | 0.332±0.050 |
| determiner identity (outside FULL when the legend excludes it) | 0.856±0.023 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.930±0.010 |
| presence source: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present | 0.983±0.033 |
| presence anchor: share of 'present' readings that abstain | 0.061±0.052 |
| presence anchor: share of true 'present' readings that abstain | 0.043±0.054 |
| presence fraction: present read present | 0.983±0.033 |
| presence fraction: share of 'present' readings that abstain | 0.077±0.067 |
| presence fraction: share of true 'present' readings that abstain | 0.043±0.054 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.946±0.066 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.975±0.050 |
| presence color: share of 'present' readings that abstain | 0.638±0.359 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence quantity: share of 'present' readings that abstain | 0.513±0.125 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.783±0.036 |
| presence style: share of FALSE 'present' readings that abstain | 0.962±0.025 |
| presence relation: present read present | 0.943±0.020 |
| presence relation: share of 'present' readings that abstain | 0.307±0.091 |
| presence relation: share of true 'present' readings that abstain | 0.034±0.017 |
| presence landmark: present read present | 0.921±0.056 |
| presence landmark: share of 'present' readings that abstain | 0.370±0.099 |
| presence landmark: share of true 'present' readings that abstain | 0.213±0.035 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.044±0.089 |
| presence amount: share of true 'present' readings that abstain | 0.025±0.050 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.025±0.050 |
| presence unit: share of true 'present' readings that abstain | 0.025±0.050 |
| presence direction: share of 'present' readings that abstain | 0.632±0.162 |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.875±0.032 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.902±0.033 |
| presence amount: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.975±0.050 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.214±0.221 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.439±0.128 |
| presence region: share of true 'present' readings that abstain | 0.077±0.049 |
| presence region: present read present [pooled midpoint (comparison)] | 0.700±0.085 |
| presence quantity: present read present | 0.950±0.062 |
| presence quantity: share of true 'present' readings that abstain | 0.201±0.143 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.943±0.083 |
| presence pairing: share of 'present' readings that abstain | 0.400±0.490 |
| presence pairing: share of FALSE 'present' readings that abstain | nan±nan |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.205±0.037 |
| presence size: share of true 'present' readings that abstain | 0.036±0.047 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: share of FALSE 'present' readings that abstain | 0.509±0.071 |
| presence region: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of true 'present' readings that abstain | 0.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 0.900±0.200 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.040±0.080 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.500±0.040; status {'no-sense': 27, 'abstain': 156, 'ok': 23}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.869 | 0.365 / 0.242 | 1.00 | 0.131 | 0.000 / 0.000 |
| role object | 0.677 | 0.168 / 0.006 | 0.73 | 0.131 | 0.076 / 0.192 |
| roles (pooled) | 0.684 | 0.128 / 0.001 | 0.68 | 0.092 | 0.096 / 0.224 |
| role size | 0.882 | 0.157 / 0.058 | 0.88 | 0.000 | 0.000 / 0.118 |
| role text | 0.810 | 0.110 / 0.000 | 0.62 | 0.000 | 0.190 / 0.190 |
| role source | 0.029 | 0.007 / 0.001 | 0.00 | 0.000 | 0.029 / 0.971 |
| role target | 0.548 | 0.063 / 0.008 | 0.58 | 0.194 | 0.161 / 0.258 |
| role pairing | 0.000 | 0.202 / 0.133 | 1.00 | 1.000 | 0.000 / 0.000 |
| role anchor | 0.786 | 0.123 / 0.004 | 0.79 | 0.071 | 0.071 / 0.143 |
| role fraction | 0.786 | 0.117 / 0.010 | 0.79 | 0.071 | 0.071 / 0.143 |
| role relation | 0.889 | 0.114 / 0.010 | 0.85 | 0.000 | 0.037 / 0.111 |
| role landmark | 0.593 | 0.079 / 0.000 | 0.67 | 0.185 | 0.111 / 0.222 |
| role amount | 1.000 | 0.164 / 0.106 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.249 / 0.170 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.833 | 0.049 / 0.001 | 0.50 | 0.000 | 0.333 / 0.167 |
| role region | 1.000 | 0.142 / 0.102 | 0.92 | 0.000 | 0.077 / 0.000 |
| role quantity | 0.909 | 0.066 / 0.005 | 0.55 | 0.000 | 0.364 / 0.091 |
| role color | 1.000 | 0.107 / 0.107 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.282 / 0.236 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.234 / 0.160 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_formulations_en — catalog candidates (n = 178 of 178)
| axis | accuracy |
|---|---|
| FULL | 0.592±0.014 |
| FULL [depth given] | 0.592±0.014 |
| FULL [depth and negation given] | 0.592±0.014 |
| FULL [presence not decided] | 0.383±0.007 |
| FULL [pooled midpoint (comparison)] | 0.535±0.020 |
| structure (depth, negation) | 0.807±0.025 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.807±0.025 |
| event type (synonym table) | 0.807±0.025 |
| role object | 0.664±0.022 |
| head object | 0.707±0.024 |
| lexical order head object | 0.028±0.000 |
| lexical bag head object | 0.944±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.778±0.038 |
| occupancy: known filler | 0.828±0.027 |
| role color | 0.990±0.015 |
| head color | 0.990±0.015 |
| lexical order head color | 1.000±0.000 |
| lexical bag head color | 0.994±0.000 |
| occupancy: not given | 0.996±0.001 |
| role size | 0.978±0.013 |
| head size | 0.978±0.013 |
| lexical order head size | 0.933±0.000 |
| lexical bag head size | 0.961±0.000 |
| role style | 0.973±0.013 |
| head style | 0.973±0.013 |
| lexical order head style | 0.966±0.000 |
| lexical bag head style | 0.966±0.000 |
| role text | 0.953±0.010 |
| head text | 0.953±0.010 |
| lexical order head text | 0.865±0.000 |
| lexical bag head text | 0.882±0.000 |
| role relation | 0.992±0.004 |
| head relation | 0.992±0.004 |
| lexical order head relation | 0.882±0.000 |
| lexical bag head relation | 0.882±0.000 |
| role landmark | 0.957±0.009 |
| head landmark | 0.969±0.009 |
| lexical order head landmark | 0.882±0.000 |
| lexical bag head landmark | 0.860±0.000 |
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
| role direction | 0.994±0.000 |
| head direction | 0.994±0.000 |
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
| role pairing | 0.994±0.000 |
| head pairing | 0.994±0.000 |
| lexical order head pairing | 0.994±0.000 |
| lexical bag head pairing | 0.994±0.000 |
| role source | 0.913±0.013 |
| head source | 0.915±0.014 |
| lexical order head source | 0.831±0.000 |
| lexical bag head source | 0.831±0.000 |
| role target | 0.943±0.010 |
| head target | 0.961±0.012 |
| lexical order head target | 0.837±0.000 |
| lexical bag head target | 0.837±0.000 |
| role quantity | 0.966±0.007 |
| head quantity | 0.966±0.007 |
| lexical order head quantity | 0.910±0.000 |
| lexical bag head quantity | 0.910±0.000 |
| heads FULL (model) | 0.633±0.015 |
| heads FULL (lexical order baseline) | 0.017±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.309±0.000 |
| role object [presence not decided] | 0.797±0.015 |
| role color [presence not decided] | 0.736±0.000 |
| role size [presence not decided] | 0.882±0.000 |
| role style [presence not decided] | 0.899±0.000 |
| role text [presence not decided] | 0.967±0.010 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.872±0.023 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 1.000±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 1.000±0.000 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.866±0.022 |
| role target [presence not decided] | 0.919±0.014 |
| role quantity [presence not decided] | 0.994±0.000 |
| heads FULL (model) [presence not decided] | 0.399±0.009 |
| role object [pooled midpoint (comparison)] | 0.610±0.012 |
| role color [pooled midpoint (comparison)] | 0.999±0.002 |
| role size [pooled midpoint (comparison)] | 0.980±0.008 |
| role style [pooled midpoint (comparison)] | 0.972±0.012 |
| role text [pooled midpoint (comparison)] | 0.930±0.006 |
| role relation [pooled midpoint (comparison)] | 0.976±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.947±0.009 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 0.999±0.002 |
| role fraction [pooled midpoint (comparison)] | 0.999±0.002 |
| role amount [pooled midpoint (comparison)] | 0.998±0.003 |
| role unit [pooled midpoint (comparison)] | 0.999±0.002 |
| role direction [pooled midpoint (comparison)] | 0.994±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 0.994±0.000 |
| role source [pooled midpoint (comparison)] | 0.907±0.008 |
| role target [pooled midpoint (comparison)] | 0.938±0.008 |
| role quantity [pooled midpoint (comparison)] | 0.957±0.003 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.575±0.019 |
| presence object: absent read absent | 1.000±0.000 |
| presence color: absent read absent | 0.988±0.018 |
| presence size: absent read absent | 0.976±0.011 |
| presence style: absent read absent | 0.984±0.018 |
| presence text: absent read absent | 0.977±0.008 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.997±0.004 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.997±0.004 |
| presence target: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.994±0.006 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.982±0.016 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.970±0.004 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: present read present | 0.957±0.009 |
| presence object: share of 'present' readings that abstain | 0.188±0.040 |
| presence object: share of true 'present' readings that abstain | 0.188±0.040 |
| presence relation: present read present | 0.961±0.036 |
| presence relation: share of 'present' readings that abstain | 0.031±0.042 |
| presence relation: share of true 'present' readings that abstain | 0.031±0.042 |
| presence landmark: present read present | 0.921±0.051 |
| presence landmark: share of 'present' readings that abstain | 0.442±0.209 |
| presence landmark: share of true 'present' readings that abstain | 0.433±0.205 |
| presence direction: absent read absent | 1.000±0.000 |
| presence object: present read present [pooled midpoint (comparison)] | 0.944±0.008 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.866±0.039 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.866±0.026 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present | 0.990±0.019 |
| presence text: share of 'present' readings that abstain | 0.152±0.025 |
| presence text: share of true 'present' readings that abstain | 0.054±0.032 |
| presence source: present read present | 0.992±0.015 |
| presence source: share of 'present' readings that abstain | 0.888±0.069 |
| presence source: share of true 'present' readings that abstain | 0.894±0.078 |
| presence target: present read present | 0.972±0.026 |
| presence target: share of 'present' readings that abstain | 0.694±0.067 |
| presence target: share of true 'present' readings that abstain | 0.694±0.067 |
| presence source: present read present [pooled midpoint (comparison)] | 0.992±0.015 |
| presence target: present read present [pooled midpoint (comparison)] | 0.962±0.034 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.177±0.095 |
| presence quantity: share of true 'present' readings that abstain | 0.177±0.095 |
| presence quantity: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.987±0.027 |
| presence size: share of 'present' readings that abstain | 0.317±0.058 |
| presence size: share of FALSE 'present' readings that abstain | 1.000±0.000 |
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
| presence size: present read present | 0.948±0.042 |
| presence size: share of true 'present' readings that abstain | 0.123±0.068 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.040±0.080 |
| presence amount: share of true 'present' readings that abstain | 0.040±0.080 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.040±0.080 |
| presence unit: share of true 'present' readings that abstain | 0.040±0.080 |
| presence size: present read present [pooled midpoint (comparison)] | 0.820±0.083 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.920±0.098 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.960±0.080 |
| presence color: share of 'present' readings that abstain | nan±nan |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: present read present | 0.680±0.160 |
| presence style: share of 'present' readings that abstain | 0.523±0.280 |
| presence style: share of true 'present' readings that abstain | 0.367±0.194 |
| presence style: present read present [pooled midpoint (comparison)] | 0.680±0.098 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence text: share of FALSE 'present' readings that abstain | 0.817±0.153 |

residual mean 0.449±0.017; status {'no-sense': 32, 'abstain': 132, 'ok': 14}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.820 | 0.350 / 0.228 | 1.00 | 0.180 | 0.000 / 0.000 |
| role object | 0.659 | 0.172 / 0.000 | 0.70 | 0.110 | 0.069 / 0.231 |
| roles (pooled) | 0.700 | 0.138 / 0.000 | 0.64 | 0.077 | 0.135 / 0.223 |
| role direction | 0.667 | 0.244 / 0.097 | 1.00 | 0.333 | 0.000 / 0.000 |
| role relation | 0.905 | 0.177 / 0.074 | 0.90 | 0.000 | 0.000 / 0.095 |
| role landmark | 0.619 | 0.041 / 0.000 | 0.33 | 0.048 | 0.333 / 0.333 |
| role text | 0.792 | 0.171 / 0.054 | 0.92 | 0.125 | 0.000 / 0.083 |
| role source | 0.500 | 0.015 / -0.003 | 0.00 | 0.000 | 0.500 / 0.500 |
| role target | 0.621 | 0.031 / 0.000 | 0.21 | 0.034 | 0.448 / 0.345 |
| role size | 0.833 | 0.131 / 0.000 | 0.75 | 0.000 | 0.083 / 0.167 |
| role quantity | 0.688 | 0.103 / 0.039 | 0.75 | 0.250 | 0.188 / 0.062 |
| role anchor | 1.000 | 0.221 / 0.192 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.173 / 0.128 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.261 / 0.203 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 1.000 | 0.111 / 0.095 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.131 / 0.077 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 0.000 | 0.035 / 0.035 | 0.00 | 0.000 | 0.000 / 1.000 |
| role style | 0.333 | 0.026 / 0.000 | 0.33 | 0.000 | 0.000 / 0.667 |

### heldout_formulations_en — experiment candidates (n = 178 of 178)
| axis | accuracy |
|---|---|
| FULL | 0.304±0.020 |
| FULL [depth given] | 0.304±0.020 |
| FULL [depth and negation given] | 0.304±0.020 |
| FULL [presence not decided] | 0.000±0.000 |
| FULL [pooled midpoint (comparison)] | 0.382±0.036 |
| structure (depth, negation) | 0.781±0.027 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.781±0.027 |
| event type (synonym table) | 0.781±0.027 |
| role object | 0.628±0.033 |
| head object | 0.669±0.032 |
| lexical order head object | 0.028±0.000 |
| lexical bag head object | 0.944±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.733±0.038 |
| occupancy: known filler | 0.803±0.027 |
| role color | 0.975±0.034 |
| head color | 0.975±0.034 |
| lexical order head color | 1.000±0.000 |
| lexical bag head color | 0.994±0.000 |
| occupancy: not given | 0.969±0.003 |
| role size | 0.949±0.016 |
| head size | 0.949±0.016 |
| lexical order head size | 0.933±0.000 |
| lexical bag head size | 0.961±0.000 |
| role style | 0.883±0.049 |
| head style | 0.883±0.049 |
| lexical order head style | 0.966±0.000 |
| lexical bag head style | 0.966±0.000 |
| role text | 0.843±0.046 |
| head text | 0.843±0.046 |
| lexical order head text | 0.865±0.000 |
| lexical bag head text | 0.882±0.000 |
| role relation | 0.948±0.024 |
| head relation | 0.948±0.024 |
| lexical order head relation | 0.882±0.000 |
| lexical bag head relation | 0.882±0.000 |
| role landmark | 0.926±0.011 |
| head landmark | 0.933±0.014 |
| lexical order head landmark | 0.882±0.000 |
| lexical bag head landmark | 0.860±0.000 |
| role region | 0.997±0.004 |
| head region | 0.997±0.004 |
| lexical order head region | 0.927±0.000 |
| lexical bag head region | 0.927±0.000 |
| role anchor | 0.984±0.015 |
| head anchor | 0.984±0.015 |
| lexical order head anchor | 0.949±0.000 |
| lexical bag head anchor | 0.972±0.000 |
| role fraction | 0.996±0.004 |
| head fraction | 0.996±0.004 |
| lexical order head fraction | 0.949±0.000 |
| lexical bag head fraction | 0.949±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.972±0.000 |
| lexical bag head amount | 0.972±0.000 |
| role unit | 0.998±0.003 |
| head unit | 0.998±0.003 |
| lexical order head unit | 0.972±0.000 |
| lexical bag head unit | 0.972±0.000 |
| role direction | 0.949±0.021 |
| head direction | 0.949±0.021 |
| lexical order head direction | 0.983±0.000 |
| lexical bag head direction | 0.983±0.000 |
| role axis | 0.994±0.005 |
| head axis | 0.994±0.005 |
| lexical order head axis | 1.000±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.992±0.003 |
| head pairing | 0.992±0.003 |
| lexical order head pairing | 0.994±0.000 |
| lexical bag head pairing | 0.994±0.000 |
| role source | 0.815±0.009 |
| head source | 0.815±0.009 |
| lexical order head source | 0.831±0.000 |
| lexical bag head source | 0.831±0.000 |
| role target | 0.885±0.019 |
| head target | 0.888±0.020 |
| lexical order head target | 0.837±0.000 |
| lexical bag head target | 0.837±0.000 |
| role quantity | 0.921±0.011 |
| head quantity | 0.921±0.011 |
| lexical order head quantity | 0.910±0.000 |
| lexical bag head quantity | 0.910±0.000 |
| heads FULL (model) | 0.317±0.019 |
| heads FULL (lexical order baseline) | 0.017±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.309±0.000 |
| role object [presence not decided] | 0.746±0.011 |
| role color [presence not decided] | 0.082±0.008 |
| role size [presence not decided] | 0.149±0.008 |
| role style [presence not decided] | 0.112±0.007 |
| role text [presence not decided] | 0.183±0.008 |
| role relation [presence not decided] | 0.200±0.008 |
| role landmark [presence not decided] | 0.152±0.010 |
| role region [presence not decided] | 0.155±0.008 |
| role anchor [presence not decided] | 0.133±0.008 |
| role fraction [presence not decided] | 0.131±0.009 |
| role amount [presence not decided] | 0.110±0.008 |
| role unit [presence not decided] | 0.110±0.008 |
| role direction [presence not decided] | 0.099±0.008 |
| role axis [presence not decided] | 0.082±0.008 |
| role layout [presence not decided] | 0.082±0.008 |
| role pairing [presence not decided] | 0.088±0.008 |
| role source [presence not decided] | 0.082±0.006 |
| role target [presence not decided] | 0.126±0.010 |
| role quantity [presence not decided] | 0.161±0.008 |
| heads FULL (model) [presence not decided] | 0.000±0.000 |
| role object [pooled midpoint (comparison)] | 0.578±0.013 |
| role color [pooled midpoint (comparison)] | 1.000±0.000 |
| role size [pooled midpoint (comparison)] | 0.965±0.007 |
| role style [pooled midpoint (comparison)] | 0.896±0.047 |
| role text [pooled midpoint (comparison)] | 0.926±0.008 |
| role relation [pooled midpoint (comparison)] | 0.974±0.006 |
| role landmark [pooled midpoint (comparison)] | 0.927±0.014 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 0.999±0.002 |
| role fraction [pooled midpoint (comparison)] | 0.998±0.003 |
| role amount [pooled midpoint (comparison)] | 0.998±0.003 |
| role unit [pooled midpoint (comparison)] | 0.998±0.003 |
| role direction [pooled midpoint (comparison)] | 0.994±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 0.994±0.000 |
| role source [pooled midpoint (comparison)] | 0.843±0.009 |
| role target [pooled midpoint (comparison)] | 0.892±0.009 |
| role quantity [pooled midpoint (comparison)] | 0.924±0.013 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.399±0.038 |
| presence object: absent read absent | 1.000±0.000 |
| presence color: absent read absent | 0.970±0.041 |
| presence size: absent read absent | 0.936±0.016 |
| presence style: absent read absent | 0.864±0.068 |
| presence text: absent read absent | 0.814±0.066 |
| presence relation: absent read absent | 0.935±0.039 |
| presence landmark: absent read absent | 0.976±0.016 |
| presence region: absent read absent | 0.995±0.007 |
| presence anchor: absent read absent | 0.979±0.019 |
| presence fraction: absent read absent | 0.995±0.006 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 0.997±0.004 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.729±0.198 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: absent read absent | 0.993±0.006 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 0.997±0.004 |
| presence source: absent read absent | 0.955±0.015 |
| presence target: absent read absent | 0.988±0.016 |
| presence quantity: absent read absent | 0.938±0.021 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.971±0.010 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.872±0.069 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.961±0.013 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.996±0.004 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.998±0.004 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.998±0.004 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.950±0.015 |
| presence object: present read present | 0.963±0.009 |
| presence object: share of 'present' readings that abstain | 0.227±0.034 |
| presence object: share of true 'present' readings that abstain | 0.227±0.034 |
| presence text: share of 'present' readings that abstain | 0.556±0.095 |
| presence text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: present read present | 0.961±0.036 |
| presence relation: share of 'present' readings that abstain | 0.296±0.135 |
| presence relation: share of true 'present' readings that abstain | 0.051±0.046 |
| presence landmark: present read present | 0.951±0.032 |
| presence landmark: share of 'present' readings that abstain | 0.838±0.061 |
| presence landmark: share of true 'present' readings that abstain | 0.815±0.075 |
| presence direction: absent read absent | 0.941±0.028 |
| presence object: present read present [pooled midpoint (comparison)] | 0.949±0.008 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.896±0.053 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.894±0.030 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present | 0.990±0.019 |
| presence text: share of true 'present' readings that abstain | 0.054±0.032 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.968±0.029 |
| presence target: share of true 'present' readings that abstain | 0.967±0.030 |
| presence source: present read present [pooled midpoint (comparison)] | 0.991±0.018 |
| presence target: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.529±0.094 |
| presence quantity: share of true 'present' readings that abstain | 0.177±0.095 |
| presence quantity: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.987±0.027 |
| presence size: share of 'present' readings that abstain | 0.492±0.043 |
| presence size: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.199±0.173 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.119±0.112 |
| presence fraction: share of true 'present' readings that abstain | 0.067±0.089 |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.041±0.054 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: present read present | 0.948±0.042 |
| presence size: share of true 'present' readings that abstain | 0.123±0.068 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.080±0.098 |
| presence amount: share of true 'present' readings that abstain | 0.080±0.098 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.107±0.088 |
| presence unit: share of true 'present' readings that abstain | 0.040±0.080 |
| presence size: present read present [pooled midpoint (comparison)] | 0.820±0.083 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.960±0.080 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.960±0.080 |
| presence style: share of 'present' readings that abstain | 0.948±0.053 |
| presence style: share of FALSE 'present' readings that abstain | 0.989±0.022 |
| presence style: present read present | 0.680±0.160 |
| presence style: share of true 'present' readings that abstain | 0.717±0.267 |
| presence style: present read present [pooled midpoint (comparison)] | 0.680±0.098 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | nan±nan |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence fraction: share of FALSE 'present' readings that abstain | nan±nan |
| presence region: share of FALSE 'present' readings that abstain | nan±nan |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | nan±nan |
| presence pairing: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.488±0.019; status {'no-sense': 36, 'abstain': 132, 'ok': 10}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.798 | 0.350 / 0.228 | 1.00 | 0.202 | 0.000 / 0.000 |
| role object | 0.618 | 0.138 / 0.000 | 0.66 | 0.116 | 0.075 / 0.266 |
| roles (pooled) | 0.610 | 0.110 / 0.000 | 0.59 | 0.074 | 0.090 / 0.316 |
| role direction | 0.667 | 0.203 / 0.086 | 1.00 | 0.333 | 0.000 / 0.000 |
| role relation | 0.905 | 0.137 / 0.066 | 0.90 | 0.000 | 0.000 / 0.095 |
| role landmark | 0.429 | 0.023 / 0.001 | 0.19 | 0.000 | 0.238 / 0.571 |
| role text | 0.792 | 0.137 / 0.054 | 0.92 | 0.125 | 0.000 / 0.083 |
| role source | 0.000 | 0.009 / 0.001 | 0.00 | 0.000 | 0.000 / 1.000 |
| role target | 0.345 | 0.012 / 0.002 | 0.00 | 0.000 | 0.345 / 0.655 |
| role size | 0.833 | 0.109 / 0.000 | 0.75 | 0.000 | 0.083 / 0.167 |
| role quantity | 0.688 | 0.103 / 0.039 | 0.75 | 0.250 | 0.188 / 0.062 |
| role anchor | 1.000 | 0.184 / 0.165 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.133 / 0.086 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.198 / 0.150 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 1.000 | 0.105 / 0.077 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.128 / 0.077 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 0.000 | 0.035 / 0.035 | 0.00 | 0.000 | 0.000 / 1.000 |
| role style | 0.333 | 0.010 / 0.000 | 0.00 | 0.000 | 0.333 / 0.667 |

### heldout_sentences — catalog candidates (n = 476 of 476)
| axis | accuracy |
|---|---|
| FULL | 0.583±0.025 |
| FULL [depth given] | 0.583±0.025 |
| FULL [depth and negation given] | 0.583±0.025 |
| FULL [pooled midpoint (comparison)] | 0.498±0.013 |
| presence object: present read present | 0.951±0.030 |
| presence object: share of 'present' readings that abstain | 0.090±0.012 |
| presence object: share of true 'present' readings that abstain | 0.090±0.013 |
| presence color: absent read absent | 0.979±0.019 |
| presence size: absent read absent | 0.993±0.001 |
| presence style: absent read absent | 0.971±0.011 |
| presence text: absent read absent | 0.986±0.002 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.995±0.003 |
| presence region: present read present | 0.926±0.030 |
| presence region: share of 'present' readings that abstain | 0.040±0.031 |
| presence region: share of true 'present' readings that abstain | 0.040±0.031 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 0.999±0.001 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.998±0.001 |
| presence target: absent read absent | 0.999±0.001 |
| presence quantity: absent read absent | 0.999±0.001 |
| structure (depth, negation) | 0.836±0.035 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.836±0.035 |
| event type (synonym table) | 0.836±0.035 |
| role object | 0.701±0.041 |
| head object | 0.750±0.041 |
| lexical order head object | 0.082±0.000 |
| lexical bag head object | 0.473±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.759±0.072 |
| occupancy: known filler | 0.800±0.031 |
| role color | 0.976±0.013 |
| head color | 0.976±0.013 |
| lexical order head color | 0.964±0.000 |
| lexical bag head color | 0.966±0.000 |
| occupancy: not given | 0.994±0.001 |
| role size | 0.977±0.002 |
| head size | 0.977±0.002 |
| lexical order head size | 0.931±0.000 |
| lexical bag head size | 0.962±0.000 |
| role style | 0.974±0.009 |
| head style | 0.974±0.009 |
| lexical order head style | 0.994±0.000 |
| lexical bag head style | 0.996±0.000 |
| role text | 0.965±0.007 |
| head text | 0.965±0.007 |
| lexical order head text | 0.853±0.000 |
| lexical bag head text | 0.891±0.000 |
| role relation | 0.984±0.006 |
| head relation | 0.984±0.006 |
| lexical order head relation | 0.866±0.000 |
| lexical bag head relation | 0.893±0.000 |
| role landmark | 0.932±0.006 |
| head landmark | 0.963±0.007 |
| lexical order head landmark | 0.866±0.000 |
| lexical bag head landmark | 0.859±0.000 |
| role region | 0.987±0.002 |
| head region | 0.987±0.002 |
| lexical order head region | 0.924±0.000 |
| lexical bag head region | 0.929±0.000 |
| role anchor | 0.991±0.002 |
| head anchor | 0.991±0.002 |
| lexical order head anchor | 0.947±0.000 |
| lexical bag head anchor | 0.962±0.000 |
| role fraction | 0.999±0.001 |
| head fraction | 0.999±0.001 |
| lexical order head fraction | 0.983±0.000 |
| lexical bag head fraction | 0.987±0.000 |
| role amount | 0.997±0.002 |
| head amount | 0.997±0.002 |
| lexical order head amount | 0.912±0.000 |
| lexical bag head amount | 0.926±0.000 |
| role unit | 0.995±0.002 |
| head unit | 0.995±0.002 |
| lexical order head unit | 0.912±0.000 |
| lexical bag head unit | 0.926±0.000 |
| role direction | 0.989±0.002 |
| head direction | 0.989±0.002 |
| lexical order head direction | 0.935±0.000 |
| lexical bag head direction | 0.941±0.000 |
| role axis | 0.998±0.002 |
| head axis | 0.998±0.002 |
| lexical order head axis | 0.981±0.000 |
| lexical bag head axis | 0.987±0.000 |
| role layout | 0.988±0.002 |
| head layout | 0.988±0.002 |
| lexical order head layout | 0.947±0.000 |
| lexical bag head layout | 0.950±0.000 |
| role pairing | 0.993±0.003 |
| head pairing | 0.993±0.003 |
| lexical order head pairing | 0.964±0.000 |
| lexical bag head pairing | 0.966±0.000 |
| role source | 0.900±0.006 |
| head source | 0.917±0.008 |
| lexical order head source | 0.870±0.000 |
| lexical bag head source | 0.882±0.000 |
| role target | 0.959±0.002 |
| head target | 0.970±0.004 |
| lexical order head target | 0.905±0.000 |
| lexical bag head target | 0.918±0.000 |
| role quantity | 0.993±0.001 |
| head quantity | 0.993±0.001 |
| lexical order head quantity | 0.987±0.000 |
| lexical bag head quantity | 0.994±0.000 |
| heads FULL (model) | 0.646±0.025 |
| heads FULL (lexical order baseline) | 0.006±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.208±0.000 |
| role object [pooled midpoint (comparison)] | 0.642±0.009 |
| role color [pooled midpoint (comparison)] | 0.986±0.003 |
| role size [pooled midpoint (comparison)] | 0.973±0.002 |
| role style [pooled midpoint (comparison)] | 0.976±0.008 |
| role text [pooled midpoint (comparison)] | 0.950±0.004 |
| role relation [pooled midpoint (comparison)] | 0.955±0.003 |
| role landmark [pooled midpoint (comparison)] | 0.925±0.004 |
| role region [pooled midpoint (comparison)] | 0.978±0.002 |
| role anchor [pooled midpoint (comparison)] | 0.987±0.001 |
| role fraction [pooled midpoint (comparison)] | 0.998±0.001 |
| role amount [pooled midpoint (comparison)] | 0.993±0.002 |
| role unit [pooled midpoint (comparison)] | 0.992±0.001 |
| role direction [pooled midpoint (comparison)] | 0.980±0.003 |
| role axis [pooled midpoint (comparison)] | 0.995±0.001 |
| role layout [pooled midpoint (comparison)] | 0.986±0.002 |
| role pairing [pooled midpoint (comparison)] | 0.988±0.001 |
| role source [pooled midpoint (comparison)] | 0.898±0.004 |
| role target [pooled midpoint (comparison)] | 0.952±0.002 |
| role quantity [pooled midpoint (comparison)] | 0.993±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.553±0.015 |
| presence object: present read present [pooled midpoint (comparison)] | 0.927±0.011 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.997±0.003 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.994±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.972±0.011 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.988±0.002 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence region: present read present [pooled midpoint (comparison)] | 0.836±0.035 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence object: absent read absent | 0.500±0.086 |
| presence object: share of FALSE 'present' readings that abstain | 0.091±0.069 |
| presence color: share of 'present' readings that abstain | 0.361±0.132 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence region: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.591±0.079 |
| presence target: present read present | 0.853±0.027 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.588±0.053 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.633±0.074 |
| presence target: present read present [pooled midpoint (comparison)] | 0.815±0.034 |
| presence source: share of 'present' readings that abstain | 0.794±0.021 |
| presence source: share of true 'present' readings that abstain | 0.789±0.023 |
| presence target: share of 'present' readings that abstain | 0.269±0.038 |
| presence target: share of true 'present' readings that abstain | 0.265±0.040 |
| presence size: present read present | 0.844±0.046 |
| presence size: share of 'present' readings that abstain | 0.063±0.040 |
| presence size: share of true 'present' readings that abstain | 0.047±0.029 |
| presence size: present read present [pooled midpoint (comparison)] | 0.793±0.027 |
| presence layout: present read present | 0.933±0.049 |
| presence layout: share of 'present' readings that abstain | 0.063±0.055 |
| presence layout: share of true 'present' readings that abstain | 0.054±0.061 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.876±0.049 |
| presence axis: present read present | 0.978±0.044 |
| presence axis: share of 'present' readings that abstain | 0.022±0.044 |
| presence axis: share of true 'present' readings that abstain | 0.022±0.044 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.896±0.052 |
| presence text: present read present | 0.981±0.018 |
| presence text: share of 'present' readings that abstain | 0.066±0.022 |
| presence text: share of true 'present' readings that abstain | 0.034±0.029 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.055±0.048 |
| presence pairing: share of true 'present' readings that abstain | 0.055±0.048 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present | 0.958±0.019 |
| presence relation: share of 'present' readings that abstain | 0.090±0.025 |
| presence relation: share of true 'present' readings that abstain | 0.090±0.025 |
| presence landmark: present read present | 0.861±0.056 |
| presence landmark: share of 'present' readings that abstain | 0.241±0.084 |
| presence landmark: share of true 'present' readings that abstain | 0.221±0.088 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.830±0.029 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.837±0.032 |
| presence text: present read present [pooled midpoint (comparison)] | 0.943±0.018 |
| presence anchor: present read present | 0.963±0.019 |
| presence anchor: share of 'present' readings that abstain | 0.029±0.024 |
| presence anchor: share of true 'present' readings that abstain | 0.029±0.024 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.950±0.002 |
| presence direction: present read present | 0.985±0.018 |
| presence direction: share of 'present' readings that abstain | 0.031±0.029 |
| presence direction: share of true 'present' readings that abstain | 0.031±0.029 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.877±0.046 |
| presence style: present read present | 0.800±0.245 |
| presence style: present read present [pooled midpoint (comparison)] | 0.800±0.245 |
| presence amount: present read present | 0.985±0.012 |
| presence amount: share of 'present' readings that abstain | 0.034±0.025 |
| presence amount: share of true 'present' readings that abstain | 0.034±0.025 |
| presence unit: present read present | 0.966±0.020 |
| presence unit: share of 'present' readings that abstain | 0.025±0.022 |
| presence unit: share of true 'present' readings that abstain | 0.025±0.022 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.970±0.018 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.956±0.024 |
| presence style: share of 'present' readings that abstain | 0.753±0.102 |
| presence style: share of FALSE 'present' readings that abstain | 0.835±0.040 |
| presence size: share of FALSE 'present' readings that abstain | 0.200±0.163 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.025±0.050 |
| presence fraction: share of true 'present' readings that abstain | 0.025±0.050 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.300±0.400 |
| presence color: present read present | 0.842±0.084 |
| presence color: share of true 'present' readings that abstain | 0.159±0.058 |
| presence color: present read present [pooled midpoint (comparison)] | 0.738±0.036 |
| presence text: share of FALSE 'present' readings that abstain | 0.453±0.174 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.250±0.129 |
| presence quantity: share of true 'present' readings that abstain | 0.200±0.163 |
| presence quantity: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.444±0.030; status {'abstain': 345, 'ok': 66, 'no-sense': 65}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.863 | 0.362 / 0.244 | 1.00 | 0.137 | 0.000 / 0.000 |
| role object | 0.751 | 0.208 / 0.000 | 0.79 | 0.103 | 0.064 / 0.146 |
| roles (pooled) | 0.741 | 0.170 / 0.000 | 0.75 | 0.078 | 0.065 / 0.181 |
| role region | 0.806 | 0.184 / 0.000 | 0.78 | 0.000 | 0.028 / 0.194 |
| role source | 0.210 | 0.013 / 0.000 | 0.10 | 0.081 | 0.194 / 0.710 |
| role target | 0.533 | 0.072 / 0.000 | 0.58 | 0.156 | 0.111 / 0.311 |
| role size | 0.758 | 0.124 / 0.000 | 0.73 | 0.000 | 0.030 / 0.242 |
| role layout | 0.720 | 0.182 / 0.000 | 0.72 | 0.120 | 0.120 / 0.160 |
| role axis | 1.000 | 0.246 / 0.065 | 0.89 | 0.000 | 0.111 / 0.000 |
| role pairing | 0.824 | 0.198 / 0.019 | 0.76 | 0.000 | 0.059 / 0.176 |
| role text | 0.871 | 0.204 / 0.084 | 0.96 | 0.086 | 0.000 / 0.043 |
| role direction | 0.871 | 0.212 / 0.054 | 0.90 | 0.032 | 0.000 / 0.097 |
| role relation | 0.953 | 0.166 / 0.062 | 0.92 | 0.016 | 0.047 / 0.031 |
| role landmark | 0.500 | 0.082 / 0.000 | 0.58 | 0.141 | 0.062 / 0.359 |
| role anchor | 0.800 | 0.165 / 0.000 | 0.80 | 0.040 | 0.040 / 0.160 |
| role style | 0.333 | 0.021 / 0.000 | 0.33 | 0.000 | 0.000 / 0.667 |
| role amount | 0.976 | 0.159 / 0.065 | 0.90 | 0.000 | 0.071 / 0.024 |
| role unit | 0.976 | 0.210 / 0.094 | 0.93 | 0.000 | 0.048 / 0.024 |
| role fraction | 0.875 | 0.204 / 0.143 | 1.00 | 0.125 | 0.000 / 0.000 |
| role color | 0.824 | 0.111 / 0.000 | 0.76 | 0.000 | 0.059 / 0.176 |
| role quantity | 0.500 | 0.087 / 0.023 | 0.67 | 0.333 | 0.167 / 0.167 |

### heldout_sentences — experiment candidates (n = 476 of 476)
| axis | accuracy |
|---|---|
| FULL | 0.327±0.037 |
| FULL [depth given] | 0.327±0.037 |
| FULL [depth and negation given] | 0.327±0.037 |
| FULL [pooled midpoint (comparison)] | 0.394±0.015 |
| presence object: present read present | 0.961±0.020 |
| presence object: share of 'present' readings that abstain | 0.110±0.011 |
| presence object: share of true 'present' readings that abstain | 0.108±0.011 |
| presence color: absent read absent | 0.962±0.041 |
| presence size: absent read absent | 0.977±0.009 |
| presence style: absent read absent | 0.855±0.047 |
| presence text: absent read absent | 0.840±0.072 |
| presence text: share of 'present' readings that abstain | 0.457±0.118 |
| presence text: share of FALSE 'present' readings that abstain | 0.964±0.015 |
| presence relation: absent read absent | 0.916±0.042 |
| presence landmark: absent read absent | 0.955±0.031 |
| presence region: present read present | 0.926±0.030 |
| presence region: share of 'present' readings that abstain | 0.205±0.069 |
| presence region: share of true 'present' readings that abstain | 0.066±0.058 |
| presence anchor: absent read absent | 0.993±0.008 |
| presence fraction: absent read absent | 0.981±0.008 |
| presence amount: absent read absent | 0.999±0.001 |
| presence unit: absent read absent | 0.999±0.001 |
| presence direction: absent read absent | 0.969±0.014 |
| presence axis: absent read absent | 0.996±0.005 |
| presence layout: absent read absent | 0.995±0.009 |
| presence pairing: absent read absent | 0.998±0.002 |
| presence source: absent read absent | 0.981±0.010 |
| presence target: absent read absent | 0.988±0.011 |
| presence quantity: absent read absent | 0.936±0.037 |
| structure (depth, negation) | 0.817±0.041 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.817±0.041 |
| event type (synonym table) | 0.817±0.041 |
| role object | 0.684±0.041 |
| head object | 0.745±0.045 |
| lexical order head object | 0.082±0.000 |
| lexical bag head object | 0.473±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.742±0.063 |
| occupancy: known filler | 0.809±0.040 |
| role color | 0.963±0.031 |
| head color | 0.963±0.031 |
| lexical order head color | 0.964±0.000 |
| lexical bag head color | 0.966±0.000 |
| occupancy: not given | 0.968±0.003 |
| role size | 0.965±0.006 |
| head size | 0.965±0.006 |
| lexical order head size | 0.931±0.000 |
| lexical bag head size | 0.962±0.000 |
| role style | 0.880±0.034 |
| head style | 0.880±0.034 |
| lexical order head style | 0.994±0.000 |
| lexical bag head style | 0.996±0.000 |
| role text | 0.864±0.047 |
| head text | 0.864±0.047 |
| lexical order head text | 0.853±0.000 |
| lexical bag head text | 0.891±0.000 |
| role relation | 0.923±0.026 |
| head relation | 0.923±0.026 |
| lexical order head relation | 0.866±0.000 |
| lexical bag head relation | 0.893±0.000 |
| role landmark | 0.900±0.019 |
| head landmark | 0.924±0.017 |
| lexical order head landmark | 0.866±0.000 |
| lexical bag head landmark | 0.859±0.000 |
| role region | 0.975±0.008 |
| head region | 0.975±0.008 |
| lexical order head region | 0.924±0.000 |
| lexical bag head region | 0.929±0.000 |
| role anchor | 0.985±0.006 |
| head anchor | 0.985±0.006 |
| lexical order head anchor | 0.947±0.000 |
| lexical bag head anchor | 0.962±0.000 |
| role fraction | 0.984±0.006 |
| head fraction | 0.984±0.006 |
| lexical order head fraction | 0.983±0.000 |
| lexical bag head fraction | 0.987±0.000 |
| role amount | 0.997±0.003 |
| head amount | 0.997±0.003 |
| lexical order head amount | 0.912±0.000 |
| lexical bag head amount | 0.926±0.000 |
| role unit | 0.995±0.002 |
| head unit | 0.995±0.002 |
| lexical order head unit | 0.912±0.000 |
| lexical bag head unit | 0.926±0.000 |
| role direction | 0.966±0.010 |
| head direction | 0.966±0.010 |
| lexical order head direction | 0.935±0.000 |
| lexical bag head direction | 0.941±0.000 |
| role axis | 0.995±0.004 |
| head axis | 0.995±0.004 |
| lexical order head axis | 0.981±0.000 |
| lexical bag head axis | 0.987±0.000 |
| role layout | 0.985±0.005 |
| head layout | 0.985±0.005 |
| lexical order head layout | 0.947±0.000 |
| lexical bag head layout | 0.950±0.000 |
| role pairing | 0.981±0.003 |
| head pairing | 0.981±0.003 |
| lexical order head pairing | 0.964±0.000 |
| lexical bag head pairing | 0.966±0.000 |
| role source | 0.861±0.008 |
| head source | 0.864±0.009 |
| lexical order head source | 0.870±0.000 |
| lexical bag head source | 0.882±0.000 |
| role target | 0.946±0.006 |
| head target | 0.955±0.006 |
| lexical order head target | 0.905±0.000 |
| lexical bag head target | 0.918±0.000 |
| role quantity | 0.940±0.034 |
| head quantity | 0.940±0.034 |
| lexical order head quantity | 0.987±0.000 |
| lexical bag head quantity | 0.994±0.000 |
| heads FULL (model) | 0.358±0.038 |
| heads FULL (lexical order baseline) | 0.006±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.208±0.000 |
| role object [pooled midpoint (comparison)] | 0.634±0.008 |
| role color [pooled midpoint (comparison)] | 0.984±0.003 |
| role size [pooled midpoint (comparison)] | 0.973±0.002 |
| role style [pooled midpoint (comparison)] | 0.899±0.025 |
| role text [pooled midpoint (comparison)] | 0.935±0.002 |
| role relation [pooled midpoint (comparison)] | 0.953±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.916±0.006 |
| role region [pooled midpoint (comparison)] | 0.977±0.002 |
| role anchor [pooled midpoint (comparison)] | 0.987±0.001 |
| role fraction [pooled midpoint (comparison)] | 0.990±0.003 |
| role amount [pooled midpoint (comparison)] | 0.993±0.002 |
| role unit [pooled midpoint (comparison)] | 0.992±0.001 |
| role direction [pooled midpoint (comparison)] | 0.979±0.002 |
| role axis [pooled midpoint (comparison)] | 0.995±0.001 |
| role layout [pooled midpoint (comparison)] | 0.986±0.002 |
| role pairing [pooled midpoint (comparison)] | 0.977±0.002 |
| role source [pooled midpoint (comparison)] | 0.873±0.002 |
| role target [pooled midpoint (comparison)] | 0.944±0.005 |
| role quantity [pooled midpoint (comparison)] | 0.954±0.011 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.426±0.016 |
| presence object: present read present [pooled midpoint (comparison)] | 0.943±0.010 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.995±0.003 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.994±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.867±0.035 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.966±0.009 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.997±0.002 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.995±0.003 |
| presence region: present read present [pooled midpoint (comparison)] | 0.836±0.035 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.990±0.005 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.946±0.015 |
| presence object: absent read absent | 0.391±0.098 |
| presence object: share of FALSE 'present' readings that abstain | 0.151±0.074 |
| presence color: share of 'present' readings that abstain | 0.532±0.202 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence region: absent read absent | 0.985±0.010 |
| presence source: present read present | 0.919±0.026 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.892±0.029 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.507±0.063 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.811±0.021 |
| presence target: present read present [pooled midpoint (comparison)] | 0.833±0.024 |
| presence target: share of 'present' readings that abstain | 0.502±0.051 |
| presence target: share of true 'present' readings that abstain | 0.449±0.028 |
| presence size: present read present | 0.844±0.046 |
| presence size: share of 'present' readings that abstain | 0.222±0.098 |
| presence size: share of true 'present' readings that abstain | 0.054±0.039 |
| presence size: present read present [pooled midpoint (comparison)] | 0.793±0.027 |
| presence layout: present read present | 0.933±0.049 |
| presence layout: share of 'present' readings that abstain | 0.128±0.096 |
| presence layout: share of true 'present' readings that abstain | 0.064±0.063 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.876±0.049 |
| presence axis: present read present | 0.978±0.044 |
| presence axis: share of 'present' readings that abstain | 0.129±0.100 |
| presence axis: share of true 'present' readings that abstain | 0.022±0.044 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.896±0.052 |
| presence text: present read present | 0.981±0.018 |
| presence text: share of true 'present' readings that abstain | 0.041±0.024 |
| presence relation: share of 'present' readings that abstain | 0.377±0.083 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.955±0.011 |
| presence style: share of FALSE 'present' readings that abstain | 0.977±0.013 |
| presence relation: present read present | 0.961±0.018 |
| presence relation: share of true 'present' readings that abstain | 0.087±0.031 |
| presence landmark: present read present | 0.914±0.038 |
| presence landmark: share of 'present' readings that abstain | 0.543±0.065 |
| presence landmark: share of true 'present' readings that abstain | 0.425±0.066 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.849±0.019 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.888±0.027 |
| presence quantity: share of 'present' readings that abstain | 0.894±0.042 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.119±0.112 |
| presence pairing: share of true 'present' readings that abstain | 0.056±0.070 |
| presence size: share of FALSE 'present' readings that abstain | 0.709±0.135 |
| presence text: present read present [pooled midpoint (comparison)] | 0.943±0.018 |
| presence anchor: present read present | 0.963±0.019 |
| presence anchor: share of 'present' readings that abstain | 0.159±0.075 |
| presence anchor: share of true 'present' readings that abstain | 0.059±0.038 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.950±0.002 |
| presence direction: present read present | 0.985±0.018 |
| presence direction: share of 'present' readings that abstain | 0.307±0.091 |
| presence direction: share of true 'present' readings that abstain | 0.031±0.029 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.877±0.046 |
| presence style: present read present | 0.800±0.245 |
| presence style: present read present [pooled midpoint (comparison)] | 0.800±0.245 |
| presence fraction: share of 'present' readings that abstain | 0.485±0.071 |
| presence fraction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence region: share of FALSE 'present' readings that abstain | nan±nan |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.054±0.018 |
| presence amount: share of true 'present' readings that abstain | 0.049±0.021 |
| presence unit: present read present | 0.981±0.028 |
| presence unit: share of 'present' readings that abstain | 0.030±0.028 |
| presence unit: share of true 'present' readings that abstain | 0.025±0.022 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.985±0.012 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.970±0.019 |
| presence pairing: share of FALSE 'present' readings that abstain | nan±nan |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.025±0.050 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.300±0.400 |
| presence color: present read present | 0.842±0.084 |
| presence color: share of true 'present' readings that abstain | 0.277±0.113 |
| presence color: present read present [pooled midpoint (comparison)] | 0.738±0.036 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: share of FALSE 'present' readings that abstain | nan±nan |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of true 'present' readings that abstain | 0.200±0.163 |
| presence quantity: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.462±0.031; status {'abstain': 348, 'ok': 56, 'no-sense': 72}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.849 | 0.362 / 0.244 | 1.00 | 0.151 | 0.000 / 0.000 |
| role object | 0.725 | 0.174 / 0.000 | 0.78 | 0.114 | 0.064 / 0.160 |
| roles (pooled) | 0.713 | 0.139 / 0.000 | 0.73 | 0.081 | 0.069 / 0.206 |
| role region | 0.806 | 0.133 / 0.000 | 0.78 | 0.000 | 0.028 / 0.194 |
| role source | 0.016 | 0.006 / 0.000 | 0.00 | 0.000 | 0.016 / 0.984 |
| role target | 0.533 | 0.050 / 0.000 | 0.47 | 0.133 | 0.200 / 0.333 |
| role size | 0.758 | 0.097 / 0.000 | 0.73 | 0.000 | 0.030 / 0.242 |
| role layout | 0.720 | 0.136 / 0.000 | 0.72 | 0.120 | 0.120 / 0.160 |
| role axis | 1.000 | 0.197 / 0.065 | 0.89 | 0.000 | 0.111 / 0.000 |
| role pairing | 0.529 | 0.170 / 0.019 | 0.76 | 0.294 | 0.059 / 0.176 |
| role text | 0.871 | 0.163 / 0.074 | 0.94 | 0.086 | 0.014 / 0.043 |
| role direction | 0.871 | 0.170 / 0.054 | 0.90 | 0.032 | 0.000 / 0.097 |
| role relation | 0.938 | 0.132 / 0.062 | 0.92 | 0.016 | 0.031 / 0.047 |
| role landmark | 0.500 | 0.058 / 0.000 | 0.44 | 0.125 | 0.188 / 0.375 |
| role anchor | 0.800 | 0.134 / 0.000 | 0.76 | 0.040 | 0.080 / 0.160 |
| role style | 0.333 | 0.021 / 0.000 | 0.33 | 0.000 | 0.000 / 0.667 |
| role amount | 0.976 | 0.128 / 0.065 | 0.90 | 0.000 | 0.071 / 0.024 |
| role unit | 0.976 | 0.201 / 0.082 | 0.93 | 0.000 | 0.048 / 0.024 |
| role fraction | 0.875 | 0.176 / 0.132 | 1.00 | 0.125 | 0.000 / 0.000 |
| role color | 0.824 | 0.074 / 0.000 | 0.65 | 0.000 | 0.176 / 0.176 |
| role quantity | 0.500 | 0.087 / 0.023 | 0.67 | 0.333 | 0.167 / 0.167 |

### mixed — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.574±0.041 |
| FULL [depth given] | 0.574±0.041 |
| FULL [depth and negation given] | 0.574±0.041 |
| FULL [pooled midpoint (comparison)] | 0.446±0.018 |
| presence object: present read present | 0.924±0.035 |
| presence object: share of 'present' readings that abstain | 0.069±0.015 |
| presence object: share of true 'present' readings that abstain | 0.068±0.015 |
| presence color: absent read absent | 0.980±0.013 |
| presence size: absent read absent | 0.992±0.002 |
| presence style: absent read absent | 0.969±0.008 |
| presence text: absent read absent | 0.994±0.002 |
| presence relation: present read present | 0.967±0.025 |
| presence relation: share of 'present' readings that abstain | 0.063±0.032 |
| presence relation: share of true 'present' readings that abstain | 0.063±0.032 |
| presence landmark: present read present | 0.904±0.066 |
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
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.806±0.041 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.806±0.041 |
| event type (synonym table) | 0.806±0.041 |
| role object | 0.689±0.049 |
| head object | 0.723±0.055 |
| lexical order head object | 0.077±0.000 |
| lexical bag head object | 0.315±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.766±0.032 |
| occupancy: known filler | 0.777±0.039 |
| role color | 0.975±0.009 |
| head color | 0.975±0.009 |
| lexical order head color | 0.957±0.000 |
| lexical bag head color | 0.960±0.000 |
| occupancy: not given | 0.996±0.001 |
| role size | 0.989±0.001 |
| head size | 0.989±0.001 |
| lexical order head size | 0.965±0.000 |
| lexical bag head size | 0.980±0.000 |
| role style | 0.972±0.006 |
| head style | 0.972±0.006 |
| lexical order head style | 0.975±0.000 |
| lexical bag head style | 0.978±0.000 |
| role text | 0.979±0.005 |
| head text | 0.979±0.005 |
| lexical order head text | 0.877±0.000 |
| lexical bag head text | 0.890±0.000 |
| role relation | 0.971±0.006 |
| head relation | 0.971±0.006 |
| lexical order head relation | 0.868±0.000 |
| lexical bag head relation | 0.875±0.000 |
| role landmark | 0.936±0.006 |
| head landmark | 0.960±0.006 |
| lexical order head landmark | 0.868±0.000 |
| lexical bag head landmark | 0.858±0.000 |
| role region | 0.978±0.005 |
| head region | 0.978±0.005 |
| lexical order head region | 0.912±0.000 |
| lexical bag head region | 0.918±0.000 |
| role anchor | 0.976±0.006 |
| head anchor | 0.976±0.006 |
| lexical order head anchor | 0.905±0.000 |
| lexical bag head anchor | 0.918±0.000 |
| role fraction | 0.996±0.003 |
| head fraction | 0.996±0.003 |
| lexical order head fraction | 0.957±0.000 |
| lexical bag head fraction | 0.957±0.000 |
| role amount | 1.000±0.001 |
| head amount | 1.000±0.001 |
| lexical order head amount | 0.922±0.000 |
| lexical bag head amount | 0.932±0.000 |
| role unit | 1.000±0.001 |
| head unit | 1.000±0.001 |
| lexical order head unit | 0.922±0.000 |
| lexical bag head unit | 0.930±0.000 |
| role direction | 0.991±0.001 |
| head direction | 0.991±0.001 |
| lexical order head direction | 0.948±0.000 |
| lexical bag head direction | 0.950±0.000 |
| role axis | 0.993±0.004 |
| head axis | 0.993±0.004 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.963±0.000 |
| role layout | 0.989±0.003 |
| head layout | 0.989±0.003 |
| lexical order head layout | 0.932±0.000 |
| lexical bag head layout | 0.935±0.000 |
| role pairing | 0.992±0.004 |
| head pairing | 0.992±0.004 |
| lexical order head pairing | 0.960±0.000 |
| lexical bag head pairing | 0.965±0.000 |
| role source | 0.918±0.005 |
| head source | 0.932±0.006 |
| lexical order head source | 0.895±0.000 |
| lexical bag head source | 0.895±0.000 |
| role target | 0.977±0.004 |
| head target | 0.987±0.004 |
| lexical order head target | 0.935±0.000 |
| lexical bag head target | 0.940±0.000 |
| role quantity | 1.000±0.001 |
| head quantity | 1.000±0.001 |
| lexical order head quantity | 0.985±0.000 |
| lexical bag head quantity | 0.993±0.000 |
| heads FULL (model) | 0.623±0.041 |
| heads FULL (lexical order baseline) | 0.013±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.100±0.000 |
| role object [pooled midpoint (comparison)] | 0.597±0.021 |
| role color [pooled midpoint (comparison)] | 0.981±0.003 |
| role size [pooled midpoint (comparison)] | 0.990±0.001 |
| role style [pooled midpoint (comparison)] | 0.967±0.008 |
| role text [pooled midpoint (comparison)] | 0.961±0.005 |
| role relation [pooled midpoint (comparison)] | 0.941±0.003 |
| role landmark [pooled midpoint (comparison)] | 0.925±0.005 |
| role region [pooled midpoint (comparison)] | 0.956±0.001 |
| role anchor [pooled midpoint (comparison)] | 0.968±0.004 |
| role fraction [pooled midpoint (comparison)] | 0.991±0.004 |
| role amount [pooled midpoint (comparison)] | 0.999±0.001 |
| role unit [pooled midpoint (comparison)] | 1.000±0.001 |
| role direction [pooled midpoint (comparison)] | 0.987±0.001 |
| role axis [pooled midpoint (comparison)] | 0.988±0.002 |
| role layout [pooled midpoint (comparison)] | 0.985±0.004 |
| role pairing [pooled midpoint (comparison)] | 0.988±0.001 |
| role source [pooled midpoint (comparison)] | 0.912±0.003 |
| role target [pooled midpoint (comparison)] | 0.970±0.002 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.493±0.019 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.994±0.007 |
| presence anchor: present read present | 0.897±0.035 |
| presence anchor: share of 'present' readings that abstain | 0.051±0.040 |
| presence anchor: share of true 'present' readings that abstain | 0.051±0.040 |
| presence object: present read present [pooled midpoint (comparison)] | 0.866±0.022 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.992±0.004 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.994±0.001 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.960±0.011 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.991±0.005 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.892±0.006 |
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
| presence layout: present read present | 0.942±0.057 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.874±0.054 |
| presence amount: present read present | 0.994±0.013 |
| presence amount: share of 'present' readings that abstain | 0.006±0.013 |
| presence amount: share of true 'present' readings that abstain | 0.006±0.013 |
| presence unit: present read present | 0.994±0.013 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.987±0.016 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.994±0.013 |
| presence size: share of 'present' readings that abstain | 0.055±0.050 |
| presence size: share of FALSE 'present' readings that abstain | 0.233±0.291 |
| presence source: present read present | 0.573±0.078 |
| presence target: present read present | 0.889±0.059 |
| presence target: share of 'present' readings that abstain | 0.181±0.053 |
| presence target: share of true 'present' readings that abstain | 0.181±0.053 |
| presence source: present read present [pooled midpoint (comparison)] | 0.564±0.057 |
| presence target: present read present [pooled midpoint (comparison)] | 0.796±0.036 |
| presence landmark: share of 'present' readings that abstain | 0.142±0.044 |
| presence landmark: share of true 'present' readings that abstain | 0.107±0.062 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.818±0.048 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.855±0.033 |
| presence color: present read present | 0.855±0.050 |
| presence color: share of 'present' readings that abstain | 0.312±0.094 |
| presence color: share of true 'present' readings that abstain | 0.061±0.032 |
| presence color: present read present [pooled midpoint (comparison)] | 0.910±0.055 |
| presence text: present read present | 0.964±0.017 |
| presence text: share of 'present' readings that abstain | 0.050±0.017 |
| presence text: share of true 'present' readings that abstain | 0.033±0.012 |
| presence text: present read present [pooled midpoint (comparison)] | 0.923±0.035 |
| presence layout: share of 'present' readings that abstain | 0.073±0.042 |
| presence layout: share of true 'present' readings that abstain | 0.073±0.042 |
| presence region: present read present | 0.862±0.056 |
| presence region: share of 'present' readings that abstain | 0.106±0.033 |
| presence region: share of true 'present' readings that abstain | 0.106±0.033 |
| presence region: present read present [pooled midpoint (comparison)] | 0.636±0.022 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.013±0.027 |
| presence fraction: share of true 'present' readings that abstain | 0.013±0.027 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.013±0.027 |
| presence axis: share of true 'present' readings that abstain | 0.013±0.027 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.411±0.051 |
| presence style: share of FALSE 'present' readings that abstain | 0.777±0.060 |
| presence color: share of FALSE 'present' readings that abstain | 0.948±0.067 |
| presence quantity: present read present | 0.967±0.067 |
| presence quantity: share of 'present' readings that abstain | 0.107±0.088 |
| presence quantity: share of true 'present' readings that abstain | 0.107±0.088 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.967±0.067 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.045±0.042 |
| presence direction: share of true 'present' readings that abstain | 0.045±0.042 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.929±0.024 |
| presence object: absent read absent | 0.682±0.117 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.028±0.034 |
| presence pairing: share of true 'present' readings that abstain | 0.028±0.034 |
| presence source: share of 'present' readings that abstain | 0.668±0.136 |
| presence source: share of true 'present' readings that abstain | 0.668±0.136 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.795±0.060 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: present read present | 0.940±0.080 |
| presence style: share of true 'present' readings that abstain | 0.000±0.000 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: share of FALSE 'present' readings that abstain | 0.107±0.088 |
| presence size: present read present | 0.969±0.038 |
| presence size: share of true 'present' readings that abstain | 0.017±0.033 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 0.600±0.374 |

residual mean 0.499±0.031; status {'abstain': 255, 'no-sense': 71, 'ok': 74}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.823 | 0.368 / 0.267 | 1.00 | 0.177 | 0.000 / 0.000 |
| role object | 0.696 | 0.210 / 0.000 | 0.80 | 0.122 | 0.019 / 0.182 |
| roles (pooled) | 0.716 | 0.175 / 0.000 | 0.76 | 0.087 | 0.039 / 0.197 |
| role relation | 0.811 | 0.136 / 0.000 | 0.81 | 0.019 | 0.019 / 0.170 |
| role landmark | 0.509 | 0.091 / 0.000 | 0.57 | 0.170 | 0.113 / 0.321 |
| role region | 0.800 | 0.157 / 0.000 | 0.77 | 0.029 | 0.057 / 0.171 |
| role anchor | 0.658 | 0.140 / 0.000 | 0.61 | 0.026 | 0.079 / 0.316 |
| role layout | 0.741 | 0.187 / 0.000 | 0.74 | 0.111 | 0.111 / 0.148 |
| role amount | 0.968 | 0.186 / 0.129 | 0.97 | 0.000 | 0.000 / 0.032 |
| role unit | 1.000 | 0.261 / 0.156 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.143 | 0.012 / 0.000 | 0.07 | 0.071 | 0.143 / 0.786 |
| role target | 0.615 | 0.084 / 0.000 | 0.73 | 0.154 | 0.038 / 0.231 |
| role color | 0.765 | 0.145 / 0.000 | 0.76 | 0.000 | 0.000 / 0.235 |
| role text | 0.898 | 0.198 / 0.043 | 0.88 | 0.020 | 0.041 / 0.082 |
| role fraction | 0.765 | 0.177 / 0.116 | 1.00 | 0.235 | 0.000 / 0.000 |
| role axis | 0.867 | 0.247 / 0.118 | 0.93 | 0.067 | 0.000 / 0.067 |
| role quantity | 1.000 | 0.097 / 0.042 | 0.83 | 0.000 | 0.167 / 0.000 |
| role direction | 0.810 | 0.208 / 0.045 | 0.86 | 0.095 | 0.048 / 0.095 |
| role pairing | 0.875 | 0.204 / 0.048 | 0.88 | 0.062 | 0.062 / 0.062 |
| role style | 0.800 | 0.085 / 0.000 | 0.80 | 0.000 | 0.000 / 0.200 |
| role size | 0.857 | 0.160 / 0.016 | 0.86 | 0.000 | 0.000 / 0.143 |

### mixed — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.315±0.065 |
| FULL [depth given] | 0.315±0.065 |
| FULL [depth and negation given] | 0.315±0.065 |
| FULL [pooled midpoint (comparison)] | 0.350±0.030 |
| presence object: present read present | 0.926±0.035 |
| presence object: share of 'present' readings that abstain | 0.088±0.013 |
| presence object: share of true 'present' readings that abstain | 0.082±0.015 |
| presence color: absent read absent | 0.969±0.024 |
| presence size: absent read absent | 0.977±0.003 |
| presence style: absent read absent | 0.853±0.061 |
| presence text: absent read absent | 0.837±0.068 |
| presence text: share of 'present' readings that abstain | 0.506±0.096 |
| presence text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: present read present | 0.967±0.025 |
| presence relation: share of 'present' readings that abstain | 0.357±0.116 |
| presence relation: share of true 'present' readings that abstain | 0.093±0.033 |
| presence landmark: present read present | 0.923±0.060 |
| presence region: absent read absent | 0.976±0.011 |
| presence anchor: absent read absent | 0.999±0.001 |
| presence fraction: absent read absent | 0.972±0.015 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 0.999±0.002 |
| presence direction: absent read absent | 0.965±0.015 |
| presence axis: absent read absent | 0.998±0.004 |
| presence layout: absent read absent | 0.995±0.007 |
| presence pairing: absent read absent | 0.999±0.001 |
| presence source: absent read absent | 0.991±0.007 |
| presence target: absent read absent | 0.990±0.008 |
| presence quantity: absent read absent | 0.931±0.047 |
| structure (depth, negation) | 0.788±0.044 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.788±0.044 |
| event type (synonym table) | 0.788±0.044 |
| role object | 0.666±0.047 |
| head object | 0.715±0.053 |
| lexical order head object | 0.077±0.000 |
| lexical bag head object | 0.315±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.740±0.031 |
| occupancy: known filler | 0.779±0.045 |
| role color | 0.965±0.017 |
| head color | 0.965±0.017 |
| lexical order head color | 0.957±0.000 |
| lexical bag head color | 0.960±0.000 |
| occupancy: not given | 0.970±0.004 |
| role size | 0.977±0.002 |
| head size | 0.977±0.002 |
| lexical order head size | 0.965±0.000 |
| lexical bag head size | 0.980±0.000 |
| role style | 0.884±0.043 |
| head style | 0.884±0.043 |
| lexical order head style | 0.975±0.000 |
| lexical bag head style | 0.978±0.000 |
| role text | 0.874±0.042 |
| head text | 0.874±0.042 |
| lexical order head text | 0.877±0.000 |
| lexical bag head text | 0.890±0.000 |
| role relation | 0.921±0.030 |
| head relation | 0.921±0.030 |
| lexical order head relation | 0.868±0.000 |
| lexical bag head relation | 0.875±0.000 |
| role landmark | 0.909±0.031 |
| head landmark | 0.932±0.032 |
| lexical order head landmark | 0.868±0.000 |
| lexical bag head landmark | 0.858±0.000 |
| role region | 0.961±0.006 |
| head region | 0.961±0.006 |
| lexical order head region | 0.912±0.000 |
| lexical bag head region | 0.918±0.000 |
| role anchor | 0.974±0.005 |
| head anchor | 0.974±0.005 |
| lexical order head anchor | 0.905±0.000 |
| lexical bag head anchor | 0.918±0.000 |
| role fraction | 0.975±0.012 |
| head fraction | 0.975±0.012 |
| lexical order head fraction | 0.957±0.000 |
| lexical bag head fraction | 0.957±0.000 |
| role amount | 0.998±0.001 |
| head amount | 0.998±0.001 |
| lexical order head amount | 0.922±0.000 |
| lexical bag head amount | 0.932±0.000 |
| role unit | 0.998±0.003 |
| head unit | 0.998±0.003 |
| lexical order head unit | 0.922±0.000 |
| lexical bag head unit | 0.930±0.000 |
| role direction | 0.966±0.011 |
| head direction | 0.966±0.011 |
| lexical order head direction | 0.948±0.000 |
| lexical bag head direction | 0.950±0.000 |
| role axis | 0.991±0.005 |
| head axis | 0.991±0.005 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.963±0.000 |
| role layout | 0.986±0.004 |
| head layout | 0.986±0.004 |
| lexical order head layout | 0.932±0.000 |
| lexical bag head layout | 0.935±0.000 |
| role pairing | 0.982±0.008 |
| head pairing | 0.982±0.008 |
| lexical order head pairing | 0.960±0.000 |
| lexical bag head pairing | 0.965±0.000 |
| role source | 0.896±0.006 |
| head source | 0.902±0.007 |
| lexical order head source | 0.895±0.000 |
| lexical bag head source | 0.895±0.000 |
| role target | 0.966±0.007 |
| head target | 0.974±0.007 |
| lexical order head target | 0.935±0.000 |
| lexical bag head target | 0.940±0.000 |
| role quantity | 0.945±0.042 |
| head quantity | 0.945±0.042 |
| lexical order head quantity | 0.985±0.000 |
| lexical bag head quantity | 0.993±0.000 |
| heads FULL (model) | 0.350±0.067 |
| heads FULL (lexical order baseline) | 0.013±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.100±0.000 |
| role object [pooled midpoint (comparison)] | 0.586±0.022 |
| role color [pooled midpoint (comparison)] | 0.980±0.003 |
| role size [pooled midpoint (comparison)] | 0.989±0.003 |
| role style [pooled midpoint (comparison)] | 0.897±0.016 |
| role text [pooled midpoint (comparison)] | 0.943±0.006 |
| role relation [pooled midpoint (comparison)] | 0.940±0.003 |
| role landmark [pooled midpoint (comparison)] | 0.922±0.006 |
| role region [pooled midpoint (comparison)] | 0.956±0.001 |
| role anchor [pooled midpoint (comparison)] | 0.967±0.005 |
| role fraction [pooled midpoint (comparison)] | 0.983±0.009 |
| role amount [pooled midpoint (comparison)] | 0.998±0.001 |
| role unit [pooled midpoint (comparison)] | 0.998±0.003 |
| role direction [pooled midpoint (comparison)] | 0.985±0.002 |
| role axis [pooled midpoint (comparison)] | 0.988±0.002 |
| role layout [pooled midpoint (comparison)] | 0.985±0.004 |
| role pairing [pooled midpoint (comparison)] | 0.979±0.005 |
| role source [pooled midpoint (comparison)] | 0.899±0.003 |
| role target [pooled midpoint (comparison)] | 0.964±0.004 |
| role quantity [pooled midpoint (comparison)] | 0.957±0.009 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.384±0.031 |
| presence relation: absent read absent | 0.930±0.048 |
| presence landmark: absent read absent | 0.955±0.051 |
| presence anchor: present read present | 0.896±0.035 |
| presence anchor: share of 'present' readings that abstain | 0.077±0.057 |
| presence anchor: share of true 'present' readings that abstain | 0.072±0.054 |
| presence object: present read present [pooled midpoint (comparison)] | 0.866±0.021 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.990±0.005 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.993±0.002 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.858±0.025 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.963±0.011 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.892±0.006 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.989±0.008 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.997±0.004 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.999±0.003 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.939±0.013 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence layout: present read present | 0.942±0.057 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.874±0.054 |
| presence quantity: share of 'present' readings that abstain | 0.771±0.072 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.046±0.033 |
| presence amount: share of true 'present' readings that abstain | 0.046±0.033 |
| presence unit: present read present | 0.993±0.013 |
| presence unit: share of 'present' readings that abstain | 0.013±0.016 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.993±0.013 |
| presence size: share of 'present' readings that abstain | 0.369±0.011 |
| presence size: share of FALSE 'present' readings that abstain | 0.851±0.016 |
| presence style: share of 'present' readings that abstain | 0.823±0.059 |
| presence style: share of FALSE 'present' readings that abstain | 0.971±0.021 |
| presence source: present read present | 0.966±0.029 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.960±0.039 |
| presence target: share of 'present' readings that abstain | 0.366±0.070 |
| presence target: share of true 'present' readings that abstain | 0.283±0.076 |
| presence source: present read present [pooled midpoint (comparison)] | 0.836±0.035 |
| presence target: present read present [pooled midpoint (comparison)] | 0.865±0.022 |
| presence landmark: share of 'present' readings that abstain | 0.319±0.123 |
| presence landmark: share of true 'present' readings that abstain | 0.146±0.074 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.827±0.050 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.871±0.036 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.384±0.098 |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present | 0.853±0.050 |
| presence color: share of 'present' readings that abstain | 0.434±0.148 |
| presence color: share of true 'present' readings that abstain | 0.121±0.088 |
| presence color: present read present [pooled midpoint (comparison)] | 0.907±0.058 |
| presence text: present read present | 0.964±0.017 |
| presence text: share of true 'present' readings that abstain | 0.033±0.012 |
| presence text: present read present [pooled midpoint (comparison)] | 0.923±0.035 |
| presence layout: share of 'present' readings that abstain | 0.122±0.049 |
| presence layout: share of true 'present' readings that abstain | 0.073±0.042 |
| presence region: present read present | 0.862±0.056 |
| presence region: share of 'present' readings that abstain | 0.292±0.077 |
| presence region: share of true 'present' readings that abstain | 0.114±0.031 |
| presence region: present read present [pooled midpoint (comparison)] | 0.636±0.022 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.356±0.163 |
| presence fraction: share of true 'present' readings that abstain | 0.054±0.053 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.067±0.084 |
| presence axis: share of true 'present' readings that abstain | 0.027±0.053 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 0.987±0.027 |
| presence region: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence quantity: present read present | 0.967±0.067 |
| presence quantity: share of true 'present' readings that abstain | 0.107±0.088 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.967±0.067 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.045±0.042 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.929±0.024 |
| presence object: absent read absent | 0.592±0.133 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.063±0.056 |
| presence pairing: share of true 'present' readings that abstain | 0.034±0.043 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.732±0.085 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: present read present | 0.940±0.080 |
| presence style: share of true 'present' readings that abstain | 0.122±0.079 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: share of FALSE 'present' readings that abstain | 0.255±0.160 |
| presence size: present read present | 0.967±0.041 |
| presence size: share of true 'present' readings that abstain | 0.085±0.053 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: share of FALSE 'present' readings that abstain | 0.983±0.033 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.513±0.033; status {'abstain': 261, 'no-sense': 80, 'ok': 59}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.800 | 0.368 / 0.267 | 1.00 | 0.200 | 0.000 / 0.000 |
| role object | 0.678 | 0.178 / 0.000 | 0.77 | 0.114 | 0.019 / 0.209 |
| roles (pooled) | 0.693 | 0.145 / 0.000 | 0.74 | 0.084 | 0.038 / 0.223 |
| role relation | 0.811 | 0.113 / 0.000 | 0.79 | 0.019 | 0.038 / 0.170 |
| role landmark | 0.491 | 0.073 / 0.000 | 0.53 | 0.170 | 0.132 / 0.340 |
| role region | 0.800 | 0.129 / 0.000 | 0.77 | 0.029 | 0.057 / 0.171 |
| role anchor | 0.658 | 0.111 / 0.000 | 0.58 | 0.026 | 0.105 / 0.316 |
| role layout | 0.741 | 0.134 / 0.000 | 0.74 | 0.111 | 0.111 / 0.148 |
| role amount | 0.968 | 0.149 / 0.105 | 0.97 | 0.000 | 0.000 / 0.032 |
| role unit | 0.968 | 0.246 / 0.150 | 0.97 | 0.000 | 0.000 / 0.032 |
| role source | 0.000 | 0.007 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role target | 0.615 | 0.067 / 0.000 | 0.65 | 0.154 | 0.115 / 0.231 |
| role color | 0.765 | 0.104 / 0.000 | 0.76 | 0.000 | 0.000 / 0.235 |
| role text | 0.898 | 0.160 / 0.043 | 0.88 | 0.020 | 0.041 / 0.082 |
| role fraction | 0.765 | 0.152 / 0.080 | 0.94 | 0.176 | 0.000 / 0.059 |
| role axis | 0.867 | 0.195 / 0.093 | 0.93 | 0.067 | 0.000 / 0.067 |
| role quantity | 1.000 | 0.097 / 0.042 | 0.83 | 0.000 | 0.167 / 0.000 |
| role direction | 0.810 | 0.174 / 0.045 | 0.86 | 0.095 | 0.048 / 0.095 |
| role pairing | 0.625 | 0.169 / 0.048 | 0.88 | 0.312 | 0.062 / 0.062 |
| role style | 0.800 | 0.074 / 0.000 | 0.80 | 0.000 | 0.000 / 0.200 |
| role size | 0.786 | 0.126 / 0.003 | 0.79 | 0.000 | 0.000 / 0.214 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.628±0.032 |
| FULL [depth given] | 0.628±0.032 |
| FULL [depth and negation given] | 0.628±0.032 |
| FULL [pooled midpoint (comparison)] | 0.500±0.016 |
| presence object: present read present | 0.911±0.050 |
| presence object: share of 'present' readings that abstain | 0.073±0.026 |
| presence object: share of true 'present' readings that abstain | 0.074±0.027 |
| presence color: absent read absent | 0.986±0.016 |
| presence size: absent read absent | 0.977±0.001 |
| presence style: absent read absent | 0.978±0.008 |
| presence text: absent read absent | 0.925±0.014 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.993±0.012 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.999±0.001 |
| presence target: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.837±0.028 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.837±0.028 |
| event type (synonym table) | 0.837±0.028 |
| role object | 0.713±0.062 |
| head object | 0.725±0.063 |
| lexical order head object | 0.025±0.000 |
| lexical bag head object | 0.307±0.000 |
| occupancy: unknown filler | 0.771±0.019 |
| role color | 0.980±0.013 |
| head color | 0.980±0.013 |
| lexical order head color | 0.980±0.000 |
| lexical bag head color | 0.980±0.000 |
| occupancy: not given | 0.994±0.001 |
| role size | 0.974±0.001 |
| head size | 0.974±0.001 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.953±0.000 |
| role style | 0.982±0.006 |
| head style | 0.982±0.006 |
| lexical order head style | 0.998±0.000 |
| lexical bag head style | 0.998±0.000 |
| role text | 0.864±0.009 |
| head text | 0.864±0.009 |
| lexical order head text | 0.542±0.000 |
| lexical bag head text | 0.635±0.000 |
| role relation | 0.971±0.009 |
| head relation | 0.971±0.009 |
| lexical order head relation | 0.815±0.000 |
| lexical bag head relation | 0.818±0.000 |
| role landmark | 0.920±0.006 |
| head landmark | 0.940±0.007 |
| lexical order head landmark | 0.815±0.000 |
| lexical bag head landmark | 0.807±0.000 |
| role region | 0.987±0.002 |
| head region | 0.987±0.002 |
| lexical order head region | 0.943±0.000 |
| lexical bag head region | 0.945±0.000 |
| role anchor | 0.984±0.002 |
| head anchor | 0.984±0.002 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 0.957±0.000 |
| role fraction | 0.999±0.002 |
| head fraction | 0.999±0.002 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 0.980±0.000 |
| role amount | 0.999±0.001 |
| head amount | 0.999±0.001 |
| lexical order head amount | 0.777±0.000 |
| lexical bag head amount | 0.823±0.000 |
| role unit | 0.998±0.001 |
| head unit | 0.998±0.001 |
| lexical order head unit | 0.777±0.000 |
| lexical bag head unit | 0.812±0.000 |
| role direction | 0.996±0.001 |
| head direction | 0.996±0.001 |
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
| role source | 0.944±0.006 |
| head source | 0.946±0.005 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.932±0.000 |
| role target | 0.973±0.003 |
| head target | 0.980±0.004 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.930±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.641±0.031 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.105±0.000 |
| role object [pooled midpoint (comparison)] | 0.609±0.021 |
| role color [pooled midpoint (comparison)] | 0.989±0.003 |
| role size [pooled midpoint (comparison)] | 0.978±0.003 |
| role style [pooled midpoint (comparison)] | 0.985±0.007 |
| role text [pooled midpoint (comparison)] | 0.804±0.022 |
| role relation [pooled midpoint (comparison)] | 0.927±0.009 |
| role landmark [pooled midpoint (comparison)] | 0.902±0.009 |
| role region [pooled midpoint (comparison)] | 0.969±0.003 |
| role anchor [pooled midpoint (comparison)] | 0.980±0.001 |
| role fraction [pooled midpoint (comparison)] | 0.995±0.001 |
| role amount [pooled midpoint (comparison)] | 0.998±0.002 |
| role unit [pooled midpoint (comparison)] | 0.998±0.001 |
| role direction [pooled midpoint (comparison)] | 0.994±0.001 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.943±0.004 |
| role target [pooled midpoint (comparison)] | 0.968±0.003 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.518±0.014 |
| presence anchor: present read present | 0.955±0.037 |
| presence anchor: share of 'present' readings that abstain | 0.062±0.075 |
| presence anchor: share of true 'present' readings that abstain | 0.062±0.075 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.033±0.067 |
| presence fraction: share of true 'present' readings that abstain | 0.033±0.067 |
| occupancy: known filler | 0.822±0.037 |
| presence object: present read present [pooled midpoint (comparison)] | 0.876±0.016 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.998±0.004 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.980±0.002 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.980±0.010 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.931±0.014 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
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
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present | 0.998±0.004 |
| presence amount: share of 'present' readings that abstain | 0.018±0.014 |
| presence amount: share of true 'present' readings that abstain | 0.018±0.014 |
| presence unit: present read present | 0.996±0.006 |
| presence unit: share of 'present' readings that abstain | 0.002±0.004 |
| presence unit: share of true 'present' readings that abstain | 0.002±0.004 |
| presence direction: present read present | 0.982±0.022 |
| presence direction: share of 'present' readings that abstain | 0.037±0.019 |
| presence direction: share of true 'present' readings that abstain | 0.037±0.019 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.996±0.009 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.996±0.006 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.981±0.023 |
| presence region: present read present | 0.927±0.025 |
| presence region: share of 'present' readings that abstain | 0.112±0.093 |
| presence region: share of true 'present' readings that abstain | 0.112±0.093 |
| presence region: present read present [pooled midpoint (comparison)] | 0.715±0.031 |
| presence text: present read present | 0.971±0.028 |
| presence text: share of 'present' readings that abstain | 0.097±0.011 |
| presence text: share of true 'present' readings that abstain | 0.068±0.023 |
| determiner identity (outside FULL when the legend excludes it) | 0.890±0.060 |
| presence text: present read present [pooled midpoint (comparison)] | 0.920±0.024 |
| presence relation: present read present | 0.966±0.026 |
| presence relation: share of 'present' readings that abstain | 0.100±0.044 |
| presence relation: share of true 'present' readings that abstain | 0.100±0.044 |
| presence landmark: present read present | 0.804±0.084 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.789±0.077 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.731±0.047 |
| presence object: absent read absent | 0.261±0.102 |
| presence object: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 0.401±0.156 |
| presence source: present read present | 0.448±0.042 |
| presence target: present read present | 0.787±0.052 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.313±0.036 |
| presence source: present read present [pooled midpoint (comparison)] | 0.451±0.039 |
| presence target: present read present [pooled midpoint (comparison)] | 0.725±0.011 |
| presence style: share of 'present' readings that abstain | 0.811±0.109 |
| presence style: share of FALSE 'present' readings that abstain | 0.943±0.114 |
| presence landmark: share of 'present' readings that abstain | 0.142±0.034 |
| presence landmark: share of true 'present' readings that abstain | 0.116±0.039 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.090±0.023 |
| presence size: share of true 'present' readings that abstain | 0.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.991±0.017 |
| presence color: share of 'present' readings that abstain | 0.338±0.292 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: present read present | 0.589±0.093 |
| presence color: share of true 'present' readings that abstain | 0.107±0.137 |
| presence color: present read present [pooled midpoint (comparison)] | 0.571±0.000 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.000±0.000 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.275±0.104 |
| presence target: share of true 'present' readings that abstain | 0.275±0.104 |
| presence size: share of FALSE 'present' readings that abstain | 0.386±0.086 |
| presence source: share of 'present' readings that abstain | 0.864±0.086 |
| presence source: share of true 'present' readings that abstain | 0.863±0.085 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.482±0.025; status {'abstain': 275, 'no-sense': 58, 'ok': 67}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.855 | 0.350 / 0.247 | 1.00 | 0.145 | 0.000 / 0.000 |
| role object | 0.782 | 0.199 / 0.000 | 0.81 | 0.069 | 0.046 / 0.149 |
| roles (pooled) | 0.796 | 0.171 / 0.000 | 0.80 | 0.048 | 0.047 / 0.156 |
| role anchor | 0.579 | 0.126 / 0.000 | 0.58 | 0.000 | 0.000 / 0.421 |
| role fraction | 0.750 | 0.106 / 0.083 | 0.88 | 0.250 | 0.125 / 0.000 |
| role amount | 1.000 | 0.173 / 0.118 | 0.99 | 0.000 | 0.011 / 0.000 |
| role unit | 1.000 | 0.267 / 0.190 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.913 | 0.172 / 0.116 | 0.96 | 0.043 | 0.000 / 0.043 |
| role region | 0.826 | 0.126 / 0.000 | 0.65 | 0.000 | 0.174 / 0.174 |
| role text | 0.831 | 0.179 / 0.014 | 0.85 | 0.060 | 0.044 / 0.109 |
| role relation | 0.892 | 0.135 / 0.013 | 0.85 | 0.014 | 0.054 / 0.095 |
| role landmark | 0.527 | 0.080 / 0.000 | 0.57 | 0.081 | 0.041 / 0.392 |
| role source | 0.172 | 0.011 / 0.000 | 0.10 | 0.000 | 0.069 / 0.828 |
| role target | 0.621 | 0.048 / 0.000 | 0.41 | 0.103 | 0.310 / 0.276 |
| role size | 0.889 | 0.154 / 0.035 | 0.89 | 0.000 | 0.000 / 0.111 |
| role color | 0.500 | 0.089 / 0.000 | 0.50 | 0.000 | 0.000 / 0.500 |
| role style | 1.000 | 0.118 / 0.118 | 1.00 | 0.000 | 0.000 / 0.000 |

### new_identities — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.297±0.040 |
| FULL [depth given] | 0.297±0.040 |
| FULL [depth and negation given] | 0.297±0.040 |
| FULL [pooled midpoint (comparison)] | 0.386±0.018 |
| presence object: present read present | 0.921±0.046 |
| presence object: share of 'present' readings that abstain | 0.092±0.023 |
| presence object: share of true 'present' readings that abstain | 0.093±0.023 |
| presence color: absent read absent | 0.971±0.042 |
| presence size: absent read absent | 0.953±0.026 |
| presence style: absent read absent | 0.897±0.034 |
| presence text: absent read absent | 0.757±0.038 |
| presence text: share of 'present' readings that abstain | 0.272±0.007 |
| presence text: share of FALSE 'present' readings that abstain | 0.913±0.026 |
| presence relation: absent read absent | 0.882±0.073 |
| presence landmark: absent read absent | 0.934±0.065 |
| presence region: absent read absent | 0.951±0.024 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 0.991±0.007 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 0.896±0.037 |
| presence axis: absent read absent | 0.999±0.002 |
| presence layout: absent read absent | 0.984±0.026 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.995±0.005 |
| presence target: absent read absent | 0.990±0.014 |
| presence quantity: absent read absent | 0.961±0.021 |
| structure (depth, negation) | 0.824±0.029 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.824±0.029 |
| event type (synonym table) | 0.824±0.029 |
| role object | 0.688±0.059 |
| head object | 0.714±0.058 |
| lexical order head object | 0.025±0.000 |
| lexical bag head object | 0.307±0.000 |
| occupancy: unknown filler | 0.789±0.026 |
| role color | 0.967±0.036 |
| head color | 0.967±0.036 |
| lexical order head color | 0.980±0.000 |
| lexical bag head color | 0.980±0.000 |
| occupancy: not given | 0.965±0.004 |
| role size | 0.957±0.019 |
| head size | 0.957±0.019 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.953±0.000 |
| role style | 0.915±0.026 |
| head style | 0.915±0.026 |
| lexical order head style | 0.998±0.000 |
| lexical bag head style | 0.998±0.000 |
| role text | 0.783±0.018 |
| head text | 0.783±0.018 |
| lexical order head text | 0.542±0.000 |
| lexical bag head text | 0.635±0.000 |
| role relation | 0.892±0.043 |
| head relation | 0.892±0.043 |
| lexical order head relation | 0.815±0.000 |
| lexical bag head relation | 0.818±0.000 |
| role landmark | 0.882±0.034 |
| head landmark | 0.902±0.033 |
| lexical order head landmark | 0.815±0.000 |
| lexical bag head landmark | 0.807±0.000 |
| role region | 0.949±0.017 |
| head region | 0.949±0.017 |
| lexical order head region | 0.943±0.000 |
| lexical bag head region | 0.945±0.000 |
| role anchor | 0.984±0.002 |
| head anchor | 0.984±0.002 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 0.957±0.000 |
| role fraction | 0.992±0.005 |
| head fraction | 0.992±0.005 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 0.980±0.000 |
| role amount | 0.998±0.000 |
| head amount | 0.998±0.000 |
| lexical order head amount | 0.777±0.000 |
| lexical bag head amount | 0.823±0.000 |
| role unit | 0.998±0.000 |
| head unit | 0.998±0.000 |
| lexical order head unit | 0.777±0.000 |
| lexical bag head unit | 0.812±0.000 |
| role direction | 0.915±0.028 |
| head direction | 0.915±0.028 |
| lexical order head direction | 0.943±0.000 |
| lexical bag head direction | 0.943±0.000 |
| role axis | 0.999±0.002 |
| head axis | 0.999±0.002 |
| lexical order head axis | 1.000±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 0.988±0.020 |
| head layout | 0.988±0.020 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 1.000±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.927±0.002 |
| head source | 0.927±0.003 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.932±0.000 |
| role target | 0.962±0.007 |
| head target | 0.969±0.007 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.930±0.000 |
| role quantity | 0.967±0.019 |
| head quantity | 0.967±0.019 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.309±0.042 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.105±0.000 |
| role object [pooled midpoint (comparison)] | 0.589±0.021 |
| role color [pooled midpoint (comparison)] | 0.988±0.002 |
| role size [pooled midpoint (comparison)] | 0.976±0.005 |
| role style [pooled midpoint (comparison)] | 0.923±0.036 |
| role text [pooled midpoint (comparison)] | 0.763±0.017 |
| role relation [pooled midpoint (comparison)] | 0.926±0.009 |
| role landmark [pooled midpoint (comparison)] | 0.901±0.013 |
| role region [pooled midpoint (comparison)] | 0.969±0.003 |
| role anchor [pooled midpoint (comparison)] | 0.980±0.001 |
| role fraction [pooled midpoint (comparison)] | 0.993±0.002 |
| role amount [pooled midpoint (comparison)] | 0.997±0.001 |
| role unit [pooled midpoint (comparison)] | 0.997±0.001 |
| role direction [pooled midpoint (comparison)] | 0.986±0.005 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.930±0.002 |
| role target [pooled midpoint (comparison)] | 0.963±0.003 |
| role quantity [pooled midpoint (comparison)] | 0.974±0.008 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.404±0.021 |
| presence anchor: present read present | 0.986±0.029 |
| presence anchor: share of 'present' readings that abstain | 0.062±0.075 |
| presence anchor: share of true 'present' readings that abstain | 0.062±0.075 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.281±0.154 |
| presence fraction: share of true 'present' readings that abstain | 0.058±0.073 |
| occupancy: known filler | 0.839±0.038 |
| presence object: present read present [pooled midpoint (comparison)] | 0.882±0.019 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.997±0.003 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.978±0.004 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.895±0.050 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.839±0.007 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.997±0.005 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.991±0.009 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.965±0.011 |
| presence style: share of 'present' readings that abstain | 0.963±0.014 |
| presence style: share of FALSE 'present' readings that abstain | 0.994±0.012 |
| presence relation: share of 'present' readings that abstain | 0.386±0.110 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence landmark: share of 'present' readings that abstain | 0.442±0.074 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.016±0.015 |
| presence amount: share of true 'present' readings that abstain | 0.016±0.015 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.599±0.092 |
| presence direction: share of true 'present' readings that abstain | 0.048±0.052 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence amount: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 0.927±0.025 |
| presence region: share of 'present' readings that abstain | 0.533±0.084 |
| presence region: share of true 'present' readings that abstain | 0.168±0.095 |
| presence region: present read present [pooled midpoint (comparison)] | 0.715±0.031 |
| presence text: present read present | 0.972±0.029 |
| presence text: share of true 'present' readings that abstain | 0.069±0.029 |
| determiner identity (outside FULL when the legend excludes it) | 0.884±0.056 |
| presence direction: share of FALSE 'present' readings that abstain | 0.993±0.014 |
| presence text: present read present [pooled midpoint (comparison)] | 0.924±0.022 |
| presence relation: present read present | 0.966±0.026 |
| presence relation: share of true 'present' readings that abstain | 0.112±0.043 |
| presence landmark: present read present | 0.899±0.064 |
| presence landmark: share of true 'present' readings that abstain | 0.300±0.042 |
| presence quantity: share of 'present' readings that abstain | 1.000±0.000 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.803±0.080 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.808±0.038 |
| presence object: absent read absent | 0.252±0.097 |
| presence object: share of FALSE 'present' readings that abstain | 0.029±0.057 |
| presence source: present read present | 0.963±0.023 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.903±0.042 |
| presence target: share of 'present' readings that abstain | 0.694±0.084 |
| presence target: share of true 'present' readings that abstain | 0.655±0.111 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.321±0.044 |
| presence source: present read present [pooled midpoint (comparison)] | 0.770±0.023 |
| presence target: present read present [pooled midpoint (comparison)] | 0.745±0.037 |
| presence region: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.575±0.227 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.316±0.100 |
| presence size: share of true 'present' readings that abstain | 0.008±0.017 |
| presence size: present read present [pooled midpoint (comparison)] | 0.991±0.017 |
| presence size: share of FALSE 'present' readings that abstain | 0.880±0.091 |
| presence color: present read present | 0.639±0.111 |
| presence color: share of true 'present' readings that abstain | 0.297±0.169 |
| presence color: present read present [pooled midpoint (comparison)] | 0.571±0.000 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.000±0.000 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.492±0.026; status {'abstain': 298, 'no-sense': 64, 'ok': 38}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.840 | 0.350 / 0.247 | 1.00 | 0.160 | 0.000 / 0.000 |
| role object | 0.754 | 0.168 / 0.000 | 0.80 | 0.077 | 0.033 / 0.169 |
| roles (pooled) | 0.781 | 0.145 / 0.000 | 0.78 | 0.049 | 0.049 / 0.170 |
| role anchor | 0.579 | 0.102 / 0.000 | 0.58 | 0.000 | 0.000 / 0.421 |
| role fraction | 0.750 | 0.084 / 0.053 | 0.88 | 0.250 | 0.125 / 0.000 |
| role amount | 0.989 | 0.161 / 0.106 | 0.98 | 0.000 | 0.011 / 0.011 |
| role unit | 0.989 | 0.253 / 0.124 | 0.99 | 0.000 | 0.000 / 0.011 |
| role direction | 0.913 | 0.122 / 0.062 | 0.96 | 0.043 | 0.000 / 0.043 |
| role region | 0.826 | 0.103 / 0.000 | 0.65 | 0.000 | 0.174 / 0.174 |
| role text | 0.825 | 0.150 / 0.006 | 0.84 | 0.060 | 0.044 / 0.115 |
| role relation | 0.892 | 0.108 / 0.013 | 0.85 | 0.014 | 0.054 / 0.095 |
| role landmark | 0.554 | 0.058 / 0.000 | 0.50 | 0.068 | 0.122 / 0.378 |
| role source | 0.069 | 0.007 / 0.000 | 0.00 | 0.000 | 0.069 / 0.931 |
| role target | 0.586 | 0.035 / 0.000 | 0.31 | 0.069 | 0.345 / 0.345 |
| role size | 0.889 | 0.126 / 0.035 | 0.89 | 0.000 | 0.000 / 0.111 |
| role color | 0.500 | 0.049 / 0.000 | 0.50 | 0.000 | 0.000 / 0.500 |
| role style | 1.000 | 0.118 / 0.118 | 1.00 | 0.000 | 0.000 / 0.000 |

### new_identities_en — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.548±0.058 |
| FULL [depth given] | 0.548±0.058 |
| FULL [depth and negation given] | 0.548±0.058 |
| FULL [pooled midpoint (comparison)] | 0.414±0.018 |
| presence object: present read present | 0.886±0.053 |
| presence object: share of 'present' readings that abstain | 0.175±0.021 |
| presence object: share of true 'present' readings that abstain | 0.176±0.025 |
| presence color: absent read absent | 0.991±0.012 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.043±0.040 |
| presence size: share of true 'present' readings that abstain | 0.008±0.015 |
| presence style: absent read absent | 0.990±0.006 |
| presence text: absent read absent | 0.930±0.010 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.995±0.004 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.942±0.051 |
| presence amount: share of 'present' readings that abstain | 0.097±0.057 |
| presence amount: share of true 'present' readings that abstain | 0.097±0.057 |
| presence unit: present read present | 0.942±0.038 |
| presence unit: share of 'present' readings that abstain | 0.104±0.039 |
| presence unit: share of true 'present' readings that abstain | 0.104±0.039 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.989±0.006 |
| presence target: absent read absent | 0.998±0.004 |
| presence quantity: absent read absent | 0.998±0.003 |
| structure (depth, negation) | 0.843±0.032 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.843±0.032 |
| event type (synonym table) | 0.843±0.032 |
| role object | 0.662±0.071 |
| head object | 0.696±0.068 |
| lexical order head object | 0.033±0.000 |
| lexical bag head object | 0.870±0.000 |
| occupancy: known filler | 0.874±0.029 |
| role color | 0.988±0.009 |
| head color | 0.988±0.009 |
| lexical order head color | 0.985±0.000 |
| lexical bag head color | 0.988±0.000 |
| occupancy: not given | 0.994±0.000 |
| role size | 0.995±0.003 |
| head size | 0.995±0.003 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.978±0.000 |
| role style | 0.982±0.007 |
| head style | 0.982±0.007 |
| lexical order head style | 0.988±0.000 |
| lexical bag head style | 0.988±0.000 |
| role text | 0.849±0.029 |
| head text | 0.849±0.029 |
| lexical order head text | 0.535±0.000 |
| lexical bag head text | 0.640±0.000 |
| role relation | 0.975±0.010 |
| head relation | 0.975±0.010 |
| lexical order head relation | 0.790±0.000 |
| lexical bag head relation | 0.838±0.000 |
| role landmark | 0.909±0.010 |
| head landmark | 0.954±0.010 |
| lexical order head landmark | 0.790±0.000 |
| lexical bag head landmark | 0.812±0.000 |
| role region | 0.999±0.001 |
| head region | 0.999±0.001 |
| lexical order head region | 0.955±0.000 |
| lexical bag head region | 0.955±0.000 |
| role anchor | 1.000±0.001 |
| head anchor | 1.000±0.001 |
| lexical order head anchor | 0.968±0.000 |
| lexical bag head anchor | 0.988±0.000 |
| role fraction | 1.000±0.001 |
| head fraction | 1.000±0.001 |
| lexical order head fraction | 0.988±0.000 |
| lexical bag head fraction | 0.993±0.000 |
| role amount | 0.979±0.012 |
| head amount | 0.979±0.012 |
| lexical order head amount | 0.750±0.000 |
| lexical bag head amount | 0.820±0.000 |
| occupancy: unknown filler | 0.684±0.049 |
| role unit | 0.979±0.010 |
| head unit | 0.979±0.010 |
| lexical order head unit | 0.750±0.000 |
| lexical bag head unit | 0.820±0.000 |
| role direction | 0.984±0.008 |
| head direction | 0.984±0.008 |
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
| role source | 0.935±0.004 |
| head source | 0.935±0.004 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.943±0.000 |
| role target | 0.961±0.003 |
| head target | 0.964±0.005 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.940±0.000 |
| role quantity | 0.998±0.003 |
| head quantity | 0.998±0.003 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.589±0.057 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.245±0.000 |
| role object [pooled midpoint (comparison)] | 0.576±0.017 |
| role color [pooled midpoint (comparison)] | 0.991±0.001 |
| role size [pooled midpoint (comparison)] | 0.996±0.001 |
| role style [pooled midpoint (comparison)] | 0.983±0.008 |
| role text [pooled midpoint (comparison)] | 0.771±0.010 |
| role relation [pooled midpoint (comparison)] | 0.943±0.003 |
| role landmark [pooled midpoint (comparison)] | 0.893±0.001 |
| role region [pooled midpoint (comparison)] | 0.998±0.000 |
| role anchor [pooled midpoint (comparison)] | 0.999±0.001 |
| role fraction [pooled midpoint (comparison)] | 0.999±0.001 |
| role amount [pooled midpoint (comparison)] | 0.959±0.011 |
| role unit [pooled midpoint (comparison)] | 0.956±0.011 |
| role direction [pooled midpoint (comparison)] | 0.966±0.005 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.943±0.003 |
| role target [pooled midpoint (comparison)] | 0.956±0.003 |
| role quantity [pooled midpoint (comparison)] | 0.998±0.003 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.456±0.023 |
| presence object: present read present [pooled midpoint (comparison)] | 0.843±0.011 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.989±0.009 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.930±0.004 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.915±0.041 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.899±0.040 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.997±0.004 |
| presence size: absent read absent | 0.997±0.004 |
| presence text: present read present | 0.885±0.041 |
| presence text: share of 'present' readings that abstain | 0.121±0.025 |
| presence text: share of true 'present' readings that abstain | 0.089±0.018 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present [pooled midpoint (comparison)] | 0.789±0.014 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 0.464±0.186 |
| presence relation: present read present | 0.953±0.022 |
| presence relation: share of 'present' readings that abstain | 0.083±0.024 |
| presence relation: share of true 'present' readings that abstain | 0.083±0.024 |
| presence landmark: present read present | 0.893±0.060 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.015±0.031 |
| presence anchor: share of true 'present' readings that abstain | 0.015±0.031 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.432±0.170 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence source: present read present | 0.657±0.097 |
| presence source: share of 'present' readings that abstain | 0.922±0.066 |
| presence source: share of true 'present' readings that abstain | 0.930±0.076 |
| presence target: present read present | 0.693±0.103 |
| presence target: share of 'present' readings that abstain | 0.729±0.076 |
| presence target: share of true 'present' readings that abstain | 0.722±0.077 |
| determiner identity (outside FULL when the legend excludes it) | 0.791±0.094 |
| presence source: present read present [pooled midpoint (comparison)] | 0.703±0.031 |
| presence target: present read present [pooled midpoint (comparison)] | 0.687±0.017 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.859±0.009 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.859±0.008 |
| presence landmark: share of 'present' readings that abstain | 0.429±0.106 |
| presence landmark: share of true 'present' readings that abstain | 0.419±0.109 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 0.889±0.130 |
| presence direction: share of 'present' readings that abstain | 0.100±0.035 |
| presence direction: share of true 'present' readings that abstain | 0.100±0.035 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.651±0.066 |
| presence size: share of FALSE 'present' readings that abstain | nan±nan |
| presence object: absent read absent | 0.031±0.038 |
| presence object: share of FALSE 'present' readings that abstain | 0.142±0.080 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.043±0.054 |
| presence style: present read present | 0.567±0.327 |
| presence style: share of 'present' readings that abstain | 0.950±0.100 |
| presence style: share of true 'present' readings that abstain | nan±nan |
| presence style: present read present [pooled midpoint (comparison)] | 0.567±0.327 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |
| presence source: share of FALSE 'present' readings that abstain | 0.867±0.194 |
| presence quantity: share of 'present' readings that abstain | nan±nan |
| presence quantity: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: present read present | 0.827±0.092 |
| presence color: share of true 'present' readings that abstain | 0.187±0.165 |
| presence color: present read present [pooled midpoint (comparison)] | 0.620±0.112 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.438±0.027; status {'abstain': 310, 'no-sense': 48, 'ok': 42}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.880 | 0.347 / 0.256 | 1.00 | 0.120 | 0.000 / 0.000 |
| role object | 0.749 | 0.160 / 0.000 | 0.72 | 0.085 | 0.119 / 0.165 |
| roles (pooled) | 0.783 | 0.144 / 0.000 | 0.72 | 0.051 | 0.117 / 0.166 |
| role size | 0.963 | 0.160 / 0.094 | 0.96 | 0.000 | 0.000 / 0.037 |
| role amount | 0.880 | 0.124 / 0.000 | 0.75 | 0.000 | 0.130 / 0.120 |
| role unit | 0.920 | 0.157 / 0.016 | 0.82 | 0.000 | 0.100 / 0.080 |
| role text | 0.839 | 0.178 / 0.011 | 0.84 | 0.075 | 0.075 / 0.086 |
| role relation | 0.929 | 0.163 / 0.029 | 0.87 | 0.012 | 0.071 / 0.060 |
| role landmark | 0.548 | 0.043 / 0.000 | 0.39 | 0.071 | 0.226 / 0.381 |
| role anchor | 1.000 | 0.196 / 0.064 | 0.92 | 0.000 | 0.077 / 0.000 |
| role fraction | 1.000 | 0.140 / 0.122 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.207 | 0.008 / 0.000 | 0.00 | 0.000 | 0.207 / 0.793 |
| role target | 0.517 | 0.029 / 0.000 | 0.17 | 0.034 | 0.379 / 0.448 |
| role region | 1.000 | 0.257 / 0.203 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.828 | 0.131 / 0.024 | 0.79 | 0.000 | 0.034 / 0.172 |
| role style | 0.400 | 0.027 / 0.000 | 0.20 | 0.200 | 0.400 / 0.400 |
| role color | 0.667 | 0.088 / 0.000 | 0.67 | 0.000 | 0.000 / 0.333 |

### new_identities_en — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.000±0.000 |
| FULL [depth given] | 0.000±0.000 |
| FULL [depth and negation given] | 0.000±0.000 |
| FULL [pooled midpoint (comparison)] | 0.000±0.000 |
| presence object: present read present | 0.910±0.045 |
| presence object: share of 'present' readings that abstain | 0.335±0.016 |
| presence object: share of true 'present' readings that abstain | 0.343±0.018 |
| presence color: absent read absent | 0.980±0.034 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.224±0.096 |
| presence size: share of true 'present' readings that abstain | 0.045±0.001 |
| presence style: absent read absent | 0.898±0.014 |
| presence text: absent read absent | 0.853±0.052 |
| presence relation: absent read absent | 0.904±0.052 |
| presence landmark: absent read absent | 0.970±0.022 |
| presence region: absent read absent | 0.995±0.006 |
| presence anchor: absent read absent | 0.992±0.005 |
| presence fraction: absent read absent | 0.990±0.004 |
| presence amount: present read present | 0.956±0.041 |
| presence amount: share of 'present' readings that abstain | 0.995±0.009 |
| presence amount: share of true 'present' readings that abstain | 0.995±0.009 |
| presence unit: present read present | 0.969±0.020 |
| presence unit: share of 'present' readings that abstain | 0.103±0.032 |
| presence unit: share of true 'present' readings that abstain | 0.100±0.036 |
| presence direction: absent read absent | 0.989±0.006 |
| presence axis: absent read absent | 0.999±0.001 |
| presence layout: absent read absent | 0.994±0.012 |
| presence pairing: absent read absent | 0.998±0.003 |
| presence source: absent read absent | 0.982±0.013 |
| presence target: absent read absent | 0.995±0.006 |
| presence quantity: absent read absent | 0.939±0.028 |
| structure (depth, negation) | 0.693±0.029 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.693±0.029 |
| event type (synonym table) | 0.693±0.029 |
| role object | 0.507±0.036 |
| head object | 0.539±0.035 |
| lexical order head object | 0.033±0.000 |
| lexical bag head object | 0.870±0.000 |
| occupancy: known filler | 0.775±0.032 |
| role color | 0.979±0.022 |
| head color | 0.979±0.022 |
| lexical order head color | 0.985±0.000 |
| lexical bag head color | 0.988±0.000 |
| occupancy: not given | 0.980±0.004 |
| role size | 0.973±0.009 |
| head size | 0.973±0.009 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.978±0.000 |
| role style | 0.920±0.009 |
| head style | 0.920±0.009 |
| lexical order head style | 0.988±0.000 |
| lexical bag head style | 0.988±0.000 |
| role text | 0.478±0.020 |
| head text | 0.478±0.020 |
| lexical order head text | 0.535±0.000 |
| lexical bag head text | 0.640±0.000 |
| role relation | 0.899±0.017 |
| head relation | 0.899±0.017 |
| lexical order head relation | 0.790±0.000 |
| lexical bag head relation | 0.838±0.000 |
| role landmark | 0.826±0.017 |
| head landmark | 0.841±0.017 |
| lexical order head landmark | 0.790±0.000 |
| lexical bag head landmark | 0.812±0.000 |
| role region | 0.996±0.004 |
| head region | 0.996±0.004 |
| lexical order head region | 0.955±0.000 |
| lexical bag head region | 0.955±0.000 |
| role anchor | 0.988±0.004 |
| head anchor | 0.988±0.004 |
| lexical order head anchor | 0.968±0.000 |
| lexical bag head anchor | 0.988±0.000 |
| role fraction | 0.986±0.003 |
| head fraction | 0.986±0.003 |
| lexical order head fraction | 0.988±0.000 |
| lexical bag head fraction | 0.993±0.000 |
| role amount | 0.749±0.002 |
| head amount | 0.749±0.002 |
| lexical order head amount | 0.750±0.000 |
| lexical bag head amount | 0.820±0.000 |
| occupancy: unknown filler | 0.543±0.047 |
| role unit | 0.955±0.009 |
| head unit | 0.955±0.009 |
| lexical order head unit | 0.750±0.000 |
| lexical bag head unit | 0.820±0.000 |
| role direction | 0.973±0.004 |
| head direction | 0.973±0.004 |
| lexical order head direction | 0.927±0.000 |
| lexical bag head direction | 0.940±0.000 |
| role axis | 1.000±0.001 |
| head axis | 1.000±0.001 |
| lexical order head axis | 1.000±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 0.996±0.008 |
| head layout | 0.996±0.008 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.998±0.002 |
| head pairing | 0.998±0.002 |
| lexical order head pairing | 1.000±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.916±0.008 |
| head source | 0.916±0.008 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.943±0.000 |
| role target | 0.930±0.004 |
| head target | 0.930±0.004 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.940±0.000 |
| role quantity | 0.957±0.020 |
| head quantity | 0.957±0.020 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.000±0.000 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.245±0.000 |
| role object [pooled midpoint (comparison)] | 0.457±0.016 |
| role color [pooled midpoint (comparison)] | 0.992±0.001 |
| role size [pooled midpoint (comparison)] | 0.982±0.004 |
| role style [pooled midpoint (comparison)] | 0.924±0.024 |
| role text [pooled midpoint (comparison)] | 0.504±0.004 |
| role relation [pooled midpoint (comparison)] | 0.920±0.010 |
| role landmark [pooled midpoint (comparison)] | 0.839±0.011 |
| role region [pooled midpoint (comparison)] | 0.996±0.001 |
| role anchor [pooled midpoint (comparison)] | 0.992±0.001 |
| role fraction [pooled midpoint (comparison)] | 0.990±0.003 |
| role amount [pooled midpoint (comparison)] | 0.750±0.000 |
| role unit [pooled midpoint (comparison)] | 0.929±0.008 |
| role direction [pooled midpoint (comparison)] | 0.964±0.005 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 0.999±0.002 |
| role source [pooled midpoint (comparison)] | 0.926±0.002 |
| role target [pooled midpoint (comparison)] | 0.933±0.002 |
| role quantity [pooled midpoint (comparison)] | 0.966±0.009 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.000±0.000 |
| presence object: present read present [pooled midpoint (comparison)] | 0.870±0.009 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.892±0.039 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.912±0.012 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.999±0.002 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.996±0.005 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.917±0.038 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.932±0.025 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.997±0.002 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.945±0.014 |
| presence size: absent read absent | 0.978±0.014 |
| presence text: present read present | 0.859±0.051 |
| presence text: share of 'present' readings that abstain | 1.000±0.000 |
| presence text: share of true 'present' readings that abstain | 1.000±0.000 |
| presence amount: absent read absent | 0.997±0.004 |
| presence unit: absent read absent | 0.999±0.002 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.994±0.003 |
| presence text: present read present [pooled midpoint (comparison)] | 0.756±0.019 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.662±0.195 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence source: present read present | 0.855±0.045 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.807±0.057 |
| presence target: share of 'present' readings that abstain | 0.990±0.019 |
| presence target: share of true 'present' readings that abstain | 0.989±0.022 |
| determiner identity (outside FULL when the legend excludes it) | 0.604±0.050 |
| presence source: present read present [pooled midpoint (comparison)] | 0.689±0.027 |
| presence target: present read present [pooled midpoint (comparison)] | 0.702±0.029 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.175±0.075 |
| presence anchor: share of true 'present' readings that abstain | 0.020±0.040 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: present read present | 0.948±0.029 |
| presence relation: share of 'present' readings that abstain | 0.286±0.099 |
| presence relation: share of true 'present' readings that abstain | 0.083±0.027 |
| presence landmark: present read present | 0.903±0.052 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.867±0.015 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.867±0.018 |
| presence landmark: share of 'present' readings that abstain | 0.969±0.018 |
| presence landmark: share of true 'present' readings that abstain | 0.965±0.020 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.057±0.074 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.992±0.015 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: present read present | 0.924±0.089 |
| presence direction: share of 'present' readings that abstain | 0.195±0.044 |
| presence direction: share of true 'present' readings that abstain | 0.098±0.034 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.724±0.044 |
| presence direction: share of FALSE 'present' readings that abstain | nan±nan |
| presence quantity: share of 'present' readings that abstain | 1.000±0.000 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence object: absent read absent | 0.057±0.070 |
| presence object: share of FALSE 'present' readings that abstain | 0.033±0.067 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.000±0.000 |
| presence style: present read present | nan±nan |
| presence style: share of true 'present' readings that abstain | nan±nan |
| presence style: present read present [pooled midpoint (comparison)] | nan±nan |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.573±0.162 |
| presence fraction: share of true 'present' readings that abstain | 0.200±0.245 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: share of FALSE 'present' readings that abstain | nan±nan |
| presence fraction: share of FALSE 'present' readings that abstain | 0.933±0.133 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of true 'present' readings that abstain | 0.520±0.194 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 0.817±0.153 |

residual mean 0.626±0.015; status {'abstain': 286, 'no-sense': 112, 'ok': 2}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.720 | 0.347 / 0.256 | 1.00 | 0.280 | 0.000 / 0.000 |
| role object | 0.537 | 0.101 / 0.000 | 0.55 | 0.152 | 0.145 / 0.310 |
| roles (pooled) | 0.421 | 0.075 / 0.000 | 0.41 | 0.077 | 0.085 / 0.502 |
| role size | 0.815 | 0.127 / 0.063 | 0.89 | 0.111 | 0.037 / 0.074 |
| role amount | 0.000 | 0.008 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role unit | 0.860 | 0.163 / 0.016 | 0.82 | 0.050 | 0.090 / 0.090 |
| role text | 0.000 | 0.011 / 0.000 | 0.01 | 0.005 | 0.000 / 0.995 |
| role relation | 0.810 | 0.126 / 0.029 | 0.87 | 0.107 | 0.048 / 0.083 |
| role landmark | 0.250 | 0.012 / 0.000 | 0.02 | 0.000 | 0.226 / 0.750 |
| role anchor | 0.769 | 0.166 / 0.064 | 0.92 | 0.231 | 0.077 / 0.000 |
| role fraction | 0.400 | 0.084 / 0.059 | 1.00 | 0.600 | 0.000 / 0.000 |
| role source | 0.000 | 0.007 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role target | 0.034 | 0.010 / 0.000 | 0.00 | 0.000 | 0.034 / 0.966 |
| role region | 1.000 | 0.191 / 0.131 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.793 | 0.108 / 0.024 | 0.79 | 0.034 | 0.034 / 0.172 |
| role style | 0.400 | 0.027 / 0.000 | 0.20 | 0.200 | 0.400 / 0.400 |
| role color | 0.500 | 0.042 / 0.000 | 0.50 | 0.000 | 0.000 / 0.500 |

### train (sample) — catalog candidates (n = 300 of 4524)
| axis | accuracy |
|---|---|
| FULL | 0.633±0.037 |
| FULL [depth given] | 0.633±0.037 |
| FULL [depth and negation given] | 0.633±0.037 |
| presence object: present read present | 0.950±0.030 |
| presence object: share of 'present' readings that abstain | 0.097±0.020 |
| presence object: share of true 'present' readings that abstain | 0.096±0.019 |
| presence color: absent read absent | 0.983±0.012 |
| presence size: absent read absent | 0.981±0.003 |
| presence style: absent read absent | 0.971±0.011 |
| presence text: absent read absent | 0.994±0.002 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.009±0.018 |
| presence anchor: share of true 'present' readings that abstain | 0.009±0.018 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 0.998±0.002 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.999±0.002 |
| presence target: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 0.999±0.002 |
| structure (depth, negation) | 0.835±0.043 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.835±0.043 |
| event type (synonym table) | 0.835±0.043 |
| role object | 0.721±0.058 |
| head object | 0.773±0.066 |
| lexical order head object | 0.050±0.000 |
| lexical bag head object | 0.513±0.000 |
| occupancy: known filler | 0.818±0.043 |
| role color | 0.983±0.011 |
| head color | 0.983±0.011 |
| lexical order head color | 0.973±0.000 |
| lexical bag head color | 0.980±0.000 |
| occupancy: not given | 0.996±0.001 |
| role size | 0.965±0.002 |
| head size | 0.965±0.002 |
| lexical order head size | 0.920±0.000 |
| lexical bag head size | 0.973±0.000 |
| role style | 0.973±0.008 |
| head style | 0.973±0.008 |
| lexical order head style | 0.980±0.000 |
| lexical bag head style | 0.983±0.000 |
| role text | 0.971±0.004 |
| head text | 0.971±0.004 |
| lexical order head text | 0.903±0.000 |
| lexical bag head text | 0.997±0.000 |
| role relation | 0.977±0.009 |
| head relation | 0.977±0.009 |
| lexical order head relation | 0.883±0.000 |
| lexical bag head relation | 0.967±0.000 |
| role landmark | 0.955±0.005 |
| head landmark | 0.971±0.009 |
| lexical order head landmark | 0.883±0.000 |
| lexical bag head landmark | 0.913±0.000 |
| role region | 0.996±0.001 |
| head region | 0.996±0.001 |
| lexical order head region | 0.920±0.000 |
| lexical bag head region | 1.000±0.000 |
| role anchor | 0.987±0.001 |
| head anchor | 0.987±0.001 |
| lexical order head anchor | 0.917±0.000 |
| lexical bag head anchor | 1.000±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.967±0.000 |
| lexical bag head fraction | 0.997±0.000 |
| role amount | 0.994±0.003 |
| head amount | 0.994±0.003 |
| lexical order head amount | 0.903±0.000 |
| lexical bag head amount | 0.997±0.000 |
| role unit | 0.993±0.003 |
| head unit | 0.993±0.003 |
| lexical order head unit | 0.903±0.000 |
| lexical bag head unit | 0.990±0.000 |
| role direction | 0.997±0.002 |
| head direction | 0.997±0.002 |
| lexical order head direction | 0.933±0.000 |
| lexical bag head direction | 0.967±0.000 |
| role axis | 0.994±0.002 |
| head axis | 0.994±0.002 |
| lexical order head axis | 0.967±0.000 |
| lexical bag head axis | 0.987±0.000 |
| role layout | 0.993±0.002 |
| head layout | 0.993±0.002 |
| lexical order head layout | 0.953±0.000 |
| lexical bag head layout | 0.983±0.000 |
| role pairing | 0.997±0.002 |
| head pairing | 0.997±0.002 |
| lexical order head pairing | 0.983±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.939±0.007 |
| head source | 0.958±0.010 |
| lexical order head source | 0.903±0.000 |
| lexical bag head source | 0.933±0.000 |
| role target | 0.977±0.004 |
| head target | 0.989±0.004 |
| lexical order head target | 0.920±0.000 |
| lexical bag head target | 0.940±0.000 |
| role quantity | 0.999±0.001 |
| head quantity | 0.999±0.001 |
| lexical order head quantity | 0.990±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.696±0.044 |
| heads FULL (lexical order baseline) | 0.003±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.400±0.000 |
| presence color: present read present | 0.950±0.061 |
| presence color: share of 'present' readings that abstain | 0.219±0.143 |
| presence color: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence text: present read present | 0.957±0.026 |
| presence text: share of 'present' readings that abstain | 0.059±0.042 |
| presence text: share of true 'present' readings that abstain | 0.053±0.051 |
| determiner identity (outside FULL when the legend excludes it) | 0.802±0.064 |
| presence region: present read present | 0.983±0.021 |
| presence region: share of 'present' readings that abstain | 0.053±0.032 |
| presence region: share of true 'present' readings that abstain | 0.053±0.032 |
| presence relation: present read present | 0.993±0.015 |
| presence relation: share of 'present' readings that abstain | 0.071±0.039 |
| presence relation: share of true 'present' readings that abstain | 0.071±0.039 |
| presence landmark: present read present | 0.933±0.084 |
| presence landmark: share of 'present' readings that abstain | 0.260±0.097 |
| presence landmark: share of true 'present' readings that abstain | 0.260±0.097 |
| presence amount: present read present | 0.993±0.014 |
| presence amount: share of 'present' readings that abstain | 0.000±0.000 |
| presence amount: share of true 'present' readings that abstain | 0.000±0.000 |
| presence unit: present read present | 0.978±0.018 |
| presence unit: share of 'present' readings that abstain | 0.022±0.030 |
| presence unit: share of true 'present' readings that abstain | 0.022±0.030 |
| presence style: share of 'present' readings that abstain | 0.520±0.206 |
| presence style: share of FALSE 'present' readings that abstain | 0.639±0.167 |
| presence layout: present read present | 0.938±0.075 |
| presence layout: share of 'present' readings that abstain | 0.059±0.057 |
| presence layout: share of true 'present' readings that abstain | 0.031±0.062 |
| presence size: present read present | 0.871±0.067 |
| presence object: absent read absent | 0.724±0.031 |
| presence source: present read present | 0.697±0.071 |
| presence target: present read present | 0.946±0.019 |
| presence target: share of 'present' readings that abstain | 0.239±0.080 |
| presence target: share of true 'present' readings that abstain | 0.239±0.080 |
| presence size: share of 'present' readings that abstain | 0.017±0.021 |
| presence size: share of true 'present' readings that abstain | 0.000±0.000 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.183±0.153 |
| presence quantity: share of true 'present' readings that abstain | 0.133±0.163 |
| presence direction: present read present | 0.990±0.020 |
| presence direction: share of 'present' readings that abstain | 0.021±0.025 |
| presence direction: share of true 'present' readings that abstain | 0.021±0.025 |
| presence source: share of 'present' readings that abstain | 0.645±0.040 |
| presence source: share of true 'present' readings that abstain | 0.643±0.037 |
| presence style: present read present | 0.960±0.080 |
| presence style: share of true 'present' readings that abstain | 0.373±0.222 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.022±0.044 |
| presence axis: share of true 'present' readings that abstain | 0.022±0.044 |
| presence text: share of FALSE 'present' readings that abstain | 0.100±0.200 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence quantity: share of FALSE 'present' readings that abstain | nan±nan |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.090±0.111 |
| presence pairing: share of true 'present' readings that abstain | 0.090±0.111 |
| presence object: share of FALSE 'present' readings that abstain | 0.100±0.200 |
| presence size: share of FALSE 'present' readings that abstain | 0.080±0.098 |

residual mean 0.442±0.034; status {'abstain': 210, 'ok': 48, 'no-sense': 42}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.860 | 0.367 / 0.260 | 1.00 | 0.140 | 0.000 / 0.000 |
| role object | 0.758 | 0.217 / 0.001 | 0.81 | 0.119 | 0.070 / 0.123 |
| roles (pooled) | 0.778 | 0.184 / 0.000 | 0.79 | 0.079 | 0.071 / 0.143 |
| role anchor | 0.840 | 0.212 / 0.069 | 0.92 | 0.080 | 0.000 / 0.080 |
| role color | 0.875 | 0.151 / 0.071 | 0.88 | 0.000 | 0.000 / 0.125 |
| role text | 0.793 | 0.184 / 0.000 | 0.79 | 0.069 | 0.069 / 0.138 |
| role region | 0.958 | 0.218 / 0.061 | 0.88 | 0.000 | 0.083 / 0.042 |
| role relation | 0.886 | 0.165 / 0.035 | 0.89 | 0.057 | 0.057 / 0.057 |
| role landmark | 0.600 | 0.065 / 0.000 | 0.46 | 0.057 | 0.200 / 0.343 |
| role amount | 0.931 | 0.173 / 0.092 | 0.93 | 0.000 | 0.000 / 0.069 |
| role unit | 0.931 | 0.212 / 0.107 | 0.97 | 0.034 | 0.000 / 0.034 |
| role layout | 0.786 | 0.204 / 0.037 | 0.86 | 0.071 | 0.000 / 0.143 |
| role size | 0.750 | 0.150 / 0.000 | 0.79 | 0.042 | 0.000 / 0.208 |
| role source | 0.310 | 0.022 / 0.000 | 0.21 | 0.069 | 0.172 / 0.621 |
| role target | 0.750 | 0.102 / 0.025 | 0.67 | 0.083 | 0.167 / 0.167 |
| role quantity | 1.000 | 0.141 / 0.088 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.241 / 0.156 | 0.95 | 0.000 | 0.050 / 0.000 |
| role pairing | 0.600 | 0.135 / 0.024 | 0.80 | 0.200 | 0.000 / 0.200 |
| role axis | 0.800 | 0.244 / 0.067 | 0.90 | 0.100 | 0.000 / 0.100 |
| role style | 0.833 | 0.051 / 0.011 | 0.33 | 0.000 | 0.500 / 0.167 |
| role fraction | 1.000 | 0.210 / 0.165 | 1.00 | 0.000 | 0.000 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 COMPONENT=0.97 PAIR=0.92 UNIT=0.88 ANCHOR=0.83 DIR=0.83 AXIS=0.71 not=0.70 back=0.61 REGION=0.59 never=0.51 flow=0.48 LABEL=0.45 FILLER=0.43 do=0.42 front=0.42 VERB=0.40 dimensiunea=0.36 LAYOUT=0.34 apart=0.24 REL=0.12 CONN=0.12 din=0.12 together=0.12 unknown=0.12 PRON=0.10 are=0.09 is=0.08 color=0.05 pe=0.05 care=0.05 evenly=0.03 lui=0.03 INTRO=0.02 cu=0.02 spre=0.01 FRACTION=0.01 SIZE=0.01 DEM=0.01 de=0.01 la=0.01 STYLE=0.01 COLOR=0.00 QUANT=0.00 the=0.00 NUM=0.00 a=0.00

## What is weak, what to add
- heldout_formulations: FULL 0.529
- heldout_formulations: presence object: share of 'present' readings that abstain 0.160
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.160
- heldout_formulations: presence size: share of 'present' readings that abstain 0.174
- heldout_formulations: presence size: share of true 'present' readings that abstain 0.118
- heldout_formulations: structure (depth, negation) 0.883
- heldout_formulations: predicate (surface lemma) 0.883
- heldout_formulations: event type (synonym table) 0.883
- heldout_formulations: role object 0.699
- heldout_formulations: head object 0.767
- heldout_formulations: occupancy: known filler 0.822
- heldout_formulations: role source 0.854
- heldout_formulations: head source 0.869
- heldout_formulations: heads FULL (model) 0.617
- heldout_formulations: heads FULL (lexical order baseline) 0.019
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.044
- heldout_formulations: FULL [depth given] 0.529
- heldout_formulations: FULL [depth and negation given] 0.529
- heldout_formulations: FULL [presence not decided] 0.413
- heldout_formulations: role object [presence not decided] 0.748
- heldout_formulations: role color [presence not decided] 0.772
- heldout_formulations: role size [presence not decided] 0.854
- heldout_formulations: role style [presence not decided] 0.893
- heldout_formulations: role source [presence not decided] 0.854
- heldout_formulations: heads FULL (model) [presence not decided] 0.466
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.417
- heldout_formulations: role object [pooled midpoint (comparison)] 0.563
- heldout_formulations: role source [pooled midpoint (comparison)] 0.850
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.485
- heldout_formulations: presence text: present read present 0.850
- heldout_formulations: presence text: share of 'present' readings that abstain 0.263
- heldout_formulations: presence text: share of true 'present' readings that abstain 0.235
- heldout_formulations: presence text: present read present [pooled midpoint (comparison)] 0.800
- heldout_formulations: presence source: present read present 0.448
- heldout_formulations: presence target: present read present 0.885
- heldout_formulations: presence target: share of 'present' readings that abstain 0.174
- heldout_formulations: presence target: share of true 'present' readings that abstain 0.174
- heldout_formulations: determiner identity (outside FULL when the legend excludes it) 0.814
- heldout_formulations: presence source: present read present [pooled midpoint (comparison)] 0.407
- heldout_formulations: presence pairing: share of 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence source: share of 'present' readings that abstain 0.692
- heldout_formulations: presence source: share of true 'present' readings that abstain 0.692
- heldout_formulations: presence anchor: share of 'present' readings that abstain 0.091
- heldout_formulations: presence anchor: share of true 'present' readings that abstain 0.091
- heldout_formulations: presence fraction: share of 'present' readings that abstain 0.091
- heldout_formulations: presence fraction: share of true 'present' readings that abstain 0.091
- heldout_formulations: presence color: share of 'present' readings that abstain 0.692
- heldout_formulations: presence color: share of FALSE 'present' readings that abstain 0.750
- heldout_formulations: presence style: share of 'present' readings that abstain 0.500
- heldout_formulations: presence style: share of FALSE 'present' readings that abstain 0.875
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.042
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.042
- heldout_formulations: presence landmark: present read present 0.840
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.048
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.048
- heldout_formulations: presence amount: share of 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence landmark: present read present [pooled midpoint (comparison)] 0.870
- heldout_formulations: presence style: share of true 'present' readings that abstain 0.200
- heldout_formulations: presence region: share of 'present' readings that abstain 0.077
- heldout_formulations: presence region: share of true 'present' readings that abstain 0.077
- heldout_formulations: presence region: present read present [pooled midpoint (comparison)] 0.667
- heldout_formulations: presence quantity: share of 'present' readings that abstain 0.400
- heldout_formulations: presence quantity: share of true 'present' readings that abstain 0.400
- heldout_formulations: presence size: share of FALSE 'present' readings that abstain 0.333
- heldout_formulations: presence color: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence text: share of FALSE 'present' readings that abstain 0.500
- heldout_formulations: presence axis: share of 'present' readings that abstain 0.000
- heldout_formulations: presence axis: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: FULL 0.590
- heldout_formulations_en: structure (depth, negation) 0.820
- heldout_formulations_en: predicate (surface lemma) 0.820
- heldout_formulations_en: event type (synonym table) 0.820
- heldout_formulations_en: role object 0.669
- heldout_formulations_en: head object 0.713
- heldout_formulations_en: determiner identity (outside FULL when the legend excludes it) 0.795
- heldout_formulations_en: occupancy: known filler 0.836
- heldout_formulations_en: heads FULL (model) 0.629
- heldout_formulations_en: heads FULL (lexical order baseline) 0.017
- heldout_formulations_en: heads FULL (lexical bag baseline, trained on the same training rows) 0.309
- heldout_formulations_en: FULL [depth given] 0.590
- heldout_formulations_en: FULL [depth and negation given] 0.590
- heldout_formulations_en: FULL [presence not decided] 0.371
- heldout_formulations_en: role object [presence not decided] 0.781
- heldout_formulations_en: role color [presence not decided] 0.736
- heldout_formulations_en: role size [presence not decided] 0.882
- heldout_formulations_en: role style [presence not decided] 0.899
- heldout_formulations_en: role landmark [presence not decided] 0.831
- heldout_formulations_en: role source [presence not decided] 0.831
- heldout_formulations_en: heads FULL (model) [presence not decided] 0.382
- heldout_formulations_en: FULL [pooled midpoint (comparison)] 0.511
- heldout_formulations_en: role object [pooled midpoint (comparison)] 0.596
- heldout_formulations_en: heads FULL (model) [pooled midpoint (comparison)] 0.556
- heldout_formulations_en: presence direction: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence direction: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence object: share of 'present' readings that abstain 0.176
- heldout_formulations_en: presence object: share of true 'present' readings that abstain 0.176
- heldout_formulations_en: presence relation: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence relation: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence landmark: share of 'present' readings that abstain 0.632
- heldout_formulations_en: presence landmark: share of true 'present' readings that abstain 0.632
- heldout_formulations_en: presence relation: present read present [pooled midpoint (comparison)] 0.800
- heldout_formulations_en: presence landmark: present read present [pooled midpoint (comparison)] 0.850
- heldout_formulations_en: presence text: share of 'present' readings that abstain 0.130
- heldout_formulations_en: presence text: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence target: share of 'present' readings that abstain 0.778
- heldout_formulations_en: presence target: share of true 'present' readings that abstain 0.778
- heldout_formulations_en: presence quantity: share of 'present' readings that abstain 0.273
- heldout_formulations_en: presence quantity: share of true 'present' readings that abstain 0.273
- heldout_formulations_en: presence size: share of 'present' readings that abstain 0.400
- heldout_formulations_en: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence fraction: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence region: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence region: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence size: share of true 'present' readings that abstain 0.100
- heldout_formulations_en: presence amount: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence amount: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence size: present read present [pooled midpoint (comparison)] 0.818
- heldout_formulations_en: presence style: present read present 0.400
- heldout_formulations_en: presence style: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence style: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence style: present read present [pooled midpoint (comparison)] 0.600
- heldout_formulations_en: presence source: share of FALSE 'present' readings that abstain 0.000
- heldout_formulations_en: presence text: share of FALSE 'present' readings that abstain 0.750
- heldout_sentences: FULL 0.601
- heldout_sentences: presence object: share of 'present' readings that abstain 0.106
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.111
- heldout_sentences: presence region: present read present 0.879
- heldout_sentences: presence region: share of 'present' readings that abstain 0.034
- heldout_sentences: presence region: share of true 'present' readings that abstain 0.034
- heldout_sentences: structure (depth, negation) 0.863
- heldout_sentences: predicate (surface lemma) 0.863
- heldout_sentences: event type (synonym table) 0.863
- heldout_sentences: role object 0.731
- heldout_sentences: head object 0.784
- heldout_sentences: determiner identity (outside FULL when the legend excludes it) 0.821
- heldout_sentences: occupancy: known filler 0.819
- heldout_sentences: role source 0.895
- heldout_sentences: heads FULL (model) 0.655
- heldout_sentences: heads FULL (lexical order baseline) 0.006
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.208
- heldout_sentences: FULL [depth given] 0.601
- heldout_sentences: FULL [depth and negation given] 0.601
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.500
- heldout_sentences: role object [pooled midpoint (comparison)] 0.653
- heldout_sentences: role source [pooled midpoint (comparison)] 0.891
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.544
- heldout_sentences: presence object: absent read absent 0.424
- heldout_sentences: presence object: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: presence color: share of 'present' readings that abstain 0.333
- heldout_sentences: presence color: share of FALSE 'present' readings that abstain 0.615
- heldout_sentences: presence source: present read present 0.500
- heldout_sentences: presence target: present read present 0.825
- heldout_sentences: presence object: absent read absent [pooled midpoint (comparison)] 0.556
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.587
- heldout_sentences: presence target: present read present [pooled midpoint (comparison)] 0.857
- heldout_sentences: presence source: share of 'present' readings that abstain 0.786
- heldout_sentences: presence source: share of true 'present' readings that abstain 0.778
- heldout_sentences: presence target: share of 'present' readings that abstain 0.333
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.333
- heldout_sentences: presence size: present read present 0.833
- heldout_sentences: presence size: share of 'present' readings that abstain 0.071
- heldout_sentences: presence size: share of true 'present' readings that abstain 0.040
- heldout_sentences: presence size: present read present [pooled midpoint (comparison)] 0.786
- heldout_sentences: presence layout: present read present 0.857
- heldout_sentences: presence layout: share of 'present' readings that abstain 0.167
- heldout_sentences: presence layout: share of true 'present' readings that abstain 0.167
- heldout_sentences: presence layout: present read present [pooled midpoint (comparison)] 0.810
- heldout_sentences: presence axis: share of 'present' readings that abstain 0.111
- heldout_sentences: presence axis: share of true 'present' readings that abstain 0.111
- heldout_sentences: presence axis: present read present [pooled midpoint (comparison)] 0.875
- heldout_sentences: presence text: share of 'present' readings that abstain 0.060
- heldout_sentences: presence text: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence pairing: share of 'present' readings that abstain 0.071
- heldout_sentences: presence pairing: share of true 'present' readings that abstain 0.071
- heldout_sentences: presence relation: share of 'present' readings that abstain 0.049
- heldout_sentences: presence relation: share of true 'present' readings that abstain 0.049
- heldout_sentences: presence landmark: present read present 0.806
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.269
- heldout_sentences: presence landmark: share of true 'present' readings that abstain 0.260
- heldout_sentences: presence relation: present read present [pooled midpoint (comparison)] 0.800
- heldout_sentences: presence landmark: present read present [pooled midpoint (comparison)] 0.800
- heldout_sentences: presence anchor: share of 'present' readings that abstain 0.050
- heldout_sentences: presence anchor: share of true 'present' readings that abstain 0.050
- heldout_sentences: presence direction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence direction: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence style: present read present 0.500
- heldout_sentences: presence style: present read present [pooled midpoint (comparison)] 0.500
- heldout_sentences: presence amount: share of 'present' readings that abstain 0.073
- heldout_sentences: presence amount: share of true 'present' readings that abstain 0.073
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.049
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.049
- heldout_sentences: presence style: share of 'present' readings that abstain 0.769
- heldout_sentences: presence style: share of FALSE 'present' readings that abstain 0.833
- heldout_sentences: presence size: share of FALSE 'present' readings that abstain 0.333
- heldout_sentences: presence fraction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence style: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence color: present read present 0.824
- heldout_sentences: presence color: share of true 'present' readings that abstain 0.071
- heldout_sentences: presence color: present read present [pooled midpoint (comparison)] 0.688
- heldout_sentences: presence text: share of FALSE 'present' readings that abstain 0.667
- heldout_sentences: presence quantity: share of 'present' readings that abstain 0.333
- heldout_sentences: presence quantity: share of true 'present' readings that abstain 0.333
- heldout_sentences: presence landmark: share of FALSE 'present' readings that abstain 0.500
- mixed: FULL 0.565
- mixed: presence object: share of 'present' readings that abstain 0.063
- mixed: presence object: share of true 'present' readings that abstain 0.059
- mixed: presence relation: share of 'present' readings that abstain 0.023
- mixed: presence relation: share of true 'present' readings that abstain 0.023
- mixed: presence landmark: present read present 0.841
- mixed: structure (depth, negation) 0.823
- mixed: predicate (surface lemma) 0.823
- mixed: event type (synonym table) 0.823
- mixed: role object 0.695
- mixed: head object 0.740
- mixed: determiner identity (outside FULL when the legend excludes it) 0.801
- mixed: occupancy: known filler 0.786
- mixed: heads FULL (model) 0.613
- mixed: heads FULL (lexical order baseline) 0.013
- mixed: heads FULL (lexical bag baseline, trained on the same training rows) 0.100
- mixed: FULL [depth given] 0.565
- mixed: FULL [depth and negation given] 0.565
- mixed: FULL [pooled midpoint (comparison)] 0.432
- mixed: role object [pooled midpoint (comparison)] 0.588
- mixed: heads FULL (model) [pooled midpoint (comparison)] 0.487
- mixed: presence anchor: present read present 0.833
- mixed: presence anchor: share of 'present' readings that abstain 0.120
- mixed: presence anchor: share of true 'present' readings that abstain 0.120
- mixed: presence object: present read present [pooled midpoint (comparison)] 0.879
- mixed: presence anchor: present read present [pooled midpoint (comparison)] 0.889
- mixed: presence layout: present read present 0.833
- mixed: presence layout: present read present [pooled midpoint (comparison)] 0.826
- mixed: presence amount: share of 'present' readings that abstain 0.000
- mixed: presence amount: share of true 'present' readings that abstain 0.000
- mixed: presence unit: share of 'present' readings that abstain 0.000
- mixed: presence unit: share of true 'present' readings that abstain 0.000
- mixed: presence size: share of 'present' readings that abstain 0.071
- mixed: presence size: share of FALSE 'present' readings that abstain 0.500
- mixed: presence source: present read present 0.487
- mixed: presence target: present read present 0.840
- mixed: presence target: share of 'present' readings that abstain 0.095
- mixed: presence target: share of true 'present' readings that abstain 0.095
- mixed: presence source: present read present [pooled midpoint (comparison)] 0.559
- mixed: presence target: present read present [pooled midpoint (comparison)] 0.739
- mixed: presence landmark: share of 'present' readings that abstain 0.189
- mixed: presence landmark: share of true 'present' readings that abstain 0.189
- mixed: presence relation: present read present [pooled midpoint (comparison)] 0.829
- mixed: presence landmark: present read present [pooled midpoint (comparison)] 0.800
- mixed: presence color: present read present 0.812
- mixed: presence color: share of 'present' readings that abstain 0.400
- mixed: presence color: share of true 'present' readings that abstain 0.000
- mixed: presence text: share of 'present' readings that abstain 0.065
- mixed: presence text: share of true 'present' readings that abstain 0.045
- mixed: presence layout: share of 'present' readings that abstain 0.150
- mixed: presence layout: share of true 'present' readings that abstain 0.150
- mixed: presence region: share of 'present' readings that abstain 0.071
- mixed: presence region: share of true 'present' readings that abstain 0.071
- mixed: presence region: present read present [pooled midpoint (comparison)] 0.621
- mixed: presence fraction: share of 'present' readings that abstain 0.000
- mixed: presence fraction: share of true 'present' readings that abstain 0.000
- mixed: presence axis: share of 'present' readings that abstain 0.000
- mixed: presence axis: share of true 'present' readings that abstain 0.000
- mixed: presence style: share of 'present' readings that abstain 0.500
- mixed: presence style: share of FALSE 'present' readings that abstain 0.833
- mixed: presence color: share of FALSE 'present' readings that abstain 0.833
- mixed: presence quantity: share of 'present' readings that abstain 0.167
- mixed: presence quantity: share of true 'present' readings that abstain 0.167
- mixed: presence direction: share of 'present' readings that abstain 0.059
- mixed: presence direction: share of true 'present' readings that abstain 0.059
- mixed: presence object: absent read absent 0.583
- mixed: presence pairing: share of 'present' readings that abstain 0.071
- mixed: presence pairing: share of true 'present' readings that abstain 0.071
- mixed: presence source: share of 'present' readings that abstain 0.895
- mixed: presence source: share of true 'present' readings that abstain 0.895
- mixed: presence object: absent read absent [pooled midpoint (comparison)] 0.700
- mixed: presence style: present read present 0.800
- mixed: presence style: share of true 'present' readings that abstain 0.000
- mixed: presence object: share of FALSE 'present' readings that abstain 0.200
- mixed: presence size: share of true 'present' readings that abstain 0.000
- mixed: presence text: share of FALSE 'present' readings that abstain 0.500
- new_identities: FULL 0.667
- new_identities: presence object: share of 'present' readings that abstain 0.073
- new_identities: presence object: share of true 'present' readings that abstain 0.075
- new_identities: presence text: absent read absent 0.898
- new_identities: structure (depth, negation) 0.855
- new_identities: predicate (surface lemma) 0.855
- new_identities: event type (synonym table) 0.855
- new_identities: role object 0.772
- new_identities: head object 0.785
- new_identities: occupancy: unknown filler 0.784
- new_identities: role text 0.875
- new_identities: head text 0.875
- new_identities: heads FULL (model) 0.677
- new_identities: heads FULL (lexical order baseline) 0.000
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.105
- new_identities: FULL [depth given] 0.667
- new_identities: FULL [depth and negation given] 0.667
- new_identities: FULL [pooled midpoint (comparison)] 0.520
- new_identities: role object [pooled midpoint (comparison)] 0.618
- new_identities: role text [pooled midpoint (comparison)] 0.805
- new_identities: role landmark [pooled midpoint (comparison)] 0.897
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.527
- new_identities: presence anchor: share of 'present' readings that abstain 0.000
- new_identities: presence anchor: share of true 'present' readings that abstain 0.000
- new_identities: presence fraction: share of 'present' readings that abstain 0.167
- new_identities: presence fraction: share of true 'present' readings that abstain 0.167
- new_identities: occupancy: known filler 0.854
- new_identities: presence object: present read present [pooled midpoint (comparison)] 0.886
- new_identities: presence amount: share of 'present' readings that abstain 0.011
- new_identities: presence amount: share of true 'present' readings that abstain 0.011
- new_identities: presence unit: share of 'present' readings that abstain 0.000
- new_identities: presence unit: share of true 'present' readings that abstain 0.000
- new_identities: presence direction: share of 'present' readings that abstain 0.000
- new_identities: presence direction: share of true 'present' readings that abstain 0.000
- new_identities: presence region: share of 'present' readings that abstain 0.211
- new_identities: presence region: share of true 'present' readings that abstain 0.211
- new_identities: presence region: present read present [pooled midpoint (comparison)] 0.733
- new_identities: presence text: share of 'present' readings that abstain 0.088
- new_identities: presence text: share of true 'present' readings that abstain 0.053
- new_identities: presence relation: share of 'present' readings that abstain 0.061
- new_identities: presence relation: share of true 'present' readings that abstain 0.061
- new_identities: presence landmark: present read present 0.691
- new_identities: presence relation: present read present [pooled midpoint (comparison)] 0.821
- new_identities: presence landmark: present read present [pooled midpoint (comparison)] 0.732
- new_identities: presence object: absent read absent 0.250
- new_identities: presence object: share of FALSE 'present' readings that abstain 0.000
- new_identities: presence text: share of FALSE 'present' readings that abstain 0.368
- new_identities: presence source: present read present 0.385
- new_identities: presence target: present read present 0.769
- new_identities: presence object: absent read absent [pooled midpoint (comparison)] 0.286
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.375
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.708
- new_identities: presence style: share of 'present' readings that abstain 0.625
- new_identities: presence style: share of FALSE 'present' readings that abstain 0.714
- new_identities: presence landmark: share of 'present' readings that abstain 0.125
- new_identities: presence landmark: share of true 'present' readings that abstain 0.106
- new_identities: presence size: share of 'present' readings that abstain 0.125
- new_identities: presence size: share of true 'present' readings that abstain 0.000
- new_identities: presence color: share of 'present' readings that abstain 0.455
- new_identities: presence color: share of FALSE 'present' readings that abstain 0.714
- new_identities: presence color: present read present 0.500
- new_identities: presence color: share of true 'present' readings that abstain 0.000
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.571
- new_identities: presence style: share of true 'present' readings that abstain 0.000
- new_identities: presence target: share of 'present' readings that abstain 0.450
- new_identities: presence target: share of true 'present' readings that abstain 0.450
- new_identities: presence size: share of FALSE 'present' readings that abstain 0.500
- new_identities: presence source: share of 'present' readings that abstain 0.700
- new_identities: presence source: share of true 'present' readings that abstain 0.700
- new_identities_en: FULL 0.613
- new_identities_en: presence object: share of 'present' readings that abstain 0.177
- new_identities_en: presence object: share of true 'present' readings that abstain 0.178
- new_identities_en: presence size: share of 'present' readings that abstain 0.103
- new_identities_en: presence size: share of true 'present' readings that abstain 0.000
- new_identities_en: presence amount: present read present 0.889
- new_identities_en: presence amount: share of 'present' readings that abstain 0.148
- new_identities_en: presence amount: share of true 'present' readings that abstain 0.148
- new_identities_en: presence unit: share of 'present' readings that abstain 0.109
- new_identities_en: presence unit: share of true 'present' readings that abstain 0.109
- new_identities_en: structure (depth, negation) 0.880
- new_identities_en: predicate (surface lemma) 0.880
- new_identities_en: event type (synonym table) 0.880
- new_identities_en: role object 0.725
- new_identities_en: head object 0.760
- new_identities_en: role text 0.887
- new_identities_en: head text 0.887
- new_identities_en: role landmark 0.897
- new_identities_en: occupancy: unknown filler 0.725
- new_identities_en: heads FULL (model) 0.657
- new_identities_en: heads FULL (lexical order baseline) 0.000
- new_identities_en: heads FULL (lexical bag baseline, trained on the same training rows) 0.245
- new_identities_en: FULL [depth given] 0.613
- new_identities_en: FULL [depth and negation given] 0.613
- new_identities_en: FULL [pooled midpoint (comparison)] 0.443
- new_identities_en: role object [pooled midpoint (comparison)] 0.595
- new_identities_en: role text [pooled midpoint (comparison)] 0.782
- new_identities_en: role landmark [pooled midpoint (comparison)] 0.892
- new_identities_en: heads FULL (model) [pooled midpoint (comparison)] 0.490
- new_identities_en: presence object: present read present [pooled midpoint (comparison)] 0.857
- new_identities_en: presence unit: present read present [pooled midpoint (comparison)] 0.871
- new_identities_en: presence text: share of 'present' readings that abstain 0.111
- new_identities_en: presence text: share of true 'present' readings that abstain 0.090
- new_identities_en: presence text: present read present [pooled midpoint (comparison)] 0.810
- new_identities_en: presence text: share of FALSE 'present' readings that abstain 0.333
- new_identities_en: presence relation: share of 'present' readings that abstain 0.077
- new_identities_en: presence relation: share of true 'present' readings that abstain 0.077
- new_identities_en: presence landmark: present read present 0.825
- new_identities_en: presence anchor: share of 'present' readings that abstain 0.077
- new_identities_en: presence anchor: share of true 'present' readings that abstain 0.077
- new_identities_en: presence fraction: share of 'present' readings that abstain 0.000
- new_identities_en: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities_en: presence color: share of 'present' readings that abstain 0.429
- new_identities_en: presence source: present read present 0.500
- new_identities_en: presence target: present read present 0.786
- new_identities_en: presence target: share of 'present' readings that abstain 0.818
- new_identities_en: presence target: share of true 'present' readings that abstain 0.818
- new_identities_en: determiner identity (outside FULL when the legend excludes it) 0.885
- new_identities_en: presence source: present read present [pooled midpoint (comparison)] 0.696
- new_identities_en: presence target: present read present [pooled midpoint (comparison)] 0.696
- new_identities_en: presence relation: present read present [pooled midpoint (comparison)] 0.861
- new_identities_en: presence landmark: present read present [pooled midpoint (comparison)] 0.847
- new_identities_en: presence landmark: share of 'present' readings that abstain 0.522
- new_identities_en: presence landmark: share of true 'present' readings that abstain 0.500
- new_identities_en: presence region: share of 'present' readings that abstain 0.000
- new_identities_en: presence region: share of true 'present' readings that abstain 0.000
- new_identities_en: presence direction: share of 'present' readings that abstain 0.042
- new_identities_en: presence direction: share of true 'present' readings that abstain 0.042
- new_identities_en: presence direction: present read present [pooled midpoint (comparison)] 0.720
- new_identities_en: presence object: absent read absent 0.000
- new_identities_en: presence object: share of FALSE 'present' readings that abstain 0.154
- new_identities_en: presence object: absent read absent [pooled midpoint (comparison)] 0.125
- new_identities_en: presence style: present read present 0.667
- new_identities_en: presence style: present read present [pooled midpoint (comparison)] 0.667
- new_identities_en: presence source: share of FALSE 'present' readings that abstain 0.500
- new_identities_en: presence color: present read present 0.800
- new_identities_en: presence color: share of true 'present' readings that abstain 0.000
- new_identities_en: presence color: present read present [pooled midpoint (comparison)] 0.750
- train (sample): FULL 0.650
- train (sample): presence object: share of 'present' readings that abstain 0.114
- train (sample): presence object: share of true 'present' readings that abstain 0.116
- train (sample): presence anchor: share of 'present' readings that abstain 0.000
- train (sample): presence anchor: share of true 'present' readings that abstain 0.000
- train (sample): structure (depth, negation) 0.860
- train (sample): predicate (surface lemma) 0.860
- train (sample): event type (synonym table) 0.860
- train (sample): role object 0.760
- train (sample): head object 0.817
- train (sample): occupancy: known filler 0.843
- train (sample): heads FULL (model) 0.703
- train (sample): heads FULL (lexical order baseline) 0.003
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.400
- train (sample): FULL [depth given] 0.650
- train (sample): FULL [depth and negation given] 0.650
- train (sample): presence color: present read present 0.875
- train (sample): presence color: share of 'present' readings that abstain 0.286
- train (sample): presence color: share of true 'present' readings that abstain 0.000
- train (sample): presence text: share of 'present' readings that abstain 0.080
- train (sample): presence text: share of true 'present' readings that abstain 0.087
- train (sample): determiner identity (outside FULL when the legend excludes it) 0.864
- train (sample): presence region: share of 'present' readings that abstain 0.087
- train (sample): presence region: share of true 'present' readings that abstain 0.087
- train (sample): presence relation: share of 'present' readings that abstain 0.065
- train (sample): presence relation: share of true 'present' readings that abstain 0.065
- train (sample): presence landmark: present read present 0.774
- train (sample): presence landmark: share of 'present' readings that abstain 0.375
- train (sample): presence landmark: share of true 'present' readings that abstain 0.375
- train (sample): presence amount: share of 'present' readings that abstain 0.000
- train (sample): presence amount: share of true 'present' readings that abstain 0.000
- train (sample): presence unit: share of 'present' readings that abstain 0.000
- train (sample): presence unit: share of true 'present' readings that abstain 0.000
- train (sample): presence style: share of 'present' readings that abstain 0.636
- train (sample): presence style: share of FALSE 'present' readings that abstain 0.667
- train (sample): presence layout: present read present 0.846
- train (sample): presence layout: share of 'present' readings that abstain 0.000
- train (sample): presence layout: share of true 'present' readings that abstain 0.000
- train (sample): presence size: present read present 0.818
- train (sample): presence object: absent read absent 0.750
- train (sample): presence source: present read present 0.630
- train (sample): presence target: share of 'present' readings that abstain 0.304
- train (sample): presence target: share of true 'present' readings that abstain 0.304
- train (sample): presence size: share of 'present' readings that abstain 0.000
- train (sample): presence size: share of true 'present' readings that abstain 0.000
- train (sample): presence quantity: share of 'present' readings that abstain 0.250
- train (sample): presence quantity: share of true 'present' readings that abstain 0.000
- train (sample): presence direction: share of 'present' readings that abstain 0.050
- train (sample): presence direction: share of true 'present' readings that abstain 0.050
- train (sample): presence source: share of 'present' readings that abstain 0.647
- train (sample): presence source: share of true 'present' readings that abstain 0.647
- train (sample): presence style: share of true 'present' readings that abstain 0.600
- train (sample): presence color: share of FALSE 'present' readings that abstain 0.571
- train (sample): presence axis: share of 'present' readings that abstain 0.000
- train (sample): presence axis: share of true 'present' readings that abstain 0.000
- train (sample): presence text: share of FALSE 'present' readings that abstain 0.000
- train (sample): presence fraction: share of 'present' readings that abstain 0.000
- train (sample): presence fraction: share of true 'present' readings that abstain 0.000
- train (sample): presence pairing: share of 'present' readings that abstain 0.000
- train (sample): presence pairing: share of true 'present' readings that abstain 0.000
- train (sample): presence object: share of FALSE 'present' readings that abstain 0.000
- train (sample): presence size: share of FALSE 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_formulations: `as_vrea sa faci COMPONENT STYLE .` FULL 0.000 (n 3)
- heldout_formulations: `deci stergeti QUANT COMPONENT COLOR .` FULL 0.000 (n 2)
- heldout_formulations: `am nevoie sa creezi NUM COMPONENT SIZE .` FULL 0.000 (n 2)
- heldout_formulations: `okay deci redenumeste COMPONENT in LABEL` FULL 0.000 (n 2)
- heldout_formulations: `vreau sa redenumiti COMPONENT in LABEL` FULL 0.000 (n 2)
- heldout_formulations_en: `i want you to sketch a COMPONENT` FULL 0.000 (n 2)
- heldout_formulations_en: `i want you to rename LABEL to LABEL` FULL 0.000 (n 2)
- heldout_formulations_en: `i want you to rename the SIZE COMPONENT to LABEL .` FULL 0.000 (n 2)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role size | role style | role text | role relation | role landmark | role region | role anchor | role fraction | role amount | role unit | role direction | role axis | role layout | role pairing | role source | role target | role quantity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.587±0.046 | 0.510±0.041 | 0.649±0.065 | 0.966±0.034 | 0.970±0.002 | 0.951±0.013 | 0.963±0.007 | 0.982±0.006 | 0.945±0.005 | 1.000±0.000 | 0.982±0.012 | 0.982±0.012 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.999±0.002 | 1.000±0.000 | 0.866±0.009 | 0.929±0.005 | 0.968±0.014 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.483±0.016 | 0.413±0.015 | 0.556±0.011 | 0.997±0.004 | 0.964±0.004 | 0.946±0.006 | 0.947±0.007 | 0.964±0.004 | 0.940±0.002 | 0.978±0.005 | 0.967±0.004 | 0.968±0.002 | 1.000±0.000 | 0.999±0.002 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.866±0.010 | 0.928±0.006 | 0.957±0.006 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.473±0.007 | 0.419±0.008 | 0.757±0.009 | 0.770±0.002 | 0.854±0.000 | 0.893±0.000 | 0.988±0.005 | 1.000±0.000 | 0.920±0.011 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.988±0.002 | 1.000±0.000 | 0.863±0.008 | 0.931±0.005 | 1.000±0.000 |
| heldout_formulations_en | product readout: presence decided | 0.633±0.015 | 0.592±0.014 | 0.664±0.022 | 0.990±0.015 | 0.978±0.013 | 0.973±0.013 | 0.953±0.010 | 0.992±0.004 | 0.957±0.009 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.994±0.000 | 1.000±0.000 | 1.000±0.000 | 0.994±0.000 | 0.913±0.013 | 0.943±0.010 | 0.966±0.007 |
| heldout_formulations_en | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.575±0.019 | 0.535±0.020 | 0.610±0.012 | 0.999±0.002 | 0.980±0.008 | 0.972±0.012 | 0.930±0.006 | 0.976±0.004 | 0.947±0.009 | 1.000±0.000 | 0.999±0.002 | 0.999±0.002 | 0.998±0.003 | 0.999±0.002 | 0.994±0.000 | 1.000±0.000 | 1.000±0.000 | 0.994±0.000 | 0.907±0.008 | 0.938±0.008 | 0.957±0.003 |
| heldout_formulations_en | v16 protocol: every role read, not available to the product | 0.399±0.009 | 0.383±0.007 | 0.797±0.015 | 0.736±0.000 | 0.882±0.000 | 0.899±0.000 | 0.967±0.010 | 1.000±0.000 | 0.872±0.023 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.866±0.022 | 0.919±0.014 | 0.994±0.000 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 0.928±0.032 | 1.000±0.000 | 0.964±0.016 | 0.130±0.031 (— / 0.130±0.031) |
| heldout_formulations | object | comparison: pooled midpoint | 0.901±0.010 | 1.000±0.000 | 0.950±0.005 |  |
| heldout_formulations | color | product: fitted | 1.000±0.000 | 0.961±0.037 | 0.981±0.019 | 0.514±0.276 (0.840±0.167 / 0.000±0.000) |
| heldout_formulations | color | comparison: pooled midpoint | 1.000±0.000 | 0.996±0.005 | 0.998±0.003 |  |
| heldout_formulations | size | product: fitted | 1.000±0.000 | 0.960±0.004 | 0.980±0.002 | 0.087±0.048 (0.133±0.125 / 0.071±0.044) |
| heldout_formulations | size | comparison: pooled midpoint | 1.000±0.000 | 0.957±0.002 | 0.979±0.001 |  |
| heldout_formulations | style | product: fitted | 1.000±0.000 | 0.956±0.012 | 0.978±0.006 | 0.419±0.093 (0.795±0.062 / 0.128±0.080) |
| heldout_formulations | style | comparison: pooled midpoint | 1.000±0.000 | 0.950±0.007 | 0.975±0.004 |  |
| heldout_formulations | text | product: fitted | 0.854±0.053 | 0.989±0.003 | 0.922±0.026 | 0.179±0.053 (0.400±0.374 / 0.144±0.067) |
| heldout_formulations | text | comparison: pooled midpoint | 0.779±0.058 | 0.990±0.004 | 0.884±0.030 |  |
| heldout_formulations | relation | product: fitted | 0.928±0.029 | 1.000±0.000 | 0.964±0.015 | 0.034±0.017 (— / 0.034±0.017) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.853±0.041 | 1.000±0.000 | 0.926±0.021 |  |
| heldout_formulations | landmark | product: fitted | 0.850±0.042 | 0.995±0.005 | 0.922±0.022 | 0.109±0.035 (1.000±0.000 / 0.075±0.037) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.818±0.031 | 0.998±0.003 | 0.908±0.016 |  |
| heldout_formulations | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.046±0.038 (— / 0.046±0.038) |
| heldout_formulations | region | comparison: pooled midpoint | 0.700±0.085 | 1.000±0.000 | 0.850±0.042 |  |
| heldout_formulations | anchor | product: fitted | 0.983±0.033 | 1.000±0.000 | 0.992±0.017 | 0.043±0.054 (— / 0.043±0.054) |
| heldout_formulations | anchor | comparison: pooled midpoint | 0.946±0.066 | 1.000±0.000 | 0.973±0.033 |  |
| heldout_formulations | fraction | product: fitted | 0.983±0.033 | 1.000±0.000 | 0.992±0.017 | 0.036±0.045 (— / 0.036±0.045) |
| heldout_formulations | fraction | comparison: pooled midpoint | 0.975±0.050 | 1.000±0.000 | 0.988±0.025 |  |
| heldout_formulations | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.025±0.050 (— / 0.025±0.050) |
| heldout_formulations | amount | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.025±0.050 (— / 0.025±0.050) |
| heldout_formulations | unit | comparison: pooled midpoint | 0.975±0.050 | 1.000±0.000 | 0.988±0.025 |  |
| heldout_formulations | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | direction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | layout | product: fitted | — | 0.999±0.003 | — | 0.000 (0.000 / —) |
| heldout_formulations | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | source | product: fitted | 0.523±0.141 | 0.999±0.003 | 0.761±0.071 | 0.883±0.106 (1.000 / 0.882±0.105) |
| heldout_formulations | source | comparison: pooled midpoint | 0.518±0.141 | 1.000±0.000 | 0.759±0.070 |  |
| heldout_formulations | target | product: fitted | 0.930±0.029 | 0.997±0.006 | 0.964±0.013 | 0.122±0.064 (1.000 / 0.107±0.072) |
| heldout_formulations | target | comparison: pooled midpoint | 0.951±0.031 | 1.000±0.000 | 0.975±0.016 |  |
| heldout_formulations | quantity | product: fitted | 0.950±0.062 | 1.000±0.000 | 0.975±0.031 | 0.201±0.143 (— / 0.201±0.143) |
| heldout_formulations | quantity | comparison: pooled midpoint | 0.943±0.083 | 1.000±0.000 | 0.971±0.042 |  |
| heldout_formulations_en | object | product: fitted | 0.957±0.009 | 1.000±0.000 | 0.978±0.004 | 0.188±0.040 (— / 0.188±0.040) |
| heldout_formulations_en | object | comparison: pooled midpoint | 0.944±0.008 | 1.000±0.000 | 0.972±0.004 |  |
| heldout_formulations_en | color | product: fitted | — | 0.988±0.018 | — | 0.929±0.071 (0.929±0.071 / —) |
| heldout_formulations_en | color | comparison: pooled midpoint | — | 0.998±0.003 | — |  |
| heldout_formulations_en | size | product: fitted | 0.948±0.042 | 0.976±0.011 | 0.962±0.026 | 0.317±0.058 (1.000±0.000 / 0.123±0.068) |
| heldout_formulations_en | size | comparison: pooled midpoint | 0.820±0.083 | 0.994±0.006 | 0.907±0.042 |  |
| heldout_formulations_en | style | product: fitted | 0.680±0.160 | 0.984±0.018 | 0.832±0.078 | 0.523±0.280 (1.000±0.000 / 0.367±0.194) |
| heldout_formulations_en | style | comparison: pooled midpoint | 0.680±0.098 | 0.982±0.016 | 0.831±0.048 |  |
| heldout_formulations_en | text | product: fitted | 0.990±0.019 | 0.977±0.008 | 0.984±0.006 | 0.152±0.025 (0.817±0.153 / 0.054±0.032) |
| heldout_formulations_en | text | comparison: pooled midpoint | 0.987±0.027 | 0.970±0.004 | 0.978±0.014 |  |
| heldout_formulations_en | relation | product: fitted | 0.961±0.036 | 1.000±0.000 | 0.980±0.018 | 0.031±0.042 (— / 0.031±0.042) |
| heldout_formulations_en | relation | comparison: pooled midpoint | 0.866±0.039 | 1.000±0.000 | 0.933±0.020 |  |
| heldout_formulations_en | landmark | product: fitted | 0.921±0.051 | 0.997±0.004 | 0.959±0.026 | 0.442±0.209 (1.000±0.000 / 0.433±0.205) |
| heldout_formulations_en | landmark | comparison: pooled midpoint | 0.866±0.026 | 1.000±0.000 | 0.933±0.013 |  |
| heldout_formulations_en | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.040±0.080 (— / 0.040±0.080) |
| heldout_formulations_en | amount | comparison: pooled midpoint | 0.920±0.098 | 1.000±0.000 | 0.960±0.049 |  |
| heldout_formulations_en | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.040±0.080 (— / 0.040±0.080) |
| heldout_formulations_en | unit | comparison: pooled midpoint | 0.960±0.080 | 1.000±0.000 | 0.980±0.040 |  |
| heldout_formulations_en | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | direction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | axis | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations_en | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations_en | layout | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations_en | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations_en | pairing | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations_en | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations_en | source | product: fitted | 0.992±0.015 | 0.997±0.004 | 0.994±0.007 | 0.888±0.069 (0.500±0.500 / 0.894±0.078) |
| heldout_formulations_en | source | comparison: pooled midpoint | 0.992±0.015 | 1.000±0.000 | 0.996±0.008 |  |
| heldout_formulations_en | target | product: fitted | 0.972±0.026 | 1.000±0.000 | 0.986±0.013 | 0.694±0.067 (— / 0.694±0.067) |
| heldout_formulations_en | target | comparison: pooled midpoint | 0.962±0.034 | 1.000±0.000 | 0.981±0.017 |  |
| heldout_formulations_en | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.177±0.095 (— / 0.177±0.095) |
| heldout_formulations_en | quantity | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | object | product: fitted | 0.951±0.030 | 0.500±0.086 | 0.725±0.031 | 0.090±0.012 (0.091±0.069 / 0.090±0.013) |
| heldout_sentences | object | comparison: pooled midpoint | 0.927±0.011 | 0.588±0.053 | 0.758±0.025 |  |
| heldout_sentences | color | product: fitted | 0.842±0.084 | 0.979±0.019 | 0.910±0.034 | 0.361±0.132 (0.880±0.158 / 0.159±0.058) |
| heldout_sentences | color | comparison: pooled midpoint | 0.738±0.036 | 0.997±0.003 | 0.867±0.019 |  |
| heldout_sentences | size | product: fitted | 0.844±0.046 | 0.993±0.001 | 0.918±0.022 | 0.063±0.040 (0.200±0.163 / 0.047±0.029) |
| heldout_sentences | size | comparison: pooled midpoint | 0.793±0.027 | 0.994±0.000 | 0.893±0.013 |  |
| heldout_sentences | style | product: fitted | 0.800±0.245 | 0.971±0.011 | 0.886±0.122 | 0.753±0.102 (0.835±0.040 / 0.300±0.400) |
| heldout_sentences | style | comparison: pooled midpoint | 0.800±0.245 | 0.972±0.011 | 0.886±0.122 |  |
| heldout_sentences | text | product: fitted | 0.981±0.018 | 0.986±0.002 | 0.984±0.009 | 0.066±0.022 (0.453±0.174 / 0.034±0.029) |
| heldout_sentences | text | comparison: pooled midpoint | 0.943±0.018 | 0.988±0.002 | 0.965±0.009 |  |
| heldout_sentences | relation | product: fitted | 0.958±0.019 | 1.000±0.000 | 0.979±0.009 | 0.090±0.025 (— / 0.090±0.025) |
| heldout_sentences | relation | comparison: pooled midpoint | 0.830±0.029 | 1.000±0.000 | 0.915±0.015 |  |
| heldout_sentences | landmark | product: fitted | 0.861±0.056 | 0.995±0.003 | 0.928±0.027 | 0.241±0.084 (0.875±0.217 / 0.221±0.088) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.837±0.032 | 0.999±0.001 | 0.918±0.016 |  |
| heldout_sentences | region | product: fitted | 0.926±0.030 | 1.000±0.000 | 0.963±0.015 | 0.040±0.031 (— / 0.040±0.031) |
| heldout_sentences | region | comparison: pooled midpoint | 0.836±0.035 | 1.000±0.000 | 0.918±0.018 |  |
| heldout_sentences | anchor | product: fitted | 0.963±0.019 | 1.000±0.000 | 0.981±0.009 | 0.029±0.024 (— / 0.029±0.024) |
| heldout_sentences | anchor | comparison: pooled midpoint | 0.950±0.002 | 1.000±0.000 | 0.975±0.001 |  |
| heldout_sentences | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.025±0.050 (— / 0.025±0.050) |
| heldout_sentences | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | amount | product: fitted | 0.985±0.012 | 1.000±0.000 | 0.993±0.006 | 0.034±0.025 (— / 0.034±0.025) |
| heldout_sentences | amount | comparison: pooled midpoint | 0.970±0.018 | 1.000±0.000 | 0.985±0.009 |  |
| heldout_sentences | unit | product: fitted | 0.966±0.020 | 1.000±0.000 | 0.983±0.010 | 0.025±0.022 (— / 0.025±0.022) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.956±0.024 | 1.000±0.000 | 0.978±0.012 |  |
| heldout_sentences | direction | product: fitted | 0.985±0.018 | 1.000±0.000 | 0.992±0.009 | 0.031±0.029 (— / 0.031±0.029) |
| heldout_sentences | direction | comparison: pooled midpoint | 0.877±0.046 | 1.000±0.000 | 0.939±0.023 |  |
| heldout_sentences | axis | product: fitted | 0.978±0.044 | 1.000±0.000 | 0.989±0.022 | 0.022±0.044 (— / 0.022±0.044) |
| heldout_sentences | axis | comparison: pooled midpoint | 0.896±0.052 | 1.000±0.000 | 0.948±0.026 |  |
| heldout_sentences | layout | product: fitted | 0.933±0.049 | 0.999±0.001 | 0.966±0.024 | 0.063±0.055 (1.000 / 0.054±0.061) |
| heldout_sentences | layout | comparison: pooled midpoint | 0.876±0.049 | 1.000±0.000 | 0.938±0.024 |  |
| heldout_sentences | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.055±0.048 (— / 0.055±0.048) |
| heldout_sentences | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | source | product: fitted | 0.591±0.079 | 0.998±0.001 | 0.794±0.040 | 0.794±0.021 (1.000±0.000 / 0.789±0.023) |
| heldout_sentences | source | comparison: pooled midpoint | 0.633±0.074 | 0.999±0.001 | 0.816±0.037 |  |
| heldout_sentences | target | product: fitted | 0.853±0.027 | 0.999±0.001 | 0.926±0.013 | 0.269±0.038 (1.000 / 0.265±0.040) |
| heldout_sentences | target | comparison: pooled midpoint | 0.815±0.034 | 1.000±0.000 | 0.907±0.017 |  |
| heldout_sentences | quantity | product: fitted | 1.000±0.000 | 0.999±0.001 | 1.000±0.001 | 0.250±0.129 (1.000 / 0.200±0.163) |
| heldout_sentences | quantity | comparison: pooled midpoint | 1.000±0.000 | 0.999±0.001 | 1.000±0.001 |  |
| mixed | object | product: fitted | 0.924±0.035 | 0.682±0.117 | 0.803±0.042 | 0.069±0.015 (0.107±0.088 / 0.068±0.015) |
| mixed | object | comparison: pooled midpoint | 0.866±0.022 | 0.795±0.060 | 0.831±0.029 |  |
| mixed | color | product: fitted | 0.855±0.050 | 0.980±0.013 | 0.918±0.024 | 0.312±0.094 (0.948±0.067 / 0.061±0.032) |
| mixed | color | comparison: pooled midpoint | 0.910±0.055 | 0.992±0.004 | 0.951±0.028 |  |
| mixed | size | product: fitted | 0.969±0.038 | 0.992±0.002 | 0.981±0.018 | 0.055±0.050 (0.233±0.291 / 0.017±0.033) |
| mixed | size | comparison: pooled midpoint | 1.000±0.000 | 0.994±0.001 | 0.997±0.001 |  |
| mixed | style | product: fitted | 0.940±0.080 | 0.969±0.008 | 0.955±0.041 | 0.411±0.051 (0.777±0.060 / 0.000±0.000) |
| mixed | style | comparison: pooled midpoint | 1.000±0.000 | 0.960±0.011 | 0.980±0.006 |  |
| mixed | text | product: fitted | 0.964±0.017 | 0.994±0.002 | 0.979±0.009 | 0.050±0.017 (0.600±0.374 / 0.033±0.012) |
| mixed | text | comparison: pooled midpoint | 0.923±0.035 | 0.991±0.005 | 0.957±0.019 |  |
| mixed | relation | product: fitted | 0.967±0.025 | 1.000±0.000 | 0.984±0.013 | 0.063±0.032 (— / 0.063±0.032) |
| mixed | relation | comparison: pooled midpoint | 0.818±0.048 | 1.000±0.000 | 0.909±0.024 |  |
| mixed | landmark | product: fitted | 0.904±0.066 | 0.994±0.007 | 0.949±0.031 | 0.142±0.044 (1.000±0.000 / 0.107±0.062) |
| mixed | landmark | comparison: pooled midpoint | 0.855±0.033 | 1.000±0.000 | 0.928±0.017 |  |
| mixed | region | product: fitted | 0.862±0.056 | 1.000±0.000 | 0.931±0.028 | 0.106±0.033 (— / 0.106±0.033) |
| mixed | region | comparison: pooled midpoint | 0.636±0.022 | 1.000±0.000 | 0.818±0.011 |  |
| mixed | anchor | product: fitted | 0.897±0.035 | 1.000±0.000 | 0.949±0.017 | 0.051±0.040 (— / 0.051±0.040) |
| mixed | anchor | comparison: pooled midpoint | 0.892±0.006 | 1.000±0.000 | 0.946±0.003 |  |
| mixed | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.013±0.027 (— / 0.013±0.027) |
| mixed | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| mixed | amount | product: fitted | 0.994±0.013 | 1.000±0.000 | 0.997±0.006 | 0.006±0.013 (— / 0.006±0.013) |
| mixed | amount | comparison: pooled midpoint | 0.987±0.016 | 1.000±0.000 | 0.994±0.008 |  |
| mixed | unit | product: fitted | 0.994±0.013 | 1.000±0.000 | 0.997±0.006 | 0.000±0.000 (— / 0.000±0.000) |
| mixed | unit | comparison: pooled midpoint | 0.994±0.013 | 1.000±0.000 | 0.997±0.006 |  |
| mixed | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.045±0.042 (— / 0.045±0.042) |
| mixed | direction | comparison: pooled midpoint | 0.929±0.024 | 1.000±0.000 | 0.965±0.012 |  |
| mixed | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.013±0.027 (— / 0.013±0.027) |
| mixed | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| mixed | layout | product: fitted | 0.942±0.057 | 1.000±0.000 | 0.971±0.028 | 0.073±0.042 (— / 0.073±0.042) |
| mixed | layout | comparison: pooled midpoint | 0.874±0.054 | 1.000±0.000 | 0.937±0.027 |  |
| mixed | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.028±0.034 (— / 0.028±0.034) |
| mixed | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| mixed | source | product: fitted | 0.573±0.078 | 1.000±0.000 | 0.786±0.039 | 0.668±0.136 (— / 0.668±0.136) |
| mixed | source | comparison: pooled midpoint | 0.564±0.057 | 1.000±0.000 | 0.782±0.029 |  |
| mixed | target | product: fitted | 0.889±0.059 | 1.000±0.000 | 0.944±0.029 | 0.181±0.053 (— / 0.181±0.053) |
| mixed | target | comparison: pooled midpoint | 0.796±0.036 | 1.000±0.000 | 0.898±0.018 |  |
| mixed | quantity | product: fitted | 0.967±0.067 | 1.000±0.000 | 0.983±0.033 | 0.107±0.088 (— / 0.107±0.088) |
| mixed | quantity | comparison: pooled midpoint | 0.967±0.067 | 1.000±0.000 | 0.983±0.033 |  |
| new_identities | object | product: fitted | 0.911±0.050 | 0.261±0.102 | 0.586±0.037 | 0.073±0.026 (0.000±0.000 / 0.074±0.027) |
| new_identities | object | comparison: pooled midpoint | 0.876±0.016 | 0.313±0.036 | 0.594±0.024 |  |
| new_identities | color | product: fitted | 0.589±0.093 | 0.986±0.016 | 0.788±0.047 | 0.338±0.292 (0.881±0.121 / 0.107±0.137) |
| new_identities | color | comparison: pooled midpoint | 0.571±0.000 | 0.998±0.004 | 0.785±0.002 |  |
| new_identities | size | product: fitted | 1.000±0.000 | 0.977±0.001 | 0.988±0.001 | 0.090±0.023 (0.386±0.086 / 0.000±0.000) |
| new_identities | size | comparison: pooled midpoint | 0.991±0.017 | 0.980±0.002 | 0.985±0.009 |  |
| new_identities | style | product: fitted | 1.000±0.000 | 0.978±0.008 | 0.989±0.004 | 0.811±0.109 (0.943±0.114 / 0.000±0.000) |
| new_identities | style | comparison: pooled midpoint | 1.000±0.000 | 0.980±0.010 | 0.990±0.005 |  |
| new_identities | text | product: fitted | 0.971±0.028 | 0.925±0.014 | 0.948±0.015 | 0.097±0.011 (0.401±0.156 / 0.068±0.023) |
| new_identities | text | comparison: pooled midpoint | 0.920±0.024 | 0.931±0.014 | 0.926±0.015 |  |
| new_identities | relation | product: fitted | 0.966±0.026 | 1.000±0.000 | 0.983±0.013 | 0.100±0.044 (— / 0.100±0.044) |
| new_identities | relation | comparison: pooled midpoint | 0.789±0.077 | 1.000±0.000 | 0.895±0.038 |  |
| new_identities | landmark | product: fitted | 0.804±0.084 | 0.993±0.012 | 0.899±0.037 | 0.142±0.034 (1.000±0.000 / 0.116±0.039) |
| new_identities | landmark | comparison: pooled midpoint | 0.731±0.047 | 0.999±0.002 | 0.865±0.023 |  |
| new_identities | region | product: fitted | 0.927±0.025 | 1.000±0.000 | 0.964±0.012 | 0.112±0.093 (— / 0.112±0.093) |
| new_identities | region | comparison: pooled midpoint | 0.715±0.031 | 1.000±0.000 | 0.858±0.015 |  |
| new_identities | anchor | product: fitted | 0.955±0.037 | 1.000±0.000 | 0.977±0.019 | 0.062±0.075 (— / 0.062±0.075) |
| new_identities | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.033±0.067 (— / 0.033±0.067) |
| new_identities | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | amount | product: fitted | 0.998±0.004 | 1.000±0.000 | 0.999±0.002 | 0.018±0.014 (— / 0.018±0.014) |
| new_identities | amount | comparison: pooled midpoint | 0.996±0.009 | 1.000±0.000 | 0.998±0.004 |  |
| new_identities | unit | product: fitted | 0.996±0.006 | 1.000±0.000 | 0.998±0.003 | 0.002±0.004 (— / 0.002±0.004) |
| new_identities | unit | comparison: pooled midpoint | 0.996±0.006 | 1.000±0.000 | 0.998±0.003 |  |
| new_identities | direction | product: fitted | 0.982±0.022 | 1.000±0.000 | 0.991±0.011 | 0.037±0.019 (— / 0.037±0.019) |
| new_identities | direction | comparison: pooled midpoint | 0.981±0.023 | 1.000±0.000 | 0.990±0.012 |  |
| new_identities | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | source | product: fitted | 0.448±0.042 | 0.999±0.001 | 0.724±0.021 | 0.864±0.086 (1.000 / 0.863±0.085) |
| new_identities | source | comparison: pooled midpoint | 0.451±0.039 | 1.000±0.000 | 0.725±0.020 |  |
| new_identities | target | product: fitted | 0.787±0.052 | 1.000±0.000 | 0.894±0.026 | 0.275±0.104 (— / 0.275±0.104) |
| new_identities | target | comparison: pooled midpoint | 0.725±0.011 | 1.000±0.000 | 0.863±0.005 |  |
| new_identities | quantity | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | quantity | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | object | product: fitted | 0.886±0.053 | 0.031±0.038 | 0.459±0.017 | 0.175±0.021 (0.142±0.080 / 0.176±0.025) |
| new_identities_en | object | comparison: pooled midpoint | 0.843±0.011 | 0.043±0.054 | 0.443±0.030 |  |
| new_identities_en | color | product: fitted | 0.827±0.092 | 0.991±0.012 | 0.909±0.047 | 0.432±0.170 (1.000±0.000 / 0.187±0.165) |
| new_identities_en | color | comparison: pooled midpoint | 0.620±0.112 | 0.999±0.001 | 0.810±0.056 |  |
| new_identities_en | size | product: fitted | 1.000±0.000 | 0.997±0.004 | 0.998±0.002 | 0.043±0.040 (1.000±0.000 / 0.008±0.015) |
| new_identities_en | size | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities_en | style | product: fitted | 0.567±0.327 | 0.990±0.006 | 0.778±0.166 | 0.950±0.100 (1.000±0.000 / 0.875±0.217) |
| new_identities_en | style | comparison: pooled midpoint | 0.567±0.327 | 0.989±0.009 | 0.778±0.167 |  |
| new_identities_en | text | product: fitted | 0.885±0.041 | 0.930±0.010 | 0.908±0.016 | 0.121±0.025 (0.464±0.186 / 0.089±0.018) |
| new_identities_en | text | comparison: pooled midpoint | 0.789±0.014 | 0.930±0.004 | 0.860±0.007 |  |
| new_identities_en | relation | product: fitted | 0.953±0.022 | 1.000±0.000 | 0.977±0.011 | 0.083±0.024 (— / 0.083±0.024) |
| new_identities_en | relation | comparison: pooled midpoint | 0.859±0.009 | 1.000±0.000 | 0.930±0.005 |  |
| new_identities_en | landmark | product: fitted | 0.893±0.060 | 0.995±0.004 | 0.944±0.030 | 0.429±0.106 (1.000±0.000 / 0.419±0.109) |
| new_identities_en | landmark | comparison: pooled midpoint | 0.859±0.008 | 1.000±0.000 | 0.930±0.004 |  |
| new_identities_en | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities_en | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities_en | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.015±0.031 (— / 0.015±0.031) |
| new_identities_en | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities_en | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities_en | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities_en | amount | product: fitted | 0.942±0.051 | 1.000±0.000 | 0.971±0.025 | 0.097±0.057 (— / 0.097±0.057) |
| new_identities_en | amount | comparison: pooled midpoint | 0.915±0.041 | 1.000±0.000 | 0.957±0.020 |  |
| new_identities_en | unit | product: fitted | 0.942±0.038 | 1.000±0.000 | 0.971±0.019 | 0.104±0.039 (— / 0.104±0.039) |
| new_identities_en | unit | comparison: pooled midpoint | 0.899±0.040 | 1.000±0.000 | 0.950±0.020 |  |
| new_identities_en | direction | product: fitted | 0.889±0.130 | 1.000±0.000 | 0.944±0.065 | 0.100±0.035 (— / 0.100±0.035) |
| new_identities_en | direction | comparison: pooled midpoint | 0.651±0.066 | 1.000±0.000 | 0.825±0.033 |  |
| new_identities_en | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities_en | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities_en | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities_en | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | source | product: fitted | 0.657±0.097 | 0.989±0.006 | 0.823±0.047 | 0.922±0.066 (0.867±0.194 / 0.930±0.076) |
| new_identities_en | source | comparison: pooled midpoint | 0.703±0.031 | 0.999±0.002 | 0.851±0.015 |  |
| new_identities_en | target | product: fitted | 0.693±0.103 | 0.998±0.004 | 0.845±0.050 | 0.729±0.076 (1.000 / 0.722±0.077) |
| new_identities_en | target | comparison: pooled midpoint | 0.687±0.017 | 1.000±0.000 | 0.844±0.008 |  |
| new_identities_en | quantity | product: fitted | — | 0.998±0.003 | — | 1.000 (1.000 / —) |
| new_identities_en | quantity | comparison: pooled midpoint | — | 0.997±0.004 | — |  |
| train (sample) | object | product: fitted | 0.950±0.030 | 0.724±0.031 | 0.837±0.024 | 0.097±0.020 (0.100±0.200 / 0.096±0.019) |
| train (sample) | color | product: fitted | 0.950±0.061 | 0.983±0.012 | 0.967±0.036 | 0.219±0.143 (0.768±0.234 / 0.000±0.000) |
| train (sample) | size | product: fitted | 0.871±0.067 | 0.981±0.003 | 0.926±0.033 | 0.017±0.021 (0.080±0.098 / 0.000±0.000) |
| train (sample) | style | product: fitted | 0.960±0.080 | 0.971±0.011 | 0.965±0.036 | 0.520±0.206 (0.639±0.167 / 0.373±0.222) |
| train (sample) | text | product: fitted | 0.957±0.026 | 0.994±0.002 | 0.975±0.012 | 0.059±0.042 (0.100±0.200 / 0.053±0.051) |
| train (sample) | relation | product: fitted | 0.993±0.015 | 1.000±0.000 | 0.996±0.007 | 0.071±0.039 (— / 0.071±0.039) |
| train (sample) | landmark | product: fitted | 0.933±0.084 | 1.000±0.000 | 0.966±0.042 | 0.260±0.097 (— / 0.260±0.097) |
| train (sample) | region | product: fitted | 0.983±0.021 | 1.000±0.000 | 0.991±0.010 | 0.053±0.032 (— / 0.053±0.032) |
| train (sample) | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.009±0.018 (— / 0.009±0.018) |
| train (sample) | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | amount | product: fitted | 0.993±0.014 | 1.000±0.000 | 0.996±0.007 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | unit | product: fitted | 0.978±0.018 | 1.000±0.000 | 0.989±0.009 | 0.022±0.030 (— / 0.022±0.030) |
| train (sample) | direction | product: fitted | 0.990±0.020 | 1.000±0.000 | 0.995±0.010 | 0.021±0.025 (— / 0.021±0.025) |
| train (sample) | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.022±0.044 (— / 0.022±0.044) |
| train (sample) | layout | product: fitted | 0.938±0.075 | 0.998±0.002 | 0.968±0.037 | 0.059±0.057 (1.000±0.000 / 0.031±0.062) |
| train (sample) | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.090±0.111 (— / 0.090±0.111) |
| train (sample) | source | product: fitted | 0.697±0.071 | 0.999±0.002 | 0.848±0.035 | 0.645±0.040 (1.000 / 0.643±0.037) |
| train (sample) | target | product: fitted | 0.946±0.019 | 1.000±0.000 | 0.973±0.009 | 0.239±0.080 (— / 0.239±0.080) |
| train (sample) | quantity | product: fitted | 1.000±0.000 | 0.999±0.002 | 1.000±0.001 | 0.183±0.153 (1.000 / 0.133±0.163) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
