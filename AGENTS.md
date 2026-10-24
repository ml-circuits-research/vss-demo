# Rules for agents working in this repository (vss-demo)

The rules below are those of the paper repository (vsa-semantic-space@e531283), copied with the import. Additions for this repository:

- **Purpose.** This repository develops the demonstrators; the paper repository is frozen. Never cite a number from this repository as
  a paper result; cite the frozen repository's RESULTS.md section.
- **Specification first.** `vision/VSS_Diagram_Editor_Specification.md` fixes what is built and the criteria (its Table 13, axes and
  criteria) before the runs. A deviation is written into STATUS.md with its reason before the run that uses it.
- **Status files.** The root `STATUS.md`, `current_status.md` and `JOURNAL.md` are this repository's; the paper-era ones are under
  `docs/paper-2026-10/`. Logs of this repository's runs go to `logs/` at the root (`./run.sh` from the root).
- **Browser code.** `web/` has no build step and no runtime dependency beyond the libraries recorded in `app/READER.md` with their
  version and licence.
- **Paths.** Rule 2 below ("source of truth: experiment/00_READ_FIRST.md and experiment/RESULTS.md") refers to the paper's results; for
  the demonstrator the source of truth is the specification and this repository's STATUS.md.

---


1. **Language.** Conversation with the author may be in Romanian. Everything that goes to disk or into a commit — code, comments,
   docstrings, documents, logs, data, commit messages — is in **English**. The Romanian documents have been translated; a
   translation must not change any number, table or conclusion (verify by diffing the extracted numbers before/after).
2. **Source of truth.** `experiment/00_READ_FIRST.md` and `experiment/RESULTS.md`
   rounds 2+ . Anything that contradicts a later round is marked RETRACTED/SUPERSEDED, never deleted.
3. **Evaluation.** Follow `experiment/EVALUATION_PRINCIPLES.md`, rules 1-30, for every new experiment.
   Print the checklist at the end of every evaluation script.
4. **Runs.** Commit the code first, then `./run.sh script.py [args]` (it refuses an unclean tree except `logs/`); every result cited in a
   document points to a log in `experiment/logs/` whose name carries the commit hash. Never re-run to "improve" old numbers.
5. **Workflow.** Code commits are forced by `run.sh`; a **push** marks a judgment point for the reviewing session. At every judgment
   point rewrite `current_status.md` (root) and add an entry to `experiment/JOURNAL.md`.
6. **Synthetic worlds.** From 2026-10-15 on, advanced tests use the English world (`v5_scale.set_lang("en")`); the Romanian world is kept
   for reproducing rounds 1-5.
