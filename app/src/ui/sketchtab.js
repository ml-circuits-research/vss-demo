// sketchtab.js (ui): the "Sketch: how it is read" tab. DOM only; the rows come from sketchrows.js (plain data). Read-only: a click on a row
// highlights the same component in the other column and reports its keys to the caller (which selects it on the canvas); the caller calls
// highlight(keys) when a component is selected on the canvas.
import { linked } from "./sketchrows.js";

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const num = (v, d = 2) => (typeof v === "number" && isFinite(v) ? v.toFixed(d) : "-");
const nice = (k) => String(k).replace(/_/g, " ");

function leftItem(r) {
  const li = el("li", `sk-row sk-left${r.flag ? " sk-flag" : ""}`); li.dataset.keys = r.keys.join(" "); li.dataset.side = "left"; li.tabIndex = 0; li.setAttribute("role", "button");
  const top = el("div", "sk-top"); top.append(el("strong", null, r.title));
  if (r.flag) top.append(el("span", "chip sk-mark", r.flag));
  top.append(el("span", "muted small", `${r.nStrokes} stroke${r.nStrokes === 1 ? "" : "s"} (${r.strokes.join(", ")})`));
  li.append(top);
  if (r.candidates.length) {
    const c = r.candidates.slice(0, r.candidates.length > 3 ? 6 : 3).map((x) => `${nice(x.kind)} ${num(x.score)}`).join(", ");
    li.append(el("div", "sk-line", `ranked: ${c}`));
    li.append(el("div", "sk-line", r.second ? `margin ${num(r.margin)} (${nice(r.candidates[0].kind)} over ${nice(r.second.kind)})` : `margin ${num(r.margin)} (one candidate)`));
  }
  if (r.features.length) {
    const ul = el("ul", "sk-feats");
    for (const f of r.features) ul.append(el("li", null, `${f.name} ${num(f.value, f.digits ?? 2)}${f.proto ? ` (${nice(f.proto.kind)} prototype ${num(f.proto.mean)} +/- ${num(f.proto.sd, 3)})` : ""}`));
    li.append(ul);
  }
  if (r.p.length) li.append(el("div", "sk-line", `$P distance: ${r.p.slice(0, 3).map((x) => `${nice(x.kind)} ${num(x.d, 3)}`).join(", ")}`));
  if (r.reason) li.append(el("div", "sk-reason muted", `Reason: ${r.reason}`));
  return li;
}

function rightItem(r) {
  const li = el("li", `sk-row sk-right sk-${r.type}`); li.dataset.keys = r.keys.join(" "); li.dataset.side = "right"; li.tabIndex = 0; li.setAttribute("role", "button");
  const top = el("div", "sk-top"); top.append(el("strong", null, r.title));
  if (r.ambiguous) top.append(el("span", "chip sk-mark", "held open"));
  li.append(top, el("div", "sk-line", r.decision));
  if (r.type === "component" && r.candidates?.length) {
    li.append(el("div", "sk-line", `two best: ${r.candidates.map((x) => `${nice(x.kind)} ${num(x.score)}`).join(", ")}${r.margin != null ? `; margin ${num(r.margin)}${r.ambiguous ? ` < ${num(r.low)}: asked` : ""}` : ""}`));
  }
  if (r.type === "connector") {
    for (const e of r.ends) {
      const c = e.candidates.map((x) => `${x.name} ${x.d} px`).join(", then ");
      if (e.fpe && !e.fpe.fallback) { li.append(el("div", "sk-line", `${e.end}: ${e.chosen} (VSS: the component whose address is most similar to the decoded end; similarity margin ${num(e.fpe.margin, 3)}${e.fpe.agrees ? "; the nearest outline agrees" : "; the nearest outline is another component"}; tolerance ${r.attachTol != null ? Math.round(r.attachTol) : "-"} px on the outline: ${c})`)); continue; }
      li.append(el("div", "sk-line", `${e.end}: ${e.chosen}${e.fpe?.fallback ? " (outline rule: the scene reader's choice was beyond the tolerance)" : ""} (nearest outlines: ${c}${e.candidates.length > 1 ? `; distance margin ${isFinite(e.margin) ? Math.round(e.margin) + " px" : "-"}` : "; no second candidate"}${r.attachTol != null ? `; tolerance ${Math.round(r.attachTol)} px` : ""})`));
    }
    if (r.kindMargin != null) li.append(el("div", "sk-line muted", `line or arrow: margin ${num(r.kindMargin)} (left column)`));
  }
  if (r.parent) li.append(el("div", "sk-line", `inside: ${r.parent}`));
  if (r.members?.length) li.append(el("div", "sk-line", `contains: ${r.members.join(", ")}`));
  if (r.labelMark) li.append(el("div", "sk-line", "a label area was marked; handwriting is not read"));
  for (const q of r.questions || []) li.append(el("div", "sk-query", `Asks (${q.kind}): ${q.text}`));
  return li;
}

/** the tab. returns {show(model), highlight(keys), clear()}; onPick(keys) is called when a row is clicked */
export function createSketchTab(host, { onPick } = {}) {
  let model = null;
  const mark = (keys) => {
    const hit = new Set(model && keys.length ? linked(model, keys).map((r) => r.keys.join(" ")) : []);
    for (const li of host.querySelectorAll(".sk-row")) li.classList.toggle("sk-hl", hit.has(li.dataset.keys));
    const first = host.querySelector(".sk-row.sk-hl"); if (first && first.scrollIntoView) first.scrollIntoView({ block: "nearest" });
  };
  const show = (m) => {
    model = m; host.replaceChildren();
    host.append(el("p", "tab-lead sk-pass", m.header));
    host.append(el("p", "tab-lead muted", "Same strokes, two steps. Left: perception with margins. Right: structure with margins and queries. A click on a row highlights the same component in the other column and on the canvas."));
    if (!m.left.length) { host.append(el("p", "muted", "No ink was read.")); return; }
    const cols = el("div", "sk-cols");
    const lc = el("section", "sk-col"); lc.dataset.col = "left"; lc.append(el("h3", null, "The classical step"), el("p", "sk-sub muted small", "recognise.js: stroke groups, ranked kinds, features, $P. Not VSS."));
    const ll = el("ol", "sk-list"); for (const r of m.left) ll.append(leftItem(r)); lc.append(ll);
    const rc = el("section", "sk-col"); rc.dataset.col = "right"; rc.append(el("h3", null, "The reading"), el("p", "sk-sub muted small", `${m.pass}: components, connectors, containment, questions and the circuit.`));
    const rl = el("ol", "sk-list"); for (const r of m.right) rl.append(rightItem(r));
    if (!m.right.length) rl.append(el("li", "muted", "Nothing was built from these strokes."));
    rc.append(rl);
    if (m.layoutHint) rc.append(el("p", "sk-line", `Layout hint: ${m.layoutHint}`));
    rc.append(el("h4", null, "SOP circuit that results"), el("pre", "sk-circuit", m.circuit));
    cols.append(lc, rc); host.append(cols);
    const click = (e) => { const li = e.target.closest(".sk-row"); if (!li) return; const keys = li.dataset.keys.split(" "); mark(keys); onPick && onPick(keys); };
    cols.addEventListener("click", click);
    cols.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); click(e); } });
  };
  return { show, highlight: (keys) => mark(keys || []), clear: () => mark([]) };
}
