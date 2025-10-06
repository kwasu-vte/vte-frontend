import { exportAttendanceReportToExcel } from '@/lib/utils/excel-export';

/**
 * * Test Excel Export Functionality
 * This demonstrates how the Excel export works with the provided data structure
 */

// * Sample data matching the structure you provided
const sampleAttendanceData = {
  "group_info": {
    "id": 1,
    "group_number": 1,
    "skill_title": "Composure",
    "practical_date": null,
    "total_enrolled": 1
  },
  "students": [
    {
      "student_id": "0199997e-cf36-70c5-b2ad-33d221de184e",
      "full_name": "Wale Bashir",
      "matric_number": "11/22AB/12345",
      "total_attendance": 0,
      "total_points": 0,
      "last_attendance": null,
      "attendance_dates": []
    }
  ]
};

// * Function to test the Excel export
export function testExcelExport() {
  try {
    exportAttendanceReportToExcel(sampleAttendanceData);
    console.log('Excel export completed successfully!');
  } catch (error) {
    console.error('Excel export failed:', error);
  }
}

// * Export the test function for use in development
export { sampleAttendanceData };
