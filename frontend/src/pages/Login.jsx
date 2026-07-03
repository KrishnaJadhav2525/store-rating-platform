import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import Banner from '../components/Banner';
import { inputClass } from '../utils/validation';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'STORE_OWNER') navigate('/store-owner/dashboard');
      else navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-parchment px-6">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-ink/60">Log in to submit ratings, manage stores, or view your dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <Banner type="error">{error}</Banner>}

          <FormField label="Email">
            <input
              type="email"
              required
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </FormField>

          <FormField label="Password">
            <input
              type="password"
              required
              className={inputClass}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </FormField>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-teal-deep px-4 py-2.5 font-medium text-parchment transition-colors hover:bg-teal-mid disabled:opacity-60"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/60">
          New here?{' '}
          <Link to="/signup" className="font-medium text-teal-deep underline">
            Create a normal user account
          </Link>
        </p>
      </div>
    </div>
  );
}
