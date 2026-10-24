// text_targets.mjs: the "text target resolution" suite of spec Table 13 (scripted documents and commands with the expected text after;
// criterion 100% pass), for app/src/text/ (doc.js, commands.js). Frames are written in the reader's format (src/vss.js) for the textedit
// world, so the suite tests resolution and execution independently of the reader; every scripted command also gives its surface sentence,
// and the suite checks that the textedit normalizer (textnorm.js, the table of training/worlds/textedit/normalize.json) turns it into
// tokens that contain every role filler and the verb, so the frames are the ones a reader of the normalized sentence would emit.
// Usage: node app/tests/text_targets.mjs
import fs from "node:fs";
import { TextDoc } from "../src/text/doc.js";
import { plan, execute, findMatches, selectWidget } from "../src/text/commands.js";
import { createTextNormalizer } from "../src/text/textnorm.js";

const T = JSON.parse(fs.readFileSync(new URL("../../training/worlds/textedit/normalize.json", import.meta.url)));
const normalize = createTextNormalizer(T);
const W = (w) => ["word", w];
let pass = 0, fail = 0; const failures = [];
function check(name, cond, detail = "") { if (cond) pass++; else { fail++; failures.push(`${name}: ${detail}`); } }

// one scripted case: doc (TextDoc.fromText source), optional setup(doc), the surface command, the frame (event, lemma, roles as tokens),
// and the expectation: after (outline), question (kind), read, selection (text), cursor (offset), pending (destructive, unconfirmed)
function run(c) {
  const doc = typeof c.doc === "string" ? TextDoc.fromText(c.doc) : c.doc;
  if (c.setup) c.setup(doc);
  const n = normalize(c.say); const roles = {}; for (const [k, v] of Object.entries(c.roles || {})) roles[k] = W(v);
  const missing = Object.values(c.roles || {}).filter((v) => !n.tokens.includes(v)).concat(c.lemma && !n.tokens.includes(c.lemma) ? [c.lemma] : []);
  check(`${c.name} [normalizer]`, !missing.length, `"${c.say}" -> ${n.tokens.join(" ")}; missing ${missing.join(", ")}`);
  const frame = { event: c.event, lemma: c.lemma || null, roles, neg: false };
  const before = doc.toOutline(); const undoBefore = doc.undoStack.length;
  const p = plan(doc, frame, n.info, { normalize, choose: c.choose ?? null });
  if (c.question) {
    check(`${c.name} [question]`, p.questions.some((q) => q.kind === c.question), JSON.stringify(p.questions));
    const r = execute(doc, p, { confirmed: true });
    check(`${c.name} [unchanged]`, !r.applied && doc.toOutline() === before, doc.toOutline());
    if (c.candidates) check(`${c.name} [candidates]`, JSON.stringify((p.questions[0].candidates || []).map((x) => x.text)) === JSON.stringify(c.candidates), JSON.stringify(p.questions[0].candidates));
    return { doc, p };
  }
  check(`${c.name} [no question]`, !p.questions.length, JSON.stringify(p.questions));
  if (p.destructive) {
    const r0 = execute(doc, p);
    check(`${c.name} [shown before applied]`, !r0.applied && r0.pending && doc.toOutline() === before && p.resolution && p.resolution.ranges.length > 0, JSON.stringify(r0));
  }
  const r = execute(doc, p, { confirmed: true });
  if (c.after !== undefined) check(`${c.name} [after]`, doc.toOutline() === c.after, `got ${JSON.stringify(doc.toOutline())} want ${JSON.stringify(c.after)}`);
  if (c.read !== undefined) check(`${c.name} [read]`, r.read === c.read, `got ${JSON.stringify(r.read)}`);
  if (c.selection !== undefined) { const s = doc.selectionRange(); check(`${c.name} [selection]`, doc.slice(s.from, s.to) === c.selection, `got ${JSON.stringify(doc.slice(s.from, s.to))}`); }
  if (c.cursor !== undefined) check(`${c.name} [cursor]`, doc.cursor === c.cursor && !doc.hasSelection(), `got ${doc.cursor}`);
  const changed = doc.toOutline() !== before;
  if (changed && !["undo", "redo"].includes(c.event)) {
    check(`${c.name} [one transaction]`, doc.undoStack.length === undoBefore + 1, `${doc.undoStack.length - undoBefore} entries`);
    doc.undo(); check(`${c.name} [undo restores]`, doc.toOutline() === before, doc.toOutline()); doc.redo();
    if (c.after !== undefined) check(`${c.name} [redo]`, doc.toOutline() === c.after, doc.toOutline());
  }
  if (c.rule) check(`${c.name} [rule]`, p.explain.join(" ").includes(c.rule), p.explain.join(" | "));
  return { doc, p, r };
}

const S2 = "One two three. Four five six.";
const LIST = "Intro\nmilk\neggs\nbread";
const P3 = "First paragraph here.\n\nSecond one, in the middle.\n\nThird and last.";
const cases = [
  // ---- units and ordinals (counted from the start, from the end, from the cursor)
  { name: "bold the last sentence", doc: S2, say: "bold the last sentence", event: "format", lemma: "embolden", roles: { unit: "sentence", ordinal: "last" }, after: "One two three. **Four five six.**", rule: "counted from the end" },
  { name: "delete the previous word (cursor at end)", doc: S2, say: "delete the previous word", event: "delete", roles: { unit: "word", ordinal: "previous" }, after: "One two three. Four five." },
  { name: "capitalise the second word", doc: "the quick brown fox", say: "capitalise the second word", event: "capitalise", lemma: "capitalise", roles: { unit: "word", ordinal: "second" }, after: "the Quick brown fox" },
  { name: "capitalise the first three words", doc: "the quick brown fox", say: "capitalize the first three words", event: "capitalise", lemma: "capitalise", roles: { unit: "words", ordinal: "first_3" }, after: "The Quick Brown fox" },
  { name: "uppercase the last word", doc: S2, say: "uppercase the last word", event: "capitalise", lemma: "uppercase", roles: { unit: "word", ordinal: "last" }, after: "One two three. Four five SIX." },
  { name: "turn the last three lines into a numbered list", doc: LIST, say: "turn the last three lines into a numbered list", event: "format", lemma: "turn", roles: { unit: "lines", ordinal: "last_3", format: "numbered_list" }, after: "Intro\n1. milk\n2. eggs\n3. bread" },
  { name: "make the first line a heading", doc: LIST, say: "make the first line a heading", event: "format", lemma: "make", roles: { unit: "line", ordinal: "first", format: "heading" }, after: "# Intro\nmilk\neggs\nbread" },
  { name: "bullet the last two lines", doc: LIST, say: "bullet the last two lines", event: "make_list", lemma: "bullet", roles: { unit: "lines", ordinal: "last_2" }, after: "Intro\nmilk\n- eggs\n- bread" },
  { name: "delete the next word (cursor inside a word)", doc: "alpha beta gamma delta", setup: (d) => d.setCursor(7), say: "delete the next word", event: "delete", roles: { unit: "word", ordinal: "next" }, after: "alpha beta delta" },
  { name: "select this paragraph", doc: P3, setup: (d) => d.setCursor(30), say: "select this paragraph", event: "select", lemma: "select", roles: { unit: "paragraph", ordinal: "this" }, selection: "Second one, in the middle." },
  { name: "select that sentence (that -> this)", doc: S2, setup: (d) => d.setCursor(3), say: "select that sentence", event: "select", lemma: "select", roles: { unit: "sentence", ordinal: "this" }, selection: "One two three." },
  { name: "underline the first two words", doc: "The quick brown fox", say: "underline the first two words", event: "format", lemma: "underline", roles: { unit: "words", ordinal: "first_2" }, after: "__The quick__ brown fox" },
  { name: "read back the second sentence", doc: S2, say: "read back the second sentence", event: "read_back", lemma: "read", roles: { unit: "sentence", ordinal: "second" }, read: "Four five six." },
  { name: "go to the end of the first paragraph", doc: P3, setup: (d) => d.setCursor(0), say: "go to the end of the first paragraph", event: "move_cursor", lemma: "go", roles: { position: "at_end", unit: "paragraph", ordinal: "first" }, cursor: 21 },
  { name: "go to the end", doc: P3, setup: (d) => d.setCursor(0), say: "go to the end", event: "move_cursor", lemma: "go", roles: { position: "at_end" }, cursor: 64 },
  { name: "jump to the next paragraph", doc: P3, setup: (d) => d.setCursor(2), say: "jump to the next paragraph", event: "move_cursor", lemma: "jump", roles: { unit: "paragraph", ordinal: "next" }, cursor: 22 },
  { name: "delete the second paragraph", doc: P3, say: "delete the second paragraph", event: "delete", lemma: "delete", roles: { unit: "paragraph", ordinal: "second" }, after: "First paragraph here.\n\nThird and last." },
  { name: "delete the third character", doc: "abcdef", say: "delete the third character", event: "delete", lemma: "delete", roles: { unit: "character", ordinal: "third" }, after: "abdef" },
  { name: "delete the fifth word (not there)", doc: "one two three", say: "delete the fifth word", event: "delete", lemma: "delete", roles: { unit: "word", ordinal: "fifth" }, question: "no-match" },
  { name: "delete the last list item", doc: "Shopping\n\n- milk\n- eggs", say: "delete the last list item", event: "delete", lemma: "delete", roles: { unit: "list_item", ordinal: "last" }, after: "Shopping\n\n- milk" },
  // ---- pronoun units
  { name: "delete it (the last dictated words)", doc: "Revenue grew.", setup: (d) => d.insertText(d.length, " Costs fell."), say: "delete it", event: "delete", lemma: "delete", roles: { unit: "it" }, after: "Revenue grew." },
  { name: "scratch that", doc: "Revenue grew.", setup: (d) => d.insertText(d.length, " Oops wrong"), say: "scratch that", event: "delete", lemma: "delete", roles: { unit: "that" }, after: "Revenue grew." },
  { name: "make the selection red", doc: "Revenue grew fast.", setup: (d) => d.setSelection(8, 12), say: "make the selection red", event: "format", lemma: "make", roles: { unit: "selection", value: "red" }, after: "Revenue {red|grew} fast." },
  { name: "make everything italic", doc: "Hello there.", say: "make everything italic", event: "format", lemma: "make", roles: { unit: "everything", format: "italic" }, after: "*Hello there.*" },
  { name: "capitalise that (nothing selected, nothing changed)", doc: "abc", say: "capitalise that", event: "capitalise", lemma: "capitalise", roles: { unit: "that" }, question: "no-match" },
  { name: "make the selection bold (empty selection)", doc: "abc", say: "make the selection bold", event: "format", lemma: "make", roles: { unit: "selection", format: "bold" }, question: "no-match" },
  // ---- matches: exact, normalizer, phonetic; several; none
  { name: "make revenue red (exact)", doc: "Revenue grew.", say: "make revenue red", event: "format", lemma: "make", roles: { match: "revenue", value: "red" }, after: "{red|Revenue} grew.", rule: "found exactly" },
  { name: "bold the word revenue (two hits: a question)", doc: "Revenue grew. Costs and revenue fell.", say: "bold the word revenue", event: "format", lemma: "embolden", roles: { unit: "word", match: "revenue" }, question: "which", candidates: ["Revenue", "revenue"] },
  { name: "bold the word revenue (candidate 2 chosen)", doc: "Revenue grew. Costs and revenue fell.", say: "bold the word revenue", event: "format", lemma: "embolden", roles: { unit: "word", match: "revenue" }, choose: 1, after: "Revenue grew. Costs and **revenue** fell." },
  { name: "replace twenty with thirty (normalizer: twenty = 20)", doc: "Sales grew by twenty percent.", say: "replace twenty with thirty", event: "replace", lemma: "replace", roles: { match: "20", new_text: "30" }, after: "Sales grew by 30 percent.", rule: "through the normalizer" },
  { name: "replace 25 with 30 (normalizer, two words)", doc: "We had twenty five guests.", say: "replace 25 with 30", event: "replace", lemma: "replace", roles: { match: "25", new_text: "30" }, after: "We had 30 guests." },
  { name: "replace 20 with 30 (exact digits)", doc: "Sales grew by 20 percent.", say: "replace 20 with 30", event: "replace", lemma: "replace", roles: { match: "20", new_text: "30" }, after: "Sales grew by 30 percent." },
  { name: "replace john with jane (phonetic: Jon)", doc: "We met Jon yesterday.", say: "replace john with jane", event: "replace", lemma: "replace", roles: { match: "john", new_text: "jane" }, after: "We met Jane yesterday.", rule: "phonetic key" },
  { name: "replace their with there (exact first)", doc: "Their team is there.", say: "replace their with there", event: "replace", lemma: "replace", roles: { match: "their", new_text: "there" }, after: "There team is there." },
  { name: "change kate to anna (phonetic: Cate)", doc: "Cate will call.", say: "change kate to anna", event: "replace", lemma: "change", roles: { match: "kate", new_text: "anna" }, after: "Anna will call." },
  { name: "delete the word zebra (no match)", doc: "a b c", say: "delete the word zebra", event: "delete", lemma: "delete", roles: { unit: "word", match: "zebra" }, question: "no-match" },
  { name: "make \"next quarter\" bold (quoted piece)", doc: "Plans for next quarter are ready.", say: "make \"next quarter\" bold", event: "format", lemma: "make", roles: { match: "next_quarter", format: "bold" }, after: "Plans for **next quarter** are ready." },
  { name: "highlight revenue in yellow", doc: "Revenue grew.", say: "highlight revenue in yellow", event: "format", lemma: "highlight", roles: { match: "revenue", value: "yellow" }, after: "{hl:yellow|Revenue} grew." },
  { name: "highlight the word costs (default colour)", doc: "Costs fell.", say: "highlight the word costs", event: "format", lemma: "highlight", roles: { unit: "word", match: "costs" }, after: "{hl:yellow|Costs} fell." },
  { name: "replace all (choose all), one transaction", doc: "Red cat, red hat.", say: "replace red with blue", event: "replace", lemma: "replace", roles: { match: "red", new_text: "blue" }, choose: "all", after: "Blue cat, blue hat." },
  // ---- positions and ranges
  { name: "select from Q3 to the end", doc: "Plan for Q3 is ready.", say: "select from Q3 to the end", event: "select", lemma: "select", roles: { match: "q3", position: "at_end" }, selection: "Q3 is ready." },
  { name: "select from the start to plan", doc: "The plan is ready.", say: "select from the start to plan", event: "select", lemma: "select", roles: { match: "plan", position: "at_start" }, selection: "The plan" },
  { name: "delete everything after ready", doc: "It is ready now and later.", say: "delete everything after ready", event: "delete", lemma: "delete", roles: { unit: "everything", position: "after", match: "ready" }, after: "It is ready" },
  { name: "delete everything before ready", doc: "So, it is ready.", say: "delete everything before ready", event: "delete", lemma: "delete", roles: { unit: "everything", position: "before", match: "ready" }, after: "ready." },
  { name: "insert profit after revenue", doc: "Revenue grew.", say: "insert profit after revenue", event: "insert", lemma: "insert", roles: { new_text: "profit", position: "after", match: "revenue" }, after: "Revenue profit grew." },
  { name: "insert very before good", doc: "A good year.", say: "insert very before good", event: "insert", lemma: "insert", roles: { new_text: "very", position: "before", match: "good" }, after: "A very good year." },
  { name: "put a full stop at the end", doc: "Revenue grew", say: "put a full stop at the end", event: "insert", lemma: "put", roles: { new_text: "full_stop", position: "at_end" }, after: "Revenue grew." },
  { name: "add a comma after revenue", doc: "Revenue grew.", say: "add a comma after revenue", event: "insert", lemma: "add", roles: { new_text: "comma", position: "after", match: "revenue" }, after: "Revenue, grew." },
  { name: "put a comma before but", doc: "It grew but slowly.", say: "put a comma before but", event: "insert", lemma: "put", roles: { new_text: "comma", position: "before", match: "but" }, after: "It grew, but slowly." },
  { name: "add today at the end of the first line", doc: "Plan\nNext", say: "add today at the end of the first line", event: "insert", lemma: "add", roles: { new_text: "today", position: "at_end", unit: "line", ordinal: "first" }, after: "Plan today\nNext" },
  { name: "insert hello at the start", doc: "Revenue grew.", say: "insert hello at the start", event: "insert", lemma: "insert", roles: { new_text: "hello", position: "at_start" }, after: "hello Revenue grew." },
  { name: "put a new paragraph at the end", doc: "One.", say: "put a new paragraph at the end", event: "insert", lemma: "put", roles: { new_text: "new_paragraph", position: "at_end" }, after: "One.\n\n" },
  { name: "add a new line after one", doc: "one two", say: "add a new line after one", event: "insert", lemma: "add", roles: { new_text: "new_line", position: "after", match: "one" }, after: "one\ntwo" },
  { name: "move the cursor before ready", doc: "It is ready.", say: "move the cursor before ready", event: "move_cursor", lemma: "move", roles: { position: "before", match: "ready" }, cursor: 6 },
  // ---- formats, unformat, blocks, alignment, sizes
  { name: "unbold the first line (italic kept)", doc: "Title here\nbody", setup: (d) => { d.addMark(0, 10, "bold"); d.addMark(0, 5, "italic"); }, say: "unbold the first line", event: "unformat", lemma: "unformat", roles: { format: "bold", unit: "line", ordinal: "first" }, after: "*Title* here\nbody" },
  { name: "remove the formatting from everything", doc: "abc def", setup: (d) => { d.addMark(0, 3, "bold"); d.addMark(4, 7, "color", "red"); }, say: "remove the formatting from everything", event: "unformat", lemma: "unformat", roles: { unit: "everything" }, after: "abc def" },
  { name: "align the last paragraph center", doc: P3, say: "align the last paragraph center", event: "align", lemma: "align", roles: { unit: "paragraph", ordinal: "last", value: "center" }, after: "First paragraph here.\n\nSecond one, in the middle.\n\nThird and last. [center]" },
  { name: "centre the first line", doc: "Title\nbody", say: "center the first line", event: "align", lemma: "centre", roles: { unit: "line", ordinal: "first" }, after: "Title [center]\nbody" },
  { name: "justify it (selection)", doc: "Long text here.", setup: (d) => d.setSelection(0, 4), say: "justify it", event: "align", lemma: "justify", roles: { unit: "it" }, after: "Long text here. [justified]" },
  { name: "promote the second line to heading two", doc: "Doc\nPart one\nbody", say: "promote the second line to heading two", event: "make_heading", lemma: "promote", roles: { unit: "line", ordinal: "second", format: "heading_two" }, after: "Doc\n## Part one\nbody" },
  { name: "demote the first line (heading 1 -> 2)", doc: "# Doc\n\nbody", say: "demote the first line", event: "make_heading", lemma: "demote", roles: { unit: "line", ordinal: "first" }, after: "## Doc\n\nbody" },
  { name: "promote the last line (paragraph -> heading 1)", doc: "a\nb", say: "promote the last line", event: "make_heading", lemma: "promote", roles: { unit: "line", ordinal: "last" }, after: "a\n# b" },
  { name: "make the first line bigger", doc: "Title\nbody", say: "make the first line bigger", event: "format", lemma: "make", roles: { unit: "line", ordinal: "first", value: "bigger" }, after: "{size:large|Title}\nbody" },
  { name: "make the last word huge", doc: "a big word", say: "make the last word huge", event: "format", lemma: "make", roles: { unit: "word", ordinal: "last", value: "huge" }, after: "a big {size:huge|word}" },
  { name: "make this line plain text", doc: "## Heading\nbody", setup: (d) => { d.addMark(0, 7, "bold"); d.setCursor(2); }, say: "make this line plain text", event: "format", lemma: "make", roles: { unit: "line", ordinal: "this", format: "plain" }, after: "Heading\nbody" },
  { name: "strike through the word very", doc: "It is very good.", say: "strike through the word very", event: "format", lemma: "strike", roles: { unit: "word", match: "very" }, after: "It is ~~very~~ good." },
  { name: "format the first paragraph as a bullet list", doc: P3, say: "format the first paragraph as a bullet list", event: "format", lemma: "format", roles: { unit: "paragraph", ordinal: "first", format: "bullet_list" }, after: "- First paragraph here.\n\nSecond one, in the middle.\n\nThird and last." },
  { name: "number the last three lines", doc: LIST, say: "number the last three lines", event: "make_list", lemma: "number", roles: { unit: "lines", ordinal: "last_3" }, after: "Intro\n1. milk\n2. eggs\n3. bread" },
  { name: "make it (no format named)", doc: "abc", setup: (d) => d.setSelection(0, 3), say: "make it", event: "format", lemma: "make", roles: { unit: "it" }, question: "missing" },
  { name: "replace the last word with gamma", doc: "alpha beta", say: "replace the last word with gamma", event: "replace", lemma: "replace", roles: { unit: "word", ordinal: "last", new_text: "gamma" }, after: "alpha gamma" },
];

for (const c of cases) run(c);

{ // undo / redo as commands, after a format command: each command one entry
  const doc = TextDoc.fromText(S2); const n = (s) => normalize(s);
  const p1 = plan(doc, { event: "format", lemma: "embolden", roles: { unit: W("sentence"), ordinal: W("first") } }, n("bold the first sentence").info, { normalize }); execute(doc, p1);
  const p2 = plan(doc, { event: "format", lemma: "make", roles: { unit: W("word"), ordinal: W("last"), value: W("red") } }, n("make the last word red").info, { normalize }); execute(doc, p2);
  const afterTwo = doc.toOutline();
  execute(doc, plan(doc, { event: "undo", lemma: "undo", roles: {} }, {}, {}));
  check("undo command: one command undone", doc.toOutline() === "**One two three.** Four five six.", doc.toOutline());
  execute(doc, plan(doc, { event: "redo", lemma: "redo", roles: {} }, {}, {}));
  check("redo command", doc.toOutline() === afterTwo, doc.toOutline());
  execute(doc, plan(doc, { event: "undo", roles: {} })); execute(doc, plan(doc, { event: "undo", roles: {} }));
  const r = execute(doc, plan(doc, { event: "undo", roles: {} }));
  check("undo with nothing left is reported", !r.applied && /nothing to undo/.test(r.reason), JSON.stringify(r));
}
{ // destructive change: resolution shown first, nothing applied without confirmation
  const doc = TextDoc.fromText("Keep this. Drop this."); const p = plan(doc, { event: "delete", roles: { unit: W("sentence"), ordinal: W("last") } }, {}, { normalize });
  const r = execute(doc, p);
  check("destructive: pending until confirmed", !r.applied && r.pending && /Drop this\./.test(r.reason) && doc.text() === "Keep this. Drop this.", JSON.stringify(r));
  check("destructive: resolution carries the range", p.resolution.ranges[0] && doc.slice(p.resolution.ranges[0].from, p.resolution.ranges[0].to) === "Drop this.", JSON.stringify(p.resolution));
}
{ // match stages directly
  const doc = TextDoc.fromText("We met Jon on twenty five May.");
  check("findMatches exact", findMatches(doc, "jon", normalize).stage === "exact");
  check("findMatches normalizer", findMatches(doc, "25", normalize).stage === "normalizer" && findMatches(doc, "25", normalize).hits[0].text === "twenty five");
  check("findMatches phonetic", findMatches(doc, "john", normalize).stage === "phonetic");
  check("findMatches none", findMatches(doc, "zebra", normalize).hits.length === 0);
}
{ // serialisation: JSON round trip and HTML
  const doc = TextDoc.fromText("# Plan\n\nRevenue grew.\n\n- one\n- two\n\n1. first");
  doc.addMark(5, 12, "bold"); doc.addMark(13, 17, "color", "red"); doc.setBlocks(5, 5, { align: "center" });
  const j = JSON.parse(JSON.stringify(doc.toJSON())); const back = TextDoc.fromJSON(j);
  check("JSON round trip", back.toOutline() === doc.toOutline() && JSON.stringify(back.toJSON()) === JSON.stringify(doc.toJSON()), back.toOutline());
  const html = doc.toHTML();
  check("HTML", html === '<h1>Plan</h1><p style="text-align:center"><strong>Revenue</strong> <span style="color:red">grew</span>.</p><ul><li>one</li><li class="vss-line">two</li></ul><ol><li>first</li></ol>', html);
  check("HTML escapes", TextDoc.fromText("a < b & c").toHTML() === "<p>a &lt; b &amp; c</p>");
}
{ // which widget (Table 9 'widget')
  const ws = [{ id: "c1", label: "Summary" }, { id: "c2", label: "Ideas" }];
  check("widget by label", selectWidget(ws, { roles: { widget: W("summary") } }).id === "c1");
  check("widget not there", selectWidget(ws, { roles: { widget: W("agenda") } }).status === "none");
  check("widget current", selectWidget(ws, { roles: {} }, { current: "c2" }).id === "c2");
  check("widget ambiguous", selectWidget(ws, { roles: {} }).status === "ambiguous");
}

const total = pass + fail;
console.log(`text target resolution: ${pass}/${total} checks pass (${cases.length} scripted commands)${fail ? "" : " - 100%"}`);
if (fail) { for (const f of failures) console.log("  FAIL " + f); process.exit(1); }
