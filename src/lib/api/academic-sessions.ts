import { apiRequest } from './base';
import type { ApiResponse, AcademicSession } from '../types';

export const academicSessionsApi = {
  getAll(): Promise<ApiResponse<AcademicSession[]>> {
    return apiRequest('v1/academic-sessions');
  },

  create(sessionData: { name: string; starts_at?: string | null; ends_at?: string | null; }): Promise<ApiResponse<AcademicSession>> {
    return apiRequest('v1/academic-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  update(id: number, sessionData: { /* name?: string; */ starts_at?: string; ends_at?: string; }): Promise<ApiResponse<AcademicSession>> {
    // * Only send date fields; omit name from update payload per requirement
    const { /* name, */ starts_at, ends_at } = sessionData;
    return apiRequest(`v1/academic-sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ starts_at, ends_at }),
    });
  },

  start(id: number): Promise<ApiResponse<AcademicSession>> {
    return apiRequest(`v1/academic-sessions/${id}/start`, { method: 'POST' });
  },

  end(id: number): Promise<ApiResponse<AcademicSession>> {
    return apiRequest(`v1/academic-sessions/${id}/end`, { method: 'POST' });
  },
};


