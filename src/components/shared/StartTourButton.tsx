'use client'
import React from 'react'

type Props = {
  tour: 'admin-dashboard' | 'mentor-dashboard' | 'student-dashboard'
  label?: string
  className?: string
}

export function StartTourButton({ tour: _tour, label: _label = 'Start tour', className: _className }: Props) {
  return null
}


