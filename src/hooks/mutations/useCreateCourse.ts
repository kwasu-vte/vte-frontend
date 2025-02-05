import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse } from "@/lib/queries/createCourse";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      console.error("Error creating course:", error);
    },
  });
};
