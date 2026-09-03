// ============================================================
// client/src/pages/dashboard/ReceptionistDashboard.jsx
// Front-desk home: quick actions (register patient, book
// appointment, assign bed, create bill), today's schedule and
// pending approvals.
// ============================================================

import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { StatCard, Avatar } from '../../components/ui';
import { getData, STORAGE_KEYS } from '../../services/storage';
import useAuthUser from '../../hooks/useAuthUser';
import { formatDate, formatTime } from '../../utils/helpers';

export default function ReceptionistDashboard() {
  const user = useAuthUser();

  const appointments = getData(STORAGE_KEYS.appointments);
  const admissions = getData(STORAGE_KEYS.admissions);
  const beds = getData(STORAGE_KEYS.beds);
  const patients = getData(STORAGE_KEYS.patients);

  const availableBeds = beds.filter((b) => b.status === 'Available').length;
  const pendingAppts = appointments.filter((a) => a.status === 'Pending');

  // Quick actions — every button routes somewhere real.
  const QUICK_ACTIONS = [
    { to: '/receptionist/appointments', icon: 'calendar', label: 'Book Appointment', bg: 'var(--green-100)', fg: 'var(--green-800)' },
    { to: '/receptionist/doctors', icon: 'stethoscope', label: 'View Doctors', bg: 'var(--blue-50)', fg: 'var(--blue-600)' },
    { to: '/receptionist/beds', icon: 'bed', label: 'Assign Bed', bg: 'var(--violet-50)', fg: 'var(--violet-600)' },
    { to: '/receptionist/billing', icon: 'money', label: 'Create Bill', bg: 'var(--amber-50)', fg: 'var(--amber-600)' },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Good day, {user.name.split(' ')[0]} 👋</h1>
          <p>Front desk overview — registrations, bookings and bed requests.</p>
        </div>
      </div>

      {/* ---------- Stats ---------- */}
      <div className="stat-grid">
        <StatCard icon="users" label="Registered Patients" value={patients.length} tone="green" />
        <StatCard icon="calendar" label="Pending Approvals" value={pendingAppts.length} tone="amber" />
        <StatCard icon="clipboard" label="Current Admissions" value={admissions.filter((a) => a.status === 'Admitted').length} tone="violet" />
        <StatCard icon="bed" label="Beds Available" value={availableBeds} tone="blue" />
      </div>

      {/* ---------- Quick actions ---------- */}
      <div className="stat-grid">
        {QUICK_ACTIONS.map((qa) => (
          <Link key={qa.label} to={qa.to} className="stat-card" style={{ textDecoration: 'none' }}>
            <span className="stat-ico" style={{ background: qa.bg, color: qa.fg }}>
              <Icon name={qa.icon} size={22} />
            </span>
            <div>
              <div style={{ fontWeight: 700 }}>{qa.label}</div>
              <div className="stat-lbl">Open module →</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ---------- Schedule + approvals ---------- */}
      <div className="grid-31">
        <section className="panel">
          <div className="panel-head"><h2>Upcoming Appointments</h2></div>
          {[...appointments]
            .filter((a) => a.status !== 'Cancelled')
            .slice(0, 6)
            .map((appt) => (
              <div className="list-row" key={appt.id}>
                <Avatar name={appt.patientName} />
                <div className="lr-main">
                  <div className="lr-title">{appt.patientName}</div>
                  <div className="lr-sub">{appt.doctorName} · {formatDate(appt.date)} at {formatTime(appt.time)}</div>
                </div>
                <span className={`badge ${appt.status === 'Confirmed' ? 'badge-green' : appt.status === 'Pending' ? 'badge-amber' : 'badge-blue'}`}>
                  {appt.status}
                </span>
              </div>
            ))}
          <div style={{ padding: '12px 20px' }}>
            <Link to="/receptionist/appointments" className="btn btn-outline btn-sm">Manage all appointments</Link>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head"><h2>Needs Action</h2></div>
          {pendingAppts.length === 0 && <div className="empty-state"><p>All caught up 🎉</p></div>}
          {pendingAppts.slice(0, 4).map((appt) => (
            <div className="list-row" key={appt.id}>
              <Avatar name={appt.patientName} size={32} />
              <div className="lr-main">
                <div className="lr-title">{appt.patientName}</div>
                <div className="lr-sub">{appt.department} · {formatDate(appt.date)}</div>
              </div>
            </div>
          ))}
          <div style={{ padding: '12px 20px' }}>
            <Link to="/receptionist/admissions" className="btn btn-ghost btn-sm">Admission desk</Link>
          </div>
        </section>
      </div>
    </>
  );
}
