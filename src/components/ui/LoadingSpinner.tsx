import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="full-loader">
    <div className="spinner spinner-lg" style={{ borderColor: 'var(--base-700)', borderTopColor: 'var(--gold)' }} />
    <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>กำลังโหลด...</span>
  </div>
);