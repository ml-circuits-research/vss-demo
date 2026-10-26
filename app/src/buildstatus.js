// buildstatus.js: what this build is, said on screen (the owner, 2026-10-26: "mark in the UI what the state is and that more is coming").
// Data only; the banner (main.js) and the About panel show it. Update it with every preview build; remove the banner for a final build.
export const BUILD_STATUS = {
  kind: "preview",                       // "preview" shows the banner; "final" hides it
  date: "2026-10-26",
  headline: "Preview build, not final. The reader is a probe model; several parts are still being measured or built.",
  works: [
    "Editing by mouse and touch: shapes, connectors, layout, routing, undo / redo, text and formula widgets, animation player.",
    "Tabs: Diagram, History, Actions (the rule behind each behaviour), Assistant (the call a reading would make), Requests (every world reads a request), Sketch: how it is read.",
    "The dialog: 'which one, a or b?' for undecided words, 'did you mean to give a ...?' for a role near its threshold, 'do the rest without it?' for a phrase the editor does not understand.",
    "Examples: the paperclip next to the microphone (a click fills the input, it does not run it).",
  ],
  temporary: [
    "English diagram reader: in the DGX preview build, probe model B (5000 sentences, D 1024, one seed of three; about 72% of test commands read exactly; a create without its object may pass as ok, fix pending Q12 / D19); in a build from the repository, the older development model (D 512). The badge says which.",
    "Romanian diagram reader: the older development model (D 512); the Romanian route through the dictionary uses the English probe model.",
    "Text, formula and animation commands: no trained reader installed yet (widgets work; dictation writes text).",
    "Sketch: shapes by the classical recogniser ($P), the scene by rules; the VSS scene reader is available in Settings (measured equal to the rules on the synthetic split).",
    "Requests tab: reads with the editor's own worlds; the request worlds (weather, music, ...) come later.",
  ],
  next: [
    "Required roles per event in the reader and the legend, then a new probe and its diagnostic.",
    "Trained readers for the other worlds, measured against the criteria before they replace a development model.",
    "Query wires emitted by the reader (the dialog already consumes them).",
  ],
};
