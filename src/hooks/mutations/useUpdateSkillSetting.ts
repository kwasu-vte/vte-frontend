import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSkillSetting } from "@/lib/queries/updateSkillSetting";

export const useUpdateSkillSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSkillSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-setting"] });
    },
    onError: (error) => {
      console.error("Error creating group setting:", error);
    },
  });
};
