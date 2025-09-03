### **Definitive Page & Route Implementation Guide**

This document details the purpose, required components, and data fetching logic for every page within the `src/app` directory.

#### **Layouts (`/app/`)**

*   **`layout.tsx` (Root Layout)**
    *   **Purpose:** The absolute root of the application. Its primary job is to provide global context and styling.
    *   **Content:**
        1.  `<html>` and `<body>` tags with the design system's fonts and background colors applied.
        2.  **`<Providers>` Component:** A client-side component that wraps `{children}` with all necessary context providers:
            *   `<NextUIProvider>`: Enables the NextUI component library.
            *   `<QueryClientProvider>`: Enables `@tanstack/react-query` for data fetching.
            *   `<AuthProvider>`: Provides the user session state to the client.
            *   `<AppContext>`: Provides global UI state (e.g., notifications, theme).
        3.  **Toaster/Sonner Component:** Renders the global toast notification system for feedback on actions.

*   **`(public)/layout.tsx`**
    *   **Purpose:** Provides a minimal, centered layout for pages accessible to unauthenticated users.
    *   **Content:** A simple `flex` container that centers its `{children}` vertically and horizontally in the middle of the screen (e.g., for login/signup cards).

*   **`(authenticated)/layout.tsx`**
    *   **Purpose:** The main application shell for all logged-in users. This is where the core UI structure lives.
    *   **Content:**
        1.  **`<AppShell />` Component:** This is the only component in this layout.
        2.  **Server-Side Logic:** This layout will fetch the current user's session data on the server (using the `getSession` utility from `lib/auth.ts`) and pass it as an initial prop to the `<AuthProvider>` to hydrate the client-side context immediately on load.

---

#### **Authentication Routes (`/app/auth/`)**

*   **`sign-in/page.tsx`**
    *   **Purpose:** To allow all users (Admin, Mentor, Student) to securely log in.
    *   **Components:**
        *   A `<Card>` from NextUI to contain the form, styled with a max-width.
        *   A `<CardHeader>` with the title "Welcome Back" and a subtitle "Sign in to your VTE account".
        *   A `<CardBody>` containing the `<SignInForm />` feature component.
    *   **Data Flow:** The `<SignInForm />` is a client component that uses a Server Action (`signIn` from `/lib/actions.ts`) for its `onSubmit` handler. It will use `useFormState` or a similar hook to manage the form's state, displaying loading states on the submit `Button` and showing any error messages returned from the server action's response in an `<Alert>` component.

*   **`sign-up/page.tsx`**
    *   **Purpose:** To allow new students to register for an account.
    *   **Components:**
        *   A `<Card>` to contain the form.
        *   A `<CardHeader>` with the title "Create Your Account".
        *   A `<CardBody>` containing the `<SignUpForm />` feature component. This form will have fields for all required user information.
    *   **Data Flow:** Same as sign-in; it uses a `signUp` Server Action. It must include client-side and server-side validation (using Zod) for all fields, especially for matching passwords.

---

#### **Admin Routes (`/app/(authenticated)/admin/`)**

*   **`dashboard/page.tsx`**
    *   **Purpose:** To provide the Admin with a high-level, at-a-glance overview of the entire system.
    *   **Components:**
        *   `<PageHeader>` with the title "Admin Dashboard".
        *   A responsive grid of `<StatCard />` components displaying key metrics: "Total Students," "Active Skills," "Groups Formed," and "Total Mentors."
        *   A `<Card>` containing a chart (using a library like `recharts`) showing student enrollment trends over the last 30 days.
        *   A `<Card>` with a list of "Recent Activities" or notifications (e.g., "New skill created," "Mentor assigned to Group X").
    *   **Data Flow:** This page will fetch data for all stat cards and charts server-side in the `page.tsx` itself to ensure a fast, non-loading initial render. The "Recent Activities" might be a client-side component that fetches periodically.

*   **`skills/page.tsx`**
    *   **Purpose:** To create, view, update, and delete all vocational skills.
    *   **Components:**
        *   `<PageHeader>` with the title "Skill Management" and an action `Button` that opens a `<CreateSkillModal />`.
        *   `<StateRenderer />` to robustly handle the data fetching states.
        *   `<SkillsTable />` (a feature component) rendered on success. This table will display columns for Title, Price, Capacity (`current/max`), and an "Actions" column with `DropdownMenu` containing "Edit" and "Delete" options for each row.
    *   **Data Flow:** The page uses `useQuery` to fetch all skills via `api.skills.getAll()`. The create, update, and delete actions are handled by Server Actions, which will invalidate the 'skills' query key using the Query Client to trigger a seamless refetch and UI update.

*   **`students/page.tsx`**
    *   **Purpose:** To manage all students in the system, view their details, and perform bulk actions.
    *   **Components:**
        *   `<PageHeader>` with the title "Student Management."
        *   A filter section with `Input` (for searching by name/matric) and `Select` (for filtering by level/group).
        *   `<StateRenderer />`.
        *   `<StudentsTable />` on success. It will support row selection via `Checkbox`.
        *   A contextual toolbar that appears when rows are selected, containing bulk actions like "Assign to Group."
        *   An "Auto-assign" `Button` that triggers a Server Action.
    *   **Data Flow:** Uses `useQuery` to fetch all students (`api.students.getAll()`). Filters will update the query parameters and automatically trigger a refetch. Bulk actions and auto-assign will call Server Actions.

*   **`groups/page.tsx`**
    *   **Purpose:** To manage student groups, assign mentors, and view group compositions.
    *   **Components:**
        *   `<PageHeader>` with the title "Group Management."
        *   `<StateRenderer />`.
        *   `<GroupsTable />` on success, showing Group Name, Associated Skill, Assigned Mentor, and Member Count. Actions include "View Details," "Edit Mentor," and "Delete."
    *   **Data Flow:** Uses `useQuery` to fetch all groups (`api.groups.getAll()`).

*   **`settings/page.tsx`**
    *   **Purpose:** To configure system-wide rules and parameters that affect the entire application.
    *   **Components:**
        *   `<PageHeader>` with the title "System Configuration."
        *   A single `<Card>` containing the `<SystemConfigForm />`. This form will be composed of:
            *   `DatePicker` for semester and enrollment start/end dates.
            *   `Input` (type number) for `maxSkillsPerStudent`, `studentsPerGroup`, etc.
            *   `Switch` for boolean toggles like `allow300LevelSelection`.
            *   A single "Save Settings" `Button` in the `<CardFooter>` that is disabled until the form is dirty.
    *   **Data Flow:** The form uses `useQuery` to fetch the current settings to populate its initial state. The "Save" button calls a Server Action to update the configuration, providing a success/error toast on completion.

---

#### **Mentor Routes (`/app/(authenticated)/mentor/`)**

*   **`dashboard/page.tsx`**
    *   **Purpose:** To provide the Mentor with a focused overview of their direct responsibilities.
    *   **Components:**
        *   `<PageHeader>` with the title "Mentor Dashboard."
        *   A grid of `<Card isPressable>` components, one for each group the mentor is assigned to. Each card shows the group name, associated skill, and member count. Clicking a card navigates to the group's detail page.
        *   A `<Card>` displaying "Today's Schedule" with a list of upcoming classes or practicals for their groups.
    *   **Data Flow:** Fetches only the groups and schedule relevant to the currently authenticated mentor.

*   **`my-groups/[id]/page.tsx`**
    *   **Purpose:** A detailed workspace for managing a single group.
    *   **Components:**
        *   `<PageHeader>` with the group's name as the title.
        *   `<Tabs>` from NextUI with three panels:
            1.  **"Members":** A `<DataTable />` listing all students in the group with their contact info.
            2.  **"Attendance":** A view to take or review attendance records for the group's activities.
            3.  **"Chat":** A simple, real-time chat interface for group communication.
    *   **Data Flow:** Fetches all details for the specific group ID from the URL parameters.

---

#### **Student Routes (`/app/(authenticated)/student/`)**

*   **`dashboard/page.tsx`**
    *   **Purpose:** The student's main landing page, designed for a mobile-first experience.
    *   **Components:**
        *   A welcome `<Card>`: "Welcome, {student.firstName}!"
        *   A `<Card>` for "My Skills," listing the skills they are enrolled in.
        *   A `<Card>` for "My Group," showing their assigned group and mentor.
        *   An `<Alert color="warning">` if they have an outstanding payment.
    *   **Data Flow:** Fetches the student's complete profile, including enrolled skills, payment status, and group information.

*   **`skills/page.tsx`**
    *   **Purpose:** To allow students to select or view their skills based on system rules.
    *   **Components:**
        *   `<PageHeader>` with the title "Skill Enrollment."
        *   `<StateRenderer />` which fetches both the `SystemConfig` and the student's profile to determine the correct UI to show.
        *   **Conditional UI:**
            *   **If enrollment is closed or rules don't permit selection:** Display an `Alert` with a clear message like "Skill enrollment is currently closed" or "Your skills have been assigned automatically."
            *   **If enrollment is open:** Display the `<SkillSelectionForm />` feature component, which is a list of available skills with `Checkbox`es, respecting the `maxSkillsPerStudent` setting.
    *   **Data Flow:** The logic is highly dependent on the `SystemConfig` data. The form submission uses a Server Action.

*   **`payment/page.tsx`**
    *   **Purpose:** To handle student payments for skills.
    *   **Components:**
        *   `<PageHeader>` with the title "Payment."
        *   A `<Card>` displaying "Amount Due: {amount}."
        *   A `Button color="primary"` to "Proceed to Payment," which redirects to the payment provider.
        *   A `<DataTable />` showing the student's payment history.
    *   **Data Flow:** Fetches the student's payment status and history.

*   **`attendance/page.tsx`**
    *   **Purpose:** To allow students to mark their attendance for live sessions.
    *   **Components:**
        *   `<PageHeader>` with the title "Mark Attendance."
        *   A `<StateRenderer />` that checks if an activity is currently live for the student's group.
        *   **Conditional UI:**
            *   **If no activity is live:** An `Alert` saying "No active session to join."
            *   **If an activity is live:** The `<QRCodeScanner />` component is displayed and the camera is activated.
    *   **Data Flow:** Fetches the student's group schedule. This may require a real-time subscription or periodic refetching to accurately determine the live session status.