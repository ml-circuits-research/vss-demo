"""generate.py: the Romanian diagram world (variant A, diagram_ro) and the bilingual one (variant B, diagram_multi), Level 1, with the SAME
legend as the English diagram world (training/worlds/diagram/generate.py legend_dict, written byte-identically: same sha256), the same
events, roles, operators and values, and the same gold wires (wires_for of the English generator) with English values. Only the lexicon
(kinds.tsv, with the lemma column: reader.identity = "lemma") and the surface sentences differ.

How a Romanian command is made: the ENGLISH template of the same id draws the roles and fillers (so a template id means the same frame in
both languages, and held-out formulations correspond); the Romanian realiser of that template writes them with Romanian grammar: noun
gender and number, enclitic definite article, adjective agreement (o cutie roșie, un cerc roșu, cutiile roșii, cutiile care nu sunt
albastre), genitive after deasupra / în stânga / în interiorul and in culoarea cutiei, prepositions (sub, lângă, la stânga lui X),
pronoun clitics (mută-l, n-o muta, să le muți), imperative singular, polite plural, subjunctive after modal prefixes (poți să adaugi),
first person plural after 'hai să', negation 'nu' / 'niciodată să nu' with the English rule of which prefixes allow it. Then the Romanian
normalizer (normalize.py) gives the tokens, as the editor will.

--mix p: code-switching, each content slot (verb, noun, adjective, value word, placement phrase, label intro) is English with probability p
(adaugă un database roșu, pune o notiță yellow below cutia, connect cutia la server); English nouns take the Romanian article
(database-ul, database-urile, database-ului) or stay bare. English surface forms are lexicon entries without a lemma column.
--languages ro (default): the world diagram_ro. --languages ro,en,mix: the world diagram_multi (English sentences from the English
generator, Romanian and mixed ones; shares in LANG_SHARES).

Writes, besides the world folder: translate_en.json (variant C, the word-to-English dictionary built from the same lexicon), eval_parallel
(the same frames through the English templates and the Romanian ones, a mixed and a "Romglish" realisation, each with its gold circuit),
COVERAGE.md. Run: python3 generate.py --out ../../../tool/worlds/diagram_ro [--n 30000] [--n_eval 400] [--seed 0] [--mix 0]
                  python3 generate.py --languages ro,en,mix --out ../../../tool/worlds/diagram_multi"""
import argparse, collections, datetime, hashlib, importlib.util, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); EN_DIR = os.path.join(os.path.dirname(HERE), "diagram")
TOOL = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(HERE))), "tool")
sys.path.insert(0, TOOL); sys.path.insert(0, HERE)
import numpy as np
from sop import soplang, world as sopworld
from sop.legend import Legend, sha256_file
import lexicon_ro as L
import normalize_table


def _load(name, path):
    spec = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m


EN_NORM = _load("normalize_en", os.path.join(EN_DIR, "normalize.py"))
_saved = sys.modules.get("normalize"); sys.modules["normalize"] = EN_NORM             # the English generator imports `normalize` by name
G = _load("generate_en", os.path.join(EN_DIR, "generate.py"))
if _saved is None: sys.modules.pop("normalize", None)
else: sys.modules["normalize"] = _saved
RO_NORM = _load("normalize_ro", os.path.join(HERE, "normalize.py"))
normalize_ro, normalize_en = RO_NORM.normalize, EN_NORM.normalize

LANG_SHARES = {"en": 0.4, "ro": 0.4, "mix": 0.2}     # diagram_multi: shares of the training sentences (stated)
MIX_EVAL = 0.3                                        # the code-switching share of eval_mixed and of the mixed sentences of diagram_multi (stated)
PL2SG = {pl: sg for sg, pl in G.COMPONENTS.items()}


# ------------------------------------------------------------------ the lexicon (kinds.tsv), checked for conflicts
def build_lexicon():
    """token -> (kind, lemma or None): the English lexicon (every English surface form, no lemma) and the Romanian forms with their lemma"""
    lex = {w: (k, None) for w, k in G.KINDS.items()}
    conflicts = []
    def add(form, kind, lemma, src):
        t = L.tok(form); lemma = None if lemma == t else lemma
        if t in lex and lex[t] != (kind, lemma):
            old = lex[t]
            if not (old[0] == kind and (old[1] or t) == (lemma or t)): conflicts.append(f"{t}: {old} vs {(kind, lemma)} ({src})")
            return
        lex[t] = (kind, lemma)
    for en, (g, sg, sgd, pl, pld, gs, gp) in L.NOUNS.items():
        enpl = G.COMPONENTS.get(en)
        if en not in L.PL_ONLY_EN:
            for f in (sg, sgd, gs): add(f, G.KINDS[en], en, f"noun {en}")
        if en not in L.SG_ONLY_EN and enpl:
            for f in (pl, pld, gp): add(f, G.KINDS[enpl], enpl, f"noun {enpl}")
    for en in L.NOUNS:                              # English nouns with the Romanian enclitic article (code-switching)
        enpl = G.COMPONENTS.get(en)
        if en not in L.PL_ONLY_EN:
            for suf in ("-ul", "-ului"): add(en + suf, G.KINDS[en], en, "en noun + article")
        if en not in L.SG_ONLY_EN and enpl:
            for suf in ("-urile", "-urilor"): add(en + suf, G.KINDS[enpl], enpl, "en noun + article")
    for en, forms in L.ADJ.items():
        for f in forms: add(f, G.KINDS[en], en, f"adjective {en}")
    for v in L.VERBS:
        for f in v[1:]:
            if f: add(f, "VERB", v[0], f"verb {v[0]}")
    for f, (k, lem) in L.FUNCTION.items(): add(f, k, lem, "function word")
    for f in L.FILLERS: add(f, "FILLER", None, "filler")
    for f in L.INTRO: add(f, "INTRO", None, "intro")
    for f, en in L.VALUES.items(): add(f, G.KINDS[en], en, f"value {en}")
    if conflicts: raise SystemExit("lexicon conflicts (one token, two kinds or lemmas):\n  " + "\n  ".join(conflicts))
    return lex


# ------------------------------------------------------------------ the Romanian realiser
class Ro:
    """Romanian surface of an English template's roles. mix = probability that a content slot is English (code-switching)"""
    def __init__(self, rng, mix=0.0):
        self.r, self.mix, self.n_en = rng, mix, 0
    def pick(self, xs): return xs[int(self.r.integers(len(xs)))]
    def coin(self, p=0.5): return self.r.random() < p
    def en(self):
        if self.mix and self.r.random() < self.mix: self.n_en += 1; return True
        return False

    def num(self, n, gender="n"):
        if n in L.NUM_SURFACE and self.coin(0.4):
            s = L.NUM_SURFACE[n]
            return [s[0] if gender == "m" else s[1]] if isinstance(s, tuple) else s.split()
        return [str(n)]

    def amount(self, n, unit="px"):
        """N [de] pixeli | px"""
        w = self.num(n, "m") + (["de"] if L.takes_de(n) else [])
        return w + [self.pick(["pixeli", "pixeli", "px"])] if unit == "px" else w

    # ---- entities
    def entity(self, spec, case="nom"):
        """(words, info): case nom (subject / object), gen (deasupra cutiei, culoarea cutiei), acc (sub cutie, lângă cercul roșu)"""
        h = spec["head"]
        if h in ("it", "them"):
            g = self.pick(["m", "f"]); pl = h == "them"
            return [], {"gender": g, "plural": pl, "pron": h, "clitic": {("m", False): "l", ("f", False): "o", ("m", True): "i", ("f", True): "le"}[(g, pl)]}
        if h == "everything": return (["everything"] if self.en() else ["totul"]), {"gender": "n", "plural": False}
        if h not in G.COMPONENTS and h not in PL2SG:                         # a label
            return ((["lui", h] if case == "gen" else [h]), {"gender": "n", "plural": False})
        sg = PL2SG.get(h, h); plural = h != sg; det = spec.get("det")
        english = self.en()
        if english:
            g = "n"; X, Xs = sg, G.COMPONENTS.get(sg, sg)
            forms = {"sg": X, "sgd": self.pick([X + "-ul", X]), "pl": Xs, "pld": self.pick([X + "-urile", Xs]), "gs": X + "-ului", "gp": X + "-urilor"}
            if case == "gen" and self.coin(0.3): forms["gs"] = "lui " + X
        else:
            g, *fs = L.NOUNS[sg]; forms = dict(zip(("sg", "sgd", "pl", "pld", "gs", "gp"), fs))
        attr = spec.get("attr"); neg = spec.get("negattr")
        A = lambda a, gen=False: (a if self.en() else L.adj_form(a, g, plural, gen))
        W = []; post = []
        if case == "gen":
            assert det in (None, "the"), det
            W = [forms["gp" if plural else "gs"]]
        elif case == "acc" and det in (None, "the") and not attr and not neg:
            W = [forms["pl" if plural else "sg"]]
        elif det in ("a", "an"):
            W = [("o" if g == "f" else "un"), forms["sg"]]
        elif det == "the" or (det is None and not plural):
            W = [forms["pld" if plural else "sgd"]]
        elif det is None:
            W = [forms["pl"]]
        elif det == "all":
            W = [("toți" if g == "m" else "toate"), forms["pld"]]
        elif det in ("each", "every"):
            W = ["fiecare", forms["sg"]]
        elif det in ("this", "that", "these", "those"):
            pre = {("this", "m"): "acest", ("this", "f"): "această", ("that", "m"): "acel", ("that", "f"): "acea", ("these", "m"): "acești",
                   ("these", "f"): "aceste", ("those", "m"): "acei", ("those", "f"): "acele"}[(det, "f" if g == "f" or (g == "n" and plural) else "m")]
            pst = {("this", "m"): "acesta", ("this", "f"): "aceasta", ("that", "m"): "acela", ("that", "f"): "aceea", ("these", "m"): "aceștia",
                   ("these", "f"): "acestea"}.get((det, "f" if g == "f" or (g == "n" and plural) else "m"))
            if pst and not attr and not neg and self.coin(0.3): W = [forms["pld" if plural else "sgd"]]; post = [pst]
            else: W = [pre, forms["pl" if plural else "sg"]]
        else: raise ValueError(det)
        if attr: W.append(A(attr, case == "gen"))
        W += post
        if neg: W += ["care", "nu", ("sunt" if plural else self.pick(["este", "este", "e"])), A(neg)]
        return " ".join(W).split(), {"gender": g, "plural": plural}

    def landmark(self, spec, kind):
        """kind: gen | acc | en (after an English preposition: nominative)"""
        return self.entity(spec, {"gen": "gen", "acc": "acc", "en": "nom"}[kind])[0]

    def loc(self, roles):
        if "region" in roles:
            reg = roles["region"]
            if self.en():
                p = {"top": "în", "bottom": "în", "center": "în", "left_side": "pe", "right_side": "pe"}.get(reg, "în")
                return [p] + reg.replace("_side", " side").replace("_", " ").split()
            side = {"top_left": ("stânga", "sus"), "top_right": ("dreapta", "sus"), "bottom_left": ("stânga", "jos"), "bottom_right": ("dreapta", "jos")}
            if reg in side:
                s, v = side[reg]
                return self.pick([f"în colțul din {s} {v}", f"în {s} {v}", f"{v} în {s}", f"în colțul {s} {v}"]).split()
            return self.pick({"top": ["în partea de sus"], "bottom": ["în partea de jos"], "center": ["în centru", "în mijloc"],
                              "left_side": ["în partea stângă", "pe partea stângă", "în partea din stânga"],
                              "right_side": ["în partea dreaptă", "pe partea dreaptă", "în partea din dreapta"]}[reg]).split()
        rel, lm = roles["relation"], roles["landmark"]
        pre = (["la"] + self.amount(int(roles["amount"]))) if "amount" in roles else []
        is_label = lm["head"] not in G.COMPONENTS and lm["head"] not in PL2SG
        if self.en():
            return pre + {"left_of": ["left", "of"], "right_of": ["right", "of"], "above": ["above"], "below": [self.pick(["below", "under"])],
                          "next_to": ["next", "to"], "inside": ["inside"]}[rel] + self.landmark(lm, "en")
        if rel in ("left_of", "right_of"):
            side = "stânga" if rel == "left_of" else "dreapta"; p = self.pick(["la", "în"])
            return pre + ([p, side, "lui", lm["head"]] if is_label else [p, side] + self.landmark(lm, "gen"))
        if rel == "above": return pre + (["deasupra", "lui", lm["head"]] if is_label else ["deasupra"] + self.landmark(lm, "gen"))
        if rel == "below":
            if self.coin(0.75): return pre + ["sub"] + ([lm["head"]] if is_label else self.landmark(lm, "acc"))
            return pre + (["dedesubtul", "lui", lm["head"]] if is_label else ["dedesubtul"] + self.landmark(lm, "gen"))
        if rel == "next_to":
            p = self.pick([["lângă"], ["lângă"], ["alături", "de"]])
            return p + ([lm["head"]] if is_label else self.landmark(lm, "acc"))
        if rel == "inside":
            if is_label: return ["în", "interiorul", "lui", lm["head"]]
            return self.pick([["în", "interiorul"], ["înăuntrul"]]) + self.landmark(lm, "gen")
        raise ValueError(rel)

    def color_word(self, c, g="m", pl=False, agree=False):
        if self.en(): return c
        return L.adj_form(c, g, pl) if agree else L.ADJ[c][0]


def V(lemma, clitic=None, pron=None, suffix=()):
    return {"V": lemma, "clitic": clitic, "pron": pron, "suffix": list(suffix)}


# ------------------------------------------------------------------ the Romanian templates (ids as the English ones)
RO = {}
def R(tid):
    def deco(f): RO[tid] = f; return f
    return deco

def _obj(r, roles, key="object", case="nom"):
    w, info = r.entity(roles[key], case); return w, info

def _intro(r, g):
    if r.en(): return [r.pick(["called", "named"])]
    return r.pick([["numită"] if g == "f" else ["numit"], ["denumită"] if g == "f" else ["denumit"], ["etichetată"] if g == "f" else ["etichetat"], ["cu", "numele"]])

@R("c_obj")
def _(r, ro, lem, ew): w, i = _obj(r, ro); return [V(lem)] + w
@R("c_obj_loc")
def _(r, ro, lem, ew): w, i = _obj(r, ro); return [V(lem)] + w + r.loc(ro)
@R("c_loc_obj")
def _(r, ro, lem, ew): w, i = _obj(r, ro); return r.loc(ro) + [",", V(lem)] + w
@R("c_obj_called")
def _(r, ro, lem, ew): w, i = _obj(r, ro); return [V(lem)] + w + _intro(r, i["gender"]) + [ro["text"]]
@R("c_obj_called_loc")
def _(r, ro, lem, ew): w, i = _obj(r, ro); return [V(lem)] + w + _intro(r, i["gender"]) + [ro["text"]] + r.loc(ro)
@R("c_quantity")
def _(r, ro, lem, ew):
    w, i = _obj(r, ro); q = int(ro["quantity"]); return [V(lem)] + r.num(q, i["gender"]) + (["de"] if L.takes_de(q) else []) + w
@R("p_obj_loc")
def _(r, ro, lem, ew): w, i = _obj(r, ro); return [V(lem)] + w + r.loc(ro)

def _vobj(r, ro, lem, key="object"):
    """the verb with its object; a pronoun object becomes a clitic on the verb"""
    w, i = _obj(r, ro, key)
    return [V(lem, i.get("clitic"), i.get("pron"))] + w, i

@R("d_obj")
def _(r, ro, lem, ew): return _vobj(r, ro, lem)[0]
@R("d_all")
def _(r, ro, lem, ew): return _vobj(r, ro, lem)[0]
@R("m_loc")
def _(r, ro, lem, ew): return _vobj(r, ro, lem)[0] + r.loc(ro)

def _dir(r, d, align=False):
    if r.en(): return [d]
    if d in ("left", "right"):
        s = "stânga" if d == "left" else "dreapta"; return ["la", s] if align else r.pick([["la", s], ["spre", s]])
    s = "sus" if d == "up" else "jos"; return r.pick([["în", s], [s]])

@R("m_dir")
def _(r, ro, lem, ew):
    vw, i = _vobj(r, ro, lem)
    if "amount" in ro: return vw + (["cu"] if r.coin(0.3) else []) + r.amount(int(ro["amount"])) + _dir(r, ro["direction"])
    return vw + _dir(r, ro["direction"])

ANCHOR_RO = {"right_edge": ["marginea din dreapta", "marginea dreaptă"], "left_edge": ["marginea din stânga", "marginea stângă"],
             "top_edge": ["marginea de sus", "marginea superioară"], "bottom_edge": ["marginea de jos", "marginea inferioară"]}

def _anchor(r, a):
    if r.en(): return a.replace("_", " ").split()
    return r.pick(ANCHOR_RO[a]).split()

@R("m_fraction")
def _(r, ro, lem, ew):
    vw, i = _vobj(r, ro, lem); f = ro["fraction"]
    if r.en(): fw = {"half": ["halfway"], "third": "a third of the way".split(), "quarter": "a quarter of the way".split()}[f]
    else: fw = r.pick({"half": ["la jumătatea drumului", "jumătate din drum", "la jumătatea distanței"], "third": ["o treime din drum", "o treime din distanță"],
                       "quarter": ["un sfert din drum", "un sfert din distanță"]}[f]).split()
    return vw + fw + r.pick([["spre"], ["până", "la"]]) + _anchor(r, ro["anchor"])
@R("m_anchor")
def _(r, ro, lem, ew): vw, i = _vobj(r, ro, lem); return vw + r.pick([["la"], ["spre"]]) + _anchor(r, ro["anchor"])

@R("ch_color")
def _(r, ro, lem, ew):
    vw, i = _vobj(r, ro, lem); c = ro["color"]
    if lem == "make": return vw + [r.color_word(c, i["gender"], i["plural"], agree=True)]
    return vw + ["în", r.color_word(c)]
@R("ch_style")
def _(r, ro, lem, ew): vw, i = _vobj(r, ro, lem); return vw + [r.color_word(ro["style"], i["gender"], i["plural"], agree=True)]
@R("ch_set_color")
def _(r, ro, lem, ew):
    w, i = _obj(r, ro, case="gen"); c = ro["color"]
    return [V(lem), "culoarea"] + w + [("la" if lem == "set" else "în"), r.color_word(c)]

def _size(r, sz, g, pl):
    if r.en(): return [sz]
    if sz == "bigger": return ["mai", "mari" if pl else "mare"]
    if sz == "smaller": return ["mai", L.adj_form("small", g, pl)]
    return [L.adj_form(sz, g, pl)]

@R("ch_size")
def _(r, ro, lem, ew): vw, i = _vobj(r, ro, lem); return vw + _size(r, ro["size"], i["gender"], i["plural"])
@R("ch_percent")
def _(r, ro, lem, ew):
    vw, i = _vobj(r, ro, lem); n = int(ro["amount"]); k = r.r.random()
    if k < 0.4: pw = r.num(n) + ["la", "sută"]
    elif k < 0.7: pw = [f"{n}%"]
    else: pw = r.num(n) + (["de"] if L.takes_de(n) else []) + ["procente"]
    return vw + ["cu"] + pw + _size(r, ro["size"], i["gender"], i["plural"])
@R("r_size")
def _(r, ro, lem, ew):
    w, i = _obj(r, ro); return [V(lem)] + w + ["la", r.pick(["dimensiunea", "mărimea"]), (ro["size"] if r.en() else L.adj_form(ro["size"], "f", False))]
@R("r_verb")
def _(r, ro, lem, ew): return _vobj(r, ro, lem)[0]

PAIR_PREP = {"connect": ["la", "cu"], "link": ["de", "cu"], "join": ["cu"], "attach": ["la", "de"]}

@R("k_pair")
def _(r, ro, lem, ew):
    a, _ = _obj(r, ro, "source"); b, _ = _obj(r, ro, "target"); return [V(lem)] + a + [r.pick(PAIR_PREP.get(lem, ["la"]))] + b
@R("k_pair_with")
def _(r, ro, lem, ew):
    a, _ = _obj(r, ro, "source"); b, _ = _obj(r, ro, "target"); e, _ = _obj(r, ro, "edge")
    return [V(lem)] + a + [r.pick(PAIR_PREP.get(lem, ["la"]))] + b + ["cu"] + e
@R("k_draw_arrow")
def _(r, ro, lem, ew):
    a, _ = _obj(r, ro, "source"); b, _ = _obj(r, ro, "target"); e, _ = _obj(r, ro, "edge"); return [V(lem)] + a + ["și"] + b + ["cu"] + e
@R("k_pairing")
def _(r, ro, lem, ew):
    w, i = _obj(r, ro, "source"); p = ro["pairing"]
    if r.en(): pw = {"to_next": ["to", "the", "next"], "in_chain": ["in", "a", "chain"]}[p]
    elif p == "to_next": pw = [r.pick(["cu", "cu", "la"]), "următoarea" if i["gender"] == "f" else "următorul"]
    else: pw = r.pick([["în", "lanț"], ["în", "șir"], ["unul", "după", "altul"] if i["gender"] == "m" else ["una", "după", "alta"]])
    return [V(lem)] + w + pw

@R("n_call")
def _(r, ro, lem, ew): return _vobj(r, ro, lem)[0] + [ro["text"]]
@R("n_rename_to")
def _(r, ro, lem, ew): w, i = _obj(r, ro); return [V(lem)] + w + ["în", ro["text"]]
@R("cp_obj")
def _(r, ro, lem, ew): return _vobj(r, ro, lem)[0]
@R("cp_loc")
def _(r, ro, lem, ew): return _vobj(r, ro, lem)[0] + r.loc(ro)

@R("g_called")
def _(r, ro, lem, ew):
    w, i = _obj(r, ro)
    if "as" in ew: return [V(lem)] + w + ["ca", ro["text"]]
    return [V(lem)] + w + ["într-un", "container"] + _intro(r, "n") + [ro["text"]]
@R("g_plain")
def _(r, ro, lem, ew): w, i = _obj(r, ro); return [V(lem)] + w
@R("ug")
def _(r, ro, lem, ew): w, i = _obj(r, ro); return [V(lem)] + w

LAYOUT_RO = {"row": ["într-un rând", "pe un rând"], "column": ["într-o coloană", "pe o coloană"], "grid": ["într-o grilă"], "tree": ["ca un arbore"],
             "circle": ["în cerc", "într-un cerc"], "flow_lr": ["ca un flux de la stânga la dreapta", "de la stânga la dreapta"],
             "flow_td": ["ca un flux de sus în jos", "de sus în jos"]}
LAYOUT_EN = {"row": "într-un row", "column": "într-o column", "grid": "într-un grid", "tree": "ca un tree", "circle": "în circle",
             "flow_lr": "ca un flow from left to right", "flow_td": "ca un flow from top to bottom"}

@R("a_layout")
def _(r, ro, lem, ew):
    w, i = _obj(r, ro); lay = ro["layout"]
    return [V(lem)] + w + (LAYOUT_EN[lay] if r.en() else r.pick(LAYOUT_RO[lay])).split()
@R("al")
def _(r, ro, lem, ew):
    w, i = _obj(r, ro)
    if "axis" in ro:
        hz = ro["axis"] == "horizontally"
        return [V(lem)] + w + ([ro["axis"]] if r.en() else r.pick([["orizontal" if hz else "vertical"], ["pe", "orizontală" if hz else "verticală"]]))
    return [V(lem)] + w + _dir(r, ro["direction"], align=True)
@R("ds")
def _(r, ro, lem, ew):
    w, i = _obj(r, ro)
    if "amount" in ro: return [V(lem)] + w + ["la"] + r.amount(int(ro["amount"])) + ["distanță"]
    ax = ro["axis"]; return [V(lem)] + w + ["uniform", ax if r.en() else ("orizontal" if ax == "horizontally" else "vertical")]
@R("fr")
def _(r, ro, lem, ew): w, i = _obj(r, ro); return [V(lem)] + w + r.pick([["în", "față"], ["în", "prim-plan"]])
@R("bk")
def _(r, ro, lem, ew): w, i = _obj(r, ro); return [V(lem)] + w + r.pick([["în", "spate"], ["în", "fundal"]])
@R("zm")
def _(r, ro, lem, ew): return [V("zoom", suffix=["zoom", ro["direction"].split("_")[1]])]
@R("ud")
def _(r, ro, lem, ew): return [V(lem)]
@R("rd")
def _(r, ro, lem, ew): return [V(lem)]
@R("cl")
def _(r, ro, lem, ew): return [V(lem)] + (["canvas-ul"] if r.en() else ["planșa"])


# ------------------------------------------------------------------ verb, mood, negation, prefix
def render(r, items, mood, number, neg):
    """items with one V slot -> words. mood imp | subj | subj1; neg None | 'nu' | 'never'"""
    out = []
    for it in items:
        if not isinstance(it, dict): out.append(it); continue
        lem, cl, pron = it["V"], it["clitic"], it["pron"]
        if it["suffix"]:                                                   # zoom: a form of 'face' / 'da' + zoom in / out
            zf = r.pick(L.ZOOM_FORMS); f = {"imp": zf[0] if number == "sg" else zf[3], "subj": zf[2] if number == "sg" else zf[3], "subj1": zf[4]}[mood]
            out += (["să"] if mood != "imp" else []) + ([] if it.get("english") else [f]) + it["suffix"]; continue
        if it.get("english"):                                              # an English verb: base form, an English object pronoun
            if neg == "never": pre = ["niciodată", "să", "nu"]
            elif neg: pre = ["să", "nu"] if mood != "imp" else ["nu"]
            else: pre = ["să"] if mood != "imp" else []
            out += pre + [lem] + ([pron] if pron else []); continue
        v = it["ro"]; _, imp, inf, subj, p2, s1 = v
        sform = s1 if mood == "subj1" else (subj if number == "sg" else p2)
        def cls(prefix_word):       # clitic attached after 'să' / 'nu' (proclitic) as Romanian writes it
            if cl is None: return [prefix_word]
            if cl == "o": return [{"să": "s-o", "nu": "n-o"}[prefix_word]]
            if cl == "le": return [prefix_word, "le"]
            return [f"{prefix_word}-{cl}"]
        if neg == "never" or (neg and mood != "imp"):
            lead = ["niciodată"] if neg == "never" else []
            out += lead + ["să"] + cls("nu") + [sform]; continue
        if neg:
            out += cls("nu") + [inf if number == "sg" else p2]; continue
        if mood == "imp":
            f = imp if number == "sg" else p2
            out.append(f + ("-" + cl if cl else "")); continue
        out += cls("să") + [sform]
    return out


def realise_ro(r, ev, tid, f, prefix, g, mix=0.0, neg_force=None, en_words=None, end=None):
    """one Romanian (or mixed) command of the English template (ev, tid, f) with the English prefix id. Returns (surface, roles, negated,
    template, english words). When en_words / neg_force are given (eval_parallel), the English template's draw is reused."""
    if en_words is None: words, roles = f(g)
    else: words, roles = en_words
    pid = prefix[0]
    lem = next((w for w in words if w in G.EVENTS[ev]), G.EVENTS[ev][0])
    r.mix = mix; r.n_en = 0
    items = RO[tid](r, roles, lem, words)
    # the verb: English (code-switching) or a Romanian verb of the same lemma
    for it in items:
        if isinstance(it, dict):
            if it["suffix"]: it["english"] = r.en()
            elif r.en(): it["english"] = True
            else: it["ro"] = r.pick(L.VERB_BY_LEMMA[it["V"]])
    if neg_force is None:
        negated = ev in G.PROHIBITABLE and pid in ("bare", "please", "now", "okay", "tail") and g.coin(0.12)
        negw = (r.pick(["nu", "nu", "nu", "never"]) if negated else None)
    else: negated, negw = neg_force
    choices = L.PREFIXES_RO[pid]
    vslot = next(it for it in items if isinstance(it, dict))
    if vslot.get("ro") and vslot["ro"][4] is None: choices = [c for c in choices if c[2] == "sg" or c[1] == "subj1"] or choices
    ptxt, mood, number = choices[int(r.r.integers(len(choices)))]
    pw = ptxt.split()
    if pw and pw[-1] == "să": pw = pw[:-1]                                # the verb chunk writes 'să' (with its clitic)
    body = render(r, items, mood, number, negw)
    if pid == "tail": words_ro = body + pw
    else: words_ro = pw + body
    surface = " ".join(words_ro) + ((" ." if r.coin(0.5) else "") if end is None else end)
    rroles = romanian_roles(roles)
    return surface, rroles, negated, f"{ev}.{tid}.{pid}", r.n_en


def romanian_roles(roles):
    """the gold of a Romanian sentence: the English roles with the determiner as the Romanian lexicon reads it (fiecare -> each; un / o -> a)"""
    def fix(v):
        if not isinstance(v, dict): return v
        v = dict(v)
        if v.get("det") == "every": v["det"] = "each"
        if v.get("det") == "an": v["det"] = "a"
        return v
    return {k: fix(v) for k, v in roles.items()}


# ------------------------------------------------------------------ Romglish: English template, Romanian content words
def romglish(words, roles, ev):
    """English grammar with Romanian content words (base forms: imperative singular, indefinite noun, masculine singular adjective)"""
    out = []; verb_done = False
    for w in words:
        if not verb_done and w in G.EVENTS[ev] and ev != "zoom":
            out.append(L.VERB_BY_LEMMA[w][0][1]); verb_done = True; continue
        sg = PL2SG.get(w, w)
        if sg in L.NOUNS and (w in G.COMPONENTS or w in PL2SG) and not (sg in L.PL_ONLY_EN and w == sg) and not (sg in L.SG_ONLY_EN and w != sg):
            n = L.NOUNS[sg]; out.append(n[3] if w != sg else n[1]); continue
        if w in L.ADJ: out.append(L.ADJ[w][0]); continue
        if w == roles.get("direction"): out.append({"left": "stânga", "right": "dreapta", "up": "sus", "down": "jos"}[w]); continue
        if w == roles.get("axis"): out.append({"horizontally": "orizontal", "vertically": "vertical"}[w]); continue
        if w == roles.get("layout") and w in ("row", "column", "grid", "tree"): out.append({"row": "rând", "column": "coloană", "grid": "grilă", "tree": "arbore"}[w]); continue
        if w == "everything": out.append("totul"); continue
        if w == "canvas": out.append("planșă"); continue
        out.append(w)
    return out


# ------------------------------------------------------------------ the dictionary of variant C
def build_dictionary(lex):
    E = collections.OrderedDict()
    def add(key, *vals):
        k = " ".join(L.fold(key).split())
        for v in vals:
            v = " ".join(v.split())
            E.setdefault(k, [])
            if v not in E[k]: E[k].append(v)
    for en, (g, sg, sgd, pl, pld, gs, gp) in L.NOUNS.items():
        enpl = G.COMPONENTS.get(en)
        has_sg, has_pl = en not in L.PL_ONLY_EN, en not in L.SG_ONLY_EN and enpl
        f_or_n_pl = "f" if g in ("f", "n") else "m"
        if has_sg:
            add(sgd, f"the {en}"); add(gs, f"the {en}"); add(sg, en)
            for a, ad in L.ADJ.items():
                add(f"{sgd} {L.adj_form(a, g, False)}", f"the {a} {en}"); add(f"{gs} {L.adj_form(a, g, False, True)}", f"the {a} {en}")
                add(f"{sg} {L.adj_form(a, g, False)}", f"{a} {en}")
            for pd, ped in (("acesta" if g != "f" else "aceasta", "this"), ("acela" if g != "f" else "aceea", "that")): add(f"{sgd} {pd}", f"{ped} {en}")
            if L.fold(sg) == L.fold(sgd):    # feminine in -a: indefinite = definite once folded; the determiner decides
                dets = {"o": "a", "fiecare": "each", "orice": "any", "aceasta": "this", "acea": "that"}
                for d, ed in dets.items():
                    add(f"{d} {sg}", f"{ed} {en}")
                    for a in L.ADJ: add(f"{d} {sg} {L.adj_form(a, g, False)}", f"{ed} {a} {en}")
        if has_pl:
            add(pld, f"the {enpl}"); add(gp, f"the {enpl}"); add(pl, enpl)
            for a in L.ADJ:
                add(f"{pld} {L.adj_form(a, g, True)}", f"the {a} {enpl}"); add(f"{gp} {L.adj_form(a, g, True)}", f"the {a} {enpl}")
                add(f"{pl} {L.adj_form(a, g, True)}", f"{a} {enpl}")
            add(f"{pld} {'acestea' if f_or_n_pl == 'f' else 'acestia'}", f"these {enpl}")
    for en in L.NOUNS:
        enpl = G.COMPONENTS.get(en)
        if en not in L.PL_ONLY_EN: add(en + "-ul", f"the {en}"); add(en + "-ului", f"the {en}")
        if en not in L.SG_ONLY_EN and enpl: add(en + "-urile", f"the {enpl}"); add(en + "-urilor", f"the {enpl}")
    for en, forms in L.ADJ.items():
        for f in forms: add(f, en)
    pr = {"l": "it", "o": "it", "i": "them", "le": "them"}
    for v in L.VERBS:
        en, imp, inf, subj, p2, s1 = v
        for f in (imp, inf, subj, p2, s1):
            if f: add(f, en)
        for c, p in pr.items():
            for f in (imp, p2):
                if f: add(f"{f}-{c}", f"{en} {p}")
            neg = {"l": "nu-l", "o": "n-o", "i": "nu-i", "le": "nu le"}[c]; sub = {"l": "să-l", "o": "s-o", "i": "să-i", "le": "să le"}[c]
            for f in (inf, p2):
                if f: add(f"{neg} {f}", f"do not {en} {p}")
            for f in (subj, p2, s1):
                if f: add(f"{sub} {f}", f"{en} {p}"); add(f"să {neg} {f}", f"do not {en} {p}")
        for f in (subj, p2, s1):
            if f: add(f"să nu {f}", f"do not {en}")
    for zf in L.ZOOM_FORMS:
        for f in zf:
            for d in ("in", "out"): add(f"{f} zoom {d}", f"zoom zoom_{d}")
    for a, b in L.MWE:
        if b in G.KINDS or b.isdigit():
            if a.startswith("in coltul"): add(a, f"in the {b}")
            elif a.startswith("la marginea"): add(a, f"to the {b}")
            elif a.split()[0] in ("coltul", "partea", "marginea"): add(a, f"the {b}")
            else: add(a, b)
    # regions with a preposition before them ("în stânga sus"): longest match first must not stop at "în stânga" (left_of)
    for corner, en in (("stânga sus", "top_left"), ("dreapta sus", "top_right"), ("stânga jos", "bottom_left"), ("dreapta jos", "bottom_right")):
        side, vert = corner.split()
        for pre in ("în", "la", "pe"):
            add(f"{pre} {corner}", f"in the {en}"); add(f"{pre} {vert} în {side}", f"in the {en}"); add(f"{pre} {vert} {side}", f"in the {en}")
    # "notă" is a common word for a note even though the lexicon uses "notiță" (to keep "note" English): the dictionary accepts both
    for k, v in {"notă": ["note", "the note"], "nota": ["the note", "note"], "notele": ["the notes"], "o notă": ["a note"]}.items(): add(k, *v)
    for a, b in L.MWE_GENITIVE:
        if a.startswith("la"): add(a, "to the " + ("left" if "stanga" in a else "right"), b)
        else: add(a, b)
    for k, v in {"aș vrea": "would you", "aș vrea să": "would you", "aș dori să": "would you", "cu numele": "called", "prim plan": "front",
                 "prim-plan": "front", "fundal": "back", "te rog": "please", "vă rog": "please", "te rog să": "please", "vă rog să": "please",
                 "ai putea": "could you", "ai putea să": "could you", "ați putea": "could you", "ați putea să": "could you", "poți": "can you",
                 "poți să": "can you", "puteți": "can you", "puteți să": "can you", "vreau": "i want you to", "vreau să": "i want you to",
                 "am nevoie": "i need you to", "am nevoie să": "i need you to", "hai": "lets", "hai să": "lets", "acum": "now",
                 "ok deci": "okay so", "bine": "okay", "în sus": "up", "în jos": "down", "spre stânga": "to the left", "spre dreapta": "to the right", "doar": "just", "să": "", "niciodată să nu": "never", "niciodată": "never", "nu": "do not",
                 "care nu este": "that is not", "care nu e": "that is not", "care nu sunt": "that are not", "nu este": "is not", "nu sunt": "are not",
                 "o": "a", "un": "a", "toate": "all", "toți": "all", "fiecare": "each", "orice": "any", "ambele": "both",
                 "acest": "this", "această": "this", "acesta": "this", "acel": "that", "acea": "that", "acela": "that", "aceea": "that",
                 "aceste": "these", "acești": "these", "acestea": "these", "aceștia": "these", "acele": "those", "acei": "those",
                 "-l": "it", "-o": "it", "-i": "them", "-le": "them", "le": "them", "totul": "everything", "și": "and", "ca": "as", "care": "that",
                 "este": "is", "e": "is", "sunt": "are", "spre": "to", "până la": "to", "către": "to", "lui": "", "dimensiunea": "", "mărimea": "",
                 "culoarea": "the color of", "uniform": "evenly", "distanță": "apart", "față": "front", "spate": "back", "flux": "flow",
                 "împreună": "together", "pixeli": "px", "pixel": "px", "de pixeli": "px", "de px": "px", "procente": "percent", "procent": "percent",
                 "de procente": "percent", "centru": "the center", "mijloc": "the center", "centrul": "the center"}.items():
        add(k, v)
    for k, vs in {"la": ["to", "at"], "de": ["to", "of", "from", "by"], "cu": ["with", "by", "to"], "în": ["in", "into", "to"], "pe": ["on", "in"],
                  "din": ["from", "of"], "sus": ["up", "top"], "jos": ["down", "bottom"], "într-un": ["in a", "into a"], "într-o": ["in a", "into a"],
                  "dintr-un": ["from a"], "dintr-o": ["from a"], "deci": ["okay so", "so"]}.items():
        add(k, *vs)
    for f, en in L.VALUES.items():
        if f not in ("centru", "mijloc", "centrul", "procente", "procent"): add(f, en)
    for w in L.INTRO: add(w.replace("_", " "), "called")
    for w, n in L.NUMBER_WORDS.items():
        if w not in L.NUMBER_EXCEPTIONS and w not in ("sută", "sute"): add(w, str(n))
    tens = {w: n for w, n in L.NUMBER_WORDS.items() if 20 <= n <= 90}; units = {w: n for w, n in L.NUMBER_WORDS.items() if 1 <= n <= 9 and w not in L.NUMBER_EXCEPTIONS}
    for tw, tn in tens.items():
        for uw, un in units.items(): add(f"{tw} și {uw}", str(tn + un))
    for uw, un in units.items():
        if un >= 2: add(f"{uw} sute", str(un * 100))
    add("o sută", "100")
    return E


def check_dictionary(E):
    pats = [__import__("re").compile("^(?:" + v["pattern"] + ")$") for v in G.legend_dict()["values"]]
    bad = sorted({t for vs in E.values() for v in vs for t in v.split() if t not in G.KINDS and not any(p.match(t) for p in pats)})
    return bad


# ------------------------------------------------------------------ the world folder
def build(out, n, n_eval, seed, languages, mix):
    if open(os.path.join(HERE, "normalize.json"), encoding="utf-8").read() != normalize_table.text():
        raise SystemExit("normalize.json differs from normalize_table.py's build: run python3 normalize_table.py")
    multi = languages != ["ro"]
    wname = "diagram_multi" if multi else "diagram_ro"
    lex = build_lexicon()
    rng = np.random.default_rng(seed)
    combos = [(ev, tid, f, p) for ev, ts in G.TEMPLATES.items() for tid, f in ts for p in G.PREFIXES]
    missing = [tid for ev, ts in G.TEMPLATES.items() for tid, f in ts if tid not in RO]
    if missing: raise SystemExit(f"English templates without a Romanian realiser: {missing}")
    h = lambda s: int(hashlib.sha256(f"{seed}:{s}".encode()).hexdigest()[:8], 16) / 2 ** 32       # the English generator's held-out rule
    held = {f"{ev}.{tid}.{p[0]}" for ev, tid, f, p in combos if p[0] not in ("bare",) and h(f"{ev}.{tid}.{p[0]}") < 0.12}
    train_combos = [c for c in combos if f"{c[0]}.{c[1]}.{c[3][0]}" not in held]
    held_combos = [c for c in combos if f"{c[0]}.{c[1]}.{c[3][0]}" in held]
    w_ev = {"create": 6, "connect": 4, "move": 4, "change": 3, "delete": 2, "name": 2, "place": 2, "resize": 2, "group": 1.5, "arrange": 1.5,
            "align": 1, "distribute": 1, "copy": 1, "ungroup": .5, "front": .5, "back": .5, "zoom": .4, "undo": .3, "redo": .2, "clear": .2}

    def draw(cs, k, labels, nums, rs, lang="ro", p_mix=0.0, need_en=False):
        g = G.Gen(rs, labels, nums); r = Ro(rs); ws = np.array([w_ev[c[0]] / len(G.TEMPLATES[c[0]]) for c in cs]); ws /= ws.sum(); rows = []
        tries = 0
        while len(rows) < k and tries < 20 * k + 100:
            tries += 1
            ev, tid, f, p = cs[int(rs.choice(len(cs), p=ws))]
            if lang == "en":
                text, roles, negated, template = G.realise(g, ev, tid, f, p); rows.append((ev, text, roles, negated, template, "en")); continue
            surface, roles, negated, template, n_en = realise_ro(r, ev, tid, f, p, g, mix=p_mix)
            if need_en and n_en == 0: continue
            toks, info = normalize_ro(surface); rows.append((ev, " ".join(toks), roles, negated, template, lang))
        return rows

    if multi:
        k_en, k_mix = int(round(n * LANG_SHARES["en"])), int(round(n * LANG_SHARES["mix"])); k_ro = n - k_en - k_mix
        rs = np.random.default_rng(200 + seed)
        train = draw(train_combos, k_ro, G.LABELS_TRAIN, G.NUMS_TRAIN, rs, "ro", mix) + draw(train_combos, k_en, G.LABELS_TRAIN, G.NUMS_TRAIN, rs, "en") \
            + draw(train_combos, k_mix, G.LABELS_TRAIN, G.NUMS_TRAIN, rs, "mix", MIX_EVAL, need_en=True)
        order = np.random.default_rng(300 + seed).permutation(len(train)); train = [train[i] for i in order]
    else:
        train = draw(train_combos, n, G.LABELS_TRAIN, G.NUMS_TRAIN, np.random.default_rng(200 + seed), "ro", mix)
    def new_ids(rows): return [r for r in rows if any(x in G.LABELS_NEW or x in map(str, G.NUMS_NEW) for x in r[1].split())][:n_eval]
    ev_new = new_ids(draw(train_combos, 6 * n_eval, G.LABELS_NEW, G.NUMS_NEW, np.random.default_rng(900 + seed)))
    ev_form = draw(held_combos, n_eval, G.LABELS_TRAIN, G.NUMS_TRAIN, np.random.default_rng(901 + seed))
    ev_mixed = draw(train_combos, n_eval, G.LABELS_TRAIN, G.NUMS_TRAIN, np.random.default_rng(902 + seed), "mix", MIX_EVAL, need_en=True)
    extra = {}
    if multi:
        extra["eval_new_identities_en.sop"] = new_ids(draw(train_combos, 6 * n_eval, G.LABELS_NEW, G.NUMS_NEW, np.random.default_rng(900 + seed), "en"))
        extra["eval_heldout_formulations_en.sop"] = draw(held_combos, n_eval, G.LABELS_TRAIN, G.NUMS_TRAIN, np.random.default_rng(901 + seed), "en")

    # every token has a kind (lexicon or value pattern): the lexicon is GIVEN complete for the generated sentences
    pats = [__import__("re").compile("^(?:" + v["pattern"] + ")$") for v in G.legend_dict()["values"]]
    allrows = train + ev_new + ev_form + ev_mixed + [r for rs_ in extra.values() for r in rs_]
    unk = collections.Counter(t for r in allrows for t in r[1].split() if t not in lex and not any(p.match(t) for p in pats))
    if unk: raise SystemExit(f"tokens without a kind: {unk.most_common(20)}")

    wd = out; [os.makedirs(os.path.join(wd, d), exist_ok=True) for d in ("examples", "raw", "audit", "model", "runs", "versions", "requests")]
    legend = G.legend_dict(); lp = os.path.join(wd, "legend.json"); json.dump(legend, open(lp, "w"), indent=1)
    sha = sha256_file(lp)
    en_sha = "sha256:" + hashlib.sha256(json.dumps(G.legend_dict(), indent=1).encode()).hexdigest()
    assert sha == en_sha, (sha, en_sha)
    with open(os.path.join(wd, "kinds.tsv"), "w", encoding="utf-8") as f:
        f.write("# word\tkind\tlemma: the diagram world's categories for Romanian, English and mixed sentences (GIVEN, rule 20; training/worlds/diagram_ro/lexicon_ro.py); "
                "the lemma is the canonical English token a Romanian form stands for (legend reader.identity = lemma); English words have no lemma\n")
        for w in sorted(lex):
            k, lem = lex[w]; f.write(f"{w}\t{k}\t{lem}\n" if lem else f"{w}\t{k}\n")
    json.dump({"name": wname, "language": "en+ro" if multi else "ro",
               "description": ("VSS Diagram Editor, Level 1, " + ("English, Romanian and mixed commands" if multi else "Romanian commands") +
                               "; the English diagram legend (training/worlds/diagram_ro/README.md)"),
               "created": datetime.date.today().isoformat(), "version": 1, "min_examples": 500, "max_versions_per_run": 3,
               "models": {"pipeline": "claude-haiku-5-5", "annotate": "claude-haiku-5-5", "second_look": "claude-haiku-5-5", "evolve": "claude-opus-5-5"},
               "second_look_escalate": 0.05, "second_look_retrain": 0.05}, open(os.path.join(wd, "world.json"), "w"), indent=1)
    def write(fname, rows):
        doc = soplang.Doc(directives=[("world", wname, None), ("legend", sha, None),
                                      ("generated", f"training/worlds/diagram_ro/generate.py --languages {','.join(languages)} --mix {mix} seed {seed} ({datetime.date.today()})", None)])
        k = 0
        for ev, text, roles, negated, template, lang in rows:
            ids = iter(f"w{k + i}" for i in range(1, 200)); ws = G.wires_for(ev, roles, negated, text, template, ids); k += len(ws)
            ws[0].lines.insert(1, soplang.Line("_world", wname)); doc.wires += ws
        open(os.path.join(wd, "examples", fname), "w", encoding="utf-8").write(soplang.write(doc))
    write("train.sop", train); write("eval_new_identities.sop", ev_new); write("eval_heldout_formulations.sop", ev_form); write("eval_mixed.sop", ev_mixed)
    for fn, rows in extra.items(): write(fn, rows)
    fsplits = {"examples/eval_new_identities.sop": "new_identities", "examples/eval_heldout_formulations.sop": "heldout_formulations", "examples/eval_mixed.sop": "mixed"}
    if multi: fsplits.update({"examples/eval_new_identities_en.sop": "new_identities_en", "examples/eval_heldout_formulations_en.sop": "heldout_formulations_en"})
    hints = {"heldout_sentence_share": 0.1, "new_identities": G.LABELS_NEW + [str(x) for x in G.NUMS_NEW], "file_splits": fsplits,
             "template_splits": {"heldout_formulations": sorted(held)},
             "protocol": f"diagram world Level 1 in {'English, Romanian and mixed' if multi else 'Romanian'} (the English templates' ids): one command per sentence, no nesting; "
                         "held-out formulations = (template, prefix) combinations whose template and prefix both occur in training (the English world's set); "
                         "new identities = labels and numbers never in training; mixed = code-switched sentences of training formulations (share 0.3 of content slots English)"}
    json.dump(hints, open(os.path.join(wd, "split_hints.json"), "w"), indent=1)
    open(os.path.join(wd, "raw", "sentences.txt"), "w", encoding="utf-8").write("\n".join(r[1] for r in train[:2000]) + "\n")
    if not os.path.exists(os.path.join(wd, "status.json")): json.dump({"label": None, "note": "never trained"}, open(os.path.join(wd, "status.json"), "w"))

    # the dictionary (variant C), from the same lexicon
    E = build_dictionary(lex); bad = check_dictionary(E)
    if bad: raise SystemExit(f"dictionary values without a kind in the English world's kinds.tsv: {bad}")
    dic = {"about": "Variant C of the languages design (vision/ADDENDUM_languages_2026-10-25.md; format in training/worlds/DICTIONARIES.md): a GIVEN "
                    "Romanian-to-English dictionary applied word by word (longest key first) before the English diagram reader, no training. Built by "
                    "training/worlds/diagram_ro/generate.py from lexicon_ro.py, the lexicon of the trained Romanian world, so the two never drift apart. "
                    "Keys: folded (lower case, no diacritics), words separated by spaces; values: token sequences of the English world, before its "
                    "normalizer (top_left, left_of are its canonical tokens); several values = alternatives the reader decides; an empty value drops the "
                    "word. Every value token has a kind in the English world's kinds.tsv (checked when written).",
           "language": "ro", "target_world": "diagram", "entries": dict(E)}
    json.dump(dic, open(os.path.join(HERE, "translate_en.json"), "w", encoding="utf-8"), indent=0, ensure_ascii=False)

    # eval_parallel: the same frames, English and Romanian templates, mixed and Romglish realisations
    par = parallel(train_combos, n_eval, seed, sha, wname)
    with open(os.path.join(wd, "examples", "eval_parallel.jsonl"), "w", encoding="utf-8") as f:
        for row in par: f.write(json.dumps(row, ensure_ascii=False) + "\n")

    # coverage (as the English world's)
    cov = collections.Counter(); ev_count = collections.Counter(); langs = collections.Counter()
    for ev, text, roles, negated, template, lang in train:
        ev_count[ev] += 1; langs[lang] += 1
        for r_ in roles: cov[(ev, r_)] += 1
        if negated: cov[(ev, "PROHIBITION")] += 1
    cols = [r_ for r_, _ in G.ROLES] + ["PROHIBITION"]
    same = sum(row["gold_frames_identical"] for row in par)
    lines = [f"# Coverage of the {wname} world, Level 1 (generate.py --languages {','.join(languages)} --mix {mix} seed {seed}, {n} training sentences)", "",
             f"Legend {sha} (the English diagram world's, byte-identical). Templates {sum(len(v) for v in G.TEMPLATES.values())} (every English template "
             f"has a Romanian realiser), prefixes {len(G.PREFIXES)}, combinations {len(combos)}, held out {len(held)}. Lexicon {len(lex)} entries "
             f"({sum(1 for v in lex.values() if v[1])} with a lemma). Dictionary translate_en.json {len(E)} keys "
             f"({sum(1 for v in E.values() if len(v) > 1)} with alternatives).", "",
             "Training sentences by language: " + ", ".join(f"{k} {v}" for k, v in sorted(langs.items())) + ".", "",
             "Sentences per event and role (training file):", "", "| event | n | " + " | ".join(cols) + " |", "|---|---|" + "---|" * len(cols)]
    for ev in G.EVENTS: lines.append(f"| {ev} | {ev_count[ev]} | " + " | ".join(str(cov[(ev, r_)]) if cov[(ev, r_)] else "" for r_ in cols) + " |")
    lines += ["", f"Evaluation files: eval_new_identities.sop {len(ev_new)}; eval_heldout_formulations.sop {len(ev_form)}; eval_mixed.sop {len(ev_mixed)}"
              + "".join(f"; {fn} {len(rs_)}" for fn, rs_ in extra.items()) + f"; eval_parallel.jsonl {len(par)} frames.",
              f"Parallel set, gold frames of the English and the Romanian realisation identical (det an = a): {same}/{len(par)}."]
    open(os.path.join(HERE, "COVERAGE_multi.md" if multi else "COVERAGE.md"), "w").write("\n".join(lines) + "\n")
    print(f"{wname} world written to {wd}: train {len(train)} ({dict(langs)}), new identities {len(ev_new)}, held-out formulations {len(ev_form)}, "
          f"mixed {len(ev_mixed)}, parallel {len(par)} (gold frames identical {same}); legend {sha[:19]}…; lexicon {len(lex)}; dictionary {len(E)} keys")
    return wd


def parallel(train_combos, k, seed, sha, wname):
    """the same frames realised four ways. Each row: the English realisation (English templates, English normalizer), the Romanian one,
    a mixed one (share MIX_EVAL) and a Romglish one (English template words with Romanian content words); each with its normalized text,
    its raw surface (what the dictionary route reads) and its gold SOP; and whether the two gold frames are identical"""
    rs = np.random.default_rng(903 + seed); g = G.Gen(rs, G.LABELS_TRAIN, G.NUMS_TRAIN); r = Ro(rs)
    w_ev = {e: 1.0 for e in G.EVENTS}; ws = np.array([w_ev[c[0]] / len(G.TEMPLATES[c[0]]) for c in train_combos]); ws /= ws.sum()
    rows = []
    for i in range(k):
        ev, tid, f, p = train_combos[int(rs.choice(len(train_combos), p=ws))]
        words, roles = f(g)
        words = ["each" if w == "every" else w for w in words]
        roles = {kk: ({**v, "det": "each"} if isinstance(v, dict) and v.get("det") == "every" else v) for kk, v in roles.items()}
        pid, ptxt = p
        negated = ev in G.PROHIBITABLE and pid in ("bare", "please", "now", "okay", "tail") and g.coin(0.12)
        never = negated and g.coin(0.25)
        ew = list(words)
        if negated: ew = (["never"] if never else [g.pick(["do not", "don't"])]) + ew
        if pid == "tail": ew = ew + ["please"]
        elif ptxt: ew = ptxt.split() + ew
        end = " ." if g.coin(0.5) else ""
        en_surface = " ".join(ew) + end
        rg = romglish(ew, roles, ev); rg_surface = " ".join(rg) + end
        out = {"id": f"p{i + 1:04d}", "event": ev, "template": f"{ev}.{tid}.{pid}", "negated": negated}
        real = {"en": (en_surface, normalize_en(en_surface)[0], roles), "romglish": (rg_surface, normalize_ro(rg_surface)[0], roles)}
        for lang, pm in (("ro", 0.0), ("mix", MIX_EVAL)):
            for _ in range(20):
                surface, rroles, neg2, template, n_en = realise_ro(r, ev, tid, f, p, g, mix=pm, neg_force=(negated, ("never" if never else "nu") if negated else None),
                                                                  en_words=(words, roles), end=end)
                if lang == "ro" or n_en: break
            real[lang] = (surface, normalize_ro(surface)[0], rroles)
        frames = {}
        for lang, (surface, toks, rl) in real.items():
            text = " ".join(toks)
            doc = soplang.Doc(directives=[("world", wname if lang != "en" else "diagram", None), ("legend", sha, None)])
            ids = iter(f"w{j}" for j in range(1, 200)); wires = G.wires_for(ev, rl, negated, text, out["template"], ids)
            doc.wires += wires
            out[lang] = {"surface": surface, "text": text, "gold_sop": soplang.write(doc)}
            frames[lang] = frame_key(wires, toks)
        out["gold_frames_identical"] = frames["en"] == frames["ro"] == frames["mix"] == frames["romglish"]
        out["frame"] = json.loads(frames["ro"])
        rows.append(out)
    return rows


_LEG = None
def frame_key(wires, toks):
    """the canonical gold frame (sop world.canon) with the predicate lemma found in the tokens, determiners an -> a (English 'an' is the
    article 'a' before a vowel: the same value for this comparison)"""
    global _LEG
    if _LEG is None:
        import tempfile
        d = tempfile.mkdtemp(); json.dump(G.legend_dict(), open(os.path.join(d, "legend.json"), "w"), indent=1)
        with open(os.path.join(d, "kinds.tsv"), "w", encoding="utf-8") as f:
            for w, (k, lem) in build_lexicon().items(): f.write(f"{w}\t{k}\t{lem}\n" if lem else f"{w}\t{k}\n")
        _LEG = Legend(os.path.join(d, "legend.json"))
    by = {w.id: w for w in wires}
    fr = sopworld.frame_of(wires[0], by, _LEG)
    fr["lemma"] = sopworld.Compiler(_LEG, sopworld.Stars(0, 8)).lemma_for(fr["event"], toks, set())
    for rl, fl in fr["roles"].items():
        if fl and fl[0] == "entity" and fl[3] == "an": fl[3] = "a"
    return sopworld.canon(fr)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default=None); ap.add_argument("--n", type=int, default=30000)
    ap.add_argument("--n_eval", type=int, default=400); ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--mix", type=float, default=0.0, help="code-switching share of the Romanian training sentences (default 0: Romanian only)")
    ap.add_argument("--languages", default="ro", help="ro (diagram_ro) or ro,en,mix (diagram_multi)")
    a = ap.parse_args(); langs = a.languages.split(",")
    if sorted(langs) not in (["ro"], ["en", "mix", "ro"]): raise SystemExit("--languages: ro or ro,en,mix")
    out = a.out or os.path.join(TOOL, "worlds", "diagram_multi" if langs != ["ro"] else "diagram_ro")
    build(out, a.n, a.n_eval, a.seed, langs, a.mix)
