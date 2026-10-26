# current status (rewritten at every judgment point)

- 2026-10-26 (DGX session): environment up (.venv torch 2.14.1+cu130); app tests PASS, browser check 124/124, the reader's parity suite
  PASS end to end after the decoder fixes D1 / D5 and the structure anchor (b924c05). sop profile of the demo worlds recorded before and
  after D2 (logs/profile_*). Built today: the _undecided dialog, the dialog's consumption of query wires (queries.js), the planted-questions
  world (training/worlds/planted, 300 sentences). A survey of what works / trains / needs attention: docs/state/STATE_2026-10-26.md.
- Running (TODO 2.12, --activate auto, contract decoder, five seeds, sizes 1000-50000, in parallel): diagram, animation, textedit
  (runs/*_6df62b0), diagram_ro, diagram_multi (runs/*_7ad2f48). No size finished yet; no demo number exists yet. Superseded:
  runs/*_1c9c7fc (decoder before D1 / D5).
- Next: the Table 13 rows of each world when its sizes finish, the shipped size, then export and parity on the trained models (TODO 1.3).
  Waiting on the source (vss-vs-bert/sop): the query wire and its emission (D8), the decoder extension E1-E4 (matheditor). Waiting on the
  owner: the paid API for paraphrases (1.2) and the people-made sets. Side task when there is time: the interface of D10.
