# The matheditor world (VSS Diagram Editor, spec section 16; Table 13 rows "Formulas")

The third world on the same reader: spoken formulas read into a TREE (16.2), ambiguous formulas reported with every reading (16.3),
and the editing commands of formula widgets (16.4).

| file | content |
|---|---|
| `generate.py` | legend, kinds lexicon, the expression generator (depth-controlled trees of operators), the verbaliser (four spoken families, operator templates, closers, pauses), the matheditor commands (templates x prefixes), the splits, `COVERAGE.md`; writes a world folder that `sop check` validates and `sop train` trains |
| `parse_batch.mjs` | the bridge to the app's reference parser and executor (`app/src/formula/parse.js`, `commands.js`): ONE implementation of the scope rule builds the gold and runs in the app |
| `evaluate.py` | the Table 13 formula rows on WHOLE trees (`trees`) and the edit suite from the reader's wires (`edits`); see its header |
| `COVERAGE.md` | sentences per depth, readings, family, operator and role, template; commands per event and role; the evaluation files |

Run: `python3 generate.py --out <dir>/matheditor --n 20000 --n_eval 400 --seed 0` (the folder must be named `matheditor`; node >= 18 is
needed: the readings come from `parse.js`). Then `tool/bin/sop check --legend <dir>/matheditor/legend.json <dir>/matheditor/examples/*.sop`.

## How the gold is made

1. A tree is drawn at an exact depth (depth = the number of operator levels; "x squared plus one" is 2): plus, minus, times, fraction,
   power, subscript, root (square, cube, n-th), function application (sin, cos, tan, log, ln, exp, f, g, h), parentheses, absolute
   value, negation, sum, product, integral; relations (equals, less, greater, approximately, implies) at the top.
2. It is verbalised in a FAMILY (textbook, informal, delimited, spelled: letter names "ex", "why" as a speech engine writes them) through
   operator TEMPLATES ("over", "divided by", "all over", "the fraction ... over ...", "the fraction with numerator ... and denominator
   ...", "squared", "to the", "to the power of", "raised to the", ...) and closers ("end fraction", "end exponent", "end root",
   "end sub", "end sum", "end absolute value", a pause ",", "the quantity ... end quantity", spoken parentheses). Three verbalisations
   per tree: two free ones (closers only where a family habitually uses them) and one closed one (a closer wherever a scope is open).
3. `parse.js` returns the readings of the normalized words. The sentence is kept only if the drawn tree is one of them (rejections are
   counted in COVERAGE.md; zero at the shipped settings). One reading: gold = that tree. Two to four: gold = all of them, as
   `root=$a | $b` with `_readings=n` and `_intended=k` (the reading the generator drew; not part of the frame).
4. Commands are realised from templates and parsed back by `parseCommand`; kept only when the frame is the generator's frame.

The nested levels (16.2): each operator is an event wire whose roles are the tree roles of Table 11 and hold either a word (a leaf) or
a reference to the next level, exactly as `says` holds its scope:

```
@w1 expr
_text=x squared plus 2 x minus 1 all over 2 a
root=$w2
@w2 fraction            numerator=$w3  denominator=$w6
@w3 minus               left=$w4  right=1
@w4 plus                left=$w5  right=$w7
@w5 power               base=x  exponent=2
@w7 times               left=2  right=x
@w6 times               left=2  right=a
```

(one wire per line here for brevity; the files have one key per line). Reserved lines on the top wire: `_family`, `_tree_depth`,
`_spoken` (the words before normalization), `_template` = `<family>:<template ids>` (the formulation signature).

## Splits

| file | split (`split_hints.json` file_splits) | what it holds |
|---|---|---|
| `train.sop` | train (+ held-out sentences, 10% by the tool's hash) | formulas of depth 0-2 (about 12% ambiguous) and commands |
| `eval_heldout_formulations.sop` | heldout_formulations | formulas using a held-out (family, template) pair; commands of held-out (template, prefix) combinations |
| `eval_unseen_depth.sop` | heldout_depth | depth 3, every hop (parent operator, role, child kind) seen in training, every formulation pair seen (rule 29) |
| `eval_new_identities.sop` | new_identities | variables q, w, psi, rho and numbers 13, 17, 19, 60, never in training |
| `eval_ambiguous.sop` | ambiguous | ambiguous sentences of seen formulations, not in training |
| `raw/edit_suite.jsonl`, `.txt`, `.sop` | (not trained) | a command on a formula with the expected formula after the edit; `.txt` = the commands for `sop formalize`, `.sop` = their gold wires |

## What the current reader cannot decode (stated, and what the DGX needs first)

The tool trains on this world (the targets compile nested wires and alternatives: `world.Compiler` recurses into `$refs` and sums
`|` alternatives / sqrt(n)), and the smoke run accepted it. But the DECODER (tool/sop/infer.py `Reader`, mirrored by
app/src/vss/reader.js) reads only `says* -> [not] -> event`, with role fillers that are a word, a negated word or an entity. Here:

1. **An event inside a role of an event** (fraction -> numerator -> plus -> ...): not decoded at all. The reader writes a word or an
   entity where the gold has an expression wire, so every formula and every command with an expression value is FULL-wrong by
   construction; the lexical baselines are 0 for the same reason. `world.frame_of` represents a nested wire only as `["wire", <type>]`
   and reports the shape as "ok", so the tool's REPORT says "Shapes the v1 decoder cannot read: none" for this world: that line is
   wrong here, and FULL compares only the top level even after the decoder is extended.
2. **Alternatives (`|`)**: compiled into the targets, never emitted by the reader (a low margin becomes `_status=abstain`), so
   "ambiguous reported as such" cannot be met.
3. **Nesting below an operator other than says / not**: the depth machinery (`rep ** k`, `reader.level_openers`, the depth estimators)
   is for reporting levels only. Declaring this world's openers in `reader.level_openers` would make the opener-kind estimator force a
   reporting depth of k on a sentence with k operators, so the legend declares them in a separate `tree_levels` block instead.
4. Implicit multiplication ("two x") has no operator word, so its wire has no predicate term; the event type must come from the fit.

The decoder extension with its criteria is in `training/TODO_DGX.md`. Until it exists, the app reads formulas with
the reference parser (labelled "reference parser" on screen).

## Design choices, stated

- One kind per token (rule 20, as the diagram world): "a" is a variable (so "make it a fraction" carries a token of kind VAR), "i" is a
  variable (so "i want you to" carries one too); "fraction", "root", "exponent", "end" serve as opener, closer, target head or position
  and have their own kinds.
- Role values are tokens of the normalized sentence (the reader deposits the identity of the token it reads): numbers as digits,
  letters as letters, function names short ("sine" -> sin). In commands the wrapper and position values are the words said
  ("brackets", "beginning"); the frame maps them (parentheses, start).
- The tree is semantic: "the quantity ... end quantity" groups without a node; spoken parentheses are a paren node, except right after a
  function or root opener, where they belong to the operator.
- Data are generated only (no data from others). Paraphrases by a large model (spec 16.5, as 4.2) are not made here: they need the API
  on the DGX and are listed in the TODO.
