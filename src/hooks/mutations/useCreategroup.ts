import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "@/lib/queries/createGroup";

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error) => {
      console.error("Error creating group:", error);
    },
  });
};
