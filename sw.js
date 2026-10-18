/**
 * Service Worker for Book & Notes Vault
 * Provides offline-first asset caching and resilience (Stretch Goal)
 */

const CACHE_NAME = 'book-vault-cache-v1';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './tests.html',
  './tests/tests.html',
  './tests/tests.js',
  './styles/main.css',
  './scripts/app.js',
  './scripts/state.js',
  './scripts/storage.js',
  './scripts/ui.js',
  './scripts/validators.js',
  './scripts/search.js',
  './seed.json',
  './assets/graduation.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then(networkResponse => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Fallback to cached index.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
