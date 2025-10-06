### Onborda Product Tours Integration (Next.js App Router)

This guide shows how to integrate Onborda product tours in this project using the Next.js App Router, including installation, Tailwind setup, provider wiring, defining tours/steps, creating a custom card, and using hooks.

References:
- [Onborda setup](https://www.onborda.dev/docs)
- [App router integration](https://www.onborda.dev/docs/app-router)
- [Tours & steps](https://www.onborda.dev/docs/tours-steps)
- [Card](https://www.onborda.dev/docs/card)
- [Initializing & hooks](https://www.onborda.dev/docs/hooks)

---

## 1) Install dependency

```bash
pnpm add onborda
```

If you use npm or yarn, see the official instructions: [Onborda setup](https://www.onborda.dev/docs).

---

## 2) Tailwind content configuration

Tailwind must scan Onborda's distributed files. Add the path below to `tailwind.config.ts` `content` array.

```ts
// tailwind.config.ts (excerpt)
const config = {
  content: [
    // existing globs...
    './node_modules/onborda/dist/**/*.{js,ts,jsx,tsx}'
  ]
}
export default config
```

Source: [Onborda setup](https://www.onborda.dev/docs).

---

## 3) Wire the provider in App Router

Wrap the app tree with `OnbordaProvider` and `Onborda`. This typically belongs in `src/app/layout.tsx` so tours are globally available.

```tsx
// src/app/layout.tsx (excerpt)
import React from 'react'
import { Onborda, OnbordaProvider } from 'onborda'

// Example steps object (see section 4 for details)
import { steps } from '@/onborda/steps'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OnbordaProvider>
          <Onborda
            steps={steps}
            showOnborda={false}
            shadowRgb="55,48,163"
            shadowOpacity="0.8"
            // Optionally provide a custom card, see section 5
            // cardComponent={TourCard}
            // cardTransition={{ duration: 0.2, type: 'tween' }}
          >
            {children}
          </Onborda>
        </OnbordaProvider>
      </body>
    </html>
  )
}
```

Properties and usage are documented at [App router integration](https://www.onborda.dev/docs/app-router).

---

## 4) Define tours and steps

Each tour has a `tour` name and an array of `steps`. Each step points to a DOM element via `selector` (an id works great). Place matching `id` attributes on the elements you want to highlight.

```tsx
// src/onborda/steps.tsx
import React from 'react'

export const steps = [
  {
    tour: 'getting-started',
    steps: [
      {
        icon: <>👋</>,
        title: 'Welcome',
        content: <>This is your dashboard.</>,
        selector: '#dashboard-welcome',
        side: 'bottom',
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: '/student/dashboard',
      },
      {
        icon: <>📊</>,
        title: 'Your stats',
        content: <>Review key metrics here.</>,
        selector: '#stats-panel',
        side: 'right',
        showControls: true,
      },
    ],
  },
]
```

Attach ids in your pages/components:

```tsx
// Example usage in a page/component
export function DashboardHeader() {
  return <div id="dashboard-welcome">Welcome back!</div>
}

export function StatsPanel() {
  return <section id="stats-panel">...</section>
}
```

Supported step fields are described in [Tours & steps](https://www.onborda.dev/docs/tours-steps).

---

## 5) Create a custom Card (optional)

You can customize the tour card UI. Mark it as a client component and use Onborda’s prop types.

```tsx
// src/onborda/TourCard.tsx
'use client'
import React from 'react'
import type { CardComponentProps } from 'onborda'
import { useOnborda } from 'onborda'

export const TourCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}) => {
  const { closeOnborda } = useOnborda()

  const handleFinish = () => closeOnborda()

  return (
    <div className="rounded-md bg-white p-4 shadow">
      <p className="text-sm text-neutral-500">
        {currentStep + 1} of {totalSteps}
      </p>
      <h3 className="mt-1 text-lg font-semibold flex items-center gap-2">
        <span>{step.icon}</span> {step.title}
      </h3>
      <div className="mt-2 text-neutral-700">{step.content}</div>

      <div className="mt-4 flex items-center gap-2">
        {currentStep !== 0 && (
          <button className="btn" onClick={prevStep}>Previous</button>
        )}
        {currentStep + 1 !== totalSteps && (
          <button className="btn btn-primary" onClick={nextStep}>Next</button>
        )}
        {currentStep + 1 === totalSteps && (
          <button className="btn btn-success" onClick={handleFinish}>Finish</button>
        )}
        <button className="ml-auto text-sm text-neutral-500" onClick={closeOnborda}>Close</button>
      </div>
      <span className="sr-only">{arrow}</span>
    </div>
  )
}
```

Then pass it to the provider:

```tsx
<Onborda steps={steps} showOnborda={false} cardComponent={TourCard}>
  {children}
  {/* ... */}
  
</Onborda>
```

See [Card](https://www.onborda.dev/docs/card).

---

## 6) Control tours with hooks

Use `useOnborda()` to start or close a tour programmatically.

```tsx
'use client'
import { useOnborda } from 'onborda'

export function StartTourButton() {
  const { startOnborda, closeOnborda } = useOnborda()

  return (
    <div className="flex gap-2">
      <button className="btn btn-primary" onClick={() => startOnborda('getting-started')}>
        Start tour
      </button>
      <button className="btn" onClick={() => closeOnborda()}>
        Close tour
      </button>
    </div>
  )
}
```

Details: [Initializing & hooks](https://www.onborda.dev/docs/hooks).

---

## 7) Tips & conventions for this codebase

- Place shared tour definitions under `src/onborda/` (e.g., `steps.tsx`, `TourCard.tsx`).
- Use stable `id` attributes on elements referenced by `selector` to prevent breakage.
- Keep `showOnborda` default false in layout; trigger tours via hooks when needed (first-visit flows, feature announcements, etc.).
- If using Tailwind, ensure the `content` glob includes Onborda (section 2) so styles are generated in production builds.

---

## 8) Security note

Onborda displays UI only and does not manage secrets. Avoid placing sensitive data in tour content. Keep environment variables and keys in standard `.env` files and never commit secrets.


---

## 9) Dashboard Tours Plan (Admin, Mentor, Student)

This section plans the product tours for the three dashboards. It defines what to highlight, suggested `id` anchors to add, and recommended step options (e.g., `side`, `pointerPadding`). Keep ids stable to prevent breakage.

### Admin Dashboard Tour

- **Objective**: Help admins understand session context, KPIs, activity feed, and quick actions.
- **Key anchors** (already present):
  - `#admin-welcome` (header/session context)
  - `#admin-stats` (KPI cards grid)
  - `#admin-quick-actions` (quick actions + sessions list)
- **Suggested steps**:
```tsx
// src/onborda/steps.tsx (excerpt)
export const steps = [
  {
    tour: 'admin-dashboard',
    steps: [
      {
        icon: <>👋</>,
        title: 'Welcome to Admin Dashboard',
        content: <>See current academic session and status here.</>,
        selector: '#admin-welcome',
        side: 'bottom',
        showControls: true,
        pointerPadding: 10,
      },
      {
        icon: <>📊</>,
        title: 'Key metrics',
        content: <>Total Groups, Students, Full Groups, and With Capacity.</>,
        selector: '#admin-stats',
        side: 'right',
        showControls: true,
        pointerPadding: 12,
      },
      {
        icon: <>📝</>,
        title: 'Recent activity',
        content: <>Review latest enrollments. Use “View all” for filters.</>,
        selector: '#admin-quick-actions', // parent column; still visible contextually
        side: 'left',
        showControls: true,
        pointerPadding: 12,
      },
      {
        icon: <>⚡</>,
        title: 'Quick actions',
        content: <>Generate QR codes, manage sessions, and view reports.</>,
        selector: '#admin-quick-actions',
        side: 'left',
        showControls: true,
        pointerPadding: 12,
      },
    ],
  },
]
```

### Mentor Dashboard Tour

- **Objective**: Show mentors schedule, groups, workload, QR codes, and reports.
- **Add these ids in mentor components** (stable, descriptive):
  - `#mentor-welcome` on the page header/container of `MentorDashboard`
  - `#mentor-calendar` on `MentorCalendarView`
  - `#mentor-groups` on `MentorGroupsList`/`MentorGroupsPageView`
  - `#mentor-workload` on `MentorWorkloadView`
  - `#mentor-qr` on `MentorMyQRCodesView` or `MyQRCodesDisplay`
  - `#mentor-reports` on `MentorAttendanceReportsView` / `QRScanReport`
- **Suggested steps**:
```tsx
export const steps = [
  {
    tour: 'mentor-dashboard',
    steps: [
      { icon: <>👋</>, title: 'Welcome Mentor', content: <>Your tools live here.</>, selector: '#mentor-welcome', side: 'bottom', showControls: true, pointerPadding: 10 },
      { icon: <>📅</>, title: 'Calendar', content: <>See upcoming sessions and navigate dates.</>, selector: '#mentor-calendar', side: 'right', showControls: true, pointerPadding: 12 },
      { icon: <>👥</>, title: 'My groups', content: <>Open a group to view roster and details.</>, selector: '#mentor-groups', side: 'right', showControls: true, pointerPadding: 12 },
      { icon: <>📈</>, title: 'Workload', content: <>Track load across skills and sessions.</>, selector: '#mentor-workload', side: 'left', showControls: true, pointerPadding: 12 },
      { icon: <>� QR</>, title: 'QR codes', content: <>Use codes for attendance scanning.</>, selector: '#mentor-qr', side: 'left', showControls: true, pointerPadding: 12 },
      { icon: <>🧾</>, title: 'Reports', content: <>Generate attendance and scan reports.</>, selector: '#mentor-reports', side: 'left', showControls: true, pointerPadding: 12 },
    ],
  },
]
```

### Student Dashboard Tour

- **Objective**: Guide profile completion, enrollment status, QR scan, schedule, and payments.
- **Add/confirm these ids in student components**:
  - `#student-welcome` on the dashboard header/container
  - `#student-profile` on `ProfileCompletionAlert`/`ProfileCompletionModal` trigger region
  - `#student-enrollment` on `EnrollmentStatus`
  - `#student-actions` on `QuickActions`
  - `#student-scan` on `StudentQRScanner`/`StudentScanQR`
  - `#student-schedule` on `PracticalCalendar`/`UpcomingPracticals`
  - `#student-payment` on `PaymentRedirect` container (when visible)
- **Suggested steps**:
```tsx
export const steps = [
  {
    tour: 'student-dashboard',
    steps: [
      { icon: <>👋</>, title: 'Welcome', content: <>Start by completing your profile.</>, selector: '#student-welcome', side: 'bottom', showControls: true, pointerPadding: 10 },
      { icon: <>🪪</>, title: 'Profile', content: <>Open and fill required fields, then save.</>, selector: '#student-profile', side: 'right', showControls: true, pointerPadding: 12 },
      { icon: <>✅</>, title: 'Enrollment status', content: <>Understand pending/approved/paid/enrolled.</>, selector: '#student-enrollment', side: 'right', showControls: true, pointerPadding: 12 },
      { icon: <>⚡</>, title: 'Quick actions', content: <>Scan QR, view group, or open profile.</>, selector: '#student-actions', side: 'left', showControls: true, pointerPadding: 12 },
      { icon: <>📷</>, title: 'Scan QR', content: <>Allow camera and follow scan feedback.</>, selector: '#student-scan', side: 'left', showControls: true, pointerPadding: 12 },
      { icon: <>📅</>, title: 'Schedule', content: <>Track upcoming practicals and statuses.</>, selector: '#student-schedule', side: 'left', showControls: true, pointerPadding: 12 },
      { icon: <>💳</>, title: 'Payments', content: <>Handle payments safely when prompted.</>, selector: '#student-payment', side: 'left', showControls: true, pointerPadding: 12 },
    ],
  },
]
```

---

## 10) Responsive Positioning and Overflow Safety

Use the following conventions to keep tours readable on all screens and avoid clipping near viewport edges.

- **Choose `side` intentionally**: Prefer `bottom` or `right` for wide headers and KPI grids; use `left` for right-rail cards. Keep consistency across steps to reduce eye travel.
- **Use `pointerPadding` and `pointerRadius`**: Provide at least `10–14px` padding to avoid the card touching the highlight box and to create a readable pointer radius on small screens.
- **Constrain card width in a custom `cardComponent`**: Apply responsive Tailwind classes like `max-w-sm md:max-w-md lg:max-w-lg` and `w-[calc(100vw-2rem)]` to ensure the card fits on small viewports without overflow.
- **Respect safe areas**: Add padding inside your card using CSS env variables: `padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);` to avoid notches and rounded corners on mobile.
- **Prevent viewport overflow**: Keep card content concise; favor bullet points and short sentences. If content is lengthy, use collapsible details or multiple steps instead of one verbose step.
- **Scrollable targets**: Ensure target containers are not `overflow: hidden` when possible so the library can scroll them into view. For long pages, place anchors near the visible region of a section.
- **Mobile-first copy**: Write step content to fit within ~3–4 lines on a 360–390px wide device. Avoid large images/iframes inside cards.
- **QA in common breakpoints**: Manually test at 360×780, 768×1024, and 1440×900. Adjust `side` and content where necessary.

Example custom card width constraint:
```tsx
// src/onborda/TourCard.tsx (excerpt)
export const TourCard: React.FC<CardComponentProps> = (props) => {
  return (
    <div className="rounded-md bg-white p-4 shadow w-[calc(100vw-2rem)] max-w-sm md:max-w-md lg:max-w-lg">
      {/* existing content */}
    </div>
  )
}
```

Note: Keep `showOnborda` default `false` and trigger tours via `useOnborda().startOnborda('...')` from in-page buttons (e.g., Admin’s `StartTourButton`).


