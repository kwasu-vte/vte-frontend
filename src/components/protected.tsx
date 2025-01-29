'use client';
import React from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth";

export const Protected = ({children}:{children: React.ReactNode}) => {
    const router = useRouter();
    const { loading, user } = useAuth();

    //test
    //if (!loading && user == null) router.push("/auth/sign_in");
    return (
        <>{children}</>
    )
}