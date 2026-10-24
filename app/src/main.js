// main.js: the wiring of the editor (spec section 2, Table 1). input -> normalizer -> corrector -> (segmenter) -> reader -> clearest
// alternative -> dialog -> planner -> engine -> panels. No decision is taken here: each stage is its own module with its stated rules;
// this file passes data between them and keeps the history.
import { createAssets } from "./assets.js";
import { loadWorlds, lexiconOf } from "./worlds.js";
import { createNormalizer } from "./normalize.js";
import { createCorrector } from "./correct.js";
import { createFormIndex } from "./form.js";
import { createSpeech, chooseClearest } from "./speech.js";
import { decide } from "./dialog.js";
import { createScene } from "./editor/scene.js";
import { plan as makePlan, execute, undo, redo } from "./editor/planner.js";
import { renderReading } from "./ui/reading.js";
import { renderFrame, renderPlan, renderGeometry, renderSOP } from "./ui/panel.js";
import { exportSVG, exportPNG, exportJSON, importJSON, createView } from "./ui/canvas.js";

const $ = (id) => document.getElementById(id);
const S = {
  assets: createAssets(), worlds: new Map(), diagram: null, normalize: null, corr: { classic: null, form: null }, formIndex: null,
  scene: createScene(), view: null, speech: null, settings: loadSettings(), history: [], last: null, segment: null, dictation: null,
};

function loadSettings() { try { return Object.assign({ corrector: "classic", theme: "auto", speakback: false }, JSON.parse(localStorage.getItem("vss-settings") || "{}")); } catch { return { corrector: "classic", theme: "auto", speakback: false }; } }
function saveSettings() { try { localStorage.setItem("vss-settings", JSON.stringify(S.settings)); } catch { /* private mode: settings for this visit only */ } }
function applyTheme() { if (S.settings.theme === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.dataset.theme = S.settings.theme; }

// ------------------------------------------------------------------ start
async function start() {
  applyTheme();
  S.view = createView($("canvas"), S.scene, { onChange: onManualChange, onSelect: () => {} });
  const { worlds, errors, index } = await loadWorlds(S.assets);
  S.worlds = worlds; S.index = index; S.diagram = worlds.get("diagram") || null;
  try { S.normalize = createNormalizer(await S.assets.json("model/diagram/normalize.json")); } catch { S.normalize = (t) => ({ tokens: t.toLowerCase().split(/\s+/).filter(Boolean), info: { labels: {}, numbers: {} } }); errors.push("normalize.json missing: plain lower-casing"); }
  if (S.diagram) await setupCorrectors();
  try { S.segment = await import("./segment/segment.js"); } catch { S.segment = null; }
  try { S.dictation = await import("./text/dictation.js"); } catch { S.dictation = null; }
  showModelBadge(errors);
  setupSpeech(); setupUI(); refresh();
}

async function setupCorrectors() {
  const lex = lexiconOf(S.diagram);
  let isEnglish = () => false;
  try {
    if (globalThis.Typo) { const aff = await S.assets.text("vendor/typo/en_US/en_US.aff"), dic = await S.assets.text("vendor/typo/en_US/en_US.dic"); const typo = new globalThis.Typo("en_US", aff, dic); isEnglish = (w) => /^[a-z]+$/.test(w) && typo.check(w); }
  } catch { /* without the dictionary every unknown word is a correction candidate; stated in About */ }
  S.corr.classic = createCorrector({ lexicon: lex, isEnglish });
  S.formIndex = createFormIndex({ words: Object.keys(lex), D: 512 });
  S.corr.form = createCorrector({ lexicon: lex, isEnglish, candidates: S.formIndex.asCandidateFn() });
}

function labelsInScene() { return [...S.scene.components.values()].map((c) => c.label).filter(Boolean).map((l) => l.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")); }

// ------------------------------------------------------------------ the pipeline
function readVariants(alternatives, source) {
  const mode = source === "speech" ? "speech" : "typed"; const cands = [];
  const corr = S.settings.corrector === "off" ? null : S.corr[S.settings.corrector] || S.corr.classic;
  if (corr) { const ls = labelsInScene(); corr.setLabels(ls); if (S.settings.corrector === "form") S.formIndex.setLabels(ls); }
  for (const alt of alternatives) {
    const n = S.normalize(alt.text);
    const c = corr ? corr.correct(n.tokens, { mode }) : { tokens: n.tokens, corrections: [], alternatives: [n.tokens] };
    c.alternatives.forEach((v, i) => cands.push({ input: v.join(" "), tokens: v, info: n.info, corrections: i === 0 ? c.corrections : [], heard: alt.text }));
  }
  const seen = new Set(); const uniq = cands.filter((c) => (seen.has(c.input) ? false : (seen.add(c.input), true)));
  const readings = uniq.map((c) => ({ ...c, result: S.diagram.vss.read(c.input) }));
  return chooseClearest(readings);
}

function handle(alternatives, source = "typed") {
  const text = alternatives[0]?.text?.trim(); if (!text) return;
  if (!S.diagram) { showAnswer({ action: "refuse", line: "No reader model is installed in this copy of the editor. You can still draw with the mouse or by touch." }); return; }
  // several commands in one input: the segmenter (spec 15) when present
  if (S.segment && S.segment.looksLong && S.segment.looksLong(text)) return handleLong(text, source);
  const choice = readVariants(alternatives, source); const best = choice.best;
  const p = ["ok", "abstain"].includes(best.result.status) ? makePlan(S.scene, best.result.frame, best.info) : null;
  const d = decide({ result: best.result, plan: p, corrections: best.corrections, tau: S.diagram.tau, legend: S.diagram.legend, alternatives: choice });
  let ex = null;
  if (d.action === "execute") { ex = execute(S.scene, p); }
  S.last = { input: text, best, choice, plan: p, decision: d, execution: ex };
  S.history.push({ input: text, source, used: best.input, status: best.result.status, line: d.line, action: d.action, sop: best.result.sop });
  refresh(); showAnswer(d);
  if (S.settings.speakback && d.action === "execute" && globalThis.speechSynthesis) speechSynthesis.speak(new SpeechSynthesisUtterance(d.line));
}

function handleLong(text, source) {
  const res = S.segment.understand ? S.segment.understand(text, { read: (t) => S.diagram.vss.read(t), normalize: S.normalize, scene: S.scene, plan: makePlan, execute }) : null;
  if (!res) return;
  S.last = { input: text, long: res, best: res.units?.[res.units.length - 1]?.reading ? { result: res.units[res.units.length - 1].reading, corrections: [], info: {} } : null, plan: res.plan || null, decision: res.decision || null, circuit: res.circuit };
  S.history.push({ input: text, source, used: text, status: res.status || "circuit", line: res.line || "", action: res.action || "execute", sop: res.circuit?.sop || "" });
  refresh(); showAnswer(res.decision || { action: "execute", line: res.line || "done" });
}

function onManualChange(kind, detail) { S.history.push({ input: `(${kind}) ${detail?.op || ""}`, source: "pointer", used: "", status: "", line: detail?.op || "", action: "manual" }); refresh(); }

// ------------------------------------------------------------------ rendering
function refresh() {
  S.view.render({ highlight: S.last?.plan?.questions?.flatMap((q) => q.candidates || []) || [] });
  $("empty-hint").hidden = S.scene.components.size > 0 || !!S.last;
  const best = S.last?.best;
  renderReading($("reading"), { result: best?.result, corrections: best?.corrections || [], labels: best?.info?.labels || {}, world: "diagram" });
  renderFrame($("tab-frame"), { result: best?.result, legend: S.diagram?.legend, tau: S.diagram?.tau ?? 0.05 });
  renderPlan($("tab-plan"), { plan: S.last?.plan, decision: S.last?.decision, execution: S.last?.execution });
  renderGeometry($("tab-geometry"), { plan: S.last?.plan });
  renderSOP($("tab-sop"), { result: best?.result, circuit: S.last?.circuit });
  const circ = $("tab-circuit"); circ.replaceChildren();
  if (S.last?.circuit && S.segment?.renderCircuit) S.segment.renderCircuit(circ, S.last.circuit); else circ.append(Object.assign(document.createElement("p"), { className: "muted", textContent: "A paragraph of several commands shows here as a circuit of linked readings." }));
  const log = $("tab-log"); log.replaceChildren();
  for (const h of S.history.slice().reverse()) { const d = document.createElement("div"); d.className = "log-item"; d.innerHTML = ""; const a = document.createElement("div"); a.className = "log-in"; a.textContent = h.input; const b = document.createElement("div"); b.className = "log-out"; b.textContent = `${h.action}${h.status ? ", " + h.status : ""}: ${h.line}`; d.append(a, b); log.append(d); }
}

function showAnswer(d) {
  const host = $("answer"); host.replaceChildren();
  const line = document.createElement("span"); line.className = `line act-${d.action}`; line.textContent = d.line; host.append(line);
  for (const q of d.questions || []) {
    if (q.kind === "role" && q.candidates?.length) for (const c of q.candidates) host.append(chip(String(c).replace(/_/g, " "), () => rerunWith(q.role, c)));
    if (q.kind === "which" && q.candidates?.length) q.candidates.forEach((id, i) => host.append(chip(`${i + 1}: ${describeId(id)}`, () => { S.scene.selection = [id]; rerunLast(); })));
    if (q.kind === "unknown-word") host.append(chip(`use "${q.words.join(" ")}" as a label`, () => runText(`${S.last.input} called ${q.words.join(" ")}`)));
  }
  for (const n of d.notes || []) if (n.kind === "correction") host.append(chip(`undo correction: ${n.revert.to} -> ${n.revert.from}`, () => runRaw(S.last.input, { corrector: "off" })));
}
const chip = (text, fn) => { const b = document.createElement("button"); b.type = "button"; b.textContent = text; b.onclick = fn; return b; };
const describeId = (id) => { const c = S.scene.components.get(id); return c ? `${c.label ? `"${c.label}" ` : ""}${c.word}` : id; };
function rerunLast() { if (S.last) handle([{ text: S.last.input }]); }
function rerunWith(role, value) { if (!S.last) return; runText(`${S.last.input} ${String(value).replace(/_/g, " ")}`); }
function runText(t) { $("input").value = ""; handle([{ text: t }]); }
function runRaw(t, over) { const keep = S.settings.corrector; S.settings.corrector = over.corrector; handle([{ text: t }]); S.settings.corrector = keep; }

function showModelBadge(errors) {
  const b = $("model-badge"); const d = S.diagram;
  if (!d) { b.hidden = false; b.textContent = "no reader model"; b.classList.add("dev"); }
  else { b.hidden = false; b.textContent = d.status === "demo" ? `reader D ${d.vss.model.config.D}` : "development model"; b.classList.toggle("dev", d.status !== "demo"); b.title = d.note || ""; }
  const host = $("about-models"); host.replaceChildren();
  for (const [name, w] of S.worlds) { const r = document.createElement("div"); r.className = "model-row"; r.innerHTML = `<strong></strong> <span></span>`; r.firstChild.textContent = name; r.lastChild.textContent = `${w.status === "demo" ? "demo model" : "development model, not for measurement"}; D ${w.vss.model.config.D}, ${w.bits} bits. ${w.note || ""}`; if (w.status !== "demo") r.lastChild.className = "dev"; host.append(r); }
  for (const e of errors) { const p = document.createElement("p"); p.className = "muted"; p.textContent = e; host.append(p); }
  const m = $("about-measured"); m.replaceChildren(); const p = document.createElement("p");
  p.textContent = S.index?.measured || "No number of this copy has been measured on a trained demo model yet. The criteria are in the specification (section 21); this panel lists only the criteria that were met.";
  m.append(p);
}

// ------------------------------------------------------------------ input, voice, panels, dialogs
function setupSpeech() {
  const mic = $("btn-mic");
  S.speech = createSpeech({
    onInterim: (t) => { const r = $("reading"); r.replaceChildren(Object.assign(document.createElement("p"), { className: "interim", textContent: t })); },
    onFinal: ({ alternatives }) => handle(alternatives, "speech"),
    onState: (st) => mic.classList.toggle("listening", st === "listening"),
    onError: (e) => showAnswer({ action: "refuse", line: `Voice: ${e}` }),
  });
  const info = S.speech.info(); $("voice-info").textContent = info.note; mic.disabled = !info.available; if (!info.available) mic.title = info.note;
  const down = (e) => { e.preventDefault(); S.speech.start(); }, up = (e) => { e.preventDefault(); S.speech.stop(); };
  mic.addEventListener("pointerdown", down); mic.addEventListener("pointerup", up); mic.addEventListener("pointerleave", (e) => { if (S.speech.listening) up(e); });
  let spaceDown = false;
  document.addEventListener("keydown", (e) => { if (e.code === "Space" && document.activeElement === $("input") && !$("input").value && !spaceDown && info.available) { spaceDown = true; e.preventDefault(); S.speech.start(); } });
  document.addEventListener("keyup", (e) => { if (e.code === "Space" && spaceDown) { spaceDown = false; S.speech.stop(); } });
}

function setupUI() {
  $("input-form").addEventListener("submit", (e) => { e.preventDefault(); const t = $("input").value; $("input").value = ""; handle([{ text: t }]); });
  for (const b of $("hint-examples").querySelectorAll("button")) b.onclick = () => runText(b.textContent);
  $("btn-undo").onclick = () => { undo(S.scene); refresh(); }; $("btn-redo").onclick = () => { redo(S.scene); refresh(); };
  $("btn-fit").onclick = () => S.view.fit();
  const app = $("app");
  $("btn-panel").onclick = () => { const open = app.classList.toggle("panel-open"); $("btn-panel").setAttribute("aria-expanded", String(open)); };
  if (matchMedia("(min-width: 821px)").matches) { app.classList.add("panel-open"); $("btn-panel").setAttribute("aria-expanded", "true"); }
  for (const t of document.querySelectorAll(".tabs button")) t.onclick = () => {
    for (const u of document.querySelectorAll(".tabs button")) u.setAttribute("aria-selected", String(u === t));
    for (const b of document.querySelectorAll(".tab-body")) b.hidden = b.id !== `tab-${t.dataset.tab}`;
  };
  // settings
  const ds = $("dlg-settings");
  $("btn-settings").onclick = () => { for (const [k, v] of Object.entries(S.settings)) { const r = ds.querySelector(`[name="${k}"][value="${v}"]`); if (r) r.checked = true; const c = ds.querySelector(`[name="${k}"][type=checkbox]`); if (c) c.checked = !!v; } ds.showModal(); };
  ds.addEventListener("change", (e) => { const t = e.target; S.settings[t.name] = t.type === "checkbox" ? t.checked : t.value; saveSettings(); applyTheme(); });
  $("btn-about").onclick = () => $("dlg-about").showModal();
  // export
  const dx = $("dlg-export"); $("btn-export").onclick = () => dx.showModal();
  dx.addEventListener("close", async () => {
    const v = dx.returnValue; const stamp = new Date().toISOString().slice(0, 10);
    if (v === "svg") download(new Blob([exportSVG(S.scene)], { type: "image/svg+xml" }), `diagram-${stamp}.svg`);
    if (v === "png") download(await exportPNG(S.scene, 2), `diagram-${stamp}.png`);
    if (v === "json") download(new Blob([exportJSON(S.scene)], { type: "application/json" }), `diagram-${stamp}.json`);
    if (v === "sop") download(new Blob([S.history.filter((h) => h.sop).map((h) => h.sop).join("\n")], { type: "text/plain" }), `diagram-${stamp}.sop`);
  });
  $("import-file").addEventListener("change", async (e) => { const f = e.target.files[0]; if (!f) return; const sc = importJSON(await f.text()); S.scene = sc; S.view.setScene(sc); dx.close(); refresh(); });
}

function download(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }

if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !globalThis.__VSS_BUNDLE__) navigator.serviceWorker.register("sw.js").catch(() => {});
start().catch((e) => { console.error(e); showAnswer({ action: "refuse", line: `The editor could not start: ${e.message}` }); });
