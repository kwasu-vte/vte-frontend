"use client"
import React from "react"
import { useState } from "react"
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem, Spinner } from "@nextui-org/react"
import { z } from "zod"
import { qrCodesApi } from "@/src/lib/api"

/**
 * * QRGenerationForm
 * Generate QR codes for mentor/group combinations.
 * TODO: Build form for mode (single/multiple), group, mentor, date, number of codes, points per scan.
 *
 * Props:
 * - groups: Array<{ id: string; name: string }>
 * - mentors: Array<{ id: string; name: string }>
 * - onGenerate: (payload: any) => void // TODO: Replace any with concrete type when backend contracts are finalized
 */
export type QRGenerationFormProps = {
  groups: Array<{ id: string; name: string }>
  mentors: Array<{ id: string; name: string }>
  onGenerate: (payload: unknown) => void
}

const PayloadSchema = z.object({
  mode: z.enum(["single", "bulk"]).default("single"),
  groupId: z.coerce.number().int().positive().optional(),
  mentorId: z.string().optional(),
  count: z.coerce.number().int().min(1).max(500).default(10),
  expiresInDays: z.coerce.number().int().min(1).max(90).default(7),
  pointsPerScan: z.coerce.number().int().min(1).max(100).default(1),
})

export default function QRGenerationForm(props: QRGenerationFormProps) {
  const { groups, mentors, onGenerate } = props
  const [mode, setMode] = useState<"single" | "bulk">("single")
  const [groupId, setGroupId] = useState<string>("")
  const [mentorId, setMentorId] = useState<string>("")
  const [count, setCount] = useState<string>("10")
  const [expiresInDays, setExpiresInDays] = useState<string>("7")
  const [pointsPerScan, setPointsPerScan] = useState<string>("1")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setError(null)
    setSubmitting(true)
    try {
      const parsed = PayloadSchema.parse({
        mode,
        groupId: groupId ? Number(groupId) : undefined,
        mentorId: mentorId || undefined,
        count,
        expiresInDays,
        pointsPerScan,
      })

      if (parsed.mode === "single") {
        if (!parsed.groupId) throw new Error("Group is required for single mode")
        const res = await qrCodesApi.generateForGroup(parsed.groupId, {
          count: parsed.count,
          expires_in_days: parsed.expiresInDays,
          points_per_scan: parsed.pointsPerScan,
        } as any)
        onGenerate(res)
      } else {
        const res = await qrCodesApi.bulkGenerate({
          group_ids: groups.map((g) => Number(g.id)),
          count: parsed.count,
          expires_in_days: parsed.expiresInDays,
          points_per_scan: parsed.pointsPerScan,
        } as any)
        onGenerate(res)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate QR codes")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card shadow="sm">
      <CardHeader className="flex items-center justify-between">
        <p className="text-sm font-medium">Generate QR Codes</p>
        <div className="flex gap-2">
          <Select
            size="sm"
            selectedKeys={[mode]}
            onChange={(e) => setMode((e.target.value as "single" | "bulk") || "single")}
          >
            <SelectItem key="single">Single Group</SelectItem>
            <SelectItem key="bulk">Bulk (all groups)</SelectItem>
          </Select>
        </div>
      </CardHeader>
      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mode === "single" && (
          <Select
            label="Group"
            placeholder="Select group"
            selectedKeys={groupId ? [groupId] : []}
            onChange={(e) => setGroupId(e.target.value)}
            isRequired
          >
            {groups.map((g) => (
              <SelectItem key={String(g.id)}>{g.name}</SelectItem>
            ))}
          </Select>
        )}

        <Select
          label="Mentor (optional)"
          placeholder="Select mentor"
          selectedKeys={mentorId ? [mentorId] : []}
          onChange={(e) => setMentorId(e.target.value)}
        >
          {mentors.map((m) => (
            <SelectItem key={String(m.id)}>{m.name}</SelectItem>
          ))}
        </Select>

        <Input label="Count" type="number" value={count} onChange={(e) => setCount(e.target.value)} min={1} max={500} />
        <Input label="Expires in (days)" type="number" value={expiresInDays} onChange={(e) => setExpiresInDays(e.target.value)} min={1} max={90} />
        <Input label="Points per scan" type="number" value={pointsPerScan} onChange={(e) => setPointsPerScan(e.target.value)} min={1} max={100} />

        {error && <p className="col-span-full text-sm text-red-500">{error}</p>}

        <div className="col-span-full flex justify-end gap-2">
          <Button variant="bordered" onPress={() => {
            setGroupId("")
            setMentorId("")
            setCount("10")
            setExpiresInDays("7")
            setPointsPerScan("1")
            setMode("single")
            setError(null)
          }}>Reset</Button>
          <Button color="primary" onPress={handleSubmit} isDisabled={submitting}>
            {submitting ? <Spinner size="sm" /> : "Generate"}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}


