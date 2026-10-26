# The planted-questions world (TODO_DGX.md 2.8, item 4; addendum q-formalisation section 7)

An evaluation set, never training data: 300 diagram sentences (seed 0) carrying a question the diagram legend does not have. Gold for
every sentence: a `query` wire of kind `unsupported` (field names as fixed in responses D8). Criterion, written in the addendum before any
run: planted questions reported `unsupported` in >= 0.90 of the cases; no value emitted under tau; the hallucination rate (confidently
wrong decisions) reported. The same sentences are the "planted" out-of-world set of TODO 2.10 / 2.11 (AUROC of the explained residual).

| category | (a) modifier: in-world command + planted phrase | (b) sentence outside the legend | resolve |
|---|---|---|---|
| angle | "... rotated by 45 degrees", "at a 30 degree angle", "tilted 15 degrees", "turned 90 degrees clockwise" | rotate / tilt / spin, "turn the box 60 degrees", "what angle is ..." | person |
| time | "at 3 pm", "in 5 minutes", "tomorrow", "after 30 seconds", "every morning" | schedule ..., wait ..., "when was ... added?" | person |
| count | "as many times as there are servers", "for every third one", "one for each of the files i have" | "how many ... are there?", count ..., "tell me the number of ..." | planner, person |

50 sentences per (category, shape), all distinct; deterministic for a seed. Gold: shape (a) keeps the in-world wires of the diagram
generator (its templates, prefixes and normalizer) and adds a `query` wire about the planted words, referenced from the event wire by
`_query`; shape (b) is one `query` wire about `sentence`. `evidence` is the planted words (in (b), the template's words without the
in-world entity). Lexicon collisions are deliberate (82 sentences with a planted word of a content kind: `turn` VERB, `third` FRACTION,
`every` QUANT, `boxes` COMPONENT; 115 with a planted number, which a reader can misread as an amount).

Encoding choices of this generator that D8 does not fix (to be mapped when the source's soplang lands): `about` of a modifier query is the
planted words as a comma list (the unplaced words of a correct reading); the in-world event wire points to its query with `_query=$wN`.

```
python3 training/worlds/planted/generate.py --out <dir> [--n 300] [--seed 0]     # writes legend.json, examples/eval_planted.sop, planted.jsonl
```

`sop check` accepts every wire except the 300 `query` wires until the source's soplang knows the type (checked 2026-10-26: 300 errors,
all "unknown wire type 'query'"). The data are frozen into training/data/ (with the manifest) once the format is final, not before.
