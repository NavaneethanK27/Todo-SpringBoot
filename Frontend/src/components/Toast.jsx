import React, { useEffect } from 'react';

/**
 * Custom Toast component for showing operational feedback
 * @param {string} message - Message to display
 * @param {'success'|'error'|'info'} type - Toast type (defines styling)
 * @param {Function} onClose - Action to invoke when closed or timed out
 */
export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'border-emerald-500/30 bg-emerald-950/75 text-emerald-300 shadow-emerald-950/20',
    error: 'border-rose-500/30 bg-rose-950/75 text-rose-300 shadow-rose-950/20',
    info: 'border-indigo-500/30 bg-indigo-950/75 text-indigo-300 shadow-indigo-950/20'
  };

  const icons = {
    success: (
      <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 border.5 rounded-2xl backdrop-blur-lg shadow-2xl transition-all duration-300 translate-y-0 opacity-100 ${styles[type]}`}>
      {icons[type]}
      <span className="text-sm font-medium tracking-wide leading-relaxed">{message}</span>
      <button 
        onClick={onClose} 
        className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer ml-3 shrink-0"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4 opacity-70 hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
