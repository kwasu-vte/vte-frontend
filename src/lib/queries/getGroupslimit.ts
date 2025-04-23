import { instance } from "../api";

type GroupLimit = {
  id: string;
  practicals_per_day: number;
  students_per_group: number;
  staffers_per_group: number;
  must_be_in_the_same_level: boolean;
  groups_per_day: number;
  last_updated: string;
};

export const getGroupsLimit = async (): Promise<GroupLimit[]> => {
  const response = await instance.get("/api/group/settings/");
  return response.data;
};
