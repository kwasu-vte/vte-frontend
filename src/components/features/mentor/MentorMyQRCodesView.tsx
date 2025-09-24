"use client"
import React from "react"
import { Card, CardHeader, CardBody, Tabs, Tab, Select, SelectItem, Skeleton } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { SkillGroup, PaginatedResponse, GroupQrCode } from "@/lib/types"
import PracticalQRCard from "@/components/features/mentor/PracticalQRCard"
import QRScanReport from "@/components/features/mentor/QRScanReport"
import { DefaultEmptyComponent, DefaultLoadingComponent } from "@/components/shared/StateRenderer"

export default function MentorMyQRCodesView(props: { userId: string }) {
  const { userId } = props

  const { data: groups, isLoading: loadingGroups } = useQuery({
    queryKey: ["mentor-skill-groups", userId],
    queryFn: async () => {
      const res = await api.getMentorSkillGroups(userId)
      return (res?.data ?? []) as SkillGroup[]
    },
    enabled: !!userId,
  })

  const [selectedGroupId, setSelectedGroupId] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (!selectedGroupId && groups && groups.length > 0) {
      setSelectedGroupId(groups[0].id)
    }
  }, [groups, selectedGroupId])

  const { data: codes, isLoading: loadingCodes } = useQuery({
    queryKey: ["group-qr-codes", selectedGroupId, "all"],
    queryFn: async () => {
      if (!selectedGroupId) return null as PaginatedResponse<GroupQrCode> | null
      const res = await api.listGroupQrCodes(selectedGroupId, { status: "all", per_page: 100 })
      return (res?.data ?? null) as PaginatedResponse<GroupQrCode> | null
    },
    enabled: !!selectedGroupId,
    refetchInterval: 10000,
  })

  // Group by date (day) for display
  const groupedByDate = React.useMemo(() => {
    const map = new Map<string, GroupQrCode[]>()
    const items = codes?.results ?? []
    for (const c of items) {
      const d = c.expires_at ? new Date(c.expires_at) : new Date(c.created_at)
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString()
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(c)
    }
    // Sort by date desc
    return Array.from(map.entries()).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
  }, [codes])

  // Select a token for side report
  const selectedToken = React.useMemo(() => {
    const items = codes?.results ?? []
    return items.length > 0 ? items[0].token : null
  }, [codes])

  return (
    <div className="p-4 md:p-6 grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <Card shadow="sm" className="p-4">
          <CardHeader>
            {loadingGroups ? (
              <Skeleton className="h-10 w-64 rounded-md" />
            ) : groups && groups.length > 0 ? (
              <Select
                aria-label="Select group"
                selectedKeys={selectedGroupId ? new Set([String(selectedGroupId)]) : new Set([])}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys as Set<string>)[0]
                  setSelectedGroupId(key ? Number(key) : null)
                }}
                className="max-w-md"
              >
                {groups.map((g) => (
                  <SelectItem key={String(g.id)} value={String(g.id)}>
                    {g.name ?? `Group ${g.group_number ?? g.id}`} — {g.skill?.name ?? g.skill?.title}
                  </SelectItem>
                ))}
              </Select>
            ) : (
              <div className="w-full">
                <DefaultEmptyComponent message="No groups assigned." />
              </div>
            )}
          </CardHeader>
          <CardBody className="space-y-4">
            {loadingCodes ? (
              <DefaultLoadingComponent />
            ) : !codes || (codes.results ?? []).length === 0 ? (
              <DefaultEmptyComponent message="No QR codes for this group." />
            ) : (
              groupedByDate.map(([iso, items]) => (
                <PracticalQRCard
                  key={iso}
                  practical={{ id: iso, date: iso, group: String(selectedGroupId) }}
                  tokens={items.map((i) => ({ id: String(i.id), token: i.token, expiresAt: i.expires_at }))}
                />
              ))
            )}
          </CardBody>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card shadow="sm" className="p-4">
          <CardHeader>
            <div className="text-base font-medium text-neutral-900">Scan Report</div>
          </CardHeader>
          <CardBody>
            {!selectedGroupId || !selectedToken ? (
              <div className="text-sm text-neutral-500">Select a group with active or past tokens to view scans.</div>
            ) : (
              <Tabs aria-label="QR Report" variant="underlined">
                <Tab key="report" title="History & Report">
                  <QRScanReport qrToken={selectedToken} groupId={selectedGroupId} perPage={25} />
                </Tab>
              </Tabs>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
