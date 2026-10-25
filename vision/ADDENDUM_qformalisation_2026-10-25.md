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

## 8. Related work the term must be anchored in, and what remains ours

Question-based formalisation is not new as a form: QA-SRL (He, Lewis, Zettlemoyer 2015) annotates semantic roles as natural questions
and answers; MRC-style extraction (Li et al. 2020 for named entities; zero-shot slot filling as question answering) feeds a question as
text to a pretrained encoder and returns a span of the sentence or NULL; NLI-as-classification turns intents into entailment checks; and
the practice of strict neuro-symbolic decoupling (the model fills a dictionary of answers, deterministic code validates types, invariants
and the execution tree), of explicit NULL training for refusal, of standardised question templates and of stateful partial slot filling is
established engineering. q-formalisation sits in this line and must cite it. What it adds, and what the comparison with a BERT-MRC
baseline (vss-vs-bert, responses R24) has to show rather than assert: one state read through every question of the legend in a single
pass, against one encoder pass per question (the cost grows with the legend for MRC, not for the reader); margins between competing
candidates in the same space and a residual over the whole sentence, against a NULL classifier; determinism and a model of a few
megabytes; and a legend that grows from use (section 5), where MRC changes the questions it asks but not what it was trained to answer.
Span anchoring removes invented values, not wrong choices; the hallucination rate of section 7 counts both and is the measure to report
for every model.

## 9. Correction of the same day: the residual measured length, not what was left unexplained (BUILT, parity tested, not yet measured)

The comparison with BERT (vss-vs-bert, R17 (i) on the reader) showed that a threshold on the residual set at 2 % false rejection on the
calibration rows also rejected every depth-3 sentence and every new formulation with an unseen transition, sentences the reader decodes
correctly. The reason is the residual's definition, visible from calibration numbers alone: it compared the reader's state S with the
COMPILER's state of the decoded frame (the role addresses only), while S also carries every token's deposit through the routes (path,
chain, bigram), which the compiler never writes. The residual was therefore 0.43 on the training distribution itself (a floor: the share of the state the reconstruction never
contains) and rose above that floor with the NOVELTY of the form (depth 3: 0.72; new formulations with unseen transitions: 0.90; random
word order: 0.99), not with the number of tokens: the calibration check of vss-vs-bert (R43; Spearman with the token count −0.15 on seed
0, no rise with depth within the training distribution) refuted the first reading, "it measures length", written in R41. It is a detector
of an unfamiliar form, which is why it cannot separate "new but in the world" from "out of the world"; kept as that signal.

The corrected measure, the **explained-tokens residual** (tool/sop/infer.py residual_explained, app/src/vss/reader.js residualExplained,
switched on by `residual: "explained"` in the model's config; the default stays the paper's definition so that every earlier parity
test is unchanged): rec' is the reader's OWN chart of the explained tokens, i.e. the fillers of the decoded roles, the speakers, the event
lemma, and every token whose kind is not a content kind (cue words, openers, punctuation); residual' = ||S_n - a rec'_n||. When every
token is explained rec' = S and the residual is 0 by construction; a content word in no role, or a word of the kind `unknown`,
contributes its share of the state (one of sixteen tokens: 0.26; two of four: 0.63 on the reference smoke model). It is deterministic,
needs no training, changes no accuracy or status, and is the quantity the query wire of kind `unknown` (section 7) should carry.

Criterion, written before the measurement (vss-vs-bert R41, claim on the fresh splits of R39): AUROC in-world vs out-of-world of the
explained residual above the compiled residual's, and the 2 % false-rejection table with depth-3 and unseen-transition sentences no
longer rejected wholesale. The old residual stays in every table beside the new one. The demo's shipped worlds switch to the explained
residual only after that measurement (training/TODO_DGX.md 2.10).

## 10. Correction of the same day: 'undecided' by adjacency (BUILT, parity tested, shipped in the demo's worlds)

The planted sets of vss-vs-bert showed that the reader reports an identity no question asks for as a query in 0.98 of the sentences, but
flags 'undecided' (two identities of the same class side by side, "p3 p5 gives o1 to p2") in only 0.51: the second identity sits at an
address the role's readout touches with little interference, so the margin does not see a tie, and the identity is reported as
unplaced instead. The query was never silent, but it had the wrong kind, and a person asked "what is p5?" instead of "p3 or p5?".
Rule (tool/sop/infer.py undecided_adjacent, app/src/vss/reader.js undecidedAdjacent; config `undecided_adjacent: true`, on in every
world the demo ships, off in the paper's decoder): an identity left in no role, next to the filler of a role whose kinds admit it, turns
that role into an 'undecided' query with both as candidates (`_undecided.<role>="p3|p5"`), the role's margin becomes 0 and the reading
abstains; the dialog asks which. It is what a person does, it changes no accuracy, and the claim of its effect is measured in
vss-vs-bert on the fresh seeds (R54).

## 11. The demo's decoder after the comparison (BUILT, parity tested, shipped; measured in vss-vs-bert on the fresh seeds 5-9)

Three decoder-level changes, none of which retrains a model, now ship in every world of the demo (training/export_app.py sets them;
the tool's default stays the paper's decoder so that every earlier parity test and the paper's rows are unchanged):
- `candidates: "sentence"`: a role's filler is a word OF THE SENTENCE whose kind the role admits (the extractive assumption every
  tagger and MRC baseline carries by construction), with the one-to-one rule (a word fills at most one role; a role left without a
  candidate is 'not given'). Measured: new formulations with unseen transitions 0.835 -> 0.973 on the basic world (vss-vs-bert R46, seeds
  5-9), depth-3 exact match 0.998 at coverage 0.999. The decision provenance (by the address, by restriction, by elimination) is what the
  comparison reports, so that nobody reads the gain as "the reader learned the forms"; the address-level fix is the verb-order route (12).
- `residual: "explained"` (section 9): with the sentence-candidates frames it separates in- from out-of-world at AUROC 0.979 and rejects
  random / other-world / unknown-word sentences at 0.99 / 0.93 / 1.00 with 2.6 % false rejection (from 44 %).
- `undecided_adjacent: true` (section 10): 'undecided' queries 0.51 -> 0.999.
The diagram worlds' own numbers for these three (Table 13 rows, the planted-questions world) are the measurement of training/TODO_DGX.md
2.10 / 2.11, still to run on the DGX; the defaults are on now because the basic-world evidence is on fresh seeds and the changes cannot
lower an in-world row by construction (the gold is always in the sentence).

## 12. The verb-order route (BUILT, under measurement)

The diagnosis of the comparison's design set (vss-vs-bert R46 / R47) found the core of the reader's errors on new formulations at the
address level: a filler in a position the routes never encoded for its role (the recipient right after the verb without 'to'; the agent
after a cleft 'that') lands at an empty or another role's address, because the three routes compose a filler's address from the cue
chain. The route added (`vorder` in reader.codes; experiment/v8_gates.V8.set_vorder, tool/sop/infer.py Routebook.vorder_index,
app/src/vss/routebook.js) draws every non-verb word a second time at a learned displacement keyed by the side of the nearest verb, that
verb's kind, the word's kind and its ordinal among the words of its kind since that verb, independent of the cues: "gives p4 o3" and
"gives o3 to p4" put p4 and o3 at the same verb-order addresses. It needs retraining; it runs in vss-vs-bert as its own declared row
(R56) with the per-cell provenance table, and enters the demo's generators only if the in-world rows do not fall and the cells are
decided by the address.
