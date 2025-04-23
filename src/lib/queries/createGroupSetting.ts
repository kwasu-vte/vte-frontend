import { instance } from "../api";

export interface CreateGroupSettingPayload {
  practicals_per_day: number;
  students_per_group: number;
  staffers_per_group: number;
  groups_per_day: number;
}

export interface CreateGroupSettingResponse {
  id: string;
  practicals_per_day: number;
  students_per_group: number;
  staffers_per_group: number;
  must_be_in_the_same_level: boolean;
  groups_per_day: number;
  last_updated: string;
}

export const createGroupSetting = async (
  data: CreateGroupSettingPayload
): Promise<CreateGroupSettingResponse> => {
  const response = await instance.put<CreateGroupSettingResponse>(
    "/api/group/settings/",
    data
  );
  return response.data;
};
