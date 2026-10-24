// layout.mjs: the layout and routing scenarios (spec Table 13: "overlaps after layout; connectors crossing components: 0 and 0 on the
// suite"). Twenty-two diagrams of different shapes and sizes, each laid out with one of the editor's layouts through ops.js (the same
// call the planner makes), then checked: no two components overlap, members stay inside their containers, no route crosses a component
// that is not one of its ends, every route is orthogonal and starts and ends on its components' borders, no route fell back to a
// straight line. Plus the layered layout's own measures (crossings on planar graphs, order of a chain) and a re-route after a move.
// Usage: node app/tests/layout.mjs
import { createScene } from "../src/editor/scene.js";
import * as ops from "../src/editor/ops.js";
import { routeCrossings, isOrthogonal, routeAll } from "../src/editor/router.js";
import { layoutNodes } from "../src/editor/layout.js";

let pass = 0, fail = 0; const failures = []; const rows = [];
function check(name, cond, detail = "") { if (cond) pass++; else { fail++; failures.push(`${name}: ${detail}`); } }
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const KINDS = [["box", "process"], ["decision", "decision"], ["database", "data"], ["document", "document"], ["user", "actor"], ["service", "system"], ["note", "note"], ["start", "terminator"], ["circle", "shape"]];

function build({ n, edges, seed = 1, kinds = false, sizes = false, groups = [] }) {
  const s = createScene(); const r = rng(seed); const ids = [];
  for (let i = 0; i < n; i++) {
    const [word, kind] = kinds ? KINDS[i % KINDS.length] : ["box", "process"];
    const size = sizes ? ["small", "medium", "large", "huge", "tiny"][Math.floor(r() * 5)] : "medium";
    const [w, h] = ops.defaultBox(kind, word, size);
    ids.push(ops.create(s, { word, kind, label: `N${i}`, size }, { x: Math.round(r() * 900), y: Math.round(r() * 600), w, h }));
  }
  for (const [a, b] of edges) ops.connect(s, ids[a], ids[b], { kind: "arrow" });
  const gids = [];
  for (const g of groups) gids.push(ops.group(s, g.members.map((m) => (typeof m === "string" ? gids[Number(m.slice(1))] : ids[m])), g.label));
  return { s, ids, gids };
}
function overlapsOf(s) {
  const out = []; const cs = [...s.components.values()];
  const anc = (c) => { const a = new Set(); let p = c.parent; while (p) { a.add(p); p = s.components.get(p)?.parent; } return a; };
  for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
    const a = cs[i], b = cs[j]; if (anc(a).has(b.id) || anc(b).has(a.id)) continue;
    const A = a.box, B = b.box; if (A.x < B.x + B.w && B.x < A.x + A.w && A.y < B.y + B.h && B.y < A.y + A.h) out.push(`${a.id}/${b.id}`);
  }
  for (const c of cs) if (c.parent) { const P = s.components.get(c.parent).box, B = c.box; if (B.x < P.x || B.y < P.y || B.x + B.w > P.x + P.w || B.y + B.h > P.y + P.h) out.push(`${c.id} outside ${c.parent}`); }
  return out;
}
const onBorder = (p, b) => (Math.abs(p.x - b.x) < 0.6 || Math.abs(p.x - b.x - b.w) < 0.6) && p.y >= b.y - 0.6 && p.y <= b.y + b.h + 0.6 || (Math.abs(p.y - b.y) < 0.6 || Math.abs(p.y - b.y - b.h) < 0.6) && p.x >= b.x - 0.6 && p.x <= b.x + b.w + 0.6;
function verify(name, s, routeInfo, t0) {
  const ov = overlapsOf(s); const cr = routeCrossings(s); let bad = [];
  for (const e of s.connectors.values()) {
    const p = e.points || []; const A = s.components.get(e.source).box, B = s.components.get(e.target).box;
    if (p.length < 2 || !isOrthogonal(p) || !onBorder(p[0], A) || !onBorder(p[p.length - 1], B)) bad.push(`${e.id} ${JSON.stringify(p)} ${JSON.stringify(A)} ${JSON.stringify(B)}`);
  }
  check(`${name} overlaps`, ov.length === 0, ov.join(" ")); check(`${name} crossings`, cr.length === 0, JSON.stringify(cr));
  check(`${name} routes`, bad.length === 0, bad.join(" ")); check(`${name} no fallback`, routeInfo.failed.length === 0, routeInfo.failed.join(" "));
  const bends = [...s.connectors.values()].reduce((m, e) => m + Math.max(0, (e.points || []).length - 2), 0);
  rows.push(`${name.padEnd(28)} ${String(s.components.size).padStart(3)} comps ${String(s.connectors.size).padStart(3)} conns  overlaps ${ov.length}  crossings ${cr.length}  bends ${bends}  ${Date.now() - t0} ms`);
}
function scenario(name, spec, kind, after) {
  const t0 = Date.now(); const { s, ids, gids } = build(spec);
  const r = ops.layout(s, spec.subset ? spec.subset.map((i) => ids[i]) : [...s.components.keys()], kind); const info = ops.route(s);
  if (after) after(s, ids, gids, r);
  verify(name, s, info, t0); return s;
}
const chain = (n) => Array.from({ length: n - 1 }, (_, i) => [i, i + 1]);
const randDag = (n, m, seed) => { const r = rng(seed); const out = []; const seen = new Set(); while (out.length < m) { const a = Math.floor(r() * (n - 1)); const b = a + 1 + Math.floor(r() * Math.min(5, n - a - 1)); const k = `${a}>${b}`; if (b < n && !seen.has(k)) { seen.add(k); out.push([a, b]); } } return out; };
const randGraph = (n, m, seed) => { const r = rng(seed); const out = []; const seen = new Set(); while (out.length < m) { const a = Math.floor(r() * n), b = Math.floor(r() * n); const k = `${a}>${b}`; if (a !== b && !seen.has(k)) { seen.add(k); out.push([a, b]); } } return out; };

scenario("01 chain flow_lr", { n: 5, edges: chain(5) }, "flow_lr", (s, ids) => {
  const xs = ids.map((i) => s.components.get(i).box.x); const ys = ids.map((i) => s.components.get(i).box.y);
  check("01 chain order and straight", xs.every((x, i) => !i || x > xs[i - 1]) && ys.every((y) => y === ys[0]), JSON.stringify({ xs, ys }));
  check("01 chain routes are straight", [...s.connectors.values()].every((e) => e.points.length === 2), JSON.stringify([...s.connectors.values()].map((e) => e.points)));
});
scenario("02 chain flow_td", { n: 6, edges: chain(6), kinds: true, sizes: true }, "flow_td");
scenario("03 binary tree", { n: 7, edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]] }, "tree", (s, ids) => {
  const B = (i) => s.components.get(ids[i]).box; check("03 tree parent centred", Math.abs(B(0).x + B(0).w / 2 - (B(1).x + B(1).w / 2 + B(2).x + B(2).w / 2) / 2) <= 1 && B(1).y > B(0).y && B(3).y > B(1).y, "");
});
scenario("04 wide tree", { n: 15, edges: Array.from({ length: 14 }, (_, i) => [Math.floor(i / 3), i + 1]), sizes: true, seed: 4 }, "tree");
scenario("05 diamond DAG", { n: 4, edges: [[0, 1], [0, 2], [1, 3], [2, 3]] }, "flow_td");
scenario("06 cycle", { n: 3, edges: [[0, 1], [1, 2], [2, 0]] }, "flow_lr");
scenario("07 fan-out", { n: 9, edges: Array.from({ length: 8 }, (_, i) => [0, i + 1]) }, "flow_lr");
scenario("08 fan-in", { n: 9, edges: Array.from({ length: 8 }, (_, i) => [i + 1, 0]), kinds: true }, "flow_td");
scenario("09 flowchart with loop", { n: 8, edges: [[0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [5, 1], [5, 6], [6, 7]], kinds: true, sizes: true, seed: 9 }, "flow_td");
scenario("10 disconnected", { n: 10, edges: [[0, 1], [1, 2], [3, 4], [4, 5], [5, 6]] }, "flow_lr");
scenario("11 grid with edges", { n: 20, edges: randGraph(20, 14, 11), sizes: true, seed: 11 }, "grid");
scenario("12 circle ring", { n: 8, edges: [...chain(8), [7, 0]] }, "circle");
scenario("13 row with skips", { n: 6, edges: [[0, 2], [1, 4], [0, 5], [2, 3]] }, "row");
scenario("14 column with skips", { n: 5, edges: [[0, 2], [0, 4], [1, 3]], kinds: true }, "column");
scenario("15 two containers", { n: 8, edges: [[0, 1], [1, 2], [2, 4], [4, 5], [5, 6], [3, 7], [1, 7]], groups: [{ members: [0, 1, 2, 3], label: "Front" }, { members: [4, 5, 6], label: "Back" }] }, "flow_lr");
scenario("16 nested containers", { n: 7, edges: [[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [0, 6]], groups: [{ members: [1, 2], label: "Inner" }, { members: ["g0", 3], label: "Outer" }] }, "flow_td");
scenario("17 random DAG 30", { n: 30, edges: randDag(30, 45, 17), sizes: true, seed: 17 }, "flow_td");
scenario("18 random graph 25", { n: 25, edges: randGraph(25, 34, 18), kinds: true, seed: 18 }, "flow_lr");
scenario("19 self-loop and pair", { n: 4, edges: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 3], [3, 2]] }, "flow_lr");
scenario("20 subset with outsiders", { n: 8, edges: [[0, 1], [1, 2], [2, 3], [5, 6]], subset: [0, 1, 2, 3] }, "flow_lr");
scenario("21 big grid 40", { n: 40, edges: randGraph(40, 30, 21), kinds: true, sizes: true, seed: 21 }, "grid");
scenario("22 tree with containers", { n: 9, edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [6, 7], [6, 8]], groups: [{ members: [3, 4], label: "Left" }] }, "tree");
{ // 23. after a layout, one component is dragged across a route: the routes go around it (spec 8.3, re-route after a move)
  const t0 = Date.now(); const { s, ids } = build({ n: 4, edges: [[0, 1], [1, 2], [2, 3], [0, 3]] }); ops.layout(s, [...s.components.keys()], "flow_lr"); ops.route(s);
  const e = [...s.connectors.values()].find((k) => k.source === ids[0] && k.target === ids[3]);
  let seg = 0, best = -1; for (let i = 0; i + 1 < e.points.length; i++) { const L = Math.abs(e.points[i].x - e.points[i + 1].x) + Math.abs(e.points[i].y - e.points[i + 1].y); if (L > best) { best = L; seg = i; } }
  const mid = { x: (e.points[seg].x + e.points[seg + 1].x) / 2, y: (e.points[seg].y + e.points[seg + 1].y) / 2 };
  const extra = ops.create(s, { word: "box", kind: "process", label: "X" }, { x: mid.x - 30, y: mid.y - 15, w: 60, h: 30 });
  check("23 the dropped box lies on the old route", routeCrossings(s).some((k) => k.component === extra), JSON.stringify(routeCrossings(s)));
  const info = ops.route(s); verify("23 obstacle dropped on a route", s, info, t0);
}
{ // 24. layered layout: no crossings on planar layered graphs; cycles are broken and reported
  const nodes = Array.from({ length: 7 }, (_, i) => ({ id: `n${i}`, w: 100, h: 50 }));
  const tree = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]].map(([a, b]) => ({ source: `n${a}`, target: `n${b}` }));
  const p = layoutNodes("flow_td", nodes.slice().reverse(), tree); check("24 layered tree has no crossings", (p.crossings || 0) === 0, String(p.crossings));
  const k = layoutNodes("flow_lr", nodes.slice(0, 3), [{ source: "n0", target: "n1" }, { source: "n1", target: "n2" }, { source: "n2", target: "n0" }]);
  check("24 cycle broken", k.get("n0").x < k.get("n1").x && k.get("n1").x < k.get("n2").x, JSON.stringify([...k]));
  const d1 = JSON.stringify([...layoutNodes("flow_td", nodes, tree)]), d2 = JSON.stringify([...layoutNodes("flow_td", nodes, tree)]);
  check("24 deterministic", d1 === d2, "");
}
{ // 25. quick routing (live drag preview) also avoids components
  const { s } = build({ n: 12, edges: randGraph(12, 14, 25), seed: 25 }); ops.layout(s, [...s.components.keys()], "grid");
  const info = routeAll(s, { quick: true }); check("25 quick routes cross nothing", routeCrossings(s).length === 0 && info.failed.length === 0, JSON.stringify(routeCrossings(s)));
}

if (process.argv.includes("-v")) console.log(rows.join("\n"));
console.log(`layout: ${pass} checks passed, ${fail} failed (${rows.length} diagrams)`);
if (fail) { console.log(failures.join("\n")); process.exit(1); }
