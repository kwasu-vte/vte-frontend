"use client"
import React from "react"

/**
 * * PracticalQRCard
 * Card showing QR for specific practical session with instructions.
 * TODO: Render date, group, QR code(s), and usage instructions.
 *
 * Props:
 * - practical: { id: string; date: string; group: string }
 * - qrCodes: Array<{ id: string; imageDataUrl?: string }>
 */
export type PracticalQRCardProps = {
  practical: { id: string; date: string; group: string }
  qrCodes: Array<{ id: string; imageDataUrl?: string }>
}

export default function PracticalQRCard(_props: PracticalQRCardProps) {
  // TODO: Render card UI with QR images
  return <div>{/* TODO: PracticalQRCard UI */}</div>
}


