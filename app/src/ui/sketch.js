// sketch.js (ui): sketch mode (spec 17): the pad of src/sketch/view.js laid over the canvas, a strip with Done and Cancel. DOM only: the
// strokes go to the caller (recognise -> scene pass -> applyToScene), which decides everything.
//   const sk = createSketchMode({ host, strip, done, cancel, canvas, onStrokes(strokes, {stay}), onState(open) });
//   sk.open(); sk.close(); sk.isOpen
import { mountSketchPad } from "../sketch/view.js";

export function createSketchMode(el) {
  let view = null;
  const open = () => {
    if (view) return; el.host.hidden = false; el.strip.hidden = false; el.canvas.classList.add("under-sketch");
    view = mountSketchPad(el.host, { onCleanUp: (strokes) => { el.onStrokes(strokes, { stay: true }); view.clear(); } });
    el.onState && el.onState(true);
  };
  const close = () => {
    if (!view) return; view.destroy(); view = null; el.host.hidden = true; el.strip.hidden = true; el.canvas.classList.remove("under-sketch");
    el.onState && el.onState(false);
  };
  el.done.onclick = () => { const s = view ? view.pad.strokes() : []; close(); el.onStrokes(s, { stay: false }); };
  el.cancel.onclick = () => close();
  return { open, close, get isOpen() { return !!view; }, get view() { return view; } };
}
