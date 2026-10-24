// scene.js: the diagram as the world's database (spec 3.1): smart components and connectors with meaning, locks, the last-touched set
// for the pronoun rule (spec 10.3), and an undo stack with one entry per executed request (spec 9, Table 7). Pure data, no rendering:
// render.js draws it, ops.js changes it.
export const KIND_OF = {
  box: "process", process: "process", step: "process", task: "process", decision: "decision", diamond: "decision", start: "terminator",
  end: "terminator", database: "data", store: "data", cache: "data", queue: "data", document: "document", file: "document", report: "document",
  user: "actor", actor: "actor", customer: "actor", service: "system", server: "system", api: "system", gateway: "system", client: "system",
  cloud: "system", container: "container", lane: "container", note: "note", comment: "note", textbox: "note", title: "text", caption: "text",
  circle: "shape", ellipse: "shape", square: "shape", rectangle: "shape", triangle: "shape", star: "shape", hexagon: "shape",
  line: "connector", arrow: "connector", connector: "connector", shape: "generic", component: "generic", element: "generic", item: "generic",
  thing: "generic", canvas: "canvas", screen: "canvas", card: "note", formula: "formula", equation: "formula",
  // characters and travellers of the animation world (src/animate/README.md): components the resolver must find by their word
  robot: "character", figure: "character", person: "character", car: "character",
  dot: "token", envelope: "token", packet: "token", token: "token", request: "token", answer: "token", message: "token", ball: "token",
};
// words that name the same thing when resolving a reference ("the box" finds a component added as "a step"); other words of one kind
// stay distinct ("the cache" does not find a database)
export const SAME = [["box", "process", "step", "task"], ["decision", "diamond"], ["user", "actor", "customer"], ["note", "comment", "textbox", "card"],
  ["line", "arrow", "connector"], ["container", "lane"], ["service", "server", "api"], ["document", "file"], ["formula", "equation"], ["figure", "person"]];
export const sameWord = (a, b) => a === b || SAME.some((g) => g.includes(a) && g.includes(b));
const PLURALS = { boxes: "box", processes: "process", caches: "cache", ellipses: "ellipse", textboxes: "textbox", statuses: "status" };
export function singular(w) {
  if (PLURALS[w]) return PLURALS[w];
  if (KIND_OF[w]) return w;
  if (w.endsWith("s") && KIND_OF[w.slice(0, -1)]) return w.slice(0, -1);
  return w;
}
export const isPlural = (w) => singular(w) !== w;
export const SIZE_BOX = { tiny: [60, 30], small: [90, 45], medium: [130, 60], large: [180, 85], huge: [240, 115] };
export const COLORS = ["red", "orange", "yellow", "green", "teal", "blue", "purple", "pink", "brown", "gray", "black", "white"];
export const SIZES = ["tiny", "small", "medium", "large", "huge"];
export const STYLES = ["solid", "dashed", "dotted", "thick", "thin"];

export function createScene({ width = 1200, height = 800 } = {}) {
  const s = { width, height, components: new Map(), connectors: new Map(), locks: [], counter: 0, lastTouched: [], selection: [], view: { zoom: 1 },
    undo: [], redo: [] };
  return s;
}

export function snapshot(s) {
  return JSON.stringify({ c: [...s.components.values()], k: [...s.connectors.values()], l: s.locks, n: s.counter, t: s.lastTouched, v: s.view });
}
export function restore(s, snap) {
  const o = JSON.parse(snap);
  s.components = new Map(o.c.map((c) => [c.id, c])); s.connectors = new Map(o.k.map((c) => [c.id, c])); s.locks = o.l; s.counter = o.n; s.lastTouched = o.t; s.view = o.v;
}
export function overlaps(a, b, gap = 0) {
  return a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap;
}
