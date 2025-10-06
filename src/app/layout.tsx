import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Providers } from "./providers";
import PWAManager from "@/components/shared/PWAManager";
 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KWASU VTE - Vocational Technical Education",
  description: "KWASU Vocational Technical Education and Entrepreneurship Management Platform",
  keywords: ["KWASU", "VTE", "Vocational", "Technical", "Education", "Entrepreneurship"],
  authors: [{ name: "KWASU VTE Team" }],
  creator: "KWASU VTE",
  publisher: "KWASU",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "KWASU VTE - Vocational Technical Education",
    description: "KWASU Vocational Technical Education and Entrepreneurship Management Platform",
    url: '/',
    siteName: 'KWASU VTE',
    images: [
      {
        url: '/icons/manifest-icon-512.maskable.png',
        width: 512,
        height: 512,
        alt: 'KWASU VTE Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "KWASU VTE - Vocational Technical Education",
    description: "KWASU Vocational Technical Education and Entrepreneurship Management Platform",
    images: ['/icons/manifest-icon-512.maskable.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/manifest-icon-192.maskable.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/manifest-icon-512.maskable.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KWASU VTE',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'Permissions-Policy': 'camera=(self)',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1e40af' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        {/* * PWA Meta Tags */}
        <meta name="application-name" content="KWASU VTE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KWASU VTE" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* * Apple Splash Screens */}
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1125-2436.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1170-2532.jpg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1536-2048.jpg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <QueryProvider>
            <AppProvider>
              <PWAManager>
                {children}
              </PWAManager>
            </AppProvider>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}