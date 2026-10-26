// routes.js: reading one input through several routes (the languages design; DOM-free, used by main.js and tested in node).
// A route is a trained reader of one world, or a dictionary followed by the reader of its target world (worlds.js routesFor). Every route
// reads every alternative (speech alternatives x spelling variants x dictionary variants) and the clearest reading wins
// (status first; at equal status a trained reader before a dictionary; then speech.js chooseClearest: minimum margin, residual). All the routes of one
// purpose read into one English legend, so the winner's frame is the same kind of circuit whatever the language.
//   readRoutes({ routes, pipes, alternatives, mode, corrector, labels }) -> {best, ranked, reason, byRoute}
// pipes: world name -> {world, normalize, corr: {classic, form}, formIndex}
import { chooseClearest } from "./speech.js";

export function readRoutes({ routes, pipes, alternatives, mode = "typed", corrector = "classic", labels = [] }) {
  const readings = []; const seen = new Set();
  for (const route of routes) {
    const P = pipes.get(route.world); if (!P) continue;
    // a dictionary route replaces the words first and is not spell-corrected (the dictionary's keys are the words it knows)
    const corr = route.kind === "dictionary" || corrector === "off" ? null : P.corr[corrector] || P.corr.classic;
    if (corr) { corr.setLabels(labels); if (corrector === "form" && P.formIndex) P.formIndex.setLabels(labels); }
    for (const alt of alternatives) {
      const texts = route.kind === "dictionary" ? route.dictionary.translator.translate(alt.text).variants.map((v) => v.join(" ")) : [alt.text];
      for (const t of texts) {
        const n = P.normalize(t);
        const c = corr ? corr.correct(n.tokens, { mode }) : { tokens: n.tokens, corrections: [], alternatives: [n.tokens] };
        c.alternatives.forEach((v, i) => {
          const input = v.join(" "), key = `${route.world}|${input}`; if (seen.has(key)) return; seen.add(key);
          readings.push({ input, tokens: v, info: n.info, corrections: c.alternativeCorrections ? c.alternativeCorrections[i] : i === 0 ? c.corrections : [], heard: alt.text, route,
            translated: route.kind === "dictionary" ? t : null, result: P.world.vss.read(input) });
        });
      }
    }
  }
  if (!readings.length) return { best: null, ranked: [], reason: "no route", byRoute: new Map() };
  // stated order: status (ok, abstain, the rest); at equal status a trained reader before a dictionary (a substitution is a guess the
  // trained reader does not need); then the clearest reading (chooseClearest: minimum margin, then residual)
  const rank = (r) => (r.result.status === "ok" ? 0 : r.result.status === "abstain" ? 1 : 2) * 2 + (r.route.kind === "dictionary" ? 1 : 0);
  const top = Math.min(...readings.map(rank));
  const pool = readings.filter((r) => rank(r) === top), rest = readings.filter((r) => rank(r) !== top).sort((a, b) => rank(a) - rank(b));
  const choice = chooseClearest(pool); choice.ranked = choice.ranked.concat(rest);
  const byRoute = new Map(); for (const r of choice.ranked) if (!byRoute.has(r.route.id)) byRoute.set(r.route.id, r);
  if (byRoute.size > 1) choice.reason = `${choice.best.route.label} read it most clearly (${choice.best.result.status}); ` + [...byRoute.values()].slice(1).map((r) => `${r.route.label}: ${r.result.status}`).join("; ");
  choice.byRoute = byRoute;
  return choice;
}
