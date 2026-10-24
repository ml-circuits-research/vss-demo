// parse_batch.mjs: the bridge from generate.py to the app's reference parser and command executor (app/src/formula/), so that the
// world's gold and the app use ONE implementation of the scope rule. Usage: node parse_batch.mjs <in.jsonl> <out.jsonl>
// Input lines: {"id", "kind": "formula", "text"} | {"id", "kind": "command", "text"} | {"id", "kind": "edit", "context": tree, "frame": frame}
// Output lines: {"id", "tokens", "status", "readings": [tree], "reason"} | {..., "frame"} | {"id", "status", "after": tree, "reason", "latex_before", "latex_after"}
import fs from "node:fs";
import { parseFormula, parseCommand } from "../../../app/src/formula/parse.js";
import { FormulaDoc } from "../../../app/src/formula/tree.js";
import { execute } from "../../../app/src/formula/commands.js";
import { toLatex } from "../../../app/src/formula/latex.js";

const [inp, outp] = process.argv.slice(2);
const lines = fs.readFileSync(inp, "utf8").split("\n").filter(Boolean), out = [];
for (const l of lines) {
  const q = JSON.parse(l);
  if (q.kind === "formula") {
    const r = parseFormula(q.text);
    out.push({ id: q.id, tokens: r.tokens, status: r.status, readings: r.readings.map((x) => x.tree), reason: r.reason });
  } else if (q.kind === "command") {
    const r = parseCommand(q.text);
    out.push({ id: q.id, tokens: r.tokens, status: r.status, frame: r.frame, reason: r.reason });
  } else if (q.kind === "edit") {
    const doc = new FormulaDoc(q.context), p = execute(doc, q.frame);
    out.push({ id: q.id, status: p.status, after: doc.tree, reason: p.reason, latex_before: toLatex(q.context), latex_after: toLatex(doc.tree) });
  } else out.push({ id: q.id, status: "bad-request" });
}
fs.writeFileSync(outp, out.map((x) => JSON.stringify(x)).join("\n") + "\n");
