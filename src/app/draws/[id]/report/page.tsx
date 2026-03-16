'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { TwoDigitSummaryTable, ThreeDigitSummaryTable } from '@/components/tables/SummaryTable';
import { Draw, Purchase, DrawReport } from '@/types';
import { drawService } from '@/services/drawService';
import { purchaseService } from '@/services/purchaseService';
import { summaryService } from '@/services/summaryService';
import { formatUtils } from '@/utils/format';
import { excelExportUtils } from '@/utils/excelExport';
import {
  MdArrowBack as ArrowBack,
  MdDownload as Download,
  MdBarChart as BarChart,
  MdPeople as People,
  MdAttachMoney as Money,
  MdShoppingCart as Cart,
  MdTrendingUp as TrendingUp,
  MdStar as Star,
  MdCalendarToday as Calendar,
  MdCheckCircle as CheckCircle,
  MdCancel as XCircle,
} from 'react-icons/md';

export default function ReportPage() {
  const params = useParams();
  const drawId = params.id as string;

  const [draw, setDraw] = useState<Draw | null>(null);
  const [report, setReport] = useState<DrawReport | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => { loadData(); }, [drawId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const drawData = await drawService.getDrawById(drawId);
      setDraw(drawData);
      if (drawData) {
        const purchasesData = await purchaseService.getPurchasesByDrawId(drawId);
        setPurchases(purchasesData);
        setReport(summaryService.generateDrawReport(drawData, purchasesData));
      }
    } catch {
      setToast({ message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล', type: 'error' });
    } finally { setLoading(false); }
  };

  const handleExportReport = () => {
    try { setExporting(true); if (!report) return; excelExportUtils.exportDrawReport(report); setToast({ message: 'ส่งออกรายงานสำเร็จ', type: 'success' }); }
    catch { setToast({ message: 'เกิดข้อผิดพลาดในการส่งออก', type: 'error' }); }
    finally { setExporting(false); }
  };

  const handleExportPurchases = () => {
    try { setExporting(true); if (!draw) return; excelExportUtils.exportPurchases(draw, purchases); setToast({ message: 'ส่งออกรายการซื้อสำเร็จ', type: 'success' }); }
    catch { setToast({ message: 'เกิดข้อผิดพลาดในการส่งออก', type: 'error' }); }
    finally { setExporting(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!draw || !report) return (
    <div style={{ padding: '2rem' }}>
      <p style={{ color: 'var(--accent-red)' }}>ไม่พบข้อมูลรายงาน</p>
      <Link href="/draws"><Button variant="secondary" size="sm" style={{ marginTop: '1rem' }}><ArrowBack size={14} /> กลับ</Button></Link>
    </div>
  );

  const isOpen = draw.status === 'open';

  const topStats = [
    { icon: <Money size={20} />, label: 'ยอดรวมทั้งหมด', value: formatUtils.formatCurrency(report.totalAmount), color: '#3ecf8e', dim: 'rgba(62,207,142,0.12)' },
    { icon: <Cart size={20} />, label: 'จำนวนรายการซื้อ', value: report.purchaseCount.toString(), color: '#4f8ef7', dim: 'rgba(79,142,247,0.12)' },
    { icon: <People size={20} />, label: 'ผู้ซื้อไม่ซ้ำ', value: `${report.uniqueCustomerCount} คน`, color: '#a78bfa', dim: 'rgba(167,139,250,0.12)' },
    { icon: <BarChart size={20} />, label: 'สถานะงวด', value: formatUtils.getStatusLabel(draw.status), color: isOpen ? '#3ecf8e' : '#f56565', dim: isOpen ? 'rgba(62,207,142,0.12)' : 'rgba(245,101,101,0.12)' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }} className="animate-fadeIn">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href={`/draws/${drawId}/purchases`}>
          <Button variant="secondary" size="sm"><ArrowBack size={14} /> กลับหน้ารายการซื้อ</Button>
        </Link>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>รายงานงวด</h1>
            <span className={`badge ${isOpen ? 'badge-success' : 'badge-danger'}`}>
              {isOpen ? <CheckCircle size={10} /> : <XCircle size={10} />}
              {formatUtils.getStatusLabel(draw.status)}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={12} /> {draw.name} · {formatUtils.formatDate(draw.drawDate)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="sm" onClick={handleExportPurchases} isLoading={exporting}>
            <Download size={13} /> ส่งออกรายการ
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportReport} isLoading={exporting}>
            <Download size={13} /> ส่งออกรายงาน
          </Button>
        </div>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {topStats.map((s, i) => (
          <div key={i} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: s.dim, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: '0.75rem' }}>
              {s.icon}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }} className="num">{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <TrendingUp size={13} /> เลขยอดเงินสูงสุด
          </div>
          <div className="num" style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--accent-blue)', lineHeight: 1, marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
            {report.highestAmountNumber}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-green)' }} className="num">
            {formatUtils.formatCurrency(report.highestAmountValue)}
          </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Star size={13} /> เลขยอดนิยม
          </div>
          <div className="num" style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--accent-purple)', lineHeight: 1, marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
            {report.highestCountNumber}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-amber)' }}>
            {report.highestCountValue} คน
          </div>
        </div>
      </div>

      {/* Draw info */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          ข้อมูลงวด
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'ชื่องวด', value: draw.name },
            { label: 'วันที่งวด', value: formatUtils.formatDate(draw.drawDate) },
            { label: 'วันที่สร้าง', value: formatUtils.formatDate(draw.createdAt) },
            { label: 'เลข 2 ตัวทั้งหมด', value: '100 เลข' },
            { label: 'เลข 3 ตัวทั้งหมด', value: '1,000 เลข' },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>{item.label}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary tables */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          สรุปเลข 2 ตัว
        </h3>
        <TwoDigitSummaryTable summary={report.twoDigitSummary} />
      </div>

      <div className="card">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          สรุปเลข 3 ตัว
        </h3>
        <ThreeDigitSummaryTable summary={report.threeDigitSummary} />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
