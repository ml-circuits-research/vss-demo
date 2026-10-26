// fpe_parity.mjs: the JS scene readout (src/sketch/fpe.js) against the Python reference (training/worlds/scene/fpe.py + experiment_fpe.py)
// on the golden file written by training/parity/make_fpe_golden.py. Needs the golden file as its argument (so run_all.sh skips it; it is
// called from training/parity/run_all.sh).
// Criteria: every relation decision identical (left_of, above, inside, nearest); margins within 1e-4; state cosine >= 0.9999;
// decoded positions within 1e-3 px (reported).
// Usage: node app/tests/fpe_parity.mjs training/parity/out/golden-fpe.json
import { readFileSync } from "node:fs";
import { FPE, Algebra, Reader } from "../src/sketch/fpe.js";

const path = process.argv[2];
if (!path) { console.log("fpe_parity: usage: node app/tests/fpe_parity.mjs <golden-fpe.json>"); process.exit(2); }
const golden = JSON.parse(readFileSync(path));
const byMode = {}; let nDec = 0, bad = 0, worstMargin = 0, worstCos = 1, worstPos = 0, nPos = 0; const fails = [];
for (const c of golden.cases) {
  const fpe = new FPE(c.D, c.seed, c.L, c.kernel), alg = new Algebra(c.D, c.seed), rd = new Reader(fpe, alg, c.W, c.H, { nearest: c.nearest || "centre" });
  for (const g of c.scenes) {
    rd.scene(g.scene);
    // state cosine: Re<a, b> / (|a| |b|)
    let ab = 0, aa = 0, bb = 0;
    for (let i = 0; i < c.D; i++) { ab += rd.S.re[i] * g.state_re[i] + rd.S.im[i] * g.state_im[i]; aa += rd.S.re[i] ** 2 + rd.S.im[i] ** 2; bb += g.state_re[i] ** 2 + g.state_im[i] ** 2; }
    const cos = ab / Math.sqrt(aa * bb); worstCos = Math.min(worstCos, cos);
    if (cos < 0.9999) fails.push(`${c.name} ${g.scene.id}: state cosine ${cos}`);
    for (const r of g.results) {
      const a = rd.answer(r.q); nDec++; const bm = (byMode[c.nearest || "centre"] ??= { n: 0, bad: 0, nn: 0, nnBad: 0 }); bm.n++; if (r.q.rel === "nearest") bm.nn++;
      const same = a.pred === r.pred; const dm = Math.abs(a.margin - r.margin); worstMargin = Math.max(worstMargin, dm);
      if (!same) { bad++; bm.bad++; if (r.q.rel === "nearest") bm.nnBad++; fails.push(`${c.name} ${g.scene.id} ${JSON.stringify(r.q)}: js ${a.pred} (${a.margin.toFixed(5)}) py ${r.pred} (${r.margin.toFixed(5)})`); }
      else if (dm > 1e-4) fails.push(`${c.name} ${g.scene.id} ${JSON.stringify(r.q)}: margin js ${a.margin} py ${r.margin}`);
    }
    for (const [k, v] of Object.entries(g.pos)) { const [id, role] = k.split("|"); const p = rd.pos(id, role || null); nPos++; worstPos = Math.max(worstPos, Math.hypot(p[0] - v[0], p[1] - v[1])); }
  }
}
if (worstPos > 1e-3) fails.push(`decoded positions differ by up to ${worstPos} px`);
console.log(`fpe_parity: ${golden.cases.length} cases, ${nDec} relation decisions (${bad} differ), max margin diff ${worstMargin.toExponential(2)}, min state cosine ${worstCos.toFixed(8)}, ${nPos} decoded positions max diff ${worstPos.toExponential(2)} px`);
for (const [m, b] of Object.entries(byMode)) console.log(`  readout nearest=${m}: ${b.n} decisions (${b.bad} differ), of which ${b.nn} nearest-endpoint decisions (${b.nnBad} differ)`);
for (const f of fails.slice(0, 20)) console.log(`  FAIL ${f}`);
if (fails.length) { console.log("fpe_parity: FAIL"); process.exit(1); }
console.log("fpe_parity: PASS");
