// Quick smoke test for the CareConnect REST API.
// Run: node scripts/smoke-test.js  (with the server running on :5000)

const BASE = 'http://localhost:5000';

async function show(label, res) {
  const text = await res.text();
  console.log(`${res.status}  ${label}  ->  ${text.slice(0, 160)}`);
}

(async () => {
  // GET collections
  await show('GET /api/patients', await fetch(`${BASE}/api/patients`));
  await show('GET /api/doctors', await fetch(`${BASE}/api/doctors`));
  await show('GET /api/beds', await fetch(`${BASE}/api/beds`));

  // POST create appointment
  const post = await fetch(`${BASE}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientId: 'P-1002',
      patientName: 'Sunita Devi',
      doctorId: 'D-201',
      doctorName: 'Dr. Ayesha Sharma',
      department: 'Cardiology',
      date: '2026-08-25',
      time: '14:00',
      reason: 'Smoke test booking',
      status: 'Pending',
    }),
  });
  const created = await post.json();
  console.log(`${post.status}  POST /api/appointments  ->  id=${created.id}`);

  // PUT update bed
  await show('PUT /api/beds/B-G02', await fetch(`${BASE}/api/beds/B-G02`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Occupied', patientId: 'P-1003', patientName: 'Arjun Patel' }),
  }));

  // PUT update the created appointment, then DELETE it (cleanup)
  await show(`PUT /api/appointments/${created.id}`, await fetch(`${BASE}/api/appointments/${created.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Confirmed' }),
  }));
  await show(`DELETE /api/appointments/${created.id}`, await fetch(`${BASE}/api/appointments/${created.id}`, { method: 'DELETE' }));

  // GET billing
  await show('GET /api/billing', await fetch(`${BASE}/api/billing`));

  console.log('Smoke test finished.');
})().catch((err) => {
  console.error('SMOKE TEST FAILED:', err.message);
  process.exit(1);
});
