# The editor's interface as a set of tabs, with a chat input and an assistant tab (requirements, 2026-10-26)

Status: requirements written by the DGX session from the owner's own words (2026-10-26, this session's chat) and the coordinator's
answer D10 (responses.md). To be built by a separate thread (the owner: "a Sonnet agent in a separate thread"; it works through the
API and does not touch the training runs). Not built yet. Spec section 11 is changed by the owner's decision; the deviation is recorded
in STATUS.md ("Interface (questions Q6, responses D10)").

## 1. What the owner asked for (verbatim intent, translated)

- "The UX is a bit unclear about what is happening."
- Next to the microphone, a **paperclip** that offers example texts; a click puts the text into the input, so one sees quickly what the
  demo can do.
- **Tabs by default.** "What was understood" includes the diagram editor: the editor is only one of the tabs; there is a tab of the
  **history** of what was recognised, a tab of the **actions understood**, and the other existing panels.
- **The assistant is a tab of detected intents and their results.** "In the chat I write what I want and things happen through the
  tabs." Later a small assistant will recognise intents and call (or pretend to call) tools; now the tab must exist and show the
  results of what was recognised.

## 2. Layout

```
+-----------------------------------------------------------------------------------+
| topbar: brand · model badge · mode chip · Script · Settings · About               |
+-----------------------------------------------------------------------------------+
| [Diagram] [History] [Actions] [Assistant] [Formula/Text]* [Timeline]* [Circuit] [SOP] [Log]   |  <- main tabs
+------------------------------------------------------------+----------------------+
|                                                            | live panel (desktop) |
|   active tab content                                       |  Reading (frame with |
|   (Diagram = the canvas + canvas tools, as today)          |  margin bars), Plan, |
|                                                            |  Geometry            |
+------------------------------------------------------------+----------------------+
| dock: reading line · answer chips                                                 |
| [clip] [mic] [ chat input .............................................. ] [Run]  |
+-----------------------------------------------------------------------------------+
* shown only when relevant, as today (widget / timeline tabs)
```

Kept from spec section 11 (D10, both are conditions, not suggestions):
1. **The live panel** with its three layers (frame with margin bars, plan, geometry) stays visible next to whatever tab is active on
   desktop (>= 821 px), in a column that does not scroll away. On a phone it becomes a tab ("Reading").
2. **The canvas of the active purpose** (diagram, scene, animation) stays visible while the person types: after a command, the app does
   NOT switch away from the Diagram tab by itself (the dialog's answers, e.g. "which one, a or b?", highlight components on it). History,
   Actions and Assistant replace the canvas only on the person's click. A new entry in a tab that is not shown gets a small count badge
   on the tab.

## 3. The tabs

| tab | content | source in the code |
|---|---|---|
| Diagram | the canvas and its tools, exactly as today (`#stage`) | unchanged |
| History | one row per input, newest first: time, the input as typed / said (source icon: typed, voice, script, sketch, button), the text actually read (after normalizer / corrector), world, status chip (ok / abstain / unknown-event / no-sense), the event and roles in one line, the minimum margin, the residual. A click on a row puts its input back into the chat input (not run). | `S.history` (already pushed in every handler of `src/main.js`: lines with `S.history.push`); extend the entry with `world`, `frame`, `minMargin`, `residual`, `time` |
| Actions | Table 8 of the specification, one line per reading: sentence, status, the behaviour taken (executed / asked / defaulted / refused), the rule that decided it in the words of the table (the `rule` string `decide()` returns), the plan's steps (`explain`), and the queries (kind and about) | `S.last.decision` (`{action, line, rule, questions, notes, queries}` from `src/dialog.js decide`), `S.last.plan.steps` |
| Assistant | the detected intents and their results. Per reading: the intent (`<world>.<event>`), its parameters as a tool call written as text, e.g. `create(object="red box", text="payments", region="top_left")`, the outcome of the editor (executed / asked / refused) and, for queries, what is asked. A header line on the tab: "Shows how a request is read and which call it would make; not an agent." Later (responses D9): the "Requests" demo on the SNIPS worlds with one or two real keyless calls (Open-Meteo, Wikipedia search); until those worlds are exported from vss-vs-bert, the tab is fed by the editor's own worlds. | `S.last.best.result.frame` (`{event, roles}`), the roles' fillers as in ARCHITECTURE.md ("Reader result") |
| Formula/Text, Timeline | as today (`widget`, `timeline` tabs), shown when relevant | unchanged |
| Circuit, SOP, Log | as today | unchanged |
| Reading, Plan, Geometry | in the live panel on desktop; tabs on a phone | unchanged renderers (`ui/panel.js`) |

## 4. The examples paperclip

- A button with a paperclip icon left of the microphone (`#btn-examples`, `aria-label="Examples"`), opening a small sheet grouped by
  purpose: Diagram, Text, Formula, Animation, Romanian, and "Not understood (on purpose)" (a few planted sentences, e.g. "rotate the
  box 45 degrees", "how many boxes are there?", which must be refused or asked, never executed).
- A click puts the sentence into the chat input and focuses it; Enter runs it. Never run on click.
- The examples live in one data file (`app/src/examples.js`, an exported array `{group, text, note}`), so that they can be updated when
  the trained models land. Mark each example with the world it needs; hide a group whose world is not installed (`app/model/index.json`).
- The three examples of today's empty-canvas hint (`#hint-examples`) move into the same file.

## 5. Rules for the thread that builds it (the repository's rules apply; AGENTS.md)

- Files it owns: `app/index.html`, `app/app.css`, `app/src/ui/*`, new `app/src/examples.js`, new tab renderers under `app/src/ui/`, and the
  UI wiring in `app/src/main.js` (tabs, `openPanel` / `selectTab`, `refresh`, `showAnswer`, `S.history` entries). It does NOT edit
  `app/src/vss/*` (the reader's mirror, under parity tests), `app/src/dialog.js`, `app/src/queries.js` (the DGX session's; ask in
  questions.md if something there is needed), `tool/`, `training/`, `experiment/`, `app/model/`.
- No build step for development, no run-time dependency; vendored libraries only as ARCHITECTURE.md says. English on screen and on disk.
- `app/dist/vss-editor.html` is a build output and is not tracked (responses D15); `app/precache.json` is: never merge it by hand;
  after a rebase, rebuild with `node app/build/build.mjs` and commit precache.json.
- Tests: `bash app/tests/run_all.sh` PASS; `app/tests/browser_check.mjs` PASS (currently 124/124; it needs Playwright: `npm i
  playwright@1.49.1` in a scratch folder and `NODE_PATH=<that>/node_modules node app/tests/browser_check.mjs`). Its `panel(tab)`
  helper clicks `#btn-panel` on a phone and then `.tabs [data-tab="<tab>"]`: keep these selectors working or update the helper in the
  same commit, and add checks for the new tabs (History row after a command, Actions line with the rule, Assistant call text, the
  paperclip filling the input without running it, the canvas still shown after a command).
- No paid API. The keyless calls of D9 come only with the Requests demo, after its dependencies (D9 (1)-(3)).
- Commit and push often; a commit message says what changed and which test passed.

## 6. Out of scope here

Intent recognition beyond the readers' worlds, tool execution, any LLM; the SNIPS worlds and the typer (D9: exported by vss-vs-bert first);
changes to what the reader reads.
