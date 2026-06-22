const API_URL = import.meta.env.VITE_API_URL;

export async function getPublicOrganizations() {
  const response = await fetch(`${API_URL}/api/super-admin/organizations/public`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function checkFeature(orgId, feature) {
  const response = await fetch(
    `${API_URL}/api/flags/check?orgId=${encodeURIComponent(orgId)}&feature=${encodeURIComponent(feature)}`
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}
