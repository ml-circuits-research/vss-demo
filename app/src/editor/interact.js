// interact.js: mouse, touch and pen on the canvas (Pointer Events), and the desktop keyboard. DOM code with no decisions of its own:
// every change is made with the operations of ops.js (spec Table 7, the same ones the planner uses), inside one transaction per
// gesture, so a drag, a resize, a connection, a deletion or a label edit is one undo entry, on the same stack as the spoken requests.
// Locks (spec 10.4) are checked before a gesture changes anything; a blocked gesture is reported through onChange("blocked", ...).
//
//   tap / click             select (shift, ctrl or cmd: add or remove); tap on the canvas clears; long press (touch) adds or removes
//   drag a component        move the selection (containers take their members; dropping into a container makes it the parent)
//   drag a handle           resize (shift keeps the proportions)
//   drag from a port        connect to the component under the pointer, or to a new box where it is dropped
//   drag the canvas         mouse: rubber-band selection; touch, middle button or space held: pan
//   two fingers             pinch zoom and pan;  ctrl + wheel or trackpad pinch: zoom;  wheel: pan
//   double click / tap      edit the label
//   keys                    Delete / Backspace, ctrl+Z, ctrl+shift+Z or ctrl+Y, arrows (shift: 1 px), Escape, ctrl+A, + - 0
import * as ops from "./ops.js";
import { routeAll } from "./router.js";
import { portPoint } from "./router.js";

const MOVE_PX = { mouse: 3, pen: 4, touch: 8 };
const LONG_MS = 520, DOUBLE_MS = 320;

export function attachInteraction(view) {
  const svg = view.svg; const ui = view.state.ui; const cb = view.callbacks;
  const S = () => view.scene;
  const pointers = new Map(); let g = null; let space = false; let lastTap = { id: null, t: 0, x: 0, y: 0 }; let editor = null;

  const changed = (op, ids) => { cb.onChange("manual", { op, ids }); };
  const select = (ids) => { S().selection = ids; ui.selectedConnectors = []; cb.onSelect(ids.slice()); view.render(); };
  const blocked = (action, ids) => { const b = ops.lockedBy(S(), action, ids); if (b) { cb.onChange("blocked", { op: action, ids: b.ids, text: `blocked by the lock "never ${b.lock.action} ${b.lock.desc ? (b.lock.desc.det && b.lock.desc.det !== "the" ? b.lock.desc.det + " " : "the ") + (b.lock.desc.attr ? b.lock.desc.attr.value + " " : "") + b.lock.desc.head : "anything"}"` }); } return !!b; };
  const hitOf = (target) => {
    const t = target && target.closest ? target : null; if (!t) return { kind: "bg" };
    const hd = t.closest("[data-handle]"); if (hd) return { kind: "handle", id: hd.getAttribute("data-id"), dir: hd.getAttribute("data-handle") };
    const pt = t.closest("[data-port]"); if (pt) return { kind: "port", id: pt.getAttribute("data-id"), side: pt.getAttribute("data-port") };
    const bd = t.closest(".vss-badge[data-id]"); if (bd) return { kind: "comp", id: bd.getAttribute("data-id") };
    const cn = t.closest("[data-cid]"); if (cn) return { kind: "conn", id: cn.getAttribute("data-cid") };
    const cp = t.closest("[data-id]"); if (cp && S().components.has(cp.getAttribute("data-id"))) return { kind: "comp", id: cp.getAttribute("data-id") };
    return { kind: "bg" };
  };
  const compAt = (cx, cy, except) => {
    const els = document.elementsFromPoint ? document.elementsFromPoint(cx, cy) : [document.elementFromPoint(cx, cy)];
    for (const el of els) { const h = hitOf(el); if (h.kind === "comp" && h.id !== except) return h.id; }
    return null;
  };
  const attachedTo = (ids) => {
    const set = new Set(ids); let grew = true;
    while (grew) { grew = false; for (const c of S().components.values()) if (c.parent && set.has(c.parent) && !set.has(c.id)) { set.add(c.id); grew = true; } }
    return [...S().connectors.values()].filter((e) => set.has(e.source) || set.has(e.target)).map((e) => e.id);
  };
  const topLevel = (ids) => ids.filter((id) => { let p = S().components.get(id)?.parent; while (p) { if (ids.includes(p)) return false; p = S().components.get(p)?.parent; } return true; });

  // ---------------------------------------------------------------- pointer events
  function down(e) {
    if (editor) commitEdit();
    if (e.button === 2) return;
    ui.touch = e.pointerType === "touch"; svg.focus({ preventScroll: true });
    try { svg.setPointerCapture(e.pointerId); } catch { /* synthetic events */ }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) { cancelGesture(); const [a, b] = [...pointers.values()]; g = { type: "pinch", d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, m0: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, v0: { ...S().view } }; return; }
    if (pointers.size > 2) return;
    const hit = hitOf(e.target); const p0 = view.screenToScene(e.clientX, e.clientY);
    const base = { x0: e.clientX, y0: e.clientY, p0, pointer: e.pointerType || "mouse", moved: false, id: e.pointerId };
    if (hit.kind === "handle") { g = { ...base, type: "resize", cid: hit.id, dir: hit.dir, box0: { ...S().components.get(hit.id).box } }; e.preventDefault(); return; }
    if (hit.kind === "port") { const b = S().components.get(hit.id).box; g = { ...base, type: "connect", cid: hit.id, from: portPoint(b, hit.side) }; e.preventDefault(); return; }
    if (hit.kind === "comp") {
      const add = e.shiftKey || e.metaKey || e.ctrlKey; const sel = S().selection;
      if (!add && !sel.includes(hit.id)) select([hit.id]);
      g = { ...base, type: "press", cid: hit.id, add };
      if (ui.touch) g.timer = setTimeout(() => { if (g && g.type === "press" && !g.moved) { toggle(hit.id); g.type = "done"; if (navigator.vibrate) navigator.vibrate(12); } }, LONG_MS);
      e.preventDefault(); return;
    }
    if (hit.kind === "conn") { S().selection = []; ui.selectedConnectors = [hit.id]; cb.onSelect([]); view.schedule(); g = { ...base, type: "done" }; return; }
    const pan = ui.touch || e.button === 1 || space;
    g = pan ? { ...base, type: "pan", v0: { ...S().view } } : { ...base, type: "marquee", add: e.shiftKey || e.metaKey || e.ctrlKey };
  }
  function toggle(id) { const sel = S().selection; select(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]); }

  function move(e) {
    if (!pointers.has(e.pointerId)) return; pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!g) return;
    if (g.type === "pinch") {
      const [a, b] = [...pointers.values()]; if (!b) return; const d = Math.hypot(a.x - b.x, a.y - b.y) || 1; const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const r = svg.getBoundingClientRect(); const v0 = g.v0; const z0 = v0.zoom || 1; const z = Math.max(0.1, Math.min(8, z0 * (d / g.d0)));
      const sx = (g.m0.x - r.left - (v0.x || 0)) / z0, sy = (g.m0.y - r.top - (v0.y || 0)) / z0;     // the scene point under the first midpoint
      S().view = { zoom: z, x: m.x - r.left - sx * z, y: m.y - r.top - sy * z }; view.schedule(); return;
    }
    if (e.pointerId !== g.id) return;
    const dxs = e.clientX - g.x0, dys = e.clientY - g.y0;
    if (!g.moved && Math.hypot(dxs, dys) < (MOVE_PX[g.pointer] || 4)) return;
    const first = !g.moved; g.moved = true; if (g.timer) { clearTimeout(g.timer); g.timer = null; }
    const p = view.screenToScene(e.clientX, e.clientY); const dx = Math.round(p.x - g.p0.x), dy = Math.round(p.y - g.p0.y);
    if (g.type === "press") {
      const ids = topLevel(S().selection.includes(g.cid) ? S().selection : [g.cid]);
      if (blocked("move", ids)) { g.type = "done"; return; }
      g = { ...g, type: "drag", ids, tx: ops.begin(S()), orig: new Map(ids.map((id) => [id, { ...S().components.get(id).box }])), conns: attachedTo(ids) }; ui.interacting = true;
    }
    if (g.type === "drag") {
      for (const id of g.ids) { const o = g.orig.get(id); ops.move(S(), id, { x: o.x + dx, y: o.y + dy }, { fit: false }); }
      if (g.conns.length) routeAll(S(), { ids: g.conns, quick: true });
      const c = S().components.get(g.ids[0]); const cx = c.box.x + c.box.w / 2, cy = c.box.y + c.box.h / 2;
      const holder = [...S().components.values()].filter((k) => k.kind === "container" && !g.ids.includes(k.id) && cx > k.box.x && cx < k.box.x + k.box.w && cy > k.box.y && cy < k.box.y + k.box.h).sort((a, b) => a.box.w * a.box.h - b.box.w * b.box.h)[0];
      ui.drop = holder && holder.id !== c.parent ? holder.id : null; view.schedule(); return;
    }
    if (g.type === "resize") {
      if (first) { if (blocked("resize", [g.cid])) { g.type = "done"; return; } g.tx = ops.begin(S()); g.conns = attachedTo([g.cid]); ui.interacting = true; }
      const b = { ...g.box0 }; const d = g.dir;
      if (d.includes("e")) b.w = Math.max(20, g.box0.w + dx); if (d.includes("s")) b.h = Math.max(16, g.box0.h + dy);
      if (d.includes("w")) { b.w = Math.max(20, g.box0.w - dx); b.x = g.box0.x + g.box0.w - b.w; }
      if (d.includes("n")) { b.h = Math.max(16, g.box0.h - dy); b.y = g.box0.y + g.box0.h - b.h; }
      if (e.shiftKey && d.length === 2) { const k = Math.max(b.w / g.box0.w, b.h / g.box0.h); b.w = Math.round(g.box0.w * k); b.h = Math.round(g.box0.h * k); if (d.includes("w")) b.x = g.box0.x + g.box0.w - b.w; if (d.includes("n")) b.y = g.box0.y + g.box0.h - b.h; }
      ops.resize(S(), g.cid, b, { fit: false }); if (g.conns.length) routeAll(S(), { ids: g.conns, quick: true }); view.schedule(); return;
    }
    if (g.type === "connect") { ui.ghost = { from: g.from, to: p }; ui.drop = compAt(e.clientX, e.clientY, g.cid); ui.interacting = true; view.schedule(); return; }
    if (g.type === "marquee") { ui.marquee = { x: Math.min(p.x, g.p0.x), y: Math.min(p.y, g.p0.y), w: Math.abs(p.x - g.p0.x), h: Math.abs(p.y - g.p0.y) }; view.schedule(); return; }
    if (g.type === "pan") { S().view = { ...g.v0, x: (g.v0.x || 0) + dxs, y: (g.v0.y || 0) + dys }; view.schedule(); }
  }

  function up(e) {
    if (!pointers.has(e.pointerId)) return; pointers.delete(e.pointerId);
    try { svg.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    if (!g) return;
    if (g.type === "pinch") { if (pointers.size === 0) g = null; else g = { type: "done", id: [...pointers.keys()][0] }; return; }
    if (e.pointerId !== g.id) return;
    const G = g; g = null; if (G.timer) clearTimeout(G.timer);
    ui.interacting = false; ui.ghost = null; ui.marquee = null; const drop = ui.drop; ui.drop = null;
    const s = S();
    if (G.type === "press") {
      if (G.add) toggle(G.cid); else if (s.selection.length !== 1 || s.selection[0] !== G.cid) select([G.cid]); else cb.onSelect(s.selection.slice());
      const now = Date.now();
      if (G.pointer !== "mouse" && lastTap.id === G.cid && now - lastTap.t < DOUBLE_MS && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 24) { lastTap = { id: null, t: 0 }; editLabel(G.cid); }
      else lastTap = { id: G.cid, t: now, x: e.clientX, y: e.clientY };
      view.schedule(); return;
    }
    if (G.type === "drag") {
      for (const id of G.ids) { ops.reparent(s, id); ops.move(s, id, s.components.get(id).box); }
      ops.route(s); if (ops.commit(s, G.tx)) changed("move", G.ids); view.render(); return;
    }
    if (G.type === "resize") { if (!G.moved) return; ops.route(s); if (ops.commit(s, G.tx)) changed("resize", [G.cid]); view.render(); return; }
    if (G.type === "connect") {
      if (!G.moved) { view.schedule(); return; }
      const p = view.screenToScene(e.clientX, e.clientY);
      if (drop) { if (blocked("connect", [G.cid, drop])) { view.schedule(); return; } const tx = ops.begin(s); const id = ops.connect(s, G.cid, drop, { kind: "arrow" }); ops.route(s); ops.commit(s, tx); s.lastTouched = [G.cid, drop]; changed("connect", [id]); view.render(); return; }
      if (Math.hypot(p.x - G.from.x, p.y - G.from.y) > 40) {                       // dropped on the canvas: a new box there, connected
        if (blocked("connect", [G.cid])) { view.schedule(); return; }
        const src = s.components.get(G.cid); const [w, h] = ops.defaultBox("process", "box"); const tx = ops.begin(s);
        const nid = ops.create(s, { word: "box", kind: "process", parent: null }, { x: Math.round(p.x - w / 2), y: Math.round(p.y - h / 2), w, h });
        ops.reparent(s, nid); const id = ops.connect(s, src.id, nid, { kind: "arrow" }); ops.route(s); ops.commit(s, tx);
        s.lastTouched = [nid]; select([nid]); changed("create", [nid, id]); view.render(); return;
      }
      view.schedule(); return;
    }
    if (G.type === "marquee") {
      if (!G.moved) { if (s.selection.length || ui.selectedConnectors.length) select([]); return; }
      const m = view.screenToScene(e.clientX, e.clientY); const R = { x1: Math.min(m.x, G.p0.x), y1: Math.min(m.y, G.p0.y), x2: Math.max(m.x, G.p0.x), y2: Math.max(m.y, G.p0.y) };
      const inside = [...s.components.values()].filter((c) => c.box.x >= R.x1 && c.box.y >= R.y1 && c.box.x + c.box.w <= R.x2 && c.box.y + c.box.h <= R.y2).sort((a, b) => a.order - b.order).map((c) => c.id);
      select(G.add ? [...new Set([...s.selection, ...inside])] : inside); return;
    }
    if (G.type === "pan" && !G.moved) { if (s.selection.length || ui.selectedConnectors.length) select([]); }
    view.schedule();
  }
  function cancelGesture() {
    if (!g) return; if (g.timer) clearTimeout(g.timer);
    if ((g.type === "drag" || g.type === "resize") && g.tx) ops.rollback(S(), g.tx);
    ui.interacting = false; ui.ghost = null; ui.marquee = null; ui.drop = null; g = null; view.schedule();
  }
  function cancelPointer(e) { pointers.delete(e.pointerId); cancelGesture(); }

  function wheel(e) {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) { view.zoomBy(Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0022)), e.clientX, e.clientY); return; }
    const k = e.deltaMode === 1 ? 16 : 1; const v = S().view; S().view = { ...v, x: (v.x || 0) - e.deltaX * k, y: (v.y || 0) - e.deltaY * k }; view.schedule();
  }
  function dbl(e) { const id = compAt(e.clientX, e.clientY, null); if (id) { e.preventDefault(); editLabel(id); } }   // pointer capture retargets dblclick to the svg

  // ---------------------------------------------------------------- label editing
  function editLabel(id) {
    const s = S(); const c = s.components.get(id); if (!c) return;
    if (cb.onEditLabel && cb.onEditLabel(id) === false) return;            // the UI took over
    if (blocked("name", [id])) return;
    if (editor) commitEdit();
    const host = svg.parentElement; if (!host) return; if (getComputedStyle(host).position === "static") host.style.position = "relative";
    const r = svg.getBoundingClientRect(), hr = host.getBoundingClientRect(); const v = s.view; const z = v.zoom || 1;
    const input = document.createElement("textarea"); input.className = "vss-label-editor"; input.value = c.label || ""; input.setAttribute("aria-label", "label");
    const w = Math.max(120, c.box.w * z), hgt = Math.max(36, Math.min(c.box.h * z, 120));
    const left = r.left - hr.left + (v.x || 0) + c.box.x * z + (c.box.w * z - w) / 2, top = r.top - hr.top + (v.y || 0) + c.box.y * z + (c.box.h * z - hgt) / 2;
    Object.assign(input.style, { position: "absolute", left: `${left}px`, top: `${top}px`, width: `${w}px`, height: `${hgt}px`, zIndex: 10, resize: "none", boxSizing: "border-box",
      font: `${Math.max(16, Math.round(14 * z))}px system-ui, sans-serif`, textAlign: "center", padding: "6px", borderRadius: "6px", border: "2px solid var(--sel, #2f6fec)",
      background: "var(--bg, #fff)", color: "var(--fg, #1f2328)", outline: "none" });
    host.appendChild(input); input.focus(); input.select();
    editor = { id, input, done: false };
    input.addEventListener("keydown", (k) => { k.stopPropagation(); if (k.key === "Enter" && !k.shiftKey) { k.preventDefault(); commitEdit(); } if (k.key === "Escape") { k.preventDefault(); closeEdit(); } });
    input.addEventListener("blur", () => commitEdit());
  }
  function closeEdit() { if (!editor) return; const ed = editor; editor = null; ed.input.remove(); svg.focus({ preventScroll: true }); }
  function commitEdit() {
    if (!editor) return; const { id, input } = editor; const text = input.value.replace(/\s+/g, " ").trim(); closeEdit();
    const s = S(); const c = s.components.get(id); if (!c || (c.label || "") === text) return;
    const tx = ops.begin(s); ops.set(s, [id], { label: text || null }); ops.commit(s, tx); s.lastTouched = [id]; changed("name", [id]); view.render();
  }

  // ---------------------------------------------------------------- keyboard
  function key(e) {
    if (editor) return; const s = S(); const mod = e.ctrlKey || e.metaKey;
    if (e.key === " ") { space = true; return; }
    if (mod && (e.key === "z" || e.key === "Z")) { e.preventDefault(); const r = e.shiftKey ? ops.redo(s) : ops.undo(s); if (r.applied) { select(s.selection.filter((id) => s.components.has(id))); changed(e.shiftKey ? "redo" : "undo", []); } view.render(); return; }
    if (mod && (e.key === "y" || e.key === "Y")) { e.preventDefault(); if (ops.redo(s).applied) changed("redo", []); view.render(); return; }
    if (mod && (e.key === "a" || e.key === "A")) { e.preventDefault(); select([...s.components.values()].sort((a, b) => a.order - b.order).map((c) => c.id)); return; }
    if (e.key === "Escape") { cancelGesture(); select([]); return; }
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      if (ui.selectedConnectors.length) { const ids = ui.selectedConnectors.slice(); const tx = ops.begin(s); ops.remove(s, ids); ops.commit(s, tx); ui.selectedConnectors = []; changed("delete", ids); view.render(); return; }
      if (!s.selection.length || blocked("delete", s.selection)) return;
      const ids = s.selection.slice(); const tx = ops.begin(s); ops.remove(s, ids); ops.route(s); ops.commit(s, tx); s.lastTouched = []; select([]); changed("delete", ids); view.render(); return;
    }
    const arrows = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (arrows[e.key] && s.selection.length) {
      e.preventDefault(); const ids = topLevel(s.selection); if (blocked("move", ids)) return; const k = e.shiftKey ? 1 : 10;
      const tx = ops.begin(s); ops.moveBy(s, ids, arrows[e.key][0] * k, arrows[e.key][1] * k); ops.route(s); ops.commit(s, tx); s.lastTouched = ids.slice(); changed("move", ids); view.render(); return;
    }
    if (!mod && (e.key === "+" || e.key === "=")) { view.zoomBy(1.2); return; }
    if (!mod && (e.key === "-" || e.key === "_")) { view.zoomBy(1 / 1.2); return; }
    if (!mod && e.key === "0") { view.fit(); return; }
    if (e.key === "F2" && s.selection.length === 1) { e.preventDefault(); editLabel(s.selection[0]); }
  }
  const keyUp = (e) => { if (e.key === " ") space = false; };

  const L = [["pointerdown", down], ["pointermove", move], ["pointerup", up], ["pointercancel", cancelPointer], ["lostpointercapture", (e) => { if (pointers.has(e.pointerId)) up(e); }],
    ["wheel", wheel, { passive: false }], ["dblclick", dbl], ["keydown", key], ["keyup", keyUp], ["contextmenu", (e) => e.preventDefault()]];
  for (const [t, f, o] of L) svg.addEventListener(t, f, o);
  return { detach() { for (const [t, f, o] of L) svg.removeEventListener(t, f, o); closeEdit(); }, editLabel, cancel: cancelGesture };
}
