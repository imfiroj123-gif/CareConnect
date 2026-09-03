// ============================================================
// client/src/components/landing/Navbar.jsx
// Public marketing navbar with smooth-scroll anchor links.
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import Icon from '../Icon';

const LINKS = [
  ['Home', '#home'],
  ['Services', '#services'],
  ['Doctors', '#doctors'],
  ['Departments', '#departments'],
  ['About', '#about'],
  ['Contact', '#contact'],
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="nav" id="home">
      <div className="nav-inner">
        <Logo size={34} />

        {/* Desktop Links */}
        <ul className="nav-links">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="nav-actions">
          <Link to="/book-appointment" className="btn btn-primary btn-sm">
            <Icon name="calendar" size={15} /> Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="nav-mobile-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <Icon name={isMobileMenuOpen ? "x" : "menu"} size={28} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <ul className="mobile-nav-links">
            {LINKS.map(([label, href]) => (
              <li key={href}>
                <a href={href} onClick={() => setIsMobileMenuOpen(false)}>{label}</a>
              </li>
            ))}
          </ul>
          <div className="mobile-nav-actions">
            <Link to="/book-appointment" className="btn btn-primary btn-sm" onClick={() => setIsMobileMenuOpen(false)}>
              <Icon name="calendar" size={15} /> Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
