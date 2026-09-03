// ============================================================
// client/src/components/landing/Services.jsx
// Services grid — 10 cards with icon, title, description and a
// working "Learn More" button that opens a detail modal.
// ============================================================

import { useState } from 'react';
import Icon from '../Icon';
import Modal from '../Modal';

const SERVICES = [
  { icon: 'siren', bg: 'var(--red-50)', fg: 'var(--red-600)', title: 'Emergency Care', desc: 'Rapid-response trauma unit with round-the-clock critical care specialists.', more: 'Our emergency department operates 24/7 with an average response time under 5 minutes. Ambulance dispatch, triage and trauma teams are always on standby.' },
  { icon: 'stethoscope', bg: 'var(--green-100)', fg: 'var(--green-800)', title: 'OPD Services', desc: 'Walk-in outpatient consultations across all departments, every day.', more: 'The outpatient department handles general and specialist consultations from 8 AM to 9 PM with minimal waiting time thanks to digital queueing.' },
  { icon: 'user', bg: 'var(--blue-50)', fg: 'var(--blue-600)', title: 'Doctor Consultation', desc: 'Book appointments with 120+ experienced doctors in a few taps.', more: 'Choose your doctor by specialty, view availability in real-time, and receive instant confirmation. Video follow-ups are available for eligible cases.' },
  { icon: 'flask', bg: 'var(--violet-50)', fg: 'var(--violet-600)', title: 'Laboratory', desc: 'NABL-grade diagnostics: blood, urine, imaging and pathology.', more: 'Our lab runs over 200 test panels daily. Digital reports are delivered to your patient dashboard, usually within 6 hours.' },
  { icon: 'pill', bg: 'var(--amber-50)', fg: 'var(--amber-600)', title: 'Pharmacy', desc: 'In-house pharmacy stocked with genuine medicines and supplies.', more: 'Prescriptions are filled while you wait. Low-stock and expiry tracking keep the inventory safe and fresh.' },
  { icon: 'scan', bg: 'var(--green-50)', fg: 'var(--green-700)', title: 'Radiology', desc: 'Digital X-Ray, MRI, CT and ultrasound imaging suites.', more: 'High-resolution digital imaging with same-day reporting for most scans. Radiologists review urgent cases within the hour.' },
  { icon: 'ambulance', bg: 'var(--red-50)', fg: 'var(--red-600)', title: 'Ambulance', desc: 'GPS-tracked ambulances with advanced life support.', more: 'A fleet of 8 ALS/BLS ambulances covers the metro area with average pickup times under 12 minutes.' },
  { icon: 'clipboard', bg: 'var(--blue-50)', fg: 'var(--blue-600)', title: 'Patient Admission', desc: 'Smooth admission process with digital records and bed allocation.', more: 'From registration to room assignment, admissions are handled digitally so patients can focus on recovery instead of paperwork.' },
  { icon: 'bed', bg: 'var(--violet-50)', fg: 'var(--violet-600)', title: 'Bed Management', desc: 'Live availability across General Ward, ICU, Private and Semi-Private.', more: 'The bed board updates in real time as patients are admitted, transferred or discharged — no more phone-tag for bed status.' },
  { icon: 'file', bg: 'var(--amber-50)', fg: 'var(--amber-600)', title: 'Medical Records', desc: 'Secure digital health records accessible anytime.', more: 'Every visit, prescription, lab report and bill is stored in one timeline that you control and can download anytime.' },
];

export default function Services() {
  const [detail, setDetail] = useState(null); // service object currently open

  return (
    <section className="section" id="services">
      <div className="section-head anim-fade-up">
        <div className="kicker">What we offer</div>
        <h2>Complete Care Under One Roof</h2>
        <p>Everything a modern hospital needs — organised into simple services you can explore.</p>
      </div>

      <div className="services-grid">
        {SERVICES.map((s) => (
          <article className="service-card" key={s.title}>
            <span className="sc-icon" style={{ background: s.bg, color: s.fg }}>
              <Icon name={s.icon} size={24} />
            </span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            {/* Learn More opens a modal with extra detail (no dead buttons) */}
            <button type="button" className="learn-more" onClick={() => setDetail(s)}>
              Learn More <Icon name="arrowRight" size={15} />
            </button>
          </article>
        ))}
      </div>

      <Modal open={!!detail} title={detail?.title || ''} onClose={() => setDetail(null)}>
        {detail && (
          <>
            <p className="muted">{detail.more}</p>
            <div style={{ marginTop: 18 }}>
              <a href="#contact" className="btn btn-primary btn-sm" onClick={() => setDetail(null)}>
                Contact us about this
              </a>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
