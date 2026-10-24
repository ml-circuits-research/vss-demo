# STATUS — VSS Diagram Editor (labels BUILT / MEASURED / PLANNED; every number points to a log in logs/)

The axes and criteria are those of the specification, Table 13 (vision/VSS_Diagram_Editor_Specification.md, section 21). Rows are
added as the steps of section 23 (order of work) are done. Smoke tests on CPU are not results and do not appear here.

| step (spec 23) | content | label | log / file | number |
|---|---|---|---|---|
| 1 | legend, kinds, generator at Level 1; sop check on all output | BUILT (generator, check) | tool/worlds_src/diagram/ | coverage table in tool/worlds_src/diagram/COVERAGE.md |
| 2 | portable stars, Python and JavaScript | BUILT (stars v2, golden test passes) | web/tests/stars_test.mjs | |
| 3 | training on templates, five seeds, data-size curve | PLANNED (DGX) | | |
| 4 | paraphrases, second look, retraining | PLANNED (DGX + LLM API) | | |
| 5 | export and vss.js, parity test | BUILT (export-web, vss.js, parity chain; run on smoke models only) | web/tests/run_all.sh | |
| 7-8 (part) | planner, resolver, geometry (Kiwi), locks, undo; scenario suite | BUILT (scenarios pass on hand-written frames) | web/tests/scenarios.mjs | |
| 9 (part) | typed and speech correctors, normalizer | BUILT (smoke test) | web/CORRECTORS.md | |
| 6-19 | library choice, planner, layout, correctors, voice, interface, text, segmentation, formulas, sketch, scripts, animation | PLANNED | | |
