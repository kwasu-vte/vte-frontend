// * Service Worker for KWASU VTE PWA
// * Handles offline functionality and caching for static assets only
// * API requests are not intercepted to avoid conflicts

const CACHE_NAME = 'kwasu-vte-v1';
const STATIC_CACHE_NAME = 'kwasu-vte-static-v1';
const DYNAMIC_CACHE_NAME = 'kwasu-vte-dynamic-v1';

// * Static assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/icons/manifest-icon-192.maskable.png',
    '/icons/manifest-icon-512.maskable.png',
    '/icons/apple-icon-180.png',
    '/manifest.json',
    '/offline.html'
];

// * Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// * Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// * Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // * Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // * Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // * Skip API requests - let them pass through without interception
    if (url.pathname.startsWith('/api/')) {
        console.log('Service Worker: Skipping API request', request.url);
        return;
    }

    // * Handle different types of requests
    if (request.destination === 'document') {
        // * For HTML pages, use Network First strategy
        event.respondWith(networkFirstStrategy(request));
    } else if (['style', 'script', 'image', 'font'].includes(request.destination)) {
        // * For static assets, use Cache First strategy
        event.respondWith(cacheFirstStrategy(request));
    } else {
        // * Default to Network First for other requests
        event.respondWith(networkFirstStrategy(request));
    }
});

// * Network First Strategy - try network first, fallback to cache
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);

        // * Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache', request.url);

        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // * Return offline page for navigation requests
        if (request.destination === 'document') {
            return caches.match('/offline.html');
        }

        throw error;
    }
}

// * Cache First Strategy - try cache first, fallback to network
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('Service Worker: Failed to fetch', request.url, error);
        throw error;
    }
}


// * Note: This service worker focuses on offline functionality and caching for static assets
// * API requests are not intercepted to prevent conflicts with React Query and other API calls

// * Background sync event handler
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered', event.tag);

    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// * Background sync implementation
async function doBackgroundSync() {
    try {
        // * Implement background sync logic here
        // * For example: sync offline data, send queued requests, etc.
        console.log('Service Worker: Performing background sync');
    } catch (error) {
        console.error('Service Worker: Background sync failed', error);
    }
}

// * Message event handler for communication with main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

console.log('Service Worker: Script loaded');
