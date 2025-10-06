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


