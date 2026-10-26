// dialog.js: from the reader's report and the plan to the editor's behaviour (spec 11, Table 8). Rules only; every outcome carries the
// rule that produced it, shown in the explanation panel.
//   decide({ result, plan, corrections, tau, legend }) -> { action: "execute" | "ask" | "refuse", line, questions, notes, rule, queries }
// result: vss.read() output; plan: planner.plan() output (may be null when the reading is not executable); corrections: the corrector's.
// queries: the reading's query wires and signals (queries.js); every one is answered, asked or reported, none is silent (addendum 7).
import { queriesOf } from "./queries.js";

const ROLE_WORD = { color: "colour", size: "size", style: "line style", text: "label", relation: "position", landmark: "reference component",
  region: "place on the canvas", anchor: "edge", fraction: "part of the way", amount: "amount", unit: "unit", direction: "direction",
  axis: "axis", layout: "arrangement", pairing: "pairing", source: "start component", target: "end component", quantity: "number", object: "component" };

const fillerText = (f) => !f ? "nothing" : f[0] === "entity" ? [f[3], f[2] ? (f[2][0] === "negword" ? "not-" : "") + f[2][1] : null, f[1]].filter(Boolean).join(" ") : (f[0] === "negword" ? "not " : "") + f[1];

export function capabilities(legend) {
  const evs = (legend?.events || []).map((e) => e.id);
  return evs.length ? `I can: ${evs.join(", ")}.` : "";
}

export function decide(args = {}) {
  const queries = queriesOf(args.result); const d = decideWith(args, queries); d.queries = queries; return d;
}

function decideWith({ result, plan = null, corrections = [], tau = 0.05, legend = null, alternatives = null } = {}, queries = []) {
  const notes = [];
  for (const c of corrections) notes.push({ kind: "correction", text: `read "${c.from}" as "${c.to}"`, revert: c });
  if (alternatives && alternatives.ranked && alternatives.ranked.length > 1) notes.push({ kind: "alternatives", text: alternatives.reason });
  if (!result) return { action: "refuse", line: "no model is loaded", questions: [], notes, rule: "no reader" };
  if (result.status === "no-sense" || result.status === "unknown-event") {
    const unk = (result.unplaced || []).filter((t) => !/^[.,;:!?]$/.test(t));
    const qs = unk.length ? [{ kind: "unknown-word", words: unk, text: `I don't know ${unk.length === 1 ? "the word" : "the words"} ${unk.map((w) => `"${w}"`).join(", ")}. Use ${unk.length === 1 ? "it" : "them"} as a label?` }] : [];
    return { action: "refuse", line: `I did not understand that (${result.status}). ${capabilities(legend)}`.trim(), questions: qs, notes,
      rule: "Table 8: unknown-event or no-sense -> say what was not understood, list what the editor can do" };
  }
  // a request whose question the legend does not have (a query of kind unsupported about the sentence): refuse, saying what was not
  // supported; never read it as the nearest command of the world
  const whole = queries.find((q) => q.kind === "unsupported" && q.about === "sentence");
  if (whole) return { action: "refuse", line: `I can't do that${whole.evidence.length ? ` ("${whole.evidence.join(" ")}")` : ""}: it is not something this editor understands. ${capabilities(legend)}`.trim(),
    questions: [], notes, rule: "addendum q-formalisation 7: a query of kind unsupported about the sentence -> refuse, say what is not supported" };
  for (const q of queries) if (q.kind === "unplaced") notes.push({ kind: "unplaced", text: `"${q.about}" was not used` });
  // undecided by adjacency (addendum q-formalisation 10): two words of the sentence the state cannot separate for one role -> ask which
  // of the two, never the catalog's runner-up; the answer keeps the chosen word and drops the other (it filled no role)
  const undecided = queries.filter((q) => q.kind === "undecided" && !q.presence && q.evidence.length === 2).map((q) => {
    const role = q.role || q.about.split(".").pop(); const cands = q.evidence;
    return { kind: "undecided", role, margin: 0, candidates: cands, text: `which ${ROLE_WORD[role] || role}, ${cands[0]} or ${cands[1]}?` };
  });
  // a role under tau: ask about that role only, with the two best candidates when the reader gives them
  // one question per role: the role's lowest margin (identity, presence, attribute or determiner part)
  const byRole = new Map();
  for (const [k, v] of Object.entries(result.margins || {})) {
    if (typeof v !== "number" || v >= tau || k === "structure") continue;
    const role = k.split(".")[0]; if (undecided.some((q) => q.role === role)) continue;
    if (!byRole.has(role) || v < byRole.get(role)[1]) byRole.set(role, [k, v]);
  }
  // a role read as ABSENT whose presence is near its threshold is not asked: the declared default applies and the answer says so
  // (Table 8, "a required role empty: use the declared default and say so"); a question is asked only about what the reading contains
  const present = result.frame?.roles || {};
  for (const [role, [k]] of [...byRole]) {
    if (!present[role] && k.endsWith(".presence")) { byRole.delete(role); notes.push({ kind: "presence", role, text: `a ${ROLE_WORD[role] || role} may have been meant; none was used` }); }
  }
  // presence queries (`_presence_query.<role>`, D14): the same rule, from the reader's own signal; the question is returned with "execute"
  const presenceQs = [];
  for (const q of queries) if (q.presence && !present[q.role]) {
    const what = ROLE_WORD[q.role] || q.role;
    notes.push({ kind: "presence", role: q.role, text: `a ${what} may have been meant; none was used` });
    presenceQs.push({ kind: "presence", role: q.role, text: `did you mean to give a ${what}?`, candidates: ["yes", "no"] });
  }
  const low = [...byRole.values()];
  if (undecided.length || low.length) {
    const qs = undecided.concat(low.map(([k, v]) => {
      const [role, part] = k.split(".");
      const cands = result.candidates?.[role]?.slice(0, 2) || [];
      const what = ROLE_WORD[role] || role;
      return { kind: "role", role, margin: v, candidates: cands,
        text: cands.length === 2 ? `which ${what}, ${cands[0]} or ${cands[1]}?` : part === "presence" ? `did you mean to give a ${what}?` : `which ${what}?` };
    }));
    return { action: "ask", line: qs.map((q) => q.text).join(" "), questions: qs, notes,
      rule: undecided.length ? "addendum q-formalisation 10: two adjacent words undecided for a role -> ask which" : `Table 8: a margin under tau = ${tau}` };
  }
  if (!plan) return { action: "refuse", line: "this reading has no action in the editor", questions: [], notes, rule: "no action schema" };
  if (plan.blocked && plan.blocked.length && !plan.steps.length) {
    const b = plan.blocked[0];
    return { action: "refuse", line: `not done: ${b.text || "blocked by a lock"}`, questions: [], notes, rule: "spec 10.4: a lock blocks the step" };
  }
  if (plan.questions && plan.questions.length) {
    return { action: "ask", line: plan.questions.map((q) => q.text).join(" "), questions: plan.questions, notes,
      rule: "Table 8: a description matches none or several components, or a required role is empty" };
  }
  // a phrase the legend has no question for, attached to an executable command: ask before doing the rest without it
  const partial = queries.filter((q) => q.kind === "unsupported" && q.about !== "sentence");
  if (partial.length) {
    const words = partial.flatMap((q) => q.evidence);
    return { action: "ask", line: `I can't handle "${words.join(" ")}". Do the rest without it?`, notes,
      questions: [{ kind: "unsupported", words, candidates: ["yes", "no"], text: `do the rest without "${words.join(" ")}"?` }],
      rule: "addendum q-formalisation 7: a query of kind unsupported inside a command -> ask before executing the rest" };
  }
  const roles = Object.entries(result.frame?.roles || {}).map(([k, v]) => `${ROLE_WORD[k] || k} ${fillerText(v)}`);
  const line = (plan.steps || []).map((s) => s.explain).filter(Boolean).join("; ") || `${result.frame?.event}${roles.length ? ": " + roles.join(", ") : ""}`;
  if (plan.blocked && plan.blocked.length) notes.push({ kind: "blocked", text: plan.blocked.map((b) => b.text).join("; ") });
  return { action: "execute", line, questions: presenceQs, notes,
    rule: presenceQs.length ? "Table 8: a required role empty -> use the declared default and say so (presence query)" : "Table 8: status ok, every margin above tau" };
}

// Animation readings (spec 19, src/animate/README.md): whether a reading of the animation world is a question about the film, a film
// command, a correction of an existing unit or a new unit. Stated rule: mood question -> question; play / pause / rewind / loop -> film;
// retime, or a correction word (actually, instead, no, rather) -> correction; anything else -> a new unit.
export const CORRECTION_WORDS = ["actually", "instead", "no", "rather"];
export function animationIntent(frame, tokens = []) {
  if (!frame || !frame.event) return { intent: "none", rule: "no event read" };
  if (frame.mood === "question") return { intent: "question", rule: "a question about the film" };
  if (["play", "pause", "rewind", "loop"].includes(frame.event)) return { intent: "film", rule: `"${frame.event}": a film command` };
  if (frame.event === "retime") return { intent: "correction", rule: "retime: a correction of an existing unit" };
  const w = tokens.find((t) => CORRECTION_WORDS.includes(t));
  if (w) return { intent: "correction", rule: `the correction word "${w}"` };
  return { intent: "unit", rule: "a new unit of the timeline" };
}

// The answer to an undecided pair: the input without the word not chosen (its first whole-word occurrence, case-insensitive; a token
// joined by "_" by the normalizer is also matched with spaces). The input is returned unchanged when the word is not found.
export function dropWord(input, word) {
  if (!word) return input;
  const esc = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const w of [word, word.replace(/_/g, " ")]) {
    const re = new RegExp(`(^|\\s)${esc(w)}(?=\\s|[.,;:!?]|$)`, "i");
    if (re.test(input)) return input.replace(re, "$1").replace(/\s{2,}/g, " ").trim();
  }
  return input;
}
