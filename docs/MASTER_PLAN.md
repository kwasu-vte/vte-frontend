# **MASTER PLAN: VTE Frontend Refactoring**

**Version:** 3.0 (Single Source of Truth Edition)
**Primary Goal:** Transform the VTE frontend into a secure, consistent, and maintainable Next.js application by centralizing architecture, standardizing on a single design system, and implementing robust state management for all user flows.

---

### **Part 1: Foundational Architecture & Strategy**

This plan is built on the critical insights from the existing analysis and functional overview.

**1. Centralized Architecture is Non-Negotiable:** The core problem is chaos. We will solve this by centralizing everything:
    *   **Authentication:** One secure, `httpOnly` cookie-based system using Next.js Middleware and Server Actions.
    *   **API Layer:** One unified `api.ts` service for all data fetching, with centralized error handling.
    *   **State Management:** One global `AuthContext` (for user session) and `AppContext` (for global UI state like notifications).
    *   **Component Architecture:** One unified layout system (`AppShell`) and a single UI library (**NextUI**, themed by our design system).
    *   **Type Safety:** One canonical `types.ts` file as the single source of truth for all data models, resolving API doc inconsistencies.

**2. Security-First Implementation:**
    *   **Eliminate `localStorage` for tokens.**
    *   `src/middleware.ts` will protect all authenticated routes (`/admin`, `/mentor`, `/student`).
    *   All user input must be validated using `Zod` before being sent to the API.

**3. Define Clear User Roles & Permissions:**
    *   **Roles:** `Admin`, `Mentor`, `Student`.
    *   **UI Control:** A `permissions.ts` utility will manage UI visibility based on these roles.

---

### **Part 2: The Canonical API & Type Model**

The provided API documentation is inconsistent. To prevent chaos, we will establish a **single, unified data model** in `src/lib/types.ts`. The frontend will be built against *this* model. The `api.ts` service will be responsible for transforming any inconsistent API responses into these canonical types.

```typescript
// src/lib/types.ts

// --- USER & AUTH ---
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  matricNumber: string | null;
  level: '200' | '300' | '400' | null;
  role: 'Admin' | 'Mentor' | 'Student';
  isActive: boolean;
  isSuperuser: boolean;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// --- CORE ENTITIES ---
export interface Skill {
  id: string;
  title: string;
  description: string;
  price: number;
  capacity: number;
  currentCapacity: number;
  // availableLevels: { level: string }[]; // Simplified for consistency
}

export interface Group {
  id: string;
  name: string;
  skill: Pick<Skill, 'id' | 'title'>;
  mentor: Pick<User, 'id' | 'firstName' | 'lastName'> | null;
  members: Pick<User, 'id' | 'firstName' | 'lastName'>[];
}

export interface Activity {
    id: string;
    title: string;
    type: 'class' | 'practical';
    startTime: string; // ISO Date string
    endTime: string;   // ISO Date string
    group: Pick<Group, 'id' | 'name'>;
}

// --- CONFIGURATION ---
export interface SystemConfig {
    semesterStartDate: string;
    semesterEndDate: string;
    maxSkillsPerStudent: number;
    allow300LevelSelection: boolean;
    enrollmentStartDate: string;
    enrollmentEndDate: string;
    // ... add all other settings from the overview
}
```

---

### **Part 3: Definitive Application & Component Structure**

This is the target file structure.

```
src/
├── app/
│   ├── (authenticated)/
│   │   ├── layout.tsx         // THE <AppShell /> GOES HERE
│   │   ├── admin/
│   │   ├── mentor/
│   │   └── student/
│   ├── auth/
│   └── layout.tsx             // Root layout with Context Providers
├── components/
│   ├── layout/                // AppShell, Sidebar, Header
│   ├── shared/                // DataTable, StateRenderer, CalendarView, etc.
│   └── features/              // Domain-specific compositions (e.g., SkillSelectionForm)
├── context/
│   ├── AuthContext.tsx
│   └── AppContext.tsx
├── lib/
│   ├── actions.ts             // Server Actions
│   ├── api.ts                 // Central API service
│   ├── auth.ts                // Auth utilities
│   ├── permissions.ts         // Role-based permissions
│   └── types.ts               // THE CANONICAL TYPES
└── middleware.ts              // Route protection
```

---

### **Part 4: The Critical Missing Piece: State Management Patterns**

This is the urgent note, formalized. Every data-displaying component or page **MUST** handle all four states. We will enforce this with a dedicated component.

**1. Create the `<StateRenderer />` Component:**
*   **Instruction:** Build a wrapper component, `src/components/shared/StateRenderer.tsx`. This component will accept props for all possible states and render the correct UI. This is non-negotiable.
    ```tsx
    interface StateRendererProps<T> {
      data: T | undefined;
      isLoading: boolean;
      error: Error | null;
      // Slots (as render props/children)
      loadingComponent?: React.ReactNode;
      errorComponent?: React.ReactNode;
      emptyComponent?: React.ReactNode;
      children: (data: NonNullable<T>) => React.ReactNode; // Success component
    }
    ```
*   **Logic:**
    1.  If `isLoading` is true, render the `loadingComponent` (e.g., NextUI `Spinner` or `Skeleton`).
    2.  If `error` is not null, render the `errorComponent` (e.g., an alert with a "Retry" button).
    3.  If `data` is null, undefined, or an empty array, render the `emptyComponent`.
    4.  If `data` exists, call the `children` render prop with the data.

**2. Enforce Usage with React Query:**
*   **Instruction:** All data fetching **MUST** be done using `@tanstack/react-query`. The `useQuery` hook naturally provides the `data`, `isLoading`, and `error` states that feed directly into our `<StateRenderer />`.

**Example Usage (`/admin/skills/page.tsx`):**
```tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { SkillsTable } from '@/components/features/admin/SkillsTable';
import { Skeleton, Spinner } from '@nextui-org/react';

export default function SkillsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['skills'],
    queryFn: () => api.skills.getAll(), // Assumes api service is structured
  });

  return (
    <div>
      <PageHeader title="Skill Management" actionButton={<CreateSkillModal />} />
      <StateRenderer
        data={data}
        isLoading={isLoading}
        error={error}
        loadingComponent={<Skeleton className="h-64 w-full" />}
        emptyComponent={<EmptyState message="No skills have been created yet." />}
        errorComponent={<ErrorState onRetry={() => queryClient.invalidateQueries(['skills'])} />}
      >
        {(skills) => <SkillsTable skills={skills} />}
      </StateRenderer>
    </div>
  );
}
```
This pattern makes robust state handling the default, not an afterthought.

---

### **Part 5: Comprehensive Implementation Plan**

This is the phased rollout plan.

#### **Phase 1: Foundation & Security (Immediate Priority)**
1.  **Setup & Typing:**
    *   **Create `src/lib/types.ts`:** Add the canonical types defined in Part 2.
    *   **Convert All Files to `.tsx`:** Enforce strict TypeScript across the project.
2.  **Authentication:**
    *   **Delete `src/lib/useAuth.ts` and `src/lib/auth.js`.**
    *   **Create `src/middleware.ts`** to protect the `(authenticated)` route group.
    *   **Create `src/lib/auth.ts` and `src/context/AuthContext.tsx`.**
    *   **Rebuild `/auth/sign-in`** using Server Actions and NextUI components. **REMOVE ALL HARDCODED CREDENTIALS.**

#### **Phase 2: Unify Layout & UI**
1.  **Setup Design System:**
    *   **Configure `tailwind.config.ts`** with the design system tokens to theme NextUI.
    *   **Add CSS variables to `globals.css`.**
2.  **Unify Layout:**
    *   **Delete all 5 existing sidebar components.**
    *   **Build the `<AppShell />`, `<Sidebar />`, and `<Header />`** components in `/components/layout/`.
    *   Implement the `<AppShell />` in the `(authenticated)/layout.tsx`.
3.  **Standardize on NextUI:**
    *   Begin replacing all `@mui` and `@radix-ui` components with their NextUI equivalents. Uninstall the old libraries once complete.

#### **Phase 3: Centralize API & State Patterns**
1.  **Create API Service (`/lib/api.ts`):**
    *   **Delete all files in `src/lib/queries` and `src/hooks/mutations`.**
    *   Create a new centralized `api.ts` service.
2.  **Build Core Shared Components:**
    *   **Create `<StateRenderer />`** as defined in Part 4.
    *   **Create a `<DataTable />`** wrapper around the NextUI `Table` that internally uses `<StateRenderer />` for its loading, empty, and error states.
3.  **Refactor one page:**
    *   Pick one page (e.g., `/admin/skills`) and refactor it completely to use the new `api.ts` service with `useQuery` and the `<StateRenderer />` pattern. This will serve as a template for all other pages.

#### **Phase 4: Implement Core Feature Flows**
*   **Instruction:** With the foundation and patterns now established, methodically work through each page defined in the application structure. For each page:
    1.  Apply the `<AppShell />` layout.
    2.  Use `useQuery` and the `api.ts` service to fetch data.
    3.  Use the `<StateRenderer />` to handle all UI states.
    4.  Build any necessary feature-specific components using NextUI as the base.
    5.  Use Server Actions for all form submissions.
    6.  Reference the original "Functional Overview" to ensure all business logic (e.g., rules for 300-level students) is correctly implemented in the UI.