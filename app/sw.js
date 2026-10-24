// sw.js: offline use when the editor is served by a static host. Cache first for everything under the app's scope; the cache name carries
// the build id written by app/build/build.mjs into precache.json (the list of every file), so a new build replaces the old cache.
const LIST = "precache.json";
self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    let files = ["./", "index.html", "app.css"], id = "dev";
    try { const r = await fetch(LIST, { cache: "no-store" }); const j = await r.json(); files = j.files; id = j.id; } catch { /* development: cache on first use */ }
    const c = await caches.open(`vss-${id}`); await c.addAll(files); self.skipWaiting();
  })());
});
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    let id = "dev"; try { id = (await (await fetch(LIST, { cache: "no-store" })).json()).id; } catch {}
    for (const k of await caches.keys()) if (k !== `vss-${id}`) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith((async () => {
    const hit = await caches.match(e.request); if (hit) return hit;
    const r = await fetch(e.request);
    if (r.ok && new URL(e.request.url).origin === location.origin) { const ks = await caches.keys(); if (ks[0]) (await caches.open(ks[0])).put(e.request, r.clone()); }
    return r;
  })());
});
