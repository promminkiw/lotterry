'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { TwoDigitSummaryTable, ThreeDigitSummaryTable } from '@/components/tables/SummaryTable';
import { Draw, Purchase } from '@/types';
import { drawService } from '@/services/drawService';
import { purchaseService } from '@/services/purchaseService';
import { summaryService } from '@/services/summaryService';
import { formatUtils } from '@/utils/format';
import { excelExportUtils } from '@/utils/excelExport';
import {
  MdArrowBack as ArrowBack,
  MdDownload as Download,
  MdDescription as FileText,
} from 'react-icons/md';

export default function SummaryPage() {
  const params = useParams();
  const drawId = params.id as string;

  const [draw, setDraw] = useState<Draw | null>(null);
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
      }
    } catch {
      setToast({ message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleExportTwoDigit = () => {
    try {
      setExporting(true);
      if (!draw) return;
      excelExportUtils.exportTwoDigitSummary(draw, summaryService.generateTwoDigitSummary(purchases));
      setToast({ message: 'ส่งออกสรุปเลข 2 ตัวสำเร็จ', type: 'success' });
    } catch {
      setToast({ message: 'เกิดข้อผิดพลาดในการส่งออก', type: 'error' });
    } finally { setExporting(false); }
  };

  const handleExportThreeDigit = () => {
    try {
      setExporting(true);
      if (!draw) return;
      excelExportUtils.exportThreeDigitSummary(draw, summaryService.generateThreeDigitSummary(purchases));
      setToast({ message: 'ส่งออกสรุปเลข 3 ตัวสำเร็จ', type: 'success' });
    } catch {
      setToast({ message: 'เกิดข้อผิดพลาดในการส่งออก', type: 'error' });
    } finally { setExporting(false); }
  };

  if (loading) return <LoadingSpinner />;

  if (!draw) return (
    <div style={{ padding: '2rem' }}>
      <p style={{ color: 'var(--accent-red)' }}>ไม่พบงวดนี้</p>
      <Link href="/draws"><Button variant="secondary" size="sm" style={{ marginTop: '1rem' }}><ArrowBack size={14} /> กลับ</Button></Link>
    </div>
  );

  const twoDigitSummary = summaryService.generateTwoDigitSummary(purchases);
  const threeDigitSummary = summaryService.generateThreeDigitSummary(purchases);

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }} className="animate-fadeIn">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href={`/draws/${drawId}/purchases`}>
          <Button variant="secondary" size="sm"><ArrowBack size={14} /> กลับหน้ารายการซื้อ</Button>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>สรุปเลข</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
            {draw.name} · {formatUtils.formatDate(draw.drawDate)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="sm" onClick={handleExportTwoDigit} isLoading={exporting}>
            <Download size={13} /> ส่งออก 2 ตัว
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportThreeDigit} isLoading={exporting}>
            <Download size={13} /> ส่งออก 3 ตัว
          </Button>
          <Link href={`/draws/${drawId}/report`}>
            <Button variant="primary" size="sm"><FileText size={13} /> ดูรายงาน</Button>
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          สรุปเลข 2 ตัว (00–99)
        </h3>
        <TwoDigitSummaryTable summary={twoDigitSummary} />
      </div>

      <div className="card">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          สรุปเลข 3 ตัว (000–999)
        </h3>
        <ThreeDigitSummaryTable summary={threeDigitSummary} />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
