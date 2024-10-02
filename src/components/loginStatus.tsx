'use client';
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkLoginStatus } from "@/lib/actions";

export const LoginStatus = ({children, setIsAuthenticated}:{children: React.ReactNode, setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>}) => {
    
    const router = useRouter();

    useEffect(() => {

      if (typeof window !== "undefined") {
        const access_token = localStorage.getItem("access_token");
        const refresh_token = localStorage.getItem("refresh_token");

        if (!access_token) {
            router.push("/");
        }

        const loginStatus = async () => {
            const status = await checkLoginStatus();
            setIsAuthenticated(status);
        };

        loginStatus();
      }
    
      }, [router, setIsAuthenticated]);
    
    

    return (
        <>{children}</>
    )
}