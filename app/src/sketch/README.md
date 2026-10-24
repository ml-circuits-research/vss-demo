# app/src/sketch: the sketch pad, the stroke recogniser and the scene pass (spec section 17)

The user scribbles boxes, ellipses, diamonds, cylinders, triangles, arrows and containers with a mouse, a finger or a pen, presses
"Clean up", and the sketch becomes smart components of the editor's scene, connected and grouped as drawn. Recognising strokes is
classical and deterministic; reading the scene is the rule-based geometry pass until the positions-as-addresses experiment
(training/worlds/scene/, spec 17.3) meets its criterion. The About panel should say which scene reader is active
(`scenePass(...).active`).

| file | content | DOM |
|---|---|---|
| `pad.js` | pointer events (mouse, touch, pen) to strokes of `{x, y, t, p}` points; palm rejection while a pen draws; two fingers navigate instead of drawing; undo, clear; `export()` in the synthetic set's format (for recording the hand-drawn set) | no |
| `view.js` | `mountSketchPad(container, ctx)`: canvas, PointerEvents (coalesced), buttons Clean up / Undo stroke / Clear, the ink and the recognised boxes; calls `ctx.onCleanUp(strokes)`; no decisions | yes |
| `strokes.js` | resampling ($1 style), smoothing, ShortStraw corners, turning and reversals, convex hull, distances | no |
| `templates.js` | the point-cloud templates of the closed kinds, generated here from ideal geometry | no |
| `recognise.js` | grouping of strokes into symbols, features, the $P matcher, ranked candidates with scores and margins | no |
| `scene_pass.js` | the rule-based geometry pass: scribbles, containment, connector ends, clean-up, unknown blobs, ambiguity, the SOP circuit, `applyToScene` through `editor/ops.js` (one undo entry) | no |

Pipeline: `recognise(strokes)` -> `scenePass(rec, {scene})` -> `applyToScene(scene, res)` (and `toCircuit(res)` for the circuit view).

## The recogniser (recognise.js)

1. **Grouping** by drawing order and space. A stroke continues the previous group when it starts or ends at the group's free end
   (rectangles, diamonds, triangles drawn in pieces), when it is a short stroke at the far end of an open group (an arrow head drawn
   separately), or when it closes a cylinder (a U whose ends sit on a closed ellipse, in either order). A scribble is its own group.
   An open group of several long strokes is split (two connectors meeting at a component); an open group whose last strokes close a
   shape is split there.
2. **Closed or open**: free stroke ends (a corner gap is tolerated when every free end has a partner) and angular coverage of the ink
   around the box centre.
3. **Closed kinds** (rectangle, rounded rectangle, ellipse, diamond, cylinder, triangle): a Gaussian cost on box features (hull fill,
   ink along the four sides, ink distance from the corners, inner ink) plus the distance of the $P point-cloud matcher (Vatavu, Anthony
   and Wobbrock 2012, re-implemented from the paper) to our templates; scores are a softmax of the costs, the margin is top minus
   second. A closed group that turns too much (a cloud, a star) or is far from every prototype is an **unknown blob**.
4. **Open groups**: a connector when its shaft turns less than 1.6 pi; an **arrow** when one extreme point has a head (barbs on both
   sides of the shaft, or short strokes drawn there, or the pen hooking back and forth there), else a **line**; the arrow goes from tail to
   head, a line from the end where the pen went down. Too much turning: an unknown blob.
5. **Scribbles**: at least two sharp reversals, much more ink than size, dense ink, not ending where it started.

The prototype table and the thresholds were set on the TUNE split of the synthetic set with `training/worlds/scene/tune_recogniser.mjs`
(it never reads the test split). Stated deviations from spec 17.1: $Q is replaced by our own $P implementation plus geometric rules (no
third-party code or templates; $P is the same family); the point clouds are scaled to the unit square on each axis separately (aspect
ratio is not a cue between our kinds; lines never reach the matcher); the folded page (document) and the stick figure (actor) are not
among the kinds yet; the zigzag is read as a scribble whose meaning (label area, text placeholder, delete) the scene pass decides from
where it is; the bitmap pre-stage (photos of a whiteboard) is not built.

## The scene pass (scene_pass.js), rules in order

1. Scribbles: over most of a component (covers >= 50% of its box and is >= 45% of its size) deletes it and its connectors; inside a
   component and small, a label area (empty label, `labelMark`, a question: handwriting is not read, spec 17.4); across a connector,
   deletes it; elsewhere, a text placeholder (`caption`).
2. Containment by boxes: a rectangle or rounded rectangle enclosing another component (90% of its box) is a container (`kind
   container`, dashed); each component's parent is the smallest container enclosing it.
3. Connector ends attach to the component whose outline (ellipse, diamond, triangle, box) is nearest, within 30 px (or 12% of the
   connector's span); the two best candidates and the distance margin are kept; an end near nothing is a question, never a guess.
4. Clean-up: boxes snapped to a 10 px grid; centres within 14 px aligned in rows and columns; containers grown to hold their members;
   a layout hint (row, column, flow_lr, flow_td) for an arrange wire.
5. Unknown blobs stay as `sketch` components with their strokes and the question "keep this as a sketch, or tell me what it is?".
6. Ambiguity held open: a shape whose two best kinds are within 0.2 keeps both (`alternatives`) and asks which.
Kinds to words: rectangle -> box (process), rounded rectangle -> start (terminator), ellipse, diamond -> decision, cylinder -> database
(data), triangle; the drawn shape is kept on the component as `shape`. The pad stays available after clean-up: `scenePass(rec, {scene})`
connects new strokes to components already on the scene, and a scribble over one deletes it.

## Tests and numbers

`node app/tests/sketch.mjs` (`--verbose` lists every miss; `--tune-only` while adjusting thresholds). The synthetic set
`app/tests/data/sketch_synth.json` is written by `training/worlds/scene/synth_strokes.py` (our own generator; tune split seed 17, test
split seed 1017). MEASURED on the synthetic test split (40 scenes, 661 symbols, 161 connectors), with the criteria of spec Table 13:

| row | number | criterion |
|---|---|---|
| symbols (kind, grouping included) | 0.983 | >= 0.95 met |
| connectors (source and target; arrows ordered, lines unordered) | 0.963 | >= 0.97 missed |
| containment (parent of every component) | 0.992; member pairs precision 1.000, recall 1.000 | >= 0.95 met |
| planted unknowns reported as unknown | 12 / 13 | 100% missed |
| whole circuit (create, connect, member, delete, text, sketch facts) | precision 0.985, recall 0.970 | reported |

Causes located: five of the six connector misses follow from three polygons drawn in separate strokes whose corner gaps were too wide
to be grouped (the shape is split, so its connectors have no component to attach to); one follows a rectangle read as unknown.
Triangle and diamond are confused three times; the missed unknown is a wave read as a scribble. The hand-drawn set (spec 17.5) is
not collected yet: see training/TODO_DGX.md.
