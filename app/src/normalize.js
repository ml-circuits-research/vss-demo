// normalize.js: the diagram world's normalizer in JavaScript, the exact port of training/worlds/diagram/normalize.py, driven by the same
// table (normalize.json, copied to app/model/normalize.json by the export). createNormalizer(table) -> normalize(text) -> {tokens, info}
// with info = {labels: {token: original text}, numbers: {token: value}}. Deterministic. app/tests/normalize_test.mjs checks it against
// the Python output on every sentence of a generated world.
// The same code serves the Romanian table (training/worlds/diagram_ro/normalize.py, normalize_table.py): five rules that are optional in
// the table and absent from the English one, so the English normalization is unchanged: quote_marks (Romanian quotation marks to '"'),
// fold_diacritics (NFD, combining marks U+0300-U+036F dropped, also in label tokens), clitics (muta-l -> muta -l), mwe_genitive with
// genitive_endings (a phrase replaced only before a token with a genitive ending), number_joiners (douazeci si cinci -> 25).
export function createNormalizer(T) {
  const split = (s) => s.split(/\s+/).filter(Boolean);
  const byLen = (x, y) => y[0].length - x[0].length;
  const MWE = T.mwe.map(([a, b]) => [split(a), split(b)]).sort(byLen);
  const GEN = (T.mwe_genitive || []).map(([a, b]) => [split(a), split(b)]).sort(byLen);
  const GEN_END = T.genitive_endings || [];
  const SYN = Object.fromEntries(Object.entries(T.synonyms).filter(([k]) => !k.includes(" ")));
  const SYN_MULTI = Object.entries(T.synonyms).filter(([k]) => k.includes(" ")).map(([a, b]) => [split(a), split(b)]).sort(byLen);
  const NUM = T.number_words, NO_NUM = new Set(T.number_word_exceptions), INTRO = new Set(T.label_intro);
  const JOIN = new Set(T.number_joiners || []), CLITICS = T.clitics || [], FOLD = !!T.fold_diacritics, QM = Object.entries(T.quote_marks || {});
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const PUNCT = new RegExp("([" + esc(T.punctuation) + "])(?=\\s|$)", "g");
  const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const labelToken = (s) => { let x = s.toLowerCase(); if (FOLD) x = fold(x); return x.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "label"; };
  const isDigits = (t) => /^\d+$/.test(t);
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const isNum = (t) => t !== undefined && has(NUM, t);

  function numbers(toks, info) {
    const out = []; let i = 0;
    while (i < toks.length) {
      const t = toks[i];
      if (isNum(t) && !NO_NUM.has(t)) {
        let v = NUM[t], j = i + 1;
        if (v === 100 && out.length && isDigits(out[out.length - 1])) v = parseInt(out.pop(), 10) * 100;
        else if (v >= 20 && v <= 90 && j < toks.length && isNum(toks[j]) && NUM[toks[j]] >= 1 && NUM[toks[j]] <= 9 && !NO_NUM.has(toks[j])) { v += NUM[toks[j]]; j += 1; }
        else if (v >= 20 && v <= 90 && j + 1 < toks.length && JOIN.has(toks[j]) && isNum(toks[j + 1]) && NUM[toks[j + 1]] >= 1 && NUM[toks[j + 1]] <= 9 && !NO_NUM.has(toks[j + 1])) { v += NUM[toks[j + 1]]; j += 2; }
        out.push(String(v)); info.numbers[String(v)] = v; i = j; continue;
      }
      if (isDigits(t)) info.numbers[t] = parseInt(t, 10);
      out.push(t); i += 1;
    }
    return out;
  }

  function splitClitics(toks) {
    if (!CLITICS.length) return toks;
    const out = [];
    for (const t of toks) {
      const c = CLITICS.find((c) => t.length > c.length && t.endsWith(c));
      if (c) out.push(t.slice(0, t.length - c.length), c); else out.push(t);
    }
    return out;
  }

  return function normalize(text) {
    const info = { labels: {}, numbers: {} };
    for (const [a, b] of QM) text = text.split(a).join(b);
    text = text.replace(/"([^"]+)"|(?<![A-Za-z0-9])'([^']+)'(?![A-Za-z0-9])/g, (_, a, b) => { const s = a || b; const tok = labelToken(s); info.labels[tok] = s; return ` ${tok} `; });
    let s = text.toLowerCase();
    if (FOLD) s = fold(s);
    for (const [a, b] of Object.entries(T.contractions)) s = s.split(a).join(b);
    s = s.replace(PUNCT, " $1 ");
    let toks = splitClitics(split(s));
    if (GEN.length) {
      const out = []; let i = 0;
      while (i < toks.length) {
        let hit = false;
        for (const [a, b] of GEN) {
          const k = i + a.length;
          if (k < toks.length && a.every((x, m) => toks[i + m] === x) && GEN_END.some((e) => toks[k].endsWith(e))) { out.push(...b); i = k; hit = true; break; }
        }
        if (!hit) { out.push(toks[i]); i += 1; }
      }
      toks = out;
    }
    for (const table of [MWE, SYN_MULTI]) {
      const out = []; let i = 0;
      while (i < toks.length) {
        let hit = false;
        for (const [a, b] of table) {
          if (a.every((x, k) => toks[i + k] === x)) { out.push(...b); i += a.length; hit = true; break; }
        }
        if (!hit) { out.push(toks[i]); i += 1; }
      }
      toks = out;
    }
    toks = toks.map((t) => (has(SYN, t) ? SYN[t] : t));
    toks = numbers(toks, info);
    for (let i = 0; i < toks.length - 1; i++) if (INTRO.has(toks[i]) && !(toks[i + 1] in info.labels)) info.labels[toks[i + 1]] = toks[i + 1];
    return { tokens: toks, info };
  };
}
