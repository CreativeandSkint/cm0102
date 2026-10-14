// Keeps every file of the game on the device so it opens and plays offline.
// App files live in a versioned cache; the 140 MB of game data lives in its own
// cache so app updates never re-download it.
const APP_CACHE = "cm0102-app-v7";
const DATA_CACHE = "cm0102-data-v1";
const APP_FILES = [
  "./", "index.html", "shell.js", "manifest.webmanifest",
  "st/boxedwine.js", "st/boxedwine.wasm", "jit/boxedwine.js", "jit/boxedwine.wasm", "jitr/boxedwine.js", "jitr/boxedwine.wasm",
  "vendor/fflate.js", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png",
  "fonts/barlow-condensed-latin-500-normal.woff2", "fonts/barlow-condensed-latin-600-normal.woff2", "fonts/barlow-condensed-latin-700-normal.woff2",
  "fonts/barlow-latin-400-normal.woff2", "fonts/barlow-latin-500-normal.woff2", "fonts/barlow-latin-600-normal.woff2",
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(k => k.startsWith("cm0102-") && k !== APP_CACHE && k !== DATA_CACHE)
    .map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isData = url.pathname.includes("/data/");
  const cacheName = isData ? DATA_CACHE : APP_CACHE;
  // The page itself: network first so updates arrive, cache when offline.
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(APP_CACHE).then(c => c.put("index.html", copy)); return res;
    }).catch(() => caches.match("index.html", { ignoreSearch: true })));
    return;
  }
  // Everything else: cache first, then network (and keep a copy).
  event.respondWith(caches.open(cacheName).then(async cache => {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  }));
});
