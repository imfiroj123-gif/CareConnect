// ============================================================
// server/data/laboratory.js
// In-memory mock lab test requests (NO database).
// status: 'Requested' | 'Processing' | 'Completed'
// ============================================================

const labTests = [
  {
    id: 'L-501',
    patientId: 'P-1001',
    patientName: 'Ramesh Kumar',
    doctorName: 'Dr. Ayesha Sharma',
    testType: 'Blood Test',
    date: '2026-08-20',
    status: 'Completed',
    resultSummary: 'Hemoglobin 13.2 g/dL, cholesterol slightly elevated (210 mg/dL). All other values within normal range.',
  },
  {
    id: 'L-502',
    patientId: 'P-1003',
    patientName: 'Arjun Patel',
    doctorName: 'Dr. Rahul Verma',
    testType: 'MRI',
    date: '2026-08-21',
    status: 'Processing',
    resultSummary: '',
  },
  {
    id: 'L-503',
    patientId: 'P-1005',
    patientName: 'Mohammed Ali',
    doctorName: 'Dr. Sanjay Kulkarni',
    testType: 'Blood Test',
    date: '2026-08-22',
    status: 'Requested',
    resultSummary: '',
  },
  {
    id: 'L-504',
    patientId: 'P-1007',
    patientName: 'Daniel Fernandes',
    doctorName: 'Dr. Priya Singh',
    testType: 'X-Ray',
    date: '2026-08-19',
    status: 'Completed',
    resultSummary: 'No fracture detected. Mild soft tissue swelling noted on left forearm.',
  },
  {
    id: 'L-505',
    patientId: 'P-1008',
    patientName: 'Ananya Reddy',
    doctorName: 'Dr. Neha Gupta',
    testType: 'ECG',
    date: '2026-08-23',
    status: 'Requested',
    resultSummary: '',
  },
];

module.exports = labTests;
