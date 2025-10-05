# Excel Export Documentation

## Overview
The Excel export functionality creates a comprehensive, multi-sheet Excel workbook from attendance report data. The data is organized in a sensible, professional manner suitable for administrative use.

## Data Structure
The export function accepts data in the following format:
```typescript
{
  "group_info": {
    "id": number,
    "group_number": number,
    "skill_title": string,
    "practical_date": string | null,
    "total_enrolled": number
  },
  "students": Array<{
    "student_id": string,
    "full_name": string,
    "matric_number": string,
    "total_attendance": number,
    "total_points": number,
    "last_attendance": string | null,
    "attendance_dates": string[]
  }>
}
```

## Excel Workbook Structure

### Sheet 1: Summary
Contains high-level information and statistics:

| Field | Description |
|-------|-------------|
| Group Information | Group ID, number, skill title, practical date |
| Report Generated | Timestamp of report generation |
| Attendance Statistics | Total students, attendance counts, averages |
| Attendance Breakdown | Performance categories (Excellent, Good, Needs Improvement) |

### Sheet 2: Student Attendance
Detailed student-by-student attendance data:

| Column | Description | Width |
|--------|-------------|-------|
| S/N | Serial number | 5 |
| Student Name | Full name of student | 25 |
| Matric Number | Student matriculation number | 15 |
| Total Attendance | Number of attendance records | 15 |
| Total Points | Points earned | 12 |
| Last Attendance | Date of last attendance | 15 |
| Attendance Count | Number of attendance dates | 15 |
| Status | Performance status | 20 |
| Performance Rating | Rating based on points | 18 |

### Sheet 3: Detailed Records (if applicable)
Individual attendance records for students with attendance:

| Column | Description | Width |
|--------|-------------|-------|
| Student Name | Full name of student | 25 |
| Matric Number | Student matriculation number | 15 |
| Attendance Date | Date of attendance | 15 |
| Points Earned | Points for that attendance | 12 |
| Status | Present/Absent | 10 |

## Features

### Automatic Status Classification
- **Excellent**: 8+ attendance records
- **Good**: 6-7 attendance records  
- **Fair**: 4-5 attendance records
- **Poor**: 1-3 attendance records
- **No Attendance**: 0 attendance records

### Performance Rating
- **Outstanding**: 80+ points
- **Good**: 60-79 points
- **Average**: 40-59 points
- **Below Average**: 20-39 points
- **Poor**: 1-19 points
- **No Points**: 0 points

### File Naming Convention
Files are automatically named using the pattern:
```
Attendance_Report_Group_{groupNumber}_{skillTitle}_{date}.xlsx
```

Example: `Attendance_Report_Group_1_Composure_2024-01-15.xlsx`

## Usage

### In Admin Reports Page
1. Select "Attendance" as report type
2. Choose a group from the dropdown
3. Click "Generate" to fetch the data
4. Click "Export Excel" to download the formatted Excel file

### Programmatic Usage
```typescript
import { exportAttendanceReportToExcel } from '@/lib/utils/excel-export';

// Export attendance data
exportAttendanceReportToExcel(attendanceData);
```

## Benefits

1. **Professional Format**: Clean, organized layout suitable for administrative use
2. **Multiple Views**: Summary, detailed, and individual record views
3. **Automatic Analysis**: Built-in status classification and performance ratings
4. **Proper Formatting**: Optimized column widths and data presentation
5. **Comprehensive Data**: All relevant information included in organized sheets
6. **Easy Navigation**: Clear sheet names and logical data arrangement

## Technical Implementation

- Uses `xlsx` library for Excel file generation
- Supports multiple worksheets in a single workbook
- Automatic column width optimization
- Proper data type handling (dates, numbers, strings)
- Error handling for edge cases (no attendance data, etc.)
