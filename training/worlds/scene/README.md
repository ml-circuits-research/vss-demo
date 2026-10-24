# The scene world (VSS Diagram Editor, spec section 17)

Two things live here: the synthetic strokes that test the sketch recogniser of `app/src/sketch/`, and the prepared experiment of spec
17.3, positions as addresses (fractional power encoding, FPE).

| file | content |
|---|---|
| `synth_strokes.py` | random diagrams (3 to 15 elements, connectors, 0 to 2 containers, label marks, text placeholders, scribble-to-delete, planted unknown blobs) drawn as hand-drawn strokes with timestamps: drawing order and direction, single and multi-stroke variants, overshoot, corner gaps, wobble, jitter, speed, 60 to 120 Hz sampling; the gold structure of each scene (`--sop DIR` also writes the gold circuits as SOP Lang). Writes `app/tests/data/sketch_synth.json` (tune split seed 17, test split seed 1017, under 1 MB) |
| `tune_recogniser.mjs` | grouping, confusion and feature statistics of the recogniser on the TUNE split only; the prototype table and thresholds of `app/src/sketch/recognise.js` come from it |
| `fpe.py` | the one change to the algebra: positions as phases, A(x, y) = exp(i (theta_x x + theta_y y)); displacement by multiplication; Gaussian or sinc kernel with length scale L; grid decoding; half-plane bundles; the scene encoder (identities and roles from `tool/sop/world.py star`, read-only) |
| `generate.py` | the scene world of the experiment: shapes at positions, containers, connectors, and the relation queries with gold answers (left_of, above, inside, nearest endpoint); dev and heldout splits; capacity and separability scenes; SOP Lang output (`--out DIR`) checked by parsing it back |
| `experiment_fpe.py` | the experiment: criteria in its header (written before any run), `--smoke` for CPU, the DGX command, per-(D, seed) results resumable |

Nothing in `tool/` or `experiment/` is modified: `fpe.py` imports `tool/sop/world.py` for the stars only.

## The FPE experiment (spec 17.3, Table 13 row "Scene reading with positions as addresses")

A scene state is S = sum of E_k (x) A(centre_k) + E_k (x) R_kind (x) K_kind over the elements, plus E_c (x) (R_tl (x) A(tl) + R_br (x)
A(br)) for containers and E_j (x) (R_tail (x) A(tail) + R_tip (x) A(tip)) for connectors. Relations are read by displacing and
comparing, never learned: an address is decoded from S by its identity (the argmax of the kernel response on a grid, refined), then
`left_of` and `above` compare the second address against the first one displaced by the half-plane bundle, `inside` checks the four
container corners the same way, and `nearest` compares the decoded tip with the decoded centres by address similarity.
(`--readout direct` keeps the second address as the noisy unbound vector instead; recorded as an alternative.)

Criteria, written before the run (also in the script's header, and printed by it):
- C1: heldout readout of left_of, above, inside and nearest endpoint, each >= 0.97 at D = 1024 on scenes of the demo's size,
  mean over five seeds with the per-seed list (rule 27); chance, majority, margins and confident-wrong at tau beside each.
- C2: the same rows at D = 4096, reported.
- R1: separability, reported: the smallest centre distance at which left_of reaches 0.97 (D = 1024 and 4096), and the smallest
  distance at which two elements of the same identity resolve into two peaks.
- R2: capacity, reported: accuracy against n in {4, 8, 16, 32, 64, 128}; the largest n with all four relations >= 0.97.
- Swap-in: the browser keeps the rule-based pass (`app/src/sketch/scene_pass.js`) unless C1 is met.
The kernel and L are chosen on dev; tau (the abstention margin, confident-wrong <= 1%) is set on dev; heldout is read once.

## Commands

```
python3 training/worlds/scene/synth_strokes.py                         # app/tests/data/sketch_synth.json
node training/worlds/scene/tune_recogniser.mjs --features              # tune split only
node app/tests/sketch.mjs                                              # the sketch rows (test split) and the scenarios
python3 training/worlds/scene/generate.py --out <dir> --n_dev 50 --n_heldout 200
python3 training/worlds/scene/experiment_fpe.py --smoke --out <dir>   # CPU pipeline check
```
The full run is in `training/TODO_DGX.parts/sketch_scene.md`. `--xp cupy` is supported by the code but was not run here (no GPU);
the numpy path is the tested one.

## Smoke numbers (pipeline checks, not results)

- `experiment_fpe.py --smoke` (D 256, one seed, 8 heldout scenes): left_of 0.780, above 0.684, inside 0.926, nearest 0.636; at D 256
  a demo-size scene (about 30 terms) is beyond what the decoding resolves. Not a result.
- A small probe at D 1024 (one seed, 6 dev and 10 heldout scenes, L chosen 48 among 32 / 48 / 64): left_of 0.997, above 0.994,
  inside 1.000, nearest 1.000; capacity sweep 8 and 16 elements (3 scenes each) at or above 0.96; left_of separable from 16 px; two
  peaks of one identity not resolved at 16 to 64 px (the Gaussian kernel at L 48 needs more than about 2 L). Too small to be a result:
  it says the criterion is attainable by construction (rule 30), nothing more.
