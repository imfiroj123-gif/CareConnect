// ============================================================
// client/src/components/landing/Footer.jsx
// CTA band + footer links. Footer links point to real routes or
// anchors so nothing is a dead end.
// ============================================================

import { Link } from 'react-router-dom';
import Logo from '../Logo';
import Icon from '../Icon';

export function CtaBand() {
  return (
    <section style={{ padding: '30px 24px 70px' }}>
      <div className="cta-band">
        <div>
          <h2>Ready to experience simpler healthcare?</h2>
          <p>Book an appointment in under a minute — no paperwork, no phone queues.</p>
        </div>
        <Link to="/book-appointment" className="btn btn-white">
          Book Appointment <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <Logo size={32} light />
          <p className="brand-line">
            CareConnect Hospital Management System — a modern, friendly way to run a hospital.
            Demo project with mock data; not a real medical service.
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#doctors">Doctors</a></li>
            <li><a href="#departments">Departments</a></li>
          </ul>
        </div>

        <div>
          <h4>For Staff</h4>
          <ul>
            <li><Link to="/login">Staff Login</Link></li>
            <li><Link to="/login">Admin Dashboard</Link></li>
            <li><Link to="/book-appointment">Public Booking</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            <li>+91 1800 202 3030</li>
            <li>hello@careconnect.example</li>
            <li>MG Road, Pune</li>
            <li>Emergency: 108</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Hospital Management System by Firoj Khan. All rights reserved.</span>
      </div>
    </footer>
  );
}
