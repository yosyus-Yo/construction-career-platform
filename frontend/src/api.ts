const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3000/api';

export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

export async function api(path: string, method = 'GET', body?: unknown) {
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

export async function register(email: string, password: string, role: Role) {
  return api('/auth/register', 'POST', { email, password, role });
}

export async function login(email: string, password: string) {
  return api('/auth/login', 'POST', { email, password });
}
