# app/src/text/: text widgets, dictation mode, textedit commands (spec section 14)

DOM-free modules (doc, commands, dictation, textnorm) tested in node; `view.js` is the only DOM code and makes no decision. No runtime
dependency beyond `app/vendor/double-metaphone.js` (already vendored). Assets (the textedit model, its normalize.json and
command_threshold.json under `app/model/textedit/`) are passed in by `src/assets.js`; these modules never fetch.

Deviation from spec 14.1, by the author's instruction for this step: the document model is our own (`doc.js`), not ProseMirror. It keeps
what the specification asks of the toolkit: a schema-like block model, every change a transaction applied by code, its own undo history.

## doc.js

`new TextDoc()`, `TextDoc.fromText(src)` (`# ` / `## ` / `### ` headings, `- ` bullet items, `1. ` numbered items; a blank line separates
paragraphs, a newline separates lines of one paragraph), `TextDoc.fromJSON(o)`.
- Reading: `text()` (blocks joined with "\n": global offsets), `length`, `blocks`, `blockStart(i)`, `blockRange(i)`, `locate(pos)`,
  `slice(from, to)`, `marksAt(pos)`, `charMarks(pos)`, `cursor`, `selection`, `selectionRange()`, `hasSelection()`, `lastRange`.
- Changes (each one transaction, or part of the enclosing one): `insertText(pos, text, marks?)`, `splitBlock(pos, "paragraph"|"line")`,
  `deleteRange(from, to)`, `replaceRange(from, to, text)`, `addMark(from, to, key, value)`, `removeMark(from, to, key|null)`,
  `mapChars(from, to, fn)`, `setBlocks(from, to, props)`. Marks: bold, italic, underline, strike, color, highlight, size (small / normal /
  large / huge). Blocks: paragraph, heading (level 1-3), list_item (bullet / numbered), align, brk.
- `transact(label, fn)`: nested calls join the outer transaction; `undo()`, `redo()`, `lastTransaction()`, `undoStack`.
- `setSelection(anchor, head)`, `setCursor(pos)`: not undo entries.
- `toJSON()`, `toHTML()`, `toOutline()` (the tests' compact form: `**bold**`, `*italic*`, `__underline__`, `~~strike~~`, `{red|x}`,
  `{hl:yellow|x}`, `{size:large|x}`, ` [center]`).
- `unitRanges(doc, unit)`: the ranges of character / word / sentence / line / paragraph / list_item / everything (definitions in the code).

## commands.js

- `plan(doc, frame, info, {normalize, choose})` -> `{event, slots, steps, questions, resolution, destructive, explain}`. Nothing changes.
  `questions`: `which` (several matches; `candidates` to highlight, then `plan(..., {choose: k})` or `choose: "all"`), `no-match`
  (reported), `missing`.
- `execute(doc, plan, {confirmed})` -> `{applied, pending?, reason?, read?, transaction}`. A destructive plan (delete, replace) is not applied
  until `confirmed: true`: the caller shows `plan.resolution` first. All the content steps of one plan are one transaction.
- `resolveTarget(doc, slots, opts)`, `findMatches(doc, text, normalize)` (stages exact -> normalizer -> phonetic), `slotsOf(frame, info)`,
  `selectWidget(widgets, frame, {current})` (Table 9 `widget`, by label).
- Ordinals: first..fifth / first_N from the start; last / last_N from the end; this, previous, next (and _N) from the cursor.
  it / that = the selection, else the last change; everything; selection.

## dictation.js

`createDictation({reader, table, normalize, calibration})`; `table` = `normalize.json`'s `dictation` block; `calibration` =
`command_threshold.json` (`{threshold, chip_band}`); `reader.read(text)` -> `{status, margins, frame}` (src/vss.js, or a fake in tests).
- `handle(utterance)` -> `{type: "start" | "stop" | "pass" | "command" | "insert", ...}`, never a side effect.
- `insert(doc, pieces, chip?)` (content at the cursor, one transaction, replaces a selection; spacing and capitals as in the code),
  `applyChip(doc, chip)` (undo of the inserted words if still the last change, then the command), `start(widget)` (a click), `stop()`
  (Escape), `transcribe(utterance)`, `mode`, `widget`.
- `decide(reading, calibration)`: command if status ok and min margin >= threshold; chip if ok / abstain within `chip_band` below; else
  text. Without a calibrated threshold an ok reading only gets the chip (never executed on its own). `minMargin(reading)`.

## textnorm.js

`createTextNormalizer(table)` -> `normalize(text)` -> `{tokens, info: {labels, numbers}}`, the port of
training/worlds/textedit/normalize.py (parity: app/tests/dictation.mjs); `normalize.numbers(words)` (number words to digits).

## view.js

`mountTextWidget(box, doc, {onTap, candidates, dictating})` -> `{element, update(opts), destroy()}`; `renderTextWidget(container, doc,
opts)`. Draws blocks, marks, the caret, the selection and numbered candidates; reports taps as offsets; contenteditable is not used.

## Tests

`node app/tests/text_targets.mjs` (Table 13 "text target resolution", 100% pass) and `node app/tests/dictation.mjs` (mode switching,
spoken punctuation and layout, threshold decisions with a fake reader, the chip, normalizer parity, dictation end to end).
