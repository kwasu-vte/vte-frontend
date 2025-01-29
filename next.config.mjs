/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;





/* import withPWA from 'next-pwa';

const nextConfig = withPWA({
    dest: 'public', // Output directory for service worker and related files
    register: true, // Automatically register the service worker
    skipWaiting: true, // Activate the new service worker as soon as it's installed
    runtimeCaching: [
      {
        // Cache all pages dynamically
        urlPattern: ({ request, url }) =>
          request.destination === 'document' && url.pathname.startsWith('/'),
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages-cache',
          networkTimeoutSeconds: 10, // Fallback to cache after 10 seconds
          expiration: {
            maxEntries: 50, // Cache up to 50 pages
            maxAgeSeconds: 60 * 60 * 24, // Cache valid for 1 day
          },
          cacheableResponse: {
            statuses: [200], // Cache only successful responses
          },
        },
      },
      {
        // Cache static assets (e.g., JS, CSS, images)
        urlPattern: ({ request }) =>
          ['style', 'script', 'image'].includes(request.destination),
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-assets-cache',
          expiration: {
            maxEntries: 100, // Cache up to 100 assets
            maxAgeSeconds: 60 * 60 * 24 * 7, // Cache valid for 1 week
          },
          cacheableResponse: {
            statuses: [200], // Cache only successful responses
          },
        },
      },
    ],
  });
  
  export default nextConfig; */

/* "@next/font": "^14.2.15", */