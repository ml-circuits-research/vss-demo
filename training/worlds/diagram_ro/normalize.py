"""normalize.py: the normalizer of the Romanian diagram world (diagram_ro and diagram_multi), driven by normalize.json so that the JavaScript
version (app/src/normalize.js, the same code for every world) applies exactly the same rules. normalize(text) -> (tokens, info), with
info = {labels: {token: original text}, numbers: {token: value}}. Deterministic; no learning.

The English normalizer (training/worlds/diagram/normalize.py) with five table-driven rules added (normalize_table.py says why); with a
table that lacks them (the English one) this code does exactly what the English normalizer does. Steps: (0) quote_marks to '"';
(1) quoted strings become one label token (lower case, folded, spaces -> '_'), remembered with their original text; (2) lower-case;
(2b) fold_diacritics; (3) contractions; (4) punctuation split; (4b) clitics split; (4c) mwe_genitive (a phrase replaced only before a
token with a genitive ending); (5) multi-word expressions, longest first, on whole tokens; (6) single-word synonyms; (7) number words to
digits (twenty five, douazeci si cinci -> 25; 'one', 'unu', 'una' never); (8) after a label-intro word, the next token is a label."""
import json, os, re, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))


def fold(s): return "".join(c for c in unicodedata.normalize("NFD", s) if not "̀" <= c <= "ͯ")


class Normalizer:
    def __init__(self, table):
        T = self.T = table
        self.MWE = sorted(((a.split(), b.split()) for a, b in T["mwe"]), key=lambda x: -len(x[0]))
        self.GEN = sorted(((a.split(), b.split()) for a, b in T.get("mwe_genitive", [])), key=lambda x: -len(x[0]))
        self.GEN_END = tuple(T.get("genitive_endings", []))
        self.SYN = {k: v for k, v in T["synonyms"].items() if " " not in k}
        self.SYN_MULTI = sorted(((k.split(), v.split()) for k, v in T["synonyms"].items() if " " in k), key=lambda x: -len(x[0]))
        self.NUM = T["number_words"]; self.NO_NUM = set(T["number_word_exceptions"]); self.INTRO = set(T["label_intro"])
        self.JOIN = set(T.get("number_joiners", [])); self.CLITICS = list(T.get("clitics", [])); self.FOLD = bool(T.get("fold_diacritics"))
        self.QUOTE = re.compile(r"\"([^\"]+)\"|(?<![A-Za-z0-9])'([^']+)'(?![A-Za-z0-9])")   # a quote inside a word (let's, don't) never opens a label

    def label_token(self, s):
        s = s.lower()
        if self.FOLD: s = fold(s)
        return re.sub(r"[^a-z0-9]+", "_", s).strip("_") or "label"

    def numbers(self, toks, info):
        NUM, NO_NUM = self.NUM, self.NO_NUM
        out, i = [], 0
        while i < len(toks):
            t = toks[i]
            if t in NUM and t not in NO_NUM:
                v = NUM[t]; j = i + 1
                if v == 100 and out and out[-1].isdigit(): v = int(out.pop()) * 100        # "two hundred", "doua sute"
                elif 20 <= v <= 90 and j < len(toks) and toks[j] in NUM and 1 <= NUM[toks[j]] <= 9 and toks[j] not in NO_NUM: v += NUM[toks[j]]; j += 1
                elif (20 <= v <= 90 and j + 1 < len(toks) and toks[j] in self.JOIN and toks[j + 1] in NUM and 1 <= NUM[toks[j + 1]] <= 9
                      and toks[j + 1] not in NO_NUM): v += NUM[toks[j + 1]]; j += 2                # "douazeci si cinci"
                out.append(str(v)); info["numbers"][str(v)] = v; i = j; continue
            if t.isdigit(): info["numbers"][t] = int(t)
            out.append(t); i += 1
        return out

    def split_clitics(self, toks):
        if not self.CLITICS: return toks
        out = []
        for t in toks:
            for c in self.CLITICS:
                if len(t) > len(c) and t.endswith(c): out += [t[:-len(c)], c]; break
            else: out.append(t)
        return out

    def __call__(self, text):
        T = self.T; info = {"labels": {}, "numbers": {}}
        for a, b in T.get("quote_marks", {}).items(): text = text.replace(a, b)
        def q(m):
            s = m.group(1) or m.group(2); tok = self.label_token(s); info["labels"][tok] = s; return f" {tok} "
        text = self.QUOTE.sub(q, text)
        s = text.lower()
        if self.FOLD: s = fold(s)
        for a, b in T["contractions"].items(): s = s.replace(a, b)
        s = re.sub(r"([" + re.escape(T["punctuation"]) + r"])(?=\s|$)", r" \1 ", s)
        toks = self.split_clitics(s.split())
        if self.GEN:
            out, i = [], 0
            while i < len(toks):
                for a, b in self.GEN:
                    k = i + len(a)
                    if toks[i:k] == a and k < len(toks) and toks[k].endswith(self.GEN_END): out += b; i = k; break
                else: out.append(toks[i]); i += 1
            toks = out
        for table in (self.MWE, self.SYN_MULTI):
            out, i = [], 0
            while i < len(toks):
                for a, b in table:
                    if toks[i:i + len(a)] == a: out += b; i += len(a); break
                else: out.append(toks[i]); i += 1
            toks = out
        toks = [self.SYN.get(t, t) for t in toks]
        toks = self.numbers(toks, info)
        for i, t in enumerate(toks[:-1]):
            if t in self.INTRO and toks[i + 1] not in info["labels"]: info["labels"][toks[i + 1]] = toks[i + 1]
        return toks, info


normalize = Normalizer(json.load(open(os.path.join(HERE, "normalize.json"), encoding="utf-8")))

if __name__ == "__main__":
    import sys
    for line in sys.stdin:
        toks, info = normalize(line); print(" ".join(toks), json.dumps(info, ensure_ascii=False))
