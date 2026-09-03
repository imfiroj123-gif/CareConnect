// ============================================================
// client/src/pages/dashboard/AdminDashboard.jsx
// Admin home: stat cards, weekly appointment chart, patient
// statistics donut, recent appointments/admissions, bed
// availability meters and emergency alerts.
// ============================================================

import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { StatCard, Avatar } from '../../components/ui';
import { BarChart, DonutChart, Meter } from '../../components/Charts';
import {
  getData, STORAGE_KEYS,
} from '../../services/storage';
import useAuthUser from '../../hooks/useAuthUser';
import { formatCurrency, formatDate, formatTime, todayISO } from '../../utils/helpers';

export default function AdminDashboard() {
  const user = useAuthUser();

  const patients = getData(STORAGE_KEYS.patients);
  const doctors = getData(STORAGE_KEYS.doctors);
  const appointments = getData(STORAGE_KEYS.appointments);
  const beds = getData(STORAGE_KEYS.beds);
  const admissions = getData(STORAGE_KEYS.admissions);
  const bills = getData(STORAGE_KEYS.bills);
  const emergencyCases = getData(STORAGE_KEYS.emergencyCases);

  // ---------- Derived metrics ----------
  const today = todayISO();
  const todaysAppointments = appointments.filter((a) => a.date === today).length;
  // Fallback: when seed dates don't match "today", show next upcoming.
  const upcomingCount = todaysAppointments ||
    appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Pending').length;

  const availableBeds = beds.filter((b) => b.status === 'Available').length;
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const pendingBills = bills.filter((b) => b.paymentStatus !== 'Paid');
  const pendingBillValue = pendingBills.reduce(
    (sum, b) => sum + b.items.reduce((s, it) => s + it.amount, 0),
    0
  );

  // Weekly chart — group confirmed/pending appointments by weekday label.
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekData = DAYS.map((label, i) => ({
    label,
    value: appointments.filter((a) => new Date(a.date).getDay() === (i + 1) % 7).length,
  }));

  // Patient admission-status split for the donut.
  const admitted = patients.filter((p) => p.admissionStatus === 'Admitted').length;
  const outpatient = patients.filter((p) => p.admissionStatus === 'Outpatient').length;
  const discharged = patients.filter((p) => p.admissionStatus === 'Discharged').length;

  const recentAppts = [...appointments]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  return (
    <>
      {/* ---------- Greeting ---------- */}
      <div className="page-head">
        <div>
          <h1>Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p>Here is what is happening at CareConnect today.</p>
        </div>
        <Link to="/admin/appointments" className="btn btn-primary btn-sm">
          <Icon name="calendar" size={15} /> Manage Appointments
        </Link>
      </div>

      {/* ---------- Stat cards ---------- */}
      <div className="stat-grid">
        <StatCard icon="users" label="Total Patients" value={patients.length} tone="green" />
        <StatCard icon="stethoscope" label="Total Doctors" value={doctors.length} tone="blue" />
        <StatCard icon="calendar" label="Today's Appointments" value={upcomingCount} tone="violet" />
        <StatCard icon="bed" label="Available Beds" value={availableBeds} tone="green" />
        <StatCard icon="bed" label="Occupied Beds" value={occupiedBeds} tone="amber" />
        <StatCard icon="siren" label="Emergency Cases" value={emergencyCases.filter((e) => e.status === 'Active').length} tone="red" danger />
        <StatCard icon="money" label={`Pending Bills (${pendingBills.length})`} value={formatCurrency(pendingBillValue)} tone="red" danger />
      </div>

      {/* ---------- Charts row ---------- */}
      <div className="grid-2">
        <section className="panel">
          <div className="panel-head"><h2>Appointment Chart</h2><span className="badge badge-green">This week</span></div>
          <div className="panel-body">
            <BarChart data={weekData} />
          </div>
        </section>

        <section className="panel">
          <div className="panel-head"><h2>Patient Statistics</h2></div>
          <div className="panel-body">
            <DonutChart
              centerTop={patients.length}
              centerBottom="patients"
              data={[
                { label: 'Admitted', value: admitted, color: '#16a34a' },
                { label: 'Outpatient', value: outpatient, color: '#f59e0b' },
                { label: 'Discharged', value: discharged, color: '#2563eb' },
              ]}
            />
          </div>
        </section>
      </div>

      {/* ---------- Lists row ---------- */}
      <div className="grid-31" style={{ marginTop: 20 }}>
        <section className="panel">
          <div className="panel-head">
            <h2>Recent Appointments</h2>
            <Link to="/admin/appointments" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          {recentAppts.map((appt) => (
            <div className="list-row" key={appt.id}>
              <Avatar name={appt.patientName} />
              <div className="lr-main">
                <div className="lr-title">{appt.patientName} → {appt.doctorName}</div>
                <div className="lr-sub">{formatDate(appt.date)} · {formatTime(appt.time)} · {appt.department}</div>
              </div>
              <span className={`badge ${appt.status === 'Confirmed' ? 'badge-green' : appt.status === 'Pending' ? 'badge-amber' : appt.status === 'Completed' ? 'badge-blue' : 'badge-red'}`}>
                {appt.status}
              </span>
            </div>
          ))}
        </section>

        <div style={{ display: 'grid', gap: 20 }}>
          {/* Bed availability */}
          <section className="panel">
            <div className="panel-head"><h2>Bed Availability</h2></div>
            <div className="panel-body" style={{ display: 'grid', gap: 14 }}>
              <Meter value={availableBeds} max={beds.length} />
              <div className="small muted">{availableBeds} of {beds.length} beds available ({occupiedBeds} occupied)</div>
              <Link to="/admin/beds" className="btn btn-outline btn-sm" style={{ justifySelf: 'start' }}>Open bed board</Link>
            </div>
          </section>

          {/* Emergency alerts */}
          <section className="panel" style={{ borderColor: 'rgba(220,38,38,.3)' }}>
            <div className="panel-head"><h2>🚨 Emergency Alerts</h2><Link to="/admin/emergency" className="btn btn-danger btn-sm">Respond</Link></div>
            {emergencyCases.slice(0, 3).map((em) => (
              <div className="list-row" key={em.id}>
                <Avatar name={em.patientName} />
                <div className="lr-main">
                  <div className="lr-title">{em.patientName}</div>
                  <div className="lr-sub">{em.condition}</div>
                </div>
                <span className={`badge ${em.priority === 'Critical' ? 'badge-red' : 'badge-amber'}`}>{em.priority}</span>
              </div>
            ))}
          </section>

          {/* Recent admissions */}
          <section className="panel">
            <div className="panel-head"><h2>Recent Admissions</h2><Link to="/admin/admissions" className="btn btn-ghost btn-sm">All</Link></div>
            {admissions.slice(0, 2).map((adm) => (
              <div className="list-row" key={adm.id}>
                <Avatar name={adm.patientName} />
                <div className="lr-main">
                  <div className="lr-title">{adm.patientName}</div>
                  <div className="lr-sub">{formatDate(adm.admissionDate)} · Bed {adm.bedNumber}</div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
