"""normalize.py: the diagram world's normalizer (specification sections 2 and 3.2), driven by normalize.json so that the JavaScript
version (web/normalize.js) applies exactly the same rules. normalize(text) -> (tokens, info), with info = {labels: {token: original text},
numbers: {token: value}}. Deterministic; no learning.

Steps: (1) quoted strings ("..." or '...') become one label token (lower-case, spaces -> '_'), remembered with their original text;
(2) lower-case; (3) contractions; (4) punctuation split; (5) multi-word expressions, longest first, on whole tokens; (6) single-word
synonyms; (7) number words to digits (twenty five -> 25; 'one' never); (8) after a label-intro word, the next token is a label (kept as
it is, remembered)."""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
T = json.load(open(os.path.join(HERE, "normalize.json")))
MWE = sorted(((a.split(), b.split()) for a, b in T["mwe"]), key=lambda x: -len(x[0]))
SYN = {k: v for k, v in T["synonyms"].items() if " " not in k}
SYN_MULTI = sorted(((k.split(), v.split()) for k, v in T["synonyms"].items() if " " in k), key=lambda x: -len(x[0]))
NUM = T["number_words"]; NO_NUM = set(T["number_word_exceptions"]); INTRO = set(T["label_intro"])
QUOTE = re.compile(r"\"([^\"]+)\"|'([^']+)'")


def _label_token(s): return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_") or "label"


def _numbers(toks, info):
    out, i = [], 0
    while i < len(toks):
        t = toks[i]
        if t in NUM and t not in NO_NUM:
            v = NUM[t]; j = i + 1
            if v == 100 and out and out[-1].isdigit(): v = int(out.pop()) * 100        # "two hundred"
            elif 20 <= v <= 90 and j < len(toks) and toks[j] in NUM and 1 <= NUM[toks[j]] <= 9 and toks[j] not in NO_NUM: v += NUM[toks[j]]; j += 1
            out.append(str(v)); info["numbers"][str(v)] = v; i = j; continue
        if t.isdigit(): info["numbers"][t] = int(t)
        out.append(t); i += 1
    return out


def normalize(text):
    info = {"labels": {}, "numbers": {}}
    def q(m):
        s = m.group(1) or m.group(2); tok = _label_token(s); info["labels"][tok] = s; return f" {tok} "
    text = QUOTE.sub(q, text)
    s = text.lower()
    for a, b in T["contractions"].items(): s = s.replace(a, b)
    s = re.sub(r"([" + re.escape(T["punctuation"]) + r"])(?=\s|$)", r" \1 ", s)
    toks = s.split()
    for table in (MWE, SYN_MULTI):
        out, i = [], 0
        while i < len(toks):
            for a, b in table:
                if toks[i:i + len(a)] == a: out += b; i += len(a); break
            else: out.append(toks[i]); i += 1
        toks = out
    toks = [SYN.get(t, t) for t in toks]
    toks = _numbers(toks, info)
    for i, t in enumerate(toks[:-1]):
        if t in INTRO and toks[i + 1] not in info["labels"]: info["labels"][toks[i + 1]] = toks[i + 1]
    return toks, info


if __name__ == "__main__":
    import sys
    for line in sys.stdin:
        toks, info = normalize(line); print(" ".join(toks), json.dumps(info))
