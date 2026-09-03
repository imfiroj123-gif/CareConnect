// ============================================================
// server/routes/index.js
// Wires every resource to the shared CRUD controller.
// All data lives in in-memory arrays — no database involved.
// ============================================================

const express = require('express');
const { createCrudController } = require('../controllers/crudController');

// In-memory "tables"
const patients = require('../data/patients');
const doctors = require('../data/doctors');
const appointments = require('../data/appointments');
const beds = require('../data/beds');
const medicines = require('../data/medicines');
const labTests = require('../data/laboratory');
const bills = require('../data/billing');

// Admissions are derived from patients with admissionStatus 'Admitted'
// plus a small dedicated list for admission records.
const admissions = [
  {
    id: 'ADM-701',
    patientId: 'P-1001',
    patientName: 'Ramesh Kumar',
    doctorName: 'Dr. Ayesha Sharma',
    department: 'Cardiology',
    admissionDate: '2026-08-18',
    bedNumber: 'B-G01 (101-A)',
    roomType: 'General Ward',
    emergencyContact: '+91 91234 56780',
    reason: 'Chest pain observation and cardiac monitoring',
    status: 'Admitted',
  },
  {
    id: 'ADM-702',
    patientId: 'P-1006',
    patientName: 'Lakshmi Narayan',
    doctorName: 'Dr. Vikram Rao',
    department: 'Orthopedics',
    admissionDate: '2026-08-15',
    bedNumber: 'B-I01 (ICU-1)',
    roomType: 'ICU',
    emergencyContact: '+91 94455 12121',
    reason: 'Post hip-surgery recovery',
    status: 'Admitted',
  },
];

const router = express.Router();

// ---- Patients ----
const patientCtrl = createCrudController(patients, 'P');
router.get('/patients', patientCtrl.getAll);
router.get('/patients/:id', patientCtrl.getOne);
router.post('/patients', patientCtrl.create);
router.put('/patients/:id', patientCtrl.update);
router.delete('/patients/:id', patientCtrl.remove);

// ---- Doctors ----
const doctorCtrl = createCrudController(doctors, 'D');
router.get('/doctors', doctorCtrl.getAll);
router.get('/doctors/:id', doctorCtrl.getOne);
router.post('/doctors', doctorCtrl.create);
router.put('/doctors/:id', doctorCtrl.update);
router.delete('/doctors/:id', doctorCtrl.remove);

// ---- Appointments ----
const apptCtrl = createCrudController(appointments, 'A');
router.get('/appointments', apptCtrl.getAll);
router.get('/appointments/:id', apptCtrl.getOne);
router.post('/appointments', apptCtrl.create);
router.put('/appointments/:id', apptCtrl.update);
router.delete('/appointments/:id', apptCtrl.remove);

// ---- Beds (GET / POST / PUT only — beds are fixed inventory) ----
const bedCtrl = createCrudController(beds, 'B');
router.get('/beds', bedCtrl.getAll);
router.post('/beds', bedCtrl.create);
router.put('/beds/:id', bedCtrl.update);

// ---- Medicines (GET / POST + update/delete via same controller) ----
const medCtrl = createCrudController(medicines, 'M');
router.get('/medicines', medCtrl.getAll);
router.post('/medicines', medCtrl.create);
router.put('/medicines/:id', medCtrl.update);
router.delete('/medicines/:id', medCtrl.remove);

// ---- Laboratory ----
const labCtrl = createCrudController(labTests, 'L');
router.get('/laboratory', labCtrl.getAll);
router.post('/laboratory', labCtrl.create);
router.put('/laboratory/:id', labCtrl.update);

// ---- Billing ----
const billCtrl = createCrudController(bills, 'INV');
router.get('/billing', billCtrl.getAll);
router.post('/billing', billCtrl.create);
router.put('/billing/:id', billCtrl.update);

// ---- Admissions ----
const admCtrl = createCrudController(admissions, 'ADM');
router.get('/admissions', admCtrl.getAll);
router.post('/admissions', admCtrl.create);
router.put('/admissions/:id', admCtrl.update);

module.exports = router;
