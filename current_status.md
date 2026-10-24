# current status (rewritten at every judgment point)

- 2026-10-24: the repository is split into `app/` (public: the static application, no server, one HTML file in `app/dist/`, desktop
  and phone) and `training/` (private: generators, frozen data of our own worlds with sha256, parity tests, DGX scripts, export to the
  app). Every module of the specification that does not need a trained model is built and tested (STATUS.md), and wired into the
  interface (browser check 116/116). The installed reader is a CPU development model, labelled so; no number of the demo exists yet.
- Next: `training/TODO_DGX.md`, from step 1.1 (the diagram world, five seeds, four sizes). Known gaps written there: the reader cannot
  yet decode nested formula trees (decoder extension E1-E4 first), the sketch recogniser misses two synthetic criteria (connectors 0.963,
  planted unknowns 12/13), the hand-drawn, recorded-speech and dictated-animation sets need people.
