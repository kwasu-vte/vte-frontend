import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/lib/queries/createUser";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      const resData = data?.data;

      if (!data) {
        console.error("No data returned from createUser mutation.");
        return;
      }

      if (resData?.role !== "mentor") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userDetails", JSON.stringify(resData));

        const now = new Date();
        now.setHours(now.getHours() + 3);
        localStorage.setItem("expirationDate", now.toISOString());

        const token = resData?.access;
        if (token) {
          // localStorage.setItem("expirationDate", expirationDate.toISOString());
          localStorage.setItem("token", token);
          window.dispatchEvent(new Event("storage"));
        } else {
          console.error("Token is missing in response data.");
        }
      }

      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
};
