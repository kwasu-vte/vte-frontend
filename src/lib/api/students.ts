import { apiRequest } from './base';
import { ApiResponse, PaginatedResponse, StudentProfile, Skill, CreateStudentProfilePayload } from '../types';

export const studentsApi = {
  list(): Promise<ApiResponse<PaginatedResponse<StudentProfile>>> {
    return apiRequest('v1/users/students');
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


