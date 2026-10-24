# The textedit world (VSS Diagram Editor, spec section 14)

The second world of the editor: editing commands spoken inside dictation ("bold the last sentence", "turn the last three lines into a
numbered list", "replace twenty with thirty"). In dictation mode every utterance is read by this world's reader; it is executed as a
command only when the reading is clear enough (the command threshold), otherwise it is written as text (app/src/text/dictation.js).

| file | content |
|---|---|
| `generate.py` | legend (Table 9), kinds lexicon, templates per event x prefix families, held-out formulations (template x prefix combinations), new identities (pieces of text, widget names, numbers); writes a world folder that `sop check` validates and `sop train` trains; writes COVERAGE.md |
| `normalize.json`, `normalize.py` | the normalizer of commands (one table, also used by app/src/text/textnorm.js); its `dictation` block is the spoken punctuation and layout table of dictation mode |
| `normalize_golden.py`, `normalize_golden.jsonl` | our own generated commands with the Python normalizer's output, for the JavaScript parity check (app/tests/dictation.mjs) |
| `prose_synth.py` | dictated prose of our own (negatives), with a deliberate share of editing words in ordinary use |
| `prose_download.py` | public-domain prose (Project Gutenberg) for the DGX only, sha256-pinned; nothing it fetches is committed |
| `prose_sources.lock.json` | (created on the first DGX run with `--pin`) the sha256 of each prose source; hashes only |
| `calibrate.py` | the command threshold, set on calibration rows that include the prose, and the two dictation rows of Table 13 |
| `gpu_textedit.sh` | the DGX run: data-size curve, prose, five calibrated seeds, export to app/model/textedit/ |
| `COVERAGE.md` | sentences per event and role in the training file; closed values seen |

Run locally (CPU): `python3 generate.py --out <dir>/textedit --n 400 --n_eval 100`, `tool/bin/sop check --legend <dir>/textedit/legend.json
<dir>/textedit/examples/*.sop`, `tool/bin/sop train <dir>/textedit --D 128 --epochs 1 --star_version 2 --no_ckpt` (a smoke run, a
pipeline check, not a result), `python3 prose_synth.py --out <dir>/textedit/raw --n 400`, `python3 calibrate.py --world <dir>/textedit`.
The world folder must be named `textedit` (the SOP files carry `_world=textedit`).

## Legend (spec Table 9)

Events and their verbs (the given synonym table; one verb, one event):

| event | verbs (after normalization) |
|---|---|
| select | select, choose, mark |
| format | make, turn, set, format, convert, embolden, italicise, underline, strike, highlight, color |
| unformat | unformat ("remove the bold from", "clear the formatting of", "unbold" are normalized to it) |
| insert | insert, add, type, put |
| delete | delete, remove, erase, cut ("scratch that", "get rid of") |
| replace | replace, change, correct, swap |
| move_cursor | go, jump, move ("put the cursor" -> "move the cursor") |
| capitalise | capitalise, uppercase |
| make_list | bullet, number, enumerate, itemise |
| make_heading | promote, demote |
| align | align, centre, justify |
| undo / redo / read_back | undo / redo / read ("read back", "read out", "read me") |

Roles: `unit` (character(s), word(s), sentence(s), line(s), paragraph(s), list_item(s), everything, selection, it, that), `ordinal`
(first..fifth, last, previous, next, this, and first_N / last_N / next_N / previous_N for N = 2..5), `match` (a piece of the text),
`format` (bold, italic, underlined, strikethrough, highlighted, plain, heading, heading_one..three, list, bullet_list, numbered_list),
`value` (colours, size classes small / normal / large / huge / bigger / smaller, alignments left / right / center / justified),
`position` (before, after, at_start, at_end), `new_text`, `widget`.

## Design decisions (stated; they are also in the header of generate.py)

- **One token per filler.** Multi-word values become single tokens through the normalizer: heading_one, bullet_list, list_item, at_start,
  at_end, full_stop, new_line, and the counted ordinals ("the last three" -> last_3).
- **One verb, one event.** The synonym table is given, so "make" and "turn" belong to `format`: "make the first line a heading" and "turn
  the last three lines into a numbered list" read as `format` with a block format; `make_heading` (promote, demote) and `make_list` (bullet,
  number, enumerate, itemise) have their own verbs, and the executor treats a block format of `format` exactly as those events. Verbs that
  name a format carry it in the verb (the frame's lemma), with the format role absent.
- **Verb forms.** "bold" and "center" are values and verbs; the normalizer rewrites them to embolden / centre when no world verb precedes
  them ("bold the last word"; "make it bold" keeps "bold"), so one token keeps one kind. "that <unit>" becomes "this <unit>": "that" alone
  is the pronoun unit, "this" the ordinal.
- **Open text.** Every token outside the closed lexicon is a piece of text (kind MATCH, the legend's value pattern): dictated content is
  open vocabulary. The reader's no-sense status is therefore rarer than in the diagram world, and the command / content decision rests on
  the margins against the command threshold, which is set on calibration rows that include dictated prose.
- **value** holds colour, size class and alignment (Table 9 names colour and size; alignment is the value of `align`).
- **Ranges** use `position`: "select from revenue to the end" -> match=revenue, position=at_end.
- Level 1 only: one command per utterance, no negation, no nesting; "select from Q3 to the end and make it italic" (two events) is Level 2.

## Dictated prose: how the negatives enter calibration

The prose sentences are content, never commands. They are not examples of the world (no gold wires) and never enter training. calibrate.py
reads every prose row through normalize.py and the trained reader, exactly as dictation mode does, and computes for each reading m = the
minimum over every margin (structure, event, each role's identity and presence margins). A reading is executed only when its status is ok
and m >= t. The threshold t is the smallest value >= tau for which the share of CALIBRATION prose rows that would be executed is <= 0.005
(half the criterion, a stated margin); the commands of the calibration half of the held-out formulations (the half the trainer already
uses for presence thresholds) show the price in commands inserted as text. The TEST halves report the two rows of Table 13: content
executed as a command (prose test rows, criterion <= 1%, by category) and commands inserted as text (the other half of the held-out
formulations and the new identities, criterion <= 5%). The chip band is 0.05 below t (inserted as text, the chip offers the command).
Both prose sets are split by a hash of the sentence; prose_synth.py writes `prose_synth_{calibration,test}.tsv` and prose_download.py
`prose_pd_{calibration,test}.tsv`, and calibrate.py reads every `raw/prose_*_{calibration,test}.tsv` it finds.
