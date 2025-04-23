import { instance } from "../api";

export interface CreateSkillPayload {
  code: string;
  title: string;
  description: string;
  enrollment_deadline: string;
  price: string;
  available_level_ids: string[];
  capacity: number;
}

export interface ResponseData {
  id: string;
  code: string;
  title: string;
  description: string;
  enrollment_deadline: string;
  price: string;
  available_levels: [];
  capacity: number;
  current_capacity: number;
}

export interface CreateSkillResponse {
  status: boolean;
  message: string;
  data: ResponseData;
}

export const createSkill = async (
  data: CreateSkillPayload
): Promise<CreateSkillResponse> => {
  const response = await instance.post<CreateSkillResponse>(
    "/api/skills/create/",
    data
  );
  return response.data;
};
