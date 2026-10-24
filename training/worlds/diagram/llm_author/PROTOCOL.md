# The large model as the author: protocol (specification 18.3, Table 13 row "Large model as author")

What is measured: how well a large model follows the world it is given (instruction following) and, on what it wrote that the reader
could read, how much built what the model's own description meant (fidelity). The reader is the judge: the ground truth is the legend
the model was given. There is no criterion on the first run: the numbers are the finding. A low number does not say that a model is
worse; it says, unit by unit and with a reason, where the model stopped following the world it was given.

## Fixed before the run

- the legend prompt: `legend_prompt.md`, written by `legend_prompt.py` (deterministic); its SHA-256 is stored with every script;
- the ten descriptions: `descriptions.json`;
- the reader: the exported diagram model under `app/model/diagram/` (its legend SHA-256 is printed by the evaluation);
- the models: listed on the command line of `run_author.py` (provider:model), recorded in the output;
- sampling: one script per (model, description, variant), temperature as the provider's default unless stated in the run's label.

## Variants

1. **legend** (the main one): the system prompt is the legend; the user message is the description and "Write the script for the
   editor."
2. **slow path** (the harder one): the model first describes the diagram freely without the legend ("Describe this diagram as a
   numbered list of what it contains and how the parts connect."), then, in a second call with the legend as the system prompt, is
   asked to translate its own free description into the editor's language. The reader checks the translation (spec Section 20).

## Steps

1. `python3 training/worlds/diagram/llm_author/run_author.py --models anthropic:claude-opus-5-5,anthropic:claude-haiku-5-5 --label <label>`
   (needs the provider keys; `--dry_run` writes the requests without sending them). Output: `training/data/diagram/llm_author/<label>/scripts.jsonl`,
   one record per script: model, description id, variant, prompt SHA-256, the text, the raw response.
2. `node app/tests/script.mjs --model app/model/diagram --authored training/data/diagram/llm_author/<label>/scripts.jsonl`: every script goes
   through the full pipeline (normalizer, segmenter, reader, circuit, planner); prints the comparison table below and writes
   `scripts.diagrams_as_text.json`, the final diagrams read back into the world's language.
3. Fidelity: (a) automatic: the diagram read back into text (`scripts.diagrams_as_text.json`) is read by the reader and compared with
   the script's own requests by `sop diff` (a contradiction is a unit that did not build what it said). The read-back text is written
   now; the comparison step is not implemented yet (it is listed in training/TODO_DGX.md, to be written and run
   with the trained reader); (b) by a person on a sample: for 3 descriptions per model, a person compares the final diagram with the
   description and counts the parts present, missing and wrong. Both numbers are reported; the person's sample is named in the table.
4. The table goes into the run's log with the labels the project's rules require; the units lost are listed per model with their reason.

## Comparison table (template)

| model | variant | scripts | units | instruction following (units read clearly) | executed of read | fidelity, automatic | fidelity, person (sample) | units lost, by reason |
|---|---|---|---|---|---|---|---|---|
| provider:model | legend | 10 | | | | | | a word outside the world: n; an unknown action: n; not in the world's language: n; a reference that resolves to nothing: n; uncertain reading: n |
| provider:model | slow path | 10 | | | | | | |

Reasons are those of `app/src/script/script.js` `authorReport()`: a word outside the world, an unknown action, not in the world's
language (no-sense), a reference that resolves to nothing, an uncertain reading (margin under tau or abstention).
