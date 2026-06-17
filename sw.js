const CACHE_NAME = 'abkd-inv-v2'; // 1. Incremented version to break old browser caches
const ASSETS = [
  './',                  // Caches the root directory
  './index.html',        // Caches your main interface
  './manifest.json',     // Caches the manifest properties
  'https://cdn.tailwindcss.com' // 2. Explicitly caches Tailwind CSS so styles load offline
];

// Installs the new assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    .then(() => self.skipWaiting()) // Forces the waiting service worker to become active immediately
  );
});

// 3. Cleans up old, redundant cache versions left behind over time
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Takes control of open pages immediately
  );
});

// Network-falling-back-to-cache operational strategy
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
