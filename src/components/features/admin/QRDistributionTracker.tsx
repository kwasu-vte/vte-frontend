"use client"
import React from "react"
import { useMemo, useState } from "react"
import { Button, Card, CardBody, CardHeader, Chip, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { qrCodesApi } from "@/lib/api"
import { Printer } from "lucide-react"
import { useRouter } from "next/navigation"

/**
 * * QRDistributionTracker
 * Track which QR codes have been given to which mentors.
 * Simplified for better UX - shows recent QR codes and their status.
 */
export type QRDistributionTrackerProps = {
  selectedGroupId?: number | null
  qrBatches?: Array<{ id: string; mentor: string; group: string; date: string; status: "distributed" | "pending" }>
  onMarkDistributed?: (batchId: string) => void
}

export function QRDistributionTracker(props: QRDistributionTrackerProps) {
  const { selectedGroupId, qrBatches, onMarkDistributed } = props
  const [status, setStatus] = useState<"all" | "active" | "expired">("all")
  const [page, setPage] = useState(1)
  const router = useRouter()

  // * If parent did not provide batches, fetch codes and aggregate
  const shouldFetch = (!!selectedGroupId) && (!qrBatches || qrBatches.length === 0)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["qr-codes", selectedGroupId, status, page],
    queryFn: async () => {
      if (!selectedGroupId) return { results: [] } as any
      const res = await qrCodesApi.listGroupCodes(selectedGroupId, { per_page: 100, status: status === 'all' ? 'all' : status === 'active' ? 'active' : 'expired' })
      return res.data
    },
    enabled: shouldFetch,
  })

  const rows = useMemo(() => {
    const base = shouldFetch ? (data?.items || []) : (qrBatches || [])
    if (status === "all") return base
    // Map our status to API status names when applicable
    return base.filter((b: any) => (status === "active" ? b.status === "active" : b.status !== "active"))
  }, [shouldFetch, data, qrBatches, status])

  const totalPages = Math.max(1, Math.ceil(rows.length / 10))
  const paged = rows.slice((page - 1) * 10, page * 10)

  // * Handle print QR code
  const handlePrintQRCode = (qrToken: string) => {
    router.push(`/admin/qr-codes/print/${qrToken}`)
  }

  // * Show helpful message when no group is selected
  if (!selectedGroupId) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">📋</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">QR Code Status</h3>
        <p className="text-sm text-gray-500">
          Select a training group to view QR code status and distribution tracking.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* * Status filter */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Filter by status:</h4>
        <Select 
          size="sm" 
          selectedKeys={[status]} 
          onChange={(e) => setStatus((e.target.value as any) || "all")}
          className="w-32"
        > 
          <SelectItem key="all">All</SelectItem>
          <SelectItem key="active">Active</SelectItem>
          <SelectItem key="expired">Expired</SelectItem>
        </Select>
      </div>

      {/* * Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner size="sm" label="Loading QR codes..." />
        </div>
      ) : isError ? (
        <div className="py-6 text-sm text-red-500 text-center">
          Failed to load QR codes. Please try again.
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📱</div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">No QR Codes Yet</h4>
          <p className="text-xs text-gray-500">
            Create QR codes for practical sessions using the wizard to see them here.
          </p>
        </div>
      ) : (
        <>
          {/* * Summary cards */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-lg font-semibold text-green-700">
                {rows.filter((r: any) => r.status === 'active').length}
              </div>
              <div className="text-xs text-green-600">Active</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-semibold text-gray-700">
                {rows.filter((r: any) => r.status !== 'active').length}
              </div>
              <div className="text-xs text-gray-600">Used/Expired</div>
            </div>
          </div>

          {/* * QR codes table */}
          <div className="space-y-2">
            {paged.map((b: any, index: number) => (
              <div key={b.id || index} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {b.group || b.group_display_name || `Group ${b.group_number}` || 'Unknown Group'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {b.date ? new Date(b.date).toLocaleDateString() : 'No date'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip 
                      size="sm" 
                      color={b.status === "active" ? "success" : b.status === "pending" ? "warning" : "default"}
                    >
                      {b.status || 'unknown'}
                    </Chip>
                    {b.token && (
                      <Tooltip content="Print QR code">
                        <Button 
                          size="sm" 
                          color="secondary" 
                          variant="bordered"
                          onPress={() => handlePrintQRCode(b.token)}
                          startContent={<Printer className="h-3 w-3" />}
                        >
                          Print
                        </Button>
                      </Tooltip>
                    )}
                    {onMarkDistributed && b.status !== "distributed" && (
                      <Tooltip content="Mark as distributed">
                        <Button 
                          size="sm" 
                          color="primary" 
                          variant="bordered"
                          onPress={() => onMarkDistributed(String(b.id))}
                        >
                          Mark Done
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* * Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination 
                page={page} 
                total={totalPages} 
                onChange={setPage} 
                showControls 
                size="sm" 
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}


