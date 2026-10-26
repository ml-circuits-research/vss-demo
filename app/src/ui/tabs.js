// tabs.js (ui): the renderers of the History tab, the examples sheet and the Requests popup. DOM only; the rows come from entries.js (plain data)
// and the example list from examples.js. No decisions.
import { historyRow, meaningOf, detailKinds } from "./entries.js";
import { renderFrame } from "./panel.js";
import { DETAIL_TITLES } from "./details.js";

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const MAX_ROWS = 200;

/** History, the single record (D21 item 5): one entry per input, newest first. For each: when and how it was given, the text, what it meant
 *  (intent and call, or what was drawn), what the editor did (executed / asked / refused) with the rule, and buttons that open every technical
 *  detail as a popup. onPick(input) puts the input back into the chat input (it does not run it); onDetail(entry, kind) opens a detail;
 *  onRequests() opens the Requests popup. */
export function renderHistory(host, history, { onPick, onDetail, onRequests, hasChat, onChat } = {}) {
  host.replaceChildren();
  const head = el("div", "hist-head");
  head.append(el("p", "tab-lead", "Every input, newest first: what was typed, said or drawn, what it meant, and what the editor did with it. A click on a typed or spoken input puts it back into the input bar; it does not run it."));
  const rb = el("button", "hist-requests", "Requests"); rb.type = "button"; rb.id = "btn-requests"; rb.title = "Type a request and see how every world reads it (nothing is executed)"; rb.onclick = () => onRequests && onRequests();
  head.append(rb); host.append(head);
  if (!history.length) { host.append(el("p", "muted", "Nothing yet.")); return; }
  const list = el("ol", "hist-list");
  for (const h of history.slice().reverse().slice(0, MAX_ROWS)) {
    const r = historyRow(h), m = meaningOf(h);
    const li = el("li", `hist-row act-${r.action}`); li.dataset.source = h.source || "";
    const top = el("div", "hist-top");
    const ic = el("span", "src-icon", r.icon); ic.title = r.sourceLabel; ic.setAttribute("aria-label", r.sourceLabel);
    top.append(el("span", "hist-time", r.time), ic);
    const text = r.rereadable ? el("button", "hist-input link-btn", r.input) : el("span", "hist-input", r.input);
    if (r.rereadable) { text.type = "button"; text.title = "Put this input back into the input bar"; text.onclick = () => onPick && onPick(r.input); }
    top.append(text);
    if (hasChat && hasChat(h)) { const cb = el("button", "chat-link link-btn", "in the chat"); cb.type = "button"; cb.title = "Scroll the chat to this message"; cb.onclick = () => { if (!(onChat && onChat(h))) { cb.disabled = true; cb.title = "This message is no longer in the chat"; } }; top.append(cb); }
    if (r.status) top.append(el("span", `chip st-${r.status.replace(/\s.*/, "")}`, r.status));
    li.append(top);
    if (r.read) li.append(el("div", "hist-line muted", `read as: ${r.read}`));
    const fixes = (h.variants || []).find((v) => v.chosen)?.corrections || [];
    if (fixes.length) { const d = el("div", "hist-line"); d.append(el("span", "hist-label", "Corrected")); fixes.forEach((c, i) => { if (i) d.append(", "); d.append(el("span", "hist-corr", c.to), ` (typed ${c.from})`); }); li.append(d); }
    if (m.meant) { const d = el("div", "hist-line"); d.append(el("span", "hist-label", "Meant"), el("code", "hist-meant", m.meant)); li.append(d); }
    if (m.did) {
      const d = el("div", "hist-line"); d.append(el("span", "hist-label", m.kind === "sketch" ? "Drew" : "Did"));
      if (r.behaviour) d.append(el("span", `chip beh beh-${r.behaviour}`, r.behaviour), " ");
      d.append(m.did); li.append(d);
    }
    if (m.steps.length && m.kind === "long") { const ol = el("ol", "steps hist-steps"); for (const s of m.steps) ol.append(el("li", null, s)); li.append(ol); }
    if (h.sketch?.summary) for (const [label, text] of h.sketch.summary) { const d = el("div", "hist-line"); d.append(el("span", "hist-label", label), text); li.append(d); }
    if (m.rule) li.append(el("div", "act-rule", `Rule: ${m.rule}`));
    const nums = []; if (r.minMargin != null) nums.push(`min margin ${r.minMargin.toFixed(3)}`); if (r.residual != null) nums.push(`residual ${r.residual.toFixed(3)}`);
    if (nums.length) li.append(el("div", "hist-line muted small", nums.join(" · ")));
    const det = el("div", "hist-details");
    for (const k of detailKinds(h)) { const b = el("button", "detail-btn", DETAIL_TITLES[k]); b.type = "button"; b.dataset.detail = k; b.onclick = () => onDetail && onDetail(h, k); det.append(b); }
    li.append(det);
    list.append(li);
  }
  host.append(list);
}

/** the examples sheet: groups = [{group, items: [{text, note}]}]; a click calls onPick(text) and nothing else */
export function renderExamples(host, groups, { onPick } = {}) {
  host.replaceChildren();
  for (const g of groups) {
    const sec = el("section", "ex-group"); host.append(sec);
    sec.append(el("h3", null, g.group));
    const ul = el("ul", "ex-list");
    for (const e of g.items) {
      const li = el("li"); const b = el("button", "ex", e.text); b.type = "button"; b.onclick = () => onPick && onPick(e.text);
      li.append(b); if (e.note) li.append(el("span", "ex-note muted small", e.note)); ul.append(li);
    }
    sec.append(ul);
  }
  if (!groups.length) host.append(el("p", "muted", "No example is available for the installed models."));
}

/** Requests: the result of one request, from entries.js requestView(): a row per world, the chosen world (or the refusal), the frame with
 *  its margins, the queries and the call that would be made. legendOf(world) -> legend, tauOf(world) -> tau. */
export function renderRequestResult(host, view, { legendOf = () => null, tauOf = () => 0.05 } = {}) {
  host.replaceChildren();
  if (!view) { host.append(el("p", "muted", "No request yet.")); return; }
  host.append(el("div", "asst-input", `“${view.input}”`));
  const tbl = el("table", "req-worlds");
  const head = el("tr"); for (const h of ["World", "Status", "Residual", "Min margin"]) head.append(el("th", null, h)); tbl.append(head);
  for (const r of view.rows) {
    const tr = el("tr", view.chosen && view.chosen.world === r.world ? "req-chosen" : null);
    tr.append(el("td", null, r.world), el("td", null, r.status), el("td", null, r.residual == null ? "n/a" : r.residual.toFixed(3)), el("td", null, r.minMargin == null ? "n/a" : r.minMargin.toFixed(3)));
    tbl.append(tr);
  }
  host.append(tbl);
  if (!view.chosen) { host.append(el("p", "req-refusal act-refuse", view.refusal)); return; }
  host.append(el("p", "req-choice", `Chosen world: ${view.chosen.world}`));
  const fr = el("div", "req-frame"); renderFrame(fr, { result: view.chosen.result, legend: legendOf(view.chosen.world), tau: tauOf(view.chosen.world) }); host.append(fr);
  if (view.queries.length) {
    const ul = el("ul", "req-queries muted");
    for (const q of view.queries) ul.append(el("li", null, `${q.kind}${q.presence ? " (presence)" : ""}: ${q.about}${q.evidence.length ? ` [${q.evidence.join(", ")}]` : ""}`));
    host.append(el("h4", null, "Queries"), ul);
  }
  host.append(el("h4", null, "Would call:"), el("code", "asst-call req-call", view.call || "(no call)"));
}
