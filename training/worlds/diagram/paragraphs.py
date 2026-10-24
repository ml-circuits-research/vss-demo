"""paragraphs.py: paragraphs and long single sentences of the diagram world with their gold segmentation and gold SOP circuit
(specification sections 15.1-15.4, Table 13 rows "Segmentation of paragraphs and long sentences" and "Circuit links").

Every unit is a Level 1 command realised by a TEMPLATE of generate.py (the same templates, prefixes and normalizer as the reader's
training data), so a unit is a sentence of the world the reader was trained on. What this file adds is the story: a StoryGen (a
subclass of generate.Gen) decides, for every entity a template asks for, whether it is a new component ("a database") or a reference to
one the story already has, and how the reference is written (a pronoun, the component's label, its kind word, or, in scripts, a kind
word with a section or ordinal qualifier). Because the story knows the referent of every mention, the gold circuit is known: the shared
entity links, the discourse links, the execution order, the cycles and the conflicts. The rules used for the gold are stated here and
mirrored, independently, by app/src/segment/circuit.js:

  primary entity of a unit (what "it" / "them" in the next unit refers to): the created entity for create / copy / group, else the
      object if it is a component, else the source; a delete leaves no primary for the story (the generator never says "it" after it);
  shared link: every mention of an entity that is not its introduction, written "<unit>.<role>=><intro unit>.<intro role>";
  discourse links: "then:<a>-><b>" (then, and then, after that; "before that" reverses), "but:<a>-><b>", "if:<condition>-><consequence>";
  execution order: a topological order (Kahn, ties broken by text order) over: introduction -> every later use of the entity,
      every earlier use of an entity -> its delete, then / but / if edges; nodes left over are a cycle;
  conflicts: two non-negated units that set the same role of the same entity to different values; the roles that set are, per event,
      change: color size style; resize: size; name: text; move (and place of an existing component): region; arrange: layout.

The surface paragraph is normalized as a whole with normalize.py and checked token for token against the concatenation of its units, so
the gold spans are spans of what the editor's normalizer produces.

Run: python3 paragraphs.py [--out ../../data/diagram/eval/paragraphs.jsonl] [--n 400] [--n_long 200] [--seed 0]"""
import argparse, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import numpy as np
import generate as G
from normalize import normalize

# the resolver's groups of words that name the same thing (app/src/editor/scene.js SAME), so that the story never has two entities a
# kind word could confuse
SAME = [["box", "process", "step", "task"], ["decision", "diamond"], ["user", "actor", "customer"], ["note", "comment", "textbox"],
        ["line", "arrow", "connector"], ["container", "lane"], ["service", "server", "api"], ["document", "file"]]
def group_of(w):
    for g in SAME:
        if w in g: return g[0]
    return w
GENERIC = {"shape", "component", "element", "item", "thing"}
STORY_HEADS = [h for h in G.NODE_HEADS if h not in GENERIC]
PLURAL = {h: G.COMPONENTS[h] for h in G.COMPONENTS}
SINGULAR = {v: k for k, v in PLURAL.items()}
EXCLUDED = {"undo", "redo", "clear", "zoom", "ungroup"}
SETTING = {"change": ["color", "size", "style"], "resize": ["size"], "name": ["text"], "move": ["region"], "place": ["region"], "arrange": ["layout"]}
ORD = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth",
       "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth"]
W_EV = {"create": 6, "connect": 4, "move": 3, "change": 4, "delete": 1, "name": 1.5, "place": 2, "resize": 1.5, "group": 1, "arrange": 1,
        "align": 1, "distribute": 0.7, "copy": 0.7, "front": 0.4, "back": 0.4}


# the generator's templates write multi-word values as the normalizer's tokens (top_left, right_of); the surface spells them as a person
# would ("top left", "right of"); normalize() maps them back to the same tokens (checked for every record)
_T = json.load(open(os.path.join(HERE, "normalize.json")))
PRETTY = {}
for a, b in _T["mwe"]:
    if " " not in b and "_" in b and (b not in PRETTY or len(a) < len(PRETTY[b])): PRETTY[b] = a


class NoRef(Exception): pass


class Story:
    """the entities of a paragraph or a document, with their current attributes, as the editor will hold them"""
    def __init__(self, max_per_group=1, qualifiers=False):
        self.ents = {}; self.n = 0; self.locks = set(); self.prev = None; self.section = 0; self.max_per_group = max_per_group
        self.qualifiers = qualifiers; self.order = []                      # creation order of eids
    def new(self, word, plural, attr, unit, role):
        self.n += 1; eid = f"E{self.n}"
        e = {"eid": eid, "word": word, "plural": plural, "n": 1, "label": None, "color": None, "size": "medium", "style": None, "alive": True,
             "section": self.section, "intro": [unit, role], "group": group_of(word), "nodesc": False}
        if attr in G.COLORS: e["color"] = attr
        elif attr in G.SIZES: e["size"] = attr
        elif attr in G.STYLES: e["style"] = attr
        self.ents[eid] = e; self.order.append(eid); return e
    def alive(self): return [self.ents[i] for i in self.order if self.ents[i]["alive"]]
    def group_free(self, grp):
        same = [e for e in self.alive() if e["group"] == grp]
        return not any(e["section"] == self.section for e in same) and len(same) < self.max_per_group
    def label_unique(self, lab): return sum(1 for e in self.alive() if e["label"] == lab) == 1
    def label_used(self, lab): return any(e["label"] == lab for e in self.ents.values())


class StoryGen(G.Gen):
    """generate.Gen whose entity() consults the story: templates are unchanged, only the choice of the referent is the story's"""
    def __init__(self, rng, labels, nums, story):
        super().__init__(rng, labels, nums); self.story = story; self.reset(None, 0)
    def reset(self, ev, unit, force=None, pron=True):
        self.ev, self.unit, self.force, self.pron = ev, unit, force, pron; self.mentions = []
    def used(self): return {m[1] for m in self.mentions if m[1]}

    def entity(self, det_choices=("the",), heads=None, attr_p=0.5, label_p=0.15, neg_p=0.08, plural=False, allow_label_head=True, pron_p=0.0):
        if heads and all(h in G.EDGE_HEADS for h in heads):           # a connector description: local to the unit, never shared
            w, s = G.Gen.entity(self, det_choices, heads, attr_p, 0, 0, plural, False, 0); self.mentions.append((s, None, "edge")); return w, s
        dets = tuple(det_choices)
        create = dets == ("a",) or (dets == () and plural) or (self.ev == "place" and "a" in dets and self.coin(0.5) and self.force is None)
        if create: return self._create(plural, attr_p)
        return self._reference(dets, heads or G.NODE_HEADS, attr_p, plural, allow_label_head and label_p > 0, pron_p > 0)

    def _create(self, plural, attr_p):
        st = self.story; free = [h for h in STORY_HEADS if st.group_free(group_of(h))]
        if not free: raise NoRef("no free kind")
        h = self.pick(free); attr = None
        if self.coin(attr_p):
            k = self.pick(["color", "color", "size", "style"]); attr = self.pick(G.COLORS if k == "color" else G.SIZES if k == "size" else G.STYLES)
        hw = PLURAL[h] if plural else h; words = [] if plural else ["a"]; spec = {"head": hw}
        if not plural: spec["det"] = "a"
        if attr: words.append(attr); spec["attr"] = attr
        words.append(hw)
        if not plural and words[1][0] in "aeiou": words[0] = "an"; spec["det"] = "an"
        e = st.new(h, plural, attr, self.unit, None); self.mentions.append((spec, e["eid"], "create")); return words, spec

    def _ways(self, e, label_ok, pron_ok, want_set):
        st = self.story; ways = []
        if pron_ok and self.pron and e["eid"] == st.prev: ways.append("pronoun")
        if label_ok and e["label"] and st.label_unique(e["label"]) and not want_set: ways.append("label")
        same = [x for x in st.alive() if x["group"] == e["group"]]
        if not e["nodesc"] and not any(x["nodesc"] for x in same):
            if len(same) == 1: ways.append("description")
            elif st.qualifiers:
                ways.append("section")
                if not want_set: ways.append("ordinal")
        return ways

    def _reference(self, dets, heads, attr_p, plural, label_ok, pron_ok):
        st = self.story; want_set = plural or any(d in ("each", "every") for d in dets); allowed = {group_of(h) for h in heads}
        cands = []
        for e in st.alive():
            if e["plural"] != want_set or e["group"] not in allowed or e["word"] not in heads or e["eid"] in self.used(): continue
            if (self.ev, e["eid"]) in st.locks or ("*", e["eid"]) in st.locks: continue
            if e["word"] == "container": continue
            ways = self._ways(e, label_ok, pron_ok, want_set)
            if ways: cands.append((e, ways))
        if self.force is not None: cands = [c for c in cands if c[0]["eid"] == self.force]
        if not cands: raise NoRef("no referent")
        pref = [c for c in cands if c[0]["eid"] == st.prev]
        e, ways = pref[0] if pref and self.coin(0.6) else cands[int(self.r.integers(len(cands)))]
        if "pronoun" in ways and self.coin(0.6): how = "pronoun"
        elif "label" in ways and self.coin(0.4): how = "label"
        elif "description" in ways: how = "description"
        elif "section" in ways or "ordinal" in ways: how = self.pick([w for w in ways if w in ("section", "ordinal")])
        else: how = ways[0]
        if how == "pronoun":
            p = "them" if want_set else "it"; spec = {"head": p}; self.mentions.append((spec, e["eid"], how)); return [p], spec
        if how == "label":
            spec = {"head": e["label"]}; self.mentions.append((spec, e["eid"], how)); return [e["label"]], spec
        det = self.pick([d for d in dets if d not in ("a", "an")] or ["the"])
        hw = e["word"] if (not want_set or det in ("each", "every")) else PLURAL[e["word"]]
        words = [det]; spec = {"head": hw, "det": det}
        if det == "all" and self.coin(0.4): words.append("the")
        cur = [a for a in (e["color"], e["style"]) if a]
        if cur and self.coin(attr_p * 0.6): a = self.pick(cur); words.append(a); spec["attr"] = a
        qual = None
        if how == "ordinal":
            same = [x for x in st.alive() if x["group"] == e["group"]]; k = same.index(e)
            words = ["the", ORD[k]] + words[1:]; spec["det"] = "the"; qual = {"ordinal": k + 1}
        words.append(hw)
        if how == "section":
            s = e["section"]; words += (["from", "the", ORD[s], "section"] if self.coin(0.6) else ["from", "section", str(s + 1)]); qual = {"section": s + 1}
        if qual: spec["_qual"] = dict(qual, head=hw)
        self.mentions.append((spec, e["eid"], how)); return words, spec


def filler(v):
    """a role value of a template -> the reader's frame filler (tool/sop/world.py frame_of on the wires generate.wires_for writes)"""
    if not isinstance(v, dict): return ["word", str(v)]
    h = v["head"]
    if h in ("it", "them", "everything"): return ["entity", h, None, None]
    attr = ["word", v["attr"]] if v.get("attr") else ["negword", v["negattr"]] if v.get("negattr") else None
    return ["entity", h, attr, v.get("det")]


def primary(ev, roles, ments):
    if ev in ("create", "copy", "group") or (ev == "place" and ments.get("object", (None, None))[1] == "create"): return "created"
    for r in ("object", "source"):
        if r in ments and ments[r][0] is not None: return r
    return None


def make_unit(sg, ev, k, force=None, pron=True, tries=60):
    """one command of event ev as unit k of the story; returns the unit record (story not yet updated) or None"""
    st = sg.story
    for _ in range(tries):
        tid, f = G.TEMPLATES[ev][int(sg.r.integers(len(G.TEMPLATES[ev])))]
        pid, ptxt = G.PREFIXES[int(sg.r.integers(len(G.PREFIXES)))]
        saved = (st.n, list(st.order), {i: dict(e) for i, e in st.ents.items()})
        sg.reset(ev, k, force, pron)
        try: words, roles = f(sg)
        except NoRef:
            st.n, st.order, st.ents = saved; continue
        ments = {}
        for r, v in roles.items():
            if isinstance(v, dict):
                m = next((m for m in sg.mentions if m[0] is v), None)
                if m is not None: ments[r] = (m[1], m[2], m[0].get("_qual"))
        lab = roles.get("text")
        if lab is not None and st.label_used(lab):
            st.n, st.order, st.ents = saved; continue
        if ev in ("connect",) and roles.get("pairing") and st.ents[ments["source"][0]]["n"] < 2:
            st.n, st.order, st.ents = saved; continue
        if ev == "group" and st.ents[ments["object"][0]]["n"] < 2:
            st.n, st.order, st.ents = saved; continue
        for r, (eid, how, q) in ments.items():                             # the introduction of a created entity names its role
            if how == "create": st.ents[eid]["intro"] = [k, r]
        negated = ev in G.PROHIBITABLE and pid in ("bare", "please", "now", "okay", "tail") and sg.coin(0.12)
        if negated: words = sg.pick(["do not", "don't", "never"]).split() + words
        if pid == "tail": words = words + ["please"]
        elif ptxt: words = ptxt.split() + words
        # apostrophes are avoided in multi-sentence text: the normalizer reads two contraction apostrophes in one input as a quoted
        # label ("let's ... let's" -> one label token); 'lets' and 'dont' are in its contraction table and normalize the same
        surface = " ".join(PRETTY.get(w, w) for w in words).replace("let's", "lets").replace("don't", "dont"); toks, _ = normalize(surface)
        if toks != normalize(" ".join(words))[0]: continue
        quals = [dict(m[2]) for m in ments.values() if m[2]]
        read = strip_qualifiers(toks)
        roles_clean = {r: ({kk: vv for kk, vv in v.items() if kk != "_qual"} if isinstance(v, dict) else v) for r, v in roles.items()}
        frame = {"event": ev, "roles": {r: filler(v) for r, v in roles_clean.items()}, "neg": bool(negated), "speakers": [], "mood": "command"}
        return {"event": ev, "template": f"{ev}.{tid}.{pid}", "prefix": pid, "surface": surface, "tokens": toks, "read_tokens": read, "qualifiers": quals,
                "roles": roles_clean, "mentions": {r: [m[0], m[1]] for r, m in ments.items()}, "neg": bool(negated), "frame": frame,
                "primary": primary(ev, roles, ments)}
    return None


def strip_qualifiers(toks):
    """the editor's reference pre-pass (app/src/script/script.js qualifiers()): '<head> from the <ordinal> section', '<head> from section
    <n>' and 'the <ordinal> <head>' lose their qualifier words before reading (Level 1 has no such role); the constraint is kept aside"""
    out, i = [], 0
    while i < len(toks):
        t = toks[i]
        if t == "from" and i + 3 < len(toks) and toks[i + 1] == "the" and toks[i + 2] in ORD and toks[i + 3] == "section": i += 4; continue
        if t == "from" and i + 2 < len(toks) and toks[i + 1] == "section" and toks[i + 2].isdigit(): i += 3; continue
        if t in ORD and out and out[-1] == "the" and i + 1 < len(toks): i += 1; continue
        out.append(t); i += 1
    return out


def apply(st, u, k):
    """the unit's effect on the story (what the editor will do), and the story's next primary entity"""
    ev, m, r = u["event"], u["mentions"], u["roles"]; obj = m.get("object", [None])[0]; src = m.get("source", [None])[0]
    if u["neg"]:
        for e in (obj, src):
            if e: st.locks.add((ev, e))
        st.prev = obj or src; return
    created = next((eid for eid, how in m.values() if how == "create"), None)
    if created:
        e = st.ents[created]
        if "text" in r: e["label"] = r["text"]
        if "quantity" in r: e["n"] = int(r["quantity"])
        st.prev = created; return
    if ev == "change" and obj:
        e = st.ents[obj]
        for a in ("color", "style"):
            if a in r: e[a] = r[a]
        if "size" in r: e["size"] = r["size"] if r["size"] in G.SIZES and "amount" not in r else None
    elif ev == "resize" and obj: st.ents[obj]["size"] = r.get("size") if r.get("size") in G.SIZES else None
    elif ev == "name" and obj: st.ents[obj]["label"] = r["text"]
    elif ev == "delete" and obj: st.ents[obj]["alive"] = False; st.prev = None; return
    elif ev == "copy" and obj:
        o = st.ents[obj]; c = st.new(o["word"], o["plural"], None, k, "copy")
        for a in ("label", "color", "size", "style", "n"): c[a] = o[a]
        o["nodesc"] = c["nodesc"] = True; st.prev = c["eid"]; return
    elif ev == "group" and obj:
        c = st.new("container", False, None, k, "group"); c["label"] = r.get("text"); c["size"] = None; c["style"] = "dashed"; c["members"] = obj
        st.prev = None; return
    st.prev = obj or src


def choose_event(sg, k):
    st = sg.story
    if not st.alive() or (k == 0 and sg.coin(0.7)): return "create"
    evs = [e for e in W_EV if e not in EXCLUDED]; w = np.array([W_EV[e] * (0.6 if e == "create" and len(st.alive()) > 4 else 1) for e in evs]); w /= w.sum()
    return evs[int(sg.r.choice(len(evs), p=w))]


def story_units(sg, n, k0=0, first_no_pron=False):
    units = []; k = k0; guard = 0
    while len(units) < n and guard < 40 * n:
        guard += 1; ev = choose_event(sg, len(units))
        u = make_unit(sg, ev, k, pron=not (first_no_pron and not units))
        if u is None: continue
        apply(sg.story, u, k); units.append(u); k += 1
    return units


# ------------------------------------------------------------------ assembly into text, with connectives
def cap(s): return s[:1].upper() + s[1:]


def assemble(units, sg, long_sentence=False, allow_before=True, allow_if=True):
    """joins units into one text; returns (surface, joins) with joins[k] = (op, words, attach) for the connective that opens unit k.
    Text order may differ from story order ('before that' swaps a pair); units are returned in text order with their story index."""
    order = list(range(len(units))); swaps = set()
    if allow_before and not long_sentence and len(units) >= 2 and sg.coin(0.25):
        for k in range(len(units) - 1):
            a, b = units[k], units[k + 1]
            created = [eid for eid, how in a["mentions"].values() if how == "create"]
            uses = [(eid, how) for eid, how in b["mentions"].values() if eid in created]
            later_pron = k + 2 < len(units) and any(how == "pronoun" for _, how in units[k + 2]["mentions"].values())
            if created and uses and all(h in ("description", "label") for _, h in uses) and \
               not any(h == "pronoun" for _, h in a["mentions"].values()) and not any(h == "pronoun" for _, h in b["mentions"].values()) and not later_pron \
               and b["event"] not in ("create", "copy", "group") and not b["neg"]:
                order[k], order[k + 1] = k + 1, k; swaps.add(k); break
    texts, joins = [], []
    for pos, si in enumerate(order):
        u = units[si]; s = u["surface"]
        if pos == 0:
            if allow_if and not long_sentence and len(order) >= 2 and u["event"] == "create" and u["prefix"] == "bare" and not u["neg"] and order[1] == 1 \
               and not swaps and sg.coin(0.3):
                w = sg.pick(["if you", "when you"]); texts.append(cap(w) + " " + s); joins.append(("if", w.split(), "next")); continue
            texts.append(cap(s)); joins.append((None, [], None)); continue
        prev_if = joins[-1][0] == "if" and joins[-1][2] == "next"
        if prev_if: texts.append(", " + s); joins.append((None, [","], None)); continue
        if pos - 1 in swaps: texts.append(". Before that, " + s); joins.append(("before", normalize(". Before that,")[0], "prev")); continue
        if long_sentence: j = sg.pick([", ", " and ", ", and ", " and then ", ", then ", ", but "])
        else: j = sg.pick([". ", ". ", ". ", ", and ", " and ", ". Then ", " and then ", ". After that, ", ". Also, ", ", but "])
        jl = j.lower(); op = "then" if "then" in jl or "after" in jl else "but" if "but" in jl else None
        sent = j.startswith(".")
        body = cap(s) if sent and j == ". " else s
        texts.append(j + body)
        jw = normalize(j.strip())[0] if j.strip() else []
        joins.append((op, jw, "prev" if op else None))
    surface = "".join(texts)
    if not long_sentence or sg.coin(0.5): surface += "."
    return surface, joins, order


def build_record(rid, kind, units, sg, long_sentence=False, story=None):
    surface, joins, order = assemble(units, sg, long_sentence)
    toks, info = normalize(surface)
    # gold spans: walk the normalized tokens with each unit's tokens (connective words, comma and period between)
    pos, spans, ok = 0, [], True
    for t, si in enumerate(order):
        u = units[si]; op, jw, att = joins[t]
        for w in jw:
            if pos < len(toks) and toks[pos] == w: pos += 1
            else: ok = False
        n = len(u["tokens"])
        if toks[pos:pos + n] != u["tokens"]: ok = False; break
        spans.append([pos, pos + n]); pos += n
    if not ok: return None
    ends_sentence = []
    for t, (a, b) in enumerate(spans): ends_sentence.append(b < len(toks) and toks[b] == ".")
    gu = []
    for t, si in enumerate(order):
        u = units[si]; a, b = spans[t]
        text = " ".join(u["tokens"] + (["."] if ends_sentence[t] else []))
        op, jw, att = joins[t]
        gu.append({"i": t, "story": si, "start": a, "end": b, "text": text, "event": u["event"], "template": u["template"], "frame": u["frame"],
                   "connective": None if op is None else {"op": op, "words": [w for w in jw if w not in (",", ".")], "attach": (t + 1) if att == "next" else (t - 1)},
                   "mentions": u["mentions"], "primary": u["primary"]})
    circ = gold_circuit(gu, story)
    return {"id": rid, "kind": kind, "surface": surface, "tokens": toks, "info": info, "n_words": len(surface.split()), "units": gu,
            "cuts": [u["start"] for u in gu[1:]], **circ}


def gold_circuit(gu, story, conflict_scope=None):
    """links, discourse, order, cycle and conflicts of units in text order (see the module docstring for the rules)"""
    by_story = {u["story"]: u["i"] for u in gu}; ents = story.ents
    intro_t = lambda eid: (by_story.get(ents[eid]["intro"][0], None), ents[eid]["intro"][1])
    links, edges, discourse = [], set(), []
    for u in gu:
        for r, (eid, how) in u["mentions"].items():
            if eid is None or how == "create": continue
            it, ir = intro_t(eid)
            if it is None: continue
            links.append(f"{u['i']}.{r}=>{it}.{ir}")
            if it != u["i"]: edges.add((it, u["i"]))
    for d in gu:
        if d["event"] == "delete" and not d["frame"]["neg"] and "object" in d["mentions"]:
            eid = d["mentions"]["object"][0]
            for u in gu:
                if u["i"] < d["i"] and any(m[0] == eid for m in u["mentions"].values()): edges.add((u["i"], d["i"]))
    for u in gu:
        c = u["connective"]
        if not c: continue
        if c["op"] in ("then", "but"): a, b = c["attach"], u["i"]
        elif c["op"] == "before": a, b = u["i"], c["attach"]
        elif c["op"] == "if": a, b = u["i"], c["attach"]
        else: continue
        op = "then" if c["op"] == "before" else c["op"]; discourse.append(f"{op}:{a}->{b}"); edges.add((a, b))
    order, cycle = kahn(len(gu), edges)
    conflicts = []
    for x in range(len(gu)):
        for y in range(x + 1, len(gu)):
            ux, uy = gu[x], gu[y]
            if conflict_scope and conflict_scope(ux) != conflict_scope(uy): continue
            if ux["frame"]["neg"] or uy["frame"]["neg"]: continue
            ox, oy = ux["mentions"].get("object", [None])[0], uy["mentions"].get("object", [None])[0]
            if not ox or ox != oy or ux["mentions"]["object"][1] == "create" or uy["mentions"]["object"][1] == "create": continue
            sx, sy = setting(ux), setting(uy)
            for role in sorted(set(sx) & set(sy)):
                if sx[role] != sy[role]: conflicts.append({"a": x, "b": y, "role": role, "values": [sx[role], sy[role]]})
    return {"links": sorted(links), "discourse": sorted(discourse), "order": order, "cycle": cycle, "conflicts": conflicts}


def setting(u):
    ev = u["event"]; fr = u["frame"]["roles"]
    if ev == "place" and u["mentions"].get("object", [None, None])[1] == "create": return {}
    return {r: fr[r][1] for r in SETTING.get(ev, []) if r in fr and fr[r][0] == "word"}


def kahn(n, edges):
    import heapq
    indeg = [0] * n; out = [[] for _ in range(n)]
    for a, b in edges: out[a].append(b); indeg[b] += 1
    h = [i for i in range(n) if indeg[i] == 0]; heapq.heapify(h); order = []
    while h:
        i = heapq.heappop(h); order.append(i)
        for j in out[i]:
            indeg[j] -= 1
            if indeg[j] == 0: heapq.heappush(h, j)
    left = [i for i in range(n) if i not in set(order)]
    return order + left, left


def plant_conflict(sg, units):
    """a later change of the same role of an entity that a change already set (the 'make it red ... make it blue' case)"""
    for u in units:
        if u["event"] == "change" and not u["neg"] and "color" in u["roles"] and u["mentions"].get("object", [None, None])[1] != "create":
            eid = u["mentions"]["object"][0]
            if not sg.story.ents[eid]["alive"]: continue
            k = len(units); old = u["roles"]["color"]
            for _ in range(30):
                v = make_unit(sg, "change", k, force=eid)
                if v and "color" in v["roles"] and v["roles"]["color"] != old: apply(sg.story, v, k); units.append(v); return True
            return False
    return False


def build(out, n, n_long, seed):
    rng = np.random.default_rng(seed); recs = []; i = 0
    while len(recs) < n:
        st = Story(); sg = StoryGen(rng, G.LABELS_TRAIN, G.NUMS_TRAIN, st)
        units = story_units(sg, int(rng.integers(2, 7)))
        if len(units) < 2: continue
        if sg.coin(0.12): plant_conflict(sg, units)
        r = build_record(f"p{len(recs):04d}", "paragraph", units, sg, story=st)
        if r is None: continue
        if sg.coin(0.08) and len(r["units"]) >= 2: r = make_cycle(r, st)
        if r: recs.append(r)
    m = 0
    while m < n_long:
        st = Story(); sg = StoryGen(rng, G.LABELS_TRAIN, G.NUMS_TRAIN, st)
        units = story_units(sg, int(rng.integers(2, 6)))
        if len(units) < 2: continue
        r = build_record(f"l{m:04d}", "long_sentence", units, sg, long_sentence=True, story=st)
        if r is None or not (10 <= r["n_words"] <= 40): continue
        recs.append(r); m += 1
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w") as f:
        for r in recs: f.write(json.dumps(r, sort_keys=True) + "\n")
    kinds = {w: k for w, k in G.KINDS.items()}
    json.dump({"about": "the diagram world's kinds lexicon (generate.py KINDS), for the segmenter's kind signal in the tests", "kinds": kinds},
              open(os.path.join(os.path.dirname(out), "kinds.json"), "w"), indent=0, sort_keys=True)
    nc = sum(1 for r in recs if r["conflicts"]); ny = sum(1 for r in recs if r["cycle"]); nb = sum(1 for r in recs if any(u["connective"] and u["connective"]["op"] == "before" for u in r["units"]))
    print(f"{out}: {n} paragraphs, {n_long} long sentences; units {sum(len(r['units']) for r in recs)}; with conflicts {nc}, with cycles {ny}, with 'before that' {nb}")


def make_cycle(r, st):
    """turn the first 'unit k uses what unit k-1 created' (by description or label) into 'before that' on unit k: the text keeps the backward
    reference, the connective orders k before k-1, so the gold has a cycle; the surface is rewritten accordingly"""
    us = r["units"]
    for k in range(1, len(us)):
        a, b = us[k - 1], us[k]
        if b["connective"] is not None or a["connective"] is not None: continue
        created = [eid for eid, how in a["mentions"].values() if how == "create"]
        if not any(eid in created and how in ("description", "label") for eid, how in b["mentions"].values()): continue
        if b["start"] < 1 or r["tokens"][b["start"] - 1] != ".": continue
        toks = r["tokens"][:b["start"]] + ["before", "that", ","] + r["tokens"][b["start"]:]
        shift = 3; nu = []
        for u in us:
            u = dict(u)
            if u["i"] >= k: u["start"] += shift; u["end"] += shift
            nu.append(u)
        nu[k]["connective"] = {"op": "before", "words": ["before", "that"], "attach": k - 1}
        rr = dict(r); rr["tokens"] = toks; rr["units"] = nu; rr["cuts"] = [u["start"] for u in nu[1:]]
        rr["surface"] = " ".join(toks); rr["planted"] = "cycle"
        if normalize(rr["surface"])[0] != toks: return r
        rr.update(gold_circuit(nu, st)); rr["info"] = normalize(rr["surface"])[1]
        if not rr["cycle"]: return r
        return rr
    return r


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(HERE, "..", "..", "data", "diagram", "eval", "paragraphs.jsonl"))
    ap.add_argument("--n", type=int, default=400); ap.add_argument("--n_long", type=int, default=200); ap.add_argument("--seed", type=int, default=0)
    a = ap.parse_args(); build(os.path.normpath(a.out), a.n, a.n_long, a.seed)
