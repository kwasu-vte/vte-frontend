// * VTE Frontend Canonical Types
// * This file is the single source of truth for all data models
// * All API responses will be transformed to match these types

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
  code: string;
  enrollmentDeadline: string;
  availableLevels: { level: string }[];
}

export interface Group {
  id: string;
  name: string;
  skill: Pick<Skill, 'id' | 'title'>;
  mentor: Pick<User, 'id' | 'firstName' | 'lastName'> | null;
  members: Pick<User, 'id' | 'firstName' | 'lastName'>[];
  creationDate: string;
  endDate: string;
}

export interface Activity {
  id: string;
  title: string;
  type: 'class' | 'practical';
  startTime: string; // ISO Date string
  endTime: string;   // ISO Date string
  group: Pick<Group, 'id' | 'name'>;
}

export interface Payment {
  id: string;
  amount: string;
  reference: string;
  paystackReference: string;
  paymentUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastVerificationAttempt: string;
  student: string;
  enrollment: string;
}

export interface AttendanceRecord {
  id: string;
  student: Pick<User, 'id' | 'firstName' | 'lastName'>;
  group: Pick<Group, 'id' | 'name'>;
  activity: Pick<Activity, 'id' | 'title'>;
  status: 'present' | 'absent' | 'late';
  timestamp: string;
  verifiedBy?: Pick<User, 'id' | 'firstName' | 'lastName'>;
}

// --- CONFIGURATION ---
export interface SystemConfig {
  semesterStartDate: string;
  semesterEndDate: string;
  maxSkillsPerStudent: number;
  allow300LevelSelection: boolean;
  enrollmentStartDate: string;
  enrollmentEndDate: string;
  maxGroupSize: number;
  minGroupSize: number;
  autoAssignmentEnabled: boolean;
}

// --- API RESPONSE WRAPPERS ---
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// --- FORM PAYLOADS ---
export interface CreateSkillPayload {
  code: string;
  title: string;
  description: string;
  price: string;
  availableLevelIds: string[];
  capacity: number;
}

export interface CreateGroupPayload {
  skillId: string;
  force: boolean;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  password2: string;
  firstName: string;
  lastName: string;
  matricNumber: string;
  level: string;
  role: string;
}

// --- NAVIGATION ---
export interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  role: User['role'][];
  badge?: string | number;
}

// --- PERMISSIONS ---
export interface UserPermissions {
  canManageSkills: boolean;
  canManageGroups: boolean;
  canManageStudents: boolean;
  canManageMentors: boolean;
  canViewPayments: boolean;
  canManageSystemSettings: boolean;
  canEnrollInSkills: boolean;
  canViewAttendance: boolean;
  canTakeAttendance: boolean;
}
