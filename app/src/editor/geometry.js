// geometry.js: positions from the frame's slots (spec 8.2). Linear constraints solved by Kiwi (Cassowary, app/vendor/kiwi, BSD-3):
// the user's explicit request is strong, staying where one is is medium, staying inside the canvas is required. Non-overlap is not
// linear: a placement search tries the solved position, then the nearest free positions in the direction of the relation, and reports
// a move it had to make. Every placement returns the constraints it solved, as text, for the explanation panel.
import * as kiwi from "../../vendor/kiwi/kiwi.js";
import { overlaps } from "./scene.js";

const REGION_CELL = { top_left: [0, 0], top: [1, 0], top_right: [2, 0], left_side: [0, 1], center: [1, 1], right_side: [2, 1], bottom_left: [0, 2], bottom: [1, 2], bottom_right: [2, 2] };
export const GAP = 30;
const FRACTION = { half: 0.5, third: 1 / 3, quarter: 0.25 };

function solve(build) {
  const s = new kiwi.Solver(); const x = new kiwi.Variable("x"), y = new kiwi.Variable("y"); const text = [];
  const eq = (v, e, strength, label) => { s.addConstraint(new kiwi.Constraint(new kiwi.Expression(v, -e), kiwi.Operator.Eq, undefined, strength)); text.push(label); };
  const ge = (v, e, strength, label) => { s.addConstraint(new kiwi.Constraint(new kiwi.Expression(v, -e), kiwi.Operator.Ge, undefined, strength)); text.push(label); };
  const le = (v, e, strength, label) => { s.addConstraint(new kiwi.Constraint(new kiwi.Expression(v, -e), kiwi.Operator.Le, undefined, strength)); text.push(label); };
  build({ x, y, eq, ge, le, S: kiwi.Strength });
  s.updateVariables();
  return { x: Math.round(x.value()), y: Math.round(y.value()), constraints: text };
}

// target box for `box` (w, h known; x, y current or undefined) given the frame's placement slots; landmark = the landmark's box or null
export function place(scene, box, slots, landmark, { moving = null } = {}) {
  const W = scene.width, H = scene.height; const { w, h } = box; const amt = slots.amount != null && slots.unit !== "percent" ? Number(slots.amount) : null;
  const r = solve(({ x, y, eq, ge, le, S }) => {
    ge(x, 0, S.required, "x >= 0"); le(x, W - w, S.required, `x <= ${W - w} (inside the canvas)`); ge(y, 0, S.required, "y >= 0"); le(y, H - h, S.required, `y <= ${H - h}`);
    if (box.x != null) { eq(x, box.x, S.weak, `x = ${box.x} (stay)`); eq(y, box.y, S.weak, `y = ${box.y} (stay)`); }
    if (slots.region) {
      const [cx, cy] = REGION_CELL[slots.region]; const tx = Math.round((cx + 0.5) * W / 3 - w / 2), ty = Math.round((cy + 0.5) * H / 3 - h / 2);
      eq(x, tx, S.strong, `centre x = ${tx + w / 2} (${slots.region})`); eq(y, ty, S.strong, `centre y = ${ty + h / 2} (${slots.region})`);
    } else if (slots.relation && landmark) {
      const L = landmark; const g = amt ?? GAP; const lcx = L.x + L.w / 2, lcy = L.y + L.h / 2;
      if (slots.relation === "below") { eq(y, L.y + L.h + g, S.strong, `top = landmark.bottom + ${g}`); eq(x, lcx - w / 2, S.medium, "centre x = landmark.centre x (vertical relation)"); }
      if (slots.relation === "above") { eq(y, L.y - g - h, S.strong, `bottom = landmark.top - ${g}`); eq(x, lcx - w / 2, S.medium, "centre x = landmark.centre x"); }
      if (slots.relation === "right_of" || slots.relation === "next_to") { eq(x, L.x + L.w + g, S.strong, `left = landmark.right + ${g}`); eq(y, lcy - h / 2, S.medium, "centre y = landmark.centre y (horizontal relation)"); }
      if (slots.relation === "left_of") { eq(x, L.x - g - w, S.strong, `right = landmark.left - ${g}`); eq(y, lcy - h / 2, S.medium, "centre y = landmark.centre y"); }
      if (slots.relation === "inside") { eq(x, lcx - w / 2, S.strong, "centre = landmark.centre"); eq(y, lcy - h / 2, S.strong, "centre = landmark.centre"); }
    } else if (slots.fraction && slots.anchor && box.x != null) {
      const f = FRACTION[slots.fraction]; const cx = box.x + w / 2, cy = box.y + h / 2;
      const ax = { right_edge: W, left_edge: 0 }[slots.anchor], ay = { top_edge: 0, bottom_edge: H }[slots.anchor];
      if (ax != null) eq(x, Math.round(cx + f * (ax - cx) - w / 2), S.strong, `centre x = ${Math.round(cx)} + ${slots.fraction} x (${ax} - ${Math.round(cx)})`);
      if (ay != null) eq(y, Math.round(cy + f * (ay - cy) - h / 2), S.strong, `centre y = ${Math.round(cy)} + ${slots.fraction} x (${ay} - ${Math.round(cy)})`);
    } else if (slots.anchor) {
      const a = slots.anchor;
      if (a === "right_edge") eq(x, W - w, S.strong, "right = canvas.right"); if (a === "left_edge") eq(x, 0, S.strong, "left = canvas.left");
      if (a === "top_edge") eq(y, 0, S.strong, "top = canvas.top"); if (a === "bottom_edge") eq(y, H - h, S.strong, "bottom = canvas.bottom");
    } else if (slots.direction && box.x != null) {
      const d = amt ?? 40; const dx = { left: -d, right: d }[slots.direction] || 0, dy = { up: -d, down: d }[slots.direction] || 0;
      eq(x, box.x + dx, S.strong, `x = ${box.x} ${dx >= 0 ? "+" : "-"} ${Math.abs(dx)}`); eq(y, box.y + dy, S.strong, `y = ${box.y} ${dy >= 0 ? "+" : "-"} ${Math.abs(dy)}`);
    } else if (box.x == null) {                                        // no place given: the next free place to the right (a declared default)
      const others = [...scene.components.values()]; const right = others.reduce((m, c) => Math.max(m, c.box.x + c.box.w), 0);
      eq(x, others.length ? right + GAP : 60, S.strong, "no place given: next free place to the right"); eq(y, others.length ? others[others.length - 1].box.y : 60, S.medium, "same row as the last component");
    }
  });
  // non-overlap: search along the relation's direction (or downwards), report a move
  const step = { below: [0, 1], above: [0, -1], left_of: [-1, 0], right_of: [1, 0], next_to: [1, 0] }[slots.relation] || [0, 1];
  let cand = { x: r.x, y: r.y, w, h }, moved = 0;
  const blockers = () => [...scene.components.values()].filter((c) => c.id !== moving && !(slots.relation === "inside" && landmark && c.box === landmark) && c.kind !== "container" && overlaps(cand, c.box, 8));
  while (blockers().length && moved < 20) { cand = { ...cand, x: cand.x + step[0] * (w / 2 + 10), y: cand.y + step[1] * (h / 2 + 10) }; moved++; }
  const note = moved ? `placed ${moved * Math.round(step[0] ? w / 2 + 10 : h / 2 + 10)} px further ${({ "0,1": "down", "0,-1": "up", "-1,0": "left", "1,0": "right" })[step.join()]} to avoid an overlap` : null;
  return { x: Math.max(0, Math.min(W - w, cand.x)), y: Math.max(0, Math.min(H - h, cand.y)), constraints: r.constraints, note };
}
