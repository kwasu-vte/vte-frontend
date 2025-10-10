'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ClientOnly Component
 * Prevents hydration mismatches by only rendering children on the client
 * Useful for components that have different server/client behavior
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // * Ensure we're on the client and DOM is ready
    setHasMounted(true);
  }, []);

  // * During SSR and initial hydration, show fallback
  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}