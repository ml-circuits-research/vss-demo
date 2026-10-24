# web/editor — the semantic layer of the editor (spec sections 8, 9, 10)

Pure modules, no rendering (the diagram library of step 6 renders the scene):

- `scene.js` — the diagram as the world's database: components (word, kind, label, colour, style, size, box, parent), connectors, locks,
  the last-touched set (pronoun rule), undo / redo snapshots.
- `resolver.js` — descriptions of the frame to components: determiners, labels as heads, pronouns, negated attributes, words that name
  the same thing (box / step / process); every resolution carries the rule it used, for the explanation panel.
- `geometry.js` — placement from the frame's slots with the Kiwi (Cassowary) solver: region, relation + landmark (+ amount), fraction +
  anchor, anchor, direction + amount, the declared default; required: inside the canvas; non-overlap by a search that reports any move;
  the constraints as text.
- `planner.js` — the action schemas of the twenty Level 1 events: preconditions as questions (no match, several matches, missing role),
  prohibitions as locks checked before every step, the plan as one undo entry; simple layouts (row, column, grid, circle, align,
  distribute, flows by connector levels) until ELK.js at step 8.

Test: `node web/tests/scenarios.mjs` — fifteen scripted scenarios, twenty checks (spec Table 13, "planner and solver scenarios"): at
preparation all pass. The frames are written in the reader's format, so the suite runs without a trained model; the end-to-end version
(sentence -> reader -> plan) uses the same scenarios once a model is exported.
