// entries.js (ui): the rows of the History, Actions and Assistant tabs, as plain data built from what main.js already holds
// (S.history entries, S.last). Pure functions, no DOM and no decisions: every word on screen comes from the reader's frame, the dialog's
// decision or the planner's plan. Tested in node (app/tests/entries.mjs).
import { queriesOf } from "../queries.js";

const fillerText = (f) => !f ? "" : f[0] === "entity" ? [f[2] ? (f[2][0] === "negword" ? "not " : "") + f[2][1] : null, f[1]].filter(Boolean).join(" ").replace(/_/g, " ") : (f[0] === "negword" ? "not " : "") + String(f[1]);

/** the filler of a role as text: an entity is "attribute head" ("red box"), a word is the word as read */
export const fillerString = fillerText;

/** the call a frame would make, as text: create(object="red box", text="payments", region="top_left"); a prohibition is prefixed "not " */
export function callText(frame) {
  if (!frame || !frame.event) return "";
  const args = Object.entries(frame.roles || {}).filter(([, f]) => f).map(([r, f]) => `${r}=${JSON.stringify(fillerText(f))}`);
  return `${frame.neg ? "not " : ""}${frame.event}(${args.join(", ")})`;
}

/** the intent of a reading: <world>.<event> */
export const intentOf = (world, frame) => (frame?.event ? `${world || "diagram"}.${frame.event}` : "");

/** the lowest margin of the roles the frame fills (the structure margin when it fills none); null when there is no result */
export function minMargin(result) {
  if (!result || !result.margins) return null;
  const present = Object.keys(result.frame?.roles || {});
  const vals = Object.entries(result.margins).filter(([k, v]) => typeof v === "number" && present.includes(k.split(".")[0])).map(([, v]) => v);
  if (!vals.length && typeof result.margins.structure === "number") vals.push(result.margins.structure);
  return vals.length ? Math.min(...vals) : null;
}

/** what the handlers can state about a reading, to be merged into an S.history entry */
export const historyExtras = (result, world) => (result ? { world, frame: result.frame || null, minMargin: minMargin(result), residual: result.residual ?? null } : {});

const SOURCE = { typed: ["T", "typed"], speech: ["V", "voice"], script: ["S", "script"], sketch: ["K", "sketch"], button: ["B", "button"], pointer: ["P", "pointer"], dictation: ["D", "dictation"], file: ["F", "file"], formula: ["f", "formula"] };
/** [icon letter, label] of an input source */
export const sourceIcon = (s) => SOURCE[s] || ["?", String(s || "input")];

export function formatTime(ms) {
  if (ms == null) return "";
  const d = new Date(ms); const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/** a line of the History tab from an S.history entry */
export function historyRow(h) {
  const [icon, label] = sourceIcon(h.source);
  const filled = Object.entries(h.frame?.roles || {}).filter(([, f]) => f);
  return {
    time: formatTime(h.time), icon, sourceLabel: label, input: h.input, read: h.used && h.used !== h.input ? h.used : "", world: h.world || "",
    status: h.status || "", action: h.action || "",
    event: h.frame?.event ? `${h.frame.event}${filled.length ? ": " + filled.map(([r, f]) => `${r} ${fillerText(f)}`).join(", ") : ""}` : (h.line || ""),
    minMargin: h.minMargin ?? null, residual: h.residual ?? null, rereadable: h.source === "typed" || h.source === "speech",
    behaviour: h.rec?.behaviour || "", rule: h.rec?.rule || "", outcome: h.line || "", steps: h.rec?.steps || [],
  };
}

const BEHAVIOUR = { execute: "executed", ask: "asked", refuse: "refused" };
/** the behaviour of Table 8: executed / asked / defaulted / refused; "defaulted" is an execution where a role near its threshold was left to its declared default */
export function behaviourOf(decision) {
  if (!decision) return "";
  if (decision.action === "execute" && (decision.notes || []).some((n) => n.kind === "presence")) return "defaulted";
  return BEHAVIOUR[decision.action] || decision.action;
}

/** the record kept for a reading (a diagram or a paragraph reading), made from S.last when it is set; null for the other kinds */
export function readingRecord(last, { time = null, world = null } = {}) {
  if (!last || (last.kind !== "diagram" && last.kind !== "long")) return null;
  if (last.kind === "long") {
    const units = (last.units || []).filter((u) => u.reading).map((u) => ({ text: u.text, frame: u.reading.frame || null, status: u.reading.status, mark: u.mark }));
    const w = last.ex?.waiting; const ran = units.some((u) => u.mark === "executed");
    const behaviour = w?.cycle ? "refused" : w?.conflicts ? "asked" : last.ex?.stoppedAt != null ? (ran ? "asked" : "refused") : "executed";
    return { time, kind: "long", input: last.input, world: world || "diagram", status: `${units.length} units`, behaviour,
      rule: "Section 15: several commands in one input; each unit is read, then run in order", line: last.line || "",
      steps: units.map((u, i) => `unit ${i + 1}: ${u.text} (${u.mark || "not run"})`), queries: [], questions: [], units, frame: null };
  }
  const d = last.decision || {}; const result = last.best?.result;
  return {
    time, kind: "diagram", input: last.input, world: world || last.world || last.best?.route?.world || "diagram", status: result?.status || "", behaviour: behaviourOf(d),
    rule: d.rule || "", line: d.line || "", steps: (last.plan?.steps || []).map((s) => s.explain || s.op), queries: (d.queries || []).map((q) => ({ kind: q.kind, about: q.about })),
    questions: (d.questions || []).map((q) => q.text), frame: result?.frame || null, units: null,
  };
}

/** the Assistant lines of a record: one per reading (one per unit for a paragraph): the intent, the call as text and the editor's outcome */
export function assistantLines(rec) {
  if (!rec) return [];
  if (rec.kind === "long") return rec.units.map((u) => ({ time: rec.time, input: u.text, intent: intentOf(rec.world, u.frame), call: callText(u.frame), outcome: u.mark ? String(u.mark) : "not run", queries: [] }));
  const outcome = rec.behaviour === "asked" ? `asked: ${(rec.questions || []).join(" ")}` : rec.behaviour === "refused" ? `refused: ${rec.line}`
    : rec.behaviour === "defaulted" ? "executed, with a default for a role that was not given" : rec.behaviour || "none";
  return [{ time: rec.time, input: rec.input, intent: intentOf(rec.world, rec.frame), call: callText(rec.frame), outcome, queries: rec.queries || [] }];
}

const num = (v) => (typeof v === "number" ? v.toFixed(3) : "n/a");
/** the Requests tab's data from worlds.js dispatch(): {rows, chosen, refusal, call, queries}. One row per world that read the request
 *  (status, residual, lowest margin of the roles filled); chosen = the dispatch's best reading (status ok or abstain), else a refusal line
 *  that names every world's residual. Rows keep dispatch's order (the chosen world first). */
export function requestView(disp, text = "") {
  const rows = (disp?.readings || []).map((r) => ({ world: r.world, status: r.result.status, residual: r.result.residual ?? null, minMargin: minMargin(r.result) }));
  const best = disp?.best || null;
  const refusal = best ? null : rows.length
    ? `No world explains this request (${rows.map((r) => `${r.world}: ${r.status}, residual ${num(r.residual)}`).join("; ")}). It is refused, not guessed.`
    : "No reader is installed: nothing can read this request.";
  return { input: text, rows, chosen: best ? { world: best.world, result: best.result } : null, refusal,
    call: best ? callText(best.result.frame) : "", queries: best ? queriesOf(best.result) : [] };
}

/** what an input meant, for the History entry: {kind: "reading" | "long" | "sketch" | "other", meant, did, rule, steps}. `meant` is the intent with its call (a
 *  reading), the number of commands (a paragraph) or nothing (a sketch, other inputs); `did` is what the editor did, said as the dialog said it. */
export function meaningOf(h) {
  const rec = h.rec;
  if (h.sketch) return { kind: "sketch", meant: "", did: h.line || "", rule: "", steps: [] };
  if (rec?.kind === "long") return { kind: "long", meant: `${rec.units.length} command${rec.units.length === 1 ? "" : "s"} in one input`, did: h.line || "", rule: rec.rule, steps: rec.steps };
  if (rec) {
    const call = callText(rec.frame);
    return { kind: "reading", meant: call ? `${rec.world || "diagram"}.${call}` : `nothing it could read (${rec.status || "no status"})`, did: h.line || "", rule: rec.rule, steps: rec.steps };
  }
  return { kind: "other", meant: "", did: h.line || "", rule: "", steps: [] };
}

/** the detail popups an entry opens: reading (words, frame, margins), call, plan, sop, circuit, sketch, log (always) */
export function detailKinds(h) {
  const out = [], L = h.last || null;
  if (L?.best?.result) out.push("reading");
  if (h.rec && (h.rec.frame || h.rec.units?.length)) out.push("call");
  if (L?.plan?.steps?.length || L?.ex || h.rec?.steps?.length) out.push("plan");
  if (h.sop) out.push("sop");
  if (L?.circuit) out.push("circuit");
  if (h.sketch) out.push("sketch");
  out.push("log");
  return out;
}
