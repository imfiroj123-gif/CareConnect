// ============================================================
// client/src/components/landing/Departments.jsx
// Departments grid with live "available doctors" counts pulled
// from the doctors seed data. View Department opens a modal.
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import Modal from '../Modal';
import { getData, STORAGE_KEYS } from '../../services/storage';

const ICON_TONES = {
  heart: ['var(--red-50)', 'var(--red-600)'],
  brain: ['var(--violet-50)', 'var(--violet-600)'],
  bone: ['var(--amber-50)', 'var(--amber-600)'],
  baby: ['var(--blue-50)', 'var(--blue-600)'],
  sparkle: ['var(--green-100)', 'var(--green-800)'],
  stethoscope: ['var(--green-50)', 'var(--green-700)'],
  flower: ['#fdf2f8', '#db2777'],
  ear: ['var(--blue-50)', 'var(--blue-600)'],
  siren: ['var(--red-50)', 'var(--red-600)'],
  scan: ['var(--violet-50)', 'var(--violet-600)'],
};

export default function Departments() {
  const departments = getData(STORAGE_KEYS.departments);
  const doctors = getData(STORAGE_KEYS.doctors);
  const [openDept, setOpenDept] = useState(null);

  return (
    <section className="section" id="departments">
      <div className="section-head anim-fade-up">
        <div className="kicker">Departments</div>
        <h2>Specialised Care for Every Need</h2>
        <p>Ten fully equipped departments staffed by senior consultants and modern equipment.</p>
      </div>

      <div className="dept-grid">
        {departments.map((dep) => {
          const [bg, fg] = ICON_TONES[dep.icon] || ICON_TONES.stethoscope;
          const deptDoctors = doctors.filter((d) => d.department === dep.name);

          return (
            <article className="dept-card" key={dep.id}>
              <span className="dp-icon" style={{ background: bg, color: fg }}>
                <Icon name={dep.icon} size={22} />
              </span>
              <h3>{dep.name}</h3>
              <p>{dep.description}</p>

              <span className="dp-count">
                <Icon name="stethoscope" size={13} />
                {deptDoctors.length} available doctor{deptDoctors.length === 1 ? '' : 's'}
              </span>

              {/* View Department → modal listing its doctors */}
              <button type="button" className="learn-more" onClick={() => setOpenDept({ ...dep, deptDoctors })}>
                View Department <Icon name="arrowRight" size={15} />
              </button>
            </article>
          );
        })}
      </div>

      <Modal open={!!openDept} title={`${openDept?.name || ''} Department`} onClose={() => setOpenDept(null)}>
        {openDept && (
          <>
            <p className="muted">{openDept.description}</p>
            <h4 style={{ margin: '16px 0 8px' }}>Doctors in this department</h4>
            {openDept.deptDoctors.length === 0 && <p className="small muted">No doctors listed yet — check back soon.</p>}
            {openDept.deptDoctors.map((d) => (
              <div className="list-row" style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }} key={d.id}>
                <span style={{ flex: 1 }}>
                  <b style={{ fontSize: '0.9rem' }}>{d.name}</b>
                  <div className="small muted">{d.specialization} · {d.experience} yrs · ₹{d.consultationFee}</div>
                </span>
                <span className={`badge ${d.availability === 'Available' ? 'badge-green' : 'badge-amber'}`}>{d.availability}</span>
              </div>
            ))}
            <Link to="/book-appointment" className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => setOpenDept(null)}>
              Book an appointment
            </Link>
          </>
        )}
      </Modal>
    </section>
  );
}
