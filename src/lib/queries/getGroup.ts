import { instance } from "../api";

export const getGroup = async (
  pathId: string
): Promise<{
  id: string;
  name: string;
  creation_date: string;
  end_date: string;
  course: string;
  members: string[];
}> => {
  const response = await instance.get(`/api/grouping/groups/${pathId}/`);
  return response.data;
};
