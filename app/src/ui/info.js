// info.js (ui): the About panel's lists (every world and its model, every module and its status) and the Settings panel's threshold
// text. DOM only; the statuses are computed by main.js from what is loaded.
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

/** rows: [{name, status, note, dev}] */
export function renderRows(host, rows, cls = "mod-row") {
  host.replaceChildren();
  for (const r of rows) { const d = el("div", cls); d.append(el("strong", null, r.name), el("span", `st${r.dev ? " dev" : ""}`, r.status + (r.note ? `. ${r.note}` : ""))); host.append(d); }
}

/** lines: [string] */
export function renderLines(host, lines) { host.replaceChildren(...lines.map((t) => el("p", null, t))); }
