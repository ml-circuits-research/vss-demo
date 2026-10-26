// scenarios.mjs: the planner and solver scenario suite (spec Table 13: "scripted diagrams and requests with the expected diagram after;
// 100% pass; computed positions within 1 px"). Frames are written in the reader's format (tool/sop/infer.py, mirrored by vss.js), so the
// suite tests the planner, the resolver and the geometry independently of the reader; the end-to-end version (text -> reader -> plan)
// runs the same scenarios from their sentences once a trained model is exported (app/READER.md).
// Usage: node app/tests/scenarios.mjs
import { createScene } from "../src/editor/scene.js";
import { plan, execute } from "../src/editor/planner.js";

const E = (head, attr = null, det = "the") => ["entity", head, attr ? (attr.startsWith("!") ? ["negword", attr.slice(1)] : ["word", attr]) : null, det];
const W = (w) => ["word", w];
const F = (event, roles = {}, neg = false) => ({ event, roles, neg, speakers: [] });
let pass = 0, fail = 0; const failures = [];
function check(name, cond, detail) { if (cond) pass++; else { fail++; failures.push(`${name}: ${detail}`); } }
const byLabel = (s, l) => [...s.components.values()].find((c) => c.label === l);
const run = (s, f, info) => { const p = plan(s, f, info); const r = execute(s, p); return { p, r }; };

{ // 1. create with a label in a region; the solver centres it in the region cell
  const s = createScene(); run(s, F("create", { object: E("database", null, "a"), text: W("orders"), region: W("top_left") }), { labels: { orders: "Orders" } });
  const c = byLabel(s, "Orders"); check("1 create region", c && c.box.x + c.box.w / 2 === 200 && c.box.y + c.box.h / 2 === Math.round(800 / 6) + 0 || (c && Math.abs(c.box.y + c.box.h / 2 - 800 / 6) <= 1), JSON.stringify(c && c.box));
}
{ // 2. "put a yellow note 10 px below the database": top = landmark.bottom + 10, centre x equal
  const s = createScene(); run(s, F("create", { object: E("database", null, "a"), text: W("orders"), region: W("center") }), { labels: { orders: "Orders" } });
  const db = byLabel(s, "Orders");
  run(s, F("place", { object: E("note", "yellow", "a"), relation: W("below"), landmark: E("database"), amount: W("10"), unit: W("px") }), { numbers: { 10: 10 } });
  const n = [...s.components.values()].find((c) => c.word === "note");
  check("2 below + amount", n && n.box.y === db.box.y + db.box.h + 10 && Math.abs(n.box.x + n.box.w / 2 - (db.box.x + db.box.w / 2)) <= 1 && n.color === "yellow", JSON.stringify({ n: n && n.box, db: db.box }));
}
{ // 3. ambiguity: two circles, "move the circle" -> a question, nothing moves
  const s = createScene(); run(s, F("create", { object: E("circle", null, "a") })); run(s, F("create", { object: E("circle", null, "a") }));
  const before = JSON.stringify([...s.components.values()].map((c) => c.box));
  const { p } = run(s, F("move", { object: E("circle"), direction: W("left") }));
  check("3 ambiguous", p.questions.some((q) => q.kind === "which") && JSON.stringify([...s.components.values()].map((c) => c.box)) === before, JSON.stringify(p.questions));
}
{ // 4. no match: "connect the cache to the database" with no cache -> a question
  const s = createScene(); run(s, F("create", { object: E("database", null, "a") }));
  const { p } = run(s, F("connect", { source: E("cache"), target: E("database") }));
  check("4 no match", p.questions.some((q) => q.kind === "no-match") && s.connectors.size === 0, JSON.stringify(p.questions));
}
{ // 5. prohibition -> lock; a later move of that component is blocked, others move
  const s = createScene(); run(s, F("create", { object: E("title", null, "a"), text: W("t") }), { labels: { t: "T" } }); run(s, F("create", { object: E("box", null, "a") }));
  run(s, F("move", { object: E("title") }, true));
  const { p } = run(s, F("move", { object: E("title"), direction: W("down") }));
  check("5 lock blocks", s.locks.length === 1 && p.blocked.length === 1, JSON.stringify({ locks: s.locks, blocked: p.blocked }));
  const { p: p2 } = run(s, F("move", { object: E("box"), direction: W("down") }));
  check("5 lock leaves others", p2.blocked.length === 0 && p2.steps.length === 1, JSON.stringify(p2));
}
{ // 6. negated attribute: delete all the boxes that are not blue
  const s = createScene(); run(s, F("create", { object: E("box", "blue", "a") })); run(s, F("create", { object: E("box", "red", "a") })); run(s, F("create", { object: E("box", "green", "a") }));
  run(s, F("delete", { object: E("boxes", "!blue", "all") }));
  check("6 negated attribute", s.components.size === 1 && [...s.components.values()][0].color === "blue", JSON.stringify([...s.components.values()].map((c) => c.color)));
}
{ // 7. pairing: connect each step to the next, by creation order
  const s = createScene(); for (let i = 0; i < 4; i++) run(s, F("create", { object: E("step", null, "a") }));
  run(s, F("connect", { source: E("step", null, "each"), pairing: W("to_next") }));
  const es = [...s.connectors.values()].map((e) => `${e.source}>${e.target}`);
  check("7 pairing", es.join(",") === "c1>c2,c2>c3,c3>c4", es.join(","));
}
{ // 8. pronoun rule: "make it red" after creating a box
  const s = createScene(); run(s, F("create", { object: E("box", null, "a") })); run(s, F("change", { object: E("it", null, null), color: W("red") }));
  check("8 it", [...s.components.values()][0].color === "red", JSON.stringify([...s.components.values()][0]));
}
{ // 9. fraction + anchor: halfway to the right edge
  const s = createScene(); run(s, F("create", { object: E("gateway", null, "a"), region: W("left_side") }));
  const g = [...s.components.values()][0]; const cx = g.box.x + g.box.w / 2;
  run(s, F("move", { object: E("gateway"), fraction: W("half"), anchor: W("right_edge") }));
  check("9 fraction", Math.abs(g.box.x + g.box.w / 2 - Math.round(cx + 0.5 * (1200 - cx))) <= 1, `${g.box.x + g.box.w / 2} vs ${cx + 0.5 * (1200 - cx)}`);
}
{ // 10. quantity: add three boxes; they do not overlap
  const s = createScene(); run(s, F("create", { object: E("boxes", null, null), quantity: W("3") }), { numbers: { 3: 3 } });
  const cs = [...s.components.values()]; const ov = cs.some((a, i) => cs.some((b, j) => i < j && a.box.x < b.box.x + b.box.w && b.box.x < a.box.x + a.box.w && a.box.y < b.box.y + b.box.h && b.box.y < a.box.y + a.box.h));
  check("10 quantity", cs.length === 3 && !ov, JSON.stringify(cs.map((c) => c.box)));
}
{ // 11. group with a label, then ungroup
  const s = createScene(); run(s, F("create", { object: E("service", null, "a") })); run(s, F("create", { object: E("service", null, "a") }));
  run(s, F("group", { object: E("services", null, "the"), text: W("backend") }), { labels: { backend: "Backend" } });
  const g = byLabel(s, "Backend"); check("11 group", g && g.kind === "container" && [...s.components.values()].filter((c) => c.parent === g.id).length === 2, JSON.stringify(g));
  run(s, F("ungroup", { object: E("container") })); check("11 ungroup", !byLabel(s, "Backend") && [...s.components.values()].every((c) => !c.parent), "");
}
{ // 12. arrange as a flow from left to right: levels by the connectors
  const s = createScene(); for (const l of ["a", "b", "c"]) run(s, F("create", { object: E("step", null, "a"), text: W(l) }), { labels: { [l]: l.toUpperCase() } });
  run(s, F("connect", { source: E("step", null, "each"), pairing: W("to_next") }));
  run(s, F("arrange", { object: E("everything", null, null), layout: W("flow_lr") }));
  const A = byLabel(s, "A"), B = byLabel(s, "B"), C = byLabel(s, "C");
  check("12 flow", A.box.x < B.box.x && B.box.x < C.box.x && A.box.y === B.box.y, JSON.stringify([A.box, B.box, C.box]));
}
{ // 13. undo restores the scene; redo re-applies
  const s = createScene(); run(s, F("create", { object: E("box", null, "a") })); run(s, F("delete", { object: E("box") }));
  check("13 delete", s.components.size === 0, ""); run(s, F("undo")); check("13 undo", s.components.size === 1, ""); run(s, F("redo")); check("13 redo", s.components.size === 0, "");
}
{ // 14. align horizontally and distribute with a fixed gap
  const s = createScene(); run(s, F("create", { object: E("box", null, "a"), region: W("top_left") })); run(s, F("create", { object: E("box", null, "a"), region: W("bottom_right") }));
  run(s, F("align", { object: E("boxes", null, "all"), axis: W("horizontally") })); const cs = [...s.components.values()];
  check("14 align", Math.abs((cs[0].box.y + cs[0].box.h / 2) - (cs[1].box.y + cs[1].box.h / 2)) <= 1, JSON.stringify(cs.map((c) => c.box)));
  run(s, F("distribute", { object: E("boxes", null, "all"), amount: W("40"), unit: W("px") }), { numbers: { 40: 40 } });
  const xs = [...s.components.values()].sort((a, b) => a.box.x - b.box.x); check("14 distribute", xs[1].box.x - (xs[0].box.x + xs[0].box.w) === 40, JSON.stringify(xs.map((c) => c.box)));
}
{ // 15. change size by percent, and a label used as the head
  const s = createScene(); run(s, F("create", { object: E("box", null, "a"), text: W("auth") }), { labels: { auth: "auth" } });
  const w0 = byLabel(s, "auth").box.w; run(s, F("change", { object: ["entity", "auth", null, null], amount: W("50"), unit: W("percent"), size: W("bigger") }), { numbers: { 50: 50 } });
  check("15 percent + label head", byLabel(s, "auth").box.w === Math.round(w0 * 1.5), `${byLabel(s, "auth").box.w} vs ${w0 * 1.5}`);
}
{ // 16. connect with the line in its own role `edge` (D17): "connect the box to the cache with a dashed arrow"; the older frame (line in `object`) still works
  const s = createScene(); run(s, F("create", { object: E("box", null, "a") })); run(s, F("create", { object: E("cache", null, "a") }));
  run(s, F("connect", { source: E("box"), target: E("cache"), edge: E("arrow", "dashed", "a") }));
  const k = [...s.connectors.values()];
  check("16 edge role", k.length === 1 && k[0].style === "dashed" && k[0].kind === "arrow", JSON.stringify(k));
  run(s, F("connect", { source: E("cache"), target: E("box"), object: E("line", "dotted", "a") }));
  check("16 older frame: the line in object", s.connectors.size === 2 && [...s.connectors.values()][1].style === "dotted", JSON.stringify([...s.connectors.values()]));
  const n = s.connectors.size; run(s, F("connect", { source: E("cache"), target: E("box"), object: E("box", null, "a") }));
  check("16 object that is not an edge word is not a line", s.connectors.size === n + 1 && [...s.connectors.values()][n].kind === "arrow", JSON.stringify([...s.connectors.values()][n]));
}
console.log(`scenarios:${pass} checks passed, ${fail} failed`);
if (fail) { console.log(failures.join("\n")); process.exit(1); }
