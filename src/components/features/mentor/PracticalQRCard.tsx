"use client"
import React from "react"
import { Card, CardHeader, CardBody, Button, Chip } from "@heroui/react"

export type PracticalQRCardProps = {
  practical: { id: string; date: string; group: string }
  tokens: Array<{ id: string; token: string; expiresAt?: string }>
}

export default function PracticalQRCard(props: PracticalQRCardProps) {
  const { practical, tokens } = props

  const handlePrint = (token: string) => {
    const html = `<html><head><title>Print QR Token</title></head><body style="font-family: sans-serif; padding: 24px;"><h2>Group ${practical.group} - Practical</h2><p style="font-size: 20px;">${token}</p></body></html>`
    const w = window.open("", "_blank")
    if (w) {
      w.document.write(html)
      w.document.close()
      w.focus()
      w.print()
    }
  }

  return (
    <Card shadow="sm" className="p-4">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-base font-medium text-neutral-900">Practical QR</p>
          <p className="text-sm text-neutral-500">{new Date(practical.date).toLocaleString()} • Group {practical.group}</p>
        </div>
        <Chip variant="flat">{tokens.length} codes</Chip>
      </CardHeader>
      <CardBody className="space-y-3">
        {tokens.map((q) => (
          <div key={q.id} className="border rounded-md p-3 bg-neutral-50">
            <div className="flex items-center justify-between">
              <div className="mr-3 min-w-0">
                <p className="text-sm font-medium text-neutral-900 break-all">{q.token}</p>
                {q.expiresAt && (
                  <p className="text-xs text-neutral-500">Expires {new Date(q.expiresAt).toLocaleString()}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onPress={() => navigator.clipboard.writeText(q.token)}>Copy</Button>
                <Button size="sm" color="primary" onPress={() => handlePrint(q.token)}>Print</Button>
              </div>
            </div>
          </div>
        ))}
        <div className="text-xs text-neutral-500">
          Ensure tokens are kept private. Students scan using the student app during the session window.
        </div>
      </CardBody>
    </Card>
  )
}


