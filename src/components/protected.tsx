'use client';
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { confirmAuthStatus } from "@/lib/actions";

export const Protected = ({children}:{children: React.ReactNode}) => {
    const router = useRouter();

    const access_token = localStorage.getItem("access_token")!;
    const refresh_token = localStorage.getItem("refresh_token")!;
    if (access_token === null) {router.push("/")};
    if (refresh_token === null) {router.push("/")};

    useEffect(() => {
        const handleauthValidate = async() => {
            await confirmAuthStatus({access_token:access_token, refresh_token:refresh_token});
        }
        
        return () => {
            handleauthValidate();
        };
    }, [access_token, refresh_token]);
    
    

    return (
        <>{children}</>
    )
}