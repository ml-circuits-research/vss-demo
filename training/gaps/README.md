# training/gaps: the improvement loop from use (UNTESTED skeleton)

The editor keeps a local journal of readings it did not understand (app/src/gaps.js; Settings, "Help improve the readers"); a person
can save it as a file or send it to an address they enter, with an explicit consent box. These scripts turn journals into retrained
models, with a person accepting every change. Written on 2026-10-25 before any journal exists: every step is runnable alone and marked
untested; the first real journal is the first test.

| step | script | what it does | tested |
|---|---|---|---|
| 1 | `aggregate.py` | journals -> gaps report (unplaced words with context, unsure roles, not-understood sentences, marked readings, reformulations) | on the synthetic journal of app/tests/gaps.mjs only |
| 2 | `propose.py` | report + legend -> structured proposals from a large model; mechanical validation (ids, 10 examples, `sop check` on a temporary copy, rule tests in a sandbox); `--dry_run` writes the prompt only | validation path on hand-written proposals |
| 3 | `apply.py` | accepted proposals -> a new world folder (copy): legend, kinds, proposals.sop; generator templates as patches for the coding agent; symbolic rules as files with tests | not run |
| 4 | `nightly.sh` | the whole night for one world: aggregate, propose, (with --apply) apply, regenerate, train on the DGX, evaluate | not run |
| 5 | `accept.py` | the acceptance rule: no pre-existing row falls by more than one seed std; the gap rows improve; REPORT.md for the person | not run |

Nothing ships automatically: `training/export_app.py` is a separate, manual command. The first measurement of the loop, before trusting
it: plant three missing roles in a world (remove them from the legend and the generator, keep their sentences in a journal), run the
loop, and count how many it recovers and how many false proposals it makes (training/TODO_DGX.md, section 2.7).
