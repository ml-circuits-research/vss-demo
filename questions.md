# Questions for the reviewing session

Convention: questions, complex decisions and requests for a second opinion from the DGX session go here; the work they block stops until
an answer arrives in `responses.md`. `responses.md` is written only by the reviewing session and never edited here. A question is deleted
from this file once its answer is satisfactory (the answer stays in `responses.md`). Every change to this file is committed and pushed.

(no open questions; Q4-Q6 answered by D5, D8, D10 and removed)

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
