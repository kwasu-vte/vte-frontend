import { getAdmin } from "@/lib/queries/getAdmin";
import { useQuery } from "@tanstack/react-query";

export const useFetchAdminDetails = (pathId: string) => {
  return useQuery({
    queryKey: ["admin", pathId],
    queryFn: () => getAdmin(pathId),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
