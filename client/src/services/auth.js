// ============================================================
// client/src/services/auth.js
// DEMO authentication only — there is NO real backend auth and
// NO database. Credentials are hardcoded demo accounts and the
// "session" is just a JSON blob in localStorage.
//
// ⚠️  NOT PRODUCTION-READY AUTHENTICATION. Do not reuse this
// pattern for anything handling real user data.
// ============================================================

import { STORAGE_KEYS } from './storage';

/** Demo accounts — one per role, as documented in the README. */
export const DEMO_ACCOUNTS = [
  { role: 'admin', label: 'Admin', email: 'admin@careconnect.com', password: 'admin123', name: 'Aarav Kapoor' },
  { role: 'doctor', label: 'Doctor', email: 'doctor@careconnect.com', password: 'doctor123', name: 'Dr. Ayesha Sharma', doctorId: 'D-201' },
  { role: 'receptionist', label: 'Receptionist', email: 'reception@careconnect.com', password: 'reception123', name: 'Priya Nair' },
  { role: 'patient', label: 'Patient', email: 'patient@careconnect.com', password: 'patient123', name: 'Ramesh Kumar', patientId: 'P-1001' },
];

/** Where each role lands after login. */
export const ROLE_HOME = {
  admin: '/admin',
  doctor: '/doctor',
  receptionist: '/receptionist',
  patient: '/patient',
};

/** Validate credentials against the demo list. Returns the account or null. */
export function authenticate(email, password, expectedRole) {
  const account = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === String(email).trim().toLowerCase()
      && a.password === password
      && (!expectedRole || a.role === expectedRole)
  );
  return account || null;
}

/** Persist the logged-in user to localStorage (the demo "session"). */
export function saveSession(account) {
  localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify({
    name: account.name,
    email: account.email,
    role: account.role,
    doctorId: account.doctorId || null,
    patientId: account.patientId || null,
    loginAt: new Date().toISOString(),
  }));
}

/** Read the current session or null. */
export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.authUser));
  } catch {
    return null;
  }
}

/** Clear the session (logout). */
export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.authUser);
}
