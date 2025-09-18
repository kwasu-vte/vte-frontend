// * Auth Callback Route
// * Sets the httpOnly session cookie from a browser GET, then redirects

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const target = url.searchParams.get('target') || '/';

  const response = NextResponse.redirect(new URL(target, url.origin));
  if (token) {
    response.cookies.set('session_token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return response;
}


