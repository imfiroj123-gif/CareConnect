// ============================================================
// client/src/pages/dashboard/DoctorDashboard.jsx
// Doctor home: today's appointments, patient queue, pending
// consultations, latest lab reports and quick prescription CTA.
// Data is filtered to the logged-in doctor (demo: Dr. Ayesha
// Sharma / D-201) when possible.
// ============================================================

import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { StatCard, Avatar, Badge } from '../../components/ui';
import { getData, STORAGE_KEYS } from '../../services/storage';
import useAuthUser from '../../hooks/useAuthUser';
import { formatDate, formatTime, todayISO } from '../../utils/helpers';

export default function DoctorDashboard() {
  const user = useAuthUser();

  const appointments = getData(STORAGE_KEYS.appointments);
  const patients = getData(STORAGE_KEYS.patients);
  const labTests = getData(STORAGE_KEYS.labTests);
  const admissions = getData(STORAGE_KEYS.admissions);

  // Filter to the logged-in doctor's own records when the session
  // carries a doctorId; otherwise show everything (demo fallback).
  const mine = (list, field = 'doctorId') =>
    (user.doctorId ? list.filter((x) => x[field] === user.doctorId) : list);

  const myAppointments = mine(appointments);
  const today = todayISO();
  const todaysList = myAppointments.filter((a) => a.date === today);
  const upcomingList = todaysList.length ? todaysList : myAppointments.filter((a) => a.status !== 'Cancelled').slice(0, 5);
  const pendingConsults = myAppointments.filter((a) => a.status === 'Pending' || a.status === 'Confirmed');
  const myLabs = mine(labTests).slice(0, 4);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Welcome, {user.name} 🩺</h1>
          <p>Your clinical day at a glance — schedule, patients and reports.</p>
        </div>
        <Link to="/doctor/prescriptions" className="btn btn-primary btn-sm">
          <Icon name="pill" size={15} /> New Prescription
        </Link>
      </div>

      {/* ---------- Stats ---------- */}
      <div className="stat-grid">
        <StatCard icon="calendar" label="Today's Appointments" value={todaysList.length || upcomingList.length} tone="green" />
        <StatCard icon="users" label="My Patients" value={new Set(myAppointments.map((a) => a.patientId)).size} tone="blue" />
        <StatCard icon="clipboard" label="Pending Consultations" value={pendingConsults.length} tone="amber" />
        <StatCard icon="flask" label="Lab Reports" value={mine(labTests).length} tone="violet" />
      </div>

      <div className="grid-31">
        {/* ---------- Appointment queue ---------- */}
        <section className="panel">
          <div className="panel-head">
            <h2>Appointment Queue</h2>
            <Link to="/doctor/appointments" className="btn btn-ghost btn-sm">Full schedule</Link>
          </div>
          {upcomingList.map((appt) => (
            <div className="list-row" key={appt.id}>
              <Avatar name={appt.patientName} />
              <div className="lr-main">
                <div className="lr-title">{appt.patientName}</div>
                <div className="lr-sub">{formatDate(appt.date)} · {formatTime(appt.time)} · {appt.reason}</div>
              </div>
              <Badge status={appt.status} />
            </div>
          ))}
          {upcomingList.length === 0 && (
            <div className="empty-state"><Icon name="calendar" size={34} className="big-icon" /><p>No appointments scheduled.</p></div>
          )}
        </section>

        <div style={{ display: 'grid', gap: 20 }}>
          {/* ---------- Latest lab results ---------- */}
          <section className="panel">
            <div className="panel-head"><h2>Latest Lab Reports</h2></div>
            {myLabs.map((lab) => (
              <div className="list-row" key={lab.id}>
                <span className="stat-ico" style={{ background: 'var(--violet-50)', color: 'var(--violet-600)', width: 36, height: 36 }}>
                  <Icon name="flask" size={17} />
                </span>
                <div className="lr-main">
                  <div className="lr-title">{lab.patientName}</div>
                  <div className="lr-sub">{lab.testType} · {formatDate(lab.date)}</div>
                </div>
                <Badge status={lab.status} />
              </div>
            ))}
            {myLabs.length === 0 && <div className="sp-empty">No lab activity</div>}
          </section>

          {/* ---------- Admitted under my care ---------- */}
          <section className="panel">
            <div className="panel-head"><h2>My Admitted Patients</h2></div>
            {admissions
              .filter((adm) => !user.doctorId || adm.doctorName === user.name)
              .map((adm) => (
                <div className="list-row" key={adm.id}>
                  <Avatar name={adm.patientName} size={32} />
                  <div className="lr-main">
                    <div className="lr-title">{adm.patientName}</div>
                    <div className="lr-sub">Bed {adm.bedNumber} · since {formatDate(adm.admissionDate)}</div>
                  </div>
                </div>
              ))}
            <div style={{ padding: '12px 20px' }}>
              <Link to="/doctor/patients" className="btn btn-outline btn-sm">View all patients</Link>
            </div>
          </section>
        </div>
      </div>

      {/* Patients referenced in my appointments for a quick roster */}
      <section className="panel" style={{ marginTop: 20 }}>
        <div className="panel-head"><h2>Patient Roster</h2><span className="small muted">From your appointment history</span></div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '14px 20px' }}>
          {[...new Set(mine(appointments).map((a) => a.patientName))].map((name) => {
            const p = patients.find((x) => x.name === name);
            return (
              <span key={name} className="badge badge-gray" style={{ fontSize: '0.8rem' }}>
                <Avatar name={name} size={22} /> {name}{p ? ` · ${p.bloodGroup}` : ''}
              </span>
            );
          })}
        </div>
      </section>
    </>
  );
}
