/* ── FMH Music — Service Worker ── */
const CACHE_NAME = 'fmh-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './tracks.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

/* Installation — mise en cache des fichiers core */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* Activation — supprime les anciens caches */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Fetch — cache first pour assets, network first pour audio */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Fichiers audio → toujours depuis le réseau (trop lourds pour le cache)
  if (url.pathname.match(/\.(mp3|ogg|wav|flac|aac)$/i)) {
    event.respondWith(fetch(event.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // Tout le reste → cache first, réseau en fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached || new Response('Hors ligne', { status: 503 }));
    })
  );
});
