# app/src/script: long scripts (spec 18)

| file | content |
|---|---|
| `script.js` | `splitDocument` (a `#` title, `##` sections, paragraphs by blank lines); `qualifiers` (the reference pre-pass: "<kind> from the <ordinal> section", "<kind> from section <n>", "the <ordinal> <kind>" lose their words before reading, kept as constraints for the circuit, since the Level 1 reader has no role for them); `readScript` (each paragraph normalized, pre-passed, segmented and read; readings cached by unit text); `buildScript` (one circuit, a section wire per heading, conflicts looked for inside a section); `runScript` (section by section, a checkpoint and one undo entry per section; out-of-world units marked and skipped, never executed; `blocking: "stop"` waits at the first uncertain, unresolved or blocked unit, `"skip"` goes on and counts); `undoToCheckpoint`; `editUnit` (re-reads the one edited unit, rebuilds the circuit, returns to the checkpoint before its section and plans again from there, reporting the units that depend on it); `documentModel` (every sentence with its mark, reason, steps, components and links); `authorReport` (instruction following and the units lost by reason, spec 18.3); `sceneToText` (the diagram read back into the world's language, for the fidelity check). |
| `view.js` | `renderDocument(container, model, ctx)`: the document view: sentences underlined by their mark, a detail line with what each did and its links, a "Back to here" control per section (checkpoint), the counts. |

## Tests and what their numbers mean

`node app/tests/script.mjs` (exit 0 on pass) runs on `training/data/diagram/eval/scripts_{1,5,10}p.jsonl` (20, 6 and 3 documents written
by `training/worlds/diagram/scripts.py`, with sections, references over distance by label, unique kind, section and ordinal, 7 to 8% of
units planted outside the world, the gold circuit and the gold diagram after every section). With the FAKE reader (gold frames): unit
segmentation, links, cross-section references, order, planted units marked and never executed (100%), in-world units executed
correctly, the final diagram and the diagram at every checkpoint (components and connectors, precision and recall), undo to a
checkpoint, and an edited unit read once. All are 1.000 by construction of the fake: they check the code. The editor re-routes every
connector after each change (src/editor/router.js), which dominates the time on long scripts; by default the 1-page scripts and the first 5-page script are executed, the rest are read and linked;
`--full` executes all.

These numbers become meaningful only with the trained reader (`--model app/model/diagram`): in-world units executed correctly (criterion
>= 0.95 at 1 page, reported at 5 and 10), planted out-of-world units marked and never executed (100%), cross-section references resolved
with the rule (>= 0.95), the final diagram against the gold one (precision and recall at each length), the reading and planning time
per page. `--authored <scripts.jsonl>` evaluates scripts written by large models (training/worlds/diagram/llm_author/) and prints the
comparison table of 18.3; without `--model` it uses the fake reader and says that the table is not a measurement.
