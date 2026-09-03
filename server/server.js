// ============================================================
// server/server.js
// CareConnect Hospital Management System — Express REST API
//
// IMPORTANT: This backend uses ONLY in-memory JavaScript arrays.
// There is NO database (no MongoDB / MySQL / PostgreSQL / Firebase).
// All data resets when the server restarts. This is intentional —
// it is a demo/academic system.
// ============================================================

const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ----
app.use(cors()); // allow the React dev server to call these APIs
app.use(express.json());

// ---- Simple request logger (helps during demo) ----
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()}  ${req.method} ${req.originalUrl}`);
  next();
});

// ---- Health check ----
app.get('/', (req, res) => {
  res.json({
    name: 'CareConnect Hospital Management API',
    status: 'running',
    note: 'Demo only — in-memory data, no database.',
    endpoints: [
      '/api/patients', '/api/doctors', '/api/appointments', '/api/beds',
      '/api/medicines', '/api/laboratory', '/api/billing', '/api/admissions',
    ],
  });
});

// ---- REST API routes ----
app.use('/api', apiRoutes);

// ---- 404 for unknown API paths ----
app.use('/api', (req, res) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log('==============================================');
  console.log('  CareConnect API server running');
  console.log(`  http://localhost:${PORT}`);
  console.log('  Data: in-memory arrays (resets on restart)');
  console.log('==============================================');
});
