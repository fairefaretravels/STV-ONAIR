const CACHE_NAME = 'stv-radio-v2'; // bump this on every future deploy
const OFFLINE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin GETs; never touch the audio stream or other origins
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (req.headers.has('range')) return;

  // Always fetch the latest schedule
  if (url.pathname.endsWith('/network.json')) return;

  // Pages: network first, cache fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('/index.html')))
    );
    return;
  }

  // Static assets: cache first, then network
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).catch(() => Response.error()))
  );
});

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
