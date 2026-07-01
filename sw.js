const CACHE_NAME = 'stv-radio-v2'; // bump this on every future deploy
const OFFLINE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Audio stream — always network, never touch cache
  if (req.url.includes('streamaudio.co') || req.url.includes('radiomeltdown')) {
    return;
  }

  // Navigation requests (the HTML page itself) — NETWORK FIRST.
  // This is the key fix: always try to get the latest index.html,
  // only fall back to cache if the network is unreachable.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Everything else (icons, manifest, static assets) — cache first is fine.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).catch(() => {});
    })
  );
});

// Keep audio alive — notify clients of background audio state
self.addEventListener('message', (event) => {
  if (event.data.type === 'KEEP_ALIVE') {
    event.source.postMessage({ type: 'ALIVE' });
  }
});
