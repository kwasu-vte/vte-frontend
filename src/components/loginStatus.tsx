'use client';
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkLoginStatus } from "@/lib/actions";

export const LoginStatus = ({children, setIsAuthenticated}:{children: React.ReactNode, setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const router = useRouter();

    const access_token = localStorage.getItem("access_token")!;
    const refresh_token = localStorage.getItem("refresh_token")!;
    if (access_token === null) {router.push("/")};
    if (access_token === null) {router.push("/")};

    useEffect(() => {

        const loginStatus = async ()=>{
          const status = await checkLoginStatus();
          setIsAuthenticated(status);
        };
    
        return () => {
          loginStatus();
        };
    
      }, [setIsAuthenticated]);
    
    

    return (
        <>{children}</>
    )
}