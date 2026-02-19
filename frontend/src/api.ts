export const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3000/api';

export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
export type User = { id: string; email: string; role: Role };

export async function api<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, role: Role) => api<{ token: string; user: User }>('/auth/register', 'POST', { email, password, role }),
  login: (email: string, password: string) => api<{ token: string; user: User }>('/auth/login', 'POST', { email, password }),
};
