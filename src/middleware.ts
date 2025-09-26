// * Next.js Middleware
// * Protects all authenticated routes and implements role-based access control
// * Checks for session_token cookie and validates user permissions

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// * Routes that require authentication
const protectedRoutes = [
  '/admin',
  '/mentor', 
  '/student',
  '/dashboard',
  '/settings',
  '/profile',
];

// * Routes that are always public
const publicRoutes = [
  '/auth',
  '/api',
];

// * Routes that handle their own authentication (not checked by middleware)
const selfAuthenticatingRoutes = [
  '/',
];

// * Role-based route mapping
const roleRoutes = {
  admin: ['/admin'],
  mentor: ['/mentor'],
  student: ['/student'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // * Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // * Check if the route is always public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // * Check if the route handles its own authentication
  const isSelfAuthenticatingRoute = selfAuthenticatingRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // * Skip middleware for self-authenticating routes
  if (isSelfAuthenticatingRoute) {
    return NextResponse.next();
  }
  
  // * If it's a protected route, check for authentication
  if (isProtectedRoute) {
    const sessionToken = request.cookies.get('session_token');
    if (!sessionToken) {
      const loginUrl = new URL('/auth/sign_in', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // * Validate session and enforce RBAC via /api/v1/users/auth/me
    try {
      const bearer = `Bearer ${sessionToken.value}`;
      const meRes = await fetch(`${request.nextUrl.origin}/api/v1/users/auth/me`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': bearer,
        },
      });
      if (!meRes.ok) {
        const loginUrl = new URL('/auth/sign_in', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      const meJson = await meRes.json();
      const role: string = String(meJson?.data?.role || '').toLowerCase();

      // * RBAC: ensure path matches role root
      if (pathname.startsWith('/admin') && role !== 'admin' && role !== 'superadmin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (pathname.startsWith('/mentor') && role !== 'mentor') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (pathname.startsWith('/student') && role !== 'student') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (_) {
      const loginUrl = new URL('/auth/sign_in', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }
  
  // * Public routes and API routes are always accessible
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
