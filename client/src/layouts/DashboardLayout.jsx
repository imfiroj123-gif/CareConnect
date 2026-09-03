// ============================================================
// client/src/layouts/DashboardLayout.jsx
// Shared shell for every role dashboard: sidebar + topbar + the
// routed page content in between. Handles the mobile drawer and
// logout.
// ============================================================

import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { getData, STORAGE_KEYS } from '../services/storage';
import { clearSession } from '../services/auth';

export default function DashboardLayout({ user }) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Live badge counts for the sidebar (pending appointments).
  const pendingAppointments = getData(STORAGE_KEYS.appointments)
    .filter((a) => a.status === 'Pending').length;

  function handleLogout() {
    clearSession();
    navigate('/login', { replace: true });
  }

  return (
    <div className="shell">
      <Sidebar
        role={user.role}
        user={user}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        badges={{ pendingAppointments }}
      />
      <div className="main-col">
        <Topbar
          user={user}
          onMenu={() => setDrawerOpen(true)}
          onLogout={handleLogout}
        />
        {/* page-enter gives each navigation a soft fade-up */}
        <main className="content page-enter" key={window.location.pathname}>
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}
