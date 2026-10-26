# REPORT — world `diagram`, legend sha256:d361fbea318b… (version 1)

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
D=1024, seeds [0, 1, 2], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit 448c916. Memory curve: runs/5000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 0.033 [rule: fit; pooled midpoint 0.499 (comparison)] (present 0.997, n 539 / absent 0.000, n 84)
- attr_presence:object: threshold 0.555 [rule: fit; pooled midpoint 0.698 (comparison)] (present 1.190, n 213 / absent 0.206, n 326)
- det_presence:object: threshold 0.821 [rule: fit; pooled midpoint 0.815 (comparison)] (present 1.491, n 179 / absent 0.139, n 360)
- presence:color: threshold 0.071 [rule: fit; pooled midpoint 0.412 (comparison)] (present 0.821, n 25 / absent 0.002, n 598)
- presence:size: threshold 0.185 [rule: fit; pooled midpoint 0.293 (comparison)] (present 0.576, n 56 / absent 0.010, n 567)
- presence:style: threshold 0.005 [rule: fit; pooled midpoint 0.122 (comparison)] (present 0.241, n 18 / absent 0.003, n 605)
- presence:text: threshold 0.093 [rule: fit; pooled midpoint 0.280 (comparison)] (present 0.543, n 80 / absent 0.017, n 543)
- presence:relation: threshold 0.176 [rule: fit; pooled midpoint 0.313 (comparison)] (present 0.616, n 73 / absent 0.009, n 550)
- presence:landmark: threshold 0.231 [rule: fit; pooled midpoint 0.379 (comparison)] (present 0.734, n 73 / absent 0.024, n 550)
- presence:region: threshold 0.380 [rule: fit; pooled midpoint 0.562 (comparison)] (present 1.104, n 48 / absent 0.020, n 575)
- presence:anchor: threshold 0.353 [rule: fit; pooled midpoint 0.422 (comparison)] (present 0.842, n 31 / absent 0.002, n 592)
- presence:fraction: threshold 0.308 [rule: fit; pooled midpoint 0.330 (comparison)] (present 0.655, n 21 / absent 0.004, n 602)
- presence:amount: threshold 0.154 [rule: fit; pooled midpoint 0.249 (comparison)] (present 0.495, n 37 / absent 0.003, n 586)
- presence:unit: threshold 0.206 [rule: fit; pooled midpoint 0.295 (comparison)] (present 0.556, n 37 / absent 0.033, n 586)
- presence:direction: threshold 0.188 [rule: fit; pooled midpoint 0.266 (comparison)] (present 0.529, n 27 / absent 0.003, n 596)
- presence:axis: threshold 0.188 [rule: fit; pooled midpoint 0.341 (comparison)] (present 0.681, n 13 / absent 0.001, n 610)
- presence:layout: threshold 0.267 [rule: fit; pooled midpoint 0.480 (comparison)] (present 0.959, n 21 / absent 0.000, n 602)
- presence:pairing: threshold 0.146 [rule: fit; pooled midpoint 0.217 (comparison)] (present 0.436, n 14 / absent -0.002, n 609)
- presence:source: threshold 0.094 [rule: fit; pooled midpoint 0.354 (comparison)] (present 0.708, n 72 / absent 0.000, n 551)
- presence:target: threshold 0.282 [rule: fit; pooled midpoint 0.426 (comparison)] (present 0.850, n 58 / absent 0.001, n 565)
- presence:edge: threshold 0.179 [rule: fit; pooled midpoint 0.357 (comparison)] (present 0.713, n 48 / absent 0.001, n 575)
- presence:quantity: threshold 0.073 [rule: fit; pooled midpoint 0.075 (comparison)] (present 0.149, n 18 / absent 0.001, n 605)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.005, color 0.083, size 0.143, style 0.200, text 0.013, relation 0.167, landmark 0.006, region 0.111, anchor 0.250, fraction 0.333, amount 0.043, unit 0.500, direction 0.167, axis 0.500, layout 0.143, pairing 0.500, source 0.006, target 0.006, edge 0.125, quantity 0.043, predicate 0.019

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 177 of 177)
| axis | accuracy |
|---|---|
| FULL | 0.868±0.003 |
| FULL [depth given] | 0.868±0.003 |
| FULL [depth and negation given] | 0.868±0.003 |
| FULL [presence not decided] | 0.898±0.012 |
| FULL [pooled midpoint (comparison)] | 0.721±0.010 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.037±0.009 |
| presence object: share of true 'present' readings that abstain | 0.037±0.009 |
| presence color: absent read absent | 1.000±0.000 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 0.998±0.003 |
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
| role object | 0.987±0.011 |
| head object | 0.994±0.005 |
| lexical order head object | 0.808±0.000 |
| lexical bag head object | 0.774±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.972±0.011 |
| occupancy: known filler | 0.977±0.003 |
| role color | 1.000±0.000 |
| head color | 1.000±0.000 |
| lexical order head color | 1.000±0.000 |
| lexical bag head color | 0.994±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 1.000±0.000 |
| head size | 1.000±0.000 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.960±0.000 |
| role style | 0.991±0.003 |
| head style | 0.991±0.003 |
| lexical order head style | 0.972±0.000 |
| lexical bag head style | 0.972±0.000 |
| role text | 1.000±0.000 |
| head text | 1.000±0.000 |
| lexical order head text | 0.864±0.000 |
| lexical bag head text | 0.915±0.000 |
| role relation | 0.979±0.003 |
| head relation | 0.979±0.003 |
| lexical order head relation | 0.881±0.000 |
| lexical bag head relation | 0.881±0.000 |
| role landmark | 0.976±0.007 |
| head landmark | 0.987±0.007 |
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
| role source | 0.962±0.003 |
| head source | 0.987±0.003 |
| lexical order head source | 0.831±0.000 |
| lexical bag head source | 0.831±0.000 |
| role target | 0.949±0.005 |
| head target | 0.987±0.003 |
| lexical order head target | 0.836±0.000 |
| lexical bag head target | 0.836±0.000 |
| role edge | 0.972±0.005 |
| head edge | 0.992±0.005 |
| lexical order head edge | 0.836±0.000 |
| lexical bag head edge | 0.836±0.000 |
| role quantity | 0.994±0.005 |
| head quantity | 0.994±0.005 |
| lexical order head quantity | 0.910±0.000 |
| lexical bag head quantity | 0.910±0.000 |
| heads FULL (model) | 0.938±0.000 |
| heads FULL (lexical order baseline) | 0.294±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.356±0.000 |
| role object [presence not decided] | 0.987±0.011 |
| role color [presence not decided] | 0.994±0.000 |
| role size [presence not decided] | 1.000±0.000 |
| role style [presence not decided] | 0.994±0.000 |
| role text [presence not decided] | 1.000±0.000 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.983±0.005 |
| role region [presence not decided] | 1.000±0.000 |
| role anchor [presence not decided] | 1.000±0.000 |
| role fraction [presence not decided] | 1.000±0.000 |
| role amount [presence not decided] | 1.000±0.000 |
| role unit [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role axis [presence not decided] | 1.000±0.000 |
| role layout [presence not decided] | 1.000±0.000 |
| role pairing [presence not decided] | 1.000±0.000 |
| role source [presence not decided] | 0.962±0.003 |
| role target [presence not decided] | 0.949±0.005 |
| role edge [presence not decided] | 0.979±0.007 |
| role quantity [presence not decided] | 1.000±0.000 |
| heads FULL (model) [presence not decided] | 0.970±0.007 |
| role object [pooled midpoint (comparison)] | 0.868±0.003 |
| role color [pooled midpoint (comparison)] | 1.000±0.000 |
| role size [pooled midpoint (comparison)] | 0.992±0.003 |
| role style [pooled midpoint (comparison)] | 0.985±0.003 |
| role text [pooled midpoint (comparison)] | 0.981±0.005 |
| role relation [pooled midpoint (comparison)] | 0.976±0.003 |
| role landmark [pooled midpoint (comparison)] | 0.955±0.005 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 1.000±0.000 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.998±0.003 |
| role unit [pooled midpoint (comparison)] | 1.000±0.000 |
| role direction [pooled midpoint (comparison)] | 0.994±0.000 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.962±0.003 |
| role target [pooled midpoint (comparison)] | 0.945±0.007 |
| role edge [pooled midpoint (comparison)] | 0.968±0.007 |
| role quantity [pooled midpoint (comparison)] | 0.985±0.005 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.785±0.008 |
| presence object: present read present [pooled midpoint (comparison)] | 0.866±0.006 |
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
| presence object: absent read absent | 1.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.222±0.157 |
| presence direction: share of true 'present' readings that abstain | 0.222±0.157 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.667±0.000 |
| presence relation: present read present | 0.825±0.022 |
| presence relation: share of 'present' readings that abstain | 0.038±0.027 |
| presence relation: share of true 'present' readings that abstain | 0.038±0.027 |
| presence landmark: present read present | 0.937±0.045 |
| presence landmark: share of 'present' readings that abstain | 0.441±0.023 |
| presence landmark: share of true 'present' readings that abstain | 0.441±0.023 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.833±0.024 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.800±0.000 |
| presence text: present read present | 1.000±0.000 |
| presence text: share of 'present' readings that abstain | 0.014±0.020 |
| presence text: share of true 'present' readings that abstain | 0.014±0.020 |
| presence text: present read present [pooled midpoint (comparison)] | 0.861±0.039 |
| presence size: present read present | 1.000±0.000 |
| presence size: share of 'present' readings that abstain | 0.028±0.039 |
| presence size: share of true 'present' readings that abstain | 0.028±0.039 |
| presence size: present read present [pooled midpoint (comparison)] | 0.889±0.039 |
| presence quantity: present read present | 0.938±0.051 |
| presence quantity: share of 'present' readings that abstain | 0.223±0.033 |
| presence quantity: share of true 'present' readings that abstain | 0.223±0.033 |
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
| presence style: share of 'present' readings that abstain | 0.278±0.208 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.067±0.094 |
| presence amount: share of true 'present' readings that abstain | 0.067±0.094 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.000±0.000 |
| presence unit: share of true 'present' readings that abstain | 0.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.933±0.094 |
| presence unit: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.856±0.031 |
| presence source: share of true 'present' readings that abstain | 0.856±0.031 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.414±0.028 |
| presence target: share of true 'present' readings that abstain | 0.414±0.028 |
| presence edge: present read present | 0.954±0.033 |
| presence edge: share of 'present' readings that abstain | 0.023±0.033 |
| presence edge: share of true 'present' readings that abstain | 0.023±0.033 |
| presence source: present read present [pooled midpoint (comparison)] | 0.967±0.000 |
| presence target: present read present [pooled midpoint (comparison)] | 0.977±0.016 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.920±0.016 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence style: present read present | 0.733±0.189 |
| presence style: share of true 'present' readings that abstain | 0.244±0.175 |
| presence style: present read present [pooled midpoint (comparison)] | 0.467±0.094 |

residual mean 0.040±0.002; status {'ok': 126, 'abstain': 51}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.456 / 0.339 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.993 | 0.249 / 0.075 | 0.95 | 0.000 | 0.042 / 0.007 |
| roles (pooled) | 0.915 | 0.181 / 0.018 | 0.81 | 0.021 | 0.125 / 0.064 |
| role direction | 1.000 | 0.235 / 0.096 | 0.67 | 0.000 | 0.333 / 0.000 |
| role relation | 0.810 | 0.163 / 0.000 | 0.76 | 0.000 | 0.048 / 0.190 |
| role landmark | 0.810 | 0.055 / 0.003 | 0.52 | 0.048 | 0.333 / 0.143 |
| role text | 1.000 | 0.225 / 0.171 | 1.00 | 0.000 | 0.000 / 0.000 |
| role size | 1.000 | 0.218 / 0.105 | 0.92 | 0.000 | 0.083 / 0.000 |
| role quantity | 0.875 | 0.089 / 0.008 | 0.69 | 0.000 | 0.188 / 0.125 |
| role anchor | 1.000 | 0.258 / 0.227 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.204 / 0.163 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.287 / 0.225 | 1.00 | 0.000 | 0.000 / 0.000 |
| role amount | 1.000 | 0.199 / 0.130 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.182 / 0.150 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.767 | 0.018 / -0.007 | 0.10 | 0.000 | 0.667 / 0.233 |
| role target | 0.724 | 0.060 / 0.018 | 0.62 | 0.103 | 0.207 / 0.172 |
| role edge | 0.793 | 0.173 / 0.123 | 0.93 | 0.138 | 0.000 / 0.069 |
| role pairing | 1.000 | 0.082 / 0.082 | 1.00 | 0.000 | 0.000 / 0.000 |
| role style | 1.000 | 0.093 / 0.016 | 0.60 | 0.000 | 0.400 / 0.000 |

### heldout_sentences — catalog candidates (n = 469 of 469)
| axis | accuracy |
|---|---|
| FULL | 0.873±0.007 |
| FULL [depth given] | 0.873±0.007 |
| FULL [depth and negation given] | 0.873±0.007 |
| FULL [pooled midpoint (comparison)] | 0.743±0.009 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.031±0.007 |
| presence object: share of true 'present' readings that abstain | 0.031±0.007 |
| presence color: absent read absent | 0.999±0.001 |
| presence size: absent read absent | 0.998±0.001 |
| presence style: absent read absent | 1.000±0.000 |
| presence text: absent read absent | 0.999±0.001 |
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
| role object | 0.982±0.004 |
| head object | 0.996±0.002 |
| lexical order head object | 0.849±0.000 |
| lexical bag head object | 0.881±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.893±0.000 |
| occupancy: known filler | 0.978±0.002 |
| role color | 0.993±0.003 |
| head color | 0.993±0.003 |
| lexical order head color | 0.966±0.000 |
| lexical bag head color | 0.983±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.996±0.001 |
| head size | 0.996±0.001 |
| lexical order head size | 0.940±0.000 |
| lexical bag head size | 0.989±0.000 |
| role style | 0.998±0.002 |
| head style | 0.998±0.002 |
| lexical order head style | 0.972±0.000 |
| lexical bag head style | 0.972±0.000 |
| role text | 0.992±0.004 |
| head text | 0.992±0.004 |
| lexical order head text | 0.832±0.000 |
| lexical bag head text | 0.932±0.000 |
| role relation | 0.995±0.001 |
| head relation | 0.995±0.001 |
| lexical order head relation | 0.898±0.000 |
| lexical bag head relation | 0.955±0.000 |
| role landmark | 0.970±0.000 |
| head landmark | 0.991±0.000 |
| lexical order head landmark | 0.898±0.000 |
| lexical bag head landmark | 0.904±0.000 |
| role region | 1.000±0.000 |
| head region | 1.000±0.000 |
| lexical order head region | 0.925±0.000 |
| lexical bag head region | 0.945±0.000 |
| role anchor | 1.000±0.000 |
| head anchor | 1.000±0.000 |
| lexical order head anchor | 0.940±0.000 |
| lexical bag head anchor | 0.991±0.000 |
| role fraction | 1.000±0.000 |
| head fraction | 1.000±0.000 |
| lexical order head fraction | 0.985±0.000 |
| lexical bag head fraction | 0.989±0.000 |
| role amount | 0.998±0.000 |
| head amount | 0.998±0.000 |
| lexical order head amount | 0.938±0.000 |
| lexical bag head amount | 0.953±0.000 |
| role unit | 0.996±0.002 |
| head unit | 0.996±0.002 |
| lexical order head unit | 0.938±0.000 |
| lexical bag head unit | 0.953±0.000 |
| role direction | 0.994±0.001 |
| head direction | 0.994±0.001 |
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
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 0.951±0.000 |
| lexical bag head pairing | 0.966±0.000 |
| role source | 0.942±0.000 |
| head source | 0.996±0.001 |
| lexical order head source | 0.866±0.000 |
| lexical bag head source | 0.917±0.000 |
| role target | 0.985±0.000 |
| head target | 0.991±0.000 |
| lexical order head target | 0.915±0.000 |
| lexical bag head target | 0.949±0.000 |
| role edge | 0.998±0.000 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.955±0.000 |
| lexical bag head edge | 0.985±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.977±0.000 |
| lexical bag head quantity | 0.998±0.000 |
| heads FULL (model) | 0.953±0.006 |
| heads FULL (lexical order baseline) | 0.205±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.529±0.000 |
| role object [pooled midpoint (comparison)] | 0.925±0.006 |
| role color [pooled midpoint (comparison)] | 0.979±0.000 |
| role size [pooled midpoint (comparison)] | 0.989±0.002 |
| role style [pooled midpoint (comparison)] | 0.992±0.001 |
| role text [pooled midpoint (comparison)] | 0.967±0.004 |
| role relation [pooled midpoint (comparison)] | 0.989±0.001 |
| role landmark [pooled midpoint (comparison)] | 0.962±0.002 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 0.997±0.001 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.997±0.001 |
| role unit [pooled midpoint (comparison)] | 0.996±0.000 |
| role direction [pooled midpoint (comparison)] | 0.989±0.002 |
| role axis [pooled midpoint (comparison)] | 0.996±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 0.999±0.001 |
| role source [pooled midpoint (comparison)] | 0.930±0.002 |
| role target [pooled midpoint (comparison)] | 0.979±0.001 |
| role edge [pooled midpoint (comparison)] | 0.996±0.002 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.806±0.007 |
| presence object: present read present [pooled midpoint (comparison)] | 0.939±0.005 |
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
| presence direction: present read present | 0.908±0.016 |
| presence direction: share of 'present' readings that abstain | 0.038±0.054 |
| presence direction: share of true 'present' readings that abstain | 0.038±0.054 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.828±0.028 |
| presence text: present read present | 0.958±0.024 |
| presence text: share of 'present' readings that abstain | 0.071±0.019 |
| presence text: share of true 'present' readings that abstain | 0.071±0.018 |
| presence text: present read present [pooled midpoint (comparison)] | 0.802±0.022 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.014±0.020 |
| presence pairing: share of true 'present' readings that abstain | 0.014±0.020 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.693±0.067 |
| presence source: share of true 'present' readings that abstain | 0.693±0.067 |
| presence pairing: present read present [pooled midpoint (comparison)] | 0.971±0.020 |
| presence source: present read present [pooled midpoint (comparison)] | 0.725±0.030 |
| presence color: present read present | 0.854±0.029 |
| presence color: share of 'present' readings that abstain | 0.303±0.039 |
| presence color: share of true 'present' readings that abstain | 0.293±0.010 |
| presence color: present read present [pooled midpoint (comparison)] | 0.396±0.029 |
| presence size: present read present | 0.964±0.000 |
| presence size: share of 'present' readings that abstain | 0.073±0.031 |
| presence size: share of true 'present' readings that abstain | 0.049±0.046 |
| presence size: present read present [pooled midpoint (comparison)] | 0.810±0.034 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.061±0.043 |
| presence quantity: share of true 'present' readings that abstain | 0.061±0.043 |
| presence quantity: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: present read present | 0.951±0.010 |
| presence relation: share of 'present' readings that abstain | 0.066±0.017 |
| presence relation: share of true 'present' readings that abstain | 0.066±0.017 |
| presence landmark: present read present | 0.958±0.017 |
| presence landmark: share of 'present' readings that abstain | 0.275±0.033 |
| presence landmark: share of true 'present' readings that abstain | 0.275±0.033 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.889±0.010 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.868±0.010 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.012±0.017 |
| presence anchor: share of true 'present' readings that abstain | 0.012±0.017 |
| presence anchor: present read present [pooled midpoint (comparison)] | 0.952±0.017 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present [pooled midpoint (comparison)] | 0.846±0.000 |
| presence target: present read present | 0.908±0.012 |
| presence target: share of 'present' readings that abstain | 0.230±0.054 |
| presence target: share of true 'present' readings that abstain | 0.230±0.054 |
| presence target: present read present [pooled midpoint (comparison)] | 0.833±0.012 |
| presence style: present read present | 0.923±0.063 |
| presence style: share of 'present' readings that abstain | 0.195±0.040 |
| presence style: share of true 'present' readings that abstain | 0.195±0.040 |
| presence style: present read present [pooled midpoint (comparison)] | 0.718±0.036 |
| presence amount: present read present | 0.966±0.000 |
| presence amount: share of 'present' readings that abstain | 0.024±0.017 |
| presence amount: share of true 'present' readings that abstain | 0.024±0.017 |
| presence unit: present read present | 0.931±0.028 |
| presence unit: share of 'present' readings that abstain | 0.051±0.048 |
| presence unit: share of true 'present' readings that abstain | 0.051±0.048 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.954±0.016 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.931±0.000 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| presence edge: present read present [pooled midpoint (comparison)] | 0.968±0.045 |
| presence text: share of FALSE 'present' readings that abstain | nan±nan |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.069±0.002; status {'ok': 375, 'abstain': 94}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.454 / 0.359 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.980 | 0.249 / 0.106 | 0.96 | 0.020 | 0.041 / 0.000 |
| roles (pooled) | 0.928 | 0.205 / 0.038 | 0.88 | 0.032 | 0.084 / 0.040 |
| role layout | 1.000 | 0.297 / 0.236 | 1.00 | 0.000 | 0.000 / 0.000 |
| role region | 1.000 | 0.291 / 0.226 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.931 | 0.234 / 0.065 | 0.93 | 0.000 | 0.000 / 0.069 |
| role text | 0.975 | 0.214 / 0.097 | 0.92 | 0.000 | 0.051 / 0.025 |
| role pairing | 1.000 | 0.211 / 0.082 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.571 | 0.032 / 0.001 | 0.24 | 0.190 | 0.524 / 0.238 |
| role color | 0.750 | 0.128 / 0.000 | 0.56 | 0.000 | 0.188 / 0.250 |
| role size | 0.964 | 0.171 / 0.045 | 0.86 | 0.000 | 0.107 / 0.036 |
| role quantity | 1.000 | 0.122 / 0.075 | 0.91 | 0.000 | 0.091 / 0.000 |
| role relation | 0.958 | 0.202 / 0.044 | 0.88 | 0.000 | 0.083 / 0.042 |
| role landmark | 0.708 | 0.064 / 0.010 | 0.69 | 0.146 | 0.167 / 0.146 |
| role anchor | 1.000 | 0.280 / 0.188 | 0.96 | 0.000 | 0.036 / 0.000 |
| role axis | 1.000 | 0.294 / 0.125 | 1.00 | 0.000 | 0.000 / 0.000 |
| role target | 0.825 | 0.065 / 0.011 | 0.72 | 0.075 | 0.175 / 0.100 |
| role style | 1.000 | 0.150 / 0.055 | 0.85 | 0.000 | 0.154 / 0.000 |
| role amount | 0.966 | 0.200 / 0.112 | 0.97 | 0.000 | 0.000 / 0.034 |
| role unit | 0.966 | 0.208 / 0.119 | 0.97 | 0.000 | 0.000 / 0.034 |
| role edge | 0.952 | 0.190 / 0.138 | 1.00 | 0.048 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.237 / 0.200 | 1.00 | 0.000 | 0.000 / 0.000 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.828±0.031 |
| FULL [depth given] | 0.828±0.031 |
| FULL [depth and negation given] | 0.828±0.031 |
| FULL [pooled midpoint (comparison)] | 0.663±0.012 |
| presence object: present read present | 0.997±0.000 |
| presence object: share of 'present' readings that abstain | 0.061±0.013 |
| presence object: share of true 'present' readings that abstain | 0.061±0.013 |
| presence color: absent read absent | 0.997±0.000 |
| presence size: present read present | 0.988±0.017 |
| presence size: share of 'present' readings that abstain | 0.025±0.017 |
| presence size: share of true 'present' readings that abstain | 0.025±0.017 |
| presence style: absent read absent | 0.999±0.001 |
| presence text: absent read absent | 0.995±0.004 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 1.000±0.000 |
| presence region: absent read absent | 1.000±0.000 |
| presence anchor: absent read absent | 1.000±0.000 |
| presence fraction: absent read absent | 1.000±0.000 |
| presence amount: present read present | 0.987±0.009 |
| presence amount: share of 'present' readings that abstain | 0.034±0.019 |
| presence amount: share of true 'present' readings that abstain | 0.034±0.019 |
| presence unit: present read present | 0.963±0.033 |
| presence unit: share of 'present' readings that abstain | 0.056±0.026 |
| presence unit: share of true 'present' readings that abstain | 0.056±0.026 |
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
| role object | 0.967±0.002 |
| head object | 0.993±0.002 |
| lexical order head object | 0.920±0.000 |
| lexical bag head object | 0.870±0.000 |
| occupancy: known filler | 0.956±0.008 |
| role color | 0.998±0.000 |
| head color | 0.998±0.000 |
| lexical order head color | 0.985±0.000 |
| lexical bag head color | 0.993±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.999±0.001 |
| head size | 0.999±0.001 |
| lexical order head size | 0.932±0.000 |
| lexical bag head size | 0.988±0.000 |
| role style | 0.996±0.001 |
| head style | 0.996±0.001 |
| lexical order head style | 0.988±0.000 |
| lexical bag head style | 0.988±0.000 |
| role text | 0.973±0.025 |
| head text | 0.973±0.025 |
| lexical order head text | 0.535±0.000 |
| lexical bag head text | 0.745±0.000 |
| role relation | 0.955±0.005 |
| head relation | 0.955±0.005 |
| lexical order head relation | 0.790±0.000 |
| lexical bag head relation | 0.865±0.000 |
| role landmark | 0.923±0.014 |
| head landmark | 0.968±0.014 |
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
| role amount | 0.997±0.002 |
| head amount | 0.997±0.002 |
| lexical order head amount | 0.750±0.000 |
| lexical bag head amount | 0.838±0.000 |
| occupancy: unknown filler | 0.943±0.016 |
| role unit | 0.991±0.008 |
| head unit | 0.991±0.008 |
| lexical order head unit | 0.750±0.000 |
| lexical bag head unit | 0.838±0.000 |
| role direction | 0.989±0.007 |
| head direction | 0.989±0.007 |
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
| role source | 0.984±0.005 |
| head source | 0.992±0.005 |
| lexical order head source | 0.927±0.000 |
| lexical bag head source | 0.948±0.000 |
| role target | 0.979±0.005 |
| head target | 0.985±0.007 |
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
| heads FULL (model) | 0.882±0.035 |
| heads FULL (lexical order baseline) | 0.060±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.367±0.000 |
| role object [pooled midpoint (comparison)] | 0.876±0.003 |
| role color [pooled midpoint (comparison)] | 0.990±0.000 |
| role size [pooled midpoint (comparison)] | 0.997±0.001 |
| role style [pooled midpoint (comparison)] | 0.994±0.001 |
| role text [pooled midpoint (comparison)] | 0.909±0.004 |
| role relation [pooled midpoint (comparison)] | 0.940±0.000 |
| role landmark [pooled midpoint (comparison)] | 0.890±0.000 |
| role region [pooled midpoint (comparison)] | 1.000±0.000 |
| role anchor [pooled midpoint (comparison)] | 1.000±0.000 |
| role fraction [pooled midpoint (comparison)] | 1.000±0.000 |
| role amount [pooled midpoint (comparison)] | 0.992±0.002 |
| role unit [pooled midpoint (comparison)] | 0.993±0.001 |
| role direction [pooled midpoint (comparison)] | 0.969±0.001 |
| role axis [pooled midpoint (comparison)] | 1.000±0.000 |
| role layout [pooled midpoint (comparison)] | 1.000±0.000 |
| role pairing [pooled midpoint (comparison)] | 1.000±0.000 |
| role source [pooled midpoint (comparison)] | 0.973±0.006 |
| role target [pooled midpoint (comparison)] | 0.968±0.003 |
| role edge [pooled midpoint (comparison)] | 0.998±0.000 |
| role quantity [pooled midpoint (comparison)] | 1.000±0.000 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.717±0.017 |
| presence object: present read present [pooled midpoint (comparison)] | 0.907±0.004 |
| presence color: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence size: present read present [pooled midpoint (comparison)] | 0.951±0.017 |
| presence style: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence text: absent read absent [pooled midpoint (comparison)] | 0.995±0.000 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence anchor: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence amount: present read present [pooled midpoint (comparison)] | 0.970±0.008 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.977±0.005 |
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
| presence text: present read present | 0.946±0.057 |
| presence text: share of 'present' readings that abstain | 0.044±0.019 |
| presence text: share of true 'present' readings that abstain | 0.041±0.016 |
| presence text: present read present [pooled midpoint (comparison)] | 0.810±0.009 |
| presence relation: present read present | 0.786±0.026 |
| presence landmark: present read present | 0.869±0.067 |
| presence landmark: share of 'present' readings that abstain | 0.344±0.044 |
| presence landmark: share of true 'present' readings that abstain | 0.344±0.044 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.735±0.004 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.735±0.004 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence fraction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.851±0.043 |
| presence source: share of true 'present' readings that abstain | 0.851±0.043 |
| presence target: present read present | 0.897±0.056 |
| presence target: share of 'present' readings that abstain | 0.353±0.135 |
| presence target: share of true 'present' readings that abstain | 0.353±0.135 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.998±0.003 |
| presence object: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.747±0.043 |
| presence target: present read present [pooled midpoint (comparison)] | 0.747±0.043 |
| presence edge: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence relation: share of 'present' readings that abstain | 0.055±0.024 |
| presence relation: share of true 'present' readings that abstain | 0.055±0.024 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence region: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence direction: present read present | 0.851±0.099 |
| presence direction: share of 'present' readings that abstain | 0.122±0.030 |
| presence direction: share of true 'present' readings that abstain | 0.122±0.030 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.575±0.016 |
| presence style: present read present | 0.733±0.094 |
| presence style: share of 'present' readings that abstain | 0.150±0.108 |
| presence style: share of true 'present' readings that abstain | 0.083±0.118 |
| presence style: present read present [pooled midpoint (comparison)] | 0.533±0.094 |
| presence color: present read present | 1.000±0.000 |
| presence color: share of 'present' readings that abstain | 0.238±0.067 |
| presence color: share of true 'present' readings that abstain | 0.111±0.079 |
| presence color: present read present [pooled midpoint (comparison)] | 0.333±0.000 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence text: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.075±0.010; status {'ok': 308, 'abstain': 92}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.437 / 0.348 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.968 | 0.228 / 0.073 | 0.94 | 0.024 | 0.051 / 0.008 |
| roles (pooled) | 0.926 | 0.190 / 0.037 | 0.87 | 0.019 | 0.075 / 0.055 |
| role size | 0.963 | 0.186 / 0.119 | 0.96 | 0.000 | 0.000 / 0.037 |
| role amount | 1.000 | 0.203 / 0.107 | 0.98 | 0.000 | 0.020 / 0.000 |
| role unit | 1.000 | 0.220 / 0.139 | 0.98 | 0.000 | 0.020 / 0.000 |
| role text | 0.995 | 0.217 / 0.087 | 0.95 | 0.000 | 0.048 / 0.005 |
| role relation | 0.821 | 0.148 / 0.000 | 0.75 | 0.000 | 0.071 / 0.179 |
| role landmark | 0.595 | 0.053 / 0.000 | 0.49 | 0.107 | 0.214 / 0.298 |
| role anchor | 1.000 | 0.278 / 0.212 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.174 / 0.155 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.828 | 0.021 / -0.006 | 0.10 | 0.000 | 0.724 / 0.172 |
| role target | 0.724 | 0.063 / 0.005 | 0.69 | 0.069 | 0.103 / 0.207 |
| role edge | 0.938 | 0.186 / 0.147 | 1.00 | 0.062 | 0.000 / 0.000 |
| role region | 1.000 | 0.274 / 0.208 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 0.862 | 0.130 / 0.000 | 0.79 | 0.000 | 0.069 / 0.138 |
| role style | 0.800 | 0.119 / 0.024 | 0.80 | 0.000 | 0.000 / 0.200 |
| role color | 1.000 | 0.148 / 0.051 | 0.83 | 0.000 | 0.167 / 0.000 |

### train (sample) — catalog candidates (n = 300 of 4531)
| axis | accuracy |
|---|---|
| FULL | 0.903±0.005 |
| FULL [depth given] | 0.903±0.005 |
| FULL [depth and negation given] | 0.903±0.005 |
| presence object: present read present | 1.000±0.000 |
| presence object: share of 'present' readings that abstain | 0.019±0.003 |
| presence object: share of true 'present' readings that abstain | 0.019±0.003 |
| presence color: absent read absent | 0.995±0.002 |
| presence size: absent read absent | 1.000±0.000 |
| presence style: absent read absent | 0.999±0.002 |
| presence text: present read present | 0.957±0.030 |
| presence text: share of 'present' readings that abstain | 0.082±0.024 |
| presence text: share of true 'present' readings that abstain | 0.082±0.024 |
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
| role object | 0.990±0.003 |
| head object | 0.999±0.002 |
| lexical order head object | 0.863±0.000 |
| lexical bag head object | 0.947±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.934±0.000 |
| occupancy: known filler | 0.988±0.001 |
| role color | 0.992±0.002 |
| head color | 0.992±0.002 |
| lexical order head color | 0.947±0.000 |
| lexical bag head color | 0.983±0.000 |
| occupancy: not given | 1.000±0.000 |
| role size | 0.999±0.002 |
| head size | 0.999±0.002 |
| lexical order head size | 0.943±0.000 |
| lexical bag head size | 0.997±0.000 |
| role style | 0.998±0.002 |
| head style | 0.998±0.002 |
| lexical order head style | 0.983±0.000 |
| lexical bag head style | 0.997±0.000 |
| role text | 0.993±0.005 |
| head text | 0.993±0.005 |
| lexical order head text | 0.843±0.000 |
| lexical bag head text | 0.997±0.000 |
| role relation | 0.993±0.003 |
| head relation | 0.993±0.003 |
| lexical order head relation | 0.903±0.000 |
| lexical bag head relation | 0.993±0.000 |
| role landmark | 0.978±0.002 |
| head landmark | 0.993±0.003 |
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
| role amount | 1.000±0.000 |
| head amount | 1.000±0.000 |
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
| role pairing | 1.000±0.000 |
| head pairing | 1.000±0.000 |
| lexical order head pairing | 0.967±0.000 |
| lexical bag head pairing | 1.000±0.000 |
| role source | 0.950±0.000 |
| head source | 1.000±0.000 |
| lexical order head source | 0.880±0.000 |
| lexical bag head source | 0.970±0.000 |
| role target | 0.993±0.000 |
| head target | 1.000±0.000 |
| lexical order head target | 0.913±0.000 |
| lexical bag head target | 0.947±0.000 |
| role edge | 0.992±0.002 |
| head edge | 1.000±0.000 |
| lexical order head edge | 0.940±0.000 |
| lexical bag head edge | 1.000±0.000 |
| role quantity | 1.000±0.000 |
| head quantity | 1.000±0.000 |
| lexical order head quantity | 0.980±0.000 |
| lexical bag head quantity | 1.000±0.000 |
| heads FULL (model) | 0.974±0.004 |
| heads FULL (lexical order baseline) | 0.227±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.797±0.000 |
| presence style: present read present | 0.933±0.094 |
| presence style: share of 'present' readings that abstain | 0.122±0.087 |
| presence style: share of true 'present' readings that abstain | 0.067±0.094 |
| presence text: absent read absent | 1.000±0.000 |
| presence color: present read present | 0.938±0.000 |
| presence region: present read present | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | 0.000±0.000 |
| presence region: share of true 'present' readings that abstain | 0.000±0.000 |
| presence direction: present read present | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.037±0.052 |
| presence direction: share of true 'present' readings that abstain | 0.037±0.052 |
| presence color: share of 'present' readings that abstain | 0.202±0.070 |
| presence color: share of true 'present' readings that abstain | 0.133±0.054 |
| presence object: absent read absent | 1.000±0.000 |
| presence source: present read present | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 0.630±0.057 |
| presence source: share of true 'present' readings that abstain | 0.630±0.057 |
| presence target: present read present | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 0.128±0.018 |
| presence target: share of true 'present' readings that abstain | 0.128±0.018 |
| presence size: present read present | 0.980±0.028 |
| presence size: share of 'present' readings that abstain | 0.040±0.029 |
| presence size: share of true 'present' readings that abstain | 0.040±0.029 |
| presence edge: present read present | 1.000±0.000 |
| presence edge: share of 'present' readings that abstain | 0.000±0.000 |
| presence edge: share of true 'present' readings that abstain | 0.000±0.000 |
| presence quantity: present read present | 1.000±0.000 |
| presence quantity: share of 'present' readings that abstain | 0.056±0.079 |
| presence quantity: share of true 'present' readings that abstain | 0.056±0.079 |
| presence relation: present read present | 0.931±0.028 |
| presence relation: share of 'present' readings that abstain | 0.024±0.017 |
| presence relation: share of true 'present' readings that abstain | 0.024±0.017 |
| presence landmark: present read present | 0.943±0.016 |
| presence landmark: share of 'present' readings that abstain | 0.183±0.054 |
| presence landmark: share of true 'present' readings that abstain | 0.183±0.054 |
| presence amount: present read present | 1.000±0.000 |
| presence amount: share of 'present' readings that abstain | 0.024±0.034 |
| presence amount: share of true 'present' readings that abstain | 0.024±0.034 |
| presence unit: present read present | 1.000±0.000 |
| presence unit: share of 'present' readings that abstain | 0.012±0.017 |
| presence unit: share of true 'present' readings that abstain | 0.012±0.017 |
| presence layout: present read present | 1.000±0.000 |
| presence layout: share of 'present' readings that abstain | 0.000±0.000 |
| presence layout: share of true 'present' readings that abstain | 0.000±0.000 |
| presence axis: present read present | 1.000±0.000 |
| presence axis: share of 'present' readings that abstain | 0.000±0.000 |
| presence axis: share of true 'present' readings that abstain | 0.000±0.000 |
| presence anchor: present read present | 1.000±0.000 |
| presence anchor: share of 'present' readings that abstain | 0.000±0.000 |
| presence anchor: share of true 'present' readings that abstain | 0.000±0.000 |
| presence pairing: present read present | 1.000±0.000 |
| presence pairing: share of 'present' readings that abstain | 0.000±0.000 |
| presence pairing: share of true 'present' readings that abstain | 0.000±0.000 |
| presence fraction: present read present | 1.000±0.000 |
| presence fraction: share of 'present' readings that abstain | 0.000±0.000 |
| presence fraction: share of true 'present' readings that abstain | 0.000±0.000 |
| presence style: share of FALSE 'present' readings that abstain | nan±nan |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |

residual mean 0.060±0.001; status {'ok': 255, 'abstain': 45}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 1.000 | 0.452 / 0.350 | 1.00 | 0.000 | 0.000 / 0.000 |
| role object | 0.992 | 0.252 / 0.111 | 0.98 | 0.000 | 0.012 / 0.008 |
| roles (pooled) | 0.946 | 0.216 / 0.060 | 0.92 | 0.024 | 0.052 / 0.030 |
| role text | 0.979 | 0.217 / 0.077 | 0.91 | 0.000 | 0.064 / 0.021 |
| role style | 1.000 | 0.166 / 0.100 | 1.00 | 0.000 | 0.000 / 0.000 |
| role color | 0.938 | 0.161 / 0.034 | 0.88 | 0.000 | 0.062 / 0.062 |
| role region | 1.000 | 0.299 / 0.242 | 1.00 | 0.000 | 0.000 / 0.000 |
| role direction | 1.000 | 0.197 / 0.075 | 1.00 | 0.000 | 0.000 / 0.000 |
| role source | 0.583 | 0.038 / 0.003 | 0.36 | 0.222 | 0.444 / 0.194 |
| role target | 0.923 | 0.088 / 0.047 | 0.88 | 0.038 | 0.077 / 0.038 |
| role size | 0.941 | 0.173 / 0.072 | 0.88 | 0.000 | 0.059 / 0.059 |
| role edge | 0.833 | 0.188 / 0.141 | 1.00 | 0.167 | 0.000 / 0.000 |
| role quantity | 1.000 | 0.137 / 0.075 | 0.83 | 0.000 | 0.167 / 0.000 |
| role relation | 0.931 | 0.211 / 0.133 | 0.90 | 0.000 | 0.034 / 0.069 |
| role landmark | 0.759 | 0.083 / 0.022 | 0.69 | 0.103 | 0.172 / 0.138 |
| role amount | 1.000 | 0.222 / 0.163 | 1.00 | 0.000 | 0.000 / 0.000 |
| role unit | 1.000 | 0.238 / 0.130 | 1.00 | 0.000 | 0.000 / 0.000 |
| role layout | 1.000 | 0.310 / 0.255 | 1.00 | 0.000 | 0.000 / 0.000 |
| role axis | 1.000 | 0.362 / 0.335 | 1.00 | 0.000 | 0.000 / 0.000 |
| role anchor | 1.000 | 0.273 / 0.226 | 1.00 | 0.000 | 0.000 / 0.000 |
| role pairing | 1.000 | 0.252 / 0.118 | 1.00 | 0.000 | 0.000 / 0.000 |
| role fraction | 1.000 | 0.250 / 0.226 | 1.00 | 0.000 | 0.000 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 with=1.00 COMPONENT=0.96 ANCHOR=0.96 do=0.94 PAIR=0.93 never=0.90 EDGE=0.89 AXIS=0.88 DIR=0.84 REGION=0.73 apart=0.68 UNIT=0.67 LABEL=0.59 back=0.56 front=0.54 flow=0.46 color=0.41 FILLER=0.37 not=0.32 LAYOUT=0.31 PRON=0.28 FRACTION=0.19 are=0.14 together=0.12 unknown=0.12 the=0.08 INTRO=0.06 evenly=0.04 is=0.03 DEM=0.01 NUM=0.01 VERB=0.01 REL=0.00 QUANT=0.00 a=0.00 SIZE=0.00 STYLE=0.00 COLOR=0.00

## What is weak, what to add
- heldout_formulations: FULL 0.870
- heldout_formulations: presence object: share of 'present' readings that abstain 0.049
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.049
- heldout_formulations: heads FULL (lexical order baseline) 0.294
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.356
- heldout_formulations: FULL [depth given] 0.870
- heldout_formulations: FULL [depth and negation given] 0.870
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.718
- heldout_formulations: role object [pooled midpoint (comparison)] 0.864
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.780
- heldout_formulations: presence object: present read present [pooled midpoint (comparison)] 0.866
- heldout_formulations: presence direction: share of 'present' readings that abstain 0.333
- heldout_formulations: presence direction: share of true 'present' readings that abstain 0.333
- heldout_formulations: presence direction: present read present [pooled midpoint (comparison)] 0.667
- heldout_formulations: presence relation: present read present 0.810
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.059
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.059
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.421
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.421
- heldout_formulations: presence relation: present read present [pooled midpoint (comparison)] 0.800
- heldout_formulations: presence landmark: present read present [pooled midpoint (comparison)] 0.800
- heldout_formulations: presence text: share of 'present' readings that abstain 0.000
- heldout_formulations: presence text: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence text: present read present [pooled midpoint (comparison)] 0.833
- heldout_formulations: presence size: share of 'present' readings that abstain 0.083
- heldout_formulations: presence size: share of true 'present' readings that abstain 0.083
- heldout_formulations: presence size: present read present [pooled midpoint (comparison)] 0.833
- heldout_formulations: presence quantity: present read present 0.875
- heldout_formulations: presence quantity: share of 'present' readings that abstain 0.214
- heldout_formulations: presence quantity: share of true 'present' readings that abstain 0.214
- heldout_formulations: presence quantity: present read present [pooled midpoint (comparison)] 0.875
- heldout_formulations: presence anchor: share of 'present' readings that abstain 0.000
- heldout_formulations: presence anchor: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of 'present' readings that abstain 0.000
- heldout_formulations: presence fraction: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence region: share of 'present' readings that abstain 0.000
- heldout_formulations: presence region: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence style: share of 'present' readings that abstain 0.500
- heldout_formulations: presence amount: share of 'present' readings that abstain 0.000
- heldout_formulations: presence amount: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.000
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence target: share of 'present' readings that abstain 0.379
- heldout_formulations: presence target: share of true 'present' readings that abstain 0.379
- heldout_formulations: presence edge: share of 'present' readings that abstain 0.000
- heldout_formulations: presence edge: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence edge: present read present [pooled midpoint (comparison)] 0.897
- heldout_formulations: presence pairing: share of 'present' readings that abstain 0.000
- heldout_formulations: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_formulations: presence style: share of true 'present' readings that abstain 0.400
- heldout_formulations: presence style: present read present [pooled midpoint (comparison)] 0.400
- heldout_sentences: FULL 0.881
- heldout_sentences: presence object: share of 'present' readings that abstain 0.041
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.041
- heldout_sentences: presence layout: share of 'present' readings that abstain 0.000
- heldout_sentences: presence layout: share of true 'present' readings that abstain 0.000
- heldout_sentences: determiner identity (outside FULL when the legend excludes it) 0.893
- heldout_sentences: heads FULL (lexical order baseline) 0.205
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.529
- heldout_sentences: FULL [depth given] 0.881
- heldout_sentences: FULL [depth and negation given] 0.881
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.731
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.797
- heldout_sentences: presence region: share of 'present' readings that abstain 0.000
- heldout_sentences: presence region: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence direction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence direction: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence direction: present read present [pooled midpoint (comparison)] 0.862
- heldout_sentences: presence text: share of 'present' readings that abstain 0.051
- heldout_sentences: presence text: share of true 'present' readings that abstain 0.052
- heldout_sentences: presence text: present read present [pooled midpoint (comparison)] 0.772
- heldout_sentences: presence pairing: share of 'present' readings that abstain 0.000
- heldout_sentences: presence pairing: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence source: share of 'present' readings that abstain 0.762
- heldout_sentences: presence source: share of true 'present' readings that abstain 0.762
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.683
- heldout_sentences: presence color: present read present 0.812
- heldout_sentences: presence color: share of 'present' readings that abstain 0.357
- heldout_sentences: presence color: share of true 'present' readings that abstain 0.308
- heldout_sentences: presence color: present read present [pooled midpoint (comparison)] 0.438
- heldout_sentences: presence size: share of 'present' readings that abstain 0.111
- heldout_sentences: presence size: share of true 'present' readings that abstain 0.111
- heldout_sentences: presence size: present read present [pooled midpoint (comparison)] 0.786
- heldout_sentences: presence quantity: share of 'present' readings that abstain 0.091
- heldout_sentences: presence quantity: share of true 'present' readings that abstain 0.091
- heldout_sentences: presence relation: share of 'present' readings that abstain 0.087
- heldout_sentences: presence relation: share of true 'present' readings that abstain 0.087
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.267
- heldout_sentences: presence landmark: share of true 'present' readings that abstain 0.267
- heldout_sentences: presence relation: present read present [pooled midpoint (comparison)] 0.896
- heldout_sentences: presence landmark: present read present [pooled midpoint (comparison)] 0.875
- heldout_sentences: presence anchor: share of 'present' readings that abstain 0.036
- heldout_sentences: presence anchor: share of true 'present' readings that abstain 0.036
- heldout_sentences: presence axis: share of 'present' readings that abstain 0.000
- heldout_sentences: presence axis: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence axis: present read present [pooled midpoint (comparison)] 0.846
- heldout_sentences: presence target: share of 'present' readings that abstain 0.194
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.194
- heldout_sentences: presence target: present read present [pooled midpoint (comparison)] 0.850
- heldout_sentences: presence style: share of 'present' readings that abstain 0.154
- heldout_sentences: presence style: share of true 'present' readings that abstain 0.154
- heldout_sentences: presence style: present read present [pooled midpoint (comparison)] 0.692
- heldout_sentences: presence amount: share of 'present' readings that abstain 0.000
- heldout_sentences: presence amount: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.000
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence edge: share of 'present' readings that abstain 0.000
- heldout_sentences: presence edge: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence text: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of 'present' readings that abstain 0.000
- heldout_sentences: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities: FULL 0.863
- new_identities: presence object: share of 'present' readings that abstain 0.057
- new_identities: presence object: share of true 'present' readings that abstain 0.057
- new_identities: presence size: share of 'present' readings that abstain 0.000
- new_identities: presence size: share of true 'present' readings that abstain 0.000
- new_identities: presence amount: share of 'present' readings that abstain 0.020
- new_identities: presence amount: share of true 'present' readings that abstain 0.020
- new_identities: presence unit: share of 'present' readings that abstain 0.020
- new_identities: presence unit: share of true 'present' readings that abstain 0.020
- new_identities: heads FULL (lexical order baseline) 0.060
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.367
- new_identities: FULL [depth given] 0.863
- new_identities: FULL [depth and negation given] 0.863
- new_identities: FULL [pooled midpoint (comparison)] 0.657
- new_identities: role object [pooled midpoint (comparison)] 0.873
- new_identities: role landmark [pooled midpoint (comparison)] 0.890
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.710
- new_identities: presence text: share of 'present' readings that abstain 0.048
- new_identities: presence text: share of true 'present' readings that abstain 0.049
- new_identities: presence text: present read present [pooled midpoint (comparison)] 0.806
- new_identities: presence relation: present read present 0.821
- new_identities: presence landmark: present read present 0.821
- new_identities: presence landmark: share of 'present' readings that abstain 0.406
- new_identities: presence landmark: share of true 'present' readings that abstain 0.406
- new_identities: presence relation: present read present [pooled midpoint (comparison)] 0.732
- new_identities: presence landmark: present read present [pooled midpoint (comparison)] 0.732
- new_identities: presence anchor: share of 'present' readings that abstain 0.000
- new_identities: presence anchor: share of true 'present' readings that abstain 0.000
- new_identities: presence fraction: share of 'present' readings that abstain 0.000
- new_identities: presence fraction: share of true 'present' readings that abstain 0.000
- new_identities: presence source: share of 'present' readings that abstain 0.897
- new_identities: presence source: share of true 'present' readings that abstain 0.897
- new_identities: presence target: present read present 0.897
- new_identities: presence target: share of 'present' readings that abstain 0.231
- new_identities: presence target: share of true 'present' readings that abstain 0.231
- new_identities: presence edge: share of 'present' readings that abstain 0.000
- new_identities: presence edge: share of true 'present' readings that abstain 0.000
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.690
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.690
- new_identities: presence relation: share of 'present' readings that abstain 0.087
- new_identities: presence relation: share of true 'present' readings that abstain 0.087
- new_identities: presence region: share of 'present' readings that abstain 0.000
- new_identities: presence region: share of true 'present' readings that abstain 0.000
- new_identities: presence direction: present read present 0.862
- new_identities: presence direction: share of 'present' readings that abstain 0.080
- new_identities: presence direction: share of true 'present' readings that abstain 0.080
- new_identities: presence direction: present read present [pooled midpoint (comparison)] 0.586
- new_identities: presence style: present read present 0.800
- new_identities: presence style: share of 'present' readings that abstain 0.200
- new_identities: presence style: share of true 'present' readings that abstain 0.000
- new_identities: presence style: present read present [pooled midpoint (comparison)] 0.600
- new_identities: presence color: share of 'present' readings that abstain 0.286
- new_identities: presence color: share of true 'present' readings that abstain 0.167
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.333
- new_identities: presence text: share of FALSE 'present' readings that abstain 0.000
- train (sample): presence object: share of 'present' readings that abstain 0.019
- train (sample): presence object: share of true 'present' readings that abstain 0.019
- train (sample): presence text: share of 'present' readings that abstain 0.065
- train (sample): presence text: share of true 'present' readings that abstain 0.065
- train (sample): heads FULL (lexical order baseline) 0.227
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.797
- train (sample): presence style: share of 'present' readings that abstain 0.167
- train (sample): presence style: share of true 'present' readings that abstain 0.000
- train (sample): presence region: share of 'present' readings that abstain 0.000
- train (sample): presence region: share of true 'present' readings that abstain 0.000
- train (sample): presence direction: share of 'present' readings that abstain 0.000
- train (sample): presence direction: share of true 'present' readings that abstain 0.000
- train (sample): presence color: share of 'present' readings that abstain 0.125
- train (sample): presence color: share of true 'present' readings that abstain 0.067
- train (sample): presence source: share of 'present' readings that abstain 0.639
- train (sample): presence source: share of true 'present' readings that abstain 0.639
- train (sample): presence target: share of 'present' readings that abstain 0.115
- train (sample): presence target: share of true 'present' readings that abstain 0.115
- train (sample): presence size: share of 'present' readings that abstain 0.062
- train (sample): presence size: share of true 'present' readings that abstain 0.062
- train (sample): presence edge: share of 'present' readings that abstain 0.000
- train (sample): presence edge: share of true 'present' readings that abstain 0.000
- train (sample): presence quantity: share of 'present' readings that abstain 0.167
- train (sample): presence quantity: share of true 'present' readings that abstain 0.167
- train (sample): presence relation: share of 'present' readings that abstain 0.037
- train (sample): presence relation: share of true 'present' readings that abstain 0.037
- train (sample): presence landmark: share of 'present' readings that abstain 0.259
- train (sample): presence landmark: share of true 'present' readings that abstain 0.259
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
- train (sample): presence pairing: share of 'present' readings that abstain 0.000
- train (sample): presence pairing: share of true 'present' readings that abstain 0.000
- train (sample): presence fraction: share of 'present' readings that abstain 0.000
- train (sample): presence fraction: share of true 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_sentences: `would you join QUANT COMPONENT PAIR` FULL 0.000 (n 2)
- heldout_sentences: `lets connect QUANT COMPONENT PAIR` FULL 0.000 (n 2)
- heldout_formulations: `now make the STYLE COMPONENT NUM UNIT SIZE .` FULL 0.000 (n 1)
- heldout_formulations: `i want you to insert NUM SIZE COMPONENT` FULL 0.000 (n 1)
- heldout_formulations: `lets insert NUM COMPONENT` FULL 0.000 (n 1)
- heldout_formulations: `i want you to attach QUANT COMPONENT PAIR` FULL 0.000 (n 1)
- heldout_formulations: `i need you to put a COMPONENT NUM UNIT REL LABEL .` FULL 0.000 (n 1)
- heldout_sentences: `i need you to attach the COLOR COMPONENT to the COMPONENT .` FULL 0.000 (n 1)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role size | role style | role text | role relation | role landmark | role region | role anchor | role fraction | role amount | role unit | role direction | role axis | role layout | role pairing | role source | role target | role edge | role quantity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.938±0.000 | 0.868±0.003 | 0.987±0.011 | 1.000±0.000 | 1.000±0.000 | 0.991±0.003 | 1.000±0.000 | 0.979±0.003 | 0.976±0.007 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.962±0.003 | 0.949±0.005 | 0.972±0.005 | 0.994±0.005 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.785±0.008 | 0.721±0.010 | 0.868±0.003 | 1.000±0.000 | 0.992±0.003 | 0.985±0.003 | 0.981±0.005 | 0.976±0.003 | 0.955±0.005 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.998±0.003 | 1.000±0.000 | 0.994±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.962±0.003 | 0.945±0.007 | 0.968±0.007 | 0.985±0.005 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.970±0.007 | 0.898±0.012 | 0.987±0.011 | 0.994±0.000 | 1.000±0.000 | 0.994±0.000 | 1.000±0.000 | 1.000±0.000 | 0.983±0.005 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.962±0.003 | 0.949±0.005 | 0.979±0.007 | 1.000±0.000 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.037±0.009 (— / 0.037±0.009) |
| heldout_formulations | object | comparison: pooled midpoint | 0.866±0.006 | 1.000±0.000 | 0.933±0.003 |  |
| heldout_formulations | color | product: fitted | — | 1.000±0.000 | — |  |
| heldout_formulations | color | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_formulations | size | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.028±0.039 (— / 0.028±0.039) |
| heldout_formulations | size | comparison: pooled midpoint | 0.889±0.039 | 1.000±0.000 | 0.944±0.020 |  |
| heldout_formulations | style | product: fitted | 0.733±0.189 | 0.998±0.003 | 0.866±0.093 | 0.278±0.208 (1.000 / 0.244±0.175) |
| heldout_formulations | style | comparison: pooled midpoint | 0.467±0.094 | 1.000±0.000 | 0.733±0.047 |  |
| heldout_formulations | text | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.014±0.020 (— / 0.014±0.020) |
| heldout_formulations | text | comparison: pooled midpoint | 0.861±0.039 | 1.000±0.000 | 0.931±0.020 |  |
| heldout_formulations | relation | product: fitted | 0.825±0.022 | 1.000±0.000 | 0.913±0.011 | 0.038±0.027 (— / 0.038±0.027) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.833±0.024 | 1.000±0.000 | 0.917±0.012 |  |
| heldout_formulations | landmark | product: fitted | 0.937±0.045 | 1.000±0.000 | 0.968±0.022 | 0.441±0.023 (— / 0.441±0.023) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.800±0.000 | 1.000±0.000 | 0.900±0.000 |  |
| heldout_formulations | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_formulations | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_formulations | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
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
| heldout_formulations | source | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.856±0.031 (— / 0.856±0.031) |
| heldout_formulations | source | comparison: pooled midpoint | 0.967±0.000 | 1.000±0.000 | 0.983±0.000 |  |
| heldout_formulations | target | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.414±0.028 (— / 0.414±0.028) |
| heldout_formulations | target | comparison: pooled midpoint | 0.977±0.016 | 1.000±0.000 | 0.989±0.008 |  |
| heldout_formulations | edge | product: fitted | 0.954±0.033 | 1.000±0.000 | 0.977±0.016 | 0.023±0.033 (— / 0.023±0.033) |
| heldout_formulations | edge | comparison: pooled midpoint | 0.920±0.016 | 1.000±0.000 | 0.960±0.008 |  |
| heldout_formulations | quantity | product: fitted | 0.938±0.051 | 1.000±0.000 | 0.969±0.026 | 0.223±0.033 (— / 0.223±0.033) |
| heldout_formulations | quantity | comparison: pooled midpoint | 0.833±0.059 | 1.000±0.000 | 0.917±0.029 |  |
| heldout_sentences | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.031±0.007 (— / 0.031±0.007) |
| heldout_sentences | object | comparison: pooled midpoint | 0.939±0.005 | 1.000±0.000 | 0.970±0.002 |  |
| heldout_sentences | color | product: fitted | 0.854±0.029 | 0.999±0.001 | 0.926±0.015 | 0.303±0.039 (0.500±0.500 / 0.293±0.010) |
| heldout_sentences | color | comparison: pooled midpoint | 0.396±0.029 | 1.000±0.000 | 0.698±0.015 |  |
| heldout_sentences | size | product: fitted | 0.964±0.000 | 0.998±0.001 | 0.981±0.001 | 0.073±0.031 (1.000±0.000 / 0.049±0.046) |
| heldout_sentences | size | comparison: pooled midpoint | 0.810±0.034 | 1.000±0.000 | 0.905±0.017 |  |
| heldout_sentences | style | product: fitted | 0.923±0.063 | 1.000±0.000 | 0.962±0.031 | 0.195±0.040 (— / 0.195±0.040) |
| heldout_sentences | style | comparison: pooled midpoint | 0.718±0.036 | 1.000±0.000 | 0.859±0.018 |  |
| heldout_sentences | text | product: fitted | 0.958±0.024 | 0.999±0.001 | 0.978±0.012 | 0.071±0.019 (0.000 / 0.071±0.018) |
| heldout_sentences | text | comparison: pooled midpoint | 0.802±0.022 | 1.000±0.000 | 0.901±0.011 |  |
| heldout_sentences | relation | product: fitted | 0.951±0.010 | 1.000±0.000 | 0.976±0.005 | 0.066±0.017 (— / 0.066±0.017) |
| heldout_sentences | relation | comparison: pooled midpoint | 0.889±0.010 | 1.000±0.000 | 0.944±0.005 |  |
| heldout_sentences | landmark | product: fitted | 0.958±0.017 | 1.000±0.000 | 0.979±0.009 | 0.275±0.033 (— / 0.275±0.033) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.868±0.010 | 1.000±0.000 | 0.934±0.005 |  |
| heldout_sentences | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.012±0.017 (— / 0.012±0.017) |
| heldout_sentences | anchor | comparison: pooled midpoint | 0.952±0.017 | 1.000±0.000 | 0.976±0.008 |  |
| heldout_sentences | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | amount | product: fitted | 0.966±0.000 | 1.000±0.000 | 0.983±0.000 | 0.024±0.017 (— / 0.024±0.017) |
| heldout_sentences | amount | comparison: pooled midpoint | 0.954±0.016 | 1.000±0.000 | 0.977±0.008 |  |
| heldout_sentences | unit | product: fitted | 0.931±0.028 | 1.000±0.000 | 0.966±0.014 | 0.051±0.048 (— / 0.051±0.048) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.931±0.000 | 1.000±0.000 | 0.966±0.000 |  |
| heldout_sentences | direction | product: fitted | 0.908±0.016 | 1.000±0.000 | 0.954±0.008 | 0.038±0.054 (— / 0.038±0.054) |
| heldout_sentences | direction | comparison: pooled midpoint | 0.828±0.028 | 1.000±0.000 | 0.914±0.014 |  |
| heldout_sentences | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | axis | comparison: pooled midpoint | 0.846±0.000 | 1.000±0.000 | 0.923±0.000 |  |
| heldout_sentences | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | layout | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.014±0.020 (— / 0.014±0.020) |
| heldout_sentences | pairing | comparison: pooled midpoint | 0.971±0.020 | 1.000±0.000 | 0.986±0.010 |  |
| heldout_sentences | source | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.693±0.067 (— / 0.693±0.067) |
| heldout_sentences | source | comparison: pooled midpoint | 0.725±0.030 | 1.000±0.000 | 0.862±0.015 |  |
| heldout_sentences | target | product: fitted | 0.908±0.012 | 1.000±0.000 | 0.954±0.006 | 0.230±0.054 (— / 0.230±0.054) |
| heldout_sentences | target | comparison: pooled midpoint | 0.833±0.012 | 1.000±0.000 | 0.917±0.006 |  |
| heldout_sentences | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| heldout_sentences | edge | comparison: pooled midpoint | 0.968±0.045 | 1.000±0.000 | 0.984±0.022 |  |
| heldout_sentences | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.061±0.043 (— / 0.061±0.043) |
| heldout_sentences | quantity | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | object | product: fitted | 0.997±0.000 | 1.000±0.000 | 0.999±0.000 | 0.061±0.013 (— / 0.061±0.013) |
| new_identities | object | comparison: pooled midpoint | 0.907±0.004 | 1.000±0.000 | 0.953±0.002 |  |
| new_identities | color | product: fitted | 1.000±0.000 | 0.997±0.000 | 0.999±0.000 | 0.238±0.067 (1.000±0.000 / 0.111±0.079) |
| new_identities | color | comparison: pooled midpoint | 0.333±0.000 | 1.000±0.000 | 0.667±0.000 |  |
| new_identities | size | product: fitted | 0.988±0.017 | 1.000±0.000 | 0.994±0.009 | 0.025±0.017 (— / 0.025±0.017) |
| new_identities | size | comparison: pooled midpoint | 0.951±0.017 | 1.000±0.000 | 0.975±0.009 |  |
| new_identities | style | product: fitted | 0.733±0.094 | 0.999±0.001 | 0.866±0.047 | 0.150±0.108 (1.000 / 0.083±0.118) |
| new_identities | style | comparison: pooled midpoint | 0.533±0.094 | 1.000±0.000 | 0.767±0.047 |  |
| new_identities | text | product: fitted | 0.946±0.057 | 0.995±0.004 | 0.971±0.027 | 0.044±0.019 (0.500±0.500 / 0.041±0.016) |
| new_identities | text | comparison: pooled midpoint | 0.810±0.009 | 0.995±0.000 | 0.903±0.005 |  |
| new_identities | relation | product: fitted | 0.786±0.026 | 1.000±0.000 | 0.893±0.013 | 0.055±0.024 (— / 0.055±0.024) |
| new_identities | relation | comparison: pooled midpoint | 0.735±0.004 | 1.000±0.000 | 0.867±0.002 |  |
| new_identities | landmark | product: fitted | 0.869±0.067 | 1.000±0.000 | 0.935±0.034 | 0.344±0.044 (— / 0.344±0.044) |
| new_identities | landmark | comparison: pooled midpoint | 0.735±0.004 | 1.000±0.000 | 0.867±0.002 |  |
| new_identities | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | anchor | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | fraction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | amount | product: fitted | 0.987±0.009 | 1.000±0.000 | 0.993±0.005 | 0.034±0.019 (— / 0.034±0.019) |
| new_identities | amount | comparison: pooled midpoint | 0.970±0.008 | 1.000±0.000 | 0.985±0.004 |  |
| new_identities | unit | product: fitted | 0.963±0.033 | 1.000±0.000 | 0.982±0.016 | 0.056±0.026 (— / 0.056±0.026) |
| new_identities | unit | comparison: pooled midpoint | 0.977±0.005 | 1.000±0.000 | 0.988±0.002 |  |
| new_identities | direction | product: fitted | 0.851±0.099 | 1.000±0.000 | 0.925±0.049 | 0.122±0.030 (— / 0.122±0.030) |
| new_identities | direction | comparison: pooled midpoint | 0.575±0.016 | 1.000±0.000 | 0.787±0.008 |  |
| new_identities | axis | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | axis | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | layout | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | layout | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | pairing | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | pairing | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| new_identities | source | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.851±0.043 (— / 0.851±0.043) |
| new_identities | source | comparison: pooled midpoint | 0.747±0.043 | 1.000±0.000 | 0.874±0.022 |  |
| new_identities | target | product: fitted | 0.897±0.056 | 1.000±0.000 | 0.948±0.028 | 0.353±0.135 (— / 0.353±0.135) |
| new_identities | target | comparison: pooled midpoint | 0.747±0.043 | 1.000±0.000 | 0.874±0.022 |  |
| new_identities | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| new_identities | edge | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| new_identities | quantity | product: fitted | — | 1.000±0.000 | — |  |
| new_identities | quantity | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| train (sample) | object | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.019±0.003 (— / 0.019±0.003) |
| train (sample) | color | product: fitted | 0.938±0.000 | 0.995±0.002 | 0.966±0.001 | 0.202±0.070 (1.000±0.000 / 0.133±0.054) |
| train (sample) | size | product: fitted | 0.980±0.028 | 1.000±0.000 | 0.990±0.014 | 0.040±0.029 (— / 0.040±0.029) |
| train (sample) | style | product: fitted | 0.933±0.094 | 0.999±0.002 | 0.966±0.047 | 0.122±0.087 (1.000 / 0.067±0.094) |
| train (sample) | text | product: fitted | 0.957±0.030 | 1.000±0.000 | 0.979±0.015 | 0.082±0.024 (— / 0.082±0.024) |
| train (sample) | relation | product: fitted | 0.931±0.028 | 1.000±0.000 | 0.966±0.014 | 0.024±0.017 (— / 0.024±0.017) |
| train (sample) | landmark | product: fitted | 0.943±0.016 | 1.000±0.000 | 0.971±0.008 | 0.183±0.054 (— / 0.183±0.054) |
| train (sample) | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | anchor | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | fraction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | amount | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.024±0.034 (— / 0.024±0.034) |
| train (sample) | unit | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.012±0.017 (— / 0.012±0.017) |
| train (sample) | direction | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.037±0.052 (— / 0.037±0.052) |
| train (sample) | axis | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | layout | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | pairing | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | source | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.630±0.057 (— / 0.630±0.057) |
| train (sample) | target | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.128±0.018 (— / 0.128±0.018) |
| train (sample) | edge | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.000±0.000 (— / 0.000±0.000) |
| train (sample) | quantity | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.056±0.079 (— / 0.056±0.079) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
