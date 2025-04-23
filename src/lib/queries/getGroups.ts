import { instance } from "../api";

export type Group = {
  id: string;
  name: string;
  creation_date: string;
  end_date: string;
  course: string;
  members: string[];
};

type Data = {
  status: boolean;
  message: string;
  data: Group[];
};

export const getGroups = async (): Promise<Data> => {
  const response = await instance.get("/api/group/list/");
  return response.data;
};
