import { apiRequest } from './base';
import { ApiResponse, MentorProfile, Skill, SkillGroup, CreateMentorProfilePayload, AssignSkillPayload, SkillMentor, RemoveSkillPayload } from '../types';

export const mentorsApi = {
  list(params?: { search?: string; specialization?: string; is_available?: string; is_active?: string; per_page?: string; }): Promise<ApiResponse<MentorProfile[]>> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.specialization) query.append('specialization', params.specialization);
    if (params?.is_available) query.append('is_available', params.is_available);
    if (params?.is_active) query.append('is_active', params.is_active);
    if (params?.per_page) query.append('per_page', params.per_page);
    const q = query.toString();
    return apiRequest(`v1/mentors${q ? `?${q}` : ''}`);
  },

  create(data: CreateMentorProfilePayload): Promise<ApiResponse<{ user: string; profile: MentorProfile }>> {
    return apiRequest('v1/mentors', { method: 'POST', body: JSON.stringify(data) });
  },

  assignSkill(mentorProfileId: number, data: AssignSkillPayload): Promise<ApiResponse<SkillMentor>> {
    return apiRequest(`v1/mentors/${mentorProfileId}/assign-skill`, { method: 'POST', body: JSON.stringify(data) });
  },

  removeSkill(mentorProfileId: number, data: RemoveSkillPayload): Promise<ApiResponse<string>> {
    return apiRequest(`v1/mentors/${mentorProfileId}/remove-skill`, { method: 'POST', body: JSON.stringify(data) });
  },

  getProfile(userId: string): Promise<ApiResponse<MentorProfile>> {
    return apiRequest(`v1/${userId}/mentors`);
  },

  getAssignedSkills(userId: string): Promise<ApiResponse<Skill[]>> {
    return apiRequest(`v1/${userId}/mentors/get-assigned-skills`);
  },

  getSkillGroups(userId: string): Promise<ApiResponse<SkillGroup[]>> {
    return apiRequest(`v1/${userId}/mentors/get-skill-groups`);
  },
};


