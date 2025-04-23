import { useQuery } from "@tanstack/react-query";
import { getPayments } from "@/lib/queries/getPayments";

export const useFetchAllPayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: getPayments,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
