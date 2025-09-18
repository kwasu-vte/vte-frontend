# **MASTER PLAN: VTE Frontend Refactoring**

**Version:** 4.0 (The Definitive Blueprint)

## **1. Executive Summary**

The `vte-frontend` codebase is critically undermined by architectural inconsistencies, duplicated logic, and significant security vulnerabilities. This document outlines a definitive, phased plan to refactor the application into a modern, secure, and maintainable Next.js project.

**Key Objectives:**
-   **Centralize Architecture:** Establish a single source of truth for authentication, API communication, state management, and UI components.
-   **Enhance Security:** Eradicate critical vulnerabilities by implementing a modern, server-centric authentication pattern with `httpOnly` cookies.
-   **Unify User Interface:** Consolidate the component library by standardizing on **NextUI**, themed by a strict, minimal design system.
-   **Improve Developer Experience:** Implement clear, consistent patterns for data fetching, state management, and type safety to accelerate development and reduce bugs.

**Expected Outcomes:**
-   **Security:** 100% elimination of client-side token storage vulnerabilities.
-   **Maintainability:** 80% reduction in duplicated code.
-   **Velocity:** 60% improvement in development speed due to consistent patterns.
-   **Reliability:** 90% reduction in runtime errors through robust state management.

---

## **2. Foundational Architecture & Strategy**

This plan rests on four non-negotiable pillars.

### **2.1. Centralized Architecture**
-   **Authentication:** One secure, `httpOnly` cookie-based system using Next.js Middleware and Server Actions.
-   **API Layer:** One unified `api.ts` service for all data fetching.
-   **State Management:** One global `AuthContext` and a mandatory pattern for handling all data states.
-   **Component Architecture:** One unified layout system (`AppShell`) and a single UI library (**NextUI**).
-   **Type Safety:** One canonical `types.ts` file as the single source of truth for all data models.

### **2.2. Secure, Modern Authentication**
-   **MANDATE:** The legacy client-side token management (`js-cookie`, `localStorage`) is a critical security risk and **MUST be completely removed.**
-   **SOLUTION:** All session tokens will be stored exclusively in `httpOnly` cookies, managed by Next.js Server Actions. Client-side JS will have zero access to tokens.
-   **ENFORCEMENT:** `src/middleware.ts` will protect all authenticated routes.
-   **UI STATE:** A server-hydrated React Context (`AuthContext`) will manage the *non-sensitive* user profile data.

### **2.3. Clear User Roles & Permissions**
-   **Roles:** `Admin`, `Mentor`, `Student`.
-   **UI Control:** A `permissions.ts` utility will manage UI visibility based on these roles.

---

## **3. The Canonical API & Type Model**

A single, unified data model will be defined in `src/lib/types.ts`. The `api.ts` service will be responsible for transforming any inconsistent API responses into these canonical types.

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

// --- CONFIGURATION ---
export interface SystemConfig {
    semesterStartDate: string;
    enrollmentEndDate: string;
    maxSkillsPerStudent: number;
    allow300LevelSelection: boolean;
}
```

---

## **4. Definitive Application & Component Structure**

### **4.1. Target File Structure**
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
│   └── features/              // Domain-specific compositions
├── context/
│   ├── AuthContext.tsx
├── lib/
│   ├── actions.ts             // Server Actions
│   ├── api.ts                 // Central API service
│   ├── permissions.ts         // Role-based permission checks
│   └── types.ts               // THE CANONICAL TYPES
└── middleware.ts              // Route protection
```

### **4.2. Component Inventory**

-   **NextUI Components (To Be Used):**
    -   `Button`, `Card`, `Modal`, `Table`, `Input`, `Select`, `Checkbox`, `Switch`, `Tabs`, `Skeleton`, `Spinner`, `Alert`, `User`, `Dropdown`, `Pagination`, `Breadcrumb`, `DatePicker`.
-   **Custom Layout Components (To Be Built):**
    -   `AppShell`, `Sidebar`, `Header`, `PageHeader`.
-   **Custom Shared Components (To Be Built):**
    -   `StateRenderer`, `DataTable`, `StatCard`, `CalendarView`, `EmptyState`, `ErrorState`.
-   **Custom Feature Components (To Be Built):**
    -   `SignInForm`, `SignUpForm`, `SkillsTable`, `StudentsTable`, `SystemConfigForm`, `SkillSelectionForm`, `QRCodeScanner`.

---

## **5. The Critical Pattern: Robust State Management**

This is the non-negotiable pattern for displaying all asynchronous data.

-   **1. The `<StateRenderer />` Component:**
    -   **Instruction:** Build a generic wrapper component, `src/components/shared/StateRenderer.tsx`. It will accept a `queryResult` object from React Query and conditionally render the correct UI for `isLoading`, `isError`, `empty`, and `success` states.
-   **2. Enforce Usage with `@tanstack/react-query`:**
    -   **Instruction:** All client-side data fetching **MUST** be done using `useQuery`. This provides the necessary state object for the `<StateRenderer />`.

---

## **6. Comprehensive Implementation Plan & Component Specs**

This is the phased, step-by-step guide for the entire refactoring process.

### **Phase 1: Foundation & Security (Immediate Priority)**

1.  **Clean Slate & Setup:**
    -   **Task:** Delete all legacy auth files (`useAuth.ts`, etc.), old component libraries (`@mui`), duplicated sidebars, and hardcoded credentials.
    -   **Task:** Create the new directory structure and the canonical `types.ts` file. Convert all `.js`/`.jsx` to `.tsx`.
2.  **Implement New Authentication Core:**
    -   **Task:** Create `middleware.ts`, `lib/auth.ts`, `context/AuthContext.tsx`, and Server Actions in `lib/actions.ts` for `signIn` and `signOut`.
3.  **Rebuild Auth Pages:**
    -   **Task:** Rebuild `/auth/sign_in` and `/auth/sign-up` using NextUI components that call the new Server Actions.
        -   **`SignInForm`/`SignUpForm` Spec:** Client components using `react-hook-form` and `Zod`. UI is built with NextUI `<Card>`, `<Input>`, and `<Button>`. The submit button must show an `isLoading` state. Any errors from the Server Action are displayed in an `<Alert>` component.

### **Phase 2: Unify Layout & API**

1.  **Implement Design System:**
    -   **Task:** Configure `tailwind.config.ts` with the design system tokens to theme NextUI.
2.  **Build Unified Layout (`/components/layout/`):**
    -   **Task:** Build the `<AppShell />`, `<Sidebar />`, and `<Header />` components.
        -   **`AppShell` Spec:** A two-column CSS grid that wraps the `{children}`. It fetches the user session server-side and provides it to its children.
        -   **`Sidebar` Spec:** A single, role-aware component. It takes `user` as a prop, uses the `permissions.ts` utility to generate the correct list of navigation links, and renders them. It uses `usePathname` to highlight the active link.
        -   **`Header` Spec:** A sticky header with `<Breadcrumb>` and a user dropdown menu.
    -   **Task:** Implement the `<AppShell />` in `/app/(authenticated)/layout.tsx`.
3.  **Create Central API Service (`/lib/api.ts`):**
    -   **Task:** Create a new centralized `api.ts` service with typed methods for all endpoints and unified error handling.

### **Phase 3: Establish Core Patterns & Refactor a Template Page**

1.  **Build Core Shared Components (`/components/shared/`):**
    -   **Task:** Build the `<StateRenderer />` component as defined in Part 5.
    -   **Task:** Build the generic `<DataTable />` component.
        -   **`DataTable` Spec:** A wrapper around NextUI `<Table>`. It accepts `queryResult`, `columns`, and `renderCell` props. It uses `<StateRenderer />` internally to handle its own states. `loadingComponent` should be a series of `<Skeleton>` rows. `emptyComponent` should be an `<EmptyState>` message.
2.  **Refactor the Template Page (`/admin/skills`):**
    -   **Task:** Migrate the old `skillManagement` page to this new route.
    -   **Implementation:** This page will use `useQuery` to call `api.skills.getAll()`. The result is passed to the `<DataTable />` (wrapped in a feature-specific `<SkillsTable />` component). The page header will contain a button to open a `<Modal>` with a form for creating a new skill, which submits via a Server Action. This page is the blueprint for all other data-driven pages.

### **Phase 4: Full-Scale Migration & Feature Implementation**

-   **Instruction:** With the foundation and patterns established, methodically migrate every old page into the new file structure, one by one. For each page:
    1.  Create the new file in the correct role-based directory.
    2.  Apply the `<AppShell />` layout.
    3.  Replace all old data fetching logic with `useQuery` and the `api.ts` service.
    4.  Wrap all data-dependent UI in the `<StateRenderer />` component.
    5.  Rebuild the UI using the themed NextUI components, following the Design System.
    6.  Convert all form submissions to use Server Actions.
    7.  Once the new page is functional, delete the old root-level page file.