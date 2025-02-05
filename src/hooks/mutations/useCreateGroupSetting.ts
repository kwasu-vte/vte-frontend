import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupSetting } from "@/lib/queries/createGroupSetting";

export const useCreateGroupSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroupSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-setting"] });
    },
    onError: (error) => {
      console.error("Error creating group setting:", error);
    },
  });
};
