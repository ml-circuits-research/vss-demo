# TODO on the DGX (vss-demo)

What has to run on the DGX, in order, with the exact commands and the exit check of each step. Everything else (the application, the
generators, the frozen data, the tests) is prepared and committed. The rules of the repository apply (AGENTS.md): criteria before runs,
one change per run, every number labelled and pointing to a log, five seeds, thresholds only on calibration rows. No durations are
estimated here.

## 0. Once

```
git clone https://github.com/ml-circuits-research/vss-demo && cd vss-demo
python3 -m venv .venv && . .venv/bin/activate
pip install torch numpy                      # the DGX's CUDA build of torch (as the paper repository's README_DGX.md)
tool/bin/sop --help                          # uses .venv
bash app/tests/run_all.sh                    # the application's tests (node >= 18)
bash training/parity/run_all.sh              # the reader's parity test on the smoke models (CPU)
nvidia-smi
```

## 1. The diagram world (spec steps 3 to 5)

| # | command | exit check |
|---|---|---|
| 1.1 | `training/gpu_diagram_step3.sh` (frozen data `training/data/diagram/n1000 ... n50000`, D 1024, five seeds, `--star_version 2`, thresholds fitted on calibration rows incl. held-out formulations) | rows of spec Table 13 for seen (FULL >= 0.98), held-out formulations (confident-wrong < 2% at coverage > 80%), new labels (>= 0.99), value slots (>= 0.98), negation and prohibitions (>= 0.97); the shipped size = the smallest after which the held-out formulation row stops improving within seed variance |
| 1.2 | paraphrases: `python3 training/worlds/diagram/paraphrase.py <world> --n 5000` (needs an API key, see the script's header), the second look, one retraining at the shipped size | held-out formulation row on the paraphrase families, label noise of the second look |
| 1.3 | export and parity on the shipped model: `python3 training/export_app.py --world diagram --model runs/diagram_step3_<commit>/model_<size> --bits 8 --status demo --note "<run, size, seed, commit>"`, then `bash training/parity/run_all.sh` pointed at it (app/READER.md) | frames and statuses identical, state cosine >= 0.9999, margins within 1e-4; 4 bits only if its parity passes on this model (on the smoke models 14 of 55 frames changed) |
| 1.4 | correctors on the trained reader: the typed and speech noise sets through `app/tests/correct_test.mjs` (classic and form), and the reader tie-break (spec 12.3) | typing rows; the form level becomes the default only if at least as good on both noise sets |
| 1.5 | `node app/build/build.mjs`, commit `app/model/` and `app/dist/` | the editor loads the demo model; the badge no longer says "development model" |

## 2. The other worlds

The order follows spec section 23.

Frozen data: every world's generated datasets are in `training/data/<world>/n<size>` (sha256 in `MANIFEST.json`); where a part below shows a `generate.py` line, use `python3 training/data/unpack.py <world>/n<size> <work dir>` instead, so that the DGX trains on exactly the committed sentences (the step-3 and textedit scripts already do).

### 2.1 The textedit world (spec section 14): what runs on the DGX

Prepared and checked on CPU (generator passes `sop check` at 20000 sentences; a smoke `sop train --D 128 --epochs 1` on 355 sentences,
`sop export-web` and `calibrate.py` ran end to end; smoke numbers are pipeline checks, not results). One script does everything, under
the repository's GPU lock (`logs/.run.lock`), refusing an unclean tree:

```
training/worlds/textedit/gpu_textedit.sh [--wait] [--sizes "1000 5000 20000 50000"] [--ship <size>]
```

What it runs, in order (output: `runs/textedit_<commit>/`, log `textedit.log`):

1. Data-size curve (spec 4.5), for n in 1000 5000 20000 50000:
   ```
   python3 training/worlds/textedit/generate.py --out $WORK/$n/textedit --n $n --n_eval 400 --seed 0
   tool/bin/sop check --legend $WORK/$n/textedit/legend.json $WORK/$n/textedit/examples/*.sop
   tool/bin/sop train $WORK/$n/textedit --D 1024 --seeds 5 --device cuda --n_eval 600 --log_every 500 --no_ckpt --star_version 2 \
       --calibrate_on_heldout_formulations --threshold_rule fit --run_dir runs/textedit_<commit>/$n
   ```
2. Prose negatives into the shipped world's `raw/` (never committed; the world is in a temporary folder):
   ```
   python3 training/worlds/textedit/prose_synth.py --out $W/raw --n 4000 --seed 0
   python3 training/worlds/textedit/prose_download.py --cache ~/.cache/vss-prose --out $W/raw --n 4000 --seed 0 --pin   # first run only
   ```
   The first run pins the sha256 of the six Project Gutenberg sources (gutenberg.org is not reachable from the development machine, so
   they could not be pinned there): commit `training/worlds/textedit/prose_sources.lock.json` (hashes only). Later runs verify and stop on
   a mismatch (exit 3).
3. At the shipped size (default the largest; `--ship` overrides once the curve says where FULL on held-out formulations stops improving
   within seed variance), five single-seed models, each calibrated:
   ```
   tool/bin/sop train $W <same flags> --seed $s --seeds 1 --out $W/model_seed$s --run_dir runs/textedit_<commit>/ship_seed$s   # s = 0..4
   python3 training/worlds/textedit/calibrate.py --world $W --model $W/model_seed$s --splits runs/.../ship_seed$s/splits.json \
       --out runs/.../ship_seed$s/command_threshold.json
   ```
   and writes `dictation_table.md` (mean +- sd over the five seeds).
4. Export for the browser (seed 0):
   ```
   tool/bin/sop export-web --model $W/model_seed0 --out app/model/textedit
   cp training/worlds/textedit/normalize.json app/model/textedit/; cp runs/.../ship_seed0/command_threshold.json app/model/textedit/
   ```

Rows of Table 13 to report (criteria written before the run):

| row | measure | criterion | where |
|---|---|---|---|
| Editing commands in dictation | FULL frame of textedit on held-out formulations; confident-wrong and coverage at tau | as for the diagram world: confident-wrong < 2% at coverage > 80%, FULL reported; seen formulations FULL >= 0.98 | `runs/textedit_<commit>/<n>/metrics.json`, REPORT.md (every size, 5 seeds) |
| Editing commands in dictation | commands inserted as text (text + chip) | <= 5% | `dictation_table.md` (held-out formulations report half, new identities) |
| Dictated prose, command threshold | content executed as a command, prose with editing words | <= 1% of utterances | `dictation_table.md` (synthetic and public-domain prose test halves, by category) |
| Text target resolution | scripted documents and commands | 100% pass | `node app/tests/text_targets.mjs` (CPU, already 100%: 413/413 checks, 70 commands) |

Commit afterwards: `runs/textedit_<commit>/`, `app/model/textedit/`, and the prose lock file if it was pinned. Never commit the prose
`.tsv` files or the downloaded books.

### 2.2 Segmentation, the SOP circuit, long scripts and the large-model author (spec sections 15 and 18): what runs once the diagram model exists

Built and tested on CPU without the reader: `app/src/segment/` (segmenter, circuit, order, conflicts, circuit view), `app/src/script/`
(sections, checkpoints, far references, document view), the evaluation sets `training/data/diagram/eval/paragraphs.jsonl` and
`scripts_{1,5,10}p.jsonl` (generated by `training/worlds/diagram/paragraphs.py` and `scripts.py`, seed 0, committed), and
`training/worlds/diagram/llm_author/`. With a fake reader that returns the gold frames every check passes (`node app/tests/segment.mjs`,
`node app/tests/script.mjs`); those numbers check the code, not the reader. Nothing here trains: everything below runs on the exported
diagram model, on CPU, after the diagram training and `sop export-web` of the main instructions (the export at `app/model/diagram/`).

Before the runs: commit the code (the logs carry the commit hash in their name); the evaluation sets are already committed (regenerate them only by a stated change, then commit them
before the run: `python3 training/worlds/diagram/paragraphs.py && python3 training/worlds/diagram/scripts.py`). Check that the export
is the trained model and not the smoke model: `app/model/diagram/manifest.json` has `"D": 1024` (the smoke export has 256) and the
legend SHA-256 of the trained world.

#### 1. Paragraphs and long sentences through the real reader (Table 13: "Segmentation of paragraphs and long sentences", "Circuit links")

```
node app/tests/segment.mjs --model app/model/diagram --strict 2>&1 | tee logs/segment_$(git rev-parse --short HEAD).log
```

Reports: cut accuracy (criterion >= 0.97) and the share of exactly segmented inputs; FULL per unit, by kind (paragraph, long sentence)
and length bucket (10-14, 15-19, 20-29, 30+ words), against the same units read alone (criterion: within 0.03); shared-entity and
discourse links, precision and recall (reported); execution order on the scripted paragraphs (criterion: 100%); cycles found; conflicts,
precision and recall. `--strict` makes a missed criterion exit 1. The FULL against length, whole and segmented, at D = 1024 and at
D = 4096 (spec 15.4, Table 10 row "Capacity"): run the same command on the D = 4096 export of the capacity run when it exists.

#### 2. Long scripts through the real reader (Table 13: "Long scripts: 1, 5, 10 pages")

```
node app/tests/script.mjs --model app/model/diagram --full 2>&1 | tee logs/scripts_$(git rev-parse --short HEAD).log
```

Reports per length: in-world units executed correctly (criterion >= 0.95 at 1 page; reported at 5 and 10), planted out-of-world units
marked and never executed (criterion 100%; "marked" is the out-of-world mark, an uncertain mark is counted separately), cross-section
references resolved with the rule (criterion >= 0.95), the final diagram against the gold one (components and connectors, precision and
recall), reading and planning time per page. `--full` executes every document; the editor re-routes all connectors after each change
(src/editor/router.js), which dominates the time of the 10-page documents (one process, no other heavy job beside it).

#### 3. The large model as the author (Table 13: "Large model as author"; protocol in training/worlds/diagram/llm_author/PROTOCOL.md)

Needs API keys, not the GPU: `ANTHROPIC_API_KEY` (and `OPENAI_API_KEY` / `GEMINI_API_KEY` for other providers, with their model ids on
the command line). Models of the first run: `anthropic:claude-opus-5-5`, `anthropic:claude-sonnet-5-5`, `anthropic:claude-haiku-5-5`,
`anthropic:claude-fable-5-1`, plus any other provider's models the author chooses (named in the log). Ten descriptions, one legend
(`legend_prompt.md`, its SHA-256 recorded), both variants:

```
python3 training/worlds/diagram/llm_author/run_author.py --dry_run --variants legend,slow --label dry      # check the requests first
python3 training/worlds/diagram/llm_author/run_author.py --models anthropic:claude-fable-5-1,anthropic:claude-opus-5-5,anthropic:claude-sonnet-5-5,anthropic:claude-haiku-5-5 \
    --variants legend,slow --label author_<date>
node app/tests/script.mjs --model app/model/diagram --authored training/data/diagram/llm_author/author_<date>/scripts.jsonl 2>&1 | tee logs/author_$(git rev-parse --short HEAD).log
```

Output: the comparison table (instruction following = units read clearly, executed of read, units lost by reason) and
`scripts.diagrams_as_text.json`. No criterion on the first run. The models' scripts are our own generated data only if the providers'
terms allow committing them; otherwise keep them out of git and commit the table and the log.

Still to write before the fidelity number (step 3 of the protocol): read the diagrams read back into text with the reader and compare
them with the script's executed frames by the `sop diff` port (`app/src/segment/circuit.js` `diffFrames`); the person's sample (3
descriptions per model) is done by hand.

#### 4. What changes if a learned part meets its criterion (spec Table 10)

The learned clause boundaries (a gate read as a cut) replace the connective list: pass the model's gates (the adapter does this when
the legend names `level_openers`) and rerun step 1. The learned reference across sentences replaces `rule:recent`: rerun steps 1 and 2
and report the links by source. The discourse operators in the legend: add then, but, so, because to `tool/sop/legend.py` OPERATOR_KEYS
(keys in app/src/segment/README.md) so that `sop check` validates the circuit files.

### 2.3 DGX: the matheditor world (spec section 16; Table 13 rows "Formulas")

Prepared on a CPU and smoke-tested at small size (smoke numbers are not results and do not go into STATUS). Everything below the
decoder extension is ready to run. Rules: AGENTS.md (criteria before runs, one change per run, commit before every run, every number
labelled and pointing to a run folder).

#### 0. What is ready, and what was checked on the CPU

- `training/worlds/matheditor/generate.py` writes the world (legend, kinds, five SOP files, split hints, the edit suite). At n = 20000:
  14000 formulas (1597 with two to four readings) + 6000 commands; 400 held-out formulations + 200 held-out commands; 400 at unseen
  depth 3; 400 new identities; 400 ambiguous; 410 edit-suite cases; 0 verbaliser rejections; `sop check` 5/5 OK (COVERAGE.md).
- `node app/tests/formula.mjs`: tree <-> LaTeX, parser readings, command frames, scripted edit suite 50/50 (Table 13: 100% pass).
- `evaluate.py trees` / `edits` score gold against gold at 1.000 (the chain itself), and `extract` cuts any split of a run.
- Smoke: `sop train <world> --D 128 --epochs 1 --seeds 1 --star_version 2 --device cpu` on 400 sentences ran to the end (the tool accepts
  the world; targets compile nested wires and `|` alternatives). FULL 0.000 on every split, and 0.000 for both lexical baselines: that is
  structural (point 1 below), not a training result.

#### 1. First: the decoder extension (tool/sop/infer.py, mirrored in app/src/vss/reader.js)

The current decoder reads `says* -> [not] -> event` with word / negated word / entity fillers. This world needs, in this order, each as
its own commit with its test:

- **E1. Nested events in roles.** For a role whose training fillers are event wires (shape `wire` in the schema), unbind
  `V = S (x) conj(R_role)` (minus the occupancy marker) and decode V as an event: its type by the predicate term
  (`op:pred (x) id(lemma)`) when an operator word is present, else by the fit over the event types' role sets (implicit "times" has no
  word); then its roles recursively, leaves by kinds (VAR, NUM, CONST, FUNC). Depth bound: the training maximum + 2. Every nested wire
  gets `_margin` / `_status` as top-level ones do. Test: on the gold targets (no route book), the decoder recovers every gold tree of
  `eval_unseen_depth.sop` from its compiled target state at D 1024 (the readout's own ceiling; report it).
- **E2. Whole-tree FULL.** `world.frame_of` represents a nested wire as `["wire", <type>]`, so FULL compares the top level only, and
  the REPORT line "Shapes the v1 decoder cannot read: none" is wrong for this world. Make the canonical frame recursive (the tree as
  the filler) and mark nested event fillers as a shape the decoder reads only after E1. Until then use `evaluate.py trees` (it scores
  whole trees from the SOP output).
- **E3. Alternatives.** When the root role reads two candidate trees whose margins are both above the presence threshold and within
  tau of each other, emit `root=$a | $b` with `_readings=2` instead of abstaining. Calibrate the rule on training rows only (rule 25).
- **E4. Browser parity** for E1-E3 (app/READER.md procedure): frames and statuses identical, state cosine >= 0.9999, margins within 1e-4.

Criteria for E1-E3 are the Table 13 rows below; the extension is accepted only through them. If E1's ceiling test shows the D 1024 state
does not carry depth 3, that is a finding to report (the reader "reports where it did not", spec 16.2), not a reason to change the world.

#### 2. Data (seed 0; the data-size curve as spec 4.5)

```
C=$(git rev-parse --short HEAD); R=runs/matheditor_$C; mkdir -p $R
for n in 5000 20000 50000; do
  python3 training/worlds/matheditor/generate.py --out $R/data_$n/matheditor --n $n --n_eval 400 --seed 0
  tool/bin/sop check --legend $R/data_$n/matheditor/legend.json $R/data_$n/matheditor/examples/*.sop | tail -1
  cp training/worlds/matheditor/COVERAGE.md $R/COVERAGE_n$n.md
done
```

#### 3. Training (GPU, 5 seeds, D 1024, portable stars)

Lock and memory guards as `training/gpu_diagram_step3.sh` (one run at a time on the GPU).
```
export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True VSA_MEM_FRACTION=0.5 VSA_MIN_AVAILABLE_GB=16 VSA_MAX_HOURS=6
for n in 5000 20000 50000; do
  tool/bin/sop train $R/data_$n/matheditor --D 1024 --seeds 5 --device cuda --n_eval 600 --log_every 500 --no_ckpt \
    --star_version 2 --calibrate_on_heldout_formulations --threshold_rule fit --run_dir $R/$n 2>&1 | tee $R/$n.train.log
done
cp -r $R/data_50000/matheditor/model $R/model_50000
```
The route book does not depend on the decoder: these runs can go before E1-E3; their evaluation (section 4) needs E1-E3.

#### 4. Evaluation of the Table 13 rows (after E1-E3; per seed and the mean over 5 seeds, rule 27)

For each size n, the model of each seed, and each split S in heldout_sentences (= seen formulations), heldout_formulations (the
REPORTED half), heldout_depth, ambiguous, new_identities:
```
W=$R/data_$n/matheditor; SP=$R/$n/splits.json          # the run's split file (seed folder as written by sop train)
python3 training/worlds/matheditor/evaluate.py extract $W $SP $S $R/$n/eval_$S
tool/bin/sop formalize --model <model of the seed> $R/$n/eval_$S.txt -o $R/$n/eval_$S.read.sop
python3 training/worlds/matheditor/evaluate.py trees $R/$n/eval_$S.sop $R/$n/eval_$S.read.sop --tau 0.05
tool/bin/sop formalize --model <model of the seed> $W/raw/edit_suite.txt -o $R/$n/edit_suite.read.sop
python3 training/worlds/matheditor/evaluate.py edits $W/raw/edit_suite.jsonl $R/$n/edit_suite.read.sop
```

| Table 13 row | measure (evaluate.py line) | split | criterion |
|---|---|---|---|
| Formulas: tree on seen | tree exactly right | heldout_sentences | >= 0.95 |
| Formulas: tree on held-out | confident-wrong (of all) and coverage at tau | heldout_formulations (reported half) | confident-wrong < 2% at coverage > 80%; tree exactly right reported |
| Formulas: unseen depth | tree exactly right | heldout_depth | > 0.90 |
| Formulas: ambiguity | reported as ambiguous; false "both" | ambiguous; false both on heldout_sentences, heldout_depth | >= 0.95 with no false both |
| Formulas: edits | edit suite correct (the reader's frame executed) | raw/edit_suite.jsonl | 100% (the scripted suite with the reference reader already passes: app/tests/formula.mjs) |
| new identities (as the diagram row) | tree exactly right | new_identities | >= 0.99 on the new variables and numbers |

Also report the data-size curve (tree exactly right on heldout_formulations at 5k / 20k / 50k) and choose the shipped size as spec 4.5.
Not in this part: the recorded set of dictated formulas (ten speakers, spec 16.5, Table 13 "Speech") and the paraphrases by a large
model (spec 16.5 as 4.2: needs the API; `training/worlds/diagram/paraphrase.py` is the pattern, a matheditor version is not written).

#### 5. Export to the browser

On the shipped size's best-documented seed (state which, and why):
```
tool/bin/sop export-web --model $R/model_50000 --out app/model/matheditor/
```
then the parity test of app/READER.md on matheditor sentences (needs E4). The app uses the model when `app/model/matheditor/` exists and
the reference parser otherwise (labelled on screen). Commit the run folder, then STATUS.md (one row per axis with the run folder) and a
JOURNAL entry.

### 2.4 Sketch and scene (spec section 17): what runs on the DGX, and what needs people

Prepared and checked on CPU: the sketch pad, the stroke recogniser and the rule-based scene pass (`app/src/sketch/`, test
`node app/tests/sketch.mjs`), the synthetic strokes (`training/worlds/scene/synth_strokes.py`), the scene world and the FPE
experiment (`training/worlds/scene/`). The recogniser has no training: nothing of it runs on the DGX.

#### 1. On the DGX: the positions-as-addresses experiment (spec 17.3, step 18 of spec section 23)

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

#### 2. With people: the hand-drawn test set (spec 17.5)

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

### 2.5 Animation (spec section 19): what runs on the DGX, and what needs people

Prepared and checked on CPU: the animation world (`training/worlds/animation/generate.py`, `sop check` OK at 30000 sentences, a CPU
smoke training at D 128 that runs to the end and exports), the reference semantics and the gold scripts
(`training/worlds/animation/semantics.py`, `animation_scripts.py` -> `training/data/animation/eval/`), and the browser side
(`app/src/animate/`, `node app/tests/animate.mjs`: timelines 60/60, corrections 56/56, planted violations 24/24, controls 12/12,
questions 277/277). The timeline, the invariants and the player have no training: only the READER of the animation world runs on the DGX.

#### 1. On the DGX: the reader of the animation world (Table 13, "Animation: temporal roles and relations")

Criteria, written before the run (spec 19.7 and Table 13): held-out formulations: confident-wrong < 2% at coverage > 80%, FULL reported;
reported beside it, with the same thresholds as the diagram world: seen formulations FULL (>= 0.98 in the diagram world), new identities
(labels and numbers never in training) per role, the temporal roles (start, tempo, ref, offset, trigger, duration, unit, per, speed,
easing, repeat) role by role, prohibitions (`not`) scope. The shipped size: the smallest after which the held-out formulation number stops
improving within seed variance (as spec 4.5 for the diagram world).

From the repository root, on a committed tree, under the repository's run lock (`logs/.run.lock`, one run at a time), the same guards and
options as `training/gpu_diagram_step3.sh` (copy it with `diagram` -> `animation`, or run the loop below):

```
COMMIT=$(git rev-parse --short HEAD); OUT=runs/animation_$COMMIT; WORK=$(mktemp -d)
COMMON="--D 1024 --seeds 5 --device cuda --n_eval 600 --log_every 500 --no_ckpt --star_version 2 --calibrate_on_heldout_formulations --threshold_rule fit"
for n in 1000 5000 20000 50000; do
  python3 training/worlds/animation/generate.py --out $WORK/$n/animation --n $n --n_eval 400 --seed 0
  tool/bin/sop check --legend $WORK/$n/animation/legend.json $WORK/$n/animation/examples/*.sop | tail -1
  tool/bin/sop train $WORK/$n/animation $COMMON --run_dir $OUT/$n 2>&1 | grep "\[eval\]\|\[done\]\|end:\|\[splits\]\|\[schema\]" | tee -a $OUT/animation.log
  cp $WORK/$n/animation/legend.json $WORK/$n/animation/kinds.tsv $OUT/$n/
done
cp -r $WORK/50000/animation/model $OUT/model_50000            # or the shipped size, by the rule above
```

Seeds: `--seeds 5` (five seeds, star seed varied per the tool's default); generator seed 0 (the held-out formulations are fixed by it:
8733 of 78690 combinations). Rows of Table 13 to fill from `$OUT/<n>/metrics.json` and REPORT.md: "Animation: temporal roles and
relations" (held-out formulations: confident-wrong and coverage at tau; FULL); report the seen and new-identity rows beside it, and the
size curve.

#### 2. Export to the browser, parity, end to end

```
tool/bin/sop export-web --model $OUT/model_<size> --out app/model/animation --bits 8
cp training/worlds/animation/normalize.json app/model/animation/normalize.json      # this world's normalizer table (not the diagram one)
python3 training/parity/make_golden.py --model $OUT/model_<size> --world $WORK/<size>/animation --out training/parity/out/golden-animation-8.json --dequantize-from app/model/animation
node app/tests/parity.mjs app/model/animation training/parity/out/golden-animation-8.json      # Table 13, JavaScript and Python parity
node app/tests/animate.mjs training/data/animation/eval --reader app/model/animation           # end to end: the scripts read by the model
```
The last line reports the frames read equal to the gold frames, and the timelines, corrections and planted violations that still pass when
the sentences are read instead of given (report only; the reader's criterion is the held-out row above). Commit `app/model/animation/`,
`$OUT/` (without per-seed models) and the parity golden.

The large-model paraphrases of spec 4.2 (19.7: "a large model paraphrases as in Section 4.2") use `training/worlds/diagram/paraphrase.py`
with the animation legend once an API key is available; that step is not GPU work and is not prepared here.

#### 3. With people: the dictated scripts (Table 13, "Animation: dictated scripts", reported)

- **People**: ten adults, not the developers, a mix of native and non-native English speakers, at least three who have never used the
  editor. Each person gets the same three given diagrams (a request path user -> gateway -> API -> database; a five-step flowchart with a
  decision; a scene with the robot and two components) and, for each, a one-paragraph description of the intended film in plain words
  (what happens, in which order, roughly how long), shown as text and as a reference video made by the developers.
- **Task**: the person dictates (by voice, and once by typing) an animation script for each diagram in their own words, then makes up to
  three corrections after watching the result ("slower on the way back", "make the gateway blink when the request arrives"). Nothing is
  coached beyond the About panel's list of actions and motions.
- **Recorded**: the text (typed or recognised), the readings, the timeline JSON export, the corrections, the final film as the animated
  SVG export; no audio kept after recognition unless the person agrees separately; no name stored with the data (participant id P01 ...
  P10). A short written consent before the session, as for the hand-drawn set of spec 17.5 (purpose, what is kept, publication inside the
  repository, withdrawal until publication).
- **Judging**: two judges who did not run the sessions compare a sample (at least 30 films, every person represented) with the intended
  films on a stated three-level scale (as intended / minor differences / wrong), each judge alone, then the agreement (Cohen's kappa) and
  the disagreements are reported with the cases. The numbers are reported, with the unread or misread sentences listed by cause (out of
  the legend, reader error, segmentation, timeline rule).

### 2.6 Other languages: Romanian, mixed and dictionaries

Design: `vision/ADDENDUM_languages_2026-10-25.md`. Three variants, one English legend (sha256 `e3e44ee9f7e8...`, the same file for
diagram, diagram_ro and diagram_multi): A = `diagram_ro` (a world trained on Romanian sentences), B = `diagram_multi` (one world trained on
English 0.4, Romanian 0.4 and mixed 0.2), C = the dictionary `training/worlds/diagram_ro/translate_en.json` before the English reader of
step 1.1 (no training). Generator, lexicon and what is not covered: `training/worlds/diagram_ro/README.md`. Frozen data:
`training/data/diagram_ro/n{1000,5000,20000,50000}`, `training/data/diagram_multi/n{1000,5000,20000,50000}` (seed 0; each with
`eval_parallel.jsonl`, the same 400 frames in four realisations). Prepared and checked on the CPU, not results: `sop check` OK on every
file; a smoke training of diagram_ro (D 128, 1 epoch, 364 sentences) runs to the end, exports, and passes the parity chain (55/55 frames,
statuses and SOP text identical, cosine 1.000000); the dictionary port of `eval_variants.py` gives the same variants as
`app/src/translate.js` on 1200/1200 parallel sentences.

#### 1. Criteria, written before the runs

| row | measure | criterion |
|---|---|---|
| Table 13 rows for diagram_ro | the rows of 1.1 on diagram_ro's own splits: seen formulations FULL; held-out formulations (confident-wrong at tau, coverage, FULL); new labels (label role); value slots (amount, unit, fraction, anchor); negated attributes and prohibitions (scope) | the thresholds of 1.1 (>= 0.98; < 2% at > 80%; >= 0.99; >= 0.98; >= 0.97) |
| the same rows for diagram_multi | per language: Romanian splits (`heldout_formulations`, `new_identities`) and English splits (`heldout_formulations_en`, `new_identities_en`) | reported; the English rows beside the English world's of 1.1 (does Romanian in training cost English?) |
| mixed eval (`eval_mixed.sop`, split `mixed`) | FULL, for A and B | reported (A never saw a mixed sentence in training; B did) |
| parallel check | share of the 400 frames of `eval_parallel.jsonl` whose frame read by the English reader on the English realisation is identical to the frame read by A on the Romanian realisation (and B on both) | reported; >= 0.95 at the shipped size to call the demo multilingual |
| variants compared | FULL on eval_parallel's Romanian, mixed and Romglish realisations for A, B and C (C = dictionary + the English model of 1.1) | reported; the comparison is the finding |
| dispatch by fit over all routes | every route (A, B, C) reads each realisation, the clearest reading wins (app rule: status, then the minimum margin, then the residual); share routed to a route that reads it right, FULL after the choice, and the oracle (some route reads it right) | reported; >= 0.98 routed right on clean in-world sentences (the addendum's row) |

Per seed and the mean and spread over five seeds (rule 27). FULL compares the frame with the predicate lemma (sop world.canon); in the
parallel set 'every' is written 'each' in English (Romanian 'fiecare' is both) and the determiner 'an' counts as 'a'.

#### 2. Training (GPU, five seeds, D 1024, portable stars, frozen data)

From the repository root, on a committed tree, under the run lock (`logs/.run.lock`), the guards and options of
`training/gpu_diagram_step3.sh` (copy it with `diagram` -> `diagram_ro` / `diagram_multi`, or run the loop):

```
COMMIT=$(git rev-parse --short HEAD); WORK=$(mktemp -d)
# no --no_ckpt here: sop train then keeps every seed's model ($OUT/<n>/seed<k>/model; seed 0 in model/), which section 3 reads per seed
COMMON="--D 1024 --seeds 5 --device cuda --n_eval 600 --log_every 500 --star_version 2 --calibrate_on_heldout_formulations --threshold_rule fit"
for w in diagram_ro diagram_multi; do
  OUT=runs/${w}_$COMMIT; mkdir -p $OUT
  for n in 1000 5000 20000 50000; do
    python3 training/data/unpack.py $w/n$n $WORK/$n | tee -a $OUT/$w.log                          # sha256 checked against MANIFEST.json
    tool/bin/sop check --legend $WORK/$n/$w/legend.json $WORK/$n/$w/examples/*.sop | tail -1 | tee -a $OUT/$w.log
    tool/bin/sop train $WORK/$n/$w $COMMON --run_dir $OUT/$n 2>&1 | grep "\[eval\]\|\[done\]\|end:\|numpy reader\|\[splits\]\|\[schema\]" | tee -a $OUT/$w.log
    cp $WORK/$n/$w/legend.json $WORK/$n/$w/kinds.tsv $OUT/$n/; cp training/data/$w/n$n/COVERAGE.md $OUT/COVERAGE_n$n.md
    cp -r $WORK/$n/$w/model $OUT/model_$n                                                         # every size: the variant comparison runs per size
  done
done
```

Exit check: the legend sha256 in every `$OUT/<n>/config.json` equals the English world's (`runs/diagram_step3_<commit>/<n>/config.json`).
Fill the Table 13 rows of 1. from `$OUT/<n>/metrics.json` and REPORT.md, per seed and size; the shipped size of each world by the rule of
1.1 (the smallest after which the held-out formulation row stops improving within seed variance).

#### 3. The parallel check, the variants and the dispatch (after 2. and step 1.1; CPU is enough)

For each size n and each seed k of A and B (seed 0: `model_$n`; the others: `$OUT/$n/seed<k>/model`), with the English model of 1.1 at the
same n (1.1 runs with `--no_ckpt`, which keeps the first seed's model only: EN and C use that one model for every seed of A and B, stated in
the report):

```
python3 training/data/unpack.py diagram_ro/n$n $WORK/par$n                                       # eval_parallel.jsonl (the same 400 frames at every n)
python3 training/worlds/diagram_ro/eval_variants.py --parallel $WORK/par$n/diagram_ro/examples/eval_parallel.jsonl \
  --en_model runs/diagram_step3_<commit>/model_$n --ro_model runs/diagram_ro_$COMMIT/model_$n --multi_model runs/diagram_multi_$COMMIT/model_$n \
  --dict training/worlds/diagram_ro/translate_en.json --out runs/diagram_ro_$COMMIT/variants_n$n.json | tee runs/diagram_ro_$COMMIT/variants_n$n.log
```

It prints and writes, per variant and realisation (A/ro, A/mix, A/romglish, B/en, B/ro, B/mix, B/romglish, C/ro, C/mix, C/romglish,
EN/en): FULL, FULL with status ok and the status counts; the parallel check (A(ro) = EN(en), B(ro) = B(en)); the dispatch per realisation
(FULL after the choice, the oracle, which route was chosen). Report the table of variants x realisations at every size, mean and spread
over seeds, with the parallel check at the shipped size against its 0.95 criterion. C needs no training: its row is the English model of
1.1 read through the dictionary. Commit the `variants_n*.json` / `.log` files with the run folders.

#### 4. Export to the browser (the coordinator's export_app.py)

```
python3 training/export_app.py --world diagram_ro --model runs/diagram_ro_$COMMIT/model_<size> --purpose diagram --language ro --bits 8 --status demo --note "<run, size, seed, commit>"
python3 training/export_app.py --world diagram_multi --model runs/diagram_multi_$COMMIT/model_<size> --purpose diagram --language en+ro --bits 8 --status demo --note "<run, size, seed, commit>"
python3 training/export_app.py --dict training/worlds/diagram_ro/translate_en.json --language ro --target diagram --note "given dictionary, built from lexicon_ro.py"
```

Each world ships its own normalizer table (`training/worlds/diagram_ro/normalize.json`, also for diagram_multi: it contains the English
table unchanged; NORMALIZERS in export_app.py, or `--normalizer`). Then the parity chain on each exported model (as 1.3:
`training/parity/make_golden.py --model <model> --world $WORK/<size>/<world> --dequantize-from app/model/<world>` and
`node app/tests/parity.mjs`; criteria: frames and statuses identical, cosine >= 0.9999, SOP text identical), the normalizer parity
(`node app/tests/normalize_test.mjs training/worlds/diagram_ro/normalize_golden.jsonl training/worlds/diagram_ro/normalize.json`), and
`node app/tests/routes.mjs` with the three routes installed. Size: the route book has three K x K x D tables; diagram_ro has 59 route-book
kinds (with `unknown`) against the English world's 49, so its route book is about 1.45 times the English one at the same D and bits.

## 3. What needs people, not the DGX

- The recorded speech set (spec 13.5): at least ten speakers, non-native speakers included, two microphones, with consent; commands
  with gold frames; used only for evaluation.
- The hand-drawn sketch set (spec 17.5) and the dictated animation scripts (19.7): protocols in the parts above.

## 4. The comparison with BERT

In the separate repository vss-vs-bert: RUNBOOK.md there, runs 0 to 7 and the real-data round.
