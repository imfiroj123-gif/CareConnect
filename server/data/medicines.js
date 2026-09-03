// ============================================================
// server/data/medicines.js
// In-memory mock pharmacy inventory (NO database).
// ============================================================

const medicines = [
  { id: 'M-401', name: 'Paracetamol 500mg', category: 'Analgesic', quantity: 240, price: 25, expiryDate: '2027-06-30', supplier: 'MedLife Pharma' },
  { id: 'M-402', name: 'Amoxicillin 250mg', category: 'Antibiotic', quantity: 18, price: 120, expiryDate: '2026-11-30', supplier: 'CureWell Labs' },
  { id: 'M-403', name: 'Metformin 500mg', category: 'Antidiabetic', quantity: 95, price: 85, expiryDate: '2027-02-28', supplier: 'GlucoCare' },
  { id: 'M-404', name: 'Atorvastatin 10mg', category: 'Cardiac', quantity: 8, price: 140, expiryDate: '2027-08-31', supplier: 'HeartLine Pharma' },
  { id: 'M-405', name: 'Omeprazole 20mg', category: 'Gastro', quantity: 150, price: 95, expiryDate: '2027-01-31', supplier: 'MedLife Pharma' },
  { id: 'M-406', name: 'Cetirizine 10mg', category: 'Antihistamine', quantity: 200, price: 45, expiryDate: '2026-12-31', supplier: 'AllerFree' },
  { id: 'M-407', name: 'Salbutamol Inhaler', category: 'Respiratory', quantity: 12, price: 180, expiryDate: '2027-04-30', supplier: 'BreatheEasy' },
  { id: 'M-408', name: 'Insulin Glargine', category: 'Antidiabetic', quantity: 5, price: 450, expiryDate: '2026-09-30', supplier: 'GlucoCare' },
  { id: 'M-409', name: 'Azithromycin 500mg', category: 'Antibiotic', quantity: 60, price: 160, expiryDate: '2027-05-31', supplier: 'CureWell Labs' },
  { id: 'M-410', name: 'Vitamin D3 Capsules', category: 'Supplement', quantity: 110, price: 210, expiryDate: '2027-10-31', supplier: 'NutriPlus' },
];

module.exports = medicines;
