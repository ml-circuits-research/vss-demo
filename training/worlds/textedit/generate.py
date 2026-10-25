"""generate.py: the textedit world (specification section 14.3, Table 9): the legend, the kinds lexicon, and editing commands with their
gold SOP wires, written as a world folder that `sop check` validates and `sop train` trains. The same design as the diagram world's
generator (training/worlds/diagram/generate.py): a command is composed from an event, its roles and their fillers, realised through a
TEMPLATE of that event and a PREFIX family, then normalized by normalize.py exactly as the editor normalizes what the user says in dictation
mode. Each top-level wire carries _template = '<event>.<template id>.<prefix id>'. Held-out formulations are whole (template, prefix)
combinations whose template and prefix both occur elsewhere in training; they are named in split_hints.json. New identities: a pool of
pieces of text (match / new text), widget names and numbers never used in training.

Level 1 only: one editing command per utterance, no negation ("do not bold it" is not a command of this world), no nesting. The commands
with two events ("select from Q3 to the end and make it italic") are Level 2 and are not generated.

Design decisions (stated; README.md repeats them):
- Every role filler is ONE token of the normalized sentence (the reader deposits the identity of the token it reads). Multi-word values
  become single tokens through the normalizer table: heading_one, bullet_list, numbered_list, list_item, at_start, at_end, full_stop,
  new_line, and the counted ordinals 'the last three' -> last_3 (first_N, last_N, next_N, previous_N for N = 2..5).
- One verb, one event (the event synonym table is GIVEN): make / turn / set / format / convert are verbs of `format`, so "make the first
  line a heading" and "turn the last three lines into a numbered list" read as `format` with format=heading / numbered_list; the events
  make_heading (promote, demote) and make_list (bullet, number, enumerate, itemise) have their own verbs, and the executor treats a block
  format of `format` exactly as those events. Verbs that name a format (embolden, italicise, underline, strike, highlight, bullet,
  number, centre, justify) carry the format in the verb (the frame's lemma); the format role is then absent.
- 'bold' and 'center' are both a value and a verb: the normalizer's verb-form rule rewrites them to embolden / centre when no world verb
  precedes them ("bold the last word"), so one token keeps one kind.
- 'that <unit>' is normalized to 'this <unit>': 'that' alone is the pronoun unit ("capitalise that"), 'this' the ordinal.
- Every token outside the closed lexicon is a piece of text (kind MATCH, by the legend's value pattern): dictated content is open
  vocabulary, so the reader's no-sense status is rare in this world and the command / content decision rests on the margins against the
  command threshold set on calibration rows that include dictated prose (prose_synth.py, prose_download.py, calibrate.py).
- The value role holds colour, size class AND alignment (left, right, center, justified): Table 9 names colour and size; alignment is the
  value of `align`.
- Range selections use the position role: "select from revenue to the end" -> match=revenue, position=at_end; "from the start to X" ->
  position=at_start.
Run: python3 generate.py --out <dir>/textedit [--n 20000] [--n_eval 400] [--seed 0]"""
import argparse, collections, datetime, hashlib, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); TOOL = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(HERE))), "tool")
sys.path.insert(0, TOOL); sys.path.insert(0, HERE)
import numpy as np
from sop import soplang
from sop.legend import sha256_file
from normalize import normalize, T as NORM_TABLE

# ------------------------------------------------------------------ vocabulary (spec Table 9)
EVENTS = {   # event id -> verbs (base forms after normalization; the predicate role reads the verb's identity through this table)
    "select": ["select", "choose", "mark"],
    "format": ["make", "turn", "set", "format", "convert", "embolden", "italicise", "underline", "strike", "highlight", "color"],
    "unformat": ["unformat"],
    "insert": ["insert", "add", "type", "put"],
    "delete": ["delete", "remove", "erase", "cut"],
    "replace": ["replace", "change", "correct", "swap"],
    "move_cursor": ["go", "jump", "move"],
    "capitalise": ["capitalise", "uppercase"],
    "make_list": ["bullet", "number", "enumerate", "itemise"],
    "make_heading": ["promote", "demote"],
    "align": ["align", "centre", "justify"],
    "undo": ["undo"], "redo": ["redo"], "read_back": ["read"]}
ROLES = [("unit", "which unit of text?"), ("ordinal", "which one, counted how?"), ("match", "which piece of text?"),
         ("format", "which format?"), ("value", "which colour, size or alignment?"), ("position", "where, relative to the target?"),
         ("new_text", "with what text?"), ("widget", "in which text widget?")]

UNITS = {"character": "characters", "word": "words", "sentence": "sentences", "line": "lines", "paragraph": "paragraphs", "list_item": "list_items"}
UNIT_SURF = {"list_item": "list item", "list_items": "list items"}
PRON_UNITS = {"it": ["it"], "that": ["that"], "everything": ["everything", "all the text", "the whole text", "all of it"],
              "selection": ["the selection", "the selected text"]}
ORD_SING = ["first", "second", "third", "fourth", "fifth", "last", "previous", "next", "this"]
ORD_PLUR = [f"{o}_{n}" for o in ("first", "last", "next", "previous") for n in (2, 3, 4, 5)]
NUMW = {2: "two", 3: "three", 4: "four", 5: "five"}
INLINE_FORMATS = ["bold", "italic", "underlined", "strikethrough", "highlighted"]
INLINE_SURF = {"italic": ["italic", "italics", "in italics"], "strikethrough": ["strikethrough", "struck through", "crossed out"], "bold": ["bold", "in bold"]}
BLOCK_FORMATS = ["heading", "heading_one", "heading_two", "heading_three", "list", "bullet_list", "numbered_list", "plain"]
BLOCK_SURF = {"heading": ["a heading"], "heading_one": ["heading one", "heading 1", "a level one heading"], "heading_two": ["heading two", "heading 2", "a subheading"],
              "heading_three": ["heading three", "heading 3"], "list": ["a list"], "bullet_list": ["a bullet list", "a bulleted list", "bullet points"],
              "numbered_list": ["a numbered list", "an ordered list"], "plain": ["plain text", "normal text"]}
FORMATS = INLINE_FORMATS + BLOCK_FORMATS
COLORS = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "gray", "black", "white"]
SIZES = ["small", "normal", "large", "huge", "bigger", "smaller"]
ALIGNS = ["left", "right", "center", "justified"]
POSITIONS = ["before", "after", "at_start", "at_end"]
PUNCTS = ["full_stop", "comma", "question_mark", "exclamation_mark", "colon", "semicolon", "new_line", "new_paragraph"]
PUNCT_SURF = {"full_stop": ["full stop", "period"], "question_mark": ["question mark"], "exclamation_mark": ["exclamation mark", "exclamation point"],
              "new_line": ["new line"], "new_paragraph": ["new paragraph"], "semicolon": ["semicolon", "semi colon"]}
WIDGET_HEADS = ["note", "card", "textbox", "widget"]
# pieces of text (match / new_text): ordinary words of business prose, plus homophone pairs the recogniser confuses (their / there)
TEXT_TRAIN = ["revenue", "profit", "budget", "sales", "growth", "costs", "margin", "team", "project", "meeting", "deadline", "client", "plan",
              "goals", "risks", "results", "price", "market", "product", "launch", "design", "draft", "quarter", "monday", "friday", "today",
              "tomorrow", "important", "urgent", "very", "really", "quickly", "maybe", "new", "old", "good", "great", "hello", "thanks", "regards",
              "anna", "paul", "maria", "peter", "london", "paris", "their", "there", "its", "q3", "q4", "kpi", "roadmap_item", "follow_up", "next_steps",
              "action_items", "board", "office", "travel", "hiring", "salary", "invoice", "contract", "offer", "partners", "users", "feedback",
              "survey", "data", "numbers", "chart", "slides", "agenda_item", "summer", "winter", "spring", "autumn", "weekly", "monthly", "annual"]
TEXT_NEW = ["dividend", "logistics", "warranty", "elena", "victor", "berlin", "tokyo", "q1", "q2", "procurement", "onboarding", "merger",
            "pipeline", "retention", "forecast", "headcount", "compliance", "audit_trail", "customer_success", "go_live"]
WIDGET_TRAIN = ["summary", "ideas", "agenda", "todo", "minutes", "intro", "abstract", "overview", "conclusion", "notes", "outline", "status"]
WIDGET_NEW = ["background", "appendix", "retro", "decisions"]
NUMS_TRAIN = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 100, 120, 150, 200, 2025, 2026]
NUMS_NEW = [35, 45, 90, 250, 2027]
NUM_WORDS = {5: "five", 10: "ten", 20: "twenty", 30: "thirty", 40: "forty", 50: "fifty", 60: "sixty", 25: "twenty five", 15: "fifteen", 80: "eighty",
             35: "thirty five", 45: "forty five", 90: "ninety"}

FUNCTION_WORDS = ["the", "a", "an", "to", "of", "in", "on", "at", "with", "into", "as", "from", "by", "for", "and", "this", "these", "cursor",
                  "back", "again", "text", "all", ",", "."]
FILLERS = ["please", "can", "could", "would", "you", "i", "want", "need", "lets", "now", "okay", "so", "um", "uh", "hey", "just", "kindly",
           "also", "me", "us", "will", "like", "thank", "should", "we"]
KINDS = {}
for s, p in UNITS.items(): KINDS[s] = "UNIT"; KINDS[p] = "UNIT"
KINDS["everything"] = "UNIT"; KINDS["selection"] = "UNIT"
for w in ["it", "that"]: KINDS[w] = "PRON"
for w in ORD_SING + ORD_PLUR: KINDS[w] = "ORD"
for w in FORMATS: KINDS[w] = "FORMAT"
for w in COLORS: KINDS[w] = "COLOR"
for w in SIZES: KINDS[w] = "SIZE"
for w in ALIGNS: KINDS[w] = "ALIGN"
for w in POSITIONS: KINDS[w] = "POS"
for w in PUNCTS: KINDS[w] = "PUNCT"
for w in WIDGET_HEADS: KINDS[w] = "WHEAD"
for w in TEXT_TRAIN + TEXT_NEW + WIDGET_TRAIN + WIDGET_NEW + [str(n) for n in NUMS_TRAIN + NUMS_NEW]: KINDS.setdefault(w, "MATCH")
for vs in EVENTS.values():
    for v in vs: KINDS[v] = "VERB"
for w in FUNCTION_WORDS: KINDS.setdefault(w, w)          # function words are their own kind (as the diagram world)
KINDS["this"] = "ORD"; KINDS["these"] = "DEM"; KINDS["a"] = "a"; KINDS["an"] = "a"
for w in FILLERS: KINDS[w] = "FILLER"

PREFIXES = [("bare", ""), ("please", "please"), ("could", "could you"), ("can", "can you"), ("would", "would you"), ("want", "i want you to"),
            ("need", "i need you to"), ("lets", "let's"), ("now", "now"), ("okay", "okay so"), ("tail", "")]   # 'tail' = trailing 'please'


class Gen:
    def __init__(self, rng, texts, widgets, nums):
        self.r, self.texts, self.widgets, self.nums = rng, texts, widgets, nums
    def pick(self, xs): return xs[int(self.r.integers(len(xs)))]
    def coin(self, p=0.5): return self.r.random() < p

    def target(self, plural_p=0.3, units=None):
        """'the last three lines' -> (surface words, {'unit': 'lines', 'ordinal': 'last_3'})"""
        u = self.pick(units or list(UNITS))
        if self.coin(plural_p):
            o = self.pick(ORD_PLUR); base, n = o.rsplit("_", 1); n = int(n)
            ow = f"{base} {NUMW[n]}" if self.coin(0.75) else f"{base} {n}"; uw = UNITS[u]
            return ["the"] + ow.split() + UNIT_SURF.get(uw, uw).split(), {"unit": uw, "ordinal": o}
        o = self.pick(ORD_SING)
        if o == "this": return [self.pick(["this", "that"])] + UNIT_SURF.get(u, u).split(), {"unit": u, "ordinal": "this"}
        return ["the", o] + UNIT_SURF.get(u, u).split(), {"unit": u, "ordinal": o}

    def pron(self, allow=("it", "that", "everything", "selection")):
        p = self.pick(list(allow)); return self.pick(PRON_UNITS[p]).split(), {"unit": p}

    def text(self, num_p=0.12):
        """a piece of text: a word, a number (as digits or words) or a quoted phrase"""
        if self.coin(num_p):
            n = self.pick(self.nums); s = NUM_WORDS[n] if n in NUM_WORDS and self.coin(0.5) else str(n); return s.split(), str(n)
        t = self.pick(self.texts)
        if "_" in t: return ['"' + t.replace("_", " ") + '"'], t     # multi-word pieces are quoted (the normalizer joins them)
        return [t], t

    def match(self, word_p=0.35):
        """'the word revenue' or 'revenue' -> roles {match, [unit=word]}"""
        w, m = self.text()
        if self.coin(word_p) and len(w) == 1 and not w[0].startswith('"') and not m.isdigit(): return ["the", "word"] + w, {"unit": "word", "match": m}
        return w, {"match": m}

    def any_target(self, pron_p=0.2, match_p=0.3, plural_p=0.3, units=None):
        k = self.r.random()
        if k < pron_p: return self.pron()
        if k < pron_p + match_p: return self.match()
        return self.target(plural_p, units)

    def widget(self, p=0.12):
        if not self.coin(p): return [], {}
        w = self.pick(self.widgets); return ["in", "the", w, self.pick(WIDGET_HEADS)], {"widget": w}

    def inline(self, f): return self.pick(INLINE_SURF.get(f, [f])).split()
    def block(self, f): return self.pick(BLOCK_SURF[f]).split()


def wires_for(ev, roles, text, template, ids):
    w = soplang.Wire(next(ids), ev)
    for r, _ in ROLES:
        if r in roles: w.set(r, str(roles[r]))
    w.lines = [soplang.Line("_text", text), soplang.Line("_source", "generator"), soplang.Line("_template", template), soplang.Line("_mood", "command")] + w.lines
    return [w]


# ------------------------------------------------------------------ templates per event
TEMPLATES = collections.defaultdict(list)
def T(event):
    def deco(f): TEMPLATES[event].append((f.__name__, f)); return f
    return deco

@T("select")
def s_target(g): w, r = g.target(); ww, wr = g.widget(); return [g.pick(EVENTS["select"])] + w + ww, {**r, **wr}
@T("select")
def s_pron(g): w, r = g.pron(("everything", "it", "that")); return [g.pick(["select", "choose"])] + w, r
@T("select")
def s_match(g): w, r = g.match(); ww, wr = g.widget(); return [g.pick(EVENTS["select"])] + w + ww, {**r, **wr}
@T("select")
def s_range(g):
    w, m = g.text(num_p=0.05)
    if g.coin(0.5): return ["select", "from"] + w + g.pick([["to", "the", "end"], ["until", "the", "end"]]), {"match": m, "position": "at_end"}
    return ["select", "from", "the", g.pick(["start", "beginning"]), "to"] + w, {"match": m, "position": "at_start"}

@T("format")
def f_make_inline(g):
    w, r = g.any_target(); f = g.pick(INLINE_FORMATS); ww, wr = g.widget()
    return [g.pick(["make", "make", "turn", "set"])] + w + g.inline(f) + ww, {**r, "format": f, **wr}
@T("format")
def f_make_color(g):
    w, r = g.any_target(match_p=0.45); c = g.pick(COLORS); return [g.pick(["make", "turn", "color", "colour"])] + w + [c], {**r, "value": c}
@T("format")
def f_make_size(g):
    w, r = g.any_target(); s = g.pick(SIZES); return ["make"] + w + [s], {**r, "value": s}
@T("format")
def f_verb_format(g):
    v = g.pick(["bold", "embolden", "italicise", "italicize", "underline", "strike through", "cross out", "highlight"]); w, r = g.any_target(match_p=0.4)
    ww, wr = g.widget(); return v.split() + w + ww, {**r, **wr}
@T("format")
def f_highlight_color(g):
    w, r = g.any_target(match_p=0.4); c = g.pick(["yellow", "green", "pink", "blue", "orange"]); return ["highlight"] + w + ["in", c], {**r, "value": c}
@T("format")
def f_make_block(g):
    w, r = g.target(plural_p=0.25, units=["line", "paragraph", "sentence"]); f = g.pick(["heading", "heading_one", "heading_two", "heading_three", "plain"])
    return [g.pick(["make", "turn", "set"])] + w + (["into"] if g.coin(0.3) else []) + g.block(f), {**r, "format": f}
@T("format")
def f_into_list(g):
    w, r = g.target(plural_p=0.85, units=["line", "paragraph", "sentence"]); f = g.pick(["list", "bullet_list", "numbered_list"])
    return [g.pick(["turn", "make", "convert"])] + w + ["into"] + g.block(f), {**r, "format": f}
@T("format")
def f_format_as(g):
    w, r = g.any_target(match_p=0.1); f = g.pick(BLOCK_FORMATS + ["bold", "italic"]); fw = g.block(f) if f in BLOCK_SURF else [f]
    return ["format"] + w + ["as"] + fw, {**r, "format": f}

@T("unformat")
def u_target(g):
    w, r = g.any_target(); return g.pick([["unformat"], ["remove", "the", "formatting", "from"], ["clear", "the", "formatting", "of"]]) + w, r
@T("unformat")
def u_format(g):
    w, r = g.any_target(); f, s = g.pick([("bold", ["remove", "the", "bold", "from"]), ("bold", ["unbold"]), ("italic", ["remove", "the", "italics", "from"]),
                                          ("underlined", ["remove", "the", "underline", "from"]), ("highlighted", ["remove", "the", "highlight", "from"]),
                                          ("strikethrough", ["remove", "the", "strikethrough", "from"])])
    return s + w, {**r, "format": f}

@T("insert")
def i_rel(g):
    nw, n = g.text(); p = g.pick(["before", "after"]); mw, m = g.text()
    while n == m: mw, m = g.text()
    return [g.pick(["insert", "add", "type", "put"])] + nw + [p] + mw, {"new_text": n, "position": p, "match": m}
@T("insert")
def i_end(g):
    nw, n = g.text(); p = g.pick(["at_start", "at_end"]); pw = ["at", "the", "end"] if p == "at_end" else ["at", "the", g.pick(["start", "beginning"])]
    return [g.pick(["insert", "add", "type"])] + nw + pw, {"new_text": n, "position": p}
@T("insert")
def i_end_of(g):
    nw, n = g.text(); p = g.pick(["at_start", "at_end"]); pw = ["at", "the", "end", "of"] if p == "at_end" else ["at", "the", "start", "of"]
    w, r = g.target(plural_p=0, units=["word", "sentence", "line", "paragraph", "list_item"]); return [g.pick(["insert", "add"])] + nw + pw + w, {"new_text": n, "position": p, **r}
@T("insert")
def i_punct(g):
    pc = g.pick(PUNCTS); pw = g.pick(PUNCT_SURF.get(pc, [pc])).split(); art = [] if pc.startswith("new_") and g.coin(0.5) else (["an"] if pc == "exclamation_mark" else ["a"])
    if g.coin(0.5): return [g.pick(["put", "add", "insert"])] + art + pw + ["at", "the", "end"], {"new_text": pc, "position": "at_end"}
    mw, m = g.text(num_p=0.05); p = g.pick(["before", "after"]); return [g.pick(["put", "add", "insert"])] + art + pw + [p] + mw, {"new_text": pc, "position": p, "match": m}

@T("delete")
def d_target(g): w, r = g.target(); ww, wr = g.widget(); return [g.pick(EVENTS["delete"])] + w + ww, {**r, **wr}
@T("delete")
def d_pron(g):
    if g.coin(0.25): return ["scratch", "that"], {"unit": "that"}
    w, r = g.pron(); return [g.pick(["delete", "remove", "erase", "cut"])] + w, r
@T("delete")
def d_match(g): w, r = g.match(); return [g.pick(["delete", "remove", "erase"])] + w, r
@T("delete")
def d_after(g):
    mw, m = g.text(num_p=0.05); p = g.pick(["before", "after"]); return ["delete", "everything", p] + mw, {"unit": "everything", "position": p, "match": m}

@T("replace")
def r_with(g):
    mw, m = g.match(word_p=0.25); nw, n = g.text()
    while n == m["match"]: nw, n = g.text()
    return ["replace"] + mw + ["with"] + nw, {**m, "new_text": n}
@T("replace")
def r_to(g):
    mw, m = g.text(); nw, n = g.text()
    while n == m: nw, n = g.text()
    return [g.pick(["change", "correct"])] + mw + ["to"] + nw, {"match": m, "new_text": n}
@T("replace")
def r_target(g):
    w, r = g.target(plural_p=0, units=["word", "sentence", "line"]); nw, n = g.text(); return ["replace"] + w + ["with"] + nw, {**r, "new_text": n}

@T("move_cursor")
def c_end(g):
    p = g.pick(["at_start", "at_end"]); pw = ["the", "end"] if p == "at_end" else ["the", g.pick(["start", "beginning"])]
    return g.pick([["go", "to"], ["jump", "to"], ["move", "the", "cursor", "to"]]) + pw, {"position": p}
@T("move_cursor")
def c_end_of(g):
    p = g.pick(["at_start", "at_end"]); pw = ["the", "end", "of"] if p == "at_end" else ["the", "start", "of"]; w, r = g.target(plural_p=0)
    return g.pick([["go", "to"], ["jump", "to"], ["move", "the", "cursor", "to"], ["put", "the", "cursor", "at"]]) + pw + w, {"position": p, **r}
@T("move_cursor")
def c_target(g):
    w, r = g.target(plural_p=0); return g.pick([["go", "to"], ["jump", "to"], ["move", "the", "cursor", "to"]]) + w, r
@T("move_cursor")
def c_match(g):
    mw, m = g.text(num_p=0.05); p = g.pick(["before", "after"]); return g.pick([["move", "the", "cursor"], ["put", "the", "cursor"], ["go"]]) + [p] + mw, {"position": p, "match": m}

@T("capitalise")
def k_target(g): w, r = g.any_target(); return [g.pick(["capitalise", "capitalize", "uppercase"])] + w, r

@T("make_list")
def l_verb(g): w, r = g.target(plural_p=0.85, units=["line", "paragraph", "sentence"]); return [g.pick(EVENTS["make_list"] + ["itemize"])] + w, r
@T("make_list")
def l_pron(g): w, r = g.pron(("it", "that", "everything", "selection")); return [g.pick(EVENTS["make_list"])] + w, r
@T("make_list")
def l_as(g):
    w, r = g.target(plural_p=0.85, units=["line", "paragraph"]); f = g.pick(["bullet_list", "numbered_list"]); return ["itemise"] + w + ["as"] + g.block(f), {**r, "format": f}

@T("make_heading")
def h_to(g):
    w, r = g.any_target(match_p=0.0, plural_p=0, units=["line", "paragraph", "sentence"]); f = g.pick(["heading", "heading_one", "heading_two", "heading_three"])
    return [g.pick(["promote", "demote"])] + w + ["to"] + g.block(f), {**r, "format": f}
@T("make_heading")
def h_plain(g): w, r = g.any_target(match_p=0.0, plural_p=0, units=["line", "paragraph", "sentence"]); return ["promote"] + w, r

@T("align")
def a_value(g):
    w, r = g.any_target(match_p=0.0, units=["line", "paragraph", "sentence", "list_item"]); a = g.pick(ALIGNS)
    aw = {"left": [g.pick(["left", "to the left"])], "right": [g.pick(["right", "to the right"])], "center": [g.pick(["center", "to the center", "centre"])], "justified": ["justified"]}[a]
    return ["align"] + w + " ".join(aw).split(), {**r, "value": a}
@T("align")
def a_verb(g): w, r = g.any_target(match_p=0.0, units=["line", "paragraph", "sentence", "list_item"]); return [g.pick(["center", "centre", "justify"])] + w, r

@T("undo")
def ud(g): return g.pick([["undo"], ["undo"], ["undo", "again"]]), {}
@T("redo")
def rd(g): return g.pick([["redo"], ["redo"], ["redo", "again"]]), {}

@T("read_back")
def rb_target(g):
    w, r = g.any_target(match_p=0.0); return [g.pick(["read", "read back", "read out", "read me"])][0].split() + w + (["back"] if g.coin(0.2) else []), r
@T("read_back")
def rb_it(g):
    u = g.pick(["it", "that", "everything"]); return ["read", u] + (["back"] if u != "everything" else []), {"unit": u}


def realise(g, ev, tid, f, prefix):
    words, roles = f(g)
    pid, ptxt = prefix
    if pid == "tail": words = words + ["please"]
    elif ptxt: words = ptxt.split() + words
    surface = " ".join(words) + (" ." if g.coin(0.4) else "")
    toks, info = normalize(surface)
    for r, v in roles.items():                          # every filler is a token of the normalized sentence (the design rule)
        if str(v) not in toks: raise AssertionError(f"{ev}.{tid}: role {r}={v} not a token of {toks} (surface {surface!r})")
    stray = [t for t in toks if t not in KINDS and t not in map(str, roles.values())]
    if stray: raise AssertionError(f"{ev}.{tid}: tokens without a kind {stray} in {toks} (surface {surface!r})")
    return " ".join(toks), roles, f"{ev}.{tid}.{pid}", surface


def build(out, n, n_eval, seed):
    assert sorted(v for vs in EVENTS.values() for v in vs) == sorted(NORM_TABLE["verbs"]), "normalize.json 'verbs' must list the legend's verbs"
    combos = [(ev, tid, f, p) for ev, ts in TEMPLATES.items() for tid, f in ts for p in PREFIXES]
    h = lambda s: int(hashlib.sha256(f"{seed}:{s}".encode()).hexdigest()[:8], 16) / 2 ** 32
    held = {f"{ev}.{tid}.{p[0]}" for ev, tid, f, p in combos if p[0] != "bare" and h(f"{ev}.{tid}.{p[0]}") < 0.12}
    train_combos = [c for c in combos if f"{c[0]}.{c[1]}.{c[3][0]}" not in held]
    held_combos = [c for c in combos if f"{c[0]}.{c[1]}.{c[3][0]}" in held]
    w_ev = {"format": 6, "select": 3, "delete": 3, "insert": 3, "replace": 3, "move_cursor": 2, "capitalise": 1.5, "make_list": 1.5, "make_heading": 1.5,
            "unformat": 1.5, "align": 1.2, "read_back": 0.8, "undo": 0.4, "redo": 0.3}
    def draw(cs, k, texts, widgets, nums, rs):
        g = Gen(rs, texts, widgets, nums); ws = np.array([w_ev[c[0]] / len(TEMPLATES[c[0]]) for c in cs]); ws /= ws.sum(); rows = []
        for _ in range(k):
            ev, tid, f, p = cs[int(rs.choice(len(cs), p=ws))]; rows.append((ev,) + realise(g, ev, tid, f, p))
        return rows
    train = draw(train_combos, n, TEXT_TRAIN, WIDGET_TRAIN, NUMS_TRAIN, np.random.default_rng(200 + seed))
    new_pool = set(TEXT_NEW) | set(WIDGET_NEW) | {str(x) for x in NUMS_NEW}
    ev_new = draw(train_combos, 8 * n_eval, TEXT_NEW, WIDGET_NEW, NUMS_NEW, np.random.default_rng(900 + seed))
    ev_new = [r for r in ev_new if any(x in new_pool for x in r[1].split())][:n_eval]
    ev_form = draw(held_combos, n_eval, TEXT_TRAIN, WIDGET_TRAIN, NUMS_TRAIN, np.random.default_rng(901 + seed))
    legend = {"version": 1, "roles": [{"id": r, "question": q} for r, q in ROLES], "events": [{"id": e, "verbs": vs} for e, vs in EVENTS.items()],
              "operators": [], "moods": ["command"], "kinds": {"source": "lexicon", "lexicon": "kinds.tsv"},
              "values": [{"kind": "MATCH", "pattern": "[a-z0-9][a-z0-9']*(_[a-z0-9']+)*"}],
              "reader": {"predicate_role": True, "occupancy_marker": True, "definite_dets": ["the"],
                         "gates_given": {"open": ["to", "of", "in", "on", "at", "with", "into", "as", "from", "by", "for", "and", ",", "."], "closed": []}}}
    wd = out; [os.makedirs(os.path.join(wd, d), exist_ok=True) for d in ("examples", "raw", "audit", "model", "runs", "versions", "requests")]
    lp = os.path.join(wd, "legend.json"); json.dump(legend, open(lp, "w"), indent=1)
    with open(os.path.join(wd, "kinds.tsv"), "w") as f:
        f.write("# word\tkind -- the textedit world's categories (GIVEN, rule 20); any other token is a piece of text (MATCH) by the legend's value pattern\n")
        for w in sorted(KINDS): f.write(f"{w}\t{KINDS[w]}\n")
    sha = sha256_file(lp)
    json.dump({"name": "textedit", "language": "en", "description": "VSS Diagram Editor, textedit world, Level 1 (vision/VSS_Diagram_Editor_Specification.md, section 14)",
               "created": datetime.date.today().isoformat(), "version": 1, "min_examples": 500, "max_versions_per_run": 3,
               "models": {"pipeline": "claude-haiku-5-5", "annotate": "claude-haiku-5-5", "second_look": "claude-haiku-5-5", "evolve": "claude-opus-5-5"},
               "second_look_escalate": 0.05, "second_look_retrain": 0.05}, open(os.path.join(wd, "world.json"), "w"), indent=1)
    def write(fname, rows):
        doc = soplang.Doc(directives=[("world", "textedit", None), ("legend", sha, None), ("generated", f"training/worlds/textedit/generate.py seed {seed} ({datetime.date.today()})", None)])
        k = 0
        for ev, text, roles, template, surface in rows:
            ids = iter(f"w{k + i}" for i in range(1, 50)); ws = wires_for(ev, roles, text, template, ids); k += len(ws)
            ws[0].lines.insert(1, soplang.Line("_world", "textedit")); doc.wires += ws
        open(os.path.join(wd, "examples", fname), "w").write(soplang.write(doc))
    write("train.sop", train); write("eval_new_identities.sop", ev_new); write("eval_heldout_formulations.sop", ev_form)
    hints = {"heldout_sentence_share": 0.1, "new_identities": sorted(new_pool),
             "file_splits": {"examples/eval_new_identities.sop": "new_identities", "examples/eval_heldout_formulations.sop": "heldout_formulations"},
             "template_splits": {"heldout_formulations": sorted(held)},
             "protocol": "textedit world Level 1: one editing command per utterance, no negation, no nesting; held-out formulations = (template, prefix) combinations whose template and prefix both occur in training; new identities = pieces of text, widget names and numbers never in training. Dictated prose (negatives for the command threshold) is not in examples/: raw/prose_*.txt, used by calibrate.py only."}
    json.dump(hints, open(os.path.join(wd, "split_hints.json"), "w"), indent=1)
    with open(os.path.join(wd, "raw", "sentences.txt"), "w") as f: f.write("\n".join(r[1] for r in train[:2000]) + "\n")
    with open(os.path.join(wd, "raw", "surface_commands.tsv"), "w") as f:      # surface forms (before normalization) for the dictation tests
        f.write("# surface<TAB>normalized<TAB>event<TAB>split\n")
        for name, rows in (("train", train[:500]), ("heldout_formulations", ev_form), ("new_identities", ev_new)):
            for ev, text, roles, template, surface in rows: f.write(f"{surface}\t{text}\t{ev}\t{name}\n")
    if not os.path.exists(os.path.join(wd, "status.json")): json.dump({"label": None, "note": "never trained"}, open(os.path.join(wd, "status.json"), "w"))
    cov = collections.Counter(); ev_count = collections.Counter(); vals = collections.defaultdict(collections.Counter)
    for ev, text, roles, template, surface in train:
        ev_count[ev] += 1
        for r, v in roles.items(): cov[(ev, r)] += 1; vals[r][v] += 1
    cols = [r for r, _ in ROLES]
    lines = [f"# Coverage of the textedit world, Level 1 (generate.py seed {seed}, {n} training sentences)", "",
             f"Legend {sha}. Templates {sum(len(v) for v in TEMPLATES.values())}, prefixes {len(PREFIXES)}, combinations {len(combos)}, held out {len(held)}.", "",
             "Sentences per event and role (training file):", "", "| event | n | " + " | ".join(cols) + " |", "|---|---|" + "---|" * len(cols)]
    for ev in EVENTS: lines.append(f"| {ev} | {ev_count[ev]} | " + " | ".join(str(cov[(ev, r)]) if cov[(ev, r)] else "" for r in cols) + " |")
    lines += ["", "Closed values seen in training (role: value count):", ""]
    for r in ("unit", "ordinal", "format", "value", "position"):
        lines.append(f"- {r}: " + ", ".join(f"{v} {c}" for v, c in sorted(vals[r].items())))
    closed = {"unit": list(UNITS) + list(UNITS.values()) + list(PRON_UNITS), "ordinal": ORD_SING + ORD_PLUR, "format": FORMATS, "value": COLORS + SIZES + ALIGNS, "position": POSITIONS}
    missing = {r: [v for v in vs if not vals[r][v]] for r, vs in closed.items()}
    lines += ["", "Closed values never seen in training: " + ("; ".join(f"{r}: {', '.join(v)}" for r, v in missing.items() if v) or "none") + ".",
              "", f"Pieces of text in training: {len(vals['match'])} distinct match values, {len(vals['new_text'])} distinct new_text values; widgets {len(vals['widget'])}.",
              "", f"Evaluation files: eval_new_identities.sop {len(ev_new)} sentences; eval_heldout_formulations.sop {len(ev_form)} sentences.",
              "Dictated prose (negatives for the command threshold): prose_synth.py (ours, local) and prose_download.py (public domain, DGX only); not in examples/."]
    open(os.path.join(HERE, "COVERAGE.md"), "w").write("\n".join(lines) + "\n")
    print(f"textedit world written to {wd}: train {len(train)}, new identities {len(ev_new)}, held-out formulations {len(ev_form)}; legend {sha[:19]}...; kinds {len(KINDS)} words, {len(set(KINDS.values()))} kinds")
    return wd


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default=os.path.join(TOOL, "worlds", "textedit")); ap.add_argument("--n", type=int, default=20000)
    ap.add_argument("--n_eval", type=int, default=400); ap.add_argument("--seed", type=int, default=0)
    a = ap.parse_args(); build(a.out, a.n, a.n_eval, a.seed)
