'use client'

import React from 'react'
import { SkillSelectionGrid } from '@/components/features/student/SkillSelectionGrid'
import { useRouter } from 'next/navigation'
import SkillDetailModal from '@/components/features/student/SkillDetailModal'

interface StudentSkillsClientProps {
  availableSkills: any[]
  studentLevel: string
}

export default function StudentSkillsClient({ availableSkills, studentLevel }: StudentSkillsClientProps) {
  const router = useRouter()
  const [selectedSkillId, setSelectedSkillId] = React.useState<string | null>(null)
  const selectedSkill = React.useMemo(() => availableSkills.find(s => s.id === selectedSkillId) || null, [availableSkills, selectedSkillId])

  const handleSelectSkill = (skillId: string) => {
    setSelectedSkillId(skillId)
  }

  const handleClose = () => setSelectedSkillId(null)
  const handleEnroll = (skillId: string) => {
    router.push(`/student/enrollment?skill=${encodeURIComponent(skillId)}`)
  }

  return (
    <>
      <SkillSelectionGrid
        availableSkills={availableSkills}
        studentLevel={studentLevel}
        onSelectSkill={handleSelectSkill}
        isLoading={false}
      />
      <SkillDetailModal
        isOpen={!!selectedSkillId}
        onClose={handleClose}
        onEnroll={handleEnroll}
        skill={selectedSkill}
        studentLevel={studentLevel}
      />
    </>
  )
}


