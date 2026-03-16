'use client';
import React from 'react';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { MdMenu } from 'react-icons/md';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [desktopOpen, setDesktopOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close mobile sidebar when clicking outside
  const handleOverlayClick = () => setMobileOpen(false);

  return (
    <html lang="th">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <title>ระบบบันทึกหวย</title>
      </head>
      <body>
        {isMobile ? (
          /* ── Mobile layout: top navbar + drawer ── */
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--base-950)' }}>
            {/* Top navbar */}
            <header style={{
              height: 56,
              background: 'var(--base-900)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 1rem',
              gap: '0.875rem',
              flexShrink: 0,
              position: 'sticky',
              top: 0,
              zIndex: 30,
            }}>
              <button
                onClick={() => setMobileOpen(true)}
                style={{
                  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent', border: 'none', borderRadius: 'var(--r-md)',
                  color: 'var(--base-300)', cursor: 'pointer',
                }}
              >
                <MdMenu size={22} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 'var(--r-sm)', background: 'var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0d0f15', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)',
                }}>
                  №
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--base-50)' }}>บันทึกหวย</span>
              </div>
            </header>

            {/* Drawer overlay */}
            {mobileOpen && (
              <>
                <div
                  onClick={handleOverlayClick}
                  style={{
                    position: 'fixed', inset: 0, zIndex: 40,
                    background: 'rgba(5,6,10,0.7)', backdropFilter: 'blur(2px)',
                  }}
                />
                <div style={{
                  position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
                  animation: 'slideInDrawer 0.22s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <Sidebar isOpen={true} onToggle={() => setMobileOpen(false)} />
                </div>
              </>
            )}

            <main style={{ flex: 1, overflowY: 'auto' }}>
              {children}
            </main>
          </div>
        ) : (
          /* ── Desktop layout: fixed left sidebar ── */
          <div style={{ display: 'flex', height: '100vh', background: 'var(--base-950)' }}>
            <Sidebar isOpen={desktopOpen} onToggle={() => setDesktopOpen(o => !o)} />
            <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
              {children}
            </main>
          </div>
        )}

        <style>{`
          @keyframes slideInDrawer {
            from { transform: translateX(-100%); opacity: 0.5; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>
      </body>
    </html>
  );
}