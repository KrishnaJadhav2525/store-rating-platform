import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import Banner from '../components/Banner';
import StarRating from '../components/StarRating';
import { inputClass } from '../utils/validation';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const { data } = await api.get('/user/stores', { params });
      setStores(data.stores);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRate = async (storeId, rating) => {
    setNotice('');
    setError('');
    try {
      await api.post(`/user/stores/${storeId}/rating`, { rating });
      setNotice('Rating saved.');
      fetchStores();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating.');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-3xl text-ink">Stores</h1>
      <p className="mt-1 text-sm text-ink/60">Search registered stores and submit or update your rating.</p>

      {error && <div className="mt-6"><Banner type="error">{error}</Banner></div>}
      {notice && <div className="mt-6"><Banner type="success">{notice}</Banner></div>}

      <form onSubmit={(e) => e.preventDefault()} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          placeholder="Search by store name"
          className={inputClass}
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Search by address"
          className={inputClass}
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
      </form>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((s) => (
          <div key={s.id} className="rounded border border-ink/10 bg-white p-5">
            <h2 className="font-display text-lg text-ink">{s.name}</h2>
            <p className="mt-1 text-sm text-ink/60">{s.address}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-ink/50">Overall rating</span>
              <span className="font-mono-data text-teal-deep">{s.overallRating} / 5</span>
            </div>
            <div className="mt-4 border-t border-ink/10 pt-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-ink/50">
                {s.myRating ? 'Your rating' : 'Submit a rating'}
              </p>
              <StarRating value={s.myRating} onSubmit={(n) => handleRate(s.id, n)} />
            </div>
          </div>
        ))}
        {!loading && stores.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-ink/50">No stores match your search.</p>
        )}
      </div>
    </div>
  );
}
