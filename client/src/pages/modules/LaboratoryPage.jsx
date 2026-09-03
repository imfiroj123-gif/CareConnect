// ============================================================
// client/src/pages/modules/LaboratoryPage.jsx
// Lab test requests: create (assign patient + doctor + test
// type), advance status Requested → Processing → Completed and
// record result summaries. Doctor view is read-only.
// ============================================================

import { useMemo, useState } from 'react';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal';
import DataTable from '../../components/Table';
import { PageHead, Avatar, Badge, EmptyState } from '../../components/ui';
import { useToast } from '../../components/Toast';
import {
  getData, addData, updateData, STORAGE_KEYS,
} from '../../services/storage';
import { required, validateForm } from '../../utils/validation';
import { formatDate, todayISO } from '../../utils/helpers';
import { LAB_TEST_TYPES } from '../../data/mockData';

const STATUSES = ['Requested', 'Processing', 'Completed'];
const BLANK = { patientId: '', doctorName: '', testType: '', date: '', status: 'Requested', resultSummary: '' };

export default function LaboratoryPage({ readOnly = false }) {
  const { showToast } = useToast();

  const [tests, setTests] = useState(() => getData(STORAGE_KEYS.labTests));
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [resultFor, setResultFor] = useState(null); // test getting a result entry

  const patients = getData(STORAGE_KEYS.patients);
  const doctors = getData(STORAGE_KEYS.doctors);

  function refresh() {
    setTests(getData(STORAGE_KEYS.labTests));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tests.filter((t) => {
      const matchQ = !q || `${t.patientName} ${t.testType} ${t.doctorName}`.toLowerCase().includes(q);
      const matchS = !statusFilter || t.status === statusFilter;
      return matchQ && matchS;
    });
  }, [tests, query, statusFilter]);

  /* ---------- Create request ---------- */
  function handleSubmit(e) {
    e.preventDefault();
    const patient = patients.find((p) => p.id === form.patientId);

    const result = validateForm(form, {
      patientId: (v) => required(v, 'Patient'),
      doctorName: (v) => required(v, 'Doctor'),
      testType: (v) => required(v, 'Test type'),
      date: (v) => required(v, 'Date'),
    });
    setErrors(result.errors);
    if (!result.isValid) return;

    addData(STORAGE_KEYS.labTests, {
      ...form,
      patientName: patient?.name,
    });
    showToast(`${form.testType} requested for ${patient?.name}`);
    refresh();
    setModalOpen(false);
    setForm(BLANK);
  }

  /** Advance to the next stage in the pipeline. */
  function advance(test) {
    const next = test.status === 'Requested' ? 'Processing' : 'Completed';
    updateData(STORAGE_KEYS.labTests, test.id, { status: next });
    showToast(`${test.patientName}'s ${test.testType}: ${next}`);
    refresh();
  }

  /** Save the typed-in result summary. */
  function saveResult() {
    if (!resultFor.resultSummary.trim()) {
      showToast('Please enter the result summary first', 'error');
      return;
    }
    updateData(STORAGE_KEYS.labTests, resultFor.id, {
      resultSummary: resultFor.resultSummary,
      status: 'Completed',
    });
    showToast(`Result saved for ${resultFor.patientName}`);
    setResultFor(null);
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
    { key: 'testType', label: 'Test' },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
    { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} /> },
    ...(readOnly ? [] : [{
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <span className="row-actions">
          <button type="button" className="icon-btn" title="View / edit result" onClick={() => setResultFor(row)}>
            <Icon name="eye" size={16} />
          </button>
          {/* Advance pipeline until completed */}
          {row.status !== 'Completed' && (
            <button type="button" className="icon-btn" title={`Mark ${row.status === 'Requested' ? 'processing' : 'completed'}`} onClick={() => advance(row)}>
              <Icon name="check" size={16} />
            </button>
          )}
        </span>
      ),
    }]),
  ];

  return (
    <>
      <PageHead title={readOnly ? 'Lab Reports' : 'Laboratory'} subtitle={`${filtered.length} test requests`}>
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <div className="search-box">
            <Icon name="search" size={15} />
            <input placeholder="Search patient or test…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {!readOnly && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => { setForm({ ...BLANK, date: todayISO() }); setModalOpen(true); }}>
              <Icon name="plus" size={16} /> New Test Request
            </button>
          )}
        </div>
      </PageHead>

      <section className="panel">
        {filtered.length === 0
          ? <EmptyState icon="flask" title="No lab tests found" hint="Create a test request to begin" />
          : <DataTable columns={columns} rows={filtered} />}
      </section>

      {/* ---------- Create request ---------- */}
      <Modal open={modalOpen} title="New Lab Test Request" onClose={() => setModalOpen(false)} wide>
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
              <select value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })}>
                <option value="">Select doctor…</option>
                {doctors.map((d) => <option key={d.id}>{d.name}</option>)}
              </select>
              {errors.doctorName && <div className="error-text">{errors.doctorName}</div>}
            </div>
            <div className="field">
              <label>Test type *</label>
              <select value={form.testType} onChange={(e) => setForm({ ...form, testType: e.target.value })}>
                <option value="">Select test…</option>
                {LAB_TEST_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              {errors.testType && <div className="error-text">{errors.testType}</div>}
            </div>
            <div className="field">
              <label>Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              {errors.date && <div className="error-text">{errors.date}</div>}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Request</button>
          </div>
        </form>
      </Modal>

      {/* ---------- Result viewer / editor ---------- */}
      <Modal open={!!resultFor} title={`${resultFor?.testType || ''} — Result`} onClose={() => setResultFor(null)}>
        {resultFor && (
          <>
            <p className="small muted">
              {resultFor.patientName} · ordered by {resultFor.doctorName} on {formatDate(resultFor.date)}
            </p>
            <Badge status={resultFor.status} />

            <div className="field" style={{ marginTop: 14 }}>
              <label>Result summary</label>
              <textarea
                value={resultFor.resultSummary}
                readOnly={false}
                onChange={(e) => setResultFor({ ...resultFor, resultSummary: e.target.value })}
                placeholder="Findings, values and remarks…"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setResultFor(null)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={saveResult}>Save & Complete</button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
