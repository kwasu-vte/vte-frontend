import { instance } from "../api";

export const getAdmin = async (
  pathId: string
): Promise<{
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  //   matric_number: string;
  //   level: string;
  role: string;
}> => {
  const response = await instance.get(`/api/core/admins/${pathId}/`);
  return response.data;
};
