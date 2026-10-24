// parse.js: the deterministic REFERENCE reader of spoken formulas and matheditor commands (spec 16.2-16.4), DOM-free.
// Uses: (1) the generator of the matheditor world builds its gold with it (training/worlds/matheditor/parse_batch.mjs), (2) the tests,
// (3) the app, ONLY when no matheditor model is loaded, and then every result says so (source: "reference parser").
// It is not the VSS reader: it is a hand-written grammar with the scope rule below, stated so that the gold is checkable.
//
// THE SCOPE RULE (spec 16.3), stated:
//  - Precedence, loosest first: implies < relations (equals, less than, greater than, approximately) < plus, minus < times, tight "over"
//    < juxtaposition ("two x") < "to the" < "sub" < "squared" / "cubed". Left-associative except "to the" (right-associative).
//  - Five constructs have an OPEN scope that the words may leave undecided: the denominator of "over" / "divided by", the numerator of
//    "over" (the last term, or everything before it), the exponent of "to the [power of]", the argument of a function or root ("sine of",
//    "the square root of", "the absolute value of") and the body of "the sum / product from ... to ... of". For each undecided scope
//    there are two readings: TIGHT (the next / previous single term: a product of juxtaposed factors for "over" and functions, one
//    factor for an exponent) and WIDE (everything up to the end of the enclosing group, or back to its start for the numerator).
//    Every combination is tried; the distinct trees are the readings, in the order tight-first.
//  - What decides a scope: "all over" (numerator wide); "the fraction A over B" and "the fraction with numerator A and denominator B"
//    (numerator = A); a closer, which makes the operand exactly what precedes it: "end fraction", "end exponent", "end root",
//    "end sub", "end sum", "end product", "end absolute value" (a closer closes the NEAREST not yet closed construct of its kind in
//    the same bracket group, so "a over b over c end fraction" closes "b over c"); "all squared" / "all cubed" (the whole group
//    before it is the base);
//    a pause (",") closes every open scope at that point; "the quantity ... end quantity" groups without a visible bracket;
//    "open parenthesis ... close parenthesis" groups WITH a bracket node, except right after a function or root opener, where the
//    brackets are the operator's own ("sine of open parenthesis x close parenthesis" = sin(x)).
//  - Not ambiguous by this rule: juxtaposition binds tighter than "over" ("one over two x" = 1/(2x)); "squared" applies to the
//    preceding factor; "sub" takes one factor unless closed by "end sub"; "minus" at the start of an operand is negation and covers a
//    product ("minus two x" = -(2x)).
// A reading never comes from guessing: zero readings is status "no-parse" with the reason; two or more is status "ambiguous".

import { node, num, vr, cst, equal, canonical, GREEK, LATIN, FUNCTIONS, CONSTANTS } from "./tree.js";

export const SOURCE = "reference parser";
export const VARIABLES = LATIN.concat(GREEK);

// ---------------------------------------------------------------- normalization (the _text of the world's sentences)
const UNITS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const LETTER_NAMES = { ex: "x", why: "y", zee: "z", zed: "z", ay: "a", bee: "b", cee: "c", en: "n", em: "m", kay: "k", tee: "t", eye: "i",
  jay: "j", pee: "p", cue: "q", ess: "s", vee: "v", dee: "d" };
const WORD_MAP = { sine: "sin", cosine: "cos", tangent: "tan", logarithm: "log", "let's": "lets", nth: "n th", ith: "i th", kth: "k th",
  "double-you": "w" };
/** surface text -> normalized tokens: lowercase, punctuation split (a comma is a pause, final . ! ? dropped), number words -> digits,
 *  spoken letter names -> letters, function names -> their short names ("sine" -> "sin"), "natural log" -> "ln", "double you" -> "w" */
export function normalize(text) {
  let s = String(text).toLowerCase().replace(/[’`]/g, "'").replace(/[;:!?]/g, " ").replace(/,/g, " , ").replace(/\.(?=\s|$)/g, " ");
  const raw = s.split(/\s+/).filter(Boolean).flatMap((w) => (WORD_MAP[w] || w).split(" "));
  const out = [];
  for (let i = 0; i < raw.length; i++) {
    const w = raw[i], n = raw[i + 1];
    if (TENS[w] !== undefined) { if (n && UNITS[n] !== undefined && UNITS[n] > 0 && UNITS[n] < 10) { out.push(String(TENS[w] + UNITS[n])); i++; } else out.push(String(TENS[w])); continue; }
    if (UNITS[w] !== undefined) { out.push(String(UNITS[w])); continue; }
    if (w === "natural" && (n === "log" || n === "logarithm")) { out.push("ln"); i++; continue; }
    if (w === "double" && n === "you") { out.push("w"); i++; continue; }
    if (LETTER_NAMES[w]) { out.push(LETTER_NAMES[w]); continue; }
    out.push(w);
  }
  return out;
}

// ---------------------------------------------------------------- lexer: normalized tokens -> typed tokens
const P = (s, t, v) => [s.split(" "), t, v];
const PHRASES = [
  P("open parenthesis", "OPEN"), P("open paren", "OPEN"), P("left parenthesis", "OPEN"), P("left paren", "OPEN"), P("open bracket", "OPEN"),
  P("close parenthesis", "CLOSE"), P("close paren", "CLOSE"), P("right parenthesis", "CLOSE"), P("right paren", "CLOSE"), P("close bracket", "CLOSE"),
  P("the quantity", "QTY"), P("end of the quantity", "END_QTY"), P("end of quantity", "END_QTY"), P("end quantity", "END_QTY"),
  P("the fraction with numerator", "FRAC_NUM"), P("and the denominator", "AND_DEN"), P("and denominator", "AND_DEN"), P("the fraction", "FRAC_OPEN"),
  P("end of the fraction", "END_FRAC"), P("end of fraction", "END_FRAC"), P("end fraction", "END_FRAC"),
  P("all over", "ALLOVER"), P("all divided by", "ALLOVER"), P("over", "OVER"), P("divided by", "OVER"),
  P("times", "TIMES"), P("multiplied by", "TIMES"), P("plus", "PLUS"), P("minus", "MINUS"), P("negative", "NEG"),
  P("raised to the power of", "POW"), P("raised to the", "POW"), P("raised to", "POW"), P("to the power of", "POW"), P("to the power", "POW"), P("to the", "POW"),
  P("end of the exponent", "END_EXP"), P("end of exponent", "END_EXP"), P("end exponent", "END_EXP"), P("end power", "END_EXP"),
  P("all squared", "ALLPOST", "2"), P("all cubed", "ALLPOST", "3"), P("squared", "POST", "2"), P("cubed", "POST", "3"),
  P("subscript", "SUB"), P("sub", "SUB"), P("end subscript", "END_SUB"), P("end sub", "END_SUB"),
  P("the square root of", "ROOT"), P("square root of", "ROOT"), P("the root of", "ROOT"), P("root of", "ROOT"),
  P("the cube root of", "ROOT", "3"), P("cube root of", "ROOT", "3"),
  P("end of the root", "END_ROOT"), P("end of root", "END_ROOT"), P("end root", "END_ROOT"),
  P("the absolute value of", "ABS"), P("absolute value of", "ABS"), P("end absolute value", "END_ABS"), P("end of absolute value", "END_ABS"),
  P("the sum from", "SUM", "sum"), P("sum from", "SUM", "sum"), P("the product from", "SUM", "product"), P("product from", "SUM", "product"),
  P("end sum", "END_SUM"), P("end of sum", "END_SUM"), P("end product", "END_PROD"), P("end of product", "END_PROD"),
  P("the integral from", "INT_FROM"), P("integral from", "INT_FROM"), P("the integral of", "INT_OF"), P("integral of", "INT_OF"),
  P("with respect to", "WRT"),
  P("is approximately equal to", "REL", "approx"), P("approximately equal to", "REL", "approx"), P("is approximately", "REL", "approx"),
  P("approximately equals", "REL", "approx"), P("approximately", "REL", "approx"),
  P("is equal to", "REL", "equals"), P("equal to", "REL", "equals"), P("equals", "REL", "equals"),
  P("is less than", "REL", "less"), P("less than", "REL", "less"), P("is greater than", "REL", "greater"), P("greater than", "REL", "greater"),
  P("implies", "IMPLIES"), P("to", "TO"), P("of", "OF"), P(",", "COMMA"),
].sort((a, b) => b[0].length - a[0].length);
const CLOSER_OF = { END_FRAC: ["OVER", "ALLOVER", "FRAC_OVER", "AND_DEN"], END_EXP: ["POW"], END_ROOT: ["ROOT"], END_SUB: ["SUB"],
  END_SUM: ["SUM"], END_PROD: ["SUM"], END_ABS: ["ABS"], CLOSE: ["OPEN"], END_QTY: ["QTY"] };
const STARTS = new Set(["NUM", "VAR", "CONST", "OPEN", "QTY", "FUNC", "ROOT", "ABS", "SUM", "INT_FROM", "INT_OF", "FRAC_OPEN", "FRAC_NUM"]);

export function lex(words) {
  const out = [];
  for (let i = 0; i < words.length;) {
    const w = words[i];
    // "the n th root of"
    if ((w === "the" || w === "a") && words[i + 2] === "th" && words[i + 3] === "root" && words[i + 4] === "of" && (/^\d+$/.test(words[i + 1]) || VARIABLES.includes(words[i + 1]))) {
      out.push({ t: "ROOT", v: words[i + 1], at: i, n: 5 }); i += 5; continue;
    }
    // [the] function [of]
    //   "the sin of x", "sin of x", "sin x" (not for f, g, h, which need "of": "f" alone is not a variable either)
    if (w === "the" && FUNCTIONS.includes(words[i + 1]) && words[i + 2] === "of") { out.push({ t: "FUNC", v: words[i + 1], at: i, n: 3 }); i += 3; continue; }
    if (FUNCTIONS.includes(w) && words[i + 1] === "of") { out.push({ t: "FUNC", v: w, at: i, n: 2 }); i += 2; continue; }
    if (FUNCTIONS.includes(w) && !["f", "g", "h"].includes(w)) { out.push({ t: "FUNC", v: w, at: i, n: 1 }); i++; continue; }
    let hit = null;
    for (const [ph, t, v] of PHRASES) {
      if (ph.length && ph.every((p, k) => words[i + k] === p)) { hit = { t, v, at: i, n: ph.length }; break; }
    }
    if (hit) {
      if (hit.t === "MINUS" || hit.t === "NEG") hit.prefixable = true;
      out.push(hit); i += hit.n; continue;
    }
    if (/^\d+$/.test(w)) { out.push({ t: "NUM", v: w, at: i, n: 1 }); i++; continue; }
    if (w === "d" && words[i + 1] && VARIABLES.includes(words[i + 1]) && words[i + 1] !== "d") { out.push({ t: "DIFF", v: words[i + 1], at: i, n: 2 }); i += 2; continue; }
    if (CONSTANTS.includes(w)) { out.push({ t: "CONST", v: w, at: i, n: 1 }); i++; continue; }
    if (VARIABLES.includes(w)) { out.push({ t: "VAR", v: w, at: i, n: 1 }); i++; continue; }
    out.push({ t: "WORD", v: w, at: i, n: 1 }); i++;
  }
  return out;
}

/** closers matched to their openers (nearest unmatched preceding opener of the right kind); "the fraction" claims its "over" */
function match(toks) {
  const errors = [];
  for (let i = toks.length - 1; i >= 0; i--) {             // innermost "the fraction" first
    if (toks[i].t !== "FRAC_OPEN") continue;
    let depth = 0, found = -1;
    for (let j = i + 1; j < toks.length; j++) {
      const t = toks[j].t;
      if (t === "OPEN" || t === "QTY") depth++; else if (t === "CLOSE" || t === "END_QTY") depth--;
      if (depth < 0) break;
      if (depth === 0 && t === "OVER" && !toks[j].claimed) { found = j; break; }
    }
    if (found < 0) errors.push(`"the fraction" at word ${toks[i].at} has no "over"`); else { toks[found].t = "FRAC_OVER"; toks[found].claimed = i; }
  }
  // bracket depth of every token: a closer of a construct matches the nearest unmatched opener of its kind INSIDE the same bracket group
  const dep = []; let d0 = 0;
  for (const t of toks) { if (t.t === "CLOSE" || t.t === "END_QTY") d0--; dep.push(d0); if (t.t === "OPEN" || t.t === "QTY") d0++; }
  for (let i = 0; i < toks.length; i++) {
    const kinds = CLOSER_OF[toks[i].t]; if (!kinds) continue;
    const bracket = toks[i].t === "CLOSE" || toks[i].t === "END_QTY";
    let j = i - 1;
    for (; j >= 0; j--) {
      if (!bracket && dep[j] < dep[i]) { j = -1; break; }               // do not leave the group
      if (!bracket && dep[j] > dep[i]) continue;                          // do not enter a nested group
      if (kinds.includes(toks[j].t) && toks[j].closer === undefined && (toks[i].t !== "END_SUM" || toks[j].v === "sum") && (toks[i].t !== "END_PROD" || toks[j].v === "product")) break;
    }
    if (j < 0) errors.push(`"${toks[i].t.toLowerCase().replace("_", " ")}" at word ${toks[i].at} closes nothing`); else { toks[j].closer = i; toks[i].opener = j; }
  }
  for (const t of toks) if ((t.t === "OPEN" || t.t === "QTY") && t.closer === undefined) errors.push(`${t.t === "OPEN" ? "open parenthesis" : "the quantity"} at word ${t.at} is never closed`);
  return errors;
}

// ---------------------------------------------------------------- the parser for one assignment of the open scopes
class Fail extends Error {}
const TIGHT = { OVER: 30, ALLOVER: 30, FRAC_OVER: 30, AND_DEN: 30, POW: 49, FUNC: 39, ROOT: 39, ABS: 39, SUM: 39 };
const WIDE = 15;

class Pratt {
  constructor(toks, assign) { this.k = toks; this.i = 0; this.a = assign; }
  peek() { return this.k[this.i]; }
  fail(msg) { throw new Fail(msg); }
  expect(t, idx) {
    const x = this.peek();
    if (!x || x.t !== t || (idx !== undefined && this.i !== idx)) this.fail(`expected ${t.toLowerCase()} at word ${x ? x.at : "end"}`);
    this.i++; return x;
  }
  lbp(x) {
    switch (x.t) {
      case "PLUS": case "MINUS": return 20;
      case "TIMES": return 30;
      case "OVER": return this.a.get(this.i + ":L") === "W" ? WIDE : 30;
      case "ALLOVER": case "ALLPOST": return WIDE;
      case "POW": return 50;
      case "SUB": return 60;
      case "POST": return 70;
      case "REL": return 10;
      case "IMPLIES": return 5;
      default: return STARTS.has(x.t) ? 40 : -1;           // juxtaposition, or a stop (closers, to, of, d x, and denominator)
    }
  }
  parse(rbp) {
    let left = this.nud();
    for (;;) {
      const x = this.peek(); if (!x) return left;
      if (x.t === "COMMA") { if (rbp < WIDE) { this.i++; continue; } return left; }
      if (!(this.lbp(x) > rbp)) return left;
      left = this.led(left);
    }
  }
  /** the right operand of an open-scope operator at token index idx (closer-matched: exactly up to the closer) */
  operand(idx, type) {
    const op = this.k[idx];
    if (op.closer !== undefined) { const e = this.parse(-1); this.expect(this.k[op.closer].t, op.closer); return e; }
    return this.parse(this.a.get(idx + ":R") === "W" ? WIDE : TIGHT[type]);
  }
  prefixOperand(idx, type) {
    const op = this.k[idx], nx = this.k[idx + 1];
    if (op.closer === undefined && nx && nx.t === "OPEN") {       // the operator's own brackets
      this.i++; const e = this.parse(-1); this.expect("CLOSE", nx.closer); return e;
    }
    return this.operand(idx, type);
  }
  nud() {
    const x = this.peek(); if (!x) this.fail("the formula ends where an operand is expected");
    const idx = this.i; this.i++;
    switch (x.t) {
      case "NUM": return num(x.v);
      case "VAR": return vr(x.v);
      case "CONST": return cst(x.v);
      case "OPEN": { const e = this.parse(-1); this.expect("CLOSE", x.closer); return node("paren", { operand: e }); }
      case "QTY": { const e = this.parse(-1); this.expect("END_QTY", x.closer); return e; }
      case "MINUS": case "NEG": return node("neg", { operand: this.parse(29) });
      case "FUNC": return node("apply", { function: x.v, argument: this.prefixOperand(idx, "FUNC") });
      case "ROOT": {
        const index = x.v ? (/^\d+$/.test(x.v) ? num(x.v) : vr(x.v)) : null;
        return node("root", { index, argument: this.prefixOperand(idx, "ROOT") });
      }
      case "ABS": return node("abs", { operand: this.prefixOperand(idx, "ABS") });
      case "FRAC_OPEN": {
        const n = this.parse(-1); const ov = this.peek(); if (!ov || ov.t !== "FRAC_OVER" || ov.claimed !== idx) this.fail(`"the fraction" at word ${x.at}: no over`);
        const oi = this.i; this.i++; return node("fraction", { numerator: n, denominator: this.operand(oi, "FRAC_OVER") });
      }
      case "FRAC_NUM": {
        const n = this.parse(-1); const ai = this.i; this.expect("AND_DEN");
        return node("fraction", { numerator: n, denominator: this.operand(ai, "AND_DEN") });
      }
      case "SUM": {
        const iv = this.expect("VAR"); const r = this.peek(); if (!r || r.t !== "REL" || r.v !== "equals") this.fail(`the ${x.v} at word ${x.at}: expected "equals" after the index`);
        this.i++; const lower = this.parse(-1); this.expect("TO"); const upper = this.parse(-1); this.expect("OF");
        return node(x.v, { index: vr(iv.v), lower, upper, body: this.operand(idx, "SUM") });
      }
      case "INT_FROM": case "INT_OF": {
        let lower = null, upper = null;
        if (x.t === "INT_FROM") { lower = this.parse(-1); this.expect("TO"); upper = this.parse(-1); this.expect("OF"); }
        const body = this.parse(-1); const d = this.peek();
        if (d && d.t === "DIFF") { this.i++; return node("integral", { lower, upper, body, index: vr(d.v) }); }
        if (d && d.t === "WRT") { this.i++; const v = this.expect("VAR"); return node("integral", { lower, upper, body, index: vr(v.v) }); }
        this.fail(`the integral at word ${x.at} has no "d <variable>" or "with respect to"`);
      }
      default: this.fail(`"${x.v || x.t.toLowerCase()}" at word ${x.at} cannot start an operand`);
    }
  }
  led(left) {
    const x = this.peek(), idx = this.i;
    switch (x.t) {
      case "PLUS": this.i++; return node("plus", { left, right: this.parse(20) });
      case "MINUS": this.i++; return node("minus", { left, right: this.parse(20) });
      case "TIMES": this.i++; return node("times", { left, right: this.parse(30) });
      case "OVER": case "ALLOVER": this.i++; return node("fraction", { numerator: left, denominator: this.operand(idx, x.t) });
      case "POW": this.i++; return node("power", { base: left, exponent: this.operand(idx, "POW") });
      case "POST": case "ALLPOST": this.i++; return node("power", { base: left, exponent: num(x.v) });
      case "SUB": this.i++; return node("subscript", { base: left, index: x.closer !== undefined ? this.operand(idx, "SUB") : this.parse(60) });
      case "REL": this.i++; return node(x.v, { left, right: this.parse(10) });
      case "IMPLIES": this.i++; return node("implies", { left, right: this.parse(5) });
      default: return node("times", { left, right: this.parse(40) });       // juxtaposition
    }
  }
}

/** the open scopes of a token list: [key, description] with key "<token index>:L" (numerator of over) or ":R" (right operand) */
function scopes(toks) {
  const out = [];
  toks.forEach((x, i) => {
    const prefixParen = ["FUNC", "ROOT", "ABS"].includes(x.t) && toks[i + 1] && toks[i + 1].t === "OPEN";
    if (x.t === "OVER") out.push([`${i}:L`, `the numerator of "over" at word ${x.at}`]);
    if (["OVER", "ALLOVER", "FRAC_OVER", "AND_DEN", "POW", "FUNC", "ROOT", "ABS", "SUM"].includes(x.t) && x.closer === undefined && !prefixParen)
      out.push([`${i}:R`, { OVER: "the denominator", ALLOVER: "the denominator", FRAC_OVER: "the denominator", AND_DEN: "the denominator",
        POW: "the exponent", FUNC: "the argument", ROOT: "the argument", ABS: "the argument", SUM: "the body" }[x.t] + ` of "${x.t === "FUNC" ? x.v : x.t.toLowerCase()}" at word ${x.at}`]);
  });
  return out;
}

const MAX_SCOPES = 12;
/** a spoken formula -> {source, tokens, text, status: ok|ambiguous|no-parse, readings: [{tree, scopes}], reason} */
export function parseFormula(input, opts = {}) {
  const words = Array.isArray(input) ? input : normalize(input);
  const res = { source: SOURCE, tokens: words, text: words.join(" "), readings: [], status: "no-parse", reason: "" };
  if (!words.length) { res.reason = "empty"; return res; }
  const toks = lex(words);
  const bad = toks.find((t) => t.t === "WORD"); if (bad) { res.reason = `"${bad.v}" (word ${bad.at}) is not a word of formulas`; return res; }
  const errs = match(toks); if (errs.length) { res.reason = errs[0]; return res; }
  const sc = scopes(toks);
  if (sc.length > MAX_SCOPES) { res.reason = `${sc.length} open scopes (more than ${MAX_SCOPES}): say where they end`; return res; }
  const seen = new Map(); let firstErr = null;
  for (let m = 0; m < (1 << sc.length); m++) {
    const assign = new Map(sc.map(([k], b) => [k, (m >> b) & 1 ? "W" : "T"]));
    const p = new Pratt(toks, assign);
    try {
      const t = p.parse(-1);
      if (p.i !== toks.length) throw new Fail(`unread words from word ${toks[p.i].at} ("${words.slice(toks[p.i].at).join(" ")}")`);
      const key = canonical(t);
      if (!seen.has(key)) seen.set(key, { tree: t, scopes: sc.map(([k, d]) => `${d}: ${assign.get(k) === "W" ? "wide" : "tight"}`) });
    } catch (e) { if (!(e instanceof Fail)) throw e; if (!firstErr) firstErr = e.message; }
  }
  res.readings = [...seen.values()];
  if (!res.readings.length) { res.reason = firstErr; return res; }
  res.status = res.readings.length === 1 ? "ok" : "ambiguous";
  res.reason = res.readings.length === 1 ? (sc.length ? `${sc.length} open scope(s), one reading` : "no open scope")
    : `${res.readings.length} readings: the words do not decide ${sc.map(([, d]) => d).join("; ")}`;
  if (opts.keepTokens) res.lexed = toks;
  return res;
}

// ---------------------------------------------------------------- commands (spec 16.4)
const PREFIXES = [["please"], ["now"], ["okay", "so"], ["okay"], ["ok"], ["could", "you"], ["can", "you"], ["would", "you"], ["i", "want", "you", "to"],
  ["i", "need", "you", "to"], ["lets"], ["then"], ["and"], ["also"]];
export const ORDINALS = ["first", "second", "third", "fourth", "fifth", "last"];
const TARGET_ATTRS = ORDINALS.concat(["whole", "left", "right", "upper", "lower", "next", "previous"]);
export const TARGET_HEADS = ["numerator", "denominator", "exponent", "base", "index", "argument", "body", "operand", "limit", "term", "factor",
  "side", "sides", "thing", "formula", "expression", "equation", "everything", "selection", "cursor", "fraction", "power", "root", "sum",
  "product", "integral", "parenthesis", "parentheses", "plus", "minus", "times", "it", "that", "this"];
const WRAPPERS = { parentheses: "parentheses", parenthesis: "parentheses", brackets: "parentheses", "absolute value": "abs",
  "absolute value bars": "abs", "a fraction": "fraction", "a square root": "root", "a root": "root", "square root": "root" };
const OP_WORDS = ["plus", "minus", "times", "over", "equals"];
const DIRECTIONS = ["left", "right", "up", "down"];

function stripPrefixes(w) {
  let t = w.slice(); let changed = true;
  while (changed) {
    changed = false;
    while (t[0] === ",") { t = t.slice(1); changed = true; }
    for (const p of PREFIXES) if (p.every((x, k) => t[k] === x) && t.length > p.length) { t = t.slice(p.length); changed = true; }
  }
  while (t.length > 1 && (t[t.length - 1] === "please" || t[t.length - 1] === ",")) t = t.slice(0, -1);
  return t;
}
/** a target description -> {head, attr, det} or null; "of <symbol>" is returned as owner */
export function parseTarget(w) {
  if (!w.length) return null;
  let i = 0, det = null, attr = null, owner = null;
  if (w.length === 1 && ["it", "that", "this", "everything"].includes(w[0])) return { target: { head: w[0], attr: null, det: null }, owner };
  if (["the", "every", "each", "all", "this", "that"].includes(w[i])) { det = w[i]; i++; if (det === "all" && w[i] === "the") i++; }
  if (TARGET_ATTRS.includes(w[i]) && w[i + 1] !== undefined) { attr = w[i]; i++; if (w[i] === "hand") i++; }
  const head = w[i]; if (head === undefined) return null; i++;
  const isSymbol = /^\d+$/.test(head) || VARIABLES.includes(head) || CONSTANTS.includes(head);
  if (!isSymbol && !TARGET_HEADS.includes(head)) return null;
  if (w[i] === "of" && w[i + 1] !== undefined && i + 2 === w.length) { const o = w[i + 1]; if (/^\d+$/.test(o) || VARIABLES.includes(o) || CONSTANTS.includes(o)) { owner = o; i += 2; } }
  if (i !== w.length) return null;
  return { target: { head, attr, det }, owner };
}
function idxOf(w, word, from = 0) { for (let i = from; i < w.length; i++) if (w[i] === word) return i; return -1; }
const emptyFrame = (event) => ({ event, target: null, owner: null, value: null, word: null, wrapper: null, joiner: null, position: null, direction: null });

/** a command -> {source, status: ok|ambiguous|no-parse, frame, readings (of the value), reason, tokens, text} */
export function parseCommand(input) {
  const words = Array.isArray(input) ? input : normalize(input);
  const w = stripPrefixes(words);           // a pause inside a value is kept: it closes scopes there
  const res = { source: SOURCE, tokens: words, text: words.join(" "), status: "no-parse", frame: null, readings: [], reason: "" };
  const fail = (r) => { res.reason = r; return res; };
  const tgt = (span, f) => { const p = parseTarget(span); if (!p) return false; f.target = p.target; f.owner = p.owner; return true; };
  const val = (span, f) => {
    if (span.length === 1 && OP_WORDS.includes(span[0])) { f.word = span[0]; return true; }
    const r = parseFormula(span); res.readings = r.readings;
    if (r.status === "no-parse") { res.reason = `the value: ${r.reason}`; return false; }
    f.value = r.readings[0].tree; if (r.status === "ambiguous") res.ambiguousValue = true; return true;
  };
  const done = (f) => { res.frame = f; res.status = res.ambiguousValue ? "ambiguous" : "ok"; res.reason = res.ambiguousValue ? "the value has several readings" : `read as ${f.event}`; return res; };
  if (!w.length) return fail("empty");
  const v = w[0], rest = w.slice(1);
  if (v === "undo" && (rest.length === 0 || (rest.length === 1 && rest[0] === "that"))) return done(emptyFrame("undo"));
  if (v === "redo" && rest.length === 0) return done(emptyFrame("redo"));
  if (v === "replace") {
    const k = idxOf(rest, "with"); if (k < 0) return fail('replace: no "with"');
    const f = emptyFrame("replace"); if (!tgt(rest.slice(0, k), f)) return fail("replace: the target is not a description of a part of the formula");
    return val(rest.slice(k + 1), f) ? done(f) : res;
  }
  if (v === "substitute") {
    const k = idxOf(rest, "for"); if (k < 0) return fail('substitute: no "for"');
    const f = emptyFrame("replace"); if (!tgt(rest.slice(k + 1), f)) return fail("substitute: bad target");
    return val(rest.slice(0, k), f) ? done(f) : res;
  }
  if (v === "change" || v === "set") {
    let k = idxOf(rest, "to"); if (k < 0) k = idxOf(rest, "into"); if (k < 0) return fail(`${v}: no "to"`);
    const f = emptyFrame("replace"); if (!tgt(rest.slice(0, k), f)) return fail(`${v}: bad target`);
    return val(rest.slice(k + 1), f) ? done(f) : res;
  }
  if (["delete", "remove", "erase"].includes(v)) { const f = emptyFrame("delete"); return tgt(rest, f) ? done(f) : fail(`${v}: bad target`); }
  if (["select", "highlight"].includes(v)) { const f = emptyFrame("select"); return tgt(rest, f) ? done(f) : fail(`${v}: bad target`); }
  if (["wrap", "enclose", "put"].includes(v)) {
    const f = emptyFrame("wrap");
    const kin = idxOf(rest, "in"), kover = idxOf(rest, "over"), kunder = idxOf(rest, "under");
    if (v === "put" && kover > 0 && (kin < 0 || kover < kin)) {
      if (!tgt(rest.slice(0, kover), f)) return fail("put ... over: bad target");
      f.wrapper = "fraction"; return val(rest.slice(kover + 1), f) ? done(f) : res;
    }
    if (v === "put" && kunder > 0) {
      const wr = rest.slice(kunder + 1).join(" "); if (!["a square root", "a root", "the square root", "square root"].includes(wr)) return fail("put ... under: unknown wrapper");
      if (!tgt(rest.slice(0, kunder), f)) return fail("put ... under: bad target"); f.wrapper = "root"; return done(f);
    }
    if (kin < 0) return fail(`${v}: no "in"`);
    const wr = rest.slice(kin + 1).filter((x) => x !== "the").join(" "); if (!WRAPPERS[wr]) return fail(`${v}: unknown wrapper "${wr}"`);
    if (!tgt(rest.slice(0, kin), f)) return fail(`${v}: bad target`); f.wrapper = WRAPPERS[wr]; return done(f);
  }
  if (v === "make" || v === "turn") {
    const f = emptyFrame("wrap"); const n = rest.length;
    const tail = v === "make" ? ["a", "fraction"] : ["into", "a", "fraction"];
    if (n > tail.length && tail.every((x, k) => rest[n - tail.length + k] === x)) {
      if (!tgt(rest.slice(0, n - tail.length), f)) return fail(`${v}: bad target`); f.wrapper = "fraction"; return done(f);
    }
    return fail(`${v}: only "${v} <target> ${tail.join(" ")}" is a command`);
  }
  if (v === "take") {
    const f = emptyFrame("wrap");
    const forms = [[["the", "square", "root", "of"], "root"], [["the", "absolute", "value", "of"], "abs"]];
    for (const [ph, wr] of forms) if (ph.every((x, k) => rest[k] === x)) { if (!tgt(rest.slice(ph.length), f)) return fail("take: bad target"); f.wrapper = wr; return done(f); }
    return fail("take: unknown form");
  }
  if (["insert", "add", "append", "type"].includes(v)) {
    const f = emptyFrame("insert"); let span = rest;
    const n = span.length;
    if (n >= 3 && span[n - 3] === "at" && span[n - 2] === "the" && ["end", "beginning", "start"].includes(span[n - 1])) {
      f.position = span[n - 1] === "end" ? "end" : "start"; span = span.slice(0, n - 3);
    } else {
      let k = -1; for (let i = span.length - 1; i > 0; i--) if (span[i] === "after" || span[i] === "before") { k = i; break; }
      if (k > 0) { f.position = span[k]; if (!tgt(span.slice(k + 1), f)) return fail(`${v} ... ${span[k]}: bad target`); span = span.slice(0, k); }
    }
    if (["plus", "minus", "times"].includes(span[0])) { f.joiner = span[0]; span = span.slice(1); }
    else if (span[0] === "over" || (span[0] === "divided" && span[1] === "by")) { f.joiner = "over"; span = span.slice(span[0] === "over" ? 1 : 2); }
    if (!span.length) return fail(`${v}: nothing to insert`);
    return val(span, f) ? done(f) : res;
  }
  if (v === "move" || v === "go") {
    const f = emptyFrame("move"); let span = rest;
    if (span[0] === "the" && span[1] === "cursor") span = span.slice(2);
    if (span.length === 1 && DIRECTIONS.includes(span[0])) { f.direction = span[0]; return done(f); }
    if (span[0] === "to") { if (!tgt(span.slice(1), f)) return fail(`${v} to: bad target`); return done(f); }
    return fail(`${v}: expected a direction or "to <target>"`);
  }
  if (v === "factor") {
    const f = emptyFrame("factor"); let span = rest;
    if (span[0] === "out") {
      span = span.slice(1);
      // "from <target>": the last "from" whose remainder is a target ("the sum from i equals ..." inside the value is not one)
      for (let k = span.length - 2; k > 0; k--) if (span[k] === "from" && parseTarget(span.slice(k + 1))) { tgt(span.slice(k + 1), f); span = span.slice(0, k); break; }
      return val(span, f) ? done(f) : res;
    }
    const k = idxOf(span, "out"); if (k <= 0) return fail('factor: no "out"');
    if (span[k + 1] === "of") { if (!tgt(span.slice(k + 2), f)) return fail("factor: bad target"); }
    else if (k + 1 !== span.length) return fail("factor: unread words");
    return val(span.slice(0, k), f) ? done(f) : res;
  }
  if (v === "swap" || v === "flip") {
    const f = emptyFrame("swap"); const s = rest.filter((x) => x !== "two").join(" ");
    if (["the sides", "sides", "the equation", "both sides"].includes(s)) { f.target = { head: s.split(" ").pop() === "equation" ? "equation" : "sides", attr: null, det: s.startsWith("the") ? "the" : null }; return done(f); }
    return fail(`${v}: expected "the sides"`);
  }
  return fail(`"${v}" does not start a matheditor command`);
}

/** picking one reading of an ambiguous formula: "the first", "the second one", "number two", "the last" -> index or null */
export function parseChoice(input, n) {
  const w = String(input).toLowerCase().replace(/[.,!?]/g, " ").split(/\s+/).filter((x) => x && !["the", "one", "reading", "please", "number", "option"].includes(x));
  if (w.length !== 1) return null;
  const k = { first: 0, second: 1, third: 2, fourth: 3, last: n - 1, 1: 0, 2: 1, 3: 2, 4: 3, two: 1, three: 2, four: 3 }[w[0]];
  return k === undefined || k < 0 || (n !== undefined && k >= n) ? null : k;
}

export { equal };
