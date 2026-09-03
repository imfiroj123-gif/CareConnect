// ============================================================
// client/src/components/ProtectedRoute.jsx
// Frontend route guard (demo-grade). Reads the localStorage
// session and enforces the expected role. Unauthenticated users
// are bounced to /login; wrong roles go to their own dashboard.
//
// ⚠️ This is UI-level protection only — NOT production security.
// ============================================================

import { Navigate, Outlet } from 'react-router-dom';
import { getSession } from '../services/auth';
import { ROLE_HOME } from '../services/auth';

/**
 * @param {string} role required role ('admin' | 'doctor' | ...)
 */
export default function ProtectedRoute({ role }) {
  const user = getSession();

  // Not logged in at all → login page.
  if (!user) return <Navigate to="/login" replace />;

  // Logged in as a different role → send them to their own home.
  if (role && user.role !== role) {
    return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
  }

  return <Outlet context={{ user }} />;
}
