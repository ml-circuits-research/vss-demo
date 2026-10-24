// form.js: the VSS form level (spec 12.4), an alternative corrector built with the same algebra as the reader. The written form of a word
// is the superposition of its letter trigrams (with word-boundary marks) bound to their positions; the positions are fractional powers
// of one base vector (a low-frequency band, so that position p and p + 1 stay similar and an inserted or deleted letter only shifts the
// code a little). A noisy token is encoded the same way and cleaned up against the form codes of the lexicon and of the diagram's labels,
// exactly as a role is read: the candidates come with cosines and a margin (top 1 minus top 2). For speech the same level encodes the
// trigrams of the phonetic key (Double Metaphone) instead of the letters, so one operation serves typing and pronunciation errors.
// The form codes are separate from the word identities of the reader, which stay random (spec 12.4).
//
// No training: the trigram vectors are portable stars (vss/stars.js, star_version 2) under the seed "form-v1", so the codes are the same
// in every browser and in Python if it is ever ported. Decisions are stated: a candidate is accepted when its cosine is >= ACCEPT, and the
// candidate's cost is 1 - cosine (always under 1), so the classic corrector's rules (protection, splits, joins, English words offered as
// alternatives, ties) apply unchanged around it.
//   const form = createFormIndex({ words: Object.keys(lexicon), labels, D: 512 });
//   form.candidates("dtabase")          -> [{word, cos, cost}, ...]   (typed: letters)
//   form.candidates("dayta", "speech")  -> phonetic-key trigrams
//   createCorrector({ lexicon, candidates: form.asCandidateFn() })   (app/src/correct.js with the form level as the candidate source)
import { starV2Phases } from "./vss/stars.js";
import { phoneticKeys } from "./correct.js";

export const FORM_SEED = "form-v1";
export const ACCEPT = 0.3;              // stated, not fitted: cosine below which no candidate is proposed (unrelated words: |cos| ~ 0.03 at D 512)
const BAND = 0.25;                      // position frequencies uniform in [-pi/4, pi/4]: cos(pos p, pos p+1) ~ 0.90, p+2 ~ 0.64

// the n-grams of a form: letter bigrams and trigrams with boundary marks, each with its position (bigrams keep short words readable:
// one edit in a three-letter word leaves a third of its trigrams but more of its bigrams)
export function trigrams(s) {
  const t = `#${s}#`, out = [];
  for (let i = 0; i + 3 <= t.length; i++) out.push([t.slice(i, i + 3), i]);
  for (let i = 0; i + 2 <= t.length; i++) out.push([t.slice(i, i + 2), i]);
  return out;
}

export function createFormIndex({ words = [], labels = [], D = 512 } = {}) {
  const omega = starV2Phases(FORM_SEED, "position", D).map((p) => p * BAND);
  const triCache = new Map();
  const tri = (g) => { let v = triCache.get(g); if (!v) { v = starV2Phases(FORM_SEED, "tri:" + g, D); triCache.set(g, v); } return v; };
  function encode(s) {
    const re = new Float32Array(D), im = new Float32Array(D); const gs = trigrams(s);
    gs.forEach(([g, p]) => { const ph = tri(g); for (let k = 0; k < D; k++) { const a = ph[k] + omega[k] * p; re[k] += Math.cos(a); im[k] += Math.sin(a); } });
    let n = 0; for (let k = 0; k < D; k++) n += re[k] * re[k] + im[k] * im[k]; n = Math.sqrt(n) || 1;
    for (let k = 0; k < D; k++) { re[k] /= n; im[k] /= n; }
    return { re, im };
  }
  const cos = (a, b) => { let s = 0; for (let k = 0; k < D; k++) s += a.re[k] * b.re[k] + a.im[k] * b.im[k]; return s; };
  const phon = (w) => phoneticKeys(w)[0] || w;
  const entries = new Map();               // word -> {letters, sound}
  const add = (w) => { if (!entries.has(w)) entries.set(w, { letters: encode(w.replace(/_/g, "")), sound: encode(phon(w)) }); };
  words.forEach(add); labels.forEach(add);

  function candidates(tok, mode = "typed", { k = 5, pool = null } = {}) {
    const q = mode === "speech" ? encode(phon(tok)) : encode(tok); const ql = mode === "speech" ? encode(tok) : q; const out = [];
    for (const [w, e] of entries) {
      if (pool && !pool.has(w)) continue;
      const c = cos(q, mode === "speech" ? e.sound : e.letters);
      // in speech mode a spelling term separates words with the same sound key (as the classic corrector does)
      const score = mode === "speech" ? c - 0.05 * (1 - cos(ql, e.letters)) : c;
      if (score >= ACCEPT) out.push({ word: w, cos: score });
    }
    out.sort((a, b) => b.cos - a.cos || (a.word < b.word ? -1 : 1));
    const top = out.slice(0, k); const margin = top.length > 1 ? top[0].cos - top[1].cos : top.length ? top[0].cos : 0;
    return top.map((c, i) => ({ word: c.word, cos: c.cos, cost: Math.round(1000 * (1 - c.cos)) / 1000, margin: i === 0 ? margin : 0 }));
  }
  return {
    D, encode, candidates, size: () => entries.size,
    setLabels(ls) { ls.forEach(add); },
    /** the candidate source for createCorrector: (tok, mode) -> [{word, cost}]; normalizer tokens (top_left) are never typed, so excluded */
    asCandidateFn() {
      return (tok, mode) => candidates(tok, mode).filter((c) => !(c.word.includes("_") && !labels.includes(c.word)));
    },
  };
}
