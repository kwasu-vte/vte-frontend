import { instance } from "../api";

export const getStudent = async (
  pathId: string,
  queryId: string
): Promise<{
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  matric_number: string;
  level: string;
  role: string;
}> => {
  const response = await instance.get(`/api/core/students/${pathId}/`, {
    params: { id: queryId },
  });
  return response.data;
};
