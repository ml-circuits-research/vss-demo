_AXIOLOGIC RESEARCH · VSS DEMONSTRATOR_

# VSS Diagram Editor

Diagrams by voice and text: a browser demonstrator of the VSS reader

**Document:** technical specification for the experimental session and the engineering of the demonstrator: the world, data generation, training, model export, the JavaScript interpreter, planning and layout, the diagram engine, spelling and speech correction, voice input, dictated rich text, segmentation of longer input into an SOP circuit, formula widgets, sketch recognition, long scripts, animation, evaluation and acceptance.

**Version:** 2.6, 24 October 2026 (adds voice input, planning and computation, smart components, automatic layout, rich text widgets by dictation, segmentation of longer input into the SOP circuit with the VSS improvements in parallel, formula widgets edited by voice, sketch recognition with the positions-as-addresses experiment, long scripts of any length with the large model as author, and animation of the diagram in time). **Repository:** ml-circuits-research/vsa-semantic-space (tool/ and a new web/ folder).

**Working rules carried over from the project:** success criteria are written before each run; one change per run; every number is labelled (BUILT, MEASURED, PLANNED) and points to a log; nothing in experiment/ is modified by this work; no duration estimates appear in this document or in the reports that follow it.

## 1. Purpose

The demonstrator is a diagram editor that runs entirely in a web browser and is driven by sentences in English, typed or spoken. The user says "add a database called Orders", "put a note ten pixels below the database", "connect each step to the next", "group the three services and call the group Backend" or "arrange everything as a flow from left to right", and the editor reads each sentence, or each unit of a dictated paragraph, with the VSS reader, shows the frame it understood, plans the operations, computes the geometry, and changes the diagram: components placed where they belong, connectors routed around obstacles and re-routed when something moves.

The demonstrator has to make visible, to a non-specialist in a few minutes, the three properties the Lab is built on. **AI on ordinary CPUs:** the reader is a static file of a few megabytes and reads at every keystroke or utterance, offline. **Explainable by construction:** the frame is shown role by role with its margins, the plan is shown as a list of steps, and the geometry as the constraints that produced it ("note.top = Orders.bottom + 10"). **Supervision:** what the reader did not understand is reported precisely and turned into a question, and in the optional slow path a large model's proposal is re-read and checked before anything changes.

The editor is a modern counterpart of SHRDLU (Winograd, 1970), the blocks world commanded in English, whose grammar and semantics were written by hand. Here the world is declared (the legend), the reading is learned, and the reasoning is a deterministic planner and solver that can be inspected. The demo should say so.

### 1.1 Non-goals

The editor is not a general drawing assistant. It does not know what a house looks like or how a payment process should be drawn; those requests are outside its world and are reported as such, or routed to the optional slow path (Section 20). Length is not a limit: a script of any length in the world's language is read unit by unit (Sections 15 and 18); free description is not understood, and the editor says so unit by unit. It does not converse and it does not generate text. In its first version it does not resolve references across sentences by understanding them: "make it red" is resolved by a declared executor rule (Section 10.3), until the learned resolution of Section 15.5 meets its criterion.

## 2. Architecture

A request goes through the stages below, all in the browser. Only the reader is learned; every other stage is deterministic code with stated rules, so every decision can be shown and replayed.

**Table 1. Pipeline**

| **Stage**             | **Responsibility**                                                                                                                                                              | **Learned or rule**                |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| **Speech**            | Speech to text with several alternatives per utterance (Section 13)                                                                                                             | Browser or local engine            |
| **Normalizer**        | Lower-casing outside quotes, number and fraction words to values, units, labels protected, punctuation                                                                          | Rule                               |
| **Corrector**         | Typing errors (keyboard distance) and speech errors (phonetic distance) against the world's lexicon and the diagram's labels (Sections 12, 13)                                  | Rule, or the VSS form level (12.4) |
| **Segmenter**         | Cuts a paragraph or a long sentence into units of meaning, guided by the reader's gates and by the clarity of the readings (Section 15)                                         | Rule, with the reader's gates      |
| **Kinds**             | Each token gets its kind from the model's lexicon; label rules for new words                                                                                                    | Rule (lexicon)                     |
| **VSS reader**        | Encodes each unit and decodes its frame with margins, presence, residual and status; in dictation mode a second reader (world textedit) decides command or content (Section 14) | Learned route book                 |
| **Circuit**           | Links the units' wires: references, shared entities, discourse operators, order (Section 15)                                                                                    | Rule, from the readings            |
| **Resolver**          | Binds the frame's descriptions to components of the diagram (the red box, all services, it)                                                                                     | Rule                               |
| **Planner**           | Turns the frame into an ordered list of operations, checking preconditions and locks (Section 8)                                                                                | Rule (action schemas)              |
| **Solver and layout** | Computes positions and sizes from constraints; lays out and routes connectors (Section 8)                                                                                       | Algorithm                          |
| **Engine**            | Applies the operations to the smart components; undo; rendering (Section 9)                                                                                                     | Library and rules                  |
| **Dialog**            | Turns statuses, margins and failed preconditions into questions, confirmations or refusals                                                                                      | Rule                               |

The frame passed from the reader to the resolver is SOP Lang, exactly as written by the existing tool (tool/SPEC_worlds_server_sop_cli.md, section 3), so the browser's output can be compared line by line with \`sop formalize\` in Python. The training side is the existing \`sop\` package and its train-world skill; the work adds a world folder, a data generator, an exporter for the browser and the web application.

## 3. The world: diagram

### 3.1 The diagram

The diagram is a set of smart components and connectors, not a set of drawn shapes. A component has an id, a kind (Table 4), an optional label, a style (colour, line style, size class), a box, ports on its four sides and an optional parent container. A connector has a source and a target component, a kind (line or arrow), a style, an optional label (for instance "yes" or "no" after a decision) and a route computed by the engine. Containers (groups, lanes) hold components and move, align and lay out with them. Components and the actions on them can be locked by a prohibition (Section 10.4). The diagram is the world's database: the reader never sees it; the resolver and the planner query it.

### 3.2 Legend

The legend follows the schema of tool/SPEC section 1. The action is the wire type, read through the predicate role and the synonym table. Roles are the questions every command can answer.

**Table 2. Events (actions) and their verbs**

| **Event**               | **Verbs and fixed phrases**                                                                       |
|-------------------------|---------------------------------------------------------------------------------------------------|
| **create**              | draw, add, create, insert, sketch, make (with an indefinite object)                               |
| **place**               | put, place (create when the object is indefinite, move when definite: a convention, Section 10.2) |
| **delete**              | delete, remove, erase, clear                                                                      |
| **move**                | move, shift, drag, push, slide                                                                    |
| **change**              | make, turn, colour, color, paint, fill, set, change                                               |
| **resize**              | resize, enlarge, shrink, grow, scale, widen, narrow, make bigger or smaller                       |
| **connect**             | connect, link, join, attach, wire, go to (after a decision branch)                                |
| **name**                | name, call, rename, label, title, write                                                           |
| **copy**                | copy, duplicate, clone                                                                            |
| **group / ungroup**     | group, put together, wrap, put in a box / ungroup, split, take out                                |
| **arrange**             | arrange, lay out, organise, tidy, line up (with a layout: row, column, grid, tree, flow, circle)  |
| **align / distribute**  | align, line up with / distribute, space out, space evenly                                         |
| **order**               | bring to front, send to back                                                                      |
| **view**                | zoom in, zoom out, fit, show everything, centre on                                                |
| **undo / redo / clear** | undo, redo, start over, clear the canvas                                                          |

**Table 3. Roles**

| **Role**                 | **Question**                       | **Filler**                                                                                                    |
|--------------------------|------------------------------------|---------------------------------------------------------------------------------------------------------------|
| **object**               | what is acted on or created?       | entity: head = component kind, attr = colour, size or style (or a negated one), det, label; a set for several |
| **color / size / style** | to which colour, size, line style? | closed values: 12 colours; tiny to huge, bigger, smaller; solid, dashed, dotted, thick, thin                  |
| **text**                 | with which label?                  | value: a quoted string or the words after called, named, labelled                                             |
| **relation**             | where, relative to what?           | closed value: left of, right of, above, below, inside, next to, between, after, before, under, aligned with   |
| **landmark**             | relative to which component?       | entity; a set for between                                                                                     |
| **anchor**               | relative to which part?            | closed value: centre, top, bottom, left edge, right edge, the four corners (of a landmark or of the canvas)   |
| **region**               | where on the canvas?               | closed value: top, bottom, left, right, centre, the four corners                                              |
| **amount / unit**        | how much, in what?                 | values: a number with px, percent, grid steps, times; read by the normalizer, the slot by the reader          |
| **fraction**             | what part of the way?              | value: half, a third, a quarter, two thirds                                                                   |
| **axis**                 | in which direction?                | closed value: horizontally, vertically, up, down, left, right                                                 |
| **layout**               | in which arrangement?              | closed value: row, column, grid, tree, flow left to right, flow top down, circle                              |
| **pairing**              | connected how?                     | closed value: each to the next, all to one, one to all, in a chain                                            |
| **source / target**      | from what? to what?                | entity (connect, arrows); a set with pairing                                                                  |
| **branch**               | on which outcome?                  | value: yes, no, else, or a word (labels the connector)                                                        |
| **quantity**             | how many?                          | value: "add three boxes"                                                                                      |

**Table 4. Component kinds**

| **Kind**             | **Words**                                                                                     |
|----------------------|-----------------------------------------------------------------------------------------------|
| **Process**          | box, process, step, task, action                                                              |
| **Decision**         | decision, diamond, check, question                                                            |
| **Terminator**       | start, end, begin, finish, stop                                                               |
| **Data**             | database, db, store, table, cache, queue                                                      |
| **Document**         | document, file, report, page                                                                  |
| **Actor and system** | user, actor, customer, service, server, api, gateway, client, cloud                           |
| **Container**        | group, container, lane, area, section                                                         |
| **Note and text**    | note, comment, text, text box, card, title, caption (text widgets hold rich text, Section 14) |
| **Geometric**        | circle, ellipse, square, rectangle, triangle, star, hexagon                                   |
| **Connector**        | line, arrow, link, connection                                                                 |
| **Generic**          | shape, component, object, thing, element, item                                                |

Operators admitted: \`not\` (a negated attribute, "the boxes that are not blue"; a prohibition, "don't move the title"), \`and\` and \`if\` (Level 2, Section 3.3). Determiners and quantifiers on entities: a, an, the, this, that, all, every, each, both, any, the other. Moods: command, and question ("where is the database?", "what is this?" with a click, "how many services are there?"), answered from the diagram.

The kinds (word categories) of the lexicon are: ACTION, COMPONENT, COLOR, SIZE, STYLE, REL (left, right, above, below, under, inside, next, between, after, before, of, to, from, with), ANCHOR (centre, middle, top, bottom, edge, side, corner), LAYOUT (row, column, grid, tree, flow, circle), PAIR (each, next, chain, other), NUM and FRACTION (normalized values), UNIT, LABEL-INTRO (called, named, labelled, titled), LABEL (any token in quotes or after a label-intro word: new words read without retraining), PRON (it, them, that one), NEG (not, don't, never, no, except, without), CONJ and COND (and, then, if, when, unless), DET, and FILLER (please, can, could, would, you, I, want, need, let's, now, just, okay, so, um).

### 3.3 Coverage levels

The existing decoder reads a top-level structure of reporting levels, an optional negation and one event, with fillers that are words, negated words or entities (head, attribute, determiner) (tool/sop/infer.py, header). The demo is specified in three levels so that each extension of the decoder is a separate, measured change.

**Table 5. Levels**

| **Level** | **What the user can say**                                                                                                                                                                                                                                                       | **Decoder work**                                                                  |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| **1**     | One command per sentence; components with colour, size, style, label and determiner; negated attributes; prohibitions; region, relative and computed placement (amount, unit, fraction, anchor); layouts; grouping and naming; pairing over sets; questions about one component | None beyond the world (existing decoder; closed values and value slots)           |
| **2**     | Nested references ("the box left of the database above the gateway"); two attributes on one component; two commands joined by and; conditions ("if there is no title, add one at the top"); lists of labels ("add steps called Order, Pay and Ship")                            | Entity with a relation wire; several attributes; decoding of and, if; list values |
| **3**     | Requests outside the world ("draw the architecture of a web shop") through the optional slow path                                                                                                                                                                               | None in the reader; a large model proposes, the reader re-reads (Section 20)      |

### 3.4 Examples in SOP Lang

"Put a yellow note ten pixels below the database." The reader reads the slots; the normalizer gives the value; the solver computes the position (Section 8.2).

```
@w1 place
_text=put a yellow note 10 px below the database .
object=$w2
relation=below
landmark=$w3
amount=10
unit=px
@w2 entity
head=note
attr=yellow
det=a
@w3 entity
head=database
det=the
```

"Move the gateway halfway to the right edge."

```
@w1 move
_text=move the gateway halfway to the right edge .
object=$w2
fraction=half
anchor=right_edge
@w2 entity
head=gateway
det=the
```

"Connect each step to the next with an arrow." The pairing is a closed value; the planner expands it over the ordered set (Section 8.1).

```
@w1 connect
_text=connect each step to the next with an arrow .
source=$w2
pairing=each_to_next
object=$w3
@w2 entity
head=step
det=each
@w3 entity
head=arrow
det=a
```

"Delete all the boxes that are not blue."

```
@w1 delete
_text=delete all the boxes that are not blue .
object=$w2
@w2 entity
head=boxes
det=all
attr=$w3
@w3 not
scope=blue
```

"Don't move the title." The prohibition becomes a lock (Section 10.4).

```
@w1 not
_text=don't move the title .
scope=$w2
@w2 move
object=$w3
@w3 entity
head=title
det=the
```

### 3.5 Outside the world

A sentence whose words mostly land outside the legend gets \`\_status=no-sense\` and the list of \`\_unplaced\` words; a verb not in the synonym table gives an \`unknown\` wire. The editor answers with what it did not understand ("I don't know how to draw a web shop; I can add components, connect, group, arrange, move, colour and name them"). This answer is the demonstration of the reader's self-report, so it must be precise and never a generic apology.

## 4. Data generation

### 4.1 The generator

A Python generator in tool/worlds/diagram/generate.py writes sentences together with their gold SOP wires, from a seed, in the format of tool/SPEC section 3, so that \`sop check\` validates every line. It composes a command from an action, its roles and fillers, then realises it through one of several formulation families: bare imperative ("add a box"), polite ("please add", "could you add"), desire ("I want a box", "I need"), first person plural ("let's add"), fronted place ("below the database, put a note"), spoken style (no punctuation, number words, fillers such as "okay so", labels without quotes after "called"), and fronted condition at Level 2. Each realisation records its template signature, which defines the held-out formulation split.

The generator covers every action with every compatible role, every component kind, colour, size, style, anchor, layout and pairing, negated attributes, prohibitions, quantities, amounts, fractions and units. Labels are drawn from a pool of names and short phrases; a separate pool never used in training defines the new-identity split. At Level 2 the generator nests relative references to depth 3, keeping depth 3 out of training to define the unseen-depth split, and makes sure, as the project's counter-case showed, that every step between openers seen at depth 3 already occurs at a lower depth.

### 4.2 Paraphrases by a large model

Templates alone teach the templates. A large model rewrites a sample of generated commands into the ways people actually type and speak ("can u put a yellow note just under the db", "ok link all the steps one after the other"), keeping the meaning; the gold wires stay those of the source sentence. Each paraphrase is checked by the reader trained on templates (the second look of tool/SPEC 6b): where the reader is confident and disagrees, the paraphrase is reviewed and either fixed or dropped, and the rate is reported as label noise. Paraphrase families (one prompt style, one model) are split as whole families between training and test, so that the held-out formulation number measures language the reader has not seen.

### 4.3 Noise for the correction evaluation

Two deterministic noise generators produce test sentences. The typing generator injects keyboard errors: a neighbouring key, a deletion, an insertion, a transposition, a missing or doubled space. The speech generator injects the errors speech recognition makes: homophones (two, to, too; four, for; right, write; blue, blew; red, read), wrong word boundaries ("a row" for "arrow", "data base"), numbers written as words or digits inconsistently, dropped short words, and names replaced by similar-sounding common words. Rates of one and two errors per sentence are used. Noise is not added to the reader's training data at Level 1, so that the correctors and the reader are measured separately. A recorded test set of real spoken commands complements the synthetic one (Section 13.4).

### 4.4 Splits

Written to runs/\<timestamp\>/splits.json before training, as the skill requires: seen formulations; held-out sentences; held-out formulations (template signatures and paraphrase families never seen); new labels; unseen depth (Level 2); out-of-world sentences (from other worlds of the repository and free text), used only for evaluation; typed-noise and speech-noise versions of the held-out sentences. A lexical bag baseline is trained on the same rows.

### 4.5 Size

The number of training sentences is decided by measurement: the reader is trained at 1k, 5k, 20k and 50k sentences and the held-out formulation number is reported at each size; the smallest size after which it stops improving within seed variance is the one shipped.

## 5. Training

Training uses the existing trainer through \`sop train\` on the world folder, with the reference codes (path, chainL, bigram, as RESULTS 10b-quinquies); the position code is not used, because commands are typed and spoken in free order. D = 1024 is the default; D = 2048 is run once as a check for the longest sentences of the set. Five seeds; thresholds (tau, presence, attribute and determiner presence) are set on calibration rows, never on reported rows. The kinds are the lexicon of Section 3.2; the label rules are applied before training exactly as at inference.

### 5.1 Portable stars

Word identities and role vectors are regenerated from a seed (tool/sop/world.py: SHA-256 of seed and name, then a NumPy generator). NumPy's generator is not practical to reproduce in a browser. The world therefore uses a portable star function, recorded in model/config.json as star_version 2: the first 16 bytes of SHA-256(seed:name) seed a xoshiro128\*\* generator, and each 32-bit output u gives a phase 2π(u + 0.5)/2³² − π. The same function is implemented in Python (in the sop package, behind the star_version flag; existing worlds unchanged) and in JavaScript, and a test checks that both produce identical phases for a fixed list of names. Words never seen by the model, such as new labels, get their identity from the same function in the browser, so the reader reads them without retraining, as it does in Python.

### 5.2 Quantization

The route book is exported with each phase stored in 8 bits by default. The project measured that 4-bit storage moves no evaluation axis by more than 0.02 on the reference world; for this world the 4-bit variant is measured once on the same splits and kept if it meets the same rule. The Python evaluation of the shipped model is run on the dequantized phases, so that the browser and Python read the same numbers.

## 6. Model export for the browser

A new command \`sop export-web --model \<dir\> --out web/model/\` writes three files. model.json holds the configuration (D, star version and seeds, thresholds, tau), the legend and its hash, the kinds lexicon with lemmas, the schema the decoder needs (role order, core roles, kinds per role, closed values) and the residual background statistics. routebook.bin holds the arrays of tool/sop/infer.py Routebook (path, bg0, bg, A, L, logits, rel and the masks) as quantized phases with a header giving each array's name, shape and offset. manifest.json lists the files with their SHA-256 and the training commit; the browser refuses a model whose legend hash or files do not match. The sizes are reported, not assumed; with about twenty-five kinds at D = 1024 the route book is expected around 2 MB at 8 bits.

## 7. The JavaScript interpreter (vss.js)

vss.js is a single ES module with no dependencies. It loads the model files and exposes one call, read(text) → { sop, frame, statuses, margins, timings }. Complex vectors are two Float32Array (real and imaginary); phases are stored as Uint8 and expanded once at load into cosine and sine tables. The modules follow the Python code one to one, so that a discrepancy can be found by comparing intermediate values.

**Table 6. Modules of vss.js**

| **Module**               | **Mirrors**                        | **Content**                                                                                                                      |
|--------------------------|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| **stars**                | sop/world.py Stars, star()         | portable star v2; cache; identities, role and operator vectors, occupancy marker                                                 |
| **tokenize / normalize** | sop/legend.py tokenize             | the same tokenisation; numbers, fractions and units to values; quoted labels; label-intro rule                                   |
| **kinds**                | Reader.kind, Reader.encode         | lexicon lookup, label kind, unknown kind, the list of unplaced tokens                                                            |
| **routebook**            | infer.py Routebook.addresses       | path, bigram, chainL with gates, relative beacons; identical order of operations                                                 |
| **decoder**              | Reader.read, read_role, read_scope | structure hypotheses, depth from gates, roles with presence and margins, entity attributes and determiners, negation             |
| **residual / status**    | Reader residual and status         | reconstruction of the decoded frame, residual against the background, status ok / abstain / ambiguous / unknown-event / no-sense |
| **soplang**              | sop/soplang.py                     | serialisation of wires with the reserved lines; JSON form for the editor                                                         |

### 7.1 Parity with Python

Parity is the acceptance test of the interpreter. Python writes a golden file for a fixed set of sentences covering every split: tokens and kinds, the state vector, the decoded frame, every margin and presence ratio, the residual and the status. The JavaScript test, run with Node and in a headless browser, must reproduce the frames and statuses identically on every sentence, the states with cosine at least 0.9999, and margins and ratios within 1e-4. A failure is located by comparing the intermediate values in the order of the pipeline.

### 7.2 Reading while typing or speaking

The editor reads the sentence at every keystroke after a short pause, and every interim speech result, and shows the frame filling in; execution happens only on Enter or at the end of the utterance. The cost of a reading grows with the square of the sentence length because of the chain code; commands are short, and the median and 95th percentile time per reading are measured on a stated ordinary laptop and reported. Readings run in a Web Worker when that keeps the interface fluid.

## 8. Planning, computation and layout

This section answers how the editor carries out requests that need reasoning, computation or arrangement. The division of labour is strict and is the point of the demo: the VSS reader says what was asked, as a frame; a deterministic planner decides which operations achieve it, in which order, and whether they are allowed; a solver computes the numbers; the layout engine arranges components and routes connectors. Nothing after the reader is learned, so every step can be shown, explained and replayed, and every result is identical for the same diagram and the same sentence.

### 8.1 The planner

Each event of the legend has an action schema: its roles, its preconditions and the operations it expands into. Connect requires a source and a target that exist and are not locked for connection; it expands into one connector per pair given by the pairing (each to the next over the set ordered by position or by creation, all to one, one to all). Group requires at least two members; it creates a container, moves the members into it, resizes the container to fit and gives it the label if one is named. Arrange takes a set (all components by default, or the members of a container) and a layout, and calls the layout engine. Place with a definite object moves it; with an indefinite one it creates it first and then places it.

When a precondition fails, the planner does not guess. A definite reference with no match ("connect the cache to the database" with no cache) gives a question ("there is no cache; add one?"); an indefinite one creates the component; a locked component stops the plan and names the lock. A plan is shown as a numbered list of steps beside the frame and is executed and undone as one unit. Requests that need many steps at Level 2 ("add steps called Order, Pay and Ship and connect them in a chain") are a list of labels and a pairing, so the planner, not the reader, does the expansion.

### 8.2 Computation

Numbers, units and fractions are values: the reader reads the slot (amount, unit, fraction, anchor, axis), and the normalizer supplies the value, as everywhere in the project. The planner turns the frame into linear constraints on the boxes, and a constraint solver computes the positions. "Ten pixels below the database" becomes note.top = database.bottom + 10 and note.centreX = database.centreX (the default alignment for a vertical relation, a declared rule). "Halfway to the right edge" sets the new gateway.centreX to (current centreX + canvas.right) / 2, computed from the position at the moment of the command. "In the middle of the screen" centres on the visible canvas. "Twice as wide" multiplies the width; "space the boxes 40 pixels apart" fixes the gaps along the row. The constraints are shown in the explanation panel exactly as solved.

The solver is an implementation of the Cassowary algorithm, which handles linear equalities and inequalities with strengths: the user's explicit request is strong, keeping other components where they are is medium, snapping to the grid is weak, and staying inside the canvas is required. Non-overlap is not linear; it is handled by a placement search that tries the solved position, then the nearest free positions in the direction of the relation, and reports a move it had to make ("placed 20 px lower to avoid the cache"). The candidate library is @lume/kiwi, a TypeScript port of the Kiwi solver under the BSD-3-Clause licence (the original kiwi.js package is no longer maintained); its licence and dependencies are confirmed before inclusion.

### 8.3 Layout and routing

Automatic layout uses ELK.js, the JavaScript build of the Eclipse Layout Kernel: its layered algorithm gives flows from left to right or top down and trees, with orthogonal routing of the connectors, ports on the components' sides and containers laid out with their members. Row, column, grid and circle layouts are short deterministic functions of the editor. After a single component moves, the full layout is not recomputed: the connectors attached to it are re-routed by an orthogonal router written for the editor (a shortest path on a visibility grid around the components' boxes, with a penalty per bend), so that lines go around obstacles and keep their ports. Layout changes are animated, which is a large part of what makes the demo look alive. ELK.js is licensed under the Eclipse Public License 2.0; the licence is confirmed and recorded before inclusion.

## 9. The diagram engine: smart components

The editor is a real vector editor, usable with the mouse as well as by voice and text: selection, dragging, resizing with handles, ports, connectors that stay attached, containers, undo and redo, zoom, export. Rather than writing this from scratch, the engine is built on an established open-source diagramming library, and the editor's own semantic model (component kinds, labels, locks, the diagram as the world's database) sits on top of it. How the library renders (usually SVG) is an implementation detail; what the editor manipulates are components and connectors with meaning.

The recommended base is maxGraph (@maxgraph/core), the TypeScript successor of mxGraph, the library at the core of draw.io, under the Apache-2.0 licence: it provides graph cells, groups, ports, edge styles, an undo manager, layouts and the interaction an editor needs. The alternative is JointJS core (@joint/core, Mozilla Public License 2.0), whose routers and connectors are strong. The choice is made once, on a comparison prototype that runs the scenario suite of Section 21 with each, and recorded with the library's version and licence in web/README.md.

**Table 7. Engine operations used by the planner**

| **Operation**                         | **Effect**                                                                 |
|---------------------------------------|----------------------------------------------------------------------------|
| **create(kind, props, box)**          | adds a component with its default shape, ports and style; returns its id   |
| **remove(ids)**                       | removes components and the connectors attached to them                     |
| **move(ids, box) / resize(ids, box)** | sets boxes computed by the solver; attached connectors are re-routed       |
| **set(ids, props)**                   | colour, style, label, size class                                           |
| **connect(source, target, props)**    | adds a connector between ports, with kind, style and branch label          |
| **group(ids, label) / ungroup(id)**   | creates or dissolves a container fitted to its members                     |
| **layout(ids, kind, options)**        | applies a layout (ELK or the editor's own) and routes the connectors       |
| **lock(ids, action) / unlock**        | records a prohibition; checked before every operation                      |
| **query(description)**                | components matching kind, colour, size, label, region, relation, container |
| **undo / redo**                       | one entry per executed request, whatever the number of operations          |
| **export(svg \| png \| json)**        | the diagram as a file; json is the semantic model, reloadable              |

Each component kind has a default look (a rounded box for a process, a diamond for a decision, a cylinder for data, a figure for an actor, a folded page for a document) and a default size that fits its label; colours and styles follow a small palette so that diagrams built by voice look clean without any manual styling.

## 10. Resolver and executor

### 10.1 Binding descriptions to components

An entity in the frame is a description: kind, attribute, determiner, label, relation to a landmark, container. The resolver queries the diagram with it. With "the", "this" or "that", exactly one match is expected: none gives "there is no red box", several give a question with the candidates highlighted. With "a" or "an" the entity is new (create) or any one match (the most recent). With "all", "every", "each" or a plural with "the", every match is selected. Generic words (shape, component, element) match any kind; "service" matches the actor and system kinds by label as well as by kind. A label matches by exact text, then through the correctors' distance. A click on a component while speaking binds "this" to it.

### 10.2 Conventions of the world

Some decisions are conventions, not readings, and are shown as such: put and place create when the object is indefinite and move when it is definite; a missing colour, size or position takes a default stated in the confirmation line ("added a process box in the next free place to the right: no place given"); a vertical relation centres horizontally and a horizontal relation centres vertically unless an anchor says otherwise.

### 10.3 Pronouns

Reference across sentences is not read by the current reader. "It", "them" and "that one" are resolved by an executor rule: the components touched by the previous request, or the current selection when the user has clicked. The editor shows the resolution ("it = the database Orders") so that the rule is visible, and the circuit records it as a rule link (Section 15.2). The learned alternative is one of the VSS improvements of Section 15.5.

### 10.4 Prohibitions as locks

A prohibition wire (\`not\` around a command) is not executed: it is stored as a lock on the resolved components and the action ("don't move the title"; "never delete anything blue", evaluated at each request). The planner checks every plan against the locks, and a blocked step is reported with the lock that blocked it. This is the semantic interlock of the research book in miniature: the frame is checked against declared rules before anything changes, and the explanation is the rule.

## 11. Dialog and the display of uncertainty

**Table 8. From the reader's report to the editor's behaviour**

| **Report**                                   | **Editor's behaviour**                                                                    |
|----------------------------------------------|-------------------------------------------------------------------------------------------|
| **status ok, every margin above tau**        | plan, execute, one confirmation line; undo available                                      |
| **a role's margin under tau (abstain)**      | ask about that role only, with the two best candidates: "which colour, red or orange?"    |
| **a description matches several components** | highlight the candidates and ask which; a click, a word or a voice answer settles it      |
| **a required role empty**                    | use the declared default and say so, or ask when there is none (connect without a target) |
| **a precondition fails**                     | say which (no such component, locked) and offer the fix                                   |
| **unknown word with no kind**                | "I don't know the word X"; offer to use it as a label                                     |
| **a correction applied**                     | show the corrected word underlined; one click or "no" reverts                             |
| **unknown-event or no-sense**                | say what was not understood, list what the editor can do; offer the slow path if enabled  |

A side panel shows, live, three layers: the frame (action, roles with their fillers and a bar for each margin, empty roles in grey, the residual and the status), the plan (numbered steps) and the geometry (the constraints solved). A toggle shows the SOP text. This panel is the explanation and must stay readable at a glance; spoken confirmations, when voice is on, read only the confirmation line.

## 12. Correction of typed input, and the form level

Correction is deterministic, classical and runs before the reader. The world's vocabulary is closed and small (a few hundred words plus the labels in the diagram), so a domain corrector is more accurate than a general one and has no reason to touch words that are not candidates.

### 12.1 Algorithm

Tokens inside quotes, numbers and tokens after a label-intro word are protected. Every other token not in the lexicon is compared with the lexicon of the world (all catalog words and verb synonyms, with their frequency in the training data) and with the labels present in the diagram. The distance is the optimal string alignment variant of Damerau-Levenshtein, with substitutions between neighbouring keys of a QWERTY keyboard costing less than other substitutions. A token of up to four letters is corrected at distance one; a longer token at distance up to two. Ties are broken by frequency. A token that splits into two lexicon words ("redbox") is split, and two tokens that join into one ("data base") are joined. A token that is a valid English word but not in the world is not corrected: it is passed on and reported as unknown. Every correction is recorded, shown (Section 11) and written into the SOP output as a reserved line such as \`\_spell.2=dtabase\>database\` (token position, typed form, corrected form), a proposed addition to tool/SPEC section 3.3.

### 12.2 Libraries

The domain corrector is written for the editor, with no dependency, because the lexicon is the model's own. To decide that a word is valid English, Typo.js (Modified BSD licence, no dependencies, Hunspell-style dictionaries with en_US included) is used as a dictionary only. A SymSpell port compiled to WebAssembly (spellchecker-wasm, zero dependencies) is the alternative if a fast general corrector is wanted later; its licence must be checked before inclusion.

### 12.3 Context through the reader

When two candidates are equally close ("form" and "from"; "rad" to "red" or "rod"), the reader decides: the sentence is read with each candidate and the one whose frame is clearest (highest minimum margin, then smallest residual) is kept. This uses understanding within the world to correct, which a dictionary cannot do. It is a separate change, measured against the frequency tie-break on the noisy test set.

### 12.4 An alternative corrector built with VSS: the form level

The demo ships a second corrector with the same interface as the classic one (a token in, a ranked list of candidates with margins out), selectable in the settings and shown side by side in a comparison view. It is a lower level of the same algebra: the written form of a word is encoded as the superposition of its letter trigrams bound to their positions, with word boundary marks, and the candidate words are found by cleanup against the form codes of the lexicon and of the diagram's labels, exactly as a role is read. For speech (Section 13.2) the same level encodes phoneme trigrams instead of letters, so one operation corrects typing and pronunciation errors. The form codes are separate from the word identities, which stay random: identities must remain unrelated to spelling, or words that look alike would interfere in the reader.

The form level does not decide alone. It passes its top candidates with their margins upwards, and the reader keeps the candidate whose frame is clearest (Section 12.3). The classic corrector remains the default and the fallback until the comparison on the noise sets (Section 4.3) and on the recorded speech set shows the form level at least as good; the result decides the default, and the About panel says which is active.

Two further uses are measured inside the same work, each as its own change. The first is the kind of an unseen word guessed from its form (endings such as -ing, -ed, -ly, prefixes such as un-): today a new word needs a kind given from outside, one of the limits recorded in the paper, and the form level may propose it. The second is matching spoken or misspelled references to labels never seen in training ("orders" to "Orders"). Neither changes the reader.

## 13. Voice input

Voice uses the speech recognition available in the browser, followed by a corrector for the errors speech recognition makes, so that what reaches the reader is a sentence of the world. Push-to-talk is the default (a key or a button held while speaking); interim results are read and shown as the user speaks; the final result is executed. The transcript, the corrections and the frame are shown together, so the user sees what was heard, what was corrected and what was understood.

### 13.1 Speech recognition

The first engine is the Web Speech API (SpeechRecognition), with several alternatives per utterance (maxAlternatives) and interim results. Two properties matter for this demo. In Chrome, recognition is by default performed by a remote service, which contradicts the demo's claim of running offline; the API now has an experimental processLocally option that requires on-device recognition, whose availability in the target browsers is checked and recorded. Browser support differs (Chrome, Edge and Safari support the API; Firefox's support is to be checked at the time of the build). The second engine, for a guaranteed offline demo, is a local recogniser compiled to WebAssembly (Vosk through vosk-browser, or a small Whisper model through a WebAssembly build), loaded as a static file; model size, licence and accuracy are measured and recorded before one is chosen. The editor shows which engine is active and whether audio leaves the device.

### 13.2 Correction of speech errors

Speech errors are phonetic, not typographic, so they need their own corrector. Each word of the lexicon and each label in the diagram gets a phonetic key (Double Metaphone, implemented in the editor without dependency); a recognised word not in the lexicon is matched by its phonetic key and then by edit distance between keys. Word windows of one to three recognised words are matched against single lexicon words and the reverse ("a row" to "arrow", "data base" to "database"). Homophones that are all valid words (to, two, too; for, four; write, right; read, red; blew, blue) are not decided by spelling at all: the kind expected in that position decides only when the reader reads both versions, and the clearer frame wins (Section 12.3). Numbers spoken as words go to the normalizer. Fillers (um, uh, okay so) are kinds of the lexicon and are read as such.

### 13.3 Several alternatives, one reading

The recogniser returns several alternatives for an utterance. Each is corrected and read; the editor keeps the alternative whose frame is clearest, using the same rule as for spelling, and shows the others on request. This is where VSS adds something the recogniser cannot: it chooses among plausible transcripts by which one makes sense in the diagram's world, deterministically and with a reason that can be shown.

### 13.4 Labels and names by voice

Spoken labels have no quotes and can be any word. The label-intro rule (called, named, labelled, titled) marks them; the label runs to the end of the utterance or to the next word of a closed kind. A label that is a known word of the lexicon is kept as a label after an intro word. For names the recogniser does not know, the user can spell ("called Orders, O R D E R S") or correct by typing in the label field; the corrector matches spoken references against labels already in the diagram by phonetic key, so "connect it to orders" finds "Orders" even when the recogniser writes "orders" or "order's".

### 13.5 Recorded test set

Synthetic noise (Section 4.3) is not enough to judge voice. A test set of spoken commands is recorded from at least ten speakers, including non-native English speakers, on two microphones, with the commands' gold frames. It is used only for evaluation: word error rate of the raw transcript and after correction, and FULL frame on the spoken commands against the same commands typed.

## 14. Rich text widgets and dictation

The diagram can hold text widgets (a text box, a note, a card) whose content is rich text, written and formatted entirely by voice: the user says "add a note called Summary below the database", "start writing in Summary", dictates a few sentences, then says "make the first line a heading", "bold the word revenue", "turn the last three lines into a bullet list" and "stop writing". This doubles what the demo shows: the same reader technology, given a second world, separates commands from content and reads editing commands as exactly as diagram commands.

### 14.1 Text widgets

A text widget is a component kind of the diagram (Table 4) that contains a rich text document: paragraphs, three heading levels, bold, italic, underline, strikethrough, text colour, highlight, size class, bulleted and numbered lists and alignment. The widget grows with its content, and the diagram's layout and routing treat it like any other component. The text is edited with ProseMirror, an open-source rich text toolkit (MIT licence) built on a schema-defined document model in which every change is a transaction applied by code, which is what commands need, with its own undo history; Lexical (MIT) and Quill (BSD-3-Clause) are the alternatives. The choice and licence are recorded in web/README.md. The text is stored in the diagram's semantic model and exported with it.

### 14.2 Command mode and dictation mode

The editor has two modes. In command mode, the default, every utterance is a command, for the diagram or for the text. Dictation mode starts with a command ("start writing in Summary", "write in the note") or a click in a text widget, and ends with "stop writing", "done" or the Escape key. In dictation mode spoken words become text at the cursor. Spoken punctuation and layout follow the usual dictation conventions, handled by a fixed table in the normalizer: comma, full stop or period, question mark, colon, open and close quote, new line, new paragraph, bullet, and the escape word "literally" that writes the next word as text ("literally comma").

### 14.3 Editing commands inside dictation: a second world

The difficult point of dictation is to tell a command from content: "make the first line bold" is a command, while "we should make the first quarter bold in our plans" is content. The editor uses a second world, textedit, with its own legend and its own reader, in the multi-world arrangement of tool/SPEC section 9. In dictation mode every utterance is read by the textedit reader. It is executed as a command only if the reading has status ok and every margin is above a command threshold set on calibration rows that include dictated prose; otherwise it is inserted as text. An utterance close to the threshold is inserted as text and a small chip offers to apply it as a command, so the user never loses words and never has a command run by surprise.

**Table 9. The textedit legend**

| **Element**  | **Content**                                                                                                                       |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------|
| **Events**   | select, format, unformat, insert, delete, replace, move cursor, capitalise, make list, make heading, align, undo, redo, read back |
| **unit**     | character, word, sentence, line, paragraph, list item, everything, the selection, that                                            |
| **ordinal**  | first, second, third, last, previous, next, this, the last three                                                                  |
| **match**    | a quoted or matched piece of text: "the word revenue", "from Q3 to the end"                                                       |
| **format**   | bold, italic, underline, strikethrough, highlight, heading one to three, bullet list, numbered list                               |
| **value**    | colour, size class                                                                                                                |
| **position** | before, after, at the start, at the end                                                                                           |
| **new text** | the text to insert or to replace with                                                                                             |
| **widget**   | which text widget, resolved by the diagram's resolver ("in the Summary note")                                                     |

Examples of commands: "bold the last sentence", "make revenue red", "delete the previous word", "replace twenty with thirty", "turn the last three lines into a numbered list", "put a full stop at the end", "capitalise that", "select from Q3 to the end and make it italic" (Level 2, two events).

### 14.4 Resolving text targets

Text targets are resolved against the widget's content and the cursor: a unit with an ordinal is counted from the cursor or from the start; a match is searched first exactly and then through the normalizer ("twenty" and "20" match) and the phonetic key, because the recogniser may have written the word differently from how it is spoken. Several matches are highlighted and the user chooses; no match is reported. The resolution is shown before a destructive change (delete, replace) is applied, and every change is a single undoable transaction.

### 14.5 The recogniser for content

Content is open vocabulary, so dictated text needs a general speech recogniser (the browser's, or a local Whisper model for offline use); the diagram's corrector, which pulls words towards the world's lexicon, is never applied to content, only to the readings of commands. Content can still be corrected by command ("replace their with there").

### 14.6 Data

The textedit world has its own generator and paraphrases, as in Section 4. Its calibration and test sets include dictated prose taken from public-domain text, with a deliberate share of sentences that contain editing words in ordinary use ("make", "bold", "delete", "replace", "first line"), so that the rate at which content is mistaken for a command is measured where it is hardest.

## 15. Longer input: long sentences, several sentences, and the SOP circuit

Users do not always speak in one short command. They dictate a paragraph ("Add a database called Orders. Connect it to the API. Then make it red, and don't let anyone delete it."), or one long sentence with several clauses. The reader's state has a measured capacity (at D = 1024 a sum of bound pairs reads cleanly up to about 32 terms and fails around 64; a depth-3 state of the reference world holds 49 terms and still reads at 0.977), so long input cannot go into one state. The demo handles it hierarchically: the input is split into units of meaning, each unit is read into its own wire, and the wires are linked into one SOP circuit, a graph the editor shows and executes. Everything in this section is deterministic in the demo; the learned parts that would make it better are the VSS improvements of Section 15.5, run in parallel and swapped in only when they meet their criteria.

### 15.1 Segmentation into units of meaning

The segmenter runs after the normalizer and before the reader. It cuts the input at sentence punctuation; at coordinating conjunctions between two commands ("and", "then", "and then", "also"); at discourse connectives ("because", "so", "but", "after that", "before that"); and at subordinators that open a condition or a report ("if", "when", "unless", "says that"). The reader itself gives a second signal: its learned gates mark the kinds of words that open a level, and a cut is placed only where a gate is open, so a conjunction inside an entity ("the boxes and the circles", a set) is not a cut. The result is a list of segments, each with its connective and the segment it attaches to.

A wrong cut is detected by the reading, not guessed in advance. Each segment is read; a segment whose reading is poor (status no-sense or abstain, core roles empty, a large residual) is merged with its neighbour and read again, and among the admissible segmentations the one with the clearest frames (highest minimum margin, then smallest total residual) is kept. This is the same rule the demo uses for spelling and speech alternatives (Sections 12.3, 13.3), applied one level up. A segmentation that the rule cannot settle is shown to the user as two readings to choose from.

### 15.2 The SOP circuit

The segments' wires form one SOP file, the circuit, with four kinds of links, each from a stated source. Within a segment, the \`\$\` references the reader already writes (reporting, negation, conditions, compound entities). Across segments, a shared entity: a description that resolves to the same component of the diagram ("the database Orders", then "it") becomes one entity wire referred to by every command that touches it. Across segments, an explicit discourse link: the connective becomes an operator wire that joins two wires, \`then\` (ordered succession), \`because\`, \`so\`, \`but\`, beside the \`if\` and \`and\` the format already has; the legend lists them as operators, so \`sop check\` validates them. And the order of the text, the \`\_sentence=\` line that every top-level wire carries. Nothing else is added: a causal link the text does not state ("The server went down. Orders were lost.") is not inserted, because it would need knowledge of the world; such an inference belongs to a reasoning engine or to the large model of the slow path, whose proposal is then checked.

```
@w1 create
_text=add a database called orders .
_sentence=0
object=$e1
@e1 entity
head=database
text=Orders
det=a
@w2 connect
_text=connect it to the api .
_sentence=1
source=$e1
target=$e2
@e2 entity
head=api
det=the
@w3 then
_sentence=2
after=$w2
scope=$w4
@w4 change
_text=then make it red .
object=$e1
color=red
@w5 not
_text=don't let anyone delete it .
_sentence=3
scope=$w6
@w6 delete
object=$e1
```

"It" in the second and third sentences is resolved to \`\$e1\` by the resolver's rule (Section 10.3), and the circuit records that the link came from a rule, in a reserved line \`\_link.object=rule:recent\`, so that a later learned resolution can be told apart from it.

### 15.3 What the circuit gives the editor

The circuit is a graph, and the editor reads three things off it. First, which requests are independent and which are linked: wires that share no entity and no discourse link are separate components of the graph and can be planned in any order; linked wires are planned together. Second, the order of execution: a topological sort over the discourse links and the shared entities (a component is created before it is connected, a condition before its consequence, a \`then\` after what it follows); a cycle, which can only come from a wrong link, is reported. Third, conflicts: two wires that set the same role of the same entity to different values ("make it red" and "make it blue" in one paragraph) are found by \`sop diff\` applied inside the circuit and put to the user before anything runs. A question wire (\`\_mood=question\`) links to the entity it asks about and is answered from the diagram, in the order the circuit gives.

The side panel gains a circuit view: the wires as boxes, the links as arrows, with the kind of each link (reference, shared entity, discourse, order) and its source (reader, rule, user). The whole paragraph is planned as one plan and undone as one unit; a segment the reader could not read stops the plan at that point and shows what was understood before it.

### 15.4 Long single sentences

A single sentence that is too long for one state is handled by the same segmenter at clause level: the subordinators and the open gates mark the clauses, each clause is a wire, and the top-level wire refers to them. The sentence state then contains references to clause states rather than all the terms, which removes the capacity limit for any length. Which sentences need this is a measurement, not a setting: the generator produces sentences of 10 to 40 words, and the run reports FULL frame against length, whole and segmented, at D = 1024 and at D = 4096 (the next measurement named in the paper), so that the demo cuts only where the whole reading starts to fail.

### 15.5 VSS improvements run in parallel

The segmenter, the shared-entity rule and the discourse operators make the demo work now. Four changes to VSS would make them better, and they are run as separate measured changes on the constructed worlds of the repository, where the generator knows the true circuit, while the demo is built. The demo uses the rule-based path until the learned one meets its criterion, and the About panel says which is active.

**Table 10. Improvements to VSS, their criteria, and what they replace in the demo**

| **Change**                                                                                                                      | **Criterion before the run**                                           | **Replaces**                                         |
|---------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|------------------------------------------------------|
| **Capacity: D = 4096 on sentences of 10 to 40 words**                                                                           | FULL frame at 30 words within 0.03 of the 10-word value; cost reported | nothing: it sets where the segmenter must cut        |
| **Learned clause boundaries: a gate value read as a cut, trained on sentences with their clause wires**                         | boundary accuracy ≥ 0.97 on held-out formulations                      | the punctuation and connective list in the segmenter |
| **Reference across sentences: the pronoun read as a borrowed identity, the previous sentence's entities offered as candidates** | resolution ≥ 0.95 on constructed dialogues; confident-wrong \< 2%      | the recent-object rule (Section 10.3)                |
| **Discourse operators as legend operators: then, because, so, but, trained inside two-sentence worlds**                         | scope accuracy ≥ 0.97 one level deeper than trained                    | the connective table                                 |
| **Circuit-level evaluation: the whole circuit against the generator's, link by link**                                           | link precision and recall reported; no criterion on the first run      | nothing: it is the measure the others are judged by  |

The first and the last are measurements that frame the rest; the middle three are learned readings that replace rules. Each is a change to the legend and the decoder, not to the algebra, and each follows the project's rule of one change per run with its criterion written first.

## 16. Formula widgets edited by voice and text

A formula is not a line of words: it is a tree. A fraction has a numerator and a denominator, a sum has a lower bound, an upper bound and a body, a power has a base and an exponent, an index says which variable is meant. This is the structure the reader already handles for reports and negations: an operator that opens a level, with roles inside it. The formula feature is therefore a third world, matheditor, on the same reader, and the demo shows a formula being dictated, read into a tree with its margins, rendered, and then edited by commands ("put the whole thing over two a", "replace the exponent with n plus one", "wrap the second term in parentheses").

### 16.1 Formula widgets

A formula widget is a component kind of the diagram that holds one expression. The expression is stored as a tree (MathJSON) in the diagram's semantic model, rendered with KaTeX (MIT licence), and editable with the mouse and keyboard through MathLive, a math input web component (MIT licence, no dependencies, imports and exports LaTeX and MathJSON). Voice and text commands change the tree; the widget re-renders; the diagram treats it as any other component, so it can be placed, connected and grouped like a box. The choice of libraries and their licences are recorded in web/README.md.

### 16.2 Dictating a formula: the tree as nested levels

A dictated formula ("x squared plus two x minus one, all over two a") is read by the matheditor reader into a tree. The words that open a level are the operators: "over", "to the power of", "squared", "sub", "the sum from ... to ... of", "the square root of", "open parenthesis". They are level openers in the legend exactly as "says that" is in the reference world, and the roles inside a level are the tree roles of Table 11. The reader composes levels it never saw at that depth, as it does for reports, which is the property the demo shows here: a formula nested one level deeper than any in training reads correctly or reports where it did not.

**Table 11. The matheditor legend**

| **Element**                        | **Content**                                                                                                                                                                                                                                  |
|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Tree operators (level openers)** | fraction (over, divided by), power (to the, squared, cubed), subscript (sub, index), sum, product, integral (from, to, of, d), root (square root of, nth root of), parentheses, absolute value, function application (sine of, log of, f of) |
| **Tree roles**                     | left, right (binary operators); numerator, denominator; base, exponent; index; lower, upper, body; argument; the operand of a unary operator                                                                                                 |
| **Symbols**                        | variables (latin and greek letters, spoken by name), digits and numbers, constants (pi, e, infinity)                                                                                                                                         |
| **Relations**                      | equals, less than, greater than, approximately, implies                                                                                                                                                                                      |
| **Edit events**                    | insert, replace, delete, wrap (in parentheses, in a fraction, under a root), move, select, factor out, swap sides, undo                                                                                                                      |
| **Targets of edits**               | a description of a subexpression: the numerator, the exponent of x, the second term, the left side, the whole thing, the selection, that                                                                                                     |

```
@w1 expr
_text=x squared plus two x minus one all over two a .
root=$w2
@w2 fraction
numerator=$w3
denominator=$w6
@w3 plus
left=$w4
right=$w5
@w4 power
base=x
exponent=2
@w5 minus
left=$w7
right=1
@w7 times
left=2
right=x
@w6 times
left=2
right=a
```

The tree is translated deterministically into LaTeX and MathJSON (a mechanical rewrite with no learning, as the Prolog translation of the paper), rendered, and shown beside the frame panel with the margins of each level. Evaluation of the formula (a numeric value for given variables) is not part of the demo; a computer algebra engine can be attached later as the reasoning engine the frame is handed to.

### 16.3 Ambiguity held open

Spoken formulas are ambiguous in a way that typed ones are not: "x plus one over two" is (x + 1) / 2 or x + 1/2, and "all" or a pause is what people use to say which. The reader does not guess. As in the quantifier world of the paper, where ambiguous sentences are reported as admitting both readings, the matheditor world has a legend rule for the scope of "over", "to the power of" and "sum of": when the words do not decide it, the reader reports both readings, and the editor renders both and asks the user to pick one with a click or a word ("the first", "the one with the fraction on the whole"). Spoken delimiters ("all over", "the quantity", "open parenthesis", "end of fraction") close the ambiguity and are in the generator's formulation families.

### 16.4 Editing commands on the tree

Edit commands are read in the same world and resolved against the tree: "the numerator", "the exponent of x", "the second term" are tree queries, answered by walking the MathJSON tree, with several matches highlighted for the user to choose. "Replace the exponent with n plus one" has a new subexpression as its value, read as a nested formula inside the command. Every edit is one undoable transaction, and destructive edits show their target before applying. Dictation mode for formulas follows Section 14.2: "start a formula" opens the widget in dictation, "end formula" closes it, and the command threshold of Section 14.3 decides command against content with the matheditor reader.

### 16.5 Data and criteria

A generator produces expressions from a small grammar (arithmetic, powers, fractions, roots, sums, products, integrals, functions, relations) to depth 3, with the gold tree, and verbalises each through several spoken families (textbook reading, informal reading with "all over" and pauses, letter-by-letter variables, with and without explicit delimiters), recording the family for the held-out split. Depth 3 is held out for the unseen-depth split; ambiguous verbalisations are generated with both gold readings. A large model adds paraphrases as in Section 4.2. Edit commands are generated against random trees with their expected trees after the edit. The criteria, written before the first run: tree exactly right on seen formulations ≥ 0.95; held-out formulations reported with confident-wrong \< 2% at coverage \> 80%; unseen depth \> 0.90; ambiguous formulas reported as such ≥ 0.95 with no false "both" on unambiguous ones; edit commands resolved and applied correctly on 100% of the scripted suite; a recorded set of dictated formulas from ten speakers, FULL tree within 0.05 of the typed verbalisation.

## 17. Sketch recognition: from scribbles to clean diagrams

The demo gains a sketch pad. The user scribbles boxes, circles, diamonds, arrows and a few containers with the mouse, a pen or a finger, presses "clean up" or says "make this neat", and the sketch is replaced by smart components of the right kinds, connected as drawn, grouped as drawn, and laid out cleanly. Combined with voice ("call the left box Orders", "the diamond is a decision called paid?"), the sketch becomes a diagram in a few seconds. The feature has two stages, and the second is where VSS is shown: recognising strokes is classical, reading the scene into a structured description with its relations and its uncertainty is the reader's job, and the output is the same SOP circuit that typed commands produce, so the same planner and layout build the diagram.

### 17.1 From strokes to candidate symbols

Strokes are captured as point sequences with time. Each stroke, or each group of strokes drawn close together in space and time, is classified by a template recogniser: \$Q, the multistroke recogniser of the \$-family (New BSD licence, a JavaScript implementation exists), trained on templates of the component kinds (rectangle, rounded rectangle, ellipse, diamond, cylinder, folded page, stick figure, arrow head, line, zigzag for a text placeholder). The recogniser returns, for each stroke group, a ranked list of kinds with scores and the group's bounding box; a stroke group that matches nothing well is kept as an unknown blob. Lines and arrows are detected by their aspect and their endpoints; an arrow head at one end gives the direction. Nothing is decided at this stage: the candidates, with their scores and boxes, go to the scene reader.

A bitmap (a photo of a whiteboard, an image pasted into the pad) goes through a classical pre-stage first: greyscale, adaptive binarisation, thinning, connected components, contour tracing and polyline simplification, which turns the ink into strokes; the rest of the pipeline is the same. This path is an experiment with lower expectations, stated as such: photographs bring shadows, text and gridlines the stroke path never sees, and the measured numbers decide whether the pad accepts images in the demo.

### 17.2 Reading the scene

The scene reader is a VSS reader over a scene world whose input is not a sentence but a set of (kind, box, score) candidates, so the address of each element is given by its position instead of guessed from words. Each candidate is deposited at an address derived from its box and bound to its kind's identity; the scene state is the sum. The scene legend asks the questions the diagram needs: for each element, its kind and its attributes; for each line or arrow, its source and its target (the elements whose boxes are nearest its endpoints, read as a relation); for each element, its container (the element whose box encloses it); and over the whole scene, rows, columns and alignments, which become the layout hint. The answers are written as the SOP circuit of Section 15: one create wire per element, one connect wire per arrow, one group wire per container, with the layout hint on an arrange wire, and the planner builds the diagram from it exactly as from a paragraph of commands.

What VSS adds over a hand-written geometry pass is the same three things as everywhere in the demo. Relations are read from the state by the algebra, with a margin, so "which box does this arrow point to" has a confidence and the two best candidates. Ambiguity is held open: a stroke group that is a rectangle or a diamond at close scores becomes an element with both readings, and the clearer scene decides or the user is asked, with both renderings shown. What is not understood is reported: an unknown blob is kept as a drawing with a question ("keep this as a sketch, or tell me what it is?"), never silently dropped or guessed. And the reading is deterministic: the same strokes give the same diagram.

### 17.3 Positions as addresses: the one change to the algebra

In the text worlds every address is learned from the kinds of words. In the scene world the address is the position, and the standard device for it in vector-symbolic architectures is fractional power encoding: a base vector P raised to real powers, so that a point (x, y) has the address P^x ⊗ P^y, nearby points have similar addresses, distant points nearly orthogonal ones, and a displacement is a multiplication: the scene shifted by (dx, dy) is S ⊗ conj(P^dx ⊗ P^dy). Relations such as "to the right of" and "inside" are then read by displacing and comparing, not learned. This is a change to the address code of the state, so it is run as a separate experiment on a constructed world of shapes at positions, where the generator knows every relation: the criteria, written first, are relation readout (left of, above, inside, nearest endpoint) ≥ 0.97 on held-out scenes, the smallest distance at which two elements stay separable at D = 1024 and D = 4096 reported, and capacity in elements per scene reported. Until the experiment meets its criterion, the demo's scene reader uses a rule-based geometry pass with the same interface (endpoint-to-box distance, containment by boxes), as the segmenter does for links in Section 15; the About panel says which is active.

### 17.4 Labels, voice and the sketch together

Handwritten text inside boxes is not read: handwriting recognition is outside the demo. A box with a scribble inside it becomes a component with an empty label and a mark, and the user names it by voice or by typing ("call the top box Orders", "the diamond says paid?"), which is the natural combination of the two inputs and a good moment in the demo. The sketch pad stays available after clean-up: the user can scribble a new box next to the clean diagram and it is recognised and connected in place.

### 17.5 Data and criteria

A generator renders random diagrams (3 to 15 elements, connectors, one or two containers) as synthetic strokes with hand-drawn noise (jitter, overshoot, gaps at corners, wobble, varying speed), with the gold circuit; a hand-drawn test set is collected from at least ten people on a tablet and with a mouse, each drawing given diagrams, with the gold circuits. Criteria, written first: symbol kind ≥ 0.95 on synthetic strokes, reported on hand-drawn; connector source and target ≥ 0.97 synthetic, reported on hand-drawn; containment ≥ 0.95; whole-circuit precision and recall reported; unknown blobs reported rather than guessed on 100% of the planted unknowns; the bitmap path reported separately with no criterion on the first run.

## 18. Long scripts: building a diagram from a whole document

The segmentation and the circuit of Section 15 remove the limit on length: no state holds ten pages, and none has to, because every unit of meaning has its own state and the links live in the circuit. The demo therefore accepts a script of any length, from a paragraph to a document of several pages, typed, pasted, dictated or written by a large model, and builds the diagram from it. This is the demo's closing scene: a document scrolls on one side, the circuit grows on the other, and the diagram builds itself, section by section, with the units the reader did not understand marked rather than guessed.

### 18.1 What a long script needs beyond a paragraph

Four things change between a paragraph and a document, and each is a stated mechanism rather than a hope. First, the document's structure: headings and sections become section wires in the circuit, each a container that the units inside it attach to; a section becomes a container in the diagram, or a separate diagram, so that layout works on a few dozen components at a time rather than on hundreds. Second, references over distance: "the second database", "the gateway from the first section", "the box we added earlier" are beyond the recent-object rule; the resolver searches the diagram by kind, label, ordinal of creation and section, in that order, shows the resolution, and asks when several components fit; the learned reference of Section 15.5 is what makes this robust, and until it meets its criterion the search is the rule. Third, error accumulation: three hundred commands at 0.99 each are three wrong ones, so every unit with a margin under tau, every unresolved reference and every failed precondition is marked in the circuit and in the document view, the plan runs up to the first blocking one and waits for the user, and the About panel reports the counts; nothing is hidden to keep the demo smooth. Fourth, execution as a document: the whole script is one plan with checkpoints at the section boundaries, undo returns to a checkpoint, and a change to one sentence of the script re-reads only that unit and re-plans what depends on it in the circuit.

### 18.2 The language of the script

The reader understands the language of the editor's world: components, attributes, relations, connections, groups, layouts, names, written in free English with all the formulations the paraphrase families cover. It does not understand free description ("a cloud hovers above the server, suggesting remote storage"), and it says so, unit by unit. A script written by a person for the editor is in the world's language by nature. A script written by a large model is in the world's language only if the model is told what the world is, which is the point of the next subsection.

### 18.3 The large model as the author: an instruction-following test

The demo's long script is written by a large model. The model receives the legend of the diagram world as an instruction: the component kinds, the attributes, the relations, the actions, a few example sentences of each family, and the rule that it may use only these, in free English, one request per sentence, naming every component it will refer to later. It is then asked to describe a diagram (an architecture, a process, a scene from a picture it is shown) as a script for the editor. The script goes through the full pipeline, and the reader is the judge: every unit it reads with a clear frame is executed, every unit it cannot read is marked with the reason (a word outside the world, an unknown action, a reference that resolves to nothing).

This turns the demo into a measurement of the large model, and it is a fair one, because the ground truth is the legend the model was given. Two numbers come out of every run and are shown on screen: the share of the script's units that the reader could read (instruction following), and, on the units it read, the share that built what the model's own description meant (fidelity, checked by a second reading of the final diagram back into text and a comparison with the script by \`sop diff\`, or by a person on a sample). Several large models are run on the same descriptions and the same legend, and the comparison is reported in a table, with the units each model lost and why. The demo does not claim that a low number means a worse model; it claims that the reader can tell, unit by unit and with a stated reason, where a model stopped following the world it was given, and that is the supervision property of the Lab in a form an audience can watch.

A second, harder variant keeps the legend out of the model's prompt and routes the free description through the slow path (Section 20): the model is asked afterwards to translate its own description into the editor's language, and the reader checks the translation. The two variants together show the division of labour of the research book: the large model for coverage, the reader for verification, and the legend as the contract between them.

### 18.4 Data and criteria

A script generator writes documents of 1, 5 and 10 pages from the diagram generator's commands, with headings, sections, cross-section references and the gold circuit and gold diagram; a share of units is deliberately out of the world, with the expected mark. Criteria, written first: units executed correctly ≥ 0.95 of the in-world units at 1 page and reported at 5 and 10 pages; out-of-world units marked, never executed, on 100% of the planted ones; cross-section references resolved ≥ 0.95 with the rule, and reported for the learned reference when it is swapped in; the final diagram against the gold one, component by component and link by link, with precision and recall reported at each length; the reading and planning time per page reported. For the large-model author: instruction following and fidelity reported per model on a fixed set of ten descriptions and one legend, with no criterion on the first run, because the numbers are the finding.

## 19. Animation: the diagram in time

An animation is a diagram plus time. The user takes a diagram built by voice or from a sketch and says "animate it: the request goes from the user to the gateway, then to the API, then to the database, and the answer comes back the same way; highlight each component when the request reaches it; two seconds per hop", then corrects it ("slower on the way back", "make the gateway blink when the request arrives", "loop it"). The editor reads the instructions, builds a timeline, plays the film and exports it. Almost everything is reused: the components, the resolver, the planner, the solver, the circuit. What is added is a time role in the legend, temporal operators in the circuit, a timeline computed by the same solver that computes positions, and a renderer that interpolates between scene states. The result is an explainer of architectures and processes made by voice, which is a thing people build by hand today, and the closing scene of the demo in motion.

### 19.1 Time in the legend

Animation commands are editor commands with two more questions, when and for how long. The diagram legend gains the roles of Table 12; the actions are those of Table 2 plus the ones that only make sense in time (appear, disappear, fade in, fade out, blink, pulse, rotate, follow a path, travel along a connector, highlight, wait). The temporal relations between units are discourse operators of the circuit (Section 15.2): \`then\` and \`after\` (succession), \`while\` and \`meanwhile\` (simultaneity), \`until\` and \`when\` (a condition in time), \`before\`. None of this changes the reader's mechanism; it is roles, closed values and operators, as everywhere in the world.

**Table 12. Temporal roles**

| **Role**      | **Question**               | **Filler**                                                                                       |
|---------------|----------------------------|--------------------------------------------------------------------------------------------------|
| **start**     | when does it begin?        | value: a time (at three seconds), or a relation to another unit through then, after, while, when |
| **duration**  | how long does it take?     | value: seconds, or a closed value (quickly, slowly, instantly)                                   |
| **speed**     | how fast?                  | closed value: slow, normal, fast; relative: slower, faster, twice as fast                        |
| **easing**    | how does it move?          | closed value: smoothly, linearly, bouncing, suddenly                                             |
| **repeat**    | how many times?            | value: a count, or forever / loop / once                                                         |
| **path**      | along what?                | entity: a connector or a sequence of components (from the user to the gateway to the API)        |
| **traveller** | what moves along the path? | entity: a token (a dot, a small envelope, a request), created for the animation                  |
| **trigger**   | on what event?             | closed value: when X arrives, when X appears, when the user clicks                               |

```
@w1 travel
_text=the request goes from the user to the gateway , then to the api , then to the database .
traveller=$e9
path=$e1 & $e2 & $e3 & $e4
duration=2
unit=s
_per=hop
@w2 highlight
_text=highlight each component when the request reaches it .
object=$e1 & $e2 & $e3 & $e4
trigger=$w1
_sync=when_reached
@w3 then
after=$w1
scope=$w4
@w4 travel
_text=and the answer comes back the same way .
traveller=$e9
path=$e4 & $e3 & $e2 & $e1
duration=2
unit=s
_per=hop
```

### 19.2 The timeline: the solver on the time axis

The circuit with its \`then\`, \`while\`, \`after\` and \`until\` links is already a graph of temporal dependencies. The topological sort of Section 15.3 becomes a placement on the time axis: each unit gets a start and an end from linear constraints of the same kind as the geometric ones of Section 8.2 (B.start = A.end for then; C.start = A.start for while; A.end − A.start = 2 s for a duration; a per-hop duration multiplied by the number of hops of the path), solved by the same Cassowary solver with the same strengths: the user's explicit times are strong, keeping the rest of the timeline unchanged is medium, aligning to a 100 ms grid is weak. A correction ("slower on the way back") re-reads one unit, changes one constraint, and the solver moves only what depends on it. The timeline is shown as a panel of bars, one per unit, with the constraints that placed each bar, beside the circuit and the frame; it is the explanation of the film in the same way the geometry panel is the explanation of a placement.

### 19.3 Rendering and export

Each unit of the timeline is an interpolation between two states of the scene for the properties it touches (position, size, colour, opacity, rotation, a traveller's position along a route), with the easing of the legend; the renderer composes the units at every frame and draws the scene through the diagram engine, so the film shows exactly the components the user built, with their connectors re-routed if something moves. Playback has play, pause, scrub and loop, by button and by voice ("play", "from the start", "stop at the gateway"). The film is exported as an animated SVG, as a sequence of frames (PNG) and as the circuit with the timeline (SOP plus a JSON timeline), which together are a structured script of the film: who, what, where and when. The frames and the script are what a video generator can take as guidance, the frames for composition and motion, the script as text; that second step is outside the demo, and the export is specified so that it stays possible.

### 19.4 Invariants: the interlock on every frame

A prohibition in an animation is checked on every frame, not only at the command: "never let the request leave the connectors", "the title must stay visible", "nothing overlaps the database" are locks of Section 10.4 evaluated by the renderer at each frame, and a timeline that would violate one is reported before playing, with the frame and the rule. This is the semantic interlock of the research book on a film: the declared rules are checked on the state at every moment, and the explanation is the rule and the time at which it would break.

### 19.5 Characters and named motions

A character is a component with parts (a head, a body, two hands, for a figure; a wheel and a chassis, for a vehicle) and a small repertoire of named motions, each a parameterised animation written once as part of the world's conventions: walk (to a target), jump, wave, turn (towards), nod, shake, bounce, grow, shrink. "The robot walks to the database and waves" is \`walk\` with a target followed by \`wave\`, planned as any sequence. The repertoire and the characters are listed in the legend and shown in the About panel; the demo does not promise free-form cartoons, it promises a theatre of shapes and a few characters with named motions, exactly readable and exactly reproducible. New motions are added to the repertoire by the world's authors, not invented by the reader, and a motion the legend lacks is reported as unknown.

### 19.6 Questions about the film

Questions of Section 3.2 gain a time: "where is the request at second three?", "what is highlighted when the answer reaches the gateway?", "how long does the whole thing take?" are answered from the scene state at that moment of the timeline, read by the same mechanism, which is the scene world of Section 17.2 applied to a frame; the answer comes with the frame shown.

### 19.7 Data and criteria

The diagram generator is extended with the temporal roles and operators and produces animation scripts with their gold circuit and gold timeline (unit starts and ends), including corrections to an existing timeline; a large model paraphrases as in Section 4.2. Criteria, written first: temporal roles and relations on held-out formulations with the same thresholds as the diagram world (confident-wrong \< 2% at coverage \> 80%); the computed timeline against the gold one, order and overlaps exact and starts and ends within 50 ms, on 100% of the scripted suite; corrections that change only the dependent units, on 100% of the suite; invariants caught before playing on 100% of the planted violations; a set of animation scripts dictated by ten people on given diagrams, with the resulting films judged on a sample against the intended ones, reported. Reading and timeline time per unit, and rendering frame rate on the stated laptop, reported.

## 20. Optional slow path with a large model

When a request is outside the world ("draw the architecture of a web shop"), the editor can, if the user has enabled it and given an API key, send the request and the legend to a large model and ask for a list of commands in the editor's language. Each proposed command is read by the VSS reader like a typed one, planned and checked against the locks; the proposals are shown as a list with their frames, and nothing changes until the user accepts. A proposal the reader cannot read, or the planner cannot execute, is shown as rejected with the reason. The demo must run fully without this path; it exists to show, in one picture, the large model proposing and the small verifiable reader and planner checking.

## 21. Evaluation and acceptance

The criteria below are written before the first run. Each run reports every axis, on five seeds unless stated, with the confident-wrong rate at tau beside every accuracy, and labels the numbers as the project's rules require.

**Table 13. Axes and criteria**

| **Axis**                                                      | **Measure**                                                                                                           | **Criterion**                                                                             |
|---------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| **Seen formulations**                                         | FULL frame                                                                                                            | ≥ 0.98                                                                                    |
| **Held-out formulations (templates and paraphrase families)** | FULL frame; confident-wrong and coverage at tau                                                                       | confident-wrong \< 2% at coverage \> 80%; FULL reported                                   |
| **New labels**                                                | label role accuracy                                                                                                   | ≥ 0.99                                                                                    |
| **Value slots (amount, unit, fraction, anchor)**              | slot accuracy                                                                                                         | ≥ 0.98                                                                                    |
| **Negated attributes and prohibitions**                       | scope accuracy                                                                                                        | ≥ 0.97                                                                                    |
| **Unseen depth of relative references (Level 2)**             | FULL frame                                                                                                            | \> 0.90                                                                                   |
| **Out-of-world sentences**                                    | share reported no-sense or unknown-event                                                                              | ≥ 0.90, with false no-sense on in-world sentences ≤ 2%                                    |
| **Typing noise, one error per sentence**                      | token correction accuracy; FULL after correction                                                                      | ≥ 0.95; FULL within 0.03 of clean                                                         |
| **Form level against the classic corrector**                  | token correction accuracy on typing and speech noise; FULL after correction                                           | default only if at least as good on both                                                  |
| **Kind of an unseen word from its form**                      | kind accuracy on held-out words                                                                                       | reported; used only if ≥ 0.9                                                              |
| **Clean input**                                               | false corrections                                                                                                     | ≤ 0.5% of tokens                                                                          |
| **Dictated prose, command threshold**                         | content executed as a command                                                                                         | ≤ 1% of utterances (prose set with editing words)                                         |
| **Editing commands in dictation**                             | commands inserted as text; FULL frame of textedit on held-out formulations                                            | ≤ 5%; as for the diagram world                                                            |
| **Text target resolution**                                    | scripted documents and commands with the expected text after                                                          | 100% pass                                                                                 |
| **Segmentation of paragraphs and long sentences**             | cut accuracy against the generator; FULL frame per unit, whole vs segmented, by length                                | cuts ≥ 0.97; FULL per unit within 0.03 of single commands                                 |
| **Circuit links**                                             | shared entities, discourse links and order against the generator's circuit                                            | precision and recall reported; execution order correct on 100% of the scripted paragraphs |
| **Formulas: tree on seen / held-out / unseen depth**          | tree exactly right; confident-wrong at tau                                                                            | ≥ 0.95; reported, \< 2% at coverage \> 80%; \> 0.90                                       |
| **Formulas: ambiguity and edits**                             | both readings reported; scripted edit suite                                                                           | ≥ 0.95 with no false both; 100% pass                                                      |
| **Sketch: symbols, connectors, containment**                  | synthetic strokes; hand-drawn set                                                                                     | ≥ 0.95, ≥ 0.97, ≥ 0.95 synthetic; hand-drawn reported                                     |
| **Scene reading with positions as addresses (17.3)**          | relation readout on held-out scenes; separability and capacity                                                        | ≥ 0.97; reported                                                                          |
| **Long scripts: 1, 5, 10 pages**                              | in-world units executed correctly; planted out-of-world units marked; cross-section references; final diagram vs gold | ≥ 0.95 at 1 page, reported at 5 and 10; 100%; ≥ 0.95; precision and recall reported       |
| **Large model as author**                                     | instruction following and fidelity per model, ten descriptions, one legend                                            | reported; no criterion on the first run                                                   |
| **Animation: temporal roles and relations**                   | held-out formulations; confident-wrong and coverage                                                                   | \< 2% at coverage \> 80%                                                                  |
| **Animation: timeline, corrections, invariants**              | scripted suite against gold timelines; dependent-only re-planning; planted violations                                 | order exact, ends within 50 ms, 100%; 100%; 100%                                          |
| **Animation: dictated scripts**                               | ten people on given diagrams; films judged on a sample                                                                | reported                                                                                  |
| **Speech, recorded set**                                      | FULL frame spoken vs typed; word error rate raw and corrected                                                         | FULL within 0.05 of typed; both rates reported                                            |
| **JavaScript and Python parity**                              | frames and statuses; states; margins                                                                                  | 100% identical; cosine ≥ 0.9999; \|Δ\| ≤ 1e-4                                             |
| **Planner and solver scenarios**                              | scripted diagrams and requests with the expected diagram after                                                        | 100% pass; computed positions within 1 px                                                 |
| **Layout and routing scenarios**                              | overlaps after layout; connectors crossing components                                                                 | 0 and 0 on the suite                                                                      |
| **Model size, reading time**                                  | MB on disk; median and p95 per reading                                                                                | reported                                                                                  |

A missed criterion is a finding, reported with its number and its cause where one can be located; the demo shows only what is met and says so in its About panel.

## 22. Deliverables and layout

```
tool/worlds/diagram/ world folder: legend, kinds, examples, model, runs, REPORT
tool/worlds/diagram/generate.py generator (4.1) with template signatures
tool/worlds/diagram/paraphrase.py paraphrase pipeline (4.2)
tool/worlds/diagram/noise.py typing and speech noise (4.3)
tool/sop/world.py star_version 2, behind a flag
tool/sop/export_web.py sop export-web (6)
web/index.html editor: canvas, input, voice, panels
web/vss.js the interpreter (7)
web/correct.js typed and speech correctors (12, 13)
web/form.js the VSS form level, letters and phonemes (12.4)
web/speech.js speech engines and alternatives (13)
web/planner.js action schemas, plans, locks (8.1)
web/geometry.js constraints, solver, placement (8.2)
web/layout.js layouts and orthogonal router (8.3)
web/segment.js segmenter and the SOP circuit (15)
tool/worlds/diagram/paragraphs.py generator of paragraphs and long sentences with their circuits (15)
web/formula.js formula widgets, matheditor commands, tree to LaTeX (16)
tool/worlds/matheditor/ third world: legend, expression generator, verbalisations, model
web/sketch.js sketch pad, stroke recogniser, bitmap pre-stage (17)
web/scene.js scene reader and the rule-based geometry pass (17.2, 17.3)
tool/worlds/scene/ scene world: generator of shapes at positions, the FPE experiment
web/script.js long scripts: sections, checkpoints, document view (18)
tool/worlds/diagram/scripts.py generator of 1, 5, 10 page scripts with gold circuits and diagrams (18)
tool/worlds/diagram/llm_author/ legend prompt, the ten descriptions, per-model results (18.3)
web/animate.js temporal legend, timeline solver, renderer, export, characters (19)
tool/worlds/diagram/animation.py generator of animation scripts with gold timelines (19.7)
web/text.js text widgets, dictation mode, textedit commands (14)
tool/worlds/textedit/ second world: legend, generator, prose sets, model
web/editor.js semantic model on the diagram library (9)
web/model/ model.json, routebook.bin, manifest.json
web/tests/ parity, scenarios, correction, layout
web/README.md how to run; libraries, versions, licences
```

The editor is a set of static files plus the chosen libraries, bundled once; it runs from any static web server or from a published page.

## 23. Order of work

Each step ends with its exit check; the next starts only when it is met or when its miss is recorded and a decision is written.

**Table 14. Steps**

| **Step** | **Content**                                                                                  | **Exit check**                                                   |
|----------|----------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| **1**    | Legend, kinds, generator at Level 1; sop check on all output                                 | check passes; coverage table of actions × roles                  |
| **2**    | Portable stars in Python and JavaScript                                                      | identical phases on the test list                                |
| **3**    | Training on templates, five seeds; the data-size curve                                       | rows for seen, new labels, value slots, negation                 |
| **4**    | Paraphrases, second look, retraining                                                         | held-out formulation row; label noise reported                   |
| **5**    | Export and vss.js; parity test                                                               | parity row met                                                   |
| **6**    | Diagram library comparison prototype; choice recorded                                        | scenario suite runs on the chosen library                        |
| **7**    | Planner, solver, placement, locks                                                            | planner and solver scenarios pass                                |
| **8**    | Layouts and router                                                                           | layout and routing scenarios pass                                |
| **9**    | Typed corrector; reader tie-break; the VSS form level as alternative                         | typing rows; form level row                                      |
| **10**   | Voice: engines, speech corrector, alternatives; recorded set                                 | speech row                                                       |
| **11**   | Interface, panels, dialog; reading time                                                      | a scripted walkthrough runs end to end by text and by voice      |
| **12**   | Text widgets; textedit world, reader and dictation mode                                      | the three text rows                                              |
| **13**   | Segmenter, circuit, circuit view; paragraph generator                                        | segmentation and circuit rows                                    |
| **14**   | Level 2 decoder extensions, one per run                                                      | Level 2 rows                                                     |
| **15**   | VSS improvements of 15.5, one per run, on the constructed worlds; swap-in by criterion       | Table 10 rows                                                    |
| **16**   | Formula widgets; matheditor world; ambiguity; edits; recorded formulas                       | formula rows                                                     |
| **17**   | Sketch pad; stroke recogniser; rule-based scene pass; hand-drawn set                         | sketch rows                                                      |
| **18**   | Positions as addresses: the FPE experiment on the scene world; swap-in by criterion          | scene reading row                                                |
| **19**   | Long scripts: sections, far references, checkpoints, document view; script generator         | long script rows                                                 |
| **20**   | Large model as author: legend prompt, ten descriptions, several models, the comparison table | author rows reported                                             |
| **21**   | Animation: temporal roles, timeline, renderer, export, invariants, characters; dictated set  | animation rows                                                   |
| **22**   | Optional slow path                                                                           | a request outside the world proposed, re-read, planned and shown |

## 24. Known limits carried into the demo

The demo inherits the reader's measured limits, and each is handled by design rather than hidden. Reference across sentences is an executor rule (Section 10.3). Structures announced after their clause ("a box, a red one") are not read; the generator does not produce them and the editor reports such sentences as unclear when the margins are low. Counting is not read: "three boxes" is a quantity value given by the normalizer. Deciding whether an optional role is present is the weakest decision on new formulations (0.772 present, 0.991 absent on the reference world); the dialog turns a low presence margin into a question. The reasoning is the planner's and the solver's, written as rules, and is exactly as good as those rules; it is shown so that it can be judged. Sentences are short in this world, within the lengths measured so far; longer sentences and paragraphs go through the segmenter and the circuit (Section 15), whose links are rules until the learned readings replace them; any sentence longer than the longest measured is reported in the run.
