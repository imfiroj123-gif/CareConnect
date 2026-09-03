// ============================================================
// client/src/components/Logo.jsx
// CareConnect logo — rounded green tile with a white medical
// cross + pulse line. Original artwork, no copied assets.
// ============================================================

import Icon from './Icon';

export default function Logo({ size = 36, showText = true, light = false }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <rect x="2" y="2" width="44" height="44" rx="13" fill="#16a34a" />
        <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#ccg)" opacity="0.35" />
        <defs>
          <linearGradient id="ccg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M24 12v24M12 24h24" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
        <circle cx="24" cy="24" r="4.6" fill="#16a34a" stroke="#dcfce7" strokeWidth="2.4" />
      </svg>
      {showText && (
        <span style={{ fontWeight: 800, fontSize: size * 0.52, letterSpacing: '-0.02em', color: light ? '#fff' : 'var(--ink-900)' }}>
          Care<span style={{ color: '#16a34a' }}>Connect</span>
        </span>
      )}
      {showText === false && <Icon name="activity" size={0} />}
    </span>
  );
}
