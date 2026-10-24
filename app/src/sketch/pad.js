// pad.js: the sketch pad's input model (spec 17.1), DOM-free: pointer events from a mouse, a finger or a pen become strokes of
// timestamped points. The DOM binding is in view.js, which forwards PointerEvents here as plain objects {pointerId, pointerType, x, y,
// t, pressure, button}. Deterministic: the same event sequence gives the same strokes.
//
// Rules (each one stated, none learned):
//  - mouse: only the primary button draws.
//  - pen: always draws; while a pen is in use, touches are ignored (palm rejection) until penGraceMs after the pen was lifted.
//  - touch: one finger draws; a second finger down while a touch stroke is active turns the gesture into navigation: the touch strokes in
//    progress are discarded and nothing is drawn until every finger is lifted (the view may pan or zoom; that is not decided here).
//  - points closer than minDist to the previous point are dropped; a stroke with a single point is kept as a dot (two equal points).
//  - a cancelled pointer (pointercancel) discards its stroke.
// Strokes are {id, pointerType, points: [{x, y, t, p}]}; ids increase from 0 and are never reused, so a stroke can be named in logs.

export function createPad({ minDist = 1, penGraceMs = 800 } = {}) {
  const strokes = []; const active = new Map(); const listeners = new Set();
  let nextId = 0, lastPenUp = -Infinity, penDown = 0, touches = new Set(), navigating = false;
  const emit = (type, data) => { for (const f of listeners) f(type, data); };

  function down(e) {
    if (e.pointerType === "mouse" && (e.button ?? 0) !== 0) return false;
    if (e.pointerType === "touch") {
      touches.add(e.pointerId);
      if (penDown > 0 || e.t - lastPenUp < penGraceMs) return false;                        // palm rejection
      if (touches.size >= 2) {                                                               // two fingers: navigation, not ink
        navigating = true;
        for (const [pid, s] of active) if (s.pointerType === "touch") { active.delete(pid); emit("discard", s); }
        emit("navigate", { pointers: touches.size });
        return false;
      }
      if (navigating) return false;
    }
    if (e.pointerType === "pen") {
      penDown++;
      for (const [pid, s] of active) if (s.pointerType === "touch") { active.delete(pid); emit("discard", s); }   // the palm touched first
    }
    const s = { id: nextId++, pointerType: e.pointerType || "mouse", points: [{ x: e.x, y: e.y, t: e.t, p: e.pressure ?? 0.5 }] };
    active.set(e.pointerId, s); emit("start", s);
    return true;
  }

  function move(e) {
    const s = active.get(e.pointerId); if (!s) return false;
    const list = e.coalesced && e.coalesced.length ? e.coalesced : [e];
    let added = 0;
    for (const q of list) {
      const last = s.points[s.points.length - 1];
      if (Math.hypot(q.x - last.x, q.y - last.y) < minDist || q.t < last.t) continue;
      s.points.push({ x: q.x, y: q.y, t: q.t, p: q.pressure ?? 0.5 }); added++;
    }
    if (added) emit("move", s);
    return added > 0;
  }

  function up(e) {
    if (e.pointerType === "touch") { touches.delete(e.pointerId); if (!touches.size) navigating = false; }
    if (e.pointerType === "pen") { penDown = Math.max(0, penDown - 1); lastPenUp = e.t; }
    const s = active.get(e.pointerId); if (!s) return null;
    active.delete(e.pointerId);
    const last = s.points[s.points.length - 1];
    if (e.x != null && (e.x !== last.x || e.y !== last.y) && e.t >= last.t) s.points.push({ x: e.x, y: e.y, t: e.t, p: e.pressure ?? 0.5 });
    if (s.points.length === 1) s.points.push({ ...s.points[0], t: s.points[0].t + 1 });   // a dot
    strokes.push(s); emit("stroke", s);
    return s;
  }

  function cancel(e) {
    if (e.pointerType === "touch") { touches.delete(e.pointerId); if (!touches.size) navigating = false; }
    if (e.pointerType === "pen") { penDown = Math.max(0, penDown - 1); lastPenUp = e.t; }
    const s = active.get(e.pointerId); if (s) { active.delete(e.pointerId); emit("discard", s); }
  }

  return {
    down, move, up, cancel,
    strokes: () => strokes.slice(),
    active: () => [...active.values()],
    undo() { const s = strokes.pop(); if (s) emit("undo", s); return s || null; },
    remove(ids) { const set = new Set(ids); for (let i = strokes.length - 1; i >= 0; i--) if (set.has(strokes[i].id)) strokes.splice(i, 1); emit("remove", ids); },
    clear() { strokes.length = 0; active.clear(); emit("clear", null); },
    on(f) { listeners.add(f); return () => listeners.delete(f); },
    /** the strokes in the format of the synthetic set (first point absolute, then differences, integers), for recording a hand-drawn set */
    export() {
      return strokes.map((s) => {
        const p = []; let px = 0, py = 0, pt = 0;
        s.points.forEach((q, i) => { const x = Math.round(q.x), y = Math.round(q.y), t = Math.round(q.t); p.push(i ? x - px : x, i ? y - py : y, i ? t - pt : t); px = x; py = y; pt = t; });
        return { p, pointerType: s.pointerType };
      });
    },
  };
}
