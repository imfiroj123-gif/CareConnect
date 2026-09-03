// ============================================================
// client/src/utils/helpers.js
// Small shared helpers used across the app.
// ============================================================

/** Format a number as Indian Rupees, e.g. 12500 -> ₹12,500 */
export function formatCurrency(amount) {
  const n = Number(amount) || 0;
  return `₹${n.toLocaleString('en-IN')}`;
}

/**
 * Format an ISO date string (or yyyy-mm-dd) as "24 Aug 2026".
 * Returns the raw value when parsing fails.
 */
export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Format "HH:mm" (24h) as "10:00 AM". */
export function formatTime(hhmm) {
  if (!hhmm) return '—';
  const [hStr, m] = hhmm.split(':');
  let h = parseInt(hStr, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${suffix}`;
}

/** Today's date as yyyy-mm-dd (used for date inputs). */
export function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Initials from a name: "Ramesh Kumar" -> "RK" */
export function initials(name = '') {
  return name
    .replace(/^Dr\.\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

/** Deterministic pastel-ish avatar background from any string. */
const AVATAR_COLORS = ['#16a34a', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6', '#ec4899'];
export function avatarColor(seed = '') {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 9973;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/** Compute a bill total from its line items + other charges - discount. */
export function billTotal(bill) {
  const items = (bill.items || []).reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
  const other = Number(bill.otherCharges) || 0;
  const discount = Number(bill.discount) || 0;
  return items + other - discount;
}

/** Map any status string to a badge color class. */
export function statusBadge(status = '') {
  const s = status.toLowerCase();
  if (['confirmed', 'available', 'paid', 'completed', 'admitted', 'resolved'].includes(s)) return 'badge-green';
  if (['pending', 'partial', 'processing', 'reserved', 'cleaning'].includes(s)) return 'badge-amber';
  if (['cancelled', 'critical', 'urgent', 'occupied', 'out of stock'].includes(s)) return 'badge-red';
  if (['requested', 'in surgery', 'low stock', 'on leave'].includes(s)) return 'badge-blue';
  return 'badge-gray';
}

/** Debounce — keeps search inputs snappy. */
export function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
