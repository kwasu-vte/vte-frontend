import { instance } from "../api";

export type Mentor = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  group?: string[];
  //   matric_number: null;
  //   level: null;
  role: string;
};

export const getMentors = async (): Promise<Mentor[]> => {
  const response = await instance.get("/api/core/mentors/all/");
  return response.data;
};
