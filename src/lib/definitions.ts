export type LoginType = {
    username: string;
    password: string;
}

export type UserInfo = {
    status: boolean,
    email: string,
    first_name: string | null,
    last_name: string | null,
    matric_number: string | null,
    role: string,
    courses: CourseInfo[],
    level: string | null,
    is_active: boolean,
    is_superuser: boolean,
    access_token: string
    refresh_token: string
    token_type: string,
}

export type CourseInfo = {
    course: string,
    specialization: string | null,
    payment_reference: string[],
    payment_status: string,
    is_subscribed: boolean,
    group_name: string | null,
    serial_number: string | null,
    assignments: BasicAssignmentInfo[] | null,
    score: number,
}

export type BasicAssignmentInfo = {
    status: boolean,
    assignment_name: string,
    score: number,
}

export type Tokens = {
    access_token: string,
    refresh_token: string,
}


export const userInfo = {
    "email": "ecode5814@gmail.com",
    "first_name": "Abubakar",
    "last_name": "Alaya",
    "matric_number": "22/67am/585",
    "role": "student",
    "level": "300",
    "is_superuser": false,
}