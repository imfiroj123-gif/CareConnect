// ============================================================
// client/src/pages/modules/AppointmentsPage.jsx
// Appointment management shared by admin & receptionist:
// create / approve / cancel / reschedule / complete, with search
// and status filters. Doctor view reuses this page read-only.
// ============================================================

import { useMemo, useState } from 'react';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal';
import DataTable from '../../components/Table';
import { PageHead, Avatar, Badge, EmptyState } from '../../components/ui';
import { useToast } from '../../components/Toast';
import {
  getData, addData, updateData, deleteData, STORAGE_KEYS,
} from '../../services/storage';
import { required, validateForm } from '../../utils/validation';
import { formatDate, formatTime, todayISO } from '../../utils/helpers';

const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const TIME_SLOTS = ['09:00', '09:45', '10:30', '11:15', '12:00', '14:00', '14:45', '15:30', '16:15'];

export default function AppointmentsPage({ readOnly = false }) {
  const { showToast } = useToast();
  const doctors = getData(STORAGE_KEYS.doctors);
  const patients = getData(STORAGE_KEYS.patients);

  const [appointments, setAppointments] = useState(() => getData(STORAGE_KEYS.appointments));
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankForm());
  const [errors, setErrors] = useState({});
  const [viewing, setViewing] = useState(null);

  function blankForm() {
    return {
      patientId: '', doctorId: '', date: todayISO(), time: '',
      reason: '', status: 'Pending',
    };
  }

  function refresh() {
    setAppointments(getData(STORAGE_KEYS.appointments));
  }

  /** Join appointment rows with names for display. */
  const enriched = appointments.map((a) => ({
    ...a,
    doctorName: a.doctorName || doctors.find((d) => d.id === a.doctorId)?.name || '—',
  }));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter((a) => {
      const matchQ = !q || `${a.patientName} ${a.doctorName} ${a.date}`.toLowerCase().includes(q);
      const matchS = !statusFilter || a.status === statusFilter;
      return matchQ && matchS;
    });
  }, [enriched, query, statusFilter]);

  /* ---------- Create / edit ---------- */
  function openCreate() {
    setForm(blankForm()); setEditingId(null); setErrors({});
    setModalOpen(true);
  }

  function openEdit(appt) {
    setForm({
      patientId: appt.patientId || '', doctorId: appt.doctorId,
      date: appt.date, time: appt.time, reason: appt.reason, status: appt.status,
    });
    setEditingId(appt.id); setErrors({});
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const selectedDoctor = doctors.find((d) => d.id === form.doctorId);
    const selectedPatient = patients.find((p) => p.id === form.patientId);

    const result = validateForm(form, {
      patientId: (v) => required(v, 'Patient'),
      doctorId: (v) => required(v, 'Doctor'),
      date: (v) => required(v, 'Date'),
      time: (v) => required(v, 'Time slot'),
      reason: (v) => required(v, 'Reason'),
    });
    setErrors(result.errors);
    if (!result.isValid) return;

    const record = {
      ...form,
      patientName: selectedPatient?.name || form.patientId,
      doctorName: selectedDoctor?.name,
      department: selectedDoctor?.department,
    };

    if (editingId) {
      updateData(STORAGE_KEYS.appointments, editingId, record);
      showToast('Appointment updated');
    } else {
      addData(STORAGE_KEYS.appointments, record);
      showToast(`Appointment booked for ${record.patientName}`);
    }
    refresh();
    setModalOpen(false);
  }

  /* ---------- Quick status actions ---------- */
  function setStatus(appt, status) {
    updateData(STORAGE_KEYS.appointments, appt.id, { status });
    showToast(`${appt.patientName}'s appointment ${status.toLowerCase()}`, status === 'Cancelled' ? 'info' : 'success');
    refresh();
  }

  /** Reschedule via a small prompt-free modal — reuse edit modal. */
  const columns = [
    {
      key: 'patientName',
      label: 'Patient',
      render: (row) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={row.patientName} size={32} />
          <span>
            <b>{row.patientName}</b>
            <div className="small muted">{row.reason}</div>
          </span>
        </span>
      ),
    },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'department', label: 'Department' },
    { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
    { key: 'time', label: 'Time', render: (row) => formatTime(row.time) },
    { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} /> },
    ...(readOnly ? [] : [
      {
        key: 'actions',
        label: 'Actions',
        render: (row) => (
          <span className="row-actions">
            <button type="button" className="icon-btn" title="Details" onClick={() => setViewing(row)}><Icon name="eye" size={16} /></button>
            {row.status === 'Pending' && (
              <button type="button" className="icon-btn" title="Approve" onClick={() => setStatus(row, 'Confirmed')}>
                <Icon name="check" size={16} />
              </button>
            )}
            {(row.status === 'Confirmed') && (
              <button type="button" className="icon-btn" title="Mark completed" onClick={() => setStatus(row, 'Completed')}>
                <Icon name="clipboard" size={16} />
              </button>
            )}
            <button type="button" className="icon-btn" title="Reschedule / Edit" onClick={() => openEdit(row)}><Icon name="edit" size={16} /></button>
            {row.status !== 'Cancelled' && row.status !== 'Completed' && (
              <button type="button" className="icon-btn danger" title="Cancel" onClick={() => setStatus(row, 'Cancelled')}>
                <Icon name="x" size={16} />
              </button>
            )}
          </span>
        ),
      },
    ]),
  ];

  return (
    <>
      <PageHead title={readOnly ? "Today's Appointments" : 'Appointments'} subtitle={`${filtered.length} shown · ${appointments.length} total`}>
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <div className="search-box">
            <Icon name="search" size={15} />
            <input placeholder="Search patient or doctor…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {!readOnly && (
            <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
              <Icon name="plus" size={16} /> New Appointment
            </button>
          )}
        </div>
      </PageHead>

      <section className="panel">
        {filtered.length === 0
          ? <EmptyState icon="calendar" title="No appointments" hint="Try clearing filters" />
          : <DataTable columns={columns} rows={filtered} />}
      </section>

      {/* ---------- Create / Edit / Reschedule ---------- */}
      <Modal open={modalOpen} title={editingId ? 'Edit / Reschedule Appointment' : 'Book Appointment'} onClose={() => setModalOpen(false)} wide>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="field">
              <label>Patient *</label>
              <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
                <option value="">Select patient…</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
              </select>
              {errors.patientId && <div className="error-text">{errors.patientId}</div>}
            </div>
            <div className="field">
              <label>Doctor *</label>
              <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
                <option value="">Select doctor…</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.department}</option>)}
              </select>
              {errors.doctorId && <div className="error-text">{errors.doctorId}</div>}
            </div>
            <div className="field">
              <label>Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              {errors.date && <div className="error-text">{errors.date}</div>}
            </div>
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Time slot *</label>
            <div className="slot-grid">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot} type="button"
                  className={`slot-chip${form.time === slot ? ' selected' : ''}`}
                  onClick={() => setForm({ ...form, time: slot })}
                >
                  {slot}
                </button>
              ))}
            </div>
            {errors.time && <div className="error-text">{errors.time}</div>}
          </div>

          <div className="field">
            <label>Reason *</label>
            <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason for visit" />
            {errors.reason && <div className="error-text">{errors.reason}</div>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Book Appointment'}</button>
          </div>
        </form>
      </Modal>

      {/* ---------- Details ---------- */}
      <Modal open={!!viewing} title="Appointment Details" onClose={() => setViewing(null)}>
        {viewing && (
          <>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
              <Avatar name={viewing.patientName} size={50} />
              <div>
                <b>{viewing.patientName}</b>
                <div className="small muted">with {viewing.doctorName}</div>
              </div>
              <Badge status={viewing.status} />
            </div>
            <div className="summary-line"><span>Department</span><b>{viewing.department}</b></div>
            <div className="summary-line"><span>Date</span><b>{formatDate(viewing.date)}</b></div>
            <div className="summary-line"><span>Time</span><b>{formatTime(viewing.time)}</b></div>
            <div className="summary-line"><span>Reference</span><b>{viewing.id}</b></div>
            <div className="summary-line" style={{ borderBottom: 'none' }}><span>Reason</span><b style={{ textAlign: 'right', maxWidth: 220 }}>{viewing.reason}</b></div>
          </>
        )}
      </Modal>
    </>
  );
}
