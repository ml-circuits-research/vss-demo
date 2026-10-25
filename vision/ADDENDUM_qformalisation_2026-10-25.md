# Addendum: q-formalisation, what it covers, and the improvement loop from use

Date: 2026-10-25. Status: definition and assessment written; the client side of the loop built (app/src/gaps.js, Settings, About);
the training side an UNTESTED skeleton (training/gaps/); the first measurement PLANNED (training/TODO_DGX.md, section 2.7).

## 1. The term

The word "formalisation" is used in the community for the translation of a sentence into a formula of a target language fixed in advance
and complete for its domain: first-order logic, lambda calculus, SQL, AMR, code. The target language is given once; the task is the
translation; success is the right formula. What the VSS reader does is different, and the paper must say so on its first page rather than
borrow the word. We call it **q-formalisation** (question formalisation):

> A q-formalisation of a sentence s with respect to a legend L is the assignment, to each question of L (its roles, events and operators),
> of an answer taken from s or of "not given", each with a margin, together with a residual: the share of s that L does not explain.

Classical formalisation is the special case where L is a complete language, the residual is required to be zero and there are no margins.
In q-formalisation the legend is small, belongs to one world, and grows; incompleteness is a first-class state (an unplaced word, an
unsure role, a large residual), not an error; and the result is validated against the legend (`sop check`) and executed by a planner in
the world, not checked against a logic.

## 2. Is it enough? A fair assessment in three layers

**Layer 1, translated exactly into a symbolic layer.** Everything that reaches the wires: an event with its roles, negation, a condition,
a quantifier on a role, the discourse links of a circuit. Each is a function from wires to constraints over the world's signature
(components, attributes, relations); an SMT or Datalog solver checks consistency or finds a solution. The demo already does this for
geometry (the planner's constraints solved by Kiwi) and for locks (prohibitions checked before every plan). Claim: what reaches the wires
is formalised in the classical sense too, by a stated rule per wire type, and the rule is tested like code.

**Layer 2, not in the wires and not recovered by any solver.** Reference across sentences ("it", "that one": a rule, not a reading);
quantifier scope when quantifiers interact ("each box has an arrow": one arrow or one each); tense and aspect; degree and comparison
("larger than"); collective against distributive plurals; presuppositions and implicatures ("put the rest in the group too" presupposes a
group). A classical parser has an (incomplete) representation for each; we have a rule or nothing. The honest claim is therefore not "the
rest is solved symbolically" but: what reaches the wires is translated exactly; what does not is visible as residual or as a missing role,
and there the legend must grow. The advantage is that the gap is measured, not that it is absent.

**Layer 3, where the definition fits better than the classical one.** Commands and requests in a closed domain: assistants, editors,
control interfaces. A legend of twenty questions covers nearly everything, and the remaining 2% must be refused with an explanation, not
translated wrongly. For open questions about the world (free question answering, reasoning over text) q-formalisation is not enough and
the paper must not claim it is.

## 3. Consequences for the paper

Define the term on the first page; state that the comparison with text-to-SQL and semantic parsing is not on logical coverage but on
another axis: partial formalisation with margins over a given world, measured as coverage at a stated confident-wrong rate. Report the
residual and the abstention beside the accuracy on every table. Say what Layer 2 leaves out.

## 4. Evidence collected during use (the client side, BUILT)

Every reading already says where the legend fell short. The editor keeps, when the person allows it (Settings, "Help improve the
readers", on by default, local only), a journal of readings: the command as read, with every name the person typed replaced by a
placeholder; the frame, the minimum margin and the roles under tau; the residual; the unplaced words; the status; and what the person
did next: accepted, corrected by a click, reformulated within a minute (the strongest signal of a missing question), or marked with the
chip "this should have worked" and an optional note. The journal can be saved as a file or sent to an address the person enters, after
ticking a consent box; nothing leaves the device otherwise. The About panel explains what happens to a sent journal.

## 5. The improvement loop (the training side, UNTESTED skeleton)

One night, one world, five steps, each a script that runs alone (training/gaps/README.md):
1. **Aggregate** journals into a gaps report: unplaced words with their context, unsure roles by event, sentences not understood by their
   first content word, marked readings with notes, reformulation pairs; each group with its count, share and ten real examples.
2. **Propose**: a large model receives the legend, the SOP Lang rules and the report and answers with structured proposals: a new question
   (role) with ten annotated examples, new words for a kind, new formulations for the generator, a new event, or a new rule from wires to
   the symbolic layer with its tests. Each proposal is validated mechanically: ids, the ten examples, `sop check` on a temporary copy of
   the world with the proposal applied, rule tests in a sandbox. What fails is kept with its reason.
3. **Apply** to a copy of the world (the legend's hash changes), regenerate, train on the DGX with the same seeds as the shipped model.
4. **Accept** by a rule written before any run: no pre-existing row may fall by more than one seed std, and the gap rows (FULL on the
   proposals' sentences, the share of unplaced words on the report's examples) must improve. The second look of the train-world skill
   marks disagreements between the new model and the proposed annotations; a large disagreement blocks.
5. **A person decides** in the morning, from a report with the legend diff and the numbers before and after; shipping is a separate manual
   command (training/export_app.py). No model is ever edited directly: the loop changes the legend, the generator's data and the rules,
   all versioned, so every night is a commit and a row in STATUS with its label.

## 6. The first measurement, before trusting the loop

Plant three missing roles in a world (remove them from the legend and the generator; keep their sentences as a synthetic journal), run
the loop, and count the roles recovered and the false proposals. Criterion written now: at least two of three recovered, at most one
false proposal accepted by the mechanical checks per night. Then the same with real journals.

## 7. Requirement added the same day: nothing unknown is silent, nothing unknown is invented (query wires)

The limits of Layer 2 are a problem only if the reader hides them or fills them with a value. The requirement of q-formalisation is
therefore completed: every place where the reader does not know becomes an explicit **query wire**, and no slot ever carries a value
whose margin is under tau. A query wire has four fields: `about` (a role of a wire, an unplaced word, the whole sentence, or a relation
between two wires), `kind` (`undecided` with the candidates and their margins; `unplaced` with the word and its position; `unknown` with
the residual; `unsupported` when the question is in the text but not in the legend; `inferred` when the answer needs knowledge or
computation, not reading), `evidence` (candidates, margins, residual, neighbouring words) and `resolve` (who can answer: the person, the
planner from the state of the world, a dictionary, the symbolic layer, a large model). The main wire keeps the slot as a reference to the
query. Today's three signals (abstain with a top candidate, `_unplaced`, `no-sense`) become three kinds of the same wire; the cases of
Layer 2 become queries resolved by the planner (counting, geometric comparison), by the rule of 10.3 (reference), or by a person.

Evaluation gains the axis that matters: every decision is counted as correct, queried, or confidently wrong; the last is the
hallucination rate, defined identically for every model (for a tagger, a query is emitted from its threshold). Criteria, written now:
no value emitted under tau (all become queries); questions planted in a test world that the legend does not have reported as
`unsupported` in >= 0.90 of the cases; the hallucination rate reported for every model on every axis. Steps: the query wire in SOP Lang
and `sop check`; `formalize` and vss.js emit it (parity tested); the dialog and the planner consume it, with `_link.<role>=query:<who
answered>` in the circuit; a planted-questions world; the same form in vss-vs-bert as a declared row (never a change of the
pre-registered rows). Planned in training/TODO_DGX.md, section 2.8.

### 7.1 Scope of a query and queries over trees

A query is **local** when its answer is in the conversation (the circuit's earlier wires, the components the last request touched, the
selection) or **global** when it needs knowledge outside the conversation (the state of the world: counts, comparisons; a dictionary; a
knowledge base; a large model; the person). The wire carries `scope` and the resolution chain tried, in order (for "it": circuit, then
scene.lastTouched, then person), so that a pronoun resolved by a rule is written `_link.<role>=query:circuit` or `query:scene`, never a
bare value. A global answer carries its own margin; a global query with no answer is reported as such, not asked of the person as if it
were local. The `about` of a query may be a tree of the format's own operators (`&`, `|`, `~`, `and`, `not`, `if`, the quantifiers) whose
leaves are values or other queries; the planner resolves the local leaves, the symbolic layer (Datalog or SMT over the scene) evaluates
the tree with the global leaves, and what remains goes to the person with the partially evaluated tree visible. No `xor`: it is
`(a|b) & not(a&b)`, and an operator is added only when it occurs in text (the rule of the paper), not when it is convenient.
