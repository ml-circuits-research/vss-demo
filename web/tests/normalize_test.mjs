// normalize_test.mjs: the JavaScript normalizer reproduces the Python one exactly.
// Usage: python3 tool/worlds_src/diagram/normalize_golden.py > /tmp/golden.jsonl && node web/tests/normalize_test.mjs /tmp/golden.jsonl
import fs from "node:fs";
import { createNormalizer } from "../normalize.js";
const T = JSON.parse(fs.readFileSync(new URL("../../tool/worlds_src/diagram/normalize.json", import.meta.url)));
const normalize = createNormalizer(T);
const lines = fs.readFileSync(process.argv[2], "utf8").split("\n").filter(Boolean);
let ok = 0, bad = [];
for (const l of lines) {
  const g = JSON.parse(l); const r = normalize(g.surface);
  const same = JSON.stringify(r.tokens) === JSON.stringify(g.tokens) && JSON.stringify(r.info) === JSON.stringify(g.info);
  if (same) ok++; else if (bad.length < 5) bad.push({ surface: g.surface, py: g.tokens, js: r.tokens, pyinfo: g.info, jsinfo: r.info });
}
console.log(`normalize parity: ${ok}/${lines.length} identical`);
if (bad.length) { console.log(JSON.stringify(bad, null, 1)); process.exit(1); }
