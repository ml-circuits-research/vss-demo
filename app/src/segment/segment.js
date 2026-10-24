// segment.js: the segmenter (spec 15.1, and 15.4 at clause level). It runs after the normalizer and before the reader: the normalized
// tokens of a paragraph (or of one long sentence) are cut into units of meaning, each unit is read by the injected reader, and a wrong cut
// is found by the reading, not guessed: a unit whose reading is poor is merged with a neighbour or split at a weaker cut and read again,
// and among the segmentations tried the clearest one is kept. DOM-free and deterministic; every decision carries its reason as text.
//
//   import { segment, readerAdapter } from "./segment/segment.js";
//   const r = segment(tokens, { reader, info });       // reader: { read(text) -> reader result, kind?(token), gates?(tokens) }
//   r.segments: [{ i, start, end, text, connective: {op, words, cls, attach} | null, reading, poor, sentence, role }]
//   r.ambiguous, r.alternatives (a second segmentation the rule cannot separate from the first), r.explain, r.reads
//
// Cut signals, in this order of strength:
//   1. sentence punctuation (. ! ? ;): always a cut; the period stays with the unit it ends (the reader was trained with it);
//   2. a connective (CONNECTIVES): coordinators (and, then, and then, also), discourse connectives (because, so, but, after that,
//      before that) and subordinators (if, when, unless, says that). At the start of a sentence it only opens the unit. Inside a sentence
//      it is a cut where the reader's gate is open after it (reader.gates, when the model exposes them); without gates, where a command
//      starts after it by the kinds (a VERB after optional FILLER / negation words): a STRONG cut. Otherwise it is a WEAK cut, tried only
//      when the reading asks for it, so a conjunction inside an entity ("connect the box and the cache") is not cut;
//   3. a comma: strong when a command starts after it and the text since the last cut already has a verb; weak otherwise ("in the top
//      left , add a box" is one command).
// The stated rule for choosing (the one of spelling and speech alternatives, spec 12.3 / 13.3, one level up): fewer tokens in poor units,
// then the highest minimum margin over the units read well, then the smallest total residual, then fewer units.

export const CONNECTIVES = [   // [normalized words, operator, class]; longest match first
  [["and", "after", "that"], "then", "discourse"], [["and", "before", "that"], "before", "discourse"], [["and", "then"], "then", "conj"],
  [["and", "also"], "and", "conj"], [["after", "that"], "then", "discourse"], [["before", "that"], "before", "discourse"],
  [["says", "that"], "says", "sub"], [["if", "you"], "if", "sub"], [["when", "you"], "if", "sub"], [["unless", "you"], "unless", "sub"],
  [["and"], "and", "conj"], [["then"], "then", "conj"], [["also"], "and", "conj"], [["because"], "because", "discourse"],
  [["so"], "so", "discourse"], [["but"], "but", "discourse"], [["if"], "if", "sub"], [["when"], "if", "sub"], [["unless"], "unless", "sub"],
].sort((a, b) => b[0].length - a[0].length);
export const SENTENCE_END = new Set([".", "!", "?", ";"]);
const KEEP_END = new Set([".", "?"]);
// the diagram world's kinds (training/worlds/diagram/generate.py): an action word, and the words that may precede it in a command
export const DEFAULT_COMMAND_KINDS = { verb: ["VERB"], skip: ["FILLER", "do", "not", "never", "to"] };
// the roles without which a frame of the event says nothing (a frame without them is a poor reading); events not listed: no check
export const CORE_ROLES = { create: ["object"], place: ["object"], delete: ["object"], move: ["object"], change: ["object"], resize: ["object"],
  connect: ["source"], name: ["object"], copy: ["object"], group: ["object"], ungroup: ["object"], align: ["object"], distribute: ["object"],
  front: ["object"], back: ["object"] };
const POOR_STATUS = new Set(["no-sense", "abstain", "unknown-event"]);

/** an adapter for the browser reader (src/vss.js): kinds from its lexicon, gates when the legend names level openers */
export function readerAdapter(vss, opts = {}) {
  const rd = vss.reader;
  const ad = { read: (text) => vss.read(text, opts.readOpts || {}), kind: (t) => (rd && rd.kind ? rd.kind(t) : null) };
  const ops = rd && rd.legend && rd.legend.reader && rd.legend.reader.level_openers;
  if (ops && ops.length && rd.rb && rd.rb.catId) {
    ad.gates = (tokens) => tokens.map((t) => { const k = rd.kind(t); if (k === null || !rd.rb.catId.has(k)) return 0; return 1 / (1 + Math.exp(-rd.rb.logits.data[rd.rb.catId.get(k)])); });
  }
  return ad;
}

function matchConnective(tokens, i) {
  for (const [ws, op, cls] of CONNECTIVES) {
    if (i + ws.length > tokens.length) continue;
    let ok = true; for (let k = 0; k < ws.length; k++) if (tokens[i + k] !== ws[k]) { ok = false; break; }
    if (ok) return { words: ws, op, cls };
  }
  return null;
}

/** does a command start at token i? (kinds: optional skip-kind words, then a verb) */
export function commandStarts(tokens, i, kind, ck = DEFAULT_COMMAND_KINDS) {
  if (!kind) return false;
  const skip = new Set(ck.skip), verb = new Set(ck.verb);
  for (let j = i; j < tokens.length && j < i + 8; j++) {
    const k = kind(tokens[j]);
    if (verb.has(k)) return true;
    if (!skip.has(k) && !skip.has(tokens[j])) return false;
  }
  return false;
}

/** the candidate cuts of a token list; each {at, next, op, words, cls, strong, reason, punct, sentenceStart} where the left unit ends at
 *  `at` (exclusive, before any comma or connective) and the right one starts at `next` */
export function candidateCuts(tokens, opts = {}) {
  const kind = opts.kind || null, ck = opts.commandKinds || DEFAULT_COMMAND_KINDS, gates = opts.gates || null;
  const verbs = new Set(ck.verb);
  const cuts = []; let lead = null; let segStart = 0; let sawVerb = false;
  const gateOpen = (j) => gates && ((gates[j] ?? 0) >= 0.5 || (gates[j + 1] ?? 0) >= 0.5);
  const startsCmd = (j) => commandStarts(tokens, j, kind, ck);
  // a connective right at the start of a sentence opens the unit
  const leading = (j) => {
    const m = matchConnective(tokens, j);
    if (!m) return null;
    if (m.op === "so" && j > 0 && tokens[j - 1] === "okay") return null;
    if (m.op === "so" && !startsCmd(j + 1)) return null;
    if (m.op === "says") return null;
    let n = j + m.words.length; if (tokens[n] === ",") n++;
    return { ...m, next: n };
  };
  { const m = leading(0); if (m) { lead = { op: m.op, words: m.words, cls: m.cls, next: m.next }; segStart = m.next; } }
  for (let i = segStart; i < tokens.length; i++) {
    const t = tokens[i];
    if (kind && verbs.has(kind(t))) sawVerb = true;
    if (SENTENCE_END.has(t)) {
      if (i === tokens.length - 1) break;
      let next = i + 1; const m = leading(next);
      const cut = { at: KEEP_END.has(t) ? i + 1 : i, next, op: null, words: [], cls: "punct", strong: true, punct: t, sentenceStart: true, reason: `sentence punctuation "${t}"` };
      if (m) { cut.op = m.op; cut.words = m.words; cut.cls = m.cls; cut.next = m.next; cut.reason += `, then the connective "${m.words.join(" ")}"`; }
      cuts.push(cut); i = cut.next - 1; sawVerb = false; continue;
    }
    const comma = t === ",";
    const ci = comma ? i + 1 : i;
    const m = matchConnective(tokens, ci);
    if (m && !(m.op === "so" && ci > 0 && tokens[ci - 1] === "okay")) {
      let next = ci + m.words.length; if (tokens[next] === ",") next++;
      const gate = gateOpen(ci), cmd = startsCmd(next);
      const sub = m.cls === "sub";
      let strong, reason;
      if (gates) { strong = gate; reason = gate ? `the gate opens at "${m.words.join(" ")}"` : `the gate is closed at "${m.words.join(" ")}"`; }
      else if (m.op === "says") { strong = true; reason = `"says that" opens a report`; }
      else { strong = cmd; reason = cmd ? `"${m.words.join(" ")}" and a command starts after it` : `"${m.words.join(" ")}" without a command after it`; }
      if (m.op === "so" && !strong) { if (comma) { /* a plain comma */ } else continue; }
      else { cuts.push({ at: i, next, op: m.op, words: m.words, cls: m.cls, strong, sub, reason }); i = next - 1; sawVerb = false; continue; }
    }
    if (comma) {
      const cmd = startsCmd(i + 1);
      const strong = cmd && sawVerb && !gates ? true : gates ? gateOpen(i) && cmd : false;
      cuts.push({ at: i, next: i + 1, op: null, words: [], cls: "comma", strong, reason: strong ? "a comma, a command before it and one after it" : "a comma (weak)" });
      sawVerb = false;
    }
  }
  return { cuts, lead };
}

/** the segments of a token list for the chosen cuts (indices into cuts); each segment remembers the cut that opened and closed it */
function segmentsFor(tokens, cuts, chosen, lead) {
  const segs = []; let start = lead ? lead.next : 0; let open = lead ? { op: lead.op, words: lead.words, cls: lead.cls } : null;
  let openCut = -1, sentence = 0, sentStart = true;
  const push = (end, closeCut) => {
    const rawStart = start, rawEnd = end;
    let e = end; while (e > start && tokens[e - 1] === ",") e--;
    let s = start; while (s < e && tokens[s] === ",") s++;
    const content = tokens.slice(s, e); const punctEnd = KEEP_END.has(content[content.length - 1]) ? 1 : 0;
    segs.push({ start: s, end: e - punctEnd, rawStart, rawEnd, tokens: content, text: content.join(" "), connective: open ? { ...open } : null, sentence,
      sentenceStart: sentStart, openCut, closeCut });
  };
  for (const k of chosen) {
    const c = cuts[k]; push(c.at, k); start = c.next; open = c.op ? { op: c.op, words: c.words, cls: c.cls } : null; openCut = k;
    if (c.cls === "punct") { sentence++; sentStart = true; } else sentStart = false;
  }
  push(tokens.length, -1);
  // attachment: a subordinator that opens a sentence attaches its unit to the next unit of the sentence; every other connective to the
  // previous unit; "says that": the unit before it is the speaker
  segs.forEach((s, i) => {
    s.i = i; s.role = "command";
    if (!s.connective) return;
    const c = s.connective;
    if ((c.op === "if" || c.op === "unless") && s.sentenceStart && i + 1 < segs.length && segs[i + 1].sentence === s.sentence) c.attach = i + 1;
    else c.attach = i - 1 >= 0 ? i - 1 : null;
    if (c.op === "says" && i > 0) { segs[i - 1].role = "speaker"; c.speaker = segs[i - 1].text; }
  });
  return segs;
}

export function minMargin(reading) {
  const vs = Object.values((reading && reading.margins) || {}).filter((x) => typeof x === "number" && Number.isFinite(x));
  return vs.length ? Math.min(...vs) : (reading && reading.status === "ok" ? 1 : 0);
}

/** why a reading is poor, or null (spec 15.1: status no-sense or abstain, core roles empty, a large residual) */
export function poorReason(reading, opts = {}) {
  if (!reading) return "not read";
  if (POOR_STATUS.has(reading.status)) return `status ${reading.status}`;
  const fr = reading.frame || {}; const core = (opts.coreRoles || CORE_ROLES)[fr.event];
  if (core && core.some((r) => !fr.roles || !fr.roles[r])) return `core role empty (${core.filter((r) => !fr.roles || !fr.roles[r]).join(", ")})`;
  const maxRes = opts.maxResidual ?? 0.5;
  if (typeof reading.residual === "number" && reading.residual > maxRes) return `residual ${reading.residual.toFixed(3)} above ${maxRes}`;
  return null;
}

function scoreOf(segs) {
  let poorTok = 0, minM = Infinity, res = 0, good = 0;
  for (const s of segs) {
    if (s.role !== "command") continue;
    if (s.poor) poorTok += Math.max(1, s.tokens.length); else { good++; minM = Math.min(minM, minMargin(s.reading)); }
    if (s.reading && typeof s.reading.residual === "number") res += s.reading.residual;
  }
  return { poorTok, minMargin: good ? minM : -1, residual: res, n: segs.length };
}
/** the stated rule: negative when a is clearer than b */
export function compareScores(a, b, eps = 1e-9) {
  if (a.poorTok !== b.poorTok) return a.poorTok - b.poorTok;
  if (Math.abs(a.minMargin - b.minMargin) > eps) return b.minMargin - a.minMargin;
  if (Math.abs(a.residual - b.residual) > eps) return a.residual - b.residual;
  return a.n - b.n;
}

/**
 * tokens (normalized) -> segmentation. opts: {reader, kind?, gates?, commandKinds?, coreRoles?, maxResidual?, maxRounds?, tieMargin?}
 * The reader is called once per distinct unit text (cached).
 */
export function segment(tokens, opts = {}) {
  const reader = opts.reader; if (!reader || !reader.read) throw new Error("segment: a reader with read(text) is needed");
  const kind = opts.kind || (reader.kind ? (t) => reader.kind(t) : null);
  const gates = opts.gates || (reader.gates ? reader.gates(tokens) : null);
  const { cuts, lead } = candidateCuts(tokens, { kind, gates, commandKinds: opts.commandKinds });
  const cache = opts.cache || new Map(); let reads = 0; const explain = [];
  const readText = (text) => {
    if (!cache.has(text)) { reads++; cache.set(text, reader.read(text)); }
    return cache.get(text);
  };
  const evaluate = (mask) => {
    const chosen = cuts.map((_, k) => k).filter((k) => mask[k]);
    const segs = segmentsFor(tokens, cuts, chosen, lead);
    for (const s of segs) {
      if (s.role !== "command") { s.reading = null; s.poor = null; continue; }
      if (!s.tokens.length) { s.reading = null; s.poor = "empty unit"; continue; }
      s.reading = readText(s.text); s.poor = poorReason(s.reading, opts);
    }
    return { mask, segs, score: scoreOf(segs) };
  };
  const key = (mask) => mask.map((b) => (b ? 1 : 0)).join("");
  const seen = new Map();
  const ev = (mask) => { const k = key(mask); if (!seen.has(k)) seen.set(k, evaluate(mask)); return seen.get(k); };
  let cur = ev(cuts.map((c) => c.strong));
  explain.push(`cuts: ${cuts.filter((c) => c.strong).length} strong, ${cuts.filter((c) => !c.strong).length} weak; ${cur.segs.length} unit(s) at first`);
  const maxRounds = opts.maxRounds ?? 24;
  for (let round = 0; round < maxRounds; round++) {
    const poor = cur.segs.filter((s) => s.poor && s.role === "command");
    if (!poor.length) break;
    // neighbours: toggle a cut at the edge of a poor unit (merge with a neighbour) or a weak cut inside it (split)
    const toggles = new Set();
    for (const sg of poor) {
      if (sg.openCut >= 0) toggles.add(sg.openCut);                   // merge with the previous unit
      if (sg.closeCut >= 0) toggles.add(sg.closeCut);                 // merge with the next unit
      cuts.forEach((c, k) => { if (!cur.mask[k] && c.at >= sg.rawStart && c.next <= sg.rawEnd) toggles.add(k); });   // split at a cut inside
    }
    let best = null;
    for (const k of [...toggles].sort((a, b) => a - b)) {
      const m = cur.mask.slice(); m[k] = !m[k]; const cand = ev(m);
      if (compareScores(cand.score, cur.score) < 0 && (!best || compareScores(cand.score, best.score) < 0)) best = cand;
    }
    if (!best) break;
    const changed = best.mask.map((b, k) => (b !== cur.mask[k] ? k : -1)).filter((k) => k >= 0);
    for (const k of changed) explain.push(`${best.mask[k] ? "cut" : "merged"} at "${tokens.slice(Math.max(0, cuts[k].at - 2), cuts[k].next + 2).join(" ")}" (${cuts[k].reason}): the reading is clearer`);
    cur = best;
  }
  // the runner-up: a different segmentation tried whose score the rule cannot separate from the chosen one
  const tie = opts.tieMargin ?? 1e-6; let alt = null;
  for (const c of seen.values()) {
    if (c === cur || c.score.poorTok !== cur.score.poorTok || cur.score.poorTok > 0) continue;
    if (Math.abs(c.score.minMargin - cur.score.minMargin) <= tie && Math.abs(c.score.residual - cur.score.residual) <= tie) { alt = c; break; }
  }
  for (const s of cur.segs) if (s.poor && s.role === "command") explain.push(`unit "${s.text}" stays unread: ${s.poor}`);
  if (alt) explain.push("two segmentations read equally clearly: shown to the user as two readings to choose from");
  const finish = (c) => c.segs.map((s, i) => ({ i, start: s.start, end: s.end, text: s.text, tokens: s.tokens, connective: s.connective || null, reading: s.reading,
    poor: s.poor, sentence: s.sentence, role: s.role }));
  return { tokens, segments: finish(cur), score: cur.score, ambiguous: !!alt, alternatives: alt ? [finish(alt)] : [], cuts, explain, reads, tried: seen.size };
}
