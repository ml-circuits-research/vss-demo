# app/src/formula/: formula widgets (spec section 16)

A formula widget is a diagram component that holds one expression as a TREE. It is dictated or typed, read into the tree, rendered, and
edited by commands ("put the whole thing over two a", "replace the exponent with n plus one", "wrap the second term in parentheses").
Every module except `view.js` is DOM-free and tested in node: `node app/tests/formula.mjs`.

| file | content |
|---|---|
| `tree.js` | the tree (plain objects, roles of the matheditor legend, spec Table 11), paths as addresses (`[]` = the whole formula, `["numerator", "left"]`), precedence and the grouping rule shared by LaTeX and MathML, MathJSON export (the stored form, spec 16.1), tree <-> SOP wires, `FormulaDoc` (tree, cursor, selection, last touched, undo / redo: every edit is one transaction with its label and reason) |
| `latex.js` | tree -> LaTeX (one deterministic string) and LaTeX -> tree for that subset plus common hand-typed forms; `fromLatex(toLatex(t))` equals `t` (tested on 600 random trees) |
| `mathml.js` | tree -> MathML Core markup, with `data-path` on every node (taps and highlights) |
| `parse.js` | the deterministic REFERENCE reader of spoken formulas (all readings of an ambiguous one) and of matheditor commands; the scope rule is stated in its header |
| `commands.js` | target descriptions resolved as tree queries, edits planned (`plan`, side-effect free, destructive edits flagged) and executed (`execute`, one transaction); `frameFromWires` turns the matheditor reader's wires into a frame; `handleInput` / `pickReading` = the fallback path when no model is loaded |
| `view.js` | the widget in the DOM: MathML rendering, the LaTeX line, reading buttons for ambiguous input, a text field, undo; 44 px touch targets, horizontal scroll for wide formulas, light and dark |

## Rendering: MathML Core, no library

`mathml.js` writes MathML Core (math, mrow, mi, mn, mo, mspace, mfrac, msup, msub, msubsup, msqrt, mroot, munderover). MathML Core is
rendered natively by Chromium 109 and later (Chrome, Edge, Opera, Samsung Internet; January 2023), by Firefox and by Safari / WebKit
(iOS included) in their current versions, so the widget needs no library, works offline and fits the single-file build. Not checked here
in a browser (node only): the markup is tested for well-formedness; a visual check on the three engines belongs to the app's browser
test pass.

**Deviation from spec 16.1, with its reason.** The specification names KaTeX (rendering) and MathLive (mouse and keyboard editing).
This module renders MathML Core instead (no runtime dependency, nothing to vendor, native on every current engine), and keeps LaTeX
as the exchange format: `toLatex` for export and copy, `fromLatex` for import, so MathLive (MIT) can be added later as an optional
keyboard editor without changing the tree (MathLive reads and writes LaTeX). MathJSON is produced by `toMathJSON` for storage.

## The reader: model first, reference parser as the fallback

When the matheditor model is loaded (`app/model/matheditor/`, from the DGX), sentences are read by the VSS reader. Until then, and
whenever it is absent, `parse.js` reads them and every result carries `source: "reference parser"`, shown in the widget's status
line. The same parser builds the world's gold (`training/worlds/matheditor/parse_batch.mjs`), so the gold and the fallback agree by
construction. Today's VSS decoder cannot read nested expression wires (see `training/worlds/matheditor/README.md`): until its decoder
extension is trained and exported, the fallback is what the demo uses for formulas.

## Ambiguity held open (spec 16.3)

"x plus one over two" has two readings and both are returned; the widget shows both and asks ("the first", "the second", or a tap).
The scope rule, in short (the full statement is the header of `parse.js`): the denominator and numerator of "over", the exponent of
"to the", the argument of a function or root and the body of a sum have a TIGHT and a WIDE reading unless the words decide; "all over",
"the fraction ... over ...", "the fraction with numerator ... and denominator ...", the closers ("end fraction", "end exponent", "end
root", "end sub", "end sum", "end absolute value"), a pause (","), "the quantity ... end quantity" and spoken parentheses decide.
Juxtaposition binds tighter than "over" ("one over two x" = 1/(2x)), stated, not ambiguous.

## Commands (spec 16.4)

insert / type / add (with a joiner: plus, minus, times, over; at the end, at the start, after / before a target, or at the cursor),
replace / change / set / substitute (a value expression read as a nested formula, or an operator word: "change the plus to minus"),
delete (removing brackets keeps their content), wrap (parentheses, absolute value, square root, fraction: "make it a fraction",
"put the whole thing over two a"), move (to a target, or left / right / up / down in reading order), select, factor out, swap the sides
(less becomes greater), undo, redo. Targets: role names ("the numerator", "the exponent of x"), ordinals ("the second term", the terms
of the shallowest sum), sides, the whole thing, operator names, symbols ("every x"), it / that / this (the last touched part), the
selection. Several matches give status `choose` with the candidates highlighted; a destructive edit can be previewed with `plan`.
