# REPORT — world `diagram_multi`, legend sha256:1a43ffc61bd5… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
3000 annotated sentences from 6 files; provenance: {'generator': 3000}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/1000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 194 sentences
- calibration_heldout_formulations_en: 222 sentences
- heldout_formulations: 206 sentences
- heldout_formulations_en: 178 sentences
- heldout_sentences: 96 sentences
- mixed: 400 sentences
- new_identities: 400 sentences
- new_identities_en: 400 sentences
- train: 904 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['250', '35', '45', '90', 'analytics', 'broker', 'crawler', 'dashboard', 'gamma_ray', 'indexer', 'ingest', 'irina', 'loyalty', 'notifications', 'payroll', 'recommendations', 'registry', 'returns', 'routing', 'theta', 'tracking', 'vault', 'victor', 'zeta']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
23808 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2, 3, 4], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit eccbf84. Memory curve: runs/1000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 1.360 [rule: fit; pooled midpoint 1.491 (comparison)] (present 1.845, n 769 / absent 1.138, n 47)
- attr_presence:object: threshold 0.340 [rule: fit; pooled midpoint 0.428 (comparison)] (present 0.585, n 329 / absent 0.270, n 440)
- det_presence:object: threshold 0.513 [rule: fit; pooled midpoint 0.586 (comparison)] (present 0.922, n 309 / absent 0.250, n 460)
- presence:color: threshold 0.301 [rule: fit; pooled midpoint 0.385 (comparison)] (present 0.626, n 26 / absent 0.143, n 790)
- presence:size: threshold 0.266 [rule: fit; pooled midpoint 0.306 (comparison)] (present 0.455, n 71 / absent 0.158, n 745)
- presence:style: threshold 0.064 [rule: fit; pooled midpoint 0.047 (comparison)] (present 0.064, n 28 / absent 0.029, n 788)
- presence:text: threshold 0.337 [rule: fit; pooled midpoint 0.360 (comparison)] (present 0.504, n 95 / absent 0.215, n 721)
- presence:relation: threshold 0.205 [rule: fit; pooled midpoint 0.330 (comparison)] (present 0.579, n 103 / absent 0.080, n 713)
- presence:landmark: threshold 0.385 [rule: fit; pooled midpoint 0.481 (comparison)] (present 0.771, n 103 / absent 0.192, n 713)
- presence:region: threshold 0.389 [rule: fit; pooled midpoint 0.517 (comparison)] (present 0.845, n 60 / absent 0.189, n 756)
- presence:anchor: threshold 0.219 [rule: fit; pooled midpoint 0.257 (comparison)] (present 0.471, n 52 / absent 0.043, n 764)
- presence:fraction: threshold 0.319 [rule: fit; pooled midpoint 0.281 (comparison)] (present 0.453, n 38 / absent 0.110, n 778)
- presence:amount: threshold 0.265 [rule: fit; pooled midpoint 0.312 (comparison)] (present 0.573, n 35 / absent 0.052, n 781)
- presence:unit: threshold 0.375 [rule: fit; pooled midpoint 0.409 (comparison)] (present 0.663, n 35 / absent 0.155, n 781)
- presence:direction: threshold 0.273 [rule: fit; pooled midpoint 0.245 (comparison)] (present 0.413, n 28 / absent 0.077, n 788)
- presence:axis: threshold 0.212 [rule: fit; pooled midpoint 0.224 (comparison)] (present 0.380, n 14 / absent 0.068, n 802)
- presence:layout: threshold 0.289 [rule: fit; pooled midpoint 0.325 (comparison)] (present 0.630, n 17 / absent 0.020, n 799)
- presence:pairing: threshold 0.199 [rule: fit; pooled midpoint 0.187 (comparison)] (present 0.340, n 16 / absent 0.034, n 800)
- presence:source: threshold 0.284 [rule: fit; pooled midpoint 0.384 (comparison)] (present 0.649, n 116 / absent 0.118, n 700)
- presence:target: threshold 0.422 [rule: fit; pooled midpoint 0.430 (comparison)] (present 0.699, n 100 / absent 0.162, n 716)
- presence:quantity: threshold 0.054 [rule: fit; pooled midpoint 0.052 (comparison)] (present 0.099, n 34 / absent 0.005, n 782)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.005, color 0.083, size 0.143, style 0.200, text 0.013, relation 0.167, landmark 0.006, region 0.111, anchor 0.250, fraction 0.333, amount 0.043, unit 0.500, direction 0.167, axis 0.500, layout 0.143, pairing 0.500, source 0.006, target 0.006, quantity 0.043, predicate 0.019

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 206 of 206)
| axis | accuracy |
|---|---|
| FULL | 0.288±0.033 |
| FULL [depth given] | 0.288±0.033 |
| FULL [depth and negation given] | 0.290±0.033 |
| FULL [presence not decided] | 0.353±0.015 |
| FULL [pooled midpoint (comparison)] | 0.277±0.022 |
| presence object: present read present | 0.878±0.065 |
| presence object: share of 'present' readings that abstain | 0.082±0.034 |
| presence object: share of true 'present' readings that abstain | 0.083±0.034 |
| presence color: absent read absent | 0.943±0.020 |
| presence size: present read present | 0.985±0.031 |
| presence size: share of 'present' readings that abstain | 0.330±0.033 |
| presence size: share of true 'present' readings that abstain | 0.129±0.034 |
| presence style: absent read absent | 0.944±0.023 |
| presence text: absent read absent | 0.980±0.003 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.972±0.024 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 0.999±0.003 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 0.999±0.003 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.992±0.010 |
| presence target: absent read absent | 0.997±0.007 |
| presence quantity: absent read absent | 0.998±0.003 |
| structure (depth, negation) | 0.660±0.054 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.680±0.054 |
| event type (synonym table) | 0.682±0.054 |
| role object | 0.438±0.059 |
| head object | 0.497±0.059 |
| lexical order head object | 0.039±0.000 |
| lexical bag head object | 0.121±0.000 |
| occupancy: known filler | 0.596±0.041 |
| role color | 0.960±0.015 |
| head color | 0.960±0.015 |
| lexical order head color | 0.995±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 0.990±0.001 |
| role size | 0.943±0.014 |
| head size | 0.943±0.014 |
| lexical order head size | 0.917±0.000 |
| lexical bag head size | 0.917±0.000 |
| role style | 0.933±0.019 |
| head style | 0.933±0.019 |
| lexical order head style | 0.942±0.000 |
| lexical bag head style | 0.942±0.000 |
| role text | 0.933±0.004 |
| head text | 0.933±0.004 |
| lexical order head text | 0.898±0.000 |
| lexical bag head text | 0.898±0.000 |
| role relation | 0.964±0.013 |
| head relation | 0.964±0.013 |
| lexical order head relation | 0.869±0.000 |
| lexical bag head relation | 0.869±0.000 |
| role landmark | 0.913±0.014 |
| head landmark | 0.929±0.010 |
| lexical order head landmark | 0.869±0.000 |
| lexical bag head landmark | 0.869±0.000 |
| role region | 0.993±0.004 |
| head region | 0.993±0.004 |
| lexical order head region | 0.937±0.000 |
| lexical bag head region | 0.937±0.000 |
| role anchor | 0.958±0.007 |
| head anchor | 0.958±0.007 |
| lexical order head anchor | 0.932±0.000 |
| lexical bag head anchor | 0.932±0.000 |
| role fraction | 0.953±0.009 |
| head fraction | 0.953±0.009 |
| lexical order head fraction | 0.932±0.000 |
| lexical bag head fraction | 0.932±0.000 |
| role amount | 0.996±0.002 |
| head amount | 0.996±0.002 |
| lexical order head amount | 0.961±0.000 |
| lexical bag head amount | 0.961±0.000 |
| role unit | 0.996±0.005 |
| head unit | 0.996±0.005 |
| lexical order head unit | 0.961±0.000 |
| lexical bag head unit | 0.961±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.990±0.000 |
| lexical bag head direction | 0.990±0.000 |
| role axis | 0.996±0.004 |
| head axis | 0.996±0.004 |
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
| role source | 0.853±0.002 |
| head source | 0.857±0.007 |
| lexical order head source | 0.835±0.000 |
| lexical bag head source | 0.835±0.000 |
| role target | 0.896±0.016 |
| head target | 0.922±0.021 |
| lexical order head target | 0.850±0.000 |
| lexical bag head target | 0.850±0.000 |
| role quantity | 0.938±0.006 |
| head quantity | 0.938±0.006 |
| lexical order head quantity | 0.893±0.000 |
| lexical bag head quantity | 0.893±0.000 |
| heads FULL (model) | 0.351±0.030 |
| heads FULL (lexical order baseline) | 0.019±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.044±0.000 |
| role object [presence not decided] | 0.699±0.018 |
| role color [presence not decided] | 0.768±0.002 |
| role size [presence not decided] | 0.854±0.003 |
| role style [presence not decided] | 0.893±0.000 |
| role text [presence not decided] | 0.944±0.005 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.845±0.021 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 0.983±0.013 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 0.985±0.000 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.830±0.000 |
| role target [presence not decided] | 0.878±0.014 |
| role quantity [presence not decided] | 0.983±0.013 |
| heads FULL (model) [presence not decided] | 0.427±0.008 |
| role object [pooled midpoint (comparison)] | 0.410±0.010 |
| role color [pooled midpoint (comparison)] | 0.992±0.007 |
| role size [pooled midpoint (comparison)] | 0.947±0.015 |
| role style [pooled midpoint (comparison)] | 0.929±0.018 |
| role text [pooled midpoint (comparison)] | 0.931±0.004 |
| role relation [pooled midpoint (comparison)] | 0.943±0.009 |
| role landmark [pooled midpoint (comparison)] | 0.908±0.008 |
| role region [pooled midpoint (comparison)] | 0.983±0.009 |
| role anchor [pooled midpoint (comparison)] | 0.954±0.008 |
| role fraction [pooled midpoint (comparison)] | 0.951±0.009 |
| role amount [pooled midpoint (comparison)] | 0.996±0.004 |
| role unit [pooled midpoint (comparison)] | 0.994±0.005 |
| role direction [pooled midpoint (comparison)] | 1.000±0.000 |
| role axis [pooled midpoint (comparison)] | 0.997±0.002 |
| role layout [pooled midpoint (comparison)] | 0.999±0.002 |
| role pairing [pooled midpoint (comparison)] | 0.999±0.002 |
| role source [pooled midpoint (comparison)] | 0.858±0.004 |
| role target [pooled midpoint (comparison)] | 0.899±0.017 |
| role quantity [pooled midpoint (comparison)] | 0.937±0.008 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.346±0.025 |
| presence object: present read present [pooled midpoint (comparison)] | 0.878±0.021 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.988±0.011 |
| presence size: present read present [pooled midpoint (comparison)] | 0.985±0.031 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.928±0.019 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.979±0.004 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.981±0.015 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.999±0.003 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.996±0.008 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence size: absent read absent | 0.930±0.015 |
| presence text: present read present | 0.780±0.142 |
| presence text: share of 'present' readings that abstain | 0.407±0.061 |
| presence text: share of true 'present' readings that abstain | 0.437±0.044 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.941±0.016 |
| presence text: present read present [pooled midpoint (comparison)] | 0.811±0.022 |
| presence color: share of 'present' readings that abstain | 0.923±0.071 |
| presence color: share of FALSE 'present' readings that abstain | 0.963±0.045 |
| presence source: present read present | 0.349±0.182 |
| presence source: share of 'present' readings that abstain | 0.796±0.111 |
| presence source: share of true 'present' readings that abstain | 0.788±0.110 |
| presence target: present read present | 0.747±0.088 |
| determiner identity (outside FULL when the legend excludes it) | 0.715±0.087 |
| presence source: present read present [pooled midpoint (comparison)] | 0.367±0.158 |
| presence target: present read present [pooled midpoint (comparison)] | 0.775±0.086 |
| presence object: absent read absent | 0.633±0.194 |
| presence object: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: share of 'present' readings that abstain | 0.969±0.062 |
| presence style: share of FALSE 'present' readings that abstain | 0.964±0.073 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.760±0.131 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.796±0.091 |
| presence target: share of true 'present' readings that abstain | 0.811±0.086 |
| presence relation: present read present | 0.873±0.066 |
| presence relation: share of 'present' readings that abstain | 0.121±0.045 |
| presence relation: share of true 'present' readings that abstain | 0.121±0.045 |
| presence landmark: present read present | 0.708±0.055 |
| presence landmark: share of 'present' readings that abstain | 0.385±0.094 |
| presence landmark: share of true 'present' readings that abstain | 0.270±0.086 |
| presence amount: present read present | 0.925±0.061 |
| presence amount: share of 'present' readings that abstain | 0.133±0.013 |
| presence amount: share of true 'present' readings that abstain | 0.111±0.056 |
| presence unit: present read present | 0.900±0.122 |
| presence unit: share of 'present' readings that abstain | 0.050±0.100 |
| presence unit: share of true 'present' readings that abstain | 0.050±0.100 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.782±0.080 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.659±0.074 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.921±0.064 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.871±0.112 |
| presence size: share of FALSE 'present' readings that abstain | 0.665±0.057 |
| presence style: present read present | 0.775±0.252 |
| presence style: present read present [pooled midpoint (comparison)] | 0.867±0.267 |
| presence region: present read present | 0.950±0.041 |
| presence region: share of 'present' readings that abstain | 0.303±0.142 |
| presence region: share of true 'present' readings that abstain | 0.303±0.142 |
| presence region: present read present [pooled midpoint (comparison)] | 0.792±0.138 |
| presence quantity: present read present | 0.727±0.112 |
| presence quantity: share of 'present' readings that abstain | 0.474±0.153 |
| presence quantity: share of true 'present' readings that abstain | 0.462±0.165 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.686±0.097 |
| presence style: share of true 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of true 'present' readings that abstain | 0.600±0.490 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.109±0.156 |
| presence anchor: share of true 'present' readings that abstain | 0.109±0.156 |
| presence fraction: present read present | 0.811±0.220 |
| presence fraction: share of 'present' readings that abstain | 0.664±0.191 |
| presence fraction: share of true 'present' readings that abstain | 0.664±0.191 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.833±0.149 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 0.300±0.163 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.050±0.100 |
| presence axis: share of true 'present' readings that abstain | 0.050±0.100 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| occupancy: unknown filler | 0.800±0.400 |

residual mean 0.669±0.029; status {'abstain': 138, 'no-sense': 60, 'ok': 8}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.704 | 0.187 / 0.101 | 0.95 | 0.267 | 0.019 / 0.029 |
| role object | 0.465 | 0.135 / 0.000 | 0.62 | 0.187 | 0.035 / 0.348 |
| roles (pooled) | 0.474 | 0.084 / 0.000 | 0.49 | 0.123 | 0.110 / 0.404 |
| role size | 0.941 | 0.085 / 0.050 | 0.88 | 0.059 | 0.118 / 0.000 |
| role text | 0.524 | 0.037 / 0.000 | 0.33 | 0.048 | 0.238 / 0.429 |
| role source | 0.147 | 0.014 / 0.000 | 0.09 | 0.059 | 0.118 / 0.794 |
| role target | 0.323 | 0.020 / 0.000 | 0.13 | 0.065 | 0.258 / 0.613 |
| role pairing | 1.000 | 0.158 / 0.137 | 1.00 | 0.000 | 0.000 / 0.000 |
| role anchor | 0.357 | 0.076 / 0.000 | 0.64 | 0.429 | 0.143 / 0.214 |
| role fraction | 0.143 | 0.018 / 0.000 | 0.21 | 0.143 | 0.071 / 0.714 |
| role relation | 0.667 | 0.069 / 0.000 | 0.67 | 0.037 | 0.037 / 0.296 |
| role landmark | 0.444 | 0.045 / 0.000 | 0.37 | 0.111 | 0.185 / 0.444 |
| role amount | 0.875 | 0.069 / 0.034 | 0.75 | 0.000 | 0.125 / 0.125 |
| role unit | 0.750 | 0.111 / 0.000 | 0.75 | 0.000 | 0.000 / 0.250 |
| role style | 0.167 | 0.008 / 0.000 | 0.00 | 0.000 | 0.167 / 0.833 |
| role region | 1.000 | 0.060 / 0.032 | 0.54 | 0.000 | 0.462 / 0.000 |
| role quantity | 0.364 | 0.019 / 0.000 | 0.14 | 0.045 | 0.273 / 0.591 |
| role color | 1.000 | 0.060 / 0.060 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.167 / 0.148 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 0.750 | 0.102 / 0.034 | 0.75 | 0.000 | 0.000 / 0.250 |

### heldout_formulations — experiment candidates (n = 206 of 206)
| axis | accuracy |
|---|---|
| FULL | 0.053±0.030 |
| FULL [depth given] | 0.053±0.030 |
| FULL [depth and negation given] | 0.053±0.030 |
| FULL [presence not decided] | 0.000±0.000 |
| FULL [pooled midpoint (comparison)] | 0.068±0.026 |
| presence object: present read present | 0.917±0.041 |
| presence object: share of 'present' readings that abstain | 0.100±0.039 |
| presence object: share of true 'present' readings that abstain | 0.096±0.041 |
| presence color: absent read absent | 0.898±0.017 |
| presence size: present read present | 0.983±0.033 |
| presence size: share of 'present' readings that abstain | 0.794±0.053 |
| presence size: share of true 'present' readings that abstain | 0.503±0.156 |
| presence style: absent read absent | 0.722±0.115 |
| presence text: absent read absent | 0.821±0.028 |
| presence text: share of 'present' readings that abstain | 0.875±0.032 |
| presence text: share of FALSE 'present' readings that abstain | 0.990±0.020 |
| presence relation: absent read absent | 0.831±0.058 |
| presence relation: share of 'present' readings that abstain | 0.697±0.076 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence landmark: absent read absent | 0.863±0.020 |
| presence landmark: share of 'present' readings that abstain | 0.907±0.036 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence region: absent read absent | 0.886±0.020 |
| presence region: share of 'present' readings that abstain | 0.875±0.035 |
| presence region: share of FALSE 'present' readings that abstain | 0.988±0.025 |
| presence anchor: absent read absent | 0.937±0.027 |
| presence fraction: absent read absent | 0.978±0.010 |
| presence fraction: share of 'present' readings that abstain | 0.767±0.189 |
| presence fraction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence amount: absent read absent | 0.873±0.052 |
| presence amount: share of 'present' readings that abstain | 0.943±0.019 |
| presence amount: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence unit: absent read absent | 0.888±0.032 |
| presence unit: share of 'present' readings that abstain | 0.602±0.098 |
| presence unit: share of FALSE 'present' readings that abstain | 0.907±0.094 |
| presence direction: absent read absent | 0.826±0.078 |
| presence direction: share of 'present' readings that abstain | 0.883±0.048 |
| presence direction: share of FALSE 'present' readings that abstain | 0.984±0.021 |
| presence axis: absent read absent | 0.944±0.043 |
| presence layout: absent read absent | 0.982±0.019 |
| presence pairing: absent read absent | 0.949±0.029 |
| presence source: absent read absent | 0.932±0.031 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: absent read absent | 0.973±0.019 |
| presence target: share of 'present' readings that abstain | 0.993±0.014 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence quantity: absent read absent | 0.681±0.071 |
| presence quantity: share of 'present' readings that abstain | 0.956±0.022 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| structure (depth, negation) | 0.603±0.057 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.619±0.058 |
| event type (synonym table) | 0.620±0.059 |
| role object | 0.372±0.058 |
| head object | 0.475±0.056 |
| lexical order head object | 0.039±0.000 |
| lexical bag head object | 0.121±0.000 |
| occupancy: known filler | 0.606±0.056 |
| role color | 0.931±0.014 |
| head color | 0.931±0.014 |
| lexical order head color | 0.995±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 0.923±0.010 |
| role size | 0.863±0.020 |
| head size | 0.863±0.020 |
| lexical order head size | 0.917±0.000 |
| lexical bag head size | 0.917±0.000 |
| role style | 0.795±0.052 |
| head style | 0.795±0.052 |
| lexical order head style | 0.942±0.000 |
| lexical bag head style | 0.942±0.000 |
| role text | 0.831±0.013 |
| head text | 0.831±0.013 |
| lexical order head text | 0.898±0.000 |
| lexical bag head text | 0.898±0.000 |
| role relation | 0.873±0.035 |
| head relation | 0.873±0.035 |
| lexical order head relation | 0.869±0.000 |
| lexical bag head relation | 0.869±0.000 |
| role landmark | 0.842±0.014 |
| head landmark | 0.858±0.012 |
| lexical order head landmark | 0.869±0.000 |
| lexical bag head landmark | 0.869±0.000 |
| role region | 0.911±0.016 |
| head region | 0.911±0.016 |
| lexical order head region | 0.937±0.000 |
| lexical bag head region | 0.937±0.000 |
| role anchor | 0.917±0.018 |
| head anchor | 0.917±0.018 |
| lexical order head anchor | 0.932±0.000 |
| lexical bag head anchor | 0.932±0.000 |
| role fraction | 0.935±0.002 |
| head fraction | 0.935±0.002 |
| lexical order head fraction | 0.932±0.000 |
| lexical bag head fraction | 0.932±0.000 |
| role amount | 0.916±0.036 |
| head amount | 0.916±0.036 |
| lexical order head amount | 0.961±0.000 |
| lexical bag head amount | 0.961±0.000 |
| role unit | 0.929±0.027 |
| head unit | 0.929±0.027 |
| lexical order head unit | 0.961±0.000 |
| lexical bag head unit | 0.961±0.000 |
| role direction | 0.895±0.045 |
| head direction | 0.895±0.045 |
| lexical order head direction | 0.990±0.000 |
| lexical bag head direction | 0.990±0.000 |
| role axis | 0.962±0.026 |
| head axis | 0.962±0.026 |
| lexical order head axis | 0.981±0.000 |
| lexical bag head axis | 0.981±0.000 |
| role layout | 0.988±0.012 |
| head layout | 0.988±0.012 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.965±0.019 |
| head pairing | 0.965±0.019 |
| lexical order head pairing | 0.985±0.000 |
| lexical bag head pairing | 0.985±0.000 |
| role source | 0.801±0.016 |
| head source | 0.802±0.018 |
| lexical order head source | 0.835±0.000 |
| lexical bag head source | 0.835±0.000 |
| role target | 0.847±0.014 |
| head target | 0.852±0.015 |
| lexical order head target | 0.850±0.000 |
| lexical bag head target | 0.850±0.000 |
| role quantity | 0.759±0.045 |
| head quantity | 0.759±0.045 |
| lexical order head quantity | 0.893±0.000 |
| lexical bag head quantity | 0.893±0.000 |
| heads FULL (model) | 0.076±0.034 |
| heads FULL (lexical order baseline) | 0.019±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.044±0.000 |
| role object [presence not decided] | 0.612±0.019 |
| role color [presence not decided] | 0.071±0.011 |
| role size [presence not decided] | 0.150±0.012 |
| role style [presence not decided] | 0.100±0.016 |
| role text [presence not decided] | 0.136±0.008 |
| role relation [presence not decided] | 0.201±0.008 |
| role landmark [presence not decided] | 0.131±0.008 |
| role region [presence not decided] | 0.118±0.002 |
| role anchor [presence not decided] | 0.141±0.010 |
| role fraction [presence not decided] | 0.138±0.013 |
| role amount [presence not decided] | 0.105±0.013 |
| role unit [presence not decided] | 0.114±0.009 |
| role direction [presence not decided] | 0.084±0.009 |
| role axis [presence not decided] | 0.094±0.009 |
| role layout [presence not decided] | 0.075±0.009 |
| role pairing [presence not decided] | 0.089±0.009 |
| role source [presence not decided] | 0.053±0.013 |
| role target [presence not decided] | 0.064±0.013 |
| role quantity [presence not decided] | 0.163±0.013 |
| heads FULL (model) [presence not decided] | 0.010±0.000 |
| role object [pooled midpoint (comparison)] | 0.376±0.008 |
| role color [pooled midpoint (comparison)] | 0.983±0.006 |
| role size [pooled midpoint (comparison)] | 0.902±0.026 |
| role style [pooled midpoint (comparison)] | 0.749±0.082 |
| role text [pooled midpoint (comparison)] | 0.833±0.015 |
| role relation [pooled midpoint (comparison)] | 0.913±0.012 |
| role landmark [pooled midpoint (comparison)] | 0.868±0.017 |
| role region [pooled midpoint (comparison)] | 0.947±0.006 |
| role anchor [pooled midpoint (comparison)] | 0.938±0.013 |
| role fraction [pooled midpoint (comparison)] | 0.931±0.012 |
| role amount [pooled midpoint (comparison)] | 0.956±0.010 |
| role unit [pooled midpoint (comparison)] | 0.957±0.013 |
| role direction [pooled midpoint (comparison)] | 0.923±0.043 |
| role axis [pooled midpoint (comparison)] | 0.970±0.018 |
| role layout [pooled midpoint (comparison)] | 0.995±0.005 |
| role pairing [pooled midpoint (comparison)] | 0.966±0.012 |
| role source [pooled midpoint (comparison)] | 0.824±0.010 |
| role target [pooled midpoint (comparison)] | 0.850±0.011 |
| role quantity [pooled midpoint (comparison)] | 0.791±0.029 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.085±0.021 |
| presence object: present read present [pooled midpoint (comparison)] | 0.914±0.011 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.980±0.010 |
| presence size: present read present [pooled midpoint (comparison)] | 0.985±0.031 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.620±0.161 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.822±0.019 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.941±0.019 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.919±0.037 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.956±0.011 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.980±0.018 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.974±0.019 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.938±0.019 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.934±0.019 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.866±0.075 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 0.951±0.028 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.992±0.009 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.953±0.026 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.974±0.017 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.976±0.016 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.717±0.057 |
| presence size: absent read absent | 0.787±0.029 |
| presence text: present read present | 0.792±0.121 |
| presence text: share of true 'present' readings that abstain | 0.637±0.091 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.852±0.040 |
| presence text: present read present [pooled midpoint (comparison)] | 0.834±0.043 |
| presence color: share of 'present' readings that abstain | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: share of FALSE 'present' readings that abstain | 0.955±0.031 |
| presence axis: share of 'present' readings that abstain | 0.555±0.206 |
| presence axis: share of FALSE 'present' readings that abstain | 0.938±0.081 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.991±0.017 |
| presence target: share of true 'present' readings that abstain | 0.992±0.017 |
| determiner identity (outside FULL when the legend excludes it) | 0.622±0.051 |
| presence source: present read present [pooled midpoint (comparison)] | 0.991±0.017 |
| presence target: present read present [pooled midpoint (comparison)] | 0.990±0.019 |
| presence object: absent read absent | 0.633±0.194 |
| presence object: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: share of 'present' readings that abstain | 0.992±0.010 |
| presence style: share of FALSE 'present' readings that abstain | 0.991±0.011 |
| presence pairing: present read present | nan±nan |
| presence pairing: share of 'present' readings that abstain | 0.706±0.192 |
| presence pairing: share of true 'present' readings that abstain | nan±nan |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.710±0.107 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: share of FALSE 'present' readings that abstain | 0.986±0.029 |
| presence relation: present read present | 0.896±0.071 |
| presence relation: share of true 'present' readings that abstain | 0.425±0.119 |
| presence landmark: present read present | 0.865±0.072 |
| presence landmark: share of true 'present' readings that abstain | 0.832±0.066 |
| presence amount: present read present | 0.925±0.061 |
| presence amount: share of true 'present' readings that abstain | 0.836±0.061 |
| presence unit: present read present | 0.900±0.122 |
| presence unit: share of true 'present' readings that abstain | 0.075±0.100 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.833±0.076 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.857±0.083 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.921±0.064 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.871±0.112 |
| presence style: present read present | 0.750±0.247 |
| presence style: present read present [pooled midpoint (comparison)] | 0.867±0.267 |
| presence region: present read present | 0.948±0.042 |
| presence region: share of true 'present' readings that abstain | 0.740±0.070 |
| presence region: present read present [pooled midpoint (comparison)] | 0.801±0.141 |
| presence quantity: present read present | 0.727±0.112 |
| presence quantity: share of true 'present' readings that abstain | 0.762±0.164 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.686±0.097 |
| presence style: share of true 'present' readings that abstain | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | nan±nan |
| presence layout: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: present read present | nan±nan |
| presence color: share of true 'present' readings that abstain | nan±nan |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.697±0.093 |
| presence anchor: share of true 'present' readings that abstain | 0.227±0.137 |
| presence fraction: present read present | 0.800±0.219 |
| presence fraction: share of true 'present' readings that abstain | 0.570±0.331 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.817±0.153 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.050±0.100 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| occupancy: unknown filler | 0.800±0.400 |

residual mean 0.704±0.029; status {'abstain': 131, 'no-sense': 70, 'ok': 5}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.660 | 0.187 / 0.101 | 0.95 | 0.311 | 0.019 / 0.029 |
| role object | 0.409 | 0.111 / 0.000 | 0.62 | 0.237 | 0.030 / 0.354 |
| roles (pooled) | 0.393 | 0.064 / 0.000 | 0.39 | 0.123 | 0.125 / 0.485 |
| role size | 0.882 | 0.046 / 0.013 | 0.35 | 0.000 | 0.529 / 0.118 |
| role text | 0.286 | 0.021 / 0.000 | 0.19 | 0.048 | 0.143 / 0.667 |
| role source | 0.029 | 0.006 / 0.000 | 0.00 | 0.000 | 0.029 / 0.971 |
| role target | 0.097 | 0.012 / 0.002 | 0.03 | 0.000 | 0.065 / 0.903 |
| role pairing | 1.000 | 0.105 / 0.083 | 1.00 | 0.000 | 0.000 / 0.000 |
| role anchor | 0.357 | 0.071 / 0.000 | 0.64 | 0.429 | 0.143 / 0.214 |
| role fraction | 0.143 | 0.014 / 0.000 | 0.14 | 0.071 | 0.071 / 0.786 |
| role relation | 0.667 | 0.042 / 0.000 | 0.48 | 0.037 | 0.222 / 0.296 |
| role landmark | 0.333 | 0.019 / 0.000 | 0.11 | 0.000 | 0.222 / 0.667 |
| role amount | 0.875 | 0.035 / 0.010 | 0.12 | 0.000 | 0.750 / 0.125 |
| role unit | 0.750 | 0.108 / 0.000 | 0.75 | 0.000 | 0.000 / 0.250 |
| role style | 0.167 | 0.005 / 0.000 | 0.00 | 0.000 | 0.167 / 0.833 |
| role region | 0.615 | 0.029 / 0.015 | 0.15 | 0.000 | 0.462 / 0.385 |
| role quantity | 0.364 | 0.010 / 0.000 | 0.05 | 0.000 | 0.318 / 0.636 |
| role color | 0.000 | 0.006 / 0.006 | 0.00 | 0.000 | 0.000 / 1.000 |
| role direction | 1.000 | 0.150 / 0.117 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 0.750 | 0.080 / 0.025 | 0.75 | 0.000 | 0.000 / 0.250 |

### heldout_formulations_en — catalog candidates (n = 178 of 178)
| axis | accuracy |
|---|---|
| FULL | 0.330±0.038 |
| FULL [depth given] | 0.330±0.038 |
| FULL [depth and negation given] | 0.333±0.037 |
| FULL [presence not decided] | 0.320±0.007 |
| FULL [pooled midpoint (comparison)] | 0.311±0.012 |
| structure (depth, negation) | 0.684±0.023 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.679±0.018 |
| event type (synonym table) | 0.688±0.018 |
| role object | 0.457±0.045 |
| head object | 0.509±0.050 |
| lexical order head object | 0.028±0.000 |
| lexical bag head object | 0.910±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.631±0.060 |
| occupancy: known filler | 0.683±0.028 |
| role color | 0.964±0.018 |
| head color | 0.964±0.018 |
| lexical order head color | 1.000±0.000 |
| lexical bag head color | 1.000±0.000 |
| occupancy: not given | 0.991±0.002 |
| role size | 0.946±0.008 |
| head size | 0.946±0.008 |
| lexical order head size | 0.933±0.000 |
| lexical bag head size | 0.938±0.000 |
| role style | 0.961±0.018 |
| head style | 0.961±0.018 |
| lexical order head style | 0.966±0.000 |
| lexical bag head style | 0.966±0.000 |
| role text | 0.928±0.011 |
| head text | 0.928±0.011 |
| lexical order head text | 0.865±0.000 |
| lexical bag head text | 0.865±0.000 |
| role relation | 0.987±0.004 |
| head relation | 0.987±0.004 |
| lexical order head relation | 0.882±0.000 |
| lexical bag head relation | 0.882±0.000 |
| role landmark | 0.924±0.008 |
| head landmark | 0.935±0.008 |
| lexical order head landmark | 0.882±0.000 |
| lexical bag head landmark | 0.876±0.000 |
| role region | 0.993±0.007 |
| head region | 0.993±0.007 |
| lexical order head region | 0.927±0.000 |
| lexical bag head region | 0.927±0.000 |
| role anchor | 0.999±0.002 |
| head anchor | 0.999±0.002 |
| lexical order head anchor | 0.949±0.000 |
| lexical bag head anchor | 0.949±0.000 |
| role fraction | 0.998±0.003 |
| head fraction | 0.998±0.003 |
| lexical order head fraction | 0.949±0.000 |
| lexical bag head fraction | 0.949±0.000 |
| role amount | 0.992±0.004 |
| head amount | 0.992±0.004 |
| lexical order head amount | 0.972±0.000 |
| lexical bag head amount | 0.972±0.000 |
| role unit | 0.989±0.007 |
| head unit | 0.989±0.007 |
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
| role source | 0.837±0.007 |
| head source | 0.840±0.008 |
| lexical order head source | 0.831±0.000 |
| lexical bag head source | 0.831±0.000 |
| role target | 0.910±0.016 |
| head target | 0.916±0.017 |
| lexical order head target | 0.837±0.000 |
| lexical bag head target | 0.837±0.000 |
| role quantity | 0.931±0.013 |
| head quantity | 0.931±0.013 |
| lexical order head quantity | 0.910±0.000 |
| lexical bag head quantity | 0.910±0.000 |
| heads FULL (model) | 0.382±0.042 |
| heads FULL (lexical order baseline) | 0.017±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.292±0.000 |
| role object [presence not decided] | 0.667±0.026 |
| role color [presence not decided] | 0.736±0.000 |
| role size [presence not decided] | 0.880±0.003 |
| role style [presence not decided] | 0.899±0.000 |
| role text [presence not decided] | 0.909±0.007 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.824±0.010 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 0.991±0.007 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 0.990±0.002 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.821±0.009 |
| role target [presence not decided] | 0.865±0.023 |
| role quantity [presence not decided] | 0.985±0.007 |
| heads FULL (model) [presence not decided] | 0.357±0.006 |
| role object [pooled midpoint (comparison)] | 0.428±0.010 |
| role color [pooled midpoint (comparison)] | 0.987±0.014 |
| role size [pooled midpoint (comparison)] | 0.945±0.009 |
| role style [pooled midpoint (comparison)] | 0.947±0.018 |
| role text [pooled midpoint (comparison)] | 0.928±0.007 |
| role relation [pooled midpoint (comparison)] | 0.984±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.927±0.008 |
| role region [pooled midpoint (comparison)] | 0.990±0.006 |
| role anchor [pooled midpoint (comparison)] | 1.000±0.000 |
| role fraction [pooled midpoint (comparison)] | 0.999±0.002 |
| role amount [pooled midpoint (comparison)] | 0.981±0.003 |
| role unit [pooled midpoint (comparison)] | 0.985±0.003 |
| role direction [pooled midpoint (comparison)] | 0.994±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 0.994±0.000 |
| role source [pooled midpoint (comparison)] | 0.840±0.010 |
| role target [pooled midpoint (comparison)] | 0.912±0.016 |
| role quantity [pooled midpoint (comparison)] | 0.929±0.015 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.372±0.023 |
| presence object: absent read absent | 1.000±0.000 |
| presence color: absent read absent | 0.949±0.025 |
| presence size: absent read absent | 0.959±0.019 |
| presence style: absent read absent | 0.967±0.024 |
| presence text: absent read absent | 0.954±0.011 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.974±0.007 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 0.998±0.003 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.978±0.008 |
| presence target: absent read absent | 0.988±0.012 |
| presence quantity: absent read absent | 0.995±0.004 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.980±0.020 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.972±0.017 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.946±0.024 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.953±0.008 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.987±0.005 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.982±0.010 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.988±0.012 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.988±0.008 |
| presence object: present read present | 0.898±0.055 |
| presence object: share of 'present' readings that abstain | 0.062±0.015 |
| presence object: share of true 'present' readings that abstain | 0.062±0.015 |
| presence relation: present read present | 0.989±0.022 |
| presence relation: share of 'present' readings that abstain | 0.117±0.060 |
| presence relation: share of true 'present' readings that abstain | 0.117±0.060 |
| presence landmark: present read present | 0.691±0.041 |
| presence landmark: share of 'present' readings that abstain | 0.711±0.088 |
| presence landmark: share of true 'present' readings that abstain | 0.645±0.116 |
| presence direction: absent read absent | 1.000±0.000 |
| presence object: present read present [pooled midpoint (comparison)] | 0.881±0.016 |
| presence relation: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.661±0.064 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.975±0.050 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence source: present read present | 0.922±0.035 |
| presence source: share of 'present' readings that abstain | 0.945±0.039 |
| presence source: share of true 'present' readings that abstain | 0.966±0.032 |
| presence target: present read present | 0.922±0.043 |
| presence target: share of 'present' readings that abstain | 0.795±0.053 |
| presence target: share of true 'present' readings that abstain | 0.794±0.059 |
| presence source: present read present [pooled midpoint (comparison)] | 0.952±0.031 |
| presence target: present read present [pooled midpoint (comparison)] | 0.944±0.041 |
| presence color: share of 'present' readings that abstain | 0.983±0.033 |
| presence color: share of FALSE 'present' readings that abstain | 0.983±0.033 |
| presence text: present read present | 0.988±0.025 |
| presence text: share of 'present' readings that abstain | 0.197±0.088 |
| presence text: share of true 'present' readings that abstain | 0.140±0.101 |
| presence text: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.576±0.161 |
| presence size: share of FALSE 'present' readings that abstain | 0.786±0.192 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 0.978±0.044 |
| presence fraction: share of 'present' readings that abstain | 0.136±0.163 |
| presence fraction: share of true 'present' readings that abstain | 0.136±0.163 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.978±0.044 |
| presence region: present read present | 0.965±0.043 |
| presence region: share of 'present' readings that abstain | 0.031±0.062 |
| presence region: share of true 'present' readings that abstain | 0.031±0.062 |
| presence region: present read present [pooled midpoint (comparison)] | 0.903±0.060 |
| presence size: present read present | 0.735±0.157 |
| presence size: share of true 'present' readings that abstain | 0.463±0.173 |
| presence amount: present read present | 0.790±0.128 |
| presence amount: share of 'present' readings that abstain | 0.440±0.278 |
| presence amount: share of true 'present' readings that abstain | 0.410±0.289 |
| presence unit: present read present | 0.620±0.240 |
| presence size: present read present [pooled midpoint (comparison)] | 0.594±0.172 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.413±0.185 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.583±0.123 |
| presence source: share of FALSE 'present' readings that abstain | 0.733±0.226 |
| presence unit: share of 'present' readings that abstain | 0.140±0.196 |
| presence unit: share of true 'present' readings that abstain | 0.140±0.196 |
| presence style: present read present | 0.630±0.227 |
| presence style: share of true 'present' readings that abstain | 1.000±0.000 |
| presence style: present read present [pooled midpoint (comparison)] | 0.640±0.265 |
| presence quantity: present read present | 0.933±0.133 |
| presence quantity: share of 'present' readings that abstain | 0.290±0.037 |
| presence quantity: share of true 'present' readings that abstain | 0.152±0.139 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.960±0.080 |
| occupancy: unknown filler | 0.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence text: share of FALSE 'present' readings that abstain | 0.407±0.259 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.639±0.016; status {'no-sense': 50, 'abstain': 119, 'ok': 9}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.691 | 0.174 / 0.078 | 0.93 | 0.264 | 0.022 / 0.045 |
| role object | 0.439 | 0.126 / 0.000 | 0.64 | 0.225 | 0.023 / 0.335 |
| roles (pooled) | 0.499 | 0.088 / 0.000 | 0.54 | 0.141 | 0.103 / 0.361 |
| role direction | 0.667 | 0.114 / 0.032 | 0.67 | 0.000 | 0.000 / 0.333 |
| role relation | 0.810 | 0.104 / 0.000 | 0.81 | 0.048 | 0.048 / 0.143 |
| role landmark | 0.429 | 0.022 / 0.000 | 0.19 | 0.048 | 0.286 / 0.524 |
| role text | 0.708 | 0.082 / 0.009 | 0.75 | 0.125 | 0.083 / 0.167 |
| role source | 0.167 | 0.018 / -0.007 | 0.07 | 0.067 | 0.167 / 0.767 |
| role target | 0.414 | 0.025 / 0.000 | 0.10 | 0.000 | 0.310 / 0.586 |
| role size | 0.917 | 0.049 / 0.006 | 0.50 | 0.000 | 0.417 / 0.083 |
| role quantity | 0.188 | 0.034 / 0.000 | 0.44 | 0.312 | 0.062 / 0.500 |
| role anchor | 1.000 | 0.106 / 0.078 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 0.889 | 0.074 / 0.032 | 0.78 | 0.000 | 0.111 / 0.111 |
| role region | 0.846 | 0.127 / 0.097 | 0.92 | 0.077 | 0.000 / 0.077 |
| role amount | 1.000 | 0.041 / 0.025 | 0.20 | 0.000 | 0.800 / 0.000 |
| role unit | 0.400 | 0.052 / 0.000 | 0.40 | 0.000 | 0.000 / 0.600 |
| role pairing | 0.000 | 0.152 / 0.152 | 1.00 | 1.000 | 0.000 / 0.000 |
| role style | 0.167 | -0.000 / -0.000 | 0.00 | 0.000 | 0.167 / 0.833 |

### heldout_formulations_en — experiment candidates (n = 178 of 178)
| axis | accuracy |
|---|---|
| FULL | 0.051±0.023 |
| FULL [depth given] | 0.051±0.023 |
| FULL [depth and negation given] | 0.051±0.023 |
| FULL [presence not decided] | 0.000±0.000 |
| FULL [pooled midpoint (comparison)] | 0.069±0.025 |
| structure (depth, negation) | 0.619±0.034 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.620±0.032 |
| event type (synonym table) | 0.628±0.031 |
| role object | 0.385±0.040 |
| head object | 0.476±0.047 |
| lexical order head object | 0.028±0.000 |
| lexical bag head object | 0.910±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.543±0.024 |
| occupancy: known filler | 0.636±0.035 |
| role color | 0.924±0.034 |
| head color | 0.924±0.034 |
| lexical order head color | 1.000±0.000 |
| lexical bag head color | 1.000±0.000 |
| occupancy: not given | 0.906±0.008 |
| role size | 0.882±0.033 |
| head size | 0.882±0.033 |
| lexical order head size | 0.933±0.000 |
| lexical bag head size | 0.938±0.000 |
| role style | 0.803±0.089 |
| head style | 0.803±0.089 |
| lexical order head style | 0.966±0.000 |
| lexical bag head style | 0.966±0.000 |
| role text | 0.745±0.055 |
| head text | 0.745±0.055 |
| lexical order head text | 0.865±0.000 |
| lexical bag head text | 0.865±0.000 |
| role relation | 0.825±0.029 |
| head relation | 0.825±0.029 |
| lexical order head relation | 0.882±0.000 |
| lexical bag head relation | 0.882±0.000 |
| role landmark | 0.822±0.031 |
| head landmark | 0.825±0.032 |
| lexical order head landmark | 0.882±0.000 |
| lexical bag head landmark | 0.876±0.000 |
| role region | 0.920±0.041 |
| head region | 0.920±0.041 |
| lexical order head region | 0.927±0.000 |
| lexical bag head region | 0.927±0.000 |
| role anchor | 0.931±0.023 |
| head anchor | 0.931±0.023 |
| lexical order head anchor | 0.949±0.000 |
| lexical bag head anchor | 0.949±0.000 |
| role fraction | 0.926±0.029 |
| head fraction | 0.926±0.029 |
| lexical order head fraction | 0.949±0.000 |
| lexical bag head fraction | 0.949±0.000 |
| role amount | 0.943±0.025 |
| head amount | 0.943±0.025 |
| lexical order head amount | 0.972±0.000 |
| lexical bag head amount | 0.972±0.000 |
| role unit | 0.956±0.024 |
| head unit | 0.956±0.024 |
| lexical order head unit | 0.972±0.000 |
| lexical bag head unit | 0.972±0.000 |
| role direction | 0.882±0.042 |
| head direction | 0.882±0.042 |
| lexical order head direction | 0.983±0.000 |
| lexical bag head direction | 0.983±0.000 |
| role axis | 0.947±0.021 |
| head axis | 0.947±0.021 |
| lexical order head axis | 1.000±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 0.988±0.006 |
| head layout | 0.988±0.006 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.944±0.022 |
| head pairing | 0.944±0.022 |
| lexical order head pairing | 0.994±0.000 |
| lexical bag head pairing | 0.994±0.000 |
| role source | 0.740±0.025 |
| head source | 0.740±0.025 |
| lexical order head source | 0.831±0.000 |
| lexical bag head source | 0.831±0.000 |
| role target | 0.836±0.028 |
| head target | 0.836±0.028 |
| lexical order head target | 0.837±0.000 |
| lexical bag head target | 0.837±0.000 |
| role quantity | 0.742±0.058 |
| head quantity | 0.742±0.058 |
| lexical order head quantity | 0.910±0.000 |
| lexical bag head quantity | 0.910±0.000 |
| heads FULL (model) | 0.055±0.026 |
| heads FULL (lexical order baseline) | 0.017±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.292±0.000 |
| role object [presence not decided] | 0.547±0.019 |
| role color [presence not decided] | 0.148±0.016 |
| role size [presence not decided] | 0.200±0.012 |
| role style [presence not decided] | 0.162±0.012 |
| role text [presence not decided] | 0.209±0.024 |
| role relation [presence not decided] | 0.234±0.013 |
| role landmark [presence not decided] | 0.154±0.008 |
| role region [presence not decided] | 0.220±0.015 |
| role anchor [presence not decided] | 0.197±0.016 |
| role fraction [presence not decided] | 0.194±0.017 |
| role amount [presence not decided] | 0.172±0.017 |
| role unit [presence not decided] | 0.176±0.016 |
| role direction [presence not decided] | 0.165±0.016 |
| role axis [presence not decided] | 0.148±0.016 |
| role layout [presence not decided] | 0.148±0.016 |
| role pairing [presence not decided] | 0.154±0.016 |
| role source [presence not decided] | 0.125±0.013 |
| role target [presence not decided] | 0.160±0.017 |
| role quantity [presence not decided] | 0.200±0.018 |
| heads FULL (model) [presence not decided] | 0.000±0.000 |
| role object [pooled midpoint (comparison)] | 0.384±0.013 |
| role color [pooled midpoint (comparison)] | 0.976±0.010 |
| role size [pooled midpoint (comparison)] | 0.904±0.022 |
| role style [pooled midpoint (comparison)] | 0.767±0.070 |
| role text [pooled midpoint (comparison)] | 0.743±0.034 |
| role relation [pooled midpoint (comparison)] | 0.911±0.011 |
| role landmark [pooled midpoint (comparison)] | 0.867±0.008 |
| role region [pooled midpoint (comparison)] | 0.967±0.013 |
| role anchor [pooled midpoint (comparison)] | 0.970±0.010 |
| role fraction [pooled midpoint (comparison)] | 0.944±0.015 |
| role amount [pooled midpoint (comparison)] | 0.956±0.007 |
| role unit [pooled midpoint (comparison)] | 0.971±0.007 |
| role direction [pooled midpoint (comparison)] | 0.913±0.026 |
| role axis [pooled midpoint (comparison)] | 0.954±0.013 |
| role layout [pooled midpoint (comparison)] | 0.992±0.003 |
| role pairing [pooled midpoint (comparison)] | 0.956±0.016 |
| role source [pooled midpoint (comparison)] | 0.772±0.021 |
| role target [pooled midpoint (comparison)] | 0.834±0.028 |
| role quantity [pooled midpoint (comparison)] | 0.785±0.033 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.078±0.030 |
| presence object: absent read absent | 1.000±0.000 |
| presence color: absent read absent | 0.881±0.053 |
| presence size: absent read absent | 0.863±0.065 |
| presence style: absent read absent | 0.719±0.158 |
| presence text: absent read absent | 0.655±0.091 |
| presence relation: absent read absent | 0.733±0.035 |
| presence landmark: absent read absent | 0.850±0.048 |
| presence region: absent read absent | 0.876±0.071 |
| presence anchor: absent read absent | 0.887±0.042 |
| presence fraction: absent read absent | 0.884±0.040 |
| presence amount: absent read absent | 0.922±0.038 |
| presence unit: absent read absent | 0.948±0.036 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.888±0.044 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: absent read absent | 0.916±0.034 |
| presence layout: absent read absent | 0.981±0.008 |
| presence pairing: absent read absent | 0.919±0.040 |
| presence source: absent read absent | 0.825±0.044 |
| presence target: absent read absent | 0.938±0.028 |
| presence quantity: absent read absent | 0.681±0.104 |
| presence quantity: share of 'present' readings that abstain | 0.940±0.027 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.961±0.017 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.906±0.054 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.646±0.128 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.633±0.052 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.890±0.028 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.930±0.013 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.960±0.022 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.948±0.023 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.907±0.022 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.960±0.017 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.977±0.011 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 0.924±0.024 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.987±0.004 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.937±0.028 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.877±0.038 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.936±0.039 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.745±0.058 |
| presence object: present read present | 0.921±0.039 |
| presence object: share of 'present' readings that abstain | 0.085±0.015 |
| presence object: share of true 'present' readings that abstain | 0.085±0.015 |
| presence style: share of 'present' readings that abstain | 0.982±0.036 |
| presence style: share of FALSE 'present' readings that abstain | 0.978±0.044 |
| presence text: share of 'present' readings that abstain | 0.833±0.073 |
| presence text: share of FALSE 'present' readings that abstain | 0.980±0.018 |
| presence relation: present read present | 0.988±0.024 |
| presence relation: share of 'present' readings that abstain | 0.710±0.089 |
| presence relation: share of true 'present' readings that abstain | 0.300±0.169 |
| presence landmark: present read present | 0.966±0.045 |
| presence landmark: share of 'present' readings that abstain | 1.000±0.000 |
| presence landmark: share of true 'present' readings that abstain | 1.000±0.000 |
| presence direction: absent read absent | 0.818±0.076 |
| presence object: present read present [pooled midpoint (comparison)] | 0.911±0.018 |
| presence relation: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.930±0.040 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.866±0.037 |
| presence axis: share of 'present' readings that abstain | 0.920±0.046 |
| presence axis: share of FALSE 'present' readings that abstain | 0.920±0.046 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.938±0.081 |
| presence amount: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 1.000±0.000 |
| presence target: share of true 'present' readings that abstain | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: share of FALSE 'present' readings that abstain | 0.994±0.013 |
| presence text: present read present | 0.985±0.031 |
| presence text: share of true 'present' readings that abstain | 0.485±0.131 |
| presence text: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.914±0.069 |
| presence size: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.637±0.082 |
| presence anchor: share of true 'present' readings that abstain | 0.208±0.043 |
| presence fraction: present read present | 0.978±0.044 |
| presence fraction: share of 'present' readings that abstain | 0.752±0.073 |
| presence fraction: share of true 'present' readings that abstain | 0.500±0.141 |
| presence direction: share of FALSE 'present' readings that abstain | 0.994±0.013 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.978±0.044 |
| presence region: present read present | 0.965±0.043 |
| presence region: share of 'present' readings that abstain | 0.512±0.139 |
| presence region: share of true 'present' readings that abstain | 0.144±0.101 |
| presence region: present read present [pooled midpoint (comparison)] | 0.917±0.053 |
| presence region: share of FALSE 'present' readings that abstain | 0.960±0.080 |
| presence size: present read present | 0.732±0.156 |
| presence size: share of true 'present' readings that abstain | 0.785±0.112 |
| presence amount: present read present | 0.840±0.150 |
| presence amount: share of true 'present' readings that abstain | 0.860±0.196 |
| presence unit: present read present | 0.620±0.240 |
| presence size: present read present [pooled midpoint (comparison)] | 0.594±0.168 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.463±0.137 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.563±0.127 |
| presence unit: share of 'present' readings that abstain | 0.647±0.230 |
| presence unit: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: share of FALSE 'present' readings that abstain | 0.987±0.027 |
| presence fraction: share of FALSE 'present' readings that abstain | 0.968±0.063 |
| presence layout: share of 'present' readings that abstain | 1.000±0.000 |
| presence layout: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.140±0.196 |
| presence style: present read present | 0.590±0.218 |
| presence style: share of true 'present' readings that abstain | 1.000±0.000 |
| presence style: present read present [pooled midpoint (comparison)] | 0.590±0.269 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of true 'present' readings that abstain | 0.505±0.137 |
| presence quantity: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| occupancy: unknown filler | 0.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.905±0.131 |
| presence pairing: share of FALSE 'present' readings that abstain | 0.905±0.131 |

residual mean 0.687±0.019; status {'no-sense': 65, 'abstain': 107, 'ok': 6}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.612 | 0.174 / 0.078 | 0.93 | 0.326 | 0.006 / 0.062 |
| role object | 0.410 | 0.099 / 0.000 | 0.64 | 0.249 | 0.023 / 0.341 |
| roles (pooled) | 0.403 | 0.064 / 0.000 | 0.45 | 0.135 | 0.085 / 0.462 |
| role direction | 0.667 | 0.102 / 0.027 | 0.67 | 0.000 | 0.000 / 0.333 |
| role relation | 0.762 | 0.065 / 0.000 | 0.76 | 0.048 | 0.048 / 0.190 |
| role landmark | 0.238 | 0.010 / 0.000 | 0.00 | 0.000 | 0.238 / 0.762 |
| role text | 0.542 | 0.047 / 0.002 | 0.46 | 0.083 | 0.167 / 0.375 |
| role source | 0.000 | 0.007 / 0.001 | 0.00 | 0.000 | 0.000 / 1.000 |
| role target | 0.034 | 0.009 / 0.001 | 0.00 | 0.000 | 0.034 / 0.966 |
| role size | 0.583 | 0.024 / 0.004 | 0.08 | 0.000 | 0.500 / 0.417 |
| role quantity | 0.188 | 0.024 / 0.000 | 0.25 | 0.188 | 0.125 / 0.625 |
| role anchor | 1.000 | 0.072 / 0.040 | 0.78 | 0.000 | 0.222 / 0.000 |
| role fraction | 0.889 | 0.046 / 0.015 | 0.56 | 0.000 | 0.333 / 0.111 |
| role region | 0.846 | 0.089 / 0.038 | 0.85 | 0.077 | 0.077 / 0.077 |
| role amount | 0.800 | 0.030 / 0.008 | 0.20 | 0.000 | 0.600 / 0.200 |
| role unit | 0.400 | 0.060 / 0.000 | 0.40 | 0.000 | 0.000 / 0.600 |
| role pairing | 0.000 | 0.122 / 0.122 | 1.00 | 1.000 | 0.000 / 0.000 |
| role style | 0.000 | 0.004 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |

### heldout_sentences — catalog candidates (n = 96 of 96)
| axis | accuracy |
|---|---|
| FULL | 0.362±0.045 |
| FULL [depth given] | 0.362±0.045 |
| FULL [depth and negation given] | 0.362±0.045 |
| FULL [pooled midpoint (comparison)] | 0.344±0.020 |
| presence object: present read present | 0.792±0.095 |
| presence object: share of 'present' readings that abstain | 0.065±0.016 |
| presence object: share of true 'present' readings that abstain | 0.067±0.017 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.367±0.194 |
| presence color: share of true 'present' readings that abstain | 0.267±0.133 |
| presence size: absent read absent | 0.974±0.008 |
| presence style: absent read absent | 0.976±0.012 |
| presence text: absent read absent | 0.996±0.008 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.984±0.017 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.987±0.012 |
| presence target: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.690±0.040 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.683±0.046 |
| event type (synonym table) | 0.700±0.043 |
| role object | 0.475±0.057 |
| head object | 0.531±0.074 |
| lexical order head object | 0.062±0.000 |
| lexical bag head object | 0.438±0.000 |
| occupancy: known filler | 0.607±0.044 |
| role color | 0.992±0.004 |
| head color | 0.992±0.004 |
| lexical order head color | 0.969±0.000 |
| lexical bag head color | 0.969±0.000 |
| role size | 0.942±0.011 |
| head size | 0.942±0.011 |
| lexical order head size | 0.917±0.000 |
| lexical bag head size | 0.938±0.000 |
| occupancy: not given | 0.996±0.002 |
| role style | 0.975±0.011 |
| head style | 0.975±0.011 |
| lexical order head style | 0.979±0.000 |
| lexical bag head style | 0.990±0.000 |
| role text | 0.902±0.011 |
| head text | 0.902±0.011 |
| lexical order head text | 0.833±0.000 |
| lexical bag head text | 0.854±0.000 |
| role relation | 0.965±0.011 |
| head relation | 0.965±0.011 |
| lexical order head relation | 0.885±0.000 |
| lexical bag head relation | 0.885±0.000 |
| role landmark | 0.925±0.008 |
| head landmark | 0.931±0.005 |
| lexical order head landmark | 0.885±0.000 |
| lexical bag head landmark | 0.885±0.000 |
| role region | 0.977±0.004 |
| head region | 0.977±0.004 |
| lexical order head region | 0.896±0.000 |
| lexical bag head region | 0.896±0.000 |
| role anchor | 0.985±0.008 |
| head anchor | 0.985±0.008 |
| lexical order head anchor | 0.948±0.000 |
| lexical bag head anchor | 0.948±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.990±0.000 |
| lexical bag head fraction | 0.990±0.000 |
| role amount | 0.990±0.007 |
| head amount | 0.990±0.007 |
| lexical order head amount | 0.948±0.000 |
| lexical bag head amount | 0.948±0.000 |
| role unit | 0.990±0.007 |
| head unit | 0.990±0.007 |
| lexical order head unit | 0.948±0.000 |
| lexical bag head unit | 0.948±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.938±0.000 |
| lexical bag head direction | 0.938±0.000 |
| role axis | 0.998±0.004 |
| head axis | 0.998±0.004 |
| lexical order head axis | 0.979±0.000 |
| lexical bag head axis | 0.979±0.000 |
| role layout | 0.983±0.005 |
| head layout | 0.983±0.005 |
| lexical order head layout | 0.958±0.000 |
| lexical bag head layout | 0.958±0.000 |
| role pairing | 0.983±0.005 |
| head pairing | 0.983±0.005 |
| lexical order head pairing | 0.979±0.000 |
| lexical bag head pairing | 0.979±0.000 |
| role source | 0.894±0.010 |
| head source | 0.904±0.012 |
| lexical order head source | 0.885±0.000 |
| lexical bag head source | 0.896±0.000 |
| role target | 0.969±0.016 |
| head target | 0.969±0.016 |
| lexical order head target | 0.906±0.000 |
| lexical bag head target | 0.906±0.000 |
| role quantity | 0.985±0.005 |
| head quantity | 0.985±0.005 |
| lexical order head quantity | 0.979±0.000 |
| lexical bag head quantity | 0.979±0.000 |
| heads FULL (model) | 0.415±0.053 |
| heads FULL (lexical order baseline) | 0.010±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.135±0.000 |
| role object [pooled midpoint (comparison)] | 0.454±0.011 |
| role color [pooled midpoint (comparison)] | 0.996±0.005 |
| role size [pooled midpoint (comparison)] | 0.944±0.011 |
| role style [pooled midpoint (comparison)] | 0.977±0.012 |
| role text [pooled midpoint (comparison)] | 0.898±0.012 |
| role relation [pooled midpoint (comparison)] | 0.940±0.010 |
| role landmark [pooled midpoint (comparison)] | 0.927±0.007 |
| role region [pooled midpoint (comparison)] | 0.975±0.005 |
| role anchor [pooled midpoint (comparison)] | 0.983±0.008 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.983±0.005 |
| role unit [pooled midpoint (comparison)] | 0.985±0.005 |
| role direction [pooled midpoint (comparison)] | 0.998±0.004 |
| role axis [pooled midpoint (comparison)] | 0.994±0.005 |
| role layout [pooled midpoint (comparison)] | 0.983±0.005 |
| role pairing [pooled midpoint (comparison)] | 0.983±0.005 |
| role source [pooled midpoint (comparison)] | 0.900±0.005 |
| role target [pooled midpoint (comparison)] | 0.969±0.016 |
| role quantity [pooled midpoint (comparison)] | 0.983±0.005 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.400±0.028 |
| presence object: present read present [pooled midpoint (comparison)] | 0.802±0.033 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.980±0.008 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.971±0.013 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.996±0.007 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.993±0.009 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.993±0.009 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.993±0.014 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.997±0.006 |
| determiner identity (outside FULL when the legend excludes it) | 0.576±0.096 |
| presence color: absent read absent | 0.987±0.006 |
| presence region: present read present | 0.911±0.083 |
| presence region: share of 'present' readings that abstain | 0.057±0.114 |
| presence region: share of true 'present' readings that abstain | 0.057±0.114 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.994±0.008 |
| presence region: present read present [pooled midpoint (comparison)] | 0.950±0.061 |
| presence size: present read present | 0.883±0.145 |
| presence size: share of 'present' readings that abstain | 0.327±0.185 |
| presence size: share of true 'present' readings that abstain | 0.207±0.112 |
| presence size: present read present [pooled midpoint (comparison)] | 0.860±0.196 |
| presence relation: present read present | 0.931±0.057 |
| presence relation: share of 'present' readings that abstain | 0.073±0.093 |
| presence relation: share of true 'present' readings that abstain | 0.073±0.093 |
| presence landmark: present read present | 0.714±0.127 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.721±0.129 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.668±0.059 |
| presence amount: present read present | 0.950±0.100 |
| presence amount: share of 'present' readings that abstain | 0.080±0.160 |
| presence amount: share of true 'present' readings that abstain | 0.080±0.160 |
| presence unit: present read present | 0.950±0.100 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.850±0.122 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.900±0.122 |
| presence landmark: share of 'present' readings that abstain | 0.349±0.157 |
| presence landmark: share of true 'present' readings that abstain | 0.285±0.141 |
| presence text: present read present | 0.813±0.108 |
| presence text: share of 'present' readings that abstain | 0.227±0.076 |
| presence text: share of true 'present' readings that abstain | 0.235±0.088 |
| presence text: present read present [pooled midpoint (comparison)] | 0.815±0.062 |
| presence style: present read present | 0.700±0.400 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: present read present | 0.800±0.163 |
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.800±0.163 |
| presence source: present read present | 0.500±0.162 |
| presence target: present read present | 0.850±0.184 |
| presence target: share of 'present' readings that abstain | 0.761±0.156 |
| presence target: share of true 'present' readings that abstain | 0.761±0.156 |
| presence source: present read present [pooled midpoint (comparison)] | 0.499±0.126 |
| presence target: present read present [pooled midpoint (comparison)] | 0.946±0.066 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence object: absent read absent | 0.700±0.041 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.167±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.167±0.000 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.700±0.041 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.967±0.067 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.100±0.200 |
| presence axis: share of true 'present' readings that abstain | 0.100±0.200 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.100±0.200 |
| presence anchor: share of true 'present' readings that abstain | 0.100±0.200 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.933±0.133 |
| presence source: share of 'present' readings that abstain | 0.917±0.105 |
| presence source: share of true 'present' readings that abstain | 0.910±0.111 |
| presence pairing: present read present | nan±nan |
| presence pairing: share of 'present' readings that abstain | nan±nan |
| presence pairing: share of true 'present' readings that abstain | nan±nan |
| presence pairing: present read present [pooled midpoint (comparison)] | nan±nan |
| presence style: share of 'present' readings that abstain | 0.900±0.200 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| occupancy: unknown filler | 0.000±0.000 |
| presence size: share of FALSE 'present' readings that abstain | 0.500±0.447 |
| presence unit: share of 'present' readings that abstain | 0.050±0.100 |
| presence unit: share of true 'present' readings that abstain | 0.050±0.100 |
| presence object: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.638±0.025; status {'abstain': 65, 'no-sense': 29, 'ok': 2}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.688 | 0.178 / 0.080 | 0.93 | 0.271 | 0.031 / 0.042 |
| role object | 0.489 | 0.145 / 0.000 | 0.64 | 0.178 | 0.022 / 0.333 |
| roles (pooled) | 0.532 | 0.100 / 0.000 | 0.58 | 0.108 | 0.064 / 0.360 |
| role color | 1.000 | 0.079 / 0.064 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 0.700 | 0.067 / 0.000 | 0.50 | 0.000 | 0.200 / 0.300 |
| role size | 0.500 | 0.042 / 0.000 | 0.38 | 0.000 | 0.125 / 0.500 |
| role relation | 0.727 | 0.097 / 0.000 | 0.73 | 0.000 | 0.000 / 0.273 |
| role landmark | 0.455 | 0.031 / 0.000 | 0.36 | 0.000 | 0.091 / 0.545 |
| role quantity | 0.000 | 0.060 / 0.012 | 0.50 | 0.500 | 0.000 / 0.500 |
| role amount | 0.800 | 0.062 / 0.051 | 1.00 | 0.200 | 0.000 / 0.000 |
| role unit | 0.600 | 0.085 / 0.000 | 0.60 | 0.000 | 0.000 / 0.400 |
| role text | 0.312 | 0.059 / 0.000 | 0.44 | 0.125 | 0.000 / 0.562 |
| role style | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role layout | 0.500 | 0.107 / 0.031 | 0.75 | 0.250 | 0.000 / 0.250 |
| role source | 0.182 | 0.016 / 0.000 | 0.09 | 0.000 | 0.091 / 0.818 |
| role target | 0.778 | 0.038 / 0.021 | 0.22 | 0.000 | 0.556 / 0.222 |
| role direction | 1.000 | 0.126 / 0.068 | 0.83 | 0.000 | 0.167 / 0.000 |
| role axis | 1.000 | 0.143 / 0.136 | 1.00 | 0.000 | 0.000 / 0.000 |
| role anchor | 0.800 | 0.095 / 0.077 | 1.00 | 0.200 | 0.000 / 0.000 |
| role pairing | 0.500 | 0.070 / 0.034 | 0.50 | 0.000 | 0.000 / 0.500 |
| role fraction | 1.000 | 0.106 / 0.106 | 1.00 | 0.000 | 0.000 / 0.000 |

### heldout_sentences — experiment candidates (n = 96 of 96)
| axis | accuracy |
|---|---|
| FULL | 0.060±0.017 |
| FULL [depth given] | 0.060±0.017 |
| FULL [depth and negation given] | 0.060±0.017 |
| FULL [pooled midpoint (comparison)] | 0.065±0.026 |
| presence object: present read present | 0.844±0.088 |
| presence object: share of 'present' readings that abstain | 0.101±0.020 |
| presence object: share of true 'present' readings that abstain | 0.090±0.018 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.886±0.069 |
| presence color: share of true 'present' readings that abstain | 0.700±0.163 |
| presence size: absent read absent | 0.873±0.043 |
| presence style: absent read absent | 0.728±0.127 |
| presence style: share of 'present' readings that abstain | 0.980±0.040 |
| presence style: share of FALSE 'present' readings that abstain | 0.978±0.044 |
| presence text: absent read absent | 0.779±0.098 |
| presence relation: absent read absent | 0.804±0.073 |
| presence landmark: absent read absent | 0.850±0.060 |
| presence region: absent read absent | 0.901±0.026 |
| presence anchor: absent read absent | 0.894±0.039 |
| presence fraction: absent read absent | 0.939±0.025 |
| presence amount: absent read absent | 0.898±0.069 |
| presence unit: absent read absent | 0.927±0.031 |
| presence direction: absent read absent | 0.862±0.065 |
| presence axis: absent read absent | 0.941±0.037 |
| presence layout: absent read absent | 0.969±0.023 |
| presence pairing: absent read absent | 0.948±0.034 |
| presence source: absent read absent | 0.857±0.026 |
| presence target: absent read absent | 0.932±0.034 |
| presence quantity: absent read absent | 0.663±0.064 |
| structure (depth, negation) | 0.648±0.049 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.640±0.051 |
| event type (synonym table) | 0.656±0.048 |
| role object | 0.444±0.052 |
| head object | 0.521±0.070 |
| lexical order head object | 0.062±0.000 |
| lexical bag head object | 0.438±0.000 |
| occupancy: known filler | 0.607±0.056 |
| role color | 0.927±0.029 |
| head color | 0.927±0.029 |
| lexical order head color | 0.969±0.000 |
| lexical bag head color | 0.969±0.000 |
| role size | 0.877±0.030 |
| head size | 0.877±0.030 |
| lexical order head size | 0.917±0.000 |
| lexical bag head size | 0.938±0.000 |
| occupancy: not given | 0.915±0.010 |
| role style | 0.821±0.064 |
| head style | 0.821±0.064 |
| lexical order head style | 0.979±0.000 |
| lexical bag head style | 0.990±0.000 |
| role text | 0.781±0.049 |
| head text | 0.781±0.049 |
| lexical order head text | 0.833±0.000 |
| lexical bag head text | 0.854±0.000 |
| role relation | 0.852±0.042 |
| head relation | 0.852±0.042 |
| lexical order head relation | 0.885±0.000 |
| lexical bag head relation | 0.885±0.000 |
| role landmark | 0.838±0.030 |
| head landmark | 0.842±0.028 |
| lexical order head landmark | 0.885±0.000 |
| lexical bag head landmark | 0.885±0.000 |
| role region | 0.912±0.022 |
| head region | 0.912±0.022 |
| lexical order head region | 0.896±0.000 |
| lexical bag head region | 0.896±0.000 |
| role anchor | 0.919±0.026 |
| head anchor | 0.919±0.026 |
| lexical order head anchor | 0.948±0.000 |
| lexical bag head anchor | 0.948±0.000 |
| role fraction | 0.960±0.017 |
| head fraction | 0.960±0.017 |
| lexical order head fraction | 0.990±0.000 |
| lexical bag head fraction | 0.990±0.000 |
| role amount | 0.919±0.041 |
| head amount | 0.919±0.041 |
| lexical order head amount | 0.948±0.000 |
| lexical bag head amount | 0.948±0.000 |
| role unit | 0.944±0.021 |
| head unit | 0.944±0.021 |
| lexical order head unit | 0.948±0.000 |
| lexical bag head unit | 0.948±0.000 |
| role direction | 0.912±0.043 |
| head direction | 0.912±0.043 |
| lexical order head direction | 0.938±0.000 |
| lexical bag head direction | 0.938±0.000 |
| role axis | 0.960±0.025 |
| head axis | 0.960±0.025 |
| lexical order head axis | 0.979±0.000 |
| lexical bag head axis | 0.979±0.000 |
| role layout | 0.965±0.011 |
| head layout | 0.965±0.011 |
| lexical order head layout | 0.958±0.000 |
| lexical bag head layout | 0.958±0.000 |
| role pairing | 0.946±0.020 |
| head pairing | 0.946±0.020 |
| lexical order head pairing | 0.979±0.000 |
| lexical bag head pairing | 0.979±0.000 |
| role source | 0.800±0.014 |
| head source | 0.800±0.014 |
| lexical order head source | 0.885±0.000 |
| lexical bag head source | 0.896±0.000 |
| role target | 0.890±0.030 |
| head target | 0.890±0.030 |
| lexical order head target | 0.906±0.000 |
| lexical bag head target | 0.906±0.000 |
| role quantity | 0.769±0.027 |
| head quantity | 0.769±0.027 |
| lexical order head quantity | 0.979±0.000 |
| lexical bag head quantity | 0.979±0.000 |
| heads FULL (model) | 0.073±0.020 |
| heads FULL (lexical order baseline) | 0.010±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.135±0.000 |
| role object [pooled midpoint (comparison)] | 0.438±0.011 |
| role color [pooled midpoint (comparison)] | 0.965±0.012 |
| role size [pooled midpoint (comparison)] | 0.898±0.023 |
| role style [pooled midpoint (comparison)] | 0.771±0.077 |
| role text [pooled midpoint (comparison)] | 0.773±0.038 |
| role relation [pooled midpoint (comparison)] | 0.904±0.010 |
| role landmark [pooled midpoint (comparison)] | 0.871±0.016 |
| role region [pooled midpoint (comparison)] | 0.948±0.015 |
| role anchor [pooled midpoint (comparison)] | 0.950±0.026 |
| role fraction [pooled midpoint (comparison)] | 0.958±0.021 |
| role amount [pooled midpoint (comparison)] | 0.954±0.024 |
| role unit [pooled midpoint (comparison)] | 0.969±0.016 |
| role direction [pooled midpoint (comparison)] | 0.931±0.028 |
| role axis [pooled midpoint (comparison)] | 0.958±0.020 |
| role layout [pooled midpoint (comparison)] | 0.973±0.005 |
| role pairing [pooled midpoint (comparison)] | 0.950±0.017 |
| role source [pooled midpoint (comparison)] | 0.827±0.019 |
| role target [pooled midpoint (comparison)] | 0.890±0.030 |
| role quantity [pooled midpoint (comparison)] | 0.808±0.027 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.079±0.027 |
| presence object: present read present [pooled midpoint (comparison)] | 0.861±0.020 |
| presence color: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.902±0.044 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.632±0.136 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.767±0.057 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.935±0.015 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.907±0.037 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.965±0.019 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.943±0.034 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.932±0.034 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.956±0.034 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.971±0.022 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.892±0.050 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 0.941±0.035 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.982±0.011 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.953±0.027 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.898±0.034 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.927±0.038 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.710±0.041 |
| determiner identity (outside FULL when the legend excludes it) | 0.538±0.083 |
| presence color: absent read absent | 0.902±0.041 |
| presence region: present read present | 0.911±0.083 |
| presence region: share of 'present' readings that abstain | 0.682±0.081 |
| presence region: share of true 'present' readings that abstain | 0.489±0.129 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.957±0.021 |
| presence region: present read present [pooled midpoint (comparison)] | 0.950±0.061 |
| presence size: present read present | 0.870±0.166 |
| presence size: share of 'present' readings that abstain | 0.918±0.053 |
| presence size: share of true 'present' readings that abstain | 0.793±0.112 |
| presence quantity: share of 'present' readings that abstain | 0.992±0.015 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.850±0.200 |
| presence relation: present read present | 0.931±0.057 |
| presence relation: share of 'present' readings that abstain | 0.639±0.105 |
| presence relation: share of true 'present' readings that abstain | 0.174±0.121 |
| presence landmark: present read present | 0.839±0.137 |
| presence region: share of FALSE 'present' readings that abstain | 0.975±0.050 |
| presence axis: share of 'present' readings that abstain | 0.660±0.136 |
| presence axis: share of FALSE 'present' readings that abstain | nan±nan |
| presence relation: present read present [pooled midpoint (comparison)] | 0.721±0.129 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.836±0.100 |
| presence amount: present read present | 0.950±0.100 |
| presence amount: share of 'present' readings that abstain | 0.920±0.160 |
| presence amount: share of true 'present' readings that abstain | 0.900±0.200 |
| presence unit: present read present | 0.950±0.100 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.850±0.122 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.900±0.122 |
| presence text: share of 'present' readings that abstain | 0.777±0.085 |
| presence text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence landmark: share of 'present' readings that abstain | 0.948±0.029 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.495±0.158 |
| presence unit: share of FALSE 'present' readings that abstain | 0.967±0.067 |
| presence landmark: share of true 'present' readings that abstain | 0.883±0.062 |
| presence text: present read present | 0.813±0.108 |
| presence text: share of true 'present' readings that abstain | 0.446±0.217 |
| presence text: present read present [pooled midpoint (comparison)] | 0.815±0.062 |
| presence style: present read present | 0.700±0.400 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: present read present | 0.800±0.163 |
| presence layout: share of 'present' readings that abstain | 0.506±0.281 |
| presence layout: share of true 'present' readings that abstain | 0.267±0.226 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.800±0.163 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.616±0.138 |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence layout: share of FALSE 'present' readings that abstain | nan±nan |
| presence source: present read present | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.967±0.067 |
| presence target: share of 'present' readings that abstain | 1.000±0.000 |
| presence target: share of true 'present' readings that abstain | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.960±0.080 |
| presence target: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 0.400±0.133 |
| presence object: share of FALSE 'present' readings that abstain | 0.400±0.200 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.200±0.067 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.467±0.163 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.967±0.067 |
| presence anchor: share of 'present' readings that abstain | 0.793±0.083 |
| presence anchor: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.100±0.200 |
| presence axis: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.450±0.187 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.933±0.133 |
| presence amount: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| occupancy: unknown filler | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.050±0.100 |
| presence fraction: share of 'present' readings that abstain | 0.798±0.126 |
| presence fraction: share of FALSE 'present' readings that abstain | 0.960±0.080 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.200±0.400 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |

residual mean 0.662±0.028; status {'abstain': 63, 'no-sense': 32, 'ok': 1}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.656 | 0.178 / 0.080 | 0.93 | 0.302 | 0.031 / 0.042 |
| role object | 0.467 | 0.119 / 0.000 | 0.64 | 0.200 | 0.022 / 0.333 |
| roles (pooled) | 0.453 | 0.074 / 0.000 | 0.47 | 0.113 | 0.094 / 0.433 |
| role color | 0.667 | 0.027 / 0.014 | 0.33 | 0.000 | 0.333 / 0.333 |
| role region | 0.500 | 0.039 / 0.000 | 0.30 | 0.000 | 0.200 / 0.500 |
| role size | 0.500 | 0.022 / 0.000 | 0.12 | 0.000 | 0.375 / 0.500 |
| role relation | 0.727 | 0.065 / 0.000 | 0.64 | 0.000 | 0.091 / 0.273 |
| role landmark | 0.273 | 0.014 / 0.000 | 0.09 | 0.000 | 0.182 / 0.727 |
| role quantity | 0.000 | 0.024 / 0.005 | 0.00 | 0.000 | 0.000 / 1.000 |
| role amount | 0.600 | 0.027 / 0.012 | 0.20 | 0.200 | 0.600 / 0.200 |
| role unit | 0.600 | 0.082 / 0.000 | 0.60 | 0.000 | 0.000 / 0.400 |
| role text | 0.312 | 0.032 / 0.000 | 0.38 | 0.062 | 0.000 / 0.625 |
| role style | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role layout | 0.500 | 0.063 / 0.014 | 0.50 | 0.250 | 0.250 / 0.250 |
| role source | 0.000 | 0.007 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role target | 0.222 | 0.013 / 0.002 | 0.00 | 0.000 | 0.222 / 0.778 |
| role direction | 1.000 | 0.100 / 0.041 | 0.83 | 0.000 | 0.167 / 0.000 |
| role axis | 1.000 | 0.097 / 0.086 | 1.00 | 0.000 | 0.000 / 0.000 |
| role anchor | 0.800 | 0.067 / 0.036 | 0.80 | 0.200 | 0.200 / 0.000 |
| role pairing | 0.000 | 0.070 / 0.034 | 0.50 | 0.500 | 0.000 / 0.500 |
| role fraction | 1.000 | 0.078 / 0.078 | 1.00 | 0.000 | 0.000 / 0.000 |

### mixed — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.305±0.045 |
| FULL [depth given] | 0.305±0.045 |
| FULL [depth and negation given] | 0.306±0.045 |
| FULL [pooled midpoint (comparison)] | 0.248±0.008 |
| presence object: present read present | 0.827±0.081 |
| presence object: share of 'present' readings that abstain | 0.074±0.013 |
| presence object: share of true 'present' readings that abstain | 0.073±0.013 |
| presence color: absent read absent | 0.965±0.009 |
| presence size: absent read absent | 0.964±0.007 |
| presence style: absent read absent | 0.961±0.014 |
| presence text: absent read absent | 0.986±0.006 |
| presence relation: present read present | 0.909±0.076 |
| presence relation: share of 'present' readings that abstain | 0.134±0.068 |
| presence relation: share of true 'present' readings that abstain | 0.134±0.068 |
| presence landmark: present read present | 0.691±0.115 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 0.999±0.002 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.992±0.006 |
| presence target: absent read absent | 0.999±0.002 |
| presence quantity: absent read absent | 0.998±0.002 |
| structure (depth, negation) | 0.636±0.052 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.647±0.055 |
| event type (synonym table) | 0.652±0.053 |
| role object | 0.475±0.071 |
| head object | 0.531±0.080 |
| lexical order head object | 0.077±0.000 |
| lexical bag head object | 0.305±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.585±0.080 |
| occupancy: known filler | 0.580±0.044 |
| role color | 0.959±0.006 |
| head color | 0.959±0.006 |
| lexical order head color | 0.957±0.000 |
| lexical bag head color | 0.957±0.000 |
| occupancy: not given | 0.993±0.001 |
| role size | 0.967±0.005 |
| head size | 0.967±0.005 |
| lexical order head size | 0.965±0.000 |
| lexical bag head size | 0.965±0.000 |
| role style | 0.960±0.008 |
| head style | 0.960±0.008 |
| lexical order head style | 0.975±0.000 |
| lexical bag head style | 0.975±0.000 |
| role text | 0.937±0.010 |
| head text | 0.937±0.010 |
| lexical order head text | 0.877±0.000 |
| lexical bag head text | 0.877±0.000 |
| role relation | 0.953±0.010 |
| head relation | 0.953±0.010 |
| lexical order head relation | 0.868±0.000 |
| lexical bag head relation | 0.873±0.000 |
| role landmark | 0.900±0.007 |
| head landmark | 0.921±0.007 |
| lexical order head landmark | 0.868±0.000 |
| lexical bag head landmark | 0.865±0.000 |
| role region | 0.965±0.005 |
| head region | 0.965±0.005 |
| lexical order head region | 0.912±0.000 |
| lexical bag head region | 0.912±0.000 |
| role anchor | 0.962±0.005 |
| head anchor | 0.962±0.005 |
| lexical order head anchor | 0.905±0.000 |
| lexical bag head anchor | 0.910±0.000 |
| role fraction | 0.982±0.005 |
| head fraction | 0.982±0.005 |
| lexical order head fraction | 0.957±0.000 |
| lexical bag head fraction | 0.957±0.000 |
| role amount | 0.996±0.002 |
| head amount | 0.996±0.002 |
| lexical order head amount | 0.922±0.000 |
| lexical bag head amount | 0.922±0.000 |
| role unit | 0.997±0.003 |
| head unit | 0.997±0.003 |
| lexical order head unit | 0.922±0.000 |
| lexical bag head unit | 0.922±0.000 |
| role direction | 0.982±0.003 |
| head direction | 0.982±0.003 |
| lexical order head direction | 0.948±0.000 |
| lexical bag head direction | 0.950±0.000 |
| role axis | 0.979±0.003 |
| head axis | 0.979±0.003 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.963±0.000 |
| role layout | 0.972±0.006 |
| head layout | 0.972±0.006 |
| lexical order head layout | 0.932±0.000 |
| lexical bag head layout | 0.932±0.000 |
| role pairing | 0.983±0.005 |
| head pairing | 0.983±0.005 |
| lexical order head pairing | 0.960±0.000 |
| lexical bag head pairing | 0.960±0.000 |
| role source | 0.902±0.011 |
| head source | 0.909±0.015 |
| lexical order head source | 0.895±0.000 |
| lexical bag head source | 0.895±0.000 |
| role target | 0.957±0.003 |
| head target | 0.963±0.003 |
| lexical order head target | 0.935±0.000 |
| lexical bag head target | 0.935±0.000 |
| role quantity | 0.994±0.003 |
| head quantity | 0.994±0.003 |
| lexical order head quantity | 0.985±0.000 |
| lexical bag head quantity | 0.985±0.000 |
| heads FULL (model) | 0.368±0.045 |
| heads FULL (lexical order baseline) | 0.013±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.085±0.000 |
| role object [pooled midpoint (comparison)] | 0.415±0.014 |
| role color [pooled midpoint (comparison)] | 0.969±0.004 |
| role size [pooled midpoint (comparison)] | 0.971±0.006 |
| role style [pooled midpoint (comparison)] | 0.956±0.009 |
| role text [pooled midpoint (comparison)] | 0.931±0.005 |
| role relation [pooled midpoint (comparison)] | 0.921±0.005 |
| role landmark [pooled midpoint (comparison)] | 0.897±0.005 |
| role region [pooled midpoint (comparison)] | 0.949±0.003 |
| role anchor [pooled midpoint (comparison)] | 0.957±0.003 |
| role fraction [pooled midpoint (comparison)] | 0.980±0.004 |
| role amount [pooled midpoint (comparison)] | 0.992±0.001 |
| role unit [pooled midpoint (comparison)] | 0.994±0.002 |
| role direction [pooled midpoint (comparison)] | 0.981±0.002 |
| role axis [pooled midpoint (comparison)] | 0.977±0.002 |
| role layout [pooled midpoint (comparison)] | 0.968±0.005 |
| role pairing [pooled midpoint (comparison)] | 0.980±0.004 |
| role source [pooled midpoint (comparison)] | 0.904±0.006 |
| role target [pooled midpoint (comparison)] | 0.955±0.004 |
| role quantity [pooled midpoint (comparison)] | 0.992±0.004 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.320±0.015 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.980±0.005 |
| presence anchor: present read present | 0.945±0.048 |
| presence anchor: share of 'present' readings that abstain | 0.080±0.051 |
| presence anchor: share of true 'present' readings that abstain | 0.080±0.051 |
| presence object: present read present [pooled midpoint (comparison)] | 0.817±0.013 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.987±0.004 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.971±0.009 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.949±0.015 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.984±0.011 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.990±0.007 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.913±0.049 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.995±0.003 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.997±0.004 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.992±0.005 |
| presence layout: present read present | 0.813±0.068 |
| occupancy: unknown filler | 0.629±0.070 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.766±0.055 |
| presence amount: present read present | 0.974±0.013 |
| presence amount: share of 'present' readings that abstain | 0.140±0.048 |
| presence amount: share of true 'present' readings that abstain | 0.135±0.042 |
| presence unit: present read present | 0.980±0.016 |
| presence unit: share of 'present' readings that abstain | 0.020±0.016 |
| presence unit: share of true 'present' readings that abstain | 0.020±0.016 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.914±0.026 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.947±0.016 |
| presence source: present read present | 0.371±0.194 |
| presence source: share of 'present' readings that abstain | 0.779±0.104 |
| presence source: share of true 'present' readings that abstain | 0.769±0.120 |
| presence target: present read present | 0.713±0.081 |
| presence target: share of 'present' readings that abstain | 0.702±0.044 |
| presence target: share of true 'present' readings that abstain | 0.697±0.049 |
| presence source: present read present [pooled midpoint (comparison)] | 0.354±0.118 |
| presence target: present read present [pooled midpoint (comparison)] | 0.730±0.064 |
| presence landmark: share of 'present' readings that abstain | 0.415±0.038 |
| presence landmark: share of true 'present' readings that abstain | 0.317±0.036 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.706±0.057 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.683±0.072 |
| presence color: present read present | 0.914±0.012 |
| presence color: share of 'present' readings that abstain | 0.743±0.039 |
| presence color: share of true 'present' readings that abstain | 0.539±0.129 |
| presence text: present read present | 0.792±0.078 |
| presence text: share of 'present' readings that abstain | 0.289±0.086 |
| presence text: share of true 'present' readings that abstain | 0.305±0.091 |
| presence text: present read present [pooled midpoint (comparison)] | 0.840±0.082 |
| presence layout: share of 'present' readings that abstain | 0.148±0.064 |
| presence layout: share of true 'present' readings that abstain | 0.148±0.064 |
| presence region: present read present | 0.835±0.098 |
| presence region: share of 'present' readings that abstain | 0.283±0.050 |
| presence region: share of true 'present' readings that abstain | 0.283±0.050 |
| presence region: present read present [pooled midpoint (comparison)] | 0.661±0.076 |
| presence fraction: present read present | 0.950±0.100 |
| presence fraction: share of 'present' readings that abstain | 0.272±0.202 |
| presence fraction: share of true 'present' readings that abstain | 0.272±0.202 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.950±0.100 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.215±0.143 |
| presence axis: share of true 'present' readings that abstain | 0.215±0.143 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.971±0.057 |
| presence quantity: present read present | 0.780±0.227 |
| presence quantity: share of 'present' readings that abstain | 0.240±0.248 |
| presence quantity: share of true 'present' readings that abstain | 0.180±0.183 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.827±0.183 |
| presence direction: present read present | 0.865±0.097 |
| presence direction: share of 'present' readings that abstain | 0.105±0.062 |
| presence direction: share of true 'present' readings that abstain | 0.105±0.062 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.861±0.046 |
| presence color: share of FALSE 'present' readings that abstain | 0.982±0.036 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence object: absent read absent | 0.582±0.143 |
| presence pairing: present read present | 0.953±0.060 |
| presence pairing: share of 'present' readings that abstain | 0.245±0.160 |
| presence pairing: share of true 'present' readings that abstain | 0.245±0.160 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.600±0.089 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.982±0.036 |
| presence style: present read present | 0.660±0.228 |
| presence style: present read present [pooled midpoint (comparison)] | 0.787±0.161 |
| presence style: share of 'present' readings that abstain | 0.931±0.084 |
| presence style: share of FALSE 'present' readings that abstain | 0.943±0.079 |
| presence color: present read present [pooled midpoint (comparison)] | 0.878±0.116 |
| presence object: share of FALSE 'present' readings that abstain | 0.087±0.077 |
| presence text: share of FALSE 'present' readings that abstain | 0.117±0.145 |
| presence size: share of 'present' readings that abstain | 0.356±0.117 |
| presence size: share of FALSE 'present' readings that abstain | 0.631±0.150 |
| presence size: present read present | 0.922±0.039 |
| presence size: share of true 'present' readings that abstain | 0.115±0.133 |
| presence size: present read present [pooled midpoint (comparison)] | 0.903±0.058 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: share of true 'present' readings that abstain | 0.920±0.160 |

residual mean 0.683±0.029; status {'abstain': 254, 'no-sense': 128, 'ok': 18}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.680 | 0.190 / 0.112 | 0.95 | 0.300 | 0.025 / 0.020 |
| role object | 0.466 | 0.138 / 0.000 | 0.59 | 0.157 | 0.030 / 0.377 |
| roles (pooled) | 0.514 | 0.095 / 0.000 | 0.56 | 0.118 | 0.072 / 0.368 |
| role relation | 0.679 | 0.068 / 0.000 | 0.60 | 0.038 | 0.113 / 0.283 |
| role landmark | 0.302 | 0.037 / 0.000 | 0.36 | 0.151 | 0.094 / 0.547 |
| role region | 0.629 | 0.051 / 0.000 | 0.60 | 0.114 | 0.143 / 0.257 |
| role anchor | 0.553 | 0.081 / 0.000 | 0.68 | 0.184 | 0.053 / 0.263 |
| role layout | 0.519 | 0.095 / 0.000 | 0.63 | 0.185 | 0.074 / 0.296 |
| role amount | 0.968 | 0.077 / 0.033 | 0.81 | 0.000 | 0.161 / 0.032 |
| role unit | 0.968 | 0.149 / 0.078 | 0.94 | 0.000 | 0.032 / 0.032 |
| role source | 0.071 | 0.011 / 0.000 | 0.07 | 0.071 | 0.071 / 0.857 |
| role target | 0.308 | 0.026 / 0.000 | 0.15 | 0.000 | 0.154 / 0.692 |
| role color | 0.529 | 0.045 / 0.000 | 0.47 | 0.118 | 0.176 / 0.353 |
| role text | 0.612 | 0.075 / 0.000 | 0.61 | 0.082 | 0.082 / 0.306 |
| role fraction | 0.529 | 0.039 / 0.000 | 0.35 | 0.000 | 0.176 / 0.471 |
| role axis | 0.533 | 0.121 / 0.039 | 0.87 | 0.400 | 0.067 / 0.067 |
| role quantity | 0.833 | 0.057 / 0.019 | 0.67 | 0.000 | 0.167 / 0.167 |
| role direction | 0.571 | 0.063 / 0.000 | 0.48 | 0.000 | 0.095 / 0.429 |
| role pairing | 0.625 | 0.091 / 0.003 | 0.69 | 0.188 | 0.125 / 0.188 |
| role style | 0.200 | 0.011 / 0.000 | 0.00 | 0.000 | 0.200 / 0.800 |
| role size | 0.714 | 0.070 / 0.000 | 0.71 | 0.071 | 0.071 / 0.214 |

### mixed — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.049±0.015 |
| FULL [depth given] | 0.049±0.015 |
| FULL [depth and negation given] | 0.049±0.015 |
| FULL [pooled midpoint (comparison)] | 0.059±0.021 |
| presence object: present read present | 0.847±0.070 |
| presence object: share of 'present' readings that abstain | 0.111±0.018 |
| presence object: share of true 'present' readings that abstain | 0.107±0.019 |
| presence color: absent read absent | 0.944±0.007 |
| presence size: absent read absent | 0.856±0.036 |
| presence style: absent read absent | 0.712±0.104 |
| presence text: absent read absent | 0.849±0.035 |
| presence text: share of 'present' readings that abstain | 0.732±0.026 |
| presence text: share of FALSE 'present' readings that abstain | 0.985±0.018 |
| presence relation: present read present | 0.912±0.067 |
| presence relation: share of 'present' readings that abstain | 0.639±0.042 |
| presence relation: share of true 'present' readings that abstain | 0.315±0.027 |
| presence landmark: present read present | 0.786±0.097 |
| presence region: absent read absent | 0.868±0.032 |
| presence anchor: absent read absent | 0.932±0.027 |
| presence fraction: absent read absent | 0.959±0.012 |
| presence amount: absent read absent | 0.934±0.042 |
| presence unit: absent read absent | 0.929±0.038 |
| presence direction: absent read absent | 0.885±0.048 |
| presence axis: absent read absent | 0.934±0.040 |
| presence axis: share of 'present' readings that abstain | 0.704±0.196 |
| presence axis: share of FALSE 'present' readings that abstain | 0.871±0.105 |
| presence layout: absent read absent | 0.968±0.022 |
| presence pairing: absent read absent | 0.950±0.015 |
| presence source: absent read absent | 0.939±0.020 |
| presence target: absent read absent | 0.972±0.010 |
| presence quantity: absent read absent | 0.657±0.077 |
| presence quantity: share of 'present' readings that abstain | 0.975±0.014 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| structure (depth, negation) | 0.597±0.061 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.603±0.065 |
| event type (synonym table) | 0.607±0.063 |
| role object | 0.430±0.063 |
| head object | 0.499±0.072 |
| lexical order head object | 0.077±0.000 |
| lexical bag head object | 0.305±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.519±0.066 |
| occupancy: known filler | 0.571±0.058 |
| role color | 0.939±0.006 |
| head color | 0.939±0.006 |
| lexical order head color | 0.957±0.000 |
| lexical bag head color | 0.957±0.000 |
| occupancy: not given | 0.933±0.008 |
| role size | 0.902±0.027 |
| head size | 0.902±0.027 |
| lexical order head size | 0.965±0.000 |
| lexical bag head size | 0.965±0.000 |
| role style | 0.815±0.043 |
| head style | 0.815±0.043 |
| lexical order head style | 0.975±0.000 |
| lexical bag head style | 0.975±0.000 |
| role text | 0.856±0.012 |
| head text | 0.856±0.012 |
| lexical order head text | 0.877±0.000 |
| lexical bag head text | 0.877±0.000 |
| role relation | 0.874±0.013 |
| head relation | 0.874±0.013 |
| lexical order head relation | 0.868±0.000 |
| lexical bag head relation | 0.873±0.000 |
| role landmark | 0.850±0.019 |
| head landmark | 0.866±0.018 |
| lexical order head landmark | 0.868±0.000 |
| lexical bag head landmark | 0.865±0.000 |
| role region | 0.887±0.014 |
| head region | 0.887±0.014 |
| lexical order head region | 0.912±0.000 |
| lexical bag head region | 0.912±0.000 |
| role anchor | 0.918±0.015 |
| head anchor | 0.918±0.015 |
| lexical order head anchor | 0.905±0.000 |
| lexical bag head anchor | 0.910±0.000 |
| role fraction | 0.955±0.009 |
| head fraction | 0.955±0.009 |
| lexical order head fraction | 0.957±0.000 |
| lexical bag head fraction | 0.957±0.000 |
| role amount | 0.952±0.028 |
| head amount | 0.952±0.028 |
| lexical order head amount | 0.922±0.000 |
| lexical bag head amount | 0.922±0.000 |
| role unit | 0.957±0.023 |
| head unit | 0.957±0.023 |
| lexical order head unit | 0.922±0.000 |
| lexical bag head unit | 0.922±0.000 |
| role direction | 0.918±0.019 |
| head direction | 0.918±0.019 |
| lexical order head direction | 0.948±0.000 |
| lexical bag head direction | 0.950±0.000 |
| role axis | 0.940±0.023 |
| head axis | 0.940±0.023 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.963±0.000 |
| role layout | 0.949±0.012 |
| head layout | 0.949±0.012 |
| lexical order head layout | 0.932±0.000 |
| lexical bag head layout | 0.932±0.000 |
| role pairing | 0.948±0.006 |
| head pairing | 0.948±0.006 |
| lexical order head pairing | 0.960±0.000 |
| lexical bag head pairing | 0.960±0.000 |
| role source | 0.863±0.014 |
| head source | 0.864±0.013 |
| lexical order head source | 0.895±0.000 |
| lexical bag head source | 0.895±0.000 |
| role target | 0.933±0.004 |
| head target | 0.936±0.005 |
| lexical order head target | 0.935±0.000 |
| lexical bag head target | 0.935±0.000 |
| role quantity | 0.789±0.052 |
| head quantity | 0.789±0.052 |
| lexical order head quantity | 0.985±0.000 |
| lexical bag head quantity | 0.985±0.000 |
| heads FULL (model) | 0.067±0.017 |
| heads FULL (lexical order baseline) | 0.013±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.085±0.000 |
| role object [pooled midpoint (comparison)] | 0.382±0.013 |
| role color [pooled midpoint (comparison)] | 0.957±0.005 |
| role size [pooled midpoint (comparison)] | 0.924±0.012 |
| role style [pooled midpoint (comparison)] | 0.773±0.060 |
| role text [pooled midpoint (comparison)] | 0.861±0.007 |
| role relation [pooled midpoint (comparison)] | 0.901±0.010 |
| role landmark [pooled midpoint (comparison)] | 0.872±0.002 |
| role region [pooled midpoint (comparison)] | 0.912±0.006 |
| role anchor [pooled midpoint (comparison)] | 0.939±0.007 |
| role fraction [pooled midpoint (comparison)] | 0.957±0.007 |
| role amount [pooled midpoint (comparison)] | 0.975±0.010 |
| role unit [pooled midpoint (comparison)] | 0.980±0.008 |
| role direction [pooled midpoint (comparison)] | 0.940±0.009 |
| role axis [pooled midpoint (comparison)] | 0.942±0.011 |
| role layout [pooled midpoint (comparison)] | 0.955±0.007 |
| role pairing [pooled midpoint (comparison)] | 0.947±0.007 |
| role source [pooled midpoint (comparison)] | 0.875±0.008 |
| role target [pooled midpoint (comparison)] | 0.934±0.002 |
| role quantity [pooled midpoint (comparison)] | 0.832±0.051 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.080±0.020 |
| presence size: share of 'present' readings that abstain | 0.829±0.056 |
| presence size: share of FALSE 'present' readings that abstain | 0.941±0.043 |
| presence relation: absent read absent | 0.853±0.026 |
| presence landmark: absent read absent | 0.898±0.036 |
| presence anchor: present read present | 0.942±0.051 |
| presence anchor: share of 'present' readings that abstain | 0.538±0.076 |
| presence anchor: share of true 'present' readings that abstain | 0.227±0.062 |
| presence amount: share of 'present' readings that abstain | 0.755±0.054 |
| presence amount: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence object: present read present [pooled midpoint (comparison)] | 0.839±0.016 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.979±0.007 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.882±0.023 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.618±0.110 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.852±0.024 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.962±0.012 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.954±0.013 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.936±0.013 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.922±0.040 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.963±0.013 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.978±0.013 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.971±0.012 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.921±0.016 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 0.935±0.022 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.982±0.008 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.948±0.015 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.957±0.019 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.972±0.006 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.698±0.091 |
| presence layout: present read present | 0.805±0.068 |
| occupancy: unknown filler | 0.514±0.114 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.974±0.014 |
| presence layout: present read present [pooled midpoint (comparison)] | 0.755±0.060 |
| presence landmark: share of 'present' readings that abstain | 0.814±0.045 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence amount: present read present | 0.987±0.016 |
| presence amount: share of true 'present' readings that abstain | 0.652±0.025 |
| presence unit: present read present | 0.980±0.017 |
| presence unit: share of 'present' readings that abstain | 0.333±0.079 |
| presence unit: share of true 'present' readings that abstain | 0.060±0.039 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.947±0.016 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.947±0.016 |
| presence style: share of 'present' readings that abstain | 0.990±0.013 |
| presence style: share of FALSE 'present' readings that abstain | 0.991±0.012 |
| presence source: present read present | 0.769±0.086 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.859±0.051 |
| presence target: share of 'present' readings that abstain | 0.991±0.018 |
| presence target: share of true 'present' readings that abstain | 0.988±0.024 |
| presence source: present read present [pooled midpoint (comparison)] | 0.718±0.085 |
| presence target: present read present [pooled midpoint (comparison)] | 0.849±0.026 |
| presence anchor: share of FALSE 'present' readings that abstain | 0.990±0.020 |
| presence region: share of 'present' readings that abstain | 0.897±0.036 |
| presence region: share of FALSE 'present' readings that abstain | 0.988±0.024 |
| presence landmark: share of true 'present' readings that abstain | 0.687±0.057 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.705±0.054 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.769±0.063 |
| presence color: present read present | 0.933±0.058 |
| presence color: share of 'present' readings that abstain | 0.958±0.042 |
| presence color: share of true 'present' readings that abstain | 0.895±0.101 |
| presence text: present read present | 0.812±0.057 |
| presence text: share of true 'present' readings that abstain | 0.437±0.057 |
| presence text: present read present [pooled midpoint (comparison)] | 0.842±0.078 |
| presence layout: share of 'present' readings that abstain | 0.483±0.111 |
| presence layout: share of true 'present' readings that abstain | 0.266±0.071 |
| presence region: present read present | 0.832±0.102 |
| presence region: share of true 'present' readings that abstain | 0.770±0.069 |
| presence direction: share of 'present' readings that abstain | 0.699±0.089 |
| presence direction: share of FALSE 'present' readings that abstain | 0.993±0.014 |
| presence region: present read present [pooled midpoint (comparison)] | 0.654±0.080 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence fraction: present read present | 0.950±0.100 |
| presence fraction: share of 'present' readings that abstain | 0.673±0.058 |
| presence fraction: share of true 'present' readings that abstain | 0.335±0.170 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 0.950±0.100 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.408±0.238 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.971±0.057 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence quantity: present read present | 0.780±0.227 |
| presence quantity: share of true 'present' readings that abstain | 0.480±0.211 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.867±0.194 |
| presence direction: present read present | 0.875±0.086 |
| presence direction: share of true 'present' readings that abstain | 0.217±0.058 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.861±0.046 |
| presence object: absent read absent | 0.429±0.163 |
| presence pairing: present read present | 0.943±0.070 |
| presence pairing: share of 'present' readings that abstain | 0.739±0.096 |
| presence pairing: share of true 'present' readings that abstain | 0.414±0.146 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.493±0.066 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.971±0.057 |
| presence style: present read present | 0.637±0.227 |
| presence style: present read present [pooled midpoint (comparison)] | 0.753±0.165 |
| presence fraction: share of FALSE 'present' readings that abstain | 0.967±0.067 |
| presence unit: share of FALSE 'present' readings that abstain | 0.910±0.054 |
| presence object: share of FALSE 'present' readings that abstain | 0.183±0.095 |
| presence color: present read present [pooled midpoint (comparison)] | 0.885±0.102 |
| presence size: present read present | 0.922±0.039 |
| presence size: share of true 'present' readings that abstain | 0.454±0.071 |
| presence size: present read present [pooled midpoint (comparison)] | 0.903±0.058 |
| presence pairing: share of FALSE 'present' readings that abstain | 0.950±0.100 |
| presence layout: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.960±0.080 |

residual mean 0.710±0.032; status {'abstain': 249, 'no-sense': 143, 'ok': 8}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.642 | 0.190 / 0.112 | 0.95 | 0.335 | 0.022 / 0.022 |
| role object | 0.428 | 0.111 / 0.000 | 0.57 | 0.165 | 0.019 / 0.407 |
| roles (pooled) | 0.467 | 0.073 / 0.000 | 0.46 | 0.113 | 0.121 / 0.421 |
| role relation | 0.642 | 0.050 / 0.000 | 0.51 | 0.057 | 0.189 / 0.302 |
| role landmark | 0.189 | 0.018 / 0.000 | 0.17 | 0.075 | 0.094 / 0.736 |
| role region | 0.571 | 0.025 / 0.000 | 0.20 | 0.057 | 0.429 / 0.371 |
| role anchor | 0.526 | 0.063 / 0.000 | 0.61 | 0.211 | 0.132 / 0.263 |
| role layout | 0.481 | 0.057 / 0.000 | 0.52 | 0.111 | 0.074 / 0.407 |
| role amount | 0.903 | 0.039 / 0.014 | 0.32 | 0.000 | 0.581 / 0.097 |
| role unit | 0.935 | 0.139 / 0.017 | 0.87 | 0.032 | 0.097 / 0.032 |
| role source | 0.000 | 0.006 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role target | 0.346 | 0.012 / 0.000 | 0.00 | 0.000 | 0.346 / 0.654 |
| role color | 0.471 | 0.020 / 0.000 | 0.06 | 0.000 | 0.412 / 0.529 |
| role text | 0.551 | 0.044 / 0.000 | 0.47 | 0.061 | 0.143 / 0.388 |
| role fraction | 0.529 | 0.033 / 0.000 | 0.29 | 0.000 | 0.235 / 0.471 |
| role axis | 0.533 | 0.095 / 0.039 | 0.87 | 0.400 | 0.067 / 0.067 |
| role quantity | 0.833 | 0.028 / 0.005 | 0.17 | 0.000 | 0.667 / 0.167 |
| role direction | 0.571 | 0.055 / 0.000 | 0.48 | 0.000 | 0.095 / 0.429 |
| role pairing | 0.375 | 0.082 / 0.003 | 0.69 | 0.375 | 0.062 / 0.250 |
| role style | 0.100 | 0.005 / 0.000 | 0.00 | 0.000 | 0.100 / 0.900 |
| role size | 0.643 | 0.042 / 0.000 | 0.43 | 0.071 | 0.286 / 0.286 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.345±0.055 |
| FULL [depth given] | 0.345±0.055 |
| FULL [depth and negation given] | 0.345±0.055 |
| FULL [pooled midpoint (comparison)] | 0.295±0.015 |
| structure (depth, negation) | 0.709±0.041 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.713±0.041 |
| event type (synonym table) | 0.714±0.041 |
| role object | 0.495±0.080 |
| head object | 0.554±0.084 |
| lexical order head object | 0.025±0.000 |
| lexical bag head object | 0.305±0.000 |
| occupancy: unknown filler | 0.589±0.040 |
| role color | 0.972±0.010 |
| head color | 0.972±0.010 |
| lexical order head color | 0.980±0.000 |
| lexical bag head color | 0.980±0.000 |
| occupancy: not given | 0.991±0.001 |
| role size | 0.953±0.013 |
| head size | 0.953±0.013 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.940±0.000 |
| role style | 0.980±0.012 |
| head style | 0.980±0.012 |
| lexical order head style | 0.998±0.000 |
| lexical bag head style | 0.998±0.000 |
| role text | 0.751±0.032 |
| head text | 0.751±0.032 |
| lexical order head text | 0.542±0.000 |
| lexical bag head text | 0.583±0.000 |
| role relation | 0.952±0.008 |
| head relation | 0.952±0.008 |
| lexical order head relation | 0.815±0.000 |
| lexical bag head relation | 0.815±0.000 |
| role landmark | 0.884±0.004 |
| head landmark | 0.899±0.005 |
| lexical order head landmark | 0.815±0.000 |
| lexical bag head landmark | 0.815±0.000 |
| role region | 0.979±0.003 |
| head region | 0.979±0.003 |
| lexical order head region | 0.943±0.000 |
| lexical bag head region | 0.945±0.000 |
| role anchor | 0.980±0.003 |
| head anchor | 0.980±0.003 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 0.953±0.000 |
| role fraction | 0.994±0.002 |
| head fraction | 0.994±0.002 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 0.980±0.000 |
| role amount | 0.987±0.004 |
| head amount | 0.987±0.004 |
| lexical order head amount | 0.777±0.000 |
| lexical bag head amount | 0.785±0.000 |
| role unit | 0.988±0.003 |
| head unit | 0.988±0.003 |
| lexical order head unit | 0.777±0.000 |
| lexical bag head unit | 0.785±0.000 |
| role direction | 0.990±0.004 |
| head direction | 0.990±0.004 |
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
| role source | 0.940±0.002 |
| head source | 0.940±0.002 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.930±0.000 |
| role target | 0.943±0.006 |
| head target | 0.945±0.007 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.930±0.000 |
| role quantity | 0.993±0.001 |
| head quantity | 0.993±0.001 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.393±0.054 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.100±0.000 |
| role object [pooled midpoint (comparison)] | 0.443±0.018 |
| role color [pooled midpoint (comparison)] | 0.986±0.003 |
| role size [pooled midpoint (comparison)] | 0.954±0.011 |
| role style [pooled midpoint (comparison)] | 0.973±0.006 |
| role text [pooled midpoint (comparison)] | 0.738±0.019 |
| role relation [pooled midpoint (comparison)] | 0.911±0.009 |
| role landmark [pooled midpoint (comparison)] | 0.870±0.010 |
| role region [pooled midpoint (comparison)] | 0.970±0.007 |
| role anchor [pooled midpoint (comparison)] | 0.978±0.003 |
| role fraction [pooled midpoint (comparison)] | 0.993±0.002 |
| role amount [pooled midpoint (comparison)] | 0.976±0.003 |
| role unit [pooled midpoint (comparison)] | 0.980±0.006 |
| role direction [pooled midpoint (comparison)] | 0.991±0.002 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.943±0.004 |
| role target [pooled midpoint (comparison)] | 0.941±0.006 |
| role quantity [pooled midpoint (comparison)] | 0.991±0.003 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.362±0.017 |
| presence object: present read present | 0.815±0.091 |
| presence object: share of 'present' readings that abstain | 0.062±0.023 |
| presence object: share of true 'present' readings that abstain | 0.061±0.025 |
| presence color: absent read absent | 0.974±0.014 |
| presence size: absent read absent | 0.959±0.017 |
| presence style: absent read absent | 0.971±0.019 |
| presence text: absent read absent | 0.925±0.019 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.981±0.009 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: present read present | 0.983±0.033 |
| presence anchor: share of 'present' readings that abstain | 0.070±0.064 |
| presence anchor: share of true 'present' readings that abstain | 0.070±0.064 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.173±0.150 |
| presence fraction: share of true 'present' readings that abstain | 0.173±0.150 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.986±0.006 |
| presence target: absent read absent | 0.995±0.005 |
| presence quantity: absent read absent | 0.990±0.001 |
| occupancy: known filler | 0.685±0.051 |
| presence object: present read present [pooled midpoint (comparison)] | 0.832±0.015 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.994±0.004 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.968±0.013 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.960±0.009 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.925±0.012 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.994±0.002 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.941±0.048 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.996±0.004 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.993±0.003 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.987±0.003 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.963±0.008 |
| presence amount: share of 'present' readings that abstain | 0.297±0.048 |
| presence amount: share of true 'present' readings that abstain | 0.297±0.048 |
| presence unit: present read present | 0.970±0.017 |
| presence unit: share of 'present' readings that abstain | 0.038±0.025 |
| presence unit: share of true 'present' readings that abstain | 0.038±0.025 |
| presence direction: present read present | 0.922±0.068 |
| presence direction: share of 'present' readings that abstain | 0.063±0.037 |
| presence direction: share of true 'present' readings that abstain | 0.063±0.037 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.936±0.012 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.953±0.024 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.951±0.032 |
| presence region: present read present | 0.825±0.080 |
| presence region: share of 'present' readings that abstain | 0.278±0.113 |
| presence region: share of true 'present' readings that abstain | 0.278±0.113 |
| presence region: present read present [pooled midpoint (comparison)] | 0.700±0.126 |
| determiner identity (outside FULL when the legend excludes it) | 0.683±0.114 |
| presence text: present read present | 0.838±0.070 |
| presence text: share of 'present' readings that abstain | 0.326±0.076 |
| presence text: share of true 'present' readings that abstain | 0.304±0.076 |
| presence relation: present read present | 0.915±0.026 |
| presence relation: share of 'present' readings that abstain | 0.092±0.024 |
| presence relation: share of true 'present' readings that abstain | 0.092±0.024 |
| presence landmark: present read present | 0.656±0.061 |
| presence text: present read present [pooled midpoint (comparison)] | 0.867±0.027 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.704±0.076 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.538±0.079 |
| presence object: absent read absent | 0.366±0.070 |
| presence object: share of FALSE 'present' readings that abstain | 0.107±0.137 |
| presence text: share of FALSE 'present' readings that abstain | 0.497±0.118 |
| presence source: present read present | 0.498±0.084 |
| presence target: present read present | 0.536±0.047 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.316±0.074 |
| presence source: present read present [pooled midpoint (comparison)] | 0.495±0.067 |
| presence target: present read present [pooled midpoint (comparison)] | 0.611±0.097 |
| presence style: share of 'present' readings that abstain | 0.967±0.067 |
| presence style: share of FALSE 'present' readings that abstain | 0.964±0.073 |
| presence size: share of 'present' readings that abstain | 0.389±0.127 |
| presence size: share of FALSE 'present' readings that abstain | 0.714±0.178 |
| presence landmark: share of 'present' readings that abstain | 0.464±0.049 |
| presence landmark: share of true 'present' readings that abstain | 0.413±0.059 |
| presence size: present read present | 0.928±0.021 |
| presence size: share of true 'present' readings that abstain | 0.214±0.068 |
| presence size: present read present [pooled midpoint (comparison)] | 0.898±0.066 |
| presence target: share of 'present' readings that abstain | 0.900±0.080 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: present read present | 0.619±0.060 |
| presence color: share of 'present' readings that abstain | 0.810±0.078 |
| presence color: share of true 'present' readings that abstain | 0.510±0.174 |
| presence color: present read present [pooled midpoint (comparison)] | 0.586±0.070 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 1.000±0.000 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: share of true 'present' readings that abstain | 0.904±0.096 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.908±0.062 |
| presence source: share of true 'present' readings that abstain | 0.896±0.060 |
| presence source: share of FALSE 'present' readings that abstain | 0.950±0.100 |
| presence landmark: share of FALSE 'present' readings that abstain | 0.900±0.200 |
| presence quantity: share of 'present' readings that abstain | 0.767±0.200 |
| presence quantity: share of FALSE 'present' readings that abstain | 0.767±0.200 |

residual mean 0.650±0.025; status {'no-sense': 103, 'abstain': 290, 'ok': 7}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.740 | 0.182 / 0.112 | 0.98 | 0.242 | 0.005 / 0.018 |
| role object | 0.562 | 0.123 / 0.000 | 0.66 | 0.128 | 0.031 / 0.310 |
| roles (pooled) | 0.616 | 0.087 / 0.000 | 0.58 | 0.069 | 0.109 / 0.314 |
| role anchor | 0.579 | 0.094 / 0.000 | 0.68 | 0.105 | 0.000 / 0.316 |
| role fraction | 0.750 | 0.038 / 0.006 | 0.50 | 0.000 | 0.250 / 0.250 |
| role amount | 0.933 | 0.057 / 0.028 | 0.62 | 0.011 | 0.326 / 0.056 |
| role unit | 0.933 | 0.148 / 0.040 | 0.88 | 0.000 | 0.056 / 0.067 |
| role direction | 0.696 | 0.081 / 0.000 | 0.70 | 0.043 | 0.043 / 0.261 |
| role region | 0.565 | 0.034 / 0.000 | 0.35 | 0.000 | 0.217 / 0.435 |
| role text | 0.563 | 0.057 / 0.000 | 0.48 | 0.055 | 0.137 / 0.383 |
| role relation | 0.730 | 0.086 / 0.000 | 0.72 | 0.041 | 0.054 / 0.230 |
| role landmark | 0.392 | 0.030 / 0.000 | 0.27 | 0.081 | 0.203 / 0.527 |
| role source | 0.345 | 0.017 / 0.000 | 0.07 | 0.000 | 0.276 / 0.655 |
| role target | 0.207 | 0.013 / 0.000 | 0.00 | 0.000 | 0.207 / 0.793 |
| role size | 0.704 | 0.061 / 0.000 | 0.67 | 0.037 | 0.074 / 0.259 |
| role color | 0.500 | 0.029 / 0.000 | 0.38 | 0.000 | 0.125 / 0.500 |
| role style | 1.000 | 0.006 / 0.006 | 0.00 | 0.000 | 1.000 / 0.000 |

### new_identities — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.030±0.015 |
| FULL [depth given] | 0.030±0.015 |
| FULL [depth and negation given] | 0.030±0.015 |
| FULL [pooled midpoint (comparison)] | 0.051±0.018 |
| structure (depth, negation) | 0.672±0.043 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.676±0.043 |
| event type (synonym table) | 0.677±0.043 |
| role object | 0.383±0.072 |
| head object | 0.520±0.081 |
| lexical order head object | 0.025±0.000 |
| lexical bag head object | 0.305±0.000 |
| occupancy: unknown filler | 0.597±0.046 |
| role color | 0.956±0.017 |
| head color | 0.956±0.017 |
| lexical order head color | 0.980±0.000 |
| lexical bag head color | 0.980±0.000 |
| occupancy: not given | 0.923±0.007 |
| role size | 0.862±0.041 |
| head size | 0.862±0.041 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.940±0.000 |
| role style | 0.814±0.087 |
| head style | 0.814±0.087 |
| lexical order head style | 0.998±0.000 |
| lexical bag head style | 0.998±0.000 |
| role text | 0.674±0.036 |
| head text | 0.674±0.036 |
| lexical order head text | 0.542±0.000 |
| lexical bag head text | 0.583±0.000 |
| role relation | 0.830±0.021 |
| head relation | 0.830±0.021 |
| lexical order head relation | 0.815±0.000 |
| lexical bag head relation | 0.815±0.000 |
| role landmark | 0.809±0.021 |
| head landmark | 0.822±0.022 |
| lexical order head landmark | 0.815±0.000 |
| lexical bag head landmark | 0.815±0.000 |
| role region | 0.900±0.022 |
| head region | 0.900±0.022 |
| lexical order head region | 0.943±0.000 |
| lexical bag head region | 0.945±0.000 |
| role anchor | 0.932±0.024 |
| head anchor | 0.932±0.024 |
| lexical order head anchor | 0.953±0.000 |
| lexical bag head anchor | 0.953±0.000 |
| role fraction | 0.969±0.011 |
| head fraction | 0.969±0.011 |
| lexical order head fraction | 0.980±0.000 |
| lexical bag head fraction | 0.980±0.000 |
| role amount | 0.955±0.015 |
| head amount | 0.955±0.015 |
| lexical order head amount | 0.777±0.000 |
| lexical bag head amount | 0.785±0.000 |
| role unit | 0.957±0.025 |
| head unit | 0.957±0.025 |
| lexical order head unit | 0.777±0.000 |
| lexical bag head unit | 0.785±0.000 |
| role direction | 0.871±0.034 |
| head direction | 0.871±0.034 |
| lexical order head direction | 0.943±0.000 |
| lexical bag head direction | 0.943±0.000 |
| role axis | 0.970±0.026 |
| head axis | 0.970±0.026 |
| lexical order head axis | 1.000±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 0.966±0.013 |
| head layout | 0.966±0.013 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.964±0.016 |
| head pairing | 0.964±0.016 |
| lexical order head pairing | 1.000±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.884±0.015 |
| head source | 0.884±0.015 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.930±0.000 |
| role target | 0.904±0.010 |
| head target | 0.904±0.010 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.930±0.000 |
| role quantity | 0.823±0.055 |
| head quantity | 0.823±0.055 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.048±0.026 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.100±0.000 |
| role object [pooled midpoint (comparison)] | 0.362±0.026 |
| role color [pooled midpoint (comparison)] | 0.979±0.007 |
| role size [pooled midpoint (comparison)] | 0.894±0.029 |
| role style [pooled midpoint (comparison)] | 0.745±0.087 |
| role text [pooled midpoint (comparison)] | 0.663±0.029 |
| role relation [pooled midpoint (comparison)] | 0.884±0.011 |
| role landmark [pooled midpoint (comparison)] | 0.823±0.008 |
| role region [pooled midpoint (comparison)] | 0.948±0.006 |
| role anchor [pooled midpoint (comparison)] | 0.957±0.018 |
| role fraction [pooled midpoint (comparison)] | 0.973±0.011 |
| role amount [pooled midpoint (comparison)] | 0.968±0.004 |
| role unit [pooled midpoint (comparison)] | 0.971±0.007 |
| role direction [pooled midpoint (comparison)] | 0.905±0.022 |
| role axis [pooled midpoint (comparison)] | 0.975±0.018 |
| role layout [pooled midpoint (comparison)] | 0.977±0.004 |
| role pairing [pooled midpoint (comparison)] | 0.965±0.015 |
| role source [pooled midpoint (comparison)] | 0.904±0.003 |
| role target [pooled midpoint (comparison)] | 0.907±0.009 |
| role quantity [pooled midpoint (comparison)] | 0.857±0.051 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.073±0.020 |
| presence object: present read present | 0.837±0.087 |
| presence object: share of 'present' readings that abstain | 0.124±0.034 |
| presence object: share of true 'present' readings that abstain | 0.123±0.034 |
| presence color: absent read absent | 0.955±0.024 |
| presence size: absent read absent | 0.817±0.057 |
| presence size: share of 'present' readings that abstain | 0.849±0.107 |
| presence size: share of FALSE 'present' readings that abstain | 0.992±0.015 |
| presence style: absent read absent | 0.720±0.144 |
| presence style: share of 'present' readings that abstain | 0.994±0.011 |
| presence style: share of FALSE 'present' readings that abstain | 0.994±0.011 |
| presence text: absent read absent | 0.829±0.028 |
| presence relation: absent read absent | 0.780±0.037 |
| presence landmark: absent read absent | 0.883±0.035 |
| presence region: absent read absent | 0.890±0.027 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.617±0.152 |
| presence anchor: share of true 'present' readings that abstain | 0.093±0.100 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.782±0.059 |
| presence fraction: share of true 'present' readings that abstain | 0.450±0.118 |
| presence amount: absent read absent | 0.939±0.034 |
| presence unit: absent read absent | 0.938±0.055 |
| presence direction: absent read absent | 0.815±0.062 |
| presence axis: absent read absent | 0.955±0.037 |
| presence layout: absent read absent | 0.949±0.021 |
| presence pairing: absent read absent | 0.947±0.022 |
| presence source: absent read absent | 0.924±0.023 |
| presence target: absent read absent | 0.961±0.017 |
| presence quantity: absent read absent | 0.739±0.078 |
| determiner identity (outside FULL when the legend excludes it) | 0.522±0.078 |
| occupancy: known filler | 0.689±0.051 |
| presence object: present read present [pooled midpoint (comparison)] | 0.852±0.022 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.988±0.010 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.866±0.054 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.598±0.138 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.827±0.024 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.951±0.011 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.938±0.019 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.974±0.013 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.960±0.050 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.989±0.004 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.982±0.014 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.859±0.035 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 0.960±0.028 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.964±0.006 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.945±0.024 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.956±0.004 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.960±0.016 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.774±0.079 |
| presence relation: share of 'present' readings that abstain | 0.578±0.042 |
| presence relation: share of FALSE 'present' readings that abstain | 0.996±0.009 |
| presence landmark: share of 'present' readings that abstain | 0.923±0.028 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence anchor: absent read absent | 0.931±0.035 |
| presence anchor: share of FALSE 'present' readings that abstain | 0.993±0.013 |
| presence fraction: absent read absent | 0.964±0.015 |
| presence amount: present read present | 0.989±0.012 |
| presence amount: share of 'present' readings that abstain | 0.595±0.046 |
| presence amount: share of true 'present' readings that abstain | 0.543±0.033 |
| presence unit: present read present | 0.975±0.015 |
| presence unit: share of 'present' readings that abstain | 0.164±0.087 |
| presence unit: share of true 'present' readings that abstain | 0.076±0.034 |
| presence direction: present read present | 0.922±0.068 |
| presence direction: share of 'present' readings that abstain | 0.816±0.086 |
| presence direction: share of true 'present' readings that abstain | 0.416±0.185 |
| presence axis: share of 'present' readings that abstain | nan±nan |
| presence axis: share of FALSE 'present' readings that abstain | nan±nan |
| presence quantity: share of 'present' readings that abstain | 0.990±0.016 |
| presence quantity: share of FALSE 'present' readings that abstain | 0.990±0.016 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.966±0.029 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.970±0.019 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.957±0.006 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.955±0.021 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.951±0.032 |
| presence text: share of 'present' readings that abstain | 0.553±0.078 |
| presence text: share of FALSE 'present' readings that abstain | 0.906±0.051 |
| presence region: present read present | 0.834±0.062 |
| presence region: share of 'present' readings that abstain | 0.917±0.045 |
| presence region: share of true 'present' readings that abstain | 0.788±0.111 |
| presence region: present read present [pooled midpoint (comparison)] | 0.734±0.110 |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: present read present | 0.835±0.078 |
| presence text: share of true 'present' readings that abstain | 0.443±0.085 |
| presence relation: present read present | 0.918±0.032 |
| presence relation: share of true 'present' readings that abstain | 0.219±0.072 |
| presence landmark: present read present | 0.817±0.045 |
| presence landmark: share of true 'present' readings that abstain | 0.884±0.039 |
| presence region: share of FALSE 'present' readings that abstain | 0.990±0.021 |
| presence text: present read present [pooled midpoint (comparison)] | 0.861±0.032 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.721±0.086 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.669±0.070 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence object: absent read absent | 0.243±0.074 |
| presence object: share of FALSE 'present' readings that abstain | 0.147±0.129 |
| presence source: present read present | 0.931±0.065 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.835±0.062 |
| presence target: share of 'present' readings that abstain | 1.000±0.000 |
| presence target: share of true 'present' readings that abstain | 1.000±0.000 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.173±0.013 |
| presence source: present read present [pooled midpoint (comparison)] | 0.889±0.078 |
| presence target: present read present [pooled midpoint (comparison)] | 0.856±0.014 |
| presence layout: share of 'present' readings that abstain | 1.000±0.000 |
| presence layout: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence size: present read present | 0.927±0.020 |
| presence size: share of true 'present' readings that abstain | 0.600±0.148 |
| presence size: present read present [pooled midpoint (comparison)] | 0.896±0.067 |
| presence amount: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.940±0.080 |
| presence pairing: share of FALSE 'present' readings that abstain | 0.940±0.080 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 1.000±0.000 |
| presence style: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: share of FALSE 'present' readings that abstain | 0.857±0.244 |
| presence fraction: share of FALSE 'present' readings that abstain | 0.983±0.033 |
| presence color: present read present | 0.562±0.061 |
| presence color: share of true 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present [pooled midpoint (comparison)] | 0.501±0.093 |

residual mean 0.677±0.025; status {'no-sense': 119, 'abstain': 279, 'ok': 2}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.703 | 0.182 / 0.112 | 0.98 | 0.278 | 0.003 / 0.020 |
| role object | 0.444 | 0.101 / 0.000 | 0.63 | 0.205 | 0.023 / 0.351 |
| roles (pooled) | 0.531 | 0.069 / 0.000 | 0.49 | 0.094 | 0.133 / 0.375 |
| role anchor | 0.579 | 0.076 / 0.000 | 0.68 | 0.105 | 0.000 / 0.316 |
| role fraction | 0.750 | 0.031 / 0.001 | 0.38 | 0.000 | 0.375 / 0.250 |
| role amount | 0.933 | 0.049 / 0.019 | 0.44 | 0.000 | 0.494 / 0.067 |
| role unit | 0.933 | 0.141 / 0.018 | 0.81 | 0.000 | 0.124 / 0.067 |
| role direction | 0.696 | 0.054 / 0.000 | 0.57 | 0.043 | 0.174 / 0.261 |
| role region | 0.348 | 0.014 / 0.000 | 0.09 | 0.000 | 0.261 / 0.652 |
| role text | 0.492 | 0.038 / 0.000 | 0.39 | 0.055 | 0.158 / 0.454 |
| role relation | 0.716 | 0.063 / 0.000 | 0.69 | 0.041 | 0.068 / 0.243 |
| role landmark | 0.257 | 0.016 / 0.000 | 0.09 | 0.041 | 0.203 / 0.703 |
| role source | 0.034 | 0.005 / 0.000 | 0.00 | 0.000 | 0.034 / 0.966 |
| role target | 0.034 | 0.006 / 0.000 | 0.00 | 0.000 | 0.034 / 0.966 |
| role size | 0.704 | 0.036 / 0.000 | 0.33 | 0.037 | 0.407 / 0.259 |
| role color | 0.250 | 0.006 / 0.000 | 0.00 | 0.000 | 0.250 / 0.750 |
| role style | 1.000 | 0.006 / 0.006 | 0.00 | 0.000 | 1.000 / 0.000 |

### new_identities_en — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.328±0.062 |
| FULL [depth given] | 0.328±0.062 |
| FULL [depth and negation given] | 0.329±0.063 |
| FULL [pooled midpoint (comparison)] | 0.292±0.027 |
| presence object: present read present | 0.769±0.098 |
| presence object: share of 'present' readings that abstain | 0.106±0.016 |
| presence object: share of true 'present' readings that abstain | 0.108±0.015 |
| presence color: absent read absent | 0.984±0.013 |
| presence size: present read present | 0.913±0.076 |
| presence size: share of 'present' readings that abstain | 0.348±0.060 |
| presence size: share of true 'present' readings that abstain | 0.235±0.077 |
| presence style: absent read absent | 0.968±0.023 |
| presence text: absent read absent | 0.902±0.036 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.967±0.028 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.882±0.071 |
| presence amount: share of 'present' readings that abstain | 0.310±0.085 |
| presence amount: share of true 'present' readings that abstain | 0.310±0.085 |
| presence unit: present read present | 0.883±0.053 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 0.999±0.003 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.979±0.013 |
| presence target: absent read absent | 0.996±0.004 |
| presence quantity: absent read absent | 0.980±0.013 |
| structure (depth, negation) | 0.725±0.030 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.733±0.033 |
| event type (synonym table) | 0.734±0.032 |
| role object | 0.478±0.080 |
| head object | 0.519±0.083 |
| lexical order head object | 0.033±0.000 |
| lexical bag head object | 0.840±0.000 |
| occupancy: known filler | 0.756±0.057 |
| role color | 0.981±0.011 |
| head color | 0.981±0.011 |
| lexical order head color | 0.985±0.000 |
| lexical bag head color | 0.988±0.000 |
| occupancy: not given | 0.990±0.003 |
| role size | 0.970±0.008 |
| head size | 0.970±0.008 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.945±0.000 |
| role style | 0.970±0.015 |
| head style | 0.970±0.015 |
| lexical order head style | 0.988±0.000 |
| lexical bag head style | 0.988±0.000 |
| role text | 0.771±0.033 |
| head text | 0.771±0.033 |
| lexical order head text | 0.535±0.000 |
| lexical bag head text | 0.573±0.000 |
| role relation | 0.981±0.004 |
| head relation | 0.981±0.004 |
| lexical order head relation | 0.790±0.000 |
| lexical bag head relation | 0.800±0.000 |
| role landmark | 0.870±0.014 |
| head landmark | 0.903±0.016 |
| lexical order head landmark | 0.790±0.000 |
| lexical bag head landmark | 0.792±0.000 |
| role region | 0.996±0.001 |
| head region | 0.996±0.001 |
| lexical order head region | 0.955±0.000 |
| lexical bag head region | 0.955±0.000 |
| role anchor | 0.998±0.002 |
| head anchor | 0.998±0.002 |
| lexical order head anchor | 0.968±0.000 |
| lexical bag head anchor | 0.975±0.000 |
| role fraction | 1.000±0.001 |
| head fraction | 1.000±0.001 |
| lexical order head fraction | 0.988±0.000 |
| lexical bag head fraction | 0.993±0.000 |
| role amount | 0.956±0.022 |
| head amount | 0.956±0.022 |
| lexical order head amount | 0.750±0.000 |
| lexical bag head amount | 0.775±0.000 |
| occupancy: unknown filler | 0.561±0.044 |
| role unit | 0.956±0.018 |
| head unit | 0.956±0.018 |
| lexical order head unit | 0.750±0.000 |
| lexical bag head unit | 0.775±0.000 |
| role direction | 0.974±0.006 |
| head direction | 0.974±0.006 |
| lexical order head direction | 0.927±0.000 |
| lexical bag head direction | 0.935±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 1.000±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 0.999±0.002 |
| head layout | 0.999±0.002 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 1.000±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.934±0.005 |
| head source | 0.934±0.005 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.927±0.000 |
| role target | 0.938±0.009 |
| head target | 0.939±0.009 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.927±0.000 |
| role quantity | 0.986±0.009 |
| head quantity | 0.986±0.009 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.374±0.068 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.125±0.000 |
| role object [pooled midpoint (comparison)] | 0.448±0.018 |
| role color [pooled midpoint (comparison)] | 0.987±0.005 |
| role size [pooled midpoint (comparison)] | 0.967±0.004 |
| role style [pooled midpoint (comparison)] | 0.958±0.016 |
| role text [pooled midpoint (comparison)] | 0.770±0.012 |
| role relation [pooled midpoint (comparison)] | 0.948±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.869±0.005 |
| role region [pooled midpoint (comparison)] | 0.994±0.001 |
| role anchor [pooled midpoint (comparison)] | 0.996±0.004 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.001 |
| role amount [pooled midpoint (comparison)] | 0.911±0.016 |
| role unit [pooled midpoint (comparison)] | 0.924±0.019 |
| role direction [pooled midpoint (comparison)] | 0.969±0.006 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.936±0.003 |
| role target [pooled midpoint (comparison)] | 0.935±0.009 |
| role quantity [pooled midpoint (comparison)] | 0.980±0.011 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.346±0.031 |
| presence object: present read present [pooled midpoint (comparison)] | 0.789±0.025 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.994±0.007 |
| presence size: present read present [pooled midpoint (comparison)] | 0.912±0.043 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.950±0.024 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.904±0.019 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.988±0.002 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.760±0.069 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.819±0.086 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.987±0.006 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.994±0.007 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.971±0.015 |
| presence size: absent read absent | 0.981±0.011 |
| presence text: present read present | 0.896±0.036 |
| presence text: share of 'present' readings that abstain | 0.243±0.039 |
| presence text: share of true 'present' readings that abstain | 0.204±0.050 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.989±0.006 |
| presence text: present read present [pooled midpoint (comparison)] | 0.913±0.012 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 0.488±0.092 |
| presence relation: present read present | 0.975±0.014 |
| presence relation: share of 'present' readings that abstain | 0.068±0.014 |
| presence relation: share of true 'present' readings that abstain | 0.068±0.014 |
| presence landmark: present read present | 0.770±0.059 |
| presence anchor: present read present | 0.985±0.031 |
| presence anchor: share of 'present' readings that abstain | 0.052±0.067 |
| presence anchor: share of true 'present' readings that abstain | 0.052±0.067 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.210±0.180 |
| presence fraction: share of true 'present' readings that abstain | 0.210±0.180 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.980±0.040 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present | 0.703±0.065 |
| presence source: share of 'present' readings that abstain | 0.953±0.078 |
| presence source: share of true 'present' readings that abstain | 0.958±0.060 |
| presence target: present read present | 0.686±0.028 |
| presence target: share of 'present' readings that abstain | 0.923±0.078 |
| presence target: share of true 'present' readings that abstain | 0.934±0.062 |
| determiner identity (outside FULL when the legend excludes it) | 0.604±0.100 |
| presence source: present read present [pooled midpoint (comparison)] | 0.673±0.050 |
| presence target: present read present [pooled midpoint (comparison)] | 0.676±0.023 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.864±0.026 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.751±0.046 |
| presence landmark: share of 'present' readings that abstain | 0.725±0.063 |
| presence landmark: share of true 'present' readings that abstain | 0.697±0.067 |
| presence unit: share of 'present' readings that abstain | 0.118±0.042 |
| presence unit: share of true 'present' readings that abstain | 0.118±0.042 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.012±0.024 |
| presence region: share of true 'present' readings that abstain | 0.012±0.024 |
| presence region: present read present [pooled midpoint (comparison)] | 0.975±0.031 |
| presence size: share of FALSE 'present' readings that abstain | nan±nan |
| presence direction: present read present | 0.794±0.092 |
| presence direction: share of 'present' readings that abstain | 0.137±0.058 |
| presence direction: share of true 'present' readings that abstain | 0.137±0.058 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.752±0.080 |
| presence quantity: share of 'present' readings that abstain | nan±nan |
| presence quantity: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: share of 'present' readings that abstain | 0.833±0.116 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.904±0.124 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence object: absent read absent | 0.095±0.141 |
| presence object: share of FALSE 'present' readings that abstain | 0.029±0.057 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.062±0.081 |
| presence style: present read present | 0.933±0.133 |
| presence style: share of true 'present' readings that abstain | 0.600±0.374 |
| presence style: present read present [pooled midpoint (comparison)] | 0.933±0.133 |
| presence landmark: share of FALSE 'present' readings that abstain | 0.975±0.050 |
| presence source: share of FALSE 'present' readings that abstain | 0.900±0.200 |
| presence color: present read present | 0.750±0.158 |
| presence color: present read present [pooled midpoint (comparison)] | 0.600±0.122 |
| presence color: share of true 'present' readings that abstain | 0.587±0.325 |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.609±0.024; status {'abstain': 289, 'no-sense': 96, 'ok': 15}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.752 | 0.175 / 0.114 | 0.97 | 0.237 | 0.018 / 0.010 |
| role object | 0.537 | 0.103 / 0.000 | 0.61 | 0.124 | 0.054 / 0.339 |
| roles (pooled) | 0.616 | 0.080 / 0.000 | 0.58 | 0.074 | 0.114 / 0.309 |
| role size | 0.704 | 0.055 / 0.000 | 0.59 | 0.074 | 0.185 / 0.222 |
| role amount | 0.720 | 0.047 / 0.000 | 0.49 | 0.000 | 0.230 / 0.280 |
| role unit | 0.820 | 0.086 / 0.000 | 0.72 | 0.010 | 0.110 / 0.170 |
| role text | 0.656 | 0.082 / 0.000 | 0.68 | 0.118 | 0.091 / 0.226 |
| role relation | 0.929 | 0.114 / 0.049 | 0.89 | 0.036 | 0.071 / 0.036 |
| role landmark | 0.417 | 0.021 / 0.000 | 0.15 | 0.048 | 0.310 / 0.536 |
| role anchor | 0.846 | 0.100 / 0.001 | 0.77 | 0.000 | 0.077 / 0.154 |
| role fraction | 0.800 | 0.065 / 0.003 | 0.60 | 0.000 | 0.200 / 0.200 |
| role source | 0.345 | 0.012 / 0.000 | 0.00 | 0.000 | 0.345 / 0.655 |
| role target | 0.103 | 0.013 / 0.000 | 0.00 | 0.000 | 0.103 / 0.897 |
| role region | 0.889 | 0.149 / 0.122 | 0.94 | 0.056 | 0.000 / 0.056 |
| role direction | 0.517 | 0.056 / 0.000 | 0.52 | 0.034 | 0.034 / 0.448 |
| role style | 0.400 | 0.023 / 0.000 | 0.20 | 0.000 | 0.200 / 0.600 |
| role color | 0.333 | 0.032 / 0.000 | 0.33 | 0.000 | 0.000 / 0.667 |

### new_identities_en — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.000±0.000 |
| FULL [depth given] | 0.000±0.000 |
| FULL [depth and negation given] | 0.000±0.000 |
| FULL [pooled midpoint (comparison)] | 0.000±0.000 |
| presence object: present read present | 0.859±0.063 |
| presence object: share of 'present' readings that abstain | 0.229±0.014 |
| presence object: share of true 'present' readings that abstain | 0.233±0.012 |
| presence color: absent read absent | 0.951±0.032 |
| presence size: present read present | 0.974±0.032 |
| presence size: share of 'present' readings that abstain | 0.857±0.111 |
| presence size: share of true 'present' readings that abstain | 0.686±0.187 |
| presence style: absent read absent | 0.700±0.180 |
| presence text: absent read absent | 0.757±0.100 |
| presence relation: absent read absent | 0.709±0.059 |
| presence landmark: absent read absent | 0.831±0.064 |
| presence region: absent read absent | 0.929±0.033 |
| presence anchor: absent read absent | 0.955±0.016 |
| presence fraction: absent read absent | 0.953±0.022 |
| presence amount: present read present | 0.911±0.058 |
| presence amount: share of 'present' readings that abstain | 0.997±0.006 |
| presence amount: share of true 'present' readings that abstain | 0.997±0.006 |
| presence unit: present read present | 0.916±0.058 |
| presence direction: absent read absent | 0.907±0.052 |
| presence axis: absent read absent | 0.953±0.030 |
| presence layout: absent read absent | 0.979±0.017 |
| presence pairing: absent read absent | 0.962±0.024 |
| presence source: absent read absent | 0.942±0.029 |
| presence target: absent read absent | 0.971±0.017 |
| presence quantity: absent read absent | 0.691±0.143 |
| structure (depth, negation) | 0.552±0.057 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.560±0.059 |
| event type (synonym table) | 0.561±0.058 |
| role object | 0.382±0.063 |
| head object | 0.420±0.067 |
| lexical order head object | 0.033±0.000 |
| lexical bag head object | 0.840±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.469±0.081 |
| occupancy: known filler | 0.645±0.063 |
| role color | 0.962±0.020 |
| head color | 0.962±0.020 |
| lexical order head color | 0.985±0.000 |
| lexical bag head color | 0.988±0.000 |
| occupancy: not given | 0.939±0.009 |
| role size | 0.903±0.039 |
| head size | 0.903±0.039 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.945±0.000 |
| role style | 0.831±0.080 |
| head style | 0.831±0.080 |
| lexical order head style | 0.988±0.000 |
| lexical bag head style | 0.988±0.000 |
| role text | 0.456±0.028 |
| head text | 0.456±0.028 |
| lexical order head text | 0.535±0.000 |
| lexical bag head text | 0.573±0.000 |
| role relation | 0.832±0.029 |
| head relation | 0.832±0.029 |
| lexical order head relation | 0.790±0.000 |
| lexical bag head relation | 0.800±0.000 |
| role landmark | 0.746±0.024 |
| head landmark | 0.757±0.024 |
| lexical order head landmark | 0.790±0.000 |
| lexical bag head landmark | 0.792±0.000 |
| role region | 0.951±0.019 |
| head region | 0.951±0.019 |
| lexical order head region | 0.955±0.000 |
| lexical bag head region | 0.955±0.000 |
| role anchor | 0.965±0.011 |
| head anchor | 0.965±0.011 |
| lexical order head anchor | 0.968±0.000 |
| lexical bag head anchor | 0.975±0.000 |
| role fraction | 0.966±0.013 |
| head fraction | 0.966±0.013 |
| lexical order head fraction | 0.988±0.000 |
| lexical bag head fraction | 0.993±0.000 |
| role amount | 0.725±0.023 |
| head amount | 0.725±0.023 |
| lexical order head amount | 0.750±0.000 |
| lexical bag head amount | 0.775±0.000 |
| occupancy: unknown filler | 0.424±0.054 |
| role unit | 0.900±0.009 |
| head unit | 0.900±0.009 |
| lexical order head unit | 0.750±0.000 |
| lexical bag head unit | 0.775±0.000 |
| role direction | 0.926±0.021 |
| head direction | 0.926±0.021 |
| lexical order head direction | 0.927±0.000 |
| lexical bag head direction | 0.935±0.000 |
| role axis | 0.974±0.018 |
| head axis | 0.974±0.018 |
| lexical order head axis | 1.000±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 0.988±0.009 |
| head layout | 0.988±0.009 |
| lexical order head layout | 1.000±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.979±0.012 |
| head pairing | 0.979±0.012 |
| lexical order head pairing | 1.000±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.897±0.014 |
| head source | 0.897±0.014 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.927±0.000 |
| role target | 0.913±0.011 |
| head target | 0.913±0.011 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.927±0.000 |
| role quantity | 0.832±0.071 |
| head quantity | 0.832±0.071 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.000±0.000 |
| heads FULL (lexical order baseline) | 0.000±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.125±0.000 |
| role object [pooled midpoint (comparison)] | 0.364±0.016 |
| role color [pooled midpoint (comparison)] | 0.983±0.004 |
| role size [pooled midpoint (comparison)] | 0.929±0.021 |
| role style [pooled midpoint (comparison)] | 0.781±0.083 |
| role text [pooled midpoint (comparison)] | 0.463±0.014 |
| role relation [pooled midpoint (comparison)] | 0.897±0.013 |
| role landmark [pooled midpoint (comparison)] | 0.785±0.006 |
| role region [pooled midpoint (comparison)] | 0.974±0.005 |
| role anchor [pooled midpoint (comparison)] | 0.983±0.006 |
| role fraction [pooled midpoint (comparison)] | 0.970±0.009 |
| role amount [pooled midpoint (comparison)] | 0.742±0.006 |
| role unit [pooled midpoint (comparison)] | 0.888±0.020 |
| role direction [pooled midpoint (comparison)] | 0.940±0.015 |
| role axis [pooled midpoint (comparison)] | 0.973±0.013 |
| role layout [pooled midpoint (comparison)] | 0.994±0.002 |
| role pairing [pooled midpoint (comparison)] | 0.982±0.012 |
| role source [pooled midpoint (comparison)] | 0.913±0.005 |
| role target [pooled midpoint (comparison)] | 0.914±0.011 |
| role quantity [pooled midpoint (comparison)] | 0.864±0.066 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.000±0.000 |
| presence object: present read present [pooled midpoint (comparison)] | 0.875±0.012 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.989±0.008 |
| presence size: present read present [pooled midpoint (comparison)] | 0.916±0.054 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.597±0.156 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.762±0.045 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.928±0.034 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.926±0.025 |
| presence region: absent read absent [pooled midpoint (comparison)] | 0.969±0.008 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 0.989±0.006 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 0.958±0.015 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.764±0.071 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.858±0.071 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.946±0.019 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 0.949±0.024 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.989±0.004 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 0.966±0.023 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.971±0.011 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.971±0.020 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.740±0.122 |
| presence size: absent read absent | 0.873±0.070 |
| presence size: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: present read present | 0.880±0.055 |
| presence text: share of 'present' readings that abstain | 1.000±0.000 |
| presence text: share of true 'present' readings that abstain | 1.000±0.000 |
| presence amount: absent read absent | 0.935±0.059 |
| presence unit: absent read absent | 0.950±0.037 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.930±0.040 |
| presence text: present read present [pooled midpoint (comparison)] | 0.884±0.011 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 0.977±0.018 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.985±0.012 |
| presence color: share of 'present' readings that abstain | 0.991±0.018 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.984±0.014 |
| presence style: share of FALSE 'present' readings that abstain | 0.986±0.012 |
| presence relation: share of 'present' readings that abstain | 0.515±0.054 |
| presence relation: share of FALSE 'present' readings that abstain | 0.997±0.006 |
| presence landmark: share of 'present' readings that abstain | 1.000±0.000 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence source: present read present | 0.704±0.065 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.658±0.043 |
| presence target: share of 'present' readings that abstain | 1.000±0.000 |
| presence target: share of true 'present' readings that abstain | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.586±0.088 |
| presence target: present read present [pooled midpoint (comparison)] | 0.591±0.065 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.531±0.143 |
| presence anchor: share of true 'present' readings that abstain | 0.072±0.099 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: present read present | 0.994±0.012 |
| presence relation: share of true 'present' readings that abstain | 0.171±0.034 |
| presence landmark: present read present | 0.924±0.045 |
| presence landmark: share of true 'present' readings that abstain | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.925±0.074 |
| presence axis: share of FALSE 'present' readings that abstain | 0.925±0.074 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.898±0.024 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.890±0.054 |
| presence unit: share of 'present' readings that abstain | 0.210±0.016 |
| presence unit: share of true 'present' readings that abstain | 0.126±0.052 |
| presence quantity: share of 'present' readings that abstain | 1.000±0.000 |
| presence quantity: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.505±0.123 |
| presence region: share of true 'present' readings that abstain | 0.039±0.051 |
| presence unit: share of FALSE 'present' readings that abstain | 0.986±0.029 |
| presence region: present read present [pooled midpoint (comparison)] | 0.972±0.034 |
| presence region: share of FALSE 'present' readings that abstain | 0.993±0.015 |
| presence direction: present read present | 0.878±0.063 |
| presence direction: share of 'present' readings that abstain | 0.612±0.164 |
| presence direction: share of true 'present' readings that abstain | 0.291±0.157 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.818±0.073 |
| presence fraction: share of 'present' readings that abstain | 0.885±0.094 |
| presence fraction: share of FALSE 'present' readings that abstain | 0.956±0.065 |
| presence object: absent read absent | 0.040±0.080 |
| presence object: share of FALSE 'present' readings that abstain | 0.050±0.100 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.033±0.067 |
| presence anchor: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence amount: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.983±0.033 |
| presence layout: share of FALSE 'present' readings that abstain | 0.983±0.033 |
| presence style: present read present | nan±nan |
| presence style: share of true 'present' readings that abstain | nan±nan |
| presence style: present read present [pooled midpoint (comparison)] | nan±nan |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.983±0.033 |
| presence pairing: share of FALSE 'present' readings that abstain | 0.983±0.033 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.500±0.447 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: present read present | 0.933±0.133 |
| presence color: share of true 'present' readings that abstain | 0.900±0.200 |
| presence color: present read present [pooled midpoint (comparison)] | 0.667±0.183 |

residual mean 0.740±0.027; status {'abstain': 235, 'no-sense': 164, 'ok': 1}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.585 | 0.175 / 0.114 | 0.97 | 0.400 | 0.013 / 0.015 |
| role object | 0.421 | 0.074 / 0.000 | 0.50 | 0.160 | 0.085 / 0.419 |
| roles (pooled) | 0.332 | 0.049 / 0.000 | 0.35 | 0.086 | 0.069 / 0.582 |
| role size | 0.519 | 0.028 / 0.000 | 0.19 | 0.074 | 0.407 / 0.407 |
| role amount | 0.000 | 0.009 / 0.000 | 0.02 | 0.020 | 0.000 / 0.980 |
| role unit | 0.700 | 0.095 / 0.000 | 0.71 | 0.090 | 0.080 / 0.210 |
| role text | 0.000 | 0.008 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role relation | 0.810 | 0.079 / 0.040 | 0.86 | 0.155 | 0.107 / 0.036 |
| role landmark | 0.095 | 0.009 / 0.000 | 0.00 | 0.000 | 0.095 / 0.905 |
| role anchor | 0.692 | 0.080 / 0.001 | 0.77 | 0.154 | 0.077 / 0.154 |
| role fraction | 0.400 | 0.039 / 0.003 | 0.40 | 0.200 | 0.200 / 0.400 |
| role source | 0.000 | 0.004 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role target | 0.000 | 0.005 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role region | 0.722 | 0.112 / 0.060 | 0.94 | 0.222 | 0.000 / 0.056 |
| role direction | 0.517 | 0.041 / 0.000 | 0.41 | 0.000 | 0.103 / 0.483 |
| role style | 0.400 | 0.019 / 0.000 | 0.20 | 0.000 | 0.200 / 0.600 |
| role color | 0.333 | 0.013 / 0.000 | 0.17 | 0.000 | 0.167 / 0.667 |

### train (sample) — catalog candidates (n = 300 of 904)
| axis | accuracy |
|---|---|
| FULL | 0.379±0.075 |
| FULL [depth given] | 0.379±0.075 |
| FULL [depth and negation given] | 0.380±0.075 |
| structure (depth, negation) | 0.710±0.039 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.715±0.038 |
| event type (synonym table) | 0.717±0.038 |
| role object | 0.479±0.081 |
| head object | 0.515±0.091 |
| lexical order head object | 0.097±0.000 |
| lexical bag head object | 0.583±0.000 |
| occupancy: known filler | 0.647±0.056 |
| role color | 0.969±0.016 |
| head color | 0.969±0.016 |
| lexical order head color | 0.950±0.000 |
| lexical bag head color | 0.973±0.000 |
| occupancy: not given | 0.993±0.002 |
| role size | 0.953±0.009 |
| head size | 0.953±0.009 |
| lexical order head size | 0.903±0.000 |
| lexical bag head size | 0.967±0.000 |
| role style | 0.957±0.016 |
| head style | 0.957±0.016 |
| lexical order head style | 0.990±0.000 |
| lexical bag head style | 0.993±0.000 |
| role text | 0.940±0.005 |
| head text | 0.940±0.005 |
| lexical order head text | 0.880±0.000 |
| lexical bag head text | 1.000±0.000 |
| role relation | 0.993±0.003 |
| head relation | 0.993±0.003 |
| lexical order head relation | 0.913±0.000 |
| lexical bag head relation | 0.983±0.000 |
| role landmark | 0.973±0.010 |
| head landmark | 0.981±0.010 |
| lexical order head landmark | 0.913±0.000 |
| lexical bag head landmark | 0.943±0.000 |
| role region | 0.996±0.005 |
| head region | 0.996±0.005 |
| lexical order head region | 0.920±0.000 |
| lexical bag head region | 0.997±0.000 |
| role anchor | 0.988±0.005 |
| head anchor | 0.988±0.005 |
| lexical order head anchor | 0.963±0.000 |
| lexical bag head anchor | 1.000±0.000 |
| role fraction | 0.997±0.004 |
| head fraction | 0.997±0.004 |
| lexical order head fraction | 0.977±0.000 |
| lexical bag head fraction | 1.000±0.000 |
| role amount | 0.994±0.004 |
| head amount | 0.994±0.004 |
| lexical order head amount | 0.923±0.000 |
| lexical bag head amount | 1.000±0.000 |
| role unit | 0.996±0.002 |
| head unit | 0.996±0.002 |
| lexical order head unit | 0.923±0.000 |
| lexical bag head unit | 1.000±0.000 |
| role direction | 0.981±0.004 |
| head direction | 0.981±0.004 |
| lexical order head direction | 0.917±0.000 |
| lexical bag head direction | 0.973±0.000 |
| role axis | 0.986±0.002 |
| head axis | 0.986±0.002 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 0.983±0.000 |
| role layout | 0.980±0.004 |
| head layout | 0.980±0.004 |
| lexical order head layout | 0.957±0.000 |
| lexical bag head layout | 0.990±0.000 |
| role pairing | 0.993±0.003 |
| head pairing | 0.993±0.003 |
| lexical order head pairing | 0.980±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.908±0.006 |
| head source | 0.927±0.008 |
| lexical order head source | 0.870±0.000 |
| lexical bag head source | 0.930±0.000 |
| role target | 0.956±0.006 |
| head target | 0.959±0.007 |
| lexical order head target | 0.890±0.000 |
| lexical bag head target | 0.943±0.000 |
| role quantity | 0.987±0.002 |
| head quantity | 0.987±0.002 |
| lexical order head quantity | 0.977±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.431±0.081 |
| heads FULL (lexical order baseline) | 0.020±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.493±0.000 |
| presence object: present read present | 0.738±0.122 |
| presence object: share of 'present' readings that abstain | 0.068±0.019 |
| presence object: share of true 'present' readings that abstain | 0.069±0.018 |
| presence color: absent read absent | 0.971±0.020 |
| presence size: absent read absent | 0.973±0.010 |
| presence style: absent read absent | 0.949±0.024 |
| presence text: absent read absent | 0.995±0.005 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.982±0.016 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: present read present | 0.670±0.091 |
| presence target: present read present | 0.760±0.063 |
| presence target: share of 'present' readings that abstain | 0.513±0.086 |
| presence target: share of true 'present' readings that abstain | 0.513±0.086 |
| presence quantity: absent read absent | 0.999±0.002 |
| determiner identity (outside FULL when the legend excludes it) | 0.554±0.102 |
| presence region: present read present | 0.992±0.017 |
| presence region: share of 'present' readings that abstain | 0.052±0.048 |
| presence region: share of true 'present' readings that abstain | 0.052±0.048 |
| presence source: absent read absent | 0.997±0.004 |
| presence target: absent read absent | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.680±0.108 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.260±0.143 |
| presence fraction: share of true 'present' readings that abstain | 0.260±0.143 |
| presence object: absent read absent | 0.685±0.051 |
| presence object: share of FALSE 'present' readings that abstain | 0.054±0.066 |
| presence text: present read present | 0.882±0.066 |
| presence text: share of 'present' readings that abstain | 0.227±0.097 |
| presence text: share of true 'present' readings that abstain | 0.212±0.094 |
| presence source: share of 'present' readings that abstain | 0.622±0.105 |
| presence source: share of true 'present' readings that abstain | 0.620±0.103 |
| presence relation: present read present | 0.976±0.031 |
| presence relation: share of 'present' readings that abstain | 0.034±0.032 |
| presence relation: share of true 'present' readings that abstain | 0.034±0.032 |
| presence landmark: present read present | 0.951±0.040 |
| presence landmark: share of 'present' readings that abstain | 0.346±0.090 |
| presence landmark: share of true 'present' readings that abstain | 0.274±0.053 |
| presence style: share of 'present' readings that abstain | 0.935±0.083 |
| presence style: share of FALSE 'present' readings that abstain | 0.945±0.068 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.217±0.194 |
| presence quantity: share of true 'present' readings that abstain | 0.183±0.153 |
| presence size: share of 'present' readings that abstain | 0.362±0.070 |
| presence size: share of FALSE 'present' readings that abstain | 0.726±0.033 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.040±0.080 |
| presence layout: share of true 'present' readings that abstain | 0.040±0.080 |
| presence amount: present read present | 0.946±0.034 |
| presence amount: share of 'present' readings that abstain | 0.087±0.041 |
| presence amount: share of true 'present' readings that abstain | 0.087±0.041 |
| presence unit: present read present | 0.974±0.035 |
| presence unit: share of 'present' readings that abstain | 0.074±0.056 |
| presence unit: share of true 'present' readings that abstain | 0.074±0.056 |
| presence color: present read present | 0.889±0.083 |
| presence color: share of true 'present' readings that abstain | 0.537±0.110 |
| presence pairing: present read present | 0.950±0.100 |
| presence pairing: share of 'present' readings that abstain | 0.130±0.108 |
| presence pairing: share of true 'present' readings that abstain | 0.130±0.108 |
| presence direction: present read present | 0.969±0.025 |
| presence direction: share of 'present' readings that abstain | 0.210±0.065 |
| presence direction: share of true 'present' readings that abstain | 0.210±0.065 |
| presence size: present read present | 0.969±0.042 |
| presence size: share of true 'present' readings that abstain | 0.272±0.069 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence style: present read present | 1.000±0.000 |
| presence style: share of true 'present' readings that abstain | 0.800±0.400 |

residual mean 0.628±0.029; status {'no-sense': 83, 'abstain': 199, 'ok': 18}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.720 | 0.207 / 0.126 | 0.98 | 0.267 | 0.010 / 0.013 |
| role object | 0.494 | 0.127 / 0.000 | 0.58 | 0.103 | 0.018 / 0.402 |
| roles (pooled) | 0.608 | 0.103 / 0.000 | 0.62 | 0.099 | 0.086 / 0.293 |
| role text | 0.528 | 0.089 / 0.000 | 0.69 | 0.222 | 0.056 / 0.250 |
| role source | 0.282 | 0.024 / 0.000 | 0.26 | 0.103 | 0.128 / 0.615 |
| role target | 0.636 | 0.038 / 0.000 | 0.30 | 0.000 | 0.333 / 0.364 |
| role axis | 0.545 | 0.153 / 0.110 | 1.00 | 0.455 | 0.000 / 0.000 |
| role region | 0.958 | 0.123 / 0.070 | 0.96 | 0.000 | 0.000 / 0.042 |
| role anchor | 0.727 | 0.129 / 0.094 | 0.91 | 0.182 | 0.000 / 0.091 |
| role fraction | 1.000 | 0.065 / 0.028 | 0.57 | 0.000 | 0.429 / 0.000 |
| role size | 0.759 | 0.067 / 0.000 | 0.59 | 0.034 | 0.207 / 0.207 |
| role relation | 0.962 | 0.137 / 0.105 | 0.96 | 0.038 | 0.038 / 0.000 |
| role landmark | 0.769 | 0.069 / 0.003 | 0.69 | 0.115 | 0.192 / 0.115 |
| role layout | 0.615 | 0.169 / 0.133 | 0.92 | 0.308 | 0.000 / 0.077 |
| role quantity | 0.429 | 0.083 / 0.040 | 0.86 | 0.429 | 0.000 / 0.143 |
| role direction | 0.720 | 0.080 / 0.000 | 0.56 | 0.080 | 0.240 / 0.200 |
| role amount | 0.913 | 0.082 / 0.019 | 0.83 | 0.000 | 0.087 / 0.087 |
| role unit | 0.913 | 0.133 / 0.034 | 0.78 | 0.000 | 0.130 / 0.087 |
| role color | 0.600 | 0.041 / 0.000 | 0.40 | 0.067 | 0.267 / 0.333 |
| role pairing | 0.833 | 0.102 / 0.001 | 0.67 | 0.000 | 0.167 / 0.167 |
| role style | 0.333 | 0.021 / 0.001 | 0.33 | 0.000 | 0.000 / 0.667 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 COMPONENT=0.46 FILLER=0.28 VERB=0.27 REGION=0.20 PAIR=0.19 back=0.19 apart=0.16 ANCHOR=0.16 front=0.15 evenly=0.14 UNIT=0.14 LABEL=0.13 flow=0.12 LAYOUT=0.12 REL=0.12 are=0.12 CONN=0.12 din=0.12 together=0.12 unknown=0.12 do=0.12 AXIS=0.11 FRACTION=0.11 INTRO=0.11 color=0.10 DIR=0.10 spre=0.10 PRON=0.09 pe=0.08 is=0.08 lui=0.08 a=0.08 never=0.08 DEM=0.08 cu=0.08 not=0.08 dimensiunea=0.07 the=0.07 care=0.07 COLOR=0.06 de=0.06 SIZE=0.05 NUM=0.05 STYLE=0.05 la=0.05 QUANT=0.05

## What is weak, what to add
- heldout_formulations: FULL 0.296
- heldout_formulations: presence object: share of 'present' readings that abstain 0.105
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.108
- heldout_formulations: presence size: share of 'present' readings that abstain 0.333
- heldout_formulations: presence size: share of true 'present' readings that abstain 0.125
- heldout_formulations: structure (depth, negation) 0.684
- heldout_formulations: predicate (surface lemma) 0.704
- heldout_formulations: event type (synonym table) 0.704
- heldout_formulations: role object 0.471
- heldout_formulations: head object 0.534
- heldout_formulations: occupancy: known filler 0.613
- heldout_formulations: role style 0.898
- heldout_formulations: head style 0.898
- heldout_formulations: role source 0.850
- heldout_formulations: head source 0.850
- heldout_formulations: role target 0.888
- heldout_formulations: heads FULL (model) 0.345
- heldout_formulations: heads FULL (lexical order baseline) 0.019
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.044
- heldout_formulations: FULL [depth given] 0.296
- heldout_formulations: FULL [depth and negation given] 0.296
- heldout_formulations: FULL [presence not decided] 0.364
- heldout_formulations: role object [presence not decided] 0.684
- heldout_formulations: role color [presence not decided] 0.767
- heldout_formulations: role size [presence not decided] 0.854
- heldout_formulations: role style [presence not decided] 0.893
- heldout_formulations: role landmark [presence not decided] 0.835
- heldout_formulations: role source [presence not decided] 0.830
- heldout_formulations: role target [presence not decided] 0.874
- heldout_formulations: heads FULL (model) [presence not decided] 0.427
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.243
- heldout_formulations: role object [pooled midpoint (comparison)] 0.403
- heldout_formulations: role style [pooled midpoint (comparison)] 0.898
- heldout_formulations: role source [pooled midpoint (comparison)] 0.859
- heldout_formulations: role target [pooled midpoint (comparison)] 0.883
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.311
- heldout_formulations: presence text: present read present 0.846
- heldout_formulations: presence text: share of 'present' readings that abstain 0.429
- heldout_formulations: presence text: share of true 'present' readings that abstain 0.455
- heldout_formulations: presence text: present read present [pooled midpoint (comparison)] 0.818
- heldout_formulations: presence color: share of 'present' readings that abstain 0.818
- heldout_formulations: presence source: present read present 0.515
- heldout_formulations: presence source: share of 'present' readings that abstain 0.895
- heldout_formulations: presence source: share of true 'present' readings that abstain 0.882
- heldout_formulations: presence target: present read present 0.700
- heldout_formulations: determiner identity (outside FULL when the legend excludes it) 0.730
- heldout_formulations: presence source: present read present [pooled midpoint (comparison)] 0.594
- heldout_formulations: presence target: present read present [pooled midpoint (comparison)] 0.690
- heldout_formulations: presence object: absent read absent 0.500
- heldout_formulations: presence object: share of FALSE 'present' readings that abstain 0.000
- heldout_formulations: presence style: share of 'present' readings that abstain 0.846
- heldout_formulations: presence style: share of FALSE 'present' readings that abstain 0.818
- heldout_formulations: presence pairing: share of 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence object: absent read absent [pooled midpoint (comparison)] 0.833
- heldout_formulations: presence target: share of 'present' readings that abstain 0.739
- heldout_formulations: presence target: share of true 'present' readings that abstain 0.810
- heldout_formulations: presence relation: present read present 0.783
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.056
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.056
- heldout_formulations: presence landmark: present read present 0.652
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.438
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.400
- heldout_formulations: presence amount: present read present 0.875
- heldout_formulations: presence amount: share of 'present' readings that abstain 0.143
- heldout_formulations: presence amount: share of true 'present' readings that abstain 0.143
- heldout_formulations: presence unit: present read present 0.750
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence relation: present read present [pooled midpoint (comparison)] 0.632
- heldout_formulations: presence landmark: present read present [pooled midpoint (comparison)] 0.526
- heldout_formulations: presence amount: present read present [pooled midpoint (comparison)] 0.875
- heldout_formulations: presence unit: present read present [pooled midpoint (comparison)] 0.750
- heldout_formulations: presence size: share of FALSE 'present' readings that abstain 0.750
- heldout_formulations: presence style: present read present 0.333
- heldout_formulations: presence style: present read present [pooled midpoint (comparison)] 0.333
- heldout_formulations: presence region: share of 'present' readings that abstain 0.462
- heldout_formulations: presence region: share of true 'present' readings that abstain 0.462
- heldout_formulations: presence region: present read present [pooled midpoint (comparison)] 0.833
- heldout_formulations: presence quantity: present read present 0.571
- heldout_formulations: presence quantity: share of 'present' readings that abstain 0.750
- heldout_formulations: presence quantity: share of true 'present' readings that abstain 0.750
- heldout_formulations: presence quantity: present read present [pooled midpoint (comparison)] 0.571
- heldout_formulations: presence color: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence anchor: share of 'present' readings that abstain 0.400
- heldout_formulations: presence anchor: share of true 'present' readings that abstain 0.400
- heldout_formulations: presence fraction: present read present 0.400
- heldout_formulations: presence fraction: share of 'present' readings that abstain 0.500
- heldout_formulations: presence fraction: share of true 'present' readings that abstain 0.500
- heldout_formulations: presence fraction: present read present [pooled midpoint (comparison)] 0.667
- heldout_formulations: presence direction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence text: share of FALSE 'present' readings that abstain 0.333
- heldout_formulations: presence axis: share of 'present' readings that abstain 0.000
- heldout_formulations: presence axis: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence target: share of FALSE 'present' readings that abstain 0.000
- heldout_formulations_en: FULL 0.315
- heldout_formulations_en: structure (depth, negation) 0.697
- heldout_formulations_en: predicate (surface lemma) 0.691
- heldout_formulations_en: event type (synonym table) 0.708
- heldout_formulations_en: role object 0.455
- heldout_formulations_en: head object 0.528
- heldout_formulations_en: determiner identity (outside FULL when the legend excludes it) 0.566
- heldout_formulations_en: occupancy: known filler 0.684
- heldout_formulations_en: role source 0.848
- heldout_formulations_en: head source 0.854
- heldout_formulations_en: role target 0.893
- heldout_formulations_en: heads FULL (model) 0.360
- heldout_formulations_en: heads FULL (lexical order baseline) 0.017
- heldout_formulations_en: heads FULL (lexical bag baseline, trained on the same training rows) 0.292
- heldout_formulations_en: FULL [depth given] 0.315
- heldout_formulations_en: FULL [depth and negation given] 0.326
- heldout_formulations_en: FULL [presence not decided] 0.309
- heldout_formulations_en: role object [presence not decided] 0.635
- heldout_formulations_en: role color [presence not decided] 0.736
- heldout_formulations_en: role size [presence not decided] 0.882
- heldout_formulations_en: role style [presence not decided] 0.899
- heldout_formulations_en: role landmark [presence not decided] 0.809
- heldout_formulations_en: role source [presence not decided] 0.831
- heldout_formulations_en: role target [presence not decided] 0.837
- heldout_formulations_en: heads FULL (model) [presence not decided] 0.360
- heldout_formulations_en: FULL [pooled midpoint (comparison)] 0.303
- heldout_formulations_en: role object [pooled midpoint (comparison)] 0.421
- heldout_formulations_en: role source [pooled midpoint (comparison)] 0.848
- heldout_formulations_en: role target [pooled midpoint (comparison)] 0.893
- heldout_formulations_en: heads FULL (model) [pooled midpoint (comparison)] 0.348
- heldout_formulations_en: presence direction: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence direction: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence object: share of 'present' readings that abstain 0.089
- heldout_formulations_en: presence object: share of true 'present' readings that abstain 0.089
- heldout_formulations_en: presence relation: share of 'present' readings that abstain 0.059
- heldout_formulations_en: presence relation: share of true 'present' readings that abstain 0.059
- heldout_formulations_en: presence landmark: present read present 0.667
- heldout_formulations_en: presence landmark: share of 'present' readings that abstain 0.714
- heldout_formulations_en: presence landmark: share of true 'present' readings that abstain 0.667
- heldout_formulations_en: presence object: present read present [pooled midpoint (comparison)] 0.875
- heldout_formulations_en: presence landmark: present read present [pooled midpoint (comparison)] 0.765
- heldout_formulations_en: presence style: share of 'present' readings that abstain 0.875
- heldout_formulations_en: presence style: share of FALSE 'present' readings that abstain 0.857
- heldout_formulations_en: presence source: share of 'present' readings that abstain 0.885
- heldout_formulations_en: presence target: present read present 0.885
- heldout_formulations_en: presence target: share of 'present' readings that abstain 0.840
- heldout_formulations_en: presence target: share of true 'present' readings that abstain 0.870
- heldout_formulations_en: presence text: share of 'present' readings that abstain 0.238
- heldout_formulations_en: presence text: share of true 'present' readings that abstain 0.118
- heldout_formulations_en: presence size: share of 'present' readings that abstain 0.556
- heldout_formulations_en: presence size: share of FALSE 'present' readings that abstain 0.714
- heldout_formulations_en: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence fraction: present read present 0.889
- heldout_formulations_en: presence fraction: share of 'present' readings that abstain 0.125
- heldout_formulations_en: presence fraction: share of true 'present' readings that abstain 0.125
- heldout_formulations_en: presence fraction: present read present [pooled midpoint (comparison)] 0.889
- heldout_formulations_en: presence region: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence region: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence size: share of true 'present' readings that abstain 0.455
- heldout_formulations_en: presence amount: share of 'present' readings that abstain 0.800
- heldout_formulations_en: presence amount: share of true 'present' readings that abstain 0.800
- heldout_formulations_en: presence unit: present read present 0.400
- heldout_formulations_en: presence amount: present read present [pooled midpoint (comparison)] 0.200
- heldout_formulations_en: presence unit: present read present [pooled midpoint (comparison)] 0.400
- heldout_formulations_en: presence source: share of FALSE 'present' readings that abstain 0.500
- heldout_formulations_en: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations_en: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations_en: presence style: present read present 0.200
- heldout_formulations_en: presence style: present read present [pooled midpoint (comparison)] 0.200
- heldout_formulations_en: presence quantity: share of 'present' readings that abstain 0.333
- heldout_formulations_en: presence quantity: share of true 'present' readings that abstain 0.333
- heldout_formulations_en: occupancy: unknown filler 0.000
- heldout_formulations_en: presence target: share of FALSE 'present' readings that abstain 0.500
- heldout_formulations_en: presence text: share of FALSE 'present' readings that abstain 0.750
- heldout_sentences: FULL 0.365
- heldout_sentences: presence object: present read present 0.873
- heldout_sentences: presence object: share of 'present' readings that abstain 0.054
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.055
- heldout_sentences: presence color: share of 'present' readings that abstain 0.000
- heldout_sentences: presence color: share of true 'present' readings that abstain 0.000
- heldout_sentences: structure (depth, negation) 0.688
- heldout_sentences: predicate (surface lemma) 0.688
- heldout_sentences: event type (synonym table) 0.698
- heldout_sentences: role object 0.510
- heldout_sentences: head object 0.573
- heldout_sentences: occupancy: known filler 0.609
- heldout_sentences: role text 0.885
- heldout_sentences: head text 0.885
- heldout_sentences: heads FULL (model) 0.427
- heldout_sentences: heads FULL (lexical order baseline) 0.010
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.135
- heldout_sentences: FULL [depth given] 0.365
- heldout_sentences: FULL [depth and negation given] 0.365
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.344
- heldout_sentences: role object [pooled midpoint (comparison)] 0.448
- heldout_sentences: role text [pooled midpoint (comparison)] 0.885
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.417
- heldout_sentences: presence object: present read present [pooled midpoint (comparison)] 0.800
- heldout_sentences: determiner identity (outside FULL when the legend excludes it) 0.606
- heldout_sentences: presence region: present read present 0.778
- heldout_sentences: presence region: share of 'present' readings that abstain 0.286
- heldout_sentences: presence region: share of true 'present' readings that abstain 0.286
- heldout_sentences: presence region: present read present [pooled midpoint (comparison)] 0.875
- heldout_sentences: presence size: share of 'present' readings that abstain 0.200
- heldout_sentences: presence size: share of true 'present' readings that abstain 0.250
- heldout_sentences: presence relation: present read present 0.889
- heldout_sentences: presence relation: share of 'present' readings that abstain 0.000
- heldout_sentences: presence relation: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence landmark: present read present 0.556
- heldout_sentences: presence relation: present read present [pooled midpoint (comparison)] 0.857
- heldout_sentences: presence landmark: present read present [pooled midpoint (comparison)] 0.714
- heldout_sentences: presence amount: share of 'present' readings that abstain 0.000
- heldout_sentences: presence amount: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence unit: present read present 0.750
- heldout_sentences: presence unit: present read present [pooled midpoint (comparison)] 0.750
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.200
- heldout_sentences: presence landmark: share of true 'present' readings that abstain 0.200
- heldout_sentences: presence text: present read present 0.667
- heldout_sentences: presence text: share of 'present' readings that abstain 0.167
- heldout_sentences: presence text: share of true 'present' readings that abstain 0.167
- heldout_sentences: presence text: present read present [pooled midpoint (comparison)] 0.750
- heldout_sentences: presence style: present read present 0.000
- heldout_sentences: presence layout: present read present 0.667
- heldout_sentences: presence layout: share of 'present' readings that abstain 0.000
- heldout_sentences: presence layout: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence layout: present read present [pooled midpoint (comparison)] 0.667
- heldout_sentences: presence source: present read present 0.444
- heldout_sentences: presence target: share of 'present' readings that abstain 0.750
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.750
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.444
- heldout_sentences: presence color: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: presence object: absent read absent 0.750
- heldout_sentences: presence direction: share of 'present' readings that abstain 0.167
- heldout_sentences: presence direction: share of true 'present' readings that abstain 0.167
- heldout_sentences: presence object: absent read absent [pooled midpoint (comparison)] 0.750
- heldout_sentences: presence axis: share of 'present' readings that abstain 0.000
- heldout_sentences: presence axis: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence anchor: share of 'present' readings that abstain 0.000
- heldout_sentences: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence source: share of 'present' readings that abstain 0.750
- heldout_sentences: presence source: share of true 'present' readings that abstain 0.750
- heldout_sentences: presence pairing: share of 'present' readings that abstain 0.000
- heldout_sentences: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_sentences: occupancy: unknown filler 0.000
- heldout_sentences: presence size: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.000
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence object: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of true 'present' readings that abstain 0.000
- mixed: FULL 0.323
- mixed: presence object: present read present 0.841
- mixed: presence object: share of 'present' readings that abstain 0.072
- mixed: presence object: share of true 'present' readings that abstain 0.071
- mixed: presence relation: share of 'present' readings that abstain 0.167
- mixed: presence relation: share of true 'present' readings that abstain 0.167
- mixed: presence landmark: present read present 0.684
- mixed: structure (depth, negation) 0.667
- mixed: predicate (surface lemma) 0.680
- mixed: event type (synonym table) 0.680
- mixed: role object 0.485
- mixed: head object 0.550
- mixed: determiner identity (outside FULL when the legend excludes it) 0.627
- mixed: occupancy: known filler 0.591
- mixed: role landmark 0.897
- mixed: role source 0.892
- mixed: heads FULL (model) 0.385
- mixed: heads FULL (lexical order baseline) 0.013
- mixed: heads FULL (lexical bag baseline, trained on the same training rows) 0.085
- mixed: FULL [depth given] 0.323
- mixed: FULL [depth and negation given] 0.325
- mixed: FULL [pooled midpoint (comparison)] 0.240
- mixed: role object [pooled midpoint (comparison)] 0.388
- mixed: role source [pooled midpoint (comparison)] 0.897
- mixed: heads FULL (model) [pooled midpoint (comparison)] 0.318
- mixed: presence anchor: present read present 0.875
- mixed: presence anchor: share of 'present' readings that abstain 0.095
- mixed: presence anchor: share of true 'present' readings that abstain 0.095
- mixed: presence object: present read present [pooled midpoint (comparison)] 0.805
- mixed: presence layout: present read present 0.737
- mixed: occupancy: unknown filler 0.714
- mixed: presence layout: present read present [pooled midpoint (comparison)] 0.778
- mixed: presence amount: share of 'present' readings that abstain 0.167
- mixed: presence amount: share of true 'present' readings that abstain 0.167
- mixed: presence unit: share of 'present' readings that abstain 0.033
- mixed: presence unit: share of true 'present' readings that abstain 0.033
- mixed: presence source: present read present 0.382
- mixed: presence source: share of 'present' readings that abstain 0.882
- mixed: presence source: share of true 'present' readings that abstain 0.846
- mixed: presence target: present read present 0.652
- mixed: presence target: share of 'present' readings that abstain 0.733
- mixed: presence target: share of true 'present' readings that abstain 0.733
- mixed: presence source: present read present [pooled midpoint (comparison)] 0.375
- mixed: presence target: present read present [pooled midpoint (comparison)] 0.762
- mixed: presence landmark: share of 'present' readings that abstain 0.367
- mixed: presence landmark: share of true 'present' readings that abstain 0.269
- mixed: presence relation: present read present [pooled midpoint (comparison)] 0.774
- mixed: presence landmark: present read present [pooled midpoint (comparison)] 0.710
- mixed: presence color: share of 'present' readings that abstain 0.714
- mixed: presence color: share of true 'present' readings that abstain 0.333
- mixed: presence text: present read present 0.756
- mixed: presence text: share of 'present' readings that abstain 0.152
- mixed: presence text: share of true 'present' readings that abstain 0.161
- mixed: presence text: present read present [pooled midpoint (comparison)] 0.781
- mixed: presence layout: share of 'present' readings that abstain 0.143
- mixed: presence layout: share of true 'present' readings that abstain 0.143
- mixed: presence region: present read present 0.846
- mixed: presence region: share of 'present' readings that abstain 0.227
- mixed: presence region: share of true 'present' readings that abstain 0.227
- mixed: presence region: present read present [pooled midpoint (comparison)] 0.750
- mixed: presence fraction: share of 'present' readings that abstain 0.333
- mixed: presence fraction: share of true 'present' readings that abstain 0.333
- mixed: presence axis: share of 'present' readings that abstain 0.125
- mixed: presence axis: share of true 'present' readings that abstain 0.125
- mixed: presence quantity: share of 'present' readings that abstain 0.200
- mixed: presence quantity: share of true 'present' readings that abstain 0.200
- mixed: presence direction: present read present 0.750
- mixed: presence direction: share of 'present' readings that abstain 0.167
- mixed: presence direction: share of true 'present' readings that abstain 0.167
- mixed: presence object: absent read absent 0.550
- mixed: presence pairing: share of 'present' readings that abstain 0.200
- mixed: presence pairing: share of true 'present' readings that abstain 0.200
- mixed: presence object: absent read absent [pooled midpoint (comparison)] 0.632
- mixed: presence style: present read present 0.333
- mixed: presence style: present read present [pooled midpoint (comparison)] 0.500
- mixed: presence style: share of 'present' readings that abstain 0.833
- mixed: presence style: share of FALSE 'present' readings that abstain 0.800
- mixed: presence color: present read present [pooled midpoint (comparison)] 0.714
- mixed: presence object: share of FALSE 'present' readings that abstain 0.111
- mixed: presence text: share of FALSE 'present' readings that abstain 0.000
- mixed: presence size: share of 'present' readings that abstain 0.375
- mixed: presence size: share of FALSE 'present' readings that abstain 0.833
- mixed: presence size: share of true 'present' readings that abstain 0.100
- new_identities: FULL 0.362
- new_identities: structure (depth, negation) 0.735
- new_identities: predicate (surface lemma) 0.740
- new_identities: event type (synonym table) 0.740
- new_identities: role object 0.560
- new_identities: head object 0.610
- new_identities: occupancy: unknown filler 0.631
- new_identities: role text 0.767
- new_identities: head text 0.767
- new_identities: role landmark 0.880
- new_identities: head landmark 0.892
- new_identities: heads FULL (model) 0.410
- new_identities: heads FULL (lexical order baseline) 0.000
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.100
- new_identities: FULL [depth given] 0.362
- new_identities: FULL [depth and negation given] 0.365
- new_identities: FULL [pooled midpoint (comparison)] 0.282
- new_identities: role object [pooled midpoint (comparison)] 0.448
- new_identities: role text [pooled midpoint (comparison)] 0.738
- new_identities: role landmark [pooled midpoint (comparison)] 0.868
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.355
- new_identities: presence object: present read present 0.878
- new_identities: presence object: share of 'present' readings that abstain 0.078
- new_identities: presence object: share of true 'present' readings that abstain 0.075
- new_identities: presence anchor: share of 'present' readings that abstain 0.000
- new_identities: presence anchor: share of true 'present' readings that abstain 0.000
- new_identities: presence fraction: share of 'present' readings that abstain 0.333
- new_identities: presence fraction: share of true 'present' readings that abstain 0.333
- new_identities: occupancy: known filler 0.695
- new_identities: presence object: present read present [pooled midpoint (comparison)] 0.852
- new_identities: presence amount: share of 'present' readings that abstain 0.349
- new_identities: presence amount: share of true 'present' readings that abstain 0.349
- new_identities: presence unit: share of 'present' readings that abstain 0.060
- new_identities: presence unit: share of true 'present' readings that abstain 0.060
- new_identities: presence direction: present read present 0.800
- new_identities: presence direction: share of 'present' readings that abstain 0.062
- new_identities: presence direction: share of true 'present' readings that abstain 0.062
- new_identities: presence region: present read present 0.722
- new_identities: presence region: share of 'present' readings that abstain 0.385
- new_identities: presence region: share of true 'present' readings that abstain 0.385
- new_identities: presence region: present read present [pooled midpoint (comparison)] 0.667
- new_identities: determiner identity (outside FULL when the legend excludes it) 0.752
- new_identities: presence text: present read present 0.837
- new_identities: presence text: share of 'present' readings that abstain 0.276
- new_identities: presence text: share of true 'present' readings that abstain 0.243
- new_identities: presence relation: share of 'present' readings that abstain 0.074
- new_identities: presence relation: share of true 'present' readings that abstain 0.074
- new_identities: presence landmark: present read present 0.593
- new_identities: presence text: present read present [pooled midpoint (comparison)] 0.845
- new_identities: presence relation: present read present [pooled midpoint (comparison)] 0.725
- new_identities: presence landmark: present read present [pooled midpoint (comparison)] 0.549
- new_identities: presence object: absent read absent 0.444
- new_identities: presence object: share of FALSE 'present' readings that abstain 0.200
- new_identities: presence text: share of FALSE 'present' readings that abstain 0.538
- new_identities: presence source: present read present 0.556
- new_identities: presence target: present read present 0.593
- new_identities: presence object: absent read absent [pooled midpoint (comparison)] 0.429
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.500
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.708
- new_identities: presence style: share of 'present' readings that abstain 0.833
- new_identities: presence style: share of FALSE 'present' readings that abstain 0.818
- new_identities: presence size: share of 'present' readings that abstain 0.455
- new_identities: presence landmark: share of 'present' readings that abstain 0.526
- new_identities: presence landmark: share of true 'present' readings that abstain 0.486
- new_identities: presence size: share of true 'present' readings that abstain 0.150
- new_identities: presence target: share of FALSE 'present' readings that abstain 0.750
- new_identities: presence color: present read present 0.667
- new_identities: presence color: share of 'present' readings that abstain 0.786
- new_identities: presence color: share of true 'present' readings that abstain 0.250
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.500
- new_identities: presence source: share of 'present' readings that abstain 0.895
- new_identities: presence source: share of true 'present' readings that abstain 0.867
- new_identities: presence quantity: share of 'present' readings that abstain 0.667
- new_identities: presence quantity: share of FALSE 'present' readings that abstain 0.667
- new_identities_en: FULL 0.315
- new_identities_en: presence object: present read present 0.820
- new_identities_en: presence object: share of 'present' readings that abstain 0.092
- new_identities_en: presence object: share of true 'present' readings that abstain 0.095
- new_identities_en: presence size: share of 'present' readings that abstain 0.429
- new_identities_en: presence size: share of true 'present' readings that abstain 0.263
- new_identities_en: presence text: absent read absent 0.899
- new_identities_en: presence amount: present read present 0.774
- new_identities_en: presence amount: share of 'present' readings that abstain 0.319
- new_identities_en: presence amount: share of true 'present' readings that abstain 0.319
- new_identities_en: presence unit: present read present 0.882
- new_identities_en: structure (depth, negation) 0.745
- new_identities_en: predicate (surface lemma) 0.752
- new_identities_en: event type (synonym table) 0.752
- new_identities_en: role object 0.532
- new_identities_en: head object 0.568
- new_identities_en: occupancy: known filler 0.774
- new_identities_en: role text 0.797
- new_identities_en: head text 0.797
- new_identities_en: role landmark 0.868
- new_identities_en: occupancy: unknown filler 0.556
- new_identities_en: heads FULL (model) 0.355
- new_identities_en: heads FULL (lexical order baseline) 0.000
- new_identities_en: heads FULL (lexical bag baseline, trained on the same training rows) 0.125
- new_identities_en: FULL [depth given] 0.315
- new_identities_en: FULL [depth and negation given] 0.315
- new_identities_en: FULL [pooled midpoint (comparison)] 0.268
- new_identities_en: role object [pooled midpoint (comparison)] 0.463
- new_identities_en: role text [pooled midpoint (comparison)] 0.790
- new_identities_en: role landmark [pooled midpoint (comparison)] 0.868
- new_identities_en: role amount [pooled midpoint (comparison)] 0.882
- new_identities_en: heads FULL (model) [pooled midpoint (comparison)] 0.318
- new_identities_en: presence object: present read present [pooled midpoint (comparison)] 0.804
- new_identities_en: presence size: present read present [pooled midpoint (comparison)] 0.882
- new_identities_en: presence amount: present read present [pooled midpoint (comparison)] 0.631
- new_identities_en: presence unit: present read present [pooled midpoint (comparison)] 0.833
- new_identities_en: presence text: share of 'present' readings that abstain 0.207
- new_identities_en: presence text: share of true 'present' readings that abstain 0.146
- new_identities_en: presence text: share of FALSE 'present' readings that abstain 0.647
- new_identities_en: presence relation: share of 'present' readings that abstain 0.077
- new_identities_en: presence relation: share of true 'present' readings that abstain 0.077
- new_identities_en: presence landmark: present read present 0.700
- new_identities_en: presence anchor: share of 'present' readings that abstain 0.091
- new_identities_en: presence anchor: share of true 'present' readings that abstain 0.091
- new_identities_en: presence fraction: share of 'present' readings that abstain 0.250
- new_identities_en: presence fraction: share of true 'present' readings that abstain 0.250
- new_identities_en: presence source: present read present 0.783
- new_identities_en: presence target: present read present 0.696
- new_identities_en: determiner identity (outside FULL when the legend excludes it) 0.656
- new_identities_en: presence source: present read present [pooled midpoint (comparison)] 0.739
- new_identities_en: presence target: present read present [pooled midpoint (comparison)] 0.696
- new_identities_en: presence relation: present read present [pooled midpoint (comparison)] 0.824
- new_identities_en: presence landmark: present read present [pooled midpoint (comparison)] 0.716
- new_identities_en: presence landmark: share of 'present' readings that abstain 0.800
- new_identities_en: presence landmark: share of true 'present' readings that abstain 0.786
- new_identities_en: presence unit: share of 'present' readings that abstain 0.134
- new_identities_en: presence unit: share of true 'present' readings that abstain 0.134
- new_identities_en: presence region: share of 'present' readings that abstain 0.000
- new_identities_en: presence region: share of true 'present' readings that abstain 0.000
- new_identities_en: presence size: share of FALSE 'present' readings that abstain 0.778
- new_identities_en: presence direction: present read present 0.652
- new_identities_en: presence direction: share of 'present' readings that abstain 0.067
- new_identities_en: presence direction: share of true 'present' readings that abstain 0.067
- new_identities_en: presence direction: present read present [pooled midpoint (comparison)] 0.750
- new_identities_en: presence color: share of 'present' readings that abstain 0.846
- new_identities_en: presence object: absent read absent 0.111
- new_identities_en: presence object: share of FALSE 'present' readings that abstain 0.000
- new_identities_en: presence object: absent read absent [pooled midpoint (comparison)] 0.111
- new_identities_en: presence style: present read present 0.667
- new_identities_en: presence style: share of true 'present' readings that abstain 0.500
- new_identities_en: presence style: present read present [pooled midpoint (comparison)] 0.667
- new_identities_en: presence color: present read present 0.500
- new_identities_en: presence color: present read present [pooled midpoint (comparison)] 0.500
- new_identities_en: presence color: share of true 'present' readings that abstain 0.000
- train (sample): FULL 0.397
- train (sample): structure (depth, negation) 0.720
- train (sample): predicate (surface lemma) 0.720
- train (sample): event type (synonym table) 0.723
- train (sample): role object 0.520
- train (sample): head object 0.550
- train (sample): occupancy: known filler 0.664
- train (sample): heads FULL (model) 0.443
- train (sample): heads FULL (lexical order baseline) 0.020
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.493
- train (sample): FULL [depth given] 0.397
- train (sample): FULL [depth and negation given] 0.397
- train (sample): presence object: present read present 0.798
- train (sample): presence object: share of 'present' readings that abstain 0.050
- train (sample): presence object: share of true 'present' readings that abstain 0.052
- train (sample): presence source: present read present 0.559
- train (sample): presence target: present read present 0.862
- train (sample): presence target: share of 'present' readings that abstain 0.600
- train (sample): presence target: share of true 'present' readings that abstain 0.600
- train (sample): determiner identity (outside FULL when the legend excludes it) 0.564
- train (sample): presence region: share of 'present' readings that abstain 0.000
- train (sample): presence region: share of true 'present' readings that abstain 0.000
- train (sample): presence color: share of 'present' readings that abstain 0.762
- train (sample): presence anchor: share of 'present' readings that abstain 0.000
- train (sample): presence anchor: share of true 'present' readings that abstain 0.000
- train (sample): presence fraction: share of 'present' readings that abstain 0.429
- train (sample): presence fraction: share of true 'present' readings that abstain 0.429
- train (sample): presence object: absent read absent 0.708
- train (sample): presence object: share of FALSE 'present' readings that abstain 0.000
- train (sample): presence text: share of 'present' readings that abstain 0.105
- train (sample): presence text: share of true 'present' readings that abstain 0.105
- train (sample): presence source: share of 'present' readings that abstain 0.524
- train (sample): presence source: share of true 'present' readings that abstain 0.526
- train (sample): presence relation: share of 'present' readings that abstain 0.040
- train (sample): presence relation: share of true 'present' readings that abstain 0.040
- train (sample): presence landmark: share of 'present' readings that abstain 0.333
- train (sample): presence landmark: share of true 'present' readings that abstain 0.217
- train (sample): presence style: share of 'present' readings that abstain 0.800
- train (sample): presence style: share of FALSE 'present' readings that abstain 0.857
- train (sample): presence quantity: share of 'present' readings that abstain 0.000
- train (sample): presence quantity: share of true 'present' readings that abstain 0.000
- train (sample): presence size: share of 'present' readings that abstain 0.400
- train (sample): presence size: share of FALSE 'present' readings that abstain 0.750
- train (sample): presence layout: share of 'present' readings that abstain 0.000
- train (sample): presence layout: share of true 'present' readings that abstain 0.000
- train (sample): presence amount: share of 'present' readings that abstain 0.095
- train (sample): presence amount: share of true 'present' readings that abstain 0.095
- train (sample): presence unit: share of 'present' readings that abstain 0.143
- train (sample): presence unit: share of true 'present' readings that abstain 0.143
- train (sample): presence color: present read present 0.750
- train (sample): presence color: share of true 'present' readings that abstain 0.444
- train (sample): presence pairing: share of 'present' readings that abstain 0.200
- train (sample): presence pairing: share of true 'present' readings that abstain 0.200
- train (sample): presence direction: share of 'present' readings that abstain 0.333
- train (sample): presence direction: share of true 'present' readings that abstain 0.333
- train (sample): presence size: share of true 'present' readings that abstain 0.273
- train (sample): presence source: share of FALSE 'present' readings that abstain 0.500
- train (sample): presence axis: share of 'present' readings that abstain 0.000
- train (sample): presence axis: share of true 'present' readings that abstain 0.000
- train (sample): presence style: share of true 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_formulations: `as_vrea sa faci COMPONENT STYLE .` FULL 0.000 (n 3)
- new_identities_en: `rename LABEL to LABEL please` FULL 0.000 (n 3)
- heldout_formulations: `hai sa inseram NUM COMPONENT` FULL 0.000 (n 2)
- heldout_formulations: `muta COMPONENT STYLE FRACTION spre ANCHOR te rog` FULL 0.000 (n 2)
- heldout_formulations: `okay deci redenumeste COMPONENT in LABEL` FULL 0.000 (n 2)
- heldout_formulations: `vreau sa redenumiti COMPONENT in LABEL` FULL 0.000 (n 2)
- heldout_formulations_en: `delete QUANT COMPONENT please` FULL 0.000 (n 2)
- heldout_formulations_en: `would you connect the COMPONENT and the COMPONENT with a STYLE COMPONENT` FULL 0.000 (n 2)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role size | role style | role text | role relation | role landmark | role region | role anchor | role fraction | role amount | role unit | role direction | role axis | role layout | role pairing | role source | role target | role quantity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.351±0.030 | 0.288±0.033 | 0.438±0.059 | 0.960±0.015 | 0.943±0.014 | 0.933±0.019 | 0.933±0.004 | 0.964±0.013 | 0.913±0.014 | 0.993±0.004 | 0.958±0.007 | 0.953±0.009 | 0.996±0.002 | 0.996±0.005 | 1.000±0.000 | 0.996±0.004 | 0.999±0.002 | 1.000±0.000 | 0.853±0.002 | 0.896±0.016 | 0.938±0.006 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.346±0.025 | 0.277±0.022 | 0.410±0.010 | 0.992±0.007 | 0.947±0.015 | 0.929±0.018 | 0.931±0.004 | 0.943±0.009 | 0.908±0.008 | 0.983±0.009 | 0.954±0.008 | 0.951±0.009 | 0.996±0.004 | 0.994±0.005 | 1.000±0.000 | 0.997±0.002 | 0.999±0.002 | 0.999±0.002 | 0.858±0.004 | 0.899±0.017 | 0.937±0.008 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.427±0.008 | 0.353±0.015 | 0.699±0.018 | 0.768±0.002 | 0.854±0.003 | 0.893±0.000 | 0.944±0.005 | 1.000±0.000 | 0.845±0.021 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.983±0.013 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.985±0.000 | 1.000±0.000 | 0.830±0.000 | 0.878±0.014 | 0.983±0.013 |
| heldout_formulations_en | product readout: presence decided | 0.382±0.042 | 0.330±0.038 | 0.457±0.045 | 0.964±0.018 | 0.946±0.008 | 0.961±0.018 | 0.928±0.011 | 0.987±0.004 | 0.924±0.008 | 0.993±0.007 | 0.999±0.002 | 0.998±0.003 | 0.992±0.004 | 0.989±0.007 | 0.994±0.000 | 1.000±0.000 | 1.000±0.000 | 0.994±0.000 | 0.837±0.007 | 0.910±0.016 | 0.931±0.013 |
| heldout_formulations_en | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.372±0.023 | 0.311±0.012 | 0.428±0.010 | 0.987±0.014 | 0.945±0.009 | 0.947±0.018 | 0.928±0.007 | 0.984±0.004 | 0.927±0.008 | 0.990±0.006 | 1.000±0.000 | 0.999±0.002 | 0.981±0.003 | 0.985±0.003 | 0.994±0.000 | 1.000±0.000 | 1.000±0.000 | 0.994±0.000 | 0.840±0.010 | 0.912±0.016 | 0.929±0.015 |
| heldout_formulations_en | v16 protocol: every role read, not available to the product | 0.357±0.006 | 0.320±0.007 | 0.667±0.026 | 0.736±0.000 | 0.880±0.003 | 0.899±0.000 | 0.909±0.007 | 1.000±0.000 | 0.824±0.010 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.991±0.007 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.990±0.002 | 1.000±0.000 | 0.821±0.009 | 0.865±0.023 | 0.985±0.007 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 0.878±0.065 | 0.633±0.194 | 0.756±0.074 | 0.082±0.034 (0.000±0.000 / 0.083±0.034) |
| heldout_formulations | object | comparison: pooled midpoint | 0.878±0.021 | 0.760±0.131 | 0.819±0.065 |  |
| heldout_formulations | color | product: fitted | 1.000±0.000 | 0.943±0.020 | 0.971±0.010 | 0.923±0.071 (0.963±0.045 / 0.600±0.490) |
| heldout_formulations | color | comparison: pooled midpoint | 1.000±0.000 | 0.988±0.011 | 0.994±0.006 |  |
| heldout_formulations | size | product: fitted | 0.985±0.031 | 0.930±0.015 | 0.957±0.022 | 0.330±0.033 (0.665±0.057 / 0.129±0.034) |
| heldout_formulations | size | comparison: pooled midpoint | 0.985±0.031 | 0.941±0.016 | 0.963±0.021 |  |
| heldout_formulations | style | product: fitted | 0.775±0.252 | 0.944±0.023 | 0.859±0.128 | 0.969±0.062 (0.964±0.073 / 1.000±0.000) |
| heldout_formulations | style | comparison: pooled midpoint | 0.867±0.267 | 0.928±0.019 | 0.897±0.137 |  |
| heldout_formulations | text | product: fitted | 0.780±0.142 | 0.980±0.003 | 0.880±0.070 | 0.407±0.061 (0.300±0.163 / 0.437±0.044) |
| heldout_formulations | text | comparison: pooled midpoint | 0.811±0.022 | 0.979±0.004 | 0.895±0.010 |  |
| heldout_formulations | relation | product: fitted | 0.873±0.066 | 1.000±0.000 | 0.937±0.033 | 0.121±0.045 (— / 0.121±0.045) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.782±0.080 | 1.000±0.000 | 0.891±0.040 |  |
| heldout_formulations | landmark | product: fitted | 0.708±0.055 | 0.972±0.024 | 0.840±0.025 | 0.385±0.094 (1.000±0.000 / 0.270±0.086) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.659±0.074 | 0.981±0.015 | 0.820±0.034 |  |
| heldout_formulations | region | product: fitted | 0.950±0.041 | 1.000±0.000 | 0.975±0.020 | 0.303±0.142 (— / 0.303±0.142) |
| heldout_formulations | region | comparison: pooled midpoint | 0.792±0.138 | 1.000±0.000 | 0.896±0.069 |  |
| heldout_formulations | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.109±0.156 (— / 0.109±0.156) |
| heldout_formulations | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | fraction | product: fitted | 0.811±0.220 | 1.000±0.000 | 0.906±0.110 | 0.664±0.191 (— / 0.664±0.191) |
| heldout_formulations | fraction | comparison: pooled midpoint | 0.833±0.149 | 1.000±0.000 | 0.917±0.075 |  |
| heldout_formulations | amount | product: fitted | 0.925±0.061 | 0.999±0.003 | 0.962±0.030 | 0.133±0.013 (1.000 / 0.111±0.056) |
| heldout_formulations | amount | comparison: pooled midpoint | 0.921±0.064 | 1.000±0.000 | 0.961±0.032 |  |
| heldout_formulations | unit | product: fitted | 0.900±0.122 | 1.000±0.000 | 0.950±0.061 | 0.050±0.100 (— / 0.050±0.100) |
| heldout_formulations | unit | comparison: pooled midpoint | 0.871±0.112 | 1.000±0.000 | 0.936±0.056 |  |
| heldout_formulations | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | direction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.050±0.100 (— / 0.050±0.100) |
| heldout_formulations | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | layout | product: fitted | — | 0.999±0.003 | — | 0.000 (0.000 / —) |
| heldout_formulations | layout | comparison: pooled midpoint | — | 0.999±0.003 | — |  |
| heldout_formulations | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | source | product: fitted | 0.349±0.182 | 0.992±0.010 | 0.670±0.086 | 0.796±0.111 (1.000±0.000 / 0.788±0.110) |
| heldout_formulations | source | comparison: pooled midpoint | 0.367±0.158 | 1.000±0.000 | 0.684±0.079 |  |
| heldout_formulations | target | product: fitted | 0.747±0.088 | 0.997±0.007 | 0.872±0.045 | 0.796±0.091 (0.000 / 0.811±0.086) |
| heldout_formulations | target | comparison: pooled midpoint | 0.775±0.086 | 0.996±0.008 | 0.886±0.045 |  |
| heldout_formulations | quantity | product: fitted | 0.727±0.112 | 0.998±0.003 | 0.863±0.056 | 0.474±0.153 (1.000 / 0.462±0.165) |
| heldout_formulations | quantity | comparison: pooled midpoint | 0.686±0.097 | 0.998±0.003 | 0.842±0.049 |  |
| heldout_formulations_en | object | product: fitted | 0.898±0.055 | 1.000±0.000 | 0.949±0.028 | 0.062±0.015 (— / 0.062±0.015) |
| heldout_formulations_en | object | comparison: pooled midpoint | 0.881±0.016 | 1.000±0.000 | 0.940±0.008 |  |
| heldout_formulations_en | color | product: fitted | — | 0.949±0.025 | — | 0.983±0.033 (0.983±0.033 / —) |
| heldout_formulations_en | color | comparison: pooled midpoint | — | 0.980±0.020 | — |  |
| heldout_formulations_en | size | product: fitted | 0.735±0.157 | 0.959±0.019 | 0.847±0.073 | 0.576±0.161 (0.786±0.192 / 0.463±0.173) |
| heldout_formulations_en | size | comparison: pooled midpoint | 0.594±0.172 | 0.972±0.017 | 0.783±0.080 |  |
| heldout_formulations_en | style | product: fitted | 0.630±0.227 | 0.967±0.024 | 0.798±0.117 | 0.975±0.050 (0.964±0.062 / 1.000±0.000) |
| heldout_formulations_en | style | comparison: pooled midpoint | 0.640±0.265 | 0.946±0.024 | 0.793±0.133 |  |
| heldout_formulations_en | text | product: fitted | 0.988±0.025 | 0.954±0.011 | 0.971±0.013 | 0.197±0.088 (0.407±0.259 / 0.140±0.101) |
| heldout_formulations_en | text | comparison: pooled midpoint | 1.000±0.000 | 0.953±0.008 | 0.977±0.004 |  |
| heldout_formulations_en | relation | product: fitted | 0.989±0.022 | 1.000±0.000 | 0.994±0.011 | 0.117±0.060 (— / 0.117±0.060) |
| heldout_formulations_en | relation | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | landmark | product: fitted | 0.691±0.041 | 0.974±0.007 | 0.832±0.019 | 0.711±0.088 (1.000±0.000 / 0.645±0.116) |
| heldout_formulations_en | landmark | comparison: pooled midpoint | 0.661±0.064 | 0.987±0.005 | 0.824±0.033 |  |
| heldout_formulations_en | region | product: fitted | 0.965±0.043 | 1.000±0.000 | 0.983±0.021 | 0.031±0.062 (— / 0.031±0.062) |
| heldout_formulations_en | region | comparison: pooled midpoint | 0.903±0.060 | 1.000±0.000 | 0.951±0.030 |  |
| heldout_formulations_en | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | fraction | product: fitted | 0.978±0.044 | 1.000±0.000 | 0.989±0.022 | 0.136±0.163 (— / 0.136±0.163) |
| heldout_formulations_en | fraction | comparison: pooled midpoint | 0.978±0.044 | 1.000±0.000 | 0.989±0.022 |  |
| heldout_formulations_en | amount | product: fitted | 0.790±0.128 | 0.998±0.003 | 0.894±0.064 | 0.440±0.278 (1.000 / 0.410±0.289) |
| heldout_formulations_en | amount | comparison: pooled midpoint | 0.413±0.185 | 1.000±0.000 | 0.707±0.092 |  |
| heldout_formulations_en | unit | product: fitted | 0.620±0.240 | 1.000±0.000 | 0.810±0.120 | 0.140±0.196 (— / 0.140±0.196) |
| heldout_formulations_en | unit | comparison: pooled midpoint | 0.583±0.123 | 1.000±0.000 | 0.792±0.061 |  |
| heldout_formulations_en | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations_en | direction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations_en | axis | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations_en | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations_en | layout | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations_en | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations_en | pairing | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations_en | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations_en | source | product: fitted | 0.922±0.035 | 0.978±0.008 | 0.950±0.014 | 0.945±0.039 (0.733±0.226 / 0.966±0.032) |
| heldout_formulations_en | source | comparison: pooled midpoint | 0.952±0.031 | 0.982±0.010 | 0.967±0.012 |  |
| heldout_formulations_en | target | product: fitted | 0.922±0.043 | 0.988±0.012 | 0.955±0.019 | 0.795±0.053 (0.833±0.236 / 0.794±0.059) |
| heldout_formulations_en | target | comparison: pooled midpoint | 0.944±0.041 | 0.988±0.012 | 0.966±0.018 |  |
| heldout_formulations_en | quantity | product: fitted | 0.933±0.133 | 0.995±0.004 | 0.964±0.067 | 0.290±0.037 (1.000±0.000 / 0.152±0.139) |
| heldout_formulations_en | quantity | comparison: pooled midpoint | 0.960±0.080 | 0.988±0.008 | 0.974±0.039 |  |
| heldout_sentences | object | product: fitted | 0.792±0.095 | 0.700±0.041 | 0.746±0.043 | 0.065±0.016 (0.000±0.000 / 0.067±0.017) |
| heldout_sentences | object | comparison: pooled midpoint | 0.802±0.033 | 0.700±0.041 | 0.751±0.031 |  |
| heldout_sentences | color | product: fitted | 1.000±0.000 | 0.987±0.006 | 0.994±0.003 | 0.367±0.194 (0.750±0.433 / 0.267±0.133) |
| heldout_sentences | color | comparison: pooled midpoint | 1.000±0.000 | 0.994±0.008 | 0.997±0.004 |  |
| heldout_sentences | size | product: fitted | 0.883±0.145 | 0.974±0.008 | 0.929±0.075 | 0.327±0.185 (0.500±0.447 / 0.207±0.112) |
| heldout_sentences | size | comparison: pooled midpoint | 0.860±0.196 | 0.980±0.008 | 0.920±0.097 |  |
| heldout_sentences | style | product: fitted | 0.700±0.400 | 0.976±0.012 | 0.838±0.198 | 0.900±0.200 (1.000±0.000 / 0.750±0.433) |
| heldout_sentences | style | comparison: pooled midpoint | 1.000±0.000 | 0.971±0.013 | 0.985±0.006 |  |
| heldout_sentences | text | product: fitted | 0.813±0.108 | 0.996±0.008 | 0.904±0.051 | 0.227±0.076 (0.000 / 0.235±0.088) |
| heldout_sentences | text | comparison: pooled midpoint | 0.815±0.062 | 0.996±0.007 | 0.906±0.030 |  |
| heldout_sentences | relation | product: fitted | 0.931±0.057 | 1.000±0.000 | 0.965±0.028 | 0.073±0.093 (— / 0.073±0.093) |
| heldout_sentences | relation | comparison: pooled midpoint | 0.721±0.129 | 1.000±0.000 | 0.861±0.064 |  |
| heldout_sentences | landmark | product: fitted | 0.714±0.127 | 0.984±0.017 | 0.849±0.056 | 0.349±0.157 (0.889±0.157 / 0.285±0.141) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.668±0.059 | 0.993±0.009 | 0.830±0.034 |  |
| heldout_sentences | region | product: fitted | 0.911±0.083 | 1.000±0.000 | 0.956±0.042 | 0.057±0.114 (— / 0.057±0.114) |
| heldout_sentences | region | comparison: pooled midpoint | 0.950±0.061 | 1.000±0.000 | 0.975±0.031 |  |
| heldout_sentences | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.100±0.200 (— / 0.100±0.200) |
| heldout_sentences | anchor | comparison: pooled midpoint | 0.933±0.133 | 1.000±0.000 | 0.967±0.067 |  |
| heldout_sentences | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | amount | product: fitted | 0.950±0.100 | 1.000±0.000 | 0.975±0.050 | 0.080±0.160 (— / 0.080±0.160) |
| heldout_sentences | amount | comparison: pooled midpoint | 0.850±0.122 | 1.000±0.000 | 0.925±0.061 |  |
| heldout_sentences | unit | product: fitted | 0.950±0.100 | 1.000±0.000 | 0.975±0.050 | 0.050±0.100 (— / 0.050±0.100) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.900±0.122 | 1.000±0.000 | 0.950±0.061 |  |
| heldout_sentences | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.167±0.000 (— / 0.167±0.000) |
| heldout_sentences | direction | comparison: pooled midpoint | 0.967±0.067 | 1.000±0.000 | 0.983±0.033 |  |
| heldout_sentences | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.100±0.200 (— / 0.100±0.200) |
| heldout_sentences | axis | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | layout | product: fitted | 0.800±0.163 | 1.000±0.000 | 0.900±0.082 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | layout | comparison: pooled midpoint | 0.800±0.163 | 1.000±0.000 | 0.900±0.082 |  |
| heldout_sentences | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | source | product: fitted | 0.500±0.162 | 0.987±0.012 | 0.743±0.078 | 0.917±0.105 (1.000±0.000 / 0.910±0.111) |
| heldout_sentences | source | comparison: pooled midpoint | 0.499±0.126 | 0.993±0.009 | 0.746±0.060 |  |
| heldout_sentences | target | product: fitted | 0.850±0.184 | 1.000±0.000 | 0.925±0.092 | 0.761±0.156 (— / 0.761±0.156) |
| heldout_sentences | target | comparison: pooled midpoint | 0.946±0.066 | 0.993±0.014 | 0.970±0.038 |  |
| heldout_sentences | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.667±0.471 (— / 0.667±0.471) |
| heldout_sentences | quantity | comparison: pooled midpoint | 1.000±0.000 | 0.997±0.006 | 0.997±0.004 |  |
| mixed | object | product: fitted | 0.827±0.081 | 0.582±0.143 | 0.704±0.041 | 0.074±0.013 (0.087±0.077 / 0.073±0.013) |
| mixed | object | comparison: pooled midpoint | 0.817±0.013 | 0.600±0.089 | 0.709±0.050 |  |
| mixed | color | product: fitted | 0.914±0.012 | 0.965±0.009 | 0.939±0.009 | 0.743±0.039 (0.982±0.036 / 0.539±0.129) |
| mixed | color | comparison: pooled midpoint | 0.878±0.116 | 0.987±0.004 | 0.933±0.058 |  |
| mixed | size | product: fitted | 0.922±0.039 | 0.964±0.007 | 0.943±0.018 | 0.356±0.117 (0.631±0.150 / 0.115±0.133) |
| mixed | size | comparison: pooled midpoint | 0.903±0.058 | 0.971±0.009 | 0.937±0.027 |  |
| mixed | style | product: fitted | 0.660±0.228 | 0.961±0.014 | 0.810±0.109 | 0.931±0.084 (0.943±0.079 / 0.920±0.160) |
| mixed | style | comparison: pooled midpoint | 0.787±0.161 | 0.949±0.015 | 0.868±0.080 |  |
| mixed | text | product: fitted | 0.792±0.078 | 0.986±0.006 | 0.889±0.040 | 0.289±0.086 (0.117±0.145 / 0.305±0.091) |
| mixed | text | comparison: pooled midpoint | 0.840±0.082 | 0.984±0.011 | 0.912±0.036 |  |
| mixed | relation | product: fitted | 0.909±0.076 | 1.000±0.000 | 0.954±0.038 | 0.134±0.068 (— / 0.134±0.068) |
| mixed | relation | comparison: pooled midpoint | 0.706±0.057 | 1.000±0.000 | 0.853±0.028 |  |
| mixed | landmark | product: fitted | 0.691±0.115 | 0.980±0.005 | 0.836±0.056 | 0.415±0.038 (1.000±0.000 / 0.317±0.036) |
| mixed | landmark | comparison: pooled midpoint | 0.683±0.072 | 0.990±0.007 | 0.837±0.035 |  |
| mixed | region | product: fitted | 0.835±0.098 | 1.000±0.000 | 0.917±0.049 | 0.283±0.050 (— / 0.283±0.050) |
| mixed | region | comparison: pooled midpoint | 0.661±0.076 | 1.000±0.000 | 0.831±0.038 |  |
| mixed | anchor | product: fitted | 0.945±0.048 | 1.000±0.000 | 0.973±0.024 | 0.080±0.051 (— / 0.080±0.051) |
| mixed | anchor | comparison: pooled midpoint | 0.913±0.049 | 1.000±0.000 | 0.957±0.024 |  |
| mixed | fraction | product: fitted | 0.950±0.100 | 1.000±0.000 | 0.975±0.050 | 0.272±0.202 (— / 0.272±0.202) |
| mixed | fraction | comparison: pooled midpoint | 0.950±0.100 | 1.000±0.000 | 0.975±0.050 |  |
| mixed | amount | product: fitted | 0.974±0.013 | 0.999±0.002 | 0.987±0.007 | 0.140±0.048 (1.000 / 0.135±0.042) |
| mixed | amount | comparison: pooled midpoint | 0.914±0.026 | 1.000±0.000 | 0.957±0.013 |  |
| mixed | unit | product: fitted | 0.980±0.016 | 1.000±0.000 | 0.990±0.008 | 0.020±0.016 (— / 0.020±0.016) |
| mixed | unit | comparison: pooled midpoint | 0.947±0.016 | 1.000±0.000 | 0.974±0.008 |  |
| mixed | direction | product: fitted | 0.865±0.097 | 1.000±0.000 | 0.933±0.048 | 0.105±0.062 (— / 0.105±0.062) |
| mixed | direction | comparison: pooled midpoint | 0.861±0.046 | 1.000±0.000 | 0.930±0.023 |  |
| mixed | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.215±0.143 (— / 0.215±0.143) |
| mixed | axis | comparison: pooled midpoint | 0.971±0.057 | 1.000±0.000 | 0.986±0.029 |  |
| mixed | layout | product: fitted | 0.813±0.068 | 1.000±0.000 | 0.906±0.034 | 0.148±0.064 (— / 0.148±0.064) |
| mixed | layout | comparison: pooled midpoint | 0.766±0.055 | 1.000±0.000 | 0.883±0.027 |  |
| mixed | pairing | product: fitted | 0.953±0.060 | 1.000±0.000 | 0.977±0.030 | 0.245±0.160 (— / 0.245±0.160) |
| mixed | pairing | comparison: pooled midpoint | 0.982±0.036 | 1.000±0.000 | 0.991±0.018 |  |
| mixed | source | product: fitted | 0.371±0.194 | 0.992±0.006 | 0.681±0.098 | 0.779±0.104 (0.792±0.217 / 0.769±0.120) |
| mixed | source | comparison: pooled midpoint | 0.354±0.118 | 0.995±0.003 | 0.674±0.060 |  |
| mixed | target | product: fitted | 0.713±0.081 | 0.999±0.002 | 0.856±0.041 | 0.702±0.044 (1.000 / 0.697±0.049) |
| mixed | target | comparison: pooled midpoint | 0.730±0.064 | 0.997±0.004 | 0.864±0.032 |  |
| mixed | quantity | product: fitted | 0.780±0.227 | 0.998±0.002 | 0.889±0.113 | 0.240±0.248 (0.667±0.471 / 0.180±0.183) |
| mixed | quantity | comparison: pooled midpoint | 0.827±0.183 | 0.992±0.005 | 0.909±0.093 |  |
| new_identities | object | product: fitted | 0.815±0.091 | 0.366±0.070 | 0.591±0.064 | 0.062±0.023 (0.107±0.137 / 0.061±0.025) |
| new_identities | object | comparison: pooled midpoint | 0.832±0.015 | 0.316±0.074 | 0.574±0.042 |  |
| new_identities | color | product: fitted | 0.619±0.060 | 0.974±0.014 | 0.797±0.033 | 0.810±0.078 (1.000±0.000 / 0.510±0.174) |
| new_identities | color | comparison: pooled midpoint | 0.586±0.070 | 0.994±0.004 | 0.790±0.035 |  |
| new_identities | size | product: fitted | 0.928±0.021 | 0.959±0.017 | 0.943±0.012 | 0.389±0.127 (0.714±0.178 / 0.214±0.068) |
| new_identities | size | comparison: pooled midpoint | 0.898±0.066 | 0.968±0.013 | 0.933±0.029 |  |
| new_identities | style | product: fitted | 1.000±0.000 | 0.971±0.019 | 0.985±0.010 | 0.967±0.067 (0.964±0.073 / 1.000±0.000) |
| new_identities | style | comparison: pooled midpoint | 1.000±0.000 | 0.960±0.009 | 0.980±0.004 |  |
| new_identities | text | product: fitted | 0.838±0.070 | 0.925±0.019 | 0.881±0.031 | 0.326±0.076 (0.497±0.118 / 0.304±0.076) |
| new_identities | text | comparison: pooled midpoint | 0.867±0.027 | 0.925±0.012 | 0.896±0.015 |  |
| new_identities | relation | product: fitted | 0.915±0.026 | 1.000±0.000 | 0.958±0.013 | 0.092±0.024 (— / 0.092±0.024) |
| new_identities | relation | comparison: pooled midpoint | 0.704±0.076 | 1.000±0.000 | 0.852±0.038 |  |
| new_identities | landmark | product: fitted | 0.656±0.061 | 0.981±0.009 | 0.818±0.026 | 0.464±0.049 (0.900±0.200 / 0.413±0.059) |
| new_identities | landmark | comparison: pooled midpoint | 0.538±0.079 | 0.994±0.002 | 0.766±0.040 |  |
| new_identities | region | product: fitted | 0.825±0.080 | 1.000±0.000 | 0.913±0.040 | 0.278±0.113 (— / 0.278±0.113) |
| new_identities | region | comparison: pooled midpoint | 0.700±0.126 | 1.000±0.000 | 0.850±0.063 |  |
| new_identities | anchor | product: fitted | 0.983±0.033 | 1.000±0.000 | 0.992±0.017 | 0.070±0.064 (— / 0.070±0.064) |
| new_identities | anchor | comparison: pooled midpoint | 0.941±0.048 | 1.000±0.000 | 0.971±0.024 |  |
| new_identities | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.173±0.150 (— / 0.173±0.150) |
| new_identities | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | amount | product: fitted | 0.963±0.008 | 1.000±0.000 | 0.982±0.004 | 0.297±0.048 (— / 0.297±0.048) |
| new_identities | amount | comparison: pooled midpoint | 0.936±0.012 | 1.000±0.000 | 0.968±0.006 |  |
| new_identities | unit | product: fitted | 0.970±0.017 | 1.000±0.000 | 0.985±0.009 | 0.038±0.025 (— / 0.038±0.025) |
| new_identities | unit | comparison: pooled midpoint | 0.953±0.024 | 1.000±0.000 | 0.976±0.012 |  |
| new_identities | direction | product: fitted | 0.922±0.068 | 1.000±0.000 | 0.961±0.034 | 0.063±0.037 (— / 0.063±0.037) |
| new_identities | direction | comparison: pooled midpoint | 0.951±0.032 | 1.000±0.000 | 0.975±0.016 |  |
| new_identities | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | source | product: fitted | 0.498±0.084 | 0.986±0.006 | 0.742±0.040 | 0.908±0.062 (0.950±0.100 / 0.896±0.060) |
| new_identities | source | comparison: pooled midpoint | 0.495±0.067 | 0.996±0.004 | 0.745±0.033 |  |
| new_identities | target | product: fitted | 0.536±0.047 | 0.995±0.005 | 0.766±0.022 | 0.900±0.080 (0.938±0.108 / 0.904±0.096) |
| new_identities | target | comparison: pooled midpoint | 0.611±0.097 | 0.993±0.003 | 0.802±0.049 |  |
| new_identities | quantity | product: fitted | — | 0.990±0.001 | — | 0.767±0.200 (0.767±0.200 / —) |
| new_identities | quantity | comparison: pooled midpoint | — | 0.987±0.003 | — |  |
| new_identities_en | object | product: fitted | 0.769±0.098 | 0.095±0.141 | 0.432±0.029 | 0.106±0.016 (0.029±0.057 / 0.108±0.015) |
| new_identities_en | object | comparison: pooled midpoint | 0.789±0.025 | 0.062±0.081 | 0.426±0.039 |  |
| new_identities_en | color | product: fitted | 0.750±0.158 | 0.984±0.013 | 0.867±0.084 | 0.833±0.116 (1.000±0.000 / 0.587±0.325) |
| new_identities_en | color | comparison: pooled midpoint | 0.600±0.122 | 0.994±0.007 | 0.797±0.063 |  |
| new_identities_en | size | product: fitted | 0.913±0.076 | 0.981±0.011 | 0.947±0.035 | 0.348±0.060 (0.825±0.121 / 0.235±0.077) |
| new_identities_en | size | comparison: pooled midpoint | 0.912±0.043 | 0.989±0.006 | 0.951±0.019 |  |
| new_identities_en | style | product: fitted | 0.933±0.133 | 0.968±0.023 | 0.951±0.073 | 0.904±0.124 (1.000±0.000 / 0.600±0.374) |
| new_identities_en | style | comparison: pooled midpoint | 0.933±0.133 | 0.950±0.024 | 0.941±0.070 |  |
| new_identities_en | text | product: fitted | 0.896±0.036 | 0.902±0.036 | 0.899±0.012 | 0.243±0.039 (0.488±0.092 / 0.204±0.050) |
| new_identities_en | text | comparison: pooled midpoint | 0.913±0.012 | 0.904±0.019 | 0.908±0.008 |  |
| new_identities_en | relation | product: fitted | 0.975±0.014 | 1.000±0.000 | 0.987±0.007 | 0.068±0.014 (— / 0.068±0.014) |
| new_identities_en | relation | comparison: pooled midpoint | 0.864±0.026 | 1.000±0.000 | 0.932±0.013 |  |
| new_identities_en | landmark | product: fitted | 0.770±0.059 | 0.967±0.028 | 0.868±0.033 | 0.725±0.063 (0.975±0.050 / 0.697±0.067) |
| new_identities_en | landmark | comparison: pooled midpoint | 0.751±0.046 | 0.988±0.002 | 0.870±0.023 |  |
| new_identities_en | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.012±0.024 (— / 0.012±0.024) |
| new_identities_en | region | comparison: pooled midpoint | 0.975±0.031 | 1.000±0.000 | 0.988±0.015 |  |
| new_identities_en | anchor | product: fitted | 0.985±0.031 | 1.000±0.000 | 0.992±0.015 | 0.052±0.067 (— / 0.052±0.067) |
| new_identities_en | anchor | comparison: pooled midpoint | 0.980±0.040 | 1.000±0.000 | 0.990±0.020 |  |
| new_identities_en | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.210±0.180 (— / 0.210±0.180) |
| new_identities_en | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities_en | amount | product: fitted | 0.882±0.071 | 1.000±0.000 | 0.941±0.035 | 0.310±0.085 (— / 0.310±0.085) |
| new_identities_en | amount | comparison: pooled midpoint | 0.760±0.069 | 1.000±0.000 | 0.880±0.034 |  |
| new_identities_en | unit | product: fitted | 0.883±0.053 | 1.000±0.000 | 0.941±0.027 | 0.118±0.042 (— / 0.118±0.042) |
| new_identities_en | unit | comparison: pooled midpoint | 0.819±0.086 | 1.000±0.000 | 0.909±0.043 |  |
| new_identities_en | direction | product: fitted | 0.794±0.092 | 1.000±0.000 | 0.897±0.046 | 0.137±0.058 (— / 0.137±0.058) |
| new_identities_en | direction | comparison: pooled midpoint | 0.752±0.080 | 1.000±0.000 | 0.876±0.040 |  |
| new_identities_en | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities_en | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | layout | product: fitted | — | 0.999±0.003 | — | 0.500 (0.500 / —) |
| new_identities_en | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities_en | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities_en | source | product: fitted | 0.703±0.065 | 0.979±0.013 | 0.841±0.030 | 0.953±0.078 (0.900±0.200 / 0.958±0.060) |
| new_identities_en | source | comparison: pooled midpoint | 0.673±0.050 | 0.987±0.006 | 0.830±0.024 |  |
| new_identities_en | target | product: fitted | 0.686±0.028 | 0.996±0.004 | 0.841±0.014 | 0.923±0.078 (0.667±0.471 / 0.934±0.062) |
| new_identities_en | target | comparison: pooled midpoint | 0.676±0.023 | 0.994±0.007 | 0.835±0.011 |  |
| new_identities_en | quantity | product: fitted | — | 0.980±0.013 | — | 0.876±0.103 (0.876±0.103 / —) |
| new_identities_en | quantity | comparison: pooled midpoint | — | 0.971±0.015 | — |  |
| train (sample) | object | product: fitted | 0.738±0.122 | 0.685±0.051 | 0.711±0.042 | 0.068±0.019 (0.054±0.066 / 0.069±0.018) |
| train (sample) | color | product: fitted | 0.889±0.083 | 0.971±0.020 | 0.930±0.047 | 0.680±0.108 (1.000±0.000 / 0.537±0.110) |
| train (sample) | size | product: fitted | 0.969±0.042 | 0.973±0.010 | 0.971±0.021 | 0.362±0.070 (0.726±0.033 / 0.272±0.069) |
| train (sample) | style | product: fitted | 1.000±0.000 | 0.949±0.024 | 0.974±0.012 | 0.935±0.083 (0.945±0.068 / 0.800±0.400) |
| train (sample) | text | product: fitted | 0.882±0.066 | 0.995±0.005 | 0.939±0.032 | 0.227±0.097 (0.667±0.236 / 0.212±0.094) |
| train (sample) | relation | product: fitted | 0.976±0.031 | 1.000±0.000 | 0.988±0.016 | 0.034±0.032 (— / 0.034±0.032) |
| train (sample) | landmark | product: fitted | 0.951±0.040 | 0.982±0.016 | 0.967±0.015 | 0.346±0.090 (0.917±0.144 / 0.274±0.053) |
| train (sample) | region | product: fitted | 0.992±0.017 | 1.000±0.000 | 0.996±0.008 | 0.052±0.048 (— / 0.052±0.048) |
| train (sample) | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.260±0.143 (— / 0.260±0.143) |
| train (sample) | amount | product: fitted | 0.946±0.034 | 1.000±0.000 | 0.973±0.017 | 0.087±0.041 (— / 0.087±0.041) |
| train (sample) | unit | product: fitted | 0.974±0.035 | 1.000±0.000 | 0.987±0.017 | 0.074±0.056 (— / 0.074±0.056) |
| train (sample) | direction | product: fitted | 0.969±0.025 | 1.000±0.000 | 0.985±0.013 | 0.210±0.065 (— / 0.210±0.065) |
| train (sample) | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.040±0.080 (— / 0.040±0.080) |
| train (sample) | pairing | product: fitted | 0.950±0.100 | 1.000±0.000 | 0.975±0.050 | 0.130±0.108 (— / 0.130±0.108) |
| train (sample) | source | product: fitted | 0.670±0.091 | 0.997±0.004 | 0.833±0.047 | 0.622±0.105 (0.750±0.250 / 0.620±0.103) |
| train (sample) | target | product: fitted | 0.760±0.063 | 1.000±0.000 | 0.880±0.031 | 0.513±0.086 (— / 0.513±0.086) |
| train (sample) | quantity | product: fitted | 1.000±0.000 | 0.999±0.002 | 0.999±0.001 | 0.217±0.194 (1.000 / 0.183±0.153) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
