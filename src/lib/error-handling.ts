// * Error Handling Utilities
// * Provides consistent error handling and user feedback across the application

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
  code?: string;
}

/**
 * Extracts a user-friendly error message from an API error
 * @param error - The error object from API calls
 * @param fallbackMessage - Default message if no specific error is found
 * @returns User-friendly error message
 */
export function getErrorMessage(error: ApiError | any, fallbackMessage: string = 'An unexpected error occurred'): string {
  // * Check for API response message key (most common format)
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  // * Check for direct message key (if error is the response data)
  if (error?.message) {
    return error.message;
  }
  
  // * Check for API response error (alternative format)
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  // * Check for error code
  if (error?.code) {
    return `Error ${error.code}: ${fallbackMessage}`;
  }
  
  // * Check for HTTP status code
  if (error?.response?.status) {
    const status = error.response.status;
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'You are not authorized to perform this action. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This action conflicts with existing data. Please refresh and try again.';
      case 422:
        return 'The data you provided is invalid. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later or contact support.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `${fallbackMessage} (HTTP ${status})`;
    }
  }
  
  return fallbackMessage;
}

/**
 * Gets a user-friendly title for error notifications
 * @param action - The action that failed (e.g., 'create', 'update', 'delete')
 * @param resource - The resource type (e.g., 'skill', 'user', 'group')
 * @returns Formatted error title
 */
export function getErrorTitle(action: string, resource: string): string {
  const actionMap: Record<string, string> = {
    create: 'Failed to Create',
    update: 'Failed to Update',
    delete: 'Failed to Delete',
    fetch: 'Failed to Load',
    save: 'Failed to Save',
    submit: 'Failed to Submit',
  };
  
  const actionText = actionMap[action.toLowerCase()] || 'Failed to Process';
  const resourceText = resource.charAt(0).toUpperCase() + resource.slice(1);
  
  return `${actionText} ${resourceText}`;
}

/**
 * Gets a user-friendly success message from an API response
 * @param response - The API response object
 * @param fallbackMessage - Default message if no specific success message is found
 * @returns User-friendly success message
 */
export function getSuccessMessage(response: any, fallbackMessage: string): string {
  // * Check for API response message key (most common format)
  if (response?.data?.message) {
    return response.data.message;
  }
  
  // * Check for direct message key (if response is the data)
  if (response?.message) {
    return response.message;
  }
  
  // * Check for success message in data
  if (response?.data?.success_message) {
    return response.data.success_message;
  }
  
  return fallbackMessage;
}

/**
 * Gets a user-friendly title for success notifications
 * @param action - The action that succeeded (e.g., 'create', 'update', 'delete')
 * @param resource - The resource type (e.g., 'skill', 'user', 'group')
 * @returns Formatted success title
 */
export function getSuccessTitle(action: string, resource: string): string {
  const actionMap: Record<string, string> = {
    create: 'Created',
    update: 'Updated',
    delete: 'Deleted',
    save: 'Saved',
    submit: 'Submitted',
  };
  
  const actionText = actionMap[action.toLowerCase()] || 'Processed';
  const resourceText = resource.charAt(0).toUpperCase() + resource.slice(1);
  
  return `${resourceText} ${actionText}`;
}
