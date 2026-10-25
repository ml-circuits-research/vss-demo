// translate.js: the dictionary path (variant C of the languages design): a GIVEN word-to-English dictionary replaces words mechanically
// before the English reader reads the sentence. No training: a language gets this path as soon as it has a dictionary
// (training/worlds/DICTIONARIES.md), and "Romglish" (English grammar with words of another language) is covered by it directly.
// It does not learn the other language's word order: that is what a trained world of the language (diagram_ro) is for, and the two are
// compared on the same parallel set (training/TODO_DGX.md 2.6).
//
// Dictionary: {language, target_world, entries: {"<folded key, words separated by spaces>": ["<english tokens>", "<alternative>", ...]}}.
// Rules, stated: the input is folded (lower case, diacritics to ASCII) and split on spaces; keys are matched longest first, left to right;
// a token that matches no key is kept as it is (English words, labels, numbers pass through); an entry with several values gives
// alternatives, and the sentence variants are the cross product capped at `maxVariants` (first values first); the reader reads every
// variant and the editor keeps the clearest frame (speech.js chooseClearest), so the dictionary never decides an ambiguity itself.
// Labels after an intro word ("numita comenzi", "called orders") are not translated.
//   const t = createTranslator(dict);  t.translate("pune o nota galbena sub baza de date") -> {variants: [[tokens]], replaced: [...], unknown}

export function fold(s) {
  return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[şș]/gi, "s").replace(/[ţț]/gi, "t").toLowerCase();
}

const INTRO = new Set(["called", "named", "labelled", "labeled", "titled", "numit", "numita", "numiti", "numite", "denumit", "denumita", "etichetat", "etichetata"]);

export function createTranslator(dict, { maxVariants = 8, intro = INTRO } = {}) {
  const entries = new Map(); let maxLen = 1;
  for (const [k, v] of Object.entries(dict.entries || {})) {
    const key = fold(k).split(/\s+/).filter(Boolean); if (!key.length) continue;
    entries.set(key.join(" "), (Array.isArray(v) ? v : [v]).map((x) => String(x).split(/\s+/).filter(Boolean)));
    maxLen = Math.max(maxLen, key.length);
  }
  function translate(text) {
    const split = (x) => x.replace(/([.,;:!?])(?=\s|$)/g, " $1 ").split(/\s+/).filter(Boolean);
    const raw = split(String(text)); const toks = split(fold(text));          // same splitting: raw[i] is toks[i] before folding
    const slots = []; const replaced = []; let i = 0; let protect = false;
    while (i < toks.length) {
      if (protect) { slots.push([[raw[i] ?? toks[i]]]); protect = false; i++; continue; }      // a label keeps its spelling
      let hit = null;
      for (let n = Math.min(maxLen, toks.length - i); n >= 1 && !hit; n--) { const k = toks.slice(i, i + n).join(" "); if (entries.has(k)) hit = { k, n, vals: entries.get(k) }; }
      if (hit) {
        slots.push(hit.vals); replaced.push({ at: i, from: hit.k, to: hit.vals.map((v) => v.join(" ")) });
        if (hit.vals.some((v) => v.length && intro.has(v[v.length - 1]))) protect = true;
        i += hit.n;
      } else { slots.push([[toks[i]]]); if (intro.has(toks[i])) protect = true; i++; }
    }
    // cross product, first values first, capped
    let variants = [[]];
    for (const opts of slots) {
      const next = [];
      for (const v of variants) for (const o of opts) { if (next.length >= maxVariants) break; next.push(v.concat(o)); }
      variants = next;
    }
    return { variants, replaced, ambiguous: slots.filter((o) => o.length > 1).length, tokens: toks };
  }
  return { translate, language: dict.language || "?", size: entries.size, target: dict.target_world || "diagram" };
}
