"""paraphrase.py: step 4 of the VSS Diagram Editor (spec 4.2): a large model rewrites a sample of the generated commands into the ways
people type and speak, keeping the meaning; the gold wires stay those of the source sentence. Paraphrase FAMILIES (one prompt style x one
model) are written to separate files and split as whole families between training and test (split_hints.json is updated: the families
named in --heldout_families go to 'heldout_formulations_para', the others are training data). Every rewrite is normalized by normalize.py,
exactly as the editor normalizes input, and must keep every filler word of its source (labels, numbers, colours...); a rewrite that drops
or changes a filler is rejected and counted (it would change the frame). The second look (the reader trained on templates re-reads the
paraphrases; confident disagreements are reviewed) is the train-world skill's `loop.py second-look`, run afterwards.

All model calls go through tool/skills/train-world/scripts/llm.py (role 'annotate'; the model is named in world.json). With no API
credentials the script stops with 'API unavailable'; --dry_run writes the prompts and a trivially rewritten copy (for testing the format).
Run: python3 paraphrase.py <world dir> [--n 2000] [--families typed_casual,spoken,terse,polite_long] [--heldout_families terse] [--dry_run]"""
import argparse, json, os, sys, collections, datetime
HERE = os.path.dirname(os.path.abspath(__file__)); TOOL = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(HERE))), "tool")
sys.path.insert(0, TOOL); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(TOOL, "skills", "train-world", "scripts"))
import numpy as np
from sop import soplang, world as worldmod
from sop.legend import Legend
from normalize import normalize

FAMILIES = {
    "typed_casual": "Rewrite each command the way a busy person would TYPE it into a chat box: casual, lower case, short words like 'pls' or 'u' are fine, small word-order changes are fine.",
    "spoken": "Rewrite each command the way a person would SAY it aloud to a voice assistant: spoken style, fillers like 'okay', 'um', 'so' are fine, no punctuation, numbers as words.",
    "terse": "Rewrite each command as tersely as possible, like a note to oneself: drop politeness and articles where English still allows it.",
    "polite_long": "Rewrite each command as a polite, slightly longer request, as one would write to a colleague, in one sentence.",
}
RULES = ("Rules: keep the meaning EXACTLY; keep every name, label, number, colour, size, style and position word as it is (you may change "
         "the other words); one command per line, same order, same count; no explanations; output only the numbered lines.")


def fillers(wire, by):
    f = worldmod.frame_of(wire, by, None); words = set()
    for fl in f["roles"].values(): words |= set(worldmod.filler_words(fl))
    return words


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("world"); ap.add_argument("--n", type=int, default=2000); ap.add_argument("--batch", type=int, default=25)
    ap.add_argument("--families", default=",".join(FAMILIES)); ap.add_argument("--heldout_families", default="terse"); ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--dry_run", action="store_true")
    a = ap.parse_args(); wd = os.path.abspath(a.world); legend = Legend(os.path.join(wd, "legend.json"))
    doc = soplang.load(os.path.join(wd, "examples", "train.sop")); by = doc.by_id(); tops = [w for w in doc.top_level() if w.value("_text")]
    rng = np.random.default_rng(a.seed); pick = [tops[i] for i in sorted(rng.choice(len(tops), min(a.n, len(tops)), replace=False))]
    if not a.dry_run:
        import llm
    hints_p = os.path.join(wd, "split_hints.json"); hints = json.load(open(hints_p)); stats = {}
    for fam in a.families.split(","):
        out = soplang.Doc(directives=[("world", "diagram", None), ("legend", legend.sha, None), ("generated", f"paraphrase.py family {fam} ({datetime.date.today()})", None)])
        kept = rejected = 0; k = 0; prompts = []
        for i in range(0, len(pick), a.batch):
            chunk = pick[i:i + a.batch]
            prompt = FAMILIES[fam] + "\n" + RULES + "\n\n" + "\n".join(f"{j + 1}. {w.value('_text')}" for j, w in enumerate(chunk))
            prompts.append(prompt)
            if a.dry_run: lines = [f"{j + 1}. okay so {w.value('_text')}" for j, w in enumerate(chunk)]
            else:
                try: lines = llm.llm_call("annotate", prompt, wd, max_tokens=4000).strip().split("\n")
                except llm.LLMUnavailable as e: print(f"{fam}: {e}"); return 2
            got = {}
            for l in lines:
                l = l.strip()
                if ". " in l and l.split(". ", 1)[0].isdigit(): got[int(l.split(". ", 1)[0]) - 1] = l.split(". ", 1)[1]
            for j, w in enumerate(chunk):
                if j not in got: rejected += 1; continue
                toks, info = normalize(got[j]); need = fillers(w, by)
                if not need <= set(toks): rejected += 1; continue          # a filler dropped or changed: the frame would change
                # copy the source wire tree with the new text and provenance
                ids = {}; stack = [w]; copies = []
                while stack:
                    x = stack.pop(); ids[x.id] = f"p{k}"; k += 1; copies.append(x)
                    for r in x.refs(): stack.append(by[r])
                for x in copies:
                    nw = soplang.Wire(ids[x.id], x.type)
                    for l in x.lines:
                        if l.key == "_text": nw.lines.append(soplang.Line("_text", " ".join(toks)))
                        elif l.key == "_source": nw.lines.append(soplang.Line("_source", f"llm:{'dry_run' if a.dry_run else llm.model_for('annotate', wd)}"))
                        elif l.key == "_template": nw.lines.append(soplang.Line("_template", f"para.{fam}"))
                        else:
                            raw = l.raw
                            for old, new in ids.items(): raw = raw.replace(f"${old}", f"${new}") if raw else raw
                            nw.lines.append(soplang.parse(f"@x t\n{l.key}={raw}\n").wires[0].lines[0] if raw is not None else l)
                    out.wires.append(nw)
                kept += 1
        fname = f"para_{fam}.sop"; open(os.path.join(wd, "examples", fname), "w").write(soplang.write(out))
        with open(os.path.join(wd, "audit", f"para_{fam}_prompts.txt"), "w") as f: f.write("\n\n----\n\n".join(prompts))
        if fam in a.heldout_families.split(","): hints.setdefault("file_splits", {})[f"examples/{fname}"] = "heldout_formulations_para"
        stats[fam] = {"kept": kept, "rejected_filler_changed_or_missing": rejected}
        print(f"  family {fam}: kept {kept}, rejected {rejected} (a filler dropped or changed, or no line) -> examples/{fname}")
    hints["paraphrase_families"] = {"families": a.families.split(","), "heldout": a.heldout_families.split(","), "stats": stats, "dry_run": a.dry_run}
    json.dump(hints, open(hints_p, "w"), indent=1)
    return 0


if __name__ == "__main__": sys.exit(main())
