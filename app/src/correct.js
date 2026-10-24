// correct.js: the deterministic correctors of the VSS Diagram Editor (specification sections 12 and 13.2), no learning, no network.
//
// Input: the NORMALIZED tokens of one utterance (app/src/normalize.js, the same table as training/worlds/diagram/normalize.json).
// Output: { tokens, corrections, alternatives } where corrections = [{pos, from, to, op, cost, candidates}] and alternatives = up to
// maxVariants token sequences that differ in the homophones the spelling cannot decide (spec 12.3 / 13.2: the reader reads each variant
// and keeps the one with the clearest frame; this module never decides those).
//
// typed mode (spec 12.1): a token that is not in the lexicon, not a number, not protected, is compared with the lexicon of the world and
// the labels of the diagram by the optimal string alignment (OSA) variant of Damerau-Levenshtein, with substitutions between neighbouring
// QWERTY keys costing NEIGHBOUR_COST; tokens of up to 4 letters are corrected at cost <= 1, longer ones at cost <= 2; ties by frequency.
// A token that splits into two lexicon words is split; two tokens that join into a lexicon word are joined. A token that is a valid
// English word but not in the world is NOT corrected (it is reported as unknown by the reader, which is the honest answer); the English
// check is an injected function (isEnglish), served by Typo.js with the en_US Hunspell dictionary in the browser (app/vendor/typo/).
//
// speech mode (spec 13.2): the same, but candidates are matched by phonetic key (Double Metaphone, app/vendor/double-metaphone.js) and
// windows of one to three recognised tokens are matched against single lexicon words and the reverse ("a row" -> "arrow").
import { doubleMetaphone } from "../vendor/double-metaphone.js";

const QWERTY = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
const POS = {};
QWERTY.forEach((row, r) => [...row].forEach((c, i) => { POS[c] = [r, i]; }));
const NEIGHBOUR_COST = 0.5;
function subCost(a, b) {
  if (a === b) return 0;
  const pa = POS[a], pb = POS[b];
  if (pa && pb && Math.abs(pa[0] - pb[0]) <= 1 && Math.abs(pa[1] - pb[1]) <= 1) return NEIGHBOUR_COST;
  return 1;
}

// optimal string alignment distance with keyboard-weighted substitutions; stops early above `max`
export function osa(a, b, max = Infinity) {
  const n = a.length, m = b.length;
  if (Math.abs(n - m) > max) return Infinity;
  const d = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
  for (let i = 0; i <= n; i++) d[i][0] = i;
  for (let j = 0; j <= m; j++) d[0][j] = j;
  for (let i = 1; i <= n; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= m; j++) {
      let v = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + subCost(a[i - 1], b[j - 1]));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[i - 2][j - 2] + 1);
      d[i][j] = v; if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return Infinity;
  }
  return d[n][m];
}

// after the normalizer, spoken numbers are digits: "two" / "four" / "eight" arrive as 2 / 4 / 8, so the digits carry the homophones too
const HOMOPHONES = { "2": ["to"], "4": ["for"], "8": ["ate"], two: ["to", "too"], to: ["2", "too"], too: ["to", "2"], four: ["for"], for: ["4"], right: ["write"], write: ["right"],
  blue: ["blew"], blew: ["blue"], red: ["read"], read: ["red"], one: ["won"], won: ["one"], eight: ["ate"], ate: ["eight"], by: ["buy"], buy: ["by"],
  knew: ["new"], new: ["knew"], wood: ["would"], would: ["wood"], their: ["there"], there: ["their"] };

export function phoneticKeys(word) {
  const [p, s] = doubleMetaphone(word.replace(/_/g, ""));
  return p === s ? [p] : [p, s];
}

// lexicon: {word: frequency}; labels: [label tokens in the diagram]; protect: Set of tokens never corrected
// candidates (optional): (token, mode) -> [{word, cost}] replaces the built-in candidate search (the VSS form level, app/src/form.js, spec 12.4)
export function createCorrector({ lexicon, labels = [], isEnglish = () => false, labelIntro = ["called", "named", "labelled", "labeled", "titled", "saying"], candidates: candFn = null }) {
  const words = new Map(Object.entries(lexicon));
  const intro = new Set(labelIntro);
  let labelSet = new Set(labels);
  // phonetic index: key -> [words]
  const phon = new Map();
  const indexWord = (w) => { for (const k of phoneticKeys(w)) { if (!k) continue; if (!phon.has(k)) phon.set(k, []); phon.get(k).push(w); } };
  for (const w of words.keys()) indexWord(w);
  for (const l of labelSet) indexWord(l);
  const known = (t) => words.has(t) || labelSet.has(t);
  const freq = (t) => (words.get(t) || 0) + (labelSet.has(t) ? 1e6 : 0);   // labels in the diagram first: they are what the user refers to
  const isNumber = (t) => /^\d+$/.test(t);

  function typedCandidates(tok) {
    const max = tok.length <= 4 ? 1 : 2; const out = [];
    for (const w of [...words.keys(), ...labelSet]) {
      if (w.includes("_") && !labelSet.has(w)) continue;          // normalizer tokens (top_left, left_of) are produced, never typed
      const c = osa(tok, w, max); if (c <= max) out.push({ word: w, cost: c });
    }
    out.sort((a, b) => a.cost - b.cost || freq(b.word) - freq(a.word) || (a.word < b.word ? -1 : 1));
    return out.slice(0, 5);
  }
  function phoneticCandidates(tok) {
    // an exact key match costs 0.5, plus a small spelling term so that, among words that sound alike, the closest spelling comes first
    const out = new Map();
    for (const k of phoneticKeys(tok)) for (const w of phon.get(k) || []) out.set(w, Math.min(out.get(w) ?? 9, 0.5 + 0.1 * Math.min(osa(tok, w, 4), 4)));
    return [...out].map(([word, cost]) => ({ word, cost })).sort((a, b) => a.cost - b.cost || freq(b.word) - freq(a.word)).slice(0, 5);
  }
  function split(tok) {
    const ok = (x) => known(x) || isNumber(x);
    for (let i = 1; i < tok.length; i++) { const a = tok.slice(0, i), b = tok.slice(i); if (ok(a) && ok(b)) return [a, b]; }
    return null;
  }

  function correct(tokens, { mode = "typed", maxVariants = 4 } = {}) {
    const out = []; const corrections = []; const options = [];          // options: {pos, span, alt: [tokens]} applied to `out` for the variants
    const cand = candFn ? (t) => candFn(t, mode) : (t) => (mode === "speech" ? phoneticCandidates(t) : []).concat(mode === "speech" && phoneticCandidates(t).length ? [] : typedCandidates(t)).sort((a, b) => a.cost - b.cost);
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i], prev = tokens[i - 1];
      if (known(t) || isNumber(t) || /^[.,;:!?]$/.test(t) || (prev && intro.has(prev))) {
        if (mode === "speech" && HOMOPHONES[t]) for (const h of HOMOPHONES[t].filter((h) => known(h) || isNumber(h))) options.push({ pos: out.length, span: 1, alt: [h] });
        if (mode === "speech" && known(t) && i + 1 < tokens.length && known(tokens[i + 1])) {   // a wrong boundary between two known words ("a row")
          const cat = t + tokens[i + 1]; const pc = phoneticCandidates(cat).filter((c) => c.word.length >= cat.length - 1 && c.word !== t && c.word !== tokens[i + 1] && !c.word.startsWith(tokens[i + 1]) && !c.word.endsWith(tokens[i + 1]));
          if (pc.length && pc[0].cost <= 0.6) options.push({ pos: out.length, span: 2, alt: [pc[0].word] });
        }
        out.push(t); continue;
      }
      // joins: this token with the next one(s) is a lexicon word ("data base"; in speech mode by sound)
      let joined = null;
      for (let span = 3; span >= 2 && !joined; span--) {
        if (i + span > tokens.length) continue;
        const cat = tokens.slice(i, i + span).join("");
        if (known(cat)) joined = { word: cat, span, cost: 0.25 };
        else if (mode === "speech") { const pc = phoneticCandidates(cat); if (pc.length && pc[0].cost <= 0.6) joined = { word: pc[0].word, span, cost: pc[0].cost }; }
      }
      if (joined) { corrections.push({ pos: out.length, from: tokens.slice(i, i + joined.span).join(" "), to: joined.word, op: "join", cost: joined.cost, candidates: [] }); out.push(joined.word); i += joined.span - 1; continue; }
      const cands = cand(t);
      if (isEnglish(t)) {                                            // a real word outside the world: not corrected (spec 12.1) ...
        for (const c of cands.filter((c) => c.cost <= 1).slice(0, 2)) options.push({ pos: out.length, span: 1, alt: [c.word] });   // ... a close lexicon word is offered: the reader decides (12.3)
        out.push(t); continue;
      }
      const sp = split(t);
      if (sp) { corrections.push({ pos: out.length, from: t, to: sp.join(" "), op: "split", cost: 0.25, candidates: [] }); out.push(...sp); continue; }
      if (cands.length) {
        const best = cands[0]; const tie = cands.filter((c) => c.cost === best.cost).map((c) => c.word);
        corrections.push({ pos: out.length, from: t, to: best.word, op: "substitute", cost: best.cost, candidates: cands });
        for (const w of tie.slice(1, 3)) options.push({ pos: out.length, span: 1, alt: [w] });
        out.push(best.word);
      } else out.push(t);                                          // left as it is: the reader reports it as unknown
    }
    // variants: the corrected sequence, then each option alone, then pairs, up to maxVariants (the reader decides, spec 12.3)
    const apply = (opts) => { const v = out.slice(); for (const o of [...opts].sort((a, b) => b.pos - a.pos)) v.splice(o.pos, o.span, ...o.alt); return v; };
    const variants = [out];
    for (const o of options) { if (variants.length >= maxVariants) break; variants.push(apply([o])); }
    for (let x = 0; x < options.length && variants.length < maxVariants; x++)
      for (let y = x + 1; y < options.length && variants.length < maxVariants; y++)
        if (options[x].pos + options[x].span <= options[y].pos) variants.push(apply([options[x], options[y]]));
    return { tokens: out, corrections, alternatives: variants };
  }
  return { correct, setLabels(ls) { labelSet = new Set(ls); for (const l of labelSet) indexWord(l); }, typedCandidates, phoneticCandidates };
}
