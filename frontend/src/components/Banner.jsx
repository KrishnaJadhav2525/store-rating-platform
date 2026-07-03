import React from 'react';

export default function Banner({ type = 'info', children }) {
  if (!children) return null;

  const styles = {
    error: 'bg-alert/10 text-alert border-alert/30',
    success: 'bg-teal-mid/10 text-teal-deep border-teal-mid/30',
    info: 'bg-brass/10 text-brass border-brass/30',
  };

  return (
    <div className={`rounded border px-4 py-3 text-sm ${styles[type]}`} role="status">
      {children}
    </div>
  );
}
