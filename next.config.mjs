/** @type {import('next').NextConfig} */
const nextConfig = {
  // * Use standalone output for production deployment
  output: 'standalone',

  // * Temporarily disable type checking and ESLint during production builds
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // * PWA Security Headers
  async headers() {
    return [
      {
        // * Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
      {
        // * Service Worker specific headers
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
      {
        // * Manifest specific headers
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // * Icons and static assets
        source: '/icons/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

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