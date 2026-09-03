// ============================================================
// client/src/components/Topbar.jsx
// Dashboard header: hamburger (mobile), global search with live
// dropdown results, notifications popover, logout.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { Avatar } from './ui';
import {
  getData, updateData, STORAGE_KEYS,
} from '../services/storage';

/** Search across patients, doctors, appointments and medicines. */
function buildResults(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results = [];

  getData(STORAGE_KEYS.patients).forEach((p) => {
    if (`${p.name} ${p.id} ${p.phone}`.toLowerCase().includes(q)) {
      results.push({ kind: 'Patient', label: p.name, sub: `${p.id} · ${p.department || '—'}`, to: '/admin/patients' });
    }
  });
  getData(STORAGE_KEYS.doctors).forEach((d) => {
    if (`${d.name} ${d.specialization} ${d.department}`.toLowerCase().includes(q)) {
      results.push({ kind: 'Doctor', label: d.name, sub: `${d.specialization} · ${d.department}`, to: '/admin/doctors' });
    }
  });
  getData(STORAGE_KEYS.appointments).forEach((a) => {
    if (`${a.patientName} ${a.doctorName} ${a.date}`.toLowerCase().includes(q)) {
      results.push({ kind: 'Appt', label: `${a.patientName} → ${a.doctorName}`, sub: `${a.date} ${a.time} · ${a.status}`, to: '/admin/appointments' });
    }
  });
  getData(STORAGE_KEYS.medicines).forEach((m) => {
    if (`${m.name} ${m.category}`.toLowerCase().includes(q)) {
      results.push({ kind: 'Medicine', label: m.name, sub: `${m.id} · Qty ${m.quantity}`, to: '/admin/pharmacy' });
    }
  });

  // Departments are static-ish; match by name too.
  getData(STORAGE_KEYS.departments).forEach((dep) => {
    if (dep.name.toLowerCase().includes(q)) {
      results.push({ kind: 'Dept', label: dep.name, sub: dep.description.slice(0, 44), to: '/admin/departments' });
    }
  });

  return results.slice(0, 8);
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Topbar({ user, onMenu, onLogout }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const results = buildResults(query);

  const notifs = getData(STORAGE_KEYS.notifications);
  const unread = notifs.filter((n) => !n.read).length;

  // Close popovers when clicking outside of them.
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => {
    notifs.forEach((n) => updateData(STORAGE_KEYS.notifications, n.id, { read: true }));
    setShowNotif(false);
  };

  const markReadAndClose = (n) => {
    updateData(STORAGE_KEYS.notifications, n.id, { read: true });
    setShowNotif(false);
  };

  return (
    <header className="topbar">
      <button type="button" className="icon-btn tb-hamburger" onClick={onMenu} aria-label="Open menu">
        <Icon name="menu" size={21} />
      </button>

      {/* ---------- Global search ---------- */}
      <div className="tb-search" ref={searchRef}>
        <Icon name="search" size={16} />
        <input
          type="search"
          placeholder="Search patients, doctors, appointments…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSearch(true); }}
          onFocus={() => setShowSearch(true)}
        />
        {showSearch && query.trim() && (
          <div className="search-pop">
            {results.length === 0 && <div className="sp-empty">No matches for “{query}”</div>}
            {results.map((r, i) => (
              <button
                key={`${r.kind}-${i}`}
                type="button"
                className="sp-item"
                onClick={() => { navigate(r.to); setShowSearch(false); setQuery(''); }}
              >
                <span className="sp-kind">{r.kind}</span>
                <span style={{ minWidth: 0 }}>
                  <b style={{ display: 'block', fontSize: '0.86rem' }}>{r.label}</b>
                  <span className="small muted">{r.sub}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="tb-right">
        {/* ---------- Notifications bell ---------- */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            className="tb-icon-btn"
            onClick={() => setShowNotif((s) => !s)}
            aria-label="Notifications"
          >
            <Icon name="bell" size={18} />
            {unread > 0 && <span className="tb-count">{unread}</span>}
          </button>

          {showNotif && (
            <div className="notif-pop">
              <div className="notif-head">
                Notifications
                {unread > 0 && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifs.length === 0 && <div className="sp-empty">No notifications</div>}
                {notifs.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className={`notif-item${n.read ? '' : ' unread'}`}
                    onClick={() => markReadAndClose(n)}
                  >
                    <i className={`notif-dot${n.read ? ' read' : ''}`} />
                    <span style={{ flex: 1 }}>
                      <b className="notif-title">{n.title}</b>
                      <span className="notif-body">{n.body}</span>
                    </span>
                    <span className="notif-time">{timeAgo(n.time)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Avatar name={user?.name} size={38} />

        <button type="button" className="btn btn-outline btn-sm" onClick={onLogout}>
          <Icon name="logout" size={15} /> Logout
        </button>
      </div>
    </header>
  );
}
