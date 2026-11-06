const CACHE_NAME = 'weatherguru-gold-v2.3';

// Dynamically resolve base path for subpaths like /WeatherGlobe or /WeatherGuro
const BASE_PATH = typeof self !== 'undefined' && self.location
  ? self.location.pathname.replace(/\/sw\.js$/, '')
  : '';

const PRECACHE_ASSETS = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/manifest.json',
  BASE_PATH + '/logo.svg',
  BASE_PATH + '/favicon.png',
  BASE_PATH + '/icon-192.png',
  BASE_PATH + '/icon-512.png'
];

// Install Event - Precache essential assets and force immediate activation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Precache partial warning:', err);
      });
    })
  );
});

// Activate Event - Clean up stale caches from previous versions & claim all clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network-first for APIs, Stale-while-revalidate for valid static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Network-first for live weather APIs, TTS audio streams, and GitHub releases
  if (
    url.pathname.includes('/api/') ||
    url.hostname.includes('open-meteo.com') ||
    url.hostname.includes('google.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('github.com')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Stale-while-revalidate for static assets (only using valid cached responses)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Only serve cache if status is 200 OK (never serve cached 404s)
      const isOkCache = cachedResponse && cachedResponse.ok;

      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return isOkCache ? cachedResponse : fetchPromise;
    })
  );
});

// Message listener to trigger instant skipWaiting when new update is downloaded
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
