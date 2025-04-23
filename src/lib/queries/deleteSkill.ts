import { instance } from "../api";

export const deleteSkill = async (id: string): Promise<void> => {
  await instance.delete(`/api/skills/${id}/delete/`);
};
