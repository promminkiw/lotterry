'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdGridView, MdLocalActivity, MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: '/dashboard', icon: MdGridView, label: 'แดชบอร์ด' },
  { href: '/draws', icon: MdLocalActivity, label: 'จัดการงวด' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();

  return (
    <aside
      className="sidebar"
      style={{
        width: isOpen ? 220 : 64,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Logo */}
      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: isOpen ? '0 1.125rem' : '0',
        justifyContent: isOpen ? 'flex-start' : 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 'var(--r-md)',
            background: 'var(--gold)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, color: '#0d0f15',
            fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)',
            boxShadow: 'var(--shadow-gold)',
          }}>
            №
          </div>
          {isOpen && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--base-50)', whiteSpace: 'nowrap' }}>บันทึกหวย</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--base-500)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', marginTop: 1, whiteSpace: 'nowrap' }}>LOTTERY MGR</div>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={!isOpen ? label : undefined}
              className={active ? 'nav-item-active' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.55rem 0.75rem',
                justifyContent: isOpen ? 'flex-start' : 'center',
                borderRadius: 'var(--r-md)',
                textDecoration: 'none',
                color: active ? 'var(--gold)' : 'var(--base-400)',
                fontWeight: active ? 600 : 500,
                fontSize: '0.8375rem',
                transition: 'all 0.15s',
                border: active ? undefined : '1px solid transparent',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'var(--base-800)';
                  e.currentTarget.style.color = 'var(--base-100)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--base-400)';
                }
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {isOpen && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div style={{ padding: '0.625rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <button
          onClick={onToggle}
          title={isOpen ? 'ย่อเมนู' : 'ขยายเมนู'}
          style={{
            width: '100%',
            height: 36,
            padding: '0 0.75rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 'var(--r-md)',
            color: 'var(--base-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen ? 'space-between' : 'center',
            gap: '0.5rem',
            fontSize: '0.775rem',
            fontFamily: 'var(--font-body)',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--base-800)'; e.currentTarget.style.color = 'var(--base-200)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--base-500)'; }}
        >
          {isOpen && <span>ย่อเมนู</span>}
          {isOpen ? <MdChevronLeft size={16} /> : <MdChevronRight size={16} />}
        </button>
      </div>
    </aside>
  );
};