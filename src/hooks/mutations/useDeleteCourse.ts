import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourse } from "@/lib/queries/deleteCourse";

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
    onError: (error) => {
      console.error("Error deleting course:", error);
    },
  });
};
