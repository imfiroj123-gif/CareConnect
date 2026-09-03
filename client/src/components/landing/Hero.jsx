// ============================================================
// client/src/components/landing/Hero.jsx
// Big headline + dashboard-preview illustration with floating
// info cards. The preview is built from real DOM (no images) so
// it stays crisp at any resolution.
// ============================================================

import { Link } from 'react-router-dom';
import Icon from '../Icon';
import { Avatar } from '../ui';

const FLOATING = [
  { cls: 'fc-1', icon: 'siren', bg: 'var(--red-50)', fg: 'var(--red-600)', title: '24/7 Emergency Support', sub: 'Always on call' },
  { cls: 'fc-2', icon: 'stethoscope', bg: 'var(--green-100)', fg: 'var(--green-800)', title: '120+ Doctors', sub: 'Across 10 departments' },
  { cls: 'fc-3', icon: 'users', bg: 'var(--blue-50)', fg: 'var(--blue-600)', title: '5000+ Patients Served', sub: 'And counting' },
  { cls: 'fc-4', icon: 'calendar', bg: 'var(--violet-50)', fg: 'var(--violet-600)', title: 'Easy Appointment Booking', sub: 'In under a minute' },
];

// Fake weekly numbers for the mini bar chart in the preview.
const BARS = [42, 68, 55, 80, 62, 90, 74];
const RECENT = [
  { name: 'Ramesh Kumar', dept: 'Cardiology' },
  { name: 'Ananya Reddy', dept: 'ENT' },
];

export default function Hero() {
  return (
    <header className="hero">
      <div className="hero-inner">
        {/* ---------- Copy ---------- */}
        <div className="anim-fade-up">
          <span className="hero-eyebrow">
            <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--green-600)' }} />
            Trusted by 5,000+ patients
          </span>

          <h1>
            Healthcare That <span className="accent">Connects</span> You to Better Care
          </h1>

          <p className="hero-sub">
            Manage appointments, doctors, patients, admissions and hospital services
            from one simple platform.
          </p>

          <div className="hero-buttons">
            <Link to="/book-appointment" className="btn btn-primary">
              <Icon name="calendar" size={17} /> Book Appointment
            </Link>
            {/* Smooth-scroll to the services section */}
            <a href="#services" className="btn btn-outline">Explore Services</a>
          </div>

          <div className="hero-trust">
            <span><strong>4.9★</strong> patient rating</span>
            <span><strong>24/7</strong> emergency care</span>
            <span><strong>ISO</strong> certified facility</span>
          </div>
        </div>

        {/* ---------- Visual ---------- */}
        <div className="hero-visual anim-fade-in">
          {/* Dashboard preview card */}
          <div className="hero-preview">
            <div className="hp-top">
              <span className="hp-title">CareConnect Dashboard</span>
              <span className="hp-dots"><span /><span /><span /></span>
            </div>

            <div className="hp-stats">
              <div className="hp-stat"><div className="num">128</div><div className="lbl">Patients today</div></div>
              <div className="hp-stat"><div className="num">36</div><div className="lbl">Appointments</div></div>
              <div className="hp-stat"><div className="num">14</div><div className="lbl">Beds free</div></div>
            </div>

            <div className="hp-chart">
              <div className="small muted" style={{ marginBottom: 6 }}>Weekly appointments</div>
              <div className="hp-bars">
                {BARS.map((h, i) => (
                  // Height as % of the chart area
                  <span key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {RECENT.map((r) => (
              <div className="hp-row" key={r.name}>
                <Avatar name={r.name} size={30} />
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: '0.8rem' }}>{r.name}</b>
                  <div className="small muted">{r.dept}</div>
                </div>
                <span className="badge badge-green">Confirmed</span>
              </div>
            ))}
          </div>

          {/* Floating info cards */}
          {FLOATING.map((f) => (
            <div className={`float-card ${f.cls}`} key={f.cls}>
              <span className="fc-icon" style={{ background: f.bg, color: f.fg }}>
                <Icon name={f.icon} size={19} />
              </span>
              <span>
                <span className="fc-title">{f.title}</span>
                <br />
                <span className="fc-sub">{f.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
