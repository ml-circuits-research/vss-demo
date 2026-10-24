# training/data/: frozen datasets of our own worlds

Every dataset here was produced by a generator of this repository, with its seed; the files are gzip-compressed and every uncompressed
file has its sha256 in `MANIFEST.json`. Restore a world folder before training:

```
python3 training/data/unpack.py diagram/n50000 /path/to/work      # writes /path/to/work/diagram/ (legend, kinds, examples, split hints)
tool/bin/sop train /path/to/work/diagram --star_version 2 ...
```

| dataset | generator and seed | content |
|---|---|---|
| `diagram/n1000`, `n5000`, `n20000`, `n50000` | `worlds/diagram/generate.py --n <n> --n_eval 400 --seed 0` | the data-size curve of spec 4.5 (step 3); each with `COVERAGE.md` |
| `diagram/eval/` | `worlds/diagram/paragraphs.py`, `scripts.py` | paragraphs, long sentences and 1 / 5 / 10 page scripts with gold circuits |
| `animation/eval/` | `worlds/animation/animation_scripts.py` | animation scripts with gold timelines |

After a deliberate regeneration: `python3 training/data/unpack.py --write-manifest`, and say why in the commit message.
No third-party data is stored here (training/README.md).
