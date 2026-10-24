// doc.js: the rich-text document of a text widget (spec 14.1), a model of our own with no dependency. DOM-free, deterministic.
//
// A document is a list of BLOCKS; each block is one line of the widget: {type: "paragraph" | "heading" | "list_item", level (heading
// 1-3), list ("bullet" | "numbered", list items), align ("left" | "center" | "right" | "justified"), brk ("paragraph" | "line": how the
// block is separated from the previous one: a new paragraph or a new line inside the same paragraph), text, marks}. marks[i] is the mark
// set of character i: {bold, italic, underline, strike, color, highlight, size} (size classes small / normal / large / huge).
// Offsets are GLOBAL: the flat text is the blocks' texts joined with "\n" (one offset per block boundary), so a range is {from, to}.
// The selection is {anchor, head}; the cursor is the head. lastRange is the range touched by the last change (the referent of "it" /
// "that" when nothing is selected, spec 10.3 applied to text).
// Transactions: every change runs inside doc.transact(label, fn); nested calls join the outer one, so a command is ONE undo entry
// (spec 14.4). undo() / redo() restore the snapshots (content, selection, lastRange). Cursor and selection moves alone are not entries.
// Serialisation: toJSON() / TextDoc.fromJSON(), toHTML(), toOutline() (a compact text form used by the tests), TextDoc.fromText().
export const MARK_KEYS = ["bold", "italic", "underline", "strike", "color", "highlight", "size"];
export const SIZE_CLASSES = ["small", "normal", "large", "huge"];
export const ALIGNS = ["left", "center", "right", "justified"];

export function cleanMarks(m) {
  const o = {};
  if (!m) return o;
  for (const k of MARK_KEYS) if (m[k] !== undefined && m[k] !== null && m[k] !== false) o[k] = m[k];
  if (o.size === "normal") delete o.size;
  return o;
}
const mkey = (m) => JSON.stringify(cleanMarks(m));
const clone = (o) => JSON.parse(JSON.stringify(o));

function newBlock(props = {}) {
  const b = { type: "paragraph", level: null, list: null, align: "left", brk: "paragraph", text: "", marks: [] };
  return Object.assign(b, props);
}

export class TextDoc {
  constructor() {
    this.blocks = [newBlock()]; this.selection = { anchor: 0, head: 0 }; this.lastRange = null;
    this.undoStack = []; this.redoStack = []; this._depth = 0; this._tr = null; this._seq = 0;
  }

  // ---------------------------------------------------------------- reading
  text() { return this.blocks.map((b) => b.text).join("\n"); }
  get length() { return this.blocks.reduce((n, b) => n + b.text.length, 0) + this.blocks.length - 1; }
  blockStart(i) { let p = 0; for (let k = 0; k < i; k++) p += this.blocks[k].text.length + 1; return p; }
  blockRange(i) { const s = this.blockStart(i); return { from: s, to: s + this.blocks[i].text.length }; }
  locate(pos) {                                           // global offset -> {block, off}; a boundary offset belongs to the block it ends
    pos = Math.max(0, Math.min(pos, this.length)); let s = 0;
    for (let i = 0; i < this.blocks.length; i++) {
      const L = this.blocks[i].text.length;
      if (pos <= s + L) return { block: i, off: pos - s };
      s += L + 1;
    }
    const i = this.blocks.length - 1; return { block: i, off: this.blocks[i].text.length };
  }
  blocksIn(from, to) {                                    // indices of the blocks a range touches (an empty range: its block)
    const a = this.locate(from).block, b = this.locate(Math.max(from, to)).block; const out = [];
    for (let i = a; i <= b; i++) out.push(i);
    return out;
  }
  slice(from, to) { return this.text().slice(from, to); }
  marksAt(pos) {                                          // the marks a character typed at pos takes: those of the character before it
    const { block, off } = this.locate(pos); const b = this.blocks[block];
    if (off > 0) return cleanMarks(b.marks[off - 1]);
    return b.text.length ? cleanMarks(b.marks[0]) : {};
  }
  charMarks(pos) {                                        // the marks of the character at pos (after it)
    const { block, off } = this.locate(pos); const b = this.blocks[block];
    return off < b.text.length ? cleanMarks(b.marks[off]) : this.marksAt(pos);
  }
  get cursor() { return this.selection.head; }
  selectionRange() { const { anchor, head } = this.selection; return { from: Math.min(anchor, head), to: Math.max(anchor, head) }; }
  hasSelection() { return this.selection.anchor !== this.selection.head; }

  // ---------------------------------------------------------------- transactions and history
  _snap() { return JSON.stringify({ b: this.blocks, s: this.selection, l: this.lastRange }); }
  _restore(s) { const o = JSON.parse(s); this.blocks = o.b; this.selection = o.s; this.lastRange = o.l; }
  transact(label, fn) {
    if (this._depth > 0) { this._depth++; try { return fn(this); } finally { this._depth--; } }
    const before = this._snap(); this._depth = 1; this._tr = { id: ++this._seq, label, steps: [] }; let ret;
    try { ret = fn(this); } catch (e) { this._restore(before); this._depth = 0; this._tr = null; throw e; }
    this._depth = 0; const tr = this._tr; this._tr = null;
    const after = this._snap();
    if (after !== before) { this.undoStack.push({ id: tr.id, label, steps: tr.steps, before, after }); this.redoStack = []; }
    return ret === undefined ? tr : ret;
  }
  _step(s) { if (this._tr) this._tr.steps.push(s); }
  lastTransaction() { return this.undoStack.length ? this.undoStack[this.undoStack.length - 1] : null; }
  undo() {
    const e = this.undoStack.pop(); if (!e) return null;
    this._restore(e.before); this.redoStack.push(e); return e.label;
  }
  redo() {
    const e = this.redoStack.pop(); if (!e) return null;
    this._restore(e.after); this.undoStack.push(e); return e.label;
  }

  // ---------------------------------------------------------------- selection (not undo entries)
  setSelection(anchor, head = anchor) {
    const L = this.length; this.selection = { anchor: Math.max(0, Math.min(anchor, L)), head: Math.max(0, Math.min(head, L)) };
  }
  setCursor(pos) { this.setSelection(pos, pos); }

  // ---------------------------------------------------------------- changes (each joins the current transaction, or makes its own)
  insertText(pos, text, marks = null) {
    return this.transact("insert text", () => {
      const parts = String(text).split("\n");
      let p = pos;
      parts.forEach((part, k) => {
        if (k > 0) { this._split(p, "line"); p += 1; }
        if (part) { this._insert(p, part, marks); p += part.length; }
      });
      this.lastRange = { from: pos, to: p }; this.setCursor(p); this._step({ op: "insert", from: pos, to: p, text });
      return { from: pos, to: p };
    });
  }
  _insert(pos, s, marks) {
    const { block, off } = this.locate(pos); const b = this.blocks[block];
    const m = cleanMarks(marks || this.marksAt(pos));
    b.text = b.text.slice(0, off) + s + b.text.slice(off);
    b.marks = [...b.marks.slice(0, off), ...Array.from({ length: s.length }, () => clone(m)), ...b.marks.slice(off)];
  }
  splitBlock(pos, brk = "paragraph", props = null) {
    return this.transact("new block", () => {
      this._split(pos, brk, props); this.lastRange = { from: pos, to: pos + 1 }; this.setCursor(pos + 1); this._step({ op: "split", at: pos, brk });
      return { from: pos, to: pos + 1 };
    });
  }
  _split(pos, brk, props = null) {
    const { block, off } = this.locate(pos); const b = this.blocks[block];
    const keepType = b.type === "list_item" ? { type: "list_item", list: b.list, level: null } : { type: "paragraph", list: null, level: null };
    const nb = newBlock(Object.assign({ align: b.align, brk }, keepType, props || {}));
    nb.text = b.text.slice(off); nb.marks = b.marks.slice(off);
    b.text = b.text.slice(0, off); b.marks = b.marks.slice(0, off);
    this.blocks.splice(block + 1, 0, nb);
  }
  deleteRange(from, to) {
    if (to < from) [from, to] = [to, from];
    return this.transact("delete", () => {
      const removed = this.slice(from, to); this._delete(from, to);
      this.lastRange = { from, to: from }; this.setCursor(from); this._step({ op: "delete", from, to, text: removed });
      return { from, to: from, removed };
    });
  }
  _delete(from, to) {
    if (to <= from) return;
    const a = this.locate(from), z = this.locate(to); const A = this.blocks[a.block], Z = this.blocks[z.block];
    if (a.block === z.block) { A.text = A.text.slice(0, a.off) + A.text.slice(z.off); A.marks.splice(a.off, z.off - a.off); return; }
    A.text = A.text.slice(0, a.off) + Z.text.slice(z.off); A.marks = [...A.marks.slice(0, a.off), ...Z.marks.slice(z.off)];
    this.blocks.splice(a.block + 1, z.block - a.block);
  }
  replaceRange(from, to, text) {
    return this.transact("replace", () => {
      const marks = to > from ? this.charMarks(from) : this.marksAt(from);
      const removed = this.slice(from, to); this._delete(from, to); this._insert(from, text, marks);
      this.lastRange = { from, to: from + text.length }; this.setCursor(from + text.length); this._step({ op: "replace", from, to, removed, text });
      return { from, to: from + text.length, removed };
    });
  }
  _eachChar(from, to, fn) {                              // fn(block, off) over the characters of [from, to)
    for (const i of this.blocksIn(from, to)) {
      const r = this.blockRange(i); const a = Math.max(from, r.from) - r.from, z = Math.min(to, r.to) - r.from;
      for (let k = a; k < z; k++) fn(this.blocks[i], k);
    }
  }
  addMark(from, to, key, value = true) {
    return this.transact(`format ${key}`, () => {
      this._eachChar(from, to, (b, k) => { const m = cleanMarks(b.marks[k]); m[key] = value; b.marks[k] = cleanMarks(m); });
      this.lastRange = { from, to }; this._step({ op: "mark", from, to, key, value });
    });
  }
  removeMark(from, to, key = null) {
    return this.transact(key ? `remove ${key}` : "remove formatting", () => {
      this._eachChar(from, to, (b, k) => { if (key) { const m = cleanMarks(b.marks[k]); delete m[key]; b.marks[k] = m; } else b.marks[k] = {}; });
      this.lastRange = { from, to }; this._step({ op: "unmark", from, to, key });
    });
  }
  mapChars(from, to, fn, label = "change case") {        // fn(char, previous char of the flat text) -> one character
    return this.transact(label, () => {
      const flat = this.text();
      for (let p = from; p < to; p++) {
        if (flat[p] === "\n") continue;
        const { block, off } = this.locate(p); const b = this.blocks[block]; const c = b.text[off], n = fn(c, p > 0 ? flat[p - 1] : "");
        if (typeof n === "string" && n.length === 1 && n !== c) b.text = b.text.slice(0, off) + n + b.text.slice(off + 1);
      }
      this.lastRange = { from, to }; this._step({ op: "chars", from, to, label });
    });
  }
  setBlocks(from, to, props, label = "block format") {
    return this.transact(label, () => {
      const ids = this.blocksIn(from, to);
      for (const i of ids) Object.assign(this.blocks[i], props);
      this.lastRange = { from: this.blockStart(ids[0]), to: this.blockRange(ids[ids.length - 1]).to }; this._step({ op: "blocks", blocks: ids, props });
    });
  }

  // ---------------------------------------------------------------- serialisation
  runs(i) {                                              // the block's text as runs of equal marks
    const b = this.blocks[i]; const out = [];
    for (let k = 0; k < b.text.length; k++) {
      const key = mkey(b.marks[k]);
      if (out.length && out[out.length - 1].key === key) out[out.length - 1].text += b.text[k];
      else out.push({ key, text: b.text[k], marks: cleanMarks(b.marks[k]) });
    }
    return out.map(({ text, marks }) => (Object.keys(marks).length ? { text, marks } : { text }));
  }
  toJSON() {
    return { version: 1, blocks: this.blocks.map((b, i) => {
      const o = { type: b.type };
      if (b.type === "heading") o.level = b.level; if (b.type === "list_item") o.list = b.list;
      if (b.align && b.align !== "left") o.align = b.align; if (i > 0 && b.brk === "line") o.brk = "line";
      o.runs = this.runs(i); return o;
    }), selection: { ...this.selection } };
  }
  static fromJSON(o) {
    const d = new TextDoc();
    d.blocks = (o.blocks && o.blocks.length ? o.blocks : [{ type: "paragraph", runs: [] }]).map((b) => {
      const nb = newBlock({ type: b.type || "paragraph", level: b.type === "heading" ? (b.level || 1) : null, list: b.type === "list_item" ? (b.list || "bullet") : null,
        align: b.align || "left", brk: b.brk === "line" ? "line" : "paragraph" });
      for (const r of b.runs || []) { nb.text += r.text; for (let k = 0; k < r.text.length; k++) nb.marks.push(cleanMarks(r.marks)); }
      return nb;
    });
    if (o.selection) d.setSelection(o.selection.anchor, o.selection.head); else d.setCursor(d.length);
    return d;
  }
  // plain text with a few block prefixes: '# ' '## ' '### ' headings, '- ' bullet items, '1. ' numbered items; a blank line separates
  // paragraphs, a single newline separates lines of one paragraph. The cursor goes to the end.
  static fromText(src) {
    const d = new TextDoc(); d.blocks = [];
    const paras = String(src).split(/\n\s*\n/);
    for (const p of paras) {
      p.split("\n").forEach((line, k) => {
        const b = newBlock({ brk: k === 0 ? "paragraph" : "line" }); let m;
        if ((m = /^(#{1,3}) (.*)$/.exec(line))) { b.type = "heading"; b.level = m[1].length; line = m[2]; }
        else if ((m = /^- (.*)$/.exec(line))) { b.type = "list_item"; b.list = "bullet"; line = m[1]; }
        else if ((m = /^\d+\. (.*)$/.exec(line))) { b.type = "list_item"; b.list = "numbered"; line = m[1]; }
        b.text = line; b.marks = Array.from({ length: line.length }, () => ({})); d.blocks.push(b);
      });
    }
    if (!d.blocks.length) d.blocks.push(newBlock());
    d.setCursor(d.length); return d;
  }
  // the compact form of the tests: block prefixes as fromText, marks as **bold** *italic* __underline__ ~~strike~~ {red|text}
  // {hl:yellow|text} {size:large|text}; alignment as a ' [center]' suffix
  toOutline() {
    let out = "";
    this.blocks.forEach((b, i) => {
      if (i > 0) out += b.brk === "line" ? "\n" : "\n\n";
      let num = 1; if (b.type === "list_item" && b.list === "numbered") { for (let k = i - 1; k >= 0 && this.blocks[k].type === "list_item" && this.blocks[k].list === "numbered"; k--) num++; }
      out += b.type === "heading" ? "#".repeat(b.level) + " " : b.type === "list_item" ? (b.list === "numbered" ? `${num}. ` : "- ") : "";
      for (const r of this.runs(i)) {
        let t = r.text; const m = r.marks || {};
        if (m.size) t = `{size:${m.size}|${t}}`; if (m.highlight) t = `{hl:${m.highlight}|${t}}`; if (m.color) t = `{${m.color}|${t}}`;
        if (m.strike) t = `~~${t}~~`; if (m.underline) t = `__${t}__`; if (m.italic) t = `*${t}*`; if (m.bold) t = `**${t}**`;
        out += t;
      }
      if (b.align && b.align !== "left") out += ` [${b.align}]`;
    });
    return out;
  }
  toHTML() {
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const inline = (i) => this.runs(i).map((r) => {
      let t = esc(r.text); const m = r.marks || {};
      if (m.size) t = `<span class="vss-size-${m.size}">${t}</span>`;
      if (m.highlight) t = `<mark style="background-color:${esc(String(m.highlight))}">${t}</mark>`;
      if (m.color) t = `<span style="color:${esc(String(m.color))}">${t}</span>`;
      if (m.strike) t = `<s>${t}</s>`; if (m.underline) t = `<u>${t}</u>`; if (m.italic) t = `<em>${t}</em>`; if (m.bold) t = `<strong>${t}</strong>`;
      return t;
    }).join("");
    const style = (b) => (b.align && b.align !== "left" ? ` style="text-align:${b.align === "justified" ? "justify" : b.align}"` : "");
    let html = "", open = null;
    this.blocks.forEach((b, i) => {
      const lt = b.type === "list_item" ? (b.list === "numbered" ? "ol" : "ul") : null;
      if (open && open !== lt) { html += `</${open}>`; open = null; }
      if (lt && !open) { html += `<${lt}>`; open = lt; }
      const cls = i > 0 && b.brk === "line" ? ' class="vss-line"' : "";
      if (lt) html += `<li${cls}${style(b)}>${inline(i)}</li>`;
      else if (b.type === "heading") html += `<h${b.level}${cls}${style(b)}>${inline(i)}</h${b.level}>`;
      else html += `<p${cls}${style(b)}>${inline(i) || "<br>"}</p>`;
    });
    if (open) html += `</${open}>`;
    return html;
  }
}

// ------------------------------------------------------------------ units of text (spec 14.3 Table 9: character, word, sentence, line,
// paragraph, list item, everything): ranges {from, to} in global offsets, in document order. Stated definitions: a character is any
// non-space character; a word is a run of letters / digits with inner apostrophes, hyphens or underscores; a sentence ends at . ! ? or at
// the end of its block; a line is a non-empty block; a paragraph is a block that starts a paragraph (brk "paragraph") with the line blocks
// that follow it; a list item is a block of type list_item; everything is the whole document.
export function unitRanges(doc, unit) {
  const flat = doc.text(); const out = [];
  switch (unit) {
    case "character": for (let i = 0; i < flat.length; i++) if (!/\s/.test(flat[i])) out.push({ from: i, to: i + 1 }); break;
    case "word": { const re = /[\p{L}\p{N}](?:[\p{L}\p{N}_]|['’-](?=[\p{L}\p{N}]))*/gu; let m; while ((m = re.exec(flat))) out.push({ from: m.index, to: m.index + m[0].length }); break; }
    case "sentence":
      doc.blocks.forEach((b, i) => {
        const s0 = doc.blockStart(i); const re = /[^.!?\s][^.!?]*(?:[.!?]+|$)/g; let m;
        while ((m = re.exec(b.text))) { const t = m[0].replace(/\s+$/, ""); if (t) out.push({ from: s0 + m.index, to: s0 + m.index + t.length }); if (m[0] === "") re.lastIndex++; }
      });
      break;
    case "line": doc.blocks.forEach((b, i) => { if (b.text.trim()) out.push(doc.blockRange(i)); }); break;
    case "paragraph": {
      let cur = null;
      doc.blocks.forEach((b, i) => {
        const r = doc.blockRange(i);
        if (i === 0 || b.brk !== "line" || b.type !== doc.blocks[i - 1].type) { if (cur) out.push(cur); cur = { from: r.from, to: r.to }; } else cur.to = r.to;
      });
      if (cur) out.push(cur);
      return out.filter((r) => flat.slice(r.from, r.to).trim());
    }
    case "list_item": doc.blocks.forEach((b, i) => { if (b.type === "list_item") out.push(doc.blockRange(i)); }); break;
    case "everything": out.push({ from: 0, to: flat.length }); break;
    default: break;
  }
  return out;
}
