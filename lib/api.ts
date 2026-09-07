const configuredBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';
export const API_BASE_URL = configuredBase.replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 0) { super(message); this.name = 'ApiError'; this.status = status; }
}

const inFlight = new Map<string, Promise<unknown>>();

export async function apiRequest<T>(path: string, options: RequestInit & { token?: string; dedupe?: boolean } = {}): Promise<T> {
  const { token, dedupe = false, ...requestOptions } = options;
  const key = `${requestOptions.method || 'GET'}:${path}:${token || ''}`;
  if (dedupe && inFlight.has(key)) return inFlight.get(key) as Promise<T>;

  const request = (async () => {
    let response: Response;
    try {
      const headers = new Headers(requestOptions.headers);
      if (!(requestOptions.body instanceof FormData)) headers.set('Content-Type', 'application/json');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...requestOptions,
        headers,
      });
    } catch {
      throw new ApiError('The server could not be reached. Check your connection and try again.');
    }
    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await response.json() as { error?: { message?: string } } : null;
    if (!response.ok) throw new ApiError(body?.error?.message || 'Something went wrong. Please try again.', response.status);
    return body as T;
  })();

  if (dedupe) inFlight.set(key, request);
  try { return await request; } finally { if (dedupe) inFlight.delete(key); }
}

export function mediaUrl(url?: string) {
  if (!url) return '';
  if (/^https?:\/\//.test(url) || url.startsWith('data:') || url.startsWith('/images/')) return url;
  return `${API_BASE_URL.replace(/\/api$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
}

export const formatMoney = (amount: number) => `${new Intl.NumberFormat('en-US').format(amount)} MMK`;
export const formatDateTime = (value?: string) => value ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Yangon' }).format(new Date(value)) : 'Schedule to be announced';
