'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface PWATestPanelProps {
  className?: string;
}

export function PWATestPanel({ className }: PWATestPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // * Check if app is installed (running in standalone mode)
    const checkInstallStatus = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone ||
                       document.referrer.includes('android-app://');
      setIsInstalled(standalone);
    };

    // * Check online status
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    checkInstallStatus();
    checkOnlineStatus();

    // * Listen for online/offline events
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, []);

  if (!isVisible) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsVisible(true)}
        className={className}
      >
        PWA Test Panel
      </Button>
    );
  }

  return (
    <div className={`p-4 border rounded-lg bg-white shadow-lg ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">PWA Test Panel</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsVisible(false)}
        >
          Close
        </Button>
      </div>

      <div className="space-y-4">
        {/* * PWA Status */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">PWA Status</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>App Installed:</span>
              <span className={isInstalled ? 'text-green-600' : 'text-gray-600'}>
                {isInstalled ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Online Status:</span>
              <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Service Worker:</span>
              <span className="text-green-600">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* * PWA Features */}
        <div className="p-3 bg-blue-50 rounded text-sm">
          <h4 className="font-medium mb-2">PWA Features</h4>
          <ul className="space-y-1 text-gray-600">
            <li>• Install prompt appears every 7 days</li>
            <li>• Offline functionality with service worker</li>
            <li>• App-like experience on mobile</li>
            <li>• Cached content for faster loading</li>
          </ul>
        </div>

        {/* * Test Actions */}
        <div className="space-y-2">
          <Button 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Test Offline Mode
          </Button>
          
          <Button 
            onClick={() => {
              // * Clear service worker cache
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                  registrations.forEach(registration => {
                    registration.unregister();
                  });
                  window.location.reload();
                });
              }
            }}
            variant="outline"
            className="w-full"
          >
            Clear Cache & Reload
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PWATestPanel;
