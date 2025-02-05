import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/lib/queries/deleteuser";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });
};
