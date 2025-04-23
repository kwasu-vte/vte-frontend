import { instance } from "../api";

export const enrollStudentsInSkill = async (): Promise<void> => {
  await instance.post(`/api/skills/admin/random-enrollment/`);
};
