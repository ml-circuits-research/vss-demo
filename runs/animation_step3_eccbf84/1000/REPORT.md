# REPORT — world `animation`, legend sha256:04ecad9f34cb… (version 1)

Labels (rule 22): every number below is BUILT (code and measurement exist, computed by this training run). Nothing here is PLANNED or HYPOTHESIS except where a line says so.

## Given and learned (rule 20)
GIVEN: the legend's roles and their vectors, the identities (stars regenerated from the seed), the kinds (lexicon), the event synonym table, the reader block of the legend. LEARNED: the route book only — per-kind displacements of the path / bigram / chain codes and the gates (sigmoid per kind, from an all-closed start), by the single objective max cos(S, S_world) with structured per-sentence targets with pre-set roles; the model learns the assignment.

## Data
1800 annotated sentences from 3 files; provenance: {'generator': 1800}. Audit: none in this world folder (audit/ empty) — agreement not measured. Shapes the v1 decoder cannot read (trained as targets, scored as FULL-wrong): none.

## Splits (written to runs/1000/splits.json before training; source: split_hints.json)
- calibration_heldout_formulations: 207 sentences
- heldout_formulations: 193 sentences
- heldout_sentences: 100 sentences
- new_identities: 400 sentences
- train: 900 sentences

The four splits of spec 6.4: seen formulations = `train` (+ `heldout_sentences`, the held-out SENTENCES of the seen formulations, 10% by hash); held-out FORMULATIONS (by template / file when the examples are templated, else by signature = the sentence with its fillers replaced by their kind; splits named heldout_formulations*); new identities (fillers never in training: ['1200', '150', '270', '3.5', '30', '6', '60', '7', '700', '8', 'analytics', 'broker', 'crawler', 'dashboard', 'ingest', 'irina', 'notifications', 'payroll', 'routing', 'theta', 'tracking', 'vault', 'victor', 'zeta']); plus held-out depth from None when the world says so. The lexical bag baseline and the lexical order baseline are trained on the same training rows and scored on the same rows as the reader.

## Kinds (spec 6.3)
20459 tokens in the examples; 0 with no kind in the lexicon (share 0.000), given the kind `unknown` (placed in the chart, never a filler, listed in `_unplaced`). Word -> kind table: model/catalog.json.

## Training
D=1024, seeds [0, 1, 2, 3, 4], batch 8, lr 0.02, epochs 1, device cuda, codes path+chainL+bigram, gates learned (closed start). Code commit eccbf84. Memory curve: runs/1000/train.log (trainer.train_loop, rule 21).

## Thresholds (rule 25)
Abstention tau = 0.05: stated, not fitted. Presence / attribute / determiner / set-member thresholds: the rule actually applied is printed per entry below (FITTED = argmax of the balanced present / absent accuracy on the calibration rows, judgment 752853c §2, the pooled midpoint printed beside it as the comparison; 'midpoint' only when that rule is the one used); calibration rows = a sample of the TRAINING split plus the calibration half of the held-out formulations when enabled (never the scored rows):
- presence:object: threshold 1.260 [rule: fit; pooled midpoint 1.736 (comparison)] (present 2.196, n 460 / absent 1.277, n 147)
- attr_presence:object: threshold 0.545 [rule: fit; pooled midpoint 0.673 (comparison)] (present 0.975, n 90 / absent 0.370, n 370)
- presence:color: threshold 0.153 [rule: fit; pooled midpoint 0.184 (comparison)] (present 0.273, n 20 / absent 0.095, n 587)
- presence:relation: threshold 0.031 [rule: fit; pooled midpoint 0.107 (comparison)] (present 0.201, n 11 / absent 0.013, n 596)
- presence:landmark: threshold 0.497 [rule: fit; pooled midpoint 0.561 (comparison)] (present 0.875, n 31 / absent 0.248, n 576)
- presence:region: threshold 0.299 [rule: fit; pooled midpoint 0.276 (comparison)] (present 0.486, n 5 / absent 0.067, n 602)
- presence:direction: threshold 0.354 [rule: fit; pooled midpoint 0.307 (comparison)] (present 0.531, n 23 / absent 0.083, n 584)
- presence:distance: threshold 0.196 [rule: fit; pooled midpoint 0.232 (comparison)] (present 0.482, n 23 / absent -0.018, n 584)
- presence:angle: no threshold (one class missing in the calibration rows: read by the training rate (always / never); n present 4, absent 603)
- presence:traveller: threshold 0.251 [rule: fit; pooled midpoint 0.427 (comparison)] (present 0.748, n 93 / absent 0.106, n 514)
- presence:source: threshold 0.653 [rule: fit; pooled midpoint 0.748 (comparison)] (present 1.342, n 30 / absent 0.154, n 577)
- presence:via: threshold 0.256 [rule: fit; pooled midpoint 0.301 (comparison)] (present 0.460, n 7 / absent 0.142, n 600)
- presence:target: threshold 0.398 [rule: fit; pooled midpoint 0.565 (comparison)] (present 0.993, n 72 / absent 0.137, n 535)
- presence:path: threshold 0.095 [rule: fit; pooled midpoint 0.349 (comparison)] (present 0.775, n 31 / absent -0.078, n 576)
- presence:start: threshold 0.643 [rule: fit; pooled midpoint 0.866 (comparison)] (present 1.360, n 105 / absent 0.372, n 502)
- presence:tempo: threshold 1.076 [rule: fit; pooled midpoint 1.289 (comparison)] (present 1.918, n 348 / absent 0.660, n 259)
- presence:ref: threshold 0.841 [rule: fit; pooled midpoint 1.166 (comparison)] (present 1.751, n 307 / absent 0.582, n 300)
- presence:offset: threshold 0.336 [rule: fit; pooled midpoint 0.406 (comparison)] (present 0.569, n 60 / absent 0.242, n 547)
- presence:trigger: threshold 0.464 [rule: fit; pooled midpoint 0.604 (comparison)] (present 1.007, n 95 / absent 0.201, n 512)
- presence:duration: threshold 1.012 [rule: fit; pooled midpoint 1.341 (comparison)] (present 1.932, n 350 / absent 0.751, n 257)
- presence:unit: threshold 1.139 [rule: fit; pooled midpoint 1.470 (comparison)] (present 2.101, n 349 / absent 0.838, n 258)
- presence:per: no threshold (one class missing in the calibration rows: read by the training rate (always / never); n present 2, absent 605)
- presence:speed: threshold 0.366 [rule: fit; pooled midpoint 0.449 (comparison)] (present 0.598, n 90 / absent 0.299, n 517)
- presence:easing: threshold 0.313 [rule: fit; pooled midpoint 0.347 (comparison)] (present 0.492, n 81 / absent 0.203, n 526)
- presence:repeat: threshold 0.596 [rule: fit; pooled midpoint 0.631 (comparison)] (present 0.920, n 69 / absent 0.343, n 538)

## Results (seed 0 model in model/; mean ± std over seeds when more than one)

Chance per role (1 / catalog candidates of the role's kinds): object 0.007, color 0.083, relation 0.167, landmark 0.007, region 0.111, direction 0.250, distance 0.032, angle 0.032, traveller 0.011, source 0.007, via 0.007, target 0.007, path 0.011, start 0.031, tempo 0.167, ref 0.007, offset 0.032, trigger 0.143, duration 0.029, unit 0.500, per 1.000, speed 0.143, easing 0.250, repeat 0.030, predicate 0.018

Two candidate sets: `catalog` = every catalog word of the role's kinds (what `sop formalize` does); `experiment` = as the repository scripts (seen splits: the words seen in training; new identities: the held-out words), for the P0 comparison with RESULTS.

### heldout_formulations — catalog candidates (n = 193 of 193)
| axis | accuracy |
|---|---|
| FULL | 0.245±0.017 |
| FULL [depth given] | 0.245±0.017 |
| FULL [depth and negation given] | 0.248±0.017 |
| FULL [presence not decided] | 0.208±0.012 |
| FULL [pooled midpoint (comparison)] | 0.160±0.011 |
| presence object: present read present | 0.951±0.010 |
| presence object: share of 'present' readings that abstain | 0.416±0.027 |
| presence object: share of true 'present' readings that abstain | 0.406±0.026 |
| presence color: absent read absent | 0.896±0.023 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.965±0.016 |
| presence region: absent read absent | nan±nan |
| presence direction: present read present | 0.840±0.150 |
| presence direction: share of 'present' readings that abstain | 0.840±0.233 |
| presence direction: share of true 'present' readings that abstain | 0.840±0.233 |
| presence distance: present read present | 0.760±0.233 |
| presence distance: share of 'present' readings that abstain | 0.892±0.148 |
| presence distance: share of true 'present' readings that abstain | 0.860±0.196 |
| presence traveller: absent read absent | 0.939±0.032 |
| presence source: absent read absent | 0.989±0.004 |
| presence via: absent read absent | 0.964±0.022 |
| presence target: absent read absent | 0.989±0.012 |
| presence path: absent read absent | 0.985±0.012 |
| presence start: absent read absent | 0.972±0.011 |
| presence tempo: present read present | 0.935±0.036 |
| presence tempo: share of 'present' readings that abstain | 0.115±0.016 |
| presence tempo: share of true 'present' readings that abstain | 0.100±0.023 |
| presence ref: present read present | 0.759±0.046 |
| presence ref: share of 'present' readings that abstain | 0.691±0.053 |
| presence ref: share of true 'present' readings that abstain | 0.683±0.055 |
| presence offset: absent read absent | 0.963±0.009 |
| presence trigger: absent read absent | 1.000±0.000 |
| presence duration: absent read absent | 0.967±0.014 |
| presence unit: absent read absent | 1.000±0.000 |
| presence speed: absent read absent | 1.000±0.000 |
| presence easing: absent read absent | 1.000±0.000 |
| presence repeat: absent read absent | 0.976±0.010 |
| structure (depth, negation) | 0.886±0.015 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.754±0.021 |
| event type (synonym table) | 0.763±0.023 |
| role object | 0.663±0.018 |
| head object | 0.696±0.018 |
| lexical order head object | 0.648±0.000 |
| lexical bag head object | 0.637±0.000 |
| occupancy: known filler | 0.770±0.017 |
| role color | 0.907±0.020 |
| head color | 0.907±0.020 |
| lexical order head color | 1.000±0.000 |
| lexical bag head color | 1.000±0.000 |
| occupancy: not given | 0.976±0.001 |
| role relation | 0.989±0.004 |
| head relation | 0.989±0.004 |
| lexical order head relation | 0.969±0.000 |
| lexical bag head relation | 0.969±0.000 |
| role landmark | 0.940±0.013 |
| head landmark | 0.940±0.013 |
| lexical order head landmark | 0.953±0.000 |
| lexical bag head landmark | 0.953±0.000 |
| role region | 0.994±0.004 |
| head region | 0.994±0.004 |
| lexical order head region | 0.990±0.000 |
| lexical bag head region | 0.990±0.000 |
| role direction | 0.996±0.004 |
| head direction | 0.996±0.004 |
| lexical order head direction | 0.974±0.000 |
| lexical bag head direction | 0.974±0.000 |
| role distance | 0.984±0.007 |
| head distance | 0.984±0.007 |
| lexical order head distance | 0.974±0.000 |
| lexical bag head distance | 0.974±0.000 |
| role angle | 0.993±0.003 |
| head angle | 0.993±0.003 |
| lexical order head angle | 0.995±0.000 |
| lexical bag head angle | 0.995±0.000 |
| role traveller | 0.819±0.022 |
| head traveller | 0.879±0.019 |
| lexical order head traveller | 0.819±0.000 |
| lexical bag head traveller | 0.819±0.000 |
| role source | 0.950±0.004 |
| head source | 0.950±0.004 |
| lexical order head source | 0.948±0.000 |
| lexical bag head source | 0.948±0.000 |
| role via | 0.958±0.019 |
| head via | 0.958±0.019 |
| lexical order head via | 0.990±0.000 |
| lexical bag head via | 0.990±0.000 |
| role target | 0.880±0.019 |
| head target | 0.883±0.021 |
| lexical order head target | 0.855±0.000 |
| lexical bag head target | 0.865±0.000 |
| role path | 0.956±0.013 |
| head path | 0.956±0.013 |
| lexical order head path | 0.959±0.000 |
| lexical bag head path | 0.959±0.000 |
| role start | 0.914±0.016 |
| head start | 0.914±0.016 |
| lexical order head start | 0.788±0.000 |
| lexical bag head start | 0.798±0.000 |
| role tempo | 0.887±0.019 |
| head tempo | 0.887±0.019 |
| lexical order head tempo | 0.912±0.000 |
| lexical bag head tempo | 0.912±0.000 |
| role ref | 0.644±0.034 |
| head ref | 0.665±0.036 |
| lexical order head ref | 0.435±0.000 |
| lexical bag head ref | 0.435±0.000 |
| role offset | 0.922±0.014 |
| head offset | 0.922±0.014 |
| lexical order head offset | 0.907±0.000 |
| lexical bag head offset | 0.907±0.000 |
| role trigger | 0.964±0.014 |
| head trigger | 0.964±0.014 |
| lexical order head trigger | 0.782±0.000 |
| lexical bag head trigger | 0.782±0.000 |
| role duration | 0.883±0.017 |
| head duration | 0.883±0.017 |
| lexical order head duration | 0.824±0.000 |
| lexical bag head duration | 0.813±0.000 |
| role unit | 0.878±0.010 |
| head unit | 0.878±0.010 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.995±0.000 |
| role per | 0.982±0.010 |
| head per | 0.982±0.010 |
| lexical order head per | 0.974±0.000 |
| lexical bag head per | 0.974±0.000 |
| role speed | 0.954±0.012 |
| head speed | 0.954±0.012 |
| lexical order head speed | 0.839±0.000 |
| lexical bag head speed | 0.839±0.000 |
| role easing | 0.972±0.016 |
| head easing | 0.972±0.016 |
| lexical order head easing | 0.876±0.000 |
| lexical bag head easing | 0.876±0.000 |
| role repeat | 0.931±0.016 |
| head repeat | 0.931±0.016 |
| lexical order head repeat | 0.886±0.000 |
| lexical bag head repeat | 0.886±0.000 |
| heads FULL (model) | 0.304±0.022 |
| heads FULL (lexical order baseline) | 0.119±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.130±0.000 |
| role object [presence not decided] | 0.524±0.018 |
| role color [presence not decided] | 0.720±0.000 |
| role relation [presence not decided] | 1.000±0.000 |
| role landmark [presence not decided] | 0.852±0.021 |
| role region [presence not decided] | 1.000±0.000 |
| role direction [presence not decided] | 1.000±0.000 |
| role distance [presence not decided] | 0.941±0.015 |
| role angle [presence not decided] | 0.948±0.009 |
| role traveller [presence not decided] | 0.755±0.011 |
| role source [presence not decided] | 0.879±0.016 |
| role via [presence not decided] | 0.878±0.015 |
| role target [presence not decided] | 0.817±0.017 |
| role path [presence not decided] | 0.911±0.012 |
| role start [presence not decided] | 0.919±0.008 |
| role tempo [presence not decided] | 0.908±0.002 |
| role ref [presence not decided] | 0.562±0.020 |
| role offset [presence not decided] | 0.893±0.016 |
| role trigger [presence not decided] | 1.000±0.000 |
| role duration [presence not decided] | 0.897±0.016 |
| role unit [presence not decided] | 1.000±0.000 |
| role per [presence not decided] | 1.000±0.000 |
| role speed [presence not decided] | 1.000±0.000 |
| role easing [presence not decided] | 1.000±0.000 |
| role repeat [presence not decided] | 0.916±0.009 |
| heads FULL (model) [presence not decided] | 0.244±0.018 |
| role object [pooled midpoint (comparison)] | 0.587±0.026 |
| role color [pooled midpoint (comparison)] | 0.916±0.019 |
| role relation [pooled midpoint (comparison)] | 0.983±0.004 |
| role landmark [pooled midpoint (comparison)] | 0.954±0.006 |
| role region [pooled midpoint (comparison)] | 0.995±0.003 |
| role direction [pooled midpoint (comparison)] | 0.991±0.006 |
| role distance [pooled midpoint (comparison)] | 0.983±0.007 |
| role angle [pooled midpoint (comparison)] | 0.992±0.004 |
| role traveller [pooled midpoint (comparison)] | 0.808±0.014 |
| role source [pooled midpoint (comparison)] | 0.950±0.005 |
| role via [pooled midpoint (comparison)] | 0.945±0.008 |
| role target [pooled midpoint (comparison)] | 0.880±0.016 |
| role path [pooled midpoint (comparison)] | 0.960±0.011 |
| role start [pooled midpoint (comparison)] | 0.873±0.016 |
| role tempo [pooled midpoint (comparison)] | 0.808±0.013 |
| role ref [pooled midpoint (comparison)] | 0.626±0.022 |
| role offset [pooled midpoint (comparison)] | 0.925±0.012 |
| role trigger [pooled midpoint (comparison)] | 0.932±0.014 |
| role duration [pooled midpoint (comparison)] | 0.832±0.010 |
| role unit [pooled midpoint (comparison)] | 0.806±0.017 |
| role per [pooled midpoint (comparison)] | 0.981±0.009 |
| role speed [pooled midpoint (comparison)] | 0.935±0.015 |
| role easing [pooled midpoint (comparison)] | 0.952±0.011 |
| role repeat [pooled midpoint (comparison)] | 0.928±0.013 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.227±0.015 |
| presence object: present read present [pooled midpoint (comparison)] | 0.849±0.014 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.892±0.026 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.988±0.008 |
| presence region: absent read absent [pooled midpoint (comparison)] | nan±nan |
| presence direction: present read present [pooled midpoint (comparison)] | 0.900±0.200 |
| presence distance: present read present [pooled midpoint (comparison)] | 0.850±0.200 |
| presence traveller: absent read absent [pooled midpoint (comparison)] | 0.967±0.015 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.992±0.003 |
| presence via: absent read absent [pooled midpoint (comparison)] | 0.939±0.009 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.998±0.003 |
| presence path: absent read absent [pooled midpoint (comparison)] | 0.989±0.016 |
| presence start: absent read absent [pooled midpoint (comparison)] | 0.988±0.009 |
| presence tempo: present read present [pooled midpoint (comparison)] | 0.873±0.029 |
| presence ref: present read present [pooled midpoint (comparison)] | 0.748±0.030 |
| presence offset: absent read absent [pooled midpoint (comparison)] | 0.963±0.014 |
| presence trigger: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence duration: absent read absent [pooled midpoint (comparison)] | 0.977±0.015 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence speed: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence easing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence repeat: absent read absent [pooled midpoint (comparison)] | 0.974±0.014 |
| presence object: absent read absent | 0.726±0.035 |
| presence direction: absent read absent | 1.000±0.000 |
| presence distance: absent read absent | 0.989±0.007 |
| presence tempo: absent read absent | 0.877±0.026 |
| presence ref: absent read absent | 0.903±0.012 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.748±0.050 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence distance: absent read absent [pooled midpoint (comparison)] | 0.992±0.003 |
| presence tempo: absent read absent [pooled midpoint (comparison)] | 0.863±0.018 |
| presence ref: absent read absent [pooled midpoint (comparison)] | 0.886±0.025 |
| presence start: share of 'present' readings that abstain | 0.321±0.038 |
| presence start: share of FALSE 'present' readings that abstain | 0.667±0.211 |
| presence offset: present read present | 0.580±0.157 |
| presence duration: present read present | 0.894±0.036 |
| presence duration: share of 'present' readings that abstain | 0.269±0.042 |
| presence duration: share of true 'present' readings that abstain | 0.261±0.035 |
| presence unit: present read present | 0.853±0.017 |
| presence unit: share of 'present' readings that abstain | 0.024±0.011 |
| presence unit: share of true 'present' readings that abstain | 0.024±0.011 |
| presence offset: present read present [pooled midpoint (comparison)] | 0.600±0.116 |
| presence duration: present read present [pooled midpoint (comparison)] | 0.860±0.019 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.817±0.017 |
| presence color: share of 'present' readings that abstain | 0.990±0.019 |
| presence color: share of FALSE 'present' readings that abstain | 0.990±0.019 |
| presence speed: present read present | 0.783±0.081 |
| presence speed: share of 'present' readings that abstain | 0.416±0.105 |
| presence speed: share of true 'present' readings that abstain | 0.416±0.105 |
| presence speed: present read present [pooled midpoint (comparison)] | 0.748±0.081 |
| presence traveller: present read present | 0.759±0.098 |
| presence traveller: share of 'present' readings that abstain | 0.845±0.052 |
| presence traveller: share of true 'present' readings that abstain | 0.884±0.055 |
| presence path: present read present | 0.529±0.190 |
| presence path: share of 'present' readings that abstain | 0.717±0.194 |
| presence path: share of true 'present' readings that abstain | 0.600±0.162 |
| presence traveller: present read present [pooled midpoint (comparison)] | 0.549±0.088 |
| presence path: present read present [pooled midpoint (comparison)] | 0.476±0.195 |
| presence object: share of FALSE 'present' readings that abstain | 0.491±0.050 |
| presence source: share of 'present' readings that abstain | 0.921±0.112 |
| presence source: share of FALSE 'present' readings that abstain | 0.933±0.133 |
| presence trigger: present read present | 0.866±0.060 |
| presence trigger: share of 'present' readings that abstain | 0.218±0.042 |
| presence trigger: share of true 'present' readings that abstain | 0.218±0.042 |
| determiner identity (outside FULL when the legend excludes it) | 0.000±0.000 |
| presence trigger: present read present [pooled midpoint (comparison)] | 0.774±0.052 |
| presence start: present read present | 0.778±0.041 |
| presence start: present read present [pooled midpoint (comparison)] | 0.623±0.065 |
| presence via: share of 'present' readings that abstain | 0.859±0.115 |
| presence via: share of FALSE 'present' readings that abstain | 0.856±0.118 |
| presence easing: present read present | 0.829±0.122 |
| presence easing: share of 'present' readings that abstain | 0.616±0.142 |
| presence easing: share of true 'present' readings that abstain | 0.616±0.142 |
| presence easing: present read present [pooled midpoint (comparison)] | 0.704±0.086 |
| presence repeat: present read present | 0.599±0.082 |
| presence repeat: share of 'present' readings that abstain | 0.644±0.129 |
| presence repeat: share of true 'present' readings that abstain | 0.608±0.150 |
| presence repeat: present read present [pooled midpoint (comparison)] | 0.608±0.107 |
| presence target: present read present | 0.589±0.134 |
| presence target: share of 'present' readings that abstain | 0.861±0.063 |
| presence target: share of true 'present' readings that abstain | 0.855±0.078 |
| presence start: share of true 'present' readings that abstain | 0.265±0.055 |
| presence tempo: share of FALSE 'present' readings that abstain | 0.306±0.160 |
| presence target: present read present [pooled midpoint (comparison)] | 0.550±0.169 |
| presence offset: share of 'present' readings that abstain | 0.812±0.094 |
| presence offset: share of true 'present' readings that abstain | 0.747±0.077 |
| presence relation: present read present | 0.633±0.125 |
| presence relation: share of 'present' readings that abstain | 0.960±0.080 |
| presence relation: share of true 'present' readings that abstain | 0.960±0.080 |
| presence landmark: present read present | 0.400±0.054 |
| presence ref: share of FALSE 'present' readings that abstain | 0.796±0.136 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.630±0.125 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.329±0.083 |
| presence source: present read present | 0.623±0.083 |
| presence source: share of true 'present' readings that abstain | 0.933±0.133 |
| presence source: present read present [pooled midpoint (comparison)] | 0.543±0.230 |
| presence repeat: share of FALSE 'present' readings that abstain | 0.813±0.165 |
| presence offset: share of FALSE 'present' readings that abstain | 0.917±0.105 |
| occupancy: unknown filler | 0.733±0.133 |
| presence landmark: share of 'present' readings that abstain | 0.872±0.094 |
| presence landmark: share of FALSE 'present' readings that abstain | 0.928±0.099 |
| presence via: present read present | 0.300±0.245 |
| presence via: share of true 'present' readings that abstain | nan±nan |
| presence via: present read present [pooled midpoint (comparison)] | 0.800±0.245 |
| presence distance: share of FALSE 'present' readings that abstain | 0.950±0.100 |
| presence traveller: share of FALSE 'present' readings that abstain | 0.668±0.191 |
| presence landmark: share of true 'present' readings that abstain | 0.783±0.194 |
| presence path: share of FALSE 'present' readings that abstain | nan±nan |
| presence target: share of FALSE 'present' readings that abstain | nan±nan |
| presence duration: share of FALSE 'present' readings that abstain | 0.600±0.374 |
| presence region: present read present | nan±nan |
| presence region: share of 'present' readings that abstain | nan±nan |
| presence region: share of true 'present' readings that abstain | nan±nan |
| presence region: present read present [pooled midpoint (comparison)] | nan±nan |

residual mean 0.467±0.012; status {'abstain': 171, 'ok': 4, 'no-sense': 18}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.767 | 0.087 / 0.005 | 0.59 | 0.057 | 0.233 / 0.176 |
| role object | 0.632 | 0.060 / 0.000 | 0.54 | 0.128 | 0.218 / 0.241 |
| roles (pooled) | 0.690 | 0.067 / 0.000 | 0.51 | 0.034 | 0.215 / 0.276 |
| role direction | 1.000 | 0.037 / 0.025 | 0.20 | 0.000 | 0.800 / 0.000 |
| role distance | 1.000 | 0.036 / 0.031 | 0.00 | 0.000 | 1.000 / 0.000 |
| role tempo | 0.898 | 0.095 / 0.017 | 0.81 | 0.008 | 0.102 / 0.093 |
| role ref | 0.541 | 0.037 / 0.000 | 0.31 | 0.064 | 0.294 / 0.394 |
| role offset | 0.556 | 0.020 / 0.000 | 0.22 | 0.000 | 0.333 / 0.444 |
| role duration | 0.805 | 0.060 / 0.000 | 0.59 | 0.000 | 0.212 / 0.195 |
| role unit | 0.810 | 0.162 / 0.000 | 0.80 | 0.000 | 0.009 / 0.190 |
| role speed | 0.839 | 0.055 / 0.000 | 0.61 | 0.000 | 0.226 / 0.161 |
| role traveller | 0.257 | 0.014 / 0.000 | 0.09 | 0.086 | 0.257 / 0.657 |
| role path | 0.375 | 0.032 / 0.000 | 0.12 | 0.000 | 0.250 / 0.625 |
| role trigger | 0.905 | 0.075 / 0.017 | 0.74 | 0.000 | 0.167 / 0.095 |
| role start | 0.659 | 0.049 / 0.000 | 0.44 | 0.024 | 0.244 / 0.317 |
| role easing | 0.625 | 0.027 / 0.000 | 0.21 | 0.000 | 0.417 / 0.375 |
| role repeat | 0.591 | 0.024 / 0.000 | 0.14 | 0.000 | 0.455 / 0.409 |
| role target | 0.429 | 0.022 / 0.000 | 0.04 | 0.036 | 0.429 / 0.536 |
| role relation | 0.833 | 0.014 / -0.014 | 0.17 | 0.000 | 0.667 / 0.167 |
| role landmark | 0.333 | 0.012 / 0.000 | 0.11 | 0.000 | 0.222 / 0.667 |
| role source | 0.200 | 0.014 / 0.000 | 0.00 | 0.000 | 0.200 / 0.800 |
| role per | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role angle | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role via | 0.000 | 0.009 / 0.002 | 0.00 | 0.000 | 0.000 / 1.000 |
| role region | 1.000 | 0.007 / 0.007 | 0.00 | 0.000 | 1.000 / 0.000 |

### heldout_formulations — experiment candidates (n = 193 of 193)
| axis | accuracy |
|---|---|
| FULL | 0.044±0.023 |
| FULL [depth given] | 0.044±0.023 |
| FULL [depth and negation given] | 0.044±0.023 |
| FULL [presence not decided] | 0.000±0.000 |
| FULL [pooled midpoint (comparison)] | 0.022±0.014 |
| presence object: present read present | 0.988±0.004 |
| presence object: share of 'present' readings that abstain | 0.783±0.046 |
| presence object: share of true 'present' readings that abstain | 0.773±0.043 |
| presence color: absent read absent | 0.655±0.092 |
| presence relation: absent read absent | 0.795±0.113 |
| presence relation: share of 'present' readings that abstain | 0.995±0.011 |
| presence relation: share of FALSE 'present' readings that abstain | 0.994±0.012 |
| presence landmark: absent read absent | 0.894±0.037 |
| presence region: absent read absent | nan±nan |
| presence direction: present read present | 0.840±0.150 |
| presence direction: share of 'present' readings that abstain | 1.000±0.000 |
| presence direction: share of true 'present' readings that abstain | 1.000±0.000 |
| presence distance: present read present | 0.880±0.098 |
| presence distance: share of 'present' readings that abstain | 1.000±0.000 |
| presence distance: share of true 'present' readings that abstain | 1.000±0.000 |
| presence traveller: absent read absent | 0.651±0.131 |
| presence source: absent read absent | 0.950±0.036 |
| presence via: absent read absent | 0.847±0.075 |
| presence target: absent read absent | 0.885±0.052 |
| presence path: absent read absent | 0.902±0.039 |
| presence start: absent read absent | 0.747±0.040 |
| presence tempo: present read present | 0.958±0.026 |
| presence tempo: share of 'present' readings that abstain | 0.524±0.045 |
| presence tempo: share of true 'present' readings that abstain | 0.460±0.046 |
| presence ref: present read present | 0.937±0.046 |
| presence ref: share of 'present' readings that abstain | 0.976±0.024 |
| presence ref: share of true 'present' readings that abstain | 0.971±0.029 |
| presence offset: absent read absent | 0.522±0.053 |
| presence offset: share of 'present' readings that abstain | 0.998±0.004 |
| presence offset: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence trigger: absent read absent | 0.745±0.073 |
| presence duration: absent read absent | 0.667±0.081 |
| presence duration: share of 'present' readings that abstain | 0.830±0.026 |
| presence duration: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence unit: absent read absent | 0.659±0.059 |
| presence unit: share of 'present' readings that abstain | 0.142±0.033 |
| presence unit: share of FALSE 'present' readings that abstain | 0.252±0.211 |
| presence speed: absent read absent | 0.580±0.035 |
| presence easing: absent read absent | 0.603±0.071 |
| presence easing: share of 'present' readings that abstain | 0.959±0.041 |
| presence easing: share of FALSE 'present' readings that abstain | 0.976±0.031 |
| presence repeat: absent read absent | 0.817±0.059 |
| structure (depth, negation) | 0.840±0.009 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.714±0.020 |
| event type (synonym table) | 0.722±0.020 |
| role object | 0.559±0.029 |
| head object | 0.618±0.021 |
| lexical order head object | 0.648±0.000 |
| lexical bag head object | 0.637±0.000 |
| occupancy: known filler | 0.809±0.013 |
| role color | 0.710±0.080 |
| head color | 0.710±0.080 |
| lexical order head color | 1.000±0.000 |
| lexical bag head color | 1.000±0.000 |
| occupancy: not given | 0.828±0.010 |
| role relation | 0.807±0.091 |
| head relation | 0.807±0.091 |
| lexical order head relation | 0.969±0.000 |
| lexical bag head relation | 0.969±0.000 |
| role landmark | 0.873±0.030 |
| head landmark | 0.873±0.030 |
| lexical order head landmark | 0.953±0.000 |
| lexical bag head landmark | 0.953±0.000 |
| role region | 0.893±0.068 |
| head region | 0.893±0.068 |
| lexical order head region | 0.990±0.000 |
| lexical bag head region | 0.990±0.000 |
| role direction | 0.933±0.012 |
| head direction | 0.933±0.012 |
| lexical order head direction | 0.974±0.000 |
| lexical bag head direction | 0.974±0.000 |
| role distance | 0.911±0.016 |
| head distance | 0.911±0.016 |
| lexical order head distance | 0.974±0.000 |
| lexical bag head distance | 0.974±0.000 |
| role angle | 0.973±0.021 |
| head angle | 0.973±0.021 |
| lexical order head angle | 0.995±0.000 |
| lexical bag head angle | 0.995±0.000 |
| role traveller | 0.581±0.078 |
| head traveller | 0.602±0.077 |
| lexical order head traveller | 0.819±0.000 |
| lexical bag head traveller | 0.819±0.000 |
| role source | 0.911±0.027 |
| head source | 0.911±0.027 |
| lexical order head source | 0.948±0.000 |
| lexical bag head source | 0.948±0.000 |
| role via | 0.862±0.063 |
| head via | 0.862±0.063 |
| lexical order head via | 0.990±0.000 |
| lexical bag head via | 0.990±0.000 |
| role target | 0.777±0.034 |
| head target | 0.777±0.034 |
| lexical order head target | 0.855±0.000 |
| lexical bag head target | 0.865±0.000 |
| role path | 0.883±0.030 |
| head path | 0.883±0.030 |
| lexical order head path | 0.959±0.000 |
| lexical bag head path | 0.959±0.000 |
| role start | 0.739±0.028 |
| head start | 0.739±0.028 |
| lexical order head start | 0.788±0.000 |
| lexical bag head start | 0.798±0.000 |
| role tempo | 0.771±0.023 |
| head tempo | 0.771±0.023 |
| lexical order head tempo | 0.912±0.000 |
| lexical bag head tempo | 0.912±0.000 |
| role ref | 0.461±0.023 |
| head ref | 0.465±0.024 |
| lexical order head ref | 0.435±0.000 |
| lexical bag head ref | 0.435±0.000 |
| role offset | 0.564±0.040 |
| head offset | 0.564±0.040 |
| lexical order head offset | 0.907±0.000 |
| lexical bag head offset | 0.907±0.000 |
| role trigger | 0.775±0.063 |
| head trigger | 0.775±0.063 |
| lexical order head trigger | 0.782±0.000 |
| lexical bag head trigger | 0.782±0.000 |
| role duration | 0.696±0.027 |
| head duration | 0.696±0.027 |
| lexical order head duration | 0.824±0.000 |
| lexical bag head duration | 0.813±0.000 |
| role unit | 0.736±0.016 |
| head unit | 0.736±0.016 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.995±0.000 |
| role per | 0.899±0.091 |
| head per | 0.899±0.091 |
| lexical order head per | 0.974±0.000 |
| lexical bag head per | 0.974±0.000 |
| role speed | 0.632±0.039 |
| head speed | 0.632±0.039 |
| lexical order head speed | 0.839±0.000 |
| lexical bag head speed | 0.839±0.000 |
| role easing | 0.648±0.036 |
| head easing | 0.648±0.036 |
| lexical order head easing | 0.876±0.000 |
| lexical bag head easing | 0.876±0.000 |
| role repeat | 0.783±0.051 |
| head repeat | 0.783±0.051 |
| lexical order head repeat | 0.886±0.000 |
| lexical bag head repeat | 0.886±0.000 |
| heads FULL (model) | 0.055±0.023 |
| heads FULL (lexical order baseline) | 0.119±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.130±0.000 |
| role object [presence not decided] | 0.400±0.033 |
| role color [presence not decided] | 0.053±0.008 |
| role relation [presence not decided] | 0.066±0.011 |
| role landmark [presence not decided] | 0.052±0.007 |
| role region [presence not decided] | 0.055±0.008 |
| role direction [presence not decided] | 0.074±0.007 |
| role distance [presence not decided] | 0.060±0.005 |
| role angle [presence not decided] | 0.053±0.008 |
| role traveller [presence not decided] | 0.048±0.005 |
| role source [presence not decided] | 0.051±0.008 |
| role via [presence not decided] | 0.053±0.008 |
| role target [presence not decided] | 0.047±0.014 |
| role path [presence not decided] | 0.056±0.006 |
| role start [presence not decided] | 0.202±0.011 |
| role tempo [presence not decided] | 0.538±0.023 |
| role ref [presence not decided] | 0.176±0.014 |
| role offset [presence not decided] | 0.069±0.010 |
| role trigger [presence not decided] | 0.227±0.021 |
| role duration [presence not decided] | 0.441±0.026 |
| role unit [presence not decided] | 0.569±0.023 |
| role per [presence not decided] | 0.079±0.008 |
| role speed [presence not decided] | 0.170±0.019 |
| role easing [presence not decided] | 0.120±0.014 |
| role repeat [presence not decided] | 0.087±0.018 |
| heads FULL (model) [presence not decided] | 0.010±0.000 |
| role object [pooled midpoint (comparison)] | 0.513±0.023 |
| role color [pooled midpoint (comparison)] | 0.769±0.043 |
| role relation [pooled midpoint (comparison)] | 0.836±0.029 |
| role landmark [pooled midpoint (comparison)] | 0.930±0.021 |
| role region [pooled midpoint (comparison)] | 0.895±0.078 |
| role direction [pooled midpoint (comparison)] | 0.918±0.016 |
| role distance [pooled midpoint (comparison)] | 0.925±0.019 |
| role angle [pooled midpoint (comparison)] | 0.967±0.024 |
| role traveller [pooled midpoint (comparison)] | 0.719±0.036 |
| role source [pooled midpoint (comparison)] | 0.928±0.014 |
| role via [pooled midpoint (comparison)] | 0.858±0.037 |
| role target [pooled midpoint (comparison)] | 0.826±0.014 |
| role path [pooled midpoint (comparison)] | 0.933±0.035 |
| role start [pooled midpoint (comparison)] | 0.783±0.025 |
| role tempo [pooled midpoint (comparison)] | 0.712±0.016 |
| role ref [pooled midpoint (comparison)] | 0.465±0.027 |
| role offset [pooled midpoint (comparison)] | 0.678±0.033 |
| role trigger [pooled midpoint (comparison)] | 0.820±0.046 |
| role duration [pooled midpoint (comparison)] | 0.678±0.033 |
| role unit [pooled midpoint (comparison)] | 0.706±0.028 |
| role per [pooled midpoint (comparison)] | 0.905±0.089 |
| role speed [pooled midpoint (comparison)] | 0.692±0.058 |
| role easing [pooled midpoint (comparison)] | 0.723±0.008 |
| role repeat [pooled midpoint (comparison)] | 0.818±0.045 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.032±0.014 |
| presence object: present read present [pooled midpoint (comparison)] | 0.892±0.015 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.680±0.064 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.804±0.034 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.960±0.026 |
| presence region: absent read absent [pooled midpoint (comparison)] | nan±nan |
| presence direction: present read present [pooled midpoint (comparison)] | 0.933±0.133 |
| presence distance: present read present [pooled midpoint (comparison)] | 0.933±0.133 |
| presence traveller: absent read absent [pooled midpoint (comparison)] | 0.838±0.062 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.970±0.023 |
| presence via: absent read absent [pooled midpoint (comparison)] | 0.816±0.050 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.947±0.018 |
| presence path: absent read absent [pooled midpoint (comparison)] | 0.958±0.048 |
| presence start: absent read absent [pooled midpoint (comparison)] | 0.855±0.033 |
| presence tempo: present read present [pooled midpoint (comparison)] | 0.909±0.026 |
| presence ref: present read present [pooled midpoint (comparison)] | 0.893±0.027 |
| presence offset: absent read absent [pooled midpoint (comparison)] | 0.621±0.051 |
| presence trigger: absent read absent [pooled midpoint (comparison)] | 0.837±0.066 |
| presence duration: absent read absent [pooled midpoint (comparison)] | 0.712±0.065 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.714±0.053 |
| presence speed: absent read absent [pooled midpoint (comparison)] | 0.643±0.074 |
| presence easing: absent read absent [pooled midpoint (comparison)] | 0.684±0.028 |
| presence repeat: absent read absent [pooled midpoint (comparison)] | 0.845±0.057 |
| presence object: absent read absent | 0.626±0.024 |
| presence color: share of 'present' readings that abstain | 0.995±0.010 |
| presence color: share of FALSE 'present' readings that abstain | 0.995±0.010 |
| presence direction: absent read absent | 0.929±0.016 |
| presence distance: absent read absent | 0.912±0.021 |
| presence tempo: absent read absent | 0.681±0.034 |
| presence ref: absent read absent | 0.677±0.015 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.684±0.067 |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.905±0.025 |
| presence distance: absent read absent [pooled midpoint (comparison)] | 0.926±0.030 |
| presence tempo: absent read absent [pooled midpoint (comparison)] | 0.702±0.021 |
| presence ref: absent read absent [pooled midpoint (comparison)] | 0.681±0.049 |
| presence start: share of 'present' readings that abstain | 0.824±0.059 |
| presence start: share of FALSE 'present' readings that abstain | 0.992±0.015 |
| presence offset: present read present | 0.929±0.044 |
| presence offset: share of true 'present' readings that abstain | 0.988±0.025 |
| presence trigger: share of 'present' readings that abstain | 0.786±0.044 |
| presence trigger: share of FALSE 'present' readings that abstain | 0.995±0.011 |
| presence duration: present read present | 0.940±0.035 |
| presence duration: share of true 'present' readings that abstain | 0.796±0.029 |
| presence unit: present read present | 0.905±0.021 |
| presence unit: share of true 'present' readings that abstain | 0.122±0.018 |
| presence repeat: share of 'present' readings that abstain | 1.000±0.000 |
| presence repeat: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence offset: present read present [pooled midpoint (comparison)] | 0.817±0.053 |
| presence duration: present read present [pooled midpoint (comparison)] | 0.910±0.013 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.856±0.022 |
| presence speed: present read present | 0.812±0.060 |
| presence speed: share of 'present' readings that abstain | 0.921±0.018 |
| presence speed: share of true 'present' readings that abstain | 0.734±0.058 |
| presence speed: present read present [pooled midpoint (comparison)] | 0.817±0.066 |
| presence traveller: present read present | 0.896±0.054 |
| presence traveller: share of 'present' readings that abstain | 0.996±0.008 |
| presence traveller: share of true 'present' readings that abstain | 0.990±0.020 |
| presence path: present read present | 0.752±0.113 |
| presence path: share of 'present' readings that abstain | 0.989±0.021 |
| presence path: share of true 'present' readings that abstain | 0.960±0.080 |
| presence traveller: present read present [pooled midpoint (comparison)] | 0.605±0.015 |
| presence path: present read present [pooled midpoint (comparison)] | 0.620±0.204 |
| presence object: share of FALSE 'present' readings that abstain | 0.858±0.081 |
| presence region: share of 'present' readings that abstain | nan±nan |
| presence region: share of FALSE 'present' readings that abstain | nan±nan |
| presence distance: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| presence trigger: present read present | 0.897±0.058 |
| presence trigger: share of true 'present' readings that abstain | 0.607±0.026 |
| determiner identity (outside FULL when the legend excludes it) | 0.000±0.000 |
| presence trigger: present read present [pooled midpoint (comparison)] | 0.816±0.054 |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: share of 'present' readings that abstain | 1.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence path: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence start: present read present | 0.874±0.037 |
| presence start: present read present [pooled midpoint (comparison)] | 0.715±0.101 |
| presence traveller: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence speed: share of FALSE 'present' readings that abstain | 0.994±0.012 |
| presence landmark: share of 'present' readings that abstain | 1.000±0.000 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence via: share of 'present' readings that abstain | 1.000±0.000 |
| presence via: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence easing: present read present | 0.850±0.136 |
| presence easing: share of true 'present' readings that abstain | 0.905±0.079 |
| presence easing: present read present [pooled midpoint (comparison)] | 0.722±0.094 |
| presence repeat: present read present | 0.748±0.078 |
| presence repeat: share of true 'present' readings that abstain | 1.000±0.000 |
| presence repeat: present read present [pooled midpoint (comparison)] | 0.675±0.103 |
| presence target: present read present | 0.951±0.081 |
| presence target: share of true 'present' readings that abstain | 1.000±0.000 |
| presence start: share of true 'present' readings that abstain | 0.626±0.099 |
| presence tempo: share of FALSE 'present' readings that abstain | 0.893±0.068 |
| presence ref: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present [pooled midpoint (comparison)] | 0.879±0.071 |
| presence relation: present read present | 0.607±0.122 |
| presence relation: share of true 'present' readings that abstain | 1.000±0.000 |
| presence landmark: present read present | 0.568±0.095 |
| presence landmark: share of true 'present' readings that abstain | 1.000±0.000 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.577±0.203 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.469±0.171 |
| presence source: present read present | 0.927±0.093 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence source: present read present [pooled midpoint (comparison)] | 0.851±0.140 |
| occupancy: unknown filler | 0.733±0.133 |
| presence via: present read present | 0.800±0.245 |
| presence via: share of true 'present' readings that abstain | 1.000±0.000 |
| presence via: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence region: present read present | nan±nan |
| presence region: share of true 'present' readings that abstain | nan±nan |
| presence region: present read present [pooled midpoint (comparison)] | nan±nan |

residual mean 0.557±0.005; status {'abstain': 165, 'no-sense': 28}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.731 | 0.087 / 0.005 | 0.59 | 0.093 | 0.233 / 0.176 |
| role object | 0.429 | 0.033 / 0.000 | 0.26 | 0.068 | 0.241 / 0.504 |
| roles (pooled) | 0.516 | 0.040 / 0.000 | 0.27 | 0.014 | 0.265 / 0.470 |
| role direction | 0.800 | 0.014 / 0.006 | 0.00 | 0.000 | 0.800 / 0.200 |
| role distance | 0.200 | 0.011 / 0.003 | 0.00 | 0.000 | 0.200 / 0.800 |
| role tempo | 0.814 | 0.052 / 0.000 | 0.47 | 0.008 | 0.347 / 0.178 |
| role ref | 0.303 | 0.014 / 0.001 | 0.07 | 0.000 | 0.229 / 0.697 |
| role offset | 0.278 | 0.010 / 0.001 | 0.00 | 0.000 | 0.278 / 0.722 |
| role duration | 0.726 | 0.029 / 0.000 | 0.17 | 0.000 | 0.558 / 0.274 |
| role unit | 0.759 | 0.129 / 0.000 | 0.71 | 0.000 | 0.052 / 0.241 |
| role speed | 0.710 | 0.034 / 0.000 | 0.26 | 0.000 | 0.452 / 0.290 |
| role traveller | 0.000 | 0.007 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role path | 0.125 | 0.013 / 0.001 | 0.12 | 0.125 | 0.125 / 0.750 |
| role trigger | 0.857 | 0.042 / 0.002 | 0.38 | 0.000 | 0.476 / 0.143 |
| role start | 0.488 | 0.026 / 0.000 | 0.20 | 0.000 | 0.293 / 0.512 |
| role easing | 0.208 | 0.011 / 0.000 | 0.04 | 0.000 | 0.167 / 0.792 |
| role repeat | 0.182 | 0.009 / 0.000 | 0.00 | 0.000 | 0.182 / 0.818 |
| role target | 0.000 | 0.007 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role relation | 0.333 | 0.012 / 0.000 | 0.00 | 0.000 | 0.333 / 0.667 |
| role landmark | 0.000 | 0.004 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role source | 0.000 | 0.003 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role per | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role angle | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role via | 0.000 | 0.026 / 0.026 | 0.00 | 0.000 | 0.000 / 1.000 |
| role region | 0.000 | 0.029 / 0.010 | 0.50 | 0.500 | 0.000 / 0.500 |

### heldout_sentences — catalog candidates (n = 100 of 100)
| axis | accuracy |
|---|---|
| FULL | 0.296±0.019 |
| FULL [depth given] | 0.296±0.019 |
| FULL [depth and negation given] | 0.302±0.017 |
| FULL [pooled midpoint (comparison)] | 0.148±0.020 |
| presence object: present read present | 0.903±0.052 |
| presence object: share of 'present' readings that abstain | 0.342±0.065 |
| presence object: share of true 'present' readings that abstain | 0.327±0.076 |
| presence color: absent read absent | 0.883±0.040 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.977±0.010 |
| presence region: absent read absent | nan±nan |
| presence direction: absent read absent | 1.000±0.000 |
| presence distance: absent read absent | 0.995±0.006 |
| presence traveller: absent read absent | 0.967±0.025 |
| presence source: absent read absent | 0.998±0.005 |
| presence via: absent read absent | 0.971±0.011 |
| presence target: absent read absent | 0.985±0.005 |
| presence path: absent read absent | 0.979±0.008 |
| presence start: absent read absent | 0.966±0.019 |
| presence start: share of 'present' readings that abstain | 0.262±0.082 |
| presence start: share of FALSE 'present' readings that abstain | nan±nan |
| presence tempo: present read present | 0.882±0.050 |
| presence tempo: share of 'present' readings that abstain | 0.058±0.068 |
| presence tempo: share of true 'present' readings that abstain | 0.042±0.044 |
| presence ref: present read present | 0.762±0.029 |
| presence offset: present read present | 0.511±0.099 |
| presence trigger: absent read absent | 1.000±0.000 |
| presence duration: present read present | 0.854±0.032 |
| presence duration: share of 'present' readings that abstain | 0.290±0.058 |
| presence duration: share of true 'present' readings that abstain | 0.234±0.048 |
| presence unit: present read present | 0.828±0.025 |
| presence unit: share of 'present' readings that abstain | 0.032±0.033 |
| presence unit: share of true 'present' readings that abstain | 0.032±0.033 |
| presence speed: present read present | 0.886±0.070 |
| presence speed: share of 'present' readings that abstain | 0.366±0.142 |
| presence speed: share of true 'present' readings that abstain | 0.366±0.142 |
| presence easing: absent read absent | 1.000±0.000 |
| presence repeat: absent read absent | 0.988±0.011 |
| structure (depth, negation) | 0.896±0.022 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.818±0.033 |
| event type (synonym table) | 0.818±0.033 |
| role object | 0.658±0.029 |
| head object | 0.682±0.035 |
| lexical order head object | 0.700±0.000 |
| lexical bag head object | 0.800±0.000 |
| occupancy: known filler | 0.746±0.022 |
| role color | 0.874±0.033 |
| head color | 0.874±0.033 |
| lexical order head color | 0.960±0.000 |
| lexical bag head color | 0.960±0.000 |
| occupancy: not given | 0.979±0.002 |
| role relation | 1.000±0.000 |
| head relation | 1.000±0.000 |
| lexical order head relation | 1.000±0.000 |
| lexical bag head relation | 1.000±0.000 |
| role landmark | 0.954±0.014 |
| head landmark | 0.954±0.014 |
| lexical order head landmark | 0.940±0.000 |
| lexical bag head landmark | 0.940±0.000 |
| role region | 0.996±0.005 |
| head region | 0.996±0.005 |
| lexical order head region | 0.990±0.000 |
| lexical bag head region | 0.990±0.000 |
| role direction | 0.988±0.004 |
| head direction | 0.988±0.004 |
| lexical order head direction | 0.950±0.000 |
| lexical bag head direction | 0.950±0.000 |
| role distance | 0.972±0.007 |
| head distance | 0.972±0.007 |
| lexical order head distance | 0.950±0.000 |
| lexical bag head distance | 0.950±0.000 |
| role angle | 0.984±0.008 |
| head angle | 0.984±0.008 |
| lexical order head angle | 0.990±0.000 |
| lexical bag head angle | 0.990±0.000 |
| role traveller | 0.860±0.027 |
| head traveller | 0.884±0.028 |
| lexical order head traveller | 0.820±0.000 |
| lexical bag head traveller | 0.890±0.000 |
| role source | 0.962±0.004 |
| head source | 0.962±0.004 |
| lexical order head source | 0.960±0.000 |
| lexical bag head source | 0.960±0.000 |
| role via | 0.964±0.010 |
| head via | 0.964±0.010 |
| lexical order head via | 0.990±0.000 |
| lexical bag head via | 0.990±0.000 |
| role target | 0.920±0.006 |
| head target | 0.920±0.006 |
| lexical order head target | 0.900±0.000 |
| lexical bag head target | 0.900±0.000 |
| role path | 0.946±0.005 |
| head path | 0.948±0.007 |
| lexical order head path | 0.950±0.000 |
| lexical bag head path | 0.960±0.000 |
| role start | 0.922±0.018 |
| head start | 0.922±0.018 |
| lexical order head start | 0.770±0.000 |
| lexical bag head start | 0.830±0.000 |
| role tempo | 0.870±0.028 |
| head tempo | 0.870±0.028 |
| lexical order head tempo | 0.930±0.000 |
| lexical bag head tempo | 0.930±0.000 |
| role ref | 0.732±0.015 |
| head ref | 0.748±0.012 |
| lexical order head ref | 0.520±0.000 |
| lexical bag head ref | 0.510±0.000 |
| role offset | 0.912±0.015 |
| head offset | 0.912±0.015 |
| lexical order head offset | 0.890±0.000 |
| lexical bag head offset | 0.890±0.000 |
| role trigger | 0.978±0.007 |
| head trigger | 0.978±0.007 |
| lexical order head trigger | 0.840±0.000 |
| lexical bag head trigger | 0.850±0.000 |
| role duration | 0.834±0.017 |
| head duration | 0.834±0.017 |
| lexical order head duration | 0.720±0.000 |
| lexical bag head duration | 0.780±0.000 |
| role unit | 0.854±0.022 |
| head unit | 0.854±0.022 |
| lexical order head unit | 0.990±0.000 |
| lexical bag head unit | 0.970±0.000 |
| role per | 0.992±0.004 |
| head per | 0.992±0.004 |
| lexical order head per | 0.990±0.000 |
| lexical bag head per | 0.990±0.000 |
| role speed | 0.978±0.007 |
| head speed | 0.978±0.007 |
| lexical order head speed | 0.900±0.000 |
| lexical bag head speed | 0.900±0.000 |
| role easing | 0.984±0.005 |
| head easing | 0.984±0.005 |
| lexical order head easing | 0.890±0.000 |
| lexical bag head easing | 0.890±0.000 |
| role repeat | 0.946±0.008 |
| head repeat | 0.946±0.008 |
| lexical order head repeat | 0.910±0.000 |
| lexical bag head repeat | 0.910±0.000 |
| heads FULL (model) | 0.322±0.031 |
| heads FULL (lexical order baseline) | 0.150±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.220±0.000 |
| role object [pooled midpoint (comparison)] | 0.500±0.037 |
| role color [pooled midpoint (comparison)] | 0.884±0.027 |
| role relation [pooled midpoint (comparison)] | 1.000±0.000 |
| role landmark [pooled midpoint (comparison)] | 0.952±0.013 |
| role region [pooled midpoint (comparison)] | 0.998±0.004 |
| role direction [pooled midpoint (comparison)] | 0.990±0.000 |
| role distance [pooled midpoint (comparison)] | 0.978±0.007 |
| role angle [pooled midpoint (comparison)] | 0.982±0.015 |
| role traveller [pooled midpoint (comparison)] | 0.840±0.019 |
| role source [pooled midpoint (comparison)] | 0.962±0.007 |
| role via [pooled midpoint (comparison)] | 0.948±0.016 |
| role target [pooled midpoint (comparison)] | 0.922±0.004 |
| role path [pooled midpoint (comparison)] | 0.954±0.005 |
| role start [pooled midpoint (comparison)] | 0.870±0.021 |
| role tempo [pooled midpoint (comparison)] | 0.812±0.019 |
| role ref [pooled midpoint (comparison)] | 0.712±0.020 |
| role offset [pooled midpoint (comparison)] | 0.912±0.017 |
| role trigger [pooled midpoint (comparison)] | 0.954±0.010 |
| role duration [pooled midpoint (comparison)] | 0.782±0.012 |
| role unit [pooled midpoint (comparison)] | 0.792±0.028 |
| role per [pooled midpoint (comparison)] | 0.990±0.000 |
| role speed [pooled midpoint (comparison)] | 0.970±0.006 |
| role easing [pooled midpoint (comparison)] | 0.962±0.012 |
| role repeat [pooled midpoint (comparison)] | 0.942±0.013 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.182±0.032 |
| presence object: present read present [pooled midpoint (comparison)] | 0.688±0.047 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.887±0.026 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.981±0.010 |
| presence region: absent read absent [pooled midpoint (comparison)] | nan±nan |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence distance: absent read absent [pooled midpoint (comparison)] | 0.997±0.005 |
| presence traveller: absent read absent [pooled midpoint (comparison)] | 0.975±0.016 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.995±0.006 |
| presence via: absent read absent [pooled midpoint (comparison)] | 0.947±0.020 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.997±0.006 |
| presence path: absent read absent [pooled midpoint (comparison)] | 0.987±0.008 |
| presence start: absent read absent [pooled midpoint (comparison)] | 0.987±0.016 |
| presence tempo: present read present [pooled midpoint (comparison)] | 0.826±0.043 |
| presence ref: present read present [pooled midpoint (comparison)] | 0.765±0.069 |
| presence offset: present read present [pooled midpoint (comparison)] | 0.516±0.073 |
| presence trigger: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence duration: present read present [pooled midpoint (comparison)] | 0.798±0.013 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.784±0.038 |
| presence speed: present read present [pooled midpoint (comparison)] | 0.814±0.057 |
| presence easing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence repeat: absent read absent [pooled midpoint (comparison)] | 0.986±0.012 |
| presence object: absent read absent | 0.748±0.028 |
| presence landmark: share of 'present' readings that abstain | 0.790±0.040 |
| presence landmark: share of FALSE 'present' readings that abstain | 0.833±0.211 |
| presence traveller: present read present | 0.665±0.051 |
| presence source: present read present | 0.400±0.200 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.693±0.065 |
| presence path: share of 'present' readings that abstain | 0.710±0.218 |
| presence path: share of FALSE 'present' readings that abstain | 0.900±0.200 |
| presence ref: share of 'present' readings that abstain | 0.662±0.017 |
| presence ref: share of true 'present' readings that abstain | 0.659±0.015 |
| presence offset: absent read absent | 0.983±0.010 |
| presence trigger: present read present | 0.863±0.047 |
| presence trigger: share of 'present' readings that abstain | 0.229±0.139 |
| presence trigger: share of true 'present' readings that abstain | 0.229±0.139 |
| presence speed: absent read absent | 1.000±0.000 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.802±0.070 |
| presence traveller: present read present [pooled midpoint (comparison)] | 0.428±0.181 |
| presence source: present read present [pooled midpoint (comparison)] | 0.450±0.145 |
| presence target: present read present [pooled midpoint (comparison)] | 0.533±0.140 |
| presence offset: absent read absent [pooled midpoint (comparison)] | 0.986±0.009 |
| presence trigger: present read present [pooled midpoint (comparison)] | 0.741±0.070 |
| presence speed: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence duration: absent read absent | 0.890±0.020 |
| presence unit: absent read absent | 1.000±0.000 |
| presence duration: absent read absent [pooled midpoint (comparison)] | 0.921±0.037 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence start: present read present | 0.853±0.046 |
| presence start: share of true 'present' readings that abstain | 0.197±0.045 |
| presence tempo: absent read absent | 0.925±0.017 |
| presence ref: absent read absent | 0.970±0.010 |
| presence start: present read present [pooled midpoint (comparison)] | 0.580±0.107 |
| presence tempo: absent read absent [pooled midpoint (comparison)] | 0.950±0.022 |
| presence ref: absent read absent [pooled midpoint (comparison)] | 0.972±0.027 |
| presence color: present read present | 0.433±0.276 |
| presence color: present read present [pooled midpoint (comparison)] | 0.467±0.340 |
| presence duration: share of FALSE 'present' readings that abstain | 0.737±0.175 |
| presence repeat: present read present | 0.633±0.138 |
| presence repeat: share of 'present' readings that abstain | 0.578±0.130 |
| presence repeat: share of true 'present' readings that abstain | 0.546±0.130 |
| presence repeat: present read present [pooled midpoint (comparison)] | 0.668±0.167 |
| presence landmark: present read present | 0.600±0.133 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.433±0.133 |
| presence easing: present read present | 0.855±0.045 |
| presence easing: share of 'present' readings that abstain | 0.740±0.155 |
| presence easing: share of true 'present' readings that abstain | 0.740±0.155 |
| presence easing: present read present [pooled midpoint (comparison)] | 0.693±0.114 |
| presence object: share of FALSE 'present' readings that abstain | 0.480±0.121 |
| presence path: present read present | 0.720±0.271 |
| presence path: share of true 'present' readings that abstain | 0.570±0.331 |
| presence path: present read present [pooled midpoint (comparison)] | 0.590±0.211 |
| presence tempo: share of FALSE 'present' readings that abstain | 0.217±0.296 |
| presence color: share of 'present' readings that abstain | 1.000±0.000 |
| presence color: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: present read present | 0.950±0.100 |
| presence direction: share of 'present' readings that abstain | 0.850±0.200 |
| presence direction: share of true 'present' readings that abstain | 0.850±0.200 |
| presence distance: present read present | 0.750±0.158 |
| presence distance: share of 'present' readings that abstain | 0.920±0.160 |
| presence distance: share of true 'present' readings that abstain | 0.900±0.200 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence distance: present read present [pooled midpoint (comparison)] | 0.850±0.122 |
| presence ref: share of FALSE 'present' readings that abstain | 0.800±0.245 |
| presence distance: share of FALSE 'present' readings that abstain | nan±nan |
| presence traveller: share of 'present' readings that abstain | 0.858±0.074 |
| presence traveller: share of true 'present' readings that abstain | 0.850±0.079 |
| presence via: present read present | 0.600±0.490 |
| presence target: share of 'present' readings that abstain | 0.899±0.051 |
| presence target: share of true 'present' readings that abstain | 0.913±0.072 |
| determiner identity (outside FULL when the legend excludes it) | 0.000±0.000 |
| presence via: present read present [pooled midpoint (comparison)] | 0.600±0.490 |
| presence offset: share of 'present' readings that abstain | 0.938±0.076 |
| presence offset: share of true 'present' readings that abstain | 0.967±0.067 |
| presence region: present read present | nan±nan |
| presence region: share of 'present' readings that abstain | nan±nan |
| presence region: share of true 'present' readings that abstain | nan±nan |
| occupancy: unknown filler | 0.800±0.245 |
| presence region: present read present [pooled midpoint (comparison)] | nan±nan |
| presence color: share of true 'present' readings that abstain | nan±nan |
| presence via: share of 'present' readings that abstain | 0.793±0.194 |
| presence via: share of FALSE 'present' readings that abstain | 0.650±0.374 |
| presence landmark: share of true 'present' readings that abstain | 0.800±0.187 |
| presence traveller: share of FALSE 'present' readings that abstain | nan±nan |
| presence target: share of FALSE 'present' readings that abstain | 0.800±0.400 |
| presence offset: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.452±0.015; status {'abstain': 87, 'ok': 5, 'no-sense': 8}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.850 | 0.102 / 0.011 | 0.72 | 0.070 | 0.200 / 0.080 |
| role object | 0.568 | 0.058 / 0.000 | 0.57 | 0.149 | 0.149 / 0.284 |
| roles (pooled) | 0.634 | 0.066 / 0.000 | 0.51 | 0.031 | 0.154 / 0.335 |
| role tempo | 0.820 | 0.092 / 0.000 | 0.82 | 0.000 | 0.000 / 0.180 |
| role ref | 0.438 | 0.030 / 0.000 | 0.27 | 0.021 | 0.188 / 0.542 |
| role offset | 0.364 | 0.004 / 0.000 | 0.00 | 0.000 | 0.364 / 0.636 |
| role duration | 0.735 | 0.057 / 0.000 | 0.59 | 0.000 | 0.143 / 0.265 |
| role unit | 0.797 | 0.161 / 0.000 | 0.81 | 0.017 | 0.000 / 0.186 |
| role speed | 0.800 | 0.067 / 0.000 | 0.60 | 0.000 | 0.200 / 0.200 |
| role traveller | 0.389 | 0.027 / 0.000 | 0.17 | 0.000 | 0.222 / 0.611 |
| role source | 0.000 | 0.007 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role target | 0.400 | 0.022 / 0.000 | 0.10 | 0.000 | 0.300 / 0.600 |
| role trigger | 0.875 | 0.069 / 0.012 | 0.62 | 0.000 | 0.250 / 0.125 |
| role start | 0.783 | 0.074 / 0.000 | 0.65 | 0.000 | 0.130 / 0.217 |
| role color | 0.250 | 0.004 / 0.000 | 0.00 | 0.000 | 0.250 / 0.750 |
| role angle | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role repeat | 0.333 | 0.017 / 0.000 | 0.22 | 0.000 | 0.111 / 0.667 |
| role landmark | 0.333 | 0.008 / 0.000 | 0.00 | 0.000 | 0.333 / 0.667 |
| role easing | 0.909 | 0.038 / 0.004 | 0.18 | 0.000 | 0.727 / 0.091 |
| role path | 0.200 | 0.016 / 0.000 | 0.20 | 0.000 | 0.000 / 0.800 |
| role direction | 0.600 | 0.018 / 0.000 | 0.00 | 0.000 | 0.600 / 0.400 |
| role distance | 0.800 | 0.034 / 0.003 | 0.40 | 0.000 | 0.400 / 0.200 |
| role via | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role region | 1.000 | 0.046 / 0.046 | 0.00 | 0.000 | 1.000 / 0.000 |
| role per | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |

### heldout_sentences — experiment candidates (n = 100 of 100)
| axis | accuracy |
|---|---|
| FULL | 0.060±0.014 |
| FULL [depth given] | 0.060±0.014 |
| FULL [depth and negation given] | 0.060±0.014 |
| FULL [pooled midpoint (comparison)] | 0.018±0.007 |
| presence object: present read present | 0.928±0.040 |
| presence object: share of 'present' readings that abstain | 0.696±0.063 |
| presence object: share of true 'present' readings that abstain | 0.676±0.059 |
| presence color: absent read absent | 0.704±0.069 |
| presence relation: absent read absent | 0.780±0.098 |
| presence landmark: absent read absent | 0.898±0.020 |
| presence landmark: share of 'present' readings that abstain | 1.000±0.000 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence region: absent read absent | nan±nan |
| presence direction: absent read absent | 0.953±0.040 |
| presence distance: absent read absent | 0.951±0.046 |
| presence traveller: absent read absent | 0.761±0.106 |
| presence source: absent read absent | 0.974±0.016 |
| presence via: absent read absent | 0.887±0.058 |
| presence target: absent read absent | 0.938±0.026 |
| presence path: absent read absent | 0.881±0.020 |
| presence start: absent read absent | 0.842±0.060 |
| presence start: share of 'present' readings that abstain | 0.658±0.088 |
| presence start: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence tempo: present read present | 0.920±0.033 |
| presence tempo: share of 'present' readings that abstain | 0.477±0.039 |
| presence tempo: share of true 'present' readings that abstain | 0.386±0.021 |
| presence ref: present read present | 0.909±0.058 |
| presence ref: share of 'present' readings that abstain | 0.991±0.011 |
| presence ref: share of true 'present' readings that abstain | 0.989±0.013 |
| presence offset: present read present | 0.765±0.077 |
| presence offset: share of 'present' readings that abstain | 1.000±0.000 |
| presence offset: share of true 'present' readings that abstain | 1.000±0.000 |
| presence trigger: absent read absent | 0.857±0.030 |
| presence duration: present read present | 0.915±0.033 |
| presence duration: share of 'present' readings that abstain | 0.825±0.030 |
| presence duration: share of true 'present' readings that abstain | 0.772±0.053 |
| presence unit: present read present | 0.864±0.012 |
| presence unit: share of 'present' readings that abstain | 0.183±0.056 |
| presence unit: share of true 'present' readings that abstain | 0.167±0.042 |
| presence speed: present read present | 0.886±0.070 |
| presence speed: share of 'present' readings that abstain | 0.925±0.029 |
| presence speed: share of true 'present' readings that abstain | 0.710±0.110 |
| presence easing: absent read absent | 0.725±0.063 |
| presence repeat: absent read absent | 0.884±0.050 |
| structure (depth, negation) | 0.848±0.020 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.780±0.022 |
| event type (synonym table) | 0.780±0.022 |
| role object | 0.566±0.057 |
| head object | 0.610±0.053 |
| lexical order head object | 0.700±0.000 |
| lexical bag head object | 0.800±0.000 |
| occupancy: known filler | 0.770±0.026 |
| role color | 0.718±0.061 |
| head color | 0.718±0.061 |
| lexical order head color | 0.960±0.000 |
| lexical bag head color | 0.960±0.000 |
| occupancy: not given | 0.871±0.013 |
| role relation | 0.812±0.083 |
| head relation | 0.812±0.083 |
| lexical order head relation | 1.000±0.000 |
| lexical bag head relation | 1.000±0.000 |
| role landmark | 0.864±0.017 |
| head landmark | 0.864±0.017 |
| lexical order head landmark | 0.940±0.000 |
| lexical bag head landmark | 0.940±0.000 |
| role region | 0.912±0.039 |
| head region | 0.912±0.039 |
| lexical order head region | 0.990±0.000 |
| lexical bag head region | 0.990±0.000 |
| role direction | 0.934±0.034 |
| head direction | 0.934±0.034 |
| lexical order head direction | 0.950±0.000 |
| lexical bag head direction | 0.950±0.000 |
| role distance | 0.922±0.043 |
| head distance | 0.922±0.043 |
| lexical order head distance | 0.950±0.000 |
| lexical bag head distance | 0.950±0.000 |
| role angle | 0.966±0.023 |
| head angle | 0.966±0.023 |
| lexical order head angle | 0.990±0.000 |
| lexical bag head angle | 0.990±0.000 |
| role traveller | 0.664±0.081 |
| head traveller | 0.674±0.074 |
| lexical order head traveller | 0.820±0.000 |
| lexical bag head traveller | 0.890±0.000 |
| role source | 0.938±0.013 |
| head source | 0.938±0.013 |
| lexical order head source | 0.960±0.000 |
| lexical bag head source | 0.960±0.000 |
| role via | 0.894±0.048 |
| head via | 0.894±0.048 |
| lexical order head via | 0.990±0.000 |
| lexical bag head via | 0.990±0.000 |
| role target | 0.852±0.020 |
| head target | 0.852±0.020 |
| lexical order head target | 0.900±0.000 |
| lexical bag head target | 0.900±0.000 |
| role path | 0.858±0.017 |
| head path | 0.858±0.017 |
| lexical order head path | 0.950±0.000 |
| lexical bag head path | 0.960±0.000 |
| role start | 0.826±0.041 |
| head start | 0.826±0.041 |
| lexical order head start | 0.770±0.000 |
| lexical bag head start | 0.830±0.000 |
| role tempo | 0.766±0.034 |
| head tempo | 0.766±0.034 |
| lexical order head tempo | 0.930±0.000 |
| lexical bag head tempo | 0.930±0.000 |
| role ref | 0.538±0.029 |
| head ref | 0.540±0.026 |
| lexical order head ref | 0.520±0.000 |
| lexical bag head ref | 0.510±0.000 |
| role offset | 0.690±0.064 |
| head offset | 0.690±0.064 |
| lexical order head offset | 0.890±0.000 |
| lexical bag head offset | 0.890±0.000 |
| role trigger | 0.848±0.029 |
| head trigger | 0.848±0.029 |
| lexical order head trigger | 0.840±0.000 |
| lexical bag head trigger | 0.850±0.000 |
| role duration | 0.698±0.032 |
| head duration | 0.698±0.032 |
| lexical order head duration | 0.720±0.000 |
| lexical bag head duration | 0.780±0.000 |
| role unit | 0.744±0.034 |
| head unit | 0.744±0.034 |
| lexical order head unit | 0.990±0.000 |
| lexical bag head unit | 0.970±0.000 |
| role per | 0.938±0.064 |
| head per | 0.938±0.064 |
| lexical order head per | 0.990±0.000 |
| lexical bag head per | 0.990±0.000 |
| role speed | 0.738±0.031 |
| head speed | 0.738±0.031 |
| lexical order head speed | 0.900±0.000 |
| lexical bag head speed | 0.900±0.000 |
| role easing | 0.746±0.057 |
| head easing | 0.746±0.057 |
| lexical order head easing | 0.890±0.000 |
| lexical bag head easing | 0.890±0.000 |
| role repeat | 0.848±0.029 |
| head repeat | 0.848±0.029 |
| lexical order head repeat | 0.910±0.000 |
| lexical bag head repeat | 0.910±0.000 |
| heads FULL (model) | 0.062±0.013 |
| heads FULL (lexical order baseline) | 0.150±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.220±0.000 |
| role object [pooled midpoint (comparison)] | 0.442±0.050 |
| role color [pooled midpoint (comparison)] | 0.774±0.042 |
| role relation [pooled midpoint (comparison)] | 0.836±0.054 |
| role landmark [pooled midpoint (comparison)] | 0.890±0.015 |
| role region [pooled midpoint (comparison)] | 0.898±0.062 |
| role direction [pooled midpoint (comparison)] | 0.928±0.026 |
| role distance [pooled midpoint (comparison)] | 0.940±0.017 |
| role angle [pooled midpoint (comparison)] | 0.956±0.029 |
| role traveller [pooled midpoint (comparison)] | 0.744±0.036 |
| role source [pooled midpoint (comparison)] | 0.950±0.013 |
| role via [pooled midpoint (comparison)] | 0.890±0.026 |
| role target [pooled midpoint (comparison)] | 0.888±0.010 |
| role path [pooled midpoint (comparison)] | 0.898±0.020 |
| role start [pooled midpoint (comparison)] | 0.828±0.028 |
| role tempo [pooled midpoint (comparison)] | 0.750±0.029 |
| role ref [pooled midpoint (comparison)] | 0.562±0.021 |
| role offset [pooled midpoint (comparison)] | 0.752±0.026 |
| role trigger [pooled midpoint (comparison)] | 0.870±0.017 |
| role duration [pooled midpoint (comparison)] | 0.682±0.026 |
| role unit [pooled midpoint (comparison)] | 0.712±0.031 |
| role per [pooled midpoint (comparison)] | 0.934±0.082 |
| role speed [pooled midpoint (comparison)] | 0.804±0.017 |
| role easing [pooled midpoint (comparison)] | 0.786±0.042 |
| role repeat [pooled midpoint (comparison)] | 0.872±0.025 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.018±0.007 |
| presence object: present read present [pooled midpoint (comparison)] | 0.713±0.036 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.741±0.049 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.782±0.072 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.920±0.016 |
| presence region: absent read absent [pooled midpoint (comparison)] | nan±nan |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.938±0.033 |
| presence distance: absent read absent [pooled midpoint (comparison)] | 0.966±0.014 |
| presence traveller: absent read absent [pooled midpoint (comparison)] | 0.858±0.047 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.983±0.014 |
| presence via: absent read absent [pooled midpoint (comparison)] | 0.866±0.034 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.982±0.014 |
| presence path: absent read absent [pooled midpoint (comparison)] | 0.921±0.025 |
| presence start: absent read absent [pooled midpoint (comparison)] | 0.920±0.031 |
| presence tempo: present read present [pooled midpoint (comparison)] | 0.875±0.032 |
| presence ref: present read present [pooled midpoint (comparison)] | 0.880±0.019 |
| presence offset: present read present [pooled midpoint (comparison)] | 0.689±0.088 |
| presence trigger: absent read absent [pooled midpoint (comparison)] | 0.910±0.015 |
| presence duration: present read present [pooled midpoint (comparison)] | 0.872±0.053 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.829±0.038 |
| presence speed: present read present [pooled midpoint (comparison)] | 0.804±0.062 |
| presence easing: absent read absent [pooled midpoint (comparison)] | 0.770±0.055 |
| presence repeat: absent read absent [pooled midpoint (comparison)] | 0.907±0.038 |
| presence object: absent read absent | 0.607±0.066 |
| presence object: share of FALSE 'present' readings that abstain | 0.834±0.095 |
| presence traveller: present read present | 0.934±0.082 |
| presence traveller: share of 'present' readings that abstain | 1.000±0.000 |
| presence traveller: share of true 'present' readings that abstain | 1.000±0.000 |
| presence source: present read present | 0.767±0.200 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence via: share of 'present' readings that abstain | 1.000±0.000 |
| presence via: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.919±0.068 |
| presence target: share of 'present' readings that abstain | 1.000±0.000 |
| presence target: share of true 'present' readings that abstain | 1.000±0.000 |
| presence path: share of 'present' readings that abstain | 0.968±0.040 |
| presence path: share of FALSE 'present' readings that abstain | 0.971±0.057 |
| presence offset: absent read absent | 0.717±0.082 |
| presence offset: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence trigger: present read present | 0.873±0.040 |
| presence trigger: share of 'present' readings that abstain | 0.701±0.076 |
| presence trigger: share of true 'present' readings that abstain | 0.550±0.087 |
| presence speed: absent read absent | 0.706±0.034 |
| presence speed: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence easing: share of 'present' readings that abstain | 0.976±0.030 |
| presence easing: share of FALSE 'present' readings that abstain | 0.993±0.014 |
| presence repeat: share of 'present' readings that abstain | 0.968±0.027 |
| presence repeat: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.733±0.073 |
| presence traveller: present read present [pooled midpoint (comparison)] | 0.660±0.235 |
| presence source: present read present [pooled midpoint (comparison)] | 0.900±0.200 |
| presence target: present read present [pooled midpoint (comparison)] | 0.751±0.116 |
| presence offset: absent read absent [pooled midpoint (comparison)] | 0.784±0.038 |
| presence trigger: present read present [pooled midpoint (comparison)] | 0.768±0.059 |
| presence speed: absent read absent [pooled midpoint (comparison)] | 0.772±0.027 |
| presence duration: absent read absent | 0.712±0.047 |
| presence duration: share of FALSE 'present' readings that abstain | 0.980±0.040 |
| presence unit: absent read absent | 0.849±0.053 |
| presence duration: absent read absent [pooled midpoint (comparison)] | 0.783±0.036 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.890±0.035 |
| presence start: present read present | 0.894±0.034 |
| presence start: share of true 'present' readings that abstain | 0.461±0.106 |
| presence tempo: absent read absent | 0.786±0.051 |
| presence ref: absent read absent | 0.812±0.044 |
| presence ref: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence start: present read present [pooled midpoint (comparison)] | 0.599±0.087 |
| presence tempo: absent read absent [pooled midpoint (comparison)] | 0.883±0.046 |
| presence ref: absent read absent [pooled midpoint (comparison)] | 0.899±0.038 |
| presence color: share of 'present' readings that abstain | 0.985±0.019 |
| presence color: share of FALSE 'present' readings that abstain | 0.984±0.021 |
| presence relation: share of 'present' readings that abstain | 0.989±0.021 |
| presence relation: share of FALSE 'present' readings that abstain | 0.989±0.021 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present | 0.450±0.267 |
| presence color: present read present [pooled midpoint (comparison)] | 0.400±0.389 |
| presence unit: share of FALSE 'present' readings that abstain | 0.392±0.316 |
| presence repeat: present read present | 0.803±0.129 |
| presence repeat: share of true 'present' readings that abstain | 0.917±0.070 |
| presence repeat: present read present [pooled midpoint (comparison)] | 0.802±0.141 |
| presence landmark: present read present | 0.933±0.133 |
| presence tempo: share of FALSE 'present' readings that abstain | 0.870±0.083 |
| presence easing: present read present | 0.864±0.078 |
| presence easing: share of true 'present' readings that abstain | 0.936±0.088 |
| presence easing: present read present [pooled midpoint (comparison)] | 0.723±0.101 |
| presence path: present read present | 0.840±0.150 |
| presence path: share of true 'present' readings that abstain | 0.960±0.080 |
| presence path: present read present [pooled midpoint (comparison)] | 0.673±0.143 |
| presence direction: share of 'present' readings that abstain | 0.971±0.057 |
| presence direction: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence region: share of 'present' readings that abstain | nan±nan |
| presence region: share of FALSE 'present' readings that abstain | nan±nan |
| presence direction: present read present | 0.950±0.100 |
| presence direction: share of true 'present' readings that abstain | 0.950±0.100 |
| presence distance: present read present | 0.900±0.122 |
| presence distance: share of 'present' readings that abstain | 0.987±0.027 |
| presence distance: share of true 'present' readings that abstain | 0.950±0.100 |
| presence direction: present read present [pooled midpoint (comparison)] | 1.000±0.000 |
| presence distance: present read present [pooled midpoint (comparison)] | 0.950±0.100 |
| presence distance: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence via: present read present | nan±nan |
| determiner identity (outside FULL when the legend excludes it) | 0.000±0.000 |
| presence trigger: share of FALSE 'present' readings that abstain | 0.913±0.047 |
| presence region: present read present | nan±nan |
| presence region: share of true 'present' readings that abstain | nan±nan |
| presence traveller: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence source: share of FALSE 'present' readings that abstain | nan±nan |
| occupancy: unknown filler | 0.800±0.245 |
| presence region: present read present [pooled midpoint (comparison)] | nan±nan |
| presence color: share of true 'present' readings that abstain | nan±nan |
| presence landmark: share of true 'present' readings that abstain | 1.000±0.000 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.780±0.139 |

residual mean 0.540±0.010; status {'abstain': 82, 'ok': 3, 'no-sense': 15}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.800 | 0.102 / 0.011 | 0.72 | 0.120 | 0.200 / 0.080 |
| role object | 0.419 | 0.033 / 0.000 | 0.27 | 0.054 | 0.203 / 0.527 |
| roles (pooled) | 0.477 | 0.041 / 0.000 | 0.27 | 0.017 | 0.221 / 0.506 |
| role tempo | 0.720 | 0.052 / 0.000 | 0.52 | 0.000 | 0.200 / 0.280 |
| role ref | 0.271 | 0.013 / 0.000 | 0.02 | 0.000 | 0.250 / 0.729 |
| role offset | 0.000 | 0.006 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role duration | 0.694 | 0.030 / 0.000 | 0.24 | 0.000 | 0.449 / 0.306 |
| role unit | 0.678 | 0.125 / 0.000 | 0.68 | 0.051 | 0.051 / 0.271 |
| role speed | 0.700 | 0.038 / 0.000 | 0.30 | 0.000 | 0.400 / 0.300 |
| role traveller | 0.167 | 0.010 / 0.001 | 0.00 | 0.000 | 0.167 / 0.833 |
| role source | 0.000 | 0.007 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role target | 0.000 | 0.008 / 0.001 | 0.00 | 0.000 | 0.000 / 1.000 |
| role trigger | 0.625 | 0.039 / 0.001 | 0.31 | 0.000 | 0.312 / 0.375 |
| role start | 0.696 | 0.037 / 0.000 | 0.30 | 0.000 | 0.391 / 0.304 |
| role color | 0.000 | 0.002 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role angle | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role repeat | 0.333 | 0.011 / 0.000 | 0.11 | 0.000 | 0.222 / 0.667 |
| role landmark | 0.000 | 0.003 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role easing | 0.455 | 0.011 / 0.002 | 0.00 | 0.000 | 0.455 / 0.545 |
| role path | 0.000 | 0.004 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role direction | 0.400 | 0.010 / 0.000 | 0.00 | 0.000 | 0.400 / 0.600 |
| role distance | 0.200 | 0.009 / 0.000 | 0.00 | 0.000 | 0.200 / 0.800 |
| role via | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role region | 0.000 | 0.013 / 0.013 | 0.00 | 0.000 | 0.000 / 1.000 |
| role per | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |

### new_identities — catalog candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.195±0.012 |
| FULL [depth given] | 0.195±0.012 |
| FULL [depth and negation given] | 0.198±0.011 |
| FULL [pooled midpoint (comparison)] | 0.140±0.013 |
| presence object: present read present | 0.917±0.009 |
| presence object: share of 'present' readings that abstain | 0.387±0.028 |
| presence object: share of true 'present' readings that abstain | 0.360±0.027 |
| presence color: absent read absent | 0.888±0.041 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.960±0.014 |
| presence region: absent read absent | nan±nan |
| presence direction: absent read absent | 1.000±0.000 |
| presence distance: absent read absent | 0.984±0.009 |
| presence traveller: absent read absent | 0.955±0.022 |
| presence source: absent read absent | 0.991±0.004 |
| presence via: absent read absent | 0.952±0.014 |
| presence target: absent read absent | 0.979±0.011 |
| presence path: absent read absent | 0.976±0.012 |
| presence start: absent read absent | 0.951±0.029 |
| presence tempo: present read present | 0.929±0.025 |
| presence ref: present read present | 0.750±0.056 |
| presence ref: share of 'present' readings that abstain | 0.733±0.029 |
| presence ref: share of true 'present' readings that abstain | 0.733±0.026 |
| presence offset: absent read absent | 0.956±0.018 |
| presence trigger: absent read absent | 1.000±0.000 |
| presence duration: present read present | 0.881±0.066 |
| presence duration: share of 'present' readings that abstain | 0.351±0.047 |
| presence duration: share of true 'present' readings that abstain | 0.331±0.049 |
| presence unit: present read present | 0.879±0.041 |
| presence unit: share of 'present' readings that abstain | 0.034±0.012 |
| presence unit: share of true 'present' readings that abstain | 0.034±0.012 |
| presence speed: absent read absent | 1.000±0.000 |
| presence easing: absent read absent | 1.000±0.000 |
| presence repeat: absent read absent | 0.971±0.013 |
| structure (depth, negation) | 0.895±0.012 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.756±0.018 |
| event type (synonym table) | 0.768±0.021 |
| role object | 0.614±0.029 |
| head object | 0.665±0.022 |
| lexical order head object | 0.730±0.000 |
| lexical bag head object | 0.720±0.000 |
| occupancy: known filler | 0.775±0.022 |
| role color | 0.894±0.037 |
| head color | 0.894±0.037 |
| lexical order head color | 0.985±0.000 |
| lexical bag head color | 0.985±0.000 |
| occupancy: not given | 0.971±0.003 |
| role relation | 0.994±0.001 |
| head relation | 0.994±0.001 |
| lexical order head relation | 0.983±0.000 |
| lexical bag head relation | 0.983±0.000 |
| role landmark | 0.945±0.013 |
| head landmark | 0.946±0.013 |
| lexical order head landmark | 0.970±0.000 |
| lexical bag head landmark | 0.970±0.000 |
| role region | 0.988±0.003 |
| head region | 0.988±0.003 |
| lexical order head region | 0.985±0.000 |
| lexical bag head region | 0.985±0.000 |
| role direction | 0.986±0.007 |
| head direction | 0.986±0.007 |
| lexical order head direction | 0.950±0.000 |
| lexical bag head direction | 0.953±0.000 |
| role distance | 0.970±0.006 |
| head distance | 0.970±0.006 |
| lexical order head distance | 0.950±0.000 |
| lexical bag head distance | 0.953±0.000 |
| role angle | 0.978±0.008 |
| head angle | 0.978±0.008 |
| lexical order head angle | 0.980±0.000 |
| lexical bag head angle | 0.980±0.000 |
| role traveller | 0.853±0.022 |
| head traveller | 0.885±0.022 |
| lexical order head traveller | 0.868±0.000 |
| lexical bag head traveller | 0.875±0.000 |
| role source | 0.914±0.007 |
| head source | 0.915±0.007 |
| lexical order head source | 0.903±0.000 |
| lexical bag head source | 0.903±0.000 |
| role via | 0.938±0.013 |
| head via | 0.938±0.013 |
| lexical order head via | 0.978±0.000 |
| lexical bag head via | 0.978±0.000 |
| role target | 0.840±0.007 |
| head target | 0.848±0.008 |
| lexical order head target | 0.823±0.000 |
| lexical bag head target | 0.828±0.000 |
| role path | 0.963±0.010 |
| head path | 0.964±0.011 |
| lexical order head path | 0.978±0.000 |
| lexical bag head path | 0.978±0.000 |
| role start | 0.873±0.021 |
| head start | 0.873±0.021 |
| lexical order head start | 0.740±0.000 |
| lexical bag head start | 0.752±0.000 |
| role tempo | 0.884±0.010 |
| head tempo | 0.884±0.010 |
| lexical order head tempo | 0.915±0.000 |
| lexical bag head tempo | 0.920±0.000 |
| role ref | 0.636±0.024 |
| head ref | 0.670±0.026 |
| lexical order head ref | 0.447±0.000 |
| lexical bag head ref | 0.447±0.000 |
| role offset | 0.893±0.023 |
| head offset | 0.893±0.023 |
| lexical order head offset | 0.850±0.000 |
| lexical bag head offset | 0.847±0.000 |
| role trigger | 0.973±0.009 |
| head trigger | 0.973±0.009 |
| lexical order head trigger | 0.838±0.000 |
| lexical bag head trigger | 0.838±0.000 |
| role duration | 0.834±0.047 |
| head duration | 0.834±0.047 |
| lexical order head duration | 0.720±0.000 |
| lexical bag head duration | 0.718±0.000 |
| occupancy: unknown filler | 0.722±0.038 |
| role unit | 0.847±0.036 |
| head unit | 0.847±0.036 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.990±0.000 |
| role per | 0.987±0.006 |
| head per | 0.987±0.006 |
| lexical order head per | 0.983±0.000 |
| lexical bag head per | 0.983±0.000 |
| role speed | 0.946±0.012 |
| head speed | 0.946±0.012 |
| lexical order head speed | 0.825±0.000 |
| lexical bag head speed | 0.825±0.000 |
| role easing | 0.961±0.014 |
| head easing | 0.961±0.014 |
| lexical order head easing | 0.858±0.000 |
| lexical bag head easing | 0.858±0.000 |
| role repeat | 0.903±0.021 |
| head repeat | 0.903±0.021 |
| lexical order head repeat | 0.815±0.000 |
| lexical bag head repeat | 0.830±0.000 |
| heads FULL (model) | 0.265±0.018 |
| heads FULL (lexical order baseline) | 0.040±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.065±0.000 |
| role object [pooled midpoint (comparison)] | 0.521±0.009 |
| role color [pooled midpoint (comparison)] | 0.909±0.030 |
| role relation [pooled midpoint (comparison)] | 0.990±0.002 |
| role landmark [pooled midpoint (comparison)] | 0.966±0.009 |
| role region [pooled midpoint (comparison)] | 0.989±0.003 |
| role direction [pooled midpoint (comparison)] | 0.986±0.006 |
| role distance [pooled midpoint (comparison)] | 0.966±0.005 |
| role angle [pooled midpoint (comparison)] | 0.975±0.007 |
| role traveller [pooled midpoint (comparison)] | 0.863±0.011 |
| role source [pooled midpoint (comparison)] | 0.916±0.004 |
| role via [pooled midpoint (comparison)] | 0.923±0.007 |
| role target [pooled midpoint (comparison)] | 0.846±0.005 |
| role path [pooled midpoint (comparison)] | 0.969±0.011 |
| role start [pooled midpoint (comparison)] | 0.844±0.010 |
| role tempo [pooled midpoint (comparison)] | 0.818±0.008 |
| role ref [pooled midpoint (comparison)] | 0.621±0.011 |
| role offset [pooled midpoint (comparison)] | 0.896±0.019 |
| role trigger [pooled midpoint (comparison)] | 0.958±0.006 |
| role duration [pooled midpoint (comparison)] | 0.736±0.023 |
| role unit [pooled midpoint (comparison)] | 0.733±0.020 |
| role per [pooled midpoint (comparison)] | 0.986±0.004 |
| role speed [pooled midpoint (comparison)] | 0.934±0.008 |
| role easing [pooled midpoint (comparison)] | 0.942±0.009 |
| role repeat [pooled midpoint (comparison)] | 0.902±0.015 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.210±0.009 |
| presence object: present read present [pooled midpoint (comparison)] | 0.811±0.022 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.893±0.038 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.985±0.013 |
| presence region: absent read absent [pooled midpoint (comparison)] | nan±nan |
| presence direction: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence distance: absent read absent [pooled midpoint (comparison)] | 0.984±0.010 |
| presence traveller: absent read absent [pooled midpoint (comparison)] | 0.973±0.012 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.993±0.005 |
| presence via: absent read absent [pooled midpoint (comparison)] | 0.924±0.014 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.989±0.005 |
| presence path: absent read absent [pooled midpoint (comparison)] | 0.986±0.015 |
| presence start: absent read absent [pooled midpoint (comparison)] | 0.976±0.012 |
| presence tempo: present read present [pooled midpoint (comparison)] | 0.878±0.015 |
| presence ref: present read present [pooled midpoint (comparison)] | 0.761±0.026 |
| presence offset: absent read absent [pooled midpoint (comparison)] | 0.965±0.005 |
| presence trigger: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence duration: present read present [pooled midpoint (comparison)] | 0.824±0.021 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.835±0.017 |
| presence speed: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence easing: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence repeat: absent read absent [pooled midpoint (comparison)] | 0.971±0.009 |
| presence distance: share of 'present' readings that abstain | 0.840±0.092 |
| presence distance: share of FALSE 'present' readings that abstain | 0.933±0.133 |
| presence start: present read present | 0.737±0.021 |
| presence start: share of 'present' readings that abstain | 0.318±0.048 |
| presence start: share of true 'present' readings that abstain | 0.219±0.034 |
| presence tempo: absent read absent | 0.893±0.014 |
| presence ref: absent read absent | 0.909±0.005 |
| presence speed: present read present | 0.742±0.074 |
| presence speed: share of 'present' readings that abstain | 0.446±0.096 |
| presence speed: share of true 'present' readings that abstain | 0.446±0.096 |
| presence start: present read present [pooled midpoint (comparison)] | 0.624±0.030 |
| presence tempo: absent read absent [pooled midpoint (comparison)] | 0.925±0.015 |
| presence ref: absent read absent [pooled midpoint (comparison)] | 0.927±0.015 |
| presence speed: present read present [pooled midpoint (comparison)] | 0.724±0.059 |
| presence trigger: present read present | 0.867±0.059 |
| presence traveller: share of 'present' readings that abstain | 0.844±0.030 |
| presence traveller: share of FALSE 'present' readings that abstain | 0.693±0.145 |
| presence tempo: share of 'present' readings that abstain | 0.074±0.015 |
| presence tempo: share of true 'present' readings that abstain | 0.066±0.019 |
| presence offset: present read present | 0.605±0.079 |
| presence duration: absent read absent | 0.867±0.034 |
| presence duration: share of FALSE 'present' readings that abstain | 0.888±0.098 |
| presence offset: present read present [pooled midpoint (comparison)] | 0.571±0.086 |
| presence duration: absent read absent [pooled midpoint (comparison)] | 0.870±0.030 |
| presence trigger: share of 'present' readings that abstain | 0.181±0.060 |
| presence trigger: share of true 'present' readings that abstain | 0.181±0.060 |
| presence trigger: present read present [pooled midpoint (comparison)] | 0.846±0.035 |
| presence target: share of 'present' readings that abstain | 0.919±0.009 |
| presence target: share of FALSE 'present' readings that abstain | 0.940±0.080 |
| presence object: absent read absent | 0.584±0.049 |
| presence object: share of FALSE 'present' readings that abstain | 0.645±0.086 |
| presence traveller: present read present | 0.702±0.035 |
| presence traveller: share of true 'present' readings that abstain | 0.893±0.032 |
| presence source: present read present | 0.547±0.094 |
| presence source: share of 'present' readings that abstain | 0.921±0.049 |
| presence source: share of true 'present' readings that abstain | 0.937±0.040 |
| presence target: present read present | 0.597±0.060 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.734±0.046 |
| presence traveller: present read present [pooled midpoint (comparison)] | 0.644±0.083 |
| presence source: present read present [pooled midpoint (comparison)] | 0.590±0.088 |
| presence target: present read present [pooled midpoint (comparison)] | 0.567±0.046 |
| presence via: present read present | 0.556±0.070 |
| presence target: share of true 'present' readings that abstain | 0.920±0.009 |
| presence via: present read present [pooled midpoint (comparison)] | 0.703±0.118 |
| presence direction: present read present | 0.793±0.166 |
| presence direction: share of 'present' readings that abstain | 0.664±0.203 |
| presence direction: share of true 'present' readings that abstain | 0.664±0.203 |
| presence distance: present read present | 0.835±0.112 |
| presence distance: share of true 'present' readings that abstain | 0.798±0.105 |
| presence easing: present read present | 0.760±0.103 |
| presence easing: share of 'present' readings that abstain | 0.610±0.099 |
| presence easing: share of true 'present' readings that abstain | 0.610±0.099 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.873±0.108 |
| presence distance: present read present [pooled midpoint (comparison)] | 0.843±0.064 |
| presence easing: present read present [pooled midpoint (comparison)] | 0.693±0.076 |
| presence offset: share of 'present' readings that abstain | 0.843±0.081 |
| presence offset: share of true 'present' readings that abstain | 0.830±0.070 |
| presence repeat: present read present | 0.701±0.089 |
| presence repeat: present read present [pooled midpoint (comparison)] | 0.703±0.051 |
| presence landmark: present read present | 0.492±0.042 |
| presence via: share of 'present' readings that abstain | 0.914±0.030 |
| presence via: share of FALSE 'present' readings that abstain | 0.915±0.029 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.369±0.040 |
| presence tempo: share of FALSE 'present' readings that abstain | 0.190±0.122 |
| presence landmark: share of 'present' readings that abstain | 0.931±0.043 |
| presence landmark: share of FALSE 'present' readings that abstain | 0.918±0.035 |
| presence color: share of 'present' readings that abstain | 0.974±0.026 |
| presence color: share of FALSE 'present' readings that abstain | 0.981±0.016 |
| presence start: share of FALSE 'present' readings that abstain | 0.824±0.076 |
| presence offset: share of FALSE 'present' readings that abstain | 0.901±0.145 |
| presence repeat: share of 'present' readings that abstain | 0.731±0.065 |
| presence repeat: share of true 'present' readings that abstain | 0.712±0.076 |
| presence unit: absent read absent | 1.000±0.000 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 1.000±0.000 |
| presence landmark: share of true 'present' readings that abstain | 0.967±0.067 |
| presence ref: share of FALSE 'present' readings that abstain | 0.726±0.087 |
| determiner identity (outside FULL when the legend excludes it) | 0.000±0.000 |
| presence via: share of true 'present' readings that abstain | 0.927±0.090 |
| presence path: present read present | 0.431±0.188 |
| presence path: share of 'present' readings that abstain | 0.760±0.152 |
| presence path: share of true 'present' readings that abstain | 0.747±0.229 |
| presence path: present read present [pooled midpoint (comparison)] | 0.233±0.111 |
| presence repeat: share of FALSE 'present' readings that abstain | 0.834±0.178 |
| presence region: present read present | nan±nan |
| presence region: present read present [pooled midpoint (comparison)] | nan±nan |
| presence relation: present read present | 0.648±0.065 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.508±0.103 |
| presence relation: share of 'present' readings that abstain | 0.720±0.392 |
| presence relation: share of true 'present' readings that abstain | 0.720±0.392 |
| presence region: share of 'present' readings that abstain | nan±nan |
| presence region: share of true 'present' readings that abstain | nan±nan |
| presence path: share of FALSE 'present' readings that abstain | 0.796±0.127 |
| presence source: share of FALSE 'present' readings that abstain | 0.850±0.200 |
| presence color: present read present | 0.820±0.223 |
| presence color: present read present [pooled midpoint (comparison)] | 0.850±0.200 |
| presence color: share of true 'present' readings that abstain | 0.910±0.111 |

residual mean 0.428±0.012; status {'abstain': 360, 'ok': 7, 'no-sense': 33}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.782 | 0.069 / 0.007 | 0.54 | 0.062 | 0.307 / 0.155 |
| role object | 0.649 | 0.060 / 0.000 | 0.56 | 0.115 | 0.205 / 0.236 |
| roles (pooled) | 0.670 | 0.067 / 0.000 | 0.50 | 0.027 | 0.194 / 0.303 |
| role tempo | 0.851 | 0.090 / 0.000 | 0.78 | 0.000 | 0.070 / 0.149 |
| role ref | 0.471 | 0.030 / 0.000 | 0.24 | 0.054 | 0.290 / 0.475 |
| role duration | 0.869 | 0.057 / 0.000 | 0.64 | 0.007 | 0.236 / 0.125 |
| role unit | 0.870 | 0.172 / 0.000 | 0.84 | 0.000 | 0.030 / 0.130 |
| role angle | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role start | 0.644 | 0.052 / 0.000 | 0.50 | 0.000 | 0.144 / 0.356 |
| role speed | 0.743 | 0.037 / 0.000 | 0.37 | 0.000 | 0.371 / 0.257 |
| role trigger | 0.769 | 0.058 / 0.000 | 0.63 | 0.000 | 0.138 / 0.231 |
| role offset | 0.517 | 0.013 / -0.004 | 0.08 | 0.000 | 0.433 / 0.483 |
| role traveller | 0.170 | 0.017 / 0.000 | 0.09 | 0.075 | 0.151 / 0.755 |
| role source | 0.154 | 0.014 / 0.000 | 0.03 | 0.000 | 0.128 / 0.846 |
| role target | 0.155 | 0.015 / 0.000 | 0.06 | 0.042 | 0.141 / 0.803 |
| role via | 0.000 | 0.004 / -0.001 | 0.00 | 0.000 | 0.000 / 1.000 |
| role direction | 0.850 | 0.033 / 0.001 | 0.30 | 0.000 | 0.550 / 0.150 |
| role distance | 0.700 | 0.033 / 0.000 | 0.25 | 0.000 | 0.450 / 0.300 |
| role easing | 0.702 | 0.032 / 0.000 | 0.26 | 0.000 | 0.439 / 0.298 |
| role per | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role repeat | 0.473 | 0.016 / 0.000 | 0.09 | 0.000 | 0.378 / 0.527 |
| role landmark | 0.333 | 0.004 / -0.004 | 0.00 | 0.000 | 0.333 / 0.667 |
| role path | 0.222 | 0.005 / 0.000 | 0.00 | 0.000 | 0.222 / 0.778 |
| role color | 0.333 | 0.018 / 0.000 | 0.00 | 0.000 | 0.333 / 0.667 |
| role region | 0.167 | 0.001 / 0.000 | 0.00 | 0.000 | 0.167 / 0.833 |
| role relation | 0.714 | 0.025 / -0.005 | 0.29 | 0.000 | 0.429 / 0.286 |

### new_identities — experiment candidates (n = 400 of 400)
| axis | accuracy |
|---|---|
| FULL | 0.008±0.005 |
| FULL [depth given] | 0.008±0.005 |
| FULL [depth and negation given] | 0.008±0.005 |
| FULL [pooled midpoint (comparison)] | 0.004±0.003 |
| presence object: present read present | 0.958±0.007 |
| presence object: share of 'present' readings that abstain | 0.779±0.022 |
| presence object: share of true 'present' readings that abstain | 0.758±0.023 |
| presence color: absent read absent | 0.664±0.123 |
| presence relation: absent read absent | 0.771±0.117 |
| presence relation: share of 'present' readings that abstain | 0.986±0.018 |
| presence relation: share of FALSE 'present' readings that abstain | 0.989±0.014 |
| presence landmark: absent read absent | 0.881±0.044 |
| presence region: absent read absent | nan±nan |
| presence region: share of 'present' readings that abstain | nan±nan |
| presence region: share of FALSE 'present' readings that abstain | nan±nan |
| presence direction: absent read absent | 0.909±0.021 |
| presence distance: absent read absent | 0.894±0.041 |
| presence traveller: absent read absent | 0.662±0.100 |
| presence source: absent read absent | 0.951±0.042 |
| presence via: absent read absent | 0.839±0.077 |
| presence target: absent read absent | 0.864±0.039 |
| presence path: absent read absent | 0.882±0.036 |
| presence start: absent read absent | 0.661±0.071 |
| presence tempo: present read present | 0.957±0.012 |
| presence ref: present read present | 0.924±0.037 |
| presence ref: share of 'present' readings that abstain | 0.983±0.011 |
| presence ref: share of true 'present' readings that abstain | 0.979±0.013 |
| presence offset: absent read absent | 0.543±0.072 |
| presence offset: share of 'present' readings that abstain | 0.997±0.007 |
| presence offset: share of FALSE 'present' readings that abstain | 0.999±0.003 |
| presence trigger: absent read absent | 0.735±0.066 |
| presence duration: present read present | 0.924±0.051 |
| presence duration: share of 'present' readings that abstain | 0.836±0.030 |
| presence duration: share of true 'present' readings that abstain | 0.816±0.033 |
| presence unit: present read present | 0.907±0.033 |
| presence unit: share of 'present' readings that abstain | 0.152±0.015 |
| presence unit: share of true 'present' readings that abstain | 0.141±0.005 |
| presence speed: absent read absent | 0.581±0.054 |
| presence easing: absent read absent | 0.564±0.097 |
| presence repeat: absent read absent | 0.788±0.061 |
| structure (depth, negation) | 0.865±0.015 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.726±0.014 |
| event type (synonym table) | 0.736±0.016 |
| role object | 0.479±0.008 |
| head object | 0.562±0.026 |
| lexical order head object | 0.730±0.000 |
| lexical bag head object | 0.720±0.000 |
| occupancy: known filler | 0.815±0.025 |
| role color | 0.699±0.109 |
| head color | 0.699±0.109 |
| lexical order head color | 0.985±0.000 |
| lexical bag head color | 0.985±0.000 |
| occupancy: not given | 0.806±0.019 |
| role relation | 0.794±0.101 |
| head relation | 0.794±0.101 |
| lexical order head relation | 0.983±0.000 |
| lexical bag head relation | 0.983±0.000 |
| role landmark | 0.870±0.038 |
| head landmark | 0.870±0.038 |
| lexical order head landmark | 0.970±0.000 |
| lexical bag head landmark | 0.970±0.000 |
| role region | 0.877±0.069 |
| head region | 0.877±0.069 |
| lexical order head region | 0.985±0.000 |
| lexical bag head region | 0.985±0.000 |
| role direction | 0.899±0.014 |
| head direction | 0.899±0.014 |
| lexical order head direction | 0.950±0.000 |
| lexical bag head direction | 0.953±0.000 |
| role distance | 0.880±0.035 |
| head distance | 0.880±0.035 |
| lexical order head distance | 0.950±0.000 |
| lexical bag head distance | 0.953±0.000 |
| role angle | 0.957±0.025 |
| head angle | 0.957±0.025 |
| lexical order head angle | 0.980±0.000 |
| lexical bag head angle | 0.980±0.000 |
| role traveller | 0.615±0.075 |
| head traveller | 0.628±0.075 |
| lexical order head traveller | 0.868±0.000 |
| lexical bag head traveller | 0.875±0.000 |
| role source | 0.867±0.035 |
| head source | 0.868±0.035 |
| lexical order head source | 0.903±0.000 |
| lexical bag head source | 0.903±0.000 |
| role via | 0.841±0.066 |
| head via | 0.841±0.066 |
| lexical order head via | 0.978±0.000 |
| lexical bag head via | 0.978±0.000 |
| role target | 0.727±0.029 |
| head target | 0.729±0.029 |
| lexical order head target | 0.823±0.000 |
| lexical bag head target | 0.828±0.000 |
| role path | 0.880±0.029 |
| head path | 0.880±0.029 |
| lexical order head path | 0.978±0.000 |
| lexical bag head path | 0.978±0.000 |
| role start | 0.676±0.042 |
| head start | 0.676±0.042 |
| lexical order head start | 0.740±0.000 |
| lexical bag head start | 0.752±0.000 |
| role tempo | 0.705±0.035 |
| head tempo | 0.705±0.035 |
| lexical order head tempo | 0.915±0.000 |
| lexical bag head tempo | 0.920±0.000 |
| role ref | 0.438±0.027 |
| head ref | 0.450±0.030 |
| lexical order head ref | 0.447±0.000 |
| lexical bag head ref | 0.447±0.000 |
| role offset | 0.553±0.062 |
| head offset | 0.553±0.062 |
| lexical order head offset | 0.850±0.000 |
| lexical bag head offset | 0.847±0.000 |
| role trigger | 0.762±0.043 |
| head trigger | 0.762±0.043 |
| lexical order head trigger | 0.838±0.000 |
| lexical bag head trigger | 0.838±0.000 |
| role duration | 0.639±0.068 |
| head duration | 0.639±0.068 |
| lexical order head duration | 0.720±0.000 |
| lexical bag head duration | 0.718±0.000 |
| occupancy: unknown filler | 0.774±0.028 |
| role unit | 0.738±0.030 |
| head unit | 0.738±0.030 |
| lexical order head unit | 1.000±0.000 |
| lexical bag head unit | 0.990±0.000 |
| role per | 0.895±0.111 |
| head per | 0.895±0.111 |
| lexical order head per | 0.983±0.000 |
| lexical bag head per | 0.983±0.000 |
| role speed | 0.607±0.040 |
| head speed | 0.607±0.040 |
| lexical order head speed | 0.825±0.000 |
| lexical bag head speed | 0.825±0.000 |
| role easing | 0.605±0.060 |
| head easing | 0.605±0.060 |
| lexical order head easing | 0.858±0.000 |
| lexical bag head easing | 0.858±0.000 |
| role repeat | 0.726±0.056 |
| head repeat | 0.726±0.056 |
| lexical order head repeat | 0.815±0.000 |
| lexical bag head repeat | 0.830±0.000 |
| heads FULL (model) | 0.009±0.007 |
| heads FULL (lexical order baseline) | 0.040±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.065±0.000 |
| role object [pooled midpoint (comparison)] | 0.442±0.011 |
| role color [pooled midpoint (comparison)] | 0.767±0.057 |
| role relation [pooled midpoint (comparison)] | 0.839±0.028 |
| role landmark [pooled midpoint (comparison)] | 0.924±0.028 |
| role region [pooled midpoint (comparison)] | 0.853±0.099 |
| role direction [pooled midpoint (comparison)] | 0.896±0.016 |
| role distance [pooled midpoint (comparison)] | 0.907±0.019 |
| role angle [pooled midpoint (comparison)] | 0.950±0.030 |
| role traveller [pooled midpoint (comparison)] | 0.761±0.025 |
| role source [pooled midpoint (comparison)] | 0.885±0.019 |
| role via [pooled midpoint (comparison)] | 0.838±0.048 |
| role target [pooled midpoint (comparison)] | 0.785±0.007 |
| role path [pooled midpoint (comparison)] | 0.938±0.031 |
| role start [pooled midpoint (comparison)] | 0.755±0.017 |
| role tempo [pooled midpoint (comparison)] | 0.700±0.020 |
| role ref [pooled midpoint (comparison)] | 0.478±0.020 |
| role offset [pooled midpoint (comparison)] | 0.659±0.025 |
| role trigger [pooled midpoint (comparison)] | 0.841±0.023 |
| role duration [pooled midpoint (comparison)] | 0.580±0.066 |
| role unit [pooled midpoint (comparison)] | 0.640±0.034 |
| role per [pooled midpoint (comparison)] | 0.919±0.080 |
| role speed [pooled midpoint (comparison)] | 0.677±0.023 |
| role easing [pooled midpoint (comparison)] | 0.683±0.044 |
| role repeat [pooled midpoint (comparison)] | 0.757±0.054 |
| heads FULL (model) [pooled midpoint (comparison)] | 0.004±0.004 |
| presence color: share of 'present' readings that abstain | 0.994±0.008 |
| presence color: share of FALSE 'present' readings that abstain | 0.996±0.009 |
| presence landmark: share of 'present' readings that abstain | 1.000±0.000 |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence direction: share of 'present' readings that abstain | 0.946±0.001 |
| presence direction: share of FALSE 'present' readings that abstain | 0.982±0.022 |
| presence distance: share of 'present' readings that abstain | 0.991±0.012 |
| presence distance: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence traveller: share of 'present' readings that abstain | 1.000±0.000 |
| presence traveller: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence start: present read present | 0.816±0.023 |
| presence start: share of 'present' readings that abstain | 0.783±0.027 |
| presence start: share of true 'present' readings that abstain | 0.517±0.048 |
| presence tempo: absent read absent | 0.550±0.068 |
| presence tempo: share of 'present' readings that abstain | 0.592±0.028 |
| presence tempo: share of FALSE 'present' readings that abstain | 0.901±0.053 |
| presence ref: absent read absent | 0.584±0.037 |
| presence ref: share of FALSE 'present' readings that abstain | 0.992±0.015 |
| presence trigger: share of 'present' readings that abstain | 0.852±0.026 |
| presence trigger: share of FALSE 'present' readings that abstain | 0.994±0.007 |
| presence speed: present read present | 0.755±0.071 |
| presence speed: share of 'present' readings that abstain | 0.968±0.016 |
| presence speed: share of true 'present' readings that abstain | 0.901±0.062 |
| presence easing: share of 'present' readings that abstain | 0.949±0.011 |
| presence easing: share of FALSE 'present' readings that abstain | 0.979±0.012 |
| presence repeat: share of 'present' readings that abstain | 0.985±0.009 |
| presence repeat: share of FALSE 'present' readings that abstain | 0.997±0.005 |
| presence object: present read present [pooled midpoint (comparison)] | 0.865±0.011 |
| presence color: absent read absent [pooled midpoint (comparison)] | 0.700±0.078 |
| presence relation: absent read absent [pooled midpoint (comparison)] | 0.798±0.041 |
| presence landmark: absent read absent [pooled midpoint (comparison)] | 0.935±0.038 |
| presence region: absent read absent [pooled midpoint (comparison)] | nan±nan |
| presence direction: absent read absent [pooled midpoint (comparison)] | 0.893±0.024 |
| presence distance: absent read absent [pooled midpoint (comparison)] | 0.917±0.024 |
| presence traveller: absent read absent [pooled midpoint (comparison)] | 0.831±0.038 |
| presence source: absent read absent [pooled midpoint (comparison)] | 0.971±0.027 |
| presence via: absent read absent [pooled midpoint (comparison)] | 0.805±0.069 |
| presence target: absent read absent [pooled midpoint (comparison)] | 0.935±0.011 |
| presence path: absent read absent [pooled midpoint (comparison)] | 0.945±0.041 |
| presence start: present read present [pooled midpoint (comparison)] | 0.687±0.036 |
| presence tempo: absent read absent [pooled midpoint (comparison)] | 0.709±0.039 |
| presence ref: absent read absent [pooled midpoint (comparison)] | 0.707±0.019 |
| presence offset: absent read absent [pooled midpoint (comparison)] | 0.643±0.040 |
| presence trigger: absent read absent [pooled midpoint (comparison)] | 0.835±0.049 |
| presence duration: present read present [pooled midpoint (comparison)] | 0.884±0.013 |
| presence unit: present read present [pooled midpoint (comparison)] | 0.874±0.007 |
| presence speed: present read present [pooled midpoint (comparison)] | 0.755±0.044 |
| presence easing: absent read absent [pooled midpoint (comparison)] | 0.637±0.082 |
| presence repeat: absent read absent [pooled midpoint (comparison)] | 0.810±0.070 |
| presence trigger: present read present | 0.893±0.043 |
| presence speed: share of FALSE 'present' readings that abstain | 0.996±0.006 |
| presence tempo: share of true 'present' readings that abstain | 0.508±0.036 |
| presence offset: present read present | 0.861±0.067 |
| presence offset: share of true 'present' readings that abstain | 0.991±0.018 |
| presence duration: absent read absent | 0.510±0.068 |
| presence duration: share of FALSE 'present' readings that abstain | 0.994±0.012 |
| presence start: absent read absent [pooled midpoint (comparison)] | 0.823±0.032 |
| presence tempo: present read present [pooled midpoint (comparison)] | 0.920±0.011 |
| presence ref: present read present [pooled midpoint (comparison)] | 0.906±0.021 |
| presence offset: present read present [pooled midpoint (comparison)] | 0.763±0.100 |
| presence duration: absent read absent [pooled midpoint (comparison)] | 0.598±0.055 |
| presence speed: absent read absent [pooled midpoint (comparison)] | 0.637±0.041 |
| presence trigger: share of true 'present' readings that abstain | 0.658±0.032 |
| presence trigger: present read present [pooled midpoint (comparison)] | 0.880±0.033 |
| presence target: share of 'present' readings that abstain | 1.000±0.000 |
| presence target: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence object: absent read absent | 0.410±0.065 |
| presence object: share of FALSE 'present' readings that abstain | 0.930±0.029 |
| presence traveller: present read present | 0.969±0.032 |
| presence traveller: share of true 'present' readings that abstain | 1.000±0.000 |
| presence source: present read present | 0.921±0.053 |
| presence source: share of 'present' readings that abstain | 1.000±0.000 |
| presence source: share of true 'present' readings that abstain | 1.000±0.000 |
| presence via: share of 'present' readings that abstain | 1.000±0.000 |
| presence via: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence target: present read present | 0.934±0.044 |
| presence target: share of true 'present' readings that abstain | 1.000±0.000 |
| presence start: share of FALSE 'present' readings that abstain | 0.996±0.008 |
| presence object: absent read absent [pooled midpoint (comparison)] | 0.642±0.022 |
| presence traveller: present read present [pooled midpoint (comparison)] | 0.817±0.027 |
| presence source: present read present [pooled midpoint (comparison)] | 0.917±0.071 |
| presence target: present read present [pooled midpoint (comparison)] | 0.874±0.036 |
| presence via: present read present | 0.725±0.147 |
| presence via: share of true 'present' readings that abstain | 1.000±0.000 |
| presence via: present read present [pooled midpoint (comparison)] | 0.786±0.148 |
| presence direction: present read present | 0.806±0.149 |
| presence direction: share of true 'present' readings that abstain | 0.858±0.057 |
| presence distance: present read present | 0.965±0.028 |
| presence distance: share of true 'present' readings that abstain | 0.976±0.029 |
| presence easing: present read present | 0.775±0.106 |
| presence easing: share of true 'present' readings that abstain | 0.855±0.034 |
| presence direction: present read present [pooled midpoint (comparison)] | 0.879±0.101 |
| presence distance: present read present [pooled midpoint (comparison)] | 0.932±0.062 |
| presence easing: present read present [pooled midpoint (comparison)] | 0.725±0.080 |
| presence repeat: present read present | 0.844±0.043 |
| presence repeat: present read present [pooled midpoint (comparison)] | 0.796±0.031 |
| presence landmark: present read present | 0.599±0.116 |
| presence landmark: present read present [pooled midpoint (comparison)] | 0.436±0.081 |
| presence path: share of 'present' readings that abstain | 0.996±0.007 |
| presence path: share of FALSE 'present' readings that abstain | 0.996±0.009 |
| presence repeat: share of true 'present' readings that abstain | 0.971±0.014 |
| presence unit: absent read absent | 0.606±0.048 |
| presence unit: absent read absent [pooled midpoint (comparison)] | 0.683±0.066 |
| presence landmark: share of true 'present' readings that abstain | 1.000±0.000 |
| determiner identity (outside FULL when the legend excludes it) | 0.000±0.000 |
| presence path: present read present | 0.659±0.276 |
| presence path: share of true 'present' readings that abstain | 1.000±0.000 |
| presence path: present read present [pooled midpoint (comparison)] | 0.373±0.206 |
| presence region: present read present | nan±nan |
| presence region: present read present [pooled midpoint (comparison)] | nan±nan |
| presence unit: share of FALSE 'present' readings that abstain | 0.327±0.208 |
| presence relation: present read present | 0.653±0.059 |
| presence relation: present read present [pooled midpoint (comparison)] | 0.481±0.101 |
| presence source: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence relation: share of true 'present' readings that abstain | 0.950±0.100 |
| presence region: share of true 'present' readings that abstain | nan±nan |
| presence color: present read present | 0.800±0.245 |
| presence color: present read present [pooled midpoint (comparison)] | 0.833±0.211 |
| presence color: share of true 'present' readings that abstain | 0.950±0.100 |

residual mean 0.522±0.010; status {'abstain': 348, 'ok': 2, 'no-sense': 50}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.750 | 0.069 / 0.007 | 0.54 | 0.095 | 0.307 / 0.155 |
| role object | 0.457 | 0.030 / 0.000 | 0.25 | 0.047 | 0.252 / 0.497 |
| roles (pooled) | 0.528 | 0.043 / 0.000 | 0.26 | 0.010 | 0.274 / 0.463 |
| role tempo | 0.760 | 0.050 / 0.000 | 0.46 | 0.000 | 0.298 / 0.240 |
| role ref | 0.312 | 0.010 / 0.000 | 0.02 | 0.005 | 0.299 / 0.683 |
| role duration | 0.764 | 0.029 / 0.001 | 0.16 | 0.000 | 0.600 / 0.236 |
| role unit | 0.778 | 0.143 / 0.000 | 0.74 | 0.012 | 0.047 / 0.210 |
| role angle | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role start | 0.596 | 0.032 / 0.000 | 0.29 | 0.000 | 0.308 / 0.404 |
| role speed | 0.486 | 0.018 / 0.000 | 0.04 | 0.000 | 0.443 / 0.514 |
| role trigger | 0.646 | 0.031 / 0.000 | 0.26 | 0.000 | 0.385 / 0.354 |
| role offset | 0.317 | 0.011 / 0.000 | 0.00 | 0.000 | 0.317 / 0.683 |
| role traveller | 0.000 | 0.009 / 0.001 | 0.00 | 0.000 | 0.000 / 1.000 |
| role source | 0.026 | 0.004 / 0.000 | 0.00 | 0.000 | 0.026 / 0.974 |
| role target | 0.000 | 0.006 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role via | 0.000 | 0.004 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role direction | 0.600 | 0.020 / 0.001 | 0.15 | 0.000 | 0.450 / 0.400 |
| role distance | 0.400 | 0.014 / 0.002 | 0.05 | 0.000 | 0.350 / 0.600 |
| role easing | 0.456 | 0.017 / 0.000 | 0.11 | 0.000 | 0.351 / 0.544 |
| role per | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role repeat | 0.230 | 0.009 / 0.000 | 0.01 | 0.014 | 0.230 / 0.757 |
| role landmark | 0.000 | 0.002 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role path | 0.000 | 0.007 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role color | 0.167 | 0.005 / 0.000 | 0.00 | 0.000 | 0.167 / 0.833 |
| role region | 0.000 | 0.001 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role relation | 0.429 | 0.012 / 0.000 | 0.00 | 0.000 | 0.429 / 0.571 |

### train (sample) — catalog candidates (n = 300 of 900)
| axis | accuracy |
|---|---|
| FULL | 0.403±0.016 |
| FULL [depth given] | 0.403±0.016 |
| FULL [depth and negation given] | 0.406±0.016 |
| presence object: present read present | 0.911±0.037 |
| presence object: share of 'present' readings that abstain | 0.314±0.031 |
| presence object: share of true 'present' readings that abstain | 0.305±0.031 |
| presence color: absent read absent | 0.908±0.021 |
| presence relation: absent read absent | 1.000±0.000 |
| presence landmark: absent read absent | 0.985±0.008 |
| presence region: absent read absent | nan±nan |
| presence direction: absent read absent | 1.000±0.000 |
| presence distance: absent read absent | 0.996±0.003 |
| presence traveller: absent read absent | 0.968±0.016 |
| presence source: absent read absent | 0.996±0.005 |
| presence via: absent read absent | 0.981±0.017 |
| presence target: absent read absent | 0.990±0.003 |
| presence path: absent read absent | 0.986±0.010 |
| presence start: absent read absent | 0.980±0.006 |
| presence tempo: present read present | 0.909±0.034 |
| presence tempo: share of 'present' readings that abstain | 0.050±0.017 |
| presence tempo: share of true 'present' readings that abstain | 0.046±0.014 |
| presence ref: present read present | 0.777±0.047 |
| presence ref: share of 'present' readings that abstain | 0.627±0.013 |
| presence ref: share of true 'present' readings that abstain | 0.620±0.013 |
| presence offset: present read present | 0.718±0.038 |
| presence offset: share of 'present' readings that abstain | 0.592±0.119 |
| presence offset: share of true 'present' readings that abstain | 0.564±0.096 |
| presence trigger: absent read absent | 1.000±0.000 |
| presence duration: present read present | 0.893±0.046 |
| presence duration: share of 'present' readings that abstain | 0.129±0.015 |
| presence duration: share of true 'present' readings that abstain | 0.119±0.015 |
| presence unit: present read present | 0.881±0.028 |
| presence unit: share of 'present' readings that abstain | 0.036±0.007 |
| presence unit: share of true 'present' readings that abstain | 0.036±0.007 |
| presence speed: absent read absent | 1.000±0.000 |
| presence easing: absent read absent | 1.000±0.000 |
| presence repeat: absent read absent | 0.994±0.004 |
| structure (depth, negation) | 0.927±0.014 |
| depth estimate: fit (check) | 1.000±0.000 |
| predicate (surface lemma) | 0.843±0.015 |
| event type (synonym table) | 0.851±0.016 |
| role object | 0.737±0.028 |
| head object | 0.777±0.034 |
| lexical order head object | 0.740±0.000 |
| lexical bag head object | 0.913±0.000 |
| occupancy: known filler | 0.826±0.021 |
| role color | 0.913±0.019 |
| head color | 0.913±0.019 |
| lexical order head color | 0.990±0.000 |
| lexical bag head color | 0.997±0.000 |
| occupancy: not given | 0.985±0.002 |
| role relation | 0.996±0.002 |
| head relation | 0.996±0.002 |
| lexical order head relation | 0.977±0.000 |
| lexical bag head relation | 1.000±0.000 |
| role landmark | 0.957±0.010 |
| head landmark | 0.963±0.011 |
| lexical order head landmark | 0.920±0.000 |
| lexical bag head landmark | 0.990±0.000 |
| role region | 0.998±0.003 |
| head region | 0.998±0.003 |
| lexical order head region | 0.993±0.000 |
| lexical bag head region | 1.000±0.000 |
| role direction | 0.999±0.001 |
| head direction | 0.999±0.001 |
| lexical order head direction | 0.970±0.000 |
| lexical bag head direction | 1.000±0.000 |
| role distance | 0.993±0.004 |
| head distance | 0.993±0.004 |
| lexical order head distance | 0.970±0.000 |
| lexical bag head distance | 1.000±0.000 |
| role angle | 0.989±0.005 |
| head angle | 0.989±0.005 |
| lexical order head angle | 0.983±0.000 |
| lexical bag head angle | 1.000±0.000 |
| role traveller | 0.895±0.015 |
| head traveller | 0.951±0.016 |
| lexical order head traveller | 0.877±0.000 |
| lexical bag head traveller | 0.997±0.000 |
| role source | 0.970±0.006 |
| head source | 0.972±0.006 |
| lexical order head source | 0.960±0.000 |
| lexical bag head source | 0.993±0.000 |
| role via | 0.975±0.015 |
| head via | 0.975±0.015 |
| lexical order head via | 0.987±0.000 |
| lexical bag head via | 0.993±0.000 |
| role target | 0.929±0.007 |
| head target | 0.931±0.007 |
| lexical order head target | 0.883±0.000 |
| lexical bag head target | 0.977±0.000 |
| role path | 0.981±0.009 |
| head path | 0.985±0.009 |
| lexical order head path | 0.953±0.000 |
| lexical bag head path | 1.000±0.000 |
| role start | 0.947±0.006 |
| head start | 0.947±0.006 |
| lexical order head start | 0.830±0.000 |
| lexical bag head start | 0.943±0.000 |
| role tempo | 0.907±0.019 |
| head tempo | 0.907±0.019 |
| lexical order head tempo | 0.937±0.000 |
| lexical bag head tempo | 0.993±0.000 |
| role ref | 0.771±0.018 |
| head ref | 0.810±0.015 |
| lexical order head ref | 0.507±0.000 |
| lexical bag head ref | 0.843±0.000 |
| role offset | 0.955±0.009 |
| head offset | 0.955±0.009 |
| lexical order head offset | 0.907±0.000 |
| lexical bag head offset | 0.967±0.000 |
| role trigger | 0.984±0.008 |
| head trigger | 0.984±0.008 |
| lexical order head trigger | 0.827±0.000 |
| lexical bag head trigger | 1.000±0.000 |
| role duration | 0.905±0.027 |
| head duration | 0.905±0.027 |
| lexical order head duration | 0.833±0.000 |
| lexical bag head duration | 0.923±0.000 |
| role unit | 0.915±0.016 |
| head unit | 0.915±0.016 |
| lexical order head unit | 0.990±0.000 |
| lexical bag head unit | 0.993±0.000 |
| role per | 0.994±0.005 |
| head per | 0.994±0.005 |
| lexical order head per | 0.990±0.000 |
| lexical bag head per | 1.000±0.000 |
| role speed | 0.973±0.009 |
| head speed | 0.973±0.009 |
| lexical order head speed | 0.857±0.000 |
| lexical bag head speed | 1.000±0.000 |
| role easing | 0.989±0.011 |
| head easing | 0.989±0.011 |
| lexical order head easing | 0.890±0.000 |
| lexical bag head easing | 1.000±0.000 |
| role repeat | 0.963±0.007 |
| head repeat | 0.963±0.007 |
| lexical order head repeat | 0.883±0.000 |
| lexical bag head repeat | 0.987±0.000 |
| heads FULL (model) | 0.481±0.024 |
| heads FULL (lexical order baseline) | 0.143±0.000 |
| heads FULL (lexical bag baseline, trained on the same training rows) | 0.707±0.000 |
| presence offset: absent read absent | 0.984±0.011 |
| presence trigger: present read present | 0.911±0.045 |
| presence trigger: share of 'present' readings that abstain | 0.084±0.026 |
| presence trigger: share of true 'present' readings that abstain | 0.084±0.026 |
| presence start: present read present | 0.866±0.024 |
| presence start: share of 'present' readings that abstain | 0.224±0.030 |
| presence start: share of true 'present' readings that abstain | 0.136±0.049 |
| presence tempo: absent read absent | 0.946±0.005 |
| presence tempo: share of FALSE 'present' readings that abstain | 0.129±0.194 |
| presence ref: absent read absent | 0.965±0.008 |
| presence repeat: present read present | 0.799±0.073 |
| presence repeat: share of 'present' readings that abstain | 0.467±0.063 |
| presence repeat: share of true 'present' readings that abstain | 0.454±0.072 |
| presence object: absent read absent | 0.796±0.039 |
| presence object: share of FALSE 'present' readings that abstain | 0.453±0.150 |
| presence traveller: present read present | 0.873±0.026 |
| presence path: present read present | 0.957±0.035 |
| presence path: share of 'present' readings that abstain | 0.301±0.084 |
| presence path: share of true 'present' readings that abstain | 0.152±0.099 |
| presence unit: absent read absent | 1.000±0.000 |
| presence easing: present read present | 0.901±0.096 |
| presence easing: share of 'present' readings that abstain | 0.267±0.130 |
| presence easing: share of true 'present' readings that abstain | 0.267±0.130 |
| determiner identity (outside FULL when the legend excludes it) | 0.000±0.000 |
| presence direction: present read present | 0.978±0.044 |
| presence direction: share of 'present' readings that abstain | 0.303±0.246 |
| presence direction: share of true 'present' readings that abstain | 0.303±0.246 |
| presence distance: present read present | 0.933±0.054 |
| presence distance: share of 'present' readings that abstain | 0.506±0.212 |
| presence distance: share of true 'present' readings that abstain | 0.467±0.252 |
| presence duration: absent read absent | 0.969±0.010 |
| presence source: present read present | 0.611±0.088 |
| presence source: share of 'present' readings that abstain | 0.830±0.053 |
| presence source: share of true 'present' readings that abstain | 0.826±0.040 |
| presence via: share of 'present' readings that abstain | 0.770±0.161 |
| presence via: share of FALSE 'present' readings that abstain | 0.493±0.414 |
| presence target: present read present | 0.682±0.061 |
| presence target: share of 'present' readings that abstain | 0.820±0.031 |
| presence target: share of true 'present' readings that abstain | 0.829±0.050 |
| presence relation: present read present | 0.829±0.107 |
| presence relation: share of 'present' readings that abstain | 0.732±0.267 |
| presence relation: share of true 'present' readings that abstain | 0.732±0.267 |
| presence landmark: present read present | 0.783±0.110 |
| presence color: share of 'present' readings that abstain | 0.914±0.017 |
| presence color: share of FALSE 'present' readings that abstain | 0.963±0.026 |
| presence speed: present read present | 0.874±0.049 |
| presence speed: share of 'present' readings that abstain | 0.204±0.032 |
| presence speed: share of true 'present' readings that abstain | 0.204±0.032 |
| presence duration: share of FALSE 'present' readings that abstain | 0.593±0.259 |
| presence traveller: share of 'present' readings that abstain | 0.591±0.053 |
| presence traveller: share of true 'present' readings that abstain | 0.545±0.059 |
| presence path: share of FALSE 'present' readings that abstain | nan±nan |
| presence start: share of FALSE 'present' readings that abstain | 0.971±0.057 |
| presence landmark: share of 'present' readings that abstain | 0.507±0.088 |
| presence landmark: share of true 'present' readings that abstain | 0.413±0.086 |
| presence target: share of FALSE 'present' readings that abstain | 0.800±0.267 |
| presence offset: share of FALSE 'present' readings that abstain | 0.661±0.350 |
| presence via: present read present | 0.783±0.113 |
| presence via: share of true 'present' readings that abstain | 0.933±0.133 |
| presence ref: share of FALSE 'present' readings that abstain | 0.791±0.133 |
| presence traveller: share of FALSE 'present' readings that abstain | 0.788±0.145 |
| presence distance: share of FALSE 'present' readings that abstain | nan±nan |
| presence landmark: share of FALSE 'present' readings that abstain | 1.000±0.000 |
| presence color: present read present | 0.933±0.133 |
| presence color: share of true 'present' readings that abstain | 0.500±0.149 |
| presence region: present read present | nan±nan |
| presence region: share of 'present' readings that abstain | nan±nan |
| presence region: share of true 'present' readings that abstain | nan±nan |
| presence repeat: share of FALSE 'present' readings that abstain | nan±nan |

residual mean 0.434±0.010; status {'abstain': 263, 'no-sense': 18, 'ok': 19}

| calibration axis (seed 0) | acc | margin mean / p10 | coverage at tau | confident-wrong | abstain right / wrong |
|---|---|---|---|---|---|
| predicate | 0.843 | 0.103 / 0.019 | 0.76 | 0.053 | 0.133 / 0.103 |
| role object | 0.658 | 0.068 / 0.000 | 0.58 | 0.095 | 0.169 / 0.247 |
| roles (pooled) | 0.742 | 0.082 / 0.000 | 0.62 | 0.032 | 0.158 / 0.225 |
| role tempo | 0.830 | 0.101 / 0.000 | 0.78 | 0.000 | 0.048 / 0.170 |
| role ref | 0.595 | 0.037 / 0.000 | 0.30 | 0.047 | 0.345 / 0.358 |
| role offset | 0.679 | 0.027 / 0.000 | 0.25 | 0.000 | 0.429 / 0.321 |
| role duration | 0.880 | 0.080 / 0.000 | 0.80 | 0.000 | 0.084 / 0.120 |
| role unit | 0.860 | 0.194 / 0.000 | 0.85 | 0.013 | 0.025 / 0.127 |
| role trigger | 0.923 | 0.091 / 0.031 | 0.83 | 0.000 | 0.096 / 0.077 |
| role start | 0.824 | 0.090 / 0.000 | 0.75 | 0.020 | 0.098 / 0.157 |
| role repeat | 0.629 | 0.034 / 0.000 | 0.37 | 0.029 | 0.286 / 0.343 |
| role traveller | 0.378 | 0.042 / 0.000 | 0.41 | 0.162 | 0.135 / 0.459 |
| role path | 0.929 | 0.115 / 0.056 | 0.93 | 0.071 | 0.071 / 0.000 |
| role easing | 0.909 | 0.067 / 0.029 | 0.76 | 0.000 | 0.152 / 0.091 |
| role direction | 1.000 | 0.062 / 0.027 | 0.78 | 0.000 | 0.222 / 0.000 |
| role distance | 0.778 | 0.055 / 0.015 | 0.33 | 0.000 | 0.444 / 0.222 |
| role source | 0.333 | 0.023 / 0.000 | 0.08 | 0.000 | 0.250 / 0.667 |
| role target | 0.486 | 0.019 / 0.000 | 0.11 | 0.029 | 0.400 / 0.486 |
| role relation | 1.000 | 0.045 / 0.002 | 0.57 | 0.000 | 0.429 / 0.000 |
| role landmark | 0.417 | 0.027 / 0.000 | 0.25 | 0.000 | 0.167 / 0.583 |
| role speed | 0.907 | 0.071 / 0.015 | 0.70 | 0.000 | 0.209 / 0.093 |
| role per | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role via | 0.500 | 0.007 / 0.002 | 0.00 | 0.000 | 0.500 / 0.500 |
| role angle | 0.000 | 0.000 / 0.000 | 0.00 | 0.000 | 0.000 / 1.000 |
| role color | 0.667 | 0.035 / 0.004 | 0.33 | 0.000 | 0.333 / 0.333 |
| role region | 1.000 | 0.069 / 0.058 | 1.00 | 0.000 | 0.000 / 0.000 |

## Gates (seed 0; OPEN > 0.5)
,=1.00 .=1.00 and=1.00 as=1.00 at=1.00 by=1.00 from=1.00 in=1.00 into=1.00 of=1.00 on=1.00 to=1.00 VERB=0.44 UNIT=0.30 TRIGGER=0.27 COMPONENT=0.24 does=0.20 ?=0.20 FILLER=0.17 beginning=0.16 not=0.16 do=0.16 degrees=0.15 PRON=0.14 never=0.13 DEM=0.12 QUANT=0.12 are=0.12 unknown=0.12 via=0.11 PER=0.11 NUM=0.10 REGION=0.10 SPEED=0.09 along=0.08 through=0.08 REL=0.07 px=0.07 towards=0.06 for=0.06 times=0.06 DIR=0.06 DUR=0.06 REPEAT=0.05 WH=0.05 a=0.05 EASE=0.05 over=0.04 is=0.04 LABEL=0.04 TEMPO=0.04 the=0.04 CAUSE=0.03 COLOR=0.03

## What is weak, what to add
- heldout_formulations: FULL 0.275
- heldout_formulations: presence object: share of 'present' readings that abstain 0.383
- heldout_formulations: presence object: share of true 'present' readings that abstain 0.379
- heldout_formulations: presence color: absent read absent 0.880
- heldout_formulations: presence direction: share of 'present' readings that abstain 0.800
- heldout_formulations: presence direction: share of true 'present' readings that abstain 0.800
- heldout_formulations: presence tempo: share of 'present' readings that abstain 0.116
- heldout_formulations: presence tempo: share of true 'present' readings that abstain 0.113
- heldout_formulations: presence ref: present read present 0.837
- heldout_formulations: presence ref: share of 'present' readings that abstain 0.624
- heldout_formulations: presence ref: share of true 'present' readings that abstain 0.621
- heldout_formulations: structure (depth, negation) 0.896
- heldout_formulations: predicate (surface lemma) 0.767
- heldout_formulations: event type (synonym table) 0.782
- heldout_formulations: role object 0.684
- heldout_formulations: head object 0.725
- heldout_formulations: occupancy: known filler 0.794
- heldout_formulations: role color 0.891
- heldout_formulations: head color 0.891
- heldout_formulations: role traveller 0.855
- heldout_formulations: role ref 0.710
- heldout_formulations: head ref 0.736
- heldout_formulations: role duration 0.876
- heldout_formulations: head duration 0.876
- heldout_formulations: role unit 0.886
- heldout_formulations: head unit 0.886
- heldout_formulations: heads FULL (model) 0.342
- heldout_formulations: heads FULL (lexical order baseline) 0.119
- heldout_formulations: heads FULL (lexical bag baseline, trained on the same training rows) 0.130
- heldout_formulations: FULL [depth given] 0.275
- heldout_formulations: FULL [depth and negation given] 0.275
- heldout_formulations: FULL [presence not decided] 0.212
- heldout_formulations: role object [presence not decided] 0.539
- heldout_formulations: role color [presence not decided] 0.720
- heldout_formulations: role landmark [presence not decided] 0.876
- heldout_formulations: role traveller [presence not decided] 0.767
- heldout_formulations: role via [presence not decided] 0.850
- heldout_formulations: role target [presence not decided] 0.839
- heldout_formulations: role path [presence not decided] 0.896
- heldout_formulations: role ref [presence not decided] 0.570
- heldout_formulations: role offset [presence not decided] 0.891
- heldout_formulations: role duration [presence not decided] 0.891
- heldout_formulations: heads FULL (model) [presence not decided] 0.254
- heldout_formulations: FULL [pooled midpoint (comparison)] 0.155
- heldout_formulations: role object [pooled midpoint (comparison)] 0.606
- heldout_formulations: role traveller [pooled midpoint (comparison)] 0.824
- heldout_formulations: role start [pooled midpoint (comparison)] 0.855
- heldout_formulations: role tempo [pooled midpoint (comparison)] 0.824
- heldout_formulations: role ref [pooled midpoint (comparison)] 0.663
- heldout_formulations: role duration [pooled midpoint (comparison)] 0.834
- heldout_formulations: role unit [pooled midpoint (comparison)] 0.793
- heldout_formulations: heads FULL (model) [pooled midpoint (comparison)] 0.238
- heldout_formulations: presence object: present read present [pooled midpoint (comparison)] 0.823
- heldout_formulations: presence tempo: present read present [pooled midpoint (comparison)] 0.849
- heldout_formulations: presence ref: present read present [pooled midpoint (comparison)] 0.727
- heldout_formulations: presence object: absent read absent 0.778
- heldout_formulations: presence object: absent read absent [pooled midpoint (comparison)] 0.814
- heldout_formulations: presence tempo: absent read absent [pooled midpoint (comparison)] 0.880
- heldout_formulations: presence start: share of 'present' readings that abstain 0.375
- heldout_formulations: presence start: share of FALSE 'present' readings that abstain 0.500
- heldout_formulations: presence offset: present read present 0.588
- heldout_formulations: presence duration: present read present 0.896
- heldout_formulations: presence duration: share of 'present' readings that abstain 0.299
- heldout_formulations: presence duration: share of true 'present' readings that abstain 0.295
- heldout_formulations: presence unit: present read present 0.862
- heldout_formulations: presence unit: share of 'present' readings that abstain 0.011
- heldout_formulations: presence unit: share of true 'present' readings that abstain 0.011
- heldout_formulations: presence offset: present read present [pooled midpoint (comparison)] 0.438
- heldout_formulations: presence duration: present read present [pooled midpoint (comparison)] 0.869
- heldout_formulations: presence unit: present read present [pooled midpoint (comparison)] 0.792
- heldout_formulations: presence speed: present read present 0.867
- heldout_formulations: presence speed: share of 'present' readings that abstain 0.269
- heldout_formulations: presence speed: share of true 'present' readings that abstain 0.269
- heldout_formulations: presence speed: present read present [pooled midpoint (comparison)] 0.857
- heldout_formulations: presence traveller: present read present 0.656
- heldout_formulations: presence traveller: share of 'present' readings that abstain 0.826
- heldout_formulations: presence traveller: share of true 'present' readings that abstain 0.857
- heldout_formulations: presence path: present read present 0.571
- heldout_formulations: presence path: share of 'present' readings that abstain 0.833
- heldout_formulations: presence path: share of true 'present' readings that abstain 0.750
- heldout_formulations: presence traveller: present read present [pooled midpoint (comparison)] 0.480
- heldout_formulations: presence path: present read present [pooled midpoint (comparison)] 0.333
- heldout_formulations: presence object: share of FALSE 'present' readings that abstain 0.417
- heldout_formulations: presence trigger: share of 'present' readings that abstain 0.184
- heldout_formulations: presence trigger: share of true 'present' readings that abstain 0.184
- heldout_formulations: determiner identity (outside FULL when the legend excludes it) 0.000
- heldout_formulations: presence trigger: present read present [pooled midpoint (comparison)] 0.800
- heldout_formulations: presence start: present read present 0.757
- heldout_formulations: presence start: present read present [pooled midpoint (comparison)] 0.536
- heldout_formulations: presence via: share of 'present' readings that abstain 0.769
- heldout_formulations: presence via: share of FALSE 'present' readings that abstain 0.750
- heldout_formulations: presence easing: present read present 0.714
- heldout_formulations: presence easing: share of 'present' readings that abstain 0.667
- heldout_formulations: presence easing: share of true 'present' readings that abstain 0.667
- heldout_formulations: presence easing: present read present [pooled midpoint (comparison)] 0.789
- heldout_formulations: presence repeat: present read present 0.667
- heldout_formulations: presence repeat: share of 'present' readings that abstain 0.737
- heldout_formulations: presence repeat: share of true 'present' readings that abstain 0.786
- heldout_formulations: presence repeat: present read present [pooled midpoint (comparison)] 0.762
- heldout_formulations: presence target: present read present 0.840
- heldout_formulations: presence start: share of true 'present' readings that abstain 0.357
- heldout_formulations: presence tempo: share of FALSE 'present' readings that abstain 0.167
- heldout_formulations: presence target: present read present [pooled midpoint (comparison)] 0.875
- heldout_formulations: presence offset: share of 'present' readings that abstain 0.643
- heldout_formulations: presence offset: share of true 'present' readings that abstain 0.600
- heldout_formulations: presence relation: present read present 0.833
- heldout_formulations: presence relation: share of 'present' readings that abstain 0.800
- heldout_formulations: presence relation: share of true 'present' readings that abstain 0.800
- heldout_formulations: presence landmark: present read present 0.333
- heldout_formulations: presence ref: share of FALSE 'present' readings that abstain 0.667
- heldout_formulations: presence relation: present read present [pooled midpoint (comparison)] 0.750
- heldout_formulations: presence landmark: present read present [pooled midpoint (comparison)] 0.286
- heldout_formulations: presence source: present read present 0.750
- heldout_formulations: presence source: present read present [pooled midpoint (comparison)] 0.714
- heldout_formulations: presence repeat: share of FALSE 'present' readings that abstain 0.600
- heldout_formulations: presence offset: share of FALSE 'present' readings that abstain 0.750
- heldout_formulations: presence landmark: share of 'present' readings that abstain 0.714
- heldout_formulations: presence landmark: share of FALSE 'present' readings that abstain 0.750
- heldout_formulations: presence via: present read present 0.500
- heldout_formulations: presence traveller: share of FALSE 'present' readings that abstain 0.500
- heldout_formulations: presence landmark: share of true 'present' readings that abstain 0.667
- heldout_formulations: presence target: share of FALSE 'present' readings that abstain 0.000
- heldout_formulations: presence duration: share of FALSE 'present' readings that abstain 0.500
- heldout_sentences: FULL 0.270
- heldout_sentences: presence object: present read present 0.848
- heldout_sentences: presence object: share of 'present' readings that abstain 0.286
- heldout_sentences: presence object: share of true 'present' readings that abstain 0.250
- heldout_sentences: presence color: absent read absent 0.841
- heldout_sentences: presence start: share of 'present' readings that abstain 0.238
- heldout_sentences: presence start: share of FALSE 'present' readings that abstain 0.667
- heldout_sentences: presence tempo: present read present 0.872
- heldout_sentences: presence tempo: share of 'present' readings that abstain 0.000
- heldout_sentences: presence tempo: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence ref: present read present 0.800
- heldout_sentences: presence offset: present read present 0.364
- heldout_sentences: presence duration: present read present 0.804
- heldout_sentences: presence duration: share of 'present' readings that abstain 0.256
- heldout_sentences: presence duration: share of true 'present' readings that abstain 0.216
- heldout_sentences: presence unit: present read present 0.842
- heldout_sentences: presence unit: share of 'present' readings that abstain 0.000
- heldout_sentences: presence unit: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence speed: present read present 0.889
- heldout_sentences: presence speed: share of 'present' readings that abstain 0.250
- heldout_sentences: presence speed: share of true 'present' readings that abstain 0.250
- heldout_sentences: predicate (surface lemma) 0.850
- heldout_sentences: event type (synonym table) 0.850
- heldout_sentences: role object 0.610
- heldout_sentences: head object 0.630
- heldout_sentences: occupancy: known filler 0.733
- heldout_sentences: role color 0.830
- heldout_sentences: head color 0.830
- heldout_sentences: role traveller 0.870
- heldout_sentences: head traveller 0.890
- heldout_sentences: role tempo 0.890
- heldout_sentences: head tempo 0.890
- heldout_sentences: role ref 0.720
- heldout_sentences: head ref 0.740
- heldout_sentences: role duration 0.810
- heldout_sentences: head duration 0.810
- heldout_sentences: role unit 0.880
- heldout_sentences: head unit 0.880
- heldout_sentences: heads FULL (model) 0.280
- heldout_sentences: heads FULL (lexical order baseline) 0.150
- heldout_sentences: heads FULL (lexical bag baseline, trained on the same training rows) 0.220
- heldout_sentences: FULL [depth given] 0.270
- heldout_sentences: FULL [depth and negation given] 0.280
- heldout_sentences: FULL [pooled midpoint (comparison)] 0.120
- heldout_sentences: role object [pooled midpoint (comparison)] 0.440
- heldout_sentences: role color [pooled midpoint (comparison)] 0.870
- heldout_sentences: role traveller [pooled midpoint (comparison)] 0.840
- heldout_sentences: role start [pooled midpoint (comparison)] 0.890
- heldout_sentences: role tempo [pooled midpoint (comparison)] 0.830
- heldout_sentences: role ref [pooled midpoint (comparison)] 0.690
- heldout_sentences: role duration [pooled midpoint (comparison)] 0.780
- heldout_sentences: role unit [pooled midpoint (comparison)] 0.800
- heldout_sentences: heads FULL (model) [pooled midpoint (comparison)] 0.140
- heldout_sentences: presence object: present read present [pooled midpoint (comparison)] 0.600
- heldout_sentences: presence color: absent read absent [pooled midpoint (comparison)] 0.875
- heldout_sentences: presence tempo: present read present [pooled midpoint (comparison)] 0.829
- heldout_sentences: presence ref: present read present [pooled midpoint (comparison)] 0.692
- heldout_sentences: presence offset: present read present [pooled midpoint (comparison)] 0.636
- heldout_sentences: presence duration: present read present [pooled midpoint (comparison)] 0.800
- heldout_sentences: presence unit: present read present [pooled midpoint (comparison)] 0.769
- heldout_sentences: presence speed: present read present [pooled midpoint (comparison)] 0.778
- heldout_sentences: presence object: absent read absent 0.731
- heldout_sentences: presence landmark: share of 'present' readings that abstain 0.800
- heldout_sentences: presence landmark: share of FALSE 'present' readings that abstain 0.667
- heldout_sentences: presence traveller: present read present 0.722
- heldout_sentences: presence source: present read present 0.250
- heldout_sentences: presence target: present read present 0.700
- heldout_sentences: presence path: share of 'present' readings that abstain 0.333
- heldout_sentences: presence path: share of FALSE 'present' readings that abstain 0.500
- heldout_sentences: presence ref: share of 'present' readings that abstain 0.649
- heldout_sentences: presence ref: share of true 'present' readings that abstain 0.639
- heldout_sentences: presence trigger: present read present 0.875
- heldout_sentences: presence trigger: share of 'present' readings that abstain 0.286
- heldout_sentences: presence trigger: share of true 'present' readings that abstain 0.286
- heldout_sentences: presence object: absent read absent [pooled midpoint (comparison)] 0.696
- heldout_sentences: presence traveller: present read present [pooled midpoint (comparison)] 0.500
- heldout_sentences: presence source: present read present [pooled midpoint (comparison)] 0.333
- heldout_sentences: presence target: present read present [pooled midpoint (comparison)] 0.667
- heldout_sentences: presence trigger: present read present [pooled midpoint (comparison)] 0.733
- heldout_sentences: presence duration: absent read absent 0.870
- heldout_sentences: presence start: present read present 0.818
- heldout_sentences: presence start: share of true 'present' readings that abstain 0.167
- heldout_sentences: presence start: present read present [pooled midpoint (comparison)] 0.600
- heldout_sentences: presence color: present read present 0.250
- heldout_sentences: presence color: present read present [pooled midpoint (comparison)] 0.333
- heldout_sentences: presence duration: share of FALSE 'present' readings that abstain 0.500
- heldout_sentences: presence repeat: present read present 0.500
- heldout_sentences: presence repeat: share of 'present' readings that abstain 0.500
- heldout_sentences: presence repeat: share of true 'present' readings that abstain 0.500
- heldout_sentences: presence repeat: present read present [pooled midpoint (comparison)] 0.571
- heldout_sentences: presence landmark: present read present 0.333
- heldout_sentences: presence landmark: present read present [pooled midpoint (comparison)] 0.333
- heldout_sentences: presence easing: share of 'present' readings that abstain 0.800
- heldout_sentences: presence easing: share of true 'present' readings that abstain 0.800
- heldout_sentences: presence easing: present read present [pooled midpoint (comparison)] 0.600
- heldout_sentences: presence object: share of FALSE 'present' readings that abstain 0.571
- heldout_sentences: presence path: present read present 0.200
- heldout_sentences: presence path: share of true 'present' readings that abstain 0.000
- heldout_sentences: presence path: present read present [pooled midpoint (comparison)] 0.200
- heldout_sentences: presence tempo: share of FALSE 'present' readings that abstain 0.000
- heldout_sentences: presence direction: present read present 0.750
- heldout_sentences: presence distance: share of 'present' readings that abstain 0.600
- heldout_sentences: presence distance: share of true 'present' readings that abstain 0.500
- heldout_sentences: presence traveller: share of 'present' readings that abstain 0.800
- heldout_sentences: presence traveller: share of true 'present' readings that abstain 0.769
- heldout_sentences: presence via: present read present 0.000
- heldout_sentences: presence target: share of 'present' readings that abstain 0.875
- heldout_sentences: presence target: share of true 'present' readings that abstain 0.857
- heldout_sentences: determiner identity (outside FULL when the legend excludes it) 0.000
- heldout_sentences: presence via: present read present [pooled midpoint (comparison)] 0.000
- new_identities: FULL 0.203
- new_identities: presence object: share of 'present' readings that abstain 0.361
- new_identities: presence object: share of true 'present' readings that abstain 0.346
- new_identities: presence color: absent read absent 0.884
- new_identities: presence tempo: present read present 0.900
- new_identities: presence ref: present read present 0.813
- new_identities: presence ref: share of 'present' readings that abstain 0.697
- new_identities: presence ref: share of true 'present' readings that abstain 0.694
- new_identities: presence duration: share of 'present' readings that abstain 0.319
- new_identities: presence duration: share of true 'present' readings that abstain 0.295
- new_identities: presence unit: share of 'present' readings that abstain 0.034
- new_identities: presence unit: share of true 'present' readings that abstain 0.034
- new_identities: predicate (surface lemma) 0.782
- new_identities: event type (synonym table) 0.800
- new_identities: role object 0.642
- new_identities: head object 0.680
- new_identities: occupancy: known filler 0.793
- new_identities: role color 0.885
- new_identities: head color 0.885
- new_identities: role traveller 0.880
- new_identities: role target 0.840
- new_identities: head target 0.853
- new_identities: role start 0.873
- new_identities: head start 0.873
- new_identities: role tempo 0.880
- new_identities: head tempo 0.880
- new_identities: role ref 0.670
- new_identities: head ref 0.713
- new_identities: role duration 0.868
- new_identities: head duration 0.868
- new_identities: occupancy: unknown filler 0.736
- new_identities: role unit 0.890
- new_identities: head unit 0.890
- new_identities: role repeat 0.890
- new_identities: head repeat 0.890
- new_identities: heads FULL (model) 0.273
- new_identities: heads FULL (lexical order baseline) 0.040
- new_identities: heads FULL (lexical bag baseline, trained on the same training rows) 0.065
- new_identities: FULL [depth given] 0.203
- new_identities: FULL [depth and negation given] 0.203
- new_identities: FULL [pooled midpoint (comparison)] 0.140
- new_identities: role object [pooled midpoint (comparison)] 0.530
- new_identities: role traveller [pooled midpoint (comparison)] 0.870
- new_identities: role target [pooled midpoint (comparison)] 0.845
- new_identities: role start [pooled midpoint (comparison)] 0.845
- new_identities: role tempo [pooled midpoint (comparison)] 0.818
- new_identities: role ref [pooled midpoint (comparison)] 0.635
- new_identities: role duration [pooled midpoint (comparison)] 0.740
- new_identities: role unit [pooled midpoint (comparison)] 0.725
- new_identities: role repeat [pooled midpoint (comparison)] 0.885
- new_identities: heads FULL (model) [pooled midpoint (comparison)] 0.212
- new_identities: presence object: present read present [pooled midpoint (comparison)] 0.810
- new_identities: presence color: absent read absent [pooled midpoint (comparison)] 0.897
- new_identities: presence tempo: present read present [pooled midpoint (comparison)] 0.870
- new_identities: presence ref: present read present [pooled midpoint (comparison)] 0.781
- new_identities: presence duration: present read present [pooled midpoint (comparison)] 0.828
- new_identities: presence unit: present read present [pooled midpoint (comparison)] 0.814
- new_identities: presence distance: share of 'present' readings that abstain 0.783
- new_identities: presence start: present read present 0.736
- new_identities: presence start: share of 'present' readings that abstain 0.309
- new_identities: presence start: share of true 'present' readings that abstain 0.224
- new_identities: presence speed: present read present 0.765
- new_identities: presence speed: share of 'present' readings that abstain 0.500
- new_identities: presence speed: share of true 'present' readings that abstain 0.500
- new_identities: presence start: present read present [pooled midpoint (comparison)] 0.671
- new_identities: presence speed: present read present [pooled midpoint (comparison)] 0.726
- new_identities: presence trigger: present read present 0.806
- new_identities: presence traveller: share of 'present' readings that abstain 0.821
- new_identities: presence traveller: share of FALSE 'present' readings that abstain 0.500
- new_identities: presence tempo: share of 'present' readings that abstain 0.083
- new_identities: presence tempo: share of true 'present' readings that abstain 0.083
- new_identities: presence offset: present read present 0.576
- new_identities: presence duration: absent read absent 0.831
- new_identities: presence duration: share of FALSE 'present' readings that abstain 0.846
- new_identities: presence offset: present read present [pooled midpoint (comparison)] 0.544
- new_identities: presence duration: absent read absent [pooled midpoint (comparison)] 0.825
- new_identities: presence trigger: share of 'present' readings that abstain 0.180
- new_identities: presence trigger: share of true 'present' readings that abstain 0.180
- new_identities: presence trigger: present read present [pooled midpoint (comparison)] 0.793
- new_identities: presence object: absent read absent 0.583
- new_identities: presence object: share of FALSE 'present' readings that abstain 0.500
- new_identities: presence traveller: present read present 0.673
- new_identities: presence traveller: share of true 'present' readings that abstain 0.857
- new_identities: presence source: present read present 0.500
- new_identities: presence target: present read present 0.632
- new_identities: presence object: absent read absent [pooled midpoint (comparison)] 0.694
- new_identities: presence traveller: present read present [pooled midpoint (comparison)] 0.702
- new_identities: presence source: present read present [pooled midpoint (comparison)] 0.444
- new_identities: presence target: present read present [pooled midpoint (comparison)] 0.635
- new_identities: presence via: present read present 0.444
- new_identities: presence via: present read present [pooled midpoint (comparison)] 0.625
- new_identities: presence direction: share of 'present' readings that abstain 0.647
- new_identities: presence direction: share of true 'present' readings that abstain 0.647
- new_identities: presence distance: present read present 0.889
- new_identities: presence distance: share of true 'present' readings that abstain 0.688
- new_identities: presence easing: present read present 0.741
- new_identities: presence easing: share of 'present' readings that abstain 0.625
- new_identities: presence easing: share of true 'present' readings that abstain 0.625
- new_identities: presence easing: present read present [pooled midpoint (comparison)] 0.735
- new_identities: presence offset: share of 'present' readings that abstain 0.889
- new_identities: presence offset: share of true 'present' readings that abstain 0.853
- new_identities: presence repeat: present read present 0.571
- new_identities: presence repeat: present read present [pooled midpoint (comparison)] 0.646
- new_identities: presence landmark: present read present 0.417
- new_identities: presence landmark: present read present [pooled midpoint (comparison)] 0.417
- new_identities: presence tempo: share of FALSE 'present' readings that abstain 0.083
- new_identities: presence start: share of FALSE 'present' readings that abstain 0.714
- new_identities: presence repeat: share of 'present' readings that abstain 0.800
- new_identities: presence repeat: share of true 'present' readings that abstain 0.825
- new_identities: presence ref: share of FALSE 'present' readings that abstain 0.733
- new_identities: determiner identity (outside FULL when the legend excludes it) 0.000
- new_identities: presence path: present read present 0.444
- new_identities: presence path: share of 'present' readings that abstain 0.857
- new_identities: presence path: present read present [pooled midpoint (comparison)] 0.143
- new_identities: presence repeat: share of FALSE 'present' readings that abstain 0.600
- new_identities: presence region: present read present 0.200
- new_identities: presence region: present read present [pooled midpoint (comparison)] 0.250
- new_identities: presence relation: present read present 0.714
- new_identities: presence relation: present read present [pooled midpoint (comparison)] 0.571
- new_identities: presence relation: share of 'present' readings that abstain 0.600
- new_identities: presence relation: share of true 'present' readings that abstain 0.600
- new_identities: presence path: share of FALSE 'present' readings that abstain 0.800
- new_identities: presence color: present read present 0.500
- new_identities: presence color: present read present [pooled midpoint (comparison)] 0.500
- train (sample): FULL 0.383
- train (sample): presence object: present read present 0.858
- train (sample): presence object: share of 'present' readings that abstain 0.280
- train (sample): presence object: share of true 'present' readings that abstain 0.283
- train (sample): presence tempo: present read present 0.867
- train (sample): presence tempo: share of 'present' readings that abstain 0.056
- train (sample): presence tempo: share of true 'present' readings that abstain 0.058
- train (sample): presence ref: present read present 0.844
- train (sample): presence ref: share of 'present' readings that abstain 0.642
- train (sample): presence ref: share of true 'present' readings that abstain 0.630
- train (sample): presence offset: present read present 0.778
- train (sample): presence offset: share of 'present' readings that abstain 0.680
- train (sample): presence offset: share of true 'present' readings that abstain 0.667
- train (sample): presence duration: share of 'present' readings that abstain 0.113
- train (sample): presence duration: share of true 'present' readings that abstain 0.096
- train (sample): presence unit: share of 'present' readings that abstain 0.029
- train (sample): presence unit: share of true 'present' readings that abstain 0.029
- train (sample): predicate (surface lemma) 0.843
- train (sample): event type (synonym table) 0.853
- train (sample): role object 0.693
- train (sample): head object 0.730
- train (sample): occupancy: known filler 0.822
- train (sample): role tempo 0.883
- train (sample): head tempo 0.883
- train (sample): role ref 0.787
- train (sample): head ref 0.820
- train (sample): heads FULL (model) 0.447
- train (sample): heads FULL (lexical order baseline) 0.143
- train (sample): heads FULL (lexical bag baseline, trained on the same training rows) 0.707
- train (sample): FULL [depth given] 0.383
- train (sample): FULL [depth and negation given] 0.383
- train (sample): presence trigger: share of 'present' readings that abstain 0.104
- train (sample): presence trigger: share of true 'present' readings that abstain 0.104
- train (sample): presence start: present read present 0.894
- train (sample): presence start: share of 'present' readings that abstain 0.196
- train (sample): presence start: share of true 'present' readings that abstain 0.119
- train (sample): presence tempo: share of FALSE 'present' readings that abstain 0.000
- train (sample): presence repeat: present read present 0.667
- train (sample): presence repeat: share of 'present' readings that abstain 0.478
- train (sample): presence repeat: share of true 'present' readings that abstain 0.455
- train (sample): presence object: absent read absent 0.797
- train (sample): presence object: share of FALSE 'present' readings that abstain 0.231
- train (sample): presence traveller: present read present 0.838
- train (sample): presence path: share of 'present' readings that abstain 0.409
- train (sample): presence path: share of true 'present' readings that abstain 0.071
- train (sample): presence easing: share of 'present' readings that abstain 0.167
- train (sample): presence easing: share of true 'present' readings that abstain 0.167
- train (sample): determiner identity (outside FULL when the legend excludes it) 0.000
- train (sample): presence direction: share of 'present' readings that abstain 0.222
- train (sample): presence direction: share of true 'present' readings that abstain 0.222
- train (sample): presence distance: present read present 0.889
- train (sample): presence distance: share of 'present' readings that abstain 0.667
- train (sample): presence distance: share of true 'present' readings that abstain 0.625
- train (sample): presence source: present read present 0.583
- train (sample): presence source: share of 'present' readings that abstain 0.857
- train (sample): presence source: share of true 'present' readings that abstain 0.857
- train (sample): presence via: share of 'present' readings that abstain 0.765
- train (sample): presence via: share of FALSE 'present' readings that abstain 0.714
- train (sample): presence target: present read present 0.657
- train (sample): presence target: share of 'present' readings that abstain 0.833
- train (sample): presence target: share of true 'present' readings that abstain 0.826
- train (sample): presence relation: share of 'present' readings that abstain 0.429
- train (sample): presence relation: share of true 'present' readings that abstain 0.429
- train (sample): presence landmark: present read present 0.583
- train (sample): presence color: share of 'present' readings that abstain 0.889
- train (sample): presence speed: share of 'present' readings that abstain 0.231
- train (sample): presence speed: share of true 'present' readings that abstain 0.231
- train (sample): presence duration: share of FALSE 'present' readings that abstain 0.600
- train (sample): presence traveller: share of 'present' readings that abstain 0.571
- train (sample): presence traveller: share of true 'present' readings that abstain 0.516
- train (sample): presence landmark: share of 'present' readings that abstain 0.647
- train (sample): presence landmark: share of true 'present' readings that abstain 0.571
- train (sample): presence offset: share of FALSE 'present' readings that abstain 0.750
- train (sample): presence via: present read present 0.750
- train (sample): presence color: present read present 0.667
- train (sample): presence color: share of true 'present' readings that abstain 0.500
- train (sample): presence region: share of 'present' readings that abstain 0.000
- train (sample): presence region: share of true 'present' readings that abstain 0.000

Formulations with the lowest FULL on the held-out splits (add examples of these formulations):
- heldout_formulations: `now where is the COMPONENT after NUM UNIT ?` FULL 0.000 (n 3)
- heldout_formulations: `play from NUM UNIT instead` FULL 0.000 (n 3)
- heldout_formulations: `freeze at NUM UNIT please .` FULL 0.000 (n 2)
- heldout_formulations: `can you slow_down the COMPONENT` FULL 0.000 (n 2)
- heldout_formulations: `now where is the COLOR COMPONENT after NUM UNIT ?` FULL 0.000 (n 2)
- heldout_sentences: `where is the COMPONENT at NUM UNIT ?` FULL 0.000 (n 2)
- new_identities: `actually , repeat PRON NUM times` FULL 0.000 (n 2)
- new_identities: `okay so where is the COMPONENT at NUM UNIT ?` FULL 0.000 (n 2)

## Unseen formulations: the readouts (rounds 3-4; judgment 45ccd1d D)
The PRODUCT number comes first: the product readout decides presence (a role missing from the text reads "not given"; `_empty` is the product), with the thresholds of model/config.json (set on training rows + the calibration half of the held-out formulations). The v16-protocol row reads every role of the schema (v16 always reads C): a comparison, not available to the product, never a default. Catalog candidates.

| split | readout | heads FULL | FULL | role object | role color | role relation | role landmark | role region | role direction | role distance | role angle | role traveller | role source | role via | role target | role path | role start | role tempo | role ref | role offset | role trigger | role duration | role unit | role per | role speed | role easing | role repeat |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heldout_formulations | product readout: presence decided | 0.304±0.022 | 0.245±0.017 | 0.663±0.018 | 0.907±0.020 | 0.989±0.004 | 0.940±0.013 | 0.994±0.004 | 0.996±0.004 | 0.984±0.007 | 0.993±0.003 | 0.819±0.022 | 0.950±0.004 | 0.958±0.019 | 0.880±0.019 | 0.956±0.013 | 0.914±0.016 | 0.887±0.019 | 0.644±0.034 | 0.922±0.014 | 0.964±0.014 | 0.883±0.017 | 0.878±0.010 | 0.982±0.010 | 0.954±0.012 | 0.972±0.016 | 0.931±0.016 |
| heldout_formulations | presence decided, pooled-midpoint thresholds (the comparison, rounds 1-5) | 0.227±0.015 | 0.160±0.011 | 0.587±0.026 | 0.916±0.019 | 0.983±0.004 | 0.954±0.006 | 0.995±0.003 | 0.991±0.006 | 0.983±0.007 | 0.992±0.004 | 0.808±0.014 | 0.950±0.005 | 0.945±0.008 | 0.880±0.016 | 0.960±0.011 | 0.873±0.016 | 0.808±0.013 | 0.626±0.022 | 0.925±0.012 | 0.932±0.014 | 0.832±0.010 | 0.806±0.017 | 0.981±0.009 | 0.935±0.015 | 0.952±0.011 | 0.928±0.013 |
| heldout_formulations | v16 protocol: every role read, not available to the product | 0.244±0.018 | 0.208±0.012 | 0.524±0.018 | 0.720±0.000 | 1.000±0.000 | 0.852±0.021 | 1.000±0.000 | 1.000±0.000 | 0.941±0.015 | 0.948±0.009 | 0.755±0.011 | 0.879±0.016 | 0.878±0.015 | 0.817±0.017 | 0.911±0.012 | 0.919±0.008 | 0.908±0.002 | 0.562±0.020 | 0.893±0.016 | 1.000±0.000 | 0.897±0.016 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.916±0.009 |

## Presence per role (judgment 752853c §2)
Product readout first: presence decided with the FITTED thresholds (argmax balanced accuracy on the calibration rows); the pooled midpoint of the same rows beside it as the comparison (one more round). Abstain = the role's margin min(identity, presence) under tau: a near-threshold reading is uncertain, not a claim.

| split | role | readout | present read present | absent read absent | balanced | 'present' readings that abstain (false / true) |
|---|---|---|---|---|---|---|
| heldout_formulations | object | product: fitted | 0.951±0.010 | 0.726±0.035 | 0.838±0.018 | 0.416±0.027 (0.491±0.050 / 0.406±0.026) |
| heldout_formulations | object | comparison: pooled midpoint | 0.849±0.014 | 0.748±0.050 | 0.798±0.020 |  |
| heldout_formulations | color | product: fitted | — | 0.896±0.023 | — | 0.990±0.019 (0.990±0.019 / —) |
| heldout_formulations | color | comparison: pooled midpoint | — | 0.892±0.026 | — |  |
| heldout_formulations | relation | product: fitted | 0.633±0.125 | 1.000±0.000 | 0.817±0.062 | 0.960±0.080 (— / 0.960±0.080) |
| heldout_formulations | relation | comparison: pooled midpoint | 0.630±0.125 | 1.000±0.000 | 0.815±0.062 |  |
| heldout_formulations | landmark | product: fitted | 0.400±0.054 | 0.965±0.016 | 0.682±0.022 | 0.872±0.094 (0.928±0.099 / 0.783±0.194) |
| heldout_formulations | landmark | comparison: pooled midpoint | 0.329±0.083 | 0.988±0.008 | 0.658±0.042 |  |
| heldout_formulations | region | product: fitted | 0.500±0.354 | 1.000±0.000 | 0.750±0.177 | 1.000±0.000 (— / 1.000±0.000) |
| heldout_formulations | region | comparison: pooled midpoint | 0.625±0.217 | 1.000±0.000 | 0.812±0.108 |  |
| heldout_formulations | direction | product: fitted | 0.840±0.150 | 1.000±0.000 | 0.920±0.075 | 0.840±0.233 (— / 0.840±0.233) |
| heldout_formulations | direction | comparison: pooled midpoint | 0.900±0.200 | 1.000±0.000 | 0.950±0.100 |  |
| heldout_formulations | distance | product: fitted | 0.760±0.233 | 0.989±0.007 | 0.875±0.116 | 0.892±0.148 (0.950±0.100 / 0.860±0.196) |
| heldout_formulations | distance | comparison: pooled midpoint | 0.850±0.200 | 0.992±0.003 | 0.921±0.100 |  |
| heldout_formulations | traveller | product: fitted | 0.759±0.098 | 0.939±0.032 | 0.849±0.044 | 0.845±0.052 (0.668±0.191 / 0.884±0.055) |
| heldout_formulations | traveller | comparison: pooled midpoint | 0.549±0.088 | 0.967±0.015 | 0.758±0.045 |  |
| heldout_formulations | source | product: fitted | 0.623±0.083 | 0.989±0.004 | 0.806±0.041 | 0.921±0.112 (0.933±0.133 / 0.933±0.133) |
| heldout_formulations | source | comparison: pooled midpoint | 0.543±0.230 | 0.992±0.003 | 0.767±0.114 |  |
| heldout_formulations | via | product: fitted | 0.300±0.245 | 0.964±0.022 | 0.632±0.124 | 0.859±0.115 (0.856±0.118 / 1.000±0.000) |
| heldout_formulations | via | comparison: pooled midpoint | 0.800±0.245 | 0.939±0.009 | 0.870±0.120 |  |
| heldout_formulations | target | product: fitted | 0.589±0.134 | 0.989±0.012 | 0.789±0.068 | 0.861±0.063 (0.667±0.471 / 0.855±0.078) |
| heldout_formulations | target | comparison: pooled midpoint | 0.550±0.169 | 0.998±0.003 | 0.774±0.085 |  |
| heldout_formulations | path | product: fitted | 0.529±0.190 | 0.985±0.012 | 0.757±0.090 | 0.717±0.194 (1.000±0.000 / 0.600±0.162) |
| heldout_formulations | path | comparison: pooled midpoint | 0.476±0.195 | 0.989±0.016 | 0.733±0.090 |  |
| heldout_formulations | start | product: fitted | 0.778±0.041 | 0.972±0.011 | 0.875±0.026 | 0.321±0.038 (0.667±0.211 / 0.265±0.055) |
| heldout_formulations | start | comparison: pooled midpoint | 0.623±0.065 | 0.988±0.009 | 0.806±0.035 |  |
| heldout_formulations | tempo | product: fitted | 0.935±0.036 | 0.877±0.026 | 0.906±0.018 | 0.115±0.016 (0.306±0.160 / 0.100±0.023) |
| heldout_formulations | tempo | comparison: pooled midpoint | 0.873±0.029 | 0.863±0.018 | 0.868±0.018 |  |
| heldout_formulations | ref | product: fitted | 0.759±0.046 | 0.903±0.012 | 0.831±0.028 | 0.691±0.053 (0.796±0.136 / 0.683±0.055) |
| heldout_formulations | ref | comparison: pooled midpoint | 0.748±0.030 | 0.886±0.025 | 0.817±0.014 |  |
| heldout_formulations | offset | product: fitted | 0.580±0.157 | 0.963±0.009 | 0.771±0.077 | 0.812±0.094 (0.917±0.105 / 0.747±0.077) |
| heldout_formulations | offset | comparison: pooled midpoint | 0.600±0.116 | 0.963±0.014 | 0.781±0.056 |  |
| heldout_formulations | trigger | product: fitted | 0.866±0.060 | 1.000±0.000 | 0.933±0.030 | 0.218±0.042 (— / 0.218±0.042) |
| heldout_formulations | trigger | comparison: pooled midpoint | 0.774±0.052 | 1.000±0.000 | 0.887±0.026 |  |
| heldout_formulations | duration | product: fitted | 0.894±0.036 | 0.967±0.014 | 0.930±0.020 | 0.269±0.042 (0.600±0.374 / 0.261±0.035) |
| heldout_formulations | duration | comparison: pooled midpoint | 0.860±0.019 | 0.977±0.015 | 0.918±0.012 |  |
| heldout_formulations | unit | product: fitted | 0.853±0.017 | 1.000±0.000 | 0.926±0.009 | 0.024±0.011 (— / 0.024±0.011) |
| heldout_formulations | unit | comparison: pooled midpoint | 0.817±0.017 | 1.000±0.000 | 0.908±0.008 |  |
| heldout_formulations | speed | product: fitted | 0.783±0.081 | 1.000±0.000 | 0.891±0.040 | 0.416±0.105 (— / 0.416±0.105) |
| heldout_formulations | speed | comparison: pooled midpoint | 0.748±0.081 | 1.000±0.000 | 0.874±0.041 |  |
| heldout_formulations | easing | product: fitted | 0.829±0.122 | 1.000±0.000 | 0.915±0.061 | 0.616±0.142 (— / 0.616±0.142) |
| heldout_formulations | easing | comparison: pooled midpoint | 0.704±0.086 | 1.000±0.000 | 0.852±0.043 |  |
| heldout_formulations | repeat | product: fitted | 0.599±0.082 | 0.976±0.010 | 0.788±0.042 | 0.644±0.129 (0.813±0.165 / 0.608±0.150) |
| heldout_formulations | repeat | comparison: pooled midpoint | 0.608±0.107 | 0.974±0.014 | 0.791±0.050 |  |
| heldout_sentences | object | product: fitted | 0.903±0.052 | 0.748±0.028 | 0.826±0.022 | 0.342±0.065 (0.480±0.121 / 0.327±0.076) |
| heldout_sentences | object | comparison: pooled midpoint | 0.688±0.047 | 0.802±0.070 | 0.745±0.051 |  |
| heldout_sentences | color | product: fitted | 0.433±0.276 | 0.883±0.040 | 0.658±0.130 | 1.000±0.000 (1.000±0.000 / 1.000±0.000) |
| heldout_sentences | color | comparison: pooled midpoint | 0.467±0.340 | 0.887±0.026 | 0.677±0.175 |  |
| heldout_sentences | relation | product: fitted | — | 1.000±0.000 | — |  |
| heldout_sentences | relation | comparison: pooled midpoint | — | 1.000±0.000 | — |  |
| heldout_sentences | landmark | product: fitted | 0.600±0.133 | 0.977±0.010 | 0.788±0.070 | 0.790±0.040 (0.833±0.211 / 0.800±0.187) |
| heldout_sentences | landmark | comparison: pooled midpoint | 0.433±0.133 | 0.981±0.010 | 0.707±0.069 |  |
| heldout_sentences | region | product: fitted | 0.750±0.433 | 1.000±0.000 | 0.875±0.217 | 1.000±0.000 (— / 1.000±0.000) |
| heldout_sentences | region | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | direction | product: fitted | 0.950±0.100 | 1.000±0.000 | 0.975±0.050 | 0.850±0.200 (— / 0.850±0.200) |
| heldout_sentences | direction | comparison: pooled midpoint | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 |  |
| heldout_sentences | distance | product: fitted | 0.750±0.158 | 0.995±0.006 | 0.873±0.077 | 0.920±0.160 (1.000±0.000 / 0.900±0.200) |
| heldout_sentences | distance | comparison: pooled midpoint | 0.850±0.122 | 0.997±0.005 | 0.924±0.060 |  |
| heldout_sentences | traveller | product: fitted | 0.665±0.051 | 0.967±0.025 | 0.816±0.034 | 0.858±0.074 (0.950±0.087 / 0.850±0.079) |
| heldout_sentences | traveller | comparison: pooled midpoint | 0.428±0.181 | 0.975±0.016 | 0.701±0.088 |  |
| heldout_sentences | source | product: fitted | 0.400±0.200 | 0.998±0.005 | 0.699±0.099 | 1.000±0.000 (1.000 / 1.000±0.000) |
| heldout_sentences | source | comparison: pooled midpoint | 0.450±0.145 | 0.995±0.006 | 0.722±0.072 |  |
| heldout_sentences | via | product: fitted | 0.600±0.490 | 0.971±0.011 | 0.786±0.247 | 0.793±0.194 (0.650±0.374 / 1.000±0.000) |
| heldout_sentences | via | comparison: pooled midpoint | 0.600±0.490 | 0.947±0.020 | 0.774±0.249 |  |
| heldout_sentences | target | product: fitted | 0.693±0.065 | 0.985±0.005 | 0.839±0.033 | 0.899±0.051 (0.800±0.400 / 0.913±0.072) |
| heldout_sentences | target | comparison: pooled midpoint | 0.533±0.140 | 0.997±0.006 | 0.765±0.069 |  |
| heldout_sentences | path | product: fitted | 0.720±0.271 | 0.979±0.008 | 0.850±0.135 | 0.710±0.218 (0.900±0.200 / 0.570±0.331) |
| heldout_sentences | path | comparison: pooled midpoint | 0.590±0.211 | 0.987±0.008 | 0.788±0.104 |  |
| heldout_sentences | start | product: fitted | 0.853±0.046 | 0.966±0.019 | 0.910±0.025 | 0.262±0.082 (0.667±0.408 / 0.197±0.045) |
| heldout_sentences | start | comparison: pooled midpoint | 0.580±0.107 | 0.987±0.016 | 0.784±0.049 |  |
| heldout_sentences | tempo | product: fitted | 0.882±0.050 | 0.925±0.017 | 0.903±0.025 | 0.058±0.068 (0.217±0.296 / 0.042±0.044) |
| heldout_sentences | tempo | comparison: pooled midpoint | 0.826±0.043 | 0.950±0.022 | 0.888±0.022 |  |
| heldout_sentences | ref | product: fitted | 0.762±0.029 | 0.970±0.010 | 0.866±0.014 | 0.662±0.017 (0.800±0.245 / 0.659±0.015) |
| heldout_sentences | ref | comparison: pooled midpoint | 0.765±0.069 | 0.972±0.027 | 0.868±0.026 |  |
| heldout_sentences | offset | product: fitted | 0.511±0.099 | 0.983±0.010 | 0.747±0.050 | 0.938±0.076 (0.875±0.217 / 0.967±0.067) |
| heldout_sentences | offset | comparison: pooled midpoint | 0.516±0.073 | 0.986±0.009 | 0.751±0.035 |  |
| heldout_sentences | trigger | product: fitted | 0.863±0.047 | 1.000±0.000 | 0.931±0.023 | 0.229±0.139 (— / 0.229±0.139) |
| heldout_sentences | trigger | comparison: pooled midpoint | 0.741±0.070 | 1.000±0.000 | 0.870±0.035 |  |
| heldout_sentences | duration | product: fitted | 0.854±0.032 | 0.890±0.020 | 0.872±0.023 | 0.290±0.058 (0.737±0.175 / 0.234±0.048) |
| heldout_sentences | duration | comparison: pooled midpoint | 0.798±0.013 | 0.921±0.037 | 0.860±0.017 |  |
| heldout_sentences | unit | product: fitted | 0.828±0.025 | 1.000±0.000 | 0.914±0.013 | 0.032±0.033 (— / 0.032±0.033) |
| heldout_sentences | unit | comparison: pooled midpoint | 0.784±0.038 | 1.000±0.000 | 0.892±0.019 |  |
| heldout_sentences | speed | product: fitted | 0.886±0.070 | 1.000±0.000 | 0.943±0.035 | 0.366±0.142 (— / 0.366±0.142) |
| heldout_sentences | speed | comparison: pooled midpoint | 0.814±0.057 | 1.000±0.000 | 0.907±0.028 |  |
| heldout_sentences | easing | product: fitted | 0.855±0.045 | 1.000±0.000 | 0.927±0.022 | 0.740±0.155 (— / 0.740±0.155) |
| heldout_sentences | easing | comparison: pooled midpoint | 0.693±0.114 | 1.000±0.000 | 0.846±0.057 |  |
| heldout_sentences | repeat | product: fitted | 0.633±0.138 | 0.988±0.011 | 0.811±0.064 | 0.578±0.130 (0.833±0.236 / 0.546±0.130) |
| heldout_sentences | repeat | comparison: pooled midpoint | 0.668±0.167 | 0.986±0.012 | 0.827±0.080 |  |
| new_identities | object | product: fitted | 0.917±0.009 | 0.584±0.049 | 0.751±0.028 | 0.387±0.028 (0.645±0.086 / 0.360±0.027) |
| new_identities | object | comparison: pooled midpoint | 0.811±0.022 | 0.734±0.046 | 0.773±0.022 |  |
| new_identities | color | product: fitted | 0.820±0.223 | 0.888±0.041 | 0.854±0.105 | 0.974±0.026 (0.981±0.016 / 0.910±0.111) |
| new_identities | color | comparison: pooled midpoint | 0.850±0.200 | 0.893±0.038 | 0.872±0.103 |  |
| new_identities | relation | product: fitted | 0.648±0.065 | 1.000±0.000 | 0.824±0.032 | 0.720±0.392 (— / 0.720±0.392) |
| new_identities | relation | comparison: pooled midpoint | 0.508±0.103 | 1.000±0.000 | 0.754±0.051 |  |
| new_identities | landmark | product: fitted | 0.492±0.042 | 0.960±0.014 | 0.726±0.026 | 0.931±0.043 (0.918±0.035 / 0.967±0.067) |
| new_identities | landmark | comparison: pooled midpoint | 0.369±0.040 | 0.985±0.013 | 0.677±0.016 |  |
| new_identities | region | product: fitted | 0.308±0.123 | 1.000±0.000 | 0.654±0.062 | 0.875±0.217 (— / 0.875±0.217) |
| new_identities | region | comparison: pooled midpoint | 0.412±0.102 | 1.000±0.000 | 0.706±0.051 |  |
| new_identities | direction | product: fitted | 0.793±0.166 | 1.000±0.000 | 0.896±0.083 | 0.664±0.203 (— / 0.664±0.203) |
| new_identities | direction | comparison: pooled midpoint | 0.873±0.108 | 1.000±0.000 | 0.937±0.054 |  |
| new_identities | distance | product: fitted | 0.835±0.112 | 0.984±0.009 | 0.909±0.053 | 0.840±0.092 (0.933±0.133 / 0.798±0.105) |
| new_identities | distance | comparison: pooled midpoint | 0.843±0.064 | 0.984±0.010 | 0.913±0.030 |  |
| new_identities | traveller | product: fitted | 0.702±0.035 | 0.955±0.022 | 0.828±0.022 | 0.844±0.030 (0.693±0.145 / 0.893±0.032) |
| new_identities | traveller | comparison: pooled midpoint | 0.644±0.083 | 0.973±0.012 | 0.808±0.044 |  |
| new_identities | source | product: fitted | 0.547±0.094 | 0.991±0.004 | 0.769±0.046 | 0.921±0.049 (0.850±0.200 / 0.937±0.040) |
| new_identities | source | comparison: pooled midpoint | 0.590±0.088 | 0.993±0.005 | 0.792±0.043 |  |
| new_identities | via | product: fitted | 0.556±0.070 | 0.952±0.014 | 0.754±0.039 | 0.914±0.030 (0.915±0.029 / 0.927±0.090) |
| new_identities | via | comparison: pooled midpoint | 0.703±0.118 | 0.924±0.014 | 0.813±0.054 |  |
| new_identities | target | product: fitted | 0.597±0.060 | 0.979±0.011 | 0.788±0.029 | 0.919±0.009 (0.940±0.080 / 0.920±0.009) |
| new_identities | target | comparison: pooled midpoint | 0.567±0.046 | 0.989±0.005 | 0.778±0.024 |  |
| new_identities | path | product: fitted | 0.431±0.188 | 0.976±0.012 | 0.703±0.092 | 0.760±0.152 (0.796±0.127 / 0.747±0.229) |
| new_identities | path | comparison: pooled midpoint | 0.233±0.111 | 0.986±0.015 | 0.609±0.050 |  |
| new_identities | start | product: fitted | 0.737±0.021 | 0.951±0.029 | 0.844±0.010 | 0.318±0.048 (0.824±0.076 / 0.219±0.034) |
| new_identities | start | comparison: pooled midpoint | 0.624±0.030 | 0.976±0.012 | 0.800±0.013 |  |
| new_identities | tempo | product: fitted | 0.929±0.025 | 0.893±0.014 | 0.911±0.008 | 0.074±0.015 (0.190±0.122 / 0.066±0.019) |
| new_identities | tempo | comparison: pooled midpoint | 0.878±0.015 | 0.925±0.015 | 0.902±0.012 |  |
| new_identities | ref | product: fitted | 0.750±0.056 | 0.909±0.005 | 0.829±0.028 | 0.733±0.029 (0.726±0.087 / 0.733±0.026) |
| new_identities | ref | comparison: pooled midpoint | 0.761±0.026 | 0.927±0.015 | 0.844±0.012 |  |
| new_identities | offset | product: fitted | 0.605±0.079 | 0.956±0.018 | 0.780±0.041 | 0.843±0.081 (0.901±0.145 / 0.830±0.070) |
| new_identities | offset | comparison: pooled midpoint | 0.571±0.086 | 0.965±0.005 | 0.768±0.044 |  |
| new_identities | trigger | product: fitted | 0.867±0.059 | 1.000±0.000 | 0.933±0.030 | 0.181±0.060 (— / 0.181±0.060) |
| new_identities | trigger | comparison: pooled midpoint | 0.846±0.035 | 1.000±0.000 | 0.923±0.018 |  |
| new_identities | duration | product: fitted | 0.881±0.066 | 0.867±0.034 | 0.874±0.026 | 0.351±0.047 (0.888±0.098 / 0.331±0.049) |
| new_identities | duration | comparison: pooled midpoint | 0.824±0.021 | 0.870±0.030 | 0.847±0.022 |  |
| new_identities | unit | product: fitted | 0.879±0.041 | 1.000±0.000 | 0.940±0.020 | 0.034±0.012 (— / 0.034±0.012) |
| new_identities | unit | comparison: pooled midpoint | 0.835±0.017 | 1.000±0.000 | 0.917±0.008 |  |
| new_identities | speed | product: fitted | 0.742±0.074 | 1.000±0.000 | 0.871±0.037 | 0.446±0.096 (— / 0.446±0.096) |
| new_identities | speed | comparison: pooled midpoint | 0.724±0.059 | 1.000±0.000 | 0.862±0.029 |  |
| new_identities | easing | product: fitted | 0.760±0.103 | 1.000±0.000 | 0.880±0.052 | 0.610±0.099 (— / 0.610±0.099) |
| new_identities | easing | comparison: pooled midpoint | 0.693±0.076 | 1.000±0.000 | 0.847±0.038 |  |
| new_identities | repeat | product: fitted | 0.701±0.089 | 0.971±0.013 | 0.836±0.045 | 0.731±0.065 (0.834±0.178 / 0.712±0.076) |
| new_identities | repeat | comparison: pooled midpoint | 0.703±0.051 | 0.971±0.009 | 0.837±0.028 |  |
| train (sample) | object | product: fitted | 0.911±0.037 | 0.796±0.039 | 0.853±0.021 | 0.314±0.031 (0.453±0.150 / 0.305±0.031) |
| train (sample) | color | product: fitted | 0.933±0.133 | 0.908±0.021 | 0.920±0.067 | 0.914±0.017 (0.963±0.026 / 0.500±0.149) |
| train (sample) | relation | product: fitted | 0.829±0.107 | 1.000±0.000 | 0.914±0.053 | 0.732±0.267 (— / 0.732±0.267) |
| train (sample) | landmark | product: fitted | 0.783±0.110 | 0.985±0.008 | 0.884±0.054 | 0.507±0.088 (1.000±0.000 / 0.413±0.086) |
| train (sample) | region | product: fitted | 1.000±0.000 | 1.000±0.000 | 1.000±0.000 | 0.375±0.415 (— / 0.375±0.415) |
| train (sample) | direction | product: fitted | 0.978±0.044 | 1.000±0.000 | 0.989±0.022 | 0.303±0.246 (— / 0.303±0.246) |
| train (sample) | distance | product: fitted | 0.933±0.054 | 0.996±0.003 | 0.964±0.028 | 0.506±0.212 (0.875±0.217 / 0.467±0.252) |
| train (sample) | traveller | product: fitted | 0.873±0.026 | 0.968±0.016 | 0.921±0.009 | 0.591±0.053 (0.788±0.145 / 0.545±0.059) |
| train (sample) | source | product: fitted | 0.611±0.088 | 0.996±0.005 | 0.804±0.043 | 0.830±0.053 (0.833±0.167 / 0.826±0.040) |
| train (sample) | via | product: fitted | 0.783±0.113 | 0.981±0.017 | 0.882±0.056 | 0.770±0.161 (0.493±0.414 / 0.933±0.133) |
| train (sample) | target | product: fitted | 0.682±0.061 | 0.990±0.003 | 0.836±0.030 | 0.820±0.031 (0.800±0.267 / 0.829±0.050) |
| train (sample) | path | product: fitted | 0.957±0.035 | 0.986±0.010 | 0.971±0.015 | 0.301±0.084 (0.900±0.173 / 0.152±0.099) |
| train (sample) | start | product: fitted | 0.866±0.024 | 0.980±0.006 | 0.923±0.011 | 0.224±0.030 (0.971±0.057 / 0.136±0.049) |
| train (sample) | tempo | product: fitted | 0.909±0.034 | 0.946±0.005 | 0.927±0.018 | 0.050±0.017 (0.129±0.194 / 0.046±0.014) |
| train (sample) | ref | product: fitted | 0.777±0.047 | 0.965±0.008 | 0.871±0.023 | 0.627±0.013 (0.791±0.133 / 0.620±0.013) |
| train (sample) | offset | product: fitted | 0.718±0.038 | 0.984±0.011 | 0.851±0.022 | 0.592±0.119 (0.661±0.350 / 0.564±0.096) |
| train (sample) | trigger | product: fitted | 0.911±0.045 | 1.000±0.000 | 0.956±0.022 | 0.084±0.026 (— / 0.084±0.026) |
| train (sample) | duration | product: fitted | 0.893±0.046 | 0.969±0.010 | 0.931±0.020 | 0.129±0.015 (0.593±0.259 / 0.119±0.015) |
| train (sample) | unit | product: fitted | 0.881±0.028 | 1.000±0.000 | 0.941±0.014 | 0.036±0.007 (— / 0.036±0.007) |
| train (sample) | speed | product: fitted | 0.874±0.049 | 1.000±0.000 | 0.937±0.025 | 0.204±0.032 (— / 0.204±0.032) |
| train (sample) | easing | product: fitted | 0.901±0.096 | 1.000±0.000 | 0.951±0.048 | 0.267±0.130 (— / 0.267±0.130) |
| train (sample) | repeat | product: fitted | 0.799±0.073 | 0.994±0.004 | 0.897±0.035 | 0.467±0.063 (0.667±0.408 / 0.454±0.072) |

## Structure given vs estimated (author C3)
`FULL` = the reporting depth ESTIMATED by the primary estimator of model/config.json (`kinds`: the count of level-opener kinds by default; the open-gate count and the fit are the checks, `FULL [gate-count estimate]` / `FULL [fit estimate]`) and the event negation by the fit (what `sop formalize` does); `FULL [depth given]` = the depth GIVEN (as the repository scripts), negation estimated; `FULL [depth and negation given]`.

## Checklist
[x] addresses from the world [x] shared identities (one star function) [x] chance printed [x] seen / unseen axes separated [x] margin [x] >=3 seeds [x] trivial controls (lexical bag and lexical order baselines) [x] calibration (rule 18) [x] memory logged (rule 21) [x] thresholds on calibration rows (rule 25) [x] given vs learned stated (rule 20)
