// widgets.js: the rules that tie the text and formula widgets (spec 14, 16) and long scripts (spec 18) to the diagram, DOM-free. main.js
// calls them and shows their reasons; every rule is stated here.
//
//   formulaPhrase(text)            "start a formula [x squared]" / "end formula": {type: "start", rest} | {type: "end"} | null
//   textCapable(c)                 a component that holds rich text: kind note (note, comment, textbox, card) or one that already has text
//   findTextWidget(scene, ref, {current})   ref = dictation's {name, head}: the widget to write in, with the rule used, or {id: null, rule}
//   textHeight(doc, width)         the height a text widget needs for its content (the widget grows with it, spec 14.1)
//   looksLikeScript(text)          a pasted text that opens the document view (spec 18) rather than the input bar
import { labelKey } from "./editor/resolver.js";
import { sameWord, singular } from "./editor/scene.js";
import { textWidth } from "./editor/ops.js";

const canon = (s) => String(s).toLowerCase().replace(/[.,!?;:]+(?=\s|$)/g, "").replace(/\s+/g, " ").trim();

// spec 16.4: "start a formula" opens a formula widget in dictation, "end formula" closes it. Longest phrase first.
export const FORMULA_START = ["start a new formula", "start a formula", "add a new formula", "add a formula", "insert a formula", "write a formula",
  "new formula", "start formula", "formula mode", "add an equation", "start an equation", "new equation"];
export const FORMULA_END = ["end formula", "end the formula", "end of formula", "stop formula", "close formula", "close the formula", "end equation",
  "stop writing", "done", "i am done", "im done", "command mode"];

export function formulaPhrase(text) {
  const c = canon(text);
  if (FORMULA_END.includes(c)) return { type: "end", reason: `"${c}": the formula widget closes, back to command mode` };
  for (const p of [...FORMULA_START].sort((a, b) => b.length - a.length)) {
    if (c === p || c.startsWith(p + " ")) {
      const rest = String(text).trim().split(/\s+/).slice(p.split(" ").length).join(" ").replace(/^(called|named)\s+\S+\s*/i, "");
      return { type: "start", rest: rest || null, reason: `"${p}": a formula widget is added and opened for dictation` };
    }
  }
  return null;
}

const TEXT_WORDS = ["note", "comment", "textbox", "card"];
export function textCapable(c) { return !!c && (c.text != null || c.kind === "note" || TEXT_WORDS.includes(c.word)); }

/** the widget named by a dictation start phrase. Rules in order: a name matches a label (exactly, then as the label's first words);
 *  a head word alone ("write in the note") matches the selection if it is that kind, else the most recent widget of that word; no name and
 *  no head: the current widget, else the selected one, else the last touched, else the only one. */
export function findTextWidget(scene, ref = {}, { current = null } = {}) {
  const all = [...scene.components.values()].filter(textCapable).sort((a, b) => a.order - b.order);
  const name = ref && ref.name ? labelKey(ref.name) : null; const head = ref && ref.head ? singular(ref.head) : null;
  if (name) {
    const exact = all.filter((c) => labelKey(c.label) === name);
    if (exact.length === 1) return { id: exact[0].id, rule: `the widget labelled "${exact[0].label}"` };
    if (exact.length > 1) return { id: exact[exact.length - 1].id, rule: `several widgets are labelled "${ref.name}": the most recent one` };
    const start = all.filter((c) => c.label && labelKey(c.label).startsWith(name + "_"));
    if (start.length === 1) return { id: start[0].id, rule: `the widget whose label starts with "${ref.name}"` };
    const any = [...scene.components.values()].find((c) => labelKey(c.label) === name);
    if (any) return { id: null, rule: `"${any.label}" is a ${any.word}, not a text widget (a note, a text box or a card holds text)` };
    return { id: null, rule: `there is no text widget called "${ref.name}"` };
  }
  const pick = (c, rule) => ({ id: c.id, rule });
  if (head && !["widget", "text", "box"].includes(head)) {
    const of = all.filter((c) => sameWord(c.word, head));
    const sel = of.find((c) => scene.selection.includes(c.id)); if (sel) return pick(sel, `the selected ${head}`);
    if (of.length) return pick(of[of.length - 1], of.length > 1 ? `the most recent ${head} (${of.length} in the diagram)` : `the only ${head}`);
    return { id: null, rule: `there is no ${head} in the diagram` };
  }
  if (current && scene.components.has(current)) return { id: current, rule: "the widget written in last" };
  const sel = all.find((c) => scene.selection.includes(c.id)); if (sel) return pick(sel, "the selected widget");
  const last = all.filter((c) => scene.lastTouched.includes(c.id)); if (last.length) return pick(last[last.length - 1], "the widget touched by the last request");
  if (all.length === 1) return pick(all[0], "the only text widget");
  return { id: null, rule: all.length ? `there are ${all.length} text widgets: say which ("start writing in Summary")` : "there is no text widget yet: add a note first" };
}

const SIZE_K = { small: 0.82, normal: 1, large: 1.25, huge: 1.6 };
/** height (px, scene units) for a text document in a widget of the given width: wrapped lines by the editor's width metric, at the
 *  view's 14 px base, headings larger; never less than minH */
export function textHeight(doc, width, { minH = 60, pad = 14, base = 14, lineH = 1.35 } = {}) {
  const inner = Math.max(40, width - 2 * pad); let h = pad;
  for (const b of doc.blocks) {
    const k = b.type === "heading" ? [1.45, 1.25, 1.1][(b.level || 1) - 1] : (b.marks || []).reduce((mx, m) => Math.max(mx, SIZE_K[m && m.size] || 1), 1);
    const fs = base * k; const indent = b.type === "list_item" ? 20 : 0;
    const lines = Math.max(1, Math.ceil(textWidth(b.text || " ", fs) / Math.max(20, inner - indent)));
    h += lines * fs * lineH + (b.brk === "line" ? 0 : 5);
  }
  return Math.max(minH, Math.ceil(h + pad));
}

/** a pasted text opens the document view of src/script when it has a heading line ("# ..."), two or more paragraphs separated by a
 *  blank line, or more than 600 characters; a paragraph of a few sentences stays in the input bar (the segmenter reads it). */
export function looksLikeScript(text) {
  const t = String(text || "").replace(/\r/g, "").trim();
  if (/^#{1,6}\s+\S/m.test(t)) return { script: true, reason: "a heading line" };
  if (t.split(/\n\s*\n/).filter((p) => p.trim()).length >= 2) return { script: true, reason: "several paragraphs" };
  if (t.length > 600) return { script: true, reason: "longer than 600 characters" };
  return { script: false, reason: "one paragraph: read in the input bar" };
}
