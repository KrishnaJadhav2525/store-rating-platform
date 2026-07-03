import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Banner from '../components/Banner';

export default function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/store-owner/dashboard')
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard.'));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-3xl text-ink">My store</h1>

      {error && <div className="mt-6"><Banner type="error">{error}</Banner></div>}

      {data && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded border border-ink/10 bg-white p-6">
              <p className="text-xs uppercase tracking-wide text-ink/50">Store</p>
              <p className="mt-2 font-display text-xl text-ink">{data.store.name}</p>
              <p className="mt-1 text-sm text-ink/60">{data.store.address}</p>
            </div>
            <div className="rounded border border-ink/10 bg-white p-6">
              <p className="text-xs uppercase tracking-wide text-ink/50">Average rating</p>
              <p className="mt-2 font-mono-data text-4xl text-teal-deep">{data.averageRating} / 5</p>
            </div>
          </div>

          <h2 className="mt-10 font-display text-xl text-ink">Users who rated this store</h2>
          <div className="mt-4 overflow-hidden rounded border border-ink/10">
            <table className="w-full border-collapse">
              <thead className="bg-teal-deep">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-parchment/80">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-parchment/80">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-parchment/80">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-parchment/80">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 bg-white">
                {data.raters.map((r) => (
                  <tr key={r.userId} className="hover:bg-parchment">
                    <td className="px-4 py-3 text-sm font-medium text-ink">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{r.email}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-sm text-ink/70">{r.address}</td>
                    <td className="px-4 py-3 font-mono-data text-sm text-teal-deep">{r.rating} / 5</td>
                  </tr>
                ))}
                {data.raters.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-ink/50">
                      No ratings have been submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
