// * Service Worker for KWASU VTE PWA
// * Strategy: Always serve from network, cache images/stylesheets in background
// * Pages are NEVER cached - always fresh from network
// * Images and stylesheets: Network First with background cache update
// * API requests are not intercepted to avoid conflicts

const CACHE_NAME = 'kwasu-vte-v2';
const IMAGES_STYLES_CACHE_NAME = 'kwasu-vte-images-styles-v2';

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
        caches.open(IMAGES_STYLES_CACHE_NAME)
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
                        if (cacheName !== IMAGES_STYLES_CACHE_NAME) {
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
        // * For HTML pages, ALWAYS fetch from network - never cache
        event.respondWith(alwaysNetworkStrategy(request));
    } else if (['image', 'style'].includes(request.destination)) {
        // * For images and stylesheets only, use Network First strategy (always try network first)
        event.respondWith(networkFirstStrategy(request));
    } else {
        // * For all other requests (scripts, fonts, etc.), always fetch from network
        event.respondWith(alwaysNetworkStrategy(request));
    }
});

// * Always Network Strategy - always fetch from network, never cache
async function alwaysNetworkStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Network failed for', request.url);

        // * Return offline page for navigation requests only
        if (request.destination === 'document') {
            return caches.match('/offline.html');
        }

        throw error;
    }
}

// * Network First with Background Cache Update - always serve from network, update cache in background
async function networkFirstStrategy(request) {
    try {
        // * Always fetch from network first
        const networkResponse = await fetch(request);

        // * If successful, update cache in background for images and stylesheets
        if (networkResponse.ok && ['image', 'style'].includes(request.destination)) {
            // * Clone the response and cache it in background
            const responseClone = networkResponse.clone();
            caches.open(IMAGES_STYLES_CACHE_NAME).then(cache => {
                cache.put(request, responseClone);
                console.log('Service Worker: Background cache updated for', request.url);
            }).catch(error => {
                console.log('Service Worker: Background cache update failed for', request.url, error);
            });
        }

        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache', request.url);

        // * Only fallback to cache if network fails
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('Service Worker: Serving from cache', request.url);
            return cachedResponse;
        }

        throw error;
    }
}



// * Note: This service worker implements "Network First with Background Cache Update"
// * - Pages: Always served from network, never cached
// * - Images/Stylesheets: Served from network immediately, cached in background for offline fallback
// * - API requests: Not intercepted to prevent conflicts with React Query

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
