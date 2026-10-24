// characters.js: a few named characters and the repertoire of named motions (spec 19.5). A character is a component with parts (a robot:
// head, antenna, body, two arms, two legs; a figure: head, body, arms, legs; a car: chassis, cabin, two wheels); a motion is a
// parameterised animation written once here, as a convention of the world: walk (to a target), jump, wave, turn (towards), nod, shake,
// bounce, grow, shrink. The drawings are simple SVG shapes of our own design, no third-party characters. The reader never invents a
// motion: a motion the repertoire lacks is reported as unknown. DOM-free: drawing returns SVG text.
//
// The displacement of the whole character (jump, bounce, shake, the walk's path, grow / shrink scale) belongs to the timeline's state
// (player.js, the same rules as the reference semantics); this file gives the POSE of the parts inside the box (arm, head and leg angles,
// wheel turn, facing) as a function of the motion's phase f in [0, 1).
export const CHARACTERS = {
  robot: { parts: ["head", "antenna", "body", "left arm", "right arm", "left leg", "right leg"], size: [60, 90], about: "a square-headed robot" },
  figure: { parts: ["head", "body", "left arm", "right arm", "left leg", "right leg"], size: [50, 90], about: "a stick figure" },
  car: { parts: ["chassis", "cabin", "front wheel", "back wheel"], size: [110, 60], about: "a small car" },
};
export const ALIASES = { person: "figure" };
export const MOTIONS = {
  walk: { params: ["target"], about: "walks to the side of a target (legs swing, two steps per second)" },
  jump: { params: [], about: "jumps 40 px up and lands, once per cycle" },
  wave: { params: [], about: "raises the right arm and waves it twice per cycle" },
  turn: { params: ["target"], about: "turns to face a target" },
  nod: { params: [], about: "tilts the head down and back" },
  shake: { params: [], about: "shakes from side to side, 6 px, three times per cycle" },
  bounce: { params: [], about: "bounces 20 px, twice per cycle" },
  grow: { params: [], about: "grows to 1.25 times its size and stays" },
  shrink: { params: [], about: "shrinks to 0.8 times its size and stays" },
};
export const REPERTOIRE = { characters: Object.keys(CHARACTERS), aliases: ALIASES, motions: Object.keys(MOTIONS) };

export function characterKind(word) { const w = ALIASES[word] || word; return CHARACTERS[w] ? w : null; }
export function motion(name) {
  if (MOTIONS[name]) return { ok: true, name, ...MOTIONS[name] };
  return { ok: false, name, reason: `"${name}" is not a motion of the repertoire (${Object.keys(MOTIONS).join(", ")}); new motions are added by the world's authors` };
}

// the pose of the parts at phase f of a motion (angles in degrees); facing = 1 (right) or -1 (left)
export function pose(event, f = 0, { facing = 1, active = true } = {}) {
  const p = { armL: 10, armR: -10, head: 0, legL: 0, legR: 0, wheel: 0, facing };
  if (!active) return p;
  const s = Math.sin(2 * Math.PI * f);
  if (event === "walk") { p.legL = 25 * Math.sin(4 * Math.PI * f); p.legR = -p.legL; p.armL = 10 - 15 * Math.sin(4 * Math.PI * f); p.armR = -10 + 15 * Math.sin(4 * Math.PI * f); p.wheel = 720 * f; }
  else if (event === "wave") { p.armR = -150 + 30 * Math.sin(4 * Math.PI * f); }
  else if (event === "nod") { p.head = 20 * Math.sin(Math.PI * f); }
  else if (event === "jump") { p.armL = 10 + 60 * Math.sin(Math.PI * f); p.armR = -p.armL; p.legL = 15 * Math.sin(Math.PI * f); p.legR = -p.legL; }
  else if (event === "bounce") { p.legL = 10 * Math.abs(s); p.legR = -p.legL; }
  return p;
}

const rot = (deg, x, y) => `rotate(${+deg.toFixed(2)} ${+x.toFixed(2)} ${+y.toFixed(2)})`;
const n = (v) => +v.toFixed(2);
// SVG text for a character in its box (x, y, w, h), in a colour, with a pose
export function drawCharacter(kind, box, p = pose(null), { color = "#4a6fa5", stroke = "#1f2a3a", opacity = 1 } = {}) {
  const k = characterKind(kind) || "robot"; const { x, y, w, h } = box; const cx = x + w / 2;
  const flip = p.facing < 0 ? ` transform="translate(${n(2 * cx)} 0) scale(-1 1)"` : "";
  let g = "";
  if (k === "robot") {
    const hs = Math.min(w * 0.55, h * 0.3), hx = cx - hs / 2, hy = y + h * 0.06, by = hy + hs + 4, bh = h * 0.36, bw = w * 0.7, bx = cx - bw / 2, sy = by + 6, ly = by + bh;
    g += `<g ${`transform="${rot(p.head, cx, hy + hs)}"`}><line x1="${n(cx)}" y1="${n(hy)}" x2="${n(cx)}" y2="${n(hy - h * 0.06)}" stroke="${stroke}" stroke-width="2"/><circle cx="${n(cx)}" cy="${n(hy - h * 0.06)}" r="3" fill="${color}"/>`
      + `<rect x="${n(hx)}" y="${n(hy)}" width="${n(hs)}" height="${n(hs)}" rx="4" fill="${color}" stroke="${stroke}" stroke-width="2"/>`
      + `<circle cx="${n(cx - hs * 0.2)}" cy="${n(hy + hs * 0.45)}" r="2.5" fill="#fff"/><circle cx="${n(cx + hs * 0.2)}" cy="${n(hy + hs * 0.45)}" r="2.5" fill="#fff"/></g>`;
    g += `<rect x="${n(bx)}" y="${n(by)}" width="${n(bw)}" height="${n(bh)}" rx="5" fill="${color}" stroke="${stroke}" stroke-width="2"/>`;
    g += `<line x1="${n(bx)}" y1="${n(sy)}" x2="${n(bx)}" y2="${n(sy + bh * 0.8)}" stroke="${stroke}" stroke-width="4" stroke-linecap="round" transform="${rot(p.armL, bx, sy)}"/>`;
    g += `<line x1="${n(bx + bw)}" y1="${n(sy)}" x2="${n(bx + bw)}" y2="${n(sy + bh * 0.8)}" stroke="${stroke}" stroke-width="4" stroke-linecap="round" transform="${rot(p.armR, bx + bw, sy)}"/>`;
    g += `<line x1="${n(cx - bw * 0.25)}" y1="${n(ly)}" x2="${n(cx - bw * 0.25)}" y2="${n(y + h)}" stroke="${stroke}" stroke-width="5" stroke-linecap="round" transform="${rot(p.legL, cx - bw * 0.25, ly)}"/>`;
    g += `<line x1="${n(cx + bw * 0.25)}" y1="${n(ly)}" x2="${n(cx + bw * 0.25)}" y2="${n(y + h)}" stroke="${stroke}" stroke-width="5" stroke-linecap="round" transform="${rot(p.legR, cx + bw * 0.25, ly)}"/>`;
  } else if (k === "figure") {
    const r = Math.min(w, h) * 0.16, hy = y + r + 2, ny = hy + r, hip = y + h * 0.62, sh = ny + h * 0.08;
    g += `<circle cx="${n(cx)}" cy="${n(hy)}" r="${n(r)}" fill="none" stroke="${stroke}" stroke-width="2.5" transform="${rot(p.head, cx, ny)}"/>`;
    g += `<line x1="${n(cx)}" y1="${n(ny)}" x2="${n(cx)}" y2="${n(hip)}" stroke="${stroke}" stroke-width="2.5"/>`;
    g += `<line x1="${n(cx)}" y1="${n(sh)}" x2="${n(cx)}" y2="${n(sh + h * 0.26)}" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" transform="${rot(p.armL + 20, cx, sh)}"/>`;
    g += `<line x1="${n(cx)}" y1="${n(sh)}" x2="${n(cx)}" y2="${n(sh + h * 0.26)}" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" transform="${rot(p.armR - 20, cx, sh)}"/>`;
    g += `<line x1="${n(cx)}" y1="${n(hip)}" x2="${n(cx)}" y2="${n(y + h)}" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" transform="${rot(p.legL + 12, cx, hip)}"/>`;
    g += `<line x1="${n(cx)}" y1="${n(hip)}" x2="${n(cx)}" y2="${n(y + h)}" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" transform="${rot(p.legR - 12, cx, hip)}"/>`;
  } else {
    const ch = h * 0.42, cy0 = y + h * 0.35, wr = h * 0.17, wy = y + h - wr;
    g += `<path d="M ${n(x + w * 0.25)} ${n(cy0)} L ${n(x + w * 0.35)} ${n(y + h * 0.08)} L ${n(x + w * 0.7)} ${n(y + h * 0.08)} L ${n(x + w * 0.8)} ${n(cy0)} Z" fill="#dfe8f3" stroke="${stroke}" stroke-width="2"/>`;
    g += `<rect x="${n(x)}" y="${n(cy0)}" width="${n(w)}" height="${n(ch)}" rx="8" fill="${color}" stroke="${stroke}" stroke-width="2"/>`;
    for (const wx of [x + w * 0.24, x + w * 0.76]) g += `<g transform="${rot(p.wheel, wx, wy)}"><circle cx="${n(wx)}" cy="${n(wy)}" r="${n(wr)}" fill="#333" stroke="${stroke}" stroke-width="2"/><line x1="${n(wx - wr * 0.7)}" y1="${n(wy)}" x2="${n(wx + wr * 0.7)}" y2="${n(wy)}" stroke="#bbb" stroke-width="2"/></g>`;
  }
  return `<g class="character ${k}" opacity="${n(opacity)}"${flip}>${g}</g>`;
}
