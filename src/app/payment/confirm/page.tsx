"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

import { paystackRedirect } from "@/lib/info";

// * Force dynamic rendering
export const dynamic = 'force-dynamic';


function PaymentConfirmContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    let reference = searchParams.get("reference");
    useEffect(() => {
        const confirmPayment = async () => {
            let res = await paystackRedirect({reference: reference || ''});
            if (res) {
                router.push("/");
            } else {
                
            }
        }

        confirmPayment();
    }, [reference, router]);

    return <p>Done...</p>
}

export default function Page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <PaymentConfirmContent />
        </Suspense>
    );
}