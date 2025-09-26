// * Shared API base client for domain services
// * Uses proxy pattern: Client → /api/* → Backend

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// * Core request helper used by all domain services
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const proxyUrl = `/api/${endpoint}`;
  const isServer = typeof window === 'undefined';

  const origin = isServer
    ? (process.env.NEXT_PUBLIC_APP_URL
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'))
    : '';
  const url = isServer ? `${origin}${proxyUrl}` : proxyUrl;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  const config: RequestInit = {
    headers,
    ...options,
  };

  if (isServer) {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get('session_token');
      if (sessionToken && !('Authorization' in headers)) {
        headers['Cookie'] = `session_token=${sessionToken.value}`;
        config.headers = headers;
      }
    } catch (error) {
      // * Continue without cookies when unavailable in context
    }
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        (errorData as any)?.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : 'Network error', 0);
  }
}


