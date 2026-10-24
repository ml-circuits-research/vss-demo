// reading.js: the reading strip, the one distinctive element of the interface: the last sentence as the reader read it. Each word that
// fills a role is underlined in that role's colour with the role's name beneath; the verb carries the event; words the reader could not
// place are struck through in the warning colour; corrected words show what was typed. Pure DOM building, no decisions.

const ROLE_HUE = ["#2f7d5b", "#7a4fb5", "#b4572e", "#2c6aa0", "#9a7a14", "#a33d6b", "#3e8a8a", "#6b6f2a", "#8a4b2d", "#4f5fb0"];
export function roleColour(role) { let h = 0; for (const c of role) h = (h * 31 + c.charCodeAt(0)) >>> 0; return ROLE_HUE[h % ROLE_HUE.length]; }

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

/** token -> {role, part} from a frame: fillers, attributes, determiners, and the verb (lemma) */
export function tokenRoles(result) {
  const map = new Map(), fr = result?.frame; if (!fr) return map;
  const put = (w, role, part) => { if (w != null && !map.has(String(w))) map.set(String(w), { role, part }); };
  for (const [role, f] of Object.entries(fr.roles || {})) {
    if (!f) continue;
    if (f[0] === "entity") { put(f[1], role, "head"); if (f[2]) put(f[2][1], role, "attr"); if (f[3]) put(f[3], role, "det"); }
    else put(f[1], role, f[0] === "negword" ? "negated" : "value");
  }
  return map;
}

export function renderReading(host, { result, corrections = [], labels = {}, world = "diagram" } = {}) {
  host.replaceChildren();
  if (!result) { host.append(el("p", "reading-empty", "Type or say a command. The words you use appear here, marked with what each one did.")); return; }
  const roles = tokenRoles(result); const unplaced = new Set(result.unplaced || []);
  const corrected = new Map(corrections.map((c) => [c.to, c.from]));
  const lemma = result.frame?.lemma; const line = el("div", "reading-line");
  for (const t of result.tokens || []) {
    if (/^[.,;:!?]$/.test(t)) continue;
    const w = el("span", "tok"); const shown = labels[t] || t.replace(/_/g, " ");
    w.append(el("span", "tok-word", shown));
    const r = roles.get(t);
    if (r) { w.classList.add("tok-role"); w.style.setProperty("--role", roleColour(r.role)); w.append(el("span", "tok-label", r.part === "attr" || r.part === "det" ? `${r.role} ${r.part}` : r.part === "negated" ? `not ${r.role}` : r.role)); }
    else if (lemma && (t === lemma || t.startsWith(lemma))) { w.classList.add("tok-event"); w.append(el("span", "tok-label", result.frame.event || "?")); }
    else if (unplaced.has(t)) { w.classList.add("tok-unplaced"); w.append(el("span", "tok-label", "not understood")); }
    if (corrected.has(t)) { w.classList.add("tok-corrected"); w.title = `you typed "${corrected.get(t)}"`; w.append(el("span", "tok-typed", corrected.get(t))); }
    line.append(w);
  }
  host.append(line);
  const st = el("div", `reading-status st-${result.status}`);
  st.append(el("span", "st-dot"), el("span", null, result.status === "ok" ? "understood" : result.status === "abstain" ? "unsure about part of it" : "not understood"));
  if (result.frame?.neg) st.append(el("span", "st-neg", "prohibition"));
  st.append(el("span", "st-world", world));
  host.append(st);
}

/** a line that is not a diagram reading: dictated content or a widget command, with how it was taken and why */
export function renderNote(host, { text, as, reason = "", world = "", kind = "content", status = "ok" } = {}) {
  host.replaceChildren();
  const p = el("p", `reading-note ${kind}`); const q = el("span", "q", text); p.append(q, el("span", "as", as)); host.append(p);
  const st = el("div", `reading-status st-${status}`); st.append(el("span", "st-dot"), el("span", null, reason)); if (world) st.append(el("span", "st-world", world));
  host.append(st);
}

/** several units of one input (spec 15): each unit's reading in the strip, numbered in text order; the rest in the Circuit tab */
export function renderUnits(host, units, { max = 3, world = "diagram" } = {}) {
  host.replaceChildren(); const box = el("div", "reading-units");
  for (const u of units.slice(0, max)) {
    const row = el("div", "reading-unit"); row.append(el("span", "unit-n", String(u.i + 1)));
    const inner = el("div"); if (u.reading) renderReading(inner, { result: u.reading, world: u.mark ? `${world}, ${u.mark}` : world }); else inner.append(el("p", "reading-empty", u.text));
    row.append(inner); box.append(row);
  }
  if (units.length > max) box.append(el("p", "reading-more", `and ${units.length - max} more unit${units.length - max > 1 ? "s" : ""} in the Circuit tab`));
  host.append(box);
}
