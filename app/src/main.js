// main.js: the wiring of the editor (spec section 2, Table 1). input -> normalizer -> corrector -> (segmenter) -> reader -> clearest
// alternative -> dialog -> planner -> engine -> panels; and the modes that reuse it: dictation into a text widget (spec 14, src/text),
// a formula widget (16, src/formula), the sketch pad (17, src/sketch), long input and scripts (15, 18, src/segment, src/script) and the
// film (19, src/animate). No decision is taken here: each stage is its own module with its stated rules; this file passes data between
// them, keeps the history and says on screen which reader (or which fallback) answered.
import { createAssets } from "./assets.js";
import { loadWorlds, lexiconOf } from "./worlds.js";
import { createNormalizer } from "./normalize.js";
import { createCorrector } from "./correct.js";
import { createFormIndex } from "./form.js";
import { createSpeech, chooseClearest } from "./speech.js";
import { decide, animationIntent } from "./dialog.js";
import { createScene } from "./editor/scene.js";
import * as ops from "./editor/ops.js";
import { place } from "./editor/geometry.js";
import { plan as makePlan, execute, undo, redo } from "./editor/planner.js";
import { renderReading, renderNote, renderUnits } from "./ui/reading.js";
import { renderFrame, renderPlan, renderGeometry, renderSOP, renderSketch, renderUnitsPlan, renderWidgetInfo } from "./ui/panel.js";
import { exportSVG, exportPNG, exportJSON, importJSON, createView } from "./ui/canvas.js";
import { createSlots } from "./ui/widgets.js";
import { createFilm } from "./ui/film.js";
import { createSketchMode } from "./ui/sketch.js";
import { createScriptDialog } from "./ui/script.js";
import { renderRows, renderLines } from "./ui/info.js";
import { formulaPhrase, textCapable, findTextWidget, textHeight, looksLikeScript } from "./widgets.js";
// text widgets and dictation (spec 14)
import { TextDoc } from "./text/doc.js";
import { createDictation } from "./text/dictation.js";
import { createTextNormalizer } from "./text/textnorm.js";
import { plan as planText, execute as executeText } from "./text/commands.js";
import { DICTATION_TABLE } from "./text/table.js";
// formula widgets (spec 16)
import { FormulaDoc, hole } from "./formula/tree.js";
import { toLatex } from "./formula/latex.js";
import { toMathML } from "./formula/mathml.js";
import * as parsers from "./formula/parse.js";
import { handleInput as formulaInput, execute as executeFormula, frameFromWires } from "./formula/commands.js";
import { mountFormula } from "./formula/view.js";
// sketch (spec 17)
import { recognise } from "./sketch/recognise.js";
import { scenePass, applyToScene, toCircuit, WORD_OF, PASS_OPTIONS } from "./sketch/scene_pass.js";
// long input and scripts (spec 15, 18)
import { segment, readerAdapter, candidateCuts } from "./segment/segment.js";
import { buildCircuit, unitsFromSegments, executeCircuit } from "./segment/circuit.js";
import { renderCircuit } from "./segment/view.js";
import { readScript, buildScript, runScript, undoToCheckpoint, documentModel, authorReport } from "./script/script.js";
// animation (spec 19)
import { createTimeline, add as addUnit, correct as correctUnit } from "./animate/timeline.js";
import { answer as answerFilm } from "./animate/questions.js";
import { exportJSON as filmJSON, exportSVG as filmSVG, exportWebM, capabilities as filmCaps, importTimeline } from "./animate/export.js";

const $ = (id) => document.getElementById(id);
const DEFAULTS = { corrector: "classic", theme: "auto", speakback: false, lang: "en-US" };
const S = {
  assets: createAssets(), worlds: new Map(), diagram: null, normalize: null, corr: { classic: null, form: null }, formIndex: null,
  scene: createScene(), view: null, speech: null, settings: loadSettings(), history: [], last: null,
  mode: "command", active: null, texts: new Map(), formulas: new Map(), dict: null, textedit: null, textNorm: null, calibration: null,
  formulaView: null, matheditor: null, animation: null, animNorm: null, segReader: null, script: null, panelTab: "frame",
};

function loadSettings() { try { return Object.assign({ ...DEFAULTS }, JSON.parse(localStorage.getItem("vss-settings") || "{}")); } catch { return { ...DEFAULTS }; } }
function saveSettings() { try { localStorage.setItem("vss-settings", JSON.stringify(S.settings)); } catch { /* private mode: settings for this visit only */ } }
function applyTheme() { if (S.settings.theme === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.dataset.theme = S.settings.theme; }

// ------------------------------------------------------------------ start
async function start() {
  applyTheme();
  S.view = createView($("canvas"), S.scene, { onChange: onManualChange, onSelect, onEditLabel });
  S.slots = createSlots($("canvas"), { textDoc: textDocOf, formula: (id) => S.scene.components.get(id)?.formula || null, label: (id) => S.scene.components.get(id)?.label || null,
    active: () => S.active, dictating: () => (S.mode === "dictation" ? S.active : null) });
  const { worlds, errors, index } = await loadWorlds(S.assets);
  S.worlds = worlds; S.index = index; S.loadErrors = errors; S.diagram = worlds.get("diagram") || null;
  try { S.normalize = createNormalizer(await S.assets.json("model/diagram/normalize.json")); } catch { S.normalize = (t) => ({ tokens: t.toLowerCase().split(/\s+/).filter(Boolean), info: { labels: {}, numbers: {} } }); errors.push("normalize.json missing: plain lower-casing"); }
  if (S.diagram) { await setupCorrectors(); S.segReader = readerAdapter(S.diagram.vss); }
  await setupTextedit(); setupMatheditor(); await setupAnimation();
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

// the textedit world (spec 14.3) when its model is installed; without it dictation writes everything as content and says so
async function setupTextedit() {
  const w = S.worlds.get("textedit"); let table = DICTATION_TABLE;
  if (w) {
    S.textedit = w;
    try { const T = await S.assets.json(`${w.dir}/normalize.json`); S.textNorm = createTextNormalizer(T); if (T.dictation) table = T.dictation; } catch { S.textNorm = null; }
    try { S.calibration = await S.assets.json(`${w.dir}/command_threshold.json`); } catch { S.calibration = null; }
  }
  S.dict = createDictation({ reader: w ? { read: (t) => w.vss.read(t) } : null, table, normalize: S.textNorm, calibration: S.calibration });
}
// the matheditor world (spec 16) when installed; the reference parser otherwise, labelled as such
function setupMatheditor() {
  const w = S.worlds.get("matheditor"); if (!w) return;
  S.matheditor = {
    read(text, doc) {
      const r = w.vss.read(text);
      if (r.status === "ok") { try { const fr = frameFromWires(r.wires); const p = executeFormula(doc, fr); return { kind: "command", source: "matheditor reader", frame: fr, status: p.status, reason: p.reason, plan: p }; } catch { /* not an edit: the formula path below */ } }
      const f = formulaInput(doc, text, parsers); f.source = `${parsers.SOURCE} (the matheditor reader: ${r.status})`; return f;
    },
  };
}
// the animation world (spec 19) when installed: its own normalizer table (the diagram table maps "over" to "above")
async function setupAnimation() {
  const w = S.worlds.get("animation"); if (!w) return; S.animation = w;
  try { S.animNorm = createNormalizer(await S.assets.json(`${w.dir}/normalize.json`)); } catch { S.animNorm = S.normalize; }
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
  if (S.mode === "dictation") return handleDictation(text, source);
  if (S.mode === "formula") return handleFormula(text);
  // command mode: the widget phrases first (spec 14.2, 16.4), then the readers
  const fp = formulaPhrase(text);
  if (fp && fp.type === "start") return startFormula(null, fp);
  if (S.dict) { const a = S.dict.handle(text); if (a.type === "start") return startWriting(a.widget, a.reason); }
  if (!S.diagram) { showAnswer({ action: "refuse", line: "No reader model is installed in this copy of the editor. You can still draw with the mouse, by touch or with the sketch pad." }); return; }
  // several commands in one input (spec 15): only when the segmenter finds a strong cut is the paragraph segmented and read unit by unit
  if (S.segReader) {
    const n = S.normalize(text);
    if (candidateCuts(n.tokens, { kind: S.segReader.kind }).cuts.some((c) => c.strong)) {
      const seg = segment(n.tokens, { reader: S.segReader });
      if (seg.segments.filter((s) => s.role === "command").length > 1) return handleLong(text, source, seg, n.info);
    }
  }
  const choice = readVariants(alternatives, source); const best = choice.best;
  if (S.animation && tryAnimation(text, best)) return;
  const p = ["ok", "abstain"].includes(best.result.status) ? makePlan(S.scene, best.result.frame, best.info) : null;
  const d = decide({ result: best.result, plan: p, corrections: best.corrections, tau: S.diagram.tau, legend: S.diagram.legend, alternatives: choice });
  let ex = null;
  if (d.action === "execute") { ex = execute(S.scene, p); }
  S.last = { kind: "diagram", input: text, best, choice, plan: p, decision: d, execution: ex };
  S.history.push({ input: text, source, used: best.input, status: best.result.status, line: d.line, action: d.action, sop: best.result.sop });
  refresh(); showAnswer(d);
  if (S.settings.speakback && d.action === "execute" && globalThis.speechSynthesis) speechSynthesis.speak(new SpeechSynthesisUtterance(d.line));
}

// a paragraph: segmenter -> one reading per unit -> circuit -> one plan, one undo entry (spec 15.1-15.3)
function handleLong(text, source, seg, info, choices = {}) {
  const circuit = buildCircuit(unitsFromSegments(seg, { info }), { scene: S.scene, tau: S.diagram.tau });
  const ex = executeCircuit(S.scene, circuit, { choices });
  const byI = new Map(ex.results.map((r) => [r.unit, r]));
  const done = ex.results.filter((r) => r.mark === "executed").length; const n = circuit.units.filter((u) => u.role === "command").length;
  let line, action = "execute"; const questions = [];
  if (ex.waiting?.cycle) { line = `Nothing ran: ${ex.waiting.cycle.text}.`; action = "refuse"; }
  else if (ex.waiting?.conflicts) { line = `Read ${n} units; before anything runs, settle: ${ex.waiting.conflicts.map((k) => k.text).join("; ")}.`; action = "ask"; }
  else {
    line = `Read ${n} units: ${done} done${ex.stoppedAt != null ? `, stopped at unit ${ex.stoppedAt + 1} (${byI.get(ex.stoppedAt)?.reason || "it could not run"})` : ""}.`;
    if (ex.stoppedAt != null) action = done ? "ask" : "refuse";
  }
  const units = circuit.units.filter((u) => u.role === "command").map((u) => ({ ...u, mark: byI.get(u.i)?.mark || null }));
  const lastRead = [...units].reverse().find((u) => u.reading);
  S.last = { kind: "long", input: text, seg, info, circuit, ex, units, line, best: lastRead ? { result: lastRead.reading, corrections: [], info } : null };
  S.history.push({ input: text, source, used: text, status: `${n} units`, line, action, sop: circuit.sop });
  refresh();
  const d = { action, line, questions };
  showAnswer(d);
  const host = $("answer");
  if (ex.waiting?.conflicts) for (const k of ex.waiting.conflicts) for (const keep of [k.a, k.b]) host.append(chip(`keep unit ${keep + 1}: ${circuit.units[keep].text}`, () => handleLong(text, source, seg, info, { ...choices, [k.key]: keep })));
  if (seg.ambiguous && seg.alternatives.length) host.append(chip("read it as the other segmentation", () => handleLong(text, source, { ...seg, segments: seg.alternatives[0], ambiguous: false, alternatives: [] }, info, choices)));
  host.append(chip("show the circuit", () => openPanel("circuit")));
  if (S.settings.speakback && done && globalThis.speechSynthesis) speechSynthesis.speak(new SpeechSynthesisUtterance(line));
}

// ------------------------------------------------------------------ animation (spec 19): only with the animation world installed
function tryAnimation(text, diagramBest) {
  const n = S.animNorm(text); const r = S.animation.vss.read(n.tokens.join(" "));
  const rank = { ok: 0, abstain: 1, "unknown-event": 2, "no-sense": 3 }; const a = rank[r.status] ?? 9, b = rank[diagramBest.result.status] ?? 9;
  const animWins = a < b || (a === b && a <= 1 && (r.residual ?? 1) < (diagramBest.result.residual ?? 1));
  if (!animWins || a > 1) return false;
  const reason = `dispatch by fit: animation ${r.status}, residual ${(r.residual ?? 0).toFixed(3)}; diagram ${diagramBest.result.status}, residual ${(diagramBest.result.residual ?? 0).toFixed(3)}`;
  const d = decide({ result: r, plan: { steps: [{ op: "animate", explain: "" }], questions: [], blocked: [] }, tau: S.animation.tau, legend: S.animation.legend });
  const best = { result: r, corrections: [], info: n.info };
  if (d.action !== "execute") { S.last = { kind: "diagram", input: text, best, decision: { ...d, rule: `${d.rule}; ${reason}` } }; refresh(); showAnswer(d); return true; }
  const tl = S.film.timeline || createTimeline(S.scene); const it = animationIntent(r.frame, n.tokens); let line;
  if (it.intent === "question") { const ans = answerFilm(tl, r.frame, n.info, n.tokens); line = ans.text; if (ans.t != null && S.film.player) { S.film.show(true); S.film.player.seek(ans.t); } }
  else {
    const res = it.intent === "correction" ? correctUnit(tl, r.frame, n.info) : addUnit(tl, r.frame, n.info);
    if (res.kind === "film") { S.film.set(tl, { sop: r.sop }); const c = S.film.command(res.command); line = c && c.error ? c.error : res.text; }
    else { line = res.text || res.kind; S.film.set(tl, { sop: r.sop }); }
    if (res.kind === "error") d.action = "refuse";
  }
  S.last = { kind: "diagram", input: text, best, world: "animation", decision: { action: d.action, line, rule: `${it.rule}; ${reason}` } };
  S.history.push({ input: text, source: "typed", used: n.tokens.join(" "), status: r.status, line, action: d.action, sop: r.sop });
  refresh(); showAnswer({ action: d.action, line });
  return true;
}

// ------------------------------------------------------------------ text widgets and dictation (spec 14)
function textDocOf(id) {
  const c = S.scene.components.get(id); if (!c || !textCapable(c)) return null;
  const sig = c.text ? JSON.stringify(c.text.doc) : "";
  let e = S.texts.get(id);
  if (!e || e.sig !== sig) { const doc = c.text && c.text.doc ? TextDoc.fromJSON(c.text.doc) : new TextDoc(); doc.setCursor(doc.length); e = { doc, sig }; S.texts.set(id, e); }
  return e.doc;
}
// the document back into the scene as one undo entry; the widget grows with its content (spec 14.1)
function commitText(id, op = "write") {
  const c = S.scene.components.get(id); const doc = textDocOf(id); if (!c || !doc) return;
  const tx = ops.begin(S.scene); const json = doc.toJSON();
  ops.set(S.scene, [id], { text: { doc: json, plain: doc.text() } });
  const h = textHeight(doc, c.box.w, { minH: c.box.h }); if (h > c.box.h) ops.resize(S.scene, id, { ...c.box, h });
  if (S.scene.connectors.size) ops.route(S.scene);
  ops.commit(S.scene, tx); S.scene.lastTouched = [id]; S.texts.get(id).sig = JSON.stringify(json);
  S.history.push({ input: `(${op} in ${c.label || c.id})`, source: "dictation", used: "", status: "", line: op, action: "text" });
}
function ensureText(id) { const c = S.scene.components.get(id); if (c && c.text == null) { const doc = textDocOf(id); ops.transact(S.scene, () => ops.set(S.scene, [id], { text: { doc: doc.toJSON(), plain: "" } })); S.texts.get(id).sig = JSON.stringify(doc.toJSON()); } }
const nameOf = (id) => { const c = S.scene.components.get(id); return c ? (c.label ? `"${c.label}"` : `the ${c.word}`) : id; };

function startWriting(ref, reason) {
  const f = findTextWidget(S.scene, ref || {}, { current: S.active && S.scene.components.has(S.active) && textCapable(S.scene.components.get(S.active)) ? S.active : null });
  if (!f.id) { S.dict.stop(); showAnswer({ action: "refuse", line: `Not writing: ${f.rule}.` }); return; }
  if (S.mode === "formula") leaveFormula(false);
  if (S.dict.mode !== "dictation") S.dict.start(ref || null);
  ensureText(f.id); S.mode = "dictation"; S.active = f.id; S.scene.selection = [f.id];
  const doc = textDocOf(f.id); doc.setCursor(doc.length);
  const noReader = !S.textedit ? " No textedit model is installed, so everything you say or type here is written as text (content only); formatting commands are not read." : "";
  S.last = { kind: "text", input: "", note: { text: `writing in ${nameOf(f.id)}`, as: f.rule, reason: reason || "start writing", kind: "command" } };
  updateMode(); refresh();
  showAnswer({ action: "execute", line: `Writing in ${nameOf(f.id)} (${f.rule}).${noReader} Say “stop writing” or press Escape to go back to commands.` });
  $("answer").append(chip("rename", () => renameWidget(f.id)), chip("stop writing", () => stopWriting()));
}
function renameWidget(id) { S.allowLabel = id; S.view.editLabel(id); S.allowLabel = null; }
function stopWriting(reason = "back to commands") {
  if (S.dict.mode === "dictation") S.dict.stop();
  const was = S.active; S.mode = "command"; S.active = null; S.slots.candidates(was, []);
  updateMode(); refresh(); showAnswer({ action: "execute", line: `Stopped writing in ${nameOf(was)}: ${reason}.` });
}

function handleDictation(text, source) {
  const id = S.active; const doc = textDocOf(id); if (!doc) return stopWriting("the widget is gone");
  const a = S.dict.handle(text); const world = S.textedit ? "textedit" : "no textedit reader";
  if (a.type === "stop") return stopWriting(a.reason);
  if (a.type === "start") { S.dict.start(a.widget); return startWriting(a.widget, a.reason); }
  if (a.type === "insert") {
    S.dict.insert(doc, a.pieces, a.chip || null); commitText(id, "dictation");
    S.last = { kind: "text", input: text, note: { text, as: "written as text", reason: a.reason, world, kind: "content" } };
    refresh(); showAnswer({ action: "execute", line: `Written in ${nameOf(id)}.` });
    if (a.chip) $("answer").append(chip("apply as a command", () => { const c = S.dict.applyChip(doc, a.chip); runTextCommand(id, doc, c, text); }));
    $("answer").append(chip("stop writing", () => stopWriting()));
    return;
  }
  if (a.type === "command") return runTextCommand(id, doc, a, text);
}

function runTextCommand(id, doc, a, text, opts = {}) {
  const p = planText(doc, a.frame, a.info || {}, { normalize: S.textNorm, ...opts });
  const world = "textedit";
  S.last = { kind: "text", input: text, note: { text, as: `a command: ${p.event || a.frame?.event}`, reason: a.reason || p.explain || "", world, kind: "command" } };
  const q = (p.questions || [])[0];
  if (q) {
    S.slots.candidates(id, q.candidates || []); refresh();
    showAnswer({ action: "ask", line: q.text || q.kind });
    (q.candidates || []).forEach((_, k) => $("answer").append(chip(`${k + 1}`, () => { S.slots.candidates(id, []); runTextCommand(id, doc, a, text, { choose: k }); })));
    if (q.candidates?.length > 1) $("answer").append(chip("all", () => { S.slots.candidates(id, []); runTextCommand(id, doc, a, text, { choose: "all" }); }));
    return;
  }
  if (p.destructive && !opts.confirmed) {
    refresh(); showAnswer({ action: "ask", line: `${p.explain || p.event}: ${typeof p.resolution === "string" ? p.resolution : JSON.stringify(p.resolution || "")}. Apply?` });
    $("answer").append(chip("apply", () => runTextCommand(id, doc, a, text, { ...opts, confirmed: true })));
    return;
  }
  const r = executeText(doc, p, { confirmed: !!opts.confirmed });
  if (r.applied) commitText(id, p.event || "edit");
  refresh(); showAnswer({ action: r.applied ? "execute" : "refuse", line: r.applied ? (p.explain || `done: ${p.event}`) : `not applied: ${r.reason || "nothing to change"}` + (r.read ? ` ${r.read}` : "") });
}

// a component outside the visible part of the canvas: fit the view so that it shows
function reveal(id) {
  const c = S.scene.components.get(id); if (!c) return; const r = $("canvas").getBoundingClientRect();
  const a = S.view.screenToScene(r.left, r.top), b = S.view.screenToScene(r.right - 56, r.bottom);
  if (c.box.x < a.x || c.box.y < a.y || c.box.x + c.box.w > b.x || c.box.y + c.box.h > b.y) S.view.fit();
}

// ------------------------------------------------------------------ formula widgets (spec 16)
function formulaDocOf(id) {
  const c = S.scene.components.get(id); if (!c || c.formula == null) return null;
  const sig = JSON.stringify(c.formula.tree); let e = S.formulas.get(id);
  if (!e || e.sig !== sig) { e = { doc: new FormulaDoc(c.formula.tree || hole()), sig }; S.formulas.set(id, e); }
  return e.doc;
}
function addWidget(kind) {
  const word = kind === "formula" ? "formula" : "textbox"; const [w, h] = kind === "formula" ? [240, 90] : [200, 110];
  const box = { w, h }; const near = S.scene.selection.length ? S.scene.components.get(S.scene.selection[0])?.box : null;
  const pos = place(S.scene, box, near ? { relation: "right_of" } : {}, near);
  let id; ops.transact(S.scene, () => { id = ops.create(S.scene, { word, kind: kind === "formula" ? "formula" : "note", label: null, ...(kind === "formula" ? { formula: { tree: hole(), latex: "", plain: "" } } : { text: { doc: new TextDoc().toJSON(), plain: "" } }) }, { ...box, x: pos.x, y: pos.y }); if (S.scene.connectors.size) ops.route(S.scene); });
  S.scene.lastTouched = [id]; S.scene.selection = [id]; S.view.render(); reveal(id);
  S.history.push({ input: `(add a ${word})`, source: "button", used: "", status: "", line: `add a ${word}`, action: "manual" });
  return id;
}
function startFormula(id, fp = null) {
  if (S.mode === "dictation") stopWriting("a formula was opened");
  if (!id) id = addWidget("formula");
  S.mode = "formula"; S.active = id; S.scene.selection = [id];
  S.formulaInput = null; const doc = formulaDocOf(id); const host = $("tab-widget"); host.replaceChildren();
  const info = document.createElement("div"); host.append(info);
  renderWidgetInfo(info, { title: S.scene.components.get(id).label || "Formula", kind: "formula", reader: S.matheditor ? "Read by the matheditor reader (the reference parser when it cannot)." : `No matheditor model is installed: read by the ${parsers.SOURCE}, a hand-written grammar, not the VSS reader.`,
    hint: "Say or type a formula (“x squared plus one over two”) or an edit (“replace the exponent with n plus one”). “End formula” or Escape goes back to commands." });
  const fx = document.createElement("div"); host.append(fx);
  S.formulaView = mountFormula(fx, { doc, parsers, reader: S.matheditor, onChange: (d, r) => onFormulaChange(id, d, r) });
  updateMode(); openPanel("widget", { onlyIfOpen: true }); refresh();
  showAnswer({ action: "execute", line: `Formula widget open${S.matheditor ? "" : ` (${parsers.SOURCE}: no matheditor model installed)`}. Say or type the formula.` });
  $("answer").append(chip("rename", () => renameWidget(id)), chip("end formula", () => leaveFormula()));
  if (fp && fp.rest) handleFormula(fp.rest);
}
function leaveFormula(say = true) {
  const was = S.active; S.mode = "command"; S.active = null; if (S.formulaView) { S.formulaView.destroy(); S.formulaView = null; }
  $("tab-widget").replaceChildren(); updateMode(); refresh(); if (say) showAnswer({ action: "execute", line: `Closed ${nameOf(was)}; back to commands.` });
}
function handleFormula(text) {
  const fp = formulaPhrase(text); if (fp && fp.type === "end") return leaveFormula();
  if (fp && fp.type === "start") { leaveFormula(false); return startFormula(null, fp); }
  S.formulaInput = text; S.formulaView.input(text);
}
function onFormulaChange(id, doc, r) {
  const c = S.scene.components.get(id); if (!c) return;
  const latex = toLatex(doc.tree); const sig = JSON.stringify(doc.tree);
  if (sig !== JSON.stringify(c.formula?.tree)) {
    const tx = ops.begin(S.scene); ops.set(S.scene, [id], { formula: { tree: doc.tree, latex, plain: latex } });
    const w = Math.max(c.box.w, Math.min(640, 60 + latex.length * 9)); if (w > c.box.w) ops.resize(S.scene, id, { ...c.box, w });
    if (S.scene.connectors.size) ops.route(S.scene); ops.commit(S.scene, tx); S.formulas.get(id).sig = sig;
    S.history.push({ input: `(formula) ${latex}`, source: "formula", used: "", status: r.status, line: r.reason, action: "formula" });
  }
  const shown = doc.tree.op === "hole" ? "empty" : latex; const kind = r.kind || (r.status === "ok" ? "formula" : null);
  S.last = { kind: "formula", input: "", note: { text: S.formulaInput || latex, as: kind === "command" ? `an edit of the formula, now ${shown}` : kind === "formula" ? (r.status === "ambiguous" ? "a formula with two readings" : `a formula: ${shown}`) : "not read", reason: `${r.status}: ${r.reason || ""}`, world: r.source || parsers.SOURCE, kind: kind === "command" ? "command" : "content", status: r.status === "ok" ? "ok" : r.status === "ambiguous" ? "abstain" : "no-sense" } };
  refresh();
  showAnswer({ action: r.status === "ok" ? "execute" : r.status === "ambiguous" || r.status === "choose" ? "ask" : "refuse", line: `${r.status === "ambiguous" ? "Two readings: which one?" : r.reason || r.status} (${r.source || parsers.SOURCE})` });
  const host = $("answer");
  if (r.status === "ambiguous" && r.kind === "formula") r.readings.forEach((rd, k) => { const b = chip("", () => S.formulaView.choose(k)); b.classList.add("math-choice"); b.innerHTML = `<span class="n">${k + 1}</span>${toMathML(rd.tree, { display: "inline" })}`; b.setAttribute("aria-label", `reading ${k + 1}: ${toLatex(rd.tree)}`); host.append(b); });
  host.append(chip("end formula", () => leaveFormula()));
}

// ------------------------------------------------------------------ sketch (spec 17)
function onStrokes(strokes, { stay }) {
  if (!strokes.length) { if (!stay) showAnswer({ action: "execute", line: "Nothing was drawn." }); return; }
  const v = S.scene.view; const z = v.zoom || 1;
  const toScene = strokes.map((s) => ({ ...s, points: s.points.map((p) => ({ ...p, x: (p.x - (v.x || 0)) / z, y: (p.y - (v.y || 0)) / z })) }));
  const rec = recognise(toScene); const res = scenePass(rec, { scene: S.scene }); const ap = applyToScene(S.scene, res);
  const counts = {}; for (const c of res.components) counts[c.word] = (counts[c.word] || 0) + 1; for (const k of res.connectors) counts[k.kind] = (counts[k.kind] || 0) + 1;
  const what = Object.entries(counts).map(([w, n]) => `${n} ${w}${n > 1 ? (w.endsWith("x") ? "es" : "s") : ""}`).join(", ") || "nothing I can build";
  const del = res.deletions.components.length + (res.deletions.connectors?.length || 0);
  const line = `Recognised ${what}${del ? `; ${del} deletion${del > 1 ? "s" : ""}` : ""}. One undo takes it back.`;
  S.last = { kind: "sketch", input: "(sketch)", rec, res, map: ap.map, line };
  S.history.push({ input: "(sketch)", source: "sketch", used: "", status: `${rec.groups.length} groups`, line, action: ap.applied ? "execute" : "refuse", sop: toCircuit(res) });
  refresh(); const first = [...ap.map.values()].find((x) => S.scene.components.has(x)); if (first) { reveal(first); S.slots.sync(); }
  showAnswer({ action: ap.applied ? "execute" : "refuse", line });
  const host = $("answer");
  for (const q of res.questions) {
    const id = ap.map.get(q.ref) || q.ref;
    if (q.kind === "which-shape") for (const alt of q.candidates) host.append(chip(`${alt.kind.replace(/_/g, " ")} (${alt.score.toFixed(2)})`, () => setShape(id, alt.kind)));
    else host.append(Object.assign(document.createElement("span"), { className: "line act-ask", textContent: q.text }));
  }
  if (!stay) host.append(chip("sketch more", () => S.sketch.open()));
}
function setShape(id, kind) {
  const wk = WORD_OF[kind]; if (!wk || !S.scene.components.has(id)) return;
  ops.transact(S.scene, () => { ops.set(S.scene, [id], { word: wk.word, kind: wk.kind, shape: kind, alternatives: undefined }); });
  refresh(); showAnswer({ action: "execute", line: `It is a ${kind.replace(/_/g, " ")}.` });
}

// ------------------------------------------------------------------ long scripts (spec 18)
const EXAMPLE_SCRIPT = `# Orders
## Storage
Add a database called orders in the top left. Add a cache called sessions to the right of it.
## Services
Add a service called api below the database. Connect the api to the database with a dashed arrow. Make the cache red.`;
function runScriptText(text) {
  if (!S.segReader) { S.scriptUI.show({ title: null, sections: [], counts: { units: 0 } }); showAnswer({ action: "refuse", line: "No reader model is installed: a script cannot be read." }); return; }
  const read = readScript(text, { reader: S.segReader, normalize: S.normalize, kind: S.segReader.kind });
  const circuit = buildScript(read, { scene: S.scene, tau: S.diagram.tau });
  const run = runScript(S.scene, circuit, { blocking: "stop", conflicts: "in-order" });
  S.script = { text, read, circuit, run };
  showScript(); S.history.push({ input: `(script) ${read.title || text.slice(0, 40)}`, source: "script", used: "", status: `${read.units.length} units`, line: "script", action: "script", sop: circuit.sop });
}
function showScript() {
  const { read, circuit, run } = S.script; const model = documentModel(read, circuit, run); const rep = authorReport(read, circuit, run);
  S.scriptUI.show(model, { waiting: run.waiting });
  const line = `Script: ${rep.units} units, ${rep.read} read clearly (${(rep.instructionFollowing * 100).toFixed(0)}%), ${rep.executed} done${run.waiting ? `; waiting at a sentence that cannot run` : ""}.`;
  S.last = { kind: "long", input: "(script)", circuit, ex: { results: [...run.results.values()] }, units: circuit.units.filter((u) => u.role === "command").map((u) => ({ ...u, mark: run.results.get(u.i)?.mark || null })), line, best: null };
  refresh(); showAnswer({ action: run.waiting ? "ask" : "execute", line });
}

// ------------------------------------------------------------------ manual changes, selection
function onManualChange(kind, detail) { S.history.push({ input: `(${kind}) ${detail?.op || ""}`, source: "pointer", used: "", status: "", line: detail?.op || detail?.text || "", action: "manual" }); if (kind === "blocked") showAnswer({ action: "refuse", line: detail.text }); refresh(); }
function onSelect(ids) {
  if (S.mode !== "command" || ids.length !== 1) return;
  const c = S.scene.components.get(ids[0]); if (!c) return;
  if (c.formula != null) { showAnswer({ action: "execute", line: `${nameOf(c.id)} is a formula.` }); $("answer").append(chip("edit this formula", () => startFormula(c.id))); }
  else if (textCapable(c)) { showAnswer({ action: "execute", line: `${nameOf(c.id)} can hold text.` }); $("answer").append(chip(`write in ${nameOf(c.id)}`, () => { S.dict.start(null); startWriting({ name: c.label || null, head: c.label ? null : c.word }, "a tap on the widget"); })); }
}
function onEditLabel(id) {
  const c = S.scene.components.get(id); if (!c || S.allowLabel === id) return true;
  if (c.formula != null) { startFormula(id); return false; }
  if (c.text != null) { S.dict.start(null); S.scene.selection = [id]; startWriting({}, "a double click in the widget"); return false; }
  return true;
}

// ------------------------------------------------------------------ rendering
function refresh() {
  S.view.render({ highlight: S.last?.plan?.questions?.flatMap((q) => q.candidates || []) || [] });
  S.slots.sync();
  $("empty-hint").hidden = S.scene.components.size > 0 || !!S.last || S.sketch?.isOpen;
  const L = S.last; const best = L?.best;
  if (L?.note) renderNote($("reading"), L.note);
  else if (L?.kind === "long" && L.units?.length) renderUnits($("reading"), L.units);
  else if (L?.kind === "sketch") renderNote($("reading"), { text: L.rec.groups.map((g) => String(g.kind).replace(/_/g, " ")).join(", ") || "no ink", as: "drawn on the sketch pad", reason: L.res.active, world: "sketch", kind: "command" });
  else renderReading($("reading"), { result: best?.result, corrections: best?.corrections || [], labels: best?.info?.labels || {}, world: L?.world || "diagram" });
  renderFrame($("tab-frame"), { result: best?.result, legend: (L?.world === "animation" ? S.animation : S.diagram)?.legend, tau: S.diagram?.tau ?? 0.05 });
  if (L?.kind === "sketch") renderSketch($("tab-plan"), { rec: L.rec, res: L.res, low: PASS_OPTIONS.ambiguousMargin });
  else if (L?.kind === "long") renderUnitsPlan($("tab-plan"), { results: L.ex?.results, circuit: L.circuit, line: L.line });
  else renderPlan($("tab-plan"), { plan: L?.plan, decision: L?.decision, execution: L?.execution });
  renderGeometry($("tab-geometry"), { plan: L?.plan });
  renderSOP($("tab-sop"), { result: best?.result, circuit: L?.circuit || (L?.kind === "sketch" ? { sop: toCircuit(L.res) } : null) });
  const circ = $("tab-circuit"); circ.replaceChildren();
  if (L?.circuit) renderCircuit(circ, L.circuit, { onSelectUnit: (i) => { const r = L.ex?.results?.find((x) => x.unit === i); if (r?.ids?.length) { S.scene.selection = r.ids.filter((id) => S.scene.components.has(id)); S.view.render(); } } });
  else circ.append(Object.assign(document.createElement("p"), { className: "muted", textContent: "A paragraph of several commands shows here as a circuit of linked readings." }));
  if (S.mode === "dictation") renderTextTab();
  else if (S.mode !== "formula") renderWidgetInfo($("tab-widget"), { title: "No widget open", kind: "text and formula", reader: widgetReaderLine(), hint: "Add a text box or a formula with the canvas buttons, or say “add a note called Summary” then “start writing in Summary”, or “start a formula”." });
  const wTab = document.querySelector('.tabs [data-tab="widget"]'), tTab = document.querySelector('.tabs [data-tab="timeline"]');
  wTab.hidden = !(S.mode === "dictation" || S.mode === "formula" || L?.kind === "text" || L?.kind === "formula");
  tTab.hidden = !S.film?.timeline;
  if ((wTab.hidden && S.panelTab === "widget") || (tTab.hidden && S.panelTab === "timeline")) selectTab("frame");
  const log = $("tab-log"); log.replaceChildren();
  for (const h of S.history.slice().reverse()) { const d = document.createElement("div"); d.className = "log-item"; const a = document.createElement("div"); a.className = "log-in"; a.textContent = h.input; const b = document.createElement("div"); b.className = "log-out"; b.textContent = `${h.action}${h.status ? ", " + h.status : ""}: ${h.line}`; d.append(a, b); log.append(d); }
  updateMode();
}
function widgetReaderLine() {
  const t = S.textedit ? `Text: the textedit reader decides command or content${S.calibration ? ` (command threshold ${S.calibration.threshold})` : " (no calibrated threshold: commands are offered as a chip, never run on their own)"}.` : "Text: no textedit model is installed; everything dictated into a text widget is written as content.";
  return `${t} Formula: ${S.matheditor ? "the matheditor reader" : `the ${parsers.SOURCE} (no matheditor model installed)`}.`;
}
function renderTextTab() {
  const id = S.active; const doc = textDocOf(id); if (!doc) return;
  renderWidgetInfo($("tab-widget"), { title: S.scene.components.get(id)?.label || "Text box", kind: "writing", reader: widgetReaderLine(), decision: S.last?.note ? `Last: ${S.last.note.as}. ${S.last.note.reason}` : null,
    outline: doc.toOutline(), hint: "Spoken punctuation and layout: comma, full stop, question mark, new line, new paragraph, bullet; “literally” writes the next word as it is. “Stop writing” or Escape ends." });
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

function updateMode() {
  const chipEl = $("mode-chip"); chipEl.className = "mode-chip"; const inp = $("input");
  if (S.mode === "dictation") { chipEl.hidden = false; chipEl.classList.add("dictation"); chipEl.textContent = `writing in ${S.scene.components.get(S.active)?.label || "the text box"}`; inp.placeholder = "say or type the text; “stop writing” to finish"; }
  else if (S.mode === "formula") { chipEl.hidden = false; chipEl.classList.add("formula"); chipEl.textContent = "formula"; inp.placeholder = "x squared plus one over two; “end formula” to finish"; }
  else if (S.sketch?.isOpen) { chipEl.hidden = false; chipEl.classList.add("sketch"); chipEl.textContent = "sketching"; inp.placeholder = "add a red box called payments"; }
  else if (S.film?.showing) { chipEl.hidden = false; chipEl.classList.add("m-film"); chipEl.textContent = "film"; inp.placeholder = "add a red box called payments"; }
  else { chipEl.hidden = true; inp.placeholder = "add a red box called payments"; }
}
function openPanel(tab, { onlyIfOpen = false } = {}) {
  const app = $("app"); if (!app.classList.contains("panel-open")) { if (onlyIfOpen) return; app.classList.add("panel-open"); $("btn-panel").setAttribute("aria-expanded", "true"); }
  selectTab(tab);
}
function selectTab(tab) {
  const btn = document.querySelector(`.tabs [data-tab="${tab}"]`); if (btn) btn.hidden = false;
  for (const u of document.querySelectorAll(".tabs button")) u.setAttribute("aria-selected", String(u.dataset.tab === tab));
  for (const b of document.querySelectorAll(".tab-body")) b.hidden = b.id !== `tab-${tab}`;
  S.panelTab = tab;
}

// ------------------------------------------------------------------ badge, About, Settings
function showModelBadge(errors) {
  const b = $("model-badge"); const d = S.diagram;
  if (!d) { b.hidden = false; b.textContent = "no reader model"; b.classList.add("dev"); }
  else { b.hidden = false; b.textContent = d.status === "demo" ? `reader D ${d.vss.model.config.D}` : "development model"; b.classList.toggle("dev", d.status !== "demo"); b.title = d.note || ""; }
  const KNOWN = ["diagram", "textedit", "matheditor", "animation", "scene"];
  const rows = [];
  for (const name of KNOWN.concat([...S.worlds.keys()].filter((k) => !KNOWN.includes(k)))) {
    const w = S.worlds.get(name); const listed = (S.index?.worlds || []).find((x) => x.name === name);
    if (w) rows.push({ name, status: `${w.status === "demo" ? "demo model" : "development model, not for measurement"}; D ${w.vss.model.config.D}, ${w.bits} bits`, note: w.note || "", dev: w.status !== "demo" });
    else if (listed) rows.push({ name, status: "listed but not loaded", note: (errors.find((e) => e.startsWith(name)) || ""), dev: true });
    else rows.push({ name, status: "not installed", note: { textedit: "dictation writes content only", matheditor: "formulas are read by the reference parser", animation: "films play from a JSON timeline file", scene: "sketches are read by the rule-based geometry pass" }[name] || "", dev: false });
  }
  renderRows($("about-models"), rows, "mod-row");
  for (const e of errors.filter((x) => !KNOWN.some((k) => x.startsWith(k)))) { const p = document.createElement("p"); p.className = "muted"; p.textContent = e; $("about-models").append(p); }
  const sp = S.speech ? S.speech.info() : null;
  renderRows($("about-modules"), [
    { name: "Reader", status: d ? `VSS reader of the diagram world (${d.status === "demo" ? "demo" : "development"} model)` : "no model installed", dev: !d || d.status !== "demo" },
    { name: "Correctors", status: "classic (keyboard and phonetic distance) and VSS form level; chosen in Settings" },
    { name: "Segmenter and circuit", status: `rule-based cuts with the reader's ${S.segReader?.gates ? "gates" : "kinds (the model exposes no gates)"}; links by the stated rules (spec 15.5: the learned versions are not active)` },
    { name: "Text widgets", status: S.textedit ? `dictation with the textedit reader${S.calibration ? `, command threshold ${S.calibration.threshold}` : ", no calibrated threshold"}` : "dictation without a textedit reader: content only", dev: !S.textedit },
    { name: "Formula widgets", status: S.matheditor ? "matheditor reader, reference parser as fallback" : `${parsers.SOURCE} (no matheditor model); MathML rendering`, dev: !S.matheditor },
    { name: "Sketch", status: "own $P recogniser and the rule-based geometry pass (spec 17.3: the scene reader is not active)" },
    { name: "Scripts", status: "sections, checkpoints and the document view; references over distance by the rule" },
    { name: "Animation", status: S.animation ? "animation reader, timeline solver, player, invariants, export" : "no animation model: play and export a JSON timeline file; the solver, player, invariants and export are active", dev: !S.animation },
    { name: "Voice", status: sp ? sp.note : "not started" },
  ]);
  const m = $("about-measured"); m.replaceChildren(); const p = document.createElement("p");
  p.textContent = S.index?.measured || "No number of this copy has been measured on a trained demo model yet. The criteria are in the specification (section 21); this panel lists only the criteria that were met.";
  m.append(p);
}
function thresholdInfo() {
  const d = S.diagram; const th = d?.vss.model.config.thresholds || {};
  const lines = [d ? `Diagram commands run when the reader's status is ok and every margin is at least tau = ${d.tau} (${th.tau_source || "stated"}); under tau the editor asks about that role.` : "No diagram reader is installed."];
  if (!S.textedit) lines.push("Dictation: no textedit model is installed, so in a text widget everything you say or type is written as text; commands such as “bold the last sentence” are not read. “Stop writing” and Escape still work.");
  else if (S.calibration && typeof S.calibration.threshold === "number") lines.push(`Dictation: an utterance runs as a text command only when the textedit reader reads it with status ok and every margin at or above the command threshold ${S.calibration.threshold}; within ${S.calibration.chip_band ?? 0.05} below it the words are written and a chip offers the command.`);
  else lines.push("Dictation: the textedit model has no calibrated command threshold, so a command is never run on its own: the words are written and a chip offers to apply them as a command.");
  lines.push(S.matheditor ? "Formulas: the matheditor reader; the reference parser when it cannot read the sentence." : `Formulas: read by the ${parsers.SOURCE} (no matheditor model installed); an ambiguous formula is shown as two readings to choose from.`);
  return lines;
}

// ------------------------------------------------------------------ input, voice, panels, dialogs
function makeSpeech() {
  const mic = $("btn-mic");
  S.speech = createSpeech({
    lang: S.settings.lang,
    onInterim: (t) => { const r = $("reading"); r.replaceChildren(Object.assign(document.createElement("p"), { className: "interim", textContent: t })); },
    onFinal: ({ alternatives }) => handle(alternatives, "speech"),
    onState: (st) => mic.classList.toggle("listening", st === "listening"),
    onError: (e) => showAnswer({ action: "refuse", line: `Voice: ${e}` }),
  });
  const info = S.speech.info(); $("voice-info").textContent = info.note; mic.disabled = !info.available; mic.title = info.available ? "Hold to speak (or hold the space bar when the input is empty)" : info.note;
  return info;
}
function setupSpeech() {
  const mic = $("btn-mic"); makeSpeech();
  const down = (e) => { e.preventDefault(); S.speech.start(); }, up = (e) => { e.preventDefault(); S.speech.stop(); };
  mic.addEventListener("pointerdown", down); mic.addEventListener("pointerup", up); mic.addEventListener("pointerleave", (e) => { if (S.speech.listening) up(e); });
  let spaceDown = false;
  document.addEventListener("keydown", (e) => { if (e.code === "Space" && document.activeElement === $("input") && !$("input").value && !spaceDown && S.speech.info().available) { spaceDown = true; e.preventDefault(); S.speech.start(); } });
  document.addEventListener("keyup", (e) => { if (e.code === "Space" && spaceDown) { spaceDown = false; S.speech.stop(); } });
}

function setupUI() {
  $("input-form").addEventListener("submit", (e) => { e.preventDefault(); const t = $("input").value; $("input").value = ""; handle([{ text: t }]); });
  $("input").addEventListener("paste", (e) => {
    const t = e.clipboardData?.getData("text") || ""; if (S.mode !== "command" || !looksLikeScript(t).script) return;
    e.preventDefault(); S.scriptUI.open(t);
  });
  for (const b of $("hint-examples").querySelectorAll("button")) b.onclick = () => runText(b.textContent);
  const afterUndo = () => { S.slots.reset(); refresh(); };
  $("btn-undo").onclick = () => { undo(S.scene); afterUndo(); }; $("btn-redo").onclick = () => { redo(S.scene); afterUndo(); };
  $("btn-fit").onclick = () => { S.view.fit(); S.slots.sync(); };
  $("btn-add-text").onclick = () => { const id = addWidget("text"); refresh(); S.dict.start(null); startWriting({}, "a new text box"); S.scene.selection = [id]; };
  $("btn-add-formula").onclick = () => startFormula(null);
  S.sketch = createSketchMode({ host: $("sketch-host"), strip: $("sketch-strip"), done: $("btn-sketch-done"), cancel: $("btn-sketch-cancel"), canvas: $("canvas"), onStrokes,
    onState: (open) => { $("btn-sketch").setAttribute("aria-pressed", String(open)); updateMode(); $("empty-hint").hidden = open || S.scene.components.size > 0 || !!S.last; } });
  $("btn-sketch").onclick = () => { if (S.sketch.isOpen) S.sketch.close(); else { if (S.mode === "dictation") stopWriting("sketch mode"); if (S.mode === "formula") leaveFormula(false); S.film.show(false); S.sketch.open(); } };
  S.film = createFilm({ strip: $("timeline-strip"), film: $("film"), play: $("tl-play"), scrub: $("tl-scrub"), time: $("tl-time"), close: $("tl-close"), details: $("tl-details"), panel: $("tab-timeline"),
    onDetails: () => openPanel("timeline"), onState: () => updateMode() });
  S.film.set(null);
  S.scriptUI = createScriptDialog({ dlg: $("dlg-script"), text: $("script-text"), doc: $("script-doc"), run: $("script-run"), cont: $("script-continue"), example: $("script-example"), exampleText: EXAMPLE_SCRIPT,
    onRun: runScriptText,
    onContinue: () => { const s = S.script; if (!s) return; s.run = runScript(S.scene, s.circuit, { run: s.run, from: s.run.stoppedAt ?? 0, blocking: "skip", conflicts: "in-order" }); showScript(); },
    onCheckpoint: (k) => { const s = S.script; if (!s) return; undoToCheckpoint(S.scene, s.run, k); s.run.checkpoints.length = Math.max(0, k + 1); for (const [i, r] of s.run.results) if (s.circuit.units[i]?.section > k) s.run.results.delete(i); s.run.state = null; S.slots.reset(); showScript(); },
    onSelectUnit: (i) => { const r = S.script?.run.results.get(i); if (r?.ids?.length) { S.scene.selection = r.ids.filter((id) => S.scene.components.has(id)); S.view.render(); } } });
  $("btn-script").onclick = () => S.scriptUI.open();
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || document.querySelector("dialog[open]")) return;
    if (S.sketch.isOpen) { S.sketch.close(); return; }
    if (S.mode === "dictation") { stopWriting("Escape"); return; }
    if (S.mode === "formula") { leaveFormula(); return; }
    if (S.film.showing) { S.film.player?.pause(); S.film.show(false); }
  });
  const app = $("app");
  $("btn-panel").onclick = () => { const open = app.classList.toggle("panel-open"); $("btn-panel").setAttribute("aria-expanded", String(open)); };
  if (matchMedia("(min-width: 821px)").matches) { app.classList.add("panel-open"); $("btn-panel").setAttribute("aria-expanded", "true"); }
  for (const t of document.querySelectorAll(".tabs button")) t.onclick = () => selectTab(t.dataset.tab);
  // settings
  const ds = $("dlg-settings");
  $("btn-settings").onclick = () => {
    for (const [k, v] of Object.entries(S.settings)) { const r = ds.querySelector(`[name="${k}"][value="${v}"]`); if (r && r.type === "radio") r.checked = true; const c = ds.querySelector(`[name="${k}"][type=checkbox]`); if (c) c.checked = !!v; const s = ds.querySelector(`select[name="${k}"]`); if (s) s.value = v; }
    renderLines($("threshold-info"), thresholdInfo()); ds.showModal();
  };
  ds.addEventListener("change", (e) => { const t = e.target; S.settings[t.name] = t.type === "checkbox" ? t.checked : t.value; saveSettings(); applyTheme(); if (t.name === "lang") { if (S.speech.listening) S.speech.stop(); makeSpeech(); } });
  $("btn-about").onclick = () => { showModelBadge(S.loadErrors || []); $("dlg-about").showModal(); };
  // export
  const dx = $("dlg-export");
  $("btn-export").onclick = () => {
    const tl = S.film.timeline; const cap = filmCaps(globalThis);
    $("x-webm").disabled = !tl || !cap.webm.ok; $("x-asvg").disabled = !tl; $("x-tljson").disabled = !tl;
    $("x-webm").title = !tl ? "no animation yet" : cap.webm.ok ? "" : cap.webm.reason;
    $("film-export-note").textContent = !tl ? `No animation yet: ${S.animation ? "describe one in the input bar, or" : "the animation world is not installed;"} open a timeline file or the example film.` : `${tl.units.length} units, ${(tl.end / 1000).toFixed(2)} s.${cap.webm.ok ? "" : ` Video: ${cap.webm.reason}.`}`;
    dx.showModal();
  };
  dx.addEventListener("close", async () => {
    const v = dx.returnValue; dx.returnValue = ""; const stamp = new Date().toISOString().slice(0, 10); const tl = S.film.timeline;
    try {
      if (v === "svg") download(new Blob([exportSVG(S.scene)], { type: "image/svg+xml" }), `diagram-${stamp}.svg`);
      if (v === "png") download(await exportPNG(S.scene, 2), `diagram-${stamp}.png`);
      if (v === "json") download(new Blob([exportJSON(S.scene)], { type: "application/json" }), `diagram-${stamp}.json`);
      if (v === "sop") download(new Blob([S.history.filter((h) => h.sop).map((h) => h.sop).join("\n")], { type: "text/plain" }), `diagram-${stamp}.sop`);
      if (v === "asvg" && tl) download(new Blob([filmSVG(tl)], { type: "image/svg+xml" }), `animation-${stamp}.svg`);
      if (v === "tljson" && tl) download(new Blob([JSON.stringify(filmJSON(tl), null, 1)], { type: "application/json" }), `animation-${stamp}.json`);
      if (v === "webm" && tl) { showAnswer({ action: "execute", line: `Recording the video in real time (${(tl.end / 1000).toFixed(1)} s)...` }); download(await exportWebM(tl, { env: globalThis, fps: 30 }), `animation-${stamp}.webm`); showAnswer({ action: "execute", line: "Video saved." }); }
      if (v === "example-film") loadTimeline(await S.assets.json("examples/request-film.json"), "the example film");
    } catch (err) { showAnswer({ action: "refuse", line: `Export: ${err.message}` }); }
  });
  $("import-file").addEventListener("change", async (e) => { const f = e.target.files[0]; if (!f) return; try { const sc = importJSON(await f.text()); S.scene = sc; S.view.setScene(sc); S.slots.reset(); S.texts.clear(); S.formulas.clear(); dx.close(); refresh(); } catch (err) { dx.close(); showAnswer({ action: "refuse", line: err.message }); } e.target.value = ""; });
  $("import-timeline").addEventListener("change", async (e) => { const f = e.target.files[0]; if (!f) return; dx.close(); try { loadTimeline(await f.text(), f.name); } catch (err) { showAnswer({ action: "refuse", line: `Timeline: ${err.message}` }); } e.target.value = ""; });
}

function loadTimeline(json, name) {
  const r = importTimeline(json, { scene: S.scene }); const bad = r.report.filter((x) => x.kind === "error");
  S.film.set(r.timeline, { sop: typeof json === "object" ? json.sop : null });
  S.last = { kind: "film", input: `(timeline) ${name}`, note: { text: name, as: `a timeline of ${r.timeline.units.length} units, ${(r.timeline.end / 1000).toFixed(2)} s`, reason: S.animation ? "read from the file" : "read from the file (the animation world is not installed: films are played from timeline files)", world: "animation", kind: "command", status: bad.length ? "abstain" : "ok" } };
  refresh();
  if (!r.timeline.units.length) { showAnswer({ action: "refuse", line: `${name}: no unit could be placed on the timeline${bad.length ? ` (${bad[0].note})` : ""}.` }); return; }
  S.film.show(true); S.film.player.play(0);
  S.history.push({ input: `(timeline) ${name}`, source: "file", used: "", status: `${r.timeline.units.length} units`, line: `${(r.timeline.end / 1000).toFixed(2)} s`, action: "film" });
  showAnswer({ action: bad.length ? "ask" : "execute", line: `Playing ${name}: ${r.timeline.units.length} units, ${(r.timeline.end / 1000).toFixed(2)} s${r.sceneFromFile ? ", on the diagram stored in the file" : ", on this diagram"}${bad.length ? `; ${bad.length} step${bad.length > 1 ? "s" : ""} not placed: ${bad[0].note}` : ""}.` });
  $("answer").append(chip("show the timeline", () => openPanel("timeline")));
  updateMode();
}

function download(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }

if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !globalThis.__VSS_BUNDLE__) navigator.serviceWorker.register("sw.js").catch(() => {});
start().catch((e) => { console.error(e); showAnswer({ action: "refuse", line: `The editor could not start: ${e.message}` }); });
