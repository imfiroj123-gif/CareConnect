// ============================================================
// client/src/services/storage.js
// localStorage persistence layer — the "database" of the demo.
//
// Provides reusable generic functions:
//   getData(key)      -> read an array (seeded with defaults on first run)
//   addData(key, obj) -> append a record with an auto id
//   updateData(key, id, patch)
//   deleteData(key, id)
// plus seedIfEmpty() which writes mock data on first visit.
// ============================================================

import {
  seedPatients, seedDoctors, seedAppointments, seedDepartments,
  seedBeds, seedAdmissions, seedMedicines, seedLabTests, seedBills,
} from '../data/mockData';

/** localStorage keys in one place so typos can't happen. */
export const STORAGE_KEYS = {
  patients: 'patients',
  doctors: 'doctors',
  appointments: 'appointments',
  departments: 'departments',
  beds: 'beds',
  admissions: 'admissions',
  medicines: 'medicines',
  labTests: 'labTests',
  bills: 'bills',
  emergencyCases: 'emergencyCases',
  messages: 'messages',
  notifications: 'notifications',
  authUser: 'cc_auth_user',
  seeded: 'cc_seeded_v1',
};

/**
 * Seed all collections once. Called from App.jsx on mount.
 * If you ever change the shape of the mock data, bump cc_seeded_v1.
 */
export function seedIfEmpty() {
  if (localStorage.getItem(STORAGE_KEYS.seeded)) return;

  const seeds = {
    [STORAGE_KEYS.patients]: seedPatients,
    [STORAGE_KEYS.doctors]: seedDoctors,
    [STORAGE_KEYS.appointments]: seedAppointments,
    [STORAGE_KEYS.departments]: seedDepartments,
    [STORAGE_KEYS.beds]: seedBeds,
    [STORAGE_KEYS.admissions]: seedAdmissions,
    [STORAGE_KEYS.medicines]: seedMedicines,
    [STORAGE_KEYS.labTests]: seedLabTests,
    [STORAGE_KEYS.bills]: seedBills,
  };
  Object.entries(seeds).forEach(([key, value]) => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  // A couple of emergency cases for the Emergency dashboard.
  localStorage.setItem(STORAGE_KEYS.emergencyCases, JSON.stringify([
    { id: 'EM-01', patientName: 'Vikas Chauhan', condition: 'Road traffic accident — active bleeding', priority: 'Critical', time: new Date().toISOString(), status: 'Active', assignedDoctor: 'Dr. Vikram Rao' },
    { id: 'EM-02', patientName: 'Fatima Sheikh', condition: 'Severe chest pain suspected cardiac event', priority: 'Urgent', time: new Date().toISOString(), status: 'Active', assignedDoctor: 'Dr. Ayesha Sharma' },
  ]));

  // Starter conversations for the Messages module.
  localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify([
    {
      id: 'MSG-1',
      contactId: 'D-201',
      contactName: 'Dr. Ayesha Sharma',
      messages: [
        { from: 'them', text: 'Good morning! Ramesh Kumar is ready for his follow-up review.', time: '2026-08-23T09:12:00.000Z' },
        { from: 'me', text: 'Thanks Doctor — I will send his latest ECG report shortly.', time: '2026-08-23T09:15:00.000Z' },
      ],
    },
    {
      id: 'MSG-2',
      contactId: 'R-1',
      contactName: 'Front Desk Reception',
      messages: [
        { from: 'them', text: 'Three walk-in registrations completed this morning.', time: '2026-08-23T10:02:00.000Z' },
      ],
    },
  ]));

  localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify([
    { id: 'N-1', title: 'New appointment request', body: 'Arjun Patel requested Neurology consultation (24 Aug, 11:30 AM).', time: Date.now() - 1000 * 60 * 22, read: false },
    { id: 'N-2', title: 'Low stock alert', body: 'Insulin Glargine is down to 5 units in pharmacy.', time: Date.now() - 1000 * 60 * 95, read: false },
    { id: 'N-3', title: 'Emergency case admitted', body: 'Vikas Chauhan moved to ER-1 after road accident.', time: Date.now() - 1000 * 60 * 60 * 5, read: false },
    { id: 'N-4', title: 'Lab results ready', body: 'Blood Test report for Ramesh Kumar is available.', time: Date.now() - 1000 * 60 * 60 * 26, read: true },
  ]));

  localStorage.setItem(STORAGE_KEYS.seeded, 'true');
}

/** Read an array collection; falls back to [] when missing. */
export function getData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

/** Overwrite a whole collection. */
export function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Next numeric suffix helper — turns P-1008 into P-1009. */
function nextIdFor(existing) {
  let max = 0;
  existing.forEach((item) => {
    const match = String(item.id || '').match(/-(\d+)$/);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  });
  return max + 1;
}

/** Append a record, generating a sequential id like P-1009 / INV-604. */
export function addData(key, item) {
  const items = getData(key);
  const basePrefix = key === STORAGE_KEYS.labTests ? 'L'
    : key === STORAGE_KEYS.admissions ? 'ADM'
      : key === STORAGE_KEYS.emergencyCases ? 'EM'
        : key === STORAGE_KEYS.messages ? 'MSG'
          : null;
  const prefixMap = {
    [STORAGE_KEYS.patients]: 'P',
    [STORAGE_KEYS.doctors]: 'D',
    [STORAGE_KEYS.appointments]: 'A',
    [STORAGE_KEYS.departments]: 'DEP',
    [STORAGE_KEYS.beds]: 'B',
    [STORAGE_KEYS.medicines]: 'M',
    [STORAGE_KEYS.bills]: 'INV',
  };
  const prefix = prefixMap[key] || basePrefix || 'X';
  const record = { ...item, id: `${prefix}-${nextIdFor(items)}` };
  items.unshift(record);
  setData(key, items);
  return record;
}

/** Merge a patch into one record by id. Returns the updated record or null. */
export function updateData(key, id, patch) {
  const items = getData(key);
  const index = items.findIndex((it) => it.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...patch, id };
  setData(key, items);
  return items[index];
}

/** Remove one record by id. Returns true when something was removed. */
export function deleteData(key, id) {
  const items = getData(key);
  const filtered = items.filter((it) => it.id !== id);
  if (filtered.length === items.length) return false;
  setData(key, filtered);
  return true;
}
