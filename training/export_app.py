"""export_app.py: a trained world model -> the public application (app/model/<world>/), and app/model/index.json, the list the editor
reads (app/src/worlds.js). This is the only bridge from training/ to app/: it runs `sop export-web` and copies the world's normalizer table.

Usage:
  python3 training/export_app.py --world diagram --model <world dir>/model --bits 8 --status demo --note "step 3, 50k, seed 0, commit abc1234"
  python3 training/export_app.py --world diagram --model <...>/model --status dev --note "CPU development model: exercises the app, not measured"
  python3 training/export_app.py --remove textedit
Status: "demo" = a model trained by the DGX protocol whose rows are in STATUS.md; "dev" = anything else (the About panel and the badge say
"development model, not for measurement"). The note is shown in the About panel; say where the model comes from."""
import argparse, datetime, json, os, shutil, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(HERE)
APP_MODEL = os.path.join(REPO, "app", "model"); INDEX = os.path.join(APP_MODEL, "index.json")
NORMALIZERS = {"diagram": os.path.join(HERE, "worlds", "diagram", "normalize.json")}

def load_index():
    return json.load(open(INDEX)) if os.path.exists(INDEX) else {"worlds": [], "measured": None}

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--world"); ap.add_argument("--model"); ap.add_argument("--bits", type=int, default=8)
    ap.add_argument("--status", choices=["demo", "dev"], default="dev"); ap.add_argument("--note", default=""); ap.add_argument("--remove")
    ap.add_argument("--measured", help="one paragraph for the About panel: the criteria met, with the run that measured them")
    a = ap.parse_args(); idx = load_index(); os.makedirs(APP_MODEL, exist_ok=True)
    if a.measured is not None: idx["measured"] = a.measured
    if a.remove:
        idx["worlds"] = [w for w in idx["worlds"] if w["name"] != a.remove]; shutil.rmtree(os.path.join(APP_MODEL, a.remove), ignore_errors=True)
    elif a.world and a.model:
        out = os.path.join(APP_MODEL, a.world); shutil.rmtree(out, ignore_errors=True)
        subprocess.run([os.path.join(REPO, "tool", "bin", "sop"), "export-web", "--model", a.model, "--out", out, "--bits", str(a.bits)], check=True)
        norm = NORMALIZERS.get(a.world) or os.path.join(HERE, "worlds", a.world, "normalize.json")
        if os.path.exists(norm): shutil.copy(norm, os.path.join(out, "normalize.json"))
        cfg = json.load(open(os.path.join(a.model, "config.json")))
        entry = {"name": a.world, "dir": f"model/{a.world}", "bits": a.bits, "status": a.status, "note": a.note,
                 "D": cfg.get("D"), "legend_sha256": cfg.get("legend_sha256"), "star_version": cfg.get("star_version", 1),
                 "training_code_commit": cfg.get("training_code_commit"), "exported": datetime.date.today().isoformat()}
        if entry["star_version"] != 2: print("warning: star_version 1 model: words outside its catalog cannot be read in the browser (app/READER.md)", file=sys.stderr)
        idx["worlds"] = [w for w in idx["worlds"] if w["name"] != a.world] + [entry]
    else: sys.exit(__doc__)
    idx["worlds"].sort(key=lambda w: (w["name"] != "diagram", w["name"]))
    json.dump(idx, open(INDEX, "w"), indent=1); print(f"app/model/index.json: {[ (w['name'], w['status']) for w in idx['worlds']]}")

if __name__ == "__main__": main()
