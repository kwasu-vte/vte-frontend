// * Next.js API Proxy Route
// * Handles all API requests via proxy pattern
// * Manages authentication via httpOnly cookies
// * Client → /api/* → Backend with secure cookie handling

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// * Helper to generate unique trace ID
const generateTraceId = () => Math.random().toString(36).substring(2, 10);

// * Set secure session cookie
const setSessionCookie = async (token: string, maxAgeSeconds: number) => {
  const cookieStore = await cookies();
  cookieStore.set('session_token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: maxAgeSeconds,
  });
};

// * Delete session cookie
const deleteSessionCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.set('session_token', '', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
  });
};

// * Universal request handler
const handleRequest = async (request: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) => {
  const traceId = generateTraceId();
  const startTime = Date.now();
  const resolvedParams = await params;
  const path = resolvedParams.proxy.join('/');

  console.info(`[BFF Proxy ${traceId}] --> ${request.method} /api/${path}`);

  // * Determine target API URL
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) {
    console.error(`[BFF Proxy ${traceId}] CRITICAL: API Base URL is not defined!`);
    return NextResponse.json({ error: 'API endpoint configuration error.' }, { status: 500 });
  }

  // * Ensure proper URL construction regardless of trailing slash
  const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
  const pathWithSlash = path.startsWith('/') ? path : `/${path}`;
  const targetUrl = `${baseUrl}${pathWithSlash}${request.nextUrl.search}`;
  console.debug(`[BFF Proxy ${traceId}] Target URL: ${targetUrl}`);

  // * Prepare headers for the real API
  const requestHeaders = new Headers();
  
  // * Copy safe headers from client request
  const safeHeaders = ['Content-Type', 'Accept'];
  for (const headerName of safeHeaders) {
    if (request.headers.has(headerName)) {
      requestHeaders.set(headerName, request.headers.get(headerName)!);
    }
  }

  // * Get session token from secure cookie
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token');

  // * Add Authorization header if token exists
  if (sessionToken) {
    requestHeaders.set('Authorization', `Bearer ${sessionToken.value}`);
    console.debug(`[BFF Proxy ${traceId}] Attached Bearer token from cookie.`);
  }

  // * Handle logout specifically (fire-and-forget to API, clear cookie regardless)
  if (path === 'v1/users/auth/logout') {
    try {
      await fetch(targetUrl, { method: 'POST', headers: requestHeaders });
    } catch (_) {}
    await deleteSessionCookie();
    console.info(`[BFF Proxy ${traceId}] User logged out. Session cookie deleted.`);
    return NextResponse.json({ success: true, message: 'Successfully logged out' });
  }

  // * Prepare fetch options
  const fetchOptions: RequestInit = {
    method: request.method,
    headers: requestHeaders,
    redirect: 'follow',
  };

  // * Add body for non-GET requests
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    fetchOptions.body = request.body;
  }

  try {
    console.info(`[BFF Proxy ${traceId}] Fetching from real API...`);
    const apiResponse = await fetch(targetUrl, fetchOptions);
    const duration = Date.now() - startTime;
    
    console.info(`[BFF Proxy ${traceId}] <-- ${apiResponse.status} from API in ${duration}ms`);

    // * Process API response
    const responseHeaders = new Headers();
    
    // * Copy safe headers from API response
    const headersToExclude = ['set-cookie', 'content-encoding', 'content-length', 'transfer-encoding'];
    apiResponse.headers.forEach((value, key) => {
      if (!headersToExclude.includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    // * Special handling for login: extract token from spec shape and set cookie
    if (path === 'v1/users/auth/login') {
      const json = await apiResponse.json().catch(() => null);
      const token = json?.data?.access_token ?? json?.access_token;
      const expiresIn = Number(json?.data?.expires_in ?? 60 * 60 * 24 * 30);
      if (apiResponse.ok && token) {
        await setSessionCookie(token, isNaN(expiresIn) ? 60 * 60 * 24 * 30 : expiresIn);
        console.info(`[BFF Proxy ${traceId}] Login successful. Session cookie set.`);
      }
      return NextResponse.json(json ?? {}, { status: apiResponse.status, headers: responseHeaders });
    }

    // * Special handling for refresh: extract token from spec shape and update cookie
    if (path === 'v1/users/auth/refresh') {
      const json = await apiResponse.json().catch(() => null);
      const token = json?.data?.access_token ?? json?.access_token;
      const expiresIn = Number(json?.data?.expires_in ?? 60 * 60 * 24 * 7);
      if (apiResponse.ok && token) {
        await setSessionCookie(token, isNaN(expiresIn) ? 60 * 60 * 24 * 7 : expiresIn);
        console.info(`[BFF Proxy ${traceId}] Token refresh successful. Session cookie updated.`);
      }
      return NextResponse.json(json ?? {}, { status: apiResponse.status, headers: responseHeaders });
    }

    // * For all other requests, return the API response
    const responseBody = await apiResponse.text();
    return new NextResponse(responseBody, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      headers: responseHeaders,
    });

  } catch (err) {
    console.error(`[BFF Proxy ${traceId}] Fetch to real API failed:`, err);
    return NextResponse.json(
      { error: 'Bad Gateway: Could not connect to the API service.' },
      { status: 502 }
    );
  }
};

// * Export handlers for all HTTP methods
export const GET = (request: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) =>
  handleRequest(request, { params });

export const POST = (request: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) =>
  handleRequest(request, { params });

export const PUT = (request: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) =>
  handleRequest(request, { params });

export const PATCH = (request: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) =>
  handleRequest(request, { params });

export const DELETE = (request: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) =>
  handleRequest(request, { params });
