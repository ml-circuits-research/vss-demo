// scene_fpe.js: the VSS scene pass (spec 17.2 / 17.3, positions as addresses) behind the interface of scene_pass.js: the same input (the
// recogniser's groups, optionally the current scene), the same output shape. It is scenePass with a relation reader: the geometry of
// scene_pass.js (scribbles, clean-up, unknown blobs, ambiguity, the circuit) is unchanged; the two RELATION steps are read from one
// superposition of the sketch instead of measured on boxes and outlines:
//   containment  inside(a, c) for every smaller component a and every candidate container c (a rectangle or rounded rectangle): the four
//                corner sides of c against the decoded centre of a (fpe.js, experiment_fpe.py "inside"). A candidate with at least one
//                component inside is a container; the parent of a component is the smallest container it is inside.
//   connectors   each end (tail, tip) is attached to the non-container component whose decoded centre address is most similar to the
//                decoded end ("nearest"); the margin is best minus second similarity. The tolerance gate (an end near nothing is a
//                question, not a guess) stays the outline distance of rule 3, and an end on a container's outline or beyond the
//                tolerance falls back to the outline rule.
// Capacity (logs/scene_fpe_53ae844): above 16 components at D 1024 (64 at D 4096) the reader DECLINES and the rules read; the result
// says so in `active`. Scribbles (rule 1) are classical and unchanged. The symbol step (recognise.js) is classical and not VSS.
// Nothing is learned; the only parameters are the kernel and its length scale (fpe.js FPE_SETTINGS, chosen on the dev split).
import { scenePass } from "./scene_pass.js";
import { FPE, Algebra, Reader, FPE_SETTINGS, FPE_CAPACITY, W0, H0 } from "./fpe.js";

const CONTAINER_SHAPES = ["rectangle", "rounded_rectangle"];
const area = (b) => Math.max(0, b.w) * Math.max(0, b.h);
const NAME = (D) => `VSS scene reader (FPE, D ${D})`;
export const DECLINED = (n, cap) => `rule-based pass (FPE declined: ${n} elements > ${cap} measured)`;

/** the relation reader of scene_pass.js for one D (1024 or 4096) and seed; keeps the FPE, the algebra and the half-plane templates between calls */
export function createFpeReader({ D = 1024, seed = 0, kernel = null, L = null } = {}) {
  const st = FPE_SETTINGS[D]; if (!st) throw new Error(`no measured setting for D ${D}`);
  const fpe = new FPE(D, seed, L ?? st.L, kernel ?? st.kernel), alg = new Algebra(D, seed), readers = new Map(), cap = FPE_CAPACITY[D];
  const readerFor = (W, H) => { const k = `${W}x${H}`; if (!readers.has(k)) readers.set(k, new Reader(fpe, alg, W, H)); return readers.get(k); };
  return {
    D, seed, capacity: cap, kernel: fpe.kernel, L: fpe.L,
    read({ items, conns }, _options) {
      if (items.length > cap) return { declined: true, why: `${items.length} components > ${cap} measured at D ${D}`, active: DECLINED(items.length, cap) };
      // the canvas: translated so that everything lies in the positive quarter (the encoding is shift-invariant), at least the experiment's 1200 x 800
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      const see = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
      for (const it of items) { see(it.box.x, it.box.y); see(it.box.x + it.box.w, it.box.y + it.box.h); }
      for (const c of conns) { see(c.tail.x, c.tail.y); see(c.tip.x, c.tip.y); }
      if (!isFinite(x0)) return { active: NAME(D), containers: new Set(), members: new Map(), parent: new Map(), contain: new Map(), attach: new Map() };
      const ox = 10 - x0, oy = 10 - y0, W = Math.max(W0, Math.ceil((x1 + ox + 10) / 100) * 100), H = Math.max(H0, Math.ceil((y1 + oy + 10) / 100) * 100);
      const cand = items.filter((it) => (CONTAINER_SHAPES.includes(it.shape) && it.isNew) || it.container);
      const candSet = new Set(cand.map((it) => it.tmp));
      const id = (tmp) => `i:${tmp}`, kid = (c) => `k:${c}`;
      const scene = {
        elements: items.map((it) => ({ id: id(it.tmp), kind: it.shape, box: [it.box.x + ox, it.box.y + oy, it.box.w, it.box.h], container: candSet.has(it.tmp) })),
        connectors: conns.map((c) => ({ id: kid(c.id), tail: [c.tail.x + ox, c.tail.y + oy], tip: [c.tip.x + ox, c.tip.y + oy] })),
      };
      const rd = readerFor(W, H).scene(scene);
      // containment
      const inside = new Map();   // tmp of a -> [{c, margin}]
      const members = new Map();
      for (const c of cand) for (const a of items) {
        if (a === c || !(area(a.box) < 0.8 * area(c.box))) continue;
        const r = rd.inside(id(a.tmp), id(c.tmp));
        if (r.value) { (inside.get(a.tmp) || inside.set(a.tmp, []).get(a.tmp)).push({ c, margin: r.margin }); members.set(c.tmp, (members.get(c.tmp) || 0) + 1); }
      }
      const containers = new Set([...members.keys()]);
      const parent = new Map(), contain = new Map();
      for (const it of items) {
        const best = (inside.get(it.tmp) || []).filter((x) => containers.has(x.c.tmp) && area(it.box) < area(x.c.box)).sort((p, q) => area(p.c.box) - area(q.c.box))[0];
        parent.set(it.tmp, best ? best.c.tmp : null); if (best) contain.set(it.tmp, { margin: best.margin });
      }
      // connector ends: the nearest non-container component by address similarity
      const ids = items.filter((it) => !containers.has(it.tmp) && !it.container).map((it) => id(it.tmp)), attach = new Map();
      if (ids.length) for (const c of conns) for (const end of ["tail", "tip"]) {
        const n = rd.nearest(kid(c.id), ids, end);
        attach.set(`${c.id}:${end}`, { id: n.id.slice(2), margin: n.margin, sim: n.sim });
      }
      return { active: NAME(D), containers, members, parent, contain, attach };
    },
  };
}

/** the VSS scene pass: scenePass with the FPE relation reader (D 1024 by default; declines above its measured capacity) */
export function sceneFpe(rec, { scene = null, options = {}, D = 1024, seed = 0, reader = null } = {}) {
  return scenePass(rec, { scene, options, reader: reader || cachedReader(D, seed) });
}
const cache = new Map();
function cachedReader(D, seed) { const k = `${D}:${seed}`; if (!cache.has(k)) cache.set(k, createFpeReader({ D, seed })); return cache.get(k); }
