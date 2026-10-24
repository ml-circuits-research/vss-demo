// export.js: the diagram as a file (spec Table 7, export(svg | png | json)). JSON is the semantic model (components with kind, word,
// label, style, box, parent; connectors with their routes; locks), reloadable with importJSON. SVG is standalone (colours written into
// the elements, no CSS variables, no script). PNG is drawn from that SVG on a canvas (browser only). Pure except exportPNG / download.
//
//   exportJSON(scene) -> string        importJSON(text | object) -> scene (throws an Error with a readable message)
//   exportSVG(scene, {theme, padding, background}) -> string
//   exportPNG(scene, scale = 2, {theme}) -> Promise<Blob>             download(filename, data, type)
import { createScene } from "./scene.js";
import { toSVGString } from "./render.js";
import { routeAll } from "./router.js";

export const FORMAT = "vss-diagram"; export const VERSION = 1;
const COMP_KEYS = ["id", "word", "kind", "label", "color", "style", "size", "box", "parent", "order", "text", "formula"];
const CONN_KEYS = ["id", "source", "target", "kind", "style", "label", "color", "points", "ends"];
const pick = (o, keys) => { const r = {}; for (const k of keys) if (o[k] !== undefined) r[k] = o[k]; return r; };

export function toJSON(scene) {
  return { format: FORMAT, version: VERSION, width: scene.width, height: scene.height,
    components: [...scene.components.values()].map((c) => pick(c, COMP_KEYS)), connectors: [...scene.connectors.values()].map((e) => pick(e, CONN_KEYS)),
    locks: scene.locks.map((l) => ({ action: l.action, desc: l.desc })), counter: scene.counter, view: { zoom: scene.view?.zoom || 1, x: scene.view?.x || 0, y: scene.view?.y || 0 } };
}
export function exportJSON(scene) { return JSON.stringify(toJSON(scene), null, 2); }

export function importJSON(input) {
  let o = input;
  if (typeof input === "string") { try { o = JSON.parse(input); } catch (err) { throw new Error(`not a diagram file: ${err.message}`); } }
  if (!o || typeof o !== "object") throw new Error("not a diagram file: no object");
  if (o.format && o.format !== FORMAT) throw new Error(`not a diagram file: format "${o.format}"`);
  if (o.version && o.version > VERSION) throw new Error(`diagram file version ${o.version} is newer than this editor (${VERSION})`);
  if (!Array.isArray(o.components)) throw new Error("not a diagram file: no components");
  const s = createScene({ width: Number(o.width) || 1200, height: Number(o.height) || 800 });
  const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
  let maxN = 0; const seen = (id) => { const m = /(\d+)$/.exec(id); if (m) maxN = Math.max(maxN, Number(m[1])); };
  o.components.forEach((c, i) => {
    if (!c || typeof c.id !== "string") throw new Error(`component ${i}: no id`);
    if (s.components.has(c.id)) throw new Error(`component ${c.id}: duplicate id`);
    const b = c.box || {}; const comp = { ...pick(c, COMP_KEYS), word: c.word || "box", kind: c.kind || "process", label: c.label ?? null, color: c.color ?? null, style: c.style ?? null,
      box: { x: num(b.x, 60), y: num(b.y, 60), w: Math.max(4, num(b.w, 130)), h: Math.max(4, num(b.h, 60)) }, parent: c.parent ?? null, order: num(c.order, i + 1) };
    s.components.set(c.id, comp); seen(c.id);
  });
  for (const c of s.components.values()) if (c.parent && !s.components.has(c.parent)) c.parent = null;
  let needRoute = false;
  for (const [i, e] of (o.connectors || []).entries()) {
    if (!e || typeof e.id !== "string") throw new Error(`connector ${i}: no id`);
    if (!s.components.has(e.source) || !s.components.has(e.target)) throw new Error(`connector ${e.id}: unknown end`);
    const k = { ...pick(e, CONN_KEYS), kind: e.kind === "line" ? "line" : "arrow", style: e.style || "solid", label: e.label ?? null };
    if (!Array.isArray(k.points) || k.points.length < 2) { delete k.points; needRoute = true; }
    s.connectors.set(e.id, k); seen(e.id);
  }
  s.locks = Array.isArray(o.locks) ? o.locks.filter((l) => l && l.action).map((l) => ({ action: l.action, desc: l.desc || null })) : [];
  s.counter = Math.max(num(o.counter, 0), maxN);
  if (o.view) s.view = { zoom: num(o.view.zoom, 1), x: num(o.view.x, 0), y: num(o.view.y, 0) };
  if (needRoute) routeAll(s);
  return s;
}

export function exportSVG(scene, { theme = "light", padding = 24, background = true } = {}) { return toSVGString(scene, { inline: theme, padding, background }); }

export function exportPNG(scene, scale = 2, { theme = "light" } = {}) {
  const svg = exportSVG(scene, { theme });
  const m = /viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/.exec(svg); const w = Number(m[1]), h = Number(m[2]);
  return new Promise((res, rej) => {
    const img = new Image(); img.decoding = "async";
    img.onload = () => {
      const c = document.createElement("canvas"); const k = Math.max(0.1, Math.min(scale, 16384 / Math.max(w, h)));
      c.width = Math.round(w * k); c.height = Math.round(h * k); const ctx = c.getContext("2d"); ctx.scale(k, k); ctx.drawImage(img, 0, 0, w, h);
      c.toBlob((b) => (b ? res(b) : rej(new Error("PNG export failed"))), "image/png");
    };
    img.onerror = () => rej(new Error("PNG export failed: the SVG did not load"));
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  });
}

export function download(filename, data, type = "application/octet-stream") {
  const blob = data instanceof Blob ? data : new Blob([data], { type }); const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
