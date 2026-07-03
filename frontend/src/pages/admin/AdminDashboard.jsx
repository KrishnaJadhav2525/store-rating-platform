import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Banner from '../../components/Banner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard.'));
  }, []);

  const cards = stats
    ? [
        { label: 'Total users', value: stats.totalUsers },
        { label: 'Total stores', value: stats.totalStores },
        { label: 'Total ratings submitted', value: stats.totalRatings },
      ]
    : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-3xl text-ink">Administrator dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">A snapshot of platform activity.</p>

      {error && <div className="mt-6"><Banner type="error">{error}</Banner></div>}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded border border-ink/10 bg-white p-6">
            <p className="text-xs uppercase tracking-wide text-ink/50">{c.label}</p>
            <p className="mt-2 font-mono-data text-4xl text-teal-deep">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
