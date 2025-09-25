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
  PaginatedResponse,
  // * New API Types
  Enrollment,
  CreateEnrollmentPayload,
  EnrollmentPaymentPayload,
  EnrollmentPaymentResponse,
  GroupQrCode,
  GroupQrCodeBatch,
  GenerateGroupQrCodePayload,
  BulkGenerateQrCodePayload,
  QrScanHistory,
  AttendanceReport,
  SkillGroup,
  CreateSkillGroupPayload,
  AssignStudentPayload,
  GroupStatistics,
  AutoAssignPayload,
  AutoAssignResponse,
  MentorProfile,
  CreateMentorProfilePayload,
  AssignSkillPayload,
  RemoveSkillPayload,
  SkillMentor,
  ProcessQrScanPayload,
  QrScanResponse
} from './types';

// * API Error Class
export class ApiError extends Error {
  public status: number;
  public data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
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
    
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };

    const config: RequestInit = {
      headers: baseHeaders,
      ...options,
    };

    // * For server-side requests, we need to manually forward cookies
    if (isServer) {
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session_token');
        const headers = config.headers as Record<string, string>;
        if (sessionToken && !('Authorization' in headers)) {
          headers['Cookie'] = `session_token=${sessionToken.value}`;
          config.headers = headers;
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

  // * Skill Groups Management (New API)
  async getSkillGroups(params?: { 
    skill_id?: number; 
    academic_session_id?: number; 
    has_capacity?: boolean; 
    per_page?: number 
  }): Promise<ApiResponse<PaginatedResponse<SkillGroup>>> {
    const query = new URLSearchParams();
    if (params?.skill_id) query.append('skill_id', params.skill_id.toString());
    if (params?.academic_session_id) query.append('academic_session_id', params.academic_session_id.toString());
    if (params?.has_capacity !== undefined) query.append('has_capacity', params.has_capacity.toString());
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    
    const queryString = query.toString();
    return this.request(`v1/skill-groups${queryString ? `?${queryString}` : ''}`);
  }

  async createSkillGroup(groupData: CreateSkillGroupPayload): Promise<ApiResponse<SkillGroup>> {
    return this.request('v1/skill-groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  async getSkillGroup(id: number): Promise<ApiResponse<SkillGroup>> {
    return this.request(`v1/skill-groups/${id}`);
  }

  async deleteSkillGroup(id: number): Promise<void> {
    return this.request(`v1/skill-groups/${id}`, {
      method: 'DELETE',
    });
  }

  async assignStudentToGroup(groupId: number, data: AssignStudentPayload): Promise<ApiResponse<{ group: SkillGroup; enrollment_id: string }>> {
    return this.request(`v1/skill-groups/${groupId}/assign-student`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeStudentFromGroup(groupId: number, enrollmentId: number): Promise<ApiResponse<{ group: SkillGroup; enrollment_id: string }>> {
    return this.request(`v1/skill-groups/${groupId}/remove-student?enrollment_id=${enrollmentId}`, {
      method: 'DELETE',
    });
  }

  async getGroupStatistics(params?: { skill_id?: number; academic_session_id?: number }): Promise<ApiResponse<GroupStatistics>> {
    const query = new URLSearchParams();
    if (params?.skill_id) query.append('skill_id', params.skill_id.toString());
    if (params?.academic_session_id) query.append('academic_session_id', params.academic_session_id.toString());
    
    const queryString = query.toString();
    return this.request(`v1/skill-groups/statistics/overview${queryString ? `?${queryString}` : ''}`);
  }

  // * Student Management
  async getStudents(params?: { search?: string; per_page?: number; page?: number }): Promise<ApiResponse<PaginatedResponse<StudentProfile>>> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    if (params?.page) query.append('page', params.page.toString());
    const queryString = query.toString();
    return this.request(`v1/users/students${queryString ? `?${queryString}` : ''}`);
  }

  async getStudentProfile(userId: string): Promise<ApiResponse<StudentProfile>> {
    return this.request(`v1/users/${userId}/student`);
  }

  async getAvailableSkills(userId: string): Promise<ApiResponse<Skill[]>> {
    return this.request(`v1/users/${userId}/student/available-skills`);
  }

  // * Enrollment Management
  async getEnrollment(userId: string): Promise<ApiResponse<Enrollment | null>> {
    return this.request(`v1/users/${userId}/enrollment`);
  }

  async createEnrollment(userId: string, data: CreateEnrollmentPayload): Promise<ApiResponse<Enrollment>> {
    return this.request(`v1/users/${userId}/enrollment`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async payForEnrollment(userId: string, data?: EnrollmentPaymentPayload): Promise<ApiResponse<EnrollmentPaymentResponse>> {
    return this.request(`v1/users/${userId}/enrollment/pay`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  async getAllEnrollments(params?: { 
    academic_session_id?: number; 
    skill_id?: string; 
    per_page?: number 
  }): Promise<ApiResponse<PaginatedResponse<Enrollment>>> {
    const query = new URLSearchParams();
    if (params?.academic_session_id) query.append('academic_session_id', params.academic_session_id.toString());
    if (params?.skill_id) query.append('skill_id', params.skill_id);
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    
    const queryString = query.toString();
    return this.request(`v1/enrollments${queryString ? `?${queryString}` : ''}`);
  }

  async getEnrollmentById(enrollmentId: number): Promise<ApiResponse<Enrollment>> {
    return this.request(`v1/enrollments/${enrollmentId}`);
  }

  // * QR Code Management
  async generateGroupQrCodes(groupId: number, data: GenerateGroupQrCodePayload): Promise<ApiResponse<GroupQrCodeBatch>> {
    return this.request(`v1/qr-codes/groups/${groupId}/generate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async bulkGenerateQrCodes(data: BulkGenerateQrCodePayload): Promise<ApiResponse<{ estimated_completion: string }>> {
    return this.request('v1/qr-codes/bulk-generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getQrScanHistory(qrToken: string, perPage?: number): Promise<ApiResponse<QrScanHistory>> {
    const query = perPage ? `?per_page=${perPage}` : '';
    return this.request(`v1/qr-codes/scan-history/${qrToken}${query}`);
  }

  async getGroupAttendanceReport(groupId: number): Promise<ApiResponse<AttendanceReport>> {
    return this.request(`v1/qr-codes/groups/${groupId}/attendance-report`);
  }

  async listGroupQrCodes(groupId: number, params?: { 
    per_page?: number; 
    status?: 'active' | 'expired' | 'all' 
  }): Promise<ApiResponse<PaginatedResponse<GroupQrCode>>> {
    const query = new URLSearchParams();
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    if (params?.status) query.append('status', params.status);
    
    const queryString = query.toString();
    return this.request(`v1/qr-codes/groups/${groupId}/list${queryString ? `?${queryString}` : ''}`);
  }

  // * Attendance Scanning
  async processQrScan(data: ProcessQrScanPayload): Promise<ApiResponse<QrScanResponse>> {
    return this.request('v1/attendance/scan', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // * Mentor Management
  async getMentors(params?: { 
    search?: string; 
    specialization?: string; 
    is_available?: string; 
    is_active?: string; 
    per_page?: string 
  }): Promise<ApiResponse<MentorProfile[]>> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.specialization) query.append('specialization', params.specialization);
    if (params?.is_available) query.append('is_available', params.is_available);
    if (params?.is_active) query.append('is_active', params.is_active);
    if (params?.per_page) query.append('per_page', params.per_page);
    
    const queryString = query.toString();
    return this.request(`v1/mentors${queryString ? `?${queryString}` : ''}`);
  }

  async createMentor(data: CreateMentorProfilePayload): Promise<ApiResponse<{ user: string; profile: MentorProfile }>> {
    return this.request('v1/mentors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async assignSkillToMentor(mentorProfileId: number, data: AssignSkillPayload): Promise<ApiResponse<SkillMentor>> {
    return this.request(`v1/mentors/${mentorProfileId}/assign-skill`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeSkillFromMentor(mentorProfileId: number, data: RemoveSkillPayload): Promise<ApiResponse<string>> {
    return this.request(`v1/mentors/${mentorProfileId}/remove-skill`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMentorProfile(userId: string): Promise<ApiResponse<MentorProfile>> {
    return this.request(`v1/${userId}/mentors`);
  }

  async getMentorAssignedSkills(userId: string): Promise<ApiResponse<Skill[]>> {
    return this.request(`v1/${userId}/mentors/get-assigned-skills`);
  }

  async getMentorSkillGroups(userId: string): Promise<ApiResponse<SkillGroup[]>> {
    return this.request(`v1/${userId}/mentors/get-skill-groups`);
  }

  // * Skills Extended Management
  async getGroupsBySkill(skillId: string, params?: { 
    academic_session_id?: number; 
    include_full?: boolean 
  }): Promise<ApiResponse<SkillGroup[]>> {
    const query = new URLSearchParams();
    if (params?.academic_session_id) query.append('academic_session_id', params.academic_session_id.toString());
    if (params?.include_full !== undefined) query.append('include_full', params.include_full.toString());
    
    const queryString = query.toString();
    return this.request(`v1/skills/${skillId}/groups${queryString ? `?${queryString}` : ''}`);
  }

  async autoAssignStudentsToGroups(skillId: string, data: AutoAssignPayload): Promise<ApiResponse<AutoAssignResponse>> {
    return this.request(`v1/skills/${skillId}/groups/auto-assign`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// * Export singleton instance
export const api = new ApiClient();

// * Convenience exports for specific API groups
export const studentsApi = {
  getStudents: (params?: { search?: string; per_page?: number; page?: number }) => api.getStudents(params),
  getStudentProfile: (userId: string) => api.getStudentProfile(userId),
  getAvailableSkills: (userId: string) => api.getAvailableSkills(userId),
  createStudentProfile: (userId: string, profileData: CreateStudentProfilePayload) => api.createStudentProfile(userId, profileData),
};

export const enrollmentsApi = {
  getEnrollment: (userId: string) => api.getEnrollment(userId),
  createEnrollment: (userId: string, data: CreateEnrollmentPayload) => api.createEnrollment(userId, data),
  payForEnrollment: (userId: string, data?: EnrollmentPaymentPayload) => api.payForEnrollment(userId, data),
  getAllEnrollments: (params?: { academic_session_id?: number; skill_id?: string; per_page?: number }) => api.getAllEnrollments(params),
  getEnrollmentById: (enrollmentId: number) => api.getEnrollmentById(enrollmentId),
};
