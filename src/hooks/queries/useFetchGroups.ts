import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/lib/queries/getGroups";

export const useFetchGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
