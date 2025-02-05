import { useQuery } from "@tanstack/react-query";
import { getStudents } from "@/lib/queries/getStudents";

export const useFetchStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
