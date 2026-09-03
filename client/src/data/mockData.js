// ============================================================
// client/src/data/mockData.js
// Seed data for the frontend demo. On first load this data is
// written to localStorage; afterwards the app reads/writes
// localStorage so changes survive refreshes.
// NO DATABASE is used anywhere — just localStorage + arrays.
// ============================================================

export const seedPatients = [
  {
    id: 'P-1001', name: 'Ramesh Kumar', age: 45, gender: 'Male',
    phone: '+91 98765 43210', email: 'ramesh.kumar@example.com',
    address: '12 Rose Villa, MG Road, Pune', bloodGroup: 'B+',
    emergencyContact: '+91 91234 56780', doctor: 'Dr. Ayesha Sharma',
    department: 'Cardiology', admissionStatus: 'Admitted',
    createdAt: '2026-07-02T09:15:00.000Z',
  },
  {
    id: 'P-1002', name: 'Sunita Devi', age: 32, gender: 'Female',
    phone: '+91 99887 76655', email: 'sunita.devi@example.com',
    address: '44 Lake View Apartments, Jaipur', bloodGroup: 'O+',
    emergencyContact: '+91 90123 45678', doctor: 'Dr. Meera Iyer',
    department: 'Gynecology', admissionStatus: 'Outpatient',
    createdAt: '2026-07-05T11:30:00.000Z',
  },
  {
    id: 'P-1003', name: 'Arjun Patel', age: 28, gender: 'Male',
    phone: '+91 97654 32109', email: 'arjun.patel@example.com',
    address: '7 Sunrise Enclave, Ahmedabad', bloodGroup: 'A+',
    emergencyContact: '+91 98200 11223', doctor: 'Dr. Rahul Verma',
    department: 'Neurology', admissionStatus: 'Outpatient',
    createdAt: '2026-07-08T14:20:00.000Z',
  },
  {
    id: 'P-1004', name: 'Kavita Joshi', age: 51, gender: 'Female',
    phone: '+91 93456 78120', email: 'kavita.joshi@example.com',
    address: 'Plot 19, Sector 21, Navi Mumbai', bloodGroup: 'AB+',
    emergencyContact: '+91 93450 99881', doctor: 'Dr. Ayesha Sharma',
    department: 'Cardiology', admissionStatus: 'Discharged',
    createdAt: '2026-06-18T10:05:00.000Z',
  },
  {
    id: 'P-1005', name: 'Mohammed Ali', age: 8, gender: 'Male',
    phone: '+91 90011 22334', email: 'ali.family@example.com',
    address: '3 Green Park Colony, Hyderabad', bloodGroup: 'B-',
    emergencyContact: '+91 90011 55667', doctor: 'Dr. Sanjay Kulkarni',
    department: 'Pediatrics', admissionStatus: 'Outpatient',
    createdAt: '2026-07-12T16:40:00.000Z',
  },
  {
    id: 'P-1006', name: 'Lakshmi Narayan', age: 63, gender: 'Female',
    phone: '+91 94455 66778', email: 'lakshmi.n@example.com',
    address: '88 Temple Street, Chennai', bloodGroup: 'O-',
    emergencyContact: '+91 94455 12121', doctor: 'Dr. Vikram Rao',
    department: 'Orthopedics', admissionStatus: 'Admitted',
    createdAt: '2026-07-01T08:50:00.000Z',
  },
  {
    id: 'P-1007', name: 'Daniel Fernandes', age: 37, gender: 'Male',
    phone: '+91 98230 45671', email: 'daniel.f@example.com',
    address: '5 Hill Road, Bandra, Mumbai', bloodGroup: 'A-',
    emergencyContact: '+91 98230 88899', doctor: 'Dr. Priya Singh',
    department: 'Dermatology', admissionStatus: 'Outpatient',
    createdAt: '2026-07-15T13:10:00.000Z',
  },
  {
    id: 'P-1008', name: 'Ananya Reddy', age: 24, gender: 'Female',
    phone: '+91 97010 20304', email: 'ananya.reddy@example.com',
    address: '21 Jubilee Hills, Hyderabad', bloodGroup: 'A+',
    emergencyContact: '+91 97010 60708', doctor: 'Dr. Neha Gupta',
    department: 'ENT', admissionStatus: 'Outpatient',
    createdAt: '2026-07-18T09:35:00.000Z',
  },
];

export const seedDoctors = [
  { id: 'D-201', name: 'Dr. Ayesha Sharma', specialization: 'Cardiologist', department: 'Cardiology', experience: 10, phone: '+91 98111 22334', email: 'ayesha.sharma@careconnect.com', availability: 'Available', consultationFee: 800 },
  { id: 'D-202', name: 'Dr. Rahul Verma', specialization: 'Neurologist', department: 'Neurology', experience: 8, phone: '+91 98222 33445', email: 'rahul.verma@careconnect.com', availability: 'Available', consultationFee: 1000 },
  { id: 'D-203', name: 'Dr. Priya Singh', specialization: 'Dermatologist', department: 'Dermatology', experience: 6, phone: '+91 98333 44556', email: 'priya.singh@careconnect.com', availability: 'On Leave', consultationFee: 600 },
  { id: 'D-204', name: 'Dr. Sanjay Kulkarni', specialization: 'Pediatrician', department: 'Pediatrics', experience: 12, phone: '+91 98444 55667', email: 'sanjay.kulkarni@careconnect.com', availability: 'Available', consultationFee: 700 },
  { id: 'D-205', name: 'Dr. Meera Iyer', specialization: 'Gynecologist', department: 'Gynecology', experience: 9, phone: '+91 98555 66778', email: 'meera.iyer@careconnect.com', availability: 'Available', consultationFee: 900 },
  { id: 'D-206', name: 'Dr. Vikram Rao', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', experience: 15, phone: '+91 98666 77889', email: 'vikram.rao@careconnect.com', availability: 'In Surgery', consultationFee: 1200 },
  { id: 'D-207', name: 'Dr. Neha Gupta', specialization: 'ENT Specialist', department: 'ENT', experience: 7, phone: '+91 98777 88990', email: 'neha.gupta@careconnect.com', availability: 'Available', consultationFee: 650 },
  { id: 'D-208', name: 'Dr. Arjun Menon', specialization: 'General Physician', department: 'General Medicine', experience: 11, phone: '+91 98888 99001', email: 'arjun.menon@careconnect.com', availability: 'Available', consultationFee: 500 },
];

export const seedAppointments = [
  { id: 'A-3001', patientId: 'P-1001', patientName: 'Ramesh Kumar', doctorId: 'D-201', doctorName: 'Dr. Ayesha Sharma', department: 'Cardiology', date: '2026-08-24', time: '10:00', reason: 'Chest pain follow-up', status: 'Confirmed' },
  { id: 'A-3002', patientId: 'P-1003', patientName: 'Arjun Patel', doctorId: 'D-202', doctorName: 'Dr. Rahul Verma', department: 'Neurology', date: '2026-08-24', time: '11:30', reason: 'Recurring migraines', status: 'Pending' },
  { id: 'A-3003', patientId: 'P-1005', patientName: 'Mohammed Ali', doctorId: 'D-204', doctorName: 'Dr. Sanjay Kulkarni', department: 'Pediatrics', date: '2026-08-24', time: '12:00', reason: 'Fever for 3 days', status: 'Pending' },
  { id: 'A-3004', patientId: 'P-1007', patientName: 'Daniel Fernandes', doctorId: 'D-203', doctorName: 'Dr. Priya Singh', department: 'Dermatology', date: '2026-08-25', time: '09:30', reason: 'Skin allergy consultation', status: 'Confirmed' },
  { id: 'A-3005', patientId: 'P-1008', patientName: 'Ananya Reddy', doctorId: 'D-207', doctorName: 'Dr. Neha Gupta', department: 'ENT', date: '2026-08-26', time: '15:00', reason: 'Ear pain and hearing difficulty', status: 'Pending' },
  { id: 'A-3006', patientId: 'P-1002', patientName: 'Sunita Devi', doctorId: 'D-205', doctorName: 'Dr. Meera Iyer', department: 'Gynecology', date: '2026-08-27', time: '10:45', reason: 'Routine prenatal check-up', status: 'Confirmed' },
  { id: 'A-3007', patientId: 'P-1001', patientName: 'Ramesh Kumar', doctorId: 'D-201', doctorName: 'Dr. Ayesha Sharma', department: 'Cardiology', date: '2026-08-18', time: '09:15', reason: 'ECG review', status: 'Completed' },
  { id: 'A-3008', patientId: 'P-1004', patientName: 'Kavita Joshi', doctorId: 'D-201', doctorName: 'Dr. Ayesha Sharma', department: 'Cardiology', date: '2026-08-17', time: '13:00', reason: 'Blood pressure consultation', status: 'Cancelled' },
];

export const seedDepartments = [
  { id: 'DEP-1', name: 'Cardiology', description: 'Heart care, ECG, angiography and cardiac rehabilitation.', icon: 'heart' },
  { id: 'DEP-2', name: 'Neurology', description: 'Brain, spine and nervous system disorders.', icon: 'brain' },
  { id: 'DEP-3', name: 'Orthopedics', description: 'Bones, joints, fractures and sports injuries.', icon: 'bone' },
  { id: 'DEP-4', name: 'Pediatrics', description: 'Child health from newborn to adolescence.', icon: 'baby' },
  { id: 'DEP-5', name: 'Dermatology', description: 'Skin, hair and nail treatments.', icon: 'sparkle' },
  { id: 'DEP-6', name: 'General Medicine', description: 'Everyday illness, check-ups and preventive care.', icon: 'stethoscope' },
  { id: 'DEP-7', name: 'Gynecology', description: "Women's reproductive health and prenatal care.", icon: 'flower' },
  { id: 'DEP-8', name: 'ENT', description: 'Ear, nose and throat specialists.', icon: 'ear' },
  { id: 'DEP-9', name: 'Emergency', description: '24/7 emergency and trauma response unit.', icon: 'siren' },
  { id: 'DEP-10', name: 'Radiology', description: 'X-Ray, MRI, CT scans and imaging services.', icon: 'scan' },
];

export const seedBeds = [
  { id: 'B-G01', ward: 'General Ward', room: '101-A', status: 'Occupied', patientId: 'P-1001', patientName: 'Ramesh Kumar' },
  { id: 'B-G02', ward: 'General Ward', room: '101-B', status: 'Available' },
  { id: 'B-G03', ward: 'General Ward', room: '102-A', status: 'Available' },
  { id: 'B-G04', ward: 'General Ward', room: '102-B', status: 'Occupied', patientId: 'P-1006', patientName: 'Lakshmi Narayan' },
  { id: 'B-G05', ward: 'General Ward', room: '103-A', status: 'Cleaning' },
  { id: 'B-G06', ward: 'General Ward', room: '103-B', status: 'Available' },
  { id: 'B-I01', ward: 'ICU', room: 'ICU-1', status: 'Occupied', patientId: 'P-1006', patientName: 'Lakshmi Narayan' },
  { id: 'B-I02', ward: 'ICU', room: 'ICU-2', status: 'Available' },
  { id: 'B-I03', ward: 'ICU', room: 'ICU-3', status: 'Reserved' },
  { id: 'B-I04', ward: 'ICU', room: 'ICU-4', status: 'Available' },
  { id: 'B-E01', ward: 'Emergency', room: 'ER-1', status: 'Occupied', patientId: 'P-1009', patientName: 'Vikas Chauhan' },
  { id: 'B-E02', ward: 'Emergency', room: 'ER-2', status: 'Available' },
  { id: 'B-E03', ward: 'Emergency', room: 'ER-3', status: 'Available' },
  { id: 'B-E04', ward: 'Emergency', room: 'ER-4', status: 'Reserved' },
  { id: 'B-P01', ward: 'Private Room', room: '201', status: 'Available' },
  { id: 'B-P02', ward: 'Private Room', room: '202', status: 'Occupied', patientId: 'P-1006', patientName: 'Lakshmi Narayan' },
  { id: 'B-P03', ward: 'Private Room', room: '203', status: 'Available' },
  { id: 'B-P04', ward: 'Private Room', room: '204', status: 'Available' },
  { id: 'B-S01', ward: 'Semi-Private', room: '301-A', status: 'Available' },
  { id: 'B-S02', ward: 'Semi-Private', room: '301-B', status: 'Available' },
  { id: 'B-S03', ward: 'Semi-Private', room: '302-A', status: 'Occupied', patientId: 'P-1002', patientName: 'Sunita Devi' },
  { id: 'B-S04', ward: 'Semi-Private', room: '302-B', status: 'Available' },
];

export const seedAdmissions = [
  { id: 'ADM-701', patientId: 'P-1001', patientName: 'Ramesh Kumar', doctorName: 'Dr. Ayesha Sharma', department: 'Cardiology', admissionDate: '2026-08-18', bedNumber: 'B-G01 (101-A)', roomType: 'General Ward', emergencyContact: '+91 91234 56780', reason: 'Chest pain observation and cardiac monitoring', status: 'Admitted' },
  { id: 'ADM-702', patientId: 'P-1006', patientName: 'Lakshmi Narayan', doctorName: 'Dr. Vikram Rao', department: 'Orthopedics', admissionDate: '2026-08-15', bedNumber: 'B-I01 (ICU-1)', roomType: 'ICU', emergencyContact: '+91 94455 12121', reason: 'Post hip-surgery recovery', status: 'Admitted' },
];

export const seedMedicines = [
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

export const LAB_TEST_TYPES = ['Blood Test', 'Urine Test', 'X-Ray', 'MRI', 'CT Scan', 'ECG', 'Ultrasound'];

export const seedLabTests = [
  { id: 'L-501', patientId: 'P-1001', patientName: 'Ramesh Kumar', doctorName: 'Dr. Ayesha Sharma', testType: 'Blood Test', date: '2026-08-20', status: 'Completed', resultSummary: 'Hemoglobin 13.2 g/dL, cholesterol slightly elevated (210 mg/dL). All other values within normal range.' },
  { id: 'L-502', patientId: 'P-1003', patientName: 'Arjun Patel', doctorName: 'Dr. Rahul Verma', testType: 'MRI', date: '2026-08-21', status: 'Processing', resultSummary: '' },
  { id: 'L-503', patientId: 'P-1005', patientName: 'Mohammed Ali', doctorName: 'Dr. Sanjay Kulkarni', testType: 'Blood Test', date: '2026-08-22', status: 'Requested', resultSummary: '' },
  { id: 'L-504', patientId: 'P-1007', patientName: 'Daniel Fernandes', doctorName: 'Dr. Priya Singh', testType: 'X-Ray', date: '2026-08-19', status: 'Completed', resultSummary: 'No fracture detected. Mild soft tissue swelling noted on left forearm.' },
  { id: 'L-505', patientId: 'P-1008', patientName: 'Ananya Reddy', doctorName: 'Dr. Neha Gupta', testType: 'ECG', date: '2026-08-23', status: 'Requested', resultSummary: '' },
];

export const seedBills = [
  {
    id: 'INV-601', patientId: 'P-1001', patientName: 'Ramesh Kumar',
    items: [
      { label: 'Doctor Consultation', amount: 800 },
      { label: 'Room Charges (2 days)', amount: 3000 },
      { label: 'Laboratory - Blood Test', amount: 450 },
      { label: 'Medicines', amount: 620 },
    ],
    otherCharges: 200, discount: 0, paymentStatus: 'Pending', date: '2026-08-20',
  },
  {
    id: 'INV-602', patientId: 'P-1004', patientName: 'Kavita Joshi',
    items: [
      { label: 'Doctor Consultation', amount: 800 },
      { label: 'Laboratory - ECG', amount: 500 },
    ],
    otherCharges: 0, discount: 130, paymentStatus: 'Paid', date: '2026-08-17',
  },
  {
    id: 'INV-603', patientId: 'P-1007', patientName: 'Daniel Fernandes',
    items: [
      { label: 'Doctor Consultation', amount: 600 },
      { label: 'X-Ray', amount: 900 },
      { label: 'Medicines', amount: 340 },
    ],
    otherCharges: 50, discount: 0, paymentStatus: 'Partial', date: '2026-08-19',
  },
];
