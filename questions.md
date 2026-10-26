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
