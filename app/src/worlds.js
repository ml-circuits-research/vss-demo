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
