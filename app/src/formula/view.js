// view.js: the formula widget in the DOM (spec 16.1), for desktop and mobile. It renders and forwards events; it decides nothing
// (decisions: commands.js, parse.js, or the matheditor reader when one is loaded).
//   const w = mountFormula(container, { doc, parsers, reader });   // reader: optional {read(text) -> {kind, ...}} from a matheditor model
//   w.render(); w.input("x plus one over two"); w.destroy();
// Rendering is MathML Core (mathml.js), native in current browsers, no library. The LaTeX of the formula is shown under it (selectable,
// for copying). A tap / click on a part of the formula puts the cursor there. Ambiguous input shows every reading as a large button
// ("the first", "the second" also work by voice / text). Candidates of an unresolved target ("choose") are highlighted and numbered.
// Every result line names its source: the matheditor reader, or "reference parser" when no model is loaded (spec: labelled as such).
import { toMathML } from "./mathml.js";
import { toLatex } from "./latex.js";
import { pathKey, keyPath } from "./tree.js";
import { handleInput, pickReading, execute } from "./commands.js";

const CSS = `
.fx-widget{display:flex;flex-direction:column;gap:6px;min-width:0;max-width:100%;font:14px/1.4 system-ui,sans-serif;color:var(--fx-fg,#1d1d1f)}
.fx-math{overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;padding:6px 4px;font-size:clamp(18px,4.5vw,26px);touch-action:pan-x}
.fx-math math{font-size:inherit}
.fx-math [data-path]{cursor:pointer}
.fx-math .fx-hl{background:var(--fx-hl,#ffe58a);border-radius:3px}
.fx-math .fx-cursor{outline:2px solid var(--fx-accent,#2f6fdd);outline-offset:1px;border-radius:2px}
.fx-latex{font:12px/1.3 ui-monospace,monospace;color:var(--fx-muted,#666);word-break:break-all;user-select:all}
.fx-readings{display:flex;flex-wrap:wrap;gap:8px}
.fx-readings button,.fx-row button{min-height:44px;min-width:44px;padding:6px 10px;border:1px solid var(--fx-line,#bbb);border-radius:8px;background:var(--fx-bg2,#fff);font-size:18px;color:inherit}
.fx-readings button .fx-n{font-size:12px;color:var(--fx-muted,#666);margin-right:6px}
.fx-row{display:flex;gap:6px}
.fx-row input{flex:1;min-width:0;min-height:44px;font-size:16px;padding:6px 8px;border:1px solid var(--fx-line,#bbb);border-radius:8px;background:var(--fx-bg2,#fff);color:inherit}
.fx-status{font-size:12px;color:var(--fx-muted,#666)}
.fx-status b{font-weight:600}
@media (prefers-color-scheme:dark){.fx-widget{--fx-fg:#eee;--fx-muted:#aaa;--fx-line:#555;--fx-bg2:#222;--fx-hl:#6b5a12;--fx-accent:#7aa7ff}}
`;
let cssDone = false;
function injectCss(doc) { if (cssDone || !doc.head) return; const s = doc.createElement("style"); s.textContent = CSS; doc.head.appendChild(s); cssDone = true; }

export function mountFormula(container, ctx) {
  const d = container.ownerDocument; injectCss(d);
  const { doc, parsers } = ctx; let pending = null, highlight = new Set(), status = null;
  const root = d.createElement("div"); root.className = "fx-widget";
  root.innerHTML = `<div class="fx-math" role="math" aria-live="polite"></div><div class="fx-latex"></div><div class="fx-readings" hidden></div>
    <div class="fx-row"><input type="text" enterkeyhint="go" autocomplete="off" autocapitalize="none" spellcheck="false"
    aria-label="Formula or command" placeholder="say or type a formula or a command"><button type="button" aria-label="Undo">&#x21B6;</button></div>
    <div class="fx-status"></div>`;
  container.appendChild(root);
  const $ = (s) => root.querySelector(s), mathEl = $(".fx-math"), texEl = $(".fx-latex"), rdEl = $(".fx-readings"), inp = $("input"), stEl = $(".fx-status");

  function render() {
    mathEl.innerHTML = toMathML(doc.tree, { paths: true, highlight, cursor: pathKey(doc.cursor || []) });
    texEl.textContent = toLatex(doc.tree);
    rdEl.hidden = !pending; rdEl.innerHTML = "";
    if (pending) pending.readings.forEach((r, k) => {
      const b = d.createElement("button"); b.type = "button"; b.dataset.k = String(k);
      b.innerHTML = `<span class="fx-n">${k + 1}</span>` + toMathML(r.tree, { display: "inline" });
      b.setAttribute("aria-label", `reading ${k + 1}: ${toLatex(r.tree)}`); rdEl.appendChild(b);
    });
    stEl.innerHTML = status ? `<b>${esc(status.status)}</b> ${esc(status.reason || "")} <i>(${esc(status.source || "")})</i>` : "";
  }
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  function input(text) {
    if (pending) {                                   // a reading picked by word ("the first")
      const k = parsers.parseChoice(text, pending.readings.length);
      if (k !== null) return choose(k);
    }
    const r = ctx.reader ? ctx.reader.read(text, doc) : handleInput(doc, text, parsers);
    pending = r.status === "ambiguous" && r.kind === "formula" ? r : null;
    highlight = new Set(r.plan && r.plan.status === "choose" ? r.plan.candidates.map(pathKey) : []);
    status = r; render(); if (ctx.onChange) ctx.onChange(doc, r); return r;
  }
  function choose(k) {
    const r = Object.assign(pickReading(doc, pending.readings, k), { source: pending.source }); pending = null; status = r; render();
    if (ctx.onChange) ctx.onChange(doc, r); return r;
  }
  const onMath = (e) => {
    const el = e.target.closest && e.target.closest("[data-path]"); if (!el) return;
    doc.moveCursor(keyPath(el.getAttribute("data-path"))); highlight = new Set(); render();
  };
  const onReadings = (e) => { const b = e.target.closest("button"); if (b) choose(Number(b.dataset.k)); };
  const onKey = (e) => { if (e.key === "Enter" && inp.value.trim()) { input(inp.value); inp.value = ""; } };
  const onUndo = () => { status = Object.assign(execute(doc, { event: "undo" }), { source: "editor" }); render(); };
  mathEl.addEventListener("click", onMath); rdEl.addEventListener("click", onReadings); inp.addEventListener("keydown", onKey);
  $(".fx-row button").addEventListener("click", onUndo);
  render();
  return {
    render, input, choose, element: root,
    destroy() { mathEl.removeEventListener("click", onMath); rdEl.removeEventListener("click", onReadings); inp.removeEventListener("keydown", onKey); root.remove(); },
  };
}
