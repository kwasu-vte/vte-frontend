## Component Population Plan (Incremental)

Status: In Progress
Scope: Populate newly scaffolded components with data from `src/lib/api.ts` following `docs/DESIGN_GUIDE.md`.

### Foundations (cross-cutting)
- Data access: Wrap `api` calls in small hooks per component; use Query Provider.
- UI patterns: Use NextUI; `className` for layout/spacing only; one primary action per view.
- Feedback: `Spinner`/`Skeleton` for loading; toasts for success/error.

Required NextUI primitives commonly used
- Button, Chip, Modal (+ModalBody/Header/Footer), Input, Select, Card (+CardBody/Header/Footer), Table (+TableHeader/Column/TableBody/Row/Cell), Pagination, Skeleton, Spinner, Tabs, Tooltip, Breadcrumbs.

---

### Phase 1: Sessions & Skills (Admin)

1) SessionsTable.tsx
- API:
  - Read: `api.getAcademicSessions(): Promise<ApiResponse<AcademicSession[]>>`
  - Mutate: `api.startAcademicSession(id: number)`, `api.endAcademicSession(id: number)`
- UI: Paginated table; status badge; actions start/end.
- NextUI: Table, Button, Chip (via SessionStatusBadge), Pagination, Skeleton.
- DoD:
  - [ ] Lists sessions with paging
  - [ ] Start/End actions update state
  - [ ] Loading/empty states shown

2) SessionModal.tsx
- API:
  - Create: `api.createAcademicSession({ name, starts_at?, ends_at? }): Promise<ApiResponse<AcademicSession>>`
  - Update: `api.updateAcademicSession(id: number, { name?, starts_at?, ends_at? }): Promise<ApiResponse<AcademicSession>>`
- UI: Form with name/dates, validation, primary submit.
- NextUI: Modal, Input, Button, Date inputs (Input until dedicated used), Spinner.
- DoD:
  - [ ] Validates fields
  - [ ] Creates/updates and refetches table

3) SessionStatusBadge.tsx
- API: none (derive from `AcademicSession.starts_at`/`ends_at`).
- UI: Semantic status chip.
- NextUI: Chip.
- DoD:
  - [ ] Correct color/label per status

4) SkillDateRangeModal.tsx
- API:
  - Read: `api.getSkillDateRange(id: string, academicSession?: string): Promise<ApiResponse<SkillDateRange|null>>`
  - Write: `api.updateSkillDateRange(id: string, payload: SkillDateRangePayload): Promise<ApiResponse<SkillDateRange>>`
- UI: Form start/end with validation.
- NextUI: Modal, Input (date), Button.
- DoD:
  - [ ] Loads existing range
  - [ ] Saves and toasts

5) SkillLevelSelector.tsx
- API: `api.getSkills(): Promise<ApiResponse<Skill[]>>`
- UI: Controlled select emitting selection.
- NextUI: Select.
- DoD:
  - [ ] Accessible select; emits value

---

### Phase 2: Enrollments (Admin)

6) EnrollmentFilters.tsx
- API: `api.getAcademicSessions()`, `api.getSkills()`
- UI: Filter controls; lift state to parent.
- NextUI: Select, Button (reset/apply), Input (search optional).
- DoD:
  - [ ] Emits filter object; persists in parent

7) EnrollmentsTable.tsx
- API: `api.getAllEnrollments(params?: { academic_session_id?: number; skill_id?: string; per_page?: number }): Promise<ApiResponse<PaginatedResponse<Enrollment>>>`
- UI: Paginated table; uses `EnrollmentStatusBadge`.
- NextUI: Table, Pagination, Chip, Skeleton.
- DoD:
  - [ ] Server-side pagination
  - [ ] Empty/loading states

8) EnrollmentStatusBadge.tsx
- API: none (status from `Enrollment`).
- UI: Status mapping to colors.
- NextUI: Chip, Tooltip (optional).
- DoD:
  - [ ] Accurate mapping/colors

---

### Phase 3: Groups & QR (Admin)

9) GroupCapacityIndicator.tsx
- API:
  - Optional read: `api.getSkillGroup(id: number): Promise<ApiResponse<SkillGroup>>` (or receive `SkillGroup` as prop)
- UI: ratio and color threshold.
- NextUI: Chip or Progress (if added later), Tooltip.
- DoD:
  - [ ] Shows current/capacity with semantic color

10) GroupStudentsList.tsx
- API:
  - Primary: `api.getSkillGroup(id: number)` (if includes members)
  - Fallback: `api.getAllEnrollments({ skill_id, academic_session_id })` then filter by group
- UI: List with search; paging.
- NextUI: Table or List, Input, Pagination, Skeleton.
- DoD:
  - [ ] Accurate roster; empty state

11) QRGenerationForm.tsx
- API:
  - Per-group: `api.generateGroupQrCodes(groupId: number, payload: GenerateGroupQrCodePayload): Promise<ApiResponse<GroupQrCodeBatch>>`
  - Bulk: `api.bulkGenerateQrCodes(payload: BulkGenerateQrCodePayload): Promise<ApiResponse<{ estimated_completion: string }>>`
- UI: Form for group, count, expiry.
- NextUI: Card, Input, Select, Button, Spinner.
- DoD:
  - [ ] Generates and confirms

12) QRDistributionTracker.tsx
- API: `api.listGroupQrCodes(groupId: number, params?: { per_page?: number; status?: 'active'|'expired'|'all' }): Promise<ApiResponse<PaginatedResponse<GroupQrCode>>>`
- UI: Table of codes with status/expiry.
- NextUI: Table, Select (status), Pagination, Skeleton.
- DoD:
  - [ ] Status filter; pagination

13) MentorQRAssignment.tsx
- API:
  - Mentors: `api.getMentors(params?): Promise<ApiResponse<MentorProfile[]>>`
  - Groups by skill: `api.getGroupsBySkill(skillId: string, params?): Promise<ApiResponse<SkillGroup[]>>`
  - Codes: `api.listGroupQrCodes(groupId, params?)`
- UI: Map QR batches to mentors workflow (business rules dependent).
- NextUI: Select, Table/List, Button, Card.
- DoD:
  - [ ] Clear assignment UI; reflects changes

---

### Phase 4: Mentor Features

14) MentorGroupsList.tsx
- API: `api.getMentorSkillGroups(userId: string): Promise<ApiResponse<SkillGroup[]>>`
- UI: Cards summarizing groups.
- NextUI: Card, Button, Chip.
- DoD:
  - [ ] Lists mentor’s groups

15) GroupStudentsRoster.tsx
- API: Same as Admin roster for a given `groupId`.
- UI: Read-only roster; search.
- NextUI: Table, Input, Skeleton.
- DoD:
  - [ ] Accurate roster; empty state

16) GroupScheduleCard.tsx
- API: `api.getSkillDateRange(skillId: string, academicSession?: string)`
- UI: Next occurrence, times.
- NextUI: Card, Chip, Tooltip.
- DoD:
  - [ ] Correct time handling

17) MentorSkillAssignment.tsx
- API:
  - Read: `api.getMentorAssignedSkills(userId: string): Promise<ApiResponse<Skill[]>>`
  - Add: `api.assignSkillToMentor(mentorProfileId: number, payload: AssignSkillPayload): Promise<ApiResponse<SkillMentor>>`
  - Remove: `api.removeSkillFromMentor(mentorProfileId: number, payload: RemoveSkillPayload): Promise<ApiResponse<string>>`
- UI: Multi-select and actions.
- NextUI: Select (multiple), Button, Chip.
- DoD:
  - [ ] Add/remove updates reflected

18) MentorWorkloadView.tsx
- API: `api.getGroupStatistics(params?: { skill_id?: number; academic_session_id?: number }): Promise<ApiResponse<GroupStatistics>>`
- UI: KPIs/stat cards.
- NextUI: Card, Grid (Tailwind), Chip.
- DoD:
  - [ ] Correct aggregates

19) MyQRCodesDisplay.tsx
- API: `api.listGroupQrCodes(groupId, params?)`
- UI: Grid of QR items; print/copy.
- NextUI: Card, Button, Tooltip.
- DoD:
  - [ ] Accurate list; print supported

20) PracticalQRCard.tsx
- API: none (display prop values; optionally integrate `utils/qr`).
- UI: Render QR or token with actions.
- NextUI: Card, Button, Tooltip.
- DoD:
  - [ ] Scannable/downloadable output

21) QRScanReport.tsx
- API:
  - History: `api.getQrScanHistory(qrToken: string, perPage?: number): Promise<ApiResponse<QrScanHistory>>`
  - Report: `api.getGroupAttendanceReport(groupId: number): Promise<ApiResponse<AttendanceReport>>`
- UI: Tabs for history vs report.
- NextUI: Tabs, Table, Pagination, Skeleton.
- DoD:
  - [ ] Correct counts; pagination

---

### Phase 5: Student Features

22) StudentQRScanner.tsx
- API: `api.processQrScan(payload: ProcessQrScanPayload): Promise<ApiResponse<QrScanResponse>>`
- UI: Token input first; camera scan later.
- NextUI: Card, Input, Button, Spinner, Modal (for result/confirmation).
- DoD:
  - [ ] Successful scan flow with feedback

23) ScanResultModal.tsx / ScanProgressIndicator.tsx / ScanConfirmationModal.tsx
- API: none (consume `QrScanResponse` from parent state).
- UI: Standardized modals and progress indicator.
- NextUI: Modal, Button, Spinner, Chip.
- DoD:
  - [ ] Clear accessible flow

24) AttendanceCompletionBadge.tsx
- API: none (percentage derived from props/report).
- UI: Percentage badge.
- NextUI: Chip, Tooltip.
- DoD:
  - [ ] Accurate percentage

25) AttendanceReport.tsx
- API: `api.getGroupAttendanceReport(groupId: number)`
- UI: Table or basic chart later.
- NextUI: Table, Tabs (if multiple views), Skeleton.
- DoD:
  - [ ] Matches backend report

26) ProfileForm.tsx / ProfileView.tsx / ProfileCompletionAlert.tsx
- API:
  - Read: `api.getStudentProfile(userId: string): Promise<ApiResponse<StudentProfile>>`
  - Create: `api.createStudentProfile(userId: string, payload: CreateStudentProfilePayload): Promise<ApiResponse<StudentProfile>>`
- UI: Form + view; alert when incomplete.
- NextUI: Card, Input, Select, Button, Chip.
- DoD:
  - [ ] Create/update success; view reflects

27) SkillSelectionGrid.tsx
- API:
  - Skills: `api.getAvailableSkills(userId: string): Promise<ApiResponse<Skill[]>>`
  - Groups: `api.getSkillGroups(params?)` or `api.getGroupsBySkill(skillId: string, params?: { academic_session_id?: number; include_full?: boolean })`
  - Assign: `api.assignStudentToGroup(groupId: number, payload: AssignStudentPayload): Promise<ApiResponse<{ group: SkillGroup; enrollment_id: string }>>`
- UI: Skill grid → group list with capacity → assign.
- NextUI: Card, Button, Select, Chip, Skeleton.
- DoD:
  - [ ] Only shows groups with capacity; assigns successfully

28) EnrollmentStatus.tsx / PaymentRedirect.tsx
- API:
  - Status: `api.getEnrollment(userId: string): Promise<ApiResponse<Enrollment|null>>`
  - Pay: `api.payForEnrollment(userId: string, data?: EnrollmentPaymentPayload): Promise<ApiResponse<EnrollmentPaymentResponse>>`
- UI: Status chip + CTA.
- NextUI: Chip, Button, Modal (confirm), Spinner.
- DoD:
  - [ ] End-to-end enroll → pay → confirm

29) GroupAssignmentCard.tsx
- API: `api.getEnrollment(userId: string)`
- UI: Card with group details.
- NextUI: Card, Chip, Button.
- DoD:
  - [ ] Accurate display

30) PracticalCalendar.tsx / UpcomingPracticals.tsx
- API: `api.getSkillDateRange(skillId: string, academicSession?: string)` (and/or parent-provided schedule data)
- UI: List/calendar of upcoming items.
- NextUI: Card, Table or simple list, Chip.
- DoD:
  - [ ] Correct upcoming ordering

---

### Finalization Checklist
- [ ] Query Provider present and configured
- [ ] Each table paginated (>25 items)
- [ ] Loading and empty states consistent
- [ ] Primary actions and confirmations used correctly
- [ ] Toasts on success/error across flows
- [ ] Role-based pages compose correct components
- [ ] Update CHANGELOG after each phase


