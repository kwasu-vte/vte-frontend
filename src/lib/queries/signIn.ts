import { instance } from "../api";

export interface SignInPayload {
  email?: string;
  password: string;
}

export interface SignInResponse {
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

export const signIn = async (data: SignInPayload): Promise<SignInResponse> => {
  const response = await instance.post<SignInResponse>(
    "/api/core/token/",
    data
  );
  return response.data;
};
