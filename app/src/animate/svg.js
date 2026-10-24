// svg.js: one frame of the film as SVG text (DOM-free: used by view.js on screen, by export.js for the animated SVG, the PNG frames and the
// WebM). It draws exactly the state of player.js: the components the user built (shape by kind), the connectors re-routed between their
// ends' current boxes, the travellers, the highlights, the characters with their pose.
import { drawCharacter } from "./characters.js";

export const PALETTE = { red: "#e05252", orange: "#f08c2e", yellow: "#f2c94c", green: "#4caf6a", teal: "#2bb3a3", blue: "#4a7bd0", purple: "#8a63c9",
  pink: "#e57fb0", brown: "#9a6b47", gray: "#9aa3ad", black: "#2b2b2b", white: "#ffffff" };
const FILL = "#eef3fa", STROKE = "#34495e", HALO = "#f5b301";
const n = (v) => +(+v).toFixed(2);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const fillOf = (c) => (c.color && PALETTE[c.color]) || FILL;

// the shape of a component in a box (no transform): by kind, as the diagram engine draws it
export function shapeSVG(c, b) {
  const { x, y, w, h } = b; const fill = fillOf(c); const st = `stroke="${STROKE}" stroke-width="2"`; const label = esc(c.label || c.word || "");
  const text = `<text x="${n(x + w / 2)}" y="${n(y + h / 2 + 5)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="${c.color === "black" ? "#fff" : "#1f2a3a"}">${label}</text>`;
  if (c.character) return drawCharacter(c.character, b, c.pose, { color: c.color ? fillOf(c) : undefined }) + `<text x="${n(x + w / 2)}" y="${n(y + h + 16)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#1f2a3a">${esc(c.label || "")}</text>`;
  if (c.kind === "data") { const ry = Math.min(10, h / 5); return `<path d="M ${n(x)} ${n(y + ry)} A ${n(w / 2)} ${n(ry)} 0 0 1 ${n(x + w)} ${n(y + ry)} L ${n(x + w)} ${n(y + h - ry)} A ${n(w / 2)} ${n(ry)} 0 0 1 ${n(x)} ${n(y + h - ry)} Z" fill="${fill}" ${st}/><path d="M ${n(x)} ${n(y + ry)} A ${n(w / 2)} ${n(ry)} 0 0 0 ${n(x + w)} ${n(y + ry)}" fill="none" ${st}/>` + text; }
  if (c.kind === "decision") return `<path d="M ${n(x + w / 2)} ${n(y)} L ${n(x + w)} ${n(y + h / 2)} L ${n(x + w / 2)} ${n(y + h)} L ${n(x)} ${n(y + h / 2)} Z" fill="${fill}" ${st}/>` + text;
  if (c.kind === "text") return `<text x="${n(x + w / 2)}" y="${n(y + h / 2 + 8)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" font-weight="600" fill="${c.color ? fillOf(c) : "#1f2a3a"}">${label}</text>`;
  if (c.kind === "note") return `<path d="M ${n(x)} ${n(y)} L ${n(x + w - 14)} ${n(y)} L ${n(x + w)} ${n(y + 14)} L ${n(x + w)} ${n(y + h)} L ${n(x)} ${n(y + h)} Z" fill="${c.color ? fill : "#fff7c2"}" ${st}/>` + text;
  if (c.word === "circle" || c.word === "ellipse") return `<ellipse cx="${n(x + w / 2)}" cy="${n(y + h / 2)}" rx="${n(w / 2)}" ry="${n(h / 2)}" fill="${fill}" ${st}/>` + text;
  if (c.word === "triangle") return `<path d="M ${n(x + w / 2)} ${n(y)} L ${n(x + w)} ${n(y + h)} L ${n(x)} ${n(y + h)} Z" fill="${fill}" ${st}/>` + text;
  if (c.kind === "container") return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="6" fill="none" stroke="${STROKE}" stroke-dasharray="6 4" stroke-width="1.5"/><text x="${n(x + 8)}" y="${n(y + 16)}" font-family="system-ui, sans-serif" font-size="12">${label}</text>`;
  const rx = c.kind === "actor" ? 18 : c.kind === "shape" ? 2 : 8;
  return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${rx}" fill="${fill}" ${st}/>` + text;
}
// the point where the line from a box's centre towards p leaves the box
export function clip(b, p) {
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2, dx = p[0] - cx, dy = p[1] - cy;
  if (!dx && !dy) return [cx, cy];
  const s = Math.min(Math.abs(dx) > 1e-9 ? b.w / 2 / Math.abs(dx) : Infinity, Math.abs(dy) > 1e-9 ? b.h / 2 / Math.abs(dy) : Infinity);
  return [cx + dx * Math.min(s, 1), cy + dy * Math.min(s, 1)];
}
export function connectorPoints(st, k) {
  const a = st.components.get(k.source).box, b = st.components.get(k.target).box;
  const ca = [a.x + a.w / 2, a.y + a.h / 2], cb = [b.x + b.w / 2, b.y + b.h / 2];
  return [clip(a, cb), clip(b, ca)];
}
export const DEFS = `<defs><marker id="vss-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${STROKE}"/></marker></defs>`;
export function travellerSVG(tr, attrs = "") {
  const col = (tr.color && PALETTE[tr.color]) || "#e0533d";
  if (tr.word === "envelope" || tr.word === "message") return `<g ${attrs}><rect x="${n(tr.x - 10)}" y="${n(tr.y - 7)}" width="20" height="14" rx="2" fill="#fff" stroke="${col}" stroke-width="2"/><path d="M ${n(tr.x - 10)} ${n(tr.y - 7)} L ${n(tr.x)} ${n(tr.y + 1)} L ${n(tr.x + 10)} ${n(tr.y - 7)}" fill="none" stroke="${col}" stroke-width="2"/></g>`;
  if (tr.word === "packet" || tr.word === "token") return `<rect ${attrs} x="${n(tr.x - 7)}" y="${n(tr.y - 7)}" width="14" height="14" rx="3" fill="${col}"/>`;
  return `<circle ${attrs} cx="${n(tr.x)}" cy="${n(tr.y)}" r="7" fill="${col}"/>`;
}

export function frameSVG(tl, st, { width = tl.scene.width, height = tl.scene.height, background = "#ffffff", caption = true } = {}) {
  const parts = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`, DEFS, `<rect width="${width}" height="${height}" fill="${background}"/>`];
  for (const k of st.connectors.values()) {
    if (k.opacity <= 0) continue; const [p, q] = connectorPoints(st, k);
    parts.push(`<line x1="${n(p[0])}" y1="${n(p[1])}" x2="${n(q[0])}" y2="${n(q[1])}" stroke="${k.highlight ? HALO : STROKE}" stroke-width="${k.highlight ? 4 : 2}" opacity="${n(k.opacity)}"${k.kind === "line" ? "" : ' marker-end="url(#vss-arrow)"'}/>`);
  }
  const cs = [...st.components.values()].sort((a, b) => (tl.scene.components.get(a.id).order || 0) - (tl.scene.components.get(b.id).order || 0));
  for (const c of cs) {
    if (c.opacity <= 0) continue; const b = c.box; const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    const halo = c.highlight ? `<rect x="${n(b.x - 6)}" y="${n(b.y - 6)}" width="${n(b.w + 12)}" height="${n(b.h + 12)}" rx="12" fill="none" stroke="${HALO}" stroke-width="5" opacity="0.9"/>` : "";
    parts.push(`<g opacity="${n(c.opacity)}"${c.rotation ? ` transform="rotate(${n(c.rotation)} ${n(cx)} ${n(cy)})"` : ""}>${halo}${shapeSVG(c, b)}</g>`);
  }
  for (const tr of st.travellers.values()) parts.push(travellerSVG(tr));
  if (caption) parts.push(`<text x="${width - 12}" y="${height - 12}" text-anchor="end" font-family="system-ui, sans-serif" font-size="13" fill="#7a8794">${(st.t / 1000).toFixed(2)} s</text>`);
  parts.push("</svg>");
  return parts.join("");
}
