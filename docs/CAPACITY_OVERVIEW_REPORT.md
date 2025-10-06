# Capacity Overview Report Documentation

## Overview

The Capacity Overview Report provides administrators with comprehensive insights into system-wide group capacity utilization, student distribution, and resource management. This feature includes both viewable reports and Excel export functionality, similar to the attendance report system.

## Features

### 1. **Viewable Report**
- **System Statistics**: Total groups, students, average utilization
- **Capacity Distribution**: Visual breakdown of utilization ranges (0-25%, 26-50%, etc.)
- **Group Status Summary**: Groups with capacity, full groups, empty groups
- **Detailed Group Breakdown**: Individual group capacity details with status indicators

### 2. **Excel Export**
- **Multiple Sheets**: Summary, Group Details, Utilization Analysis
- **Comprehensive Data**: All statistics and detailed group information
- **Professional Formatting**: Proper column widths, headers, and data organization
- **Automatic Filename**: Date-stamped filenames for easy organization

## Implementation Details

### Components

#### `CapacityOverviewReport.tsx`
- **Location**: `src/components/features/admin/CapacityOverviewReport.tsx`
- **Purpose**: Main component for displaying capacity overview data
- **Props**:
  - `statistics`: GroupStatistics object with system-wide metrics
  - `groups`: Array of SkillGroup objects for detailed breakdown

#### `exportCapacityOverviewToExcel()`
- **Location**: `src/lib/utils/excel-export.ts`
- **Purpose**: Excel export functionality for capacity data
- **Parameters**:
  - `statistics`: GroupStatistics object
  - `groups`: Array of SkillGroup objects (optional)

### Data Structure

#### GroupStatistics Interface
```typescript
interface GroupStatistics {
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
```

#### SkillGroup Interface
```typescript
interface SkillGroup {
  id: string;
  group_number: string;
  current_student_count: string;
  max_student_capacity: string;
  capacity_percentage: number;
  group_display_name: string;
  is_full: boolean;
  has_capacity: boolean;
  capacity_remaining: number;
  skill?: Skill;
  created_at: string;
  updated_at: string;
}
```

## Usage

### Accessing the Report

1. **Navigate** to Admin Dashboard → Reports
2. **Select** "Capacity Overview" from the Report Type dropdown
3. **Click** "Generate" to load the report
4. **Click** "Export Excel" to download the report

### Report Sections

#### 1. Summary Statistics
- Total Groups: Number of groups in the system
- Total Students: Total enrolled students across all groups
- Average per Group: Average students per group
- Average Utilization: System-wide capacity utilization percentage

#### 2. Capacity Distribution
Visual breakdown showing how many groups fall into each utilization range:
- **0-25%**: Underutilized groups
- **26-50%**: Low utilization groups
- **51-75%**: Good utilization groups
- **76-99%**: High utilization groups
- **100%**: Full groups

#### 3. Group Status Summary
- **With Capacity**: Groups that can accept more students
- **Full Groups**: Groups at maximum capacity
- **Empty Groups**: Groups with no students
- **Partially Filled**: Groups with some students but not full

#### 4. Detailed Group Breakdown
Individual group information including:
- Group name and skill
- Current vs. maximum capacity
- Utilization percentage with visual progress bar
- Capacity status (Full, Near Full, Good, Low, Empty)
- Creation and update dates

## Excel Export Details

### Sheet Structure

#### 1. Summary Sheet
- Report metadata and generation timestamp
- System-wide statistics
- Group status summary
- Utilization distribution breakdown

#### 2. Group Details Sheet
- Individual group information
- Capacity metrics and status
- Skill information
- Timestamps

#### 3. Utilization Analysis Sheet
- Detailed utilization range analysis
- Percentage breakdowns
- Total counts and percentages

### File Naming
- **Format**: `Capacity_Overview_Report_YYYY-MM-DD.xlsx`
- **Example**: `Capacity_Overview_Report_2024-01-15.xlsx`

## API Integration

### Data Sources

#### Statistics API
- **Endpoint**: `GET /v1/skill-groups/statistics/overview`
- **Purpose**: Retrieves system-wide capacity statistics
- **Parameters**: Optional `skill_id` and `academic_session_id` filters

#### Groups API
- **Endpoint**: `GET /v1/skill-groups`
- **Purpose**: Retrieves detailed group information
- **Parameters**: `per_page=100` for comprehensive data

### Data Flow

1. **User selects** "Capacity Overview" report type
2. **System fetches** statistics from `skillGroupsApi.getStatistics()`
3. **System fetches** groups data from `skillGroupsApi.list()`
4. **Component renders** the report with both datasets
5. **User clicks** export button to generate Excel file

## Styling and UI

### Visual Indicators

#### Capacity Status Colors
- **Full (100%)**: Red (danger)
- **Near Full (80-99%)**: Yellow (warning)
- **Good (50-79%)**: Green (success)
- **Low (25-49%)**: Yellow (warning)
- **Empty (0-24%)**: Gray (default)

#### Progress Bars
- Visual representation of capacity utilization
- Color-coded based on utilization percentage
- Tooltip showing exact numbers (e.g., "15/20")

### Responsive Design
- **Grid Layout**: Adapts to different screen sizes
- **Mobile Friendly**: Stacks elements vertically on small screens
- **Table Responsiveness**: Horizontal scroll on mobile devices

## Error Handling

### Graceful Degradation
- **Missing Data**: Shows "N/A" for missing information
- **API Errors**: Displays error state with retry option
- **Export Failures**: Shows user-friendly error message

### Data Validation
- **Null Checks**: Handles null/undefined values safely
- **Type Conversion**: Converts string numbers to integers safely
- **Division by Zero**: Prevents division by zero in calculations

## Testing

### Test Coverage
- **Component Rendering**: Tests component with various data states
- **Export Functionality**: Tests Excel generation with mock data
- **Error Scenarios**: Tests error handling and edge cases

### Mock Data
- **Test File**: `src/lib/utils/test-capacity-export.ts`
- **Mock Statistics**: Realistic GroupStatistics object
- **Mock Groups**: Sample SkillGroup data for testing

## Future Enhancements

### Potential Improvements
1. **Filtering Options**: Filter by skill, academic session, or date range
2. **Historical Data**: Track capacity changes over time
3. **Predictive Analytics**: Forecast capacity needs
4. **Automated Reports**: Scheduled capacity reports
5. **Interactive Charts**: Visual charts and graphs
6. **Real-time Updates**: Live capacity monitoring

### Performance Optimizations
1. **Caching**: Cache statistics and groups data
2. **Pagination**: Handle large datasets efficiently
3. **Lazy Loading**: Load detailed data on demand
4. **Background Processing**: Generate reports asynchronously

## Troubleshooting

### Common Issues

#### Report Not Loading
- **Check**: API endpoints are accessible
- **Verify**: User has admin permissions
- **Ensure**: Groups data is available

#### Export Not Working
- **Verify**: XLSX library is installed
- **Check**: Browser allows file downloads
- **Ensure**: Data is properly formatted

#### Missing Data
- **Check**: Database has group and student data
- **Verify**: API responses include required fields
- **Ensure**: Data relationships are properly loaded

## Related Documentation

- [Attendance Report Documentation](./EXCEL_EXPORT_DOCUMENTATION.md)
- [Admin Dashboard Guide](./ADMIN_DASHBOARD.md)
- [API Documentation](./VTE_FRONTEND_API_DOCUMENTATION.md)
- [Component Library](./COMPONENTS.md)

---

**Last Updated**: January 2024  
**Version**: 1.0  
**Maintainer**: Development Team
