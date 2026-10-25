// gaps.js: collecting the evidence that the legend lacks a question (vision/ADDENDUM_qformalisation_2026-10-25.md, section 4). DOM-free.
//
// Every reading already says where the legend fell short: unplaced words (no kind), roles under tau, a large residual, a status other
// than ok, and what the person did next (a reformulation right after an abstain is the strongest signal). This module keeps a LOCAL
// journal of those readings in the browser, lets the person mark a reading as "this should have worked" with an optional note, and
// exports or sends the journal only on an explicit action. Nothing leaves the device otherwise; the About panel says so.
//
// Entry: {t, world, route, input, tokens, status, event, roles, margins (min and the roles under tau), residual, unplaced, action,
//         outcome: accepted | corrected | reformulated | abandoned | marked, note?, next?}
// Privacy: labels are replaced by their kind token ("<label>") before an entry is stored, so names typed by the person never enter the
// journal; the input is kept as the normalized tokens with labels masked. Numbers are kept (they are values of the world).
//
//   const gaps = createGaps({ storage: localStorage, tau: 0.05, maxEntries: 2000 });
//   const id = gaps.record(entry);  gaps.mark(id, "should have moved the title")  gaps.outcome(id, "reformulated")
//   gaps.export() -> JSON text        gaps.send(url, { consent: true }) -> Promise<{ok, status, sent}>
//   gaps.summary() -> {entries, flagged, byStatus, topUnplaced, lowRoles}

const KEY = "vss-gaps-v1";

export function maskLabels(tokens, labels = {}) {
  const set = new Set(Object.keys(labels || {}));
  return tokens.map((t) => (set.has(t) ? "<label>" : t));
}

export function entryFromReading({ result, route, input, tokens, info, decision, tau = 0.05, world = "diagram" }) {
  const m = result?.margins || {}; const low = Object.entries(m).filter(([k, v]) => typeof v === "number" && v < tau && k !== "structure").map(([k]) => k);
  const vals = Object.values(m).filter((v) => typeof v === "number"); const min = vals.length ? Math.min(...vals) : null;
  return {
    t: new Date().toISOString(), world, route: route?.id || route || "?", input: maskLabels(tokens || [], info?.labels).join(" "),
    status: result?.status || "none", event: result?.frame?.event || null,
    roles: Object.fromEntries(Object.entries(result?.frame?.roles || {}).map(([r, f]) => [r, f ? (f[0] === "entity" ? f[1] : String(f[1])) : null])),
    minMargin: min, lowRoles: low, residual: result?.residual ?? null, unplaced: (result?.unplaced || []).filter((w) => !/^[.,;:!?]$/.test(w)),
    action: decision?.action || null, outcome: decision?.action === "execute" ? "accepted" : "pending",
  };
}

export function createGaps({ storage = null, tau = 0.05, maxEntries = 2000, now = () => Date.now() } = {}) {
  let entries = []; let lastId = 0;
  const load = () => { try { const raw = storage && storage.getItem(KEY); if (raw) { const o = JSON.parse(raw); entries = o.entries || []; lastId = o.lastId || entries.length; } } catch { entries = []; } };
  const save = () => { try { storage && storage.setItem(KEY, JSON.stringify({ entries, lastId })); } catch { /* storage unavailable: the journal lives for this visit only */ } };
  load();
  const find = (id) => entries.find((e) => e.id === id);

  function record(entry) {
    const id = ++lastId; const e = { id, ...entry };
    // the previous entry, when it was not accepted and this one comes right after, was reformulated (the strongest gap signal)
    const prev = entries[entries.length - 1];
    if (prev && prev.outcome === "pending" && now() - Date.parse(prev.t) < 60000) prev.outcome = "reformulated";
    entries.push(e); if (entries.length > maxEntries) entries = entries.slice(-maxEntries); save(); return id;
  }
  function outcome(id, o, extra = {}) { const e = find(id); if (!e) return false; e.outcome = o; Object.assign(e, extra); save(); return true; }
  function mark(id, note = "") { const e = find(id); if (!e) return false; e.outcome = "marked"; e.note = String(note).slice(0, 300); save(); return true; }

  function summary() {
    const byStatus = {}; const unplaced = new Map(); const low = new Map(); let flagged = 0;
    for (const e of entries) {
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
      if (e.outcome === "marked" || e.outcome === "reformulated") flagged++;
      for (const w of e.unplaced || []) unplaced.set(w, (unplaced.get(w) || 0) + 1);
      for (const r of e.lowRoles || []) low.set(r, (low.get(r) || 0) + 1);
    }
    const top = (mp, k = 10) => [...mp].sort((a, b) => b[1] - a[1]).slice(0, k).map(([w, n]) => ({ w, n }));
    return { entries: entries.length, flagged, byStatus, topUnplaced: top(unplaced), lowRoles: top(low) };
  }
  function exportText() {
    return JSON.stringify({ format: "vss-gaps-1", exported: new Date().toISOString(), app: "vss-diagram-editor", tau, summary: summary(), entries }, null, 1);
  }
  async function send(url, { consent = false, fetchFn = globalThis.fetch } = {}) {
    if (!consent) return { ok: false, status: 0, sent: 0, reason: "no consent" };
    if (!url) return { ok: false, status: 0, sent: 0, reason: "no endpoint" };
    const body = exportText();
    try {
      const r = await fetchFn(url, { method: "POST", headers: { "content-type": "application/json" }, body });
      if (r.ok) { for (const e of entries) e.sentAt = e.sentAt || new Date().toISOString(); save(); }
      return { ok: r.ok, status: r.status, sent: r.ok ? entries.length : 0 };
    } catch (err) { return { ok: false, status: 0, sent: 0, reason: String(err.message || err) }; }
  }
  function clear() { entries = []; save(); }
  return { record, outcome, mark, summary, export: exportText, send, clear, get size() { return entries.length; }, get entries() { return entries.slice(); } };
}
