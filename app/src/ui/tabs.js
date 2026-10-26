// tabs.js (ui): the renderers of the History, Actions and Assistant tabs and of the examples sheet. DOM only; the rows come from
// entries.js (plain data) and the example list from examples.js. No decisions.
import { historyRow, assistantLines } from "./entries.js";
import { renderFrame } from "./panel.js";
import { renderReading } from "./reading.js";

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const MAX_ROWS = 200;

/** History: one row per input, newest first. onPick(input) puts the input back into the chat input (it does not run it). */
export function renderHistory(host, history, { onPick } = {}) {
  host.replaceChildren();
  host.append(el("p", "tab-lead muted", "Every input, newest first: what was typed or said, what was read, and how sure the reader was. A click puts a typed or spoken input back into the input bar; it does not run it."));
  if (!history.length) { host.append(el("p", "muted", "Nothing yet.")); return; }
  const list = el("ol", "hist-list");
  for (const h of history.slice().reverse().slice(0, MAX_ROWS)) {
    const r = historyRow(h);
    const li = el("li", `hist-row act-${r.action}`); li.dataset.source = h.source || "";
    const top = el("div", "hist-top");
    const ic = el("span", "src-icon", r.icon); ic.title = r.sourceLabel; ic.setAttribute("aria-label", r.sourceLabel);
    top.append(el("span", "hist-time", r.time), ic);
    const text = r.rereadable ? el("button", "hist-input link-btn", r.input) : el("span", "hist-input", r.input);
    if (r.rereadable) { text.type = "button"; text.title = "Put this input back into the input bar"; text.onclick = () => onPick && onPick(r.input); }
    top.append(text);
    if (r.status) top.append(el("span", `chip st-${r.status.replace(/\s.*/, "")}`, r.status));
    li.append(top);
    const meta = el("div", "hist-meta muted");
    const bits = [];
    if (r.read) bits.push(`read as: ${r.read}`);
    if (r.world) bits.push(`world ${r.world}`);
    if (r.event) bits.push(r.event);
    if (r.minMargin != null) bits.push(`min margin ${r.minMargin.toFixed(3)}`);
    if (r.residual != null) bits.push(`residual ${r.residual.toFixed(3)}`);
    meta.textContent = bits.join(" · "); if (bits.length) li.append(meta);
    if (r.outcome && r.outcome !== r.event) {
      const out = el("div", "hist-outcome"); if (r.behaviour) out.append(el("span", `chip beh beh-${r.behaviour}`, r.behaviour), " ");
      out.append(r.outcome); li.append(out);
    }
    if (r.rule) li.append(el("div", "act-rule", `Rule: ${r.rule}`));
    const best = h.last?.best;
    if (best?.result) {   // what the reader made of each word (the reading strip of earlier builds)
      const d = el("details", "hist-reading"); d.append(el("summary", null, "How the words were read"));
      const box = el("div"); renderReading(box, { result: best.result, corrections: best.corrections || [], labels: best.info?.labels || {}, world: h.routeLabel || h.world || "diagram" }); d.append(box); li.append(d);
    }
    list.append(li);
  }
  host.append(list);
}

/** Actions: Table 8, one line per reading: sentence, status, the behaviour, the rule that decided it, the plan's steps, the queries */
export function renderActions(host, records) {
  host.replaceChildren();
  host.append(el("p", "tab-lead muted", "Table 8 of the specification, one line per reading: what the editor did with it and the rule that decided it."));
  if (!records.length) { host.append(el("p", "muted", "No reading yet.")); return; }
  const list = el("ol", "act-list");
  for (const r of records.slice().reverse().slice(0, MAX_ROWS)) {
    const li = el("li", `act-row beh-${r.behaviour}`);
    const top = el("div", "act-top");
    top.append(el("span", "act-sentence", r.input), el("span", `chip st-${String(r.status).replace(/\s.*/, "")}`, r.status), el("span", `chip beh beh-${r.behaviour}`, r.behaviour));
    li.append(top, el("div", "act-rule", `Rule: ${r.rule}`));
    if (r.steps.length) { const ol = el("ol", "steps"); for (const s of r.steps) ol.append(el("li", null, s)); li.append(ol); }
    if (r.queries.length) li.append(el("div", "act-queries muted", `Queries: ${r.queries.map((q) => `${q.kind} (${q.about})`).join("; ")}`));
    list.append(li);
  }
  host.append(list);
}

/** Assistant: per reading the intent, the call as text and the outcome; a header that says what the tab is not */
export function renderAssistant(host, records) {
  host.replaceChildren();
  host.append(el("p", "tab-lead", "Shows how a request is read and which call it would make; not an agent."));
  const lines = records.slice().reverse().slice(0, MAX_ROWS).flatMap((r) => assistantLines(r));
  if (!lines.length) { host.append(el("p", "muted", "No request yet.")); return; }
  const list = el("ol", "asst-list");
  for (const l of lines) {
    const li = el("li", "asst-row");
    li.append(el("div", "asst-input", `“${l.input}”`), el("div", "asst-intent", l.intent || "no intent read"));
    li.append(el("code", "asst-call", l.call || "(no call)"));
    li.append(el("div", "asst-outcome", `Editor: ${l.outcome}`));
    if (l.queries.length) li.append(el("div", "asst-queries muted", `Asked about: ${l.queries.map((q) => `${q.kind} ${q.about}`).join("; ")}`));
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
