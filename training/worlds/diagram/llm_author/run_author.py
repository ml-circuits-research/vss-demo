"""run_author.py: asks large models to write the ten descriptions as scripts for the editor (specification 18.3; protocol in PROTOCOL.md).
An API is called only when its key is set (ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY); a model whose key is missing is skipped
with a message. --dry_run sends nothing: it writes the requests that would be sent (requests.jsonl) and, so that the evaluation path can
be exercised before any key exists, a scripts.jsonl whose texts are the generator's own 1-page scripts under the model name
"dry_run:generator" (never a result: the label says so).
No dependency beyond the standard library.

Run: python3 run_author.py --models anthropic:claude-opus-5-5,anthropic:claude-haiku-5-5 [--variants legend,slow] [--label <name>]
     [--descriptions d01_web_shop,...] [--out_root ../../../data/diagram/llm_author] [--dry_run]
Then: node app/tests/script.mjs --model app/model/diagram --authored <out_root>/<label>/scripts.jsonl"""
import argparse, datetime, hashlib, json, os, sys, time, urllib.request, urllib.error
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.normpath(os.path.join(HERE, "..", "..", "..", ".."))
sys.path.insert(0, HERE)
import legend_prompt

ASK = "Write the script for the editor."
FREE = "Describe this diagram as a numbered list of what it contains and how the parts connect."
TRANSLATE = "Here is a description of a diagram. Translate it into a script for the editor, in the editor's language only.\n\n"


def post(url, headers, body, timeout=300):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"content-type": "application/json", **headers}, method="POST")
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r: return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 529) and attempt < 3: time.sleep(5 * (attempt + 1)); continue
            raise RuntimeError(f"{url}: HTTP {e.code}: {e.read().decode()[:500]}")


def call(provider, model, system, user, max_tokens=8000):
    """one completion; returns (text, raw response)"""
    if provider == "anthropic":
        r = post("https://api.anthropic.com/v1/messages", {"x-api-key": os.environ["ANTHROPIC_API_KEY"], "anthropic-version": "2023-06-01"},
                 {"model": model, "max_tokens": max_tokens, **({"system": system} if system else {}), "messages": [{"role": "user", "content": user}]})
        return "".join(b.get("text", "") for b in r.get("content", []) if b.get("type") == "text"), r
    if provider == "openai":
        msgs = ([{"role": "system", "content": system}] if system else []) + [{"role": "user", "content": user}]
        r = post("https://api.openai.com/v1/chat/completions", {"authorization": f"Bearer {os.environ['OPENAI_API_KEY']}"}, {"model": model, "messages": msgs})
        return r["choices"][0]["message"]["content"], r
    if provider == "google":
        body = {"contents": [{"role": "user", "parts": [{"text": user}]}], **({"systemInstruction": {"parts": [{"text": system}]}} if system else {})}
        r = post(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={os.environ['GEMINI_API_KEY']}", {}, body)
        return "".join(p.get("text", "") for p in r["candidates"][0]["content"]["parts"]), r
    raise ValueError(f"unknown provider {provider!r} (anthropic, openai, google)")


KEYS = {"anthropic": "ANTHROPIC_API_KEY", "openai": "OPENAI_API_KEY", "google": "GEMINI_API_KEY"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", default="anthropic:claude-opus-5-5,anthropic:claude-sonnet-5-5,anthropic:claude-haiku-5-5")
    ap.add_argument("--variants", default="legend"); ap.add_argument("--descriptions", default="")
    ap.add_argument("--label", default=None); ap.add_argument("--out_root", default=os.path.join(ROOT, "training", "data", "diagram", "llm_author"))
    ap.add_argument("--dry_run", action="store_true")
    a = ap.parse_args()
    legend = legend_prompt.build(); sha = "sha256:" + hashlib.sha256(legend.encode()).hexdigest()
    descs = json.load(open(os.path.join(HERE, "descriptions.json")))["descriptions"]
    if a.descriptions: keep = set(a.descriptions.split(",")); descs = [d for d in descs if d["id"] in keep]
    label = a.label or (("dry_run_" if a.dry_run else "") + datetime.date.today().isoformat())
    out = os.path.join(a.out_root, label); os.makedirs(out, exist_ok=True)
    models = [m.split(":", 1) for m in a.models.split(",") if m]
    variants = a.variants.split(",")
    reqs, recs = [], []
    for provider, model in models:
        if not a.dry_run and not os.environ.get(KEYS.get(provider, "")):
            print(f"skipped {provider}:{model}: {KEYS.get(provider, '?')} is not set"); continue
        for d in descs:
            for v in variants:
                if v == "legend": steps = [(legend, d["text"] + "\n\n" + ASK)]
                elif v == "slow": steps = [(None, d["text"] + "\n\n" + FREE), (legend, TRANSLATE + "{free}")]
                else: raise SystemExit(f"unknown variant {v}")
                reqs.append({"model": f"{provider}:{model}", "description_id": d["id"], "variant": v, "prompt_sha256": sha,
                             "steps": [{"system": "legend_prompt.md" if s else None, "user": u} for s, u in steps]})
                if a.dry_run: continue
                free = None; raw = []; texts = []
                for system, user in steps:
                    text, r = call(provider, model, system, user.replace("{free}", free or "")); raw.append(r); texts.append(text); free = text
                recs.append({"model": f"{provider}:{model}", "description_id": d["id"], "variant": v, "prompt_sha256": sha, "text": free,
                             "free_description": texts[0] if v == "slow" else None, "raw": raw, "date": datetime.datetime.now().isoformat(timespec="seconds")})
                print(f"{provider}:{model} {d['id']} {v}: {len((free or '').split())} words")
    with open(os.path.join(out, "requests.jsonl"), "w") as f:
        for r in reqs: f.write(json.dumps(r) + "\n")
    if a.dry_run:                                                   # the evaluation path, exercised with the generator's own scripts
        src = os.path.join(ROOT, "training", "data", "diagram", "eval", "scripts_1p.jsonl")
        if os.path.exists(src):
            docs = [json.loads(l) for l in open(src)][:len(descs)]
            recs = [{"model": "dry_run:generator", "description_id": d["id"], "variant": "legend", "prompt_sha256": sha, "text": doc["text"],
                     "note": "dry run: a generated 1-page script, not a model's output"} for d, doc in zip(descs, docs)]
    with open(os.path.join(out, "scripts.jsonl"), "w") as f:
        for r in recs: f.write(json.dumps(r) + "\n")
    print(f"{out}: {len(reqs)} requests{' (dry run, nothing sent)' if a.dry_run else ''}, {len(recs)} scripts; legend {sha[:19]}...")


if __name__ == "__main__":
    main()
