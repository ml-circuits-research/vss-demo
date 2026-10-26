// details.js (ui): the detail popups of a History entry (D21 item 5): the reading with its margins, the call as text, the plan, the SOP wires, the
// circuit of a paragraph, the sketch readings and the log line. DOM only; every value comes from what the entry holds (its `last`, `rec`, `sop`,
// `sketch`). Each is rendered into the body of an openPopup() (popup.js), laid out in columns across the width.
import { renderReading } from "./reading.js";
import { renderFrame, renderPlan, renderGeometry, renderUnitsPlan } from "./panel.js";
import { renderCircuit } from "../segment/view.js";
import { callText, intentOf, assistantLines, formatTime, sourceIcon } from "./entries.js";
import { renderSketchReadings } from "./sketchview.js";
import { PASS_OPTIONS } from "../sketch/scene_pass.js";

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const sec = (title, ...kids) => { const s = el("section"); if (title) s.append(el("h3", null, title)); s.append(...kids); return s; };

export const DETAIL_TITLES = { reading: "Reading with margins", call: "Call", plan: "Plan and geometry", sop: "SOP wires", circuit: "Circuit", sketch: "Sketch readings", log: "Log line" };

/** ctx: { legendOf(world) -> legend, tauOf(world) -> tau } */
export function renderDetail(body, kind, h, ctx = {}) {
  body.replaceChildren(); body.classList.add("sheet-grid", "detail-body");
  const L = h.last || null, best = L?.best, res = best?.result; const world = h.world || h.rec?.world || "diagram";
  body.append(el("p", "span-all detail-input", `“${h.input}”`));
  if (kind === "reading" && res) {
    const words = el("div"); renderReading(words, { result: res, corrections: best.corrections || [], labels: best.info?.labels || {}, world: h.routeLabel || world });
    const frame = el("div"); renderFrame(frame, { result: res, legend: ctx.legendOf?.(world) || null, tau: ctx.tauOf?.(world) ?? 0.05 });
    const m = el("div", "margin-table");
    const rows = Object.entries(res.margins || {}).filter(([, v]) => typeof v === "number");
    if (!rows.length) m.append(el("p", "muted", "No margin was reported."));
    for (const [k, v] of rows) { const r = el("div", "mrow"); r.append(el("span", null, k.replace(/_/g, " ")), el("span", v < (ctx.tauOf?.(world) ?? 0.05) ? "low" : null, v.toFixed(3))); m.append(r); }
    const note = el("p", "muted small", `status ${res.status}; residual ${(res.residual ?? 0).toFixed(3)}; ${(best.corrections || []).length ? `corrected: ${best.corrections.map((c) => `${c.from} to ${c.to}`).join(", ")}` : "no word was corrected"}; tau ${ctx.tauOf?.(world) ?? 0.05}.`);
    body.append(sec("The words", words), sec("The frame", frame), sec("Margins", m, note));
  } else if (kind === "call") {
    const lines = h.rec ? assistantLines(h.rec) : [];
    const list = el("div");
    for (const l of lines) {
      const b = el("div", "call-block"); if (lines.length > 1) b.append(el("div", "asst-input", `“${l.input}”`));
      b.append(el("div", "asst-intent", l.intent || "no intent read"), el("code", "asst-call", l.call || "(no call)"), el("div", "asst-outcome", `Editor: ${l.outcome}`));
      if (l.queries?.length) b.append(el("div", "muted", `Asked about: ${l.queries.map((q) => `${q.kind} ${q.about}`).join("; ")}`));
      list.append(b);
    }
    body.append(sec("The call it would make (shown as text; nothing is called)", list));
  } else if (kind === "plan") {
    const a = el("div"), g = el("div");
    if (L?.kind === "long" && L.circuit) renderUnitsPlan(a, { results: L.ex?.results, circuit: L.circuit, line: L.line }); else renderPlan(a, { plan: L?.plan, decision: L?.decision, execution: L?.execution });
    renderGeometry(g, { plan: L?.plan });
    body.append(sec("Plan", a), sec("Geometry", g));
  } else if (kind === "sop") {
    body.append(sec("What the reader wrote (SOP wires)", el("pre", "sop", h.sop || "")));
  } else if (kind === "circuit" && L?.circuit) {
    const host = el("div"); renderCircuit(host, L.circuit, {}); body.append(sec("The paragraph as a circuit of linked readings", host));
  } else if (kind === "sketch" && h.sketch) {
    body.classList.remove("sheet-grid"); const sk = h.sketch; const ctxMap = new Map((sk.context || []).map((c) => [c.ref, c]));
    renderSketchReadings(body, { strokes: sk.strokes, rec: sk.rec, readings: sk.readings, chosen: sk.chosen, lookup: (r) => ctxMap.get(r) || null, context: sk.context, low: PASS_OPTIONS.ambiguousMargin });
  } else if (kind === "log") {
    const [, label] = sourceIcon(h.source);
    const dl = el("dl", "log-dl");
    for (const [k, v] of [["time", formatTime(h.time)], ["source", label], ["input", h.input], ["read as", h.used || ""], ["world", h.world || ""], ["status", h.status || ""], ["action", h.action || ""], ["line", h.line || ""],
      ["intent", h.frame ? intentOf(h.world, h.frame) : ""], ["call", h.frame ? callText(h.frame) : ""]]) if (v) dl.append(el("dt", null, k), el("dd", null, String(v)));
    body.append(sec("The record of this input", dl));
  } else body.append(el("p", "muted span-all", "Nothing more was recorded for this entry."));
}
