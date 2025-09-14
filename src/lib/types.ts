// * VTE Frontend Canonical Types
// * This file is the single source of truth for all data models
// * All types match the OpenAPI specification exactly

// --- USER & AUTH ---
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  matric_number: string | null;
  level: '100' | '200' | '300' | '400' | '500' | null;
  role: 'Admin' | 'Mentor' | 'Student';
  is_active: boolean;
  is_superuser: boolean;
  specialization?: string | null;
  experience?: string | null;
  bio?: string | null;
  groups?: Group[];
}

export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
}

// --- CORE ENTITIES ---
export interface Skill {
  id: string;
  title: string;
  description: string | null;
  max_groups: number;
  min_students_per_group: number;
  max_students_per_group: number | null;
  date_range_start: string | null;
  date_range_end: string | null;
  exclude_weekends: boolean;
  allowed_levels: string[] | null;
  meta: string[] | null;
  created_at: string | null;
  updated_at: string | null;
  enrollments_count: number;
  groups_count: number;
}

export interface SkillDateRange {
  id: number;
  skill_id: string;
  academic_session_id: number;
  date_range_start: string;
  date_range_end: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface AcademicSession {
  id: number;
  name: string;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  created_at: string | null;
  updated_at: string | null;
  groups_count?: number;
}

export interface StudentProfile {
  id: number;
  matric_number: string;
  student_level: string;
  department: string;
  faculty: string | null;
  phone: string | null;
  gender: string | null;
  can_enroll: boolean;
  meta: string[] | null;
  created_at: string | null;
  updated_at: string | null;
  full_name: string;
  student_level_int: string;
  attendances_count: string;
  enrollments_count: string;
}

export interface Group {
  id: string;
  name: string;
  skill: Pick<Skill, 'id' | 'title'>;
  mentor: Pick<User, 'id' | 'first_name' | 'last_name'> | null;
  members: Pick<User, 'id' | 'first_name' | 'last_name'>[];
  creation_date: string;
  end_date: string;
}

export interface Activity {
  id: string;
  title: string;
  type: 'class' | 'practical';
  start_time: string; // ISO Date string
  end_time: string;   // ISO Date string
  group: Pick<Group, 'id' | 'name'>;
}

export interface Payment {
  id: string;
  amount: string;
  reference: string;
  paystack_reference: string;
  payment_url: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_verification_attempt: string;
  student: Pick<User, 'id' | 'first_name' | 'last_name' | 'email'>;
  enrollment: string;
  payment_method?: string | null;
  transaction_id?: string | null;
  notes?: string | null;
}

export interface AttendanceRecord {
  id: string;
  student: Pick<User, 'id' | 'first_name' | 'last_name' | 'email'>;
  group: Pick<Group, 'id' | 'name'> & { skill: Pick<Skill, 'id' | 'title'> };
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAttendanceRecordPayload {
  student_id: string;
  group_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string | null;
}

export interface UpdateAttendanceRecordPayload {
  student_id?: string;
  group_id?: string;
  date?: string;
  status?: 'present' | 'absent' | 'late' | 'excused';
  notes?: string | null;
}

// --- PAYMENT TYPES ---
export interface CreatePaymentPayload {
  student_id: string;
  amount: number;
  payment_method?: string | null;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transaction_id?: string | null;
  notes?: string | null;
}

export interface UpdatePaymentPayload {
  student_id?: string;
  amount?: number;
  payment_method?: string | null;
  status?: 'completed' | 'pending' | 'failed' | 'refunded';
  transaction_id?: string | null;
  notes?: string | null;
}

// --- CONFIGURATION ---
export interface SystemConfig {
  system_name?: string;
  system_description?: string;
  admin_email?: string;
  support_email?: string;
  max_file_size?: number;
  session_timeout?: string;
  email_daily_limit?: number;
  enable_registration?: boolean;
  enable_notifications?: boolean;
  enable_analytics?: boolean;
  enable_backups?: boolean;
  maintenance_mode?: boolean;
  last_backup?: string;
  email_provider?: string;
  version?: string;
  environment?: string;
  semester_start_date: string;
  semester_end_date: string;
  max_skills_per_student: number;
  allow_300_level_selection: boolean;
  enrollment_start_date: string;
  enrollment_end_date: string;
  max_group_size: number;
  min_group_size: number;
  auto_assignment_enabled: boolean;
}

export interface UpdateSystemConfigPayload {
  system_name?: string;
  system_description?: string;
  admin_email?: string;
  support_email?: string;
  max_file_size?: number;
  session_timeout?: string;
  email_daily_limit?: number;
  enable_registration?: boolean;
  enable_notifications?: boolean;
  enable_analytics?: boolean;
  enable_backups?: boolean;
  maintenance_mode?: boolean;
}

// --- API RESPONSE WRAPPERS ---
export interface ApiResponse<T> {
  success: boolean;
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
  title: string;
  description?: string | null;
  max_groups: number;
  min_students_per_group: number;
  max_students_per_group?: number | null;
  date_range_start: string;
  date_range_end: string;
  meta?: string[] | null;
  allowed_levels: string[];
}

export interface UpdateSkillPayload {
  title?: string;
  description?: string;
  max_groups?: number;
  min_students_per_group?: number;
  max_students_per_group?: number;
  meta?: string[] | null;
  allowed_levels?: string[];
}

export interface SkillDateRangePayload {
  date_range_start: string;
  date_range_end: string;
}

export interface CreateGroupPayload {
  skill_id: string;
  force: boolean;
}

export interface UpdateGroupPayload {
  skill_id?: string;
  force?: boolean;
}

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'Admin' | 'Mentor' | 'Student';
  specialization?: string | null;
  experience?: string | null;
  bio?: string | null;
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  role?: 'Admin' | 'Mentor' | 'Student';
  specialization?: string | null;
  experience?: string | null;
  bio?: string | null;
}

export interface CreateStudentProfilePayload {
  matric_number: string;
  student_level: string;
  department: string;
  faculty: string;
  phone: string;
  gender: 'male' | 'female';
  meta?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
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
  can_manage_skills: boolean;
  can_manage_groups: boolean;
  can_manage_students: boolean;
  can_manage_mentors: boolean;
  can_view_payments: boolean;
  can_manage_system_settings: boolean;
  can_enroll_in_skills: boolean;
  can_view_attendance: boolean;
  can_take_attendance: boolean;
}
