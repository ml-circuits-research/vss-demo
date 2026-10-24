// bench.mjs — reading time per sentence in node after warm-up (spec 7.2): node app/tests/bench.mjs <export dir> <golden.json> [rounds]
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "../src/vss.js";
const [dir, goldenPath, roundsArg] = process.argv.slice(2), rounds = +(roundsArg || 4);
const sents = JSON.parse(readFileSync(goldenPath, "utf8")).items.map((g) => g.text);
const vss = await load(null, { readFile: async (n) => (n.endsWith(".json") ? readFileSync(join(dir, n), "utf8") : readFileSync(join(dir, n)).buffer.slice(0)) });
for (const s of sents.slice(0, 20)) vss.read(s);                    // warm-up (JIT, candidate caches)
const t = [], len = [];
for (let r = 0; r < rounds; r++) for (const s of sents) { const a = performance.now(); const o = vss.read(s); t.push(performance.now() - a); len.push(o.tokens.length); }
t.sort((a, b) => a - b);
const q = (p) => t[Math.min(t.length - 1, Math.floor(p * t.length))];
console.log(`bench: D ${vss.model.config.D}, ${t.length} readings (${sents.length} sentences x ${rounds}), mean ${(len.reduce((a, b) => a + b, 0) / len.length).toFixed(1)} tokens: median ${q(0.5).toFixed(2)} ms, p95 ${q(0.95).toFixed(2)} ms, max ${t[t.length - 1].toFixed(2)} ms`);
