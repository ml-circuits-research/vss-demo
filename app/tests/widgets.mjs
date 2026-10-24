// widgets.mjs: the DOM-free rules that tie widgets, scripts and films to the editor (src/widgets.js, animate/export.js importTimeline,
// dialog.js animationIntent). node app/tests/widgets.mjs
import fs from "node:fs";
import { formulaPhrase, findTextWidget, textHeight, looksLikeScript, textCapable } from "../src/widgets.js";
import { createScene } from "../src/editor/scene.js";
import * as ops from "../src/editor/ops.js";
import { TextDoc } from "../src/text/doc.js";
import { importTimeline, exportJSON } from "../src/animate/export.js";
import { animationIntent } from "../src/dialog.js";
let pass = 0, fail = 0; const check = (n, ok, d = "") => { if (ok) pass++; else { fail++; console.log("FAIL", n, d); } };

check("formula start", formulaPhrase("start a formula")?.type === "start");
check("formula start with content", formulaPhrase("Start a formula x squared plus one")?.rest === "x squared plus one");
check("formula end", formulaPhrase("end formula")?.type === "end" && formulaPhrase("done")?.type === "end");
check("not a formula phrase", formulaPhrase("add a box") === null);

const s = createScene();
const a = ops.create(s, { word: "note", kind: "note", label: "Summary" }, { x: 0, y: 0, w: 150, h: 60 });
const b = ops.create(s, { word: "card", kind: "note", label: "Risks and issues" }, { x: 200, y: 0, w: 150, h: 60 });
const c = ops.create(s, { word: "database", kind: "data", label: "Orders" }, { x: 400, y: 0, w: 150, h: 60 });
check("text capable", textCapable(s.components.get(a)) && !textCapable(s.components.get(c)));
check("by label", findTextWidget(s, { name: "summary" }).id === a);
check("by the start of a label", findTextWidget(s, { name: "risks" }).id === b);
check("not a text widget", findTextWidget(s, { name: "orders" }).id === null && /not a text widget/.test(findTextWidget(s, { name: "orders" }).rule));
check("by head", findTextWidget(s, { head: "card" }).id === b);
check("none named: several", findTextWidget(s, {}).id === null);
s.selection = [a]; check("the selection", findTextWidget(s, {}).id === a);
check("the current widget first", findTextWidget(s, {}, { current: b }).id === b);

const d = TextDoc.fromText("# Title\n\n" + "word ".repeat(80).trim());
check("text height grows", textHeight(d, 200) > textHeight(TextDoc.fromText("short"), 200) && textHeight(TextDoc.fromText("x"), 200) >= 60);

check("script: heading", looksLikeScript("# A\nadd a box").script);
check("script: paragraphs", looksLikeScript("add a box.\n\nadd a circle.").script);
check("not a script", !looksLikeScript("add a box. connect it to the database.").script);

check("intent question", animationIntent({ event: "travel", mood: "question" }).intent === "question");
check("intent film", animationIntent({ event: "play" }).intent === "film");
check("intent correction", animationIntent({ event: "travel" }, ["actually", "slower"]).intent === "correction");
check("intent unit", animationIntent({ event: "travel" }, ["the", "dot"]).intent === "unit");

const ex = JSON.parse(fs.readFileSync(new URL("../examples/request-film.json", import.meta.url), "utf8"));
const r = importTimeline(ex);
check("example film imports", r.timeline.units.length === 7 && r.report.every((x) => x.kind === "unit") && r.sceneFromFile, JSON.stringify(r.report));
const r2 = importTimeline(JSON.stringify(exportJSON(r.timeline)));
check("timeline round trip", r2.timeline.end === r.timeline.end && r2.timeline.units.length === r.timeline.units.length);
const r3 = importTimeline({ steps: ex.units.map((u) => ({ frame: u.frame, info: u.info, text: u.text })) }, { scene: r.timeline.scene });
check("steps on a given scene", r3.timeline.end === r.timeline.end && !r3.sceneFromFile);
let threw = null; try { importTimeline("{}"); } catch (e) { threw = e.message; } check("not a timeline file", /not a timeline file/.test(threw || ""));
console.log(`widgets: ${fail ? "FAIL" : "PASS"} ${pass}/${pass + fail} checks`); process.exit(fail ? 1 : 0);
