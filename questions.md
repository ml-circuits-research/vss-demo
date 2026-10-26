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
