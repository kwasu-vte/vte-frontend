import { instance } from "../api";

export interface UpdateCoursePayload {
  code?: string;
  title?: string;
  description?: string;
  department?: string;
  price?: string;
}

export interface UpdateCourseResponse {
  id: string;
  code: string;
  title: string;
  description: string;
  department: string;
  price: string;
}

export const updateCourse = async (
  courseId: string,
  data: UpdateCoursePayload
): Promise<UpdateCourseResponse> => {
  const response = await instance.patch<UpdateCourseResponse>(
    `/api/courses/${courseId}/edit/`,
    data
  );
  return response.data;
};
