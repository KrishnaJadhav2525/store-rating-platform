import React from 'react';

export default function FormField({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink/80">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ink/50">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-alert">{error}</span>}
    </label>
  );
}
