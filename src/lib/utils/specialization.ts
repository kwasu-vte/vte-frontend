// * Specialization utility functions
// * Provides mapping between specialization values and display labels

// * Specialization mapping for display labels
export const specializationOptions = [
  { key: 'web-development', value: 'web-development', label: 'Web Development' },
  { key: 'mobile-development', value: 'mobile-development', label: 'Mobile Development' },
  { key: 'data-science', value: 'data-science', label: 'Data Science' },
  { key: 'cybersecurity', value: 'cybersecurity', label: 'Cybersecurity' },
  { key: 'cloud-computing', value: 'cloud-computing', label: 'Cloud Computing' },
  { key: 'artificial-intelligence', value: 'artificial-intelligence', label: 'Artificial Intelligence' },
  { key: 'digital-marketing', value: 'digital-marketing', label: 'Digital Marketing' },
  { key: 'graphic-design', value: 'graphic-design', label: 'Graphic Design' },
  { key: 'project-management', value: 'project-management', label: 'Project Management' },
  { key: 'other', value: 'other', label: 'Other' }
];

/**
 * Gets the display label for a specialization value
 * @param specialization - The specialization value (e.g., 'web-development')
 * @returns The human-readable label (e.g., 'Web Development') or 'General' if not found
 */
export const getSpecializationLabel = (specialization: string | null | undefined): string => {
  if (!specialization) return 'General';
  
  const option = specializationOptions.find(opt => opt.value === specialization);
  return option ? option.label : specialization;
};

/**
 * Gets all specialization options for use in select components
 * @returns Array of specialization options with key, value, and label
 */
export const getSpecializationOptions = () => {
  return specializationOptions;
};
