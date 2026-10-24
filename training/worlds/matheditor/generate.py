"""generate.py: the matheditor world (VSS Diagram Editor specification, section 16; Table 13 rows "Formulas"): the legend, the kinds
lexicon, spoken formulas with their gold trees as nested SOP wires (16.2), ambiguous formulas with ALL their readings as gold (16.3),
and matheditor commands with their frames (16.4), written as a world folder that `sop check` validates and `sop train` trains.

One implementation of the scope rule: every sentence's readings come from the app's reference parser (app/src/formula/parse.js, through
parse_batch.mjs). The generator draws a tree, verbalises it through a spoken FAMILY and operator TEMPLATES, and asks the parser for the
readings of the normalized words; the sentence is kept only if the tree it was drawn from is one of them (a verbaliser error is counted
and reported, never kept). One reading: an unambiguous sentence, gold = that tree. Two to four readings: an ambiguous sentence, gold =
every reading, as alternatives `root=$a | $b` with `_readings=<n>` (spec 16.3; the quantifier world's "both readings" convention).
Commands are parsed back by the reference command reader and kept only when its frame equals the generator's.

Formulations (rule 29 applied to formulations): a sentence's signature is its family and the set of operator templates it uses; the
held-out formulations are (family, template) PAIRS whose template and family both occur in training; a sentence with any held-out pair
is held out. Commands: (template, prefix) combinations, as the diagram world. Unseen depth: trees are drawn to depth 2 for training and at
depth 3 for the unseen-depth split, which keeps only trees whose every hop (parent operator, role, child kind) occurs in training and
whose formulation pairs are all seen. New identities: variables and numbers never in training.

Splits (examples/): train.sop (depth 0-2 formulas, about 12% ambiguous, and commands), eval_heldout_formulations.sop,
eval_new_identities.sop, eval_unseen_depth.sop (depth 3), eval_ambiguous.sop (ambiguous sentences of seen formulations, not in training).
raw/edit_suite.jsonl: commands against random formulas with the expected formula after the edit (app/src/formula/commands.js).
Run: python3 generate.py --out <dir>/matheditor [--n 20000] [--n_eval 400] [--seed 0]     (the folder name must be matheditor)
"""
import argparse, collections, datetime, hashlib, json, os, subprocess, sys, tempfile
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(os.path.dirname(os.path.dirname(HERE))); TOOL = os.path.join(REPO, "tool")
sys.path.insert(0, TOOL)
import numpy as np
from sop import soplang
from sop.legend import sha256_file

INF = 1000
# ------------------------------------------------------------------ vocabulary (spec Table 11)
LATIN_TRAIN = ["a", "b", "c", "i", "j", "k", "m", "n", "p", "r", "s", "t", "u", "v", "x", "y", "z"]
LATIN_NEW = ["q", "w"]
GREEK_TRAIN = ["alpha", "beta", "gamma", "delta", "theta", "lambda", "mu", "sigma", "phi", "omega"]
GREEK_NEW = ["psi", "rho"]
NUMS_TRAIN = list(range(0, 13)) + [20, 100]
NUMS_NEW = [13, 17, 19, 60]
CONSTS = ["pi", "e", "infinity"]
FUNCS = ["sin", "cos", "tan", "log", "ln", "exp", "f", "g", "h"]
NUM_WORDS = dict(enumerate("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()))
NUM_WORDS.update({20: "twenty", 30: "thirty", 40: "forty", 50: "fifty", 60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety"})
LETTER_NAMES = {"x": "ex", "y": "why", "z": "zee", "a": "ay", "b": "bee", "c": "cee", "n": "en", "m": "em", "k": "kay", "t": "tee", "i": "eye",
                "j": "jay", "p": "pee", "q": "cue", "s": "ess", "v": "vee", "w": "double you"}
FUNC_SPOKEN = {"sin": ["sine", "sin"], "cos": ["cosine", "cos"], "tan": ["tangent", "tan"], "log": ["log", "logarithm"], "ln": ["natural log", "ln"],
               "exp": ["exp"], "f": ["f"], "g": ["g"], "h": ["h"]}
ROLES = {"plus": ["left", "right"], "minus": ["left", "right"], "times": ["left", "right"], "fraction": ["numerator", "denominator"],
         "power": ["base", "exponent"], "subscript": ["base", "index"], "root": ["index", "argument"], "apply": ["argument"], "paren": ["operand"],
         "abs": ["operand"], "neg": ["operand"], "sum": ["index", "lower", "upper", "body"], "product": ["index", "lower", "upper", "body"],
         "integral": ["lower", "upper", "body", "index"], "equals": ["left", "right"], "less": ["left", "right"], "greater": ["left", "right"],
         "approx": ["left", "right"], "implies": ["left", "right"]}
RELATIONS = ["equals", "less", "greater", "approx", "implies"]
LEAVES = ("num", "var", "const")

FAMILIES = {   # spoken families (spec 16.5): lexical habits and how often an open scope is closed explicitly when it need not be
    "textbook":  {"num_words": 0.9, "letter_names": 0.0, "p_close": 0.55, "p_comma": 0.1},
    "informal":  {"num_words": 0.5, "letter_names": 0.0, "p_close": 0.2, "p_comma": 0.5},
    "delimited": {"num_words": 0.7, "letter_names": 0.0, "p_close": 0.9, "p_comma": 0.05},
    "spelled":   {"num_words": 0.8, "letter_names": 0.85, "p_close": 0.35, "p_comma": 0.25},
}
# operator templates and their weight per family (textbook, informal, delimited, spelled)
TEMPLATES = {
    "fraction.over": (2, 5, 2, 2), "fraction.divided_by": (2, 2, 1, 4), "fraction.all_over": (1, 4, 1, 2), "fraction.the_fraction": (2, 1, 3, 1),
    "fraction.with_numerator": (3, 0.3, 2, 1),
    "power.squared": (3, 4, 3, 3), "power.cubed": (3, 4, 3, 3), "power.to_the": (1, 4, 2, 2), "power.to_the_power_of": (4, 1, 3, 2),
    "power.raised_to": (1, 0.5, 1, 3), "power.all_squared": (0.5, 2, 0.5, 1),
    "times.jux": (3, 5, 3, 3), "times.times": (3, 2, 3, 2), "times.multiplied_by": (1, 0.3, 1, 3),
    "neg.negative": (2, 1, 2, 2), "neg.minus": (1, 2, 1, 1),
    "subscript.sub": (2, 4, 2, 2), "subscript.subscript": (2, 1, 2, 2),
    "root.square_root_of": (4, 2, 3, 3), "root.root_of": (1, 3, 1, 1),
    "apply.of": (3, 2, 3, 3), "apply.bare": (1, 3, 0.5, 1), "apply.the_of": (2, 0.5, 2, 1),
    "paren.open_close": (3, 2, 3, 2), "paren.paren": (1, 3, 1, 2), "paren.left_right": (1, 0.5, 2, 1),
    "integral.from_to": (3, 3, 3, 3), "integral.wrt": (2, 0.5, 2, 1),
    "equals.equals": (2, 4, 2, 3), "equals.is_equal_to": (3, 1, 3, 2), "less.less_than": (1, 3, 1, 1), "less.is_less_than": (3, 1, 3, 2),
    "greater.greater_than": (1, 3, 1, 1), "greater.is_greater_than": (3, 1, 3, 2), "approx.approximately": (1, 2, 1, 1), "approx.is_approximately": (2, 1, 2, 1),
}
FIXED = ["plus.plus", "minus.minus", "root.cube", "root.nth", "abs.absolute_value", "sum.from_to", "product.from_to", "integral.indefinite", "implies.implies"]
DELIMS = ["close.end_fraction", "close.end_exponent", "close.end_root", "close.end_sub", "close.end_sum", "close.end_abs", "close.comma",
          "close.quantity", "close.paren_arg"]
FAM_IDX = {f: i for i, f in enumerate(FAMILIES)}
CLOSER_WORDS = {"fraction": "end fraction", "power": "end exponent", "root": "end root", "subscript": "end sub", "sum": "end sum",
                "product": "end product", "abs": "end absolute value"}


# ------------------------------------------------------------------ trees
def leaf(op, v): return {"op": op, "v": str(v)}
def node(op, **roles):
    n = {"op": op}
    for k, v in roles.items():
        if v is not None: n[k] = v
    return n
def kids(t): return [] if t["op"] in LEAVES else [(r, t[r]) for r in ROLES[t["op"]] if r in t]
def depth(t): return 0 if t["op"] in LEAVES else 1 + max([depth(c) for _, c in kids(t)] or [0])
def canon(t): return json.dumps(t, sort_keys=True, separators=(",", ":"))
def hops(t, out=None):
    out = set() if out is None else out
    for r, c in kids(t):
        out.add((t["op"], r, c["op"] if c["op"] not in LEAVES else "leaf:" + c["op"])); hops(c, out)
    return out
def leaf_words(t):
    if t["op"] in LEAVES: return {t["v"]}
    return set().union(*[leaf_words(c) for _, c in kids(t)]) if kids(t) else set()


class TreeGen:
    OPS = {"plus": 6, "minus": 4, "times": 5, "fraction": 6, "power": 6, "subscript": 1.5, "root": 2.5, "apply": 3, "paren": 1, "abs": 1,
           "neg": 1.5, "sum": 1, "product": 0.5, "integral": 1}
    TOP = {"equals": 3, "less": 0.7, "greater": 0.7, "approx": 0.4}
    def __init__(self, rng, vars_, nums):
        self.r, self.vars, self.nums = rng, vars_, nums
    def pick(self, xs, w=None):
        if w is None: return xs[int(self.r.integers(len(xs)))]
        p = np.array(w, float); p /= p.sum(); return xs[int(self.r.choice(len(xs), p=p))]
    def coin(self, p): return self.r.random() < p
    def leafv(self, kind=None):
        k = kind or self.pick(["num", "var", "const"], [0.4, 0.55, 0.05])
        if k == "num": return leaf("num", self.pick(self.nums))
        if k == "var": return leaf("var", self.pick(self.vars))
        return leaf("const", self.pick(["pi", "e"]))
    def sub(self, d):     # a non-main child: depth 0..d, mostly leaves
        if d <= 0 or self.coin(0.6): return self.leafv()
        return self.gen(int(self.r.integers(1, d + 1)))
    def gen(self, d, top=False, no_paren=False, no_neg=False):
        if d == 0: return self.leafv()
        ops = dict(self.OPS)
        if top: ops.update(self.TOP)
        if top and d >= 2: ops["implies"] = 0.3
        if no_paren: ops.pop("paren")
        if no_neg: ops.pop("neg")
        names = list(ops); op = self.pick(names, [ops[o] for o in names]); m = d - 1
        if op in ("plus", "minus", "times", "equals", "less", "greater", "approx"):
            if self.coin(0.5): return node(op, left=self.gen(m), right=self.sub(m))
            return node(op, left=self.sub(m), right=self.gen(m))
        if op == "implies":
            rel = lambda dd: node(self.pick(["equals", "less", "greater"]), left=self.gen(dd - 1) if dd > 0 else self.leafv(), right=self.leafv())
            return node("implies", left=rel(m), right=rel(int(self.r.integers(1, m + 1))))
        if op == "fraction":
            if self.coin(0.5): return node(op, numerator=self.gen(m), denominator=self.sub(m))
            return node(op, numerator=self.sub(m), denominator=self.gen(m))
        if op == "power":
            if self.coin(0.55):
                ex = self.pick([leaf("num", "2"), leaf("num", "3"), leaf("var", "n"), leaf("var", "k"), self.leafv()], [3, 2, 1.5, 0.5, 1])
                return node(op, base=self.gen(m, no_neg=True), exponent=ex)
            return node(op, base=self.leafv(self.pick(["var", "num", "const"], [0.75, 0.15, 0.1])), exponent=self.gen(m))
        if op == "subscript":
            return node(op, base=leaf("var", self.pick(self.vars)), index=self.gen(m) if m else self.leafv(self.pick(["var", "num"])))
        if op == "root":
            idx = self.pick([None, leaf("num", "3"), leaf("var", "n")], [0.7, 0.15, 0.15])
            return node(op, index=idx, argument=self.gen(m, no_paren=True))
        if op == "apply": return node(op, function=self.pick(FUNCS), argument=self.gen(m, no_paren=True))
        if op in ("paren", "abs", "neg"): return node(op, operand=self.gen(m, no_paren=op == "abs", no_neg=op == "neg"))
        if op in ("sum", "product"):
            iv = self.pick(["i", "j", "k"])
            up = self.pick([leaf("var", "n"), leaf("var", "m"), leaf("num", self.pick(self.nums)), leaf("const", "infinity")], [4, 1, 1, 1])
            return node(op, index=leaf("var", iv), lower=leaf("num", self.pick(["0", "1"])), upper=up, body=self.gen(m))
        if op == "integral":
            iv = self.pick(["x", "t"])
            if self.coin(0.6):
                return node(op, lower=leaf("num", self.pick(["0", "1"])) if self.coin(0.7) else leaf("var", "a"),
                            upper=self.pick([leaf("num", "1"), leaf("var", "b"), leaf("const", "infinity"), leaf("var", "x")]), body=self.gen(m), index=leaf("var", iv))
            return node(op, body=self.gen(m), index=leaf("var", iv))
        raise ValueError(op)


# ------------------------------------------------------------------ verbaliser (mirrors the binding powers of app/src/formula/parse.js)
class Verbaliser:
    """say(n, follow, gs, comma_ok) -> (tokens, top, edge). follow = the binding power (lbp) of what comes right after n in the sentence
    (-1: the end, a closer or a pause); gs = n starts a group (it is on the left spine of an operand read at a binding power below 15);
    top = how loosely n's own top operator binds as a right operand (INF for leaves, groups, prefix operators); edge = the lowest binding
    power at which n's right end still takes material (INF when closed). Invariant: edge >= follow (else the sentence would not read n)."""
    def __init__(self, rng, family, closed):
        self.r, self.fam, self.closed = rng, family, closed; self.F = FAMILIES[family]; self.used = set()
        self.force = frozenset()   # construct kinds that must use their closer: inside an operand closed by that closer, a closer matches the
                                   # nearest open construct of its kind in the same bracket group (parse.js), so inner ones close themselves
    def shielded(self, fn):
        saved = self.force; self.force = frozenset()
        try: return fn()
        finally: self.force = saved
    def forced(self, kind, fn):
        saved = self.force; self.force = saved | {kind}
        try: return fn()
        finally: self.force = saved
    def coin(self, p): return self.r.random() < p
    def pick(self, xs): return xs[int(self.r.integers(len(xs)))]
    def choose(self, tids):
        tids = [t for t in tids if t in TEMPLATES or t in FIXED]
        w = np.array([TEMPLATES[t][FAM_IDX[self.fam]] if t in TEMPLATES else 1.0 for t in tids], float)
        if w.sum() <= 0: w = np.ones(len(tids))
        return tids[int(self.r.choice(len(tids), p=w / w.sum()))]

    def word_leaf(self, t):
        v = t["v"]
        if t["op"] == "num":
            n = int(v)
            if self.coin(self.F["num_words"]):
                if n in NUM_WORDS: return NUM_WORDS[n].split()
                if n < 100: return [NUM_WORDS[n // 10 * 10], NUM_WORDS[n % 10]]
            return [v]
        if t["op"] == "var" and v in LETTER_NAMES and self.coin(self.F["letter_names"]): return LETTER_NAMES[v].split()
        return [v]

    def group(self, n):
        toks, _, _ = self.shielded(lambda: self.say(n, -1, True, True)); self.used.add("close.quantity")
        return ["the", "quantity"] + toks + ["end", "quantity"], INF, INF
    def say_right(self, c, q, follow, gs=False):
        """a right operand read at binding power q: its top operator must bind tighter than q, else it is grouped"""
        toks, top, edge = self.say(c, follow, gs or q < 15, q < 15)
        if top <= q: return self.group(c)
        return toks, top, edge
    def say_left(self, c, lp, gs, comma_ok):
        """a left operand followed by an operator of binding power lp: optionally closed by a pause when it starts a group"""
        if comma_ok and gs and self.coin(self.F["p_comma"] * (0.3 if self.closed else 1)):
            toks, top, edge = self.say(c, -1, gs, False)
            if edge < INF: self.used.add("close.comma"); return toks + [","], top, INF
            return toks, top, edge
        return self.say(c, lp, gs, False)

    def scope(self, kind, c, q_tight, follow, closer=True, paren_ok=False, wide_ok=True):
        """an open scope (denominator, exponent, argument, body, index): bare tight / bare wide / closed by its closer or own brackets"""
        risky = follow > 15
        must = closer and kind in self.force
        want_close = self.coin(self.F["p_close"]) if not self.closed else None
        if not want_close and not must:
            toks, top, edge = self.say(c, follow, False, False)
            if paren_ok and toks[:1] in (["open"], ["left"]): toks, top, edge = self.group(c)   # brackets right after the opener are its own
            tight_ok = top > q_tight and q_tight >= follow
            wide = wide_ok and top > 15 and 15 >= follow
            if self.closed:
                if tight_ok and not risky: return toks, min(q_tight, edge)
            else:
                if tight_ok: return toks, min(q_tight, edge)
                if wide: return toks, min(15, edge)
        if paren_ok and not must and (not closer or self.coin(0.4)):
            toks, _, _ = self.shielded(lambda: self.say(c, -1, True, True)); self.used.add("close.paren_arg")
            return ["open", "parenthesis"] + toks + ["close", "parenthesis"], INF
        if closer:
            toks, _, _ = self.forced(kind, lambda: self.say(c, -1, True, True)); self.used.add("close." + {"fraction": "end_fraction", "power": "end_exponent", "root": "end_root",
                                                                               "subscript": "end_sub", "sum": "end_sum", "product": "end_sum", "abs": "end_abs"}[kind])
            return toks + CLOSER_WORDS[kind].split(), INF
        g, _, _ = self.group(c); return g, INF

    def say(self, n, follow, gs, comma_ok):
        op = n["op"]
        if op in LEAVES: return self.word_leaf(n), INF, INF
        out = self._say(n, follow, gs, comma_ok)
        toks, top, edge = out
        if edge < follow: return self.group(n)          # safety net: never produce a sentence that does not read n
        return out

    def _say(self, n, follow, gs, comma_ok):
        op, U = n["op"], self.used.add
        if op in ("plus", "minus"):
            U(f"{op}.{op}"); l, lt, _ = self.say_left(n["left"], 20, gs, comma_ok); r, _, e = self.say_right(n["right"], 20, follow)
            return l + [op] + r, min(20, lt), min(20, e)
        if op == "times":
            tid = self.choose(["times.jux", "times.times", "times.multiplied_by"])
            if tid == "times.jux":
                r, rt, e = self.say_right(n["right"], 40, follow)
                first = r[0]
                if rt > 40 and n["right"]["op"] != "neg" and not (first.isdigit() or first in NUM_WORDS.values()) and first not in ("minus", "negative"):
                    l, lt, _ = self.say_left(n["left"], 40, gs, comma_ok); U(tid); return l + r, min(40, lt), min(40, e)
                tid = "times.times"
            U(tid); l, lt, _ = self.say_left(n["left"], 30, gs, comma_ok); r, _, e = self.say_right(n["right"], 30, follow)
            return l + (["times"] if tid == "times.times" else ["multiplied", "by"]) + r, min(30, lt), min(30, e)
        if op in ("equals", "less", "greater", "approx", "implies"):
            lp = 5 if op == "implies" else 10
            tid = self.choose([t for t in list(TEMPLATES) + FIXED if t.startswith(op + ".")])
            U(tid); words = {"equals.equals": "equals", "equals.is_equal_to": "is equal to", "less.less_than": "less than", "less.is_less_than": "is less than",
                             "greater.greater_than": "greater than", "greater.is_greater_than": "is greater than", "approx.approximately": "approximately",
                             "approx.is_approximately": "is approximately", "implies.implies": "implies"}[tid].split()
            l, lt, _ = self.say_left(n["left"], lp, gs, comma_ok); r, _, e = self.say_right(n["right"], lp, follow, gs=True)
            return l + words + r, min(lp, lt), min(lp, e)
        if op == "neg":
            tid = self.choose(["neg.negative", "neg.minus"]); U(tid)
            r, _, e = self.say_right(n["operand"], 29, follow)
            return (["negative"] if tid == "neg.negative" else ["minus"]) + r, INF, min(29, e)
        if op == "fraction": return self.fraction(n, follow, gs, comma_ok)
        if op == "power": return self.power(n, follow, gs, comma_ok)
        if op == "subscript":
            tid = self.choose(["subscript.sub", "subscript.subscript"]); U(tid)
            b, bt, _ = self.say_left(n["base"], 60, gs, False)
            r, e = self.scope("subscript", n["index"], 60, follow, wide_ok=False)
            return b + (["sub"] if tid == "subscript.sub" else ["subscript"]) + r, min(60, bt), e
        if op == "root":
            if n.get("index") is None:
                tid = self.choose(["root.square_root_of", "root.root_of"]); U(tid)
                head = self.pick([["the", "square", "root", "of"], ["square", "root", "of"]]) if tid == "root.square_root_of" else ["root", "of"]
            elif n["index"] == leaf("num", "3"): U("root.cube"); head = self.pick([["the", "cube", "root", "of"], ["cube", "root", "of"]])
            else: U("root.nth"); head = ["the"] + self.word_leaf(n["index"])[:1] + ["th", "root", "of"]
            if head[1:2] == ["ex"]: head[1] = n["index"]["v"]
            r, e = self.scope("root", n["argument"], 39, follow, paren_ok=True)
            return head + r, INF, e
        if op == "apply":
            fn = n["function"]; tids = ["apply.of", "apply.the_of"] + ([] if fn in ("f", "g", "h") else ["apply.bare"])
            tid = self.choose(tids); U(tid); sp = self.pick(FUNC_SPOKEN[fn]).split()
            head = sp + ["of"] if tid == "apply.of" else ["the"] + sp + ["of"] if tid == "apply.the_of" else sp
            r, e = self.scope("apply", n["argument"], 39, follow, closer=False, paren_ok=True)
            return head + r, INF, e
        if op == "abs":
            U("abs.absolute_value"); r, e = self.scope("abs", n["operand"], 39, follow, paren_ok=True)
            return self.pick([["the", "absolute", "value", "of"], ["absolute", "value", "of"]]) + r, INF, e
        if op == "paren":
            tid = self.choose(["paren.open_close", "paren.paren", "paren.left_right"]); U(tid)
            o, c = {"paren.open_close": ("open parenthesis", "close parenthesis"), "paren.paren": ("open paren", "close paren"),
                    "paren.left_right": ("left parenthesis", "right parenthesis")}[tid]
            toks, _, _ = self.shielded(lambda: self.say(n["operand"], -1, True, True))
            return o.split() + toks + c.split(), INF, INF
        if op in ("sum", "product"):
            U(f"{op}.from_to"); lo, _, _ = self.say(n["lower"], -1, True, False); up, _, _ = self.say(n["upper"], -1, True, False)
            head = self.pick([["the", op, "from"], [op, "from"]]) + self.word_leaf(n["index"]) + ["equals"] + lo + ["to"] + up + ["of"]
            r, e = self.scope(op, n["body"], 39, follow)
            return head + r, INF, e
        if op == "integral":
            body, _, _ = self.say(n["body"], -1, True, True)
            tail = ["d"] + [n["index"]["v"]]
            if "lower" in n:
                U("integral.from_to"); lo, _, _ = self.say(n["lower"], -1, True, False); up, _, _ = self.say(n["upper"], -1, True, False)
                head = self.pick([["the", "integral", "from"], ["integral", "from"]]) + lo + ["to"] + up + ["of"]
            else: U("integral.indefinite"); head = self.pick([["the", "integral", "of"], ["integral", "of"]])
            if self.coin(TEMPLATES["integral.wrt"][FAM_IDX[self.fam]] / 6): U("integral.wrt"); tail = ["with", "respect", "to", n["index"]["v"]]
            return head + body + tail, INF, INF
        raise ValueError(op)

    def fraction(self, n, follow, gs, comma_ok):
        U = self.used.add; num_, den = n["numerator"], n["denominator"]
        opts = ["fraction.the_fraction", "fraction.with_numerator", "fraction.over", "fraction.divided_by"] + (["fraction.all_over"] if gs else [])
        tid = self.choose(opts)
        if tid in ("fraction.over", "fraction.divided_by"):
            ow = ["over"] if tid == "fraction.over" else ["divided", "by"]
            wide_left = gs and not self.closed and self.coin(0.5)
            if wide_left: l, lt, _ = self.say_left(num_, 15, True, comma_ok)
            else:
                l, lt, _ = self.say(num_, 30, gs, False)
                if lt < 30 or (self.closed and not gs): tid = None      # T-left would not read the numerator / would be ambiguous
            if tid:
                U(tid); r, e = self.scope("fraction", den, 30, follow)
                return l + ow + r, (15 if wide_left else min(30, lt)), e
            tid = self.choose(["fraction.the_fraction", "fraction.with_numerator"] + (["fraction.all_over"] if gs else []))
        if tid == "fraction.all_over":
            U(tid); l, _, _ = self.say_left(num_, 15, True, comma_ok); r, e = self.scope("fraction", den, 30, follow)
            return l + ["all", "over"] + r, 15, e
        if tid == "fraction.the_fraction":
            l = self.no_bare_over(num_)
            if l is None: tid = "fraction.with_numerator"
            else:
                U(tid); r, e = self.scope("fraction", den, 30, follow)
                return ["the", "fraction"] + l + ["over"] + r, INF, e
        U("fraction.with_numerator"); l, _, _ = self.say(num_, -1, True, True); r, e = self.scope("fraction", den, 30, follow)
        return ["the", "fraction", "with", "numerator"] + l + ["and", "denominator"] + r, INF, e

    def no_bare_over(self, t):
        """the numerator of 'the fraction A over B' must not hold a bare 'over' outside brackets (it would claim it): say it, retry once"""
        for _ in range(3):
            saved = set(self.used); toks, _, _ = self.say(t, -1, True, True)
            depth_, bad = 0, False
            for k, w in enumerate(toks):
                if w in ("quantity",) and k and toks[k - 1] == "the": depth_ += 1
                elif w == "quantity" and k and toks[k - 1] == "end": depth_ -= 1
                elif w in ("parenthesis", "paren") and k and toks[k - 1] in ("open", "left"): depth_ += 1
                elif w in ("parenthesis", "paren") and k and toks[k - 1] in ("close", "right"): depth_ -= 1
                elif depth_ == 0 and (w == "over" and not (k and toks[k - 1] == "all") or w == "divided" and not (k and toks[k - 1] == "all")): bad = True
            if not bad: return toks
            self.used = saved
        return None

    def power(self, n, follow, gs, comma_ok):
        U = self.used.add; b, ex = n["base"], n["exponent"]
        sq = ex in (leaf("num", "2"), leaf("num", "3"))
        opts = (["power.squared" if ex == leaf("num", "2") else "power.cubed"] if sq else []) + ["power.to_the", "power.to_the_power_of", "power.raised_to"]
        if sq and gs: opts.append("power.all_squared")
        tid = self.choose(opts)
        if tid in ("power.squared", "power.cubed"):
            l, lt, _ = self.say(b, 70, gs, False)
            word = "squared" if ex["v"] == "2" else "cubed"
            U(tid); return l + [word], min(70, lt), INF
        if tid == "power.all_squared":
            U(tid); l, _, _ = self.say_left(b, 15, True, comma_ok)
            return l + ["all", "squared" if ex["v"] == "2" else "cubed"], 15, INF
        U(tid); l, lt, _ = self.say(b, 50, gs, False)
        if lt <= 50: l, lt, _ = self.group(b)
        r, e = self.scope("power", ex, 49, follow)
        w = {"power.to_the": ["to", "the"], "power.to_the_power_of": ["to", "the", "power", "of"], "power.raised_to": ["raised", "to", "the"]}[tid]
        return l + w + r, min(50, lt), e


# ------------------------------------------------------------------ the reference parser through node
def run_batch(reqs):
    with tempfile.TemporaryDirectory() as td:
        ip, op = os.path.join(td, "in.jsonl"), os.path.join(td, "out.jsonl")
        with open(ip, "w") as f:
            for q in reqs: f.write(json.dumps(q) + "\n")
        subprocess.run(["node", os.path.join(HERE, "parse_batch.mjs"), ip, op], check=True)
        return {r["id"]: r for r in (json.loads(l) for l in open(op) if l.strip())}


# ------------------------------------------------------------------ commands (spec 16.4)
PREFIXES = [("bare", ""), ("please", "please"), ("could", "could you"), ("can", "can you"), ("now", "now"), ("okay", "okay so"),
            ("lets", "let's"), ("want", "i want you to"), ("tail", "")]
ROLE_TARGETS = ["numerator", "denominator", "exponent", "base", "index", "argument", "body"]
OP_TARGETS = ["fraction", "power", "root", "sum", "integral", "parentheses", "plus", "minus", "times"]


class CommandGen:
    def __init__(self, rng, vars_, nums, family="informal"):
        self.r, self.vars, self.nums = rng, vars_, nums; self.tg = TreeGen(rng, vars_, nums)
    def pick(self, xs, w=None):
        if w is None: return xs[int(self.r.integers(len(xs)))]
        p = np.array(w, float); p /= p.sum(); return xs[int(self.r.choice(len(xs), p=p))]
    def coin(self, p): return self.r.random() < p
    def target(self, allow_every=False):
        """(words, target {head, attr, det}, owner)"""
        k = self.pick(["role", "term", "side", "whole", "op", "symbol", "pron", "selection", "limit"], [5, 3, 1, 2, 1.5, 1.5, 1.5, 0.5, 0.7])
        if k == "role":
            h = self.pick(ROLE_TARGETS)
            if h in ("exponent", "base", "index") and self.coin(0.3):
                o = self.pick(self.vars); return ["the", h, "of", o], {"head": h, "attr": None, "det": "the"}, o
            if self.coin(0.15): a = self.pick(["first", "second", "last"]); return ["the", a, h], {"head": h, "attr": a, "det": "the"}, None
            return ["the", h], {"head": h, "attr": None, "det": "the"}, None
        if k == "term":
            h = self.pick(["term", "factor"], [4, 1]); a = self.pick(["first", "second", "third", "last"])
            return ["the", a, h], {"head": h, "attr": a, "det": "the"}, None
        if k == "side":
            a = self.pick(["left", "right"]); hand = ["hand"] if self.coin(0.3) else []
            return ["the", a] + hand + ["side"], {"head": "side", "attr": a, "det": "the"}, None
        if k == "whole":
            h = self.pick(["thing", "formula", "expression"]); return ["the", "whole", h], {"head": h, "attr": "whole", "det": "the"}, None
        if k == "op":
            h = self.pick(OP_TARGETS)
            if self.coin(0.3): a = self.pick(["first", "second"]); return ["the", a, h], {"head": h, "attr": a, "det": "the"}, None
            return ["the", h], {"head": h, "attr": None, "det": "the"}, None
        if k == "symbol":
            s = self.pick([str(self.pick(self.nums)), self.pick(self.vars)], [1, 3])
            if allow_every and self.coin(0.3): d = self.pick(["every", "all"]); return ([d, "the", s] if d == "all" and self.coin(0.5) else [d, s]), {"head": s, "attr": None, "det": d}, None
            return [s], {"head": s, "attr": None, "det": None}, None
        if k == "pron": h = self.pick(["it", "that", "this"]); return [h], {"head": h, "attr": None, "det": None}, None
        if k == "limit": a = self.pick(["upper", "lower"]); return ["the", a, "limit"], {"head": "limit", "attr": a, "det": "the"}, None
        return ["the", "selection"], {"head": "selection", "attr": None, "det": "the"}, None
    def value(self):
        return self.tg.gen(int(self.pick([0, 1, 2], [4, 4, 1])))


def frame(event, **kw):
    f = {"event": event, "target": None, "owner": None, "value": None, "word": None, "wrapper": None, "joiner": None, "position": None, "direction": None}
    f.update(kw); return f


CMD_TEMPLATES = collections.OrderedDict()
def C(event):
    def deco(fn): CMD_TEMPLATES[f"{event}.{fn.__name__}"] = (event, fn); return fn
    return deco
# each returns (words with VALUE placeholder tokens, frame, sop extras); the value tree is spliced in by the caller
@C("replace")
def r_with(g):
    w, t, o = g.target(allow_every=True); return ["replace"] + w + ["with", "<V>"], frame("replace", target=t, owner=o), {}
@C("replace")
def r_change(g):
    w, t, o = g.target(); v = g.pick(["change", "set"]); return [v] + w + ["to", "<V>"], frame("replace", target=t, owner=o), {}
@C("replace")
def r_subst(g):
    w, t, o = g.target(allow_every=True); return ["substitute", "<V>", "for"] + w, frame("replace", target=t, owner=o), {}
@C("replace")
def r_op(g):
    a, b = g.pick([("plus", "minus"), ("minus", "plus"), ("times", "plus"), ("plus", "times")])
    pre = [g.pick(["first", "second"])] if g.coin(0.3) else []
    return ["change", "the"] + pre + [a, "to", b], frame("replace", target={"head": a, "attr": pre[0] if pre else None, "det": "the"}, word=b), {"value_word": b}
@C("delete")
def d_plain(g):
    w, t, o = g.target(allow_every=True); return [g.pick(["delete", "remove", "erase"])] + w, frame("delete", target=t, owner=o), {}
@C("wrap")
def w_paren(g):
    w, t, o = g.target(); wr = g.pick(["parentheses", "brackets"])
    return [g.pick(["wrap", "put", "enclose"])] + w + ["in", wr], frame("wrap", target=t, owner=o, wrapper="parentheses"), {"wrapper_word": wr}
@C("wrap")
def w_over(g):
    w, t, o = g.target(); return ["put"] + w + ["over", "<V>"], frame("wrap", target=t, owner=o, wrapper="fraction"), {"wrapper_word": "fraction"}
@C("wrap")
def w_make(g):
    w, t, o = g.target()
    if g.coin(0.5): return ["make"] + w + ["a", "fraction"], frame("wrap", target=t, owner=o, wrapper="fraction"), {"wrapper_word": "fraction"}
    return ["turn"] + w + ["into", "a", "fraction"], frame("wrap", target=t, owner=o, wrapper="fraction"), {"wrapper_word": "fraction"}
@C("wrap")
def w_root(g):
    w, t, o = g.target()
    if g.coin(0.5): return ["take", "the", "square", "root", "of"] + w, frame("wrap", target=t, owner=o, wrapper="root"), {"wrapper_word": "root"}
    return ["put"] + w + ["under", "a", "square", "root"], frame("wrap", target=t, owner=o, wrapper="root"), {"wrapper_word": "root"}
@C("wrap")
def w_abs(g):
    w, t, o = g.target()
    if g.coin(0.5): return ["take", "the", "absolute", "value", "of"] + w, frame("wrap", target=t, owner=o, wrapper="abs"), {"wrapper_word": "absolute"}
    return ["put"] + w + ["in", "absolute", "value", "bars"], frame("wrap", target=t, owner=o, wrapper="abs"), {"wrapper_word": "absolute"}
@C("insert")
def i_after(g):
    w, t, o = g.target(); j = g.pick([None, "plus", "minus", "times"], [1, 3, 2, 1]); pos = g.pick(["after", "before"], [3, 1])
    return [g.pick(["insert", "add"])] + ([j] if j else []) + ["<V>", pos] + w, frame("insert", target=t, owner=o, joiner=j, position=pos), {}
@C("insert")
def i_end(g):
    j = g.pick([None, "plus", "minus", "times"], [1, 3, 2, 1]); pos = g.pick(["end", "beginning", "start"], [3, 1, 1])
    return [g.pick(["add", "append", "insert"])] + ([j] if j else []) + ["<V>", "at", "the", pos], frame("insert", joiner=j, position="end" if pos == "end" else "start"), {"position_word": pos}
@C("insert")
def i_type(g):
    j = g.pick([None, "plus", "minus", "times"], [3, 2, 1, 1]); return ["type"] + ([j] if j else []) + ["<V>"], frame("insert", joiner=j), {}
@C("move")
def m_to(g):
    w, t, o = g.target(); head = g.pick([["move", "the", "cursor", "to"], ["go", "to"], ["move", "to"]])
    return head + w, frame("move", target=t, owner=o), {}
@C("move")
def m_dir(g):
    d = g.pick(["left", "right", "up", "down"]); head = g.pick([["move"], ["go"], ["move", "the", "cursor"]])
    return head + [d], frame("move", direction=d), {}
@C("select")
def s_plain(g):
    w, t, o = g.target(); return [g.pick(["select", "highlight"])] + w, frame("select", target=t, owner=o), {}
@C("factor")
def f_out(g):
    if g.coin(0.5):
        w, t, o = g.target(); return ["factor", "out", "<V>", "from"] + w, frame("factor", target=t, owner=o), {}
    return ["factor", "out", "<V>"], frame("factor"), {}
@C("factor")
def f_of(g):
    w, t, o = g.target(); return ["factor", "<V>", "out", "of"] + w, frame("factor", target=t, owner=o), {}
@C("swap")
def sw(g):
    v = g.pick([["swap", "the", "sides"], ["swap", "sides"], ["flip", "the", "equation"]])
    return v, frame("swap", target={"head": v[-1] if v[-1] != "sides" else "sides", "attr": None, "det": "the" if "the" in v else None}), {}
@C("undo")
def ud(g): return ["undo"], frame("undo"), {}
@C("redo")
def rd(g): return ["redo"], frame("redo"), {}
CMD_WEIGHTS = {"replace": 6, "delete": 3, "wrap": 4, "insert": 3, "move": 2.5, "select": 1.5, "factor": 1, "swap": 0.7, "undo": 0.5, "redo": 0.3}
NO_VALUE_FACTORS = {"factor"}


# ------------------------------------------------------------------ SOP wires
def tree_wires(t, ids, out):
    """the wires of a tree; returns the value of the role that holds it (a word, or ('ref', id))"""
    if t["op"] in LEAVES: return t["v"]
    w = soplang.Wire(next(ids), t["op"]); out.append(w)
    if t["op"] == "apply": w.set("function", t["function"])
    for r, c in kids(t):
        v = tree_wires(c, ids, out); w.set(r, v if isinstance(v, str) else v)
    return ("ref", w.id)


def formula_wires(rec, ids):
    out = []; top = soplang.Wire(next(ids), "expr"); out.append(top)
    top.lines = [soplang.Line("_text", rec["text"]), soplang.Line("_world", "matheditor"), soplang.Line("_source", "generator"),
                 soplang.Line("_template", rec["template"]), soplang.Line("_mood", "dictation")]
    top.set("_family", rec["family"]); top.set("_tree_depth", str(rec["depth"])); top.set("_spoken", rec["spoken"])
    vals = [tree_wires(t, ids, out) for t in rec["readings"]]
    if len(vals) == 1: top.set("root", vals[0])
    else:
        top.set("root", ("|", vals)); top.set("_readings", str(len(vals))); top.set("_intended", str(rec["intended"] + 1))
    return out


def command_wires(rec, ids):
    f, ex = rec["frame"], rec["extras"]; out = []
    top = soplang.Wire(next(ids), f["event"]); out.append(top)
    top.lines = [soplang.Line("_text", rec["text"]), soplang.Line("_world", "matheditor"), soplang.Line("_source", "generator"),
                 soplang.Line("_template", rec["template"]), soplang.Line("_mood", "command")]
    later = []
    if f["target"]:
        en = soplang.Wire(next(ids), "entity"); en.set("head", f["target"]["head"])
        if f["target"]["attr"]: en.set("attr", f["target"]["attr"])
        if f["target"]["det"]: en.set("det", f["target"]["det"])
        top.set("target", ("ref", en.id)); later.append(en)
    if f["owner"]: top.set("owner", f["owner"])
    if f["word"]: top.set("value", f["word"])
    elif f["value"] is not None:
        sub = []; v = tree_wires(f["value"], ids, sub); top.set("value", v); later += sub
    if f["wrapper"]: top.set("wrapper", ex.get("wrapper_word", f["wrapper"]))
    if f["joiner"]: top.set("joiner", f["joiner"])
    if f["position"]: top.set("position", ex.get("position_word", f["position"]))
    if f["direction"]: top.set("direction", f["direction"])
    return out + later


# ------------------------------------------------------------------ build
def h01(seed, s): return int(hashlib.sha256(f"{seed}:{s}".encode()).hexdigest()[:8], 16) / 2 ** 32


def build(out, n, n_eval, seed, cmd_share=0.3, amb_share=0.12, quiet=False):
    rng = np.random.default_rng(seed)
    log = (lambda *a: None) if quiet else print
    fams = list(FAMILIES)
    all_tids = sorted(set(TEMPLATES) | set(FIXED) | set(DELIMS))
    # held-out formulation pairs (family, template): ~12% of the pairs of the weighted templates, each template keeping >= 2 families
    pairs = [(f, t) for t in sorted(TEMPLATES) for f in fams if TEMPLATES[t][FAM_IDX[f]] > 0]
    held = set()
    for f, t in sorted(pairs, key=lambda p: h01(seed, "pair:" + "|".join(p))):
        if len(held) >= int(0.12 * len(pairs)): break
        left_t = [ff for ff in fams if TEMPLATES[t][FAM_IDX[ff]] > 0 and (ff, t) not in held and ff != f]
        if len(left_t) >= 2: held.add((f, t))
    cmd_combos = [(tid, p) for tid in CMD_TEMPLATES for p in PREFIXES]
    cmd_held = {f"{tid}.{p[0]}" for tid, p in cmd_combos if p[0] != "bare" and h01(seed, f"cmd:{tid}.{p[0]}") < 0.12}

    def is_held(rec): return any((rec["family"], t) in held for t in rec["templates"])

    # --- formulas: candidates, parsed in batches
    def formula_candidates(k, depths, vars_, nums, rs, tag):
        tg = TreeGen(rs, vars_, nums); reqs, meta = [], {}
        for i in range(k):
            d = int(tg.pick(depths[0], depths[1])); t = tg.gen(d, top=True); fam = tg.pick(fams)
            for j, closed in enumerate([False, False, True]):
                v = Verbaliser(rs, fam, closed); toks, _, _ = v.say(t, -1, True, True)
                cid = f"{tag}{i}.{j}"; meta[cid] = {"tree": t, "family": fam, "templates": sorted(v.used), "spoken": " ".join(toks), "depth": d, "i": i}
                reqs.append({"id": cid, "kind": "formula", "text": " ".join(toks)})
        res = run_batch(reqs); errors = collections.Counter()
        for cid, m in meta.items():
            r = res[cid]; m["text"] = " ".join(r["tokens"]); m["status"] = r["status"]
            m["readings"] = r["readings"]; keys = [canon(x) for x in r["readings"]]
            if canon(m["tree"]) not in keys: errors["source not among the readings" if r["status"] != "no-parse" else "no-parse: " + r["reason"][:60]] += 1; m["bad"] = True; continue
            m["intended"] = keys.index(canon(m["tree"]))
        return meta, errors

    def select(meta, mode, cap, accept):
        """mode: mix (about amb_share ambiguous), unamb, only (ambiguous only); one sentence per drawn tree, no repeated sentence"""
        by = collections.defaultdict(list)
        for cid, m in meta.items(): by[m["i"]].append(m)
        n_amb_target = int(cap * amb_share) if mode == "mix" else (cap if mode == "only" else 0)
        out, texts, n_amb = [], set(), 0
        for i in sorted(by):
            ms = [m for m in by[i] if not m.get("bad") and accept(m)]
            amb = [m for m in ms if m["status"] == "ambiguous" and len(m["readings"]) <= 4]
            una = [m for m in ms if m["status"] == "ok"]
            if amb and n_amb < n_amb_target: m = amb[0]
            elif una and mode != "only": m = una[int(rng.integers(len(una)))]
            else: continue
            if m["text"] in texts: continue
            texts.add(m["text"]); out.append(m); n_amb += m["status"] == "ambiguous"
            if len(out) >= cap: break
        return out

    def finish(m):
        m["template"] = m["family"] + ":" + ",".join(m["templates"]); m["depth"] = depth(m["tree"]); return m

    n_cmd = int(n * cmd_share); n_form = n - n_cmd
    vars_train, nums_train = LATIN_TRAIN + GREEK_TRAIN, [str(x) for x in NUMS_TRAIN]
    vars_new, nums_new = LATIN_NEW + GREEK_NEW, [str(x) for x in NUMS_NEW]
    all_errors = collections.Counter()
    meta, err = formula_candidates(int(n_form * 1.6) + 50, ([0, 1, 2], [0.05, 0.4, 0.55]), vars_train, nums_train, np.random.default_rng(100 + seed), "t"); all_errors += err
    train_f = [finish(m) for m in select(meta, "mix", n_form, lambda m: not is_held(m))]
    held_meta = [finish(m) for m in select(meta, "mix", 10 ** 9, lambda m: is_held(m))]
    train_texts = {m["text"] for m in train_f}
    ev_form = [m for m in held_meta if m["text"] not in train_texts][:n_eval]
    train_hops = set().union(*[hops(m["tree"]) for m in train_f]) if train_f else set()
    meta3, err = formula_candidates(n_eval * 4, ([3], [1.0]), vars_train, nums_train, np.random.default_rng(300 + seed), "d"); all_errors += err
    ev_depth = [finish(m) for m in select(meta3, "mix", n_eval, lambda m: not is_held(m) and hops(m["tree"]) <= train_hops)]
    meta_new, err = formula_candidates(n_eval * 3, ([1, 2], [0.4, 0.6]), vars_new + vars_train[:4], nums_new, np.random.default_rng(400 + seed), "n"); all_errors += err
    ev_new = [finish(m) for m in select(meta_new, "unamb", n_eval, lambda m: not is_held(m) and leaf_words(m["tree"]) & set(vars_new + nums_new))]
    meta_amb, err = formula_candidates(n_eval * 14, ([1, 2], [0.4, 0.6]), vars_train, nums_train, np.random.default_rng(500 + seed), "a"); all_errors += err
    ev_amb = [finish(m) for m in select(meta_amb, "only", n_eval, lambda m: not is_held(m) and m["text"] not in train_texts)]

    # --- commands
    def commands(k, combos, vars_, nums, rs, tag):
        g = CommandGen(rs, vars_, nums); reqs, meta = [], {}
        w_ev = np.array([CMD_WEIGHTS[CMD_TEMPLATES[c[0]][0]] / sum(1 for t in CMD_TEMPLATES if CMD_TEMPLATES[t][0] == CMD_TEMPLATES[c[0]][0]) for c in combos])
        w_ev /= w_ev.sum()
        for i in range(k):
            tid, (pid, ptxt) = combos[int(rs.choice(len(combos), p=w_ev))]
            ev, fn = CMD_TEMPLATES[tid]; words, fr, ex = fn(g)
            if "<V>" in words:
                for _try in range(8):        # "add minus a at the end" would read "minus" as the joiner: such a value is redrawn
                    val = g.value(); v = Verbaliser(rs, g.pick(fams), True); vt, _, _ = v.say(val, -1, True, True)
                    if vt[0] not in ("minus", "plus", "times", "over", "divided", "multiplied"): break
                k_ = words.index("<V>"); words = words[:k_] + vt + words[k_ + 1:]; fr["value"] = val
            if pid == "tail": words = words + ["please"]
            elif ptxt: words = ptxt.split() + words
            cid = f"{tag}{i}"; meta[cid] = {"frame": fr, "extras": ex, "template": f"{tid}.{pid}", "spoken": " ".join(words), "event": ev}
            reqs.append({"id": cid, "kind": "command", "text": " ".join(words)})
        res = run_batch(reqs); kept, bad = [], collections.Counter()
        for cid, m in meta.items():
            r = res[cid]; m["text"] = " ".join(r["tokens"])
            if r["status"] != "ok" or canon(r["frame"]) != canon(m["frame"]): bad[f"command not read back ({m['template'].split('.')[0]}.{m['template'].split('.')[1]}): {r['reason'][:50]}"] += 1; continue
            kept.append(m)
        return kept, bad
    cmd_train_combos = [c for c in cmd_combos if f"{c[0]}.{c[1][0]}" not in cmd_held]
    cmd_held_combos = [c for c in cmd_combos if f"{c[0]}.{c[1][0]}" in cmd_held]
    train_c, err = commands(n_cmd, cmd_train_combos, vars_train, nums_train, np.random.default_rng(600 + seed), "c"); all_errors += err
    ev_cmd, err = commands(max(n_eval // 2, 1), cmd_held_combos, vars_train, nums_train, np.random.default_rng(601 + seed), "h"); all_errors += err

    # --- the edit suite: commands against random formulas, with the formula after the edit (reference executor)
    suite_reqs, suite_meta = [], {}
    tg = TreeGen(np.random.default_rng(700 + seed), vars_train, nums_train)
    pool = train_c[: max(1, n_eval)] + ev_cmd
    for i, m in enumerate(pool):
        for j in range(8):
            ctx = tg.gen(int(tg.pick([1, 2, 3], [0.3, 0.5, 0.2])), top=True)
            sid = f"e{i}.{j}"; suite_meta[sid] = (i, ctx); suite_reqs.append({"id": sid, "kind": "edit", "context": ctx, "frame": m["frame"]})
    sres = run_batch(suite_reqs); suite, done = [], set()
    for sid in sorted(suite_meta, key=lambda s: tuple(int(x) for x in s[1:].split("."))):
        i, ctx = suite_meta[sid]; r = sres[sid]
        if i in done or r["status"] != "ok" or pool[i]["event"] in ("undo", "redo"): continue
        done.add(i); m = pool[i]
        suite.append({"command": m["text"], "frame": m["frame"], "extras": m["extras"], "template": m["template"], "context": ctx, "context_latex": r["latex_before"],
                      "expected": r["after"], "expected_latex": r["latex_after"], "reason": r["reason"],
                      "split": "heldout_formulations" if m in ev_cmd else "train"})

    # --- write the world
    legend = make_legend()
    wd = out; [os.makedirs(os.path.join(wd, d), exist_ok=True) for d in ("examples", "raw", "audit", "model", "runs", "versions", "requests")]
    lp = os.path.join(wd, "legend.json"); json.dump(legend, open(lp, "w"), indent=1)
    kinds = make_kinds()
    with open(os.path.join(wd, "kinds.tsv"), "w") as f:
        f.write("# word\tkind: the matheditor world's categories (GIVEN, rule 20); numbers by the legend's value pattern\n")
        for w in sorted(kinds): f.write(f"{w}\t{kinds[w]}\n")
    sha = sha256_file(lp)
    json.dump({"name": "matheditor", "language": "en", "description": "VSS Diagram Editor, formula widgets (vision/VSS_Diagram_Editor_Specification.md, section 16)",
               "created": datetime.date.today().isoformat(), "version": 1, "min_examples": 500, "max_versions_per_run": 3,
               "models": {"pipeline": "claude-haiku-5-5", "annotate": "claude-haiku-5-5", "second_look": "claude-haiku-5-5", "evolve": "claude-opus-5-5"},
               "second_look_escalate": 0.05, "second_look_retrain": 0.05}, open(os.path.join(wd, "world.json"), "w"), indent=1)

    def write(fname, frecs, crecs=()):
        doc = soplang.Doc(directives=[("world", "matheditor", None), ("legend", sha, None), ("generated", f"training/worlds/matheditor/generate.py seed {seed} ({datetime.date.today()})", None)])
        k = 0; recs = [("f", r) for r in frecs] + [("c", r) for r in crecs]
        order = sorted(range(len(recs)), key=lambda i: h01(seed, f"order:{fname}:{i}"))
        for i in order:
            kind, rec = recs[i]; ids = iter(f"w{k + j}" for j in range(1, 400))
            ws = formula_wires(rec, ids) if kind == "f" else command_wires(rec, ids); k += len(ws); doc.wires += ws
        open(os.path.join(wd, "examples", fname), "w").write(soplang.write(doc))
    write("train.sop", train_f, train_c); write("eval_heldout_formulations.sop", ev_form, ev_cmd); write("eval_unseen_depth.sop", ev_depth)
    write("eval_new_identities.sop", ev_new); write("eval_ambiguous.sop", ev_amb)
    with open(os.path.join(wd, "raw", "edit_suite.jsonl"), "w") as f:
        for s in suite: f.write(json.dumps(s) + "\n")
    # the suite's commands, one per line (input of `sop formalize`), and their gold wires (eval_edit_suite.py --reading raw/edit_suite.sop
    # checks the evaluation chain itself: 100% by construction)
    open(os.path.join(wd, "raw", "edit_suite.txt"), "w").write("".join(s["command"] + "\n" for s in suite))
    doc = soplang.Doc(directives=[("world", "matheditor", None), ("legend", sha, None)]); k = 0
    for s in suite:
        ids = iter(f"w{k + j}" for j in range(1, 400)); ws = command_wires({"frame": s["frame"], "extras": s.get("extras", {}), "text": s["command"],
                                                                         "template": s["template"]}, ids); k += len(ws); doc.wires += ws
    open(os.path.join(wd, "raw", "edit_suite.sop"), "w").write(soplang.write(doc))
    open(os.path.join(wd, "raw", "sentences.txt"), "w").write("\n".join(m["text"] for m in (train_f + train_c)[:2000]) + "\n")
    hints = {"heldout_sentence_share": 0.1, "new_identities": vars_new + nums_new,
             "file_splits": {"examples/eval_new_identities.sop": "new_identities", "examples/eval_heldout_formulations.sop": "heldout_formulations",
                             "examples/eval_unseen_depth.sop": "heldout_depth", "examples/eval_ambiguous.sop": "ambiguous"},
             "heldout_formulation_pairs": sorted("|".join(p) for p in held), "heldout_command_combinations": sorted(cmd_held),
             "protocol": ("matheditor world: formulas to tree depth 2 in training, depth 3 held out (every hop seen, rule 29); held-out formulations = "
                          "(family, operator template) pairs whose family and template both occur in training, and command (template, prefix) "
                          "combinations; new identities = variables and numbers never in training; ambiguous sentences carry every reading of the "
                          "reference parser as alternatives (root=$a | $b, _readings=n)")}
    json.dump(hints, open(os.path.join(wd, "split_hints.json"), "w"), indent=1)
    if not os.path.exists(os.path.join(wd, "status.json")): json.dump({"label": None, "note": "never trained"}, open(os.path.join(wd, "status.json"), "w"))
    coverage(seed, n, sha, train_f, train_c, ev_form, ev_cmd, ev_depth, ev_new, ev_amb, suite, held, cmd_held, all_errors, train_hops)
    log(f"matheditor world written to {wd}: train {len(train_f)} formulas ({sum(1 for m in train_f if m['status'] == 'ambiguous')} ambiguous) + {len(train_c)} commands; "
        f"held-out formulations {len(ev_form)} + {len(ev_cmd)} commands; unseen depth {len(ev_depth)}; new identities {len(ev_new)}; ambiguous {len(ev_amb)}; "
        f"edit suite {len(suite)}; legend {sha[:19]}; verbaliser candidates rejected: {sum(all_errors.values())}")
    return wd


def make_legend():
    roles = [("root", "which formula (the tree)?"), ("left", "the left operand?"), ("right", "the right operand?"), ("numerator", "the numerator?"),
             ("denominator", "the denominator?"), ("base", "the base?"), ("exponent", "the exponent?"),
             ("index", "the index (subscript, degree of a root, variable of a sum, product or integral)?"), ("lower", "the lower limit?"),
             ("upper", "the upper limit?"), ("body", "the body (of a sum, product or integral)?"), ("argument", "the argument (of a function or root)?"),
             ("operand", "the operand (of brackets, absolute value, negation)?"), ("function", "which function?"),
             ("target", "which part of the formula is edited?"), ("owner", "of which symbol (the exponent OF x)?"), ("value", "the new expression or operator?"),
             ("wrapper", "wrapped in what?"), ("joiner", "joined by which operator?"), ("position", "where (after, before, at the end, at the start)?"),
             ("direction", "the cursor moves which way?")]
    events = [("expr", ["write"]), ("plus", ["plus"]), ("minus", ["minus"]), ("times", ["times", "multiplied"]), ("fraction", ["over", "divided", "fraction"]),
              ("power", ["power", "squared", "cubed", "to", "raised"]), ("subscript", ["sub", "subscript"]), ("root", ["root"]),
              ("apply", ["sin", "cos", "tan", "log", "ln", "exp", "f", "g", "h"]), ("paren", ["parenthesis", "paren"]), ("abs", ["absolute"]),
              ("neg", ["negative"]), ("sum", ["sum"]), ("product", ["product"]), ("integral", ["integral"]), ("equals", ["equals", "equal"]),
              ("less", ["less"]), ("greater", ["greater"]), ("approx", ["approximately"]), ("implies", ["implies"]),
              ("insert", ["insert", "add", "append", "type"]), ("replace", ["replace", "change", "substitute", "set"]), ("delete", ["delete", "remove", "erase"]),
              ("wrap", ["wrap", "put", "make", "turn", "enclose", "take"]), ("move", ["move", "go"]), ("select", ["select", "highlight"]),
              ("factor", ["factor"]), ("swap", ["swap", "flip"]), ("undo", ["undo"]), ("redo", ["redo"])]
    return {"version": 1, "roles": [{"id": r, "question": q} for r, q in roles], "events": [{"id": e, "verbs": vs} for e, vs in events],
            "operators": [], "moods": ["dictation", "command"], "kinds": {"source": "lexicon", "lexicon": "kinds.tsv"},
            "values": [{"kind": "NUM", "pattern": "\\d+"}],
            "reader": {"predicate_role": True, "occupancy_marker": True, "definite_dets": ["the"]},
            "tree_levels": {
                "level_opener_kinds": ["OVER", "POWER", "SUB", "ROOT", "FUNC", "SUM", "INTEGRAL", "ABS", "OPEN", "QUANTITY", "PLUS", "MINUS", "TIMES", "NEG", "REL"],
                "nesting": "an expression wire's role holds another expression wire ($ref); the tree depth is the number of operator levels",
                "ambiguity": "alternatives on the root role (root=$a | $b) with _readings=n; the scope rule is app/src/formula/parse.js (header)",
                "note": ("declared here, NOT in reader.level_openers: the tool's depth estimator counts level-opener tokens as reporting (says) levels, "
                         "which this world does not have; the nested-event decoder that uses this block is the extension in "
                         "training/TODO_DGX.md")}}


def make_kinds():
    K = {}
    for v in LATIN_TRAIN + LATIN_NEW + GREEK_TRAIN + GREEK_NEW: K[v] = "VAR"
    for c in CONSTS: K[c] = "CONST"
    for f in FUNCS: K[f] = "FUNC"
    ops = {"plus": "PLUS", "minus": "MINUS", "times": "TIMES", "multiplied": "TIMES", "by": "by", "over": "OVER", "divided": "OVER", "all": "all",
           "fraction": "fraction", "with": "with", "numerator": "TARGET", "and": "and", "denominator": "TARGET", "the": "the", "quantity": "QUANTITY",
           "end": "end", "of": "of", "to": "to", "power": "POWER", "raised": "POWER", "squared": "POWER", "cubed": "POWER", "sub": "SUB",
           "subscript": "SUB", "square": "square", "cube": "cube", "root": "ROOT", "th": "th", "absolute": "ABS", "value": "value", "open": "OPEN",
           "close": "close", "left": "left", "right": "right", "parenthesis": "OPEN", "paren": "OPEN", "bracket": "OPEN", "sum": "SUM", "product": "SUM",
           "from": "from", "integral": "INTEGRAL", "d": "d", "respect": "respect", "is": "is", "equal": "REL", "equals": "REL", "less": "REL",
           "greater": "REL", "than": "than", "approximately": "REL", "implies": "REL", "negative": "NEG", ",": ",", "exponent": "TARGET"}
    K.update(ops)
    for v in ["replace", "substitute", "change", "set", "delete", "remove", "erase", "select", "highlight", "wrap", "enclose", "put", "make", "turn",
              "take", "insert", "add", "append", "type", "move", "go", "factor", "swap", "flip", "undo", "redo"]: K[v] = "VERB"
    for w in ["base", "index", "argument", "body", "term", "side", "sides", "thing", "formula", "expression", "equation", "everything", "selection",
              "cursor", "limit", "operand", "hand"]: K[w] = "TARGET"
    for w in ["first", "second", "third", "fourth", "fifth", "last", "whole", "upper", "lower", "next", "previous"]: K[w] = "ORD"
    for w in ["it", "that", "this"]: K[w] = "PRON"
    for w in ["every", "each"]: K[w] = "QUANT"
    for w in ["after", "before", "beginning", "start"]: K[w] = "POS"
    for w in ["up", "down"]: K[w] = "DIR"
    for w in ["parentheses", "brackets", "bars"]: K[w] = "WRAPPER"
    for w in ["in", "into", "for", "under", "at", "out"]: K[w] = w
    for w in ["please", "now", "okay", "so", "could", "can", "you", "i", "want", "lets", "then", "also"]: K.setdefault(w, "FILLER")
    K["i"] = "VAR"      # "i" is a variable (the index of sums); the prefix "i want you to" reads it as a token of kind VAR
    K["a"] = "VAR"      # "a" is a variable; in "make it a fraction" the token is the same word (kinds are one per token)
    return K


def coverage(seed, n, sha, train_f, train_c, ev_form, ev_cmd, ev_depth, ev_new, ev_amb, suite, held, cmd_held, errors, train_hops):
    ops, roles, tmpl, fam = collections.Counter(), collections.Counter(), collections.Counter(), collections.Counter()
    dep, nread = collections.Counter(), collections.Counter()
    def walk(t):
        if t["op"] in LEAVES: return
        ops[t["op"]] += 1
        for r, c in kids(t): roles[(t["op"], r)] += 1; walk(c)
    for m in train_f:
        walk(m["tree"]); fam[m["family"]] += 1; dep[m["depth"]] += 1; nread[len(m["readings"])] += 1
        for t in m["templates"]: tmpl[t] += 1
    cev, crole = collections.Counter(), collections.Counter()
    for m in train_c:
        cev[m["event"]] += 1
        for k, v in m["frame"].items():
            if k != "event" and v is not None: crole[(m["event"], k)] += 1
    L = [f"# Coverage of the matheditor world (generate.py seed {seed}, n = {n})", "",
         f"Legend {sha}. Training: {len(train_f)} formulas and {len(train_c)} commands. Verbaliser candidates rejected (the drawn tree was not "
         f"a reading of its own sentence, or a command was not read back): {sum(errors.values())}" + (" (" + "; ".join(f"{k}: {v}" for k, v in errors.most_common(6)) + ")" if errors else "") + ".", "",
         "## Formulas in training", "", "| tree depth | sentences |", "|---|---|"] + [f"| {d} | {dep[d]} |" for d in sorted(dep)]
    L += ["", "| readings per sentence | sentences |", "|---|---|"] + [f"| {k} | {nread[k]} |" for k in sorted(nread)]
    L += ["", "| family | sentences |", "|---|---|"] + [f"| {f} | {fam[f]} |" for f in FAMILIES]
    L += ["", "| operator | nodes | roles (count) |", "|---|---|---|"]
    for o in ROLES: L.append(f"| {o} | {ops[o]} | " + ", ".join(f"{r} {roles[(o, r)]}" for r in ROLES[o]) + " |")
    L += ["", "| template | sentences | held out with families |", "|---|---|---|"]
    for t in sorted(set(TEMPLATES) | set(FIXED) | set(DELIMS)):
        L.append(f"| {t} | {tmpl[t]} | {', '.join(f for f, tt in sorted(held) if tt == t)} |")
    L += ["", f"Hops (parent operator, role, child kind) seen in training: {len(train_hops)}.", "", "## Commands in training", "",
          "| event | n | " + " | ".join(["target", "owner", "value", "word", "wrapper", "joiner", "position", "direction"]) + " |", "|---|---|" + "---|" * 8]
    for e in CMD_WEIGHTS:
        L.append(f"| {e} | {cev[e]} | " + " | ".join(str(crole[(e, k)]) if crole[(e, k)] else "" for k in ["target", "owner", "value", "word", "wrapper", "joiner", "position", "direction"]) + " |")
    L += ["", "## Evaluation files", "", "| file | formulas | commands | ambiguous |", "|---|---|---|---|",
          f"| eval_heldout_formulations.sop | {len(ev_form)} | {len(ev_cmd)} | {sum(1 for m in ev_form if m['status'] == 'ambiguous')} |",
          f"| eval_unseen_depth.sop (depth 3, every hop seen) | {len(ev_depth)} | 0 | {sum(1 for m in ev_depth if m['status'] == 'ambiguous')} |",
          f"| eval_new_identities.sop | {len(ev_new)} | 0 | {sum(1 for m in ev_new if m['status'] == 'ambiguous')} |",
          f"| eval_ambiguous.sop | {len(ev_amb)} | 0 | {len(ev_amb)} |",
          f"| raw/edit_suite.jsonl (command on a formula, expected formula after) | {len(suite)} | | |", "",
          f"Held-out formulation pairs: {len(held)}; held-out command combinations: {len(cmd_held)} (split_hints.json lists both)."]
    open(os.path.join(HERE, "COVERAGE.md"), "w").write("\n".join(L) + "\n")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--out", required=True, help="the world folder (its name must be matheditor)")
    ap.add_argument("--n", type=int, default=20000); ap.add_argument("--n_eval", type=int, default=400); ap.add_argument("--seed", type=int, default=0)
    a = ap.parse_args()
    if os.path.basename(os.path.abspath(a.out)) != "matheditor": sys.exit("the world folder must be named matheditor (the SOP files carry _world=matheditor)")
    build(a.out, a.n, a.n_eval, a.seed)
