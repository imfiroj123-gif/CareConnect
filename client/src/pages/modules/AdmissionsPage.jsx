// ============================================================
// client/src/pages/modules/AdmissionsPage.jsx
// Patient admission: create admission records (auto-suggests a
// free bed), view details, edit and discharge (frees the bed).
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
import { formatDate, todayISO } from '../../utils/helpers';

const BLANK = {
  patientId: '', doctorName: '', department: '', admissionDate: '',
  bedNumber: '', roomType: 'General Ward', emergencyContact: '', reason: '',
};

const ROOM_TYPES = ['General Ward', 'ICU', 'Emergency', 'Private Room', 'Semi-Private'];

export default function AdmissionsPage() {
  const { showToast } = useToast();

  const [admissions, setAdmissions] = useState(() => getData(STORAGE_KEYS.admissions));
  const [beds, setBeds] = useState(() => getData(STORAGE_KEYS.beds));
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [viewing, setViewing] = useState(null);
  const [discharging, setDischarging] = useState(null);

  const patients = getData(STORAGE_KEYS.patients);
  const doctors = getData(STORAGE_KEYS.doctors);

  function refresh() {
    setAdmissions(getData(STORAGE_KEYS.admissions));
    setBeds(getData(STORAGE_KEYS.beds));
  }

  /** Free beds for the chosen room type. */
  const freeBeds = beds.filter((b) => b.status === 'Available' && b.ward === form.roomType);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return admissions;
    return admissions.filter((a) => `${a.patientName} ${a.id} ${a.department}`.toLowerCase().includes(q));
  }, [admissions, query]);

  /* ---------- Create / edit ---------- */
  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function openCreate() {
    setForm({ ...BLANK, admissionDate: todayISO(), emergencyContact: '' });
    setEditingId(null); setErrors({});
    setModalOpen(true);
  }

  function openEdit(adm) {
    setForm({
      ...adm,
      admissionDate: adm.admissionDate || todayISO(),
    });
    setEditingId(adm.id); setErrors({});
    setModalOpen(true);
  }

  /** When the selected patient changes, prefill emergency contact + doctor. */
  function pickPatient(id) {
    const p = patients.find((x) => x.id === id);
    setForm({
      ...form,
      patientId: id,
      emergencyContact: p?.emergencyContact || form.emergencyContact,
      doctorName: p?.doctor || form.doctorName,
      department: p?.department || form.department,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const result = validateForm(form, {
      patientId: (v) => required(v, 'Patient'),
      doctorName: (v) => required(v, 'Doctor'),
      department: (v) => required(v, 'Department'),
      admissionDate: (v) => required(v, 'Admission date'),
      bedNumber: (v) => required(v, 'Bed number'),
      reason: (v) => required(v, 'Reason'),
    });
    setErrors(result.errors);
    if (!result.isValid) return;

    if (editingId) {
      updateData(STORAGE_KEYS.admissions, editingId, form);
      showToast('Admission updated');
    } else {
      addData(STORAGE_KEYS.admissions, form);
      // Mark that bed as occupied to keep the board in sync.
      updateData(STORAGE_KEYS.beds, form.bedNumber.split(' ')[0], {
        status: 'Occupied',
        patientId: form.patientId,
        patientName: patients.find((p) => p.id === form.patientId)?.name,
      });
      showToast('Patient admitted');
    }
    refresh();
    setModalOpen(false);
  }

  /** Discharge: mark record discharged + release bed. */
  function confirmDischarge() {
    updateData(STORAGE_KEYS.admissions, discharging.id, { status: 'Discharged' });
    const bedId = discharging.bedNumber.split(' ')[0];
    updateData(STORAGE_KEYS.beds, bedId, { status: 'Available', patientId: '', patientName: '' });
    showToast(`${discharging.patientName} discharged — bed ${bedId} released`, 'info');
    setDischarging(null);
    refresh();
  }

  const columns = [
    {
      key: 'patientName',
      label: 'Patient',
      render: (row) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={row.patientName} size={32} />
          <span>
            <b>{row.patientName}</b>
            <div className="small muted">{row.patientId}</div>
          </span>
        </span>
      ),
    },
    { key: 'department', label: 'Department' },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'roomType', label: 'Room type' },
    { key: 'bedNumber', label: 'Bed' },
    { key: 'admissionDate', label: 'Since', render: (row) => formatDate(row.admissionDate) },
    { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <span className="row-actions">
          <button type="button" className="icon-btn" title="View" onClick={() => setViewing(row)}><Icon name="eye" size={16} /></button>
          <button type="button" className="icon-btn" title="Edit" onClick={() => openEdit(row)}><Icon name="edit" size={16} /></button>
          {row.status === 'Admitted' && (
            <button type="button" className="icon-btn danger" title="Discharge" onClick={() => setDischarging(row)}>
              <Icon name="logout" size={16} />
            </button>
          )}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHead title="Patient Admissions" subtitle={`${admissions.filter((a) => a.status === 'Admitted').length} currently admitted`}>
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <div className="search-box">
            <Icon name="search" size={15} />
            <input placeholder="Search admissions…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
            <Icon name="plus" size={16} /> New Admission
          </button>
        </div>
      </PageHead>

      <section className="panel">
        {filtered.length === 0
          ? <EmptyState icon="clipboard" title="No admissions yet" hint="Admit a patient to get started" />
          : <DataTable columns={columns} rows={filtered} />}
      </section>

      {/* ---------- Create / Edit ---------- */}
      <Modal open={modalOpen} title={editingId ? 'Edit Admission' : 'New Patient Admission'} onClose={() => setModalOpen(false)} wide>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="field">
              <label>Patient *</label>
              <select value={form.patientId} onChange={(e) => pickPatient(e.target.value)}>
                <option value="">Select patient…</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
              </select>
              {errors.patientId && <div className="error-text">{errors.patientId}</div>}
            </div>
            <div className="field">
              <label>Doctor *</label>
              <select value={form.doctorName} onChange={setField('doctorName')}>
                <option value="">Select doctor…</option>
                {doctors.map((d) => <option key={d.id}>{d.name}</option>)}
              </select>
              {errors.doctorName && <div className="error-text">{errors.doctorName}</div>}
            </div>
            <div className="field">
              <label>Department *</label>
              <select value={form.department} onChange={setField('department')}>
                <option value="">Select…</option>
                {[...new Set(doctors.map((d) => d.department))].map((dep) => <option key={dep}>{dep}</option>)}
              </select>
              {errors.department && <div className="error-text">{errors.department}</div>}
            </div>
            <div className="field">
              <label>Admission date *</label>
              <input type="date" value={form.admissionDate} onChange={setField('admissionDate')} />
              {errors.admissionDate && <div className="error-text">{errors.admissionDate}</div>}
            </div>
            <div className="field">
              <label>Room type</label>
              <select
                value={form.roomType}
                onChange={(e) => setForm({ ...form, roomType: e.target.value, bedNumber: '' })}
              >
                {ROOM_TYPES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Bed number *</label>
              {/* Only free beds of the chosen ward are offered. */}
              <select value={form.bedNumber} onChange={setField('bedNumber')}>
                <option value="">{freeBeds.length ? 'Select free bed…' : 'No free beds in this ward'}</option>
                {freeBeds.map((b) => (
                  <option key={b.id} value={`${b.id} (${b.room})`}>{b.id} — {b.room}</option>
                ))}
              </select>
              {errors.bedNumber && <div className="error-text">{errors.bedNumber}</div>}
            </div>
            <div className="field">
              <label>Emergency contact *</label>
              <input value={form.emergencyContact} onChange={setField('emergencyContact')} />
            </div>
          </div>
          <div className="field">
            <label>Reason for admission *</label>
            <textarea value={form.reason} onChange={setField('reason')} placeholder="Diagnosis / observation notes…" />
            {errors.reason && <div className="error-text">{errors.reason}</div>}
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Admit Patient'}</button>
          </div>
        </form>
      </Modal>

      {/* ---------- View ---------- */}
      <Modal open={!!viewing} title="Admission Record" onClose={() => setViewing(null)}>
        {viewing && (
          <>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
              <Avatar name={viewing.patientName} size={50} />
              <div>
                <b>{viewing.patientName}</b>
                <div className="small muted">{viewing.id}</div>
              </div>
              <Badge status={viewing.status} />
            </div>
            <div className="summary-line"><span>Doctor</span><b>{viewing.doctorName}</b></div>
            <div className="summary-line"><span>Department</span><b>{viewing.department}</b></div>
            <div className="summary-line"><span>Ward / Bed</span><b>{viewing.roomType} · {viewing.bedNumber}</b></div>
            <div className="summary-line"><span>Admitted on</span><b>{formatDate(viewing.admissionDate)}</b></div>
            <div className="summary-line"><span>Emergency contact</span><b>{viewing.emergencyContact}</b></div>
            <div className="summary-line" style={{ borderBottom: 'none' }}><span>Reason</span><b style={{ textAlign: 'right', maxWidth: 220 }}>{viewing.reason}</b></div>
          </>
        )}
      </Modal>

      {/* ---------- Discharge confirmation ---------- */}
      <Modal open={!!discharging} title="Discharge patient?" onClose={() => setDischarging(null)}>
        <p>
          Discharge <b>{discharging?.patientName}</b>? The assigned bed
          {' '}<b>{discharging?.bedNumber}</b> will be released back to the available pool.
        </p>
        <div className="form-actions" style={{ marginTop: 18 }}>
          <button type="button" className="btn btn-ghost" onClick={() => setDischarging(null)}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={confirmDischarge}>Confirm discharge</button>
        </div>
      </Modal>
    </>
  );
}
