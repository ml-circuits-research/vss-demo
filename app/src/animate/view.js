// view.js: the film on screen (spec 19.2-19.4), the only DOM code of src/animate/. It takes a container element and the shared context
// ({timeline, sop?}) and makes no decisions: the stage draws svg.js frames of player.js states with requestAnimationFrame; the controls
// play, pause, scrub, loop and restart; the timeline panel shows one bar per unit with the constraints that placed it (the explanation of
// the film, as the geometry panel explains a placement); the rule report of invariants.js is shown BEFORE playing, each violation with a
// button to its frame; the export buttons say why a form is unavailable instead of failing.
import { createPlayer, stateAt } from "./player.js";
import { rows, solve } from "./timeline.js";
import { check } from "./invariants.js";
import { frameSVG } from "./svg.js";
import { exportJSON, exportSVG, exportWebM, exportFrames, capabilities } from "./export.js";

const CSS = `.vss-anim{font:14px system-ui,sans-serif;color:#1f2a3a;display:flex;flex-direction:column;gap:8px;max-width:100%}
.vss-anim .stage{width:100%;border:1px solid #d5dce4;border-radius:8px;overflow:hidden;background:#fff}.vss-anim .stage svg{width:100%;height:auto;display:block}
.vss-anim .controls{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.vss-anim button{font:inherit;padding:6px 10px;border:1px solid #9fb0c2;border-radius:6px;background:#f4f7fb;cursor:pointer;min-height:36px}
.vss-anim button:disabled{opacity:.5;cursor:not-allowed}.vss-anim input[type=range]{flex:1 1 160px;min-width:120px}.vss-anim .time{font-variant-numeric:tabular-nums;min-width:8ch}
.vss-anim .rules{padding:6px 8px;border-radius:6px}.vss-anim .rules.ok{background:#eaf7ee}.vss-anim .rules.bad{background:#fdecea}
.vss-anim .bars{position:relative;border-top:1px solid #e3e8ee}.vss-anim .row{display:flex;align-items:center;gap:6px;min-height:26px}
.vss-anim .row .id{width:3.5em;flex:none;color:#5c6b7a}.vss-anim .row .track{position:relative;flex:1;height:16px;background:#f2f5f8;border-radius:4px}
.vss-anim .row .bar{position:absolute;top:0;height:16px;background:#7fa7d9;border-radius:4px;min-width:3px;cursor:pointer}
.vss-anim .row details{flex:0 1 45%;font-size:12px;color:#44515e}.vss-anim .playhead{position:absolute;top:0;bottom:0;width:2px;background:#e0533d;pointer-events:none}
@media (max-width:640px){.vss-anim .row details{flex-basis:100%}.vss-anim .row{flex-wrap:wrap}}`;

const el = (doc, tag, attrs = {}, text = null) => { const e = doc.createElement(tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (text != null) e.textContent = text; return e; };
const fmt = (ms) => `${(ms / 1000).toFixed(2)} s`;

export function mountAnimation(container, ctx) {
  const doc = container.ownerDocument; const win = doc.defaultView; const tl = ctx.timeline; if (!tl.solved) solve(tl);
  container.innerHTML = ""; const root = el(doc, "div", { class: "vss-anim" }); const style = el(doc, "style"); style.textContent = CSS; root.appendChild(style);
  const stage = el(doc, "div", { class: "stage", role: "img", "aria-label": "the animation" }); const controls = el(doc, "div", { class: "controls" });
  const playBtn = el(doc, "button", { type: "button" }, "Play"), startBtn = el(doc, "button", { type: "button" }, "From the start");
  const loopLbl = el(doc, "label"); const loop = el(doc, "input", { type: "checkbox" }); loopLbl.append(loop, " loop"); loop.checked = !!tl.film.loop;
  const scrub = el(doc, "input", { type: "range", min: "0", max: String(tl.end), step: "10", value: "0", "aria-label": "time" }); const time = el(doc, "span", { class: "time" }, fmt(0));
  controls.append(playBtn, startBtn, loopLbl, scrub, time);
  const rules = el(doc, "div", { class: "rules" }); const bars = el(doc, "div", { class: "bars" }); const exp = el(doc, "div", { class: "controls" });
  root.append(stage, controls, rules, bars, exp); container.appendChild(root);

  const draw = (st) => { stage.innerHTML = frameSVG(tl, st); scrub.value = String(Math.round(st.t)); time.textContent = fmt(st.t); playBtn.textContent = player.playing ? "Pause" : "Play"; head.style.left = `calc(${tl.end ? (st.t / tl.end) * 100 : 0}% )`; };
  const head = el(doc, "div", { class: "playhead" });
  const player = createPlayer(tl, { now: () => win.performance.now(), schedule: (f) => win.requestAnimationFrame(f), cancel: (h) => win.cancelAnimationFrame(h), onFrame: (st) => draw(st) });
  playBtn.onclick = () => (player.playing ? player.pause() : player.play());
  startBtn.onclick = () => player.play(0); loop.onchange = () => player.setLoop(loop.checked); scrub.oninput = () => player.seek(Number(scrub.value));

  function renderPanel() {
    bars.innerHTML = ""; const track0 = el(doc, "div", { class: "row" }); track0.append(el(doc, "span", { class: "id" }, "")); const tt = el(doc, "div", { class: "track", style: "background:none" }); tt.appendChild(head); track0.appendChild(tt); bars.appendChild(track0);
    for (const r of rows(tl)) {
      const row = el(doc, "div", { class: "row" }); const track = el(doc, "div", { class: "track" });
      const bar = el(doc, "div", { class: "bar", title: r.reasons.join("\n"), style: `left:${tl.end ? (r.start / tl.end) * 100 : 0}%;width:${tl.end ? ((r.end - r.start) / tl.end) * 100 : 0}%` });
      bar.onclick = () => player.seek(r.start); track.appendChild(bar);
      const det = el(doc, "details"); det.append(el(doc, "summary", {}, `${r.event} ${fmt(r.start)} to ${fmt(r.end)}`)); for (const x of r.reasons) det.append(el(doc, "div", {}, x));
      row.append(el(doc, "span", { class: "id" }, r.id), track, det); bars.appendChild(row);
    }
    const rep = check(tl); rules.className = `rules ${rep.ok ? "ok" : "bad"}`; rules.textContent = rep.text + (tl.conflicts.length ? `; timeline: ${tl.conflicts.join("; ")}` : "");
    for (const v of rep.violations) { const b = el(doc, "button", { type: "button" }, `show frame ${v.frame}`); b.title = v.text; b.onclick = () => player.seek(v.t); rules.append(" ", b); }
  }
  function renderExports() {
    exp.innerHTML = ""; const cap = capabilities(win);
    const save = (blob, name) => { const a = el(doc, "a", { href: win.URL.createObjectURL(blob), download: name }); doc.body.appendChild(a); a.click(); a.remove(); win.setTimeout(() => win.URL.revokeObjectURL(a.href), 4000); };
    const add = (label, ok, reason, fn) => { const b = el(doc, "button", { type: "button" }, label); if (!ok) { b.disabled = true; b.title = reason; } b.onclick = async () => { b.disabled = true; try { await fn(); } catch (e) { b.title = e.message; rules.textContent = e.message; } finally { b.disabled = !ok; } }; exp.appendChild(b); if (!ok) exp.appendChild(el(doc, "small", {}, reason)); };
    add("Export JSON timeline", true, "", () => save(new win.Blob([JSON.stringify(exportJSON(tl, { sop: ctx.sop || null }), null, 1)], { type: "application/json" }), "animation.json"));
    add("Export animated SVG", true, "", () => save(new win.Blob([exportSVG(tl)], { type: "image/svg+xml" }), "animation.svg"));
    add("Export PNG frames", cap.png.ok, cap.png.reason, async () => { const fr = await exportFrames(tl, { env: win, fps: 10 }); fr.forEach((f) => save(f.blob, `frame_${String(f.frame).padStart(4, "0")}.png`)); });
    add("Export WebM", cap.webm.ok, cap.webm.reason, async () => save(await exportWebM(tl, { env: win, fps: 30 }), "animation.webm"));
  }
  renderPanel(); renderExports(); draw(stateAt(tl, 0));
  return { player, refresh() { solve(tl); scrub.max = String(tl.end); renderPanel(); draw(player.state()); }, destroy() { player.pause(); container.innerHTML = ""; } };
}
