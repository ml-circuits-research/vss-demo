## The textedit world (spec section 14): what runs on the DGX

Prepared and checked on CPU (generator passes `sop check` at 20000 sentences; a smoke `sop train --D 128 --epochs 1` on 355 sentences,
`sop export-web` and `calibrate.py` ran end to end; smoke numbers are pipeline checks, not results). One script does everything, under
the repository's GPU lock (`logs/.run.lock`), refusing an unclean tree:

```
training/worlds/textedit/gpu_textedit.sh [--wait] [--sizes "1000 5000 20000 50000"] [--ship <size>]
```

What it runs, in order (output: `runs/textedit_<commit>/`, log `textedit.log`):

1. Data-size curve (spec 4.5), for n in 1000 5000 20000 50000:
   ```
   python3 training/worlds/textedit/generate.py --out $WORK/$n/textedit --n $n --n_eval 400 --seed 0
   tool/bin/sop check --legend $WORK/$n/textedit/legend.json $WORK/$n/textedit/examples/*.sop
   tool/bin/sop train $WORK/$n/textedit --D 1024 --seeds 5 --device cuda --n_eval 600 --log_every 500 --no_ckpt --star_version 2 \
       --calibrate_on_heldout_formulations --threshold_rule fit --run_dir runs/textedit_<commit>/$n
   ```
2. Prose negatives into the shipped world's `raw/` (never committed; the world is in a temporary folder):
   ```
   python3 training/worlds/textedit/prose_synth.py --out $W/raw --n 4000 --seed 0
   python3 training/worlds/textedit/prose_download.py --cache ~/.cache/vss-prose --out $W/raw --n 4000 --seed 0 --pin   # first run only
   ```
   The first run pins the sha256 of the six Project Gutenberg sources (gutenberg.org is not reachable from the development machine, so
   they could not be pinned there): commit `training/worlds/textedit/prose_sources.lock.json` (hashes only). Later runs verify and stop on
   a mismatch (exit 3).
3. At the shipped size (default the largest; `--ship` overrides once the curve says where FULL on held-out formulations stops improving
   within seed variance), five single-seed models, each calibrated:
   ```
   tool/bin/sop train $W <same flags> --seed $s --seeds 1 --out $W/model_seed$s --run_dir runs/textedit_<commit>/ship_seed$s   # s = 0..4
   python3 training/worlds/textedit/calibrate.py --world $W --model $W/model_seed$s --splits runs/.../ship_seed$s/splits.json \
       --out runs/.../ship_seed$s/command_threshold.json
   ```
   and writes `dictation_table.md` (mean +- sd over the five seeds).
4. Export for the browser (seed 0):
   ```
   tool/bin/sop export-web --model $W/model_seed0 --out app/model/textedit
   cp training/worlds/textedit/normalize.json app/model/textedit/; cp runs/.../ship_seed0/command_threshold.json app/model/textedit/
   ```

Rows of Table 13 to report (criteria written before the run):

| row | measure | criterion | where |
|---|---|---|---|
| Editing commands in dictation | FULL frame of textedit on held-out formulations; confident-wrong and coverage at tau | as for the diagram world: confident-wrong < 2% at coverage > 80%, FULL reported; seen formulations FULL >= 0.98 | `runs/textedit_<commit>/<n>/metrics.json`, REPORT.md (every size, 5 seeds) |
| Editing commands in dictation | commands inserted as text (text + chip) | <= 5% | `dictation_table.md` (held-out formulations report half, new identities) |
| Dictated prose, command threshold | content executed as a command, prose with editing words | <= 1% of utterances | `dictation_table.md` (synthetic and public-domain prose test halves, by category) |
| Text target resolution | scripted documents and commands | 100% pass | `node app/tests/text_targets.mjs` (CPU, already 100%: 413/413 checks, 70 commands) |

Commit afterwards: `runs/textedit_<commit>/`, `app/model/textedit/`, and the prose lock file if it was pinned. Never commit the prose
`.tsv` files or the downloaded books.
