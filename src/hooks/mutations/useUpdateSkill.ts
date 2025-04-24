import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UpdateSkillPayload,
  UpdateSkillResponse,
  updateSkill,
} from "@/lib/queries/updateSkill";

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateSkillResponse,
    Error,
    { id: string; data: UpdateSkillPayload }
  >({
    mutationFn: ({ id, data }) => updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skill"] });
    },
    onError: (error) => {
      console.error("Error updating skill:", error);
    },
  });
};
