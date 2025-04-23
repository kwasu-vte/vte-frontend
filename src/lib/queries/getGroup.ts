import { instance } from "../api";

export const getGroup = async (
  group_id: string
): Promise<{
  id: string;
  name: string;
  creation_date: string;
  end_date: string;
  course: string;
  members: string[];
}> => {
  const response = await instance.get(`/api/group/${group_id}/`);
  return response.data;
};
