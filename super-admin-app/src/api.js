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

export async function loginSuperAdmin(email, password) {
  return apiRequest('/api/super-admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getOrganizations() {
  return apiRequest('/api/super-admin/organizations');
}

export async function createOrganization(name, description) {
  return apiRequest('/api/super-admin/organizations', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
}
