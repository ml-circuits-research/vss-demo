// buildstatus.js: what this build is, said on screen (the owner, 2026-10-26: "mark in the UI what the state is and that more is coming").
// Data only; the banner (main.js) and the About panel show it. Update it with every preview build; remove the banner for a final build.
export const BUILD_STATUS = {
  kind: "preview",                       // "preview" shows the banner; "final" hides it
  date: "2026-10-26",
  headline: "Preview build, not final. The reader is a probe model; several parts are still being measured or built.",
  works: [
    "Editing by mouse and touch: shapes, connectors, layout, routing, undo / redo, text and formula widgets, animation player.",
    "Tabs: the diagram and History, the single record: for each input what it meant and what the editor did with it, the rule, and buttons that open every detail (reading with margins, the call, the plan, the SOP wires, the circuit, the sketch readings) as a popup. Requests (every world reads a request) opens from History.",
    "The dialog: 'which one, a or b?' for undecided words, 'did you mean to give a ...?' for a role near its threshold, 'do the rest without it?' for a phrase the editor does not understand.",
    "Examples: the paperclip next to the microphone (a click fills the input, it does not run it).",
  ],
  temporary: [
    "English diagram reader: probe model D2 (5000 sentences, D 1024, one seed of three; run runs/diagram_step3_D2_448c916, data n5000_req_label): about 95% of test commands read exactly, about 98% when the editor asks for a missing word and you answer yes; Table 13 (98-99% without asking) not met yet. The Romanian reader is still the older development model.",
    "Romanian diagram reader: the older development model (D 512); the Romanian route through the dictionary uses the English probe model.",
    "Text, formula and animation commands: no trained reader installed yet (widgets work; dictation writes text).",
    "Sketch: shapes by the classical recogniser ($P); Done opens a preview with two readings of the scene, what VSS read and what the classical rules would make (measured equal on the synthetic split), and you choose.",
    "Requests (a popup opened from History): reads with the editor's own worlds; the request worlds (weather, music, ...) come later.",
  ],
  next: [
    "The rare form \"relation + bare label\" in the examples, then a new probe and its diagnostic; the Romanian and mixed worlds with the same fixes.",
    "Trained readers for the other worlds, measured against the criteria before they replace a development model.",
    "Query wires emitted by the reader (the dialog already consumes them).",
  ],
};
