// commands.js: a textedit frame executed on a text document (spec 14.3-14.4). DOM-free, deterministic; every decision carries its reason.
//
//   const p = plan(doc, frame, info, {normalize});     // resolve the targets, build the steps; nothing changes yet
//   p.questions.length -> ask (several matches: candidates to highlight and choose; no match: reported); p.destructive -> show
//   p.resolution first, then execute(doc, p, {confirmed: true}); otherwise execute(doc, p). A chosen candidate: plan(..., {choose: k}).
//
// frame: the reader's frame for the textedit world (src/vss.js): {event, lemma, roles: {unit, ordinal, match, format, value, position,
// new_text, widget}} with fillers ["word", token]. info: the textedit normalizer's info ({labels, numbers}), which gives back the original
// text of a quoted piece. normalize: the textedit normalizer (textnorm.js), used to compare a match with the document ("twenty" = "20").
//
// Resolution rules (stated; spec 14.4):
//  - unit + ordinal: first..fifth, first_N counted from the START of the text; last, last_N counted from the END of the text; this = the
//    unit at the cursor (or at the start of the selection); previous / next (and previous_N / next_N) counted from that unit (from the cursor
//    when it is between units). A unit without ordinal = this.
//  - it / that: the selection, else the range of the last change (the last dictated words); everything: the whole text; selection: the
//    selection (empty: reported).
//  - match: searched (1) exactly (case-insensitive, whole words), then (2) through the normalizer (number words and digits: "twenty five" =
//    "25"), then (3) by phonetic key (Double Metaphone of every word, as the recogniser may have written the word differently); the first
//    stage with a hit wins. Several hits: a question with the candidates (an ordinal picks one: "the second revenue"); no hit: reported.
//  - position with a match: select / delete "from X to the end" (at_end) or "from the start to X" (at_start); insert before / after X;
//    position with a unit: at the start / end of that unit; position alone: the start / end of the text.
//  - delete and replace are DESTRUCTIVE: the plan carries the resolution and execute() refuses to apply it until confirmed.
//  - every change of one command is ONE transaction of the document (one undo entry); select, cursor moves and read back change nothing.
import { unitRanges, SIZE_CLASSES } from "./doc.js";
import { doubleMetaphone } from "../../vendor/double-metaphone.js";

export const PLURAL_UNIT = { characters: "character", words: "word", sentences: "sentence", lines: "line", paragraphs: "paragraph", list_items: "list_item" };
const UNIT_NAME = { character: "character", word: "word", sentence: "sentence", line: "line", paragraph: "paragraph", list_item: "list item" };
const PRON_UNITS = new Set(["it", "that", "everything", "selection"]);
export const LEMMA_FORMAT = { embolden: "bold", italicise: "italic", underline: "underlined", strike: "strikethrough", highlight: "highlighted" };
export const LEMMA_LIST = { bullet: "bullet_list", number: "numbered_list", enumerate: "numbered_list", itemise: "bullet_list" };
export const LEMMA_ALIGN = { centre: "center", justify: "justified" };
const INLINE = { bold: ["bold", true], italic: ["italic", true], underlined: ["underline", true], strikethrough: ["strike", true], highlighted: ["highlight", "yellow"] };
const BLOCK = { heading: { type: "heading", level: 1, list: null }, heading_one: { type: "heading", level: 1, list: null }, heading_two: { type: "heading", level: 2, list: null },
  heading_three: { type: "heading", level: 3, list: null }, list: { type: "list_item", list: "bullet", level: null }, bullet_list: { type: "list_item", list: "bullet", level: null },
  numbered_list: { type: "list_item", list: "numbered", level: null }, plain: { type: "paragraph", level: null, list: null } };
export const COLORS = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "gray", "black", "white"];
const SIZES = ["small", "normal", "large", "huge", "bigger", "smaller"];
const ALIGN_VALUES = ["left", "right", "center", "justified"];
export const PUNCT_TEXT = { full_stop: ".", comma: ",", question_mark: "?", exclamation_mark: "!", colon: ":", semicolon: ";", open_quote: "“", close_quote: "”" };
const ATTACH_RIGHT = new Set(["“"]);
const DESTRUCTIVE = new Set(["delete", "replace"]);
const ORD_INDEX = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5 };

const tokenOf = (f) => (f && (f[0] === "word" || f[0] === "negword") ? f[1] : f && f[0] === "entity" ? f[1] : null);
const WORD_RE = /[\p{L}\p{N}](?:[\p{L}\p{N}_]|['’-](?=[\p{L}\p{N}]))*/gu;
const splitWords = (s) => String(s).match(WORD_RE) || [];

export function slotsOf(frame, info = {}) {
  const r = frame.roles || {}; const w = (k) => tokenOf(r[k]);
  const textOf = (tok) => (tok == null ? null : info.labels && Object.prototype.hasOwnProperty.call(info.labels, tok) ? info.labels[tok] : tok.replace(/_/g, " "));
  let unit = w("unit"); let plural = false;
  if (unit && PLURAL_UNIT[unit]) { unit = PLURAL_UNIT[unit]; plural = true; }
  const m = w("match"), nt = w("new_text");
  return { event: frame.event, lemma: frame.lemma || null, unit, plural, ordinal: w("ordinal"), match: m, matchText: textOf(m), format: w("format"),
    value: w("value"), position: w("position"), newToken: nt, newText: nt == null ? null : (PUNCT_TEXT[nt] || textOf(nt)), widget: w("widget") };
}

// ------------------------------------------------------------------ matches (spec 14.4: exact, then through the normalizer, then phonetic)
function keys(word) { const [a, b] = doubleMetaphone(word); return new Set([a, b].filter(Boolean)); }
export function findMatches(doc, matchText, normalize = null) {
  const words = unitRanges(doc, "word").map((r) => ({ ...r, text: doc.slice(r.from, r.to) }));
  const target = splitWords(matchText).map((x) => x.toLowerCase()); const k = target.length;
  if (!k) return { stage: null, hits: [], rule: "the piece of text has no words" };
  const span = (i, n) => ({ from: words[i].from, to: words[i + n - 1].to, text: doc.slice(words[i].from, words[i + n - 1].to) });
  const exact = [];
  for (let i = 0; i + k <= words.length; i++) if (target.every((t, j) => words[i + j].text.toLowerCase() === t)) exact.push(span(i, k));
  if (exact.length) return { stage: "exact", hits: exact, rule: `"${matchText}" found exactly` };
  if (normalize && normalize.numbers) {
    const tn = normalize.numbers(target).join(" "); const hits = []; let last = -1;
    for (let i = 0; i < words.length; i++) {
      if (words[i].from < last) continue;
      for (let n = Math.min(4, words.length - i); n >= 1; n--) {
        if (normalize.numbers(words.slice(i, i + n).map((x) => x.text)).join(" ") === tn) { const s = span(i, n); hits.push(s); last = s.to; break; }
      }
    }
    if (hits.length) return { stage: "normalizer", hits, rule: `"${matchText}" found through the normalizer (number words and digits)` };
  }
  const tk = target.map(keys); const ph = [];
  for (let i = 0; i + k <= words.length; i++) {
    if (tk.every((ks, j) => { const dk = keys(words[i + j].text); return [...ks].some((x) => dk.has(x)); })) ph.push(span(i, k));
  }
  if (ph.length) return { stage: "phonetic", hits: ph, rule: `"${matchText}" found by its phonetic key (Double Metaphone)` };
  return { stage: null, hits: [], rule: `"${matchText}" is not in the text (exact, normalizer and phonetic search)` };
}

// ------------------------------------------------------------------ units with ordinals
function ordinalPick(doc, unit, ordinal, plural) {
  const us = unitRanges(doc, unit); const name = UNIT_NAME[unit] + (plural ? "s" : "");
  if (!us.length) return { ranges: [], status: "none", rule: `there is no ${UNIT_NAME[unit]} in the text` };
  const sel = doc.selectionRange(); const c = doc.hasSelection() ? sel.from : doc.cursor;
  let here = us.findIndex((u) => u.from <= c && c < u.to); if (here < 0) here = us.findIndex((u) => u.to === c);
  const after = us.findIndex((u) => u.from >= c); const beforeIdx = (() => { let k = -1; us.forEach((u, i) => { if (u.to <= c) k = i; }); return k; })();
  let o = ordinal || "this", n = 1; const mm = /^(first|last|next|previous)_(\d)$/.exec(o); if (mm) { o = mm[1]; n = Number(mm[2]); }
  let idx = [], rule;
  if (ORD_INDEX[o] && !mm) { const k = ORD_INDEX[o] - 1; idx = k < us.length ? [k] : []; rule = `the ${o} ${name} = ${name} ${k + 1} of ${us.length}, counted from the start`; }
  else if (o === "first") { idx = [...Array(Math.min(n, us.length)).keys()]; rule = `the first ${n} ${name}, counted from the start`; if (us.length < n) idx = []; }
  else if (o === "last") { idx = us.length >= n ? [...Array(n).keys()].map((k) => us.length - n + k) : []; rule = `the last ${n > 1 ? n + " " : ""}${name} = ${us.length >= n ? `${us.length - n + 1}${n > 1 ? "-" + us.length : ""} of ${us.length}` : "not enough"}, counted from the end`; }
  else if (o === "this") { idx = here >= 0 ? [here] : []; rule = `this ${name} = the one at the cursor`; }
  else if (o === "next") { const s = here >= 0 ? here + 1 : after; idx = s >= 0 && s + n <= us.length ? [...Array(n).keys()].map((k) => s + k) : []; rule = `the next ${n > 1 ? n + " " : ""}${name}, counted from the cursor`; }
  else if (o === "previous") { const e = here >= 0 ? here - 1 : beforeIdx; idx = e - n + 1 >= 0 ? [...Array(n).keys()].map((k) => e - n + 1 + k) : []; rule = `the previous ${n > 1 ? n + " " : ""}${name}, counted from the cursor`; }
  else return { ranges: [], status: "none", rule: `unknown ordinal ${ordinal}` };
  if (!idx.length) return { ranges: [], status: "none", rule: `${rule}: there is no such ${UNIT_NAME[unit]} (the text has ${us.length})` };
  const parts = idx.map((k) => us[k]);                   // several units are one span (the spaces between them included)
  return { ranges: parts.length > 1 ? [{ from: parts[0].from, to: parts[parts.length - 1].to }] : parts, parts, status: "ok", rule };
}

export function resolveTarget(doc, s, { normalize = null, choose = null, needTarget = true } = {}) {
  if (s.match != null) {
    const f = findMatches(doc, s.matchText, normalize);
    if (!f.hits.length) return { ranges: [], status: "none", rule: f.rule, stage: f.stage };
    let hits = f.hits;
    if (s.ordinal && hits.length > 1) {
      const o = s.ordinal; const k = ORD_INDEX[o] ? ORD_INDEX[o] - 1 : o === "last" ? hits.length - 1 : null;
      if (k !== null && k < hits.length) return { ranges: [hits[k]], status: "ok", rule: `${f.rule}; the ${o} of ${hits.length}`, stage: f.stage };
    }
    if (hits.length > 1 && choose !== null && choose !== undefined) {
      if (choose === "all") return { ranges: hits, status: "ok", rule: `${f.rule}; all ${hits.length} chosen`, stage: f.stage };
      if (hits[choose]) return { ranges: [hits[choose]], status: "ok", rule: `${f.rule}; candidate ${choose + 1} of ${hits.length} chosen`, stage: f.stage };
    }
    if (hits.length > 1) return { ranges: [], status: "ambiguous", candidates: hits, rule: `${f.rule} ${hits.length} times`, stage: f.stage };
    return { ranges: hits, status: "ok", rule: f.rule, stage: f.stage };
  }
  if (s.unit && PRON_UNITS.has(s.unit)) {
    if (s.unit === "everything") return { ranges: [{ from: 0, to: doc.length }], status: "ok", rule: "everything = the whole text" };
    if (doc.hasSelection()) return { ranges: [doc.selectionRange()], status: "ok", rule: `${s.unit} = the selection` };
    if (s.unit === "selection") return { ranges: [], status: "none", rule: "nothing is selected" };
    if (doc.lastRange && doc.lastRange.to > doc.lastRange.from) return { ranges: [{ ...doc.lastRange }], status: "ok", rule: `${s.unit} = the text of the last change` };
    return { ranges: [], status: "none", rule: `${s.unit}: nothing is selected and nothing was changed yet` };
  }
  if (s.unit) return ordinalPick(doc, s.unit, s.ordinal, s.plural);
  if (!needTarget) return { ranges: [], status: "ok", rule: "no target needed" };
  if (doc.hasSelection()) return { ranges: [doc.selectionRange()], status: "ok", rule: "no target named: the selection" };
  return { ranges: [], status: "missing", rule: "no target named and nothing selected" };
}

// ------------------------------------------------------------------ plan
const isPunct = (t) => /^[.,;:!?”)]$/.test(t) || t === "...";
function deletionRange(doc, r, unit) {                    // tidy deletions: a word / sentence / piece takes one adjacent space with it;
  const flat = doc.text();                               // a line / paragraph / list item takes its block separator
  if (unit === "line" || unit === "paragraph" || unit === "list_item") {
    if (r.to < flat.length && flat[r.to] === "\n") return { from: r.from, to: r.to + 1 };
    if (r.from > 0 && flat[r.from - 1] === "\n") return { from: r.from - 1, to: r.to };
    return r;
  }
  if (unit === "character" || unit === "everything") return r;
  if (flat[r.to] === " ") return { from: r.from, to: r.to + 1 };
  if (r.from > 0 && flat[r.from - 1] === " ") return { from: r.from - 1, to: r.to };
  return r;
}
function caseLike(src, t) { return src && /^\p{Lu}/u.test(src) && t ? t[0].toUpperCase() + t.slice(1) : t; }

export function plan(doc, frame, info = {}, opts = {}) {
  const s = slotsOf(frame, info); const ev = s.event;
  const out = { event: ev, slots: s, steps: [], questions: [], resolution: null, destructive: DESTRUCTIVE.has(ev), explain: [] };
  const q = (kind, text, extra = {}) => { out.questions.push({ kind, text, ...extra }); return out; };
  const target = (needTarget = true) => {
    const r = resolveTarget(doc, s, { normalize: opts.normalize, choose: opts.choose, needTarget }); out.resolution = r; out.explain.push(r.rule);
    if (r.status === "ambiguous") q("which", `which one? "${s.matchText}" occurs ${r.candidates.length} times`, { candidates: r.candidates });
    else if (r.status === "none") q("no-match", r.rule);
    else if (r.status === "missing") q("missing", "which text? nothing is named or selected");
    return r.status === "ok" ? r : null;
  };
  const ranges = (r) => r.ranges;
  const each = (r, f) => { for (const x of [...ranges(r)].sort((a, b) => b.from - a.from)) f(x); };   // from the end: earlier offsets stay valid
  switch (ev) {
    case "undo": out.steps.push({ op: "undo" }); out.explain.push("undo the last change of this text"); break;
    case "redo": out.steps.push({ op: "redo" }); out.explain.push("redo the last undone change of this text"); break;
    case "select": {
      if (s.match != null && (s.position === "at_end" || s.position === "at_start")) {
        const r = target(); if (!r) break; const m = r.ranges[0];
        const sel = s.position === "at_end" ? { from: m.from, to: doc.length } : { from: 0, to: m.to };
        out.steps.push({ op: "select", ...sel }); out.explain.push(s.position === "at_end" ? `from "${m.text}" to the end` : `from the start to "${m.text}"`); break;
      }
      const r = target(); if (!r) break;
      const all = { from: Math.min(...r.ranges.map((x) => x.from)), to: Math.max(...r.ranges.map((x) => x.to)) };
      out.steps.push({ op: "select", ...all }); break;
    }
    case "move_cursor": {
      if (s.match == null && !s.unit) {
        const pos = s.position === "at_start" ? 0 : doc.length; out.steps.push({ op: "cursor", pos }); out.explain.push(`the ${s.position === "at_start" ? "start" : "end"} of the text`);
        out.resolution = { ranges: [{ from: pos, to: pos }], status: "ok", rule: "position alone: the text" }; break;
      }
      const r = target(); if (!r) break; const m = r.ranges[0];
      const pos = s.position === "after" || s.position === "at_end" ? m.to : m.from; out.steps.push({ op: "cursor", pos }); break;
    }
    case "read_back": { const r = target(); if (!r) break; out.steps.push({ op: "read", text: r.ranges.map((x) => doc.slice(x.from, x.to)).join(" ") }); break; }
    case "delete": {
      if (s.match != null && (s.position === "after" || s.position === "before" || s.position === "at_end" || s.position === "at_start")) {
        const r = target(); if (!r) break; const m = r.ranges[0];
        const d = s.position === "after" || s.position === "at_end" ? { from: m.to, to: doc.length } : { from: 0, to: m.from };
        if (s.position === "at_end" || s.position === "at_start") { if (s.position === "at_end") d.from = m.from; else d.to = m.to; }
        out.resolution = { ...r, ranges: [d] }; out.steps.push({ op: "delete", ...d }); out.explain.push(`delete "${doc.slice(d.from, d.to)}"`); break;
      }
      const r = target(); if (!r) break; const unit = s.match != null ? "word" : s.unit;
      each(r, (x) => out.steps.push({ op: "delete", ...deletionRange(doc, x, PRON_UNITS.has(unit) && unit !== "everything" ? "word" : unit) }));
      out.explain.push(`delete ${r.ranges.map((x) => `"${doc.slice(x.from, x.to)}"`).join(", ")}`); break;
    }
    case "replace": {
      if (s.newText == null) return q("missing", "replace with what?");
      const r = target(); if (!r) break;
      each(r, (x) => out.steps.push({ op: "replace", from: x.from, to: x.to, text: caseLike(doc.slice(x.from, x.to), s.newText) }));
      out.explain.push(`replace ${r.ranges.map((x) => `"${doc.slice(x.from, x.to)}"`).join(", ")} with "${s.newText}"`); break;
    }
    case "insert": {
      if (s.newText == null) return q("missing", "insert what?");
      const layout = s.newToken === "new_line" ? "line" : s.newToken === "new_paragraph" ? "paragraph" : null;
      let pos, why;
      if (s.match != null || s.unit) {
        const r = target(); if (!r) break; const m = r.ranges[0];
        pos = s.position === "before" || s.position === "at_start" ? m.from : m.to; why = `${s.position || "after"} "${doc.slice(m.from, m.to)}"`;
      } else { pos = s.position === "at_start" ? 0 : doc.length; why = `at the ${s.position === "at_start" ? "start" : "end"} of the text`; out.resolution = { ranges: [{ from: pos, to: pos }], status: "ok", rule: why }; }
      if (layout) {
        if (doc.text()[pos] === " ") out.steps.push({ op: "delete", from: pos, to: pos + 1 });      // the space would start the new line
        out.steps.push({ op: "split", pos, brk: layout }); out.explain.push(`a new ${layout} ${why}`); break;
      }
      const flat = doc.text(); const t = s.newText; let ins = t, at = pos;
      if (isPunct(t)) { if (s.position === "before") { while (at > 0 && flat[at - 1] === " ") at--; } ins = t; }
      else if (ATTACH_RIGHT.has(t)) ins = (at > 0 && !/\s/.test(flat[at - 1]) ? " " : "") + t;
      else {
        const leftSpace = at > 0 && !/\s/.test(flat[at - 1]) && flat[at - 1] !== "“"; const rightSpace = at < flat.length && !/\s/.test(flat[at]) && !isPunct(flat[at]);
        ins = (leftSpace ? " " : "") + t + (rightSpace ? " " : "");
      }
      out.steps.push({ op: "insert", pos: at, text: ins }); out.explain.push(`insert "${t}" ${why}`); break;
    }
    case "capitalise": {
      const r = target(); if (!r) break; const mode = s.lemma === "uppercase" ? "uppercase" : "capitalise";
      each(r, (x) => out.steps.push({ op: "chars", from: x.from, to: x.to, mode })); out.explain.push(mode === "uppercase" ? "every letter in capitals" : "the first letter of every word in capitals"); break;
    }
    case "unformat": {
      const r = target(); if (!r) break; const key = s.format && INLINE[s.format] ? INLINE[s.format][0] : null;
      each(r, (x) => out.steps.push({ op: "unmark", from: x.from, to: x.to, key })); out.explain.push(key ? `remove ${s.format}` : "remove every mark (bold, italic, colour, ...)"); break;
    }
    case "make_list": case "make_heading": case "align": case "format": {
      let fmt = s.format, value = s.value;
      if (ev === "make_list" && !fmt) fmt = LEMMA_LIST[s.lemma] || "bullet_list";
      if (ev === "format" && !fmt && !value) fmt = LEMMA_FORMAT[s.lemma] || null;
      if (ev === "format" && s.lemma === "highlight" && value && COLORS.includes(value)) { fmt = "highlighted"; }
      if (ev === "align" && !value) value = LEMMA_ALIGN[s.lemma] || null;
      if (ev === "align" && !value) return q("missing", "align how? left, right, center or justified");
      if (ev === "format" && !fmt && !value) return q("missing", "which format?");
      const r = target(); if (!r) break;
      if (ev === "make_heading" && !fmt) {
        const b = doc.blocks[doc.locate(r.ranges[0].from).block]; const lvl = b.type === "heading" ? b.level : null;
        const nl = s.lemma === "demote" ? (lvl ? (lvl < 3 ? lvl + 1 : null) : 3) : (lvl ? Math.max(1, lvl - 1) : 1);
        fmt = nl ? ["heading_one", "heading_two", "heading_three"][nl - 1] : "plain"; out.explain.push(`${s.lemma || "promote"}: ${lvl ? "heading " + lvl : "paragraph"} -> ${nl ? "heading " + nl : "paragraph"}`);
      }
      if (ev === "make_heading" && fmt && !fmt.startsWith("heading")) return q("missing", `a heading is heading one, two or three, not ${fmt}`);
      if (value && ALIGN_VALUES.includes(value) && (ev === "align" || ev === "format")) { each(r, (x) => out.steps.push({ op: "blocks", from: x.from, to: x.to, props: { align: value } })); out.explain.push(`align ${value}`); }
      else if (fmt && BLOCK[fmt]) { each(r, (x) => out.steps.push({ op: "blocks", from: x.from, to: x.to, props: { ...BLOCK[fmt] } })); if (fmt === "plain") each(r, (x) => out.steps.push({ op: "unmark", from: x.from, to: x.to, key: null })); out.explain.push(`${fmt.replace(/_/g, " ")} (${ev === "format" ? "format with a block value, as " + (BLOCK[fmt].type === "heading" ? "make_heading" : BLOCK[fmt].type === "list_item" ? "make_list" : "plain text") : ev})`); }
      else if (fmt && INLINE[fmt]) { const [k, v] = INLINE[fmt]; const val = k === "highlight" && value && COLORS.includes(value) ? value : v; each(r, (x) => out.steps.push({ op: "mark", from: x.from, to: x.to, key: k, value: val })); out.explain.push(`${fmt}${k === "highlight" ? " " + val : ""}`); }
      else if (value && COLORS.includes(value)) { each(r, (x) => out.steps.push({ op: "mark", from: x.from, to: x.to, key: "color", value })); out.explain.push(`colour ${value}`); }
      else if (value && SIZES.includes(value)) { each(r, (x) => out.steps.push({ op: "size", from: x.from, to: x.to, value })); out.explain.push(`size ${value}`); }
      else return q("missing", `cannot apply ${fmt || value} here`);
      break;
    }
    default: return q("unknown-event", `the textedit world has no event ${ev}`);
  }
  return out;
}

// ------------------------------------------------------------------ execute
export function execute(doc, p, { confirmed = false } = {}) {
  if (p.questions.length) return { applied: false, reason: p.questions.map((x) => x.text).join("; ") };
  if (p.destructive && !confirmed) return { applied: false, pending: true, reason: `shown first: ${p.explain.join("; ")} (confirm to apply)` };
  const res = { applied: true, read: null, transaction: null };
  const content = p.steps.filter((x) => !["select", "cursor", "read", "undo", "redo"].includes(x.op));
  for (const st of p.steps) {
    if (st.op === "undo") { res.label = doc.undo(); res.applied = res.label !== null; if (!res.applied) res.reason = "nothing to undo"; }
    if (st.op === "redo") { res.label = doc.redo(); res.applied = res.label !== null; if (!res.applied) res.reason = "nothing to redo"; }
    if (st.op === "select") doc.setSelection(st.from, st.to);
    if (st.op === "cursor") doc.setCursor(st.pos);
    if (st.op === "read") res.read = st.text;
  }
  if (!content.length) return res;
  doc.transact(p.event, () => {
    let lo = Infinity, hi = -Infinity;
    for (const st of content) {
      switch (st.op) {
        case "mark": doc.addMark(st.from, st.to, st.key, st.value); break;
        case "unmark": doc.removeMark(st.from, st.to, st.key); break;
        case "blocks": doc.setBlocks(st.from, st.to, st.props); break;
        case "insert": doc.insertText(st.pos, st.text); break;
        case "split": doc.splitBlock(st.pos, st.brk); break;
        case "delete": doc.deleteRange(st.from, st.to); break;
        case "replace": doc.replaceRange(st.from, st.to, st.text); break;
        case "chars": doc.mapChars(st.from, st.to, st.mode === "uppercase" ? (c) => c.toUpperCase() : (c, prev) => (!prev || !/[\p{L}\p{N}'’]/u.test(prev) ? c.toUpperCase() : c)); break;
        case "size": {
          const cur = doc.charMarks(st.from).size || "normal"; const i = SIZE_CLASSES.indexOf(cur);
          const v = st.value === "bigger" ? SIZE_CLASSES[Math.min(SIZE_CLASSES.length - 1, i + 1)] : st.value === "smaller" ? SIZE_CLASSES[Math.max(0, i - 1)] : st.value;
          doc.addMark(st.from, st.to, "size", v); break;
        }
        default: break;
      }
      if (doc.lastRange) { lo = Math.min(lo, doc.lastRange.from); hi = Math.max(hi, doc.lastRange.to); }
    }
    if (lo <= hi) doc.lastRange = { from: lo, to: Math.min(hi, doc.length) };
  });
  res.transaction = doc.lastTransaction(); return res;
}

// ------------------------------------------------------------------ which widget (Table 9 'widget': resolved like a diagram label)
// widgets: [{id, label, doc}]; current: the id of the widget in dictation (or the selected one). Returns {id, status, rule}.
export function selectWidget(widgets, frame, { current = null } = {}) {
  const key = (x) => String(x || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  const name = tokenOf((frame.roles || {}).widget);
  if (name) {
    const hits = widgets.filter((w) => key(w.label) === key(name));
    if (hits.length === 1) return { id: hits[0].id, status: "ok", rule: `the text widget labelled "${hits[0].label}"` };
    return { id: null, status: hits.length ? "ambiguous" : "none", candidates: hits.map((w) => w.id), rule: hits.length ? `${hits.length} text widgets are labelled "${name}"` : `there is no text widget called "${name}"` };
  }
  if (current && widgets.some((w) => w.id === current)) return { id: current, status: "ok", rule: "the text widget being written in" };
  if (widgets.length === 1) return { id: widgets[0].id, status: "ok", rule: "the only text widget" };
  return { id: null, status: widgets.length ? "ambiguous" : "none", candidates: widgets.map((w) => w.id), rule: widgets.length ? "which text widget?" : "there is no text widget" };
}
