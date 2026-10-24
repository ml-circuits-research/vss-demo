# DGX: the matheditor world (spec section 16; Table 13 rows "Formulas")

Prepared on a CPU and smoke-tested at small size (smoke numbers are not results and do not go into STATUS). Everything below the
decoder extension is ready to run. Rules: AGENTS.md (criteria before runs, one change per run, commit before every run, every number
labelled and pointing to a run folder).

## 0. What is ready, and what was checked on the CPU

- `training/worlds/matheditor/generate.py` writes the world (legend, kinds, five SOP files, split hints, the edit suite). At n = 20000:
  14000 formulas (1597 with two to four readings) + 6000 commands; 400 held-out formulations + 200 held-out commands; 400 at unseen
  depth 3; 400 new identities; 400 ambiguous; 410 edit-suite cases; 0 verbaliser rejections; `sop check` 5/5 OK (COVERAGE.md).
- `node app/tests/formula.mjs`: tree <-> LaTeX, parser readings, command frames, scripted edit suite 50/50 (Table 13: 100% pass).
- `evaluate.py trees` / `edits` score gold against gold at 1.000 (the chain itself), and `extract` cuts any split of a run.
- Smoke: `sop train <world> --D 128 --epochs 1 --seeds 1 --star_version 2 --device cpu` on 400 sentences ran to the end (the tool accepts
  the world; targets compile nested wires and `|` alternatives). FULL 0.000 on every split, and 0.000 for both lexical baselines: that is
  structural (point 1 below), not a training result.

## 1. First: the decoder extension (tool/sop/infer.py, mirrored in app/src/vss/reader.js)

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

## 2. Data (seed 0; the data-size curve as spec 4.5)

```
C=$(git rev-parse --short HEAD); R=runs/matheditor_$C; mkdir -p $R
for n in 5000 20000 50000; do
  python3 training/worlds/matheditor/generate.py --out $R/data_$n/matheditor --n $n --n_eval 400 --seed 0
  tool/bin/sop check --legend $R/data_$n/matheditor/legend.json $R/data_$n/matheditor/examples/*.sop | tail -1
  cp training/worlds/matheditor/COVERAGE.md $R/COVERAGE_n$n.md
done
```

## 3. Training (GPU, 5 seeds, D 1024, portable stars)

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

## 4. Evaluation of the Table 13 rows (after E1-E3; per seed and the mean over 5 seeds, rule 27)

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

## 5. Export to the browser

On the shipped size's best-documented seed (state which, and why):
```
tool/bin/sop export-web --model $R/model_50000 --out app/model/matheditor/
```
then the parity test of app/READER.md on matheditor sentences (needs E4). The app uses the model when `app/model/matheditor/` exists and
the reference parser otherwise (labelled on screen). Commit the run folder, then STATUS.md (one row per axis with the run folder) and a
JOURNAL entry.
