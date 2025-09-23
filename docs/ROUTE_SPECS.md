## Complete Page/Route Specifications (Aligned to src/lib/api.ts)

Status: Authoritative mapping of pages to existing API methods in `src/lib/api.ts`, with realistic fallbacks where endpoints do not yet exist.

Conventions
- All requests go through `/api/*` proxy; no client token handling.
- Use `api` singleton methods exactly as named here.
- When an ideal endpoint does not exist, a fallback approach is specified.

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

---

## 👨‍💼 Admin Pages

### `/admin/dashboard`
- Purpose: Overview & quick actions
- Data APIs:
  - Active session: `api.getAcademicSessions()` then compute active (start/end)
  - Capacity overview: `api.getGroupStatistics({ skill_id?, academic_session_id? })`
  - Recent activity: derive from `getAllEnrollments()` and QR list per group via `listGroupQrCodes()` if needed
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

### `/admin/sessions`
- Purpose: Manage academic sessions
- APIs:
  - List: `api.getAcademicSessions()`
  - Create: `api.createAcademicSession({ name, starts_at?, ends_at? })`
  - Start: `api.startAcademicSession(id: number)`
  - End: `api.endAcademicSession(id: number)`
  - Edit: `api.updateAcademicSession(id, { name?, starts_at?, ends_at? })`
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

### `/admin/skills`
- Purpose: Manage skills & configurations
- APIs:
  - List: `api.getSkills()`
  - Create: `api.createSkill(payload: CreateSkillPayload)`
  - Update: `api.updateSkill(id: string, payload: UpdateSkillPayload)`
  - Set date range: `api.updateSkillDateRange(id: string, payload: SkillDateRangePayload)`
  - Delete: `api.deleteSkill(id: string)`
- Permissions: Admin

Page Content & Layout
- Header: Title + primary "New Skill"
- Filters: Level filter, Active toggle
- Grid/List: SkillsGrid; actions: Edit (SkillModal), Set Date Range (SkillDateRangeModal), Delete (confirm)
Acceptance
- Date range validation enforced
- Delete requires confirmation dialog

### `/admin/skills/[skillId]/groups`
- Purpose: View groups for a skill
- APIs:
  - Groups by skill: `api.getGroupsBySkill(skillId: string, params?: { academic_session_id?, include_full? })`
  - Capacity/overview: (derived from groups data)
  - Student roster: Prefer group details if it includes members. If not available, fallback to `api.getAllEnrollments({ academic_session_id?, skill_id })` and filter by `groupId`.
- Permissions: Admin

Page Content & Layout
- Header: Skill title + session selector (defaults to active)
- Split: GroupsList (with GroupCapacityIndicator) | GroupStudentsList for selected group
Acceptance
- Export produces CSV/XLS via util
- Manual reassignment available if allowed

### `/admin/enrollments`
- Purpose: Manage enrollments
- APIs:
  - List: `api.getAllEnrollments(params?: { academic_session_id?, skill_id?, per_page? })`
  - Auto-assign: `api.autoAssignStudentsToGroups(skillId: string, data: AutoAssignPayload)`
  - Manual assign: `api.assignStudentToGroup(groupId: number, payload: AssignStudentPayload)`
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

### `/admin/students`
- Purpose: View/manage students
- APIs:
  - List: `api.getStudents()` (paginated response)
  - Profile: `api.getStudentProfile(userId: string)`
  - Enrollment history: Not directly available; fallback to `api.getAllEnrollments()` and filter by user in UI, or add server support later.
- Permissions: Admin

Page Content & Layout
- Header: Title + search Input
- Table: StudentsTable (Name, Matric, Level, Dept, Enrollment Status, Actions)
- Drawer/Modal: StudentProfileModal with EnrollmentHistory
Acceptance
- Search filters results (server if possible, else client note)
- Attendance rate shown when report available

### `/admin/mentors`
- Purpose: Manage mentors & skills
- APIs:
  - List: `api.getMentors(params?)`
  - Create: `api.createMentor(data: CreateMentorProfilePayload)`
  - Assign skill: `api.assignSkillToMentor(mentorProfileId: number, data: AssignSkillPayload)`
  - Remove skill: `api.removeSkillFromMentor(mentorProfileId: number, data: RemoveSkillPayload)`
  - Mentor groups: `api.getMentorSkillGroups(userId: string)`
- Permissions: Admin

Page Content & Layout
- Header: Title + "New Mentor" (MentorModal)
- Table: MentorsTable (Name, Specialization, Availability, Skills, Actions)
- Side Panel: MentorSkillAssignment; summary via MentorWorkloadView
Acceptance
- Assign/remove skill updates table immediately
- Availability toggle persists

### `/admin/qr-codes`
- Purpose: Generate and track QR codes
- APIs:
  - Generate for group: `api.generateGroupQrCodes(groupId: number, data: GenerateGroupQrCodePayload)`
  - Bulk generate: `api.bulkGenerateQrCodes(data: BulkGenerateQrCodePayload)`
  - Recent batches: `api.listGroupQrCodes(groupId: number, params?)` (per group; aggregate in UI as needed)
- Notes: No global generation history endpoint; aggregate per group.
- Permissions: Admin

Page Content & Layout
- Left: QRGenerationForm (group/skill, count, expiry)
- Right: QRBatchHistory (compose via listGroupQrCodes per selected group); QRJobMonitor if applicable
Acceptance
- Successful generation shows print link
- Invalid params blocked inline

### `/admin/qr-codes/print`
- Purpose: Print QR codes
- APIs:
  - Fetch batches to print: `api.listGroupQrCodes(groupId, params?)` (select groups/batches in UI)
  - Mark distributed: Not available in `api.ts`; track via UI notes or extend backend.
- Permissions: Admin

Page Content & Layout
- Header: Title + printer tips
- Content: QRPrintLayout options; PrintPreview; DistributionTracker notes (until API)
Acceptance
- Browser print dialog uses optimized layout
- Distribution status captured (temporary storage)

### `/admin/qr-codes/distribution`
- Purpose: Track distribution to mentors
- APIs:
  - Record/get distribution: Not present in `api.ts`. Proposed extension; interim tracking client-side.
- Permissions: Admin

Page Content & Layout
- Table: QRDistributionTracker (Mentor, Group, Count, Date, Status)
- Actions: Add record (Modal), Print receipt
Acceptance
- Records persist per current approach until API exists

### `/admin/reports`
- Purpose: Reporting & analytics
- APIs:
  - Attendance: `api.getGroupAttendanceReport(groupId: number)`
  - Group statistics: `api.getGroupStatistics({ skill_id?, academic_session_id? })`
- Notes: No generic report generator endpoint; compose from available APIs.
- Permissions: Admin

Page Content & Layout
- Controls: type Select, date range, Generate Button
- Viewer: ReportViewer; ExportOptions (PDF/Excel)
Acceptance
- Generate disables controls while loading
- Exports download files

---

## 👨‍🏫 Mentor Pages

### `/mentor/dashboard`
- Purpose: Daily overview
- APIs:
  - My groups: `api.getMentorSkillGroups(userId: string)`
  - Today’s QR codes: `api.listGroupQrCodes(groupId, params?)` for each group
  - Recent scans: `api.getQrScanHistory(qrToken: string, perPage?)` (needs token; otherwise show group-level attendance via `getGroupAttendanceReport`)
- Notes: No dedicated schedule endpoint; derive from skill date ranges and group membership.
- Permissions: Mentor

Page Content & Layout
- Header: "Mentor Dashboard"
- Left: TodaySchedule (derived), RecentScans
- Right: QRQuickAccess (today’s codes), UpcomingCalendar
Acceptance
- Shows empty states when no data
- Only active QR codes are shown

### `/mentor/my-skills`
- Purpose: View assigned skills & groups
- APIs:
  - Skills: `api.getMentorAssignedSkills(userId: string)`
  - Groups: `api.getMentorSkillGroups(userId: string)`
- Permissions: Mentor

Page Content & Layout
- Grid of AssignedSkillsGrid cards; expand to SkillGroupsOverview
Acceptance
- Primary skills visually distinct; counts accurate

### `/mentor/groups`
- Purpose: Group list & rosters
- APIs:
  - Groups: `api.getMentorSkillGroups(userId: string)`
  - Roster: See admin roster approach (group details or enrollments filter)
  - Attendance history: `api.getGroupAttendanceReport(groupId: number)`
- Permissions: Mentor

Page Content & Layout
- Filters: skill Select, search Input
- List: MentorGroupsList (capacity chips, next practical)
- Details: GroupStudentsRoster; link/section for AttendanceHistory
Acceptance
- Roster search filters quickly; export available

### `/mentor/my-qr-codes`
- Purpose: Access QR codes
- APIs:
  - Codes by group: `api.listGroupQrCodes(groupId, params?)`
  - Scan history: `api.getQrScanHistory(qrToken: string, perPage?)`
- Permissions: Mentor

Page Content & Layout
- Grouped by date: MyQRCodesDisplay → PracticalQRCard
- Side panel: QRScanReport for selected token
Acceptance
- Expired codes indicated; print/download works

### `/mentor/attendance/reports`
- Purpose: Attendance reports
- APIs:
  - Group report: `api.getGroupAttendanceReport(groupId: number)`
  - Student details: Not present; derive from report or extend backend.
- Permissions: Mentor

Page Content & Layout
- Controls: group Select, date range Inputs, Generate Button
- Report: AttendanceReport + AttendanceStats
Acceptance
- Counts match group report; export if enabled

### `/mentor/schedule`
- Purpose: Practical schedule
- APIs:
  - Skill date ranges: `api.getSkillDateRange(skillId: string, academicSession?: string)`
  - Combine with `getMentorSkillGroups` to build schedule
- Permissions: Mentor

Page Content & Layout
- Tabs: PracticalCalendar | ScheduleListView
- Detail Drawer: SessionDetails on click
Acceptance
- Times are timezone-safe; ordering correct

---

## 🎓 Student Pages

### `/student/dashboard`
- Purpose: Student hub
- APIs:
  - Profile: `api.getStudentProfile(userId: string)`
  - Current enrollment: `api.getEnrollment(userId: string)`
  - Schedule: Derived from group assignment and `getSkillDateRange`
- Permissions: Student

Page Content & Layout
- Top: ProfileCompletionAlert (if needed)
- Grid: EnrollmentStatusCard, NextPracticalCard, QuickActions
Acceptance
- Countdown updates; quick actions navigate correctly

### `/student/profile/create`
- Purpose: One-time profile creation
- APIs:
  - Create: `api.createStudentProfile(userId: string, data: CreateStudentProfilePayload)`
- Permissions: Student without profile

Page Content & Layout
- FormStepper around ProfileForm; permanent fields warning
Acceptance
- Validation per field; success redirects to dashboard

### `/student/profile`
- Purpose: View profile
- APIs:
  - Profile: `api.getStudentProfile(userId: string)`
  - Enrollment history: Not present; fallback via `getAllEnrollments()` filter by user or extend backend.
- Permissions: Student

Page Content & Layout
- Top: ProfileView
- Bottom: EnrollmentHistory, AttendanceSummary
Acceptance
- History paginated; summary matches report

### `/student/skills`
- Purpose: Browse/enroll in skills
- APIs:
  - Available skills: `api.getAvailableSkills(userId: string)`
  - Create enrollment: `api.createEnrollment(userId: string, data: CreateEnrollmentPayload)`
- Permissions: Student with profile

Page Content & Layout
- Grid: SkillSelectionGrid (disabled when ineligible)
- Modal: SkillDetailModal with EnrollButton
Acceptance
- Enroll respects capacity and redirects to payment when needed

### `/student/enrollment`
- Purpose: Current enrollment status
- APIs:
  - Get: `api.getEnrollment(userId: string)`
  - Pay: `api.payForEnrollment(userId: string, data?: EnrollmentPaymentPayload)`
- Permissions: Student with enrollment

Page Content & Layout
- Timeline: StatusTimeline
- Cards: EnrollmentStatus, PaymentRedirect, GroupAssignmentCard
Acceptance
- Status updates after payment; group card appears when assigned

### `/student/payment`
- Purpose: Payment handling
- APIs:
  - Initiate/continue payment: `api.payForEnrollment(userId: string, data?: EnrollmentPaymentPayload)`
- Permissions: Student with unpaid enrollment

Page Content & Layout
- Summary: PaymentSummary, GatewaySelector
- Action: PaymentRedirect Button
Acceptance
- Redirect/return handled; status refreshed

### `/student/scan-qr`
- Purpose: Scan mentor QR for attendance
- APIs:
  - Scan: `api.processQrScan(data: ProcessQrScanPayload)`
  - Progress: Not present; derive from `api.getGroupAttendanceReport(groupId)` (filter by student) if needed.
- Permissions: Student in group

Page Content & Layout
- Left: StudentQRScanner (start with token input), ScanProgressIndicator
- Modal: ScanConfirmationModal, ScanResultModal
Acceptance
- Invalid token error; successful scan updates progress

### `/student/my-group`
- Purpose: View assigned group
- APIs:
  - Enrollment: `api.getEnrollment(userId: string)` → use `groupId`
  - Group details: `api.getSkillGroup(groupId: number)` if needed; else derive from skills/groups listings
- Permissions: Student with group assignment

Page Content & Layout
- Cards: GroupInfoCard, MentorCard
- List: GroupMembersList
- Schedule: PracticalSchedule
Acceptance
- Members paginated; schedule matches date range

### `/student/attendance`
- Purpose: View own attendance
- APIs:
  - Group report: `api.getGroupAttendanceReport(groupId: number)` then filter for student
  - Scan history: `api.getQrScanHistory(qrToken, perPage?)` requires QR token; typically use group report instead.
- Permissions: Student

Page Content & Layout
- Stats: AttendanceStats
- Table: ScanHistoryTable
- Calendar: AttendanceCalendar
Acceptance
- Percentage matches; calendar marks attendance

### `/student/schedule`
- Purpose: Practical schedule
- APIs:
  - Derived from assigned skill/group + `api.getSkillDateRange(skillId, academicSession?)`
- Permissions: Student with group

Page Content & Layout
- Tabs: PracticalCalendar | UpcomingPracticals
- Card: SessionCard for selection
Acceptance
- Upcoming list sorted by date

---

## System-Wide Utilities & Guards (References)

- Auth helpers: `src/lib/auth.ts` (e.g., `getCurrentUser`, role checks, redirects)
- Permissions: `src/lib/permissions.ts`
- Error handling: `src/lib/error-handling.ts` and `ApiError`
- Printing/QR utilities: `src/lib/utils/print.ts`, `src/lib/utils/qr.ts`
- Dates/utilities: `src/lib/utils/dates.ts`

Notes on Gaps / Proposed Extensions
- Global QR generation history, distribution tracking, student enrollment history per user, mentor schedule endpoints are not present in `api.ts`. Current plan derives UI from available endpoints; consider backend extensions for efficiency and accuracy.


