# training/data/: frozen datasets of our own worlds

Every dataset here was produced by a generator of this repository, with its seed; the files are gzip-compressed and every uncompressed
file has its sha256 in `MANIFEST.json`. Restore a world folder before training:

```
python3 training/data/unpack.py diagram/n50000 /path/to/work      # writes /path/to/work/diagram/ (legend, kinds, examples, split hints)
python3 training/data/unpack.py diagram_ro/n50000 /path/to/work   # writes /path/to/work/diagram_ro/ (the folder name is the world name)
tool/bin/sop train /path/to/work/diagram --star_version 2 ...
```

| dataset | generator and seed | content |
|---|---|---|
| `diagram/n1000`, `n5000`, `n20000`, `n50000` | `worlds/diagram/generate.py --n <n> --n_eval 400 --seed 0` | the data-size curve of spec 4.5 (step 3); each with `COVERAGE.md`. Regenerated 2026-10-25: the legend gained `reader.identity = "lemma"` (sha256 `e3e44ee9f7e8...`); the sentences are unchanged |
| `diagram_ro/n1000`, `n5000`, `n20000`, `n50000` | `worlds/diagram_ro/generate.py --n <n> --n_eval 400 --seed 0` | the Romanian world (variant A of vision/ADDENDUM_languages_2026-10-25.md): the English legend byte-identical, Romanian sentences, `kinds.tsv` with the lemma column; `eval_mixed.sop` (code-switched) and `eval_parallel.jsonl` (the same 400 frames as English, Romanian, mixed and Romglish sentences, with gold circuits) |
| `diagram_multi/n1000`, `n5000`, `n20000`, `n50000` | `worlds/diagram_ro/generate.py --languages ro,en,mix --n <n> --n_eval 400 --seed 0` | the bilingual world (variant B): training sentences English 0.4, Romanian 0.4, mixed 0.2; Romanian and English held-out formulation and new-identity files, `eval_mixed.sop`, `eval_parallel.jsonl` |
| `diagram/n5000_edge`, `diagram_ro/n5000_edge`, `diagram_multi/n5000_edge` | the same commands as the n5000 rows above, written by generator commit `9ff4343` with `SUFFIX=_edge SIZES_ONLY=5000 PYTHON=<venv python> bash training/data/freeze.sh diagram diagram_ro diagram_multi` | D17 (Q9 a): the connect line is its own role `edge` ("with which line?", kind EDGE for line / arrow / connector / edge; Romanian linie, săgeată, conector, muchie) instead of `object`; the legend is shared by the three worlds, sha256 `0fcc87608bb4...` (before: `1a43ffc61bd5...` as computed from the n5000 legend.json). The frozen `n5000` folders stay untouched as the "before" row. `link` is not an edge word (it is a connect verb; a word has one kind) |
| `diagram/eval/` | `worlds/diagram/paragraphs.py`, `scripts.py` | paragraphs, long sentences and 1 / 5 / 10 page scripts with gold circuits |
| `animation/eval/` | `worlds/animation/animation_scripts.py` | animation scripts with gold timelines |

After a deliberate regeneration: `python3 training/data/unpack.py --write-manifest`, and say why in the commit message.
No third-party data is stored here (training/README.md).
