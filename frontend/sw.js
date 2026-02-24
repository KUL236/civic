/* Service Worker for CivicSense PWA */

const CACHE_NAME = 'civicsense-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/admin.html',
    '/officer.html',
    '/popular.html',
    '/login.html',
    '/style.css',
    '/script.js',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event: cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching app shell');
            return cache.addAll(ASSETS).catch(err => {
                console.warn('Cache add failed:', err);
                // Continue even if some assets fail
            });
        })
    );
    self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event: serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // For Firestore/API calls, use network-first
    if (event.request.url.includes('firebaseapp.com') ||
        event.request.url.includes('googleapis.com') ||
        event.request.url.includes('localhost:5000/api')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache successful responses
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, clone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Return from cache if network fails
                    return caches.match(event.request);
                })
        );
    } else {
        // For static assets, use cache-first
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
                })
                .catch(() => {
                    return new Response('Offline - resource not cached', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/plain'
                        })
                    });
                })
        );
    }
});

// Handle messages from clients
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
