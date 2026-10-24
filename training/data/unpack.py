"""unpack.py: a frozen dataset of training/data/ -> a world folder that `sop train` reads, with every file checked against MANIFEST.json.
Usage: python3 training/data/unpack.py diagram/n50000 <out dir>     (writes <out dir>/diagram/...; the folder name is the world name)
       python3 training/data/unpack.py --write-manifest              (after regenerating: records the sha256 of every uncompressed file)"""
import gzip, hashlib, json, os, shutil, sys
HERE = os.path.dirname(os.path.abspath(__file__)); MAN = os.path.join(HERE, "MANIFEST.json")

def files_of(root):
    for dp, _, fs in os.walk(root):
        for f in sorted(fs):
            p = os.path.join(dp, f)
            if f.endswith((".md",)) and dp == root: continue
            yield p

def content(p): return gzip.open(p).read() if p.endswith(".gz") else open(p, "rb").read()

def write_manifest():
    man = {}
    for ds in sorted(d for w in os.listdir(HERE) if os.path.isdir(os.path.join(HERE, w)) for d in [f"{w}/{x}" for x in sorted(os.listdir(os.path.join(HERE, w))) if os.path.isdir(os.path.join(HERE, w, x))]):
        root = os.path.join(HERE, ds)
        man[ds] = {os.path.relpath(p, root).removesuffix(".gz"): hashlib.sha256(content(p)).hexdigest() for p in files_of(root) if not p.endswith("COVERAGE.md")}
    json.dump(man, open(MAN, "w"), indent=1, sort_keys=True); print(f"wrote {MAN}: {len(man)} datasets")

def unpack(ds, out):
    man = json.load(open(MAN))[ds]; root = os.path.join(HERE, ds); bad = 0
    for p in files_of(root):
        if p.endswith("COVERAGE.md"): continue
        rel = os.path.relpath(p, root).removesuffix(".gz"); data = content(p)
        if hashlib.sha256(data).hexdigest() != man.get(rel): print(f"sha256 mismatch: {rel}"); bad += 1; continue
        dst = os.path.join(out, rel); os.makedirs(os.path.dirname(dst), exist_ok=True); open(dst, "wb").write(data)
    missing = set(man) - {os.path.relpath(p, root).removesuffix(".gz") for p in files_of(root)}
    for m in sorted(missing): print(f"missing: {m}"); bad += 1
    if bad: sys.exit(f"{bad} file(s) failed the manifest check; nothing should be trained on {out}")
    print(f"unpacked {ds} -> {out}: {len(man)} files, sha256 verified")

if __name__ == "__main__":
    if sys.argv[1:] == ["--write-manifest"]: write_manifest()
    elif len(sys.argv) == 3: unpack(sys.argv[1], sys.argv[2])
    else: sys.exit(__doc__)
