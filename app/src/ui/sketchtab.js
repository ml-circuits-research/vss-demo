// sketchtab.js (ui): the rows of the details of a sketch element, as DOM: leftItem (the classical step: ranked kinds, margin, features, $P) and rightItem
// (the reading: decision, candidates, margins, containment, questions). Used by the popup of a clicked element in sketchview.js; the rows come from sketchrows.js.

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const num = (v, d = 2) => (typeof v === "number" && isFinite(v) ? v.toFixed(d) : "-");
const nice = (k) => String(k).replace(/_/g, " ");

export function leftItem(r) {
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

export function rightItem(r) {
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
