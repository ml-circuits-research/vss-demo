# The Romanian diagram world (diagram_ro) and the bilingual one (diagram_multi)

Variants A and B of `vision/ADDENDUM_languages_2026-10-25.md`: commands in Romanian (A), or in English, Romanian and a mix of the two
(B), read into the SAME circuit as the English diagram world. The legend is the English world's (`legend_dict()` of
`training/worlds/diagram/generate.py`, with `reader.identity = "lemma"`), written byte-identically: sha256
`e3e44ee9f7e82ca74ab101ed8b3dc66b9645799139b319c5bd25b30fb78324cf` for diagram, diagram_ro and diagram_multi (generate.py asserts it). Events,
roles, operators, values and verbs are English; the gold wires are the English generator's (`wires_for`) with English values. Only the
lexicon and the surface sentences differ.

| file | content |
|---|---|
| `lexicon_ro.py` | the GIVEN Romanian vocabulary (rule 20): nouns with gender and their six forms, adjectives with four forms, verbs with their mood forms, function words, single-word values, number words, multi-word expressions, prefixes. One source for the lexicon, the normalizer's Romanian rules and the dictionary |
| `normalize_table.py` -> `normalize.json` | the normalizer table: the English table unchanged plus the Romanian rules (generate.py refuses to run when the two differ) |
| `normalize.py` | the normalizer (the English one plus five optional table rules; the same code as `app/src/normalize.js`) |
| `normalize_golden.py` -> `normalize_golden.jsonl` | 641 surface sentences with the Python output, for `node app/tests/normalize_test.mjs training/worlds/diagram_ro/normalize_golden.jsonl training/worlds/diagram_ro/normalize.json`; it also asserts that the 331 English golden sentences normalize with this table exactly as with the English one |
| `generate.py` | the world folder (diagram_ro or, with `--languages ro,en,mix`, diagram_multi), `translate_en.json`, COVERAGE |
| `translate_en.json` | variant C: the Romanian-to-English dictionary, built from the same lexicon (format: `training/worlds/DICTIONARIES.md`) |
| `COVERAGE.md`, `COVERAGE_multi.md` | sentences per event and role, at 50000 training sentences |

Run: `python3 generate.py --out <dir>/diagram_ro [--n 30000] [--n_eval 400] [--seed 0] [--mix 0]` and
`python3 generate.py --languages ro,en,mix --out <dir>/diagram_multi`. The folder name is the world name (`_world=diagram_ro` /
`diagram_multi`). Frozen data: `training/data/diagram_ro/`, `training/data/diagram_multi/` (`training/data/freeze.sh`).

## World folder

`examples/train.sop`, `eval_heldout_formulations.sop`, `eval_new_identities.sop`, `eval_mixed.sop` (code-switched sentences of training
formulations, 0.3 of the content slots English; split `mixed`), `eval_parallel.jsonl`; diagram_multi adds `eval_heldout_formulations_en.sop`
and `eval_new_identities_en.sop` (English, splits `heldout_formulations_en`, `new_identities_en`). `split_hints.json` as the English world:
the held-out (template, prefix) combinations are the English world's set (same hash, same ids), the new identities the same labels and
numbers. diagram_multi's training sentences: English 0.4 (the English generator, English normalizer), Romanian 0.4, mixed 0.2 (stated in
`LANG_SHARES`).

`eval_parallel.jsonl`: one row per frame, the SAME draw of an English template realised four ways, each with `surface` (raw, what the
dictionary route reads), `text` (normalized by its world's normalizer) and `gold_sop`: `en` (the English template and prefix, English
normalizer), `ro` (the Romanian realiser), `mix` (code-switched, share 0.3), `romglish` (the English template's words with Romanian content
words: imperative singular verbs, indefinite nouns, masculine singular adjectives; the case the dictionary covers). In this set 'every' is
written 'each' in English, because Romanian 'fiecare' is both; `gold_frames_identical` is true on every row (checked with det an = a).

## The lexicon (kinds.tsv: word, kind, lemma)

- Every Romanian surface form is a line `form<TAB>kind<TAB>lemma`; the lemma is the canonical token of the English world ("rosie",
  "rosu", "rosii" -> red; "cutia", "cutie", "cutiei" -> box; "cutiile", "cutii", "cutiilor" -> boxes: singular and plural stay distinct as
  in the English gold; "adauga", "adaugati", "adaugi", "adaugam" -> add; "o", "un" -> a; "toate", "toti" -> all; "fiecare" -> each;
  "aceasta" -> this; "nu" -> not; "niciodata" -> never). The kind is the English token's kind (VERB, COMPONENT, COLOR, SIZE, STYLE, REL,
  REGION, DIR, AXIS, LAYOUT, a, QUANT, DEM, PRON, INTRO, FILLER, ...). Forms are ASCII-folded, so text with or without diacritics (comma
  or cedilla) reads the same.
- Every English surface form of the English lexicon is a line without lemma (code-switching, and diagram_multi's English sentences);
  English nouns also with the Romanian enclitic article (`database-ul`, `database-urile`, `database-ului`, `database-urilor`).
- Function words: a Romanian word that translates one English function word takes its kind and lemma (si = and, ca = as, este / e = is,
  sunt = are, fata = front, spate = back, culoarea = color, flux = flow, uniform = evenly, distanta = apart, in = in). `sa` (the
  subjunctive marker) takes the kind of English `to` (vreau SA adaugi / i want you TO add), so the segmenter's command start (a VERB after
  FILLER / not / never / to) works unchanged. The others are their own kind, named after the token: la, cu, de, din, pe, lui, care, spre
  (also pana, catre), dimensiunea (also marimea). The paragraph connectives (apoi, dupa, pentru, deoarece, dar, insa, daca, cand, inainte,
  spune) share one kind CONN: they never occur inside one command, and every kind adds K x K x D phases to each of the route book's three
  pairwise tables (diagram_ro has 59 route-book kinds with `unknown`, the English world 49; at the same D the route book is about 1.45 times
  the English one's size).
- Conflicts are refused (generate.py stops): a folded token with two kinds or two lemmas. Avoided by choice of words, stated: lane = banda
  (culoar's plural is culoare, which is also "colour"); note = notita (nota's plural is note, the English token); item = obiect (Romanian
  element is English element); the singular of grup is not an entry (English `group` is the VERB of the group event; only grupuri =
  groups is); enlarge = largeste (mari, the infinitive of a mari, is the plural of mare); the 2pl imperative of a numi is never generated
  (numiti is the participle, a label intro); "as vrea" / "as dori" are joined by the normalizer (as_vrea, FILLER), because folded "as" is
  the English function word `as`.

## Agreement and grammar realised

Noun gender (m, f, n: neuter is masculine in the singular and feminine in the plural) and the six forms (indefinite and definite singular
and plural, genitive singular and plural with the article). Determiners: un / o, fiecare + indefinite, toti / toate + definite plural,
acest / aceasta, acel / acea, acesti / aceste before an indefinite noun, or after the definite one (cutia aceasta). Adjectives after the
noun in gender and number, and in the genitive (cutiei rosii, cercului rosu). Negated attributes: "cutiile care nu sunt albastre", "cutia
care nu este rosie". Placement: "in stanga / la stanga + genitive", "deasupra + genitive", "sub / langa + accusative" (bare noun, or the
definite one with an adjective), "in interiorul + genitive", labels after "lui" (la stanga lui orders, deasupra lui orders), corners and
sides ("in coltul din stanga sus", "pe partea stanga"), amounts ("la 20 de pixeli in stanga cutiei", with "de" from 20 on). Verbs:
imperative singular, polite plural, subjunctive after "poti sa", "ai putea sa", "vreau sa", "as vrea sa", "am nevoie sa", "te rog sa",
first person plural after "hai sa"; pronoun clitics (muta-l, muta-o, sterge-le, n-o muta, nu-l muta, sa-l muti, s-o muti, sa le muti) and
the adjective agreeing with the pronoun (fa-o rosie, fa-l rosu). Negation "nu" (negative imperative = infinitive: nu muta) or "niciodata
sa nu", only with the prefixes that allow it in English (bare, te rog, acum, deci, trailing te rog). Numbers: "doi" / "doua" by gender,
compound "douazeci si cinci", "o suta", "doua sute".

## The normalizer's rules added to the English table

Romanian quotation marks („ ” « ») open and close labels; diacritics folded after lower-casing (also inside label tokens); contractions
(intr-un -> in un, n-o -> nu -o, s-o -> sa -o); hyphenated clitics split (muta-l -> muta -l); genitive-context phrases (la / in stanga,
la / in dreapta -> left_of / right_of only when the next token ends in -ului, -ei, -ii or -lor; otherwise "la stanga" is a direction);
multi-word values to the English world's canonical tokens (top_left, left_of, right_edge, half, to_next, in_chain, flow_lr, bigger,
percent, zoom zoom_in, ...); "baza de date" and "caseta de text" (all forms) as one token; number words with the joiner "si"; label intro
words (numit, numita, numiti, numite, denumit, denumita, denumite, etichetat, etichetata, intitulat, intitulata, cu numele -> cu_numele).
Labels are never translated.

## Code-switching (--mix p, eval_mixed, diagram_multi's mixed share)

Each content slot is English with probability p: the verb (base form, in any mood: "poti sa connect ..."; an object pronoun is then
English "it"), a noun (bare, or with the Romanian article: database-ul, gender neuter), an adjective (no agreement: "o notita yellow"), a
value word (red, left, horizontally), a placement phrase (an English preposition with a Romanian landmark: "below cutia", "left of
cercul"; English corners "in top left"), the anchor, the fraction, the layout ("intr-un row"), the label intro ("called"). Function words
and prefixes stay Romanian. eval_mixed keeps only sentences with at least one English slot. `--mix` (default 0) applies to diagram_ro's
training sentences; eval_mixed and diagram_multi's mixed sentences use 0.3.

## Not covered (stated)

- Indicative or infinitive commands ("muti cutia", "a adauga o cutie"), reflexive and passive forms ("sa fie mutata"), the polite pronoun
  (dumneavoastra), clitic doubling ("o muta pe cutie"), "pe toate".
- The adjectival article and superlatives (cutia cea rosie, cel mai mare), possessive articles (al, a, ai, ale), ordinals, the genitive of
  indefinite phrases (unei cutii, unui cerc), a postposed demonstrative together with an adjective.
- "la stanga" + genitive is recognised only by the next token's ending; a label after "la stanga" without "lui", or an adjective between,
  is read as a direction.
- Hundreds with tens in words (o suta cincizeci), fractions other than half, third and quarter.
- Mixed sentences: English nouns are neuter for agreement; English verbs are not inflected; no English prefixes or function words.
- Typing and speech noise (training/worlds/diagram/noise.py is English), paragraphs and long scripts (paragraphs.py, scripts.py are
  English): there is no Romanian paragraph or script test set yet; the app's segmenter has the Romanian connectives.
- Zoom is said only as "fa / da zoom in / out" (the normalizer turns it into the English 'zoom zoom_in').
