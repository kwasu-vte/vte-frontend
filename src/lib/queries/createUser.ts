import { instance } from "../api";

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  matric_number: string;
  level: string;
  role: string;
}

export interface CreateUserResponse {
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

export const createUser = async (
  data: CreateUserPayload
): Promise<CreateUserResponse> => {
  const response = await instance.post<CreateUserResponse>(
    "/api/core/register/",
    data
  );
  return response.data;
};
