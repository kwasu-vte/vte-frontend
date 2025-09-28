'use client';

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

export function FloatingInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const isIOS = useMemo(() => /iPad|iPhone|iPod/.test(typeof navigator !== 'undefined' ? navigator.userAgent : ''), [])

  useEffect(() => {
    // * Detect installed
    const standalone = typeof window !== 'undefined' && (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone ||
      document.referrer.includes('android-app://')
    )
    setIsInstalled(standalone)

    const storageKey = 'pwa-floating-install-prompt-time'
    const throttleMs = 6 * 60 * 60 * 1000 // 6 hours

    // * Fallback visibility even if beforeinstallprompt hasn't fired yet
    if (!isIOS && !standalone) {
      const last = localStorage.getItem(storageKey)
      const now = Date.now()
      if (!last || now - parseInt(last) > throttleMs) {
        setVisible(true)
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // * Keep visible if we already made it visible via fallback, otherwise show now subject to throttle
      if (!visible && !isIOS && !standalone) {
        const last = localStorage.getItem(storageKey)
        const now = Date.now()
        if (!last || now - parseInt(last) > throttleMs) setVisible(true)
      }
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setVisible(false)
      localStorage.setItem(storageKey, Date.now().toString())
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isIOS, visible])

  if (isInstalled || isIOS || !visible) return null

  const onInstall = async () => {
    if (!deferredPrompt) return
    try {
      await deferredPrompt.prompt()
      await deferredPrompt.userChoice
    } catch {}
    localStorage.setItem('pwa-floating-install-prompt-time', Date.now().toString())
    setDeferredPrompt(null)
    setVisible(false)
  }

  const onDismiss = () => {
    localStorage.setItem('pwa-floating-install-prompt-time', Date.now().toString())
    setVisible(false)
  }

  return (
    <div
      className="fixed z-50 w-[calc(100%-2rem)] max-w-md md:max-w-sm left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 bottom-4 md:bottom-6 md:right-6 shadow-lg rounded-xl border bg-white p-4 flex items-start gap-3"
      role="dialog"
      aria-label="Install app prompt"
    >
      <div className="shrink-0">
        <Image src="/kwasulogo.png" alt="KWASU VTE" width={36} height={36} className="rounded" />
      </div>
      <div className="flex-1">
        <div className="font-medium text-neutral-900">Install KWASU VTE</div>
        <div className="text-sm text-neutral-600 mt-0.5">Add the app for faster access and offline support.</div>
        <div className="mt-3 flex items-center gap-2">
          <Button onClick={onInstall} size="sm" disabled={!deferredPrompt}>Install</Button>
          <Button onClick={onDismiss} size="sm" variant="outline">Maybe later</Button>
        </div>
      </div>
    </div>
  )
}

export default FloatingInstallPrompt


