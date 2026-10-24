// dictation.js: command mode and dictation mode (spec 14.2) and the command-or-content decision inside dictation (spec 14.3). DOM-free.
//
//   const d = createDictation({ reader, table, normalize, calibration });
//   d.handle(utterance) -> an action, never a side effect:
//     {type: "start", widget: {name, head}}   command mode, "start writing in Summary" / "write in the note" (or d.start(ref) on a click)
//     {type: "stop"}                           dictation mode, "stop writing" / "done" (or d.stop() on the Escape key)
//     {type: "pass"}                           command mode: the utterance goes to the command pipeline (diagram or textedit, by fit)
//     {type: "command", reading, frame, info}  dictation mode: the textedit reading is executed (commands.js)
//     {type: "insert", pieces, chip?}          dictation mode: content; chip = the near-threshold offer to apply it as a command
//   d.insert(doc, pieces) writes content at the cursor (one transaction; replaces a selection); d.applyChip(doc, chip) takes the inserted
//   words back out (undo of that transaction, if it is still the last) and returns the command action.
//
// reader: anything with read(text) -> {status, margins, frame} (src/vss.js with the textedit model; a fake reader in the tests).
// table: the 'dictation' block of the textedit normalize.json (spoken punctuation and layout, start / stop phrases, the escape word).
// normalize: the textedit normalizer (textnorm.js); the reader reads the NORMALIZED command, content keeps the words as spoken.
// calibration: {threshold, chip_band} from command_threshold.json (training/worlds/textedit/calibrate.py). Without a threshold no
// reading is ever executed on its own: an ok reading is inserted as text with the chip (stated; safe before calibration).
//
// Decision (spec 14.3), with m = the minimum over every margin of the reading (the same quantity as calibrate.py):
//   command   status ok and m >= threshold
//   chip      status ok or abstain and threshold - chip_band <= m < threshold  (inserted as text, the chip offers the command)
//   text      otherwise (the user never loses words, and no command runs by surprise)
// Utterances decided before the reader: only spoken punctuation / layout ("comma", "new paragraph") -> content; any utterance with the
// escape word ("literally") -> content, the escape writes its next word as text ("literally comma" -> "comma").
export const DEFAULT_CHIP_BAND = 0.05;
const FILLER_EDGES = new Set(["please", "okay", "ok", "now", "so", "um", "uh"]);
const WIDGET_HEADS = new Set(["note", "card", "textbox", "widget", "box", "text", "comment", "caption"]);

export function minMargin(reading) {
  const vs = Object.values((reading && reading.margins) || {}).filter((x) => typeof x === "number" && !Number.isNaN(x));
  return vs.length ? Math.min(...vs) : 0;
}

export function decide(reading, calibration = null) {
  const thr = calibration && typeof calibration.threshold === "number" ? calibration.threshold : null;
  const band = calibration && typeof calibration.chip_band === "number" ? calibration.chip_band : DEFAULT_CHIP_BAND;
  const st = reading ? reading.status : "none"; const m = minMargin(reading);
  if (!reading) return { decision: "text", m, reason: "no textedit reader: content" };
  if (thr === null) {
    if (st === "ok") return { decision: "chip", m, reason: `status ok, but no calibrated command threshold: inserted as text, the chip offers the command` };
    return { decision: "text", m, reason: `status ${st}: content` };
  }
  if (st === "ok" && m >= thr) return { decision: "command", m, reason: `status ok and every margin >= ${thr} (min ${m.toFixed(3)}): a command` };
  if ((st === "ok" || st === "abstain") && m >= thr - band) return { decision: "chip", m, reason: `close to the command threshold (min margin ${m.toFixed(3)}, threshold ${thr}): inserted as text, the chip offers the command` };
  return { decision: "text", m, reason: st === "ok" ? `min margin ${m.toFixed(3)} under the command threshold ${thr}: content` : `status ${st}: content` };
}

const canon = (s) => String(s).toLowerCase().replace(/[.,!?;:]+(?=\s|$)/g, "").replace(/\s+/g, " ").trim();
function stripEdges(words) {
  let a = 0, z = words.length;
  while (a < z && FILLER_EDGES.has(words[a])) a++;
  while (z > a && FILLER_EDGES.has(words[z - 1])) z--;
  return words.slice(a, z);
}

export function createDictation({ reader = null, table, normalize = null, calibration = null } = {}) {
  const phrases = (xs) => xs.map((p) => p.split(" ")).sort((a, b) => b.length - a.length);
  const STARTS = phrases(table.start || []), STOPS = new Set((table.stop || []).map(canon));
  const ESC = table.escape || "literally";
  const SPOKEN = [...(table.marks || []).map(([w, t, a]) => ({ words: w.split(" "), piece: { kind: "mark", text: t, attach: a } })),
    ...(table.layout || []).map(([w, l]) => ({ words: w.split(" "), piece: { kind: "layout", layout: l } }))].sort((a, b) => b.words.length - a.words.length);
  const state = { mode: "command", widget: null };

  function startOf(words) {
    for (const p of STARTS) {
      if (p.every((w, k) => words[k] === w)) {
        let rest = words.slice(p.length); if (rest[0] === "in" || rest[0] === "into") rest = rest.slice(1);
        if (rest[0] === "the" || rest[0] === "my" || rest[0] === "a") rest = rest.slice(1);
        let head = null; if (rest.length && WIDGET_HEADS.has(rest[rest.length - 1])) head = rest.pop();
        return { name: rest.length ? rest.join(" ") : null, head };
      }
    }
    return null;
  }

  // spoken words -> pieces of content; returns {pieces, onlySpoken: true when every word was punctuation or layout}
  function transcribe(utterance) {
    const toks = String(utterance).split(/\s+/).filter(Boolean); const low = toks.map((t) => t.toLowerCase().replace(/[.,!?;:]+$/, ""));
    const pieces = []; let only = true, i = 0;
    while (i < toks.length) {
      if (low[i] === ESC && i + 1 < toks.length) { pieces.push({ kind: "word", text: toks[i + 1].replace(/[.,!?;:]+$/, "") }); only = false; i += 2; continue; }
      const hit = SPOKEN.find((s) => s.words.every((w, k) => low[i + k] === w));
      if (hit) { pieces.push({ ...hit.piece }); i += hit.words.length; continue; }
      const m = /^(.*?)([.,!?;:]+)$/.exec(toks[i]);            // the recogniser's own punctuation is kept
      if (m && m[1]) { pieces.push({ kind: "word", text: m[1] }); pieces.push({ kind: "mark", text: m[2], attach: "left" }); }
      else pieces.push({ kind: "word", text: toks[i] });
      only = false; i += 1;
    }
    return { pieces, onlySpoken: only && pieces.length > 0 };
  }

  function handle(utterance) {
    const c = canon(utterance); const words = stripEdges(c.split(" ").filter(Boolean));
    if (state.mode === "command") {
      const st = startOf(words);
      if (st) { state.mode = "dictation"; state.widget = st; return { type: "start", widget: st, reason: `start phrase: dictation into ${st.name ? `"${st.name}"` : st.head ? `the ${st.head}` : "the current text widget"}` }; }
      return { type: "pass", reason: "command mode: every utterance is a command (diagram or textedit, chosen by fit)" };
    }
    if (STOPS.has(words.join(" "))) { state.mode = "command"; state.widget = null; return { type: "stop", reason: "stop phrase: back to command mode" }; }
    const st = startOf(words);
    if (st) { state.widget = st; return { type: "start", widget: st, reason: "start phrase in dictation mode: writing moves to another widget" }; }
    const tr = transcribe(utterance);
    if (tr.onlySpoken) return { type: "insert", pieces: tr.pieces, reason: "spoken punctuation or layout only: content (not read)" };
    if (c.split(" ").includes(ESC)) return { type: "insert", pieces: tr.pieces, reason: `the escape word "${ESC}": content (not read)` };
    if (!reader) return { type: "insert", pieces: tr.pieces, reason: "no textedit reader loaded: content" };
    const n = normalize ? normalize(utterance) : { tokens: c.split(" "), info: { labels: {}, numbers: {} } };
    const reading = reader.read(n.tokens.join(" "));
    const d = decide(reading, calibration);
    if (d.decision === "command") return { type: "command", reading, frame: reading.frame, info: n.info, m: d.m, reason: d.reason };
    const act = { type: "insert", pieces: tr.pieces, reason: d.reason, m: d.m };
    if (d.decision === "chip") act.chip = { reading, frame: reading.frame, info: n.info, m: d.m, reason: d.reason, transactionId: null };
    return act;
  }

  // content at the cursor, one transaction. Spacing: a word gets a space before it unless it starts a block or follows an opening mark;
  // marks attach as the table says. Capitals: the first word of a block and the word after . ! ? get a capital first letter (the
  // recogniser's own capitals are kept).
  function insert(doc, pieces, chip = null) {
    const tr = doc.transact("dictation", () => {
      if (doc.hasSelection()) { const r = doc.selectionRange(); doc.deleteRange(r.from, r.to); }
      const start = doc.cursor; let pos = start;
      const prevChar = () => (pos > 0 ? doc.slice(pos - 1, pos) : "\n");
      const prevNonSpace = () => { const t = doc.slice(0, pos).replace(/[ \t\u201c(\["']+$/, ""); return t.length ? t[t.length - 1] : "\n"; };   // past opening marks
      let noSpaceNext = false;
      for (const p of pieces) {
        if (p.kind === "layout") {
          if (p.layout === "line" || p.layout === "paragraph") { doc.splitBlock(pos, p.layout); pos += 1; }
          else {
            const list = p.layout === "number" ? "numbered" : "bullet"; const b = doc.blocks[doc.locate(pos).block];
            if (b.text.length) { doc.splitBlock(pos, "line"); pos += 1; }
            doc.setBlocks(pos, pos, { type: "list_item", list, level: null });
          }
          noSpaceNext = false; continue;
        }
        if (p.kind === "mark") {
          let t = p.text; const pc = prevChar();
          if (p.attach === "left" || p.attach === "both") { /* no space before */ }
          else if (pc !== "\n" && pc !== " ") t = " " + t;
          doc.insertText(pos, t); pos += t.length; noSpaceNext = p.attach === "right" || p.attach === "both"; continue;
        }
        let w = p.text; const pc = prevChar(), pn = prevNonSpace();
        if (pn === "\n" || /[.!?]/.test(pn)) w = w.charAt(0).toUpperCase() + w.slice(1);
        const t = (pc === "\n" || pc === " " || noSpaceNext ? "" : " ") + w;
        doc.insertText(pos, t); pos += t.length; noSpaceNext = false;
      }
      doc.lastRange = { from: start, to: pos }; doc.setCursor(pos);
    });
    const last = doc.lastTransaction(); if (chip) chip.transactionId = last ? last.id : null;
    return { range: doc.lastRange ? { ...doc.lastRange } : null, transaction: last, tr };
  }

  function applyChip(doc, chip) {
    const last = doc.lastTransaction(); let undone = false;
    if (chip.transactionId !== null && last && last.id === chip.transactionId) { doc.undo(); undone = true; }
    return { type: "command", reading: chip.reading, frame: chip.frame, info: chip.info, undone,
      reason: undone ? "chip tapped: the inserted words are taken back and the reading is executed as a command" : "chip tapped: the text was changed since, so the inserted words stay; the reading is executed as a command" };
  }

  return {
    handle, transcribe, insert, applyChip, decide: (r) => decide(r, calibration),
    start(widget = null) { state.mode = "dictation"; state.widget = widget; return { type: "start", widget, reason: "click in a text widget" }; },
    stop() { state.mode = "command"; state.widget = null; return { type: "stop", reason: "Escape key" }; },
    get mode() { return state.mode; }, get widget() { return state.widget; },
  };
}
