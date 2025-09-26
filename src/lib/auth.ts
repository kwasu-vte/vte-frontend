// * Server-Side Authentication Utilities
// * Handles session management, token validation, and user data retrieval
// * Used by Server Actions and middleware for secure authentication

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, AuthSession } from './types';
import { authApi } from './api';

// * Normalize backend role casing to frontend canonical type
function normalizeUserRole(role: any): 'Admin' | 'Mentor' | 'Student' {
  const r = String(role || '').toLowerCase();
  if (r === 'admin' || r === 'superadmin') return 'Admin';
  if (r === 'mentor') return 'Mentor';
  return 'Student';
}

// * Get the current user session from cookies
export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');

    if (!sessionToken) {
      return null;
    }

    // * Validate session token with backend
    try {
      // * Use the regular getCurrentUser API call which properly handles cookies
      const response = await authApi.getCurrentUser();
      
      if (response.success && response.data) {
        const normalizedUser = { ...response.data, role: normalizeUserRole((response as any)?.data?.role) } as User;
        return {
          user: normalizedUser,
          access_token: sessionToken.value,
        };
      } else {
        // * Session invalid, try refresh
        console.log('Session validation failed, attempting refresh...');
        const newToken = await refreshAccessToken();
        if (newToken) {
          // * Retry getCurrentUser after refresh
          const retryResponse = await authApi.getCurrentUser();
          if (retryResponse.success && retryResponse.data) {
            const normalizedUser = { ...retryResponse.data, role: normalizeUserRole((retryResponse as any)?.data?.role) } as User;
            return {
              user: normalizedUser,
              access_token: newToken,
            };
          }
        }
        console.log('Session refresh failed, session is invalid');
        return null;
      }
    } catch (error) {
      // * API call failed, session might be invalid
      console.error('Failed to validate session:', error);
      
      // * Try refresh as last resort
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          const retryResponse = await authApi.getCurrentUser();
          if (retryResponse.success && retryResponse.data) {
            const normalizedUser = { ...retryResponse.data, role: normalizeUserRole((retryResponse as any)?.data?.role) } as User;
            return {
              user: normalizedUser,
              access_token: newToken,
            };
          }
        }
      } catch (refreshError) {
        console.error('Failed to refresh session:', refreshError);
      }
      
      return null;
    }
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
    redirect('/auth/sign_in');
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
    const response = await authApi.refresh();
    
    if (response.success) {
      // * Proxy updates cookie; return token for immediate use if needed
      const token = (response as any)?.data?.access_token ?? (response as any)?.access_token;
      return token || null;
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
