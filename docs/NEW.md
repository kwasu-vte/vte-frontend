My focus will be on **layout, component choice, and information hierarchy** to ensure each view serves its primary purpose effectively. I will apply the "Mentorship Platform UI" design system we discussed (pastel green primary, clean neutrals, Figtree font, Heroicons).

Here is a page-by-page breakdown of the proposed dashboard arrangements.

---

### **General Layout Principles**

*   **Admin & Mentor Layout:** A two-part layout with a persistent **Sidebar Navigation** on the left and a main content area on the right. The content area will have a **Top Bar** with breadcrumbs and a user profile dropdown.
*   **Student Layout:** Can use the same sidebar pattern for consistency on desktop, or a simpler **Top Bar Navigation** with fewer items for a less-cluttered feel. On mobile, all roles will use a bottom tab bar or a hamburger menu.
*   **Page Headers:** Every page will have a clear `<h1>` title (e.g., "Skills Management," "My Dashboard") and, where appropriate, a header section containing primary actions (like a "Create" button) and filters.

---

### **Admin Pages: High-Density & Data-Centric**

The admin needs to see the big picture and perform powerful actions efficiently.

#### **`/admin/dashboard`**

*   **Core Goal:** Get a real-time overview of platform health and quick access to key management areas.
*   **Proposed Layout:**
    1.  **Header:** "Dashboard" title. A "Refresh" secondary button with a timestamp ("Last updated: ...") with relative time.
    2.  **Stat Card Grid (Top Row):** A 4 or 5-column grid of `Stat Cards`.
        *   **Cards:** "Active Academic Session," "Total Groups," "Total Students," "Full Groups," "Recent Enrollments (24h)."
        *   **Presentation:** Each card has a title, a large numeric value, and a subtle icon. The "Active Session" card can have a green "Active" badge.
    3.  **Two-Column Main Area:**
        *   **Left Column (70% width):** A `Card` titled "Recent Activity." Inside, a live-updating feed/table showing the last 10-15 enrollments, with student name, skill, and timestamp.
        *   **Right Column (30% width):** A `Card` titled "Quick Actions." This will contain a vertical list of links styled like `ListItemCards` (icon + text) pointing to "Manage Sessions," "Generate QR Codes," and "View Reports."

#### **`/admin/skills`**

*   **Core Goal:** Create, view, update, and delete skills.
*   **Proposed Layout:** A classic "List Page" pattern.
    1.  **Header:** "Skills" title. A `Primary Button` on the right: "+ Create Skill".
    2.  **Filter/Search Bar:** Below the header, a `Search Input` ("Search by title...") and a `Dropdown` to filter by academic session.
    3.  **Data Table:** A full-width `Table` displaying the skills.
        *   **Columns:** Skill Title, Status (an `Active`/`Archived` badge), Groups (count), Capacity (% full), Date Range.
        *   **Interactions:** Clicking a row navigates to `/admin/skills/[skillId]/groups`.
        *   **Actions Column:** A set of `Icon Buttons` for:
            *   **Edit:** Opens a modal/drawer to update skill details (uses `PATCH v1/skills/{id}`).
            *   **Manage Schedule:** Opens a dedicated modal for the date range (uses `POST v1/skills/{id}/date-range`).
            *   **Delete:** Opens a confirmation modal (uses `DELETE v1/skills/{id}`).

#### **`/admin/students` & `/admin/mentors`**

*   **Core Goal:** Find and manage users.
*   **Proposed Layout:** Follows the same "List Page" pattern as `/admin/skills`.
*   **Data Presentation (`/admin/students`):**
    *   **Table Columns:** Student Name (with Avatar), Matric No., Email, Enrollment Status (badge), Date Joined.
    *   **Actions:** A "View Profile" icon that opens a modal with their full details.
    *   **Not supported yet:** "Edit" and "Delete" student actions are not available in current API clients. UI can be stubbed; needs new endpoints/clients.
*   **Data Presentation (`/admin/mentors`):**
    *   **Table Columns:** Mentor Name (with Avatar), Specialization, Assigned Skills (count), Status (badge: Active/Inactive).
    *   **Actions:** "View Details" modal, and a key action: **"Assign Skills"** (supported via existing `assign-skill`/`remove-skill` endpoints).

#### **`/admin/enrollments`**

*   **Core Goal:** View all enrollments and assign students to groups.
*   **Proposed Layout:**
    1.  **Header:** "Enrollments" title.
    2.  **Filters (Crucial):** A prominent filter bar with `Dropdowns` for **Academic Session** and **Skill**.
    3.  **Action Button:** Once a skill is selected, a `Primary Button` "Auto-Assign All" becomes active. Clicking it shows a confirmation modal.
    4.  **Data Table:** Displays enrollments based on filters.
        *   **Columns:** Student Name, Matric No., Status (badge: "Unassigned," "Assigned," "Paid"), Group.
        *   **Actions:** For unassigned students, an "Assign Group" button that opens a modal to select a group with available capacity.

#### **`/admin/qr-codes`**

*   **Core Goal:** Generate and manage QR codes for attendance.
*   **Proposed Layout:**
    1.  **Header:** "QR Code Management" title. A `Primary Button` "+ Generate Codes" which launches the wizard modal.
    2.  **Selectors:** `Dropdowns` to select a **Skill** and then a **Group**.
    3.  **Data Table:** Lists all QR codes for the selected group.
        *   **Columns:** Token (shortened), Purpose, Points, Expiry Date, Status (badge: `Active`/`Expired`).
        *   **Actions:** "Print" icon, "View Scans" icon (navigates to scan history).
    *   **API Opportunity:** Add a "Bulk Generate" option next to the main button to leverage the `bulk-generate` endpoint, allowing admins to create codes for an entire skill at once.

---

### **Mentor Pages: Focused & Actionable**

The mentor needs quick access to their groups and attendance tools.

#### **`/mentor/dashboard`**

*   **Core Goal:** See today's tasks, upcoming schedule, and group status at a glance.
*   **Proposed Layout:**
    1.  **Header:** Personalized greeting, "Welcome, [Mentor Name]!".
    2.  **Two-Column Layout:**
        *   **Left Column (60%):**
            *   A `Card` titled "My Groups" with a compact list of their assigned groups. Each list item links to `/mentor/my-groups`.
        *   **Right Column (40%):**
            *   A `Card` for "Quick Access" with links to "My QR Codes" and "Attendance Reports."

#### **`/mentor/my-groups`**

*   **Core Goal:** View group rosters and their attendance.
*   **Proposed Layout:** A **two-pane layout**.
    1.  **Left Pane (Sidebar):** A searchable list of the mentor's groups.
    2.  **Right Pane (Main Content):** Displays details for the selected group.
        *   **Header:** Group Name and Skill.
        *   **Tabs:** Use `Tabs` to switch between "Roster" and "Attendance Report."
            *   **Roster Tab:** A simple table of students in that group.
            *   **Attendance Report Tab:** The same attendance report component used in `/admin/reports`, pre-filtered for this group.

<!-- Removed `/mentor/schedule` page due to unavailable sessions/practicals API. -->

---

### **Student Pages: Simple, Guided & Status-Driven**

The student needs a clear, step-by-step journey with minimal clutter.

#### **`/student/dashboard`**

*   **Core Goal:** Understand their current status and what to do next.
*   **Proposed Layout:** A single-column layout dominated by a **Stateful Guidance Card**.
    *   **State 1: No Profile:** A large, friendly card with an illustration. **Header:** "Let's get you set up!" **Body:** "Create your student profile to enroll in skills." `Primary Button`: "Create Profile" (links to `/student/profile/create`).
    *   **State 2: Profile, No Enrollment:** **Header:** "Ready to learn?" **Body:** "Your profile is complete. Browse our available skills to get started." `Primary Button`: "Browse Skills" (links to `/student/skills`).
    *   **State 3: Enrolled, Awaiting Assignment:** Use the **Enrollment Status Timeline** component here directly.
    *   **State 4: Assigned:** A `Card` showing "My Group" details (Skill, Group Name, Mentor). `Primary Button`: "View My Group."

#### **`/student/skills`**

*   **Core Goal:** Browse and enroll in a skill.
*   **Proposed Layout:** A grid of `Skill Cards`.
    *   Each card displays the Skill Title, a brief description, and key details (e.g., duration).
    *   The card has a `Secondary Button` "Learn More" (opens detail modal) and a `Primary Button` "Enroll Now" (navigates to the confirmation step on `/student/enrollment`).

#### **`/student/enrollment`**

*   **Core Goal:** Track enrollment progress and complete payment.
*   **Proposed Layout:**
    1.  **Header:** "My Enrollment Status" for [Skill Name].
    2.  **Enrollment Timeline:** A prominent vertical stepper showing the stages: `Enrolled` -> `Payment` -> `Group Assignment`. The current stage is highlighted using the primary green color.
    3.  **Payment Section:** If payment is pending, display a `Card` with payment details and a `Primary Button` "Proceed to Payment" that uses the `initiate payment` endpoint.

#### **`/student/my-group`**

*   **Core Goal:** View assigned group details.
*   **Proposed Layout:** Simple, read-only information display.
    *   Use clean `Cards` to present information.
    *   **My Group:** Card for "Group Details" (Name, Mentor).

VII. Specific High-Functionality Pages

These pages have unique requirements that deserve a specific design.
1. System Settings (/admin/sessions)

    Goal: Manage the academic calendar of the entire platform.

    Layout: A two-column settings page.

        Left Column (30%): A navigation list for different settings areas. For now, it's just "Academic Sessions."

        Right Column (70%):

            A Card titled "Current Active Session" showing key details of the running session. If none is active, this card becomes a prominent warning.

            A Table of all created sessions.

            Columns: Session Name, Start Date, End Date, Status (badge: Active, Ended, Upcoming).

            Actions: "Start" or "End" buttons on relevant sessions. An "Edit Dates" icon.

            Header Action: A Primary Button "+ Create Session" above the table.

2. QR Code Print Views (/admin/qr-codes/print...)

    Goal: Provide a clean, printer-friendly view of QR codes.

    Layout: This page should be chromeless—no sidebar, no top bar. Just the content.

        Single Print: A single A4-sized page layout displaying the QR code prominently, with the Group Name, Points, and Expiry Date clearly visible below it.

        Bulk/Dynamic Print: A grid layout designed to fit multiple QR codes on a single page (e.g., 8-10 per A4 sheet), often with cut lines. This view would be generated from a selection on the main /admin/qr-codes page.

3. Student Profile Creation (/student/profile/create)

    Goal: Make profile creation feel quick and manageable.

    Layout: Use a Stepper component at the top to show progress (e.g., Step 1: Personal Info, Step 2: Contact Info).

        Each step presents a small, focused group of form fields.

        Navigation is handled by "Next" and "Back" buttons, with a final "Submit" button on the last step. This breaks down a potentially long form into digestible chunks.

4. Student QR Scanner (/student/scan-qr)

    Goal: Provide a fast, reliable QR scanning experience.

    Layout: A mobile-first, full-screen view.

        The camera feed takes up most of the screen.

        An overlay with a square "targeting box" in the center to guide the user.

        Brief instructional text: "Point your camera at the QR code."

        Upon a successful scan, an overlay/modal appears with immediate feedback (Success! checkmark) and the points awarded.

This structured approach ensures that every page is designed with its primary user and goal in mind, creating a seamless and intuitive experience across the entire platform.


---

### **Detailed Design Instructions: From Layout to Interaction**

Here, we will break down each page with specific guidance on layout, component hierarchy, and the interactive flows that connect them.

---

### **Admin Pages: Designing for Control and Efficiency**

The admin's experience must be about power and clarity. Reduce clicks, surface critical data, and make complex actions feel simple.

#### **`/admin/dashboard`**

*   **Layout & Spacing:** The 70/30 two-column split is intentional. The left column (activity feed) is for scanning and awareness, while the right (actions) is for navigation. Use a significant `gap-8` (32px) between the columns to create a strong visual separation. The `Stat Card` grid should have a `gap-6` (24px) to feel uniform but distinct.

*   **Component Choice & Hierarchy:**
    *   **Stat Cards:** These are the most important elements. The large numeric value (`text-3xl`, `font-semibold`) must be the most prominent element inside the card, followed by the title (`text-sm`, `text-gray-500`). The icon should be subtle (`text-gray-400`, `w-6 h-6`) and purely decorative. The "Active Session" card should have a solid green top border (`border-t-4 border-primary-dark`) to visually anchor it as the most critical piece of platform state.
    *   **Recent Activity Table:** Use a `Table` without zebra striping for a cleaner look. The most important columns are `Student Name` and `Skill`, which should be `font-semibold`. The timestamp should be less prominent (`text-gray-500`).

*   **Interactivity & Linking:**
    *   **Clickable Stats:** Each `Stat Card` must function as a navigational element.
        *   "Total Students" card links to `/admin/students`.
        *   "Total Groups" card links to `/admin/groups`.
        *   "Active Academic Session" links to `/admin/sessions`.
        This turns the dashboard from a passive report into an active command center.
    *   **Live Updates:** The "Refresh" button should trigger spinners inside each `Stat Card` and the "Recent Activity" table, indicating a data fetch without reloading the entire page. The timestamp should update upon completion.

#### **`/admin/skills`, `/admin/students`, `/admin/mentors` (List Page Pattern)**

*   **Layout & Spacing:** The header (Title + Create Button) and the Filter/Search bar should be grouped in a single `Card` or a well-defined section with a bottom border to separate them from the main data table. This creates a clear "controls" area.

*   **Component Choice & Hierarchy:**
    *   **Header:** The `<h1>` title ("Skills," "Students") is the primary anchor. The `Primary Button` ("+ Create Skill") must be visually loud (solid pastel green) because it's the primary entry point for creating new data.
    *   **Table:** The most important column (e.g., "Skill Title," "Student Name") should be the first column and have slightly heavier styling (`font-semibold`, `text-gray-900`). Status badges are critical for scannability; they should be the next most prominent visual element.

*   **Interactivity & Linking:**
    *   **Row Interaction:** The entire table row should have a hover state (`bg-primary-light`). Clicking anywhere on the row should perform the primary action: navigating to the detail view (e.g., `/admin/skills/[skillId]/groups`). This is a much larger, more accessible tap target than a tiny "view" icon.
    *   **Action Icons:** The icons in the "Actions" column must have `Informational Tooltips` on hover ("Edit Skill," "Delete Skill"). The **Delete** action must trigger a `Confirmation Modal` with a destructive action button (red) to prevent accidental data loss. The modal's title should be explicit: "Delete [Skill Name]?"
    *   **Modal for Editing/Creating:** Use a `Drawer` (sliding panel) instead of a modal for creating/editing skills or mentors. This provides more vertical space for forms and feels more substantial than a simple modal.

#### **`/admin/enrollments`**

*   **Layout & Spacing:** The filter controls are the most critical part of this page. They should be placed in a dedicated, visually prominent `Card` at the top of the page, above the data table. This signals to the admin: "You must make a selection here first."

*   **Component Choice & Hierarchy:**
    *   **Button States:** The "Auto-Assign All" `Primary Button` must be **disabled by default**. It only becomes active when an Academic Session *and* a Skill are selected from the dropdowns. This guides the admin through the necessary workflow.
    *   **Table Data:** In the "Group" column, "Unassigned" students should display a dash (`-`) or an empty state message, while assigned students show the group name as a link to that group's detail page.

*   **Interactivity & Linking:**
    *   **Modal for Manual Assignment:** The "Assign Group" modal should be context-aware. It must only show groups associated with the currently filtered skill and, crucially, only those that still have capacity. Display the group's current capacity (e.g., "18 / 20 students") next to each option to help the admin make an informed decision.

---

### **Mentor Pages: Designing for Focus and Context**

The mentor's experience is about managing *their* specific responsibilities. The UI should filter out the noise.

#### **`/mentor/dashboard`**

*   **Layout & Spacing:** The two-column layout should feel balanced. "My Groups" is the mentor's primary concern. Give this card more visual weight through slightly more padding or a subtle top border.

*   **Component Choice & Hierarchy:**
    *   **Greeting:** The personalized greeting ("Welcome, [Mentor Name]!") immediately establishes context.
    *   **Group List:** This is not a data table. Use a clean `List` component. Each item should show the Group Name (`font-semibold`) and the associated Skill Name (`text-gray-500`) below it. This is simpler and faster to scan than a table.

*   **Interactivity & Linking:**
    *   Each item in the "My Groups" list must be a link that navigates directly to `/mentor/my-groups` with that specific group pre-selected in the two-pane view. This creates a seamless "drill-down" flow.

#### **`/mentor/my-groups`**

*   **Layout & Spacing:** The two-pane layout is key. The left pane (group list) should be about 30-35% of the width, with the right pane taking the rest. The selected group in the left pane must have a clear active state (`bg-primary-DEFAULT`, `text-white`).

*   **Component Choice & Hierarchy:**
    *   **Tabs:** The "Roster" and "Attendance Report" tabs are the primary organizational tool. The default view should be the "Roster," as it's the most frequently accessed piece of information.
    *   **Attendance Report:** This component should be identical to the one in the admin panel for consistency. However, it should not have any export functionality unless required.

*   **Interactivity & Linking:**
    *   When the page loads, the **first group in the list should be selected by default**, immediately populating the right pane with data. This avoids showing the user an empty screen and requiring an initial click.
    *   The search bar in the left pane should filter the group list in real-time as the mentor types.

---

### **Student Pages: Designing for Guidance and Simplicity**

The student's journey should be effortless, with clear signposts and zero ambiguity.

#### **`/student/dashboard`**

*   **Layout & Spacing:** Single column, generous spacing. The entire page is the **Stateful Guidance Card**. No other elements should compete for attention. Use large vertical margins to center the card and make it feel important.

*   **Component Choice & Hierarchy:**
    *   **Illustrations:** Use soft, friendly illustrations for each state that align with the pastel green theme.
    *   **Typography:** The header ("Let's get you set up!") should be large and encouraging (`text-3xl`). The body text should be concise and clear.
    *   **CTA Button:** The `Primary Button` should have a clear, action-oriented label ("Create Profile," "Browse Skills").

*   **Interactivity & Linking:**
    *   This page is the central router for the student. The button is the only interactive element, and it must take them to the exact next step in their journey. There should be no other confusing links or navigation options on this page.

#### **`/student/skills`**

*   **Layout & Spacing:** A responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) of `Skill Cards` allows for easy browsing on any device. Ensure a healthy `gap-6` between cards.

*   **Component Choice & Hierarchy:**
    *   **Card Content:** Inside each card, the Skill Title is the `<h1>` of the card. The description should be truncated to 2-3 lines with a "read more" link if necessary to maintain a uniform grid height.
    *   **Button Hierarchy:** The "Enroll Now" (`Primary Button`) and "Learn More" (`Secondary Button`) must be visually distinct to guide the choice. "Enroll Now" is the desired action.

*   **Interactivity & Linking:**
    *   **Enrollment Flow:** Clicking "Enroll Now" must not perform the enrollment directly. It should navigate to `/student/enrollment?skill=<id>&confirm=1`. This confirmation step is crucial. The enrollment page will then show the details of the selected skill and ask the student to confirm before proceeding to payment. This prevents accidental enrollments.

By following these more detailed instructions, you can ensure that the layout, components, and hierarchy of each page are not just aesthetically pleasing but are purpose-built to support the user's goals, creating a truly intuitive and coherent application.