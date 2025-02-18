import { instance } from "../api";

export const deleteCourse = async (id: string): Promise<void> => {
  await instance.delete(`/api/courses/${id}/edit/`);
};
