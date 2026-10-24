// commands.js: execute a matheditor frame on a formula (spec 16.4), DOM-free and deterministic; every result carries its reason.
// A frame (from parse.parseCommand, or from the matheditor reader's wires through frameFromWires) is
//   {event, target: {head, attr, det} | null, owner, value: tree | null, word, wrapper, joiner, position, direction}
// plan(doc, frame)    -> {status: ok | choose | no-target | cannot, event, paths, candidates, reason, destructive, preview}
// execute(doc, frame, {choice}) -> the plan, applied as ONE transaction on the FormulaDoc when status is ok (undo / redo are history moves).
// Destructive edits (delete, replace, factor) have destructive: true: the view shows their target before applying (spec 16.4).
//
// Target descriptions are tree queries, answered by walking the tree:
//   a role name (numerator, denominator, exponent, base, index, argument, body, operand; "upper / lower limit") -> the nodes in that role,
//     restricted by "of <symbol>" to the nodes whose parent has that symbol in another role ("the exponent of x");
//   term / factor (+ ordinal) -> the terms of the shallowest sum (the factors of the shallowest product), in reading order;
//   left / right side -> the sides of the relation; the whole thing / formula / expression / everything -> the root;
//   an operator name (fraction, power, root, sum, product, integral, parentheses, plus, minus, times) -> those nodes, breadth-first;
//   a symbol (x, 2, pi) -> the leaves that are that symbol; it / that / this -> the last touched node, else the cursor;
//   the selection -> the selection; the cursor -> the cursor.
// Several matches without an ordinal and without every / all: status "choose" (the view highlights the candidates).
import { ROLES, RELATIONS, get, set, walk, bfs, readingOrder, isLeaf, children, node, hole, leaf, equal, pathKey, parentPath,
  fromWires } from "./tree.js";
import { toLatex } from "./latex.js";

const ROLE_HEADS = ["numerator", "denominator", "exponent", "base", "index", "argument", "body", "operand"];
const OP_HEADS = { fraction: ["fraction"], power: ["power"], root: ["root"], sum: ["sum"], product: ["product"], integral: ["integral"],
  parenthesis: ["paren"], parentheses: ["paren"], plus: ["plus"], minus: ["minus"], times: ["times"] };
const WHOLE = ["thing", "formula", "expression", "everything", "equation"];
const ORD = { first: 0, second: 1, third: 2, fourth: 3, fifth: 4 };
const BINARY_SWAPPABLE = ["plus", "minus", "times", "equals", "less", "greater", "approx"];
const show = (doc, p) => { const n = get(doc.tree, p); return n ? toLatex(n) : "?"; };
const where = (p) => (p.length ? p.join(" / ") : "the whole formula");

function chain(t, path, ops) {             // flatten a left/right chain of the given operators: [{path, node}]
  const n = get(t, path);
  if (!n || !ops.includes(n.op)) return [{ path, node: n }];
  return chain(t, path.concat("left"), ops).concat(chain(t, path.concat("right"), ops));
}
function shallowestChains(t, ops, within = []) {
  const out = []; let level = null;
  for (const x of bfs(get(t, within))) {
    const p = within.concat(x.path);
    if (level !== null && x.path.length > level) break;
    if (ops.includes(x.node.op) && !(x.path.length && ops.includes(get(t, parentPath(p)).op))) { level = x.path.length; out.push({ root: p, items: chain(t, p, ops) }); }
  }
  return out;
}
function pickOrdinal(list, attr) {
  if (!attr) return list;
  if (attr === "last") return list.length ? [list[list.length - 1]] : [];
  if (ORD[attr] !== undefined) return list[ORD[attr]] ? [list[ORD[attr]]] : [];
  return list;
}

/** the paths a target description denotes, with the reason */
export function resolve(doc, target, owner = null) {
  const t = doc.tree, h = target.head, a = target.attr;
  const all = target.det === "every" || target.det === "all" || target.det === "each";
  const out = (paths, reason) => ({ paths, reason, all });
  if (["it", "that", "this"].includes(h)) {
    const p = doc.lastTouched || doc.cursor || [];
    return out([p], `"${h}" = the last touched part (${where(p)})`);
  }
  if (h === "selection") return doc.selection ? out([doc.selection], "the selection") : out([], "nothing is selected");
  if (h === "cursor") return out([doc.cursor], "the cursor");
  if (WHOLE.includes(h) && (a === null || a === "whole")) return out([[]], "the whole formula");
  if (h === "side" || h === "sides") {
    if (!RELATIONS.includes(t.op)) return out([], "the formula is not a relation: it has no sides");
    if (h === "sides") return out([[]], "the relation (both sides)");
    if (a === "left" || a === "right") return out([[a]], `the ${a} side of the relation`);
    return out([["left"], ["right"]], "two sides");
  }
  if (h === "term" || h === "factor") {
    const chains = shallowestChains(t, h === "term" ? ["plus", "minus"] : ["times"]);
    if (!chains.length) return out([], `the formula has no ${h}s (no ${h === "term" ? "sum" : "product"})`);
    const picked = chains.flatMap((c) => pickOrdinal(c.items, a)).map((x) => x.path);
    return out(picked, `the ${a ? a + " " : ""}${h} of the shallowest ${h === "term" ? "sum" : "product"}${chains.length > 1 ? " (" + chains.length + " of them)" : ""}`);
  }
  if (h === "limit") {
    const role = a === "upper" ? "upper" : a === "lower" ? "lower" : null;
    const ps = walk(t).filter((x) => ["sum", "product", "integral"].includes(x.node.op) && x.node.lower)
      .flatMap((x) => (role ? [x.path.concat(role)] : [x.path.concat("lower"), x.path.concat("upper")]));
    return out(ps, `the ${a || ""} limit${role ? "" : "s"}`.replace("  ", " "));
  }
  if (ROLE_HEADS.includes(h)) {
    let ps = walk(t).filter((x) => x.path.length && x.path[x.path.length - 1] === h).map((x) => x.path);
    if (owner) {
      ps = ps.filter((p) => { const par = get(t, parentPath(p)); return children(par).some(([r, c]) => r !== h && isLeaf(c) && c.v === owner); });
      return out(pickOrdinal(ps, a), `the ${h} of ${owner}`);
    }
    return out(pickOrdinal(ps, a), `the ${a ? a + " " : ""}${h}${ps.length > 1 ? "s" : ""} in the formula`);
  }
  if (OP_HEADS[h]) {
    const ps = bfs(t).filter((x) => OP_HEADS[h].includes(x.node.op)).map((x) => x.path);
    return out(pickOrdinal(ps, a), `the ${a ? a + " " : ""}${h} node${ps.length > 1 ? "s" : ""}`);
  }
  // a symbol
  const sym = leaf(h);
  const ps = readingOrder(t).filter((x) => isLeaf(x.node) && x.node.op === sym.op && x.node.v === sym.v).map((x) => x.path);
  return out(pickOrdinal(ps, a), `the ${a ? a + " " : ""}occurrence${ps.length > 1 && !a ? "s" : ""} of ${h}`);
}

// ---------------------------------------------------------------- edits (pure: tree, path -> {tree, cursor})
function deleteAt(t, p) {
  const n = get(t, p);
  if (n.op === "paren" || n.op === "abs") return { tree: set(t, p, n.operand), cursor: p };     // remove the brackets, keep the content
  if (!p.length) return { tree: hole(), cursor: [] };
  const role = p[p.length - 1], pp = parentPath(p), par = get(t, pp);
  const keep = (r) => ({ tree: set(t, pp, par[r]), cursor: pp });
  switch (par.op) {
    case "plus": case "times": case "equals": case "less": case "greater": case "approx": case "implies":
      return keep(role === "left" ? "right" : "left");
    case "minus": return role === "right" ? keep("left") : { tree: set(t, pp, node("neg", { operand: par.right })), cursor: pp };
    case "power": case "subscript": return role === "base" ? { tree: set(t, p, hole()), cursor: p } : keep("base");
    case "fraction": return role === "denominator" ? keep("numerator") : { tree: set(t, p, hole()), cursor: p };
    case "root": return role === "index" ? { tree: set(t, p, undefined), cursor: pp } : { tree: set(t, p, hole()), cursor: p };
    case "integral": if (role === "lower" || role === "upper") return { tree: set(set(t, pp.concat("lower"), undefined), pp.concat("upper"), undefined), cursor: pp };
    // fall through
    default: return { tree: set(t, p, hole()), cursor: p };
  }
}
function wrapAt(t, p, wrapper, value) {
  const n = get(t, p);
  switch (wrapper) {
    case "parentheses": return { tree: set(t, p, node("paren", { operand: n })), cursor: p };
    case "abs": return { tree: set(t, p, node("abs", { operand: n })), cursor: p };
    case "root": return { tree: set(t, p, node("root", { argument: n })), cursor: p };
    case "fraction": return value ? { tree: set(t, p, node("fraction", { numerator: n, denominator: value })), cursor: p }
      : { tree: set(t, p, node("fraction", { numerator: n, denominator: hole() })), cursor: p.concat("denominator") };
    default: return null;
  }
}
function joinAt(t, p, value, joiner, before) {
  const n = get(t, p);
  if (n.op === "hole") return { tree: set(t, p, value), cursor: p };                  // typing into an empty slot
  const op = joiner === "over" ? "fraction" : (joiner || "times");
  const roles = op === "fraction" ? ["numerator", "denominator"] : ["left", "right"];
  const [a, b] = before ? [value, n] : [n, value];
  return { tree: set(t, p, node(op, { [roles[0]]: a, [roles[1]]: b })), cursor: p.concat(before ? roles[0] : roles[1]) };
}
function factorOut(t, p, f) {
  const terms = chain(t, p, ["plus", "minus"]);
  if (terms.length < 2) return { error: "the target is not a sum of terms" };
  const strip = (x) => {
    if (equal(x, f)) return leaf("1");
    if (x.op !== "times") return null;
    const fs = chain(x, [], ["times"]).map((y) => y.node), k = fs.findIndex((y) => equal(y, f));
    if (k < 0) return null;
    const rest = fs.filter((_, i) => i !== k);
    return rest.reduce((acc, y) => node("times", { left: acc, right: y }));
  };
  const sub = (x) => {
    if (x.op === "plus" || x.op === "minus") { const l = sub(x.left), r = sub(x.right); return l && r ? node(x.op, { left: l, right: r }) : null; }
    return strip(x);
  };
  const inner = sub(get(t, p));
  if (!inner) return { error: `not every term contains the factor ${toLatex(f)}` };
  return { tree: set(t, p, node("times", { left: f, right: node("paren", { operand: inner }) })), cursor: p };
}
function stepCursor(doc, dir) {
  const t = doc.tree, c = doc.cursor || [];
  if (dir === "up") return c.length ? { cursor: parentPath(c) } : { error: "the cursor is on the whole formula already" };
  if (dir === "down") { const cs = children(get(t, c)); return cs.length ? { cursor: c.concat(cs[0][0]) } : { error: "nothing inside this part" }; }
  const order = readingOrder(t).map((x) => pathKey(x.path)), k = order.indexOf(pathKey(c));
  const j = dir === "left" ? k - 1 : k + 1;
  if (j < 0 || j >= order.length) return { error: `nothing further ${dir}` };
  return { cursor: order[j] === "" ? [] : order[j].split("/") };
}

// ---------------------------------------------------------------- plan and execute
export function plan(doc, frame, opts = {}) {
  const ev = frame.event, res = { status: "ok", event: ev, paths: [], candidates: [], reason: "", destructive: ["delete", "replace", "factor"].includes(ev), preview: null };
  const fail = (status, reason) => Object.assign(res, { status, reason });
  if (ev === "undo") return doc.undoStack.length ? Object.assign(res, { reason: `undo "${doc.undoStack[doc.undoStack.length - 1].label}"` }) : fail("cannot", "nothing to undo");
  if (ev === "redo") return doc.redoStack.length ? Object.assign(res, { reason: `redo "${doc.redoStack[doc.redoStack.length - 1].label}"` }) : fail("cannot", "nothing to redo");
  // the target
  let paths = null, why = "";
  const needsTarget = !(ev === "insert" && !frame.target) && !(ev === "move" && frame.direction) && !(ev === "factor" && !frame.target) && !(ev === "swap");
  if (frame.target && ev !== "swap") {        // swap acts on the relation; its target ("the sides") is not a part to find
    const r = resolve(doc, frame.target, frame.owner); paths = r.paths; why = r.reason;
    if (!paths.length) return fail("no-target", `no part of the formula is ${why}`);
    if (paths.length > 1 && !r.all) {
      if (opts.choice !== undefined && paths[opts.choice]) paths = [paths[opts.choice]];
      else { res.candidates = paths; return fail("choose", `${paths.length} parts match (${why}): ${paths.map((p) => show(doc, p)).join(", ")}; say which`); }
    }
  } else if (ev === "insert") {
    paths = frame.position === "end" || frame.position === "start" ? [[]] : [doc.cursor || []]; why = frame.position ? "the whole formula" : "the cursor";
  } else if (ev === "factor") {
    const ch = shallowestChains(doc.tree, ["plus", "minus"]); if (!ch.length) return fail("cannot", "the formula has no sum to factor");
    paths = [ch[0].root]; why = "the shallowest sum";
  } else if (ev === "swap") { paths = [[]]; why = "the relation"; }
  else if (needsTarget) return fail("no-target", `${ev} needs a target`);
  res.paths = paths || []; let tree = doc.tree, cursor = doc.cursor, selection = doc.selection;
  const apply = (fn) => { for (const p of [...res.paths].sort((x, y) => y.length - x.length)) { const r = fn(tree, p); if (r.error) return r.error; tree = r.tree; cursor = r.cursor; } return null; };
  let err = null;
  switch (ev) {
    case "replace":
      if (frame.word) {
        const op = { plus: "plus", minus: "minus", times: "times", equals: "equals" }[frame.word];
        err = apply((t, p) => { const n = get(t, p); return BINARY_SWAPPABLE.includes(n.op) && op ? { tree: set(t, p, Object.assign({}, n, { op })), cursor: p } : { error: `${show(doc, p)} is not an operator that can become ${frame.word}` }; });
        res.reason = `${why}: the operator becomes ${frame.word}`;
      } else if (frame.value) { err = apply((t, p) => ({ tree: set(t, p, frame.value), cursor: p })); res.reason = `${why} := ${toLatex(frame.value)}`; }
      else err = "replace: no value";
      break;
    case "delete": err = apply(deleteAt); res.reason = `delete ${why}`; break;
    case "wrap":
      err = apply((t, p) => wrapAt(t, p, frame.wrapper, frame.value) || { error: `unknown wrapper ${frame.wrapper}` });
      res.reason = `${why}: wrapped in ${frame.wrapper === "fraction" ? "a fraction" + (frame.value ? " over " + toLatex(frame.value) : "") : frame.wrapper}`; break;
    case "insert": {
      if (!frame.value) { err = "insert: nothing to insert"; break; }
      const before = frame.position === "before" || frame.position === "start";
      err = apply((t, p) => joinAt(t, p, frame.value, frame.joiner, before));
      res.reason = `${toLatex(frame.value)} inserted ${before ? "before" : "after"} ${why}${frame.joiner ? " with " + frame.joiner : ""}`; break;
    }
    case "move":
      if (frame.direction) { const r = stepCursor(doc, frame.direction); if (r.error) err = r.error; else { cursor = r.cursor; res.reason = `cursor ${frame.direction} to ${where(cursor)}`; } }
      else { cursor = res.paths[0]; res.reason = `cursor to ${why} (${where(cursor)})`; }
      break;
    case "select": selection = res.paths[0]; cursor = res.paths[0]; res.reason = `selected ${why}`; break;
    case "factor": {
      if (!frame.value) { err = "factor: no factor given"; break; }
      err = apply((t, p) => factorOut(t, p, frame.value)); res.reason = `${toLatex(frame.value)} factored out of ${why}`; break;
    }
    case "swap": {
      const n = tree; if (!RELATIONS.includes(n.op) || n.op === "implies") { err = "the formula is not an equation or inequality"; break; }
      const op = n.op === "less" ? "greater" : n.op === "greater" ? "less" : n.op;
      tree = node(op, { left: n.right, right: n.left }); cursor = []; res.reason = "the two sides swapped" + (op !== n.op ? ` (${n.op} becomes ${op})` : ""); break;
    }
    default: err = `unknown event ${ev}`;
  }
  if (err) return fail("cannot", err);
  res.preview = { tree, cursor, selection };
  return res;
}

export function execute(doc, frame, opts = {}) {
  const p = plan(doc, frame, opts);
  if (p.status !== "ok") return p;
  if (p.event === "undo") { doc.undo(); return p; }
  if (p.event === "redo") { doc.redo(); return p; }
  if (p.event === "move" || p.event === "select") {
    doc.cursor = p.preview.cursor; doc.selection = p.preview.selection; doc.lastTouched = p.preview.cursor; return p;
  }
  doc.transact(p.event, p.reason, { tree: p.preview.tree, cursor: p.preview.cursor, selection: null, lastTouched: p.preview.cursor });
  return p;
}

// ---------------------------------------------------------------- the reader's wires -> a frame
/** wires: [{id, type, lines: [[key, value]]}] of one command (the matheditor world's SOP); returns the frame of the top wire */
export function frameFromWires(wires) {
  const by = new Map(wires.map((w) => [w.id, w])), top = wires[0], g = (k) => (top.lines.find(([kk]) => kk === k) || [])[1];
  const f = { event: top.type, target: null, owner: g("owner") || null, value: null, word: null, wrapper: g("wrapper") || null,
    joiner: g("joiner") || null, position: g("position") || null, direction: g("direction") || null };
  const tv = g("target");
  if (tv && tv.startsWith("$")) {
    const e = by.get(tv.slice(1)), eg = (k) => (e.lines.find(([kk]) => kk === k) || [])[1] || null;
    f.target = { head: eg("head"), attr: eg("attr"), det: eg("det") };
  }
  const v = g("value");
  if (v !== undefined) {
    if (["plus", "minus", "times", "over", "equals"].includes(v)) f.word = v; else f.value = fromWires(v, by);
  }
  return f;
}
export { ROLES };

// ---------------------------------------------------------------- one typed or spoken input on a formula widget (no model loaded)
/** the fallback path when no matheditor model is loaded (labelled source: "reference parser"): a command if the reference command reader
 *  reads one, else formula content. Content replaces a hole at the cursor, or the whole formula when the formula is empty. An ambiguous
 *  formula is returned with its readings and NOT applied: the editor asks (pickReading). Returns {kind, status, reason, source, ...}. */
export function handleInput(doc, text, parsers) {
  const { parseCommand, parseFormula, SOURCE } = parsers;
  const c = parseCommand(text);
  if (c.status === "ok") { const p = execute(doc, c.frame); return { kind: "command", source: SOURCE, frame: c.frame, status: p.status, reason: p.reason, plan: p }; }
  if (c.status === "ambiguous") return { kind: "command", source: SOURCE, frame: c.frame, status: "ambiguous", readings: c.readings, reason: "the value of the command has several readings: say which" };
  const f = parseFormula(text);
  if (f.status === "no-parse") return { kind: "none", source: SOURCE, status: "no-parse", reason: `not a command (${c.reason}) and not a formula (${f.reason})` };
  if (f.status === "ambiguous") return { kind: "formula", source: SOURCE, status: "ambiguous", readings: f.readings, reason: f.reason };
  return Object.assign(insertContent(doc, f.readings[0].tree), { kind: "formula", source: SOURCE, readings: f.readings });
}
/** apply the chosen reading of an ambiguous formula as content */
export function pickReading(doc, readings, k) {
  if (!readings[k]) return { status: "cannot", reason: `there is no reading ${k + 1}` };
  return Object.assign(insertContent(doc, readings[k].tree), { reason: `reading ${k + 1} of ${readings.length} chosen` });
}
function insertContent(doc, tree) {
  const at = doc.tree.op === "hole" ? [] : (get(doc.tree, doc.cursor || []) || {}).op === "hole" ? doc.cursor : [];
  doc.transact("dictate", at.length ? `content into the empty slot at ${where(at)}` : "the formula", { tree: set(doc.tree, at, tree), cursor: at, lastTouched: at });
  return { status: "ok", reason: at.length ? `content written into the empty slot (${where(at)})` : "the formula written" };
}
