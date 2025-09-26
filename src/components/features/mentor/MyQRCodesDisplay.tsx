"use client"
import React from "react"
import { Card, CardBody, CardHeader, Button, Chip, Skeleton } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { qrCodesApi } from "@/lib/api"
import type { PaginatedResponse, GroupQrCode } from "@/lib/types"

/**
 * * MyQRCodesDisplay
 * Display QR codes for a group with copy/print actions.
 */
export type MyQRCodesDisplayProps = {
  groupId: number
}

export default function MyQRCodesDisplay(props: MyQRCodesDisplayProps) {
  const { groupId } = props
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["group-qr-codes", groupId],
    queryFn: async () => {
      const res = await qrCodesApi.listGroupCodes(groupId, { status: "active", per_page: 50 })
      return res?.data as PaginatedResponse<GroupQrCode>
    },
  })

  const handleCopy = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token)
    } catch {
      // noop
    }
  }

  const handlePrint = (token: string) => {
    // Minimal print: open a new window with token text; QR rendering can be added later
    const html = `<html><head><title>Print QR Token</title></head><body style="font-family: sans-serif; padding: 24px;"><h2>QR Token</h2><p style="font-size: 20px;">${token}</p></body></html>`
    const w = window.open("", "_blank")
    if (w) {
      w.document.write(html)
      w.document.close()
      w.focus()
      w.print()
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} shadow="sm" className="p-4">
            <CardHeader className="flex items-center justify-between">
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </CardHeader>
            <CardBody className="space-y-3">
              <Skeleton className="h-24 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </CardBody>
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-neutral-50">
        <p className="text-base font-medium text-neutral-900 mb-2">Failed to load QR codes</p>
        <p className="text-sm text-neutral-500 mb-4">{(error as any)?.message ?? "Please try again."}</p>
        <Button color="primary" onPress={() => refetch()}>Retry</Button>
      </div>
    )
  }

  const items = data?.items ?? []

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-neutral-50">
        <p className="text-base font-medium text-neutral-900 mb-2">No QR codes</p>
        <p className="text-sm text-neutral-500">There are no active codes for this group.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((code: any) => (
        <Card key={code.id} shadow="sm" className="p-4">
          <CardHeader className="flex items-center justify-between">
            <p className="text-base font-medium text-neutral-900">Token</p>
            <Chip variant="flat" color="primary">{new Date(code.expires_at).toLocaleDateString()}</Chip>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="border rounded-md p-3 text-sm break-all bg-neutral-50">{code.token}</div>
            <div className="flex items-center justify-end gap-2">
              <Button size="sm" variant="ghost" onPress={() => handleCopy(code.token)}>Copy</Button>
              <Button size="sm" color="primary" onPress={() => handlePrint(code.token)}>Print</Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}


