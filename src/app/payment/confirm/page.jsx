"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { paystackRedirect } from "@/lib/info";


export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();

    let reference = searchParams.get("reference");
    useEffect(() => {
        const confirmPayment = async () => {
            let res = await paystackRedirect({reference});
            if (res) {
                router.push("/");
            } else {
                
            }
        }

        confirmPayment();
    }, []);

    return <p>Done...</p>
}