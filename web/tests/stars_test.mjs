// stars_test.mjs — the portable stars of vss.js reproduce tool/sop/world.py star_v2 exactly (|diff| < 1e-6 on the phases, wrapped)
import { readFileSync } from "node:fs";
import { starV2Phases } from "../vss/stars.js";
const golden = JSON.parse(readFileSync(new URL("./golden_stars.json", import.meta.url)));
let worst = 0;
for (const g of golden) {
  const ph = starV2Phases(g.seed, g.name, g.phases.length);
  for (let i = 0; i < ph.length; i++) { let d = Math.abs(ph[i] - g.phases[i]); d = Math.min(d, 2 * Math.PI - d); worst = Math.max(worst, d); }
}
console.log(`stars_test: ${golden.length} stars at D ${golden[0].phases.length}, max |phase diff| ${worst.toExponential(2)}`);
if (worst >= 1e-6) { console.log("stars_test: FAIL"); process.exit(1); }
console.log("stars_test: PASS");
