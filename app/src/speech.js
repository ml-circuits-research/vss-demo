// speech.js: speech engines and alternatives (spec 13). DOM-free apart from the browser APIs it wraps; nothing here decides what a
// sentence means: every alternative goes to the normalizer, the speech corrector and the reader, and the editor keeps the alternative whose
// frame is clearest (spec 13.3, chooseClearest below).
//
// Engines:
//   webspeech  the Web Speech API (SpeechRecognition / webkitSpeechRecognition): interim results, maxAlternatives. In Chrome the audio is
//              sent to a remote service unless on-device recognition is available; `processLocally` is requested when the browser exposes
//              it, and `info()` says whether audio may leave the device (spec 13.1). Push-to-talk: start() on press, stop() on release.
//   local      a slot for an on-device recogniser compiled to WebAssembly (Vosk through vosk-browser, or a small Whisper build), loaded as a
//              static file; NOT bundled yet: the choice (model size, licence, accuracy) is a measured step (training/TODO_DGX.md, step 10).
//   text       no microphone: the typed input only.
//
//   const sp = createSpeech({ onInterim, onFinal, onState });   sp.info() -> {engine, available, local, note}
//   sp.start(); ... sp.stop();      onFinal({alternatives: [{text, confidence}]})

export function detectEngines(g = globalThis) {
  const SR = g.SpeechRecognition || g.webkitSpeechRecognition || null;
  return {
    webspeech: !!SR,
    // on-device recognition: newer Chrome exposes SpeechRecognition.available / install and the processLocally attribute
    webspeechLocal: !!(SR && ("processLocally" in (SR.prototype || {}) || typeof SR.available === "function")),
    local: !!g.__VSS_LOCAL_ASR__,           // set by a local engine module when one is loaded (spec 13.1, second engine)
    mic: !!(g.navigator && g.navigator.mediaDevices && g.navigator.mediaDevices.getUserMedia),
  };
}

export function createSpeech({ onInterim = () => {}, onFinal = () => {}, onState = () => {}, onError = () => {}, lang = "en-US", maxAlternatives = 5, preferLocal = true, g = globalThis } = {}) {
  const det = detectEngines(g);
  const SR = g.SpeechRecognition || g.webkitSpeechRecognition;
  let rec = null, engine = det.local ? "local" : det.webspeech ? "webspeech" : "text", local = false, listening = false, finals = [];

  function info() {
    const note = engine === "text" ? "no speech engine in this browser: type the commands"
      : engine === "local" ? "on-device recogniser: audio stays on this device"
      : local ? "browser recognition on this device (processLocally)"
      : "browser recognition: in Chrome and Edge the audio may be sent to the browser maker's service";
    return { engine, available: engine !== "text", local: engine === "local" || local, note, detected: det };
  }

  function makeRec() {
    const r = new SR();
    r.lang = lang; r.interimResults = true; r.maxAlternatives = maxAlternatives; r.continuous = true;
    if (preferLocal && "processLocally" in r) { try { r.processLocally = true; local = true; } catch { local = false; } }
    r.onresult = (ev) => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const res = ev.results[i];
        if (res.isFinal) finals.push(Array.from(res, (a) => ({ text: a.transcript.trim(), confidence: a.confidence ?? null })));
        else interim += res[0].transcript;
      }
      if (interim) onInterim(interim.trim());
    };
    r.onerror = (e) => { onError(e.error || "speech error"); };
    r.onend = () => { listening = false; onState("idle"); flush(); };
    return r;
  }

  // the final alternatives of an utterance: the recogniser gives alternatives per result segment; the utterance's alternatives are the
  // first alternative of every segment, then each segment's other alternatives with the rest kept at their first (a small cross product)
  function flush() {
    if (!finals.length) return;
    const segs = finals; finals = [];
    const base = segs.map((s) => s[0]);
    const alts = [{ text: base.map((a) => a.text).join(" "), confidence: base.reduce((p, a) => p * (a.confidence ?? 1), 1) }];
    segs.forEach((s, i) => s.slice(1).forEach((a) => alts.push({ text: segs.map((t, j) => (j === i ? a.text : t[0].text)).join(" "), confidence: a.confidence ?? null })));
    onFinal({ alternatives: dedupe(alts).slice(0, maxAlternatives) });
  }

  return {
    info,
    start() {
      if (engine === "local") { g.__VSS_LOCAL_ASR__.start({ onInterim, onFinal, lang }); listening = true; onState("listening"); return true; }
      if (engine !== "webspeech") return false;
      if (listening) return true;
      rec = makeRec(); finals = [];
      try { rec.start(); listening = true; onState("listening"); return true; } catch (e) { onError(String(e)); return false; }
    },
    stop() {
      if (engine === "local") { g.__VSS_LOCAL_ASR__.stop(); listening = false; onState("idle"); return; }
      if (rec && listening) rec.stop();
    },
    abort() { if (rec) rec.abort(); listening = false; finals = []; onState("idle"); },
    get listening() { return listening; },
    setLang(l) { lang = l; },
  };
}

export function dedupe(alts) {
  const seen = new Set(); const out = [];
  for (const a of alts) { const k = a.text.toLowerCase(); if (!seen.has(k)) { seen.add(k); out.push(a); } }
  return out;
}

// spec 12.3 / 13.3 / 15.1: among readings of alternative inputs, keep the clearest: status ok first, then the highest minimum margin, then
// the smallest residual. Returns {best, ranked, reason}. `readings` = [{input, result}] with result from vss.read().
export function minMargin(result) {
  const vals = Object.values(result.margins || {}).filter((v) => typeof v === "number" && Number.isFinite(v));
  return vals.length ? Math.min(...vals) : -Infinity;
}
export function chooseClearest(readings) {
  const rank = (r) => [r.result.status === "ok" ? 0 : r.result.status === "abstain" ? 1 : 2, -minMargin(r.result), r.result.residual ?? 1];
  const ranked = readings.slice().sort((a, b) => { const x = rank(a), y = rank(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i]; return 0; });
  const best = ranked[0];
  const reason = ranked.length < 2 ? "one reading" :
    `kept "${best.input}" (${best.result.status}, min margin ${minMargin(best.result).toFixed(3)}, residual ${(best.result.residual ?? 0).toFixed(3)}) over ${ranked.length - 1} other reading(s)`;
  return { best, ranked, reason };
}
