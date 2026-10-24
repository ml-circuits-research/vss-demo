# The animation world (VSS Diagram Editor, spec section 19)

| file | content |
|---|---|
| `generate.py` | legend (the temporal roles of Table 12 plus the diagram roles an animation needs), kinds lexicon with lemmas, 55 templates, start / duration / modifier phrases, prefix families, held-out formulations, new identities; writes a world folder that `sop check` validates and `sop train` trains; writes COVERAGE.md |
| `normalize.json`, `normalize.py` | the normalizer: the diagram world's table with the temporal expressions added ("fade in", "per hop", "twice as fast", "half a second", seconds -> s) and "over" -> "above" removed; the algorithm of `../diagram/normalize.py`, unchanged |
| `semantics.py` | the reference semantics of a script (units, start rules and strengths, durations, the state at time t, the frame rules), written independently of `app/src/animate/` |
| `animation_scripts.py` | animation scripts with GOLD timelines (19.7), corrections with the gold set of units that move, planted invariant violations and controls, questions with gold answers; writes `training/data/animation/eval/*.jsonl` (our own generated data, committed) |
| `COVERAGE.md` | sentences per event and role, closed values of the temporal roles (the exit check of the generator) |

Run:
```
python3 training/worlds/animation/generate.py --out <worlds>/animation --n 30000 --n_eval 400 --seed 0
tool/bin/sop check --legend <worlds>/animation/legend.json <worlds>/animation/examples/*.sop
python3 training/worlds/animation/animation_scripts.py          # -> training/data/animation/eval/
node app/tests/animate.mjs                                         # the scripted suite (Table 13)
```
The world folder must be named `animation` (the SOP files carry `_world=animation`). At preparation: 78690 formulations, 8733 held out;
`sop check` OK on all three files at 30000 sentences; a CPU smoke training (`sop train --D 128 --epochs 1` on 400 sentences) runs to the end
and its `sop export-web` export loads in `vss.js` (`node app/tests/animate.mjs --reader <export>`); its numbers mean nothing at that size.

## Design choices (stated; each also in the generator's header)

- Level 1 of the decoder: one event per sentence, fillers that are words or entities, an optional `not` around the event, no nesting.
- A relation in time to another unit is two roles of one wire: `tempo` (after, before, with, while, when, then) and `ref` (the entity whose
  unit is meant), with `offset` for a delay. The spec's `@w3 then` operator wires between sentences are the circuit's (Section 15.2,
  `app/src/segment/`), built from these roles; they are not inside one sentence.
- A path is source, optional via, target (one or two hops), or a connector (`path`, "along the arrow"); longer paths are a sequence of
  travel units composed by the circuit. The spec's example `path=$e1 & $e2 & $e3 & $e4` (a set) is therefore several sentences.
- Subordinate events are not verbs: "when the request arrives" reads `trigger=arrives` (kind TRIGGER: arrives, appears, disappears,
  finishes; while: moving, blinking, traveling), so every sentence has one verb for the predicate role.
- One time unit per sentence (`unit` = s or ms for start, offset and duration); distances are `distance` (px) and angles `angle`
  (degrees), with 'px' and 'degrees' as cue words, not fillers. 'per hop' is the role `per` (the spec's example has it as `_per`, a
  reserved line the reader could not produce).
- "make X blink": 'make' (and 'let', 'have') is a CAUSE word in this world; colour changes are paint and color. In the diagram world
  'make' is the verb of change: the dispatcher by fit (spec 9 of the tool) separates the two worlds.
- Prohibitions checked on every frame: "never let anything overlap X" (`overlap`), "never let the dot leave the arrows" (`leave`),
  "never hide the title" (`not` around disappear), "do not move the gateway". "The title must stay visible" and "nothing overlaps the
  database" are paraphrases of these for the large-model step (spec 4.2), not templates.
- Questions carry `_mood=question` and `_asked=<role>`; where-questions use the event `locate` whose word is 'where' (a stated device:
  Level 1 needs a predicate word).
- "slower on the way back" (no verb) is not Level 1; its readable forms are "make the answer travel slower" and "slow down the answer".
- Characters (robot, figure, person, car) and travellers (dot, envelope, packet, token, request, answer, message, ball) are component
  words; the motions of the repertoire are the legend's `repertoire` block, the same list as `app/src/animate/characters.js`.
