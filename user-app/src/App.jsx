import { useState, useEffect } from 'react';
import { getPublicOrganizations, checkFeature } from './api';

export default function App() {
  const [organizations, setOrganizations] = useState([]);
  const [orgId, setOrgId] = useState('');
  const [featureKey, setFeatureKey] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getPublicOrganizations()
      .then(setOrganizations)
      .catch((err) => setError(err.message));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const data = await checkFeature(orgId, featureKey);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Feature Flag Checker</h1>
        <p className="text-slate-500 mb-6">Check if a feature is enabled for an organization</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Organization</label>
            <select
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select organization</option>
              {organizations.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Feature Key</label>
            <input
              type="text"
              value={featureKey}
              onChange={(e) => setFeatureKey(e.target.value)}
              required
              placeholder="e.g. dark_mode"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Checking...' : 'Check Feature'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">
              Organization: <span className="font-medium text-slate-800">{result.organization.name}</span>
            </p>
            <p className="text-sm text-slate-600 mb-3">
              Feature: <span className="font-mono font-medium text-slate-800">{result.feature_key}</span>
            </p>
            {result.is_enabled ? (
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-sm">
                ✓ ENABLED
              </span>
            ) : (
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 font-semibold text-sm">
                ✗ DISABLED
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
