// * Server-Side Authentication Utilities
// * Handles session management, token validation, and user data retrieval
// * Used by Server Actions and middleware for secure authentication

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, AuthSession } from './types';
import { api } from './api';

// * Get the current user session from cookies
export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');
    const refreshToken = cookieStore.get('refresh_token');

    if (!sessionToken || !refreshToken) {
      return null;
    }

    // * TODO: Validate session token with backend
    // * For now, we'll return a mock session
    // * In production, this should verify the token's validity
    
    // * Mock user data - replace with actual API call
    const mockUser: User = {
      id: '1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      matricNumber: null,
      level: null,
      role: 'Admin',
      isActive: true,
      isSuperuser: true,
    };

    return {
      user: mockUser,
      accessToken: sessionToken.value,
      refreshToken: refreshToken.value,
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// * Get the current user (without sensitive token data)
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user || null;
}

// * Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

// * Check if user has a specific role
export async function hasRole(requiredRole: User['role']): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === requiredRole;
}

// * Check if user has any of the required roles
export async function hasAnyRole(requiredRoles: User['role'][]): Promise<boolean> {
  const user = await getCurrentUser();
  return user ? requiredRoles.includes(user.role) : false;
}

// * Require authentication - redirect if not authenticated
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/sign-in');
  }
  return user;
}

// * Require specific role - redirect if not authorized
export async function requireRole(requiredRole: User['role']): Promise<User> {
  const user = await requireAuth();
  if (user.role !== requiredRole) {
    redirect('/unauthorized');
  }
  return user;
}

// * Refresh the access token using refresh token
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token');

    if (!refreshToken) {
      return null;
    }

    const response = await api.refreshToken(refreshToken.value);
    
    if (response.status) {
      // * Update the session token cookie
      cookieStore.set('session_token', response.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      
      return response.data.accessToken;
    }
    
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

// * Clear all authentication cookies
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
  cookieStore.delete('refresh_token');
}

// * Validate and decode JWT token (placeholder for production)
export async function validateToken(token: string): Promise<User | null> {
  try {
    // * TODO: Implement proper JWT validation
    // * This should verify the token signature, expiration, and extract user data
    
    // * For now, return null to indicate invalid token
    return null;
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
}
