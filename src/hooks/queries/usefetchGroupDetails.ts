import { getGroup } from "@/lib/queries/getGroup";
import { useQuery } from "@tanstack/react-query";

export const useFetchGroupDetails = (group_id: string) => {
  return useQuery({
    queryKey: ["group", group_id],
    queryFn: () => getGroup(group_id),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
