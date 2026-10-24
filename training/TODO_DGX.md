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

Each part below was written with its world (training/TODO_DGX.parts/); the order follows spec section 23.

<!--PARTS-->

## 3. What needs people, not the DGX

- The recorded speech set (spec 13.5): at least ten speakers, non-native speakers included, two microphones, with consent; commands
  with gold frames; used only for evaluation.
- The hand-drawn sketch set (spec 17.5) and the dictated animation scripts (19.7): protocols in the parts above.

## 4. The comparison with BERT

In the separate repository vss-vs-bert: RUNBOOK.md there, runs 0 to 7 and the real-data round.
