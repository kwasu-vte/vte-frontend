import { instance } from "../api";

export type Group = {
  id: string;
  name: string;
  creation_date: string;
  end_date: string;
  course: string;
  members: string[];
};

export const getGroups = async (): Promise<Group[]> => {
  const response = await instance.get("/api/grouping/groups/");
  return response.data;
};
