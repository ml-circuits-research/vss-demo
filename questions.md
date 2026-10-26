# Questions for the reviewing session

Convention: questions, complex decisions and requests for a second opinion from the DGX session go here; the work they block stops until
an answer arrives in `responses.md`. `responses.md` is written only by the reviewing session and never edited here. A question is deleted
from this file once its answer is satisfactory (the answer stays in `responses.md`). Every change to this file is committed and pushed.

(Q4-Q6 answered by D5, D8, D10 and removed)

For the interface thread: the owner wants the editor as a set of tabs with a chat input ("in the chat I write what I want and
things happen through the tabs"), one tab being the assistant's detected intents and results; it is built by a separate thread (a
Sonnet agent, through the API; it does not touch the training runs). Detailed requirements, with D10's two kept items and the file
ownership that keeps it apart from the reader's mirror: vision/UI_tabs_requirements_2026-10-26.md.
Update 12:50, the owner: this DGX session builds it now, with a Sonnet agent in its own worktree (a branch merged into main by this
session, dist rebuilt after the merge). Please do not start the same interface work in another session; comments on the requirements welcome.

Notes for the record (not questions):
- The owner (2026-10-26, about 17:15): no more preview builds from the DGX session; builds will be made by an actions system that
  publishes them to another repository. builds/ keeps the last preview (probe C) until that system replaces it.
- The owner (2026-10-26, about 16:35): preview builds of the one-file editor are committed under builds/ (one dated file per preview,
  about 48 MB with the D 1024 probe model), so they can be tested on other machines; app/dist/ stays untracked as D15 says.
- The owner's DECISION (2026-10-26, about 14:45): the demo ships only the best models; no more time on the small sizes. The data-size
  curve of spec 4.5 / TODO 1.1 (1000, 5000, 20000, 50000) is dropped for the demo's worlds: only the largest size (50000) is trained.
  Done now: the remaining small-size runs were stopped (animation 5000; diagram, diagram_ro, diagram_multi, animation, textedit 20000);
  the 1000 / 5000 folders that finished are kept as a partial record; the 50000 runs continue; textedit runs 50000 only
  (`gpu_textedit.sh --sizes 50000 --skip_curve`, its five calibrated single-seed models). Consequence for the criteria: the rule
  "the shipped size = the smallest after which held-out formulations stop improving" is replaced by "the largest size"; no claim of
  data efficiency is made from the demo's runs. Rows meant for the paper or the comparison keep their own protocol (tell me if one of
  the demo's worlds needs the curve for a paper row).
- The owner (2026-10-26, about 12:25): the interface work of Q6 / D10 is a side task, done only when there is time; the focus stays on
  what was planned (the 2.12 runs, their export, the decoder rules). The shell of the "Requests" tab (D10) waits with it.
- The owner asked for a list of what works, what is training and what needs attention; written by a read-only agent at 11:31:
  docs/state/STATE_2026-10-26.md.

## Q7 (2026-10-26, the owner asks for a review before any more training) — is 50000 sentences needed for what the demo does, and how was it decided? (blocks: every new demo training run)

The owner first decided "only the best models, no small sizes" (note above), then asked for a review before acting on it: is 50000 really
needed, and where does the number come from. What I found:

1. **Where 50000 comes from.** Specification 4.5: "the number of training sentences is decided by measurement: the reader is trained at 1k,
   5k, 20k and 50k sentences ... the smallest size after which [held-out formulations] stops improving within seed variance is the one
   shipped". So 50k is the TOP of a list fixed in advance, not a measured need; the measurement (the curve) was supposed to pick the size.
   The frozen data (training/data/<world>/n50000) and TODO 1.1 follow from that list. I found no other argument for 50k.
2. **What the curve shows so far** (runs/*_eccbf84, contract decoder, `--activate auto`, D 1024; FULL "catalog candidates", mean +- sd over
   the seeds that finished; 20000 is partial: 1-2 seeds before I stopped it; numbers of a run in progress, not results):

| world | split | 1000 | 5000 | 20000 (partial) |
|---|---|---|---|---|
| diagram | heldout formulations | 0.498 +- 0.029 | 0.694 +- 0.048 | 0.770 (1 seed) |
| diagram | new identities | 0.467 +- 0.042 | 0.649 +- 0.061 | 0.825 (1 seed) |
| diagram_ro | heldout formulations | 0.429 +- 0.038 | 0.524 +- 0.030 | - |
| diagram_multi | heldout formulations | 0.288 +- 0.033 | 0.510 +- 0.041 | - |
| animation | heldout formulations | 0.245 +- 0.018 | 0.549 +- 0.021 (3 seeds) | - |
| textedit | heldout formulations | 0.714 +- 0.013 | 0.938 +- 0.017 | 0.961 (2 seeds) |

   The diagram worlds and animation are still rising steeply at 5000-20000, and far below Table 13 (FULL seen >= 0.98, new labels >= 0.99):
   on this evidence 20000 is not enough there and nothing says 50000 is (the criterion may not be reachable by data alone). textedit looks
   close to flat between 5000 and 20000 (0.938 -> 0.961), so a smaller size may be enough for it.
3. **A point I cannot settle**: the second column the trainer prints, "experiment candidates" (train.py ~l.626: the evaluation restricted to
   the words seen in training, or new identities plus seen words), is much lower (diagram n1000 heldout formulations 0.08-0.15). Which of
   the two columns is the number of the shipped decoder (contract: candidates from the sentence) in the browser? If it is the second, the
   picture above is much worse and the question is not data size.

State now: the 50000 runs of diagram, diagram_ro, diagram_multi continue (started about 13:30, over an hour in; stopping them would lose
that); textedit and animation are stopped and wait for this answer; the 20000 runs were stopped by the first decision (so the curve point
that would answer the question is missing for most worlds).
Questions: (a) keep 50000 for the diagram worlds and animation (the curve is not flat), or measure 20000 properly first? (b) textedit: ship
20000 (or 5000) instead of 50000? (c) which eval column is the shipped decoder's? (d) is the gap to 0.98 expected to close with data, or
is it a decoder / route question to look at before spending GPU on larger sizes?

## Q8 (2026-10-26, after D13's check (d); the owner: "we may need better data or a better reader, not to train blindly") — the gap is mostly not data: four observations, which direction? (blocks: textedit / animation 20000 and every further demo run)

Evidence: the trained diagram n5000 model (runs/diagram_step3_eccbf84, seed 0 = /tmp/diagram_step3_83IC/5000/diagram/model, contract
decoder, routes path+chainL+bigram) reading the 800 sentences of eval_heldout_formulations + eval_new_identities (`sop formalize
--json`, 4.7 s), and metrics.json of the finished 1000 / 5000 runs. Numbers of one seed of a run in progress: diagnostics, not results.

1. **Status: 611 of 800 readings abstain, and 450 of those (74%) abstain only because an ABSENT role's presence margin is the smallest
   margin.** The sentence's `_margin` is the minimum over every margin, including `_presence_margin.<role>` of the roles read as absent
   (e.g. "i want you to create a box": frame right, create / object = a box, but `_presence_margin.text=0.013` < tau 0.05 -> abstain).
   138 abstain on the identity of a filled role, 2 on the presence of a present role. FULL (frame right, whatever the status) is 0.66-0.71
   on the three splits while only 15% of readings are `ok`; so coverage at tau is the real casualty. The app's dialog already defaults an
   absent role near its threshold (Table 8), but the reader's status and every coverage / confident-wrong number count it as an abstention.
   Question: should an absent role's presence margin enter the sentence margin (source: infer.py status rule), or be reported as a
   presence query only?
2. **Prefix and function words are "unplaced"**: the most frequent unplaced words are you 401, i 202, please 162, need 111, want 91, would
   77, called 68, okay 66, so 66, lets 63, could 61, can 61, now 49, named 49. They are in the legend with their own kinds (generate.py
   FUNCTION_WORDS), yet the reader treats those kinds as content kinds, so the explained residual counts them as unexplained (0.39 on a
   correct reading) and short sentences become `no-sense` (73 of 800; 30 with <= 5 tokens: "please shrink theta", "i want you to erase
   routing", "okay so clone indexer": prefix words + a new label > half the tokens). This is the legend's / reader's definition of content
   kinds, not training data. Question: is the fix a legend declaration (e.g. `reader.filler_kinds` / non-content kinds for the prefix
   family) or the reader's rule for which kinds are content?
3. **Same-kind competition in connect**: "please connect the box to the cache" is read object = box, target = cache (gold: source = box,
   target = cache; object is the line). The worst formulations of every seed are dominated by connect ("please connect the COMPONENT to
   the COMPONENT", "would you connect the COMPONENT and the COMPONENT"), and the activation diagnostic says 33 selection rows with
   same-kind competition stay misread with every route (D2's profile: (COMPONENT: object, source, target) 1496 rows). Question: does the
   legend conflate two questions here (the line being drawn vs the first end), i.e. should connect's object be a different kind (EDGE) or
   a separate event, as the diagnostic suggests ("a question is missing from the legend or the world should be split")?
4. **The predicate itself is wrong in 6-13% of readings** (calibration "predicate" acc 0.93 / 0.87 / 0.94 on heldout sentences /
   formulations / new identities at n5000), in a world where the event is a lookup of the verb (EVENTS table). And the bare "create a box"
   reads no-sense. Question: is this expected of the reader (the verb is read from the state, not looked up), or a sign of a decoder issue
   to look at first?

My proposal, for your direction: no more demo training until 1 and 2 are settled (they change the status and the residual of every
reading, cost no GPU, and are in the source); then 3 as a legend change in the generator (a new frozen dataset, new runs); then a small
measured curve (5000 and 20000, 3 seeds) on the corrected world, before any 50000. The three 50000 runs now running will finish anyway
(their numbers are then the "before" row). Which of these do you want, in what order, and who does 1 / 2 (source) and 3 (generator)?

## Q9 (2026-10-26) — D14 item 3 (EDGE) cannot be expressed as written: a role's kinds are per ROLE, not per event (blocks: the EDGE change and the new frozen data; the paraphrase pilot runs meanwhile)

D14 asks: give the edge words their own kind EDGE and "make connect's object admit EDGE only". In the legend and the trainer a role's
admitted kinds are per role (`build_schema`: `roles[r].kinds / head_kinds` from every training row that fills r, train.py ~l.177), and
`object` is one role shared by every event (create, delete, change, copy, connect ...). With EDGE as a kind, `object` would admit
COMPONENT and EDGE, so under `candidates: sentence` "connect the box to the cache" can still put box in object; the conflation stays.
Two ways to state it, my recommendation first:
(a) **A legend question of its own (generator, mine):** connect's line becomes a new role `edge` ("with which line?", head kind EDGE),
    `object` stays COMPONENT; the generator writes `edge=` instead of `object=` in the three connect templates that name the line, and
    `change ... style` keeps `object` (a line as the thing changed). The diagnostic's own wording ("a question is missing from the legend")
    points here. Cost: the shared legend's sha changes for diagram, diagram_ro, diagram_multi (one new frozen dataset each); the app's
    planner reads the line of a connect from `edge` instead of `object` (app code, mine, one line plus a test).
(b) **Per-event role kinds in the reader (source):** the schema keeps kinds per (event, role) and the decoder restricts a role's
    candidates by the event read. More general (every event-specific restriction), but a reader change with parity, and it makes a
    role's readout depend on the predicate's decision (an error in the event becomes an error in the role).
I would do (a) now and keep (b) as a proposal for the source if other events show the same pattern (the 800-sentence diagnostic shows it
only for connect). Which one?

Also for the record: the owner gave an API key for step 1.2 (paraphrases); it is stored outside the repository (~/.config/vss-demo,
mode 600) and passed only through the environment. Before the full run, a pilot of 100 sentences x 4 families with Haiku 5.5 and Sonnet
5.5 (rejection rate of rewrites that lose a filler, diversity of the rewrites), to choose the model; the full run starts from the
corrected world after Q9.

## Q10 (2026-10-26) — the paraphrase pilot (TODO 1.2): Haiku is enough, but the pipeline has two problems to fix before the full run (blocks: the full paraphrase run)

Pilot: 100 sentences of diagram n5000 x 4 families, `paraphrase.py --n 100 --batch 25`, once with claude-haiku-5-5 and once with
claude-sonnet-5-5 (world copies in the DGX scratch, not committed; the key is outside the repository). Kept / rejected (a filler dropped
or changed) is the SAME for both models: typed_casual 100 / 0, spoken 98 / 2, terse 26 / 74, polite_long 100 / 0. Diversity (distinct
bigrams over the kept rewrites): Haiku 405 / 412 / 62 / 543, Sonnet 407 / 438 / 73 / 566, i.e. Sonnet +0-18%, mostly on terse and spoken.
So the model is not the limit; I would use Haiku. The two problems are in the pipeline, the same for both:
1. **terse contradicts the filler check**: the family prompt says "drop articles", but `fillers()` counts the determiner of an entity
   (a / the / all) as a filler, so 74% of terse rewrites are rejected, and the held-out family (terse is `--heldout_families`) keeps only
   26 of 100. A determiner IS meaning here ("a box" = new, "the box" = existing), so I would keep the check and change the prompt to
   "drop politeness and filler words, keep articles and every name"; or measure a determiner-free variant as its own family.
2. **The rewrites stay close to the templates**: e.g. spoken "okay can you insert a square called mailer", "so would you scale the star
   to medium" are template sentences with a filler word added; 38-48 of 100 spoken / typed_casual lines are identical between the two
   models. This tests little that the templates do not already cover. Proposal: a fifth family "free" with the instruction to rephrase
   as a person would who has never seen the template (other verbs from the legend's verb list, other word order, a relative clause, a
   pronoun for a repeated component), and report per family the share of rewrites whose token sequence is NOT a training template after
   normalisation (the measure of new language).
Also: the full run should start from the corrected world (Q9), since the frames of connect change. Agreed: Haiku, the terse prompt fix,
the "free" family, then the full run (n 2000 x 5 families) after Q9's data? Cost note: the pilot was 2 x 16 calls of about 25 sentences.

## Q11 (2026-10-26) — the FPE scene reader met C1 (step 18): the swap-in into the browser, how? (not blocking the diagram work)

Result in STATUS ("FPE scene reader, step 18"): heldout at D 1024, mean over five seeds, left_of 0.998, above 0.996, inside 0.998, nearest
0.998, confident-wrong <= 0.004; capacity 16 elements at D 1024 (64 at 4096). The swap-in rule written before the run is met. Two points
before I build the swap-in (TODO 2.4.1: a JS FPE reader behind scene_pass.js's interface, a parity test Python/JS):
1. The experiment's inputs are positions given exactly; in the editor they come from the recogniser (stroke groups -> boxes). Proposal:
   first an end-to-end row on the synthetic strokes of app/tests/sketch.mjs (recogniser -> FPE relations vs recogniser -> rules), the
   same test split the baseline numbers came from, before the About line says "VSS scene reader: active". Expected: containment and
   connector attachment at least the rules' 0.992 / 0.963 (the relation step is no longer the limit; the recogniser's boxes are).
2. Capacity 16 at D 1024: a sketch with more than 16 elements is outside what was measured; proposal: the FPE reader declines (falls
   back to the rules, said in the reading) above 16 elements, rather than reading with an unmeasured error.
Agreed, and is the JS FPE reader mine (app) with the Python side as it is in training/worlds/scene/fpe.py?

## Q12 (2026-10-26) — the diagram probe: the reader fixes worked; the edge question helped connect but a second cause showed up: the diagram world has no core role since a9fa51d (blocks: every diagram run)

Results and the numbers in STATUS ("RESULT of the diagram probe"). In short: A (new reader, old data) met every expectation of D14
(no-sense 73 -> 7, predicate wrong 0.9%, no unplaced function words, absent-role abstentions became presence queries, heads-exact
unchanged 0.721); B (+ edge) lifted connect from 0.40 to 0.76, but heads-exact only to 0.723 because create fell from 0.789 to 0.700.
Cause: `object` is no longer a core role (rate 0.917 in A, 0.861 in B < 0.95; the most-frequent-role fallback was removed by R79), so a
create / delete / move without its object is "ok" (status ok, residual about 0.7) instead of incomplete. The remaining connect errors point
the same way: "link the teal box to the caption with an edge" is read object = box (object is admitted for connect because role kinds are
global, though connect has no object any more), and "connect X and Y with a line" swaps source and target.
This is the second event showing the pattern D17 named for option (b) ("record (b) ... only if a second event shows the pattern"). Proposal,
one legend declaration and one reader rule, both in the source:
1. **Per-event role sets in the legend (a declaration, rule 20):** `events[].roles` = the roles the event takes and `events[].required` =
   the roles it cannot do without (create / delete / move / change / copy / name / resize / place / group / arrange / align / distribute:
   object; connect: source, target; zoom: direction; undo / redo / clear: none). The diagram generator knows both (its templates).
2. **The reader uses them after the predicate:** a role the read event does not take is not read (no candidates: connect's object stops
   taking the box); a required role not given makes the frame incomplete (residual 1.0 and a presence query, as R42 / D14). The worry of
   Q9 (b) (a role's readout depending on the predicate) is now small: the predicate is 99% right with sentence verbs (A: 7 of 800 wrong).
Expected on the 800 sentences after the change (the same A / B data, no new data): create back to >= 0.79 (the missing objects become
incomplete frames that ask, so not counted right, but no longer "ok"), connect >= 0.8 (object no longer a candidate), the "ok but
incomplete" readings 49 -> 0. If you agree, who does what: the source reader rule (yours), the legend declaration in the generator and a
new frozen n5000_edge (mine). The order-dependent swap of "connect X and Y" (no cue between the two ends) is a separate question; I will
count it after this change before proposing anything.

## Q13 (2026-10-26) — the end-to-end sketch row: FPE = rules on the split (0 disagreements); make FPE the default or not? (not blocking)

Numbers in STATUS ("RESULT of the end-to-end sketch row"). The row meets D18's condition (at or above the rules) but separates nothing:
both passes are right or wrong on the same 517 decisions, and every miss is the recogniser's. Against making FPE the active pass now:
(i) on this split it adds nothing measurable; (ii) its nearest-endpoint readout compares CENTRES, so on a large box next to a small shape it
attaches an arrow to the wrong one where the outline rule is right (constructed probe; no such case in the split); (iii) 106 ms per scene
against 0.3 ms. For it: it is the VSS reading of structure that the paper's contract claims, and its margins are real. My proposal: keep
the rules as the default; keep FPE behind the setting, the sketch line saying "VSS scene reader: measured equal to the rules on the
synthetic split; available in Settings"; and, to give FPE a case where it should matter, add to the generator of the synthetic strokes a
few scenes with large containers and shapes near their outlines (the probe's form, 20 scenes), and an "outline-aware" nearest (the decoded
tip compared with each element's box edges, which the corner addresses already give) as a proposal for fpe.py, measured on those scenes
before any change of default. The recogniser's misses (connectors 6 of 161, 1 unknown) are a separate item for the classical step.

## Q14 (2026-10-26) — probe C met every expectation (heads-exact 0.723 -> 0.942); what remains points to one rare FORM in the examples (not blocking ro / multi C, which run now)

Numbers in STATUS ("RESULT of probe C"). The 45 remaining errors of 779: about 19 are a LABEL filler with no determiner right after a
relation word or a cue ("put the document left_of paul", "drag irina below notifications", "join the textbox to broker", "label the
rectangle routing"); in training, a landmark right after the relation word is 79 rows of 5000 (1.6%), in new identities 6.5%. By D16 the
remedy is the form, not more data: in the generator, give landmark and target a label head more often in the relation and connect
templates (label_p 0.15 -> 0.35 there; same n 5000, same seed), so that "REL + LABEL" and "to + LABEL" are ordinary forms. Expected: those
~19 errors -> near 0, nothing else down. Second, the order swaps (9): `vorder` is accepted, and they remain; I will count them after the
form fix before proposing a reader change. Also: probe C is the best model so far, so the preview build in builds/ moves to it (same
banner, "preview, not final"). Agree with the form fix as the next diagram run?

## Q15 (2026-10-26) — probe D: the form fix worked only in part, and the activation test flipped `vorder` between C and D on one-row differences (blocks: the next diagram run)

Numbers in STATUS ("RESULT of probe D"). Two findings, one for each side:
1. **The activation test is too noisy to decide at n 5000 (source, activate.py).** C accepted `vorder` (+0.026 on the 76 marked rows,
   -0.007 on train); D rejected it (+0.048 on the 62 marked rows, -0.013 on calibration_heldout_formulations, tolerance 0.01). Each
   trial is ONE seed on about 650 selection rows, so the decision turns on one or two rows, and it matters: without `vorder`, "call the
   client irina" (a label right after the object, no cue) failed 12 times in D against 3 in C. Proposal for the source: trials over the
   run's seeds (3) and the tolerance as max(eps, one seed sd of the split), or a paired test on the selection rows (the same rows read by
   both bundles: accept when the marked rows' wins exceed the losses elsewhere by more than the binomial noise). Either makes C and D decide
   the same way unless the data really changed the need.
2. **The form fix halved the bare-label errors but did not remove them** (20 -> 12). Of the 12, I will list them after (1) is settled
   (they may share the `vorder` effect: a label after a relation word is also "the n-th word after the verb"). If they remain with vorder
   on, the next step is the reader's (the chain's address of a label after a REL cue), not more of the form.
Also for the record: `name` should require `text` (a name without its new text is not a command); a one-line generator change, with the
next data, unless you object.

## Q16 (2026-10-26) — C2 / D2: the paired test decides consistently; the name errors of D are an adjacency-rule case, not vorder (correction of Q15) (blocks: the next diagram run)

Numbers in STATUS ("RESULT of C2 / D2"). The paired test rejects vorder in both C2 and D2 (2-3 marked wins, 0 losses, below the noise),
so (1) of Q15 is settled. My Q15 attribution was wrong: without vorder, C's data still reads "call the client irina" right (C2: 1 name
error on C's 800 sentences); on the same 800 sentences D2 is 0.949 against C2's 0.945, gaining place / move / create (+13) and losing name
(-13). The mechanism in D2: the `text` question's presence falls under its threshold, the label stays unplaced next to the object's
filler, and the adjacency rule (infer.py undecided_adjacent) makes the OBJECT undecided ("client|irina"), though the decided event has an
EMPTY role (`text`) whose kinds admit that word. Proposal for the source (a reader rule, parity in reader.js after the sync): before the
adjacency rule fires, an unplaced word that an empty role of the decided event admits (by the event's roles of D19 and the role's kinds)
is offered to that role as a presence query ("is 'irina' the new name?"), and the neighbouring role is not made undecided; with `name`
requiring `text` (D24) that query is exactly the right question. Expected on the same 800 sentences: name back to about 1-2 errors with D2's
model (no retraining: a decoder rule), heads-exact about 0.96. Second, the reason `text` falls under its threshold with D's data (more bare
labels after REL / to) is the presence readout's, and I would measure it after the rule, not before. Agree?
