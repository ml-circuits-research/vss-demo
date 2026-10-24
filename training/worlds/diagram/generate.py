"""generate.py: the diagram world at Level 1 (specification sections 3 and 4.1): the legend, the kinds lexicon, and sentences with their
gold SOP wires, written as a world folder that `sop check` validates and `sop train` trains.

A command is composed from an action, its roles and their fillers, realised through a TEMPLATE of that action and a PREFIX family
(bare, please, could you, can you, would you, I want you to, I need you to, let's, now, okay so, and a trailing 'please'), then normalized
by normalize.py exactly as the editor will normalize what the user types or says. Each top-level wire carries _template =
'<event>.<template id>.<prefix id>', the formulation signature. Held-out formulations are whole (template, prefix) COMBINATIONS whose
template and prefix both occur elsewhere in training (so that every role cue is seen; rule 29 of the paper's protocol, applied to
formulations); they are named in split_hints.json. New identities: a pool of labels and of numbers never used in training.

Level 1 (spec Table 5): one command per sentence; components with one attribute (colour, size or style, possibly negated), a determiner
and a label; prohibitions (not around the event); region, relative and computed placement (amount, unit, fraction, anchor, direction);
layouts; grouping and naming; pairing over sets; no nesting (no reporting operator, depth 0).
Run: python3 generate.py --out ../../worlds/diagram [--n 30000] [--n_eval 400] [--seed 0]"""
import argparse, collections, datetime, hashlib, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); TOOL = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(HERE))), "tool")
sys.path.insert(0, TOOL); sys.path.insert(0, HERE)
import numpy as np
from sop import soplang
from sop.legend import sha256_file
from normalize import normalize

# ------------------------------------------------------------------ vocabulary (spec Tables 2-4, Level 1)
COMPONENTS = {   # singular -> plural; the kind is COMPONENT for both (the resolver maps plurals)
    "box": "boxes", "process": "processes", "step": "steps", "task": "tasks", "decision": "decisions", "diamond": "diamonds",
    "start": "starts", "end": "ends", "database": "databases", "store": "stores", "cache": "caches", "queue": "queues",
    "document": "documents", "file": "files", "report": "reports", "user": "users", "actor": "actors", "customer": "customers",
    "service": "services", "server": "servers", "api": "apis", "gateway": "gateways", "client": "clients", "cloud": "clouds",
    "group": "groups", "container": "containers", "lane": "lanes", "note": "notes", "comment": "comments", "textbox": "textboxes",
    "title": "titles", "caption": "captions", "circle": "circles", "ellipse": "ellipses", "square": "squares", "rectangle": "rectangles",
    "triangle": "triangles", "star": "stars", "hexagon": "hexagons", "line": "lines", "arrow": "arrows", "connector": "connectors",
    "shape": "shapes", "component": "components", "element": "elements", "item": "items", "thing": "things"}
NODE_HEADS = [c for c in COMPONENTS if c not in ("line", "arrow", "connector", "group", "container", "lane")]
EDGE_HEADS = ["line", "arrow", "connector"]
COLORS = ["red", "orange", "yellow", "green", "teal", "blue", "purple", "pink", "brown", "gray", "black", "white"]
SIZES = ["tiny", "small", "medium", "large", "huge"]
SIZE_CHANGE = ["bigger", "smaller"]
STYLES = ["solid", "dashed", "dotted", "thick", "thin"]
RELATIONS = ["left_of", "right_of", "above", "below", "next_to", "inside"]
REGIONS = ["top", "bottom", "center", "top_left", "top_right", "bottom_left", "bottom_right", "left_side", "right_side"]
ANCHORS = ["right_edge", "left_edge", "top_edge", "bottom_edge"]
DIRECTIONS = ["up", "down", "left", "right"]
AXES = ["horizontally", "vertically"]
LAYOUTS = ["row", "column", "grid", "tree", "circle", "flow_lr", "flow_td"]
FRACTIONS = ["half", "third", "quarter"]
UNITS = ["px", "percent"]
PAIRINGS = ["to_next", "in_chain"]
ZOOM = ["in", "out"]
LABELS_TRAIN = ["orders", "payments", "invoices", "billing", "shipping", "inventory", "catalog", "accounts", "sessions", "reports_db", "alpha", "beta",
                "gamma", "delta", "epsilon", "omega", "anna", "paul", "maria", "peter", "elena", "tom", "sara", "mark", "checkout", "login", "signup",
                "search", "cart", "profile", "settings", "admin", "frontend", "backend", "worker", "scheduler", "mailer", "logger", "metrics", "auth",
                "ledger", "warehouse", "supplier", "partner", "kafka", "redis", "postgres", "nginx", "storage", "archive", "pricing", "refunds",
                "approval", "review", "draft", "final", "pending", "done"]
LABELS_NEW = ["notifications", "analytics", "payroll", "routing", "tracking", "recommendations", "ingest", "gamma_ray", "zeta", "theta",
              "victor", "irina", "dashboard", "registry", "vault", "broker", "crawler", "indexer", "returns", "loyalty"]
NUMS_TRAIN = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 100, 120, 150, 200]
NUMS_NEW = [35, 45, 90, 250]
QUANT_TRAIN = [2, 3, 4, 5, 6]
NUM_WORDS = {2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 10: "ten", 20: "twenty", 50: "fifty"}

EVENTS = {   # event id -> verbs (base forms; the predicate role reads the verb's identity through this table)
    "create": ["draw", "add", "create", "insert", "sketch"], "place": ["put", "place"], "delete": ["delete", "remove", "erase"],
    "move": ["move", "shift", "drag", "push", "slide"], "change": ["make", "turn", "paint", "fill", "set", "change"],
    "resize": ["resize", "enlarge", "shrink", "grow", "scale"], "connect": ["connect", "link", "join", "attach"],
    "name": ["name", "call", "rename", "label"], "copy": ["copy", "duplicate", "clone"], "group": ["group", "wrap"],
    "ungroup": ["ungroup"], "arrange": ["arrange", "organize", "tidy"], "align": ["align"], "distribute": ["distribute", "space"],
    "front": ["bring"], "back": ["send"], "zoom": ["zoom"], "undo": ["undo"], "redo": ["redo"], "clear": ["clear"]}
ROLES = [("object", "what is acted on or created?"), ("color", "to which colour?"), ("size", "to which size?"), ("style", "with which line style?"),
         ("text", "with which label?"), ("relation", "where, relative to what?"), ("landmark", "relative to which component?"),
         ("region", "where on the canvas?"), ("anchor", "towards which edge?"), ("fraction", "what part of the way?"), ("amount", "how much?"),
         ("unit", "in what unit?"), ("direction", "in which direction?"), ("axis", "along which axis?"), ("layout", "in which arrangement?"),
         ("pairing", "connected how?"), ("source", "from what?"), ("target", "to what?"), ("quantity", "how many?")]

FUNCTION_WORDS = ["a", "an", "the", "all", "every", "each", "this", "that", "these", "those", "any", "to", "of", "in", "on", "at", "by", "from",
                  "with", "into", "as", "and", "it", "them", "please", "can", "could", "would", "you", "i", "want", "need", "lets", "now",
                  "okay", "so", "do", "not", "never", "is", "are", "color", "flow", "together", "apart", "canvas", "everything", "screen", "front", "back",
                  "evenly", ",", "."] + ["called", "named", "labelled", "titled"]
KINDS = {}
for c, pl in COMPONENTS.items(): KINDS[c] = "COMPONENT"; KINDS[pl] = "COMPONENT"
for w in COLORS: KINDS[w] = "COLOR"
for w in SIZES + SIZE_CHANGE: KINDS[w] = "SIZE"
for w in STYLES: KINDS[w] = "STYLE"
for w in RELATIONS: KINDS[w] = "REL"
for w in REGIONS: KINDS[w] = "REGION"
for w in ANCHORS: KINDS[w] = "ANCHOR"
for w in DIRECTIONS: KINDS[w] = "DIR"
for w in AXES: KINDS[w] = "AXIS"
for w in LAYOUTS: KINDS[w] = "LAYOUT"
for w in FRACTIONS: KINDS[w] = "FRACTION"
for w in UNITS: KINDS[w] = "UNIT"
for w in PAIRINGS: KINDS[w] = "PAIR"
for w in LABELS_TRAIN + LABELS_NEW: KINDS.setdefault(w, "LABEL")
for vs in EVENTS.values():
    for v in vs: KINDS[v] = "VERB"
for w in FUNCTION_WORDS:
    if w not in KINDS: KINDS[w] = w                      # function words are their own kind (as the paper's worlds)
for w in ["called", "named", "labelled", "titled"]: KINDS[w] = "INTRO"
for w in ["a", "an"]: KINDS[w] = "a"
for w in ["all", "every", "each", "any", "both"]: KINDS[w] = "QUANT"
for w in ["this", "that", "these", "those"]: KINDS[w] = "DEM"
for w in ["it", "them"]: KINDS[w] = "PRON"
for w in ["please", "can", "could", "would", "you", "i", "want", "need", "lets", "now", "okay", "so",
          "um", "uh", "hey", "just", "quickly", "kindly", "maybe", "also", "go", "ahead", "thanks", "thank", "we", "me", "us", "should", "will", "like", "there", "here"]: KINDS[w] = "FILLER"
# words that paraphrases bring and that the templates do not use: given a kind here so that they are placed, not unknown (spec 4.2)
for w in ["do", "not", "never"]: KINDS[w] = w
KINDS["everything"] = "PRON"; KINDS["canvas"] = "COMPONENT"; KINDS["screen"] = "COMPONENT"
# yes / no are labels (branch labels on connectors are a Level 2 role); 'in' is both a preposition and a zoom direction: zoom in/out use
# the tokens 'in' / 'out' as DIR only after 'zoom' -> to keep one kind per token, zoom directions are written zoom_in / zoom_out below.
KINDS["in"] = "in"; KINDS["zoom_in"] = "DIR"; KINDS["zoom_out"] = "DIR"; KINDS["group"] = "VERB"   # "group" is the verb; containers are called container / lane

PREFIXES = [("bare", ""), ("please", "please"), ("could", "could you"), ("can", "can you"), ("would", "would you"), ("want", "i want you to"),
            ("need", "i need you to"), ("lets", "let's"), ("now", "now"), ("okay", "okay so"), ("tail", "")]   # 'tail' = trailing 'please'


class Gen:
    def __init__(self, rng, labels, nums):
        self.r, self.labels, self.nums = rng, labels, nums
    def pick(self, xs): return xs[int(self.r.integers(len(xs)))]
    def coin(self, p=0.5): return self.r.random() < p
    def num_surface(self, n):
        return NUM_WORDS[n] if n in NUM_WORDS and self.coin(0.4) else str(n)

    # entity: returns (surface words, wire builder, filler words used)
    def entity(self, det_choices=("the",), heads=None, attr_p=0.5, label_p=0.15, neg_p=0.08, plural=False, allow_label_head=True, pron_p=0.0):
        heads = [h for h in (heads or NODE_HEADS) if h != "group"]
        if pron_p and self.coin(pron_p):                                  # "it" / "them": resolved by the executor rule (spec 10.3)
            p = "them" if plural else "it"; return [p], {"head": p}
        if allow_label_head and self.coin(label_p):                       # a component referred to by its label: "orders", "the orders box"
            lab = self.pick(self.labels)
            return [lab], {"head": lab}
        det = self.pick(list(det_choices)) if det_choices else None
        if det in ("every", "each"): plural = False
        h = self.pick(heads); hw = COMPONENTS[h] if plural else h
        words, spec = [], {"head": hw}
        if det: words.append(det); spec["det"] = det
        if det == "all" and self.coin(0.4): words.append("the")
        if det in ("a", "an") and plural: words.pop(); spec.pop("det", None)
        attr = None
        if self.coin(attr_p) and not (self.coin(neg_p)):
            kind = self.pick(["color", "color", "size", "style"])
            attr = self.pick(COLORS if kind == "color" else SIZES if kind == "size" else STYLES); words.append(attr); spec["attr"] = attr
        words.append(hw)
        if spec.get("det") in ("a",) and words[0] == "a" and words[1][0] in "aeiou": words[0] = "an"; spec["det"] = "an"
        if self.coin(neg_p) and "attr" not in spec:                       # "the boxes that are not blue"
            a = self.pick(COLORS); words += ["that", "is" if not plural else "are", "not", a]; spec["negattr"] = a
        return words, spec

    def loc(self, allow_amount=True):
        """placement: region | relation + landmark (+ amount unit); returns (words, roles dict)"""
        k = self.r.random()
        if k < 0.4:
            reg = self.pick(REGIONS); pre = {"top": "at the", "bottom": "at the", "center": "in the", "left_side": "on the", "right_side": "on the"}.get(reg, "in the")
            return pre.split() + [reg], {"region": reg}
        rel = self.pick(RELATIONS); lw, ls = self.entity(det_choices=("the",), attr_p=0.3, neg_p=0)
        roles = {"relation": rel, "landmark": ls}; words = []
        if allow_amount and rel in ("left_of", "right_of", "above", "below") and self.coin(0.35):
            n = self.pick(self.nums); u = self.pick(["px", "px", "pixels"]); words += [self.num_surface(n), u]; roles["amount"] = str(n); roles["unit"] = "px"
        return words + [rel.replace("_", " ") if rel in ("left_of", "right_of", "next_to") else rel] + lw, roles


def wires_for(ev, roles, negated, text, template, ids):
    """the SOP wires of one command: [not ->] event with role lines; entities as entity wires; negated attributes as not wires"""
    out = []; top = None
    if negated: top = soplang.Wire(next(ids), "not"); out.append(top)
    w = soplang.Wire(next(ids), ev); out.append(w)
    if top is not None: top.set("scope", ("ref", w.id))
    later = []
    for r, _ in ROLES:
        if r not in roles: continue
        v = roles[r]
        if isinstance(v, dict):
            en = soplang.Wire(next(ids), "entity"); en.set("head", v["head"])
            if v.get("attr"): en.set("attr", v["attr"])
            if v.get("negattr"):
                nw = soplang.Wire(next(ids), "not"); nw.set("scope", v["negattr"]); en.set("attr", ("ref", nw.id)); later += [en, nw]
            else: later.append(en)
            if v.get("det") and v["det"] != "the": en.set("det", v["det"])
            elif v.get("det") == "the": en.set("det", "the")
            w.set(r, ("ref", en.id))
        else: w.set(r, str(v))
    first = out[0]
    first.lines = [soplang.Line("_text", text), soplang.Line("_source", "generator"), soplang.Line("_template", template), soplang.Line("_mood", "command")] + first.lines
    return out + later


# ------------------------------------------------------------------ templates per event: (template id, function(g) -> (words, roles, negated))
def T(event):
    def deco(f): TEMPLATES[event].append((f.__name__, f)); return f
    return deco
TEMPLATES = collections.defaultdict(list)

@T("create")
def c_obj(g):
    w, s = g.entity(det_choices=("a",), allow_label_head=False); return [g.pick(EVENTS["create"])] + w, {"object": s}
@T("create")
def c_obj_loc(g):
    w, s = g.entity(det_choices=("a",), allow_label_head=False); lw, lr = g.loc(); return [g.pick(EVENTS["create"])] + w + lw, {"object": s, **lr}
@T("create")
def c_loc_obj(g):
    w, s = g.entity(det_choices=("a",), allow_label_head=False); lw, lr = g.loc(allow_amount=False); return lw + [",", g.pick(EVENTS["create"])] + w, {"object": s, **lr}
@T("create")
def c_obj_called(g):
    w, s = g.entity(det_choices=("a",), allow_label_head=False, neg_p=0); lab = g.pick(g.labels)
    return [g.pick(EVENTS["create"])] + w + [g.pick(["called", "named", "labelled"]), lab], {"object": s, "text": lab}
@T("create")
def c_obj_called_loc(g):
    w, s = g.entity(det_choices=("a",), allow_label_head=False, neg_p=0); lab = g.pick(g.labels); lw, lr = g.loc()
    return [g.pick(EVENTS["create"])] + w + [g.pick(["called", "named"]), lab] + lw, {"object": s, "text": lab, **lr}
@T("create")
def c_quantity(g):
    q = g.pick(QUANT_TRAIN); w, s = g.entity(det_choices=(), plural=True, allow_label_head=False, neg_p=0)
    return [g.pick(EVENTS["create"]), g.num_surface(q)] + w, {"object": s, "quantity": str(q)}

@T("place")
def p_obj_loc(g):
    w, s = g.entity(det_choices=("a", "the"), allow_label_head=True); lw, lr = g.loc(); return [g.pick(EVENTS["place"])] + w + lw, {"object": s, **lr}

@T("delete")
def d_obj(g):
    w, s = g.entity(det_choices=("the", "the", "this", "that"), pron_p=0.08); return [g.pick(EVENTS["delete"])] + w, {"object": s}
@T("delete")
def d_all(g):
    w, s = g.entity(det_choices=("all", "every", "all", "the"), plural=True, neg_p=0.25, allow_label_head=False)
    return [g.pick(EVENTS["delete"])] + w, {"object": s}

@T("move")
def m_loc(g):
    w, s = g.entity(pron_p=0.08); lw, lr = g.loc(); return [g.pick(EVENTS["move"])] + w + lw, {"object": s, **lr}
@T("move")
def m_dir(g):
    w, s = g.entity(); d = g.pick(DIRECTIONS); n = g.pick(g.nums)
    if g.coin(0.5): return [g.pick(EVENTS["move"])] + w + [g.num_surface(n), g.pick(["px", "pixels"]), d], {"object": s, "amount": str(n), "unit": "px", "direction": d}
    return [g.pick(EVENTS["move"])] + w + ["to", "the", d] if d in ("left", "right") else [g.pick(EVENTS["move"])] + w + [d], {"object": s, "direction": d}
@T("move")
def m_fraction(g):
    w, s = g.entity(); f = g.pick(FRACTIONS); a = g.pick(ANCHORS)
    fw = {"half": "halfway", "third": "a third of the way", "quarter": "a quarter of the way"}[f].split()
    return [g.pick(EVENTS["move"])] + w + fw + ["to", "the", a.replace("_", " ")], {"object": s, "fraction": f, "anchor": a}
@T("move")
def m_anchor(g):
    w, s = g.entity(); a = g.pick(ANCHORS); return [g.pick(EVENTS["move"])] + w + ["to", "the", a.replace("_", " ")], {"object": s, "anchor": a}

@T("change")
def ch_color(g):
    w, s = g.entity(attr_p=0.2, pron_p=0.08); c = g.pick(COLORS); v = g.pick(["make", "turn", "paint"])
    return [v] + w + [c], {"object": s, "color": c}
@T("change")
def ch_style(g):
    w, s = g.entity(heads=EDGE_HEADS + NODE_HEADS[:6], attr_p=0.2); st = g.pick(STYLES); return ["make"] + w + [st], {"object": s, "style": st}
@T("change")
def ch_set_color(g):
    w, s = g.entity(attr_p=0.2); c = g.pick(COLORS); return [g.pick(["set", "change"]), "the", "color", "of"] + w + ["to", c], {"object": s, "color": c}

@T("change")
def ch_size(g):
    w, s = g.entity(attr_p=0.3, pron_p=0.08); sz = g.pick(SIZE_CHANGE + ["large", "small", "huge", "tiny"]); return ["make"] + w + [sz], {"object": s, "size": sz}
@T("change")
def ch_percent(g):
    w, s = g.entity(attr_p=0.3, pron_p=0.08); n = g.pick(g.nums); sz = g.pick(SIZE_CHANGE)
    return ["make"] + w + [g.num_surface(n), g.pick(["percent", "%"]), sz], {"object": s, "amount": str(n), "unit": "percent", "size": sz}
@T("resize")
def r_size(g):
    w, s = g.entity(attr_p=0.3); sz = g.pick(SIZES); return [g.pick(["resize", "scale"])] + w + ["to", sz], {"object": s, "size": sz}
@T("resize")
def r_verb(g):
    w, s = g.entity(attr_p=0.3); v = g.pick(["enlarge", "shrink", "grow"]); return [v] + w, {"object": s}

@T("connect")
def k_pair(g):
    a, sa = g.entity(attr_p=0.3); b, sb = g.entity(attr_p=0.3); return [g.pick(EVENTS["connect"])] + a + ["to"] + b, {"source": sa, "target": sb}
@T("connect")
def k_pair_with(g):
    a, sa = g.entity(attr_p=0.2, neg_p=0); b, sb = g.entity(attr_p=0.2, neg_p=0); e, se = g.entity(det_choices=("a",), heads=EDGE_HEADS, attr_p=0.7, neg_p=0, allow_label_head=False)
    return [g.pick(EVENTS["connect"])] + a + ["to"] + b + ["with"] + e, {"source": sa, "target": sb, "object": se}
@T("connect")
def k_draw_arrow(g):
    e, se = g.entity(det_choices=("a",), heads=EDGE_HEADS, attr_p=0.5, neg_p=0, allow_label_head=False); a, sa = g.entity(attr_p=0.2, neg_p=0); b, sb = g.entity(attr_p=0.2, neg_p=0)
    return ["connect"] + a + ["and"] + b + ["with"] + e, {"source": sa, "target": sb, "object": se}
@T("connect")
def k_pairing(g):
    w, s = g.entity(det_choices=("each", "every"), attr_p=0.3, neg_p=0, allow_label_head=False); p = g.pick(PAIRINGS)
    pw = {"to_next": g.pick(["to the next", "to the next one"]), "in_chain": g.pick(["in a chain", "one after the other"])}[p].split()
    if p == "in_chain": w, s = g.entity(det_choices=("all", "the"), plural=True, attr_p=0.3, neg_p=0, allow_label_head=False)
    return [g.pick(EVENTS["connect"])] + w + pw, {"source": s, "pairing": p}

@T("name")
def n_call(g):
    w, s = g.entity(label_p=0, pron_p=0.08); lab = g.pick(g.labels); return [g.pick(["call", "name", "rename", "label"])] + w + [lab], {"object": s, "text": lab}
@T("name")
def n_rename_to(g):
    w, s = g.entity(label_p=0.3); lab = g.pick(g.labels); return ["rename"] + w + ["to", lab], {"object": s, "text": lab}

@T("copy")
def cp_obj(g):
    w, s = g.entity(); return [g.pick(EVENTS["copy"])] + w, {"object": s}
@T("copy")
def cp_loc(g):
    w, s = g.entity(); lw, lr = g.loc(); return [g.pick(EVENTS["copy"])] + w + lw, {"object": s, **lr}

@T("group")
def g_called(g):
    w, s = g.entity(det_choices=("the", "all", "these"), plural=True, attr_p=0.4, neg_p=0, allow_label_head=False); lab = g.pick(g.labels)
    return ["group"] + w + ["as", lab] if g.coin(0.3) else ["group"] + w + ["into", "a", "container", "called", lab], {"object": s, "text": lab}
@T("group")
def g_plain(g):
    w, s = g.entity(det_choices=("the", "all", "these"), plural=True, attr_p=0.4, neg_p=0, allow_label_head=False); return [g.pick(["group", "wrap"])] + w, {"object": s}

@T("ungroup")
def ug(g):
    w, s = g.entity(det_choices=("the", "this"), heads=["container", "lane"], attr_p=0.2, neg_p=0); return ["ungroup"] + w, {"object": s}

@T("arrange")
def a_layout(g):
    lay = g.pick(LAYOUTS); lw = {"row": ["in", "a", "row"], "column": ["in", "a", "column"], "grid": ["in", "a", "grid"], "tree": ["as", "a", "tree"],
                                  "circle": ["in", "a", "circle"], "flow_lr": ["as", "a", "flow", "from", "left", "to", "right"], "flow_td": ["as", "a", "flow", "from", "top", "to", "bottom"]}[lay]
    if g.coin(0.4): return [g.pick(["arrange", "organize", "tidy"]), "everything"] + lw, {"object": {"head": "everything"}, "layout": lay}
    w, s = g.entity(det_choices=("the", "all"), plural=True, attr_p=0.3, neg_p=0, allow_label_head=False); return [g.pick(["arrange", "organize"])] + w + lw, {"object": s, "layout": lay}

@T("align")
def al(g):
    w, s = g.entity(det_choices=("the", "all"), plural=True, attr_p=0.3, neg_p=0, allow_label_head=False)
    if g.coin(0.5): ax = g.pick(AXES); return ["align"] + w + [ax], {"object": s, "axis": ax}
    d = g.pick(["left", "right", "up", "down"]); return ["align"] + w + (["to", "the", d] if d in ("left", "right") else [d]), {"object": s, "direction": d}

@T("distribute")
def ds(g):
    w, s = g.entity(det_choices=("the", "all"), plural=True, attr_p=0.3, neg_p=0, allow_label_head=False)
    if g.coin(0.5): n = g.pick(g.nums); return ["space"] + w + [g.num_surface(n), "px", "apart"], {"object": s, "amount": str(n), "unit": "px"}
    ax = g.pick(AXES); return ["distribute"] + w + ["evenly", ax], {"object": s, "axis": ax}

@T("front")
def fr(g):
    w, s = g.entity(); return ["bring"] + w + ["to", "front"], {"object": s}
@T("back")
def bk(g):
    w, s = g.entity(); return ["send"] + w + ["to", "back"], {"object": s}
@T("zoom")
def zm(g):
    d = g.pick(["zoom_in", "zoom_out"]); return ["zoom", d.split("_")[1]], {"direction": d}
@T("undo")
def ud(g): return ["undo"], {}
@T("redo")
def rd(g): return ["redo"], {}
@T("clear")
def cl(g): return ["clear", "the", "canvas"], {"object": {"head": "canvas", "det": "the"}}

PROHIBITABLE = {"delete", "move", "change", "resize", "connect", "copy", "group", "name"}


def realise(g, ev, tid, f, prefix):
    words, roles = f(g)
    pid, ptxt = prefix
    negated = ev in PROHIBITABLE and pid in ("bare", "please", "now", "okay", "tail") and g.coin(0.12)   # "could you do not ..." is not English
    if negated: words = [g.pick(["do not", "don't", "never"])] + words
    if pid == "tail": words = words + ["please"]
    elif ptxt: words = ptxt.split() + words
    surface = " ".join(words) + (" ." if g.coin(0.5) else "")
    toks, info = normalize(surface)
    text = " ".join(toks)
    return text, roles, negated, f"{ev}.{tid}.{pid}"


def build(out, n, n_eval, seed):
    rng = np.random.default_rng(seed)
    combos = [(ev, tid, f, p) for ev, ts in TEMPLATES.items() for tid, f in ts for p in PREFIXES]
    # held-out formulations: (template, prefix) combinations of templates with >= 4 prefixes left in training; ~12% of combos, by hash
    h = lambda s: int(hashlib.sha256(f"{seed}:{s}".encode()).hexdigest()[:8], 16) / 2 ** 32
    held = {f"{ev}.{tid}.{p[0]}" for ev, tid, f, p in combos if p[0] not in ("bare",) and h(f"{ev}.{tid}.{p[0]}") < 0.12}
    train_combos = [c for c in combos if f"{c[0]}.{c[1]}.{c[3][0]}" not in held]
    held_combos = [c for c in combos if f"{c[0]}.{c[1]}.{c[3][0]}" in held]
    # weights: events roughly as a user would use them (create, connect, move, change most often)
    w_ev = {"create": 6, "connect": 4, "move": 4, "change": 3, "delete": 2, "name": 2, "place": 2, "resize": 2, "group": 1.5, "arrange": 1.5,
            "align": 1, "distribute": 1, "copy": 1, "ungroup": .5, "front": .5, "back": .5, "zoom": .4, "undo": .3, "redo": .2, "clear": .2}
    def draw(cs, k, labels, nums, rs):
        g = Gen(rs, labels, nums); ws = np.array([w_ev[c[0]] / len(TEMPLATES[c[0]]) for c in cs]); ws /= ws.sum(); rows = []
        for _ in range(k):
            ev, tid, f, p = cs[int(rs.choice(len(cs), p=ws))]; rows.append((ev,) + realise(g, ev, tid, f, p))
        return rows
    train = draw(train_combos, n, LABELS_TRAIN, NUMS_TRAIN, np.random.default_rng(200 + seed))
    ev_new = draw(train_combos, 6 * n_eval, LABELS_NEW, NUMS_NEW, np.random.default_rng(900 + seed))
    ev_new = [r for r in ev_new if any(x in LABELS_NEW or x in map(str, NUMS_NEW) for x in r[1].split())][:n_eval]
    ev_form = draw(held_combos, n_eval, LABELS_TRAIN, NUMS_TRAIN, np.random.default_rng(901 + seed))
    # legend, kinds
    legend = {"version": 1, "roles": [{"id": r, "question": q} for r, q in ROLES], "events": [{"id": e, "verbs": vs} for e, vs in EVENTS.items()],
              "operators": ["not"], "moods": ["command"], "kinds": {"source": "lexicon", "lexicon": "kinds.tsv"},
              "values": [{"kind": "NUM", "pattern": "\\d+"}, {"kind": "LABEL", "pattern": "[a-z0-9]+(_[a-z0-9]+)+"}],
              "reader": {"predicate_role": True, "occupancy_marker": True, "definite_dets": ["the"]}}
    wd = os.path.join(out); [os.makedirs(os.path.join(wd, d), exist_ok=True) for d in ("examples", "raw", "audit", "model", "runs", "versions", "requests")]
    lp = os.path.join(wd, "legend.json"); json.dump(legend, open(lp, "w"), indent=1)
    with open(os.path.join(wd, "kinds.tsv"), "w") as f:
        f.write("# word\tkind — the diagram world's categories (GIVEN, rule 20); numbers and multi-part labels by the legend's value patterns\n")
        for w in sorted(KINDS): f.write(f"{w}\t{KINDS[w]}\n")
    sha = sha256_file(lp)
    json.dump({"name": "diagram", "language": "en", "description": "VSS Diagram Editor, Level 1 (vision/VSS_Diagram_Editor_Specification.md, sections 3-4)",
               "created": datetime.date.today().isoformat(), "version": 1, "min_examples": 500, "max_versions_per_run": 3,
               "models": {"pipeline": "claude-haiku-5-5", "annotate": "claude-haiku-5-5", "second_look": "claude-haiku-5-5", "evolve": "claude-opus-5-5"},
               "second_look_escalate": 0.05, "second_look_retrain": 0.05}, open(os.path.join(wd, "world.json"), "w"), indent=1)
    def write(fname, rows):
        doc = soplang.Doc(directives=[("world", "diagram", None), ("legend", sha, None), ("generated", f"training/worlds/diagram/generate.py seed {seed} ({datetime.date.today()})", None)])
        k = 0
        for ev, text, roles, negated, template in rows:
            ids = iter(f"w{k + i}" for i in range(1, 200)); ws = wires_for(ev, roles, negated, text, template, ids); k += len(ws)
            ws[0].lines.insert(1, soplang.Line("_world", "diagram")); doc.wires += ws
        open(os.path.join(wd, "examples", fname), "w").write(soplang.write(doc))
    write("train.sop", train); write("eval_new_identities.sop", ev_new); write("eval_heldout_formulations.sop", ev_form)
    hints = {"heldout_sentence_share": 0.1, "new_identities": LABELS_NEW + [str(x) for x in NUMS_NEW],
             "file_splits": {"examples/eval_new_identities.sop": "new_identities", "examples/eval_heldout_formulations.sop": "heldout_formulations"},
             "template_splits": {"heldout_formulations": sorted(held)},
             "protocol": "diagram world Level 1: one command per sentence, no nesting; held-out formulations = (template, prefix) combinations whose template and prefix both occur in training; new identities = labels and numbers never in training"}
    json.dump(hints, open(os.path.join(wd, "split_hints.json"), "w"), indent=1)
    open(os.path.join(wd, "raw", "sentences.txt"), "w").write("\n".join(r[1] for r in train[:2000]) + "\n")
    if not os.path.exists(os.path.join(wd, "status.json")): json.dump({"label": None, "note": "never trained"}, open(os.path.join(wd, "status.json"), "w"))
    # coverage table (spec step 1 exit check)
    cov = collections.Counter(); ev_count = collections.Counter(); tmpl = collections.Counter()
    for ev, text, roles, negated, template in train:
        ev_count[ev] += 1; tmpl[template.rsplit(".", 1)[0]] += 1
        for r in roles: cov[(ev, r)] += 1
        if negated: cov[(ev, "PROHIBITION")] += 1
    cols = [r for r, _ in ROLES] + ["PROHIBITION"]
    lines = [f"# Coverage of the diagram world, Level 1 (generate.py seed {seed}, {n} training sentences)", "",
             f"Legend {sha}. Templates {sum(len(v) for v in TEMPLATES.values())}, prefixes {len(PREFIXES)}, combinations {len(combos)}, held out {len(held)}.", "",
             "Sentences per event and role (training file):", "", "| event | n | " + " | ".join(cols) + " |", "|---|---|" + "---|" * len(cols)]
    for ev in EVENTS: lines.append(f"| {ev} | {ev_count[ev]} | " + " | ".join(str(cov[(ev, r)]) if cov[(ev, r)] else "" for r in cols) + " |")
    lines += ["", f"Evaluation files: eval_new_identities.sop {len(ev_new)} sentences; eval_heldout_formulations.sop {len(ev_form)} sentences."]
    open(os.path.join(HERE, "COVERAGE.md"), "w").write("\n".join(lines) + "\n")
    print(f"diagram world written to {wd}: train {len(train)}, new identities {len(ev_new)}, held-out formulations {len(ev_form)}; legend {sha[:19]}…; kinds {len(KINDS)} words, {len(set(KINDS.values()))} kinds")
    return wd


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default=os.path.join(TOOL, "worlds", "diagram")); ap.add_argument("--n", type=int, default=30000)
    ap.add_argument("--n_eval", type=int, default=400); ap.add_argument("--seed", type=int, default=0)
    a = ap.parse_args(); build(a.out, a.n, a.n_eval, a.seed)
