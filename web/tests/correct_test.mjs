// correct_test.mjs: smoke evaluation of the correctors (spec 15, rows "Typing noise" and "Clean input"; the recorded speech set is for
// the DGX session). Inputs: a world folder (kinds.tsv + examples/train.sop for the lexicon and its frequencies) and a JSONL of noisy
// sentences from tool/worlds_src/diagram/noise.py ({clean, noisy, edits}). Prints token correction accuracy on the edited tokens, the
// share of sentences restored exactly, and false corrections on the clean sentences. Smoke numbers are not results.
// Usage: node web/tests/correct_test.mjs <world dir> <noisy.jsonl> [typed|speech]
import fs from "node:fs";
import { createRequire } from "node:module";
import { createCorrector } from "../correct.js";
import { createNormalizer } from "../normalize.js";
const require = createRequire(import.meta.url);
const Typo = require("../vendor/typo/typo.js");
const [world, noisyPath, mode = "typed"] = process.argv.slice(2);
const lex = {};
for (const l of fs.readFileSync(`${world}/kinds.tsv`, "utf8").split("\n")) { if (!l || l.startsWith("#")) continue; lex[l.split("\t")[0]] = 0; }
for (const l of fs.readFileSync(`${world}/examples/train.sop`, "utf8").split("\n")) if (l.startsWith("_text=")) for (const t of l.slice(6).split(" ")) if (t in lex) lex[t] += 1;
const dictDir = new URL("../vendor/typo/en_US/", import.meta.url);
const typo = new Typo("en_US", fs.readFileSync(new URL("en_US.aff", dictDir), "utf8"), fs.readFileSync(new URL("en_US.dic", dictDir), "utf8"));
const corr = createCorrector({ lexicon: lex, isEnglish: (w) => /^[a-z]+$/.test(w) && typo.check(w) });
const normalize = createNormalizer(JSON.parse(fs.readFileSync(new URL("../../tool/worlds_src/diagram/normalize.json", import.meta.url))));
const rows = fs.readFileSync(noisyPath, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
let exact = 0, clean_false = 0, clean_tok = 0, t0 = Date.now(); const byOp = {};
for (const r of rows) {
  const out = corr.correct(normalize(r.noisy).tokens, { mode });            // the real order: normalizer, then corrector
  const ok = out.alternatives.some((a) => a.join(" ") === r.clean); if (ok) exact++;
  const op = (r.edits[0] || {}).op || "none"; byOp[op] = byOp[op] || [0, 0]; byOp[op][0]++; if (ok) byOp[op][1]++;
  const c = corr.correct(r.clean.split(" "), { mode }); clean_tok += r.clean.split(" ").length; clean_false += c.corrections.length;
}
const ms = (Date.now() - t0) / (2 * rows.length);
console.log("restored per kind of error [n, restored]:", JSON.stringify(byOp), "(a dropped word cannot be restored by a corrector: the reader reads without it)");
console.log(`correct (${mode}): ${rows.length} sentences; restored exactly (best or one of the alternatives) ${(exact / rows.length).toFixed(3)}; false corrections on clean input ${(clean_false / clean_tok).toFixed(4)} of tokens; ${ms.toFixed(2)} ms per sentence (node)`);
