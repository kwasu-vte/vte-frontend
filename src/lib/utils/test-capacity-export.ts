/**
 * * Test Capacity Export Functionality
 * Simple test to verify the capacity overview export works correctly
 */

import { exportCapacityOverviewToExcel } from './excel-export';
import { GroupStatistics, SkillGroup } from '../types';

// * Mock data for testing
const mockStatistics: GroupStatistics = {
  total_groups: "10",
  total_students: "150",
  average_students_per_group: "15.0",
  average_utilization: "75",
  full_groups: "3",
  empty_groups: "1",
  groups_with_capacity: "6",
  utilization_distribution: {
    '0-25%': "1",
    '26-50%': "2",
    '51-75%': "3",
    '76-99%': "3",
    '100%': "1"
  }
};

const mockGroups: SkillGroup[] = [
  {
    id: "1",
    group_number: "001",
    current_student_count: "15",
    max_student_capacity: "20",
    capacity_percentage: 75,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    group_display_name: "Group 001 - Web Development",
    is_full: false,
    has_capacity: true,
    capacity_remaining: 5,
    skill: {
      id: "1",
      title: "Web Development",
      description: "Learn modern web development",
      max_groups: 5,
      min_students_per_group: 10,
      max_students_per_group: 25,
      date_range_start: "2024-01-01",
      date_range_end: "2024-06-30",
      exclude_weekends: false,
      allowed_levels: ["beginner", "intermediate"],
      meta: ["frontend", "backend"],
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      enrollments_count: 15,
      groups_count: 1
    }
  },
  {
    id: "2",
    group_number: "002",
    current_student_count: "20",
    max_student_capacity: "20",
    capacity_percentage: 100,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    group_display_name: "Group 002 - Mobile Development",
    is_full: true,
    has_capacity: false,
    capacity_remaining: 0,
    skill: {
      id: "2",
      title: "Mobile Development",
      description: "Learn mobile app development",
      max_groups: 3,
      min_students_per_group: 15,
      max_students_per_group: 20,
      date_range_start: "2024-01-01",
      date_range_end: "2024-06-30",
      exclude_weekends: false,
      allowed_levels: ["intermediate", "advanced"],
      meta: ["ios", "android"],
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      enrollments_count: 20,
      groups_count: 1
    }
  }
];

/**
 * * Test the capacity overview export functionality
 */
export function testCapacityExport() {
  try {
    console.log('Testing capacity overview export...');
    exportCapacityOverviewToExcel(mockStatistics, mockGroups);
    console.log('✅ Capacity overview export test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Capacity overview export test failed:', error);
    return false;
  }
}

// * Export for use in other test files
export { mockStatistics, mockGroups };
