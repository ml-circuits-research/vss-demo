// engine.mjs: the diagram engine without a browser: render output (render.js builds a virtual tree and serialises it to an SVG
// string), the default looks of every kind, palette, styles, fitted labels, arrowheads, selection, candidate highlights, lock badges,
// corrected labels, text and formula slots, the view transform, the keyed diff's signatures; export / import round trip (JSON, SVG);
// the operations of Table 7 as one undo entry per transaction. Usage: node app/tests/engine.mjs
import { createScene } from "../src/editor/scene.js";
import * as ops from "../src/editor/ops.js";
import { buildScene, toSVGString, toXML, fitText, lookOf, PALETTE } from "../src/editor/render.js";
import { exportJSON, importJSON, exportSVG, toJSON } from "../src/editor/export.js";
import { textWidth } from "../src/editor/ops.js";
import { plan, execute } from "../src/editor/planner.js";

let pass = 0, fail = 0; const failures = [];
function check(name, cond, detail = "") { if (cond) pass++; else { fail++; failures.push(`${name}: ${String(detail).slice(0, 400)}`); } }
const count = (s, re) => (s.match(re) || []).length;
// a small well-formedness check: tags balance, attributes are quoted, no stray "<" or "&"
function wellFormed(xml) {
  const body = xml.replace(/^<\?xml[^>]*\?>\s*/, ""); const stack = []; const re = /<(\/?)([a-zA-Z][\w:-]*)((?:\s+[\w:-]+="[^"<]*")*)\s*(\/?)>|([^<]+)/g; let m, last = 0;
  while ((m = re.exec(body))) {
    if (m.index !== last) return `unparsed at ${last}: ${body.slice(last, last + 40)}`; last = re.lastIndex;
    if (m[5] != null) { if (/&(?!amp;|lt;|gt;|quot;|#\d+;)/.test(m[5])) return "bare &"; continue; }
    if (m[1]) { if (stack.pop() !== m[2]) return `mismatched </${m[2]}>`; } else if (!m[4]) stack.push(m[2]);
  }
  if (last !== body.length) return `trailing ${body.slice(last, last + 40)}`; return stack.length ? `unclosed ${stack.join(",")}` : "ok";
}

// ------------------------------------------------------------------ a scene with every kind
const KINDS = [["box", "process"], ["decision", "decision"], ["start", "terminator"], ["database", "data"], ["queue", "data"], ["document", "document"], ["user", "actor"],
  ["service", "system"], ["server", "system"], ["cloud", "system"], ["note", "note"], ["title", "text"], ["caption", "text"], ["circle", "shape"], ["square", "shape"],
  ["triangle", "shape"], ["star", "shape"], ["hexagon", "shape"], ["ellipse", "shape"], ["thing", "generic"]];
const s = createScene(); const ids = [];
KINDS.forEach(([word, kind], i) => { const [w, h] = ops.defaultBox(kind, word); ids.push(ops.create(s, { word, kind, label: `${word} ${i}` }, { x: 40 + (i % 5) * 220, y: 40 + Math.floor(i / 5) * 170, w, h })); });
const lane = ops.create(s, { word: "lane", kind: "container", label: "Lane A" }, { x: 40, y: 760, w: 600, h: 160 });
const inLane = ops.create(s, { word: "box", kind: "process", label: "in lane", parent: lane }, { x: 80, y: 820, w: 130, h: 60 });
const grp = ops.group(s, [ids[0], ids[1]], "Group");
ops.set(s, [ids[0]], { color: "red", style: "dashed" }); ops.set(s, [ids[3]], { style: "thick" }); ops.set(s, [ids[5]], { color: "blue", style: "dotted" });
const e1 = ops.connect(s, ids[0], ids[1], { kind: "arrow", label: "yes" }); const e2 = ops.connect(s, ids[2], ids[3], { kind: "line" }); const e3 = ops.connect(s, ids[6], inLane, { kind: "arrow", style: "dashed" });
ops.route(s);

{ // looks and output
  const svg = toSVGString(s);
  check("svg well-formed", wellFormed(svg) === "ok", wellFormed(svg));
  check("one group per component", count(svg, /<g class="vss-comp /g) === s.components.size, `${count(svg, /<g class="vss-comp /g)} vs ${s.components.size}`);
  const looks = new Set([...s.components.values()].map(lookOf));
  for (const l of ["process", "diamond", "stadium", "cylinder", "queue", "document", "actor", "system", "server", "cloud", "note", "text", "ellipse", "square", "triangle", "star", "hexagon", "container", "lane"])
    check(`look ${l}`, looks.has(l) && svg.includes(`l-${l}`), l);
  check("no NaN or undefined", !/NaN|undefined|Infinity/.test(svg), svg.match(/.{40}(NaN|undefined|Infinity).{20}/)?.[0]);
  check("arrowheads: one per arrow", count(svg, /class="vss-arrow"/g) === 2, count(svg, /class="vss-arrow"/g));
  check("connector label", svg.includes(">yes</text>"), "");
  check("palette red inline", new RegExp(`data-id="${ids[0]}"[^>]*>(<[^>]*>)*?<[^>]*stroke:${PALETTE.light.red}`).test(svg), "");
  check("dashed style", /stroke-dasharray:7 5/.test(svg) && /stroke-dasharray:1.5 4.5/.test(svg), "");
  check("thick style", /stroke-width:3.2px/.test(svg), "");
  check("container title", svg.includes(">Group</text>") && svg.includes(">Lane A</text>"), "");
  check("inline export has no CSS variables", !svg.includes("var(--") && !svg.includes("<style"), "");
  const dark = exportSVG(s, { theme: "dark" }); check("dark export", dark.includes(`fill:${PALETTE.dark.bg}`) && dark !== svg && wellFormed(dark) === "ok", "");
  const live = toSVGString(s, { inline: null }); check("live SVG uses CSS variables", live.includes("<style>") && live.includes("var(--c-red") && wellFormed(live) === "ok", wellFormed(live));
  const order = [...svg.matchAll(/data-id="([^"]+)"/g)].map((m) => m[1]); check("containers drawn under their members", order.indexOf(grp) < order.indexOf(ids[0]) && order.indexOf(lane) < order.indexOf(inLane), order.join(","));
}
{ // labels fitted
  const f = fitText("Customer onboarding and verification service", 114, 48); check("label wraps", f.lines.length >= 2 && f.lines.every((l) => textWidth(l, f.size) <= 114) && f.lines.length * f.size * 1.22 <= 48.5, JSON.stringify(f));
  const g = fitText("Short", 114, 48); check("short label at full size", g.lines.length === 1 && g.size === 14, JSON.stringify(g));
  const k = fitText("a ".repeat(200) + "end", 60, 30); check("absurd label is cut", k.cut && k.lines.length >= 1 && k.lines[k.lines.length - 1].endsWith("…") && k.size === 9, JSON.stringify(k));
  const w = fitText("Supercalifragilisticexpialidocious", 50, 20); check("long word ellipsized", w.lines.every((l) => textWidth(l, w.size) <= 50 + 0.01), JSON.stringify(w));
}
{ // selection, highlights, locks, corrected, slots, view transform
  const one = buildScene(s, { selection: [ids[2]], inline: null }); const ov = one.layers.overlay.map(toXML).join("");
  check("single selection: 8 handles and 4 ports", count(ov, /class="vss-handle"/g) === 8 && count(ov, /class="vss-port"/g) === 4, ov.slice(0, 200));
  const two = buildScene(s, { selection: [ids[2], ids[3]], inline: null }).layers.overlay.map(toXML).join("");
  check("multi-selection: outlines, no handles", count(two, /vss-sel-box/g) === 2 && count(two, /vss-handle/g) === 0, "");
  const touch = buildScene(s, { selection: [ids[2]], touch: true, inline: null }).layers.overlay.map(toXML).join("");
  check("bigger handles on touch", /class="vss-handle"[^>]*width="12"/.test(touch), touch.slice(0, 300));
  const tiny = buildScene({ ...s, view: { zoom: 0.3, x: 0, y: 0 } }, { selection: [ids[2]], touch: true, inline: null }).layers.overlay.map(toXML).join("");
  check("small box on screen: corner handles only", count(tiny, /class="vss-handle"/g) === 4, count(tiny, /class="vss-handle"/g));
  const hl = buildScene(s, { highlight: [ids[13], ids[14], ids[19]], inline: null }).layers.overlay.map(toXML).join("");
  check("candidates: outline and numbered badge", count(hl, /class="vss-cand"/g) === 3 && hl.includes(">1</text>") && hl.includes(">3</text>"), "");
  const ls = createScene(); const a = ops.create(ls, { word: "title", kind: "text", label: "T" }, { x: 0, y: 0, w: 120, h: 30 }); ops.create(ls, { word: "box", kind: "process" }, { x: 200, y: 0, w: 130, h: 60 });
  ops.lock(ls, "move", { head: "title", attr: null, det: "the" });
  const lb = buildScene(ls, { inline: null }); const lx = [...lb.layers.components].map(toXML);
  check("lock badge on the locked component only", lx[0].includes("vss-lock") && !lx[1].includes("vss-lock"), lx.join("\n").slice(0, 300));
  check("lockedBy", ops.lockedBy(ls, "move", [a]) && !ops.lockedBy(ls, "delete", [a]), "");
  const cr = buildScene(s, { corrected: [ids[0]], inline: null }).layers.components.map(toXML).join(""); check("corrected label underlined", cr.includes("vss-corrected"), "");
  const ts = createScene(); const t = ops.create(ts, { word: "note", kind: "note", label: "x", text: { plain: "Hello" } }, { x: 10, y: 20, w: 200, h: 100 });
  const tb = buildScene(ts, { inline: null }); check("text slot listed with the box", tb.slots.length === 1 && tb.slots[0].id === t && tb.slots[0].w === 200 && tb.slots[0].kind === "text", JSON.stringify(tb.slots));
  check("slot component draws no label in the page", !toXML(tb.layers.components[0]).includes("<text"), "");
  check("slot text exported as a label", toSVGString(ts).includes(">Hello</tspan>"), "");
  s.view = { zoom: 2, x: 10, y: -5 }; check("view transform", buildScene(s, { inline: null }).root.transform === "translate(10,-5) scale(2)", buildScene(s, {}).root.transform);
  check("export ignores the view", !toSVGString(s).includes("scale(2)"), ""); s.view = { zoom: 1, x: 0, y: 0 };
}
{ // keyed diff signatures: moving one component changes only its transform
  const sig = (n) => JSON.stringify([n.a.class, n.c]); const b1 = buildScene(s, { inline: null });
  ops.move(s, ids[10], { x: s.components.get(ids[10]).box.x + 30, y: s.components.get(ids[10]).box.y });
  const b2 = buildScene(s, { inline: null }); const i10 = b1.layers.components.findIndex((n) => n.k === ids[10]);
  check("moved group: same content, new transform", sig(b1.layers.components[i10]) === sig(b2.layers.components[i10]) && b1.layers.components[i10].a.transform !== b2.layers.components[i10].a.transform, "");
  check("other groups unchanged", b1.layers.components.every((n, i) => i === i10 || (sig(n) === sig(b2.layers.components[i]) && n.a.transform === b2.layers.components[i].a.transform)), "");
}
{ // export / import round trip
  const j1 = exportJSON(s); const s2 = importJSON(j1); const j2 = exportJSON(s2);
  check("JSON round trip identical", j1 === j2, "");
  check("SVG of the imported scene identical", toSVGString(s) === toSVGString(s2), "");
  check("format header", JSON.parse(j1).format === "vss-diagram" && JSON.parse(j1).version === 1, "");
  const o = JSON.parse(j1); for (const e of o.connectors) delete e.points; const s3 = importJSON(o);
  check("import routes connectors without points", [...s3.connectors.values()].every((e) => e.points && e.points.length >= 2), "");
  let err = ""; try { importJSON("{not json"); } catch (x) { err = x.message; } check("bad JSON refused", /not a diagram file/.test(err), err);
  err = ""; try { importJSON({ format: "vss-diagram", components: [{ id: "a" }], connectors: [{ id: "e", source: "a", target: "zz" }] }); } catch (x) { err = x.message; } check("unknown end refused", /unknown end/.test(err), err);
  const s4 = importJSON({ components: [{ id: "c7", kind: "process" }] }); const nid = ops.create(s4, { word: "box", kind: "process" }, { x: 0, y: 0, w: 10, h: 10 });
  check("ids continue after import", nid === "c8", nid);
  // a planner request still works on an imported scene (the resolver sees the same model)
  const p = plan(s2, { event: "change", roles: { object: ["entity", "decision", null, "the"], color: ["word", "green"] }, neg: false, speakers: [] }); execute(s2, p);
  check("planner on an imported scene", s2.components.get(ids[1]).color === "green", JSON.stringify(p.questions));
}
{ // transactions: one undo entry per gesture whatever the number of operations; rollback; the view is not undone
  const t = createScene(); const a = ops.create(t, { word: "box", kind: "process" }, { x: 0, y: 0, w: 100, h: 50 }); const b = ops.create(t, { word: "box", kind: "process" }, { x: 300, y: 0, w: 100, h: 50 });
  const tx = ops.begin(t); ops.move(t, a, { x: 10, y: 100 }); ops.resize(t, b, { x: 300, y: 0, w: 140, h: 70 }); ops.connect(t, a, b); ops.route(t);
  check("commit pushes one entry", ops.commit(t, tx) && t.undo.length === 1, t.undo.length);
  check("empty transaction pushes nothing", !ops.commit(t, ops.begin(t)) && t.undo.length === 1, "");
  t.view = { zoom: 3, x: 1, y: 2 }; ops.undo(t);
  check("undo restores all of it, keeps the view", t.components.get(a).box.y === 0 && t.components.get(b).box.w === 100 && t.connectors.size === 0 && t.view.zoom === 3, JSON.stringify(t.view));
  ops.redo(t); check("redo", t.connectors.size === 1 && t.components.get(b).box.w === 140, "");
  const tx2 = ops.begin(t); ops.remove(t, [a]); ops.rollback(t, tx2); check("rollback", t.components.has(a) && t.connectors.size === 1, "");
  const gid = ops.group(t, [a, b], "G"); ops.move(t, gid, { x: t.components.get(gid).box.x + 50, y: t.components.get(gid).box.y });
  check("moving a container moves its members", t.components.get(a).box.x === 60, JSON.stringify(t.components.get(a).box));
  ops.move(t, a, { x: 2000, y: 0 }); check("a container grows to keep a moved member", t.components.get(gid).box.x + t.components.get(gid).box.w >= 2100, JSON.stringify(t.components.get(gid).box));
  ops.move(t, a, { x: 3000, y: 0 }, { fit: false });
  check("reparent: dragged out", ops.reparent(t, a) === null && t.components.get(a).parent === null, "");
  ops.move(t, a, { x: t.components.get(b).box.x, y: t.components.get(b).box.y - 10 }); check("reparent: dropped in", ops.reparent(t, a) === gid, "");
  ops.resize(t, gid, { x: 0, y: 0, w: 20, h: 20 }); const G = t.components.get(gid).box, B = t.components.get(b).box;
  check("a container never shrinks below its members", G.x <= B.x && G.x + G.w >= B.x + B.w, JSON.stringify({ G, B }));
  check("actor default box is tall", ops.defaultBox("actor", "user")[1] > ops.defaultBox("actor", "user")[0], "");
  ops.remove(t, [gid]); check("removing a container keeps its members", t.components.has(a) && t.components.get(a).parent === null, "");
}

console.log(`engine: ${pass} checks passed, ${fail} failed`);
if (fail) { console.log(failures.join("\n")); process.exit(1); }
void e1; void e2; void e3; void toJSON;
