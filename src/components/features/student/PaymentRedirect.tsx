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
  amount: number
  onProceed: () => void
}

function PaymentRedirect({ enrollment, amount, onProceed }: PaymentRedirectProps) {
  return (
    <Card shadow="sm" className="w-full max-w-lg">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600">Enrollment ID</p>
          <p className="text-xl font-medium leading-normal">{enrollment.id}</p>
        </div>
        <Image alt="Paystack" src="/assets/paystack_logo.png" width={96} height={24} removeWrapper className="object-contain" />
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-neutral-600">Amount Due</p>
          <p className="text-2xl font-bold">₦{new Intl.NumberFormat().format(amount)}</p>
        </div>
        <Button color="primary" className="w-full" onPress={onProceed}>
          Proceed to Payment
        </Button>
      </CardBody>
    </Card>
  )
}

export { PaymentRedirect }
export default PaymentRedirect
