import { useQuery } from "@tanstack/react-query";
import { getSkillsSetting } from "@/lib/queries/getSkillsSetting";

export const useFetchSkillSetting = () => {
  return useQuery({
    queryKey: ["skill-setting"],
    queryFn: getSkillsSetting,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
