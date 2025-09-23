import { apiRequest } from './base';
import { ApiResponse, PaginatedResponse, Enrollment, CreateEnrollmentPayload, EnrollmentPaymentPayload, EnrollmentPaymentResponse } from '../types';

export const enrollmentsApi = {
  getUserEnrollment(userId: string): Promise<ApiResponse<Enrollment | null>> {
    return apiRequest(`v1/users/${userId}/enrollment`);
  },

  createForUser(userId: string, data: CreateEnrollmentPayload): Promise<ApiResponse<Enrollment>> {
    return apiRequest(`v1/users/${userId}/enrollment`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  payForUser(userId: string, data?: EnrollmentPaymentPayload): Promise<ApiResponse<EnrollmentPaymentResponse>> {
    return apiRequest(`v1/users/${userId}/enrollment/pay`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  },

  getAll(params?: { academic_session_id?: number; skill_id?: string; per_page?: number; }): Promise<ApiResponse<PaginatedResponse<Enrollment>>> {
    const query = new URLSearchParams();
    if (params?.academic_session_id) query.append('academic_session_id', params.academic_session_id.toString());
    if (params?.skill_id) query.append('skill_id', params.skill_id);
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    const q = query.toString();
    return apiRequest(`v1/enrollments${q ? `?${q}` : ''}`);
  },

  getById(enrollmentId: number): Promise<ApiResponse<Enrollment>> {
    return apiRequest(`v1/enrollments/${enrollmentId}`);
  },
};


