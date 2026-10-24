// layout.js: the editor's layouts (spec 8.3). Row, column, grid and circle are short deterministic functions; tree is a tidy tree over a
// spanning forest of the connectors; flow_lr and flow_td are a layered (Sugiyama) layout written for the editor: cycle removal by a
// depth-first search, layering by longest path, dummy nodes on long edges, crossing reduction by barycentre sweeps with a transpose
// step, and coordinates by isotonic regression towards the neighbours' centres (straight edges, order kept, gaps kept). Containers are
// laid out with their members (a compound node of the size of its laid-out members) and fitted to them. Pure: no DOM.
//
// layoutNodes(kind, nodes, edges, opts) -> Map id -> {x, y}     nodes [{id, w, h}] in a stable order, edges [{source, target}]
// arrange(scene, ids, kind, opts) -> {notes, moved}             applies a layout to a set of components of the scene
// align(scene, ids, {axis, direction}), distribute(scene, ids, {axis, gap}), fitContainer(scene, id, {exact})

export const PAD = { l: 20, r: 20, t: 36, b: 20 };       // container padding; the top holds the title
export const LAYOUTS = ["row", "column", "grid", "tree", "circle", "flow_lr", "flow_td"];
const GAP = 40;          // between neighbours
const LAYER_GAP = 70;    // between layers of a flow (room for the routes)

// ------------------------------------------------------------------ simple layouts
function row(nodes, g) { const H = Math.max(...nodes.map((n) => n.h)); let x = 0; const out = new Map(); for (const n of nodes) { out.set(n.id, { x, y: (H - n.h) / 2 }); x += n.w + g; } return out; }
function column(nodes, g) { const W = Math.max(...nodes.map((n) => n.w)); let y = 0; const out = new Map(); for (const n of nodes) { out.set(n.id, { x: (W - n.w) / 2, y }); y += n.h + g; } return out; }
function grid(nodes, g, cols) {
  const n = cols || Math.ceil(Math.sqrt(nodes.length)); const W = Math.max(...nodes.map((q) => q.w)), H = Math.max(...nodes.map((q) => q.h)); const out = new Map();
  nodes.forEach((q, i) => out.set(q.id, { x: (i % n) * (W + g) + (W - q.w) / 2, y: Math.floor(i / n) * (H + g) + (H - q.h) / 2 }));
  return out;
}
function circle(nodes, g) {
  const n = nodes.length; const out = new Map(); if (n === 1) { out.set(nodes[0].id, { x: 0, y: 0 }); return out; }
  const D = Math.max(...nodes.map((q) => Math.hypot(q.w, q.h))); const R = Math.max(80, (D + g) / (2 * Math.sin(Math.PI / n)));
  nodes.forEach((q, i) => { const t = -Math.PI / 2 + (2 * Math.PI * i) / n; out.set(q.id, { x: R * Math.cos(t) - q.w / 2, y: R * Math.sin(t) - q.h / 2 }); });
  return out;
}

// ------------------------------------------------------------------ tree: tidy layout of a spanning forest, top down
function tree(nodes, edges, g) {
  const idx = new Map(nodes.map((n, i) => [n.id, i])); const kids = nodes.map(() => []); const parent = nodes.map(() => -1);
  const out = nodes.map(() => []); for (const e of edges) if (idx.has(e.source) && idx.has(e.target) && e.source !== e.target) out[idx.get(e.source)].push(idx.get(e.target));
  const indeg = nodes.map(() => 0); for (const l of out) for (const t of l) indeg[t]++;
  const roots = []; const seen = new Uint8Array(nodes.length);
  const bfs = (r) => { const q = [r]; seen[r] = 1; while (q.length) { const u = q.shift(); for (const v of out[u]) if (!seen[v]) { seen[v] = 1; parent[v] = u; kids[u].push(v); q.push(v); } } };
  nodes.forEach((n, i) => { if (!indeg[i] && !seen[i]) { roots.push(i); bfs(i); } });
  nodes.forEach((n, i) => { if (!seen[i]) { roots.push(i); bfs(i); } });                // cycles with no source: first unseen node
  const depth = nodes.map(() => 0); const setDepth = (u, d) => { depth[u] = d; for (const v of kids[u]) setDepth(v, d + 1); }; roots.forEach((r) => setDepth(r, 0));
  const levH = []; nodes.forEach((n, i) => { levH[depth[i]] = Math.max(levH[depth[i]] || 0, n.h); });
  const levY = []; let y = 0; for (let d = 0; d < levH.length; d++) { levY[d] = y; y += levH[d] + LAYER_GAP; }
  const width = nodes.map(() => 0);
  const measure = (u) => { let s = 0; kids[u].forEach((v, k) => { measure(v); s += width[v] + (k ? g : 0); }); width[u] = Math.max(nodes[u].w, s); };
  const pos = new Map();
  const place = (u, left) => {
    const n = nodes[u]; let s = 0; kids[u].forEach((v, k) => { s += width[v] + (k ? g : 0); });
    let x = left + (width[u] - s) / 2; const cs = [];
    for (const v of kids[u]) { place(v, x); cs.push(pos.get(nodes[v].id).x + nodes[v].w / 2); x += width[v] + g; }
    const cx = cs.length ? (cs[0] + cs[cs.length - 1]) / 2 : left + width[u] / 2;
    pos.set(n.id, { x: cx - n.w / 2, y: levY[depth[u]] + (levH[depth[u]] - n.h) / 2 });
  };
  let left = 0; for (const r of roots) { measure(r); place(r, left); left += width[r] + g * 1.5; }
  return pos;
}

// ------------------------------------------------------------------ layered (Sugiyama)
function crossingsBetween(upper, lower, adjDown) {
  const pos = new Map(lower.map((v, i) => [v, i])); const es = [];
  upper.forEach((u, i) => { for (const v of adjDown.get(u) || []) if (pos.has(v)) es.push([i, pos.get(v)]); });
  let c = 0; for (let a = 0; a < es.length; a++) for (let b = a + 1; b < es.length; b++) if ((es[a][0] - es[b][0]) * (es[a][1] - es[b][1]) < 0) c++;
  return c;
}
// pool adjacent violators: minimise sum (x_i - d_i)^2 with x_{i+1} - x_i >= sep_i
function isotonic(d, sep) {
  const n = d.length; const off = [0]; for (let i = 1; i < n; i++) off[i] = off[i - 1] + sep[i - 1];
  const blocks = [];
  for (let i = 0; i < n; i++) {
    blocks.push({ sum: d[i] - off[i], cnt: 1, start: i });
    while (blocks.length > 1) { const b = blocks[blocks.length - 1], a = blocks[blocks.length - 2]; if (a.sum / a.cnt <= b.sum / b.cnt) break; a.sum += b.sum; a.cnt += b.cnt; blocks.pop(); }
  }
  const x = new Array(n); for (const b of blocks) for (let k = 0; k < b.cnt; k++) x[b.start + k] = b.sum / b.cnt + off[b.start + k];
  return x;
}

export function layered(nodes, edges, { direction = "td", gap = GAP, layerGap = LAYER_GAP } = {}) {
  const ids = nodes.map((n) => n.id); const index = new Map(ids.map((id, i) => [id, i])); const size = new Map(nodes.map((n) => [n.id, n]));
  const E = []; const seenE = new Set();
  for (const e of edges) { if (!index.has(e.source) || !index.has(e.target) || e.source === e.target) continue; const k = `${e.source}>${e.target}`; if (seenE.has(k)) continue; seenE.add(k); E.push([e.source, e.target]); }
  // 1. cycle removal: depth-first search in node order, edges to a node on the stack are reversed
  const outs = new Map(ids.map((id) => [id, []])); for (const [a, b] of E) outs.get(a).push(b);
  const state = new Map(); const rev = new Set();
  const dfs = (u) => { state.set(u, 1); for (const v of outs.get(u)) { if (state.get(v) === 1) rev.add(`${u}>${v}`); else if (!state.get(v)) dfs(v); } state.set(u, 2); };
  const indeg0 = new Map(ids.map((id) => [id, 0])); for (const [, b] of E) indeg0.set(b, indeg0.get(b) + 1);
  for (const id of ids) if (!state.get(id) && !indeg0.get(id)) dfs(id);
  for (const id of ids) if (!state.get(id)) dfs(id);
  const D = E.map(([a, b]) => (rev.has(`${a}>${b}`) ? [b, a] : [a, b]));
  // 2. layering: longest path, then sources pulled down next to their first successor
  const preds = new Map(ids.map((id) => [id, []])), succs = new Map(ids.map((id) => [id, []]));
  for (const [a, b] of D) { succs.get(a).push(b); preds.get(b).push(a); }
  const layer = new Map(); const visit = (v) => { if (layer.has(v)) return layer.get(v); layer.set(v, 0); let l = 0; for (const p of preds.get(v)) l = Math.max(l, visit(p) + 1); layer.set(v, l); return l; };
  ids.forEach(visit);
  for (const v of ids) if (!preds.get(v).length && succs.get(v).length) layer.set(v, Math.min(...succs.get(v).map((s) => layer.get(s))) - 1);
  // 3. dummy nodes on edges spanning several layers
  const L = Math.max(0, ...layer.values()) + 1; const layers = Array.from({ length: L }, () => []);
  const adjDown = new Map(), adjUp = new Map(); const add = (m, a, b) => { if (!m.has(a)) m.set(a, []); m.get(a).push(b); };
  const dummy = new Set(); let dn = 0;
  for (const id of ids) layers[layer.get(id)].push(id);
  for (const [a, b] of D) {
    let prev = a;
    for (let l = layer.get(a) + 1; l < layer.get(b); l++) { const d = `\u0000d${dn++}`; dummy.add(d); layer.set(d, l); layers[l].push(d); add(adjDown, prev, d); add(adjUp, d, prev); prev = d; }
    add(adjDown, prev, b); add(adjUp, b, prev);
  }
  // 4. crossing reduction: initial order by a breadth-first walk, barycentre sweeps, transpose; keep the best
  const pos = new Map(); layers.forEach((ly) => ly.forEach((v, i) => pos.set(v, i)));
  for (let l = 1; l < L; l++) { const bc = (v) => { const ps = adjUp.get(v) || []; return ps.length ? ps.reduce((s, p) => s + pos.get(p), 0) / ps.length : pos.get(v); }; layers[l] = layers[l].map((v, i) => [v, bc(v), i]).sort((p, q) => p[1] - q[1] || p[2] - q[2]).map((p) => p[0]); layers[l].forEach((v, i) => pos.set(v, i)); }
  const total = () => { let c = 0; for (let l = 0; l + 1 < L; l++) c += crossingsBetween(layers[l], layers[l + 1], adjDown); return c; };
  let best = layers.map((ly) => ly.slice()), bestC = total();
  for (let it = 0; it < 24 && bestC > 0; it++) {
    const down = it % 2 === 0;
    const order = down ? [...Array(L).keys()].slice(1) : [...Array(L).keys()].reverse().slice(1);
    for (const l of order) {
      const nb = down ? adjUp : adjDown;
      const bc = (v) => { const ps = nb.get(v) || []; return ps.length ? ps.reduce((s, p) => s + pos.get(p), 0) / ps.length : pos.get(v); };
      layers[l] = layers[l].map((v, i) => [v, bc(v), i]).sort((p, q) => p[1] - q[1] || p[2] - q[2]).map((p) => p[0]);
      layers[l].forEach((v, i) => pos.set(v, i));
    }
    // transpose: swap neighbours while it lowers the crossings with both adjacent layers
    let improved = true, guard = 0;
    while (improved && guard++ < 8) {
      improved = false;
      for (let l = 0; l < L; l++) for (let i = 0; i + 1 < layers[l].length; i++) {
        const local = () => (l > 0 ? crossingsBetween(layers[l - 1], layers[l], adjDown) : 0) + (l + 1 < L ? crossingsBetween(layers[l], layers[l + 1], adjDown) : 0);
        const c0 = local(); const ly = layers[l]; [ly[i], ly[i + 1]] = [ly[i + 1], ly[i]];
        if (local() < c0) { improved = true; pos.set(ly[i], i); pos.set(ly[i + 1], i + 1); } else [ly[i], ly[i + 1]] = [ly[i + 1], ly[i]];
      }
    }
    const c = total(); if (c < bestC) { bestC = c; best = layers.map((ly) => ly.slice()); }
  }
  for (let l = 0; l < L; l++) { layers[l] = best[l]; layers[l].forEach((v, i) => pos.set(v, i)); }
  // 5. coordinates: along the layer by isotonic regression towards the neighbours' centres; across by layer bands
  const td = direction === "td"; const along = (v) => (dummy.has(v) ? 12 : td ? size.get(v).w : size.get(v).h);
  const across = (v) => (dummy.has(v) ? 0 : td ? size.get(v).h : size.get(v).w);
  const c = new Map();
  for (const ly of layers) { let x = 0; for (const v of ly) { c.set(v, x + along(v) / 2); x += along(v) + gap; } }
  const sepOf = (ly) => ly.slice(0, -1).map((v, i) => (along(v) + along(ly[i + 1])) / 2 + (dummy.has(v) && dummy.has(ly[i + 1]) ? gap / 2 : gap));
  for (let it = 0; it < 12; it++) {
    const down = it % 2 === 0; const seq = down ? [...Array(L).keys()] : [...Array(L).keys()].reverse();
    for (const l of seq) {
      const ly = layers[l]; if (!ly.length) continue; const nb = down ? adjUp : adjDown;
      const d = ly.map((v) => { const ps = (nb.get(v) || []).concat(it > 3 ? ((down ? adjDown : adjUp).get(v) || []) : []); return ps.length ? ps.reduce((s, p) => s + c.get(p), 0) / ps.length : c.get(v); });
      const x = isotonic(d, sepOf(ly)); ly.forEach((v, i) => c.set(v, x[i]));
    }
  }
  // last sweep: a node with one parent lines up under it when its layer leaves room (straight chains, centred decisions)
  for (let l = 1; l < L; l++) {
    const ly = layers[l]; if (!ly.length) continue;
    const d = ly.map((v) => { const ps = adjUp.get(v) || []; return ps.length === 1 && (adjDown.get(ps[0]) || []).length === 1 ? c.get(ps[0]) : c.get(v); });
    const x = isotonic(d, sepOf(ly)); ly.forEach((v, i) => c.set(v, x[i]));
  }
  const minC = Math.min(...[...c.entries()].map(([v, x]) => x - along(v) / 2));
  const band = layers.map((ly) => Math.max(0, ...ly.map(across))); const bandStart = []; let acc = 0; for (let l = 0; l < L; l++) { bandStart[l] = acc; acc += band[l] + layerGap; }
  const out = new Map();
  for (const id of ids) {
    const n = size.get(id); const l = layer.get(id); const a = c.get(id) - minC - along(id) / 2; const b = bandStart[l] + (band[l] - across(id)) / 2;
    out.set(id, td ? { x: a, y: b } : { x: b, y: a });
  }
  out.crossings = bestC; out.reversed = [...rev];
  return out;
}

export function layoutNodes(kind, nodes, edges = [], opts = {}) {
  if (!nodes.length) return new Map(); const g = opts.gap ?? GAP;
  let pos;
  if (kind === "row") pos = row(nodes, g);
  else if (kind === "column") pos = column(nodes, g);
  else if (kind === "grid") pos = grid(nodes, g, opts.cols);
  else if (kind === "circle") pos = circle(nodes, g);
  else if (kind === "tree") pos = tree(nodes, edges, g);
  else if (kind === "flow_td" || kind === "flow") pos = layered(nodes, edges, { direction: "td", gap: g });
  else pos = layered(nodes, edges, { direction: "lr", gap: g });                  // flow_lr and anything unknown
  const mx = Math.min(...[...pos.values()].map((p) => p.x)), my = Math.min(...[...pos.values()].map((p) => p.y));
  const out = new Map(); for (const [id, p] of pos) out.set(id, { x: Math.round(p.x - mx), y: Math.round(p.y - my) });
  if (pos.crossings != null) out.crossings = pos.crossings;
  return out;
}

// ------------------------------------------------------------------ scene helpers
const kidsOf = (scene, id) => [...scene.components.values()].filter((c) => c.parent === id).sort((a, b) => a.order - b.order);
export function moveTree(scene, id, x, y) {
  const c = scene.components.get(id); const dx = x - c.box.x, dy = y - c.box.y; if (!dx && !dy) return;
  const walk = (cid) => { const k = scene.components.get(cid); k.box = { ...k.box, x: k.box.x + dx, y: k.box.y + dy }; for (const ch of kidsOf(scene, cid)) walk(ch.id); };
  walk(id);
}
// fit a container to its members: exact (after a layout or a group) or grow only (after a member moved)
export function fitContainer(scene, id, { exact = true } = {}) {
  const c = scene.components.get(id); if (!c) return; const ks = kidsOf(scene, id); if (!ks.length) return;
  const x1 = Math.min(...ks.map((k) => k.box.x)) - PAD.l, y1 = Math.min(...ks.map((k) => k.box.y)) - PAD.t;
  const x2 = Math.max(...ks.map((k) => k.box.x + k.box.w)) + PAD.r, y2 = Math.max(...ks.map((k) => k.box.y + k.box.h)) + PAD.b;
  if (exact) c.box = { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  else { const nx = Math.min(c.box.x, x1), ny = Math.min(c.box.y, y1); c.box = { x: nx, y: ny, w: Math.max(c.box.x + c.box.w, x2) - nx, h: Math.max(c.box.y + c.box.h, y2) - ny }; }
}
export function fitAncestors(scene, id, opts) { let p = scene.components.get(id)?.parent; let guard = 0; while (p && guard++ < 64) { fitContainer(scene, p, opts); p = scene.components.get(p)?.parent; } }
const overlap = (a, b, g = 0) => a.x < b.x + b.w + g && b.x < a.x + a.w + g && a.y < b.y + b.h + g && b.y < a.y + a.h + g;
function bbox(boxes) { const x = Math.min(...boxes.map((b) => b.x)), y = Math.min(...boxes.map((b) => b.y)); return { x, y, w: Math.max(...boxes.map((b) => b.x + b.w)) - x, h: Math.max(...boxes.map((b) => b.y + b.h)) - y }; }

// arrange a set of components (containers come with their members) with one of the layouts
export function arrange(scene, ids, kind = "row", opts = {}) {
  const notes = []; const inSet = new Set();
  const addDeep = (id) => { if (inSet.has(id) || !scene.components.has(id)) return; inSet.add(id); for (const k of kidsOf(scene, id)) addDeep(k.id); };
  ids.forEach(addDeep);
  // units: members of the set whose parent is outside the set
  const units = [...inSet].map((id) => scene.components.get(id)).filter((c) => !c.parent || !inSet.has(c.parent)).sort((a, b) => a.order - b.order);
  if (!units.length) return { notes, moved: [] };
  const topOf = (id, level) => { let c = scene.components.get(id); while (c && !level.has(c.id)) c = c.parent ? scene.components.get(c.parent) : null; return c ? c.id : null; };
  const edgesAt = (level) => {
    const out = [];
    for (const e of [...scene.connectors.values()].sort((a, b) => (a.id < b.id ? -1 : 1))) { if (!inSet.has(e.source) || !inSet.has(e.target)) continue; const a = topOf(e.source, level), b = topOf(e.target, level); if (a && b && a !== b) out.push({ source: a, target: b }); }
    return out;
  };
  const solve = (list) => {                                       // -> {pos, sizes, inner}
    const sizes = new Map(), inner = new Map();
    for (const c of list) {
      const ks = kidsOf(scene, c.id);
      if (c.kind === "container" && ks.length) { const r = solve(ks); inner.set(c.id, r); sizes.set(c.id, { w: r.w + PAD.l + PAD.r, h: r.h + PAD.t + PAD.b }); }
      else sizes.set(c.id, { w: c.box.w, h: c.box.h });
    }
    const level = new Set(list.map((c) => c.id));
    const pos = layoutNodes(kind, list.map((c) => ({ id: c.id, ...sizes.get(c.id) })), edgesAt(level), opts);
    const w = Math.max(...list.map((c) => pos.get(c.id).x + sizes.get(c.id).w)), h = Math.max(...list.map((c) => pos.get(c.id).y + sizes.get(c.id).h));
    return { pos, sizes, inner, list, w, h };
  };
  const res = solve(units);
  // origin: the canvas margin when the whole scene (or a whole container) is arranged, else where the set was
  const parents = new Set(units.map((c) => c.parent || null)); const parent = parents.size === 1 ? [...parents][0] : null;
  const siblings = [...scene.components.values()].filter((c) => (c.parent || null) === parent);
  const whole = siblings.every((c) => inSet.has(c.id));
  let ox, oy;
  if (whole && parent) { const P = scene.components.get(parent).box; ox = P.x + PAD.l; oy = P.y + PAD.t; }
  else if (whole) { ox = opts.x0 ?? 60; oy = opts.y0 ?? 60; }
  else { const b = bbox(units.map((c) => c.box)); ox = Math.max(20, b.x); oy = Math.max(20, b.y); }
  if (kind === "circle" && whole && !parent && !opts.x0) { ox = Math.max(20, Math.round(scene.width / 2 - res.w / 2)); oy = Math.max(20, Math.round(scene.height / 2 - res.h / 2)); }
  // components outside the set (and not holding it) must not be covered: move the block below them
  const holders = new Set(); for (const u of units) { let p = u.parent; while (p) { holders.add(p); p = scene.components.get(p)?.parent; } }
  const outsiders = [...scene.components.values()].filter((c) => !inSet.has(c.id) && !holders.has(c.id));
  const block = () => ({ x: ox, y: oy, w: res.w, h: res.h });
  for (let k = 0; k < outsiders.length + 1; k++) {
    const hit = outsiders.filter((c) => overlap(block(), c.box, 10)); if (!hit.length) break;
    oy = Math.max(...hit.map((c) => c.box.y + c.box.h)) + GAP;
    if (k === 0) notes.push("the arranged components were placed below the others to avoid an overlap");
  }
  const apply = (r, x0, y0) => {
    for (const c of r.list) {
      const p = r.pos.get(c.id); const x = Math.round(x0 + p.x), y = Math.round(y0 + p.y);
      if (r.inner.has(c.id)) { const s = r.sizes.get(c.id); c.box = { x, y, w: s.w, h: s.h }; apply(r.inner.get(c.id), x + PAD.l, y + PAD.t); }
      else moveTree(scene, c.id, x, y);
    }
  };
  apply(res, ox, oy);
  for (const u of units) fitAncestors(scene, u.id, { exact: false });
  growCanvas(scene);
  if (res.pos.crossings) notes.push(`${res.pos.crossings} connector crossing(s) left by the layered layout`);
  return { notes, moved: [...inSet] };
}
export function growCanvas(scene) {
  const cs = [...scene.components.values()]; if (!cs.length) return;
  scene.width = Math.max(scene.width, Math.max(...cs.map((c) => c.box.x + c.box.w)) + 60);
  scene.height = Math.max(scene.height, Math.max(...cs.map((c) => c.box.y + c.box.h)) + 60);
}

// align and distribute (the planner's former layoutSimple, kept exactly; containers move with their members)
export function align(scene, ids, { axis, direction } = {}) {
  const cs = ids.map((i) => scene.components.get(i)).filter((c) => c && c.kind !== "container").sort((a, b) => a.order - b.order); if (!cs.length) return;
  const to = (c, x, y) => moveTree(scene, c.id, Math.round(x), Math.round(y));
  if (axis === "horizontally") { const y = cs[0].box.y + cs[0].box.h / 2; cs.forEach((c) => to(c, c.box.x, y - c.box.h / 2)); }
  else if (axis === "vertically") { const x = cs[0].box.x + cs[0].box.w / 2; cs.forEach((c) => to(c, x - c.box.w / 2, c.box.y)); }
  else if (direction === "left") { const x = Math.min(...cs.map((c) => c.box.x)); cs.forEach((c) => to(c, x, c.box.y)); }
  else if (direction === "right") { const x = Math.max(...cs.map((c) => c.box.x + c.box.w)); cs.forEach((c) => to(c, x - c.box.w, c.box.y)); }
  else if (direction === "up") { const y = Math.min(...cs.map((c) => c.box.y)); cs.forEach((c) => to(c, c.box.x, y)); }
  else if (direction === "down") { const y = Math.max(...cs.map((c) => c.box.y + c.box.h)); cs.forEach((c) => to(c, c.box.x, y - c.box.h)); }
  cs.forEach((c) => fitAncestors(scene, c.id, { exact: false }));
}
export function distribute(scene, ids, { axis, gap = null } = {}) {
  const cs = ids.map((i) => scene.components.get(i)).filter((c) => c && c.kind !== "container"); if (!cs.length) return;
  const vertical = axis === "vertically"; const key = vertical ? "y" : "x", len = vertical ? "h" : "w";
  cs.sort((a, b) => a.box[key] - b.box[key] || a.order - b.order); let pos = cs[0].box[key];
  const to = (c, v) => { const v2 = Math.round(v); moveTree(scene, c.id, vertical ? c.box.x : v2, vertical ? v2 : c.box.y); };
  if (gap == null && cs.length > 2) { const span = cs[cs.length - 1].box[key] + cs[cs.length - 1].box[len] - pos; const tot = cs.reduce((m, c) => m + c.box[len], 0); const eg = (span - tot) / (cs.length - 1); cs.forEach((c) => { to(c, pos); pos += c.box[len] + eg; }); }
  else { const g = gap ?? 30; cs.forEach((c) => { to(c, pos); pos += c.box[len] + g; }); }
  cs.forEach((c) => fitAncestors(scene, c.id, { exact: false }));
}
