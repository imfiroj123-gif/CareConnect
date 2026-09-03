// ============================================================
// client/src/components/Table.jsx
// Reusable table wrapper. Columns are declared as data so every
// module page gets identical styling + horizontal scrolling on
// small screens for free.
//
// Usage:
//   <DataTable
//     columns={[{ key:'name', label:'Name' }, { key:'x', render: row => ... }]}
//     rows={items}
//     empty="No records found"
//   />
// ============================================================

import { EmptyState } from './ui';

export default function DataTable({ columns, rows, emptyTitle = 'No records found', emptyHint = '' }) {
  if (!rows.length) {
    return <EmptyState icon="clipboard" title={emptyTitle} hint={emptyHint} />;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id} className="stagger-item" style={{ animationDelay: `${idx * 40}ms` }}>
              {columns.map((col) => (
                <td key={col.key}>
                  {/* Custom cell renderer when provided, otherwise raw value */}
                  {col.render ? col.render(row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
