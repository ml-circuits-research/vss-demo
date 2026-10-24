"""prose_download.py: dictated-prose NEGATIVES from public-domain books (spec 14.6), for the DGX only. The texts come from others, so
NOTHING this script downloads or writes is ever committed: the books go to a cache folder outside the repository and the sentences to
the world folder's raw/ (the DGX script builds the world in a temporary folder).

Source: Project Gutenberg plain-text files of books in the public domain in the United States (listed in SOURCES below). Each file is
checked against its sha256 in prose_sources.lock.json (next to this script). The hashes could not be pinned on the development machine
(gutenberg.org is not reachable from it), so the FIRST run on the DGX is made with --pin: it downloads, prints and writes the hashes into
prose_sources.lock.json, which is then committed (the lock file holds hashes only, no text). Every later run verifies them and stops on a
mismatch (exit 3), so the prose test set is the same on every run.

What it writes: <out>/prose_pd_calibration.tsv and <out>/prose_pd_test.tsv, 'sentence<TAB>category<TAB>source', split by a hash of the
sentence. Sentences are the book body (between the Gutenberg START and END markers), cut at . ! ? and kept when they have 5 to 30 words
and no digits-only tokens; category 'editing_words' when a word of the textedit lexicon's verbs, units or formats occurs in it (as in
ordinary use), else 'ordinary'. The sample keeps a deliberate share of 'editing_words' rows (--editing_share, default 0.6) as spec 14.6
asks, and --n rows in all. How they enter calibration: exactly as prose_synth.py's rows (calibrate.py).
Run (DGX): python3 prose_download.py --cache ~/.cache/vss-prose --out <world>/raw [--pin] [--n 4000] [--seed 0]"""
import argparse, hashlib, json, os, re, sys, urllib.request
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
LOCK = os.path.join(HERE, "prose_sources.lock.json")
SOURCES = [   # (id, title, url); Project Gutenberg, public domain in the US
    ("pg1342", "Pride and Prejudice (Austen)", "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"),
    ("pg1661", "The Adventures of Sherlock Holmes (Doyle)", "https://www.gutenberg.org/cache/epub/1661/pg1661.txt"),
    ("pg98", "A Tale of Two Cities (Dickens)", "https://www.gutenberg.org/cache/epub/98/pg98.txt"),
    ("pg84", "Frankenstein (Shelley)", "https://www.gutenberg.org/cache/epub/84/pg84.txt"),
    ("pg20203", "Autobiography of Benjamin Franklin", "https://www.gutenberg.org/cache/epub/20203/pg20203.txt"),
    ("pg1404", "The Federalist Papers", "https://www.gutenberg.org/cache/epub/1404/pg1404.txt")]
EDIT_WORDS = {"select", "choose", "mark", "make", "turn", "set", "format", "convert", "bold", "italic", "underline", "strike", "highlight",
              "colour", "color", "insert", "add", "type", "put", "delete", "remove", "erase", "cut", "replace", "change", "correct", "swap", "go",
              "jump", "move", "capitalise", "capitalize", "bullet", "number", "promote", "demote", "align", "centre", "center", "justify", "undo",
              "redo", "read", "word", "words", "line", "lines", "sentence", "sentences", "paragraph", "paragraphs", "heading", "list", "first",
              "last", "next", "previous", "letter", "letters", "character", "characters"}
START = re.compile(r"\*\*\* ?START OF (THE|THIS) PROJECT GUTENBERG EBOOK.*?\*\*\*", re.I | re.S)
END = re.compile(r"\*\*\* ?END OF (THE|THIS) PROJECT GUTENBERG EBOOK", re.I)


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""): h.update(b)
    return h.hexdigest()


def fetch(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "vss-demo prose_download.py (research; one download per book)"})
    with urllib.request.urlopen(req, timeout=120) as r, open(dest + ".part", "wb") as f: f.write(r.read())
    os.replace(dest + ".part", dest)


def sentences(text):
    m = START.search(text); text = text[m.end():] if m else text
    m = END.search(text); text = text[:m.start()] if m else text
    text = re.sub(r"\s+", " ", text.replace("_", " "))
    for s in re.split(r"(?<=[.!?])\s+(?=[A-Z\"'])", text):
        s = s.strip().strip("\"'").strip()
        words = s.split()
        if not (5 <= len(words) <= 30) or any(w.strip(".,;:!?").isdigit() for w in words) or s.isupper(): continue
        if re.search(r"(CHAPTER|Chapter|[\[\]{}<>*#=|])", s): continue
        yield s


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--cache", required=True, help="folder for the downloaded books (outside the repository)")
    ap.add_argument("--out", required=True, help="the world's raw/ folder"); ap.add_argument("--pin", action="store_true", help="first run: record the sha256 of each file in prose_sources.lock.json")
    ap.add_argument("--n", type=int, default=4000); ap.add_argument("--seed", type=int, default=0); ap.add_argument("--editing_share", type=float, default=0.6)
    a = ap.parse_args()
    repo = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
    if os.path.abspath(a.cache).startswith(os.path.abspath(repo) + os.sep): sys.exit("refusing: the cache must be outside the repository (texts from others are never committed)")
    os.makedirs(a.cache, exist_ok=True); os.makedirs(a.out, exist_ok=True)
    lock = json.load(open(LOCK)) if os.path.exists(LOCK) else {"about": "sha256 of the public-domain prose sources (prose_download.py); hashes only, no text", "files": {}}
    rows = {"editing_words": [], "ordinary": []}
    for sid, title, url in SOURCES:
        dest = os.path.join(a.cache, sid + ".txt")
        if not os.path.exists(dest): print(f"download {url}"); fetch(url, dest)
        h = sha256(dest); want = lock["files"].get(sid, {}).get("sha256")
        if want is None:
            if not a.pin: sys.exit(f"{sid}: no pinned sha256 in {LOCK}; run once with --pin (then commit the lock file)")
            lock["files"][sid] = {"title": title, "url": url, "sha256": h}; print(f"pinned {sid} sha256 {h}")
        elif want != h: print(f"{sid}: sha256 {h} differs from the pinned {want}; stopping (the test set must not change)"); sys.exit(3)
        for s in sentences(open(dest, encoding="utf-8", errors="replace").read()):
            toks = set(re.findall(r"[a-z]+", s.lower()))
            rows["editing_words" if toks & EDIT_WORDS else "ordinary"].append((s, sid))
    if a.pin: json.dump(lock, open(LOCK, "w"), indent=1); print(f"wrote {LOCK}: commit it")
    g = np.random.default_rng(a.seed); k_edit = min(len(rows["editing_words"]), int(round(a.n * a.editing_share))); k_ord = min(len(rows["ordinary"]), a.n - k_edit)
    pick = lambda xs, k: [xs[i] for i in sorted(g.choice(len(xs), size=k, replace=False))] if k else []
    sample = [(s, "editing_words", sid) for s, sid in pick(rows["editing_words"], k_edit)] + [(s, "ordinary", sid) for s, sid in pick(rows["ordinary"], k_ord)]
    files = {k: open(os.path.join(a.out, f"prose_pd_{k}.tsv"), "w", encoding="utf-8") for k in ("calibration", "test")}
    for f in files.values(): f.write("# sentence\tcategory\tsource -- public-domain prose (prose_download.py); NEGATIVE rows of the command threshold; never commit\n")
    cnt = {}
    for s, c, sid in sample:
        h = "calibration" if int(hashlib.sha256(s.lower().encode()).hexdigest()[:8], 16) % 2 == 0 else "test"
        files[h].write(f"{s.replace(chr(9), ' ')}\t{c}\t{sid}\n"); cnt[(h, c)] = cnt.get((h, c), 0) + 1
    for f in files.values(): f.close()
    print(f"prose_download: {len(sample)} sentences -> {a.out}: " + ", ".join(f"{h}/{c} {v}" for (h, c), v in sorted(cnt.items())))


if __name__ == "__main__":
    main()
