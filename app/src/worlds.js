// worlds.js: the readers of the worlds present in app/model/ (diagram, textedit, matheditor, animation, ...), side by side.
// app/model/index.json lists them: {"worlds": [{"name", "dir", "bits", "status": "demo" | "dev", "note", "trained": {...}}]}.
// A "dev" model is a small CPU model trained only to exercise the application; the About panel says so, and no number of the demo is
// ever taken from it. Dispatch by fit (tool/SPEC section 9, stated here): every reader reads; a reading with status ok beats abstain beats
// the rest; among equals the smaller residual wins; a sentence that no reader places (all no-sense / unknown-event) is "none".
import { load } from "./vss.js";

export async function loadWorlds(assets, { only = null, sentenceCandidates = true } = {}) {
  let index;
  try { index = await assets.json("model/index.json"); } catch { return { worlds: new Map(), index: { worlds: [] }, errors: ["no model/index.json: no model is installed"] }; }
  const worlds = new Map(), errors = [];
  for (const w of index.worlds) {
    if (only && !only.includes(w.name)) continue;
    try {
      const vss = await load(null, { readFile: assets.modelReader(w.dir), sentenceCandidates });
      worlds.set(w.name, { ...w, vss, legend: vss.model.legend, tau: vss.reader.tau });
    } catch (e) { errors.push(`${w.name}: ${e.message}`); }
  }
  return { worlds, index, errors };
}

const STATUS_RANK = { ok: 0, abstain: 1, "unknown-event": 2, "no-sense": 3 };

export function readIn(world, text, opts = {}) { return world.vss.read(text, opts); }

/** read with every world (or the listed ones); returns {best, readings, reason} */
export function dispatch(worlds, text, { names = null, opts = {} } = {}) {
  const readings = [];
  for (const [name, w] of worlds) { if (names && !names.includes(name)) continue; readings.push({ world: name, result: w.vss.read(text, opts) }); }
  readings.sort((a, b) => (STATUS_RANK[a.result.status] ?? 9) - (STATUS_RANK[b.result.status] ?? 9) || (a.result.residual ?? 1) - (b.result.residual ?? 1));
  const best = readings[0] || null;
  const none = !best || best.result.status === "no-sense" || best.result.status === "unknown-event";
  const reason = !best ? "no reader" : readings.length === 1 ? `one world (${best.world})` :
    `${best.world}: ${best.result.status}, residual ${(best.result.residual ?? 0).toFixed(3)}; next ${readings[1].world}: ${readings[1].result.status}, residual ${(readings[1].result.residual ?? 0).toFixed(3)}`;
  return { best: none ? null : best, readings, reason, none };
}

/** the lexicon of a world for the correctors: every catalog word with its kind; frequencies when the export carries them */
export function lexiconOf(world) {
  const m = world.vss.model, out = {};
  for (const [w] of Object.entries(m.catalog.words || {})) out[w] = (m.catalog.freq || {})[w] || 1;
  for (const e of m.legend.events || []) for (const v of e.verbs || []) out[v] = out[v] || 1;
  for (const w of Object.keys(m.lexicon || {})) out[w] = out[w] || 1;
  return out;
}

// ------------------------------------------------------------------ purposes, languages and routes (the languages design)
// Every installed world serves one PURPOSE (what its readings are for: diagram commands, text editing, formulas, animation) in one
// LANGUAGE ("en", "ro", "ro+en" for a bilingual world). Worlds of the same purpose share one English legend, so their readings are the
// same circuits whatever the language. A DICTIONARY (app/model/dict/<lang>.json, training/worlds/DICTIONARIES.md) adds a route without
// a trained world: the words are replaced mechanically and the English world of its target reads them. index.json:
//   {"worlds": [{name, dir, purpose, language, status, ...}], "dictionaries": [{language, file, target_world, note}]}
const PURPOSE_BY_NAME = { textedit: "textedit", matheditor: "matheditor", animation: "animation", scene: "scene" };
export function purposeOf(entry) { return entry.purpose || PURPOSE_BY_NAME[entry.name] || (String(entry.name).startsWith("diagram") ? "diagram" : entry.name); }
export function languageOf(entry) { return entry.language || (String(entry.name).endsWith("_ro") ? "ro" : String(entry.name).endsWith("_multi") ? "en+ro" : "en"); }
export const LANGUAGE_NAMES = { en: "English", ro: "Romanian", "en+ro": "English and Romanian", "ro+en": "Romanian and English", fr: "French", it: "Italian", de: "German", es: "Spanish" };
export const languageName = (l) => LANGUAGE_NAMES[l] || l;

export async function loadDictionaries(assets, index) {
  const out = [], errors = [];
  for (const d of index.dictionaries || []) {
    try { out.push({ ...d, dict: await assets.json(d.file) }); } catch (e) { errors.push(`dictionary ${d.language}: ${e.message}`); }
  }
  return { dictionaries: out, errors };
}

/** the routes of a purpose: one per installed world of that purpose (a trained reader), and one per dictionary whose target world is
 *  installed (dictionary, then the target's reader). Each: {id, kind: "reader" | "dictionary", world (name of the reader), language, label} */
export function routesFor(purpose, worlds, dictionaries = []) {
  const routes = [];
  for (const [name, w] of worlds) if (purposeOf(w) === purpose) routes.push({ id: name, kind: "reader", world: name, language: languageOf(w), label: `${languageName(languageOf(w))}: trained reader (${name})` });
  for (const d of dictionaries) {
    const tgt = d.target_world || "diagram"; const w = worlds.get(tgt);
    if (w && purposeOf(w) === purpose) routes.push({ id: `dict:${d.language}>${tgt}`, kind: "dictionary", world: tgt, language: d.language, dictionary: d, label: `${languageName(d.language)}: dictionary into the ${languageName(languageOf(w))} reader (${tgt})` });
  }
  return routes;
}
