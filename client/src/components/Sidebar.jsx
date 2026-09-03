// ============================================================
// client/src/components/Sidebar.jsx
// Role-based dashboard navigation. Menu items differ per role.
// On mobile the sidebar is a slide-in drawer (open prop).
// ============================================================

import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import Logo from './Logo';
import { initials, avatarColor } from '../utils/helpers';

/**
 * Navigation model per role. badgeKey pulls a live count from the
 * badges object the shell passes down (e.g. pending appointments).
 */
const MENUS = {
  admin: [
    { to: '/admin', icon: 'dashboard', label: 'Dashboard', end: true },
    {
      group: 'Manage',
      items: [
        { to: '/admin/patients', icon: 'users', label: 'Patients' },
        { to: '/admin/doctors', icon: 'stethoscope', label: 'Doctors' },
        { to: '/admin/appointments', icon: 'calendar', label: 'Appointments', badgeKey: 'pendingAppointments' },
        { to: '/admin/admissions', icon: 'clipboard', label: 'Admissions' },
        { to: '/admin/beds', icon: 'bed', label: 'Beds' },
        { to: '/admin/departments', icon: 'building', label: 'Departments' },
      ],
    },
    {
      group: 'Facilities',
      items: [
        { to: '/admin/pharmacy', icon: 'pill', label: 'Pharmacy' },
        { to: '/admin/laboratory', icon: 'flask', label: 'Laboratory' },
        { to: '/admin/emergency', icon: 'siren', label: 'Emergency' },
      ],
    },
    {
      group: 'Other',
      items: [
        { to: '/admin/billing', icon: 'money', label: 'Billing' },
        { to: '/admin/reports', icon: 'chart', label: 'Reports' },
        { to: '/admin/messages', icon: 'message', label: 'Messages' },
        { to: '/admin/settings', icon: 'settings', label: 'Settings' },
      ],
    },
  ],
  receptionist: [
    { to: '/receptionist', icon: 'dashboard', label: 'Dashboard', end: true },
    { group: 'Front Desk', items: [
      { to: '/receptionist/appointments', icon: 'calendar', label: 'Appointments', badgeKey: 'pendingAppointments' },
      { to: '/receptionist/admissions', icon: 'clipboard', label: 'Admissions' },
      { to: '/receptionist/beds', icon: 'bed', label: 'Assign Beds' },
      { to: '/receptionist/billing', icon: 'money', label: 'Billing' },
    ] },
    { group: 'Directory', items: [
      { to: '/receptionist/doctors', icon: 'stethoscope', label: 'View Doctors' },
      { to: '/receptionist/messages', icon: 'message', label: 'Messages' },
    ] },
  ],
  doctor: [
    { to: '/doctor', icon: 'dashboard', label: 'Dashboard', end: true },
    { group: 'Clinical', items: [
      { to: '/doctor/patients', icon: 'users', label: 'My Patients' },
      { to: '/doctor/appointments', icon: 'calendar', label: "Today's Appointments", badgeKey: 'pendingAppointments' },
      { to: '/doctor/laboratory', icon: 'flask', label: 'Lab Reports' },
      { to: '/doctor/prescriptions', icon: 'pill', label: 'Prescriptions' },
    ] },
    { group: 'Other', items: [
      { to: '/doctor/messages', icon: 'message', label: 'Messages' },
    ] },
  ],
  patient: [
    { to: '/patient', icon: 'dashboard', label: 'Dashboard', end: true },
    { group: 'My Health', items: [
      { to: '/patient/book-appointment', icon: 'calendar', label: 'Book Appointment' },
      { to: '/patient/doctors', icon: 'stethoscope', label: 'Find Doctors' },
      { to: '/patient/records', icon: 'file', label: 'Medical Records' },
      { to: '/patient/bills', icon: 'money', label: 'My Bills' },
    ] },
  ],
};

export default function Sidebar({ role, user, open, onClose, badges = {} }) {
  const menu = MENUS[role] || [];

  const renderLink = (item) => {
    const badgeValue = item.badgeKey ? badges[item.badgeKey] : null;
    return (
      // NavLink adds .active automatically for the current route.
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}
        onClick={onClose}
      >
        <Icon name={item.icon} size={19} />
        <span>{item.label}</span>
        {badgeValue ? <span className="sb-badge">{badgeValue}</span> : null}
      </NavLink>
    );
  };

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sb-brand">
        <Logo size={30} showText={false} />
        <span className="name">CareConnect</span>
        <span className="role-tag">{role}</span>
      </div>

      <nav className="sb-nav">
        {menu.map((entry) => (
          entry.group ? (
            <div key={entry.group}>
              <div className="sb-group-label">{entry.group}</div>
              {entry.items.map(renderLink)}
            </div>
          ) : (
            renderLink(entry)
          )
        ))}
      </nav>

      {/* Logged-in identity block */}
      <div className="sb-user">
        <span className="sb-avatar" style={{ background: avatarColor(user?.name) }}>
          {initials(user?.name || '?')}
        </span>
        <div style={{ minWidth: 0 }}>
          <div className="u-name">{user?.name}</div>
          <div className="u-mail">{user?.email}</div>
        </div>
      </div>
    </aside>
  );
}
