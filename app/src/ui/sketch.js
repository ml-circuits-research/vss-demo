// sketch.js (ui): sketch mode (spec 17): the pad of src/sketch/view.js laid over the canvas, a strip with Done and Cancel. DOM only: the
// strokes go to the caller, which opens the preview of the two readings (D23) and decides everything.
//   const sk = createSketchMode({ host, strip, done, cancel, canvas, onStrokes(strokes, {stay, accept, discard}), onState(open) });
//   sk.open(); sk.close(); sk.isOpen
// Done (and the pad's Clean up) hand the strokes over while the pad stays where it is: `accept()` is what the caller calls when the person has
// chosen a reading (Done: leave sketch mode; Clean up: clear the pad and go on drawing); `discard()` when the person cancels in the preview (Done:
// leave sketch mode without applying; Clean up: clear the pad). Closing the preview with its X changes nothing: the strokes are still on the pad.
import { mountSketchPad } from "../sketch/view.js";

export function createSketchMode(el) {
  let view = null;
  const open = () => {
    if (view) return; el.host.hidden = false; el.strip.hidden = false; el.canvas.classList.add("under-sketch");
    view = mountSketchPad(el.host, { onCleanUp: (strokes) => { el.onStrokes(strokes, { stay: true, accept: () => view && view.clear(), discard: () => view && view.clear() }); } });
    el.onState && el.onState(true);
  };
  const close = () => {
    if (!view) return; view.destroy(); view = null; el.host.hidden = true; el.strip.hidden = true; el.canvas.classList.remove("under-sketch");
    el.onState && el.onState(false);
  };
  el.done.onclick = () => {
    const s = view ? view.pad.strokes() : [];
    if (!s.length) { close(); el.onStrokes(s, { stay: false }); return; }
    el.onStrokes(s, { stay: false, accept: close, discard: close });
  };
  el.cancel.onclick = () => close();
  return { open, close, get isOpen() { return !!view; }, get view() { return view; } };
}
