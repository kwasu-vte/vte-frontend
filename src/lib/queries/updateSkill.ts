import { instance } from "../api";

export interface UpdateSkillPayload {
  code?: string;
  title?: string;
  description?: string;
  enrollment_deadline?: string;
  price?: string;
  available_level_ids: string[];
  capacity: number;
}

export interface LevelId {
  level: string;
}

export interface UpdateSkillResponse {
  id: string;
  code: string;
  title: string;
  description: string;
  enrollment_deadline: string;
  price: string;
  available_levels: LevelId;
}

export const updateSkill = async (
  id: string,
  data: UpdateSkillPayload
): Promise<UpdateSkillResponse> => {
  const response = await instance.patch<UpdateSkillResponse>(
    `/api/skills/${id}/edit/`,
    data
  );
  return response.data;
};
