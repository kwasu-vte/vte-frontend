### Role-Based Flows: Admin, Mentor, Student

This document maps end-to-end flows and key directions for Admin, Mentor, and Student in the VTE Frontend. It aligns with the implemented routes, pages, and components already present in `src/app/(authenticated)` and related `src/components/features/*`.

---

## Admin Flow

High-level goals: manage skills, groups, mentors, students, sessions, enrollments, and QR codes; view reports.

Entry: `/admin/dashboard`

Primary pages and directions:
- Dashboard (`/admin/dashboard`)
  - View KPIs via `StatCard` grid
  - Quick actions: navigate to Skills, Groups, Sessions, Enrollments, QR Codes, Reports

- Skills (`/admin/skills`)
  - View and manage skills via `SkillsTable`
  - Create/edit using `SkillModal`
  - Drill-in: `skills/[skillId]/groups` to view `GroupsTable` scoped by skill

- Groups (`/admin/skills/[skillId]/groups`)
  - Inspect capacity with `GroupCapacityIndicator`
  - View members using `GroupStudentsList`
  - Manage group scheduling windows using `SkillDateRangeModal`

- Mentors (`/admin/mentors`)
  - Browse mentors with `MentorsTable`
  - Assign skill(s) via `MentorSkillAssignment`
  - Manage mentor QR distribution via `MentorQRAssignment`

- Students (`/admin/students`)
  - Review students with `StudentsTable`
  - Open `StudentModal` or `StudentProfileModal` for details

- Sessions (`/admin/sessions`)
  - CRUD sessions using `SessionsTable` and `SessionModal`
  - Visual status via `SessionStatusBadge`

- Enrollments (`/admin/enrollments`)
  - Filter with `EnrollmentFilters`
  - Review via `EnrollmentsTable` and `EnrollmentStatusBadge`

- QR Codes (`/admin/qr-codes`)
  - Generate with `QRGenerationForm` or `QRWizard`
  - Distribute and track with `QRDistributionTracker`
  - Print paths:
    - Print selector: `/admin/qr-codes/print-selector`
    - Dynamic print grid: `/admin/qr-codes/print-dynamic`
    - Single print page uses new unified `/admin/qr-codes/print`
  - Bulk distribution report in `QRDistributionTracker` and `QRCodeTable`

- Reports (`/admin/reports`)
  - Use capacity overview per `docs/CAPACITY_OVERVIEW_REPORT.md`
  - Export Excel via utilities in `src/lib/utils/excel-export.ts`

Key admin directions:
- Create/modify skills → assign to mentors → open groups → register sessions → generate QR → monitor enrollments and attendance → print/export reports.

---

## Mentor Flow

High-level goals: manage assigned skills/groups, view schedule, take attendance, access QR codes, analyze workload.

Entry: `/mentor/dashboard`

Primary pages and directions:
- Dashboard (`/mentor/dashboard`)
  - Overview cards via `MentorDashboard`
  - Shortcuts to My Skills, Schedule, My QR Codes

- My Skills (`/mentor/my-skills`)
  - Review assigned skills/groups using `MentorMySkillsView` and `MentorGroupsList`
  - Drill to group roster with `GroupStudentsRoster`

- Schedule (`/mentor/schedule`)
  - Calendar/List tabs via `MentorCalendarView`
  - Open details with `SessionDetails`

- Attendance Reports (`/mentor/attendance/reports`)
  - Review attendance trends using `MentorAttendanceReportsView`

- My QR Codes (`/mentor/my-qr-codes`)
  - View, copy, and print QR using `MyQRCodesDisplay` and `PracticalQRCard`

- Workload (`/mentor/dashboard` summary + stats)
  - KPI rollups via `MentorWorkloadView`

Key mentor directions:
- Review assigned skills/groups → check upcoming sessions in Schedule → conduct sessions and confirm attendance → share/print QR for practicals → monitor attendance reports.

---

## Student Flow

High-level goals: complete profile, enroll in skills, access group and schedule, scan QR for attendance, review progress.

Entry: `/student/dashboard`

Primary pages and directions:
- Dashboard (`/student/dashboard`)
  - `ProfileCompletionAlert`/Modal prompts until complete
  - Quick actions: Profile, Skills, Enrollment, My Group, Schedule
  - Upcoming sessions via `UpcomingPracticals`

- Profile (`/student/profile` and `/student/profile/create`)
  - Create or update details using `ProfileForm` and view with `ProfileView`

- Skills (`/student/skills`)
  - Browse via `StudentSkillsClient`
  - Enroll flow: `EnrollmentStatus` and `EnrollmentStatusBadge`

- Enrollment (`/student/enrollment`)
  - Track enrollment status and payment via `PaymentRedirect` as needed

- My Group (`/student/my-group`)
  - View assigned group via `GroupAssignmentCard`

- Schedule (`/student/schedule`)
  - See practical timetable with `PracticalCalendar`

- Scan QR (`/student/scan-qr`)
  - Scan using `StudentQRScanner`
  - Progress and confirmation via `ScanProgressIndicator`, `ScanConfirmationModal`, and `ScanResultModal`

- Attendance Reports (`/student/attendance`)
  - Review `AttendanceReport` and `AttendanceCompletionBadge`

Key student directions:
- Complete profile → select skills and enroll → check group and schedule → attend practicals and scan QR → monitor attendance completion.

---

## Cross-Cutting Patterns

- State/Fetching: Pages follow `StateRenderer` + React Query via `src/components/shared` and `src/components/providers/QueryProvider.tsx`.
- Permissions & Routing: Role-based guards via `src/middleware.ts` and `src/lib/permissions.ts`; landing redirects by role defined in `src/app/page.tsx` and `src/app/(authenticated)/layout.tsx`.
- Printing & Exports: Print flows for QR pages; Excel exports for admin reports per `docs/EXCEL_EXPORT_DOCUMENTATION.md`.
- PWA: Install prompts and offline support per `public/service-worker.js` and `src/components/shared/PWAManager.tsx`.


