// render.js: the scene as SVG (spec 9 default looks, 11 what the canvas shows). Pure: builds a small virtual tree ({t, a, c, k}) that
// view.js patches into the page with a keyed diff, or that toSVGString() serialises (node tests, export). No DOM here.
//
// Looks per kind: rounded box (process), diamond (decision), stadium (terminator), cylinder (data; a horizontal one for a queue), folded
// page with a wavy foot (document), figure (actor), rounded box with a side band (service and other systems), cloud, rack (server),
// container and lane with a title, note with a folded corner, free text (title, caption), and the geometric shapes. Colours follow a
// palette of the twelve colours of scene.js; styles dashed, dotted, thick, thin. Labels are wrapped and shrunk to fit with a
// deterministic width metric (ops.textWidth), so node and the browser lay out the same lines.
//
// buildScene(scene, opts) -> {root: {transform}, layers: {containers, components, connectors, overlay}, slots}
// opts: {selection: [ids], selectedConnectors: [ids], highlight: [ids], corrected: [ids], touch, inline: "light" | "dark" | null,
//        ghost: {from: {x, y}, to: {x, y}} (a connector being drawn), marquee: {x, y, w, h}, hover: id, slots: true}
// toSVGString(scene, opts) -> a complete <svg> document (export uses inline colours, the page uses CSS variables)
import { textWidth, lockedIds, PAD } from "./ops.js";

// ------------------------------------------------------------------ palette (fallbacks; app/app.css defines the variables per theme)
export const PALETTE = {
  light: { bg: "#ffffff", fg: "#1f2328", muted: "#6b7280", accent: "#3a73d6", line: "#c9ced6", sel: "#2f6fec", warn: "#e07b24", ok: "#2e9d5b",
    red: "#d64541", orange: "#e07b24", yellow: "#c9a400", green: "#2e9d5b", teal: "#12908a", blue: "#3a73d6", purple: "#7c4dcc", pink: "#d64f95",
    brown: "#8b5a2b", gray: "#6b7280", black: "#1f2328", white: "#b8bec7" },
  dark: { bg: "#16181d", fg: "#e8eaed", muted: "#9aa1ab", accent: "#6d9cf0", line: "#3a3f48", sel: "#7aa7ff", warn: "#f0a050", ok: "#5cc98a",
    red: "#ff7a72", orange: "#f59a4c", yellow: "#e8c840", green: "#5cc98a", teal: "#3cc4bd", blue: "#6d9cf0", purple: "#a98af0", pink: "#f07cb8",
    brown: "#c08a5a", gray: "#9aa1ab", black: "#c9ced6", white: "#f2f2f2" },
};
export const COLOR_NAMES = ["red", "orange", "yellow", "green", "teal", "blue", "purple", "pink", "brown", "gray", "black", "white"];
// the colour a kind takes when none is given, and how much of it tints the fill
const KIND_HUE = { process: "accent", decision: "yellow", terminator: "green", data: "teal", document: "muted", actor: "fg", system: "purple", container: "muted", note: "yellow", text: "fg", shape: "accent", generic: "muted" };
const KIND_MIX = { note: 34, container: 5, actor: 0, text: 0 };
const varOf = (name) => (COLOR_NAMES.includes(name) ? `var(--c-${name}, ${PALETTE.light[name]})` : `var(--${name}, ${PALETTE.light[name]})`);
function mixHex(a, b, p) {
  const h = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16)); const A = h(a), B = h(b);
  return "#" + A.map((v, i) => Math.round(v * p + B[i] * (1 - p)).toString(16).padStart(2, "0")).join("");
}
const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const ENGINE_CSS = `
.vss { background: var(--bg, #fff); font-family: var(--font, ${FONT}); touch-action: none; user-select: none; -webkit-user-select: none; }
.vss text { fill: var(--fg, #1f2328); font-family: var(--font, ${FONT}); }
.vss-comp { --hue: var(--accent, #3a73d6); --mix: 14%; --f: color-mix(in srgb, var(--hue) var(--mix), var(--bg, #fff)); --s: var(--hue); --sw: 1.6px; }
${Object.entries(KIND_HUE).map(([k, h]) => `.vss .k-${k} { --hue: ${varOf(h)}; ${KIND_MIX[k] != null ? `--mix: ${KIND_MIX[k]}%;` : ""} }`).join("\n")}
${COLOR_NAMES.map((c) => `.vss .vss-comp.c-${c}, .vss .vss-conn.c-${c} { --hue: ${varOf(c)}; }`).join("\n")}
.vss .vss-comp.c-set.k-actor, .vss .vss-comp.c-set.k-text { --mix: 0%; }
.vss .vss-comp.c-set.k-container { --mix: 7%; }
.vss-shape { fill: var(--f); stroke: var(--s); stroke-width: var(--sw); stroke-linejoin: round; }
.vss-detail { fill: none; stroke: var(--s); stroke-width: var(--sw); stroke-linecap: round; stroke-linejoin: round; }
.vss-head { fill: var(--s); fill-opacity: .12; }
.vss .k-text .vss-shape, .vss-hit { fill: transparent; stroke: none; }
.vss .s-dashed .vss-shape, .vss .s-dashed .vss-detail, .vss .vss-conn.s-dashed .vss-line { stroke-dasharray: 7 5; }
.vss .s-dotted .vss-shape, .vss .s-dotted .vss-detail, .vss .vss-conn.s-dotted .vss-line { stroke-dasharray: 1.5 4.5; stroke-linecap: round; }
.vss .s-thick { --sw: 3.2px; } .vss .s-thin { --sw: 0.9px; }
.vss-label { font-size: 14px; dominant-baseline: central; text-anchor: middle; }
.vss-title { font-weight: 600; text-anchor: start; dominant-baseline: central; }
.vss .k-text .vss-label.big { font-weight: 650; }
.vss .k-text .vss-label.small { font-style: italic; fill: var(--muted, #6b7280); }
.vss-conn { --hue: var(--muted, #6b7280); --sw: 1.6px; }
.vss-line { fill: none; stroke: var(--hue); stroke-width: var(--sw); stroke-linejoin: round; stroke-linecap: round; }
.vss-arrow { fill: var(--hue); stroke: none; }
.vss-hit-line { fill: none; stroke: transparent; stroke-width: 16px; pointer-events: stroke; }
.vss-conn.s-thick { --sw: 3px; } .vss-conn.s-thin { --sw: 0.9px; }
.vss-conn.sel { --hue: var(--sel, #2f6fec); }
.vss-clabel rect { fill: var(--bg, #fff); stroke: var(--line, #c9ced6); stroke-width: 1px; }
.vss-clabel text { font-size: 12px; text-anchor: middle; dominant-baseline: central; }
.vss-lock circle { fill: var(--bg, #fff); stroke: var(--muted, #6b7280); stroke-width: 1.2px; }
.vss-lock path { fill: var(--muted, #6b7280); stroke: none; } .vss-lock .shackle { fill: none; stroke: var(--muted, #6b7280); stroke-width: 1.6px; }
.vss-corrected { stroke: var(--warn, #e07b24); stroke-width: 1.5px; stroke-dasharray: 2 2; fill: none; }
.vss-sel-box { fill: none; stroke: var(--sel, #2f6fec); stroke-width: 1.5px; stroke-dasharray: 5 3; vector-effect: non-scaling-stroke; pointer-events: none; }
.vss-handle { fill: var(--bg, #fff); stroke: var(--sel, #2f6fec); stroke-width: 1.5px; vector-effect: non-scaling-stroke; }
.vss-port { fill: var(--sel, #2f6fec); fill-opacity: .85; stroke: var(--bg, #fff); stroke-width: 1.5px; vector-effect: non-scaling-stroke; cursor: crosshair; }
.vss-cand { fill: none; stroke: var(--warn, #e07b24); stroke-width: 3px; vector-effect: non-scaling-stroke; pointer-events: none; animation: vss-pulse 1.1s ease-in-out infinite; }
.vss-badge circle { fill: var(--warn, #e07b24); } .vss-badge text { fill: #fff; font-size: 12px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
.vss-ghost { fill: none; stroke: var(--sel, #2f6fec); stroke-width: 1.5px; stroke-dasharray: 4 3; vector-effect: non-scaling-stroke; pointer-events: none; }
.vss-marquee { fill: var(--sel, #2f6fec); fill-opacity: .08; stroke: var(--sel, #2f6fec); stroke-width: 1px; vector-effect: non-scaling-stroke; pointer-events: none; }
.vss-drop { stroke: var(--ok, #2e9d5b) !important; stroke-width: 2.5px !important; }
.vss.animate .vss-comp { transition: transform .28s ease; }
.vss.animate .vss-layer-connectors { animation: vss-fade .42s ease; }
.vss .vss-comp, .vss .vss-conn { cursor: default; } .vss .vss-handle { cursor: nwse-resize; }
.vss-slot { overflow: visible; }
@supports not (color: color-mix(in srgb, red 50%, white)) { .vss-comp { --f: var(--bg, #fff); } .vss .k-note { --f: #fdf5c9; } }
@keyframes vss-pulse { 0%, 100% { stroke-opacity: 1; } 50% { stroke-opacity: .35; } }
@keyframes vss-fade { 0%, 60% { opacity: 0; } 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .vss.animate .vss-comp { transition: none; } .vss-cand { animation: none; } }
`;

// ------------------------------------------------------------------ virtual tree and serialisation
export const el = (t, a = {}, ...c) => ({ t, a, c: c.flat().filter((x) => x != null && x !== false) });
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export function toXML(n) {
  if (typeof n === "string" || typeof n === "number") return esc(n);
  const attrs = Object.entries(n.a).filter(([k, v]) => v != null && v !== false && k !== "key").map(([k, v]) => ` ${k}="${esc(v)}"`).join("");
  if (!n.c.length) return `<${n.t}${attrs}/>`;
  return `<${n.t}${attrs}>${n.c.map(toXML).join("")}</${n.t}>`;
}
const r1 = (v) => Math.round(v * 10) / 10;

// ------------------------------------------------------------------ labels
export function fitText(text, maxW, maxH, { size = 14, min = 9, lineH = 1.22 } = {}) {
  const words = String(text).split(/\s+/).filter(Boolean); if (!words.length) return { lines: [], size };
  for (let fs = size; fs >= min; fs--) {
    const lines = wrap(words, maxW, fs); if (!lines) continue;
    if (lines.length * fs * lineH <= maxH + 0.5) return { lines, size: fs };
  }
  // still too long at the smallest size: as many lines as fit, the last one cut with an ellipsis
  const fs = min; const maxLines = Math.max(1, Math.floor(maxH / (fs * lineH)));
  const lines = wrap(words, maxW, fs, true).slice(0, maxLines); const all = wrap(words, maxW, fs, true);
  if (all.length > maxLines || lines.some((l) => textWidth(l, fs) > maxW)) lines[lines.length - 1] = ellipsize(all.length > maxLines ? lines[lines.length - 1] + "…" : lines[lines.length - 1], maxW, fs);
  return { lines, size: fs, cut: true };
}
function wrap(words, maxW, fs, force = false) {
  const lines = []; let cur = "";
  for (const w of words) {
    if (textWidth(w, fs) > maxW) { if (!force) return null; if (cur) { lines.push(cur); cur = ""; } lines.push(ellipsize(w, maxW, fs)); continue; }
    const t = cur ? cur + " " + w : w; if (textWidth(t, fs) <= maxW) cur = t; else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur); return lines;
}
function ellipsize(s, maxW, fs) { let t = s.replace(/…$/, ""); while (t.length > 1 && textWidth(t + "…", fs) > maxW) t = t.slice(0, -1); return t + "…"; }

// the look of a component: from its kind and its word
export function lookOf(c) {
  const k = c.kind, w = c.word;
  if (k === "process") return "process"; if (k === "decision") return "diamond"; if (k === "terminator") return "stadium";
  if (k === "data") return w === "queue" ? "queue" : "cylinder"; if (k === "document") return "document"; if (k === "actor") return "actor";
  if (k === "system") return w === "cloud" ? "cloud" : w === "server" ? "server" : "system";
  if (k === "container") return w === "lane" ? "lane" : "container"; if (k === "note") return "note"; if (k === "text") return "text";
  if (k === "shape") return { circle: "ellipse", ellipse: "ellipse", square: "square", rectangle: "square", triangle: "triangle", star: "star", hexagon: "hexagon" }[w] || "process";
  return "process";
}
// the area the label may use, in the component's local coordinates
function labelArea(look, w, h) {
  const m = 8;
  switch (look) {
    case "diamond": return { x: w * 0.2, y: h * 0.2, w: w * 0.6, h: h * 0.6 };
    case "stadium": return { x: Math.min(h / 2, w / 4), y: 4, w: w - 2 * Math.min(h / 2, w / 4), h: h - 8 };
    case "cylinder": { const ry = Math.min(h * 0.14, 12); return { x: m, y: 2 * ry + 2, w: w - 2 * m, h: h - 3 * ry - 4 }; }
    case "queue": { const rx = Math.min(w * 0.12, 12); return { x: rx + 4, y: 4, w: w - 3 * rx - 8, h: h - 8 }; }
    case "document": return { x: m, y: m, w: w - 2 * m - 6, h: h * 0.82 - m };
    case "note": return { x: m, y: m, w: w - 2 * m - 6, h: h - 2 * m };
    case "actor": return { x: -24, y: h * 0.66, w: w + 48, h: h * 0.34 };
    case "ellipse": return { x: w * 0.15, y: h * 0.15, w: w * 0.7, h: h * 0.7 };
    case "triangle": return { x: w * 0.25, y: h * 0.45, w: w * 0.5, h: h * 0.48 };
    case "star": return { x: w * 0.3, y: h * 0.35, w: w * 0.4, h: h * 0.35 };
    case "hexagon": return { x: w * 0.2, y: m, w: w * 0.6, h: h - 2 * m };
    case "cloud": return { x: w * 0.2, y: h * 0.25, w: w * 0.6, h: h * 0.55 };
    case "system": return { x: 16, y: m, w: w - 16 - m, h: h - 2 * m };
    case "server": return { x: m, y: 14, w: w - 2 * m, h: h - 18 };
    case "text": return { x: 2, y: 2, w: w - 4, h: h - 4 };
    default: return { x: m, y: 6, w: w - 2 * m, h: h - 12 };
  }
}
function cloudPath(w, h) {
  const P = [[0.25, 0.85], [0.08, 0.82, 0.02, 0.55, 0.18, 0.47], [0.12, 0.22, 0.38, 0.12, 0.45, 0.25], [0.55, 0.05, 0.82, 0.1, 0.8, 0.32], [0.98, 0.35, 1.0, 0.75, 0.82, 0.85]];
  const X = (v) => r1(v * w), Y = (v) => r1(v * h);
  let d = `M${X(P[0][0])},${Y(P[0][1])}`; for (let i = 1; i < P.length; i++) { const [a, b, c2, d2, e, f] = P[i]; d += ` C${X(a)},${Y(b)} ${X(c2)},${Y(d2)} ${X(e)},${Y(f)}`; }
  return d + " Z";
}
function poly(pts) { return pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" "); }
function shapeOf(look, w, h, st) {
  const S = (t, a) => el(t, { class: "vss-shape", style: st.shape, ...a }), D = (d) => el("path", { class: "vss-detail", d, style: st.detail });
  switch (look) {
    case "diamond": return [S("polygon", { points: poly([[w / 2, 0], [w, h / 2], [w / 2, h], [0, h / 2]]) })];
    case "stadium": return [S("rect", { x: 0, y: 0, width: w, height: h, rx: r1(Math.min(h / 2, w / 2)) })];
    case "cylinder": { const ry = r1(Math.min(h * 0.14, 12)), rx = r1(w / 2); return [S("path", { d: `M0,${ry} A${rx},${ry} 0 0 1 ${w},${ry} V${r1(h - ry)} A${rx},${ry} 0 0 1 0,${r1(h - ry)} Z` }), D(`M0,${ry} A${rx},${ry} 0 0 0 ${w},${ry}`)]; }
    case "queue": { const rx = r1(Math.min(w * 0.12, 12)), ry = r1(h / 2); return [S("path", { d: `M${rx},0 H${r1(w - rx)} A${rx},${ry} 0 0 1 ${r1(w - rx)},${h} H${rx} A${rx},${ry} 0 0 1 ${rx},0 Z` }), D(`M${r1(w - rx)},0 A${rx},${ry} 0 0 0 ${r1(w - rx)},${h}`)]; }
    case "document": { const f = Math.min(14, w / 5, h / 4); return [S("path", { d: `M0,0 H${r1(w - f)} L${w},${r1(f)} V${r1(h * 0.88)} Q${r1(w * 0.75)},${r1(h * 0.74)} ${r1(w * 0.5)},${r1(h * 0.88)} T0,${r1(h * 0.88)} Z` }), D(`M${r1(w - f)},0 V${r1(f)} H${w}`)]; }
    case "note": { const f = Math.min(14, w / 5, h / 4); return [S("path", { d: `M0,0 H${r1(w - f)} L${w},${r1(f)} V${h} H0 Z` }), D(`M${r1(w - f)},0 V${r1(f)} H${w}`)]; }
    case "actor": {
      const fh = h * 0.62, r = Math.min(w * 0.2, fh * 0.17), cx = w / 2, hy = r + 1, neck = hy + r, hip = neck + fh * 0.36, foot = fh;
      return [el("rect", { class: "vss-hit", x: 0, y: 0, width: w, height: h }), el("circle", { class: "vss-shape", cx: r1(cx), cy: r1(hy), r: r1(r), style: st.shape }),
        D(`M${r1(cx)},${r1(neck)} V${r1(hip)} M${r1(cx - fh * 0.3)},${r1(neck + fh * 0.13)} H${r1(cx + fh * 0.3)} M${r1(cx)},${r1(hip)} L${r1(cx - fh * 0.24)},${r1(foot)} M${r1(cx)},${r1(hip)} L${r1(cx + fh * 0.24)},${r1(foot)}`)];
    }
    case "ellipse": return [S("ellipse", { cx: r1(w / 2), cy: r1(h / 2), rx: r1(w / 2), ry: r1(h / 2) })];
    case "square": return [S("rect", { x: 0, y: 0, width: w, height: h, rx: 2 })];
    case "triangle": return [S("polygon", { points: poly([[w / 2, 0], [w, h], [0, h]]) })];
    case "star": { const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? 0.4 : 1; pts.push([w / 2 + (w / 2) * rr * Math.cos(a), h / 2 + (h / 2) * rr * Math.sin(a) + h * 0.05]); } return [S("polygon", { points: poly(pts) })]; }
    case "hexagon": { const q = w * 0.2; return [S("polygon", { points: poly([[q, 0], [w - q, 0], [w, h / 2], [w - q, h], [q, h], [0, h / 2]]) })]; }
    case "cloud": return [el("rect", { class: "vss-hit", x: 0, y: 0, width: w, height: h }), S("path", { d: cloudPath(w, h) })];
    case "server": return [S("rect", { x: 0, y: 0, width: w, height: h, rx: 4 }), D(`M6,8 H${r1(w - 6)} M${r1(w - 14)},${r1(h - 8)} h4`)];
    case "system": return [S("rect", { x: 0, y: 0, width: w, height: h, rx: 8 }), D(`M10,0 V${h}`)];
    case "container": return [S("rect", { x: 0, y: 0, width: w, height: h, rx: 10 })];
    case "lane": return [S("rect", { x: 0, y: 0, width: w, height: h, rx: 4 }), D(`M0,${PAD.t - 6} H${w}`)];
    case "text": return [S("rect", { x: 0, y: 0, width: w, height: h })];
    default: return [S("rect", { x: 0, y: 0, width: w, height: h, rx: 8 })];
  }
}

// inline paint for export (no CSS variables): returns style strings for the parts of a component or connector
function inlinePaint(theme, c, isConn) {
  const P = PALETTE[theme] || PALETTE.light; const hueName = c.color || (isConn ? "muted" : KIND_HUE[c.kind] || "accent"); const hue = P[hueName] || P.accent;
  const mix = c.color ? (c.kind === "actor" || c.kind === "text" ? 0 : c.kind === "container" ? 7 : KIND_MIX[c.kind] ?? 14) : KIND_MIX[c.kind] ?? 14;
  const fill = isConn ? "none" : c.kind === "text" ? "none" : mix ? mixHex(hue, P.bg, mix / 100) : "none";
  const sw = c.style === "thick" ? (isConn ? 3 : 3.2) : c.style === "thin" ? 0.9 : 1.6;
  const dash = c.style === "dashed" ? "stroke-dasharray:7 5;" : c.style === "dotted" ? "stroke-dasharray:1.5 4.5;stroke-linecap:round;" : "";
  const stroke = c.kind === "text" && !isConn ? "none" : hue;
  return { shape: `fill:${fill};stroke:${stroke};stroke-width:${sw}px;${dash}`, detail: `fill:none;stroke:${hue};stroke-width:${sw}px;${dash}`, hue, text: P.fg, muted: P.muted, bg: P.bg, line: P.line };
}

function labelNode(c, look, w, hgt, st, corrected) {
  if (!c.label) return null; const A = labelArea(look, w, hgt);
  if (look === "container" || look === "lane") {
    const f = fitText(c.label, w - 24, 20, { size: 13, min: 9 }); if (!f.lines.length) return null; const line = f.lines[0];
    return el("g", {}, el("text", { class: "vss-title", x: 12, y: PAD.t / 2 - 2, "font-size": f.size, "font-weight": 600, "text-anchor": "start", "dominant-baseline": "central", style: st.text }, line),
      corrected ? el("line", { class: "vss-corrected", x1: 12, y1: PAD.t / 2 + f.size / 2, x2: r1(12 + textWidth(line, f.size)), y2: PAD.t / 2 + f.size / 2 }) : null);
  }
  const base = look === "text" ? (c.word === "title" ? 20 : 13) : 14;
  const f = fitText(c.label, A.w, A.h, { size: base, min: look === "text" ? 9 : 9 }); const lh = f.size * 1.22;
  const y0 = A.y + A.h / 2 - ((f.lines.length - 1) * lh) / 2; const cx = A.x + A.w / 2;
  const cls = look === "text" ? (c.word === "title" ? "vss-label big" : c.word === "caption" ? "vss-label small" : "vss-label") : "vss-label";
  const kids = f.lines.map((l, i) => el("tspan", { x: r1(cx), y: r1(y0 + i * lh) }, l));
  const under = corrected ? f.lines.map((l, i) => { const tw = textWidth(l, f.size); const y = r1(y0 + i * lh + f.size * 0.6); return el("line", { class: "vss-corrected", x1: r1(cx - tw / 2), y1: y, x2: r1(cx + tw / 2), y2: y }); }) : [];
  return el("g", {}, el("text", { class: cls, "font-size": f.size, "text-anchor": "middle", "dominant-baseline": "central", "font-weight": look === "text" && c.word === "title" ? 650 : null, style: st.text }, kids), under);
}
function lockBadge(w) {
  return el("g", { class: "vss-lock", transform: `translate(${r1(w - 2)},-4)` }, el("circle", { cx: 0, cy: 0, r: 9 }),
    el("path", { class: "shackle", d: "M-2.6,-1 V-3.2 A2.6,2.6 0 0 1 2.6,-3.2 V-1" }), el("path", { d: "M-4,-1 H4 V4.5 H-4 Z" }));
}

// ------------------------------------------------------------------ connectors
function roundedPath(pts, r = 6) {
  if (pts.length < 2) return "";
  let d = `M${r1(pts[0].x)},${r1(pts[0].y)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1];
    const l1 = Math.hypot(b.x - a.x, b.y - a.y), l2 = Math.hypot(c.x - b.x, c.y - b.y); const rr = Math.min(r, l1 / 2, l2 / 2);
    const p = { x: b.x - ((b.x - a.x) / (l1 || 1)) * rr, y: b.y - ((b.y - a.y) / (l1 || 1)) * rr }, q = { x: b.x + ((c.x - b.x) / (l2 || 1)) * rr, y: b.y + ((c.y - b.y) / (l2 || 1)) * rr };
    d += ` L${r1(p.x)},${r1(p.y)} Q${r1(b.x)},${r1(b.y)} ${r1(q.x)},${r1(q.y)}`;
  }
  const z = pts[pts.length - 1]; return d + ` L${r1(z.x)},${r1(z.y)}`;
}
export function connectorPoints(scene, e) {
  if (e.points && e.points.length >= 2) return e.points;
  const a = scene.components.get(e.source)?.box, b = scene.components.get(e.target)?.box; if (!a || !b) return [];
  return [{ x: a.x + a.w / 2, y: a.y + a.h / 2 }, { x: b.x + b.w / 2, y: b.y + b.h / 2 }];
}
export function labelPoint(pts) {
  let best = 0, at = { x: 0, y: 0 };
  for (let i = 0; i + 1 < pts.length; i++) { const L = Math.abs(pts[i + 1].x - pts[i].x) + Math.abs(pts[i + 1].y - pts[i].y); if (L > best) { best = L; at = { x: (pts[i].x + pts[i + 1].x) / 2, y: (pts[i].y + pts[i + 1].y) / 2 }; } }
  return at;
}
function connectorNode(scene, e, opts) {
  const pts = connectorPoints(scene, e).map((p) => ({ ...p })); if (pts.length < 2) return null;
  const st = opts.inline ? inlinePaint(opts.inline, e, true) : null; const arrow = e.kind !== "line";
  const thick = e.style === "thick"; const AL = thick ? 13 : 10, AW = thick ? 6.5 : 5;
  const kids = [];
  const full = roundedPath(pts);
  if (arrow) {
    const z = pts[pts.length - 1], y = pts[pts.length - 2]; const L = Math.hypot(z.x - y.x, z.y - y.y) || 1; const ux = (z.x - y.x) / L, uy = (z.y - y.y) / L;
    const back = Math.min(AL * 0.8, L); pts[pts.length - 1] = { x: z.x - ux * back, y: z.y - uy * back };
    const bx = z.x - ux * AL, by = z.y - uy * AL;
    kids.push(el("path", { class: "vss-line", d: roundedPath(pts), style: st ? `fill:none;stroke:${st.hue};${st.shape.replace(/^fill:[^;]*;stroke:[^;]*;/, "")}` : null }));
    kids.push(el("polygon", { class: "vss-arrow", points: poly([[z.x, z.y], [bx - uy * AW, by + ux * AW], [bx + uy * AW, by - ux * AW]]), style: st ? `fill:${st.hue}` : null }));
  } else kids.push(el("path", { class: "vss-line", d: full, style: st ? `fill:none;stroke:${st.hue};${st.shape.replace(/^fill:[^;]*;stroke:[^;]*;/, "")}` : null }));
  if (!opts.inline) kids.unshift(el("path", { class: "vss-hit-line", d: full }));
  if (e.label) {
    const at = labelPoint(connectorPoints(scene, e)); const tw = textWidth(e.label, 12) + 10;
    kids.push(el("g", { class: "vss-clabel" }, el("rect", { x: r1(at.x - tw / 2), y: r1(at.y - 9), width: r1(tw), height: 18, rx: 4, style: st ? `fill:${st.bg};stroke:${st.line}` : null }),
      el("text", { x: r1(at.x), y: r1(at.y), "font-size": 12, "text-anchor": "middle", "dominant-baseline": "central", style: st ? `fill:${st.text}` : null }, e.label)));
  }
  const cls = ["vss-conn", `k-${arrow ? "arrow" : "line"}`, e.color ? `c-${e.color}` : null, e.style && e.style !== "solid" ? `s-${e.style}` : null, (opts.selectedConnectors || []).includes(e.id) ? "sel" : null].filter(Boolean).join(" ");
  return { ...el("g", { class: cls, "data-cid": e.id }, kids), k: e.id };
}

// ------------------------------------------------------------------ components
const depthOf = (scene, c) => { let d = 0, p = c.parent; while (p && d < 64) { d++; p = scene.components.get(p)?.parent; } return d; };
function componentNode(scene, c, opts, locked) {
  const { w, h: hh } = c.box; const look = lookOf(c);
  const st = opts.inline ? inlinePaint(opts.inline, c, false) : { shape: null, detail: null, text: null };
  if (opts.inline) st.text = `fill:${st.text}`;
  const hasSlot = (c.text != null || c.formula != null) && opts.slots !== false && !opts.inline;
  const kids = [...shapeOf(look, w, hh, st)];
  if (!hasSlot) {
    let lab = c.label; if (opts.inline && (c.text != null || c.formula != null)) lab = plainOf(c.text ?? c.formula) || c.label;
    if (lab) kids.push(labelNode({ ...c, label: lab }, look, w, hh, st, (opts.corrected || []).includes(c.id)));
  }
  if (locked) kids.push(lockBadge(w));
  const cls = ["vss-comp", `k-${c.kind || "process"}`, `l-${look}`, c.color ? `c-${c.color} c-set` : null, c.style && c.style !== "solid" ? `s-${c.style}` : null].filter(Boolean).join(" ");
  return { t: "g", a: { class: cls, "data-id": c.id, "data-kind": c.kind, transform: `translate(${r1(c.box.x)},${r1(c.box.y)})` }, c: kids, k: c.id };
}
function plainOf(v) { if (typeof v === "string") return v; if (v && typeof v.plain === "string") return v.plain; if (v && typeof v.text === "string") return v.text; if (v && typeof v.latex === "string") return v.latex; return ""; }

function overlayNodes(scene, opts) {
  const out = []; const z = scene.view?.zoom || 1; const sel = (opts.selection || scene.selection || []).filter((id) => scene.components.has(id));
  const hs = (opts.touch ? 12 : 9) / z, pr = (opts.touch ? 7 : 5.5) / z, po = (opts.touch ? 24 : 16) / z;
  for (const id of sel) { const b = scene.components.get(id).box; out.push(el("rect", { class: "vss-sel-box", x: r1(b.x - 4 / z), y: r1(b.y - 4 / z), width: r1(b.w + 8 / z), height: r1(b.h + 8 / z), rx: 4 / z })); }
  if (sel.length === 1) {
    const b = scene.components.get(sel[0]).box; const id = sel[0];
    const H = { nw: [b.x, b.y], n: [b.x + b.w / 2, b.y], ne: [b.x + b.w, b.y], e: [b.x + b.w, b.y + b.h / 2], se: [b.x + b.w, b.y + b.h], s: [b.x + b.w / 2, b.y + b.h], sw: [b.x, b.y + b.h], w: [b.x, b.y + b.h / 2] };
    const cursor = { nw: "nwse", se: "nwse", ne: "nesw", sw: "nesw", n: "ns", s: "ns", e: "ew", w: "ew" };
    const small = Math.min(b.w, b.h) * z < (opts.touch ? 90 : 40);           // a small box on screen: corner handles only
    for (const [k, [x, y]] of Object.entries(H)) if (!small || k.length === 2) out.push(el("rect", { class: "vss-handle", "data-handle": k, "data-id": id, x: r1(x - hs / 2), y: r1(y - hs / 2), width: r1(hs), height: r1(hs), rx: 2 / z, style: `cursor:${cursor[k]}-resize` }));
    const P = { n: [b.x + b.w / 2, b.y - po], e: [b.x + b.w + po, b.y + b.h / 2], s: [b.x + b.w / 2, b.y + b.h + po], w: [b.x - po, b.y + b.h / 2] };
    for (const [k, [x, y]] of Object.entries(P)) out.push(el("circle", { class: "vss-port", "data-port": k, "data-id": id, cx: r1(x), cy: r1(y), r: r1(pr) }));
  }
  (opts.highlight || []).forEach((id, i) => {
    const c = scene.components.get(id); if (!c) return; const b = c.box; const m = 6 / z;
    out.push(el("rect", { class: "vss-cand", x: r1(b.x - m), y: r1(b.y - m), width: r1(b.w + 2 * m), height: r1(b.h + 2 * m), rx: 6 / z }));
    out.push(el("g", { class: "vss-badge", "data-id": id, transform: `translate(${r1(b.x - m)},${r1(b.y - m)}) scale(${r1(1 / z * 100) / 100})` }, el("circle", { cx: 0, cy: 0, r: 11 }), el("text", { x: 0, y: 0, "text-anchor": "middle", "dominant-baseline": "central" }, String(i + 1))));
  });
  if (opts.drop && scene.components.has(opts.drop)) { const b = scene.components.get(opts.drop).box; out.push(el("rect", { class: "vss-sel-box vss-drop", x: b.x - 3, y: b.y - 3, width: b.w + 6, height: b.h + 6, rx: 6 })); }
  if (opts.ghost) out.push(el("path", { class: "vss-ghost", d: `M${r1(opts.ghost.from.x)},${r1(opts.ghost.from.y)} L${r1(opts.ghost.to.x)},${r1(opts.ghost.to.y)}` }));
  if (opts.marquee) { const m = opts.marquee; out.push(el("rect", { class: "vss-marquee", x: r1(m.x), y: r1(m.y), width: r1(m.w), height: r1(m.h) })); }
  return out;
}

export function buildScene(scene, opts = {}) {
  const locked = opts.inline ? new Map() : lockedIds(scene);
  const comps = [...scene.components.values()];
  const conts = comps.filter((c) => c.kind === "container").sort((a, b) => depthOf(scene, a) - depthOf(scene, b) || a.order - b.order);
  const others = comps.filter((c) => c.kind !== "container").sort((a, b) => a.order - b.order || (a.id < b.id ? -1 : 1));
  const v = scene.view || {}; const z = v.zoom || 1;
  const slots = opts.inline ? [] : comps.filter((c) => c.text != null || c.formula != null).map((c) => ({ id: c.id, x: c.box.x, y: c.box.y, w: c.box.w, h: c.box.h, kind: c.formula != null ? "formula" : "text" }));
  return {
    root: { transform: `translate(${r1(v.x || 0)},${r1(v.y || 0)}) scale(${z})` },
    layers: {
      containers: conts.map((c) => componentNode(scene, c, opts, locked.has(c.id))),
      components: others.map((c) => componentNode(scene, c, opts, locked.has(c.id))),
      connectors: [...scene.connectors.values()].filter((e) => scene.components.has(e.source) && scene.components.has(e.target)).map((e) => connectorNode(scene, e, opts)).filter(Boolean),
      overlay: opts.inline ? [] : overlayNodes(scene, opts),
    },
    slots,
  };
}
export const LAYER_ORDER = ["containers", "connectors", "components", "overlay"];   // connectors under components: a click near a port selects the component

// the box holding everything drawn (components, routes, connector labels)
export function contentBounds(scene) {
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity; const add = (x, y) => { x1 = Math.min(x1, x); y1 = Math.min(y1, y); x2 = Math.max(x2, x); y2 = Math.max(y2, y); };
  for (const c of scene.components.values()) { add(c.box.x, c.box.y - (c.kind === "actor" ? 0 : 6)); add(c.box.x + c.box.w + 6, c.box.y + c.box.h); if (c.kind === "actor") { add(c.box.x - 24, c.box.y); add(c.box.x + c.box.w + 24, c.box.y); } }
  for (const e of scene.connectors.values()) for (const p of connectorPoints(scene, e)) add(p.x, p.y);
  if (x1 === Infinity) return { x: 0, y: 0, w: scene.width || 400, h: scene.height || 300 };
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

// a complete SVG document. inline: "light" | "dark" (colours written into the elements, for export) or null (CSS variables, for a page)
export function toSVGString(scene, opts = {}) {
  const o = { ...opts, inline: opts.inline === undefined ? "light" : opts.inline };
  const pad = opts.padding ?? 24; const b = contentBounds(scene);
  const vb = [Math.floor(b.x - pad), Math.floor(b.y - pad), Math.ceil(b.w + 2 * pad), Math.ceil(b.h + 2 * pad)];
  const built = buildScene({ ...scene, view: { zoom: 1, x: 0, y: 0 } }, o);
  const P = PALETTE[o.inline] || PALETTE.light;
  const kids = [];
  if (!o.inline) kids.push(el("style", {}, ENGINE_CSS));
  if (opts.background !== false) kids.push(el("rect", { x: vb[0], y: vb[1], width: vb[2], height: vb[3], style: o.inline ? `fill:${P.bg}` : "fill:var(--bg, #fff)" }));
  const textStyle = o.inline ? `font-family:${FONT};fill:${P.fg}` : null;
  const layer = (name) => el("g", { class: `vss-layer-${name}` }, built.layers[name].map((n) => ({ ...n, a: { ...n.a } })));
  kids.push(el("g", { class: "vss-root", style: textStyle }, ...LAYER_ORDER.filter((l) => l !== "overlay" || !o.inline).map(layer)));
  const svg = el("svg", { xmlns: "http://www.w3.org/2000/svg", class: "vss", "data-theme": o.inline || null, viewBox: vb.join(" "), width: vb[2], height: vb[3], "font-family": FONT }, kids);
  return `<?xml version="1.0" encoding="UTF-8"?>\n` + toXML(svg);
}
