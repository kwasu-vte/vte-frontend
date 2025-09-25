"use client"
import React from "react"
import { useMemo, useState } from "react"
import { Button, Card, CardBody, CardHeader, Chip, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { qrCodesApi } from "@/lib/api"

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
  selectedGroupId?: number | null
  qrBatches?: Array<{ id: string; mentor: string; group: string; date: string; status: "distributed" | "pending" }>
  onMarkDistributed?: (batchId: string) => void
}

export function QRDistributionTracker(props: QRDistributionTrackerProps) {
  const { selectedGroupId, qrBatches, onMarkDistributed } = props
  const [status, setStatus] = useState<"all" | "active" | "expired">("all")
  const [page, setPage] = useState(1)
  // TODO: Persist distribution status via API when backend endpoint is available.
  // TODO: Support global (multi-group) distribution view when a list-all endpoint exists.

  // * If parent did not provide batches, fetch codes and aggregate
  const shouldFetch = (!!selectedGroupId) && (!qrBatches || qrBatches.length === 0)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["qr-codes", selectedGroupId, status, page],
    queryFn: async () => {
      if (!selectedGroupId) return { results: [] } as any
      const res = await qrCodesApi.listByGroup(selectedGroupId, { per_page: 100, status: status === 'all' ? 'all' : status === 'active' ? 'active' : 'expired' })
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
        {/* TODO: Add a print labels dialog with preview and printer tips. */}
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
                        {onMarkDistributed && (
                          <Tooltip content="Mark as distributed">
                            <Button size="sm" color="primary" variant="bordered" onPress={() => onMarkDistributed(String(b.id))} isDisabled={b.status === "distributed"}>
                            Mark Distributed
                            </Button>
                          </Tooltip>
                        )}
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


