// ============================================================
// client/src/pages/modules/DepartmentsPage.jsx
// Department directory with doctor counts. Admin can add or
// delete departments; each card lists its doctors.
// ============================================================

import { useState } from 'react';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal';
import { PageHead, Avatar, Badge } from '../../components/ui';
import { useToast } from '../../components/Toast';
import {
  getData, addData, deleteData, STORAGE_KEYS,
} from '../../services/storage';
import { required, validateForm } from '../../utils/validation';

const ICON_CHOICES = ['heart', 'brain', 'bone', 'baby', 'sparkle', 'stethoscope', 'flower', 'ear', 'siren', 'scan'];

export default function DepartmentsPage() {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState(() => getData(STORAGE_KEYS.departments));
  const [doctors] = useState(() => getData(STORAGE_KEYS.doctors));
  const [modalOpen, setModalOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: 'stethoscope' });
  const [errors, setErrors] = useState({});

  function refresh() {
    setDepartments(getData(STORAGE_KEYS.departments));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = validateForm(form, {
      name: (v) => required(v, 'Name'),
      description: (v) => required(v, 'Description'),
    });
    setErrors(result.errors);
    if (!result.isValid) return;

    addData(STORAGE_KEYS.departments, form);
    showToast(`Department "${form.name}" created`);
    refresh();
    setModalOpen(false);
    setForm({ name: '', description: '', icon: 'stethoscope' });
  }

  function confirmDelete() {
    deleteData(STORAGE_KEYS.departments, deleting.id);
    showToast(`Deleted ${deleting.name}`, 'info');
    setDeleting(null);
    refresh();
  }

  return (
    <>
      <PageHead title="Departments" subtitle={`${departments.length} departments`}>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
          <Icon name="plus" size={16} /> Add Department
        </button>
      </PageHead>

      <div className="dept-grid">
        {departments.map((dep) => {
          const deptDoctors = doctors.filter((d) => d.department === dep.name);
          return (
            <article className="dept-card" key={dep.id}>
              <span className="dp-icon" style={{ background: 'var(--green-50)', color: 'var(--green-700)' }}>
                <Icon name={dep.icon} size={22} />
              </span>
              <h3>{dep.name}</h3>
              <p>{dep.description}</p>

              {/* Doctor chips */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {deptDoctors.slice(0, 3).map((d) => (
                  <span key={d.id} className="badge badge-gray">
                    <Avatar name={d.name} size={18} /> {d.name.replace('Dr. ', '')}
                  </span>
                ))}
                {deptDoctors.length > 3 && (
                  <span className="badge badge-gray">+{deptDoctors.length - 3}</span>
                )}
                {deptDoctors.length === 0 && <span className="small muted">No doctors assigned</span>}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <button type="button" className="learn-more" onClick={() => setViewing({ ...dep, deptDoctors })}>
                  View Department <Icon name="arrowRight" size={15} />
                </button>
                {deptDoctors.length === 0 && (
                  <button type="button" className="icon-btn danger" title="Delete department" onClick={() => setDeleting(dep)}>
                    <Icon name="trash" size={15} />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* ---------- Add modal ---------- */}
      <Modal open={modalOpen} title="Add Department" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label>Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Oncology" />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
          <div className="field">
            <label>Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {errors.description && <div className="error-text">{errors.description}</div>}
          </div>
          <div className="field">
            <label>Icon</label>
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
              {ICON_CHOICES.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create</button>
          </div>
        </form>
      </Modal>

      {/* ---------- View ---------- */}
      <Modal open={!!viewing} title={`${viewing?.name || ''} Department`} onClose={() => setViewing(null)}>
        {viewing && (
          <>
            <p className="muted">{viewing.description}</p>
            <h4 style={{ margin: '14px 0 6px' }}>Doctors ({viewing.deptDoctors.length})</h4>
            {viewing.deptDoctors.map((d) => (
              <div className="list-row" style={{ padding: '9px 0' }} key={d.id}>
                <Avatar name={d.name} size={30} />
                <div className="lr-main">
                  <div className="lr-title">{d.name}</div>
                  <div className="lr-sub">{d.specialization}</div>
                </div>
                <Badge status={d.availability} />
              </div>
            ))}
            {viewing.deptDoctors.length === 0 && <p className="small muted">No doctors assigned to this department yet.</p>}
          </>
        )}
      </Modal>

      {/* ---------- Delete confirm ---------- */}
      <Modal open={!!deleting} title="Delete department?" onClose={() => setDeleting(null)}>
        <p>Delete <b>{deleting?.name}</b>? Departments with doctors assigned cannot be deleted.</p>
        <div className="form-actions" style={{ marginTop: 18 }}>
          <button type="button" className="btn btn-ghost" onClick={() => setDeleting(null)}>Keep</button>
          <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
        </div>
      </Modal>
    </>
  );
}
