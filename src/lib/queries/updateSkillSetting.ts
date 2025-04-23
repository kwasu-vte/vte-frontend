import { instance } from "../api";

export interface UpdateSkillSettingPayload {
  max_skills_per_student: number;
  allow_300_level_selection: boolean;
  enrollment_start_date: string;
  enrollment_end_date: string;
}

export interface UpdateSkillSettingResponse {
  id: string;
  max_skills_per_student: number;
  allow_300_level_selection: boolean;
  enrollment_start_date: string;
  enrollment_end_date: string;
}

export const updateSkillSetting = async (
  data: UpdateSkillSettingPayload
): Promise<UpdateSkillSettingResponse> => {
  const response = await instance.put<UpdateSkillSettingResponse>(
    "/api/skills/admin/config/",
    data
  );
  return response.data;
};
