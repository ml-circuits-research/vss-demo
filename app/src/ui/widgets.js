// widgets.js (ui): fills the editor's <foreignObject class="vss-slot"> elements (src/editor/view.js) with the text and formula widgets:
// a text widget is drawn by src/text/view.js, a formula as MathML by src/formula/mathml.js. DOM only, no decisions: which document a slot
// shows, which widget is being written in, and what a tap means are given by the caller.
//   const slots = createSlots(svg, { textDoc(id), formula(id), label(id), active(), dictating() });
//   slots.sync()   after every render of the view; slots.candidates(id, ranges) highlights numbered candidates of a text question
import { mountTextWidget } from "../text/view.js";
import { toMathML } from "../formula/mathml.js";

const XHTML = "http://www.w3.org/1999/xhtml";
const div = (cls, text) => { const e = document.createElementNS(XHTML, "div"); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

export function createSlots(svg, ctx) {
  const mounted = new Map(); const cands = new Map();
  function mountText(fo, id) {
    const doc = ctx.textDoc(id); const wrap = div("wslot"); const title = div("wslot-title"); const host = div(null); host.style.cssText = "flex:1;min-height:0;display:flex";
    const empty = div("wslot-empty", "Empty. Say “start writing in” its name, or double-click it.");
    wrap.append(title, empty, host); fo.replaceChildren(wrap);
    const view = mountTextWidget(host, doc, { dictating: false }); view.element.style.flex = "1";
    return { fo, kind: "text", doc, wrap, title, empty, view };
  }
  function mountFormula(fo, id) {
    const wrap = div("wslot"); const title = div("wslot-title"); const math = div("wslot-math"); wrap.append(title, math); fo.replaceChildren(wrap);
    return { fo, kind: "formula", wrap, title, math, sig: null };
  }
  function sync() {
    const seen = new Set();
    for (const fo of svg.querySelectorAll("foreignObject.vss-slot")) {
      const id = fo.getAttribute("data-id"); const kind = fo.getAttribute("data-slot"); seen.add(id);
      let m = mounted.get(id);
      if (kind === "text") {
        const doc = ctx.textDoc(id); if (!doc) continue;
        if (!m || m.fo !== fo || m.kind !== "text" || m.doc !== doc) { if (m && m.view) m.view.destroy(); m = mountText(fo, id); mounted.set(id, m); }
        const dict = ctx.dictating() === id; const label = ctx.label(id);
        m.title.textContent = label || ""; m.title.hidden = !label;
        m.empty.hidden = dict || doc.length > 0;
        m.view.update({ dictating: dict, candidates: cands.get(id) || [], showCaret: dict });
        m.wrap.classList.toggle("active-widget", dict);
      } else {
        const f = ctx.formula(id); if (!f) continue;
        if (!m || m.fo !== fo || m.kind !== "formula") { m = mountFormula(fo, id); mounted.set(id, m); }
        const sig = JSON.stringify(f.tree);
        if (m.sig !== sig) { m.math.innerHTML = toMathML(f.tree, { display: "block" }); m.sig = sig; }
        const label = ctx.label(id); m.title.textContent = label || ""; m.title.hidden = !label;
        m.wrap.classList.toggle("active-widget", ctx.active() === id);
      }
    }
    for (const [id, m] of mounted) if (!seen.has(id)) { if (m.view) m.view.destroy(); mounted.delete(id); }
  }
  return { sync, candidates(id, ranges) { if (ranges && ranges.length) cands.set(id, ranges); else cands.delete(id); }, reset() { for (const m of mounted.values()) if (m.view) m.view.destroy(); mounted.clear(); } };
}
