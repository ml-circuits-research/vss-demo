// dictation.mjs: command mode and dictation mode (spec 14.2) and the command-or-content decision (spec 14.3) of app/src/text/dictation.js,
// with a FAKE textedit reader (a table from normalized utterance to reading), so that the decisions are tested before a model is trained;
// the same code runs with src/vss.js and the exported textedit model. Also: the JavaScript textedit normalizer against the Python one
// (training/worlds/textedit/normalize_golden.jsonl, our own generated commands), and dictation followed by a command end to end.
// Usage: node app/tests/dictation.mjs
import fs from "node:fs";
import { TextDoc } from "../src/text/doc.js";
import { createDictation, decide, minMargin } from "../src/text/dictation.js";
import { createTextNormalizer } from "../src/text/textnorm.js";
import { plan, execute } from "../src/text/commands.js";

const T = JSON.parse(fs.readFileSync(new URL("../../training/worlds/textedit/normalize.json", import.meta.url)));
const normalize = createTextNormalizer(T);
let pass = 0, fail = 0; const failures = [];
function check(name, cond, detail = "") { if (cond) pass++; else { fail++; failures.push(`${name}: ${detail}`); } }
const W = (w) => ["word", w];

// the fake reader: normalized text -> reading; anything else reads as no-sense (as dictated prose mostly does)
function fakeReader(table) {
  const seen = [];
  return { seen, read(text) { seen.push(text); return table[text.replace(/ [.?!]$/, "")] || { status: "no-sense", margins: {}, frame: { event: null, roles: {} } }; } };
}
const ok = (m, frame) => ({ status: "ok", margins: { structure: 0.9, event: 0.8, unit: m }, frame });
const CAL = { threshold: 0.3, chip_band: 0.05 };

{ // 1. mode switching: start / stop phrases, click and Escape
  const d = createDictation({ reader: fakeReader({}), table: T.dictation, normalize, calibration: CAL });
  check("starts in command mode", d.mode === "command");
  check("command mode passes commands on", d.handle("bold the last word").type === "pass" && d.mode === "command");
  check("'done' in command mode is not a stop", d.handle("done").type === "pass");
  let a = d.handle("Start writing in Summary.");
  check("start phrase with a widget name", a.type === "start" && a.widget.name === "summary" && d.mode === "dictation", JSON.stringify(a));
  a = d.handle("stop writing"); check("stop phrase", a.type === "stop" && d.mode === "command", JSON.stringify(a));
  a = d.handle("please write in the note"); check("start phrase with a widget head", a.type === "start" && a.widget.head === "note" && a.widget.name === null, JSON.stringify(a));
  a = d.handle("Done."); check("'done' stops dictation", a.type === "stop" && d.mode === "command");
  a = d.handle("start writing in the summary note"); check("name and head", a.widget.name === "summary" && a.widget.head === "note", JSON.stringify(a));
  a = d.handle("start writing in ideas"); check("start phrase inside dictation moves the widget", a.type === "start" && d.widget.name === "ideas" && d.mode === "dictation");
  d.stop(); check("Escape key stops", d.mode === "command");
  d.start({ id: "c3" }); check("click starts", d.mode === "dictation" && d.widget.id === "c3");
  check("'done' inside a sentence is content", d.handle("the work is done").type === "insert");
}

{ // 2. spoken punctuation and layout, the escape word, capitals and spaces
  const d = createDictation({ reader: fakeReader({}), table: T.dictation, normalize, calibration: CAL }); d.start();
  const doc = new TextDoc();
  const say = (u) => { const a = d.handle(u); check(`"${u}" is content`, a.type === "insert", JSON.stringify(a)); d.insert(doc, a.pieces); return a; };
  say("hello comma world full stop");
  check("comma and full stop attach; first word capitalised", doc.toOutline() === "Hello, world.", JSON.stringify(doc.toOutline()));
  say("this is the second sentence question mark");
  check("capital after a full stop; question mark", doc.toOutline() === "Hello, world. This is the second sentence?", JSON.stringify(doc.toOutline()));
  const a = d.handle("new paragraph"); check("layout only: not read", a.type === "insert" && /not read/.test(a.reason)); d.insert(doc, a.pieces);
  say("open quote yes close quote she said");
  check("new paragraph, quotes", doc.toOutline() === "Hello, world. This is the second sentence?\n\n“Yes” she said", JSON.stringify(doc.toOutline()));
  say("literally comma is a word");
  check("literally writes the next word", doc.toOutline().endsWith("she said comma is a word"), JSON.stringify(doc.toOutline()));
  say("new line next point colon done");
  check("new line, colon; 'done' inside an utterance is content", doc.toOutline().endsWith("is a word\nNext point: done"), JSON.stringify(doc.toOutline()));
  say("bullet first item"); say("bullet second item");
  check("bullet layout", doc.toOutline().endsWith("Next point: done\n- First item\n- Second item"), JSON.stringify(doc.toOutline()));
  const t = d.transcribe("Already punctuated, by the recogniser.");
  check("the recogniser's punctuation is kept", t.pieces.map((p) => p.text).join("|") === "Already|punctuated|,|by|the|recogniser|.", JSON.stringify(t.pieces));
  const doc2 = TextDoc.fromText("Old text"); doc2.setSelection(4, 8); d.insert(doc2, d.transcribe("words").pieces);
  check("dictation replaces the selection", doc2.text() === "Old words", doc2.text());
  const before = doc.undoStack.length; d.insert(doc, d.transcribe("one two three").pieces);
  check("one utterance = one transaction", doc.undoStack.length === before + 1);
}

{ // 3. threshold decisions (fake reader)
  const frame = { event: "format", lemma: "embolden", roles: { unit: W("word"), ordinal: W("last") } };
  const R = fakeReader({
    "embolden the last word": ok(0.42, frame),
    "make the first line a heading": ok(0.27, { event: "format", lemma: "make", roles: {} }),
    "delete the previous word": ok(0.2, { event: "delete", roles: {} }),
    "capitalise that": { status: "abstain", margins: { unit: 0.28 }, frame: { event: "capitalise", roles: {} } },
    "replace this with that": { status: "abstain", margins: { unit: 0.1 }, frame: { event: "replace", roles: {} } },
    "jump around": { status: "unknown-event", margins: {}, frame: { event: null, roles: {} } },
  });
  const d = createDictation({ reader: R, table: T.dictation, normalize, calibration: CAL }); d.start();
  let a = d.handle("Bold the last word.");
  check("reader reads the NORMALIZED utterance", R.seen[R.seen.length - 1] === "embolden the last word .", R.seen[R.seen.length - 1]);
  check("ok and every margin >= threshold: command", a.type === "command" && a.frame === frame && Math.abs(a.m - 0.42) < 1e-12, JSON.stringify(a));
  a = d.handle("make the first line a heading"); check("ok, just under the threshold: text with chip", a.type === "insert" && a.chip && /close to the command threshold/.test(a.reason), JSON.stringify(a));
  a = d.handle("delete the previous word"); check("ok, well under the threshold: text, no chip", a.type === "insert" && !a.chip, JSON.stringify(a));
  a = d.handle("capitalise that"); check("abstain near the threshold: chip", a.type === "insert" && a.chip);
  a = d.handle("replace this with that"); check("abstain far: text", a.type === "insert" && !a.chip);
  a = d.handle("jump around"); check("unknown-event: text", a.type === "insert" && !a.chip);
  a = d.handle("we should make the first quarter bold in our plans"); check("prose (no-sense): text", a.type === "insert" && !a.chip);
  check("boundary: m == threshold is a command", decide({ status: "ok", margins: { a: 0.3 } }, CAL).decision === "command");
  check("boundary: m == threshold - band is a chip", decide({ status: "ok", margins: { a: 0.25 } }, CAL).decision === "chip");
  check("boundary: below the band is text", decide({ status: "ok", margins: { a: 0.2499 } }, CAL).decision === "text");
  check("no calibration: an ok reading is never executed, chip only", decide({ status: "ok", margins: { a: 0.9 } }, null).decision === "chip");
  check("min margin over every margin", minMargin({ margins: { structure: 0.5, "unit.presence": 0.07, unit: 0.3 } }) === 0.07);
  check("escape word: content without reading", (() => { const n = R.seen.length; const x = d.handle("literally bold the last word"); return x.type === "insert" && R.seen.length === n; })());
  const d0 = createDictation({ reader: null, table: T.dictation, normalize, calibration: CAL }); d0.start();
  check("no reader loaded: content", d0.handle("bold the last word").type === "insert");
}

{ // 4. the chip: inserted as text; tapping it takes the words back out and gives the command
  const fr = { event: "format", lemma: "make", roles: { unit: W("line"), ordinal: W("first"), format: W("heading") } };
  const d = createDictation({ reader: fakeReader({ "make the first line a heading": ok(0.27, fr) }), table: T.dictation, normalize, calibration: CAL }); d.start();
  const doc = TextDoc.fromText("Summary"); const a = d.handle("make the first line a heading"); d.insert(doc, a.pieces, a.chip);
  check("chip: the words are inserted", doc.text() === "Summary make the first line a heading", doc.text());
  const c = d.applyChip(doc, a.chip);
  check("chip tapped: insertion undone, command returned", c.type === "command" && c.undone && doc.text() === "Summary" && c.frame === fr, JSON.stringify(c));
  const p = plan(doc, c.frame, c.info, { normalize }); execute(doc, p);
  check("chip tapped: the command runs", doc.toOutline() === "# Summary", doc.toOutline());
  const doc2 = TextDoc.fromText("x"); const a2 = d.handle("make the first line a heading"); d.insert(doc2, a2.pieces, a2.chip); doc2.insertText(doc2.length, " more");
  const c2 = d.applyChip(doc2, a2.chip);
  check("chip after a later change: words stay", !c2.undone && doc2.text().includes("heading more"), JSON.stringify(c2));
}

{ // 5. end to end: start, dictate, a command inside dictation, a prose sentence with editing words, stop
  const R = fakeReader({ "embolden the word revenue": ok(0.5, { event: "format", lemma: "embolden", roles: { unit: W("word"), match: W("revenue") } }),
    "replace 20 with 30": ok(0.45, { event: "replace", lemma: "replace", roles: { match: W("20"), new_text: W("30") } }) });
  const d = createDictation({ reader: R, table: T.dictation, normalize, calibration: CAL });
  const doc = new TextDoc(); const log = [];
  for (const u of ["start writing in summary", "revenue grew by twenty percent full stop", "bold the word revenue", "we should make the first quarter bold in our plans",
    "replace twenty with thirty", "stop writing"]) {
    const a = d.handle(u); log.push(a.type);
    if (a.type === "insert") d.insert(doc, a.pieces, a.chip);
    if (a.type === "command") { const p = plan(doc, a.frame, a.info, { normalize }); execute(doc, p, { confirmed: true }); }
  }
  check("end to end: actions", log.join(",") === "start,insert,command,insert,command,stop", log.join(","));
  check("end to end: text", doc.toOutline() === "**Revenue** grew by 30 percent. We should make the first quarter bold in our plans", JSON.stringify(doc.toOutline()));
}

{ // 6. JavaScript normalizer = Python normalizer on the golden file
  const p = new URL("../../training/worlds/textedit/normalize_golden.jsonl", import.meta.url);
  const lines = fs.readFileSync(p, "utf8").split("\n").filter(Boolean); let same = 0; const bad = [];
  for (const l of lines) {
    const g = JSON.parse(l); const r = normalize(g.surface);
    if (JSON.stringify(r.tokens) === JSON.stringify(g.tokens) && JSON.stringify(r.info) === JSON.stringify(g.info)) same++; else if (bad.length < 3) bad.push({ s: g.surface, py: g.tokens, js: r.tokens });
  }
  check(`normalizer parity ${same}/${lines.length}`, same === lines.length && lines.length > 100, JSON.stringify(bad));
}

const total = pass + fail;
console.log(`dictation: ${pass}/${total} checks pass${fail ? "" : " - 100%"}`);
if (fail) { for (const f of failures) console.log("  FAIL " + f); process.exit(1); }
