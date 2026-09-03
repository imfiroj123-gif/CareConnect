// ============================================================
// client/src/components/Modal.jsx
// Reusable modal dialog. Closes on overlay click and Escape.
// Used for add/edit forms, detail views and confirmations.
// ============================================================

import { useEffect } from 'react';
import Icon from './Icon';

export default function Modal({ open, title, onClose, children, wide = false }) {
  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  // Prevent the overlay click from closing while clicking inside the box.
  const stop = (e) => e.stopPropagation();

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className={`modal-box anim-scale-up${wide ? ' wide' : ''}`} onClick={stop}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
