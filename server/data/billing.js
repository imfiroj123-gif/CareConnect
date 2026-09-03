// ============================================================
// server/data/billing.js
// In-memory mock billing records (NO database).
// paymentStatus: 'Paid' | 'Pending' | 'Partial'
// ============================================================

const bills = [
  {
    id: 'INV-601',
    patientId: 'P-1001',
    patientName: 'Ramesh Kumar',
    items: [
      { label: 'Doctor Consultation', amount: 800 },
      { label: 'Room Charges (2 days)', amount: 3000 },
      { label: 'Laboratory - Blood Test', amount: 450 },
      { label: 'Medicines', amount: 620 },
    ],
    otherCharges: 200,
    discount: 0,
    paymentStatus: 'Pending',
    date: '2026-08-20',
  },
  {
    id: 'INV-602',
    patientId: 'P-1004',
    patientName: 'Kavita Joshi',
    items: [
      { label: 'Doctor Consultation', amount: 800 },
      { label: 'Laboratory - ECG', amount: 500 },
    ],
    otherCharges: 0,
    discount: 130,
    paymentStatus: 'Paid',
    date: '2026-08-17',
  },
  {
    id: 'INV-603',
    patientId: 'P-1007',
    patientName: 'Daniel Fernandes',
    items: [
      { label: 'Doctor Consultation', amount: 600 },
      { label: 'X-Ray', amount: 900 },
      { label: 'Medicines', amount: 340 },
    ],
    otherCharges: 50,
    discount: 0,
    paymentStatus: 'Partial',
    date: '2026-08-19',
  },
];

module.exports = bills;
