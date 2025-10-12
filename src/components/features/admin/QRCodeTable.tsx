"use client"

import React from "react"
import { useState } from "react"
import { Button, Card, CardBody, CardHeader, Chip, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import { qrCodesApi } from "@/lib/api"
import { Printer, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { GroupQrCode } from "@/lib/types"

/**
 * * QRCodeTable
 * Table component that displays QR codes for a selected skill and group.
 * Includes print functionality and create button.
 */
export type QRCodeTableProps = {
  skillId: string | null
  groupId: string | null
  onCreateClick: () => void
}

export function QRCodeTable({ skillId, groupId, onCreateClick }: QRCodeTableProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"all" | "active" | "expired">("all")
  const [page, setPage] = useState(1)

  // * Fetch QR codes for the selected group
  const { data, isLoading, isError } = useQuery({
    queryKey: ["qr-codes", groupId, status, page],
    queryFn: async () => {
      if (!groupId) return { items: [], total: 0 }
      const res = await qrCodesApi.listGroupCodes(Number(groupId), { 
        per_page: 20, 
        status: status === 'all' ? 'all' : status === 'active' ? 'active' : 'expired' 
      })
      return res.data
    },
    enabled: !!groupId,
  })

  const qrCodes = data?.items || []
  const totalPages = Math.max(1, Math.ceil(qrCodes.length / 10))
  const paged = qrCodes.slice((page - 1) * 10, page * 10)

  // * Handle print QR code
  const handlePrintQRCode = (qrCode: GroupQrCode) => {
    // * Store QR code data in session storage
    sessionStorage.setItem('qrCodePrintData', JSON.stringify(qrCode))
    router.push('/admin/qr-codes/print-selector')
  }

  // * Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'expired': return 'danger'
      default: return 'default'
    }
  }

  // * Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // * Check if QR code is expired
  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  if (!skillId || !groupId) {
    return (
      <Card className="h-96">
        <CardBody className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Select Skill and Group</h3>
            <p className="text-sm text-gray-500">
              Please select a skill and group to view QR codes.
            </p>
          </div>
        </CardBody>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardBody className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </CardBody>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardBody className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Error Loading QR Codes</h3>
            <p className="text-sm text-gray-500">
              Failed to load QR codes for the selected group.
            </p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">QR Codes</h3>
          <p className="text-sm text-gray-500">Manage QR codes for the selected group</p>
        </div>
        <div className="flex items-center gap-2">
         <Select
  size="md"
  selectedKeys={[status]}
  onChange={(e) => setStatus(e.target.value as "all" | "active" | "expired")}
  classNames={{
    listbox: "bg-white",
    base: "w-full",
    trigger: "h-10",
    innerWrapper: "pb-0",
    selectorIcon: "right-3",
    popoverContent: "shadow-lg",
  }}
  style={{
    paddingRight: '2.5rem'
  }}
>
  <SelectItem key="all">All</SelectItem>
  <SelectItem key="active">Active</SelectItem>
  <SelectItem key="expired">Expired</SelectItem>
</Select>
          <Button
            color="primary"
            size="sm"
            startContent={<Plus className="h-3 w-4" />}
            onPress={onCreateClick}
          >
          <p className="text-sm"> Create QR</p>
          </Button>
        </div>
      </CardHeader>
      
      <CardBody>
        {qrCodes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No QR Codes Found</h3>
            <p className="text-sm text-gray-500 mb-4">
              No QR codes found for the selected group and status filter.
            </p>
            <Button
              color="primary"
              variant="bordered"
              startContent={<Plus className="h-4 w-4" />}
              onPress={onCreateClick}
            >
              Create QR Codes
            </Button>
          </div>
        ) : (
          <>
            <Table aria-label="QR codes table">
              <TableHeader>
                <TableColumn>TOKEN</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>POINTS</TableColumn>
                <TableColumn>EXPIRES</TableColumn>
                <TableColumn className="w-24">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {paged.map((qrCode: GroupQrCode) => (
                  <TableRow key={qrCode.id}>
                    <TableCell>
                      <div className="font-mono text-xs text-gray-600">
                        {qrCode.token.substring(0, 20)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={getStatusColor(isExpired(qrCode.expires_at) ? 'expired' : 'active')}
                        variant="flat"
                      >
                        {isExpired(qrCode.expires_at) ? 'expired' : 'active'}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {qrCode.mark_value || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatDate(qrCode.expires_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Tooltip content="Print QR code">
                        <Button
                          size="sm"
                          color="primary"
                          variant="solid"
                          onPress={() => handlePrintQRCode(qrCode)}
                          startContent={<Printer className="h-3 w-3" />}
                        >
                          Print
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
      </CardBody>
    </Card>
  )
}
