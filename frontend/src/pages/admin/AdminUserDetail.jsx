import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import Banner from '../../components/Banner';

const ROLE_LABEL = {
  ADMIN: 'System Administrator',
  NORMAL_USER: 'Normal User',
  STORE_OWNER: 'Store Owner',
};

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/admin/users/${id}`)
      .then(({ data }) => setUser(data.user))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load user.'));
  }, [id]);

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <Link to="/admin/users" className="text-sm text-teal-deep underline">
        ← Back to users
      </Link>

      <h1 className="mt-4 font-display text-2xl text-ink">User details</h1>

      {error && <div className="mt-6"><Banner type="error">{error}</Banner></div>}

      {user && (
        <dl className="mt-6 divide-y divide-ink/10 rounded border border-ink/10 bg-white">
          <Row label="Name" value={user.name} />
          <Row label="Email" value={user.email} />
          <Row label="Address" value={user.address} />
          <Row label="Role" value={ROLE_LABEL[user.role]} />
          {user.role === 'STORE_OWNER' && (
            <Row label="Store rating" value={user.rating !== null ? `${user.rating} / 5` : 'No store assigned'} />
          )}
        </dl>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between px-4 py-3">
      <dt className="text-sm text-ink/50">{label}</dt>
      <dd className="text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
