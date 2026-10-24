# app/src/animate: the diagram in time (spec section 19)

An animation is a diagram plus time. The reader of the animation world (`app/model/animation/`, trained from
`training/worlds/animation/`) reads one sentence at a time; this folder turns the readings into a timeline, plays it, checks the rules on
every frame, answers questions about the film and exports it. DOM-free core, tested in node by `app/tests/animate.mjs`; the only DOM code is
`view.js`.

| file | spec | content |
|---|---|---|
| `timeline.js` | 19.1, 19.2 | frames to units, locks and film commands; the start and end of every unit solved by Kiwi (Cassowary) with the strengths of 19.2; corrections that re-read one unit and move only its dependents; every unit's constraints as text |
| `player.js` | 19.3 | `stateAt(tl, t)`: the scene at time t (interpolation and easing per unit); `createPlayer`: play, pause, scrub, loop, from the start, stop at a component, with an injected clock |
| `invariants.js` | 19.4 | the interlock: every lock checked on every frame (25 fps by default), plus two built-in rules; the first violating frame of each rule, reported before playing |
| `characters.js` | 19.5 | three characters of our own simple SVG design (robot, figure, car; "person" is the figure) and the repertoire of nine named motions; an unknown motion is reported |
| `questions.js` | 19.6 | answers from the timeline and from the state at the moment asked, with the frame to show |
| `export.js` | 19.3 | JSON timeline (with the SOP of the script), animated SVG (SMIL), PNG frames, WebM (MediaRecorder on a canvas); `capabilities()` says what this browser can do and why not |
| `svg.js` | 19.3 | one frame as SVG text (shared by the view and the exports) |
| `view.js` | | `mountAnimation(container, {timeline, sop})`: stage, controls, the timeline panel (one bar per unit with its constraints), the rule report with a button to each violating frame, the export buttons |

Use:
```js
import { createTimeline, add, correct, solve, rows } from "./timeline.js";
const tl = createTimeline(scene);                      // the editor's scene (src/editor/scene.js)
for (const r of readings) add(tl, r.frame, r.info);   // reader results of the animation world, one per unit of the circuit
solve(tl); rows(tl);                                  // [{id, event, subject, start, end, reasons}]
correct(tl, frame, info);                             // "make the arrow appear before the box": {unit, changed, dependents, stray, text}
check(tl);                                            // invariants.js: {ok, violations: [{rule, subject, frame, t, text}], first}
answer(tl, frame, info, tokens);                      // questions.js: {text, t, value, units}
```

## Semantics (the contract shared with training/worlds/animation/semantics.py)

The gold data of the scripted suite are computed by `training/worlds/animation/semantics.py`, written independently of this folder; a change
here is a change there.

Units. Every timed frame becomes one unit u1, u2, ... in script order. Its subject is the traveller (travel), else the object. Its duration D
(ms): the explicit number x 1000 (s or no unit) or x 1 (ms); a closed value (quickly 300, slowly 2000, instantly 0); else the action's
default (`DEFAULT_MS`; travel 1000 per hop); "per hop" multiplies by the hops; D = round(base x speed factor) x repeat (once = 1; forever: one
cycle, extended to the end of the film after solving); a `while` without its own duration takes the other unit's D. Speed factors: slow 1.5,
normal 1, fast 0.5; slower x1.5, faster x(1/1.5), twice as fast x0.5, half as fast x2 (relative ones multiply the current factor).

Start rules (one per unit), with their strengths:

| said | constraint | strength |
|---|---|---|
| at T, after T s | s = T | strong |
| after R (+ o); then | s = e_R + o; s = e_previous | strong |
| before R (- o) | e = s_R - o | strong |
| with R (+ o); while R | s = s_R + o | strong |
| when R arrives at C | s = s_R + D_R k / h (C the k-th node of R's h-hop path; no C: s = e_R); appears, disappears, finishes: s = e_R | strong |
| nothing | s = 0 for the first unit, else s = e_previous | default (between strong and medium) |
| always | e = s + D, s >= 0 | required |
| after a correction | s = the previous value | medium |

R ("after the box") is the latest earlier unit whose subject or travel path includes the box, else the first later one. The solution is the
least one: a `before` that would start below 0 starts at 0 and pushes R (only when R's own rule is the default; against a strong rule it is a
conflict, reported). Times are integers in ms (half-up rounding). The weak 100 ms grid of 19.2 is not used: every unit has a rule that
determines it, so there is nothing free to align (stated deviation, kept for free units if a later legend has them).

Corrections. `correct(tl, frame)` re-reads the latest unit with the same action and subject (`retime`, "slow down the request": any action of
that subject) and changes only what the frame says (start rule, duration, speed, easing, repeat), then solves again with every unit staying
where it was at medium strength. `changed` lists the units that moved; `dependents` the transitive closure of "depends on" (rules that name
the unit, the default chain, the push of a `before`); `stray` the moved units that are not dependents (always empty on the suite). Whether a
sentence is a correction or a new unit is the dialog's decision (correction words such as actually, instead, no; `retime`; the user's mode):
the reader does not report fillers.

State at time t. Components start visible unless their first opacity unit is appear or fade in. Progress p = (t - s) / D clamped to [0, 1]
once t >= s (D = 0: p = 1). appear, fade in: opacity 0 -> 1; disappear, fade out: 1 -> 0; move, walk: from the position after the earlier
moves to the target (direction + distance; region and relation through `editor/geometry.js`; a walk ends 12 px beside its target on its
bottom line), kept; travel: visible on [s, e], hop j on [s + jD/h, s + (j+1)D/h] between the centres of the path's nodes, eased within the
hop; jump dy = -40 sin(pi f), bounce dy = -20 |sin(2 pi f)|, shake dx = 6 sin(6 pi f), pulse scale 1 + 0.15 sin(pi f) (f the phase within
the cycle, while active); grow, shrink: scale to 1.25, 0.8, kept; blink: opacity x (f < 0.5 ? 1 : 0.3) while active; highlight: a halo while
active (s <= t < e); rotate: the angle x eased p, kept. Easings: linearly; smoothly (cubic in-out); bouncing (out-bounce); suddenly (1 as
soon as t > s). Defaults: move, walk, grow, shrink smoothly; the rest linearly.

Frames and invariants. Frame k is at t = round(k x 1000 / fps), k = 0 .. ceil(end x fps / 1000). Rules on every frame: no-overlap ("never
let anything overlap the database"), on-connectors ("never let the dot leave the arrows": within 2 px of a connector's centre line), visible
("never hide the title": from its first visible frame on, opacity > 0.1 and inside the canvas), no-move ("do not move the gateway": within
0.5 px of frame 0; shaking moves); built in: inside-canvas and attached (a visible connector has both ends visible). A prohibition of
another action (rotate, grow, change) is a lock checked at the command only, and the report says so.

Questions. when does X <action>: the first unit of that action on X; how long does the animation last: the end; where is the T at N s or
when R arrives: at a component (centre within 1 px), between two, or not on screen; what is <highlighted> at N s or when T arrives at C:
the units of that action active then (the first arrival in time); what <moves | blinks | ...> after | before | while X: relative to the
first unit acting on X ("moves" is any motion: move, travel, walk, jump, bounce, shake).

## Tests

`node app/tests/animate.mjs [<eval dir>] [--reader <export dir>]` against `training/data/animation/eval/*.jsonl` (generated by
`training/worlds/animation/animation_scripts.py`). At preparation: timelines 60/60 (order and overlaps exact, starts and ends exact to the
ms, criterion 50 ms), corrections 56/56 dependent-only and exact, planted violations 24/24 at the gold first frame, controls 12/12 clean,
violation lists equal to the gold ones 36/36, questions 277/277, unit checks 17/17. With `--reader` the steps are read by the exported model
(report only); its plumbing was run on a CPU smoke model (D 128, 355 sentences, 1 epoch), whose frames are of course wrong. Without the
`training/` folder (a public copy of `app/`) the suite says SKIP.

## Needed outside this folder (not changed here; for the owners of those files)

- `src/editor/scene.js` KIND_OF: add the characters (robot, figure, person, car) and the travellers (dot, envelope, packet, token, request,
  answer, message, ball) as kinds, so that the editor's resolver finds them; `timeline.js` resolves them by word meanwhile.
- `src/editor/resolver.js`: with the SAME groups, "the api" is ambiguous beside a service; `timeline.js` lets the exact word win over a
  synonym (stated); the same rule in the resolver would serve the diagram world too.
- `src/main.js` / `src/dialog.js`: dispatch readings of the animation world to `timeline.add` (or `timeline.correct` when the dialog decides
  it is a correction), questions (mood question) to `questions.answer` (seek the player to `answer.t`), film commands to `player.command`;
  mount `view.js` in a panel; segment a paragraph into units first (`src/segment/`), one reading per unit.
- `src/normalize.js` / `src/assets.js`: the animation world has its own table, `app/model/animation/normalize.json` (a copy of
  `training/worlds/animation/normalize.json`): the diagram table maps "over" to "above", which this world must not do.
- The renderer of the diagram engine (spec 9), once chosen, can replace `svg.js` in the view; the film then draws exactly the editor's shapes.
