// * Centralized API Service
// * Uses proxy pattern: Client → /api/* → Backend
// * No client-side token handling - all via httpOnly cookies
// * Follows the exact pattern from sd-frontend

import { 
  User, 
  Skill, 
  Group, 
  Activity, 
  Payment, 
  AttendanceRecord, 
  SystemConfig,
  CreateSkillPayload,
  CreateGroupPayload,
  CreateUserPayload,
  ApiResponse,
  PaginatedResponse 
} from './types';

// * API Error Class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// * Base API Client using proxy pattern
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // * All requests go through our proxy at /api/*
    const proxyUrl = `/api/${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(proxyUrl, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  // * Authentication Methods
  async signIn(username: string, password: string): Promise<ApiResponse<{
    user: User;
    // Note: accessToken and refreshToken are handled by proxy, not returned to client
  }>> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    return this.request('auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
  }

  async signOut(): Promise<void> {
    return this.request('auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> {
    return this.request('auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async signUp(userData: CreateUserPayload): Promise<ApiResponse<User>> {
    return this.request('core/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // * Skills Management
  async getSkills(): Promise<ApiResponse<Skill[]>> {
    return this.request('skills');
  }

  async createSkill(skillData: CreateSkillPayload): Promise<ApiResponse<Skill>> {
    return this.request('skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
  }

  async updateSkill(id: string, skillData: Partial<CreateSkillPayload>): Promise<ApiResponse<Skill>> {
    return this.request(`skills/${id}/edit`, {
      method: 'PATCH',
      body: JSON.stringify(skillData),
    });
  }

  async deleteSkill(id: string): Promise<void> {
    return this.request(`skills/${id}/delete`, {
      method: 'DELETE',
    });
  }

  async getSkillSettings(): Promise<ApiResponse<SystemConfig>> {
    return this.request('skills/admin/config');
  }

  async updateSkillSettings(settings: Partial<SystemConfig>): Promise<ApiResponse<SystemConfig>> {
    return this.request('skills/admin/config', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // * Groups Management
  async getGroups(): Promise<ApiResponse<Group[]>> {
    return this.request('group/list');
  }

  async createGroup(groupData: CreateGroupPayload): Promise<ApiResponse<Group>> {
    return this.request('group/create-group', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  async updateGroup(id: string, groupData: Partial<Group>): Promise<ApiResponse<Group>> {
    return this.request(`group/${id}/edit`, {
      method: 'PATCH',
      body: JSON.stringify(groupData),
    });
  }

  async deleteGroup(id: string): Promise<void> {
    return this.request(`grouping/groups/${id}`, {
      method: 'DELETE',
    });
  }

  // * User Management
  async getStudents(): Promise<ApiResponse<User[]>> {
    return this.request('core/students/all');
  }

  async getMentors(): Promise<ApiResponse<User[]>> {
    return this.request('core/mentors/all');
  }

  async updateUser(id: string, userData: Partial<CreateUserPayload>): Promise<ApiResponse<User>> {
    return this.request(`core/register/${id}/edit`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request(`core/register/${id}`, {
      method: 'DELETE',
    });
  }

  // * Payments
  async getPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request('payments');
  }

  // * System Configuration
  async getSystemConfig(): Promise<ApiResponse<SystemConfig>> {
    return this.request('skills/admin/config');
  }

  async updateSystemConfig(config: Partial<SystemConfig>): Promise<ApiResponse<SystemConfig>> {
    return this.request('skills/admin/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }
}

// * Export singleton instance
export const api = new ApiClient();
