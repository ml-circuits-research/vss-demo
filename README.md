# vss-demo (private)

Development of the VSS demonstrators, starting from the frozen paper repository (see PROVENANCE.md). The first demonstrator is the
**VSS Diagram Editor**: diagrams built, edited and animated by voice and text in the browser, read by the VSS reader running locally
from a model of a few megabytes. Its specification is `vision/VSS_Diagram_Editor_Specification.md` (and the .docx), version 2.6.

## Layout

| path | content |
|---|---|
| `vision/` | the specification of the demonstrator (what to build, criteria written before the runs) |
| `experiment/` | the paper's reader, worlds, controls and training code (imported; the protocol rules apply) |
| `tool/` | the `sop` package (SOP Lang, check, train, infer, diff, export-web), the worlds server, the train-world skill |
| `tool/worlds_src/diagram/` | the diagram world: legend, kinds, generator, noise, split hints (spec sections 3-4) |
| `web/` | the browser side: `vss.js` (the reader in JavaScript), correctors, the editor (spec sections 7-19) |
| `docs/paper-2026-10/` | the paper-era status documents, kept for reference |
| `INSTRUCTIONS_DGX_*.md` | the runs to make on the DGX, in order, with their exit checks |

## Rules

`AGENTS.md` (the paper repository's rules, with the additions for this repository). Criteria before runs, one change per run, every
number labelled and pointing to a log, no duration estimates.
