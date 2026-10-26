// sketchview.js (ui): the sketch preview (D23): two RENDERED diagrams over the same strokes, side by side: what the VSS scene reader read and what the
// classical algorithm (the rule-based scene pass) would make, each labelled, with a click on an element showing its candidates, margins and questions
// in a popup, and a "Use this" button under each. The same view, without the buttons, is the "Sketch readings" detail of a History entry.
// Rendering only: both results come from scene_fpe.js and scene_pass.js unchanged; every number shown is read from them (through sketchrows.js).
import { outlineOf, toCircuit } from "../sketch/scene_pass.js";
import { buildSketchRows, linked } from "./sketchrows.js";
import { leftItem, rightItem } from "./sketchtab.js";
import { openPopup } from "./popup.js";

const NS = "http://www.w3.org/2000/svg";
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const sv = (name, attrs = {}, cls = null) => { const e = document.createElementNS(NS, name); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v)); if (cls) e.setAttribute("class", cls); return e; };
const nice = (k) => String(k).replace(/_/g, " ");

/** the line that says who reads what (D11): the shapes are classical in both; the scene is read by VSS in one and by rules in the other */
export const WHO_LINE = "Who reads what: the shapes (box, circle, diamond, cylinder, arrow) are read by the classical recogniser ($P, not VSS) in both diagrams. The two differ only in how the scene is read: containment and where each connector ends. Left: the VSS scene reader (positions as addresses). Right: the classical rules (boxes and outlines).";

function exitPoint(poly, from, to) {   // where the segment from -> to leaves the outline `poly` (from is inside it); the point `from` when it does not
  let best = null;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const d1x = to.x - from.x, d1y = to.y - from.y, d2x = b.x - a.x, d2y = b.y - a.y; const den = d1x * d2y - d1y * d2x; if (Math.abs(den) < 1e-9) continue;
    const t = ((a.x - from.x) * d2y - (a.y - from.y) * d2x) / den, u = ((a.x - from.x) * d1y - (a.y - from.y) * d1x) / den;
    if (t > 0 && t <= 1 && u >= 0 && u <= 1 && (best === null || t < best)) best = t;
  }
  return best === null ? from : { x: from.x + (to.x - from.x) * best, y: from.y + (to.y - from.y) * best };
}
const centreOf = (b) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

function shapePath(shape, b) {
  const { x, y, w, h } = b;
  if (shape === "cylinder") { const ry = Math.min(h * 0.16, 16); return `M${x},${y + ry}a${w / 2},${ry} 0 0 1 ${w},0v${h - 2 * ry}a${w / 2},${ry} 0 0 1 ${-w},0z M${x},${y + ry}a${w / 2},${ry} 0 0 0 ${w},0`; }
  return null;
}

/** one reading as an SVG over the strokes. returns {svg, items: Map(element -> keys)} */
function drawReading({ strokes, rec, res, lookup, context, vb, onPick }) {
  const svg = sv("svg", { viewBox: `${vb.x} ${vb.y} ${vb.w} ${vb.h}`, role: "img", "aria-label": "A reading of the sketch drawn over its strokes" }, "sk-svg");
  svg.append(Object.assign(sv("defs"), {})); const defs = svg.firstChild;
  const mk = sv("marker", { id: `sk-arrow-${Math.random().toString(36).slice(2, 7)}`, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" });
  mk.append(sv("path", { d: "M0,0 L10,5 L0,10 z" }, "sk-head")); defs.append(mk); const mid = mk.getAttribute("id");
  const fs = Math.max(12, Math.min(22, vb.w / 38));
  for (const c of context || []) svg.append(sv("rect", { x: c.box.x, y: c.box.y, width: c.box.w, height: c.box.h, rx: 4 }, "sk-ctx"));
  const gStr = sv("g", {}, "sk-strokes");
  const deleted = new Set([...(res.deletions?.components || []), ...(res.deletions?.connectors || [])].flatMap((d) => d.strokes || []));
  for (const s of strokes) gStr.append(sv("polyline", { points: s.points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") }, deleted.has(s.id) ? "sk-stroke sk-del" : "sk-stroke"));
  svg.append(gStr);
  const made = new Map();   // tmp -> {box, shape, orient}
  const hit = (g, keys, label) => { g.classList.add("sk-hit"); g.dataset.keys = keys.join(" "); g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", label); g.addEventListener("click", () => onPick(keys, label)); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(keys, label); } }); };
  const qOf = new Set((res.questions || []).map((q) => q.ref));
  const badge = (x, y, keys, label) => { const g = sv("g", {}, "sk-q"); g.append(sv("circle", { cx: x, cy: y, r: fs * 0.62 }), Object.assign(sv("text", { x, y: y + fs * 0.34, "text-anchor": "middle", "font-size": fs * 0.9 }), { textContent: "?" })); hit(g, keys, label); svg.append(g); };
  for (const c of res.components) {
    const g = sv("g", {}, `sk-comp sk-${c.kind}`); const b = c.box; made.set(c.tmp, { box: b, shape: c.shape, orient: c.orient });
    const cyl = shapePath(c.shape, b);
    if (cyl) g.append(sv("path", { d: cyl }));
    else if (c.shape === "ellipse") g.append(sv("ellipse", { cx: b.x + b.w / 2, cy: b.y + b.h / 2, rx: b.w / 2, ry: b.h / 2 }));
    else if (c.shape === "diamond" || c.shape === "triangle") g.append(sv("polygon", { points: outlineOf(c.shape, b, c.orient).map((p) => `${p.x},${p.y}`).join(" ") }));
    else g.append(sv("rect", { x: b.x, y: b.y, width: b.w, height: b.h, rx: c.shape === "rounded_rectangle" ? Math.min(b.h / 2, 18) : 3 }));
    g.append(Object.assign(sv("text", { x: b.x + b.w / 2, y: c.kind === "container" ? b.y + fs * 1.1 : b.y + b.h / 2 + fs * 0.32, "text-anchor": "middle", "font-size": fs }), { textContent: c.kind === "container" ? "container" : c.word }));
    hit(g, [c.tmp], `${c.word} ${c.tmp}`); svg.append(g);
    if (qOf.has(c.tmp) || (c.alternatives && c.kind !== "container")) badge(b.x + b.w, b.y, [c.tmp], `${c.word} ${c.tmp}: question`);
  }
  const place = (ref) => made.get(ref) || lookup?.(ref) || null;
  const groupOf = new Map((rec.groups || []).map((g) => [g.id, g]));
  for (const k of res.connectors) {
    const A = place(k.source), B = place(k.target); const g = sv("g", {}, "sk-conn");
    const grp = groupOf.get(k.tmp);
    let p0, p1;
    if (A && B) { const ca = centreOf(A.box), cb = centreOf(B.box); p0 = A === B ? ca : exitPoint(outlineOf(A.shape, A.box, A.orient), ca, cb); p1 = A === B ? cb : exitPoint(outlineOf(B.shape, B.box, B.orient), cb, ca); }
    else if (grp) { p0 = grp.ends.tail; p1 = grp.ends.tip; }
    if (!p0) continue;
    const line = sv("line", { x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y }, k.style === "dashed" ? "sk-line sk-dashed" : "sk-line");
    if (k.kind === "arrow") { line.setAttribute("marker-end", `url(#${mid})`); if (k.heads === 2) line.setAttribute("marker-start", `url(#${mid})`); }
    g.append(sv("line", { x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y }, "sk-fat"), line); hit(g, [k.tmp], `${k.kind} ${k.tmp}`); svg.append(g);
    if (qOf.has(k.tmp)) badge((p0.x + p1.x) / 2, (p0.y + p1.y) / 2 - fs, [k.tmp], `${k.kind} ${k.tmp}: question`);
  }
  for (const q of res.questions || []) {   // a question about a stroke group that built nothing (a connector that touches nothing, an unknown blob)
    if (made.has(q.ref) || res.connectors.some((k) => k.tmp === q.ref)) continue;
    const g = groupOf.get(q.ref); if (g) badge(g.box.x + g.box.w / 2, g.box.y + g.box.h / 2, [q.ref], `${nice(g.kind)} ${q.ref}: question`);
  }
  for (const d of [...(res.deletions?.components || []), ...(res.deletions?.connectors || [])]) {
    const sg = (d.strokes || []).map((id) => groupOf.get(id) || null).filter(Boolean)[0]; const box = sg?.box || (d.tmp && made.get(d.tmp)?.box);
    if (box) { const g = sv("g", {}, "sk-delmark"); g.append(sv("rect", { x: box.x, y: box.y, width: box.w, height: box.h, rx: 4 }), Object.assign(sv("text", { x: box.x + box.w / 2, y: box.y - fs * 0.4, "text-anchor": "middle", "font-size": fs * 0.85 }), { textContent: "delete" })); hit(g, [d.tmp, ...(d.strokes || [])].filter(Boolean), `delete ${d.tmp || ""}`); svg.append(g); }
  }
  return svg;
}

function viewBoxOf(strokes, readings, context) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (x, y) => { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; };
  for (const s of strokes) for (const p of s.points) add(p.x, p.y);
  for (const r of readings) for (const c of r.res.components) { add(c.box.x, c.box.y); add(c.box.x + c.box.w, c.box.y + c.box.h); }
  for (const c of context || []) { add(c.box.x, c.box.y); add(c.box.x + c.box.w, c.box.y + c.box.h); }
  if (!isFinite(x0)) { x0 = 0; y0 = 0; x1 = 400; y1 = 300; }
  const pad = Math.max(30, 0.06 * Math.max(x1 - x0, y1 - y0)); const w = Math.max(160, x1 - x0 + 2 * pad), h = Math.max(120, y1 - y0 + 2 * pad);
  return { x: x0 - pad, y: y0 - pad, w, h };
}

/** the popup of one element: the rows (classical step and the reading) that stand for it */
function showElement(rec, res, keys, label, low) {
  openPopup({ title: label, className: "sk-element", render: (body) => {
    body.classList.add("sheet-grid");
    const model = buildSketchRows({ rec, res, map: new Map(), low }); const rows = linked(model, keys);
    const left = rows.filter((r) => r.side === "left"), right = rows.filter((r) => r.side === "right");
    const col = (title, sub, list, make) => { const s = el("section"); s.append(el("h3", null, title), el("p", "muted small", sub)); const ol = el("ol", "sk-list"); for (const r of list) ol.append(make(r)); if (!list.length) ol.append(el("li", "muted", "Nothing recorded for this element.")); s.append(ol); return s; };
    body.append(col("The classical step", "recognise.js: stroke groups, ranked kinds, features, $P. Not VSS.", left, leftItem), col("The reading", `${model.pass}: ${model.active}`, right, rightItem));
  } });
}

/** body: the popup body. opts: { strokes, rec, readings: [{id, title, sub, res}], chosen, preselect, lookup(ref) -> {box, shape, orient}, context: [{box}], low, onUse(id), onCancel() } */
export function renderSketchReadings(body, { strokes, rec, readings, chosen = null, preselect = null, lookup = null, context = [], low = 0.2, onUse = null, onCancel = null }) {
  body.replaceChildren(); body.classList.add("sk-view");
  body.append(el("p", "sk-who", WHO_LINE));
  const [a, b] = readings; const same = a && b && toCircuit(a.res) === toCircuit(b.res);
  if (same) body.append(el("p", "sk-same", "Both readings are the same for these strokes."));
  const vb = viewBoxOf(strokes, readings, context); const grid = el("div", "sk-pair");
  for (const r of readings) {
    const fig = el("figure", `sk-fig${chosen === r.id ? " sk-chosen" : ""}`); fig.dataset.reading = r.id;
    const cap = el("figcaption"); cap.append(el("h3", null, r.title + (chosen === r.id ? " (chosen)" : "")), el("p", "muted small", r.sub));
    const svg = drawReading({ strokes, rec, res: r.res, lookup, context, vb, onPick: (keys, label) => showElement(rec, r.res, keys, `${r.title}: ${label}`, low) });
    const nQ = (r.res.questions || []).length;
    const sum = el("p", "sk-sum", `${r.res.components.length} component${r.res.components.length === 1 ? "" : "s"}, ${r.res.connectors.length} connector${r.res.connectors.length === 1 ? "" : "s"}${r.res.deletions.components.length ? `, ${r.res.deletions.components.length} deletion${r.res.deletions.components.length === 1 ? "" : "s"}` : ""}${nQ ? `, ${nQ} question${nQ === 1 ? "" : "s"} (the ? marks)` : ""}. Click an element for its candidates, margins and questions.`);
    fig.append(cap, svg, sum);
    if (onUse) { const u = el("button", `sk-use${preselect === r.id ? " primary" : ""}`, "Use this"); u.type = "button"; u.dataset.use = r.id; u.onclick = () => onUse(r.id); fig.append(u); }
    grid.append(fig);
  }
  body.append(grid);
  if (onCancel) { const row = el("div", "sk-cancel-row"); const c = el("button", null, "Cancel (discard this sketch)"); c.type = "button"; c.id = "sk-cancel"; c.onclick = () => onCancel(); row.append(c, el("span", "muted small", "The X goes back to the drawing with the strokes kept.")); body.append(row); }
}
