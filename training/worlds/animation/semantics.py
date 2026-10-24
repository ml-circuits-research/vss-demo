"""semantics.py: the REFERENCE semantics of an animation script (specification sections 19.2-19.6), written independently of the browser code
(app/src/animate/) so that animation_scripts.py can compute GOLD timelines, gold first violating frames and gold answers that the JavaScript
must reproduce (app/tests/animate.mjs). The contract below is the same text as app/src/animate/README.md, section "Semantics"; a change
here is a change there.

Units. Every timed frame (one sentence's reading) becomes one unit u1, u2, ... in script order. Its SUBJECT is the traveller (travel), else
the object (component ids). Its duration D (ms) is:
  base = the explicit number x 1000 (unit s or none) or x 1 (ms); a closed value (quickly 300, slowly 2000, instantly 0); else the action's
  default (DEFAULT_MS); travel: 'per hop' multiplies by the hops, a default travel is 1000 per hop;
  D = round(base x speed factor) x repeat count (once = 1; forever: one cycle here, extended to the film's end after solving);
  while (no duration of its own): D = the other unit's D.
Start rule (one per unit):
  at T (also 'after T s'): s = T                                     strong
  after R (+o): s = e_R + o;  then: s = e_previous                  strong
  before R (-o): e = s_R - o                                         strong
  with R (+o): s = s_R + o;  while R: s = s_R (and D as above)        strong
  when R arrives [at C]: s = s_R + D_R k / h (C the k-th node of R's h-hop path; no C: s = e_R); appears / disappears / finishes: s = e_R  strong
  nothing said: s = 0 for the first unit, else s = e_previous         default (weaker than strong, stronger than medium)
  always: e = s + D, s >= 0                                          required
  re-planning after a correction: stay at the previous values         medium
R ("the box") = the latest EARLIER unit whose subject (or travel source / target) includes the box, else the first later one.
A solved timeline is the least solution: a 'before' that would start below 0 starts at 0 and pushes R (only when R's own rule is the
default; against a strong rule it is a conflict, reported). Times are integers in ms.

State at time t. Components start visible unless their first opacity unit is appear / fade_in (then hidden until it starts). Unit progress
p = (t - s) / D clamped to [0, 1] once t >= s (D = 0: p = 1). appear / fade_in: opacity 0 -> 1, disappear / fade_out: 1 -> 0, eased;
move: from the position after the earlier moves (script order) to the target (direction + distance: x or y + distance), eased, kept;
walk: the same, to the target's side the walker comes from (12 px away, feet on the target's bottom line);
travel: the traveller is visible on [s, e], hop j runs on [s + jD/h, s + (j+1)D/h] along the straight line between the centres of the path's
nodes, eased within the hop; jump: dy = -40 sin(pi f) per cycle (f the phase in the cycle) while active; bounce: dy = -20 |sin(2 pi f)|;
shake: dx = 6 sin(6 pi f); pulse: scale 1 + 0.15 sin(pi f) about the centre while active; grow / shrink: scale to 1.25 / 0.8, eased, kept;
blink: opacity x (f < 0.5 ? 1 : 0.3) while active; highlight: a halo while active (s <= t < e); rotate: angle x eased p, kept.
Easings: linear p; smoothly (cubic in-out); bouncing (the standard out-bounce); suddenly (1 as soon as t > s). Defaults: move, walk, grow,
shrink smoothly; the rest linearly.

Frames. Frame k is at t = round(k x 1000 / fps), k = 0 .. ceil(end x fps / 1000); fps 25 by default.
Invariants (19.4), checked on every frame: no-overlap (a prohibition 'never let anything overlap L': no other visible component's drawn box
overlaps L's); on-connectors ('never let the T leave the arrows': a visible traveller lies within 2 px of a connector's centre line);
visible ('never hide C': from its first visible frame on, C has opacity > 0.1 and its box inside the canvas); no-move ('never move C': the
drawn box stays within 0.5 px of frame 0); built in: inside-canvas (every visible component's drawn box inside the canvas) and attached
(a visible connector's two ends are visible)."""
import math

DEFAULT_MS = {"appear": 500, "disappear": 500, "fade_in": 1000, "fade_out": 1000, "blink": 600, "pulse": 800, "rotate": 1000, "highlight": 800,
              "travel": 1000, "move": 1000, "change": 800, "wait": 1000, "grow": 600, "shrink": 600, "walk": 1500, "jump": 600, "wave": 800,
              "turn": 500, "nod": 500, "shake": 600, "bounce": 800}
CLOSED_MS = {"quickly": 300, "slowly": 2000, "instantly": 0}
SPEED = {"slow": 1.5, "normal": 1.0, "fast": 0.5, "slower": 1.5, "faster": 1 / 1.5, "twice_as_fast": 0.5, "half_as_fast": 2.0}
RELATIVE_SPEED = {"slower", "faster", "twice_as_fast", "half_as_fast"}
SMOOTH_DEFAULT = {"move", "walk", "grow", "shrink"}
OPACITY_IN, OPACITY_OUT = {"appear", "fade_in"}, {"disappear", "fade_out"}
TIMED = set(DEFAULT_MS)


def ease(name, p):
    if name == "smoothly": return 4 * p * p * p if p < 0.5 else 1 - (-2 * p + 2) ** 3 / 2
    if name == "bouncing":
        n1, d1 = 7.5625, 2.75
        if p < 1 / d1: return n1 * p * p
        if p < 2 / d1: p -= 1.5 / d1; return n1 * p * p + 0.75
        if p < 2.5 / d1: p -= 2.25 / d1; return n1 * p * p + 0.9375
        p -= 2.625 / d1; return n1 * p * p + 0.984375
    if name == "suddenly": return 1.0 if p > 0 else 0.0
    return p


def word(f): return f[1] if f and f[0] in ("word", "negword") else None


def num(f, info):
    w = word(f)
    if w is None: return None
    return float((info or {}).get("numbers", {}).get(w, w))


def rnd(x): return int(math.floor(x + 0.5))          # half up, as JavaScript's Math.round (Python's round() is half to even)


def to_ms(x, unit): return rnd(x if unit == "ms" else x * 1000)


class Script:
    """a scene plus the units built from frames, in script order"""
    def __init__(self, scene):
        self.scene = scene; self.units = []; self.travellers = {}; self.locks = []; self.film = {"loop": False}

    # ---------------- entities
    def comp_by_head(self, ent):
        head = ent[1]
        for c in self.scene["components"]:
            if c["word"] == head or (c.get("label") or "").lower() == head: return c["id"]
        for k in self.scene["connectors"]:
            if k.get("word") == head: return k["id"]
        raise KeyError(f"no component {head}")
    def traveller(self, ent, create):
        head, det = ent[1], ent[3]
        if create and det in ("a", "an"):
            tid = f"t{len(self.travellers) + 1}"; self.travellers[tid] = {"id": tid, "word": head}; return tid
        for tid in reversed(list(self.travellers)):
            if self.travellers[tid]["word"] == head: return tid
        if create: tid = f"t{len(self.travellers) + 1}"; self.travellers[tid] = {"id": tid, "word": head}; return tid
        raise KeyError(f"no traveller {head}")
    def resolve(self, ent):
        if ent[1] in {t["word"] for t in self.travellers.values()}: return [self.traveller(ent, False)]
        return [self.comp_by_head(ent)]
    def involves(self, u, ids):
        return any(x in ids for x in u["subject"] + u.get("nodes", []))
    def ref_unit(self, ids, before_index):
        for u in reversed(self.units[:before_index]):
            if self.involves(u, ids): return u["id"]
        for u in self.units[before_index:]:
            if self.involves(u, ids): return u["id"]
        raise KeyError(f"nothing happens to {ids}")

    # ---------------- frames
    def add(self, frame, info=None):
        ev, r = frame["event"], frame["roles"]
        if frame.get("neg"):
            lock = {"event": ev}
            if ev == "overlap": lock.update(rule="no-overlap", subject=self.comp_by_head(r["landmark"]))
            elif ev == "leave": lock.update(rule="on-connectors", subject=self.traveller(r["traveller"], False))
            elif ev in ("disappear", "fade_out"): lock.update(rule="visible", subject=self.comp_by_head(r["object"]))
            elif ev == "move": lock.update(rule="no-move", subject=self.comp_by_head(r["object"]))
            self.locks.append(lock); return ("lock", lock)
        if ev not in TIMED: return ("other", ev)
        u = {"id": f"u{len(self.units) + 1}", "event": ev, "index": len(self.units)}
        if ev == "travel":
            u["subject"] = [self.traveller(r["traveller"], True)]
            if "path" in r:
                k = next(k for k in self.scene["connectors"] if k.get("word") == r["path"][1] or k["id"] == r["path"][1]); u["nodes"] = [k["source"], k["target"]]
            else: u["nodes"] = [self.comp_by_head(r["source"])] + ([self.comp_by_head(r["via"])] if "via" in r else []) + [self.comp_by_head(r["target"])]
        elif ev == "wait": u["subject"] = []
        else: u["subject"] = [self.comp_by_head(r["object"])]
        if "target" in r and ev in ("walk", "turn"): u["target"] = self.comp_by_head(r["target"])
        if ev == "move": u["direction"] = word(r.get("direction")) or "right"; u["distance"] = num(r.get("distance"), info) or 40   # the reference covers direction moves (region and relation moves: geometry.js)
        self.set_timing(u, r, info, fresh=True)
        self.units.append(u); return ("unit", u)

    def set_timing(self, u, r, info, fresh):
        unit = word(r.get("unit"))
        if "duration" in r or fresh:
            d = r.get("duration")
            if d is not None and word(d) in CLOSED_MS: u["base"] = CLOSED_MS[word(d)]; u["per_hop"] = False; u["explicit_d"] = True
            elif d is not None: u["base"] = to_ms(num(d, info), unit); u["per_hop"] = word(r.get("per")) == "per_hop"; u["explicit_d"] = True
            else: u["base"] = DEFAULT_MS[u["event"]]; u["per_hop"] = u["event"] == "travel"; u["explicit_d"] = False
        if fresh: u["factor"] = 1.0; u["repeat"] = 1; u["forever"] = False; u["easing"] = "smoothly" if u["event"] in SMOOTH_DEFAULT else "linearly"
        if "speed" in r:
            s = word(r["speed"]); u["factor"] = u["factor"] * SPEED[s] if s in RELATIVE_SPEED else SPEED[s]
        if "easing" in r: u["easing"] = word(r["easing"])
        if "repeat" in r:
            rv = word(r["repeat"]); u["forever"] = rv == "forever"; u["repeat"] = 1 if rv in ("once", "forever") else int(num(r["repeat"], info))
        if "start" in r or "tempo" in r or fresh:
            off = to_ms(num(r["offset"], info), unit) if "offset" in r else 0
            tempo = word(r.get("tempo"))
            if "start" in r and word(r["start"]) != "beginning": u["rule"] = {"kind": "at", "t": to_ms(num(r["start"], info), unit)}
            elif tempo == "then": u["rule"] = {"kind": "after", "ref": "previous", "o": 0}
            elif tempo in ("after", "before", "with", "while", "when"):
                ids = self.resolve(r["ref"]); rule = {"kind": tempo, "ref_ids": ids, "o": off}
                if tempo == "when":
                    rule["trigger"] = word(r.get("trigger")) or "finishes"
                    if "landmark" in r: rule["at"] = self.comp_by_head(r["landmark"])
                u["rule"] = rule
            else: u["rule"] = {"kind": "default"}

    def correct(self, frame, info=None):
        """re-read one unit (spec 19.2): the latest unit with the same event and subject (retime: any event of that subject)"""
        ev, r = frame["event"], frame["roles"]
        subj_ent = r.get("traveller") or r.get("object")
        ids = self.resolve(subj_ent)
        for u in reversed(self.units):
            if (ev == "retime" or u["event"] == ev) and any(x in u["subject"] for x in ids):
                if ev == "retime":
                    sp = word(r.get("speed")) or ("slower" if frame.get("lemma") == "slow_down" or frame.get("verb") == "slow_down" else "faster")
                    self.set_timing(u, {"speed": ["word", sp]}, info, fresh=False)
                else: self.set_timing(u, r, info, fresh=False)
                return u["id"]
        raise KeyError("no unit to correct")

    # ---------------- solving
    def duration(self, u, by):
        if u["rule"]["kind"] == "while" and not u["explicit_d"]: return self.duration(by[self.rule_ref(u)], by)
        hops = len(u["nodes"]) - 1 if u["event"] == "travel" else 1
        base = u["base"] * hops if u["per_hop"] else u["base"]
        return rnd(base * u["factor"]) * u["repeat"]
    def rule_ref(self, u):
        rule = u["rule"]
        if rule.get("ref") == "previous": return self.units[u["index"] - 1]["id"]
        if "ref_ids" in rule: return self.ref_unit(rule["ref_ids"], u["index"])
        return None

    def solve(self):
        by = {u["id"]: u for u in self.units}; D = {u["id"]: self.duration(u, by) for u in self.units}
        floor = {u["id"]: 0 for u in self.units}; conflicts = []
        for _ in range(4 * len(self.units) + 4):
            S = {}
            def start(uid, stack=()):
                if uid in S: return S[uid]
                if uid in stack: raise ValueError(f"cycle through {uid}")
                u = by[uid]; rule = u["rule"]; k = rule["kind"]; R = self.rule_ref(u)
                st = lambda x: start(x, stack + (uid,))
                if k == "at": s = rule["t"]
                elif k == "default": s = 0 if u["index"] == 0 else st(self.units[u["index"] - 1]["id"]) + D[self.units[u["index"] - 1]["id"]]
                elif k == "after": s = st(R) + D[R] + rule["o"]
                elif k in ("with", "while"): s = st(R) + rule["o"]
                elif k == "before": s = st(R) - rule["o"] - D[uid]
                elif k == "when":
                    ru = by[R]
                    if rule["trigger"] == "arrives" and rule.get("at") and ru["event"] == "travel" and rule["at"] in ru["nodes"][1:]:
                        kk = ru["nodes"].index(rule["at"]); s = st(R) + rnd(D[R] * kk / (len(ru["nodes"]) - 1))
                    else: s = st(R) + D[R]
                if k == "default": s = max(s, floor[uid])
                S[uid] = s; return s
            for u in self.units: start(u["id"])
            changed = False
            for u in self.units:                          # a 'before' below 0 starts at 0 and pushes its other unit
                if u["rule"]["kind"] == "before" and S[u["id"]] < 0:
                    R = self.rule_ref(u); need = D[u["id"]] + u["rule"]["o"]
                    if by[R]["rule"]["kind"] != "default": conflicts.append(f"{u['id']} before {R}: {R} has its own start"); S[u["id"]] = 0; continue
                    if floor[R] < need: floor[R] = need; changed = True
            if not changed: break
        for u in self.units: S[u["id"]] = max(S[u["id"]], 0)
        E = {uid: S[uid] + D[uid] for uid in S}
        end_plain = max([E[u["id"]] for u in self.units if not u["forever"]] or [0])
        for u in self.units:
            if u["forever"]: E[u["id"]] = max(end_plain, S[u["id"]] + D[u["id"]])
        self.times = {uid: (S[uid], E[uid]) for uid in S}; self.D = D; self.conflicts = conflicts
        self.end = max(E.values()) if E else 0
        return self.times

    # ---------------- state at t (used for invariants, questions)
    def centre(self, cid, boxes): b = boxes[cid]; return (b["x"] + b["w"] / 2, b["y"] + b["h"] / 2)
    def move_targets(self):
        pos = {c["id"]: dict(c["box"]) for c in self.scene["components"]}; tg = {}
        for u in self.units:
            if u["event"] == "walk" and u.get("target"):
                cid = u["subject"][0]; frm = dict(pos[cid]); T = pos[u["target"]]; left = frm["x"] + frm["w"] / 2 <= T["x"] + T["w"] / 2
                x = T["x"] - frm["w"] - 12 if left else T["x"] + T["w"] + 12; y = T["y"] + T["h"] - frm["h"]
                b = dict(frm); b["x"] = min(max(x, 0), self.scene["width"] - b["w"]); b["y"] = min(max(y, 0), self.scene["height"] - b["h"])
                tg[u["id"]] = (frm, b); pos[cid] = b; continue
            if u["event"] != "move": continue
            cid = u["subject"][0]; b = dict(pos[cid]); d = u["distance"]
            dx = {"left": -d, "right": d}.get(u["direction"], 0); dy = {"up": -d, "down": d}.get(u["direction"], 0)
            frm = dict(pos[cid]); b["x"] = min(max(b["x"] + dx, 0), self.scene["width"] - b["w"]); b["y"] = min(max(b["y"] + dy, 0), self.scene["height"] - b["h"])
            tg[u["id"]] = (frm, b); pos[cid] = b
        return tg

    def state(self, t):
        sc = self.scene; boxes = {c["id"]: dict(c["box"]) for c in sc["components"]}; tg = self.move_targets()
        op = {}; first_op = {}
        for u in self.units:
            if u["event"] in OPACITY_IN | OPACITY_OUT:
                for x in u["subject"]: first_op.setdefault(x, u["event"])
        for x in [c["id"] for c in sc["components"]] + [k["id"] for k in sc["connectors"]]: op[x] = 0.0 if first_op.get(x) in OPACITY_IN else 1.0
        dxy = {c["id"]: [0.0, 0.0, 1.0] for c in sc["components"]}; trav = {}
        def prog(u):
            s, e = self.times[u["id"]]
            if t < s: return None
            return 1.0 if e == s else min(max((t - s) / (e - s), 0.0), 1.0)
        for u in sorted(self.units, key=lambda u: (self.times[u["id"]][0], u["index"])):
            p = prog(u)
            if p is None: continue
            s, e = self.times[u["id"]]; q = ease(u["easing"], p) if u["easing"] != "suddenly" else (1.0 if t > s or e == s else 0.0)
            cyc = self.D[u["id"]] / max(u["repeat"], 1) if not u["forever"] else self.D[u["id"]]
            f = ((t - s) % cyc) / cyc if cyc > 0 else 0.0; active = s <= t < e
            for x in u["subject"]:
                if u["event"] in OPACITY_IN: op[x] = q
                elif u["event"] in OPACITY_OUT: op[x] = 1 - q
                elif u["event"] in ("move", "walk") and u["id"] in tg:
                    frm, to = tg[u["id"]]; boxes[x]["x"] = frm["x"] + (to["x"] - frm["x"]) * q; boxes[x]["y"] = frm["y"] + (to["y"] - frm["y"]) * q
                elif u["event"] == "jump" and active: dxy[x][1] += -40 * math.sin(math.pi * f)
                elif u["event"] == "bounce" and active: dxy[x][1] += -20 * abs(math.sin(2 * math.pi * f))
                elif u["event"] == "shake" and active: dxy[x][0] += 6 * math.sin(6 * math.pi * f)
                elif u["event"] == "pulse" and active: dxy[x][2] *= 1 + 0.15 * math.sin(math.pi * f)
                elif u["event"] in ("grow", "shrink"): dxy[x][2] *= 1 + ((1.25 if u["event"] == "grow" else 0.8) - 1) * q
                elif u["event"] == "travel":
                    if s <= t <= e:
                        h = len(u["nodes"]) - 1; D = e - s
                        j = min(int((t - s) * h // D), h - 1) if D > 0 else h - 1
                        hp = ((t - s) - j * D / h) / (D / h) if D > 0 else 1.0; hq = ease(u["easing"], min(max(hp, 0.0), 1.0))
                        a = self.centre(u["nodes"][j], boxes); b = self.centre(u["nodes"][j + 1], boxes)
                        trav[x] = (a[0] + (b[0] - a[0]) * hq, a[1] + (b[1] - a[1]) * hq)
            if u["event"] == "blink" and active:
                for x in u["subject"]: op[x] = op[x] * (1.0 if f < 0.5 else 0.3)
        drawn = {}
        for cid, b in boxes.items():
            dx, dy, k = dxy[cid]; w, h = b["w"] * k, b["h"] * k
            drawn[cid] = {"x": b["x"] + dx - (w - b["w"]) / 2, "y": b["y"] + dy - (h - b["h"]) / 2, "w": w, "h": h}
        return {"boxes": drawn, "opacity": op, "travellers": trav}

    def frames(self, fps=25):
        n = math.ceil(self.end * fps / 1000)
        return [(k, round(k * 1000 / fps)) for k in range(n + 1)]


def overlap(a, b): return a["x"] < b["x"] + b["w"] and b["x"] < a["x"] + a["w"] and a["y"] < b["y"] + b["h"] and b["y"] < a["y"] + a["h"]


def seg_dist(p, a, b):
    vx, vy = b[0] - a[0], b[1] - a[1]; L = vx * vx + vy * vy
    u = 0.0 if L == 0 else max(0.0, min(1.0, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / L))
    return math.hypot(p[0] - (a[0] + u * vx), p[1] - (a[1] + u * vy))


def violations(sc, fps=25):
    """first violating frame per rule instance (the locks plus the two built-in rules), as the reference for invariants.js"""
    scene = sc.scene; found = {}; first_visible = {}; f0 = None
    comps = {c["id"]: c for c in scene["components"]}
    for k, t in sc.frames(fps):
        st = sc.state(t); B = st["boxes"]; O = st["opacity"]
        if f0 is None: f0 = {cid: dict(b) for cid, b in B.items()}
        def hit(key, rule, subject):
            if key not in found: found[key] = {"rule": rule, "subject": subject, "frame": k, "t": t}
        for L in sc.locks:
            s = L.get("subject"); r = L.get("rule")
            if r == "no-overlap":
                for cid, b in B.items():
                    if cid != s and O[cid] > 0.1 and O[s] > 0.1 and comps[cid]["kind"] != "container" and overlap(b, B[s]): hit(("no-overlap", s), r, s)
            elif r == "on-connectors" and s in st["travellers"]:
                p = st["travellers"][s]
                d = min([seg_dist(p, sc.centre(kk["source"], B), sc.centre(kk["target"], B)) for kk in scene["connectors"]] or [1e9])
                if d > 2: hit(("on-connectors", s), r, s)
            elif r == "visible":
                vis = O[s] > 0.1 and inside(B[s], scene)
                if vis: first_visible.setdefault(s, k)
                elif s in first_visible: hit(("visible", s), r, s)
            elif r == "no-move":
                b, a = B[s], f0[s]
                if abs(b["x"] - a["x"]) > 0.5 or abs(b["y"] - a["y"]) > 0.5 or abs(b["w"] - a["w"]) > 0.5: hit(("no-move", s), r, s)
        for cid, b in B.items():
            if O[cid] > 0.1 and not inside(b, scene): hit(("inside-canvas", cid), "inside-canvas", cid)
        for kk in scene["connectors"]:
            if O[kk["id"]] > 0.1 and (O[kk["source"]] <= 0.1 or O[kk["target"]] <= 0.1): hit(("attached", kk["id"]), "attached", kk["id"])
    return sorted(found.values(), key=lambda v: (v["frame"], v["rule"], v["subject"]))


def inside(b, scene): return b["x"] >= 0 and b["y"] >= 0 and b["x"] + b["w"] <= scene["width"] and b["y"] + b["h"] <= scene["height"]
