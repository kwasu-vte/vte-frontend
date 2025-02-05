import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/lib/queries/getCourses";

export const useFetchCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
