import React, { useState } from 'react';
import api from '../api/axios';
import FormField from '../components/FormField';
import Banner from '../components/Banner';
import { validatePassword, inputClass } from '../utils/validation';

export default function UpdatePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const err = validatePassword(form.newPassword);
    setFieldError(err || '');
    if (err) return;

    setLoading(true);
    try {
      await api.put('/auth/update-password', form);
      setSuccess('Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="font-display text-2xl text-ink">Update password</h1>
      <p className="mt-1 text-sm text-ink/60">Change the password used to log in to your account.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <Banner type="error">{error}</Banner>}
        {success && <Banner type="success">{success}</Banner>}

        <FormField label="Current password">
          <input
            type="password"
            required
            className={inputClass}
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          />
        </FormField>

        <FormField
          label="New password"
          error={fieldError}
          hint="8–16 characters, at least one uppercase letter and one special character"
        >
          <input
            type="password"
            required
            className={inputClass}
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-teal-deep px-4 py-2.5 font-medium text-parchment transition-colors hover:bg-teal-mid disabled:opacity-60"
        >
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
