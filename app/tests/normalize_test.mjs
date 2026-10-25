// normalize_test.mjs: the JavaScript normalizer reproduces the Python one exactly.
// Usage: python3 training/worlds/diagram/normalize_golden.py > /tmp/golden.jsonl && node app/tests/normalize_test.mjs /tmp/golden.jsonl
//        node app/tests/normalize_test.mjs training/worlds/diagram_ro/normalize_golden.jsonl training/worlds/diagram_ro/normalize.json
// The second argument (a normalizer table) defaults to the English diagram world's table.
import fs from "node:fs";
import path from "node:path";
import { createNormalizer } from "../src/normalize.js";
const tablePath = process.argv[3] ? path.resolve(process.argv[3]) : new URL("../../training/worlds/diagram/normalize.json", import.meta.url);
const T = JSON.parse(fs.readFileSync(tablePath, "utf8"));
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
