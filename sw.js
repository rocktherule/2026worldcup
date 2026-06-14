const CACHE = '2026worldcup-v3';
const ASSETS = [
  '/2026worldcup/',
  '/2026worldcup/index.html',
  '/2026worldcup/manifest.json',
  '/2026worldcup/icon-192.png',
  '/2026worldcup/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // index.html은 항상 네트워크에서 최신 버전으로
  if (e.request.url.includes('index.html') || e.request.url.endsWith('/2026worldcup/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
