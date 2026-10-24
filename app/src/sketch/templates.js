// templates.js: the point-cloud templates of the closed shapes for the $P matcher in recognise.js, generated here from ideal geometry
// (no third-party templates, no recorded strokes). Each template is a list of strokes in the unit square (x, y in [0, 1], y down);
// the matcher normalizes the drawing to the unit square the same way (non-uniform scaling, so one template covers every aspect ratio).
// A kind may have several templates (rounding radii, cap heights, triangle orientations); the matcher takes the best one.

const arc = (cx, cy, rx, ry, a0, a1, n) => Array.from({ length: n }, (_, i) => {
  const a = a0 + (a1 - a0) * i / (n - 1); return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
});
const poly = (vs, per = 16) => {
  const out = [];
  for (let k = 0; k + 1 < vs.length; k++) for (let i = 0; i < per; i++) {
    const f = i / per; out.push({ x: vs[k][0] + f * (vs[k + 1][0] - vs[k][0]), y: vs[k][1] + f * (vs[k + 1][1] - vs[k][1]) });
  }
  out.push({ x: vs[vs.length - 1][0], y: vs[vs.length - 1][1] });
  return out;
};
function roundedRect(r, ry = r) {
  return [...arc(1 - r, ry, r, ry, -Math.PI / 2, 0, 8), ...arc(1 - r, 1 - ry, r, ry, 0, Math.PI / 2, 8),
    ...arc(r, 1 - ry, r, ry, Math.PI / 2, Math.PI, 8), ...arc(r, ry, r, ry, Math.PI, 1.5 * Math.PI, 8), { x: 1 - r, y: 0 }];
}
function cylinder(c) {
  return [arc(0.5, c, 0.5, c, 0, 2 * Math.PI, 40),
    [...poly([[0, c], [0, 1 - c]], 12), ...arc(0.5, 1 - c, 0.5, c, Math.PI, 0, 24), ...poly([[1, 1 - c], [1, c]], 12)]];
}

export const TEMPLATES = [
  { kind: "rectangle", strokes: [poly([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]])] },
  { kind: "rounded_rectangle", strokes: [roundedRect(0.2, 0.3)] },
  { kind: "rounded_rectangle", strokes: [roundedRect(0.12, 0.35)] },
  { kind: "rounded_rectangle", strokes: [roundedRect(0.3, 0.3)] },
  { kind: "ellipse", strokes: [arc(0.5, 0.5, 0.5, 0.5, 0, 2 * Math.PI, 64)] },
  { kind: "diamond", strokes: [poly([[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5], [0.5, 0]])] },
  { kind: "triangle", strokes: [poly([[0.5, 0], [1, 1], [0, 1], [0.5, 0]])] },
  { kind: "triangle", strokes: [poly([[0, 0], [1, 0], [0.5, 1], [0, 0]])] },
  { kind: "cylinder", strokes: cylinder(0.14) },
  { kind: "cylinder", strokes: cylinder(0.2) },
];

export const CLOSED_KINDS = ["rectangle", "rounded_rectangle", "ellipse", "diamond", "cylinder", "triangle"];
