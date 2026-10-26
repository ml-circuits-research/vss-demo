"""export_app.py: a trained world model -> the public application (app/model/<world>/), and app/model/index.json, the list the editor
reads (app/src/worlds.js). This is the only bridge from training/ to app/: it runs `sop export-web` and copies the world's normalizer table.

Usage:
  python3 training/export_app.py --world diagram --model <world dir>/model --bits 8 --status demo --note "step 3, 50k, seed 0, commit abc1234"
  python3 training/export_app.py --world diagram --model <...>/model --status dev --note "CPU development model: exercises the app, not measured"
  python3 training/export_app.py --world diagram_ro --model <...>/model --purpose diagram --language ro --status dev --note "..."
  python3 training/export_app.py --dict training/worlds/diagram_ro/translate_en.json --language ro --target diagram --note "given dictionary"
  python3 training/export_app.py --remove textedit          (or --remove-dict ro)
Purpose: what the world's readings are for (diagram, textedit, matheditor, animation); worlds of one purpose share one English legend and
the editor lets the user pick one of them or read with all and keep the clearest reading (app/src/worlds.js routesFor). Language: en, ro,
en+ro (bilingual). A dictionary (training/worlds/DICTIONARIES.md) is a route without training: app/model/dict/<language>.json.
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
    ap.add_argument("--purpose"); ap.add_argument("--language"); ap.add_argument("--dict"); ap.add_argument("--target", default="diagram"); ap.add_argument("--remove-dict")
    ap.add_argument("--normalizer", help="the normalizer table to ship with the world (default: training/worlds/<world>/normalize.json)")
    ap.add_argument("--measured", help="one paragraph for the About panel: the criteria met, with the run that measured them")
    a = ap.parse_args(); idx = load_index(); os.makedirs(APP_MODEL, exist_ok=True)
    if a.measured is not None: idx["measured"] = a.measured
    if a.dict:
        lang = a.language or json.load(open(a.dict)).get("language"); assert lang, "--language is needed"
        os.makedirs(os.path.join(APP_MODEL, "dict"), exist_ok=True); shutil.copy(a.dict, os.path.join(APP_MODEL, "dict", f"{lang}.json"))
        idx["dictionaries"] = [d for d in idx.get("dictionaries", []) if d["language"] != lang] + [{"language": lang, "file": f"model/dict/{lang}.json", "target_world": a.target, "note": a.note, "exported": datetime.date.today().isoformat()}]
    elif a.remove_dict:
        idx["dictionaries"] = [d for d in idx.get("dictionaries", []) if d["language"] != a.remove_dict]
        try: os.remove(os.path.join(APP_MODEL, "dict", f"{a.remove_dict}.json"))
        except FileNotFoundError: pass
    elif a.remove:
        idx["worlds"] = [w for w in idx["worlds"] if w["name"] != a.remove]; shutil.rmtree(os.path.join(APP_MODEL, a.remove), ignore_errors=True)
    elif a.world and a.model:
        out = os.path.join(APP_MODEL, a.world); shutil.rmtree(out, ignore_errors=True)
        subprocess.run([os.path.join(REPO, "tool", "bin", "sop"), "export-web", "--model", a.model, "--out", out, "--bits", str(a.bits)], check=True)
        norm = a.normalizer or NORMALIZERS.get(a.world) or os.path.join(HERE, "worlds", a.world, "normalize.json")
        if os.path.exists(norm): shutil.copy(norm, os.path.join(out, "normalize.json"))
        cfg = json.load(open(os.path.join(a.model, "config.json")))
        # the decoder the demo ships: the CONTRACT rules (tool/sop/activate.py class 1; vss-vs-bert R46 / R42 / R54): sentence candidates +
        # one-to-one, the explained residual, the adjacency rule for 'undecided'. Since 2026-10-26 `sop train` writes them itself (--decoder
        # contract, the default); a model trained by an older tool (no "decoder" key) gets them here, so that every shipped world has them.
        mj = os.path.join(out, "model.json"); m = json.load(open(mj))
        if "decoder" not in m["config"]: m["config"].update({"decoder": "contract", "undecided_adjacent": True, "candidates": "sentence", "residual": "explained"})
        json.dump(m, open(mj, "w"), separators=(",", ":"))
        import hashlib; b = open(mj, "rb").read(); mp = os.path.join(out, "manifest.json"); man = json.load(open(mp))
        man["files"]["model.json"] = {"sha256": hashlib.sha256(b).hexdigest(), "bytes": len(b)}; json.dump(man, open(mp, "w"), indent=1)
        purpose = a.purpose or ({"textedit": "textedit", "matheditor": "matheditor", "animation": "animation"}.get(a.world) or ("diagram" if a.world.startswith("diagram") else a.world))
        language = a.language or ("ro" if a.world.endswith("_ro") else "en+ro" if a.world.endswith("_multi") else "en")
        entry = {"name": a.world, "dir": f"model/{a.world}", "purpose": purpose, "language": language, "bits": a.bits, "status": a.status, "note": a.note,
                 "D": cfg.get("D"), "legend_sha256": cfg.get("legend_sha256"), "star_version": cfg.get("star_version", 1),
                 "training_code_commit": cfg.get("training_code_commit"), "exported": datetime.date.today().isoformat()}
        if entry["star_version"] != 2: print("warning: star_version 1 model: words outside its catalog cannot be read in the browser (app/READER.md)", file=sys.stderr)
        idx["worlds"] = [w for w in idx["worlds"] if w["name"] != a.world] + [entry]
    else: sys.exit(__doc__)
    idx["worlds"].sort(key=lambda w: (w["name"] != "diagram", w["name"]))
    json.dump(idx, open(INDEX, "w"), indent=1); print(f"app/model/index.json: {[(w['name'], w.get('purpose'), w.get('language'), w['status']) for w in idx['worlds']]}; dictionaries {[d['language'] for d in idx.get('dictionaries', [])]}")

if __name__ == "__main__": main()
