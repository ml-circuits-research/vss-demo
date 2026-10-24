// view.js: the DOM of the sketch pad. Takes a container element and the shared context; binds PointerEvents (mouse, touch, pen) to the
// pad model of pad.js and draws the ink and, after recognition, the recognised boxes. No decisions here: recognition and the scene pass
// are called through the context (ctx.onCleanUp receives the strokes; the caller runs recognise -> scenePass -> applyToScene).
//   const view = mountSketchPad(container, { onCleanUp(strokes) {...}, onChange(pad) {...} });
//   view.showRecognition(rec)   draws each group's box and kind; view.clear(); view.destroy()
import { createPad } from "./pad.js";

export function mountSketchPad(container, ctx = {}) {
  const pad = createPad(ctx.padOptions || {});
  const root = document.createElement("div"); root.className = "sketch-pad";
  root.style.cssText = "position:relative;width:100%;height:100%;min-height:240px;";
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:crosshair;";
  canvas.setAttribute("aria-label", "Sketch pad: draw boxes, circles, diamonds and arrows, then press Clean up");
  const bar = document.createElement("div"); bar.className = "sketch-bar";
  bar.style.cssText = "position:absolute;left:8px;top:8px;display:flex;gap:6px;flex-wrap:wrap;";
  const button = (label, fn) => { const b = document.createElement("button"); b.type = "button"; b.textContent = label; b.addEventListener("click", fn); bar.appendChild(b); return b; };
  button("Clean up", () => ctx.onCleanUp && ctx.onCleanUp(pad.strokes(), pad));
  button("Undo stroke", () => { pad.undo(); });
  button("Clear", () => { pad.clear(); overlay = null; });
  root.append(canvas, bar); container.appendChild(root);

  const g = canvas.getContext("2d"); let overlay = null; let raf = 0;
  const css = (name, fb) => getComputedStyle(root).getPropertyValue(name).trim() || fb;
  function resize() {
    const r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(r.width * dpr)); canvas.height = Math.max(1, Math.round(r.height * dpr));
    g.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
  }
  function path(points) { g.beginPath(); points.forEach((q, i) => (i ? g.lineTo(q.x, q.y) : g.moveTo(q.x, q.y))); g.stroke(); }
  function draw() {
    raf = 0; const r = canvas.getBoundingClientRect(); g.clearRect(0, 0, r.width, r.height);
    g.lineCap = "round"; g.lineJoin = "round"; g.lineWidth = 2.2; g.strokeStyle = css("--ink", "#1d2733");
    for (const s of pad.strokes()) path(s.points);
    g.strokeStyle = css("--ink-live", "#2f6fdf"); for (const s of pad.active()) path(s.points);
    if (overlay) {
      g.lineWidth = 1; g.setLineDash([4, 3]); g.strokeStyle = css("--accent", "#c2410c"); g.fillStyle = g.strokeStyle; g.font = "12px system-ui, sans-serif";
      for (const grp of overlay.groups) { const b = grp.box; g.strokeRect(b.x - 3, b.y - 3, b.w + 6, b.h + 6); g.fillText(`${grp.kind} ${(grp.candidates?.[0]?.score ?? 1).toFixed(2)}`, b.x, b.y - 6); }
      g.setLineDash([]);
    }
  }
  const schedule = () => { if (!raf) raf = requestAnimationFrame(draw); };
  const toPad = (e) => {
    const r = canvas.getBoundingClientRect();
    const ev = { pointerId: e.pointerId, pointerType: e.pointerType, x: e.clientX - r.left, y: e.clientY - r.top, t: e.timeStamp, pressure: e.pressure, button: e.button };
    if (e.getCoalescedEvents) ev.coalesced = e.getCoalescedEvents().map((c) => ({ x: c.clientX - r.left, y: c.clientY - r.top, t: c.timeStamp, pressure: c.pressure }));
    return ev;
  };
  const onDown = (e) => { if (pad.down(toPad(e))) { canvas.setPointerCapture?.(e.pointerId); e.preventDefault(); schedule(); } };
  const onMove = (e) => { if (pad.move(toPad(e))) schedule(); };
  const onUp = (e) => { pad.up(toPad(e)); schedule(); };
  const onCancel = (e) => { pad.cancel(toPad(e)); schedule(); };
  canvas.addEventListener("pointerdown", onDown); canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp); canvas.addEventListener("pointercancel", onCancel);
  const off = pad.on((type) => { if (type !== "move") ctx.onChange && ctx.onChange(pad, type); schedule(); });
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null; ro ? ro.observe(canvas) : window.addEventListener("resize", resize);
  resize();

  return {
    pad, element: root,
    showRecognition(rec) { overlay = rec; schedule(); },
    clear() { pad.clear(); overlay = null; schedule(); },
    destroy() { off(); ro ? ro.disconnect() : window.removeEventListener("resize", resize); root.remove(); },
  };
}
