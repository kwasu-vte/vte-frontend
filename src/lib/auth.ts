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

    if (!sessionToken) {
      return null;
    }

    // * Validate session token with backend by calling getCurrentUser
    try {
      const response = await api.getCurrentUser();
      
      if (response.success && response.data) {
        return {
          user: response.data,
          access_token: sessionToken.value,
          refresh_token: refreshToken.value,
        };
      } else {
        // * Token is invalid, try to refresh if refresh token exists
        if (refreshToken) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            // * Retry getCurrentUser with new token
            const retryResponse = await api.getCurrentUser();
            if (retryResponse.success && retryResponse.data) {
              return {
                user: retryResponse.data,
                access_token: newToken,
              };
            }
          }
        }
        return null;
      }
    } catch (error) {
      // * API call failed, token might be invalid
      console.error('Failed to validate session token:', error);
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
    const response = await api.refreshToken();
    
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
