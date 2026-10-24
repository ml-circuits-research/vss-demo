// e2e.mjs: the editor's pipeline without a browser, on the installed model (app/model/): normalizer -> corrector -> reader -> clearest
// reading -> dialog -> planner -> execute, on scripted sentences. With a development model this checks the WIRING (it runs, and frames
// reach the planner), not accuracy; the accuracy rows are the DGX's (training/TODO_DGX.md). Usage: node app/tests/e2e.mjs [--verbose]
import fs from "node:fs";
import { createAssets } from "../src/assets.js";
import { loadWorlds, lexiconOf } from "../src/worlds.js";
import { createNormalizer } from "../src/normalize.js";
import { createCorrector } from "../src/correct.js";
import { chooseClearest } from "../src/speech.js";
import { decide } from "../src/dialog.js";
import { createScene } from "../src/editor/scene.js";
import { plan, execute } from "../src/editor/planner.js";
const root = new URL("../", import.meta.url);
const assets = createAssets({ bundle: null, readFile: async (p, as) => (as === "text" ? fs.readFileSync(new URL(p, root), "utf8") : fs.readFileSync(new URL(p, root))) });
if (!fs.existsSync(new URL("model/index.json", root))) { console.log("e2e: no model installed (app/model/index.json): skipped"); process.exit(0); }
const { worlds, errors } = await loadWorlds(assets); const W = worlds.get("diagram");
if (!W) { console.log("e2e: FAIL no diagram world", errors); process.exit(1); }
const normalize = createNormalizer(await assets.json("model/diagram/normalize.json"));
const corr = createCorrector({ lexicon: lexiconOf(W) });
const scene = createScene(); const verbose = process.argv.includes("--verbose");
const script = ["add a database called orders in the top left", "put a yellow note below the database", "draw a red circle",
  "conect the note to the database", "make it blue", "please undo", "add three boxes", "arrange everything as a flow from left to right", "frobnicate the quux"];
let ran = 0, executed = 0, statuses = {};
for (const s of script) {
  const n = normalize(s); const c = corr.correct(n.tokens);
  const choice = chooseClearest(c.alternatives.map((v, i) => ({ input: v.join(" "), info: n.info, corrections: i ? [] : c.corrections, result: W.vss.read(v.join(" ")) })));
  const b = choice.best; const p = ["ok", "abstain"].includes(b.result.status) ? plan(scene, b.result.frame, b.info) : null;
  const d = decide({ result: b.result, plan: p, corrections: b.corrections, tau: W.tau, legend: W.legend });
  if (d.action === "execute") { execute(scene, p); executed++; }
  ran++; statuses[b.result.status] = (statuses[b.result.status] || 0) + 1;
  if (verbose) console.log(`${s}\n  -> ${b.input} | ${b.result.status} ${b.result.frame.event} ${JSON.stringify(b.result.frame.roles)}\n  -> ${d.action}: ${d.line}`);
}
console.log(`e2e (${W.status} model, D ${W.vss.model.config.D}): ${ran} sentences ran, ${executed} executed, statuses ${JSON.stringify(statuses)}, ${scene.components.size} components; wiring only, not a measurement`);
