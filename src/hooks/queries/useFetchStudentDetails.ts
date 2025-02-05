import { getStudent } from "@/lib/queries/getStudent";
import { useQuery } from "@tanstack/react-query";

export const useFetchStudentDetails = (pathId: string, queryId: string) => {
  return useQuery({
    queryKey: ["student", pathId, queryId],
    queryFn: () => getStudent(pathId, queryId),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

