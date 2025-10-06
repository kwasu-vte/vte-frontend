"use client"
import React from "react"
import { Card, CardBody, CardHeader, Button, Image } from "@nextui-org/react"

/**
 * * PaymentRedirect
 * Simple payment initiation component.
 *
 * Props:
 * - enrollment: { id: string }
 * - amount: number
 * - onProceed: () => void
 */
export type PaymentRedirectProps = {
  enrollment: { id: string }
  amount?: number
  onProceed?: () => void
  userId?: string
}

function PaymentRedirect({ enrollment, amount, onProceed, userId }: PaymentRedirectProps) {
  const handleProceed = async () => {
    if (typeof onProceed === 'function') {
      onProceed()
      return
    }
    if (!userId) return
    try {
      const resp = await fetch(`/api/v1/users/${userId}/enrollment/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ enrollment_id: enrollment.id }),
        cache: 'no-store' as any,
      })
      const json = await resp.json().catch(() => ({} as any))
      const url = json?.data?.payment_url || json?.payment_url
      if (resp.ok && url) {
        window.location.href = url
      }
    } catch (_) {
      // * silent fail on client; server already logs in calling page
    }
  }
  return (
    <Card shadow="sm" className="w-full max-w-lg" id="student-payment">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600">Enrollment ID</p>
          <p className="text-xl font-medium leading-normal">{enrollment.id}</p>
        </div>
        <Image alt="Paystack" src="/assets/paystack_logo.png" width={96} height={24} removeWrapper className="object-contain" />
      </CardHeader>
      <CardBody className="space-y-4">
        {typeof amount === 'number' && !Number.isNaN(amount) && (
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-neutral-600">Amount Due</p>
            <p className="text-2xl font-bold">₦{new Intl.NumberFormat().format(amount)}</p>
          </div>
        )}
        <Button color="primary" className="w-full" onPress={handleProceed}>
          Proceed to Payment
        </Button>
      </CardBody>
    </Card>
  )
}

export { PaymentRedirect }
export default PaymentRedirect
