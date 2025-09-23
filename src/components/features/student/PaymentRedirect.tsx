"use client"
import React from "react"

/**
 * * PaymentRedirect
 * Simple payment initiation component.
 * TODO: Display amount, gateway logo, and big proceed button; trigger onProceed.
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

export default function PaymentRedirect(_props: PaymentRedirectProps) {
  // TODO: Render payment details and proceed action
  return <div>{/* TODO: PaymentRedirect UI */}</div>
}


