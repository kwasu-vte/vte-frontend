import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ! SECURITY: Client-side token storage removed
// * Logout functionality moved to Server Actions in lib/actions.ts
// * All authentication now uses httpOnly cookies via server-side
// * Use signOutAction() from lib/actions.ts instead