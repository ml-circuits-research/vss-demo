// gaps.mjs: the local journal of readings (app/src/gaps.js): masking of labels, recording, the reformulation rule, marking, summary,
// export format, send with and without consent (a fake fetch). Writes a synthetic journal for training/gaps/aggregate.py.
// Usage: node app/tests/gaps.mjs
import fs from "node:fs";
import { createGaps, entryFromReading, maskLabels } from "../src/gaps.js";
let pass = 0, fail = 0; const bad = []; const check = (n, c, d = "") => { if (c) pass++; else { fail++; bad.push(`${n}: ${d}`); } };
check("labels masked", maskLabels(["add", "a", "box", "called", "payroll"], { payroll: "Payroll" }).join(" ") === "add a box called <label>", "");
const mem = new Map(); const storage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
let t = 0; const g = createGaps({ storage, tau: 0.05, now: () => t });
const R = (status, roles, margins, unplaced = []) => ({ status, frame: { event: "create", roles }, margins, residual: 0.4, unplaced });
const e1 = entryFromReading({ result: R("abstain", { object: ["entity", "box", null, "a"] }, { object: 0.3, color: 0.01 }, ["frobnicate"]), route: { id: "diagram" }, tokens: ["frobnicate", "a", "box", "called", "payroll"], info: { labels: { payroll: "Payroll" } }, decision: { action: "ask" } });
check("entry: masked input, low roles, unplaced", e1.input === "frobnicate a box called <label>" && e1.lowRoles.join() === "color" && e1.unplaced.join() === "frobnicate" && e1.outcome === "pending", JSON.stringify(e1));
const id1 = g.record(e1); t += 5000;
const id2 = g.record(entryFromReading({ result: R("ok", { object: ["entity", "box", null, "a"] }, { object: 0.3 }), route: { id: "diagram" }, tokens: ["add", "a", "box"], info: {}, decision: { action: "execute" } }));
check("a pending reading followed within a minute is reformulated", g.entries[0].outcome === "reformulated" && g.entries[1].outcome === "accepted", JSON.stringify(g.entries.map((e) => e.outcome)));
t += 120000; const id3 = g.record(entryFromReading({ result: R("no-sense", {}, {}, ["rotate", "clockwise"]), route: { id: "diagram" }, tokens: ["rotate", "it", "clockwise"], info: {}, decision: { action: "refuse" } }));
check("mark with a note", g.mark(id3, "turn the box by 90 degrees") && g.entries[2].outcome === "marked" && g.entries[2].note.startsWith("turn"), "");
const s = g.summary();
check("summary", s.entries === 3 && s.flagged === 2 && s.byStatus["no-sense"] === 1 && s.topUnplaced[0].w === "frobnicate", JSON.stringify(s));
const persisted = createGaps({ storage, tau: 0.05 }); check("persisted in storage", persisted.size === 3, String(persisted.size));
const exp = JSON.parse(g.export()); check("export format", exp.format === "vss-gaps-1" && exp.entries.length === 3 && exp.summary.flagged === 2, "");
const calls = []; const fakeFetch = async (url, opts) => { calls.push({ url, n: JSON.parse(opts.body).entries.length }); return { ok: true, status: 200 }; };
const noConsent = await g.send("https://example.invalid/gaps", { consent: false, fetchFn: fakeFetch });
check("no consent: nothing sent", noConsent.ok === false && calls.length === 0, JSON.stringify(noConsent));
const sent = await g.send("https://example.invalid/gaps", { consent: true, fetchFn: fakeFetch });
check("consent: sent once with every entry", sent.ok && sent.sent === 3 && calls.length === 1 && calls[0].n === 3 && g.entries.every((e) => e.sentAt), JSON.stringify(sent));
fs.mkdirSync(new URL("./out/", import.meta.url), { recursive: true }); fs.writeFileSync(new URL("./out/gaps_synthetic.json", import.meta.url), g.export());
console.log(`gaps: ${pass} checks passed, ${fail} failed`); if (fail) { console.log(bad.join("\n")); process.exit(1); }
