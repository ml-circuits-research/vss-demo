// sketchrows.js (ui): the rows of the "Sketch: how it is read" tab, as plain data. Pure and DOM-free; no recogniser or scene-pass logic:
// every value is read from what recognise.js (the groups) and scene_pass.js (the result) already return. Two columns over the same strokes:
//   left  = the classical step (recognise.js: grouping, ranked kinds with scores and margin, geometric features, $P distances, reason)
//   right = the reading (today scene_pass.js: per component and connector the decision, the two best candidates, containment, questions,
//           and the SOP circuit that results)
// Rows carry `keys`: the group ids (and scene ids) they stand for; two rows are "the same component" when their keys intersect.
import { PROTOTYPES } from "../sketch/recognise.js";
import { toCircuit } from "../sketch/scene_pass.js";

const nice = (k) => String(k).replace(/_/g, " ");
const strokeKey = (a) => [...(a || [])].sort((x, y) => x - y).join(",");

/** the name of the active pass, from the `active` string of the scene-pass result */
export function passName(res) {
  const a = String(res?.active || "");
  if (/^rule-based/i.test(a)) return "rule-based pass";
  return a.replace(/\s*\(.*$/, "") || "unknown pass";
}
export const NOT_VSS = "Left column: the classical step is NOT VSS (a classical template recogniser: geometric prototypes and the $P point-cloud matcher; no learned parameters).";

const FEATURE_LABEL = { fill: "hull fill", cov: "side ink", covMin: "weakest side", covMax: "strongest side", corner: "corner gap", interior: "inner ink" };

function leftRow(g) {
  const cands = (g.candidates || []).map((c) => ({ kind: c.kind, score: c.score, cost: c.cost }));
  const f = g.features || null; const feats = [];
  const top = cands[0]?.kind; const proto = PROTOTYPES[top];
  if (f && f.closed) {
    for (const k of ["fill", "cov", "covMin", "covMax", "corner", "interior"]) {
      if (typeof f[k] !== "number") continue;
      if (!["fill", "cov", "corner", "interior"].includes(k) && !(proto && proto[k])) continue;   // covMin / covMax only where the prototype uses them
      feats.push({ name: FEATURE_LABEL[k], value: f[k], proto: proto?.[k] ? { kind: top, mean: proto[k][0], sd: proto[k][1] } : null });
    }
    if (typeof f.turn === "number") feats.push({ name: "turning (turns)", value: f.turn, proto: null });
    if (typeof f.coverage === "number") feats.push({ name: "angular coverage", value: f.coverage, proto: null });
  } else if (f && f.closed === false) {
    feats.push({ name: "span (px)", value: f.span, proto: null, digits: 0 }, { name: "straightness", value: f.straightness, proto: null },
      { name: "shaft turning (pi)", value: f.turn / Math.PI, proto: null }, { name: "head score, end 0", value: f.head0, proto: null }, { name: "head score, end 1", value: f.head1, proto: null },
      { name: "free stroke ends", value: f.free, proto: null, digits: 0 }, { name: "angular coverage", value: f.coverage, proto: null });
  } else if (f && typeof f.reversals === "number") feats.push({ name: "reversals", value: f.reversals, proto: null, digits: 0 });
  const p = f?.p ? Object.entries(f.p).map(([kind, d]) => ({ kind, d })).sort((a, b) => a.d - b.d) : [];
  const flag = g.kind === "scribble" ? "scribble" : g.kind === "unknown" ? "unknown blob" : null;
  const second = cands[1] || null;
  return { side: "left", id: g.id, keys: [g.id], kind: g.kind, title: `${g.id}: ${nice(g.kind)}`, flag, strokes: [...(g.strokes || [])], nStrokes: (g.strokes || []).length,
    margin: g.margin, second: second ? { kind: second.kind, score: second.score } : null, candidates: cands, features: feats, p, reason: g.reason || "" };
}

/** build the whole tab model. low = the scene pass's ambiguity margin (PASS_OPTIONS.ambiguousMargin). map: tmp -> scene id (applyToScene). */
export function buildSketchRows({ rec, res, map = new Map(), low = 0.2, circuit = null }) {
  const groups = rec.groups || [];
  const left = groups.map(leftRow);
  const gById = new Map(groups.map((g) => [g.id, g]));
  const scribbleOf = (strokes) => groups.filter((g) => g.kind === "scribble" && strokeKey(g.strokes) === strokeKey(strokes)).map((g) => g.id);
  const sceneId = (tmp) => (map instanceof Map ? map.get(tmp) : null) || null;
  const nameOf = new Map();   // tmp -> "box s1" for candidates and containment
  for (const c of res.components) nameOf.set(c.tmp, `${c.word} ${c.tmp}`);
  const nm = (ref) => nameOf.get(ref) || (gById.has(ref) ? `${nice(gById.get(ref).kind)} ${ref}` : String(ref));
  const used = new Set(); const qBy = new Map();
  for (const q of res.questions || []) { const a = qBy.get(q.ref) || []; a.push(q); qBy.set(q.ref, a); }
  const qOf = (ref) => { used.add(ref); return (qBy.get(ref) || []).map((q) => ({ kind: q.kind, text: q.text })); };
  const keysOf = (tmp, ...more) => [tmp, sceneId(tmp), ...more].filter(Boolean);
  const right = [];
  for (const c of res.components) {
    const cands = (c.candidates || []).slice(0, 2); const container = c.kind === "container";
    const members = res.components.filter((x) => x.parent === c.tmp).map((x) => x.tmp);
    right.push({ side: "right", type: "component", id: c.tmp, keys: keysOf(c.tmp, ...(c.labelStrokes ? scribbleOf(c.labelStrokes) : [])), title: `${c.word} ${c.tmp}`,
      decision: container ? `a container (a ${nice(c.shape)} that encloses ${members.length} component${members.length === 1 ? "" : "s"})`
        : c.kind === "sketch" ? "kept as a drawing, not read as a shape" : c.kind === "text" ? "a text placeholder (a scribble on its own)"
        : `${c.word} (${c.kind}) from the ${nice(c.shape)}`,
      candidates: cands.map((x) => ({ kind: x.kind, score: x.score })), margin: typeof c.margin === "number" ? c.margin : null,
      ambiguous: !container && typeof c.margin === "number" && c.margin < low && !!c.alternatives, low,
      parent: c.parent ? nm(c.parent) : null, members: members.map(nm), labelMark: !!c.labelMark, box: c.box,
      questions: qOf(c.tmp) });
  }
  for (const k of res.connectors) {
    const side = (which) => (k.candidates?.[which] || []).slice(0, 2).map((x) => ({ name: nm(x.ref), d: x.d }));
    const mg = k.margin || {};
    right.push({ side: "right", type: "connector", id: k.tmp, keys: keysOf(k.tmp), title: `${k.kind} ${k.tmp}`,
      decision: `${k.kind} from ${nm(k.source)} to ${nm(k.target)}${k.heads === 2 ? " (heads at both ends)" : ""}`,
      ends: [{ end: "start", chosen: nm(k.source), candidates: side("source"), margin: mg.source }, { end: "end", chosen: nm(k.target), candidates: side("target"), margin: mg.target }],
      kindMargin: mg.kind ?? null, attachTol: k.attachTol ?? null, questions: qOf(k.tmp) });
  }
  for (const d of res.deletions?.components || []) {
    right.push({ side: "right", type: "deletion", id: d.tmp, keys: [d.tmp, d.id, ...scribbleOf(d.strokes)].filter(Boolean), title: `delete ${nm(d.tmp)}`, decision: d.reason, questions: [] });
  }
  for (const d of res.deletions?.connectors || []) {
    right.push({ side: "right", type: "deletion", id: d.tmp, keys: [d.tmp, ...scribbleOf(d.strokes)], title: `delete connector ${d.tmp}`, decision: d.reason, questions: [] });
  }
  // questions about things with no row of their own: a connector that was not built (dangling), a label on an existing component
  for (const [ref, qs] of qBy) {
    if (used.has(ref)) continue;
    const g = gById.get(ref);
    right.push({ side: "right", type: "question", id: ref, keys: keysOf(ref), title: g ? `${nice(g.kind)} ${ref}: not built` : `component ${ref}`,
      decision: g && qs.some((q) => q.kind === "dangling") ? "no connector made: asked instead of guessed" : "asked",
      questions: qs.map((q) => ({ kind: q.kind, text: q.text })) });
  }
  return { pass: passName(res), active: res.active, notVss: NOT_VSS, header: `Active scene pass: ${passName(res)}. ${NOT_VSS}`,
    left, right, circuit: circuit ?? toCircuit(res), layoutHint: res.layoutHint || null, explain: res.explain || [] };
}

/** the rows (both columns) that stand for the same thing as `keys` */
export function linked(model, keys) {
  const K = new Set(keys); return [...model.left, ...model.right].filter((r) => r.keys.some((k) => K.has(k)));
}
/** scene ids selected on the canvas -> the keys they stand for (the id itself and every group id that was applied as it) */
export function keysForSceneIds(ids, map) {
  const out = new Set(ids); if (map instanceof Map) for (const [tmp, id] of map) if (ids.includes(id)) out.add(tmp);
  return [...out];
}
/** keys -> scene ids on the canvas */
export function sceneIdsForKeys(keys, map) {
  const out = []; if (map instanceof Map) for (const k of keys) { const id = map.get(k); if (id && !out.includes(id)) out.push(id); }
  return out;
}
