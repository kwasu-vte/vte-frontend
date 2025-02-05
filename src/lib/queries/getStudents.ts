import { instance } from "../api";

export type Student = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  matric_number: string;
  level: string;
  role: string;
  group?: string;
};

export const getStudents = async (): Promise<Student[]> => {
  const response = await instance.get("/api/core/students/all/");
  return response.data;
};
