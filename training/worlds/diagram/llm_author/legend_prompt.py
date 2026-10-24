"""legend_prompt.py: writes legend_prompt.md, the instruction that teaches a large model the diagram world's language (specification
section 18.3): the component kinds, the attributes, the relations and places, the actions, example sentences of each family drawn from
generate.py's templates (the same templates the reader was trained on), and the rules (only these words, free English, one request per
sentence, name every component that will be referred to later). Deterministic (fixed seed); the prompt's SHA-256 is recorded with every
authored script, so a comparison table always names the prompt it used.
Run: python3 legend_prompt.py [--out legend_prompt.md]"""
import argparse, hashlib, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.dirname(HERE))
import numpy as np
import generate as G
import paragraphs as P

RULES = """Rules:
1. Use only the words of this legend for components, attributes, places and actions; write free English around them.
2. One request per sentence. A sentence may start with "Then" or "After that" when the order matters.
3. Name every component you will refer to later: "add a database called orders". Refer back to it by its name ("connect orders to
   the api"), by its kind when it is the only one of its kind ("the gateway"), or by "it" for the component of the previous sentence.
4. Use headings ("## Payment services") to split a long script into sections; a component from an earlier section may be named by its
   name, or by "the <kind> from the first section", "the <kind> from section 2", "the second <kind>" (order of creation).
5. Do not describe, explain or comment: no sentence that is not a request for the editor. Do not use actions, properties or words that
   are not listed here; when something cannot be said with these words, leave it out.
6. Write the script only: a title line "# <title>", then the sections."""


def examples(n_per_event=2, seed=0):
    rng = np.random.default_rng(seed); out = []
    for ev in P.W_EV:
        got = 0; tries = 0
        while got < n_per_event and tries < 200:
            tries += 1; st = P.Story(); sg = P.StoryGen(rng, G.LABELS_TRAIN, G.NUMS_TRAIN, st)
            pre = P.make_unit(sg, "create", 0); P.apply(st, pre, 0)
            pre2 = P.make_unit(sg, "create", 1); P.apply(st, pre2, 1) if pre2 else None
            u = P.make_unit(sg, ev, 2)
            if u is None: continue
            s = u["surface"].replace("lets", "let's").replace("dont", "don't")
            out.append((ev, s[0].upper() + s[1:] + ".")); got += 1
    return out


def build():
    words = lambda xs: ", ".join(x.replace("_", " ") for x in xs)
    parts = ["# The diagram editor's language", "",
             "You write scripts for a diagram editor. The editor reads every sentence with a small reader that knows only the language",
             "below; a sentence outside it is marked and not executed. Write the diagram described to you as such a script.", "",
             "## Components", "", words(sorted(P.STORY_HEADS)) + "; connectors: " + words(G.EDGE_HEADS) + "; groups: container.", "",
             "## Attributes", "", "colours: " + words(G.COLORS) + "; sizes: " + words(G.SIZES) + ", bigger, smaller; line styles: " + words(G.STYLES) + ".", "",
             "## Places", "", "on the canvas: " + words(G.REGIONS) + "; relative to a component: " + words(G.RELATIONS) +
             " (with an optional distance: \"20 px below the database\"); towards an edge: " + words(G.ANCHORS) + ", halfway, a third of the way, a quarter of the way;",
             "directions: " + words(G.DIRECTIONS) + "; layouts: in a row, in a column, in a grid, as a tree, in a circle, as a flow from left to right, as a flow from top to bottom.", "",
             "## Actions", ""]
    for ev, vs in G.EVENTS.items():
        if ev in P.EXCLUDED: continue
        parts.append(f"- {ev}: {', '.join(vs)}")
    parts += ["- prohibitions: \"do not ...\", \"never ...\" before an action (the editor then refuses that action on that component)", "",
              "## Examples", ""]
    for ev, s in examples(): parts.append(f"- ({ev}) {s}")
    parts += ["", RULES, ""]
    return "\n".join(parts)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default=os.path.join(HERE, "legend_prompt.md")); a = ap.parse_args()
    text = build(); open(a.out, "w").write(text)
    print(f"{a.out}: {len(text.split())} words, sha256:{hashlib.sha256(text.encode()).hexdigest()}")
