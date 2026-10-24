// textnorm.js: the textedit world's normalizer in JavaScript, the exact port of training/worlds/textedit/normalize.py, driven by the same
// table (normalize.json; shipped as app/model/textedit/normalize.json by the export, passed in by src/assets.js).
// createTextNormalizer(table) -> normalize(text) -> {tokens, info} with info = {labels: {token: original text}, numbers: {token: value}}.
// Applied to COMMANDS only (what the textedit reader reads); dictated content keeps its words (dictation.js applies the table's
// 'dictation' block to content). Deterministic. app/tests/dictation.mjs checks it against the Python output (normalize_golden.jsonl).
// Steps: quoted strings -> one token; lower-case; contractions; punctuation split; multi-word expressions (longest first); single-word
// synonyms; number words to digits ('one' never); verb forms (a 'verb_forms' token with no world verb before it is the verb: 'bold the
// last word' -> 'embolden the last word'); after a match-intro word ('the word revenue') the next token is remembered as a piece of text.
export function createTextNormalizer(T) {
  const split = (s) => s.split(/\s+/).filter(Boolean);
  const MWE = T.mwe.map(([a, b]) => [split(a), split(b)]).sort((x, y) => y[0].length - x[0].length);
  const SYN = Object.fromEntries(Object.entries(T.synonyms).filter(([k]) => !k.includes(" ")));
  const NUM = T.number_words, NO_NUM = new Set(T.number_word_exceptions), INTRO = new Set(T.match_intro);
  const VFORM = T.verb_forms || {}, VERBS = new Set(T.verbs || []), PUNCT_CH = new Set([...T.punctuation]);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const PUNCT = new RegExp("([" + esc(T.punctuation) + "])(?=\\s|$)", "g");
  const labelToken = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "text";
  const isDigits = (t) => /^\d+$/.test(t);
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

  function numbers(toks, info) {
    const out = []; let i = 0;
    while (i < toks.length) {
      const t = toks[i];
      if (has(NUM, t) && !NO_NUM.has(t)) {
        let v = NUM[t], j = i + 1;
        if (v === 100 && out.length && isDigits(out[out.length - 1])) v = parseInt(out.pop(), 10) * 100;
        else if (v >= 20 && v <= 90 && j < toks.length && has(NUM, toks[j]) && NUM[toks[j]] >= 1 && NUM[toks[j]] <= 9 && !NO_NUM.has(toks[j])) { v += NUM[toks[j]]; j += 1; }
        out.push(String(v)); info.numbers[String(v)] = v; i = j; continue;
      }
      if (isDigits(t)) info.numbers[t] = parseInt(t, 10);
      out.push(t); i += 1;
    }
    return out;
  }

  function normalize(text) {
    const info = { labels: {}, numbers: {} };
    text = text.replace(/"([^"]+)"|'([^']+)'/g, (_, a, b) => { const s = a || b; const tok = labelToken(s); info.labels[tok] = s; return ` ${tok} `; });
    let s = text.toLowerCase();
    for (const [a, b] of Object.entries(T.contractions)) s = s.split(a).join(b);
    s = s.replace(PUNCT, " $1 ");
    let toks = split(s);
    const out = []; let i = 0;
    while (i < toks.length) {
      let hit = false;
      for (const [a, b] of MWE) {
        if (i + a.length <= toks.length && a.every((x, k) => toks[i + k] === x)) { out.push(...b); i += a.length; hit = true; break; }
      }
      if (!hit) { out.push(toks[i]); i += 1; }
    }
    toks = out.map((t) => (has(SYN, t) ? SYN[t] : t));
    toks = numbers(toks, info);
    let seenVerb = false;
    for (let k = 0; k < toks.length; k++) {
      if (has(VFORM, toks[k]) && !seenVerb) toks[k] = VFORM[toks[k]];
      if (VERBS.has(toks[k])) seenVerb = true;
    }
    for (let k = 0; k < toks.length - 1; k++) {
      const n = toks[k + 1];
      if (INTRO.has(toks[k]) && !has(info.labels, n) && !PUNCT_CH.has(n)) info.labels[n] = n;
    }
    return { tokens: toks, info };
  }
  // number words of a word sequence -> digits (used by commands.js to compare a match with the document's words, spec 14.4)
  normalize.numbers = (words) => numbers(words.map((w) => w.toLowerCase()), { labels: {}, numbers: {} });
  return normalize;
}
