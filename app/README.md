# app/: the VSS Diagram Editor in the browser (public)

Draw diagrams by saying or typing what you want ("add a database called orders in the top left", "put a yellow note below it",
"connect each step to the next"). Every command is read in the browser by a VSS reader, a small model that turns the sentence into a
frame of roles with a margin for every decision, and the editor shows what it read, what it planned and why. There is no server.

This folder is the only part of the repository meant for the public. It contains code, vendored libraries with their licences, and the
exported models. It never reads anything from `training/`, `tool/` or `experiment/`.

## Run it

- **One file**: `dist/vss-editor.html`. Open it in a browser (double-click, or copy it to a phone and open it from the files app). It
  works offline; everything, including the models, is inside the file.
- **Hosted**: put the whole `app/` folder on any static host (GitHub Pages, a web space, a local static server). On the first visit
  the service worker caches it, and the phone can install it to the home screen (manifest.webmanifest).
- **Development**: serve `app/` with any static server (`python3 -m http.server -d app 8000`) and open http://localhost:8000. ES
  modules do not load from file:// in most browsers, which is why the one-file build exists.

Rebuild the one-file version after a change: `(cd app/build && npm ci) && node app/build/build.mjs`. esbuild is the only build
dependency and is never shipped.

## What runs where

| stage | module | spec |
|---|---|---|
| assets (bundle or fetch) | `src/assets.js` | 22 |
| readers of the installed worlds, dispatch by fit | `src/worlds.js`, `src/vss.js`, `src/vss/` | 7, tool spec 9 |
| normalizer | `src/normalize.js` (table: `model/diagram/normalize.json`) | 2, 3.2 |
| typed and speech correctors | `src/correct.js` (classic), `src/form.js` (VSS form level) | 12, 13.2 |
| voice | `src/speech.js` (Web Speech API; a slot for an on-device engine) | 13 |
| dialog | `src/dialog.js` | 11 |
| resolver, planner, placement, locks, undo | `src/editor/` | 8, 10 |
| rendering, touch and mouse editing, layouts, router, export | `src/editor/` | 8.3, 9 |
| segmenter and SOP circuit | `src/segment/` | 15 |
| text widgets and dictation | `src/text/` | 14 |
| formula widgets | `src/formula/` | 16 |
| sketch recognition | `src/sketch/` | 17 |
| long scripts | `src/script/` | 18 |
| animation | `src/animate/` | 19 |
| interface | `index.html`, `app.css`, `src/main.js`, `src/ui/` | 11 |

`ARCHITECTURE.md` is the module contract. `READER.md` documents the reader's export format and its parity test against Python.

## Models

`model/index.json` lists the installed worlds. Each entry says whether the model is a **demo** model (trained by the DGX protocol of
`training/TODO_DGX.md`, with its numbers in `STATUS.md`) or a **development** model (trained on a CPU only to exercise the
application; never measured, and the editor says so in its badge and its About panel). Models are written here only by
`training/export_app.py`.

## Tests

`bash app/tests/run_all.sh` runs every node test of the application (no browser needed); the parity test of the reader against Python
lives in `training/parity/` because it needs the Python side.

## Privacy

Typed commands never leave the device. Voice uses the browser's speech recognition: in Chrome and Edge the audio may be sent to the
browser maker's service unless on-device recognition is available; the Settings panel says which applies. An on-device engine is a
planned step (spec 13.1).
