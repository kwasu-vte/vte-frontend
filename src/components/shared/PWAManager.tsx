'use client';

import { useEffect, useState } from 'react';
import { InstallPrompt } from './InstallPrompt';
import { FloatingInstallPrompt } from './FloatingInstallPrompt';

interface PWAManagerProps {
  children: React.ReactNode;
}

export function PWAManager({ children }: PWAManagerProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // * Handle online/offline status only (no service worker)
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

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

      {/* * Floating Install Prompt (dismissible) */}
      <FloatingInstallPrompt />

      {/* * Online/Offline Status Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
          <span className="text-sm">You're offline. Some features may be limited.</span>
        </div>
      )}
    </>
  );
}

export default PWAManager;
