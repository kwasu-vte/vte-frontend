import { apiRequest } from './base';
import type { 
  ApiResponse, 
  Skill, 
  CreateSkillPayload, 
  UpdateSkillPayload, 
  SkillDateRange, 
  SkillDateRangePayload, 
  SkillGroup, 
  AutoAssignPayload, 
  AutoAssignResponse 
} from '../types';

export const skillsApi = {
  getAll(): Promise<ApiResponse<Skill[]>> {
    return apiRequest('v1/skills');
  },

  getById(id: string): Promise<ApiResponse<Skill>> {
    return apiRequest(`v1/skills/${id}`);
  },

  create(data: CreateSkillPayload): Promise<ApiResponse<Skill>> {
    return apiRequest('v1/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateSkillPayload): Promise<ApiResponse<Skill>> {
    return apiRequest(`v1/skills/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return apiRequest(`v1/skills/${id}`, {
      method: 'DELETE',
    });
  },

  getDateRange(id: string, academicSession?: string): Promise<ApiResponse<SkillDateRange | null>> {
    const query = academicSession ? `?academic-session=${academicSession}` : '';
    return apiRequest(`v1/skills/${id}/date-range${query}`);
  },

  updateDateRange(id: string, dateRange: SkillDateRangePayload): Promise<ApiResponse<SkillDateRange>> {
    return apiRequest(`v1/skills/${id}/date-range`, {
      method: 'POST',
      body: JSON.stringify(dateRange),
    });
  },

  getGroupsBySkill(skillId: string, params?: { academic_session_id?: number; include_full?: boolean }): Promise<ApiResponse<SkillGroup[]>> {
    const query = new URLSearchParams();
    if (params?.academic_session_id) query.append('academic_session_id', params.academic_session_id.toString());
    if (params?.include_full !== undefined) query.append('include_full', params.include_full.toString());
    
    const queryString = query.toString();
    return apiRequest(`v1/skills/${skillId}/groups${queryString ? `?${queryString}` : ''}`);
  },

  autoAssignStudentsToGroups(skillId: string, data: AutoAssignPayload): Promise<ApiResponse<AutoAssignResponse>> {
    return apiRequest(`v1/skills/${skillId}/groups/auto-assign`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};


