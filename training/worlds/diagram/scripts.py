"""scripts.py: long scripts of the diagram world (specification section 18.4, Table 13 row "Long scripts: 1, 5, 10 pages"): documents of
1, 5 and 10 pages with a title, sections under headings, paragraphs of commands, references over distance (a component of an earlier
section named by its label, by its kind word when it is the only one, by its kind word with a section qualifier, "the database from the
first section", "the gateway from section 2", or with an ordinal of creation, "the second database"), and planted out-of-world units.

The story is the one of paragraphs.py (StoryGen over generate.py's templates), kept across the whole document: up to three components
of one kind may exist, at most one per section, so that a plain kind word is used only when it names exactly one component and the
qualifiers are needed otherwise. Planted units are sentences outside the world's language (free description, opinions, an unknown
action); the expected mark is "out-of-world" and they must never be executed.

Gold, per document: units (section, paragraph, the text the reader reads after the qualifier pre-pass, frame or null, mentions,
qualifiers, planted flag), the gold circuit (links, discourse, order, cycle, conflicts within a section) by the rules of paragraphs.py,
the cross-section references, and the gold diagram after every section (the checkpoints) and at the end: components with word, label,
colour, size and style, and connectors as pairs. Positions are not part of the gold (the layout is measured by the layout scenarios).

Run: python3 scripts.py [--outdir ../../data/diagram/eval] [--seed 0] [--n1 20 --n5 6 --n10 3]"""
import argparse, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import numpy as np
import generate as G
from normalize import normalize
import paragraphs as P

WORDS_PER_PAGE = 300
TITLES = ["Data layer", "Payment services", "User accounts", "Order flow", "Storage", "Reporting", "Front end", "Back office", "Messaging",
          "Search", "Notifications", "Monitoring", "Integrations", "Security", "Billing", "Shipping", "Analytics", "Review"]
DOC_TITLES = ["Shop architecture", "Order processing", "Platform overview", "Payment system", "Support desk", "Warehouse system"]
# outside the world's language: free description, opinions, history, unknown actions, unknown properties; none contains a cut that the
# segmenter's strong rules would take (no ". ", no 'and' + action word, no connective)
OUT_OF_WORLD = [
    "A cloud hovers above the server, suggesting remote storage", "The team reviews this flow every quarter",
    "Make the database feel more trustworthy", "Users love how fast the checkout feels", "This part was designed in a hurry",
    "Imagine a river of data flowing through the system", "Animate the arrows with a gentle glow", "Encrypt the gateway",
    "Our auditors asked for this view last year", "Sprinkle some icons around the edges", "It should look friendly to new customers",
    "Translate every label into French", "Print this diagram on a large poster", "The cache was added after the outage",
    "Ask the architect whether this is correct", "Highlight the risky parts in some way", "Everything here runs on Kubernetes",
    "Give the user a happy face", "Send this to the whole team by email", "Nobody remembers why the queue exists",
    "Play a sound whenever a box appears", "Rotate the whole picture slightly", "The marketing team prefers softer colours",
    "Measure the latency of the payment path", "Keep a backup of this somewhere safe", "Write a summary of the design for the board",
    "Show the traffic in real time", "Our cat walked across the keyboard here", "Calculate the monthly cost of the servers",
    "Make it look like a subway map"]


def unit_record(u, section, para, planted=None, text_tokens=None):
    if planted is not None:
        return {"section": section, "paragraph": para, "planted": True, "surface": planted, "tokens": text_tokens, "frame": None, "event": None,
                "mentions": {}, "qualifiers": [], "primary": None, "expected_mark": "out-of-world"}
    return {"section": section, "paragraph": para, "planted": False, "surface": u["surface"], "tokens": u["read_tokens"], "frame": u["frame"],
            "event": u["event"], "mentions": u["mentions"], "qualifiers": u["qualifiers"], "primary": u["primary"], "template": u["template"]}


def paragraph(sg, units, section, para, plant):
    """assemble the units of one paragraph (paragraphs.assemble) and optionally plant one out-of-world sentence in it; returns the
    paragraph text and its units in text order with their connective (indices local to the paragraph)"""
    groups = [units]
    if plant and len(units) >= 2:
        k = int(sg.r.integers(1, len(units))); groups = [units[:k], units[k:]]
    parts, recs = [], []
    for gi, grp in enumerate(groups):
        surface, joins, order = P.assemble(grp, sg, allow_before=len(grp) >= 2, allow_if=True)
        for t, si in enumerate(order):
            op, jw, att = joins[t]; u = grp[si]
            r = unit_record(u, section, para); r["story"] = u["_k"]
            r["connective"] = None if op is None else {"op": op, "words": [w for w in jw if w not in (",", ".")], "attach_local": (t + 1) if att == "next" else (t - 1), "group": gi}
            r["_group"] = gi; r["_t"] = t; recs.append(r)
        parts.append(surface)
        if plant and gi == 0:
            s = sg.pick(OUT_OF_WORLD) if len(groups) > 1 else None
            if s:
                parts.append(s + "."); toks = normalize(s)[0]
                r = unit_record(None, section, para, planted=s, text_tokens=toks); r["story"] = None; r["connective"] = None; r["_group"] = -1; r["_t"] = 0; recs.append(r)
    if plant and len(groups) == 1:
        s = sg.pick(OUT_OF_WORLD); parts.append(s + "."); toks = normalize(s)[0]
        r = unit_record(None, section, para, planted=s, text_tokens=toks); r["story"] = None; r["connective"] = None; r["_group"] = -1; r["_t"] = 0; recs.append(r)
    return " ".join(parts), recs


def simulate(units, order, story):
    """the gold diagram: the effect of every executed unit, in execution order; returns snapshots after each section"""
    comps, members, conns = {}, {}, []
    def new_members(eid, n, proto):
        members[eid] = []
        for k in range(n):
            cid = f"{eid}.{k}"; comps[cid] = dict(proto); members[eid].append(cid)
    def attr_of(fl):
        a = fl[2][1] if fl and fl[0] == "entity" and fl[2] and fl[2][0] == "word" else None
        return {"color": a if a in G.COLORS else None, "size": a if a in G.SIZES else "medium", "style": a if a in G.STYLES else None}
    snaps = {}; last_section = {}
    for i, u in enumerate(units): last_section[u["section"]] = i
    done = set()
    def snapshot(): return {"components": {k: dict(v) for k, v in sorted(comps.items())}, "connectors": sorted([list(c) for c in conns])}
    for i in order:
        u = units[i]; done.add(i)
        if not u["planted"] and not u["frame"]["neg"]:
            ev, m, fr = u["event"], u["mentions"], u["frame"]["roles"]; word = lambda r: fr[r][1] if r in fr and fr[r][0] == "word" else None
            obj = m.get("object", [None, None]); src = m.get("source", [None, None]); tgt = m.get("target", [None, None])
            if obj[1] == "create":
                e = story.ents[obj[0]]; a = attr_of(fr["object"])
                new_members(obj[0], int(word("quantity") or 1), {"word": e["word"], "label": word("text"), **a})
            elif ev == "change" and obj[0]:
                for c in members.get(obj[0], []):
                    for a in ("color", "style"):
                        if word(a): comps[c][a] = word(a)
                    if word("size"): comps[c]["size"] = word("size") if word("size") in G.SIZES and not word("amount") else None
            elif ev == "resize" and obj[0]:
                for c in members.get(obj[0], []): comps[c]["size"] = word("size") if word("size") in G.SIZES else None
            elif ev == "name" and obj[0]:
                for c in members.get(obj[0], []): comps[c]["label"] = word("text")
            elif ev == "delete" and obj[0]:
                gone = set(members.get(obj[0], []))
                for c in gone: comps.pop(c, None)
                conns[:] = [c for c in conns if c[0] not in gone and c[1] not in gone]; members[obj[0]] = []
            elif ev == "copy" and obj[0]:
                ce = next(e for e in story.ents.values() if e["intro"] == [u["story"], "copy"])
                members[ce["eid"]] = []
                for k, c in enumerate(members.get(obj[0], [])):
                    cid = f"{ce['eid']}.{k}"; comps[cid] = dict(comps[c]); members[ce["eid"]].append(cid)
            elif ev == "group" and obj[0]:
                ce = next(e for e in story.ents.values() if e["intro"] == [u["story"], "group"])
                new_members(ce["eid"], 1, {"word": "container", "label": word("text"), "color": None, "size": None, "style": "dashed"})
            elif ev == "connect" and src[0]:
                s = members.get(src[0], [])
                if word("pairing"): conns.extend((s[k], s[k + 1]) for k in range(len(s) - 1))
                elif tgt[0]: conns.extend((a, b) for a in s for b in members.get(tgt[0], []))
        for sec, li in last_section.items():
            if sec not in snaps and all(j in done for j, v in enumerate(units) if v["section"] <= sec): snaps[sec] = snapshot()
    return [snaps[s] for s in sorted(snaps)], snapshot()


def document(rng, pages, did):
    st = P.Story(max_per_group=3, qualifiers=True); sg = P.StoryGen(rng, G.LABELS_TRAIN, G.NUMS_TRAIN, st)
    n_sec = max(2, int(round(1.6 * pages + 1))) if pages > 1 else 3
    target = WORDS_PER_PAGE * pages; per_sec = target / n_sec
    title = sg.pick(DOC_TITLES); heads = list(TITLES); sg.r.shuffle(heads)
    lines = [f"# {title}", ""]; units = []; words = 0; k = 0; sections = []
    for s in range(n_sec):
        st.section = s; heading = heads[s % len(heads)] + ("" if s < len(heads) else f" {s // len(heads) + 1}")
        lines += [f"## {heading}", ""]; sections.append(heading); sw = 0; para = 0
        while sw < per_sec:
            n = int(sg.r.integers(2, 6)); us = []
            for _ in range(n):
                for _try in range(40):
                    ev = P.choose_event(sg, len(us) if para == 0 else 5)
                    u = P.make_unit(sg, ev, k, pron=bool(us))
                    if u is not None: break
                if u is None: continue
                P.apply(st, u, k); u["_k"] = k; us.append(u); k += 1
            if not us: continue
            text, recs = paragraph(sg, us, s, para, plant=sg.coin(0.3))
            # connectives: local indices -> global unit indices
            base = len(units)
            for j, r in enumerate(recs):
                c = r["connective"]
                if c is not None:
                    same = [jj for jj, x in enumerate(recs) if x["_group"] == r["_group"]]
                    tgt = same[same.index(j) + (c["attach_local"] - r["_t"])]
                    r["_conn"] = {"op": c["op"], "words": c["words"], "attach": base + tgt}
            for r in recs:
                r["connective"] = r.pop("_conn", None); r.pop("_group"); r.pop("_t")
            units += recs; lines += [text, ""]; w = len(text.split()); sw += w; words += w; para += 1
    # gold read texts: the unit's tokens and the period that ends its sentence (checked against the normalized paragraph)
    for i, u in enumerate(units):
        u["i"] = i
    check_and_texts(units, lines)
    for u in units: u.setdefault("connective", None)
    gu = [{"i": u["i"], "story": u["story"] if u["story"] is not None else -1 - u["i"], "mentions": u["mentions"], "connective": u["connective"],
           "event": u["event"] or "_planted", "frame": u["frame"] or {"neg": True, "roles": {}}, "section": u["section"]} for u in units]
    circ = P.gold_circuit(gu, st, conflict_scope=lambda x: x["section"])
    checkpoints, final = simulate(units, circ["order"], st)
    far = []
    for u in units:
        for r, (eid, how) in u["mentions"].items():
            if eid and how != "create" and st.ents[eid]["section"] < u["section"]: far.append({"unit": u["i"], "role": r, "how": how, "intro": st.ents[eid]["intro"]})
    by_story = {u["story"]: u["i"] for u in units if u["story"] is not None}
    for f in far: f["link"] = f"{f['unit']}.{f['role']}=>{by_story[f['intro'][0]]}.{f['intro'][1]}"; f.pop("intro")
    entities = {eid: {"intro": [by_story[e["intro"][0]], e["intro"][1]], "word": e["word"], "section": e["section"]} for eid, e in st.ents.items()
                if e["intro"][0] in by_story}
    text = "\n".join(lines).rstrip() + "\n"
    for u in units: u.pop("story", None)
    return {"id": did, "pages": pages, "title": title, "sections": sections, "text": text, "n_words": words, "units": units,
            "n_planted": sum(1 for u in units if u["planted"]), "far_references": far, "entities": entities, **circ, "checkpoints": checkpoints, "final": final}


def check_and_texts(units, lines):
    """the period that closes a unit's sentence belongs to its text (as the segmenter keeps it); verified on the normalized paragraphs"""
    paras = [l for l in lines if l and not l.startswith("#")]
    by_para = {}
    for u in units: by_para.setdefault((u["section"], u["paragraph"]), []).append(u)
    keys = sorted(by_para)
    assert len(keys) == len(paras), (len(keys), len(paras))
    for key, ptxt in zip(keys, paras):
        toks = P.strip_qualifiers(normalize(ptxt)[0]); pos = 0
        for u in by_para[key]:
            c = u.get("connective")
            n = len(u["tokens"])
            # skip connective words, commas and periods before the unit
            while pos < len(toks) and toks[pos:pos + n] != u["tokens"]: pos += 1
            if pos >= len(toks): raise ValueError(f"unit not found in paragraph: {u['tokens']} in {toks}")
            pos += n; u["text"] = " ".join(u["tokens"] + (["."] if pos < len(toks) and toks[pos] == "." else []))


def build(outdir, seed, counts):
    os.makedirs(outdir, exist_ok=True)
    for pages, n in counts:
        rng = np.random.default_rng(1000 * pages + seed); out = os.path.join(outdir, f"scripts_{pages}p.jsonl")
        with open(out, "w") as f:
            docs = [document(rng, pages, f"s{pages}p{i:02d}") for i in range(n)]
            for d in docs: f.write(json.dumps(d, sort_keys=True) + "\n")
        print(f"{out}: {n} documents of {pages} page(s); words {sum(d['n_words'] for d in docs)}; units {sum(len(d['units']) for d in docs)}; "
              f"planted {sum(d['n_planted'] for d in docs)}; far references {sum(len(d['far_references']) for d in docs)}; "
              f"cycles {sum(1 for d in docs if d['cycle'])}; conflicts {sum(len(d['conflicts']) for d in docs)}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--outdir", default=os.path.join(HERE, "..", "..", "data", "diagram", "eval")); ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--n1", type=int, default=20); ap.add_argument("--n5", type=int, default=6); ap.add_argument("--n10", type=int, default=3)
    a = ap.parse_args(); build(os.path.normpath(a.outdir), a.seed, [(1, a.n1), (5, a.n5), (10, a.n10)])
