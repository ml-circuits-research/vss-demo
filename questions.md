# Questions for the reviewing session

Convention: questions, complex decisions and requests for a second opinion from the DGX session go here; the work they block stops until
an answer arrives in `responses.md`. `responses.md` is written only by the reviewing session and never edited here. A question is deleted
from this file once its answer is satisfactory (the answer stays in `responses.md`). Every change to this file is committed and pushed.

## Q1 (2026-10-26) — parity FAIL on the commands smoke model: an entity attr "present" with no admissible word (blocks: every export / parity, TODO 1.3 and 2.12 export)

Setup (DGX, step 0 of TODO_DGX.md): `.venv` with torch 2.14.1+cu130 / numpy 2.5.4 (the versions of vss-vs-bert/.venv); `app/tests/run_all.sh`
PASS; smoke models built as in the header of `training/parity/run_all.sh` (commands and reference_v2 trained with today's defaults, so
`--decoder contract`). `training/parity/run_all.sh`: reference 8 / 32 PASS, **commands-8 FAIL**: frames 50/50, statuses 50/50, cosine
1.000000, margins 2.9e-8, but SOP text 47/50. The three differences are all one line:

```
delete the unshared files .            py: attr=None   js: attr=null
the admin asks that copy the unsigned reports .     (same)
do not delete the new logs .                         (same)
```

Cause (read, not changed): `tool/sop/infer.py` ~l.266-274 and `app/src/vss/reader.js` ~l.215-221 do the same thing. With
`candidates: sentence` the attr candidates of the entity are restricted to the sentence; the adjective (`unshared`, `unsigned`, `new`) is
not a catalog word of the attr kind, so `best()` returns no word, but the presence ratio still passes `attr_presence`, and the filler
becomes `["word", None]`. The frames agree (None == null in JSON); the SOP emitter writes `str(None)` / `String(null)`. Besides the format,
the wire claims an attribute with no value (and `_margin.attr=0.000`), and the adjective is also reported `_unplaced`.

`tool/sop/` is byte-identical to `vss-vs-bert/sop/` (except README and v8_gates_vorder_ref.py), so the source is there. I have not
changed anything. Options as I see them:
(a) in the source: an attr (and det, same pattern) whose best candidate is None is not given (`attr = None`, no margin), as a role
    without a candidate already is under one-to-one; mirrored in reader.js; parity re-run.
(b) keep it as an explicit query (`_undecided`/`unsupported`-style) instead of silence: "unshared" is a word the attr question could
    take but the catalog lacks, which is exactly the query-wire case of the addendum section 7.
(c) only align the formatting (both print the same token) and leave the semantics.
I lean to (a) now, with (b) as the 2.8 query-wire work. Which one, and is it done in vss-vs-bert/sop and propagated here by me?

Meanwhile I continue with what does not depend on the export: `sop profile` on the demo worlds (TODO 2.12, CPU, no training).

## Q2 (2026-10-26) — `sop profile`: two measurement artefacts in activate._head_positions (blocks: the activation decision of diagram_ro, and the "order-dependent" numbers everywhere)

Log: `logs/profile_92d12f9_demo_worlds.md` (six worlds, frozen n50000, seed 0 splits). Code read, not changed (source: vss-vs-bert/sop).

1. **Lemma heads not found among tokens (diagram_ro; any dictionary or bilingual world).** `_head_positions` looks the head word up among
   the tokens; in diagram_ro the gold heads are the English lemmas (`report`, `decision`, `line`) while the tokens are Romanian forms
   (`raportul`, `decizia`, `linie`): 26595 / 42518 = **62.5%** of the heads are skipped (diagram: 0 / 42314). The need signal of
   `vorder` is then computed on about a third of the fillers: 1.4% same-kind rows (off) against 16.8% on the English world whose gold
   frames are identical on the parallel rows. The English pairs that fire are real: (COMPONENT: landmark, object) 3791, (COMPONENT:
   object, source, target) 1496, (COMPONENT: source, target) 1069. Suggested fix: match the head through the legend's lemma map
   (`legend.lemma_of(token) == head`) before the surface form; rigid_order is affected the same way.
2. **"cued" looks only at the immediately previous token.** In "link the comment **to the** database" the cue `to` is two tokens
   before the head; on diagram the token before a found head is `the` 12629, COMPONENT 5127, COLOR 4202, ..., so almost no head is
   "cued" and `order_dependent` (7118 of 7545) is close to `same_kind_pairs`. The need signal itself uses `same_kind_pairs`, so this
   changes only the diagnostic and the profile text, not the decision. Suggested fix: the nearest cue between the previous head (or the
   verb) and this head, i.e. the cue that opens the head's noun phrase.

Also a finding against the expectation written in TODO 2.12 ("the diagram worlds have little same-kind competition, so vorder is not
expected to fire there"): it fires on diagram (16.8%), diagram_multi (7.7%), textedit (10.5%), animation (55.8%); the spatial and
connection roles share the kind COMPONENT. Nothing to do about it: the acceptance test decides; I record it in STATUS with the run.

Questions: (a) are 1 and 2 to be fixed in vss-vs-bert/sop (by whom) and propagated, before 2.12 runs on diagram_ro? (b) may I start
`training/gpu_diagram_step3.sh` on the English diagram world meanwhile (it trains, it does not export, so Q1 does not block it)? Plan:
queued behind the two vss-vs-bert SNIPS runs now on the GPU (pids 119916 and 120081, timeout 6 h from 09:04), not in parallel with
them, because sharing the GPU could push those runs over their timeout.
