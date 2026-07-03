import React from 'react';

export default function SortableHeader({ label, field, sortBy, order, onSort }) {
  const active = sortBy === field;
  const nextOrder = active && order === 'asc' ? 'desc' : 'asc';

  return (
    <th
      scope="col"
      className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-parchment/80 hover:text-brass"
      onClick={() => onSort(field, nextOrder)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="font-mono-data text-[10px]">
          {active ? (order === 'asc' ? '▲' : '▼') : ''}
        </span>
      </span>
    </th>
  );
}
