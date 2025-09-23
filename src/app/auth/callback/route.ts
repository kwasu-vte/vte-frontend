// * Auth Callback Route
// * Sets the httpOnly session cookie from a browser GET, then redirects
// * Enhanced error handling and logging for debugging

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const target = url.searchParams.get('target') || '/';

  console.log(`[Auth Callback] Token present: ${!!token}, Target: ${target}`);
  
  if (!token) {
    console.error('[Auth Callback] No token provided, redirecting to sign-in');
    return NextResponse.redirect(new URL('/auth/sign_in?error=no_token', url.origin));
  }

  const response = NextResponse.redirect(new URL(target, url.origin));
  
  try {
    response.cookies.set('session_token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    console.log(`[Auth Callback] Session cookie set successfully, redirecting to: ${target}`);
  } catch (error) {
    console.error('[Auth Callback] Failed to set session cookie:', error);
    return NextResponse.redirect(new URL('/auth/sign_in?error=cookie_failed', url.origin));
  }
  
  return response;
}