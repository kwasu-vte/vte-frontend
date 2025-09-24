import { apiRequest } from './base';
import type { ApiResponse, Skill } from '../types';

export const skillsApi = {
  getAll(): Promise<ApiResponse<Skill[]>> {
    return apiRequest('v1/skills');
  },
};


