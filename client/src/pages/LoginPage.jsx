// ============================================================
// client/src/pages/LoginPage.jsx
// Role-based demo login. Pick a role tab (or just type the demo
// credentials), validation runs, session is saved to localStorage
// and the user is redirected to their role dashboard.
//
// ⚠️ Demo authentication only — NOT production-ready security.
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Logo from '../components/Logo';
import { useToast } from '../components/Toast';
import {
  DEMO_ACCOUNTS, ROLE_HOME, authenticate, saveSession,
} from '../services/auth';
import { required, passwordError, validateForm } from '../utils/validation';

const ROLE_ICONS = { admin: 'shield', doctor: 'stethoscope', receptionist: 'clipboard', patient: 'user' };

export default function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [role, setRole] = useState('admin');
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  /** Fill the form with the selected role's demo credentials. */
  function fillDemo() {
    const account = DEMO_ACCOUNTS.find((a) => a.role === role);
    if (account) {
      setForm({ email: account.email, password: account.password });
      setErrors({});
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const result = validateForm(form, {
      email: (v) => required(v, 'Email'),
      password: passwordError,
    });
    setErrors(result.errors);
    if (!result.isValid) return;

    const account = authenticate(form.email, form.password, role);

    if (!account) {
      // Wrong credentials — flash a subtle shake and explain.
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showToast('Invalid credentials for this role. Use "Fill demo" to autofill.', 'error');
      return;
    }

    saveSession(account);
    showToast(`Welcome back, ${account.name}!`, 'success');
    navigate(ROLE_HOME[account.role], { replace: true });
  }

  return (
    <div className="auth-page">
      <div className="auth-card anim-fade-up" style={shake ? { animation: 'none', transform: 'translateX(6px)' } : undefined}>
        {/* ---------- Left brand panel ---------- */}
        <aside className="auth-side">
          <div>
            <Logo light />
            <h2>Your hospital,<br />one calm dashboard.</h2>
            <p>Appointments, admissions, beds, pharmacy and billing — connected in one place.</p>
          </div>
          <div className="auth-points">
            <span className="auth-point"><Icon name="check" size={16} /> Instant demo accounts</span>
            <span className="auth-point"><Icon name="check" size={16} /> Role-based dashboards</span>
            <span className="auth-point"><Icon name="check" size={16} /> No database — localStorage demo</span>
          </div>
        </aside>

        {/* ---------- Login form ---------- */}
        <div className="auth-form-wrap">
          <div className="flex-between" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.3rem' }}>Sign in</h2>
            <Link to="/" className="small" style={{ color: 'var(--green-700)', fontWeight: 600 }}>← Back to site</Link>
          </div>

          {/* Role selector tabs */}
          <div className="role-tabs">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.role}
                type="button"
                className={`role-tab${role === a.role ? ' active' : ''}`}
                onClick={() => { setRole(a.role); setErrors({}); }}
              >
                <Icon name={ROLE_ICONS[a.role]} size={17} />
                {a.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder={`${role}@careconnect.com`}
                value={form.email}
                onChange={setField('email')}
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            <div className="field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={setField('password')}
              />
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Sign in as {role}
            </button>
          </form>

          <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={fillDemo}>
            Fill demo credentials
          </button>

          {/* Honest note about the demo nature of auth */}
          <div className="demo-hint">
            <b>Demo accounts:</b> {role} ·{' '}
            <code>{DEMO_ACCOUNTS.find((a) => a.role === role)?.email}</code> /{' '}
            <code>{DEMO_ACCOUNTS.find((a) => a.role === role)?.password}</code>
            <br />
            ⚠️ This is demonstration-only authentication — not production-ready. Data stays in your browser.
          </div>
        </div>
      </div>
    </div>
  );
}
