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
  max_groups?: number | null;
  min_students_per_group: number;
  max_students_per_group?: number | null;
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

// --- NEW API TYPES ---

// * Enrollment Management
export interface Enrollment {
  id: number;
  user_id: string;
  skill_id: string;
  academic_session_id: number;
  status: 'pending' | 'paid' | 'assigned' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
  updated_at: string;
  user?: User;
  skill?: Skill;
  academic_session?: AcademicSession;
}

export interface CreateEnrollmentPayload {
  skill_id: string;
}

export interface EnrollmentPaymentPayload {
  enrollment_id?: number | null;
}

export interface EnrollmentPaymentResponse {
  payment_id: string;
  reference: string;
  payment_url: string;
  amount: number;
  currency: string;
  gateway: string;
}

// * QR Code Management
export interface GroupQrCode {
  id: string;
  skill_group_id: string;
  token: string;
  path: string;
  mark_value: string;
  expires_at: string;
}

export interface GroupQrCodeBatch {
  batch_id: string;
  group_id: string;
  quantity: string;
  codes: GroupQrCode[];
}

export interface GenerateGroupQrCodePayload {
  quantity: number;
  mark_value?: number;
  expires_at?: string;
}

export interface BulkGenerateQrCodePayload {
  skill_id: string;
  mark_value?: number;
  codes_per_group?: number;
  expires_at?: string;
}

export interface QrScanHistory {
  qr_info: {
    token: string;
    skill_title: string;
    group_number: string;
    mark_value: string;
    expires_at: string;
  };
  scans: AttendanceRecord[];
}

export interface AttendanceReport {
  group_info: {
    id: number;
    group_number: number;
    skill_title: string;
    practical_date: string | null;
    total_enrolled: string;
  };
  students: string[];
}

// * Skill Groups Management
export interface SkillGroup {
  id: string;
  group_number: string;
  current_student_count: string;
  max_student_capacity: string;
  capacity_percentage: number;
  created_at: string;
  updated_at: string;
  skill?: Skill;
  academic_session?: AcademicSession;
  students?: User[];
  practical_dates?: string[];
  is_full: boolean;
  has_capacity: boolean;
  capacity_remaining: number;
  group_display_name: string;
}

export interface CreateSkillGroupPayload {
  skill_id: number;
  academic_session_id: number;
  group_number?: number;
}

export interface AssignStudentPayload {
  enrollment_id: number;
}

export interface GroupStatistics {
  total_groups: string;
  total_students: string;
  average_students_per_group: string | number;
  average_utilization: string;
  full_groups: string;
  empty_groups: string;
  groups_with_capacity: string;
  utilization_distribution: {
    '0-25%': string;
    '26-50%': string;
    '51-75%': string;
    '76-99%': string;
    '100%': string;
  };
}

export interface AutoAssignPayload {
  academic_session_id: number;
}

export interface AutoAssignResponse {
  assigned_count: string;
  created_groups: string;
  failed_assignments: string;
}

// * Mentor Management
export interface MentorProfile {
  id: number;
  user_id: string;
  specialization: string;
  phone: string | null;
  is_available: boolean;
  is_active: boolean;
  total_students_mentored: number;
  meta: any[] | null;
  created_at: string | null;
  updated_at: string | null;
  user: User;
  assigned_skills: string;
  skill_mentorships: string;
  full_name: string;
  current_student_count: number;
  is_available_for_assignment: boolean;
  statistics?: {
    assigned_skills_count: string;
    active_groups_count: string;
    current_students: number;
    total_students_mentored: number;
  };
}

export interface CreateMentorProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  specialization: string;
  phone?: string | null;
  is_available?: boolean;
  is_active?: boolean;
  meta?: string | null;
  password_confirmation: string;
}

export interface AssignSkillPayload {
  skill_id: string;
  is_primary?: boolean;
}

export interface RemoveSkillPayload {
  skill_id: string;
}

export interface SkillMentor {
  id: number;
  skill_id: string;
  mentor_id: string;
  is_primary: boolean;
  assigned_at: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

// * Attendance Scanning
export interface ProcessQrScanPayload {
  token: string;
  student_id: string;
  device_info?: {
    device_id?: string;
    platform?: 'ios' | 'android' | 'web';
    app_version?: string;
  };
}

export interface QrScanResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    attendance_id?: string;
    points_awarded?: string;
    scanned_at?: string;
    skill_title?: string;
    group_number?: string;
    error?: 'DUPLICATE_ATTENDANCE' | 'NOT_ENROLLED' | 'EXPIRED_QR' | 'INVALID_QR';
    existing_attendance?: {
      id: string;
      scanned_at: string;
      points_awarded: string;
    };
  };
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
