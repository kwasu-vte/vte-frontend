You are right. A "Grand Blueprint" should not require cross-referencing. It needs to be the single, exhaustive document that contains every piece of required information in one place. My apologies for not providing that level of completeness initially.

This is the **Master Plan**. It integrates the detailed analysis, the architectural strategy, the definitive file structure, the component and state management patterns, and the explicit implementation phases into one cohesive and comprehensive document. It is designed to be the only high-level guide your team will need.

---

# **MASTER PLAN: VTE Frontend Refactoring & Re-architecture**

**Version:** 3.1 (Definitive Edition)

## **1. Executive Summary**

The `vte-frontend` codebase is critically undermined by architectural inconsistencies, duplicated logic, and significant security vulnerabilities. This document outlines a definitive, phased plan to refactor the application into a modern, secure, and maintainable Next.js project.

**Key Objectives:**
-   **Centralize Architecture:** Establish a single source of truth for authentication, API communication, state management, and UI components.
-   **Enhance Security:** Eradicate critical vulnerabilities by implementing a modern, server-centric authentication pattern with `httpOnly` cookies.
-   **Unify User Interface:** Consolidate the component library by standardizing on **NextUI**, themed by a strict, minimal design system.
-   **Improve Developer Experience:** Implement clear, consistent patterns for data fetching, state management, and type safety to accelerate development and reduce bugs.

**Expected Outcomes:**
-   **Security:** 100% elimination of client-side token storage vulnerabilities.
-   **Maintainability:** 80% reduction in duplicated code (especially in layout and authentication).
-   **Velocity:** 60% improvement in development speed due to consistent patterns and a unified component library.
-   **Reliability:** 90% reduction in runtime errors through robust state management and full TypeScript adoption.

---

## **2. Foundational Architecture & Strategy**

This plan is built on the critical insights from the project analysis and the functional overview.

### **2.1. Adopt a Centralized Architecture**
The core problem is chaos. We will solve this by centralizing everything:
-   **Authentication:** One secure, server-side, `httpOnly` cookie-based system.
-   **API Layer:** One unified `api.ts` service for all data fetching with unified error handling.
-   **State Management:** One global `AuthContext` for user session and a consistent pattern for handling loading, empty, and error states for all data-driven components.
-   **Component Architecture:** One unified layout system (`AppShell`) and one UI library (**NextUI**).
-   **Type Safety:** One canonical `types.ts` file as the single source of truth for all data models, resolving any API inconsistencies.

### **2.2. Implement a Secure, Modern Authentication Flow**
-   **MANDATE:** The legacy client-side token management (`js-cookie`, `localStorage`) is a critical security vulnerability and **MUST be completely removed.**
-   **SOLUTION:** We will implement a server-centric authentication flow. All session tokens **will be stored exclusively in `httpOnly` cookies**, managed by Next.js Server Actions. Client-side JavaScript will have no access to tokens, eliminating XSS-based session hijacking.
-   **ENFORCEMENT:** `src/middleware.ts` will protect all authenticated routes (e.g., `/admin`, `/mentor`, `/student`), redirecting unauthenticated users to the sign-in page.
-   **UI STATE:** A React Context (`AuthContext`) will manage the *non-sensitive* user profile data on the client side, hydrated securely from the server.

### **2.3. Define Clear User Roles & Permissions**
The system has three distinct roles. A `permissions.ts` utility will manage UI visibility.
-   **Admin:** Full access.
-   **Mentor:** Access to assigned groups and students.
-   **Student:** Access to their personal profile, skills, and groups.

### **2.4. Consolidate and Unify the Component Library**
-   **Single UI Library:** Standardize on **NextUI**. All instances of Material-UI and Radix UI will be removed.
-   **Unified Layout:** Create a single, flexible `<AppShell />` component that adapts its layout and sidebar content based on the logged-in user's role. **All five existing sidebar components will be deleted** and replaced by this single, intelligent component.

---

## **3. The Canonical API & Type Model**

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
    practicalsPerDay: number;
    studentsPerGroup: number;
    // ... add all other settings from the overview
}
```

---

## **4. Definitive Application & Component Structure**

This is the target file structure.

```
src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── auth/
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (authenticated)/
│   │   ├── layout.tsx         // THE <AppShell /> GOES HERE
│   │   ├── admin/
│   │   ├── mentor/
│   │   └── student/
│   ├── globals.css
│   └── layout.tsx             // Root layout with Context Providers
├── components/
│   ├── layout/                // AppShell, Sidebar, Header
│   ├── shared/                // DataTable, StateRenderer, CalendarView, etc.
│   ├── features/              // Domain-specific compositions
│   └── ui/                    // (Optional) Re-exports of NextUI components
├── context/
│   ├── AuthContext.tsx
│   └── AppContext.tsx
├── lib/
│   ├── actions.ts             // Server Actions for forms (e.g., login, createSkill)
│   ├── api.ts                 // Centralized API service
│   ├── auth.ts                // Auth utilities (get session from cookies)
│   ├── permissions.ts         // Role-based permission checks
│   ├── types.ts               // THE CANONICAL TYPES
│   └── utils.ts
└── middleware.ts              // Route protection
```

---

## **5. The Critical Pattern: Robust State Management**

To fulfill the urgent requirement for handling all UI states, we will implement a mandatory pattern for all data-fetching components.

### **5.1. The `<StateRenderer />` Component**
-   **Instruction:** Build a generic wrapper component, `src/components/shared/StateRenderer.tsx`. This component will accept props for all possible states and render the correct UI. This pattern is **non-negotiable** for data display.
    ```tsx
    interface StateRendererProps<T> {
      data: T | undefined;
      isLoading: boolean;
      error: Error | null;
      loadingComponent?: React.ReactNode;
      errorComponent?: React.ReactNode;
      emptyComponent?: React.ReactNode;
      children: (data: NonNullable<T>) => React.ReactNode; // Success
    }
    ```
-   **Logic:**
    1.  If `isLoading` is true, render the `loadingComponent` (e.g., NextUI `Spinner` or `Skeleton`).
    2.  If `error` is not null, render the `errorComponent` (e.g., an alert with a "Retry" button).
    3.  If `data` is null, undefined, or an empty array, render the `emptyComponent`.
    4.  If `data` exists, call the `children` render prop with the data.

### **5.2. Enforce Usage with `@tanstack/react-query`**
-   **Instruction:** All client-side data fetching **MUST** be done using `@tanstack/react-query`. The `useQuery` hook naturally provides the `data`, `isLoading`, and `error` states that feed directly into our `<StateRenderer />`.

### **5.3. Example Usage (`/admin/skills/page.tsx`)**
```tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StateRenderer } from '@/components/shared/StateRenderer';
import { SkillsTable } from '@/components/features/admin/SkillsTable';
import { Skeleton } from '@nextui-org/react';

export default function SkillsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['skills'],
    queryFn: () => api.skills.getAll(),
  });

  return (
    <div>
      <PageHeader title="Skill Management" actionButton={<CreateSkillModal />} />
      <StateRenderer
        data={data}
        isLoading={isLoading}
        error={error}
        loadingComponent={<Skeleton className="h-64 w-full" />}
        emptyComponent={<EmptyState message="No skills created." />}
        errorComponent={<ErrorState />}
      >
        {(skills) => <SkillsTable skills={skills} />}
      </StateRenderer>
    </div>
  );
}
```

---

## **6. Comprehensive Implementation Plan**

This is the step-by-step guide for the refactoring.

### **Phase 1: Foundation & Security (Immediate Priority)**
1.  **Setup & Typing:**
    -   **Task:** Create `src/lib/types.ts`. Populate it with the canonical types from Part 3.
    -   **Task:** Convert all existing `.js` and `.jsx` files to `.tsx`. Enable strict mode in `tsconfig.json`.
2.  **Authentication Core:**
    -   **Task:** **Delete `src/lib/useAuth.ts`, `src/lib/auth.js`, all `js-cookie` logic, and all hardcoded credentials.**
    -   **Task:** Create `src/middleware.ts` to protect the `(authenticated)` route group.
    -   **Task:** Create `src/lib/auth.ts` for server-side session utilities.
    -   **Task:** Create `src/context/AuthContext.tsx` to hold the user profile state.
    -   **Task:** Create Server Actions in `src/lib/actions.ts` for `signIn` and `signOut`.
3.  **Refactor Login/Signup Pages:**
    -   **Task:** Rebuild the `/auth/sign-in` and `/auth/sign-up` pages using NextUI components that call the new Server Actions.

### **Phase 2: Unify Layout & UI**
1.  **Implement Design System:**
    -   **Task:** Configure `tailwind.config.ts` with the design system tokens to theme NextUI.
    -   **Task:** Add all CSS variable definitions to `globals.css`.
2.  **Unify Layout:**
    -   **Task:** **Delete all five existing sidebar components.**
    -   **Task:** Build the `<AppShell />`, `<Sidebar />`, and `<Header />` components in `/components/layout/`.
    -   **Task:** Implement the `<AppShell />` in `/app/(authenticated)/layout.tsx`. The `<Sidebar />` inside it should dynamically render navigation links based on the user's role from the `AuthContext`.
3.  **Standardize on NextUI:**
    -   **Task:** Systematically replace all `@mui` and `@radix-ui` components with their NextUI equivalents. `npm uninstall` the old libraries upon completion.

### **Phase 3: Centralize API & State**
1.  **Create API Service (`/lib/api.ts`):**
    -   **Task:** **Delete all files in `src/lib/queries` and `src/hooks/mutations`.**
    -   **Task:** Create a new centralized `api.ts` service with typed methods for all endpoints, which handles adding the auth token from server-side cookies.
2.  **Implement State Management Pattern:**
    -   **Task:** Build the `<StateRenderer />` component as defined in Part 5.
    -   **Task:** Build a generic `<DataTable />` wrapper around the NextUI `Table` that internally uses `<StateRenderer />` for its states.
3.  **Refactor a Template Page:**
    -   **Task:** Refactor the `/admin/skills` page completely to use `useQuery`, the new `api.ts` service, and the `<StateRenderer />` pattern. This page will serve as the gold standard for all subsequent page refactors.

### **Phase 4: Implement Core Feature Flows**
-   **Instruction:** With the foundation and patterns now established, methodically refactor each page. For every page:
    1.  Apply the `<AppShell />` layout.
    2.  Use `useQuery` and the `api.ts` service to fetch all necessary data.
    3.  Wrap all data-dependent UI in the `<StateRenderer />` component, providing custom UI for the `loading`, `empty`, and `error` states.
    4.  Build all UI with the themed NextUI components, following the Design System Guide.
    5.  Use Server Actions for all form submissions and mutations.
    6.  Reference the original "Functional Overview" to ensure all business logic (e.g., rules for 300-level students) is correctly implemented in the UI.

---

## **7. Success Metrics**

### **Quantitative**
-   **TypeScript Coverage**: 100%
-   **Code Duplication** (via SonarQube/Codacy): < 5%
-   **Test Coverage**: > 80%
-   **Lighthouse Performance Score**: > 90
-   **Security Vulnerabilities** (via Snyk/Dependabot): 0 critical

### **Qualitative**
-   **Architectural Clarity**: A new developer can understand the data flow within 30 minutes.
-   **Component Reusability**: The same `<DataTable />` component is used for skills, students, and groups.
-   **Pattern Consistency**: All pages handle loading, empty, and error states identically.
-   **Developer Feedback**: The team reports a significant improvement in their ability to ship features without introducing bugs.