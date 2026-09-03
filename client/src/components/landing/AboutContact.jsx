// ============================================================
// client/src/components/landing/AboutContact.jsx
// About section (why choose us + stats) and Contact section
// (info cards + working demo contact form with validation).
// ============================================================

import { useState } from 'react';
import Icon from '../Icon';
import { useToast } from '../Toast';
import {
  required, emailError, validateForm,
} from '../../utils/validation';

const POINTS = [
  ['Patient-first approach', 'Every workflow is designed to reduce waiting, paperwork and confusion for patients and families.'],
  ['Digital-first records', 'Prescriptions, lab reports and bills live in one secure timeline — no more lost paper files.'],
  ['Coordinated departments', 'Doctors, labs, pharmacy and billing stay in sync automatically so care never stalls between desks.'],
];

const STATS = [
  ['5,000+', 'Patients served'],
  ['120+', 'Expert doctors'],
  ['10', 'Departments'],
  ['24/7', 'Emergency care'],
];

export function About() {
  return (
    <section className="section alt-bg" id="about">
      <div className="about-strip">
        <div className="anim-fade-up">
          <div className="kicker" style={{ color: 'var(--green-700)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            Why CareConnect
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.02em' }}>
            A hospital that feels simple
          </h2>
          <p className="muted" style={{ marginTop: 12 }}>
            We rebuilt hospital management around conversations, not queues — the same
            calm, friendly feel you get from a modern messaging app, applied to healthcare.
          </p>

          <div className="about-points">
            {POINTS.map(([title, desc]) => (
              <div className="about-point" key={title}>
                <span className="ap-check">✓</span>
                <span>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-stats">
          {STATS.map(([num, label]) => (
            <div className="about-stat" key={label}>
              <div className="num">{num}</div>
              <div className="lbl">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    // Client-side validation before the (demo) submit.
    const result = validateForm(form, {
      name: (v) => required(v, 'Name'),
      email: emailError,
      message: (v) => required(v, 'Message'),
    });
    setErrors(result.errors);
    if (!result.isValid) return;

    // Send the email via FormSubmit AJAX (No backend required)
    fetch("https://formsubmit.co/ajax/imfiroj123@gmail.com", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        message: form.message,
        _subject: `New Contact from ${form.name}`
      })
    })
    .then(response => response.json())
    .then(data => {
      showToast(`Thanks ${form.name}! Your message has been sent.`, 'success');
      setForm({ name: '', email: '', message: '' });
    })
    .catch(error => {
      console.error(error);
      showToast(`Failed to send message. Please try again.`, 'error');
    });
  }

  return (
    <section className="section" id="contact">
      <div className="section-head anim-fade-up">
        <div className="kicker">Contact</div>
        <h2>We Are Here When You Need Us</h2>
        <p>Reach out for appointments, reports or any assistance — we usually reply within an hour.</p>
      </div>

      <div className="contact-wrap">
        {/* ---------- Info cards ---------- */}
        <div className="contact-info">
          <div className="contact-item">
            <span className="ci-icon" style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}><Icon name="phone" size={19} /></span>
            <span>
              <b>Call or WhatsApp</b>
              <div className="small muted">+91 7518746720</div>
            </span>
          </div>
          <div className="contact-item">
            <span className="ci-icon" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}><Icon name="mail" size={19} /></span>
            <span>
              <b>Email</b>
              <div className="small muted">imfiroj123@gmail.com</div>
            </span>
          </div>
          <div className="contact-item">
            <span className="ci-icon" style={{ background: 'var(--amber-50)', color: 'var(--amber-600)' }}><Icon name="pin" size={19} /></span>
            <span>
              <b>Visit us</b>
              <div className="small muted">Bhairahawa, Nepal</div>
            </span>
          </div>
          <div className="contact-item">
            <span className="ci-icon" style={{ background: 'var(--red-50)', color: 'var(--red-600)' }}><Icon name="siren" size={19} /></span>
            <span>
              <b>Emergency hotline</b>
              <div className="small muted">108 · available 24/7</div>
            </span>
          </div>
        </div>

        {/* ---------- Demo contact form ---------- */}
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="c-name">Your name</label>
            <input id="c-name" value={form.name} onChange={setField('name')} placeholder="e.g. Ravi Menon" />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
          <div className="field">
            <label htmlFor="c-email">Email</label>
            <input id="c-email" type="email" value={form.email} onChange={setField('email')} placeholder="you@example.com" />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>
          <div className="field">
            <label htmlFor="c-msg">Message</label>
            <textarea id="c-msg" value={form.message} onChange={setField('message')} placeholder="How can we help?" />
            {errors.message && <div className="error-text">{errors.message}</div>}
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            <Icon name="send" size={16} /> Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
