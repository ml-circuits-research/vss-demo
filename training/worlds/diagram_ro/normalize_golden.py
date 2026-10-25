"""normalize_golden.py: surface sentences of the Romanian generator (before normalization) with the Python normalizer's output, one JSON per
line, written to normalize_golden.jsonl for app/tests/normalize_test.mjs (node app/tests/normalize_test.mjs
training/worlds/diagram_ro/normalize_golden.jsonl training/worlds/diagram_ro/normalize.json). Includes: hand-written hard cases (quotes,
Romanian quotation marks, diacritics with comma and with cedilla, no diacritics, clitics, genitive placement, number words), Romanian, mixed
and Romglish realisations of every template, and every English golden sentence of the English world, for which the check below also
asserts that the Romanian table normalizes them exactly as the English table does (one table serves diagram_multi)."""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import numpy as np
import generate as RG
G, L = RG.G, RG.L
normalize = RG.normalize_ro

HARD = ['Adaugă o cutie roșie în colțul din stânga sus.', 'Adauga o cutie rosie in coltul din stanga sus.', 'Adaugă o cutie roşie în colţul din stânga sus.',
        'pune o notiță „Verifică Stocul” sub baza de date', "mută-l la 20 de pixeli în stânga cutiei roșii", "nu-l muta la stânga", "n-o șterge",
        "poți s-o muți într-o coloană?", "vreau să le ștergi pe toate", "adaugă douăzeci și cinci de cercuri", "adaugă două sute de cutii",
        "fă cercul cu 50% mai mare", "fă cercul cu cincizeci la sută mai mic", "aș vrea să faci zoom in", "conectează fiecare cutie cu următoarea",
        "conectează toate cutiile una după alta", "aranjează totul ca un flux de la stânga la dreapta", "mută serverul la jumătatea drumului spre marginea din dreapta",
        "adaugă o cutie numită 'Plăți Noi' în partea stângă", "redenumește cache-ul în „Sesiuni”", "pune un database roșu below cutia",
        "connect cutia la server", "adaugă o casetă de text cu numele titlu", "mută cutia la stânga lui orders", "mută cutia deasupra cercului mare",
        "mută cutia la dreapta", "mută cutia în stânga serverului", "spațiază cutiile la 40 de pixeli distanță", "adaugă unu cerc", "Adaugă Trei Cercuri Albastre!"]


def main():
    out_path = os.path.join(HERE, "normalize_golden.jsonl")
    en = subprocess.run([sys.executable, os.path.join(RG.EN_DIR, "normalize_golden.py")], capture_output=True, text=True, check=True).stdout.splitlines()
    en_rows = [json.loads(l) for l in en if l.strip()]
    diff = [(r["surface"], r["tokens"], normalize(r["surface"])[0]) for r in en_rows
            if (normalize(r["surface"])[0], normalize(r["surface"])[1]) != (r["tokens"], r["info"])]
    if diff: sys.exit(f"the Romanian table normalizes {len(diff)} English golden sentences differently, e.g. {diff[:3]}")
    rs = np.random.default_rng(5); g = G.Gen(rs, G.LABELS_TRAIN, G.NUMS_TRAIN); r = RG.Ro(rs); rows = []
    for ev, ts in G.TEMPLATES.items():
        for tid, f in ts:
            for k in range(6):
                p = G.PREFIXES[k % len(G.PREFIXES)] if k < 4 else G.PREFIXES[int(rs.integers(len(G.PREFIXES)))]
                s, *_ = RG.realise_ro(r, ev, tid, f, p, g, mix=0.3 if k >= 4 else 0.0); rows.append(s)
            words, roles = f(g); rows.append(" ".join(RG.romglish(words, roles, ev)))
    with open(out_path, "w", encoding="utf-8") as fo:
        for s in HARD + rows + [x["surface"] for x in en_rows]:
            toks, info = normalize(s); fo.write(json.dumps({"surface": s, "tokens": toks, "info": info}, ensure_ascii=False) + "\n")
    print(f"wrote {out_path}: {len(HARD) + len(rows) + len(en_rows)} sentences ({len(en_rows)} English, normalized as by the English table)")


if __name__ == "__main__":
    main()
