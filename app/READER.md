# web/ — the VSS reader in the browser (vss.js)

The browser interpreter of the VSS Diagram Editor (vision/ specification, sections 5.1, 6 and 7): a trained `model/` folder is exported
by `sop export-web`, loaded by `vss.js`, and every sentence is read into the same SOP Lang wires that `sop formalize` writes in Python.
No dependency, no build step, no server: ES modules over static files.

## Export a model

```
tool/bin/sop export-web --model <world>/model --out web/model [--bits 8|4|32]
```
Writes `model.json` (config, legend + sha256, lexicon, value patterns, catalog, schema, reader block), `routebook.bin` (the route book,
phases quantized to `--bits`), `stars.bin` (every star the decoder needs, quantized), `manifest.json` (sha256 of the files, legend sha,
training commit). Default 8 bits. The binary layout is documented at the top of `tool/sop/export_web.py`.

Train the browser models with `--star_version 2` (`sop train <world> --star_version 2 ...`): the portable star function
(SHA-256 → xoshiro128**) is reproduced exactly in JavaScript, so words outside the catalog (new labels, numbers) get the same identity
in the browser as in Python. A `star_version 1` model works in the browser only on its exported catalog: a word outside it has no star
there, adds nothing to the chart, and `read()` lists it in `missingStars` (Python would place it with a NumPy star the browser cannot draw).

## API

```js
import { load } from "./vss.js";
const vss = await load("model/", { sentenceCandidates: true });   // in node: load(null, { readFile: async (name) => ... })
const r = vss.read("put a yellow note 10 px below the database .");
// r.sop        SOP Lang text (directives + wires), as `sop formalize`
// r.wires      the wires (vss/soplang.js Wire objects)
// r.frame      {speakers, neg, event, roles, shape, lemma, depth, scope}
// r.margins    every margin of the decoder (structure, event, per role, attr, det, presence margins)
// r.presence   presence ratios per role (and .attr / .det)
// r.status     ok | abstain | unknown-event | no-sense
// r.residual   the unexplained share of the chart
// r.unplaced, r.tokens, r.state ({re, im} Float64Array), r.missingStars, r.timings {chart_ms, total_ms}
```
`sentenceCandidates` (default false): the candidates of a role are the catalog words of its kinds and the sentence's own tokens of those
kinds, so a new label or number is read without retraining. Python mirrors it: `Reader(model_dir, sentence_candidates=True)`.

Modules (spec Table 6): `vss/stars.js` (portable stars, synchronous SHA-256), `vss/routebook.js` (path, bigram, position, soft chainL with
gates, beacon-relative terms), `vss/reader.js` (tokenize, kinds, decoder, residual / status, frame → wires; the Legend), `vss/soplang.js`
(SOP Lang writer), `vss/loader.js` (export-web files, manifest check).

Ported: `Routebook.addresses`, `Reader.read` (structure hypotheses, depth from gates / kinds / fit, negation, speakers, predicate role,
word / negated word / entity roles with attribute, negated attribute and determiner, closed values, presence thresholds and presence
margins, the quantifier scope terms of `read_scope`), `formalize` (unplaced words, status, margins, `_world`, `_residual`, depth lines),
`frame_wires`, `wire_lines`, the `Compiler` reconstruction used by the residual. Not ported (an error at load): table roles, set roles and
`value_identity: bundle_alnum` (the WikiSQL world), the dispatcher by fit over several worlds, `sop diff`.

## Tests

```
python3 training/parity/make_stars_golden.py && node app/tests/stars_test.mjs
tool/bin/sop export-web --model <world>/model --out <exp> --bits 8
python3 training/parity/make_golden.py --model <world>/model --world <world> --out g.json --dequantize-from <exp> [--sentence-candidates]
node app/tests/parity.mjs <exp> g.json [--sentence-candidates]
bash training/parity/run_all.sh                      # every test below, on the smoke models of tool/test_sop.sh
```
`make_golden.py` with `--dequantize-from` runs the Python reader on the dequantized route book and stars of the export (what the browser
reads), so an 8-bit or 4-bit export is compared number for number; without it the float64 model is the reference (a 32-bit export matches
it to float32 rounding). Golden sentences: 50 spread over every examples file of the world plus 5 with words outside the catalog.
Criteria (spec 7.1): frames and statuses identical, state cosine ≥ 0.9999, margins / presence ratios / residual within 1e-4, SOP text
identical.

## Measured (2026-10-24, CPU smoke models, node 22, this sandbox; MEASURED, not results of the demo)

Parity (`bash training/parity/run_all.sh`), every case PASS: frames, statuses and SOP text identical on every sentence, state cosine 1.000000.

| model (D 256 unless stated) | export | sentences | worst margin / presence / residual diff |
|---|---|---|---|
| reference, star v1 | 8, 4 and 32 bits | 50 (+5 out-of-catalog: not reproducible with v1, listed) | ≤ 3e-15 (float64 tables) / ≤ 2e-8 (float32 cos/sin tables) |
| commands, star v1 (negation, negated attributes, determiners) | 8 and 32 bits | 50 (+5 listed) | ≤ 2e-8 |
| reference, star v2 | 8 and 32 bits, and sentence candidates | 55 (out-of-catalog words included) | ≤ 2e-8 |
| reference v2, test copy with value patterns q<n> / r<n> | 8 bits, catalog only and sentence candidates | 5 | ≤ 2e-8; new words read as agents only with sentence candidates (2/2) |
| reference, star v2, D 1024 (600 sentences, 1 epoch: a timing model, undertrained) | 8 bits | 55 | ≤ 2e-8 |

The trained float64 model against a 32-bit export (no dequantization in Python): frames identical 50/50, margins within 9e-8.

Reading time per sentence in node after warm-up (`node app/tests/bench.mjs <export> <golden>`, 220 readings, ~9 tokens per sentence):
D 256 median 0.8 to 1.0 ms, p95 3.7 to 3.8 ms; D 1024 median 2.8 ms, p95 4.7 ms. Export sizes of the reference world: D 256 0.89 MB at
8 bits (0.45 MB at 4 bits, 3.5 MB at 32); D 1024 3.5 MB at 8 bits.

Quantization on these D 256 smoke models (3 epochs, not the paper's regime): against the float64 model, the 8-bit export changes 1 frame of
55 and the 4-bit export 14 of 55. The paper's 4-bit result (no axis moves by more than 0.02) is at D 1024 on trained models; spec 5.2
requires the 4-bit variant to be measured on the demo's trained model before it is used.
