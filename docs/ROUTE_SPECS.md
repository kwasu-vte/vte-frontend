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

### `/auth/sign_up`
- Purpose: Student registration only
- Actions:
  - Register: `api.signUp(userData)`
  - Redirect to profile creation
- Permissions: Public

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

### `/admin/sessions`
- Purpose: Manage academic sessions
- APIs:
  - List: `api.getAcademicSessions()`
  - Create: `api.createAcademicSession({ name, starts_at?, ends_at? })`
  - Start: `api.startAcademicSession(id: number)`
  - End: `api.endAcademicSession(id: number)`
  - Edit: `api.updateAcademicSession(id, { name?, starts_at?, ends_at? })`
- Permissions: Admin

### `/admin/skills`
- Purpose: Manage skills & configurations
- APIs:
  - List: `api.getSkills()`
  - Create: `api.createSkill(payload: CreateSkillPayload)`
  - Update: `api.updateSkill(id: string, payload: UpdateSkillPayload)`
  - Set date range: `api.updateSkillDateRange(id: string, payload: SkillDateRangePayload)`
  - Delete: `api.deleteSkill(id: string)`
- Permissions: Admin

### `/admin/skills/[skillId]/groups`
- Purpose: View groups for a skill
- APIs:
  - Groups by skill: `api.getGroupsBySkill(skillId: string, params?: { academic_session_id?, include_full? })`
  - Capacity/overview: (derived from groups data)
  - Student roster: Prefer group details if it includes members. If not available, fallback to `api.getAllEnrollments({ academic_session_id?, skill_id })` and filter by `groupId`.
- Permissions: Admin

### `/admin/enrollments`
- Purpose: Manage enrollments
- APIs:
  - List: `api.getAllEnrollments(params?: { academic_session_id?, skill_id?, per_page? })`
  - Auto-assign: `api.autoAssignStudentsToGroups(skillId: string, data: AutoAssignPayload)`
  - Manual assign: `api.assignStudentToGroup(groupId: number, payload: AssignStudentPayload)`
- Notes: There is no dedicated "assignToGroup(enrollmentId)"; use group assignment API with payload.
- Permissions: Admin

### `/admin/students`
- Purpose: View/manage students
- APIs:
  - List: `api.getStudents()` (paginated response)
  - Profile: `api.getStudentProfile(userId: string)`
  - Enrollment history: Not directly available; fallback to `api.getAllEnrollments()` and filter by user in UI, or add server support later.
- Permissions: Admin

### `/admin/mentors`
- Purpose: Manage mentors & skills
- APIs:
  - List: `api.getMentors(params?)`
  - Create: `api.createMentor(data: CreateMentorProfilePayload)`
  - Assign skill: `api.assignSkillToMentor(mentorProfileId: number, data: AssignSkillPayload)`
  - Remove skill: `api.removeSkillFromMentor(mentorProfileId: number, data: RemoveSkillPayload)`
  - Mentor groups: `api.getMentorSkillGroups(userId: string)`
- Permissions: Admin

### `/admin/qr-codes`
- Purpose: Generate and track QR codes
- APIs:
  - Generate for group: `api.generateGroupQrCodes(groupId: number, data: GenerateGroupQrCodePayload)`
  - Bulk generate: `api.bulkGenerateQrCodes(data: BulkGenerateQrCodePayload)`
  - Recent batches: `api.listGroupQrCodes(groupId: number, params?)` (per group; aggregate in UI as needed)
- Notes: No global generation history endpoint; aggregate per group.
- Permissions: Admin

### `/admin/qr-codes/print`
- Purpose: Print QR codes
- APIs:
  - Fetch batches to print: `api.listGroupQrCodes(groupId, params?)` (select groups/batches in UI)
  - Mark distributed: Not available in `api.ts`; track via UI notes or extend backend.
- Permissions: Admin

### `/admin/qr-codes/distribution`
- Purpose: Track distribution to mentors
- APIs:
  - Record/get distribution: Not present in `api.ts`. Proposed extension; interim tracking client-side.
- Permissions: Admin

### `/admin/reports`
- Purpose: Reporting & analytics
- APIs:
  - Attendance: `api.getGroupAttendanceReport(groupId: number)`
  - Group statistics: `api.getGroupStatistics({ skill_id?, academic_session_id? })`
- Notes: No generic report generator endpoint; compose from available APIs.
- Permissions: Admin

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

### `/mentor/my-skills`
- Purpose: View assigned skills & groups
- APIs:
  - Skills: `api.getMentorAssignedSkills(userId: string)`
  - Groups: `api.getMentorSkillGroups(userId: string)`
- Permissions: Mentor

### `/mentor/groups`
- Purpose: Group list & rosters
- APIs:
  - Groups: `api.getMentorSkillGroups(userId: string)`
  - Roster: See admin roster approach (group details or enrollments filter)
  - Attendance history: `api.getGroupAttendanceReport(groupId: number)`
- Permissions: Mentor

### `/mentor/my-qr-codes`
- Purpose: Access QR codes
- APIs:
  - Codes by group: `api.listGroupQrCodes(groupId, params?)`
  - Scan history: `api.getQrScanHistory(qrToken: string, perPage?)`
- Permissions: Mentor

### `/mentor/attendance/reports`
- Purpose: Attendance reports
- APIs:
  - Group report: `api.getGroupAttendanceReport(groupId: number)`
  - Student details: Not present; derive from report or extend backend.
- Permissions: Mentor

### `/mentor/schedule`
- Purpose: Practical schedule
- APIs:
  - Skill date ranges: `api.getSkillDateRange(skillId: string, academicSession?: string)`
  - Combine with `getMentorSkillGroups` to build schedule
- Permissions: Mentor

---

## 🎓 Student Pages

### `/student/dashboard`
- Purpose: Student hub
- APIs:
  - Profile: `api.getStudentProfile(userId: string)`
  - Current enrollment: `api.getEnrollment(userId: string)`
  - Schedule: Derived from group assignment and `getSkillDateRange`
- Permissions: Student

### `/student/profile/create`
- Purpose: One-time profile creation
- APIs:
  - Create: `api.createStudentProfile(userId: string, data: CreateStudentProfilePayload)`
- Permissions: Student without profile

### `/student/profile`
- Purpose: View profile
- APIs:
  - Profile: `api.getStudentProfile(userId: string)`
  - Enrollment history: Not present; fallback via `getAllEnrollments()` filter by user or extend backend.
- Permissions: Student

### `/student/skills`
- Purpose: Browse/enroll in skills
- APIs:
  - Available skills: `api.getAvailableSkills(userId: string)`
  - Create enrollment: `api.createEnrollment(userId: string, data: CreateEnrollmentPayload)`
- Permissions: Student with profile

### `/student/enrollment`
- Purpose: Current enrollment status
- APIs:
  - Get: `api.getEnrollment(userId: string)`
  - Pay: `api.payForEnrollment(userId: string, data?: EnrollmentPaymentPayload)`
- Permissions: Student with enrollment

### `/student/payment`
- Purpose: Payment handling
- APIs:
  - Initiate/continue payment: `api.payForEnrollment(userId: string, data?: EnrollmentPaymentPayload)`
- Permissions: Student with unpaid enrollment

### `/student/scan-qr`
- Purpose: Scan mentor QR for attendance
- APIs:
  - Scan: `api.processQrScan(data: ProcessQrScanPayload)`
  - Progress: Not present; derive from `api.getGroupAttendanceReport(groupId)` (filter by student) if needed.
- Permissions: Student in group

### `/student/my-group`
- Purpose: View assigned group
- APIs:
  - Enrollment: `api.getEnrollment(userId: string)` → use `groupId`
  - Group details: `api.getSkillGroup(groupId: number)` if needed; else derive from skills/groups listings
- Permissions: Student with group assignment

### `/student/attendance`
- Purpose: View own attendance
- APIs:
  - Group report: `api.getGroupAttendanceReport(groupId: number)` then filter for student
  - Scan history: `api.getQrScanHistory(qrToken, perPage?)` requires QR token; typically use group report instead.
- Permissions: Student

### `/student/schedule`
- Purpose: Practical schedule
- APIs:
  - Derived from assigned skill/group + `api.getSkillDateRange(skillId, academicSession?)`
- Permissions: Student with group

---

## System-Wide Utilities & Guards (References)

- Auth helpers: `src/lib/auth.ts` (e.g., `getCurrentUser`, role checks, redirects)
- Permissions: `src/lib/permissions.ts`
- Error handling: `src/lib/error-handling.ts` and `ApiError`
- Printing/QR utilities: `src/lib/utils/print.ts`, `src/lib/utils/qr.ts`
- Dates/utilities: `src/lib/utils/dates.ts`

Notes on Gaps / Proposed Extensions
- Global QR generation history, distribution tracking, student enrollment history per user, mentor schedule endpoints are not present in `api.ts`. Current plan derives UI from available endpoints; consider backend extensions for efficiency and accuracy.


