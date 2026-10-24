// parity.mjs — vss.js against tool/sop/infer.py (VSS Diagram Editor spec 7.1).
// node app/tests/parity.mjs <export dir> <golden.json> [--sentence-candidates]
// Criteria: frames and statuses identical on every sentence; state cosine >= 0.9999; every margin, presence ratio and the residual within
// 1e-4; the SOP text identical (numeric lines may differ in the 3rd decimal only when the two values straddle a rounding boundary: counted
// and printed, never hidden). Also prints the reading time per sentence (median, p95).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "../src/vss.js";

const [dir, goldenPath, ...rest] = process.argv.slice(2);
const sentenceCandidates = rest.includes("--sentence-candidates");
const golden = JSON.parse(readFileSync(goldenPath, "utf8"));
const vss = await load(null, { sentenceCandidates, readFile: async (n) => (n.endsWith(".json") ? readFileSync(join(dir, n), "utf8") : readFileSync(join(dir, n)).buffer.slice(0)) });

const deepEq = (a, b) => {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== typeof b) return false;
  if (Array.isArray(a)) return Array.isArray(b) && a.length === b.length && a.every((x, i) => deepEq(x, b[i]));
  if (typeof a === "object") { const ka = Object.keys(a).sort(), kb = Object.keys(b).sort(); return deepEq(ka, kb) && ka.every((k) => deepEq(a[k], b[k])); }
  return false;
};
const numClose = (x, y, tol) => Math.abs(x - y) <= tol;

let nFrame = 0, nStatus = 0, nSop = 0, nSopRound = 0, worstCos = 1, worstMargin = 0, worstPres = 0, worstRes = 0, keyMismatch = 0; const times = [], fails = [], skipped = [];
for (const g of golden.items) {
  vss.stars.missing.clear(); const r = vss.read(g.text); times.push(r.timings.total_ms);
  if (r.missingStars.length) { skipped.push([g.text, r.missingStars.join(",")]); continue; }
  let ok = true;
  if (!deepEq(r.frame, g.frame)) { ok = false; fails.push(["frame", g.text, JSON.stringify(g.frame), JSON.stringify(r.frame)]); } else nFrame++;
  if (r.status !== g.status) { ok = false; fails.push(["status", g.text, g.status, r.status]); } else nStatus++;
  let dot = 0, n1 = 0, n2 = 0;
  for (let i = 0; i < g.S_re.length; i++) { dot += g.S_re[i] * r.state.re[i] + g.S_im[i] * r.state.im[i]; n1 += g.S_re[i] ** 2 + g.S_im[i] ** 2; n2 += r.state.re[i] ** 2 + r.state.im[i] ** 2; }
  const cos = n1 > 0 && n2 > 0 ? dot / Math.sqrt(n1 * n2) : (n1 === n2 ? 1 : 0); worstCos = Math.min(worstCos, cos);
  const cmp = (A, B, what) => {
    const ka = Object.keys(A).sort(), kb = Object.keys(B).sort(); if (!deepEq(ka, kb)) { keyMismatch++; fails.push([what + " keys", g.text, ka.join(","), kb.join(",")]); }
    let w = 0; for (const k of ka) if (typeof A[k] === "number" && typeof B[k] === "number") w = Math.max(w, Math.abs(A[k] - B[k]));
    return w;
  };
  worstMargin = Math.max(worstMargin, cmp(g.margins, r.margins, "margins")); worstPres = Math.max(worstPres, cmp(g.presence, r.presence, "presence"));
  worstRes = Math.max(worstRes, Math.abs(g.residual - r.residual));
  const sopJs = r.sop.split("\n\n").slice(1).join("\n\n");           // drop the directives block (the golden has none)
  if (sopJs === g.sop) nSop++;
  else {
    const a = g.sop.split("\n"), b = sopJs.split("\n");
    const onlyRounding = a.length === b.length && a.every((l, i) => l === b[i] || (() => { const [ka, va] = l.split("="), [kb, vb] = b[i].split("="); return ka === kb && !isNaN(+va) && !isNaN(+vb) && numClose(+va, +vb, 0.0011); })());
    if (onlyRounding) nSopRound++; else fails.push(["sop", g.text, g.sop, sopJs]);
  }
}
times.sort((a, b) => a - b);
const N = golden.items.length - skipped.length, med = times[Math.floor(N / 2)], p95 = times[Math.min(N - 1, Math.floor(0.95 * N))];
console.log(`parity: ${N} sentences (${dir}; golden ${golden.dequantized_from ? "dequantized from " + golden.dequantized_from : "float64 model"}; sentence candidates ${sentenceCandidates})`);
if (skipped.length) console.log(`  NOT REPRODUCIBLE in the browser (star_version 1: no star for a word outside the exported catalog): ${skipped.length} sentence(s): ` + skipped.map((x) => JSON.stringify(x[0]) + " [" + x[1] + "]").join("; "));
console.log(`  frames identical ${nFrame}/${N}; statuses identical ${nStatus}/${N}; SOP text identical ${nSop}/${N} (+${nSopRound} differing only by 3rd-decimal rounding)`);
console.log(`  worst state cosine ${worstCos.toFixed(6)}; worst |margin diff| ${worstMargin.toExponential(2)}; worst |presence diff| ${worstPres.toExponential(2)}; worst |residual diff| ${worstRes.toExponential(2)}; key-set mismatches ${keyMismatch}`);
console.log(`  reading time per sentence in node: median ${med.toFixed(2)} ms, p95 ${p95.toFixed(2)} ms (D ${vss.model.config.D})`);
for (const f of fails.slice(0, 6)) console.log("  MISMATCH", JSON.stringify(f).slice(0, 600));
const pass = nFrame === N && nStatus === N && worstCos >= 0.9999 && worstMargin <= 1e-4 && worstPres <= 1e-4 && worstRes <= 1e-4 && keyMismatch === 0 && nSop + nSopRound === N;
console.log(pass ? "parity: PASS" : "parity: FAIL"); if (!pass) process.exit(1);
