# Addendum to the specification (version 2.6): commands in other languages, one English circuit

Date: 2026-10-25. Status: design decided, code built (app/src/translate.js, routes.js, worlds.js; tool/sop reader.identity; the
Romanian world generator), training and measurement PLANNED (training/TODO_DGX.md, section 2.6).

## 1. The requirement

Commands may be given in Romanian, in a mix of Romanian and English, or in another language, while what VSS reads is always the same
circuit of the one English legend (events, roles, values). The editor's settings choose which reader serves which purpose; when several
can serve one purpose, the editor reads with all of them and keeps the reading that is understood most clearly.

## 2. Three variants, built side by side so they can be compared

| variant | what it is | what it needs | what it cannot do |
|---|---|---|---|
| A. a world trained on the language (diagram_ro) | the diagram legend unchanged; a Romanian generator realising every English template with Romanian grammar; a given bilingual lexicon | training (DGX) | languages without a generator |
| B. a bilingual world (diagram_multi) | one model trained on English, Romanian and mixed sentences | training (DGX) | as A |
| C. a dictionary into the English reader | word-by-word (and multi-word) substitution before the English reader; ambiguous words become alternatives that the reader decides | only a dictionary (training/worlds/DICTIONARIES.md) | word orders the English reader never saw; enclitic and agreement phenomena beyond what the dictionary encodes |

C also covers "Romglish": English grammar with words of another language, which is exactly word substitution.

## 3. One legend, one circuit

The legend of the diagram world is produced once (training/worlds/diagram/generate.py legend_dict) and written byte-identically by every
language's generator, so every reader of the purpose has the same legend sha256 and writes the same kind of circuit. The legend gains one
reader key, `identity: "lemma"` (tool/sop/legend.py): every token is deposited in the chart, and read back by the decoder, with the
identity of its lexicon lemma (kinds.tsv third column). For English the lemma is the word itself; for Romanian the given lexicon maps each
surface form to the canonical English value ("roșie", "rosie", "roșu" -> red; "cutiile" -> boxes; "adaugă" -> add). VSS learns the
language's syntax (which word fills which role) through the route book; the lexicon only says which value a word stands for, as kinds are
given (rule 20). Labels (names) are never translated. Default `identity: "token"` keeps every earlier model unchanged (parity tested).

## 4. Routes and the choice between them

A route is a trained reader of one world, or a dictionary followed by the reader of its target world (app/src/worlds.js routesFor). In
Settings, "Read commands with" is Automatic (every route reads; the clearest reading wins: status, then the minimum margin, then the
residual; the rule of spelling and speech alternatives, 12.3 and 13.3, one level up) or one route. The reading strip says which route
answered, and the panel lists what the others read. A paragraph is segmented by the route whose lexicon covers the largest share of its
words, then read unit by unit by that route. Each world ships its own normalizer table (diacritics folded, number words, multi-word
values) and its correctors work over its own lexicon.

## 5. Criteria, written before the runs (training/TODO_DGX.md 2.6)

| axis | measure | criterion |
|---|---|---|
| Romanian world, Table 13 rows | as for the diagram world | as for the diagram world |
| Parallel check | share of commands whose English and Romanian realisations give identical frames | reported; >= 0.95 at the shipped size to call the demo multilingual |
| Mixed and Romglish sentences | FULL frame per variant A, B, C | reported |
| Variants compared | FULL on eval_parallel (Romanian, mixed, Romglish realisations) for A, B, C | reported; the comparison is the finding |
| Automatic choice | share of sentences routed to a route that reads them right; FULL after the choice | >= 0.98 routed right on clean in-world sentences |

## 6. Limits carried

The dictionary path inherits the English word order; a language with a different order needs variant A or B to be read well. Speech
recognition in Romanian depends on the browser's engine. The textedit, matheditor and animation worlds are English only; the same design
applies to them (a purpose, a legend, routes) when their generators gain other languages.

## 7. Addendum of the same day: the role-cue gates are given, not learned

Run 1a of vss-vs-bert showed that the learned gates of the reader differ by seed (one seed opens "from" instead of the sentence end)
and that this is the whole source of the spread on new formulations. The words that open a role's address (to, of, in, on, at, by, from,
with, into, as, and, the comma, the sentence end) are a given of the legend, like the kinds (rule 20): the legend already states which
roles exist and which question each answers; stating the cue words those questions rest on is the same kind of knowledge. Every world of
the demo (diagram in its three languages, textedit, animation) now carries `reader.gates_given` with its cue words open; everything else is
still learned. The frozen data were regenerated (new legend sha256; the sentences are unchanged). In the comparison with BERT the given
gates are a separate declared row with the matching treatment for BERT (vss-vs-bert responses R14); the demo uses them by default.
