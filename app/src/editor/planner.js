// planner.js: from the reader's frame to a plan (spec 8.1, 10.2, 10.4). Each event has an action schema: its roles, its preconditions
// and the operations it expands into. A failed precondition is a question, never a guess. A prohibition (the frame's negation around
// the event) is not executed: it becomes a lock, checked before every later step. The whole plan is one undo entry.
// plan(scene, frame, info) -> {steps: [{op, explain, ...}], questions: [...], blocked: [...], resolutions: [...]}
// execute(scene, plan) applies the steps; undo(scene) / redo(scene) restore.
import { KIND_OF, singular, SIZE_BOX, snapshot, restore } from "./scene.js";
import { describe, resolve, phrase, labelKey } from "./resolver.js";
import { place, GAP } from "./geometry.js";

const word = (f) => (f && (f[0] === "word" || f[0] === "negword") ? f[1] : null);
const DEFAULT_SIZE = "medium";

function slotsOf(frame, info) {
  const r = frame.roles || {}; const w = (k) => word(r[k]);
  const amount = w("amount"), quantity = w("quantity");
  return { region: w("region"), relation: w("relation"), anchor: w("anchor"), fraction: w("fraction"), direction: w("direction"), axis: w("axis"),
    layout: w("layout"), pairing: w("pairing"), color: w("color"), size: w("size"), style: w("style"), unit: w("unit"),
    amount: amount != null ? (info?.numbers?.[amount] ?? Number(amount)) : null, quantity: quantity != null ? (info?.numbers?.[quantity] ?? Number(quantity)) : null,
    text: w("text") != null ? (info?.labels?.[w("text")] ?? w("text")) : null };
}

function lockedBy(scene, action, ids) {
  for (const L of scene.locks) {
    if (L.action !== action && L.action !== "*") continue;
    const res = resolve(scene, L.desc);
    const hit = ids.filter((id) => res.ids.includes(id));
    if (hit.length) return { lock: L, ids: hit };
  }
  return null;
}

export function plan(scene, frame, info = {}) {
  const out = { steps: [], questions: [], blocked: [], resolutions: [], event: frame.event };
  const r = frame.roles || {}; const s = slotsOf(frame, info); const ev = frame.event;
  const need = (role, { creating = false } = {}) => {
    const d = describe(r[role]); if (!d) return null;
    const res = resolve(scene, d, { creating }); out.resolutions.push({ role, ...res, text: phrase(d) });
    if (res.status === "none") out.questions.push({ kind: "no-match", role, text: `there is no ${phrase(d).replace(/^the /, "")}${creating ? "" : "; add one?"}` });
    if (res.status === "ambiguous") out.questions.push({ kind: "which", role, candidates: res.ids, text: `which ${d.head}?` });
    return res;
  };
  if (frame.neg) {                                                   // prohibition -> lock (spec 10.4)
    const d = describe(r.object || r.source);
    out.steps.push({ op: "lock", action: ev, desc: d, explain: `lock: never ${ev} ${d ? phrase(d) : "anything"}` });
    return out;
  }
  const landmarkBox = () => { const lm = r.landmark ? need("landmark") : null; return lm && lm.status === "ok" ? scene.components.get(lm.ids[0]).box : null; };
  const guard = (action, ids) => { const b = lockedBy(scene, action, ids); if (b) out.blocked.push({ action, ids: b.ids, text: `blocked by the lock "never ${b.lock.action} ${phrase(b.lock.desc)}"` }); return !b; };

  switch (ev) {
    case "create": case "place": {
      const d = describe(r.object); if (!d) { out.questions.push({ kind: "missing", role: "object", text: "what should I add?" }); break; }
      const creating = ev === "create" || d.det === "a" || d.det === "an" || (!d.det && !scene.components.size);
      if (ev === "place" && !creating) {                             // place with a definite object = move (a convention, spec 10.2)
        const o = need("object"); if (!o || o.status !== "ok") break;
        return planMove(scene, frame, info, o, out, s, landmarkBox, guard);
      }
      const sing = singular(d.head); const kind = KIND_OF[sing] || "process"; const n = s.quantity || 1;
      const size = (d.attr && ["tiny", "small", "medium", "large", "huge"].includes(d.attr.value)) ? d.attr.value : DEFAULT_SIZE;
      const lmBox = landmarkBox(); if (r.landmark && !lmBox) break;
      for (let i = 0; i < n; i++) {
        const [w, h] = SIZE_BOX[size];
        out.steps.push({ op: "create", word: sing, kind, size, w, h, color: d.attr && !d.attr.neg && ["red", "orange", "yellow", "green", "teal", "blue", "purple", "pink", "brown", "gray", "black", "white"].includes(d.attr.value) ? d.attr.value : null,
          style: d.attr && ["solid", "dashed", "dotted", "thick", "thin"].includes(d.attr.value) ? d.attr.value : null, label: s.text, slots: i === 0 ? s : { relation: "right_of" }, landmark: i === 0 ? lmBox : "previous",
          explain: `create a ${size} ${sing}${s.text ? ` called "${s.text}"` : ""}${i === 0 && (s.region || s.relation) ? ` ${s.region || s.relation.replace("_", " ")}` : ""}` });
      }
      break;
    }
    case "move": { const o = need("object"); if (o && o.status === "ok") return planMove(scene, frame, info, o, out, s, landmarkBox, guard); break; }
    case "delete": case "clear": {
      if (ev === "clear" || (describe(r.object) || {}).head === "canvas") { if (guard("delete", [...scene.components.keys()])) out.steps.push({ op: "remove", ids: [...scene.components.keys()], explain: "clear the canvas" }); break; }
      const o = need("object"); if (o && o.status === "ok" && guard("delete", o.ids)) out.steps.push({ op: "remove", ids: o.ids, explain: `delete ${o.ids.length} component(s)` }); break;
    }
    case "change": case "resize": {
      const o = need("object"); if (!o || o.status !== "ok" || !guard(ev, o.ids)) break;
      const props = {}; if (s.color) props.color = s.color; if (s.style) props.style = s.style;
      if (s.size) props.size = s.size; if (s.unit === "percent" && s.amount != null) props.scale = s.size === "smaller" ? 1 - s.amount / 100 : 1 + s.amount / 100;
      if (!Object.keys(props).length && ev === "resize") props.scale = { enlarge: 1.25, grow: 1.25, shrink: 0.8 }[frame.lemma] || 1.25;
      out.steps.push({ op: "set", ids: o.ids, props, explain: `set ${JSON.stringify(props)} on ${o.ids.length} component(s)` }); break;
    }
    case "connect": {
      const src = need("source"); if (!src || src.status === "none") break;
      const edge = describe(r.object); const kindE = edge ? singular(edge.head) : "arrow"; const style = edge && edge.attr ? edge.attr.value : null;
      if (s.pairing) {                                                // each to the next / in a chain, over the set ordered by creation (8.1)
        const ids = [...src.ids].sort((a, b) => scene.components.get(a).order - scene.components.get(b).order);
        for (let i = 0; i + 1 < ids.length; i++) out.steps.push({ op: "connect", source: ids[i], target: ids[i + 1], kind: kindE, style, explain: `connect ${ids[i]} to ${ids[i + 1]}` });
        if (ids.length < 2) out.questions.push({ kind: "missing", role: "source", text: "I need at least two components to connect in a chain" });
        break;
      }
      const tgt = need("target"); if (!tgt || tgt.status !== "ok" || src.status !== "ok") break;
      if (!guard("connect", [...src.ids, ...tgt.ids])) break;
      for (const a of src.ids) for (const b of tgt.ids) out.steps.push({ op: "connect", source: a, target: b, kind: kindE, style, explain: `connect ${a} to ${b} with a ${style ? style + " " : ""}${kindE}` });
      break;
    }
    case "name": { const o = need("object"); if (o && o.status === "ok" && guard("name", o.ids)) out.steps.push({ op: "set", ids: o.ids, props: { label: s.text }, explain: `label "${s.text}"` }); break; }
    case "copy": {
      const o = need("object"); if (!o || o.status !== "ok" || !guard("copy", o.ids)) break;
      const lmBox = landmarkBox();
      for (const id of o.ids) out.steps.push({ op: "copy", id, slots: (s.region || s.relation) ? s : { relation: "right_of" }, landmark: (s.region || s.relation) ? lmBox : scene.components.get(id).box, explain: `copy ${id}` });
      break;
    }
    case "group": {
      const o = need("object"); if (!o || o.status !== "ok" || !guard("group", o.ids)) break;
      if (o.ids.length < 2) { out.questions.push({ kind: "missing", role: "object", text: "a group needs at least two components" }); break; }
      out.steps.push({ op: "group", ids: o.ids, label: s.text, explain: `group ${o.ids.length} components${s.text ? ` as "${s.text}"` : ""}` }); break;
    }
    case "ungroup": { const o = need("object"); if (o && o.status === "ok") out.steps.push({ op: "ungroup", ids: o.ids, explain: "ungroup" }); break; }
    case "arrange": case "align": case "distribute": {
      const o = r.object ? need("object") : { ids: [...scene.components.keys()], status: "ok" }; if (!o || o.status !== "ok" || !guard("move", o.ids)) break;
      out.steps.push({ op: ev, ids: o.ids, layout: s.layout, axis: s.axis, direction: s.direction, gap: s.amount, explain: `${ev} ${o.ids.length} components${s.layout ? " as " + s.layout : ""}${s.axis ? " " + s.axis : ""}${s.direction ? " " + s.direction : ""}` });
      break;
    }
    case "front": case "back": { const o = need("object"); if (o && o.status === "ok") out.steps.push({ op: "order", ids: o.ids, where: ev, explain: `bring to ${ev}` }); break; }
    case "zoom": out.steps.push({ op: "zoom", direction: s.direction, explain: `zoom ${s.direction === "zoom_out" ? "out" : "in"}` }); break;
    case "undo": out.steps.push({ op: "undo", explain: "undo" }); break;
    case "redo": out.steps.push({ op: "redo", explain: "redo" }); break;
    default: out.questions.push({ kind: "unknown-event", text: `I can't do "${ev}" yet` });
  }
  return out;
}

function planMove(scene, frame, info, o, out, s, landmarkBox, guard) {
  if (!guard("move", o.ids)) return out;
  const lmBox = landmarkBox(); if (frame.roles.landmark && !lmBox) return out;
  for (const id of o.ids) out.steps.push({ op: "move", id, slots: s, landmark: lmBox, explain: `move ${id}${s.region ? " to the " + s.region : s.relation ? " " + s.relation : s.direction ? " " + s.direction : s.anchor ? " towards the " + s.anchor : ""}` });
  return out;
}

// ------------------------------------------------------------------ execution
export function execute(scene, p) {
  if (p.steps.length === 1 && (p.steps[0].op === "undo" || p.steps[0].op === "redo")) return p.steps[0].op === "undo" ? undo(scene) : redo(scene);
  if (!p.steps.length || p.questions.length || p.blocked.length) return { applied: 0, notes: [] };
  scene.undo.push(snapshot(scene)); scene.redo = []; const touched = []; const notes = []; let prev = null;
  for (const st of p.steps) {
    if (st.op === "lock") { scene.locks.push({ action: st.action, desc: st.desc }); continue; }
    if (st.op === "create") {
      const id = `c${++scene.counter}`; const box = { w: st.w, h: st.h };
      const lm = st.landmark === "previous" ? (prev ? scene.components.get(prev).box : null) : st.landmark;
      const pos = place(scene, box, st.slots || {}, lm); box.x = pos.x; box.y = pos.y; if (pos.note) notes.push(pos.note);
      scene.components.set(id, { id, word: st.word, kind: st.kind, label: st.label || null, color: st.color, style: st.style, size: st.size, box, order: scene.counter, parent: null });
      st.constraints = pos.constraints; touched.push(id); prev = id; continue;
    }
    if (st.op === "move") {
      const c = scene.components.get(st.id); const pos = place(scene, { ...c.box }, st.slots, st.landmark, { moving: st.id });
      c.box = { ...c.box, x: pos.x, y: pos.y }; st.constraints = pos.constraints; if (pos.note) notes.push(pos.note); touched.push(st.id); continue;
    }
    if (st.op === "remove") { for (const id of st.ids) { scene.components.delete(id); for (const [k, e] of scene.connectors) if (e.source === id || e.target === id) scene.connectors.delete(k); } continue; }
    if (st.op === "set") {
      for (const id of st.ids) {
        const c = scene.components.get(id); const { scale, ...rest } = st.props; Object.assign(c, rest);
        if (rest.size && SIZE_BOX[rest.size]) { const [w, h] = SIZE_BOX[rest.size]; c.box = { ...c.box, w, h }; }
        if (rest.size === "bigger" || rest.size === "smaller" || scale) { const k = scale || (rest.size === "bigger" ? 1.25 : 0.8); c.box = { ...c.box, w: Math.round(c.box.w * k), h: Math.round(c.box.h * k) }; delete c.size; }
        touched.push(id);
      }
      continue;
    }
    if (st.op === "connect") { const id = `e${++scene.counter}`; scene.connectors.set(id, { id, source: st.source, target: st.target, kind: st.kind === "line" ? "line" : "arrow", style: st.style || "solid", label: null }); touched.push(st.source, st.target); continue; }
    if (st.op === "copy") {
      const c = scene.components.get(st.id); const id = `c${++scene.counter}`; const box = { w: c.box.w, h: c.box.h };
      const pos = place(scene, box, st.slots, st.landmark); box.x = pos.x; box.y = pos.y;
      scene.components.set(id, { ...c, id, box, order: scene.counter }); touched.push(id); continue;
    }
    if (st.op === "group") {
      const bs = st.ids.map((i) => scene.components.get(i).box); const x = Math.min(...bs.map((b) => b.x)) - 20, y = Math.min(...bs.map((b) => b.y)) - 30;
      const x2 = Math.max(...bs.map((b) => b.x + b.w)) + 20, y2 = Math.max(...bs.map((b) => b.y + b.h)) + 20; const id = `g${++scene.counter}`;
      scene.components.set(id, { id, word: "container", kind: "container", label: st.label || null, color: null, style: "dashed", box: { x, y, w: x2 - x, h: y2 - y }, order: scene.counter, parent: null });
      for (const i of st.ids) scene.components.get(i).parent = id; touched.push(id); continue;
    }
    if (st.op === "ungroup") { for (const g of st.ids) { for (const c of scene.components.values()) if (c.parent === g) c.parent = null; scene.components.delete(g); } continue; }
    if (st.op === "arrange" || st.op === "align" || st.op === "distribute") { layoutSimple(scene, st); touched.push(...st.ids); continue; }
    if (st.op === "order") { for (const id of st.ids) scene.components.get(id).order = st.where === "front" ? ++scene.counter : -(++scene.counter); continue; }
    if (st.op === "zoom") { scene.view.zoom *= st.direction === "zoom_out" ? 0.8 : 1.25; continue; }
  }
  if (touched.length) scene.lastTouched = [...new Set(touched)];
  return { applied: p.steps.length, notes };
}

// row / column / grid / circle, align and distribute; tree and flows by connector levels (ELK.js replaces this at step 8, spec 8.3)
function layoutSimple(scene, st) {
  const cs = st.ids.map((i) => scene.components.get(i)).filter((c) => c.kind !== "container").sort((a, b) => a.order - b.order);
  if (!cs.length) return; const g = st.gap ?? GAP;
  if (st.op === "align") {
    if (st.axis === "horizontally") { const y = cs[0].box.y + cs[0].box.h / 2; cs.forEach((c) => { c.box.y = Math.round(y - c.box.h / 2); }); }
    else if (st.axis === "vertically") { const x = cs[0].box.x + cs[0].box.w / 2; cs.forEach((c) => { c.box.x = Math.round(x - c.box.w / 2); }); }
    else if (st.direction === "left") { const x = Math.min(...cs.map((c) => c.box.x)); cs.forEach((c) => { c.box.x = x; }); }
    else if (st.direction === "right") { const x = Math.max(...cs.map((c) => c.box.x + c.box.w)); cs.forEach((c) => { c.box.x = x - c.box.w; }); }
    else if (st.direction === "up") { const y = Math.min(...cs.map((c) => c.box.y)); cs.forEach((c) => { c.box.y = y; }); }
    else if (st.direction === "down") { const y = Math.max(...cs.map((c) => c.box.y + c.box.h)); cs.forEach((c) => { c.box.y = y - c.box.h; }); }
    return;
  }
  if (st.op === "distribute") {
    const vertical = st.axis === "vertically"; const key = vertical ? "y" : "x", len = vertical ? "h" : "w";
    cs.sort((a, b) => a.box[key] - b.box[key]); let pos = cs[0].box[key];
    if (st.gap == null && cs.length > 2) { const span = cs[cs.length - 1].box[key] + cs[cs.length - 1].box[len] - pos; const tot = cs.reduce((m, c) => m + c.box[len], 0); const eg = (span - tot) / (cs.length - 1); cs.forEach((c) => { c.box[key] = Math.round(pos); pos += c.box[len] + eg; }); }
    else cs.forEach((c) => { c.box[key] = Math.round(pos); pos += c.box[len] + g; });
    return;
  }
  const lay = st.layout || "row"; const x0 = 60, y0 = 60;
  if (lay === "row") { let x = x0; cs.forEach((c) => { c.box.x = x; c.box.y = y0; x += c.box.w + g; }); }
  else if (lay === "column") { let y = y0; cs.forEach((c) => { c.box.x = x0; c.box.y = y; y += c.box.h + g; }); }
  else if (lay === "grid") { const n = Math.ceil(Math.sqrt(cs.length)); cs.forEach((c, i) => { c.box.x = x0 + (i % n) * (200 + g); c.box.y = y0 + Math.floor(i / n) * (110 + g); }); }
  else if (lay === "circle") { const R = 60 * cs.length, cx = scene.width / 2, cy = scene.height / 2; cs.forEach((c, i) => { const t = 2 * Math.PI * i / cs.length; c.box.x = Math.round(cx + R * Math.cos(t) - c.box.w / 2); c.box.y = Math.round(cy + R * Math.sin(t) - c.box.h / 2); }); }
  else {                                                            // tree / flow_lr / flow_td: levels by longest path over the connectors
    const ids = new Set(cs.map((c) => c.id)); const level = new Map(cs.map((c) => [c.id, 0]));
    for (let k = 0; k < cs.length; k++) for (const e of scene.connectors.values()) if (ids.has(e.source) && ids.has(e.target)) level.set(e.target, Math.max(level.get(e.target), level.get(e.source) + 1));
    const byLevel = new Map(); cs.forEach((c) => { const l = level.get(c.id); if (!byLevel.has(l)) byLevel.set(l, []); byLevel.get(l).push(c); });
    const lr = lay === "flow_lr";
    for (const [l, list] of byLevel) list.forEach((c, i) => { if (lr) { c.box.x = x0 + l * (220 + g); c.box.y = y0 + i * (110 + g); } else { c.box.x = x0 + i * (220 + g); c.box.y = y0 + l * (110 + g); } });
  }
}

export function undo(scene) { if (!scene.undo.length) return { applied: 0, notes: ["nothing to undo"] }; scene.redo.push(snapshot(scene)); restore(scene, scene.undo.pop()); return { applied: 1, notes: [] }; }
export function redo(scene) { if (!scene.redo.length) return { applied: 0, notes: ["nothing to redo"] }; scene.undo.push(snapshot(scene)); restore(scene, scene.redo.pop()); return { applied: 1, notes: [] }; }
