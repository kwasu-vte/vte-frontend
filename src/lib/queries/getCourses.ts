import { instance } from "../api";

export type Course = {
  id: string;
  code: string;
  title: string;
  description: string;
  department: string;
  price: string;
};

export const getCourses = async (): Promise<Course[]> => {
  const response = await instance.get("/api/courses/");
  return response.data;
};
