// ============================================================
// client/src/components/Charts.jsx
// Dependency-free charts drawn as plain SVG:
//  - BarChart   : appointments per weekday
//  - DonutChart : patient statistics / status splits
// No chart library is needed for these demo visuals.
// ============================================================

/** Vertical bar chart. data = [{ label, value }] */
export function BarChart({ data, height = 190 }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barW = 100 / data.length;

  return (
    <svg viewBox={`0 0 100 ${height}`} style={{ width: '100%', height }} role="img" aria-label="Bar chart">
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 34);
        const x = i * barW + barW * 0.22;
        const y = height - 24 - h;
        return (
          <g key={d.label}>
            <rect
              x={x} y={y} width={barW * 0.56} height={Math.max(h, 3)}
              rx="3" fill="#16a34a" opacity="0.88"
            >
              <animate attributeName="height" from="0" to={Math.max(h, 3)} dur="0.5s" fill="freeze" />
              <animate attributeName="y" from={height - 24} to={y} dur="0.5s" fill="freeze" />
            </rect>
            <text x={x + barW * 0.28} y={height - 8} textAnchor="middle" fontSize="7.5" fill="#64748b">
              {d.label}
            </text>
            <text x={x + barW * 0.28} y={y - 4} textAnchor="middle" fontSize="7" fontWeight="700" fill="#047857">
              {d.value}
            </text>
          </g>
        );
      })}
      {/* baseline */}
      <line x1="2" y1={height - 24} x2="98" y2={height - 24} stroke="#e2e8f0" strokeWidth="1" />
    </svg>
  );
}

/**
 * Donut chart with a center label.
 * data = [{ label, value, color }]
 */
export function DonutChart({ data, size = 168, centerTop, centerBottom }) {
  const total = Math.max(1, data.reduce((s, d) => s + d.value, 0));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  // Build the arc segments sequentially around the circle.
  let offset = 0;
  const segments = data.map((d) => {
    const frac = d.value / total;
    const seg = {
      ...d,
      dash: frac * circumference,
      gap: circumference - frac * circumference,
      offset: -offset,
      pct: Math.round(frac * 100),
    };
    offset += frac * circumference;
    return seg;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox="0 0 140 140" role="img" aria-label="Donut chart">
        {/* Track */}
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="17" />
        <g transform="rotate(-90 70 70)">
          {segments.map((s) => (
            <circle
              key={s.label}
              cx="70" cy="70" r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth="17"
              strokeLinecap="butt"
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={s.offset}
            />
          ))}
        </g>
        <text x="70" y="67" textAnchor="middle" fontSize="21" fontWeight="800" fill="#0f172a">
          {centerTop}
        </text>
        <text x="70" y="84" textAnchor="middle" fontSize="9.5" fill="#64748b">
          {centerBottom}
        </text>
      </svg>
      {/* Legend */}
      <div style={{ display: 'grid', gap: 8 }}>
        {segments.map((s) => (
          <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.83rem' }}>
            <i style={{ width: 11, height: 11, borderRadius: 4, background: s.color, display: 'inline-block' }} />
            <b>{s.value}</b>&nbsp;{s.label}
            <span className="muted small">({s.pct}%)</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Simple horizontal progress meter used on bed/occupancy panels. */
export function Meter({ value, max, color = '#16a34a' }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ background: '#f1f5f9', borderRadius: 99, height: 8, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, background: color, borderRadius: 99, height: '100%', transition: 'width .5s ease' }} />
    </div>
  );
}
