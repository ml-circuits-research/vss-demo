// film.js (ui): the timeline strip under the canvas (play, pause, scrub) and the film drawn over the canvas while it plays (spec 19.3),
// plus the Timeline tab of the panel (src/animate/view.js: one bar per unit with its constraints, the rule report, the exports). DOM only:
// the timeline, the player and the frames come from src/animate/.
//   const film = createFilm({ strip, film, play, scrub, time, close, details, panel, onDetails, onState });
//   film.set(timeline, {sop}) (null hides everything); film.command(c) (a film command of the animation reader); film.timeline
import { createPlayer, stateAt } from "../animate/player.js";
import { frameSVG } from "../animate/svg.js";
import { solve } from "../animate/timeline.js";
import { mountAnimation } from "../animate/view.js";

const PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>', PAUSE = '<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>';
const fmt = (ms) => `${(ms / 1000).toFixed(2)} s`;

function bounds(tl) {
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const c of tl.scene.components.values()) { const b = c.box; x1 = Math.min(x1, b.x); y1 = Math.min(y1, b.y); x2 = Math.max(x2, b.x + b.w); y2 = Math.max(y2, b.y + b.h); }
  for (const u of tl.units) for (const p of [u.from, u.to]) if (p) { x1 = Math.min(x1, p.x); y1 = Math.min(y1, p.y); x2 = Math.max(x2, p.x + p.w); y2 = Math.max(y2, p.y + p.h); }
  if (!Number.isFinite(x1)) return { x: 0, y: 0, w: tl.scene.width, h: tl.scene.height };
  const pad = 40; return { x: x1 - pad, y: y1 - pad, w: x2 - x1 + 2 * pad, h: y2 - y1 + 2 * pad };
}

export function createFilm(el) {
  let tl = null, player = null, box = null, sop = null, panelView = null, showing = false;
  function draw(st) {
    if (showing) {
      el.film.innerHTML = frameSVG(tl, st, { caption: false });
      const svg = el.film.firstElementChild;
      if (svg) { svg.setAttribute("viewBox", `${box.x} ${box.y} ${box.w} ${box.h}`); svg.removeAttribute("width"); svg.removeAttribute("height"); svg.style.cssText = "width:100%;height:100%"; svg.setAttribute("preserveAspectRatio", "xMidYMid meet"); }
    }
    el.scrub.value = String(Math.round(st.t)); el.time.textContent = `${fmt(st.t)} / ${fmt(tl.end)}`;
    el.play.innerHTML = player && player.playing ? PAUSE : PLAY; el.play.setAttribute("aria-label", player && player.playing ? "Pause" : "Play the animation");
  }
  function show(on) { showing = on; el.film.hidden = !on; if (on && player) draw(player.state()); if (el.onState) el.onState(on); }
  el.play.onclick = () => { if (!player) return; if (!showing) show(true); if (player.playing) player.pause(); else player.play(); };
  el.scrub.oninput = () => { if (!player) return; if (!showing) show(true); player.seek(Number(el.scrub.value)); };
  el.close.onclick = () => { if (player) player.pause(); show(false); };
  el.details.onclick = () => el.onDetails && el.onDetails();

  function set(timeline, opts = {}) {
    if (player) player.pause(); if (panelView) { panelView.destroy(); panelView = null; }
    tl = timeline && timeline.units.length ? timeline : null; sop = opts.sop || null;
    el.strip.hidden = !tl;
    if (!tl) { show(false); player = null; renderPanel(); return; }
    if (!tl.solved) solve(tl); box = bounds(tl);
    player = createPlayer(tl, { now: () => performance.now(), schedule: (f) => requestAnimationFrame(f), cancel: (h) => cancelAnimationFrame(h), onFrame: (st) => draw(st) });
    el.scrub.max = String(tl.end); draw(stateAt(tl, 0)); renderPanel();
  }
  function renderPanel() {
    const host = el.panel; host.replaceChildren();
    if (!tl) {
      const p = document.createElement("p"); p.className = "muted";
      p.textContent = "No animation yet. With the animation world installed, say what moves and when (“the request goes from the user to the gateway, two seconds per hop”). Without it, open a timeline file in Export.";
      host.append(p); return;
    }
    const wrap = document.createElement("div"); host.append(wrap); panelView = mountAnimation(wrap, { timeline: tl, sop });
  }
  return {
    set, show, get timeline() { return tl; }, get player() { return player; }, get showing() { return showing; },
    command(c) { if (!player) return { error: "there is no animation to play" }; show(true); return player.command(c); },
    refresh() { if (tl) { solve(tl); box = bounds(tl); el.scrub.max = String(tl.end); if (panelView) panelView.refresh(); draw(player.state()); } },
  };
}
