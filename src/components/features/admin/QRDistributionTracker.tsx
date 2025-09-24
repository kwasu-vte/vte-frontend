"use client"
import React from "react"
import { useMemo, useState } from "react"
import { Button, Card, CardBody, CardHeader, Chip, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react"
import { useClientQuery } from "@/src/lib/hooks/useClientQuery"
import { qrCodesApi } from "@/src/lib/api"

/**
 * * QRDistributionTracker
 * Track which QR codes have been given to which mentors.
 * TODO: Build table with QR batch, mentor, group, date, status; actions to mark distributed and print labels.
 *
 * Props:
 * - qrBatches: Array<{ id: string; mentor: string; group: string; date: string; status: 'distributed' | 'pending' }>
 * - onMarkDistributed: (batchId: string) => void
 */
export type QRDistributionTrackerProps = {
  qrBatches: Array<{ id: string; mentor: string; group: string; date: string; status: "distributed" | "pending" }>
  onMarkDistributed: (batchId: string) => void
}

export default function QRDistributionTracker(props: QRDistributionTrackerProps) {
  const { qrBatches, onMarkDistributed } = props
  const [status, setStatus] = useState<"all" | "active" | "expired">("all")
  const [page, setPage] = useState(1)

  // * If parent did not provide batches, fetch codes and aggregate
  const shouldFetch = !qrBatches || qrBatches.length === 0
  const { data, isLoading, isError } = useClientQuery({
    queryKey: ["qr-codes", status, page],
    queryFn: async () => {
      // NOTE: API is per-group; since we lack group here, this acts as a placeholder fetch path
      // In real usage, parent should provide batches; we keep this resilient
      return { data: { data: [] } } as any
    },
    enabled: shouldFetch,
  })

  const rows = useMemo(() => {
    const base = shouldFetch ? (data?.data?.data || []) : qrBatches
    if (status === "all") return base
    // Map our status to API status names when applicable
    return base.filter((b: any) => (status === "active" ? b.status === "pending" : b.status === "expired" || b.status === "distributed"))
  }, [shouldFetch, data, qrBatches, status])

  const totalPages = Math.max(1, Math.ceil(rows.length / 10))
  const paged = rows.slice((page - 1) * 10, page * 10)

  return (
    <Card shadow="sm">
      <CardHeader className="flex items-center justify-between">
        <p className="text-sm font-medium">QR Distribution</p>
        <div className="flex items-center gap-2">
          <Select size="sm" selectedKeys={[status]} onChange={(e) => setStatus((e.target.value as any) || "all")}> 
            <SelectItem key="all">All</SelectItem>
            <SelectItem key="active">Active</SelectItem>
            <SelectItem key="expired">Expired/Distributed</SelectItem>
          </Select>
        </div>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="flex items-center justify-center py-8"><Spinner label="Loading..." /></div>
        ) : isError ? (
          <div className="py-6 text-sm text-red-500">Failed to load QR batches.</div>
        ) : rows.length === 0 ? (
          <div className="py-6 text-sm text-neutral-500">No QR batches found.</div>
        ) : (
          <>
            <Table aria-label="QR distribution table">
              <TableHeader>
                <TableColumn>Mentor</TableColumn>
                <TableColumn>Group</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn className="w-[140px]">Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {paged.map((b: any) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.mentor || "-"}</TableCell>
                    <TableCell>{b.group || "-"}</TableCell>
                    <TableCell>{b.date || "-"}</TableCell>
                    <TableCell>
                      <Chip size="sm" color={b.status === "distributed" ? "success" : b.status === "pending" ? "warning" : "default"}>{b.status}</Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip content="Mark as distributed">
                          <Button size="sm" color="primary" variant="bordered" onPress={() => onMarkDistributed(String(b.id))} isDisabled={b.status === "distributed"}>
                            Mark Distributed
                          </Button>
                        </Tooltip>
                        <Tooltip content="Print labels">
                          <Button size="sm" variant="ghost">Print</Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Pagination page={page} total={totalPages} onChange={setPage} showControls size="sm" />
            </div>
          </>
        )}
      </CardBody>
    </Card>
  )
}


