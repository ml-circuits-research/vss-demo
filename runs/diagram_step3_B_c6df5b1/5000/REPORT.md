# REPORT — world `diagram`, legend sha256:0fcc87608bb4… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
5800 annotated sentences from 3 files; provenance: {'generator': 5800}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/5000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 223 sentences
- heldout_formulations: 177 sentences
- heldout_sentences: 469 sentences
- new_identities: 400 sentences
- train: 4531 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['250', '35', '45', '90', 'analytics', 'broker', 'crawler', 'dashboard', 'gamma_ray', 'indexer', 'ingest', 'irina', 'loyalty', 'notifications', 'payroll', 'recommendations', 'registry', 'returns', 'routing', 'theta', 'tracking', 'vault', 'victor', 'zeta']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
46763 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit c6df5b1. Memory curve: runs/5000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 0.764 [rule: fit; pooled midpoint 0.795 (comparison)] (present 1.108, n 539 / absent 0.481, n 84)
- attr_presence:object: threshold 0.512 [rule: fit; pooled midpoint 0.607 (comparison)] (present 1.030, n 213 / absent 0.185, n 326)
- det_presence:object: threshold 0.746 [rule: fit; pooled midpoint 0.661 (comparison)] (present 1.214, n 179 / absent 0.109, n 360)
- presence:color: threshold 0.245 [rule: fit; pooled midpoint 0.470 (comparison)] (present 0.883, n 25 / absent 0.057, n 598)
- presence:size: threshold 0.296 [rule: fit; pooled midpoint 0.366 (comparison)] (present 0.637, n 56 / absent 0.095, n 567)
- presence:style: threshold 0.114 [rule: fit; pooled midpoint 0.141 (comparison)] (present 0.262, n 18 / absent 0.020, n 605)
- presence:text: threshold 0.202 [rule: fit; pooled midpoint 0.336 (comparison)] (present 0.599, n 80 / absent 0.074, n 543)
- presence:relation: threshold 0.194 [rule: fit; pooled midpoint 0.368 (comparison)] (present 0.734, n 73 / absent 0.001, n 550)
- presence:landmark: threshold 0.261 [rule: fit; pooled midpoint 0.469 (comparison)] (present 0.863, n 73 / absent 0.074, n 550)
- presence:region: threshold 0.558 [rule: fit; pooled midpoint 0.662 (comparison)] (present 1.272, n 48 / absent 0.051, n 575)
- presence:anchor: threshold 0.436 [rule: fit; pooled midpoint 0.462 (comparison)] (present 0.898, n 31 / absent 0.026, n 592)
- presence:fraction: threshold 0.352 [rule: fit; pooled midpoint 0.389 (comparison)] (present 0.729, n 21 / absent 0.048, n 602)
- presence:amount: threshold 0.106 [rule: fit; pooled midpoint 0.297 (comparison)] (present 0.598, n 37 / absent -0.004, n 586)
- presence:unit: threshold 0.199 [rule: fit; pooled midpoint 0.359 (comparison)] (present 0.661, n 37 / absent 0.057, n 586)
- presence:direction: threshold 0.241 [rule: fit; pooled midpoint 0.296 (comparison)] (present 0.567, n 27 / absent 0.025, n 596)
- presence:axis: threshold 0.306 [rule: fit; pooled midpoint 0.400 (comparison)] (present 0.770, n 13 / absent 0.031, n 610)
- presence:layout: threshold 0.451 [rule: fit; pooled midpoint 0.528 (comparison)] (present 1.048, n 21 / absent 0.009, n 602)
- presence:pairing: threshold 0.271 [rule: fit; pooled midpoint 0.267 (comparison)] (present 0.527, n 14 / absent 0.008, n 609)
- presence:source: threshold 0.266 [rule: fit; pooled midpoint 0.427 (comparison)] (present 0.797, n 72 / absent 0.057, n 551)
- presence:target: threshold 0.440 [rule: fit; pooled midpoint 0.507 (comparison)] (present 0.928, n 58 / absent 0.086, n 565)
- presence:edge: threshold 0.221 [rule: fit; pooled midpoint 0.390 (comparison)] (present 0.809, n 48 / absent -0.029, n 575)
- presence:quantity: threshold 0.084 [rule: fit; pooled midpoint 0.088 (comparison)] (present 0.184, n 18 / absent -0.008, n 605)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.005, color 0.083, size 0.143, style 0.200, text 0.013, relation 0.167, landmark 0.006, region 0.111, anchor 0.250, fraction 0.333, amount 0.043, unit 0.500, direction 0.167, axis 0.500, layout 0.143, pairing 0.500, source 0.006, target 0.006, edge 0.125, quantity 0.043, predicate 0.019

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 177 of 177)
| axis | accuracy |
|---|---|
| FULL | 0.640±0.011 |
| FULL [depth given] | 0.640±0.011 |
| FULL [depth and negation given] | 0.640±0.011 |
| FULL [presence not decided] | 0.452±0.005 |
| FULL [pooled midpoint (comparison)] | 0.637±0.005 |
| presence object: present read present | 0.749±0.013 |
| presence color: absent read absent | 0.983±0.005 |
| presence size: absent read absent | 0.988±0.005 |
| presence style: absent read absent | 0.998±0.003 |
| presence text: absent read absent | 0.974±0.011 |
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
| structure (depth, negation) | 0.996±0.003 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.996±0.003 |
| event type (synonym table) | 0.996±0.003 |
| role object | 0.755±0.012 |
| head object | 0.766±0.015 |
| lexical order head object | 0.808±0.000 |
| lexical bag head object | 0.774±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.787±0.015 |
| occupancy: known filler | 0.855±0.007 |
| role color | 0.983±0.005 |
| head color | 0.983±0.005 |
| lexical order head color | 1.000±0.000 |
| lexical bag head color | 0.994±0.000 |
| occupancy: not given | 0.996±0.001 |
| role size | 0.987±0.005 |
| head size | 0.987±0.005 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.960±0.000 |
| role style | 0.989±0.005 |
| head style | 0.989±0.005 |
| lexical order head style | 0.972±0.000 |
| lexical bag head style | 0.972±0.000 |
| role text | 0.977±0.009 |
| head text | 0.977±0.009 |
| lexical order head text | 0.864±0.000 |
| lexical bag head text | 0.915±0.000 |
| role relation | 0.981±0.003 |
| head relation | 0.981±0.003 |
| lexical order head relation | 0.881±0.000 |
| lexical bag head relation | 0.881±0.000 |
| role landmark | 0.964±0.007 |
| head landmark | 0.976±0.007 |
| lexical order head landmark | 0.881±0.000 |
| lexical bag head landmark | 0.864±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.927±0.000 |
| lexical bag head region | 0.927±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.949±0.000 |
| lexical bag head anchor | 0.983±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.949±0.000 |
| lexical bag head fraction | 0.960±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.972±0.000 |
| lexical bag head amount | 0.972±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.972±0.000 |
| lexical bag head unit | 0.972±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
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
| role source | 0.951±0.007 |
| head source | 0.966±0.009 |
| lexical order head source | 0.831±0.000 |
| lexical bag head source | 0.831±0.000 |
| role target | 0.942±0.005 |
| head target | 0.979±0.005 |
| lexical order head target | 0.836±0.000 |
| lexical bag head target | 0.836±0.000 |
| role edge | 0.974±0.010 |
| head edge | 0.991±0.007 |
| lexical order head edge | 0.836±0.000 |
| lexical bag head edge | 0.836±0.000 |
| role quantity | 0.987±0.007 |
| head quantity | 0.987±0.007 |
| lexical order head quantity | 0.910±0.000 |
| lexical bag head quantity | 0.910±0.000 |
| heads FULL (model) | 0.701±0.012 |
| heads FULL (lexical order baseline) | 0.294±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.356±0.000 |
| role object [presence not decided] | 0.812±0.003 |
| role color [presence not decided] | 0.734±0.000 |
| role size [presence not decided] | 0.859±0.000 |
| role style [presence not decided] | 0.904±0.000 |
| role text [presence not decided] | 0.960±0.000 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.944±0.009 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 1.000±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 0.989±0.000 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.831±0.005 |
| role target [presence not decided] | 0.923±0.010 |
| role edge [presence not decided] | 0.979±0.005 |
| role quantity [presence not decided] | 1.000±0.000 |
| heads FULL (model) [presence not decided] | 0.458±0.005 |
| role object [pooled midpoint (comparison)] | 0.763±0.000 |
| role color [pooled midpoint (comparison)] | 1.000±0.000 |
| role size [pooled midpoint (comparison)] | 0.987±0.003 |
| role style [pooled midpoint (comparison)] | 0.985±0.003 |
| role text [pooled midpoint (comparison)] | 0.959±0.003 |
| role relation [pooled midpoint (comparison)] | 0.972±0.000 |
| role landmark [pooled midpoint (comparison)] | 0.955±0.000 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 1.000±0.000 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 1.000±0.000 |
| role unit [pooled midpoint (comparison)] | 1.000±0.000 |
| role direction [pooled midpoint (comparison)] | 0.994±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.953±0.005 |
| role target [pooled midpoint (comparison)] | 0.944±0.008 |
| role edge [pooled midpoint (comparison)] | 0.968±0.005 |
| role quantity [pooled midpoint (comparison)] | 0.985±0.005 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.697±0.011 |
| presence object: present read present [pooled midpoint (comparison)] | 0.776±0.004 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.996±0.003 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.980±0.005 |
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
| presence object: absent read absent | 0.882±0.024 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.111±0.157 |
| presence direction: share of true 'present' readings that abstain | 0.111±0.157 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.863±0.014 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.667±0.000 |
| presence object: share of 'present' readings that abstain | 0.082±0.023 |
| presence object: share of true 'present' readings that abstain | 0.069±0.028 |
| presence relation: present read present | 0.869±0.022 |
| presence relation: share of 'present' readings that abstain | 0.056±0.045 |
| presence relation: share of true 'present' readings that abstain | 0.056±0.045 |
| presence landmark: present read present | 0.868±0.048 |
| presence landmark: share of 'present' readings that abstain | 0.057±0.004 |
| presence landmark: share of true 'present' readings that abstain | 0.057±0.004 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.800±0.000 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.800±0.000 |
| presence text: present read present | 1.000±0.000 |
| presence text: share of 'present' readings that abstain | 0.117±0.037 |
| presence text: share of true 'present' readings that abstain | 0.083±0.034 |
| presence text: present read present [pooled midpoint (comparison)] | 0.831±0.003 |
| presence size: present read present | 0.972±0.039 |
| presence size: present read present [pooled midpoint (comparison)] | 0.861±0.039 |
| presence quantity: present read present | 0.854±0.078 |
| presence quantity: share of 'present' readings that abstain | 0.253±0.118 |
| presence quantity: share of true 'present' readings that abstain | 0.253±0.118 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.833±0.059 |
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
| presence size: share of 'present' readings that abstain | 0.243±0.017 |
| presence size: share of true 'present' readings that abstain | 0.114±0.038 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.000±0.000 |
| presence amount: share of true 'present' readings that abstain | 0.000±0.000 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present | 0.878±0.016 |
| presence source: share of 'present' readings that abstain | 0.787±0.112 |
| presence source: share of true 'present' readings that abstain | 0.787±0.112 |
| presence target: present read present | 0.943±0.016 |
| presence target: share of 'present' readings that abstain | 0.231±0.060 |
| presence target: share of true 'present' readings that abstain | 0.231±0.060 |
| presence edge: present read present | 0.943±0.043 |
| presence edge: share of 'present' readings that abstain | 0.035±0.028 |
| presence edge: share of true 'present' readings that abstain | 0.035±0.028 |
| presence source: present read present [pooled midpoint (comparison)] | 0.856±0.016 |
| presence target: present read present [pooled midpoint (comparison)] | 0.954±0.033 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.908±0.016 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: present read present | 0.667±0.189 |
| presence style: present read present [pooled midpoint (comparison)] | 0.467±0.094 |
| presence object: share of FALSE 'present' readings that abstain | 0.456±0.193 |
| presence color: share of 'present' readings that abstain | 0.722±0.208 |
| presence color: share of FALSE 'present' readings that abstain | 0.722±0.208 |
| presence style: share of 'present' readings that abstain | 0.367±0.262 |
| presence style: share of true 'present' readings that abstain | 0.333±0.236 |
| presence size: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 0.361±0.104 |

residual mean 0.170±0.006; status {'ok': 132, 'abstain': 45}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.417 / 0.292 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.741 | 0.184 / 0.000 | 0.73 | 0.021 | 0.028 / 0.238 |
| roles (pooled) | 0.797 | 0.173 / 0.000 | 0.75 | 0.040 | 0.088 / 0.163 |
| role direction | 1.000 | 0.286 / 0.110 | 1.00 | 0.000 | 0.000 / 0.000 |
| role relation | 0.857 | 0.198 / 0.000 | 0.76 | 0.000 | 0.095 / 0.143 |
| role landmark | 0.762 | 0.109 / 0.037 | 0.86 | 0.095 | 0.000 / 0.143 |
| role text | 1.000 | 0.208 / 0.105 | 0.96 | 0.000 | 0.042 / 0.000 |
| role size | 0.917 | 0.186 / 0.038 | 0.83 | 0.000 | 0.083 / 0.083 |
| role quantity | 0.875 | 0.114 / 0.003 | 0.75 | 0.000 | 0.125 / 0.125 |
| role anchor | 1.000 | 0.307 / 0.252 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.255 / 0.228 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.335 / 0.275 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 1.000 | 0.270 / 0.198 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.236 / 0.216 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.700 | 0.022 / 0.000 | 0.13 | 0.033 | 0.600 / 0.267 |
| role target | 0.690 | 0.095 / 0.013 | 0.69 | 0.172 | 0.172 / 0.138 |
| role edge | 0.759 | 0.217 / 0.148 | 0.90 | 0.138 | 0.000 / 0.103 |
| role pairing | 1.000 | 0.060 / 0.060 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.400 | 0.074 / 0.000 | 0.40 | 0.000 | 0.000 / 0.600 |

### heldout_sentences — catalog candidates (n = 469 of 469)
| axis | accuracy |
|---|---|
| FULL | 0.689±0.014 |
| FULL [depth given] | 0.689±0.014 |
| FULL [depth and negation given] | 0.689±0.014 |
| FULL [pooled midpoint (comparison)] | 0.665±0.012 |
| presence object: present read present | 0.848±0.022 |
| presence object: share of 'present' readings that abstain | 0.077±0.016 |
| presence object: share of true 'present' readings that abstain | 0.078±0.015 |
| presence color: absent read absent | 0.989±0.004 |
| presence size: absent read absent | 0.999±0.001 |
| presence style: absent read absent | 0.995±0.004 |
| presence text: absent read absent | 0.978±0.002 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.998±0.002 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.016±0.022 |
| presence layout: share of true 'present' readings that abstain | 0.016±0.022 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.995±0.004 |
| presence target: absent read absent | 1.000±0.000 |
| presence edge: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 0.999±0.001 |
| structure (depth, negation) | 0.992±0.001 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.992±0.001 |
| event type (synonym table) | 0.992±0.001 |
| role object | 0.797±0.012 |
| head object | 0.814±0.012 |
| lexical order head object | 0.849±0.000 |
| lexical bag head object | 0.881±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.687±0.008 |
| occupancy: known filler | 0.873±0.008 |
| role color | 0.976±0.001 |
| head color | 0.976±0.001 |
| lexical order head color | 0.966±0.000 |
| lexical bag head color | 0.983±0.000 |
| occupancy: not given | 0.995±0.000 |
| role size | 0.992±0.002 |
| head size | 0.992±0.002 |
| lexical order head size | 0.940±0.000 |
| lexical bag head size | 0.989±0.000 |
| role style | 0.991±0.004 |
| head style | 0.991±0.004 |
| lexical order head style | 0.972±0.000 |
| lexical bag head style | 0.972±0.000 |
| role text | 0.964±0.002 |
| head text | 0.964±0.002 |
| lexical order head text | 0.832±0.000 |
| lexical bag head text | 0.932±0.000 |
| role relation | 0.996±0.001 |
| head relation | 0.996±0.001 |
| lexical order head relation | 0.898±0.000 |
| lexical bag head relation | 0.955±0.000 |
| role landmark | 0.965±0.003 |
| head landmark | 0.985±0.003 |
| lexical order head landmark | 0.898±0.000 |
| lexical bag head landmark | 0.904±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.925±0.000 |
| lexical bag head region | 0.945±0.000 |
| role anchor | 0.999±0.001 |
| head anchor | 0.999±0.001 |
| lexical order head anchor | 0.940±0.000 |
| lexical bag head anchor | 0.991±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.985±0.000 |
| lexical bag head fraction | 0.989±0.000 |
| role amount | 0.997±0.001 |
| head amount | 0.997±0.001 |
| lexical order head amount | 0.938±0.000 |
| lexical bag head amount | 0.953±0.000 |
| role unit | 0.998±0.002 |
| head unit | 0.998±0.002 |
| lexical order head unit | 0.938±0.000 |
| lexical bag head unit | 0.953±0.000 |
| role direction | 0.995±0.001 |
| head direction | 0.995±0.001 |
| lexical order head direction | 0.938±0.000 |
| lexical bag head direction | 0.966±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.972±0.000 |
| lexical bag head axis | 0.989±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.955±0.000 |
| lexical bag head layout | 0.972±0.000 |
| role pairing | 0.999±0.001 |
| head pairing | 0.999±0.001 |
| lexical order head pairing | 0.951±0.000 |
| lexical bag head pairing | 0.966±0.000 |
| role source | 0.912±0.004 |
| head source | 0.944±0.004 |
| lexical order head source | 0.866±0.000 |
| lexical bag head source | 0.917±0.000 |
| role target | 0.976±0.001 |
| head target | 0.982±0.001 |
| lexical order head target | 0.915±0.000 |
| lexical bag head target | 0.949±0.000 |
| role edge | 0.998±0.000 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.955±0.000 |
| lexical bag head edge | 0.985±0.000 |
| role quantity | 0.999±0.001 |
| head quantity | 0.999±0.001 |
| lexical order head quantity | 0.977±0.000 |
| lexical bag head quantity | 0.998±0.000 |
| heads FULL (model) | 0.746±0.012 |
| heads FULL (lexical order baseline) | 0.205±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.529±0.000 |
| role object [pooled midpoint (comparison)] | 0.806±0.009 |
| role color [pooled midpoint (comparison)] | 0.979±0.000 |
| role size [pooled midpoint (comparison)] | 0.986±0.002 |
| role style [pooled midpoint (comparison)] | 0.992±0.001 |
| role text [pooled midpoint (comparison)] | 0.952±0.006 |
| role relation [pooled midpoint (comparison)] | 0.988±0.001 |
| role landmark [pooled midpoint (comparison)] | 0.963±0.001 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 0.997±0.001 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.995±0.001 |
| role unit [pooled midpoint (comparison)] | 0.996±0.000 |
| role direction [pooled midpoint (comparison)] | 0.990±0.003 |
| role axis [pooled midpoint (comparison)] | 0.996±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.908±0.005 |
| role target [pooled midpoint (comparison)] | 0.973±0.003 |
| role edge [pooled midpoint (comparison)] | 0.996±0.000 |
| role quantity [pooled midpoint (comparison)] | 0.999±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.711±0.013 |
| presence object: present read present [pooled midpoint (comparison)] | 0.865±0.012 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.998±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.984±0.002 |
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
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 0.707±0.022 |
| presence direction: present read present | 0.920±0.016 |
| presence direction: share of 'present' readings that abstain | 0.049±0.070 |
| presence direction: share of true 'present' readings that abstain | 0.049±0.070 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.693±0.019 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.839±0.043 |
| presence text: present read present | 0.890±0.016 |
| presence text: share of 'present' readings that abstain | 0.077±0.012 |
| presence text: share of true 'present' readings that abstain | 0.057±0.013 |
| presence text: present read present [pooled midpoint (comparison)] | 0.796±0.019 |
| presence pairing: present read present | 0.986±0.020 |
| presence pairing: share of 'present' readings that abstain | 0.088±0.071 |
| presence pairing: share of true 'present' readings that abstain | 0.088±0.071 |
| presence source: present read present | 0.640±0.027 |
| presence source: share of 'present' readings that abstain | 0.615±0.102 |
| presence source: share of true 'present' readings that abstain | 0.599±0.096 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.466±0.020 |
| presence color: present read present | 0.625±0.051 |
| presence color: present read present [pooled midpoint (comparison)] | 0.375±0.000 |
| presence size: present read present | 0.881±0.017 |
| presence size: share of 'present' readings that abstain | 0.133±0.019 |
| presence size: share of true 'present' readings that abstain | 0.121±0.031 |
| presence size: present read present [pooled midpoint (comparison)] | 0.762±0.034 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.116±0.082 |
| presence quantity: share of true 'present' readings that abstain | 0.091±0.074 |
| presence quantity: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present | 0.965±0.010 |
| presence relation: share of 'present' readings that abstain | 0.065±0.030 |
| presence relation: share of true 'present' readings that abstain | 0.065±0.030 |
| presence landmark: present read present | 0.917±0.034 |
| presence landmark: share of 'present' readings that abstain | 0.176±0.038 |
| presence landmark: share of true 'present' readings that abstain | 0.158±0.027 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.882±0.010 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.868±0.010 |
| presence anchor: present read present | 0.988±0.017 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.952±0.017 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.051±0.036 |
| presence axis: share of true 'present' readings that abstain | 0.051±0.036 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.846±0.000 |
| presence object: share of FALSE 'present' readings that abstain | 0.062±0.027 |
| presence target: present read present | 0.817±0.012 |
| presence target: share of 'present' readings that abstain | 0.204±0.016 |
| presence target: share of true 'present' readings that abstain | 0.204±0.016 |
| presence target: present read present [pooled midpoint (comparison)] | 0.775±0.020 |
| presence style: present read present | 0.846±0.000 |
| presence style: share of 'present' readings that abstain | 0.285±0.113 |
| presence style: share of true 'present' readings that abstain | 0.152±0.043 |
| presence style: present read present [pooled midpoint (comparison)] | 0.795±0.036 |
| presence amount: present read present | 0.954±0.016 |
| presence amount: share of 'present' readings that abstain | 0.012±0.017 |
| presence amount: share of true 'present' readings that abstain | 0.012±0.017 |
| presence unit: present read present | 0.966±0.028 |
| presence unit: share of 'present' readings that abstain | 0.023±0.017 |
| presence unit: share of true 'present' readings that abstain | 0.023±0.017 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.920±0.016 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.931±0.000 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.306±0.039 |
| presence color: share of FALSE 'present' readings that abstain | 0.794±0.147 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.016±0.022 |
| presence edge: share of true 'present' readings that abstain | 0.016±0.022 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.952±0.000 |
| presence color: share of true 'present' readings that abstain | 0.067±0.048 |
| presence text: share of FALSE 'present' readings that abstain | 0.243±0.030 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: share of FALSE 'present' readings that abstain | nan±nan |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.147±0.010; status {'ok': 371, 'abstain': 94, 'no-sense': 4}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.991 | 0.415 / 0.317 | 1.00 | 0.009 | 0.000 / 0.000 |
| role object | 0.830 | 0.217 / 0.000 | 0.81 | 0.025 | 0.043 / 0.145 |
| roles (pooled) | 0.837 | 0.204 / 0.000 | 0.80 | 0.033 | 0.068 / 0.130 |
| role layout | 1.000 | 0.329 / 0.269 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.330 / 0.272 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.931 | 0.284 / 0.057 | 0.93 | 0.000 | 0.000 / 0.069 |
| role text | 0.911 | 0.206 / 0.040 | 0.87 | 0.000 | 0.038 / 0.089 |
| role pairing | 1.000 | 0.209 / 0.045 | 0.83 | 0.000 | 0.174 / 0.000 |
| role source | 0.381 | 0.023 / 0.000 | 0.17 | 0.159 | 0.365 / 0.460 |
| role color | 0.500 | 0.094 / 0.000 | 0.50 | 0.000 | 0.000 / 0.500 |
| role size | 0.857 | 0.152 / 0.000 | 0.79 | 0.000 | 0.071 / 0.143 |
| role quantity | 1.000 | 0.151 / 0.091 | 1.00 | 0.000 | 0.000 / 0.000 |
| role relation | 0.979 | 0.256 / 0.059 | 0.90 | 0.000 | 0.083 / 0.021 |
| role landmark | 0.688 | 0.102 / 0.000 | 0.79 | 0.167 | 0.062 / 0.146 |
| role anchor | 0.964 | 0.317 / 0.171 | 0.96 | 0.000 | 0.000 / 0.036 |
| role axis | 1.000 | 0.310 / 0.092 | 0.92 | 0.000 | 0.077 / 0.000 |
| role target | 0.725 | 0.085 / 0.000 | 0.65 | 0.075 | 0.150 / 0.200 |
| role style | 0.846 | 0.138 / 0.004 | 0.69 | 0.000 | 0.154 / 0.154 |
| role amount | 0.966 | 0.246 / 0.182 | 0.97 | 0.000 | 0.000 / 0.034 |
| role unit | 1.000 | 0.244 / 0.166 | 0.97 | 0.000 | 0.034 / 0.000 |
| role edge | 0.952 | 0.244 / 0.204 | 1.00 | 0.048 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.290 / 0.254 | 1.00 | 0.000 | 0.000 / 0.000 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.588±0.028 |
| FULL [depth given] | 0.588±0.028 |
| FULL [depth and negation given] | 0.588±0.028 |
| FULL [pooled midpoint (comparison)] | 0.572±0.005 |
| presence object: present read present | 0.752±0.035 |
| presence object: share of 'present' readings that abstain | 0.138±0.005 |
| presence object: share of true 'present' readings that abstain | 0.137±0.003 |
| presence color: absent read absent | 0.994±0.005 |
| presence size: present read present | 0.963±0.000 |
| presence size: share of 'present' readings that abstain | 0.025±0.035 |
| presence size: share of true 'present' readings that abstain | 0.013±0.018 |
| presence style: absent read absent | 0.994±0.003 |
| presence text: absent read absent | 0.917±0.006 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.998±0.001 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.980±0.016 |
| presence amount: share of 'present' readings that abstain | 0.028±0.032 |
| presence amount: share of true 'present' readings that abstain | 0.028±0.032 |
| presence unit: present read present | 0.987±0.012 |
| presence unit: share of 'present' readings that abstain | 0.003±0.005 |
| presence unit: share of true 'present' readings that abstain | 0.003±0.005 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.995±0.004 |
| presence target: absent read absent | 1.000±0.000 |
| presence edge: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.996±0.001 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.996±0.001 |
| event type (synonym table) | 0.996±0.001 |
| role object | 0.712±0.031 |
| head object | 0.738±0.031 |
| lexical order head object | 0.920±0.000 |
| lexical bag head object | 0.870±0.000 |
| occupancy: known filler | 0.893±0.012 |
| role color | 0.993±0.004 |
| head color | 0.993±0.004 |
| lexical order head color | 0.985±0.000 |
| lexical bag head color | 0.993±0.000 |
| occupancy: not given | 0.995±0.000 |
| role size | 0.997±0.001 |
| head size | 0.997±0.001 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.988±0.000 |
| role style | 0.990±0.004 |
| head style | 0.990±0.004 |
| lexical order head style | 0.988±0.000 |
| lexical bag head style | 0.988±0.000 |
| role text | 0.908±0.014 |
| head text | 0.908±0.014 |
| lexical order head text | 0.535±0.000 |
| lexical bag head text | 0.745±0.000 |
| role relation | 0.961±0.005 |
| head relation | 0.961±0.005 |
| lexical order head relation | 0.790±0.000 |
| lexical bag head relation | 0.865±0.000 |
| role landmark | 0.907±0.012 |
| head landmark | 0.951±0.013 |
| lexical order head landmark | 0.790±0.000 |
| lexical bag head landmark | 0.810±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.955±0.000 |
| lexical bag head region | 0.965±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.967±0.000 |
| lexical bag head anchor | 0.998±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.988±0.000 |
| lexical bag head fraction | 0.995±0.000 |
| role amount | 0.995±0.004 |
| head amount | 0.995±0.004 |
| lexical order head amount | 0.750±0.000 |
| lexical bag head amount | 0.838±0.000 |
| occupancy: unknown filler | 0.778±0.023 |
| role unit | 0.997±0.003 |
| head unit | 0.997±0.003 |
| lexical order head unit | 0.750±0.000 |
| lexical bag head unit | 0.838±0.000 |
| role direction | 0.992±0.003 |
| head direction | 0.992±0.003 |
| lexical order head direction | 0.927±0.000 |
| lexical bag head direction | 0.950±0.000 |
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
| role source | 0.970±0.002 |
| head source | 0.970±0.002 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.948±0.000 |
| role target | 0.967±0.002 |
| head target | 0.970±0.002 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.958±0.000 |
| role edge | 0.998±0.000 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.960±0.000 |
| lexical bag head edge | 0.995±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.633±0.029 |
| heads FULL (lexical order baseline) | 0.060±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.367±0.000 |
| role object [pooled midpoint (comparison)] | 0.730±0.007 |
| role color [pooled midpoint (comparison)] | 0.990±0.000 |
| role size [pooled midpoint (comparison)] | 0.998±0.000 |
| role style [pooled midpoint (comparison)] | 0.994±0.001 |
| role text [pooled midpoint (comparison)] | 0.884±0.001 |
| role relation [pooled midpoint (comparison)] | 0.941±0.001 |
| role landmark [pooled midpoint (comparison)] | 0.890±0.002 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 1.000±0.000 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.989±0.001 |
| role unit [pooled midpoint (comparison)] | 0.993±0.001 |
| role direction [pooled midpoint (comparison)] | 0.978±0.009 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.965±0.004 |
| role target [pooled midpoint (comparison)] | 0.966±0.001 |
| role edge [pooled midpoint (comparison)] | 0.998±0.000 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.619±0.007 |
| presence object: present read present [pooled midpoint (comparison)] | 0.775±0.009 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.963±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.948±0.004 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.960±0.008 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.977±0.009 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence edge: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent | 0.999±0.001 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present | 0.898±0.023 |
| presence text: present read present [pooled midpoint (comparison)] | 0.810±0.005 |
| presence text: share of 'present' readings that abstain | 0.059±0.015 |
| presence text: share of true 'present' readings that abstain | 0.052±0.019 |
| presence text: share of FALSE 'present' readings that abstain | 0.132±0.026 |
| presence relation: present read present | 0.830±0.021 |
| presence landmark: present read present | 0.818±0.060 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.739±0.005 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.735±0.014 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 0.724±0.000 |
| presence source: present read present | 0.805±0.016 |
| presence source: share of 'present' readings that abstain | 0.776±0.050 |
| presence source: share of true 'present' readings that abstain | 0.772±0.039 |
| presence target: present read present | 0.678±0.016 |
| presence target: share of 'present' readings that abstain | 0.613±0.126 |
| presence target: share of true 'present' readings that abstain | 0.613±0.126 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.812±0.015 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.724±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.632±0.016 |
| presence target: present read present [pooled midpoint (comparison)] | 0.609±0.016 |
| presence edge: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: share of 'present' readings that abstain | 0.058±0.023 |
| presence relation: share of true 'present' readings that abstain | 0.058±0.023 |
| presence landmark: share of 'present' readings that abstain | 0.166±0.013 |
| presence landmark: share of true 'present' readings that abstain | 0.158±0.007 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 0.885±0.043 |
| presence direction: share of 'present' readings that abstain | 0.107±0.073 |
| presence direction: share of true 'present' readings that abstain | 0.107±0.073 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.690±0.123 |
| presence style: share of 'present' readings that abstain | 0.440±0.138 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence object: share of FALSE 'present' readings that abstain | 0.167±0.059 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: present read present | 0.667±0.094 |
| presence style: share of true 'present' readings that abstain | 0.083±0.118 |
| presence style: present read present [pooled midpoint (comparison)] | 0.600±0.000 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: present read present | 0.944±0.079 |
| presence color: share of 'present' readings that abstain | 0.371±0.203 |
| presence color: share of true 'present' readings that abstain | 0.178±0.137 |
| presence color: present read present [pooled midpoint (comparison)] | 0.333±0.000 |
| presence size: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.182±0.014; status {'ok': 296, 'abstain': 102, 'no-sense': 2}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.995 | 0.395 / 0.297 | 1.00 | 0.005 | 0.000 / 0.000 |
| role object | 0.755 | 0.158 / 0.000 | 0.69 | 0.027 | 0.094 / 0.218 |
| roles (pooled) | 0.830 | 0.181 / 0.000 | 0.78 | 0.024 | 0.074 / 0.146 |
| role size | 0.963 | 0.187 / 0.091 | 0.93 | 0.000 | 0.037 / 0.037 |
| role amount | 1.000 | 0.249 / 0.166 | 0.99 | 0.000 | 0.010 / 0.000 |
| role unit | 1.000 | 0.261 / 0.205 | 1.00 | 0.000 | 0.000 / 0.000 |
| role text | 0.930 | 0.213 / 0.015 | 0.87 | 0.000 | 0.065 / 0.070 |
| role relation | 0.810 | 0.190 / 0.000 | 0.79 | 0.000 | 0.024 / 0.190 |
| role landmark | 0.560 | 0.081 / 0.000 | 0.67 | 0.167 | 0.060 / 0.274 |
| role anchor | 1.000 | 0.308 / 0.186 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.247 / 0.226 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.690 | 0.019 / -0.003 | 0.14 | 0.034 | 0.586 / 0.276 |
| role target | 0.552 | 0.036 / 0.000 | 0.31 | 0.000 | 0.241 / 0.448 |
| role edge | 0.938 | 0.242 / 0.210 | 1.00 | 0.062 | 0.000 / 0.000 |
| role region | 1.000 | 0.326 / 0.242 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.897 | 0.172 / 0.031 | 0.86 | 0.000 | 0.034 / 0.103 |
| role style | 0.600 | 0.090 / 0.000 | 0.60 | 0.000 | 0.000 / 0.400 |
| role color | 0.833 | 0.098 / -0.016 | 0.67 | 0.000 | 0.167 / 0.167 |

### train (sample) — catalog candidates (n = 300 of 4531)
| axis | accuracy |
|---|---|
| FULL | 0.707±0.031 |
| FULL [depth given] | 0.707±0.031 |
| FULL [depth and negation given] | 0.707±0.031 |
| presence object: present read present | 0.825±0.032 |
| presence color: absent read absent | 0.987±0.002 |
| presence size: absent read absent | 0.999±0.002 |
| presence style: absent read absent | 0.995±0.004 |
| presence text: present read present | 0.899±0.020 |
| presence text: share of 'present' readings that abstain | 0.046±0.019 |
| presence text: share of true 'present' readings that abstain | 0.049±0.021 |
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
| presence source: absent read absent | 0.999±0.002 |
| presence target: absent read absent | 1.000±0.000 |
| presence edge: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.993±0.000 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.993±0.000 |
| event type (synonym table) | 0.993±0.000 |
| role object | 0.811±0.029 |
| head object | 0.819±0.029 |
| lexical order head object | 0.863±0.000 |
| lexical bag head object | 0.947±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.745±0.016 |
| occupancy: known filler | 0.885±0.015 |
| role color | 0.976±0.002 |
| head color | 0.976±0.002 |
| lexical order head color | 0.947±0.000 |
| lexical bag head color | 0.983±0.000 |
| occupancy: not given | 0.997±0.001 |
| role size | 0.991±0.002 |
| head size | 0.991±0.002 |
| lexical order head size | 0.943±0.000 |
| lexical bag head size | 0.997±0.000 |
| role style | 0.993±0.005 |
| head style | 0.993±0.005 |
| lexical order head style | 0.983±0.000 |
| lexical bag head style | 0.997±0.000 |
| role text | 0.972±0.004 |
| head text | 0.972±0.004 |
| lexical order head text | 0.843±0.000 |
| lexical bag head text | 0.997±0.000 |
| role relation | 0.993±0.003 |
| head relation | 0.993±0.003 |
| lexical order head relation | 0.903±0.000 |
| lexical bag head relation | 0.993±0.000 |
| role landmark | 0.972±0.002 |
| head landmark | 0.989±0.002 |
| lexical order head landmark | 0.903±0.000 |
| lexical bag head landmark | 0.947±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.907±0.000 |
| lexical bag head region | 1.000±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.960±0.000 |
| lexical bag head anchor | 0.990±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.983±0.000 |
| lexical bag head fraction | 0.993±0.000 |
| role amount | 0.998±0.003 |
| head amount | 0.998±0.003 |
| lexical order head amount | 0.907±0.000 |
| lexical bag head amount | 0.990±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.907±0.000 |
| lexical bag head unit | 0.990±0.000 |
| role direction | 1.000±0.000 |
| head direction | 1.000±0.000 |
| lexical order head direction | 0.970±0.000 |
| lexical bag head direction | 0.990±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.963±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.953±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.999±0.002 |
| head pairing | 0.999±0.002 |
| lexical order head pairing | 0.967±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.934±0.004 |
| head source | 0.976±0.004 |
| lexical order head source | 0.880±0.000 |
| lexical bag head source | 0.970±0.000 |
| role target | 0.992±0.002 |
| head target | 0.999±0.002 |
| lexical order head target | 0.913±0.000 |
| lexical bag head target | 0.947±0.000 |
| role edge | 0.993±0.000 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.940±0.000 |
| lexical bag head edge | 1.000±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.980±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.768±0.037 |
| heads FULL (lexical order baseline) | 0.227±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.797±0.000 |
| presence style: present read present | 0.867±0.094 |
| presence text: absent read absent | 0.989±0.002 |
| presence color: present read present | 0.771±0.029 |
| presence object: share of 'present' readings that abstain | 0.076±0.001 |
| presence object: share of true 'present' readings that abstain | 0.077±0.004 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence object: absent read absent | 0.821±0.011 |
| presence object: share of FALSE 'present' readings that abstain | 0.048±0.067 |
| presence source: present read present | 0.806±0.023 |
| presence target: present read present | 0.987±0.018 |
| presence target: share of 'present' readings that abstain | 0.066±0.038 |
| presence target: share of true 'present' readings that abstain | 0.066±0.038 |
| presence color: share of 'present' readings that abstain | 0.104±0.030 |
| presence color: share of FALSE 'present' readings that abstain | 0.361±0.104 |
| presence size: present read present | 0.863±0.028 |
| presence source: share of 'present' readings that abstain | 0.513±0.090 |
| presence source: share of true 'present' readings that abstain | 0.508±0.085 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.037±0.026 |
| presence edge: share of true 'present' readings that abstain | 0.037±0.026 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.111±0.079 |
| presence quantity: share of true 'present' readings that abstain | 0.111±0.079 |
| presence relation: present read present | 0.964±0.029 |
| presence relation: share of 'present' readings that abstain | 0.024±0.017 |
| presence relation: share of true 'present' readings that abstain | 0.024±0.017 |
| presence landmark: present read present | 0.929±0.000 |
| presence landmark: share of 'present' readings that abstain | 0.050±0.036 |
| presence landmark: share of true 'present' readings that abstain | 0.038±0.031 |
| presence amount: present read present | 0.976±0.034 |
| presence amount: share of 'present' readings that abstain | 0.013±0.018 |
| presence amount: share of true 'present' readings that abstain | 0.013±0.018 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.088±0.026 |
| presence size: share of true 'present' readings that abstain | 0.068±0.002 |
| presence pairing: present read present | 0.967±0.047 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence style: share of 'present' readings that abstain | 0.254±0.184 |
| presence style: share of true 'present' readings that abstain | 0.067±0.094 |
| presence color: share of true 'present' readings that abstain | 0.028±0.039 |
| presence text: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.155±0.012; status {'ok': 244, 'abstain': 54, 'no-sense': 2}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.993 | 0.413 / 0.304 | 1.00 | 0.007 | 0.000 / 0.000 |
| role object | 0.846 | 0.207 / 0.000 | 0.80 | 0.012 | 0.062 / 0.143 |
| roles (pooled) | 0.863 | 0.212 / 0.000 | 0.84 | 0.032 | 0.051 / 0.106 |
| role text | 0.894 | 0.208 / 0.004 | 0.87 | 0.000 | 0.021 / 0.106 |
| role style | 0.800 | 0.165 / 0.063 | 0.80 | 0.000 | 0.000 / 0.200 |
| role color | 0.750 | 0.131 / 0.000 | 0.69 | 0.000 | 0.062 / 0.250 |
| role region | 1.000 | 0.342 / 0.281 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.263 / 0.130 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.444 | 0.038 / 0.000 | 0.39 | 0.222 | 0.278 / 0.333 |
| role target | 0.923 | 0.130 / 0.073 | 0.96 | 0.077 | 0.038 / 0.000 |
| role size | 0.882 | 0.164 / 0.015 | 0.82 | 0.000 | 0.059 / 0.118 |
| role edge | 0.889 | 0.232 / 0.171 | 1.00 | 0.111 | 0.000 / 0.000 |
| role quantity | 1.000 | 0.172 / 0.098 | 1.00 | 0.000 | 0.000 / 0.000 |
| role relation | 0.931 | 0.256 / 0.173 | 0.90 | 0.000 | 0.034 / 0.069 |
| role landmark | 0.724 | 0.126 / 0.035 | 0.86 | 0.172 | 0.034 / 0.103 |
| role amount | 1.000 | 0.264 / 0.199 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.268 / 0.202 | 1.00 | 0.000 | 0.000 / 0.000 |
| role layout | 1.000 | 0.353 / 0.301 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.393 / 0.364 | 1.00 | 0.000 | 0.000 / 0.000 |
| role anchor | 1.000 | 0.308 / 0.206 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 0.900 | 0.258 / 0.108 | 0.90 | 0.000 | 0.000 / 0.100 |
| role fraction | 1.000 | 0.299 / 0.278 | 1.00 | 0.000 | 0.000 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 ANCHOR=0.97 COMPONENT=0.96 do=0.94 PAIR=0.93 EDGE=0.91 never=0.90 AXIS=0.87 DIR=0.84 UNIT=0.71 REGION=0.69 LABEL=0.64 apart=0.63 back=0.61 front=0.58 flow=0.43 color=0.42 LAYOUT=0.36 PRON=0.34 not=0.33 FRACTION=0.30 FILLER=0.29 are=0.19 the=0.17 INTRO=0.12 together=0.12 unknown=0.12 evenly=0.08 is=0.03 DEM=0.01 REL=0.01 NUM=0.01 a=0.01 QUANT=0.01 VERB=0.00 SIZE=0.00 STYLE=0.00 COLOR=0.00

## What is weak, what to add
- heldout_formulations: FULL 0.655
- heldout_formulations: presence object: present read present 0.762
- heldout_formulations: role object 0.768
- heldout_formulations: head object 0.780
- heldout_formulations: determiner identity (outside FULL when the legend excludes it) 0.771
- heldout_formulations: occupancy: known filler 0.859
- heldout_formulations: heads FULL (model) 0.712
- heldout_formulations: heads FULL (lexical order baseline) 0.294
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.356
- heldout_formulations: FULL [depth given] 0.655
- heldout_formulations: FULL [depth and negation given] 0.655
- heldout_formulations: FULL [presence not decided] 0.446
- heldout_formulations: role object [presence not decided] 0.808
- heldout_formulations: role color [presence not decided] 0.734
- heldout_formulations: role size [presence not decided] 0.859
- heldout_formulations: role source [presence not decided] 0.825
- heldout_formulations: heads FULL (model) [presence not decided] 0.452
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.633
- heldout_formulations: role object [pooled midpoint (comparison)] 0.763
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.689
- heldout_formulations: presence object: present read present [pooled midpoint (comparison)] 0.773
- heldout_formulations: presence object: absent read absent 0.882
- heldout_formulations: presence direction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence direction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence object: absent read absent [pooled midpoint (comparison)] 0.882
- heldout_formulations: presence direction: present read present [pooled midpoint (comparison)] 0.667
- heldout_formulations: presence object: share of 'present' readings that abstain 0.053
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.037
- heldout_formulations: presence relation: present read present 0.857
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.111
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.111
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.053
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.053
- heldout_formulations: presence relation: present read present [pooled midpoint (comparison)] 0.800
- heldout_formulations: presence landmark: present read present [pooled midpoint (comparison)] 0.800
- heldout_formulations: presence text: share of 'present' readings that abstain 0.077
- heldout_formulations: presence text: share of true 'present' readings that abstain 0.042
- heldout_formulations: presence text: present read present [pooled midpoint (comparison)] 0.826
- heldout_formulations: presence size: present read present [pooled midpoint (comparison)] 0.833
- heldout_formulations: presence quantity: present read present 0.875
- heldout_formulations: presence quantity: share of 'present' readings that abstain 0.143
- heldout_formulations: presence quantity: share of true 'present' readings that abstain 0.143
- heldout_formulations: presence quantity: present read present [pooled midpoint (comparison)] 0.875
- heldout_formulations: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence region: share of 'present' readings that abstain 0.000
- heldout_formulations: presence region: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence size: share of 'present' readings that abstain 0.231
- heldout_formulations: presence size: share of true 'present' readings that abstain 0.091
- heldout_formulations: presence amount: share of 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence source: present read present 0.867
- heldout_formulations: presence source: share of 'present' readings that abstain 0.846
- heldout_formulations: presence source: share of true 'present' readings that abstain 0.846
- heldout_formulations: presence target: share of 'present' readings that abstain 0.286
- heldout_formulations: presence target: share of true 'present' readings that abstain 0.286
- heldout_formulations: presence edge: present read present 0.897
- heldout_formulations: presence edge: share of 'present' readings that abstain 0.000
- heldout_formulations: presence edge: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence source: present read present [pooled midpoint (comparison)] 0.833
- heldout_formulations: presence edge: present read present [pooled midpoint (comparison)] 0.897
- heldout_formulations: presence pairing: share of 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence style: present read present 0.400
- heldout_formulations: presence style: present read present [pooled midpoint (comparison)] 0.400
- heldout_formulations: presence object: share of FALSE 'present' readings that abstain 0.500
- heldout_formulations: presence style: share of 'present' readings that abstain 0.000
- heldout_formulations: presence style: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence text: share of FALSE 'present' readings that abstain 0.500
- heldout_sentences: FULL 0.697
- heldout_sentences: presence object: present read present 0.869
- heldout_sentences: presence object: share of 'present' readings that abstain 0.055
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.056
- heldout_sentences: presence layout: share of 'present' readings that abstain 0.000
- heldout_sentences: presence layout: share of true 'present' readings that abstain 0.000
- heldout_sentences: role object 0.806
- heldout_sentences: head object 0.825
- heldout_sentences: determiner identity (outside FULL when the legend excludes it) 0.689
- heldout_sentences: occupancy: known filler 0.881
- heldout_sentences: heads FULL (model) 0.755
- heldout_sentences: heads FULL (lexical order baseline) 0.205
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.529
- heldout_sentences: FULL [depth given] 0.697
- heldout_sentences: FULL [depth and negation given] 0.697
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.657
- heldout_sentences: role object [pooled midpoint (comparison)] 0.797
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.704
- heldout_sentences: presence object: present read present [pooled midpoint (comparison)] 0.853
- heldout_sentences: presence region: share of 'present' readings that abstain 0.000
- heldout_sentences: presence region: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence object: absent read absent 0.680
- heldout_sentences: presence direction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence direction: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence object: absent read absent [pooled midpoint (comparison)] 0.707
- heldout_sentences: presence direction: present read present [pooled midpoint (comparison)] 0.897
- heldout_sentences: presence text: share of 'present' readings that abstain 0.062
- heldout_sentences: presence text: share of true 'present' readings that abstain 0.042
- heldout_sentences: presence text: present read present [pooled midpoint (comparison)] 0.769
- heldout_sentences: presence pairing: share of 'present' readings that abstain 0.174
- heldout_sentences: presence pairing: share of true 'present' readings that abstain 0.174
- heldout_sentences: presence source: present read present 0.603
- heldout_sentences: presence source: share of 'present' readings that abstain 0.738
- heldout_sentences: presence source: share of true 'present' readings that abstain 0.711
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.460
- heldout_sentences: presence color: present read present 0.562
- heldout_sentences: presence color: present read present [pooled midpoint (comparison)] 0.375
- heldout_sentences: presence size: present read present 0.857
- heldout_sentences: presence size: share of 'present' readings that abstain 0.120
- heldout_sentences: presence size: share of true 'present' readings that abstain 0.083
- heldout_sentences: presence size: present read present [pooled midpoint (comparison)] 0.714
- heldout_sentences: presence quantity: share of 'present' readings that abstain 0.000
- heldout_sentences: presence quantity: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence relation: share of 'present' readings that abstain 0.085
- heldout_sentences: presence relation: share of true 'present' readings that abstain 0.085
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.156
- heldout_sentences: presence landmark: share of true 'present' readings that abstain 0.136
- heldout_sentences: presence relation: present read present [pooled midpoint (comparison)] 0.875
- heldout_sentences: presence landmark: present read present [pooled midpoint (comparison)] 0.875
- heldout_sentences: presence anchor: share of 'present' readings that abstain 0.000
- heldout_sentences: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence axis: share of 'present' readings that abstain 0.077
- heldout_sentences: presence axis: share of true 'present' readings that abstain 0.077
- heldout_sentences: presence axis: present read present [pooled midpoint (comparison)] 0.846
- heldout_sentences: presence object: share of FALSE 'present' readings that abstain 0.042
- heldout_sentences: presence target: present read present 0.825
- heldout_sentences: presence target: share of 'present' readings that abstain 0.212
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.212
- heldout_sentences: presence target: present read present [pooled midpoint (comparison)] 0.750
- heldout_sentences: presence style: present read present 0.846
- heldout_sentences: presence style: share of 'present' readings that abstain 0.438
- heldout_sentences: presence style: share of true 'present' readings that abstain 0.182
- heldout_sentences: presence style: present read present [pooled midpoint (comparison)] 0.769
- heldout_sentences: presence amount: share of 'present' readings that abstain 0.000
- heldout_sentences: presence amount: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.034
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.034
- heldout_sentences: presence amount: present read present [pooled midpoint (comparison)] 0.897
- heldout_sentences: presence color: share of 'present' readings that abstain 0.250
- heldout_sentences: presence color: share of FALSE 'present' readings that abstain 0.667
- heldout_sentences: presence edge: share of 'present' readings that abstain 0.000
- heldout_sentences: presence edge: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence color: share of true 'present' readings that abstain 0.111
- heldout_sentences: presence text: share of FALSE 'present' readings that abstain 0.222
- heldout_sentences: presence fraction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities: FULL 0.627
- new_identities: presence object: present read present 0.797
- new_identities: presence object: share of 'present' readings that abstain 0.132
- new_identities: presence object: share of true 'present' readings that abstain 0.133
- new_identities: presence size: share of 'present' readings that abstain 0.074
- new_identities: presence size: share of true 'present' readings that abstain 0.038
- new_identities: presence amount: share of 'present' readings that abstain 0.010
- new_identities: presence amount: share of true 'present' readings that abstain 0.010
- new_identities: presence unit: share of 'present' readings that abstain 0.000
- new_identities: presence unit: share of true 'present' readings that abstain 0.000
- new_identities: role object 0.752
- new_identities: head object 0.780
- new_identities: occupancy: unknown filler 0.809
- new_identities: heads FULL (model) 0.675
- new_identities: heads FULL (lexical order baseline) 0.060
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.367
- new_identities: FULL [depth given] 0.627
- new_identities: FULL [depth and negation given] 0.627
- new_identities: FULL [pooled midpoint (comparison)] 0.573
- new_identities: role object [pooled midpoint (comparison)] 0.735
- new_identities: role text [pooled midpoint (comparison)] 0.885
- new_identities: role landmark [pooled midpoint (comparison)] 0.887
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.620
- new_identities: presence object: present read present [pooled midpoint (comparison)] 0.775
- new_identities: presence text: present read present [pooled midpoint (comparison)] 0.806
- new_identities: presence text: share of 'present' readings that abstain 0.074
- new_identities: presence text: share of true 'present' readings that abstain 0.069
- new_identities: presence text: share of FALSE 'present' readings that abstain 0.125
- new_identities: presence relation: present read present 0.829
- new_identities: presence landmark: present read present 0.817
- new_identities: presence relation: present read present [pooled midpoint (comparison)] 0.744
- new_identities: presence landmark: present read present [pooled midpoint (comparison)] 0.720
- new_identities: presence anchor: share of 'present' readings that abstain 0.000
- new_identities: presence anchor: share of true 'present' readings that abstain 0.000
- new_identities: presence fraction: share of 'present' readings that abstain 0.000
- new_identities: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities: presence object: absent read absent 0.724
- new_identities: presence source: present read present 0.793
- new_identities: presence source: share of 'present' readings that abstain 0.846
- new_identities: presence source: share of true 'present' readings that abstain 0.826
- new_identities: presence target: present read present 0.690
- new_identities: presence target: share of 'present' readings that abstain 0.550
- new_identities: presence target: share of true 'present' readings that abstain 0.550
- new_identities: presence edge: share of 'present' readings that abstain 0.000
- new_identities: presence edge: share of true 'present' readings that abstain 0.000
- new_identities: determiner identity (outside FULL when the legend excludes it) 0.833
- new_identities: presence object: absent read absent [pooled midpoint (comparison)] 0.724
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.621
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.621
- new_identities: presence relation: share of 'present' readings that abstain 0.029
- new_identities: presence relation: share of true 'present' readings that abstain 0.029
- new_identities: presence landmark: share of 'present' readings that abstain 0.176
- new_identities: presence landmark: share of true 'present' readings that abstain 0.164
- new_identities: presence region: share of 'present' readings that abstain 0.000
- new_identities: presence region: share of true 'present' readings that abstain 0.000
- new_identities: presence direction: present read present 0.897
- new_identities: presence direction: share of 'present' readings that abstain 0.038
- new_identities: presence direction: share of true 'present' readings that abstain 0.038
- new_identities: presence direction: present read present [pooled midpoint (comparison)] 0.862
- new_identities: presence style: share of 'present' readings that abstain 0.571
- new_identities: presence object: share of FALSE 'present' readings that abstain 0.125
- new_identities: presence style: present read present 0.600
- new_identities: presence style: share of true 'present' readings that abstain 0.000
- new_identities: presence style: present read present [pooled midpoint (comparison)] 0.600
- new_identities: presence color: present read present 0.833
- new_identities: presence color: share of 'present' readings that abstain 0.333
- new_identities: presence color: share of true 'present' readings that abstain 0.200
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.333
- train (sample): FULL 0.743
- train (sample): presence object: present read present 0.864
- train (sample): presence text: share of 'present' readings that abstain 0.023
- train (sample): presence text: share of true 'present' readings that abstain 0.024
- train (sample): role object 0.843
- train (sample): head object 0.853
- train (sample): determiner identity (outside FULL when the legend excludes it) 0.762
- train (sample): heads FULL (model) 0.810
- train (sample): heads FULL (lexical order baseline) 0.227
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.797
- train (sample): FULL [depth given] 0.743
- train (sample): FULL [depth and negation given] 0.743
- train (sample): presence style: present read present 0.800
- train (sample): presence color: present read present 0.750
- train (sample): presence object: share of 'present' readings that abstain 0.074
- train (sample): presence object: share of true 'present' readings that abstain 0.072
- train (sample): presence region: share of 'present' readings that abstain 0.000
- train (sample): presence region: share of true 'present' readings that abstain 0.000
- train (sample): presence direction: share of 'present' readings that abstain 0.000
- train (sample): presence direction: share of true 'present' readings that abstain 0.000
- train (sample): presence object: absent read absent 0.829
- train (sample): presence object: share of FALSE 'present' readings that abstain 0.143
- train (sample): presence source: present read present 0.806
- train (sample): presence target: share of 'present' readings that abstain 0.038
- train (sample): presence target: share of true 'present' readings that abstain 0.038
- train (sample): presence color: share of 'present' readings that abstain 0.133
- train (sample): presence color: share of FALSE 'present' readings that abstain 0.333
- train (sample): presence size: present read present 0.882
- train (sample): presence source: share of 'present' readings that abstain 0.517
- train (sample): presence source: share of true 'present' readings that abstain 0.517
- train (sample): presence edge: share of 'present' readings that abstain 0.000
- train (sample): presence edge: share of true 'present' readings that abstain 0.000
- train (sample): presence quantity: share of 'present' readings that abstain 0.000
- train (sample): presence quantity: share of true 'present' readings that abstain 0.000
- train (sample): presence relation: share of 'present' readings that abstain 0.037
- train (sample): presence relation: share of true 'present' readings that abstain 0.037
- train (sample): presence landmark: share of 'present' readings that abstain 0.074
- train (sample): presence landmark: share of true 'present' readings that abstain 0.038
- train (sample): presence amount: share of 'present' readings that abstain 0.000
- train (sample): presence amount: share of true 'present' readings that abstain 0.000
- train (sample): presence unit: share of 'present' readings that abstain 0.000
- train (sample): presence unit: share of true 'present' readings that abstain 0.000
- train (sample): presence layout: share of 'present' readings that abstain 0.000
- train (sample): presence layout: share of true 'present' readings that abstain 0.000
- train (sample): presence axis: share of 'present' readings that abstain 0.000
- train (sample): presence axis: share of true 'present' readings that abstain 0.000
- train (sample): presence anchor: share of 'present' readings that abstain 0.000
- train (sample): presence anchor: share of true 'present' readings that abstain 0.000
- train (sample): presence size: share of 'present' readings that abstain 0.067
- train (sample): presence size: share of true 'present' readings that abstain 0.067
- train (sample): presence pairing: share of 'present' readings that abstain 0.000
- train (sample): presence pairing: share of true 'present' readings that abstain 0.000
- train (sample): presence fraction: share of 'present' readings that abstain 0.000
- train (sample): presence fraction: share of true 'present' readings that abstain 0.000
- train (sample): presence style: share of 'present' readings that abstain 0.000
- train (sample): presence style: share of true 'present' readings that abstain 0.000
- train (sample): presence color: share of true 'present' readings that abstain 0.083
- train (sample): presence text: share of FALSE 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_formulations: `i want you to sketch a COMPONENT` FULL 0.000 (n 2)
- heldout_formulations: `i want you to create a COMPONENT` FULL 0.000 (n 2)
- heldout_sentences: `would you join QUANT COMPONENT PAIR` FULL 0.000 (n 2)
- heldout_sentences: `lets connect QUANT COMPONENT PAIR` FULL 0.000 (n 2)
- new_identities: `lets sketch a COMPONENT named LABEL` FULL 0.000 (n 2)
- new_identities: `make LABEL STYLE please` FULL 0.000 (n 2)
- new_identities: `make LABEL NUM UNIT SIZE .` FULL 0.000 (n 2)
- heldout_formulations: `please sketch a COLOR COMPONENT named LABEL` FULL 0.000 (n 1)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role size | role style | role text | role relation | role landmark | role region | role anchor | role fraction | role amount | role unit | role direction | role axis | role layout | role pairing | role source | role target | role edge | role quantity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.701±0.012 | 0.640±0.011 | 0.755±0.012 | 0.983±0.005 | 0.987±0.005 | 0.989±0.005 | 0.977±0.009 | 0.981±0.003 | 0.964±0.007 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.951±0.007 | 0.942±0.005 | 0.974±0.010 | 0.987±0.007 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.697±0.011 | 0.637±0.005 | 0.763±0.000 | 1.000±0.000 | 0.987±0.003 | 0.985±0.003 | 0.959±0.003 | 0.972±0.000 | 0.955±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.994±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.953±0.005 | 0.944±0.008 | 0.968±0.005 | 0.985±0.005 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.458±0.005 | 0.452±0.005 | 0.812±0.003 | 0.734±0.000 | 0.859±0.000 | 0.904±0.000 | 0.960±0.000 | 1.000±0.000 | 0.944±0.009 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.989±0.000 | 1.000±0.000 | 0.831±0.005 | 0.923±0.010 | 0.979±0.005 | 1.000±0.000 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 0.749±0.013 | 0.882±0.024 | 0.816±0.017 | 0.082±0.023 (0.456±0.193 / 0.069±0.028) |
| heldout_formulations | object | comparison: pooled midpoint | 0.776±0.004 | 0.863±0.014 | 0.820±0.006 |  |
| heldout_formulations | color | product: fitted | — | 0.983±0.005 | — | 0.722±0.208 (0.722±0.208 / —) |
| heldout_formulations | color | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | size | product: fitted | 0.972±0.039 | 0.988±0.005 | 0.980±0.020 | 0.243±0.017 (1.000±0.000 / 0.114±0.038) |
| heldout_formulations | size | comparison: pooled midpoint | 0.861±0.039 | 0.996±0.003 | 0.929±0.019 |  |
| heldout_formulations | style | product: fitted | 0.667±0.189 | 0.998±0.003 | 0.832±0.094 | 0.367±0.262 (1.000 / 0.333±0.236) |
| heldout_formulations | style | comparison: pooled midpoint | 0.467±0.094 | 1.000±0.000 | 0.733±0.047 |  |
| heldout_formulations | text | product: fitted | 1.000±0.000 | 0.974±0.011 | 0.987±0.005 | 0.117±0.037 (0.361±0.104 / 0.083±0.034) |
| heldout_formulations | text | comparison: pooled midpoint | 0.831±0.003 | 0.980±0.005 | 0.906±0.001 |  |
| heldout_formulations | relation | product: fitted | 0.869±0.022 | 1.000±0.000 | 0.935±0.011 | 0.056±0.045 (— / 0.056±0.045) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.800±0.000 | 1.000±0.000 | 0.900±0.000 |  |
| heldout_formulations | landmark | product: fitted | 0.868±0.048 | 1.000±0.000 | 0.934±0.024 | 0.057±0.004 (— / 0.057±0.004) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.800±0.000 | 1.000±0.000 | 0.900±0.000 |  |
| heldout_formulations | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | amount | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | unit | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.111±0.157 (— / 0.111±0.157) |
| heldout_formulations | direction | comparison: pooled midpoint | 0.667±0.000 | 1.000±0.000 | 0.833±0.000 |  |
| heldout_formulations | axis | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | layout | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | source | product: fitted | 0.878±0.016 | 1.000±0.000 | 0.939±0.008 | 0.787±0.112 (— / 0.787±0.112) |
| heldout_formulations | source | comparison: pooled midpoint | 0.856±0.016 | 1.000±0.000 | 0.928±0.008 |  |
| heldout_formulations | target | product: fitted | 0.943±0.016 | 1.000±0.000 | 0.971±0.008 | 0.231±0.060 (— / 0.231±0.060) |
| heldout_formulations | target | comparison: pooled midpoint | 0.954±0.033 | 1.000±0.000 | 0.977±0.016 |  |
| heldout_formulations | edge | product: fitted | 0.943±0.043 | 1.000±0.000 | 0.971±0.022 | 0.035±0.028 (— / 0.035±0.028) |
| heldout_formulations | edge | comparison: pooled midpoint | 0.908±0.016 | 1.000±0.000 | 0.954±0.008 |  |
| heldout_formulations | quantity | product: fitted | 0.854±0.078 | 1.000±0.000 | 0.927±0.039 | 0.253±0.118 (— / 0.253±0.118) |
| heldout_formulations | quantity | comparison: pooled midpoint | 0.833±0.059 | 1.000±0.000 | 0.917±0.029 |  |
| heldout_sentences | object | product: fitted | 0.848±0.022 | 0.707±0.022 | 0.777±0.003 | 0.077±0.016 (0.062±0.027 / 0.078±0.015) |
| heldout_sentences | object | comparison: pooled midpoint | 0.865±0.012 | 0.693±0.019 | 0.779±0.013 |  |
| heldout_sentences | color | product: fitted | 0.625±0.051 | 0.989±0.004 | 0.807±0.024 | 0.306±0.039 (0.794±0.147 / 0.067±0.048) |
| heldout_sentences | color | comparison: pooled midpoint | 0.375±0.000 | 1.000±0.000 | 0.688±0.000 |  |
| heldout_sentences | size | product: fitted | 0.881±0.017 | 0.999±0.001 | 0.940±0.009 | 0.133±0.019 (1.000 / 0.121±0.031) |
| heldout_sentences | size | comparison: pooled midpoint | 0.762±0.034 | 1.000±0.000 | 0.881±0.017 |  |
| heldout_sentences | style | product: fitted | 0.846±0.000 | 0.995±0.004 | 0.920±0.002 | 0.285±0.113 (1.000±0.000 / 0.152±0.043) |
| heldout_sentences | style | comparison: pooled midpoint | 0.795±0.036 | 0.998±0.000 | 0.896±0.018 |  |
| heldout_sentences | text | product: fitted | 0.890±0.016 | 0.978±0.002 | 0.934±0.007 | 0.077±0.012 (0.243±0.030 / 0.057±0.013) |
| heldout_sentences | text | comparison: pooled midpoint | 0.796±0.019 | 0.984±0.002 | 0.890±0.011 |  |
| heldout_sentences | relation | product: fitted | 0.965±0.010 | 1.000±0.000 | 0.983±0.005 | 0.065±0.030 (— / 0.065±0.030) |
| heldout_sentences | relation | comparison: pooled midpoint | 0.882±0.010 | 1.000±0.000 | 0.941±0.005 |  |
| heldout_sentences | landmark | product: fitted | 0.917±0.034 | 0.998±0.002 | 0.957±0.016 | 0.176±0.038 (1.000±0.000 / 0.158±0.027) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.868±0.010 | 1.000±0.000 | 0.934±0.005 |  |
| heldout_sentences | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | anchor | product: fitted | 0.988±0.017 | 1.000±0.000 | 0.994±0.008 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | anchor | comparison: pooled midpoint | 0.952±0.017 | 1.000±0.000 | 0.976±0.008 |  |
| heldout_sentences | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | amount | product: fitted | 0.954±0.016 | 1.000±0.000 | 0.977±0.008 | 0.012±0.017 (— / 0.012±0.017) |
| heldout_sentences | amount | comparison: pooled midpoint | 0.920±0.016 | 1.000±0.000 | 0.960±0.008 |  |
| heldout_sentences | unit | product: fitted | 0.966±0.028 | 1.000±0.000 | 0.983±0.014 | 0.023±0.017 (— / 0.023±0.017) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.931±0.000 | 1.000±0.000 | 0.966±0.000 |  |
| heldout_sentences | direction | product: fitted | 0.920±0.016 | 1.000±0.000 | 0.960±0.008 | 0.049±0.070 (— / 0.049±0.070) |
| heldout_sentences | direction | comparison: pooled midpoint | 0.839±0.043 | 1.000±0.000 | 0.920±0.022 |  |
| heldout_sentences | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.051±0.036 (— / 0.051±0.036) |
| heldout_sentences | axis | comparison: pooled midpoint | 0.846±0.000 | 1.000±0.000 | 0.923±0.000 |  |
| heldout_sentences | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.016±0.022 (— / 0.016±0.022) |
| heldout_sentences | layout | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | pairing | product: fitted | 0.986±0.020 | 1.000±0.000 | 0.993±0.010 | 0.088±0.071 (— / 0.088±0.071) |
| heldout_sentences | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | source | product: fitted | 0.640±0.027 | 0.995±0.004 | 0.818±0.015 | 0.615±0.102 (1.000±0.000 / 0.599±0.096) |
| heldout_sentences | source | comparison: pooled midpoint | 0.466±0.020 | 1.000±0.000 | 0.733±0.010 |  |
| heldout_sentences | target | product: fitted | 0.817±0.012 | 1.000±0.000 | 0.908±0.006 | 0.204±0.016 (— / 0.204±0.016) |
| heldout_sentences | target | comparison: pooled midpoint | 0.775±0.020 | 1.000±0.000 | 0.887±0.010 |  |
| heldout_sentences | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.016±0.022 (— / 0.016±0.022) |
| heldout_sentences | edge | comparison: pooled midpoint | 0.952±0.000 | 1.000±0.000 | 0.976±0.000 |  |
| heldout_sentences | quantity | product: fitted | 1.000±0.000 | 0.999±0.001 | 1.000±0.001 | 0.116±0.082 (1.000 / 0.091±0.074) |
| heldout_sentences | quantity | comparison: pooled midpoint | 1.000±0.000 | 0.999±0.001 | 1.000±0.001 |  |
| new_identities | object | product: fitted | 0.752±0.035 | 0.724±0.000 | 0.738±0.018 | 0.138±0.005 (0.167±0.059 / 0.137±0.003) |
| new_identities | object | comparison: pooled midpoint | 0.775±0.009 | 0.724±0.000 | 0.750±0.004 |  |
| new_identities | color | product: fitted | 0.944±0.079 | 0.994±0.005 | 0.969±0.038 | 0.371±0.203 (1.000±0.000 / 0.178±0.137) |
| new_identities | color | comparison: pooled midpoint | 0.333±0.000 | 1.000±0.000 | 0.667±0.000 |  |
| new_identities | size | product: fitted | 0.963±0.000 | 0.999±0.001 | 0.981±0.001 | 0.025±0.035 (1.000 / 0.013±0.018) |
| new_identities | size | comparison: pooled midpoint | 0.963±0.000 | 1.000±0.000 | 0.981±0.000 |  |
| new_identities | style | product: fitted | 0.667±0.094 | 0.994±0.003 | 0.830±0.047 | 0.440±0.138 (1.000±0.000 / 0.083±0.118) |
| new_identities | style | comparison: pooled midpoint | 0.600±0.000 | 0.999±0.001 | 0.800±0.001 |  |
| new_identities | text | product: fitted | 0.898±0.023 | 0.917±0.006 | 0.907±0.014 | 0.059±0.015 (0.132±0.026 / 0.052±0.019) |
| new_identities | text | comparison: pooled midpoint | 0.810±0.005 | 0.948±0.004 | 0.879±0.001 |  |
| new_identities | relation | product: fitted | 0.830±0.021 | 1.000±0.000 | 0.915±0.010 | 0.058±0.023 (— / 0.058±0.023) |
| new_identities | relation | comparison: pooled midpoint | 0.739±0.005 | 1.000±0.000 | 0.869±0.003 |  |
| new_identities | landmark | product: fitted | 0.818±0.060 | 0.998±0.001 | 0.908±0.030 | 0.166±0.013 (1.000±0.000 / 0.158±0.007) |
| new_identities | landmark | comparison: pooled midpoint | 0.735±0.014 | 1.000±0.000 | 0.867±0.007 |  |
| new_identities | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | amount | product: fitted | 0.980±0.016 | 1.000±0.000 | 0.990±0.008 | 0.028±0.032 (— / 0.028±0.032) |
| new_identities | amount | comparison: pooled midpoint | 0.960±0.008 | 1.000±0.000 | 0.980±0.004 |  |
| new_identities | unit | product: fitted | 0.987±0.012 | 1.000±0.000 | 0.993±0.006 | 0.003±0.005 (— / 0.003±0.005) |
| new_identities | unit | comparison: pooled midpoint | 0.977±0.009 | 1.000±0.000 | 0.988±0.005 |  |
| new_identities | direction | product: fitted | 0.885±0.043 | 1.000±0.000 | 0.943±0.022 | 0.107±0.073 (— / 0.107±0.073) |
| new_identities | direction | comparison: pooled midpoint | 0.690±0.123 | 1.000±0.000 | 0.845±0.061 |  |
| new_identities | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | source | product: fitted | 0.805±0.016 | 0.995±0.004 | 0.900±0.010 | 0.776±0.050 (0.833±0.167 / 0.772±0.039) |
| new_identities | source | comparison: pooled midpoint | 0.632±0.016 | 0.998±0.003 | 0.815±0.009 |  |
| new_identities | target | product: fitted | 0.678±0.016 | 1.000±0.000 | 0.839±0.008 | 0.613±0.126 (— / 0.613±0.126) |
| new_identities | target | comparison: pooled midpoint | 0.609±0.016 | 1.000±0.000 | 0.805±0.008 |  |
| new_identities | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | edge | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | quantity | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | quantity | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| train (sample) | object | product: fitted | 0.825±0.032 | 0.821±0.011 | 0.823±0.021 | 0.076±0.001 (0.048±0.067 / 0.077±0.004) |
| train (sample) | color | product: fitted | 0.771±0.029 | 0.987±0.002 | 0.879±0.014 | 0.104±0.030 (0.361±0.104 / 0.028±0.039) |
| train (sample) | size | product: fitted | 0.863±0.028 | 0.999±0.002 | 0.931±0.013 | 0.088±0.026 (1.000 / 0.068±0.002) |
| train (sample) | style | product: fitted | 0.867±0.094 | 0.995±0.004 | 0.931±0.048 | 0.254±0.184 (1.000±0.000 / 0.067±0.094) |
| train (sample) | text | product: fitted | 0.899±0.020 | 0.989±0.002 | 0.944±0.011 | 0.046±0.019 (0.000±0.000 / 0.049±0.021) |
| train (sample) | relation | product: fitted | 0.964±0.029 | 1.000±0.000 | 0.982±0.015 | 0.024±0.017 (— / 0.024±0.017) |
| train (sample) | landmark | product: fitted | 0.929±0.000 | 0.999±0.002 | 0.964±0.001 | 0.050±0.036 (1.000 / 0.038±0.031) |
| train (sample) | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | amount | product: fitted | 0.976±0.034 | 1.000±0.000 | 0.988±0.017 | 0.013±0.018 (— / 0.013±0.018) |
| train (sample) | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | pairing | product: fitted | 0.967±0.047 | 1.000±0.000 | 0.983±0.024 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | source | product: fitted | 0.806±0.023 | 0.999±0.002 | 0.902±0.012 | 0.513±0.090 (1.000 / 0.508±0.085) |
| train (sample) | target | product: fitted | 0.987±0.018 | 1.000±0.000 | 0.994±0.009 | 0.066±0.038 (— / 0.066±0.038) |
| train (sample) | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.037±0.026 (— / 0.037±0.026) |
| train (sample) | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.111±0.079 (— / 0.111±0.079) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
