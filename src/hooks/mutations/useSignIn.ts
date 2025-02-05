import { useMutation } from "@tanstack/react-query";
import { SignInPayload, SignInResponse, signIn } from "@/lib/queries/signIn";

export const useSignIn = () =>
  useMutation<SignInResponse, Error, SignInPayload>({
    mutationFn: (data: SignInPayload) => signIn(data),
    onSuccess: (data) => {
      if (!data) {
        console.error("No data returned from createUser mutation.");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userDetails", JSON.stringify(data));

      const now = new Date();
      now.setHours(now.getHours() + 3);
      localStorage.setItem("expirationDate", now.toISOString());
      const token = data?.access;
      if (token) {
        // localStorage.setItem("expirationDate", expirationDate.toISOString());
        localStorage.setItem("token", token);
        window.dispatchEvent(new Event("storage"));
      } else {
        console.error("Token is missing in response data.");
      }
      // localStorage.setItem("expirationDate", expirationDate.toISOString());
      window.dispatchEvent(new Event("storage"));
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
    },
  });
