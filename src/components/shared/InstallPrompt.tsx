'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallPromptProps {
  className?: string;
}

export function InstallPrompt({ className }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isFirefox, setIsFirefox] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // * Check if app is already installed
  useEffect(() => {
    const checkInstallStatus = () => {
      // * Check if running in standalone mode (installed)
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone ||
                       document.referrer.includes('android-app://');
      
      setIsStandalone(standalone);
      setIsInstalled(standalone);

      // * Check if iOS device
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(iOS);

      // * Detect Firefox (no beforeinstallprompt support)
      const ff = /firefox/i.test(navigator.userAgent);
      setIsFirefox(ff);

      // * Check localStorage for install prompt timing
      const lastPromptTime = localStorage.getItem('pwa-install-prompt-time');
      const now = Date.now();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

      if (!standalone) {
        // * Show prompt if never shown or if 7 days have passed
        // * On iOS, we also show the informational guide (since no native prompt)
        if (!lastPromptTime || (now - parseInt(lastPromptTime)) > sevenDaysInMs) {
          setShowInstallPrompt(true);
        }
      }
    };

    checkInstallStatus();

    // * Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // * Show prompt if conditions are met
      const lastPromptTime = localStorage.getItem('pwa-install-prompt-time');
      const now = Date.now();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

      if (!lastPromptTime || (now - parseInt(lastPromptTime)) > sevenDaysInMs) {
        setShowInstallPrompt(true);
      }
    };

    // * Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      localStorage.setItem('pwa-install-prompt-time', Date.now().toString());
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // * Show the install prompt
      await deferredPrompt.prompt();
      
      // * Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`User response to the install prompt: ${outcome}`);
      
      // * Update localStorage with the prompt time
      localStorage.setItem('pwa-install-prompt-time', Date.now().toString());
      
      // * Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-prompt-time', Date.now().toString());
  };

  const handleIOSInstall = () => {
    // * For iOS, we can't programmatically trigger install
    // * Just dismiss the modal and let user know how to install manually
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-prompt-time', Date.now().toString());
  };

  // * Don't show if already installed or if it's iOS (we'll show different instructions)
  if (isInstalled || (!showInstallPrompt && !isIOS)) {
    return null;
  }

  return (
    <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image src="/kwasulogo.png" alt="KWASU VTE" width={32} height={32} />
            Install KWASU VTE
          </DialogTitle>
          <DialogDescription>
            {isIOS ? (
              <>
                Install this app on your iPhone or iPad for a better experience.
                <br />
                <br />
                <strong>To install:</strong>
                <br />
                1. Tap the Share button in Safari
                <br />
                2. Scroll down and tap &quot;Add to Home Screen&quot;
                <br />
                3. Tap &quot;Add&quot; to confirm
              </>
            ) : (
              <>
                Install KWASU VTE on your device for quick access and offline functionality.
                <br />
                <br />
                <strong>Benefits:</strong>
                <br />
                • Quick access from your home screen
                <br />
                • Works offline
                <br />
                • Faster loading
                <br />
                • Push notifications
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          {isIOS ? (
            <Button onClick={handleIOSInstall} className="w-full">
              Got it!
            </Button>
          ) : (
            <>
              <Button onClick={handleInstallClick} className="w-full">
                Install App
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDismiss}
                className="w-full text-blue-800"
              >
                Maybe Later
              </Button>
            </>
          )}
        </div>
        
        <div className="text-xs text-gray-500 mt-2 text-center">
          {isIOS 
            ? "This prompt will appear again in 7 days if you haven&apos;t installed the app."
            : "This prompt will appear again in 7 days if you haven&apos;t installed the app."
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InstallPrompt;
