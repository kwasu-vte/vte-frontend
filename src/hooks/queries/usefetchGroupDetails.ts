import { getGroup } from "@/lib/queries/getGroup";
import { useQuery } from "@tanstack/react-query";

export const useFetchGroupDetails = (pathId: string) => {
  return useQuery({
    queryKey: ["group", pathId],
    queryFn: () => getGroup(pathId),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
