import { apiRequest } from './base';
import type { ApiResponse, User, LoginPayload, CreateUserPayload } from '../types';

export const authApi = {
  login: (credentials: LoginPayload): Promise<ApiResponse<{ user: User }>> => {
    return apiRequest('v1/users/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: (): Promise<void> => {
    return apiRequest('v1/users/auth/logout', {
      method: 'POST',
    });
  },

  refresh: async (): Promise<ApiResponse<{ access_token: string }>> => {
    // * Get current access token from cookie for refresh calls
    if (typeof window === 'undefined') {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const accessToken = cookieStore.get('session_token');
      
      if (!accessToken) {
        throw new Error('No access token available for refresh');
      }
      
      return apiRequest('v1/users/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
        },
      });
    } else {
      // * Client-side: let the proxy handle access token from cookie
      return apiRequest('v1/users/auth/refresh', {
        method: 'POST',
      });
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    // Spec says GET only
    return await apiRequest('v1/users/auth/me');
  },

  register: (userData: CreateUserPayload): Promise<ApiResponse<User>> => {
    return apiRequest('v1/users/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};
