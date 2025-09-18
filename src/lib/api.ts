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
  CreateAttendanceRecordPayload,
  UpdateAttendanceRecordPayload,
  CreatePaymentPayload,
  UpdatePaymentPayload,
  UpdateSystemConfigPayload,
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
    const isServer = typeof window === 'undefined';
    
    // * For server-side requests, we need to use absolute URLs
    const origin = isServer
      ? (process.env.NEXT_PUBLIC_APP_URL
          || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'))
      : '';
    const url = isServer ? `${origin}${proxyUrl}` : proxyUrl;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // * For server-side requests, we need to manually forward cookies
    if (isServer) {
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session_token');
        
        if (sessionToken && !config.headers?.['Authorization']) {
          config.headers = {
            ...config.headers,
            'Cookie': `session_token=${sessionToken.value}`,
          };
        }
      } catch (error) {
        // * If we can't get cookies, continue without them
        console.warn('Failed to get cookies for server-side request:', error);
      }
    }

    try {
      const response = await fetch(url, config);
      
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
    try {
      // Spec says GET
      return await this.request('v1/users/auth/me');
    } catch (err) {
      if (err instanceof ApiError && err.status === 405) {
        // Fallback to POST if server is configured that way
        return this.request('v1/users/auth/me', { method: 'POST' });
      }
      throw err;
    }
  }

  // * Get current user using an explicit Bearer token (for same-request flows after login)
  async getCurrentUserWithToken(token: string): Promise<ApiResponse<User>> {
    try {
      return await this.request('v1/users/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 405) {
        return this.request('v1/users/auth/me', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      throw err;
    }
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

  async getUsers(params?: { role?: string }): Promise<ApiResponse<User[]>> {
    const query = params?.role ? `?role=${params.role}` : '';
    return this.request(`v1/users${query}`);
  }

  async createUser(userData: CreateUserPayload): Promise<ApiResponse<User>> {
    return this.request('v1/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
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

  // * Attendance Management
  async getAttendanceRecords(): Promise<ApiResponse<AttendanceRecord[]>> {
    return this.request('v1/attendance');
  }

  async createAttendanceRecord(data: CreateAttendanceRecordPayload): Promise<ApiResponse<AttendanceRecord>> {
    return this.request('v1/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAttendanceRecord(id: string, data: UpdateAttendanceRecordPayload): Promise<ApiResponse<AttendanceRecord>> {
    return this.request(`v1/attendance/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAttendanceRecord(id: string): Promise<void> {
    return this.request(`v1/attendance/${id}`, {
      method: 'DELETE',
    });
  }

  // * Skills Management
  async getSkills(): Promise<ApiResponse<Skill[]>> {
    return this.request('v1/skills');
  }

  async getSkill(id: string): Promise<ApiResponse<Skill>> {
    return this.request(`v1/skills/${id}`);
  }

  async createSkill(data: CreateSkillPayload): Promise<ApiResponse<Skill>> {
    return this.request('v1/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSkill(id: string, data: UpdateSkillPayload): Promise<ApiResponse<Skill>> {
    return this.request(`v1/skills/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSkill(id: string): Promise<void> {
    return this.request(`v1/skills/${id}`, {
      method: 'DELETE',
    });
  }

  // * Payment Management
  async createPayment(data: CreatePaymentPayload): Promise<ApiResponse<Payment>> {
    return this.request('v1/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePayment(id: string, data: UpdatePaymentPayload): Promise<ApiResponse<Payment>> {
    return this.request(`v1/payments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deletePayment(id: string): Promise<void> {
    return this.request(`v1/payments/${id}`, {
      method: 'DELETE',
    });
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
