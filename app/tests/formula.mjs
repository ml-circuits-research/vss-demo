// formula.mjs: the formula widgets' core (spec 16; Table 13 rows "Formulas"): tree <-> LaTeX golden cases and a round trip on random
// trees, MathML well-formedness, the reference parser's readings (ambiguity held open: both readings, no false "both"), the command
// reader, and the scripted edit suite (criterion: 100% pass). Usage: node app/tests/formula.mjs   (exit 0 on pass, one summary line)
import { parseFormula, parseCommand, parseChoice, normalize } from "../src/formula/parse.js";
import { toLatex, fromLatex } from "../src/formula/latex.js";
import { toMathML } from "../src/formula/mathml.js";
import { FormulaDoc, canonical, node, num, vr, cst, hole, depth, toWires, fromWires, toMathJSON, ROLES, FUNCTIONS, GREEK } from "../src/formula/tree.js";
import { execute, plan, frameFromWires } from "../src/formula/commands.js";

let pass = 0; const fails = [];
const check = (name, ok, detail = "") => { if (ok) pass++; else fails.push(`${name}${detail ? ": " + detail : ""}`); };
const one = (spoken) => { const r = parseFormula(spoken); if (r.status !== "ok") throw new Error(`${spoken}: ${r.status} ${r.reason}`); return r.readings[0].tree; };

// ---------------------------------------------------------------- 1. tree -> LaTeX golden cases (spoken, unambiguous -> LaTeX)
const GOLD = [
  ["x squared plus two x minus one all over two a", "\\frac{x^{2} + 2 x - 1}{2 a}"],
  ["x plus one all over two", "\\frac{x + 1}{2}"],
  ["x plus the fraction one over two", "x + \\frac{1}{2}"],
  ["the fraction with numerator x plus one and denominator x minus one end fraction", "\\frac{x + 1}{x - 1}"],
  ["x to the n plus one end exponent", "x^{n + 1}"],
  ["x to the n , plus one", "x^{n} + 1"],
  ["e to the power of i pi end exponent plus one equals zero", "e^{i \\pi} + 1 = 0"],
  ["the square root of b squared minus four a c end root", "\\sqrt{b^{2} - 4 a c}"],
  ["the cube root of eight", "\\sqrt[3]{8}"],
  ["the n th root of x", "\\sqrt[n]{x}"],
  ["sine of open parenthesis two x close parenthesis", "\\sin(2 x)"],
  ["sin squared x"], // not a form of the grammar: checked below as no-parse
  ["f of x equals x squared plus one", "f(x) = x^{2} + 1"],
  ["the sum from i equals one to n of i squared", "\\sum_{i=1}^{n} i^{2}"],
  ["the sum from i equals one to n of i plus one end sum", "\\sum_{i=1}^{n} (i + 1)"],
  ["the product from k equals one to n of k", "\\prod_{k=1}^{n} k"],
  ["the integral from zero to one of x squared d x", "\\int_{0}^{1} x^{2} \\, d x"],
  ["the integral of sine of x d x", "\\int \\sin(x) \\, d x"],
  ["the absolute value of x minus y end absolute value", "\\left|x - y\\right|"],
  ["open parenthesis x plus one close parenthesis squared", "\\left(x + 1\\right)^{2}"],
  ["the quantity x plus one end quantity squared", "(x + 1)^{2}"],
  ["x plus one all squared", "(x + 1)^{2}"],
  ["x sub i plus one", "x_{i} + 1"],
  ["x sub i plus one end sub", "x_{i + 1}"],
  ["minus two x plus three", "-2 x + 3"],
  ["x times negative y", "x (-y)"],
  ["two times three", "2 \\cdot 3"],
  ["alpha plus beta is approximately pi", "\\alpha + \\beta \\approx \\pi"],
  ["x is less than y implies y is greater than x", "x < y \\implies y > x"],
  ["ex squared plus why squared", "x^{2} + y^{2}"],
  ["a over b over c end fraction end fraction", "\\frac{a}{\\frac{b}{c}}"],
  ["x minus the quantity y plus z end quantity", "x - (y + z)"],
];
for (const [spoken, latex] of GOLD) {
  if (latex === undefined) { check(`no-parse: ${spoken}`, parseFormula(spoken).status === "no-parse"); continue; }
  const r = parseFormula(spoken);
  if (r.status !== "ok") { check(`golden ${spoken}`, false, `${r.status}: ${r.reason}`); continue; }
  const got = toLatex(r.readings[0].tree);
  check(`golden ${spoken}`, got === latex, `got ${got}, want ${latex}`);
  let back = null; try { back = fromLatex(latex); } catch (e) { back = e.message; }
  check(`fromLatex ${latex}`, typeof back === "object" && canonical(back) === canonical(r.readings[0].tree), JSON.stringify(back));
}
// hand-typed LaTeX forms
for (const [tex, want] of [["\\dfrac{1}{2}", "\\frac{1}{2}"], ["x^2+1", "x^{2} + 1"], ["2\\times x", "2 x"], ["\\sin x", "\\sin(x)"], ["|x|", "\\left|x\\right|"],
  ["\\int_0^1 x\\,\\mathrm{d}x", "\\int_{0}^{1} x \\, d x"], ["\\left[x+1\\right]", "\\left(x + 1\\right)"]]) {
  let got; try { got = toLatex(fromLatex(tex)); } catch (e) { got = e.message; }
  check(`fromLatex hand-typed ${tex}`, got === want, `got ${got}`);
}

// ---------------------------------------------------------------- 2. round trip and MathML on random trees (seeded)
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const R = rng(12345), pick = (xs) => xs[Math.floor(R() * xs.length)];
const OPS = Object.keys(ROLES);
function randTree(d) {
  if (d === 0) { const k = R(); return k < 0.4 ? num(String(Math.floor(R() * 20))) : k < 0.85 ? vr(pick(["x", "y", "n", "a", "i"].concat(GREEK.slice(0, 3)))) : k < 0.95 ? cst(pick(["pi", "e", "infinity"])) : hole(); }
  const op = pick(OPS), sub = () => randTree(Math.floor(R() * d)), deep = () => randTree(d - 1);
  const roles = {}; const rs = ROLES[op].slice(); const main = pick(rs.filter((r) => !(op === "root" && r === "index") && !((op === "sum" || op === "product" || op === "integral") && r === "index")));
  for (const r of rs) {
    if ((op === "sum" || op === "product" || op === "integral") && r === "index") roles[r] = vr(pick(["i", "k", "x"]));
    else if (op === "root" && r === "index") { if (R() < 0.5) roles[r] = R() < 0.5 ? num("3") : vr("n"); }
    else if (op === "integral" && (r === "lower" || r === "upper") && R() < 0.3) { /* indefinite: both absent */ }
    else roles[r] = r === main ? deep() : sub();
  }
  if (op === "integral" && (!roles.lower || !roles.upper)) { delete roles.lower; delete roles.upper; }
  if (op === "apply") roles.function = pick(FUNCTIONS);
  return node(op, roles);
}
function wellFormed(xml) {
  const st = []; const re = /<(\/?)([a-z]+)[^>]*?(\/?)>/g; let m;
  while ((m = re.exec(xml))) { if (m[3]) continue; if (!m[1]) st.push(m[2]); else if (st.pop() !== m[2]) return false; }
  return st.length === 0;
}
let rt = 0, rtBad = [];
for (let k = 0; k < 600; k++) {
  const t = randTree(1 + (k % 4)); let back, tex = toLatex(t);
  try { back = fromLatex(tex); } catch (e) { back = { error: e.message }; }
  if (canonical(back) === canonical(t)) rt++; else if (rtBad.length < 3) rtBad.push(`${tex} -> ${JSON.stringify(back)}`);
  const ml = toMathML(t, { paths: true });
  check(`mathml well-formed ${tex}`, wellFormed(ml) && ml.startsWith("<math"));
  const w = toWires(t, (function* () { let i = 1; for (;;) yield `w${i++}`; })());
  check(`wires round trip ${tex}`, canonical(fromWires(w.value, new Map(w.wires.map((x) => [x.id, x])))) === canonical(t));
  toMathJSON(t);
}
check("latex round trip on 600 random trees", rt === 600, `${rt}/600; ${rtBad.join(" ; ")}`);

// ---------------------------------------------------------------- 3. readings: ambiguity held open (both readings, no false both)
const AMB = [
  ["x plus one over two", ["x + \\frac{1}{2}", "\\frac{x + 1}{2}"]],
  ["one over x plus one", ["\\frac{1}{x} + 1", "\\frac{1}{x + 1}"]],
  ["x to the n plus one", ["x^{n} + 1", "x^{n + 1}"]],
  ["the square root of x plus one", ["\\sqrt{x} + 1", "\\sqrt{x + 1}"]],
  ["sine of x plus y", ["\\sin(x) + y", "\\sin(x + y)"]],
  ["the sum from i equals one to n of i plus one", ["\\sum_{i=1}^{n} i + 1", "\\sum_{i=1}^{n} (i + 1)"]],
  ["a over b over c", ["\\frac{\\frac{a}{b}}{c}", "\\frac{a}{\\frac{b}{c}}"]],
  ["x squared plus one over two", ["x^{2} + \\frac{1}{2}", "\\frac{x^{2} + 1}{2}"]],
  ["x plus one over two plus three", ["x + \\frac{1}{2} + 3", "\\frac{x + 1}{2} + 3", "x + \\frac{1}{2 + 3}", "\\frac{x + 1}{2 + 3}"]],
  ["two to the x times y", ["2^{x} y", "2^{x y}"]],
  ["the absolute value of x minus one", ["\\left|x\\right| - 1", "\\left|x - 1\\right|"]],
];
for (const [s, want] of AMB) {
  const r = parseFormula(s), got = r.readings.map((x) => toLatex(x.tree));
  check(`ambiguous ${s}`, r.status === "ambiguous" && JSON.stringify(got) === JSON.stringify(want), `${r.status} ${JSON.stringify(got)}`);
}
// the spoken delimiters close the ambiguity (no false both)
const UNAMB = ["x plus one all over two", "x plus the fraction one over two", "one over x end fraction plus one", "one over x plus one end fraction",
  "x to the n , plus one", "x to the n plus one end exponent", "the square root of x end root plus one", "the square root of the quantity x plus one end quantity",
  "sine of open parenthesis x close parenthesis plus y", "sine of x , plus y", "the sum from i equals one to n of i , plus one",
  "the fraction with numerator x and denominator y end fraction plus one", "x squared plus two x plus one", "two x over three y",
  "one over two x", "x squared", "the integral from a to b of x plus one d x", "minus x squared", "x equals y", "x plus one equals two over three"];
for (const s of UNAMB) { const r = parseFormula(s); check(`unambiguous ${s}`, r.status === "ok", `${r.status}: ${r.reason}; ${r.readings.map((x) => toLatex(x.tree)).join(" | ")}`); }
check("no-parse is reported, not guessed", parseFormula("x plus").status === "no-parse" && parseFormula("x plus the cat").status === "no-parse");
check("normalize", JSON.stringify(normalize("Twenty five ex, SQUARED.")) === JSON.stringify(["25", "x", ",", "squared"]));
check("choice of a reading", parseChoice("the second one", 2) === 1 && parseChoice("the first", 2) === 0 && parseChoice("the third", 2) === null);

// ---------------------------------------------------------------- 4. command frames
const CMD = [
  ["replace the exponent with n plus one", { event: "replace", target: { head: "exponent", attr: null, det: "the" }, value: "n + 1" }],
  ["could you put the whole thing over two a", { event: "wrap", target: { head: "thing", attr: "whole", det: "the" }, wrapper: "fraction", value: "2 a" }],
  ["wrap the second term in parentheses please", { event: "wrap", target: { head: "term", attr: "second", det: "the" }, wrapper: "parentheses" }],
  ["make it a fraction", { event: "wrap", target: { head: "it", attr: null, det: null }, wrapper: "fraction" }],
  ["insert plus one after the exponent", { event: "insert", target: { head: "exponent", attr: null, det: "the" }, joiner: "plus", position: "after", value: "1" }],
  ["move the cursor to the denominator", { event: "move", target: { head: "denominator", attr: null, det: "the" } }],
  ["go left", { event: "move", direction: "left" }],
  ["factor out x from the numerator", { event: "factor", target: { head: "numerator", attr: null, det: "the" }, value: "x" }],
  ["swap the sides", { event: "swap", target: { head: "sides", attr: null, det: "the" } }],
  ["change the plus to minus", { event: "replace", target: { head: "plus", attr: null, det: "the" }, word: "minus" }],
  ["replace the exponent of x with three", { event: "replace", target: { head: "exponent", attr: null, det: "the" }, owner: "x", value: "3" }],
  ["select the left hand side", { event: "select", target: { head: "side", attr: "left", det: "the" } }],
  ["undo", { event: "undo" }],
  ["factor out the sum from i equals 1 to n of i from the numerator", { event: "factor", target: { head: "numerator", attr: null, det: "the" }, value: "\\sum_{i=1}^{n} i" }],
  ["factor out the sum from i equals 1 to n of i", { event: "factor", value: "\\sum_{i=1}^{n} i" }],
  ["insert natural log 9 , times mu after 8", { event: "insert", target: { head: "8", attr: null, det: null }, position: "after", value: "\\ln(9) \\mu" }],
];
for (const [s, want] of CMD) {
  const r = parseCommand(s), f = r.frame;
  const ok = f && f.event === want.event && JSON.stringify(f.target) === JSON.stringify(want.target || null) && (f.owner || null) === (want.owner || null)
    && (f.wrapper || null) === (want.wrapper || null) && (f.joiner || null) === (want.joiner || null) && (f.position || null) === (want.position || null)
    && (f.direction || null) === (want.direction || null) && (f.word || null) === (want.word || null) && (want.value === undefined ? f.value === null : f.value && toLatex(f.value) === want.value);
  check(`command ${s}`, ok, JSON.stringify(f) + " " + r.reason);
}
check("not a command", parseCommand("x plus one").status === "no-parse" && parseCommand("make the dog a fraction").status === "no-parse");
// the reader's wires (the matheditor world's gold shape) give the same frame as the reference reader
{
  const wires = [{ id: "w1", type: "replace", lines: [["_text", "replace the exponent with n plus one"], ["target", "$w2"], ["value", "$w3"]] },
    { id: "w2", type: "entity", lines: [["head", "exponent"], ["det", "the"]] }, { id: "w3", type: "plus", lines: [["left", "n"], ["right", "1"]] }];
  check("frameFromWires = parseCommand", canonical(frameFromWires(wires)) === canonical(parseCommand("replace the exponent with n plus one").frame));
}

// ---------------------------------------------------------------- 5. the scripted edit suite (Table 13: 100% pass)
// [start formula (spoken), [commands], expected LaTeX after | {status}]
const SUITE = [
  ["x squared plus two x minus one all over two a", ["replace the exponent with n plus one"], "\\frac{x^{n + 1} + 2 x - 1}{2 a}"],
  ["x squared plus two x minus one", ["put the whole thing over two a"], "\\frac{x^{2} + 2 x - 1}{2 a}"],
  ["x squared plus two x minus one", ["wrap the second term in parentheses"], "x^{2} + \\left(2 x\\right) - 1"],
  ["x squared plus two x minus one", ["delete the second term"], "x^{2} - 1"],
  ["x squared plus two x minus one", ["delete the last term"], "x^{2} + 2 x"],
  ["x squared plus two x minus one all over two a", ["replace the second term with three x"], "\\frac{x^{2} + 3 x - 1}{2 a}"],
  ["x plus one", ["make it a fraction", "type two"], "\\frac{x + 1}{2}"],
  ["x squared plus y squared", ["replace the exponent of x with three"], "x^{3} + y^{2}"],
  ["x squared plus y squared", ["replace the exponent of y with n"], "x^{2} + y^{n}"],
  ["x squared plus y squared", ["replace the exponent with three"], { status: "choose" }],
  ["x squared plus y squared", ["replace the second exponent with three"], "x^{2} + y^{3}"],
  ["a x plus a y", ["factor out a"], "a \\left(x + y\\right)"],
  ["x plus y", ["factor out z"], { status: "cannot" }],
  ["x plus one equals two y", ["swap the sides"], "2 y = x + 1"],
  ["x less than y", ["swap the sides"], "y > x"],
  ["x squared", ["swap the sides"], { status: "cannot" }],
  ["x plus one", ["insert plus two at the end"], "x + 1 + 2"],
  ["x plus y", ["add times two at the end"], "(x + y) \\cdot 2"],
  ["x", ["insert two before x"], "2 x"],
  ["x", ["type plus one"], "x + 1"],
  ["two x", ["insert plus y after x"], "2 (x + y)"],
  ["x plus one", ["change the plus to minus"], "x - 1"],
  ["x times y", ["change the times to plus"], "x + y"],
  ["the square root of x end root plus one", ["replace the argument with x plus one"], "\\sqrt{x + 1} + 1"],
  ["one over x", ["move the cursor to the denominator", "replace it with x plus one"], "\\frac{1}{x + 1}"],
  ["x squared", ["replace the exponent with three", "undo"], "x^{2}"],
  ["x squared", ["replace the exponent with three", "undo", "redo"], "x^{3}"],
  ["x plus one", ["redo"], { status: "cannot" }],
  ["x plus x", ["replace every x with z"], "z + z"],
  ["x plus x", ["replace x with z"], { status: "choose" }],
  ["x plus one", ["wrap the whole thing in parentheses"], "\\left(x + 1\\right)"],
  ["x plus one", ["wrap the whole thing in parentheses", "delete the parentheses"], "x + 1"],
  ["sine of x", ["replace the argument with two x"], "\\sin(2 x)"],
  ["the sum from i equals one to n of i squared", ["replace the upper limit with m"], "\\sum_{i=1}^{m} i^{2}"],
  ["the integral from zero to one of x d x", ["replace the lower limit with a"], "\\int_{a}^{1} x \\, d x"],
  ["x squared plus one", ["take the square root of the whole thing"], "\\sqrt{x^{2} + 1}"],
  ["x plus one", ["put x under a square root"], "\\sqrt{x} + 1"],
  ["x over y", ["delete the denominator"], "x"],
  ["x squared", ["delete the exponent"], "x"],
  ["x sub i", ["replace the index with j"], "x_{j}"],
  ["x plus y", ["replace the second term with the quantity y minus one end quantity"], "x + (y - 1)"],
  ["x plus one", ["replace the numerator with two"], { status: "no-target" }],
  ["x minus y", ["delete x"], "-y"],
  ["x plus y equals z", ["select the left side", "wrap it in parentheses"], "\\left(x + y\\right) = z"],
  ["x plus y", ["move right", "replace it with z"], "x + z"],
  ["x plus y", ["move left", "delete it"], "y"],
  ["x squared", ["move down", "replace it with y"], "y^{2}"],
  ["x squared", ["move down", "move up", "wrap it in parentheses"], "\\left(x^{2}\\right)"],
  ["a over b", ["put the whole thing over c"], "\\frac{\\frac{a}{b}}{c}"],
  ["x squared plus two x minus one", ["delete the second term", "undo", "wrap the first term in absolute value"], "\\left|x^{2}\\right| + 2 x - 1"],
];
let suitePass = 0;
for (const [start, cmds, want] of SUITE) {
  const doc = new FormulaDoc(one(start)); let last = null, err = null;
  for (const c of cmds) {
    const r = parseCommand(c); if (r.status !== "ok") { err = `command not read: ${c}: ${r.reason}`; break; }
    last = execute(doc, r.frame); if (last.status !== "ok") break;
  }
  let ok;
  if (err) ok = false;
  else if (typeof want === "string") ok = last.status === "ok" && toLatex(doc.tree) === want;
  else ok = last.status === want.status;
  if (ok) suitePass++;
  check(`edit ${start} | ${cmds.join(" ; ")}`, ok, err || `${last.status} (${last.reason}) -> ${toLatex(doc.tree)}; want ${typeof want === "string" ? want : want.status}`);
}
// destructive edits show their target first: plan does not change the document
{
  const doc = new FormulaDoc(one("x squared plus one")), before = canonical(doc.tree);
  const p = plan(doc, parseCommand("delete the first term").frame);
  check("plan is side-effect free and flags destructive edits", p.status === "ok" && p.destructive && canonical(doc.tree) === before && p.paths.length === 1);
  check("every edit is one undo step", (() => { execute(doc, parseCommand("delete the first term").frame); return doc.undoStack.length === 1; })());
}
check(`depth of the spec example`, depth(one("x squared plus two x minus one all over two a")) === 4);

const total = pass + fails.length;
console.log(`formula: ${pass}/${total} checks passed; scripted edit suite ${suitePass}/${SUITE.length}${fails.length ? "; FAILED: " + fails.slice(0, 12).join(" || ") : ""}`);
process.exit(fails.length ? 1 : 0);
