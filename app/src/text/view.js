// view.js: DOM rendering of a text widget inside a diagram component box (spec 14.1). No decisions here: it draws a TextDoc (doc.js) with
// its cursor, its selection and, while a question is open, the numbered candidates of a match (commands.js); a tap or click reports the
// character offset through onTap (the caller decides what it means: place the cursor, start dictation). contenteditable is never used:
// every change goes through commands and transactions. Mobile friendly: relative font sizes, wrapping of long words, touch targets.
//
//   const v = mountTextWidget(boxElement, doc, { onTap: (offset) => ..., dictating: true });
//   v.update({ candidates: [{from, to}], dictating }); v.destroy();
//   renderTextWidget(container, doc, opts) draws once (used by mountTextWidget and by the single-file export).
const CSS = `
.vss-text{box-sizing:border-box;width:100%;height:100%;overflow:auto;padding:.4em .55em;font:inherit;font-size:clamp(12px,2.6vw,15px);line-height:1.35;
  overflow-wrap:anywhere;word-break:normal;color:var(--vss-text-fg,#1d1d1f);background:var(--vss-text-bg,transparent);cursor:text;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.vss-text.vss-dictating{outline:2px solid var(--vss-accent,#2f6fdf);outline-offset:-2px}
.vss-text p,.vss-text h1,.vss-text h2,.vss-text h3,.vss-text ul,.vss-text ol{margin:.35em 0 0}
.vss-text>:first-child{margin-top:0}.vss-text .vss-line{margin-top:0}
.vss-text h1{font-size:1.45em}.vss-text h2{font-size:1.25em}.vss-text h3{font-size:1.1em}
.vss-text ul,.vss-text ol{padding-left:1.4em}.vss-text li{margin:0}
.vss-text .vss-size-small{font-size:.82em}.vss-text .vss-size-large{font-size:1.25em}.vss-text .vss-size-huge{font-size:1.6em}
.vss-text .vss-sel{background:var(--vss-sel,rgba(47,111,223,.28))}
.vss-text .vss-cand{outline:2px dashed var(--vss-warn,#d9822b);outline-offset:1px;border-radius:2px}
.vss-text .vss-cand-n{font-size:.7em;vertical-align:super;color:var(--vss-warn,#d9822b);font-weight:700;margin-left:1px}
.vss-text .vss-caret{display:inline-block;width:0;border-left:2px solid var(--vss-accent,#2f6fdf);margin-right:-2px;height:1.1em;vertical-align:text-bottom;animation:vss-blink 1s steps(1) infinite}
@keyframes vss-blink{50%{border-color:transparent}}
@media (prefers-color-scheme:dark){.vss-text{color:var(--vss-text-fg,#e8e8ea)}}
@media (prefers-reduced-motion:reduce){.vss-text .vss-caret{animation:none}}`;

function ensureStyle(docEl) {
  if (docEl.getElementById("vss-text-css")) return;
  const st = docEl.createElement("style"); st.id = "vss-text-css"; st.textContent = CSS; (docEl.head || docEl.documentElement).appendChild(st);
}

export function renderTextWidget(container, doc, { candidates = [], dictating = false, showCaret = true } = {}) {
  const D = container.ownerDocument; ensureStyle(D);
  container.textContent = ""; container.classList.add("vss-text"); container.classList.toggle("vss-dictating", !!dictating);
  container.setAttribute("role", "document"); container.setAttribute("aria-label", "text widget");
  const sel = doc.selectionRange(); const caret = showCaret && !doc.hasSelection() ? doc.cursor : -1;
  const candAt = (p) => candidates.findIndex((c) => p >= c.from && p < c.to);
  let list = null, listType = null;
  doc.blocks.forEach((b, i) => {
    const lt = b.type === "list_item" ? (b.list === "numbered" ? "ol" : "ul") : null;
    if (!lt) { list = null; listType = null; } else if (!list || listType !== lt) { list = D.createElement(lt); listType = lt; container.appendChild(list); }
    const el = D.createElement(lt ? "li" : b.type === "heading" ? `h${b.level}` : "p");
    if (i > 0 && b.brk === "line") el.className = "vss-line";
    if (b.align && b.align !== "left") el.style.textAlign = b.align === "justified" ? "justify" : b.align;
    const s0 = doc.blockStart(i);
    // group characters by (marks, selected, candidate) and cut at the caret
    let k = 0;
    const put = (node) => el.appendChild(node);
    const caretNode = () => { const c = D.createElement("span"); c.className = "vss-caret"; c.setAttribute("aria-hidden", "true"); return c; };
    while (k < b.text.length) {
      const p = s0 + k; if (p === caret) put(caretNode());
      const key = JSON.stringify(b.marks[k] || {}); const inSel = p >= sel.from && p < sel.to; const ci = candAt(p);
      let e = k + 1;
      while (e < b.text.length && s0 + e !== caret && JSON.stringify(b.marks[e] || {}) === key && (s0 + e >= sel.from && s0 + e < sel.to) === inSel && candAt(s0 + e) === ci) e++;
      let node = D.createElement("span"); node.dataset.from = String(p); node.textContent = b.text.slice(k, e);
      const m = b.marks[k] || {};
      if (m.size) node.className = `vss-size-${m.size}`;
      if (m.color) node.style.color = m.color;
      if (m.highlight) node.style.backgroundColor = m.highlight;
      if (m.bold) node.style.fontWeight = "700";
      if (m.italic) node.style.fontStyle = "italic";
      const deco = [m.underline ? "underline" : "", m.strike ? "line-through" : ""].filter(Boolean).join(" ");
      if (deco) node.style.textDecoration = deco;
      if (inSel) node.classList.add("vss-sel");
      if (ci >= 0) node.classList.add("vss-cand");
      put(node);
      if (ci >= 0 && candidates[ci].to === s0 + e) { const n = D.createElement("span"); n.className = "vss-cand-n"; n.textContent = String(ci + 1); put(n); }
      k = e;
    }
    if (s0 + b.text.length === caret) put(caretNode());
    if (!b.text.length && caret !== s0) el.appendChild(D.createElement("br"));
    el.dataset.block = String(i); el.dataset.end = String(s0 + b.text.length);
    (list && lt ? list : container).appendChild(el);
  });
  return container;
}

// the character offset under a pointer event (left half of a character -> before it); null when outside the text
function offsetAt(container, ev) {
  const D = container.ownerDocument; let node = null, off = 0;
  if (D.caretPositionFromPoint) { const c = D.caretPositionFromPoint(ev.clientX, ev.clientY); if (c) { node = c.offsetNode; off = c.offset; } }
  else if (D.caretRangeFromPoint) { const r = D.caretRangeFromPoint(ev.clientX, ev.clientY); if (r) { node = r.startContainer; off = r.startOffset; } }
  const span = node && (node.nodeType === 3 ? node.parentElement : node);
  if (span && span.dataset && span.dataset.from !== undefined) return Number(span.dataset.from) + off;
  const blk = ev.target && ev.target.closest ? ev.target.closest("[data-block]") : null;
  return blk ? Number(blk.dataset.end) : null;
}

export function mountTextWidget(box, doc, { onTap = null, candidates = [], dictating = false } = {}) {
  const D = box.ownerDocument; const el = D.createElement("div"); box.appendChild(el);
  let opts = { candidates, dictating };
  const draw = () => renderTextWidget(el, doc, opts);
  const tap = (ev) => { if (!onTap) return; const o = offsetAt(el, ev); if (o !== null) { ev.preventDefault(); onTap(o, ev); } };
  el.addEventListener("pointerup", tap);
  draw();
  return {
    element: el,
    update(next = {}) { opts = { ...opts, ...next }; draw(); },
    destroy() { el.removeEventListener("pointerup", tap); el.remove(); },
  };
}
