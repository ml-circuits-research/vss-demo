// queries.js: the query wires of a reading, in one form for the dialog and the planner (vision/ADDENDUM_qformalisation_2026-10-25.md,
// section 7; field names as fixed in responses D8). Rules only.
//   queriesOf(result) -> [{ about, kind, evidence, resolve, scope, source }]
//     source "wire":   a `query` wire of the reading (type query; about, kind, evidence, resolve, scope);
//     source "signal": today's reader signals, which the addendum makes three kinds of the same wire:
//                      `_undecided.<role>=a|b` -> undecided, `_presence_query.<role>=m` -> undecided with presence: true, an unplaced word -> unplaced, status no-sense / unknown-event -> unknown.
//   resolveChain(q, ctx) -> { by, answer, tried } : the first resolver of q.resolve that answers; `person` always answers with a question.
//   linkLine(role, by) -> "_link.<role>=query:<by>" : how a resolved query is written on the consuming wire (never a bare value).

export const KINDS = ["undecided", "unplaced", "unknown", "unsupported", "inferred"];
export const RESOLVERS = ["circuit", "scene", "planner", "kb", "llm", "person"];
const NOT_IN_APP = new Set(["kb", "llm"]);           // no knowledge base and no large model run in the editor: tried, reported, never faked

const list = (v) => (v === null || v === undefined || v === "" ? [] : String(v).split(",").map((s) => s.trim()).filter(Boolean));
const PUNCT = /^[.,;:!?]$/;

function fromWire(w) {
  const v = (k) => (typeof w.value === "function" ? w.value(k) : (w.lines || []).find((l) => l.key === k)?.text ?? null);
  const kind = v("kind"); const resolve = list(v("resolve"));
  return { about: v("about") || "sentence", kind: KINDS.includes(kind) ? kind : "unknown", evidence: list(v("evidence")),
    resolve: resolve.length ? resolve : ["person"], scope: v("scope") || "local", source: "wire", id: w.id };
}

export function queriesOf(result) {
  if (!result) return [];
  const out = (result.wires || []).filter((w) => w.type === "query").map(fromWire);
  const covered = new Set(out.flatMap((q) => q.evidence.concat(list(q.about))));
  for (const [role, cands] of Object.entries(result.undecided || {}))
    if (!out.some((q) => q.kind === "undecided" && q.about.endsWith(`.${role}`)))
      out.push({ about: `$top.${role}`, role, kind: "undecided", evidence: cands, resolve: ["person"], scope: "local", source: "signal" });
  // `_presence_query.<role>=<margin>`: a role read as absent whose presence is near its threshold (D14); kind undecided, presence true
  for (const [role, margin] of Object.entries(result.presenceQueries || {}))
    out.push({ about: `$top.${role}`, role, kind: "undecided", presence: true, margin, evidence: result.offers?.[role] ? [result.offers[role]] : [],
      offer: result.offers?.[role] || null, resolve: ["person"], scope: "local", source: "signal" });   // offer: the word the reader proposes for the role (D27)
  if (result.status === "no-sense" || result.status === "unknown-event") {
    if (!out.some((q) => q.about === "sentence"))
      out.push({ about: "sentence", kind: "unknown", evidence: (result.unplaced || []).filter((t) => !PUNCT.test(t)), resolve: ["person"],
        scope: "local", source: "signal", residual: result.residual });
  } else {
    const undecidedWords = new Set(Object.values(result.undecided || {}).flat());
    for (const t of result.unplaced || []) if (!PUNCT.test(t) && !covered.has(t) && !undecidedWords.has(t))
      out.push({ about: t, kind: "unplaced", evidence: [t], resolve: ["person"], scope: "local", source: "signal" });
  }
  return out;
}

// ctx: { circuit?: (q) => answer|null, scene?: (q) => answer|null, planner?: (q) => answer|null }; an answer is any non-null value
export function resolveChain(q, ctx = {}) {
  const tried = [];
  for (const who of q.resolve) {
    if (who === "person") return { by: "person", answer: null, ask: true, tried };
    if (NOT_IN_APP.has(who)) { tried.push(`${who}: not available in the editor`); continue; }
    const fn = ctx[who]; if (typeof fn !== "function") { tried.push(`${who}: no resolver`); continue; }
    const a = fn(q); if (a !== null && a !== undefined) return { by: who, answer: a, ask: false, tried };
    tried.push(`${who}: no answer`);
  }
  return { by: null, answer: null, ask: false, tried };
}

export const linkLine = (role, by) => `_link.${role}=query:${by}`;
