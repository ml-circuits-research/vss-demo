// typos.mjs: D29 / D30. For each diagram verb of the legend (every event, every verb) a cost-1 typo (a deletion, a transposition, a substitution) is run
// through the typed corrector the way main.js and routes.js run it (normalizer, then corrector over the lexicon of the installed world with the
// Hunspell en_US check) and the corrected VARIANT SET must contain the verb: the reader (whose installed model decides readings) is not involved,
// so the check does not depend on the model. The same for the polite prefix families ("pls", "coud you", "i wnat you to", "lets" ...), and for a
// typo that is itself an English word ("crate"): both readings are offered. Usage: node app/tests/typos.mjs [--verbose]
import fs from "node:fs";
import { createRequire } from "node:module";
import { createAssets } from "../src/assets.js";
import { loadWorlds, lexiconOf } from "../src/worlds.js";
import { createNormalizer } from "../src/normalize.js";
import { createCorrector, osa } from "../src/correct.js";
const require = createRequire(import.meta.url); const Typo = require("../vendor/typo/typo.js");
const root = new URL("../", import.meta.url);
if (!fs.existsSync(new URL("model/index.json", root))) { console.log("typos: no model installed (app/model/index.json): skipped"); process.exit(0); }
const assets = createAssets({ bundle: null, readFile: async (p, as) => (as === "text" ? fs.readFileSync(new URL(p, root), "utf8") : fs.readFileSync(new URL(p, root))) });
const { worlds } = await loadWorlds(assets); const W = worlds.get("diagram");
const dd = new URL("vendor/typo/en_US/", root);
const typo = new Typo("en_US", fs.readFileSync(new URL("en_US.aff", dd), "utf8"), fs.readFileSync(new URL("en_US.dic", dd), "utf8"));
const isEnglish = (w) => /^[a-z]+$/.test(w) && typo.check(w);
const normalize = createNormalizer(await assets.json("model/diagram/normalize.json"));
const lex = lexiconOf(W); const corr = createCorrector({ lexicon: lex, isEnglish });
const verbose = process.argv.includes("--verbose");
const variantsOf = (text) => corr.correct(normalize(text).tokens, { mode: "typed" }).alternatives.map((v) => v.join(" "));   // as routes.js reads them
let pass = 0, fail = 0; const bad = [];
const check = (name, ok, detail) => { if (ok) pass++; else { fail++; bad.push(`${name}: ${detail}`); } if (verbose) console.log(`${ok ? "pass" : "FAIL"}  ${name}${ok ? "" : "  " + detail}`); };

// typos of one word: deletion of the last letter, transposition of the 2nd and 3rd... (the first transposable pair after the first letter),
// substitution of a middle letter by a letter that is not a keyboard neighbour. Each is cost <= 1 from the word; none is in the lexicon.
function typosOf(w) {
  const out = []; const n = w.length;
  out.push(["deletion", w.slice(0, n - 1)]);
  for (let i = 1; i + 1 < n; i++) if (w[i] !== w[i + 1]) { out.push(["transposition", w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2)]); break; }
  const i = Math.min(2, n - 1); const sub = "zqxjk".split("").find((c) => c !== w[i]);
  out.push(["substitution", w.slice(0, i) + sub + w.slice(i + 1)]);
  return out.filter(([, t]) => t.length >= 2 && t !== w && !(t in lex) && osa(t, w) <= 1);
}

const events = W.vss.model.legend.events;
const rows = [];
for (const e of events) {
  for (const verb of e.verbs) {
    for (const [kind, typo] of typosOf(verb)) {
      const text = `${typo} a blue box`; const vs = variantsOf(text); const want = `${verb} a blue box`;
      const ok = vs.includes(want); check(`verb ${verb} (${kind}: ${typo})`, ok, `variants ${JSON.stringify(vs)}`);
      if (verb === e.verbs[0]) rows.push(`${ok ? "pass" : "FAIL"}  ${e.id || e.name || verb}: ${verb} <- ${typo} (${kind})`);
    }
  }
}
// the prefix families (please, could you, I want you to, lets ...): the typo is read as the family word
const prefixes = [["pls", "please"], ["plz", "please"], ["pleas", "please"], ["plase", "please"], ["coud you", "could you"], ["cuold you", "could you"], ["culd you", "could you"],
  ["wuld you", "would you"], ["can yuo", "can you"], ["cna you", "can you"], ["i wnat you to", "i want you to"], ["i wan you to", "i want you to"], ["i wat you to", "i want you to"],
  ["i wnat to", "i want to"], ["i nede you to", "i need you to"], ["lest", "lets"], ["let's", "lets"], ["lets", "lets"], ["leets", "lets"], ["go ahed and", "go ahead and"], ["pleaes", "please"]];
for (const [typed, right] of prefixes) {
  const vs = variantsOf(`${typed} create a blue box`); const want = normalize(`${right} create a blue box`).tokens.join(" ");
  check(`prefix "${typed}"`, vs.includes(want), `wanted "${want}", variants ${JSON.stringify(vs)}`);
}
// a typo that is an English word: both readings are offered (create wins in the editor because the other one is no-sense)
const crate = variantsOf("crate a blue box");
check("crate offers crate and create", crate.includes("crate a blue box") && crate.includes("create a blue box"), JSON.stringify(crate));
const creat = corr.correct(normalize("creat a blue box").tokens);
check("creat reads create, the correction recorded", creat.alternatives[0].join(" ") === "create a blue box" && creat.alternativeCorrections[0].some((c) => c.from === "creat" && c.to === "create"), JSON.stringify(creat.alternativeCorrections));
const cr = corr.correct(normalize("crate a blue box").tokens); const k = cr.alternatives.findIndex((v) => v[0] === "create");
check("crate: the create variant carries its correction", k > 0 && cr.alternativeCorrections[k].some((c) => c.from === "crate" && c.to === "create"), JSON.stringify(cr.alternativeCorrections));
check("no correction on a clean command", corr.correct(normalize("create a blue box").tokens).corrections.length === 0, "");
if (verbose) console.log(rows.join("\n"));
console.log(`typos: ${pass} checks passed, ${fail} failed (${events.length} events, ${events.reduce((a, e) => a + e.verbs.length, 0)} verbs)`);
if (fail) { console.log(bad.join("\n")); process.exit(1); }
