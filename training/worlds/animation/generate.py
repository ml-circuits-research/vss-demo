"""generate.py: the animation world (specification section 19.1, 19.5, 19.6): the diagram world's way of composing commands, extended with
the temporal roles of Table 12 (start, duration, speed, easing, repeat, path, traveller, trigger), the temporal relations between units
(after, before, with, while, when, then) read as closed values of one role (`tempo`) with the other unit named by an entity (`ref`), the
actions that only make sense in time (appear, disappear, fade in, fade out, blink, pulse, rotate, travel, highlight, wait), the named motions
of characters (walk, jump, wave, turn, nod, shake, bounce, grow, shrink), the player commands (play, pause, rewind, loop, slow down, speed
up), the per-frame prohibitions of 19.4 (never let anything overlap X, never let the dot leave the arrows, never hide the title) and the
questions about the film of 19.6 (when does X appear, how long does X take, what moves after X, where is the dot at 3 s).

Written as a world folder that `sop check` validates and `sop train` trains, exactly as training/worlds/diagram/generate.py: a command is
composed from an action template, an optional START phrase, an optional DURATION phrase, an optional MODIFIER (speed, easing or repeat) and a
PREFIX family; the formulation signature `_template = <event>.<template>+<start>+<duration>+<modifier>.<prefix>` names the combination.
Held-out formulations are whole combinations whose parts all occur elsewhere in training (rule 29 of the paper's protocol, applied to
formulations), named in split_hints.json; new identities are labels and numbers never used in training.

Level 1 of the decoder (spec Table 5): one event per sentence, fillers that are words or entities, an optional `not` around the event, no
nesting. Design choices, stated:
- A temporal relation to another unit is two roles of ONE wire: `tempo` (after | before | with | while | when | then) and `ref` (the entity
  whose unit is meant: "after the box" = after the latest unit acting on the box); a delay is `offset` ("two seconds after the box"). The
  spec's `@w3 then` operator wires between units are the circuit's (Section 15.2, app/src/segment/), built from these roles by the segmenter;
  they are not part of a single sentence.
- A path longer than one hop ("from the user to the gateway, then to the API") is a sequence of travel units (one hop or two with `via`),
  composed by the circuit; a single sentence carries source, via, target, or a connector as `path`.
- Subordinate events are not verbs here: "when the request arrives" reads `trigger=arrives` (TRIGGER kind: arrives, appears, disappears,
  finishes, moving, blinking, traveling), so every sentence has one verb.
- Time units are `unit` (s | ms) for all the time numbers of the sentence (start, offset, duration: one time unit per sentence, as people
  say it); distances are `distance` (px) and angles `angle` (degrees), with 'px' and 'degrees' as cue words, not fillers.
- "make X blink": 'make' is a CAUSE word (not a verb) in this world; colour changes use paint / color.
- Questions carry `_mood=question` and `_asked=<role>`; their verbs appear in base form ("when does the box appear") or as the event's
  third-person / participle form given in the lexicon's lemma column ("what blinks after the arrow", "what is highlighted at 3 s").

Run: python3 generate.py --out <worlds>/animation [--n 30000] [--n_eval 400] [--seed 0]"""
import argparse, collections, datetime, hashlib, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(os.path.dirname(os.path.dirname(HERE))); TOOL = os.path.join(REPO, "tool")
sys.path.insert(0, TOOL); sys.path.insert(0, HERE)
import numpy as np
from sop import soplang
from sop.legend import sha256_file
from normalize import normalize

# ------------------------------------------------------------------ vocabulary
COMPONENTS = {
    "box": "boxes", "process": "processes", "step": "steps", "task": "tasks", "decision": "decisions", "database": "databases", "store": "stores",
    "cache": "caches", "queue": "queues", "document": "documents", "file": "files", "report": "reports", "user": "users", "customer": "customers",
    "service": "services", "server": "servers", "api": "apis", "gateway": "gateways", "client": "clients", "cloud": "clouds", "note": "notes",
    "title": "titles", "caption": "captions", "circle": "circles", "square": "squares", "triangle": "triangles", "star": "stars", "hexagon": "hexagons",
    "line": "lines", "arrow": "arrows", "connector": "connectors", "shape": "shapes", "component": "components", "element": "elements",
    # characters (spec 19.5) and travellers (Table 12: tokens created for the animation)
    "robot": "robots", "figure": "figures", "person": "people", "car": "cars",
    "dot": "dots", "envelope": "envelopes", "packet": "packets", "token": "tokens", "request": "requests", "answer": "answers", "message": "messages", "ball": "balls"}
EDGE_HEADS = ["line", "arrow", "connector"]
CHARACTERS = ["robot", "figure", "person", "car"]
TRAVELLERS = ["dot", "envelope", "packet", "token", "request", "answer", "message", "ball"]
NODE_HEADS = [c for c in COMPONENTS if c not in EDGE_HEADS + CHARACTERS + TRAVELLERS]
COLORS = ["red", "orange", "yellow", "green", "teal", "blue", "purple", "pink", "brown", "gray", "black", "white"]
RELATIONS = ["left_of", "right_of", "above", "below", "next_to", "inside"]
REGIONS = ["top", "bottom", "center", "top_left", "top_right", "bottom_left", "bottom_right", "left_side", "right_side"]
DIRECTIONS = ["up", "down", "left", "right"]
TEMPO = ["after", "before", "with", "while", "when", "then"]
TRIGGERS = ["arrives", "appears", "disappears", "finishes"]
WHILE_TRIGGERS = ["moving", "blinking", "traveling"]
DUR_CLOSED = ["quickly", "slowly", "instantly"]
SPEEDS = ["slow", "normal", "fast", "slower", "faster", "twice_as_fast", "half_as_fast"]
EASINGS = ["smoothly", "linearly", "bouncing", "suddenly"]
REPEAT_CLOSED = ["forever", "once"]
UNITS = ["s", "ms"]
LABELS_TRAIN = ["orders", "payments", "invoices", "billing", "shipping", "inventory", "catalog", "accounts", "sessions", "alpha", "beta", "gamma",
                "delta", "omega", "anna", "paul", "maria", "peter", "checkout", "login", "search", "cart", "profile", "frontend", "backend", "worker",
                "scheduler", "mailer", "auth", "ledger", "warehouse", "kafka", "redis", "postgres", "nginx", "storage", "archive", "pricing", "review", "done"]
LABELS_NEW = ["notifications", "analytics", "payroll", "routing", "tracking", "ingest", "zeta", "theta", "victor", "irina", "dashboard", "vault", "broker", "crawler"]
SECS_TRAIN = ["1", "2", "3", "4", "5", "10", "0.5", "1.5", "2.5"]
SECS_NEW = ["6", "7", "3.5", "8"]
MS_TRAIN = ["200", "300", "500", "800"]
MS_NEW = ["700", "1200"]
PX_TRAIN = ["20", "40", "50", "100"]
PX_NEW = ["60", "150"]
DEG_TRAIN = ["45", "90", "180", "360"]
DEG_NEW = ["30", "270"]
COUNT_TRAIN = ["2", "3", "4", "5"]
COUNT_NEW = ["6", "7"]
NUM_WORDS = {"2": "two", "3": "three", "4": "four", "5": "five", "10": "ten", "6": "six", "7": "seven", "8": "eight", "20": "twenty", "50": "fifty"}

# events -> verbs (base forms; third-person / participle forms are in the lexicon with their lemma)
EVENTS = {
    "appear": ["appear", "show", "reveal"], "disappear": ["disappear", "hide", "vanish", "remove"], "fade_in": ["fade_in"], "fade_out": ["fade_out"],
    "blink": ["blink", "flash"], "pulse": ["pulse"], "rotate": ["rotate", "spin"], "highlight": ["highlight"], "travel": ["travel", "go", "send", "fly"],
    "move": ["move", "slide", "shift"], "change": ["paint", "color"], "wait": ["wait"],
    "grow": ["grow", "expand"], "shrink": ["shrink"], "walk": ["walk"], "jump": ["jump", "leap"], "wave": ["wave"], "turn": ["turn", "face"],
    "nod": ["nod"], "shake": ["shake", "wiggle"], "bounce": ["bounce"],
    "play": ["play", "run"], "pause": ["pause", "stop", "freeze"], "rewind": ["rewind", "restart"], "loop": ["loop", "repeat"],
    "retime": ["slow_down", "speed_up"], "overlap": ["overlap", "cover"], "leave": ["leave"], "last": ["last", "take"], "locate": ["where"]}
THIRD = {   # surface form -> lemma (lexicon lemma column): declaratives and questions
    "shown": "show", "hidden": "hide", "fades_in": "fade_in", "fades_out": "fade_out", "blinks": "blink", "flashes": "flash", "pulses": "pulse",
    "rotates": "rotate", "spins": "spin", "highlights": "highlight", "highlighted": "highlight", "travels": "travel", "goes": "go", "flies": "fly",
    "moves": "move", "slides": "slide", "grows": "grow", "shrinks": "shrink", "walks": "walk", "jumps": "jump", "waves": "wave", "turns": "turn",
    "nods": "nod", "shakes": "shake", "bounces": "bounce", "painted": "paint"}
ROLES = [("object", "what is animated?"), ("color", "to which colour?"), ("relation", "where, relative to what?"), ("landmark", "relative to which component, or where it arrives?"),
         ("region", "where on the canvas?"), ("direction", "in which direction?"), ("distance", "how far, in px?"), ("angle", "by how many degrees?"),
         ("traveller", "what moves along the path?"), ("source", "from where?"), ("via", "through which component?"), ("target", "to what, or towards what?"),
         ("path", "along what?"), ("start", "when does it begin?"), ("tempo", "in which relation in time to another unit?"),
         ("ref", "relative to which other unit?"), ("offset", "how long before or after it?"), ("trigger", "on what event of the other unit?"),
         ("duration", "how long does it take?"), ("unit", "in which time unit?"), ("per", "per what?"), ("speed", "how fast?"),
         ("easing", "how does it move?"), ("repeat", "how many times?")]
MOTIONS = {"grow", "shrink", "walk", "jump", "wave", "turn", "nod", "shake", "bounce"}
REPEATABLE = {"blink", "pulse", "rotate", "highlight", "jump", "wave", "nod", "shake", "bounce", "grow", "shrink"}
EASABLE = {"move", "travel", "rotate", "fade_in", "fade_out", "grow", "shrink", "walk", "change"}
SPEEDABLE = {"move", "travel", "rotate", "walk", "blink", "pulse", "fade_in", "fade_out", "jump", "bounce", "wave"}

FUNCTION_WORDS = ["a", "an", "the", "all", "every", "each", "this", "that", "to", "of", "in", "on", "at", "by", "from", "into", "as", "and", "it",
                  "them", "is", "are", "does", "do", "not", "never", "let", "anything", "everything", "for", "over", "towards", "along", "via",
                  "through", "times", "px", "degrees", "beginning", "what", "how_long", ",", ".", "?", "animation"]
KINDS = {}
for c, pl in COMPONENTS.items(): KINDS[c] = "COMPONENT"; KINDS[pl] = "COMPONENT"
for w in COLORS: KINDS[w] = "COLOR"
for w in RELATIONS: KINDS[w] = "REL"
for w in REGIONS: KINDS[w] = "REGION"
for w in DIRECTIONS: KINDS[w] = "DIR"
for w in TEMPO: KINDS[w] = "TEMPO"
for w in TRIGGERS + WHILE_TRIGGERS: KINDS[w] = "TRIGGER"
for w in DUR_CLOSED: KINDS[w] = "DUR"
for w in SPEEDS: KINDS[w] = "SPEED"
for w in EASINGS: KINDS[w] = "EASE"
for w in REPEAT_CLOSED: KINDS[w] = "REPEAT"
for w in UNITS: KINDS[w] = "UNIT"
KINDS["per_hop"] = "PER"
for w in LABELS_TRAIN + LABELS_NEW: KINDS.setdefault(w, "LABEL")
for vs in EVENTS.values():
    for v in vs: KINDS[v] = "VERB"
LEMMA = dict(THIRD)
for w in THIRD: KINDS[w] = "VERB"
for w in FUNCTION_WORDS:
    if w not in KINDS: KINDS[w] = w
for w in ["a", "an"]: KINDS[w] = "a"
for w in ["all", "every", "each"]: KINDS[w] = "QUANT"
for w in ["this", "that"]: KINDS[w] = "DEM"
for w in ["it", "them", "everything", "anything"]: KINDS[w] = "PRON"
KINDS["make"] = "CAUSE"; KINDS["let"] = "CAUSE"; KINDS["have"] = "CAUSE"
for w in ["what", "how_long"]: KINDS[w] = "WH"
for w in ["please", "can", "could", "would", "you", "i", "want", "need", "lets", "now", "okay", "so", "um", "just", "also", "actually",
          "instead", "no", "hey", "should", "will", "me", "tell", "know"]: KINDS[w] = "FILLER"
KINDS["animation"] = "COMPONENT"; KINDS["sure"] = "FILLER"
# 'when' is a TEMPO value; the question word is the same token: a question starts with it, so its kind stays TEMPO and the question
# templates below put it first, where no command template does (the reader learns the position). 'where' is the locate event's verb.

PREFIXES = [("bare", ""), ("please", "please"), ("could", "could you"), ("can", "can you"), ("want", "i want you to"), ("lets", "let's"),
            ("now", "now"), ("okay", "okay so"), ("actually", "actually ,"), ("no", "no ,"), ("tail", ""), ("instead", "")]   # tail: 'please'; instead: trailing 'instead'
Q_PREFIXES = [("bare", ""), ("okay", "okay so"), ("hey", "hey ,"), ("now", "now")]


class Gen:
    def __init__(self, rng, new):
        self.r, self.new = rng, new
        self.labels = LABELS_NEW if new else LABELS_TRAIN
        self.secs, self.ms, self.px, self.deg, self.counts = (SECS_NEW, MS_NEW, PX_NEW, DEG_NEW, COUNT_NEW) if new else (SECS_TRAIN, MS_TRAIN, PX_TRAIN, DEG_TRAIN, COUNT_TRAIN)
    def pick(self, xs): return xs[int(self.r.integers(len(xs)))]
    def coin(self, p=0.5): return self.r.random() < p
    def num(self, n): return NUM_WORDS[n] if n in NUM_WORDS and self.coin(0.35) else n
    def entity(self, heads=None, det_choices=("the",), attr_p=0.3, label_p=0.15, pron_p=0.0, plural=False):
        heads = heads or NODE_HEADS
        if pron_p and self.coin(pron_p): p = "them" if plural else "it"; return [p], {"head": p}
        if label_p and self.coin(label_p): lab = self.pick(self.labels); return [lab], {"head": lab}
        det = self.pick(list(det_choices)) if det_choices else None
        h = self.pick(heads); hw = COMPONENTS[h] if plural else h
        words, spec = [], {"head": hw}
        if det: words.append(det); spec["det"] = det
        if self.coin(attr_p): a = self.pick(COLORS); words.append(a); spec["attr"] = a
        words.append(hw)
        if spec.get("det") == "a" and words[1][0] in "aeiou": words[0] = "an"; spec["det"] = "an"
        return words, spec
    def tnum(self):
        """a time number with its unit: (number words, unit surface, number token, unit token)"""
        if self.coin(0.2): n = self.pick(self.ms); return [n], self.pick(["ms", "milliseconds"]), n, "ms"
        n = self.pick(self.secs); return [self.num(n)], self.pick(["seconds", "s", "seconds", "sec"]) if n != "1" else self.pick(["second", "s"]), n, "s"


# ------------------------------------------------------------------ start, duration and modifier phrases: (id, f(g, ev) -> (words, roles, front))
def START(g, ev, sid):
    if sid == "none": return [], {}, False
    if sid in ("at", "after_abs"):
        nw, u, n, ut = g.tnum(); return [sid.split("_")[0]] + nw + [u], {"start": n, "unit": ut}, False
    if sid == "at_front":
        nw, u, n, ut = g.tnum(); return ["at"] + nw + [u, ","], {"start": n, "unit": ut}, True
    if sid in ("after", "before", "after_offset", "before_offset", "after_front"):
        rel = sid.split("_")[0]; w, s = g.entity(heads=NODE_HEADS + EDGE_HEADS, attr_p=0.2); roles = {"tempo": rel, "ref": s}; words = []
        if sid.endswith("offset"): nw, u, n, ut = g.tnum(); words = nw + [u]; roles.update({"offset": n, "unit": ut})
        words += [rel] + w
        return (words + [","], roles, True) if sid == "after_front" else (words, roles, False)
    if sid == "with":
        w, s = g.entity(heads=NODE_HEADS + TRAVELLERS + EDGE_HEADS, attr_p=0.2); return [g.pick(["with", "together with", "at the same time as"])] + w, {"tempo": "with", "ref": s}, False
    if sid == "then": return ["then"], {"tempo": "then"}, True
    if sid == "when":
        w, s = g.entity(heads=TRAVELLERS + NODE_HEADS, attr_p=0.1, label_p=0.05); t = g.pick(TRIGGERS); words = ["when"] + w + [t]; roles = {"tempo": "when", "ref": s, "trigger": t}
        if t == "arrives" and g.coin(0.6):
            lw, ls = g.entity(attr_p=0.1); words += ["at"] + lw; roles["landmark"] = ls
        return words, roles, False
    if sid == "when_front":
        w, s = g.entity(heads=TRAVELLERS, attr_p=0.1, label_p=0); t = g.pick(["arrives", "appears", "finishes"])
        return ["when"] + w + [t, ","], {"tempo": "when", "ref": s, "trigger": t}, True
    if sid == "while":
        w, s = g.entity(heads=TRAVELLERS + NODE_HEADS, attr_p=0.1, label_p=0.05); t = g.pick(WHILE_TRIGGERS)
        return ["while"] + w + ["is", t], {"tempo": "while", "ref": s, "trigger": t}, False
    raise KeyError(sid)
START_IDS = ["none", "at", "after_abs", "at_front", "after", "before", "after_offset", "before_offset", "after_front", "with", "then", "when", "when_front", "while"]


def DURATION(g, ev, did):
    if did == "none": return [], {}
    if did in ("for", "over", "in"):
        nw, u, n, ut = g.tnum(); return [did] + nw + [u], {"duration": n, "unit": ut}
    if did == "closed": d = g.pick(DUR_CLOSED); return [d], {"duration": d}
    if did == "per_hop":
        nw, u, n, ut = g.tnum(); return nw + [u, g.pick(["per hop", "for each hop", "each hop", "a hop"])], {"duration": n, "unit": ut, "per": "per_hop"}
    raise KeyError(did)
DURATION_IDS = ["none", "for", "over", "in", "closed", "per_hop"]


def MODIFIER(g, ev, mid):
    if mid == "none": return [], {}
    if mid == "speed":
        s = g.pick(SPEEDS)
        surface = {"slow": ["at a slow speed", "at slow speed", "slow"], "normal": ["at normal speed"], "fast": ["at fast speed", "fast"]}.get(s, [s.replace("_", " ")])
        return [g.pick(surface)], {"speed": s}
    if mid == "easing": e = g.pick(EASINGS); return [{"bouncing": g.pick(["with a bounce", "bouncing"])}.get(e, e)], {"easing": e}
    if mid == "repeat":
        if g.coin(0.4): r = g.pick(REPEAT_CLOSED); return [{"forever": g.pick(["forever", "in a loop", "over and over"]), "once": "once"}[r]], {"repeat": r}
        n = g.pick(g.counts)
        if n == "2" and g.coin(0.4): return ["twice"], {"repeat": "2"}
        return [g.num(n), "times"], {"repeat": n}
    raise KeyError(mid)


def allowed(ev, kind):
    """which start / duration / modifier ids an event takes"""
    if kind == "start": return START_IDS
    if kind == "duration": return ["none", "for", "over", "in", "closed"] + (["per_hop"] if ev == "travel" else []) if ev not in ("wait",) else ["none"]
    return ["none"] + (["speed"] if ev in SPEEDABLE else []) + (["easing"] if ev in EASABLE else []) + (["repeat"] if ev in REPEATABLE else [])


# ------------------------------------------------------------------ action templates: (template id, f(g) -> (words, roles)); 'timed' = takes the phrases
TEMPLATES = collections.defaultdict(list)
def T(event, timed=True, mood="command"):
    def deco(f): TEMPLATES[event].append((f.__name__, f, timed, mood)); return f
    return deco

def obj(g, **kw): return g.entity(pron_p=0.08, **kw)
def verb(g, ev): return g.pick(EVENTS[ev])

for _ev in ("appear", "disappear", "fade_in", "fade_out", "blink", "pulse", "highlight", "grow", "shrink"):
    def _mk(ev):
        def direct(g):
            w, s = obj(g, heads=NODE_HEADS + EDGE_HEADS + CHARACTERS if ev in ("appear", "disappear", "fade_in", "fade_out", "highlight") else NODE_HEADS + CHARACTERS)
            v = verb(g, ev)
            if v in ("appear", "disappear", "vanish"): return ["make" if g.coin(0.7) else "let"] + w + [v], {"object": s}
            return [v] + w, {"object": s}
        def cause(g):
            w, s = obj(g, heads=NODE_HEADS + CHARACTERS); return [g.pick(["make", "let", "have"])] + w + [g.pick([v for v in EVENTS[ev] if v not in ("show", "reveal", "hide", "remove")] or EVENTS[ev])], {"object": s}
        direct.__name__ = f"{ev}_direct"; cause.__name__ = f"{ev}_cause"
        TEMPLATES[ev].append((direct.__name__, direct, True, "command")); TEMPLATES[ev].append((cause.__name__, cause, True, "command"))
    _mk(_ev)

@T("rotate")
def rot_by(g):
    w, s = obj(g); a = g.pick(g.deg); return [verb(g, "rotate")] + w + ["by", a, g.pick(["degrees", "deg"])], {"object": s, "angle": a}
@T("rotate")
def rot_plain(g):
    w, s = obj(g); return [verb(g, "rotate")] + w, {"object": s}
@T("travel")
def tr_send(g):
    t, st = g.entity(heads=TRAVELLERS, det_choices=("a", "the"), label_p=0); a, sa = g.entity(attr_p=0.1); b, sb = g.entity(attr_p=0.1)
    return [g.pick(["send", "fly"])] + t + ["from"] + a + ["to"] + b, {"traveller": st, "source": sa, "target": sb}
@T("travel")
def tr_decl(g):
    t, st = g.entity(heads=TRAVELLERS, det_choices=("the", "a"), label_p=0, attr_p=0.1); a, sa = g.entity(attr_p=0.1); b, sb = g.entity(attr_p=0.1)
    return t + [g.pick(["goes", "travels", "flies"])] + ["from"] + a + ["to"] + b, {"traveller": st, "source": sa, "target": sb}
@T("travel")
def tr_via(g):
    t, st = g.entity(heads=TRAVELLERS, det_choices=("a", "the"), label_p=0); a, sa = g.entity(attr_p=0); v, sv = g.entity(attr_p=0); b, sb = g.entity(attr_p=0)
    return ["send"] + t + ["from"] + a + ["to"] + b + [g.pick(["via", "through"])] + v, {"traveller": st, "source": sa, "via": sv, "target": sb}
@T("travel")
def tr_along(g):
    t, st = g.entity(heads=TRAVELLERS, det_choices=("a", "the"), label_p=0); p, sp = g.entity(heads=EDGE_HEADS, attr_p=0.3, label_p=0)
    return (["let"] + t + ["travel", "along"] + p) if g.coin(0.5) else (["send"] + t + ["along"] + p), {"traveller": st, "path": sp}
@T("move")
def mv_loc(g):
    w, s = obj(g, heads=NODE_HEADS + CHARACTERS)
    if g.coin(0.4): reg = g.pick(REGIONS); return [verb(g, "move")] + w + ["to", "the", reg], {"object": s, "region": reg}
    rel = g.pick(RELATIONS); lw, ls = g.entity(attr_p=0.2); return [verb(g, "move")] + w + [rel.replace("_", " ") if rel in ("left_of", "right_of", "next_to") else rel] + lw, {"object": s, "relation": rel, "landmark": ls}
@T("move")
def mv_dir(g):
    w, s = obj(g, heads=NODE_HEADS + CHARACTERS); d = g.pick(DIRECTIONS); n = g.pick(g.px)
    return [verb(g, "move")] + w + [g.num(n), g.pick(["px", "pixels"])] + (["to", "the", d] if d in ("left", "right") and g.coin(0.5) else [d]), {"object": s, "direction": d, "distance": n}
@T("change")
def ch_paint(g):
    w, s = obj(g, attr_p=0); c = g.pick(COLORS); return [verb(g, "change")] + w + [c], {"object": s, "color": c}
@T("wait")
def wt(g):
    nw, u, n, ut = g.tnum(); return ["wait"] + (["for"] if g.coin(0.5) else []) + nw + [u], {"duration": n, "unit": ut}
# named motions (spec 19.5): a character, sometimes a target
@T("walk")
def wk_cause(g):
    c, sc = g.entity(heads=CHARACTERS, label_p=0.1); t, st = g.entity(attr_p=0.1); return [g.pick(["make", "let"])] + c + ["walk", "to"] + t, {"object": sc, "target": st}
@T("walk")
def wk_decl(g):
    c, sc = g.entity(heads=CHARACTERS, label_p=0.1); t, st = g.entity(attr_p=0.1); return c + ["walks", "to"] + t, {"object": sc, "target": st}
@T("turn")
def tn_towards(g):
    c, sc = g.entity(heads=CHARACTERS, label_p=0.1); t, st = g.entity(attr_p=0.1); return [verb(g, "turn")] + c + ["towards"] + t, {"object": sc, "target": st}
@T("turn")
def tn_decl(g):
    c, sc = g.entity(heads=CHARACTERS, label_p=0.1); t, st = g.entity(attr_p=0.1); return c + ["turns", "towards"] + t, {"object": sc, "target": st}
for _ev in ("jump", "wave", "nod", "shake", "bounce"):
    def _mk2(ev):
        def cause(g):
            c, sc = g.entity(heads=CHARACTERS + (NODE_HEADS if ev in ("shake", "bounce") else []), label_p=0.1, pron_p=0.05); return [g.pick(["make", "let", "have"])] + c + [verb(g, ev)], {"object": sc}
        def decl(g):
            c, sc = g.entity(heads=CHARACTERS, label_p=0.1); third = {"jump": "jumps", "wave": "waves", "nod": "nods", "shake": "shakes", "bounce": "bounces"}[ev]
            return c + [third], {"object": sc}
        cause.__name__ = f"{ev}_cause"; decl.__name__ = f"{ev}_decl"
        TEMPLATES[ev].append((cause.__name__, cause, True, "command")); TEMPLATES[ev].append((decl.__name__, decl, True, "command"))
    _mk2(_ev)

# player commands (spec 19.3: play, pause, scrub, loop by voice); untimed except their own roles
@T("play", timed=False)
def pl(g):
    k = g.r.random()
    if k < 0.35: return _film(g, verb(g, "play"))
    if k < 0.7: return ["play", "from", "the", "beginning"] if g.coin(0.5) else ["play", "it", "from", "the", "start"], {"start": "beginning"}
    nw, u, n, ut = g.tnum(); return ["play", "from"] + nw + [u], {"start": n, "unit": ut}
def _film(g, v):
    f = g.pick([(["the", "animation"], {"head": "animation", "det": "the"}), (["it"], {"head": "it"}), (["everything"], {"head": "everything"})])
    return [v] + f[0], {"object": f[1]}
@T("pause", timed=False)
def ps(g):
    k = g.r.random()
    if k < 0.35: return _film(g, verb(g, "pause"))
    if k < 0.7: w, s = g.entity(attr_p=0.1); return [g.pick(["stop", "pause"]), "at"] + w, {"landmark": s}
    nw, u, n, ut = g.tnum(); return [g.pick(["stop", "pause", "freeze"]), "at"] + nw + [u], {"start": n, "unit": ut}
@T("rewind", timed=False)
def rw(g): return _film(g, verb(g, "rewind")) if g.coin(0.6) else ([verb(g, "rewind")], {})
@T("loop", timed=False)
def lp(g):
    if g.coin(0.5): return _film(g, "loop")
    n = g.pick(g.counts); words, roles = _film(g, "repeat"); return words + [g.num(n), "times"], {**roles, "repeat": n}
@T("retime", timed=False)
def rt(g):
    w, s = g.entity(heads=TRAVELLERS + NODE_HEADS + CHARACTERS, attr_p=0.1, pron_p=0.1); v = verb(g, "retime")
    if g.coin(0.4): sp = "twice_as_fast" if v == "speed_up" else "half_as_fast"; return [v] + w + [sp.replace("_", " ")], {"object": s, "speed": sp}
    return [v] + w, {"object": s}
# the speed correction through the action itself: "make the answer travel slower"
@T("travel", timed=False)
def tr_retime(g):
    t, st = g.entity(heads=TRAVELLERS, det_choices=("the",), label_p=0); sp = g.pick(["slower", "faster", "twice_as_fast", "half_as_fast"])
    return ["make"] + t + ["travel", sp.replace("_", " ")], {"traveller": st, "speed": sp}

# prohibitions checked on every frame (spec 19.4); always negated
@T("overlap", timed=False)
def ov(g):
    w, s = g.entity(attr_p=0.1); return [g.pick(["do not", "never"]), "let", "anything", g.pick(["overlap", "cover"])] + w, {"object": {"head": "anything"}, "landmark": s}
@T("leave", timed=False)
def lv(g):
    t, st = g.entity(heads=TRAVELLERS, label_p=0); p, sp = g.entity(heads=EDGE_HEADS, det_choices=("the",), plural=True, attr_p=0, label_p=0)
    return [g.pick(["do not", "never"]), "let"] + t + ["leave"] + p, {"traveller": st, "path": sp}

# questions about the film (spec 19.6)
@T("appear", timed=False, mood="question")
def q_when(g):
    w, s = g.entity(heads=NODE_HEADS + EDGE_HEADS + CHARACTERS, attr_p=0.1); ev = g.pick(["appear", "disappear", "blink", "highlight", "fade_in", "pulse"])
    return ["when", "does"] + w + [ev], {"object": s, "_event": ev, "_asked": "start"}
@T("last", timed=False, mood="question")
def q_long(g):
    if g.coin(0.5): f = g.pick([(["the", "animation"], {"head": "animation", "det": "the"}), (["everything"], {"head": "everything"}), (["it"], {"head": "it"})]); return ["how_long", "does"] + f[0] + [g.pick(["last", "take"])], {"object": f[1], "_asked": "duration"}
    w, s = g.entity(heads=TRAVELLERS + NODE_HEADS, attr_p=0.1); return ["how_long", "does"] + w + ["take"], {"object": s, "_asked": "duration"}
@T("blink", timed=False, mood="question")
def q_what_after(g):
    third = g.pick(["blinks", "moves", "travels", "highlights", "fades_in", "pulses", "jumps"]); ev = {"blinks": "blink", "moves": "move", "travels": "travel", "highlights": "highlight", "fades_in": "fade_in", "pulses": "pulse", "jumps": "jump"}[third]
    rel = g.pick(["after", "before", "with", "while"]); w, s = g.entity(heads=NODE_HEADS + EDGE_HEADS + TRAVELLERS, attr_p=0.1)
    return ["what", third, rel] + w, {"tempo": rel, "ref": s, "_event": ev, "_asked": "object"}
@T("highlight", timed=False, mood="question")
def q_what_at(g):
    part = g.pick(["highlighted", "shown", "hidden"]); ev = {"highlighted": "highlight", "shown": "appear", "hidden": "disappear"}[part]
    if g.coin(0.6): nw, u, n, ut = g.tnum(); return ["what", "is", part, "at"] + nw + [u], {"start": n, "unit": ut, "_event": ev, "_asked": "object"}
    t, st = g.entity(heads=TRAVELLERS, label_p=0); lw, ls = g.entity(attr_p=0)
    return ["what", "is", part, "when"] + t + ["arrives", "at"] + lw, {"tempo": "when", "ref": st, "trigger": "arrives", "landmark": ls, "_event": ev, "_asked": "object"}
@T("locate", timed=False, mood="question")
def q_where(g):
    t, st = g.entity(heads=TRAVELLERS + CHARACTERS, label_p=0)
    if g.coin(0.6): nw, u, n, ut = g.tnum(); return ["where", "is"] + t + [g.pick(["at", "after"])] + nw + [u], {"traveller": st, "start": n, "unit": ut, "_asked": "landmark"}
    r, sr = g.entity(heads=TRAVELLERS, label_p=0); return ["where", "is"] + t + ["when"] + r + ["arrives"], {"traveller": st, "tempo": "when", "ref": sr, "trigger": "arrives", "_asked": "landmark"}

DECL_PREFIXES = {"bare", "okay", "now", "actually", "no", "instead"}   # a declarative ("the robot walks to the database") takes no request prefix
PROHIBITABLE = {"move", "disappear", "fade_out", "change", "rotate", "grow", "shrink"}
ALWAYS_NEG = {"overlap", "leave"}


def formulations():
    """every (event, template id, f, mood, start id, duration id, modifier id, prefix): the formulation space"""
    out = []
    for ev, ts in TEMPLATES.items():
        for tid, f, timed, mood in ts:
            prefixes = Q_PREFIXES if mood == "question" else [p for p in PREFIXES if p[0] in DECL_PREFIXES] if "decl" in tid else PREFIXES
            if not timed: combos = [("none", "none", "none")]
            else: combos = [(s, d, m) for s in allowed(ev, "start") for d in allowed(ev, "duration") for m in allowed(ev, "modifier")
                            if not (s in ("at", "after_abs", "at_front") and d == "per_hop") and not (d == "closed" and m == "speed")]
            for s, d, m in combos:
                for p in prefixes:
                    if ev in ALWAYS_NEG and p[0] in ("could", "can", "want", "lets"): continue
                    out.append((ev, tid, f, mood, s, d, m, p))
    return out


def sig(c): ev, tid, f, mood, s, d, m, p = c; return f"{ev}.{tid}+{s}+{d}+{m}.{p[0]}"


def realise(g, c):
    ev, tid, f, mood, sid, did, mid, (pid, ptxt) = c
    words, roles = f(g)
    roles = dict(roles); event = roles.pop("_event", ev); asked = roles.pop("_asked", None)
    own = {v["head"] for v in roles.values() if isinstance(v, dict)}
    for _ in range(10):                                                      # the other unit is another component than this one's
        sw, sr, front = START(g, ev, sid)
        if not (isinstance(sr.get("ref"), dict) and sr["ref"]["head"] in own): break
    dw, dr = DURATION(g, ev, did); mw, mr = MODIFIER(g, ev, mid)
    if "unit" in sr and "unit" in dr and sr["unit"] != dr["unit"]:            # one time unit per sentence (stated): re-draw the duration
        for _ in range(20):
            dw, dr = DURATION(g, ev, did)
            if dr.get("unit") == sr["unit"]: break
        else: dw, dr = [], {}
    if set(sr) & set(roles) - {"unit"}: sw, sr, front = [], {}, False           # a template that fills the same role (landmark) keeps its own
    if set(dr) & set(roles) - {"unit"}: dw, dr = [], {}
    body = words + dw + mw
    words = (sw + body) if front else (body + sw)
    roles = {**roles, **sr, **dr, **mr}
    negated = ev in ALWAYS_NEG
    if not negated and mood == "command" and ev in PROHIBITABLE and pid in ("bare", "please", "now", "okay", "tail") and sid == "none" and g.coin(0.1):
        words = [g.pick(["do not", "don't", "never"])] + words; negated = True
    if pid == "tail": words = words + ["please"]
    elif pid == "instead": words = words + ["instead"]
    elif ptxt: words = ptxt.split() + words
    end = " ?" if mood == "question" else (" ." if g.coin(0.5) else "")
    toks, info = normalize(" ".join(words) + end)
    return event, " ".join(toks), roles, negated, mood, asked, sig(c)


def wires_for(ev, roles, negated, mood, asked, text, template, ids):
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
            if v.get("det"): en.set("det", v["det"])
            later.append(en); w.set(r, ("ref", en.id))
        else: w.set(r, str(v))
    first = out[0]
    head = [soplang.Line("_text", text), soplang.Line("_source", "generator"), soplang.Line("_template", template), soplang.Line("_mood", mood)]
    if asked: head.append(soplang.Line("_asked", asked))
    first.lines = head + first.lines
    return out + later


def frame_of(ev, roles, negated):
    """the gold frame in the reader-result format of app/ARCHITECTURE.md (used by animation_scripts.py and the app tests)"""
    out = {}
    for r, v in roles.items():
        if isinstance(v, dict): out[r] = ["entity", v["head"], ["word", v["attr"]] if v.get("attr") else None, v.get("det")]
        else: out[r] = ["word", str(v)]
    return {"event": ev, "roles": out, "neg": bool(negated), "speakers": []}


def build(out, n, n_eval, seed):
    combos = formulations()
    h = lambda s: int(hashlib.sha256(f"{seed}:{s}".encode()).hexdigest()[:8], 16) / 2 ** 32
    held = {sig(c) for c in combos if c[7][0] != "bare" and h(sig(c)) < 0.12}
    train_combos = [c for c in combos if sig(c) not in held]; held_combos = [c for c in combos if sig(c) in held]
    # every part of a held-out formulation occurs in training (rule 29): checked, not assumed
    parts = lambda c: {("t", c[0], c[1]), ("s", c[4]), ("d", c[5]), ("m", c[6]), ("p", c[7][0])}
    seen = set().union(*(parts(c) for c in train_combos)); missing = set().union(*(parts(c) for c in held_combos)) - seen
    assert not missing, f"held-out parts never in training: {missing}"
    w_ev = collections.Counter({e: 1.0 for e in TEMPLATES}); w_ev.update({"appear": 3, "travel": 4, "highlight": 2, "move": 2, "blink": 1, "fade_in": 1, "fade_out": 1, "disappear": 1,
                                                                        "pulse": 0.5, "walk": 1, "wave": 0.5, "play": 0.3, "pause": 0.3, "loop": 0.2, "retime": 0.5, "overlap": 0.2, "leave": 0.2})
    # sample: first a template (weighted by event), then uniformly one of its formulations (so templates with many combinations are not favoured)
    def draw(cs, k, new, rs):
        by_t = collections.defaultdict(list)
        for c in cs: by_t[(c[0], c[1])].append(c)
        keys = sorted(by_t); ws = np.array([w_ev[e] / len(TEMPLATES[e]) for e, _ in keys]); ws /= ws.sum(); g = Gen(rs, new); rows = []
        for _ in range(k):
            key = keys[int(rs.choice(len(keys), p=ws))]; lst = by_t[key]; rows.append(realise(g, lst[int(rs.integers(len(lst)))]))
        return rows
    train = draw(train_combos, n, False, np.random.default_rng(300 + seed))
    new_pool = set(LABELS_NEW + SECS_NEW + MS_NEW + PX_NEW + DEG_NEW + COUNT_NEW)
    ev_new = [r for r in draw(train_combos, 6 * n_eval, True, np.random.default_rng(910 + seed)) if any(x in new_pool for x in r[1].split())][:n_eval]
    ev_form = draw(held_combos, n_eval, False, np.random.default_rng(911 + seed))
    legend = {"version": 1, "roles": [{"id": r, "question": q} for r, q in ROLES], "events": [{"id": e, "verbs": vs} for e, vs in EVENTS.items()],
              "operators": ["not"], "moods": ["command", "question"], "kinds": {"source": "lexicon", "lexicon": "kinds.tsv"},
              "values": [{"kind": "NUM", "pattern": "\\d+(\\.\\d+)?"}, {"kind": "LABEL", "pattern": "[a-z0-9]+(_[a-z0-9]+)+"}],
              "reader": {"predicate_role": True, "occupancy_marker": True, "definite_dets": ["the"],
                         "gates_given": {"open": ["to", "of", "in", "on", "at", "by", "from", "into", "as", "and", ",", "."], "closed": []}},
              "repertoire": {"characters": CHARACTERS, "motions": sorted(MOTIONS), "travellers": TRAVELLERS,
                             "note": "spec 19.5: named motions are written once by the world's authors (app/src/animate/characters.js); a motion the legend lacks is reported unknown"}}
    wd = out; [os.makedirs(os.path.join(wd, d), exist_ok=True) for d in ("examples", "raw", "audit", "model", "runs", "versions", "requests")]
    lp = os.path.join(wd, "legend.json"); json.dump(legend, open(lp, "w"), indent=1)
    with open(os.path.join(wd, "kinds.tsv"), "w") as f:
        f.write("# word\tkind\tlemma: the animation world's categories (GIVEN, rule 20); numbers and multi-part labels by the legend's value patterns\n")
        for w in sorted(KINDS): f.write(f"{w}\t{KINDS[w]}" + (f"\t{LEMMA[w]}" if w in LEMMA else "") + "\n")
    sha = sha256_file(lp)
    json.dump({"name": "animation", "language": "en", "description": "VSS Diagram Editor, animation (vision/VSS_Diagram_Editor_Specification.md, section 19)",
               "created": datetime.date.today().isoformat(), "version": 1, "min_examples": 500, "max_versions_per_run": 3,
               "models": {"pipeline": "claude-haiku-5-5", "annotate": "claude-haiku-5-5", "second_look": "claude-haiku-5-5", "evolve": "claude-opus-5-5"},
               "second_look_escalate": 0.05, "second_look_retrain": 0.05}, open(os.path.join(wd, "world.json"), "w"), indent=1)
    def write(fname, rows):
        doc = soplang.Doc(directives=[("world", "animation", None), ("legend", sha, None), ("generated", f"training/worlds/animation/generate.py seed {seed} ({datetime.date.today()})", None)])
        k = 0
        for ev, text, roles, negated, mood, asked, template in rows:
            ids = iter(f"w{k + i}" for i in range(1, 200)); ws = wires_for(ev, roles, negated, mood, asked, text, template, ids); k += len(ws)
            ws[0].lines.insert(1, soplang.Line("_world", "animation")); doc.wires += ws
        open(os.path.join(wd, "examples", fname), "w").write(soplang.write(doc))
    write("train.sop", train); write("eval_new_identities.sop", ev_new); write("eval_heldout_formulations.sop", ev_form)
    hints = {"heldout_sentence_share": 0.1, "new_identities": sorted(new_pool),
             "file_splits": {"examples/eval_new_identities.sop": "new_identities", "examples/eval_heldout_formulations.sop": "heldout_formulations"},
             "template_splits": {"heldout_formulations": sorted(held)},
             "protocol": "animation world, Level 1: one event per sentence, no nesting; held-out formulations = (template, start, duration, modifier, prefix) combinations whose parts all occur in training; new identities = labels and numbers never in training"}
    json.dump(hints, open(os.path.join(wd, "split_hints.json"), "w"), indent=1)
    open(os.path.join(wd, "raw", "sentences.txt"), "w").write("\n".join(r[1] for r in train[:2000]) + "\n")
    if not os.path.exists(os.path.join(wd, "status.json")): json.dump({"label": None, "note": "never trained"}, open(os.path.join(wd, "status.json"), "w"))
    write_coverage(train, ev_new, ev_form, sha, n, seed, combos, held)
    print(f"animation world written to {wd}: train {len(train)}, new identities {len(ev_new)}, held-out formulations {len(ev_form)}; "
          f"formulations {len(combos)}, held out {len(held)}; legend {sha[:19]}...; kinds {len(KINDS)} words, {len(set(KINDS.values()))} kinds")
    return wd


def write_coverage(train, ev_new, ev_form, sha, n, seed, combos, held):
    cov = collections.Counter(); ev_count = collections.Counter(); moods = collections.Counter(); vals = collections.defaultdict(collections.Counter)
    for ev, text, roles, negated, mood, asked, template in train:
        ev_count[ev] += 1; moods[mood] += 1
        for r, v in roles.items():
            cov[(ev, r)] += 1
            if r in ("tempo", "trigger", "speed", "easing", "repeat", "unit", "per") or (r == "duration" and v in DUR_CLOSED): vals[r][v if isinstance(v, str) and not v[0].isdigit() else "NUM"] += 1
        if negated: cov[(ev, "NOT")] += 1
        if asked: cov[(ev, "ASKED:" + asked)] += 1
    time_roles = ["start", "tempo", "ref", "offset", "trigger", "duration", "unit", "per", "speed", "easing", "repeat"]
    other = [r for r, _ in ROLES if r not in time_roles]
    cols = time_roles + other + ["NOT"]
    L = [f"# Coverage of the animation world (generate.py seed {seed}, {n} training sentences)", "",
         f"Legend {sha}. Templates {sum(len(v) for v in TEMPLATES.values())}; formulations (template x start x duration x modifier x prefix) {len(combos)}, "
         f"held out {len(held)}. Moods in training: " + ", ".join(f"{k} {v}" for k, v in sorted(moods.items())) + ".", "",
         "Sentences per event and role (training file; the temporal roles of spec Table 12 first):", "",
         "| event | n | " + " | ".join(cols) + " | questions |", "|---|---|" + "---|" * (len(cols) + 1)]
    for ev in EVENTS:
        qs = ", ".join(f"{k.split(':')[1]} {v}" for (e, k), v in sorted(cov.items()) if e == ev and k.startswith("ASKED:"))
        L.append(f"| {ev} | {ev_count[ev]} | " + " | ".join(str(cov[(ev, r)]) if cov[(ev, r)] else "" for r in cols) + f" | {qs} |")
    L += ["", "Closed values of the temporal roles (training file):", ""]
    for r in ("tempo", "trigger", "duration", "unit", "per", "speed", "easing", "repeat"):
        L.append(f"- {r}: " + ", ".join(f"{k} {v}" for k, v in sorted(vals[r].items())))
    L += ["", f"Evaluation files: eval_new_identities.sop {len(ev_new)} sentences; eval_heldout_formulations.sop {len(ev_form)} sentences.", "",
          "Every temporal role and every closed value of Table 12 occurs in training; every part (template, start phrase, duration phrase, modifier, "
          "prefix) of a held-out formulation occurs in training (asserted by generate.py)."]
    open(os.path.join(HERE, "COVERAGE.md"), "w").write("\n".join(L) + "\n")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default=os.path.join(TOOL, "worlds", "animation")); ap.add_argument("--n", type=int, default=30000)
    ap.add_argument("--n_eval", type=int, default=400); ap.add_argument("--seed", type=int, default=0)
    a = ap.parse_args(); build(a.out, a.n, a.n_eval, a.seed)
