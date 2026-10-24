// engine_check.mjs: the engine in a real browser (Chromium through Playwright, a development tool, not shipped). Serves app/ on a
// local port with node's http module, opens app/dev/engine.html at desktop and at phone size (390x844, touch), drives the interaction
// (select, drag, connect from a port, resize, delete, undo, label edit, pinch zoom, PNG export) and checks the scene after each step;
// saves screenshots. Usage: node app/dev/engine_check.mjs [output directory]   (exit 0 on pass)
import http from "node:http"; import fs from "node:fs"; import path from "node:path"; import os from "node:os"; import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url); const { chromium } = require("playwright");
const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."); const OUT = path.resolve(process.argv[2] || path.join(os.tmpdir(), "vss-engine-shots"));
fs.mkdirSync(OUT, { recursive: true });
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const p = path.join(APP, decodeURIComponent(new URL(req.url, "http://x").pathname)); if (!p.startsWith(APP) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" }); fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r)); const URL0 = `http://127.0.0.1:${server.address().port}/dev/engine.html`;
let pass = 0, fail = 0; const failures = [];
const check = (name, cond, detail = "") => { if (cond) pass++; else { fail++; failures.push(`${name}: ${detail}`); } };
const browser = await chromium.launch();
try {
  // ---------------------------------------------------------------- desktop
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }); const errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(URL0); await page.waitForFunction(() => window.__engine); await page.waitForTimeout(300);
  const info = () => page.evaluate(() => { const s = window.__engine.view.scene; return { n: s.components.size, k: s.connectors.size, undo: s.undo.length, sel: s.selection.slice(), cross: window.__engine.routeCrossings(s).length, zoom: s.view.zoom }; });
  const center = (id) => page.evaluate((id) => { const r = document.querySelector(`.vss-layer-components [data-id="${id}"], .vss-layer-containers [data-id="${id}"]`).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, id);
  const idOf = (label) => page.evaluate((l) => [...window.__engine.view.scene.components.values()].find((c) => c.label === l).id, label);
  await page.screenshot({ path: path.join(OUT, "engine-desktop.png") });
  let I = await info(); check("sample renders", I.n === 11 && I.k === 10 && I.cross === 0, JSON.stringify(I));
  check("one DOM group per component", await page.evaluate(() => document.querySelectorAll(".vss-comp").length) === I.n, "");
  // click selects; drag moves (one undo entry, routes still clear)
  const pay = await idOf("Take payment"); const c0 = await center(pay);
  await page.mouse.click(c0.x, c0.y); I = await info(); check("click selects", I.sel.length === 1 && I.sel[0] === pay, JSON.stringify(I.sel));
  const box0 = await page.evaluate((id) => ({ ...window.__engine.view.scene.components.get(id).box }), pay);
  await page.mouse.move(c0.x, c0.y); await page.mouse.down(); for (let i = 1; i <= 8; i++) await page.mouse.move(c0.x + i * 5, c0.y + i * 12); await page.mouse.up(); await page.waitForTimeout(100);
  const box1 = await page.evaluate((id) => ({ ...window.__engine.view.scene.components.get(id).box }), pay); I = await info();
  check("drag moves", box1.y > box0.y + 40, JSON.stringify({ box0, box1 })); check("drag is one undo entry", I.undo === 1, I.undo); check("routes clear after drag", I.cross === 0, I.cross);
  // locked note does not move
  const note = await idOf("Ships within two working days"); const cn = await center(note); const nb0 = await page.evaluate((id) => ({ ...window.__engine.view.scene.components.get(id).box }), note);
  await page.mouse.move(cn.x, cn.y); await page.mouse.down(); await page.mouse.move(cn.x + 60, cn.y + 30, { steps: 5 }); await page.mouse.up();
  const nb1 = await page.evaluate((id) => ({ ...window.__engine.view.scene.components.get(id).box }), note);
  check("lock blocks a drag", nb0.x === nb1.x && nb0.y === nb1.y && (await page.textContent("#log")).includes("blocked"), await page.textContent("#log"));
  // connect from a port to another component
  const db = await idOf("Orders"); await page.mouse.click((await center(db)).x, (await center(db)).y);
  const port = await page.evaluate(() => { const r = document.querySelector('.vss-port[data-port="s"]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  const mail = await idOf("Mail service"); const cm = await center(mail); const k0 = (await info()).k;
  await page.mouse.move(port.x, port.y); await page.mouse.down(); await page.mouse.move(cm.x, cm.y, { steps: 10 }); await page.mouse.up(); await page.waitForTimeout(50);
  I = await info(); check("connect from a port", I.k === k0 + 1 && I.cross === 0, JSON.stringify(I));
  // resize with a handle
  await page.mouse.click(cm.x, cm.y); const hd = await page.evaluate(() => { const r = document.querySelector('.vss-handle[data-handle="se"]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  const mb0 = await page.evaluate((id) => ({ ...window.__engine.view.scene.components.get(id).box }), mail);
  await page.mouse.move(hd.x, hd.y); await page.mouse.down(); await page.mouse.move(hd.x + 50, hd.y + 30, { steps: 5 }); await page.mouse.up();
  const mb1 = await page.evaluate((id) => ({ ...window.__engine.view.scene.components.get(id).box }), mail); check("resize with a handle", mb1.w > mb0.w + 20 && mb1.h > mb0.h + 10, JSON.stringify({ mb0, mb1 }));
  // label edit by double click
  await page.mouse.dblclick(cm.x, cm.y); await page.waitForSelector(".vss-label-editor"); await page.keyboard.press("Control+A"); await page.keyboard.type("Mailer"); await page.keyboard.press("Enter");
  check("double click edits the label", await page.evaluate((id) => window.__engine.view.scene.components.get(id).label, mail) === "Mailer", "");
  // delete key, then undo
  const n0 = (await info()).n; await page.mouse.click((await center(mail)).x, (await center(mail)).y); await page.keyboard.press("Delete");
  I = await info(); check("Delete removes the selection", I.n === n0 - 1, JSON.stringify(I));
  await page.keyboard.press("Control+z"); I = await info(); check("ctrl+Z restores it", I.n === n0, JSON.stringify(I));
  await page.keyboard.press("Control+Shift+z"); I = await info(); check("ctrl+shift+Z redoes", I.n === n0 - 1, JSON.stringify(I)); await page.keyboard.press("Control+z");
  // arrows move by 10
  await page.mouse.click((await center(db)).x, (await center(db)).y); const d0 = await page.evaluate((id) => window.__engine.view.scene.components.get(id).box.x, db);
  await page.keyboard.press("ArrowRight"); check("arrow key moves 10 px", await page.evaluate((id) => window.__engine.view.scene.components.get(id).box.x, db) === d0 + 10, "");
  // marquee selection
  await page.mouse.move(5, 5); await page.mouse.click(1270, 790); await page.mouse.move(20, 70); await page.mouse.down(); await page.mouse.move(1260, 780, { steps: 6 }); await page.mouse.up();
  I = await info(); check("rubber band selects several", I.sel.length >= 5, JSON.stringify(I.sel));
  // wheel zoom with ctrl
  const z0 = (await info()).zoom; await page.mouse.move(640, 400); await page.keyboard.down("Control"); await page.mouse.wheel(0, -300); await page.keyboard.up("Control"); await page.waitForTimeout(80);
  check("ctrl + wheel zooms", (await info()).zoom > z0, "");
  // question highlight and arrange through the toolbar
  await page.click("#fit"); await page.click("#ask"); await page.waitForTimeout(150);
  check("candidates highlighted with numbers", await page.evaluate(() => document.querySelectorAll(".vss-cand").length) === 3 && await page.evaluate(() => document.querySelectorAll(".vss-badge").length) === 3, "");
  await page.screenshot({ path: path.join(OUT, "engine-desktop-question.png") });
  await page.selectOption("#layout", "flow_td"); await page.click("#arrange"); await page.waitForTimeout(700); I = await info(); check("arrange flow_td keeps routes clear", I.cross === 0, I.cross);
  await page.screenshot({ path: path.join(OUT, "engine-desktop-flow-td.png") });
  // PNG export works in the browser
  const png = await page.evaluate(async () => { const b = await window.__engine.exportPNG(window.__engine.view.scene, 1); return { size: b.size, type: b.type }; });
  check("PNG export", png.type === "image/png" && png.size > 2000, JSON.stringify(png));
  // dark theme
  await page.click("#theme"); await page.waitForTimeout(100); await page.screenshot({ path: path.join(OUT, "engine-desktop-dark.png") });
  check("no page errors (desktop)", errors.length === 0, errors.join(" | "));

  // ---------------------------------------------------------------- phone
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const ph = await ctx.newPage(); const perr = []; ph.on("pageerror", (e) => perr.push(e.message));
  await ph.goto(URL0); await ph.waitForFunction(() => window.__engine); await ph.waitForTimeout(300);
  await ph.screenshot({ path: path.join(OUT, "engine-phone.png") });
  const pinfo = () => ph.evaluate(() => { const s = window.__engine.view.scene; return { sel: s.selection.slice(), zoom: s.view.zoom, x: s.view.x, undo: s.undo.length }; });
  const pc = await ph.evaluate(() => { const s = window.__engine.view.scene; const c = [...s.components.values()].find((k) => k.label === "In stock?"); const r = document.querySelector(`.vss-layer-components [data-id="${c.id}"]`).getBoundingClientRect(); return { id: c.id, x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await ph.touchscreen.tap(pc.x, pc.y); await ph.waitForTimeout(80); let P = await pinfo(); check("tap selects on a phone", P.sel[0] === pc.id, JSON.stringify(P));
  await ph.screenshot({ path: path.join(OUT, "engine-phone-selected.png") });
  // pinch zoom with two touch pointers (synthetic pointer events, as a phone browser sends them)
  const z1 = P.zoom;
  await ph.evaluate(() => {
    const svg = document.querySelector("svg.vss"); const r = svg.getBoundingClientRect(); const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
    const ev = (type, id, x, y) => svg.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: "touch", clientX: x, clientY: y, bubbles: true, isPrimary: id === 11, button: 0, buttons: type === "pointerup" ? 0 : 1 }));
    ev("pointerdown", 11, cx - 30, cy); ev("pointerdown", 12, cx + 30, cy);
    for (let i = 1; i <= 10; i++) { ev("pointermove", 11, cx - 30 - i * 8, cy); ev("pointermove", 12, cx + 30 + i * 8, cy); }
    ev("pointerup", 11, cx - 110, cy); ev("pointerup", 12, cx + 110, cy);
  });
  await ph.waitForTimeout(80); P = await pinfo(); check("pinch zooms in", P.zoom > z1 * 1.8, `${z1} -> ${P.zoom}`); check("pinch makes no undo entry", P.undo === 0, P.undo);
  // one-finger drag on the canvas pans
  await ph.evaluate(() => {
    const svg = document.querySelector("svg.vss"); const r = svg.getBoundingClientRect(); const x = r.x + 8, y = r.y + r.height - 8;
    const ev = (type, dx) => svg.dispatchEvent(new PointerEvent(type, { pointerId: 21, pointerType: "touch", clientX: x + dx, clientY: y, bubbles: true, isPrimary: true, buttons: 1 }));
    ev("pointerdown", 0); for (let i = 1; i <= 6; i++) ev("pointermove", i * 10); ev("pointerup", 60);
  });
  const P2 = await pinfo(); check("one finger pans", Math.abs(P2.x - P.x - 60) < 1, `${P.x} -> ${P2.x}`);
  await ph.evaluate(() => window.__engine.view.fit()); await ph.waitForTimeout(50);
  // double tap edits the label
  const pc2 = await ph.evaluate((id) => { const r = document.querySelector(`.vss-layer-components [data-id="${id}"]`).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, pc.id);
  await ph.touchscreen.tap(pc2.x, pc2.y); await ph.waitForTimeout(60); await ph.touchscreen.tap(pc2.x, pc2.y); await ph.waitForTimeout(80);
  check("double tap opens the label editor", await ph.evaluate(() => !!document.querySelector(".vss-label-editor")), "");
  await ph.screenshot({ path: path.join(OUT, "engine-phone-edit.png") });
  check("no page errors (phone)", perr.length === 0, perr.join(" | "));
  const overflow = await ph.evaluate(() => document.documentElement.scrollWidth > innerWidth); check("no horizontal page scroll on a phone", !overflow, "");
} finally { await browser.close(); server.close(); }
console.log(`engine_check: ${pass} checks passed, ${fail} failed; screenshots in ${OUT}`);
if (fail) { console.log(failures.join("\n")); process.exit(1); }
