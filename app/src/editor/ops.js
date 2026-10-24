// ops.js: the engine operations of spec section 9, Table 7, as one API used by the planner (planner.js execute) and by the manual
// interaction (interact.js), so that both go through the same code and the same undo stack. Pure: no DOM.
//
//   create(scene, props, box) -> id          remove(scene, ids)                 move(scene, id, {x, y}) / moveBy(scene, ids, dx, dy)
//   resize(scene, id, box)                    set(scene, ids, props)             connect(scene, source, target, props) -> id
//   group(scene, ids, label) -> id            ungroup(scene, ids)                layout(scene, ids, kind, options) -> {notes}
//   align / distribute                        order(scene, ids, where)           lock(scene, action, desc) / unlock(scene, index)
//   query(scene, desc) (the resolver)         undo(scene) / redo(scene)          route(scene, {ids, quick})
// Transactions: begin(scene) -> tx; commit(scene, tx) pushes one undo entry if the scene changed; rollback(scene, tx) restores;
// transact(scene, fn) wraps fn. checkpoint(scene) pushes an entry unconditionally (the planner's rule: one entry per executed request).
// Connectors attached to anything that moved are re-routed by route() (router.js); after a change every route is recomputed, which
// keeps "no connector crosses a component" true whatever moved.
import { snapshot, restore, SIZE_BOX } from "./scene.js";
import { resolve } from "./resolver.js";
import { arrange, align as alignL, distribute as distributeL, fitContainer, fitAncestors, moveTree, growCanvas, PAD } from "./layout.js";
import { routeAll, segmentHitsBox } from "./router.js";

export { PAD };
export const query = (scene, desc, opts) => resolve(scene, desc, opts);

// ------------------------------------------------------------------ transactions and undo
export function checkpoint(scene) { scene.undo.push(snapshot(scene)); scene.redo = []; }
export function begin(scene) { return { snap: snapshot(scene) }; }
export function commit(scene, tx) { if (snapshot(scene) === tx.snap) return false; scene.undo.push(tx.snap); scene.redo = []; return true; }
export function rollback(scene, tx) { const v = scene.view; restore(scene, tx.snap); scene.view = v; }
export function transact(scene, fn) { const tx = begin(scene); const r = fn(); commit(scene, tx); return r; }
// undo and redo keep the current view (zoom and pan are not part of the document)
export function undo(scene) { if (!scene.undo.length) return { applied: 0, notes: ["nothing to undo"] }; const v = scene.view; scene.redo.push(snapshot(scene)); restore(scene, scene.undo.pop()); scene.view = v; return { applied: 1, notes: [] }; }
export function redo(scene) { if (!scene.redo.length) return { applied: 0, notes: ["nothing to redo"] }; const v = scene.view; scene.undo.push(snapshot(scene)); restore(scene, scene.redo.pop()); scene.view = v; return { applied: 1, notes: [] }; }

// ------------------------------------------------------------------ locks (spec 10.4)
export function lockedBy(scene, action, ids) {
  for (const L of scene.locks) {
    if (L.action !== action && L.action !== "*") continue;
    const hit = ids.filter((id) => resolve(scene, L.desc).ids.includes(id));
    if (hit.length) return { lock: L, ids: hit };
  }
  return null;
}
export function lock(scene, action, desc) { scene.locks.push({ action, desc }); return scene.locks.length - 1; }
export function unlock(scene, index) { scene.locks.splice(index, 1); }
export function lockedIds(scene) { const out = new Map(); for (const L of scene.locks) for (const id of resolve(scene, L.desc).ids) { if (!out.has(id)) out.set(id, []); out.get(id).push(L.action); } return out; }

// ------------------------------------------------------------------ default boxes per kind (spec 9: a default size that fits its label)
export function defaultBox(kind, word, size = "medium") {
  const [w, h] = SIZE_BOX[size] || SIZE_BOX.medium;
  if (kind === "actor") return [Math.round(h * 1.1), Math.round(h * 1.6)];
  if (kind === "decision") return [Math.round(w * 1.1), Math.round(h * 1.4)];
  if (kind === "shape" && ["circle", "square", "star", "hexagon", "triangle"].includes(word)) return [Math.round(h * 1.4), Math.round(h * 1.4)];
  if (kind === "text") return [Math.round(w * 1.3), Math.round(h * 0.6)];
  if (kind === "container") return [Math.round(w * 2.4), Math.round(h * 3)];
  if (kind === "data" && word !== "queue") return [w, Math.round(h * 1.25)];
  return [w, h];
}
// rough text width (px) for a sans-serif font, used to widen a box for a long label; the renderer uses the same metric
export function textWidth(s, size = 14) {
  let w = 0;
  for (const ch of String(s)) w += /[il.,:;'|!]/.test(ch) ? 0.28 : /[fjtrI ]/.test(ch) ? 0.33 : /[mwMW]/.test(ch) ? 0.86 : /[A-Z]/.test(ch) ? 0.66 : /[0-9]/.test(ch) ? 0.56 : 0.53;
  return w * size;
}

// ------------------------------------------------------------------ components
export function create(scene, props, box) {
  const id = props.id || `c${++scene.counter}`;
  const c = { id, word: props.word || "box", kind: props.kind || "process", label: props.label ?? null, color: props.color ?? null, style: props.style ?? null,
    size: props.size ?? null, box: { x: box.x ?? 60, y: box.y ?? 60, w: box.w, h: box.h }, order: props.order ?? scene.counter, parent: props.parent ?? null };
  for (const k of ["text", "formula"]) if (props[k] != null) c[k] = props[k];
  scene.components.set(id, c);
  if (c.parent) fitAncestors(scene, id, { exact: false });
  return id;
}
export function remove(scene, ids) {
  for (const id of ids) {
    if (scene.connectors.has(id)) { scene.connectors.delete(id); continue; }
    const c = scene.components.get(id); if (!c) continue;
    for (const k of scene.components.values()) if (k.parent === id) k.parent = c.parent || null;
    scene.components.delete(id);
    for (const [k, e] of scene.connectors) if (e.source === id || e.target === id) scene.connectors.delete(k);
  }
  scene.selection = scene.selection.filter((id) => scene.components.has(id));
}
// move one component (a container takes its members); the containers holding it grow to keep it
export function move(scene, id, { x, y }, { fit = true } = {}) {
  if (!scene.components.has(id)) return; moveTree(scene, id, Math.round(x), Math.round(y)); if (fit) fitAncestors(scene, id, { exact: false });
}
export function moveBy(scene, ids, dx, dy, opts) {
  const set = new Set(ids); const top = ids.filter((id) => { let p = scene.components.get(id)?.parent; while (p) { if (set.has(p)) return false; p = scene.components.get(p)?.parent; } return true; });
  for (const id of top) { const b = scene.components.get(id)?.box; if (b) move(scene, id, { x: b.x + dx, y: b.y + dy }, opts); }
}
export function resize(scene, id, box, { fit = true } = {}) {
  const c = scene.components.get(id); if (!c) return; let b = { x: Math.round(box.x), y: Math.round(box.y), w: Math.max(16, Math.round(box.w)), h: Math.max(12, Math.round(box.h)) };
  const ks = [...scene.components.values()].filter((k) => k.parent === id);
  if (ks.length) {                                                 // a container never gets smaller than its members
    const x1 = Math.min(...ks.map((k) => k.box.x)) - PAD.l, y1 = Math.min(...ks.map((k) => k.box.y)) - PAD.t;
    const x2 = Math.max(...ks.map((k) => k.box.x + k.box.w)) + PAD.r, y2 = Math.max(...ks.map((k) => k.box.y + k.box.h)) + PAD.b;
    const nx = Math.min(b.x, x1), ny = Math.min(b.y, y1); b = { x: nx, y: ny, w: Math.max(b.x + b.w, x2) - nx, h: Math.max(b.y + b.h, y2) - ny };
  }
  c.box = b; delete c.size; if (fit) fitAncestors(scene, id, { exact: false });
}
// set the parent of a component from where its centre is (after a manual drag); returns the new parent or null
export function reparent(scene, id) {
  const c = scene.components.get(id); if (!c) return null; const cx = c.box.x + c.box.w / 2, cy = c.box.y + c.box.h / 2;
  const isDesc = (k) => { let p = k.parent; while (p) { if (p === id) return true; p = scene.components.get(p)?.parent; } return false; };
  const holders = [...scene.components.values()].filter((k) => k.kind === "container" && k.id !== id && !isDesc(k) && cx > k.box.x && cx < k.box.x + k.box.w && cy > k.box.y && cy < k.box.y + k.box.h);
  holders.sort((a, b) => a.box.w * a.box.h - b.box.w * b.box.h);   // the innermost
  const p = holders.length ? holders[0].id : null;
  if (p !== c.parent) { c.parent = p; if (p) fitAncestors(scene, id, { exact: false }); }
  return p;
}
export const SIZE_WORDS = ["tiny", "small", "medium", "large", "huge"];
export function set(scene, ids, props) {
  for (const id of ids) {
    const e = scene.connectors.get(id); if (e) { for (const k of ["color", "style", "label", "kind"]) if (k in props) e[k] = props[k]; continue; }
    const c = scene.components.get(id); if (!c) continue; const { scale, ...rest } = props; Object.assign(c, rest);
    if (rest.size && SIZE_BOX[rest.size]) { const [w, h] = defaultBox(c.kind, c.word, rest.size); c.box = { ...c.box, w, h }; }
    if (rest.size === "bigger" || rest.size === "smaller" || scale) { const k = scale || (rest.size === "bigger" ? 1.25 : 0.8); c.box = { ...c.box, w: Math.round(c.box.w * k), h: Math.round(c.box.h * k) }; delete c.size; }
    if (c.box) fitAncestors(scene, id, { exact: false });
  }
}
export function connect(scene, source, target, props = {}) {
  const id = props.id || `e${++scene.counter}`;
  scene.connectors.set(id, { id, source, target, kind: props.kind === "line" ? "line" : "arrow", style: props.style || "solid", label: props.label ?? null, color: props.color ?? null });
  return id;
}
export function group(scene, ids, label = null) {
  const cs = ids.map((i) => scene.components.get(i)).filter(Boolean); if (!cs.length) return null;
  const parents = new Set(cs.map((c) => c.parent || null)); const parent = parents.size === 1 ? [...parents][0] : null;
  const id = `g${++scene.counter}`;
  scene.components.set(id, { id, word: "container", kind: "container", label: label || null, color: null, style: "dashed", box: { x: 0, y: 0, w: 10, h: 10 }, order: scene.counter, parent });
  for (const c of cs) c.parent = id;
  fitContainer(scene, id, { exact: true }); fitAncestors(scene, id, { exact: false });
  return id;
}
export function ungroup(scene, ids) {
  for (const g of ids) { const c = scene.components.get(g); if (!c) continue; for (const k of scene.components.values()) if (k.parent === g) k.parent = c.parent || null; remove(scene, [g]); }
}
export function layout(scene, ids, kind, options = {}) { return arrange(scene, ids, kind, options); }
export function align(scene, ids, options) { alignL(scene, ids, options); }
export function distribute(scene, ids, options) { distributeL(scene, ids, options); }
export function order(scene, ids, where) { for (const id of ids) { const c = scene.components.get(id); if (c) c.order = where === "front" ? ++scene.counter : -(++scene.counter); } }
export function zoom(scene, factor) { scene.view.zoom = Math.max(0.1, Math.min(8, (scene.view.zoom || 1) * factor)); }
// Incremental routing (the full recomputation cost about 16 s per page on the 10-page scripts): without explicit ids, only the
// connectors that can have changed are routed again: new ones, those whose ends moved or resized, and those whose current path now
// touches a component that is new, moved or resized; the others keep their route and count as used channels. route(scene, {full: true})
// recomputes everything. The invariant "no connector crosses a component" holds because every path that touches a changed box is redone.
const lastBoxes = new WeakMap();
export function route(scene, opts = {}) {
  growCanvas(scene);
  const prev = lastBoxes.get(scene); const now = new Map([...scene.components.values()].map((c) => [c.id, `${c.box.x},${c.box.y},${c.box.w},${c.box.h},${c.parent || ""}`]));
  lastBoxes.set(scene, now);
  if (opts.ids || opts.full || !prev) return routeAll(scene, opts);
  const changed = [...now].filter(([id, k]) => prev.get(id) !== k).map(([id]) => id); const removed = [...prev.keys()].some((id) => !now.has(id));
  const ch = new Set(changed); const boxes = changed.map((id) => scene.components.get(id).box);
  const hits = (e) => { const p = e.points || []; for (let i = 0; i + 1 < p.length; i++) for (const b of boxes) if (segmentHitsBox(p[i], p[i + 1], b)) return true; return false; };
  const ids = [...scene.connectors.values()].filter((e) => !e.points || ch.has(e.source) || ch.has(e.target) || hits(e)).map((e) => e.id);
  if (!ids.length && !removed) return { routed: 0, failed: [] };
  return routeAll(scene, { ...opts, ids: ids.length ? ids : [] });
}
