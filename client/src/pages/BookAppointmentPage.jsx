// ============================================================
// client/src/pages/BookAppointmentPage.jsx
// Public appointment booking. Posts the booking to the Express
// API (POST /api/appointments) AND mirrors it into localStorage
// so it shows up in dashboards even if the backend is offline.
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import Logo from '../components/Logo';
import { useToast } from '../components/Toast';
import { getData, addData, STORAGE_KEYS } from '../services/storage';
import { createAppointment } from '../services/api';
import { required, phoneError, validateForm } from '../utils/validation';
import { formatCurrency } from '../utils/helpers';

const TIME_SLOTS = ['09:00', '09:45', '10:30', '11:15', '12:00', '14:00', '14:45', '15:30', '16:15', '17:00'];

export default function BookAppointmentPage() {
  const { showToast } = useToast();
  const doctors = getData(STORAGE_KEYS.doctors);
  const departments = [...new Set(doctors.map((d) => d.department))];

  const [form, setForm] = useState({
    patientName: '', phone: '', department: '', doctorId: '',
    date: '', time: '', reason: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(null); // holds created appt after success

  // Doctors filtered by the chosen department.
  const deptDoctors = doctors.filter((d) => d.department === form.department);
  const selectedDoctor = doctors.find((d) => d.id === form.doctorId);

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const pickSlot = (time) => setForm({ ...form, time });

  async function handleSubmit(e) {
    e.preventDefault();

    const result = validateForm(form, {
      patientName: (v) => required(v, 'Patient name'),
      phone: (v) => phoneError(v, 'Phone'),
      department: (v) => required(v, 'Department'),
      doctorId: (v) => required(v, 'Doctor'),
      date: (v) => required(v, 'Date'),
      time: (v) => required(v, 'Time slot'),
      reason: (v) => required(v, 'Reason'),
    });
    setErrors(result.errors);
    if (!result.isValid) return;

    setSubmitting(true);

    const payload = {
      patientName: form.patientName,
      patientId: null, // walk-in visitor; reception links an ID later
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: form.department,
      date: form.date,
      time: form.time,
      reason: form.reason,
      status: 'Pending',
    };

    try {
      // Try the real REST API first (works when server is running).
      const created = await createAppointment(payload);
      // Mirror to localStorage for dashboard visibility.
      addData(STORAGE_KEYS.appointments, created.id ? { ...payload, id: undefined } : payload);
      setBooked(created);
      showToast('Appointment requested! We will confirm shortly.', 'success');
    } catch {
      // Backend not reachable → still persist locally so demo works.
      addData(STORAGE_KEYS.appointments, payload);
      setBooked(payload);
      showToast('Saved locally (server offline). Appointment recorded.', 'info');
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------- Confirmation screen ---------- */
  if (booked) {
    return (
      <div className="auth-page">
        <div className="card anim-fade-up book-wrap" style={{ padding: 34 }}>
          <span style={{ width: 62, height: 62, borderRadius: 20, background: 'var(--green-100)', color: 'var(--green-700)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={30} strokeWidth={2.4} />
          </span>
          <h2 style={{ margin: '16px 0 6px' }}>Appointment requested</h2>
          <p className="muted">Reference <b>{booked.id}</b> — our front desk will confirm your slot shortly.</p>

          <div style={{ marginTop: 18 }}>
            <div className="summary-line"><span>Patient</span><b>{booked.patientName}</b></div>
            <div className="summary-line"><span>Doctor</span><b>{booked.doctorName}</b></div>
            <div className="summary-line"><span>Department</span><b>{booked.department}</b></div>
            <div className="summary-line"><span>Date & time</span><b>{booked.date} · {booked.time}</b></div>
            <div className="summary-line"><span>Consultation fee</span><b>{selectedDoctor ? formatCurrency(selectedDoctor.consultationFee) : '—'}</b></div>
            <div className="summary-line"><span>Status</span><b>Pending confirmation</b></div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button type="button" className="btn btn-ghost" onClick={() => { setBooked(null); setForm({ patientName: '', phone: '', department: '', doctorId: '', date: '', time: '', reason: '' }); }}>
              Book another
            </button>
            <Link to="/" className="btn btn-primary">Back to home</Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Booking form ---------- */
  return (
    <div className="auth-page" style={{ alignItems: 'flex-start' }}>
      <div className="card anim-fade-up book-wrap" style={{ padding: 32, margin: '24px 0' }}>
        <Link to="/" className="small" style={{ color: 'var(--green-700)', fontWeight: 600 }}>← Back to site</Link>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '14px 0 4px' }}>
          <Logo size={38} showText={false} />
          <h1 style={{ fontSize: '1.35rem' }}>Book an Appointment</h1>
        </div>
        <p className="muted small">Fill in the details — takes less than a minute.</p>

        <form onSubmit={handleSubmit} noValidate style={{ marginTop: 18 }}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="bk-name">Patient name *</label>
              <input id="bk-name" value={form.patientName} onChange={setField('patientName')} placeholder="Full name" />
              {errors.patientName && <div className="error-text">{errors.patientName}</div>}
            </div>

            <div className="field">
              <label htmlFor="bk-phone">Phone *</label>
              <input id="bk-phone" value={form.phone} onChange={setField('phone')} placeholder="+91 98765 43210" />
              {errors.phone && <div className="error-text">{errors.phone}</div>}
            </div>

            <div className="field">
              <label htmlFor="bk-dept">Department *</label>
              <select
                id="bk-dept"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value, doctorId: '' })}
              >
                <option value="">Select department…</option>
                {departments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
              </select>
              {errors.department && <div className="error-text">{errors.department}</div>}
            </div>

            <div className="field">
              <label htmlFor="bk-doc">Doctor *</label>
              <select id="bk-doc" value={form.doctorId} onChange={setField('doctorId')} disabled={!form.department}>
                <option value="">{form.department ? 'Select doctor…' : 'Choose a department first'}</option>
                {deptDoctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — ₹{d.consultationFee} ({d.availability})
                  </option>
                ))}
              </select>
              {errors.doctorId && <div className="error-text">{errors.doctorId}</div>}
            </div>

            <div className="field">
              <label htmlFor="bk-date">Date *</label>
              <input id="bk-date" type="date" value={form.date} onChange={setField('date')} />
              {errors.date && <div className="error-text">{errors.date}</div>}
            </div>

            <div className="field">
              <label htmlFor="bk-reason">Reason for visit *</label>
              <input id="bk-reason" value={form.reason} onChange={setField('reason')} placeholder="e.g. Chest pain follow-up" />
              {errors.reason && <div className="error-text">{errors.reason}</div>}
            </div>
          </div>

          {/* ---------- Time slot chips ---------- */}
          <div className="field">
            <label>Preferred time slot *</label>
            <div className="slot-grid">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`slot-chip${form.time === slot ? ' selected' : ''}`}
                  onClick={() => pickSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
            {errors.time && <div className="error-text">{errors.time}</div>}
          </div>

          {/* ---------- Live summary ---------- */}
          {(form.department || form.doctorId || form.time) && (
            <div style={{ background: 'var(--green-50)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div className="summary-line"><span>Department</span><b>{form.department || '—'}</b></div>
              <div className="summary-line"><span>Doctor</span><b>{selectedDoctor?.name || '—'}</b></div>
              <div className="summary-line"><span>Consultation fee</span><b>{selectedDoctor ? formatCurrency(selectedDoctor.consultationFee) : '—'}</b></div>
              <div className="summary-line" style={{ borderBottom: 'none' }}><span>Time slot</span><b>{form.time || '—'}</b></div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            <Icon name="calendar" size={17} /> {submitting ? 'Booking…' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
