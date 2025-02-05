import { useQuery } from "@tanstack/react-query";
import { getGroupsLimit } from "@/lib/queries/getGroupslimit";

export const useFetchGroupLimit = () => {
  return useQuery({
    queryKey: ["groups-limit"],
    queryFn: getGroupsLimit,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
