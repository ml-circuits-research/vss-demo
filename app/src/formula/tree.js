// tree.js: the formula tree of a formula widget (spec 16.1-16.2), DOM-free. A node is a plain object:
//   leaves   {op: "num", v: "2"} | {op: "var", v: "x"} | {op: "const", v: "pi"} | {op: "hole"} (an empty slot, e.g. a new denominator)
//   nodes    {op, <role>: node, ...} with the roles of ROLES[op] (the tree roles of the matheditor legend, spec Table 11);
//            apply also carries function: "sin" (a word, not a node); root may omit index (square root).
// A node is addressed by its PATH: the list of role names from the root ([] = the whole formula). The cursor and the selection are paths.
// Every edit is a TRANSACTION on a FormulaDoc (one undo step, with its label and reason); trees are never mutated in place.

export const ROLES = {
  plus: ["left", "right"], minus: ["left", "right"], times: ["left", "right"],
  fraction: ["numerator", "denominator"], power: ["base", "exponent"], subscript: ["base", "index"],
  root: ["index", "argument"], apply: ["argument"], paren: ["operand"], abs: ["operand"], neg: ["operand"],
  sum: ["index", "lower", "upper", "body"], product: ["index", "lower", "upper", "body"], integral: ["lower", "upper", "body", "index"],
  equals: ["left", "right"], less: ["left", "right"], greater: ["left", "right"], approx: ["left", "right"], implies: ["left", "right"],
};
export const OPTIONAL = { root: ["index"], integral: ["lower", "upper"] };
export const LEAVES = ["num", "var", "const", "hole"];
export const RELATIONS = ["equals", "less", "greater", "approx", "implies"];
export const FUNCTIONS = ["sin", "cos", "tan", "log", "ln", "exp", "f", "g", "h"];
export const CONSTANTS = ["pi", "e", "infinity"];
export const GREEK = ["alpha", "beta", "gamma", "delta", "theta", "lambda", "mu", "sigma", "phi", "omega", "psi", "rho"];
export const LATIN = ["a", "b", "c", "i", "j", "k", "m", "n", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

// ---------------------------------------------------------------- constructors
export const num = (v) => ({ op: "num", v: String(v) });
export const vr = (v) => ({ op: "var", v });
export const cst = (v) => ({ op: "const", v });
export const hole = () => ({ op: "hole" });
export function leaf(word) {
  const w = String(word);
  if (/^\d+$/.test(w)) return num(w);
  if (CONSTANTS.includes(w)) return cst(w);
  return vr(w);
}
export function node(op, roles = {}) {
  if (!ROLES[op]) throw new Error(`unknown operator ${op}`);
  const n = { op };
  if (op === "apply") n.function = roles.function;
  for (const r of ROLES[op]) if (roles[r] !== undefined && roles[r] !== null) n[r] = roles[r];
  return n;
}
export const isLeaf = (t) => LEAVES.includes(t.op);
export const children = (t) => (isLeaf(t) ? [] : ROLES[t.op].filter((r) => t[r] !== undefined).map((r) => [r, t[r]]));

// ---------------------------------------------------------------- canonical form, equality, depth
export function canonical(t) {
  if (t === null || typeof t !== "object") return JSON.stringify(t);
  if (Array.isArray(t)) return "[" + t.map(canonical).join(",") + "]";
  return "{" + Object.keys(t).sort().map((k) => JSON.stringify(k) + ":" + canonical(t[k])).join(",") + "}";
}
export const equal = (a, b) => canonical(a) === canonical(b);
export const clone = (t) => JSON.parse(JSON.stringify(t));
/** depth = number of operator levels: a leaf 0, a node 1 + the deepest child */
export function depth(t) { return isLeaf(t) ? 0 : 1 + Math.max(0, ...children(t).map(([, c]) => depth(c))); }
export function size(t) { return 1 + children(t).reduce((s, [, c]) => s + size(c), 0); }

// ---------------------------------------------------------------- paths
export function get(t, path) { let x = t; for (const r of path) { if (!x || x[r] === undefined) return undefined; x = x[r]; } return x; }
/** a new tree with the node at path replaced by sub (sub === undefined removes an optional role) */
export function set(t, path, sub) {
  if (!path.length) return sub;
  const [r, ...rest] = path, out = Object.assign({}, t);
  if (!rest.length && sub === undefined) delete out[r]; else out[r] = set(t[r], rest, sub);
  return out;
}
export const parentPath = (p) => p.slice(0, -1);
export const pathKey = (p) => p.join("/");
export const keyPath = (k) => (k === "" ? [] : k.split("/"));
export const samePath = (a, b) => a && b && pathKey(a) === pathKey(b);
/** every node with its path, pre-order (node first, then its children in reading order) */
export function walk(t, path = [], out = []) {
  out.push({ path, node: t });
  for (const [r, c] of children(t)) walk(c, path.concat(r), out);
  return out;
}
/** breadth-first: shallower nodes first, siblings in reading order */
export function bfs(t) {
  const out = [], q = [{ path: [], node: t }];
  while (q.length) { const x = q.shift(); out.push(x); for (const [r, c] of children(x.node)) q.push({ path: x.path.concat(r), node: c }); }
  return out;
}
/** reading order (how the formula is read aloud / laid out left to right): infix nodes in-order, prefix nodes first */
const INFIX = new Set(["plus", "minus", "times", "fraction", "power", "subscript", ...RELATIONS]);
export function readingOrder(t, path = [], out = []) {
  const cs = children(t);
  if (INFIX.has(t.op) && cs.length === 2) {
    readingOrder(cs[0][1], path.concat(cs[0][0]), out); out.push({ path, node: t }); readingOrder(cs[1][1], path.concat(cs[1][0]), out);
  } else { out.push({ path, node: t }); for (const [r, c] of cs) readingOrder(c, path.concat(r), out); }
  return out;
}

// ---------------------------------------------------------------- precedence, shared by latex.js and mathml.js
// prec: how loosely a node binds when written inline (lower = looser). Atoms (leaves, fractions, roots, groups) are 100.
export function prec(t) {
  switch (t.op) {
    case "implies": return 5;
    case "equals": case "less": case "greater": case "approx": return 10;
    case "plus": case "minus": return 20;
    case "neg": return 25;
    case "sum": case "product": return 27;
    case "times": return 30;
    case "power": case "subscript": return 60;
    default: return 100;
  }
}
const ATOMIC_BASE = new Set(["num", "var", "const", "hole", "paren", "abs"]);
/** must the child at role `role` of `parent` be wrapped in automatic (grouping) parentheses when written inline? */
export function needsParens(parent, role, child) {
  const p = parent.op, c = prec(child);
  switch (p) {
    case "plus": case "minus":
      return role === "left" ? c < 20 : (c <= 20 || child.op === "neg");
    case "times":
      if (child.op === "sum" || child.op === "product") return true;
      return role === "left" ? c < 30 : c <= 30;
    case "neg": return c < 30 && child.op !== "neg" || child.op === "sum" || child.op === "product";
    case "power": return role === "base" ? !(ATOMIC_BASE.has(child.op) || child.op === "subscript") : false;
    case "subscript": return role === "base" ? !ATOMIC_BASE.has(child.op) : false;
    case "sum": case "product": return role === "body" ? c < 30 && child.op !== "neg" || child.op === "sum" || child.op === "product" : false;
    case "equals": case "less": case "greater": case "approx":
      return role === "left" ? c < 10 : c <= 10;
    case "implies": return role === "left" ? c < 5 : c <= 5;
    default: return false;
  }
}

// ---------------------------------------------------------------- MathJSON (spec 16.1: the stored form of a formula widget)
const MJ = { plus: "Add", minus: "Subtract", times: "Multiply", fraction: "Divide", power: "Power", subscript: "Subscript", paren: "Delimiter",
  abs: "Abs", neg: "Negate", sum: "Sum", product: "Product", integral: "Integrate", equals: "Equal", less: "Less", greater: "Greater",
  approx: "Approx", implies: "Implies" };
const MJ_FN = { sin: "Sin", cos: "Cos", tan: "Tan", log: "Log", ln: "Ln", exp: "Exp" };
const MJ_CONST = { pi: "Pi", e: "ExponentialE", infinity: "PositiveInfinity" };
export function toMathJSON(t) {
  const m = toMathJSON;
  switch (t.op) {
    case "num": return Number(t.v);
    case "var": return t.v;
    case "const": return MJ_CONST[t.v];
    case "hole": return "Nothing";
    case "root": return t.index ? ["Root", m(t.argument), m(t.index)] : ["Sqrt", m(t.argument)];
    case "apply": return [MJ_FN[t.function] || t.function, m(t.argument)];
    case "sum": case "product": return [MJ[t.op], m(t.body), ["Triple", m(t.index), m(t.lower), m(t.upper)]];
    case "integral": return ["Integrate", m(t.body), t.lower ? ["Triple", m(t.index), m(t.lower), m(t.upper)] : m(t.index)];
    default: return [MJ[t.op], ...children(t).map(([, c]) => m(c))];
  }
}

// ---------------------------------------------------------------- SOP wires of a tree (the matheditor world's gold, spec 16.2)
/** the wires of a tree as [{id, type, lines: [[key, value]]}]; a leaf is a word value, a node is a wire referenced as $id */
export function toWires(t, ids, out = []) {
  if (isLeaf(t)) return { value: t.op === "hole" ? "~" : t.v, wires: out };
  const w = { id: ids.next().value, type: t.op, lines: [] }; out.push(w);
  if (t.op === "apply") w.lines.push(["function", t.function]);
  for (const [r, c] of children(t)) w.lines.push([r, toWires(c, ids, out).value]);
  return { value: "$" + w.id, wires: out };
}
/** the tree of a wire (inverse of toWires): byId maps an id to {type, lines: [[key, value]]}; value "$id" is a reference */
export function fromWires(value, byId) {
  if (typeof value !== "string") throw new Error("bad value");
  if (value === "~") return hole();
  if (!value.startsWith("$")) return leaf(value);
  const w = byId.get(value.slice(1)); if (!w) throw new Error(`dangling reference ${value}`);
  const roles = {}; for (const [k, v] of w.lines) if (!k.startsWith("_")) roles[k] = k === "function" ? v : fromWires(v, byId);
  return node(w.type, roles);
}

// ---------------------------------------------------------------- the document: tree + cursor + selection + history
export class FormulaDoc {
  constructor(tree = hole()) {
    this.tree = tree; this.cursor = []; this.selection = null; this.lastTouched = null; this.undoStack = []; this.redoStack = [];
  }
  snapshot() { return { tree: this.tree, cursor: this.cursor, selection: this.selection, lastTouched: this.lastTouched }; }
  restore(s) { Object.assign(this, { tree: s.tree, cursor: s.cursor, selection: s.selection, lastTouched: s.lastTouched }); }
  /** one undoable transaction: change = {tree?, cursor?, selection?, lastTouched?}; label and reason are kept for the explanation panel */
  transact(label, reason, change) {
    const before = this.snapshot();
    const after = Object.assign({}, before, change);
    if (after.cursor && get(after.tree, after.cursor) === undefined) after.cursor = [];
    this.restore(after); this.undoStack.push({ label, reason, before, after }); this.redoStack = [];
    return { label, reason };
  }
  undo() { const t = this.undoStack.pop(); if (!t) return null; this.redoStack.push(t); this.restore(t.before); return t; }
  redo() { const t = this.redoStack.pop(); if (!t) return null; this.undoStack.push(t); this.restore(t.after); return t; }
  /** a cursor or selection move is not an edit: it is not on the undo stack */
  moveCursor(path) { this.cursor = path; this.lastTouched = path; }
  toJSON() { return { tree: this.tree, mathjson: toMathJSON(this.tree), cursor: this.cursor, selection: this.selection }; }
}
