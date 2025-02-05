import { instance } from "../api";

type Group = {
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
