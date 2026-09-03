// ============================================================
// client/src/pages/modules/BedsPage.jsx
// Visual bed board grouped by ward. Admin/receptionist can
// assign / release / reserve beds via a small action modal.
// ============================================================

import { useState } from 'react';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal';
import { PageHead, StatCard } from '../../components/ui';
import { useToast } from '../../components/Toast';
import {
  getData, updateData, STORAGE_KEYS,
} from '../../services/storage';

const WARDS = ['General Ward', 'ICU', 'Emergency', 'Private Room', 'Semi-Private'];

export default function BedsPage() {
  const { showToast } = useToast();

  const [beds, setBeds] = useState(() => getData(STORAGE_KEYS.beds));
  const [patients] = useState(() => getData(STORAGE_KEYS.patients));
  const [actionBed, setActionBed] = useState(null); // bed being managed
  const [form, setForm] = useState({ status: 'Available', patientId: '' });

  function refresh() {
    setBeds(getData(STORAGE_KEYS.beds));
  }

  const counts = {
    total: beds.length,
    available: beds.filter((b) => b.status === 'Available').length,
    occupied: beds.filter((b) => b.status === 'Occupied').length,
    reserved: beds.filter((b) => b.status === 'Reserved').length,
    cleaning: beds.filter((b) => b.status === 'Cleaning').length,
  };

  function openManage(bed) {
    setActionBed(bed);
    setForm({
      status: bed.status === 'Available' || bed.status === 'Cleaning' ? 'Occupied' : 'Available',
      patientId: bed.patientId || '',
    });
  }

  function applyAction() {
    let patch;
    if (form.status === 'Available') {
      patch = { status: 'Available', patientId: '', patientName: '' };
    } else if (form.status === 'Reserved') {
      patch = { status: 'Reserved', patientId: form.patientId || null, patientName: patients.find((p) => p.id === form.patientId)?.name || '' };
    } else {
      // Occupied requires a patient.
      const selected = patients.find((p) => p.id === form.patientId);
      if (!selected) {
        showToast('Pick a patient to assign this bed', 'error');
        return;
      }
      patch = { status: 'Occupied', patientId: selected.id, patientName: selected.name };
    }

    updateData(STORAGE_KEYS.beds, actionBed.id, patch);
    showToast(`${actionBed.id}: ${patch.status}`);
    setActionBed(null);
    refresh();
  }

  return (
    <>
      <PageHead title="Bed Management" subtitle="Live bed board across all wards" />

      {/* ---------- Summary cards ---------- */}
      <div className="stat-grid">
        <StatCard icon="bed" label="Total Beds" value={counts.total} tone="blue" />
        <StatCard icon="check" label="Available" value={counts.available} tone="green" />
        <StatCard icon="user" label="Occupied" value={counts.occupied} tone="red" />
        <StatCard icon="clock" label="Reserved" value={counts.reserved} tone="amber" />
        <StatCard icon="activity" label="Cleaning" value={counts.cleaning} tone="violet" />
      </div>

      {/* ---------- Bed grid per ward ---------- */}
      {WARDS.map((ward) => {
        const wardBeds = beds.filter((b) => b.ward === ward);
        if (!wardBeds.length) return null;

        return (
          <section className="panel" key={ward} style={{ marginBottom: 20 }}>
            <div className="panel-head">
              <h2>{ward}</h2>
              <span className="small muted">
                {wardBeds.filter((b) => b.status === 'Available').length} free of {wardBeds.length}
              </span>
            </div>
            <div style={{ padding: 18 }}>
              <div className="bed-grid">
                {wardBeds.map((bed) => (
                  <button
                    key={bed.id}
                    type="button"
                    className={`bed-card bed-${bed.status.toLowerCase()}`}
                    onClick={() => openManage(bed)}
                    title={`${bed.id} — ${bed.status}. Click to manage.`}
                  >
                    <div className="flex-between">
                      <span className="bed-id">{bed.room}</span>
                      <Icon name="bed" size={15} />
                    </div>
                    <div className="bed-room">{bed.id}</div>
                    <div className="bed-patient">
                      {bed.patientName || bed.status}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }} className="small muted">
        <span><i style={{ display: 'inline-block', width: 11, height: 11, borderRadius: 4, background: 'var(--green-500)', marginRight: 6 }} />Available</span>
        <span><i style={{ display: 'inline-block', width: 11, height: 11, borderRadius: 4, background: '#ef4444', marginRight: 6 }} />Occupied</span>
        <span><i style={{ display: 'inline-block', width: 11, height: 11, borderRadius: 4, background: '#f59e0b', marginRight: 6 }} />Reserved</span>
        <span><i style={{ display: 'inline-block', width: 11, height: 11, borderRadius: 4, background: '#3b82f6', marginRight: 6 }} />Cleaning</span>
        <span>· Click any bed to assign / release / reserve.</span>
      </div>

      {/* ---------- Manage modal ---------- */}
      <Modal open={!!actionBed} title={`Manage ${actionBed?.id}`} onClose={() => setActionBed(null)}>
        {actionBed && (
          <>
            <p className="muted small">{actionBed.ward} · Room {actionBed.room}</p>

            <div className="field" style={{ marginTop: 14 }}>
              <label>New status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Occupied">Assign (occupied)</option>
                <option value="Reserved">Reserve</option>
                <option value="Available">Release (available)</option>
              </select>
            </div>

            {form.status !== 'Available' && (
              <div className="field">
                <label>{form.status === 'Reserved' ? 'Reserve for patient (optional)' : 'Assign to patient *'}</label>
                <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
                  <option value="">Select patient…</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setActionBed(null)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={applyAction}>Apply</button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
