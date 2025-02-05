import { useQuery } from "@tanstack/react-query";
import { getMentors } from "@/lib/queries/getMentors";

export const useFetchMentors = () => {
  return useQuery({
    queryKey: ["mentors"],
    queryFn: getMentors,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
