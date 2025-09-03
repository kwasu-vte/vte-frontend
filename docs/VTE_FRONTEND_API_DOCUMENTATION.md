# VTE Frontend API Documentation

## Overview
This document outlines the API request and response structures for the VTE (Vocational Technical Education) Frontend application. The application uses both Axios instances and direct fetch calls to communicate with the backend API.

## Base Configuration
- **Base URL**: `process.env.NEXT_PUBLIC_API_URL`
- **Default Timeout**: 30 seconds
- **Authentication**: Bearer token in Authorization header

## Authentication Endpoints

### 1. User Login
**Endpoint**: `POST /api/auth/token`

**Request Headers**:
```
Content-Type: application/x-www-form-urlencoded
```

**Request Body** (form-encoded):
```
username={username}&password={password}
```

**Response Structure**:
```typescript
interface UserInfo {
  status: boolean;
  email: string;
  first_name: string | null;
  last_name: string | null;
  matric_number: string | null;
  role: string;
  courses: CourseInfo[];
  level: string | null;
  is_active: boolean;
  is_superuser: boolean;
  access_token: string;
  refresh_token: string;
  token_type: string;
}
```

### 2. Token Refresh
**Endpoint**: `POST /api/auth/refresh_token`

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer {refresh_token}
```

**Request Body**:
```json
{
  "access_token": "string"
}
```

**Response Structure**:
```typescript
interface RefreshResponse {
  refreshed: boolean;
  access_token: string;
}
```

### 3. User Registration
**Endpoint**: `POST /api/core/register/`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```typescript
interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  matric_number: string;
  level: string;
  role: string;
}
```

**Response Structure**:
```typescript
interface CreateUserResponse {
  id: string;
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  matric_number: string;
  level: string;
  role: string;
  access: string;
}
```

### 4. Alternative Login (Core Token)
**Endpoint**: `POST /api/core/token/`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

## Course Management

### 1. Create Course
**Endpoint**: `POST /api/courses/create/`

**Request Body**:
```typescript
interface CreateCoursePayload {
  code: string;
  title: string;
  description: string;
  department: string;
  price: string;
}
```

**Response Structure**:
```typescript
interface CreateCourseResponse {
  id: string;
  code: string;
  title: string;
  description: string;
  department: string;
  price: string;
}
```

### 2. Get All Courses
**Endpoint**: `GET /api/courses/`

**Response Structure**:
```typescript
interface CourseResponse {
  // Array of courses with structure matching CreateCourseResponse
}
```

### 3. Update Course
**Endpoint**: `PATCH /api/courses/{id}/edit/`

**Request Body**: Same as CreateCoursePayload

**Response Structure**: Same as CreateCourseResponse

### 4. Delete Course
**Endpoint**: `DELETE /api/courses/{id}/edit/`

**Response**: No content (204)

### 5. Get Enrolled Courses
**Endpoint**: `GET /api/courses/`

**Response Structure**: Array of enrolled courses

## Skill Management

### 1. Create Skill
**Endpoint**: `POST /api/skills/`

**Request Body**:
```typescript
interface CreateSkillPayload {
  code: string;
  title: string;
  description: string;
  price: string;
  available_level_ids: string[];
  capacity: number;
}
```

**Response Structure**:
```typescript
interface CreateSkillResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    code: string;
    title: string;
    description: string;
    enrollment_deadline: string;
    price: string;
    available_levels: [];
    capacity: number;
    current_capacity: number;
  };
}
```

### 2. Get All Skills
**Endpoint**: `GET /api/skills/`

**Response Structure**:
```typescript
interface SkillResponse {
  status: boolean;
  message: string;
  data: Skill[];
}

interface Skill {
  id: string;
  code: string;
  title: string;
  description: string;
  price: string;
  enrollment_deadline: string;
  available_levels: SkillLevel[];
  capacity: number;
  current_capacity: number;
}

interface SkillLevel {
  level: string;
}
```

### 3. Update Skill
**Endpoint**: `PATCH /api/skills/{id}/edit/`

**Request Body**: Same as CreateSkillPayload

**Response Structure**: Same as CreateSkillResponse

### 4. Delete Skill
**Endpoint**: `DELETE /api/skills/{id}/delete/`

**Response**: No content (204)

### 5. Get Skill Settings
**Endpoint**: `GET /api/skills/admin/config/`

**Response Structure**: Skill configuration data

### 6. Update Skill Settings
**Endpoint**: `PUT /api/skills/admin/config/`

**Request Body**: Skill configuration object

**Response Structure**: Updated configuration

### 7. Random Student Enrollment
**Endpoint**: `POST /api/skills/admin/random-enrollment/`

**Response**: Enrollment status

## Group Management

### 1. Create Group
**Endpoint**: `POST /api/group/create-group/`

**Request Body**:
```typescript
interface CreateGroupPayload {
  skill_id: string;
  force: boolean;
}
```

**Response Structure**:
```typescript
interface CreateGroupResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    creation_date: string;
    end_date: string;
    skill: Skill;
    primary_mentor: Mentor;
    additional_mentors: Mentor[];
    members: Member[];
  };
}

interface Mentor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}
```

### 2. Get All Groups
**Endpoint**: `GET /api/group/list/`

**Response Structure**: Array of groups

### 3. Get Group by ID
**Endpoint**: `GET /api/group/{group_id}/`

**Response Structure**: Single group object

### 4. Update Group
**Endpoint**: `PATCH /api/group/{id}/edit/`

**Request Body**: Group update data

**Response Structure**: Updated group object

### 5. Delete Group
**Endpoint**: `DELETE /api/grouping/groups/{id}/`

**Response**: No content (204)

### 6. Get Group Settings
**Endpoint**: `GET /api/group/settings/`

**Response Structure**: Group configuration data

### 7. Update Group Settings
**Endpoint**: `PUT /api/group/settings/`

**Request Body**: Group settings object

**Response Structure**: Updated settings

## User Management

### 1. Get All Students
**Endpoint**: `GET /api/core/students/all/`

**Response Structure**:
```typescript
interface Student {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  matric_number: string;
  level: string;
  role: string;
  group?: string;
}
```

### 2. Get Student by ID
**Endpoint**: `GET /api/core/students/{pathId}/`

**Response Structure**: Single student object

### 3. Update User
**Endpoint**: `PATCH /api/core/register/{id}/edit/`

**Request Body**: User update data

**Response Structure**: Updated user object

### 4. Delete User
**Endpoint**: `DELETE /api/core/register/{id}/`

**Response**: No content (204)

### 5. Get All Mentors
**Endpoint**: `GET /api/core/mentors/all/`

**Response Structure**: Array of mentor objects

### 6. Get Admin by ID
**Endpoint**: `GET /api/core/admins/{pathId}/`

**Response Structure**: Single admin object

## Payment Management

### 1. Get All Payments
**Endpoint**: `GET /api/payments/`

**Response Structure**:
```typescript
interface PaymentResponse {
  status: boolean;
  message: string;
  data: Payment[];
}

interface Payment {
  id: string;
  amount: string;
  reference: string;
  paystack_reference: string;
  payment_url: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_verification_attempt: string;
  student: string;
  enrollment: string;
}
```

## Course Registration & Payment

### 1. Register for Course
**Endpoint**: `POST /api/auth/register_course`

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "course": "string",
  "specialization": "string | null"
}
```

**Response Structure**:
```typescript
interface RegisterCourseResponse {
  status: boolean;
  data: {
    authorization_url: string;
  };
}
```

### 2. Activate Course
**Endpoint**: `POST /api/auth/activate?reference={reference}&course_name={course}`

**Request Headers**:
```
Authorization: Bearer {access_token}
```

**Response Structure**:
```typescript
interface ActivateResponse {
  msg: string;
}
```

## Error Handling

### Standard Error Response
```typescript
interface ErrorResponse {
  status: number;
  data: {
    message: string;
    // Additional error details
  };
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `204`: No Content
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Authentication Flow

1. **Login**: User provides credentials → receives access and refresh tokens
2. **Token Storage**: Tokens stored in cookies (access_token, refresh_token)
3. **Request Authorization**: All subsequent requests include `Authorization: Bearer {access_token}`
4. **Token Refresh**: When access token expires, use refresh token to get new access token
5. **Logout**: Clear tokens and redirect to login page

## Notes

- The application uses both Axios instances and direct fetch calls
- Authentication tokens are stored in cookies using js-cookie
- Some endpoints use form-encoded data while others use JSON
- The API follows RESTful conventions with standard HTTP methods
- Error responses include status codes and descriptive messages
- All authenticated endpoints require a valid Bearer token in the Authorization header
