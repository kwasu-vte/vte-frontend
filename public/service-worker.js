// public/service-worker.js
self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activated.');
  });
  
  // Cache all pages (Network First)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
      networkTimeoutSeconds: 10,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60,
        }),
      ],
    })
  );
  
  // Cache static assets (Cache First)
  workbox.routing.registerRoute(
    ({ request }) =>
      ['style', 'script', 'image'].includes(request.destination),
    new workbox.strategies.CacheFirst({
      cacheName: 'static-assets-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
      ],
    })
  );
  