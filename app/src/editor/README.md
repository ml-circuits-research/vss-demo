# app/src/editor: the diagram engine (spec sections 8, 9, 10, 11)

The semantic layer (pure, tested in node):

- `scene.js`: the diagram as the world's database: components (word, kind, label, colour, style, size, box, parent), connectors,
  locks, the last-touched set (pronoun rule), undo / redo snapshots.
- `resolver.js`: descriptions of the frame to components: determiners, labels as heads, pronouns, negated attributes, words that
  name the same thing (box / step / process); every resolution carries the rule it used, for the explanation panel.
- `geometry.js`: placement from the frame's slots with the Kiwi (Cassowary) solver; non-overlap by a search that reports any move.
- `planner.js`: the action schemas of the Level 1 events: preconditions as questions, prohibitions as locks, the plan as one undo
  entry. `execute` applies a plan through `ops.js`.
- `ops.js`: the engine operations of spec Table 7 as one API, used by the planner and by the manual interaction, so both share one
  undo stack: `create, remove, move, moveBy, resize, set, connect, group, ungroup, layout, align, distribute, order, lock, unlock,
  lockedBy, query, route, undo, redo`, and transactions `begin / commit / rollback / transact` (one undo entry per gesture or request).
- `layout.js`: row, column, grid, circle; tree (tidy tree over a spanning forest); flow_lr and flow_td, a layered (Sugiyama) layout
  written for the editor: cycle removal by depth-first search, layering by longest path, dummy nodes, crossing reduction by
  barycentre sweeps with transposition, coordinates by isotonic regression towards the neighbours. Containers are laid out with their
  members and fitted to them. Also align and distribute.
- `router.js`: orthogonal connector routing: a shortest path (A*) on a visibility grid around the components' boxes inflated by a
  margin, with a penalty per bend and per channel already used; ports at the side middles, then spread along a side shared by several
  connectors; containers holding an end are open, other containers are obstacles. Re-routing after any change keeps "no connector
  crosses a component". A quick mode (one pass) serves the live preview while dragging.

The drawing and the interaction (DOM, browser only; no decisions):

- `render.js` (pure, also runs in node): the scene as a virtual SVG tree and as an SVG string. Default looks per kind (rounded box,
  diamond, stadium, cylinder, horizontal cylinder for a queue, folded page, figure, system box, server, cloud, container and lane with a
  title, note, free text, circle, square, triangle, star, hexagon), the twelve colours, styles dashed / dotted / thick / thin, labels
  wrapped and shrunk to fit (a deterministic width metric), arrowheads, connector labels, selection handles and ports, numbered
  candidate highlights for a question, lock badges, corrected labels underlined. Theme through CSS variables (`--bg --fg --muted
  --accent --line --sel --warn --ok` and `--c-red` ... `--c-white`, defined by app/app.css; the engine has fallbacks).
- `view.js`: `createView(svgElement, scene, {onChange, onSelect, onEditLabel, theme})` returns `{render({highlight, question,
  corrected, animate}), fit(), zoomBy(f), setScene(scene), destroy(), screenToScene(x, y), editLabel(id)}`. A keyed diff: one group
  per component and per connector, rebuilt only when its content changes; a move only updates a transform. Moves made outside a gesture
  are animated. Components with `text` or `formula` get a persistent `<foreignObject class="vss-slot" data-id>` sized to the box,
  left empty for the text and formula modules.
- `interact.js`: Pointer Events for mouse, touch and pen: select, multi-select (shift / ctrl / cmd, long press on touch, rubber
  band), drag (into and out of containers), resize with handles, connect by dragging from a port (onto a component, or onto the canvas
  to create a connected box), pinch zoom and pan, wheel pan and ctrl + wheel zoom, double click or double tap to edit a label;
  keys Delete, ctrl+Z, ctrl+shift+Z / ctrl+Y, arrows, Escape, ctrl+A, + - 0, F2. Locks are checked before a gesture changes anything.
  Every gesture is one transaction of `ops.js`, then `onChange("manual", {op, ids})`; a refusal is `onChange("blocked", {op, ids, text})`.
- `export.js`: `exportJSON(scene)` (the semantic model, format "vss-diagram" version 1), `importJSON(text)` (validated; routes
  computed when missing), `exportSVG(scene, {theme})` (standalone, colours inline), `exportPNG(scene, scale)` (canvas from the SVG,
  browser), `download(name, data, type)`.

## Deviation from spec section 9 (and 8.3): our own renderer, interaction and layout, no diagram library

Spec section 9 recommends building the engine on maxGraph (Apache-2.0), with JointJS as the alternative, chosen on a comparison
prototype; section 8.3 names ELK.js for automatic layout. Decision (coordinator, 2026-10-24): the renderer and the interaction are
written for the editor in SVG with no diagram library, and the layered layout and the orthogonal router are our own. Reasons:

1. The application must work as one self-contained HTML file opened from file:// and on a phone; a diagram library adds hundreds of
   kilobytes to the single file and its own event model to reconcile with touch, pinch and the input bar.
2. The semantic model (kinds, labels, locks, the diagram as the world's database, one undo stack for voice and hand) is ours anyway;
   with a library it would be mirrored into the library's cells and kept in sync.
3. ELK.js is licensed EPL-2.0 (or GPL-3.0), outside the permissive licences allowed in app/ (ARCHITECTURE.md); dagre (MIT) was
   acceptable but our own layered layout passes the layout and routing suite and keeps the code in one style.

A maxGraph comparison prototype stays a later, optional step: it would run the same scenario and layout suites
(`app/tests/scenarios.mjs`, `app/tests/layout.mjs`) against a maxGraph rendering of the same scene, and its result would be recorded
here with the library's version and licence.

## Tests

- `node app/tests/scenarios.mjs`: the planner and solver scenarios (spec Table 13).
- `node app/tests/layout.mjs`: the layout and routing scenarios (Table 13: overlaps after layout and connectors crossing components,
  0 and 0 on the suite): 23 diagrams of different shapes and sizes plus checks of the layered layout and of re-routing (`-v` prints a
  line per diagram).
- `node app/tests/engine.mjs`: render output (looks, palette, styles, labels, arrowheads, selection, highlights, locks, slots, view
  transform, keyed-diff signatures), export / import round trip, transactions and undo.
- `node app/dev/engine_check.mjs [dir]`: the engine in Chromium through Playwright (a development tool, not shipped): the demo page
  `app/dev/engine.html` at desktop and phone size, the gestures, PNG export, screenshots.
