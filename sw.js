const CACHE_NAME = 'stv-radio-v1';
const OFFLINE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_ASSETS);
    })
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
  // For audio stream requests — always network, never cache
  if (event.request.url.includes('streamaudio.co') || event.request.url.includes('radiomeltdown')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        // Offline fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Keep audio alive — notify clients of background audio state
self.addEventListener('message', (event) => {
  if (event.data.type === 'KEEP_ALIVE') {
    // Ping back to prevent service worker sleep
    event.source.postMessage({ type: 'ALIVE' });
  }
});
