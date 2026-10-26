// view.js: the circuit view (spec 15.3), a small graph for the side panel: the units as boxes in text order (left column), the shared
// entities as pills (right column), and the links as arrows with their kind and source: shared entity (unit -> entity, solid), discourse
// (unit -> unit, labelled with the operator), order of execution (the number in each box). A cycle and the conflicts are listed under
// the graph. SVG in a scrollable container; it narrows to a phone's width. No decisions here: everything shown comes from the circuit.
//   renderCircuit(container, circuit, { onSelectUnit(i), onSelectEntity(id), selected })
const NS = "http://www.w3.org/2000/svg";
const MARK_COLOR = { executed: "var(--ok, #2e7d32)", "out-of-world": "var(--warn, #b26a00)", uncertain: "var(--warn, #b26a00)", unresolved: "var(--bad, #c62828)",
  blocked: "var(--bad, #c62828)", skipped: "var(--muted, #888)" };

function el(name, attrs = {}, text = null) {
  const e = document.createElementNS(NS, name); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  if (text != null) e.textContent = text; return e;
}
function html(tag, attrs = {}, text = null) {
  const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v)); if (text != null) e.textContent = text; return e;
}

export function renderCircuit(container, circuit, ctx = {}) {
  container.textContent = "";
  const wrap = html("div", { class: "circuit-view", style: "overflow:auto;max-width:100%;-webkit-overflow-scrolling:touch" });
  const units = circuit.units.filter((u) => u.role !== "speaker");
  const used = new Set(); for (const l of circuit.links) if (l.kind === "shared") used.add(l.entity);
  for (const u of units) for (const m of u.mentions || []) if (m.create && circuit.links.some((l) => l.kind === "shared" && l.entity === m.entity)) used.add(m.entity);
  const ents = circuit.entities.filter((e) => used.has(e.id));
  const W = 340, rowH = 46, boxW = 210, entX = 262, entW = 72;
  const H = Math.max(units.length, ents.length) * rowH + 20;
  const svg = el("svg", { viewBox: `-44 0 ${W + 44} ${H}`, width: "100%", style: `min-width:300px;max-width:${W * 1.6}px;font:13px system-ui,sans-serif`, role: "img",
    "aria-label": `circuit of ${units.length} units and ${ents.length} shared entities` });
  const defs = el("defs"); const mk = el("marker", { id: "cv-arrow", viewBox: "0 0 8 8", refX: 7, refY: 4, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" });
  mk.appendChild(el("path", { d: "M0,0 L8,4 L0,8 z", fill: "currentColor" })); defs.appendChild(mk); svg.appendChild(defs);
  const yU = new Map(units.map((u, k) => [u.i, 10 + k * rowH + 18])); const yE = new Map(ents.map((e, k) => [e.id, 10 + k * rowH + 18]));
  const orderPos = new Map(circuit.order.map((i, k) => [i, k + 1]));
  // links first (under the boxes)
  for (const l of circuit.links) {
    if (l.kind === "shared" && yU.has(l.from.unit) && yE.has(l.entity)) {
      const y1 = yU.get(l.from.unit), y2 = yE.get(l.entity);
      const p = el("path", { d: `M${10 + boxW},${y1} C${entX - 20},${y1} ${entX - 30},${y2} ${entX},${y2}`, fill: "none", stroke: "var(--link, #3b6fb6)", "stroke-width": 1.2,
        "marker-end": "url(#cv-arrow)", style: "color:var(--link, #3b6fb6)" });
      p.appendChild(el("title", {}, `shared entity ${l.entity}, ${l.source}${l.why ? `: ${l.why}` : ""}`)); svg.appendChild(p);
    }
  }
  for (const u of units) for (const m of u.mentions || []) if (m.create && yE.has(m.entity)) {
    const y1 = yU.get(u.i), y2 = yE.get(m.entity);
    svg.appendChild(el("path", { d: `M${10 + boxW},${y1} C${entX - 20},${y1} ${entX - 30},${y2} ${entX},${y2}`, fill: "none", stroke: "var(--link, #3b6fb6)", "stroke-width": 2.2 }));
  }
  let lane = 0;
  for (const d of circuit.discourse) {
    if (d.op === "says" || !yU.has(d.a) || !yU.has(d.b)) continue;
    const y1 = yU.get(d.a), y2 = yU.get(d.b); const bend = 4 + (lane++ % 3) * 3;
    const p = el("path", { d: `M10,${y1} C${-bend * 4},${y1} ${-bend * 4},${y2} 10,${y2}`, fill: "none", stroke: "var(--discourse, #7b3fa0)", "stroke-width": 1.4, "marker-end": "url(#cv-arrow)", style: "color:var(--discourse, #7b3fa0)" });
    p.appendChild(el("title", {}, `${d.op}: unit ${d.a} -> unit ${d.b} (rule:connective)`)); svg.appendChild(p);
    svg.appendChild(el("text", { x: 12, y: (y1 + y2) / 2 + 3, fill: "var(--discourse, #7b3fa0)", "font-size": 9 }, d.op));
  }
  // unit boxes
  for (const u of units) {
    const y = yU.get(u.i) - 18; const fr = u.reading && u.reading.frame; const okr = !u.poor && fr && fr.event;
    const g = el("g", { tabindex: 0, role: "button", style: "cursor:pointer", "data-unit": u.i });
    const sel = ctx.selected === u.i;
    g.appendChild(el("rect", { x: 10, y, width: boxW, height: rowH - 8, rx: 5, fill: okr ? "var(--box, #fff)" : "var(--box-bad, #fff4e5)",
      stroke: sel ? "var(--accent, #000)" : (u.mark && MARK_COLOR[u.mark]) || "var(--border, #999)", "stroke-width": sel ? 2 : 1 }));
    g.appendChild(el("text", { x: 16, y: y + 14, fill: "var(--fg, #222)", "font-weight": 600 }, `${orderPos.get(u.i) || "?"}. ${okr ? (fr.neg ? "not " : "") + fr.event : "unread"}`));
    const t = u.text.length > 34 ? u.text.slice(0, 33) + "…" : u.text;
    g.appendChild(el("text", { x: 16, y: y + 28, fill: "var(--muted, #666)" }, t));
    g.appendChild(el("title", {}, `unit ${u.i}: ${u.text}${u.poor ? ` (unread: ${u.poor})` : ""}`));
    g.addEventListener("click", () => ctx.onSelectUnit && ctx.onSelectUnit(u.i));
    g.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); ctx.onSelectUnit && ctx.onSelectUnit(u.i); } });
    svg.appendChild(g);
  }
  for (const e of ents) {
    const y = yE.get(e.id) - 13; const g = el("g", { tabindex: 0, role: "button", style: "cursor:pointer" });
    g.appendChild(el("rect", { x: entX, y, width: entW, height: 26, rx: 13, fill: "var(--entity, #eef3fb)", stroke: "var(--link, #3b6fb6)" }));
    g.appendChild(el("text", { x: entX + entW / 2, y: y + 17, "text-anchor": "middle", fill: "var(--fg, #222)" }, (e.label || e.head || e.word || e.id).slice(0, 11)));
    g.appendChild(el("title", {}, `${e.id}: ${e.head}${e.label ? ` "${e.label}"` : ""}${e.scene ? " (on the diagram)" : ""}`));
    g.addEventListener("click", () => ctx.onSelectEntity && ctx.onSelectEntity(e.id));
    svg.appendChild(g);
  }
  wrap.appendChild(svg); container.appendChild(wrap);
  const legend = html("p", { style: "font-size:12px;margin:6px 0;color:var(--muted,#666)" },
    "Boxes: units in text order, numbered in execution order. Blue: shared entities (thick: created here). Purple: discourse links.");
  container.appendChild(legend);
  if (circuit.cycle) container.appendChild(html("p", { role: "alert", style: "color:var(--bad,#c62828);font-size:13px" }, circuit.cycle.text));
  if (circuit.conflicts.length) {
    const ul = html("ul", { style: "font-size:13px;padding-left:18px" });
    for (const c of circuit.conflicts) ul.appendChild(html("li", {}, `Conflict: ${c.text}`));
    container.appendChild(ul);
  }
  return { svg };
}
