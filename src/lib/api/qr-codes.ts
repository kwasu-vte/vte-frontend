import { apiRequest } from './base';
import { ApiResponse, PaginatedResponse, GroupQrCode, GroupQrCodeBatch, GenerateGroupQrCodePayload, BulkGenerateQrCodePayload, QrScanHistory, AttendanceReport, ProcessQrScanPayload, QrScanResponse } from '../types';

export const qrCodesApi = {
  generateForGroup(groupId: number, data: GenerateGroupQrCodePayload): Promise<ApiResponse<GroupQrCodeBatch>> {
    return apiRequest(`v1/qr-codes/groups/${groupId}/generate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  bulkGenerate(data: BulkGenerateQrCodePayload): Promise<ApiResponse<{ estimated_completion: string }>> {
    return apiRequest('v1/qr-codes/bulk-generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getScanHistory(qrToken: string, perPage?: number): Promise<ApiResponse<QrScanHistory>> {
    const query = perPage ? `?per_page=${perPage}` : '';
    return apiRequest(`v1/qr-codes/scan-history/${qrToken}${query}`);
  },

  getGroupAttendanceReport(groupId: number): Promise<ApiResponse<AttendanceReport>> {
    return apiRequest(`v1/qr-codes/groups/${groupId}/attendance-report`);
  },

  listGroupCodes(groupId: number, params?: { per_page?: number; status?: 'active' | 'expired' | 'all' }): Promise<ApiResponse<PaginatedResponse<GroupQrCode>>> {
    const query = new URLSearchParams();
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    if (params?.status) query.append('status', params.status);
    const q = query.toString();
    return apiRequest(`v1/qr-codes/groups/${groupId}/list${q ? `?${q}` : ''}`);
  },

  processScan(data: ProcessQrScanPayload): Promise<ApiResponse<QrScanResponse>> {
    return apiRequest('v1/attendance/scan', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};


