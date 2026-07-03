import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import FormField from '../../components/FormField';
import Banner from '../../components/Banner';
import { validateName, validateAddress, validateEmail, inputClass } from '../../utils/validation';

export default function AdminStoreNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get('/admin/users', { params: { role: 'STORE_OWNER' } })
      .then(({ data }) => setOwners(data.users))
      .catch(() => setOwners([]));
  }, []);

  const validate = () => {
    const errs = {};
    const nameErr = validateName(form.name);
    const emailErr = validateEmail(form.email);
    const addressErr = validateAddress(form.address);
    if (nameErr) errs.name = nameErr;
    if (emailErr) errs.email = emailErr;
    if (addressErr) errs.address = addressErr;
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await api.post('/admin/stores', { ...form, ownerId: form.ownerId || undefined });
      navigate('/admin/stores');
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      setServerError(err.response?.data?.message || 'Failed to create store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="font-display text-2xl text-ink">Add a new store</h1>
      <p className="mt-1 text-sm text-ink/60">Register a store and, optionally, assign it to a store owner account.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        {serverError && <Banner type="error">{serverError}</Banner>}

        <FormField label="Store name" error={errors.name} hint="20–60 characters">
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </FormField>

        <FormField label="Store email" error={errors.email}>
          <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>

        <FormField label="Address" error={errors.address} hint="Up to 400 characters">
          <textarea rows={3} className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </FormField>

        <FormField label="Store owner" hint="Optional — must already exist with the Store Owner role">
          <select className={inputClass} value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })}>
            <option value="">No owner assigned</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
            ))}
          </select>
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-teal-deep px-4 py-2.5 font-medium text-parchment transition-colors hover:bg-teal-mid disabled:opacity-60"
        >
          {loading ? 'Creating…' : 'Create store'}
        </button>
      </form>
    </div>
  );
}
