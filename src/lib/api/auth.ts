import { apiRequest } from './base';
import type { ApiResponse, User, LoginPayload, CreateUserPayload } from '../types';

export const authApi = {
  login(credentials: LoginPayload): Promise<ApiResponse<{ user: User }>> {
    return apiRequest('v1/users/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout(): Promise<void> {
    return apiRequest('v1/users/auth/logout', {
      method: 'POST',
    });
  },

  refresh(): Promise<ApiResponse<{ access_token: string }>> {
    return apiRequest('v1/users/auth/refresh', {
      method: 'POST',
    });
  },

  getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      // Spec says GET
      return apiRequest('v1/users/auth/me');
    } catch (err) {
      if (err instanceof Error && err.message.includes('405')) {
        // Fallback to POST if server is configured that way
        return apiRequest('v1/users/auth/me', { method: 'POST' });
      }
      throw err;
    }
  },

  register(userData: CreateUserPayload): Promise<ApiResponse<User>> {
    return apiRequest('v1/users/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};
