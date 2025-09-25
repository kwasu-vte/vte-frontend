import { apiRequest } from './base';
import { ApiResponse, PaginatedResponse, StudentProfile, Skill, CreateStudentProfilePayload } from '../types';

export const studentsApi = {
  list(): Promise<ApiResponse<PaginatedResponse<StudentProfile>>> {
    return apiRequest('v1/users/students');
  },

  searchStudents(params: { search?: string; per_page?: number; page?: number }): Promise<ApiResponse<PaginatedResponse<StudentProfile>>> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    if (params?.page) query.append('page', params.page.toString());
    const queryString = query.toString();
    return apiRequest(`v1/users/students${queryString ? `?${queryString}` : ''}`);
  },

  getProfile(userId: string): Promise<ApiResponse<StudentProfile>> {
    return apiRequest(`v1/users/${userId}/student`);
  },

  createProfile(userId: string, data: CreateStudentProfilePayload): Promise<ApiResponse<StudentProfile>> {
    return apiRequest(`v1/users/${userId}/student`, { method: 'POST', body: JSON.stringify(data) });
  },

  getAvailableSkills(userId: string): Promise<ApiResponse<Skill[]>> {
    return apiRequest(`v1/users/${userId}/student/available-skills`);
  },
};


