import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import FormField from '../../components/FormField';
import Banner from '../../components/Banner';
import { validateName, validateAddress, validateEmail, validatePassword, inputClass } from '../../utils/validation';

export default function AdminUserNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'NORMAL_USER' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    const nameErr = validateName(form.name);
    const emailErr = validateEmail(form.email);
    const addressErr = validateAddress(form.address);
    const passwordErr = validatePassword(form.password);
    if (nameErr) errs.name = nameErr;
    if (emailErr) errs.email = emailErr;
    if (addressErr) errs.address = addressErr;
    if (passwordErr) errs.password = passwordErr;
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
      await api.post('/admin/users', form);
      navigate('/admin/users');
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      setServerError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="font-display text-2xl text-ink">Add a new user</h1>
      <p className="mt-1 text-sm text-ink/60">Create an administrator, normal user, or store owner account.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        {serverError && <Banner type="error">{serverError}</Banner>}

        <FormField label="Full name" error={errors.name} hint="20–60 characters">
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>

        <FormField label="Address" error={errors.address} hint="Up to 400 characters">
          <textarea rows={3} className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </FormField>

        <FormField
          label="Password"
          error={errors.password}
          hint="8–16 characters, at least one uppercase letter and one special character"
        >
          <input type="password" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </FormField>

        <FormField label="Role" error={errors.role}>
          <select className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="NORMAL_USER">Normal User</option>
            <option value="ADMIN">System Administrator</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-teal-deep px-4 py-2.5 font-medium text-parchment transition-colors hover:bg-teal-mid disabled:opacity-60"
        >
          {loading ? 'Creating…' : 'Create user'}
        </button>
      </form>
    </div>
  );
}
