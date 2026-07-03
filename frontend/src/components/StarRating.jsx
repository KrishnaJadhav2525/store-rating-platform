import React, { useState } from 'react';

export default function StarRating({ value, onSubmit, disabled }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value || 0;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onSubmit(n)}
          className={`text-lg transition-colors disabled:cursor-not-allowed ${
            n <= display ? 'text-brass' : 'text-ink/20'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
