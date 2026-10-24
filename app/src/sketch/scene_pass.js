// scene_pass.js: the rule-based geometry pass of spec 17.2 / 17.3 (the scene reader used until the positions-as-addresses experiment
// meets its criterion; the About panel names which one is active). Input: the recogniser's groups (recognise.js) and, optionally, the
// current scene (the pad stays available after clean-up, 17.4). Output: components and connectors in the scene format of
// app/src/editor/scene.js, deletions, questions, a layout hint, the explanation of every decision, and the SOP circuit (spec 15.2).
// Deterministic; every decision carries its reason as text.
//
// Rules, in order:
//  1. Scribbles. Over most of a component (the scribble covers >= deleteCover of its box and is at least labelShare of its size): delete
//     that component and its connectors. Inside a component and small: a label mark (the component gets an empty label and a question;
//     handwriting is not read, 17.4). Across a connector: delete the connector. Elsewhere: a text placeholder (a caption).
//  2. Containment by boxes. A rectangle or rounded rectangle that encloses another component (containShare of its box) is a container;
//     every component's parent is the smallest container that encloses it.
//  3. Connectors. Each end of a line or arrow attaches to the component whose OUTLINE (not its box: an ellipse, a diamond) is nearest,
//     within attachTol; the two best candidates and their distance margin are kept. An arrow goes from its tail to its head; a line from
//     the end where the pen went down. An end near nothing is a question, not a guess.
//  4. Clean-up. Boxes snapped to the grid; centres within alignTol aligned in rows and columns; containers grown to hold their members.
//  5. Unknown blobs stay as drawings with a question ("keep this as a sketch, or tell me what it is?").
//  6. Ambiguity is held open: a shape whose two best kinds are within ambiguousMargin keeps both readings and asks.
import { CLOSED_KINDS } from "./recognise.js";
import { boxArea, boxIntersection, insideShare, centre, distToPolyline, pointInPolygon } from "./strokes.js";
import * as ops from "../editor/ops.js";

export const WORD_OF = {
  rectangle: { word: "box", kind: "process" }, rounded_rectangle: { word: "start", kind: "terminator" }, ellipse: { word: "ellipse", kind: "shape" },
  diamond: { word: "decision", kind: "decision" }, cylinder: { word: "database", kind: "data" }, triangle: { word: "triangle", kind: "shape" },
};
export const PASS_OPTIONS = { grid: 10, alignTol: 14, attachTol: 30, ambiguousMargin: 0.2, labelShare: 0.45, deleteCover: 0.5, containShare: 0.9, padding: 20 };

const snap = (v, g) => Math.round(v / g) * g;
const fmt = (b) => `(${Math.round(b.x)}, ${Math.round(b.y)}, ${Math.round(b.w)} x ${Math.round(b.h)})`;
const nice = (k) => k.replace("_", " ");

/** the outline polygon of a component of a given shape in its box (for connector ends) */
export function outlineOf(shape, box, orient = "up") {
  const { x, y, w, h } = box;
  if (shape === "ellipse") return Array.from({ length: 48 }, (_, i) => { const a = 2 * Math.PI * i / 48; return { x: x + w / 2 + w / 2 * Math.cos(a), y: y + h / 2 + h / 2 * Math.sin(a) }; });
  if (shape === "diamond" || shape === "decision") return [{ x: x + w / 2, y }, { x: x + w, y: y + h / 2 }, { x: x + w / 2, y: y + h }, { x, y: y + h / 2 }];
  if (shape === "triangle") return orient === "down" ? [{ x, y }, { x: x + w, y }, { x: x + w / 2, y: y + h }] : [{ x: x + w / 2, y }, { x: x + w, y: y + h }, { x, y: y + h }];
  return [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
}

function shapeOfExisting(c) { return c.shape || ({ decision: "diamond", data: "cylinder" }[c.kind]) || (c.word === "ellipse" || c.word === "circle" ? "ellipse" : "rectangle"); }

export function scenePass(rec, { scene = null, options = {} } = {}) {
  const o = { ...PASS_OPTIONS, ...options };
  const explain = [], questions = [];
  const groups = rec.groups || [];
  // ---- items: new shapes and the components already on the scene
  const items = [];
  for (const g of groups) {
    if (!CLOSED_KINDS.includes(g.kind)) continue;
    const orient = g.kind === "triangle" && g.features?.sides && g.features.sides.top > g.features.sides.bottom ? "down" : "up";
    items.push({ tmp: g.id, shape: g.kind, box: { ...g.box }, strokes: g.strokes, candidates: g.candidates, margin: g.margin, orient, isNew: true, labelMark: false, deleted: false, container: false });
  }
  if (scene) for (const c of scene.components.values()) items.push({ tmp: c.id, id: c.id, shape: shapeOfExisting(c), box: { ...c.box }, isNew: false, container: c.kind === "container", deleted: false, labelMark: false });
  const live = () => items.filter((it) => !it.deleted);
  const connGroups = groups.filter((g) => g.kind === "line" || g.kind === "arrow").map((g) => ({ g, deleted: false }));
  const deletions = { components: [], connectors: [] };
  const extra = [];   // text placeholders and sketches
  // ---- 1. scribbles
  for (const g of groups.filter((x) => x.kind === "scribble")) {
    const s = g.box; const sa = boxArea(s);
    const del = live().map((it) => { const i = boxIntersection(s, it.box); return { it, cover: i ? boxArea(i) / Math.max(1, boxArea(it.box)) : 0, ratio: sa / Math.max(1, boxArea(it.box)) }; })
      .filter((c) => c.cover >= o.deleteCover && c.ratio >= o.labelShare).sort((a, b) => b.cover - a.cover || boxArea(a.it.box) - boxArea(b.it.box));
    if (del.length) {
      const it = del[0].it; it.deleted = true;
      deletions.components.push({ id: it.isNew ? null : it.id, tmp: it.tmp, strokes: g.strokes, reason: `scribble over ${it.shape} ${fmt(it.box)} covers ${(del[0].cover * 100).toFixed(0)}% of it` });
      explain.push(`delete the ${nice(it.shape)} at ${fmt(it.box)}: a scribble covers ${(del[0].cover * 100).toFixed(0)}% of it`);
      continue;
    }
    const host = live().filter((it) => insideShare(s, it.box) >= 0.9 && sa / Math.max(1, boxArea(it.box)) < o.labelShare).sort((a, b) => boxArea(a.box) - boxArea(b.box))[0];
    if (host) {
      host.labelMark = true; host.labelStrokes = g.strokes;
      explain.push(`a label area inside the ${nice(host.shape)} at ${fmt(host.box)}: handwriting is not read, the label is left empty`);
      continue;
    }
    const hit = connGroups.find((c) => !c.deleted && c.g.path && c.g.path.some((p) => p.x >= s.x && p.x <= s.x + s.w && p.y >= s.y && p.y <= s.y + s.h));
    if (hit) { hit.deleted = true; deletions.connectors.push({ tmp: hit.g.id, strokes: g.strokes, by: g.strokes, reason: "a scribble across the connector" }); explain.push(`delete a connector: a scribble crosses it`); continue; }
    extra.push({ tmp: g.id, word: "caption", kind: "text", shape: "text", box: { ...s }, strokes: g.strokes, labelMark: true, why: "a scribble on its own: a text placeholder" });
    explain.push(`a text placeholder at ${fmt(s)}: a scribble on its own`);
  }
  // ---- 2. containment
  const L = live();
  for (const it of L) {
    if (!it.isNew || !(it.shape === "rectangle" || it.shape === "rounded_rectangle")) continue;
    const inner = L.filter((x) => x !== it && insideShare(x.box, it.box) >= o.containShare && boxArea(x.box) < 0.8 * boxArea(it.box));
    if (inner.length) { it.container = true; explain.push(`the ${nice(it.shape)} at ${fmt(it.box)} encloses ${inner.length} component(s): a container`); }
  }
  for (const it of L) {
    if (!it.isNew) continue;
    const par = L.filter((c) => c !== it && c.container && insideShare(it.box, c.box) >= o.containShare && boxArea(it.box) < boxArea(c.box)).sort((a, b) => boxArea(a.box) - boxArea(b.box))[0];
    it.parent = par ? par.tmp : null;
    if (par) explain.push(`${nice(it.container ? "container" : it.shape)} ${fmt(it.box)} is inside the container ${fmt(par.box)}`);
  }
  // ---- 3. connectors
  const connectors = [];
  const attach = (p) => {
    const ranked = live().map((it) => {
      const poly = outlineOf(it.container ? "rectangle" : it.shape, it.box, it.orient);
      return { it, d: distToPolyline(p, poly, true), inside: pointInPolygon(p, poly) };
    }).sort((a, b) => a.d - b.d || boxArea(a.it.box) - boxArea(b.it.box));
    return ranked;
  };
  for (const { g, deleted } of connGroups) {
    if (deleted) continue;
    const span = Math.hypot(g.ends.tip.x - g.ends.tail.x, g.ends.tip.y - g.ends.tail.y); const tol = Math.max(o.attachTol, 0.12 * span);
    const A = attach(g.ends.tail), B = attach(g.ends.tip);
    const a = A[0], b = B[0];
    const marginA = A[1] ? A[1].d - a.d : Infinity, marginB = B[1] ? B[1].d - b.d : Infinity;
    if (!a || !b || a.d > tol || b.d > tol) {
      const which = !a || a.d > tol ? (!b || b.d > tol ? "either end" : "its start") : "its end";
      questions.push({ kind: "dangling", ref: g.id, strokes: g.strokes, text: `this ${g.kind} touches nothing at ${which}: where does it go?` });
      explain.push(`a ${g.kind} with ${which} near no component (nearest ${Math.round(Math.min(a ? a.d : Infinity, b ? b.d : Infinity))} px > ${Math.round(tol)} px): asked, not guessed`);
      continue;
    }
    if (a.it === b.it) {
      questions.push({ kind: "self", ref: g.id, strokes: g.strokes, text: `this ${g.kind} starts and ends at the same ${nice(a.it.shape)}: is that intended?` });
    }
    const c = { tmp: g.id, source: a.it.tmp, target: b.it.tmp, kind: g.kind === "line" ? "line" : "arrow", style: "solid", label: null, heads: g.ends.heads, strokes: g.strokes,
      margin: { source: marginA, target: marginB, kind: g.margin }, candidates: { source: A.slice(0, 2).map((x) => ({ ref: x.it.tmp, d: Math.round(x.d) })), target: B.slice(0, 2).map((x) => ({ ref: x.it.tmp, d: Math.round(x.d) })) } };
    connectors.push(c);
    explain.push(`${g.kind} from the ${nice(a.it.container ? "container" : a.it.shape)} (end ${Math.round(a.d)} px from its outline${isFinite(marginA) ? `, next ${Math.round(marginA)} px further` : ""}) to the ${nice(b.it.container ? "container" : b.it.shape)} (${Math.round(b.d)} px${isFinite(marginB) ? `, next ${Math.round(marginB)} px further` : ""})`);
  }
  // ---- 4. clean-up of the new components: grid, rows and columns, containers around members
  const fresh = live().filter((it) => it.isNew);
  for (const it of fresh) it.out = { x: snap(it.box.x, o.grid), y: snap(it.box.y, o.grid), w: Math.max(o.grid, snap(it.box.w, o.grid)), h: Math.max(o.grid, snap(it.box.h, o.grid)) };
  const align = (axis) => {
    const key = axis === "x" ? "w" : "h"; const nodes = fresh.filter((it) => !it.container).sort((p, q) => (p.out[axis] + p.out[key] / 2) - (q.out[axis] + q.out[key] / 2));
    const clusters = []; for (const it of nodes) { const c = it.out[axis] + it.out[key] / 2; const last = clusters[clusters.length - 1]; if (last && c - last.c0 <= o.alignTol) last.list.push(it); else clusters.push({ c0: c, list: [it] }); }
    let n = 0;
    for (const cl of clusters) {
      if (cl.list.length < 2) continue;
      const m = snap(cl.list.reduce((s, it) => s + it.out[axis] + it.out[key] / 2, 0) / cl.list.length, o.grid / 2);
      for (const it of cl.list) it.out[axis] = Math.round(m - it.out[key] / 2);
      n++;
    }
    return { clusters, n };
  };
  const cols = align("x"), rows = align("y");
  if (rows.n) explain.push(`aligned ${rows.n} row(s) of components whose centres were within ${o.alignTol} px`);
  if (cols.n) explain.push(`aligned ${cols.n} column(s)`);
  for (const it of fresh.filter((x) => x.container).sort((a, b) => boxArea(a.box) - boxArea(b.box))) {
    const mem = fresh.filter((x) => x.parent === it.tmp);
    for (const m of mem) {
      const b = it.out, p = o.padding / 2;
      const x0 = Math.min(b.x, m.out.x - p), y0 = Math.min(b.y, m.out.y - p), x1 = Math.max(b.x + b.w, m.out.x + m.out.w + p), y1 = Math.max(b.y + b.h, m.out.y + m.out.h + p);
      it.out = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    }
  }
  // ---- 5. unknown blobs
  for (const g of groups.filter((x) => x.kind === "unknown")) {
    extra.push({ tmp: g.id, word: "sketch", kind: "sketch", shape: "sketch", box: { ...g.box }, strokes: g.strokes, why: g.reason });
    questions.push({ kind: "unknown", ref: g.id, strokes: g.strokes, text: "keep this as a sketch, or tell me what it is?" });
    explain.push(`kept as a sketch at ${fmt(g.box)}: ${g.reason}`);
  }
  // ---- 6. components
  const components = [];
  for (const it of fresh) {
    const wk = it.container ? { word: "container", kind: "container" } : WORD_OF[it.shape];
    const comp = { tmp: it.tmp, word: wk.word, kind: wk.kind, label: null, color: null, size: null, style: it.container ? "dashed" : null, box: it.out, parent: it.parent || null,
      shape: it.container ? it.shape : it.shape, strokes: it.strokes, labelMark: it.labelMark, margin: it.margin, candidates: it.candidates.slice(0, 3).map((c) => ({ kind: c.kind, score: +c.score.toFixed(3) })) };
    if (it.orient === "down") comp.orient = "down";
    if (!it.container && it.margin < o.ambiguousMargin && it.candidates[1]) {
      comp.alternatives = it.candidates.slice(0, 2).map((c) => ({ kind: c.kind, word: WORD_OF[c.kind]?.word, score: +c.score.toFixed(3) }));
      questions.push({ kind: "which-shape", ref: it.tmp, text: `is this a ${nice(it.candidates[0].kind)} or a ${nice(it.candidates[1].kind)}?`, candidates: comp.alternatives });
    }
    if (it.labelMark) questions.push({ kind: "label", ref: it.tmp, text: `what is this ${it.container ? "container" : wk.word} called?` });
    components.push(comp);
  }
  for (const e of extra) components.push({ tmp: e.tmp, word: e.word, kind: e.kind, label: null, color: null, size: null, style: null, box: { x: snap(e.box.x, o.grid), y: snap(e.box.y, o.grid), w: Math.max(o.grid, snap(e.box.w, o.grid)), h: Math.max(o.grid, snap(e.box.h, o.grid)) },
    parent: null, shape: e.shape, strokes: e.strokes, labelMark: !!e.labelMark, sketch: e.kind === "sketch" ? { strokes: e.strokes } : undefined });
  for (const it of items) if (!it.isNew && it.labelMark) questions.push({ kind: "label", ref: it.id, text: `what is this called?` });
  // ---- 7. layout hint
  const nodes = fresh.filter((x) => !x.container);
  let layoutHint = null;
  if (nodes.length >= 2) {
    if (rows.clusters.length === 1) layoutHint = "row"; else if (cols.clusters.length === 1) layoutHint = "column";
    const arrows = connectors.filter((c) => c.kind === "arrow");
    if (arrows.length >= 2) {
      const byTmp = new Map(items.map((it) => [it.tmp, it]));
      let lr = 0, td = 0;
      for (const c of arrows) { const s = centre(byTmp.get(c.source).box), t = centre(byTmp.get(c.target).box); if (Math.abs(t.x - s.x) >= Math.abs(t.y - s.y)) lr += t.x > s.x ? 1 : -1; else td += t.y > s.y ? 1 : -1; }
      if (lr >= 0.6 * arrows.length) layoutHint = "flow_lr"; else if (td >= 0.6 * arrows.length) layoutHint = "flow_td";
    }
    if (layoutHint) explain.push(`layout hint: ${layoutHint}`);
  }
  return { components, connectors, deletions, questions, explain, layoutHint, active: "rule-based geometry pass (spec 17.3: the FPE scene reader is not active until its criterion is met)" };
}

/** the result as the SOP circuit of spec 15.2: one create wire per component, one connect wire per connector, one group wire per
 * container, a delete wire per deletion, the layout hint on an arrange wire. Boxes ride on reserved _box lines. */
export function toCircuit(res) {
  const lines = ["!world diagram", "!source sketch", ""]; let n = 0; const ent = new Map(); const w = () => `w${++n}`; let sent = 0;
  const block = (arr) => { lines.push(...arr, ""); };
  for (const c of res.components) {
    const cw = w(), e = w(); ent.set(c.tmp, e);
    block([`@${cw} create`, `_sentence=${sent++}`, `_source=sketch`, `object=$${e}`, `_box="${c.box.x} ${c.box.y} ${c.box.w} ${c.box.h}"`]);
    const ent_ = [`@${e} entity`, `head=${c.word}`, `det=a`]; if (c.alternatives) ent_.push(`_alt=${c.alternatives.map((a) => a.word).join("|")}`);
    block(ent_);
  }
  const ref = (t) => (ent.has(t) ? `$${ent.get(t)}` : `"${t}"`);
  for (const k of res.connectors) {
    const cw = w(), e = w(); block([`@${cw} connect`, `_sentence=${sent++}`, `_source=sketch`, `source=${ref(k.source)}`, `target=${ref(k.target)}`, `object=$${e}`]); block([`@${e} entity`, `head=${k.kind}`, `det=a`]);
  }
  for (const g of res.components.filter((c) => c.kind === "container")) {
    const mem = res.components.filter((c) => c.parent === g.tmp).map((c) => ref(c.tmp));
    if (mem.length) block([`@${w()} group`, `_sentence=${sent++}`, `_source=sketch`, `object=${mem.join(" & ")}`, `_container=${ref(g.tmp)}`]);
  }
  for (const d of res.deletions.components) if (d.id) block([`@${w()} delete`, `_sentence=${sent++}`, `_source=sketch`, `object="${d.id}"`]);
  if (res.layoutHint) block([`@${w()} arrange`, `_sentence=${sent++}`, `_source=sketch`, `layout=${res.layoutHint}`]);
  return lines.join("\n").replace(/\n+$/, "\n");
}

/** apply a scene-pass result to a scene through the engine operations (app/src/editor/ops.js), as ONE transaction: one undo entry
 * shared with typed and spoken requests and with manual gestures; connectors routed by the engine's router. Returns {map: tmp -> id}. */
export function applyToScene(scene, res) {
  const map = new Map(); let touched = [];
  ops.transact(scene, () => {
    const del = res.deletions.components.filter((d) => d.id && scene.components.has(d.id)).map((d) => d.id);
    if (del.length) ops.remove(scene, del);
    // containers first (outermost first), so that members are created inside an existing parent
    const depth = (c) => { let n = 0, p = c.parent; const by = new Map(res.components.map((x) => [x.tmp, x])); while (p && by.has(p) && n < 50) { n++; p = by.get(p).parent; } return n; };
    const order = [...res.components].sort((a, b) => (b.kind === "container") - (a.kind === "container") || depth(a) - depth(b));
    for (const c of order) {
      const id = c.kind === "container" ? `g${++scene.counter}` : undefined;
      const nid = ops.create(scene, { id, word: c.word, kind: c.kind, label: null, color: null, style: c.style, size: null, parent: c.parent ? map.get(c.parent) || c.parent : null }, { ...c.box });
      const comp = scene.components.get(nid); comp.shape = c.shape;
      if (c.labelMark) comp.labelMark = true; if (c.alternatives) comp.alternatives = c.alternatives; if (c.sketch) comp.sketch = c.sketch; if (c.orient) comp.orient = c.orient;
      map.set(c.tmp, nid); touched.push(nid);
    }
    for (const k of res.connectors) {
      const a = map.get(k.source) || k.source, b = map.get(k.target) || k.target;
      if (!scene.components.has(a) || !scene.components.has(b)) continue;
      map.set(k.tmp, ops.connect(scene, a, b, { kind: k.kind, style: k.style }));
    }
    if (res.components.length || res.connectors.length) ops.route(scene, {});
  });
  if (touched.length) scene.lastTouched = touched;
  return { map, applied: touched.length + res.connectors.length + res.deletions.components.length };
}
