import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KWASU VTE - Vocational Technical Education',
    short_name: 'KWASU VTE',
    description: 'KWASU Vocational Technical Education and Entrepreneurship Management Platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e40af',
    orientation: 'portrait-primary',
    scope: '/',
    categories: ['education', 'productivity', 'business'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/icons/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/apple-icon-180.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/icons/apple-splash-1125-2436.jpg',
        sizes: '1125x2436',
        type: 'image/jpeg',
        form_factor: 'narrow',
        label: 'iPhone X/XS/11 Pro'
      },
      {
        src: '/icons/apple-splash-1170-2532.jpg',
        sizes: '1170x2532',
        type: 'image/jpeg',
        form_factor: 'narrow',
        label: 'iPhone 12/13/14 Pro'
      },
      {
        src: '/icons/apple-splash-1536-2048.jpg',
        sizes: '1536x2048',
        type: 'image/jpeg',
        form_factor: 'wide',
        label: 'iPad Pro'
      }
    ]
  };
}
