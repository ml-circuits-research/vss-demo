# Activation: which rules run in a world, and which world reads a sentence

Status: design note and implementation record, 2026-10-26. Implemented in `tool/sop/activate.py` (`sop profile`, `sop train --activate auto`,
`sop train --decoder contract|paper`); mirrored to the public repository `vss-vs-bert/sop/`.

## 1. The problem

By 2026-10-25 the reader had four decoder rules (candidates from the sentence, one answer per word, undecided by adjacency, the explained
residual) and five routes (`path`, `chainL`, `bigram`, `pos`, `vorder`). Each was switched on or off per world by a person, after looking
at the errors: `vorder` on in the transfer world, off on SNIPS; the explained residual on in the demo, off in the paper's frozen rows. The
decisions were defensible one by one, but nothing in the tool stated the criterion, so a new world (a new legend written by a user of the
editor, or by an LLM in the night cycle) would have had its rules chosen by whoever trained it. A reader whose grammar is chosen by hand
per world does not scale to hundreds of worlds, and a comparison in which the author picks the rules after seeing the errors is, as the
independent review put it, "a hand-built inductive bias presented as generalisation".

## 2. Two levels of activation

The analogy that was on the table is the thousand-brains picture: many cortical columns, each with its own model of the world, voting on
what is in front of them. The analogy holds, with one precision that matters for the implementation: there are **two** activations, at
two moments, decided by two different things.

| level | what is activated | when | decided by | implemented in |
|---|---|---|---|---|
| W | a **world** (a reader with its legend and model) | at inference, per sentence | the vote: the residual of every world's reading, the fit threshold, the margin | `infer.formalize_text` with several readers (the dispatcher) |
| R | the **rules and routes** inside one world | at training, per world | the nature of the world, measured on its annotated examples | `activate.py` |

Level W is the voting. Every world reads the sentence; a world whose residual is under its fit threshold is a candidate; the candidate
with the largest margin wins; when no world fits, the sentence is refused, which is a result, not a failure. Unlike a vote among columns,
each vote is a measured quantity with a stated unit (the share of the sentence the reading does not explain), so the dispatcher's decision
can be audited sentence by sentence. Nothing in this note changes level W; the SNIPS runs with seven worlds (vss-vs-bert R72) are its
first test on real data.

Level R is the grammar of one world: what the reader is allowed to read from the state. It is decided once, at training, and written into
the model. This is where the criterion was missing.

## 3. Three classes of rules

Not everything that was called "a rule" is the same kind of thing.

**Class 1: contract rules.** Consequences of q-formalisation itself, true in every world:

- the answer to a question is a word of the sentence (`candidates: sentence`);
- a word answers one question (one-to-one over roles and speakers);
- two candidates the state cannot separate are declared undecided, with margin 0 (`undecided_adjacent`);
- the residual is the share of the sentence that no answer explains (`residual: explained`).

They do not depend on the data, they cost nothing to train, and there is no world in which switching them off is right. They were off in
the paper's rows only because the rows had been pre-registered before the rules were written. From this commit they are on in every model
the tool writes (`--decoder contract`, the default); `--decoder paper` reproduces the frozen decoder.

**Class 2: structural routes.** Hypotheses about the form of the language of this world. Each adds addresses (parameters) that have to
be trained, and each can hurt: a route that encodes a regularity the world does not have adds noise to every reading. `path`, `chainL`,
`bigram` are the reading itself (the reference bundle) and stay on. `vorder` (the order of a word relative to the verb) and `pos`
(absolute position) are candidates, and a candidate is admitted by a rule, not by a person:

> A candidate route is on in a world iff (a) its **need signal** fires on the training annotation, and (b) in a trial trained without the
> rows used for the test, it **loses no selection split** by more than eps and **wins the rows its need signal marked** (or all selection
> rows) by more than eps.

The need signal says whether the form of this world can require the route at all. For `vorder` it is same-kind competition: training
rows that fill two questions with words of the same kind, so that the kinds alone do not separate the roles. In the transfer world 78% of
the rows have it (agent and recipient are both persons); in the commands world 0% (action, patient, destination have different kinds);
in the quantifier world 100%. Within the competing rows, the share where neither word is cued by a preposition is reported separately:
there only the order separates the pair, and a bundle that still loses them is a diagnostic (section 4). For `pos` the signal is rigid
order: every core role's head at one absolute position in at least 90% of the rows.

The acceptance test is the same test that was applied by hand on 2026-10-25 to accept `vorder` variant b and reject variant a: no split
may drop, and something must rise. The selection rows are the calibration halves of the held-out formulations (never reported, rule 25)
plus a hashed tenth of the training rows, removed from the trials' training. The trials, the per-split numbers and the decision are
written to `model/config.json` under `activation` and to the run folder (`activation.json`, `PROFILE.md`), so a reviewer can see why a
world has the routes it has, and so that a change of the data changes the decision without anyone editing a legend.

**Class 3: diagnostics.** Signals that no rule or route can act on, and that therefore are reported and left alone:

- tokens without a kind: no route reads a word without a kind; the fix is the typer (`typer.py`) or the lexicon, not a route;
- same-kind competition that the accepted bundle still loses on the selection rows: no address separates the pair; the fix is a question
  missing from the legend (the pair answers two questions the legend conflates) or a world to split in two (the pair belongs to two
  grammars);
- levels in the examples without declared opener kinds: the depth cannot be estimated;
- training rows the reader cannot explain with the gold structure: examples outside the legend.

These are the signals of the night cycle (addendum of 2026-10-25, sections 7.4 and 7.5): they say when to add a question and when to
make a new world, which is the level-W question again.

## 4. What this gives, and what it does not

It gives one place where the grammar of a world is decided, by measurement, with the decision recorded. The demo's worlds, SNIPS's
seven worlds and any legend an LLM writes go through the same `sop train --activate auto`, and the question "why does this world have
`vorder`" has an answer in its config. It removes the author from the loop for the routes that exist today, and it fixes the form in which
a new route must arrive: a name, a need signal computable from annotation, and nothing else; the acceptance test is common.

It does not invent routes. When every trial loses the marked rows, the tool says so and stops; the missing address is then a question for
the legend or a split of the world, which is the night cycle's job and a person's or an LLM's decision. And it does not make the
comparison with BERT fairer by itself: the frozen rows keep their decoder (`--decoder paper`), and the rows with the contract decoder are
reported as the exploratory set they are.

## 5. Record

- `tool/sop/activate.py`: `profile`, `need_signals`, `select`, `diagnostics`, `profile_markdown`; constants `BASE_CODES`, `CANDIDATE_CODES`,
  `CONTRACT`, `DECODERS`.
- `tool/sop/train.py`: `--decoder {contract,paper}` (default contract; the keys go into `config.json`), `--activate {off,auto}`,
  `--activate_eps`; `config.json` carries `decoder` and `activation`.
- `tool/sop/cli.py`: `sop profile <world> [--json]`.
- First run (reference world, CPU, seed 0, decoder contract): `tool/runs/activation_reference_28db081/`. Need signal 78.3%; base FULL 0.869 on 268 selection rows, with `vorder` 0.892 (seen transitions 0.526 -> 0.789 on 19 rows; unseen transitions one row of 60 lost, within tolerance): `vorder` accepted; 10 of 138 competing rows still misread with the accepted bundle (diagnostic). `activation_first_run_flat_eps.json` is the same trial under the flat eps = 0.01, which rejected the route on that one row; the tolerance was set to at least one row per split before the vorder trial was seen.
