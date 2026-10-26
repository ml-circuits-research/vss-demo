# STATUS — VSS Diagram Editor (labels BUILT / MEASURED / PLANNED; every number points to a log or a test)

The axes and criteria are those of the specification, Table 13 (vision/VSS_Diagram_Editor_Specification.md, section 21); the order of
work is its section 23; what remains for the DGX is `training/TODO_DGX.md`. BUILT = code and a test exist. Numbers from tests with
hand-written frames, fake readers or synthetic sets test the CODE; they are listed as such and are not results of the demo. No row
below comes from a trained demo model: none exists yet (the installed model is a CPU development model, labelled so in the app).

| step (spec 23) | content | label | test / file | what the test shows (code, not reader) |
|---|---|---|---|---|
| 1 | diagram world, Level 1; frozen data n1000-n50000 | BUILT | training/data/diagram, MANIFEST.json | sop check passes |
| 2 | portable stars, Python and JavaScript | BUILT | app/tests/stars_test.mjs | identical phases |
| 3 | training on templates, five seeds, data-size curve | PLANNED (DGX) | training/gpu_diagram_step3.sh | |
| 4 | paraphrases, second look, retraining | PLANNED (DGX + LLM API) | training/worlds/diagram/paraphrase.py | |
| 5 | export, vss.js, parity | BUILT; parity on smoke models only | training/parity/run_all.sh | frames identical, cosine 1.000000 |
| 6 | diagram library | DECIDED: own SVG engine, no library (app/src/editor/README.md); maxGraph prototype optional | | |
| 7 | planner, solver, placement, locks | BUILT | app/tests/scenarios.mjs | 20/20 |
| 8 | layouts and router | BUILT | app/tests/layout.mjs, engine.mjs | 100/100 on 23 diagrams (0 overlaps, 0 crossings); 71/71 |
| 9 | typed corrector, form level | BUILT | app/tests/correct_test.mjs, dialog.mjs | smoke: classic typed 0.970, form level typed 0.795; speech 0.600 / 0.615 (classic stays default) |
| 10 | voice: Web Speech API, speech corrector, alternatives | BUILT (on-device engine and recorded set PLANNED) | app/src/speech.js | |
| 11 | interface, panels, dialog | BUILT | app/tests/browser_check.mjs | 124/124 in Chromium (Playwright 1.49.1, DGX, f748ddc), file:// and hosted, desktop and phone; the dialog asks undecided pairs (dialog.mjs 15/15) |
| 12 | text widgets, dictation, textedit world | BUILT; training PLANNED (DGX) | app/tests/text_targets.mjs, dictation.mjs | 413/413, 51/51 |
| 13 | segmenter, circuit, paragraphs | BUILT; reader rows PLANNED | app/tests/segment.mjs | 47/47 with fake readers |
| 14 | Level 2 decoder extensions | PLANNED (DGX) | training/TODO_DGX.md | |
| 15 | VSS improvements of 15.5 | PLANNED | | |
| 16 | formula widgets, matheditor world | BUILT; decoder extension E1-E4 and training PLANNED | app/tests/formula.mjs | 1376/1376, edit suite 50/50 |
| 17 | sketch pad, recogniser, scene pass | BUILT; hand-drawn set PLANNED (people) | app/tests/sketch.mjs | synthetic test split: symbols 0.983, connectors 0.963 (criterion 0.97 MISSED), containment 0.992, planted unknowns 12/13 (MISSED) |
| 18 | positions as addresses (FPE) | PREPARED; run PLANNED (DGX) | training/worlds/scene/experiment_fpe.py | |
| 19 | long scripts | BUILT; reader rows PLANNED | app/tests/script.mjs | 41/41 with fake readers (--full) |
| 20 | large model as author | PREPARED (needs API keys) | training/worlds/diagram/llm_author/ | |
| 21 | animation | BUILT; animation world training PLANNED | app/tests/animate.mjs | timelines 60/60, corrections 56/56, violations 24/24, questions 277/277 |
| 22 | optional slow path | PLANNED | | |
| addendum | other languages: Romanian world, bilingual world, dictionary route, automatic choice (vision/ADDENDUM_languages_2026-10-25.md) | BUILT; training PLANNED (DGX, TODO 2.6) | app/tests/translate.mjs, routes.mjs; training/worlds/diagram_ro/eval_variants.py | 7/7, 7/7; lemma identity parity 55/55 (smoke); gold frames identical English vs Romanian on 400 parallel rows |

Deviations from the specification, each recorded in the module's README: own SVG engine instead of maxGraph (single-file offline build);
own rich-text model instead of ProseMirror; MathML Core instead of KaTeX / MathLive; own $P recogniser instead of $Q; textedit "make" /
"turn" as format verbs; animation relations between units left to the circuit, paths of at most two hops per sentence; the matheditor
operator words declared in `tree_levels`, not `level_openers`; the discourse operators then / but / so / because added to the legend.

Runs of 2026-10-26 on the DGX (TODO 2.12, written before the runs): diagram, animation and textedit are trained with `--activate auto` and
the contract decoder, the three worlds at once on the one GPU (per-world locks `logs/.run.lock.<world>`; `gpu_diagram_step3.sh --world W
--jobs N` trains up to N sizes at once), so wall-clock times of these runs are not comparable with single runs. No export until
questions.md Q1 is answered (textedit `--no_export`). diagram_ro and diagram_multi wait for Q2 (their need signal is measured on a third
of the heads); matheditor waits for the decoder extension E1-E4. Against the expectation written in TODO 2.12, `vorder`'s need signal
fires on diagram (16.8%), diagram_multi, textedit and animation (`logs/profile_92d12f9_demo_worlds.md`); the acceptance test decides.

SUPERSEDED (decoder before D1 / D5), kept as started: `runs/diagram_step3_1c9c7fc/`, `runs/animation_step3_1c9c7fc/`, `runs/textedit_1c9c7fc/`
(launch logs `logs/launch_*_1c9c7fc.out`). Started 09:56 at 1c9c7fc, stopped about 11:05 before any size finished, because the decoder
gave an attribute with no candidate (`attr=None`, D1) and a role with no candidate (`["word", None]`, D5); restarted once on feaf554
(the reader.js mirror of both fixes; full parity suite PASS), together with diagram_ro and diagram_multi (their need signal measured after
D2: `logs/profile_e27ac5d_demo_worlds_after_D2.md`). Parallel across worlds and with the vss-vs-bert runs (responses D6), nice +10.
diagram_ro and diagram_multi run with `training/gpu_step3.sh --keep_seed_models` (TODO 2.6: no `--no_ckpt`, every seed's model kept; a
first launch at 6df62b0 with `--no_ckpt` was stopped after one minute and deleted). `gpu_step3.sh` is `gpu_diagram_step3.sh` plus that
option and a copy of every size's model (2.6 section 3 needs `model_<n>` of the English world at each n); `gpu_diagram_step3.sh` stays
unchanged while the diagram and animation runs read it, and their per-size models are copied by hand from the run's work folder
(`/tmp/<world>_step3_*/<n>/<world>/model`) when each size ends.
