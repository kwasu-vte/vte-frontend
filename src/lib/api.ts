// * Centralized API Service
// * Uses proxy pattern: Client → /api/* → Backend
// * No client-side token handling - all via httpOnly cookies
// * Follows OpenAPI specification exactly

import { 
  User, 
  Skill, 
  Group, 
  Activity, 
  Payment, 
  AttendanceRecord, 
  SystemConfig,
  AcademicSession,
  StudentProfile,
  SkillDateRange,
  CreateSkillPayload,
  UpdateSkillPayload,
  SkillDateRangePayload,
  CreateGroupPayload,
  CreateUserPayload,
  CreateStudentProfilePayload,
  LoginPayload,
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
  async signIn(loginData: LoginPayload): Promise<ApiResponse<{
    user: User;
    // Note: access_token and refresh_token are handled by proxy, not returned to client
  }>> {
    return this.request('v1/users/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  async signOut(): Promise<void> {
    return this.request('v1/users/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(): Promise<ApiResponse<{ access_token: string }>> {
    return this.request('v1/users/auth/refresh', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('v1/users/auth/me');
  }

  async signUp(userData: CreateUserPayload): Promise<ApiResponse<User>> {
    return this.request('v1/users/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // * Skills Management
  async getSkills(): Promise<ApiResponse<Skill[]>> {
    return this.request('v1/skills');
  }

  async getSkill(id: string): Promise<ApiResponse<Skill>> {
    return this.request(`v1/skills/${id}`);
  }

  async createSkill(skillData: CreateSkillPayload): Promise<ApiResponse<Skill>> {
    return this.request('v1/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
  }

  async updateSkill(id: string, skillData: UpdateSkillPayload): Promise<ApiResponse<Skill>> {
    return this.request(`v1/skills/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(skillData),
    });
  }

  async deleteSkill(id: string): Promise<void> {
    return this.request(`v1/skills/${id}`, {
      method: 'DELETE',
    });
  }

  // * Skill Date Range Management
  async getSkillDateRange(id: string, academicSession?: string): Promise<ApiResponse<SkillDateRange | null>> {
    const query = academicSession ? `?academic-session=${academicSession}` : '';
    return this.request(`v1/skills/${id}/date-range${query}`);
  }

  async updateSkillDateRange(id: string, dateRange: SkillDateRangePayload): Promise<ApiResponse<SkillDateRange>> {
    return this.request(`v1/skills/${id}/date-range`, {
      method: 'POST',
      body: JSON.stringify(dateRange),
    });
  }

  // * Academic Sessions Management
  async getAcademicSessions(): Promise<ApiResponse<AcademicSession[]>> {
    return this.request('v1/academic-sessions');
  }

  async createAcademicSession(sessionData: {
    name: string;
    starts_at?: string | null;
    ends_at?: string | null;
  }): Promise<ApiResponse<AcademicSession>> {
    return this.request('v1/academic-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateAcademicSession(id: number, sessionData: {
    name?: string;
    starts_at?: string;
    ends_at?: string;
  }): Promise<ApiResponse<AcademicSession>> {
    return this.request(`v1/academic-sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(sessionData),
    });
  }

  async startAcademicSession(id: number): Promise<ApiResponse<AcademicSession>> {
    return this.request(`v1/academic-sessions/${id}/start`, {
      method: 'POST',
    });
  }

  async endAcademicSession(id: number): Promise<ApiResponse<AcademicSession>> {
    return this.request(`v1/academic-sessions/${id}/end`, {
      method: 'POST',
    });
  }

  // * Student Profile Management
  async createStudentProfile(userId: string, profileData: CreateStudentProfilePayload): Promise<ApiResponse<StudentProfile>> {
    return this.request(`v1/users/${userId}/student`, {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  // * Groups Management (Legacy - keeping for backward compatibility)
  async getGroups(): Promise<ApiResponse<Group[]>> {
    return this.request('v1/groups');
  }

  async createGroup(groupData: CreateGroupPayload): Promise<ApiResponse<Group>> {
    return this.request('v1/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  async updateGroup(id: string, groupData: Partial<Group>): Promise<ApiResponse<Group>> {
    return this.request(`v1/groups/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(groupData),
    });
  }

  async deleteGroup(id: string): Promise<void> {
    return this.request(`v1/groups/${id}`, {
      method: 'DELETE',
    });
  }

  // * User Management (Legacy - keeping for backward compatibility)
  async getStudents(): Promise<ApiResponse<User[]>> {
    return this.request('v1/users/students');
  }

  async getMentors(): Promise<ApiResponse<User[]>> {
    return this.request('v1/users/mentors');
  }

  async updateUser(id: string, userData: Partial<CreateUserPayload>): Promise<ApiResponse<User>> {
    return this.request(`v1/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request(`v1/users/${id}`, {
      method: 'DELETE',
    });
  }

  // * Payments (Legacy - keeping for backward compatibility)
  async getPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request('v1/payments');
  }

  // * System Configuration (Legacy - keeping for backward compatibility)
  async getSystemConfig(): Promise<ApiResponse<SystemConfig>> {
    return this.request('v1/system/config');
  }

  async updateSystemConfig(config: Partial<SystemConfig>): Promise<ApiResponse<SystemConfig>> {
    return this.request('v1/system/config', {
      method: 'PATCH',
      body: JSON.stringify(config),
    });
  }

  // * Payment Methods
  async makePayment({ course, specialization }: { course: string, specialization: string | null }): Promise<ApiResponse<{ authorization_url: string }>> {
    return this.request('v1/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({ course, specialization }),
    });
  }

  async activateCourse({ reference }: { reference: string }): Promise<ApiResponse<{ msg: string }>> {
    return this.request(`v1/payments/verify?reference=${reference}`, {
      method: 'GET',
    });
  }
}

// * Export singleton instance
export const api = new ApiClient();
