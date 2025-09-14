'use client';

import { useEffect, useState } from 'react';
import { InstallPrompt } from './InstallPrompt';

interface PWAManagerProps {
  children: React.ReactNode;
}

export function PWAManager({ children }: PWAManagerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // * Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });
          
          setSwRegistration(registration);
          console.log('Service Worker registered successfully:', registration);

          // * Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // * New content is available, show update notification
                  console.log('New content is available, please refresh.');
                  // * You can show a toast notification here
                }
              });
            }
          });

        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    // * Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // * Set initial online status
    setIsOnline(navigator.onLine);

    // * Register event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // * Register service worker
    registerServiceWorker();

    // * Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {children}
      
      {/* * Install Prompt Modal */}
      <InstallPrompt />
      
      {/* * Online/Offline Status Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
          <span className="text-sm">You&apos;re offline. Some features may be limited.</span>
        </div>
      )}
      
      {/* * Service Worker Update Notification */}
      {swRegistration && (
        <div id="sw-update-notification" className="hidden">
          {/* * This would be a toast notification for updates */}
        </div>
      )}
    </>
  );
}

export default PWAManager;
