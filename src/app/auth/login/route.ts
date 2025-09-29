// * Authentication Route Handler
// * Handles direct form submission from sign-in page
// * Proxies to backend API and manages session cookies

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// * Set secure session cookie
const setSessionCookie = async (token: string, maxAgeSeconds: number) => {
  const cookieStore = await cookies();
  cookieStore.set('session_token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: maxAgeSeconds,
  });
};

export async function POST(request: NextRequest) {
  const traceId = Math.random().toString(36).substring(2, 10);
  console.info(`[Auth Login ${traceId}] Processing login request`);

  try {
    // * Get form data
    const formData = await request.formData();
    const username = formData.get('username') as string; // Form field name (matric/email)
    const password = formData.get('password') as string;
    const remember = formData.get('remember') === 'on';

    // * Validate required fields
    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Email/Matric number and password are required'
      }, { status: 400 });
    }

    // * Prepare API request
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBaseUrl) {
      console.error(`[Auth Login ${traceId}] CRITICAL: API Base URL not configured`);
      return NextResponse.json({
        success: false,
        message: 'Authentication service unavailable'
      }, { status: 500 });
    }

    const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
    const targetUrl = `${baseUrl}/api/v1/users/auth/login`;

    // * Create login payload matching your API spec
    const loginPayload = {
      email: username.trim(), // Your API expects 'email' field
      password: password
    };

    console.debug(`[Auth Login ${traceId}] Authenticating user: ${username}`);

    // * Make request to backend API
    const apiResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(loginPayload),
    });

    const responseData = await apiResponse.json().catch(() => null);
    console.info(`[Auth Login ${traceId}] Backend response: ${apiResponse.status}`);

    if (!apiResponse.ok) {
      const errorMessage = responseData?.message || 'Authentication failed';
      console.warn(`[Auth Login ${traceId}] Login failed: ${errorMessage}`);
      
      return NextResponse.json({
        success: false,
        message: errorMessage
      }, { status: apiResponse.status });
    }

    // * Extract token from response (matching your proxy logic)
    const token = responseData?.data?.access_token
      ?? responseData?.access_token
      ?? responseData?.data?.token
      ?? responseData?.token
      ?? responseData?.data?.access?.token
      ?? responseData?.access?.token;

    const expiresIn = Number(
      responseData?.data?.expires_in
      ?? responseData?.expires_in
      ?? responseData?.data?.access?.expires_in
      ?? (remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24) // 30 days if remember, 1 day otherwise
    );

    if (!token) {
      console.error(`[Auth Login ${traceId}] No token in successful response`);
      return NextResponse.json({
        success: false,
        message: 'Authentication response invalid'
      }, { status: 500 });
    }

    // * Set session cookie
    await setSessionCookie(token, isNaN(expiresIn) ? 60 * 60 * 24 : expiresIn);
    console.info(`[Auth Login ${traceId}] Login successful, session cookie set`);

    // * Determine redirect URL based on user role
    const userRole = responseData?.data?.user?.role 
      || responseData?.user?.role 
      || 'student'; // Default fallback

    const dashboardUrl = `/${userRole.toLowerCase()}/dashboard`;
    const redirectUrl = request.nextUrl.searchParams.get('redirect') || dashboardUrl;

    // * Return redirect response
    return NextResponse.redirect(new URL(redirectUrl, request.url));

  } catch (error) {
    console.error(`[Auth Login ${traceId}] Unexpected error:`, error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
