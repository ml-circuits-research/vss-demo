// normalize.js: the diagram world's normalizer in JavaScript, the exact port of training/worlds/diagram/normalize.py, driven by the same
// table (normalize.json, copied to app/model/normalize.json by the export). createNormalizer(table) -> normalize(text) -> {tokens, info}
// with info = {labels: {token: original text}, numbers: {token: value}}. Deterministic. app/tests/normalize_test.mjs checks it against
// the Python output on every sentence of a generated world.
export function createNormalizer(T) {
  const split = (s) => s.split(/\s+/).filter(Boolean);
  const MWE = T.mwe.map(([a, b]) => [split(a), split(b)]).sort((x, y) => y[0].length - x[0].length);
  const SYN = Object.fromEntries(Object.entries(T.synonyms).filter(([k]) => !k.includes(" ")));
  const SYN_MULTI = Object.entries(T.synonyms).filter(([k]) => k.includes(" ")).map(([a, b]) => [split(a), split(b)]).sort((x, y) => y[0].length - x[0].length);
  const NUM = T.number_words, NO_NUM = new Set(T.number_word_exceptions), INTRO = new Set(T.label_intro);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const PUNCT = new RegExp("([" + esc(T.punctuation) + "])(?=\\s|$)", "g");
  const labelToken = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "label";
  const isDigits = (t) => /^\d+$/.test(t);

  function numbers(toks, info) {
    const out = []; let i = 0;
    while (i < toks.length) {
      const t = toks[i];
      if (t in NUM && !NO_NUM.has(t)) {
        let v = NUM[t], j = i + 1;
        if (v === 100 && out.length && isDigits(out[out.length - 1])) v = parseInt(out.pop(), 10) * 100;
        else if (v >= 20 && v <= 90 && j < toks.length && toks[j] in NUM && NUM[toks[j]] >= 1 && NUM[toks[j]] <= 9 && !NO_NUM.has(toks[j])) { v += NUM[toks[j]]; j += 1; }
        out.push(String(v)); info.numbers[String(v)] = v; i = j; continue;
      }
      if (isDigits(t)) info.numbers[t] = parseInt(t, 10);
      out.push(t); i += 1;
    }
    return out;
  }

  return function normalize(text) {
    const info = { labels: {}, numbers: {} };
    text = text.replace(/"([^"]+)"|(?<![A-Za-z0-9])'([^']+)'(?![A-Za-z0-9])/g, (_, a, b) => { const s = a || b; const tok = labelToken(s); info.labels[tok] = s; return ` ${tok} `; });
    let s = text.toLowerCase();
    for (const [a, b] of Object.entries(T.contractions)) s = s.split(a).join(b);
    s = s.replace(PUNCT, " $1 ");
    let toks = split(s);
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
    toks = toks.map((t) => (Object.prototype.hasOwnProperty.call(SYN, t) ? SYN[t] : t));
    toks = numbers(toks, info);
    for (let i = 0; i < toks.length - 1; i++) if (INTRO.has(toks[i]) && !(toks[i + 1] in info.labels)) info.labels[toks[i + 1]] = toks[i + 1];
    return { tokens: toks, info };
  };
}
