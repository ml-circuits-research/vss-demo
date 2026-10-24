// view.js: the scene in the page (DOM code; the decisions are in ops.js, the drawing in render.js). One entry point for the UI:
//
//   createView(svgElement, scene, { onChange(kind, detail), onSelect(ids), onEditLabel(id), theme, corrected })
//     -> { render({highlight, question, corrected, animate}), fit(), zoomBy(f), setScene(scene), destroy(), screenToScene(x, y),
//          editLabel(id), svg, get scene() }
//
// render() rebuilds the virtual tree from the scene and patches the SVG with a keyed diff: one keyed group per component and per
// connector; a group whose content did not change is kept (only its transform is updated), so a drag re-renders one group. Components
// with a `text` or `formula` property get a persistent <foreignObject class="vss-slot" data-id> sized to their box, left empty for the
// text and formula modules to fill; the diff never replaces it. Interaction (mouse, touch, pen, keyboard) is in interact.js.
import { buildScene, ENGINE_CSS, LAYER_ORDER, contentBounds } from "./render.js";
import { attachInteraction } from "./interact.js";
import { routeAll } from "./router.js";

const NS = "http://www.w3.org/2000/svg";
function dom(n) {
  if (typeof n === "string" || typeof n === "number") return document.createTextNode(String(n));
  const e = document.createElementNS(NS, n.t);
  for (const [k, v] of Object.entries(n.a)) if (v != null && v !== false) e.setAttribute(k, v);
  for (const c of n.c) e.appendChild(dom(c));
  return e;
}
const sigOf = (n) => JSON.stringify([n.t, n.a.class, n.a["data-id"], n.a["data-cid"], n.c]);

// keyed diff of one layer; returns the number of groups whose transform changed
function patchKeyed(layer, nodes, cache) {
  let moved = 0; const keep = new Set();
  nodes.forEach((n, i) => {
    const key = n.k; keep.add(key); const sig = sigOf(n); let ent = cache.get(key);
    if (!ent || ent.sig !== sig) { const el = dom(n); if (ent) ent.el.replaceWith(el); ent = { el, sig, tr: n.a.transform }; cache.set(key, ent); }
    else if (ent.tr !== n.a.transform) { ent.el.setAttribute("transform", n.a.transform); ent.tr = n.a.transform; moved++; }
    if (layer.childNodes[i] !== ent.el) layer.insertBefore(ent.el, layer.childNodes[i] || null);
  });
  for (const [k, ent] of cache) if (!keep.has(k)) { ent.el.remove(); cache.delete(k); }
  return moved;
}

export function createView(svg, scene, opts = {}) {
  const cb = { onChange: opts.onChange || (() => {}), onSelect: opts.onSelect || (() => {}), onEditLabel: opts.onEditLabel || null };
  svg.classList.add("vss"); svg.setAttribute("tabindex", "0"); if (opts.theme) svg.setAttribute("data-theme", opts.theme);
  if (!svg.getAttribute("role")) svg.setAttribute("role", "application");
  svg.setAttribute("aria-label", "diagram canvas");
  const style = document.createElementNS(NS, "style"); style.textContent = ENGINE_CSS; svg.appendChild(style);
  const root = document.createElementNS(NS, "g"); root.setAttribute("class", "vss-root"); svg.appendChild(root);
  const layers = {}; const caches = {};
  for (const name of LAYER_ORDER) {
    layers[name] = document.createElementNS(NS, "g"); layers[name].setAttribute("class", `vss-layer-${name}`); caches[name] = new Map();
    root.appendChild(layers[name]);
    if (name === "components") { layers.slots = document.createElementNS(NS, "g"); layers.slots.setAttribute("class", "vss-layer-slots"); root.appendChild(layers.slots); }
  }
  const slots = new Map();
  if (!scene.view) scene.view = { zoom: 1, x: 0, y: 0 };
  const state = { scene, ext: { highlight: [], question: null, corrected: opts.corrected || [] }, ui: { selectedConnectors: [], ghost: null, marquee: null, drop: null, touch: false, interacting: false } };
  let raf = 0, animTimer = 0;

  function render(ext) {
    if (ext) state.ext = { ...state.ext, ...ext };
    const s = state.scene; const q = state.ext.question;
    if ([...s.connectors.values()].some((e) => !e.points)) routeAll(s);            // a route is derived data: compute what is missing
    const highlight = q && q.ids ? q.ids : state.ext.highlight || [];
    const built = buildScene(s, { selection: s.selection, selectedConnectors: state.ui.selectedConnectors, highlight, corrected: state.ext.corrected || [],
      touch: state.ui.touch, ghost: state.ui.ghost, marquee: state.ui.marquee, drop: state.ui.drop, inline: null });
    root.setAttribute("transform", built.root.transform);
    let moved = 0;
    for (const name of ["containers", "components", "connectors"]) moved += patchKeyed(layers[name], built.layers[name], caches[name]);
    layers.overlay.replaceChildren(...built.layers.overlay.map(dom));
    const keep = new Set();
    for (const sl of built.slots) {
      keep.add(sl.id); let fo = slots.get(sl.id);
      if (!fo) { fo = document.createElementNS(NS, "foreignObject"); fo.setAttribute("class", "vss-slot"); fo.setAttribute("data-id", sl.id); slots.set(sl.id, fo); layers.slots.appendChild(fo); }
      fo.setAttribute("data-slot", sl.kind); fo.setAttribute("x", sl.x); fo.setAttribute("y", sl.y); fo.setAttribute("width", sl.w); fo.setAttribute("height", sl.h);
    }
    for (const [id, fo] of slots) if (!keep.has(id)) { fo.remove(); slots.delete(id); }
    const animate = state.ext.animate ?? (moved > 0 && !state.ui.interacting);
    state.ext.animate = undefined;
    if (animate) { svg.classList.add("animate"); clearTimeout(animTimer); animTimer = setTimeout(() => svg.classList.remove("animate"), 480); }
    else if (state.ui.interacting) svg.classList.remove("animate");
  }
  const schedule = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; render(); }); };
  const size = () => { const r = svg.getBoundingClientRect(); return { w: r.width || svg.clientWidth || 800, h: r.height || svg.clientHeight || 600 }; };
  function screenToScene(cx, cy) { const r = svg.getBoundingClientRect(); const v = state.scene.view; const z = v.zoom || 1; return { x: (cx - r.left - (v.x || 0)) / z, y: (cy - r.top - (v.y || 0)) / z }; }
  function fit({ padding = 24, max = 1.6 } = {}) {
    const s = state.scene; const { w, h } = size(); const b = contentBounds(s);
    if (!s.components.size) { s.view = { zoom: 1, x: 0, y: 0 }; render(); return; }
    const z = Math.max(0.15, Math.min(max, (w - 2 * padding) / Math.max(1, b.w), (h - 2 * padding) / Math.max(1, b.h)));
    s.view = { zoom: Math.round(z * 1000) / 1000, x: Math.round((w - b.w * z) / 2 - b.x * z), y: Math.round((h - b.h * z) / 2 - b.y * z) }; render();
  }
  // zoom by a factor around a point on the screen (the canvas centre by default)
  function zoomBy(f, cx, cy) {
    const s = state.scene; const r = svg.getBoundingClientRect(); const v = s.view; const z0 = v.zoom || 1; const z = Math.max(0.1, Math.min(8, z0 * f));
    const px = cx != null ? cx - r.left : size().w / 2, py = cy != null ? cy - r.top : size().h / 2;
    s.view = { zoom: z, x: px - ((px - (v.x || 0)) / z0) * z, y: py - ((py - (v.y || 0)) / z0) * z }; schedule();
  }
  function setScene(s) {
    state.scene = s; if (!s.view) s.view = { zoom: 1, x: 0, y: 0 }; state.ui.selectedConnectors = [];
    for (const name of ["containers", "components", "connectors"]) { caches[name].clear(); layers[name].replaceChildren(); }
    for (const fo of slots.values()) fo.remove(); slots.clear(); render();
  }
  const api = {
    svg, render, fit, zoomBy, setScene, screenToScene, schedule, state, callbacks: cb,
    get scene() { return state.scene; },
    editLabel: (id) => interaction.editLabel(id),
    destroy() { interaction.detach(); cancelAnimationFrame(raf); clearTimeout(animTimer); root.remove(); style.remove(); svg.classList.remove("vss", "animate"); },
  };
  const interaction = attachInteraction(api);
  render();
  return api;
}
