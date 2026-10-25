"""normalize_table.py: builds normalize.json of the Romanian diagram world: the ENGLISH table of training/worlds/diagram/normalize.json,
unchanged, plus the Romanian rules taken from lexicon_ro.py (so one table normalizes Romanian, English and mixed sentences, as the
bilingual world diagram_multi needs). The English rules are kept first, so an English sentence normalizes exactly as with the English table
(normalize_golden.py checks this on every English golden sentence).

Rules the English table does not have (each optional, so the English table is still read by the same code, app/src/normalize.js):
  quote_marks      Romanian quotation marks („ ” « ») -> '"' before quoted labels are taken
  fold_diacritics  after lower-casing, diacritics are removed (NFD, combining marks U+0300-U+036F dropped), also inside label tokens
  clitics          a token ending in a hyphenated pronoun clitic is split: muta-l -> muta -l, nu-l -> nu -l (contractions run first:
                   intr-o -> in o, n-o -> nu -o, s-o -> sa -o)
  mwe_genitive     a phrase replaced only when the NEXT token ends in a genitive ending (genitive_endings): la stanga cutiei -> left_of
                   cutiei, while la stanga (a direction) stays
  number_joiners   tens + joiner + unit: douazeci si cinci -> 25
Run: python3 normalize_table.py            (writes normalize.json; generate.py refuses to run when normalize.json differs from this build)"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import lexicon_ro as L

EN_TABLE = os.path.join(os.path.dirname(HERE), "diagram", "normalize.json")


def build():
    en = json.load(open(EN_TABLE))
    t = {"about": "The normalizer of the Romanian diagram world (diagram_ro, and the bilingual diagram_multi): the English table of "
                  "training/worlds/diagram/normalize.json unchanged, plus the Romanian rules (built by normalize_table.py from lexicon_ro.py). "
                  "Order: Romanian quotation marks to '\"'; quoted strings become one label token; lower-case; diacritics folded to ASCII; "
                  "contractions; punctuation split; hyphenated pronoun clitics split; genitive-context phrases; multi-word expressions "
                  "(longest first); single-word synonyms; number words to digits (tens + 'si' + unit joined; 'one', 'unu', 'una' never); "
                  "label intro words. The reader never sees the surface forms on the left."}
    t["quote_marks"] = dict(L.QUOTE_MARKS)
    t["fold_diacritics"] = True
    t["contractions"] = {**en["contractions"], **{L.fold(a): L.fold(b) for a, b in L.CONTRACTIONS.items()}}
    t["label_intro"] = en["label_intro"] + [L.tok(w) for w in L.INTRO if L.tok(w) not in en["label_intro"]]
    t["clitics"] = list(L.CLITICS)
    t["mwe_genitive"] = [[a, b] for a, b in L.MWE_GENITIVE]
    t["genitive_endings"] = list(L.GENITIVE_ENDINGS)
    seen = {a for a, _ in en["mwe"]}
    t["mwe"] = [list(x) for x in en["mwe"]] + [[a, b] for a, b in L.MWE if a not in seen]
    t["synonyms"] = {**en["synonyms"], **{L.fold(a): L.fold(b) for a, b in L.SYNONYMS.items() if L.fold(a) not in en["synonyms"]}}
    t["number_words"] = {**en["number_words"], **{L.fold(a): v for a, v in L.NUMBER_WORDS.items() if L.fold(a) not in en["number_words"]}}
    t["number_word_exceptions"] = en["number_word_exceptions"] + [L.fold(w) for w in L.NUMBER_EXCEPTIONS]
    t["number_joiners"] = ["si"]
    t["punctuation"] = en["punctuation"]
    return t


def text():
    return json.dumps(build(), indent=1, ensure_ascii=False) + "\n"


if __name__ == "__main__":
    open(os.path.join(HERE, "normalize.json"), "w").write(text()); print(f"wrote {os.path.join(HERE, 'normalize.json')}")
