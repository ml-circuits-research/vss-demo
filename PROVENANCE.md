# Provenance

This repository starts from a snapshot of **ml-circuits-research/vsa-semantic-space at commit e531283** (tag `paper-2026-10` plus the
transformer control with word categories, RESULTS 7b-bis), the version the paper "VSS: Formalising Natural Language in a VSA Semantic
Space" reports. That repository is now **frozen for the paper**: no further development happens there, so that every number in the
paper keeps pointing to the code and the logs that produced it. Development of the VSS demonstrators continues here.

What was copied (`git archive e531283`, unmodified at the import commit):
- `experiment/`: all code (the reader, the worlds, the controls, WikiSQL, the trainer, guard.py, run.sh, queue.sh), the protocol and
  decision documents (AGENTS rules, EVALUATION_PRINCIPLES.md rules 1-30, README_DGX.md, RESULTS.md, JOURNAL.md, the judgments and
  instructions), the SICK corpus files under `experiment/corp/` (WikiSQL is not tracked, as in the source);
- `tool/`: the `sop` package (SOP Lang, check, train, infer, diff), the worlds server, the train-world skill, the exporters, the tests;
- `docs/`: the specifications;
- root documents of the paper era moved to `docs/paper-2026-10/` (STATUS.md, current_status.md, INITIAL_ANALYSIS_DGX.md).

What was NOT copied, and stays only in the frozen repository as the paper's evidence: `experiment/logs/` (one log per run) and
`tool/runs/` (the committed GPU runs of the packaged reader). Any statement here about a paper result cites the frozen repository
(`vsa-semantic-space@e531283:experiment/RESULTS.md`, section number), never a file of this repository.

From the import commit on, changes to copied files are ordinary commits of this repository, with their reason in the message.
