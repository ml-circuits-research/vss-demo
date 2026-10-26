// examples.js: the example sentences offered by the paperclip next to the microphone (#btn-examples) and by the empty-canvas hint.
// One data file, so that it can be updated when the trained models land. Each entry: {group, text, note, world}.
//   group: the heading in the sheet. text: the sentence put into the input (never run on click). note: what it shows.
//   world: the installed world the sentence needs (a name in app/model/index.json), or null when no model is needed. An entry whose
//          world is not installed is hidden, and a group without entries is hidden with it.
//   hint:  true for the sentences shown in the empty-canvas hint.
// The group "Not understood (on purpose)" holds sentences the editor must refuse or ask about, never execute.
export const EXAMPLES = [
  { group: "Diagram", text: "add a database called orders in the top left", note: "creates a labelled shape in a region", world: "diagram", hint: true },
  { group: "Diagram", text: "put a yellow note below the database", note: "places a shape relative to another one", world: "diagram", hint: true },
  { group: "Diagram", text: "connect the note to the database with a dashed arrow", note: "draws a connector with a style", world: "diagram", hint: true },
  { group: "Diagram", text: "add a red box called payments in the top left", note: "colour, label and region in one sentence", world: "diagram" },
  { group: "Diagram", text: "make the database blue", note: "changes a property of an existing shape", world: "diagram" },
  { group: "Diagram", text: "move the note to the right of the database", note: "moves an existing shape", world: "diagram" },
  { group: "Diagram", text: "Add a database called orders in the top left. Then add a cache called sessions to the right of it.", note: "two commands in one input", world: "diagram" },
  { group: "Text", text: "add a note called Summary", note: "a shape that can hold text", world: "diagram" },
  { group: "Text", text: "start writing in Summary", note: "dictation into the shape", world: null },
  { group: "Text", text: "bold the last sentence", note: "a formatting command while writing", world: "textedit" },
  { group: "Formula", text: "start a formula", note: "opens a formula widget", world: null },
  { group: "Formula", text: "x plus one over two", note: "an ambiguous formula: two readings are offered", world: null },
  { group: "Formula", text: "replace x with y", note: "an edit of the formula", world: "matheditor" },
  { group: "Animation", text: "the red box moves to the right in two seconds", note: "adds a unit to the timeline", world: "animation" },
  { group: "Animation", text: "play", note: "a command to the film", world: "animation" },
  { group: "Romanian", text: "pune o notiță galbenă sub baza de date", note: "read by a Romanian route", world: "diagram_ro" },
  { group: "Romanian", text: "adaugă o cutie roșie numită plăți în stânga sus", note: "colour, label and region in Romanian", world: "diagram_ro" },
  { group: "Not understood (on purpose)", text: "rotate the box 45 degrees", note: "no such event: refused, with what the editor can do", world: "diagram" },
  { group: "Not understood (on purpose)", text: "how many boxes are there?", note: "a question the editor does not answer: refused", world: "diagram" },
  { group: "Not understood (on purpose)", text: "make it more professional", note: "no role to fill: refused or asked, never guessed", world: "diagram" },
];

/** the entries to offer: those whose world is installed (`installed(name) -> boolean`), grouped in order of first appearance */
export function availableExamples(installed, list = EXAMPLES) {
  const groups = new Map();
  for (const e of list) {
    if (e.world && !installed(e.world)) continue;
    if (!groups.has(e.group)) groups.set(e.group, []);
    groups.get(e.group).push(e);
  }
  return [...groups].map(([group, items]) => ({ group, items }));
}

/** the sentences of the empty-canvas hint */
export const hintExamples = (installed, list = EXAMPLES) => list.filter((e) => e.hint && (!e.world || installed(e.world)));

// The Requests tab's own examples (a few requests per installed world; the tab has its own paperclip). Same fields as EXAMPLES. These are
// the editor's own worlds as placeholders; the SNIPS request worlds replace them when they are exported (responses D9, D10).
export const REQUEST_EXAMPLES = [
  { group: "Diagram world", text: "add a database called orders in the top left", note: "a request the diagram world reads", world: "diagram" },
  { group: "Diagram world", text: "put a yellow note below the database", note: "a placement relative to another shape", world: "diagram" },
  { group: "Diagram world", text: "make the database blue", note: "a property change", world: "diagram" },
  { group: "Text editing world", text: "bold the last sentence", note: "a formatting request", world: "textedit" },
  { group: "Formula world", text: "replace x with y", note: "an edit of a formula", world: "matheditor" },
  { group: "Animation world", text: "the red box moves to the right in two seconds", note: "a unit of the timeline", world: "animation" },
  { group: "Animation world", text: "play", note: "a command to the film", world: "animation" },
  { group: "Romanian diagram world", text: "pune o noti\u021b\u0103 galben\u0103 sub baza de date", note: "read by the Romanian world", world: "diagram_ro" },
  { group: "Outside every world", text: "what is the weather in Paris tomorrow", note: "no world should explain it: a refusal with the residuals", world: null },
];
