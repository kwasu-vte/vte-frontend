import { instance } from "../api";

export type SkillLevel = {
  level: string;
};

export type Skill = {
  id: string;
  code: string;
  title: string;
  description: string;
  price: string;
  enrollment_deadline: string;
  available_levels: SkillLevel[];
  capacity: number;
  current_capacity: number;
};

export type SkillResponse = {
  status: boolean;
  message: string;
  data: Skill[];
};

export const getSkills = async (): Promise<SkillResponse> => {
  const response = await instance.get("/api/skills/");
  return response.data;
};
