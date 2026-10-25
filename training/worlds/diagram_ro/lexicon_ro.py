"""lexicon_ro.py: the GIVEN Romanian vocabulary of the diagram world (rule 20): every Romanian surface form with the canonical English token
it stands for. One source for three products, so they never drift apart: the lexicon kinds.tsv (word, kind, lemma), the Romanian rules
of the normalizer table (normalize_table.py) and the word-to-English dictionary translate_en.json (generate.py, variant C).

Forms are written with diacritics; fold() gives the ASCII form that the normalizer writes and the lexicon stores (s, t, a, i). A Romanian
form whose folded spelling equals another form with a DIFFERENT kind or lemma is a conflict, and generate.py refuses to write the lexicon
(feminine nouns in -a, whose indefinite and definite singular fold to one spelling, have the same lemma: no conflict, the determiner is a
separate token). Genders: m (masculine), f (feminine), n (neuter: masculine in the singular, feminine in the plural)."""
import unicodedata


def fold(s):
    """lower case, diacritics removed (NFD, combining marks U+0300-U+036F dropped): roșie, roşie, rosie -> rosie"""
    return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if not "̀" <= c <= "ͯ")


def tok(form):
    """the token of a form after the normalizer: folded, a multi-word noun joined by '_' (baza de date -> baza_de_date)"""
    return fold(form).replace(" ", "_")


# ------------------------------------------------------------------ nouns: English singular -> (gender, sg, sg def, pl, pl def, gen sg def, gen pl def)
NOUNS = {
    "box": ("f", "cutie", "cutia", "cutii", "cutiile", "cutiei", "cutiilor"),
    "process": ("n", "proces", "procesul", "procese", "procesele", "procesului", "proceselor"),
    "step": ("m", "pas", "pasul", "pași", "pașii", "pasului", "pașilor"),
    "task": ("f", "sarcină", "sarcina", "sarcini", "sarcinile", "sarcinii", "sarcinilor"),
    "decision": ("f", "decizie", "decizia", "decizii", "deciziile", "deciziei", "deciziilor"),
    "diamond": ("n", "romb", "rombul", "romburi", "romburile", "rombului", "romburilor"),
    "start": ("n", "început", "începutul", "începuturi", "începuturile", "începutului", "începuturilor"),
    "end": ("n", "sfârșit", "sfârșitul", "sfârșituri", "sfârșiturile", "sfârșitului", "sfârșiturilor"),
    "database": ("f", "bază de date", "baza de date", "baze de date", "bazele de date", "bazei de date", "bazelor de date"),
    "store": ("n", "depozit", "depozitul", "depozite", "depozitele", "depozitului", "depozitelor"),
    "cache": ("n", "cache", "cache-ul", "cache-uri", "cache-urile", "cache-ului", "cache-urilor"),
    "queue": ("f", "coadă", "coada", "cozi", "cozile", "cozii", "cozilor"),
    "document": ("n", "document", "documentul", "documente", "documentele", "documentului", "documentelor"),
    "file": ("n", "fișier", "fișierul", "fișiere", "fișierele", "fișierului", "fișierelor"),
    "report": ("n", "raport", "raportul", "rapoarte", "rapoartele", "raportului", "rapoartelor"),
    "user": ("m", "utilizator", "utilizatorul", "utilizatori", "utilizatorii", "utilizatorului", "utilizatorilor"),
    "actor": ("m", "actor", "actorul", "actori", "actorii", "actorului", "actorilor"),
    "customer": ("m", "cumpărător", "cumpărătorul", "cumpărători", "cumpărătorii", "cumpărătorului", "cumpărătorilor"),
    "service": ("n", "serviciu", "serviciul", "servicii", "serviciile", "serviciului", "serviciilor"),
    "server": ("n", "server", "serverul", "servere", "serverele", "serverului", "serverelor"),
    "api": ("n", "api", "api-ul", "api-uri", "api-urile", "api-ului", "api-urilor"),
    "gateway": ("f", "poartă", "poarta", "porți", "porțile", "porții", "porților"),
    "client": ("m", "client", "clientul", "clienți", "clienții", "clientului", "clienților"),
    "cloud": ("m", "nor", "norul", "nori", "norii", "norului", "norilor"),
    "group": ("n", "grup", "grupul", "grupuri", "grupurile", "grupului", "grupurilor"),
    "container": ("n", "container", "containerul", "containere", "containerele", "containerului", "containerelor"),
    "lane": ("f", "bandă", "banda", "benzi", "benzile", "benzii", "benzilor"),
    "note": ("f", "notiță", "notița", "notițe", "notițele", "notiței", "notițelor"),
    "comment": ("n", "comentariu", "comentariul", "comentarii", "comentariile", "comentariului", "comentariilor"),
    "textbox": ("f", "casetă de text", "caseta de text", "casete de text", "casetele de text", "casetei de text", "casetelor de text"),
    "title": ("n", "titlu", "titlul", "titluri", "titlurile", "titlului", "titlurilor"),
    "caption": ("f", "legendă", "legenda", "legende", "legendele", "legendei", "legendelor"),
    "circle": ("n", "cerc", "cercul", "cercuri", "cercurile", "cercului", "cercurilor"),
    "ellipse": ("f", "elipsă", "elipsa", "elipse", "elipsele", "elipsei", "elipselor"),
    "square": ("n", "pătrat", "pătratul", "pătrate", "pătratele", "pătratului", "pătratelor"),
    "rectangle": ("n", "dreptunghi", "dreptunghiul", "dreptunghiuri", "dreptunghiurile", "dreptunghiului", "dreptunghiurilor"),
    "triangle": ("n", "triunghi", "triunghiul", "triunghiuri", "triunghiurile", "triunghiului", "triunghiurilor"),
    "star": ("f", "stea", "steaua", "stele", "stelele", "stelei", "stelelor"),
    "hexagon": ("n", "hexagon", "hexagonul", "hexagoane", "hexagoanele", "hexagonului", "hexagoanelor"),
    "line": ("f", "linie", "linia", "linii", "liniile", "liniei", "liniilor"),
    "arrow": ("f", "săgeată", "săgeata", "săgeți", "săgețile", "săgeții", "săgeților"),
    "connector": ("m", "conector", "conectorul", "conectori", "conectorii", "conectorului", "conectorilor"),
    "shape": ("f", "formă", "forma", "forme", "formele", "formei", "formelor"),
    "component": ("f", "componentă", "componenta", "componente", "componentele", "componentei", "componentelor"),
    "element": ("n", "element", "elementul", "elemente", "elementele", "elementului", "elementelor"),
    "item": ("n", "obiect", "obiectul", "obiecte", "obiectele", "obiectului", "obiectelor"),
    "thing": ("f", "chestie", "chestia", "chestii", "chestiile", "chestiei", "chestiilor"),
    "canvas": ("f", "planșă", "planșa", "planșe", "planșele", "planșei", "planșelor"),
    "screen": ("n", "ecran", "ecranul", "ecrane", "ecranele", "ecranului", "ecranelor"),
}
SG_ONLY_EN = {"canvas", "screen"}             # English has no plural token for these (kinds.tsv): only the singular forms are entries
PL_ONLY_EN = {"group"}                        # English "group" is the VERB of the group event: only the plural "grupuri" (groups) is a noun entry

# ------------------------------------------------------------------ adjectives: English -> (m sg, f sg, m pl, f pl); gen f sg = f pl
ADJ = {
    "red": ("roșu", "roșie", "roșii", "roșii"), "orange": ("portocaliu", "portocalie", "portocalii", "portocalii"),
    "yellow": ("galben", "galbenă", "galbeni", "galbene"), "green": ("verde", "verde", "verzi", "verzi"),
    "teal": ("turcoaz", "turcoaz", "turcoaz", "turcoaz"), "blue": ("albastru", "albastră", "albaștri", "albastre"),
    "purple": ("mov", "mov", "mov", "mov"), "pink": ("roz", "roz", "roz", "roz"), "brown": ("maro", "maro", "maro", "maro"),
    "gray": ("gri", "gri", "gri", "gri"), "black": ("negru", "neagră", "negri", "negre"), "white": ("alb", "albă", "albi", "albe"),
    "tiny": ("minuscul", "minusculă", "minusculi", "minuscule"), "small": ("mic", "mică", "mici", "mici"),
    "medium": ("mediu", "medie", "medii", "medii"), "large": ("mare", "mare", "mari", "mari"), "huge": ("uriaș", "uriașă", "uriași", "uriașe"),
    "solid": ("continuu", "continuă", "continui", "continue"), "dashed": ("întrerupt", "întreruptă", "întrerupți", "întrerupte"),
    "dotted": ("punctat", "punctată", "punctați", "punctate"), "thick": ("gros", "groasă", "groși", "groase"),
    "thin": ("subțire", "subțire", "subțiri", "subțiri"),
}


def adj_form(en, gender, plural, gen=False):
    m_sg, f_sg, m_pl, f_pl = ADJ[en]
    if plural: return m_pl if gender == "m" else f_pl
    if gender == "f": return f_pl if gen else f_sg
    return m_sg


# ------------------------------------------------------------------ verbs: (English lemma, imperative 2sg, infinitive (negative 2sg), subjunctive 2sg, 2pl, subjunctive 1pl)
VERBS = [
    ("add", "adaugă", "adăuga", "adaugi", "adăugați", "adăugăm"), ("draw", "desenează", "desena", "desenezi", "desenați", "desenăm"),
    ("create", "creează", "crea", "creezi", "creați", "creăm"), ("insert", "inserează", "insera", "inserezi", "inserați", "inserăm"),
    ("sketch", "schițează", "schița", "schițezi", "schițați", "schițăm"),
    ("put", "pune", "pune", "pui", "puneți", "punem"), ("place", "plasează", "plasa", "plasezi", "plasați", "plasăm"),
    ("place", "așază", "așeza", "așezi", "așezați", "așezăm"),
    ("delete", "șterge", "șterge", "ștergi", "ștergeți", "ștergem"), ("remove", "elimină", "elimina", "elimini", "eliminați", "eliminăm"),
    ("erase", "radiază", "radia", "radiezi", "radiați", "radiem"),
    ("move", "mută", "muta", "muți", "mutați", "mutăm"), ("shift", "deplasează", "deplasa", "deplasezi", "deplasați", "deplasăm"),
    ("drag", "trage", "trage", "tragi", "trageți", "tragem"), ("push", "împinge", "împinge", "împingi", "împingeți", "împingem"),
    ("slide", "glisează", "glisa", "glisezi", "glisați", "glisăm"),
    ("make", "fă", "face", "faci", "faceți", "facem"), ("turn", "colorează", "colora", "colorezi", "colorați", "colorăm"),
    ("paint", "vopsește", "vopsi", "vopsești", "vopsiți", "vopsim"), ("fill", "umple", "umple", "umpli", "umpleți", "umplem"),
    ("set", "setează", "seta", "setezi", "setați", "setăm"), ("change", "schimbă", "schimba", "schimbi", "schimbați", "schimbăm"),
    ("resize", "redimensionează", "redimensiona", "redimensionezi", "redimensionați", "redimensionăm"),
    ("enlarge", "lărgește", "lărgi", "lărgești", "lărgiți", "lărgim"), ("shrink", "micșorează", "micșora", "micșorezi", "micșorați", "micșorăm"),
    ("grow", "crește", "crește", "crești", "creșteți", "creștem"), ("scale", "scalează", "scala", "scalezi", "scalați", "scalăm"),
    ("connect", "conectează", "conecta", "conectezi", "conectați", "conectăm"), ("link", "leagă", "lega", "legi", "legați", "legăm"),
    ("join", "unește", "uni", "unești", "uniți", "unim"), ("attach", "atașează", "atașa", "atașezi", "atașați", "atașăm"),
    ("name", "numește", "numi", "numești", None, "numim"),          # 2pl "numiți" is also the participle (a label intro): never a verb here
    ("call", "denumește", "denumi", "denumești", "denumiți", "denumim"), ("rename", "redenumește", "redenumi", "redenumești", "redenumiți", "redenumim"),
    ("label", "etichetează", "eticheta", "etichetezi", "etichetați", "etichetăm"),
    ("copy", "copiază", "copia", "copiezi", "copiați", "copiem"), ("duplicate", "duplică", "duplica", "duplici", "duplicați", "duplicăm"),
    ("clone", "clonează", "clona", "clonezi", "clonați", "clonăm"),
    ("group", "grupează", "grupa", "grupezi", "grupați", "grupăm"), ("wrap", "încadrează", "încadra", "încadrezi", "încadrați", "încadrăm"),
    ("ungroup", "degrupează", "degrupa", "degrupezi", "degrupați", "degrupăm"),
    ("arrange", "aranjează", "aranja", "aranjezi", "aranjați", "aranjăm"), ("organize", "organizează", "organiza", "organizezi", "organizați", "organizăm"),
    ("tidy", "ordonează", "ordona", "ordonezi", "ordonați", "ordonăm"),
    ("align", "aliniază", "alinia", "aliniezi", "aliniați", "aliniem"),
    ("distribute", "distribuie", "distribui", "distribui", "distribuiți", "distribuim"), ("space", "spațiază", "spația", "spațiezi", "spațiați", "spațiem"),
    ("bring", "adu", "aduce", "aduci", "aduceți", "aducem"), ("send", "trimite", "trimite", "trimiți", "trimiteți", "trimitem"),
    ("undo", "anulează", "anula", "anulezi", "anulați", "anulăm"), ("redo", "refă", "reface", "refaci", "refaceți", "refacem"),
    ("clear", "golește", "goli", "golești", "goliți", "golim"), ("clear", "curăță", "curăța", "cureți", "curățați", "curățăm"),
]
VERB_BY_LEMMA = {}
for v in VERBS: VERB_BY_LEMMA.setdefault(v[0], []).append(v)
# zoom: "fă zoom in" / "dă zoom out" (the normalizer turns each mood form + zoom in/out into the English 'zoom zoom_in', mwe below)
ZOOM_FORMS = [("fă", "face", "faci", "faceți", "facem"), ("dă", "da", "dai", "dați", "dăm")]

# ------------------------------------------------------------------ closed classes and function words: form -> (kind, lemma or None)
# a Romanian function word that translates one English function word takes that word's kind and lemma (si = and, ca = as, este = is,
# fata = front); the others are their own kind, named after the token (la, cu, de, din, pe, lui, care, spre, pana), as English function
# words are. 'sa' (the subjunctive marker) takes the kind of English 'to' (i want you TO add / vreau SA adaugi): the segmenter skips it
# before a verb (app/src/segment/segment.js DEFAULT_COMMAND_KINDS).
FUNCTION = {
    "o": ("a", "a"), "un": ("a", "a"), "toate": ("QUANT", "all"), "toți": ("QUANT", "all"), "fiecare": ("QUANT", "each"),
    "orice": ("QUANT", "any"), "ambele": ("QUANT", "both"),
    "această": ("DEM", "this"), "acest": ("DEM", "this"), "acesta": ("DEM", "this"), "acea": ("DEM", "that"), "acel": ("DEM", "that"),
    "acela": ("DEM", "that"), "aceea": ("DEM", "that"), "aceste": ("DEM", "these"), "acești": ("DEM", "these"), "acestea": ("DEM", "these"),
    "aceștia": ("DEM", "these"), "acele": ("DEM", "those"), "acei": ("DEM", "those"),
    "-l": ("PRON", "it"), "-o": ("PRON", "it"), "-i": ("PRON", "them"), "-le": ("PRON", "them"), "le": ("PRON", "them"), "totul": ("PRON", "everything"),
    "nu": ("not", "not"), "niciodată": ("never", "never"),
    "este": ("is", "is"), "e": ("is", "is"), "sunt": ("are", "are"), "și": ("and", "and"), "ca": ("as", "as"), "să": ("to", None),
    "față": ("front", "front"), "spate": ("back", "back"), "culoarea": ("color", "color"), "flux": ("flow", "flow"), "uniform": ("evenly", "evenly"),
    "distanță": ("apart", "apart"), "împreună": ("together", "together"),
    "în": ("in", None), "la": ("la", None), "cu": ("cu", None), "de": ("de", None), "din": ("din", None), "pe": ("pe", None), "lui": ("lui", None),
    "care": ("care", None), "spre": ("spre", None), "până": ("spre", None), "către": ("spre", None), "dimensiunea": ("dimensiunea", None),
    "mărimea": ("dimensiunea", None),
    # connectives of paragraphs (the segmenter cuts at them by their tokens, app/src/segment/segment.js CONNECTIVES; they never occur inside
    # one command): one kind CONN for all, because every kind adds K x K x D phases to each of the route book's three pairwise tables
    "apoi": ("CONN", None), "după": ("CONN", None), "aceea": ("DEM", "that"), "asemenea": ("FILLER", None), "pentru": ("CONN", None),
    "deoarece": ("CONN", None), "dar": ("CONN", None), "însă": ("CONN", None), "dacă": ("CONN", None), "când": ("CONN", None),
    "înainte": ("CONN", None), "asta": ("DEM", "this"), "spune": ("CONN", None),
}
FILLERS = ["te", "rog", "vă", "poți", "puteți", "ai", "ați", "putea", "vreau", "as_vrea", "as_dori", "am", "nevoie", "hai", "acum", "deci",
           "bine", "doar", "repede", "mersi", "mulțumesc", "deja", "aici", "acolo", "dori", "vrea", "vrei", "vreți"]
INTRO = ["numit", "numită", "numiți", "numite", "denumit", "denumită", "denumite", "etichetat", "etichetată", "intitulat", "intitulată", "cu_numele"]

# single-word values: form -> English canonical token (kind = the English token's kind)
VALUES = {
    "stânga": "left", "dreapta": "right", "sus": "up", "jos": "down", "orizontal": "horizontally", "vertical": "vertically",
    "orizontală": "horizontally", "verticală": "vertically",
    "rând": "row", "coloană": "column", "grilă": "grid", "arbore": "tree", "centru": "center", "mijloc": "center", "centrul": "center",
    "deasupra": "above", "sub": "below", "dedesubtul": "below", "lângă": "next_to", "înăuntrul": "inside",
    "procente": "percent", "procent": "percent",
}

# ------------------------------------------------------------------ number words (to digits by the normalizer; 'unu' / 'una' never, as 'one')
NUMBER_WORDS = {"zero": 0, "unu": 1, "una": 1, "doi": 2, "două": 2, "trei": 3, "patru": 4, "cinci": 5, "șase": 6, "șapte": 7, "opt": 8,
                "nouă": 9, "zece": 10, "unsprezece": 11, "doisprezece": 12, "douăsprezece": 12, "treisprezece": 13, "paisprezece": 14,
                "cincisprezece": 15, "șaisprezece": 16, "șaptesprezece": 17, "optsprezece": 18, "nouăsprezece": 19, "douăzeci": 20,
                "treizeci": 30, "patruzeci": 40, "cincizeci": 50, "șaizeci": 60, "șaptezeci": 70, "optzeci": 80, "nouăzeci": 90,
                "sută": 100, "sute": 100}
NUMBER_EXCEPTIONS = ["unu", "una"]
NUM_SURFACE = {2: ("doi", "două"), 3: "trei", 4: "patru", 5: "cinci", 6: "șase", 10: "zece", 15: "cincisprezece", 20: "douăzeci",
               25: "douăzeci și cinci", 30: "treizeci", 35: "treizeci și cinci", 40: "patruzeci", 45: "patruzeci și cinci", 50: "cincizeci",
               60: "șaizeci", 75: "șaptezeci și cinci", 80: "optzeci", 90: "nouăzeci", 100: "o sută", 200: "două sute"}


def takes_de(n):
    """Romanian puts 'de' between a number and its noun from 20 on, when the last two digits are 00 or 20-99 (20 de pixeli, 105 pixeli)"""
    return n >= 20 and (n % 100 == 0 or n % 100 >= 20)


# ------------------------------------------------------------------ multi-word expressions of the normalizer (folded on both sides)
def _mw():
    m = []
    for corner, en in (("stânga sus", "top_left"), ("dreapta sus", "top_right"), ("stânga jos", "bottom_left"), ("dreapta jos", "bottom_right")):
        side, vert = corner.split()
        m += [(f"în colțul din {corner}", en), (f"colțul din {corner}", en), (f"în colțul {corner}", en), (f"colțul {corner}", en),
              (corner, en), (f"{vert} în {side}", en), (f"{vert} {side}", en)]
    m += [("partea de sus", "top"), ("partea de jos", "bottom"), ("partea stângă", "left_side"), ("partea dreaptă", "right_side"),
          ("partea din stânga", "left_side"), ("partea din dreapta", "right_side")]
    m += [("la stânga lui", "left_of"), ("în stânga lui", "left_of"), ("la dreapta lui", "right_of"), ("în dreapta lui", "right_of"),
          ("în interiorul", "inside"), ("alături de", "next_to")]
    for side, en in (("dreapta", "right_edge"), ("stânga", "left_edge")):
        m += [(f"la marginea din {side}", en), (f"marginea din {side}", en), (f"la marginea {side}", en), (f"marginea {side}", en)]
    for side, en in (("sus", "top_edge"), ("jos", "bottom_edge")):
        m += [(f"la marginea de {side}", en), (f"marginea de {side}", en)]
    m += [("la marginea superioară", "top_edge"), ("marginea superioară", "top_edge"), ("la marginea inferioară", "bottom_edge"), ("marginea inferioară", "bottom_edge")]
    m += [("la jumătatea drumului", "half"), ("la jumătatea distanței", "half"), ("jumătate din drum", "half"), ("o treime din drum", "third"),
          ("o treime din distanță", "third"), ("un sfert din drum", "quarter"), ("un sfert din distanță", "quarter")]
    for p in ("cu", "de", "la"):
        m += [(f"{p} următorul", "to_next"), (f"{p} următoarea", "to_next")]
    m += [("în lanț", "in_chain"), ("în șir", "in_chain"), ("unul după altul", "in_chain"), ("una după alta", "in_chain")]
    m += [("de la stânga la dreapta", "flow_lr"), ("de sus în jos", "flow_td"), ("de sus până jos", "flow_td")]
    m += [("mai mare", "bigger"), ("mai mari", "bigger"), ("mai mic", "smaller"), ("mai mică", "smaller"), ("mai mici", "smaller")]
    m += [("la sută", "percent"), ("o sută", "100"), ("aș vrea", "as_vrea"), ("aș dori", "as_dori"), ("cu numele", "cu_numele"),
          ("prim plan", "față"), ("prim-plan", "față"), ("fundal", "spate")]
    for forms in ZOOM_FORMS:
        for f in forms:
            m += [(f"{f} zoom in", "zoom zoom_in"), (f"{f} zoom out", "zoom zoom_out")]
    for en, (g, *forms) in NOUNS.items():
        for f in forms:
            if " " in f: m.append((f, tok(f)))
    return [(fold(a), fold(b)) for a, b in m]


MWE = _mw()
MWE_GENITIVE = [(fold(a), b) for a, b in (("la stânga", "left_of"), ("în stânga", "left_of"), ("la dreapta", "right_of"), ("în dreapta", "right_of"))]
GENITIVE_ENDINGS = ["ului", "ei", "ii", "lor"]
CONTRACTIONS = {"dintr-un": "din un", "dintr-o": "din o", "într-un": "în un", "într-o": "în o", "n-o": "nu -o", "s-o": "să -o"}
CLITICS = ["-le", "-l", "-o", "-i"]
SYNONYMS = {"pixeli": "px", "pixel": "px", "înăuntru": "înăuntrul", "ok": "okay"}
QUOTE_MARKS = {"„": "\"", "”": "\"", "“": "\"", "«": "\"", "»": "\""}

# ------------------------------------------------------------------ prefixes (ids as the English generator's PREFIXES)
# each: list of (text, mood, number) choices; mood imp | subj | subj1 (hai sa); number sg | pl
PREFIXES_RO = {
    "bare": [("", "imp", "sg"), ("", "imp", "sg"), ("", "imp", "pl")],
    "please": [("te rog", "imp", "sg"), ("vă rog", "imp", "pl"), ("te rog să", "subj", "sg"), ("vă rog să", "subj", "pl")],
    "could": [("ai putea să", "subj", "sg"), ("ați putea să", "subj", "pl")],
    "can": [("poți să", "subj", "sg"), ("puteți să", "subj", "pl")],
    "would": [("aș vrea să", "subj", "sg"), ("aș vrea să", "subj", "pl")],
    "want": [("vreau să", "subj", "sg"), ("vreau să", "subj", "pl")],
    "need": [("am nevoie să", "subj", "sg"), ("am nevoie să", "subj", "pl")],
    "lets": [("hai să", "subj1", "pl")],
    "now": [("acum", "imp", "sg"), ("acum", "imp", "pl")],
    "okay": [("deci", "imp", "sg"), ("ok deci", "imp", "sg"), ("deci", "imp", "pl")],
    "tail": [("te rog", "imp", "sg"), ("vă rog", "imp", "pl")],
}
