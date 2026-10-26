"""paraphrase.py: step 4 of the VSS Diagram Editor (spec 4.2): a large model rewrites a sample of the generated commands into the ways
people type and speak, keeping the meaning; the gold wires stay those of the source sentence. Paraphrase FAMILIES (one prompt style x one
model) are written to separate files and split as whole families between training and test (split_hints.json is updated: the families
named in --heldout_families go to 'heldout_formulations_para', the others are training data). Every rewrite is normalized by normalize.py,
exactly as the editor normalizes input, and must keep every filler word of its source (labels, numbers, colours...); a rewrite that drops
or changes a filler is rejected and counted (it would change the frame). The second look (the reader trained on templates re-reads the
paraphrases; confident disagreements are reviewed) is the train-world skill's `loop.py second-look`, run afterwards.

All model calls go through tool/skills/train-world/scripts/llm.py (role 'annotate'; the model is named in world.json). With no API
credentials the script stops with 'API unavailable'; --dry_run writes the prompts and a trivially rewritten copy (for testing the format).
Run: python3 paraphrase.py <world dir> [--n 2000] [--families typed_casual,spoken,terse,polite_long,free] [--estimate] [--heldout_families terse] [--dry_run]"""
import argparse, json, os, sys, collections, datetime, math
HERE = os.path.dirname(os.path.abspath(__file__)); TOOL = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(HERE))), "tool")
sys.path.insert(0, TOOL); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(TOOL, "skills", "train-world", "scripts"))
import numpy as np
from sop import soplang, world as worldmod
from sop.legend import Legend, tokenize
from normalize import normalize

FAMILIES = {
    "typed_casual": "Rewrite each command the way a busy person would TYPE it into a chat box: casual, lower case, short words like 'pls' or 'u' are fine, small word-order changes are fine.",
    "spoken": "Rewrite each command the way a person would SAY it aloud to a voice assistant: spoken style, fillers like 'okay', 'um', 'so' are fine, no punctuation, numbers as words.",
    "terse": "Rewrite each command as tersely as possible, like a note to oneself: drop politeness and filler words; keep articles (a, an, the, all, every, each) and every name, number, colour, size, style and position word.",
    "polite_long": "Rewrite each command as a polite, slightly longer request, as one would write to a colleague, in one sentence.",
    "free": ("Rephrase each command as a person would who has never seen the original wording: use another verb of the same action where one exists "
             "(the line lists the verbs of its action in square brackets), another word order, a relative clause where natural, a pronoun ('it', 'them') "
             "for a component named twice; still one command per line, the same meaning, every name, number, colour, size, style and position word kept."),
}
# expected output length relative to the numbered source lines (for --estimate only)
OUT_FACTOR = {"typed_casual": 1.0, "spoken": 1.2, "terse": 0.7, "polite_long": 1.6, "free": 1.3}
RULES = ("Rules: keep the meaning EXACTLY; keep every name, label, number, colour, size, style and position word as it is (you may change "
         "the other words); one command per line, same order, same count; no explanations; output only the numbered lines.")


def fillers(wire, by):
    f = worldmod.frame_of(wire, by, None); words = set()
    for fl in f["roles"].values(): words |= set(worldmod.filler_words(fl))
    return words


def build_prompt(fam, chunk, by, legend):
    lines = []
    for j, w in enumerate(chunk):
        t = f"{j + 1}. {w.value('_text')}"
        if fam == "free":
            ev = worldmod.frame_of(w, by, None).get("event"); vs = legend.events.get(ev, [])
            if vs: t += f"  [verbs of this action: {', '.join(vs)}]"
        lines.append(t)
    return FAMILIES[fam] + "\n" + RULES + "\n\n" + "\n".join(lines)


def signature(toks, need, legend):
    """the formulation of a sentence (as tool/sop/train.py signature): filler words replaced by their kind"""
    return " ".join((legend.kind(t) or "?") if t in need or legend.lemma_of(t) in need else t for t in toks)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("world"); ap.add_argument("--n", type=int, default=2000); ap.add_argument("--batch", type=int, default=25)
    ap.add_argument("--families", default=",".join(FAMILIES)); ap.add_argument("--heldout_families", default="terse"); ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--dry_run", action="store_true")
    ap.add_argument("--estimate", action="store_true", help="no API call, nothing written: print the number of calls and an estimated token count")
    a = ap.parse_args(); wd = os.path.abspath(a.world); legend = Legend(os.path.join(wd, "legend.json"))
    doc = soplang.load(os.path.join(wd, "examples", "train.sop")); by = doc.by_id(); tops = [w for w in doc.top_level() if w.value("_text")]
    rng = np.random.default_rng(a.seed); pick = [tops[i] for i in sorted(rng.choice(len(tops), min(a.n, len(tops)), replace=False))]
    fams = a.families.split(",")
    if a.estimate:
        tot_c = tot_i = tot_o = 0
        for fam in fams:
            ps = [build_prompt(fam, pick[i:i + a.batch], by, legend) for i in range(0, len(pick), a.batch)]
            ti = sum(len(x) for x in ps) // 4
            to = int(sum(len(w.value("_text")) + 5 for w in pick) * OUT_FACTOR[fam] / 4)
            print(f"  estimate {fam}: {len(ps)} calls, ~{ti} input tokens, ~{to} output tokens"); tot_c += len(ps); tot_i += ti; tot_o += to
        print(f"  estimate total: {tot_c} calls ({len(pick)} sentences / batch {a.batch} x {len(fams)} families), ~{tot_i} input tokens, ~{tot_o} output tokens "
              f"(prompt chars / 4; output = source line chars x a per-family factor / 4)")
        return 0
    if not a.dry_run:
        import llm
    # the kind sequences of the training sentences (every top-level text of train.sop), for the measure of new language
    train_forms = {signature(tokenize(w.value("_text")), fillers(w, by), legend) for w in tops}
    tot_use = {"calls": 0, "input_tokens": 0, "output_tokens": 0}
    hints_p = os.path.join(wd, "split_hints.json"); hints = json.load(open(hints_p)); stats = {}
    for fam in fams:
        out = soplang.Doc(directives=[("world", "diagram", None), ("legend", legend.sha, None), ("generated", f"paraphrase.py family {fam} ({datetime.date.today()})", None)])
        kept = rejected = 0; k = 0; prompts = []; rej = []; forms = []; use = {"calls": 0, "input_tokens": 0, "output_tokens": 0}
        for i in range(0, len(pick), a.batch):
            chunk = pick[i:i + a.batch]
            prompt = build_prompt(fam, chunk, by, legend); prompts.append(prompt)
            if a.dry_run:      # a trivial rewrite; every 9th line is missing and every 9th (offset 6) loses its first filler, to exercise the rejection file
                lines = []
                for j, w in enumerate(chunk):
                    if j % 9 == 4: continue
                    t = w.value("_text").split()
                    if j % 9 == 6:
                        nd = fillers(w, by); t = [x for x in t if x != next((y for y in t if y in nd), None)]
                    lines.append(f"{j + 1}. okay so {' '.join(t)}")
                use["calls"] += 1; use["input_tokens"] += len(prompt) // 4; use["output_tokens"] += sum(len(l) for l in lines) // 4
            else:
                try: lines = llm.llm_call("annotate", prompt, wd, max_tokens=4000).strip().split("\n")
                except llm.LLMUnavailable as e: print(f"{fam}: {e}"); return 2
                use["calls"] += 1; use["input_tokens"] += llm.last_usage["input_tokens"]; use["output_tokens"] += llm.last_usage["output_tokens"]
            got = {}
            for l in lines:
                l = l.strip()
                if ". " in l and l.split(". ", 1)[0].isdigit(): got[int(l.split(". ", 1)[0]) - 1] = l.split(". ", 1)[1]
            for j, w in enumerate(chunk):
                if j not in got:
                    rejected += 1; rej.append({"id": w.id, "source": w.value("_text"), "rewrite": None, "reason": "no line"}); continue
                toks, info = normalize(got[j]); need = fillers(w, by)
                if not need <= set(toks):          # a filler dropped or changed: the frame would change
                    rejected += 1; rej.append({"id": w.id, "source": w.value("_text"), "rewrite": got[j], "reason": "filler missing or changed: " + ", ".join(sorted(need - set(toks)))}); continue
                forms.append(signature(toks, need, legend))
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
        os.makedirs(os.path.join(wd, "audit"), exist_ok=True)      # a world unpacked from training/data has no audit/ folder
        with open(os.path.join(wd, "audit", f"para_{fam}_prompts.txt"), "w") as f: f.write("\n\n----\n\n".join(prompts))
        if fam in a.heldout_families.split(","): hints.setdefault("file_splits", {})[f"examples/{fname}"] = "heldout_formulations_para"
        with open(os.path.join(wd, "audit", f"para_{fam}_rejected.jsonl"), "w") as f:
            for r in rej: f.write(json.dumps(r) + "\n")
        new = sum(1 for x in forms if x not in train_forms)
        stats[fam] = {"kept": kept, "rejected_filler_changed_or_missing": rejected, "new_formulation_share": new / max(1, len(forms)),
                      "distinct_kind_sequences": len(set(forms)), "api_calls": use["calls"], "input_tokens": use["input_tokens"], "output_tokens": use["output_tokens"]}
        for key in tot_use: tot_use[key] += use[key]
        print(f"  family {fam}: kept {kept}, rejected {rejected} (a filler dropped or changed, or no line) -> examples/{fname}; rejected lines -> audit/para_{fam}_rejected.jsonl")
        print(f"    new language: {new}/{len(forms)} = {new / max(1, len(forms)):.3f} of kept rewrites have a kind sequence not among the {len(train_forms)} training ones; "
              f"{len(set(forms))} distinct kind sequences")
        print(f"    cost: {use['calls']} calls, {use['input_tokens']} input / {use['output_tokens']} output tokens{' (dry run: estimated from lengths)' if a.dry_run else ''}")
    print(f"  cost total: {tot_use['calls']} calls, {tot_use['input_tokens']} input / {tot_use['output_tokens']} output tokens")
    stats["_total_cost"] = tot_use
    hints["paraphrase_families"] = {"families": fams, "heldout": a.heldout_families.split(","), "stats": stats, "dry_run": a.dry_run}
    json.dump(hints, open(hints_p, "w"), indent=1)
    return 0


if __name__ == "__main__": sys.exit(main())
