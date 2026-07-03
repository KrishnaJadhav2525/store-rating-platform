import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Banner from '../../components/Banner';
import SortableHeader from '../../components/SortableHeader';
import { inputClass } from '../../utils/validation';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters, ...sort };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const { data } = await api.get('/admin/stores', { params });
      setStores(data.stores);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores.');
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSort = (field, order) => setSort({ sortBy: field, order });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Stores</h1>
          <p className="mt-1 text-sm text-ink/60">All stores registered on the platform.</p>
        </div>
        <Link
          to="/admin/stores/new"
          className="rounded bg-teal-deep px-4 py-2.5 text-sm font-medium text-parchment hover:bg-teal-mid"
        >
          Add store
        </Link>
      </div>

      {error && <div className="mt-6"><Banner type="error">{error}</Banner></div>}

      <form onSubmit={(e) => e.preventDefault()} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          placeholder="Filter by name"
          className={inputClass}
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Filter by email"
          className={inputClass}
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <input
          placeholder="Filter by address"
          className={inputClass}
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
      </form>

      <div className="mt-6 overflow-hidden rounded border border-ink/10">
        <table className="w-full border-collapse">
          <thead className="bg-teal-deep">
            <tr>
              <SortableHeader label="Name" field="name" {...sort} onSort={handleSort} />
              <SortableHeader label="Email" field="email" {...sort} onSort={handleSort} />
              <SortableHeader label="Address" field="address" {...sort} onSort={handleSort} />
              <SortableHeader label="Rating" field="rating" {...sort} onSort={handleSort} />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10 bg-white">
            {stores.map((s) => (
              <tr key={s.id} className="hover:bg-parchment">
                <td className="px-4 py-3 text-sm font-medium text-ink">{s.name}</td>
                <td className="px-4 py-3 text-sm text-ink/70">{s.email}</td>
                <td className="max-w-xs truncate px-4 py-3 text-sm text-ink/70">{s.address}</td>
                <td className="px-4 py-3 font-mono-data text-sm text-teal-deep">{s.rating} / 5</td>
              </tr>
            ))}
            {!loading && stores.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-ink/50">
                  No stores match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
