import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroup } from "@/lib/queries/deleteGroup";

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group"] });
    },
    onError: (error) => {
      console.error("Error deleting group:", error);
    },
  });
};
