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

    // * Determine base URL via environment with sensible defaults
    const baseUrl = process.env.APP_BASE_URL || 'https://vte.com.ng';

    // * Login via internal proxy
    const loginRes = await fetch(new URL('/api/v1/users/auth/login', baseUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });

    const loginJson = await loginRes.json().catch(() => ({}));
    const accessToken = loginJson?.data?.access_token || loginJson?.access_token || null;
    const expiresIn = Number(loginJson?.data?.expires_in ?? loginJson?.expires_in ?? (remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7));

    if (!loginRes.ok || !accessToken) {
      const message = loginJson?.message || 'Authentication failed';
      return NextResponse.json({ success: false, message }, { status: loginRes.status || 401 });
    }

    // * Immediately check user to compute redirect target
    const meRes = await fetch(new URL('/api/v1/users/auth/me', baseUrl), {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${accessToken}` },
    });
    const meJson = await meRes.json().catch(() => ({}));
    const role = String(meJson?.data?.role || '').toLowerCase();
    const redirectTarget = role === 'admin' || role === 'mentor' || role === 'student' ? `/${role}/dashboard` : '/';

    // * Build redirect response and set cookie on the browser response
    // * Guard against absolute redirects to other origins (e.g., localhost)
    const rawRedirect = request.nextUrl.searchParams.get('redirect');
    let safeRedirectPath = redirectTarget;
    if (rawRedirect) {
      try {
        // Treat absolute URLs cautiously; allow only same-origin
        if (rawRedirect.startsWith('http://') || rawRedirect.startsWith('https://')) {
          const candidate = new URL(rawRedirect);
          if (candidate.origin === request.nextUrl.origin) {
            safeRedirectPath = candidate.pathname + candidate.search + candidate.hash;
          }
        } else if (rawRedirect.startsWith('/')) {
          safeRedirectPath = rawRedirect;
        }
      } catch (_) {
        // Ignore malformed redirect
      }
    }
    const redirectUrl = new URL(safeRedirectPath, request.nextUrl.origin);
    const resp = NextResponse.redirect(redirectUrl);
    resp.cookies.set('session_token', accessToken, cookieOptions(isNaN(expiresIn) ? (remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7) : expiresIn));
    return resp;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}


