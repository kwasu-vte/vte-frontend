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
    sameSite: 'lax',
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
    sameSite: 'lax',
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
  
  // * Copy safe headers from client request (and Authorization if provided)
  const safeHeaders = ['Content-Type', 'Accept', 'Authorization'];
  for (const headerName of safeHeaders) {
    if (request.headers.has(headerName)) {
      requestHeaders.set(headerName, request.headers.get(headerName)!);
    }
  }

  // * Get session token from secure cookie
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token');
  console.debug(`[BFF Proxy ${traceId}] session_token cookie present: ${sessionToken ? 'yes' : 'no'}`);

  // * Handle Cookie header forwarding for server-to-server requests
  if (request.headers.has('Cookie')) {
    // * Forward Cookie header from client request
    requestHeaders.set('Cookie', request.headers.get('Cookie')!);
    console.debug(`[BFF Proxy ${traceId}] Forwarding Cookie header from client.`);
  } else if (sessionToken) {
    // * Set session cookie if no Cookie header present
    requestHeaders.set('Cookie', `session_token=${sessionToken.value}`);
    console.debug(`[BFF Proxy ${traceId}] Setting session cookie from secure storage.`);
  }

  // * Add Authorization header from cookie only if not already provided
  if (!requestHeaders.has('Authorization') && sessionToken) {
    requestHeaders.set('Authorization', `Bearer ${sessionToken.value}`);
    console.debug(`[BFF Proxy ${traceId}] Attached Bearer token from cookie.`);
  }

  // * Debug auth header presence and origin
  if (requestHeaders.has('Authorization')) {
    const authPreview = (requestHeaders.get('Authorization') || '').slice(0, 20);
    console.debug(`[BFF Proxy ${traceId}] Authorization header present: ${authPreview}...`);
  } else {
    console.debug(`[BFF Proxy ${traceId}] No Authorization header present on upstream request.`);
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
    // * Required by Node.js fetch when sending a ReadableStream body
    // * Prevents: RequestInit: duplex option is required when sending a body
    (fetchOptions as any).duplex = 'half';
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
      const candidateKeys = [
        'data.access_token',
        'access_token',
        'data.token',
        'token',
        'data.access?.token',
        'access?.token'
      ];
      // Resolve token across common shapes
      const token = json?.data?.access_token
        ?? json?.access_token
        ?? json?.data?.token
        ?? json?.token
        ?? json?.data?.access?.token
        ?? json?.access?.token
        ?? null;
      const expiresIn = Number(
        json?.data?.expires_in
        ?? json?.expires_in
        ?? json?.data?.access?.expires_in
        ?? 60 * 60 * 24 * 30
      );
      const tokenPreview = typeof token === 'string' ? `${token.slice(0, 8)}...${token.slice(-4)}` : 'none';
      console.info(`[BFF Proxy ${traceId}] Login response keys: ${json ? Object.keys(json).join(',') : 'null'}`);
      console.info(`[BFF Proxy ${traceId}] Token detection → present: ${!!token}, preview: ${tokenPreview}`);
      if (apiResponse.ok && token) {
        await setSessionCookie(token, isNaN(expiresIn) ? 60 * 60 * 24 * 30 : expiresIn);
        console.info(`[BFF Proxy ${traceId}] Login successful. Session cookie set.`);
      } else {
        console.warn(`[BFF Proxy ${traceId}] Login success=${apiResponse.ok} but no token extracted; cannot set session cookie.`);
      }
      // Echo back minimal safe data
      return NextResponse.json({ success: apiResponse.ok, data: { access_token: token } }, { status: apiResponse.status, headers: responseHeaders });
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
    
    // * Handle 204 No Content responses
    if (apiResponse.status === 204) {
      return new NextResponse(null, {
        status: 204,
        headers: responseHeaders,
      });
    }
    
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
