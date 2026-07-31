import type { Memory, Template, QRCodeData, Order, MediaItem, SiteSettings, ActivityLog, User } from './types';

const API_BASE = '/api';

interface RequestOptions extends RequestInit {
  parseAsBlob?: boolean;
}

async function request<T>(path: string, options?: RequestOptions): Promise<T> {
  const { parseAsBlob, ...fetchOptions } = options || {};
  const res = await fetch(`${API_BASE}${path}`, {
    headers: !parseAsBlob ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'include',
    ...fetchOptions,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return parseAsBlob ? res.blob() as unknown as T : res.json();
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

async function requestList<T>(path: string): Promise<T[]> {
  const res = await request<PaginatedResponse<T>>(path);
  return res.data;
}

interface AuthResponse {
  user: User;
}

interface UserResponse {
  user: User;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<User>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    logout: () =>
      request<{ message: string }>('/auth/logout', { method: 'POST' }),
    getSession: () =>
      request<User | null>('/auth/session'),
  },
  memories: {
    list: () => requestList<Memory>('/memories'),
    get: (id: string) => request<Memory>(`/memories/${id}`),
    getBySlug: (slug: string) => request<Memory>(`/memories/slug/${slug}`),
    verifyAccess: (slug: string, password: string) =>
      request<Memory>(`/memories/slug/${slug}/verify`, { method: 'POST', body: JSON.stringify({ password }) }),
    create: (data: Partial<Memory>) => request<Memory>('/memories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Memory>) => request<Memory>(`/memories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      request<Memory>(`/memories/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    delete: (id: string) => request<{ message: string }>(`/memories/${id}`, { method: 'DELETE' }),
    duplicate: (id: string) => request<Memory>(`/memories/${id}/duplicate`, { method: 'PUT' }),
    incrementView: (id: string) => request<Memory>(`/memories/${id}/increment-view`, { method: 'PUT' }),
  },
  templates: {
    list: () => request<Template[]>('/templates'),
    updateStatus: (id: string, status: string) =>
      request<Template>(`/templates/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    duplicate: (id: string) => request<Template>(`/templates/${id}/duplicate`, { method: 'POST' }),
  },
  qr: {
    list: () => requestList<QRCodeData & { totalScans?: number }>('/qr'),
    create: (memoryId: string, qrValue: string, opts?: { foregroundColor?: string; backgroundColor?: string; logoUrl?: string; style?: string }) =>
      request<QRCodeData>('/qr', { method: 'POST', body: JSON.stringify({ memoryId, qrValue, ...opts }) }),
    incrementScan: (id: string) => request<QRCodeData>(`/qr/${id}/scan`, { method: 'PUT' }),
    customize: (id: string, opts: { foregroundColor?: string; backgroundColor?: string; logoUrl?: string | null; style?: string }) =>
      request<QRCodeData>(`/qr/${id}/customize`, { method: 'PUT', body: JSON.stringify(opts) }),
    download: (id: string, format: string = 'png', width: number = 400) =>
      request<Blob>(`/qr/${id}/download?format=${format}&width=${width}`, { method: 'GET', parseAsBlob: true }),
    analytics: (id: string, days: number = 30) =>
      request<{ qr: QRCodeData; totalScans: number; timeline: { date: string; count: number }[]; recentBrowsers: string[]; recentReferrers: string[] }>(`/qr/${id}/analytics?days=${days}`),
    bulk: (memoryIds: string[], opts?: { foregroundColor?: string; backgroundColor?: string; style?: string }) =>
      request<{ generated: number; data: QRCodeData[] }>('/qr/bulk', { method: 'POST', body: JSON.stringify({ memoryIds, ...opts }) }),
  },
  orders: {
    list: () => requestList<Order>('/orders'),
    updateStatus: (id: string, orderStatus: string) =>
      request<Order>(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ orderStatus }) }),
  },
  media: {
    list: () => request<MediaItem[]>('/media'),
    create: (data: Partial<MediaItem>) => request<MediaItem>('/media', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => request<{ success: boolean }>(`/media/${id}`, { method: 'DELETE' }),
  },
  upload: {
    file: (file: File, name?: string) => {
      const form = new FormData();
      form.append('file', file);
      if (name) form.append('name', name);
      return fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: form,
      }).then(async res => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(err.error || 'Upload failed');
        }
        return res.json() as Promise<MediaItem>;
      });
    },
    fileWithProgress: (file: File, onProgress: (pct: number) => void): Promise<MediaItem> => {
      return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('file', file);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload');
        xhr.withCredentials = true;
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            try { const err = JSON.parse(xhr.responseText); reject(new Error(err.error || 'Upload failed')); }
            catch { reject(new Error('Upload failed')); }
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(form);
      });
    },
    replace: (id: string, file: File, name?: string) => {
      const form = new FormData();
      form.append('file', file);
      if (name) form.append('name', name);
      return fetch(`/api/upload/replace/${id}`, {
        method: 'POST',
        credentials: 'include',
        body: form,
      }).then(async res => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(err.error || 'Replace failed');
        }
        return res.json() as Promise<MediaItem>;
      });
    },
  },
  settings: {
    get: () => request<SiteSettings>('/settings'),
    update: (data: Partial<SiteSettings>) => request<SiteSettings>('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  },
  logs: {
    list: () => requestList<ActivityLog>('/logs'),
    create: (data: Partial<ActivityLog>) => request<ActivityLog>('/logs', { method: 'POST', body: JSON.stringify(data) }),
  },
  users: {
    getCurrent: () => request<User>('/users/current'),
    updateCurrent: (data: Partial<User>) => request<User>('/users/current', { method: 'PUT', body: JSON.stringify(data) }),
  },
  music: {
    list: () => request<{ id: string; title: string; artist: string; musicUrl: string; thumbnail?: string; category: string; duration: string }[]>('/music'),
  },
};
