// ============================================================
// client/src/pages/dashboard/PatientDashboard.jsx
// Patient home: welcome, upcoming appointment, doctor info,
// medical records timeline (visits/prescriptions/lab reports),
// bills and admission information. All filtered to the logged-in
// demo patient (P-1001).
// ============================================================

import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { StatCard, Avatar, Badge } from '../../components/ui';
import { getData, STORAGE_KEYS } from '../../services/storage';
import useAuthUser from '../../hooks/useAuthUser';
import { formatCurrency, formatDate, formatTime } from '../../utils/helpers';

export default function PatientDashboard() {
  const user = useAuthUser();
  const myId = user.patientId;

  const patients = getData(STORAGE_KEYS.patients);
  const appointments = getData(STORAGE_KEYS.appointments);
  const labTests = getData(STORAGE_KEYS.labTests);
  const bills = getData(STORAGE_KEYS.bills);
  const admissions = getData(STORAGE_KEYS.admissions);

  // My records (fallback: show all when patientId missing).
  const me = patients.find((p) => p.id === myId) || patients[0];
  const mineAppts = appointments.filter((a) => a.patientId === myId);
  const myLabs = labTests.filter((l) => l.patientId === myId);
  const myBills = bills.filter((b) => b.patientId === myId);
  const myAdmission = admissions.find((adm) => adm.patientId === myId);

  const upcoming = [...mineAppts]
    .filter((a) => a.status === 'Confirmed' || a.status === 'Pending')
    .sort((a, b) => (a.date > b.date ? 1 : -1))[0];
  const upcomingDoctor = upcoming
    ? getData(STORAGE_KEYS.doctors).find((d) => d.id === upcoming.doctorId)
    : null;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Hello, {me?.name.split(' ')[0]} 👋</h1>
          <p>Your health at a glance — appointments, reports and bills.</p>
        </div>
        <Link to="/patient/book-appointment" className="btn btn-primary btn-sm">
          <Icon name="calendar" size={15} /> Book Appointment
        </Link>
      </div>

      {/* ---------- Stats ---------- */}
      <div className="stat-grid">
        <StatCard icon="calendar" label="Upcoming Appointments" value={upcoming ? 1 : 0} tone="green" />
        <StatCard icon="flask" label="Lab Reports" value={myLabs.length} tone="violet" />
        <StatCard icon="money" label="Bills" value={myBills.length} tone="amber" />
        <StatCard icon="clipboard" label="Admission Status" value={myAdmission?.status || me?.admissionStatus} tone="blue" />
      </div>

      <div className="grid-31">
        {/* ---------- Left column ---------- */}
        <div style={{ display: 'grid', gap: 20 }}>
          {/* Upcoming appointment + doctor card */}
          {upcoming && (
            <section className="panel" style={{ background: 'linear-gradient(120deg, var(--green-50), #fff)' }}>
              <div className="panel-head"><h2>Next Appointment</h2><Badge status={upcoming.status} /></div>
              <div className="panel-body" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <Avatar name={upcoming.doctorName} size={52} />
                <div style={{ flex: 1, minWidth: 180 }}>
                  <b style={{ fontSize: '1.02rem' }}>{upcoming.doctorName}</b>
                  <div className="small muted">{upcomingDoctor?.specialization} · {upcoming.department}</div>
                  <div className="small" style={{ marginTop: 6 }}>
                    <Icon name="calendar" size={14} /> {formatDate(upcoming.date)} · {formatTime(upcoming.time)}
                  </div>
                </div>
                {upcomingDoctor && (
                  <div className="small muted">
                    Fee: <b>{formatCurrency(upcomingDoctor.consultationFee)}</b><br />
                    Phone: <b>{upcomingDoctor.phone}</b>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Medical records timeline */}
          <section className="panel">
            <div className="panel-head"><h2>Medical Records</h2></div>
            {/* Visits from completed appointments */}
            {mineAppts.filter((a) => a.status === 'Completed').map((visit) => (
              <div className="list-row" key={visit.id}>
                <span className="stat-ico" style={{ background: 'var(--green-100)', color: 'var(--green-800)', width: 36, height: 36 }}>
                  <Icon name="stethoscope" size={17} />
                </span>
                <div className="lr-main">
                  <div className="lr-title">Consultation — {visit.reason}</div>
                  <div className="lr-sub">{visit.doctorName} · {formatDate(visit.date)}</div>
                </div>
                <Badge status="Completed" />
              </div>
            ))}
            {/* Lab reports */}
            {myLabs.map((lab) => (
              <div className="list-row" key={lab.id}>
                <span className="stat-ico" style={{ background: 'var(--violet-50)', color: 'var(--violet-600)', width: 36, height: 36 }}>
                  <Icon name="flask" size={17} />
                </span>
                <div className="lr-main">
                  <div className="lr-title">{lab.testType}</div>
                  <div className="lr-sub">{formatDate(lab.date)}{lab.resultSummary ? ` · ${lab.resultSummary.slice(0, 60)}…` : ''}</div>
                </div>
                <Badge status={lab.status} />
              </div>
            ))}
            {mineAppts.filter((a) => a.status === 'Completed').length === 0 && myLabs.length === 0 && (
              <div className="empty-state"><p>No records yet.</p></div>
            )}
          </section>
        </div>

        {/* ---------- Right column ---------- */}
        <div style={{ display: 'grid', gap: 20 }}>
          {/* Bills */}
          <section className="panel">
            <div className="panel-head"><h2>My Bills</h2></div>
            {myBills.map((bill) => {
              const total = bill.items.reduce((s, it) => s + it.amount, 0) + bill.otherCharges - bill.discount;
              return (
                <div className="list-row" key={bill.id}>
                  <span className="stat-ico" style={{ background: 'var(--amber-50)', color: 'var(--amber-600)', width: 36, height: 36 }}>
                    <Icon name="money" size={17} />
                  </span>
                  <div className="lr-main">
                    <div className="lr-title">{bill.id}</div>
                    <div className="lr-sub">{formatCurrency(total)} · {formatDate(bill.date)}</div>
                  </div>
                  <Badge status={bill.paymentStatus} />
                </div>
              );
            })}
            {myBills.length === 0 && <div className="sp-empty">No bills</div>}
            <div style={{ padding: '12px 20px' }}>
              <Link to="/patient/bills" className="btn btn-outline btn-sm">View all bills</Link>
            </div>
          </section>

          {/* Admission info */}
          <section className="panel">
            <div className="panel-head"><h2>Admission Information</h2></div>
            {myAdmission ? (
              <div className="panel-body" style={{ display: 'grid', gap: 6, fontSize: '0.88rem' }}>
                <div className="summary-line"><span>Ward / Bed</span><b>{myAdmission.roomType} · {myAdmission.bedNumber}</b></div>
                <div className="summary-line"><span>Attending doctor</span><b>{myAdmission.doctorName}</b></div>
                <div className="summary-line"><span>Since</span><b>{formatDate(myAdmission.admissionDate)}</b></div>
                <div className="summary-line" style={{ borderBottom: 'none' }}><span>Reason</span><b style={{ textAlign: 'right', maxWidth: 160 }}>{myAdmission.reason}</b></div>
              </div>
            ) : (
              <div className="sp-empty">Not currently admitted</div>
            )}
          </section>

          {/* Quick links */}
          <section className="panel">
            <div className="panel-body" style={{ display: 'grid', gap: 10 }}>
              <Link to="/patient/doctors" className="btn btn-ghost btn-block"><Icon name="stethoscope" size={16} /> Find Doctors</Link>
              <Link to="/patient/records" className="btn btn-ghost btn-block"><Icon name="file" size={16} /> View Reports</Link>
              <Link to="/patient/bills" className="btn btn-ghost btn-block"><Icon name="money" size={16} /> View Bills</Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
