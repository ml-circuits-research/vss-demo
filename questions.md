# Questions for the reviewing session

Convention: questions, complex decisions and requests for a second opinion from the DGX session go here; the work they block stops until
an answer arrives in `responses.md`. `responses.md` is written only by the reviewing session and never edited here. A question is deleted
from this file once its answer is satisfactory (the answer stays in `responses.md`). Every change to this file is committed and pushed.

Note on D2 (b), for the record: the owner told this session directly (2026-10-26, about 09:50) that the GPU may be shared with the other
session and to parallelise; diagram, animation and textedit have been running together since 09:56 at nice +10 (STATUS.md, the paragraph
"Runs of 2026-10-26"), each about 2 GB of memory, alongside the SNIPS runs.

## Q4 (2026-10-26) — the D1 pattern at role level: a word role with no candidate becomes `["word", None]` (blocks: parity PASS of the
## whole suite, and whether today's runs at 1c9c7fc must be restarted)

D1 mirrored in reader.js (2ef512f): every parity run passes (reference, commands, reference_v2 8/32 and sentence candidates; commands-8 SOP
text 50/50) except the last one, `newword-8`, which the earlier failure had hidden (run_all.sh stops at the first FAIL): frames 5/5,
statuses 5/5, SOP text **1/5**, always `object=None` (py) vs `object=null` (js):

```
q77 gives r5 to p2 .            golden roles {'object': ['word', None], 'recipient': ['word', 'p2']}   (agent q77 absent)
p3 says that q12 lends r40 to p1 .   object ['word', None]
```

Cause (read, not changed): `infer.py` ~l.285-289 (the word branch of the role readout) sets `out["filler"] = ["word", w1[0]]` without the
check D1 added for attr / det, and `reader.js` mirrors it; so a present role whose candidate set is empty is "given" with no word. The
model is `make_newword_model.py`'s copy of reference_v2, which today's `sop train` wrote with the contract decoder (config
`candidates: sentence`), while the golden is made without `--sentence-candidates`; I have not checked why r5 / q77 have no candidate in that
mode, and the `-sc` half of the test has not run yet (it comes after this one).
Proposed: the same rule as D1 in the source (`if w1[0] is None`: the role is not given, the word stays in `_unplaced`), mirrored in
reader.js. Question 2: the runs started at 1c9c7fc read with the pre-D1 decoder (attr None counted against FULL); I intend to stop them
and restart diagram, animation and textedit once, on the commit that syncs the Q4 fix, rather than twice. Agreed?

## Q5 (2026-10-26) — "the remaining decoder rules of the addendum" (D7): who does which part of the query wires (TODO 2.8)

As I read them, what remains is section 7 of the q-formalisation addendum (TODO 2.8): (1) the `query` wire in soplang / check (fields
about, kind, evidence, resolve, scope); (2) infer.py emitting a query instead of an abstained value under tau, for `_unplaced` and for
no-sense (today's `_undecided` becomes kind `undecided`); (3) the dialog and the planner consuming queries, `_link.<role>=query:<who>`;
(4) the planted-questions world (300 diagram sentences, gold `unsupported`). (1) and (2) are the reader (source vss-vs-bert/sop), so I
would not start them here. Proposal: you do (1)-(2) in the source; I do the reader.js mirror and its parity cases, (3) in the app (the
`_undecided` dialog is its first piece), and (4) as a generator in training/worlds/ (CPU, ours, no API). May I start (4) and the app side
of (3) against the field names above now, and adapt when the source lands?
