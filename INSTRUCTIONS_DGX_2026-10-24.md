# Instructions for the DGX session — VSS Diagram Editor, steps 1 to 5 (2026-10-24)

From the reviewing session. The specification is `vision/VSS_Diagram_Editor_Specification.md` (version 2.6); its section 23 is the order
of work and its Table 13 the criteria, written before any run. These instructions cover what needs the DGX (training, the full-size data)
and the checks that close each step. Everything that could be prepared on a CPU has been prepared and smoke-tested at small size (STATUS.md
says what); smoke numbers are not results and do not go into STATUS.

Rules: AGENTS.md. One change per run; criteria before runs; every number labelled and pointing to a run folder or a log; no duration
estimates. Commit before every run (the runner refuses an unclean tree); push at the judgment points.

## 0. Environment

```
git clone git@github.com:ml-circuits-research/vss-demo.git && cd vss-demo
python3 -m venv .venv && . .venv/bin/activate && pip install torch numpy        # the paper repository's versions on the DGX
node --version                                                                   # >= 18, for the web tests
tool/bin/sop --help                                                              # uses .venv when present
```

## Step 1 — the diagram world at Level 1 (exit: sop check passes; the coverage table)

```
python3 training/worlds/diagram/generate.py --out tool/worlds/diagram --n 50000 --n_eval 400 --seed 0
tool/bin/sop check --legend tool/worlds/diagram/legend.json tool/worlds/diagram/examples/*.sop
python3 training/worlds/diagram/normalize_golden.py > /tmp/ngold.jsonl && node app/tests/normalize_test.mjs /tmp/ngold.jsonl
git add training/worlds/diagram/COVERAGE.md && git commit -m "step 1: coverage of the diagram world at 50k (generate.py seed 0)"
```
Read COVERAGE.md: every event has sentences, every role of Table 3 that Level 1 uses is filled for the events that take it, prohibitions
occur for every prohibitable event. A gap is fixed in generate.py (one commit) before step 3. Exit check written in STATUS.md.

## Step 2 — portable stars (exit: identical phases)

`node app/tests/stars_test.mjs` (see app/READER.md for the golden file it reads). Exit: every phase identical within 1e-6.

## Step 3 — training on templates, five seeds, the data-size curve (GPU)

```
training/gpu_diagram_step3.sh            # sizes 1000 5000 20000 50000; --wait to queue behind another run
```
The script generates the world at each size, checks it, trains `--D 1024 --seeds 5 --star_version 2 --calibrate_on_heldout_formulations
--threshold_rule fit`, and writes `runs/diagram_step3_<commit>/<size>/` (metrics.json, REPORT.md, splits.json, train.log) and the
largest size's model to `runs/diagram_step3_<commit>/model_<size>/`. Commit the run folder.

Criteria (spec Table 13, written before the run), judged on the mean over the five seeds with the per-seed list (rule 27):

| axis | measure | criterion |
|---|---|---|
| seen formulations | FULL frame | >= 0.98 |
| held-out formulations | confident-wrong and coverage at tau; FULL | confident-wrong < 2% at coverage > 80%; FULL reported |
| new identities (labels, numbers) | role accuracy on the new fillers | >= 0.99 |
| value slots (amount, unit, fraction, anchor) | slot accuracy | >= 0.98 |
| negated attributes and prohibitions | scope accuracy | >= 0.97 |
| data size | held-out formulation FULL at 1k / 5k / 20k / 50k | the shipped size = the smallest after which it stops improving within seed variance |

Write RESULTS-style sections in STATUS.md (one row per axis, the label, the run folder), and a JOURNAL entry. A missed criterion is a
finding: report the number, the per-seed list and, where one can be located, the cause (per role, per template family: REPORT.md has the
per-split tables). Do not change the world and re-run in the same step; a fix is a new commit and a new run with its reason.

## Step 4 — paraphrases by a large model, second look, retraining (needs API credentials on the DGX)

```
python3 training/worlds/diagram/paraphrase.py tool/worlds/diagram --n 2000 --families typed_casual,spoken,terse,polite_long --heldout_families terse
tool/bin/sop check --legend tool/worlds/diagram/legend.json tool/worlds/diagram/examples/*.sop
python3 tool/skills/train-world/scripts/loop.py second-look tool/worlds/diagram      # the reader of step 3 re-reads the paraphrases
```
`paraphrase.py --dry_run` tests the format without the API. Rewrites that drop or change a filler are rejected and counted (they would
change the frame). The held-out family (`terse`) measures language the reader has not seen. Retrain with the step 3 command at the
shipped size on templates plus the training families (one run), and report the held-out formulation rows for both the template
held-out set and the paraphrase held-out family, and the label noise of the second look.

## Step 5 — export and the JavaScript reader (exit: parity)

On the step 3 (or step 4) model, follow app/READER.md: `tool/bin/sop export-web --model <model dir> --out app/model/`, then the parity
test (golden file from Python on the dequantized model, node comparison). Exit (spec Table 13): frames and statuses identical on every
golden sentence, state cosine >= 0.9999, margins and presence ratios within 1e-4. Report the model size on disk (8-bit and 4-bit) and the
median and p95 reading time per sentence in node and in a headless browser on a stated machine.

Notes from the CPU preparation (smoke models only, not results):
- train the step 3 model with `--star_version 2` (portable stars); a v1 model cannot read new words in the browser.
- `bash training/parity/run_all.sh` runs the whole step 5 chain (export at 8, 4 and 32 bits, golden files, parity, new-word sentences, bench);
  point it at the real model as described in app/READER.md.
- on the smoke models the 4-bit export changed 14 of 55 frames, so the 4-bit parity must be measured on the real model before 4 bits
  is shipped; 8 bits passed on every smoke model.

## After step 5

Steps 6 onwards (diagram library choice, planner, layout, correctors' full evaluation with the recorded speech set, interface, text,
segmentation, formulas, sketch, long scripts, animation) are browser and CPU work in the order of spec section 23; the correctors and the
normalizer are already prepared (app/src/CORRECTORS.md). The Level 2 decoder extensions (nested references, two attributes, `and`, `if`) are
each one change with its criterion (spec Table 5), run on the DGX like step 3.
