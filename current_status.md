# current status (rewritten at every judgment point)

- 2026-10-24: repository created from vsa-semantic-space@e531283 (PROVENANCE.md); specification 2.6 in vision/. Prepared on CPU before
  the DGX: the diagram world at Level 1 (legend, kinds, generator, split hints, noise generators), portable stars, sop export-web, the
  JavaScript reader with a parity test against Python, the correctors. Next on the DGX: INSTRUCTIONS_DGX_2026-10-24.md, step 3.
- 2026-10-24 (later): committed the browser reader (app/src/vss.js, web/vss/), `sop export-web` (8/4/32 bits), stars v2 in train/infer,
  and the parity chain (training/parity/run_all.sh: PASS on smoke models; frames identical, state cosine 1.000000). Smoke models are not
  results. Open for the DGX: step 3 with --star_version 2, then step 5 on the real model, including the 4-bit check.
