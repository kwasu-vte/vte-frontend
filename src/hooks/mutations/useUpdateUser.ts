import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UpdateUserPayload,
  UpdateUserResponse,
  updateUser,
} from "@/lib/queries/updateUser";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserResponse,
    Error,
    { userId: string; data: UpdateUserPayload }
  >({
    mutationFn: ({ userId, data }) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
};
