import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSkill } from "@/lib/queries/createSkill";

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: (error) => {
      console.error("Error creating skill:", error);
    },
  });
};
