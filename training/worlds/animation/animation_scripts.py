"""animation_scripts.py: animation scripts with GOLD timelines (specification 19.7) for the scripted suite of app/tests/animate.mjs (Table 13,
"Animation: timeline, corrections, invariants": order exact, ends within 50 ms, on 100%; dependent-only re-planning on 100%; planted
violations caught on 100%), plus questions about the film (19.6) with gold answers.

Every step is a sentence of the animation world (normalized by normalize.py) with its gold frame in the reader-result format of
app/ARCHITECTURE.md, so the suite runs without a trained model; the end-to-end version reads the same sentences once a model is exported.
Gold values come from semantics.py (the reference semantics, written independently of app/src/animate/). Our own generated data.

Output (committed): training/data/animation/eval/
  timelines.jsonl     {id, scene, steps: [{text, frame, info}], gold: {units: [{id, start, end}], end, order, overlaps}}
  corrections.jsonl   {id, scene, steps, gold_before, correction: {text, frame, info, unit}, gold_after, changed, dependents}
  invariants.jsonl    {id, scene, steps, planted: rule | null, gold: {violations: [{rule, subject, frame, t}]}, fps}
  questions.jsonl     {id, script (a timelines.jsonl id: its scene and steps), question: {text, frame, info}, gold: {...}}
Run: python3 animation_scripts.py [--out training/data/animation/eval] [--n 60] [--seed 0]"""
import argparse, copy, json, os, random, sys
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
sys.path.insert(0, HERE)
from normalize import normalize
from semantics import Script, violations, rnd

NODE_POOL = ["user", "client", "gateway", "api", "service", "server", "queue", "cache", "database", "store"]
NUM_WORDS = {"2": "two", "3": "three", "4": "four", "5": "five"}


def E(head, det="the", attr=None): return ("E", head, det, attr)


def say(words, event, roles, neg=False, mood="command", asked=None, lemma=None):
    """one sentence: normalized text, gold frame (reader format), info; every word filler must be a token of the sentence"""
    toks, info = normalize(words + (" ?" if mood == "question" else " ."))
    fr = {}
    for r, v in roles.items():
        if isinstance(v, tuple): fr[r] = ["entity", v[1], ["word", v[3]] if v[3] else None, v[2]]; assert v[1] in toks, (v, toks)
        else: fr[r] = ["word", str(v)]; assert str(v) in toks, (r, v, toks)
    frame = {"event": event, "roles": fr, "neg": neg, "speakers": []}
    if mood == "question": frame["mood"] = "question"; frame["asked"] = asked
    if lemma: frame["lemma"] = lemma
    return {"text": " ".join(toks), "frame": frame, "info": info}


def make_scene(rng, n_nodes, branch=False):
    nodes = rng.sample(NODE_POOL, n_nodes); comps = []; conns = []
    for i, w in enumerate(nodes): comps.append({"id": f"c{i + 1}", "word": w, "kind": "system", "label": None, "box": {"x": 60 + 220 * i, "y": 300, "w": 130, "h": 60}, "order": i + 1})
    for i in range(n_nodes - 1): conns.append({"id": f"e{i + 1}", "source": f"c{i + 1}", "target": f"c{i + 2}", "kind": "arrow"})
    extra = [("title", "text", {"x": 60, "y": 20, "w": 300, "h": 50}), ("note", "note", {"x": 60, "y": 160, "w": 130, "h": 60}),
             ("robot", "character", {"x": 60, "y": 560, "w": 60, "h": 90}), ("square", "shape", {"x": 205, "y": 310, "w": 60, "h": 40})]
    if branch:
        bw = rng.choice([w for w in ["cache", "queue", "store", "report"] if w not in nodes])
        extra.append((bw, "data", {"x": 60 + 220 * 2, "y": 480, "w": 130, "h": 60}))
    for w, k, b in extra:
        comps.append({"id": f"c{len(comps) + 1}", "word": w, "kind": k, "label": None, "box": b, "order": len(comps) + 1})
    if branch: conns.append({"id": f"e{len(conns) + 1}", "source": "c2", "target": comps[-1]["id"], "kind": "arrow"})
    return {"width": 1200, "height": 800, "components": comps, "connectors": conns}, nodes


def gold_of(sc):
    t = sc.solve(); units = [{"id": u, "start": s, "end": e} for u, (s, e) in t.items()]
    order = [u["id"] for u in sorted(units, key=lambda u: (u["start"], int(u["id"][1:])))]
    ov = sorted([a["id"], b["id"]] for i, a in enumerate(units) for b in units[i + 1:] if a["start"] < b["end"] and b["start"] < a["end"])
    return {"units": units, "end": sc.end, "order": order, "overlaps": ov}


def tnum(rng, choices=("1", "2", "3", "1.5", "0.5", "2.5")):
    n = rng.choice(choices)
    if rng.random() < 0.15 and n in ("0.5", "1", "1.5"): ms = str(int(float(n) * 1000)); return ms, "ms", f"{ms} milliseconds"
    return n, "s", f"{NUM_WORDS.get(n, n) if rng.random() < 0.3 else n} {'second' if n == '1' else 'seconds'}"


class Builder:
    """composes a script step by step, keeping only steps the reference semantics accepts"""
    def __init__(self, rng, scene, nodes):
        self.rng, self.scene, self.nodes = rng, scene, nodes; self.steps = []; self.sc = Script(scene); self.pos = 0; self.trav = None
        self.subjects = []                       # component words that have a unit (for refs)
    def push(self, step):
        trial = copy.deepcopy(self.sc)
        try:
            kind, obj = trial.add(step["frame"], step["info"]); trial.solve()
            if trial.conflicts: return False
        except (KeyError, ValueError, RecursionError): return False
        self.sc = trial; self.steps.append(step); return True

    def timing(self, allow_rel=True):
        """an optional start phrase: (words, roles)"""
        r = self.rng.random()
        if r < 0.15: n, u, s = tnum(self.rng, ("0", "1", "2", "3", "4")); return f"at {s}", {"start": n, "unit": u}
        if r < 0.25 and self.steps: return "then", {"tempo": "then"}
        if allow_rel and self.subjects and r < 0.6:
            ref = self.rng.choice(self.subjects); k = self.rng.choice(["after", "after", "with", "before", "after_offset"])
            if k == "after_offset": n, u, s = tnum(self.rng, ("1", "2", "0.5")); return f"{s} after the {ref}", {"tempo": "after", "ref": E(ref), "offset": n, "unit": u}
            return f"{'at the same time as' if k == 'with' and self.rng.random() < 0.3 else k} the {ref}", {"tempo": k, "ref": E(ref)}
        return "", {}
    def duration(self, ev):
        r = self.rng.random()
        if r < 0.3: n, u, s = tnum(self.rng); return f"{self.rng.choice(['for', 'over', 'in'])} {s}", {"duration": n, "unit": u}
        if r < 0.4: d = self.rng.choice(["quickly", "slowly", "instantly"]); return d, {"duration": d}
        return "", {}
    def merge(self, *parts):
        words, roles = [], {}
        for w, r in parts:
            if "unit" in r and "unit" in roles and r["unit"] != roles["unit"]: return None
            if r.get("tempo") == "then": words.insert(0, w)          # 'then' opens the sentence
            elif w: words.append(w)
            roles.update(r)
        return " ".join(words), roles

    # ----------------------------------------------------------- step kinds
    def hop(self):
        if self.pos >= len(self.nodes) - 1: return False
        a, b = self.nodes[self.pos], self.nodes[self.pos + 1]; via = None
        if self.pos + 2 < len(self.nodes) and self.rng.random() < 0.2: via, b = b, self.nodes[self.pos + 2]
        t = self.trav or self.rng.choice(["request", "dot", "packet", "message", "envelope"])
        head = f"send {'an' if t[0] in 'aeiou' else 'a'} {t} from the {a} to the {b}" if not self.trav else self.rng.choice([f"the {t} goes from the {a} to the {b}", f"send the {t} from the {a} to the {b}"])
        det = ("an" if t[0] in "aeiou" else "a") if not self.trav else "the"
        roles = {"traveller": E(t, det), "source": E(a), "target": E(b)}
        if via: head += f" via the {via}"; roles["via"] = E(via)
        r = self.rng.random(); mods = ("", {})
        if r < 0.3: n, u, s = tnum(self.rng, ("1", "2", "0.5", "1.5")); mods = (f"{s} per hop", {"duration": n, "unit": u, "per": "per_hop"})
        elif r < 0.5: mods = self.duration("travel")
        elif r < 0.65: sp = self.rng.choice(["slower", "faster", "twice_as_fast"]); mods = (sp.replace("_", " "), {"speed": sp})
        elif r < 0.75: e = self.rng.choice(["smoothly", "linearly", "bouncing"]); mods = ({"bouncing": "with a bounce"}.get(e, e), {"easing": e})
        tm = ("then", {"tempo": "then"}) if self.steps and self.rng.random() < 0.3 else ("", {})
        m = self.merge((head, roles), mods)
        if not m: return False
        words, roles = m
        if tm[0]: words = "then " + words; roles.update(tm[1])
        ok = self.push(say(words, "travel", roles))
        if ok: self.trav = t; self.pos += 2 if via else 1; self.subjects += [w for w in (a, b) if w not in self.subjects]
        return ok
    def on_arrival(self):
        if not self.trav or self.pos == 0: return False
        x = self.nodes[self.pos]; ev = self.rng.choice(["highlight", "blink", "pulse"]); v = {"highlight": "highlight", "blink": "blink", "pulse": "pulse"}[ev]
        roles = {"object": E(x), "tempo": "when", "ref": E(self.trav), "trigger": "arrives"}
        if self.rng.random() < 0.7: words = f"{v} the {x} when the {self.trav} arrives at the {x}"; roles["landmark"] = E(x)
        else: words = f"{v} the {x} when the {self.trav} arrives"
        if ev == "blink" and self.rng.random() < 0.5: n = self.rng.choice(["2", "3"]); words += f" {n} times"; roles["repeat"] = n
        return self.push(say(words, ev, roles))
    def show(self):
        x = self.rng.choice(["title", "note"] + self.nodes); ev = self.rng.choice(["appear", "fade_in", "highlight", "blink", "fade_out"])
        verbs = {"appear": f"show the {x}", "fade_in": f"fade in the {x}", "highlight": f"highlight the {x}", "blink": f"blink the {x}", "fade_out": f"fade out the {x}"}
        m = self.merge((verbs[ev], {"object": E(x)}), self.duration(ev), self.timing())
        if not m or ("ref" in m[1] and m[1]["ref"][1] == x): return False
        ok = self.push(say(m[0], ev, m[1]))
        if ok and x not in self.subjects: self.subjects.append(x)
        return ok
    def while_travel(self):
        if not self.trav: return False
        x = self.rng.choice(self.nodes); ev = self.rng.choice(["pulse", "blink"])
        return self.push(say(f"{ev} the {x} while the {self.trav} is traveling", ev, {"object": E(x), "tempo": "while", "ref": E(self.trav), "trigger": "traveling"}))
    def wait(self):
        n, u, s = tnum(self.rng, ("1", "2", "0.5")); return self.push(say(f"wait {s}", "wait", {"duration": n, "unit": u}))
    def robot(self):
        if self.rng.random() < 0.5:
            x = self.rng.choice(self.nodes); m = self.merge((f"make the robot walk to the {x}", {"object": E("robot"), "target": E(x)}), self.duration("walk"), self.timing())
            if not m or ("ref" in m[1] and m[1]["ref"][1] == "robot"): return False
            ok = self.push(say(m[0], "walk", m[1]))
        else:
            ev = self.rng.choice(["wave", "nod", "jump", "bounce"])
            rep = (" 2 times", {"repeat": "2"}) if ev in ("jump", "wave") and self.rng.random() < 0.4 else ("", {})
            m = self.merge((f"make the robot {ev}{rep[0]}", {"object": E("robot"), **rep[1]}), self.timing())
            if not m or ("ref" in m[1] and m[1]["ref"][1] == "robot"): return False
            ok = self.push(say(m[0], ev, m[1]))
        if ok and "robot" not in self.subjects: self.subjects.append("robot")
        return ok

    def build(self, k):
        kinds = [self.hop, self.hop, self.on_arrival, self.show, self.show, self.while_travel, self.wait, self.robot]
        tries = 0
        while len(self.steps) < k and tries < 200:
            tries += 1; self.rng.choice(kinds)()
        return self.steps


def demo_script():
    """the spec's opening example (section 19), with each 'when reached' written as its own sentence"""
    sc, nodes = {"width": 1200, "height": 800, "components": [], "connectors": []}, ["user", "gateway", "api", "database"]
    for i, w in enumerate(nodes): sc["components"].append({"id": f"c{i + 1}", "word": w, "kind": "system", "label": None, "box": {"x": 60 + 250 * i, "y": 300, "w": 130, "h": 60}, "order": i + 1})
    for i in range(3): sc["connectors"].append({"id": f"e{i + 1}", "source": f"c{i + 1}", "target": f"c{i + 2}", "kind": "arrow"})
    S = [say("the request goes from the user to the gateway , 2 seconds per hop", "travel", {"traveller": E("request", "the"), "source": E("user"), "target": E("gateway"), "duration": "2", "unit": "s", "per": "per_hop"}),
         say("highlight the gateway when the request arrives at the gateway", "highlight", {"object": E("gateway"), "tempo": "when", "ref": E("request"), "trigger": "arrives", "landmark": E("gateway")}),
         say("the request goes from the gateway to the database via the api , 2 seconds per hop", "travel", {"traveller": E("request"), "source": E("gateway"), "via": E("api"), "target": E("database"), "duration": "2", "unit": "s", "per": "per_hop"}),
         say("highlight the api when the request arrives at the api", "highlight", {"object": E("api"), "tempo": "when", "ref": E("request"), "trigger": "arrives", "landmark": E("api")}),
         say("highlight the database when the request arrives at the database", "highlight", {"object": E("database"), "tempo": "when", "ref": E("request"), "trigger": "arrives", "landmark": E("database")}),
         say("send an answer from the database to the user via the api , 2 seconds per hop", "travel", {"traveller": E("answer", "an"), "source": E("database"), "via": E("api"), "target": E("user"), "duration": "2", "unit": "s", "per": "per_hop"}),
         say("make the gateway blink when the answer arrives", "blink", {"object": E("gateway"), "tempo": "when", "ref": E("answer"), "trigger": "arrives"})]
    return sc, S


def corrections(rng, b):
    """one correction of an existing unit, as a sentence; returns (step, target unit id) or None"""
    sc = b.sc; us = [u for u in sc.units if u["event"] != "wait"]
    if not us: return None
    u = rng.choice(us); ev = u["event"]
    words_of = lambda cid: next(c["word"] for c in b.scene["components"] if c["id"] == cid)
    if ev == "travel":
        t = sc.travellers[u["subject"][0]]["word"]; later = [x for x in sc.units if x["event"] == "travel" and x["subject"] == u["subject"] and x["index"] > u["index"]]
        if later: return None                                   # the correction reaches the LATEST travel of that traveller: choose that one
        k = rng.random()
        if k < 0.4: sp = rng.choice(["slower", "faster", "twice_as_fast", "half_as_fast"]); return say(f"make the {t} travel {sp.replace('_', ' ')}", "travel", {"traveller": E(t), "speed": sp}), u["id"]
        if k < 0.7: v = rng.choice(["slow_down", "speed_up"]); return say(f"{v.replace('_', ' ')} the {t}", "retime", {"object": E(t)}, lemma=v), u["id"]
        n, un, s = tnum(rng, ("1", "3", "0.5")); return say(f"actually , the {t} goes from the {words_of(u['nodes'][0])} to the {words_of(u['nodes'][-1])} in {s}", "travel",
                                                              {"traveller": E(t), "source": E(words_of(u["nodes"][0])), "target": E(words_of(u["nodes"][-1])), "duration": n, "unit": un}), u["id"]
    x = words_of(u["subject"][0])
    if any(o["event"] == ev and o["subject"] == u["subject"] and o["index"] > u["index"] for o in sc.units): return None
    others = [w for w in b.subjects if w != x]
    verb = {"appear": f"make the {x} appear", "fade_in": f"fade in the {x}", "fade_out": f"fade out the {x}", "highlight": f"highlight the {x}", "blink": f"make the {x} blink",
            "pulse": f"pulse the {x}", "walk": None, "wave": f"make the {x} wave", "nod": f"make the {x} nod", "jump": f"make the {x} jump", "bounce": f"make the {x} bounce"}.get(ev)
    if not verb: return None
    k = rng.random()
    if k < 0.35 and others: y = rng.choice(others); return say(f"{verb} before the {y}", ev, {"object": E(x), "tempo": "before", "ref": E(y)}), u["id"]
    if k < 0.6 and others:
        y = rng.choice(others); n, un, s = tnum(rng, ("1", "2", "0.5")); return say(f"actually , {verb} {s} after the {y}", ev, {"object": E(x), "tempo": "after", "ref": E(y), "offset": n, "unit": un}), u["id"]
    if k < 0.8: n, un, s = tnum(rng, ("1", "2", "3")); return say(f"{verb} for {s} instead", ev, {"object": E(x), "duration": n, "unit": un}), u["id"]
    n, un, s = tnum(rng, ("0", "1", "4", "6")); return say(f"no , {verb} at {s}", ev, {"object": E(x), "start": n, "unit": un}), u["id"]


def dependents(sc, uid):
    """transitive closure of 'depends on' (start rules, defaults, the push of a 'before'), from the reference semantics"""
    by = {u["id"]: u for u in sc.units}; edges = {u["id"]: set() for u in sc.units}
    for u in sc.units:
        k = u["rule"]["kind"]
        if k == "default" and u["index"] > 0: edges[sc.units[u["index"] - 1]["id"]].add(u["id"])
        elif k != "at" and k != "default":
            R = sc.rule_ref(u); edges[R].add(u["id"])
            if k == "before": edges[u["id"]].add(R)
        if k == "while" and not u["explicit_d"]: edges[sc.rule_ref(u)].add(u["id"])
    seen, todo = set(), [uid]
    while todo:
        for v in edges[todo.pop()]:
            if v not in seen and v != uid: seen.add(v); todo.append(v)
    return sorted(seen, key=lambda s: int(s[1:]))


def planted(rng, i):
    """a script with one planted violation of a rule (or a control with none): (scene, steps, planted rule or None)"""
    branch = i % 6 == 2
    scene, nodes = make_scene(rng, 4, branch=branch); b = Builder(rng, scene, nodes); kind = ["no-overlap", "visible", "on-connectors", "no-move", "attached", "inside-canvas"][i % 6]
    control = (i // 6) % 3 == 2
    steps = []
    def add(s): assert b.push(s), s["text"]; steps.append(s)
    if kind == "no-overlap":
        tgt = nodes[1] if not control else nodes[3]
        add(say(f"never let anything overlap the {tgt}", "overlap", {"object": ("E", "anything", None, None), "landmark": E(tgt)}, neg=True))
        e = rng.choice(["", "smoothly", "linearly"])
        add(say(f"move the square 220 px right {e}".strip(), "move", {"object": E("square"), "distance": "220", "direction": "right", **({"easing": e} if e else {})}))
    elif kind == "visible":
        add(say("never hide the title", "disappear", {"object": E("title")}, neg=True))
        if control: add(say("blink the title 3 times", "blink", {"object": E("title"), "repeat": "3"}))
        else: n, u, s = tnum(rng, ("1", "2")); add(say(f"fade out the title at {s}", "fade_out", {"object": E("title"), "start": n, "unit": u}))
    elif kind == "on-connectors":
        t = rng.choice(["dot", "packet", "request"])
        add(say(f"send a {t} from the {nodes[0]} to the {nodes[1]}", "travel", {"traveller": E(t, "a"), "source": E(nodes[0]), "target": E(nodes[1])}))
        add(say(f"never let the {t} leave the arrows", "leave", {"traveller": E(t), "path": ("E", "arrows", "the", None)}, neg=True))
        branch_word = scene["components"][-1]["word"]
        dest = branch_word if not control else nodes[2]
        src = nodes[0] if not control else nodes[1]
        add(say(f"then the {t} goes from the {src} to the {dest}", "travel", {"tempo": "then", "traveller": E(t), "source": E(src), "target": E(dest)}))
    elif kind == "no-move":
        add(say(f"do not move the {nodes[1]}", "move", {"object": E(nodes[1])}, neg=True))
        if control: add(say("move the note 100 px down", "move", {"object": E("note"), "distance": "100", "direction": "down"}))
        elif rng.random() < 0.5: add(say(f"move the {nodes[1]} 50 px down after 1 second", "move", {"object": E(nodes[1]), "distance": "50", "direction": "down", "start": "1", "unit": "s"}))
        else: add(say(f"make the {nodes[1]} shake", "shake", {"object": E(nodes[1])}))
    elif kind == "attached":
        x = nodes[1] if not control else "note"
        add(say("show the title", "appear", {"object": E("title")}))
        add(say(f"fade out the {x} over 2 seconds", "fade_out", {"object": E(x), "duration": "2", "unit": "s"}))
    elif kind == "inside-canvas":
        x = "title" if not control else "robot"
        add(say(f"make the {x} jump 2 times", "jump", {"object": E(x), "repeat": "2"}))
    return scene, b, (None if control else kind)


def questions(rng, b):
    """two or three questions about the film with gold answers from the reference semantics"""
    sc = b.sc; out = []; W = lambda cid: next((c["word"] for c in b.scene["components"] if c["id"] == cid), cid)
    sc.solve()
    comp_units = [u for u in sc.units if u["event"] not in ("travel", "wait")]
    if comp_units:
        u = rng.choice(comp_units); x = W(u["subject"][0]); ev = u["event"]
        first = next(o for o in sc.units if o["event"] == ev and o["subject"] == u["subject"])
        verb = {"fade_in": "fade in", "fade_out": "fade out"}.get(ev, ev)
        out.append((say(f"when does the {x} {verb}", ev, {"object": E(x)}, mood="question", asked="start"), {"start": sc.times[first["id"]][0], "unit": first["id"]}))
    out.append((say("how long does the whole animation last", "last", {"object": E("animation")}, mood="question", asked="duration"), {"duration": sc.end}))
    travels = [u for u in sc.units if u["event"] == "travel"]
    if travels:
        u = travels[0]; tw = sc.travellers[u["subject"][0]]["word"]; t = rng.choice([500, 1000, 1500, 2000, 2500, 3000, 4000])
        t = rng.choice([t, sc.times[u["id"]][0] + (sc.times[u["id"]][1] - sc.times[u["id"]][0]) // 2 // 100 * 100])
        st = sc.state(t); where = None
        if u["subject"][0] in st["travellers"]:
            p = st["travellers"][u["subject"][0]]; best = None
            for c in b.scene["components"]:
                cx, cy = sc.centre(c["id"], st["boxes"]); d = ((cx - p[0]) ** 2 + (cy - p[1]) ** 2) ** 0.5
                if d <= 1: best = c["id"]
            if best: where = {"at": best}
            else:
                for tu in sc.units:
                    if tu["event"] == "travel" and tu["subject"] == u["subject"] and sc.times[tu["id"]][0] <= t <= sc.times[tu["id"]][1]:
                        s, e = sc.times[tu["id"]]; h = len(tu["nodes"]) - 1; j = min(int((t - s) * h // (e - s)), h - 1) if e > s else h - 1
                        where = {"between": [tu["nodes"][j], tu["nodes"][j + 1]]}
        else: where = {"hidden": True}
        secs = t / 1000; ss = str(int(secs)) if secs == int(secs) else str(secs)
        out.append((say(f"where is the {tw} at {ss} seconds", "locate", {"traveller": E(tw), "start": ss, "unit": "s"}, mood="question", asked="landmark"), {"where": where, "t": t}))
        # what is highlighted when the traveller arrives at a node
        node = u["nodes"][rng.randrange(1, len(u["nodes"]))]; ta = None      # the FIRST arrival in time of that traveller at the node
        for tu in travels:
            if tu["subject"] == u["subject"] and node in tu["nodes"][1:]:
                kk = tu["nodes"].index(node, 1); s, e = sc.times[tu["id"]]; x = s + rnd((e - s) * kk / (len(tu["nodes"]) - 1)); ta = x if ta is None else min(ta, x)
        act = sorted({x for o in sc.units if o["event"] == "highlight" and sc.times[o["id"]][0] <= ta < sc.times[o["id"]][1] for x in o["subject"]})
        out.append((say(f"what is highlighted when the {tw} arrives at the {W(node)}", "highlight", {"tempo": "when", "ref": E(tw), "trigger": "arrives", "landmark": E(W(node))}, mood="question", asked="object"), {"t": ta, "objects": act}))
    if comp_units:
        u = rng.choice(comp_units); x = W(u["subject"][0]); rel = rng.choice(["after", "before", "while"])
        R = next(o for o in sc.units if any(s in o["subject"] + o.get("nodes", []) for s in u["subject"]))   # questions: the FIRST unit acting on x
        s0, e0 = sc.times[R["id"]]; MOT = {"move", "travel", "walk", "jump", "bounce", "shake"}
        ev = rng.choice(["blink", "highlight", "move"]); third = {"blink": "blinks", "highlight": "highlights", "move": "moves"}[ev]
        cls = MOT if ev == "move" else {ev}
        def rel_ok(o):
            s, e = sc.times[o["id"]]
            return (s >= e0) if rel == "after" else (e <= s0) if rel == "before" else (s < e0 and e > s0)
        objs = sorted({sub for o in sc.units if o["event"] in cls and o["id"] != R["id"] and rel_ok(o) for sub in o["subject"]})
        out.append((say(f"what {third} {rel} the {x}", ev, {"tempo": rel, "ref": E(x)}, mood="question", asked="object"), {"objects": objs, "ref_unit": R["id"]}))
    return out


def main(out, n, seed):
    rng = random.Random(seed); os.makedirs(out, exist_ok=True)
    T, C, I, Q = [], [], [], []
    sc0, steps0 = demo_script(); s = Script(sc0)
    for st in steps0: s.add(st["frame"], st["info"])
    T.append({"id": "T000-demo", "scene": sc0, "steps": steps0, "gold": gold_of(s)})
    i = 0
    while len(T) < n:
        i += 1; scene, nodes = make_scene(rng, rng.choice([3, 4, 5])); b = Builder(rng, scene, nodes); steps = b.build(rng.choice([3, 4, 5, 6, 7, 8]))
        if len(steps) < 3: continue
        tid = f"T{len(T):03d}"; T.append({"id": tid, "scene": scene, "steps": steps, "gold": gold_of(b.sc)})
        for q, g in questions(rng, b): Q.append({"id": f"Q{len(Q):03d}", "script": tid, "question": q, "gold": g})   # the scene and steps: timelines.jsonl
        for _ in range(3):
            c = corrections(rng, b)
            if not c: continue
            step, uid = c; before = gold_of(b.sc); trial = copy.deepcopy(b.sc)
            try:
                got = trial.correct(step["frame"], step["info"]); after = gold_of(trial)
                if trial.conflicts or got != uid: continue
            except (KeyError, ValueError, RecursionError): continue
            bt = {u["id"]: (u["start"], u["end"]) for u in before["units"]}; changed = sorted([u["id"] for u in after["units"] if bt[u["id"]] != (u["start"], u["end"])], key=lambda s: int(s[1:]))
            dep = dependents(trial, uid)
            assert set(changed) <= set(dep) | {uid}, (tid, step["text"], changed, dep)
            C.append({"id": f"C{len(C):03d}", "script": tid, "scene": scene, "steps": steps, "gold_before": before, "correction": {**step, "unit": uid},
                      "gold_after": after, "changed": changed, "dependents": dep})
            break
    for k in range(36):
        scene, b, rule = planted(rng, k); b.sc.solve(); v = violations(b.sc)
        if rule: assert any(x["rule"] == rule for x in v), (k, rule, v)
        else: assert not v, (k, v)
        I.append({"id": f"I{k:03d}", "scene": scene, "steps": b.steps, "planted": rule, "fps": 25, "gold": {"violations": v, "end": b.sc.end}})
    for name, rows in (("timelines", T), ("corrections", C), ("invariants", I), ("questions", Q)):
        with open(os.path.join(out, f"{name}.jsonl"), "w") as f:
            for r in rows: f.write(json.dumps(r, sort_keys=True) + "\n")
    print(f"animation scripts written to {out}: timelines {len(T)}, corrections {len(C)}, invariants {len(I)} "
          f"({sum(1 for r in I if r['planted'])} planted, {sum(1 for r in I if not r['planted'])} controls), questions {len(Q)}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default=os.path.join(REPO, "training", "data", "animation", "eval"))
    ap.add_argument("--n", type=int, default=60); ap.add_argument("--seed", type=int, default=0)
    a = ap.parse_args(); main(a.out, a.n, a.seed)
