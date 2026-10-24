// export.js: the film out of the editor (spec 19.3). Four forms, each with feature detection; nothing fails silently (an unavailable form
// returns or throws its reason as text, and capabilities() lists what this browser can do before the user asks):
//   JSON timeline   the units with their start, end, constraints and reasons, the locks, the film settings, the scene and (if given) the SOP
//                   of the script: together a structured script of the film (who, what, where, when), the guidance a video generator can take
//   animated SVG    SMIL animation sampled from the player's states (opacity, position, scale, rotation, highlights, travellers, connectors);
//                   plays in any browser as a file or an <img>; characters keep their pose of the first frame (their parts are not animated)
//   PNG frames      every frame drawn on a canvas (OffscreenCanvas or <canvas>), as Blobs
//   WebM            the frames drawn in real time on a canvas recorded by MediaRecorder (canvas.captureStream), when the browser has both
import { solve, rows, sceneToData } from "./timeline.js";
import { stateAt, frameTimes } from "./player.js";
import { frameSVG, shapeSVG, connectorPoints, travellerSVG, DEFS } from "./svg.js";

const n = (v) => +(+v).toFixed(2);

export function exportJSON(tl, { sop = null } = {}) {
  if (!tl.solved) solve(tl);
  return { format: "vss-animation-timeline", version: 1, duration_ms: tl.end, film: { ...tl.film }, scene: sceneToData(tl.scene),
    travellers: [...tl.travellers.values()],
    units: rows(tl).map((r) => { const u = tl.units.find((v) => v.id === r.id); return { ...r, text: u.frame?.text || null, frame: u.frame, easing: u.easing, repeat: u.forever ? "forever" : u.repeat, nodes: u.nodes || null, from: u.from || null, to: u.to || null }; }),
    locks: tl.locks.map((L) => ({ ...L })), conflicts: [...tl.conflicts], sop };
}

// the animated SVG: every element's properties sampled at `fps` and written as SMIL values (linear between samples; discrete for flags)
export function exportSVG(tl, { fps = 20 } = {}) {
  if (!tl.solved) solve(tl);
  const sc = tl.scene; const W = sc.width, H = sc.height; const frames = frameTimes(tl, fps); const states = frames.map(([, t]) => stateAt(tl, t));
  const N = frames.length; const tLast = frames[N - 1][1] || 1; const dur = tLast / 1000;     // the last frame is at or just after the end
  const keyTimes = frames.map(([, t], i) => (i === N - 1 ? "1" : (t / tLast).toFixed(6))).join(";");
  const rep = tl.film.loop ? `repeatCount="indefinite"` : tl.film.repeat > 1 ? `repeatCount="${tl.film.repeat}" fill="freeze"` : `repeatCount="1" fill="freeze"`;
  const anim = (attr, vals, discrete = false) => N > 1 ? `<animate attributeName="${attr}" values="${vals.join(";")}" keyTimes="${keyTimes}" dur="${dur}s" ${rep}${discrete ? ' calcMode="discrete"' : ""}/>` : "";
  const animT = (type, vals) => N > 1 ? `<animateTransform attributeName="transform" type="${type}" values="${vals.join(";")}" keyTimes="${keyTimes}" dur="${dur}s" ${rep}/>` : "";
  const out = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`, `<title>VSS animation, ${dur} s</title>`, DEFS, `<rect width="${W}" height="${H}" fill="#ffffff"/>`];
  for (const k of sc.connectors.values()) {
    const pts = states.map((s) => connectorPoints(s, s.connectors.get(k.id))); const op = states.map((s) => n(s.connectors.get(k.id).opacity));
    const [p0, q0] = pts[0];
    out.push(`<line x1="${n(p0[0])}" y1="${n(p0[1])}" x2="${n(q0[0])}" y2="${n(q0[1])}" stroke="#34495e" stroke-width="2" opacity="${op[0]}"${k.kind === "line" ? "" : ' marker-end="url(#vss-arrow)"'}>`
      + anim("x1", pts.map((p) => n(p[0][0]))) + anim("y1", pts.map((p) => n(p[0][1]))) + anim("x2", pts.map((p) => n(p[1][0]))) + anim("y2", pts.map((p) => n(p[1][1]))) + anim("opacity", op) + "</line>");
  }
  const comps = [...sc.components.values()].sort((a, b) => (a.order || 0) - (b.order || 0));
  for (const c of comps) {
    const S = states.map((s) => s.components.get(c.id)); const b0 = S[0].base; const bx = b0.x + b0.w / 2, by = b0.y + b0.h / 2;
    const centre = S.map((s) => `${n(s.box.x + s.box.w / 2)} ${n(s.box.y + s.box.h / 2)}`); const scale = S.map((s) => n(s.box.w / s.base.w)); const rot = S.map((s) => n(s.rotation));
    const halo = S.some((s) => s.highlight) ? `<rect x="${n(b0.x - 6)}" y="${n(b0.y - 6)}" width="${n(b0.w + 12)}" height="${n(b0.h + 12)}" rx="12" fill="none" stroke="#f5b301" stroke-width="5" opacity="${S[0].highlight ? 0.9 : 0}">${anim("opacity", S.map((s) => (s.highlight ? 0.9 : 0)), true)}</rect>` : "";
    out.push(`<g opacity="${n(S[0].opacity)}">${anim("opacity", S.map((s) => n(s.opacity)))}<g transform="translate(${centre[0]})">${animT("translate", centre)}<g transform="scale(${scale[0]})">${animT("scale", scale)}<g transform="rotate(${rot[0]})">${animT("rotate", rot)}<g transform="translate(${n(-bx)} ${n(-by)})">${halo}${shapeSVG(S[0], b0)}</g></g></g></g></g>`);
  }
  for (const id of tl.travellers.keys()) {
    const P = states.map((s) => s.travellers.get(id)); const first = P.find(Boolean); if (!first) continue;
    const xs = P.map((p) => n(p ? p.x - first.x : 0)), ys = P.map((p) => n(p ? p.y - first.y : 0)); const vis = P.map((p) => (p ? 1 : 0));
    out.push(`<g opacity="${vis[0]}">${anim("opacity", vis, true)}<g>${animT("translate", xs.map((x, i) => `${x} ${ys[i]}`))}${travellerSVG(first)}</g></g>`);
  }
  out.push("</svg>"); return out.join("");
}

// what this browser can export, with the reason when it cannot (env = globalThis in the browser; the tests pass a stub)
export function capabilities(env = globalThis) {
  const canvas = canvasFactory(env);
  const MR = env.MediaRecorder; const types = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
  let webm;
  if (!canvas) webm = { ok: false, reason: "no canvas in this environment (needed to draw the frames)" };
  else if (typeof MR !== "function") webm = { ok: false, reason: "MediaRecorder is not available in this browser: export the animated SVG or the PNG frames instead" };
  else if (!canvas.captures) webm = { ok: false, reason: "this browser's canvas has no captureStream(): export the animated SVG or the PNG frames instead" };
  else { const mime = types.find((t) => (typeof MR.isTypeSupported !== "function" ? t === "video/webm" : MR.isTypeSupported(t))); webm = mime ? { ok: true, mimeType: mime } : { ok: false, reason: "MediaRecorder cannot record WebM in this browser" }; }
  const png = canvas ? { ok: true } : { ok: false, reason: "no canvas in this environment" };
  const imgOk = typeof env.Image === "function" || typeof env.createImageBitmap === "function";
  if (canvas && !imgOk) { png.ok = false; png.reason = "this environment cannot draw an SVG frame on a canvas (no Image / createImageBitmap)"; if (webm.ok) webm = { ok: false, reason: png.reason }; }
  return { json: { ok: true }, svg: { ok: true }, png, webm };
}
function canvasFactory(env) {
  if (env.document && typeof env.document.createElement === "function") {
    return { captures: (() => { try { const c = env.document.createElement("canvas"); return typeof c.captureStream === "function"; } catch { return false; } })(), make: (w, h) => { const c = env.document.createElement("canvas"); c.width = w; c.height = h; return c; } };
  }
  if (typeof env.OffscreenCanvas === "function") return { captures: false, make: (w, h) => new env.OffscreenCanvas(w, h) };
  return null;
}
async function drawSVG(env, ctx, svg, w, h) {
  const blob = new env.Blob([svg], { type: "image/svg+xml" });
  if (typeof env.createImageBitmap === "function") { try { const bmp = await env.createImageBitmap(blob); ctx.drawImage(bmp, 0, 0, w, h); return; } catch { /* some browsers do not decode SVG blobs into bitmaps: fall back to an Image */ } }
  const url = env.URL.createObjectURL(blob);
  try { await new Promise((ok, bad) => { const img = new env.Image(); img.onload = () => { ctx.drawImage(img, 0, 0, w, h); ok(); }; img.onerror = () => bad(new Error("the browser could not draw a frame of the film")); img.src = url; }); }
  finally { env.URL.revokeObjectURL(url); }
}
const toBlob = (c, type) => (typeof c.convertToBlob === "function" ? c.convertToBlob({ type }) : new Promise((ok, bad) => c.toBlob((b) => (b ? ok(b) : bad(new Error("the canvas gave no image"))), type)));

export async function exportFrames(tl, { env = globalThis, fps = 10, scale = 1, onProgress = () => {} } = {}) {
  const cap = capabilities(env); if (!cap.png.ok) throw new Error(`PNG frames: ${cap.png.reason}`);
  const W = tl.scene.width * scale, H = tl.scene.height * scale; const c = canvasFactory(env).make(W, H); const ctx = c.getContext("2d"); const out = [];
  const frames = frameTimes(tl, fps);
  for (const [k, t] of frames) { await drawSVG(env, ctx, frameSVG(tl, stateAt(tl, t)), W, H); out.push({ frame: k, t, blob: await toBlob(c, "image/png") }); onProgress(k + 1, frames.length); }
  return out;
}

export async function exportWebM(tl, { env = globalThis, fps = 30, scale = 1, onProgress = () => {} } = {}) {
  const cap = capabilities(env); if (!cap.webm.ok) throw new Error(`WebM: ${cap.webm.reason}`);
  if (!tl.solved) solve(tl);
  const W = tl.scene.width * scale, H = tl.scene.height * scale; const c = canvasFactory(env).make(W, H); const ctx = c.getContext("2d");
  const stream = c.captureStream(fps); const rec = new env.MediaRecorder(stream, { mimeType: cap.webm.mimeType }); const chunks = [];
  rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
  const done = new Promise((ok, bad) => { rec.onstop = () => ok(); rec.onerror = (e) => bad(new Error(`WebM: the recorder stopped with an error (${e.error?.name || "unknown"})`)); });
  const frames = frameTimes(tl, fps); const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  await drawSVG(env, ctx, frameSVG(tl, stateAt(tl, 0)), W, H); rec.start();
  const t0 = env.performance?.now ? env.performance.now() : Date.now();
  for (const [k, t] of frames) {                                      // real time: MediaRecorder records the canvas as it changes
    await drawSVG(env, ctx, frameSVG(tl, stateAt(tl, t)), W, H); onProgress(k + 1, frames.length);
    const now = env.performance?.now ? env.performance.now() : Date.now(); const wait = t0 + t + 1000 / fps - now; if (wait > 0) await sleep(wait);
  }
  rec.stop(); await done;
  const blob = new env.Blob(chunks, { type: "video/webm" }); if (!blob.size) throw new Error("WebM: the recorder produced an empty file");
  return blob;
}
