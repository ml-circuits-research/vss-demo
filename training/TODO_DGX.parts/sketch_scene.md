## Sketch and scene (spec section 17): what runs on the DGX, and what needs people

Prepared and checked on CPU: the sketch pad, the stroke recogniser and the rule-based scene pass (`app/src/sketch/`, test
`node app/tests/sketch.mjs`), the synthetic strokes (`training/worlds/scene/synth_strokes.py`), the scene world and the FPE
experiment (`training/worlds/scene/`). The recogniser has no training: nothing of it runs on the DGX.

### 1. On the DGX: the positions-as-addresses experiment (spec 17.3, step 18 of spec section 23)

Criteria (written before the run, in `training/worlds/scene/experiment_fpe.py` and its README): C1 heldout left_of, above, inside,
nearest endpoint each >= 0.97 at D = 1024 (mean over five seeds, per-seed list); C2 the same at D = 4096 reported; R1 separability
reported; R2 capacity reported. Kernel, L and tau are set on dev; heldout is read once.

From the repository root, on a committed tree, under the repository's run lock (`logs/.run.lock`, one run at a time):

```
python3 training/worlds/scene/experiment_fpe.py --D 1024 4096 --seeds 0 1 2 3 4 --n_dev 100 --n_heldout 400 \
    --kernels gaussian sinc --Ls 16 24 32 48 64 96 --capacity 4 8 16 32 64 128 --n_cap 60 \
    --sep_d 2 4 8 12 16 24 32 48 64 96 128 --sep_trials 200 --out logs/scene_fpe_<commit> 2>&1 | tee logs/scene_fpe_<commit>.log
```

CPU (numpy) is enough; `--xp cupy` may be added if cupy is installed (the code supports it; not run on the development machine).
Resumable: each (D, seed) is saved as `logs/scene_fpe_<commit>/D<D>_seed<s>.json` and skipped when present. Memory is logged.

Exit check: the summary table printed at the end (and `summary.json`): C1 MET or MISSED with its numbers and cause; separability and
capacity rows reported in STATUS.md with the log name. If C1 is met, the swap-in (an FPE scene reader in the browser behind the same
interface as `scene_pass.js`, the About panel naming it) is a separate, later step with its own parity check.

Optional second run, one change: `--readout direct` (the second address compared without decoding; see the script header), same
command otherwise, its own output folder.

### 2. With people: the hand-drawn test set (spec 17.5)

The synthetic numbers are not a substitute; the hand-drawn rows are "reported" (no criterion) on the first run.

- **People**: at least ten adults, a mix of left- and right-handed and of drawing habits (at least three who rarely draw diagrams).
  Each person draws on two devices: a tablet with a pen or a finger, and a computer with a mouse. Not the developers.
- **Consent**: a short written consent before the session: what is recorded (strokes with timestamps, the device type, the pointer
  type; no video, no audio, no name stored with the data), the purpose (testing the recogniser of a public demo), that the strokes may
  be published inside the repository as a test set under the repository's licence, and that a participant can withdraw and have their
  strokes deleted until publication. A participant id (P01 ... P10) is the only link; the consent forms are kept apart from the data.
- **Material**: twenty given diagrams per person and device (a printed or on-screen picture of the target, not traced over), drawn
  from the synthetic generator's distribution and a few hand-made ones: 3 to 15 elements, every kind (rectangle, rounded rectangle,
  ellipse, diamond, cylinder, triangle), straight and elbow connectors, lines and arrows, one or two containers, label marks inside some
  shapes, two scribble-to-delete tasks, and two "draw anything that is not a diagram shape" prompts (the planted unknowns).
  The gold circuit of each target diagram is written in advance (the same JSON structure as `sketch_synth.json`, plus the SOP circuit).
- **Recording**: the editor's sketch pad itself, in a recording mode that saves `pad.export()` per diagram (the synthetic set's format:
  `[x0, y0, t0, dx, dy, dt, ...]` per stroke, `pointerType`), with the participant id, the device (model, screen size, OS, browser),
  the pointer type, the target diagram id and the date. Strokes the person undid are kept in a separate list (not in the test).
  The person is told what each diagram should contain but not how the recogniser works.
- **Gold mapping**: after the session, a second person assigns each recorded stroke to an element, connector or mark of the target
  (a small labelling page on the same data; disagreements resolved by a third person); the assignment is the gold for symbols,
  connectors, containment, unknowns and the circuit.
- **Report**: the rows of `app/tests/sketch.mjs` on the hand-drawn set, per device and per pointer type, with the synthetic test
  numbers beside them. The hand-drawn set is never used to tune the recogniser; a later tuning needs a separate hand-drawn tuning set
  from different people.
- **Bitmap path** (photos of a whiteboard, spec 17.1): not built yet; if it is built, ten photos per person of their own drawings,
  reported separately with no criterion on the first run.
