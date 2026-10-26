// entries.mjs: the DOM-free parts of the tabs (src/ui/entries.js) and the examples file (src/examples.js).
// Usage: node app/tests/entries.mjs
import { callText, intentOf, minMargin, historyExtras, historyRow, behaviourOf, readingRecord, assistantLines, formatTime, sourceIcon } from "../src/ui/entries.js";
import { EXAMPLES, availableExamples, hintExamples } from "../src/examples.js";
let pass = 0, fail = 0; const bad = [];
const check = (n, c, d = "") => { if (c) pass++; else { fail++; bad.push(`${n}: ${d}`); } };

const frame = { event: "create", roles: { object: ["entity", "box", ["word", "red"], "a"], text: ["word", "payments"], region: ["word", "top_left"] } };
check("call text", callText(frame) === 'create(object="red box", text="payments", region="top_left")', callText(frame));
check("call text: prohibition", callText({ event: "delete", neg: true, roles: { object: ["entity", "box", null, "the"] } }) === 'not delete(object="box")');
check("call text: negated attribute", callText({ event: "create", roles: { object: ["entity", "box", ["negword", "red"], null] } }) === 'create(object="not red box")');
check("call text: no frame", callText(null) === "" && callText({}) === "");
check("call text: empty roles", callText({ event: "undo", roles: {} }) === "undo()");
check("intent", intentOf("diagram", frame) === "diagram.create" && intentOf("diagram", null) === "");

const result = { status: "ok", frame, margins: { object: 0.3, "text.presence": 0.12, region: 0.2, color: 0.001, structure: 0.05 }, residual: 0.21 };
check("min margin: filled roles only", minMargin(result) === 0.12, String(minMargin(result)));
check("min margin: structure when no role", minMargin({ frame: { event: "undo", roles: {} }, margins: { structure: 0.4 } }) === 0.4);
check("min margin: none", minMargin(null) === null && minMargin({}) === null);
const ex = historyExtras(result, "diagram");
check("history extras", ex.world === "diagram" && ex.frame === frame && ex.minMargin === 0.12 && ex.residual === 0.21 && Object.keys(historyExtras(null)).length === 0);

check("time", /^\d\d:\d\d:\d\d$/.test(formatTime(Date.now())) && formatTime(null) === "");
check("source icon", sourceIcon("speech")[1] === "voice" && sourceIcon("zzz")[0] === "?");
const row = historyRow({ input: "add a red box", used: "add a red box .", source: "typed", status: "ok", action: "execute", world: "diagram", frame, minMargin: 0.12, residual: 0.21, time: 0 });
check("history row", row.rereadable && row.read === "add a red box ." && row.world === "diagram" && /^create: object red box, text payments/.test(row.event) && row.minMargin === 0.12, JSON.stringify(row));
check("history row: a manual entry is not re-readable", !historyRow({ input: "(move) x", source: "pointer", line: "move" }).rereadable);

check("behaviour", behaviourOf({ action: "execute", notes: [] }) === "executed" && behaviourOf({ action: "ask" }) === "asked" && behaviourOf({ action: "refuse" }) === "refused"
  && behaviourOf({ action: "execute", notes: [{ kind: "presence" }] }) === "defaulted" && behaviourOf(null) === "");
const last = { kind: "diagram", input: "add a red box called payments", best: { result, route: { world: "diagram" } }, plan: { steps: [{ op: "create", explain: "create a red box" }] },
  decision: { action: "execute", rule: "Table 8: status ok, every margin above tau", line: "create a red box", notes: [], queries: [{ kind: "unplaced", about: "please" }], questions: [] } };
const rec = readingRecord(last, { time: 5 });
check("record", rec.behaviour === "executed" && rec.rule.startsWith("Table 8") && rec.steps[0] === "create a red box" && rec.queries[0].kind === "unplaced" && rec.world === "diagram" && rec.status === "ok", JSON.stringify(rec));
const al = assistantLines(rec);
check("assistant line", al.length === 1 && al[0].intent === "diagram.create" && al[0].call.startsWith("create(object=") && al[0].outcome === "executed", JSON.stringify(al));
const asked = readingRecord({ ...last, decision: { action: "ask", rule: "Table 8: a margin under tau = 0.05", line: "which colour?", questions: [{ text: "which colour, red or orange?" }], notes: [] } });
check("assistant: asked", /^asked: which colour, red or orange\?/.test(assistantLines(asked)[0].outcome) && asked.behaviour === "asked");
const refused = readingRecord({ kind: "diagram", input: "rotate the box", best: { result: { status: "no-sense", frame: { event: null, roles: {} } } }, decision: { action: "refuse", line: "I can't do that", rule: "r", notes: [] } });
check("assistant: refused, no call", assistantLines(refused)[0].call === "" && /^refused/.test(assistantLines(refused)[0].outcome) && assistantLines(refused)[0].intent === "");
check("record: other kinds are skipped", readingRecord({ kind: "text" }) === null && readingRecord(null) === null);
const long = readingRecord({ kind: "long", input: "a. b.", line: "Read 2 units", ex: {}, units: [{ text: "a", reading: { frame, status: "ok" }, mark: "executed" }, { text: "b", reading: { frame, status: "ok" }, mark: "skipped" }] }, { world: "diagram" });
check("long record", long.status === "2 units" && assistantLines(long).length === 2 && long.behaviour === "executed" && long.steps.length === 2);

// the examples file
const names = new Set(["diagram", "diagram_ro"]);
const groups = availableExamples((n) => names.has(n));
check("examples: groups of installed worlds", groups.map((g) => g.group).join("|") === "Diagram|Text|Formula|Romanian|Not understood (on purpose)", groups.map((g) => g.group).join("|"));
check("examples: an entry of a missing world is hidden", !groups.flatMap((g) => g.items).some((e) => e.world === "textedit" || e.world === "matheditor" || e.world === "animation"));
check("examples: no world installed leaves only the model-free entries", availableExamples(() => false).flatMap((g) => g.items).every((e) => e.world === null));
check("examples: a group needing an absent world disappears", !availableExamples((n) => n !== "diagram_ro").some((g) => g.group === "Romanian"));
check("examples: not-understood group", EXAMPLES.some((e) => e.group === "Not understood (on purpose)" && e.text === "rotate the box 45 degrees") && EXAMPLES.some((e) => e.text === "how many boxes are there?"));
check("examples: every entry complete", EXAMPLES.every((e) => e.group && e.text && e.note && "world" in e));
check("examples: the three hint sentences", hintExamples(() => true).map((e) => e.text).join("|") === "add a database called orders in the top left|put a yellow note below the database|connect the note to the database with a dashed arrow");

console.log(`entries: ${pass} checks passed, ${fail} failed`); if (fail) { console.log(bad.join("\n")); process.exit(1); }
