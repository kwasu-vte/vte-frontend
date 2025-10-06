'use client'
import React from 'react'
import { useOnborda } from 'onborda'

type Props = {
  tour: 'admin-dashboard' | 'mentor-dashboard' | 'student-dashboard'
  label?: string
  className?: string
}

export function StartTourButton({ tour, label = 'Start tour', className }: Props) {
  const { startOnborda } = useOnborda()
  return (
    <button
      type="button"
      className={className ?? 'px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary-600'}
      onClick={() => startOnborda(tour)}
    >
      {label}
    </button>
  )
}


