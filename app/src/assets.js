// assets.js: the only place that loads files. Two sources, chosen at start:
//   bundle  the single-file build (app/build/build.mjs) puts every asset into globalThis.__VSS_BUNDLE__ = {text: {path: string},
//           b64: {path: base64}}; works from file:// with no request at all.
//   fetch   app/index.html served by any static host: files are fetched relative to the page (and cached by sw.js for offline use).
// Paths are relative to app/ ("model/diagram/model.json", "vendor/typo/en_US/en_US.dic").

function b64ToBuf(s) {
  if (typeof atob === "function") { const bin = atob(s), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u.buffer; }
  const b = Buffer.from(s, "base64"); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

export function createAssets({ bundle = globalThis.__VSS_BUNDLE__, base = (typeof document !== "undefined" ? document.baseURI : null), readFile = null } = {}) {
  const mode = bundle ? "bundle" : readFile ? "node" : "fetch";
  async function text(path) {
    if (bundle) { if (path in (bundle.text || {})) return bundle.text[path]; if (path in (bundle.b64 || {})) return new TextDecoder().decode(b64ToBuf(bundle.b64[path])); throw new Error(`asset not in the bundle: ${path}`); }
    if (readFile) return String(await readFile(path, "text"));
    const r = await fetch(new URL(path, base)); if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`); return r.text();
  }
  async function bytes(path) {
    if (bundle) { if (path in (bundle.b64 || {})) return b64ToBuf(bundle.b64[path]); if (path in (bundle.text || {})) return new TextEncoder().encode(bundle.text[path]).buffer; throw new Error(`asset not in the bundle: ${path}`); }
    if (readFile) { const b = await readFile(path, "bytes"); return b.buffer ? b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) : b; }
    const r = await fetch(new URL(path, base)); if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`); return r.arrayBuffer();
  }
  async function has(path) {
    if (bundle) return path in (bundle.text || {}) || path in (bundle.b64 || {});
    try { await (readFile ? readFile(path, "bytes") : fetch(new URL(path, base), { method: "HEAD" }).then((r) => { if (!r.ok) throw 0; })); return true; } catch { return false; }
  }
  async function json(path) { return JSON.parse(await text(path)); }
  /** the readFile function vss.js's loader expects for one model folder */
  function modelReader(dir) { return async (name) => (name.endsWith(".json") ? text(`${dir}/${name}`) : bytes(`${dir}/${name}`)); }
  return { mode, text, bytes, json, has, modelReader };
}
