import React, { useEffect, useState } from 'react';
import { MdCheckCircle, MdCancel, MdInfo, MdWarning, MdClose } from 'react-icons/md';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
interface ToastProps { message: string; type?: ToastType; duration?: number; onClose?: () => void; }

const cfg = {
  success: { Icon: MdCheckCircle, color: 'var(--green)',  bar: 'var(--green)',  border: 'rgba(52,211,153,0.2)' },
  error:   { Icon: MdCancel,      color: 'var(--red)',    bar: 'var(--red)',    border: 'rgba(248,113,113,0.2)' },
  info:    { Icon: MdInfo,        color: 'var(--blue)',   bar: 'var(--blue)',   border: 'rgba(96,165,250,0.2)' },
  warning: { Icon: MdWarning,     color: 'var(--amber)',  bar: 'var(--amber)',  border: 'rgba(251,191,36,0.2)' },
};

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3500, onClose }) => {
  const [pct, setPct] = useState(100);
  const [gone, setGone] = useState(false);
  const { Icon, color, bar, border } = cfg[type];

  useEffect(() => {
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.max(0, 100 - (elapsed / duration) * 100);
      setPct(p);
      if (elapsed >= duration) { clearInterval(tick); setGone(true); onClose?.(); }
    }, 30);
    return () => clearInterval(tick);
  }, [duration, onClose]);

  if (gone) return null;
  return (
    <div className="toast-wrap" style={{ border: `1px solid ${border}` }}>
      <div className="toast-inner">
        <Icon size={18} style={{ color, flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: '0.8375rem', color: 'var(--base-100)', fontWeight: 500 }}>{message}</span>
        <button className="icon-btn" onClick={() => { setGone(true); onClose?.(); }}><MdClose size={13} /></button>
      </div>
      <div className="toast-bar" style={{ background: 'var(--base-800)' }}>
        <div style={{ height: '100%', background: bar, width: `${pct}%`, transition: 'width 30ms linear' }} />
      </div>
    </div>
  );
};