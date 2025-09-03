// * Next.js Middleware
// * Protects all authenticated routes
// * Checks for session_token cookie

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
  '/',
  '/api/auth',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // * Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // * Check if the route is always public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // * If it's a protected route, check for authentication
  if (isProtectedRoute) {
    const sessionToken = request.cookies.get('session_token');
    
    // * No session token found, redirect to login
    if (!sessionToken) {
      const loginUrl = new URL('/auth/sign-in', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // * TODO: Validate session token with backend
    // * For now, we'll just check if it exists
    // * In production, this should verify the token's validity
    
    // * Continue to the protected route
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
