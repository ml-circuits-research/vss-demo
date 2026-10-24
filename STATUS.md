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
| 11 | interface, panels, dialog | BUILT | app/tests/browser_check.mjs | 116/116 in Chromium, file:// and hosted, desktop and phone |
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

Deviations from the specification, each recorded in the module's README: own SVG engine instead of maxGraph (single-file offline build);
own rich-text model instead of ProseMirror; MathML Core instead of KaTeX / MathLive; own $P recogniser instead of $Q; textedit "make" /
"turn" as format verbs; animation relations between units left to the circuit, paths of at most two hops per sentence; the matheditor
operator words declared in `tree_levels`, not `level_openers`; the discourse operators then / but / so / because added to the legend.
