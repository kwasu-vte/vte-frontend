import React from 'react'

type Step = {
  icon?: React.ReactNode | string
  title: string
  content: React.ReactNode
  selector: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  showControls?: boolean
  pointerPadding?: number
  pointerRadius?: number
  nextRoute?: string
  prevRoute?: string
}

type Tour = {
  tour: string
  steps: Step[]
}

export const steps: Tour[] = [
  {
    tour: 'admin-dashboard',
    steps: [
      {
        icon: <>👋</>,
        title: 'Welcome to Admin Dashboard',
        content: <>Overview cards and quick links to manage the system.</>,
        selector: '#admin-welcome',
        side: 'bottom',
        showControls: true,
      },
      {
        icon: <>📈</>,
        title: 'Key Metrics',
        content: <>Track groups, students, and capacity here.</>,
        selector: '#admin-stats',
        side: 'bottom',
        showControls: true,
      },
      {
        icon: <>⚡</>,
        title: 'Quick Actions',
        content: <>Jump to Sessions, QR Codes, and Reports.</>,
        selector: '#admin-quick-actions',
        side: 'left',
        showControls: true,
      },
    ],
  },
  {
    tour: 'mentor-dashboard',
    steps: [
      {
        icon: <>👋</>,
        title: 'Welcome Mentor',
        content: <>Today’s schedule and scan history at a glance.</>,
        selector: '#mentor-welcome',
        side: 'bottom',
        showControls: true,
      },
      {
        icon: <>🗓️</>,
        title: 'Today’s Schedule',
        content: <>Your practicals for today.</>,
        selector: '#mentor-today-schedule',
        side: 'bottom',
        showControls: true,
      },
      {
        icon: <>🔳</>,
        title: 'QR Quick Access',
        content: <>Access active QR codes for groups.</>,
        selector: '#mentor-qr-quick',
        side: 'left',
        showControls: true,
      },
    ],
  },
  {
    tour: 'student-dashboard',
    steps: [
      {
        icon: <>👋</>,
        title: 'Welcome Student',
        content: <>Finish your profile and enroll to get started.</>,
        selector: '#student-welcome',
        side: 'bottom',
        showControls: true,
      },
      {
        icon: <>✅</>,
        title: 'Enrollment Status',
        content: <>See your enrollment and actions needed.</>,
        selector: '#student-enrollment-status',
        side: 'bottom',
        showControls: true,
      },
      {
        icon: <>⚡</>,
        title: 'Quick Actions',
        content: <>Shortcuts to profile, skills, group, and schedule.</>,
        selector: '#student-quick-actions',
        side: 'left',
        showControls: true,
      },
    ],
  },
]


