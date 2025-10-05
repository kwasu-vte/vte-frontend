import * as XLSX from 'xlsx';

/**
 * * Excel Export Utilities
 * Comprehensive Excel export functionality for attendance reports and other data.
 * Provides proper formatting, styling, and sensible data arrangement.
 */

export interface AttendanceReportData {
  group_info: {
    id: number;
    group_number: number;
    skill_title: string;
    practical_date: string | null;
    total_enrolled: number;
  };
  students: Array<{
    student_id: string;
    full_name: string;
    matric_number: string;
    total_attendance: number;
    total_points: number;
    last_attendance: string | null;
    attendance_dates: string[];
  }>;
}

/**
 * * Export attendance report to Excel with proper formatting
 * Creates a well-structured Excel file with multiple sheets and proper styling
 */
export function exportAttendanceReportToExcel(data: AttendanceReportData): void {
  // * Create new workbook
  const wb = XLSX.utils.book_new();

  // * Prepare summary sheet data
  const summaryData = [
    ['ATTENDANCE REPORT SUMMARY'],
    [''],
    ['Group Information'],
    ['Group ID', data.group_info.id],
    ['Group Number', data.group_info.group_number],
    ['Skill Title', data.group_info.skill_title],
    ['Practical Date', data.group_info.practical_date || 'Not Scheduled'],
    ['Total Enrolled', data.group_info.total_enrolled],
    [''],
    ['Report Generated', new Date().toLocaleString()],
    [''],
    ['ATTENDANCE STATISTICS'],
    ['Total Students', data.students.length],
    ['Students with Attendance', data.students.filter(s => s.total_attendance > 0).length],
    ['Students without Attendance', data.students.filter(s => s.total_attendance === 0).length],
    ['Average Attendance Points', data.students.length > 0 ? 
      (data.students.reduce((sum, s) => sum + s.total_points, 0) / data.students.length).toFixed(2) : 0],
    [''],
    ['ATTENDANCE BREAKDOWN'],
    ['Excellent (75%+)', data.students.filter(s => s.total_attendance >= 75).length],
    ['Good (50-74%)', data.students.filter(s => s.total_attendance >= 50 && s.total_attendance < 75).length],
    ['Needs Improvement (<50%)', data.students.filter(s => s.total_attendance < 50).length]
  ];

  // * Create summary worksheet
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  
  // * Style summary sheet
  summaryWs['!cols'] = [
    { wch: 25 }, // Column A
    { wch: 20 }  // Column B
  ];

  // * Add summary sheet to workbook
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // * Prepare detailed attendance data
  const attendanceData = data.students.map((student, index) => ({
    'S/N': index + 1,
    'Student Name': student.full_name,
    'Matric Number': student.matric_number,
    'Total Attendance': student.total_attendance,
    'Total Points': student.total_points,
    'Last Attendance': student.last_attendance ? 
      new Date(student.last_attendance).toLocaleDateString() : 'Never',
    'Attendance Count': student.attendance_dates.length,
    'Status': getAttendanceStatus(student.total_attendance),
    'Performance Rating': getPerformanceRating(student.total_points)
  }));

  // * Create attendance worksheet
  const attendanceWs = XLSX.utils.json_to_sheet(attendanceData);

  // * Set column widths for attendance sheet
  attendanceWs['!cols'] = [
    { wch: 5 },   // S/N
    { wch: 25 },  // Student Name
    { wch: 15 },  // Matric Number
    { wch: 15 },  // Total Attendance
    { wch: 12 },  // Total Points
    { wch: 15 },  // Last Attendance
    { wch: 15 },  // Attendance Count
    { wch: 20 },  // Status
    { wch: 18 }   // Performance Rating
  ];

  // * Add attendance sheet to workbook
  XLSX.utils.book_append_sheet(wb, attendanceWs, 'Student Attendance');

  // * Create detailed attendance dates sheet if there are attendance records
  const studentsWithAttendance = data.students.filter(s => s.attendance_dates.length > 0);
  if (studentsWithAttendance.length > 0) {
    const detailedData: any[] = [];
    
    studentsWithAttendance.forEach(student => {
      if (student.attendance_dates.length === 0) {
        detailedData.push({
          'Student Name': student.full_name,
          'Matric Number': student.matric_number,
          'Attendance Date': 'No attendance recorded',
          'Points Earned': 0,
          'Status': 'Absent'
        });
      } else {
        student.attendance_dates.forEach((date, index) => {
          detailedData.push({
            'Student Name': student.full_name,
            'Matric Number': student.matric_number,
            'Attendance Date': new Date(date).toLocaleDateString(),
            'Points Earned': index === 0 ? student.total_points : 0, // Assuming points are cumulative
            'Status': 'Present'
          });
        });
      }
    });

    const detailedWs = XLSX.utils.json_to_sheet(detailedData);
    
    // * Set column widths for detailed sheet
    detailedWs['!cols'] = [
      { wch: 25 }, // Student Name
      { wch: 15 }, // Matric Number
      { wch: 15 }, // Attendance Date
      { wch: 12 }, // Points Earned
      { wch: 10 }  // Status
    ];

    XLSX.utils.book_append_sheet(wb, detailedWs, 'Detailed Records');
  }

  // * Generate filename
  const groupNumber = data.group_info.group_number;
  const skillTitle = data.group_info.skill_title.replace(/[^a-zA-Z0-9]/g, '_');
  const currentDate = new Date().toISOString().split('T')[0];
  const filename = `Attendance_Report_Group_${groupNumber}_${skillTitle}_${currentDate}.xlsx`;

  // * Download the file
  XLSX.writeFile(wb, filename);
}

/**
 * * Get attendance status based on attendance count
 */
function getAttendanceStatus(attendanceCount: number): string {
  if (attendanceCount >= 8) return 'Excellent';
  if (attendanceCount >= 6) return 'Good';
  if (attendanceCount >= 4) return 'Fair';
  if (attendanceCount >= 1) return 'Poor';
  return 'No Attendance';
}

/**
 * * Get performance rating based on points
 */
function getPerformanceRating(points: number): string {
  if (points >= 80) return 'Outstanding';
  if (points >= 60) return 'Good';
  if (points >= 40) return 'Average';
  if (points >= 20) return 'Below Average';
  if (points > 0) return 'Poor';
  return 'No Points';
}

/**
 * * Export generic data to Excel
 * Utility function for exporting any JSON data to Excel
 */
export function exportDataToExcel(data: any[], filename: string, sheetName: string = 'Data'): void {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  
  // * Auto-size columns
  const colWidths = Object.keys(data[0] || {}).map(() => ({ wch: 15 }));
  ws['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

/**
 * * Export multiple datasets to Excel with different sheets
 */
export function exportMultipleSheetsToExcel(
  sheets: Array<{ name: string; data: any[] }>,
  filename: string
): void {
  const wb = XLSX.utils.book_new();
  
  sheets.forEach(sheet => {
    const ws = XLSX.utils.json_to_sheet(sheet.data);
    
    // * Auto-size columns
    if (sheet.data.length > 0) {
      const colWidths = Object.keys(sheet.data[0]).map(() => ({ wch: 15 }));
      ws['!cols'] = colWidths;
    }
    
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });
  
  XLSX.writeFile(wb, filename);
}
