// build.mjs: the single-file build of the editor. Output: app/dist/vss-editor.html, one self-contained file (scripts, styles, icon, the
// exported models and the dictionary inlined) that opens from the file system on desktop and phone and works offline; and
// app/precache.json, the file list the service worker caches when app/ is served by a static host.
// Build-time only dependency: esbuild (app/build/package.json, pinned). Run: (cd app/build && npm ci) && node app/build/build.mjs [--no-minify]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const minify = !process.argv.includes("--no-minify");
const rel = (p) => path.relative(APP, p).split(path.sep).join("/");
const walk = (d) => (fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])) : []);
const TEXT = /\.(json|aff|dic|txt|tsv|sop|md|svg)$/;

// 1. the JavaScript: every module reachable from src/main.js, dynamic imports included, as one script
const js = await esbuild.build({ entryPoints: [path.join(APP, "src/main.js")], bundle: true, format: "iife", target: "es2020", minify, write: false, legalComments: "inline", charset: "utf8" });
const bundleJS = js.outputFiles[0].text;

// 2. the assets the editor loads at run time (src/assets.js reads them from globalThis.__VSS_BUNDLE__)
const assetFiles = [...walk(path.join(APP, "model")), path.join(APP, "vendor/typo/en_US/en_US.aff"), path.join(APP, "vendor/typo/en_US/en_US.dic")].filter((f) => !f.endsWith(".md"));
const bundle = { text: {}, b64: {} };
for (const f of assetFiles) { if (TEXT.test(f)) bundle.text[rel(f)] = fs.readFileSync(f, "utf8"); else bundle.b64[rel(f)] = fs.readFileSync(f).toString("base64"); }

// 3. the page
const safe = (s) => s.replace(/<\/(script|style)/gi, "<\\/$1");
let html = fs.readFileSync(path.join(APP, "index.html"), "utf8");
const css = fs.readFileSync(path.join(APP, "app.css"), "utf8");
const icon = "data:image/svg+xml;base64," + fs.readFileSync(path.join(APP, "icons/icon.svg")).toString("base64");
html = html.replace(/<link rel="stylesheet" href="app.css">\n?/, "").replace(/<link rel="manifest"[^>]*>\n?/, "")
  .replace(/<link rel="icon"[^>]*>/, () => `<link rel="icon" href="${icon}" type="image/svg+xml">`)
  .replace(/<script src="vendor\/typo\/typo.js"><\/script>\n?/, "").replace(/<script type="module" src="src\/main.js"><\/script>\n?/, "")
  .replace("<!--VSS:INLINE-CSS-->", () => `<style>\n${safe(css)}\n</style>`)
  .replace("<!--VSS:INLINE-JS-->", () => [
    `<script>${safe(fs.readFileSync(path.join(APP, "vendor/typo/typo.js"), "utf8"))}</script>`,
    `<script>globalThis.__VSS_BUNDLE__ = ${safe(JSON.stringify(bundle))};</script>`,
    `<script>${safe(bundleJS)}</script>`].join("\n"));
fs.mkdirSync(path.join(APP, "dist"), { recursive: true });
const out = path.join(APP, "dist/vss-editor.html"); fs.writeFileSync(out, html);

// 4. the service worker's list for the hosted version
const hosted = ["index.html", "app.css", "manifest.webmanifest", "icons/icon.svg", "vendor/typo/typo.js", ...walk(path.join(APP, "src")).map(rel), ...walk(path.join(APP, "vendor")).map(rel), ...assetFiles.map(rel)]
  .filter((f, i, a) => a.indexOf(f) === i && !f.endsWith(".md") && !f.includes("LICENSE") && !f.endsWith(".txt"));
const id = crypto.createHash("sha256").update(html).digest("hex").slice(0, 12);
fs.writeFileSync(path.join(APP, "precache.json"), JSON.stringify({ id, files: ["./", ...hosted] }, null, 1));
console.log(`build: ${rel(out)} ${(html.length / 1e6).toFixed(2)} MB (scripts ${(bundleJS.length / 1e3).toFixed(0)} kB, ${assetFiles.length} assets), build id ${id}; precache.json ${hosted.length + 1} files`);
