# The diagram world (VSS Diagram Editor, spec sections 3 and 4)

| file | content |
|---|---|
| `generate.py` | legend, kinds lexicon, templates per action, prefix families, held-out formulations (template x prefix combinations), new identities (labels, numbers); writes a world folder that `sop check` validates and `sop train` trains; writes COVERAGE.md |
| `normalize.json`, `normalize.py` | the normalizer (one table, also used by web/normalize.js) |
| `normalize_golden.py` | surface sentences with the Python normalizer's output, for the JavaScript parity test |
| `noise.py` | typing and speech noise for the correctors' evaluation (never in the reader's training data at Level 1) |
| `COVERAGE.md` | sentences per event and role in the training file (the exit check of step 1) |

The world folder must be named `diagram` (the SOP files carry `_world=diagram`): `python3 generate.py --out ../../worlds/diagram`.
Level 1 only (spec Table 5): one command per sentence, one attribute per component, no nesting. Design choices made here, stated:
multi-word values are single tokens produced by the normalizer (top_left, left_of, right_edge, to_next, flow_lr), so that every role
filler is a token of the sentence (the reader deposits the identity of the token it reads); "make" is the verb of `change` (colour, style,
size), so "make it bigger" is a change; "group" is the verb and containers are called container or lane; numbers and labels outside the
catalog are read through the legend's value patterns and, in the browser, the sentence-candidates option of vss.js.
