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
