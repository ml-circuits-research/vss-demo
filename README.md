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
| `app/` | PUBLIC: the static browser application (no server); see app/README.md |
| `training/` | PRIVATE: world generators, data, parity tests against Python, DGX scripts; produces app/model/ |
| `docs/paper-2026-10/` | the paper-era status documents, kept for reference |
| `training/TODO_DGX.md` | everything that must run on the DGX, in order, with commands and exit checks (supersedes INSTRUCTIONS_DGX_2026-10-24.md) |

## Public and private

`app/` is the only part meant for the public: a static application with no server (one HTML file, or the folder on any static host),
for desktop and phone. Everything else (generators, frozen data, training scripts, the engine from the paper repository) is private and
produces `app/model/` through `training/export_app.py`. Data that comes from others is never committed (training/README.md).

## Rules

`AGENTS.md` (the paper repository's rules, with the additions for this repository). Criteria before runs, one change per run, every
number labelled and pointing to a log, no duration estimates.
