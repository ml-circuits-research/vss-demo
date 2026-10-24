// script.js (ui): the document view of a long script (spec 18) in a dialog: the text on one side, every sentence marked with what it did
// on the other (src/script/view.js), a checkpoint control per section. DOM only; reading, planning and running are the caller's.
//   const sd = createScriptDialog({ dlg, text, doc, run, cont, example, onRun(text), onContinue(), onCheckpoint(k), exampleText });
//   sd.open(prefill); sd.show(model, {waiting})
import { renderDocument } from "../script/view.js";

export function createScriptDialog(el) {
  el.run.onclick = () => { const t = el.text.value.trim(); if (t) el.onRun(t); };
  el.cont.onclick = () => el.onContinue();
  el.example.onclick = () => { el.text.value = el.exampleText; };
  const empty = () => { const p = document.createElement("p"); p.className = "muted"; p.textContent = "The document view shows here: every sentence with what it did."; el.doc.replaceChildren(p); };
  empty();
  return {
    open(prefill = null) { if (prefill != null) el.text.value = prefill; if (!el.dlg.open) el.dlg.showModal(); el.text.focus(); },
    show(model, { waiting = null } = {}) {
      renderDocument(el.doc, model, { onCheckpoint: (k) => el.onCheckpoint(k), onSelectUnit: (i) => el.onSelectUnit && el.onSelectUnit(i) });
      el.cont.hidden = !waiting || !!waiting.cycle;
    },
    reset: empty,
  };
}
