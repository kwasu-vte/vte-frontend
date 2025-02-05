import { instance } from "../api";

type GroupLimit = {
  id: string;
  practicals_per_day: number;
  students_per_group: number;
  staffers_per_group: number;
  groups_per_day: number;
  last_updated: string;
};

export const getGroupsLimit = async (): Promise<GroupLimit[]> => {
  const response = await instance.get("/api/grouping/settings/");
  return response.data;
};
