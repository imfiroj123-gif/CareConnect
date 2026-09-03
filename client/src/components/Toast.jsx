// ============================================================
// client/src/components/Toast.jsx
// Lightweight toast notifications via a tiny context provider.
//
// Usage:
//   const { showToast } = useToast();
//   showToast('Patient added', 'success');
// ============================================================

import { createContext, useCallback, useContext, useState } from 'react';
import Icon from './Icon';

const ToastContext = createContext({ showToast: () => {} });

const TONE_STYLES = {
  success: ['var(--green-50)', 'var(--green-800)', 'var(--green-600)', 'check'],
  error: ['var(--red-50)', 'var(--red-600)', 'var(--red-600)', 'alert'],
  info: ['var(--blue-50)', 'var(--blue-600)', 'var(--blue-600)', 'bell'],
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, tone = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, message, tone }]);
    // Auto-dismiss after 3.2s.
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Fixed stack in the top-right corner */}
      <div style={{ position: 'fixed', top: 18, right: 18, zIndex: 200, display: 'grid', gap: 10 }}>
        {toasts.map(({ id, message, tone }) => {
          const [bg, fg, border, icon] = TONE_STYLES[tone] || TONE_STYLES.success;
          return (
            <div
              key={id}
              className="anim-fade-up"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: bg, color: fg,
                border: `1px solid ${border}44`,
                borderRadius: 12, padding: '11px 16px',
                boxShadow: 'var(--shadow-md)',
                minWidth: 220, maxWidth: 360, fontWeight: 600, fontSize: 0.88 * 16,
              }}
            >
              <Icon name={icon} size={17} />
              <span style={{ fontSize: '0.88rem' }}>{message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
