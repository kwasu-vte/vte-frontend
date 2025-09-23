import { apiRequest } from './base';
import { ApiResponse, PaginatedResponse, SkillGroup, CreateSkillGroupPayload, AssignStudentPayload, GroupStatistics } from '../types';

export const skillGroupsApi = {
  list(params?: { skill_id?: number; academic_session_id?: number; has_capacity?: boolean; per_page?: number; }): Promise<ApiResponse<PaginatedResponse<SkillGroup>>> {
    const query = new URLSearchParams();
    if (params?.skill_id) query.append('skill_id', params.skill_id.toString());
    if (params?.academic_session_id) query.append('academic_session_id', params.academic_session_id.toString());
    if (params?.has_capacity !== undefined) query.append('has_capacity', params.has_capacity.toString());
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    const q = query.toString();
    return apiRequest(`v1/skill-groups${q ? `?${q}` : ''}`);
  },

  create(data: CreateSkillGroupPayload): Promise<ApiResponse<SkillGroup>> {
    return apiRequest('v1/skill-groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById(id: number): Promise<ApiResponse<SkillGroup>> {
    return apiRequest(`v1/skill-groups/${id}`);
  },

  delete(id: number): Promise<void> {
    return apiRequest(`v1/skill-groups/${id}`, { method: 'DELETE' });
  },

  assignStudent(groupId: number, data: AssignStudentPayload): Promise<ApiResponse<{ group: SkillGroup; enrollment_id: string }>> {
    return apiRequest(`v1/skill-groups/${groupId}/assign-student`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  removeStudent(groupId: number, enrollmentId: number): Promise<ApiResponse<{ group: SkillGroup; enrollment_id: string }>> {
    return apiRequest(`v1/skill-groups/${groupId}/remove-student?enrollment_id=${enrollmentId}`, {
      method: 'DELETE',
    });
  },

  getStatistics(params?: { skill_id?: number; academic_session_id?: number; }): Promise<ApiResponse<GroupStatistics>> {
    const query = new URLSearchParams();
    if (params?.skill_id) query.append('skill_id', params.skill_id.toString());
    if (params?.academic_session_id) query.append('academic_session_id', params.academic_session_id.toString());
    const q = query.toString();
    return apiRequest(`v1/skill-groups/statistics/overview${q ? `?${q}` : ''}`);
  },
};


