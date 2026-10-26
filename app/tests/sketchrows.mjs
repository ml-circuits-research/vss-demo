// sketchrows.mjs: the rows of the "Sketch: how it is read" tab (src/ui/sketchrows.js) on synthetic strokes. DOM-free.
import { recognise } from "../src/sketch/recognise.js";
import { scenePass, applyToScene, PASS_OPTIONS } from "../src/sketch/scene_pass.js";
import { createScene } from "../src/editor/scene.js";
import { buildSketchRows, linked, keysForSceneIds, sceneIdsForKeys, passName } from "../src/ui/sketchrows.js";

let pass = 0, fail = 0; const failures = [];
const check = (n, c, d = "") => { if (c) pass++; else { fail++; failures.push(`${n}: ${d}`); } };
let T = 0, SID = 0;
function stroke(poly, step = 3) {
  const pts = []; T += 400;
  for (let k = 0; k + 1 < poly.length; k++) { const [a, b] = [poly[k], poly[k + 1]]; const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)); for (let i = 0; i < n; i++) { pts.push({ x: a[0] + (b[0] - a[0]) * i / n, y: a[1] + (b[1] - a[1]) * i / n, t: T }); T += 4; } }
  const l = poly[poly.length - 1]; pts.push({ x: l[0], y: l[1], t: T }); return { id: SID++, points: pts };
}
const rect = (x, y, w, h) => stroke([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y + 4]]);
const arrow = (a, b) => {
  const s = stroke([a, b]); const L = Math.hypot(b[0] - a[0], b[1] - a[1]); const ux = (a[0] - b[0]) / L, uy = (a[1] - b[1]) / L; const r = (ang) => [b[0] + 16 * (ux * Math.cos(ang) - uy * Math.sin(ang)), b[1] + 16 * (ux * Math.sin(ang) + uy * Math.cos(ang))];
  return [s, stroke([r(0.5), b, r(-0.5)], 1.5)];
};
const zig = (x, y, w, h, n = 4) => stroke(Array.from({ length: n + 1 }, (_, i) => [x + (i % 2 ? w : 0), y + h * i / n]), 2);
const model = (S, scene = null) => { const rec = recognise(S); const res = scenePass(rec, { scene }); const sc = scene || createScene(); const ap = applyToScene(sc, res); return { rec, res, map: ap.map, m: buildSketchRows({ rec, res, map: ap.map, low: PASS_OPTIONS.ambiguousMargin }) }; };
const text = (x) => JSON.stringify(x);

{ // two boxes and an arrow
  SID = 0; const { m, map } = model([rect(100, 100, 140, 70), rect(400, 100, 140, 70), ...arrow([244, 135], [396, 135])]);
  check("1 header names the pass and says not VSS", /rule-based pass/.test(m.header) && /NOT VSS/.test(m.header) && m.pass === "rule-based pass", m.header);
  check("1 left: one row per group", m.left.length === 3 && m.left.map((r) => r.kind).join() === "rectangle,rectangle,arrow", text(m.left.map((r) => r.kind)));
  const r1 = m.left[0];
  check("1 left: ranked kinds with scores and margin", r1.candidates.length === 6 && r1.candidates[0].score >= r1.candidates[1].score && typeof r1.margin === "number" && r1.second, text(r1.candidates));
  check("1 left: features with the prototype and $P", r1.features.some((f) => f.name === "hull fill" && f.proto) && r1.p.length >= 2 && r1.p[0].d <= r1.p[1].d && /closed/.test(r1.reason), text(r1.features));
  const a = m.left[2];
  check("1 left: connector features", a.features.some((f) => f.name === "span (px)") && a.features.some((f) => /head score/.test(f.name)) && a.nStrokes === 2, text(a.features));
  const comps = m.right.filter((r) => r.type === "component"), con = m.right.find((r) => r.type === "connector");
  check("1 right: two components, one connector", comps.length === 2 && con, text(m.right.map((r) => r.type)));
  check("1 right: two best candidates and the margin", comps[0].candidates.length === 2 && typeof comps[0].margin === "number" && !comps[0].ambiguous, text(comps[0]));
  check("1 right: connector ends with candidates, distance margin and tolerance", con.ends.length === 2 && con.ends[0].candidates.length === 2 && typeof con.ends[0].candidates[0].d === "number" && con.ends[0].margin > 0 && con.attachTol >= 30, text(con.ends));
  check("1 right: the circuit", /@w\d+ connect/.test(m.circuit) && /head=box/.test(m.circuit));
  check("1 link: the group, its component and the scene id are one", linked(m, ["s1"]).length === 2 && linked(m, [map.get("s1")]).length === 1 && linked(m, ["s3"]).length === 2, text(linked(m, ["s1"]).map((r) => r.side + r.id)));
  check("1 link: scene ids <-> keys", text(sceneIdsForKeys(["s1"], map)) === text([map.get("s1")]) && keysForSceneIds([map.get("s1")], map).includes("s1"));
}
{ // a scribble over a box
  SID = 0; const { m } = model([rect(100, 100, 140, 70), rect(400, 100, 140, 70), ...arrow([244, 135], [396, 135]), zig(95, 95, 150, 80, 8)]);
  const sc = m.left.find((r) => r.kind === "scribble"), del = m.right.find((r) => r.type === "deletion");
  check("2 scribble marked and deletion row linked to both", sc && sc.flag === "scribble" && del && del.keys.includes(sc.id) && del.keys.includes("s1"), text(m.right.map((r) => [r.type, r.keys])));
  check("2 clicking the scribble lights the deletion and the deleted box", linked(m, [sc.id]).length >= 2 && linked(m, ["s1"]).some((r) => r.side === "right"));
}
{ // dangling arrow: a question row, not a guess
  SID = 0; const { m } = model([rect(100, 100, 120, 60), ...arrow([224, 130], [600, 400])]);
  const q = m.right.find((r) => r.type === "question");
  check("3 dangling connector: a row with the question", q && q.questions.some((x) => x.kind === "dangling") && /asked instead of guessed/.test(q.decision) && q.keys.includes("s2"), text(m.right));
}
{ // an unknown blob (a star) and a label scribble inside a box
  SID = 0; const pts = Array.from({ length: 11 }, (_, i) => { const r = i % 2 ? 22 : 55; return [300 + r * Math.sin(i * Math.PI / 5), 300 - r * Math.cos(i * Math.PI / 5)]; });
  const { m } = model([stroke(pts, 2)]);
  const u = m.left[0], c = m.right.find((r) => r.type === "component");
  check("4 unknown blob marked on the left, kept as a sketch with a question on the right", u.flag === "unknown blob" && /blob|far from/.test(u.reason) && c && /kept as a drawing/.test(c.decision) && c.questions.some((q) => q.kind === "unknown"), text([u.flag, c]));
  SID = 0; const r2 = model([rect(100, 100, 160, 80), zig(150, 132, 60, 14, 3)]);
  const sc = r2.m.left.find((r) => r.kind === "scribble"), box = r2.m.right.find((r) => r.type === "component");
  check("4 label scribble lights the box", box.labelMark && box.keys.includes(sc.id) && box.questions.some((q) => q.kind === "label"), text(box));
}
{ // containment and an ambiguous shape
  SID = 0; const { m } = model([rect(100, 100, 120, 60), rect(60, 50, 440, 160)]);
  const g = m.right.find((r) => /container/.test(r.decision)), inner = m.right.find((r) => r.parent);
  check("5 containment: container and member rows", g && g.members.length === 1 && inner && inner.parent === g.title, text(m.right.map((r) => [r.title, r.parent, r.members])));
  const rec = { groups: [{ id: "s1", kind: "rectangle", strokes: [0], box: { x: 100, y: 100, w: 120, h: 60 }, margin: 0.06, candidates: [{ kind: "rectangle", score: 0.53 }, { kind: "rounded_rectangle", score: 0.47 }] }] };
  const res = scenePass(rec); const mm = buildSketchRows({ rec, res, low: PASS_OPTIONS.ambiguousMargin });
  check("5 ambiguity: held open with the question", mm.right[0].ambiguous && mm.right[0].questions.some((q) => q.kind === "which-shape") && mm.left[0].margin === 0.06 && mm.left[0].features.length === 0);
}
{ // a connector to an existing component
  const sc = createScene(); sc.components.set("c1", { id: "c1", word: "database", kind: "data", label: "Orders", box: { x: 500, y: 300, w: 130, h: 60 }, parent: null, order: 1 }); sc.counter = 1;
  SID = 0; const { m } = model([rect(150, 300, 130, 60), ...arrow([284, 330], [496, 330])], sc);
  const con = m.right.find((r) => r.type === "connector");
  check("6 connector to an existing component", con && /c1/.test(con.decision), text(con));
}
check("7 passName", passName({ active: "FPE scene reader (x)" }) === "FPE scene reader" && passName({ active: "rule-based geometry pass (spec)" }) === "rule-based pass");
console.log(`sketchrows: ${pass} pass, ${fail} fail`);
for (const f of failures) console.log(`  FAIL ${f}`);
process.exit(fail ? 1 : 0);
