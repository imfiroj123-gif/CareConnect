// ============================================================
// server/data/beds.js
// In-memory mock bed inventory (NO database).
// status: 'Available' | 'Occupied' | 'Reserved' | 'Cleaning'
// ============================================================

const beds = [
  // ---- General Ward (G) ----
  { id: 'B-G01', ward: 'General Ward', room: '101-A', status: 'Occupied', patientId: 'P-1001', patientName: 'Ramesh Kumar' },
  { id: 'B-G02', ward: 'General Ward', room: '101-B', status: 'Available' },
  { id: 'B-G03', ward: 'General Ward', room: '102-A', status: 'Available' },
  { id: 'B-G04', ward: 'General Ward', room: '102-B', status: 'Occupied', patientId: 'P-1006', patientName: 'Lakshmi Narayan' },
  { id: 'B-G05', ward: 'General Ward', room: '103-A', status: 'Cleaning' },
  { id: 'B-G06', ward: 'General Ward', room: '103-B', status: 'Available' },

  // ---- ICU (I) ----
  { id: 'B-I01', ward: 'ICU', room: 'ICU-1', status: 'Occupied', patientId: 'P-1006', patientName: 'Lakshmi Narayan' },
  { id: 'B-I02', ward: 'ICU', room: 'ICU-2', status: 'Available' },
  { id: 'B-I03', ward: 'ICU', room: 'ICU-3', status: 'Reserved' },
  { id: 'B-I04', ward: 'ICU', room: 'ICU-4', status: 'Available' },

  // ---- Emergency (E) ----
  { id: 'B-E01', ward: 'Emergency', room: 'ER-1', status: 'Occupied', patientId: 'P-1009', patientName: 'Vikas Chauhan' },
  { id: 'B-E02', ward: 'Emergency', room: 'ER-2', status: 'Available' },
  { id: 'B-E03', ward: 'Emergency', room: 'ER-3', status: 'Available' },
  { id: 'B-E04', ward: 'Emergency', room: 'ER-4', status: 'Reserved' },

  // ---- Private Room (P) ----
  { id: 'B-P01', ward: 'Private Room', room: '201', status: 'Available' },
  { id: 'B-P02', ward: 'Private Room', room: '202', status: 'Occupied', patientId: 'P-1006', patientName: 'Lakshmi Narayan' },
  { id: 'B-P03', ward: 'Private Room', room: '203', status: 'Available' },
  { id: 'B-P04', ward: 'Private Room', room: '204', status: 'Available' },

  // ---- Semi-Private (S) ----
  { id: 'B-S01', ward: 'Semi-Private', room: '301-A', status: 'Available' },
  { id: 'B-S02', ward: 'Semi-Private', room: '301-B', status: 'Available' },
  { id: 'B-S03', ward: 'Semi-Private', room: '302-A', status: 'Occupied', patientId: 'P-1002', patientName: 'Sunita Devi' },
  { id: 'B-S04', ward: 'Semi-Private', room: '302-B', status: 'Available' },
];

module.exports = beds;
