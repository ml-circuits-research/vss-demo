"""generate.py: the planted-questions world (vision/ADDENDUM_qformalisation_2026-10-25.md, section 7; training/TODO_DGX.md 2.8, item 4).

An EVALUATION set only, never training data: diagram sentences that carry a question the diagram legend does not have, so that the
reader's answer must be a query of kind `unsupported`, not a value. Three categories, as the addendum names them (angle, time, count),
100 sentences each by default, in two shapes per category:
  (a) modifier: an in-world command of the diagram world (its templates, prefixes and normalizer, generate.py) followed by a phrase the
      legend has no question for ("move the box 45 degrees", "add a red box at 3 pm"). Gold: the in-world wires, and a `query` wire
      about the planted words (they are the unplaced words of a correct reading).
  (b) sentence: a request whose event or question is outside the legend ("rotate the box 45 degrees", "how many boxes are there").
      Gold: one `query` wire about the whole sentence.
Every gold query has kind `unsupported`; `resolve` is the chain of the addendum (count: the planner can count the scene, then the person;
angle and time: the person), `scope` local. Some planted words collide with the diagram lexicon on purpose (`turn` is a change verb,
`third` a fraction, `every` a quantifier, numbers are amounts): a reader that fills a role with them is confidently wrong.

The field encoding of the query wire follows responses D8 (type `query`; about, kind, evidence, resolve, scope). Until the source's
soplang knows the wire type, `sop check` rejects these files; `planted.jsonl` carries the same gold as data (text, tokens, category,
shape, planted words, the in-world frame) for scripts that do not parse SOP.
Run: python3 training/worlds/planted/generate.py --out <dir> [--n 300] [--seed 0]"""
import argparse, datetime, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); DIAGRAM = os.path.join(os.path.dirname(HERE), "diagram")
TOOL = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(HERE))), "tool")
sys.path.insert(0, TOOL); sys.path.insert(0, DIAGRAM)
import numpy as np
from sop import soplang
from sop.legend import sha256_file
from normalize import normalize
import generate as diagram

CATEGORIES = ("angle", "time", "count")
RESOLVE = {"angle": "person", "time": "person", "count": "planner,person"}
ANGLES = [15, 30, 45, 60, 90, 120, 180]

# (a) phrases after an in-world command: (phrase id, function(g) -> words)
def _deg(g): return [diagram.NUM_WORDS.get(a, str(a)) if g.coin(0.2) and a in diagram.NUM_WORDS else str(a) for a in [g.pick(ANGLES)]]
MODIFIERS = {
    "angle": [("rotated_by", lambda g: ["rotated", "by"] + _deg(g) + ["degrees"]),
              ("at_angle", lambda g: ["at", "a"] + _deg(g) + ["degree", "angle"]),
              ("tilted", lambda g: ["tilted"] + _deg(g) + ["degrees"]),
              ("clockwise", lambda g: ["turned"] + _deg(g) + ["degrees", g.pick(["clockwise", "counterclockwise"])])],
    "time": [("at_clock", lambda g: ["at", str(g.pick([1, 2, 3, 4, 5, 9, 10, 11])), g.pick(["am", "pm"])]),
             ("in_minutes", lambda g: ["in", g.pick(["5", "ten", "15", "two"]), g.pick(["minutes", "seconds", "hours"])]),
             ("day", lambda g: [g.pick(["tomorrow", "tonight", "on monday", "on friday", "next week"])]),
             ("after", lambda g: ["after", g.pick(["5", "ten", "30"]), g.pick(["seconds", "minutes"])]),
             ("every_day", lambda g: ["every", g.pick(["morning", "day", "hour", "monday"])])],
    "count": [("as_many", lambda g: ["as", "many", "times", "as", "there", "are", g.pick(["servers", "users", "files", "boxes"])]),
              ("every_nth", lambda g: ["for", "every", g.pick(["second", "third", "fifth"]), "one"]),
              ("count_of", lambda g: ["one", "for", "each", "of", "the", g.pick(["servers", "users", "files", "boxes"]), "i", "have"])],
}
MOD_EVENTS = {"angle": ["create", "move", "place", "change"], "time": ["create", "move", "delete", "connect", "change", "copy"],
              "count": ["create", "copy"]}

# (b) whole sentences outside the legend: (template id, function(g) -> words)
def _thing(g, plural=False):      # an in-world entity inside a planted sentence: marked, so that it is not counted as planted evidence
    w, _ = g.entity(det_choices=("the",) if not plural else (), plural=plural, attr_p=0.4, neg_p=0, allow_label_head=False); return [("E", w)]
SENTENCES = {
    "angle": [("rotate", lambda g: [g.pick(["rotate", "tilt", "spin"])] + _thing(g) + (g.pick([["by"], []]) + _deg(g) + ["degrees"] if g.coin(0.7) else [])),
              ("turn_deg", lambda g: ["turn"] + _thing(g) + _deg(g) + ["degrees"]),
              ("what_angle", lambda g: ["what", "angle", "is"] + _thing(g) + ["at", "?"])],
    "time": [("schedule", lambda g: ["schedule"] + _thing(g) + ["for", g.pick(["tomorrow", "monday", "noon", "3 pm"])]),
             ("wait", lambda g: ["wait", g.pick(["5", "ten", "two"]), g.pick(["seconds", "minutes"])]),
             ("when", lambda g: ["when", "was"] + _thing(g) + [g.pick(["added", "created", "moved"]), "?"])],
    "count": [("how_many", lambda g: ["how", "many"] + _thing(g, plural=True) + ["are", "there", g.pick(["", "on the canvas", "in the diagram"]), "?"]),
              ("count", lambda g: ["count"] + ["the"] + _thing(g, plural=True)),
              ("number_of", lambda g: ["tell", "me", "the", "number", "of"] + _thing(g, plural=True))],
}


def query_wire(wid, about, words, cat, text, template, mood):
    q = soplang.Wire(wid, "query")
    for k, v in (("_text", text), ("_world", "diagram"), ("_source", "planted"), ("_template", template), ("_mood", mood)) if text else ():
        q.lines.append(soplang.Line(k, v))
    q.set("about", about); q.set("kind", "unsupported"); q.set("evidence", ",".join(words)); q.set("resolve", RESOLVE[cat]); q.set("scope", "local")
    return q


def build(out, n, seed):
    rng = np.random.default_rng(700 + seed); g = diagram.Gen(rng, diagram.LABELS_TRAIN, diagram.NUMS_TRAIN)
    per = {c: n // len(CATEGORIES) + (1 if i < n % len(CATEGORIES) else 0) for i, c in enumerate(CATEGORIES)}
    os.makedirs(os.path.join(out, "examples"), exist_ok=True)
    lp = os.path.join(out, "legend.json"); json.dump(diagram.legend_dict(), open(lp, "w"), indent=1); sha = sha256_file(lp)
    doc = soplang.Doc(directives=[("world", "diagram", None), ("legend", sha, None),
                                  ("generated", f"training/worlds/planted/generate.py seed {seed} ({datetime.date.today()})", None)])
    rows, k, seen = [], 0, set()
    for cat in CATEGORIES:
        i = 0
        while i < per[cat]:
            ids = iter(f"w{k + j}" for j in range(1, 200))
            if i % 2 == 0:                                                  # (a) an in-world command + a planted phrase
                ev = g.pick(MOD_EVENTS[cat]); tid, f = diagram.TEMPLATES[ev][int(rng.integers(len(diagram.TEMPLATES[ev])))]
                pid, ptxt = g.pick([p for p in diagram.PREFIXES if p[0] != "tail"])
                words, roles = f(g); mid, mf = g.pick(MODIFIERS[cat]); planted = mf(g)
                surface = " ".join(([ptxt] if ptxt else []) + words + planted) + (" ." if g.coin(0.5) else "")
                toks, _ = normalize(surface); text = " ".join(toks); template = f"planted.{cat}.a.{ev}.{tid}.{mid}"
                if text in seen: continue
                ws = diagram.wires_for(ev, roles, False, text, f"{ev}.{tid}.{pid}", ids)
                ws[0].lines.insert(1, soplang.Line("_world", "diagram"))
                pw = [t for t in normalize(" ".join(planted))[0]]
                q = query_wire(next(ids), ",".join(pw), pw, cat, None, None, None); q.lines.insert(0, soplang.Line("_template", template))
                ws[0].set("_query", ("ref", q.id))
                doc.wires += ws + [q]; k += len(ws) + 1
                rows.append({"text": text, "tokens": toks, "category": cat, "shape": "modifier", "template": template, "planted": pw,
                             "event": ev, "roles": roles, "gold_kind": "unsupported", "resolve": RESOLVE[cat].split(",")})
                seen.add(text); i += 1
            else:                                                           # (b) a sentence outside the legend
                tid, f = g.pick(SENTENCES[cat]); parts = [w for w in f(g) if w]
                words = [x for w in parts for x in (w[1] if isinstance(w, tuple) else [w])]
                pw = [t for w in parts if not isinstance(w, tuple) for t in normalize(w)[0] if t not in ("?", ".")]
                toks, _ = normalize(" ".join(words)); text = " ".join(toks); template = f"planted.{cat}.b.{tid}"
                if text in seen: continue
                mood = "question" if toks and toks[-1] == "?" else "command"
                q = query_wire(next(ids), "sentence", pw, cat, text, template, mood)
                doc.wires.append(q); k += 1
                rows.append({"text": text, "tokens": toks, "category": cat, "shape": "sentence", "template": template,
                             "planted": pw, "event": None, "roles": {},
                             "gold_kind": "unsupported", "resolve": RESOLVE[cat].split(",")})
                seen.add(text); i += 1
    open(os.path.join(out, "examples", "eval_planted.sop"), "w").write(soplang.write(doc))
    with open(os.path.join(out, "planted.jsonl"), "w") as fh:
        for r in rows: fh.write(json.dumps(r) + "\n")
    content = lambda t: diagram.KINDS.get(t) not in (None, t, "FILLER")      # a content kind of the lexicon (not a function word)
    collide = sum(1 for r in rows if any(content(t) for t in r["planted"])); nums = sum(1 for r in rows if any(t.isdigit() for t in r["planted"]))
    print(f"planted-questions world written to {out}: {len(rows)} sentences ({', '.join(f'{c} {per[c]}' for c in CATEGORIES)}; "
          f"modifier {sum(r['shape'] == 'modifier' for r in rows)}, sentence {sum(r['shape'] == 'sentence' for r in rows)}); "
          f"{collide} with a planted word of a content kind of the diagram lexicon (e.g. turn VERB, third FRACTION, every QUANT), {nums} with a "
          f"planted number (a candidate amount); legend {sha[:19]}...")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--out", required=True); ap.add_argument("--n", type=int, default=300)
    ap.add_argument("--seed", type=int, default=0); a = ap.parse_args(); build(a.out, a.n, a.seed)
