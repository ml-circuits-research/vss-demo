// panel.js: the explanation panel (spec 11): what the reader read (frame, margins, presence, residual, status), what the editor planned
// (steps, questions, blocked steps, how each description was resolved), the geometry it solved, and the SOP text. Readable at a glance:
// one bar per margin against tau, empty roles in grey. DOM only; the content comes from the reader, the planner and the dialog.
import { roleColour } from "./reading.js";

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const fill = (f) => !f ? "" : f[0] === "entity" ? [f[3], f[2] ? (f[2][0] === "negword" ? "not " : "") + f[2][1] : null, f[1]].filter(Boolean).join(" ") : (f[0] === "negword" ? "not " : "") + String(f[1]).replace(/_/g, " ");

function bar(value, tau, max = 0.6) {
  const b = el("span", "mbar"); const v = Math.max(0, Math.min(1, (value ?? 0) / max));
  const i = el("span", "mbar-fill"); i.style.width = `${(v * 100).toFixed(1)}%`; if ((value ?? 0) < tau) i.classList.add("low");
  const t = el("span", "mbar-tau"); t.style.left = `${(Math.min(1, tau / max) * 100).toFixed(1)}%`;
  b.append(i, t); b.title = `margin ${(value ?? 0).toFixed(3)} (tau ${tau})`; return b;
}

export function renderFrame(host, { result, legend, tau = 0.05 }) {
  host.replaceChildren();
  if (!result) { host.append(el("p", "muted", "Nothing read yet.")); return; }
  const fr = result.frame || {};
  const head = el("div", "frame-head");
  head.append(el("span", "frame-event", fr.event || "no action"), el("span", `chip st-${result.status}`, result.status));
  if (fr.neg) head.append(el("span", "chip warn", "prohibition"));
  host.append(head);
  const tbl = el("div", "frame-roles");
  const roles = (legend?.roles || []).map((r) => r.id); const present = fr.roles || {};
  const all = roles.length ? roles : Object.keys(present);
  for (const r of all.filter((x) => present[x])) {
    const row = el("div", "frow");
    const name = el("span", "frole", r); if (present[r]) name.style.setProperty("--role", roleColour(r));
    row.append(name, el("span", "fval", present[r] ? fill(present[r]) : "not given"));
    const m = result.margins?.[r]; row.append(present[r] && m != null ? bar(m, tau) : el("span", "mbar-none"));
    tbl.append(row);
  }
  if (!Object.keys(present).length) tbl.append(el("p", "muted", "No role was filled."));
  host.append(tbl);
  const empty = all.filter((x) => !present[x]);
  if (empty.length) host.append(el("p", "frame-empty", `Not given: ${empty.join(", ")}.`));
  const foot = el("div", "frame-foot");
  foot.append(el("span", null, `structure margin ${(result.margins?.structure ?? 0).toFixed(3)}`), el("span", null, `residual ${(result.residual ?? 0).toFixed(3)}`),
    el("span", null, `${(result.timings?.total_ms ?? 0).toFixed(1)} ms`));
  host.append(foot);
}

export function renderPlan(host, { plan, decision, execution }) {
  host.replaceChildren();
  if (!plan && !decision) { host.append(el("p", "muted", "No plan yet.")); return; }
  if (decision) { const d = el("p", `decision act-${decision.action}`, decision.line); d.title = decision.rule; host.append(d, el("p", "rule", decision.rule)); }
  if (plan?.steps?.length) { const ol = el("ol", "steps"); plan.steps.forEach((s) => ol.append(el("li", null, s.explain || s.op))); host.append(ol); }
  if (plan?.resolutions?.length) {
    const ul = el("ul", "resolutions");
    for (const r of plan.resolutions) ul.append(el("li", null, `${r.role}: "${r.text}" -> ${r.ids.length ? r.ids.join(", ") : "nothing"} (${r.rule})`));
    host.append(el("h4", null, "References"), ul);
  }
  if (plan?.blocked?.length) { host.append(el("h4", null, "Blocked")); for (const b of plan.blocked) host.append(el("p", "warn", b.text || JSON.stringify(b))); }
  if (execution?.notes?.length) { host.append(el("h4", null, "Notes")); for (const n of execution.notes) host.append(el("p", null, n)); }
}

export function renderGeometry(host, { plan }) {
  host.replaceChildren();
  const steps = (plan?.steps || []).filter((s) => s.constraints && s.constraints.length);
  if (!steps.length) { host.append(el("p", "muted", "No position was computed for the last request.")); return; }
  for (const s of steps) {
    host.append(el("h4", null, s.explain || s.op));
    const ul = el("ul", "constraints"); for (const c of s.constraints) ul.append(el("li", null, c)); host.append(ul);
  }
}

export function renderSOP(host, { result, circuit }) {
  host.replaceChildren();
  const pre = el("pre", "sop", circuit?.sop || result?.sop || "");
  host.append(pre);
}

/** the sketch recognition (spec 17): every stroke group with its kind, its best candidates and margin (low margins marked), the scene
 *  pass's explanation and which scene reader is active */
export function renderSketch(host, { rec, res, low = 0.2 }) {
  host.replaceChildren();
  host.append(el("p", "decision", `Recognised ${rec.groups.length} stroke group${rec.groups.length === 1 ? "" : "s"}`), el("p", "rule", res.active));
  const ul = el("ul", "rec-list");
  for (const g of rec.groups) {
    const li = el("li"); const m = g.margin ?? 1; li.append(el("span", null, `${g.id}: ${String(g.kind).replace(/_/g, " ")}`), el("span", m < low ? "low" : "muted", `margin ${m.toFixed(2)}`));
    const c = (g.candidates || []).slice(0, 3).map((x) => `${String(x.kind).replace(/_/g, " ")} ${(+x.score).toFixed(2)}`).join(", ");
    li.append(el("span", "cands", `${c}${g.reason ? `; ${g.reason}` : ""}`)); ul.append(li);
  }
  host.append(ul);
  if (res.questions?.length) { host.append(el("h4", null, "Questions")); for (const q of res.questions) host.append(el("p", null, q.text)); }
  if (res.explain?.length) { host.append(el("h4", null, "Scene pass")); const ol = el("ol", "steps"); for (const x of res.explain) ol.append(el("li", null, x)); host.append(ol); }
}

/** several units (spec 15): one line per unit with its mark, what it did and why */
export function renderUnitsPlan(host, { results, circuit, line }) {
  host.replaceChildren();
  if (line) host.append(el("p", "decision", line));
  const ol = el("ol", "steps"); const byI = new Map((results || []).map((r) => [r.unit, r]));
  for (const u of circuit.units) {
    const r = byI.get(u.i); const li = el("li");
    li.append(el("span", null, `"${u.text}": `), el("strong", null, r ? r.mark : "not run"));
    const why = r ? (r.reason || r.steps.join("; ")) : ""; if (why) li.append(el("div", "rule", why)); ol.append(li);
  }
  host.append(ol);
  if (circuit.conflicts?.length) { host.append(el("h4", null, "Conflicts")); for (const k of circuit.conflicts) host.append(el("p", null, k.text)); }
  if (circuit.cycle) host.append(el("p", "warn", circuit.cycle.text));
}

/** the active text or formula widget (spec 14, 16): its name, the reader in use, the last decision and the document's outline */
export function renderWidgetInfo(host, { title, kind, reader, decision, outline, hint }) {
  host.replaceChildren();
  const head = el("div", "widget-head"); head.append(el("strong", null, title), el("span", "chip", kind)); host.append(head);
  if (reader) host.append(el("p", "rule", reader));
  if (decision) host.append(el("p", null, decision));
  if (outline != null) { host.append(el("h4", null, "Content")); host.append(el("pre", "widget-outline", outline || "(empty)")); }
  if (hint) host.append(el("p", "frame-empty", hint));
}
