// dialog.mjs: the rules of Table 8 (spec 11), the clearest-reading rule (12.3 / 13.3) and the form level's basic behaviour, on hand-made
// reader results. Usage: node app/tests/dialog.mjs
import { decide } from "../src/dialog.js";
import { chooseClearest } from "../src/speech.js";
import { createFormIndex } from "../src/form.js";
let pass = 0, fail = 0; const bad = [];
const check = (n, c, d) => { if (c) pass++; else { fail++; bad.push(`${n}: ${d}`); } };
const R = (o) => Object.assign({ status: "ok", frame: { event: "create", roles: { object: ["entity", "box", null, "a"] } }, margins: { object: 0.3, structure: 0.2 }, residual: 0.2, tokens: ["add", "a", "box"], unplaced: [] }, o);
const okPlan = { steps: [{ op: "create", explain: "create a medium box" }], questions: [], blocked: [], resolutions: [] };
check("execute", decide({ result: R(), plan: okPlan }).action === "execute", "");
const ab = decide({ result: R({ status: "abstain", margins: { object: 0.3, color: 0.01 }, candidates: { color: ["red", "orange"] } }), plan: okPlan });
check("ask role", ab.action === "ask" && ab.questions[0].role === "color" && /red or orange/.test(ab.line), ab.line);
const pr = decide({ result: R({ frame: { event: "create", roles: { object: ["entity", "box", null, "a"], color: ["word", "red"] } }, margins: { object: 0.3, "color.presence": 0.01 } }), plan: okPlan });
check("ask presence of a role read as present", pr.action === "ask" && /did you mean/.test(pr.line), pr.line);
const pa = decide({ result: R({ margins: { object: 0.3, "color.presence": 0.01 } }), plan: okPlan });
check("absent role near threshold: default and a note", pa.action === "execute" && pa.notes.some((n) => n.kind === "presence" && n.role === "color"), JSON.stringify(pa));
const ns = decide({ result: R({ status: "no-sense", unplaced: ["frobnicate"] }), legend: { events: [{ id: "create" }] } });
check("refuse no-sense", ns.action === "refuse" && ns.questions[0].kind === "unknown-word" && /I can: create/.test(ns.line), ns.line);
const amb = decide({ result: R(), plan: { ...okPlan, steps: [], questions: [{ kind: "which", text: "which circle?", candidates: ["c1", "c2"] }] } });
check("ask which", amb.action === "ask" && amb.line === "which circle?", amb.line);
const lk = decide({ result: R(), plan: { ...okPlan, steps: [], blocked: [{ text: "locked: never move the title" }] } });
check("blocked", lk.action === "refuse" && /locked/.test(lk.line), lk.line);
const cl = chooseClearest([{ input: "a", result: R({ status: "abstain" }) }, { input: "b", result: R({ margins: { object: 0.1 } }) }, { input: "c", result: R({ margins: { object: 0.4 } }) }]);
check("clearest", cl.best.input === "c" && cl.ranked[2].input === "a", cl.reason);
const f = createFormIndex({ words: ["database", "diamond", "decision", "red", "rectangle", "connect"], D: 512 });
check("form typo", f.candidates("dtabase")[0]?.word === "database", JSON.stringify(f.candidates("dtabase")));
check("form swap", f.candidates("conncet")[0]?.word === "connect", JSON.stringify(f.candidates("conncet")));
check("form unrelated", f.candidates("zzzzqqq").length === 0, JSON.stringify(f.candidates("zzzzqqq")));
check("form determinism", JSON.stringify(createFormIndex({ words: ["red"], D: 64 }).encode("red").re.slice(0, 4)) === JSON.stringify(createFormIndex({ words: ["red"], D: 64 }).encode("red").re.slice(0, 4)), "");
console.log(`dialog: ${pass} checks passed, ${fail} failed`); if (fail) { console.log(bad.join("\n")); process.exit(1); }
