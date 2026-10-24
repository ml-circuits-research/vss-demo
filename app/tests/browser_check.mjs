// browser_check.mjs: the application in a real browser (Chromium through Playwright), on desktop (1366 x 860) and phone (390 x 844) sizes,
// from the single-file build (file://) and from the hosted folder (a small static server started here). It exercises every feature
// wired in src/main.js: a diagram command, a paragraph (segmenter and circuit), a text widget with dictation, a formula with two
// readings, the sketch pad, the example film (timeline strip, play, scrub, animated SVG export), a script in the document view, Settings
// and About; and it fails on any console error. Not part of run_all.sh (it needs a browser); it SKIPS with a message when Playwright is
// not installed.
//   node app/tests/browser_check.mjs [--shots <dir>] [--only file|hosted] [--no-build]
// The diagram model installed in app/model is a development model: wrong readings are expected; this checks the wiring, not accuracy.
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d = null) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const SHOTS = arg("--shots"); const ONLY = arg("--only");
let chromium;
try { chromium = createRequire(import.meta.url)("playwright").chromium; } catch {
  try { chromium = (await import("playwright")).chromium; } catch { console.log("browser_check: SKIP (Playwright is not installed: npm i playwright && npx playwright install chromium)"); process.exit(0); }
}
if (!process.argv.includes("--no-build")) execFileSync(process.execPath, [path.join(APP, "build/build.mjs")], { stdio: "ignore" });
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

// a static server for the hosted version (no dependency)
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json", ".bin": "application/octet-stream", ".aff": "text/plain", ".dic": "text/plain", ".png": "image/png" };
function serve() {
  return new Promise((ok) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname); if (p.endsWith("/")) p += "index.html";
      const f = path.join(APP, path.normalize(p)); if (!f.startsWith(APP) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
    });
    srv.listen(0, "127.0.0.1", () => ok(srv));
  });
}

let pass = 0, fail = 0; const fails = [];
const check = (name, ok, detail = "") => { if (ok) pass++; else { fail++; fails.push(`${name}${detail ? `: ${detail}` : ""}`); } };

async function session(browser, url, label, size) {
  const vp = size === "phone" ? { width: 390, height: 844 } : { width: 1366, height: 860 };
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: size === "phone" ? 2 : 1, hasTouch: size === "phone", acceptDownloads: true, serviceWorkers: "block" });
  const page = await ctx.newPage(); const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); }); page.on("pageerror", (e) => errors.push(e.message));
  const tag = `${label}-${size}`; const shot = async (name) => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `integ-${name}-${tag}.png`) }); };
  const answer = () => page.textContent("#answer");
  const run = async (t) => { await page.fill("#input", t); await page.press("#input", "Enter"); await page.waitForTimeout(250); return answer(); };
  const comps = () => page.evaluate(() => document.querySelectorAll("#canvas .vss-layer-components > g, #canvas .vss-layer-containers > g").length);
  const panel = async (tab) => { if (size === "phone") { const open = await page.evaluate(() => document.getElementById("app").classList.contains("panel-open")); if (!open) await page.click("#btn-panel"); } await page.click(`.tabs [data-tab="${tab}"]`); await page.waitForTimeout(250); };
  const closePanel = async () => { if (size === "phone" && await page.evaluate(() => document.getElementById("app").classList.contains("panel-open"))) { await page.click("#btn-panel"); await page.waitForTimeout(250); } };

  await page.goto(url); await page.waitForFunction(() => !document.getElementById("model-badge").hidden, null, { timeout: 15000 });
  check(`${tag} start`, (await page.textContent("#model-badge")).length > 0);
  await shot("start");

  // 1. a diagram command, then a paragraph of two commands (segmenter -> circuit)
  await run("add a database called orders in the top left");
  check(`${tag} diagram command`, (await comps()) >= 1, await answer());
  const a2 = await run("Add a database called orders in the top left. Then add a cache called sessions to the right of it.");
  check(`${tag} paragraph: several units`, /Read \d+ units/.test(a2), a2);
  check(`${tag} paragraph: reading strip shows units`, (await page.locator(".reading-unit").count()) >= 2);
  await panel("circuit"); check(`${tag} circuit view`, (await page.locator("#tab-circuit svg").count()) >= 1);
  await shot("circuit"); await closePanel();

  // 2. a text widget and dictation (no textedit model: content only, and the editor says so)
  await page.click("#btn-add-text"); await page.waitForTimeout(200);
  check(`${tag} dictation mode chip`, /writing in/.test(await page.textContent("#mode-chip")) && !(await page.isHidden("#mode-chip")));
  check(`${tag} dictation says content only`, /content only|written as text/.test(await answer()), await answer());
  await page.click('#answer button:has-text("rename")'); await page.fill(".vss-label-editor", "Summary"); await page.press(".vss-label-editor", "Enter"); await page.waitForTimeout(150);
  await run("the revenue grew in the third quarter full stop");
  await run("new paragraph we should make the first line bold comma literally comma");
  const slotText = await page.evaluate(() => [...document.querySelectorAll("foreignObject.vss-slot .vss-text")].map((e) => e.textContent).join(" | "));
  check(`${tag} dictated text in the widget`, /The revenue grew in the third quarter\./.test(slotText) && /We should make the first line bold, comma/.test(slotText), slotText);
  await shot("dictation");
  await run("stop writing"); check(`${tag} stop writing`, await page.isHidden("#mode-chip"));
  await run("start writing in summary"); check(`${tag} start writing in a widget by name`, /writing in Summary/i.test(await page.textContent("#mode-chip")), await answer());
  await page.keyboard.press("Escape"); await page.waitForTimeout(150); check(`${tag} Escape leaves dictation`, await page.isHidden("#mode-chip"));

  // 3. a formula with two readings (reference parser, labelled)
  await page.click("#btn-add-formula"); await page.waitForTimeout(200);
  check(`${tag} formula mode`, /formula/.test(await page.textContent("#mode-chip")));
  const fa = await run("x plus one over two");
  check(`${tag} formula: two readings`, (await page.locator("#answer .math-choice").count()) === 2 && /reference parser/.test(fa), fa);
  await shot("formula-choice");
  await page.click("#answer .math-choice >> nth=1"); await page.waitForTimeout(200);
  check(`${tag} formula: the chosen reading in the widget`, (await page.locator('foreignObject.vss-slot[data-slot="formula"] mfrac').count()) >= 1);
  await run("end formula"); check(`${tag} end formula`, await page.isHidden("#mode-chip"));
  await shot("widgets");

  // 4. sketch: a rectangle, an ellipse and an arrow between them, then Done (one undo entry)
  const before = await comps();
  await page.click("#btn-sketch"); await page.waitForTimeout(200);
  const box = await page.locator("#sketch-host canvas").boundingBox();
  const W = box.width, H = box.height; const ox = box.x, oy = box.y;
  const stroke = async (pts) => { await page.mouse.move(ox + pts[0][0], oy + pts[0][1]); await page.mouse.down(); for (const [x, y] of pts.slice(1)) await page.mouse.move(ox + x, oy + y, { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(60); };
  const s = Math.min(W, 700) / 700; const X = (v) => 40 + v * s, Y = (v) => H * 0.45 + v * s;
  await stroke([[X(0), Y(0)], [X(160), Y(0)], [X(160), Y(90)], [X(0), Y(90)], [X(0), Y(2)]]);
  const ell = []; for (let k = 0; k <= 36; k++) { const a = (k / 36) * 2 * Math.PI; ell.push([X(420 + 80 * Math.cos(a)), Y(45 + 45 * Math.sin(a))]); } await stroke(ell);
  await stroke([[X(175), Y(45)], [X(330), Y(45)]]); await stroke([[X(312), Y(32)], [X(332), Y(45)], [X(312), Y(58)]]);
  await shot("sketch");
  await page.click("#btn-sketch-done"); await page.waitForTimeout(400);
  const sa = await answer();
  check(`${tag} sketch recognised`, /Recognised/.test(sa) && (await comps()) > before, `${sa}; ${before} -> ${await comps()}`);
  await panel("plan"); check(`${tag} sketch candidates listed`, (await page.locator("#tab-plan .rec-list li").count()) >= 2);
  await shot("sketch-result"); await closePanel();

  // 5. the example film: timeline strip, play, scrub, Timeline tab, animated SVG export
  await page.click("#btn-export"); await page.click("#x-example"); await page.waitForTimeout(600);
  check(`${tag} timeline strip`, !(await page.isHidden("#timeline-strip")) && !(await page.isHidden("#film")));
  check(`${tag} film frame drawn`, (await page.locator("#film svg").count()) === 1);
  await page.waitForTimeout(900); await shot("film-play");
  await page.click("#tl-play"); await page.locator("#tl-scrub").fill("5000"); await page.waitForTimeout(200);
  check(`${tag} scrub`, /5\.00 s/.test(await page.textContent("#tl-time")), await page.textContent("#tl-time"));
  await panel("timeline"); check(`${tag} timeline bars`, (await page.locator("#tab-timeline .vss-anim .bar").count()) >= 3);
  await shot("timeline"); await closePanel();
  await page.click("#btn-export");
  check(`${tag} film export enabled`, !(await page.isDisabled("#x-asvg")));
  const [dl] = await Promise.all([page.waitForEvent("download", { timeout: 10000 }), page.click("#x-asvg")]);
  check(`${tag} animated SVG download`, /\.svg$/.test(dl.suggestedFilename()));
  await page.click("#tl-close"); await page.waitForTimeout(150); check(`${tag} back to the diagram`, await page.isHidden("#film"));

  // 6. a script in the document view
  await page.click("#btn-script"); await page.click("#script-example"); await page.click("#script-run"); await page.waitForTimeout(600);
  check(`${tag} script document view`, (await page.locator("#script-doc .doc-view").count()) === 1, await page.textContent("#script-doc"));
  await shot("script"); await page.click('#dlg-script button[value="close"]');

  // 7. Settings (speech language, thresholds) and About (worlds and modules)
  await page.click("#btn-settings"); await page.waitForTimeout(150);
  check(`${tag} settings: language`, (await page.locator("#set-lang option").count()) >= 4);
  check(`${tag} settings: thresholds`, /Dictation/.test(await page.textContent("#threshold-info")));
  await shot("settings"); await page.click('#dlg-settings button[value="close"]');
  await page.click("#btn-about"); await page.waitForTimeout(150);
  const about = await page.textContent("#dlg-about");
  check(`${tag} about: worlds and modules`, /textedit/.test(about) && /not installed/.test(about) && /Formula widgets/.test(about) && /development model/.test(about));
  await shot("about"); await page.click('#dlg-about button[value="close"]');

  check(`${tag} no console errors`, errors.length === 0, errors.slice(0, 3).join(" / "));
  await ctx.close();
}

const browser = await chromium.launch();
try {
  if (ONLY !== "hosted") for (const size of ["desktop", "phone"]) await session(browser, "file://" + path.join(APP, "dist/vss-editor.html"), "file", size);
  if (ONLY !== "file") { const srv = await serve(); const url = `http://127.0.0.1:${srv.address().port}/index.html`; for (const size of ["desktop", "phone"]) await session(browser, url, "hosted", size); srv.close(); }
} catch (e) { fail++; fails.push(`exception: ${e.message.split("\n").slice(0, 4).join(" / ")}`); }
await browser.close();
for (const f of fails) console.log("FAIL", f);
console.log(`browser_check: ${fail ? "FAIL" : "PASS"} ${pass}/${pass + fail} checks (file:// build and hosted, desktop and phone)`);
process.exit(fail ? 1 : 0);
