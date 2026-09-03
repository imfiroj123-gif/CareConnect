// ============================================================
// client/src/pages/modules/BillingPage.jsx
// Invoices with dynamic line items. Totals are computed live
// from consultation + room + lab + medicine + other charges,
// minus discount. Mark bills Paid / Partial / Pending.
// Patient "My Bills" reuses this read-only.
// ============================================================

import { useMemo, useState } from 'react';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal';
import DataTable from '../../components/Table';
import { PageHead, Avatar, Badge, EmptyState, StatCard } from '../../components/ui';
import { useToast } from '../../components/Toast';
import {
  getData, addData, updateData, STORAGE_KEYS,
} from '../../services/storage';
import { required, numberError, validateForm } from '../../utils/validation';
import { formatCurrency, formatDate, billTotal, todayISO } from '../../utils/helpers';

const PAYMENT_STATUSES = ['Paid', 'Pending', 'Partial'];

const BLANK = () => ({
  patientId: '',
  date: todayISO(),
  items: [
    { label: 'Doctor Consultation', amount: '' },
    { label: 'Room Charges', amount: '' },
    { label: 'Laboratory Charges', amount: '' },
    { label: 'Medicine Charges', amount: '' },
  ],
  otherCharges: 0,
  discount: 0,
  paymentStatus: 'Pending',
});

export default function BillingPage({ readOnly = false }) {
  const { showToast } = useToast();

  const [bills, setBills] = useState(() => getData(STORAGE_KEYS.bills));
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [viewing, setViewing] = useState(null);

  const patients = getData(STORAGE_KEYS.patients);

  function refresh() {
    setBills(getData(STORAGE_KEYS.bills));
  }

  /** Bills enriched with a computed total for display/sorting. */
  const enriched = bills.map((b) => ({ ...b, total: billTotal(b) }));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return enriched;
    return enriched.filter((b) => `${b.patientName} ${b.id}`.toLowerCase().includes(q));
  }, [enriched, query]);

  const revenue = enriched.filter((b) => b.paymentStatus === 'Paid').reduce((s, b) => s + b.total, 0);
  const outstanding = enriched.filter((b) => b.paymentStatus !== 'Paid').reduce((s, b) => s + b.total, 0);

  /* ---------- Create bill ---------- */
  function handleSubmit(e) {
    e.preventDefault();
    const patient = patients.find((p) => p.id === form.patientId);

    const result = validateForm(form, {
      patientId: (v) => required(v, 'Patient'),
      date: (v) => required(v, 'Date'),
    });
    if (!patient) result.errors.patientId = 'Patient is required';

    // At least the first line item needs an amount > 0.
    if (!Number(form.items[0].amount)) {
      result.errors.items = 'Enter at least a consultation amount';
    }
    setErrors(result.errors);
    if (Object.keys(result.errors).length || !result.isValid) return;

    addData(STORAGE_KEYS.bills, {
      ...form,
      patientName: patient.name,
      otherCharges: Number(form.otherCharges) || 0,
      discount: Number(form.discount) || 0,
    });
    showToast(`Invoice created for ${patient.name}`);
    refresh();
    setModalOpen(false);
    setForm(BLANK());
  }

  /** Change payment status inline. */
  function markStatus(bill, status) {
    updateData(STORAGE_KEYS.bills, bill.id, { paymentStatus: status });
    showToast(`${bill.id} marked ${status}`, status === 'Pending' ? 'info' : 'success');
    refresh();
  }

  /* ---------- Line item helpers ---------- */
  function setItemAmount(index, value) {
    const items = form.items.map((it, i) => (i === index ? { ...it, amount: value } : it));
    setForm({ ...form, items });
  }

  const draftTotal = billTotal({
    items: form.items.map((it) => ({ ...it, amount: Number(it.amount) || 0 })),
    otherCharges: Number(form.otherCharges) || 0,
    discount: Number(form.discount) || 0,
  });

  const columns = [
    {
      key: 'id',
      label: 'Invoice',
      render: (row) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={row.patientName} size={32} />
          <span>
            <b>{row.id}</b>
            <div className="small muted">{formatDate(row.date)}</div>
          </span>
        </span>
      ),
    },
    { key: 'patientName', label: 'Patient' },
    { key: 'total', label: 'Total', render: (row) => <b>{formatCurrency(row.total)}</b> },
    { key: 'paymentStatus', label: 'Payment', render: (row) => <Badge status={row.paymentStatus} /> },
    ...(readOnly ? [] : [{
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <span className="row-actions">
          <button type="button" className="icon-btn" title="View invoice" onClick={() => setViewing(row)}>
            <Icon name="eye" size={16} />
          </button>
          {/* Quick payment actions */}
          {row.paymentStatus !== 'Paid' && (
            <button type="button" className="icon-btn" title="Mark fully paid" onClick={() => markStatus(row, 'Paid')}>
              <Icon name="check" size={16} />
            </button>
          )}
          {row.paymentStatus === 'Pending' && (
            <button type="button" className="icon-btn" title="Mark partial" onClick={() => markStatus(row, 'Partial')}>
              <Icon name="clock" size={16} />
            </button>
          )}
        </span>
      ),
    }]),
  ];

  return (
    <>
      <PageHead title={readOnly ? 'My Bills' : 'Billing'} subtitle={`${enriched.length} invoices`}>
        {!readOnly && (
          <div className="toolbar" style={{ marginBottom: 0 }}>
            <div className="search-box">
              <Icon name="search" size={15} />
              <input placeholder="Search invoice or patient…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => { setForm(BLANK()); setModalOpen(true); }}>
              <Icon name="plus" size={16} /> New Invoice
            </button>
          </div>
        )}
      </PageHead>

      {/* ---------- Summary ---------- */}
      {!readOnly && (
        <div className="stat-grid">
          <StatCard icon="money" label="Collected (Paid)" value={formatCurrency(revenue)} tone="green" />
          <StatCard icon="alert" label="Outstanding" value={formatCurrency(outstanding)} tone="red" danger={!!outstanding} />
          <StatCard icon="file" label="Total Invoices" value={enriched.length} tone="blue" />
        </div>
      )}

      <section className="panel">
        {filtered.length === 0
          ? <EmptyState icon="money" title="No invoices yet" hint={readOnly ? 'Bills will appear here' : 'Create an invoice to get started'} />
          : <DataTable columns={columns} rows={filtered} />}
      </section>

      {/* ---------- New invoice ---------- */}
      <Modal open={modalOpen} title="Create Invoice" onClose={() => setModalOpen(false)} wide>
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
              <label>Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              {errors.date && <div className="error-text">{errors.date}</div>}
            </div>
            <div className="field">
              <label>Payment status</label>
              <select value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}>
                {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* ---------- Dynamic line items ---------- */}
          {errors.items && <div className="error-text" style={{ marginBottom: 8 }}>{errors.items}</div>}
          {form.items.map((item, i) => (
            <div className="field" key={item.label}>
              <label>{item.label} (₹)</label>
              <input type="number" min="0" value={item.amount} onChange={(e) => setItemAmount(i, e.target.value)} placeholder="0" />
            </div>
          ))}

          <div className="form-grid">
            <div className="field">
              <label>Other charges (₹)</label>
              <input type="number" min="0" value={form.otherCharges} onChange={(e) => setForm({ ...form, otherCharges: e.target.value })} placeholder="0" />
            </div>
            <div className="field">
              <label>Discount (₹)</label>
              <input type="number" min="0" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="0" />
            </div>
          </div>

          {/* Live total preview */}
          <div style={{ background: 'var(--green-50)', borderRadius: 14, padding: '12px 18px' }}>
            <div className="summary-line"><span>Subtotal</span><b>{formatCurrency(draftTotal + Number(form.discount || 0))}</b></div>
            <div className="summary-line"><span>Discount</span><b>−{formatCurrency(Number(form.discount) || 0)}</b></div>
            <div className="summary-line" style={{ borderBottom: 'none' }}><b>Total payable</b><b style={{ color: 'var(--green-800)' }}>{formatCurrency(draftTotal)}</b></div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Invoice</button>
          </div>
        </form>
      </Modal>

      {/* ---------- Invoice view ---------- */}
      <Modal open={!!viewing} title={`Invoice ${viewing?.id || ''}`} onClose={() => setViewing(null)}>
        {viewing && (
          <>
            <p className="small muted">{viewing.patientName} · {formatDate(viewing.date)}</p>
            {viewing.items.map((item) => (
              <div className="summary-line" key={item.label}>
                <span>{item.label}</span><b>{formatCurrency(item.amount)}</b>
              </div>
            ))}
            <div className="summary-line"><span>Other charges</span><b>{formatCurrency(viewing.otherCharges)}</b></div>
            <div className="summary-line"><span>Discount</span><b>−{formatCurrency(viewing.discount)}</b></div>
            <div className="summary-line"><b>Total</b><b style={{ color: 'var(--green-800)' }}>{formatCurrency(billTotal(viewing))}</b></div>
            <div className="summary-line" style={{ borderBottom: 'none' }}><span>Payment status</span><Badge status={viewing.paymentStatus} /></div>

            {!readOnly && viewing.paymentStatus !== 'Paid' && (
              <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 14 }} onClick={() => { markStatus(viewing, 'Paid'); setViewing(null); }}>
                Mark as Paid
              </button>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
