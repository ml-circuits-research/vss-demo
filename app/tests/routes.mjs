// routes.mjs: the languages design in node: routes of a purpose (worlds.js routesFor), the dictionary route (translate.js) and the
// clearest-reading choice across routes (routes.js), on the installed diagram model and a small hand-written Romanian sample dictionary.
// With a development model this checks the wiring, not accuracy. Usage: node app/tests/routes.mjs
import fs from "node:fs";
import { createAssets } from "../src/assets.js";
import { loadWorlds, lexiconOf, routesFor } from "../src/worlds.js";
import { createNormalizer } from "../src/normalize.js";
import { createCorrector } from "../src/correct.js";
import { createTranslator } from "../src/translate.js";
import { readRoutes } from "../src/routes.js";
const root = new URL("../", import.meta.url);
if (!fs.existsSync(new URL("model/index.json", root))) { console.log("routes: no model installed: skipped"); process.exit(0); }
const assets = createAssets({ bundle: null, readFile: async (p, as) => (as === "text" ? fs.readFileSync(new URL(p, root), "utf8") : fs.readFileSync(new URL(p, root))) });
const { worlds } = await loadWorlds(assets); const W = worlds.get("diagram");
let pass = 0, fail = 0; const bad = []; const check = (n, c, d = "") => { if (c) pass++; else { fail++; bad.push(`${n}: ${d}`); } };
const dict = JSON.parse(fs.readFileSync(new URL("tests/data/dict_ro_sample.json", root), "utf8"));
const dictionaries = [{ language: "ro", target_world: "diagram", dict, translator: createTranslator(dict) }];
const all = routesFor("diagram", worlds, dictionaries);
check("routes: every installed diagram reader, then the dictionary", all[0].id === "diagram" && all[all.length - 1].kind === "dictionary" && all.filter((r) => r.kind === "reader").length === [...worlds.values()].filter((w) => (w.purpose || "diagram") === "diagram").length, JSON.stringify(all.map((r) => r.id)));
const routes = all.filter((r) => r.id === "diagram" || r.kind === "dictionary");     // the English reader and the dictionary (the pipes built below)
const pipes = new Map([["diagram", { world: W, normalize: createNormalizer(await assets.json("model/diagram/normalize.json")), corr: { classic: createCorrector({ lexicon: lexiconOf(W) }) } }]]);
const ro = readRoutes({ routes, pipes, alternatives: [{ text: "adaugă o bază de date numită Comenzi în stânga sus" }] });
check("Romanian input: the dictionary route reads into the English legend", ro.byRoute.has("dict:ro>diagram") && ro.byRoute.get("dict:ro>diagram").input.startsWith("add a database called"), ro.byRoute.get("dict:ro>diagram")?.input);
const rank = { ok: 0, abstain: 1, "unknown-event": 2, "no-sense": 3 };
const rd = ro.byRoute.get("dict:ro>diagram").result.status, re = ro.byRoute.get("diagram").result.status;
check("Romanian input: the route chosen is never one with a worse status", (rank[ro.best.result.status] ?? 9) <= Math.min(rank[rd] ?? 9, rank[re] ?? 9), ro.reason);
console.log(`  (development model) Romanian input: dictionary route ${rd}, English reader ${re}; chosen: ${ro.best.route.label}`);
check("the label is not translated", ro.byRoute.get("dict:ro>diagram").tokens.includes("comenzi"), ro.byRoute.get("dict:ro>diagram").input);
const en = readRoutes({ routes, pipes, alternatives: [{ text: "add a red circle" }] });
check("English input: both routes read the same tokens (the dictionary passes English through); one reading kept", en.best && en.ranked.length >= 1, en.reason);
const romglish = readRoutes({ routes, pipes, alternatives: [{ text: "add o cutie rosie" }] });
check("Romglish (English grammar, Romanian words): the dictionary route turns it into English", romglish.byRoute.get("dict:ro>diagram")?.input === "add a box red", romglish.byRoute.get("dict:ro>diagram")?.input);
const only = readRoutes({ routes: routes.slice(0, 1), pipes, alternatives: [{ text: "adaugă o cutie" }] });
check("a chosen route is the only one read", [...only.byRoute.keys()].join() === "diagram", [...only.byRoute.keys()].join());
console.log(`routes: ${pass} checks passed, ${fail} failed (the installed model is ${W.status}: wiring, not accuracy)`); if (fail) { console.log(bad.join("\n")); process.exit(1); }
