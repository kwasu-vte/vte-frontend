import { instance } from "../api";

export interface CreateCoursePayload {
  code: string;
  title: string;
  description: string;
  department: string;
  price: string;
}

export interface CreateCourseResponse {
  id: string;
  code: string;
  title: string;
  description: string;
  department: string;
  price: string;
}

export const createCourse = async (
  data: CreateCoursePayload
): Promise<CreateCourseResponse> => {
  const response = await instance.post<CreateCourseResponse>(
    "/api/courses/create/",
    data
  );
  return response.data;
};
