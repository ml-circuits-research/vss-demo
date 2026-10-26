// queries.mjs: queries.js on hand-made readings (query wires in the D8 encoding, and today's signals) and the dialog's use of them.
// Usage: node app/tests/queries.mjs
import { queriesOf, resolveChain, linkLine } from "../src/queries.js";
import { decide, dropWord } from "../src/dialog.js";
import { Wire } from "../src/vss/soplang.js";
let pass = 0, fail = 0; const bad = [];
const check = (n, c, d) => { if (c) pass++; else { fail++; bad.push(`${n}: ${d}`); } };
const qw = (id, f) => { const w = new Wire(id, "query"); for (const [k, v] of Object.entries(f)) w.set(k, v); return w; };
const R = (o) => Object.assign({ status: "ok", frame: { event: "move", roles: { object: ["entity", "box", null, "the"] } }, margins: { object: 0.3, structure: 0.2 },
  residual: 0.1, tokens: ["move", "the", "box"], unplaced: [], undecided: {}, wires: [] }, o);
const okPlan = { steps: [{ op: "move", explain: "move the box" }], questions: [], blocked: [], resolutions: [] };

// signals -> kinds (addendum 7: today's three signals are three kinds of the same wire)
const s1 = queriesOf(R({ undecided: { object: ["box", "cache"] }, unplaced: ["cache", "quickly", "."] }));
check("undecided from _undecided", s1.some((q) => q.kind === "undecided" && q.role === "object" && q.evidence.join() === "box,cache"), JSON.stringify(s1));
check("unplaced from _unplaced, not the undecided word nor punctuation", s1.filter((q) => q.kind === "unplaced").map((q) => q.about).join() === "quickly", JSON.stringify(s1));
const s2 = queriesOf(R({ status: "no-sense", unplaced: ["frobnicate", "?"], residual: 1 }));
check("unknown from no-sense", s2.length === 1 && s2[0].kind === "unknown" && s2[0].about === "sentence" && s2[0].evidence.join() === "frobnicate", JSON.stringify(s2));
// query wires (D8 fields)
const w1 = qw("w9", { about: "sentence", kind: "unsupported", evidence: "how,many", resolve: "planner,person", scope: "local" });
const s3 = queriesOf(R({ wires: [w1] }));
check("wire fields", s3.length === 1 && s3[0].source === "wire" && s3[0].kind === "unsupported" && s3[0].resolve.join() === "planner,person" && s3[0].evidence.join() === "how,many", JSON.stringify(s3));
const w2 = qw("w4", { about: "45,degrees", kind: "unsupported", evidence: "45,degrees", resolve: "person", scope: "local" });
const s4 = queriesOf(R({ wires: [w2], unplaced: ["45", "degrees"] }));
check("unplaced words covered by a wire query are not repeated", s4.length === 1, JSON.stringify(s4));
check("unknown kind in a wire -> unknown", queriesOf(R({ wires: [qw("w1", { about: "x", kind: "guess" })] }))[0].kind === "unknown", "");
// presence queries (D14): `_presence_query.<role>` -> an undecided query with presence: true
const pqs = queriesOf(R({ presenceQueries: { color: 0.02 } }));
check("presence query mapped", pqs.length === 1 && pqs[0].about === "$top.color" && pqs[0].role === "color" && pqs[0].kind === "undecided" && pqs[0].presence === true && pqs[0].evidence.length === 0 && pqs[0].resolve.join() === "person" && pqs[0].scope === "local" && pqs[0].source === "signal", JSON.stringify(pqs));
check("presence query beside an adjacency one", queriesOf(R({ undecided: { object: ["box", "cache"] }, presenceQueries: { color: 0.02 } })).length === 2, "");
const dp = decide({ result: R({ presenceQueries: { color: 0.02 } }), plan: okPlan });
check("dialog: presence query keeps execute", dp.action === "execute" && dp.questions[0]?.kind === "presence" && dp.queries.some((q) => q.presence), JSON.stringify(dp));
// resolution chain
const c1 = resolveChain({ resolve: ["circuit", "scene", "person"] }, { circuit: () => null, scene: () => ["c3"] });
check("chain: first resolver that answers", c1.by === "scene" && c1.answer[0] === "c3" && c1.tried.join() === "circuit: no answer", JSON.stringify(c1));
const c2 = resolveChain({ resolve: ["kb", "llm", "person"] }, {});
check("chain: kb / llm not in the editor, then the person", c2.by === "person" && c2.ask && c2.tried.length === 2 && /not available/.test(c2.tried[0]), JSON.stringify(c2));
check("chain: nobody", resolveChain({ resolve: ["planner"] }, {}).by === null, "");
check("link line", linkLine("landmark", "circuit") === "_link.landmark=query:circuit", "");
// the dialog
const d1 = decide({ result: R({ wires: [w1] }), plan: okPlan, legend: { events: [{ id: "move" }] } });
check("unsupported sentence refused with its evidence", d1.action === "refuse" && /how many/.test(d1.line) && /I can: move/.test(d1.line) && d1.queries.length === 1, JSON.stringify(d1));
const d2 = decide({ result: R({ wires: [w2] }), plan: okPlan });
check("unsupported phrase in a command: ask before the rest", d2.action === "ask" && d2.questions[0].kind === "unsupported" && d2.questions[0].words.join(" ") === "45 degrees", JSON.stringify(d2));
check("answer yes drops the phrase", ["45", "degrees"].reduce((t, w) => dropWord(t, w), "move the box 45 degrees") === "move the box", "");
const d3 = decide({ result: R({ unplaced: ["quickly"] }), plan: okPlan });
check("unplaced word: executed with a note", d3.action === "execute" && d3.notes.some((n) => n.kind === "unplaced" && /quickly/.test(n.text)), JSON.stringify(d3));
// an offer (D27): the reader proposes an unplaced word for the empty role of the event -> ask, with yes / no
const off = R({ frame: { event: "name", roles: { object: ["entity", "client", null, "the"] } }, presenceQueries: { text: 0.01 }, offers: { text: "irina" }, unplaced: [] });
const qo = queriesOf(off);
check("offer: a presence query carrying the word", qo.some((q) => q.presence && q.offer === "irina" && q.evidence[0] === "irina"), JSON.stringify(qo));
const dof = decide({ result: off, plan: okPlan });
check("offer: asked before executing, yes / no", dof.action === "ask" && dof.questions[0].kind === "offer" && dof.questions[0].word === "irina" && /irina/.test(dof.line) && dof.questions[0].candidates.join() === "yes,no", JSON.stringify(dof));
console.log(`queries: ${pass} checks passed, ${fail} failed`); if (fail) { console.log(bad.join("\n")); process.exit(1); }
