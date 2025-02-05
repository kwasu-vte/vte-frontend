import { instance } from "../api";

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  password?: string;
  password2?: string;
  first_name?: string;
  last_name?: string;
  matric_number?: string;
  level?: string;
  role?: string;
}

export interface UpdateUserResponse {
  id: string;
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  matric_number: string;
  level: string;
  role: string;
  access: string;
}

export const updateUser = async (
  userId: string,
  data: UpdateUserPayload
): Promise<UpdateUserResponse> => {
  const response = await instance.patch<UpdateUserResponse>(
    `/api/core/register/${userId}/`,
    data
  );
  return response.data;
};
