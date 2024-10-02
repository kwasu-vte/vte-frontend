import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { redirect } from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const Logout = async () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("role");
  sessionStorage.removeItem("login_status")
  //redirect("")
}