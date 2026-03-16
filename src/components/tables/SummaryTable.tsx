'use client';
import React, { useState, useEffect } from 'react';
import { TwoDigitSummary, ThreeDigitSummary } from '@/types';
import { formatUtils } from '@/utils/format';

export const TwoDigitSummaryTable: React.FC<{ summary: TwoDigitSummary[] }> = ({ summary }) => {
  const [sort, setSort] = useState<'number' | 'amount' | 'count'>('number');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const maxAmt = Math.max(...summary.map(s => s.totalAmount), 1);

  const sorted = [...summary].sort((a, b) => {
    if (sort === 'amount') return b.totalAmount - a.totalAmount;
    if (sort === 'count')  return b.buyerCount - a.buyerCount;
    return a.number.localeCompare(b.number);
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['number','amount','count'] as const).map(s => (
          <button key={s} onClick={() => setSort(s)} style={{ padding: '0.35rem 0.7rem', borderRadius: 'var(--r-sm)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', border: '1px solid', background: sort === s ? 'var(--gold-dim)' : 'transparent', borderColor: sort === s ? 'rgba(212,168,67,0.3)' : 'rgba(255,255,255,0.08)', color: sort === s ? 'var(--gold)' : 'var(--base-400)', transition: 'all 0.15s', minHeight: '36px' }}>
            {{ number: 'ลำดับเลข', amount: 'ยอดเงินมาก', count: 'คนมาก' }[s]}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill,minmax(${isMobile ? '70px' : '88px'},1fr))`, gap: '0.5rem' }}>
        {sorted.map(item => {
          const amtPct = item.totalAmount / maxAmt;
          const isHot = amtPct > 0.6;
          return (
            <div key={item.number} style={{ background: isHot ? 'rgba(212,168,67,0.07)' : 'var(--base-850)', border: `1px solid ${isHot ? 'rgba(212,168,67,0.2)' : 'rgba(255,255,255,0.05)'}`, borderRadius: 'var(--r-md)', padding: isMobile ? '0.5rem 0.4rem' : '0.6rem 0.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${Math.max(amtPct * 100, 2)}%`, background: isHot ? 'var(--gold-dim)' : 'rgba(255,255,255,0.03)' }} />
              <div className="mono" style={{ fontSize: isMobile ? '0.95rem' : '1.05rem', fontWeight: 700, color: isHot ? 'var(--gold)' : 'var(--base-100)', position: 'relative', letterSpacing: '0.08em' }}>{item.number}</div>
              <div style={{ fontSize: '0.55rem', color: 'var(--green)', fontFamily: 'var(--font-mono)', position: 'relative', marginTop: 2 }}>{formatUtils.formatCurrency(item.totalAmount)}</div>
              <div style={{ fontSize: '0.54rem', color: 'var(--base-500)', fontFamily: 'var(--font-mono)', position: 'relative' }}>{item.buyerCount} คน</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ThreeDigitSummaryTable: React.FC<{ summary: ThreeDigitSummary[] }> = ({ summary }) => {
  const [sort, setSort] = useState<'number' | 'amount' | 'count'>('number');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const active = summary.filter(s => s.totalAmount > 0);
  const maxAmt = Math.max(...active.map(s => s.totalAmount), 1);
  const display = sort === 'number' ? summary : [...active].sort((a, b) => sort === 'amount' ? b.totalAmount - a.totalAmount : b.buyerCount - a.buyerCount);

  if (isMobile) {
    // Mobile card view
    return (
      <div>
        <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap' }}>
          {(['number','amount','count'] as const).map(s => (
            <button key={s} onClick={() => setSort(s)} style={{ padding: '0.35rem 0.7rem', borderRadius: 'var(--r-sm)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', border: '1px solid', background: sort === s ? 'var(--gold-dim)' : 'transparent', borderColor: sort === s ? 'rgba(212,168,67,0.3)' : 'rgba(255,255,255,0.08)', color: sort === s ? 'var(--gold)' : 'var(--base-400)', transition: 'all 0.15s', minHeight: '36px' }}>
              {{ number: 'ลำดับเลข', amount: 'ยอดเงินมาก', count: 'คนมาก' }[s]}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {display.map(item => {
            const pct = (item.totalAmount / maxAmt) * 100;
            const isHot = pct > 60;
            return (
              <div key={item.number} style={{ background: 'var(--base-850)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--r-md)', padding: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--base-500)', fontWeight: 600, textTransform: 'uppercase' }}>เลข</div>
                  <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: isHot ? 'var(--gold)' : item.totalAmount > 0 ? 'var(--base-100)' : 'var(--base-700)', letterSpacing: '0.1em', marginTop: '0.25rem' }}>{item.number}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--base-500)', fontWeight: 600, textTransform: 'uppercase' }}>คน/เงิน</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--base-300)', marginTop: '0.25rem' }}>
                    <span className="mono">{item.buyerCount > 0 ? item.buyerCount : '—'}</span> / <span className="mono" style={{ color: item.totalAmount > 0 ? 'var(--green)' : 'var(--base-700)' }}>{item.totalAmount > 0 ? formatUtils.formatCurrency(item.totalAmount) : '—'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop table view
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: '1rem' }}>
        {(['number','amount','count'] as const).map(s => (
          <button key={s} onClick={() => setSort(s)} style={{ padding: '0.3rem 0.75rem', borderRadius: 'var(--r-sm)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', border: '1px solid', background: sort === s ? 'var(--gold-dim)' : 'transparent', borderColor: sort === s ? 'rgba(212,168,67,0.3)' : 'rgba(255,255,255,0.08)', color: sort === s ? 'var(--gold)' : 'var(--base-400)', transition: 'all 0.15s' }}>
            {{ number: 'ลำดับเลข', amount: 'ยอดเงินมาก', count: 'คนมาก' }[s]}
          </button>
        ))}
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>เลข</th>
              <th style={{ textAlign: 'center' }}>คนซื้อ</th>
              <th>ยอดเงิน</th>
              <th style={{ width: 120 }}>สัดส่วน</th>
            </tr>
          </thead>
          <tbody>
            {display.map(item => {
              const pct = (item.totalAmount / maxAmt) * 100;
              const isHot = pct > 60;
              return (
                <tr key={item.number}>
                  <td style={{ textAlign: 'center' }}>
                    <span className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: isHot ? 'var(--gold)' : item.totalAmount > 0 ? 'var(--base-100)' : 'var(--base-700)', letterSpacing: '0.1em' }}>{item.number}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="mono" style={{ fontSize: '0.8rem', color: item.buyerCount > 0 ? 'var(--base-300)' : 'var(--base-700)' }}>{item.buyerCount > 0 ? item.buyerCount : '—'}</span>
                  </td>
                  <td>
                    <span className="mono" style={{ fontSize: '0.8rem', color: item.totalAmount > 0 ? 'var(--green)' : 'var(--base-700)', fontWeight: item.totalAmount > 0 ? 600 : 400 }}>{item.totalAmount > 0 ? formatUtils.formatCurrency(item.totalAmount) : '—'}</span>
                  </td>
                  <td>
                    <div style={{ background: 'var(--base-800)', borderRadius: 2, height: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: isHot ? 'var(--gold)' : 'var(--base-600)', borderRadius: 2 }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};