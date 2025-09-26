// * Auth Login Route Handler
// * Accepts form data, logs in via internal proxy, sets httpOnly cookie on browser, and redirects by role

import { NextRequest, NextResponse } from 'next/server';

const cookieOptions = (maxAgeSeconds: number) => ({
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: maxAgeSeconds,
});

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const username = String(form.get('username') || '').trim();
    const password = String(form.get('password') || '').trim();
    const remember = String(form.get('remember') || '') === 'on';

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Username and password are required' }, { status: 400 });
    }

    // * Login via internal proxy
    const loginRes = await fetch(`${request.nextUrl.origin}/api/v1/users/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });

    const loginJson = await loginRes.json().catch(() => ({}));
    const token = loginJson?.data?.access_token || loginJson?.access_token || null;
    const expiresIn = Number(loginJson?.data?.expires_in ?? loginJson?.expires_in ?? (remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7));

    if (!loginRes.ok || !token) {
      const message = loginJson?.message || 'Authentication failed';
      return NextResponse.json({ success: false, message }, { status: loginRes.status || 401 });
    }

    // * Immediately check user to compute redirect target
    const meRes = await fetch(`${request.nextUrl.origin}/api/v1/users/auth/me`, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    const meJson = await meRes.json().catch(() => ({}));
    const role = String(meJson?.data?.role || '').toLowerCase();
    const redirectTarget = role === 'admin' || role === 'mentor' || role === 'student' ? `/${role}/dashboard` : '/';

    // * Build redirect response and set cookie on the browser response
    const redirectUrl = new URL(request.nextUrl.searchParams.get('redirect') || redirectTarget, request.nextUrl.origin);
    const resp = NextResponse.redirect(redirectUrl);
    resp.cookies.set('session_token', token, cookieOptions(isNaN(expiresIn) ? (remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7) : expiresIn));
    return resp;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}


