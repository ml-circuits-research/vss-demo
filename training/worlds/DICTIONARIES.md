# Dictionaries into the English reader (variant C of the languages design)

A dictionary lets the editor read commands in a language that has no trained world: the words of the sentence are replaced mechanically by
English tokens, and the English diagram reader reads the result (`app/src/translate.js`, then the English world's normalizer, then the
reader; `vision/ADDENDUM_languages_2026-10-25.md`). Nothing is trained. What a dictionary cannot give is the other language's word order:
the English reader reads English order, so a language whose commands are ordered differently is read well only by a trained world of that
language (variant A, as `diagram_ro`) or a bilingual one (variant B, `diagram_multi`). A dictionary covers directly "Romglish" style input:
English grammar with words of another language.

## Format

One JSON file per language:

```json
{
 "about": "what this dictionary is, who wrote it, from what",
 "language": "ro",
 "target_world": "diagram",
 "entries": {
  "cutia": ["the box"],
  "cutiile": ["the boxes"],
  "o": ["a"],
  "rosie": ["red"],
  "la": ["to", "at"],
  "in coltul din stanga sus": ["in the top_left"],
  "muta-l": ["move it"],
  "lui": [""]
 }
}
```

| field | meaning |
|---|---|
| `about` | free text: the source of the entries and how they were made |
| `language` | the language code (BCP 47 primary tag: ro, it, fr, ...); the file is installed as `app/model/dict/<language>.json` |
| `target_world` | the world whose reader reads the translation (`diagram`); its legend, lexicon and normalizer define the target tokens |
| `entries` | key -> list of values (below) |

Rules (the translator's, stated in `app/src/translate.js`):

- **Keys are folded**: lower case, diacritics removed (NFD, combining marks dropped; s-comma and s-cedilla both -> s, t-comma and
  t-cedilla -> t). Write them already folded. The input is folded the same way and split on spaces, with sentence punctuation
  (`. , ; : ! ?` before a space or the end) split off.
- **Multi-word keys** are written with single spaces (`"in coltul din stanga sus"`, `"de pixeli"`, `"nu-l muta"`). Keys are matched
  longest first, left to right, on whole words. A hyphenated form is one word (`muta-l`), so clitic combinations are keys of their own.
- **Values** are token sequences of the TARGET world as its normalizer writes them, or as its normalizer will turn them into such tokens:
  the English world's canonical tokens for multi-word values (`top_left`, `left_of`, `right_edge`, `half`, `to_next`, `in_chain`,
  `flow_lr`, `zoom zoom_in`), English words otherwise. Every token of every value must have a kind in the target world's `kinds.tsv` (or
  match its legend's value patterns, numbers and labels): check it when the file is written (training/worlds/diagram_ro/generate.py
  `check_dictionary` does, for Romanian).
- **One value** = a deterministic replacement. **Several values** = alternatives: the translator makes the sentence variants (the cross
  product, first values first, capped), the reader reads each and the editor keeps the clearest reading (status, then the minimum margin,
  then the residual). Put the most likely value first. A dictionary never decides an ambiguity itself.
- **An empty value** (`""`) drops the word (`"lui": [""]`, the genitive particle English does not need).
- **Words without an entry pass through** unchanged: English words, labels, numbers in digits. **Labels are never translated**: the word
  after a label intro (a value ending in `called`, `named`, `labelled`, `titled`, or a target-world intro word) keeps its spelling.
- **Morphology is spelled out**: a language with enclitic articles gives the article in the value (`"cutia": ["the box"]`, `"cutiile":
  ["the boxes"]`); plural forms map to the English plural token (the English gold keeps singular and plural distinct); an adjective that
  follows its noun is best given as a noun + adjective key (`"cutia rosie": ["the red box"]`) so the English order comes out; a form that
  is ambiguous once folded (Romanian "caseta" is both the indefinite casetă and the definite caseta) gets both readings as alternatives, and
  longer keys with its determiner ("o caseta de text": ["a textbox"]).

## Adding a dictionary for a language with no trained world

1. Write `<language>.json` with the fields above. Cover, for the diagram world: the verbs of the legend's events (every form a user types:
   imperative, polite, infinitive), the component nouns (singular and plural, with and without the article), colours, sizes, styles,
   directions, axes, layouts, the placement phrases (to their canonical tokens), determiners, negation (`do not`, `never`), the command
   prefixes (`please`, `can you`), units and number words (to digits).
2. Check every value token against `training/worlds/diagram`'s `kinds.tsv` (generate it with `python3 training/worlds/diagram/generate.py
   --out <dir>`) and the legend's value patterns.
3. Try it on sentences of the language, through the translator and the English normalizer (`app/src/translate.js`, `app/src/normalize.js`),
   and look at what the English reader reads.
4. Install it: `python3 training/export_app.py --dict <language>.json --language <language> --target diagram --note "<source>"` copies it
   to `app/model/dict/<language>.json` and lists it in `app/model/index.json`; the editor then offers the route "dictionary <language> ->
   diagram". `--remove-dict <language>` removes it.

The Romanian dictionary (`training/worlds/diagram_ro/translate_en.json`, about 11000 keys) is generated from the lexicon of the trained
Romanian world (`lexicon_ro.py`), so variant C and variant A use the same word knowledge and are compared on the same parallel set
(`eval_parallel.jsonl`, training/TODO_DGX.md 2.6). A hand-written dictionary for another language is a few hundred keys.

## A second language: a few Italian entries (the format is not Romanian-specific)

```json
{
 "about": "Example only: a few Italian entries to show the format (not installed, not measured).",
 "language": "it",
 "target_world": "diagram",
 "entries": {
  "aggiungi": ["add"], "sposta": ["move"], "cancella": ["delete"], "collega": ["connect"], "rinomina": ["rename"],
  "una": ["a"], "un": ["a"], "uno": ["a"], "la": ["the"], "il": ["the"], "le": ["the"], "i": ["the"], "tutte le": ["all the"],
  "scatola": ["box"], "scatole": ["boxes"], "cerchio": ["circle"], "cerchi": ["circles"], "base di dati": ["database"],
  "rossa": ["red"], "rosso": ["red"], "rosse": ["red"], "blu": ["blue"],
  "la scatola rossa": ["the red box"], "una scatola rossa": ["a red box"],
  "in alto a sinistra": ["in the top_left"], "a sinistra di": ["left_of"], "sotto": ["below"], "accanto a": ["next_to"],
  "a": ["to", "at"], "con": ["with"], "di": ["of", "from"], "non": ["do not"], "per favore": ["please"],
  "chiamata": ["called"], "chiamato": ["called"], "pixel": ["px"], "venti": ["20"]
 }
}
```

"aggiungi una scatola rossa in alto a sinistra" becomes "add a red box in the top_left", which the English reader reads. "sposta la
scatola a sinistra di cerchio" becomes "move the box left_of circle" (the three-word key wins over "a"); Italian word orders that English does
not have (an object pronoun before the verb: "la sposti") need a trained Italian world.
