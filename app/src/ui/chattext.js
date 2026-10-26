// chattext.js (ui): the words of the chat thread (D26). Pure text, no DOM: from decide()'s result to the plain sentences of the editor's
// reply, and from what the person typed to the choice it answers. No decisions: decide() has made them; this only says them in plain words.

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const stop = (s) => (/[.!?]$/.test(s) ? s : s + ".");
const sentence = (s) => stop(cap(String(s || "").trim()));
const unq = (s) => String(s).replace(/"/g, "");
const idRe = /\b(?:c|k|g)\d+\b/g;                     // internal component ids ("c3"): never said to the person
const PAST = { clear: "cleared", delete: "deleted", connect: "connected", move: "moved", copy: "copied", group: "grouped", ungroup: "ungrouped",
  lock: "locked", label: "labelled", bring: "brought", zoom: "zoomed", undo: "undone", redo: "redone", set: "changed", align: "aligned", distribute: "spread",
  arrange: "arranged", front: "brought to the front", back: "sent to the back" };

/** one planner step's `explain` as the thing that was done ("create a blue box called "mailer"" -> "a blue box called mailer") */
export function doneOf(explain) {
  let s = String(explain || "").trim(); if (!s) return "";
  let m;
  if ((m = /^create (an? .*)$/.exec(s))) return unq(m[1]);
  if ((m = /^set (\{.*\}) on (\d+) component/.exec(s))) {
    let what = "";
    try { what = Object.entries(JSON.parse(m[1])).map(([k, v]) => (k === "label" ? `the name ${v}` : k === "color" || k === "colour" ? v : `${k} ${v}`)).join(", "); } catch { what = ""; }
    return `changed ${m[2] === "1" ? "one component" : `${m[2]} components`}${what ? ` to ${what}` : ""}`;
  }
  if ((m = /^delete (\d+) component/.exec(s))) return `deleted ${m[1] === "1" ? "one component" : `${m[1]} components`}`;
  if ((m = /^connect \S+ to \S+( with an? (.*))?$/.exec(s))) return `connected two components${m[2] ? ` with a ${m[2]}` : ""}`;
  if ((m = /^label "(.*)"$/.exec(s))) return `named it ${m[1]}`;
  s = s.replace(idRe, "the component");
  const verb = s.split(/\s+/)[0]; if (PAST[verb]) return PAST[verb] + s.slice(verb.length);
  return unq(s);
}

/** the steps of an executed line ("a; b; c" from decide()) as one "Done: ..." sentence, equal steps counted */
export function doneLine(line) {
  const parts = String(line || "").split(/; (?=[a-z])/).map(doneOf).filter(Boolean);
  const out = [], seen = new Map();
  for (const p of parts) { if (seen.has(p)) seen.set(p, seen.get(p) + 1); else { seen.set(p, 1); out.push(p); } }
  const text = out.map((p) => (seen.get(p) > 1 ? `${p} (${seen.get(p)} times)` : p)).join("; ");
  return `Done: ${text}.`;
}

/** the editor's reply as plain sentences: {text} (the sentences) and {extra} (the second short sentence, from the notes that matter) */
export function plainReply(d) {
  const questions = d.questions || [];
  let first;
  if (d.action === "execute") first = d.plain ? sentence(d.line) : doneLine(d.line);   // d.plain: a line that is already a sentence (not a planner step list)
  else if (d.action === "ask") first = questions.length && questions.every((q) => q.text) ? questions.map((q) => sentence(q.text)).join(" ") : sentence(d.line);
  else {
    const l = String(d.line || ""); let m;
    if (/^no model is loaded/.test(l)) first = "No reader model is loaded.";
    else if ((m = /^I did not understand that \([^)]*\)\.?\s*(?:I can: (.*)\.)?\s*$/.exec(l))) first = `I did not understand that.${m[1] ? ` What I can do here: ${m[1].replace(/_/g, " ")}.` : ""}`;
    else if ((m = /^not done: (.*)$/.exec(l))) first = `I could not do that: ${m[1].replace(/\.$/, "")}.`;
    else if (/^this reading has no action/.test(l)) first = "I understood the words, but there is nothing to do with them here.";
    else if ((m = /^I can't do that( \(.*?\))?: it is not something this editor understands\.\s*(?:I can: (.*)\.)?\s*$/.exec(l))) first = `I can't do that${m[1] || ""}.${m[2] ? ` What I can do here: ${m[2].replace(/_/g, " ")}.` : ""}`;
    else first = sentence(l);
  }
  // D30: the corrector runs by itself; when something was done, the sentence says in brackets what was read differently from what was typed
  const fixes = (d.notes || []).filter((n) => n.kind === "correction").map((n) => /^read "?(.*?)"? as "?(.*?)"?$/.exec(String(n.text))).filter(Boolean).map((m) => `'${m[1]}' as '${m[2]}'`);
  if (d.action === "execute" && fixes.length) first = `${first.replace(/\.$/, "")} (I read ${fixes.join(", ")}).`;
  const extra = [];
  const FILLER = /^(a|an|the|called|named|it|its|to|of|and|please|then|with|in|on)$/i;
  // while the editor asks, the question is the whole reply; the notes are said after something was done or refused
  for (const n of d.action === "ask" ? [] : d.notes || []) {
    if (n.kind === "presence") { if (!questions.some((q) => q.role === n.role)) extra.push(sentence(n.text)); }
    else if (n.kind === "unplaced") { const w = unq(String(n.text).replace(/ was not used$/, "")); if (d.action === "execute" && !FILLER.test(w)) extra.push(`I did not use ${w}.`); }
    else if (n.kind === "blocked" && n.text) extra.push(sentence(n.text));
  }
  // a question with choices whose text is not already in the line is said after it
  const asked = [];
  for (const q of questions) if (q.text && q.candidates?.length && !String(d.line || "").includes(q.text)) asked.push(sentence(q.text));
  return { text: first, extra: [...extra.slice(0, 2), ...asked].join(" ") };
}

const norm = (s) => String(s ?? "").toLowerCase().replace(/[_\s]+/g, " ").replace(/^[\s"'“”]+|[\s"'“”.!?,]+$/g, "").trim();

/** does a typed or spoken message answer the editor's last question? choices = [{label, aliases?}]; returns the index or -1.
 *  It must equal a choice (its label or an alias, ignoring case, underscores and end punctuation); two choices with the same words
 *  cannot be told apart, so that is not an answer. */
export function matchChoice(choices, text) {
  const t = norm(text); if (!t) return -1;
  const hits = [];
  choices.forEach((c, i) => { if ([c.label, ...(c.aliases || [])].some((a) => norm(a) === t)) hits.push(i); });
  return hits.length === 1 ? hits[0] : -1;
}
