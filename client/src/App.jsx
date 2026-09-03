import { Routes, Route, Navigate } from 'react-router-dom';
import { getSession } from './services/auth';

import DashboardLayout from './layouts/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import BookAppointmentPage from './pages/BookAppointmentPage';

import AdminDashboard from './pages/dashboard/AdminDashboard';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import PatientDashboard from './pages/dashboard/PatientDashboard';
import ReceptionistDashboard from './pages/dashboard/ReceptionistDashboard';

import AdmissionsPage from './pages/modules/AdmissionsPage';
import AppointmentsPage from './pages/modules/AppointmentsPage';
import BedsPage from './pages/modules/BedsPage';
import BillingPage from './pages/modules/BillingPage';
import DepartmentsPage from './pages/modules/DepartmentsPage';
import DoctorsPage from './pages/modules/DoctorsPage';
import LaboratoryPage from './pages/modules/LaboratoryPage';
import PatientsPage from './pages/modules/PatientsPage';
import PharmacyPage from './pages/modules/PharmacyPage';

function DashboardWrapper({ allowedRole }) {
  const session = getSession();
  if (!session || (allowedRole && session.role !== allowedRole)) {
    return <Navigate to="/login" replace />;
  }
  return <DashboardLayout user={session} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/book-appointment" element={<BookAppointmentPage />} />

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<DashboardWrapper allowedRole="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="admissions" element={<AdmissionsPage />} />
        <Route path="beds" element={<BedsPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="pharmacy" element={<PharmacyPage />} />
        <Route path="laboratory" element={<LaboratoryPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="*" element={<div style={{padding: 40}}><h2>Coming Soon</h2><p>This module is under construction.</p></div>} />
      </Route>

      {/* RECEPTIONIST ROUTES */}
      <Route path="/receptionist" element={<DashboardWrapper allowedRole="receptionist" />}>
        <Route index element={<ReceptionistDashboard />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="admissions" element={<AdmissionsPage />} />
        <Route path="beds" element={<BedsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="*" element={<div style={{padding: 40}}><h2>Coming Soon</h2><p>This module is under construction.</p></div>} />
      </Route>

      {/* DOCTOR ROUTES */}
      <Route path="/doctor" element={<DashboardWrapper allowedRole="doctor" />}>
        <Route index element={<DoctorDashboard />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="laboratory" element={<LaboratoryPage />} />
        <Route path="*" element={<div style={{padding: 40}}><h2>Coming Soon</h2><p>This module is under construction.</p></div>} />
      </Route>

      {/* PATIENT ROUTES */}
      <Route path="/patient" element={<DashboardWrapper allowedRole="patient" />}>
        <Route index element={<PatientDashboard />} />
        <Route path="book-appointment" element={<BookAppointmentPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="bills" element={<BillingPage />} />
        <Route path="*" element={<div style={{padding: 40}}><h2>Coming Soon</h2><p>This module is under construction.</p></div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
