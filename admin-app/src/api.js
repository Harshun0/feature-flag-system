const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export async function getPublicOrganizations() {
  const response = await fetch(`${API_URL}/api/super-admin/organizations/public`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function register(name, email, password, organizationId) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, organizationId }),
  });
}

export async function login(email, password) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getFlags() {
  return apiRequest('/api/flags');
}

export async function createFlag(feature_key, description, is_enabled) {
  return apiRequest('/api/flags', {
    method: 'POST',
    body: JSON.stringify({ feature_key, description, is_enabled }),
  });
}

export async function updateFlag(id, updates) {
  return apiRequest(`/api/flags/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteFlag(id) {
  return apiRequest(`/api/flags/${id}`, { method: 'DELETE' });
}
