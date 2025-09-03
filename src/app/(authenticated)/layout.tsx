// * Authenticated Layout
// * Wraps all authenticated routes with the AppShell
// * Fetches user data server-side and passes it to AppShell

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  // * Get user data server-side
  const user = await getCurrentUser();
  
  // * Redirect to sign-in if not authenticated
  if (!user) {
    redirect('/auth/sign-in');
  }

  return <AppShell user={user}>{children}</AppShell>;
}
