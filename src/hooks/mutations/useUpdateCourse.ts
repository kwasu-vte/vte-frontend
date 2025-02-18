import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UpdateCoursePayload,
  UpdateCourseResponse,
  updateCourse,
} from "@/lib/queries/updateCourse";

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateCourseResponse,
    Error,
    { courseId: string; data: UpdateCoursePayload }
  >({
    mutationFn: ({ courseId, data }) => updateCourse(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
    onError: (error) => {
      console.error("Error updating course:", error);
    },
  });
};
