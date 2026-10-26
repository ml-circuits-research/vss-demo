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
| 11 | interface, panels, dialog | BUILT | app/tests/browser_check.mjs, entries.mjs | tabs interface (vision/UI_tabs_requirements_2026-10-26.md) and the sketch tab of D12: browser check 216/216 (bbd0c8c) in Chromium (Playwright 1.49.1, DGX, da0bda6), file:// and hosted, desktop and phone; entries.mjs 28/28; dialog asks undecided pairs (dialog.mjs 15/15) and consumes queries (queries.mjs 14/14) |
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
of the heads); matheditor waits for the decoder extension E1-E4. [Superseded by the paragraphs below: Q1 / Q2 answered (D1, D2, D5),
the runs restarted at 6df62b0 / 7ad2f48.] Against the expectation written in TODO 2.12, `vorder`'s need signal
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

Code of the running 2.12 runs: sizes 1000 and 5000 imported tool/sop at 6df62b0 / 7ad2f48; the sizes 20000 and 50000 start later from the
same working tree, which since 12:2x carries a9fa51d (vss-vs-bert 7ce5c50, the structure anchor). For these five worlds the change does
nothing: each has core roles ([object]; textedit [unit]) and a predicate role, and the new code only differs when a world has neither;
the schema gains the key `structure_anchor`. Stated here so that a row of a large size is not read as a different decoder. From now on
the runs' tree is not pulled into while a run is going (a sync of tool/sop waits, or the run uses its own worktree).

Interface (questions Q6, responses D10; the owner's decision, deviation from spec section 11 recorded before the change): an examples
paperclip next to the microphone; tabs by default with the diagram editor as one tab, a history tab, an understood-actions tab (Table 8:
sentence, status, behaviour, rule) and a "Requests" tab (D9 / D10: how a request is read, not an agent). Kept from section 11 (D10):
the live side panel (frame with margins, plan, geometry) stays visible next to any tab on desktop, and the canvas of the active purpose
stays visible while the person types (history / actions replace it only on a click). BUILT (c253065..da0bda6, a Sonnet agent of the DGX
session in its own worktree, merged by fast-forward): main tabs Diagram / History / Actions / Assistant / Widget / Timeline / Circuit /
SOP / Log, the live panel as a side column on desktop (tabs on a phone), count badges, the examples paperclip (app/src/examples.js), call
text in the Assistant tab (app/src/ui/entries.js). Decided by the agent and kept: example entries filtered per entry by world, the
automatic switch to the Widget tab on writing removed (D10 condition 2), a click on the empty-canvas hint still runs it.

SUPERSEDED (CPU oversubscription), kept: `runs/{diagram,animation}_step3_6df62b0/`, `runs/textedit_6df62b0/`,
`runs/{diagram_ro,diagram_multi}_step3_7ad2f48/`. Stopped at 12:37 before any size finished: ten `sop train` processes without a thread
limit (24-43 threads each) gave a load of about 132 on 20 cores with the GPU at 0%; a seed's training took 24-400 s but the numpy-reader
evaluation crawled (diagram n1000 at seed 2 of 5 after 1 h 54). Their activation decisions (in their train.log) are kept as a record, not
as results. Restarted at the current commit with `OMP_NUM_THREADS=MKL_NUM_THREADS=OPENBLAS_NUM_THREADS=2` per process (10 processes x 2
threads = the 20 cores), all five worlds through `training/gpu_step3.sh` (every size's model copied; `--keep_seed_models` for diagram_ro
and diagram_multi) and textedit through its own script; every size now runs on one code version (tool/sop at a9fa51d).
A second tool/sop sync (543c9d5, vss-vs-bert 82585ea, R81: negative examples marked `_negative=true` in training) entered the runs'
working tree at about 13:15 with a pull of the interface merge, against the rule written above (the check printed it and did not stop
the pull). Sizes started before (all 1000 / 5000, diagram 20000) imported train.py without it, later sizes with it. For the demo worlds
it changes nothing: none of their frozen examples carries `_negative` (checked: 0 files), so the targets, the calibration rows (the same
draw over the same rows) and the schema are identical. The pull is now guarded by a check that stops it.

Step 18, the FPE scene reader (responses D11 item 1), declared before the run: `training/worlds/scene/experiment_fpe.py` as TODO 2.4.1
(D 1024 and 4096, seeds 0-4, n_dev 100, n_heldout 400, kernels gaussian / sinc, L 16-96, capacity 4-128, separability sweep), `--xp cupy`
on the GPU (cupy 14.2.0 in .venv; on the smoke set cupy and numpy give identical numbers). Criterion as written in the script before any
run: C1 heldout left_of, above, inside, nearest endpoint each >= 0.97 at D 1024, mean over five seeds with the per-seed list; C2 the same at
4096 reported; R1 separability and R2 capacity reported. Baseline the VSS pass must meet or beat (D11), the rule-based pass on the
synthetic test split of app/tests/sketch.mjs: containment 0.992 (compare: inside), connectors 0.963 (compare: nearest endpoint, which is
how a connector's ends are attached); planted unknowns 12 of 13 is not measured by this experiment (unknown blobs belong to the
classical recogniser's step), so this run cannot claim it. Swap-in only if C1 is met AND inside >= 0.992 AND nearest >= 0.963; else the
rules stay and the About line says why, with the numbers. The symbol step stays classical ($P): it is not the VSS claim.

Sketch tab "Sketch: how it is read" (responses D12, BUILT bbd0c8c by a Sonnet agent of this session, merged by fast-forward): left the
classical step (stroke groups, ranked kinds with scores and margin, prototype features, $P distances, reason; scribbles and unknown blobs
flagged), right the rule-based scene pass (decision, two best with the distance margin, containment, questions, the SOP circuit), the
header naming the active pass and stating that the left column is not VSS; rows linked to each other and to the canvas. scene_pass.js
returns two already-computed values more (attachTol, labelStrokes); sketch.mjs metric lines identical before and after; sketchrows.mjs
20/20, browser check 216/216. Not exposed today and so not shown: the join rule that formed a group, the unknown-blob cost and thresholds
as numbers, the containment shares, a per-component SOP wire.

Data-size curve dropped for the demo (the owner's decision, 2026-10-26 about 14:45; questions.md): only the largest size (50000) of each
demo world is trained and shipped. Stopped: animation 5000 and the 20000 runs of all five worlds; kept as a partial record: the finished
1000 / 5000 sizes in runs/*_eccbf84. The shipped-size rule of TODO 1.1 / spec 4.5 becomes "the largest size"; the demo's runs make no
claim about data efficiency. textedit: `gpu_textedit.sh --sizes 50000 --skip_curve --no_export` (new flag: no 5-seed curve run, only the
five calibrated single-seed models at the shipped size).

D13 check (d), diagnostics on the diagram n5000 model (seed 0, 800 eval sentences; questions.md Q8 has the numbers): 74% of the
abstentions come from the presence margin of an ABSENT role; prefix and function words are counted as unplaced (residual 0.39 on correct
readings; 73 no-sense, 30 of them <= 5 tokens); connect's object / source conflated (same-kind COMPONENT competition); the predicate wrong in
6-13% of readings. On this evidence the gap to Table 13 is a reader / legend question before it is a data-size question; further demo
runs wait for the direction asked in Q8.
