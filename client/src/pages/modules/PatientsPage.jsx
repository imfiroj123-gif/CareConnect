// ============================================================
// client/src/pages/modules/PatientsPage.jsx
// Patient management: add / edit / delete / search / view details.
// All data persists to localStorage via storage helpers.
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
import {
  required, phoneError, emailError, numberError,
  validateForm,
} from '../../utils/validation';
import { formatDate } from '../../utils/helpers';

const BLANK = {
  name: '', age: '', gender: 'Male', phone: '', email: '',
  address: '', bloodGroup: 'O+', emergencyContact: '',
  doctor: '', department: '', admissionStatus: 'Outpatient',
};

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const STATUSES = ['Outpatient', 'Admitted', 'Discharged'];

export default function PatientsPage() {
  const { showToast } = useToast();
  const doctors = getData(STORAGE_KEYS.doctors);

  const [patients, setPatients] = useState(() => getData(STORAGE_KEYS.patients));
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null => create mode
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [viewing, setViewing] = useState(null); // patient being viewed
  const [deleting, setDeleting] = useState(null); // patient pending confirm

  /** Re-sync list from localStorage after any mutation. */
  function refresh() {
    setPatients(getData(STORAGE_KEYS.patients));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) =>
      `${p.name} ${p.id} ${p.phone} ${p.department}`.toLowerCase().includes(q));
  }, [patients, query]);

  /* ---------- Form handling ---------- */
  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function openCreate() {
    setForm(BLANK);
    setEditingId(null);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(patient) {
    setForm({ ...patient });
    setEditingId(patient.id);
    setErrors({});
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const result = validateForm(form, {
      name: (v) => required(v, 'Name'),
      age: (v) => numberError(v, 'Age', { min: 0 }),
      phone: (v) => phoneError(v, 'Phone'),
      email: emailError,
      address: (v) => required(v, 'Address'),
      emergencyContact: (v) => phoneError(v, 'Emergency contact'),
      doctor: (v) => required(v, 'Doctor'),
      department: (v) => required(v, 'Department'),
    });
    setErrors(result.errors);
    if (!result.isValid) return;

    if (editingId) {
      updateData(STORAGE_KEYS.patients, editingId, form);
      showToast('Patient updated');
    } else {
      addData(STORAGE_KEYS.patients, form);
      showToast('Patient added');
    }
    refresh();
    setModalOpen(false);
  }

  function confirmDelete() {
    deleteData(STORAGE_KEYS.patients, deleting.id);
    showToast(`Deleted ${deleting.name}`, 'info');
    setDeleting(null);
    refresh();
  }

  /* ---------- Table columns ---------- */
  const columns = [
    {
      key: 'name',
      label: 'Patient',
      render: (row) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={row.name} size={32} />
          <span>
            <b>{row.name}</b>
            <div className="small muted">{row.id}</div>
          </span>
        </span>
      ),
    },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'phone', label: 'Phone' },
    { key: 'department', label: 'Department' },
    { key: 'doctor', label: 'Doctor' },
    { key: 'admissionStatus', label: 'Status', render: (row) => <Badge status={row.admissionStatus} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <span className="row-actions">
          <button type="button" className="icon-btn" title="View" onClick={() => setViewing(row)}><Icon name="eye" size={16} /></button>
          <button type="button" className="icon-btn" title="Edit" onClick={() => openEdit(row)}><Icon name="edit" size={16} /></button>
          <button type="button" className="icon-btn danger" title="Delete" onClick={() => setDeleting(row)}><Icon name="trash" size={16} /></button>
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHead title="Patients" subtitle={`${patients.length} registered patients`}>
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <div className="search-box">
            <Icon name="search" size={15} />
            <input placeholder="Search by name, ID, phone…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
            <Icon name="plus" size={16} /> Add Patient
          </button>
        </div>
      </PageHead>

      <section className="panel">
        {filtered.length === 0
          ? <EmptyState icon="users" title="No patients found" hint={query ? `Nothing matches "${query}"` : 'Add your first patient'} />
          : <DataTable columns={columns} rows={filtered} />}
      </section>

      {/* ---------- Add / Edit modal ---------- */}
      <Modal open={modalOpen} title={editingId ? 'Edit Patient' : 'Add New Patient'} onClose={() => setModalOpen(false)} wide>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="field">
              <label>Full name *</label>
              <input value={form.name} onChange={setField('name')} />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>
            <div className="field">
              <label>Age *</label>
              <input type="number" min="0" value={form.age} onChange={setField('age')} />
              {errors.age && <div className="error-text">{errors.age}</div>}
            </div>
            <div className="field">
              <label>Gender</label>
              <select value={form.gender} onChange={setField('gender')}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="field">
              <label>Phone *</label>
              <input value={form.phone} onChange={setField('phone')} />
              {errors.phone && <div className="error-text">{errors.phone}</div>}
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={setField('email')} />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
            <div className="field">
              <label>Blood group</label>
              <select value={form.bloodGroup} onChange={setField('bloodGroup')}>
                {BLOOD_GROUPS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Emergency contact *</label>
              <input value={form.emergencyContact} onChange={setField('emergencyContact')} />
              {errors.emergencyContact && <div className="error-text">{errors.emergencyContact}</div>}
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
              <label>Doctor *</label>
              <select value={form.doctor} onChange={setField('doctor')}>
                <option value="">Select…</option>
                {doctors.map((d) => <option key={d.id}>{d.name}</option>)}
              </select>
              {errors.doctor && <div className="error-text">{errors.doctor}</div>}
            </div>
            <div className="field">
              <label>Admission status</label>
              <select value={form.admissionStatus} onChange={setField('admissionStatus')}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Address *</label>
            <textarea value={form.address} onChange={setField('address')} style={{ minHeight: 64 }} />
            {errors.address && <div className="error-text">{errors.address}</div>}
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Add Patient'}</button>
          </div>
        </form>
      </Modal>

      {/* ---------- View details modal ---------- */}
      <Modal open={!!viewing} title="Patient Details" onClose={() => setViewing(null)}>
        {viewing && (
          <>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
              <Avatar name={viewing.name} size={54} />
              <div>
                <b style={{ fontSize: '1.05rem' }}>{viewing.name}</b>
                <div className="small muted">{viewing.id} · {viewing.age} yrs · {viewing.gender} · Blood {viewing.bloodGroup}</div>
              </div>
              <Badge status={viewing.admissionStatus} />
            </div>
            <div className="summary-line"><span>Phone</span><b>{viewing.phone}</b></div>
            <div className="summary-line"><span>Email</span><b>{viewing.email || '—'}</b></div>
            <div className="summary-line"><span>Emergency contact</span><b>{viewing.emergencyContact}</b></div>
            <div className="summary-line"><span>Doctor</span><b>{viewing.doctor}</b></div>
            <div className="summary-line"><span>Department</span><b>{viewing.department}</b></div>
            <div className="summary-line"><span>Registered</span><b>{formatDate(viewing.createdAt)}</b></div>
            <div className="summary-line" style={{ borderBottom: 'none' }}><span>Address</span><b style={{ textAlign: 'right', maxWidth: 240 }}>{viewing.address}</b></div>
          </>
        )}
      </Modal>

      {/* ---------- Delete confirmation ---------- */}
      <Modal open={!!deleting} title="Delete patient?" onClose={() => setDeleting(null)}>
        <p>Are you sure you want to delete <b>{deleting?.name}</b> ({deleting?.id})? This cannot be undone.</p>
        <div className="form-actions" style={{ marginTop: 18 }}>
          <button type="button" className="btn btn-ghost" onClick={() => setDeleting(null)}>Keep</button>
          <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete permanently</button>
        </div>
      </Modal>
    </>
  );
}
