// * Auth Routes Layout
// * If already authenticated, redirect users away from sign-in/sign-up
// * Special handling for callback route to avoid redirect loops

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
  const sessionCookie = cookieStore.get('session_token');
  
  // * If no session cookie, allow access to auth pages
  if (!sessionCookie) {
    return <>{children}</>;
  }
  
  // * Try to get user data - if this fails, clear the cookie and allow access
  let user;
  try {
    user = await getCurrentUser();
  } catch (error) {
    console.error('Auth layout: Failed to get current user, clearing session:', error);
    // * Clear the invalid session cookie
    const cookieStoreOnError = await cookies();
    cookieStoreOnError.set('session_token', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });
    return <>{children}</>;
  }
  
  // * If no user (e.g., refresh failed), allow access without mutating cookies here
  if (!user) {
    return <>{children}</>;
  }
  
  // * If we have a valid user, redirect to appropriate dashboard
  if (user) {
    const role = String(user.role || '').toLowerCase();
    const target = role === 'admin' || role === 'mentor' || role === 'student' ? `/${role}/dashboard` : '/';
    redirect(target);
  }
  
  return <>{children}</>;
}


