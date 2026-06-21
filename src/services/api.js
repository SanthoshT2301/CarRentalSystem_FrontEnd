const BASE = 'http://localhost:5022/api/v1';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders(extra = {}) {
  const t = getToken();
  return {
    'Content-Type': 'application/json',
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...extra,
  };
}

export async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders(), ...options });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}

export { BASE, authHeaders };