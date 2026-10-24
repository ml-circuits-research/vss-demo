// view.js: the document view (spec 18): the script on one side, every sentence marked with what it did (executed, out-of-world, uncertain,
// unresolved, blocked, skipped), a checkpoint control per section, and the counts the About panel reports. It shows the model built by
// script.js documentModel(); it decides nothing.
//   renderDocument(container, model, { onSelectUnit(i), onCheckpoint(k), selected })
const MARKS = {
  executed: ["done", "var(--ok, #2e7d32)"], "out-of-world": ["outside the world", "var(--warn, #b26a00)"], uncertain: ["uncertain", "var(--warn, #b26a00)"],
  unresolved: ["reference not found", "var(--bad, #c62828)"], blocked: ["blocked", "var(--bad, #c62828)"], skipped: ["skipped", "var(--muted, #888)"],
  "not run": ["not run yet", "var(--muted, #888)"], answered: ["answered", "var(--ok, #2e7d32)"], dropped: ["dropped", "var(--muted, #888)"],
};
function h(tag, attrs = {}, text = null) {
  const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v)); if (text != null) e.textContent = text; return e;
}

export function renderDocument(container, model, ctx = {}) {
  container.textContent = "";
  const root = h("div", { class: "doc-view", style: "font:15px/1.5 system-ui,sans-serif;max-width:46rem;overflow-wrap:anywhere" });
  if (model.title) root.appendChild(h("h2", { style: "font-size:1.2em;margin:0 0 .5em" }, model.title));
  const c = model.counts;
  root.appendChild(h("p", { style: "font-size:13px;color:var(--muted,#666);margin:0 0 .8em" },
    `${c.units} units: ${c.executed || 0} done, ${c["out-of-world"] || 0} outside the world, ${c.uncertain || 0} uncertain, ${c.unresolved || 0} references not found, ${c.blocked || 0} blocked, ${(c.skipped || 0) + (c["not run"] || 0)} not run.`));
  if (model.waiting) root.appendChild(h("p", { role: "status", style: "color:var(--bad,#c62828);font-size:13px" },
    model.waiting.conflicts ? "Waiting: the script sets the same property twice; choose which one to keep." : model.waiting.cycle ? model.waiting.cycle.text : `Waiting at unit ${model.waiting.unit}.`));
  const detail = h("div", { "aria-live": "polite", style: "font-size:13px;border-left:3px solid var(--border,#ccc);padding:4px 8px;margin:.6em 0;min-height:1.5em" });
  model.sections.forEach((s, k) => {
    const head = h("div", { style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:1em 0 .3em" });
    head.appendChild(h("h3", { style: "font-size:1.05em;margin:0" }, s.title || `Section ${k + 1}`));
    if (s.checkpoint != null) {
      const b = h("button", { type: "button", style: "font-size:12px;padding:6px 10px;min-height:32px" }, "Back to here");
      b.title = "Undo everything after this section"; b.addEventListener("click", () => ctx.onCheckpoint && ctx.onCheckpoint(k)); head.appendChild(b);
    }
    root.appendChild(head);
    for (const p of s.paragraphs) {
      const para = h("p", { style: "margin:.3em 0" });
      for (const x of p.sentences) {
        const [label, color] = MARKS[x.mark] || [x.mark, "var(--muted,#888)"];
        const span = h("span", { tabindex: 0, role: "button", "data-unit": x.unit, style: `cursor:pointer;border-bottom:2px solid ${color};${ctx.selected === x.unit ? "background:var(--sel,#fff3b0);" : ""}` }, x.text);
        span.title = `${label}${x.reason ? `: ${x.reason}` : ""}`;
        const show = () => {
          detail.textContent = "";
          detail.appendChild(h("strong", {}, `${label}`)); if (x.reason) detail.appendChild(document.createTextNode(`: ${x.reason}`));
          if (x.did.length) { const ul = h("ul", { style: "margin:.2em 0;padding-left:18px" }); for (const d of x.did) ul.appendChild(h("li", {}, d)); detail.appendChild(ul); }
          for (const l of x.links) detail.appendChild(h("div", {}, `${l.kind} link with unit ${l.other} (${l.source}${l.why ? `: ${l.why}` : ""})`));
          if (ctx.onSelectUnit) ctx.onSelectUnit(x.unit, x.ids);
        };
        span.addEventListener("click", show); span.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); show(); } });
        para.appendChild(span); para.appendChild(document.createTextNode(" "));
      }
      if (p.ambiguous) para.appendChild(h("em", { style: "font-size:12px;color:var(--warn,#b26a00)" }, " (two readings of this paragraph: choose one)"));
      root.appendChild(para);
    }
  });
  root.appendChild(detail);
  container.appendChild(root);
  return { root };
}
