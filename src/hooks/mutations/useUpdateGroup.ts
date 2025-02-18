import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UpdateGroupPayload,
  UpdateGroupResponse,
  updateGroup,
} from "@/lib/queries/updateGroup";

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateGroupResponse,
    Error,
    { groupId: string; data: UpdateGroupPayload }
  >({
    mutationFn: ({ groupId, data }) => updateGroup(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group"] });
    },
    onError: (error) => {
      console.error("Error updating group:", error);
    },
  });
};
