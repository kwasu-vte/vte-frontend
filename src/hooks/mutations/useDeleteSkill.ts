import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSkill } from "@/lib/queries/deleteSkill";

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skill"] });
    },
    onError: (error) => {
      console.error("Error deleting skill:", error);
    },
  });
};
