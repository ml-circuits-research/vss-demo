// planner.js: from the reader's frame to a plan (spec 8.1, 10.2, 10.4). Each event has an action schema: its roles, its preconditions
// and the operations it expands into. A failed precondition is a question, never a guess. A prohibition (the frame's negation around
// the event) is not executed: it becomes a lock, checked before every later step. The whole plan is one undo entry.
// plan(scene, frame, info) -> {steps: [{op, explain, ...}], questions: [...], blocked: [...], resolutions: [...]}
// execute(scene, plan) applies the steps through ops.js (the operations of Table 7); undo(scene) / redo(scene) restore.
// Layouts are in layout.js, routes in router.js.
import { KIND_OF, singular } from "./scene.js";
import * as ops from "./ops.js";
import { describe, resolve, phrase, labelKey } from "./resolver.js";
import { place } from "./geometry.js";

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

const lockedBy = ops.lockedBy;

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
        const [w, h] = ops.defaultBox(kind, sing, size);
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

// ------------------------------------------------------------------ execution (every change goes through ops.js, spec Table 7)
export function execute(scene, p) {
  if (p.steps.length === 1 && (p.steps[0].op === "undo" || p.steps[0].op === "redo")) return p.steps[0].op === "undo" ? undo(scene) : redo(scene);
  if (!p.steps.length || p.questions.length || p.blocked.length) return { applied: 0, notes: [] };
  ops.checkpoint(scene); const touched = []; const notes = []; let prev = null; let geometry = false;
  for (const st of p.steps) {
    if (st.op === "lock") { ops.lock(scene, st.action, st.desc); continue; }
    if (st.op === "create") {
      const box = { w: st.w, h: st.h };
      const lm = st.landmark === "previous" ? (prev ? scene.components.get(prev).box : null) : st.landmark;
      const pos = place(scene, box, st.slots || {}, lm); box.x = pos.x; box.y = pos.y; if (pos.note) notes.push(pos.note);
      const id = ops.create(scene, { word: st.word, kind: st.kind, label: st.label || null, color: st.color, style: st.style, size: st.size }, box);
      st.constraints = pos.constraints; touched.push(id); prev = id; geometry = true; continue;
    }
    if (st.op === "move") {
      const c = scene.components.get(st.id); const pos = place(scene, { ...c.box }, st.slots, st.landmark, { moving: st.id });
      ops.move(scene, st.id, pos); st.constraints = pos.constraints; if (pos.note) notes.push(pos.note); touched.push(st.id); geometry = true; continue;
    }
    if (st.op === "remove") { ops.remove(scene, st.ids); geometry = true; continue; }
    if (st.op === "set") { ops.set(scene, st.ids, st.props); touched.push(...st.ids); geometry = true; continue; }
    if (st.op === "connect") { ops.connect(scene, st.source, st.target, { kind: st.kind, style: st.style, label: st.label }); touched.push(st.source, st.target); geometry = true; continue; }
    if (st.op === "copy") {
      const c = scene.components.get(st.id); const box = { w: c.box.w, h: c.box.h };
      const pos = place(scene, box, st.slots, st.landmark); box.x = pos.x; box.y = pos.y;
      const { id: _old, box: _b, order: _o, ...props } = c; const id = ops.create(scene, props, box); touched.push(id); geometry = true; continue;
    }
    if (st.op === "group") { const id = ops.group(scene, st.ids, st.label); touched.push(id); geometry = true; continue; }
    if (st.op === "ungroup") { ops.ungroup(scene, st.ids); geometry = true; continue; }
    if (st.op === "arrange") { const r = ops.layout(scene, st.ids, st.layout || "row", st.gap != null ? { gap: st.gap } : {}); notes.push(...r.notes); touched.push(...st.ids); geometry = true; continue; }
    if (st.op === "align") { ops.align(scene, st.ids, { axis: st.axis, direction: st.direction }); touched.push(...st.ids); geometry = true; continue; }
    if (st.op === "distribute") { ops.distribute(scene, st.ids, { axis: st.axis, gap: st.gap }); touched.push(...st.ids); geometry = true; continue; }
    if (st.op === "order") { ops.order(scene, st.ids, st.where); continue; }
    if (st.op === "zoom") { ops.zoom(scene, st.direction === "zoom_out" ? 0.8 : 1.25); continue; }
  }
  if (geometry && scene.connectors.size) ops.route(scene);
  if (touched.length) scene.lastTouched = [...new Set(touched)];
  return { applied: p.steps.length, notes };
}

export const undo = ops.undo;
export const redo = ops.redo;
