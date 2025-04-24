import { instance } from "../api";

type SkillData = {
  id: number;
  max_skills_per_student: number;
  allow_300_level_selection: boolean;
  enrollment_start_date: string;
  enrollment_end_date: string;
};

type SkillSettingresponse = {
  status: boolean;
  message: string;
  data: SkillData;
};

export const getSkillsSetting = async (): Promise<SkillSettingresponse[]> => {
  const response = await instance.get("/api/skills/admin/config/");
  return response.data;
};
