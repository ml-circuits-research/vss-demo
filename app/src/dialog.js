// dialog.js: from the reader's report and the plan to the editor's behaviour (spec 11, Table 8). Rules only; every outcome carries the
// rule that produced it, shown in the explanation panel.
//   decide({ result, plan, corrections, tau, legend }) -> { action: "execute" | "ask" | "refuse", line, questions, notes, rule }
// result: vss.read() output; plan: planner.plan() output (may be null when the reading is not executable); corrections: the corrector's.

const ROLE_WORD = { color: "colour", size: "size", style: "line style", text: "label", relation: "position", landmark: "reference component",
  region: "place on the canvas", anchor: "edge", fraction: "part of the way", amount: "amount", unit: "unit", direction: "direction",
  axis: "axis", layout: "arrangement", pairing: "pairing", source: "start component", target: "end component", quantity: "number", object: "component" };

const fillerText = (f) => !f ? "nothing" : f[0] === "entity" ? [f[3], f[2] ? (f[2][0] === "negword" ? "not-" : "") + f[2][1] : null, f[1]].filter(Boolean).join(" ") : (f[0] === "negword" ? "not " : "") + f[1];

export function capabilities(legend) {
  const evs = (legend?.events || []).map((e) => e.id);
  return evs.length ? `I can: ${evs.join(", ")}.` : "";
}

export function decide({ result, plan = null, corrections = [], tau = 0.05, legend = null, alternatives = null } = {}) {
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
  // a role under tau: ask about that role only, with the two best candidates when the reader gives them
  // one question per role: the role's lowest margin (identity, presence, attribute or determiner part)
  const byRole = new Map();
  for (const [k, v] of Object.entries(result.margins || {})) {
    if (typeof v !== "number" || v >= tau || k === "structure") continue;
    const role = k.split(".")[0]; if (!byRole.has(role) || v < byRole.get(role)[1]) byRole.set(role, [k, v]);
  }
  const low = [...byRole.values()];
  if (result.status === "abstain" || low.length) {
    const qs = low.map(([k, v]) => {
      const [role, part] = k.split(".");
      const cands = result.candidates?.[role]?.slice(0, 2) || [];
      const what = ROLE_WORD[role] || role;
      return { kind: "role", role, margin: v, candidates: cands,
        text: cands.length === 2 ? `which ${what}, ${cands[0]} or ${cands[1]}?` : part === "presence" ? `did you mean to give a ${what}?` : `which ${what}?` };
    });
    return { action: "ask", line: qs.map((q) => q.text).join(" "), questions: qs, notes, rule: `Table 8: a margin under tau = ${tau}` };
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
  const roles = Object.entries(result.frame?.roles || {}).map(([k, v]) => `${ROLE_WORD[k] || k} ${fillerText(v)}`);
  const line = (plan.steps || []).map((s) => s.explain).filter(Boolean).join("; ") || `${result.frame?.event}${roles.length ? ": " + roles.join(", ") : ""}`;
  if (plan.blocked && plan.blocked.length) notes.push({ kind: "blocked", text: plan.blocked.map((b) => b.text).join("; ") });
  return { action: "execute", line, questions: [], notes, rule: "Table 8: status ok, every margin above tau" };
}
