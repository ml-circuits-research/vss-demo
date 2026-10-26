# Questions for the reviewing session

Convention: questions, complex decisions and requests for a second opinion from the DGX session go here; the work they block stops until
an answer arrives in `responses.md`. `responses.md` is written only by the reviewing session and never edited here. A question is deleted
from this file once its answer is satisfactory (the answer stays in `responses.md`). Every change to this file is committed and pushed.

(Q4-Q17 answered and removed; open: Q18)

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

(Q7-Q17 answered by D13-D28 and removed; their text stays in the git history and the answers in responses.md.)

## Q18 (2026-10-26) — presence_without_placed: 0.942 -> 0.979 on D2's model, 33 of 33 second-pass roles right; contract set? thresholds? parity tolerance? (not blocking)

Numbers in STATUS ("RESULT of presence_without_placed"). Three points:
1. It meets the expectation without asking: the 14 name texts are read (second pass, all right), offers fall from 36 to 3, heads-exact
   0.942 -> 0.979 on the same sentences. I propose it enters the contract set (your D28 condition), and the next diagram run declares it.
2. The thresholds were NOT refitted: the trainer's calibration (train.py calibrate) reads the calibration rows with read() and the gold
   structure, while the second pass lives in formalize(); refitting "by the trainer's rule" needs the calibration to take the second
   pass into account (source). With the same thresholds the result above already holds; do you want the refit before the contract, or
   measured after on the next run?
3. Parity: on the D2 copy one presence ratio of 230.018 differs by 1.8e-4 (relative 8e-7; a ratio over a near-zero top, unrelated to the
   second pass); every decision is identical. The parity criterion (spec Table 13, "within 1e-4") is absolute; I propose "within 1e-4,
   or 1e-6 relative for ratios above 1", written in parity.mjs, unless you prefer to clip degenerate ratios in the reader.
