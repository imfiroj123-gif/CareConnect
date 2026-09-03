// ============================================================
// client/src/utils/validation.js
// Lightweight form validation helpers (no libraries).
// Each validator returns an error message string, or '' when valid.
//
// NOTE: This is a demo system. Validation is for UX only and is
// NOT production-grade security.
// ============================================================

export function required(value, label = 'This field') {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${label} is required`;
  }
  return '';
}

export function isEmail(value) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(String(value).trim());
}

export function emailError(value, label = 'Email') {
  const req = required(value, label);
  if (req) return req;
  if (!isEmail(value)) return `${label} must be a valid address`;
  return '';
}

/** Accepts 10-digit numbers, optionally with +91 / spaces / dashes. */
export function phoneError(value, label = 'Phone') {
  const req = required(value, label);
  if (req) return req;
  
  const digits = String(value).replace(/\D/g, '');
  const local = digits.slice(-10);
  if (local.length !== 10 || !/^[6-9]/.test(local)) {
    return `${label} must be a valid 10-digit number`;
  }
  return '';
}

export function passwordError(value, label = 'Password') {
  const req = required(value, label);
  if (req) return req;
  if (String(value).length < 6) return `${label} must be at least 6 characters`;
  return '';
}

export function numberError(value, label = 'Number', { min = null } = {}) {
  const req = required(value, label);
  if (req) return req;
  const n = Number(value);
  if (Number.isNaN(n)) return `${label} must be a number`;
  if (min !== null && n < min) return `${label} must be at least ${min}`;
  return '';
}

/**
 * Validate a whole form at once.
 * @param {Object} values   e.g. { name: '', age: 30 }
 * @param {Object} rules    e.g. { name: v => required(v,'Name'), age: ... }
 * @returns {{errors:Object, isValid:boolean}}
 */
export function validateForm(values, rules) {
  const errors = {};
  Object.entries(rules).forEach(([field, rule]) => {
    const msg = rule(values[field]);
    if (msg) errors[field] = msg;
  });
  return { errors, isValid: Object.keys(errors).length === 0 };
}
