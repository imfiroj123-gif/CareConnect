// ============================================================
// client/src/components/landing/Doctors.jsx
// Doctors section — cards built from the seeded doctor mock data
// (localStorage) so the landing page always matches the app data.
// "View Profile" opens a modal; "Book" goes to the booking page.
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import Modal from '../Modal';
import { getData, STORAGE_KEYS } from '../../services/storage';
import { initials, avatarColor } from '../../utils/helpers';

export default function Doctors() {
  // Read doctors straight from the localStorage seed.
  const doctors = getData(STORAGE_KEYS.doctors);
  const [profile, setProfile] = useState(null);

  return (
    <section className="section alt-bg" id="doctors">
      <div className="section-head anim-fade-up">
        <div className="kicker">Our specialists</div>
        <h2>Meet Our Experienced Doctors</h2>
        <p>Skilled specialists across every major department, available for consultation all week.</p>
      </div>

      <div className="doctors-grid">
        {doctors.slice(0, 8).map((doc) => {
          const available = doc.availability === 'Available';
          return (
            <article className="doctor-card" key={doc.id}>
              {/* Photo area — colored band with initials avatar */}
              <div className="dc-photo" style={{ background: `linear-gradient(135deg, ${avatarColor(doc.name)}22, ${avatarColor(doc.name)}55)` }}>
                <span className="dc-avatar" style={{ background: avatarColor(doc.name) }}>
                  {initials(doc.name)}
                </span>
                <span className="dc-status">
                  <i className="dot" style={{ background: available ? 'var(--green-600)' : 'var(--amber-600)' }} />
                  {doc.availability}
                </span>
              </div>

              <div className="dc-body">
                <h3>{doc.name}</h3>
                <span className="dc-spec">{doc.specialization}</span>
                <div className="dc-meta">
                  <span>{doc.experience} yrs experience</span>
                  <b>₹{doc.consultationFee}</b>
                </div>

                <div className="dc-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setProfile(doc)}>
                    View Profile
                  </button>
                  <Link to="/book-appointment" className="btn btn-primary btn-sm">
                    Book Appointment
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ---------- Profile modal ---------- */}
      <Modal open={!!profile} title={profile?.name || ''} onClose={() => setProfile(null)}>
        {profile && (
          <div style={{ display: 'grid', gap: 10 }}>
            <p className="muted">{profile.specialization} · {profile.department}</p>
            <p><Icon name="phone" size={15} /> &nbsp;{profile.phone}</p>
            <p><Icon name="mail" size={15} /> &nbsp;{profile.email}</p>
            <p><Icon name="clock" size={15} /> &nbsp;{profile.experience} years of clinical experience</p>
            <p><b>Consultation fee:</b> ₹{profile.consultationFee}</p>
            <p><b>Availability:</b> {profile.availability}</p>
            <Link to="/book-appointment" className="btn btn-primary btn-sm" style={{ justifySelf: 'start', marginTop: 6 }} onClick={() => setProfile(null)}>
              Book with {profile.name.split(' ').slice(-1)[0]}
            </Link>
          </div>
        )}
      </Modal>
    </section>
  );
}
