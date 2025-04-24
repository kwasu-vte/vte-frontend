import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollStudentsInSkill } from "@/lib/queries/enrollStudentsInSkill";

export const useEnrollStudentsInSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollStudentsInSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skill"] });
    },
    onError: (error) => {
      console.error(
        "You have successfuly enrolled students for a new skill:",
        error
      );
    },
  });
};
