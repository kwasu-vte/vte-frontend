## Complete Page/Route Specifications (Aligned to domain API clients under `src/lib/api/*`)

Status: Authoritative mapping of pages to existing domain API clients in `src/lib/api/*`, with realistic fallbacks where endpoints do not yet exist.

Conventions
- All requests go through `/api/*` proxy; no client token handling.
- Use domain-specific clients imported from `@/lib/api` (e.g., `skillsApi`, `studentsApi`, `mentorsApi`, `enrollmentsApi`, `skillGroupsApi`, `qrCodesApi`, `academicSessionsApi`, `authApi`).
- When an ideal endpoint does not exist, a fallback approach is specified.
- Pagination defaults: `per_page=25` unless stated otherwise. QR list `status in ['active','expired','all']`.
- Guards: Global RBAC via `middleware.ts`; page-level protection via `requireAuth()` / `requireRole()` in `src/lib/auth.ts`.

API naming note
- Older references to `api.methodName()` map to the following domain clients:
  - auth: `authApi.*`
  - skills: `skillsApi.*`
  - students: `studentsApi.*`
  - mentors: `mentorsApi.*`
  - enrollments: `enrollmentsApi.*`
  - skill groups: `skillGroupsApi.*`
  - QR codes: `qrCodesApi.*`
  - academic sessions: `academicSessionsApi.*`

---

## 🔐 Authentication Pages

### `/auth/sign_in`
- Purpose: User login
- Actions:
  - Submit: `api.signIn(loginData)`
  - Fetch profile: `api.getCurrentUser()` (fallback POST auto-handled)
  - Redirect by role (client utility)
- Permissions: Public

Page Content & Layout
- Header: "Sign in"
- Card: LoginForm (email, password, remember me), primary Submit, link to sign up
- Error area bound to ApiError
Guards/Redirects
- If authenticated → redirect by role to `/admin/dashboard` | `/mentor/dashboard` | `/student/dashboard`
Acceptance
- Field validation errors render inline
- Success redirects correctly
Components
- shared/NotificationContainer

### `/auth/sign_up`
- Purpose: Student registration only
- Actions:
  - Register: `api.signUp(userData)`
  - Redirect to profile creation
- Permissions: Public

Page Content & Layout
- Header: "Create your account"
- Card: RegisterForm (first_name, last_name, email, password, confirm), primary Submit
- Note about next step (profile creation)
Guards/Redirects
- On success → `/student/profile/create`
Acceptance
- Password confirm enforced client-side
- Duplicate email shows server error inline
Components
- shared/NotificationContainer

---

## 👨‍💼 Admin Pages

### `/admin/dashboard`
- Purpose: Overview & quick actions
- Data APIs:
  - Active session: `academicSessionsApi.getAll()` then compute active (start/end)
  - Capacity overview: `skillGroupsApi.getStatistics({ skill_id?, academic_session_id? })`
  - Recent activity: derive from `enrollmentsApi.getAll()` and QR list per group via `qrCodesApi.listGroupCodes()` if needed
- Notes: No dedicated "current session" or "global stats" endpoints; use above.
- Permissions: Admin

Page Content & Layout
- Header: "Admin Dashboard" + SessionIndicator
- Grid: StatCard x4 (Totals), computed from `getAllEnrollments` and `getGroupStatistics`
- Two-column: ActivityFeed (recent items) | QuickActionPanel (Generate QR, Start Session, View Reports)
Guards/Redirects
- Require Admin; else redirect `/`
Acceptance
- Empty states show for no data
- Quick actions navigate correctly
Components
- layout/AppShell, layout/Header, layout/Sidebar
- shared/StatCard, shared/StateRenderer, shared/EmptyState, shared/ErrorState, shared/NotificationContainer

### `/admin/sessions`
- Purpose: Manage academic sessions
- APIs:
  - List: `academicSessionsApi.getAll()`
  - Create: `academicSessionsApi.create({ name, starts_at?, ends_at? })`
  - Start: `academicSessionsApi.start(id: number)`
  - End: `academicSessionsApi.end(id: number)`
  - Edit: `academicSessionsApi.update(id, { name?, starts_at?, ends_at? })`
- Permissions: Admin

Page Content & Layout
- Header: Title + primary "New Session" (opens SessionModal)
- Content: SessionsTable (columns: Name, Start, End, Status, Actions), Pagination per_page=25
- Components: SessionStatusBadge inside table; SessionModal for create/edit
Guards/Redirects
- Admin only; else redirect `/`
Acceptance
- Starting one session deactivates others visually
- Warning banner when no active session
Components
- features/admin/SessionsTable
- features/admin/SessionModal
- features/admin/SessionStatusBadge
- shared/StateRenderer, shared/NotificationContainer, shared/EmptyState

### `/admin/skills`
- Purpose: Manage skills & configurations
- APIs:
  - List: `skillsApi.getAll()`
  - Create: `skillsApi.create(payload: CreateSkillPayload)`
  - Update: `skillsApi.update(id: string, payload: UpdateSkillPayload)`
  - Set date range: `skillsApi.updateDateRange(id: string, payload: SkillDateRangePayload)`
  - Delete: `skillsApi.delete(id: string)`
- Permissions: Admin

Page Content & Layout
- Header: Title + primary "New Skill"
- Filters: Level filter, Active toggle
- Grid/List: SkillsGrid; actions: Edit (SkillModal), Set Date Range (SkillDateRangeModal), Delete (confirm)
Acceptance
- Date range validation enforced
- Delete requires confirmation dialog
Components
- features/admin/SkillsTable
- features/admin/SkillModal
- features/admin/SkillDateRangeModal
- features/admin/SkillLevelSelector
- shared/StateRenderer, shared/NotificationContainer

### `/admin/skills/[skillId]/groups`
- Purpose: View groups for a skill
- APIs:
  - Groups by skill: `skillsApi.getGroupsBySkill(skillId: string, params?: { academic_session_id?, include_full? })`
  - Capacity/overview: (derived from groups data)
  - Student roster: Prefer group details if it includes members. If not available, fallback to `enrollmentsApi.getAll({ academic_session_id?, skill_id })` and filter by `groupId`.
- Permissions: Admin

Page Content & Layout
- Header: Skill title + session selector (defaults to active)
- Split: GroupsList (with GroupCapacityIndicator) | GroupStudentsList for selected group
Acceptance
- Export produces CSV/XLS via util
- Manual reassignment available if allowed
Components
- features/admin/GroupsTable
- features/admin/GroupCapacityIndicator
- features/admin/GroupStudentsList
- shared/DataTable, shared/StateRenderer, shared/NotificationContainer

### `/admin/enrollments`
- Purpose: Manage enrollments
- APIs:
  - List: `enrollmentsApi.getAll(params?: { academic_session_id?, skill_id?, per_page? })`
  - Auto-assign: `skillsApi.autoAssignStudentsToGroups(skillId: string, data: AutoAssignPayload)`
  - Manual assign: `skillGroupsApi.assignStudentToGroup(groupId: number, payload: AssignStudentPayload)`
- Notes: There is no dedicated "assignToGroup(enrollmentId)"; use group assignment API with payload.
- Permissions: Admin

Page Content & Layout
- Header: Title + bulk actions toolbar
- Filters: EnrollmentFilters (session, skill, status). Defaults: per_page=25
- Table: EnrollmentsTable (Student, Skill, Payment, Group, Session, Actions)
- Footer: Pagination
Acceptance
- Auto-assign shows toast and refresh
- Empty state with helpful CTA
Components
- features/admin/EnrollmentsTable
- features/admin/EnrollmentFilters
- features/admin/EnrollmentStatusBadge
- shared/StateRenderer, shared/NotificationContainer

### `/admin/students`
- Purpose: View/manage students
- APIs:
  - List: `studentsApi.list()` (paginated response)
  - Profile: `studentsApi.getProfile(userId: string)`
  - Enrollment history: Not directly available; fallback to `enrollmentsApi.getAll()` and filter by user in UI, or add server support later.
- Permissions: Admin

Page Content & Layout
- Header: Title + search Input
- Table: StudentsTable (Name, Matric, Level, Dept, Enrollment Status, Actions)
- Drawer/Modal: StudentProfileModal with EnrollmentHistory
Acceptance
- Search filters results (server if possible, else client note)
- Attendance rate shown when report available
Components
- features/admin/StudentsTable
- features/admin/StudentModal
- features/student/ProfileView (read-only within modal if needed)
- shared/StateRenderer, shared/NotificationContainer

### `/admin/mentors`
- Purpose: Manage mentors & skills
- APIs:
  - List: `mentorsApi.getAll(params?)`
  - Create: `mentorsApi.create(data: CreateMentorProfilePayload)`
  - Assign skill: `mentorsApi.assignSkill(mentorProfileId: number, data: AssignSkillPayload)`
  - Remove skill: `mentorsApi.removeSkill(mentorProfileId: number, data: RemoveSkillPayload)`
  - Mentor groups: `mentorsApi.getSkillGroups(userId: string)`
- Permissions: Admin

Page Content & Layout
- Header: Title + "New Mentor" (MentorModal)
- Table: MentorsTable (Name, Specialization, Availability, Skills, Actions)
- Side Panel: MentorSkillAssignment; summary via MentorWorkloadView
Acceptance
- Assign/remove skill updates table immediately
- Availability toggle persists
Components
- features/admin/MentorsTable
- features/admin/MentorModal
- features/mentor/MentorSkillAssignment
- features/mentor/MentorWorkloadView
- shared/StateRenderer, shared/NotificationContainer

### `/admin/qr-codes`
- Purpose: Generate and track QR codes
- APIs:
  - Generate for group: `qrCodesApi.generateGroupCodes(groupId: number, data: GenerateGroupQrCodePayload)`
  - Bulk generate: `qrCodesApi.bulkGenerateCodes(data: BulkGenerateQrCodePayload)`
  - Recent batches: `qrCodesApi.listGroupCodes(groupId: number, params?)` (per group; aggregate in UI as needed)
- Notes: No global generation history endpoint; aggregate per group.
- Permissions: Admin

Page Content & Layout
- Left: QRGenerationForm (group/skill, count, expiry)
- Right: QRBatchHistory (compose via listGroupQrCodes per selected group); QRJobMonitor if applicable
Acceptance
- Successful generation shows print link
- Invalid params blocked inline
Components
- features/admin/QRGenerationForm
- features/admin/QRDistributionTracker (as history/tracker UI)
- features/mentor/MyQRCodesDisplay (optional preview)
- shared/StateRenderer, shared/NotificationContainer

### `/admin/qr-codes/print`
- Purpose: Print QR codes
- APIs:
  - Fetch batches to print: `qrCodesApi.listGroupCodes(groupId, params?)` (select groups/batches in UI)
  - Mark distributed: Not available in domain APIs; track via UI notes or extend backend.
- Permissions: Admin

Page Content & Layout
- Header: Title + printer tips
- Content: QRPrintLayout options; PrintPreview; DistributionTracker notes (until API)
Acceptance
- Browser print dialog uses optimized layout
- Distribution status captured (temporary storage)
Components
- features/mentor/PracticalQRCard (for print tiles)
- features/admin/QRDistributionTracker (mark printed/distributed UI)
- shared/NotificationContainer

### `/admin/qr-codes/distribution`
- Purpose: Track distribution to mentors
- APIs:
  - Record/get distribution: Not present in domain APIs. Proposed extension; interim tracking client-side.
- Permissions: Admin

Page Content & Layout
- Table: QRDistributionTracker (Mentor, Group, Count, Date, Status)
- Actions: Add record (Modal), Print receipt
Acceptance
- Records persist per current approach until API exists
Components
- features/admin/QRDistributionTracker
- shared/StateRenderer, shared/NotificationContainer

### `/admin/reports`
- Purpose: Reporting & analytics
- APIs:
  - Attendance: `qrCodesApi.getGroupAttendanceReport(groupId: number)`
  - Group statistics: `skillGroupsApi.getStatistics({ skill_id?, academic_session_id? })`
- Notes: No generic report generator endpoint; compose from available APIs.
- Permissions: Admin

Page Content & Layout
- Controls: type Select, date range, Generate Button
- Viewer: ReportViewer; ExportOptions (PDF/Excel)
Acceptance
- Generate disables controls while loading
- Exports download files
Components
- features/student/AttendanceReport (reuse for group-level view)
- shared/StatCard, shared/StateRenderer, shared/NotificationContainer

---

## 👨‍🏫 Mentor Pages

### `/mentor/dashboard`
- Purpose: Daily overview
- APIs:
  - My groups: `mentorsApi.getSkillGroups(userId: string)`
  - Today’s QR codes: `qrCodesApi.listGroupCodes(groupId, params?)` for each group
  - Recent scans: `qrCodesApi.getQrScanHistory(qrToken: string, perPage?)` (needs token; otherwise show group-level attendance via `qrCodesApi.getGroupAttendanceReport`)
- Notes: No dedicated schedule endpoint; derive from skill date ranges and group membership.
- Permissions: Mentor

Page Content & Layout
- Header: "Mentor Dashboard"
- Left: TodaySchedule (derived), RecentScans
- Right: QRQuickAccess (today’s codes), UpcomingCalendar
Acceptance
- Shows empty states when no data
- Only active QR codes are shown
Components
- features/mentor/MentorGroupsList (for today)
- features/mentor/MyQRCodesDisplay
- features/mentor/QRScanReport
- features/mentor/GroupScheduleCard
- shared/StateRenderer, shared/NotificationContainer

### `/mentor/my-skills`
- Purpose: View assigned skills & groups
- APIs:
  - Skills: `mentorsApi.getAssignedSkills(userId: string)`
  - Groups: `mentorsApi.getSkillGroups(userId: string)`
- Permissions: Mentor

Page Content & Layout
- Grid of AssignedSkillsGrid cards; expand to SkillGroupsOverview
Acceptance
- Primary skills visually distinct; counts accurate
Components
- features/mentor/MentorSkillAssignment
- features/mentor/MentorGroupsList
- shared/StateRenderer, shared/NotificationContainer

### `/mentor/groups`
- Purpose: Group list & rosters
- APIs:
  - Groups: `mentorsApi.getSkillGroups(userId: string)`
  - Roster: See admin roster approach (group details or enrollments filter)
  - Attendance history: `qrCodesApi.getGroupAttendanceReport(groupId: number)`
- Permissions: Mentor

Page Content & Layout
- Filters: skill Select, search Input
- List: MentorGroupsList (capacity chips, next practical)
- Details: GroupStudentsRoster; link/section for AttendanceHistory
Acceptance
- Roster search filters quickly; export available
Components
- features/mentor/MentorGroupsList
- features/mentor/GroupStudentsRoster
- features/mentor/GroupScheduleCard
- shared/StateRenderer, shared/NotificationContainer

### `/mentor/my-qr-codes`
- Purpose: Access QR codes
- APIs:
  - Codes by group: `qrCodesApi.listGroupCodes(groupId, params?)`
  - Scan history: `qrCodesApi.getQrScanHistory(qrToken: string, perPage?)`
- Permissions: Mentor

Page Content & Layout
- Grouped by date: MyQRCodesDisplay → PracticalQRCard
- Side panel: QRScanReport for selected token
Acceptance
- Expired codes indicated; print/download works
Components
- features/mentor/MyQRCodesDisplay
- features/mentor/PracticalQRCard
- features/mentor/QRScanReport
- shared/StateRenderer, shared/NotificationContainer

### `/mentor/attendance/reports`
- Purpose: Attendance reports
- APIs:
  - Group report: `qrCodesApi.getGroupAttendanceReport(groupId: number)`
  - Student details: Not present; derive from report or extend backend.
- Permissions: Mentor

Page Content & Layout
- Controls: group Select, date range Inputs, Generate Button
- Report: AttendanceReport + AttendanceStats
Acceptance
- Counts match group report; export if enabled
Components
- features/student/AttendanceReport
- shared/StatCard, shared/StateRenderer, shared/NotificationContainer

### `/mentor/schedule`
- Purpose: Practical schedule
- APIs:
  - Skill date ranges: `skillsApi.getDateRange(skillId: string, academicSession?: string)`
  - Combine with `mentorsApi.getSkillGroups` to build schedule
- Permissions: Mentor

Page Content & Layout
- Tabs: PracticalCalendar | ScheduleListView
- Detail Drawer: SessionDetails on click
Acceptance
- Times are timezone-safe; ordering correct
Components
- features/student/PracticalCalendar (shared calendar)
- features/mentor/GroupScheduleCard
- shared/StateRenderer, shared/NotificationContainer

---

## 🎓 Student Pages

### `/student/dashboard`
- Purpose: Student hub
- APIs:
  - Profile: `studentsApi.getProfile(userId: string)`
  - Current enrollment: `enrollmentsApi.getUserEnrollment(userId: string)`
  - Schedule: Derived from group assignment and `skillsApi.getDateRange`
- Permissions: Student

Page Content & Layout
- Top: ProfileCompletionAlert (if needed)
- Grid: EnrollmentStatusCard, NextPracticalCard, QuickActions
Acceptance
- Countdown updates; quick actions navigate correctly
Components
- features/student/ProfileCompletionAlert
- features/student/EnrollmentStatus
- features/student/GroupAssignmentCard
- features/student/UpcomingPracticals
- shared/NotificationContainer

### `/student/profile/create`
- Purpose: One-time profile creation
- APIs:
  - Create: `studentsApi.createProfile(userId: string, data: CreateStudentProfilePayload)`
- Permissions: Student without profile

Page Content & Layout
- FormStepper around ProfileForm; permanent fields warning
Acceptance
- Validation per field; success redirects to dashboard
Components
- features/student/ProfileForm
- shared/NotificationContainer

### `/student/profile`
- Purpose: View profile
- APIs:
  - Profile: `studentsApi.getProfile(userId: string)`
  - Enrollment history: Not present; fallback via `enrollmentsApi.getAll()` filter by user or extend backend.
- Permissions: Student

Page Content & Layout
- Top: ProfileView
- Bottom: EnrollmentHistory, AttendanceSummary
Acceptance
- History paginated; summary matches report
Components
- features/student/ProfileView
- features/student/AttendanceReport (summary mode)
- shared/StateRenderer, shared/NotificationContainer

### `/student/skills`
- Purpose: Browse/enroll in skills
- APIs:
  - Available skills: `studentsApi.getAvailableSkills(userId: string)`
  - Create enrollment: `enrollmentsApi.create(userId: string, data: CreateEnrollmentPayload)`
- Permissions: Student with profile

Page Content & Layout
- Grid: SkillSelectionGrid (disabled when ineligible)
- Modal: SkillDetailModal with EnrollButton
Acceptance
- Enroll respects capacity and redirects to payment when needed
Components
- features/student/SkillSelectionGrid
- features/admin/GroupCapacityIndicator (inline capacity cues)
- shared/StateRenderer, shared/NotificationContainer

### `/student/enrollment`
- Purpose: Current enrollment status
- APIs:
  - Get: `enrollmentsApi.getUserEnrollment(userId: string)`
  - Pay: `enrollmentsApi.pay(userId: string, data?: EnrollmentPaymentPayload)`
- Permissions: Student with enrollment

Page Content & Layout
- Timeline: StatusTimeline
- Cards: EnrollmentStatus, PaymentRedirect, GroupAssignmentCard
Acceptance
- Status updates after payment; group card appears when assigned
Components
- features/student/EnrollmentStatus
- features/student/PaymentRedirect
- features/student/GroupAssignmentCard
- shared/NotificationContainer

### `/student/payment`
- Purpose: Payment handling
- APIs:
  - Initiate/continue payment: `enrollmentsApi.pay(userId: string, data?: EnrollmentPaymentPayload)`
- Permissions: Student with unpaid enrollment

Page Content & Layout
- Summary: PaymentSummary, GatewaySelector
- Action: PaymentRedirect Button
Acceptance
- Redirect/return handled; status refreshed
Components
- features/student/PaymentRedirect
- shared/NotificationContainer

### `/student/scan-qr`
- Purpose: Scan mentor QR for attendance
- APIs:
  - Scan: `qrCodesApi.processScan(data: ProcessQrScanPayload)`
  - Progress: Not present; derive from `qrCodesApi.getGroupAttendanceReport(groupId)` (filter by student) if needed.
- Permissions: Student in group

Page Content & Layout
- Left: StudentQRScanner (start with token input), ScanProgressIndicator
- Modal: ScanConfirmationModal, ScanResultModal
Acceptance
- Invalid token error; successful scan updates progress
Components
- features/student/StudentQRScanner
- features/student/ScanProgressIndicator
- features/student/ScanConfirmationModal
- features/student/ScanResultModal
- shared/NotificationContainer

### `/student/my-group`
- Purpose: View assigned group
- APIs:
  - Enrollment: `enrollmentsApi.getUserEnrollment(userId: string)` → use `groupId`
  - Group details: `skillGroupsApi.getById(groupId: number)` if needed; else derive from skills/groups listings
- Permissions: Student with group assignment

Page Content & Layout
- Cards: GroupInfoCard, MentorCard
- List: GroupMembersList
- Schedule: PracticalSchedule
Acceptance
- Members paginated; schedule matches date range
Components
- features/student/GroupAssignmentCard (header)
- features/admin/GroupStudentsList (reused read-only)
- features/student/PracticalCalendar
- shared/StateRenderer, shared/NotificationContainer

### `/student/attendance`
- Purpose: View own attendance
- APIs:
  - Group report: `qrCodesApi.getGroupAttendanceReport(groupId: number)` then filter for student
  - Scan history: `qrCodesApi.getQrScanHistory(qrToken, perPage?)` requires QR token; typically use group report instead.
- Permissions: Student

Page Content & Layout
- Stats: AttendanceStats
- Table: ScanHistoryTable
- Calendar: AttendanceCalendar
Acceptance
- Percentage matches; calendar marks attendance
Components
- features/student/AttendanceCompletionBadge
- features/student/AttendanceReport
- features/student/PracticalCalendar (calendar view)
- shared/StateRenderer, shared/NotificationContainer

### `/student/schedule`
- Purpose: Practical schedule
- APIs:
  - Derived from assigned skill/group + `skillsApi.getDateRange(skillId, academicSession?)`
- Permissions: Student with group

Page Content & Layout
- Tabs: PracticalCalendar | UpcomingPracticals
- Card: SessionCard for selection
Acceptance
- Upcoming list sorted by date
Components
- features/student/PracticalCalendar
- features/student/UpcomingPracticals
- shared/NotificationContainer

---

## System-Wide Utilities & Guards (References)

- Auth helpers: `src/lib/auth.ts` (e.g., `getCurrentUser`, role checks, redirects)
- Permissions: `src/lib/permissions.ts`
- Error handling: `src/lib/error-handling.ts` and `ApiError`
- Printing/QR utilities: `src/lib/utils/print.ts`, `src/lib/utils/qr.ts`
- Dates/utilities: `src/lib/utils/dates.ts`

Notes on Gaps / Proposed Extensions
- Global QR generation history, distribution tracking, student enrollment history per user, mentor schedule endpoints are not present in the current domain APIs. Current plan derives UI from available endpoints; consider backend extensions for efficiency and accuracy.


