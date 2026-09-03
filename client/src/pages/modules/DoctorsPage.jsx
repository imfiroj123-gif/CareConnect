// ============================================================
// client/src/pages/modules/DoctorsPage.jsx
// Doctor management: add / edit / delete / search / profile view,
// department assignment and availability status.
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
  required, phoneError, emailError, numberError, validateForm,
} from '../../utils/validation';

const BLANK = {
  name: '', specialization: '', department: '', experience: '',
  phone: '', email: '', availability: 'Available', consultationFee: '',
};

const AVAILABILITY = ['Available', 'In Surgery', 'On Leave'];

export default function DoctorsPage() {
  const { showToast } = useToast();
  const departments = [...new Set(getData(STORAGE_KEYS.departments).map((d) => d.name))];

  const [doctors, setDoctors] = useState(() => getData(STORAGE_KEYS.doctors));
  const [query, setQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  function refresh() {
    setDoctors(getData(STORAGE_KEYS.doctors));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return doctors.filter((d) => {
      const matchesQuery = !q || `${d.name} ${d.specialization} ${d.department}`.toLowerCase().includes(q);
      const matchesDept = !deptFilter || d.department === deptFilter;
      return matchesQuery && matchesDept;
    });
  }, [doctors, query, deptFilter]);

  /* ---------- Form handling ---------- */
  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function openCreate() {
    setForm(BLANK); setEditingId(null); setErrors({});
    setModalOpen(true);
  }
  function openEdit(doc) {
    setForm({ ...doc }); setEditingId(doc.id); setErrors({});
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = validateForm(form, {
      name: (v) => required(v, 'Name'),
      specialization: (v) => required(v, 'Specialization'),
      department: (v) => required(v, 'Department'),
      experience: (v) => numberError(v, 'Experience', { min: 0 }),
      phone: (v) => phoneError(v, 'Phone'),
      email: emailError,
      consultationFee: (v) => numberError(v, 'Consultation fee', { min: 0 }),
    });
    setErrors(result.errors);
    if (!result.isValid) return;

    if (editingId) {
      updateData(STORAGE_KEYS.doctors, editingId, form);
      showToast('Doctor updated');
    } else {
      addData(STORAGE_KEYS.doctors, form);
      showToast('Doctor added');
    }
    refresh();
    setModalOpen(false);
  }

  function confirmDelete() {
    deleteData(STORAGE_KEYS.doctors, deleting.id);
    showToast(`Deleted ${deleting.name}`, 'info');
    setDeleting(null);
    refresh();
  }

  /** Quick toggle availability straight from the table. */
  function cycleAvailability(doc) {
    const next = doc.availability === 'Available' ? 'In Surgery' : doc.availability === 'In Surgery' ? 'On Leave' : 'Available';
    updateData(STORAGE_KEYS.doctors, doc.id, { availability: next });
    refresh();
    showToast(`${doc.name} is now ${next}`);
  }

  const columns = [
    {
      key: 'name',
      label: 'Doctor',
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
    { key: 'specialization', label: 'Specialization' },
    { key: 'department', label: 'Department' },
    { key: 'experience', label: 'Exp (yrs)' },
    {
      key: 'availability',
      label: 'Availability',
      render: (row) => (
        // Click the badge to cycle status quickly.
        <button
          type="button"
          onClick={() => cycleAvailability(row)}
          style={{ border: 'none', background: 'none', padding: 0 }}
          title="Click to change availability"
        >
          <Badge status={row.availability} />
        </button>
      ),
    },
    { key: 'consultationFee', label: 'Fee', render: (row) => `₹${row.consultationFee}` },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <span className="row-actions">
          <button type="button" className="icon-btn" title="Profile" onClick={() => setViewing(row)}><Icon name="eye" size={16} /></button>
          <button type="button" className="icon-btn" title="Edit" onClick={() => openEdit(row)}><Icon name="edit" size={16} /></button>
          <button type="button" className="icon-btn danger" title="Delete" onClick={() => setDeleting(row)}><Icon name="trash" size={16} /></button>
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHead title="Doctors" subtitle={`${doctors.length} doctors across ${departments.length} departments`}>
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <div className="search-box">
            <Icon name="search" size={15} />
            <input placeholder="Search doctors…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select className="filter-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">All departments</option>
            {departments.map((d) => <option key={d}>{d}</option>)}
          </select>
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
            <Icon name="plus" size={16} /> Add Doctor
          </button>
        </div>
      </PageHead>

      <section className="panel">
        {filtered.length === 0
          ? <EmptyState icon="stethoscope" title="No doctors found" hint="Adjust your filters or add a doctor" />
          : <DataTable columns={columns} rows={filtered} />}
      </section>

      {/* ---------- Add / Edit modal ---------- */}
      <Modal open={modalOpen} title={editingId ? 'Edit Doctor' : 'Add New Doctor'} onClose={() => setModalOpen(false)} wide>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="field">
              <label>Full name *</label>
              <input value={form.name} onChange={setField('name')} placeholder="Dr. …" />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>
            <div className="field">
              <label>Specialization *</label>
              <input value={form.specialization} onChange={setField('specialization')} placeholder="Cardiologist…" />
              {errors.specialization && <div className="error-text">{errors.specialization}</div>}
            </div>
            <div className="field">
              <label>Department *</label>
              <select value={form.department} onChange={setField('department')}>
                <option value="">Select…</option>
                {departments.map((dep) => <option key={dep}>{dep}</option>)}
              </select>
              {errors.department && <div className="error-text">{errors.department}</div>}
            </div>
            <div className="field">
              <label>Experience (years) *</label>
              <input type="number" min="0" value={form.experience} onChange={setField('experience')} />
              {errors.experience && <div className="error-text">{errors.experience}</div>}
            </div>
            <div className="field">
              <label>Phone *</label>
              <input value={form.phone} onChange={setField('phone')} />
              {errors.phone && <div className="error-text">{errors.phone}</div>}
            </div>
            <div className="field">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={setField('email')} />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
            <div className="field">
              <label>Availability</label>
              <select value={form.availability} onChange={setField('availability')}>
                {AVAILABILITY.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Consultation fee (₹) *</label>
              <input type="number" min="0" value={form.consultationFee} onChange={setField('consultationFee')} />
              {errors.consultationFee && <div className="error-text">{errors.consultationFee}</div>}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Add Doctor'}</button>
          </div>
        </form>
      </Modal>

      {/* ---------- Profile modal ---------- */}
      <Modal open={!!viewing} title="Doctor Profile" onClose={() => setViewing(null)}>
        {viewing && (
          <>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
              <Avatar name={viewing.name} size={54} />
              <div>
                <b style={{ fontSize: '1.05rem' }}>{viewing.name}</b>
                <div className="small muted">{viewing.specialization}</div>
              </div>
              <Badge status={viewing.availability} />
            </div>
            <div className="summary-line"><span>Department</span><b>{viewing.department}</b></div>
            <div className="summary-line"><span>Experience</span><b>{viewing.experience} years</b></div>
            <div className="summary-line"><span>Phone</span><b>{viewing.phone}</b></div>
            <div className="summary-line"><span>Email</span><b>{viewing.email}</b></div>
            <div className="summary-line" style={{ borderBottom: 'none' }}><span>Consultation fee</span><b>₹{viewing.consultationFee}</b></div>
          </>
        )}
      </Modal>

      {/* ---------- Delete confirmation ---------- */}
      <Modal open={!!deleting} title="Remove doctor?" onClose={() => setDeleting(null)}>
        <p>Delete <b>{deleting?.name}</b> ({deleting?.id}) from the directory?</p>
        <div className="form-actions" style={{ marginTop: 18 }}>
          <button type="button" className="btn btn-ghost" onClick={() => setDeleting(null)}>Keep</button>
          <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete permanently</button>
        </div>
      </Modal>
    </>
  );
}
