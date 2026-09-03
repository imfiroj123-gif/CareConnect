// ============================================================
// client/src/hooks/useAuthUser.js
// Reads the current demo session user. Dashboard pages call this
// instead of touching localStorage directly.
// ============================================================

import { useOutletContext } from 'react-router-dom';
import { getSession } from '../services/auth';

/**
 * Returns the logged-in user object from either the Outlet
 * context (preferred) or the raw session fallback.
 */
export default function useAuthUser() {
  const context = useOutletContext();
  if (context?.user) return context.user;
  return getSession() || { name: 'Guest', email: '', role: 'guest' };
}
