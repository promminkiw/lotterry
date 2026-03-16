'use client';

import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatUtils } from '@/utils/format';
import { summaryService } from '@/services/summaryService';
import { useDraws, usePurchases } from '@/hooks/useData';
import {
  MdBarChart as BarChart3,
  MdShoppingBag as ShoppingBag,
  MdPieChart as PieChart,
  MdGroup as Group,
  MdArrowForward as ArrowForward,
  MdCalendarToday as Calendar,
  MdTrendingUp as TrendingUp,
  MdStar as Star,
} from 'react-icons/md';

export default function Dashboard() {
  const { draws, loading: drawsLoading } = useDraws();
  const openDraw = draws.find((d) => d.status === 'open');
  const { purchases, loading: purchasesLoading } = usePurchases(openDraw?.id || '');
  const loading = drawsLoading || purchasesLoading;

  if (loading) return <LoadingSpinner />;

  const totalAmount = purchases.reduce((sum, p) => sum + p.amount, 0);
  const purchaseCount = purchases.length;
  const report = openDraw ? summaryService.generateDrawReport(openDraw, purchases) : null;

  const stats = [
    {
      icon: <BarChart3 size={22} />,
      label: 'งวดที่เปิดอยู่',
      value: openDraw ? '1' : '0',
      sub: openDraw ? openDraw.name : 'ยังไม่มีงวดที่เปิด',
      color: '#4f8ef7',
      dimColor: 'rgba(79,142,247,0.12)',
    },
    {
      icon: <ShoppingBag size={22} />,
      label: 'ยอดรวม',
      value: formatUtils.formatCurrency(totalAmount),
      sub: 'งวดปัจจุบัน',
      color: '#3ecf8e',
      dimColor: 'rgba(62,207,142,0.12)',
    },
    {
      icon: <PieChart size={22} />,
      label: 'รายการซื้อ',
      value: purchaseCount.toString(),
      sub: 'รายการ',
      color: '#a78bfa',
      dimColor: 'rgba(167,139,250,0.12)',
    },
    {
      icon: <Group size={22} />,
      label: 'ผู้ซื้อไม่ซ้ำ',
      value: (report?.uniqueCustomerCount || 0).toString(),
      sub: 'คน',
      color: '#f6ad55',
      dimColor: 'rgba(246,173,85,0.12)',
    },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }} className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          แดชบอร์ด
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
          ภาพรวมข้อมูลการขายบัตรเสี่ยงโชค
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {stats.map((s, i) => (
          <div
            key={i}
            className="card card-hover"
            style={{ padding: '1.25rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                  background: s.dimColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: s.color,
                }}
              >
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '4px' }} className="num">
              {s.value}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Current Draw */}
      {openDraw && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 6px var(--accent-green)' }} />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>งวดปัจจุบัน</h3>
            <span className="badge badge-success" style={{ marginLeft: 'auto' }}>เปิดอยู่</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                ชื่องวด
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{openDraw.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                วันที่ออกรางวัล
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
                {formatUtils.formatDate(openDraw.drawDate)}
              </div>
            </div>
          </div>

          {report && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="stat-card">
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={12} /> เลขยอดเงินสูงสุด
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-blue)' }} className="num">{report.highestAmountNumber}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{formatUtils.formatCurrency(report.highestAmountValue)}</div>
              </div>
              <div className="stat-card">
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={12} /> เลขยอดนิยม
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-green)' }} className="num">{report.highestCountNumber}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{report.highestCountValue} คน</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <Link href={`/draws/${openDraw.id}/purchases`}>
              <Button variant="primary" size="sm">ดูรายการซื้อ</Button>
            </Link>
            <Link href={`/draws/${openDraw.id}/summary`}>
              <Button variant="secondary" size="sm">สรุปเลข</Button>
            </Link>
            <Link href={`/draws/${openDraw.id}/report`}>
              <Button variant="secondary" size="sm">รายงาน</Button>
            </Link>
          </div>
        </div>
      )}

      {!openDraw && (
        <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.3 }}>🎲</div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>ยังไม่มีงวดที่เปิดอยู่</p>
          <Link href="/draws">
            <Button variant="primary" size="sm">สร้างงวดใหม่</Button>
          </Link>
        </div>
      )}

      <div className="card">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1rem' }}>ลิ้งก์ด่วน</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link href="/draws">
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              จัดการงวด <ArrowForward size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
