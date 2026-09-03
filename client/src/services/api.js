// ============================================================
// client/src/services/api.js
// Thin fetch wrapper around the Express REST API (localhost:5000,
// proxied via /api in dev). The app primarily uses localStorage for
// instant persistence, but this service is used by the public
// booking page to POST appointments to the real backend, and can
// be used anywhere you want server-backed reads.
//
// Every helper returns parsed JSON and throws on non-2xx.
// ============================================================

async function request(path, { method = 'GET', body } = {}) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) options.body = JSON.stringify(body);

  const res = await fetch(path, options);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((data && data.message) || `Request failed (${res.status})`);
  }
  return data;
}

/* ---------- Patients ---------- */
export const fetchPatients = () => request('/api/patients');
export const createPatient = (patient) => request('/api/patients', { method: 'POST', body: patient });

/* ---------- Doctors ---------- */
export const fetchDoctors = () => request('/api/doctors');

/* ---------- Appointments ---------- */
export const fetchAppointments = () => request('/api/appointments');
export const createAppointment = (appt) => request('/api/appointments', { method: 'POST', body: appt });
export const updateAppointment = (id, patch) => request(`/api/appointments/${id}`, { method: 'PUT', body: patch });
export const deleteAppointment = (id) => request(`/api/appointments/${id}`, { method: 'DELETE' });

/* ---------- Beds / Medicines / Lab / Billing / Admissions ---------- */
export const fetchBeds = () => request('/api/beds');
export const updateBed = (id, patch) => request(`/api/beds/${id}`, { method: 'PUT', body: patch });
export const fetchMedicines = () => request('/api/medicines');
export const fetchLabTests = () => request('/api/laboratory');
export const fetchBills = () => request('/api/billing');
export const fetchAdmissions = () => request('/api/admissions');

/** Generic collection getter for the global search. */
export function searchCollections() {
  // Reads all collections in parallel; failures resolve to [] so one
  // broken endpoint never breaks global search.
  const safe = (p) => p.catch(() => []);
  return Promise.all([
    safe(fetchPatients()),
    safe(fetchDoctors()),
    safe(fetchAppointments()),
    safe(fetchMedicines()),
  ]);
}
