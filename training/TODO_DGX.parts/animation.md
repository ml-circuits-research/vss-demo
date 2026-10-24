## Animation (spec section 19): what runs on the DGX, and what needs people

Prepared and checked on CPU: the animation world (`training/worlds/animation/generate.py`, `sop check` OK at 30000 sentences, a CPU
smoke training at D 128 that runs to the end and exports), the reference semantics and the gold scripts
(`training/worlds/animation/semantics.py`, `animation_scripts.py` -> `training/data/animation/eval/`), and the browser side
(`app/src/animate/`, `node app/tests/animate.mjs`: timelines 60/60, corrections 56/56, planted violations 24/24, controls 12/12,
questions 277/277). The timeline, the invariants and the player have no training: only the READER of the animation world runs on the DGX.

### 1. On the DGX: the reader of the animation world (Table 13, "Animation: temporal roles and relations")

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

### 2. Export to the browser, parity, end to end

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

### 3. With people: the dictated scripts (Table 13, "Animation: dictated scripts", reported)

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
