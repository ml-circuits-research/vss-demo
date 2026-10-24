// latex.js: formula tree <-> LaTeX, a mechanical rewrite with no learning (spec 16.2), DOM-free.
// toLatex(tree) writes one deterministic string; fromLatex(string) reads that subset back (and the common hand-typed forms listed below),
// so that fromLatex(toLatex(t)) equals t for every tree (tested in app/tests/formula.mjs).
// Conventions, stated:
//  - an explicit parenthesis NODE (the user said "open parenthesis") is written \left( ... \right); parentheses added only to keep the
//    tree (automatic grouping) are written ( ... ). fromLatex reads \left( as the node and ( as grouping. \left| ... \right| is abs.
//  - times is juxtaposition ("2 x"), or \cdot when the right factor starts with a digit ("2 \cdot 3"); \cdot, \times and juxtaposition
//    all read back as times, left-associative.
//  - a function argument is always written in parentheses: \sin(x), f(x); the parentheses belong to the function (not a node).
//  - the integral ends with "\, d x"; sums and products are \sum_{i=1}^{n} body, with the body a product chain (parenthesised otherwise).
//  - a hole (empty slot) is \square.
import { needsParens, node, num, vr, cst, hole, GREEK, FUNCTIONS } from "./tree.js";

const CONST_TEX = { pi: "\\pi", e: "e", infinity: "\\infty" };
const FN_TEX = { sin: "\\sin", cos: "\\cos", tan: "\\tan", log: "\\log", ln: "\\ln", exp: "\\exp", f: "f", g: "g", h: "h" };
const REL_TEX = { equals: "=", less: "<", greater: ">", approx: "\\approx", implies: "\\implies" };

export function toLatex(t) {
  const L = toLatex;
  const sub = (role) => { const c = t[role], s = L(c); return needsParens(t, role, c) ? `(${s})` : s; };
  switch (t.op) {
    case "num": return t.v;
    case "var": return GREEK.includes(t.v) ? "\\" + t.v : t.v;
    case "const": return CONST_TEX[t.v];
    case "hole": return "\\square";
    case "plus": return `${sub("left")} + ${sub("right")}`;
    case "minus": return `${sub("left")} - ${sub("right")}`;
    case "times": { const r = sub("right"); return `${sub("left")}${/^[0-9]/.test(r) ? " \\cdot " : " "}${r}`; }
    case "neg": return `-${sub("operand")}`;
    case "fraction": return `\\frac{${L(t.numerator)}}{${L(t.denominator)}}`;
    case "power": return `${sub("base")}^{${L(t.exponent)}}`;
    case "subscript": return `${sub("base")}_{${L(t.index)}}`;
    case "root": return t.index ? `\\sqrt[${L(t.index)}]{${L(t.argument)}}` : `\\sqrt{${L(t.argument)}}`;
    case "apply": return `${FN_TEX[t.function] || t.function}(${L(t.argument)})`;
    case "paren": return `\\left(${L(t.operand)}\\right)`;
    case "abs": return `\\left|${L(t.operand)}\\right|`;
    case "sum": case "product":
      return `\\${t.op === "sum" ? "sum" : "prod"}_{${L(t.index)}=${L(t.lower)}}^{${L(t.upper)}} ${sub("body")}`;
    case "integral":
      return `\\int${t.lower ? `_{${L(t.lower)}}^{${L(t.upper)}}` : ""} ${L(t.body)} \\, d ${L(t.index)}`;
    default:
      if (REL_TEX[t.op]) return `${sub("left")} ${REL_TEX[t.op]} ${sub("right")}`;
      throw new Error(`toLatex: unknown operator ${t.op}`);
  }
}

// ---------------------------------------------------------------- LaTeX -> tree
// Accepted: the output of toLatex, plus ( ) [ ] { } grouping, \cdot \times, \dfrac \tfrac, \left[ \right], \le-free relations = < > \approx
// \implies \Rightarrow, \sin x without parentheses (argument = the next postfix atom), \mathrm{d}x and dx in integrals.
function lex(s) {
  const out = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "\\") {
      if (s[i + 1] === "," || s[i + 1] === ";" || s[i + 1] === "!" || s[i + 1] === " ") { out.push({ t: "\\," }); i += 2; continue; }
      let j = i + 1; while (j < s.length && /[A-Za-z]/.test(s[j])) j++;
      let name = s.slice(i, j);
      if ((name === "\\left" || name === "\\right") && j < s.length) {
        if (s[j] === "\\" && s.slice(j, j + 2) === "\\{") { name += "{"; j += 2; } else { name += s[j]; j++; }
      }
      out.push({ t: name }); i = j; continue;
    }
    if (/[0-9]/.test(c)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; out.push({ t: "num", v: s.slice(i, j) }); i = j; continue; }
    if (/[A-Za-z]/.test(c)) { out.push({ t: "letter", v: c }); i++; continue; }
    out.push({ t: c }); i++;
  }
  return out;
}

class LatexParser {
  constructor(src) { this.k = lex(src); this.i = 0; }
  peek(o = 0) { return this.k[this.i + o]; }
  is(t, o = 0) { const x = this.peek(o); return x && x.t === t; }
  eat(t) { const x = this.peek(); if (!x || x.t !== t) throw new Error(`fromLatex: expected ${t} at token ${this.i}, got ${x ? x.t : "end"}`); this.i++; return x; }
  group() {                                   // {...} or a single atom (x^2)
    if (this.is("{")) { this.eat("{"); const e = this.expr(); this.eat("}"); return e; }
    const x = this.peek(); if (!x) throw new Error("fromLatex: missing group");
    if (x.t === "num" && x.v.length > 1) { const d = x.v[0]; x.v = x.v.slice(1); return num(d); }   // x^23 = x^{2} 3
    return this.atom();
  }
  expr() {                                    // implies < relations < add
    let l = this.rel();
    while (this.is("\\implies") || this.is("\\Rightarrow")) { this.i++; l = node("implies", { left: l, right: this.rel() }); }
    return l;
  }
  rel() {
    let l = this.add();
    for (;;) {
      const x = this.peek(); if (!x) return l;
      const op = x.t === "=" ? "equals" : x.t === "<" ? "less" : x.t === ">" ? "greater" : x.t === "\\approx" ? "approx" : null;
      if (!op) return l; this.i++; l = node(op, { left: l, right: this.add() });
    }
  }
  add() {
    let l = this.term();
    for (;;) {
      if (this.is("+")) { this.i++; l = node("plus", { left: l, right: this.term() }); }
      else if (this.is("-")) { this.i++; l = node("minus", { left: l, right: this.term() }); }
      else return l;
    }
  }
  term() {
    if (this.is("-")) { this.i++; return node("neg", { operand: this.term() }); }
    let l = this.postfix();
    for (;;) {
      if (this.is("\\cdot") || this.is("\\times")) { this.i++; l = node("times", { left: l, right: this.postfix() }); }
      else if (this.startsAtom()) l = node("times", { left: l, right: this.postfix() });
      else return l;
    }
  }
  startsAtom() {
    const x = this.peek(); if (!x) return false;
    if (x.t === "num" || x.t === "(" || x.t === "[" || x.t === "{") return true;
    if (x.t === "letter") return !(x.v === "d" && this.inIntegral && this.peekIntegralEnd());
    return /^\\(frac|dfrac|tfrac|sqrt|left[(|[]|sum|prod|int|pi|infty|square|sin|cos|tan|log|ln|exp|mathrm)/.test(x.t) || GREEK.includes(x.t.slice(1));
  }
  peekIntegralEnd() { const n = this.peek(1); return n && (n.t === "letter" || GREEK.includes((n.t || "").slice(1))); }
  postfix() {
    let b = this.atom();
    for (;;) {
      if (this.is("^")) { this.i++; b = node("power", { base: b, exponent: this.group() }); }
      else if (this.is("_")) { this.i++; b = node("subscript", { base: b, index: this.group() }); }
      else return b;
    }
  }
  atom() {
    const x = this.peek(); if (!x) throw new Error("fromLatex: unexpected end");
    this.i++;
    switch (x.t) {
      case "num": return num(x.v);
      case "letter":
        if (x.v === "e") return cst("e");
        if (["f", "g", "h"].includes(x.v) && this.is("(")) { this.eat("("); const a = this.expr(); this.eat(")"); return node("apply", { function: x.v, argument: a }); }
        return vr(x.v);
      case "(": { const e = this.expr(); this.eat(")"); return e; }
      case "[": { const e = this.expr(); this.eat("]"); return e; }
      case "{": { const e = this.expr(); this.eat("}"); return e; }
      case "\\left(": { const e = this.expr(); this.eat("\\right)"); return node("paren", { operand: e }); }
      case "\\left[": { const e = this.expr(); this.eat("\\right]"); return node("paren", { operand: e }); }
      case "\\left|": { const e = this.expr(); this.eat("\\right|"); return node("abs", { operand: e }); }
      case "|": { const e = this.expr(); this.eat("|"); return node("abs", { operand: e }); }
      case "\\frac": case "\\dfrac": case "\\tfrac": { const n = this.group(), d = this.group(); return node("fraction", { numerator: n, denominator: d }); }
      case "\\sqrt": {
        let idx = null; if (this.is("[")) { this.eat("["); idx = this.expr(); this.eat("]"); }
        return node("root", { index: idx, argument: this.group() });
      }
      case "\\pi": return cst("pi");
      case "\\infty": return cst("infinity");
      case "\\square": return hole();
      case "\\sum": case "\\prod": {
        this.eat("_"); this.eat("{"); const iv = this.atom(); this.eat("="); const lo = this.expr(); this.eat("}");
        this.eat("^"); const up = this.group(); const body = this.term();
        return node(x.t === "\\sum" ? "sum" : "product", { index: iv, lower: lo, upper: up, body });
      }
      case "\\int": {
        let lo = null, up = null;
        if (this.is("_")) { this.i++; lo = this.group(); this.eat("^"); up = this.group(); }
        const save = this.inIntegral; this.inIntegral = true; const body = this.expr(); this.inIntegral = save;
        if (this.is("\\,")) this.i++;
        if (this.is("\\mathrm")) { this.i++; this.eat("{"); const d = this.eat("letter"); if (d.v !== "d") throw new Error("fromLatex: expected d"); this.eat("}"); }
        else { const d = this.eat("letter"); if (d.v !== "d") throw new Error("fromLatex: expected d in the integral"); }
        const iv = this.atom();
        return node("integral", { lower: lo, upper: up, body, index: iv });
      }
      default: {
        const name = x.t.slice(1);
        if (GREEK.includes(name)) return vr(name);
        if (FUNCTIONS.includes(name)) {
          if (this.is("(")) { this.eat("("); const a = this.expr(); this.eat(")"); return node("apply", { function: name, argument: a }); }
          if (this.is("\\left(")) { this.i++; const a = this.expr(); this.eat("\\right)"); return node("apply", { function: name, argument: a }); }
          return node("apply", { function: name, argument: this.postfix() });
        }
        throw new Error(`fromLatex: unsupported token ${x.t}`);
      }
    }
  }
}

export function fromLatex(src) {
  const p = new LatexParser(src); const e = p.expr();
  if (p.i !== p.k.length) throw new Error(`fromLatex: unread input from token ${p.i} (${p.peek().t})`);
  return e;
}
