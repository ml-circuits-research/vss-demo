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
| 18 | positions as addresses (FPE) | MEASURED (53ae844): C1 MET | logs/scene_fpe_53ae844.log, summary.json | heldout, D 1024, mean over 5 seeds: left_of 0.998, above 0.996, inside 0.998, nearest 0.998 (criterion 0.97 each); D 4096: 1.000 / 0.999 / 1.000 / 1.000; capacity 16 (D 1024) / 64 (D 4096) elements; positions given exactly (synthetic scenes), not read from strokes |
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

"Before" row (responses D14): runs/*_eccbf84 (diagram, diagram_ro, diagram_multi, animation, textedit; sizes 1000 / 5000 finished, 20000 and
50000 stopped at 15:0x by D14: no blind scaling) are kept as the measurement of the reader and legend BEFORE the fixes of Q8 / D14 (presence
queries, filler-only content kinds, sentence verbs as predicate candidates, the EDGE kind). The 800-sentence diagnostic of Q8 is their
reading. Next: the reader.js mirror of b467e4b and parity; EDGE in the generator and a new frozen dataset; a curve at 5000 / 20000, 3 seeds.

Paraphrase pilot (TODO 1.2, owner's key, 2026-10-26): 100 diagram sentences x 4 families with Haiku 5.5 and with Sonnet 5.5: identical
kept / rejected counts (terse 26 / 74 rejected for both: its "drop articles" prompt conflicts with the determiner filler check), Sonnet's
rewrites 0-18% more diverse; rewrites close to the templates. Choice and the pipeline fixes proposed in questions.md Q10; full run waits.
Also merged: the presence-query dialog and the Requests tab shell (a Sonnet agent; dialog 19, queries 17, entries 31 checks; browser
check 244/244); end to end on the reference_v2 smoke model, `_presence_query.recipient=0.029` reaches the reading as presenceQueries.

FPE scene reader, step 18 (responses D11 item 1), RESULT of the run declared above (logs/scene_fpe_53ae844.log, summary.json; cupy on the GPU,
D 1024 and 4096, five seeds, kernel and L chosen on dev, heldout read once): C1 MET at D 1024, mean (per-seed list in the log): left_of
0.998, above 0.996, inside 0.998, nearest endpoint 0.998, coverage 1.000, confident-wrong 0.002-0.004; D 4096 reported: 1.000 / 0.999 /
1.000 / 1.000. R2 capacity (all four >= 0.97): 16 elements at D 1024, 64 at 4096; R1 separability: left_of >= 0.97 from 4-24 px at 1024.
Against the swap-in rule written before the run: inside 0.998 >= 0.992 and nearest 0.998 >= 0.963, so the rule is met. Caveat recorded
with it: the experiment reads scenes whose element positions are GIVEN (synthetic geometry), while the rule-based pass's baseline reads
the recogniser's output from strokes; the comparison is of the relation step only, not of the whole sketch pipeline. The swap-in itself
(an FPE scene reader in the browser behind scene_pass.js's interface, with its own parity check, TODO 2.4.1) is the next, separate step;
until it ships, the sketch line keeps "VSS scene reader: in experiment" (questions.md Q11).

## Training proposal (responses D16 rule), written before the run: the diagram probe at 5000 after Q8 / D14 / D17

What fails (the "before" row: runs/diagram_step3_eccbf84/5000, seed 0, read on the 800 sentences of eval_heldout_formulations +
eval_new_identities, Q8): heads-exact frames 561 / 779 = 0.720; 611 of 800 readings abstain, 450 of them only on an ABSENT role's
presence margin; unplaced function words (you 401, i 202, please 162, ...), 73 no-sense (30 of them <= 5 tokens); the predicate wrong in
6-13% of readings; connect is 24.8% of all frame errors (54 of 89 connect frames wrong, accuracy 0.393), read object = the first end.
Where the causes are and what is changed: (1) the reader's status rule, content kinds and predicate candidates (source b467e4b and
de11429, mirrored 3a49def / 50549bd); (2) the legend conflated the line with the first end of connect (the `edge` question, Q9 / D17,
data n5000_edge, legend sha256:0fcc8760...). Two runs, one change each, so that the two causes are measured apart, D 1024, 3 seeds,
`--activate auto`, `--candidate_sets catalog`:
  A = the old frozen data (n5000), the new reader: measures change (1);
  B = n5000_edge, the new reader: measures (1) + (2); B - A is the edge question.
Numbers expected to move (read on the criterion's splits, heldout_sentences / new_identities, and heldout_formulations beside them, and
on the same 800-sentence diagnostic): A: abstentions on absent roles 450 -> 0 (they become presence queries), unplaced function words
-> 0, no-sense < 2% of the 800, predicate accuracy >= 0.99 where one legend verb occurs, heads-exact >= 0.720 (no fall). B - A: connect
accuracy from about 0.39 to >= 0.8 on the 800, connect leaves the worst-formulation lists, heads-exact up by about 0.05 (connect's 24.8% of
the errors, at least half removed); same-kind competition rows in training 762 -> 691 (sop profile); the 388 order-dependent rows are
not connect rows and are not expected to move. If a number does not move as stated, the next step is a diagnostic, not a larger size.

## Proposal (D16 rule), before the run: the end-to-end sketch row, FPE relations against the rules (responses D18)

What fails: on the synthetic test split of app/tests/sketch.mjs the rule-based pass reads connectors 0.963 (criterion 0.97) and 12 of 13
planted unknowns. Where the cause may be: the relation step (rules on outline distance) or the recogniser's boxes; this row separates
them. Change: the FPE relations (a JS reader of training/worlds/scene/fpe.py, parity-tested against it) behind scene_pass.js's interface,
on the recogniser's boxes, same split. Expected: containment >= 0.992 and connector attachment >= 0.963 (the rules' numbers), and the
connector miss unchanged if it comes from the recogniser; the two readers' disagreements listed one by one. Above 16 elements (the
measured capacity at D 1024) the FPE reader declines and the rules read. The About line and the sketch line change only if the row passes.

RESULT of the diagram probe (proposal above; runs/diagram_step3_{A,B}_c6df5b1, 3 seeds; diagnostic on the 800 sentences, seed 0):

| | before (eccbf84) | A: new reader | B: new reader + edge | expected |
|---|---|---|---|---|
| no-sense of 800 | 73 | 7 | 5 | < 2% (met) |
| predicate wrong | 6-13% | 7 (0.9%) | 5 (0.6%) | <= 1% (met) |
| unplaced function words | you 401, i 202, ... | 0 | 0 | 0 (met) |
| abstain / ok | 611 / 116 | 313 / 480 | 211 / 584 | absent-role abstentions -> presence queries (met: 571 / 466 readings carry one) |
| connect heads-exact | 0.39 | 0.404 | 0.764 | B >= 0.8 (missed, close) |
| heads-exact, all | 0.720 | 0.721 | 0.723 | A no fall (met); B +0.05 (MISSED: +0.002) |
| trainer FULL heldout formulations (mean of 3) | 0.694 (5 seeds) | 0.714 | 0.640 | |

Why B missed: create fell from 0.789 to 0.700 (+17 errors), almost all with the create's `object` not given ("i want you to sketch a
customer" read with no object, status ok, residual 0.75). Cause found: neither A nor B has a core role (`[schema] ... (core [])`): the
object rate is 0.917 in A and 0.861 in B (connect rows without the line now have no object; zoom / undo / redo never do), under the 0.95
of build_schema, and since a9fa51d (vss-vs-bert 7ce5c50, the structure anchor) the trainer no longer takes the most frequent role as core;
so a frame without its object is never incomplete. CORRECTION of the paragraph "Code of the running 2.12 runs" above: a9fa51d was said
to change nothing for these worlds because they had core roles; that was read from logs written by the older code. It removed the
diagram worlds' only core role. Also: B accepted the `vorder` route and A did not, so B - A is the edge question plus that route.
Next: questions.md Q12 (per-event required roles); no further diagram run before its answer.

RESULT of the end-to-end sketch row (proposal above; merged from a Sonnet agent of this session: app/src/sketch/fpe.js, scene_fpe.js,
training/parity/make_fpe_golden.py, app/tests/fpe_parity.mjs, sketch_fpe.mjs): parity of the JS FPE reader against fpe.py PASS (4 cases,
998 relation decisions, 0 differ, margins within 1.9e-15; the randomness is the portable stars / xoshiro phases injected into fpe.py's own
classes, so parity tests the algorithm, not NumPy's draws). On the synthetic test split (40 scenes) recogniser -> FPE and recogniser ->
rules give IDENTICAL numbers: symbols 0.983, connectors 0.963 (MISS, criterion 0.97), containment 0.992, planted unknowns 12 of 13 (MISS);
per decision 508 both right, 9 both wrong, 0 disagreements (tune split too). All misses are the recogniser's (a symbol not built, an
unknown read as a scribble): the relation step is not the limit on this split, so D18's expectation holds (at or above the rules) but
the row does not show FPE doing better. A constructed probe shows where they can differ: an arrow tip 5 px from a large box's outline
and 40 px from a small ellipse whose centre is nearer: the rules attach the box (right), FPE the ellipse (margin 0.364), because FPE's
nearest compares centres. Cost: about 106 ms per scene at D 1024 (rules 0.3 ms). FPE is behind a setting (Settings, off by default);
the About line and the sketch line are unchanged; the decision on the default is asked in questions.md Q13.

## Proposal (D16 rule), before the run: diagram probe C, per-event role sets (Q12 / D19)

What fails (probe B, 800 sentences, seed 0): create read without its object while status ok (49 of 189 create readings, residual about
0.7, because the diagram world has no core role: object rate 0.861); connect reads object = the first end ("link the teal box to the
caption with an edge"), connect heads-exact 0.764. Cause: the legend did not say which roles an event takes or needs. Change: the
generator declares `events[].roles` (sampled from each event's own templates) and `events[].required` (object for the object events,
direction for zoom, none for undo / redo / clear; connect: source only, not source and target as D19 listed, because the pairing form
"connect the boxes in a chain" has a source set and no target), data n5000_req (legend sha256:d361fbea318b...), the reader rule mirrored
(98ffe04). Run C: diagram, n5000_req, D 1024, 3 seeds, --activate auto, --candidate_sets catalog; compare with B (same data otherwise).
Expected on the 800 sentences: create readings without their object and status ok 49 -> 0 (they become incomplete frames with a presence
query on object); connect heads-exact >= 0.8 (object no longer a candidate for connect); heads-exact >= 0.723 (no fall); the order swap of
"connect X and Y" counted after the run.

RESULT of probe C (runs/diagram_step3_C_a9929b6; 800-sentence diagnostic, seed 0): heads-exact 0.723 (B) -> 0.942; create 0.700 -> 0.958;
connect 0.764 -> 0.910; predicate wrong 5 -> 0; create readings without their object and status ok 49 -> 0; ok / abstain 584 / 211 -> 644 /
156; trainer FULL (catalog, mean of 3 seeds) heldout formulations 0.640 -> 0.864, heldout sentences 0.689 -> 0.871, new identities 0.588 ->
0.850 (Table 13 asks 0.98 / 0.99: not met). Every expectation written before the run is met. `vorder` accepted again. What remains (45 of
779 frames): a LABEL filler without a determiner right after a relation or a cue ("put the document left_of paul", "join the textbox to
broker", "label the rectangle routing"): about 19, a form at 1.6% of the training rows (landmark after REL) against 6.5% in new
identities; order swaps of two same-kind fillers ("connect X and Y" 5, object / landmark around a relation 4); quantity, direction, style
2 each. Next: questions.md Q14.

## Proposal (D16 rule), before the run: diagram_ro and diagram_multi probe C (the same change on their n5000_req data)

What fails / cause / change: as probe C above (per-event role sets; the two worlds share the legend). Expected: the same direction as
the English world (heads-exact up, create and connect up, no 'ok' frame without its required role), read on their trainer splits.

RESULT of diagram_ro / diagram_multi probe C (runs/{diagram_ro,diagram_multi}_step3_C_2bae649; trainer FULL, catalog, mean of 3 seeds,
before = runs/*_eccbf84/5000): diagram_ro heldout formulations 0.524 -> 0.822, heldout sentences 0.586 -> 0.833, mixed 0.571 -> 0.829, new
identities 0.639 -> 0.868; diagram_multi heldout formulations 0.510 -> 0.810 (English 0.592 -> 0.863), heldout sentences 0.583 -> 0.815,
mixed 0.574 -> 0.810, new identities 0.628 -> 0.853 (English 0.548 -> 0.832). Same direction as the English world, as expected; `vorder`
not accepted in either. Table 13 not met. The Romanian preview model is not swapped into the build (the build would pass 50 MB).

## Proposal (D16 rule), before the run: probe D, the form "relation / to + bare LABEL" (Q14 / D20), diagram, diagram_ro, diagram_multi

What fails (probe C, English, 800 sentences): about 19 of the 45 remaining errors are a LABEL filler with no determiner right after the
relation word or "to" ("put the document left_of paul", "join the textbox to broker"). Cause: the form is rare in the examples (a
landmark label right after the relation word: 79 training rows, 1.6%; a target label after "to": 33, 0.7%). Change: the generator gives
the landmark of the relation templates and the target of the connect templates a bare label head with p 0.35 instead of 0.15
(LABEL_P_LANDMARK; same n 5000, same seed, same legend d361fbea...): data n5000_req_label, where those forms are 193 (3.9%) and 88 (1.8%).
One change against C. Runs D: the three worlds, D 1024, 3 seeds, --activate auto, --candidate_sets catalog. Expected (English, 800
sentences): the ~19 "REL / to + LABEL" errors near 0, heads-exact up from 0.942 by about 0.02, nothing else down; the order swaps (9)
counted again. diagram_ro / diagram_multi: their trainer splits up or equal against their C rows, beside the English numbers.
