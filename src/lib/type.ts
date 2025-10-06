// Generic API response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// QR Code scanning related types
export interface ProcessQrScanPayload {
  token: string;
  student_id: string;
}

export interface QrScanResponse {
  success: boolean;
  points?: number;
  timestamp?: string;
  message?: string;
  student_name?: string;
}

// Add other types as needed...