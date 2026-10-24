"""noise.py: the two deterministic noise generators of the specification (section 4.3), for the evaluation of the correctors only (never
added to the reader's training data at Level 1). Input: SURFACE sentences (before normalization) or normalized ones; output: the same
sentences with k errors each, and the list of edits, so that the correctors can be scored token by token.

typing: a neighbouring key on a QWERTY keyboard, a deletion, an insertion of a neighbouring key, a transposition of two adjacent letters,
        a missing space between two words, a doubled space removed later by tokenization (no effect) is NOT used.
speech: homophones (two/to/too, four/for, right/write, blue/blew, red/read, one/won, eight/ate, by/buy, there/their), wrong word
        boundaries (arrow -> a row, database -> data base, textbox -> text box, inside -> in side), numbers written as words or digits
        inconsistently, a dropped short function word (the, a, to, of), and a label replaced by a similar-sounding common word from a
        fixed table.
Run: python3 noise.py --kind typing|speech --k 1 --seed 0 < sentences.txt > noisy.jsonl"""
import argparse, json, sys
import numpy as np

QWERTY = ["qwertyuiop", "asdfghjkl", "zxcvbnm"]
POS = {c: (r, i) for r, row in enumerate(QWERTY) for i, c in enumerate(row)}
def neighbours(c):
    if c not in POS: return []
    r, i = POS[c]; out = []
    for dr in (-1, 0, 1):
        for di in (-1, 0, 1):
            if (dr, di) == (0, 0): continue
            rr, ii = r + dr, i + di
            if 0 <= rr < 3 and 0 <= ii < len(QWERTY[rr]): out.append(QWERTY[rr][ii])
    return out

HOMOPHONES = {"two": ["to", "too"], "to": ["two", "too"], "four": ["for"], "for": ["four"], "right": ["write"], "blue": ["blew"], "red": ["read"],
              "one": ["won"], "eight": ["ate"], "by": ["buy"], "there": ["their"], "know": ["no"], "new": ["knew"], "would": ["wood"], "see": ["sea"]}
BOUNDARIES = {"arrow": "a row", "database": "data base", "textbox": "text box", "inside": "in side", "anyone": "any one", "everything": "every thing",
              "rectangle": "rect angle", "into": "in to"}
NUM_FORMS = {"2": "two", "3": "three", "4": "four", "5": "five", "10": "ten", "20": "twenty", "two": "2", "three": "3", "four": "4", "five": "5", "ten": "10", "twenty": "20"}
DROPPABLE = {"the", "a", "to", "of"}
LABEL_SOUNDALIKE = {"orders": "borders", "payments": "pavements", "billing": "building", "shipping": "chipping", "alpha": "alfa", "beta": "better",
                    "delta": "delta", "anna": "ana", "paul": "pole", "maria": "mariah", "redis": "radish", "kafka": "café car", "nginx": "engine x",
                    "postgres": "post grass", "auth": "oath", "cart": "card", "login": "log in", "signup": "sign up"}


def typing_edit(word, rng):
    letters = [i for i, c in enumerate(word) if c.isalpha()]
    if not letters: return word, None
    i = letters[int(rng.integers(len(letters)))]; op = ["sub", "del", "ins", "swap"][int(rng.integers(4))]
    c = word[i]
    if op == "sub" and neighbours(c): return word[:i] + neighbours(c)[int(rng.integers(len(neighbours(c))))] + word[i + 1:], "sub"
    if op == "del" and len(word) > 2: return word[:i] + word[i + 1:], "del"
    if op == "ins" and neighbours(c): return word[:i] + neighbours(c)[int(rng.integers(len(neighbours(c))))] + word[i:], "ins"
    if op == "swap" and i + 1 < len(word) and word[i + 1].isalpha() and word[i + 1] != c: return word[:i] + word[i + 1] + c + word[i + 2:], "swap"
    return word, None                                                    # no applicable edit: the word is left as it is


def noisy(sentence, kind, k, rng):
    toks = sentence.split(); edits = []
    cand = list(range(len(toks)))
    rng.shuffle(cand)
    for i in cand:
        if len(edits) >= k: break
        t = toks[i]
        if t in ".," or "_" in t: continue                               # normalizer tokens (top_left) are produced, never typed or heard
        if kind == "typing":
            if rng.random() < 0.12 and i + 1 < len(toks) and toks[i + 1] not in ".," and "_" not in toks[i + 1] and toks[i + 1]:
                edits.append({"pos": i, "op": "join", "from": f"{t} {toks[i + 1]}", "to": t + toks[i + 1]}); toks[i] = t + toks[i + 1]; toks[i + 1] = ""; continue
            new, op = typing_edit(t, rng)
            if op: edits.append({"pos": i, "op": op, "from": t, "to": new}); toks[i] = new
        else:
            if t in HOMOPHONES: new = HOMOPHONES[t][int(rng.integers(len(HOMOPHONES[t])))]; op = "homophone"
            elif t in BOUNDARIES: new = BOUNDARIES[t]; op = "boundary"
            elif t in NUM_FORMS: new = NUM_FORMS[t]; op = "number_form"
            elif t in LABEL_SOUNDALIKE: new = LABEL_SOUNDALIKE[t]; op = "label_soundalike"
            elif t in DROPPABLE and rng.random() < 0.5: new = ""; op = "drop"
            else: continue
            edits.append({"pos": i, "op": op, "from": t, "to": new}); toks[i] = new
    return " ".join(x for x in toks if x), edits


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--kind", choices=["typing", "speech"], required=True); ap.add_argument("--k", type=int, default=1)
    ap.add_argument("--seed", type=int, default=0); a = ap.parse_args(); rng = np.random.default_rng(a.seed)
    for line in sys.stdin:
        s = line.strip()
        if not s: continue
        n, e = noisy(s, a.kind, a.k, rng); print(json.dumps({"clean": s, "noisy": n, "edits": e}))
