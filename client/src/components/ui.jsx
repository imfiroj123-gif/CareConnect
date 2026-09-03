// ============================================================
// client/src/components/ui.jsx
// Tiny reusable UI atoms shared by every module:
// StatCard, Avatar, Badge, EmptyState, PageHead.
// Keeping them in one file avoids dozens of one-line files.
// ============================================================

import Icon from './Icon';
import { initials, avatarColor, statusBadge } from '../utils/helpers';

/** Dashboard metric card. tone: green|red|amber|blue|violet */
export function StatCard({ icon, label, value, tone = 'green', danger = false }) {
  const tones = {
    green: ['var(--green-100)', 'var(--green-800)'],
    red: ['var(--red-50)', 'var(--red-600)'],
    amber: ['var(--amber-50)', 'var(--amber-600)'],
    blue: ['var(--blue-50)', 'var(--blue-600)'],
    violet: ['var(--violet-50)', 'var(--violet-600)'],
  };
  const [bg, fg] = tones[tone] || tones.green;
  return (
    <div className={`stat-card${danger ? ' sc-danger' : ''}`}>
      <span className="stat-ico" style={{ background: bg, color: fg }}>
        <Icon name={icon} size={22} />
      </span>
      <div>
        <div className="stat-num">{value}</div>
        <div className="stat-lbl">{label}</div>
      </div>
    </div>
  );
}

/** Colored initials avatar. */
export function Avatar({ name = '', size = 36 }) {
  return (
    <span
      className="lr-avatar"
      style={{ width: size, height: size, background: avatarColor(name), fontSize: size * 0.34 }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

/** Status pill with automatic color mapping. */
export function Badge({ status }) {
  return <span className={`badge ${statusBadge(status)}`}>{status || '—'}</span>;
}

/** Friendly empty list placeholder. */
export function EmptyState({ icon = 'clipboard', title = 'Nothing here yet', hint = '' }) {
  return (
    <div className="empty-state">
      <Icon name={icon} size={40} strokeWidth={1.4} className="big-icon" />
      <p style={{ fontWeight: 600 }}>{title}</p>
      {hint && <p className="small">{hint}</p>}
    </div>
  );
}

/** Standard page heading row used at the top of module pages. */
export function PageHead({ title, subtitle, children }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{children}</div>}
    </div>
  );
}
