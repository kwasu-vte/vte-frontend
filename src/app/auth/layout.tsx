// * Auth Routes Layout
// * If already authenticated, redirect users away from sign-in/sign-up

import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const cookieStore = await cookies();
  const hasSessionCookie = !!cookieStore.get('session_token');
  const user = hasSessionCookie ? await getCurrentUser() : null;
  
  if (user) {
    const role = String(user.role || '').toLowerCase();
    const target = role === 'admin' || role === 'mentor' || role === 'student' ? `/${role}/dashboard` : '/';
    redirect(target);
  }
  
  return <>{children}</>;
}


