// ============================================================
// client/src/pages/modules/PharmacyPage.jsx
// Medicine inventory: add / edit / delete / search, low-stock
// warnings (qty <= 20) and expiry tracking.
// ============================================================

import { useMemo, useState } from 'react';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal';
import DataTable from '../../components/Table';
import { PageHead, StatCard, Badge, EmptyState } from '../../components/ui';
import { useToast } from '../../components/Toast';
import {
  getData, addData, updateData, deleteData, STORAGE_KEYS,
} from '../../services/storage';
import {
  required, numberError, validateForm,
} from '../../utils/validation';
import { formatCurrency } from '../../utils/helpers';

const BLANK = { name: '', category: '', quantity: '', price: '', expiryDate: '', supplier: '' };

const CATEGORIES = ['Analgesic', 'Antibiotic', 'Antidiabetic', 'Cardiac', 'Gastro', 'Antihistamine', 'Respiratory', 'Supplement'];

/** Stock level badge logic. */
function stockBadge(qty) {
  if (qty <= 5) return <Badge status="Out of stock" />;
  if (qty <= 20) return <Badge status="Low stock" />;
  return <Badge status="In stock" />;
}

export default function PharmacyPage() {
  const { showToast } = useToast();

  const [medicines, setMedicines] = useState(() => getData(STORAGE_KEYS.medicines));
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [deleting, setDeleting] = useState(null);

  function refresh() {
    setMedicines(getData(STORAGE_KEYS.medicines));
  }

  const categories = [...new Set(medicines.map((m) => m.category))];
  const lowStock = medicines.filter((m) => m.quantity <= 20);
  const inventoryValue = medicines.reduce((s, m) => s + m.quantity * m.price, 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return medicines.filter((m) => {
      const matchQ = !q || `${m.name} ${m.id} ${m.supplier}`.toLowerCase().includes(q);
      const matchC = !catFilter || m.category === catFilter;
      return matchQ && matchC;
    });
  }, [medicines, query, catFilter]);

  /* ---------- CRUD ---------- */
  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function openCreate() {
    setForm(BLANK); setEditingId(null); setErrors({});
    setModalOpen(true);
  }
  function openEdit(med) {
    setForm({ ...med }); setEditingId(med.id); setErrors({});
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = validateForm(form, {
      name: (v) => required(v, 'Medicine name'),
      category: (v) => required(v, 'Category'),
      quantity: (v) => numberError(v, 'Quantity', { min: 0 }),
      price: (v) => numberError(v, 'Price', { min: 0 }),
      expiryDate: (v) => required(v, 'Expiry date'),
      supplier: (v) => required(v, 'Supplier'),
    });
    setErrors(result.errors);
    if (!result.isValid) return;

    if (editingId) {
      updateData(STORAGE_KEYS.medicines, editingId, form);
      showToast('Medicine updated');
    } else {
      addData(STORAGE_KEYS.medicines, form);
      showToast('Medicine added to inventory');
    }
    refresh();
    setModalOpen(false);
  }

  function confirmDelete() {
    deleteData(STORAGE_KEYS.medicines, deleting.id);
    showToast(`Removed ${deleting.name}`, 'info');
    setDeleting(null);
    refresh();
  }

  /** Restock shortcut: +50 units with one click. */
  function restock(med) {
    updateData(STORAGE_KEYS.medicines, med.id, { quantity: Number(med.quantity) + 50 });
    showToast(`${med.name}: restocked +50 units`);
    refresh();
  }

  const columns = [
    {
      key: 'name',
      label: 'Medicine',
      render: (row) => (
        <span>
          <b>{row.name}</b>
          <div className="small muted">{row.id} · {row.supplier}</div>
        </span>
      ),
    },
    { key: 'category', label: 'Category' },
    {
      key: 'quantity',
      label: 'Stock',
      render: (row) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <b>{row.quantity}</b> {stockBadge(Number(row.quantity))}
        </span>
      ),
    },
    { key: 'price', label: 'Price', render: (row) => formatCurrency(row.price) },
    { key: 'expiryDate', label: 'Expiry' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <span className="row-actions">
          {Number(row.quantity) <= 20 && (
            <button type="button" className="icon-btn" title="Restock +50" onClick={() => restock(row)}>
              <Icon name="plus" size={16} />
            </button>
          )}
          <button type="button" className="icon-btn" title="Edit" onClick={() => openEdit(row)}><Icon name="edit" size={16} /></button>
          <button type="button" className="icon-btn danger" title="Delete" onClick={() => setDeleting(row)}><Icon name="trash" size={16} /></button>
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHead title="Pharmacy Inventory" subtitle={`${medicines.length} medicines in stock`}>
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <div className="search-box">
            <Icon name="search" size={15} />
            <input placeholder="Search medicine or supplier…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select className="filter-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
            <Icon name="plus" size={16} /> Add Medicine
          </button>
        </div>
      </PageHead>

      {/* ---------- Summary ---------- */}
      <div className="stat-grid">
        <StatCard icon="pill" label="Total Medicines" value={medicines.length} tone="blue" />
        <StatCard icon="alert" label={`Low Stock (${lowStock.length})`} value={lowStock.length ? lowStock.map((m) => m.name.split(' ')[0]).join(', ') : 'None'} tone="amber" danger={!!lowStock.length} />
        <StatCard icon="money" label="Inventory Value" value={formatCurrency(inventoryValue)} tone="green" />
      </div>

      <section className="panel">
        {filtered.length === 0
          ? <EmptyState icon="pill" title="No medicines found" hint="Adjust filters or add a new medicine" />
          : <DataTable columns={columns} rows={filtered} />}
      </section>

      {/* ---------- Add / Edit ---------- */}
      <Modal open={modalOpen} title={editingId ? 'Edit Medicine' : 'Add Medicine'} onClose={() => setModalOpen(false)} wide>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="field">
              <label>Medicine name *</label>
              <input value={form.name} onChange={setField('name')} placeholder="e.g. Paracetamol 500mg" />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>
            <div className="field">
              <label>Category *</label>
              <select value={form.category} onChange={setField('category')}>
                <option value="">Select…</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.category && <div className="error-text">{errors.category}</div>}
            </div>
            <div className="field">
              <label>Quantity *</label>
              <input type="number" min="0" value={form.quantity} onChange={setField('quantity')} />
              {errors.quantity && <div className="error-text">{errors.quantity}</div>}
            </div>
            <div className="field">
              <label>Price per unit (₹) *</label>
              <input type="number" min="0" value={form.price} onChange={setField('price')} />
              {errors.price && <div className="error-text">{errors.price}</div>}
            </div>
            <div className="field">
              <label>Expiry date *</label>
              <input type="date" value={form.expiryDate} onChange={setField('expiryDate')} />
              {errors.expiryDate && <div className="error-text">{errors.expiryDate}</div>}
            </div>
            <div className="field">
              <label>Supplier *</label>
              <input value={form.supplier} onChange={setField('supplier')} />
              {errors.supplier && <div className="error-text">{errors.supplier}</div>}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Add Medicine'}</button>
          </div>
        </form>
      </Modal>

      {/* ---------- Delete confirm ---------- */}
      <Modal open={!!deleting} title="Remove medicine?" onClose={() => setDeleting(null)}>
        <p>Delete <b>{deleting?.name}</b> ({deleting?.id}) from the inventory?</p>
        <div className="form-actions" style={{ marginTop: 18 }}>
          <button type="button" className="btn btn-ghost" onClick={() => setDeleting(null)}>Keep</button>
          <button type="button" className="btn btn-danger" onClick={confirmDelete}>Remove</button>
        </div>
      </Modal>
    </>
  );
}
