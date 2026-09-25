// Minimal service worker: caches the app shell for offline access.
// Deliberately conservative — network-first for navigation, stale-while-
// revalidate for same-origin static assets, no aggressive pre-caching that
// could go stale silently.
//
// IMPORTANT: only same-origin requests are handled. Cross-origin requests
// (the GitHub activity API, Google Fonts) go straight to the network. The
// previous version cached them cache-first, so the "live" GitHub activity feed
// kept showing the response from the visitor's first ever visit.
const CACHE = "portfolio-shell-v2";
const SHELL = ["/Portfolio/", "/Portfolio/index.html", "/Portfolio/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // let cross-origin hit the network

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/Portfolio/offline.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response.ok && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
