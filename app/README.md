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

## What you can do

Everything below works in the one-file build (file://) and in the hosted folder, with a mouse, a finger or a pen, on desktop and phone.

- **Draw by saying or typing**: "add a database called orders in the top left". The reading strip under the canvas marks what each word
  did; the panel (the lines button) shows the frame, the plan, the geometry, the SOP text and a log.
- **Several commands at once** (spec 15): a paragraph ("Add a database called orders. Then connect it to the api.") is cut into units,
  each unit is read, and the units are linked into one circuit and run as one undo step. The strip shows every unit; the Circuit tab
  shows the circuit; a conflict between two units is asked before anything runs.
- **Scripts** (spec 18): the document button, or pasting a long text (a heading, several paragraphs, or more than 600 characters) into
  the input, opens the script view: the diagram is built section by section, every sentence is marked with what it did, and "Back to
  here" returns to a section's checkpoint.
- **Text widgets and dictation** (spec 14): the text box button (or "add a note called Summary" then "start writing in Summary", or a
  double click on a note) starts writing; the chip in the top bar says so. Spoken punctuation and layout work ("full stop", "new
  paragraph", "bullet", "literally comma"). "Stop writing" or Escape goes back to commands. Without a textedit model (the case today)
  everything said or typed in a widget is written as text, and the editor says so; with app/model/textedit installed, the textedit reader
  decides command or content with its calibrated threshold.
- **Formulas** (spec 16): the square-root button or "start a formula" opens a formula widget; say or type "x plus one over two" and both
  readings are offered as choices; edits such as "replace the exponent with n plus one" change the tree. Without a matheditor model the
  formula is read by the reference parser, and the widget and the panel say so. Rendering is MathML. "End formula" or Escape closes.
- **Sketch** (spec 17): the pen button lays a sketch pad over the canvas; draw boxes, ellipses, diamonds, cylinders and arrows; Done
  recognises them and builds components and connectors as one undo step. The answer lists what was recognised and offers the two
  readings of an uncertain shape; the Plan tab lists every stroke group with its candidates and margin.
- **Animation** (spec 19): a timeline strip (play, pause, scrub) appears under the canvas when there is a film, and the Timeline tab
  shows one bar per unit with the constraints that placed it and the rules checked on every frame. With app/model/animation installed,
  sentences such as "the request goes from the user to the gateway, two seconds per hop" are read into the timeline; without it (the
  case today) a film is opened from a JSON timeline file (Export, "Open a timeline file", or "Open the example film"). Export saves the
  film as WebM video (when the browser can record a canvas), animated SVG or a JSON timeline.
- **Other languages** (vision/ADDENDUM_languages_2026-10-25.md): commands in Romanian, or Romanian mixed with English, are read into the
  same English circuits. Three routes, chosen in Settings ("Read commands with") or all at once (Automatic: the clearest reading wins;
  at equal status a trained reader before a dictionary): the English reader, the Romanian reader (diagram_ro, trained on Romanian
  grammar), and the Romanian dictionary into the English reader (no training; also covers English grammar with Romanian words). A
  dictionary for another language is a JSON file (training/worlds/DICTIONARIES.md) installed with training/export_app.py --dict. The
  reading strip says which route answered. The speech language can be Romanian.
- **Help improve the readers** (vision/ADDENDUM_qformalisation_2026-10-25.md): a local journal of readings the editor did not
  understand (names masked), a chip "this should have worked" on any refused or unsure reading, export as a file, and sending to an
  address you enter after a consent box. The About panel explains how sent journals become new questions of the legend and retrained
  models, with a person accepting every change. The sending is UNTESTED against a real endpoint.
- **Settings**: spelling correction (classic, VSS form level, off), the speech language, the thresholds that decide when a command runs,
  the theme. **About**: every world with its model (demo, development, or not installed) and the status of every module.

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
| widget, script and film rules (start a formula, which text widget, widget height, paste of a script) | `src/widgets.js` | 14, 16, 18 |
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

`node app/tests/browser_check.mjs [--shots <dir>]` runs the application in Chromium through Playwright (desktop and phone sizes, the
one-file build from file:// and the hosted folder through a small static server it starts): a command, a paragraph and its circuit, a
text widget with dictation, a formula with two readings, the sketch pad, the example film with its export, a script, Settings and
About, and no console error. It needs a browser, so run_all.sh does not include it; without Playwright it says SKIP. The installed
diagram model is a development model: wrong readings are expected there, the check is about the wiring.

## Privacy

Typed commands never leave the device. Voice uses the browser's speech recognition: in Chrome and Edge the audio may be sent to the
browser maker's service unless on-device recognition is available; the Settings panel says which applies. An on-device engine is a
planned step (spec 13.1).

## Layout (2026-10-26)

The screen is a set of tabs over one chat input (vision/UI_tabs_requirements_2026-10-26.md): Diagram (the canvas), History (every input with
its reading), Actions (the behaviour and the rule of Table 8 for each reading), Assistant (the recognised intent and the call it would
make, as text; not an agent), and the Widget, Timeline, Circuit, SOP and Log tabs. On desktop the live panel (reading with margins, plan,
geometry) is a side column next to every tab; on a phone these are tabs. The paperclip left of the microphone offers examples
(app/src/examples.js); a click puts one into the input without running it.

## The one-file build (not in git)

`app/dist/vss-editor.html` (about 15 MB, the self-contained build with the models inside) is not tracked (responses D15): build it on
demand with `(cd app/build && npm ci) && node app/build/build.mjs`, or take it from a tagged release where it is attached as an asset.
`app/precache.json` and `app/model/*` stay tracked.
