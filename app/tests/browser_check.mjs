// browser_check.mjs: a SMOKE test of the application in a real browser (Chromium through Playwright), on desktop (1366 x 860) and phone
// (390 x 844) sizes, from the single-file build (file://) and from the hosted folder (a small static server started here).
// It checks only that the page is alive and wired: it loads and shows the model badge; there is no console error and no page error during
// the whole session; every main tab button exists and opens a non-empty panel; one typed command gives a History entry and an answer; the
// examples paperclip opens its sheet and filling an example puts text in the input without running it; the export sheet opens; and the
// build banner is present in a preview build.
// Why only a smoke test: the owner decided (owner, 2026-10-26) that click / coordinate browser checks are not worth maintaining. The logic
// is tested in node (app/tests/*.mjs, run by run_all.sh) and the owner reports UI problems by hand. So there are no clicks at computed
// coordinates, no drags, and nothing that depends on what a particular model reads.
// Not part of run_all.sh (it needs a browser); it SKIPS with a message when Playwright is not installed.
//   node app/tests/browser_check.mjs [--shots <dir>] [--only file|hosted] [--no-build]
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
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: size === "phone" ? 2 : 1, hasTouch: size === "phone", serviceWorkers: "block" });
  const page = await ctx.newPage(); const errors = [];
  // the English diagram route, so the typed command does not depend on the automatic choice
  await page.addInitScript(() => { try { if (!sessionStorage.getItem("vss-check")) { localStorage.setItem("vss-settings", JSON.stringify({ route_diagram: "diagram" })); sessionStorage.setItem("vss-check", "1"); } } catch {} });
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); }); page.on("pageerror", (e) => errors.push(e.message));
  const tag = `${label}-${size}`; const shot = async (name) => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `smoke-${name}-${tag}.png`) }); };

  await page.goto(url); await page.waitForFunction(() => !document.getElementById("model-badge").hidden, null, { timeout: 15000 });
  check(`${tag} loads, model badge shown`, (await page.textContent("#model-badge")).length > 0);
  check(`${tag} build banner present (preview build)`, await page.isVisible("#build-banner"));
  await shot("start");

  // one typed command first (some panels, e.g. SOP and Log, fill from it): a reading line and an answer
  await page.fill("#input", "add a database called orders in the top left ."); await page.press("#input", "Enter"); await page.waitForTimeout(300);
  check(`${tag} command: no reading strip above the input`, (await page.locator("#reading").count()) === 0);
  check(`${tag} command: History has the entry (text, status, behaviour)`, await page.evaluate(() => { const r = document.querySelector("#tab-history .hist-row"); return !!r && /database/.test(r.textContent) && !!r.querySelector(".chip"); }));
  check(`${tag} command: an answer`, (await page.textContent("#answer")).trim().length > 0);
  await shot("command");

  // every main tab button that is shown (the phone-only ones only on a phone) opens a non-empty panel
  const tabs = await page.locator("#main-tabs [data-tab]:visible").evaluateAll((bs) => bs.map((b) => b.dataset.tab));
  check(`${tag} main tabs: the diagram and History (and on a phone Plan, Geometry); the detail tabs are gone`, ["diagram", "history"].every((t) => tabs.includes(t)) && !["actions", "assistant", "requests", "sketchread", "circuit", "sop", "log", "frame"].some((t) => tabs.includes(t)) && (size === "phone" ? tabs.includes("plan") && tabs.includes("geometry") : !tabs.includes("plan")), tabs.join());
  for (const t of tabs.filter((t) => t !== "diagram")) {
    await page.click(`#main-tabs [data-tab="${t}"]`); await page.waitForTimeout(150);
    check(`${tag} tab ${t}: panel not empty`, await page.evaluate((t) => { const e = document.getElementById("tab-" + t); return !!e && !e.hidden && e.textContent.trim().length > 0; }, t));
  }
  // History: the details of an entry open as popups (full width, X closes); Requests opens from the History header
  await page.click('#main-tabs [data-tab="history"]'); await page.waitForTimeout(150);
  for (const k of ["reading", "call", "plan", "sop", "log"]) {
    const btn = page.locator(`#tab-history .hist-row [data-detail="${k}"]`).first();
    check(`${tag} History entry has the detail button ${k}`, (await btn.count()) === 1);
    await btn.click(); await page.waitForTimeout(150);
    const w = await page.evaluate(() => { const d = document.querySelector("dialog.popup[open]"); return d ? d.getBoundingClientRect().width : -1; });
    check(`${tag} detail ${k}: a popup uses the width`, w >= page.viewportSize().width * 0.9, String(w));
    await page.click("dialog.popup[open] .sheet-x"); await page.waitForTimeout(100);
    check(`${tag} detail ${k}: the X closes it`, (await page.locator("dialog.popup").count()) === 0);
  }
  await page.click("#btn-requests"); await page.waitForTimeout(150);
  check(`${tag} Requests popup opens from History`, await page.evaluate(() => document.getElementById("dlg-requests").open));
  await page.fill("#req-input", "add a database called orders"); await page.click("#req-run"); await page.waitForTimeout(200);
  check(`${tag} Requests: a request is read by the worlds`, (await page.textContent("#req-out")).trim().length > 10);
  await page.click("#dlg-requests .sheet-x"); await page.waitForTimeout(100);
  await page.click('#main-tabs [data-tab="diagram"]'); await page.waitForTimeout(150);

  // the examples paperclip: the sheet opens, a click fills the input and does not run it
  await page.fill("#input", ""); const nHist = await page.locator("#tab-history .hist-row").count();
  await page.click("#btn-examples"); await page.waitForTimeout(150);
  check(`${tag} examples sheet opens`, await page.evaluate(() => document.getElementById("dlg-examples").open));
  const ex = await page.textContent("#dlg-examples button.ex >> nth=0"); await page.click("#dlg-examples button.ex >> nth=0"); await page.waitForTimeout(150);
  check(`${tag} an example fills the input, does not run it`, (await page.inputValue("#input")) === ex && ex.length > 0 && (await page.locator("#tab-history .hist-row").count()) === nHist, ex);
  await page.fill("#input", "");

  // the sketch element: it opens over the canvas (no tab); Done with nothing drawn opens no preview (the preview itself is checked by hand: it needs strokes)
  await page.click("#btn-sketch"); await page.waitForTimeout(150);
  check(`${tag} sketch strip opens (not a tab)`, await page.isVisible("#sketch-strip") && (await page.locator('#main-tabs [data-tab="sketch"]').count()) === 0);
  await page.click("#btn-sketch-done"); await page.waitForTimeout(150);
  check(`${tag} Done with nothing drawn: no preview, said so`, (await page.locator("dialog.sk-preview").count()) === 0 && /Nothing was drawn/.test(await page.textContent("#answer")));

  // the export sheet opens
  await page.click("#btn-export"); await page.waitForTimeout(150);
  check(`${tag} export sheet opens`, await page.evaluate(() => document.getElementById("dlg-export").open));
  await shot("export"); await page.keyboard.press("Escape");

  // every popup (D21 item 1, D22): opens, uses the width of the window (desktop) or of the phone, has an X that closes it
  const vw = page.viewportSize().width;
  for (const [btn, dlg] of [["#btn-about", "dlg-about"], ["#btn-settings", "dlg-settings"], ["#btn-export", "dlg-export"], ["#btn-script", "dlg-script"], ["#build-banner-more", "dlg-build"], ["#btn-examples", "dlg-examples"]]) {
    await page.click(btn); await page.waitForTimeout(150);
    const w = await page.evaluate((d) => { const e = document.getElementById(d); return e.open ? e.getBoundingClientRect().width : -1; }, dlg);
    check(`${tag} popup ${dlg}: opens, uses the width (${Math.round(w)} of ${vw})`, w >= vw * 0.9, String(w));
    check(`${tag} popup ${dlg}: has an X in a header`, await page.isVisible(`#${dlg} .sheet-head .sheet-x`));
    await page.click(`#${dlg} .sheet-x`); await page.waitForTimeout(100);
    check(`${tag} popup ${dlg}: the X closes it`, await page.evaluate((d) => !document.getElementById(d).open, dlg));
  }

  check(`${tag} no console error, no page error`, errors.length === 0, errors.slice(0, 3).join(" / "));
  await ctx.close();
}

const browser = await chromium.launch();
try {
  if (ONLY !== "hosted") for (const size of ["desktop", "phone"]) await session(browser, "file://" + path.join(APP, "dist/vss-editor.html"), "file", size);
  if (ONLY !== "file") { const srv = await serve(); const url = `http://127.0.0.1:${srv.address().port}/index.html`; for (const size of ["desktop", "phone"]) await session(browser, url, "hosted", size); srv.close(); }
} catch (e) { fail++; fails.push(`exception: ${e.message.split("\n").slice(0, 12).join(" / ")}`); }
await browser.close();
for (const f of fails) console.log("FAIL", f);
console.log(`browser_check: ${fail ? "FAIL" : "PASS"} ${pass}/${pass + fail} checks (smoke; file:// build and hosted, desktop and phone)`);
process.exit(fail ? 1 : 0);
