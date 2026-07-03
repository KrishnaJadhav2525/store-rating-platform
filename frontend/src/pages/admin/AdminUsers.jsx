import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Banner from '../../components/Banner';
import SortableHeader from '../../components/SortableHeader';
import { inputClass } from '../../utils/validation';

const ROLE_LABEL = {
  ADMIN: 'System Administrator',
  NORMAL_USER: 'Normal User',
  STORE_OWNER: 'Store Owner',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters, ...sort };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field, order) => setSort({ sortBy: field, order });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Users</h1>
          <p className="mt-1 text-sm text-ink/60">All administrators and normal users on the platform.</p>
        </div>
        <Link
          to="/admin/users/new"
          className="rounded bg-teal-deep px-4 py-2.5 text-sm font-medium text-parchment hover:bg-teal-mid"
        >
          Add user
        </Link>
      </div>

      {error && <div className="mt-6"><Banner type="error">{error}</Banner></div>}

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4"
      >
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
        <select
          className={inputClass}
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All roles</option>
          <option value="ADMIN">System Administrator</option>
          <option value="NORMAL_USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </form>

      <div className="mt-6 overflow-hidden rounded border border-ink/10">
        <table className="w-full border-collapse">
          <thead className="bg-teal-deep">
            <tr>
              <SortableHeader label="Name" field="name" {...sort} onSort={handleSort} />
              <SortableHeader label="Email" field="email" {...sort} onSort={handleSort} />
              <SortableHeader label="Address" field="address" {...sort} onSort={handleSort} />
              <SortableHeader label="Role" field="role" {...sort} onSort={handleSort} />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10 bg-white">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-parchment">
                <td className="px-4 py-3 text-sm">
                  <Link to={`/admin/users/${u.id}`} className="text-teal-deep underline">
                    {u.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-ink/70">{u.email}</td>
                <td className="max-w-xs truncate px-4 py-3 text-sm text-ink/70">{u.address}</td>
                <td className="px-4 py-3 text-sm text-ink/70">{ROLE_LABEL[u.role]}</td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-ink/50">
                  No users match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
