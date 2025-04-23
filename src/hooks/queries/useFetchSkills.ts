import { useQuery } from "@tanstack/react-query";
import { getSkills } from "@/lib/queries/getSkills";

export const useFetchSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
