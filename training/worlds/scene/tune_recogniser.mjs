// tune_recogniser.mjs: feature statistics, grouping and confusion of the sketch recogniser on the TUNE split of the synthetic set ONLY
// (app/tests/data/sketch_synth.json, splits.tune). The prototype table and the thresholds of app/src/sketch/recognise.js are set from
// this output; the test split is never read here (rule 25: a threshold is never set on the rows it is reported on).
// Usage: node training/worlds/scene/tune_recogniser.mjs [--features]
import { readFileSync } from "node:fs";
import { fromDeltas } from "../../../app/src/sketch/strokes.js";
import { groupStrokes, classifyGroup, closedFeatures } from "../../../app/src/sketch/recognise.js";

const data = JSON.parse(readFileSync(new URL("../../../app/tests/data/sketch_synth.json", import.meta.url)));
const scenes = data.splits.tune;
const showFeatures = process.argv.includes("--features");
const key = (a) => [...a].sort((x, y) => x - y).join(",");
const stats = {}; const conf = {}; let groupedOk = 0, groupedAll = 0; const misgroup = [];
for (const sc of scenes) {
  const strokes = sc.strokes.map((s, i) => fromDeltas(s.p, i));
  const groups = groupStrokes(strokes); const byKey = new Map(groups.map((g) => [key(g.strokes.map((s) => s.id)), g]));
  const gold = [];
  for (const e of sc.gold.elements) gold.push({ kind: e.kind, strokes: e.strokes });
  for (const k of sc.gold.connectors) gold.push({ kind: k.kind, strokes: k.strokes });
  for (const m of sc.gold.marks) gold.push({ kind: "scribble", strokes: m.strokes });
  for (const u of sc.gold.unknowns) gold.push({ kind: "unknown", strokes: u.strokes, sub: u.kind });
  for (const g of gold) {
    groupedAll++; const grp = byKey.get(key(g.strokes));
    if (!grp) { misgroup.push(`${sc.id} ${g.kind} strokes ${g.strokes} -> ${groups.filter((x) => x.strokes.some((s) => g.strokes.includes(s.id))).map((x) => "[" + x.strokes.map((s) => s.id) + "]").join(" ")}`); conf[g.kind] = conf[g.kind] || {}; conf[g.kind]["(group)"] = (conf[g.kind]["(group)"] || 0) + 1; continue; }
    groupedOk++;
    const r = classifyGroup(grp); conf[g.kind] = conf[g.kind] || {}; conf[g.kind][r.kind] = (conf[g.kind][r.kind] || 0) + 1;
    if (r.features && r.features.closed) {
      const f = r.features; (stats[g.kind] = stats[g.kind] || []).push(f);
      if (r.kind !== g.kind && showFeatures) console.log(`miss ${sc.id} ${g.kind}${g.sub ? "/" + g.sub : ""} -> ${r.kind} ${r.candidates.slice(0, 3).map((c) => c.kind + ":" + c.score.toFixed(2) + "/" + c.cost.toFixed(1)).join(" ")} fill ${f.fill.toFixed(2)} cov ${f.cov.toFixed(2)} min ${f.covMin.toFixed(2)} max ${f.covMax.toFixed(2)} corner ${f.corner.toFixed(2)} inner ${f.interior.toFixed(2)}`);
    } else if (r.kind !== g.kind && showFeatures) console.log(`miss ${sc.id} ${g.kind}${g.sub ? "/" + g.sub : ""} -> ${r.kind}: ${r.reason} ${JSON.stringify(r.features || {})}`);
  }
}
console.log(`tune: grouping ${groupedOk}/${groupedAll}`);
for (const m of misgroup.slice(0, 30)) console.log("  misgroup " + m);
console.log("confusion (gold -> recognised):");
for (const k of Object.keys(conf).sort()) console.log(`  ${k.padEnd(18)} ${JSON.stringify(conf[k])}`);
const ms = (a) => { const m = a.reduce((x, y) => x + y, 0) / a.length; const sd = Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length); return `${m.toFixed(3)}+-${sd.toFixed(3)}`; };
console.log("closed-group features by gold kind (mean +- sd):");
for (const k of Object.keys(stats).sort()) {
  const a = stats[k]; console.log(`  ${k.padEnd(18)} n ${String(a.length).padStart(3)} fill ${ms(a.map((f) => f.fill))} cov ${ms(a.map((f) => f.cov))} covMin ${ms(a.map((f) => f.covMin))} covMax ${ms(a.map((f) => f.covMax))} corner ${ms(a.map((f) => f.corner))} interior ${ms(a.map((f) => f.interior))} turn ${ms(a.map((f) => f.turn))} max ${Math.max(...a.map((f) => f.turn)).toFixed(2)}`);
}
