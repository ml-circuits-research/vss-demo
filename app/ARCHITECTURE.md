# app/ — architecture and module contract

`app/` is the PUBLIC part of the repository: a static browser application with no server, for desktop and mobile. Everything it needs
at run time is inside `app/` (code, vendored libraries with their licences, exported models). Nothing in `app/` imports from
`training/`, `tool/` or `experiment/`; those produce `app/model/` and are never shipped.

Two ways to run it, both without a server of our own:
- `app/dist/vss-editor.html`: one self-contained file (scripts, styles and models inlined), built by `node app/build/build.mjs`; opens
  from the file system (file://) on desktop and mobile, works offline.
- `app/index.html` with its folders on any static host (GitHub Pages, a USB stick behind any static server); a service worker
  (`app/sw.js`) caches it for offline use and a manifest makes it installable on a phone.

## Rules for every module

- ES modules, no build step needed for development, no npm dependency at run time. A vendored library goes under `app/vendor/<name>/`
  with its licence file and a line in `app/vendor/README.md` (name, version, licence, source URL). Only permissive licences (MIT, BSD,
  Apache-2.0, ISC, CC0).
- Core logic is DOM-free and tested in node (`node app/tests/<name>.mjs`, exit code 0 on pass, a one-line summary). DOM code lives in
  separate `view.js` / `ui/*.js` files that take a container element and the shared context; they never contain decisions.
- Deterministic: the same input and state give the same output. Every decision carries its reason as text (for the explanation panel).
- Loading: modules never call `fetch` themselves; assets (models, tables, dictionaries) are passed in by `src/assets.js`, which reads them
  either from the inlined bundle or by fetch, so the single-file build works from file://.
- Text on screen and on disk in English. No em dashes in documents.

## Shared data shapes

- **Reader result** (`src/vss.js`, mirrors `sop formalize`): `{sop, wires, frame: {event, roles, neg, speakers, depth, scope}, margins,
  presence, status: ok|abstain|unknown-event|no-sense, residual, unplaced, tokens, timings}`. A role filler is `["word", w]`,
  `["negword", w]` or `["entity", head, attr|null, det|null]` with attr `["word"|"negword", a]`.
- **Worlds**: each world has its own exported model under `app/model/<world>/` (diagram, textedit, matheditor, and later scene). The
  world's legend (events, roles, kinds) is in its `model.json`. Several readers run side by side (spec section 9 of the tool: dispatch
  by fit) through `src/worlds.js`.
- **Scene** (`src/editor/scene.js`): components `{id, word, kind, label, color, size, style, box: {x, y, w, h}, parent, order, text?,
  formula?}`, connectors `{id, source, target, kind, style, label, points?}`, locks, selection, lastTouched, undo / redo.
- **Plan** (`src/editor/planner.js`): `{steps: [{op, explain, ...}], questions, blocked, resolutions, event}`; `execute(scene, plan)`.
- **Circuit** (`src/segment/`): the SOP file of several wires with links (spec 15.2) and an execution order.

## Layout

```
app/index.html, app.css, manifest.webmanifest, sw.js, icons/
app/src/main.js                 wiring: input -> normalize -> correct -> segment -> read -> circuit -> resolve/plan -> execute -> render
app/src/assets.js               asset loading (bundle or fetch)
app/src/worlds.js               several readers, dispatch by fit
app/src/vss.js, src/vss/        the reader (parity-tested against Python)
app/src/normalize.js, correct.js, form.js   normalizer, classic correctors, the VSS form-level corrector (spec 12.4)
app/src/speech.js               speech engines and alternatives (spec 13)
app/src/dialog.js               reader report -> editor behaviour (spec 11, Table 8)
app/src/editor/                 scene, resolver, geometry, planner, render, interact, layout, router, export (spec 8-10)
app/src/segment/                segmenter, SOP circuit, order, conflicts (spec 15)
app/src/text/                   text widgets, dictation mode, textedit commands (spec 14)
app/src/formula/                formula widgets, tree, LaTeX, MathML, edits (spec 16)
app/src/sketch/                 sketch pad, stroke recogniser, scene pass (spec 17)
app/src/script/                 long scripts: sections, checkpoints, document view (spec 18)
app/src/animate/                temporal frames, timeline solver, player, export, invariants (spec 19)
app/src/ui/                     panels (frame / plan / geometry / SOP / circuit), input bar, settings, about, responsive layout
app/model/<world>/              exported models (sop export-web) + normalize.json
app/vendor/                     third-party code with licences
app/build/build.mjs             the single-file build
app/tests/                      node tests; app/tests/run_all.sh runs every one
```
