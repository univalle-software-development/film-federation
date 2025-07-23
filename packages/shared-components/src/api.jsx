// packages/shared-components/src/api.js
const API_BASE = process.env.API_BASE_URL || 'http://localhost';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} — ${text}`);
  }
  return res.json();
}

export function createUser(email) {
  return request('/users/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function getUser(userId) {
  return request(`/users/${userId}`);
}
