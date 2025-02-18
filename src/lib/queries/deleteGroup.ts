import { instance } from "../api";

export const deleteGroup = async (id: string): Promise<void> => {
  await instance.delete(`/api/grouping/groups/${id}/`);
};
