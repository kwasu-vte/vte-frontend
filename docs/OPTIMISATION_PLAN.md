# VTE Implementation Plans

## PLAN 1: TypeScript Files Restructure

### Phase 1: Complete Domain API Clients (Days 1-3)

#### File: `lib/api/skills.ts`
**Current:** Only has `getAll()`  
**Add these methods:**
```typescript
getById(id: string): Promise<ApiResponse<Skill>>,
create(data: CreateSkillPayload): Promise<ApiResponse<Skill>>,
update(id: string, data: UpdateSkillPayload): Promise<ApiResponse<Skill>>,
delete(id: string): Promise<void>,
getDateRange(id: string, academicSession?: string): Promise<ApiResponse<SkillDateRange | null>>,
updateDateRange(id: string, dateRange: SkillDateRangePayload): Promise<ApiResponse<SkillDateRange>>,
getGroupsBySkill(skillId: string, params?: { academic_session_id?: number; include_full?: boolean }): Promise<ApiResponse<SkillGroup[]>>,
autoAssignStudentsToGroups(skillId: string, data: AutoAssignPayload): Promise<ApiResponse<AutoAssignResponse>>
```

#### File: `lib/api/students.ts`  
**Current:** Missing search functionality  
**Add:**
```typescript
searchStudents(params: { search?: string; per_page?: number; page?: number }): Promise<ApiResponse<PaginatedResponse<StudentProfile>>>
```

#### File: `lib/api/auth.ts` (NEW FILE)
**Create authentication client:**
```typescript
export const authApi = {
  login(credentials: LoginPayload): Promise<ApiResponse<{ user: User }>>,
  logout(): Promise<void>,
  refresh(): Promise<ApiResponse<{ access_token: string }>>,
  getCurrentUser(): Promise<ApiResponse<User>>,
  register(userData: CreateUserPayload): Promise<ApiResponse<User>>
};
```

### Phase 2: Remove Legacy API Client (Days 4-5)

#### File: `lib/api.ts` - DELETE ENTIRE FILE
**Actions:**
1. Delete the 800+ line monolithic client
2. Remove all imports of `api` from this file across the codebase
3. Replace with domain-specific imports

#### Files to Update (Replace `api.*` calls):
```
/app/admin/dashboard/page.tsx
/app/admin/skills/page.tsx  
/app/admin/groups/page.tsx
/app/admin/students/page.tsx
/app/admin/mentors/page.tsx
/app/admin/enrollments/page.tsx
/app/admin/settings/page.tsx
/app/admin/sessions/page.tsx
/app/mentor/dashboard/page.tsx
/app/mentor/my-groups/page.tsx
/app/mentor/my-qr-codes/page.tsx
/app/mentor/my-skills/page.tsx
/app/mentor/schedule/page.tsx
/app/mentor/attendance/reports/page.tsx
/app/student/dashboard/page.tsx
/app/student/skills/page.tsx
/app/student/profile/page.tsx
/app/student/profile/create/page.tsx
/app/student/enrollment/page.tsx
/app/student/payment/page.tsx
/app/student/my-group/page.tsx
/app/student/schedule/page.tsx
/app/student/attendance/page.tsx
/app/student/scan-qr/page.tsx
```

#### Replacement Pattern:
```typescript
// OLD:
import { api } from '@/lib/api';
const skills = await api.getSkills();

// NEW:  
import { skillsApi } from '@/lib/api';
const skills = await skillsApi.getAll();
```

### Phase 3: Type System Cleanup (Days 6-7)

#### File: `lib/types.ts`
**Remove unused types:**
- `Payment` interface (no payment CRUD APIs)
- `AttendanceRecord` CRUD types (only reports exist)
- `SystemConfig` (no system configuration APIs)
- All announcement-related types

**Keep and enhance:**
- All enrollment types
- All QR code types  
- All skill group types
- All mentor types
- All student profile types

#### File: `lib/api/types/index.ts` - DELETE
**Action:** Remove type re-exports, use direct imports from `lib/types.ts`

#### Files: `lib/api/types/*.ts` - DELETE ALL
**Action:** Remove individual type files, consolidate into main types file

### Phase 4: API Client Index Reorganization (Day 8)

#### File: `lib/api/index.ts`
**Replace with:**
```typescript
export { authApi } from './auth';
export { skillsApi } from './skills';
export { studentsApi } from './students';  
export { mentorsApi } from './mentors';
export { enrollmentsApi } from './enrollments';
export { skillGroupsApi } from './skill-groups';
export { qrCodesApi } from './qr-codes';
export { academicSessionsApi } from './academic-sessions';

// Remove these exports (no API support):
// export { paymentsApi } from './payments';      // DELETE
// export { attendanceApi } from './attendance';  // DELETE  
// export { announcementsApi } from './announcements'; // DELETE
```

## PLAN 2: Pages Restructure

### Phase 1: Delete Unsupported Pages (Days 9-10)

#### Admin Pages to DELETE:
```
/app/admin/payments/page.tsx - DELETE ENTIRE FILE
/app/admin/attendance/page.tsx - DELETE ENTIRE FILE  
/app/admin/announcements/page.tsx - DELETE ENTIRE FILE
```

#### Mentor Pages to DELETE:
```
/app/mentor/announcements/page.tsx - DELETE ENTIRE FILE
/app/mentor/attendance/page.tsx - DELETE ENTIRE FILE
```

#### Student Pages to DELETE:
```  
/app/student/courses/page.tsx - DELETE ENTIRE FILE (already marked)
/app/student/announcements/page.tsx - DELETE ENTIRE FILE
```

### Phase 2: Merge Redundant Pages (Days 11-12)

#### Admin Settings → Sessions Merge
**Action:** 
- Keep `/app/admin/sessions/page.tsx`
- Delete `/app/admin/settings/page.tsx`
- Move user profile display to sessions page
- Update navigation to remove settings link

### Phase 3: Update Navigation (Day 13)

#### File: `components/navigation/admin-nav.tsx`
**Remove links:**
- Payments Management
- Attendance Management  
- Announcements
- Settings (merge into Sessions)

#### File: `components/navigation/mentor-nav.tsx`
**Remove links:**
- Announcements
- Attendance (manual taking)

#### File: `components/navigation/student-nav.tsx` 
**Remove links:**
- Courses
- Announcements

### Phase 4: Replace Mock Data (Days 14-16)

#### Admin Dashboard (`/app/admin/dashboard/page.tsx`)
**Replace:**
```typescript
// OLD: Mock recent activity
const mockRecentActivity = [...]

// NEW: Real enrollment data
const recentEnrollments = await enrollmentsApi.getAll({ per_page: 10 });
const recentActivity = recentEnrollments.data.items.map(enrollment => ({
  student: enrollment.user?.full_name,
  skill: enrollment.skill?.title,
  timestamp: enrollment.created_at
}));
```

#### Student Dashboard (`/app/student/dashboard/page.tsx`)
**Replace:**
```typescript  
// OLD: Mock upcoming practicals
const mockUpcomingPracticals = [...]

// NEW: Derive from enrollment
const enrollment = await enrollmentsApi.getUserEnrollment(userId);
const practicals = enrollment.data?.skill?.date_range_start ? 
  calculatePracticalDates(enrollment.data.skill) : [];
```

#### Mentor Dashboard (`/app/mentor/dashboard/page.tsx`)
**Replace:**
```typescript
// OLD: Mock today's schedule
const mockTodaysSchedule = [...]

// NEW: From skill groups  
const groups = await mentorsApi.getSkillGroups(userId);
const todaysSchedule = groups.data.filter(group => 
  isToday(group.practical_dates)
);
```

### Phase 5: Component Updates (Days 17-18)

#### Remove Mock Components:
```
/components/mock-data/announcements.tsx - DELETE
/components/mock-data/payments.tsx - DELETE
/components/mock-data/attendance.tsx - DELETE
```

#### Update Data Components:
```
/components/data/enrollment-status.tsx - Use real enrollment API
/components/data/group-assignment.tsx - Use real skill group API
/components/data/attendance-stats.tsx - Use QR attendance reports
/components/data/schedule-view.tsx - Derive from skill date ranges
```

## PLAN 3: Implementation & Integration

### Week 1: Foundation (Days 1-7)

#### Day 1-2: API Client Completion
**Priority Order:**
1. Complete `skillsApi` (used by all dashboards)
2. Complete `enrollmentsApi` (missing methods)
3. Create `authApi` (centralize authentication)

**Validation:**
- Test each new method with Postman/API client
- Verify TypeScript types match OpenAPI spec
- Add error handling for each endpoint

#### Day 3-4: Legacy API Migration - Admin Pages
**Files to update:**
```
/app/admin/dashboard/page.tsx
/app/admin/skills/page.tsx
/app/admin/groups/page.tsx
/app/admin/students/page.tsx
/app/admin/mentors/page.tsx
```

**Process per file:**
1. Replace `import { api } from '@/lib/api'` with domain imports
2. Replace method calls (`api.getSkills()` → `skillsApi.getAll()`)
3. Test page functionality
4. Remove any remaining mock data

#### Day 5-6: Legacy API Migration - Mentor/Student Pages
**Mentor files:**
```
/app/mentor/dashboard/page.tsx
/app/mentor/my-groups/page.tsx  
/app/mentor/my-qr-codes/page.tsx
/app/mentor/my-skills/page.tsx
```

**Student files:**
```
/app/student/dashboard/page.tsx
/app/student/skills/page.tsx
/app/student/profile/page.tsx
/app/student/enrollment/page.tsx
```

#### Day 7: Delete Legacy API Client
**Final action:**
- Delete `/lib/api.ts` 
- Verify no import errors
- Run full application test

### Week 2: Page Cleanup (Days 8-14)

#### Day 8-9: Remove Unsupported Pages
**Process:**
1. Delete payment management pages
2. Delete attendance management pages  
3. Delete announcement pages
4. Update navigation components
5. Test all navigation flows

#### Day 10-11: Mock Data Replacement - Admin
**Target pages:**
- Admin dashboard (statistics, recent activity)
- Admin enrollments (student assignment flows)
- Admin groups (member lists, capacity data)

**Process:**
1. Identify all mock data arrays/objects
2. Replace with real API derivations
3. Add loading states
4. Add error handling

#### Day 12-13: Mock Data Replacement - Mentor/Student
**Mentor targets:**
- Today's schedule (from skill groups)
- QR code analytics (from scan history)
- Student rosters (from enrollment data)

**Student targets:**
- Upcoming practicals (from skill date ranges)
- Group member lists (from enrollment relationships)  
- Attendance statistics (from QR reports)

#### Day 14: Navigation & Component Cleanup
**Actions:**
1. Update all navigation menus
2. Remove unused mock components
3. Update breadcrumb trails
4. Test all user journeys

### Week 3: Data Flow Optimization (Days 15-21)

#### Day 15-16: Composite Data Hooks
**Create custom hooks:**

```typescript
// hooks/use-student-dashboard-data.ts
export function useStudentDashboardData(userId: string) {
  const { data: profile } = useQuery(['student-profile', userId], () => 
    studentsApi.getProfile(userId));
  const { data: enrollment } = useQuery(['enrollment', userId], () => 
    enrollmentsApi.getUserEnrollment(userId));
  
  return {
    profile: profile?.data,
    enrollment: enrollment?.data,
    upcomingPracticals: enrollment?.data?.skill?.practical_dates || [],
    isLoading: !profile || !enrollment
  };
}
```

#### Day 17-18: Admin Dashboard Optimization
**Parallel data loading:**
```typescript
// app/admin/dashboard/page.tsx
const [sessions, statistics, enrollments] = await Promise.all([
  academicSessionsApi.getAll(),
  skillGroupsApi.getStatistics(),  
  enrollmentsApi.getAll({ per_page: 25 })
]);
```

#### Day 19-20: Error Handling & Loading States
**Standardize across all pages:**
1. Add error boundaries
2. Add skeleton loading components
3. Add retry mechanisms
4. Add user-friendly error messages

#### Day 21: Performance Testing
**Metrics to verify:**
- Page load times under 2 seconds
- API response times under 500ms
- No memory leaks in data fetching
- Proper cache invalidation

### Week 4: Integration & Polish (Days 22-28)

#### Day 22-23: User Flow Testing
**Test complete journeys:**

**Admin flow:**
1. Login → Dashboard → Create skill → Assign mentor → View enrollments → Generate QR codes

**Mentor flow:**  
1. Login → Dashboard → View groups → Generate QR codes → View attendance reports

**Student flow:**
1. Login → Create profile → Browse skills → Enroll → Pay → Scan QR codes

#### Day 24-25: Edge Case Handling
**Scenarios to test:**
- Empty data states (no enrollments, no groups)
- Network failures
- Invalid QR codes
- Expired sessions
- Permission denials

#### Day 26-27: Documentation & Code Review
**Deliverables:**
1. API client documentation
2. Component usage examples
3. Data flow diagrams
4. Error handling guide

#### Day 28: Final Validation & Deployment
**Pre-deployment checklist:**
- All legacy API references removed
- All mock data replaced with real APIs
- All unsupported pages removed
- Navigation flows working
- Error handling implemented
- Performance benchmarks met

**Post-deployment verification:**
- Monitor error rates
- Check API usage patterns  
- Validate user experience metrics
- Confirm data accuracy

### Success Metrics

**Technical:**
- Zero legacy API references
- Zero mock data in production pages
- 100% functional coverage of supported features
- Sub-2-second page load times

**User Experience:**  
- 25 fully functional pages (down from 33 mixed)
- Clear user journeys for each role
- Consistent error handling
- Real-time data everywhere

**Maintenance:**
- Single API client pattern
- Consistent TypeScript coverage
- Centralized error handling
- Documented data flows