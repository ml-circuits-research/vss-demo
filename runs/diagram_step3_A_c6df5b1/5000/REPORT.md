# REPORT — world `diagram`, legend sha256:1a43ffc61bd5… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
5800 annotated sentences from 3 files; provenance: {'generator': 5800}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/5000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 222 sentences
- heldout_formulations: 178 sentences
- heldout_sentences: 471 sentences
- new_identities: 400 sentences
- train: 4529 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['250', '35', '45', '90', 'analytics', 'broker', 'crawler', 'dashboard', 'gamma_ray', 'indexer', 'ingest', 'irina', 'loyalty', 'notifications', 'payroll', 'recommendations', 'registry', 'returns', 'routing', 'theta', 'tracking', 'vault', 'victor', 'zeta']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
46763 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit c6df5b1. Memory curve: runs/5000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 0.564 [rule: fit; pooled midpoint 0.760 (comparison)] (present 1.019, n 578 / absent 0.501, n 44)
- attr_presence:object: threshold 0.476 [rule: fit; pooled midpoint 0.693 (comparison)] (present 1.185, n 221 / absent 0.201, n 357)
- det_presence:object: threshold 0.590 [rule: fit; pooled midpoint 0.769 (comparison)] (present 1.397, n 216 / absent 0.140, n 362)
- presence:color: threshold 0.133 [rule: fit; pooled midpoint 0.407 (comparison)] (present 0.764, n 26 / absent 0.051, n 596)
- presence:size: threshold 0.220 [rule: fit; pooled midpoint 0.305 (comparison)] (present 0.531, n 49 / absent 0.079, n 573)
- presence:style: threshold 0.094 [rule: fit; pooled midpoint 0.118 (comparison)] (present 0.218, n 17 / absent 0.018, n 605)
- presence:text: threshold 0.182 [rule: fit; pooled midpoint 0.303 (comparison)] (present 0.543, n 82 / absent 0.063, n 540)
- presence:relation: threshold 0.136 [rule: fit; pooled midpoint 0.315 (comparison)] (present 0.628, n 75 / absent 0.003, n 547)
- presence:landmark: threshold 0.168 [rule: fit; pooled midpoint 0.400 (comparison)] (present 0.729, n 75 / absent 0.070, n 547)
- presence:region: threshold 0.384 [rule: fit; pooled midpoint 0.564 (comparison)] (present 1.078, n 43 / absent 0.050, n 579)
- presence:anchor: threshold 0.393 [rule: fit; pooled midpoint 0.474 (comparison)] (present 0.930, n 36 / absent 0.018, n 586)
- presence:fraction: threshold 0.322 [rule: fit; pooled midpoint 0.362 (comparison)] (present 0.674, n 24 / absent 0.050, n 598)
- presence:amount: threshold 0.105 [rule: fit; pooled midpoint 0.235 (comparison)] (present 0.470, n 29 / absent 0.001, n 593)
- presence:unit: threshold 0.212 [rule: fit; pooled midpoint 0.302 (comparison)] (present 0.539, n 29 / absent 0.065, n 593)
- presence:direction: threshold 0.223 [rule: fit; pooled midpoint 0.311 (comparison)] (present 0.604, n 29 / absent 0.018, n 593)
- presence:axis: threshold 0.265 [rule: fit; pooled midpoint 0.384 (comparison)] (present 0.740, n 22 / absent 0.029, n 600)
- presence:layout: threshold 0.448 [rule: fit; pooled midpoint 0.450 (comparison)] (present 0.898, n 17 / absent 0.003, n 605)
- presence:pairing: threshold 0.169 [rule: fit; pooled midpoint 0.174 (comparison)] (present 0.342, n 18 / absent 0.006, n 604)
- presence:source: threshold 0.196 [rule: fit; pooled midpoint 0.350 (comparison)] (present 0.657, n 73 / absent 0.043, n 549)
- presence:target: threshold 0.459 [rule: fit; pooled midpoint 0.444 (comparison)] (present 0.806, n 55 / absent 0.081, n 567)
- presence:quantity: threshold 0.071 [rule: fit; pooled midpoint 0.078 (comparison)] (present 0.161, n 22 / absent -0.005, n 600)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.005, color 0.083, size 0.143, style 0.200, text 0.013, relation 0.167, landmark 0.006, region 0.111, anchor 0.250, fraction 0.333, amount 0.043, unit 0.500, direction 0.167, axis 0.500, layout 0.143, pairing 0.500, source 0.006, target 0.006, quantity 0.043, predicate 0.019

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 178 of 178)
| axis | accuracy |
|---|---|
| FULL | 0.713±0.050 |
| FULL [depth given] | 0.713±0.050 |
| FULL [depth and negation given] | 0.713±0.050 |
| FULL [presence not decided] | 0.472±0.017 |
| FULL [pooled midpoint (comparison)] | 0.575±0.025 |
| presence object: present read present | 0.882±0.043 |
| presence object: share of 'present' readings that abstain | 0.169±0.006 |
| presence object: share of true 'present' readings that abstain | 0.169±0.006 |
| presence color: absent read absent | 0.970±0.007 |
| presence size: absent read absent | 0.982±0.010 |
| presence style: absent read absent | 0.998±0.003 |
| presence text: absent read absent | 0.985±0.003 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.996±0.006 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.995±0.003 |
| presence target: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.994±0.005 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.994±0.005 |
| event type (synonym table) | 0.994±0.005 |
| role object | 0.824±0.045 |
| head object | 0.845±0.046 |
| lexical order head object | 0.809±0.000 |
| lexical bag head object | 0.944±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.876±0.037 |
| occupancy: known filler | 0.911±0.023 |
| role color | 0.970±0.007 |
| head color | 0.970±0.007 |
| lexical order head color | 1.000±0.000 |
| lexical bag head color | 0.994±0.000 |
| occupancy: not given | 0.996±0.001 |
| role size | 0.983±0.009 |
| head size | 0.983±0.009 |
| lexical order head size | 0.933±0.000 |
| lexical bag head size | 0.961±0.000 |
| role style | 0.989±0.000 |
| head style | 0.989±0.000 |
| lexical order head style | 0.966±0.000 |
| lexical bag head style | 0.966±0.000 |
| role text | 0.979±0.007 |
| head text | 0.979±0.007 |
| lexical order head text | 0.865±0.000 |
| lexical bag head text | 0.916±0.000 |
| role relation | 0.981±0.003 |
| head relation | 0.981±0.003 |
| lexical order head relation | 0.882±0.000 |
| lexical bag head relation | 0.882±0.000 |
| role landmark | 0.959±0.007 |
| head landmark | 0.970±0.007 |
| lexical order head landmark | 0.882±0.000 |
| lexical bag head landmark | 0.865±0.000 |
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
| lexical bag head fraction | 0.961±0.000 |
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
| role source | 0.936±0.023 |
| head source | 0.946±0.021 |
| lexical order head source | 0.831±0.000 |
| lexical bag head source | 0.831±0.000 |
| role target | 0.946±0.013 |
| head target | 0.966±0.020 |
| lexical order head target | 0.837±0.000 |
| lexical bag head target | 0.837±0.000 |
| role quantity | 0.996±0.003 |
| head quantity | 0.996±0.003 |
| lexical order head quantity | 0.910±0.000 |
| lexical bag head quantity | 0.910±0.000 |
| heads FULL (model) | 0.751±0.056 |
| heads FULL (lexical order baseline) | 0.292±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.354±0.000 |
| role object [presence not decided] | 0.923±0.005 |
| role color [presence not decided] | 0.736±0.000 |
| role size [presence not decided] | 0.882±0.000 |
| role style [presence not decided] | 0.899±0.000 |
| role text [presence not decided] | 0.976±0.011 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.884±0.003 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 1.000±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 1.000±0.000 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.882±0.020 |
| role target [presence not decided] | 0.918±0.010 |
| role quantity [presence not decided] | 1.000±0.000 |
| heads FULL (model) [presence not decided] | 0.472±0.017 |
| role object [pooled midpoint (comparison)] | 0.670±0.019 |
| role color [pooled midpoint (comparison)] | 1.000±0.000 |
| role size [pooled midpoint (comparison)] | 0.985±0.003 |
| role style [pooled midpoint (comparison)] | 0.983±0.005 |
| role text [pooled midpoint (comparison)] | 0.953±0.007 |
| role relation [pooled midpoint (comparison)] | 0.972±0.000 |
| role landmark [pooled midpoint (comparison)] | 0.951±0.005 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 1.000±0.000 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.998±0.003 |
| role unit [pooled midpoint (comparison)] | 1.000±0.000 |
| role direction [pooled midpoint (comparison)] | 0.994±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.940±0.025 |
| role target [pooled midpoint (comparison)] | 0.948±0.011 |
| role quantity [pooled midpoint (comparison)] | 0.991±0.007 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.631±0.014 |
| presence object: present read present [pooled midpoint (comparison)] | 0.757±0.015 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 0.996±0.003 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.974±0.005 |
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
| presence object: absent read absent | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.222±0.157 |
| presence direction: share of true 'present' readings that abstain | 0.222±0.157 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.667±0.000 |
| presence relation: present read present | 0.869±0.022 |
| presence relation: share of 'present' readings that abstain | 0.037±0.026 |
| presence relation: share of true 'present' readings that abstain | 0.037±0.026 |
| presence landmark: present read present | 0.869±0.022 |
| presence landmark: share of 'present' readings that abstain | 0.420±0.036 |
| presence landmark: share of true 'present' readings that abstain | 0.398±0.056 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.800±0.000 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.800±0.000 |
| presence color: share of 'present' readings that abstain | 0.850±0.108 |
| presence color: share of FALSE 'present' readings that abstain | 0.850±0.108 |
| presence text: present read present | 0.958±0.059 |
| presence text: share of 'present' readings that abstain | 0.106±0.013 |
| presence text: share of true 'present' readings that abstain | 0.072±0.037 |
| presence text: present read present [pooled midpoint (comparison)] | 0.843±0.019 |
| presence source: present read present | 0.967±0.047 |
| presence source: share of 'present' readings that abstain | 0.853±0.022 |
| presence source: share of true 'present' readings that abstain | 0.849±0.024 |
| presence target: present read present | 0.966±0.028 |
| presence target: share of 'present' readings that abstain | 0.525±0.082 |
| presence target: share of true 'present' readings that abstain | 0.525±0.082 |
| presence source: present read present [pooled midpoint (comparison)] | 0.967±0.000 |
| presence target: present read present [pooled midpoint (comparison)] | 0.966±0.000 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.300±0.108 |
| presence size: share of true 'present' readings that abstain | 0.139±0.039 |
| presence size: present read present [pooled midpoint (comparison)] | 0.833±0.000 |
| presence quantity: present read present | 0.958±0.029 |
| presence quantity: share of 'present' readings that abstain | 0.369±0.027 |
| presence quantity: share of true 'present' readings that abstain | 0.369±0.027 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.896±0.078 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.037±0.052 |
| presence fraction: share of true 'present' readings that abstain | 0.037±0.052 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.067±0.094 |
| presence amount: share of true 'present' readings that abstain | 0.067±0.094 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.933±0.094 |
| presence unit: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: present read present | 0.722±0.079 |
| presence style: share of 'present' readings that abstain | 0.417±0.118 |
| presence style: share of true 'present' readings that abstain | 0.383±0.103 |
| presence style: present read present [pooled midpoint (comparison)] | 0.500±0.136 |
| presence text: share of FALSE 'present' readings that abstain | 0.389±0.283 |
| presence size: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.103±0.027; status {'abstain': 77, 'ok': 99, 'no-sense': 2}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.989 | 0.455 / 0.335 | 1.00 | 0.011 | 0.000 / 0.000 |
| role object | 0.780 | 0.159 / 0.000 | 0.71 | 0.029 | 0.098 / 0.191 |
| roles (pooled) | 0.788 | 0.144 / 0.000 | 0.67 | 0.029 | 0.146 / 0.183 |
| role direction | 1.000 | 0.225 / 0.062 | 0.67 | 0.000 | 0.333 / 0.000 |
| role relation | 0.857 | 0.180 / 0.000 | 0.81 | 0.000 | 0.048 / 0.143 |
| role landmark | 0.714 | 0.067 / 0.021 | 0.52 | 0.048 | 0.238 / 0.238 |
| role text | 0.958 | 0.190 / 0.084 | 0.92 | 0.000 | 0.042 / 0.042 |
| role source | 0.433 | 0.024 / 0.001 | 0.13 | 0.100 | 0.400 / 0.467 |
| role target | 0.552 | 0.036 / 0.001 | 0.34 | 0.069 | 0.276 / 0.379 |
| role size | 1.000 | 0.196 / 0.024 | 0.83 | 0.000 | 0.167 / 0.000 |
| role quantity | 1.000 | 0.087 / 0.021 | 0.62 | 0.000 | 0.375 / 0.000 |
| role anchor | 1.000 | 0.259 / 0.223 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.213 / 0.174 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.294 / 0.238 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 1.000 | 0.225 / 0.140 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.192 / 0.159 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 1.000 | 0.080 / 0.080 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 0.667 | 0.075 / 0.000 | 0.33 | 0.000 | 0.333 / 0.333 |

### heldout_sentences — catalog candidates (n = 471 of 471)
| axis | accuracy |
|---|---|
| FULL | 0.727±0.024 |
| FULL [depth given] | 0.727±0.024 |
| FULL [depth and negation given] | 0.727±0.024 |
| FULL [pooled midpoint (comparison)] | 0.597±0.003 |
| presence object: present read present | 0.936±0.027 |
| presence object: share of 'present' readings that abstain | 0.068±0.003 |
| presence object: share of true 'present' readings that abstain | 0.072±0.002 |
| presence color: absent read absent | 0.973±0.002 |
| presence size: absent read absent | 0.999±0.001 |
| presence style: absent read absent | 0.994±0.005 |
| presence text: absent read absent | 0.987±0.002 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.996±0.002 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.030±0.043 |
| presence layout: share of true 'present' readings that abstain | 0.016±0.022 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.998±0.002 |
| presence target: absent read absent | 0.998±0.002 |
| presence quantity: absent read absent | 0.999±0.001 |
| structure (depth, negation) | 0.995±0.002 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.995±0.002 |
| event type (synonym table) | 0.995±0.002 |
| role object | 0.843±0.018 |
| head object | 0.867±0.019 |
| lexical order head object | 0.843±0.000 |
| lexical bag head object | 0.900±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.792±0.031 |
| occupancy: known filler | 0.901±0.015 |
| role color | 0.965±0.004 |
| head color | 0.965±0.004 |
| lexical order head color | 0.966±0.000 |
| lexical bag head color | 0.983±0.000 |
| occupancy: not given | 0.993±0.000 |
| role size | 0.992±0.001 |
| head size | 0.992±0.001 |
| lexical order head size | 0.941±0.000 |
| lexical bag head size | 0.989±0.000 |
| role style | 0.987±0.006 |
| head style | 0.987±0.006 |
| lexical order head style | 0.975±0.000 |
| lexical bag head style | 0.975±0.000 |
| role text | 0.967±0.004 |
| head text | 0.967±0.004 |
| lexical order head text | 0.832±0.000 |
| lexical bag head text | 0.932±0.000 |
| role relation | 0.996±0.001 |
| head relation | 0.996±0.001 |
| lexical order head relation | 0.898±0.000 |
| lexical bag head relation | 0.955±0.000 |
| role landmark | 0.965±0.003 |
| head landmark | 0.987±0.003 |
| lexical order head landmark | 0.898±0.000 |
| lexical bag head landmark | 0.907±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.926±0.000 |
| lexical bag head region | 0.945±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.941±0.000 |
| lexical bag head anchor | 0.992±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.985±0.000 |
| lexical bag head fraction | 0.989±0.000 |
| role amount | 0.996±0.003 |
| head amount | 0.996±0.003 |
| lexical order head amount | 0.938±0.000 |
| lexical bag head amount | 0.953±0.000 |
| role unit | 0.998±0.002 |
| head unit | 0.998±0.002 |
| lexical order head unit | 0.938±0.000 |
| lexical bag head unit | 0.953±0.000 |
| role direction | 0.994±0.002 |
| head direction | 0.994±0.002 |
| lexical order head direction | 0.938±0.000 |
| lexical bag head direction | 0.966±0.000 |
| role axis | 0.999±0.001 |
| head axis | 0.999±0.001 |
| lexical order head axis | 0.972±0.000 |
| lexical bag head axis | 0.989±0.000 |
| role layout | 0.999±0.001 |
| head layout | 0.999±0.001 |
| lexical order head layout | 0.955±0.000 |
| lexical bag head layout | 0.972±0.000 |
| role pairing | 0.999±0.001 |
| head pairing | 0.999±0.001 |
| lexical order head pairing | 0.951±0.000 |
| lexical bag head pairing | 0.966±0.000 |
| role source | 0.895±0.006 |
| head source | 0.924±0.003 |
| lexical order head source | 0.860±0.000 |
| lexical bag head source | 0.911±0.000 |
| role target | 0.965±0.004 |
| head target | 0.977±0.006 |
| lexical order head target | 0.909±0.000 |
| lexical bag head target | 0.951±0.000 |
| role quantity | 0.999±0.001 |
| head quantity | 0.999±0.001 |
| lexical order head quantity | 0.977±0.000 |
| lexical bag head quantity | 0.998±0.000 |
| heads FULL (model) | 0.783±0.020 |
| heads FULL (lexical order baseline) | 0.204±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.531±0.000 |
| role object [pooled midpoint (comparison)] | 0.748±0.004 |
| role color [pooled midpoint (comparison)] | 0.979±0.001 |
| role size [pooled midpoint (comparison)] | 0.987±0.003 |
| role style [pooled midpoint (comparison)] | 0.991±0.002 |
| role text [pooled midpoint (comparison)] | 0.948±0.004 |
| role relation [pooled midpoint (comparison)] | 0.989±0.001 |
| role landmark [pooled midpoint (comparison)] | 0.960±0.001 |
| role region [pooled midpoint (comparison)] | 0.999±0.001 |
| role anchor [pooled midpoint (comparison)] | 0.996±0.001 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.996±0.002 |
| role unit [pooled midpoint (comparison)] | 0.998±0.002 |
| role direction [pooled midpoint (comparison)] | 0.987±0.000 |
| role axis [pooled midpoint (comparison)] | 0.996±0.000 |
| role layout [pooled midpoint (comparison)] | 0.999±0.001 |
| role pairing [pooled midpoint (comparison)] | 0.999±0.001 |
| role source [pooled midpoint (comparison)] | 0.902±0.004 |
| role target [pooled midpoint (comparison)] | 0.967±0.003 |
| role quantity [pooled midpoint (comparison)] | 0.998±0.002 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.656±0.006 |
| presence object: present read present [pooled midpoint (comparison)] | 0.809±0.012 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.985±0.000 |
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
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence layout: absent read absent | 0.999±0.001 |
| presence region: present read present [pooled midpoint (comparison)] | 0.990±0.013 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence object: absent read absent | 0.481±0.052 |
| presence direction: present read present | 0.908±0.033 |
| presence direction: share of 'present' readings that abstain | 0.064±0.047 |
| presence direction: share of true 'present' readings that abstain | 0.064±0.047 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.642±0.009 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.793±0.000 |
| presence text: present read present | 0.869±0.022 |
| presence text: share of 'present' readings that abstain | 0.077±0.021 |
| presence text: share of true 'present' readings that abstain | 0.067±0.028 |
| presence text: present read present [pooled midpoint (comparison)] | 0.774±0.017 |
| presence pairing: present read present | 0.986±0.020 |
| presence pairing: share of 'present' readings that abstain | 0.075±0.078 |
| presence pairing: share of true 'present' readings that abstain | 0.075±0.078 |
| presence source: present read present | 0.556±0.019 |
| presence source: share of 'present' readings that abstain | 0.698±0.069 |
| presence source: share of true 'present' readings that abstain | 0.698±0.064 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.971±0.020 |
| presence source: present read present [pooled midpoint (comparison)] | 0.530±0.012 |
| presence color: present read present | 0.729±0.147 |
| presence color: present read present [pooled midpoint (comparison)] | 0.396±0.029 |
| presence size: present read present | 0.881±0.017 |
| presence size: share of 'present' readings that abstain | 0.106±0.100 |
| presence size: share of true 'present' readings that abstain | 0.093±0.105 |
| presence size: present read present [pooled midpoint (comparison)] | 0.786±0.051 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.141±0.077 |
| presence quantity: share of true 'present' readings that abstain | 0.091±0.074 |
| presence quantity: present read present [pooled midpoint (comparison)] | 0.970±0.043 |
| presence style: share of 'present' readings that abstain | 0.341±0.117 |
| presence style: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: present read present | 0.965±0.010 |
| presence relation: share of 'present' readings that abstain | 0.050±0.026 |
| presence relation: share of true 'present' readings that abstain | 0.050±0.026 |
| presence landmark: present read present | 0.944±0.035 |
| presence landmark: share of 'present' readings that abstain | 0.334±0.020 |
| presence landmark: share of true 'present' readings that abstain | 0.309±0.035 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.889±0.010 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.868±0.010 |
| presence target: present read present | 0.829±0.029 |
| presence target: share of 'present' readings that abstain | 0.405±0.047 |
| presence target: share of true 'present' readings that abstain | 0.394±0.054 |
| presence target: present read present [pooled midpoint (comparison)] | 0.837±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.060±0.017 |
| presence anchor: share of true 'present' readings that abstain | 0.060±0.017 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.940±0.017 |
| presence axis: present read present | 0.974±0.036 |
| presence axis: share of 'present' readings that abstain | 0.079±0.063 |
| presence axis: share of true 'present' readings that abstain | 0.079±0.063 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.846±0.000 |
| presence object: share of FALSE 'present' readings that abstain | 0.013±0.018 |
| presence style: present read present | 0.694±0.039 |
| presence style: share of true 'present' readings that abstain | 0.157±0.046 |
| presence style: present read present [pooled midpoint (comparison)] | 0.694±0.104 |
| presence amount: present read present | 0.943±0.043 |
| presence amount: share of 'present' readings that abstain | 0.011±0.016 |
| presence amount: share of true 'present' readings that abstain | 0.011±0.016 |
| presence unit: present read present | 0.966±0.028 |
| presence unit: share of 'present' readings that abstain | 0.024±0.017 |
| presence unit: share of true 'present' readings that abstain | 0.024±0.017 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.931±0.028 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.966±0.028 |
| presence color: share of 'present' readings that abstain | 0.575±0.025 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: share of true 'present' readings that abstain | 0.122±0.110 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 0.178±0.137 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence layout: share of FALSE 'present' readings that abstain | nan±nan |
| presence size: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.103±0.020; status {'ok': 339, 'abstain': 129, 'no-sense': 3}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.994 | 0.453 / 0.354 | 1.00 | 0.006 | 0.000 / 0.000 |
| role object | 0.873 | 0.198 / 0.002 | 0.85 | 0.026 | 0.053 / 0.101 |
| roles (pooled) | 0.835 | 0.179 / 0.000 | 0.79 | 0.025 | 0.074 / 0.140 |
| role layout | 1.000 | 0.274 / 0.212 | 0.95 | 0.000 | 0.048 / 0.000 |
| role region | 1.000 | 0.290 / 0.220 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.931 | 0.230 / 0.036 | 0.83 | 0.000 | 0.103 / 0.069 |
| role text | 0.899 | 0.190 / 0.013 | 0.81 | 0.000 | 0.089 / 0.101 |
| role pairing | 1.000 | 0.208 / 0.076 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.212 | 0.020 / 0.000 | 0.12 | 0.106 | 0.197 / 0.682 |
| role color | 0.625 | 0.119 / 0.000 | 0.56 | 0.000 | 0.062 / 0.375 |
| role size | 0.893 | 0.160 / 0.002 | 0.86 | 0.000 | 0.036 / 0.107 |
| role quantity | 1.000 | 0.124 / 0.053 | 0.91 | 0.000 | 0.091 / 0.000 |
| role relation | 0.979 | 0.206 / 0.070 | 0.90 | 0.000 | 0.083 / 0.021 |
| role landmark | 0.729 | 0.071 / 0.005 | 0.71 | 0.125 | 0.146 / 0.146 |
| role target | 0.558 | 0.046 / 0.000 | 0.42 | 0.023 | 0.163 / 0.419 |
| role anchor | 1.000 | 0.269 / 0.192 | 0.93 | 0.000 | 0.071 / 0.000 |
| role axis | 1.000 | 0.270 / 0.057 | 0.85 | 0.000 | 0.154 / 0.000 |
| role style | 0.667 | 0.093 / 0.000 | 0.58 | 0.000 | 0.083 / 0.333 |
| role amount | 1.000 | 0.216 / 0.134 | 0.97 | 0.000 | 0.034 / 0.000 |
| role unit | 0.966 | 0.211 / 0.126 | 0.97 | 0.000 | 0.000 / 0.034 |
| role fraction | 1.000 | 0.238 / 0.215 | 1.00 | 0.000 | 0.000 / 0.000 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.673±0.041 |
| FULL [depth given] | 0.673±0.041 |
| FULL [depth and negation given] | 0.673±0.041 |
| FULL [pooled midpoint (comparison)] | 0.452±0.026 |
| presence object: present read present | 0.889±0.048 |
| presence object: share of 'present' readings that abstain | 0.125±0.021 |
| presence object: share of true 'present' readings that abstain | 0.129±0.022 |
| presence color: absent read absent | 0.983±0.007 |
| presence size: present read present | 0.963±0.000 |
| presence size: share of 'present' readings that abstain | 0.012±0.017 |
| presence size: share of true 'present' readings that abstain | 0.000±0.000 |
| presence style: absent read absent | 0.996±0.003 |
| presence text: absent read absent | 0.941±0.008 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.992±0.007 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.970±0.024 |
| presence amount: share of 'present' readings that abstain | 0.052±0.035 |
| presence amount: share of true 'present' readings that abstain | 0.052±0.035 |
| presence unit: present read present | 0.990±0.008 |
| presence unit: share of 'present' readings that abstain | 0.034±0.025 |
| presence unit: share of true 'present' readings that abstain | 0.034±0.025 |
| presence direction: absent read absent | 1.000±0.000 |
| presence axis: absent read absent | 1.000±0.000 |
| presence layout: absent read absent | 1.000±0.000 |
| presence pairing: absent read absent | 1.000±0.000 |
| presence source: absent read absent | 0.995±0.004 |
| presence target: absent read absent | 1.000±0.000 |
| presence quantity: absent read absent | 0.998±0.001 |
| structure (depth, negation) | 0.998±0.002 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.998±0.002 |
| event type (synonym table) | 0.998±0.002 |
| role object | 0.818±0.048 |
| head object | 0.847±0.046 |
| lexical order head object | 0.920±0.000 |
| lexical bag head object | 0.877±0.000 |
| occupancy: known filler | 0.939±0.018 |
| role color | 0.983±0.008 |
| head color | 0.983±0.008 |
| lexical order head color | 0.985±0.000 |
| lexical bag head color | 0.993±0.000 |
| occupancy: not given | 0.994±0.001 |
| role size | 0.997±0.001 |
| head size | 0.997±0.001 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.988±0.000 |
| role style | 0.991±0.005 |
| head style | 0.991±0.005 |
| lexical order head style | 0.988±0.000 |
| lexical bag head style | 0.988±0.000 |
| role text | 0.909±0.010 |
| head text | 0.909±0.010 |
| lexical order head text | 0.535±0.000 |
| lexical bag head text | 0.745±0.000 |
| role relation | 0.975±0.005 |
| head relation | 0.975±0.005 |
| lexical order head relation | 0.790±0.000 |
| lexical bag head relation | 0.865±0.000 |
| role landmark | 0.909±0.005 |
| head landmark | 0.954±0.005 |
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
| role amount | 0.993±0.006 |
| head amount | 0.993±0.006 |
| lexical order head amount | 0.750±0.000 |
| lexical bag head amount | 0.838±0.000 |
| occupancy: unknown filler | 0.816±0.031 |
| role unit | 0.998±0.002 |
| head unit | 0.998±0.002 |
| lexical order head unit | 0.750±0.000 |
| lexical bag head unit | 0.838±0.000 |
| role direction | 0.987±0.003 |
| head direction | 0.987±0.003 |
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
| role source | 0.953±0.004 |
| head source | 0.953±0.004 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.948±0.000 |
| role target | 0.971±0.005 |
| head target | 0.974±0.006 |
| lexical order head target | 0.927±0.000 |
| lexical bag head target | 0.953±0.000 |
| role quantity | 0.998±0.001 |
| head quantity | 0.998±0.001 |
| lexical order head quantity | 1.000±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.718±0.037 |
| heads FULL (lexical order baseline) | 0.060±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.367±0.000 |
| role object [pooled midpoint (comparison)] | 0.613±0.033 |
| role color [pooled midpoint (comparison)] | 0.990±0.000 |
| role size [pooled midpoint (comparison)] | 0.998±0.000 |
| role style [pooled midpoint (comparison)] | 0.992±0.003 |
| role text [pooled midpoint (comparison)] | 0.863±0.005 |
| role relation [pooled midpoint (comparison)] | 0.940±0.000 |
| role landmark [pooled midpoint (comparison)] | 0.891±0.001 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 0.999±0.001 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.987±0.003 |
| role unit [pooled midpoint (comparison)] | 0.993±0.002 |
| role direction [pooled midpoint (comparison)] | 0.965±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.962±0.004 |
| role target [pooled midpoint (comparison)] | 0.970±0.004 |
| role quantity [pooled midpoint (comparison)] | 0.999±0.001 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.510±0.025 |
| presence object: present read present [pooled midpoint (comparison)] | 0.681±0.037 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.963±0.000 |
| presence style: absent read absent [pooled midpoint (comparison)] | 0.997±0.005 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.932±0.006 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.956±0.013 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.980±0.008 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence axis: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence layout: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence pairing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence target: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence quantity: absent read absent [pooled midpoint (comparison)] | 0.999±0.001 |
| presence size: absent read absent | 0.999±0.001 |
| presence amount: absent read absent | 1.000±0.000 |
| presence unit: absent read absent | 1.000±0.000 |
| presence size: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: present read present | 0.873±0.014 |
| presence text: present read present [pooled midpoint (comparison)] | 0.787±0.006 |
| presence text: share of 'present' readings that abstain | 0.078±0.010 |
| presence text: share of true 'present' readings that abstain | 0.055±0.009 |
| presence text: share of FALSE 'present' readings that abstain | 0.366±0.027 |
| presence relation: present read present | 0.892±0.026 |
| presence relation: share of 'present' readings that abstain | 0.098±0.030 |
| presence relation: share of true 'present' readings that abstain | 0.098±0.030 |
| presence landmark: present read present | 0.843±0.043 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.738±0.004 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.738±0.004 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.974±0.036 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present | 0.701±0.114 |
| presence source: share of 'present' readings that abstain | 0.863±0.066 |
| presence source: share of true 'present' readings that abstain | 0.848±0.077 |
| presence target: present read present | 0.678±0.081 |
| presence target: share of 'present' readings that abstain | 0.490±0.133 |
| presence target: share of true 'present' readings that abstain | 0.490±0.133 |
| determiner identity (outside FULL when the legend excludes it) | 0.936±0.042 |
| presence source: present read present [pooled midpoint (comparison)] | 0.713±0.059 |
| presence target: present read present [pooled midpoint (comparison)] | 0.678±0.059 |
| presence landmark: share of 'present' readings that abstain | 0.358±0.024 |
| presence landmark: share of true 'present' readings that abstain | 0.334±0.040 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 0.816±0.043 |
| presence direction: share of 'present' readings that abstain | 0.199±0.057 |
| presence direction: share of true 'present' readings that abstain | 0.199±0.057 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.523±0.009 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: share of 'present' readings that abstain | 0.500±0.000 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence object: absent read absent | 0.051±0.036 |
| presence object: share of FALSE 'present' readings that abstain | 0.000±0.000 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.282±0.145 |
| presence color: share of 'present' readings that abstain | 0.542±0.152 |
| presence color: share of FALSE 'present' readings that abstain | 0.967±0.047 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: present read present | 0.600±0.163 |
| presence style: share of true 'present' readings that abstain | 0.167±0.236 |
| presence style: present read present [pooled midpoint (comparison)] | 0.600±0.163 |
| presence color: present read present | 0.944±0.079 |
| presence color: share of true 'present' readings that abstain | 0.111±0.157 |
| presence color: present read present [pooled midpoint (comparison)] | 0.333±0.000 |
| presence size: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.122±0.023; status {'ok': 250, 'abstain': 148, 'no-sense': 2}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.995 | 0.437 / 0.344 | 1.00 | 0.005 | 0.000 / 0.000 |
| role object | 0.827 | 0.146 / 0.000 | 0.74 | 0.031 | 0.121 / 0.142 |
| roles (pooled) | 0.849 | 0.158 / 0.000 | 0.77 | 0.023 | 0.097 / 0.128 |
| role size | 0.963 | 0.175 / 0.094 | 0.96 | 0.000 | 0.000 / 0.037 |
| role amount | 1.000 | 0.212 / 0.118 | 0.99 | 0.000 | 0.010 / 0.000 |
| role unit | 1.000 | 0.219 / 0.128 | 1.00 | 0.000 | 0.000 / 0.000 |
| role text | 0.892 | 0.194 / 0.000 | 0.83 | 0.000 | 0.059 / 0.108 |
| role relation | 0.893 | 0.157 / 0.001 | 0.79 | 0.000 | 0.107 / 0.107 |
| role landmark | 0.631 | 0.059 / 0.000 | 0.62 | 0.143 | 0.155 / 0.226 |
| role anchor | 1.000 | 0.264 / 0.147 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.180 / 0.160 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.414 | 0.014 / 0.000 | 0.10 | 0.034 | 0.345 / 0.552 |
| role target | 0.552 | 0.031 / 0.000 | 0.28 | 0.000 | 0.276 / 0.448 |
| role region | 1.000 | 0.272 / 0.214 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.828 | 0.120 / 0.000 | 0.62 | 0.000 | 0.207 / 0.172 |
| role style | 0.400 | 0.067 / 0.000 | 0.40 | 0.000 | 0.000 / 0.600 |
| role color | 1.000 | 0.137 / 0.011 | 0.67 | 0.000 | 0.333 / 0.000 |

### train (sample) — catalog candidates (n = 300 of 4529)
| axis | accuracy |
|---|---|
| FULL | 0.777±0.014 |
| FULL [depth given] | 0.777±0.014 |
| FULL [depth and negation given] | 0.777±0.014 |
| presence object: present read present | 0.952±0.024 |
| presence object: share of 'present' readings that abstain | 0.081±0.015 |
| presence object: share of true 'present' readings that abstain | 0.081±0.013 |
| presence color: absent read absent | 0.965±0.013 |
| presence size: absent read absent | 0.999±0.002 |
| presence style: absent read absent | 0.994±0.004 |
| presence text: present read present | 0.870±0.018 |
| presence text: share of 'present' readings that abstain | 0.136±0.043 |
| presence text: share of true 'present' readings that abstain | 0.125±0.043 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.998±0.002 |
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
| presence target: absent read absent | 0.999±0.002 |
| presence quantity: absent read absent | 1.000±0.000 |
| structure (depth, negation) | 0.989±0.003 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.989±0.003 |
| event type (synonym table) | 0.989±0.003 |
| role object | 0.889±0.023 |
| head object | 0.906±0.020 |
| lexical order head object | 0.870±0.000 |
| lexical bag head object | 0.960±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.863±0.044 |
| occupancy: known filler | 0.929±0.013 |
| role color | 0.958±0.013 |
| head color | 0.958±0.013 |
| lexical order head color | 0.957±0.000 |
| lexical bag head color | 0.990±0.000 |
| occupancy: not given | 0.995±0.001 |
| role size | 0.987±0.003 |
| head size | 0.987±0.003 |
| lexical order head size | 0.923±0.000 |
| lexical bag head size | 0.993±0.000 |
| role style | 0.992±0.004 |
| head style | 0.992±0.004 |
| lexical order head style | 0.980±0.000 |
| lexical bag head style | 0.983±0.000 |
| role text | 0.973±0.003 |
| head text | 0.973±0.003 |
| lexical order head text | 0.847±0.000 |
| lexical bag head text | 1.000±0.000 |
| role relation | 0.997±0.000 |
| head relation | 0.997±0.000 |
| lexical order head relation | 0.900±0.000 |
| lexical bag head relation | 0.990±0.000 |
| role landmark | 0.977±0.003 |
| head landmark | 0.990±0.003 |
| lexical order head landmark | 0.900±0.000 |
| lexical bag head landmark | 0.923±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.917±0.000 |
| lexical bag head region | 1.000±0.000 |
| role anchor | 0.999±0.002 |
| head anchor | 0.999±0.002 |
| lexical order head anchor | 0.943±0.000 |
| lexical bag head anchor | 1.000±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.987±0.000 |
| lexical bag head fraction | 0.993±0.000 |
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
| lexical order head amount | 0.907±0.000 |
| lexical bag head amount | 0.980±0.000 |
| role unit | 1.000±0.000 |
| head unit | 1.000±0.000 |
| lexical order head unit | 0.907±0.000 |
| lexical bag head unit | 0.980±0.000 |
| role direction | 0.998±0.003 |
| head direction | 0.998±0.003 |
| lexical order head direction | 0.953±0.000 |
| lexical bag head direction | 0.990±0.000 |
| role axis | 1.000±0.000 |
| head axis | 1.000±0.000 |
| lexical order head axis | 0.970±0.000 |
| lexical bag head axis | 1.000±0.000 |
| role layout | 1.000±0.000 |
| head layout | 1.000±0.000 |
| lexical order head layout | 0.977±0.000 |
| lexical bag head layout | 1.000±0.000 |
| role pairing | 0.999±0.002 |
| head pairing | 0.999±0.002 |
| lexical order head pairing | 0.980±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.946±0.004 |
| head source | 0.960±0.005 |
| lexical order head source | 0.890±0.000 |
| lexical bag head source | 0.977±0.000 |
| role target | 0.969±0.004 |
| head target | 0.989±0.004 |
| lexical order head target | 0.910±0.000 |
| lexical bag head target | 0.950±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.980±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.820±0.018 |
| heads FULL (lexical order baseline) | 0.237±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.790±0.000 |
| presence style: present read present | 0.889±0.079 |
| presence text: absent read absent | 0.992±0.000 |
| presence color: present read present | 0.795±0.073 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present | 0.952±0.067 |
| presence direction: share of 'present' readings that abstain | 0.075±0.059 |
| presence direction: share of true 'present' readings that abstain | 0.075±0.059 |
| presence object: absent read absent | 0.396±0.059 |
| presence object: share of FALSE 'present' readings that abstain | 0.074±0.105 |
| presence source: present read present | 0.717±0.038 |
| presence source: share of 'present' readings that abstain | 0.697±0.139 |
| presence source: share of true 'present' readings that abstain | 0.697±0.139 |
| presence target: present read present | 0.938±0.035 |
| presence color: share of 'present' readings that abstain | 0.462±0.076 |
| presence color: share of FALSE 'present' readings that abstain | 0.849±0.057 |
| presence target: share of 'present' readings that abstain | 0.353±0.094 |
| presence target: share of true 'present' readings that abstain | 0.345±0.093 |
| presence size: present read present | 0.841±0.020 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.000±0.000 |
| presence quantity: share of true 'present' readings that abstain | 0.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.153±0.041 |
| presence size: share of true 'present' readings that abstain | 0.139±0.027 |
| presence pairing: present read present | 0.944±0.079 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.048±0.045 |
| presence amount: share of true 'present' readings that abstain | 0.048±0.045 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.012±0.017 |
| presence unit: share of true 'present' readings that abstain | 0.012±0.017 |
| presence color: share of true 'present' readings that abstain | 0.091±0.074 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence relation: present read present | 0.989±0.016 |
| presence relation: share of 'present' readings that abstain | 0.046±0.033 |
| presence relation: share of true 'present' readings that abstain | 0.046±0.033 |
| presence landmark: present read present | 0.955±0.015 |
| presence landmark: share of 'present' readings that abstain | 0.326±0.014 |
| presence landmark: share of true 'present' readings that abstain | 0.310±0.017 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | 0.333±0.236 |
| presence anchor: present read present | 0.980±0.028 |
| presence anchor: share of 'present' readings that abstain | 0.020±0.028 |
| presence anchor: share of true 'present' readings that abstain | 0.020±0.028 |
| presence landmark: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: share of 'present' readings that abstain | 0.333±0.257 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence style: share of true 'present' readings that abstain | 0.189±0.164 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |

residual mean 0.094±0.018; status {'ok': 213, 'abstain': 83, 'no-sense': 4}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.987 | 0.452 / 0.352 | 1.00 | 0.013 | 0.000 / 0.000 |
| role object | 0.891 | 0.202 / 0.003 | 0.85 | 0.021 | 0.067 / 0.088 |
| roles (pooled) | 0.873 | 0.184 / 0.007 | 0.81 | 0.022 | 0.090 / 0.105 |
| role text | 0.891 | 0.181 / 0.006 | 0.78 | 0.000 | 0.109 / 0.109 |
| role style | 0.833 | 0.115 / 0.018 | 0.50 | 0.000 | 0.333 / 0.167 |
| role color | 0.692 | 0.142 / 0.000 | 0.69 | 0.000 | 0.000 / 0.308 |
| role region | 1.000 | 0.293 / 0.241 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.194 / 0.024 | 0.86 | 0.000 | 0.143 / 0.000 |
| role source | 0.455 | 0.023 / 0.000 | 0.15 | 0.121 | 0.424 / 0.424 |
| role target | 0.593 | 0.052 / 0.001 | 0.48 | 0.111 | 0.222 / 0.296 |
| role size | 0.870 | 0.159 / 0.002 | 0.78 | 0.000 | 0.087 / 0.130 |
| role quantity | 1.000 | 0.133 / 0.082 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 1.000 | 0.191 / 0.071 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 1.000 | 0.242 / 0.171 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.237 / 0.147 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.314 / 0.241 | 1.00 | 0.000 | 0.000 / 0.000 |
| role relation | 0.967 | 0.189 / 0.058 | 0.90 | 0.000 | 0.067 / 0.033 |
| role landmark | 0.800 | 0.068 / 0.008 | 0.67 | 0.033 | 0.167 / 0.167 |
| role layout | 1.000 | 0.252 / 0.167 | 1.00 | 0.000 | 0.000 / 0.000 |
| role anchor | 0.941 | 0.246 / 0.147 | 0.94 | 0.000 | 0.000 / 0.059 |
| role fraction | 1.000 | 0.234 / 0.210 | 1.00 | 0.000 | 0.000 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 COMPONENT=0.96 ANCHOR=0.95 do=0.95 PAIR=0.93 AXIS=0.89 DIR=0.86 never=0.84 UNIT=0.75 REGION=0.70 apart=0.66 back=0.61 LABEL=0.60 front=0.56 flow=0.48 color=0.47 LAYOUT=0.40 FILLER=0.38 PRON=0.30 not=0.26 are=0.15 FRACTION=0.15 together=0.12 unknown=0.12 INTRO=0.04 is=0.03 the=0.03 evenly=0.02 REL=0.01 a=0.01 DEM=0.01 QUANT=0.01 NUM=0.01 VERB=0.01 SIZE=0.00 STYLE=0.00 COLOR=0.00

## What is weak, what to add
- heldout_formulations: FULL 0.663
- heldout_formulations: presence object: present read present 0.860
- heldout_formulations: presence object: share of 'present' readings that abstain 0.163
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.163
- heldout_formulations: role object 0.787
- heldout_formulations: head object 0.809
- heldout_formulations: determiner identity (outside FULL when the legend excludes it) 0.855
- heldout_formulations: heads FULL (model) 0.691
- heldout_formulations: heads FULL (lexical order baseline) 0.292
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.354
- heldout_formulations: FULL [depth given] 0.663
- heldout_formulations: FULL [depth and negation given] 0.663
- heldout_formulations: FULL [presence not decided] 0.455
- heldout_formulations: role color [presence not decided] 0.736
- heldout_formulations: role size [presence not decided] 0.882
- heldout_formulations: role style [presence not decided] 0.899
- heldout_formulations: role landmark [presence not decided] 0.882
- heldout_formulations: role source [presence not decided] 0.854
- heldout_formulations: heads FULL (model) [presence not decided] 0.455
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.545
- heldout_formulations: role object [pooled midpoint (comparison)] 0.657
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.612
- heldout_formulations: presence object: present read present [pooled midpoint (comparison)] 0.772
- heldout_formulations: presence direction: share of 'present' readings that abstain 0.333
- heldout_formulations: presence direction: share of true 'present' readings that abstain 0.333
- heldout_formulations: presence direction: present read present [pooled midpoint (comparison)] 0.667
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.056
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.056
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.389
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.389
- heldout_formulations: presence relation: present read present [pooled midpoint (comparison)] 0.800
- heldout_formulations: presence landmark: present read present [pooled midpoint (comparison)] 0.800
- heldout_formulations: presence text: share of 'present' readings that abstain 0.115
- heldout_formulations: presence text: share of true 'present' readings that abstain 0.043
- heldout_formulations: presence text: present read present [pooled midpoint (comparison)] 0.826
- heldout_formulations: presence source: share of 'present' readings that abstain 0.867
- heldout_formulations: presence source: share of true 'present' readings that abstain 0.867
- heldout_formulations: presence target: share of 'present' readings that abstain 0.630
- heldout_formulations: presence target: share of true 'present' readings that abstain 0.630
- heldout_formulations: presence size: share of 'present' readings that abstain 0.412
- heldout_formulations: presence size: share of true 'present' readings that abstain 0.167
- heldout_formulations: presence size: present read present [pooled midpoint (comparison)] 0.833
- heldout_formulations: presence quantity: share of 'present' readings that abstain 0.375
- heldout_formulations: presence quantity: share of true 'present' readings that abstain 0.375
- heldout_formulations: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence region: share of 'present' readings that abstain 0.000
- heldout_formulations: presence region: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence style: present read present 0.667
- heldout_formulations: presence style: share of 'present' readings that abstain 0.500
- heldout_formulations: presence style: share of true 'present' readings that abstain 0.500
- heldout_formulations: presence style: present read present [pooled midpoint (comparison)] 0.333
- heldout_formulations: presence text: share of FALSE 'present' readings that abstain 0.667
- heldout_sentences: FULL 0.713
- heldout_sentences: presence object: share of 'present' readings that abstain 0.071
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.073
- heldout_sentences: presence layout: share of 'present' readings that abstain 0.091
- heldout_sentences: presence layout: share of true 'present' readings that abstain 0.048
- heldout_sentences: role object 0.832
- heldout_sentences: head object 0.856
- heldout_sentences: determiner identity (outside FULL when the legend excludes it) 0.776
- heldout_sentences: occupancy: known filler 0.898
- heldout_sentences: role source 0.887
- heldout_sentences: heads FULL (model) 0.771
- heldout_sentences: heads FULL (lexical order baseline) 0.204
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.531
- heldout_sentences: FULL [depth given] 0.713
- heldout_sentences: FULL [depth and negation given] 0.713
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.601
- heldout_sentences: role object [pooled midpoint (comparison)] 0.754
- heldout_sentences: role source [pooled midpoint (comparison)] 0.896
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.662
- heldout_sentences: presence object: present read present [pooled midpoint (comparison)] 0.825
- heldout_sentences: presence region: share of 'present' readings that abstain 0.000
- heldout_sentences: presence region: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence object: absent read absent 0.519
- heldout_sentences: presence direction: share of 'present' readings that abstain 0.111
- heldout_sentences: presence direction: share of true 'present' readings that abstain 0.111
- heldout_sentences: presence object: absent read absent [pooled midpoint (comparison)] 0.630
- heldout_sentences: presence direction: present read present [pooled midpoint (comparison)] 0.793
- heldout_sentences: presence text: present read present 0.899
- heldout_sentences: presence text: share of 'present' readings that abstain 0.105
- heldout_sentences: presence text: share of true 'present' readings that abstain 0.099
- heldout_sentences: presence text: present read present [pooled midpoint (comparison)] 0.756
- heldout_sentences: presence pairing: share of 'present' readings that abstain 0.000
- heldout_sentences: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence source: present read present 0.576
- heldout_sentences: presence source: share of 'present' readings that abstain 0.795
- heldout_sentences: presence source: share of true 'present' readings that abstain 0.789
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.515
- heldout_sentences: presence color: present read present 0.625
- heldout_sentences: presence color: present read present [pooled midpoint (comparison)] 0.438
- heldout_sentences: presence size: present read present 0.893
- heldout_sentences: presence size: share of 'present' readings that abstain 0.077
- heldout_sentences: presence size: share of true 'present' readings that abstain 0.040
- heldout_sentences: presence size: present read present [pooled midpoint (comparison)] 0.750
- heldout_sentences: presence quantity: share of 'present' readings that abstain 0.091
- heldout_sentences: presence quantity: share of true 'present' readings that abstain 0.091
- heldout_sentences: presence style: share of 'present' readings that abstain 0.500
- heldout_sentences: presence relation: share of 'present' readings that abstain 0.085
- heldout_sentences: presence relation: share of true 'present' readings that abstain 0.085
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.306
- heldout_sentences: presence landmark: share of true 'present' readings that abstain 0.261
- heldout_sentences: presence relation: present read present [pooled midpoint (comparison)] 0.896
- heldout_sentences: presence landmark: present read present [pooled midpoint (comparison)] 0.854
- heldout_sentences: presence target: present read present 0.791
- heldout_sentences: presence target: share of 'present' readings that abstain 0.471
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.471
- heldout_sentences: presence target: present read present [pooled midpoint (comparison)] 0.837
- heldout_sentences: presence anchor: share of 'present' readings that abstain 0.071
- heldout_sentences: presence anchor: share of true 'present' readings that abstain 0.071
- heldout_sentences: presence axis: share of 'present' readings that abstain 0.154
- heldout_sentences: presence axis: share of true 'present' readings that abstain 0.154
- heldout_sentences: presence axis: present read present [pooled midpoint (comparison)] 0.846
- heldout_sentences: presence object: share of FALSE 'present' readings that abstain 0.038
- heldout_sentences: presence style: present read present 0.667
- heldout_sentences: presence style: share of true 'present' readings that abstain 0.125
- heldout_sentences: presence style: present read present [pooled midpoint (comparison)] 0.667
- heldout_sentences: presence amount: share of 'present' readings that abstain 0.034
- heldout_sentences: presence amount: share of true 'present' readings that abstain 0.034
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.000
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence color: share of 'present' readings that abstain 0.571
- heldout_sentences: presence color: share of true 'present' readings that abstain 0.100
- heldout_sentences: presence fraction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence text: share of FALSE 'present' readings that abstain 0.200
- new_identities: FULL 0.675
- new_identities: presence object: present read present 0.875
- new_identities: presence object: share of 'present' readings that abstain 0.149
- new_identities: presence object: share of true 'present' readings that abstain 0.154
- new_identities: presence size: share of 'present' readings that abstain 0.037
- new_identities: presence size: share of true 'present' readings that abstain 0.000
- new_identities: presence amount: share of 'present' readings that abstain 0.010
- new_identities: presence amount: share of true 'present' readings that abstain 0.010
- new_identities: presence unit: share of 'present' readings that abstain 0.000
- new_identities: presence unit: share of true 'present' readings that abstain 0.000
- new_identities: role object 0.802
- new_identities: head object 0.835
- new_identities: occupancy: unknown filler 0.833
- new_identities: heads FULL (model) 0.720
- new_identities: heads FULL (lexical order baseline) 0.060
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.367
- new_identities: FULL [depth given] 0.675
- new_identities: FULL [depth and negation given] 0.675
- new_identities: FULL [pooled midpoint (comparison)] 0.470
- new_identities: role object [pooled midpoint (comparison)] 0.642
- new_identities: role text [pooled midpoint (comparison)] 0.863
- new_identities: role landmark [pooled midpoint (comparison)] 0.890
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.535
- new_identities: presence object: present read present [pooled midpoint (comparison)] 0.713
- new_identities: presence text: present read present 0.892
- new_identities: presence text: present read present [pooled midpoint (comparison)] 0.783
- new_identities: presence text: share of 'present' readings that abstain 0.085
- new_identities: presence text: share of true 'present' readings that abstain 0.066
- new_identities: presence text: share of FALSE 'present' readings that abstain 0.364
- new_identities: presence relation: share of 'present' readings that abstain 0.120
- new_identities: presence relation: share of true 'present' readings that abstain 0.120
- new_identities: presence landmark: present read present 0.878
- new_identities: presence relation: present read present [pooled midpoint (comparison)] 0.741
- new_identities: presence landmark: present read present [pooled midpoint (comparison)] 0.741
- new_identities: presence anchor: share of 'present' readings that abstain 0.000
- new_identities: presence anchor: share of true 'present' readings that abstain 0.000
- new_identities: presence fraction: share of 'present' readings that abstain 0.000
- new_identities: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities: presence source: present read present 0.724
- new_identities: presence source: share of 'present' readings that abstain 0.875
- new_identities: presence source: share of true 'present' readings that abstain 0.857
- new_identities: presence target: present read present 0.621
- new_identities: presence target: share of 'present' readings that abstain 0.556
- new_identities: presence target: share of true 'present' readings that abstain 0.556
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.655
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.655
- new_identities: presence landmark: share of 'present' readings that abstain 0.325
- new_identities: presence landmark: share of true 'present' readings that abstain 0.278
- new_identities: presence region: share of 'present' readings that abstain 0.000
- new_identities: presence region: share of true 'present' readings that abstain 0.000
- new_identities: presence direction: present read present 0.828
- new_identities: presence direction: share of 'present' readings that abstain 0.250
- new_identities: presence direction: share of true 'present' readings that abstain 0.250
- new_identities: presence direction: present read present [pooled midpoint (comparison)] 0.517
- new_identities: presence style: share of 'present' readings that abstain 0.500
- new_identities: presence object: absent read absent 0.077
- new_identities: presence object: share of FALSE 'present' readings that abstain 0.000
- new_identities: presence object: absent read absent [pooled midpoint (comparison)] 0.385
- new_identities: presence color: share of 'present' readings that abstain 0.692
- new_identities: presence style: present read present 0.400
- new_identities: presence style: share of true 'present' readings that abstain 0.000
- new_identities: presence style: present read present [pooled midpoint (comparison)] 0.400
- new_identities: presence color: share of true 'present' readings that abstain 0.333
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.333
- train (sample): FULL 0.760
- train (sample): presence object: share of 'present' readings that abstain 0.081
- train (sample): presence object: share of true 'present' readings that abstain 0.084
- train (sample): presence text: present read present 0.891
- train (sample): presence text: share of 'present' readings that abstain 0.116
- train (sample): presence text: share of true 'present' readings that abstain 0.122
- train (sample): role object 0.867
- train (sample): head object 0.887
- train (sample): determiner identity (outside FULL when the legend excludes it) 0.832
- train (sample): heads FULL (model) 0.797
- train (sample): heads FULL (lexical order baseline) 0.237
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.790
- train (sample): FULL [depth given] 0.760
- train (sample): FULL [depth and negation given] 0.760
- train (sample): presence style: present read present 0.833
- train (sample): presence color: present read present 0.692
- train (sample): presence region: share of 'present' readings that abstain 0.000
- train (sample): presence region: share of true 'present' readings that abstain 0.000
- train (sample): presence direction: share of 'present' readings that abstain 0.143
- train (sample): presence direction: share of true 'present' readings that abstain 0.143
- train (sample): presence object: absent read absent 0.438
- train (sample): presence object: share of FALSE 'present' readings that abstain 0.000
- train (sample): presence source: present read present 0.758
- train (sample): presence source: share of 'present' readings that abstain 0.800
- train (sample): presence source: share of true 'present' readings that abstain 0.800
- train (sample): presence target: present read present 0.889
- train (sample): presence color: share of 'present' readings that abstain 0.450
- train (sample): presence color: share of FALSE 'present' readings that abstain 0.818
- train (sample): presence target: share of 'present' readings that abstain 0.458
- train (sample): presence target: share of true 'present' readings that abstain 0.458
- train (sample): presence size: present read present 0.870
- train (sample): presence quantity: share of 'present' readings that abstain 0.000
- train (sample): presence quantity: share of true 'present' readings that abstain 0.000
- train (sample): presence size: share of 'present' readings that abstain 0.100
- train (sample): presence size: share of true 'present' readings that abstain 0.100
- train (sample): presence pairing: share of 'present' readings that abstain 0.000
- train (sample): presence pairing: share of true 'present' readings that abstain 0.000
- train (sample): presence amount: share of 'present' readings that abstain 0.000
- train (sample): presence amount: share of true 'present' readings that abstain 0.000
- train (sample): presence unit: share of 'present' readings that abstain 0.000
- train (sample): presence unit: share of true 'present' readings that abstain 0.000
- train (sample): presence color: share of true 'present' readings that abstain 0.000
- train (sample): presence axis: share of 'present' readings that abstain 0.000
- train (sample): presence axis: share of true 'present' readings that abstain 0.000
- train (sample): presence relation: share of 'present' readings that abstain 0.069
- train (sample): presence relation: share of true 'present' readings that abstain 0.069
- train (sample): presence landmark: share of 'present' readings that abstain 0.310
- train (sample): presence landmark: share of true 'present' readings that abstain 0.286
- train (sample): presence layout: share of 'present' readings that abstain 0.000
- train (sample): presence layout: share of true 'present' readings that abstain 0.000
- train (sample): presence text: share of FALSE 'present' readings that abstain 0.000
- train (sample): presence anchor: share of 'present' readings that abstain 0.000
- train (sample): presence anchor: share of true 'present' readings that abstain 0.000
- train (sample): presence style: share of 'present' readings that abstain 0.625
- train (sample): presence style: share of true 'present' readings that abstain 0.400
- train (sample): presence fraction: share of 'present' readings that abstain 0.000
- train (sample): presence fraction: share of true 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_formulations: `i want you to create a COMPONENT` FULL 0.000 (n 2)
- heldout_sentences: `would you join QUANT COMPONENT PAIR` FULL 0.000 (n 2)
- heldout_sentences: `lets connect QUANT COMPONENT PAIR` FULL 0.000 (n 2)
- new_identities: `lets sketch a COMPONENT named LABEL` FULL 0.000 (n 2)
- new_identities: `make LABEL STYLE please` FULL 0.000 (n 2)
- new_identities: `can you join LABEL to the COMPONENT` FULL 0.000 (n 2)
- new_identities: `make LABEL NUM UNIT SIZE .` FULL 0.000 (n 2)
- heldout_formulations: `okay so erase QUANT COMPONENT that are not COLOR .` FULL 0.000 (n 1)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role size | role style | role text | role relation | role landmark | role region | role anchor | role fraction | role amount | role unit | role direction | role axis | role layout | role pairing | role source | role target | role quantity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.751±0.056 | 0.713±0.050 | 0.824±0.045 | 0.970±0.007 | 0.983±0.009 | 0.989±0.000 | 0.979±0.007 | 0.981±0.003 | 0.959±0.007 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.936±0.023 | 0.946±0.013 | 0.996±0.003 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.631±0.014 | 0.575±0.025 | 0.670±0.019 | 1.000±0.000 | 0.985±0.003 | 0.983±0.005 | 0.953±0.007 | 0.972±0.000 | 0.951±0.005 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.998±0.003 | 1.000±0.000 | 0.994±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.940±0.025 | 0.948±0.011 | 0.991±0.007 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.472±0.017 | 0.472±0.017 | 0.923±0.005 | 0.736±0.000 | 0.882±0.000 | 0.899±0.000 | 0.976±0.011 | 1.000±0.000 | 0.884±0.003 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.882±0.020 | 0.918±0.010 | 1.000±0.000 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 0.882±0.043 | 1.000±0.000 | 0.941±0.022 | 0.169±0.006 (— / 0.169±0.006) |
| heldout_formulations | object | comparison: pooled midpoint | 0.757±0.015 | 1.000±0.000 | 0.878±0.007 |  |
| heldout_formulations | color | product: fitted | — | 0.970±0.007 | — | 0.850±0.108 (0.850±0.108 / —) |
| heldout_formulations | color | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | size | product: fitted | 1.000±0.000 | 0.982±0.010 | 0.991±0.005 | 0.300±0.108 (1.000±0.000 / 0.139±0.039) |
| heldout_formulations | size | comparison: pooled midpoint | 0.833±0.000 | 0.996±0.003 | 0.915±0.001 |  |
| heldout_formulations | style | product: fitted | 0.722±0.079 | 0.998±0.003 | 0.860±0.038 | 0.417±0.118 (1.000 / 0.383±0.103) |
| heldout_formulations | style | comparison: pooled midpoint | 0.500±0.136 | 1.000±0.000 | 0.750±0.068 |  |
| heldout_formulations | text | product: fitted | 0.958±0.059 | 0.985±0.003 | 0.972±0.029 | 0.106±0.013 (0.389±0.283 / 0.072±0.037) |
| heldout_formulations | text | comparison: pooled midpoint | 0.843±0.019 | 0.974±0.005 | 0.908±0.012 |  |
| heldout_formulations | relation | product: fitted | 0.869±0.022 | 1.000±0.000 | 0.935±0.011 | 0.037±0.026 (— / 0.037±0.026) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.800±0.000 | 1.000±0.000 | 0.900±0.000 |  |
| heldout_formulations | landmark | product: fitted | 0.869±0.022 | 0.996±0.006 | 0.932±0.012 | 0.420±0.036 (1.000 / 0.398±0.056) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.800±0.000 | 1.000±0.000 | 0.900±0.000 |  |
| heldout_formulations | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.037±0.052 (— / 0.037±0.052) |
| heldout_formulations | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.067±0.094 (— / 0.067±0.094) |
| heldout_formulations | amount | comparison: pooled midpoint | 0.933±0.094 | 1.000±0.000 | 0.967±0.047 |  |
| heldout_formulations | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | unit | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.222±0.157 (— / 0.222±0.157) |
| heldout_formulations | direction | comparison: pooled midpoint | 0.667±0.000 | 1.000±0.000 | 0.833±0.000 |  |
| heldout_formulations | axis | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | layout | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | pairing | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | source | product: fitted | 0.967±0.047 | 0.995±0.003 | 0.981±0.024 | 0.853±0.022 (1.000±0.000 / 0.849±0.024) |
| heldout_formulations | source | comparison: pooled midpoint | 0.967±0.000 | 1.000±0.000 | 0.983±0.000 |  |
| heldout_formulations | target | product: fitted | 0.966±0.028 | 1.000±0.000 | 0.983±0.014 | 0.525±0.082 (— / 0.525±0.082) |
| heldout_formulations | target | comparison: pooled midpoint | 0.966±0.000 | 1.000±0.000 | 0.983±0.000 |  |
| heldout_formulations | quantity | product: fitted | 0.958±0.029 | 1.000±0.000 | 0.979±0.015 | 0.369±0.027 (— / 0.369±0.027) |
| heldout_formulations | quantity | comparison: pooled midpoint | 0.896±0.078 | 1.000±0.000 | 0.948±0.039 |  |
| heldout_sentences | object | product: fitted | 0.936±0.027 | 0.481±0.052 | 0.709±0.013 | 0.068±0.003 (0.013±0.018 / 0.072±0.002) |
| heldout_sentences | object | comparison: pooled midpoint | 0.809±0.012 | 0.642±0.009 | 0.726±0.002 |  |
| heldout_sentences | color | product: fitted | 0.729±0.147 | 0.973±0.002 | 0.851±0.073 | 0.575±0.025 (1.000±0.000 / 0.122±0.110) |
| heldout_sentences | color | comparison: pooled midpoint | 0.396±0.029 | 1.000±0.000 | 0.698±0.015 |  |
| heldout_sentences | size | product: fitted | 0.881±0.017 | 0.999±0.001 | 0.940±0.008 | 0.106±0.100 (1.000 / 0.093±0.105) |
| heldout_sentences | size | comparison: pooled midpoint | 0.786±0.051 | 1.000±0.000 | 0.893±0.025 |  |
| heldout_sentences | style | product: fitted | 0.694±0.039 | 0.994±0.005 | 0.844±0.021 | 0.341±0.117 (1.000±0.000 / 0.157±0.046) |
| heldout_sentences | style | comparison: pooled midpoint | 0.694±0.104 | 0.999±0.001 | 0.846±0.052 |  |
| heldout_sentences | text | product: fitted | 0.869±0.022 | 0.987±0.002 | 0.928±0.011 | 0.077±0.021 (0.178±0.137 / 0.067±0.028) |
| heldout_sentences | text | comparison: pooled midpoint | 0.774±0.017 | 0.985±0.000 | 0.879±0.009 |  |
| heldout_sentences | relation | product: fitted | 0.965±0.010 | 1.000±0.000 | 0.983±0.005 | 0.050±0.026 (— / 0.050±0.026) |
| heldout_sentences | relation | comparison: pooled midpoint | 0.889±0.010 | 1.000±0.000 | 0.944±0.005 |  |
| heldout_sentences | landmark | product: fitted | 0.944±0.035 | 0.996±0.002 | 0.970±0.017 | 0.334±0.020 (1.000±0.000 / 0.309±0.035) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.868±0.010 | 1.000±0.000 | 0.934±0.005 |  |
| heldout_sentences | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | region | comparison: pooled midpoint | 0.990±0.013 | 1.000±0.000 | 0.995±0.007 |  |
| heldout_sentences | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.060±0.017 (— / 0.060±0.017) |
| heldout_sentences | anchor | comparison: pooled midpoint | 0.940±0.017 | 1.000±0.000 | 0.970±0.008 |  |
| heldout_sentences | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | amount | product: fitted | 0.943±0.043 | 1.000±0.000 | 0.971±0.022 | 0.011±0.016 (— / 0.011±0.016) |
| heldout_sentences | amount | comparison: pooled midpoint | 0.931±0.028 | 1.000±0.000 | 0.966±0.014 |  |
| heldout_sentences | unit | product: fitted | 0.966±0.028 | 1.000±0.000 | 0.983±0.014 | 0.024±0.017 (— / 0.024±0.017) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.966±0.028 | 1.000±0.000 | 0.983±0.014 |  |
| heldout_sentences | direction | product: fitted | 0.908±0.033 | 1.000±0.000 | 0.954±0.016 | 0.064±0.047 (— / 0.064±0.047) |
| heldout_sentences | direction | comparison: pooled midpoint | 0.793±0.000 | 1.000±0.000 | 0.897±0.000 |  |
| heldout_sentences | axis | product: fitted | 0.974±0.036 | 1.000±0.000 | 0.987±0.018 | 0.079±0.063 (— / 0.079±0.063) |
| heldout_sentences | axis | comparison: pooled midpoint | 0.846±0.000 | 1.000±0.000 | 0.923±0.000 |  |
| heldout_sentences | layout | product: fitted | 1.000±0.000 | 0.999±0.001 | 1.000±0.001 | 0.030±0.043 (1.000 / 0.016±0.022) |
| heldout_sentences | layout | comparison: pooled midpoint | 1.000±0.000 | 0.999±0.001 | 1.000±0.001 |  |
| heldout_sentences | pairing | product: fitted | 0.986±0.020 | 1.000±0.000 | 0.993±0.010 | 0.075±0.078 (— / 0.075±0.078) |
| heldout_sentences | pairing | comparison: pooled midpoint | 0.971±0.020 | 1.000±0.000 | 0.986±0.010 |  |
| heldout_sentences | source | product: fitted | 0.556±0.019 | 0.998±0.002 | 0.777±0.009 | 0.698±0.069 (0.750±0.250 / 0.698±0.064) |
| heldout_sentences | source | comparison: pooled midpoint | 0.530±0.012 | 1.000±0.000 | 0.765±0.006 |  |
| heldout_sentences | target | product: fitted | 0.829±0.029 | 0.998±0.002 | 0.914±0.014 | 0.405±0.047 (1.000 / 0.394±0.054) |
| heldout_sentences | target | comparison: pooled midpoint | 0.837±0.000 | 1.000±0.000 | 0.919±0.000 |  |
| heldout_sentences | quantity | product: fitted | 1.000±0.000 | 0.999±0.001 | 0.999±0.001 | 0.141±0.077 (1.000±0.000 / 0.091±0.074) |
| heldout_sentences | quantity | comparison: pooled midpoint | 0.970±0.043 | 0.999±0.001 | 0.984±0.022 |  |
| new_identities | object | product: fitted | 0.889±0.048 | 0.051±0.036 | 0.470±0.009 | 0.125±0.021 (0.000±0.000 / 0.129±0.022) |
| new_identities | object | comparison: pooled midpoint | 0.681±0.037 | 0.282±0.145 | 0.481±0.068 |  |
| new_identities | color | product: fitted | 0.944±0.079 | 0.983±0.007 | 0.964±0.042 | 0.542±0.152 (0.967±0.047 / 0.111±0.157) |
| new_identities | color | comparison: pooled midpoint | 0.333±0.000 | 1.000±0.000 | 0.667±0.000 |  |
| new_identities | size | product: fitted | 0.963±0.000 | 0.999±0.001 | 0.981±0.001 | 0.012±0.017 (1.000 / 0.000±0.000) |
| new_identities | size | comparison: pooled midpoint | 0.963±0.000 | 1.000±0.000 | 0.981±0.000 |  |
| new_identities | style | product: fitted | 0.600±0.163 | 0.996±0.003 | 0.798±0.083 | 0.500±0.000 (1.000±0.000 / 0.167±0.236) |
| new_identities | style | comparison: pooled midpoint | 0.600±0.163 | 0.997±0.005 | 0.798±0.080 |  |
| new_identities | text | product: fitted | 0.873±0.014 | 0.941±0.008 | 0.907±0.010 | 0.078±0.010 (0.366±0.027 / 0.055±0.009) |
| new_identities | text | comparison: pooled midpoint | 0.787±0.006 | 0.932±0.006 | 0.860±0.004 |  |
| new_identities | relation | product: fitted | 0.892±0.026 | 1.000±0.000 | 0.946±0.013 | 0.098±0.030 (— / 0.098±0.030) |
| new_identities | relation | comparison: pooled midpoint | 0.738±0.004 | 1.000±0.000 | 0.869±0.002 |  |
| new_identities | landmark | product: fitted | 0.843±0.043 | 0.992±0.007 | 0.917±0.018 | 0.358±0.024 (1.000±0.000 / 0.334±0.040) |
| new_identities | landmark | comparison: pooled midpoint | 0.738±0.004 | 1.000±0.000 | 0.869±0.002 |  |
| new_identities | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | anchor | comparison: pooled midpoint | 0.974±0.036 | 1.000±0.000 | 0.987±0.018 |  |
| new_identities | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | amount | product: fitted | 0.970±0.024 | 1.000±0.000 | 0.985±0.012 | 0.052±0.035 (— / 0.052±0.035) |
| new_identities | amount | comparison: pooled midpoint | 0.956±0.013 | 1.000±0.000 | 0.978±0.006 |  |
| new_identities | unit | product: fitted | 0.990±0.008 | 1.000±0.000 | 0.995±0.004 | 0.034±0.025 (— / 0.034±0.025) |
| new_identities | unit | comparison: pooled midpoint | 0.980±0.008 | 1.000±0.000 | 0.990±0.004 |  |
| new_identities | direction | product: fitted | 0.816±0.043 | 1.000±0.000 | 0.908±0.022 | 0.199±0.057 (— / 0.199±0.057) |
| new_identities | direction | comparison: pooled midpoint | 0.523±0.009 | 1.000±0.000 | 0.762±0.004 |  |
| new_identities | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | source | product: fitted | 0.701±0.114 | 0.995±0.004 | 0.848±0.055 | 0.863±0.066 (1.000±0.000 / 0.848±0.077) |
| new_identities | source | comparison: pooled midpoint | 0.713±0.059 | 1.000±0.000 | 0.856±0.029 |  |
| new_identities | target | product: fitted | 0.678±0.081 | 1.000±0.000 | 0.839±0.041 | 0.490±0.133 (— / 0.490±0.133) |
| new_identities | target | comparison: pooled midpoint | 0.678±0.059 | 1.000±0.000 | 0.839±0.029 |  |
| new_identities | quantity | product: fitted | — | 0.998±0.001 | — | 1.000±0.000 (1.000±0.000 / —) |
| new_identities | quantity | comparison: pooled midpoint | — | 0.999±0.001 | — |  |
| train (sample) | object | product: fitted | 0.952±0.024 | 0.396±0.059 | 0.674±0.018 | 0.081±0.015 (0.074±0.105 / 0.081±0.013) |
| train (sample) | color | product: fitted | 0.795±0.073 | 0.965±0.013 | 0.880±0.038 | 0.462±0.076 (0.849±0.057 / 0.091±0.074) |
| train (sample) | size | product: fitted | 0.841±0.020 | 0.999±0.002 | 0.920±0.011 | 0.153±0.041 (1.000 / 0.139±0.027) |
| train (sample) | style | product: fitted | 0.889±0.079 | 0.994±0.004 | 0.942±0.039 | 0.333±0.257 (1.000±0.000 / 0.189±0.164) |
| train (sample) | text | product: fitted | 0.870±0.018 | 0.992±0.000 | 0.931±0.009 | 0.136±0.043 (0.333±0.236 / 0.125±0.043) |
| train (sample) | relation | product: fitted | 0.989±0.016 | 1.000±0.000 | 0.994±0.008 | 0.046±0.033 (— / 0.046±0.033) |
| train (sample) | landmark | product: fitted | 0.955±0.015 | 0.998±0.002 | 0.976±0.008 | 0.326±0.014 (1.000±0.000 / 0.310±0.017) |
| train (sample) | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | anchor | product: fitted | 0.980±0.028 | 1.000±0.000 | 0.990±0.014 | 0.020±0.028 (— / 0.020±0.028) |
| train (sample) | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.048±0.045 (— / 0.048±0.045) |
| train (sample) | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.012±0.017 (— / 0.012±0.017) |
| train (sample) | direction | product: fitted | 0.952±0.067 | 1.000±0.000 | 0.976±0.034 | 0.075±0.059 (— / 0.075±0.059) |
| train (sample) | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | pairing | product: fitted | 0.944±0.079 | 1.000±0.000 | 0.972±0.039 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | source | product: fitted | 0.717±0.038 | 1.000±0.000 | 0.859±0.019 | 0.697±0.139 (— / 0.697±0.139) |
| train (sample) | target | product: fitted | 0.938±0.035 | 0.999±0.002 | 0.969±0.017 | 0.353±0.094 (1.000 / 0.345±0.093) |
| train (sample) | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
