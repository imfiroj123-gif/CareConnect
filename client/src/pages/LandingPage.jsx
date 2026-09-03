// ============================================================
// client/src/pages/LandingPage.jsx
// Public marketing home page — assembles all landing sections.
// ============================================================

import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Services from '../components/landing/Services';
import Doctors from '../components/landing/Doctors';
import Departments from '../components/landing/Departments';
import { About, Contact } from '../components/landing/AboutContact';
import Footer, { CtaBand } from '../components/landing/Footer';
import Reveal from '../components/Reveal';
import Particles from '../components/landing/Particles';
import Icon from '../components/Icon';

export default function LandingPage() {
  return (
    <div className="landing">
      <Particles />
      <Navbar />
      <Hero />
      <Reveal><Services /></Reveal>
      <Reveal delay={100}><Doctors /></Reveal>
      <Reveal delay={100}><Departments /></Reveal>
      <Reveal><About /></Reveal>
      <Reveal delay={100}><Contact /></Reveal>
      <Reveal><CtaBand /></Reveal>
      <Footer />
      
      {/* WhatsApp Floating Action Button (Mobile Only) */}
      <a 
        href="https://wa.me/917518746720" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="Chat on WhatsApp"
      >
        <Icon name="whatsapp" size={32} />
      </a>
    </div>
  );
}
