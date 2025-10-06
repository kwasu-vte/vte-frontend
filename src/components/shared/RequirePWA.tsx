'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface RequirePWAProps {
  children: React.ReactNode;
}

export function RequirePWA({ children }: RequirePWAProps) {
  const [isStandalone, setIsStandalone] = useState<boolean>(true);
  const isIOS = useMemo(() => /iPad|iPhone|iPod/.test(typeof navigator !== 'undefined' ? navigator.userAgent : ''), []);
  const isAndroid = useMemo(() => /Android/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : ''), []);
  const isFirefox = useMemo(() => /firefox/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : ''), []);

  useEffect(() => {
    const check = () => {
      const standalone = typeof window !== 'undefined' && (
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone ||
        document.referrer.includes('android-app://')
      );
      setIsStandalone(standalone);
    };
    check();
    const onVisibility = () => check();
    window.addEventListener('visibilitychange', onVisibility);
    return () => window.removeEventListener('visibilitychange', onVisibility);
  }, []);

  if (isStandalone) return <>{children}</>;

  // * Block usage until installed; provide instructions per platform
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Image src="/kwasulogo.png" alt="KWASU VTE" width={36} height={36} className="rounded" />
          <h2 className="text-lg font-semibold text-neutral-900">Install KWASU VTE</h2>
        </div>
        <p className="mt-2 text-sm text-neutral-700">
          For students, the app must be installed to continue. Installation enables offline support, faster loading, and stable QR scanning.
        </p>

        <div className="mt-4 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-800">
          {isIOS && (
            <>
              <p className="font-medium">iPhone/iPad (Safari):</p>
              <ol className="mt-2 list-decimal pl-5 space-y-1">
                <li>Tap the Share button in Safari.</li>
                <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
                <li>Tap <b>Add</b> to confirm.</li>
              </ol>
            </>
          )}
          {isAndroid && (
            <>
              <p className="font-medium">Android (Chrome/Edge):</p>
              <ol className="mt-2 list-decimal pl-5 space-y-1">
                <li>Open the browser menu (⋮).</li>
                <li>Tap <b>Install app</b> or <b>Add to Home screen</b>.</li>
                <li>Confirm to add.</li>
              </ol>
            </>
          )}
          {!isIOS && !isAndroid && isFirefox && (
            <>
              <p className="font-medium">Firefox:</p>
              <ol className="mt-2 list-decimal pl-5 space-y-1">
                <li>Open the browser menu.</li>
                <li>Select <b>Install</b> or <b>Add to Home Screen</b> if available.</li>
                <li>If not available, use Chrome/Edge to install.</li>
              </ol>
            </>
          )}
          {!isIOS && !isAndroid && !isFirefox && (
            <>
              <p className="font-medium">Desktop:</p>
              <ol className="mt-2 list-decimal pl-5 space-y-1">
                <li>Use Chrome/Edge.</li>
                <li>Click the install icon in the address bar, or open the browser menu and choose <b>Install app</b>.</li>
              </ol>
            </>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-neutral-500">Installation required for student access</span>
          <Button onClick={() => location.reload()} size="sm" variant="outline">I have installed</Button>
        </div>
      </div>
    </div>
  );
}

export default RequirePWA;


