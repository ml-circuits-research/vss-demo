// canvas.js: the one link between the UI and the diagram engine (app/src/editor/view.js and export.js), so that the engine can be
// replaced (spec 9: a diagram library may be compared later) without touching main.js.
export { createView } from "../editor/view.js";
export { exportSVG, exportPNG, exportJSON, importJSON } from "../editor/export.js";
