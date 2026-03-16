import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string; subtitle?: string; action?: React.ReactNode;
  className?: string; style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, title, subtitle, action, className = '', style }) => (
  <div className={`panel ${className}`} style={style}>
    {(title || action) && (
      <div className="panel-header">
        <div>
          {title && <div className="panel-title">{title}</div>}
          {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--base-500)', marginTop: 3 }}>{subtitle}</div>}
        </div>
        {action}
      </div>
    )}
    <div className="panel-body">{children}</div>
  </div>
);