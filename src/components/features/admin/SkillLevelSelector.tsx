"use client"
import React, { useMemo } from "react"
import { Checkbox, CheckboxGroup } from "@nextui-org/react"

/**
 * * SkillLevelSelector
 * Controlled multi-select for student levels.
 */
export type SkillLevelSelectorProps = {
  selectedLevels: number[]
  onChange: (levels: number[]) => void
  showCounts?: boolean
  countsByLevel?: Partial<Record<100|200|300|400|500, number>>
}

const ALL_LEVELS = [100, 200, 300, 400, 500] as const

export default function SkillLevelSelector({ selectedLevels, onChange, showCounts = false, countsByLevel }: SkillLevelSelectorProps) {
  const values = useMemo(() => selectedLevels.map(String), [selectedLevels])

  return (
    <CheckboxGroup
      label="Allowed Levels"
      value={values}
      onValueChange={(vals) => onChange(vals.map(v => parseInt(v, 10)))}
      orientation="horizontal"
      className="gap-3"
    >
      {ALL_LEVELS.map((lvl) => {
        const label = showCounts && countsByLevel?.[lvl as 100|200|300|400|500] !== undefined
          ? `${lvl} (${countsByLevel?.[lvl as 100|200|300|400|500]})`
          : `${lvl}`
        return (
          <Checkbox key={lvl} value={String(lvl)}>
            {label}
          </Checkbox>
        )
      })}
    </CheckboxGroup>
  )
}


